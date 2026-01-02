---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 360
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 360 of 933)

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

---[FILE: log-details.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/logs/components/log-details/log-details.tsx
Signals: React

```typescript
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronUp, X } from 'lucide-react'
import { Button, Eye } from '@/components/emcn'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BASE_EXECUTION_CHARGE } from '@/lib/billing/constants'
import { FileCards, FrozenCanvas, TraceSpans } from '@/app/workspace/[workspaceId]/logs/components'
import { useLogDetailsResize } from '@/app/workspace/[workspaceId]/logs/hooks'
import type { LogStatus } from '@/app/workspace/[workspaceId]/logs/utils'
import { formatDate, StatusBadge, TriggerBadge } from '@/app/workspace/[workspaceId]/logs/utils'
import { formatCost } from '@/providers/utils'
import type { WorkflowLog } from '@/stores/logs/filters/types'
import { useLogDetailsUIStore } from '@/stores/logs/store'

interface LogDetailsProps {
  /** The log to display details for */
  log: WorkflowLog | null
  /** Whether the sidebar is open */
  isOpen: boolean
  /** Callback when closing the sidebar */
  onClose: () => void
  /** Callback to navigate to next log */
  onNavigateNext?: () => void
  /** Callback to navigate to previous log */
  onNavigatePrev?: () => void
  /** Whether there is a next log available */
  hasNext?: boolean
  /** Whether there is a previous log available */
  hasPrev?: boolean
}

/**
 * Sidebar panel displaying detailed information about a selected log.
 * Supports navigation between logs and expandable sections.
 * @param props - Component props
 * @returns Log details sidebar component
 */
export function LogDetails({
  log,
  isOpen,
  onClose,
  onNavigateNext,
  onNavigatePrev,
  hasNext = false,
  hasPrev = false,
}: LogDetailsProps) {
  const [isFrozenCanvasOpen, setIsFrozenCanvasOpen] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const panelWidth = useLogDetailsUIStore((state) => state.panelWidth)
  const { handleMouseDown } = useLogDetailsResize()

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0
    }
  }, [log?.id])

  const isWorkflowExecutionLog = useMemo(() => {
    if (!log) return false
    return (
      (log.trigger === 'manual' && !!log.duration) ||
      (log.executionData?.enhanced && log.executionData?.traceSpans)
    )
  }, [log])

  const hasCostInfo = useMemo(() => {
    return isWorkflowExecutionLog && log?.cost
  }, [log, isWorkflowExecutionLog])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }

      if (isOpen) {
        if (e.key === 'ArrowUp' && hasPrev && onNavigatePrev) {
          e.preventDefault()
          handleNavigate(onNavigatePrev)
        }

        if (e.key === 'ArrowDown' && hasNext && onNavigateNext) {
          e.preventDefault()
          handleNavigate(onNavigateNext)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, hasPrev, hasNext, onNavigatePrev, onNavigateNext])

  const handleNavigate = (navigateFunction: () => void) => {
    navigateFunction()
  }

  const formattedTimestamp = log ? formatDate(log.createdAt) : null

  const logStatus: LogStatus = useMemo(() => {
    if (!log) return 'info'
    const baseLevel = (log.level || 'info').toLowerCase()
    const isError = baseLevel === 'error'
    const isPending = !isError && log.hasPendingPause === true
    const isRunning = !isError && !isPending && log.duration === null
    return isError ? 'error' : isPending ? 'pending' : isRunning ? 'running' : 'info'
  }, [log])

  return (
    <>
      {/* Resize Handle - positioned outside the panel */}
      {isOpen && (
        <div
          className='absolute top-0 bottom-0 z-[60] w-[8px] cursor-ew-resize'
          style={{ right: `${panelWidth - 4}px` }}
          onMouseDown={handleMouseDown}
          role='separator'
          aria-label='Resize log details panel'
          aria-orientation='vertical'
        />
      )}

      <div
        className={`absolute top-[0px] right-0 bottom-0 z-50 transform overflow-hidden border-l bg-[var(--surface-1)] shadow-md transition-transform duration-200 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: `${panelWidth}px` }}
        aria-label='Log details sidebar'
      >
        {log && (
          <div className='flex h-full flex-col px-[14px] pt-[12px]'>
            {/* Header */}
            <div className='flex items-center justify-between'>
              <h2 className='font-medium text-[14px] text-[var(--text-primary)]'>Log Details</h2>
              <div className='flex items-center gap-[1px]'>
                <Button
                  variant='ghost'
                  className='!p-[4px]'
                  onClick={() => hasPrev && handleNavigate(onNavigatePrev!)}
                  disabled={!hasPrev}
                  aria-label='Previous log'
                >
                  <ChevronUp className='h-[14px] w-[14px] rotate-180' />
                </Button>
                <Button
                  variant='ghost'
                  className='!p-[4px]'
                  onClick={() => hasNext && handleNavigate(onNavigateNext!)}
                  disabled={!hasNext}
                  aria-label='Next log'
                >
                  <ChevronUp className='h-[14px] w-[14px]' />
                </Button>
                <Button variant='ghost' className='!p-[4px]' onClick={onClose} aria-label='Close'>
                  <X className='h-[14px] w-[14px]' />
                </Button>
              </div>
            </div>

            {/* Content - Scrollable */}
            <ScrollArea className='mt-[20px] h-full w-full overflow-y-auto' ref={scrollAreaRef}>
              <div className='flex flex-col gap-[10px] pb-[16px]'>
                {/* Timestamp & Workflow Row */}
                <div className='flex min-w-0 items-center gap-[16px] px-[1px]'>
                  {/* Timestamp Card */}
                  <div className='flex w-[140px] flex-shrink-0 flex-col gap-[8px]'>
                    <div className='font-medium text-[12px] text-[var(--text-tertiary)]'>
                      Timestamp
                    </div>
                    <div className='flex items-center gap-[6px]'>
                      <span className='font-medium text-[14px] text-[var(--text-secondary)]'>
                        {formattedTimestamp?.compactDate || 'N/A'}
                      </span>
                      <span className='font-medium text-[14px] text-[var(--text-secondary)]'>
                        {formattedTimestamp?.compactTime || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Workflow Card */}
                  {log.workflow && (
                    <div className='flex w-0 min-w-0 flex-1 flex-col gap-[8px]'>
                      <div className='font-medium text-[12px] text-[var(--text-tertiary)]'>
                        Workflow
                      </div>
                      <div className='flex min-w-0 items-center gap-[8px]'>
                        <div
                          className='h-[10px] w-[10px] flex-shrink-0 rounded-[3px]'
                          style={{ backgroundColor: log.workflow?.color }}
                        />
                        <span className='min-w-0 flex-1 truncate font-medium text-[14px] text-[var(--text-secondary)]'>
                          {log.workflow.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Execution ID */}
                {log.executionId && (
                  <div className='flex flex-col gap-[6px] rounded-[6px] bg-[var(--surface-2)] px-[10px] py-[8px]'>
                    <span className='font-medium text-[12px] text-[var(--text-tertiary)]'>
                      Execution ID
                    </span>
                    <span className='truncate font-medium text-[14px] text-[var(--text-secondary)]'>
                      {log.executionId}
                    </span>
                  </div>
                )}

                {/* Details Section */}
                <div className='flex min-w-0 flex-col overflow-hidden'>
                  {/* Level */}
                  <div className='flex h-[48px] items-center justify-between border-[var(--border)] border-b p-[8px]'>
                    <span className='font-medium text-[12px] text-[var(--text-tertiary)]'>
                      Level
                    </span>
                    <StatusBadge status={logStatus} />
                  </div>

                  {/* Trigger */}
                  <div className='flex h-[48px] items-center justify-between border-[var(--border)] border-b p-[8px]'>
                    <span className='font-medium text-[12px] text-[var(--text-tertiary)]'>
                      Trigger
                    </span>
                    {log.trigger ? (
                      <TriggerBadge trigger={log.trigger} />
                    ) : (
                      <span className='font-medium text-[12px] text-[var(--text-secondary)]'>
                        —
                      </span>
                    )}
                  </div>

                  {/* Duration */}
                  <div
                    className={`flex h-[48px] items-center justify-between border-b p-[8px] ${log.deploymentVersion ? 'border-[var(--border)]' : 'border-transparent'}`}
                  >
                    <span className='font-medium text-[12px] text-[var(--text-tertiary)]'>
                      Duration
                    </span>
                    <span className='font-medium text-[13px] text-[var(--text-secondary)]'>
                      {log.duration || '—'}
                    </span>
                  </div>

                  {/* Version */}
                  {log.deploymentVersion && (
                    <div className='flex h-[48px] items-center gap-[8px] p-[8px]'>
                      <span className='flex-shrink-0 font-medium text-[12px] text-[var(--text-tertiary)]'>
                        Version
                      </span>
                      <div className='flex w-0 flex-1 justify-end'>
                        <span className='max-w-full truncate rounded-[6px] bg-[#14291B] px-[9px] py-[2px] font-medium text-[#86EFAC] text-[12px]'>
                          {log.deploymentVersionName || `v${log.deploymentVersion}`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Workflow State */}
                {isWorkflowExecutionLog && log.executionId && (
                  <div className='flex flex-col gap-[6px] rounded-[6px] bg-[var(--surface-2)] px-[10px] py-[8px]'>
                    <span className='font-medium text-[12px] text-[var(--text-tertiary)]'>
                      Workflow State
                    </span>
                    <button
                      onClick={() => setIsFrozenCanvasOpen(true)}
                      className='flex items-center justify-between rounded-[6px] bg-[var(--surface-1)] px-[10px] py-[8px] transition-colors hover:bg-[var(--c-2A2A2A)]'
                    >
                      <span className='font-medium text-[12px] text-[var(--text-secondary)]'>
                        View Snapshot
                      </span>
                      <Eye className='h-[14px] w-[14px] text-[var(--text-subtle)]' />
                    </button>
                  </div>
                )}

                {/* Workflow Execution - Trace Spans */}
                {isWorkflowExecutionLog && log.executionData?.traceSpans && (
                  <TraceSpans
                    traceSpans={log.executionData.traceSpans}
                    totalDuration={log.executionData.totalDuration}
                  />
                )}

                {/* Files */}
                {log.files && log.files.length > 0 && (
                  <FileCards files={log.files} isExecutionFile />
                )}

                {/* Cost Breakdown */}
                {hasCostInfo && (
                  <div className='flex flex-col gap-[8px]'>
                    <span className='px-[1px] font-medium text-[12px] text-[var(--text-tertiary)]'>
                      Cost Breakdown
                    </span>

                    <div className='flex flex-col gap-[4px] rounded-[6px] border border-[var(--border)]'>
                      <div className='flex flex-col gap-[10px] rounded-[6px] p-[10px]'>
                        <div className='flex items-center justify-between'>
                          <span className='font-medium text-[12px] text-[var(--text-tertiary)]'>
                            Base Execution:
                          </span>
                          <span className='font-medium text-[12px] text-[var(--text-secondary)]'>
                            {formatCost(BASE_EXECUTION_CHARGE)}
                          </span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='font-medium text-[12px] text-[var(--text-tertiary)]'>
                            Model Input:
                          </span>
                          <span className='font-medium text-[12px] text-[var(--text-secondary)]'>
                            {formatCost(log.cost?.input || 0)}
                          </span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='font-medium text-[12px] text-[var(--text-tertiary)]'>
                            Model Output:
                          </span>
                          <span className='font-medium text-[12px] text-[var(--text-secondary)]'>
                            {formatCost(log.cost?.output || 0)}
                          </span>
                        </div>
                      </div>

                      <div className='border-[var(--border)] border-t' />

                      <div className='flex flex-col gap-[10px] rounded-[6px] p-[10px]'>
                        <div className='flex items-center justify-between'>
                          <span className='font-medium text-[12px] text-[var(--text-tertiary)]'>
                            Total:
                          </span>
                          <span className='font-medium text-[12px] text-[var(--text-secondary)]'>
                            {formatCost(log.cost?.total || 0)}
                          </span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='font-medium text-[12px] text-[var(--text-tertiary)]'>
                            Tokens:
                          </span>
                          <span className='font-medium text-[12px] text-[var(--text-secondary)]'>
                            {log.cost?.tokens?.prompt || 0} in / {log.cost?.tokens?.completion || 0}{' '}
                            out
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center justify-center rounded-[6px] bg-[var(--surface-2)] p-[8px] text-center'>
                      <p className='font-medium text-[11px] text-[var(--text-subtle)]'>
                        Total cost includes a base execution charge of{' '}
                        {formatCost(BASE_EXECUTION_CHARGE)} plus any model usage costs.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Frozen Canvas Modal */}
        {log?.executionId && (
          <FrozenCanvas
            executionId={log.executionId}
            traceSpans={log.executionData?.traceSpans}
            isModal
            isOpen={isFrozenCanvasOpen}
            onClose={() => setIsFrozenCanvasOpen(false)}
          />
        )}
      </div>
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: file-download.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/logs/components/log-details/components/file-download/file-download.tsx
Signals: React, Next.js

```typescript
'use client'

import { useState } from 'react'
import { ArrowDown, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/emcn'
import { createLogger } from '@/lib/logs/console/logger'
import { extractWorkspaceIdFromExecutionKey, getViewerUrl } from '@/lib/uploads/utils/file-utils'

const logger = createLogger('FileCards')

interface FileData {
  id?: string
  name: string
  size: number
  type: string
  key: string
  url: string
  uploadedAt: string
  expiresAt: string
  storageProvider?: 's3' | 'blob' | 'local'
  bucketName?: string
}

interface FileCardsProps {
  files: FileData[]
  isExecutionFile?: boolean
  workspaceId?: string
}

interface FileCardProps {
  file: FileData
  isExecutionFile?: boolean
  workspaceId?: string
}

/**
 * Formats file size to human readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}

/**
 * Individual file card component
 */
function FileCard({ file, isExecutionFile = false, workspaceId }: FileCardProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const router = useRouter()

  const handleDownload = () => {
    if (isDownloading) return

    setIsDownloading(true)

    try {
      logger.info(`Initiating download for file: ${file.name}`)

      if (file.key.startsWith('url/')) {
        if (file.url) {
          window.open(file.url, '_blank')
          logger.info(`Opened URL-type file directly: ${file.url}`)
          return
        }
        throw new Error('URL is required for URL-type files')
      }

      let resolvedWorkspaceId = workspaceId
      if (!resolvedWorkspaceId && isExecutionFile) {
        resolvedWorkspaceId = extractWorkspaceIdFromExecutionKey(file.key) || undefined
      } else if (!resolvedWorkspaceId) {
        const segments = file.key.split('/')
        if (segments.length >= 2 && /^[a-f0-9-]{36}$/.test(segments[0])) {
          resolvedWorkspaceId = segments[0]
        }
      }

      if (isExecutionFile) {
        const serveUrl =
          file.url || `/api/files/serve/${encodeURIComponent(file.key)}?context=execution`
        window.open(serveUrl, '_blank')
        logger.info(`Opened execution file serve URL: ${serveUrl}`)
      } else {
        const viewerUrl = resolvedWorkspaceId ? getViewerUrl(file.key, resolvedWorkspaceId) : null

        if (viewerUrl) {
          router.push(viewerUrl)
          logger.info(`Navigated to viewer URL: ${viewerUrl}`)
        } else {
          logger.warn(
            `Could not construct viewer URL for file: ${file.name}, falling back to serve URL`
          )
          const serveUrl =
            file.url || `/api/files/serve/${encodeURIComponent(file.key)}?context=workspace`
          window.open(serveUrl, '_blank')
        }
      }
    } catch (error) {
      logger.error(`Failed to download file ${file.name}:`, error)
      if (file.url) {
        window.open(file.url, '_blank')
      }
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className='flex flex-col gap-[8px] rounded-[6px] bg-[var(--surface-1)] px-[10px] py-[8px]'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-[8px]'>
          <span className='truncate font-medium text-[12px] text-[var(--text-secondary)]'>
            {file.name}
          </span>
        </div>
        <span className='font-medium text-[12px] text-[var(--text-tertiary)]'>
          {formatFileSize(file.size)}
        </span>
      </div>

      <div className='flex items-center justify-between'>
        <span className='font-medium text-[11px] text-[var(--text-subtle)]'>{file.type}</span>
        <Button
          variant='ghost'
          className='!h-[20px] !px-[6px] !py-0 text-[11px]'
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className='mr-[4px] h-[10px] w-[10px] animate-spin' />
          ) : (
            <ArrowDown className='mr-[4px] h-[10px] w-[10px]' />
          )}
          {isDownloading ? 'Opening...' : 'Download'}
        </Button>
      </div>
    </div>
  )
}

/**
 * Container component for displaying workflow execution files.
 * Each file is displayed as a separate card with consistent styling.
 */
export function FileCards({ files, isExecutionFile = false, workspaceId }: FileCardsProps) {
  if (!files || files.length === 0) {
    return null
  }

  return (
    <div className='flex w-full flex-col gap-[6px] rounded-[6px] bg-[var(--surface-2)] px-[10px] py-[8px]'>
      <span className='font-medium text-[12px] text-[var(--text-tertiary)]'>
        Files ({files.length})
      </span>
      <div className='flex flex-col gap-[8px]'>
        {files.map((file, index) => (
          <FileCard
            key={file.id || `file-${index}`}
            file={file}
            isExecutionFile={isExecutionFile}
            workspaceId={workspaceId}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Single file download button (legacy export for backwards compatibility)
 */
export function FileDownload({
  file,
  isExecutionFile = false,
  className,
  workspaceId,
}: {
  file: FileData
  isExecutionFile?: boolean
  className?: string
  workspaceId?: string
}) {
  const [isDownloading, setIsDownloading] = useState(false)
  const router = useRouter()

  const handleDownload = () => {
    if (isDownloading) return

    setIsDownloading(true)

    try {
      logger.info(`Initiating download for file: ${file.name}`)

      if (file.key.startsWith('url/')) {
        if (file.url) {
          window.open(file.url, '_blank')
          logger.info(`Opened URL-type file directly: ${file.url}`)
          return
        }
        throw new Error('URL is required for URL-type files')
      }

      let resolvedWorkspaceId = workspaceId
      if (!resolvedWorkspaceId && isExecutionFile) {
        resolvedWorkspaceId = extractWorkspaceIdFromExecutionKey(file.key) || undefined
      } else if (!resolvedWorkspaceId) {
        const segments = file.key.split('/')
        if (segments.length >= 2 && /^[a-f0-9-]{36}$/.test(segments[0])) {
          resolvedWorkspaceId = segments[0]
        }
      }

      if (isExecutionFile) {
        const serveUrl =
          file.url || `/api/files/serve/${encodeURIComponent(file.key)}?context=execution`
        window.open(serveUrl, '_blank')
        logger.info(`Opened execution file serve URL: ${serveUrl}`)
      } else {
        const viewerUrl = resolvedWorkspaceId ? getViewerUrl(file.key, resolvedWorkspaceId) : null

        if (viewerUrl) {
          router.push(viewerUrl)
          logger.info(`Navigated to viewer URL: ${viewerUrl}`)
        } else {
          logger.warn(
            `Could not construct viewer URL for file: ${file.name}, falling back to serve URL`
          )
          const serveUrl =
            file.url || `/api/files/serve/${encodeURIComponent(file.key)}?context=workspace`
          window.open(serveUrl, '_blank')
        }
      }
    } catch (error) {
      logger.error(`Failed to download file ${file.name}:`, error)
      if (file.url) {
        window.open(file.url, '_blank')
      }
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      variant='ghost'
      className={`h-7 px-2 text-xs ${className}`}
      onClick={handleDownload}
      disabled={isDownloading}
    >
      {isDownloading ? (
        <Loader2 className='h-3 w-3 animate-spin' />
      ) : (
        <ArrowDown className='h-[14px] w-[14px]' />
      )}
      {isDownloading ? 'Downloading...' : 'Download'}
    </Button>
  )
}

export default FileCards
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/logs/components/log-details/components/file-download/index.ts

```typescript
export { default, FileCards, FileDownload } from './file-download'
```

--------------------------------------------------------------------------------

````
