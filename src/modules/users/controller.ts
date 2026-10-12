import type { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { asyncHandler } from "../../utils/index.js"
import { usersService } from "./service.js"

export const getMe = asyncHandler(async (request: Request, response: Response) => {
  const user = await usersService.me(request.auth!.userId)
  response.status(StatusCodes.OK).json({ user })
})

export const patchMe = asyncHandler(async (request: Request, response: Response) => {
  const user = await usersService.updateMe(request.auth!.userId, request.body)
  response.status(StatusCodes.OK).json({ user })
})

export const patchPrivacy = asyncHandler(async (request: Request, response: Response) => {
  const user = await usersService.updatePrivacy(request.auth!.userId, request.body)
  response.status(StatusCodes.OK).json({ user })
})

export const searchUsers = asyncHandler(async (request: Request, response: Response) => {
  const users = await usersService.search(request.auth!.userId, String(request.query.q))
  response.status(StatusCodes.OK).json({ items: users })
})

export const reportPlaceholder = asyncHandler(async (request: Request, response: Response) => {
  const result = await usersService.report(request.auth!.userId, request.body)
  response.status(StatusCodes.ACCEPTED).json(result)
})
