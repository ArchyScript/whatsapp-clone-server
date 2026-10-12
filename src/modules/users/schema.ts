import { z } from "zod"

export const updateMeSchema = {
  body: z.object({
    displayName: z.string().min(2).max(80).optional(),
    username: z.string().min(3).max(32).optional(),
    avatarUrl: z.string().url().optional().nullable(),
    about: z.string().max(160).optional()
  })
}

export const updatePrivacySchema = {
  body: z.object({
    lastSeenVisibility: z.enum(["EVERYONE", "CONTACTS", "NOBODY"]).optional(),
    profilePhotoVisibility: z.enum(["EVERYONE", "CONTACTS", "NOBODY"]).optional(),
    aboutVisibility: z.enum(["EVERYONE", "CONTACTS", "NOBODY"]).optional(),
    readReceiptsEnabled: z.boolean().optional()
  })
}

export const searchUsersSchema = {
  query: z.object({
    q: z.string().min(1)
  })
}
