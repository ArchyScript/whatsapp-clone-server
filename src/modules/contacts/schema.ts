import { z } from "zod"

export const createContactSchema = {
  body: z.object({
    contactName: z.string().min(2).max(80),
    phoneNumber: z.string().min(5),
    countryCode: z.string().min(1).optional(),
    favorite: z.boolean().optional(),
    pinned: z.boolean().optional()
  })
}

export const importContactsSchema = {
  body: z.object({
    contacts: z.array(
      z.object({
        contactName: z.string().min(2).max(80),
        phoneNumber: z.string().min(5),
        countryCode: z.string().min(1).optional()
      })
    )
  })
}

export const contactSearchSchema = {
  query: z.object({
    q: z.string().min(1)
  })
}

export const contactIdParamsSchema = {
  params: z.object({
    id: z.string().min(1)
  })
}
