import type { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { prisma } from "../../prisma/index.js"
import { asyncHandler, serializeUser } from "../../utils/index.js"
import { authService } from "./service.js"

const getDeviceContext = (request: Request) => ({
  ipAddress: request.ip,
  userAgent: request.headers["user-agent"],
  deviceName: typeof request.body?.deviceName === "string" ? request.body.deviceName : undefined,
  deviceId: typeof request.body?.deviceId === "string" ? request.body.deviceId : undefined
})

export const requestOtp = asyncHandler(async (request: Request, response: Response) => {
  const result = await authService.requestOtp(request.body, request.ip)
  response.status(StatusCodes.OK).json(result)
})

export const verifyOtp = asyncHandler(async (request: Request, response: Response) => {
  const result = await authService.verifyOtp(request.body, getDeviceContext(request))
  response.status(StatusCodes.OK).json(result)
})

export const refresh = asyncHandler(async (request: Request, response: Response) => {
  const result = await authService.refreshToken(request.body.refreshToken, getDeviceContext(request))
  response.status(StatusCodes.OK).json(result)
})

export const logout = asyncHandler(async (request: Request, response: Response) => {
  if (!request.auth) {
    response.status(StatusCodes.UNAUTHORIZED).json({ error: { code: "UNAUTHORIZED", message: "Unauthorized" } })
    return
  }

  const result = await authService.logout(request.auth.userId, request.auth.sessionId)
  response.status(StatusCodes.OK).json(result)
})

export const me = asyncHandler(async (request: Request, response: Response) => {
  if (!request.auth) {
    response.status(StatusCodes.UNAUTHORIZED).json({ error: { code: "UNAUTHORIZED", message: "Unauthorized" } })
    return
  }

  const user = await prisma.user.findUnique({
    where: { id: request.auth.userId },
    include: { privacySettings: true }
  })

  response.status(StatusCodes.OK).json({
    user: user ? serializeUser(user) : null
  })
})
