---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 560
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 560 of 933)

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

---[FILE: types.ts]---
Location: sim-main/apps/sim/lib/core/rate-limiter/types.ts

```typescript
import { env } from '@/lib/core/config/env'
import type { TokenBucketConfig } from './storage'

export type TriggerType = 'api' | 'webhook' | 'schedule' | 'manual' | 'chat' | 'api-endpoint'

export type RateLimitCounterType = 'sync' | 'async' | 'api-endpoint'

export type SubscriptionPlan = 'free' | 'pro' | 'team' | 'enterprise'

export interface RateLimitConfig {
  sync: TokenBucketConfig
  async: TokenBucketConfig
  apiEndpoint: TokenBucketConfig
}

export const RATE_LIMIT_WINDOW_MS = Number.parseInt(env.RATE_LIMIT_WINDOW_MS) || 60000

export const MANUAL_EXECUTION_LIMIT = Number.parseInt(env.MANUAL_EXECUTION_LIMIT) || 999999

function createBucketConfig(ratePerMinute: number, burstMultiplier = 2): TokenBucketConfig {
  return {
    maxTokens: ratePerMinute * burstMultiplier,
    refillRate: ratePerMinute,
    refillIntervalMs: RATE_LIMIT_WINDOW_MS,
  }
}

export const RATE_LIMITS: Record<SubscriptionPlan, RateLimitConfig> = {
  free: {
    sync: createBucketConfig(Number.parseInt(env.RATE_LIMIT_FREE_SYNC) || 10),
    async: createBucketConfig(Number.parseInt(env.RATE_LIMIT_FREE_ASYNC) || 50),
    apiEndpoint: createBucketConfig(10),
  },
  pro: {
    sync: createBucketConfig(Number.parseInt(env.RATE_LIMIT_PRO_SYNC) || 25),
    async: createBucketConfig(Number.parseInt(env.RATE_LIMIT_PRO_ASYNC) || 200),
    apiEndpoint: createBucketConfig(30),
  },
  team: {
    sync: createBucketConfig(Number.parseInt(env.RATE_LIMIT_TEAM_SYNC) || 75),
    async: createBucketConfig(Number.parseInt(env.RATE_LIMIT_TEAM_ASYNC) || 500),
    apiEndpoint: createBucketConfig(60),
  },
  enterprise: {
    sync: createBucketConfig(Number.parseInt(env.RATE_LIMIT_ENTERPRISE_SYNC) || 150),
    async: createBucketConfig(Number.parseInt(env.RATE_LIMIT_ENTERPRISE_ASYNC) || 1000),
    apiEndpoint: createBucketConfig(120),
  },
}

export class RateLimitError extends Error {
  statusCode: number
  constructor(message: string, statusCode = 429) {
    super(message)
    this.name = 'RateLimitError'
    this.statusCode = statusCode
  }
}
```

--------------------------------------------------------------------------------

---[FILE: adapter.ts]---
Location: sim-main/apps/sim/lib/core/rate-limiter/storage/adapter.ts

```typescript
export interface TokenBucketConfig {
  maxTokens: number
  refillRate: number
  refillIntervalMs: number
}

export interface ConsumeResult {
  allowed: boolean
  tokensRemaining: number
  resetAt: Date
  retryAfterMs?: number
}

export interface TokenStatus {
  tokensAvailable: number
  maxTokens: number
  lastRefillAt: Date
  nextRefillAt: Date
}

export interface RateLimitStorageAdapter {
  consumeTokens(key: string, tokens: number, config: TokenBucketConfig): Promise<ConsumeResult>
  getTokenStatus(key: string, config: TokenBucketConfig): Promise<TokenStatus>
  resetBucket(key: string): Promise<void>
}
```

--------------------------------------------------------------------------------

---[FILE: db-token-bucket.ts]---
Location: sim-main/apps/sim/lib/core/rate-limiter/storage/db-token-bucket.ts

```typescript
import { db } from '@sim/db'
import { rateLimitBucket } from '@sim/db/schema'
import { eq, sql } from 'drizzle-orm'
import type {
  ConsumeResult,
  RateLimitStorageAdapter,
  TokenBucketConfig,
  TokenStatus,
} from './adapter'

export class DbTokenBucket implements RateLimitStorageAdapter {
  async consumeTokens(
    key: string,
    requestedTokens: number,
    config: TokenBucketConfig
  ): Promise<ConsumeResult> {
    const now = new Date()
    const nowMs = now.getTime()
    const nowIso = now.toISOString()

    const result = await db
      .insert(rateLimitBucket)
      .values({
        key,
        tokens: (config.maxTokens - requestedTokens).toString(),
        lastRefillAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: rateLimitBucket.key,
        set: {
          tokens: sql`
            CASE
              WHEN (
                LEAST(
                  ${config.maxTokens}::numeric,
                  ${rateLimitBucket.tokens}::numeric + (
                    FLOOR(
                      EXTRACT(EPOCH FROM (${nowIso}::timestamp - ${rateLimitBucket.lastRefillAt})) * 1000
                      / ${config.refillIntervalMs}
                    ) * ${config.refillRate}
                  )::numeric
                )
              ) >= ${requestedTokens}::numeric
              THEN LEAST(
                ${config.maxTokens}::numeric,
                ${rateLimitBucket.tokens}::numeric + (
                  FLOOR(
                    EXTRACT(EPOCH FROM (${nowIso}::timestamp - ${rateLimitBucket.lastRefillAt})) * 1000
                    / ${config.refillIntervalMs}
                  ) * ${config.refillRate}
                )::numeric
              ) - ${requestedTokens}::numeric
              ELSE ${rateLimitBucket.tokens}::numeric
            END
          `,
          lastRefillAt: sql`
            CASE
              WHEN FLOOR(
                EXTRACT(EPOCH FROM (${nowIso}::timestamp - ${rateLimitBucket.lastRefillAt})) * 1000
                / ${config.refillIntervalMs}
              ) > 0
              THEN ${rateLimitBucket.lastRefillAt} + (
                FLOOR(
                  EXTRACT(EPOCH FROM (${nowIso}::timestamp - ${rateLimitBucket.lastRefillAt})) * 1000
                  / ${config.refillIntervalMs}
                ) * ${config.refillIntervalMs} * INTERVAL '1 millisecond'
              )
              ELSE ${rateLimitBucket.lastRefillAt}
            END
          `,
          updatedAt: now,
        },
      })
      .returning({
        tokens: rateLimitBucket.tokens,
        lastRefillAt: rateLimitBucket.lastRefillAt,
      })

    const record = result[0]
    const tokens = Number.parseFloat(record.tokens)
    const lastRefillMs = record.lastRefillAt.getTime()
    const nextRefillAt = new Date(lastRefillMs + config.refillIntervalMs)

    const allowed = tokens >= 0

    return {
      allowed,
      tokensRemaining: Math.max(0, tokens),
      resetAt: nextRefillAt,
      retryAfterMs: allowed ? undefined : Math.max(0, nextRefillAt.getTime() - nowMs),
    }
  }

  async getTokenStatus(key: string, config: TokenBucketConfig): Promise<TokenStatus> {
    const now = new Date()

    const [record] = await db
      .select({
        tokens: rateLimitBucket.tokens,
        lastRefillAt: rateLimitBucket.lastRefillAt,
      })
      .from(rateLimitBucket)
      .where(eq(rateLimitBucket.key, key))
      .limit(1)

    if (!record) {
      return {
        tokensAvailable: config.maxTokens,
        maxTokens: config.maxTokens,
        lastRefillAt: now,
        nextRefillAt: new Date(now.getTime() + config.refillIntervalMs),
      }
    }

    const tokens = Number.parseFloat(record.tokens)
    const elapsed = now.getTime() - record.lastRefillAt.getTime()
    const intervalsElapsed = Math.floor(elapsed / config.refillIntervalMs)
    const refillAmount = intervalsElapsed * config.refillRate
    const tokensAvailable = Math.min(config.maxTokens, tokens + refillAmount)
    const lastRefillAt = new Date(
      record.lastRefillAt.getTime() + intervalsElapsed * config.refillIntervalMs
    )

    return {
      tokensAvailable,
      maxTokens: config.maxTokens,
      lastRefillAt,
      nextRefillAt: new Date(lastRefillAt.getTime() + config.refillIntervalMs),
    }
  }

  async resetBucket(key: string): Promise<void> {
    await db.delete(rateLimitBucket).where(eq(rateLimitBucket.key, key))
  }
}
```

--------------------------------------------------------------------------------

---[FILE: factory.ts]---
Location: sim-main/apps/sim/lib/core/rate-limiter/storage/factory.ts

```typescript
import { getRedisClient } from '@/lib/core/config/redis'
import { getStorageMethod, type StorageMethod } from '@/lib/core/storage'
import { createLogger } from '@/lib/logs/console/logger'
import type { RateLimitStorageAdapter } from './adapter'
import { DbTokenBucket } from './db-token-bucket'
import { RedisTokenBucket } from './redis-token-bucket'

const logger = createLogger('RateLimitStorage')

let cachedAdapter: RateLimitStorageAdapter | null = null

export function createStorageAdapter(): RateLimitStorageAdapter {
  if (cachedAdapter) {
    return cachedAdapter
  }

  const storageMethod = getStorageMethod()

  if (storageMethod === 'redis') {
    const redis = getRedisClient()
    if (!redis) {
      throw new Error('Redis configured but client unavailable')
    }
    logger.info('Rate limiting: Using Redis')
    cachedAdapter = new RedisTokenBucket(redis)
  } else {
    logger.info('Rate limiting: Using PostgreSQL')
    cachedAdapter = new DbTokenBucket()
  }

  return cachedAdapter
}

export function getAdapterType(): StorageMethod {
  return getStorageMethod()
}

export function resetStorageAdapter(): void {
  cachedAdapter = null
}

export function setStorageAdapter(adapter: RateLimitStorageAdapter): void {
  cachedAdapter = adapter
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/lib/core/rate-limiter/storage/index.ts

```typescript
export type {
  ConsumeResult,
  RateLimitStorageAdapter,
  TokenBucketConfig,
  TokenStatus,
} from './adapter'
export { DbTokenBucket } from './db-token-bucket'
export {
  createStorageAdapter,
  getAdapterType,
  resetStorageAdapter,
  setStorageAdapter,
} from './factory'
export { RedisTokenBucket } from './redis-token-bucket'
```

--------------------------------------------------------------------------------

---[FILE: redis-token-bucket.ts]---
Location: sim-main/apps/sim/lib/core/rate-limiter/storage/redis-token-bucket.ts

```typescript
import type Redis from 'ioredis'
import type {
  ConsumeResult,
  RateLimitStorageAdapter,
  TokenBucketConfig,
  TokenStatus,
} from './adapter'

const CONSUME_SCRIPT = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local requested = tonumber(ARGV[2])
local maxTokens = tonumber(ARGV[3])
local refillRate = tonumber(ARGV[4])
local refillIntervalMs = tonumber(ARGV[5])
local ttl = tonumber(ARGV[6])

local bucket = redis.call('HMGET', key, 'tokens', 'lastRefillAt')
local tokens = tonumber(bucket[1])
local lastRefillAt = tonumber(bucket[2])

if tokens == nil then
  tokens = maxTokens
  lastRefillAt = now
end

local elapsed = now - lastRefillAt
local intervalsElapsed = math.floor(elapsed / refillIntervalMs)
if intervalsElapsed > 0 then
  tokens = math.min(maxTokens, tokens + (intervalsElapsed * refillRate))
  lastRefillAt = lastRefillAt + (intervalsElapsed * refillIntervalMs)
end

local allowed = 0
if tokens >= requested then
  tokens = tokens - requested
  allowed = 1
end

redis.call('HSET', key, 'tokens', tokens, 'lastRefillAt', lastRefillAt)
redis.call('EXPIRE', key, ttl)

local nextRefillAt = lastRefillAt + refillIntervalMs

return {allowed, tokens, lastRefillAt, nextRefillAt}
`

const STATUS_SCRIPT = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local maxTokens = tonumber(ARGV[2])
local refillRate = tonumber(ARGV[3])
local refillIntervalMs = tonumber(ARGV[4])

local bucket = redis.call('HMGET', key, 'tokens', 'lastRefillAt')
local tokens = tonumber(bucket[1])
local lastRefillAt = tonumber(bucket[2])

if tokens == nil then
  tokens = maxTokens
  lastRefillAt = now
end

local elapsed = now - lastRefillAt
local intervalsElapsed = math.floor(elapsed / refillIntervalMs)
if intervalsElapsed > 0 then
  tokens = math.min(maxTokens, tokens + (intervalsElapsed * refillRate))
  lastRefillAt = lastRefillAt + (intervalsElapsed * refillIntervalMs)
end

local nextRefillAt = lastRefillAt + refillIntervalMs

return {tokens, maxTokens, lastRefillAt, nextRefillAt}
`

export class RedisTokenBucket implements RateLimitStorageAdapter {
  constructor(private redis: Redis) {}

  async consumeTokens(
    key: string,
    tokens: number,
    config: TokenBucketConfig
  ): Promise<ConsumeResult> {
    const now = Date.now()
    const ttl = Math.ceil((config.refillIntervalMs * 2) / 1000)

    const result = (await this.redis.eval(
      CONSUME_SCRIPT,
      1,
      `ratelimit:tb:${key}`,
      now,
      tokens,
      config.maxTokens,
      config.refillRate,
      config.refillIntervalMs,
      ttl
    )) as [number, number, number, number]

    const [allowed, remaining, , nextRefill] = result

    return {
      allowed: allowed === 1,
      tokensRemaining: remaining,
      resetAt: new Date(nextRefill),
      retryAfterMs: allowed === 1 ? undefined : Math.max(0, nextRefill - now),
    }
  }

  async getTokenStatus(key: string, config: TokenBucketConfig): Promise<TokenStatus> {
    const now = Date.now()

    const result = (await this.redis.eval(
      STATUS_SCRIPT,
      1,
      `ratelimit:tb:${key}`,
      now,
      config.maxTokens,
      config.refillRate,
      config.refillIntervalMs
    )) as [number, number, number, number]

    const [tokensAvailable, maxTokens, lastRefillAt, nextRefillAt] = result

    return {
      tokensAvailable,
      maxTokens,
      lastRefillAt: new Date(lastRefillAt),
      nextRefillAt: new Date(nextRefillAt),
    }
  }

  async resetBucket(key: string): Promise<void> {
    await this.redis.del(`ratelimit:tb:${key}`)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: csp.ts]---
Location: sim-main/apps/sim/lib/core/security/csp.ts

```typescript
import { env, getEnv } from '../config/env'

/**
 * Content Security Policy (CSP) configuration builder
 */

function getHostnameFromUrl(url: string | undefined): string[] {
  if (!url) return []
  try {
    return [`https://${new URL(url).hostname}`]
  } catch {
    return []
  }
}

export interface CSPDirectives {
  'default-src'?: string[]
  'script-src'?: string[]
  'style-src'?: string[]
  'img-src'?: string[]
  'media-src'?: string[]
  'font-src'?: string[]
  'connect-src'?: string[]
  'frame-src'?: string[]
  'frame-ancestors'?: string[]
  'form-action'?: string[]
  'base-uri'?: string[]
  'object-src'?: string[]
}

// Build-time CSP directives (for next.config.ts)
export const buildTimeCSPDirectives: CSPDirectives = {
  'default-src': ["'self'"],

  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'https://*.google.com',
    'https://apis.google.com',
    'https://assets.onedollarstats.com',
  ],

  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],

  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://*.googleusercontent.com',
    'https://*.google.com',
    'https://*.atlassian.com',
    'https://cdn.discordapp.com',
    'https://*.githubusercontent.com',
    'https://*.s3.amazonaws.com',
    'https://s3.amazonaws.com',
    'https://github.com/*',
    'https://collector.onedollarstats.com',
    ...(env.S3_BUCKET_NAME && env.AWS_REGION
      ? [`https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com`]
      : []),
    ...(env.S3_KB_BUCKET_NAME && env.AWS_REGION
      ? [`https://${env.S3_KB_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com`]
      : []),
    ...(env.S3_CHAT_BUCKET_NAME && env.AWS_REGION
      ? [`https://${env.S3_CHAT_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com`]
      : []),
    'https://*.amazonaws.com',
    'https://*.blob.core.windows.net',
    'https://github.com/*',
    ...getHostnameFromUrl(env.NEXT_PUBLIC_BRAND_LOGO_URL),
    ...getHostnameFromUrl(env.NEXT_PUBLIC_BRAND_FAVICON_URL),
  ],

  'media-src': ["'self'", 'blob:'],

  'font-src': ["'self'", 'https://fonts.gstatic.com'],

  'connect-src': [
    "'self'",
    env.NEXT_PUBLIC_APP_URL || '',
    env.OLLAMA_URL || 'http://localhost:11434',
    env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002',
    env.NEXT_PUBLIC_SOCKET_URL?.replace('http://', 'ws://').replace('https://', 'wss://') ||
      'ws://localhost:3002',
    'https://api.browser-use.com',
    'https://api.exa.ai',
    'https://api.firecrawl.dev',
    'https://*.googleapis.com',
    'https://*.amazonaws.com',
    'https://*.s3.amazonaws.com',
    'https://*.blob.core.windows.net',
    'https://*.atlassian.com',
    'https://*.supabase.co',
    'https://api.github.com',
    'https://github.com/*',
    'https://collector.onedollarstats.com',
    ...getHostnameFromUrl(env.NEXT_PUBLIC_BRAND_LOGO_URL),
    ...getHostnameFromUrl(env.NEXT_PUBLIC_PRIVACY_URL),
    ...getHostnameFromUrl(env.NEXT_PUBLIC_TERMS_URL),
  ],

  'frame-src': ['https://drive.google.com', 'https://docs.google.com', 'https://*.google.com'],

  'frame-ancestors': ["'self'"],
  'form-action': ["'self'"],
  'base-uri': ["'self'"],
  'object-src': ["'none'"],
}

/**
 * Build CSP string from directives object
 */
export function buildCSPString(directives: CSPDirectives): string {
  return Object.entries(directives)
    .map(([directive, sources]) => {
      if (!sources || sources.length === 0) return ''
      const validSources = sources.filter((source: string) => source && source.trim() !== '')
      if (validSources.length === 0) return ''
      return `${directive} ${validSources.join(' ')}`
    })
    .filter(Boolean)
    .join('; ')
}

/**
 * Generate runtime CSP header with dynamic environment variables (safer approach)
 * This maintains compatibility with existing inline scripts while fixing Docker env var issues
 */
export function generateRuntimeCSP(): string {
  const socketUrl = getEnv('NEXT_PUBLIC_SOCKET_URL') || 'http://localhost:3002'
  const socketWsUrl =
    socketUrl.replace('http://', 'ws://').replace('https://', 'wss://') || 'ws://localhost:3002'
  const appUrl = getEnv('NEXT_PUBLIC_APP_URL') || ''
  const ollamaUrl = getEnv('OLLAMA_URL') || 'http://localhost:11434'

  const brandLogoDomains = getHostnameFromUrl(getEnv('NEXT_PUBLIC_BRAND_LOGO_URL'))
  const brandFaviconDomains = getHostnameFromUrl(getEnv('NEXT_PUBLIC_BRAND_FAVICON_URL'))
  const privacyDomains = getHostnameFromUrl(getEnv('NEXT_PUBLIC_PRIVACY_URL'))
  const termsDomains = getHostnameFromUrl(getEnv('NEXT_PUBLIC_TERMS_URL'))

  const allDynamicDomains = [
    ...brandLogoDomains,
    ...brandFaviconDomains,
    ...privacyDomains,
    ...termsDomains,
  ]
  const uniqueDynamicDomains = Array.from(new Set(allDynamicDomains))
  const dynamicDomainsStr = uniqueDynamicDomains.join(' ')
  const brandLogoDomain = brandLogoDomains[0] || ''
  const brandFaviconDomain = brandFaviconDomains[0] || ''

  return `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com https://apis.google.com https://assets.onedollarstats.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: blob: https://*.googleusercontent.com https://*.google.com https://*.atlassian.com https://cdn.discordapp.com https://*.githubusercontent.com https://*.s3.amazonaws.com https://s3.amazonaws.com https://*.amazonaws.com https://*.blob.core.windows.net https://github.com/* https://collector.onedollarstats.com ${brandLogoDomain} ${brandFaviconDomain};
    media-src 'self' blob:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' ${appUrl} ${ollamaUrl} ${socketUrl} ${socketWsUrl} https://api.browser-use.com https://api.exa.ai https://api.firecrawl.dev https://*.googleapis.com https://*.amazonaws.com https://*.s3.amazonaws.com https://*.blob.core.windows.net https://api.github.com https://github.com/* https://*.atlassian.com https://*.supabase.co https://collector.onedollarstats.com ${dynamicDomainsStr};
    frame-src https://drive.google.com https://docs.google.com https://*.google.com;
    frame-ancestors 'self';
    form-action 'self';
    base-uri 'self';
    object-src 'none';
  `
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/**
 * Get the main CSP policy string (build-time)
 */
export function getMainCSPPolicy(): string {
  return buildCSPString(buildTimeCSPDirectives)
}

/**
 * Permissive CSP for workflow execution endpoints
 */
export function getWorkflowExecutionCSPPolicy(): string {
  return "default-src * 'unsafe-inline' 'unsafe-eval'; connect-src *;"
}

/**
 * Add a source to a specific directive (modifies build-time directives)
 */
export function addCSPSource(directive: keyof CSPDirectives, source: string): void {
  if (!buildTimeCSPDirectives[directive]) {
    buildTimeCSPDirectives[directive] = []
  }
  if (!buildTimeCSPDirectives[directive]!.includes(source)) {
    buildTimeCSPDirectives[directive]!.push(source)
  }
}

/**
 * Remove a source from a specific directive (modifies build-time directives)
 */
export function removeCSPSource(directive: keyof CSPDirectives, source: string): void {
  if (buildTimeCSPDirectives[directive]) {
    buildTimeCSPDirectives[directive] = buildTimeCSPDirectives[directive]!.filter(
      (s: string) => s !== source
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: encryption.ts]---
Location: sim-main/apps/sim/lib/core/security/encryption.ts

```typescript
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('Encryption')

function getEncryptionKey(): Buffer {
  const key = env.ENCRYPTION_KEY
  if (!key || key.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be set to a 64-character hex string (32 bytes)')
  }
  return Buffer.from(key, 'hex')
}

/**
 * Encrypts a secret using AES-256-GCM
 * @param secret - The secret to encrypt
 * @returns A promise that resolves to an object containing the encrypted secret and IV
 */
export async function encryptSecret(secret: string): Promise<{ encrypted: string; iv: string }> {
  const iv = randomBytes(16)
  const key = getEncryptionKey()

  const cipher = createCipheriv('aes-256-gcm', key, iv)
  let encrypted = cipher.update(secret, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const authTag = cipher.getAuthTag()

  // Format: iv:encrypted:authTag
  return {
    encrypted: `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`,
    iv: iv.toString('hex'),
  }
}

/**
 * Decrypts an encrypted secret
 * @param encryptedValue - The encrypted value in format "iv:encrypted:authTag"
 * @returns A promise that resolves to an object containing the decrypted secret
 */
export async function decryptSecret(encryptedValue: string): Promise<{ decrypted: string }> {
  const parts = encryptedValue.split(':')
  const ivHex = parts[0]
  const authTagHex = parts[parts.length - 1]
  const encrypted = parts.slice(1, -1).join(':')

  if (!ivHex || !encrypted || !authTagHex) {
    throw new Error('Invalid encrypted value format. Expected "iv:encrypted:authTag"')
  }

  const key = getEncryptionKey()
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')

  try {
    const decipher = createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return { decrypted }
  } catch (error: any) {
    logger.error('Decryption error:', { error: error.message })
    throw error
  }
}

/**
 * Generates a secure random password
 * @param length - The length of the password (default: 24)
 * @returns A new secure password string
 */
export function generatePassword(length = 24): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+='
  let result = ''

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}
```

--------------------------------------------------------------------------------

````
