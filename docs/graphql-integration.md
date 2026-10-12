# GraphQL Integration

The server exposes GraphQL at the path defined by `GRAPHQL_PATH`, defaulting to `/graphql`.

## Endpoint

- `POST /graphql`
- `GET /graphql`

## Auth

Send the same bearer token used by REST:

```http
Authorization: Bearer <access-token>
```

## Example query

```graphql
query BootstrapChat {
  me {
    id
    displayName
    phoneNumber
  }
  conversations(limit: 20) {
    id
    type
    title
    participants {
      userId
      role
      user {
        displayName
      }
    }
    lastMessage {
      id
      content
      type
      createdAt
    }
  }
}
```

## Example mutation

```graphql
mutation SendMessage($conversationId: ID!, $input: SendMessageInput!) {
  sendMessage(conversationId: $conversationId, input: $input) {
    id
    conversationId
    type
    content
    status
    createdAt
  }
}
```

Variables:

```json
{
  "conversationId": "conv_123",
  "input": {
    "type": "TEXT",
    "content": "Hello from GraphQL"
  }
}
```

## Current GraphQL coverage

- auth: OTP request, OTP verify, refresh, logout
- users: me, search, update profile, update privacy
- contacts: create, import, search, block, unblock, delete
- conversations: list, get, create direct, mute, pin, delete
- messages: list, send, edit, forward, delete, read, react
- groups: create, update, membership, admin actions, invite links, leave
- calls: start, accept, reject, end, history
- socket metadata: STUN/TURN and event names
