import { config } from "dotenv"
import { z } from "zod"

config()

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(5000),
  API_PREFIX: z.string().default("/api/v1"),
  GRAPHQL_PATH: z.string().default("/graphql"),
  APP_ORIGIN: z.string().default("http://localhost:5173"),
  APP_NAME: z.string().default("Messaging Platform"),
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.string().default("15m"),
  JWT_REFRESH_TTL: z.string().default("30d"),
  OTP_EXPIRES_MINUTES: z.coerce.number().default(10),
  OTP_RESEND_COOLDOWN_SECONDS: z.coerce.number().default(60),
  OTP_MAX_ATTEMPTS: z.coerce.number().default(5),
  OTP_MAX_REQUESTS_PER_HOUR: z.coerce.number().default(10),
  AUTH_RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().default(50),
  UPLOAD_DRIVER: z.enum(["local", "s3"]).default("local"),
  UPLOAD_MAX_FILE_SIZE_BYTES: z.coerce.number().default(25 * 1024 * 1024),
  UPLOAD_LOCAL_DIR: z.string().default("uploads"),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ENDPOINT: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_FORCE_PATH_STYLE: z.coerce.boolean().default(false),
  STUN_SERVERS: z.string().default("stun:stun.l.google.com:19302"),
  TURN_URL: z.string().optional(),
  TURN_USERNAME: z.string().optional(),
  TURN_CREDENTIAL: z.string().optional(),
  LOG_LEVEL: z.string().default("info")
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error("Invalid environment variables", parsed.error.flatten().fieldErrors)
  throw new Error("Invalid environment variables")
}

export const env = parsed.data
