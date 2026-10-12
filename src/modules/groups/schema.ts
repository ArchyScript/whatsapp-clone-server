import { z } from "zod"

export const groupIdParamsSchema = {
  params: z.object({
    id: z.string().min(1)
  })
}

export const groupMemberParamsSchema = {
  params: z.object({
    id: z.string().min(1),
    userId: z.string().min(1)
  })
}

export const createGroupSchema = {
  body: z.object({
    title: z.string().min(2).max(120),
    description: z.string().max(500).optional(),
    avatarUrl: z.string().url().optional(),
    memberIds: z.array(z.string().min(1)).default([]),
    isAnnouncementsOnly: z.boolean().optional(),
    allowInfoEditsByAdmins: z.boolean().optional(),
    allowMemberAddsByAdmins: z.boolean().optional()
  })
}

export const updateGroupSchema = {
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    title: z.string().min(2).max(120).optional(),
    description: z.string().max(500).optional(),
    avatarUrl: z.string().url().optional().nullable(),
    isAnnouncementsOnly: z.boolean().optional(),
    allowInfoEditsByAdmins: z.boolean().optional(),
    allowMemberAddsByAdmins: z.boolean().optional()
  })
}

export const addMembersSchema = {
  params: z.object({
    id: z.string().min(1)
  }),
  body: z.object({
    userIds: z.array(z.string().min(1)).min(1)
  })
}

export const createInviteSchema = {
  params: z.object({
    id: z.string().min(1)
  }),
  body: z
    .object({
      expiresAt: z.string().datetime().optional(),
      revokeExisting: z.boolean().default(true)
    })
    .optional()
}

export const joinInviteSchema = {
  params: z.object({
    inviteCode: z.string().min(1)
  })
}
