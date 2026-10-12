import { CallDirection, CallStatus } from "@prisma/client"
import { prisma } from "../../prisma/index.js"

export const callsRepository = {
  createCall(data: {
    initiatedById: string
    conversationId?: string
    type: "VOICE" | "VIDEO"
    participantIds: string[]
  }) {
    return prisma.call.create({
      data: {
        initiatedById: data.initiatedById,
        conversationId: data.conversationId,
        type: data.type,
        direction: CallDirection.OUTGOING,
        status: CallStatus.INITIATED,
        participants: {
          create: data.participantIds.map((userId) => ({
            userId,
            status: userId === data.initiatedById ? CallStatus.ACCEPTED : CallStatus.RINGING,
            joinedAt: userId === data.initiatedById ? new Date() : undefined
          }))
        }
      },
      include: {
        participants: true
      }
    })
  },

  getById(callId: string) {
    return prisma.call.findUnique({
      where: { id: callId },
      include: { participants: true }
    })
  },

  updateCall(callId: string, data: Parameters<typeof prisma.call.update>[0]["data"]) {
    return prisma.call.update({
      where: { id: callId },
      data,
      include: { participants: true }
    })
  },

  updateParticipant(callId: string, userId: string, data: Parameters<typeof prisma.callParticipant.update>[0]["data"]) {
    return prisma.callParticipant.update({
      where: {
        callId_userId: {
          callId,
          userId
        }
      },
      data
    })
  },

  listHistory(userId: string) {
    return prisma.call.findMany({
      where: {
        OR: [
          { initiatedById: userId },
          { participants: { some: { userId } } }
        ]
      },
      include: {
        participants: true
      },
      orderBy: { startedAt: "desc" },
      take: 50
    })
  }
}
