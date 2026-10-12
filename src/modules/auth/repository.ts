import type { Prisma, User } from "@prisma/client"
import { prisma } from "../../prisma/index.js"

export const authRepository = {
  findUserByPhoneNumber(phoneNumber: string) {
    return prisma.user.findUnique({
      where: { phoneNumber },
      include: { privacySettings: true }
    })
  },

  createUser(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      include: { privacySettings: true }
    })
  },

  updateUser(userId: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id: userId },
      data,
      include: { privacySettings: true }
    })
  },

  createDefaultPrivacy(userId: string) {
    return prisma.userPrivacySettings.create({
      data: {
        userId
      }
    })
  },

  createSession(data: Prisma.SessionCreateInput) {
    return prisma.session.create({ data })
  },

  findSessionById(id: string) {
    return prisma.session.findUnique({ where: { id } })
  },

  updateSession(id: string, data: Prisma.SessionUpdateInput) {
    return prisma.session.update({ where: { id }, data })
  },

  revokeSession(id: string) {
    return prisma.session.update({
      where: { id },
      data: { revokedAt: new Date() }
    })
  },

  recordAudit(userId: string | null, action: Prisma.AuditLogCreateInput["action"], entityType: string, entityId?: string, metadata?: Prisma.InputJsonValue) {
    return prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        metadata
      }
    })
  },

  ensurePrivacyForUser(user: User) {
    return prisma.userPrivacySettings.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id }
    })
  }
}
