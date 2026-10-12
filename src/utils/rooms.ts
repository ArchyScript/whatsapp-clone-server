export const socketRooms = {
  user: (userId: string) => `user:${userId}`,
  conversation: (conversationId: string) => `conversation:${conversationId}`,
  group: (groupId: string) => `group:${groupId}`,
  call: (callId: string) => `call:${callId}`
}
