import type { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { asyncHandler } from "../../utils/index.js"
import { contactsService } from "./service.js"

export const createContact = asyncHandler(async (request: Request, response: Response) => {
  const contact = await contactsService.create(request.auth!.userId, request.body)
  response.status(StatusCodes.CREATED).json({ contact })
})

export const importContacts = asyncHandler(async (request: Request, response: Response) => {
  const items = await contactsService.import(request.auth!.userId, request.body.contacts)
  response.status(StatusCodes.CREATED).json({ items })
})

export const getContacts = asyncHandler(async (request: Request, response: Response) => {
  const items = await contactsService.list(request.auth!.userId)
  response.status(StatusCodes.OK).json({ items })
})

export const searchContacts = asyncHandler(async (request: Request, response: Response) => {
  const items = await contactsService.search(request.auth!.userId, String(request.query.q))
  response.status(StatusCodes.OK).json({ items })
})

export const deleteContact = asyncHandler(async (request: Request, response: Response) => {
  const result = await contactsService.remove(request.auth!.userId, request.params.id!)
  response.status(StatusCodes.OK).json(result)
})

export const blockContact = asyncHandler(async (request: Request, response: Response) => {
  const result = await contactsService.block(request.auth!.userId, request.params.id!)
  response.status(StatusCodes.OK).json(result)
})

export const unblockContact = asyncHandler(async (request: Request, response: Response) => {
  const result = await contactsService.unblock(request.auth!.userId, request.params.id!)
  response.status(StatusCodes.OK).json(result)
})
