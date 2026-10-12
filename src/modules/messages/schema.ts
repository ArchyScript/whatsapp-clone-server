import { z } from "zod"

const attachmentSchema = z.object({
  kind: z.enum(["IMAGE", "VIDEO", "AUDIO", "VOICE_NOTE", "DOCUMENT", "CONTACT", "LOCATION", "THUMBNAIL"]),
  url: z.string().url(),
  mimeType: z.string().min(1),
  fileName: z.string().min(1),
  fileSize: z.number().int().positive(),
  extension: z.string().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
  durationSeconds: z.number().int().optional(),
  waveform: z.unknown().optional(),
  thumbnailUrl: z.string().url().optional(),
  metadata: z.unknown().optional()
})

export const conversationMessagesParamsSchema = {
  params: z.object({
    conversationId: z.string().min(1)
  }),
  query: z.object({
    limit: z.coerce.number().optional(),
    cursor: z.string().optional(),
    q: z.string().optional()
  })
}

export const sendMessageSchema = {
  params: z.object({
    conversationId: z.string().min(1)
  }),
  body: z.object({
    type: z.enum(["TEXT", "IMAGE", "VIDEO", "AUDIO", "VOICE_NOTE", "DOCUMENT", "CONTACT", "LOCATION", "CALL_LOG", "SYSTEM"]),
    content: z.string().optional(),
    replyToMessageId: z.string().optional(),
    forwardedFromMessageId: z.string().optional(),
    attachments: z.array(attachmentSchema).optional(),
    location: z
      .object({
        latitude: z.number(),
        longitude: z.number(),
        label: z.string().optional()
      })
      .optional(),
    contactPayload: z.unknown().optional(),
    callPayload: z.unknown().optional()
  })
}

export const messageIdParamsSchema = {
  params: z.object({
    id: z.string().min(1)
  })
}

export const updateMessageSchema = {
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    content: z.string().min(1)
  })
}

export const reactionSchema = {
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    emoji: z.string().min(1).max(10)
  })
}

export const forwardMessageSchema = {
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    conversationId: z.string().min(1)
  })
}
