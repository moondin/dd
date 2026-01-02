---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 526
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 526 of 933)

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

---[FILE: use-debounce.ts]---
Location: sim-main/apps/sim/hooks/use-debounce.ts
Signals: React

```typescript
import { useEffect, useState } from 'react'

/**
 * A hook that debounces a value by a specified delay
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set a timeout to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clean up the timeout if the value changes before the delay has passed
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
```

--------------------------------------------------------------------------------

---[FILE: use-execution-stream.ts]---
Location: sim-main/apps/sim/hooks/use-execution-stream.ts
Signals: React

```typescript
import { useCallback, useRef } from 'react'
import { createLogger } from '@/lib/logs/console/logger'
import type { ExecutionEvent } from '@/lib/workflows/executor/execution-events'
import type { SubflowType } from '@/stores/workflows/workflow/types'

const logger = createLogger('useExecutionStream')

export interface ExecutionStreamCallbacks {
  onExecutionStarted?: (data: { startTime: string }) => void
  onExecutionCompleted?: (data: {
    success: boolean
    output: any
    duration: number
    startTime: string
    endTime: string
  }) => void
  onExecutionError?: (data: { error: string; duration: number }) => void
  onExecutionCancelled?: (data: { duration: number }) => void
  onBlockStarted?: (data: {
    blockId: string
    blockName: string
    blockType: string
    iterationCurrent?: number
    iterationTotal?: number
    iterationType?: SubflowType
  }) => void
  onBlockCompleted?: (data: {
    blockId: string
    blockName: string
    blockType: string
    input?: any
    output: any
    durationMs: number
    iterationCurrent?: number
    iterationTotal?: number
    iterationType?: SubflowType
  }) => void
  onBlockError?: (data: {
    blockId: string
    blockName: string
    blockType: string
    input?: any
    error: string
    durationMs: number
    iterationCurrent?: number
    iterationTotal?: number
    iterationType?: SubflowType
  }) => void
  onStreamChunk?: (data: { blockId: string; chunk: string }) => void
  onStreamDone?: (data: { blockId: string }) => void
}

export interface ExecuteStreamOptions {
  workflowId: string
  input?: any
  workflowInput?: any
  currentBlockStates?: Record<string, any>
  envVarValues?: Record<string, string>
  workflowVariables?: Record<string, any>
  selectedOutputs?: string[]
  startBlockId?: string
  triggerType?: string
  useDraftState?: boolean
  isClientSession?: boolean
  workflowStateOverride?: {
    blocks: Record<string, any>
    edges: any[]
    loops?: Record<string, any>
    parallels?: Record<string, any>
  }
  callbacks?: ExecutionStreamCallbacks
}

/**
 * Hook for executing workflows via server-side SSE streaming
 */
export function useExecutionStream() {
  const abortControllerRef = useRef<AbortController | null>(null)

  const execute = useCallback(async (options: ExecuteStreamOptions) => {
    const { workflowId, callbacks = {}, ...payload } = options

    // Cancel any existing execution
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      const response = await fetch(`/api/workflows/${workflowId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...payload, stream: true }),
        signal: abortController.signal,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to start execution')
      }

      if (!response.body) {
        throw new Error('No response body')
      }

      // Read SSE stream
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            break
          }

          // Decode chunk and add to buffer
          buffer += decoder.decode(value, { stream: true })

          // Process complete SSE messages
          const lines = buffer.split('\n\n')

          // Keep the last incomplete message in the buffer
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (!line.trim() || !line.startsWith('data: ')) {
              continue
            }

            const data = line.substring(6).trim()

            // Check for [DONE] marker
            if (data === '[DONE]') {
              logger.info('Stream completed')
              continue
            }

            try {
              const event = JSON.parse(data) as ExecutionEvent

              // Log all SSE events for debugging
              logger.info('📡 SSE Event received:', {
                type: event.type,
                executionId: event.executionId,
                data: event.data,
              })

              // Dispatch event to appropriate callback
              switch (event.type) {
                case 'execution:started':
                  logger.info('🚀 Execution started')
                  callbacks.onExecutionStarted?.(event.data)
                  break
                case 'execution:completed':
                  logger.info('✅ Execution completed')
                  callbacks.onExecutionCompleted?.(event.data)
                  break
                case 'execution:error':
                  logger.error('❌ Execution error')
                  callbacks.onExecutionError?.(event.data)
                  break
                case 'execution:cancelled':
                  logger.warn('🛑 Execution cancelled')
                  callbacks.onExecutionCancelled?.(event.data)
                  break
                case 'block:started':
                  logger.info('🔷 Block started:', event.data.blockId)
                  callbacks.onBlockStarted?.(event.data)
                  break
                case 'block:completed':
                  logger.info('✓ Block completed:', event.data.blockId)
                  callbacks.onBlockCompleted?.(event.data)
                  break
                case 'block:error':
                  logger.error('✗ Block error:', event.data.blockId)
                  callbacks.onBlockError?.(event.data)
                  break
                case 'stream:chunk':
                  callbacks.onStreamChunk?.(event.data)
                  break
                case 'stream:done':
                  logger.info('Stream done:', event.data.blockId)
                  callbacks.onStreamDone?.(event.data)
                  break
                default:
                  logger.warn('Unknown event type:', (event as any).type)
              }
            } catch (error) {
              logger.error('Failed to parse SSE event:', error, { data })
            }
          }
        }
      } finally {
        reader.releaseLock()
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        logger.info('Execution stream cancelled')
        callbacks.onExecutionCancelled?.({ duration: 0 })
      } else {
        logger.error('Execution stream error:', error)
        callbacks.onExecutionError?.({
          error: error.message || 'Unknown error',
          duration: 0,
        })
      }
      throw error
    } finally {
      abortControllerRef.current = null
    }
  }, [])

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  return {
    execute,
    cancel,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-focus-on-block.ts]---
Location: sim-main/apps/sim/hooks/use-focus-on-block.ts
Signals: React

```typescript
import { useCallback } from 'react'
import { useReactFlow } from 'reactflow'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('useFocusOnBlock')

/**
 * Hook to focus the canvas on a specific block with smooth animation.
 * Can be called from any component within the workflow (editor, toolbar, action bar, etc.).
 *
 * @returns Function to focus on a block by its ID
 *
 * @example
 * const focusOnBlock = useFocusOnBlock()
 * focusOnBlock('block-id-123')
 */
export function useFocusOnBlock() {
  const { getNodes, fitView } = useReactFlow()

  return useCallback(
    (blockId: string) => {
      if (!blockId) {
        logger.warn('Cannot focus on block: no blockId provided')
        return
      }

      try {
        // Check if the node exists
        const node = getNodes().find((n) => n.id === blockId)
        if (!node) {
          logger.warn('Cannot focus on block: block not found', { blockId })
          return
        }

        // Focus on the specific node with smooth animation
        fitView({
          nodes: [node],
          duration: 400,
          padding: 0.3,
          minZoom: 0.5,
          maxZoom: 1.0,
        })

        logger.info('Focused on block', { blockId })
      } catch (err) {
        logger.error('Failed to focus on block', { err, blockId })
      }
    },
    [getNodes, fitView]
  )
}
```

--------------------------------------------------------------------------------

---[FILE: use-forwarded-ref.ts]---
Location: sim-main/apps/sim/hooks/use-forwarded-ref.ts
Signals: React

```typescript
import { type MutableRefObject, useEffect, useRef } from 'react'

/**
 * A hook that handles forwarded refs and returns a mutable ref object
 * Useful for components that need both a forwarded ref and a local ref
 * @param forwardedRef The forwarded ref from React.forwardRef
 * @returns A mutable ref object that can be used locally
 */
export function useForwardedRef<T>(
  forwardedRef: React.ForwardedRef<T>
): MutableRefObject<T | null> {
  const innerRef = useRef<T | null>(null)

  useEffect(() => {
    if (!forwardedRef) return

    if (typeof forwardedRef === 'function') {
      forwardedRef(innerRef.current)
    } else {
      forwardedRef.current = innerRef.current
    }
  }, [forwardedRef])

  return innerRef
}
```

--------------------------------------------------------------------------------

---[FILE: use-knowledge-base-name.ts]---
Location: sim-main/apps/sim/hooks/use-knowledge-base-name.ts
Signals: React

```typescript
import { useEffect, useState } from 'react'
import { useKnowledgeStore } from '@/stores/knowledge/store'

export function useKnowledgeBaseName(knowledgeBaseId?: string | null) {
  const getCachedKnowledgeBase = useKnowledgeStore((state) => state.getCachedKnowledgeBase)
  const getKnowledgeBase = useKnowledgeStore((state) => state.getKnowledgeBase)
  const [isLoading, setIsLoading] = useState(false)

  const cached = knowledgeBaseId ? getCachedKnowledgeBase(knowledgeBaseId) : null

  useEffect(() => {
    if (!knowledgeBaseId || cached || isLoading) return
    setIsLoading(true)
    getKnowledgeBase(knowledgeBaseId)
      .catch(() => {
        // ignore
      })
      .finally(() => setIsLoading(false))
  }, [knowledgeBaseId, cached, isLoading, getKnowledgeBase])

  return cached?.name ?? null
}
```

--------------------------------------------------------------------------------

---[FILE: use-knowledge-base-tag-definitions.ts]---
Location: sim-main/apps/sim/hooks/use-knowledge-base-tag-definitions.ts
Signals: React

```typescript
'use client'

import { useCallback, useEffect, useState } from 'react'
import type { TagSlot } from '@/lib/knowledge/constants'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('useKnowledgeBaseTagDefinitions')

export interface TagDefinition {
  id: string
  tagSlot: TagSlot
  displayName: string
  fieldType: string
  createdAt: string
  updatedAt: string
}

/**
 * Hook for fetching KB-scoped tag definitions (for filtering/selection)
 * @param knowledgeBaseId - The knowledge base ID
 */
export function useKnowledgeBaseTagDefinitions(knowledgeBaseId: string | null) {
  const [tagDefinitions, setTagDefinitions] = useState<TagDefinition[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTagDefinitions = useCallback(async () => {
    if (!knowledgeBaseId) {
      setTagDefinitions([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/knowledge/${knowledgeBaseId}/tag-definitions`)

      if (!response.ok) {
        throw new Error(`Failed to fetch tag definitions: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success && Array.isArray(data.data)) {
        setTagDefinitions(data.data)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      logger.error('Error fetching tag definitions:', err)
      setError(errorMessage)
      setTagDefinitions([])
    } finally {
      setIsLoading(false)
    }
  }, [knowledgeBaseId])

  const getTagLabel = useCallback(
    (tagSlot: string): string => {
      const definition = tagDefinitions.find((def) => def.tagSlot === tagSlot)
      return definition?.displayName || tagSlot
    },
    [tagDefinitions]
  )

  const getTagDefinition = useCallback(
    (tagSlot: string): TagDefinition | undefined => {
      return tagDefinitions.find((def) => def.tagSlot === tagSlot)
    },
    [tagDefinitions]
  )

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    fetchTagDefinitions()
  }, [fetchTagDefinitions])

  return {
    tagDefinitions,
    isLoading,
    error,
    fetchTagDefinitions,
    getTagLabel,
    getTagDefinition,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-knowledge.ts]---
Location: sim-main/apps/sim/hooks/use-knowledge.ts
Signals: React

```typescript
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import Fuse from 'fuse.js'
import { createLogger } from '@/lib/logs/console/logger'
import {
  fetchKnowledgeChunks,
  knowledgeKeys,
  serializeChunkParams,
  serializeDocumentParams,
  useKnowledgeBaseQuery,
  useKnowledgeBasesQuery,
  useKnowledgeChunksQuery,
  useKnowledgeDocumentsQuery,
} from '@/hooks/queries/knowledge'
import {
  type ChunkData,
  type ChunksPagination,
  type DocumentData,
  type DocumentsCache,
  type DocumentsPagination,
  type KnowledgeBaseData,
  useKnowledgeStore,
} from '@/stores/knowledge/store'

const logger = createLogger('UseKnowledgeBase')

export function useKnowledgeBase(id: string) {
  const queryClient = useQueryClient()
  const query = useKnowledgeBaseQuery(id)

  useEffect(() => {
    if (query.data) {
      const knowledgeBase = query.data
      useKnowledgeStore.setState((state) => ({
        knowledgeBases: {
          ...state.knowledgeBases,
          [knowledgeBase.id]: knowledgeBase,
        },
      }))
    }
  }, [query.data])

  const refreshKnowledgeBase = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: knowledgeKeys.detail(id),
    })
  }, [queryClient, id])

  return {
    knowledgeBase: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    refresh: refreshKnowledgeBase,
  }
}

// Constants
const DEFAULT_PAGE_SIZE = 50

export function useKnowledgeBaseDocuments(
  knowledgeBaseId: string,
  options?: {
    search?: string
    limit?: number
    offset?: number
    sortBy?: string
    sortOrder?: string
    enabled?: boolean
  }
) {
  const queryClient = useQueryClient()
  const requestLimit = options?.limit ?? DEFAULT_PAGE_SIZE
  const requestOffset = options?.offset ?? 0
  const requestSearch = options?.search
  const requestSortBy = options?.sortBy
  const requestSortOrder = options?.sortOrder
  const paramsKey = serializeDocumentParams({
    knowledgeBaseId,
    limit: requestLimit,
    offset: requestOffset,
    search: requestSearch,
    sortBy: requestSortBy,
    sortOrder: requestSortOrder,
  })

  const query = useKnowledgeDocumentsQuery(
    {
      knowledgeBaseId,
      limit: requestLimit,
      offset: requestOffset,
      search: requestSearch,
      sortBy: requestSortBy,
      sortOrder: requestSortOrder,
    },
    {
      enabled: (options?.enabled ?? true) && Boolean(knowledgeBaseId),
    }
  )

  useEffect(() => {
    if (!query.data || !knowledgeBaseId) return
    const documentsCache = {
      documents: query.data.documents,
      pagination: query.data.pagination,
      searchQuery: requestSearch,
      sortBy: requestSortBy,
      sortOrder: requestSortOrder,
      lastFetchTime: Date.now(),
    }
    useKnowledgeStore.setState((state) => ({
      documents: {
        ...state.documents,
        [knowledgeBaseId]: documentsCache,
      },
    }))
  }, [query.data, knowledgeBaseId, requestSearch, requestSortBy, requestSortOrder])

  const documents = query.data?.documents ?? []
  const pagination =
    query.data?.pagination ??
    ({
      total: 0,
      limit: requestLimit,
      offset: requestOffset,
      hasMore: false,
    } satisfies DocumentsCache['pagination'])

  const refreshDocumentsData = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: knowledgeKeys.documents(knowledgeBaseId, paramsKey),
    })
  }, [queryClient, knowledgeBaseId, paramsKey])

  const updateDocumentLocal = useCallback(
    (documentId: string, updates: Partial<DocumentData>) => {
      queryClient.setQueryData<{
        documents: DocumentData[]
        pagination: DocumentsPagination
      }>(knowledgeKeys.documents(knowledgeBaseId, paramsKey), (previous) => {
        if (!previous) return previous
        return {
          ...previous,
          documents: previous.documents.map((doc) =>
            doc.id === documentId ? { ...doc, ...updates } : doc
          ),
        }
      })
      useKnowledgeStore.setState((state) => {
        const existing = state.documents[knowledgeBaseId]
        if (!existing) return state
        return {
          documents: {
            ...state.documents,
            [knowledgeBaseId]: {
              ...existing,
              documents: existing.documents.map((doc) =>
                doc.id === documentId ? { ...doc, ...updates } : doc
              ),
            },
          },
        }
      })
      logger.info(`Updated document ${documentId} for knowledge base ${knowledgeBaseId}`)
    },
    [knowledgeBaseId, paramsKey, queryClient]
  )

  return {
    documents,
    pagination,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    refreshDocuments: refreshDocumentsData,
    updateDocument: updateDocumentLocal,
  }
}

export function useKnowledgeBasesList(
  workspaceId?: string,
  options?: {
    enabled?: boolean
  }
) {
  const queryClient = useQueryClient()
  const query = useKnowledgeBasesQuery(workspaceId, { enabled: options?.enabled ?? true })
  useEffect(() => {
    if (query.data) {
      useKnowledgeStore.setState((state) => ({
        knowledgeBasesList: query.data as KnowledgeBaseData[],
        knowledgeBasesListLoaded: true,
        loadingKnowledgeBasesList: query.isLoading,
        knowledgeBases: query.data!.reduce<Record<string, KnowledgeBaseData>>(
          (acc, kb) => {
            acc[kb.id] = kb
            return acc
          },
          { ...state.knowledgeBases }
        ),
      }))
    } else if (query.isLoading) {
      useKnowledgeStore.setState((state) => ({
        loadingKnowledgeBasesList: true,
      }))
    }
  }, [query.data, query.isLoading])

  const addKnowledgeBase = useCallback(
    (knowledgeBase: KnowledgeBaseData) => {
      queryClient.setQueryData<KnowledgeBaseData[]>(
        knowledgeKeys.list(workspaceId),
        (previous = []) => {
          if (previous.some((kb) => kb.id === knowledgeBase.id)) {
            return previous
          }
          return [knowledgeBase, ...previous]
        }
      )
      useKnowledgeStore.setState((state) => ({
        knowledgeBases: {
          ...state.knowledgeBases,
          [knowledgeBase.id]: knowledgeBase,
        },
        knowledgeBasesList: state.knowledgeBasesList.some((kb) => kb.id === knowledgeBase.id)
          ? state.knowledgeBasesList
          : [knowledgeBase, ...state.knowledgeBasesList],
      }))
    },
    [queryClient, workspaceId]
  )

  const removeKnowledgeBase = useCallback(
    (knowledgeBaseId: string) => {
      queryClient.setQueryData<KnowledgeBaseData[]>(
        knowledgeKeys.list(workspaceId),
        (previous) => previous?.filter((kb) => kb.id !== knowledgeBaseId) ?? []
      )
      useKnowledgeStore.setState((state) => ({
        knowledgeBases: Object.fromEntries(
          Object.entries(state.knowledgeBases).filter(([id]) => id !== knowledgeBaseId)
        ),
        knowledgeBasesList: state.knowledgeBasesList.filter((kb) => kb.id !== knowledgeBaseId),
      }))
    },
    [queryClient, workspaceId]
  )

  const refreshList = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: knowledgeKeys.list(workspaceId) })
  }, [queryClient, workspaceId])

  const forceRefresh = refreshList

  return {
    knowledgeBases: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    refreshList,
    forceRefresh,
    addKnowledgeBase,
    removeKnowledgeBase,
    retryCount: 0,
    maxRetries: 0,
  }
}

/**
 * Hook to manage chunks for a specific document with optional client-side search
 */
export function useDocumentChunks(
  knowledgeBaseId: string,
  documentId: string,
  urlPage = 1,
  urlSearch = '',
  options: { enableClientSearch?: boolean } = {}
) {
  const { enableClientSearch = false } = options
  const queryClient = useQueryClient()

  const [chunks, setChunks] = useState<ChunkData[]>([])
  const [allChunks, setAllChunks] = useState<ChunkData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false,
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(urlPage)

  useEffect(() => {
    setCurrentPage(urlPage)
  }, [urlPage])

  useEffect(() => {
    if (!enableClientSearch) return
    setSearchQuery(urlSearch)
  }, [enableClientSearch, urlSearch])

  if (enableClientSearch) {
    const loadAllChunks = useCallback(async () => {
      if (!knowledgeBaseId || !documentId) return

      try {
        setIsLoading(true)
        setError(null)

        const aggregated: ChunkData[] = []
        const limit = DEFAULT_PAGE_SIZE
        let offset = 0
        let hasMore = true

        while (hasMore) {
          const { chunks: batch, pagination: batchPagination } = await fetchKnowledgeChunks({
            knowledgeBaseId,
            documentId,
            limit,
            offset,
          })

          aggregated.push(...batch)
          hasMore = batchPagination.hasMore
          offset = batchPagination.offset + batchPagination.limit
        }

        setAllChunks(aggregated)
        setChunks(aggregated)
        setPagination({
          total: aggregated.length,
          limit,
          offset: 0,
          hasMore: false,
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load chunks'
        setError(message)
        logger.error(`Failed to load chunks for document ${documentId}:`, err)
      } finally {
        setIsLoading(false)
      }
    }, [documentId, knowledgeBaseId])

    useEffect(() => {
      loadAllChunks()
    }, [loadAllChunks])

    const filteredChunks = useMemo(() => {
      if (!searchQuery.trim()) return allChunks

      const fuse = new Fuse(allChunks, {
        keys: ['content'],
        threshold: 0.3,
        includeScore: true,
        includeMatches: true,
        minMatchCharLength: 2,
        ignoreLocation: true,
      })

      const results = fuse.search(searchQuery)
      return results.map((result) => result.item)
    }, [allChunks, searchQuery])

    const CHUNKS_PER_PAGE = DEFAULT_PAGE_SIZE
    const totalPages = Math.max(1, Math.ceil(filteredChunks.length / CHUNKS_PER_PAGE))
    const hasNextPage = currentPage < totalPages
    const hasPrevPage = currentPage > 1

    const paginatedChunks = useMemo(() => {
      const startIndex = (currentPage - 1) * CHUNKS_PER_PAGE
      const endIndex = startIndex + CHUNKS_PER_PAGE
      return filteredChunks.slice(startIndex, endIndex)
    }, [filteredChunks, currentPage])

    useEffect(() => {
      if (currentPage > 1) {
        setCurrentPage(1)
      }
    }, [searchQuery, currentPage])

    useEffect(() => {
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages)
      }
    }, [currentPage, totalPages])

    const goToPage = useCallback(
      (page: number) => {
        if (page >= 1 && page <= totalPages) {
          setCurrentPage(page)
        }
      },
      [totalPages]
    )

    const nextPage = useCallback(() => {
      if (hasNextPage) {
        setCurrentPage((prev) => prev + 1)
      }
    }, [hasNextPage])

    const prevPage = useCallback(() => {
      if (hasPrevPage) {
        setCurrentPage((prev) => prev - 1)
      }
    }, [hasPrevPage])

    return {
      chunks: paginatedChunks,
      allChunks,
      filteredChunks,
      paginatedChunks,
      searchQuery,
      setSearchQuery,
      isLoading,
      error,
      pagination: {
        total: filteredChunks.length,
        limit: CHUNKS_PER_PAGE,
        offset: (currentPage - 1) * CHUNKS_PER_PAGE,
        hasMore: hasNextPage,
      },
      currentPage,
      totalPages,
      hasNextPage,
      hasPrevPage,
      goToPage,
      nextPage,
      prevPage,
      refreshChunks: loadAllChunks,
      searchChunks: async () => filteredChunks,
      updateChunk: (chunkId: string, updates: Partial<ChunkData>) => {
        setAllChunks((previous) =>
          previous.map((chunk) => (chunk.id === chunkId ? { ...chunk, ...updates } : chunk))
        )
        setChunks((previous) =>
          previous.map((chunk) => (chunk.id === chunkId ? { ...chunk, ...updates } : chunk))
        )
      },
      clearChunks: () => {
        setAllChunks([])
        setChunks([])
      },
    }
  }

  const serverCurrentPage = Math.max(1, urlPage)
  const serverSearchQuery = urlSearch ?? ''
  const serverLimit = DEFAULT_PAGE_SIZE
  const serverOffset = (serverCurrentPage - 1) * serverLimit

  const chunkQueryParams = useMemo(
    () => ({
      knowledgeBaseId,
      documentId,
      limit: serverLimit,
      offset: serverOffset,
      search: serverSearchQuery ? serverSearchQuery : undefined,
    }),
    [documentId, knowledgeBaseId, serverLimit, serverOffset, serverSearchQuery]
  )

  const chunkParamsKey = useMemo(() => serializeChunkParams(chunkQueryParams), [chunkQueryParams])

  const chunkQuery = useKnowledgeChunksQuery(chunkQueryParams, {
    enabled: Boolean(knowledgeBaseId && documentId),
  })

  useEffect(() => {
    if (chunkQuery.data) {
      setChunks(chunkQuery.data.chunks)
      setPagination(chunkQuery.data.pagination)
    }
  }, [chunkQuery.data])

  useEffect(() => {
    setIsLoading(chunkQuery.isFetching || chunkQuery.isLoading)
  }, [chunkQuery.isFetching, chunkQuery.isLoading])

  useEffect(() => {
    const message = chunkQuery.error instanceof Error ? chunkQuery.error.message : chunkQuery.error
    setError(message ?? null)
  }, [chunkQuery.error])

  const totalPages = Math.max(
    1,
    Math.ceil(
      (pagination.total || 0) /
        (pagination.limit && pagination.limit > 0 ? pagination.limit : DEFAULT_PAGE_SIZE)
    )
  )
  const hasNextPage = serverCurrentPage < totalPages
  const hasPrevPage = serverCurrentPage > 1

  const goToPage = useCallback(
    async (page: number) => {
      if (!knowledgeBaseId || !documentId) return
      if (page < 1 || page > totalPages) return

      const offset = (page - 1) * serverLimit
      const paramsKey = serializeChunkParams({
        knowledgeBaseId,
        documentId,
        limit: serverLimit,
        offset,
        search: chunkQueryParams.search,
      })

      await queryClient.fetchQuery({
        queryKey: knowledgeKeys.chunks(knowledgeBaseId, documentId, paramsKey),
        queryFn: () =>
          fetchKnowledgeChunks({
            knowledgeBaseId,
            documentId,
            limit: serverLimit,
            offset,
            search: chunkQueryParams.search,
          }),
      })
    },
    [chunkQueryParams.search, documentId, knowledgeBaseId, queryClient, serverLimit, totalPages]
  )

  const nextPage = useCallback(async () => {
    if (hasNextPage) {
      await goToPage(serverCurrentPage + 1)
    }
  }, [goToPage, hasNextPage, serverCurrentPage])

  const prevPage = useCallback(async () => {
    if (hasPrevPage) {
      await goToPage(serverCurrentPage - 1)
    }
  }, [goToPage, hasPrevPage, serverCurrentPage])

  const refreshChunksData = useCallback(async () => {
    if (!knowledgeBaseId || !documentId) return
    await queryClient.invalidateQueries({
      queryKey: knowledgeKeys.chunks(knowledgeBaseId, documentId, chunkParamsKey),
    })
  }, [chunkParamsKey, documentId, knowledgeBaseId, queryClient])

  const searchChunks = useCallback(
    async (newSearchQuery: string) => {
      if (!knowledgeBaseId || !documentId) return []
      const paramsKey = serializeChunkParams({
        knowledgeBaseId,
        documentId,
        limit: serverLimit,
        offset: 0,
        search: newSearchQuery || undefined,
      })

      const result = await queryClient.fetchQuery({
        queryKey: knowledgeKeys.chunks(knowledgeBaseId, documentId, paramsKey),
        queryFn: () =>
          fetchKnowledgeChunks({
            knowledgeBaseId,
            documentId,
            limit: serverLimit,
            offset: 0,
            search: newSearchQuery || undefined,
          }),
      })

      return result.chunks
    },
    [documentId, knowledgeBaseId, queryClient, serverLimit]
  )

  const updateChunkLocal = useCallback(
    (chunkId: string, updates: Partial<ChunkData>) => {
      queryClient.setQueriesData<{
        chunks: ChunkData[]
        pagination: ChunksPagination
      }>(
        {
          predicate: (query) =>
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === knowledgeKeys.all[0] &&
            query.queryKey[1] === knowledgeKeys.detail('')[1] &&
            query.queryKey[2] === knowledgeBaseId &&
            query.queryKey[3] === 'documents' &&
            query.queryKey[4] === documentId &&
            query.queryKey[5] === 'chunks',
        },
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            chunks: oldData.chunks.map((chunk) =>
              chunk.id === chunkId ? { ...chunk, ...updates } : chunk
            ),
          }
        }
      )

      setChunks((previous) =>
        previous.map((chunk) => (chunk.id === chunkId ? { ...chunk, ...updates } : chunk))
      )
      useKnowledgeStore.getState().updateChunk(documentId, chunkId, updates)
    },
    [documentId, knowledgeBaseId, queryClient]
  )

  const clearChunksLocal = useCallback(() => {
    useKnowledgeStore.getState().clearChunks(documentId)
    setChunks([])
    setPagination({
      total: 0,
      limit: DEFAULT_PAGE_SIZE,
      offset: 0,
      hasMore: false,
    })
  }, [documentId])

  return {
    chunks,
    allChunks: chunks,
    filteredChunks: chunks,
    paginatedChunks: chunks,
    searchQuery: serverSearchQuery,
    setSearchQuery: () => {},
    isLoading,
    error,
    pagination,
    currentPage: serverCurrentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    refreshChunks: refreshChunksData,
    searchChunks,
    updateChunk: updateChunkLocal,
    clearChunks: clearChunksLocal,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-mcp-server-test.ts]---
Location: sim-main/apps/sim/hooks/use-mcp-server-test.ts
Signals: React

```typescript
'use client'

import { useCallback, useState } from 'react'
import { createLogger } from '@/lib/logs/console/logger'
import type { McpTransport } from '@/lib/mcp/types'

const logger = createLogger('useMcpServerTest')

function isUrlBasedTransport(transport: McpTransport): boolean {
  return transport === 'streamable-http'
}

export interface McpServerTestConfig {
  name: string
  transport: McpTransport
  url?: string
  headers?: Record<string, string>
  timeout?: number
  workspaceId: string
}

export interface McpServerTestResult {
  success: boolean
  message: string
  error?: string
  negotiatedVersion?: string
  supportedCapabilities?: string[]
  toolCount?: number
  warnings?: string[]
}

export function useMcpServerTest() {
  const [testResult, setTestResult] = useState<McpServerTestResult | null>(null)
  const [isTestingConnection, setIsTestingConnection] = useState(false)

  const testConnection = useCallback(
    async (
      config: McpServerTestConfig,
      options?: { silent?: boolean }
    ): Promise<McpServerTestResult> => {
      const { silent = false } = options || {}

      if (!config.name || !config.transport || !config.workspaceId) {
        const result: McpServerTestResult = {
          success: false,
          message: 'Missing required configuration',
          error: 'Please provide server name, transport method, and workspace ID',
        }
        if (!silent) setTestResult(result)
        return result
      }

      if (isUrlBasedTransport(config.transport) && !config.url?.trim()) {
        const result: McpServerTestResult = {
          success: false,
          message: 'Missing server URL',
          error: 'Please provide a server URL for HTTP/SSE transport',
        }
        if (!silent) setTestResult(result)
        return result
      }

      if (!silent) {
        setIsTestingConnection(true)
        setTestResult(null)
      }

      try {
        const cleanConfig = {
          ...config,
          headers: config.headers
            ? Object.fromEntries(
                Object.entries(config.headers).filter(
                  ([key, value]) => key.trim() !== '' && value.trim() !== ''
                )
              )
            : {},
        }

        const response = await fetch('/api/mcp/servers/test-connection', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cleanConfig),
        })

        const result = await response.json()

        if (!response.ok) {
          if (result.data?.error || result.data?.success === false) {
            const testResult: McpServerTestResult = {
              success: false,
              message: result.data.error || 'Connection failed',
              error: result.data.error,
              warnings: result.data.warnings,
            }
            if (!silent) setTestResult(testResult)
            logger.error('MCP server test failed:', result.data.error)
            return testResult
          }
          throw new Error(result.error || 'Connection test failed')
        }

        if (!silent) setTestResult(result.data || result)
        logger.info(`MCP server test ${result.data?.success ? 'passed' : 'failed'}:`, config.name)
        return result.data || result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        const result: McpServerTestResult = {
          success: false,
          message: 'Connection failed',
          error: errorMessage,
        }
        if (!silent) setTestResult(result)
        logger.error('MCP server test failed:', errorMessage)
        return result
      } finally {
        if (!silent) setIsTestingConnection(false)
      }
    },
    []
  )

  const clearTestResult = useCallback(() => {
    setTestResult(null)
  }, [])

  return {
    testResult,
    isTestingConnection,
    testConnection,
    clearTestResult,
  }
}

export function getTestResultSummary(result: McpServerTestResult): string {
  if (result.success) {
    let summary = `✓ Connection successful! Protocol: ${result.negotiatedVersion || 'Unknown'}`
    if (result.toolCount !== undefined) {
      summary += `\n${result.toolCount} tool${result.toolCount !== 1 ? 's' : ''} available`
    }
    if (result.supportedCapabilities && result.supportedCapabilities.length > 0) {
      summary += `\nCapabilities: ${result.supportedCapabilities.join(', ')}`
    }
    return summary
  }
  return `✗ Connection failed: ${result.message}${result.error ? `\n${result.error}` : ''}`
}

export function isServerSafeToAdd(result: McpServerTestResult): boolean {
  if (!result.success) return false

  if (result.warnings?.some((w) => w.toLowerCase().includes('version'))) {
    return false
  }

  return true
}
```

--------------------------------------------------------------------------------

````
