-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('DIRECT', 'GROUP');

-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('MEMBER', 'ADMIN', 'OWNER');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'VOICE_NOTE', 'DOCUMENT', 'CONTACT', 'LOCATION', 'CALL_LOG', 'SYSTEM');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('SENT', 'DELIVERED', 'READ', 'FAILED', 'DELETED');

-- CreateEnum
CREATE TYPE "ReceiptStatus" AS ENUM ('DELIVERED', 'READ');

-- CreateEnum
CREATE TYPE "CallType" AS ENUM ('VOICE', 'VIDEO');

-- CreateEnum
CREATE TYPE "CallDirection" AS ENUM ('OUTGOING', 'INCOMING');

-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('INITIATED', 'RINGING', 'ACCEPTED', 'REJECTED', 'MISSED', 'CANCELLED', 'ENDED', 'FAILED');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('EVERYONE', 'CONTACTS', 'NOBODY');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AttachmentKind" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'VOICE_NOTE', 'DOCUMENT', 'CONTACT', 'LOCATION', 'THUMBNAIL');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('AUTH_OTP_REQUESTED', 'AUTH_OTP_VERIFIED', 'AUTH_LOGOUT', 'CONTACT_IMPORTED', 'CONTACT_BLOCKED', 'CONTACT_UNBLOCKED', 'CONVERSATION_CREATED', 'MESSAGE_SENT', 'MESSAGE_EDITED', 'MESSAGE_DELETED', 'GROUP_CREATED', 'GROUP_UPDATED', 'GROUP_INVITE_CREATED', 'GROUP_INVITE_REVOKED', 'CALL_STARTED', 'CALL_ENDED', 'REPORT_CREATED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "username" TEXT,
    "avatarUrl" TEXT,
    "about" TEXT NOT NULL DEFAULT 'Hey there! I am using the app.',
    "lastSeenAt" TIMESTAMP(3),
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceName" TEXT,
    "deviceId" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "refreshTokenHash" TEXT NOT NULL,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPrivacySettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastSeenVisibility" "Visibility" NOT NULL DEFAULT 'CONTACTS',
    "profilePhotoVisibility" "Visibility" NOT NULL DEFAULT 'EVERYONE',
    "aboutVisibility" "Visibility" NOT NULL DEFAULT 'EVERYONE',
    "readReceiptsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPrivacySettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "linkedUserId" TEXT,
    "contactName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "isImported" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedUser" (
    "id" TEXT NOT NULL,
    "blockerId" TEXT NOT NULL,
    "blockedUserId" TEXT NOT NULL,
    "contactId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlockedUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "type" "ConversationType" NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "avatarUrl" TEXT,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "isAnnouncementsOnly" BOOLEAN NOT NULL DEFAULT false,
    "allowInfoEditsByAdmins" BOOLEAN NOT NULL DEFAULT true,
    "allowMemberAddsByAdmins" BOOLEAN NOT NULL DEFAULT true,
    "lastMessageId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationParticipant" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ParticipantRole" NOT NULL DEFAULT 'MEMBER',
    "canSendMessages" BOOLEAN NOT NULL DEFAULT true,
    "canEditGroupInfo" BOOLEAN NOT NULL DEFAULT false,
    "canAddMembers" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "replyToMessageId" TEXT,
    "forwardedFromMessageId" TEXT,
    "type" "MessageType" NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'SENT',
    "content" TEXT,
    "locationLatitude" DECIMAL(65,30),
    "locationLongitude" DECIMAL(65,30),
    "locationLabel" TEXT,
    "contactPayload" JSONB,
    "callPayload" JSONB,
    "editedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "deletedForEveryoneAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageAttachment" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "kind" "AttachmentKind" NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "extension" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "durationSeconds" INTEGER,
    "waveform" JSONB,
    "thumbnailUrl" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageReceipt" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ReceiptStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageReaction" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeletedMessage" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeletedMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MutedConversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "mutedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MutedConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PinnedConversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PinnedConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupInvite" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "status" "InviteStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Call" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT,
    "initiatedById" TEXT NOT NULL,
    "type" "CallType" NOT NULL,
    "direction" "CallDirection" NOT NULL,
    "status" "CallStatus" NOT NULL DEFAULT 'INITIATED',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answeredAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "durationSeconds" INTEGER,
    "signalingPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallParticipant" (
    "id" TEXT NOT NULL,
    "callId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3),
    "leftAt" TIMESTAMP(3),
    "status" "CallStatus" NOT NULL DEFAULT 'INITIATED',

    CONSTRAINT "CallParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" "AuditAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "Session_userId_expiresAt_idx" ON "Session"("userId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserPrivacySettings_userId_key" ON "UserPrivacySettings"("userId");

-- CreateIndex
CREATE INDEX "Contact_ownerId_linkedUserId_idx" ON "Contact"("ownerId", "linkedUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_ownerId_phoneNumber_key" ON "Contact"("ownerId", "phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BlockedUser_contactId_key" ON "BlockedUser"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "BlockedUser_blockerId_blockedUserId_key" ON "BlockedUser"("blockerId", "blockedUserId");

-- CreateIndex
CREATE INDEX "Conversation_type_updatedAt_idx" ON "Conversation"("type", "updatedAt");

-- CreateIndex
CREATE INDEX "ConversationParticipant_userId_conversationId_idx" ON "ConversationParticipant"("userId", "conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationParticipant_conversationId_userId_key" ON "ConversationParticipant"("conversationId", "userId");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_senderId_createdAt_idx" ON "Message"("senderId", "createdAt");

-- CreateIndex
CREATE INDEX "MessageAttachment_messageId_idx" ON "MessageAttachment"("messageId");

-- CreateIndex
CREATE INDEX "MessageReceipt_messageId_userId_idx" ON "MessageReceipt"("messageId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageReceipt_messageId_userId_key" ON "MessageReceipt"("messageId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageReaction_messageId_userId_emoji_key" ON "MessageReaction"("messageId", "userId", "emoji");

-- CreateIndex
CREATE UNIQUE INDEX "DeletedMessage_messageId_userId_key" ON "DeletedMessage"("messageId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "MutedConversation_userId_conversationId_key" ON "MutedConversation"("userId", "conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "PinnedConversation_userId_conversationId_key" ON "PinnedConversation"("userId", "conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupInvite_code_key" ON "GroupInvite"("code");

-- CreateIndex
CREATE INDEX "GroupInvite_conversationId_status_idx" ON "GroupInvite"("conversationId", "status");

-- CreateIndex
CREATE INDEX "Call_initiatedById_startedAt_idx" ON "Call"("initiatedById", "startedAt");

-- CreateIndex
CREATE INDEX "CallParticipant_callId_userId_idx" ON "CallParticipant"("callId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "CallParticipant_callId_userId_key" ON "CallParticipant"("callId", "userId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPrivacySettings" ADD CONSTRAINT "UserPrivacySettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_linkedUserId_fkey" FOREIGN KEY ("linkedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedUser" ADD CONSTRAINT "BlockedUser_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedUser" ADD CONSTRAINT "BlockedUser_blockedUserId_fkey" FOREIGN KEY ("blockedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedUser" ADD CONSTRAINT "BlockedUser_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_replyToMessageId_fkey" FOREIGN KEY ("replyToMessageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_forwardedFromMessageId_fkey" FOREIGN KEY ("forwardedFromMessageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageAttachment" ADD CONSTRAINT "MessageAttachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageAttachment" ADD CONSTRAINT "MessageAttachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReceipt" ADD CONSTRAINT "MessageReceipt_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReceipt" ADD CONSTRAINT "MessageReceipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeletedMessage" ADD CONSTRAINT "DeletedMessage_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeletedMessage" ADD CONSTRAINT "DeletedMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutedConversation" ADD CONSTRAINT "MutedConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutedConversation" ADD CONSTRAINT "MutedConversation_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinnedConversation" ADD CONSTRAINT "PinnedConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinnedConversation" ADD CONSTRAINT "PinnedConversation_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupInvite" ADD CONSTRAINT "GroupInvite_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupInvite" ADD CONSTRAINT "GroupInvite_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_initiatedById_fkey" FOREIGN KEY ("initiatedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallParticipant" ADD CONSTRAINT "CallParticipant_callId_fkey" FOREIGN KEY ("callId") REFERENCES "Call"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallParticipant" ADD CONSTRAINT "CallParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

