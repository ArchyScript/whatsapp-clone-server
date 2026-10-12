# Messaging Backend

Production-style Node.js + TypeScript backend for a WhatsApp-inspired messaging platform.

## Stack

- Node.js + TypeScript
- Express
- Prisma + PostgreSQL
- Redis
- Socket.io
- GraphQL
- Zod
- JWT + refresh rotation
- Multer local uploads
- Vitest

## Local setup

This backend now assumes you run PostgreSQL and Redis directly on your machine or through your own preferred service manager. There is no Docker-based project setup here anymore.

1. Copy `.env.example` to `.env`.
2. Make sure PostgreSQL is running locally.
3. Make sure Redis is running locally.
4. Install dependencies:
   - `npm install`
5. Generate Prisma client:
   - `npm run prisma:generate`
6. Run migrations:
   - `npx prisma migrate deploy`
7. Seed local data:
   - `npm run prisma:seed`
8. Start the server:
   - `npm run dev`

## Scripts

- `npm run dev`
- `npm run build`
- `npm start`
- `npm run typecheck`
- `npm run test`
- `npm run prisma:generate`
- `npm run prisma:seed`

## Interfaces

- REST API under `API_PREFIX`, default `/api/v1`
- GraphQL endpoint under `GRAPHQL_PATH`, default `/graphql`
- Socket.io for real-time messaging and WebRTC signaling

## Delivered modules

- phone OTP auth and session rotation
- users and privacy settings
- contacts import/search/block
- direct conversations
- message CRUD, receipts, reactions, forwarding
- group conversations and invite links
- file upload endpoints
- call start/accept/reject/end and call-log message creation
- authenticated Socket.io server with presence, typing, receipts, reactions, and WebRTC signaling events
- GraphQL adapter over the same backend services

## Docs

- [API contract](./docs/api-contract.md)
- [Socket events](./docs/socket-events.md)
- [Frontend integration](./docs/frontend-integration.md)
- [Node integration](./docs/node-integration.md)
- [GraphQL integration](./docs/graphql-integration.md)

## Notes

- The frontend still needs to replace mock stores with real REST/GraphQL and socket consumption.
- Uploads are stored locally by default under `uploads/`.
- The backend includes a report placeholder endpoint through `POST /users/report`.
