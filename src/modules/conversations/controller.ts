import type { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { asyncHandler } from "../../utils/index.js"
import { conversationsService } from "./service.js"

export const listConversations = asyncHandler(async (request: Request, response: Response) => {
  const items = await conversationsService.list(request.auth!.userId, Number(request.query.limit) || 25)
  response.status(StatusCodes.OK).json({ items })
})

export const createDirectConversation = asyncHandler(async (request: Request, response: Response) => {
  const conversation = await conversationsService.createOrFetchDirect(
    request.auth!.userId,
    request.body.recipientUserId
  )
  response.status(StatusCodes.CREATED).json({ conversation })
})

export const getConversation = asyncHandler(async (request: Request, response: Response) => {
  const conversation = await conversationsService.get(request.auth!.userId, request.params.id!)
  response.status(StatusCodes.OK).json({ conversation })
})

export const muteConversation = asyncHandler(async (request: Request, response: Response) => {
  const result = await conversationsService.mute(request.auth!.userId, request.params.id!, request.body.mutedUntil)
  response.status(StatusCodes.OK).json(result)
})

export const pinConversation = asyncHandler(async (request: Request, response: Response) => {
  const result = await conversationsService.pin(request.auth!.userId, request.params.id!, request.body.pinned)
  response.status(StatusCodes.OK).json(result)
})

export const deleteConversation = asyncHandler(async (request: Request, response: Response) => {
  const result = await conversationsService.remove(request.auth!.userId, request.params.id!)
  response.status(StatusCodes.OK).json(result)
})
