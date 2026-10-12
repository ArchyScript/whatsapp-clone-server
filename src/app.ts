import cookieParser from "cookie-parser"
import cors from "cors"
import express, { type ErrorRequestHandler } from "express"
import helmet from "helmet"
import pinoHttpModule from "pino-http"
import { env, logger, uploadConfig } from "./config/index.js"
import { authRateLimit, errorHandler, notFoundHandler, requestContext } from "./middleware/index.js"
import { authRouter } from "./modules/auth/routes.js"
import { usersRouter } from "./modules/users/routes.js"
import { contactsRouter } from "./modules/contacts/routes.js"
import { conversationsRouter } from "./modules/conversations/routes.js"
import { messagesRouter } from "./modules/messages/routes.js"
import { groupsRouter } from "./modules/groups/routes.js"
import { uploadsRouter } from "./modules/uploads/routes.js"
import { callsRouter } from "./modules/calls/routes.js"
import { socketsRouter } from "./modules/sockets/routes.js"
import { graphqlHandler } from "./modules/graphql/route.js"

export const createApp = () => {
  const app = express()
  const pinoHttp = pinoHttpModule as unknown as (options: { logger: typeof logger }) => express.RequestHandler

  app.use(
    cors({
      origin: env.APP_ORIGIN,
      credentials: true
    })
  )
  app.use(helmet())
  app.use(express.json({ limit: "5mb" }))
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(requestContext)
  app.use(
    pinoHttp({
      logger
    })
  )

  app.use(`/${uploadConfig.localDirAbsolute.split(/[\\/]/).pop()}`, express.static(uploadConfig.localDirAbsolute))

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" })
  })

  app.use(`${env.API_PREFIX}/auth`, authRateLimit, authRouter)
  app.use(`${env.API_PREFIX}/users`, usersRouter)
  app.use(`${env.API_PREFIX}/contacts`, contactsRouter)
  app.use(`${env.API_PREFIX}/conversations`, conversationsRouter)
  app.use(`${env.API_PREFIX}`, messagesRouter)
  app.use(`${env.API_PREFIX}/groups`, groupsRouter)
  app.use(`${env.API_PREFIX}/uploads`, uploadsRouter)
  app.use(`${env.API_PREFIX}/calls`, callsRouter)
  app.use(`${env.API_PREFIX}/sockets`, socketsRouter)
  app.all(env.GRAPHQL_PATH, graphqlHandler)

  app.use(notFoundHandler)
  app.use(errorHandler as unknown as ErrorRequestHandler)

  return app
}
