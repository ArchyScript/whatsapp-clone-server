import path from "node:path"
import { env } from "./env.js"

export const uploadConfig = {
  driver: env.UPLOAD_DRIVER,
  maxFileSizeBytes: env.UPLOAD_MAX_FILE_SIZE_BYTES,
  localDirAbsolute: path.resolve(process.cwd(), env.UPLOAD_LOCAL_DIR)
}
