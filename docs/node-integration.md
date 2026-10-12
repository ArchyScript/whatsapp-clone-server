# Node Integration

This server now runs as a normal Node.js application without Docker-specific setup.

## What you need locally

- Node.js 20+
- PostgreSQL running locally
- Redis running locally

## Environment

Copy [.env.example](../.env.example) to `.env` and update:

- `DATABASE_URL`
- `DIRECT_URL`
- `REDIS_URL`
- JWT secrets
- optional upload and TURN settings

Example local values:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/whatsapp_backend?schema=public
DIRECT_URL=postgresql://postgres:yourpassword@localhost:5432/whatsapp_backend?schema=public
REDIS_URL=redis://127.0.0.1:6379
```

## Run flow

```powershell
npm install
npm run prisma:generate
npx prisma migrate deploy
npm run prisma:seed
npm run dev
```

## Production-style Node run

```powershell
npm run build
npm start
```
