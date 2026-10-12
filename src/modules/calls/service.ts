import { CallStatus, MessageType } from "@prisma/client"
import { StatusCodes } from "http-status-codes"
import { prisma } from "../../prisma/index.js"
import { getSocketServer } from "../sockets/socket-state.js"
import { socketRooms, AppError } from "../../utils/index.js"
import { callsRepository } from "./repository.js"
import { conversationsService } from "../conversations/service.js"
import { messagesService } from "../messages/service.js"

const emitToUser = (userId: string, event: string, payload: unknown) => {
  getSocketServer()?.to(socketRooms.user(userId)).emit(event, payload)
}

export const callsService = {
  async start(userId: string, payload: { type: "VOICE" | "VIDEO"; targetUserId?: string; conversationId?: string }) {
    let conversationId = payload.conversationId
    let participantIds: string[] = [userId]

    if (payload.targetUserId) {
      const conversation = await conversationsService.createOrFetchDirect(userId, payload.targetUserId)
      conversationId = conversation.id
      participantIds = conversation.participants.map((participant) => participant.userId)
    } else if (conversationId) {
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { participants: { where: { leftAt: null } } }
      })
      if (!conversation) {
        throw new AppError(StatusCodes.NOT_FOUND, "CONVERSATION_NOT_FOUND", "Conversation not found")
      }

      if (conversation.type === "DIRECT") {
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
            throw new AppError(StatusCodes.FORBIDDEN, "USER_BLOCKED", "Blocked users cannot call each other")
          }
        }
      }

      const participants = await prisma.conversationParticipant.findMany({
        where: { conversationId, leftAt: null }
      })
      participantIds = participants.map((participant) => participant.userId)
    } else {
      throw new AppError(StatusCodes.BAD_REQUEST, "CALL_TARGET_REQUIRED", "targetUserId or conversationId is required")
    }

    const call = await callsRepository.createCall({
      initiatedById: userId,
      conversationId,
      type: payload.type,
      participantIds
    })

    for (const participantId of participantIds.filter((id) => id !== userId)) {
      emitToUser(participantId, "call:incoming", call)
      emitToUser(participantId, "call:ringing", call)
    }

    return call
  },

  async accept(userId: string, callId: string) {
    const call = await callsRepository.getById(callId)
    if (!call) {
      throw new AppError(StatusCodes.NOT_FOUND, "CALL_NOT_FOUND", "Call not found")
    }

    await callsRepository.updateParticipant(callId, userId, {
      status: CallStatus.ACCEPTED,
      joinedAt: new Date()
    })
    const updated = await callsRepository.updateCall(callId, {
      status: CallStatus.ACCEPTED,
      answeredAt: new Date()
    })
    emitToUser(call.initiatedById, "call:accepted", updated)
    return updated
  },

  async reject(userId: string, callId: string) {
    const call = await callsRepository.getById(callId)
    if (!call) {
      throw new AppError(StatusCodes.NOT_FOUND, "CALL_NOT_FOUND", "Call not found")
    }

    await callsRepository.updateParticipant(callId, userId, {
      status: CallStatus.REJECTED,
      leftAt: new Date()
    })
    const updated = await callsRepository.updateCall(callId, {
      status: CallStatus.REJECTED,
      endedAt: new Date()
    })
    emitToUser(call.initiatedById, "call:rejected", updated)
    await this.logCall(updated.id)
    return updated
  },

  async end(_userId: string, callId: string) {
    const call = await callsRepository.getById(callId)
    if (!call) {
      throw new AppError(StatusCodes.NOT_FOUND, "CALL_NOT_FOUND", "Call not found")
    }

    const endedAt = new Date()
    const answeredAt = call.answeredAt ?? call.startedAt
    const durationSeconds = Math.max(0, Math.floor((endedAt.getTime() - answeredAt.getTime()) / 1000))
    const updated = await callsRepository.updateCall(callId, {
      status: CallStatus.ENDED,
      endedAt,
      durationSeconds
    })
    for (const participant of updated.participants) {
      emitToUser(participant.userId, "call:ended", updated)
    }
    await this.logCall(updated.id)
    return updated
  },

  async history(userId: string) {
    return callsRepository.listHistory(userId)
  },

  async logCall(callId: string) {
    const call = await callsRepository.getById(callId)
    if (!call?.conversationId) return

    await messagesService.send(call.initiatedById, call.conversationId, {
      type: MessageType.CALL_LOG,
      callPayload: {
        callId: call.id,
        type: call.type,
        status: call.status,
        durationSeconds: call.durationSeconds,
        startedAt: call.startedAt,
        endedAt: call.endedAt
      }
    })
  }
}
