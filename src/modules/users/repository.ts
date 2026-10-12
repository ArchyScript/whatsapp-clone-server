import { prisma } from "../../prisma/index.js"

export const usersRepository = {
  getById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: { privacySettings: true }
    })
  },

  updateProfile(userId: string, data: Parameters<typeof prisma.user.update>[0]["data"]) {
    return prisma.user.update({
      where: { id: userId },
      data,
      include: { privacySettings: true }
    })
  },

  upsertPrivacy(userId: string, data: {
    lastSeenVisibility?: "EVERYONE" | "CONTACTS" | "NOBODY"
    profilePhotoVisibility?: "EVERYONE" | "CONTACTS" | "NOBODY"
    aboutVisibility?: "EVERYONE" | "CONTACTS" | "NOBODY"
    readReceiptsEnabled?: boolean
  }) {
    return prisma.userPrivacySettings.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data
      }
    })
  },

  searchUsers(currentUserId: string, query: string) {
    return prisma.user.findMany({
      where: {
        id: { not: currentUserId },
        OR: [
          { displayName: { contains: query, mode: "insensitive" } },
          { username: { contains: query, mode: "insensitive" } },
          { phoneNumber: { contains: query } }
        ]
      },
      include: { privacySettings: true },
      take: 20
    })
  }
}
