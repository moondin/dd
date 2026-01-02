---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 392
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 392 of 933)

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

---[FILE: diff-controls.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/diff-controls/diff-controls.tsx
Signals: React

```typescript
import { memo, useCallback } from 'react'
import clsx from 'clsx'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/emcn'
import { createLogger } from '@/lib/logs/console/logger'
import { useCopilotStore } from '@/stores/panel/copilot/store'
import { useTerminalStore } from '@/stores/terminal'
import { useWorkflowDiffStore } from '@/stores/workflow-diff'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import { mergeSubblockState } from '@/stores/workflows/utils'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'

const logger = createLogger('DiffControls')

export const DiffControls = memo(function DiffControls() {
  const isTerminalResizing = useTerminalStore((state) => state.isResizing)
  // Optimized: Single diff store subscription
  const {
    isShowingDiff,
    isDiffReady,
    hasActiveDiff,
    toggleDiffView,
    acceptChanges,
    rejectChanges,
    baselineWorkflow,
  } = useWorkflowDiffStore(
    useCallback(
      (state) => ({
        isShowingDiff: state.isShowingDiff,
        isDiffReady: state.isDiffReady,
        hasActiveDiff: state.hasActiveDiff,
        toggleDiffView: state.toggleDiffView,
        acceptChanges: state.acceptChanges,
        rejectChanges: state.rejectChanges,
        baselineWorkflow: state.baselineWorkflow,
      }),
      []
    )
  )

  // Optimized: Single copilot store subscription for needed values
  const { updatePreviewToolCallState, clearPreviewYaml, currentChat, messages } = useCopilotStore(
    useCallback(
      (state) => ({
        updatePreviewToolCallState: state.updatePreviewToolCallState,
        clearPreviewYaml: state.clearPreviewYaml,
        currentChat: state.currentChat,
        messages: state.messages,
      }),
      []
    )
  )

  const { activeWorkflowId } = useWorkflowRegistry(
    useCallback((state) => ({ activeWorkflowId: state.activeWorkflowId }), [])
  )

  const handleToggleDiff = useCallback(() => {
    logger.info('Toggling diff view', { currentState: isShowingDiff })
    toggleDiffView()
  }, [isShowingDiff, toggleDiffView])

  const createCheckpoint = useCallback(async () => {
    if (!activeWorkflowId || !currentChat?.id) {
      logger.warn('Cannot create checkpoint: missing workflowId or chatId', {
        workflowId: activeWorkflowId,
        chatId: currentChat?.id,
      })
      return false
    }

    try {
      logger.info('Creating checkpoint before accepting changes')

      // Use the baseline workflow (state before diff) instead of current state
      // This ensures reverting to the checkpoint restores the pre-diff state
      const rawState = baselineWorkflow || useWorkflowStore.getState().getWorkflowState()

      // The baseline already has merged subblock values, but we'll merge again to be safe
      // This ensures all user inputs and subblock data are captured
      const blocksWithSubblockValues = mergeSubblockState(rawState.blocks, activeWorkflowId)

      // Filter and complete blocks to ensure all required fields are present
      // This matches the validation logic from /api/workflows/[id]/state
      const filteredBlocks = Object.entries(blocksWithSubblockValues).reduce(
        (acc, [blockId, block]) => {
          if (block.type && block.name) {
            // Ensure all required fields are present
            acc[blockId] = {
              ...block,
              id: block.id || blockId, // Ensure id field is set
              enabled: block.enabled !== undefined ? block.enabled : true,
              horizontalHandles:
                block.horizontalHandles !== undefined ? block.horizontalHandles : true,
              height: block.height !== undefined ? block.height : 90,
              subBlocks: block.subBlocks || {},
              outputs: block.outputs || {},
              data: block.data || {},
              position: block.position || { x: 0, y: 0 }, // Ensure position exists
            }
          }
          return acc
        },
        {} as typeof rawState.blocks
      )

      // Clean the workflow state - only include valid fields, exclude null/undefined values
      const workflowState = {
        blocks: filteredBlocks,
        edges: rawState.edges || [],
        loops: rawState.loops || {},
        parallels: rawState.parallels || {},
        lastSaved: rawState.lastSaved || Date.now(),
        isDeployed: rawState.isDeployed || false,
        deploymentStatuses: rawState.deploymentStatuses || {},
        // Only include deployedAt if it's a valid date, never include null/undefined
        ...(rawState.deployedAt && rawState.deployedAt instanceof Date
          ? { deployedAt: rawState.deployedAt }
          : {}),
      }

      logger.info('Prepared complete workflow state for checkpoint', {
        blocksCount: Object.keys(workflowState.blocks).length,
        edgesCount: workflowState.edges.length,
        loopsCount: Object.keys(workflowState.loops).length,
        parallelsCount: Object.keys(workflowState.parallels).length,
        hasRequiredFields: Object.values(workflowState.blocks).every(
          (block) => block.id && block.type && block.name && block.position
        ),
        hasSubblockValues: Object.values(workflowState.blocks).some((block) =>
          Object.values(block.subBlocks || {}).some(
            (subblock) => subblock.value !== null && subblock.value !== undefined
          )
        ),
        sampleBlock: Object.values(workflowState.blocks)[0],
      })

      // Find the most recent user message ID from the current chat
      const userMessages = messages.filter((msg) => msg.role === 'user')
      const lastUserMessage = userMessages[userMessages.length - 1]
      const messageId = lastUserMessage?.id

      logger.info('Creating checkpoint with message association', {
        totalMessages: messages.length,
        userMessageCount: userMessages.length,
        lastUserMessageId: messageId,
        chatId: currentChat.id,
        entireMessageArray: messages,
        allMessageIds: messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content.substring(0, 50),
        })),
        selectedUserMessages: userMessages.map((m) => ({
          id: m.id,
          content: m.content.substring(0, 100),
        })),
        allRawMessageIds: messages.map((m) => m.id),
        userMessageIds: userMessages.map((m) => m.id),
        checkpointData: {
          workflowId: activeWorkflowId,
          chatId: currentChat.id,
          messageId: messageId,
          messageFound: !!lastUserMessage,
        },
      })

      const response = await fetch('/api/copilot/checkpoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId: activeWorkflowId,
          chatId: currentChat.id,
          messageId,
          workflowState: JSON.stringify(workflowState),
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to create checkpoint: ${response.statusText}`)
      }

      const result = await response.json()
      const newCheckpoint = result.checkpoint

      logger.info('Checkpoint created successfully', {
        messageId,
        chatId: currentChat.id,
        checkpointId: newCheckpoint?.id,
      })

      // Update the copilot store immediately to show the checkpoint icon
      if (newCheckpoint && messageId) {
        const { messageCheckpoints: currentCheckpoints } = useCopilotStore.getState()
        const existingCheckpoints = currentCheckpoints[messageId] || []

        const updatedCheckpoints = {
          ...currentCheckpoints,
          [messageId]: [newCheckpoint, ...existingCheckpoints],
        }

        useCopilotStore.setState({ messageCheckpoints: updatedCheckpoints })
        logger.info('Updated copilot store with new checkpoint', {
          messageId,
          checkpointId: newCheckpoint.id,
        })
      }

      return true
    } catch (error) {
      logger.error('Failed to create checkpoint:', error)
      return false
    }
  }, [activeWorkflowId, currentChat, messages, baselineWorkflow])

  const handleAccept = useCallback(async () => {
    logger.info('Accepting proposed changes with backup protection')

    try {
      // Create a checkpoint before applying changes so it appears under the triggering user message
      await createCheckpoint().catch((error) => {
        logger.warn('Failed to create checkpoint before accept:', error)
      })

      // Clear preview YAML immediately
      await clearPreviewYaml().catch((error) => {
        logger.warn('Failed to clear preview YAML:', error)
      })

      // Resolve target toolCallId for build/edit and update to terminal success state in the copilot store
      try {
        const { toolCallsById, messages } = useCopilotStore.getState()
        let id: string | undefined
        outer: for (let mi = messages.length - 1; mi >= 0; mi--) {
          const m = messages[mi]
          if (m.role !== 'assistant' || !m.contentBlocks) continue
          const blocks = m.contentBlocks as any[]
          for (let bi = blocks.length - 1; bi >= 0; bi--) {
            const b = blocks[bi]
            if (b?.type === 'tool_call') {
              const tn = b.toolCall?.name
              if (tn === 'edit_workflow') {
                id = b.toolCall?.id
                break outer
              }
            }
          }
        }
        if (!id) {
          const candidates = Object.values(toolCallsById).filter((t) => t.name === 'edit_workflow')
          id = candidates.length ? candidates[candidates.length - 1].id : undefined
        }
        if (id) updatePreviewToolCallState('accepted', id)
      } catch {}

      // Accept changes without blocking the UI; errors will be logged by the store handler
      acceptChanges().catch((error) => {
        logger.error('Failed to accept changes (background):', error)
      })

      logger.info('Accept triggered; UI will update optimistically')
    } catch (error) {
      logger.error('Failed to accept changes:', error)

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      logger.error('Workflow update failed:', errorMessage)
      alert(`Failed to save workflow changes: ${errorMessage}`)
    }
  }, [createCheckpoint, clearPreviewYaml, updatePreviewToolCallState, acceptChanges])

  const handleReject = useCallback(() => {
    logger.info('Rejecting proposed changes (optimistic)')

    // Clear preview YAML immediately
    clearPreviewYaml().catch((error) => {
      logger.warn('Failed to clear preview YAML:', error)
    })

    // Resolve target toolCallId for build/edit and update to terminal rejected state in the copilot store
    try {
      const { toolCallsById, messages } = useCopilotStore.getState()
      let id: string | undefined
      outer: for (let mi = messages.length - 1; mi >= 0; mi--) {
        const m = messages[mi]
        if (m.role !== 'assistant' || !m.contentBlocks) continue
        const blocks = m.contentBlocks as any[]
        for (let bi = blocks.length - 1; bi >= 0; bi--) {
          const b = blocks[bi]
          if (b?.type === 'tool_call') {
            const tn = b.toolCall?.name
            if (tn === 'edit_workflow') {
              id = b.toolCall?.id
              break outer
            }
          }
        }
      }
      if (!id) {
        const candidates = Object.values(toolCallsById).filter((t) => t.name === 'edit_workflow')
        id = candidates.length ? candidates[candidates.length - 1].id : undefined
      }
      if (id) updatePreviewToolCallState('rejected', id)
    } catch {}

    // Reject changes optimistically
    rejectChanges().catch((error) => {
      logger.error('Failed to reject changes (background):', error)
    })
  }, [clearPreviewYaml, updatePreviewToolCallState, rejectChanges])

  // Don't show anything if no diff is available or diff is not ready
  if (!hasActiveDiff || !isDiffReady) {
    return null
  }

  return (
    <div
      className={clsx(
        '-translate-x-1/2 fixed left-1/2 z-30',
        !isTerminalResizing && 'transition-[bottom] duration-100 ease-out'
      )}
      style={{ bottom: 'calc(var(--terminal-height) + 40px)' }}
    >
      <div className='flex items-center gap-[6px] rounded-[10px] p-[6px]'>
        {/* Toggle (left, icon-only) */}
        <Button
          variant='active'
          onClick={handleToggleDiff}
          className='h-[30px] w-[30px] rounded-[8px] p-0'
          title={isShowingDiff ? 'View original' : 'Preview changes'}
        >
          {isShowingDiff ? (
            <Eye className='h-[14px] w-[14px]' />
          ) : (
            <EyeOff className='h-[14px] w-[14px]' />
          )}
        </Button>

        {/* Reject */}
        <Button
          variant='active'
          onClick={handleReject}
          className='h-[30px] rounded-[8px] px-3'
          title='Reject changes'
        >
          Reject
        </Button>

        {/* Accept */}
        <Button
          variant='ghost'
          onClick={handleAccept}
          className='!text-[var(--bg)] h-[30px] rounded-[8px] bg-[var(--brand-tertiary)] px-3'
          title='Accept changes'
        >
          Accept
        </Button>
      </div>
    </div>
  )
})
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/error/index.tsx
Signals: React

```typescript
'use client'

import { Component, type ReactNode, useEffect } from 'react'
import { createLogger } from '@/lib/logs/console/logger'
import { Panel } from '@/app/workspace/[workspaceId]/w/[workflowId]/components'
import { Sidebar } from '@/app/workspace/[workspaceId]/w/components/sidebar/sidebar'

const logger = createLogger('ErrorBoundary')

/**
 * Shared Error UI Component
 */
interface ErrorUIProps {
  title?: string
  message?: string
  onReset?: () => void
  fullScreen?: boolean
}

export function ErrorUI({
  title = 'Workflow Error',
  message = 'This workflow encountered an error. Please refresh the page or create a new workflow.',
  onReset,
  fullScreen = false,
}: ErrorUIProps) {
  const containerClass = fullScreen
    ? 'flex flex-col w-full h-screen bg-[var(--surface-1)]'
    : 'flex flex-col w-full h-full bg-[var(--surface-1)]'

  return (
    <div className={containerClass}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className='relative flex flex-1'>
        {/* Error message */}
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
          <div className='pointer-events-none flex flex-col items-center gap-[16px]'>
            {/* Title */}
            <h3 className='font-semibold text-[16px] text-[var(--text-primary)]'>{title}</h3>

            {/* Message */}
            <p className='max-w-sm text-center font-medium text-[14px] text-[var(--text-tertiary)]'>
              {message}
            </p>
          </div>
        </div>

        {/* Panel */}
        <Panel />
      </div>
    </div>
  )
}

/**
 * React Error Boundary Component
 * Catches React rendering errors and displays ErrorUI fallback
 */
interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorUI />
    }

    return this.props.children
  }
}

/**
 * Next.js Error Page Component
 * Renders when a workflow-specific error occurs
 */
interface NextErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export function NextError({ error, reset }: NextErrorProps) {
  useEffect(() => {
    logger.error('Workflow error:', { error })
  }, [error])

  return <ErrorUI onReset={reset} />
}

/**
 * Next.js Global Error Page Component
 * Renders for application-level errors
 */
export function NextGlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logger.error('Global workspace error:', { error })
  }, [error])

  return (
    <html lang='en'>
      <body>
        <ErrorUI
          title='Application Error'
          message='Something went wrong with the application. Please try again later.'
          onReset={reset}
          fullScreen={true}
        />
      </body>
    </html>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: note-block.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/note-block/note-block.tsx
Signals: React

```typescript
import { memo, useCallback, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import type { NodeProps } from 'reactflow'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/core/utils/cn'
import { useUserPermissionsContext } from '@/app/workspace/[workspaceId]/providers/workspace-permissions-provider'
import { useBlockVisual } from '@/app/workspace/[workspaceId]/w/[workflowId]/hooks'
import {
  BLOCK_DIMENSIONS,
  useBlockDimensions,
} from '@/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-block-dimensions'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'
import { ActionBar } from '../workflow-block/components'
import type { WorkflowBlockProps } from '../workflow-block/types'

interface NoteBlockNodeData extends WorkflowBlockProps {}

/**
 * Extract string value from subblock value object or primitive
 */
function extractFieldValue(rawValue: unknown): string | undefined {
  if (typeof rawValue === 'string') return rawValue
  if (rawValue && typeof rawValue === 'object' && 'value' in rawValue) {
    const candidate = (rawValue as { value?: unknown }).value
    return typeof candidate === 'string' ? candidate : undefined
  }
  return undefined
}

/**
 * Compact markdown renderer for note blocks with tight spacing
 */
const NoteMarkdown = memo(function NoteMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }: any) => (
          <p className='mb-2 break-words text-[#E5E5E5] text-sm'>{children}</p>
        ),
        h1: ({ children }: any) => (
          <h1 className='mt-3 mb-1 break-words font-semibold text-[#E5E5E5] text-lg first:mt-0'>
            {children}
          </h1>
        ),
        h2: ({ children }: any) => (
          <h2 className='mt-3 mb-1 break-words font-semibold text-[#E5E5E5] text-base first:mt-0'>
            {children}
          </h2>
        ),
        h3: ({ children }: any) => (
          <h3 className='mt-3 mb-1 break-words font-semibold text-[#E5E5E5] text-sm first:mt-0'>
            {children}
          </h3>
        ),
        h4: ({ children }: any) => (
          <h4 className='mt-3 mb-1 break-words font-semibold text-[#E5E5E5] text-xs first:mt-0'>
            {children}
          </h4>
        ),
        ul: ({ children }: any) => (
          <ul className='mt-1 mb-2 list-disc break-words pl-4 text-[#E5E5E5] text-sm'>
            {children}
          </ul>
        ),
        ol: ({ children }: any) => (
          <ol className='mt-1 mb-2 list-decimal break-words pl-4 text-[#E5E5E5] text-sm'>
            {children}
          </ol>
        ),
        li: ({ children }: any) => <li className='mb-0 break-words'>{children}</li>,
        code: ({ inline, className, children, ...props }: any) => {
          const isInline = inline || !className?.includes('language-')

          if (isInline) {
            return (
              <code
                {...props}
                className='whitespace-normal rounded bg-gray-200 px-1 py-0.5 font-mono text-[#F59E0B] text-xs dark:bg-[var(--surface-11)]'
              >
                {children}
              </code>
            )
          }

          return (
            <code
              {...props}
              className='block whitespace-pre-wrap break-words rounded bg-[#1A1A1A] p-2 text-[#E5E5E5] text-xs'
            >
              {children}
            </code>
          )
        },
        a: ({ href, children }: any) => (
          <a
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            className='text-[var(--brand-secondary)] underline-offset-2 hover:underline'
          >
            {children}
          </a>
        ),
        strong: ({ children }: any) => (
          <strong className='break-words font-semibold text-white'>{children}</strong>
        ),
        em: ({ children }: any) => <em className='break-words text-[#B8B8B8]'>{children}</em>,
        blockquote: ({ children }: any) => (
          <blockquote className='mt-1 mb-2 break-words border-[#F59E0B] border-l-2 pl-3 text-[#B8B8B8] italic'>
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
})

export const NoteBlock = memo(function NoteBlock({ id, data }: NodeProps<NoteBlockNodeData>) {
  const { type, config, name } = data

  const { activeWorkflowId, isEnabled, handleClick, hasRing, ringStyles } = useBlockVisual({
    blockId: id,
    data,
  })
  const storedValues = useSubBlockStore(
    useCallback(
      (state) => {
        if (!activeWorkflowId) return undefined
        return state.workflowValues[activeWorkflowId]?.[id]
      },
      [activeWorkflowId, id]
    )
  )

  const noteValues = useMemo(() => {
    if (data.isPreview && data.subBlockValues) {
      const extractedPreviewFormat = extractFieldValue(data.subBlockValues.format)
      const extractedPreviewContent = extractFieldValue(data.subBlockValues.content)
      return {
        format: typeof extractedPreviewFormat === 'string' ? extractedPreviewFormat : 'plain',
        content: typeof extractedPreviewContent === 'string' ? extractedPreviewContent : '',
      }
    }

    const format = extractFieldValue(storedValues?.format)
    const content = extractFieldValue(storedValues?.content)

    return {
      format: typeof format === 'string' ? format : 'plain',
      content: typeof content === 'string' ? content : '',
    }
  }, [data.isPreview, data.subBlockValues, storedValues])

  const content = noteValues.content ?? ''
  const isEmpty = content.trim().length === 0
  const showMarkdown = noteValues.format === 'markdown' && !isEmpty

  const userPermissions = useUserPermissionsContext()

  /**
   * Calculate deterministic dimensions based on content structure.
   * Uses fixed width and computed height to avoid ResizeObserver jitter.
   */
  useBlockDimensions({
    blockId: id,
    calculateDimensions: () => {
      const contentHeight = isEmpty
        ? BLOCK_DIMENSIONS.NOTE_MIN_CONTENT_HEIGHT
        : BLOCK_DIMENSIONS.NOTE_BASE_CONTENT_HEIGHT
      const calculatedHeight =
        BLOCK_DIMENSIONS.HEADER_HEIGHT + BLOCK_DIMENSIONS.NOTE_CONTENT_PADDING + contentHeight

      return { width: BLOCK_DIMENSIONS.FIXED_WIDTH, height: calculatedHeight }
    },
    dependencies: [isEmpty],
  })

  return (
    <div className='group relative'>
      <div
        className={cn(
          'relative z-[20] w-[250px] cursor-default select-none rounded-[8px] bg-[var(--surface-2)]'
        )}
        onClick={handleClick}
      >
        <ActionBar blockId={id} blockType={type} disabled={!userPermissions.canEdit} />

        <div
          className='note-drag-handle flex cursor-grab items-center justify-between border-[var(--divider)] border-b p-[8px] [&:active]:cursor-grabbing'
          onMouseDown={(event) => {
            event.stopPropagation()
          }}
        >
          <div className='flex min-w-0 flex-1 items-center gap-[10px]'>
            <div
              className='flex h-[24px] w-[24px] flex-shrink-0 items-center justify-center rounded-[6px]'
              style={{ background: isEnabled ? config.bgColor : 'gray' }}
            >
              <config.icon className='h-[16px] w-[16px] text-white' />
            </div>
            <span
              className={cn('font-medium text-[16px]', !isEnabled && 'truncate text-[#808080]')}
              title={name}
            >
              {name}
            </span>
          </div>
        </div>

        <div className='relative px-[12px] pt-[6px] pb-[8px]'>
          <div className='relative break-words'>
            {isEmpty ? (
              <p className='text-[#868686] text-sm italic'>Add a note...</p>
            ) : showMarkdown ? (
              <NoteMarkdown content={content} />
            ) : (
              <p className='whitespace-pre-wrap text-[#E5E5E5] text-sm leading-snug'>{content}</p>
            )}
          </div>
        </div>
        {hasRing && (
          <div
            className={cn('pointer-events-none absolute inset-0 z-40 rounded-[8px]', ringStyles)}
          />
        )}
      </div>
    </div>
  )
})
```

--------------------------------------------------------------------------------

---[FILE: notifications.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/notifications/notifications.tsx
Signals: React, Next.js

```typescript
import { memo, useCallback } from 'react'
import clsx from 'clsx'
import { X } from 'lucide-react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/emcn'
import { createLogger } from '@/lib/logs/console/logger'
import { useRegisterGlobalCommands } from '@/app/workspace/[workspaceId]/providers/global-commands-provider'
import { createCommands } from '@/app/workspace/[workspaceId]/utils/commands-utils'
import {
  type NotificationAction,
  openCopilotWithMessage,
  useNotificationStore,
} from '@/stores/notifications'
import { useTerminalStore } from '@/stores/terminal'

const logger = createLogger('Notifications')
const MAX_VISIBLE_NOTIFICATIONS = 4

/**
 * Notifications display component
 * Positioned in the bottom-right workspace area, aligned with terminal and panel spacing
 * Shows both global notifications and workflow-specific notifications
 */
export const Notifications = memo(function Notifications() {
  const params = useParams()
  const workflowId = params.workflowId as string

  const notifications = useNotificationStore((state) =>
    state.notifications.filter((n) => !n.workflowId || n.workflowId === workflowId)
  )
  const removeNotification = useNotificationStore((state) => state.removeNotification)
  const clearNotifications = useNotificationStore((state) => state.clearNotifications)
  const visibleNotifications = notifications.slice(0, MAX_VISIBLE_NOTIFICATIONS)
  const isTerminalResizing = useTerminalStore((state) => state.isResizing)

  /**
   * Executes a notification action and handles side effects.
   *
   * @param notificationId - The ID of the notification whose action is executed.
   * @param action - The action configuration to execute.
   */
  const executeAction = useCallback(
    (notificationId: string, action: NotificationAction) => {
      try {
        logger.info('Executing notification action', {
          notificationId,
          actionType: action.type,
          messageLength: action.message.length,
        })

        switch (action.type) {
          case 'copilot':
            openCopilotWithMessage(action.message)
            break
          case 'refresh':
            window.location.reload()
            break
          default:
            logger.warn('Unknown action type', { notificationId, actionType: action.type })
        }

        // Dismiss the notification after the action is triggered
        removeNotification(notificationId)
      } catch (error) {
        logger.error('Failed to execute notification action', {
          notificationId,
          actionType: action.type,
          error,
        })
      }
    },
    [removeNotification]
  )

  /**
   * Register global keyboard shortcut for clearing notifications.
   *
   * - Mod+E: Clear all notifications visible in the current workflow (including global ones).
   *
   * The command is disabled in editable contexts so it does not interfere with typing.
   */
  useRegisterGlobalCommands(() =>
    createCommands([
      {
        id: 'clear-notifications',
        handler: () => {
          clearNotifications(workflowId)
        },
        overrides: {
          allowInEditable: false,
        },
      },
    ])
  )

  if (visibleNotifications.length === 0) {
    return null
  }

  return (
    <div
      className={clsx(
        'fixed right-[calc(var(--panel-width)+16px)] bottom-[calc(var(--terminal-height)+16px)] z-30 flex flex-col items-end',
        !isTerminalResizing && 'transition-[bottom] duration-100 ease-out'
      )}
    >
      {[...visibleNotifications].reverse().map((notification, index, stacked) => {
        const depth = stacked.length - index - 1
        const xOffset = depth * 3
        const hasAction = Boolean(notification.action)

        return (
          <div
            key={notification.id}
            style={{ transform: `translateX(${xOffset}px)` }}
            className={`relative h-[78px] w-[240px] overflow-hidden rounded-[4px] border bg-[var(--surface-2)] transition-transform duration-200 ${
              index > 0 ? '-mt-[78px]' : ''
            }`}
          >
            <div className='flex h-full flex-col justify-between px-[8px] pt-[6px] pb-[8px]'>
              <div
                className={`font-medium text-[12px] leading-[16px] ${
                  hasAction ? 'line-clamp-2' : 'line-clamp-4'
                }`}
              >
                <Button
                  variant='ghost'
                  onClick={() => removeNotification(notification.id)}
                  aria-label='Dismiss notification'
                  className='!p-1.5 -m-1.5 float-right ml-[16px]'
                >
                  <X className='h-3 w-3' />
                </Button>
                {notification.level === 'error' && (
                  <span className='mr-[6px] mb-[2.75px] inline-block h-[6px] w-[6px] rounded-[2px] bg-[var(--text-error)] align-middle' />
                )}
                {notification.message}
              </div>
              {hasAction && (
                <div className='mt-[4px]'>
                  <Button
                    variant='active'
                    onClick={() => executeAction(notification.id, notification.action!)}
                    className='w-full px-[8px] py-[4px] font-medium text-[12px]'
                  >
                    {notification.action!.type === 'copilot'
                      ? 'Fix in Copilot'
                      : notification.action!.type === 'refresh'
                        ? 'Refresh'
                        : 'Take action'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
})
```

--------------------------------------------------------------------------------

````
