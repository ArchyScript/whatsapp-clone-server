import { Router } from "express"
import { requireAuth } from "../../middleware/auth.js"
import { validate } from "../../validators/index.js"
import { acceptCall, endCall, getCallHistory, rejectCall, startCall } from "./controller.js"
import { callIdParamsSchema, startCallSchema } from "./schema.js"

export const callsRouter = Router()

callsRouter.use(requireAuth)
callsRouter.post("/start", validate(startCallSchema), startCall)
callsRouter.post("/:id/accept", validate(callIdParamsSchema), acceptCall)
callsRouter.post("/:id/reject", validate(callIdParamsSchema), rejectCall)
callsRouter.post("/:id/end", validate(callIdParamsSchema), endCall)
callsRouter.get("/history", getCallHistory)
