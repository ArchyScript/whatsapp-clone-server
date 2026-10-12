export interface ApiUser {
  id: string
  phoneNumber: string
  countryCode: string
  displayName: string
  username: string | null
  avatarUrl: string | null
  about: string
  lastSeenAt: string | Date | null
  isOnline: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

export interface ApiConversationParticipant {
  id: string
  userId: string
  role: "MEMBER" | "ADMIN" | "OWNER"
  canSendMessages: boolean
  canEditGroupInfo: boolean
  canAddMembers: boolean
  joinedAt: string | Date
  leftAt: string | Date | null
  user?: ApiUser
}

export interface ApiAttachment {
  kind: "IMAGE" | "VIDEO" | "AUDIO" | "VOICE_NOTE" | "DOCUMENT" | "CONTACT" | "LOCATION" | "THUMBNAIL"
  url: string
  mimeType: string
  fileName: string
  fileSize: number
  extension?: string
  width?: number
  height?: number
  durationSeconds?: number
  thumbnailUrl?: string
}

export interface ApiMessage {
  id: string
  conversationId: string
  senderId: string
  type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "VOICE_NOTE" | "DOCUMENT" | "CONTACT" | "LOCATION" | "CALL_LOG" | "SYSTEM"
  status: "SENT" | "DELIVERED" | "READ" | "FAILED" | "DELETED"
  content?: string | null
  replyToMessageId?: string | null
  forwardedFromMessageId?: string | null
  attachments: ApiAttachment[]
  createdAt: string | Date
  updatedAt: string | Date
}

export interface ApiConversation {
  id: string
  type: "DIRECT" | "GROUP"
  title?: string | null
  description?: string | null
  avatarUrl?: string | null
  participants: ApiConversationParticipant[]
  lastMessage: ApiMessage | null
}

export interface AuthSuccessResponse {
  user: ApiUser
  tokens: {
    accessToken: string
    refreshToken: string
  }
  session: {
    id: string
    deviceName?: string | null
    deviceId?: string | null
    userAgent?: string | null
    ipAddress?: string | null
    lastUsedAt: string | Date
    expiresAt: string | Date
    createdAt: string | Date
  }
}

export interface SocketEventMap {
  "presence:update": { userId: string; isOnline: boolean }
  "message:new": ApiMessage
  "message:updated": ApiMessage
  "message:deleted": ApiMessage
  "message:delivered": { conversationId: string; messageId: string; userId: string }
  "message:read": { conversationId: string; messageId: string; userId: string }
  "message:typing": { conversationId: string; userId: string; isTyping: boolean }
  "reaction:updated": unknown
  "call:incoming": unknown
  "call:ringing": unknown
  "call:offer": unknown
  "call:answer": unknown
  "call:ice-candidate": unknown
  "call:accepted": unknown
  "call:rejected": unknown
  "call:ended": unknown
  "call:missed": unknown
}
