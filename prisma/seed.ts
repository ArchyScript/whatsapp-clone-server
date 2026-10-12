import { ParticipantRole } from "@prisma/client"
import argon2 from "argon2"
import ms from "ms"
import { prisma } from "../src/prisma/index.js"

const refreshTtlMs = ms("30d")

async function main() {
  const [alice, bob, team] = await Promise.all([
    prisma.user.upsert({
      where: { phoneNumber: "+2348011111111" },
      update: {},
      create: {
        phoneNumber: "+2348011111111",
        countryCode: "234",
        displayName: "Alice Product",
        username: "alice",
        about: "Building the platform.",
        privacySettings: {
          create: {}
        }
      }
    }),
    prisma.user.upsert({
      where: { phoneNumber: "+2348022222222" },
      update: {},
      create: {
        phoneNumber: "+2348022222222",
        countryCode: "234",
        displayName: "Bob Ops",
        username: "bob",
        about: "On-call and online.",
        privacySettings: {
          create: {}
        }
      }
    }),
    prisma.user.upsert({
      where: { phoneNumber: "+2348033333333" },
      update: {},
      create: {
        phoneNumber: "+2348033333333",
        countryCode: "234",
        displayName: "Team Lead",
        username: "teamlead",
        about: "Group admin.",
        privacySettings: {
          create: {}
        }
      }
    })
  ])

  await prisma.contact.upsert({
    where: {
      ownerId_phoneNumber: {
        ownerId: alice.id,
        phoneNumber: bob.phoneNumber
      }
    },
    update: {},
    create: {
      ownerId: alice.id,
      linkedUserId: bob.id,
      contactName: "Bob Ops",
      phoneNumber: bob.phoneNumber,
      countryCode: bob.countryCode,
      favorite: true
    }
  })

  const directConversation = await prisma.conversation.upsert({
    where: { id: "seed-direct-alice-bob" },
    update: {},
    create: {
      id: "seed-direct-alice-bob",
      type: "DIRECT",
      createdById: alice.id,
      participants: {
        create: [
          {
            userId: alice.id,
            role: ParticipantRole.OWNER
          },
          {
            userId: bob.id,
            role: ParticipantRole.MEMBER
          }
        ]
      }
    }
  })

  await prisma.message.createMany({
    data: [
      {
        conversationId: directConversation.id,
        senderId: alice.id,
        type: "TEXT",
        content: "Backend seed message from Alice."
      },
      {
        conversationId: directConversation.id,
        senderId: bob.id,
        type: "TEXT",
        content: "Bob received it in real time."
      }
    ],
    skipDuplicates: true
  })

  const refreshTokenHash = await argon2.hash("seed-refresh-token")
  await prisma.session.upsert({
    where: { id: "seed-session-alice" },
    update: {},
    create: {
      id: "seed-session-alice",
      userId: alice.id,
      refreshTokenHash,
      deviceName: "Seed Device",
      expiresAt: new Date(Date.now() + refreshTtlMs)
    }
  })

  const groupConversation = await prisma.conversation.upsert({
    where: { id: "seed-group-core-team" },
    update: {},
    create: {
      id: "seed-group-core-team",
      type: "GROUP",
      title: "Core Team",
      description: "Seeded group for local development.",
      createdById: team.id,
      participants: {
        create: [
          { userId: team.id, role: ParticipantRole.OWNER, canAddMembers: true, canEditGroupInfo: true },
          { userId: alice.id, role: ParticipantRole.ADMIN, canAddMembers: true, canEditGroupInfo: true },
          { userId: bob.id, role: ParticipantRole.MEMBER }
        ]
      }
    }
  })

  await prisma.groupInvite.createMany({
    data: [
      {
        conversationId: groupConversation.id,
        createdById: team.id,
        code: "seed-invite-core-team"
      }
    ],
    skipDuplicates: true
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
