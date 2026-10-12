import { prisma } from "../../prisma/index.js"

export const contactsRepository = {
  findRegisteredUserByPhone(phoneNumber: string) {
    return prisma.user.findUnique({ where: { phoneNumber } })
  },

  upsertContact(ownerId: string, payload: {
    contactName: string
    phoneNumber: string
    countryCode: string
    favorite?: boolean
    pinned?: boolean
    isImported?: boolean
    linkedUserId?: string | null
  }) {
    return prisma.contact.upsert({
      where: {
        ownerId_phoneNumber: {
          ownerId,
          phoneNumber: payload.phoneNumber
        }
      },
      create: {
        ownerId,
        contactName: payload.contactName,
        phoneNumber: payload.phoneNumber,
        countryCode: payload.countryCode,
        favorite: payload.favorite ?? false,
        pinned: payload.pinned ?? false,
        isImported: payload.isImported ?? false,
        linkedUserId: payload.linkedUserId ?? null
      },
      update: {
        contactName: payload.contactName,
        countryCode: payload.countryCode,
        favorite: payload.favorite,
        pinned: payload.pinned,
        isImported: payload.isImported,
        linkedUserId: payload.linkedUserId ?? undefined
      },
      include: {
        linkedUser: true
      }
    })
  },

  listContacts(ownerId: string) {
    return prisma.contact.findMany({
      where: { ownerId },
      include: { linkedUser: true },
      orderBy: [{ pinned: "desc" }, { favorite: "desc" }, { contactName: "asc" }]
    })
  },

  searchContacts(ownerId: string, query: string) {
    return prisma.contact.findMany({
      where: {
        ownerId,
        OR: [
          { contactName: { contains: query, mode: "insensitive" } },
          { phoneNumber: { contains: query } }
        ]
      },
      include: { linkedUser: true },
      take: 20
    })
  },

  deleteContact(ownerId: string, contactId: string) {
    return prisma.contact.delete({
      where: {
        id: contactId,
        ownerId
      }
    })
  },

  getContactById(ownerId: string, contactId: string) {
    return prisma.contact.findFirst({
      where: { id: contactId, ownerId },
      include: { linkedUser: true }
    })
  },

  blockUser(blockerId: string, blockedUserId: string, contactId?: string) {
    return prisma.blockedUser.upsert({
      where: {
        blockerId_blockedUserId: {
          blockerId,
          blockedUserId
        }
      },
      create: {
        blockerId,
        blockedUserId,
        contactId
      },
      update: {
        contactId
      }
    })
  },

  unblockUser(blockerId: string, blockedUserId: string) {
    return prisma.blockedUser.delete({
      where: {
        blockerId_blockedUserId: {
          blockerId,
          blockedUserId
        }
      }
    })
  }
}
