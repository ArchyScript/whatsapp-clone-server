import { AttachmentKind, MessageStatus, ReceiptStatus } from "@prisma/client"
import { prisma } from "../../prisma/index.js"

export const messagesRepository = {
  listMessages(conversationId: string, limit: number, query?: string) {
    return prisma.message.findMany({
      where: {
        conversationId,
        ...(query
          ? {
              content: {
                contains: query,
                mode: "insensitive"
              }
            }
          : {})
      },
      include: {
        sender: true,
        attachments: true,
        receipts: true,
        reactions: { include: { user: true } }
      },
      orderBy: { createdAt: "desc" },
      take: limit
    })
  },

  getMessageById(id: string) {
    return prisma.message.findUnique({
      where: { id },
      include: {
        sender: true,
        attachments: true,
        receipts: true,
        reactions: { include: { user: true } }
      }
    })
  },

  createMessage(data: {
    conversationId: string
    senderId: string
    type: Parameters<typeof prisma.message.create>[0]["data"]["type"]
    status?: MessageStatus
    content?: string
    replyToMessageId?: string
    forwardedFromMessageId?: string
    locationLatitude?: number
    locationLongitude?: number
    locationLabel?: string
    contactPayload?: unknown
    callPayload?: unknown
    attachments?: Array<{
      kind: AttachmentKind
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
  }) {
    return prisma.message.create({
      data: {
        conversationId: data.conversationId,
        senderId: data.senderId,
        type: data.type,
        status: data.status,
        content: data.content,
        replyToMessageId: data.replyToMessageId,
        forwardedFromMessageId: data.forwardedFromMessageId,
        locationLatitude: data.locationLatitude,
        locationLongitude: data.locationLongitude,
        locationLabel: data.locationLabel,
        contactPayload: data.contactPayload as never,
        callPayload: data.callPayload as never,
        attachments: data.attachments
          ? {
              create: data.attachments.map((attachment) => ({
                uploadedById: data.senderId,
                kind: attachment.kind,
                url: attachment.url,
                mimeType: attachment.mimeType,
                fileName: attachment.fileName,
                fileSize: attachment.fileSize,
                extension: attachment.extension,
                width: attachment.width,
                height: attachment.height,
                durationSeconds: attachment.durationSeconds,
                waveform: attachment.waveform as never,
                thumbnailUrl: attachment.thumbnailUrl,
                metadata: attachment.metadata as never
              }))
            }
          : undefined
      },
      include: {
        sender: true,
        attachments: true,
        receipts: true,
        reactions: { include: { user: true } }
      }
    })
  },

  setConversationLastMessage(conversationId: string, messageId: string) {
    return prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageId: messageId
      }
    })
  },

  createReceipts(messageId: string, userIds: string[]) {
    return prisma.messageReceipt.createMany({
      data: userIds.map((userId) => ({
        messageId,
        userId,
        status: ReceiptStatus.DELIVERED
      })),
      skipDuplicates: true
    })
  },

  markRead(messageId: string, userId: string) {
    return prisma.messageReceipt.upsert({
      where: {
        messageId_userId: {
          messageId,
          userId
        }
      },
      create: {
        messageId,
        userId,
        status: ReceiptStatus.READ
      },
      update: {
        status: ReceiptStatus.READ
      }
    })
  },

  updateMessage(id: string, content: string) {
    return prisma.message.update({
      where: { id },
      data: {
        content,
        editedAt: new Date()
      },
      include: {
        sender: true,
        attachments: true,
        receipts: true,
        reactions: { include: { user: true } }
      }
    })
  },

  deleteForEveryone(id: string) {
    return prisma.message.update({
      where: { id },
      data: {
        status: MessageStatus.DELETED,
        deletedForEveryoneAt: new Date(),
        content: null
      },
      include: {
        sender: true,
        attachments: true,
        receipts: true,
        reactions: { include: { user: true } }
      }
    })
  },

  deleteForUser(messageId: string, userId: string) {
    return prisma.deletedMessage.upsert({
      where: {
        messageId_userId: {
          messageId,
          userId
        }
      },
      create: {
        messageId,
        userId
      },
      update: {}
    })
  },

  addReaction(messageId: string, userId: string, emoji: string) {
    return prisma.messageReaction.upsert({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId,
          emoji
        }
      },
      create: {
        messageId,
        userId,
        emoji
      },
      update: {},
      include: {
        user: true
      }
    })
  },

  removeReaction(messageId: string, userId: string, emoji: string) {
    return prisma.messageReaction.deleteMany({
      where: { messageId, userId, emoji }
    })
  }
}
