import request from "supertest"
import { beforeAll, describe, expect, it } from "vitest"

process.env.DATABASE_URL ??= "postgresql://postgres:postgres@localhost:5432/whatsapp_backend?schema=public"
process.env.DIRECT_URL ??= process.env.DATABASE_URL
process.env.REDIS_URL ??= "redis://localhost:6379"
process.env.JWT_ACCESS_SECRET ??= "test-access-secret-that-is-long-enough-123456"
process.env.JWT_REFRESH_SECRET ??= "test-refresh-secret-that-is-long-enough-654321"

let createApp: typeof import("../app.js").createApp

beforeAll(async () => {
  ;({ createApp } = await import("../app.js"))
})

describe("app", () => {
  it("returns health response", async () => {
    const app = createApp()
    const response = await request(app).get("/health")

    expect(response.status).toBe(200)
    expect(response.body.status).toBe("ok")
  })
})
