export const sanitizeFilename = (fileName: string) =>
  fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 180)
