# Frontend Integration Notes

## Frontend audit summary

The current frontend is still mock-data driven:

- auth flow is a placeholder email/password helper
- chat selection and current thread state live in Pinia
- there is no real token/session storage flow yet
- message history is local state, not API-backed
- there is no real socket bootstrap yet
- call UI is currently limited to chat-header affordances

## Missing frontend fields the backend expects

You will need to introduce these fields on the frontend side:

- `user.id`
- `conversation.id`
- `participant.userId`
- `message.id`
- `message.type`
- `message.attachments[]`
- `message.receipts[]`
- `message.reactions[]`
- `session.id`
- `privacySettings`
- `call.id`
- `call.status`

## Axios setup example

```ts
import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

## Socket setup example

```ts
import { io } from "socket.io-client"

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  auth: {
    token: localStorage.getItem("accessToken")
  }
})

socket.emit("conversation:join", { conversationId })
socket.emit("message:typing:start", { conversationId })
```

## Recommended incremental connection order

1. Replace mock auth with OTP request/verify.
2. Fetch `/users/me` after login and store user/session.
3. Replace chat list mock data with `/conversations`.
4. Replace message thread mock data with `/conversations/:id/messages`.
5. Send new messages through REST, then hydrate real-time updates with sockets.
6. Add receipts, typing, reactions, then calls.
