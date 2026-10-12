export const redisKeys = {
  otp: (phoneNumber: string) => `otp:${phoneNumber}`,
  otpRate: (phoneNumber: string) => `otp-rate:${phoneNumber}`,
  presence: (userId: string) => `presence:${userId}`,
  socketSession: (socketId: string) => `socket-session:${socketId}`,
  userSockets: (userId: string) => `user-sockets:${userId}`,
  callState: (callId: string) => `call:${callId}`,
  authIpRate: (ipAddress: string) => `auth-ip:${ipAddress}`
}
