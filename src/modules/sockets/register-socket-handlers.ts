import { verifyAccessToken } from "../../utils/jwt.js"
import { socketRooms } from "../../utils/rooms.js"
import { getSocketServer } from "./socket-state.js"
import { redis, redisKeys } from "../../redis/index.js"

export const registerSocketHandlers = () => {
  const io = getSocketServer()
  if (!io) {
    throw new Error("Socket server not initialized")
  }

  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ??
        socket.handshake.headers.authorization?.toString().replace("Bearer ", "")

      if (!token) {
        return next(new Error("Unauthorized"))
      }

      const payload = verifyAccessToken(token)
      socket.data.userId = payload.userId
      socket.data.sessionId = payload.sessionId
      return next()
    } catch {
      return next(new Error("Unauthorized"))
    }
  })

  io.on("connection", (socket) => {
    const personalRoom = socketRooms.user(socket.data.userId)
    socket.join(personalRoom)
    void redis.set(redisKeys.presence(socket.data.userId), "online")
    io.emit("presence:update", {
      userId: socket.data.userId,
      isOnline: true
    })

    socket.on("conversation:join", ({ conversationId }: { conversationId: string }) => {
      socket.join(socketRooms.conversation(conversationId))
    })

    socket.on("conversation:leave", ({ conversationId }: { conversationId: string }) => {
      socket.leave(socketRooms.conversation(conversationId))
    })

    socket.on("call:join", ({ callId }: { callId: string }) => {
      socket.join(socketRooms.call(callId))
    })

    socket.on("presence:online", () => {
      void redis.set(redisKeys.presence(socket.data.userId), "online")
      io.emit("presence:update", {
        userId: socket.data.userId,
        isOnline: true
      })
    })

    socket.on("presence:offline", () => {
      void redis.del(redisKeys.presence(socket.data.userId))
      io.emit("presence:update", {
        userId: socket.data.userId,
        isOnline: false
      })
    })

    socket.on(
      "message:typing:start",
      ({ conversationId }: { conversationId: string }) => {
        socket.to(socketRooms.conversation(conversationId)).emit("message:typing", {
          conversationId,
          userId: socket.data.userId,
          isTyping: true
        })
      }
    )

    socket.on(
      "message:typing:stop",
      ({ conversationId }: { conversationId: string }) => {
        socket.to(socketRooms.conversation(conversationId)).emit("message:typing", {
          conversationId,
          userId: socket.data.userId,
          isTyping: false
        })
      }
    )

    socket.on(
      "message:delivered",
      ({ conversationId, messageId }: { conversationId: string; messageId: string }) => {
        socket.to(socketRooms.conversation(conversationId)).emit("message:delivered", {
          conversationId,
          messageId,
          userId: socket.data.userId
        })
      }
    )

    socket.on(
      "message:read",
      ({ conversationId, messageId }: { conversationId: string; messageId: string }) => {
        socket.to(socketRooms.conversation(conversationId)).emit("message:read", {
          conversationId,
          messageId,
          userId: socket.data.userId
        })
      }
    )

    socket.on("reaction:add", (payload: { conversationId: string; messageId: string; emoji: string }) => {
      socket.to(socketRooms.conversation(payload.conversationId)).emit("reaction:updated", {
        ...payload,
        userId: socket.data.userId,
        action: "add"
      })
    })

    socket.on("reaction:remove", (payload: { conversationId: string; messageId: string; emoji: string }) => {
      socket.to(socketRooms.conversation(payload.conversationId)).emit("reaction:updated", {
        ...payload,
        userId: socket.data.userId,
        action: "remove"
      })
    })

    socket.on("call:start", ({ callId }: { callId: string }) => {
      socket.join(socketRooms.call(callId))
    })

    socket.on("call:offer", ({ callId, ...payload }: { callId: string; sdp: unknown; toUserId?: string }) => {
      if (payload.toUserId) {
        io.to(socketRooms.user(payload.toUserId)).emit("call:offer", {
          callId,
          fromUserId: socket.data.userId,
          ...payload
        })
        return
      }

      socket.to(socketRooms.call(callId)).emit("call:offer", {
        callId,
        fromUserId: socket.data.userId,
        ...payload
      })
    })

    socket.on("call:answer", ({ callId, ...payload }: { callId: string; sdp: unknown; toUserId?: string }) => {
      if (payload.toUserId) {
        io.to(socketRooms.user(payload.toUserId)).emit("call:answer", {
          callId,
          fromUserId: socket.data.userId,
          ...payload
        })
        return
      }

      socket.to(socketRooms.call(callId)).emit("call:answer", {
        callId,
        fromUserId: socket.data.userId,
        ...payload
      })
    })

    socket.on("call:ice-candidate", ({ callId, ...payload }: { callId: string; candidate: unknown; toUserId?: string }) => {
      if (payload.toUserId) {
        io.to(socketRooms.user(payload.toUserId)).emit("call:ice-candidate", {
          callId,
          fromUserId: socket.data.userId,
          ...payload
        })
        return
      }

      socket.to(socketRooms.call(callId)).emit("call:ice-candidate", {
        callId,
        fromUserId: socket.data.userId,
        ...payload
      })
    })

    socket.on("call:accept", ({ callId }: { callId: string }) => {
      socket.to(socketRooms.call(callId)).emit("call:accepted", {
        callId,
        userId: socket.data.userId
      })
    })

    socket.on("call:reject", ({ callId }: { callId: string }) => {
      socket.to(socketRooms.call(callId)).emit("call:rejected", {
        callId,
        userId: socket.data.userId
      })
    })

    socket.on("call:end", ({ callId }: { callId: string }) => {
      socket.to(socketRooms.call(callId)).emit("call:ended", {
        callId,
        userId: socket.data.userId
      })
    })

    socket.on("disconnect", () => {
      void redis.del(redisKeys.presence(socket.data.userId))
      io.emit("presence:update", {
        userId: socket.data.userId,
        isOnline: false
      })
    })
  })
}
