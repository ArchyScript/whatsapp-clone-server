import { Router } from "express"
import { requireAuth } from "../../middleware/auth.js"
import { validate } from "../../validators/index.js"
import { blockContact, createContact, deleteContact, getContacts, importContacts, searchContacts, unblockContact } from "./controller.js"
import { contactIdParamsSchema, contactSearchSchema, createContactSchema, importContactsSchema } from "./schema.js"

export const contactsRouter = Router()

contactsRouter.use(requireAuth)
contactsRouter.post("/", validate(createContactSchema), createContact)
contactsRouter.post("/import", validate(importContactsSchema), importContacts)
contactsRouter.get("/", getContacts)
contactsRouter.get("/search", validate(contactSearchSchema), searchContacts)
contactsRouter.delete("/:id", validate(contactIdParamsSchema), deleteContact)
contactsRouter.post("/:id/block", validate(contactIdParamsSchema), blockContact)
contactsRouter.delete("/:id/block", validate(contactIdParamsSchema), unblockContact)
