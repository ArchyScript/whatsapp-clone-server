import type { Server, Socket } from "socket.io"

export interface AuthenticatedSocketData {
  userId: string
  sessionId: string
}

export type SocketServer = Server<any, any, any, AuthenticatedSocketData>
export type AuthenticatedSocket = Socket<any, any, any, AuthenticatedSocketData>
