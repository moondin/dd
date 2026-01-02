---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 634
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 634 of 933)

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

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/knowledge/store.ts

```typescript
import { create } from 'zustand'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('KnowledgeStore')

export interface ChunkingConfig {
  maxSize: number
  minSize: number
  overlap: number
  chunkSize?: number // Legacy support
  minCharactersPerChunk?: number // Legacy support
  recipe?: string
  lang?: string
  strategy?: 'recursive' | 'semantic' | 'sentence' | 'paragraph'
  [key: string]: unknown
}

export interface KnowledgeBaseData {
  id: string
  name: string
  description?: string
  tokenCount: number
  embeddingModel: string
  embeddingDimension: number
  chunkingConfig: ChunkingConfig
  createdAt: string
  updatedAt: string
  workspaceId?: string
}

export interface DocumentData {
  id: string
  knowledgeBaseId: string
  filename: string
  fileUrl: string
  fileSize: number
  mimeType: string
  chunkCount: number
  tokenCount: number
  characterCount: number
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed'
  processingStartedAt?: string | null
  processingCompletedAt?: string | null
  processingError?: string | null
  enabled: boolean
  uploadedAt: string
  // Document tags
  tag1?: string | null
  tag2?: string | null
  tag3?: string | null
  tag4?: string | null
  tag5?: string | null
  tag6?: string | null
  tag7?: string | null
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
  createdAt: string
  updatedAt: string
}

export interface ChunksPagination {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export interface ChunksCache {
  chunks: ChunkData[]
  pagination: ChunksPagination
  searchQuery?: string
  lastFetchTime: number
}

export interface DocumentsPagination {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export interface DocumentsCache {
  documents: DocumentData[]
  pagination: DocumentsPagination
  searchQuery?: string
  sortBy?: string
  sortOrder?: string
  lastFetchTime: number
}

interface KnowledgeStore {
  // State
  knowledgeBases: Record<string, KnowledgeBaseData>
  documents: Record<string, DocumentsCache> // knowledgeBaseId -> documents cache
  chunks: Record<string, ChunksCache> // documentId -> chunks cache
  knowledgeBasesList: KnowledgeBaseData[]

  // Loading states
  loadingKnowledgeBases: Set<string>
  loadingDocuments: Set<string>
  loadingChunks: Set<string>
  loadingKnowledgeBasesList: boolean
  knowledgeBasesListLoaded: boolean

  // Actions
  getKnowledgeBase: (id: string) => Promise<KnowledgeBaseData | null>
  getDocuments: (
    knowledgeBaseId: string,
    options?: {
      search?: string
      limit?: number
      offset?: number
      sortBy?: string
      sortOrder?: string
    }
  ) => Promise<DocumentData[]>
  getChunks: (
    knowledgeBaseId: string,
    documentId: string,
    options?: { search?: string; limit?: number; offset?: number }
  ) => Promise<ChunkData[]>
  getKnowledgeBasesList: (workspaceId?: string) => Promise<KnowledgeBaseData[]>
  refreshDocuments: (
    knowledgeBaseId: string,
    options?: {
      search?: string
      limit?: number
      offset?: number
      sortBy?: string
      sortOrder?: string
    }
  ) => Promise<DocumentData[]>
  refreshChunks: (
    knowledgeBaseId: string,
    documentId: string,
    options?: { search?: string; limit?: number; offset?: number }
  ) => Promise<ChunkData[]>
  updateDocument: (
    knowledgeBaseId: string,
    documentId: string,
    updates: Partial<DocumentData>
  ) => void
  updateChunk: (documentId: string, chunkId: string, updates: Partial<ChunkData>) => void
  addPendingDocuments: (knowledgeBaseId: string, documents: DocumentData[]) => void
  addKnowledgeBase: (knowledgeBase: KnowledgeBaseData) => void
  updateKnowledgeBase: (id: string, updates: Partial<KnowledgeBaseData>) => void
  removeKnowledgeBase: (id: string) => void
  removeDocument: (knowledgeBaseId: string, documentId: string) => void
  clearDocuments: (knowledgeBaseId: string) => void
  clearChunks: (documentId: string) => void
  clearKnowledgeBasesList: () => void

  // Getters
  getCachedKnowledgeBase: (id: string) => KnowledgeBaseData | null
  getCachedDocuments: (knowledgeBaseId: string) => DocumentsCache | null
  getCachedChunks: (documentId: string, options?: { search?: string }) => ChunksCache | null

  // Loading state getters
  isKnowledgeBaseLoading: (id: string) => boolean
  isDocumentsLoading: (knowledgeBaseId: string) => boolean
  isChunksLoading: (documentId: string) => boolean
}

export const useKnowledgeStore = create<KnowledgeStore>((set, get) => ({
  knowledgeBases: {},
  documents: {},
  chunks: {},
  knowledgeBasesList: [],
  loadingKnowledgeBases: new Set(),
  loadingDocuments: new Set(),
  loadingChunks: new Set(),
  loadingKnowledgeBasesList: false,
  knowledgeBasesListLoaded: false,

  getCachedKnowledgeBase: (id: string) => {
    return get().knowledgeBases[id] || null
  },

  getCachedDocuments: (knowledgeBaseId: string) => {
    return get().documents[knowledgeBaseId] || null
  },

  getCachedChunks: (documentId: string, options?: { search?: string }) => {
    return get().chunks[documentId] || null
  },

  isKnowledgeBaseLoading: (id: string) => {
    return get().loadingKnowledgeBases.has(id)
  },

  isDocumentsLoading: (knowledgeBaseId: string) => {
    return get().loadingDocuments.has(knowledgeBaseId)
  },

  isChunksLoading: (documentId: string) => {
    return get().loadingChunks.has(documentId)
  },

  getKnowledgeBase: async (id: string) => {
    const state = get()

    // Return cached data if it exists
    const cached = state.knowledgeBases[id]
    if (cached) {
      return cached
    }

    // Return cached data if already loading to prevent duplicate requests
    if (state.loadingKnowledgeBases.has(id)) {
      return null
    }

    try {
      set((state) => ({
        loadingKnowledgeBases: new Set([...state.loadingKnowledgeBases, id]),
      }))

      const response = await fetch(`/api/knowledge/${id}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch knowledge base: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch knowledge base')
      }

      const knowledgeBase = result.data

      set((state) => ({
        knowledgeBases: {
          ...state.knowledgeBases,
          [id]: knowledgeBase,
        },
        loadingKnowledgeBases: new Set(
          [...state.loadingKnowledgeBases].filter((loadingId) => loadingId !== id)
        ),
      }))

      logger.info(`Knowledge base loaded: ${id}`)
      return knowledgeBase
    } catch (error) {
      logger.error(`Error fetching knowledge base ${id}:`, error)

      set((state) => ({
        loadingKnowledgeBases: new Set(
          [...state.loadingKnowledgeBases].filter((loadingId) => loadingId !== id)
        ),
      }))

      throw error
    }
  },

  getDocuments: async (
    knowledgeBaseId: string,
    options?: {
      search?: string
      limit?: number
      offset?: number
      sortBy?: string
      sortOrder?: string
    }
  ) => {
    const state = get()

    // Check if we have cached data that matches the exact request parameters
    const cached = state.documents[knowledgeBaseId]
    const requestLimit = options?.limit || 50
    const requestOffset = options?.offset || 0
    const requestSearch = options?.search
    const requestSortBy = options?.sortBy
    const requestSortOrder = options?.sortOrder

    if (
      cached &&
      cached.searchQuery === requestSearch &&
      cached.pagination.limit === requestLimit &&
      cached.pagination.offset === requestOffset &&
      cached.sortBy === requestSortBy &&
      cached.sortOrder === requestSortOrder
    ) {
      return cached.documents
    }

    // Return empty array if already loading to prevent duplicate requests
    if (state.loadingDocuments.has(knowledgeBaseId)) {
      return cached?.documents || []
    }

    try {
      set((state) => ({
        loadingDocuments: new Set([...state.loadingDocuments, knowledgeBaseId]),
      }))

      // Build query parameters using the same defaults as caching
      const params = new URLSearchParams()
      if (requestSearch) params.set('search', requestSearch)
      if (requestSortBy) params.set('sortBy', requestSortBy)
      if (requestSortOrder) params.set('sortOrder', requestSortOrder)
      params.set('limit', requestLimit.toString())
      params.set('offset', requestOffset.toString())

      const url = `/api/knowledge/${knowledgeBaseId}/documents${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch documents')
      }

      const documents = result.data.documents || result.data // Handle both paginated and non-paginated responses
      const pagination = result.data.pagination || {
        total: documents.length,
        limit: requestLimit,
        offset: requestOffset,
        hasMore: false,
      }

      const documentsCache: DocumentsCache = {
        documents,
        pagination,
        searchQuery: requestSearch,
        sortBy: requestSortBy,
        sortOrder: requestSortOrder,
        lastFetchTime: Date.now(),
      }

      set((state) => ({
        documents: {
          ...state.documents,
          [knowledgeBaseId]: documentsCache,
        },
        loadingDocuments: new Set(
          [...state.loadingDocuments].filter((loadingId) => loadingId !== knowledgeBaseId)
        ),
      }))

      logger.info(`Documents loaded for knowledge base: ${knowledgeBaseId}`)
      return documents
    } catch (error) {
      logger.error(`Error fetching documents for knowledge base ${knowledgeBaseId}:`, error)

      set((state) => ({
        loadingDocuments: new Set(
          [...state.loadingDocuments].filter((loadingId) => loadingId !== knowledgeBaseId)
        ),
      }))

      throw error
    }
  },

  getChunks: async (
    knowledgeBaseId: string,
    documentId: string,
    options?: { search?: string; limit?: number; offset?: number }
  ) => {
    const state = get()

    // Return cached chunks if they exist and match the exact search criteria AND offset
    const cached = state.chunks[documentId]
    if (
      cached &&
      cached.searchQuery === options?.search &&
      cached.pagination.offset === (options?.offset || 0) &&
      cached.pagination.limit === (options?.limit || 50)
    ) {
      return cached.chunks
    }

    // Return empty array if already loading to prevent duplicate requests
    if (state.loadingChunks.has(documentId)) {
      return cached?.chunks || []
    }

    try {
      set((state) => ({
        loadingChunks: new Set([...state.loadingChunks, documentId]),
      }))

      // Build query parameters
      const params = new URLSearchParams()
      if (options?.search) params.set('search', options.search)
      if (options?.limit) params.set('limit', options.limit.toString())
      if (options?.offset) params.set('offset', options.offset.toString())

      const response = await fetch(
        `/api/knowledge/${knowledgeBaseId}/documents/${documentId}/chunks?${params.toString()}`
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch chunks: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch chunks')
      }

      const chunks = result.data
      const pagination = result.pagination

      set((state) => ({
        chunks: {
          ...state.chunks,
          [documentId]: {
            chunks, // Always replace chunks for traditional pagination
            pagination: {
              total: pagination?.total || chunks.length,
              limit: pagination?.limit || options?.limit || 50,
              offset: pagination?.offset || options?.offset || 0,
              hasMore: pagination?.hasMore || false,
            },
            searchQuery: options?.search,
            lastFetchTime: Date.now(),
          },
        },
        loadingChunks: new Set(
          [...state.loadingChunks].filter((loadingId) => loadingId !== documentId)
        ),
      }))

      logger.info(`Chunks loaded for document: ${documentId}`)
      return chunks
    } catch (error) {
      logger.error(`Error fetching chunks for document ${documentId}:`, error)

      set((state) => ({
        loadingChunks: new Set(
          [...state.loadingChunks].filter((loadingId) => loadingId !== documentId)
        ),
      }))

      throw error
    }
  },

  getKnowledgeBasesList: async (workspaceId?: string) => {
    const state = get()

    // Return cached list if we have already loaded it before (prevents infinite loops when empty)
    if (state.knowledgeBasesListLoaded) {
      return state.knowledgeBasesList
    }

    // Return cached data if already loading
    if (state.loadingKnowledgeBasesList) {
      return state.knowledgeBasesList
    }

    // Create an AbortController for request cancellation
    const abortController = new AbortController()
    const timeoutId = setTimeout(() => {
      abortController.abort()
    }, 10000) // 10 second timeout

    try {
      set({ loadingKnowledgeBasesList: true })

      const url = workspaceId ? `/api/knowledge?workspaceId=${workspaceId}` : '/api/knowledge'
      const response = await fetch(url, {
        signal: abortController.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Clear the timeout since request completed
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(
          `Failed to fetch knowledge bases: ${response.status} ${response.statusText}`
        )
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch knowledge bases')
      }

      const knowledgeBasesList = result.data || []

      set({
        knowledgeBasesList,
        loadingKnowledgeBasesList: false,
        knowledgeBasesListLoaded: true, // Mark as loaded regardless of result to prevent infinite loops
      })

      logger.info(`Knowledge bases list loaded: ${knowledgeBasesList.length} items`)
      return knowledgeBasesList
    } catch (error) {
      // Clear the timeout in case of error
      clearTimeout(timeoutId)

      logger.error('Error fetching knowledge bases list:', error)

      // Always set loading to false, even on error
      set({
        loadingKnowledgeBasesList: false,
        knowledgeBasesListLoaded: true, // Mark as loaded even on error to prevent infinite retries
      })

      // Don't throw on AbortError (timeout or cancellation)
      if (error instanceof Error && error.name === 'AbortError') {
        logger.warn('Knowledge bases list request was aborted (timeout or cancellation)')
        return state.knowledgeBasesList // Return whatever we have cached
      }

      throw error
    }
  },

  refreshDocuments: async (
    knowledgeBaseId: string,
    options?: {
      search?: string
      limit?: number
      offset?: number
      sortBy?: string
      sortOrder?: string
    }
  ) => {
    const state = get()

    // Return empty array if already loading to prevent duplicate requests
    if (state.loadingDocuments.has(knowledgeBaseId)) {
      return state.documents[knowledgeBaseId]?.documents || []
    }

    try {
      set((state) => ({
        loadingDocuments: new Set([...state.loadingDocuments, knowledgeBaseId]),
      }))

      // Build query parameters using consistent defaults
      const requestLimit = options?.limit || 50
      const requestOffset = options?.offset || 0
      const requestSearch = options?.search
      const requestSortBy = options?.sortBy
      const requestSortOrder = options?.sortOrder

      const params = new URLSearchParams()
      if (requestSearch) params.set('search', requestSearch)
      if (requestSortBy) params.set('sortBy', requestSortBy)
      if (requestSortOrder) params.set('sortOrder', requestSortOrder)
      params.set('limit', requestLimit.toString())
      params.set('offset', requestOffset.toString())

      const url = `/api/knowledge/${knowledgeBaseId}/documents${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch documents')
      }

      const documents = result.data.documents || result.data
      const pagination = result.data.pagination || {
        total: documents.length,
        limit: requestLimit,
        offset: requestOffset,
        hasMore: false,
      }

      const documentsCache: DocumentsCache = {
        documents,
        pagination,
        searchQuery: requestSearch,
        sortBy: requestSortBy,
        sortOrder: requestSortOrder,
        lastFetchTime: Date.now(),
      }

      set((state) => ({
        documents: {
          ...state.documents,
          [knowledgeBaseId]: documentsCache,
        },
        loadingDocuments: new Set(
          [...state.loadingDocuments].filter((loadingId) => loadingId !== knowledgeBaseId)
        ),
      }))

      logger.info(`Documents refreshed for knowledge base: ${knowledgeBaseId}`)
      return documents
    } catch (error) {
      logger.error(`Error refreshing documents for knowledge base ${knowledgeBaseId}:`, error)

      set((state) => ({
        loadingDocuments: new Set(
          [...state.loadingDocuments].filter((loadingId) => loadingId !== knowledgeBaseId)
        ),
      }))

      throw error
    }
  },

  refreshChunks: async (
    knowledgeBaseId: string,
    documentId: string,
    options?: { search?: string; limit?: number; offset?: number }
  ) => {
    const state = get()

    // Return cached chunks if already loading to prevent duplicate requests
    if (state.loadingChunks.has(documentId)) {
      return state.chunks[documentId]?.chunks || []
    }

    try {
      set((state) => ({
        loadingChunks: new Set([...state.loadingChunks, documentId]),
      }))

      // Build query parameters - for refresh, always start from offset 0
      const params = new URLSearchParams()
      if (options?.search) params.set('search', options.search)
      if (options?.limit) params.set('limit', options.limit.toString())
      params.set('offset', '0') // Always start fresh on refresh

      const response = await fetch(
        `/api/knowledge/${knowledgeBaseId}/documents/${documentId}/chunks?${params.toString()}`
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch chunks: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch chunks')
      }

      const chunks = result.data
      const pagination = result.pagination

      set((state) => ({
        chunks: {
          ...state.chunks,
          [documentId]: {
            chunks, // Replace all chunks with fresh data
            pagination: {
              total: pagination?.total || chunks.length,
              limit: pagination?.limit || options?.limit || 50,
              offset: 0, // Reset to start
              hasMore: pagination?.hasMore || false,
            },
            searchQuery: options?.search,
            lastFetchTime: Date.now(),
          },
        },
        loadingChunks: new Set(
          [...state.loadingChunks].filter((loadingId) => loadingId !== documentId)
        ),
      }))

      logger.info(`Chunks refreshed for document: ${documentId}`)
      return chunks
    } catch (error) {
      logger.error(`Error refreshing chunks for document ${documentId}:`, error)

      set((state) => ({
        loadingChunks: new Set(
          [...state.loadingChunks].filter((loadingId) => loadingId !== documentId)
        ),
      }))

      throw error
    }
  },

  updateDocument: (knowledgeBaseId: string, documentId: string, updates: Partial<DocumentData>) => {
    set((state) => {
      const documentsCache = state.documents[knowledgeBaseId]
      if (!documentsCache) return state

      const updatedDocuments = documentsCache.documents.map((doc) =>
        doc.id === documentId ? { ...doc, ...updates } : doc
      )

      return {
        documents: {
          ...state.documents,
          [knowledgeBaseId]: {
            ...documentsCache,
            documents: updatedDocuments,
          },
        },
      }
    })
  },

  updateChunk: (documentId: string, chunkId: string, updates: Partial<ChunkData>) => {
    set((state) => {
      const cachedChunks = state.chunks[documentId]
      if (!cachedChunks || !cachedChunks.chunks) return state

      const updatedChunks = cachedChunks.chunks.map((chunk) =>
        chunk.id === chunkId ? { ...chunk, ...updates } : chunk
      )

      return {
        chunks: {
          ...state.chunks,
          [documentId]: {
            ...cachedChunks,
            chunks: updatedChunks,
          },
        },
      }
    })
  },

  addPendingDocuments: (knowledgeBaseId: string, newDocuments: DocumentData[]) => {
    set((state) => {
      const existingDocumentsCache = state.documents[knowledgeBaseId]
      const existingDocuments = existingDocumentsCache?.documents || []

      const existingIds = new Set(existingDocuments.map((doc) => doc.id))
      const uniqueNewDocuments = newDocuments.filter((doc) => !existingIds.has(doc.id))

      if (uniqueNewDocuments.length === 0) {
        logger.warn(`No new documents to add - all ${newDocuments.length} documents already exist`)
        return state
      }

      const updatedDocuments = [...existingDocuments, ...uniqueNewDocuments]

      const documentsCache: DocumentsCache = {
        documents: updatedDocuments,
        pagination: {
          ...(existingDocumentsCache?.pagination || {
            limit: 50,
            offset: 0,
            hasMore: false,
          }),
          total: updatedDocuments.length,
        },
        searchQuery: existingDocumentsCache?.searchQuery,
        lastFetchTime: Date.now(),
      }

      return {
        documents: {
          ...state.documents,
          [knowledgeBaseId]: documentsCache,
        },
      }
    })
    logger.info(
      `Added ${newDocuments.filter((doc) => !get().documents[knowledgeBaseId]?.documents?.some((existing) => existing.id === doc.id)).length} pending documents for knowledge base: ${knowledgeBaseId}`
    )
  },

  addKnowledgeBase: (knowledgeBase: KnowledgeBaseData) => {
    set((state) => ({
      knowledgeBases: {
        ...state.knowledgeBases,
        [knowledgeBase.id]: knowledgeBase,
      },
      knowledgeBasesList: [knowledgeBase, ...state.knowledgeBasesList],
    }))
    logger.info(`Knowledge base added: ${knowledgeBase.id}`)
  },

  updateKnowledgeBase: (id: string, updates: Partial<KnowledgeBaseData>) => {
    set((state) => {
      const existingKb = state.knowledgeBases[id]
      if (!existingKb) return state

      const updatedKb = { ...existingKb, ...updates }

      return {
        knowledgeBases: {
          ...state.knowledgeBases,
          [id]: updatedKb,
        },
        knowledgeBasesList: state.knowledgeBasesList.map((kb) => (kb.id === id ? updatedKb : kb)),
      }
    })
    logger.info(`Knowledge base updated: ${id}`)
  },

  removeKnowledgeBase: (id: string) => {
    set((state) => {
      const newKnowledgeBases = { ...state.knowledgeBases }
      delete newKnowledgeBases[id]

      const newDocuments = { ...state.documents }
      delete newDocuments[id]

      return {
        knowledgeBases: newKnowledgeBases,
        documents: newDocuments,
        knowledgeBasesList: state.knowledgeBasesList.filter((kb) => kb.id !== id),
      }
    })
    logger.info(`Knowledge base removed: ${id}`)
  },

  removeDocument: (knowledgeBaseId: string, documentId: string) => {
    set((state) => {
      const documentsCache = state.documents[knowledgeBaseId]
      if (!documentsCache) return state

      const updatedDocuments = documentsCache.documents.filter((doc) => doc.id !== documentId)

      // Also clear chunks for the removed document
      const newChunks = { ...state.chunks }
      delete newChunks[documentId]

      return {
        documents: {
          ...state.documents,
          [knowledgeBaseId]: {
            ...documentsCache,
            documents: updatedDocuments,
          },
        },
        chunks: newChunks,
      }
    })
    logger.info(`Document removed from knowledge base: ${documentId}`)
  },

  clearDocuments: (knowledgeBaseId: string) => {
    set((state) => {
      const newDocuments = { ...state.documents }
      delete newDocuments[knowledgeBaseId]
      return { documents: newDocuments }
    })
    logger.info(`Documents cleared for knowledge base: ${knowledgeBaseId}`)
  },

  clearChunks: (documentId: string) => {
    set((state) => {
      const newChunks = { ...state.chunks }
      delete newChunks[documentId]
      return { chunks: newChunks }
    })
    logger.info(`Chunks cleared for document: ${documentId}`)
  },

  clearKnowledgeBasesList: () => {
    set({
      knowledgeBasesList: [],
      knowledgeBasesListLoaded: false, // Reset loaded state to allow reloading
    })
    logger.info('Knowledge bases list cleared')
  },
}))
```

--------------------------------------------------------------------------------

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/logs/store.ts

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Width constraints for the log details panel.
 */
export const MIN_LOG_DETAILS_WIDTH = 400
export const DEFAULT_LOG_DETAILS_WIDTH = 400

/**
 * Returns the maximum log details panel width (50vw).
 * Falls back to a reasonable default for SSR.
 */
export const getMaxLogDetailsWidth = () =>
  typeof window !== 'undefined' ? window.innerWidth * 0.5 : 800

/**
 * Log details UI state persisted across sessions.
 */
interface LogDetailsUIState {
  panelWidth: number
  setPanelWidth: (width: number) => void
  isResizing: boolean
  setIsResizing: (isResizing: boolean) => void
}

export const useLogDetailsUIStore = create<LogDetailsUIState>()(
  persist(
    (set) => ({
      panelWidth: DEFAULT_LOG_DETAILS_WIDTH,
      /**
       * Updates the log details panel width, enforcing min/max constraints.
       * @param width - Desired width in pixels for the panel.
       */
      setPanelWidth: (width) => {
        const maxWidth = getMaxLogDetailsWidth()
        const clampedWidth = Math.max(MIN_LOG_DETAILS_WIDTH, Math.min(width, maxWidth))
        set({ panelWidth: clampedWidth })
      },
      isResizing: false,
      /**
       * Updates the resize state flag.
       * @param isResizing - True while the panel is being resized via mouse drag.
       */
      setIsResizing: (isResizing) => {
        set({ isResizing })
      },
    }),
    {
      name: 'log-details-ui-state',
    }
  )
)
```

--------------------------------------------------------------------------------

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/logs/filters/store.ts

```typescript
import { create } from 'zustand'
import type { FilterState, LogLevel, TimeRange, TriggerType } from '@/stores/logs/filters/types'

const getSearchParams = () => {
  if (typeof window === 'undefined') return new URLSearchParams()
  return new URLSearchParams(window.location.search)
}

const updateURL = (params: URLSearchParams) => {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  url.search = params.toString()
  window.history.replaceState({}, '', url)
}

const DEFAULT_TIME_RANGE: TimeRange = 'All time'

const parseTimeRangeFromURL = (value: string | null): TimeRange => {
  switch (value) {
    case 'all-time':
      return 'All time'
    case 'past-30-minutes':
      return 'Past 30 minutes'
    case 'past-hour':
      return 'Past hour'
    case 'past-6-hours':
      return 'Past 6 hours'
    case 'past-12-hours':
      return 'Past 12 hours'
    case 'past-24-hours':
      return 'Past 24 hours'
    case 'past-3-days':
      return 'Past 3 days'
    case 'past-7-days':
      return 'Past 7 days'
    case 'past-14-days':
      return 'Past 14 days'
    case 'past-30-days':
      return 'Past 30 days'
    default:
      return DEFAULT_TIME_RANGE
  }
}

const parseLogLevelFromURL = (value: string | null): LogLevel => {
  if (!value) return 'all'
  // Support comma-separated values for multiple selections
  const levels = value.split(',').filter(Boolean)
  const validLevels = levels.filter(
    (l) => l === 'error' || l === 'info' || l === 'running' || l === 'pending'
  )
  if (validLevels.length === 0) return 'all'
  if (validLevels.length === 1) return validLevels[0] as LogLevel
  // Return comma-separated string for multiple selections
  return validLevels.join(',') as LogLevel
}

const parseTriggerArrayFromURL = (value: string | null): TriggerType[] => {
  if (!value) return []
  return value
    .split(',')
    .filter((t): t is TriggerType => ['chat', 'api', 'webhook', 'manual', 'schedule'].includes(t))
}

const parseStringArrayFromURL = (value: string | null): string[] => {
  if (!value) return []
  return value.split(',').filter(Boolean)
}

const timeRangeToURL = (timeRange: TimeRange): string => {
  switch (timeRange) {
    case 'Past 30 minutes':
      return 'past-30-minutes'
    case 'Past hour':
      return 'past-hour'
    case 'Past 6 hours':
      return 'past-6-hours'
    case 'Past 12 hours':
      return 'past-12-hours'
    case 'Past 24 hours':
      return 'past-24-hours'
    case 'Past 3 days':
      return 'past-3-days'
    case 'Past 7 days':
      return 'past-7-days'
    case 'Past 14 days':
      return 'past-14-days'
    case 'Past 30 days':
      return 'past-30-days'
    default:
      return 'all-time'
  }
}

export const useFilterStore = create<FilterState>((set, get) => ({
  workspaceId: '',
  viewMode: 'logs',
  timeRange: DEFAULT_TIME_RANGE,
  level: 'all',
  workflowIds: [],
  folderIds: [],
  searchQuery: '',
  triggers: [],
  _isInitializing: false, // Internal flag to prevent URL sync during initialization

  setWorkspaceId: (workspaceId) => set({ workspaceId }),

  setViewMode: (viewMode) => set({ viewMode }),

  setTimeRange: (timeRange) => {
    set({ timeRange })
    if (!get()._isInitializing) {
      get().syncWithURL()
    }
  },

  setLevel: (level) => {
    set({ level })
    if (!get()._isInitializing) {
      get().syncWithURL()
    }
  },

  setWorkflowIds: (workflowIds) => {
    set({ workflowIds })
    if (!get()._isInitializing) {
      get().syncWithURL()
    }
  },

  toggleWorkflowId: (workflowId) => {
    const currentWorkflowIds = [...get().workflowIds]
    const index = currentWorkflowIds.indexOf(workflowId)

    if (index === -1) {
      currentWorkflowIds.push(workflowId)
    } else {
      currentWorkflowIds.splice(index, 1)
    }

    set({ workflowIds: currentWorkflowIds })
    if (!get()._isInitializing) {
      get().syncWithURL()
    }
  },

  setFolderIds: (folderIds) => {
    set({ folderIds })
    if (!get()._isInitializing) {
      get().syncWithURL()
    }
  },

  toggleFolderId: (folderId) => {
    const currentFolderIds = [...get().folderIds]
    const index = currentFolderIds.indexOf(folderId)

    if (index === -1) {
      currentFolderIds.push(folderId)
    } else {
      currentFolderIds.splice(index, 1)
    }

    set({ folderIds: currentFolderIds })
    if (!get()._isInitializing) {
      get().syncWithURL()
    }
  },

  setSearchQuery: (searchQuery) => {
    set({ searchQuery })
    if (!get()._isInitializing) {
      get().syncWithURL()
    }
  },

  setTriggers: (triggers: TriggerType[]) => {
    set({ triggers })
    if (!get()._isInitializing) {
      get().syncWithURL()
    }
  },

  toggleTrigger: (trigger: TriggerType) => {
    const currentTriggers = [...get().triggers]
    const index = currentTriggers.indexOf(trigger)

    if (index === -1) {
      currentTriggers.push(trigger)
    } else {
      currentTriggers.splice(index, 1)
    }

    set({ triggers: currentTriggers })
    if (!get()._isInitializing) {
      get().syncWithURL()
    }
  },

  initializeFromURL: () => {
    set({ _isInitializing: true })

    const params = getSearchParams()

    const timeRange = parseTimeRangeFromURL(params.get('timeRange'))
    const level = parseLogLevelFromURL(params.get('level'))
    const workflowIds = parseStringArrayFromURL(params.get('workflowIds'))
    const folderIds = parseStringArrayFromURL(params.get('folderIds'))
    const triggers = parseTriggerArrayFromURL(params.get('triggers'))
    const searchQuery = params.get('search') || ''

    set({
      timeRange,
      level,
      workflowIds,
      folderIds,
      triggers,
      searchQuery,
      _isInitializing: false,
    })
  },

  syncWithURL: () => {
    const { timeRange, level, workflowIds, folderIds, triggers, searchQuery } = get()
    const params = new URLSearchParams()

    if (timeRange !== DEFAULT_TIME_RANGE) {
      params.set('timeRange', timeRangeToURL(timeRange))
    }

    if (level !== 'all') {
      params.set('level', level)
    }

    if (workflowIds.length > 0) {
      params.set('workflowIds', workflowIds.join(','))
    }

    if (folderIds.length > 0) {
      params.set('folderIds', folderIds.join(','))
    }

    if (triggers.length > 0) {
      params.set('triggers', triggers.join(','))
    }

    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim())
    }

    updateURL(params)
  },
}))
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/stores/logs/filters/types.ts

```typescript
export interface WorkflowData {
  id: string
  name: string
  description: string | null
  color: string
  state: any
}

export interface ToolCall {
  name: string
  duration: number // in milliseconds
  startTime: string // ISO timestamp
  endTime: string // ISO timestamp
  status: 'success' | 'error' // Status of the tool call
  input?: Record<string, unknown> // Input parameters (optional)
  output?: Record<string, unknown> // Output data (optional)
  error?: string // Error message if status is 'error'
}

export interface ToolCallMetadata {
  toolCalls?: ToolCall[]
}

export interface CostMetadata {
  models?: Record<
    string,
    {
      input: number
      output: number
      total: number
      tokens?: {
        prompt?: number
        completion?: number
        total?: number
      }
    }
  >
  input?: number
  output?: number
  total?: number
  tokens?: {
    prompt?: number
    completion?: number
    total?: number
  }
  pricing?: {
    input: number
    output: number
    cachedInput?: number
    updatedAt: string
  }
}

export interface TokenInfo {
  input?: number
  output?: number
  total?: number
  prompt?: number
  completion?: number
}

export interface ProviderTiming {
  duration: number
  startTime: string
  endTime: string
  segments: Array<{
    type: string
    name?: string
    startTime: string | number
    endTime: string | number
    duration: number
  }>
}

export interface TraceSpan {
  id: string
  name: string
  type: string
  duration: number // in milliseconds
  startTime: string
  endTime: string
  children?: TraceSpan[]
  toolCalls?: ToolCall[]
  status?: 'success' | 'error'
  tokens?: number | TokenInfo
  relativeStartMs?: number // Time in ms from the start of the parent span
  blockId?: string // Added to track the original block ID for relationship mapping
  input?: Record<string, unknown> // Added to store input data for this span
  output?: Record<string, unknown> // Added to store output data for this span
  model?: string
  cost?: {
    input?: number
    output?: number
    total?: number
  }
  providerTiming?: ProviderTiming
}

export interface WorkflowLog {
  id: string
  workflowId: string
  executionId?: string | null
  deploymentVersion?: number | null
  deploymentVersionName?: string | null
  level: string
  duration: string | null
  trigger: string | null
  createdAt: string
  workflow?: WorkflowData | null
  files?: Array<{
    id: string
    name: string
    size: number
    type: string
    url: string
    key: string
    uploadedAt: string
    expiresAt: string
    storageProvider?: 's3' | 'blob' | 'local'
    bucketName?: string
  }>
  cost?: CostMetadata
  hasPendingPause?: boolean
  executionData?: ToolCallMetadata & {
    traceSpans?: TraceSpan[]
    totalDuration?: number
    blockInput?: Record<string, unknown>
    enhanced?: boolean

    blockExecutions?: Array<{
      id: string
      blockId: string
      blockName: string
      blockType: string
      startedAt: string
      endedAt: string
      durationMs: number
      status: 'success' | 'error' | 'skipped'
      errorMessage?: string
      errorStackTrace?: string
      inputData: unknown
      outputData: unknown
      cost?: CostMetadata
      metadata: Record<string, unknown>
    }>
  }
}

export interface LogsResponse {
  data: WorkflowLog[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type TimeRange =
  | 'Past 30 minutes'
  | 'Past hour'
  | 'Past 6 hours'
  | 'Past 12 hours'
  | 'Past 24 hours'
  | 'Past 3 days'
  | 'Past 7 days'
  | 'Past 14 days'
  | 'Past 30 days'
  | 'All time'
export type LogLevel = 'error' | 'info' | 'running' | 'pending' | 'all'
export type TriggerType = 'chat' | 'api' | 'webhook' | 'manual' | 'schedule' | 'all' | string

export interface FilterState {
  // Workspace context
  workspaceId: string

  // View mode
  viewMode: 'logs' | 'dashboard'

  // Filter states
  timeRange: TimeRange
  level: LogLevel
  workflowIds: string[]
  folderIds: string[]
  searchQuery: string
  triggers: TriggerType[]

  // Internal state
  _isInitializing: boolean

  // Actions
  setWorkspaceId: (workspaceId: string) => void
  setViewMode: (viewMode: 'logs' | 'dashboard') => void
  setTimeRange: (timeRange: TimeRange) => void
  setLevel: (level: LogLevel) => void
  setWorkflowIds: (workflowIds: string[]) => void
  toggleWorkflowId: (workflowId: string) => void
  setFolderIds: (folderIds: string[]) => void
  toggleFolderId: (folderId: string) => void
  setSearchQuery: (query: string) => void
  setTriggers: (triggers: TriggerType[]) => void
  toggleTrigger: (trigger: TriggerType) => void

  // URL synchronization methods
  initializeFromURL: () => void
  syncWithURL: () => void
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/stores/notifications/index.ts

```typescript
export type {
  AddNotificationParams,
  Notification,
  NotificationAction,
} from './store'
export { useNotificationStore } from './store'
export { openCopilotWithMessage } from './utils'
```

--------------------------------------------------------------------------------

````
