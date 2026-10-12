import type { NextFunction, Request, Response } from "express"
import { ZodError } from "zod"
import { logger } from "../config/logger.js"
import { AppError } from "../utils/app-error.js"

export const notFoundHandler = (request: Request, _response: Response, next: NextFunction) => {
  next(new AppError(404, "NOT_FOUND", `Route not found: ${request.method} ${request.originalUrl}`))
}

export const errorHandler = (
  error: unknown,
  request: Request,
  response: Response,
  _next: NextFunction
) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request payload",
        details: error.flatten()
      }
    })
    return
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    })
    return
  }

  logger.error({ error, path: request.originalUrl }, "Unhandled error")
  response.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong"
    }
  })
  return
}
