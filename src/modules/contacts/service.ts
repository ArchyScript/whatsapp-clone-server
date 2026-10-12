import { StatusCodes } from "http-status-codes"
import { prisma } from "../../prisma/index.js"
import { AppError, parsePhone, serializeContact } from "../../utils/index.js"
import { contactsRepository } from "./repository.js"

export const contactsService = {
  async create(userId: string, payload: {
    contactName: string
    phoneNumber: string
    countryCode?: string
    favorite?: boolean
    pinned?: boolean
  }) {
    const parsed = parsePhone(payload.phoneNumber, payload.countryCode)
    const linkedUser = await contactsRepository.findRegisteredUserByPhone(parsed.e164)
    const contact = await contactsRepository.upsertContact(userId, {
      contactName: payload.contactName,
      phoneNumber: parsed.e164,
      countryCode: parsed.countryCode,
      favorite: payload.favorite,
      pinned: payload.pinned,
      linkedUserId: linkedUser?.id ?? null
    })

    await prisma.auditLog.create({
      data: {
        userId,
        action: "CONTACT_IMPORTED",
        entityType: "Contact",
        entityId: contact.id
      }
    })

    return serializeContact(contact)
  },

  async import(userId: string, contacts: Array<{ contactName: string; phoneNumber: string; countryCode?: string }>) {
    const imported = []
    for (const entry of contacts) {
      const parsed = parsePhone(entry.phoneNumber, entry.countryCode)
      const linkedUser = await contactsRepository.findRegisteredUserByPhone(parsed.e164)
      const contact = await contactsRepository.upsertContact(userId, {
        contactName: entry.contactName,
        phoneNumber: parsed.e164,
        countryCode: parsed.countryCode,
        isImported: true,
        linkedUserId: linkedUser?.id ?? null
      })
      imported.push(serializeContact(contact))
    }
    return imported
  },

  async list(userId: string) {
    const contacts = await contactsRepository.listContacts(userId)
    return contacts.map((contact) => serializeContact(contact))
  },

  async search(userId: string, query: string) {
    const contacts = await contactsRepository.searchContacts(userId, query)
    return contacts.map((contact) => serializeContact(contact))
  },

  async remove(userId: string, contactId: string) {
    await contactsRepository.deleteContact(userId, contactId)
    return { success: true }
  },

  async block(userId: string, contactId: string) {
    const contact = await contactsRepository.getContactById(userId, contactId)
    if (!contact?.linkedUserId) {
      throw new AppError(StatusCodes.BAD_REQUEST, "CONTACT_NOT_REGISTERED", "Only registered users can be blocked")
    }

    await contactsRepository.blockUser(userId, contact.linkedUserId, contact.id)
    return { success: true }
  },

  async unblock(userId: string, contactId: string) {
    const contact = await contactsRepository.getContactById(userId, contactId)
    if (!contact?.linkedUserId) {
      throw new AppError(StatusCodes.BAD_REQUEST, "CONTACT_NOT_REGISTERED", "Only registered users can be unblocked")
    }

    await contactsRepository.unblockUser(userId, contact.linkedUserId)
    return { success: true }
  }
}
