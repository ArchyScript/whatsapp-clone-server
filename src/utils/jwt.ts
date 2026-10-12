import jwt from "jsonwebtoken"
import { env } from "../config/env.js"

export interface JwtUserPayload {
  userId: string
  sessionId: string
  phoneNumber: string
}

export const signAccessToken = (payload: JwtUserPayload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_TTL as jwt.SignOptions["expiresIn"]
  })

export const signRefreshToken = (payload: JwtUserPayload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_TTL as jwt.SignOptions["expiresIn"]
  })

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtUserPayload

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtUserPayload
