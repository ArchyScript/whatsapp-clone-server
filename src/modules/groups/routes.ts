import { Router } from "express"
import { requireAuth } from "../../middleware/auth.js"
import { validate } from "../../validators/index.js"
import { addGroupMembers, createGroup, createInviteLink, demoteGroupAdmin, getGroup, joinGroupByInvite, leaveGroup, patchGroup, promoteGroupAdmin, removeGroupMember } from "./controller.js"
import { addMembersSchema, createGroupSchema, createInviteSchema, groupIdParamsSchema, groupMemberParamsSchema, joinInviteSchema, updateGroupSchema } from "./schema.js"

export const groupsRouter = Router()

groupsRouter.use(requireAuth)
groupsRouter.post("/", validate(createGroupSchema), createGroup)
groupsRouter.get("/:id", validate(groupIdParamsSchema), getGroup)
groupsRouter.patch("/:id", validate(updateGroupSchema), patchGroup)
groupsRouter.post("/:id/members", validate(addMembersSchema), addGroupMembers)
groupsRouter.delete("/:id/members/:userId", validate(groupMemberParamsSchema), removeGroupMember)
groupsRouter.post("/:id/admins/:userId", validate(groupMemberParamsSchema), promoteGroupAdmin)
groupsRouter.delete("/:id/admins/:userId", validate(groupMemberParamsSchema), demoteGroupAdmin)
groupsRouter.post("/:id/invite-link", validate(createInviteSchema), createInviteLink)
groupsRouter.post("/join/:inviteCode", validate(joinInviteSchema), joinGroupByInvite)
groupsRouter.post("/:id/leave", validate(groupIdParamsSchema), leaveGroup)
