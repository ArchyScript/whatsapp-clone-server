export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface DeviceContext {
  ipAddress?: string
  userAgent?: string
  deviceName?: string
  deviceId?: string
}
