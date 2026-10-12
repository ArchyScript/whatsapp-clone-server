import { AttachmentKind, MessageStatus } from "@prisma/client"
import { StatusCodes } from "http-status-codes"
import { prisma } from "../../prisma/index.js"
import { getSocketServer } from "../sockets/socket-state.js"
import { AppError, serializeMessage, socketRooms } from "../../utils/index.js"
import { messagesRepository } from "./repository.js"

const ensureConversationAccess = async (conversationId: string, userId: string) => {
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId
      }
    }
  })

  if (!participant || participant.leftAt) {
    throw new AppError(StatusCodes.FORBIDDEN, "NOT_A_PARTICIPANT", "You are not part of this conversation")
  }

  if (!participant.canSendMessages) {
    throw new AppError(StatusCodes.FORBIDDEN, "SEND_DISABLED", "You cannot send messages in this conversation")
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participants: {
        where: { leftAt: null }
      }
    }
  })

  if (conversation?.type === "DIRECT") {
    const otherParticipant = conversation.participants.find((entry) => entry.userId !== userId)
    if (otherParticipant) {
      const blocked = await prisma.blockedUser.findFirst({
        where: {
          OR: [
            { blockerId: userId, blockedUserId: otherParticipant.userId },
            { blockerId: otherParticipant.userId, blockedUserId: userId }
          ]
        }
      })

      if (blocked) {
        throw new AppError(StatusCodes.FORBIDDEN, "USER_BLOCKED", "Blocked users cannot interact")
      }
    }
  }

  return participant
}

const emitConversationEvent = (conversationId: string, event: string, payload: unknown) => {
  const io = getSocketServer()
  io?.to(socketRooms.conversation(conversationId)).emit(event, payload)
}

export const messagesService = {
  async list(userId: string, conversationId: string, limit: number, query?: string) {
    await ensureConversationAccess(conversationId, userId)
    const messages = await messagesRepository.listMessages(conversationId, limit, query)
    return messages.map((message) => serializeMessage(message))
  },

  async send(
    userId: string,
    conversationId: string,
    payload: {
      type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "VOICE_NOTE" | "DOCUMENT" | "CONTACT" | "LOCATION" | "CALL_LOG" | "SYSTEM"
      content?: string
      replyToMessageId?: string
      forwardedFromMessageId?: string
      attachments?: Array<{
        kind: "IMAGE" | "VIDEO" | "AUDIO" | "VOICE_NOTE" | "DOCUMENT" | "CONTACT" | "LOCATION" | "THUMBNAIL"
        url: string
        mimeType: string
        fileName: string
        fileSize: number
        extension?: string
        width?: number
        height?: number
        durationSeconds?: number
        waveform?: unknown
        thumbnailUrl?: string
        metadata?: unknown
      }>
      location?: { latitude: number; longitude: number; label?: string }
      contactPayload?: unknown
      callPayload?: unknown
    }
  ) {
    await ensureConversationAccess(conversationId, userId)
    const participants = await prisma.conversationParticipant.findMany({
      where: { conversationId, leftAt: null }
    })

    const message = await messagesRepository.createMessage({
      conversationId,
      senderId: userId,
      type: payload.type,
      status: MessageStatus.SENT,
      content: payload.content,
      replyToMessageId: payload.replyToMessageId,
      forwardedFromMessageId: payload.forwardedFromMessageId,
      locationLatitude: payload.location?.latitude,
      locationLongitude: payload.location?.longitude,
      locationLabel: payload.location?.label,
      contactPayload: payload.contactPayload,
      callPayload: payload.callPayload,
      attachments: payload.attachments?.map((attachment) => ({
        ...attachment,
        kind: attachment.kind as AttachmentKind
      }))
    })

    await messagesRepository.setConversationLastMessage(conversationId, message.id)
    await messagesRepository.createReceipts(
      message.id,
      participants.filter((participant) => participant.userId !== userId).map((participant) => participant.userId)
    )

    const complete = await messagesRepository.getMessageById(message.id)
    const serialized = serializeMessage(complete!)
    emitConversationEvent(conversationId, "message:new", serialized)
    return serialized
  },

  async edit(userId: string, messageId: string, content: string) {
    const existing = await messagesRepository.getMessageById(messageId)
    if (!existing) {
      throw new AppError(StatusCodes.NOT_FOUND, "MESSAGE_NOT_FOUND", "Message not found")
    }

    if (existing.senderId !== userId) {
      throw new AppError(StatusCodes.FORBIDDEN, "NOT_MESSAGE_OWNER", "You can only edit your own messages")
    }

    const updated = await messagesRepository.updateMessage(messageId, content)
    const serialized = serializeMessage(updated)
    emitConversationEvent(updated.conversationId, "message:updated", serialized)
    return serialized
  },

  async deleteForMe(userId: string, messageId: string) {
    const existing = await messagesRepository.getMessageById(messageId)
    if (!existing) {
      throw new AppError(StatusCodes.NOT_FOUND, "MESSAGE_NOT_FOUND", "Message not found")
    }

    await messagesRepository.deleteForUser(messageId, userId)
    return { success: true }
  },

  async deleteForEveryone(userId: string, messageId: string) {
    const existing = await messagesRepository.getMessageById(messageId)
    if (!existing) {
      throw new AppError(StatusCodes.NOT_FOUND, "MESSAGE_NOT_FOUND", "Message not found")
    }

    if (existing.senderId !== userId) {
      throw new AppError(StatusCodes.FORBIDDEN, "NOT_MESSAGE_OWNER", "You can only delete your own messages for everyone")
    }

    const deleted = await messagesRepository.deleteForEveryone(messageId)
    const serialized = serializeMessage(deleted)
    emitConversationEvent(deleted.conversationId, "message:deleted", serialized)
    return serialized
  },

  async addReaction(userId: string, messageId: string, emoji: string) {
    const message = await messagesRepository.getMessageById(messageId)
    if (!message) {
      throw new AppError(StatusCodes.NOT_FOUND, "MESSAGE_NOT_FOUND", "Message not found")
    }

    await messagesRepository.addReaction(messageId, userId, emoji)
    const updated = await messagesRepository.getMessageById(messageId)
    const serialized = serializeMessage(updated!)
    emitConversationEvent(message.conversationId, "reaction:updated", serialized)
    return serialized
  },

  async removeReaction(userId: string, messageId: string, emoji: string) {
    const message = await messagesRepository.getMessageById(messageId)
    if (!message) {
      throw new AppError(StatusCodes.NOT_FOUND, "MESSAGE_NOT_FOUND", "Message not found")
    }

    await messagesRepository.removeReaction(messageId, userId, emoji)
    const updated = await messagesRepository.getMessageById(messageId)
    const serialized = serializeMessage(updated!)
    emitConversationEvent(message.conversationId, "reaction:updated", serialized)
    return serialized
  },

  async forward(userId: string, messageId: string, conversationId: string) {
    const source = await messagesRepository.getMessageById(messageId)
    if (!source) {
      throw new AppError(StatusCodes.NOT_FOUND, "MESSAGE_NOT_FOUND", "Message not found")
    }

    const forwarded = await this.send(userId, conversationId, {
      type: source.type,
      content: source.content ?? undefined,
      forwardedFromMessageId: source.id,
      attachments: source.attachments.map((attachment) => ({
        kind: attachment.kind,
        url: attachment.url,
        mimeType: attachment.mimeType,
        fileName: attachment.fileName,
        fileSize: attachment.fileSize,
        extension: attachment.extension ?? undefined,
        width: attachment.width ?? undefined,
        height: attachment.height ?? undefined,
        durationSeconds: attachment.durationSeconds ?? undefined,
        waveform: attachment.waveform ?? undefined,
        thumbnailUrl: attachment.thumbnailUrl ?? undefined,
        metadata: attachment.metadata ?? undefined
      }))
    })

    return forwarded
  },

  async markRead(userId: string, messageId: string) {
    const message = await messagesRepository.getMessageById(messageId)
    if (!message) {
      throw new AppError(StatusCodes.NOT_FOUND, "MESSAGE_NOT_FOUND", "Message not found")
    }

    await messagesRepository.markRead(messageId, userId)
    emitConversationEvent(message.conversationId, "message:read", {
      messageId,
      userId
    })
    return { success: true }
  }
}
