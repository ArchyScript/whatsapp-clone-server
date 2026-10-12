import type { NextFunction, Request, Response } from "express"
import { AppError, verifyAccessToken } from "../utils/index.js"

export const requireAuth = (request: Request, _response: Response, next: NextFunction) => {
  const authorization = request.headers.authorization
  if (!authorization?.startsWith("Bearer ")) {
    return next(new AppError(401, "UNAUTHORIZED", "Missing bearer token"))
  }

  try {
    request.auth = verifyAccessToken(authorization.replace("Bearer ", ""))
    return next()
  } catch {
    return next(new AppError(401, "INVALID_TOKEN", "Invalid access token"))
  }
}
