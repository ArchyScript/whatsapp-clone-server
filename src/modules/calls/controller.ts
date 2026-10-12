import type { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { asyncHandler } from "../../utils/index.js"
import { callsService } from "./service.js"

export const startCall = asyncHandler(async (request: Request, response: Response) => {
  const call = await callsService.start(request.auth!.userId, request.body)
  response.status(StatusCodes.CREATED).json({ call })
})

export const acceptCall = asyncHandler(async (request: Request, response: Response) => {
  const call = await callsService.accept(request.auth!.userId, request.params.id!)
  response.status(StatusCodes.OK).json({ call })
})

export const rejectCall = asyncHandler(async (request: Request, response: Response) => {
  const call = await callsService.reject(request.auth!.userId, request.params.id!)
  response.status(StatusCodes.OK).json({ call })
})

export const endCall = asyncHandler(async (request: Request, response: Response) => {
  const call = await callsService.end(request.auth!.userId, request.params.id!)
  response.status(StatusCodes.OK).json({ call })
})

export const getCallHistory = asyncHandler(async (request: Request, response: Response) => {
  const items = await callsService.history(request.auth!.userId)
  response.status(StatusCodes.OK).json({ items })
})
