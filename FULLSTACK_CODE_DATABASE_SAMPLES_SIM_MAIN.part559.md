---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 559
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 559 of 933)

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

---[FILE: redis.ts]---
Location: sim-main/apps/sim/lib/core/config/redis.ts

```typescript
import Redis from 'ioredis'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('Redis')

const redisUrl = env.REDIS_URL

let globalRedisClient: Redis | null = null

/**
 * Get a Redis client instance.
 * Uses connection pooling to reuse connections across requests.
 *
 * ioredis handles command queuing internally via `enableOfflineQueue` (default: true),
 * so commands are queued and executed once connected. No manual connection checks needed.
 */
export function getRedisClient(): Redis | null {
  if (typeof window !== 'undefined') return null
  if (!redisUrl) return null
  if (globalRedisClient) return globalRedisClient

  try {
    logger.info('Initializing Redis client')

    globalRedisClient = new Redis(redisUrl, {
      keepAlive: 1000,
      connectTimeout: 10000,
      commandTimeout: 5000,
      maxRetriesPerRequest: 5,
      enableOfflineQueue: true,

      retryStrategy: (times) => {
        if (times > 10) {
          logger.error(`Redis reconnection attempt ${times}`, { nextRetryMs: 30000 })
          return 30000
        }
        const delay = Math.min(times * 500, 5000)
        logger.warn(`Redis reconnecting`, { attempt: times, nextRetryMs: delay })
        return delay
      },

      reconnectOnError: (err) => {
        const targetErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED']
        return targetErrors.some((e) => err.message.includes(e))
      },
    })

    globalRedisClient.on('connect', () => logger.info('Redis connected'))
    globalRedisClient.on('ready', () => logger.info('Redis ready'))
    globalRedisClient.on('error', (err: Error) => {
      logger.error('Redis error', { error: err.message, code: (err as any).code })
    })
    globalRedisClient.on('close', () => logger.warn('Redis connection closed'))
    globalRedisClient.on('end', () => logger.error('Redis connection ended'))

    return globalRedisClient
  } catch (error) {
    logger.error('Failed to initialize Redis client', { error })
    return null
  }
}

/**
 * Check if Redis is ready for commands.
 * Use for health checks only - commands should be sent regardless (ioredis queues them).
 */
export function isRedisConnected(): boolean {
  return globalRedisClient?.status === 'ready'
}

/**
 * Get Redis connection status for diagnostics.
 */
export function getRedisStatus(): string {
  return globalRedisClient?.status ?? 'not initialized'
}

const MESSAGE_ID_PREFIX = 'processed:'
const MESSAGE_ID_EXPIRY = 60 * 60 * 24 * 7

/**
 * Check if a message has been processed (for idempotency).
 * Requires Redis - throws if Redis is not available.
 */
export async function hasProcessedMessage(key: string): Promise<boolean> {
  const redis = getRedisClient()
  if (!redis) {
    throw new Error('Redis not available for message deduplication')
  }

  const result = await redis.exists(`${MESSAGE_ID_PREFIX}${key}`)
  return result === 1
}

/**
 * Mark a message as processed (for idempotency).
 * Requires Redis - throws if Redis is not available.
 */
export async function markMessageAsProcessed(
  key: string,
  expirySeconds: number = MESSAGE_ID_EXPIRY
): Promise<void> {
  const redis = getRedisClient()
  if (!redis) {
    throw new Error('Redis not available for message deduplication')
  }

  await redis.set(`${MESSAGE_ID_PREFIX}${key}`, '1', 'EX', expirySeconds)
}

/**
 * Lua script for safe lock release.
 * Only deletes the key if the value matches (ownership verification).
 * Returns 1 if deleted, 0 if not (value mismatch or key doesn't exist).
 */
const RELEASE_LOCK_SCRIPT = `
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
else
  return 0
end
`

/**
 * Acquire a distributed lock using Redis SET NX.
 * Returns true if lock acquired, false if already held.
 * Requires Redis - throws if Redis is not available.
 */
export async function acquireLock(
  lockKey: string,
  value: string,
  expirySeconds: number
): Promise<boolean> {
  const redis = getRedisClient()
  if (!redis) {
    throw new Error('Redis not available for distributed locking')
  }

  const result = await redis.set(lockKey, value, 'EX', expirySeconds, 'NX')
  return result === 'OK'
}

/**
 * Get the value of a lock key.
 * Requires Redis - throws if Redis is not available.
 */
export async function getLockValue(key: string): Promise<string | null> {
  const redis = getRedisClient()
  if (!redis) {
    throw new Error('Redis not available')
  }

  return redis.get(key)
}

/**
 * Release a distributed lock safely.
 * Only releases if the caller owns the lock (value matches).
 * Returns true if lock was released, false if not owned or already expired.
 * Requires Redis - throws if Redis is not available.
 */
export async function releaseLock(lockKey: string, value: string): Promise<boolean> {
  const redis = getRedisClient()
  if (!redis) {
    throw new Error('Redis not available for distributed locking')
  }

  const result = await redis.eval(RELEASE_LOCK_SCRIPT, 1, lockKey, value)
  return result === 1
}

/**
 * Close the Redis connection.
 * Use for graceful shutdown.
 */
export async function closeRedisConnection(): Promise<void> {
  if (globalRedisClient) {
    try {
      await globalRedisClient.quit()
    } catch (error) {
      logger.error('Error closing Redis connection', { error })
    } finally {
      globalRedisClient = null
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: cleanup.ts]---
Location: sim-main/apps/sim/lib/core/idempotency/cleanup.ts

```typescript
import { db } from '@sim/db'
import { idempotencyKey } from '@sim/db/schema'
import { and, eq, lt } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('IdempotencyCleanup')

export interface CleanupOptions {
  /**
   * Maximum age of idempotency keys in seconds before they're considered expired
   * Default: 7 days (604800 seconds)
   */
  maxAgeSeconds?: number

  /**
   * Maximum number of keys to delete in a single batch
   * Default: 1000
   */
  batchSize?: number

  /**
   * Specific namespace to clean up, or undefined to clean all namespaces
   */
  namespace?: string
}

/**
 * Clean up expired idempotency keys from the database
 */
export async function cleanupExpiredIdempotencyKeys(
  options: CleanupOptions = {}
): Promise<{ deleted: number; errors: string[] }> {
  const {
    maxAgeSeconds = 7 * 24 * 60 * 60, // 7 days
    batchSize = 1000,
    namespace,
  } = options

  const errors: string[] = []
  let totalDeleted = 0

  try {
    const cutoffDate = new Date(Date.now() - maxAgeSeconds * 1000)

    logger.info('Starting idempotency key cleanup', {
      cutoffDate: cutoffDate.toISOString(),
      namespace: namespace || 'all',
      batchSize,
    })

    let hasMore = true
    let batchCount = 0

    while (hasMore) {
      try {
        const whereCondition = namespace
          ? and(lt(idempotencyKey.createdAt, cutoffDate), eq(idempotencyKey.namespace, namespace))
          : lt(idempotencyKey.createdAt, cutoffDate)

        // First, find IDs to delete with limit
        const toDelete = await db
          .select({ key: idempotencyKey.key, namespace: idempotencyKey.namespace })
          .from(idempotencyKey)
          .where(whereCondition)
          .limit(batchSize)

        if (toDelete.length === 0) {
          break
        }

        // Delete the found records
        const deleteResult = await db
          .delete(idempotencyKey)
          .where(
            and(
              ...toDelete.map((item) =>
                and(eq(idempotencyKey.key, item.key), eq(idempotencyKey.namespace, item.namespace))
              )
            )
          )
          .returning({ key: idempotencyKey.key })

        const deletedCount = deleteResult.length
        totalDeleted += deletedCount
        batchCount++

        if (deletedCount === 0) {
          hasMore = false
          logger.info('No more expired idempotency keys found')
        } else if (deletedCount < batchSize) {
          hasMore = false
          logger.info(`Deleted final batch of ${deletedCount} expired idempotency keys`)
        } else {
          logger.info(`Deleted batch ${batchCount}: ${deletedCount} expired idempotency keys`)

          await new Promise((resolve) => setTimeout(resolve, 100))
        }
      } catch (batchError) {
        const errorMessage =
          batchError instanceof Error ? batchError.message : 'Unknown batch error'
        logger.error(`Error deleting batch ${batchCount + 1}:`, batchError)
        errors.push(`Batch ${batchCount + 1}: ${errorMessage}`)

        batchCount++

        if (errors.length > 5) {
          logger.error('Too many batch errors, stopping cleanup')
          break
        }
      }
    }

    logger.info('Idempotency key cleanup completed', {
      totalDeleted,
      batchCount,
      errors: errors.length,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error('Failed to cleanup expired idempotency keys:', error)
    errors.push(`General error: ${errorMessage}`)
  }

  return { deleted: totalDeleted, errors }
}

/**
 * Get statistics about idempotency key usage
 */
export async function getIdempotencyKeyStats(): Promise<{
  totalKeys: number
  keysByNamespace: Record<string, number>
  oldestKey: Date | null
  newestKey: Date | null
}> {
  try {
    const allKeys = await db
      .select({
        namespace: idempotencyKey.namespace,
        createdAt: idempotencyKey.createdAt,
      })
      .from(idempotencyKey)

    const totalKeys = allKeys.length
    const keysByNamespace: Record<string, number> = {}
    let oldestKey: Date | null = null
    let newestKey: Date | null = null

    for (const key of allKeys) {
      keysByNamespace[key.namespace] = (keysByNamespace[key.namespace] || 0) + 1

      if (!oldestKey || key.createdAt < oldestKey) {
        oldestKey = key.createdAt
      }
      if (!newestKey || key.createdAt > newestKey) {
        newestKey = key.createdAt
      }
    }

    return {
      totalKeys,
      keysByNamespace,
      oldestKey,
      newestKey,
    }
  } catch (error) {
    logger.error('Failed to get idempotency key stats:', error)
    return {
      totalKeys: 0,
      keysByNamespace: {},
      oldestKey: null,
      newestKey: null,
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/lib/core/idempotency/index.ts

```typescript
export * from './cleanup'
export * from './service'
export {
  pollingIdempotency,
  webhookIdempotency,
} from './service'
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: sim-main/apps/sim/lib/core/idempotency/service.ts

```typescript
import { randomUUID } from 'crypto'
import { db } from '@sim/db'
import { idempotencyKey } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { getRedisClient } from '@/lib/core/config/redis'
import { getStorageMethod, type StorageMethod } from '@/lib/core/storage'
import { createLogger } from '@/lib/logs/console/logger'
import { extractProviderIdentifierFromBody } from '@/lib/webhooks/provider-utils'

const logger = createLogger('IdempotencyService')

export interface IdempotencyConfig {
  ttlSeconds?: number
  namespace?: string
}

export interface IdempotencyResult {
  isFirstTime: boolean
  normalizedKey: string
  previousResult?: any
  storageMethod: StorageMethod
}

export interface ProcessingResult {
  success: boolean
  result?: any
  error?: string
  status?: 'in-progress' | 'completed' | 'failed'
  startedAt?: number
}

export interface AtomicClaimResult {
  claimed: boolean
  existingResult?: ProcessingResult
  normalizedKey: string
  storageMethod: StorageMethod
}

const DEFAULT_TTL = 60 * 60 * 24 * 7 // 7 days
const REDIS_KEY_PREFIX = 'idempotency:'
const MAX_WAIT_TIME_MS = 300000 // 5 minutes max wait
const POLL_INTERVAL_MS = 1000

/**
 * Universal idempotency service for webhooks, triggers, and any other operations
 * that need duplicate prevention.
 *
 * Storage is determined once based on configuration:
 * - If REDIS_URL is set → Redis
 * - If REDIS_URL is not set → PostgreSQL
 */
export class IdempotencyService {
  private config: Required<IdempotencyConfig>
  private storageMethod: StorageMethod

  constructor(config: IdempotencyConfig = {}) {
    this.config = {
      ttlSeconds: config.ttlSeconds ?? DEFAULT_TTL,
      namespace: config.namespace ?? 'default',
    }
    this.storageMethod = getStorageMethod()
    logger.info(`IdempotencyService using ${this.storageMethod} storage`, {
      namespace: this.config.namespace,
    })
  }

  private normalizeKey(
    provider: string,
    identifier: string,
    additionalContext?: Record<string, any>
  ): string {
    const base = `${this.config.namespace}:${provider}:${identifier}`

    if (additionalContext && Object.keys(additionalContext).length > 0) {
      const sortedKeys = Object.keys(additionalContext).sort()
      const contextStr = sortedKeys.map((key) => `${key}=${additionalContext[key]}`).join('&')
      return `${base}:${contextStr}`
    }

    return base
  }

  async checkIdempotency(
    provider: string,
    identifier: string,
    additionalContext?: Record<string, any>
  ): Promise<IdempotencyResult> {
    const normalizedKey = this.normalizeKey(provider, identifier, additionalContext)

    if (this.storageMethod === 'redis') {
      return this.checkIdempotencyRedis(normalizedKey)
    }
    return this.checkIdempotencyDb(normalizedKey)
  }

  private async checkIdempotencyRedis(normalizedKey: string): Promise<IdempotencyResult> {
    const redis = getRedisClient()
    if (!redis) {
      throw new Error('Redis not available for idempotency check')
    }

    const redisKey = `${REDIS_KEY_PREFIX}${normalizedKey}`
    const cachedResult = await redis.get(redisKey)

    if (cachedResult) {
      logger.debug(`Idempotency hit in Redis: ${normalizedKey}`)
      return {
        isFirstTime: false,
        normalizedKey,
        previousResult: JSON.parse(cachedResult),
        storageMethod: 'redis',
      }
    }

    logger.debug(`Idempotency miss in Redis: ${normalizedKey}`)
    return {
      isFirstTime: true,
      normalizedKey,
      storageMethod: 'redis',
    }
  }

  private async checkIdempotencyDb(normalizedKey: string): Promise<IdempotencyResult> {
    const existing = await db
      .select({ result: idempotencyKey.result, createdAt: idempotencyKey.createdAt })
      .from(idempotencyKey)
      .where(
        and(
          eq(idempotencyKey.key, normalizedKey),
          eq(idempotencyKey.namespace, this.config.namespace)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      const item = existing[0]
      const isExpired = Date.now() - item.createdAt.getTime() > this.config.ttlSeconds * 1000

      if (!isExpired) {
        logger.debug(`Idempotency hit in database: ${normalizedKey}`)
        return {
          isFirstTime: false,
          normalizedKey,
          previousResult: item.result,
          storageMethod: 'database',
        }
      }

      await db
        .delete(idempotencyKey)
        .where(eq(idempotencyKey.key, normalizedKey))
        .catch((err) => logger.warn(`Failed to clean up expired key ${normalizedKey}:`, err))
    }

    logger.debug(`Idempotency miss in database: ${normalizedKey}`)
    return {
      isFirstTime: true,
      normalizedKey,
      storageMethod: 'database',
    }
  }

  async atomicallyClaim(
    provider: string,
    identifier: string,
    additionalContext?: Record<string, any>
  ): Promise<AtomicClaimResult> {
    const normalizedKey = this.normalizeKey(provider, identifier, additionalContext)
    const inProgressResult: ProcessingResult = {
      success: false,
      status: 'in-progress',
      startedAt: Date.now(),
    }

    if (this.storageMethod === 'redis') {
      return this.atomicallyClaimRedis(normalizedKey, inProgressResult)
    }
    return this.atomicallyClaimDb(normalizedKey, inProgressResult)
  }

  private async atomicallyClaimRedis(
    normalizedKey: string,
    inProgressResult: ProcessingResult
  ): Promise<AtomicClaimResult> {
    const redis = getRedisClient()
    if (!redis) {
      throw new Error('Redis not available for atomic claim')
    }

    const redisKey = `${REDIS_KEY_PREFIX}${normalizedKey}`
    const claimed = await redis.set(
      redisKey,
      JSON.stringify(inProgressResult),
      'EX',
      this.config.ttlSeconds,
      'NX'
    )

    if (claimed === 'OK') {
      logger.debug(`Atomically claimed idempotency key in Redis: ${normalizedKey}`)
      return {
        claimed: true,
        normalizedKey,
        storageMethod: 'redis',
      }
    }

    const existingData = await redis.get(redisKey)
    const existingResult = existingData ? JSON.parse(existingData) : null
    logger.debug(`Idempotency key already claimed in Redis: ${normalizedKey}`)
    return {
      claimed: false,
      existingResult,
      normalizedKey,
      storageMethod: 'redis',
    }
  }

  private async atomicallyClaimDb(
    normalizedKey: string,
    inProgressResult: ProcessingResult
  ): Promise<AtomicClaimResult> {
    const insertResult = await db
      .insert(idempotencyKey)
      .values({
        key: normalizedKey,
        namespace: this.config.namespace,
        result: inProgressResult,
        createdAt: new Date(),
      })
      .onConflictDoNothing()
      .returning({ key: idempotencyKey.key })

    if (insertResult.length > 0) {
      logger.debug(`Atomically claimed idempotency key in database: ${normalizedKey}`)
      return {
        claimed: true,
        normalizedKey,
        storageMethod: 'database',
      }
    }

    const existing = await db
      .select({ result: idempotencyKey.result })
      .from(idempotencyKey)
      .where(
        and(
          eq(idempotencyKey.key, normalizedKey),
          eq(idempotencyKey.namespace, this.config.namespace)
        )
      )
      .limit(1)

    const existingResult =
      existing.length > 0 ? (existing[0].result as ProcessingResult) : undefined
    logger.debug(`Idempotency key already claimed in database: ${normalizedKey}`)
    return {
      claimed: false,
      existingResult,
      normalizedKey,
      storageMethod: 'database',
    }
  }

  async waitForResult<T>(normalizedKey: string, storageMethod: 'redis' | 'database'): Promise<T> {
    const startTime = Date.now()
    const redisKey = `${REDIS_KEY_PREFIX}${normalizedKey}`

    while (Date.now() - startTime < MAX_WAIT_TIME_MS) {
      let currentResult: ProcessingResult | null = null

      if (storageMethod === 'redis') {
        const redis = getRedisClient()
        if (!redis) {
          throw new Error('Redis not available')
        }
        const data = await redis.get(redisKey)
        currentResult = data ? JSON.parse(data) : null
      } else {
        const existing = await db
          .select({ result: idempotencyKey.result })
          .from(idempotencyKey)
          .where(
            and(
              eq(idempotencyKey.key, normalizedKey),
              eq(idempotencyKey.namespace, this.config.namespace)
            )
          )
          .limit(1)
        currentResult = existing.length > 0 ? (existing[0].result as ProcessingResult) : null
      }

      if (currentResult?.status === 'completed') {
        logger.debug(`Operation completed, returning result: ${normalizedKey}`)
        if (currentResult.success === false) {
          throw new Error(currentResult.error || 'Previous operation failed')
        }
        return currentResult.result as T
      }

      if (currentResult?.status === 'failed') {
        logger.debug(`Operation failed, throwing error: ${normalizedKey}`)
        throw new Error(currentResult.error || 'Previous operation failed')
      }

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
    }

    throw new Error(`Timeout waiting for idempotency operation to complete: ${normalizedKey}`)
  }

  async storeResult(
    normalizedKey: string,
    result: ProcessingResult,
    storageMethod: 'redis' | 'database'
  ): Promise<void> {
    if (storageMethod === 'redis') {
      return this.storeResultRedis(normalizedKey, result)
    }
    return this.storeResultDb(normalizedKey, result)
  }

  private async storeResultRedis(normalizedKey: string, result: ProcessingResult): Promise<void> {
    const redis = getRedisClient()
    if (!redis) {
      throw new Error('Redis not available for storing result')
    }

    await redis.setex(
      `${REDIS_KEY_PREFIX}${normalizedKey}`,
      this.config.ttlSeconds,
      JSON.stringify(result)
    )
    logger.debug(`Stored idempotency result in Redis: ${normalizedKey}`)
  }

  private async storeResultDb(normalizedKey: string, result: ProcessingResult): Promise<void> {
    await db
      .insert(idempotencyKey)
      .values({
        key: normalizedKey,
        namespace: this.config.namespace,
        result: result,
        createdAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [idempotencyKey.key, idempotencyKey.namespace],
        set: {
          result: result,
          createdAt: new Date(),
        },
      })

    logger.debug(`Stored idempotency result in database: ${normalizedKey}`)
  }

  async executeWithIdempotency<T>(
    provider: string,
    identifier: string,
    operation: () => Promise<T>,
    additionalContext?: Record<string, any>
  ): Promise<T> {
    const claimResult = await this.atomicallyClaim(provider, identifier, additionalContext)

    if (!claimResult.claimed) {
      const existingResult = claimResult.existingResult

      if (existingResult?.status === 'completed') {
        logger.info(`Returning cached result for: ${claimResult.normalizedKey}`)
        if (existingResult.success === false) {
          throw new Error(existingResult.error || 'Previous operation failed')
        }
        return existingResult.result as T
      }

      if (existingResult?.status === 'failed') {
        logger.info(`Previous operation failed for: ${claimResult.normalizedKey}`)
        throw new Error(existingResult.error || 'Previous operation failed')
      }

      if (existingResult?.status === 'in-progress') {
        logger.info(`Waiting for in-progress operation: ${claimResult.normalizedKey}`)
        return await this.waitForResult<T>(claimResult.normalizedKey, claimResult.storageMethod)
      }

      if (existingResult) {
        return existingResult.result as T
      }

      throw new Error(`Unexpected state: key claimed but no existing result found`)
    }

    try {
      logger.info(`Executing new operation: ${claimResult.normalizedKey}`)
      const result = await operation()

      await this.storeResult(
        claimResult.normalizedKey,
        { success: true, result, status: 'completed' },
        claimResult.storageMethod
      )

      logger.debug(`Successfully completed operation: ${claimResult.normalizedKey}`)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      await this.storeResult(
        claimResult.normalizedKey,
        { success: false, error: errorMessage, status: 'failed' },
        claimResult.storageMethod
      )

      logger.warn(`Operation failed: ${claimResult.normalizedKey} - ${errorMessage}`)
      throw error
    }
  }

  static createWebhookIdempotencyKey(
    webhookId: string,
    headers?: Record<string, string>,
    body?: any,
    provider?: string
  ): string {
    const normalizedHeaders = headers
      ? Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]))
      : undefined

    const webhookIdHeader =
      normalizedHeaders?.['webhook-id'] ||
      normalizedHeaders?.['x-webhook-id'] ||
      normalizedHeaders?.['x-shopify-webhook-id'] ||
      normalizedHeaders?.['x-github-delivery'] ||
      normalizedHeaders?.['x-event-id'] ||
      normalizedHeaders?.['x-teams-notification-id']

    if (webhookIdHeader) {
      return `${webhookId}:${webhookIdHeader}`
    }

    if (body && provider) {
      const bodyIdentifier = extractProviderIdentifierFromBody(provider, body)
      if (bodyIdentifier) {
        return `${webhookId}:${bodyIdentifier}`
      }
    }

    const uniqueId = randomUUID()
    logger.warn('No unique identifier found, duplicate executions may occur', {
      webhookId,
      provider,
    })
    return `${webhookId}:${uniqueId}`
  }
}

export const webhookIdempotency = new IdempotencyService({
  namespace: 'webhook',
  ttlSeconds: 60 * 60 * 24 * 7, // 7 days
})

export const pollingIdempotency = new IdempotencyService({
  namespace: 'polling',
  ttlSeconds: 60 * 60 * 24 * 3, // 3 days
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/lib/core/rate-limiter/index.ts

```typescript
export type { RateLimitResult, RateLimitStatus } from './rate-limiter'
export { RateLimiter } from './rate-limiter'
export type { RateLimitStorageAdapter, TokenBucketConfig } from './storage'
export type { RateLimitConfig, SubscriptionPlan, TriggerType } from './types'
export { RATE_LIMITS, RateLimitError } from './types'
```

--------------------------------------------------------------------------------

---[FILE: rate-limiter.test.ts]---
Location: sim-main/apps/sim/lib/core/rate-limiter/rate-limiter.test.ts

```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RateLimiter } from './rate-limiter'
import type { ConsumeResult, RateLimitStorageAdapter, TokenStatus } from './storage'
import { MANUAL_EXECUTION_LIMIT, RATE_LIMITS } from './types'

const createMockAdapter = (): RateLimitStorageAdapter => ({
  consumeTokens: vi.fn(),
  getTokenStatus: vi.fn(),
  resetBucket: vi.fn(),
})

describe('RateLimiter', () => {
  const testUserId = 'test-user-123'
  const freeSubscription = { plan: 'free', referenceId: testUserId }
  let mockAdapter: RateLimitStorageAdapter
  let rateLimiter: RateLimiter

  beforeEach(() => {
    vi.clearAllMocks()
    mockAdapter = createMockAdapter()
    rateLimiter = new RateLimiter(mockAdapter)
  })

  describe('checkRateLimitWithSubscription', () => {
    it('should allow unlimited requests for manual trigger type', async () => {
      const result = await rateLimiter.checkRateLimitWithSubscription(
        testUserId,
        freeSubscription,
        'manual',
        false
      )

      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(MANUAL_EXECUTION_LIMIT)
      expect(result.resetAt).toBeInstanceOf(Date)
      expect(mockAdapter.consumeTokens).not.toHaveBeenCalled()
    })

    it('should consume tokens for API requests', async () => {
      const mockResult: ConsumeResult = {
        allowed: true,
        tokensRemaining: RATE_LIMITS.free.sync.maxTokens - 1,
        resetAt: new Date(Date.now() + 60000),
      }
      vi.mocked(mockAdapter.consumeTokens).mockResolvedValue(mockResult)

      const result = await rateLimiter.checkRateLimitWithSubscription(
        testUserId,
        freeSubscription,
        'api',
        false
      )

      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(mockResult.tokensRemaining)
      expect(mockAdapter.consumeTokens).toHaveBeenCalledWith(
        `${testUserId}:sync`,
        1,
        RATE_LIMITS.free.sync
      )
    })

    it('should use async bucket for async requests', async () => {
      const mockResult: ConsumeResult = {
        allowed: true,
        tokensRemaining: RATE_LIMITS.free.async.maxTokens - 1,
        resetAt: new Date(Date.now() + 60000),
      }
      vi.mocked(mockAdapter.consumeTokens).mockResolvedValue(mockResult)

      await rateLimiter.checkRateLimitWithSubscription(testUserId, freeSubscription, 'api', true)

      expect(mockAdapter.consumeTokens).toHaveBeenCalledWith(
        `${testUserId}:async`,
        1,
        RATE_LIMITS.free.async
      )
    })

    it('should use api-endpoint bucket for api-endpoint trigger', async () => {
      const mockResult: ConsumeResult = {
        allowed: true,
        tokensRemaining: RATE_LIMITS.free.apiEndpoint.maxTokens - 1,
        resetAt: new Date(Date.now() + 60000),
      }
      vi.mocked(mockAdapter.consumeTokens).mockResolvedValue(mockResult)

      await rateLimiter.checkRateLimitWithSubscription(
        testUserId,
        freeSubscription,
        'api-endpoint',
        false
      )

      expect(mockAdapter.consumeTokens).toHaveBeenCalledWith(
        `${testUserId}:api-endpoint`,
        1,
        RATE_LIMITS.free.apiEndpoint
      )
    })

    it('should deny requests when rate limit exceeded', async () => {
      const mockResult: ConsumeResult = {
        allowed: false,
        tokensRemaining: 0,
        resetAt: new Date(Date.now() + 60000),
        retryAfterMs: 30000,
      }
      vi.mocked(mockAdapter.consumeTokens).mockResolvedValue(mockResult)

      const result = await rateLimiter.checkRateLimitWithSubscription(
        testUserId,
        freeSubscription,
        'api',
        false
      )

      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
      expect(result.retryAfterMs).toBe(30000)
    })

    it('should use organization key for team subscriptions', async () => {
      const orgId = 'org-123'
      const teamSubscription = { plan: 'team', referenceId: orgId }
      const mockResult: ConsumeResult = {
        allowed: true,
        tokensRemaining: RATE_LIMITS.team.sync.maxTokens - 1,
        resetAt: new Date(Date.now() + 60000),
      }
      vi.mocked(mockAdapter.consumeTokens).mockResolvedValue(mockResult)

      await rateLimiter.checkRateLimitWithSubscription(testUserId, teamSubscription, 'api', false)

      expect(mockAdapter.consumeTokens).toHaveBeenCalledWith(
        `${orgId}:sync`,
        1,
        RATE_LIMITS.team.sync
      )
    })

    it('should use user key when team subscription referenceId matches userId', async () => {
      const directTeamSubscription = { plan: 'team', referenceId: testUserId }
      const mockResult: ConsumeResult = {
        allowed: true,
        tokensRemaining: RATE_LIMITS.team.sync.maxTokens - 1,
        resetAt: new Date(Date.now() + 60000),
      }
      vi.mocked(mockAdapter.consumeTokens).mockResolvedValue(mockResult)

      await rateLimiter.checkRateLimitWithSubscription(
        testUserId,
        directTeamSubscription,
        'api',
        false
      )

      expect(mockAdapter.consumeTokens).toHaveBeenCalledWith(
        `${testUserId}:sync`,
        1,
        RATE_LIMITS.team.sync
      )
    })

    it('should deny on storage error (fail closed)', async () => {
      vi.mocked(mockAdapter.consumeTokens).mockRejectedValue(new Error('Storage error'))

      const result = await rateLimiter.checkRateLimitWithSubscription(
        testUserId,
        freeSubscription,
        'api',
        false
      )

      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('should work for all non-manual trigger types', async () => {
      const triggerTypes = ['api', 'webhook', 'schedule', 'chat'] as const
      const mockResult: ConsumeResult = {
        allowed: true,
        tokensRemaining: 10,
        resetAt: new Date(Date.now() + 60000),
      }
      vi.mocked(mockAdapter.consumeTokens).mockResolvedValue(mockResult)

      for (const triggerType of triggerTypes) {
        await rateLimiter.checkRateLimitWithSubscription(
          testUserId,
          freeSubscription,
          triggerType,
          false
        )
        expect(mockAdapter.consumeTokens).toHaveBeenCalled()
        vi.mocked(mockAdapter.consumeTokens).mockClear()
      }
    })
  })

  describe('getRateLimitStatusWithSubscription', () => {
    it('should return unlimited status for manual trigger type', async () => {
      const status = await rateLimiter.getRateLimitStatusWithSubscription(
        testUserId,
        freeSubscription,
        'manual',
        false
      )

      expect(status.requestsPerMinute).toBe(MANUAL_EXECUTION_LIMIT)
      expect(status.maxBurst).toBe(MANUAL_EXECUTION_LIMIT)
      expect(status.remaining).toBe(MANUAL_EXECUTION_LIMIT)
      expect(mockAdapter.getTokenStatus).not.toHaveBeenCalled()
    })

    it('should return status from storage for API requests', async () => {
      const mockStatus: TokenStatus = {
        tokensAvailable: 15,
        maxTokens: RATE_LIMITS.free.sync.maxTokens,
        lastRefillAt: new Date(),
        nextRefillAt: new Date(Date.now() + 60000),
      }
      vi.mocked(mockAdapter.getTokenStatus).mockResolvedValue(mockStatus)

      const status = await rateLimiter.getRateLimitStatusWithSubscription(
        testUserId,
        freeSubscription,
        'api',
        false
      )

      expect(status.remaining).toBe(15)
      expect(status.requestsPerMinute).toBe(RATE_LIMITS.free.sync.refillRate)
      expect(status.maxBurst).toBe(RATE_LIMITS.free.sync.maxTokens)
      expect(mockAdapter.getTokenStatus).toHaveBeenCalledWith(
        `${testUserId}:sync`,
        RATE_LIMITS.free.sync
      )
    })
  })

  describe('resetRateLimit', () => {
    it('should reset all bucket types for a user', async () => {
      vi.mocked(mockAdapter.resetBucket).mockResolvedValue()

      await rateLimiter.resetRateLimit(testUserId)

      expect(mockAdapter.resetBucket).toHaveBeenCalledTimes(3)
      expect(mockAdapter.resetBucket).toHaveBeenCalledWith(`${testUserId}:sync`)
      expect(mockAdapter.resetBucket).toHaveBeenCalledWith(`${testUserId}:async`)
      expect(mockAdapter.resetBucket).toHaveBeenCalledWith(`${testUserId}:api-endpoint`)
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: rate-limiter.ts]---
Location: sim-main/apps/sim/lib/core/rate-limiter/rate-limiter.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import {
  createStorageAdapter,
  type RateLimitStorageAdapter,
  type TokenBucketConfig,
} from './storage'
import {
  MANUAL_EXECUTION_LIMIT,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMITS,
  type RateLimitCounterType,
  type SubscriptionPlan,
  type TriggerType,
} from './types'

const logger = createLogger('RateLimiter')

interface SubscriptionInfo {
  plan: string
  referenceId: string
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
  retryAfterMs?: number
}

export interface RateLimitStatus {
  requestsPerMinute: number
  maxBurst: number
  remaining: number
  resetAt: Date
}

export class RateLimiter {
  private storage: RateLimitStorageAdapter

  constructor(storage?: RateLimitStorageAdapter) {
    this.storage = storage ?? createStorageAdapter()
  }

  private getRateLimitKey(userId: string, subscription: SubscriptionInfo | null): string {
    if (!subscription) return userId

    const plan = subscription.plan as SubscriptionPlan
    if ((plan === 'team' || plan === 'enterprise') && subscription.referenceId !== userId) {
      return subscription.referenceId
    }

    return userId
  }

  private getCounterType(triggerType: TriggerType, isAsync: boolean): RateLimitCounterType {
    if (triggerType === 'api-endpoint') return 'api-endpoint'
    return isAsync ? 'async' : 'sync'
  }

  private getBucketConfig(
    plan: SubscriptionPlan,
    counterType: RateLimitCounterType
  ): TokenBucketConfig {
    const config = RATE_LIMITS[plan]
    switch (counterType) {
      case 'api-endpoint':
        return config.apiEndpoint
      case 'async':
        return config.async
      case 'sync':
        return config.sync
    }
  }

  private buildStorageKey(rateLimitKey: string, counterType: RateLimitCounterType): string {
    return `${rateLimitKey}:${counterType}`
  }

  private createUnlimitedResult(): RateLimitResult {
    return {
      allowed: true,
      remaining: MANUAL_EXECUTION_LIMIT,
      resetAt: new Date(Date.now() + RATE_LIMIT_WINDOW_MS),
    }
  }

  private createUnlimitedStatus(config: TokenBucketConfig): RateLimitStatus {
    return {
      requestsPerMinute: MANUAL_EXECUTION_LIMIT,
      maxBurst: MANUAL_EXECUTION_LIMIT,
      remaining: MANUAL_EXECUTION_LIMIT,
      resetAt: new Date(Date.now() + config.refillIntervalMs),
    }
  }

  async checkRateLimitWithSubscription(
    userId: string,
    subscription: SubscriptionInfo | null,
    triggerType: TriggerType = 'manual',
    isAsync = false
  ): Promise<RateLimitResult> {
    try {
      if (triggerType === 'manual') {
        return this.createUnlimitedResult()
      }

      const plan = (subscription?.plan || 'free') as SubscriptionPlan
      const rateLimitKey = this.getRateLimitKey(userId, subscription)
      const counterType = this.getCounterType(triggerType, isAsync)
      const config = this.getBucketConfig(plan, counterType)
      const storageKey = this.buildStorageKey(rateLimitKey, counterType)

      const result = await this.storage.consumeTokens(storageKey, 1, config)

      if (!result.allowed) {
        logger.info('Rate limit exceeded', {
          rateLimitKey,
          counterType,
          plan,
          tokensRemaining: result.tokensRemaining,
        })
      }

      return {
        allowed: result.allowed,
        remaining: result.tokensRemaining,
        resetAt: result.resetAt,
        retryAfterMs: result.retryAfterMs,
      }
    } catch (error) {
      logger.error('Rate limit storage error - failing closed (denying request)', {
        error: error instanceof Error ? error.message : String(error),
        userId,
        triggerType,
        isAsync,
      })
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(Date.now() + RATE_LIMIT_WINDOW_MS),
        retryAfterMs: RATE_LIMIT_WINDOW_MS,
      }
    }
  }

  async getRateLimitStatusWithSubscription(
    userId: string,
    subscription: SubscriptionInfo | null,
    triggerType: TriggerType = 'manual',
    isAsync = false
  ): Promise<RateLimitStatus> {
    try {
      const plan = (subscription?.plan || 'free') as SubscriptionPlan
      const counterType = this.getCounterType(triggerType, isAsync)
      const config = this.getBucketConfig(plan, counterType)

      if (triggerType === 'manual') {
        return this.createUnlimitedStatus(config)
      }

      const rateLimitKey = this.getRateLimitKey(userId, subscription)
      const storageKey = this.buildStorageKey(rateLimitKey, counterType)

      const status = await this.storage.getTokenStatus(storageKey, config)

      return {
        requestsPerMinute: config.refillRate,
        maxBurst: config.maxTokens,
        remaining: Math.floor(status.tokensAvailable),
        resetAt: status.nextRefillAt,
      }
    } catch (error) {
      logger.error('Error getting rate limit status - returning default config', {
        error: error instanceof Error ? error.message : String(error),
        userId,
        triggerType,
        isAsync,
      })
      const plan = (subscription?.plan || 'free') as SubscriptionPlan
      const counterType = this.getCounterType(triggerType, isAsync)
      const config = this.getBucketConfig(plan, counterType)
      return {
        requestsPerMinute: config.refillRate,
        maxBurst: config.maxTokens,
        remaining: 0,
        resetAt: new Date(Date.now() + RATE_LIMIT_WINDOW_MS),
      }
    }
  }

  async resetRateLimit(rateLimitKey: string): Promise<void> {
    try {
      await Promise.all([
        this.storage.resetBucket(`${rateLimitKey}:sync`),
        this.storage.resetBucket(`${rateLimitKey}:async`),
        this.storage.resetBucket(`${rateLimitKey}:api-endpoint`),
      ])
      logger.info(`Reset rate limit for ${rateLimitKey}`)
    } catch (error) {
      logger.error('Error resetting rate limit:', error)
      throw error
    }
  }
}
```

--------------------------------------------------------------------------------

````
