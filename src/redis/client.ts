import { Redis } from "ioredis"
import { env, logger } from "../config/index.js"

export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: null
})

redis.on("error", (error: Error) => {
  logger.error({ error }, "Redis connection error")
})
