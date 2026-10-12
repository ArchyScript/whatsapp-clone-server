import { ConversationType, ParticipantRole } from "@prisma/client"
import { prisma } from "../../prisma/index.js"

export const conversationsRepository = {
  async findDirectConversation(userId: string, recipientUserId: string) {
    const conversation = await prisma.conversation.findFirst({
      where: {
        type: ConversationType.DIRECT,
        participants: {
          some: { userId }
        },
        AND: [
          {
            participants: {
              some: { userId: recipientUserId }
            }
          }
        ]
      },
      include: {
        participants: { include: { user: true } },
        messages: {
          include: { sender: true, attachments: true, receipts: true, reactions: true },
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    })

    if (conversation && conversation.participants.length === 2) {
      return conversation
    }

    return null
  },

  createDirectConversation(creatorId: string, recipientUserId: string) {
    return prisma.conversation.create({
      data: {
        type: ConversationType.DIRECT,
        createdById: creatorId,
        participants: {
          create: [
            {
              userId: creatorId,
              role: ParticipantRole.OWNER,
              canAddMembers: false,
              canEditGroupInfo: false
            },
            {
              userId: recipientUserId,
              role: ParticipantRole.MEMBER,
              canAddMembers: false,
              canEditGroupInfo: false
            }
          ]
        }
      },
      include: {
        participants: { include: { user: true } },
        messages: {
          include: { sender: true, attachments: true, receipts: true, reactions: true },
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    })
  },

  listForUser(userId: string, limit: number) {
    return prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId,
            leftAt: null
          }
        }
      },
      include: {
        participants: { include: { user: true } },
        messages: {
          include: { sender: true, attachments: true, receipts: true, reactions: true },
          orderBy: { createdAt: "desc" },
          take: 1
        }
      },
      orderBy: { updatedAt: "desc" },
      take: limit
    })
  },

  getById(conversationId: string) {
    return prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: { include: { user: true } },
        messages: {
          include: { sender: true, attachments: true, receipts: true, reactions: true },
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    })
  },

  getParticipant(conversationId: string, userId: string) {
    return prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId
        }
      }
    })
  },

  muteConversation(userId: string, conversationId: string, mutedUntil?: Date | null) {
    return prisma.mutedConversation.upsert({
      where: {
        userId_conversationId: {
          userId,
          conversationId
        }
      },
      create: {
        userId,
        conversationId,
        mutedUntil: mutedUntil ?? null
      },
      update: {
        mutedUntil: mutedUntil ?? null
      }
    })
  },

  pinConversation(userId: string, conversationId: string, pinned: boolean) {
    if (pinned) {
      return prisma.pinnedConversation.upsert({
        where: {
          userId_conversationId: {
            userId,
            conversationId
          }
        },
        create: {
          userId,
          conversationId
        },
        update: {}
      })
    }

    return prisma.pinnedConversation.deleteMany({
      where: {
        userId,
        conversationId
      }
    })
  },

  archiveConversation(conversationId: string) {
    return prisma.conversation.update({
      where: { id: conversationId },
      data: { isArchived: true }
    })
  }
}
