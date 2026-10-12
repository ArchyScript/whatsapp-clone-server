import { z } from "zod"

export const conversationIdParamsSchema = {
  params: z.object({
    id: z.string().min(1)
  })
}

export const createDirectConversationSchema = {
  body: z.object({
    recipientUserId: z.string().min(1)
  })
}

export const muteConversationSchema = {
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    mutedUntil: z.string().datetime().optional().nullable()
  })
}

export const pinConversationSchema = {
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    pinned: z.boolean().default(true)
  })
}

export const listConversationQuerySchema = {
  query: z.object({
    limit: z.coerce.number().optional(),
    cursor: z.string().optional()
  })
}
