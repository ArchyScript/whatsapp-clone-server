import { Router } from "express"
import { requireAuth } from "../../middleware/auth.js"
import { validate } from "../../validators/index.js"
import { createDirectConversation, deleteConversation, getConversation, listConversations, muteConversation, pinConversation } from "./controller.js"
import { conversationIdParamsSchema, createDirectConversationSchema, listConversationQuerySchema, muteConversationSchema, pinConversationSchema } from "./schema.js"

export const conversationsRouter = Router()

conversationsRouter.use(requireAuth)
conversationsRouter.get("/", validate(listConversationQuerySchema), listConversations)
conversationsRouter.post("/direct", validate(createDirectConversationSchema), createDirectConversation)
conversationsRouter.get("/:id", validate(conversationIdParamsSchema), getConversation)
conversationsRouter.patch("/:id/mute", validate(muteConversationSchema), muteConversation)
conversationsRouter.patch("/:id/pin", validate(pinConversationSchema), pinConversation)
conversationsRouter.delete("/:id", validate(conversationIdParamsSchema), deleteConversation)
