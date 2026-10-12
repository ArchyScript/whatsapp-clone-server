import type { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { asyncHandler } from "../../utils/index.js"
import { groupsService } from "./service.js"

export const createGroup = asyncHandler(async (request: Request, response: Response) => {
  const group = await groupsService.create(request.auth!.userId, request.body)
  response.status(StatusCodes.CREATED).json({ group })
})

export const getGroup = asyncHandler(async (request: Request, response: Response) => {
  const group = await groupsService.get(request.auth!.userId, request.params.id!)
  response.status(StatusCodes.OK).json({ group })
})

export const patchGroup = asyncHandler(async (request: Request, response: Response) => {
  const group = await groupsService.update(request.auth!.userId, request.params.id!, request.body)
  response.status(StatusCodes.OK).json({ group })
})

export const addGroupMembers = asyncHandler(async (request: Request, response: Response) => {
  const group = await groupsService.addMembers(request.auth!.userId, request.params.id!, request.body.userIds)
  response.status(StatusCodes.OK).json({ group })
})

export const removeGroupMember = asyncHandler(async (request: Request, response: Response) => {
  const result = await groupsService.removeMember(request.auth!.userId, request.params.id!, request.params.userId!)
  response.status(StatusCodes.OK).json(result)
})

export const promoteGroupAdmin = asyncHandler(async (request: Request, response: Response) => {
  const result = await groupsService.promoteAdmin(request.auth!.userId, request.params.id!, request.params.userId!)
  response.status(StatusCodes.OK).json(result)
})

export const demoteGroupAdmin = asyncHandler(async (request: Request, response: Response) => {
  const result = await groupsService.demoteAdmin(request.auth!.userId, request.params.id!, request.params.userId!)
  response.status(StatusCodes.OK).json(result)
})

export const createInviteLink = asyncHandler(async (request: Request, response: Response) => {
  const invite = await groupsService.createInvite(
    request.auth!.userId,
    request.params.id!,
    request.body?.expiresAt,
    request.body?.revokeExisting
  )
  response.status(StatusCodes.CREATED).json({ invite })
})

export const joinGroupByInvite = asyncHandler(async (request: Request, response: Response) => {
  const group = await groupsService.joinByInvite(request.auth!.userId, request.params.inviteCode!)
  response.status(StatusCodes.OK).json({ group })
})

export const leaveGroup = asyncHandler(async (request: Request, response: Response) => {
  const result = await groupsService.leave(request.auth!.userId, request.params.id!)
  response.status(StatusCodes.OK).json(result)
})
