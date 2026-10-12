import type {
  Contact,
  Session,
  User,
  UserPrivacySettings
} from "@prisma/client"

export const serializeUser = (
  user: User & { privacySettings?: UserPrivacySettings | null }
) => ({
  id: user.id,
  phoneNumber: user.phoneNumber,
  countryCode: user.countryCode,
  displayName: user.displayName,
  username: user.username,
  avatarUrl: user.avatarUrl,
  about: user.about,
  lastSeenAt: user.lastSeenAt,
  isOnline: user.isOnline,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  privacySettings: user.privacySettings
    ? {
        lastSeenVisibility: user.privacySettings.lastSeenVisibility,
        profilePhotoVisibility: user.privacySettings.profilePhotoVisibility,
        aboutVisibility: user.privacySettings.aboutVisibility,
        readReceiptsEnabled: user.privacySettings.readReceiptsEnabled
      }
    : undefined
})

export const serializeSession = (session: Session) => ({
  id: session.id,
  deviceName: session.deviceName,
  deviceId: session.deviceId,
  userAgent: session.userAgent,
  ipAddress: session.ipAddress,
  lastUsedAt: session.lastUsedAt,
  expiresAt: session.expiresAt,
  createdAt: session.createdAt
})

export const serializeContact = (contact: Contact & { linkedUser?: User | null }) => ({
  id: contact.id,
  contactName: contact.contactName,
  phoneNumber: contact.phoneNumber,
  countryCode: contact.countryCode,
  favorite: contact.favorite,
  pinned: contact.pinned,
  isImported: contact.isImported,
  linkedUser: contact.linkedUser
    ? serializeUser({ ...contact.linkedUser, privacySettings: null })
    : null,
  createdAt: contact.createdAt,
  updatedAt: contact.updatedAt
})
