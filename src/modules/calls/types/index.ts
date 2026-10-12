export interface CallStartInput {
  type: "VOICE" | "VIDEO"
  targetUserId?: string
  conversationId?: string
}
