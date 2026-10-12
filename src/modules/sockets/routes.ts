import { Router } from "express"
import { env } from "../../config/env.js"
import { socketDocs } from "./socket-docs.js"

export const socketsRouter = Router()

socketsRouter.get("/meta", (_request, response) => {
  response.json({
    stunServers: env.STUN_SERVERS.split(","),
    turn: env.TURN_URL
      ? {
          url: env.TURN_URL,
          username: env.TURN_USERNAME,
          credential: env.TURN_CREDENTIAL
        }
      : null,
    events: socketDocs
  })
})
