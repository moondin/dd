---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 577
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 577 of 933)

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

---[FILE: utils.ts]---
Location: sim-main/apps/sim/lib/mcp/utils.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import type { McpApiResponse } from '@/lib/mcp/types'

/**
 * MCP-specific constants
 */
export const MCP_CONSTANTS = {
  EXECUTION_TIMEOUT: 60000,
  CACHE_TIMEOUT: 5 * 60 * 1000, // 5 minutes
  DEFAULT_RETRIES: 3,
  DEFAULT_CONNECTION_TIMEOUT: 30000,
  MAX_CACHE_SIZE: 1000,
  MAX_CONSECUTIVE_FAILURES: 3,
} as const

/**
 * Client-safe MCP constants
 */
export const MCP_CLIENT_CONSTANTS = {
  CLIENT_TIMEOUT: 60000,
  AUTO_REFRESH_INTERVAL: 5 * 60 * 1000,
} as const

/**
 * Create standardized MCP error response
 */
export function createMcpErrorResponse(
  error: unknown,
  defaultMessage: string,
  status = 500
): NextResponse {
  const errorMessage = error instanceof Error ? error.message : defaultMessage

  const response: McpApiResponse = {
    success: false,
    error: errorMessage,
  }

  return NextResponse.json(response, { status })
}

/**
 * Create standardized MCP success response
 */
export function createMcpSuccessResponse<T>(data: T, status = 200): NextResponse {
  const response: McpApiResponse<T> = {
    success: true,
    data,
  }

  return NextResponse.json(response, { status })
}

/**
 * Validate string parameter
 * Consolidates parameter validation logic found across routes
 */
export function validateStringParam(
  value: unknown,
  paramName: string
): { isValid: true } | { isValid: false; error: string } {
  if (!value || typeof value !== 'string') {
    return {
      isValid: false,
      error: `${paramName} is required and must be a string`,
    }
  }
  return { isValid: true }
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(
  body: Record<string, unknown>,
  requiredFields: string[]
): { isValid: true } | { isValid: false; error: string } {
  const missingFields = requiredFields.filter((field) => !(field in body))

  if (missingFields.length > 0) {
    return {
      isValid: false,
      error: `Missing required fields: ${missingFields.join(', ')}`,
    }
  }

  return { isValid: true }
}

/**
 * Enhanced error categorization for more specific HTTP status codes
 */
export function categorizeError(error: unknown): { message: string; status: number } {
  if (!(error instanceof Error)) {
    return { message: 'Unknown error occurred', status: 500 }
  }

  const message = error.message.toLowerCase()

  if (message.includes('timeout')) {
    return { message: 'Request timed out', status: 408 }
  }

  if (message.includes('not found') || message.includes('not accessible')) {
    return { message: error.message, status: 404 }
  }

  if (message.includes('authentication') || message.includes('unauthorized')) {
    return { message: 'Authentication required', status: 401 }
  }

  if (
    message.includes('invalid') ||
    message.includes('missing required') ||
    message.includes('validation')
  ) {
    return { message: error.message, status: 400 }
  }

  return { message: error.message, status: 500 }
}

/**
 * Create standardized MCP tool ID from server ID and tool name
 */
export function createMcpToolId(serverId: string, toolName: string): string {
  const normalizedServerId = serverId.startsWith('mcp-') ? serverId : `mcp-${serverId}`
  return `${normalizedServerId}-${toolName}`
}

/**
 * Parse MCP tool ID to extract server ID and tool name
 */
export function parseMcpToolId(toolId: string): { serverId: string; toolName: string } {
  const parts = toolId.split('-')
  if (parts.length < 3 || parts[0] !== 'mcp') {
    throw new Error(`Invalid MCP tool ID format: ${toolId}. Expected: mcp-serverId-toolName`)
  }

  const serverId = `${parts[0]}-${parts[1]}`
  const toolName = parts.slice(2).join('-')

  return { serverId, toolName }
}

/**
 * Generate a deterministic MCP server ID based on workspace and URL.
 *
 * This ensures that re-adding the same MCP server (same URL in the same workspace)
 * produces the same ID, preventing "server not found" errors when workflows
 * reference the old server ID.
 *
 * The ID is a hash of: workspaceId + normalized URL
 * Format: mcp-<8 char hash>
 */
export function generateMcpServerId(workspaceId: string, url: string): string {
  const normalizedUrl = normalizeUrlForHashing(url)

  const input = `${workspaceId}:${normalizedUrl}`
  const hash = simpleHash(input)

  return `mcp-${hash}`
}

/**
 * Normalize URL for consistent hashing.
 * - Converts to lowercase
 * - Removes trailing slashes
 * - Removes query parameters and fragments
 */
function normalizeUrlForHashing(url: string): string {
  try {
    const parsed = new URL(url)
    const normalized = `${parsed.origin}${parsed.pathname}`.toLowerCase().replace(/\/+$/, '')
    return normalized
  } catch {
    return url.toLowerCase().trim().replace(/\/+$/, '')
  }
}

/**
 * Simple deterministic hash function that produces an 8-character hex string.
 * Uses a variant of djb2 hash algorithm.
 */
function simpleHash(str: string): string {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i)
    hash = hash >>> 0
  }
  return hash.toString(16).padStart(8, '0').slice(0, 8)
}
```

--------------------------------------------------------------------------------

---[FILE: adapter.ts]---
Location: sim-main/apps/sim/lib/mcp/storage/adapter.ts

```typescript
import type { McpTool } from '@/lib/mcp/types'

export interface McpCacheEntry {
  tools: McpTool[]
  expiry: number // Unix timestamp ms
}

export interface McpCacheStorageAdapter {
  get(key: string): Promise<McpCacheEntry | null>
  set(key: string, tools: McpTool[], ttlMs: number): Promise<void>
  delete(key: string): Promise<void>
  clear(): Promise<void>
  dispose(): void
}
```

--------------------------------------------------------------------------------

---[FILE: factory.ts]---
Location: sim-main/apps/sim/lib/mcp/storage/factory.ts

```typescript
import { getRedisClient } from '@/lib/core/config/redis'
import { createLogger } from '@/lib/logs/console/logger'
import type { McpCacheStorageAdapter } from './adapter'
import { MemoryMcpCache } from './memory-cache'
import { RedisMcpCache } from './redis-cache'

const logger = createLogger('McpCacheFactory')

let cachedAdapter: McpCacheStorageAdapter | null = null

/**
 * Create MCP cache storage adapter.
 * Uses Redis if available, falls back to in-memory cache.
 *
 * Unlike rate-limiting (which fails if Redis is configured but unavailable),
 * MCP caching gracefully falls back to memory since it's an optimization.
 */
export function createMcpCacheAdapter(): McpCacheStorageAdapter {
  if (cachedAdapter) {
    return cachedAdapter
  }

  const redis = getRedisClient()

  if (redis) {
    logger.info('MCP cache: Using Redis')
    cachedAdapter = new RedisMcpCache(redis)
  } else {
    logger.info('MCP cache: Using in-memory (Redis not configured)')
    cachedAdapter = new MemoryMcpCache()
  }

  return cachedAdapter
}

/**
 * Get the current adapter type for logging/debugging
 */
export function getMcpCacheType(): 'redis' | 'memory' {
  const redis = getRedisClient()
  return redis ? 'redis' : 'memory'
}

/**
 * Reset the cached adapter.
 * Only use for testing purposes.
 */
export function resetMcpCacheAdapter(): void {
  if (cachedAdapter) {
    cachedAdapter.dispose()
    cachedAdapter = null
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/lib/mcp/storage/index.ts

```typescript
export type { McpCacheEntry, McpCacheStorageAdapter } from './adapter'
export { createMcpCacheAdapter, getMcpCacheType, resetMcpCacheAdapter } from './factory'
export { MemoryMcpCache } from './memory-cache'
export { RedisMcpCache } from './redis-cache'
```

--------------------------------------------------------------------------------

---[FILE: memory-cache.ts]---
Location: sim-main/apps/sim/lib/mcp/storage/memory-cache.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { McpTool } from '@/lib/mcp/types'
import { MCP_CONSTANTS } from '@/lib/mcp/utils'
import type { McpCacheEntry, McpCacheStorageAdapter } from './adapter'

const logger = createLogger('McpMemoryCache')

export class MemoryMcpCache implements McpCacheStorageAdapter {
  private cache = new Map<string, McpCacheEntry>()
  private readonly maxCacheSize = MCP_CONSTANTS.MAX_CACHE_SIZE
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    this.startPeriodicCleanup()
  }

  private startPeriodicCleanup(): void {
    this.cleanupInterval = setInterval(
      () => {
        this.cleanupExpiredEntries()
      },
      5 * 60 * 1000 // 5 minutes
    )
    // Don't keep Node process alive just for cache cleanup
    this.cleanupInterval.unref()
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now()
    const expiredKeys: string[] = []

    this.cache.forEach((entry, key) => {
      if (entry.expiry <= now) {
        expiredKeys.push(key)
      }
    })

    expiredKeys.forEach((key) => this.cache.delete(key))

    if (expiredKeys.length > 0) {
      logger.debug(`Cleaned up ${expiredKeys.length} expired cache entries`)
    }
  }

  private evictIfNeeded(): void {
    if (this.cache.size <= this.maxCacheSize) {
      return
    }

    // Evict oldest entries (by insertion order - Map maintains order)
    const entriesToRemove = this.cache.size - this.maxCacheSize
    const keys = Array.from(this.cache.keys()).slice(0, entriesToRemove)
    keys.forEach((key) => this.cache.delete(key))

    logger.debug(`Evicted ${entriesToRemove} cache entries`)
  }

  async get(key: string): Promise<McpCacheEntry | null> {
    const entry = this.cache.get(key)
    const now = Date.now()

    if (!entry || entry.expiry <= now) {
      if (entry) {
        this.cache.delete(key)
      }
      return null
    }

    // Return copy to prevent caller from mutating cache
    return {
      tools: entry.tools,
      expiry: entry.expiry,
    }
  }

  async set(key: string, tools: McpTool[], ttlMs: number): Promise<void> {
    const now = Date.now()
    const entry: McpCacheEntry = {
      tools,
      expiry: now + ttlMs,
    }

    this.cache.set(key, entry)
    this.evictIfNeeded()
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key)
  }

  async clear(): Promise<void> {
    this.cache.clear()
  }

  dispose(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.cache.clear()
    logger.info('Memory cache disposed')
  }
}
```

--------------------------------------------------------------------------------

---[FILE: redis-cache.ts]---
Location: sim-main/apps/sim/lib/mcp/storage/redis-cache.ts

```typescript
import type Redis from 'ioredis'
import { createLogger } from '@/lib/logs/console/logger'
import type { McpTool } from '@/lib/mcp/types'
import type { McpCacheEntry, McpCacheStorageAdapter } from './adapter'

const logger = createLogger('McpRedisCache')

const REDIS_KEY_PREFIX = 'mcp:tools:'

export class RedisMcpCache implements McpCacheStorageAdapter {
  constructor(private redis: Redis) {}

  private getKey(key: string): string {
    return `${REDIS_KEY_PREFIX}${key}`
  }

  async get(key: string): Promise<McpCacheEntry | null> {
    try {
      const redisKey = this.getKey(key)
      const data = await this.redis.get(redisKey)

      if (!data) {
        return null
      }

      try {
        return JSON.parse(data) as McpCacheEntry
      } catch {
        // Corrupted data - delete and treat as miss
        logger.warn('Corrupted cache entry, deleting:', redisKey)
        await this.redis.del(redisKey)
        return null
      }
    } catch (error) {
      logger.error('Redis cache get error:', error)
      throw error
    }
  }

  async set(key: string, tools: McpTool[], ttlMs: number): Promise<void> {
    try {
      const now = Date.now()
      const entry: McpCacheEntry = {
        tools,
        expiry: now + ttlMs,
      }

      await this.redis.set(this.getKey(key), JSON.stringify(entry), 'PX', ttlMs)
    } catch (error) {
      logger.error('Redis cache set error:', error)
      throw error
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(this.getKey(key))
    } catch (error) {
      logger.error('Redis cache delete error:', error)
      throw error
    }
  }

  async clear(): Promise<void> {
    try {
      let cursor = '0'
      let deletedCount = 0

      do {
        const [nextCursor, keys] = await this.redis.scan(
          cursor,
          'MATCH',
          `${REDIS_KEY_PREFIX}*`,
          'COUNT',
          100
        )
        cursor = nextCursor

        if (keys.length > 0) {
          await this.redis.del(...keys)
          deletedCount += keys.length
        }
      } while (cursor !== '0')

      logger.debug(`Cleared ${deletedCount} MCP cache entries from Redis`)
    } catch (error) {
      logger.error('Redis cache clear error:', error)
      throw error
    }
  }

  dispose(): void {
    // Redis client is managed externally, nothing to dispose
    logger.info('Redis cache adapter disposed')
  }
}
```

--------------------------------------------------------------------------------

---[FILE: mailer.test.ts]---
Location: sim-main/apps/sim/lib/messaging/email/mailer.test.ts

```typescript
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'

const mockSend = vi.fn()
const mockBatchSend = vi.fn()
const mockAzureBeginSend = vi.fn()
const mockAzurePollUntilDone = vi.fn()

vi.mock('resend', () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: (...args: any[]) => mockSend(...args),
      },
      batch: {
        send: (...args: any[]) => mockBatchSend(...args),
      },
    })),
  }
})

vi.mock('@azure/communication-email', () => {
  return {
    EmailClient: vi.fn().mockImplementation(() => ({
      beginSend: (...args: any[]) => mockAzureBeginSend(...args),
    })),
  }
})

vi.mock('@/lib/messaging/email/unsubscribe', () => ({
  isUnsubscribed: vi.fn(),
  generateUnsubscribeToken: vi.fn(),
}))

vi.mock('@/lib/core/config/env', () => ({
  env: {
    RESEND_API_KEY: 'test-api-key',
    AZURE_ACS_CONNECTION_STRING: 'test-azure-connection-string',
    AZURE_COMMUNICATION_EMAIL_DOMAIN: 'test.azurecomm.net',
    NEXT_PUBLIC_APP_URL: 'https://test.sim.ai',
    FROM_EMAIL_ADDRESS: 'Sim <noreply@sim.ai>',
  },
}))

vi.mock('@/lib/core/utils/urls', () => ({
  getEmailDomain: vi.fn().mockReturnValue('sim.ai'),
  getBaseUrl: vi.fn().mockReturnValue('https://test.sim.ai'),
}))

import { type EmailType, sendBatchEmails, sendEmail } from '@/lib/messaging/email/mailer'
import { generateUnsubscribeToken, isUnsubscribed } from '@/lib/messaging/email/unsubscribe'

describe('mailer', () => {
  const testEmailOptions = {
    to: 'test@example.com',
    subject: 'Test Subject',
    html: '<p>Test email content</p>',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(isUnsubscribed as Mock).mockResolvedValue(false)
    ;(generateUnsubscribeToken as Mock).mockReturnValue('mock-token-123')

    // Mock successful Resend response
    mockSend.mockResolvedValue({
      data: { id: 'test-email-id' },
      error: null,
    })

    mockBatchSend.mockResolvedValue({
      data: [{ id: 'batch-email-1' }, { id: 'batch-email-2' }],
      error: null,
    })

    // Mock successful Azure response
    mockAzurePollUntilDone.mockResolvedValue({
      status: 'Succeeded',
      id: 'azure-email-id',
    })

    mockAzureBeginSend.mockReturnValue({
      pollUntilDone: mockAzurePollUntilDone,
    })
  })

  describe('sendEmail', () => {
    it('should send a transactional email successfully', async () => {
      const result = await sendEmail({
        ...testEmailOptions,
        emailType: 'transactional',
      })

      expect(result.success).toBe(true)
      expect(result.message).toBe('Email sent successfully via Resend')
      expect(result.data).toEqual({ id: 'test-email-id' })

      // Should not check unsubscribe status for transactional emails
      expect(isUnsubscribed).not.toHaveBeenCalled()

      // Should call Resend with correct parameters
      expect(mockSend).toHaveBeenCalledWith({
        from: 'Sim <noreply@sim.ai>',
        to: testEmailOptions.to,
        subject: testEmailOptions.subject,
        html: testEmailOptions.html,
        headers: undefined, // No unsubscribe headers for transactional
      })
    })

    it('should send a marketing email with unsubscribe headers', async () => {
      const htmlWithToken = '<p>Test content</p><a href="{{UNSUBSCRIBE_TOKEN}}">Unsubscribe</a>'

      const result = await sendEmail({
        ...testEmailOptions,
        html: htmlWithToken,
        emailType: 'marketing',
      })

      expect(result.success).toBe(true)

      // Should check unsubscribe status
      expect(isUnsubscribed).toHaveBeenCalledWith(testEmailOptions.to, 'marketing')

      // Should generate unsubscribe token
      expect(generateUnsubscribeToken).toHaveBeenCalledWith(testEmailOptions.to, 'marketing')

      // Should call Resend with unsubscribe headers
      expect(mockSend).toHaveBeenCalledWith({
        from: 'Sim <noreply@sim.ai>',
        to: testEmailOptions.to,
        subject: testEmailOptions.subject,
        html: '<p>Test content</p><a href="mock-token-123">Unsubscribe</a>',
        headers: {
          'List-Unsubscribe':
            '<https://test.sim.ai/unsubscribe?token=mock-token-123&email=test%40example.com>',
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      })
    })

    it('should skip sending if user has unsubscribed', async () => {
      ;(isUnsubscribed as Mock).mockResolvedValue(true)

      const result = await sendEmail({
        ...testEmailOptions,
        emailType: 'marketing',
      })

      expect(result.success).toBe(true)
      expect(result.message).toBe('Email skipped (user unsubscribed)')
      expect(result.data).toEqual({ id: 'skipped-unsubscribed' })

      // Should not call Resend
      expect(mockSend).not.toHaveBeenCalled()
    })

    it.concurrent('should handle Resend API errors and fallback to Azure', async () => {
      // Mock Resend to fail
      mockSend.mockResolvedValue({
        data: null,
        error: { message: 'API rate limit exceeded' },
      })

      const result = await sendEmail(testEmailOptions)

      expect(result.success).toBe(true)
      expect(result.message).toBe('Email sent successfully via Azure Communication Services')
      expect(result.data).toEqual({ id: 'azure-email-id' })

      // Should have tried Resend first
      expect(mockSend).toHaveBeenCalled()

      // Should have fallen back to Azure
      expect(mockAzureBeginSend).toHaveBeenCalled()
    })

    it.concurrent('should handle unexpected errors and fallback to Azure', async () => {
      // Mock Resend to throw an error
      mockSend.mockRejectedValue(new Error('Network error'))

      const result = await sendEmail(testEmailOptions)

      expect(result.success).toBe(true)
      expect(result.message).toBe('Email sent successfully via Azure Communication Services')
      expect(result.data).toEqual({ id: 'azure-email-id' })

      // Should have tried Resend first
      expect(mockSend).toHaveBeenCalled()

      // Should have fallen back to Azure
      expect(mockAzureBeginSend).toHaveBeenCalled()
    })

    it.concurrent('should use custom from address when provided', async () => {
      await sendEmail({
        ...testEmailOptions,
        from: 'custom@example.com',
      })

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'custom@example.com',
        })
      )
    })

    it('should not include unsubscribe when includeUnsubscribe is false', async () => {
      await sendEmail({
        ...testEmailOptions,
        emailType: 'marketing',
        includeUnsubscribe: false,
      })

      expect(generateUnsubscribeToken).not.toHaveBeenCalled()
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: undefined,
        })
      )
    })

    it.concurrent('should replace unsubscribe token placeholders in HTML', async () => {
      const htmlWithPlaceholder = '<p>Content</p><a href="{{UNSUBSCRIBE_TOKEN}}">Unsubscribe</a>'

      await sendEmail({
        ...testEmailOptions,
        html: htmlWithPlaceholder,
        emailType: 'updates' as EmailType,
      })

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          html: '<p>Content</p><a href="mock-token-123">Unsubscribe</a>',
        })
      )
    })
  })

  describe('Azure Communication Services fallback', () => {
    it('should fallback to Azure when Resend fails', async () => {
      // Mock Resend to fail
      mockSend.mockRejectedValue(new Error('Resend service unavailable'))

      const result = await sendEmail({
        ...testEmailOptions,
        emailType: 'transactional',
      })

      expect(result.success).toBe(true)
      expect(result.message).toBe('Email sent successfully via Azure Communication Services')
      expect(result.data).toEqual({ id: 'azure-email-id' })

      // Should have tried Resend first
      expect(mockSend).toHaveBeenCalled()

      // Should have fallen back to Azure
      expect(mockAzureBeginSend).toHaveBeenCalledWith({
        senderAddress: 'noreply@sim.ai',
        content: {
          subject: testEmailOptions.subject,
          html: testEmailOptions.html,
        },
        recipients: {
          to: [{ address: testEmailOptions.to }],
        },
        headers: {},
      })
    })

    it('should handle Azure Communication Services failure', async () => {
      // Mock both services to fail
      mockSend.mockRejectedValue(new Error('Resend service unavailable'))
      mockAzurePollUntilDone.mockResolvedValue({
        status: 'Failed',
        id: 'failed-id',
      })

      const result = await sendEmail({
        ...testEmailOptions,
        emailType: 'transactional',
      })

      expect(result.success).toBe(false)
      expect(result.message).toBe('Both Resend and Azure Communication Services failed')

      // Should have tried both services
      expect(mockSend).toHaveBeenCalled()
      expect(mockAzureBeginSend).toHaveBeenCalled()
    })
  })

  describe('sendBatchEmails', () => {
    const testBatchEmails = [
      { ...testEmailOptions, to: 'user1@example.com' },
      { ...testEmailOptions, to: 'user2@example.com' },
    ]

    it('should send batch emails via Resend successfully', async () => {
      const result = await sendBatchEmails({ emails: testBatchEmails })

      expect(result.success).toBe(true)
      expect(result.message).toBe('All batch emails sent successfully via Resend')
      expect(result.results).toHaveLength(2)
      expect(mockBatchSend).toHaveBeenCalled()
    })

    it('should fallback to individual sends when Resend batch fails', async () => {
      // Mock Resend batch to fail
      mockBatchSend.mockRejectedValue(new Error('Batch service unavailable'))

      const result = await sendBatchEmails({ emails: testBatchEmails })

      expect(result.success).toBe(true)
      expect(result.message).toBe('All batch emails sent successfully')
      expect(result.results).toHaveLength(2)

      // Should have tried Resend batch first
      expect(mockBatchSend).toHaveBeenCalled()

      // Should have fallen back to individual sends (which will use Resend since it's available)
      expect(mockSend).toHaveBeenCalledTimes(2)
    })

    it('should handle mixed success/failure in individual fallback', async () => {
      // Mock Resend batch to fail
      mockBatchSend.mockRejectedValue(new Error('Batch service unavailable'))

      // Mock first individual send to succeed, second to fail and Azure also fails
      mockSend
        .mockResolvedValueOnce({
          data: { id: 'email-1' },
          error: null,
        })
        .mockRejectedValueOnce(new Error('Individual send failure'))

      // Mock Azure to fail for the second email (first call succeeds, but second fails)
      mockAzurePollUntilDone.mockResolvedValue({
        status: 'Failed',
        id: 'failed-id',
      })

      const result = await sendBatchEmails({ emails: testBatchEmails })

      expect(result.success).toBe(false)
      expect(result.message).toBe('1/2 emails sent successfully')
      expect(result.results).toHaveLength(2)
      expect(result.results[0].success).toBe(true)
      expect(result.results[1].success).toBe(false)
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: mailer.ts]---
Location: sim-main/apps/sim/lib/messaging/email/mailer.ts

```typescript
import { EmailClient, type EmailMessage } from '@azure/communication-email'
import { Resend } from 'resend'
import { env } from '@/lib/core/config/env'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import { generateUnsubscribeToken, isUnsubscribed } from '@/lib/messaging/email/unsubscribe'
import { getFromEmailAddress } from '@/lib/messaging/email/utils'

const logger = createLogger('Mailer')

export type EmailType = 'transactional' | 'marketing' | 'updates' | 'notifications'

export interface EmailAttachment {
  filename: string
  content: string | Buffer
  contentType: string
  disposition?: 'attachment' | 'inline'
}

export interface EmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  from?: string
  emailType?: EmailType
  includeUnsubscribe?: boolean
  attachments?: EmailAttachment[]
  replyTo?: string
}

export interface BatchEmailOptions {
  emails: EmailOptions[]
}

export interface SendEmailResult {
  success: boolean
  message: string
  data?: any
}

export interface BatchSendEmailResult {
  success: boolean
  message: string
  results: SendEmailResult[]
  data?: any
}

interface ProcessedEmailData {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  senderEmail: string
  headers: Record<string, string>
  attachments?: EmailAttachment[]
  replyTo?: string
}

const resendApiKey = env.RESEND_API_KEY
const azureConnectionString = env.AZURE_ACS_CONNECTION_STRING

const resend =
  resendApiKey && resendApiKey !== 'placeholder' && resendApiKey.trim() !== ''
    ? new Resend(resendApiKey)
    : null

const azureEmailClient =
  azureConnectionString && azureConnectionString.trim() !== ''
    ? new EmailClient(azureConnectionString)
    : null

/**
 * Check if any email service is configured and available
 */
export function hasEmailService(): boolean {
  return !!(resend || azureEmailClient)
}

export async function sendEmail(options: EmailOptions): Promise<SendEmailResult> {
  try {
    // Check if user has unsubscribed (skip for critical transactional emails)
    if (options.emailType !== 'transactional') {
      const unsubscribeType = options.emailType as 'marketing' | 'updates' | 'notifications'
      // For arrays, check the first email address (batch emails typically go to similar recipients)
      const primaryEmail = Array.isArray(options.to) ? options.to[0] : options.to
      const hasUnsubscribed = await isUnsubscribed(primaryEmail, unsubscribeType)
      if (hasUnsubscribed) {
        logger.info('Email not sent (user unsubscribed):', {
          to: options.to,
          subject: options.subject,
          emailType: options.emailType,
        })
        return {
          success: true,
          message: 'Email skipped (user unsubscribed)',
          data: { id: 'skipped-unsubscribed' },
        }
      }
    }

    // Process email data with unsubscribe tokens and headers
    const processedData = await processEmailData(options)

    // Try Resend first if configured
    if (resend) {
      try {
        return await sendWithResend(processedData)
      } catch (error) {
        logger.warn('Resend failed, attempting Azure Communication Services fallback:', error)
      }
    }

    // Fallback to Azure Communication Services if configured
    if (azureEmailClient) {
      try {
        return await sendWithAzure(processedData)
      } catch (error) {
        logger.error('Azure Communication Services also failed:', error)
        return {
          success: false,
          message: 'Both Resend and Azure Communication Services failed',
        }
      }
    }

    // No email service configured
    logger.info('Email not sent (no email service configured):', {
      to: options.to,
      subject: options.subject,
      from: processedData.senderEmail,
    })
    return {
      success: true,
      message: 'Email logging successful (no email service configured)',
      data: { id: 'mock-email-id' },
    }
  } catch (error) {
    logger.error('Error sending email:', error)
    return {
      success: false,
      message: 'Failed to send email',
    }
  }
}

async function processEmailData(options: EmailOptions): Promise<ProcessedEmailData> {
  const {
    to,
    subject,
    html,
    text,
    from,
    emailType = 'transactional',
    includeUnsubscribe = true,
    attachments,
    replyTo,
  } = options

  const senderEmail = from || getFromEmailAddress()

  // Generate unsubscribe token and add to content
  let finalHtml = html
  let finalText = text
  const headers: Record<string, string> = {}

  if (includeUnsubscribe && emailType !== 'transactional') {
    // For arrays, use the first email for unsubscribe (batch emails typically go to similar recipients)
    const primaryEmail = Array.isArray(to) ? to[0] : to
    const unsubscribeToken = generateUnsubscribeToken(primaryEmail, emailType)
    const baseUrl = getBaseUrl()
    const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${unsubscribeToken}&email=${encodeURIComponent(primaryEmail)}`

    headers['List-Unsubscribe'] = `<${unsubscribeUrl}>`
    headers['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click'

    if (html) {
      finalHtml = html.replace(/\{\{UNSUBSCRIBE_TOKEN\}\}/g, unsubscribeToken)
    }
    if (text) {
      finalText = text.replace(/\{\{UNSUBSCRIBE_TOKEN\}\}/g, unsubscribeToken)
    }
  }

  return {
    to,
    subject,
    html: finalHtml,
    text: finalText,
    senderEmail,
    headers,
    attachments,
    replyTo,
  }
}

async function sendWithResend(data: ProcessedEmailData): Promise<SendEmailResult> {
  if (!resend) throw new Error('Resend not configured')

  const fromAddress = data.senderEmail

  const emailData: any = {
    from: fromAddress,
    to: data.to,
    subject: data.subject,
    headers: Object.keys(data.headers).length > 0 ? data.headers : undefined,
  }

  if (data.html) emailData.html = data.html
  if (data.text) emailData.text = data.text
  if (data.replyTo) emailData.replyTo = data.replyTo
  if (data.attachments) {
    emailData.attachments = data.attachments.map((att) => ({
      filename: att.filename,
      content: typeof att.content === 'string' ? att.content : att.content.toString('base64'),
      contentType: att.contentType,
      disposition: att.disposition || 'attachment',
    }))
  }

  const { data: responseData, error } = await resend.emails.send(emailData)

  if (error) {
    throw new Error(error.message || 'Failed to send email via Resend')
  }

  return {
    success: true,
    message: 'Email sent successfully via Resend',
    data: responseData,
  }
}

async function sendWithAzure(data: ProcessedEmailData): Promise<SendEmailResult> {
  if (!azureEmailClient) throw new Error('Azure Communication Services not configured')

  // Azure Communication Services requires at least one content type
  if (!data.html && !data.text) {
    throw new Error('Azure Communication Services requires either HTML or text content')
  }

  // For Azure, use just the email address part (no display name)
  // Azure will use the display name configured in the portal for the sender address
  const senderEmailOnly = data.senderEmail.includes('<')
    ? data.senderEmail.match(/<(.+)>/)?.[1] || data.senderEmail
    : data.senderEmail

  const message: EmailMessage = {
    senderAddress: senderEmailOnly,
    content: data.html
      ? {
          subject: data.subject,
          html: data.html,
        }
      : {
          subject: data.subject,
          plainText: data.text!,
        },
    recipients: {
      to: Array.isArray(data.to)
        ? data.to.map((email) => ({ address: email }))
        : [{ address: data.to }],
    },
    headers: data.headers,
  }

  const poller = await azureEmailClient.beginSend(message)
  const result = await poller.pollUntilDone()

  if (result.status === 'Succeeded') {
    return {
      success: true,
      message: 'Email sent successfully via Azure Communication Services',
      data: { id: result.id },
    }
  }
  throw new Error(`Azure Communication Services failed with status: ${result.status}`)
}

export async function sendBatchEmails(options: BatchEmailOptions): Promise<BatchSendEmailResult> {
  try {
    const results: SendEmailResult[] = []

    // Try Resend first for batch emails if available
    if (resend) {
      try {
        return await sendBatchWithResend(options.emails)
      } catch (error) {
        logger.warn('Resend batch failed, falling back to individual sends:', error)
      }
    }

    // Fallback to individual sends (works with both Azure and Resend)
    logger.info('Sending batch emails individually')
    for (const email of options.emails) {
      try {
        const result = await sendEmail(email)
        results.push(result)
      } catch (error) {
        results.push({
          success: false,
          message: error instanceof Error ? error.message : 'Failed to send email',
        })
      }
    }

    const successCount = results.filter((r) => r.success).length
    return {
      success: successCount === results.length,
      message:
        successCount === results.length
          ? 'All batch emails sent successfully'
          : `${successCount}/${results.length} emails sent successfully`,
      results,
      data: { count: successCount },
    }
  } catch (error) {
    logger.error('Error in batch email sending:', error)
    return {
      success: false,
      message: 'Failed to send batch emails',
      results: [],
    }
  }
}

async function sendBatchWithResend(emails: EmailOptions[]): Promise<BatchSendEmailResult> {
  if (!resend) throw new Error('Resend not configured')

  const results: SendEmailResult[] = []
  const batchEmails = emails.map((email) => {
    const senderEmail = email.from || getFromEmailAddress()
    const emailData: any = {
      from: senderEmail,
      to: email.to,
      subject: email.subject,
    }
    if (email.html) emailData.html = email.html
    if (email.text) emailData.text = email.text
    return emailData
  })

  try {
    const response = await resend.batch.send(batchEmails as any)

    if (response.error) {
      throw new Error(response.error.message || 'Resend batch API error')
    }

    // Success - create results for each email
    batchEmails.forEach((_, index) => {
      results.push({
        success: true,
        message: 'Email sent successfully via Resend batch',
        data: { id: `batch-${index}` },
      })
    })

    return {
      success: true,
      message: 'All batch emails sent successfully via Resend',
      results,
      data: { count: results.length },
    }
  } catch (error) {
    logger.error('Resend batch send failed:', error)
    throw error // Let the caller handle fallback
  }
}
```

--------------------------------------------------------------------------------

---[FILE: unsubscribe.test.ts]---
Location: sim-main/apps/sim/lib/messaging/email/unsubscribe.test.ts

```typescript
import { describe, expect, it, vi } from 'vitest'
import type { EmailType } from '@/lib/messaging/email/mailer'
import {
  generateUnsubscribeToken,
  isTransactionalEmail,
  verifyUnsubscribeToken,
} from '@/lib/messaging/email/unsubscribe'

vi.mock('@/lib/core/config/env', () => ({
  env: {
    BETTER_AUTH_SECRET: 'test-secret-key',
  },
  isTruthy: (value: string | boolean | number | undefined) =>
    typeof value === 'string' ? value === 'true' || value === '1' : Boolean(value),
  getEnv: (variable: string) => process.env[variable],
}))

describe('unsubscribe utilities', () => {
  const testEmail = 'test@example.com'
  const testEmailType = 'marketing'

  describe('generateUnsubscribeToken', () => {
    it.concurrent('should generate a token with salt:hash:emailType format', () => {
      const token = generateUnsubscribeToken(testEmail, testEmailType)
      const parts = token.split(':')

      expect(parts).toHaveLength(3)
      expect(parts[0]).toHaveLength(32) // Salt should be 32 chars (16 bytes hex)
      expect(parts[1]).toHaveLength(64) // SHA256 hash should be 64 chars
      expect(parts[2]).toBe(testEmailType)
    })

    it.concurrent(
      'should generate different tokens for the same email (due to random salt)',
      () => {
        const token1 = generateUnsubscribeToken(testEmail, testEmailType)
        const token2 = generateUnsubscribeToken(testEmail, testEmailType)

        expect(token1).not.toBe(token2)
      }
    )

    it.concurrent('should default to marketing email type', () => {
      const token = generateUnsubscribeToken(testEmail)
      const parts = token.split(':')

      expect(parts[2]).toBe('marketing')
    })

    it.concurrent('should generate different tokens for different email types', () => {
      const marketingToken = generateUnsubscribeToken(testEmail, 'marketing')
      const updatesToken = generateUnsubscribeToken(testEmail, 'updates')

      expect(marketingToken).not.toBe(updatesToken)
    })
  })

  describe('verifyUnsubscribeToken', () => {
    it.concurrent('should verify a valid token', () => {
      const token = generateUnsubscribeToken(testEmail, testEmailType)
      const result = verifyUnsubscribeToken(testEmail, token)

      expect(result.valid).toBe(true)
      expect(result.emailType).toBe(testEmailType)
    })

    it.concurrent('should reject an invalid token', () => {
      const invalidToken = 'invalid:token:format'
      const result = verifyUnsubscribeToken(testEmail, invalidToken)

      expect(result.valid).toBe(false)
      expect(result.emailType).toBe('format')
    })

    it.concurrent('should reject a token for wrong email', () => {
      const token = generateUnsubscribeToken(testEmail, testEmailType)
      const result = verifyUnsubscribeToken('wrong@example.com', token)

      expect(result.valid).toBe(false)
    })

    it.concurrent('should handle legacy tokens (2 parts) and default to marketing', () => {
      // Generate a real legacy token using the actual hashing logic to ensure backward compatibility
      const salt = 'abc123'
      const secret = 'test-secret-key'
      const { createHash } = require('crypto')
      const hash = createHash('sha256').update(`${testEmail}:${salt}:${secret}`).digest('hex')
      const legacyToken = `${salt}:${hash}`

      // This should return valid since we're using the actual legacy format properly
      const result = verifyUnsubscribeToken(testEmail, legacyToken)
      expect(result.valid).toBe(true)
      expect(result.emailType).toBe('marketing') // Should default to marketing for legacy tokens
    })

    it.concurrent('should reject malformed tokens', () => {
      const malformedTokens = ['', 'single-part', 'too:many:parts:here:invalid', ':empty:parts:']

      malformedTokens.forEach((token) => {
        const result = verifyUnsubscribeToken(testEmail, token)
        expect(result.valid).toBe(false)
      })
    })
  })

  describe('isTransactionalEmail', () => {
    it.concurrent('should identify transactional emails correctly', () => {
      expect(isTransactionalEmail('transactional')).toBe(true)
    })

    it.concurrent('should identify non-transactional emails correctly', () => {
      const nonTransactionalTypes: EmailType[] = ['marketing', 'updates', 'notifications']

      nonTransactionalTypes.forEach((type) => {
        expect(isTransactionalEmail(type)).toBe(false)
      })
    })
  })
})
```

--------------------------------------------------------------------------------

````
