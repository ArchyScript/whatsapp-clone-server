import type { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { asyncHandler } from "../../utils/index.js"
import { messagesService } from "./service.js"

export const listMessages = asyncHandler(async (request: Request, response: Response) => {
  const items = await messagesService.list(
    request.auth!.userId,
    request.params.conversationId!,
    Number(request.query.limit) || 50,
    request.query.q ? String(request.query.q) : undefined
  )
  response.status(StatusCodes.OK).json({ items })
})

export const sendMessage = asyncHandler(async (request: Request, response: Response) => {
  const message = await messagesService.send(request.auth!.userId, request.params.conversationId!, request.body)
  response.status(StatusCodes.CREATED).json({ message })
})

export const patchMessage = asyncHandler(async (request: Request, response: Response) => {
  const message = await messagesService.edit(request.auth!.userId, request.params.id!, request.body.content)
  response.status(StatusCodes.OK).json({ message })
})

export const deleteMessageForMe = asyncHandler(async (request: Request, response: Response) => {
  const result = await messagesService.deleteForMe(request.auth!.userId, request.params.id!)
  response.status(StatusCodes.OK).json(result)
})

export const deleteMessageForEveryone = asyncHandler(async (request: Request, response: Response) => {
  const message = await messagesService.deleteForEveryone(request.auth!.userId, request.params.id!)
  response.status(StatusCodes.OK).json({ message })
})

export const addReaction = asyncHandler(async (request: Request, response: Response) => {
  const message = await messagesService.addReaction(request.auth!.userId, request.params.id!, request.body.emoji)
  response.status(StatusCodes.OK).json({ message })
})

export const removeReaction = asyncHandler(async (request: Request, response: Response) => {
  const message = await messagesService.removeReaction(request.auth!.userId, request.params.id!, request.body.emoji)
  response.status(StatusCodes.OK).json({ message })
})

export const forwardMessage = asyncHandler(async (request: Request, response: Response) => {
  const message = await messagesService.forward(request.auth!.userId, request.params.id!, request.body.conversationId)
  response.status(StatusCodes.CREATED).json({ message })
})

export const markMessageRead = asyncHandler(async (request: Request, response: Response) => {
  const result = await messagesService.markRead(request.auth!.userId, request.params.id!)
  response.status(StatusCodes.OK).json(result)
})
