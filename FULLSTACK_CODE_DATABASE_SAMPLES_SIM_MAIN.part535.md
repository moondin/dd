---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 535
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 535 of 933)

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

---[FILE: auth.ts]---
Location: sim-main/apps/sim/lib/api-key/auth.ts

```typescript
import {
  decryptApiKey,
  encryptApiKey,
  generateApiKey,
  generateEncryptedApiKey,
  isEncryptedApiKeyFormat,
  isLegacyApiKeyFormat,
} from '@/lib/api-key/crypto'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('ApiKeyAuth')

/**
 * API key authentication utilities supporting both legacy plain text keys
 * and modern encrypted keys for gradual migration without breaking existing keys
 */

/**
 * Checks if a stored key is in the new encrypted format
 * @param storedKey - The key stored in the database
 * @returns true if the key is encrypted, false if it's plain text
 */
export function isEncryptedKey(storedKey: string): boolean {
  // Check if it follows the encrypted format: iv:encrypted:authTag
  return storedKey.includes(':') && storedKey.split(':').length === 3
}

/**
 * Authenticates an API key against a stored key, supporting both legacy and new encrypted formats
 * @param inputKey - The API key provided by the client
 * @param storedKey - The key stored in the database (may be plain text or encrypted)
 * @returns Promise<boolean> - true if the key is valid
 */
export async function authenticateApiKey(inputKey: string, storedKey: string): Promise<boolean> {
  try {
    // If input key has new encrypted prefix (sk-sim-), only check against encrypted storage
    if (isEncryptedApiKeyFormat(inputKey)) {
      if (isEncryptedKey(storedKey)) {
        try {
          const { decrypted } = await decryptApiKey(storedKey)
          return inputKey === decrypted
        } catch (decryptError) {
          logger.error('Failed to decrypt stored API key:', { error: decryptError })
          return false
        }
      }
      // New format keys should never match against plain text storage
      return false
    }

    // If input key has legacy prefix (sim_), check both encrypted and plain text
    if (isLegacyApiKeyFormat(inputKey)) {
      if (isEncryptedKey(storedKey)) {
        try {
          const { decrypted } = await decryptApiKey(storedKey)
          return inputKey === decrypted
        } catch (decryptError) {
          logger.error('Failed to decrypt stored API key:', { error: decryptError })
          // Fall through to plain text comparison if decryption fails
        }
      }
      // Legacy format can match against plain text storage
      return inputKey === storedKey
    }

    // If no recognized prefix, fall back to original behavior
    if (isEncryptedKey(storedKey)) {
      try {
        const { decrypted } = await decryptApiKey(storedKey)
        return inputKey === decrypted
      } catch (decryptError) {
        logger.error('Failed to decrypt stored API key:', { error: decryptError })
      }
    }

    return inputKey === storedKey
  } catch (error) {
    logger.error('API key authentication error:', { error })
    return false
  }
}

/**
 * Encrypts an API key for secure storage
 * @param apiKey - The plain text API key to encrypt
 * @returns Promise<string> - The encrypted key
 */
export async function encryptApiKeyForStorage(apiKey: string): Promise<string> {
  try {
    const { encrypted } = await encryptApiKey(apiKey)
    return encrypted
  } catch (error) {
    logger.error('API key encryption error:', { error })
    throw new Error('Failed to encrypt API key')
  }
}

/**
 * Creates a new API key
 * @param useStorage - Whether to encrypt the key before storage (default: true)
 * @returns Promise<{key: string, encryptedKey?: string}> - The plain key and optionally encrypted version
 */
export async function createApiKey(useStorage = true): Promise<{
  key: string
  encryptedKey?: string
}> {
  try {
    const hasEncryptionKey = env.API_ENCRYPTION_KEY !== undefined

    const plainKey = hasEncryptionKey ? generateEncryptedApiKey() : generateApiKey()

    if (useStorage) {
      const encryptedKey = await encryptApiKeyForStorage(plainKey)
      return { key: plainKey, encryptedKey }
    }

    return { key: plainKey }
  } catch (error) {
    logger.error('API key creation error:', { error })
    throw new Error('Failed to create API key')
  }
}

/**
 * Decrypts an API key from storage for display purposes
 * @param encryptedKey - The encrypted API key from the database
 * @returns Promise<string> - The decrypted API key
 */
export async function decryptApiKeyFromStorage(encryptedKey: string): Promise<string> {
  try {
    const { decrypted } = await decryptApiKey(encryptedKey)
    return decrypted
  } catch (error) {
    logger.error('API key decryption error:', { error })
    throw new Error('Failed to decrypt API key')
  }
}

/**
 * Gets the last 4 characters of an API key for display purposes
 * @param apiKey - The API key (plain text)
 * @returns string - The last 4 characters
 */
export function getApiKeyLast4(apiKey: string): string {
  return apiKey.slice(-4)
}

/**
 * Gets the display format for an API key showing prefix and last 4 characters
 * @param encryptedKey - The encrypted API key from the database
 * @returns Promise<string> - The display format like "sk-sim-...r6AA"
 */
export async function getApiKeyDisplayFormat(encryptedKey: string): Promise<string> {
  try {
    if (isEncryptedKey(encryptedKey)) {
      const decryptedKey = await decryptApiKeyFromStorage(encryptedKey)
      return formatApiKeyForDisplay(decryptedKey)
    }
    // For plain text keys (legacy), format directly
    return formatApiKeyForDisplay(encryptedKey)
  } catch (error) {
    logger.error('Failed to format API key for display:', { error })
    return '****'
  }
}

/**
 * Formats an API key for display showing prefix and last 4 characters
 * @param apiKey - The API key (plain text)
 * @returns string - The display format like "sk-sim-...r6AA" or "sim_...r6AA"
 */
export function formatApiKeyForDisplay(apiKey: string): string {
  if (isEncryptedApiKeyFormat(apiKey)) {
    // For sk-sim- format: "sk-sim-...r6AA"
    const last4 = getApiKeyLast4(apiKey)
    return `sk-sim-...${last4}`
  }
  if (isLegacyApiKeyFormat(apiKey)) {
    // For sim_ format: "sim_...r6AA"
    const last4 = getApiKeyLast4(apiKey)
    return `sim_...${last4}`
  }
  // Unknown format, just show last 4
  const last4 = getApiKeyLast4(apiKey)
  return `...${last4}`
}

/**
 * Gets the last 4 characters of an encrypted API key by decrypting it first
 * @param encryptedKey - The encrypted API key from the database
 * @returns Promise<string> - The last 4 characters
 */
export async function getEncryptedApiKeyLast4(encryptedKey: string): Promise<string> {
  try {
    if (isEncryptedKey(encryptedKey)) {
      const decryptedKey = await decryptApiKeyFromStorage(encryptedKey)
      return getApiKeyLast4(decryptedKey)
    }
    // For plain text keys (legacy), return last 4 directly
    return getApiKeyLast4(encryptedKey)
  } catch (error) {
    logger.error('Failed to get last 4 characters of API key:', { error })
    return '****'
  }
}

/**
 * Validates API key format (basic validation)
 * @param apiKey - The API key to validate
 * @returns boolean - true if the format appears valid
 */
export function isValidApiKeyFormat(apiKey: string): boolean {
  return typeof apiKey === 'string' && apiKey.length > 10 && apiKey.length < 200
}
```

--------------------------------------------------------------------------------

---[FILE: crypto.ts]---
Location: sim-main/apps/sim/lib/api-key/crypto.ts

```typescript
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('ApiKeyCrypto')

/**
 * Get the API encryption key from the environment
 * @returns The API encryption key
 */
function getApiEncryptionKey(): Buffer | null {
  const key = env.API_ENCRYPTION_KEY
  if (!key) {
    logger.warn(
      'API_ENCRYPTION_KEY not set - API keys will be stored in plain text. Consider setting this for better security.'
    )
    return null
  }
  if (key.length !== 64) {
    throw new Error('API_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)')
  }
  return Buffer.from(key, 'hex')
}

/**
 * Encrypts an API key using the dedicated API encryption key
 * @param apiKey - The API key to encrypt
 * @returns A promise that resolves to an object containing the encrypted API key and IV
 */
export async function encryptApiKey(apiKey: string): Promise<{ encrypted: string; iv: string }> {
  const key = getApiEncryptionKey()

  // If no API encryption key is set, return the key as-is for backward compatibility
  if (!key) {
    return { encrypted: apiKey, iv: '' }
  }

  const iv = randomBytes(16)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  let encrypted = cipher.update(apiKey, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const authTag = cipher.getAuthTag()

  // Format: iv:encrypted:authTag
  return {
    encrypted: `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`,
    iv: iv.toString('hex'),
  }
}

/**
 * Decrypts an API key using the dedicated API encryption key
 * @param encryptedValue - The encrypted value in format "iv:encrypted:authTag" or plain text
 * @returns A promise that resolves to an object containing the decrypted API key
 */
export async function decryptApiKey(encryptedValue: string): Promise<{ decrypted: string }> {
  // Check if this is actually encrypted (contains colons)
  if (!encryptedValue.includes(':') || encryptedValue.split(':').length !== 3) {
    // This is a plain text key, return as-is
    return { decrypted: encryptedValue }
  }

  const key = getApiEncryptionKey()

  // If no API encryption key is set, assume it's plain text
  if (!key) {
    return { decrypted: encryptedValue }
  }

  const parts = encryptedValue.split(':')
  const ivHex = parts[0]
  const authTagHex = parts[parts.length - 1]
  const encrypted = parts.slice(1, -1).join(':')

  if (!ivHex || !encrypted || !authTagHex) {
    throw new Error('Invalid encrypted API key format. Expected "iv:encrypted:authTag"')
  }

  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')

  try {
    const decipher = createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return { decrypted }
  } catch (error: unknown) {
    logger.error('API key decryption error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    throw error
  }
}

/**
 * Generates a standardized API key with the 'sim_' prefix (legacy format)
 * @returns A new API key string
 */
export function generateApiKey(): string {
  return `sim_${randomBytes(24).toString('base64url')}`
}

/**
 * Generates a new encrypted API key with the 'sk-sim-' prefix
 * @returns A new encrypted API key string
 */
export function generateEncryptedApiKey(): string {
  return `sk-sim-${randomBytes(24).toString('base64url')}`
}

/**
 * Determines if an API key uses the new encrypted format based on prefix
 * @param apiKey - The API key to check
 * @returns true if the key uses the new encrypted format (sk-sim- prefix)
 */
export function isEncryptedApiKeyFormat(apiKey: string): boolean {
  return apiKey.startsWith('sk-sim-')
}

/**
 * Determines if an API key uses the legacy format based on prefix
 * @param apiKey - The API key to check
 * @returns true if the key uses the legacy format (sim_ prefix)
 */
export function isLegacyApiKeyFormat(apiKey: string): boolean {
  return apiKey.startsWith('sim_') && !apiKey.startsWith('sk-sim-')
}
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: sim-main/apps/sim/lib/api-key/service.ts

```typescript
import { db } from '@sim/db'
import { apiKey as apiKeyTable } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { authenticateApiKey } from '@/lib/api-key/auth'
import { createLogger } from '@/lib/logs/console/logger'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'
import { getWorkspaceBillingSettings } from '@/lib/workspaces/utils'

const logger = createLogger('ApiKeyService')

export interface ApiKeyAuthOptions {
  userId?: string
  workspaceId?: string
  keyTypes?: ('personal' | 'workspace')[]
}

export interface ApiKeyAuthResult {
  success: boolean
  userId?: string
  keyId?: string
  keyType?: 'personal' | 'workspace'
  workspaceId?: string
  error?: string
}

/**
 * Authenticate an API key from header with flexible filtering options
 */
export async function authenticateApiKeyFromHeader(
  apiKeyHeader: string,
  options: ApiKeyAuthOptions = {}
): Promise<ApiKeyAuthResult> {
  if (!apiKeyHeader) {
    return { success: false, error: 'API key required' }
  }

  try {
    let workspaceSettings: {
      billedAccountUserId: string | null
      allowPersonalApiKeys: boolean
    } | null = null

    if (options.workspaceId) {
      workspaceSettings = await getWorkspaceBillingSettings(options.workspaceId)
      if (!workspaceSettings) {
        return { success: false, error: 'Workspace not found' }
      }
    }

    // Build query based on options
    let query = db
      .select({
        id: apiKeyTable.id,
        userId: apiKeyTable.userId,
        workspaceId: apiKeyTable.workspaceId,
        type: apiKeyTable.type,
        key: apiKeyTable.key,
        expiresAt: apiKeyTable.expiresAt,
      })
      .from(apiKeyTable)

    // Apply filters
    const conditions = []

    if (options.userId) {
      conditions.push(eq(apiKeyTable.userId, options.userId))
    }

    if (options.keyTypes?.length) {
      if (options.keyTypes.length === 1) {
        conditions.push(eq(apiKeyTable.type, options.keyTypes[0]))
      } else {
        // For multiple types, we'll filter in memory since drizzle's inArray is complex here
      }
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any
    }

    const keyRecords = await query

    const filteredRecords = keyRecords.filter((record) => {
      const keyType = record.type as 'personal' | 'workspace'

      if (options.keyTypes?.length && !options.keyTypes.includes(keyType)) {
        return false
      }

      if (options.workspaceId) {
        if (keyType === 'workspace') {
          return record.workspaceId === options.workspaceId
        }

        if (keyType === 'personal') {
          return workspaceSettings?.allowPersonalApiKeys ?? false
        }
      }

      return true
    })

    const permissionCache = new Map<string, boolean>()

    // Authenticate each key
    for (const storedKey of filteredRecords) {
      // Skip expired keys
      if (storedKey.expiresAt && storedKey.expiresAt < new Date()) {
        continue
      }

      if (options.workspaceId && (storedKey.type as 'personal' | 'workspace') === 'personal') {
        if (!workspaceSettings?.allowPersonalApiKeys) {
          continue
        }

        if (!storedKey.userId) {
          continue
        }

        if (!permissionCache.has(storedKey.userId)) {
          const permission = await getUserEntityPermissions(
            storedKey.userId,
            'workspace',
            options.workspaceId
          )
          permissionCache.set(storedKey.userId, permission !== null)
        }

        if (!permissionCache.get(storedKey.userId)) {
          continue
        }
      }

      try {
        const isValid = await authenticateApiKey(apiKeyHeader, storedKey.key)
        if (isValid) {
          return {
            success: true,
            userId: storedKey.userId,
            keyId: storedKey.id,
            keyType: storedKey.type as 'personal' | 'workspace',
            workspaceId: storedKey.workspaceId || options.workspaceId || undefined,
          }
        }
      } catch (error) {
        logger.error('Error authenticating API key:', error)
      }
    }

    return { success: false, error: 'Invalid API key' }
  } catch (error) {
    logger.error('API key authentication error:', error)
    return { success: false, error: 'Authentication failed' }
  }
}

/**
 * Update the last used timestamp for an API key
 */
export async function updateApiKeyLastUsed(keyId: string): Promise<void> {
  try {
    await db.update(apiKeyTable).set({ lastUsed: new Date() }).where(eq(apiKeyTable.id, keyId))
  } catch (error) {
    logger.error('Error updating API key last used:', error)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extractor.ts]---
Location: sim-main/apps/sim/lib/audio/extractor.ts

```typescript
import { execSync } from 'node:child_process'
import fsSync from 'node:fs'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import ffmpegStatic from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'
import type {
  AudioExtractionOptions,
  AudioExtractionResult,
  AudioMetadata,
} from '@/lib/audio/types'

let ffmpegInitialized = false
let ffmpegPath: string | null = null

/**
 * Lazy initialization of FFmpeg - only runs when needed, not at module load
 */
function ensureFfmpeg(): void {
  if (ffmpegInitialized) {
    if (!ffmpegPath) {
      throw new Error(
        'FFmpeg not found. Install: brew install ffmpeg (macOS) / apk add ffmpeg (Alpine) / apt-get install ffmpeg (Ubuntu)'
      )
    }
    return
  }

  ffmpegInitialized = true

  // Try ffmpeg-static binary
  if (ffmpegStatic && typeof ffmpegStatic === 'string') {
    try {
      fsSync.accessSync(ffmpegStatic, fsSync.constants.X_OK)
      ffmpegPath = ffmpegStatic
      ffmpeg.setFfmpegPath(ffmpegPath)
      console.log('[FFmpeg] Using ffmpeg-static:', ffmpegPath)
      return
    } catch {
      // Binary doesn't exist or not executable
    }
  }

  // Try system ffmpeg (cross-platform)
  try {
    const cmd = process.platform === 'win32' ? 'where ffmpeg' : 'which ffmpeg'
    const result = execSync(cmd, { encoding: 'utf-8' }).trim()
    // On Windows, 'where' returns multiple paths - take first
    ffmpegPath = result.split('\n')[0]
    ffmpeg.setFfmpegPath(ffmpegPath)
    console.log('[FFmpeg] Using system ffmpeg:', ffmpegPath)
    return
  } catch {
    // System ffmpeg not found
  }

  // No FFmpeg found - set flag but don't throw yet
  // Error will be thrown when user tries to use video extraction
  console.warn('[FFmpeg] No FFmpeg binary found at module load time')
}

/**
 * Extract audio from video or convert audio format using FFmpeg
 */
export async function extractAudioFromVideo(
  inputBuffer: Buffer,
  mimeType: string,
  options: AudioExtractionOptions = {}
): Promise<AudioExtractionResult> {
  // Initialize FFmpeg on first use
  ensureFfmpeg()
  const isVideo = mimeType.startsWith('video/')
  const isAudio = mimeType.startsWith('audio/')

  // If it's already audio and no conversion needed, get metadata and return
  if (isAudio && !options.outputFormat) {
    try {
      const metadata = await getAudioMetadata(inputBuffer, mimeType)
      return {
        buffer: inputBuffer,
        format: mimeType.split('/')[1] || 'unknown',
        duration: metadata.duration || 0,
        size: inputBuffer.length,
      }
    } catch (error) {
      // If metadata extraction fails, still return the buffer
      return {
        buffer: inputBuffer,
        format: mimeType.split('/')[1] || 'unknown',
        duration: 0,
        size: inputBuffer.length,
      }
    }
  }

  // For video or audio conversion, use ffmpeg
  if (isVideo || options.outputFormat) {
    return await convertAudioWithFFmpeg(inputBuffer, mimeType, options)
  }

  // Fallback
  return {
    buffer: inputBuffer,
    format: options.outputFormat || mimeType.split('/')[1] || 'unknown',
    duration: 0,
    size: inputBuffer.length,
  }
}

/**
 * Convert audio/video using FFmpeg
 */
async function convertAudioWithFFmpeg(
  inputBuffer: Buffer,
  mimeType: string,
  options: AudioExtractionOptions
): Promise<AudioExtractionResult> {
  // Create temporary files
  const tempDir = os.tmpdir()
  const inputExt = getExtensionFromMimeType(mimeType)
  const outputFormat = options.outputFormat || 'mp3'
  const inputFile = path.join(tempDir, `ffmpeg-input-${Date.now()}.${inputExt}`)
  const outputFile = path.join(tempDir, `ffmpeg-output-${Date.now()}.${outputFormat}`)

  try {
    // Write input buffer to temporary file
    await fs.writeFile(inputFile, inputBuffer)

    // Get metadata for duration
    let duration = 0
    try {
      const metadata = await getAudioMetadataFromFile(inputFile)
      duration = metadata.duration || 0
    } catch (error) {
      // Metadata extraction failed, continue without duration
      console.warn('Failed to extract metadata:', error)
    }

    // Convert using FFmpeg
    await new Promise<void>((resolve, reject) => {
      let command = ffmpeg(inputFile).toFormat(outputFormat).audioCodec(getAudioCodec(outputFormat))

      // Apply audio options
      if (options.channels) {
        command = command.audioChannels(options.channels)
      }
      if (options.sampleRate) {
        command = command.audioFrequency(options.sampleRate)
      }
      if (options.bitrate) {
        command = command.audioBitrate(options.bitrate)
      }

      command
        .on('end', () => resolve())
        .on('error', (err) => reject(new Error(`FFmpeg error: ${err.message}`)))
        .save(outputFile)
    })

    // Read output file
    const outputBuffer = await fs.readFile(outputFile)

    return {
      buffer: outputBuffer,
      format: outputFormat,
      duration,
      size: outputBuffer.length,
    }
  } finally {
    // Clean up temporary files
    try {
      await fs.unlink(inputFile).catch(() => {})
      await fs.unlink(outputFile).catch(() => {})
    } catch (error) {
      // Ignore cleanup errors
    }
  }
}

/**
 * Get audio metadata using ffprobe
 */
export async function getAudioMetadata(buffer: Buffer, mimeType: string): Promise<AudioMetadata> {
  ensureFfmpeg() // Initialize FFmpeg/ffprobe
  const tempDir = os.tmpdir()
  const inputExt = getExtensionFromMimeType(mimeType)
  const inputFile = path.join(tempDir, `ffprobe-input-${Date.now()}.${inputExt}`)

  try {
    // Write buffer to temporary file
    await fs.writeFile(inputFile, buffer)

    // Get metadata using ffprobe
    return await getAudioMetadataFromFile(inputFile)
  } finally {
    // Clean up temporary file
    try {
      await fs.unlink(inputFile).catch(() => {})
    } catch (error) {
      // Ignore cleanup errors
    }
  }
}

/**
 * Get audio metadata from a file path using ffprobe
 */
async function getAudioMetadataFromFile(filePath: string): Promise<AudioMetadata> {
  ensureFfmpeg() // Initialize FFmpeg/ffprobe
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(new Error(`FFprobe error: ${err.message}`))
        return
      }

      const audioStream = metadata.streams.find((s) => s.codec_type === 'audio')
      const format = metadata.format

      resolve({
        duration: format.duration || 0,
        format: format.format_name || 'unknown',
        codec: audioStream?.codec_name,
        sampleRate: audioStream?.sample_rate,
        channels: audioStream?.channels,
        bitrate: format.bit_rate ? Number(format.bit_rate) : undefined,
      })
    })
  })
}

/**
 * Get file extension from MIME type
 */
function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    // Video
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi',
    'video/x-matroska': 'mkv',
    'video/webm': 'webm',
    // Audio
    'audio/mpeg': 'mp3',
    'audio/mp4': 'm4a',
    'audio/wav': 'wav',
    'audio/webm': 'webm',
    'audio/ogg': 'ogg',
    'audio/flac': 'flac',
    'audio/aac': 'aac',
    'audio/opus': 'opus',
  }

  return mimeToExt[mimeType] || mimeType.split('/')[1] || 'dat'
}

/**
 * Get appropriate audio codec for output format
 */
function getAudioCodec(format: string): string {
  const codecMap: Record<string, string> = {
    mp3: 'libmp3lame',
    wav: 'pcm_s16le',
    flac: 'flac',
    m4a: 'aac',
    aac: 'aac',
    ogg: 'libvorbis',
    opus: 'libopus',
  }

  return codecMap[format] || 'libmp3lame'
}

/**
 * Check if a file is a video file
 */
export function isVideoFile(mimeType: string): boolean {
  return mimeType.startsWith('video/')
}

/**
 * Check if a file is an audio file
 */
export function isAudioFile(mimeType: string): boolean {
  return mimeType.startsWith('audio/')
}

/**
 * Get optimal audio format for STT provider
 */
export function getOptimalFormat(provider: 'whisper' | 'deepgram' | 'elevenlabs'): {
  format: 'mp3' | 'wav' | 'flac'
  sampleRate: number
  channels: 1 | 2
} {
  switch (provider) {
    case 'whisper':
      // Whisper prefers 16kHz mono
      return {
        format: 'mp3',
        sampleRate: 16000,
        channels: 1,
      }
    case 'deepgram':
      // Deepgram works well with various formats
      return {
        format: 'mp3',
        sampleRate: 16000,
        channels: 1,
      }
    case 'elevenlabs':
      // ElevenLabs format preferences
      return {
        format: 'mp3',
        sampleRate: 16000,
        channels: 1,
      }
    default:
      return {
        format: 'mp3',
        sampleRate: 16000,
        channels: 1,
      }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/lib/audio/types.ts

```typescript
export interface AudioExtractionOptions {
  outputFormat?: 'mp3' | 'wav' | 'flac'
  sampleRate?: number
  channels?: 1 | 2
  bitrate?: string
}

export interface AudioExtractionResult {
  buffer: Buffer
  format: string
  duration: number
  size: number
}

export interface AudioMetadata {
  duration: number
  format: string
  codec?: string
  sampleRate?: number
  channels?: number
  bitrate?: number
}
```

--------------------------------------------------------------------------------

---[FILE: anonymous.ts]---
Location: sim-main/apps/sim/lib/auth/anonymous.ts

```typescript
import { db } from '@sim/db'
import * as schema from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'
import { ANONYMOUS_USER, ANONYMOUS_USER_ID } from './constants'

const logger = createLogger('AnonymousAuth')

let anonymousUserEnsured = false

/**
 * Ensures the anonymous user and their stats record exist in the database.
 * Called when DISABLE_AUTH is enabled to ensure DB operations work.
 */
export async function ensureAnonymousUserExists(): Promise<void> {
  if (anonymousUserEnsured) return

  try {
    const existingUser = await db.query.user.findFirst({
      where: eq(schema.user.id, ANONYMOUS_USER_ID),
    })

    if (!existingUser) {
      const now = new Date()
      await db.insert(schema.user).values({
        ...ANONYMOUS_USER,
        createdAt: now,
        updatedAt: now,
      })
      logger.info('Created anonymous user for DISABLE_AUTH mode')
    }

    const existingStats = await db.query.userStats.findFirst({
      where: eq(schema.userStats.userId, ANONYMOUS_USER_ID),
    })

    if (!existingStats) {
      await db.insert(schema.userStats).values({
        id: crypto.randomUUID(),
        userId: ANONYMOUS_USER_ID,
        currentUsageLimit: '10000000000',
      })
      logger.info('Created anonymous user stats for DISABLE_AUTH mode')
    }

    anonymousUserEnsured = true
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes('unique') || error.message.includes('duplicate'))
    ) {
      anonymousUserEnsured = true
      return
    }
    logger.error('Failed to ensure anonymous user exists', { error })
    throw error
  }
}

export interface AnonymousSession {
  user: {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image: null
    createdAt: Date
    updatedAt: Date
  }
  session: {
    id: string
    userId: string
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
    token: string
    ipAddress: null
    userAgent: null
  }
}

/**
 * Creates an anonymous session for when auth is disabled.
 */
export function createAnonymousSession(): AnonymousSession {
  const now = new Date()
  return {
    user: {
      ...ANONYMOUS_USER,
      createdAt: now,
      updatedAt: now,
    },
    session: {
      id: 'anonymous-session',
      userId: ANONYMOUS_USER_ID,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      createdAt: now,
      updatedAt: now,
      token: 'anonymous-token',
      ipAddress: null,
      userAgent: null,
    },
  }
}
```

--------------------------------------------------------------------------------

---[FILE: auth-client.ts]---
Location: sim-main/apps/sim/lib/auth/auth-client.ts
Signals: React

```typescript
import { useContext } from 'react'
import { ssoClient } from '@better-auth/sso/client'
import { stripeClient } from '@better-auth/stripe/client'
import {
  customSessionClient,
  emailOTPClient,
  genericOAuthClient,
  organizationClient,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import type { auth } from '@/lib/auth'
import { env } from '@/lib/core/config/env'
import { isBillingEnabled } from '@/lib/core/config/feature-flags'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { SessionContext, type SessionHookResult } from '@/app/_shell/providers/session-provider'

export const client = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [
    emailOTPClient(),
    genericOAuthClient(),
    customSessionClient<typeof auth>(),
    ...(isBillingEnabled
      ? [
          stripeClient({
            subscription: true, // Enable subscription management
          }),
          organizationClient(),
        ]
      : []),
    ...(env.NEXT_PUBLIC_SSO_ENABLED ? [ssoClient()] : []),
  ],
})

export function useSession(): SessionHookResult {
  const ctx = useContext(SessionContext)
  if (!ctx) {
    throw new Error(
      'SessionProvider is not mounted. Wrap your app with <SessionProvider> in app/layout.tsx.'
    )
  }
  return ctx
}

export const useActiveOrganization = isBillingEnabled
  ? client.useActiveOrganization
  : () => ({ data: undefined, isPending: false, error: null })

export const useSubscription = () => {
  return {
    list: client.subscription?.list,
    upgrade: client.subscription?.upgrade,
    cancel: client.subscription?.cancel,
    restore: client.subscription?.restore,
  }
}

export const { signIn, signUp, signOut } = client
```

--------------------------------------------------------------------------------

````
