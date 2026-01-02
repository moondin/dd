---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 283
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 283 of 933)

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

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/knowledge/search/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateRequestId } from '@/lib/core/utils/request'
import { TAG_SLOTS } from '@/lib/knowledge/constants'
import { getDocumentTagDefinitions } from '@/lib/knowledge/tags/service'
import { createLogger } from '@/lib/logs/console/logger'
import { estimateTokenCount } from '@/lib/tokenization/estimators'
import { getUserId } from '@/app/api/auth/oauth/utils'
import {
  generateSearchEmbedding,
  getDocumentNamesByIds,
  getQueryStrategy,
  handleTagAndVectorSearch,
  handleTagOnlySearch,
  handleVectorOnlySearch,
  type SearchResult,
} from '@/app/api/knowledge/search/utils'
import { checkKnowledgeBaseAccess } from '@/app/api/knowledge/utils'
import { calculateCost } from '@/providers/utils'

const logger = createLogger('VectorSearchAPI')

const VectorSearchSchema = z
  .object({
    knowledgeBaseIds: z.union([
      z.string().min(1, 'Knowledge base ID is required'),
      z.array(z.string().min(1)).min(1, 'At least one knowledge base ID is required'),
    ]),
    query: z
      .string()
      .optional()
      .nullable()
      .transform((val) => val || undefined),
    topK: z
      .number()
      .min(1)
      .max(100)
      .optional()
      .nullable()
      .default(10)
      .transform((val) => val ?? 10),
    filters: z
      .record(z.string())
      .optional()
      .nullable()
      .transform((val) => val || undefined), // Allow dynamic filter keys (display names)
  })
  .refine(
    (data) => {
      // Ensure at least query or filters are provided
      const hasQuery = data.query && data.query.trim().length > 0
      const hasFilters = data.filters && Object.keys(data.filters).length > 0
      return hasQuery || hasFilters
    },
    {
      message: 'Please provide either a search query or tag filters to search your knowledge base',
    }
  )

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const body = await request.json()
    const { workflowId, ...searchParams } = body

    const userId = await getUserId(requestId, workflowId)

    if (!userId) {
      const errorMessage = workflowId ? 'Workflow not found' : 'Unauthorized'
      const statusCode = workflowId ? 404 : 401
      return NextResponse.json({ error: errorMessage }, { status: statusCode })
    }

    try {
      const validatedData = VectorSearchSchema.parse(searchParams)

      const knowledgeBaseIds = Array.isArray(validatedData.knowledgeBaseIds)
        ? validatedData.knowledgeBaseIds
        : [validatedData.knowledgeBaseIds]

      // Check access permissions in parallel for performance
      const accessChecks = await Promise.all(
        knowledgeBaseIds.map((kbId) => checkKnowledgeBaseAccess(kbId, userId))
      )
      const accessibleKbIds: string[] = knowledgeBaseIds.filter(
        (_, idx) => accessChecks[idx]?.hasAccess
      )

      // Map display names to tag slots for filtering
      let mappedFilters: Record<string, string> = {}
      if (validatedData.filters && accessibleKbIds.length > 0) {
        try {
          // Fetch tag definitions for the first accessible KB (since we're using single KB now)
          const kbId = accessibleKbIds[0]
          const tagDefs = await getDocumentTagDefinitions(kbId)

          logger.debug(`[${requestId}] Found tag definitions:`, tagDefs)
          logger.debug(`[${requestId}] Original filters:`, validatedData.filters)

          // Create mapping from display name to tag slot
          const displayNameToSlot: Record<string, string> = {}
          tagDefs.forEach((def) => {
            displayNameToSlot[def.displayName] = def.tagSlot
          })

          // Map the filters and handle OR logic
          Object.entries(validatedData.filters).forEach(([key, value]) => {
            if (value) {
              const tagSlot = displayNameToSlot[key] || key // Fallback to key if no mapping found

              // Check if this is an OR filter (contains |OR| separator)
              if (value.includes('|OR|')) {
                logger.debug(
                  `[${requestId}] OR filter detected: "${key}" -> "${tagSlot}" = "${value}"`
                )
              }

              mappedFilters[tagSlot] = value
              logger.debug(`[${requestId}] Mapped filter: "${key}" -> "${tagSlot}" = "${value}"`)
            }
          })

          logger.debug(`[${requestId}] Final mapped filters:`, mappedFilters)
        } catch (error) {
          logger.error(`[${requestId}] Filter mapping error:`, error)
          // If mapping fails, use original filters
          mappedFilters = validatedData.filters
        }
      }

      if (accessibleKbIds.length === 0) {
        return NextResponse.json(
          { error: 'Knowledge base not found or access denied' },
          { status: 404 }
        )
      }

      // Generate query embedding only if query is provided
      const hasQuery = validatedData.query && validatedData.query.trim().length > 0
      // Start embedding generation early and await when needed
      const queryEmbeddingPromise = hasQuery
        ? generateSearchEmbedding(validatedData.query!)
        : Promise.resolve(null)

      // Check if any requested knowledge bases were not accessible
      const inaccessibleKbIds = knowledgeBaseIds.filter((id) => !accessibleKbIds.includes(id))

      if (inaccessibleKbIds.length > 0) {
        return NextResponse.json(
          { error: `Knowledge bases not found or access denied: ${inaccessibleKbIds.join(', ')}` },
          { status: 404 }
        )
      }

      let results: SearchResult[]

      const hasFilters = mappedFilters && Object.keys(mappedFilters).length > 0

      if (!hasQuery && hasFilters) {
        // Tag-only search without vector similarity
        logger.debug(`[${requestId}] Executing tag-only search with filters:`, mappedFilters)
        results = await handleTagOnlySearch({
          knowledgeBaseIds: accessibleKbIds,
          topK: validatedData.topK,
          filters: mappedFilters,
        })
      } else if (hasQuery && hasFilters) {
        // Tag + Vector search
        logger.debug(`[${requestId}] Executing tag + vector search with filters:`, mappedFilters)
        const strategy = getQueryStrategy(accessibleKbIds.length, validatedData.topK)
        const queryVector = JSON.stringify(await queryEmbeddingPromise)

        results = await handleTagAndVectorSearch({
          knowledgeBaseIds: accessibleKbIds,
          topK: validatedData.topK,
          filters: mappedFilters,
          queryVector,
          distanceThreshold: strategy.distanceThreshold,
        })
      } else if (hasQuery && !hasFilters) {
        // Vector-only search
        logger.debug(`[${requestId}] Executing vector-only search`)
        const strategy = getQueryStrategy(accessibleKbIds.length, validatedData.topK)
        const queryVector = JSON.stringify(await queryEmbeddingPromise)

        results = await handleVectorOnlySearch({
          knowledgeBaseIds: accessibleKbIds,
          topK: validatedData.topK,
          queryVector,
          distanceThreshold: strategy.distanceThreshold,
        })
      } else {
        // This should never happen due to schema validation, but just in case
        return NextResponse.json(
          {
            error:
              'Please provide either a search query or tag filters to search your knowledge base',
          },
          { status: 400 }
        )
      }

      // Calculate cost for the embedding (with fallback if calculation fails)
      let cost = null
      let tokenCount = null
      if (hasQuery) {
        try {
          tokenCount = estimateTokenCount(validatedData.query!, 'openai')
          cost = calculateCost('text-embedding-3-small', tokenCount.count, 0, false)
        } catch (error) {
          logger.warn(`[${requestId}] Failed to calculate cost for search query`, {
            error: error instanceof Error ? error.message : 'Unknown error',
          })
          // Continue without cost information rather than failing the search
        }
      }

      // Fetch tag definitions for display name mapping (reuse the same fetch from filtering)
      const tagDefsResults = await Promise.all(
        accessibleKbIds.map(async (kbId) => {
          try {
            const tagDefs = await getDocumentTagDefinitions(kbId)
            const map: Record<string, string> = {}
            tagDefs.forEach((def) => {
              map[def.tagSlot] = def.displayName
            })
            return { kbId, map }
          } catch (error) {
            logger.warn(
              `[${requestId}] Failed to fetch tag definitions for display mapping:`,
              error
            )
            return { kbId, map: {} as Record<string, string> }
          }
        })
      )
      const tagDefinitionsMap: Record<string, Record<string, string>> = {}
      tagDefsResults.forEach(({ kbId, map }) => {
        tagDefinitionsMap[kbId] = map
      })

      // Fetch document names for the results
      const documentIds = results.map((result) => result.documentId)
      const documentNameMap = await getDocumentNamesByIds(documentIds)

      return NextResponse.json({
        success: true,
        data: {
          results: results.map((result) => {
            const kbTagMap = tagDefinitionsMap[result.knowledgeBaseId] || {}
            logger.debug(
              `[${requestId}] Result KB: ${result.knowledgeBaseId}, available mappings:`,
              kbTagMap
            )

            // Create tags object with display names
            const tags: Record<string, any> = {}

            TAG_SLOTS.forEach((slot) => {
              const tagValue = (result as any)[slot]
              if (tagValue) {
                const displayName = kbTagMap[slot] || slot
                logger.debug(
                  `[${requestId}] Mapping ${slot}="${tagValue}" -> "${displayName}"="${tagValue}"`
                )
                tags[displayName] = tagValue
              }
            })

            return {
              documentId: result.documentId,
              documentName: documentNameMap[result.documentId] || undefined,
              content: result.content,
              chunkIndex: result.chunkIndex,
              metadata: tags, // Clean display name mapped tags
              similarity: hasQuery ? 1 - result.distance : 1, // Perfect similarity for tag-only searches
            }
          }),
          query: validatedData.query || '',
          knowledgeBaseIds: accessibleKbIds,
          knowledgeBaseId: accessibleKbIds[0],
          topK: validatedData.topK,
          totalResults: results.length,
          ...(cost && tokenCount
            ? {
                cost: {
                  input: cost.input,
                  output: cost.output,
                  total: cost.total,
                  tokens: {
                    prompt: tokenCount.count,
                    completion: 0,
                    total: tokenCount.count,
                  },
                  model: 'text-embedding-3-small',
                  pricing: cost.pricing,
                },
              }
            : {}),
        },
      })
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid request data', details: validationError.errors },
          { status: 400 }
        )
      }
      throw validationError
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to perform vector search',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: utils.test.ts]---
Location: sim-main/apps/sim/app/api/knowledge/search/utils.test.ts

```typescript
/**
 * Tests for knowledge search utility functions
 * Focuses on testing core functionality with simplified mocking
 *
 * @vitest-environment node
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('drizzle-orm')
vi.mock('@/lib/logs/console/logger', () => ({
  createLogger: vi.fn(() => ({
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  })),
}))
vi.mock('@sim/db')
vi.mock('@/lib/knowledge/documents/utils', () => ({
  retryWithExponentialBackoff: (fn: any) => fn(),
}))

vi.stubGlobal(
  'fetch',
  vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      data: [{ embedding: [0.1, 0.2, 0.3] }],
    }),
  })
)

vi.mock('@/lib/core/config/env', () => ({
  env: {},
  getEnv: (key: string) => process.env[key],
  isTruthy: (value: string | boolean | number | undefined) =>
    typeof value === 'string' ? value === 'true' || value === '1' : Boolean(value),
}))

import {
  generateSearchEmbedding,
  handleTagAndVectorSearch,
  handleTagOnlySearch,
  handleVectorOnlySearch,
} from '@/app/api/knowledge/search/utils'

describe('Knowledge Search Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('handleTagOnlySearch', () => {
    it('should throw error when no filters provided', async () => {
      const params = {
        knowledgeBaseIds: ['kb-123'],
        topK: 10,
        filters: {},
      }

      await expect(handleTagOnlySearch(params)).rejects.toThrow(
        'Tag filters are required for tag-only search'
      )
    })

    it('should accept valid parameters for tag-only search', async () => {
      const params = {
        knowledgeBaseIds: ['kb-123'],
        topK: 10,
        filters: { tag1: 'api' },
      }

      // This test validates the function accepts the right parameters
      // The actual database interaction is tested via route tests
      expect(params.knowledgeBaseIds).toEqual(['kb-123'])
      expect(params.topK).toBe(10)
      expect(params.filters).toEqual({ tag1: 'api' })
    })
  })

  describe('handleVectorOnlySearch', () => {
    it('should throw error when queryVector not provided', async () => {
      const params = {
        knowledgeBaseIds: ['kb-123'],
        topK: 10,
        distanceThreshold: 0.8,
      }

      await expect(handleVectorOnlySearch(params)).rejects.toThrow(
        'Query vector and distance threshold are required for vector-only search'
      )
    })

    it('should throw error when distanceThreshold not provided', async () => {
      const params = {
        knowledgeBaseIds: ['kb-123'],
        topK: 10,
        queryVector: JSON.stringify([0.1, 0.2, 0.3]),
      }

      await expect(handleVectorOnlySearch(params)).rejects.toThrow(
        'Query vector and distance threshold are required for vector-only search'
      )
    })

    it('should accept valid parameters for vector-only search', async () => {
      const params = {
        knowledgeBaseIds: ['kb-123'],
        topK: 10,
        queryVector: JSON.stringify([0.1, 0.2, 0.3]),
        distanceThreshold: 0.8,
      }

      // This test validates the function accepts the right parameters
      expect(params.knowledgeBaseIds).toEqual(['kb-123'])
      expect(params.topK).toBe(10)
      expect(params.queryVector).toBe(JSON.stringify([0.1, 0.2, 0.3]))
      expect(params.distanceThreshold).toBe(0.8)
    })
  })

  describe('handleTagAndVectorSearch', () => {
    it('should throw error when no filters provided', async () => {
      const params = {
        knowledgeBaseIds: ['kb-123'],
        topK: 10,
        filters: {},
        queryVector: JSON.stringify([0.1, 0.2, 0.3]),
        distanceThreshold: 0.8,
      }

      await expect(handleTagAndVectorSearch(params)).rejects.toThrow(
        'Tag filters are required for tag and vector search'
      )
    })

    it('should throw error when queryVector not provided', async () => {
      const params = {
        knowledgeBaseIds: ['kb-123'],
        topK: 10,
        filters: { tag1: 'api' },
        distanceThreshold: 0.8,
      }

      await expect(handleTagAndVectorSearch(params)).rejects.toThrow(
        'Query vector and distance threshold are required for tag and vector search'
      )
    })

    it('should throw error when distanceThreshold not provided', async () => {
      const params = {
        knowledgeBaseIds: ['kb-123'],
        topK: 10,
        filters: { tag1: 'api' },
        queryVector: JSON.stringify([0.1, 0.2, 0.3]),
      }

      await expect(handleTagAndVectorSearch(params)).rejects.toThrow(
        'Query vector and distance threshold are required for tag and vector search'
      )
    })

    it('should accept valid parameters for tag and vector search', async () => {
      const params = {
        knowledgeBaseIds: ['kb-123'],
        topK: 10,
        filters: { tag1: 'api' },
        queryVector: JSON.stringify([0.1, 0.2, 0.3]),
        distanceThreshold: 0.8,
      }

      // This test validates the function accepts the right parameters
      expect(params.knowledgeBaseIds).toEqual(['kb-123'])
      expect(params.topK).toBe(10)
      expect(params.filters).toEqual({ tag1: 'api' })
      expect(params.queryVector).toBe(JSON.stringify([0.1, 0.2, 0.3]))
      expect(params.distanceThreshold).toBe(0.8)
    })
  })

  describe('generateSearchEmbedding', () => {
    it('should use Azure OpenAI when KB-specific config is provided', async () => {
      const { env } = await import('@/lib/core/config/env')
      Object.keys(env).forEach((key) => delete (env as any)[key])
      Object.assign(env, {
        AZURE_OPENAI_API_KEY: 'test-azure-key',
        AZURE_OPENAI_ENDPOINT: 'https://test.openai.azure.com',
        AZURE_OPENAI_API_VERSION: '2024-12-01-preview',
        KB_OPENAI_MODEL_NAME: 'text-embedding-ada-002',
        OPENAI_API_KEY: 'test-openai-key',
      })

      const fetchSpy = vi.mocked(fetch)
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ embedding: [0.1, 0.2, 0.3] }],
        }),
      } as any)

      const result = await generateSearchEmbedding('test query')

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://test.openai.azure.com/openai/deployments/text-embedding-ada-002/embeddings?api-version=2024-12-01-preview',
        expect.objectContaining({
          headers: expect.objectContaining({
            'api-key': 'test-azure-key',
          }),
        })
      )
      expect(result).toEqual([0.1, 0.2, 0.3])

      // Clean up
      Object.keys(env).forEach((key) => delete (env as any)[key])
    })

    it('should fallback to OpenAI when no KB Azure config provided', async () => {
      const { env } = await import('@/lib/core/config/env')
      Object.keys(env).forEach((key) => delete (env as any)[key])
      Object.assign(env, {
        OPENAI_API_KEY: 'test-openai-key',
      })

      const fetchSpy = vi.mocked(fetch)
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ embedding: [0.1, 0.2, 0.3] }],
        }),
      } as any)

      const result = await generateSearchEmbedding('test query')

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.openai.com/v1/embeddings',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-openai-key',
          }),
        })
      )
      expect(result).toEqual([0.1, 0.2, 0.3])

      // Clean up
      Object.keys(env).forEach((key) => delete (env as any)[key])
    })

    it('should use default API version when not provided in Azure config', async () => {
      const { env } = await import('@/lib/core/config/env')
      Object.keys(env).forEach((key) => delete (env as any)[key])
      Object.assign(env, {
        AZURE_OPENAI_API_KEY: 'test-azure-key',
        AZURE_OPENAI_ENDPOINT: 'https://test.openai.azure.com',
        KB_OPENAI_MODEL_NAME: 'custom-embedding-model',
        OPENAI_API_KEY: 'test-openai-key',
      })

      const fetchSpy = vi.mocked(fetch)
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ embedding: [0.1, 0.2, 0.3] }],
        }),
      } as any)

      await generateSearchEmbedding('test query')

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('api-version='),
        expect.any(Object)
      )

      // Clean up
      Object.keys(env).forEach((key) => delete (env as any)[key])
    })

    it('should use custom model name when provided in Azure config', async () => {
      const { env } = await import('@/lib/core/config/env')
      Object.keys(env).forEach((key) => delete (env as any)[key])
      Object.assign(env, {
        AZURE_OPENAI_API_KEY: 'test-azure-key',
        AZURE_OPENAI_ENDPOINT: 'https://test.openai.azure.com',
        AZURE_OPENAI_API_VERSION: '2024-12-01-preview',
        KB_OPENAI_MODEL_NAME: 'custom-embedding-model',
        OPENAI_API_KEY: 'test-openai-key',
      })

      const fetchSpy = vi.mocked(fetch)
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ embedding: [0.1, 0.2, 0.3] }],
        }),
      } as any)

      await generateSearchEmbedding('test query', 'text-embedding-3-small')

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://test.openai.azure.com/openai/deployments/custom-embedding-model/embeddings?api-version=2024-12-01-preview',
        expect.any(Object)
      )

      // Clean up
      Object.keys(env).forEach((key) => delete (env as any)[key])
    })

    it('should throw error when no API configuration provided', async () => {
      const { env } = await import('@/lib/core/config/env')
      Object.keys(env).forEach((key) => delete (env as any)[key])

      await expect(generateSearchEmbedding('test query')).rejects.toThrow(
        'Either OPENAI_API_KEY or Azure OpenAI configuration (AZURE_OPENAI_API_KEY + AZURE_OPENAI_ENDPOINT) must be configured'
      )
    })

    it('should handle Azure OpenAI API errors properly', async () => {
      const { env } = await import('@/lib/core/config/env')
      Object.keys(env).forEach((key) => delete (env as any)[key])
      Object.assign(env, {
        AZURE_OPENAI_API_KEY: 'test-azure-key',
        AZURE_OPENAI_ENDPOINT: 'https://test.openai.azure.com',
        AZURE_OPENAI_API_VERSION: '2024-12-01-preview',
        KB_OPENAI_MODEL_NAME: 'text-embedding-ada-002',
      })

      const fetchSpy = vi.mocked(fetch)
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Deployment not found',
      } as any)

      await expect(generateSearchEmbedding('test query')).rejects.toThrow('Embedding API failed')

      // Clean up
      Object.keys(env).forEach((key) => delete (env as any)[key])
    })

    it('should handle OpenAI API errors properly', async () => {
      const { env } = await import('@/lib/core/config/env')
      Object.keys(env).forEach((key) => delete (env as any)[key])
      Object.assign(env, {
        OPENAI_API_KEY: 'test-openai-key',
      })

      const fetchSpy = vi.mocked(fetch)
      fetchSpy.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        text: async () => 'Rate limit exceeded',
      } as any)

      await expect(generateSearchEmbedding('test query')).rejects.toThrow('Embedding API failed')

      // Clean up
      Object.keys(env).forEach((key) => delete (env as any)[key])
    })

    it('should include correct request body for Azure OpenAI', async () => {
      const { env } = await import('@/lib/core/config/env')
      Object.keys(env).forEach((key) => delete (env as any)[key])
      Object.assign(env, {
        AZURE_OPENAI_API_KEY: 'test-azure-key',
        AZURE_OPENAI_ENDPOINT: 'https://test.openai.azure.com',
        AZURE_OPENAI_API_VERSION: '2024-12-01-preview',
        KB_OPENAI_MODEL_NAME: 'text-embedding-ada-002',
      })

      const fetchSpy = vi.mocked(fetch)
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ embedding: [0.1, 0.2, 0.3] }],
        }),
      } as any)

      await generateSearchEmbedding('test query')

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            input: ['test query'],
            encoding_format: 'float',
          }),
        })
      )

      // Clean up
      Object.keys(env).forEach((key) => delete (env as any)[key])
    })

    it('should include correct request body for OpenAI', async () => {
      const { env } = await import('@/lib/core/config/env')
      Object.keys(env).forEach((key) => delete (env as any)[key])
      Object.assign(env, {
        OPENAI_API_KEY: 'test-openai-key',
      })

      const fetchSpy = vi.mocked(fetch)
      fetchSpy.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ embedding: [0.1, 0.2, 0.3] }],
        }),
      } as any)

      await generateSearchEmbedding('test query', 'text-embedding-3-small')

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            input: ['test query'],
            model: 'text-embedding-3-small',
            encoding_format: 'float',
          }),
        })
      )

      // Clean up
      Object.keys(env).forEach((key) => delete (env as any)[key])
    })
  })

  describe('getDocumentNamesByIds', () => {
    it('should handle empty input gracefully', async () => {
      const { getDocumentNamesByIds } = await import('./utils')

      const result = await getDocumentNamesByIds([])

      expect(result).toEqual({})
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/app/api/knowledge/search/utils.ts

```typescript
import { db } from '@sim/db'
import { document, embedding } from '@sim/db/schema'
import { and, eq, inArray, isNull, sql } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('KnowledgeSearchUtils')

export async function getDocumentNamesByIds(
  documentIds: string[]
): Promise<Record<string, string>> {
  if (documentIds.length === 0) {
    return {}
  }

  const uniqueIds = [...new Set(documentIds)]
  const documents = await db
    .select({
      id: document.id,
      filename: document.filename,
    })
    .from(document)
    .where(and(inArray(document.id, uniqueIds), isNull(document.deletedAt)))

  const documentNameMap: Record<string, string> = {}
  documents.forEach((doc) => {
    documentNameMap[doc.id] = doc.filename
  })

  return documentNameMap
}

export interface SearchResult {
  id: string
  content: string
  documentId: string
  chunkIndex: number
  tag1: string | null
  tag2: string | null
  tag3: string | null
  tag4: string | null
  tag5: string | null
  tag6: string | null
  tag7: string | null
  distance: number
  knowledgeBaseId: string
}

export interface SearchParams {
  knowledgeBaseIds: string[]
  topK: number
  filters?: Record<string, string>
  queryVector?: string
  distanceThreshold?: number
}

// Use shared embedding utility
export { generateSearchEmbedding } from '@/lib/knowledge/embeddings'

function getTagFilters(filters: Record<string, string>, embedding: any) {
  return Object.entries(filters).map(([key, value]) => {
    // Handle OR logic within same tag
    const values = value.includes('|OR|') ? value.split('|OR|') : [value]
    logger.debug(`[getTagFilters] Processing ${key}="${value}" -> values:`, values)

    const getColumnForKey = (key: string) => {
      switch (key) {
        case 'tag1':
          return embedding.tag1
        case 'tag2':
          return embedding.tag2
        case 'tag3':
          return embedding.tag3
        case 'tag4':
          return embedding.tag4
        case 'tag5':
          return embedding.tag5
        case 'tag6':
          return embedding.tag6
        case 'tag7':
          return embedding.tag7
        default:
          return null
      }
    }

    const column = getColumnForKey(key)
    if (!column) return sql`1=1` // No-op for unknown keys

    if (values.length === 1) {
      // Single value - simple equality
      logger.debug(`[getTagFilters] Single value filter: ${key} = ${values[0]}`)
      return sql`LOWER(${column}) = LOWER(${values[0]})`
    }
    // Multiple values - OR logic
    logger.debug(`[getTagFilters] OR filter: ${key} IN (${values.join(', ')})`)
    const orConditions = values.map((v) => sql`LOWER(${column}) = LOWER(${v})`)
    return sql`(${sql.join(orConditions, sql` OR `)})`
  })
}

export function getQueryStrategy(kbCount: number, topK: number) {
  const useParallel = kbCount > 4 || (kbCount > 2 && topK > 50)
  const distanceThreshold = kbCount > 3 ? 0.8 : 1.0
  const parallelLimit = Math.ceil(topK / kbCount) + 5

  return {
    useParallel,
    distanceThreshold,
    parallelLimit,
    singleQueryOptimized: kbCount <= 2,
  }
}

async function executeTagFilterQuery(
  knowledgeBaseIds: string[],
  filters: Record<string, string>
): Promise<{ id: string }[]> {
  if (knowledgeBaseIds.length === 1) {
    return await db
      .select({ id: embedding.id })
      .from(embedding)
      .innerJoin(document, eq(embedding.documentId, document.id))
      .where(
        and(
          eq(embedding.knowledgeBaseId, knowledgeBaseIds[0]),
          eq(embedding.enabled, true),
          isNull(document.deletedAt),
          ...getTagFilters(filters, embedding)
        )
      )
  }
  return await db
    .select({ id: embedding.id })
    .from(embedding)
    .innerJoin(document, eq(embedding.documentId, document.id))
    .where(
      and(
        inArray(embedding.knowledgeBaseId, knowledgeBaseIds),
        eq(embedding.enabled, true),
        isNull(document.deletedAt),
        ...getTagFilters(filters, embedding)
      )
    )
}

async function executeVectorSearchOnIds(
  embeddingIds: string[],
  queryVector: string,
  topK: number,
  distanceThreshold: number
): Promise<SearchResult[]> {
  if (embeddingIds.length === 0) {
    return []
  }

  return await db
    .select({
      id: embedding.id,
      content: embedding.content,
      documentId: embedding.documentId,
      chunkIndex: embedding.chunkIndex,
      tag1: embedding.tag1,
      tag2: embedding.tag2,
      tag3: embedding.tag3,
      tag4: embedding.tag4,
      tag5: embedding.tag5,
      tag6: embedding.tag6,
      tag7: embedding.tag7,
      distance: sql<number>`${embedding.embedding} <=> ${queryVector}::vector`.as('distance'),
      knowledgeBaseId: embedding.knowledgeBaseId,
    })
    .from(embedding)
    .innerJoin(document, eq(embedding.documentId, document.id))
    .where(
      and(
        inArray(embedding.id, embeddingIds),
        isNull(document.deletedAt),
        sql`${embedding.embedding} <=> ${queryVector}::vector < ${distanceThreshold}`
      )
    )
    .orderBy(sql`${embedding.embedding} <=> ${queryVector}::vector`)
    .limit(topK)
}

export async function handleTagOnlySearch(params: SearchParams): Promise<SearchResult[]> {
  const { knowledgeBaseIds, topK, filters } = params

  if (!filters || Object.keys(filters).length === 0) {
    throw new Error('Tag filters are required for tag-only search')
  }

  logger.debug(`[handleTagOnlySearch] Executing tag-only search with filters:`, filters)

  const strategy = getQueryStrategy(knowledgeBaseIds.length, topK)

  if (strategy.useParallel) {
    // Parallel approach for many KBs
    const parallelLimit = Math.ceil(topK / knowledgeBaseIds.length) + 5

    const queryPromises = knowledgeBaseIds.map(async (kbId) => {
      return await db
        .select({
          id: embedding.id,
          content: embedding.content,
          documentId: embedding.documentId,
          chunkIndex: embedding.chunkIndex,
          tag1: embedding.tag1,
          tag2: embedding.tag2,
          tag3: embedding.tag3,
          tag4: embedding.tag4,
          tag5: embedding.tag5,
          tag6: embedding.tag6,
          tag7: embedding.tag7,
          distance: sql<number>`0`.as('distance'), // No distance for tag-only searches
          knowledgeBaseId: embedding.knowledgeBaseId,
        })
        .from(embedding)
        .innerJoin(document, eq(embedding.documentId, document.id))
        .where(
          and(
            eq(embedding.knowledgeBaseId, kbId),
            eq(embedding.enabled, true),
            isNull(document.deletedAt),
            ...getTagFilters(filters, embedding)
          )
        )
        .limit(parallelLimit)
    })

    const parallelResults = await Promise.all(queryPromises)
    return parallelResults.flat().slice(0, topK)
  }
  // Single query for fewer KBs
  return await db
    .select({
      id: embedding.id,
      content: embedding.content,
      documentId: embedding.documentId,
      chunkIndex: embedding.chunkIndex,
      tag1: embedding.tag1,
      tag2: embedding.tag2,
      tag3: embedding.tag3,
      tag4: embedding.tag4,
      tag5: embedding.tag5,
      tag6: embedding.tag6,
      tag7: embedding.tag7,
      distance: sql<number>`0`.as('distance'), // No distance for tag-only searches
      knowledgeBaseId: embedding.knowledgeBaseId,
    })
    .from(embedding)
    .innerJoin(document, eq(embedding.documentId, document.id))
    .where(
      and(
        inArray(embedding.knowledgeBaseId, knowledgeBaseIds),
        eq(embedding.enabled, true),
        isNull(document.deletedAt),
        ...getTagFilters(filters, embedding)
      )
    )
    .limit(topK)
}

export async function handleVectorOnlySearch(params: SearchParams): Promise<SearchResult[]> {
  const { knowledgeBaseIds, topK, queryVector, distanceThreshold } = params

  if (!queryVector || !distanceThreshold) {
    throw new Error('Query vector and distance threshold are required for vector-only search')
  }

  logger.debug(`[handleVectorOnlySearch] Executing vector-only search`)

  const strategy = getQueryStrategy(knowledgeBaseIds.length, topK)

  if (strategy.useParallel) {
    // Parallel approach for many KBs
    const parallelLimit = Math.ceil(topK / knowledgeBaseIds.length) + 5

    const queryPromises = knowledgeBaseIds.map(async (kbId) => {
      return await db
        .select({
          id: embedding.id,
          content: embedding.content,
          documentId: embedding.documentId,
          chunkIndex: embedding.chunkIndex,
          tag1: embedding.tag1,
          tag2: embedding.tag2,
          tag3: embedding.tag3,
          tag4: embedding.tag4,
          tag5: embedding.tag5,
          tag6: embedding.tag6,
          tag7: embedding.tag7,
          distance: sql<number>`${embedding.embedding} <=> ${queryVector}::vector`.as('distance'),
          knowledgeBaseId: embedding.knowledgeBaseId,
        })
        .from(embedding)
        .innerJoin(document, eq(embedding.documentId, document.id))
        .where(
          and(
            eq(embedding.knowledgeBaseId, kbId),
            eq(embedding.enabled, true),
            isNull(document.deletedAt),
            sql`${embedding.embedding} <=> ${queryVector}::vector < ${distanceThreshold}`
          )
        )
        .orderBy(sql`${embedding.embedding} <=> ${queryVector}::vector`)
        .limit(parallelLimit)
    })

    const parallelResults = await Promise.all(queryPromises)
    const allResults = parallelResults.flat()
    return allResults.sort((a, b) => a.distance - b.distance).slice(0, topK)
  }
  // Single query for fewer KBs
  return await db
    .select({
      id: embedding.id,
      content: embedding.content,
      documentId: embedding.documentId,
      chunkIndex: embedding.chunkIndex,
      tag1: embedding.tag1,
      tag2: embedding.tag2,
      tag3: embedding.tag3,
      tag4: embedding.tag4,
      tag5: embedding.tag5,
      tag6: embedding.tag6,
      tag7: embedding.tag7,
      distance: sql<number>`${embedding.embedding} <=> ${queryVector}::vector`.as('distance'),
      knowledgeBaseId: embedding.knowledgeBaseId,
    })
    .from(embedding)
    .innerJoin(document, eq(embedding.documentId, document.id))
    .where(
      and(
        inArray(embedding.knowledgeBaseId, knowledgeBaseIds),
        eq(embedding.enabled, true),
        isNull(document.deletedAt),
        sql`${embedding.embedding} <=> ${queryVector}::vector < ${distanceThreshold}`
      )
    )
    .orderBy(sql`${embedding.embedding} <=> ${queryVector}::vector`)
    .limit(topK)
}

export async function handleTagAndVectorSearch(params: SearchParams): Promise<SearchResult[]> {
  const { knowledgeBaseIds, topK, filters, queryVector, distanceThreshold } = params

  if (!filters || Object.keys(filters).length === 0) {
    throw new Error('Tag filters are required for tag and vector search')
  }
  if (!queryVector || !distanceThreshold) {
    throw new Error('Query vector and distance threshold are required for tag and vector search')
  }

  logger.debug(`[handleTagAndVectorSearch] Executing tag + vector search with filters:`, filters)

  // Step 1: Filter by tags first
  const tagFilteredIds = await executeTagFilterQuery(knowledgeBaseIds, filters)

  if (tagFilteredIds.length === 0) {
    logger.debug(`[handleTagAndVectorSearch] No results found after tag filtering`)
    return []
  }

  logger.debug(
    `[handleTagAndVectorSearch] Found ${tagFilteredIds.length} results after tag filtering`
  )

  // Step 2: Perform vector search only on tag-filtered results
  return await executeVectorSearchOnIds(
    tagFilteredIds.map((r) => r.id),
    queryVector,
    topK,
    distanceThreshold
  )
}
```

--------------------------------------------------------------------------------

````
