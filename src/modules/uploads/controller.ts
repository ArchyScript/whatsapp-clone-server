import type { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { asyncHandler } from "../../utils/index.js"
import { uploadsService } from "./service.js"

export const uploadFiles = asyncHandler(async (request: Request, response: Response) => {
  const items = await uploadsService.upload((request.files as Express.Multer.File[]) ?? [])
  response.status(StatusCodes.CREATED).json({ items })
})

export const uploadMessageAttachments = asyncHandler(async (request: Request, response: Response) => {
  const items = await uploadsService.upload((request.files as Express.Multer.File[]) ?? [])
  response.status(StatusCodes.CREATED).json({ items })
})
