---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 401
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 401 of 933)

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

---[FILE: model-selector.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/user-input/components/model-selector/model-selector.tsx
Signals: React

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Badge,
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverItem,
  PopoverScrollArea,
} from '@/components/emcn'
import { getProviderIcon } from '@/providers/utils'
import { MODEL_OPTIONS } from '../../constants'

interface ModelSelectorProps {
  /** Currently selected model */
  selectedModel: string
  /** Whether the input is near the top of viewport (affects dropdown direction) */
  isNearTop: boolean
  /** Callback when model is selected */
  onModelSelect: (model: string) => void
}

/**
 * Gets the appropriate icon component for a model
 */
function getModelIconComponent(modelValue: string) {
  const IconComponent = getProviderIcon(modelValue)
  if (!IconComponent) {
    return null
  }
  return <IconComponent className='h-3.5 w-3.5' />
}

/**
 * Checks if a model should display the MAX badge
 */
function isMaxModel(modelValue: string): boolean {
  return modelValue === 'claude-4.5-sonnet' || modelValue === 'claude-4.5-opus'
}

/**
 * Model selector dropdown for choosing AI model.
 * Displays model icon and label.
 *
 * @param props - Component props
 * @returns Rendered model selector dropdown
 */
export function ModelSelector({ selectedModel, isNearTop, onModelSelect }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const getCollapsedModeLabel = () => {
    const model = MODEL_OPTIONS.find((m) => m.value === selectedModel)
    return model ? model.label : 'claude-4.5-sonnet'
  }

  const getModelIcon = () => {
    const IconComponent = getProviderIcon(selectedModel)
    if (!IconComponent) {
      return null
    }
    return (
      <span className='flex-shrink-0'>
        <IconComponent className='h-3 w-3' />
      </span>
    )
  }

  const handleSelect = (modelValue: string) => {
    onModelSelect(modelValue)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      // Keep popover open while resizing the panel (mousedown on resize handle)
      const target = event.target as Element | null
      if (
        target &&
        (target.closest('[aria-label="Resize panel"]') ||
          target.closest('[role="separator"]') ||
          target.closest('.cursor-ew-resize'))
      ) {
        return
      }

      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <Popover open={open} variant='default'>
      <PopoverAnchor asChild>
        <div ref={triggerRef} className='min-w-0 max-w-full'>
          <Badge
            variant='outline'
            className='min-w-0 max-w-full cursor-pointer rounded-[6px]'
            title='Choose model'
            aria-expanded={open}
            onMouseDown={(e) => {
              e.stopPropagation()
              setOpen((prev) => !prev)
            }}
          >
            {getModelIcon()}
            <span className='min-w-0 flex-1 truncate'>{getCollapsedModeLabel()}</span>
          </Badge>
        </div>
      </PopoverAnchor>
      <PopoverContent
        ref={popoverRef}
        side={isNearTop ? 'bottom' : 'top'}
        align='start'
        sideOffset={4}
        maxHeight={280}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <PopoverScrollArea className='space-y-[2px]'>
          {MODEL_OPTIONS.map((option) => (
            <PopoverItem
              key={option.value}
              active={selectedModel === option.value}
              onClick={() => handleSelect(option.value)}
            >
              {getModelIconComponent(option.value)}
              <span>{option.label}</span>
              {isMaxModel(option.value) && (
                <Badge variant='default' className='ml-auto px-[6px] py-[1px] text-[10px]'>
                  MAX
                </Badge>
              )}
            </PopoverItem>
          ))}
        </PopoverScrollArea>
      </PopoverContent>
    </Popover>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/user-input/hooks/index.ts

```typescript
export { useContextManagement } from './use-context-management'
export { useFileAttachments } from './use-file-attachments'
export { useMentionData } from './use-mention-data'
export { useMentionInsertHandlers } from './use-mention-insert-handlers'
export { useMentionKeyboard } from './use-mention-keyboard'
export { useMentionMenu } from './use-mention-menu'
export { useMentionTokens } from './use-mention-tokens'
export { useTextareaAutoResize } from './use-textarea-auto-resize'
```

--------------------------------------------------------------------------------

---[FILE: use-context-management.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/user-input/hooks/use-context-management.ts
Signals: React

```typescript
import { useCallback, useEffect, useState } from 'react'
import type { ChatContext } from '@/stores/panel/copilot/types'

interface UseContextManagementProps {
  /** Current message text */
  message: string
}

/**
 * Custom hook to manage selected contexts and their synchronization with mention tokens.
 * Automatically removes contexts when their mention tokens are removed from the message.
 *
 * @param props - Configuration object
 * @returns Context state and management functions
 */
export function useContextManagement({ message }: UseContextManagementProps) {
  const [selectedContexts, setSelectedContexts] = useState<ChatContext[]>([])

  /**
   * Adds a context to the selected contexts list, avoiding duplicates
   * Checks both by specific ID fields and by label to prevent collisions
   *
   * @param context - Context to add
   */
  const addContext = useCallback((context: ChatContext) => {
    setSelectedContexts((prev) => {
      // CRITICAL: Check label collision FIRST
      // The token system uses @label format, so we cannot have duplicate labels
      // regardless of kind or ID differences
      const exists = prev.some((c) => {
        // Primary check: label collision
        // This prevents duplicate @Label tokens which would break the overlay
        if (c.label && context.label && c.label === context.label) {
          return true
        }

        // Secondary check: exact duplicate by ID fields based on kind
        // This prevents the same entity from being added twice even with different labels
        if (c.kind === context.kind) {
          if (c.kind === 'past_chat' && 'chatId' in context && 'chatId' in c) {
            return c.chatId === (context as any).chatId
          }
          if (c.kind === 'workflow' && 'workflowId' in context && 'workflowId' in c) {
            return c.workflowId === (context as any).workflowId
          }
          if (c.kind === 'blocks' && 'blockId' in context && 'blockId' in c) {
            return c.blockId === (context as any).blockId
          }
          if (c.kind === 'workflow_block' && 'blockId' in context && 'blockId' in c) {
            return (
              c.workflowId === (context as any).workflowId && c.blockId === (context as any).blockId
            )
          }
          if (c.kind === 'knowledge' && 'knowledgeId' in context && 'knowledgeId' in c) {
            return c.knowledgeId === (context as any).knowledgeId
          }
          if (c.kind === 'templates' && 'templateId' in context && 'templateId' in c) {
            return c.templateId === (context as any).templateId
          }
          if (c.kind === 'logs' && 'executionId' in context && 'executionId' in c) {
            return c.executionId === (context as any).executionId
          }
          if (c.kind === 'docs') {
            return true // Only one docs context allowed
          }
        }

        return false
      })
      if (exists) return prev
      return [...prev, context]
    })
  }, [])

  /**
   * Removes a context from the selected contexts list
   *
   * @param contextToRemove - Context to remove
   */
  const removeContext = useCallback((contextToRemove: ChatContext) => {
    setSelectedContexts((prev) =>
      prev.filter((c) => {
        // Match by kind and specific ID fields
        if (c.kind !== contextToRemove.kind) return true

        switch (c.kind) {
          case 'past_chat':
            return (c as any).chatId !== (contextToRemove as any).chatId
          case 'workflow':
            return (c as any).workflowId !== (contextToRemove as any).workflowId
          case 'blocks':
            return (c as any).blockId !== (contextToRemove as any).blockId
          case 'workflow_block':
            return (
              (c as any).workflowId !== (contextToRemove as any).workflowId ||
              (c as any).blockId !== (contextToRemove as any).blockId
            )
          case 'knowledge':
            return (c as any).knowledgeId !== (contextToRemove as any).knowledgeId
          case 'templates':
            return (c as any).templateId !== (contextToRemove as any).templateId
          case 'logs':
            return (c as any).executionId !== (contextToRemove as any).executionId
          case 'docs':
            return false // Remove docs (only one docs context)
          default:
            return c.label !== contextToRemove.label
        }
      })
    )
  }, [])

  /**
   * Clears all selected contexts
   */
  const clearContexts = useCallback(() => {
    setSelectedContexts([])
  }, [])

  /**
   * Synchronizes selected contexts with inline @label tokens in the message.
   * Removes contexts whose labels are no longer present in the message.
   */
  useEffect(() => {
    if (!message) {
      setSelectedContexts([])
      return
    }

    setSelectedContexts((prev) => {
      if (prev.length === 0) return prev

      const presentLabels = new Set<string>()
      const labels = prev.map((c) => c.label).filter(Boolean)

      for (const label of labels) {
        const token = ` @${label} `
        if (message.includes(token)) {
          presentLabels.add(label)
        }
      }

      const filtered = prev.filter((c) => !!c.label && presentLabels.has(c.label))
      return filtered.length === prev.length ? prev : filtered
    })
  }, [message])

  return {
    selectedContexts,
    setSelectedContexts,
    addContext,
    removeContext,
    clearContexts,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-file-attachments.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/user-input/hooks/use-file-attachments.ts
Signals: React

```typescript
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('useFileAttachments')

/**
 * File size units for formatting
 */
const FILE_SIZE_UNITS = ['Bytes', 'KB', 'MB', 'GB'] as const

/**
 * Kilobyte multiplier
 */
const KILOBYTE = 1024

/**
 * Attached file structure
 */
export interface AttachedFile {
  id: string
  name: string
  size: number
  type: string
  path: string
  key?: string
  uploading: boolean
  previewUrl?: string
}

/**
 * Message file attachment structure (for API)
 */
export interface MessageFileAttachment {
  id: string
  key: string
  filename: string
  media_type: string
  size: number
}

interface UseFileAttachmentsProps {
  userId?: string
  disabled?: boolean
  isLoading?: boolean
}

/**
 * Custom hook to manage file attachments including upload, drag/drop, and preview
 * Handles S3 presigned URL uploads and preview URL generation
 *
 * @param props - File attachment configuration
 * @returns File attachment state and operations
 */
export function useFileAttachments(props: UseFileAttachmentsProps) {
  const { userId, disabled, isLoading } = props

  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * Cleanup preview URLs on unmount
   */
  useEffect(() => {
    return () => {
      attachedFiles.forEach((f) => {
        if (f.previewUrl) {
          URL.revokeObjectURL(f.previewUrl)
        }
      })
    }
  }, [])

  /**
   * Formats file size in bytes to human-readable format
   * @param bytes - File size in bytes
   * @returns Formatted string (e.g., "2.5 MB")
   */
  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(KILOBYTE))
    return `${Math.round((bytes / KILOBYTE ** i) * 100) / 100} ${FILE_SIZE_UNITS[i]}`
  }, [])

  /**
   * Determines file icon type based on media type
   * Returns a string identifier for icon type
   * @param mediaType - MIME type of the file
   * @returns Icon type identifier
   */
  const getFileIconType = useCallback((mediaType: string): 'image' | 'pdf' | 'text' | 'default' => {
    if (mediaType.startsWith('image/')) return 'image'
    if (mediaType.includes('pdf')) return 'pdf'
    if (mediaType.includes('text') || mediaType.includes('json') || mediaType.includes('xml')) {
      return 'text'
    }
    return 'default'
  }, [])

  /**
   * Processes and uploads files to S3
   * @param fileList - Files to process
   */
  const processFiles = useCallback(
    async (fileList: FileList) => {
      if (!userId) {
        logger.error('User ID not available for file upload')
        return
      }

      for (const file of Array.from(fileList)) {
        if (!file.type.startsWith('image/')) {
          logger.warn(`File ${file.name} is not an image. Only image files are allowed.`)
          continue
        }

        let previewUrl: string | undefined
        if (file.type.startsWith('image/')) {
          previewUrl = URL.createObjectURL(file)
        }

        const tempFile: AttachedFile = {
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          type: file.type,
          path: '',
          uploading: true,
          previewUrl,
        }

        setAttachedFiles((prev) => [...prev, tempFile])

        try {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('context', 'copilot')

          const uploadResponse = await fetch('/api/files/upload', {
            method: 'POST',
            body: formData,
          })

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json().catch(() => ({
              error: `Upload failed: ${uploadResponse.status}`,
            }))
            throw new Error(errorData.error || `Failed to upload file: ${uploadResponse.status}`)
          }

          const uploadData = await uploadResponse.json()

          logger.info(`File uploaded successfully: ${uploadData.fileInfo?.path || uploadData.path}`)

          setAttachedFiles((prev) =>
            prev.map((f) =>
              f.id === tempFile.id
                ? {
                    ...f,
                    path: uploadData.fileInfo?.path || uploadData.path || uploadData.url,
                    key: uploadData.fileInfo?.key || uploadData.key,
                    uploading: false,
                  }
                : f
            )
          )
        } catch (error) {
          logger.error(`File upload failed: ${error}`)
          setAttachedFiles((prev) => prev.filter((f) => f.id !== tempFile.id))
        }
      }
    },
    [userId]
  )

  /**
   * Opens file picker dialog
   */
  const handleFileSelect = useCallback(() => {
    if (disabled || isLoading) return
    fileInputRef.current?.click()
  }, [disabled, isLoading])

  /**
   * Handles file input change event
   * @param e - Change event
   */
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) return

      await processFiles(files)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [processFiles]
  )

  /**
   * Removes a file from attachments
   * @param fileId - ID of the file to remove
   */
  const removeFile = useCallback(
    (fileId: string) => {
      const file = attachedFiles.find((f) => f.id === fileId)
      if (file?.previewUrl) {
        URL.revokeObjectURL(file.previewUrl)
      }
      setAttachedFiles((prev) => prev.filter((f) => f.id !== fileId))
    },
    [attachedFiles]
  )

  /**
   * Opens file in new tab (for preview)
   * @param file - File to open
   */
  const handleFileClick = useCallback((file: AttachedFile) => {
    if (file.key) {
      window.open(file.path, '_blank')
    } else if (file.previewUrl) {
      window.open(file.previewUrl, '_blank')
    }
  }, [])

  /**
   * Handles drag enter event
   */
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter((prev) => {
      const newCount = prev + 1
      if (newCount === 1) {
        setIsDragging(true)
      }
      return newCount
    })
  }, [])

  /**
   * Handles drag leave event
   */
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter((prev) => {
      const newCount = prev - 1
      if (newCount === 0) {
        setIsDragging(false)
      }
      return newCount
    })
  }, [])

  /**
   * Handles drag over event
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  /**
   * Handles file drop event
   */
  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      setDragCounter(0)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        await processFiles(e.dataTransfer.files)
      }
    },
    [processFiles]
  )

  /**
   * Clears all attached files and cleanup preview URLs
   */
  const clearAttachedFiles = useCallback(() => {
    attachedFiles.forEach((f) => {
      if (f.previewUrl) {
        URL.revokeObjectURL(f.previewUrl)
      }
    })
    setAttachedFiles([])
  }, [attachedFiles])

  return {
    // State
    attachedFiles,
    isDragging,

    // Refs
    fileInputRef,

    // Operations
    formatFileSize,
    getFileIconType,
    handleFileSelect,
    handleFileChange,
    removeFile,
    handleFileClick,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    clearAttachedFiles,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-mention-data.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/user-input/hooks/use-mention-data.ts
Signals: React

```typescript
'use client'

import { useCallback, useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { createLogger } from '@/lib/logs/console/logger'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'

const logger = createLogger('useMentionData')

/**
 * Represents a past chat for mention suggestions
 */
export interface PastChat {
  id: string
  title: string | null
  workflowId: string | null
  updatedAt?: string
}

/**
 * Represents a workflow for mention suggestions
 */
export interface WorkflowItem {
  id: string
  name: string
  color?: string
}

/**
 * Represents a knowledge base for mention suggestions
 */
export interface KnowledgeItem {
  id: string
  name: string
}

/**
 * Represents a block for mention suggestions
 */
export interface BlockItem {
  id: string
  name: string
  iconComponent?: any
  bgColor?: string
}

/**
 * Represents a workflow block for mention suggestions
 */
export interface WorkflowBlockItem {
  id: string
  name: string
  type: string
  iconComponent?: any
  bgColor?: string
}

/**
 * Represents a template for mention suggestions
 */
export interface TemplateItem {
  id: string
  name: string
  stars: number
}

/**
 * Represents a log/execution for mention suggestions
 */
export interface LogItem {
  id: string
  executionId?: string
  level: string
  trigger: string | null
  createdAt: string
  workflowName: string
}

interface UseMentionDataProps {
  workflowId: string | null
  workspaceId: string
}

/**
 * Custom hook to fetch and manage data for mention suggestions
 * Loads data from APIs for chats, workflows, knowledge bases, blocks, templates, and logs
 *
 * @param props - Configuration including workflow and workspace IDs
 * @returns Mention data state and loading operations
 */
export function useMentionData(props: UseMentionDataProps) {
  const { workflowId, workspaceId } = props

  const [pastChats, setPastChats] = useState<PastChat[]>([])
  const [isLoadingPastChats, setIsLoadingPastChats] = useState(false)

  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeItem[]>([])
  const [isLoadingKnowledge, setIsLoadingKnowledge] = useState(false)

  const [blocksList, setBlocksList] = useState<BlockItem[]>([])
  const [isLoadingBlocks, setIsLoadingBlocks] = useState(false)

  const [templatesList, setTemplatesList] = useState<TemplateItem[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)

  const [logsList, setLogsList] = useState<LogItem[]>([])
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)

  const [workflowBlocks, setWorkflowBlocks] = useState<WorkflowBlockItem[]>([])
  const [isLoadingWorkflowBlocks, setIsLoadingWorkflowBlocks] = useState(false)

  // Only subscribe to block keys to avoid re-rendering on position updates
  const blockKeys = useWorkflowStore(
    useShallow(useCallback((state) => Object.keys(state.blocks), []))
  )

  // Use workflow registry as source of truth for workflows
  const registryWorkflows = useWorkflowRegistry((state) => state.workflows)
  const hydrationPhase = useWorkflowRegistry((state) => state.hydration.phase)
  const isLoadingWorkflows =
    hydrationPhase === 'idle' ||
    hydrationPhase === 'metadata-loading' ||
    hydrationPhase === 'state-loading'

  // Convert registry workflows to mention format, filtered by workspace and sorted
  const workflows: WorkflowItem[] = Object.values(registryWorkflows)
    .filter((w) => w.workspaceId === workspaceId)
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })
    .map((w) => ({
      id: w.id,
      name: w.name || 'Untitled Workflow',
      color: w.color,
    }))

  /**
   * Resets past chats when workflow changes
   */
  useEffect(() => {
    setPastChats([])
    setIsLoadingPastChats(false)
  }, [workflowId])

  /**
   * Syncs workflow blocks from store
   * Only re-runs when blocks are added/removed (not on position updates)
   */
  useEffect(() => {
    const syncWorkflowBlocks = async () => {
      if (!workflowId || blockKeys.length === 0) {
        setWorkflowBlocks([])
        return
      }

      try {
        // Fetch current blocks from store
        const workflowStoreBlocks = useWorkflowStore.getState().blocks

        const { registry: blockRegistry } = await import('@/blocks/registry')
        const mapped = Object.values(workflowStoreBlocks).map((b: any) => {
          const reg = (blockRegistry as any)[b.type]
          return {
            id: b.id,
            name: b.name || b.id,
            type: b.type,
            iconComponent: reg?.icon,
            bgColor: reg?.bgColor || '#6B7280',
          }
        })
        setWorkflowBlocks(mapped)
        logger.debug('Synced workflow blocks for mention menu', {
          count: mapped.length,
        })
      } catch (error) {
        logger.debug('Failed to sync workflow blocks:', error)
      }
    }

    syncWorkflowBlocks()
  }, [blockKeys, workflowId])

  /**
   * Ensures past chats are loaded
   */
  const ensurePastChatsLoaded = useCallback(async () => {
    if (isLoadingPastChats || pastChats.length > 0) return
    try {
      setIsLoadingPastChats(true)
      const resp = await fetch('/api/copilot/chats')
      if (!resp.ok) throw new Error(`Failed to load chats: ${resp.status}`)
      const data = await resp.json()
      const items = Array.isArray(data?.chats) ? data.chats : []

      const currentWorkflowChats = items.filter((c: any) => c.workflowId === workflowId)

      setPastChats(
        currentWorkflowChats.map((c: any) => ({
          id: c.id,
          title: c.title ?? null,
          workflowId: c.workflowId ?? null,
          updatedAt: c.updatedAt,
        }))
      )
    } catch {
    } finally {
      setIsLoadingPastChats(false)
    }
  }, [isLoadingPastChats, pastChats.length, workflowId])

  /**
   * Ensures workflows are loaded (now using registry store)
   */
  const ensureWorkflowsLoaded = useCallback(() => {
    // Workflows are now automatically loaded from the registry store
    // No manual fetching needed
  }, [])

  /**
   * Ensures knowledge bases are loaded
   */
  const ensureKnowledgeLoaded = useCallback(async () => {
    if (isLoadingKnowledge || knowledgeBases.length > 0) return
    try {
      setIsLoadingKnowledge(true)
      const resp = await fetch(`/api/knowledge?workspaceId=${workspaceId}`)
      if (!resp.ok) throw new Error(`Failed to load knowledge bases: ${resp.status}`)
      const data = await resp.json()
      const items = Array.isArray(data?.data) ? data.data : []
      const sorted = [...items].sort((a: any, b: any) => {
        const ta = new Date(a.updatedAt || a.createdAt || 0).getTime()
        const tb = new Date(b.updatedAt || b.createdAt || 0).getTime()
        return tb - ta
      })
      setKnowledgeBases(sorted.map((k: any) => ({ id: k.id, name: k.name || 'Untitled' })))
    } catch {
    } finally {
      setIsLoadingKnowledge(false)
    }
  }, [isLoadingKnowledge, knowledgeBases.length, workspaceId])

  /**
   * Ensures blocks are loaded
   */
  const ensureBlocksLoaded = useCallback(async () => {
    if (isLoadingBlocks || blocksList.length > 0) return
    try {
      setIsLoadingBlocks(true)
      const { getAllBlocks } = await import('@/blocks')
      const all = getAllBlocks()
      const regularBlocks = all
        .filter((b: any) => b.type !== 'starter' && !b.hideFromToolbar && b.category === 'blocks')
        .map((b: any) => ({
          id: b.type,
          name: b.name || b.type,
          iconComponent: b.icon,
          bgColor: b.bgColor,
        }))
        .sort((a: any, b: any) => a.name.localeCompare(b.name))

      const toolBlocks = all
        .filter((b: any) => b.type !== 'starter' && !b.hideFromToolbar && b.category === 'tools')
        .map((b: any) => ({
          id: b.type,
          name: b.name || b.type,
          iconComponent: b.icon,
          bgColor: b.bgColor,
        }))
        .sort((a: any, b: any) => a.name.localeCompare(b.name))

      setBlocksList([...regularBlocks, ...toolBlocks])
    } catch {
    } finally {
      setIsLoadingBlocks(false)
    }
  }, [isLoadingBlocks, blocksList.length])

  /**
   * Ensures templates are loaded
   */
  const ensureTemplatesLoaded = useCallback(async () => {
    if (isLoadingTemplates || templatesList.length > 0) return
    try {
      setIsLoadingTemplates(true)
      const resp = await fetch('/api/templates?limit=50&offset=0')
      if (!resp.ok) throw new Error(`Failed to load templates: ${resp.status}`)
      const data = await resp.json()
      const items = Array.isArray(data?.data) ? data.data : []
      const mapped = items
        .map((t: any) => ({ id: t.id, name: t.name || 'Untitled Template', stars: t.stars || 0 }))
        .sort((a: any, b: any) => b.stars - a.stars)
      setTemplatesList(mapped)
    } catch {
    } finally {
      setIsLoadingTemplates(false)
    }
  }, [isLoadingTemplates, templatesList.length])

  /**
   * Ensures logs are loaded
   */
  const ensureLogsLoaded = useCallback(async () => {
    if (isLoadingLogs || logsList.length > 0) return
    try {
      setIsLoadingLogs(true)
      const resp = await fetch(`/api/logs?workspaceId=${workspaceId}&limit=50&details=full`)
      if (!resp.ok) throw new Error(`Failed to load logs: ${resp.status}`)
      const data = await resp.json()
      const items = Array.isArray(data?.data) ? data.data : []
      const mapped = items.map((l: any) => ({
        id: l.id,
        executionId: l.executionId || l.id,
        level: l.level,
        trigger: l.trigger || null,
        createdAt: l.createdAt,
        workflowName:
          (l.workflow && (l.workflow.name || l.workflow.title)) ||
          l.workflowName ||
          'Untitled Workflow',
      }))
      setLogsList(mapped)
    } catch {
    } finally {
      setIsLoadingLogs(false)
    }
  }, [isLoadingLogs, logsList.length, workspaceId])

  /**
   * Ensures workflow blocks are loaded (synced from store)
   */
  const ensureWorkflowBlocksLoaded = useCallback(async () => {
    if (!workflowId) return
    logger.debug('ensureWorkflowBlocksLoaded called', {
      workflowId,
      storeBlocksCount: blockKeys.length,
      workflowBlocksCount: workflowBlocks.length,
    })
  }, [workflowId, blockKeys.length, workflowBlocks.length])

  return {
    // State
    pastChats,
    isLoadingPastChats,
    workflows,
    isLoadingWorkflows,
    knowledgeBases,
    isLoadingKnowledge,
    blocksList,
    isLoadingBlocks,
    templatesList,
    isLoadingTemplates,
    logsList,
    isLoadingLogs,
    workflowBlocks,
    isLoadingWorkflowBlocks,

    // Operations
    ensurePastChatsLoaded,
    ensureWorkflowsLoaded,
    ensureKnowledgeLoaded,
    ensureBlocksLoaded,
    ensureTemplatesLoaded,
    ensureLogsLoaded,
    ensureWorkflowBlocksLoaded,
  }
}
```

--------------------------------------------------------------------------------

````
