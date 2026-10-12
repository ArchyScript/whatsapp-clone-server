import multer from "multer"
import { Router } from "express"
import { requireAuth } from "../../middleware/auth.js"
import { uploadConfig } from "../../config/upload.js"
import { uploadFiles, uploadMessageAttachments } from "./controller.js"

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: uploadConfig.maxFileSizeBytes,
    files: 5
  }
})

export const uploadsRouter = Router()

uploadsRouter.use(requireAuth)
uploadsRouter.post("/", upload.array("files", 5), uploadFiles)
uploadsRouter.post("/message-attachment", upload.array("files", 5), uploadMessageAttachments)
