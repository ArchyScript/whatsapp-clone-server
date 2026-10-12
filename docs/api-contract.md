# API Contract

Base URL: `/api/v1`

## Auth

- `POST /auth/request-otp`
  - body: `{ phoneNumber, countryCode? }`
- `POST /auth/verify-otp`
  - body: `{ phoneNumber, countryCode?, otp, displayName?, username?, about?, avatarUrl?, deviceName?, deviceId? }`
- `POST /auth/refresh`
  - body: `{ refreshToken }`
- `POST /auth/logout`
  - auth required
- `GET /auth/me`
  - auth required

## Users

- `GET /users/me`
- `PATCH /users/me`
- `PATCH /users/me/privacy`
- `GET /users/search?q=`
- `POST /users/report`
  - placeholder moderation/report endpoint

## Contacts

- `POST /contacts`
- `POST /contacts/import`
- `GET /contacts`
- `GET /contacts/search?q=`
- `DELETE /contacts/:id`
- `POST /contacts/:id/block`
- `DELETE /contacts/:id/block`

## Conversations

- `GET /conversations`
- `POST /conversations/direct`
- `GET /conversations/:id`
- `PATCH /conversations/:id/mute`
- `PATCH /conversations/:id/pin`
- `DELETE /conversations/:id`

## Messages

- `GET /conversations/:conversationId/messages`
- `POST /conversations/:conversationId/messages`
- `PATCH /messages/:id`
- `DELETE /messages/:id/for-me`
- `DELETE /messages/:id/for-everyone`
- `POST /messages/:id/reactions`
- `DELETE /messages/:id/reactions`
- `POST /messages/:id/forward`
- `POST /messages/:id/read`

## Groups

- `POST /groups`
- `GET /groups/:id`
- `PATCH /groups/:id`
- `POST /groups/:id/members`
- `DELETE /groups/:id/members/:userId`
- `POST /groups/:id/admins/:userId`
- `DELETE /groups/:id/admins/:userId`
- `POST /groups/:id/invite-link`
- `POST /groups/join/:inviteCode`
- `POST /groups/:id/leave`

## Uploads

- `POST /uploads`
- `POST /uploads/message-attachment`

## Calls

- `POST /calls/start`
- `POST /calls/:id/accept`
- `POST /calls/:id/reject`
- `POST /calls/:id/end`
- `GET /calls/history`
