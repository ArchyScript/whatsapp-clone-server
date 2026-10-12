import { z } from "zod"

export const requestOtpSchema = {
  body: z.object({
    phoneNumber: z.string().min(5),
    countryCode: z.string().min(1).optional()
  })
}

export const verifyOtpSchema = {
  body: z.object({
    phoneNumber: z.string().min(5),
    countryCode: z.string().min(1).optional(),
    otp: z.string().length(6),
    displayName: z.string().min(2).max(80).optional(),
    username: z.string().min(3).max(32).optional(),
    about: z.string().max(160).optional(),
    avatarUrl: z.string().url().optional(),
    deviceName: z.string().max(120).optional(),
    deviceId: z.string().max(120).optional()
  })
}

export const refreshTokenSchema = {
  body: z.object({
    refreshToken: z.string().min(10)
  })
}

export const logoutSchema = {
  body: z
    .object({
      refreshToken: z.string().min(10).optional()
    })
    .optional()
}
