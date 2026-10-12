import type {
  Conversation,
  ConversationParticipant,
  Message,
  MessageAttachment,
  MessageReaction,
  MessageReceipt,
  User
} from "@prisma/client"
import { serializeUser } from "./serializers.js"

type MessageShape = Message & {
  sender?: User
  attachments?: MessageAttachment[]
  receipts?: MessageReceipt[]
  reactions?: (MessageReaction & { user?: User })[]
}

export const serializeMessage = (message: MessageShape) => ({
  id: message.id,
  conversationId: message.conversationId,
  sender: message.sender ? serializeUser({ ...message.sender, privacySettings: null }) : undefined,
  senderId: message.senderId,
  replyToMessageId: message.replyToMessageId,
  forwardedFromMessageId: message.forwardedFromMessageId,
  type: message.type,
  status: message.status,
  content: message.content,
  location: message.locationLatitude
    ? {
        latitude: message.locationLatitude,
        longitude: message.locationLongitude,
        label: message.locationLabel
      }
    : null,
  contactPayload: message.contactPayload,
  callPayload: message.callPayload,
  editedAt: message.editedAt,
  deletedAt: message.deletedAt,
  deletedForEveryoneAt: message.deletedForEveryoneAt,
  createdAt: message.createdAt,
  updatedAt: message.updatedAt,
  attachments: message.attachments ?? [],
  receipts: message.receipts ?? [],
  reactions:
    message.reactions?.map((reaction) => ({
      id: reaction.id,
      emoji: reaction.emoji,
      userId: reaction.userId,
      createdAt: reaction.createdAt,
      user: reaction.user ? serializeUser({ ...reaction.user, privacySettings: null }) : undefined
    })) ?? []
})

type ConversationShape = Conversation & {
  participants?: (ConversationParticipant & { user?: User })[]
  messages?: MessageShape[]
}

export const serializeConversation = (conversation: ConversationShape) => ({
  id: conversation.id,
  type: conversation.type,
  title: conversation.title,
  description: conversation.description,
  avatarUrl: conversation.avatarUrl,
  isArchived: conversation.isArchived,
  isAnnouncementsOnly: conversation.isAnnouncementsOnly,
  allowInfoEditsByAdmins: conversation.allowInfoEditsByAdmins,
  allowMemberAddsByAdmins: conversation.allowMemberAddsByAdmins,
  lastMessageId: conversation.lastMessageId,
  createdById: conversation.createdById,
  createdAt: conversation.createdAt,
  updatedAt: conversation.updatedAt,
  participants:
    conversation.participants?.map((participant) => ({
      id: participant.id,
      userId: participant.userId,
      role: participant.role,
      canSendMessages: participant.canSendMessages,
      canEditGroupInfo: participant.canEditGroupInfo,
      canAddMembers: participant.canAddMembers,
      joinedAt: participant.joinedAt,
      leftAt: participant.leftAt,
      user: participant.user
        ? serializeUser({ ...participant.user, privacySettings: null })
        : undefined
    })) ?? [],
  lastMessage: conversation.messages?.[0] ? serializeMessage(conversation.messages[0]) : null
})
