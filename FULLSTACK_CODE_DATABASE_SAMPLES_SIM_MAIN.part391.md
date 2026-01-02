---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 391
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 391 of 933)

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

---[FILE: chat-message.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/chat/components/chat-message/chat-message.tsx
Signals: React

```typescript
import { useMemo } from 'react'
import { StreamingIndicator } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/copilot-message/components/smooth-streaming'

interface ChatAttachment {
  id: string
  name: string
  type: string
  dataUrl: string
  size?: number
}

interface ChatMessageProps {
  message: {
    id: string
    content: any
    timestamp: string | Date
    type: 'user' | 'workflow'
    isStreaming?: boolean
    attachments?: ChatAttachment[]
  }
}

const MAX_WORD_LENGTH = 25

/**
 * Formats file size in human-readable format
 */
const formatFileSize = (bytes?: number): string => {
  if (!bytes || bytes === 0) return ''
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${Math.round((bytes / 1024 ** i) * 10) / 10} ${sizes[i]}`
}

/**
 * Opens image attachment in new window
 */
const openImageInNewWindow = (dataUrl: string, fileName: string) => {
  const newWindow = window.open('', '_blank')
  if (!newWindow) return

  newWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${fileName}</title>
        <style>
          body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #000; }
          img { max-width: 100%; max-height: 100vh; object-fit: contain; }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" alt="${fileName}" />
      </body>
    </html>
  `)
  newWindow.document.close()
}

/**
 * Component for wrapping long words to prevent overflow
 */
const WordWrap = ({ text }: { text: string }) => {
  if (!text) return null

  const parts = text.split(/(\s+)/g)

  return (
    <>
      {parts.map((part, index) => {
        if (part.match(/\s+/) || part.length <= MAX_WORD_LENGTH) {
          return <span key={index}>{part}</span>
        }

        const chunks = []
        for (let i = 0; i < part.length; i += MAX_WORD_LENGTH) {
          chunks.push(part.substring(i, i + MAX_WORD_LENGTH))
        }

        return (
          <span key={index} className='break-all'>
            {chunks.map((chunk, chunkIndex) => (
              <span key={chunkIndex}>{chunk}</span>
            ))}
          </span>
        )
      })}
    </>
  )
}

/**
 * Renders a chat message with optional file attachments
 */
export function ChatMessage({ message }: ChatMessageProps) {
  const formattedContent = useMemo(() => {
    if (typeof message.content === 'object' && message.content !== null) {
      return JSON.stringify(message.content, null, 2)
    }
    return String(message.content || '')
  }, [message.content])

  const handleAttachmentClick = (attachment: ChatAttachment) => {
    const validDataUrl = attachment.dataUrl?.trim()
    if (validDataUrl?.startsWith('data:')) {
      openImageInNewWindow(validDataUrl, attachment.name)
    }
  }

  if (message.type === 'user') {
    return (
      <div className='w-full max-w-full overflow-hidden opacity-100 transition-opacity duration-200'>
        {message.attachments && message.attachments.length > 0 && (
          <div className='mb-2 flex flex-wrap gap-[6px]'>
            {message.attachments.map((attachment) => {
              const isImage = attachment.type.startsWith('image/')
              const hasValidDataUrl =
                attachment.dataUrl?.trim() && attachment.dataUrl.startsWith('data:')

              return (
                <div
                  key={attachment.id}
                  className={`group relative flex-shrink-0 overflow-hidden rounded-[6px] bg-[var(--surface-2)] ${
                    hasValidDataUrl ? 'cursor-pointer' : ''
                  } ${isImage ? 'h-[40px] w-[40px]' : 'flex min-w-[80px] max-w-[120px] items-center justify-center px-[8px] py-[2px]'}`}
                  onClick={(e) => {
                    if (hasValidDataUrl) {
                      e.preventDefault()
                      e.stopPropagation()
                      handleAttachmentClick(attachment)
                    }
                  }}
                >
                  {isImage && hasValidDataUrl ? (
                    <img
                      src={attachment.dataUrl}
                      alt={attachment.name}
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <div className='min-w-0 flex-1'>
                      <div className='truncate font-medium text-[10px] text-[var(--white)]'>
                        {attachment.name}
                      </div>
                      {attachment.size && (
                        <div className='text-[9px] text-[var(--text-tertiary)]'>
                          {formatFileSize(attachment.size)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {formattedContent && !formattedContent.startsWith('Uploaded') && (
          <div className='rounded-[4px] border border-[var(--surface-11)] bg-[var(--surface-9)] px-[8px] py-[6px] transition-all duration-200'>
            <div className='whitespace-pre-wrap break-words font-medium font-sans text-gray-100 text-sm leading-[1.25rem]'>
              <WordWrap text={formattedContent} />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='w-full max-w-full overflow-hidden pl-[2px] opacity-100 transition-opacity duration-200'>
      <div className='whitespace-pre-wrap break-words font-[470] font-season text-[#E8E8E8] text-sm leading-[1.25rem]'>
        <WordWrap text={formattedContent} />
        {message.isStreaming && <StreamingIndicator />}
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: output-select.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/chat/components/output-select/output-select.tsx
Signals: React

```typescript
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import {
  Badge,
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverSection,
  PopoverTrigger,
} from '@/components/emcn'
import {
  extractFieldsFromSchema,
  parseResponseFormatSafely,
} from '@/lib/core/utils/response-format'
import { getBlock } from '@/blocks'
import { useWorkflowDiffStore } from '@/stores/workflow-diff/store'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'

/**
 * Props for the OutputSelect component
 */
interface OutputSelectProps {
  /** The workflow ID to fetch outputs from */
  workflowId: string | null
  /** Array of currently selected output IDs or labels */
  selectedOutputs: string[]
  /** Callback fired when output selection changes */
  onOutputSelect: (outputIds: string[]) => void
  /** Whether the select is disabled */
  disabled?: boolean
  /** Placeholder text when no outputs are selected */
  placeholder?: string
  /** Whether to emit output IDs or labels in onOutputSelect callback */
  valueMode?: 'id' | 'label'
  /**
   * When true, renders the underlying popover content inline instead of in a portal.
   * Useful when used inside dialogs or other portalled components that manage scroll locking.
   */
  disablePopoverPortal?: boolean
  /** Alignment of the popover relative to the trigger */
  align?: 'start' | 'end' | 'center'
  /** Maximum height of the popover content in pixels */
  maxHeight?: number
}

/**
 * OutputSelect component for selecting workflow block outputs
 *
 * Displays a dropdown menu of all available workflow outputs grouped by block.
 * Supports multi-selection, keyboard navigation, and shows visual indicators
 * for selected outputs.
 *
 * @param props - Component props
 * @returns The OutputSelect component
 */
export function OutputSelect({
  workflowId,
  selectedOutputs = [],
  onOutputSelect,
  disabled = false,
  placeholder = 'Select outputs',
  valueMode = 'id',
  disablePopoverPortal = false,
  align = 'start',
  maxHeight = 200,
}: OutputSelectProps) {
  const [open, setOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const triggerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const blocks = useWorkflowStore((state) => state.blocks)
  const { isShowingDiff, isDiffReady, hasActiveDiff, baselineWorkflow } = useWorkflowDiffStore()
  const subBlockValues = useSubBlockStore((state) =>
    workflowId ? state.workflowValues[workflowId] : null
  )

  /**
   * Uses diff blocks when in diff mode, otherwise main blocks
   */
  const shouldUseBaseline = hasActiveDiff && isDiffReady && !isShowingDiff && baselineWorkflow
  const workflowBlocks =
    shouldUseBaseline && baselineWorkflow ? baselineWorkflow.blocks : (blocks as any)

  /**
   * Extracts all available workflow outputs for the dropdown
   */
  const workflowOutputs = useMemo(() => {
    const outputs: Array<{
      id: string
      label: string
      blockId: string
      blockName: string
      blockType: string
      path: string
    }> = []

    if (!workflowId || !workflowBlocks || typeof workflowBlocks !== 'object') {
      return outputs
    }

    const blockArray = Object.values(workflowBlocks)
    if (blockArray.length === 0) return outputs

    blockArray.forEach((block: any) => {
      if (block.type === 'starter' || !block?.id || !block?.type) return

      const blockName =
        block.name && typeof block.name === 'string'
          ? block.name.replace(/\s+/g, '').toLowerCase()
          : `block-${block.id}`

      const blockConfig = getBlock(block.type)
      const responseFormatValue =
        shouldUseBaseline && baselineWorkflow
          ? baselineWorkflow.blocks?.[block.id]?.subBlocks?.responseFormat?.value
          : subBlockValues?.[block.id]?.responseFormat
      const responseFormat = parseResponseFormatSafely(responseFormatValue, block.id)

      let outputsToProcess: Record<string, unknown> = {}

      if (responseFormat) {
        const schemaFields = extractFieldsFromSchema(responseFormat)
        if (schemaFields.length > 0) {
          schemaFields.forEach((field) => {
            outputsToProcess[field.name] = { type: field.type }
          })
        } else {
          outputsToProcess = blockConfig?.outputs || {}
        }
      } else {
        outputsToProcess = blockConfig?.outputs || {}
      }

      if (Object.keys(outputsToProcess).length === 0) return

      const addOutput = (path: string, outputObj: unknown, prefix = '') => {
        const fullPath = prefix ? `${prefix}.${path}` : path
        const createOutput = () => ({
          id: `${block.id}_${fullPath}`,
          label: `${blockName}.${fullPath}`,
          blockId: block.id,
          blockName: block.name || `Block ${block.id}`,
          blockType: block.type,
          path: fullPath,
        })

        if (
          typeof outputObj !== 'object' ||
          outputObj === null ||
          ('type' in outputObj && typeof outputObj.type === 'string') ||
          Array.isArray(outputObj)
        ) {
          outputs.push(createOutput())
          return
        }

        Object.entries(outputObj).forEach(([key, value]) => {
          addOutput(key, value, fullPath)
        })
      }

      Object.entries(outputsToProcess).forEach(([key, value]) => {
        addOutput(key, value)
      })
    })

    return outputs
  }, [
    workflowBlocks,
    workflowId,
    isShowingDiff,
    isDiffReady,
    baselineWorkflow,
    blocks,
    subBlockValues,
    shouldUseBaseline,
  ])

  /**
   * Checks if an output is currently selected by comparing both ID and label
   * @param o - The output object to check
   * @returns True if the output is selected, false otherwise
   */
  const isSelectedValue = (o: { id: string; label: string }) =>
    selectedOutputs.includes(o.id) || selectedOutputs.includes(o.label)

  /**
   * Gets display text for selected outputs
   */
  const selectedOutputsDisplayText = useMemo(() => {
    if (!selectedOutputs || selectedOutputs.length === 0) {
      return placeholder
    }

    const validOutputs = selectedOutputs.filter((val) =>
      workflowOutputs.some((o) => o.id === val || o.label === val)
    )

    if (validOutputs.length === 0) {
      return placeholder
    }

    if (validOutputs.length === 1) {
      const output = workflowOutputs.find(
        (o) => o.id === validOutputs[0] || o.label === validOutputs[0]
      )
      return output?.label || placeholder
    }

    return `${validOutputs.length} outputs`
  }, [selectedOutputs, workflowOutputs, placeholder])

  /**
   * Groups outputs by block and sorts by distance from starter block
   */
  const groupedOutputs = useMemo(() => {
    const groups: Record<string, typeof workflowOutputs> = {}
    const blockDistances: Record<string, number> = {}
    const edges = useWorkflowStore.getState().edges

    const starterBlock = Object.values(blocks).find((block) => block.type === 'starter')
    const starterBlockId = starterBlock?.id

    if (starterBlockId) {
      const adjList: Record<string, string[]> = {}
      edges.forEach((edge) => {
        if (!adjList[edge.source]) adjList[edge.source] = []
        adjList[edge.source].push(edge.target)
      })

      const visited = new Set<string>()
      const queue: Array<[string, number]> = [[starterBlockId, 0]]

      while (queue.length > 0) {
        const [currentNodeId, distance] = queue.shift()!
        if (visited.has(currentNodeId)) continue

        visited.add(currentNodeId)
        blockDistances[currentNodeId] = distance

        const outgoingNodeIds = adjList[currentNodeId] || []
        outgoingNodeIds.forEach((targetId) => {
          queue.push([targetId, distance + 1])
        })
      }
    }

    workflowOutputs.forEach((output) => {
      if (!groups[output.blockName]) groups[output.blockName] = []
      groups[output.blockName].push(output)
    })

    return Object.entries(groups)
      .map(([blockName, outputs]) => ({
        blockName,
        outputs,
        distance: blockDistances[outputs[0]?.blockId] || 0,
      }))
      .sort((a, b) => b.distance - a.distance)
      .reduce(
        (acc, { blockName, outputs }) => {
          acc[blockName] = outputs
          return acc
        },
        {} as Record<string, typeof workflowOutputs>
      )
  }, [workflowOutputs, blocks])

  /**
   * Gets the background color for a block output based on its type
   * @param blockId - The block ID (unused but kept for future extensibility)
   * @param blockType - The type of the block
   * @returns The hex color code for the block
   */
  const getOutputColor = (blockId: string, blockType: string) => {
    const blockConfig = getBlock(blockType)
    return blockConfig?.bgColor || '#2F55FF'
  }

  /**
   * Flattened outputs for keyboard navigation
   */
  const flattenedOutputs = useMemo(() => {
    return Object.values(groupedOutputs).flat()
  }, [groupedOutputs])

  /**
   * Handles output selection by toggling the selected state
   * @param value - The output label to toggle
   */
  const handleOutputSelection = (value: string) => {
    const emittedValue =
      valueMode === 'label' ? value : workflowOutputs.find((o) => o.label === value)?.id || value
    const index = selectedOutputs.indexOf(emittedValue)

    const newSelectedOutputs =
      index === -1
        ? [...new Set([...selectedOutputs, emittedValue])]
        : selectedOutputs.filter((id) => id !== emittedValue)

    onOutputSelect(newSelectedOutputs)
  }

  /**
   * Handles keyboard navigation within the output list
   * Supports ArrowUp, ArrowDown, Enter, and Escape keys
   * @param e - Keyboard event
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (flattenedOutputs.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) => {
          const next = prev < flattenedOutputs.length - 1 ? prev + 1 : 0
          return next
        })
        break

      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => {
          const next = prev > 0 ? prev - 1 : flattenedOutputs.length - 1
          return next
        })
        break

      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < flattenedOutputs.length) {
          handleOutputSelection(flattenedOutputs[highlightedIndex].label)
        }
        break

      case 'Escape':
        e.preventDefault()
        setOpen(false)
        break
    }
  }

  /**
   * Reset highlighted index when popover opens/closes
   */
  useEffect(() => {
    if (open) {
      // Find first selected item, or start at -1
      const firstSelectedIndex = flattenedOutputs.findIndex((output) => isSelectedValue(output))
      setHighlightedIndex(firstSelectedIndex >= 0 ? firstSelectedIndex : -1)

      // Focus the content for keyboard navigation
      setTimeout(() => {
        contentRef.current?.focus()
      }, 0)
    } else {
      setHighlightedIndex(-1)
    }
  }, [open, flattenedOutputs])

  /**
   * Scroll highlighted item into view
   */
  useEffect(() => {
    if (highlightedIndex >= 0 && contentRef.current) {
      const highlightedElement = contentRef.current.querySelector(
        `[data-option-index="${highlightedIndex}"]`
      )
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [highlightedIndex])

  /**
   * Closes popover when clicking outside
   */
  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const insideTrigger = triggerRef.current?.contains(target)
      const insidePopover = popoverRef.current?.contains(target)

      if (!insideTrigger && !insidePopover) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <Popover open={open} variant='default'>
      <PopoverTrigger asChild>
        <div ref={triggerRef} className='min-w-0 max-w-full'>
          <Badge
            variant='outline'
            className='flex-none cursor-pointer whitespace-nowrap rounded-[6px]'
            title='Select outputs'
            aria-expanded={open}
            onMouseDown={(e) => {
              if (disabled || workflowOutputs.length === 0) return
              e.stopPropagation()
              setOpen((prev) => !prev)
            }}
          >
            <span className='whitespace-nowrap text-[12px]'>{selectedOutputsDisplayText}</span>
          </Badge>
        </div>
      </PopoverTrigger>
      <PopoverContent
        ref={popoverRef}
        side='bottom'
        align={align}
        sideOffset={4}
        maxHeight={maxHeight}
        maxWidth={300}
        minWidth={160}
        border
        disablePortal={disablePopoverPortal}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{ outline: 'none' }}
      >
        <div ref={contentRef} className='space-y-[2px]'>
          {Object.entries(groupedOutputs).map(([blockName, outputs]) => {
            // Calculate the starting index for this group
            const startIndex = flattenedOutputs.findIndex((o) => o.blockName === blockName)

            return (
              <div key={blockName}>
                <PopoverSection>{blockName}</PopoverSection>

                <div className='flex flex-col gap-[2px]'>
                  {outputs.map((output, localIndex) => {
                    const globalIndex = startIndex + localIndex
                    const isHighlighted = globalIndex === highlightedIndex

                    return (
                      <PopoverItem
                        key={output.id}
                        active={isSelectedValue(output) || isHighlighted}
                        data-option-index={globalIndex}
                        onClick={() => handleOutputSelection(output.label)}
                        onMouseEnter={() => setHighlightedIndex(globalIndex)}
                      >
                        <div
                          className='flex h-[14px] w-[14px] flex-shrink-0 items-center justify-center rounded'
                          style={{
                            backgroundColor: getOutputColor(output.blockId, output.blockType),
                          }}
                        >
                          <span className='font-bold text-[10px] text-white'>
                            {blockName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className='min-w-0 flex-1 truncate'>{output.path}</span>
                        {isSelectedValue(output) && <Check className='h-3 w-3 flex-shrink-0' />}
                      </PopoverItem>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/chat/hooks/index.ts

```typescript
export { type ChatFile, useChatFileUpload } from './use-chat-file-upload'
```

--------------------------------------------------------------------------------

---[FILE: use-chat-file-upload.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/chat/hooks/use-chat-file-upload.ts
Signals: React

```typescript
import { useCallback, useState } from 'react'

export interface ChatFile {
  id: string
  name: string
  size: number
  type: string
  file: File
}

const MAX_FILES = 15
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

/**
 * Hook for handling file uploads in the chat modal
 * Manages file state, validation, and drag-drop functionality
 */
export function useChatFileUpload() {
  const [chatFiles, setChatFiles] = useState<ChatFile[]>([])
  const [uploadErrors, setUploadErrors] = useState<string[]>([])
  const [dragCounter, setDragCounter] = useState(0)

  const isDragOver = dragCounter > 0

  /**
   * Validate and add files
   */
  const addFiles = useCallback(
    (files: File[]) => {
      const remainingSlots = Math.max(0, MAX_FILES - chatFiles.length)
      const candidateFiles = files.slice(0, remainingSlots)
      const errors: string[] = []
      const validNewFiles: ChatFile[] = []

      for (const file of candidateFiles) {
        // Check file size
        if (file.size > MAX_FILE_SIZE) {
          errors.push(`${file.name} is too large (max 10MB)`)
          continue
        }

        // Check for duplicates
        const isDuplicate = chatFiles.some(
          (existingFile) => existingFile.name === file.name && existingFile.size === file.size
        )
        if (isDuplicate) {
          errors.push(`${file.name} already added`)
          continue
        }

        validNewFiles.push({
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          type: file.type,
          file,
        })
      }

      if (errors.length > 0) {
        setUploadErrors(errors)
      }

      if (validNewFiles.length > 0) {
        setChatFiles([...chatFiles, ...validNewFiles])
        // Clear errors when files are successfully added
        if (errors.length === 0) {
          setUploadErrors([])
        }
      }
    },
    [chatFiles]
  )

  /**
   * Remove a file
   */
  const removeFile = useCallback((fileId: string) => {
    setChatFiles((prev) => prev.filter((f) => f.id !== fileId))
  }, [])

  /**
   * Clear all files
   */
  const clearFiles = useCallback(() => {
    setChatFiles([])
    setUploadErrors([])
  }, [])

  /**
   * Clear errors
   */
  const clearErrors = useCallback(() => {
    setUploadErrors([])
  }, [])

  /**
   * Handle file input change
   */
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files) return

      const fileArray = Array.from(files)
      addFiles(fileArray)

      // Reset input value to allow selecting the same file again
      e.target.value = ''
    },
    [addFiles]
  )

  /**
   * Handle drag enter
   */
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter((prev) => prev + 1)
  }, [])

  /**
   * Handle drag over
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  /**
   * Handle drag leave
   */
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter((prev) => Math.max(0, prev - 1))
  }, [])

  /**
   * Handle drop
   */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragCounter(0)

      const droppedFiles = Array.from(e.dataTransfer.files)
      if (droppedFiles.length > 0) {
        addFiles(droppedFiles)
      }
    },
    [addFiles]
  )

  return {
    chatFiles,
    uploadErrors,
    isDragOver,
    addFiles,
    removeFile,
    clearFiles,
    clearErrors,
    handleFileInputChange,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: command-list.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/command-list/command-list.tsx
Signals: React, Next.js

```typescript
'use client'

import { useCallback } from 'react'
import { Layout, LibraryBig, Search } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/emcn'
import { AgentIcon } from '@/components/icons'
import { cn } from '@/lib/core/utils/cn'
import { createLogger } from '@/lib/logs/console/logger'
import { useSearchModalStore } from '@/stores/search-modal/store'

const logger = createLogger('WorkflowCommandList')

/**
 * Command item data structure
 */
interface CommandItem {
  /** Display label for the command */
  label: string
  /** Icon component from lucide-react */
  icon: React.ComponentType<{ className?: string }>
  /** Keyboard shortcut keys (can be single or array for multiple keys) */
  shortcut: string | string[]
}

/**
 * Available commands list
 */
const commands: CommandItem[] = [
  {
    label: 'Templates',
    icon: Layout,
    shortcut: 'Y',
  },
  {
    label: 'New Agent',
    icon: AgentIcon,
    shortcut: ['⇧', 'A'],
  },
  {
    label: 'Logs',
    icon: LibraryBig,
    shortcut: 'L',
  },
  {
    label: 'Search Blocks',
    icon: Search,
    shortcut: 'K',
  },
]

/**
 * CommandList component that displays available commands with keyboard shortcuts
 * Centered on the screen for empty workflows
 */
export function CommandList() {
  const params = useParams()
  const router = useRouter()
  const { open: openSearchModal } = useSearchModalStore()

  const workspaceId = params.workspaceId as string | undefined

  /**
   * Handle click on a command row.
   *
   * Mirrors the behavior of the corresponding global keyboard shortcuts:
   * - Templates: navigate to workspace templates
   * - New Agent: add an agent block to the canvas
   * - Logs: navigate to workspace logs
   * - Search Blocks: open the universal search modal
   *
   * @param label - Command label that was clicked.
   */
  const handleCommandClick = useCallback(
    (label: string) => {
      try {
        switch (label) {
          case 'Templates': {
            if (!workspaceId) {
              logger.warn('No workspace ID found, cannot navigate to templates from command list')
              return
            }
            router.push(`/workspace/${workspaceId}/templates`)
            return
          }
          case 'New Agent': {
            const event = new CustomEvent('add-block-from-toolbar', {
              detail: { type: 'agent', enableTriggerMode: false },
            })
            window.dispatchEvent(event)
            return
          }
          case 'Logs': {
            if (!workspaceId) {
              logger.warn('No workspace ID found, cannot navigate to logs from command list')
              return
            }
            router.push(`/workspace/${workspaceId}/logs`)
            return
          }
          case 'Search Blocks': {
            openSearchModal()
            return
          }
          default:
            logger.warn('Unknown command label clicked in command list', { label })
        }
      } catch (error) {
        logger.error('Failed to handle command click in command list', { error, label })
      }
    },
    [router, workspaceId, openSearchModal]
  )

  /**
   * Handle drag-over events from the toolbar.
   *
   * When a toolbar item is dragged over the command list, mark the drop as valid
   * so the browser shows the appropriate drop cursor. Only reacts to toolbar
   * drags that carry the expected JSON payload.
   *
   * @param event - Drag event from the browser.
   */
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer?.types.includes('application/json')) {
      return
    }
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  /**
   * Handle drops of toolbar items onto the command list.
   *
   * This forwards the drop information (block type and cursor position)
   * to the workflow canvas via a custom event. The workflow component
   * then reuses its existing drop logic to place the block precisely
   * under the cursor, including container/subflow handling.
   *
   * @param event - Drop event from the browser.
   */
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer?.types.includes('application/json')) {
      return
    }

    event.preventDefault()

    try {
      const raw = event.dataTransfer.getData('application/json')
      if (!raw) return

      const data = JSON.parse(raw) as { type?: string; enableTriggerMode?: boolean }
      if (!data?.type || data.type === 'connectionBlock') return

      const overlayDropEvent = new CustomEvent('toolbar-drop-on-empty-workflow-overlay', {
        detail: {
          type: data.type,
          enableTriggerMode: data.enableTriggerMode ?? false,
          clientX: event.clientX,
          clientY: event.clientY,
        },
      })

      window.dispatchEvent(overlayDropEvent)
    } catch (error) {
      logger.error('Failed to handle drop on command list', { error })
    }
  }, [])

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 mb-[50px] flex items-center justify-center'
      )}
    >
      <div
        className='pointer-events-auto flex flex-col gap-[8px]'
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Logo */}
        <div className='mb-[20px] flex justify-center'>
          <Image
            src='/logo/b&w/text/b&w.svg'
            alt='Sim'
            width={99.56}
            height={48.56}
            className='opacity-70'
            style={{
              filter:
                'brightness(0) saturate(100%) invert(69%) sepia(0%) saturate(0%) hue-rotate(202deg) brightness(94%) contrast(89%)',
            }}
            priority
          />
        </div>

        {commands.map((command) => {
          const Icon = command.icon
          const shortcuts = Array.isArray(command.shortcut) ? command.shortcut : [command.shortcut]
          return (
            <div
              key={command.label}
              className='group flex cursor-pointer items-center justify-between gap-[60px]'
              onClick={() => handleCommandClick(command.label)}
            >
              {/* Left side: Icon and Label */}
              <div className='flex items-center gap-[8px]'>
                <Icon className='h-[14px] w-[14px] text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]' />
                <span className='font-medium text-[14px] text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]'>
                  {command.label}
                </span>
              </div>

              {/* Right side: Keyboard Shortcut */}
              <div className='flex items-center gap-[4px]'>
                <Button
                  className='group-hover:-translate-y-0.5 w-[26px] py-[3px] text-[12px] hover:translate-y-0 hover:text-[var(--text-tertiary)] hover:shadow-[0_2px_0_0_rgba(48,48,48,1)] group-hover:text-[var(--text-primary)] group-hover:shadow-[0_4px_0_0_rgba(48,48,48,1)]'
                  variant='3d'
                >
                  <span>⌘</span>
                </Button>
                {shortcuts.map((key, index) => (
                  <Button
                    key={index}
                    className='group-hover:-translate-y-0.5 w-[26px] py-[3px] text-[12px] hover:translate-y-0 hover:text-[var(--text-tertiary)] hover:shadow-[0_2px_0_0_rgba(48,48,48,1)] group-hover:text-[var(--text-primary)] group-hover:shadow-[0_4px_0_0_rgba(48,48,48,1)]'
                    variant='3d'
                  >
                    {key}
                  </Button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: cursors.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/cursors/cursors.tsx
Signals: React

```typescript
'use client'

import { memo, useMemo } from 'react'
import { useViewport } from 'reactflow'
import { useSession } from '@/lib/auth/auth-client'
import { getUserColor } from '@/app/workspace/[workspaceId]/w/utils/get-user-color'
import { useSocket } from '@/app/workspace/providers/socket-provider'

interface CursorPoint {
  x: number
  y: number
}

interface CursorRenderData {
  id: string
  name: string
  cursor: CursorPoint
  color: string
}

const CursorsComponent = () => {
  const { presenceUsers } = useSocket()
  const viewport = useViewport()
  const session = useSession()
  const currentUserId = session.data?.user?.id

  const cursors = useMemo<CursorRenderData[]>(() => {
    return presenceUsers
      .filter((user): user is typeof user & { cursor: CursorPoint } => Boolean(user.cursor))
      .filter((user) => user.userId !== currentUserId)
      .map((user) => ({
        id: user.socketId,
        name: user.userName?.trim() || 'Collaborator',
        cursor: user.cursor,
        color: getUserColor(user.userId),
      }))
  }, [currentUserId, presenceUsers])

  if (!cursors.length) {
    return null
  }

  return (
    <div className='pointer-events-none absolute inset-0 z-30 select-none'>
      {cursors.map(({ id, name, cursor, color }) => {
        const x = cursor.x * viewport.zoom + viewport.x
        const y = cursor.y * viewport.zoom + viewport.y

        return (
          <div
            key={id}
            className='pointer-events-none absolute'
            style={{
              transform: `translate3d(${x}px, ${y}px, 0)`,
              transition: 'transform 0.12s ease-out',
            }}
          >
            <div className='relative flex items-start'>
              {/* Filled mouse pointer cursor */}
              <svg className='-mt-[18px]' width={24} height={24} viewBox='0 0 24 24' fill={color}>
                <path d='M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z' />
              </svg>

              {/* Name tag to the right, background tightly wrapping text */}
              <div
                className='ml-[-4px] inline-flex max-w-[160px] truncate whitespace-nowrap rounded-[2px] px-1.5 py-[2px] font-medium text-[11px] text-[var(--surface-1)]'
                style={{ backgroundColor: color }}
              >
                {name}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const Cursors = memo(CursorsComponent)
Cursors.displayName = 'Cursors'
```

--------------------------------------------------------------------------------

````
