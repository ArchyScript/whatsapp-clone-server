import fs from "node:fs"
import path from "node:path"
import mime from "mime-types"
import { randomUUID } from "node:crypto"
import { StatusCodes } from "http-status-codes"
import { uploadConfig } from "../../config/upload.js"
import { AppError, sanitizeFilename } from "../../utils/index.js"

const allowedMimePrefixes = ["image/", "video/", "audio/"]
const allowedDocumentMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain"
]

const validateFile = (file: Express.Multer.File) => {
  const isAllowed =
    allowedMimePrefixes.some((prefix) => file.mimetype.startsWith(prefix)) ||
    allowedDocumentMimeTypes.includes(file.mimetype)

  if (!isAllowed) {
    throw new AppError(StatusCodes.BAD_REQUEST, "UNSUPPORTED_FILE_TYPE", "Unsupported file type")
  }

  if (file.size > uploadConfig.maxFileSizeBytes) {
    throw new AppError(StatusCodes.BAD_REQUEST, "FILE_TOO_LARGE", "File exceeds upload limit")
  }
}

const resolveKind = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return "IMAGE"
  if (mimeType.startsWith("video/")) return "VIDEO"
  if (mimeType.startsWith("audio/")) return "AUDIO"
  return "DOCUMENT"
}

export const uploadsService = {
  async upload(files: Express.Multer.File[]) {
    if (!files.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, "FILE_REQUIRED", "At least one file is required")
    }

    fs.mkdirSync(uploadConfig.localDirAbsolute, { recursive: true })

    return files.map((file) => {
      validateFile(file)
      const extension = mime.extension(file.mimetype) || path.extname(file.originalname).replace(".", "") || "bin"
      const fileName = `${randomUUID()}-${sanitizeFilename(file.originalname || "upload")}`
      const fullPath = path.join(uploadConfig.localDirAbsolute, fileName)
      fs.writeFileSync(fullPath, file.buffer)

      return {
        kind: resolveKind(file.mimetype),
        url: `/uploads/${fileName}`,
        mimeType: file.mimetype,
        fileName: file.originalname,
        fileSize: file.size,
        extension
      }
    })
  }
}
