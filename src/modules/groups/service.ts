import { ConversationType, ParticipantRole } from "@prisma/client"
import { StatusCodes } from "http-status-codes"
import { AppError, serializeConversation } from "../../utils/index.js"
import { groupsRepository } from "./repository.js"

const requireAdmin = async (groupId: string, userId: string) => {
  const participant = await groupsRepository.getParticipant(groupId, userId)
  if (!participant || participant.leftAt) {
    throw new AppError(StatusCodes.FORBIDDEN, "NOT_A_MEMBER", "You are not a member of this group")
  }

  if (participant.role !== ParticipantRole.ADMIN && participant.role !== ParticipantRole.OWNER) {
    throw new AppError(StatusCodes.FORBIDDEN, "ADMIN_REQUIRED", "Admin privileges required")
  }

  return participant
}

export const groupsService = {
  async create(userId: string, payload: {
    title: string
    description?: string
    avatarUrl?: string
    memberIds: string[]
    isAnnouncementsOnly?: boolean
    allowInfoEditsByAdmins?: boolean
    allowMemberAddsByAdmins?: boolean
  }) {
    const group = await groupsRepository.createGroup(userId, payload)
    return serializeConversation(group)
  },

  async get(userId: string, groupId: string) {
    const participant = await groupsRepository.getParticipant(groupId, userId)
    if (!participant || participant.leftAt) {
      throw new AppError(StatusCodes.FORBIDDEN, "NOT_A_MEMBER", "You are not a member of this group")
    }

    const group = await groupsRepository.getGroup(groupId)
    if (!group || group.type !== ConversationType.GROUP) {
      throw new AppError(StatusCodes.NOT_FOUND, "GROUP_NOT_FOUND", "Group not found")
    }

    return serializeConversation(group)
  },

  async update(userId: string, groupId: string, payload: {
    title?: string
    description?: string
    avatarUrl?: string | null
    isAnnouncementsOnly?: boolean
    allowInfoEditsByAdmins?: boolean
    allowMemberAddsByAdmins?: boolean
  }) {
    await requireAdmin(groupId, userId)
    const group = await groupsRepository.updateGroup(groupId, payload)
    return serializeConversation(group)
  },

  async addMembers(userId: string, groupId: string, userIds: string[]) {
    await requireAdmin(groupId, userId)
    await groupsRepository.addMembers(groupId, userIds)
    return this.get(userId, groupId)
  },

  async removeMember(userId: string, groupId: string, memberUserId: string) {
    await requireAdmin(groupId, userId)
    await groupsRepository.removeMember(groupId, memberUserId)
    return { success: true }
  },

  async promoteAdmin(userId: string, groupId: string, memberUserId: string) {
    await requireAdmin(groupId, userId)
    await groupsRepository.updateMemberRole(groupId, memberUserId, ParticipantRole.ADMIN)
    return { success: true }
  },

  async demoteAdmin(userId: string, groupId: string, memberUserId: string) {
    await requireAdmin(groupId, userId)
    await groupsRepository.updateMemberRole(groupId, memberUserId, ParticipantRole.MEMBER)
    return { success: true }
  },

  async createInvite(userId: string, groupId: string, expiresAt?: string, revokeExisting = true) {
    await requireAdmin(groupId, userId)
    const invite = await groupsRepository.createInvite(
      groupId,
      userId,
      expiresAt ? new Date(expiresAt) : null,
      revokeExisting
    )
    return invite
  },

  async joinByInvite(userId: string, inviteCode: string) {
    const invite = await groupsRepository.getInviteByCode(inviteCode)
    if (!invite || invite.status !== "ACTIVE" || invite.revokedAt) {
      throw new AppError(StatusCodes.NOT_FOUND, "INVITE_NOT_FOUND", "Invite link is invalid")
    }

    if (invite.expiresAt && invite.expiresAt.getTime() < Date.now()) {
      throw new AppError(StatusCodes.BAD_REQUEST, "INVITE_EXPIRED", "Invite link expired")
    }

    await groupsRepository.addMembers(invite.conversationId, [userId])
    return this.get(userId, invite.conversationId)
  },

  async leave(userId: string, groupId: string) {
    await groupsRepository.removeMember(groupId, userId)
    return { success: true }
  }
}
