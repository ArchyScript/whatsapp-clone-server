import { buildSchema } from "graphql"

export const graphqlSchema = buildSchema(`
  enum Visibility {
    EVERYONE
    CONTACTS
    NOBODY
  }

  enum MessageType {
    TEXT
    IMAGE
    VIDEO
    AUDIO
    VOICE_NOTE
    DOCUMENT
    CONTACT
    LOCATION
    CALL_LOG
    SYSTEM
  }

  enum MessageStatus {
    SENT
    DELIVERED
    READ
    FAILED
    DELETED
  }

  enum ParticipantRole {
    MEMBER
    ADMIN
    OWNER
  }

  enum CallType {
    VOICE
    VIDEO
  }

  type PrivacySettings {
    lastSeenVisibility: Visibility!
    profilePhotoVisibility: Visibility!
    aboutVisibility: Visibility!
    readReceiptsEnabled: Boolean!
  }

  type User {
    id: ID!
    phoneNumber: String!
    countryCode: String!
    displayName: String!
    username: String
    avatarUrl: String
    about: String!
    lastSeenAt: String
    isOnline: Boolean!
    createdAt: String!
    updatedAt: String!
    privacySettings: PrivacySettings
  }

  type SessionInfo {
    id: ID!
    deviceName: String
    deviceId: String
    userAgent: String
    ipAddress: String
    lastUsedAt: String!
    expiresAt: String!
    createdAt: String!
  }

  type AuthTokens {
    accessToken: String!
    refreshToken: String!
  }

  type AuthPayload {
    user: User!
    tokens: AuthTokens!
    session: SessionInfo!
  }

  type RequestOtpPayload {
    phoneNumber: String!
    expiresInSeconds: Int!
    resendAvailableInSeconds: Int!
    devOtpCode: String
  }

  type Contact {
    id: ID!
    contactName: String!
    phoneNumber: String!
    countryCode: String!
    favorite: Boolean!
    pinned: Boolean!
    isImported: Boolean!
    linkedUser: User
    createdAt: String!
    updatedAt: String!
  }

  type ConversationParticipant {
    id: ID!
    userId: String!
    role: ParticipantRole!
    canSendMessages: Boolean!
    canEditGroupInfo: Boolean!
    canAddMembers: Boolean!
    joinedAt: String!
    leftAt: String
    user: User
  }

  type Receipt {
    id: ID!
    messageId: String!
    userId: String!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type Reaction {
    id: ID!
    emoji: String!
    userId: String!
    createdAt: String!
    user: User
  }

  type Attachment {
    id: ID
    kind: String!
    url: String!
    mimeType: String!
    fileName: String!
    fileSize: Int!
    extension: String
    width: Int
    height: Int
    durationSeconds: Int
    thumbnailUrl: String
  }

  type Message {
    id: ID!
    conversationId: String!
    senderId: String!
    sender: User
    replyToMessageId: String
    forwardedFromMessageId: String
    type: MessageType!
    status: MessageStatus!
    content: String
    editedAt: String
    deletedAt: String
    deletedForEveryoneAt: String
    createdAt: String!
    updatedAt: String!
    attachments: [Attachment!]!
    receipts: [Receipt!]!
    reactions: [Reaction!]!
  }

  type Conversation {
    id: ID!
    type: String!
    title: String
    description: String
    avatarUrl: String
    isArchived: Boolean!
    isAnnouncementsOnly: Boolean!
    allowInfoEditsByAdmins: Boolean!
    allowMemberAddsByAdmins: Boolean!
    lastMessageId: String
    createdById: String!
    createdAt: String!
    updatedAt: String!
    participants: [ConversationParticipant!]!
    lastMessage: Message
  }

  type InviteLink {
    id: ID!
    conversationId: String!
    code: String!
    createdById: String!
    expiresAt: String
    revokedAt: String
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type UploadItem {
    kind: String!
    url: String!
    mimeType: String!
    fileName: String!
    fileSize: Int!
    extension: String
  }

  type CallParticipant {
    id: ID!
    callId: String!
    userId: String!
    joinedAt: String
    leftAt: String
    status: String!
  }

  type Call {
    id: ID!
    conversationId: String
    initiatedById: String!
    type: CallType!
    direction: String!
    status: String!
    startedAt: String!
    answeredAt: String
    endedAt: String
    durationSeconds: Int
    createdAt: String!
    updatedAt: String!
    participants: [CallParticipant!]!
  }

  type SocketMeta {
    stunServers: [String!]!
    turnUrl: String
    turnUsername: String
    turnCredential: String
    clientEmits: [String!]!
    serverEmits: [String!]!
  }

  type ActionPayload {
    success: Boolean!
  }

  type Query {
    health: String!
    me: User
    usersSearch(q: String!): [User!]!
    contacts: [Contact!]!
    contactsSearch(q: String!): [Contact!]!
    conversations(limit: Int = 25): [Conversation!]!
    conversation(id: ID!): Conversation
    group(id: ID!): Conversation
    messages(conversationId: ID!, limit: Int = 50, q: String): [Message!]!
    callHistory: [Call!]!
    socketMeta: SocketMeta!
  }

  input VerifyOtpInput {
    phoneNumber: String!
    countryCode: String
    otp: String!
    displayName: String
    username: String
    about: String
    avatarUrl: String
    deviceName: String
    deviceId: String
  }

  input UpdatePrivacyInput {
    lastSeenVisibility: Visibility
    profilePhotoVisibility: Visibility
    aboutVisibility: Visibility
    readReceiptsEnabled: Boolean
  }

  input ContactInput {
    contactName: String!
    phoneNumber: String!
    countryCode: String
    favorite: Boolean
    pinned: Boolean
  }

  input ImportContactInput {
    contactName: String!
    phoneNumber: String!
    countryCode: String
  }

  input AttachmentInput {
    kind: String!
    url: String!
    mimeType: String!
    fileName: String!
    fileSize: Int!
    extension: String
    width: Int
    height: Int
    durationSeconds: Int
    thumbnailUrl: String
  }

  input SendMessageInput {
    type: MessageType!
    content: String
    replyToMessageId: String
    forwardedFromMessageId: String
    attachments: [AttachmentInput!]
  }

  input GroupInput {
    title: String!
    description: String
    avatarUrl: String
    memberIds: [String!]!
    isAnnouncementsOnly: Boolean
    allowInfoEditsByAdmins: Boolean
    allowMemberAddsByAdmins: Boolean
  }

  input GroupUpdateInput {
    title: String
    description: String
    avatarUrl: String
    isAnnouncementsOnly: Boolean
    allowInfoEditsByAdmins: Boolean
    allowMemberAddsByAdmins: Boolean
  }

  type Mutation {
    requestOtp(phoneNumber: String!, countryCode: String): RequestOtpPayload!
    verifyOtp(input: VerifyOtpInput!): AuthPayload!
    refresh(refreshToken: String!): AuthPayload!
    logout: ActionPayload!
    updateMe(displayName: String, username: String, avatarUrl: String, about: String): User!
    updatePrivacy(input: UpdatePrivacyInput!): User!
    createContact(input: ContactInput!): Contact!
    importContacts(contacts: [ImportContactInput!]!): [Contact!]!
    deleteContact(id: ID!): ActionPayload!
    blockContact(id: ID!): ActionPayload!
    unblockContact(id: ID!): ActionPayload!
    createDirectConversation(recipientUserId: String!): Conversation!
    muteConversation(id: ID!, mutedUntil: String): ActionPayload!
    pinConversation(id: ID!, pinned: Boolean!): ActionPayload!
    deleteConversation(id: ID!): ActionPayload!
    sendMessage(conversationId: ID!, input: SendMessageInput!): Message!
    editMessage(id: ID!, content: String!): Message!
    deleteMessageForMe(id: ID!): ActionPayload!
    deleteMessageForEveryone(id: ID!): Message!
    addReaction(id: ID!, emoji: String!): Message!
    removeReaction(id: ID!, emoji: String!): Message!
    forwardMessage(id: ID!, conversationId: ID!): Message!
    markMessageRead(id: ID!): ActionPayload!
    createGroup(input: GroupInput!): Conversation!
    updateGroup(id: ID!, input: GroupUpdateInput!): Conversation!
    addGroupMembers(id: ID!, userIds: [String!]!): Conversation!
    removeGroupMember(id: ID!, userId: String!): ActionPayload!
    promoteGroupAdmin(id: ID!, userId: String!): ActionPayload!
    demoteGroupAdmin(id: ID!, userId: String!): ActionPayload!
    createGroupInviteLink(id: ID!, expiresAt: String, revokeExisting: Boolean = true): InviteLink!
    joinGroupByInvite(inviteCode: String!): Conversation!
    leaveGroup(id: ID!): ActionPayload!
    startCall(type: CallType!, targetUserId: String, conversationId: String): Call!
    acceptCall(id: ID!): Call!
    rejectCall(id: ID!): Call!
    endCall(id: ID!): Call!
  }
`)
