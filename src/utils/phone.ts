import { parsePhoneNumberWithError } from "libphonenumber-js"
import { AppError } from "./app-error.js"

export interface ParsedPhone {
  e164: string
  countryCode: string
}

export const parsePhone = (phoneNumber: string, countryCode?: string): ParsedPhone => {
  try {
    const parsed = parsePhoneNumberWithError(phoneNumber, countryCode as never)
    if (!parsed.isValid()) {
      throw new AppError(400, "INVALID_PHONE", "Invalid phone number")
    }

    return {
      e164: parsed.number,
      countryCode: parsed.countryCallingCode
    }
  } catch {
    throw new AppError(400, "INVALID_PHONE", "Invalid phone number")
  }
}
