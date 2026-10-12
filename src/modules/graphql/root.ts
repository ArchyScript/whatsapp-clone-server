import type { JwtUserPayload } from "../../utils/jwt.js"
import { env } from "../../config/env.js"
import { authService } from "../auth/service.js"
import { usersService } from "../users/service.js"
import { contactsService } from "../contacts/service.js"
import { conversationsService } from "../conversations/service.js"
import { messagesService } from "../messages/service.js"
import { groupsService } from "../groups/service.js"
import { callsService } from "../calls/service.js"
import { socketDocs } from "../sockets/socket-docs.js"

export interface GraphqlContext extends Record<string, unknown> {
  auth: JwtUserPayload | null
  ipAddress?: string
  userAgent?: string
}

const requireAuth = (context: GraphqlContext) => {
  if (!context.auth) {
    throw new Error("Unauthorized")
  }

  return context.auth
}

export const graphqlRoot = {
  health: () => "ok",
  me: async (_args: unknown, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return usersService.me(auth.userId)
  },
  usersSearch: async ({ q }: { q: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return usersService.search(auth.userId, q)
  },
  contacts: async (_args: unknown, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return contactsService.list(auth.userId)
  },
  contactsSearch: async ({ q }: { q: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return contactsService.search(auth.userId, q)
  },
  conversations: async ({ limit }: { limit?: number }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return conversationsService.list(auth.userId, limit ?? 25)
  },
  conversation: async ({ id }: { id: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return conversationsService.get(auth.userId, id)
  },
  group: async ({ id }: { id: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return groupsService.get(auth.userId, id)
  },
  messages: async (
    { conversationId, limit, q }: { conversationId: string; limit?: number; q?: string },
    context: GraphqlContext
  ) => {
    const auth = requireAuth(context)
    return messagesService.list(auth.userId, conversationId, limit ?? 50, q)
  },
  callHistory: async (_args: unknown, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return callsService.history(auth.userId)
  },
  socketMeta: () => ({
    stunServers: env.STUN_SERVERS.split(","),
    turnUrl: env.TURN_URL ?? null,
    turnUsername: env.TURN_USERNAME ?? null,
    turnCredential: env.TURN_CREDENTIAL ?? null,
    clientEmits: socketDocs.clientEmits,
    serverEmits: socketDocs.serverEmits
  }),
  requestOtp: async (
    { phoneNumber, countryCode }: { phoneNumber: string; countryCode?: string },
    context: GraphqlContext
  ) => authService.requestOtp({ phoneNumber, countryCode }, context.ipAddress),
  verifyOtp: async (
    { input }: { input: { phoneNumber: string; countryCode?: string; otp: string; displayName?: string; username?: string; about?: string; avatarUrl?: string; deviceName?: string; deviceId?: string } },
    context: GraphqlContext
  ) =>
    authService.verifyOtp(input, {
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      deviceName: input.deviceName,
      deviceId: input.deviceId
    }),
  refresh: async ({ refreshToken }: { refreshToken: string }, context: GraphqlContext) =>
    authService.refreshToken(refreshToken, {
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    }),
  logout: async (_args: unknown, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return authService.logout(auth.userId, auth.sessionId)
  },
  updateMe: async (
    { displayName, username, avatarUrl, about }: { displayName?: string; username?: string; avatarUrl?: string; about?: string },
    context: GraphqlContext
  ) => {
    const auth = requireAuth(context)
    return usersService.updateMe(auth.userId, { displayName, username, avatarUrl, about })
  },
  updatePrivacy: async (
    { input }: { input: { lastSeenVisibility?: "EVERYONE" | "CONTACTS" | "NOBODY"; profilePhotoVisibility?: "EVERYONE" | "CONTACTS" | "NOBODY"; aboutVisibility?: "EVERYONE" | "CONTACTS" | "NOBODY"; readReceiptsEnabled?: boolean } },
    context: GraphqlContext
  ) => {
    const auth = requireAuth(context)
    return usersService.updatePrivacy(auth.userId, input)
  },
  createContact: async ({ input }: { input: { contactName: string; phoneNumber: string; countryCode?: string; favorite?: boolean; pinned?: boolean } }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return contactsService.create(auth.userId, input)
  },
  importContacts: async ({ contacts }: { contacts: Array<{ contactName: string; phoneNumber: string; countryCode?: string }> }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return contactsService.import(auth.userId, contacts)
  },
  deleteContact: async ({ id }: { id: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return contactsService.remove(auth.userId, id)
  },
  blockContact: async ({ id }: { id: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return contactsService.block(auth.userId, id)
  },
  unblockContact: async ({ id }: { id: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return contactsService.unblock(auth.userId, id)
  },
  createDirectConversation: async ({ recipientUserId }: { recipientUserId: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return conversationsService.createOrFetchDirect(auth.userId, recipientUserId)
  },
  muteConversation: async ({ id, mutedUntil }: { id: string; mutedUntil?: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return conversationsService.mute(auth.userId, id, mutedUntil)
  },
  pinConversation: async ({ id, pinned }: { id: string; pinned: boolean }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return conversationsService.pin(auth.userId, id, pinned)
  },
  deleteConversation: async ({ id }: { id: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return conversationsService.remove(auth.userId, id)
  },
  sendMessage: async (
    { conversationId, input }: { conversationId: string; input: { type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "VOICE_NOTE" | "DOCUMENT" | "CONTACT" | "LOCATION" | "CALL_LOG" | "SYSTEM"; content?: string; replyToMessageId?: string; forwardedFromMessageId?: string; attachments?: Array<{ kind: "IMAGE" | "VIDEO" | "AUDIO" | "VOICE_NOTE" | "DOCUMENT" | "CONTACT" | "LOCATION" | "THUMBNAIL"; url: string; mimeType: string; fileName: string; fileSize: number; extension?: string; width?: number; height?: number; durationSeconds?: number; thumbnailUrl?: string }> } },
    context: GraphqlContext
  ) => {
    const auth = requireAuth(context)
    return messagesService.send(auth.userId, conversationId, input)
  },
  editMessage: async ({ id, content }: { id: string; content: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return messagesService.edit(auth.userId, id, content)
  },
  deleteMessageForMe: async ({ id }: { id: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return messagesService.deleteForMe(auth.userId, id)
  },
  deleteMessageForEveryone: async ({ id }: { id: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return messagesService.deleteForEveryone(auth.userId, id)
  },
  addReaction: async ({ id, emoji }: { id: string; emoji: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return messagesService.addReaction(auth.userId, id, emoji)
  },
  removeReaction: async ({ id, emoji }: { id: string; emoji: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return messagesService.removeReaction(auth.userId, id, emoji)
  },
  forwardMessage: async ({ id, conversationId }: { id: string; conversationId: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return messagesService.forward(auth.userId, id, conversationId)
  },
  markMessageRead: async ({ id }: { id: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return messagesService.markRead(auth.userId, id)
  },
  createGroup: async ({ input }: { input: { title: string; description?: string; avatarUrl?: string; memberIds: string[]; isAnnouncementsOnly?: boolean; allowInfoEditsByAdmins?: boolean; allowMemberAddsByAdmins?: boolean } }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return groupsService.create(auth.userId, input)
  },
  updateGroup: async ({ id, input }: { id: string; input: { title?: string; description?: string; avatarUrl?: string; isAnnouncementsOnly?: boolean; allowInfoEditsByAdmins?: boolean; allowMemberAddsByAdmins?: boolean } }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return groupsService.update(auth.userId, id, input)
  },
  addGroupMembers: async ({ id, userIds }: { id: string; userIds: string[] }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return groupsService.addMembers(auth.userId, id, userIds)
  },
  removeGroupMember: async ({ id, userId }: { id: string; userId: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return groupsService.removeMember(auth.userId, id, userId)
  },
  promoteGroupAdmin: async ({ id, userId }: { id: string; userId: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return groupsService.promoteAdmin(auth.userId, id, userId)
  },
  demoteGroupAdmin: async ({ id, userId }: { id: string; userId: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return groupsService.demoteAdmin(auth.userId, id, userId)
  },
  createGroupInviteLink: async ({ id, expiresAt, revokeExisting }: { id: string; expiresAt?: string; revokeExisting?: boolean }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return groupsService.createInvite(auth.userId, id, expiresAt, revokeExisting ?? true)
  },
  joinGroupByInvite: async ({ inviteCode }: { inviteCode: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return groupsService.joinByInvite(auth.userId, inviteCode)
  },
  leaveGroup: async ({ id }: { id: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return groupsService.leave(auth.userId, id)
  },
  startCall: async ({ type, targetUserId, conversationId }: { type: "VOICE" | "VIDEO"; targetUserId?: string; conversationId?: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return callsService.start(auth.userId, { type, targetUserId, conversationId })
  },
  acceptCall: async ({ id }: { id: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return callsService.accept(auth.userId, id)
  },
  rejectCall: async ({ id }: { id: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return callsService.reject(auth.userId, id)
  },
  endCall: async ({ id }: { id: string }, context: GraphqlContext) => {
    const auth = requireAuth(context)
    return callsService.end(auth.userId, id)
  }
}
