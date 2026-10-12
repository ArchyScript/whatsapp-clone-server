# Socket Events

## Connection

- authenticate with `handshake.auth.token` or `Authorization: Bearer <token>`
- personal room: `user:{userId}`
- conversation room: `conversation:{conversationId}`
- call room: `call:{callId}`

## Client emits

- `presence:online`
- `presence:offline`
- `conversation:join`
- `conversation:leave`
- `message:typing:start`
- `message:typing:stop`
- `message:delivered`
- `message:read`
- `reaction:add`
- `reaction:remove`
- `call:start`
- `call:offer`
- `call:answer`
- `call:ice-candidate`
- `call:accept`
- `call:reject`
- `call:end`

## Server emits

- `presence:update`
- `message:new`
- `message:updated`
- `message:deleted`
- `message:delivered`
- `message:read`
- `message:typing`
- `reaction:updated`
- `call:incoming`
- `call:ringing`
- `call:offer`
- `call:answer`
- `call:ice-candidate`
- `call:accepted`
- `call:rejected`
- `call:ended`
- `call:missed`
