---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 570
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 570 of 933)

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
Location: sim-main/apps/sim/lib/knowledge/documents/types.ts

```typescript
// Document sorting options
export type DocumentSortField =
  | 'filename'
  | 'fileSize'
  | 'tokenCount'
  | 'chunkCount'
  | 'uploadedAt'
  | 'processingStatus'
export type SortOrder = 'asc' | 'desc'

export interface DocumentSortOptions {
  sortBy?: DocumentSortField
  sortOrder?: SortOrder
}

export interface DocChunk {
  /** The chunk text content */
  text: string
  /** Token count estimate for the chunk */
  tokenCount: number
  /** Source document path relative to docs/ */
  sourceDocument: string
  /** Link to the most relevant header section */
  headerLink: string
  /** The header text that this chunk belongs to */
  headerText: string
  /** Header level (1-6) */
  headerLevel: number
  /** OpenAI text embedding vector (1536 dimensions for text-embedding-3-small) */
  embedding: number[]
  /** Model used to generate the embedding */
  embeddingModel: string
  /** Metadata about the chunk */
  metadata: {
    /** Start position in the original document */
    startIndex: number
    /** End position in the original document */
    endIndex: number
    /** Whether this chunk contains the document frontmatter */
    hasFrontmatter?: boolean
    /** Document title from frontmatter */
    documentTitle?: string
    /** Document description from frontmatter */
    documentDescription?: string
  }
}

export interface DocsChunkerOptions {
  /** Target chunk size in tokens */
  chunkSize?: number
  /** Minimum chunk size in tokens */
  minChunkSize?: number
  /** Overlap between chunks in tokens */
  overlap?: number
  /** Base URL for generating links */
  baseUrl?: string
}

export interface HeaderInfo {
  /** Header text */
  text: string
  /** Header level (1-6) */
  level: number
  /** Anchor link */
  anchor: string
  /** Position in document */
  position: number
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/lib/knowledge/documents/utils.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('RetryUtils')

interface HTTPError extends Error {
  status?: number
  statusText?: string
}

type RetryableError = HTTPError | Error | { status?: number; message?: string }

export interface RetryOptions {
  maxRetries?: number
  initialDelayMs?: number
  maxDelayMs?: number
  backoffMultiplier?: number
  retryCondition?: (error: RetryableError) => boolean
}

export interface RetryResult<T> {
  success: boolean
  data?: T
  error?: Error
  attemptCount: number
}

function hasStatus(
  error: RetryableError
): error is HTTPError | { status?: number; message?: string } {
  return typeof error === 'object' && error !== null && 'status' in error
}

/**
 * Default retry condition for rate limiting errors
 */
export function isRetryableError(error: RetryableError): boolean {
  if (!error) return false

  // Check for rate limiting status codes
  if (
    hasStatus(error) &&
    (error.status === 429 || error.status === 502 || error.status === 503 || error.status === 504)
  ) {
    return true
  }

  // Check for rate limiting in error messages
  const errorMessage = error.message || error.toString()
  const rateLimitKeywords = [
    'rate limit',
    'rate_limit',
    'too many requests',
    'quota exceeded',
    'throttled',
    'retry after',
    'temporarily unavailable',
    'service unavailable',
  ]

  return rateLimitKeywords.some((keyword) => errorMessage.toLowerCase().includes(keyword))
}

/**
 * Executes a function with exponential backoff retry logic
 */
export async function retryWithExponentialBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 5,
    initialDelayMs = 1000,
    maxDelayMs = 30000,
    backoffMultiplier = 2,
    retryCondition = isRetryableError,
  } = options

  let lastError: Error | undefined
  let delay = initialDelayMs

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      logger.debug(`Executing operation attempt ${attempt + 1}/${maxRetries + 1}`)
      const result = await operation()

      if (attempt > 0) {
        logger.info(`Operation succeeded after ${attempt + 1} attempts`)
      }

      return result
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      logger.warn(`Operation failed on attempt ${attempt + 1}`, { error })

      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        logger.error(`Operation failed after ${maxRetries + 1} attempts`, { error })
        throw lastError
      }

      // Check if error is retryable
      if (!retryCondition(error as RetryableError)) {
        logger.warn('Error is not retryable, throwing immediately', { error })
        throw lastError
      }

      // Add jitter to prevent thundering herd
      const jitter = Math.random() * 0.1 * delay
      const actualDelay = Math.min(delay + jitter, maxDelayMs)

      logger.info(
        `Retrying in ${Math.round(actualDelay)}ms (attempt ${attempt + 1}/${maxRetries + 1})`
      )

      await new Promise((resolve) => setTimeout(resolve, actualDelay))

      // Exponential backoff
      delay = Math.min(delay * backoffMultiplier, maxDelayMs)
    }
  }

  throw lastError || new Error('Retry operation failed')
}

/**
 * Wrapper for fetch requests with retry logic
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<Response> {
  return retryWithExponentialBackoff(async () => {
    const response = await fetch(url, options)

    // If response is not ok and status indicates rate limiting, throw an error
    if (!response.ok && isRetryableError({ status: response.status })) {
      const errorText = await response.text()
      const error: HTTPError = new Error(
        `HTTP ${response.status}: ${response.statusText} - ${errorText}`
      )
      error.status = response.status
      error.statusText = response.statusText
      throw error
    }

    return response
  }, retryOptions)
}
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: sim-main/apps/sim/lib/knowledge/tags/service.ts

```typescript
import { randomUUID } from 'crypto'
import { db } from '@sim/db'
import { document, embedding, knowledgeBaseTagDefinitions } from '@sim/db/schema'
import { and, eq, isNotNull, isNull, sql } from 'drizzle-orm'
import {
  getSlotsForFieldType,
  SUPPORTED_FIELD_TYPES,
  type TAG_SLOT_CONFIG,
} from '@/lib/knowledge/constants'
import type { BulkTagDefinitionsData, DocumentTagDefinition } from '@/lib/knowledge/tags/types'
import type {
  CreateTagDefinitionData,
  TagDefinition,
  UpdateTagDefinitionData,
} from '@/lib/knowledge/types'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('TagsService')

const VALID_TAG_SLOTS = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7'] as const

function validateTagSlot(tagSlot: string): asserts tagSlot is (typeof VALID_TAG_SLOTS)[number] {
  if (!VALID_TAG_SLOTS.includes(tagSlot as (typeof VALID_TAG_SLOTS)[number])) {
    throw new Error(`Invalid tag slot: ${tagSlot}. Must be one of: ${VALID_TAG_SLOTS.join(', ')}`)
  }
}

/**
 * Get the next available slot for a knowledge base and field type
 */
export async function getNextAvailableSlot(
  knowledgeBaseId: string,
  fieldType: string,
  existingBySlot?: Map<string, any>
): Promise<string | null> {
  const availableSlots = getSlotsForFieldType(fieldType)
  let usedSlots: Set<string>

  if (existingBySlot) {
    usedSlots = new Set(
      Array.from(existingBySlot.entries())
        .filter(([_, def]) => def.fieldType === fieldType)
        .map(([slot, _]) => slot)
    )
  } else {
    const existingDefinitions = await db
      .select({ tagSlot: knowledgeBaseTagDefinitions.tagSlot })
      .from(knowledgeBaseTagDefinitions)
      .where(
        and(
          eq(knowledgeBaseTagDefinitions.knowledgeBaseId, knowledgeBaseId),
          eq(knowledgeBaseTagDefinitions.fieldType, fieldType)
        )
      )

    usedSlots = new Set(existingDefinitions.map((def) => def.tagSlot))
  }

  for (const slot of availableSlots) {
    if (!usedSlots.has(slot)) {
      return slot
    }
  }

  return null // All slots for this field type are used
}

/**
 * Get all tag definitions for a knowledge base
 */
export async function getDocumentTagDefinitions(
  knowledgeBaseId: string
): Promise<DocumentTagDefinition[]> {
  const definitions = await db
    .select({
      id: knowledgeBaseTagDefinitions.id,
      knowledgeBaseId: knowledgeBaseTagDefinitions.knowledgeBaseId,
      tagSlot: knowledgeBaseTagDefinitions.tagSlot,
      displayName: knowledgeBaseTagDefinitions.displayName,
      fieldType: knowledgeBaseTagDefinitions.fieldType,
      createdAt: knowledgeBaseTagDefinitions.createdAt,
      updatedAt: knowledgeBaseTagDefinitions.updatedAt,
    })
    .from(knowledgeBaseTagDefinitions)
    .where(eq(knowledgeBaseTagDefinitions.knowledgeBaseId, knowledgeBaseId))
    .orderBy(knowledgeBaseTagDefinitions.tagSlot)

  return definitions.map((def) => ({
    ...def,
    tagSlot: def.tagSlot as string,
  }))
}

/**
 * Get all tag definitions for a knowledge base (alias for compatibility)
 */
export async function getTagDefinitions(knowledgeBaseId: string): Promise<TagDefinition[]> {
  const tagDefinitions = await db
    .select({
      id: knowledgeBaseTagDefinitions.id,
      tagSlot: knowledgeBaseTagDefinitions.tagSlot,
      displayName: knowledgeBaseTagDefinitions.displayName,
      fieldType: knowledgeBaseTagDefinitions.fieldType,
      createdAt: knowledgeBaseTagDefinitions.createdAt,
      updatedAt: knowledgeBaseTagDefinitions.updatedAt,
    })
    .from(knowledgeBaseTagDefinitions)
    .where(eq(knowledgeBaseTagDefinitions.knowledgeBaseId, knowledgeBaseId))
    .orderBy(knowledgeBaseTagDefinitions.tagSlot)

  return tagDefinitions.map((def) => ({
    ...def,
    tagSlot: def.tagSlot as string,
  }))
}

/**
 * Create or update tag definitions in bulk
 */
export async function createOrUpdateTagDefinitionsBulk(
  knowledgeBaseId: string,
  bulkData: BulkTagDefinitionsData,
  requestId: string
): Promise<{
  created: DocumentTagDefinition[]
  updated: DocumentTagDefinition[]
  errors: string[]
}> {
  const { definitions } = bulkData
  const created: DocumentTagDefinition[] = []
  const updated: DocumentTagDefinition[] = []
  const errors: string[] = []

  // Get existing definitions to check for conflicts and determine operations
  const existingDefinitions = await getDocumentTagDefinitions(knowledgeBaseId)
  const existingBySlot = new Map(existingDefinitions.map((def) => [def.tagSlot, def]))
  const existingByDisplayName = new Map(existingDefinitions.map((def) => [def.displayName, def]))

  // Process each definition
  for (const defData of definitions) {
    try {
      const { tagSlot, displayName, fieldType, originalDisplayName } = defData

      // Validate field type
      if (!SUPPORTED_FIELD_TYPES.includes(fieldType as (typeof SUPPORTED_FIELD_TYPES)[number])) {
        errors.push(`Invalid field type: ${fieldType}`)
        continue
      }

      // Check if this is an update (has originalDisplayName) or create
      const isUpdate = !!originalDisplayName

      if (isUpdate) {
        // Update existing definition
        const existingDef = existingByDisplayName.get(originalDisplayName!)
        if (!existingDef) {
          errors.push(`Tag definition with display name "${originalDisplayName}" not found`)
          continue
        }

        // Check if new display name conflicts with another definition
        if (displayName !== originalDisplayName && existingByDisplayName.has(displayName)) {
          errors.push(`Display name "${displayName}" already exists`)
          continue
        }

        const now = new Date()
        await db
          .update(knowledgeBaseTagDefinitions)
          .set({
            displayName,
            fieldType,
            updatedAt: now,
          })
          .where(eq(knowledgeBaseTagDefinitions.id, existingDef.id))

        updated.push({
          id: existingDef.id,
          knowledgeBaseId,
          tagSlot: existingDef.tagSlot,
          displayName,
          fieldType,
          createdAt: existingDef.createdAt,
          updatedAt: now,
        })
      } else {
        // Create new definition
        let finalTagSlot = tagSlot

        // If no slot provided or slot is taken, find next available
        if (!finalTagSlot || existingBySlot.has(finalTagSlot)) {
          const nextSlot = await getNextAvailableSlot(knowledgeBaseId, fieldType, existingBySlot)
          if (!nextSlot) {
            errors.push(`No available slots for field type "${fieldType}"`)
            continue
          }
          finalTagSlot = nextSlot
        }

        // Check slot conflicts
        if (existingBySlot.has(finalTagSlot)) {
          errors.push(`Tag slot "${finalTagSlot}" is already in use`)
          continue
        }

        // Check display name conflicts
        if (existingByDisplayName.has(displayName)) {
          errors.push(`Display name "${displayName}" already exists`)
          continue
        }

        const id = randomUUID()
        const now = new Date()

        const newDefinition = {
          id,
          knowledgeBaseId,
          tagSlot: finalTagSlot as (typeof TAG_SLOT_CONFIG.text.slots)[number],
          displayName,
          fieldType,
          createdAt: now,
          updatedAt: now,
        }

        await db.insert(knowledgeBaseTagDefinitions).values(newDefinition)

        // Add to maps to track for subsequent definitions in this batch
        existingBySlot.set(finalTagSlot, newDefinition)
        existingByDisplayName.set(displayName, newDefinition)

        created.push(newDefinition as DocumentTagDefinition)
      }
    } catch (error) {
      errors.push(`Error processing definition "${defData.displayName}": ${error}`)
    }
  }

  logger.info(
    `[${requestId}] Bulk tag definitions processed: ${created.length} created, ${updated.length} updated, ${errors.length} errors`
  )

  return { created, updated, errors }
}

/**
 * Get a single tag definition by ID
 */
export async function getTagDefinitionById(
  tagDefinitionId: string
): Promise<DocumentTagDefinition | null> {
  const result = await db
    .select({
      id: knowledgeBaseTagDefinitions.id,
      knowledgeBaseId: knowledgeBaseTagDefinitions.knowledgeBaseId,
      tagSlot: knowledgeBaseTagDefinitions.tagSlot,
      displayName: knowledgeBaseTagDefinitions.displayName,
      fieldType: knowledgeBaseTagDefinitions.fieldType,
      createdAt: knowledgeBaseTagDefinitions.createdAt,
      updatedAt: knowledgeBaseTagDefinitions.updatedAt,
    })
    .from(knowledgeBaseTagDefinitions)
    .where(eq(knowledgeBaseTagDefinitions.id, tagDefinitionId))
    .limit(1)

  if (result.length === 0) {
    return null
  }

  const def = result[0]
  return {
    ...def,
    tagSlot: def.tagSlot as string,
  }
}

/**
 * Update tags on all documents and chunks when a tag value is changed
 */
export async function updateTagValuesInDocumentsAndChunks(
  knowledgeBaseId: string,
  tagSlot: string,
  oldValue: string | null,
  newValue: string | null,
  requestId: string
): Promise<{ documentsUpdated: number; chunksUpdated: number }> {
  validateTagSlot(tagSlot)

  let documentsUpdated = 0
  let chunksUpdated = 0

  await db.transaction(async (tx) => {
    if (oldValue) {
      await tx
        .update(document)
        .set({
          [tagSlot]: newValue,
        })
        .where(
          and(
            eq(document.knowledgeBaseId, knowledgeBaseId),
            eq(sql.raw(`${document}.${tagSlot}`), oldValue)
          )
        )
      documentsUpdated = 1
    }

    if (oldValue) {
      await tx
        .update(embedding)
        .set({
          [tagSlot]: newValue,
        })
        .where(
          and(
            eq(embedding.knowledgeBaseId, knowledgeBaseId),
            eq(sql.raw(`${embedding}.${tagSlot}`), oldValue)
          )
        )
      chunksUpdated = 1
    }
  })

  logger.info(
    `[${requestId}] Updated tag values: ${documentsUpdated} documents, ${chunksUpdated} chunks`
  )

  return { documentsUpdated, chunksUpdated }
}

/**
 * Cleanup unused tag definitions for a knowledge base
 */
export async function cleanupUnusedTagDefinitions(
  knowledgeBaseId: string,
  requestId: string
): Promise<number> {
  const definitions = await getDocumentTagDefinitions(knowledgeBaseId)
  let cleanedUp = 0

  for (const def of definitions) {
    const tagSlot = def.tagSlot
    validateTagSlot(tagSlot)

    const docCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(document)
      .where(
        and(
          eq(document.knowledgeBaseId, knowledgeBaseId),
          isNull(document.deletedAt),
          sql`${sql.raw(tagSlot)} IS NOT NULL`
        )
      )

    const chunkCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(embedding)
      .where(
        and(eq(embedding.knowledgeBaseId, knowledgeBaseId), sql`${sql.raw(tagSlot)} IS NOT NULL`)
      )

    const docCount = Number(docCountResult[0]?.count || 0)
    const chunkCount = Number(chunkCountResult[0]?.count || 0)

    if (docCount === 0 && chunkCount === 0) {
      await db.delete(knowledgeBaseTagDefinitions).where(eq(knowledgeBaseTagDefinitions.id, def.id))

      cleanedUp++
      logger.info(
        `[${requestId}] Cleaned up unused tag definition: ${def.displayName} (${def.tagSlot})`
      )
    }
  }

  logger.info(`[${requestId}] Cleanup completed: ${cleanedUp} unused tag definitions removed`)
  return cleanedUp
}

/**
 * Delete all tag definitions for a knowledge base
 */
export async function deleteAllTagDefinitions(
  knowledgeBaseId: string,
  requestId: string
): Promise<number> {
  const result = await db
    .delete(knowledgeBaseTagDefinitions)
    .where(eq(knowledgeBaseTagDefinitions.knowledgeBaseId, knowledgeBaseId))
    .returning({ id: knowledgeBaseTagDefinitions.id })

  const deletedCount = result.length
  logger.info(`[${requestId}] Deleted ${deletedCount} tag definitions for KB: ${knowledgeBaseId}`)

  return deletedCount
}

/**
 * Delete a tag definition with comprehensive cleanup
 * This removes the definition and clears all document/chunk references
 */
export async function deleteTagDefinition(
  tagDefinitionId: string,
  requestId: string
): Promise<{ tagSlot: string; displayName: string }> {
  const tagDef = await db
    .select({
      id: knowledgeBaseTagDefinitions.id,
      knowledgeBaseId: knowledgeBaseTagDefinitions.knowledgeBaseId,
      tagSlot: knowledgeBaseTagDefinitions.tagSlot,
      displayName: knowledgeBaseTagDefinitions.displayName,
    })
    .from(knowledgeBaseTagDefinitions)
    .where(eq(knowledgeBaseTagDefinitions.id, tagDefinitionId))
    .limit(1)

  if (tagDef.length === 0) {
    throw new Error(`Tag definition ${tagDefinitionId} not found`)
  }

  const definition = tagDef[0]
  const knowledgeBaseId = definition.knowledgeBaseId
  const tagSlot = definition.tagSlot as string

  validateTagSlot(tagSlot)

  await db.transaction(async (tx) => {
    await tx
      .update(document)
      .set({ [tagSlot]: null })
      .where(
        and(eq(document.knowledgeBaseId, knowledgeBaseId), isNotNull(sql`${sql.raw(tagSlot)}`))
      )

    await tx
      .update(embedding)
      .set({ [tagSlot]: null })
      .where(
        and(eq(embedding.knowledgeBaseId, knowledgeBaseId), isNotNull(sql`${sql.raw(tagSlot)}`))
      )

    await tx
      .delete(knowledgeBaseTagDefinitions)
      .where(eq(knowledgeBaseTagDefinitions.id, tagDefinitionId))
  })

  logger.info(
    `[${requestId}] Deleted tag definition with cleanup: ${definition.displayName} (${tagSlot})`
  )

  return {
    tagSlot,
    displayName: definition.displayName,
  }
}

/**
 * Create a new tag definition
 */
export async function createTagDefinition(
  data: CreateTagDefinitionData,
  requestId: string
): Promise<TagDefinition> {
  const tagDefinitionId = randomUUID()
  const now = new Date()

  const newDefinition = {
    id: tagDefinitionId,
    knowledgeBaseId: data.knowledgeBaseId,
    tagSlot: data.tagSlot as (typeof TAG_SLOT_CONFIG.text.slots)[number],
    displayName: data.displayName,
    fieldType: data.fieldType,
    createdAt: now,
    updatedAt: now,
  }

  await db.insert(knowledgeBaseTagDefinitions).values(newDefinition)

  logger.info(
    `[${requestId}] Created tag definition: ${data.displayName} -> ${data.tagSlot} in KB ${data.knowledgeBaseId}`
  )

  return {
    id: tagDefinitionId,
    tagSlot: data.tagSlot,
    displayName: data.displayName,
    fieldType: data.fieldType,
    createdAt: now,
    updatedAt: now,
  }
}

/**
 * Update an existing tag definition
 */
export async function updateTagDefinition(
  tagDefinitionId: string,
  data: UpdateTagDefinitionData,
  requestId: string
): Promise<TagDefinition> {
  const now = new Date()

  const updateData: {
    updatedAt: Date
    displayName?: string
    fieldType?: string
  } = {
    updatedAt: now,
  }

  if (data.displayName !== undefined) {
    updateData.displayName = data.displayName
  }

  if (data.fieldType !== undefined) {
    updateData.fieldType = data.fieldType
  }

  const updatedRows = await db
    .update(knowledgeBaseTagDefinitions)
    .set(updateData)
    .where(eq(knowledgeBaseTagDefinitions.id, tagDefinitionId))
    .returning({
      id: knowledgeBaseTagDefinitions.id,
      tagSlot: knowledgeBaseTagDefinitions.tagSlot,
      displayName: knowledgeBaseTagDefinitions.displayName,
      fieldType: knowledgeBaseTagDefinitions.fieldType,
      createdAt: knowledgeBaseTagDefinitions.createdAt,
      updatedAt: knowledgeBaseTagDefinitions.updatedAt,
    })

  if (updatedRows.length === 0) {
    throw new Error(`Tag definition ${tagDefinitionId} not found`)
  }

  const updated = updatedRows[0]
  logger.info(`[${requestId}] Updated tag definition: ${tagDefinitionId}`)

  return {
    ...updated,
    tagSlot: updated.tagSlot as string,
  }
}

/**
 * Get tag usage with detailed document information (original format)
 */
export async function getTagUsage(
  knowledgeBaseId: string,
  requestId = 'api'
): Promise<
  Array<{
    tagName: string
    tagSlot: string
    documentCount: number
    documents: Array<{ id: string; name: string; tagValue: string }>
  }>
> {
  const definitions = await getDocumentTagDefinitions(knowledgeBaseId)
  const usage = []

  for (const def of definitions) {
    const tagSlot = def.tagSlot
    validateTagSlot(tagSlot)

    const documentsWithTag = await db
      .select({
        id: document.id,
        filename: document.filename,
        tagValue: sql<string>`${sql.raw(tagSlot)}`,
      })
      .from(document)
      .where(
        and(
          eq(document.knowledgeBaseId, knowledgeBaseId),
          isNull(document.deletedAt),
          isNotNull(sql`${sql.raw(tagSlot)}`),
          sql`${sql.raw(tagSlot)} != ''`
        )
      )

    usage.push({
      tagName: def.displayName,
      tagSlot: def.tagSlot,
      documentCount: documentsWithTag.length,
      documents: documentsWithTag.map((doc) => ({
        id: doc.id,
        name: doc.filename,
        tagValue: doc.tagValue || '',
      })),
    })
  }

  logger.info(`[${requestId}] Retrieved detailed tag usage for ${usage.length} definitions`)

  return usage
}

/**
 * Get tag usage statistics
 */
export async function getTagUsageStats(
  knowledgeBaseId: string,
  requestId: string
): Promise<
  Array<{
    tagSlot: string
    displayName: string
    fieldType: string
    documentCount: number
    chunkCount: number
  }>
> {
  const definitions = await getDocumentTagDefinitions(knowledgeBaseId)
  const stats = []

  for (const def of definitions) {
    const tagSlot = def.tagSlot
    validateTagSlot(tagSlot)

    const docCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(document)
      .where(
        and(
          eq(document.knowledgeBaseId, knowledgeBaseId),
          isNull(document.deletedAt),
          sql`${sql.raw(tagSlot)} IS NOT NULL`
        )
      )

    const chunkCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(embedding)
      .where(
        and(eq(embedding.knowledgeBaseId, knowledgeBaseId), sql`${sql.raw(tagSlot)} IS NOT NULL`)
      )

    stats.push({
      tagSlot: def.tagSlot,
      displayName: def.displayName,
      fieldType: def.fieldType,
      documentCount: Number(docCountResult[0]?.count || 0),
      chunkCount: Number(chunkCountResult[0]?.count || 0),
    })
  }

  logger.info(`[${requestId}] Retrieved tag usage stats for ${stats.length} definitions`)

  return stats
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/lib/knowledge/tags/types.ts

```typescript
export interface DocumentTagDefinition {
  id: string
  knowledgeBaseId: string
  tagSlot: string
  displayName: string
  fieldType: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Represents a tag assigned to a document with its slot, display name, type, and value
 */
export interface DocumentTag {
  slot: string
  displayName: string
  fieldType: string
  value: string
}

export interface CreateTagDefinitionData {
  tagSlot: string
  displayName: string
  fieldType: string
  originalDisplayName?: string
}

export interface BulkTagDefinitionsData {
  definitions: CreateTagDefinitionData[]
}
```

--------------------------------------------------------------------------------

---[FILE: events.ts]---
Location: sim-main/apps/sim/lib/logs/events.ts

```typescript
import { db } from '@sim/db'
import {
  workflow,
  workspaceNotificationDelivery,
  workspaceNotificationSubscription,
} from '@sim/db/schema'
import { and, eq, or, sql } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { isTriggerDevEnabled } from '@/lib/core/config/feature-flags'
import { createLogger } from '@/lib/logs/console/logger'
import type { WorkflowExecutionLog } from '@/lib/logs/types'
import {
  type AlertCheckContext,
  type AlertConfig,
  shouldTriggerAlert,
} from '@/lib/notifications/alert-rules'
import {
  executeNotificationDelivery,
  workspaceNotificationDeliveryTask,
} from '@/background/workspace-notification-delivery'

const logger = createLogger('LogsEventEmitter')

function prepareLogData(
  log: WorkflowExecutionLog,
  subscription: {
    includeFinalOutput: boolean
    includeTraceSpans: boolean
  }
) {
  const preparedLog = { ...log, executionData: {} as Record<string, unknown> }

  if (log.executionData) {
    const data = log.executionData as Record<string, unknown>
    const webhookData: Record<string, unknown> = {}

    if (subscription.includeFinalOutput && data.finalOutput) {
      webhookData.finalOutput = data.finalOutput
    }

    if (subscription.includeTraceSpans && data.traceSpans) {
      webhookData.traceSpans = data.traceSpans
    }

    preparedLog.executionData = webhookData
  }

  return preparedLog
}

export async function emitWorkflowExecutionCompleted(log: WorkflowExecutionLog): Promise<void> {
  try {
    const workflowData = await db
      .select({ workspaceId: workflow.workspaceId })
      .from(workflow)
      .where(eq(workflow.id, log.workflowId))
      .limit(1)

    if (workflowData.length === 0 || !workflowData[0].workspaceId) return

    const workspaceId = workflowData[0].workspaceId

    const subscriptions = await db
      .select()
      .from(workspaceNotificationSubscription)
      .where(
        and(
          eq(workspaceNotificationSubscription.workspaceId, workspaceId),
          eq(workspaceNotificationSubscription.active, true),
          or(
            eq(workspaceNotificationSubscription.allWorkflows, true),
            sql`${log.workflowId} = ANY(${workspaceNotificationSubscription.workflowIds})`
          )
        )
      )

    if (subscriptions.length === 0) return

    logger.debug(
      `Found ${subscriptions.length} active notification subscriptions for workspace ${workspaceId}`
    )

    for (const subscription of subscriptions) {
      const levelMatches = subscription.levelFilter?.includes(log.level) ?? true
      const triggerMatches = subscription.triggerFilter?.includes(log.trigger) ?? true

      if (!levelMatches || !triggerMatches) {
        logger.debug(`Skipping subscription ${subscription.id} due to filter mismatch`)
        continue
      }

      const alertConfig = subscription.alertConfig as AlertConfig | null

      if (alertConfig) {
        const context: AlertCheckContext = {
          workflowId: log.workflowId,
          executionId: log.executionId,
          status: log.level === 'error' ? 'error' : 'success',
          durationMs: log.totalDurationMs || 0,
          cost: (log.cost as { total?: number })?.total || 0,
        }

        const shouldAlert = await shouldTriggerAlert(alertConfig, context, subscription.lastAlertAt)

        if (!shouldAlert) {
          logger.debug(`Alert condition not met for subscription ${subscription.id}`)
          continue
        }

        await db
          .update(workspaceNotificationSubscription)
          .set({ lastAlertAt: new Date() })
          .where(eq(workspaceNotificationSubscription.id, subscription.id))

        logger.info(`Alert triggered for subscription ${subscription.id}`, {
          workflowId: log.workflowId,
          alertConfig,
        })
      }

      const deliveryId = uuidv4()

      await db.insert(workspaceNotificationDelivery).values({
        id: deliveryId,
        subscriptionId: subscription.id,
        workflowId: log.workflowId,
        executionId: log.executionId,
        status: 'pending',
        attempts: 0,
        nextAttemptAt: new Date(),
      })

      const notificationLog = prepareLogData(log, subscription)

      const payload = {
        deliveryId,
        subscriptionId: subscription.id,
        notificationType: subscription.notificationType,
        log: notificationLog,
        alertConfig: alertConfig || undefined,
      }

      if (isTriggerDevEnabled) {
        await workspaceNotificationDeliveryTask.trigger(payload)
        logger.info(
          `Enqueued ${subscription.notificationType} notification ${deliveryId} via Trigger.dev`
        )
      } else {
        void executeNotificationDelivery(payload).catch((error) => {
          logger.error(`Direct notification delivery failed for ${deliveryId}`, { error })
        })
        logger.info(`Enqueued ${subscription.notificationType} notification ${deliveryId} directly`)
      }
    }
  } catch (error) {
    logger.error('Failed to emit workflow execution completed event', {
      error,
      workflowId: log.workflowId,
      executionId: log.executionId,
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: get-trigger-options.ts]---
Location: sim-main/apps/sim/lib/logs/get-trigger-options.ts

```typescript
import { getBlock } from '@/blocks/registry'
import { getAllTriggers } from '@/triggers'

export interface TriggerOption {
  value: string
  label: string
  color: string
}

let cachedTriggerOptions: TriggerOption[] | null = null
let cachedTriggerMetadataMap: Map<string, { label: string; color: string }> | null = null

/**
 * Reset cache - useful for HMR in development or testing
 */
export function resetTriggerOptionsCache() {
  cachedTriggerOptions = null
  cachedTriggerMetadataMap = null
}

/**
 * Dynamically generates trigger filter options from the trigger registry and block definitions.
 * Results are cached after first call for performance (~98% faster on subsequent calls).
 */
export function getTriggerOptions(): TriggerOption[] {
  if (cachedTriggerOptions) {
    return cachedTriggerOptions
  }

  const triggers = getAllTriggers()
  const providerMap = new Map<string, TriggerOption>()

  const coreTypes: TriggerOption[] = [
    { value: 'manual', label: 'Manual', color: '#6b7280' },
    { value: 'api', label: 'API', color: '#2563eb' },
    { value: 'schedule', label: 'Schedule', color: '#059669' },
    { value: 'chat', label: 'Chat', color: '#7c3aed' },
    { value: 'webhook', label: 'Webhook', color: '#ea580c' },
  ]

  for (const trigger of triggers) {
    const provider = trigger.provider

    // Skip generic webhook and already processed providers
    if (!provider || providerMap.has(provider) || provider === 'generic') {
      continue
    }

    const block = getBlock(provider)

    if (block) {
      providerMap.set(provider, {
        value: provider,
        label: block.name, // Use block's display name (e.g., "Slack", "GitHub")
        color: block.bgColor || '#6b7280', // Use block's hex color, fallback to gray
      })
    } else {
      const label = formatProviderName(provider)
      providerMap.set(provider, {
        value: provider,
        label,
        color: '#6b7280', // gray fallback
      })
    }
  }

  const integrationOptions = Array.from(providerMap.values()).sort((a, b) =>
    a.label.localeCompare(b.label)
  )

  cachedTriggerOptions = [...coreTypes, ...integrationOptions]
  return cachedTriggerOptions
}

/**
 * Formats a provider name into a display-friendly label
 * e.g., "microsoft_teams" -> "Microsoft Teams"
 */
function formatProviderName(provider: string): string {
  return provider
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Internal: Initialize metadata map for O(1) lookups
 * Converts array of options to Map for fast access
 */
function initializeTriggerMetadataMap(): Map<string, { label: string; color: string }> {
  if (cachedTriggerMetadataMap) {
    return cachedTriggerMetadataMap
  }

  const options = getTriggerOptions()
  cachedTriggerMetadataMap = new Map(
    options.map((opt) => [opt.value, { label: opt.label, color: opt.color }])
  )

  return cachedTriggerMetadataMap
}

/**
 * Gets integration metadata (label and color) for a specific trigger type.
 */
export function getIntegrationMetadata(triggerType: string): { label: string; color: string } {
  const metadataMap = initializeTriggerMetadataMap()
  const found = metadataMap.get(triggerType)

  if (found) {
    return found
  }

  return {
    label: formatProviderName(triggerType),
    color: '#6b7280', // gray
  }
}
```

--------------------------------------------------------------------------------

````
