import { StatusCodes } from "http-status-codes"
import { prisma } from "../../prisma/index.js"
import { AppError, serializeConversation } from "../../utils/index.js"
import { conversationsRepository } from "./repository.js"

export const conversationsService = {
  async list(userId: string, limit: number) {
    const conversations = await conversationsRepository.listForUser(userId, limit)
    return conversations.map((conversation) => serializeConversation(conversation))
  },

  async createOrFetchDirect(userId: string, recipientUserId: string) {
    if (userId === recipientUserId) {
      throw new AppError(StatusCodes.BAD_REQUEST, "INVALID_RECIPIENT", "Cannot create a direct chat with yourself")
    }

    const recipient = await prisma.user.findUnique({ where: { id: recipientUserId } })
    if (!recipient) {
      throw new AppError(StatusCodes.NOT_FOUND, "USER_NOT_FOUND", "Recipient not found")
    }

    const blocked = await prisma.blockedUser.findFirst({
      where: {
        OR: [
          { blockerId: userId, blockedUserId: recipientUserId },
          { blockerId: recipientUserId, blockedUserId: userId }
        ]
      }
    })

    if (blocked) {
      throw new AppError(StatusCodes.FORBIDDEN, "USER_BLOCKED", "Cannot create a conversation with this user")
    }

    const existing = await conversationsRepository.findDirectConversation(userId, recipientUserId)
    if (existing) {
      return serializeConversation(existing)
    }

    const created = await conversationsRepository.createDirectConversation(userId, recipientUserId)
    return serializeConversation(created)
  },

  async get(userId: string, conversationId: string) {
    const participant = await conversationsRepository.getParticipant(conversationId, userId)
    if (!participant || participant.leftAt) {
      throw new AppError(StatusCodes.FORBIDDEN, "NOT_A_PARTICIPANT", "You are not part of this conversation")
    }

    const conversation = await conversationsRepository.getById(conversationId)
    if (!conversation) {
      throw new AppError(StatusCodes.NOT_FOUND, "CONVERSATION_NOT_FOUND", "Conversation not found")
    }

    return serializeConversation(conversation)
  },

  async mute(userId: string, conversationId: string, mutedUntil?: string | null) {
    await conversationsRepository.muteConversation(
      userId,
      conversationId,
      mutedUntil ? new Date(mutedUntil) : null
    )
    return { success: true }
  },

  async pin(userId: string, conversationId: string, pinned: boolean) {
    await conversationsRepository.pinConversation(userId, conversationId, pinned)
    return { success: true }
  },

  async remove(userId: string, conversationId: string) {
    const participant = await conversationsRepository.getParticipant(conversationId, userId)
    if (!participant) {
      throw new AppError(StatusCodes.FORBIDDEN, "NOT_A_PARTICIPANT", "You are not part of this conversation")
    }

    await conversationsRepository.archiveConversation(conversationId)
    return { success: true }
  }
}
