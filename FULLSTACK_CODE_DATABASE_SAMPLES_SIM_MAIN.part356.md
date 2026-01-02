---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 356
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 356 of 933)

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

---[FILE: edit-chunk-modal.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/knowledge/[id]/[documentId]/components/edit-chunk-modal/edit-chunk-modal.tsx
Signals: React

```typescript
'use client'

import { useEffect, useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { AlertCircle, ChevronDown, ChevronUp, Loader2, X } from 'lucide-react'
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  Tooltip,
} from '@/components/emcn'
import { createLogger } from '@/lib/logs/console/logger'
import { useUserPermissionsContext } from '@/app/workspace/[workspaceId]/providers/workspace-permissions-provider'
import type { ChunkData, DocumentData } from '@/stores/knowledge/store'

const logger = createLogger('EditChunkModal')

interface EditChunkModalProps {
  chunk: ChunkData | null
  document: DocumentData | null
  knowledgeBaseId: string
  isOpen: boolean
  onClose: () => void
  onChunkUpdate?: (updatedChunk: ChunkData) => void
  // New props for navigation
  allChunks?: ChunkData[]
  currentPage?: number
  totalPages?: number
  onNavigateToChunk?: (chunk: ChunkData) => void
  onNavigateToPage?: (page: number, selectChunk: 'first' | 'last') => Promise<void>
}

export function EditChunkModal({
  chunk,
  document,
  knowledgeBaseId,
  isOpen,
  onClose,
  onChunkUpdate,
  allChunks = [],
  currentPage = 1,
  totalPages = 1,
  onNavigateToChunk,
  onNavigateToPage,
}: EditChunkModalProps) {
  const userPermissions = useUserPermissionsContext()
  const [editedContent, setEditedContent] = useState(chunk?.content || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showUnsavedChangesAlert, setShowUnsavedChangesAlert] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null)

  const hasUnsavedChanges = editedContent !== (chunk?.content || '')

  useEffect(() => {
    if (chunk?.content) {
      setEditedContent(chunk.content)
    }
  }, [chunk?.id, chunk?.content])

  const currentChunkIndex = chunk ? allChunks.findIndex((c) => c.id === chunk.id) : -1

  const canNavigatePrev = currentChunkIndex > 0 || currentPage > 1
  const canNavigateNext = currentChunkIndex < allChunks.length - 1 || currentPage < totalPages

  const handleSaveContent = async () => {
    if (!chunk || !document) return

    try {
      setIsSaving(true)
      setError(null)

      const response = await fetch(
        `/api/knowledge/${knowledgeBaseId}/documents/${document.id}/chunks/${chunk.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: editedContent,
          }),
        }
      )

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to update chunk')
      }

      const result = await response.json()

      if (result.success && onChunkUpdate) {
        onChunkUpdate(result.data)
      }
    } catch (err) {
      logger.error('Error updating chunk:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const navigateToChunk = async (direction: 'prev' | 'next') => {
    if (!chunk || isNavigating) return

    try {
      setIsNavigating(true)

      if (direction === 'prev') {
        if (currentChunkIndex > 0) {
          const prevChunk = allChunks[currentChunkIndex - 1]
          onNavigateToChunk?.(prevChunk)
        } else if (currentPage > 1) {
          await onNavigateToPage?.(currentPage - 1, 'last')
        }
      } else {
        if (currentChunkIndex < allChunks.length - 1) {
          const nextChunk = allChunks[currentChunkIndex + 1]
          onNavigateToChunk?.(nextChunk)
        } else if (currentPage < totalPages) {
          // Load next page and navigate to first chunk
          await onNavigateToPage?.(currentPage + 1, 'first')
        }
      }
    } catch (err) {
      logger.error(`Error navigating ${direction}:`, err)
      setError(`Failed to navigate to ${direction === 'prev' ? 'previous' : 'next'} chunk`)
    } finally {
      setIsNavigating(false)
    }
  }

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (hasUnsavedChanges) {
      setPendingNavigation(() => () => navigateToChunk(direction))
      setShowUnsavedChangesAlert(true)
    } else {
      void navigateToChunk(direction)
    }
  }

  const handleCloseAttempt = () => {
    if (hasUnsavedChanges && !isSaving) {
      setPendingNavigation(null)
      setShowUnsavedChangesAlert(true)
    } else {
      onClose()
    }
  }

  const handleConfirmDiscard = () => {
    setShowUnsavedChangesAlert(false)
    if (pendingNavigation) {
      void pendingNavigation()
      setPendingNavigation(null)
    } else {
      onClose()
    }
  }

  const isFormValid = editedContent.trim().length > 0 && editedContent.trim().length <= 10000

  if (!chunk || !document) return null

  return (
    <>
      <Modal open={isOpen} onOpenChange={handleCloseAttempt}>
        <ModalContent size='lg'>
          <div className='flex items-center justify-between px-[16px] py-[10px]'>
            <DialogPrimitive.Title className='font-medium text-[16px] text-[var(--text-primary)]'>
              Edit Chunk #{chunk.chunkIndex}
            </DialogPrimitive.Title>

            <div className='flex flex-shrink-0 items-center gap-[8px]'>
              {/* Navigation Controls */}
              <div className='flex items-center gap-[6px]'>
                <Tooltip.Root>
                  <Tooltip.Trigger
                    asChild
                    onFocus={(e) => e.preventDefault()}
                    onBlur={(e) => e.preventDefault()}
                  >
                    <Button
                      variant='ghost'
                      onClick={() => handleNavigate('prev')}
                      disabled={!canNavigatePrev || isNavigating || isSaving}
                      className='h-[16px] w-[16px] p-0'
                    >
                      <ChevronUp className='h-[16px] w-[16px]' />
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Content side='bottom'>
                    Previous chunk{' '}
                    {currentPage > 1 && currentChunkIndex === 0 ? '(previous page)' : ''}
                  </Tooltip.Content>
                </Tooltip.Root>

                <Tooltip.Root>
                  <Tooltip.Trigger
                    asChild
                    onFocus={(e) => e.preventDefault()}
                    onBlur={(e) => e.preventDefault()}
                  >
                    <Button
                      variant='ghost'
                      onClick={() => handleNavigate('next')}
                      disabled={!canNavigateNext || isNavigating || isSaving}
                      className='h-[16px] w-[16px] p-0'
                    >
                      <ChevronDown className='h-[16px] w-[16px]' />
                    </Button>
                  </Tooltip.Trigger>
                  <Tooltip.Content side='bottom'>
                    Next chunk{' '}
                    {currentPage < totalPages && currentChunkIndex === allChunks.length - 1
                      ? '(next page)'
                      : ''}
                  </Tooltip.Content>
                </Tooltip.Root>
              </div>

              <Button
                variant='ghost'
                className='h-[16px] w-[16px] p-0'
                onClick={handleCloseAttempt}
              >
                <X className='h-[16px] w-[16px]' />
                <span className='sr-only'>Close</span>
              </Button>
            </div>
          </div>

          <form>
            <ModalBody className='!pb-[16px]'>
              <div className='flex flex-col gap-[8px]'>
                {/* Error Display */}
                {error && (
                  <div className='flex items-center gap-2 rounded-md border border-[var(--text-error)]/50 bg-[var(--text-error)]/10 p-3'>
                    <AlertCircle className='h-4 w-4 text-[var(--text-error)]' />
                    <p className='text-[var(--text-error)] text-sm'>{error}</p>
                  </div>
                )}

                {/* Content Input Section */}
                <Label htmlFor='content'>Chunk</Label>
                <Textarea
                  id='content'
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  placeholder={
                    userPermissions.canEdit ? 'Enter chunk content...' : 'Read-only view'
                  }
                  rows={20}
                  disabled={isSaving || isNavigating || !userPermissions.canEdit}
                  readOnly={!userPermissions.canEdit}
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                variant='default'
                onClick={handleCloseAttempt}
                type='button'
                disabled={isSaving || isNavigating}
              >
                Cancel
              </Button>
              {userPermissions.canEdit && (
                <Button
                  variant='primary'
                  onClick={handleSaveContent}
                  type='button'
                  disabled={!isFormValid || isSaving || !hasUnsavedChanges || isNavigating}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </Button>
              )}
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Unsaved Changes Alert */}
      <Modal open={showUnsavedChangesAlert} onOpenChange={setShowUnsavedChangesAlert}>
        <ModalContent size='sm'>
          <ModalHeader>Unsaved Changes</ModalHeader>
          <ModalBody>
            <p className='text-[12px] text-[var(--text-tertiary)]'>
              You have unsaved changes to this chunk content.
              {pendingNavigation
                ? ' Do you want to discard your changes and navigate to the next chunk?'
                : ' Are you sure you want to discard your changes and close the editor?'}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant='default'
              onClick={() => {
                setShowUnsavedChangesAlert(false)
                setPendingNavigation(null)
              }}
              type='button'
            >
              Keep Editing
            </Button>
            <Button
              variant='primary'
              onClick={handleConfirmDiscard}
              type='button'
              className='!bg-[var(--text-error)] !text-white hover:!bg-[var(--text-error)]/90'
            >
              Discard Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/logs/layout.tsx

```typescript
/**
 * Logs layout - applies sidebar padding for all logs routes.
 */
export default function LogsLayout({ children }: { children: React.ReactNode }) {
  return <div className='flex h-full flex-1 flex-col overflow-hidden pl-60'>{children}</div>
}
```

--------------------------------------------------------------------------------

---[FILE: logs.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/logs/logs.tsx
Signals: React, Next.js

```typescript
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, ArrowUpRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Badge, buttonVariants } from '@/components/emcn'
import { cn } from '@/lib/core/utils/cn'
import { parseQuery, queryToApiParams } from '@/lib/logs/query-parser'
import { useFolders } from '@/hooks/queries/folders'
import { useLogDetail, useLogsList } from '@/hooks/queries/logs'
import { useDebounce } from '@/hooks/use-debounce'
import { useFilterStore } from '@/stores/logs/filters/store'
import type { WorkflowLog } from '@/stores/logs/filters/types'
import { useUserPermissionsContext } from '../providers/workspace-permissions-provider'
import { Dashboard, LogDetails, LogsToolbar, NotificationSettings } from './components'
import { formatDate, formatDuration, StatusBadge, TriggerBadge } from './utils'

const LOGS_PER_PAGE = 50 as const
const REFRESH_SPINNER_DURATION_MS = 1000 as const

/**
 * Logs page component displaying workflow execution history.
 * Supports filtering, search, live updates, and detailed log inspection.
 * @returns The logs page view with table and sidebar details
 */
export default function Logs() {
  const params = useParams()
  const workspaceId = params.workspaceId as string

  const {
    setWorkspaceId,
    initializeFromURL,
    timeRange,
    level,
    workflowIds,
    folderIds,
    setSearchQuery: setStoreSearchQuery,
    triggers,
    viewMode,
    setViewMode,
  } = useFilterStore()

  useEffect(() => {
    setWorkspaceId(workspaceId)
  }, [workspaceId, setWorkspaceId])

  const [selectedLog, setSelectedLog] = useState<WorkflowLog | null>(null)
  const [selectedLogIndex, setSelectedLogIndex] = useState<number>(-1)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const selectedRowRef = useRef<HTMLTableRowElement | null>(null)
  const loaderRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isInitialized = useRef<boolean>(false)

  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Sync search query from URL on mount (client-side only)
  useEffect(() => {
    const urlSearch = new URLSearchParams(window.location.search).get('search') || ''
    if (urlSearch && urlSearch !== searchQuery) {
      setSearchQuery(urlSearch)
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [isLive, setIsLive] = useState(false)
  const [isVisuallyRefreshing, setIsVisuallyRefreshing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [dashboardRefreshTrigger, setDashboardRefreshTrigger] = useState(0)
  const isSearchOpenRef = useRef<boolean>(false)
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false)
  const userPermissions = useUserPermissionsContext()

  const logFilters = useMemo(
    () => ({
      timeRange,
      level,
      workflowIds,
      folderIds,
      triggers,
      searchQuery: debouncedSearchQuery,
      limit: LOGS_PER_PAGE,
    }),
    [timeRange, level, workflowIds, folderIds, triggers, debouncedSearchQuery]
  )

  const logsQuery = useLogsList(workspaceId, logFilters, {
    enabled: Boolean(workspaceId) && isInitialized.current,
    refetchInterval: isLive ? 5000 : false,
  })

  const logDetailQuery = useLogDetail(selectedLog?.id)

  const logs = useMemo(() => {
    if (!logsQuery.data?.pages) return []
    return logsQuery.data.pages.flatMap((page) => page.logs)
  }, [logsQuery.data?.pages])

  useFolders(workspaceId)

  useEffect(() => {
    if (isInitialized.current) {
      setStoreSearchQuery(debouncedSearchQuery)
    }
  }, [debouncedSearchQuery, setStoreSearchQuery])

  // Track previous log state for efficient change detection
  const prevSelectedLogRef = useRef<WorkflowLog | null>(null)

  // Sync selected log with refreshed data from logs list
  useEffect(() => {
    if (!selectedLog?.id || logs.length === 0) return

    const updatedLog = logs.find((l) => l.id === selectedLog.id)
    if (!updatedLog) return

    const prevLog = prevSelectedLogRef.current

    // Check if status-related fields have changed (e.g., running -> done)
    const hasStatusChange =
      prevLog?.id === updatedLog.id &&
      (updatedLog.duration !== prevLog.duration ||
        updatedLog.level !== prevLog.level ||
        updatedLog.hasPendingPause !== prevLog.hasPendingPause)

    // Only update if the log data actually changed
    if (updatedLog !== selectedLog) {
      setSelectedLog(updatedLog)
      prevSelectedLogRef.current = updatedLog
    }

    // Update index in case position changed
    const newIndex = logs.findIndex((l) => l.id === selectedLog.id)
    if (newIndex !== selectedLogIndex) {
      setSelectedLogIndex(newIndex)
    }

    // Refetch log details if status changed to keep details panel in sync
    if (hasStatusChange) {
      logDetailQuery.refetch()
    }
  }, [logs, selectedLog?.id, selectedLogIndex, logDetailQuery.refetch])

  // Refetch log details during live mode
  useEffect(() => {
    if (!isLive || !selectedLog?.id) return

    const interval = setInterval(() => {
      logDetailQuery.refetch()
    }, 5000)

    return () => clearInterval(interval)
  }, [isLive, selectedLog?.id, logDetailQuery])

  const handleLogClick = (log: WorkflowLog) => {
    // If clicking on the same log that's already selected and sidebar is open, close it
    if (selectedLog?.id === log.id && isSidebarOpen) {
      handleCloseSidebar()
      return
    }

    // Otherwise, select the log and open the sidebar
    setSelectedLog(log)
    prevSelectedLogRef.current = log
    const index = logs.findIndex((l) => l.id === log.id)
    setSelectedLogIndex(index)
    setIsSidebarOpen(true)
  }

  const handleNavigateNext = useCallback(() => {
    if (selectedLogIndex < logs.length - 1) {
      const nextIndex = selectedLogIndex + 1
      setSelectedLogIndex(nextIndex)
      const nextLog = logs[nextIndex]
      setSelectedLog(nextLog)
      prevSelectedLogRef.current = nextLog
    }
  }, [selectedLogIndex, logs])

  const handleNavigatePrev = useCallback(() => {
    if (selectedLogIndex > 0) {
      const prevIndex = selectedLogIndex - 1
      setSelectedLogIndex(prevIndex)
      const prevLog = logs[prevIndex]
      setSelectedLog(prevLog)
      prevSelectedLogRef.current = prevLog
    }
  }, [selectedLogIndex, logs])

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
    setSelectedLog(null)
    setSelectedLogIndex(-1)
    prevSelectedLogRef.current = null
  }

  useEffect(() => {
    if (selectedRowRef.current) {
      selectedRowRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [selectedLogIndex])

  const handleRefresh = useCallback(() => {
    setIsVisuallyRefreshing(true)
    setTimeout(() => setIsVisuallyRefreshing(false), REFRESH_SPINNER_DURATION_MS)
    logsQuery.refetch()
    if (selectedLog?.id) {
      logDetailQuery.refetch()
    }
    // Also trigger dashboard refresh
    setDashboardRefreshTrigger((prev) => prev + 1)
  }, [logsQuery, logDetailQuery, selectedLog?.id])

  const handleToggleLive = useCallback(() => {
    const newIsLive = !isLive
    setIsLive(newIsLive)

    if (newIsLive) {
      setIsVisuallyRefreshing(true)
      setTimeout(() => setIsVisuallyRefreshing(false), REFRESH_SPINNER_DURATION_MS)
      logsQuery.refetch()
      // Also trigger dashboard refresh
      setDashboardRefreshTrigger((prev) => prev + 1)
    }
  }, [isLive, logsQuery])

  const prevIsFetchingRef = useRef(logsQuery.isFetching)
  useEffect(() => {
    const wasFetching = prevIsFetchingRef.current
    const isFetching = logsQuery.isFetching
    prevIsFetchingRef.current = isFetching

    if (isLive && !wasFetching && isFetching) {
      setIsVisuallyRefreshing(true)
      setTimeout(() => setIsVisuallyRefreshing(false), REFRESH_SPINNER_DURATION_MS)
    }
  }, [logsQuery.isFetching, isLive])

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const params = new URLSearchParams()
      params.set('workspaceId', workspaceId)
      if (level !== 'all') params.set('level', level)
      if (triggers.length > 0) params.set('triggers', triggers.join(','))
      if (workflowIds.length > 0) params.set('workflowIds', workflowIds.join(','))
      if (folderIds.length > 0) params.set('folderIds', folderIds.join(','))

      const parsed = parseQuery(debouncedSearchQuery)
      const extra = queryToApiParams(parsed)
      Object.entries(extra).forEach(([k, v]) => params.set(k, v))

      const url = `/api/logs/export?${params.toString()}`
      const a = document.createElement('a')
      a.href = url
      a.download = 'logs_export.csv'
      document.body.appendChild(a)
      a.click()
      a.remove()
    } finally {
      setIsExporting(false)
    }
  }

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true
      initializeFromURL()
    }
  }, [initializeFromURL])

  useEffect(() => {
    const handlePopState = () => {
      initializeFromURL()
      const params = new URLSearchParams(window.location.search)
      setSearchQuery(params.get('search') || '')
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [initializeFromURL])

  const loadMoreLogs = useCallback(() => {
    if (!logsQuery.isFetching && logsQuery.hasNextPage) {
      logsQuery.fetchNextPage()
    }
  }, [logsQuery])

  useEffect(() => {
    if (logsQuery.isLoading || !logsQuery.hasNextPage) return

    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const handleScroll = () => {
      if (!scrollContainer) return

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer

      const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100

      if (scrollPercentage > 60 && !logsQuery.isFetchingNextPage && logsQuery.hasNextPage) {
        loadMoreLogs()
      }
    }

    scrollContainer.addEventListener('scroll', handleScroll)

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [logsQuery.isLoading, logsQuery.hasNextPage, logsQuery.isFetchingNextPage, loadMoreLogs])

  useEffect(() => {
    const currentLoaderRef = loaderRef.current
    const scrollContainer = scrollContainerRef.current

    if (!currentLoaderRef || !scrollContainer || logsQuery.isLoading || !logsQuery.hasNextPage)
      return

    const observer = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        if (!e?.isIntersecting) return
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer
        const pct = (scrollTop / (scrollHeight - clientHeight)) * 100
        if (pct > 70 && !logsQuery.isFetchingNextPage) {
          loadMoreLogs()
        }
      },
      {
        root: scrollContainer,
        threshold: 0.1,
        rootMargin: '200px 0px 0px 0px',
      }
    )

    observer.observe(currentLoaderRef)

    return () => {
      observer.unobserve(currentLoaderRef)
    }
  }, [logsQuery.isLoading, logsQuery.hasNextPage, logsQuery.isFetchingNextPage, loadMoreLogs])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSearchOpenRef.current) return
      if (logs.length === 0) return

      if (selectedLogIndex === -1 && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault()
        setSelectedLogIndex(0)
        setSelectedLog(logs[0])
        prevSelectedLogRef.current = logs[0]
        return
      }

      if (e.key === 'ArrowUp' && !e.metaKey && !e.ctrlKey && selectedLogIndex > 0) {
        e.preventDefault()
        handleNavigatePrev()
      }

      if (e.key === 'ArrowDown' && !e.metaKey && !e.ctrlKey && selectedLogIndex < logs.length - 1) {
        e.preventDefault()
        handleNavigateNext()
      }

      if (e.key === 'Enter' && selectedLog) {
        e.preventDefault()
        setIsSidebarOpen(!isSidebarOpen)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [logs, selectedLogIndex, isSidebarOpen, selectedLog, handleNavigateNext, handleNavigatePrev])

  const isDashboardView = viewMode === 'dashboard'

  return (
    <div className='flex h-full flex-1 flex-col overflow-hidden'>
      <div className='flex flex-1 overflow-hidden'>
        <div className='flex flex-1 flex-col overflow-auto pt-[28px] pl-[24px]'>
          <div className='pr-[24px]'>
            <LogsToolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              isRefreshing={isVisuallyRefreshing}
              onRefresh={handleRefresh}
              isLive={isLive}
              onToggleLive={handleToggleLive}
              isExporting={isExporting}
              onExport={handleExport}
              canEdit={userPermissions.canEdit}
              hasLogs={logs.length > 0}
              onOpenNotificationSettings={() => setIsNotificationSettingsOpen(true)}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onSearchOpenChange={(open: boolean) => {
                isSearchOpenRef.current = open
              }}
            />
          </div>

          {/* Dashboard view - always mounted to preserve state and query cache */}
          <div
            className={cn('flex min-h-0 flex-1 flex-col pr-[24px]', !isDashboardView && 'hidden')}
          >
            <Dashboard isLive={isLive} refreshTrigger={dashboardRefreshTrigger} />
          </div>

          {/* Main content area with table - only show in logs view */}
          <div
            className={cn(
              'relative mt-[24px] flex min-h-0 flex-1 flex-col overflow-hidden rounded-[6px]',
              isDashboardView && 'hidden'
            )}
          >
            {/* Table container */}
            <div className='relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[6px] bg-[var(--surface-1)]'>
              {/* Table header */}
              <div className='flex-shrink-0 rounded-t-[6px] bg-[var(--surface-3)] px-[24px] py-[10px]'>
                <div className='flex items-center'>
                  <span className='w-[8%] min-w-[70px] font-medium text-[12px] text-[var(--text-tertiary)]'>
                    Date
                  </span>
                  <span className='w-[12%] min-w-[90px] font-medium text-[12px] text-[var(--text-tertiary)]'>
                    Time
                  </span>
                  <span className='w-[12%] min-w-[100px] font-medium text-[12px] text-[var(--text-tertiary)]'>
                    Status
                  </span>
                  <span className='w-[22%] min-w-[140px] font-medium text-[12px] text-[var(--text-tertiary)]'>
                    Workflow
                  </span>
                  <span className='w-[12%] min-w-[90px] font-medium text-[12px] text-[var(--text-tertiary)]'>
                    Cost
                  </span>
                  <span className='w-[14%] min-w-[110px] font-medium text-[12px] text-[var(--text-tertiary)]'>
                    Trigger
                  </span>
                  <span className='w-[20%] min-w-[100px] font-medium text-[12px] text-[var(--text-tertiary)]'>
                    Duration
                  </span>
                </div>
              </div>

              {/* Table body - scrollable */}
              <div
                className='min-h-0 flex-1 overflow-y-auto overflow-x-hidden'
                ref={scrollContainerRef}
              >
                {logsQuery.isLoading && !logsQuery.data ? (
                  <div className='flex h-full items-center justify-center'>
                    <div className='flex items-center gap-[8px] text-[var(--text-secondary)]'>
                      <Loader2 className='h-[16px] w-[16px] animate-spin' />
                      <span className='text-[13px]'>Loading logs...</span>
                    </div>
                  </div>
                ) : logsQuery.isError ? (
                  <div className='flex h-full items-center justify-center'>
                    <div className='flex items-center gap-[8px] text-[var(--text-error)]'>
                      <AlertCircle className='h-[16px] w-[16px]' />
                      <span className='text-[13px]'>
                        Error: {logsQuery.error?.message || 'Failed to load logs'}
                      </span>
                    </div>
                  </div>
                ) : logs.length === 0 ? (
                  <div className='flex h-full items-center justify-center'>
                    <div className='flex items-center gap-[8px] text-[var(--text-secondary)]'>
                      <span className='text-[13px]'>No logs found</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    {logs.map((log) => {
                      const formattedDate = formatDate(log.createdAt)
                      const isSelected = selectedLog?.id === log.id
                      const baseLevel = (log.level || 'info').toLowerCase()
                      const isError = baseLevel === 'error'
                      const isPending = !isError && log.hasPendingPause === true
                      const isRunning = !isError && !isPending && log.duration === null

                      return (
                        <div
                          key={log.id}
                          ref={isSelected ? selectedRowRef : null}
                          className={cn(
                            'relative flex h-[44px] cursor-pointer items-center px-[24px] hover:bg-[var(--c-2A2A2A)]',
                            isSelected && 'bg-[var(--c-2A2A2A)]'
                          )}
                          onClick={() => handleLogClick(log)}
                        >
                          <div className='flex flex-1 items-center'>
                            {/* Date */}
                            <span className='w-[8%] min-w-[70px] font-medium text-[12px] text-[var(--text-primary)]'>
                              {formattedDate.compactDate}
                            </span>

                            {/* Time */}
                            <span className='w-[12%] min-w-[90px] font-medium text-[12px] text-[var(--text-primary)]'>
                              {formattedDate.compactTime}
                            </span>

                            {/* Status */}
                            <div className='w-[12%] min-w-[100px]'>
                              <StatusBadge
                                status={
                                  isError
                                    ? 'error'
                                    : isPending
                                      ? 'pending'
                                      : isRunning
                                        ? 'running'
                                        : 'info'
                                }
                              />
                            </div>

                            {/* Workflow */}
                            <div className='flex w-[22%] min-w-[140px] items-center gap-[8px] pr-[8px]'>
                              <div
                                className='h-[10px] w-[10px] flex-shrink-0 rounded-[3px]'
                                style={{ backgroundColor: log.workflow?.color }}
                              />
                              <span className='min-w-0 truncate font-medium text-[12px] text-[var(--text-primary)]'>
                                {log.workflow?.name || 'Unknown'}
                              </span>
                            </div>

                            {/* Cost */}
                            <span className='w-[12%] min-w-[90px] font-medium text-[12px] text-[var(--text-primary)]'>
                              {typeof log.cost?.total === 'number'
                                ? `$${log.cost.total.toFixed(4)}`
                                : '—'}
                            </span>

                            {/* Trigger */}
                            <div className='w-[14%] min-w-[110px]'>
                              {log.trigger ? (
                                <TriggerBadge trigger={log.trigger} />
                              ) : (
                                <span className='font-medium text-[12px] text-[var(--text-primary)]'>
                                  —
                                </span>
                              )}
                            </div>

                            {/* Duration */}
                            <div className='w-[20%] min-w-[100px]'>
                              <Badge
                                variant='default'
                                className='rounded-[6px] px-[9px] py-[2px] text-[12px]'
                              >
                                {formatDuration(log.duration) || '—'}
                              </Badge>
                            </div>
                          </div>

                          {/* Resume Link */}
                          {isPending && log.executionId && (log.workflow?.id || log.workflowId) && (
                            <Link
                              href={`/resume/${log.workflow?.id || log.workflowId}/${log.executionId}`}
                              target='_blank'
                              rel='noopener noreferrer'
                              className={cn(
                                buttonVariants({ variant: 'active' }),
                                'absolute right-[24px] h-[26px] w-[26px] rounded-[6px] p-0'
                              )}
                              aria-label='Open resume console'
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ArrowUpRight className='h-[14px] w-[14px]' />
                            </Link>
                          )}
                        </div>
                      )
                    })}

                    {/* Infinite scroll loader */}
                    {logsQuery.hasNextPage && (
                      <div className='flex items-center justify-center py-[16px]'>
                        <div
                          ref={loaderRef}
                          className='flex items-center gap-[8px] text-[var(--text-secondary)]'
                        >
                          {logsQuery.isFetchingNextPage ? (
                            <>
                              <Loader2 className='h-[16px] w-[16px] animate-spin' />
                              <span className='text-[13px]'>Loading more...</span>
                            </>
                          ) : (
                            <span className='text-[13px]'>Scroll to load more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Log Details - rendered inside table container */}
            <LogDetails
              log={logDetailQuery.data ? { ...selectedLog, ...logDetailQuery.data } : selectedLog}
              isOpen={isSidebarOpen}
              onClose={handleCloseSidebar}
              onNavigateNext={handleNavigateNext}
              onNavigatePrev={handleNavigatePrev}
              hasNext={selectedLogIndex < logs.length - 1}
              hasPrev={selectedLogIndex > 0}
            />
          </div>
        </div>
      </div>

      <NotificationSettings
        workspaceId={workspaceId}
        open={isNotificationSettingsOpen}
        onOpenChange={setIsNotificationSettingsOpen}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/logs/page.tsx

```typescript
import Logs from '@/app/workspace/[workspaceId]/logs/logs'

export default Logs
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/logs/types.ts

```typescript
export interface Suggestion {
  id: string
  value: string
  label: string
  description?: string
  color?: string
  category?:
    | 'filters'
    | 'level'
    | 'trigger'
    | 'cost'
    | 'date'
    | 'duration'
    | 'workflow'
    | 'folder'
    | 'workflowId'
    | 'executionId'
    | 'show-all'
}

export interface SuggestionSection {
  title: string
  suggestions: Suggestion[]
}

export interface SuggestionGroup {
  type: 'filter-keys' | 'filter-values' | 'multi-section'
  filterKey?: string
  suggestions: Suggestion[]
  sections?: SuggestionSection[]
}
```

--------------------------------------------------------------------------------

````
