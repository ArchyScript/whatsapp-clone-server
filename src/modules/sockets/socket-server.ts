import { createAdapter } from "@socket.io/redis-adapter"
import type { Server as HttpServer } from "node:http"
import { Server } from "socket.io"
import { env } from "../../config/env.js"
import { redis } from "../../redis/client.js"
import type { SocketServer } from "../../types/socket.js"

export const createSocketServer = async (httpServer: HttpServer): Promise<SocketServer> => {
  const io = new Server(httpServer, {
    cors: {
      origin: env.APP_ORIGIN,
      credentials: true
    }
  }) as SocketServer

  const pubClient = redis
  const subClient = redis.duplicate()
  await Promise.all([pubClient.connect(), subClient.connect()])
  io.adapter(createAdapter(pubClient, subClient))

  return io
}
