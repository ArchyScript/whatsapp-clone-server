export interface MessageAttachmentInput {
  kind: string
  url: string
  mimeType: string
  fileName: string
  fileSize: number
  extension?: string
  width?: number
  height?: number
  durationSeconds?: number
  waveform?: unknown
  thumbnailUrl?: string
  metadata?: unknown
}
