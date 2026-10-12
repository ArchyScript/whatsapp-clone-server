import type { SocketServer } from "../../types/socket.js"

let socketServer: SocketServer | null = null

export const setSocketServer = (io: SocketServer) => {
  socketServer = io
}

export const getSocketServer = () => socketServer
