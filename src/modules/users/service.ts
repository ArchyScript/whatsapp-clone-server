import { StatusCodes } from "http-status-codes"
import { AppError, serializeUser } from "../../utils/index.js"
import { usersRepository } from "./repository.js"

export const usersService = {
  async me(userId: string) {
    const user = await usersRepository.getById(userId)
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "USER_NOT_FOUND", "User not found")
    }

    return serializeUser(user)
  },

  async updateMe(userId: string, payload: { displayName?: string; username?: string; avatarUrl?: string | null; about?: string }) {
    const user = await usersRepository.updateProfile(userId, payload)
    return serializeUser(user)
  },

  async updatePrivacy(userId: string, payload: {
    lastSeenVisibility?: "EVERYONE" | "CONTACTS" | "NOBODY"
    profilePhotoVisibility?: "EVERYONE" | "CONTACTS" | "NOBODY"
    aboutVisibility?: "EVERYONE" | "CONTACTS" | "NOBODY"
    readReceiptsEnabled?: boolean
  }) {
    await usersRepository.upsertPrivacy(userId, payload)
    return this.me(userId)
  },

  async search(currentUserId: string, query: string) {
    const users = await usersRepository.searchUsers(currentUserId, query)
    return users.map((user) => serializeUser(user))
  },

  async report(userId: string, payload: {
    targetType: "user" | "message"
    targetId: string
    reason: string
    details?: string
  }) {
    await prisma.auditLog.create({
      data: {
        userId,
        action: "REPORT_CREATED",
        entityType: payload.targetType,
        entityId: payload.targetId,
        metadata: {
          reason: payload.reason,
          details: payload.details
        }
      }
    })

    return { success: true }
  }
}
import { prisma } from "../../prisma/index.js"
