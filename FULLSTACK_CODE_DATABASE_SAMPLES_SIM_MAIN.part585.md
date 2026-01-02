---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 585
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 585 of 933)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - sim-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/sim-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: file-utils.ts]---
Location: sim-main/apps/sim/lib/uploads/utils/file-utils.ts

```typescript
import type { Logger } from '@/lib/logs/console/logger'
import type { StorageContext } from '@/lib/uploads'
import { ACCEPTED_FILE_TYPES, SUPPORTED_DOCUMENT_EXTENSIONS } from '@/lib/uploads/utils/validation'
import type { UserFile } from '@/executor/types'

export interface FileAttachment {
  id: string
  key: string
  filename: string
  media_type: string
  size: number
}

export interface MessageContent {
  type: 'text' | 'image' | 'document' | 'audio' | 'video'
  text?: string
  source?: {
    type: 'base64'
    media_type: string
    data: string
  }
}

/**
 * Mapping of MIME types to content types
 */
export const MIME_TYPE_MAPPING: Record<string, 'image' | 'document' | 'audio' | 'video'> = {
  // Images
  'image/jpeg': 'image',
  'image/jpg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'image/webp': 'image',
  'image/svg+xml': 'image',

  // Documents
  'application/pdf': 'document',
  'text/plain': 'document',
  'text/csv': 'document',
  'application/json': 'document',
  'application/xml': 'document',
  'text/xml': 'document',
  'text/html': 'document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document', // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'document', // .xlsx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'document', // .pptx
  'application/msword': 'document', // .doc
  'application/vnd.ms-excel': 'document', // .xls
  'application/vnd.ms-powerpoint': 'document', // .ppt
  'text/markdown': 'document',
  'application/rtf': 'document',

  // Audio
  'audio/mpeg': 'audio', // .mp3
  'audio/mp3': 'audio',
  'audio/mp4': 'audio', // .m4a
  'audio/x-m4a': 'audio',
  'audio/m4a': 'audio',
  'audio/wav': 'audio',
  'audio/wave': 'audio',
  'audio/x-wav': 'audio',
  'audio/webm': 'audio',
  'audio/ogg': 'audio',
  'audio/vorbis': 'audio',
  'audio/flac': 'audio',
  'audio/x-flac': 'audio',
  'audio/aac': 'audio',
  'audio/x-aac': 'audio',
  'audio/opus': 'audio',

  // Video
  'video/mp4': 'video',
  'video/mpeg': 'video',
  'video/quicktime': 'video', // .mov
  'video/x-quicktime': 'video',
  'video/x-msvideo': 'video', // .avi
  'video/avi': 'video',
  'video/x-matroska': 'video', // .mkv
  'video/webm': 'video',
}

/**
 * Get the content type for a given MIME type
 */
export function getContentType(mimeType: string): 'image' | 'document' | 'audio' | 'video' | null {
  return MIME_TYPE_MAPPING[mimeType.toLowerCase()] || null
}

/**
 * Check if a MIME type is supported
 */
export function isSupportedFileType(mimeType: string): boolean {
  return mimeType.toLowerCase() in MIME_TYPE_MAPPING
}

/**
 * Check if a MIME type is an image type (for copilot uploads)
 */
export function isImageFileType(mimeType: string): boolean {
  const imageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ]
  return imageTypes.includes(mimeType.toLowerCase())
}

/**
 * Check if a MIME type is an audio type
 */
export function isAudioFileType(mimeType: string): boolean {
  return getContentType(mimeType) === 'audio'
}

/**
 * Check if a MIME type is a video type
 */
export function isVideoFileType(mimeType: string): boolean {
  return getContentType(mimeType) === 'video'
}

/**
 * Check if a MIME type is an audio or video type
 */
export function isMediaFileType(mimeType: string): boolean {
  const contentType = getContentType(mimeType)
  return contentType === 'audio' || contentType === 'video'
}

/**
 * Convert a file buffer to base64
 */
export function bufferToBase64(buffer: Buffer): string {
  return buffer.toString('base64')
}

/**
 * Create message content from file data
 */
export function createFileContent(fileBuffer: Buffer, mimeType: string): MessageContent | null {
  const contentType = getContentType(mimeType)
  if (!contentType) {
    return null
  }

  return {
    type: contentType,
    source: {
      type: 'base64',
      media_type: mimeType,
      data: bufferToBase64(fileBuffer),
    },
  }
}

/**
 * Extract file extension from filename
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.')
  return lastDot !== -1 ? filename.slice(lastDot + 1).toLowerCase() : ''
}

/**
 * Get MIME type from file extension (fallback if not provided)
 */
export function getMimeTypeFromExtension(extension: string): string {
  const extensionMimeMap: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',

    // Documents
    pdf: 'application/pdf',
    txt: 'text/plain',
    csv: 'text/csv',
    json: 'application/json',
    xml: 'application/xml',
    html: 'text/html',
    htm: 'text/html',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    doc: 'application/msword',
    xls: 'application/vnd.ms-excel',
    ppt: 'application/vnd.ms-powerpoint',
    md: 'text/markdown',
    rtf: 'application/rtf',

    // Audio
    mp3: 'audio/mpeg',
    m4a: 'audio/mp4',
    wav: 'audio/wav',
    webm: 'audio/webm',
    ogg: 'audio/ogg',
    flac: 'audio/flac',
    aac: 'audio/aac',
    opus: 'audio/opus',

    // Video
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    mkv: 'video/x-matroska',
  }

  return extensionMimeMap[extension.toLowerCase()] || 'application/octet-stream'
}

/**
 * Get file extension from MIME type
 * @param mimeType - MIME type string
 * @returns File extension without dot, or null if not found
 */
export function getExtensionFromMimeType(mimeType: string): string | null {
  const mimeToExtension: Record<string, string> = {
    // Images
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',

    // Documents
    'application/pdf': 'pdf',
    'text/plain': 'txt',
    'text/csv': 'csv',
    'application/json': 'json',
    'application/xml': 'xml',
    'text/xml': 'xml',
    'text/html': 'html',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'application/msword': 'doc',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.ms-powerpoint': 'ppt',
    'text/markdown': 'md',
    'application/rtf': 'rtf',

    // Audio
    'audio/mpeg': 'mp3',
    'audio/mp3': 'mp3',
    'audio/mp4': 'm4a',
    'audio/x-m4a': 'm4a',
    'audio/m4a': 'm4a',
    'audio/wav': 'wav',
    'audio/wave': 'wav',
    'audio/x-wav': 'wav',
    'audio/webm': 'webm',
    'audio/ogg': 'ogg',
    'audio/vorbis': 'ogg',
    'audio/flac': 'flac',
    'audio/x-flac': 'flac',
    'audio/aac': 'aac',
    'audio/x-aac': 'aac',
    'audio/opus': 'opus',

    // Video
    'video/mp4': 'mp4',
    'video/mpeg': 'mpg',
    'video/quicktime': 'mov',
    'video/x-quicktime': 'mov',
    'video/x-msvideo': 'avi',
    'video/avi': 'avi',
    'video/x-matroska': 'mkv',
    'video/webm': 'webm',

    // Archives
    'application/zip': 'zip',
    'application/x-zip-compressed': 'zip',
    'application/gzip': 'gz',
  }

  return mimeToExtension[mimeType.toLowerCase()] || null
}

/**
 * Format bytes to human-readable file size
 * @param bytes - File size in bytes
 * @param options - Formatting options
 * @returns Formatted string (e.g., "1.5 MB", "500 KB")
 */
export function formatFileSize(
  bytes: number,
  options?: { includeBytes?: boolean; precision?: number }
): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const precision = options?.precision ?? 1
  const includeBytes = options?.includeBytes ?? false

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  if (i === 0 && !includeBytes) {
    return '0 Bytes'
  }

  const value = bytes / k ** i
  const formattedValue = Number.parseFloat(value.toFixed(precision))

  return `${formattedValue} ${sizes[i]}`
}

/**
 * Validate file size and type for knowledge base uploads (client-side)
 * @param file - File object to validate
 * @param maxSizeBytes - Maximum file size in bytes (default: 100MB)
 * @returns Error message string if validation fails, null if valid
 */
export function validateKnowledgeBaseFile(
  file: File,
  maxSizeBytes: number = 100 * 1024 * 1024
): string | null {
  if (file.size > maxSizeBytes) {
    const maxSizeMB = Math.round(maxSizeBytes / (1024 * 1024))
    return `File "${file.name}" is too large. Maximum size is ${maxSizeMB}MB.`
  }

  // Check MIME type first
  if (ACCEPTED_FILE_TYPES.includes(file.type)) {
    return null
  }

  // Fallback: check file extension (browsers often misidentify file types like .md)
  const extension = getFileExtension(file.name)
  if (
    SUPPORTED_DOCUMENT_EXTENSIONS.includes(
      extension as (typeof SUPPORTED_DOCUMENT_EXTENSIONS)[number]
    )
  ) {
    return null
  }

  return `File "${file.name}" has an unsupported format. Please use PDF, DOC, DOCX, TXT, CSV, XLS, XLSX, MD, PPT, PPTX, HTML, JSON, YAML, or YML files.`
}

/**
 * Extract storage key from a file path
 * Handles URLs like /api/files/serve/s3/key or /api/files/serve/blob/key
 */
export function extractStorageKey(filePath: string): string {
  let pathWithoutQuery = filePath.split('?')[0]

  try {
    if (pathWithoutQuery.startsWith('http://') || pathWithoutQuery.startsWith('https://')) {
      const url = new URL(pathWithoutQuery)
      pathWithoutQuery = url.pathname
    }
  } catch {
    // If URL parsing fails, use the original path
  }

  if (pathWithoutQuery.startsWith('/api/files/serve/')) {
    let key = decodeURIComponent(pathWithoutQuery.substring('/api/files/serve/'.length))
    if (key.startsWith('s3/')) {
      key = key.substring(3)
    } else if (key.startsWith('blob/')) {
      key = key.substring(5)
    }
    return key
  }
  return pathWithoutQuery
}

/**
 * Check if a URL is an internal file serve URL
 */
export function isInternalFileUrl(fileUrl: string): boolean {
  return fileUrl.includes('/api/files/serve/')
}

/**
 * Infer storage context from file key using explicit prefixes
 * All files must use prefixed keys
 */
export function inferContextFromKey(key: string): StorageContext {
  if (!key) {
    throw new Error('Cannot infer context from empty key')
  }

  if (key.startsWith('kb/')) return 'knowledge-base'
  if (key.startsWith('chat/')) return 'chat'
  if (key.startsWith('copilot/')) return 'copilot'
  if (key.startsWith('execution/')) return 'execution'
  if (key.startsWith('workspace/')) return 'workspace'
  if (key.startsWith('profile-pictures/')) return 'profile-pictures'
  if (key.startsWith('logs/')) return 'logs'

  throw new Error(
    `File key must start with a context prefix (kb/, chat/, copilot/, execution/, workspace/, profile-pictures/, or logs/). Got: ${key}`
  )
}

/**
 * Extract storage key and context from an internal file URL
 * @param fileUrl - Internal file URL (e.g., /api/files/serve/key?context=workspace)
 * @returns Object with storage key and context
 */
export function parseInternalFileUrl(fileUrl: string): { key: string; context: StorageContext } {
  const key = extractStorageKey(fileUrl)

  if (!key) {
    throw new Error('Could not extract storage key from internal file URL')
  }

  const url = new URL(fileUrl.startsWith('http') ? fileUrl : `http://localhost${fileUrl}`)
  const contextParam = url.searchParams.get('context')

  const context = (contextParam as StorageContext) || inferContextFromKey(key)

  return { key, context }
}

/**
 * Raw file input that can be converted to UserFile
 * Supports various file object formats from different sources
 */
export interface RawFileInput {
  id?: string
  key?: string
  path?: string
  url?: string
  name: string
  size: number
  type?: string
  uploadedAt?: string | Date
  expiresAt?: string | Date
  context?: string
}

/**
 * Type guard to check if a RawFileInput has all UserFile required properties
 */
function isCompleteUserFile(file: RawFileInput): file is UserFile {
  return (
    typeof file.id === 'string' &&
    typeof file.name === 'string' &&
    typeof file.url === 'string' &&
    typeof file.size === 'number' &&
    typeof file.type === 'string' &&
    typeof file.key === 'string' &&
    typeof file.uploadedAt === 'string' &&
    typeof file.expiresAt === 'string'
  )
}

/**
 * Converts a single raw file object to UserFile format
 * @param file - Raw file object
 * @param requestId - Request ID for logging
 * @param logger - Logger instance
 * @returns UserFile object
 * @throws Error if file has no storage key
 */
export function processSingleFileToUserFile(
  file: RawFileInput,
  requestId: string,
  logger: Logger
): UserFile {
  if (isCompleteUserFile(file)) {
    return file
  }

  const storageKey = file.key || (file.path ? extractStorageKey(file.path) : null)

  if (!storageKey) {
    logger.warn(`[${requestId}] File has no storage key: ${file.name || 'unknown'}`)
    throw new Error(`File has no storage key: ${file.name || 'unknown'}`)
  }

  const userFile: UserFile = {
    id: file.id || `file-${Date.now()}`,
    name: file.name,
    url: file.url || file.path || '',
    size: file.size,
    type: file.type || 'application/octet-stream',
    key: storageKey,
  }

  logger.info(`[${requestId}] Converted file to UserFile: ${userFile.name} (key: ${userFile.key})`)
  return userFile
}

/**
 * Converts raw file objects (from file-upload or variable references) to UserFile format
 * @param files - Array of raw file objects
 * @param requestId - Request ID for logging
 * @param logger - Logger instance
 * @returns Array of UserFile objects
 */
export function processFilesToUserFiles(
  files: RawFileInput[],
  requestId: string,
  logger: Logger
): UserFile[] {
  const userFiles: UserFile[] = []

  for (const file of files) {
    try {
      const userFile = processSingleFileToUserFile(file, requestId, logger)
      userFiles.push(userFile)
    } catch (error) {
      logger.warn(
        `[${requestId}] Skipping file: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  return userFiles
}

/**
 * Sanitize a filename for use in storage metadata headers
 * Storage metadata headers must contain only ASCII printable characters (0x20-0x7E)
 * and cannot contain certain special characters
 */
export function sanitizeFilenameForMetadata(filename: string): string {
  return (
    filename
      // Remove non-ASCII characters (keep only printable ASCII 0x20-0x7E)
      .replace(/[^\x20-\x7E]/g, '')
      // Remove characters that are problematic in HTTP headers
      .replace(/["\\]/g, '')
      // Replace multiple spaces with single space
      .replace(/\s+/g, ' ')
      // Trim whitespace
      .trim() ||
    // Provide fallback if completely sanitized
    'file'
  )
}

/**
 * Sanitize metadata values for storage providers
 * Removes non-printable ASCII characters and limits length
 * @param metadata Original metadata object
 * @param maxLength Maximum length per value (Azure Blob: 8000, S3: 2000)
 * @returns Sanitized metadata object
 */
export function sanitizeStorageMetadata(
  metadata: Record<string, string>,
  maxLength: number
): Record<string, string> {
  const sanitized: Record<string, string> = {}
  for (const [key, value] of Object.entries(metadata)) {
    const sanitizedValue = String(value)
      .replace(/[^\x20-\x7E]/g, '')
      .replace(/["\\]/g, '')
      .substring(0, maxLength)
    if (sanitizedValue) {
      sanitized[key] = sanitizedValue
    }
  }
  return sanitized
}

/**
 * Sanitize a file key/path for local storage
 * Removes dangerous characters and prevents path traversal
 * Preserves forward slashes for structured paths (e.g., kb/file.json, workspace/id/file.json)
 * All keys must have a context prefix structure
 * @param key Original file key/path
 * @returns Sanitized key safe for filesystem use
 */
export function sanitizeFileKey(key: string): string {
  if (!key.includes('/')) {
    throw new Error('File key must include a context prefix (e.g., kb/, workspace/, execution/)')
  }

  const segments = key.split('/')

  const sanitizedSegments = segments.map((segment, index) => {
    if (segment === '..' || segment === '.') {
      throw new Error('Path traversal detected in file key')
    }

    if (index === segments.length - 1) {
      return segment.replace(/[^a-zA-Z0-9.-]/g, '_')
    }
    return segment.replace(/[^a-zA-Z0-9-]/g, '_')
  })

  return sanitizedSegments.join('/')
}

/**
 * Extract clean filename from URL or path, stripping query parameters
 * Handles both internal serve URLs (/api/files/serve/...) and external URLs
 * @param urlOrPath URL or path string that may contain query parameters
 * @returns Clean filename without query parameters
 */
export function extractCleanFilename(urlOrPath: string): string {
  const withoutQuery = urlOrPath.split('?')[0]

  try {
    const url = new URL(
      withoutQuery.startsWith('http') ? withoutQuery : `http://localhost${withoutQuery}`
    )
    const pathname = url.pathname
    const filename = pathname.split('/').pop() || 'unknown'
    return decodeURIComponent(filename)
  } catch {
    const filename = withoutQuery.split('/').pop() || 'unknown'
    return decodeURIComponent(filename)
  }
}

/**
 * Extract workspaceId from execution file key pattern
 * Format: execution/workspaceId/workflowId/executionId/filename
 * @param key File storage key
 * @returns workspaceId if key matches execution file pattern, null otherwise
 */
export function extractWorkspaceIdFromExecutionKey(key: string): string | null {
  const segments = key.split('/')

  const UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i

  if (segments[0] === 'execution' && segments.length >= 5) {
    const workspaceId = segments[1]
    if (workspaceId && UUID_PATTERN.test(workspaceId)) {
      return workspaceId
    }
  }

  return null
}

/**
 * Construct viewer URL for a file
 * Viewer URL format: /workspace/{workspaceId}/files/{fileKey}/view
 * @param fileKey File storage key
 * @param workspaceId Optional workspace ID (will be extracted from key if not provided)
 * @returns Viewer URL string or null if workspaceId cannot be determined
 */
export function getViewerUrl(fileKey: string, workspaceId?: string): string | null {
  const resolvedWorkspaceId = workspaceId || extractWorkspaceIdFromExecutionKey(fileKey)

  if (!resolvedWorkspaceId) {
    return null
  }

  return `/workspace/${resolvedWorkspaceId}/files/${fileKey}/view`
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/lib/uploads/utils/index.ts

```typescript
export * from './file-utils'
export * from './validation'
```

--------------------------------------------------------------------------------

---[FILE: validation.ts]---
Location: sim-main/apps/sim/lib/uploads/utils/validation.ts

```typescript
import path from 'path'

export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

export const SUPPORTED_DOCUMENT_EXTENSIONS = [
  'pdf',
  'csv',
  'doc',
  'docx',
  'txt',
  'md',
  'xlsx',
  'xls',
  'ppt',
  'pptx',
  'html',
  'htm',
  'json',
  'yaml',
  'yml',
] as const

export const SUPPORTED_AUDIO_EXTENSIONS = [
  'mp3',
  'm4a',
  'wav',
  'webm',
  'ogg',
  'flac',
  'aac',
  'opus',
] as const

export const SUPPORTED_VIDEO_EXTENSIONS = ['mp4', 'mov', 'avi', 'mkv', 'webm'] as const

export type SupportedDocumentExtension = (typeof SUPPORTED_DOCUMENT_EXTENSIONS)[number]
export type SupportedAudioExtension = (typeof SUPPORTED_AUDIO_EXTENSIONS)[number]
export type SupportedVideoExtension = (typeof SUPPORTED_VIDEO_EXTENSIONS)[number]
export type SupportedMediaExtension =
  | SupportedDocumentExtension
  | SupportedAudioExtension
  | SupportedVideoExtension

export const SUPPORTED_MIME_TYPES: Record<SupportedDocumentExtension, string[]> = {
  pdf: ['application/pdf', 'application/x-pdf'],
  csv: ['text/csv', 'application/csv', 'text/comma-separated-values'],
  doc: ['application/msword', 'application/doc', 'application/vnd.ms-word'],
  docx: [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/octet-stream',
  ],
  txt: ['text/plain', 'text/x-plain', 'application/txt'],
  md: [
    'text/markdown',
    'text/x-markdown',
    'text/plain',
    'application/markdown',
    'application/octet-stream',
  ],
  xlsx: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/octet-stream',
  ],
  xls: [
    'application/vnd.ms-excel',
    'application/excel',
    'application/x-excel',
    'application/x-msexcel',
  ],
  ppt: ['application/vnd.ms-powerpoint', 'application/powerpoint', 'application/x-mspowerpoint'],
  pptx: [
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/octet-stream',
  ],
  html: ['text/html', 'application/xhtml+xml'],
  htm: ['text/html', 'application/xhtml+xml'],
  json: ['application/json', 'text/json', 'application/x-json'],
  yaml: ['text/yaml', 'text/x-yaml', 'application/yaml', 'application/x-yaml'],
  yml: ['text/yaml', 'text/x-yaml', 'application/yaml', 'application/x-yaml'],
}

export const SUPPORTED_AUDIO_MIME_TYPES: Record<SupportedAudioExtension, string[]> = {
  mp3: ['audio/mpeg', 'audio/mp3'],
  m4a: ['audio/mp4', 'audio/x-m4a', 'audio/m4a'],
  wav: ['audio/wav', 'audio/wave', 'audio/x-wav'],
  webm: ['audio/webm'],
  ogg: ['audio/ogg', 'audio/vorbis'],
  flac: ['audio/flac', 'audio/x-flac'],
  aac: ['audio/aac', 'audio/x-aac'],
  opus: ['audio/opus'],
}

export const SUPPORTED_VIDEO_MIME_TYPES: Record<SupportedVideoExtension, string[]> = {
  mp4: ['video/mp4', 'video/mpeg'],
  mov: ['video/quicktime', 'video/x-quicktime'],
  avi: ['video/x-msvideo', 'video/avi'],
  mkv: ['video/x-matroska'],
  webm: ['video/webm'],
}

export const ACCEPTED_FILE_TYPES = Object.values(SUPPORTED_MIME_TYPES).flat()
export const ACCEPTED_AUDIO_TYPES = Object.values(SUPPORTED_AUDIO_MIME_TYPES).flat()
export const ACCEPTED_VIDEO_TYPES = Object.values(SUPPORTED_VIDEO_MIME_TYPES).flat()
export const ACCEPTED_MEDIA_TYPES = [
  ...ACCEPTED_FILE_TYPES,
  ...ACCEPTED_AUDIO_TYPES,
  ...ACCEPTED_VIDEO_TYPES,
]

export const ACCEPTED_FILE_EXTENSIONS = SUPPORTED_DOCUMENT_EXTENSIONS.map((ext) => `.${ext}`)

export const ACCEPT_ATTRIBUTE = [...ACCEPTED_FILE_TYPES, ...ACCEPTED_FILE_EXTENSIONS].join(',')

export interface FileValidationError {
  code: 'UNSUPPORTED_FILE_TYPE' | 'MIME_TYPE_MISMATCH'
  message: string
  supportedTypes: string[]
}

/**
 * Validate if a file type is supported for document processing
 */
export function validateFileType(fileName: string, mimeType: string): FileValidationError | null {
  const extension = path.extname(fileName).toLowerCase().substring(1) as SupportedDocumentExtension

  if (!SUPPORTED_DOCUMENT_EXTENSIONS.includes(extension)) {
    return {
      code: 'UNSUPPORTED_FILE_TYPE',
      message: `Unsupported file type: ${extension}. Supported types are: ${SUPPORTED_DOCUMENT_EXTENSIONS.join(', ')}`,
      supportedTypes: [...SUPPORTED_DOCUMENT_EXTENSIONS],
    }
  }

  const baseMimeType = mimeType.split(';')[0].trim()

  // Allow empty MIME types if the extension is supported (browsers often don't recognize certain file types)
  if (!baseMimeType) {
    return null
  }

  const allowedMimeTypes = SUPPORTED_MIME_TYPES[extension]
  if (!allowedMimeTypes.includes(baseMimeType)) {
    return {
      code: 'MIME_TYPE_MISMATCH',
      message: `MIME type ${baseMimeType} does not match file extension ${extension}. Expected: ${allowedMimeTypes.join(', ')}`,
      supportedTypes: allowedMimeTypes,
    }
  }

  return null
}

/**
 * Check if file extension is supported
 */
export function isSupportedExtension(extension: string): extension is SupportedDocumentExtension {
  return SUPPORTED_DOCUMENT_EXTENSIONS.includes(
    extension.toLowerCase() as SupportedDocumentExtension
  )
}

/**
 * Get supported MIME types for an extension
 */
export function getSupportedMimeTypes(extension: string): string[] {
  if (isSupportedExtension(extension)) {
    return SUPPORTED_MIME_TYPES[extension as SupportedDocumentExtension]
  }
  if (SUPPORTED_AUDIO_EXTENSIONS.includes(extension as SupportedAudioExtension)) {
    return SUPPORTED_AUDIO_MIME_TYPES[extension as SupportedAudioExtension]
  }
  if (SUPPORTED_VIDEO_EXTENSIONS.includes(extension as SupportedVideoExtension)) {
    return SUPPORTED_VIDEO_MIME_TYPES[extension as SupportedVideoExtension]
  }
  return []
}

/**
 * Check if file extension is a supported audio extension
 */
export function isSupportedAudioExtension(extension: string): extension is SupportedAudioExtension {
  return SUPPORTED_AUDIO_EXTENSIONS.includes(extension.toLowerCase() as SupportedAudioExtension)
}

/**
 * Check if file extension is a supported video extension
 */
export function isSupportedVideoExtension(extension: string): extension is SupportedVideoExtension {
  return SUPPORTED_VIDEO_EXTENSIONS.includes(extension.toLowerCase() as SupportedVideoExtension)
}

/**
 * Validate if an audio/video file type is supported for STT processing
 */
export function validateMediaFileType(
  fileName: string,
  mimeType: string
): FileValidationError | null {
  const extension = path.extname(fileName).toLowerCase().substring(1)

  const isAudio = SUPPORTED_AUDIO_EXTENSIONS.includes(extension as SupportedAudioExtension)
  const isVideo = SUPPORTED_VIDEO_EXTENSIONS.includes(extension as SupportedVideoExtension)

  if (!isAudio && !isVideo) {
    return {
      code: 'UNSUPPORTED_FILE_TYPE',
      message: `Unsupported media file type: ${extension}. Supported audio types: ${SUPPORTED_AUDIO_EXTENSIONS.join(', ')}. Supported video types: ${SUPPORTED_VIDEO_EXTENSIONS.join(', ')}`,
      supportedTypes: [...SUPPORTED_AUDIO_EXTENSIONS, ...SUPPORTED_VIDEO_EXTENSIONS],
    }
  }

  const baseMimeType = mimeType.split(';')[0].trim()
  const allowedMimeTypes = isAudio
    ? SUPPORTED_AUDIO_MIME_TYPES[extension as SupportedAudioExtension]
    : SUPPORTED_VIDEO_MIME_TYPES[extension as SupportedVideoExtension]

  if (!allowedMimeTypes.includes(baseMimeType)) {
    return {
      code: 'MIME_TYPE_MISMATCH',
      message: `MIME type ${baseMimeType} does not match file extension ${extension}. Expected: ${allowedMimeTypes.join(', ')}`,
      supportedTypes: allowedMimeTypes,
    }
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: attachment-processor.ts]---
Location: sim-main/apps/sim/lib/webhooks/attachment-processor.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { uploadFileFromRawData } from '@/lib/uploads/contexts/execution'
import type { UserFile } from '@/executor/types'

const logger = createLogger('WebhookAttachmentProcessor')

export interface WebhookAttachment {
  name: string
  data: Buffer
  contentType?: string
  mimeType?: string
  size: number
}

/**
 * Processes webhook/trigger attachments and converts them to UserFile objects.
 * This enables triggers to include file attachments that get automatically stored
 * in the execution filesystem and made available as UserFile objects for workflow use.
 */
export class WebhookAttachmentProcessor {
  /**
   * Process attachments and upload them to execution storage
   */
  static async processAttachments(
    attachments: WebhookAttachment[],
    executionContext: {
      workspaceId: string
      workflowId: string
      executionId: string
      requestId: string
      userId?: string
    }
  ): Promise<UserFile[]> {
    if (!attachments || attachments.length === 0) {
      return []
    }

    logger.info(
      `[${executionContext.requestId}] Processing ${attachments.length} attachments for execution ${executionContext.executionId}`
    )

    const processedFiles: UserFile[] = []

    for (const attachment of attachments) {
      try {
        const userFile = await WebhookAttachmentProcessor.processAttachment(
          attachment,
          executionContext
        )
        processedFiles.push(userFile)
      } catch (error) {
        logger.error(
          `[${executionContext.requestId}] Error processing attachment '${attachment.name}':`,
          error
        )
        // Continue with other attachments rather than failing the entire request
      }
    }

    logger.info(
      `[${executionContext.requestId}] Successfully processed ${processedFiles.length}/${attachments.length} attachments`
    )

    return processedFiles
  }

  /**
   * Process a single attachment and upload to execution storage
   */
  private static async processAttachment(
    attachment: WebhookAttachment,
    executionContext: {
      workspaceId: string
      workflowId: string
      executionId: string
      requestId: string
      userId?: string
    }
  ): Promise<UserFile> {
    return uploadFileFromRawData(
      {
        name: attachment.name,
        data: attachment.data,
        mimeType: attachment.contentType || attachment.mimeType,
      },
      executionContext,
      executionContext.userId
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: env-resolver.ts]---
Location: sim-main/apps/sim/lib/webhooks/env-resolver.ts

```typescript
import { getEffectiveDecryptedEnv } from '@/lib/environment/utils'
import { createLogger } from '@/lib/logs/console/logger'
import { extractEnvVarName, isEnvVarReference } from '@/executor/constants'

const logger = createLogger('EnvResolver')

/**
 * Resolves environment variable references in a string value
 * Uses the same helper functions as the executor's EnvResolver
 *
 * @param value - The string that may contain env var references
 * @param envVars - Object containing environment variable key-value pairs
 * @returns The resolved string with env vars replaced
 */
function resolveEnvVarInString(value: string, envVars: Record<string, string>): string {
  if (!isEnvVarReference(value)) {
    return value
  }

  const varName = extractEnvVarName(value)
  const resolvedValue = envVars[varName]

  if (resolvedValue === undefined) {
    logger.warn(`Environment variable not found: ${varName}`)
    return value // Return original if not found
  }

  logger.debug(`Resolved environment variable: ${varName}`)
  return resolvedValue
}

/**
 * Recursively resolves all environment variable references in a configuration object
 * Supports the pattern: {{VAR_NAME}}
 *
 * @param config - Configuration object that may contain env var references
 * @param userId - User ID to fetch environment variables for
 * @param workspaceId - Optional workspace ID for workspace-specific env vars
 * @returns A new object with all env var references resolved
 */
export async function resolveEnvVarsInObject(
  config: Record<string, any>,
  userId: string,
  workspaceId?: string
): Promise<Record<string, any>> {
  const envVars = await getEffectiveDecryptedEnv(userId, workspaceId)

  const resolved = { ...config }

  function resolveValue(value: any): any {
    if (typeof value === 'string') {
      return resolveEnvVarInString(value, envVars)
    }
    if (Array.isArray(value)) {
      return value.map(resolveValue)
    }
    if (value !== null && typeof value === 'object') {
      const resolvedObj: Record<string, any> = {}
      for (const [key, val] of Object.entries(value)) {
        resolvedObj[key] = resolveValue(val)
      }
      return resolvedObj
    }
    return value
  }

  for (const [key, value] of Object.entries(resolved)) {
    resolved[key] = resolveValue(value)
  }

  return resolved
}
```

--------------------------------------------------------------------------------

````
