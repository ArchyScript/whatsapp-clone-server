import { Router } from "express"
import { requireAuth } from "../../middleware/auth.js"
import { validate } from "../../validators/index.js"
import { addReaction, deleteMessageForEveryone, deleteMessageForMe, forwardMessage, listMessages, markMessageRead, patchMessage, removeReaction, sendMessage } from "./controller.js"
import { conversationMessagesParamsSchema, forwardMessageSchema, messageIdParamsSchema, reactionSchema, sendMessageSchema, updateMessageSchema } from "./schema.js"

export const messagesRouter = Router()

messagesRouter.use(requireAuth)
messagesRouter.get("/conversations/:conversationId/messages", validate(conversationMessagesParamsSchema), listMessages)
messagesRouter.post("/conversations/:conversationId/messages", validate(sendMessageSchema), sendMessage)
messagesRouter.patch("/:id", validate(updateMessageSchema), patchMessage)
messagesRouter.delete("/:id/for-me", validate(messageIdParamsSchema), deleteMessageForMe)
messagesRouter.delete("/:id/for-everyone", validate(messageIdParamsSchema), deleteMessageForEveryone)
messagesRouter.post("/:id/reactions", validate(reactionSchema), addReaction)
messagesRouter.delete("/:id/reactions", validate(reactionSchema), removeReaction)
messagesRouter.post("/:id/forward", validate(forwardMessageSchema), forwardMessage)
messagesRouter.post("/:id/read", validate(messageIdParamsSchema), markMessageRead)
