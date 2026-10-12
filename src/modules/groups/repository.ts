import { ConversationType, ParticipantRole } from "@prisma/client"
import { randomUUID } from "node:crypto"
import { prisma } from "../../prisma/index.js"

export const groupsRepository = {
  createGroup(ownerId: string, payload: {
    title: string
    description?: string
    avatarUrl?: string
    memberIds: string[]
    isAnnouncementsOnly?: boolean
    allowInfoEditsByAdmins?: boolean
    allowMemberAddsByAdmins?: boolean
  }) {
    const memberIds = Array.from(new Set([ownerId, ...payload.memberIds]))

    return prisma.conversation.create({
      data: {
        type: ConversationType.GROUP,
        title: payload.title,
        description: payload.description,
        avatarUrl: payload.avatarUrl,
        createdById: ownerId,
        isAnnouncementsOnly: payload.isAnnouncementsOnly ?? false,
        allowInfoEditsByAdmins: payload.allowInfoEditsByAdmins ?? true,
        allowMemberAddsByAdmins: payload.allowMemberAddsByAdmins ?? true,
        participants: {
          create: memberIds.map((memberId) => ({
            userId: memberId,
            role: memberId === ownerId ? ParticipantRole.OWNER : ParticipantRole.MEMBER,
            canSendMessages: true,
            canEditGroupInfo: memberId === ownerId,
            canAddMembers: memberId === ownerId
          }))
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

  getGroup(groupId: string) {
    return prisma.conversation.findUnique({
      where: { id: groupId },
      include: {
        participants: { include: { user: true } },
        messages: {
          include: { sender: true, attachments: true, receipts: true, reactions: true },
          orderBy: { createdAt: "desc" },
          take: 1
        },
        invites: {
          where: { status: "ACTIVE", revokedAt: null },
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    })
  },

  getParticipant(groupId: string, userId: string) {
    return prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId: groupId,
          userId
        }
      }
    })
  },

  updateGroup(groupId: string, data: Parameters<typeof prisma.conversation.update>[0]["data"]) {
    return prisma.conversation.update({
      where: { id: groupId },
      data,
      include: {
        participants: { include: { user: true } },
        messages: {
          include: { sender: true, attachments: true, receipts: true, reactions: true },
          orderBy: { createdAt: "desc" },
          take: 1
        },
        invites: {
          where: { status: "ACTIVE", revokedAt: null },
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    })
  },

  addMembers(groupId: string, userIds: string[]) {
    return prisma.conversationParticipant.createMany({
      data: userIds.map((userId) => ({
        conversationId: groupId,
        userId,
        role: ParticipantRole.MEMBER,
        canSendMessages: true,
        canEditGroupInfo: false,
        canAddMembers: false
      })),
      skipDuplicates: true
    })
  },

  removeMember(groupId: string, userId: string) {
    return prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId: groupId,
          userId
        }
      },
      data: {
        leftAt: new Date()
      }
    })
  },

  updateMemberRole(groupId: string, userId: string, role: ParticipantRole) {
    return prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId: groupId,
          userId
        }
      },
      data: {
        role,
        canEditGroupInfo: role !== ParticipantRole.MEMBER,
        canAddMembers: role !== ParticipantRole.MEMBER
      }
    })
  },

  async createInvite(groupId: string, createdById: string, expiresAt?: Date | null, revokeExisting = true) {
    if (revokeExisting) {
      await prisma.groupInvite.updateMany({
        where: { conversationId: groupId, status: "ACTIVE" },
        data: { status: "REVOKED", revokedAt: new Date() }
      })
    }

    return prisma.groupInvite.create({
      data: {
        conversationId: groupId,
        createdById,
        code: randomUUID(),
        expiresAt: expiresAt ?? null
      }
    })
  },

  getInviteByCode(code: string) {
    return prisma.groupInvite.findUnique({
      where: { code },
      include: { conversation: true }
    })
  }
}
