import argon2 from "argon2"
import ms from "ms"
import { randomUUID } from "node:crypto"
import { StatusCodes } from "http-status-codes"
import { env } from "../../config/env.js"
import { redis, redisKeys } from "../../redis/index.js"
import { AppError, generateOtpCode, parsePhone, serializeSession, serializeUser, signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/index.js"
import { authRepository } from "./repository.js"
import type { DeviceContext } from "./types/index.js"

interface StoredOtpState {
  codeHash: string
  expiresAt: string
  resendAvailableAt: string
  attempts: number
}

const refreshTtlMs = ms(env.JWT_REFRESH_TTL as ms.StringValue)

const buildTokens = async (
  user: Awaited<ReturnType<typeof authRepository.findUserByPhoneNumber>> extends infer T ? T : never,
  deviceContext: DeviceContext
) => {
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "USER_NOT_FOUND", "User not found")
  }

  const sessionId = randomUUID()
  const payload = {
    userId: user.id,
    sessionId,
    phoneNumber: user.phoneNumber
  }

  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)
  const refreshTokenHash = await argon2.hash(refreshToken)

  const session = await authRepository.createSession({
    user: { connect: { id: user.id } },
    refreshTokenHash,
    deviceName: deviceContext.deviceName,
    deviceId: deviceContext.deviceId,
    userAgent: deviceContext.userAgent,
    ipAddress: deviceContext.ipAddress,
    expiresAt: new Date(Date.now() + refreshTtlMs)
  })

  return {
    tokens: {
      accessToken,
      refreshToken
    },
    session: serializeSession(session)
  }
}

export const authService = {
  async requestOtp(payload: { phoneNumber: string; countryCode?: string }, ipAddress?: string) {
    const parsedPhone = parsePhone(payload.phoneNumber, payload.countryCode)
    const otpKey = redisKeys.otp(parsedPhone.e164)
    const phoneRateKey = redisKeys.otpRate(parsedPhone.e164)

    const [existingOtp, phoneRequests] = await Promise.all([
      redis.get(otpKey),
      redis.incr(phoneRateKey)
    ])

    if (phoneRequests === 1) {
      await redis.expire(phoneRateKey, 60 * 60)
    }

    if (phoneRequests > env.OTP_MAX_REQUESTS_PER_HOUR) {
      throw new AppError(StatusCodes.TOO_MANY_REQUESTS, "OTP_RATE_LIMITED", "Too many OTP requests")
    }

    if (ipAddress) {
      const ipRateKey = redisKeys.authIpRate(ipAddress)
      const ipRequests = await redis.incr(ipRateKey)
      if (ipRequests === 1) {
        await redis.expire(ipRateKey, 60 * 60)
      }

      if (ipRequests > env.OTP_MAX_REQUESTS_PER_HOUR * 2) {
        throw new AppError(StatusCodes.TOO_MANY_REQUESTS, "OTP_RATE_LIMITED", "Too many OTP requests from this IP")
      }
    }

    if (existingOtp) {
      const currentState = JSON.parse(existingOtp) as StoredOtpState
      const resendAvailableAt = new Date(currentState.resendAvailableAt)
      if (resendAvailableAt.getTime() > Date.now()) {
        throw new AppError(
          StatusCodes.TOO_MANY_REQUESTS,
          "OTP_RESEND_COOLDOWN",
          "Please wait before requesting another OTP",
          {
            resendAvailableAt
          }
        )
      }
    }

    const otpCode = generateOtpCode()
    const state: StoredOtpState = {
      codeHash: await argon2.hash(otpCode),
      expiresAt: new Date(Date.now() + env.OTP_EXPIRES_MINUTES * 60_000).toISOString(),
      resendAvailableAt: new Date(Date.now() + env.OTP_RESEND_COOLDOWN_SECONDS * 1000).toISOString(),
      attempts: 0
    }

    await redis.set(otpKey, JSON.stringify(state), "EX", env.OTP_EXPIRES_MINUTES * 60)
    await authRepository.recordAudit(null, "AUTH_OTP_REQUESTED", "OTP", parsedPhone.e164, {
      phoneNumber: parsedPhone.e164
    })

    return {
      phoneNumber: parsedPhone.e164,
      expiresInSeconds: env.OTP_EXPIRES_MINUTES * 60,
      resendAvailableInSeconds: env.OTP_RESEND_COOLDOWN_SECONDS,
      devOtpCode: env.NODE_ENV === "development" ? otpCode : undefined
    }
  },

  async verifyOtp(
    payload: {
      phoneNumber: string
      countryCode?: string
      otp: string
      displayName?: string
      username?: string
      about?: string
      avatarUrl?: string
    },
    deviceContext: DeviceContext
  ) {
    const parsedPhone = parsePhone(payload.phoneNumber, payload.countryCode)
    const otpKey = redisKeys.otp(parsedPhone.e164)
    const rawState = await redis.get(otpKey)

    if (!rawState) {
      throw new AppError(StatusCodes.BAD_REQUEST, "OTP_EXPIRED", "OTP has expired or was not requested")
    }

    const state = JSON.parse(rawState) as StoredOtpState
    if (state.attempts >= env.OTP_MAX_ATTEMPTS) {
      throw new AppError(StatusCodes.TOO_MANY_REQUESTS, "OTP_ATTEMPTS_EXCEEDED", "OTP attempts exceeded")
    }

    const matches = await argon2.verify(state.codeHash, payload.otp)
    if (!matches) {
      state.attempts += 1
      await redis.set(otpKey, JSON.stringify(state), "EX", env.OTP_EXPIRES_MINUTES * 60)
      throw new AppError(StatusCodes.BAD_REQUEST, "INVALID_OTP", "Invalid OTP code")
    }

    await redis.del(otpKey)

    let user = await authRepository.findUserByPhoneNumber(parsedPhone.e164)
    if (!user) {
      if (!payload.displayName) {
        throw new AppError(StatusCodes.BAD_REQUEST, "DISPLAY_NAME_REQUIRED", "Display name is required for new users")
      }

      user = await authRepository.createUser({
        phoneNumber: parsedPhone.e164,
        countryCode: parsedPhone.countryCode,
        displayName: payload.displayName,
        username: payload.username,
        avatarUrl: payload.avatarUrl,
        about: payload.about
      })
      await authRepository.ensurePrivacyForUser(user)
      user = await authRepository.findUserByPhoneNumber(parsedPhone.e164)
      if (!user) {
        throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "USER_CREATE_FAILED", "Unable to create user")
      }
    } else {
      user = await authRepository.updateUser(user.id, {
        lastSeenAt: new Date(),
        isOnline: true
      })
    }

    await authRepository.recordAudit(user?.id ?? null, "AUTH_OTP_VERIFIED", "User", user?.id, {
      phoneNumber: parsedPhone.e164
    })

    const auth = await buildTokens(user, deviceContext)

    return {
      user: serializeUser(user),
      ...auth
    }
  },

  async refreshToken(refreshToken: string, deviceContext: DeviceContext) {
    const payload = verifyRefreshToken(refreshToken)
    const session = await authRepository.findSessionById(payload.sessionId)

    if (!session || session.revokedAt || session.expiresAt.getTime() < Date.now()) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "SESSION_INVALID", "Session has expired")
    }

    const matches = await argon2.verify(session.refreshTokenHash, refreshToken)
    if (!matches) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "SESSION_INVALID", "Refresh token mismatch")
    }

    const user = await authRepository.findUserByPhoneNumber(payload.phoneNumber)
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "USER_NOT_FOUND", "User not found")
    }

    await authRepository.revokeSession(session.id)
    return {
      user: serializeUser(user),
      ...(await buildTokens(user, deviceContext))
    }
  },

  async logout(userId: string, sessionId: string) {
    await authRepository.revokeSession(sessionId)
    await authRepository.recordAudit(userId, "AUTH_LOGOUT", "Session", sessionId)
    return { success: true }
  },
}
