import fs from "node:fs"
import { createServer } from "node:http"
import { createApp } from "./app.js"
import { env, logger, uploadConfig } from "./config/index.js"
import { prisma } from "./prisma/index.js"
import { createSocketServer } from "./modules/sockets/socket-server.js"
import { registerSocketHandlers } from "./modules/sockets/register-socket-handlers.js"
import { setSocketServer } from "./modules/sockets/socket-state.js"

const bootstrap = async () => {
  fs.mkdirSync(uploadConfig.localDirAbsolute, { recursive: true })

  await prisma.$connect()

  const app = createApp()
  const httpServer = createServer(app)
  const io = await createSocketServer(httpServer)
  setSocketServer(io)
  registerSocketHandlers()

  httpServer.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "Backend server started")
  })
}

bootstrap().catch(async (error) => {
  logger.error({ error }, "Failed to start server")
  await prisma.$disconnect()
  process.exit(1)
})
