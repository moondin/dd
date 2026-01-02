---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 567
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 567 of 933)

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

---[FILE: validate_pii.ts]---
Location: sim-main/apps/sim/lib/guardrails/validate_pii.ts

```typescript
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('PIIValidator')
const DEFAULT_TIMEOUT = 30000 // 30 seconds

export interface PIIValidationInput {
  text: string
  entityTypes: string[] // e.g., ["PERSON", "EMAIL_ADDRESS", "CREDIT_CARD"]
  mode: 'block' | 'mask' // block = fail if PII found, mask = return masked text
  language?: string // default: "en"
  requestId: string
}

export interface DetectedPIIEntity {
  type: string
  start: number
  end: number
  score: number
  text: string
}

export interface PIIValidationResult {
  passed: boolean
  error?: string
  detectedEntities: DetectedPIIEntity[]
  maskedText?: string
}

/**
 * Validate text for PII using Microsoft Presidio
 *
 * Supports two modes:
 * - block: Fails validation if any PII is detected
 * - mask: Passes validation and returns masked text with PII replaced
 */
export async function validatePII(input: PIIValidationInput): Promise<PIIValidationResult> {
  const { text, entityTypes, mode, language = 'en', requestId } = input

  logger.info(`[${requestId}] Starting PII validation`, {
    textLength: text.length,
    entityTypes,
    mode,
    language,
  })

  try {
    // Call Python script for PII detection
    const result = await executePythonPIIDetection(text, entityTypes, mode, language, requestId)

    logger.info(`[${requestId}] PII validation completed`, {
      passed: result.passed,
      detectedCount: result.detectedEntities.length,
      hasMaskedText: !!result.maskedText,
    })

    return result
  } catch (error: any) {
    logger.error(`[${requestId}] PII validation failed`, {
      error: error.message,
    })

    return {
      passed: false,
      error: `PII validation failed: ${error.message}`,
      detectedEntities: [],
    }
  }
}

/**
 * Execute Python PII detection script
 */
async function executePythonPIIDetection(
  text: string,
  entityTypes: string[],
  mode: string,
  language: string,
  requestId: string
): Promise<PIIValidationResult> {
  return new Promise((resolve, reject) => {
    // Use path relative to project root
    // In Next.js, process.cwd() returns the project root
    const guardrailsDir = path.join(process.cwd(), 'lib/guardrails')
    const scriptPath = path.join(guardrailsDir, 'validate_pii.py')
    const venvPython = path.join(guardrailsDir, 'venv/bin/python3')

    // Use venv Python if it exists, otherwise fall back to system python3
    const pythonCmd = fs.existsSync(venvPython) ? venvPython : 'python3'

    const python = spawn(pythonCmd, [scriptPath])

    let stdout = ''
    let stderr = ''

    const timeout = setTimeout(() => {
      python.kill()
      reject(new Error('PII validation timeout'))
    }, DEFAULT_TIMEOUT)

    // Write input to stdin as JSON
    const inputData = JSON.stringify({
      text,
      entityTypes,
      mode,
      language,
    })
    python.stdin.write(inputData)
    python.stdin.end()

    python.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    python.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    python.on('close', (code) => {
      clearTimeout(timeout)

      if (code !== 0) {
        logger.error(`[${requestId}] Python PII detection failed`, {
          code,
          stderr,
        })
        resolve({
          passed: false,
          error: stderr || 'PII detection failed',
          detectedEntities: [],
        })
        return
      }

      // Parse result from stdout
      try {
        const prefix = '__SIM_RESULT__='
        const lines = stdout.split('\n')
        const marker = lines.find((l) => l.startsWith(prefix))

        if (marker) {
          const jsonPart = marker.slice(prefix.length)
          const result = JSON.parse(jsonPart)
          resolve(result)
        } else {
          logger.error(`[${requestId}] No result marker found`, {
            stdout,
            stderr,
            stdoutLines: lines,
          })
          resolve({
            passed: false,
            error: `No result marker found in output. stdout: ${stdout.substring(0, 200)}, stderr: ${stderr.substring(0, 200)}`,
            detectedEntities: [],
          })
        }
      } catch (error: any) {
        logger.error(`[${requestId}] Failed to parse Python result`, {
          error: error.message,
          stdout,
          stderr,
        })
        resolve({
          passed: false,
          error: `Failed to parse result: ${error.message}. stdout: ${stdout.substring(0, 200)}`,
          detectedEntities: [],
        })
      }
    })

    python.on('error', (error) => {
      clearTimeout(timeout)
      logger.error(`[${requestId}] Failed to spawn Python process`, {
        error: error.message,
      })
      reject(
        new Error(
          `Failed to execute Python: ${error.message}. Make sure Python 3 and Presidio are installed.`
        )
      )
    })
  })
}

/**
 * List of all supported PII entity types
 * Based on Microsoft Presidio's supported entities
 */
export const SUPPORTED_PII_ENTITIES = {
  // Common/Global
  CREDIT_CARD: 'Credit card number',
  CRYPTO: 'Cryptocurrency wallet address',
  DATE_TIME: 'Date or time',
  EMAIL_ADDRESS: 'Email address',
  IBAN_CODE: 'International Bank Account Number',
  IP_ADDRESS: 'IP address',
  NRP: 'Nationality, religious or political group',
  LOCATION: 'Location',
  PERSON: 'Person name',
  PHONE_NUMBER: 'Phone number',
  MEDICAL_LICENSE: 'Medical license number',
  URL: 'URL',

  // USA
  US_BANK_NUMBER: 'US bank account number',
  US_DRIVER_LICENSE: 'US driver license',
  US_ITIN: 'US Individual Taxpayer Identification Number',
  US_PASSPORT: 'US passport number',
  US_SSN: 'US Social Security Number',

  // UK
  UK_NHS: 'UK NHS number',
  UK_NINO: 'UK National Insurance Number',

  // Other countries
  ES_NIF: 'Spanish NIF number',
  ES_NIE: 'Spanish NIE number',
  IT_FISCAL_CODE: 'Italian fiscal code',
  IT_DRIVER_LICENSE: 'Italian driver license',
  IT_VAT_CODE: 'Italian VAT code',
  IT_PASSPORT: 'Italian passport',
  IT_IDENTITY_CARD: 'Italian identity card',
  PL_PESEL: 'Polish PESEL number',
  SG_NRIC_FIN: 'Singapore NRIC/FIN',
  SG_UEN: 'Singapore Unique Entity Number',
  AU_ABN: 'Australian Business Number',
  AU_ACN: 'Australian Company Number',
  AU_TFN: 'Australian Tax File Number',
  AU_MEDICARE: 'Australian Medicare number',
  IN_PAN: 'Indian Permanent Account Number',
  IN_AADHAAR: 'Indian Aadhaar number',
  IN_VEHICLE_REGISTRATION: 'Indian vehicle registration',
  IN_VOTER: 'Indian voter ID',
  IN_PASSPORT: 'Indian passport',
  FI_PERSONAL_IDENTITY_CODE: 'Finnish Personal Identity Code',
  KR_RRN: 'Korean Resident Registration Number',
  TH_TNIN: 'Thai National ID Number',
} as const

export type PIIEntityType = keyof typeof SUPPORTED_PII_ENTITIES
```

--------------------------------------------------------------------------------

---[FILE: validate_regex.ts]---
Location: sim-main/apps/sim/lib/guardrails/validate_regex.ts

```typescript
/**
 * Validate if input matches regex pattern
 */
export interface ValidationResult {
  passed: boolean
  error?: string
}

export function validateRegex(inputStr: string, pattern: string): ValidationResult {
  try {
    const regex = new RegExp(pattern)
    const match = regex.test(inputStr)

    if (match) {
      return { passed: true }
    }
    return { passed: false, error: 'Input does not match regex pattern' }
  } catch (error: any) {
    return { passed: false, error: `Invalid regex pattern: ${error.message}` }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: sim-main/apps/sim/lib/knowledge/constants.ts

```typescript
export const TAG_SLOT_CONFIG = {
  text: {
    slots: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7'] as const,
    maxSlots: 7,
  },
} as const

export const SUPPORTED_FIELD_TYPES = Object.keys(TAG_SLOT_CONFIG) as Array<
  keyof typeof TAG_SLOT_CONFIG
>

export const TAG_SLOTS = TAG_SLOT_CONFIG.text.slots

export const MAX_TAG_SLOTS = TAG_SLOT_CONFIG.text.maxSlots

export type TagSlot = (typeof TAG_SLOTS)[number]

export function getSlotsForFieldType(fieldType: string): readonly string[] {
  const config = TAG_SLOT_CONFIG[fieldType as keyof typeof TAG_SLOT_CONFIG]
  if (!config) {
    return []
  }
  return config.slots
}
```

--------------------------------------------------------------------------------

---[FILE: embeddings.ts]---
Location: sim-main/apps/sim/lib/knowledge/embeddings.ts

```typescript
import { env } from '@/lib/core/config/env'
import { isRetryableError, retryWithExponentialBackoff } from '@/lib/knowledge/documents/utils'
import { createLogger } from '@/lib/logs/console/logger'
import { batchByTokenLimit, getTotalTokenCount } from '@/lib/tokenization'

const logger = createLogger('EmbeddingUtils')

const MAX_TOKENS_PER_REQUEST = 8000

export class EmbeddingAPIError extends Error {
  public status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'EmbeddingAPIError'
    this.status = status
  }
}

interface EmbeddingConfig {
  useAzure: boolean
  apiUrl: string
  headers: Record<string, string>
  modelName: string
}

function getEmbeddingConfig(embeddingModel = 'text-embedding-3-small'): EmbeddingConfig {
  const azureApiKey = env.AZURE_OPENAI_API_KEY
  const azureEndpoint = env.AZURE_OPENAI_ENDPOINT
  const azureApiVersion = env.AZURE_OPENAI_API_VERSION
  const kbModelName = env.KB_OPENAI_MODEL_NAME || embeddingModel
  const openaiApiKey = env.OPENAI_API_KEY

  const useAzure = !!(azureApiKey && azureEndpoint)

  if (!useAzure && !openaiApiKey) {
    throw new Error(
      'Either OPENAI_API_KEY or Azure OpenAI configuration (AZURE_OPENAI_API_KEY + AZURE_OPENAI_ENDPOINT) must be configured'
    )
  }

  const apiUrl = useAzure
    ? `${azureEndpoint}/openai/deployments/${kbModelName}/embeddings?api-version=${azureApiVersion}`
    : 'https://api.openai.com/v1/embeddings'

  const headers: Record<string, string> = useAzure
    ? {
        'api-key': azureApiKey!,
        'Content-Type': 'application/json',
      }
    : {
        Authorization: `Bearer ${openaiApiKey!}`,
        'Content-Type': 'application/json',
      }

  return {
    useAzure,
    apiUrl,
    headers,
    modelName: useAzure ? kbModelName : embeddingModel,
  }
}

async function callEmbeddingAPI(inputs: string[], config: EmbeddingConfig): Promise<number[][]> {
  return retryWithExponentialBackoff(
    async () => {
      const requestBody = config.useAzure
        ? {
            input: inputs,
            encoding_format: 'float',
          }
        : {
            input: inputs,
            model: config.modelName,
            encoding_format: 'float',
          }

      const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new EmbeddingAPIError(
          `Embedding API failed: ${response.status} ${response.statusText} - ${errorText}`,
          response.status
        )
      }

      const data = await response.json()
      return data.data.map((item: any) => item.embedding)
    },
    {
      maxRetries: 3,
      initialDelayMs: 1000,
      maxDelayMs: 10000,
      retryCondition: (error: any) => {
        if (error instanceof EmbeddingAPIError) {
          return error.status === 429 || error.status >= 500
        }
        return isRetryableError(error)
      },
    }
  )
}

/**
 * Generate embeddings for multiple texts with token-aware batching
 * Uses tiktoken for token counting
 */
export async function generateEmbeddings(
  texts: string[],
  embeddingModel = 'text-embedding-3-small'
): Promise<number[][]> {
  const config = getEmbeddingConfig(embeddingModel)

  logger.info(
    `Using ${config.useAzure ? 'Azure OpenAI' : 'OpenAI'} for embeddings generation (${texts.length} texts)`
  )

  const batches = batchByTokenLimit(texts, MAX_TOKENS_PER_REQUEST, embeddingModel)

  logger.info(
    `Split ${texts.length} texts into ${batches.length} batches (max ${MAX_TOKENS_PER_REQUEST} tokens per batch)`
  )

  const allEmbeddings: number[][] = []

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    const batchTokenCount = getTotalTokenCount(batch, embeddingModel)

    logger.info(
      `Processing batch ${i + 1}/${batches.length}: ${batch.length} texts, ${batchTokenCount} tokens`
    )

    try {
      const batchEmbeddings = await callEmbeddingAPI(batch, config)
      allEmbeddings.push(...batchEmbeddings)

      logger.info(
        `Generated ${batchEmbeddings.length} embeddings for batch ${i + 1}/${batches.length}`
      )
    } catch (error) {
      logger.error(`Failed to generate embeddings for batch ${i + 1}:`, error)
      throw error
    }

    if (i + 1 < batches.length) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  logger.info(`Successfully generated ${allEmbeddings.length} embeddings total`)

  return allEmbeddings
}

/**
 * Generate embedding for a single search query
 */
export async function generateSearchEmbedding(
  query: string,
  embeddingModel = 'text-embedding-3-small'
): Promise<number[]> {
  const config = getEmbeddingConfig(embeddingModel)

  logger.info(
    `Using ${config.useAzure ? 'Azure OpenAI' : 'OpenAI'} for search embedding generation`
  )

  const embeddings = await callEmbeddingAPI([query], config)
  return embeddings[0]
}
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: sim-main/apps/sim/lib/knowledge/service.ts

```typescript
import { randomUUID } from 'crypto'
import { db } from '@sim/db'
import { document, knowledgeBase, permissions } from '@sim/db/schema'
import { and, count, eq, isNotNull, isNull, or } from 'drizzle-orm'
import type {
  ChunkingConfig,
  CreateKnowledgeBaseData,
  KnowledgeBaseWithCounts,
} from '@/lib/knowledge/types'
import { createLogger } from '@/lib/logs/console/logger'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('KnowledgeBaseService')

/**
 * Get knowledge bases that a user can access
 */
export async function getKnowledgeBases(
  userId: string,
  workspaceId?: string | null
): Promise<KnowledgeBaseWithCounts[]> {
  const knowledgeBasesWithCounts = await db
    .select({
      id: knowledgeBase.id,
      name: knowledgeBase.name,
      description: knowledgeBase.description,
      tokenCount: knowledgeBase.tokenCount,
      embeddingModel: knowledgeBase.embeddingModel,
      embeddingDimension: knowledgeBase.embeddingDimension,
      chunkingConfig: knowledgeBase.chunkingConfig,
      createdAt: knowledgeBase.createdAt,
      updatedAt: knowledgeBase.updatedAt,
      workspaceId: knowledgeBase.workspaceId,
      docCount: count(document.id),
    })
    .from(knowledgeBase)
    .leftJoin(
      document,
      and(eq(document.knowledgeBaseId, knowledgeBase.id), isNull(document.deletedAt))
    )
    .leftJoin(
      permissions,
      and(
        eq(permissions.entityType, 'workspace'),
        eq(permissions.entityId, knowledgeBase.workspaceId),
        eq(permissions.userId, userId)
      )
    )
    .where(
      and(
        isNull(knowledgeBase.deletedAt),
        workspaceId
          ? // When filtering by workspace
            or(
              // Knowledge bases belonging to the specified workspace (user must have workspace permissions)
              and(eq(knowledgeBase.workspaceId, workspaceId), isNotNull(permissions.userId)),
              // Fallback: User-owned knowledge bases without workspace (legacy)
              and(eq(knowledgeBase.userId, userId), isNull(knowledgeBase.workspaceId))
            )
          : // When not filtering by workspace, use original logic
            or(
              // User owns the knowledge base directly
              eq(knowledgeBase.userId, userId),
              // User has permissions on the knowledge base's workspace
              isNotNull(permissions.userId)
            )
      )
    )
    .groupBy(knowledgeBase.id)
    .orderBy(knowledgeBase.createdAt)

  return knowledgeBasesWithCounts.map((kb) => ({
    ...kb,
    chunkingConfig: kb.chunkingConfig as ChunkingConfig,
    docCount: Number(kb.docCount),
  }))
}

/**
 * Create a new knowledge base
 */
export async function createKnowledgeBase(
  data: CreateKnowledgeBaseData,
  requestId: string
): Promise<KnowledgeBaseWithCounts> {
  const kbId = randomUUID()
  const now = new Date()

  if (data.workspaceId) {
    const hasPermission = await getUserEntityPermissions(data.userId, 'workspace', data.workspaceId)
    if (hasPermission === null) {
      throw new Error('User does not have permission to create knowledge bases in this workspace')
    }
  }

  const newKnowledgeBase = {
    id: kbId,
    name: data.name,
    description: data.description ?? null,
    workspaceId: data.workspaceId ?? null,
    userId: data.userId,
    tokenCount: 0,
    embeddingModel: data.embeddingModel,
    embeddingDimension: data.embeddingDimension,
    chunkingConfig: data.chunkingConfig,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  }

  await db.insert(knowledgeBase).values(newKnowledgeBase)

  logger.info(`[${requestId}] Created knowledge base: ${data.name} (${kbId})`)

  return {
    id: kbId,
    name: data.name,
    description: data.description ?? null,
    tokenCount: 0,
    embeddingModel: data.embeddingModel,
    embeddingDimension: data.embeddingDimension,
    chunkingConfig: data.chunkingConfig,
    createdAt: now,
    updatedAt: now,
    workspaceId: data.workspaceId ?? null,
    docCount: 0,
  }
}

/**
 * Update a knowledge base
 */
export async function updateKnowledgeBase(
  knowledgeBaseId: string,
  updates: {
    name?: string
    description?: string
    workspaceId?: string | null
    chunkingConfig?: {
      maxSize: number
      minSize: number
      overlap: number
    }
  },
  requestId: string
): Promise<KnowledgeBaseWithCounts> {
  const now = new Date()
  const updateData: {
    updatedAt: Date
    name?: string
    description?: string | null
    workspaceId?: string | null
    chunkingConfig?: {
      maxSize: number
      minSize: number
      overlap: number
    }
    embeddingModel?: string
    embeddingDimension?: number
  } = {
    updatedAt: now,
  }

  if (updates.name !== undefined) updateData.name = updates.name
  if (updates.description !== undefined) updateData.description = updates.description
  if (updates.workspaceId !== undefined) updateData.workspaceId = updates.workspaceId
  if (updates.chunkingConfig !== undefined) {
    updateData.chunkingConfig = updates.chunkingConfig
    updateData.embeddingModel = 'text-embedding-3-small'
    updateData.embeddingDimension = 1536
  }

  await db.update(knowledgeBase).set(updateData).where(eq(knowledgeBase.id, knowledgeBaseId))

  const updatedKb = await db
    .select({
      id: knowledgeBase.id,
      name: knowledgeBase.name,
      description: knowledgeBase.description,
      tokenCount: knowledgeBase.tokenCount,
      embeddingModel: knowledgeBase.embeddingModel,
      embeddingDimension: knowledgeBase.embeddingDimension,
      chunkingConfig: knowledgeBase.chunkingConfig,
      createdAt: knowledgeBase.createdAt,
      updatedAt: knowledgeBase.updatedAt,
      workspaceId: knowledgeBase.workspaceId,
      docCount: count(document.id),
    })
    .from(knowledgeBase)
    .leftJoin(
      document,
      and(eq(document.knowledgeBaseId, knowledgeBase.id), isNull(document.deletedAt))
    )
    .where(eq(knowledgeBase.id, knowledgeBaseId))
    .groupBy(knowledgeBase.id)
    .limit(1)

  if (updatedKb.length === 0) {
    throw new Error(`Knowledge base ${knowledgeBaseId} not found`)
  }

  logger.info(`[${requestId}] Updated knowledge base: ${knowledgeBaseId}`)

  return {
    ...updatedKb[0],
    chunkingConfig: updatedKb[0].chunkingConfig as ChunkingConfig,
    docCount: Number(updatedKb[0].docCount),
  }
}

/**
 * Get a single knowledge base by ID
 */
export async function getKnowledgeBaseById(
  knowledgeBaseId: string
): Promise<KnowledgeBaseWithCounts | null> {
  const result = await db
    .select({
      id: knowledgeBase.id,
      name: knowledgeBase.name,
      description: knowledgeBase.description,
      tokenCount: knowledgeBase.tokenCount,
      embeddingModel: knowledgeBase.embeddingModel,
      embeddingDimension: knowledgeBase.embeddingDimension,
      chunkingConfig: knowledgeBase.chunkingConfig,
      createdAt: knowledgeBase.createdAt,
      updatedAt: knowledgeBase.updatedAt,
      workspaceId: knowledgeBase.workspaceId,
      docCount: count(document.id),
    })
    .from(knowledgeBase)
    .leftJoin(
      document,
      and(eq(document.knowledgeBaseId, knowledgeBase.id), isNull(document.deletedAt))
    )
    .where(and(eq(knowledgeBase.id, knowledgeBaseId), isNull(knowledgeBase.deletedAt)))
    .groupBy(knowledgeBase.id)
    .limit(1)

  if (result.length === 0) {
    return null
  }

  return {
    ...result[0],
    chunkingConfig: result[0].chunkingConfig as ChunkingConfig,
    docCount: Number(result[0].docCount),
  }
}

/**
 * Delete a knowledge base (soft delete)
 */
export async function deleteKnowledgeBase(
  knowledgeBaseId: string,
  requestId: string
): Promise<void> {
  const now = new Date()

  await db
    .update(knowledgeBase)
    .set({
      deletedAt: now,
      updatedAt: now,
    })
    .where(eq(knowledgeBase.id, knowledgeBaseId))

  logger.info(`[${requestId}] Soft deleted knowledge base: ${knowledgeBaseId}`)
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/lib/knowledge/types.ts

```typescript
export interface ChunkingConfig {
  maxSize: number
  minSize: number
  overlap: number
}

export interface KnowledgeBaseWithCounts {
  id: string
  name: string
  description: string | null
  tokenCount: number
  embeddingModel: string
  embeddingDimension: number
  chunkingConfig: ChunkingConfig
  createdAt: Date
  updatedAt: Date
  workspaceId: string | null
  docCount: number
}

export interface CreateKnowledgeBaseData {
  name: string
  description?: string
  workspaceId?: string
  embeddingModel: 'text-embedding-3-small'
  embeddingDimension: 1536
  chunkingConfig: ChunkingConfig
  userId: string
}

export interface TagDefinition {
  id: string
  tagSlot: string
  displayName: string
  fieldType: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateTagDefinitionData {
  knowledgeBaseId: string
  tagSlot: string
  displayName: string
  fieldType: string
}

export interface UpdateTagDefinitionData {
  displayName?: string
  fieldType?: string
}
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: sim-main/apps/sim/lib/knowledge/chunks/service.ts

```typescript
import { createHash, randomUUID } from 'crypto'
import { db } from '@sim/db'
import { document, embedding } from '@sim/db/schema'
import { and, asc, eq, ilike, inArray, sql } from 'drizzle-orm'
import type {
  BatchOperationResult,
  ChunkData,
  ChunkFilters,
  ChunkQueryResult,
  CreateChunkData,
} from '@/lib/knowledge/chunks/types'
import { generateEmbeddings } from '@/lib/knowledge/embeddings'
import { createLogger } from '@/lib/logs/console/logger'
import { estimateTokenCount } from '@/lib/tokenization/estimators'

const logger = createLogger('ChunksService')

/**
 * Query chunks for a document with filtering and pagination
 */
export async function queryChunks(
  documentId: string,
  filters: ChunkFilters,
  requestId: string
): Promise<ChunkQueryResult> {
  const { search, enabled = 'all', limit = 50, offset = 0 } = filters

  // Build query conditions
  const conditions = [eq(embedding.documentId, documentId)]

  // Add enabled filter
  if (enabled === 'true') {
    conditions.push(eq(embedding.enabled, true))
  } else if (enabled === 'false') {
    conditions.push(eq(embedding.enabled, false))
  }

  // Add search filter
  if (search) {
    conditions.push(ilike(embedding.content, `%${search}%`))
  }

  // Fetch chunks
  const chunks = await db
    .select({
      id: embedding.id,
      chunkIndex: embedding.chunkIndex,
      content: embedding.content,
      contentLength: embedding.contentLength,
      tokenCount: embedding.tokenCount,
      enabled: embedding.enabled,
      startOffset: embedding.startOffset,
      endOffset: embedding.endOffset,
      tag1: embedding.tag1,
      tag2: embedding.tag2,
      tag3: embedding.tag3,
      tag4: embedding.tag4,
      tag5: embedding.tag5,
      tag6: embedding.tag6,
      tag7: embedding.tag7,
      createdAt: embedding.createdAt,
      updatedAt: embedding.updatedAt,
    })
    .from(embedding)
    .where(and(...conditions))
    .orderBy(asc(embedding.chunkIndex))
    .limit(limit)
    .offset(offset)

  // Get total count for pagination
  const totalCount = await db
    .select({ count: sql`count(*)` })
    .from(embedding)
    .where(and(...conditions))

  logger.info(`[${requestId}] Retrieved ${chunks.length} chunks for document ${documentId}`)

  return {
    chunks: chunks as ChunkData[],
    pagination: {
      total: Number(totalCount[0]?.count || 0),
      limit,
      offset,
      hasMore: chunks.length === limit,
    },
  }
}

/**
 * Create a new chunk for a document
 */
export async function createChunk(
  knowledgeBaseId: string,
  documentId: string,
  docTags: Record<string, string | null>,
  chunkData: CreateChunkData,
  requestId: string
): Promise<ChunkData> {
  // Generate embedding for the content first (outside transaction for performance)
  logger.info(`[${requestId}] Generating embedding for manual chunk`)
  const embeddings = await generateEmbeddings([chunkData.content])

  // Calculate accurate token count
  const tokenCount = estimateTokenCount(chunkData.content, 'openai')

  const chunkId = randomUUID()
  const now = new Date()

  // Use transaction to atomically get next index and insert chunk
  const newChunk = await db.transaction(async (tx) => {
    // Get the next chunk index atomically within the transaction
    const lastChunk = await tx
      .select({ chunkIndex: embedding.chunkIndex })
      .from(embedding)
      .where(eq(embedding.documentId, documentId))
      .orderBy(sql`${embedding.chunkIndex} DESC`)
      .limit(1)

    const nextChunkIndex = lastChunk.length > 0 ? lastChunk[0].chunkIndex + 1 : 0

    const chunkDBData = {
      id: chunkId,
      knowledgeBaseId,
      documentId,
      chunkIndex: nextChunkIndex,
      chunkHash: createHash('sha256').update(chunkData.content).digest('hex'),
      content: chunkData.content,
      contentLength: chunkData.content.length,
      tokenCount: tokenCount.count,
      embedding: embeddings[0],
      embeddingModel: 'text-embedding-3-small',
      startOffset: 0, // Manual chunks don't have document offsets
      endOffset: chunkData.content.length,
      // Inherit tags from parent document
      tag1: docTags.tag1,
      tag2: docTags.tag2,
      tag3: docTags.tag3,
      tag4: docTags.tag4,
      tag5: docTags.tag5,
      tag6: docTags.tag6,
      tag7: docTags.tag7,
      enabled: chunkData.enabled ?? true,
      createdAt: now,
      updatedAt: now,
    }

    await tx.insert(embedding).values(chunkDBData)

    // Update document statistics
    await tx
      .update(document)
      .set({
        chunkCount: sql`${document.chunkCount} + 1`,
        tokenCount: sql`${document.tokenCount} + ${tokenCount.count}`,
        characterCount: sql`${document.characterCount} + ${chunkData.content.length}`,
      })
      .where(eq(document.id, documentId))

    return {
      id: chunkId,
      chunkIndex: nextChunkIndex,
      content: chunkData.content,
      contentLength: chunkData.content.length,
      tokenCount: tokenCount.count,
      enabled: chunkData.enabled ?? true,
      startOffset: 0,
      endOffset: chunkData.content.length,
      tag1: docTags.tag1,
      tag2: docTags.tag2,
      tag3: docTags.tag3,
      tag4: docTags.tag4,
      tag5: docTags.tag5,
      tag6: docTags.tag6,
      tag7: docTags.tag7,
      createdAt: now,
      updatedAt: now,
    } as ChunkData
  })

  logger.info(`[${requestId}] Created chunk ${chunkId} in document ${documentId}`)

  return newChunk
}

/**
 * Perform batch operations on chunks
 */
export async function batchChunkOperation(
  documentId: string,
  operation: 'enable' | 'disable' | 'delete',
  chunkIds: string[],
  requestId: string
): Promise<BatchOperationResult> {
  logger.info(
    `[${requestId}] Starting batch ${operation} operation on ${chunkIds.length} chunks for document ${documentId}`
  )

  const errors: string[] = []
  let successCount = 0

  if (operation === 'delete') {
    // Handle batch delete with transaction for consistency
    await db.transaction(async (tx) => {
      // Get chunks to delete for statistics update
      const chunksToDelete = await tx
        .select({
          id: embedding.id,
          tokenCount: embedding.tokenCount,
          contentLength: embedding.contentLength,
        })
        .from(embedding)
        .where(and(eq(embedding.documentId, documentId), inArray(embedding.id, chunkIds)))

      if (chunksToDelete.length === 0) {
        errors.push('No matching chunks found to delete')
        return
      }

      const totalTokensToRemove = chunksToDelete.reduce((sum, chunk) => sum + chunk.tokenCount, 0)
      const totalCharsToRemove = chunksToDelete.reduce((sum, chunk) => sum + chunk.contentLength, 0)

      // Delete chunks
      const deleteResult = await tx
        .delete(embedding)
        .where(and(eq(embedding.documentId, documentId), inArray(embedding.id, chunkIds)))

      // Update document statistics
      await tx
        .update(document)
        .set({
          chunkCount: sql`${document.chunkCount} - ${chunksToDelete.length}`,
          tokenCount: sql`${document.tokenCount} - ${totalTokensToRemove}`,
          characterCount: sql`${document.characterCount} - ${totalCharsToRemove}`,
        })
        .where(eq(document.id, documentId))

      successCount = chunksToDelete.length
    })
  } else {
    // Handle enable/disable operations
    const enabled = operation === 'enable'

    await db
      .update(embedding)
      .set({
        enabled,
        updatedAt: new Date(),
      })
      .where(and(eq(embedding.documentId, documentId), inArray(embedding.id, chunkIds)))

    // For enable/disable, we assume all chunks were processed successfully
    successCount = chunkIds.length
  }

  logger.info(
    `[${requestId}] Batch ${operation} completed: ${successCount} chunks processed, ${errors.length} errors`
  )

  return {
    success: errors.length === 0,
    processed: successCount,
    errors,
  }
}

/**
 * Update a single chunk
 */
export async function updateChunk(
  chunkId: string,
  updateData: {
    content?: string
    enabled?: boolean
  },
  requestId: string
): Promise<ChunkData> {
  const dbUpdateData: {
    updatedAt: Date
    content?: string
    contentLength?: number
    tokenCount?: number
    chunkHash?: string
    embedding?: number[]
    enabled?: boolean
  } = {
    updatedAt: new Date(),
  }

  // Use transaction if content is being updated to ensure consistent document statistics
  if (updateData.content !== undefined && typeof updateData.content === 'string') {
    return await db.transaction(async (tx) => {
      // Get current chunk data for character count calculation and content comparison
      const currentChunk = await tx
        .select({
          documentId: embedding.documentId,
          content: embedding.content,
          contentLength: embedding.contentLength,
          tokenCount: embedding.tokenCount,
        })
        .from(embedding)
        .where(eq(embedding.id, chunkId))
        .limit(1)

      if (currentChunk.length === 0) {
        throw new Error(`Chunk ${chunkId} not found`)
      }

      const oldContentLength = currentChunk[0].contentLength
      const oldTokenCount = currentChunk[0].tokenCount
      const content = updateData.content! // We know it's defined from the if check above
      const newContentLength = content.length

      // Only regenerate embedding if content actually changed
      if (content !== currentChunk[0].content) {
        logger.info(`[${requestId}] Content changed, regenerating embedding for chunk ${chunkId}`)

        // Generate new embedding for the updated content
        const embeddings = await generateEmbeddings([content])

        // Calculate accurate token count
        const tokenCount = estimateTokenCount(content, 'openai')

        dbUpdateData.content = content
        dbUpdateData.contentLength = newContentLength
        dbUpdateData.tokenCount = tokenCount.count
        dbUpdateData.chunkHash = createHash('sha256').update(content).digest('hex')
        // Add the embedding field to the update data
        dbUpdateData.embedding = embeddings[0]
      } else {
        // Content hasn't changed, just update other fields if needed
        dbUpdateData.content = content
        dbUpdateData.contentLength = newContentLength
        dbUpdateData.tokenCount = oldTokenCount // Keep the same token count if content is identical
        dbUpdateData.chunkHash = createHash('sha256').update(content).digest('hex')
      }

      if (updateData.enabled !== undefined) {
        dbUpdateData.enabled = updateData.enabled
      }

      // Update the chunk
      await tx.update(embedding).set(dbUpdateData).where(eq(embedding.id, chunkId))

      // Update document statistics for the character and token count changes
      const charDiff = newContentLength - oldContentLength
      const tokenDiff = dbUpdateData.tokenCount! - oldTokenCount

      await tx
        .update(document)
        .set({
          characterCount: sql`${document.characterCount} + ${charDiff}`,
          tokenCount: sql`${document.tokenCount} + ${tokenDiff}`,
        })
        .where(eq(document.id, currentChunk[0].documentId))

      // Fetch and return the updated chunk
      const updatedChunk = await tx
        .select({
          id: embedding.id,
          chunkIndex: embedding.chunkIndex,
          content: embedding.content,
          contentLength: embedding.contentLength,
          tokenCount: embedding.tokenCount,
          enabled: embedding.enabled,
          startOffset: embedding.startOffset,
          endOffset: embedding.endOffset,
          tag1: embedding.tag1,
          tag2: embedding.tag2,
          tag3: embedding.tag3,
          tag4: embedding.tag4,
          tag5: embedding.tag5,
          tag6: embedding.tag6,
          tag7: embedding.tag7,
          createdAt: embedding.createdAt,
          updatedAt: embedding.updatedAt,
        })
        .from(embedding)
        .where(eq(embedding.id, chunkId))
        .limit(1)

      logger.info(
        `[${requestId}] Updated chunk: ${chunkId}${updateData.content !== currentChunk[0].content ? ' (regenerated embedding)' : ''}`
      )

      return updatedChunk[0] as ChunkData
    })
  }

  // If only enabled status is being updated, no need for transaction
  if (updateData.enabled !== undefined) {
    dbUpdateData.enabled = updateData.enabled
  }

  await db.update(embedding).set(dbUpdateData).where(eq(embedding.id, chunkId))

  // Fetch the updated chunk
  const updatedChunk = await db
    .select({
      id: embedding.id,
      chunkIndex: embedding.chunkIndex,
      content: embedding.content,
      contentLength: embedding.contentLength,
      tokenCount: embedding.tokenCount,
      enabled: embedding.enabled,
      startOffset: embedding.startOffset,
      endOffset: embedding.endOffset,
      tag1: embedding.tag1,
      tag2: embedding.tag2,
      tag3: embedding.tag3,
      tag4: embedding.tag4,
      tag5: embedding.tag5,
      tag6: embedding.tag6,
      tag7: embedding.tag7,
      createdAt: embedding.createdAt,
      updatedAt: embedding.updatedAt,
    })
    .from(embedding)
    .where(eq(embedding.id, chunkId))
    .limit(1)

  if (updatedChunk.length === 0) {
    throw new Error(`Chunk ${chunkId} not found`)
  }

  logger.info(`[${requestId}] Updated chunk: ${chunkId}`)

  return updatedChunk[0] as ChunkData
}

/**
 * Delete a single chunk with document statistics updates
 */
export async function deleteChunk(
  chunkId: string,
  documentId: string,
  requestId: string
): Promise<void> {
  await db.transaction(async (tx) => {
    // Get chunk data before deletion for statistics update
    const chunkToDelete = await tx
      .select({
        tokenCount: embedding.tokenCount,
        contentLength: embedding.contentLength,
      })
      .from(embedding)
      .where(eq(embedding.id, chunkId))
      .limit(1)

    if (chunkToDelete.length === 0) {
      throw new Error('Chunk not found')
    }

    const chunk = chunkToDelete[0]

    // Delete the chunk
    await tx.delete(embedding).where(eq(embedding.id, chunkId))

    // Update document statistics
    await tx
      .update(document)
      .set({
        chunkCount: sql`${document.chunkCount} - 1`,
        tokenCount: sql`${document.tokenCount} - ${chunk.tokenCount}`,
        characterCount: sql`${document.characterCount} - ${chunk.contentLength}`,
      })
      .where(eq(document.id, documentId))
  })

  logger.info(`[${requestId}] Deleted chunk: ${chunkId}`)
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/lib/knowledge/chunks/types.ts

```typescript
export interface ChunkFilters {
  search?: string
  enabled?: 'true' | 'false' | 'all'
  limit?: number
  offset?: number
}

export interface ChunkData {
  id: string
  chunkIndex: number
  content: string
  contentLength: number
  tokenCount: number
  enabled: boolean
  startOffset: number
  endOffset: number
  tag1?: string | null
  tag2?: string | null
  tag3?: string | null
  tag4?: string | null
  tag5?: string | null
  tag6?: string | null
  tag7?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ChunkQueryResult {
  chunks: ChunkData[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

export interface CreateChunkData {
  content: string
  enabled?: boolean
}

export interface BatchOperationResult {
  success: boolean
  processed: number
  errors: string[]
}
```

--------------------------------------------------------------------------------

````
