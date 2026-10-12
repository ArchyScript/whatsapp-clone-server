import { Router } from "express"
import { requireAuth } from "../../middleware/auth.js"
import { validate } from "../../validators/index.js"
import { logout, me, refresh, requestOtp, verifyOtp } from "./controller.js"
import { logoutSchema, refreshTokenSchema, requestOtpSchema, verifyOtpSchema } from "./schema.js"

export const authRouter = Router()

authRouter.post("/request-otp", validate(requestOtpSchema), requestOtp)
authRouter.post("/verify-otp", validate(verifyOtpSchema), verifyOtp)
authRouter.post("/refresh", validate(refreshTokenSchema), refresh)
authRouter.post("/logout", requireAuth, validate(logoutSchema), logout)
authRouter.get("/me", requireAuth, me)
