import { z } from "zod"

export const startCallSchema = {
  body: z.object({
    type: z.enum(["VOICE", "VIDEO"]),
    targetUserId: z.string().optional(),
    conversationId: z.string().optional()
  })
}

export const callIdParamsSchema = {
  params: z.object({
    id: z.string().min(1)
  })
}
