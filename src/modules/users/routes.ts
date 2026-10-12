import { Router } from "express"
import { requireAuth } from "../../middleware/auth.js"
import { validate } from "../../validators/index.js"
import { getMe, patchMe, patchPrivacy, reportPlaceholder, searchUsers } from "./controller.js"
import { reportPlaceholderSchema } from "./report-schema.js"
import { searchUsersSchema, updateMeSchema, updatePrivacySchema } from "./schema.js"

export const usersRouter = Router()

usersRouter.use(requireAuth)
usersRouter.get("/me", getMe)
usersRouter.patch("/me", validate(updateMeSchema), patchMe)
usersRouter.patch("/me/privacy", validate(updatePrivacySchema), patchPrivacy)
usersRouter.get("/search", validate(searchUsersSchema), searchUsers)
usersRouter.post("/report", validate(reportPlaceholderSchema), reportPlaceholder)
