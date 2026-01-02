---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 397
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 397 of 933)

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

---[FILE: use-message-editing.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/copilot-message/hooks/use-message-editing.ts
Signals: React

```typescript
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createLogger } from '@/lib/logs/console/logger'
import { useCopilotStore } from '@/stores/panel/copilot/store'
import type { CopilotMessage } from '@/stores/panel/copilot/types'

const logger = createLogger('useMessageEditing')

/**
 * Message truncation height in pixels
 */
const MESSAGE_TRUNCATION_HEIGHT = 60

/**
 * Delay before attaching click-outside listener to avoid immediate trigger
 */
const CLICK_OUTSIDE_DELAY = 100

/**
 * Delay before aborting when editing during stream
 */
const ABORT_DELAY = 100

interface UseMessageEditingProps {
  message: CopilotMessage
  messages: CopilotMessage[]
  isLastUserMessage: boolean
  hasCheckpoints: boolean
  onEditModeChange?: (isEditing: boolean) => void
  showCheckpointDiscardModal: boolean
  setShowCheckpointDiscardModal: (show: boolean) => void
  pendingEditRef: React.MutableRefObject<{
    message: string
    fileAttachments?: any[]
    contexts?: any[]
  } | null>
  /**
   * When true, disables the internal document click-outside handler.
   * Use when a parent component provides its own click-outside handling.
   */
  disableDocumentClickOutside?: boolean
}

/**
 * Custom hook to manage message editing functionality
 * Handles edit mode state, expansion, click handlers, and edit submission
 *
 * @param props - Message editing configuration
 * @returns Message editing state and handlers
 */
export function useMessageEditing(props: UseMessageEditingProps) {
  const {
    message,
    messages,
    isLastUserMessage,
    hasCheckpoints,
    onEditModeChange,
    showCheckpointDiscardModal,
    setShowCheckpointDiscardModal,
    pendingEditRef,
    disableDocumentClickOutside = false,
  } = props

  const [isEditMode, setIsEditMode] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [editedContent, setEditedContent] = useState(message.content)
  const [needsExpansion, setNeedsExpansion] = useState(false)

  const editContainerRef = useRef<HTMLDivElement>(null)
  const messageContentRef = useRef<HTMLDivElement>(null)
  const userInputRef = useRef<any>(null)

  const { sendMessage, isSendingMessage, abortMessage, currentChat } = useCopilotStore()

  /**
   * Checks if message content needs expansion based on height
   */
  useEffect(() => {
    if (messageContentRef.current && message.role === 'user') {
      const scrollHeight = messageContentRef.current.scrollHeight
      setNeedsExpansion(scrollHeight > MESSAGE_TRUNCATION_HEIGHT)
    }
  }, [message.content, message.role])

  /**
   * Handles entering edit mode
   */
  const handleEditMessage = useCallback(() => {
    setIsEditMode(true)
    setIsExpanded(false)
    setEditedContent(message.content)
    onEditModeChange?.(true)

    setTimeout(() => {
      userInputRef.current?.focus()
    }, 0)
  }, [message.content, onEditModeChange])

  /**
   * Handles canceling edit mode
   */
  const handleCancelEdit = useCallback(() => {
    setIsEditMode(false)
    setEditedContent(message.content)
    onEditModeChange?.(false)
  }, [message.content, onEditModeChange])

  /**
   * Handles clicking on message to enter edit mode
   */
  const handleMessageClick = useCallback(() => {
    if (needsExpansion && !isExpanded) {
      setIsExpanded(true)
    }
    handleEditMessage()
  }, [needsExpansion, isExpanded, handleEditMessage])

  /**
   * Performs the actual edit operation
   * Truncates messages after edited message and resends with same ID
   */
  const performEdit = useCallback(
    async (editedMessage: string, fileAttachments?: any[], contexts?: any[]) => {
      const currentMessages = messages
      const editIndex = currentMessages.findIndex((m) => m.id === message.id)

      if (editIndex !== -1) {
        setIsEditMode(false)
        onEditModeChange?.(false)

        const truncatedMessages = currentMessages.slice(0, editIndex)
        const updatedMessage = {
          ...message,
          content: editedMessage,
          fileAttachments: fileAttachments || message.fileAttachments,
          contexts: contexts || (message as any).contexts,
        }

        useCopilotStore.setState({ messages: [...truncatedMessages, updatedMessage] })

        if (currentChat?.id) {
          try {
            await fetch('/api/copilot/chat/update-messages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chatId: currentChat.id,
                messages: truncatedMessages.map((m) => ({
                  id: m.id,
                  role: m.role,
                  content: m.content,
                  timestamp: m.timestamp,
                  ...(m.contentBlocks && { contentBlocks: m.contentBlocks }),
                  ...(m.fileAttachments && { fileAttachments: m.fileAttachments }),
                  ...((m as any).contexts && { contexts: (m as any).contexts }),
                })),
              }),
            })
          } catch (error) {
            logger.error('Failed to update messages in DB after edit:', error)
          }
        }

        await sendMessage(editedMessage, {
          fileAttachments: fileAttachments || message.fileAttachments,
          contexts: contexts || (message as any).contexts,
          messageId: message.id,
        })
      }
    },
    [messages, message, currentChat, sendMessage, onEditModeChange]
  )

  /**
   * Handles submitting edited message
   * Checks for checkpoints and shows confirmation if needed
   */
  const handleSubmitEdit = useCallback(
    async (editedMessage: string, fileAttachments?: any[], contexts?: any[]) => {
      if (!editedMessage.trim()) return

      if (isSendingMessage) {
        abortMessage()
        await new Promise((resolve) => setTimeout(resolve, ABORT_DELAY))
      }

      if (hasCheckpoints) {
        pendingEditRef.current = { message: editedMessage, fileAttachments, contexts }
        setShowCheckpointDiscardModal(true)
        return
      }

      await performEdit(editedMessage, fileAttachments, contexts)
    },
    [
      isSendingMessage,
      hasCheckpoints,
      abortMessage,
      performEdit,
      pendingEditRef,
      setShowCheckpointDiscardModal,
    ]
  )

  /**
   * Keyboard-only exit (Esc). Click-outside is optionally handled by parent.
   */
  useEffect(() => {
    if (!isEditMode) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancelEdit()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isEditMode, handleCancelEdit])

  /**
   * Optional document-level click-outside handler (disabled when parent manages it).
   */
  useEffect(() => {
    if (!isEditMode || disableDocumentClickOutside) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (editContainerRef.current?.contains(target)) {
        return
      }
      handleCancelEdit()
    }

    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside, true)
    }, CLICK_OUTSIDE_DELAY)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [isEditMode, disableDocumentClickOutside, handleCancelEdit])

  return {
    // State
    isEditMode,
    isExpanded,
    editedContent,
    needsExpansion,

    // Refs
    editContainerRef,
    messageContentRef,
    userInputRef,

    // Operations
    setEditedContent,
    handleCancelEdit,
    handleMessageClick,
    handleSubmitEdit,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-message-feedback.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/copilot-message/hooks/use-message-feedback.ts
Signals: React

```typescript
'use client'

import { useCallback } from 'react'
import { createLogger } from '@/lib/logs/console/logger'
import { usePreviewStore } from '@/stores/panel/copilot/preview-store'
import { useCopilotStore } from '@/stores/panel/copilot/store'
import type { CopilotMessage } from '@/stores/panel/copilot/types'

const logger = createLogger('useMessageFeedback')

const WORKFLOW_TOOL_NAMES = ['edit_workflow']

interface UseMessageFeedbackProps {
  setShowUpvoteSuccess: (show: boolean) => void
  setShowDownvoteSuccess: (show: boolean) => void
}

/**
 * Custom hook to handle message feedback (upvote/downvote)
 *
 * @param message - The copilot message
 * @param messages - Array of all messages in the chat
 * @param props - Success state setters from useSuccessTimers
 * @returns Feedback management utilities
 */
export function useMessageFeedback(
  message: CopilotMessage,
  messages: CopilotMessage[],
  props: UseMessageFeedbackProps
) {
  const { setShowUpvoteSuccess, setShowDownvoteSuccess } = props
  const { currentChat, workflowId } = useCopilotStore()
  const { getPreviewByToolCall, getLatestPendingPreview } = usePreviewStore()

  /**
   * Gets the full assistant response content from message
   */
  const getFullAssistantContent = useCallback((message: CopilotMessage) => {
    if (message.content?.trim()) {
      return message.content
    }

    if (message.contentBlocks && message.contentBlocks.length > 0) {
      return message.contentBlocks
        .filter((block) => block.type === 'text')
        .map((block) => block.content)
        .join('')
    }

    return message.content || ''
  }, [])

  /**
   * Finds the last user query before this assistant message
   */
  const getLastUserQuery = useCallback(() => {
    const messageIndex = messages.findIndex((msg) => msg.id === message.id)
    if (messageIndex === -1) return null

    for (let i = messageIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        return messages[i].content
      }
    }
    return null
  }, [messages, message.id])

  /**
   * Extracts workflow YAML from workflow tool calls
   */
  const getWorkflowYaml = useCallback(() => {
    const allToolCalls = [
      ...(message.toolCalls || []),
      ...(message.contentBlocks || [])
        .filter((block) => block.type === 'tool_call')
        .map((block) => (block as any).toolCall),
    ]

    const workflowTools = allToolCalls.filter((toolCall) =>
      WORKFLOW_TOOL_NAMES.includes(toolCall?.name)
    )

    for (const toolCall of workflowTools) {
      const yamlContent =
        toolCall.result?.yamlContent ||
        toolCall.result?.data?.yamlContent ||
        toolCall.input?.yamlContent ||
        toolCall.input?.data?.yamlContent

      if (yamlContent && typeof yamlContent === 'string' && yamlContent.trim()) {
        return yamlContent
      }
    }

    if (currentChat?.previewYaml?.trim()) {
      return currentChat.previewYaml
    }

    for (const toolCall of workflowTools) {
      if (toolCall.id) {
        const preview = getPreviewByToolCall(toolCall.id)
        if (preview?.yamlContent?.trim()) {
          return preview.yamlContent
        }
      }
    }

    if (workflowTools.length > 0 && workflowId) {
      const latestPreview = getLatestPendingPreview(workflowId, currentChat?.id)
      if (latestPreview?.yamlContent?.trim()) {
        return latestPreview.yamlContent
      }
    }

    return null
  }, [message, currentChat, workflowId, getPreviewByToolCall, getLatestPendingPreview])

  /**
   * Submits feedback to the API
   */
  const submitFeedback = useCallback(
    async (isPositive: boolean) => {
      if (!currentChat?.id) {
        logger.error('No current chat ID available for feedback submission')
        return
      }

      const userQuery = getLastUserQuery()
      if (!userQuery) {
        logger.error('No user query found for feedback submission')
        return
      }

      const agentResponse = getFullAssistantContent(message)
      if (!agentResponse.trim()) {
        logger.error('No agent response content available for feedback submission')
        return
      }

      const workflowYaml = getWorkflowYaml()

      try {
        const requestBody: any = {
          chatId: currentChat.id,
          userQuery,
          agentResponse,
          isPositiveFeedback: isPositive,
        }

        if (workflowYaml) {
          requestBody.workflowYaml = workflowYaml
        }

        const response = await fetch('/api/copilot/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
          throw new Error(`Failed to submit feedback: ${response.statusText}`)
        }

        await response.json()
      } catch (error) {
        logger.error('Error submitting feedback:', error)
      }
    },
    [currentChat, getLastUserQuery, getFullAssistantContent, message, getWorkflowYaml]
  )

  /**
   * Handles upvote action
   */
  const handleUpvote = useCallback(async () => {
    setShowDownvoteSuccess(false)
    setShowUpvoteSuccess(true)
    await submitFeedback(true)
  }, [submitFeedback])

  /**
   * Handles downvote action
   */
  const handleDownvote = useCallback(async () => {
    setShowUpvoteSuccess(false)
    setShowDownvoteSuccess(true)
    await submitFeedback(false)
  }, [submitFeedback])

  return {
    handleUpvote,
    handleDownvote,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-success-timers.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/copilot-message/hooks/use-success-timers.ts
Signals: React

```typescript
'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * Duration to show success indicators (in milliseconds)
 */
const SUCCESS_DISPLAY_DURATION = 2000

/**
 * Custom hook to manage auto-hiding success states
 * Automatically hides success indicators after a set duration
 *
 * @returns Success state management utilities
 */
export function useSuccessTimers() {
  const [showCopySuccess, setShowCopySuccess] = useState(false)
  const [showUpvoteSuccess, setShowUpvoteSuccess] = useState(false)
  const [showDownvoteSuccess, setShowDownvoteSuccess] = useState(false)

  /**
   * Auto-hide copy success indicator after duration
   */
  useEffect(() => {
    if (showCopySuccess) {
      const timer = setTimeout(() => {
        setShowCopySuccess(false)
      }, SUCCESS_DISPLAY_DURATION)
      return () => clearTimeout(timer)
    }
  }, [showCopySuccess])

  /**
   * Auto-hide upvote success indicator after duration
   */
  useEffect(() => {
    if (showUpvoteSuccess) {
      const timer = setTimeout(() => {
        setShowUpvoteSuccess(false)
      }, SUCCESS_DISPLAY_DURATION)
      return () => clearTimeout(timer)
    }
  }, [showUpvoteSuccess])

  /**
   * Auto-hide downvote success indicator after duration
   */
  useEffect(() => {
    if (showDownvoteSuccess) {
      const timer = setTimeout(() => {
        setShowDownvoteSuccess(false)
      }, SUCCESS_DISPLAY_DURATION)
      return () => clearTimeout(timer)
    }
  }, [showDownvoteSuccess])

  /**
   * Handles copy to clipboard action
   * @param content - Content to copy to clipboard
   */
  const handleCopy = useCallback((content: string) => {
    navigator.clipboard.writeText(content)
    setShowCopySuccess(true)
  }, [])

  return {
    // State
    showCopySuccess,
    showUpvoteSuccess,
    showDownvoteSuccess,

    // Operations
    handleCopy,
    setShowUpvoteSuccess,
    setShowDownvoteSuccess,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: plan-mode-section.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/plan-mode-section/plan-mode-section.tsx
Signals: React

```typescript
/**
 * Plan Mode Section component with resizable markdown content display.
 * Displays markdown content in a separate section at the top of the copilot panel.
 * Follows emcn design principles with consistent spacing, typography, and color scheme.
 *
 * @example
 * ```tsx
 * import { PlanModeSection } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components'
 *
 * function CopilotPanel() {
 *   const plan = "# My Plan\n\nThis is a plan description..."
 *
 *   return (
 *     <PlanModeSection
 *       content={plan}
 *       initialHeight={200}
 *       minHeight={100}
 *       maxHeight={600}
 *     />
 *   )
 * }
 * ```
 */

'use client'

import * as React from 'react'
import { Check, GripHorizontal, Pencil, X } from 'lucide-react'
import { Button } from '@/components/emcn'
import { Trash } from '@/components/emcn/icons/trash'
import { Textarea } from '@/components/ui'
import { cn } from '@/lib/core/utils/cn'
import CopilotMarkdownRenderer from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/copilot-message/components/markdown-renderer'

/**
 * Shared border and background styles
 */
const SURFACE_5 = 'bg-[var(--surface-5)]'
const SURFACE_9 = 'bg-[var(--surface-9)]'
const BORDER_STRONG = 'border-[var(--border-strong)]'

export interface PlanModeSectionProps {
  /**
   * Markdown content to display
   */
  content: string
  /**
   * Optional class name for additional styling
   */
  className?: string
  /**
   * Initial height of the section in pixels
   * @default 180
   */
  initialHeight?: number
  /**
   * Minimum height in pixels
   * @default 80
   */
  minHeight?: number
  /**
   * Maximum height in pixels
   * @default 600
   */
  maxHeight?: number
  /**
   * Callback function when clear button is clicked
   */
  onClear?: () => void
  /**
   * Callback function when save button is clicked
   * Receives the current content as parameter
   */
  onSave?: (content: string) => void
  /**
   * Callback when Build Plan button is clicked
   */
  onBuildPlan?: () => void
}

/**
 * Plan Mode Section component for displaying markdown content with resizable height.
 * Features: pinned position, resizable height with drag handle, internal scrolling.
 */
const PlanModeSection: React.FC<PlanModeSectionProps> = ({
  content,
  className,
  initialHeight,
  minHeight = 80,
  maxHeight = 600,
  onClear,
  onSave,
  onBuildPlan,
}) => {
  // Default to 75% of max height
  const defaultHeight = initialHeight ?? Math.floor(maxHeight * 0.75)
  const [height, setHeight] = React.useState(defaultHeight)
  const [isResizing, setIsResizing] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editedContent, setEditedContent] = React.useState(content)
  const resizeStartRef = React.useRef({ y: 0, startHeight: 0 })
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Update edited content when content prop changes
  React.useEffect(() => {
    if (!isEditing) {
      setEditedContent(content)
    }
  }, [content, isEditing])

  const handleResizeStart = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsResizing(true)
      resizeStartRef.current = {
        y: e.clientY,
        startHeight: height,
      }
    },
    [height]
  )

  const handleResizeMove = React.useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return

      const deltaY = e.clientY - resizeStartRef.current.y
      const newHeight = Math.max(
        minHeight,
        Math.min(maxHeight, resizeStartRef.current.startHeight + deltaY)
      )
      setHeight(newHeight)
    },
    [isResizing, minHeight, maxHeight]
  )

  const handleResizeEnd = React.useCallback(() => {
    setIsResizing(false)
  }, [])

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove)
      document.addEventListener('mouseup', handleResizeEnd)
      document.body.style.cursor = 'ns-resize'
      document.body.style.userSelect = 'none'

      return () => {
        document.removeEventListener('mousemove', handleResizeMove)
        document.removeEventListener('mouseup', handleResizeEnd)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [isResizing, handleResizeMove, handleResizeEnd])

  const handleEdit = React.useCallback(() => {
    setIsEditing(true)
    setEditedContent(content)
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 50)
  }, [content])

  const handleSave = React.useCallback(() => {
    if (onSave && editedContent.trim() !== content.trim()) {
      onSave(editedContent.trim())
    }
    setIsEditing(false)
  }, [editedContent, content, onSave])

  const handleCancel = React.useCallback(() => {
    setEditedContent(content)
    setIsEditing(false)
  }, [content])

  if (!content || !content.trim()) {
    return null
  }

  return (
    <div
      className={cn('relative flex flex-col rounded-[4px]', SURFACE_5, className)}
      style={{ height: `${height}px` }}
    >
      {/* Header with build/edit/save/clear buttons */}
      <div className='flex flex-shrink-0 items-center justify-between border-[var(--border-strong)] border-b py-[6px] pr-[2px] pl-[12px]'>
        <span className='font-[500] text-[11px] text-[var(--text-secondary)] uppercase tracking-wide'>
          Workflow Plan
        </span>
        <div className='ml-auto flex items-center gap-[4px]'>
          {isEditing ? (
            <>
              <Button
                variant='ghost'
                className='h-[18px] w-[18px] p-0 hover:text-[var(--text-primary)]'
                onClick={handleCancel}
                aria-label='Cancel editing'
              >
                <X className='h-[11px] w-[11px]' />
              </Button>
              <Button
                variant='ghost'
                className='h-[18px] w-[18px] p-0 hover:text-[var(--text-primary)]'
                onClick={handleSave}
                aria-label='Save changes'
              >
                <Check className='h-[12px] w-[12px]' />
              </Button>
            </>
          ) : (
            <>
              {onBuildPlan && (
                <Button
                  variant='default'
                  onClick={onBuildPlan}
                  className='h-[22px] px-[10px] text-[11px]'
                  title='Build workflow from plan'
                >
                  Build Plan
                </Button>
              )}
              {onSave && (
                <Button
                  variant='ghost'
                  className='h-[18px] w-[18px] p-0 hover:text-[var(--text-primary)]'
                  onClick={handleEdit}
                  aria-label='Edit workflow plan'
                >
                  <Pencil className='h-[10px] w-[10px]' />
                </Button>
              )}
              {onClear && (
                <Button
                  variant='ghost'
                  className='h-[18px] w-[18px] p-0 hover:text-[var(--text-primary)]'
                  onClick={onClear}
                  aria-label='Clear workflow plan'
                >
                  <Trash className='h-[11px] w-[11px]' />
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Scrollable content area */}
      <div className='flex-1 overflow-y-auto overflow-x-hidden px-[12px] py-[10px]'>
        {isEditing ? (
          <Textarea
            ref={textareaRef}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className='h-full min-h-full w-full resize-none border-0 bg-transparent p-0 font-[470] font-season text-[13px] text-[var(--text-primary)] leading-[1.4rem] outline-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0'
            placeholder='Enter your workflow plan...'
          />
        ) : (
          <CopilotMarkdownRenderer content={content.trim()} />
        )}
      </div>

      {/* Resize handle */}
      <div
        className={cn(
          'group flex h-[20px] w-full cursor-ns-resize items-center justify-center border-t',
          BORDER_STRONG,
          'transition-colors hover:bg-[var(--surface-9)]',
          isResizing && SURFACE_9
        )}
        onMouseDown={handleResizeStart}
        role='separator'
        aria-orientation='horizontal'
        aria-label='Resize plan section'
      >
        <GripHorizontal className='h-3 w-3 text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-primary)]' />
      </div>
    </div>
  )
}

PlanModeSection.displayName = 'PlanModeSection'

export { PlanModeSection }
```

--------------------------------------------------------------------------------

---[FILE: todo-list.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/todo-list/todo-list.tsx
Signals: React

```typescript
'use client'

import { memo, useEffect, useState } from 'react'
import { Check, ChevronDown, ChevronRight, Loader2, X } from 'lucide-react'
import { Button } from '@/components/emcn'
import { cn } from '@/lib/core/utils/cn'

/**
 * Represents a single todo item
 */
export interface TodoItem {
  /** Unique identifier for the todo */
  id: string
  /** Todo content/description */
  content: string
  /** Whether the todo is completed */
  completed?: boolean
  /** Whether the todo is currently being executed */
  executing?: boolean
}

/**
 * Props for the TodoList component
 */
interface TodoListProps {
  /** Array of todo items to display */
  todos: TodoItem[]
  /** Callback when close button is clicked */
  onClose?: () => void
  /** Whether the list should be collapsed */
  collapsed?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Todo list component for displaying agent plan tasks
 * Shows progress bar and allows collapsing/expanding
 *
 * @param props - Component props
 * @returns Todo list UI with progress indicator
 */
export const TodoList = memo(function TodoList({
  todos,
  onClose,
  collapsed = false,
  className,
}: TodoListProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed)

  /**
   * Sync collapsed prop with internal state
   */
  useEffect(() => {
    setIsCollapsed(collapsed)
  }, [collapsed])

  if (!todos || todos.length === 0) {
    return null
  }

  const completedCount = todos.filter((todo) => todo.completed).length
  const totalCount = todos.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div
      className={cn(
        'w-full rounded-t-[4px] rounded-b-none border-[var(--surface-11)] border-x border-t bg-[var(--surface-6)] dark:bg-[var(--surface-9)]',
        className
      )}
    >
      {/* Header - always visible */}
      <div className='flex items-center justify-between px-[5.5px] py-[5px]'>
        <div className='flex items-center gap-[8px]'>
          <Button
            variant='ghost'
            onClick={() => setIsCollapsed(!isCollapsed)}
            className='!h-[14px] !w-[14px] !p-0'
          >
            {isCollapsed ? (
              <ChevronRight className='h-[14px] w-[14px]' />
            ) : (
              <ChevronDown className='h-[14px] w-[14px]' />
            )}
          </Button>
          <span className='font-medium text-[var(--text-primary)] text-xs'>Todo:</span>
          <span className='font-medium text-[var(--text-primary)] text-xs'>
            {completedCount}/{totalCount}
          </span>
        </div>

        <div className='flex flex-1 items-center gap-[8px] pl-[10px]'>
          {/* Progress bar */}
          <div className='h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-11)]'>
            <div
              className='h-full bg-[var(--brand-400)] transition-all duration-300 ease-out'
              style={{ width: `${progress}%` }}
            />
          </div>

          {onClose && (
            <Button
              variant='ghost'
              onClick={onClose}
              className='!h-[14px] !w-[14px] !p-0'
              aria-label='Close todo list'
            >
              <X className='h-[14px] w-[14px]' />
            </Button>
          )}
        </div>
      </div>

      {/* Todo items - only show when not collapsed */}
      {!isCollapsed && (
        <div className='max-h-48 overflow-y-auto'>
          {todos.map((todo, index) => (
            <div
              key={todo.id}
              className={cn(
                'flex items-start gap-2 px-3 py-1.5 transition-colors hover:bg-[var(--surface-9)]/50 dark:hover:bg-[var(--surface-11)]/50',
                index !== todos.length - 1 && 'border-[var(--surface-11)] border-b'
              )}
            >
              {todo.executing ? (
                <div className='mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center'>
                  <Loader2 className='h-3 w-3 animate-spin text-[var(--text-primary)]' />
                </div>
              ) : (
                <div
                  className={cn(
                    'mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-all',
                    todo.completed
                      ? 'border-[var(--brand-400)] bg-[var(--brand-400)]'
                      : 'border-[#707070]'
                  )}
                >
                  {todo.completed ? <Check className='h-3 w-3 text-white' strokeWidth={3} /> : null}
                </div>
              )}

              <span
                className={cn(
                  'flex-1 font-base text-[12px] leading-relaxed',
                  todo.completed ? 'text-[var(--text-muted)] line-through' : 'text-[var(--white)]'
                )}
              >
                {todo.content}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
})
```

--------------------------------------------------------------------------------

````
