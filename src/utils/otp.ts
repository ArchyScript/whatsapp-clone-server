import crypto from "node:crypto"

export const generateOtpCode = () => crypto.randomInt(100000, 999999).toString()
