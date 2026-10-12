import { z } from "zod"

export const uploadQuerySchema = {
  query: z.object({
    kind: z.enum(["IMAGE", "VIDEO", "AUDIO", "VOICE_NOTE", "DOCUMENT"]).optional()
  })
}
