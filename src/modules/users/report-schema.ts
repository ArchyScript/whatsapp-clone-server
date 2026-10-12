import { z } from "zod"

export const reportPlaceholderSchema = {
  body: z.object({
    targetType: z.enum(["user", "message"]),
    targetId: z.string().min(1),
    reason: z.string().min(3).max(160),
    details: z.string().max(1000).optional()
  })
}
