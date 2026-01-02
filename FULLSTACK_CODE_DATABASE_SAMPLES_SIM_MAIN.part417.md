---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 417
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 417 of 933)

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

---[FILE: knowledge-tag-filters.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/knowledge-tag-filters/knowledge-tag-filters.tsx
Signals: React

```typescript
'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Trash } from '@/components/emcn/icons/trash'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatDisplayText } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/formatted-text'
import {
  checkTagTrigger,
  TagDropdown,
} from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/tag-dropdown/tag-dropdown'
import { useAccessibleReferencePrefixes } from '@/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-accessible-reference-prefixes'
import type { SubBlockConfig } from '@/blocks/types'
import { useKnowledgeBaseTagDefinitions } from '@/hooks/use-knowledge-base-tag-definitions'
import { useTagSelection } from '@/hooks/use-tag-selection'
import { useSubBlockValue } from '../../hooks/use-sub-block-value'

interface TagFilter {
  id: string
  tagName: string
  tagValue: string
}

interface TagFilterRow {
  id: string
  cells: {
    tagName: string
    value: string
  }
}

interface KnowledgeTagFiltersProps {
  blockId: string
  subBlock: SubBlockConfig
  disabled?: boolean
  isPreview?: boolean
  previewValue?: string | null
}

export function KnowledgeTagFilters({
  blockId,
  subBlock,
  disabled = false,
  isPreview = false,
  previewValue,
}: KnowledgeTagFiltersProps) {
  const [storeValue, setStoreValue] = useSubBlockValue<string | null>(blockId, subBlock.id)

  // Hook for immediate tag/dropdown selections
  const emitTagSelection = useTagSelection(blockId, subBlock.id)

  // Get the knowledge base ID from other sub-blocks
  const [knowledgeBaseIdValue] = useSubBlockValue(blockId, 'knowledgeBaseId')
  const knowledgeBaseId = knowledgeBaseIdValue || null

  // Use KB tag definitions hook to get available tags
  const { tagDefinitions, isLoading } = useKnowledgeBaseTagDefinitions(knowledgeBaseId)

  // Get accessible prefixes for variable highlighting
  const accessiblePrefixes = useAccessibleReferencePrefixes(blockId)

  // State for managing tag dropdown
  const [activeTagDropdown, setActiveTagDropdown] = useState<{
    rowIndex: number
    showTags: boolean
    cursorPosition: number
    activeSourceBlockId: string | null
    element?: HTMLElement | null
  } | null>(null)

  // State for dropdown visibility - one for each row
  const [dropdownStates, setDropdownStates] = useState<Record<number, boolean>>({})

  // Parse the current value to extract filters
  const parseFilters = (filterValue: string | null): TagFilter[] => {
    if (!filterValue) return []
    try {
      return JSON.parse(filterValue)
    } catch {
      return []
    }
  }

  const currentValue = isPreview ? previewValue : storeValue
  const filters = parseFilters(currentValue || null)

  // Transform filters to table format for display
  const rows: TagFilterRow[] =
    filters.length > 0
      ? filters.map((filter) => ({
          id: filter.id,
          cells: {
            tagName: filter.tagName || '',
            value: filter.tagValue || '',
          },
        }))
      : [
          {
            id: 'empty-row-0',
            cells: { tagName: '', value: '' },
          },
        ]

  const updateFilters = (newFilters: TagFilter[]) => {
    if (isPreview) return
    const value = newFilters.length > 0 ? JSON.stringify(newFilters) : null
    setStoreValue(value)
  }

  const handleCellChange = (rowIndex: number, column: string, value: string) => {
    if (isPreview || disabled) return

    const updatedRows = [...rows].map((row, idx) => {
      if (idx === rowIndex) {
        return {
          ...row,
          cells: { ...row.cells, [column]: value },
        }
      }
      return row
    })

    // Convert back to TagFilter format - keep all rows, even empty ones
    const updatedFilters = updatedRows.map((row) => ({
      id: row.id,
      tagName: row.cells.tagName || '',
      tagValue: row.cells.value || '',
    }))

    updateFilters(updatedFilters)
  }

  const handleTagDropdownSelection = (rowIndex: number, column: string, value: string) => {
    if (isPreview || disabled) return

    const updatedRows = [...rows].map((row, idx) => {
      if (idx === rowIndex) {
        return {
          ...row,
          cells: { ...row.cells, [column]: value },
        }
      }
      return row
    })

    // Convert back to TagFilter format - keep all rows, even empty ones
    const updatedFilters = updatedRows.map((row) => ({
      id: row.id,
      tagName: row.cells.tagName || '',
      tagValue: row.cells.value || '',
    }))

    const jsonValue = updatedFilters.length > 0 ? JSON.stringify(updatedFilters) : null
    emitTagSelection(jsonValue)
  }

  const handleAddRow = () => {
    if (isPreview || disabled) return

    const newRowId = `filter-${filters.length}-${Math.random().toString(36).substr(2, 9)}`
    const newFilters = [...filters, { id: newRowId, tagName: '', tagValue: '' }]
    updateFilters(newFilters)
  }

  const handleDeleteRow = (rowIndex: number) => {
    if (isPreview || disabled || rows.length <= 1) return
    const updatedRows = rows.filter((_, idx) => idx !== rowIndex)

    const updatedFilters = updatedRows.map((row) => ({
      id: row.id,
      tagName: row.cells.tagName || '',
      tagValue: row.cells.value || '',
    }))

    updateFilters(updatedFilters)
  }

  if (isPreview) {
    const appliedFilters = filters.filter((f) => f.tagName.trim() && f.tagValue.trim()).length

    return (
      <div className='space-y-1'>
        <Label className='font-medium text-muted-foreground text-xs'>Tag Filters</Label>
        <div className='text-muted-foreground text-sm'>
          {appliedFilters > 0 ? `${appliedFilters} filter(s) applied` : 'No filters'}
        </div>
      </div>
    )
  }

  const renderHeader = () => (
    <thead>
      <tr className='border-b'>
        <th className='w-2/5 border-r px-4 py-2 text-center font-medium text-sm'>Tag Name</th>
        <th className='px-4 py-2 text-center font-medium text-sm'>Value</th>
      </tr>
    </thead>
  )

  const renderTagNameCell = (row: TagFilterRow, rowIndex: number) => {
    const cellValue = row.cells.tagName || ''
    const showDropdown = dropdownStates[rowIndex] || false

    const setShowDropdown = (show: boolean) => {
      setDropdownStates((prev) => ({ ...prev, [rowIndex]: show }))
    }

    const handleDropdownClick = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled && !isLoading) {
        if (!showDropdown) {
          setShowDropdown(true)
        }
      }
    }

    const handleFocus = () => {
      if (!disabled && !isLoading) {
        setShowDropdown(true)
      }
    }

    const handleBlur = () => {
      // Delay closing to allow dropdown selection
      setTimeout(() => setShowDropdown(false), 150)
    }

    return (
      <td className='relative border-r p-1'>
        <div className='relative w-full'>
          <Input
            value={cellValue}
            readOnly
            disabled={disabled || isLoading}
            autoComplete='off'
            className='w-full cursor-pointer border-0 text-transparent caret-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0'
            onClick={handleDropdownClick}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <div className='pointer-events-none absolute inset-0 flex items-center overflow-hidden bg-transparent px-3 text-sm'>
            <div className='whitespace-pre'>
              {formatDisplayText(cellValue || 'Select tag', {
                accessiblePrefixes,
                highlightAll: !accessiblePrefixes,
              })}
            </div>
          </div>
          {showDropdown && tagDefinitions.length > 0 && (
            <div className='absolute top-full left-0 z-[100] mt-1 w-full'>
              <div className='allow-scroll fade-in-0 zoom-in-95 animate-in rounded-md border bg-popover text-popover-foreground shadow-lg'>
                <div
                  className='allow-scroll max-h-48 overflow-y-auto p-1'
                  style={{ scrollbarWidth: 'thin' }}
                >
                  {tagDefinitions.map((tag) => (
                    <div
                      key={tag.id}
                      className='relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground'
                      onMouseDown={(e) => {
                        e.preventDefault()
                        handleCellChange(rowIndex, 'tagName', tag.displayName)
                        setShowDropdown(false)
                      }}
                    >
                      <span className='flex-1 truncate'>{tag.displayName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </td>
    )
  }

  const renderValueCell = (row: TagFilterRow, rowIndex: number) => {
    const cellValue = row.cells.value || ''

    return (
      <td className='p-1'>
        <div className='relative w-full'>
          <Input
            value={cellValue}
            onChange={(e) => {
              const newValue = e.target.value
              const cursorPosition = e.target.selectionStart ?? 0

              handleCellChange(rowIndex, 'value', newValue)

              // Check for tag trigger
              const tagTrigger = checkTagTrigger(newValue, cursorPosition)

              setActiveTagDropdown({
                rowIndex,
                showTags: tagTrigger.show,
                cursorPosition,
                activeSourceBlockId: null,
                element: e.target,
              })
            }}
            onFocus={(e) => {
              if (!disabled) {
                setActiveTagDropdown({
                  rowIndex,
                  showTags: false,
                  cursorPosition: 0,
                  activeSourceBlockId: null,
                  element: e.target,
                })
              }
            }}
            onBlur={() => {
              setTimeout(() => setActiveTagDropdown(null), 200)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setActiveTagDropdown(null)
              }
            }}
            disabled={disabled}
            autoComplete='off'
            className='w-full border-0 text-transparent caret-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0'
          />
          <div className='pointer-events-none absolute inset-0 flex items-center overflow-hidden bg-transparent px-3 text-sm'>
            <div className='whitespace-pre'>
              {formatDisplayText(cellValue, {
                accessiblePrefixes,
                highlightAll: !accessiblePrefixes,
              })}
            </div>
          </div>
        </div>
      </td>
    )
  }

  const renderDeleteButton = (rowIndex: number) => {
    const canDelete = !isPreview && !disabled

    return canDelete ? (
      <td className='w-0 p-0'>
        <Button
          variant='ghost'
          size='icon'
          className='-translate-y-1/2 absolute top-1/2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100'
          onClick={() => handleDeleteRow(rowIndex)}
        >
          <Trash className='h-4 w-4 text-muted-foreground' />
        </Button>
      </td>
    ) : null
  }

  if (isLoading) {
    return <div className='p-4 text-muted-foreground text-sm'>Loading tag definitions...</div>
  }

  return (
    <div className='relative'>
      <div className='overflow-visible rounded-md border'>
        <table className='w-full'>
          {renderHeader()}
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.id} className='group relative border-t'>
                {renderTagNameCell(row, rowIndex)}
                {renderValueCell(row, rowIndex)}
                {renderDeleteButton(rowIndex)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tag Dropdown */}
      {activeTagDropdown?.element && (
        <TagDropdown
          visible={activeTagDropdown.showTags}
          onSelect={(newValue) => {
            // Use immediate emission for tag dropdown selections
            handleTagDropdownSelection(activeTagDropdown.rowIndex, 'value', newValue)
            setActiveTagDropdown(null)
          }}
          blockId={blockId}
          activeSourceBlockId={activeTagDropdown.activeSourceBlockId}
          inputValue={rows[activeTagDropdown.rowIndex]?.cells.value || ''}
          cursorPosition={activeTagDropdown.cursorPosition}
          onClose={() => {
            setActiveTagDropdown((prev) => (prev ? { ...prev, showTags: false } : null))
          }}
          className='absolute z-[9999] mt-0'
        />
      )}

      {/* Add Filter Button */}
      {!isPreview && !disabled && (
        <div className='mt-3 flex items-center justify-between'>
          <Button variant='outline' size='sm' onClick={handleAddRow} className='h-7 px-2 text-xs'>
            <Plus className='mr-1 h-2.5 w-2.5' />
            Add Filter
          </Button>

          {/* Filter count indicator */}
          {(() => {
            const appliedFilters = filters.filter(
              (f) => f.tagName.trim() && f.tagValue.trim()
            ).length
            return (
              <div className='text-muted-foreground text-xs'>
                {appliedFilters} filter{appliedFilters !== 1 ? 's' : ''} applied
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: long-input.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/long-input/long-input.tsx
Signals: React

```typescript
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ChevronsUpDown, Wand2 } from 'lucide-react'
import { Textarea } from '@/components/emcn'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/core/utils/cn'
import { createLogger } from '@/lib/logs/console/logger'
import { formatDisplayText } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/formatted-text'
import { SubBlockInputController } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/sub-block-input-controller'
import { useSubBlockInput } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-input'
import { useSubBlockValue } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-value'
import type { WandControlHandlers } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/sub-block'
import { WandPromptBar } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/wand-prompt-bar/wand-prompt-bar'
import { useAccessibleReferencePrefixes } from '@/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-accessible-reference-prefixes'
import { useWand } from '@/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-wand'
import type { SubBlockConfig } from '@/blocks/types'

const logger = createLogger('LongInput')

/**
 * Default number of rows for the textarea
 */
const DEFAULT_ROWS = 5

/**
 * Height of each row in pixels
 */
const ROW_HEIGHT_PX = 24

/**
 * Minimum height constraint for the textarea in pixels
 */
const MIN_HEIGHT_PX = 80

/**
 * Props for the LongInput component
 */
interface LongInputProps {
  /** Placeholder text to display when empty */
  placeholder?: string
  /** Unique identifier for the block */
  blockId: string
  /** Unique identifier for the sub-block */
  subBlockId: string
  /** Configuration object for the sub-block */
  config: SubBlockConfig
  /** Number of rows to display */
  rows?: number
  /** Whether component is in preview mode */
  isPreview?: boolean
  /** Value to display in preview mode */
  previewValue?: string | null
  /** Controlled value from parent */
  value?: string
  /** Callback when value changes */
  onChange?: (value: string) => void
  /** Whether the input is disabled */
  disabled?: boolean
  /** Ref to expose wand control handlers to parent */
  wandControlRef?: React.MutableRefObject<WandControlHandlers | null>
  /** Whether to hide the internal wand button (controlled by parent) */
  hideInternalWand?: boolean
}

/**
 * Multi-line text input component with AI generation support and variable reference handling
 *
 * @remarks
 * - Supports AI-powered content generation via Wand functionality
 * - Handles drag-and-drop for connections and variable references
 * - Provides environment variable and tag autocomplete
 * - Resizable with custom drag handle
 * - Integrates with ReactFlow for zoom control
 */
export function LongInput({
  placeholder,
  blockId,
  subBlockId,
  config,
  rows,
  isPreview = false,
  previewValue,
  value: propValue,
  onChange,
  disabled,
  wandControlRef,
  hideInternalWand = false,
}: LongInputProps) {
  // Local state for immediate UI updates during streaming
  const [localContent, setLocalContent] = useState<string>('')
  const persistSubBlockValueRef = useRef<(value: string) => void>(() => {})

  // Wand functionality - always call the hook unconditionally
  const wandHook = useWand({
    wandConfig: config.wandConfig,
    currentValue: localContent,
    onStreamStart: () => {
      // Clear the content when streaming starts
      setLocalContent('')
    },
    onStreamChunk: (chunk) => {
      // Update local content with each chunk as it arrives
      setLocalContent((current) => current + chunk)
    },
    onGeneratedContent: (content) => {
      // Final content update (fallback)
      setLocalContent(content)
      if (!isPreview && !disabled) {
        persistSubBlockValueRef.current(content)
      }
    },
  })

  const [, setSubBlockValue] = useSubBlockValue<string>(blockId, subBlockId, false, {
    isStreaming: wandHook.isStreaming,
  })

  useEffect(() => {
    persistSubBlockValueRef.current = (value: string) => {
      setSubBlockValue(value)
    }
  }, [setSubBlockValue])

  // Check if wand is actually enabled
  const isWandEnabled = config.wandConfig?.enabled ?? false

  // Use the new input controller hook for shared behavior
  const ctrl = useSubBlockInput({
    blockId,
    subBlockId,
    config,
    value: propValue,
    onChange,
    isPreview,
    disabled,
    isStreaming: wandHook.isStreaming,
    onStreamingEnd: () => {
      logger.debug('Wand streaming ended, value persisted', { blockId, subBlockId })
    },
    previewValue,
  })

  const [height, setHeight] = useState(() => {
    const rowCount = rows || DEFAULT_ROWS
    return Math.max(rowCount * ROW_HEIGHT_PX, MIN_HEIGHT_PX)
  })

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isResizing = useRef(false)

  const accessiblePrefixes = useAccessibleReferencePrefixes(blockId)

  // During streaming, use local content; otherwise use the controller value
  const value = useMemo(() => {
    if (wandHook.isStreaming) return localContent
    return ctrl.valueString
  }, [wandHook.isStreaming, localContent, ctrl.valueString])

  // Base value for syncing (not including streaming)
  const baseValue = isPreview
    ? previewValue
    : propValue !== undefined
      ? propValue
      : ctrl.valueString

  // Sync local content with base value when not streaming
  useEffect(() => {
    if (!wandHook.isStreaming) {
      const baseValueString = baseValue?.toString() ?? ''
      if (baseValueString !== localContent) {
        setLocalContent(baseValueString)
      }
    }
  }, [baseValue, wandHook.isStreaming]) // Removed localContent to prevent infinite loop

  // Update height when rows prop changes
  useLayoutEffect(() => {
    const rowCount = rows || DEFAULT_ROWS
    const newHeight = Math.max(rowCount * ROW_HEIGHT_PX, MIN_HEIGHT_PX)
    setHeight(newHeight)

    if (textareaRef.current && overlayRef.current) {
      textareaRef.current.style.height = `${newHeight}px`
      overlayRef.current.style.height = `${newHeight}px`
    }
  }, [rows])

  // Sync scroll position between textarea and overlay
  const handleScroll = useCallback((e: React.UIEvent<HTMLTextAreaElement>) => {
    if (overlayRef.current) {
      overlayRef.current.scrollTop = e.currentTarget.scrollTop
      overlayRef.current.scrollLeft = e.currentTarget.scrollLeft
    }
  }, [])

  // Ensure overlay updates when content changes
  useEffect(() => {
    if (textareaRef.current && overlayRef.current) {
      // Ensure scrolling is synchronized
      overlayRef.current.scrollTop = textareaRef.current.scrollTop
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }, [value])

  // Handle resize functionality
  const startResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      isResizing.current = true

      const startY = e.clientY
      const startHeight = height

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isResizing.current) return

        const deltaY = moveEvent.clientY - startY
        const newHeight = Math.max(MIN_HEIGHT_PX, startHeight + deltaY)

        if (textareaRef.current && overlayRef.current) {
          textareaRef.current.style.height = `${newHeight}px`
          overlayRef.current.style.height = `${newHeight}px`
        }
        if (containerRef.current) {
          containerRef.current.style.height = `${newHeight}px`
        }
        // Keep React state in sync so parent layouts (e.g., Editor) update during drag
        setHeight(newHeight)
      }

      const handleMouseUp = () => {
        if (textareaRef.current) {
          const finalHeight = Number.parseInt(textareaRef.current.style.height, 10) || height
          setHeight(finalHeight)
        }

        isResizing.current = false
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [height]
  )

  // Expose wand control handlers to parent via ref
  useImperativeHandle(
    wandControlRef,
    () => ({
      onWandTrigger: (prompt: string) => {
        wandHook.generateStream({ prompt })
      },
      isWandActive: wandHook.isPromptVisible,
      isWandStreaming: wandHook.isStreaming,
    }),
    [wandHook]
  )

  return (
    <>
      {/* Wand Prompt Bar - positioned above the textarea */}
      {isWandEnabled && !hideInternalWand && (
        <WandPromptBar
          isVisible={wandHook.isPromptVisible}
          isLoading={wandHook.isLoading}
          isStreaming={wandHook.isStreaming}
          promptValue={wandHook.promptInputValue}
          onSubmit={(prompt: string) => wandHook.generateStream({ prompt })}
          onCancel={wandHook.isStreaming ? wandHook.cancelGeneration : wandHook.hidePromptInline}
          onChange={wandHook.updatePromptValue}
          placeholder={config.wandConfig?.placeholder || 'Describe what you want to generate...'}
        />
      )}

      <SubBlockInputController
        blockId={blockId}
        subBlockId={subBlockId}
        config={config}
        value={propValue}
        onChange={onChange}
        isPreview={isPreview}
        disabled={disabled}
        isStreaming={wandHook.isStreaming}
        previewValue={previewValue}
      >
        {({ ref, onChange: handleChange, onKeyDown, onDrop, onDragOver, onFocus }) => {
          const setRefs = (el: HTMLTextAreaElement | null) => {
            textareaRef.current = el
            ;(ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el
          }
          return (
            <div
              ref={containerRef}
              className={cn('group relative w-full', wandHook.isStreaming && 'streaming-effect')}
              style={{ height: `${height}px` }}
            >
              <Textarea
                ref={setRefs}
                className={cn(
                  'allow-scroll box-border min-h-full w-full resize-none text-transparent caret-foreground placeholder:text-muted-foreground/50',
                  wandHook.isStreaming && 'pointer-events-none cursor-not-allowed opacity-50'
                )}
                rows={rows ?? DEFAULT_ROWS}
                placeholder={placeholder ?? ''}
                value={value}
                onChange={handleChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void}
                onDrop={onDrop as (e: React.DragEvent<HTMLTextAreaElement>) => void}
                onDragOver={onDragOver as (e: React.DragEvent<HTMLTextAreaElement>) => void}
                onScroll={handleScroll}
                onKeyDown={onKeyDown as (e: React.KeyboardEvent<HTMLTextAreaElement>) => void}
                onFocus={onFocus}
                disabled={isPreview || disabled}
                style={{
                  fontFamily: 'inherit',
                  lineHeight: 'inherit',
                  height: `${height}px`,
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                }}
              />
              <div
                ref={overlayRef}
                className='pointer-events-none absolute inset-0 box-border overflow-auto whitespace-pre-wrap break-words border border-transparent bg-transparent px-[8px] py-[8px] font-medium font-sans text-sm'
                style={{
                  fontFamily: 'inherit',
                  lineHeight: 'inherit',
                  width: '100%',
                  height: `${height}px`,
                }}
              >
                {formatDisplayText(value, {
                  accessiblePrefixes,
                  highlightAll: !accessiblePrefixes,
                })}
              </div>

              {/* Wand Button - only show if not hidden by parent */}
              {isWandEnabled && !isPreview && !wandHook.isStreaming && !hideInternalWand && (
                <div className='absolute top-2 right-3 z-10 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={
                      wandHook.isPromptVisible
                        ? wandHook.hidePromptInline
                        : wandHook.showPromptInline
                    }
                    disabled={wandHook.isLoading || wandHook.isStreaming || disabled}
                    aria-label='Generate content with AI'
                    className='h-8 w-8 rounded-full border border-transparent bg-muted/80 text-muted-foreground shadow-sm transition-all duration-200 hover:border-primary/20 hover:bg-muted hover:text-foreground hover:shadow'
                  >
                    <Wand2 className='h-4 w-4' />
                  </Button>
                </div>
              )}

              {/* Custom resize handle */}
              {!wandHook.isStreaming && (
                <div
                  className='absolute right-1 bottom-1 flex h-4 w-4 cursor-ns-resize items-center justify-center rounded-[4px] border border-[var(--surface-11)] bg-[var(--surface-6)] dark:bg-[var(--surface-9)]'
                  onMouseDown={startResize}
                  onDragStart={(e) => {
                    e.preventDefault()
                  }}
                >
                  <ChevronsUpDown className='h-3 w-3 text-[var(--text-muted)]' />
                </div>
              )}
            </div>
          )
        }}
      </SubBlockInputController>
    </>
  )
}
```

--------------------------------------------------------------------------------

````
