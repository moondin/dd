---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 436
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 436 of 933)

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

---[FILE: variables.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/variables/variables.tsx
Signals: React

```typescript
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, X } from 'lucide-react'
import Editor from 'react-simple-code-editor'
import {
  Badge,
  Button,
  Code,
  Combobox,
  type ComboboxOption,
  calculateGutterWidth,
  getCodeEditorProps,
  highlight,
  Input,
  Label,
  languages,
} from '@/components/emcn'
import { Trash } from '@/components/emcn/icons/trash'
import { cn } from '@/lib/core/utils/cn'
import { validateName } from '@/lib/core/utils/validation'
import {
  useFloatBoundarySync,
  useFloatDrag,
  useFloatResize,
} from '@/app/workspace/[workspaceId]/w/[workflowId]/hooks'
import { useCollaborativeWorkflow } from '@/hooks/use-collaborative-workflow'
import { useVariablesStore as usePanelVariablesStore } from '@/stores/panel/variables/store'
import {
  getVariablesPosition,
  MAX_VARIABLES_HEIGHT,
  MAX_VARIABLES_WIDTH,
  MIN_VARIABLES_HEIGHT,
  MIN_VARIABLES_WIDTH,
  useVariablesStore,
} from '@/stores/variables/store'
import type { Variable } from '@/stores/variables/types'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

/**
 * Type options for variable type selection
 */
const TYPE_OPTIONS: ComboboxOption[] = [
  { label: 'Plain', value: 'plain' },
  { label: 'Number', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Object', value: 'object' },
  { label: 'Array', value: 'array' },
]

/**
 * UI constants for consistent styling and sizing
 */
const BADGE_HEIGHT = 20
const BADGE_TEXT_SIZE = 13
const ICON_SIZE = 13
const HEADER_ICON_SIZE = 16
const LINE_HEIGHT = 21
const MIN_EDITOR_HEIGHT = 120

/**
 * User-facing strings for errors, labels, and placeholders
 */
const STRINGS = {
  errors: {
    emptyName: 'Variable name cannot be empty',
    duplicateName: 'Two variables cannot have the same name',
  },
  labels: {
    name: 'Name',
    type: 'Type',
    value: 'Value',
  },
  placeholders: {
    name: 'variableName',
    number: '42',
    boolean: 'true',
    plain: 'Plain text value',
    object: '{\n  "key": "value"\n}',
    array: '[\n  1, 2, 3\n]',
  },
  emptyState: 'No variables yet',
}

/**
 * Floating Variables modal component
 *
 * Matches the visual and interaction style of the Chat modal:
 * - Draggable and resizable within the canvas bounds
 * - Persists position and size
 * - Uses emcn Input/Code/Combobox components for a consistent UI
 */
export function Variables() {
  const { activeWorkflowId } = useWorkflowRegistry()

  const { isOpen, position, width, height, setIsOpen, setPosition, setDimensions } =
    useVariablesStore()

  const { getVariablesByWorkflowId } = usePanelVariablesStore()

  const { collaborativeUpdateVariable, collaborativeAddVariable, collaborativeDeleteVariable } =
    useCollaborativeWorkflow()

  const workflowVariables = activeWorkflowId ? getVariablesByWorkflowId(activeWorkflowId) : []

  const actualPosition = useMemo(
    () => getVariablesPosition(position, width, height),
    [position, width, height]
  )

  const { handleMouseDown } = useFloatDrag({
    position: actualPosition,
    width,
    height,
    onPositionChange: setPosition,
  })

  useFloatBoundarySync({
    isOpen,
    position: actualPosition,
    width,
    height,
    onPositionChange: setPosition,
  })

  const {
    cursor: resizeCursor,
    handleMouseMove: handleResizeMouseMove,
    handleMouseLeave: handleResizeMouseLeave,
    handleMouseDown: handleResizeMouseDown,
  } = useFloatResize({
    position: actualPosition,
    width,
    height,
    onPositionChange: setPosition,
    onDimensionsChange: setDimensions,
    minWidth: MIN_VARIABLES_WIDTH,
    minHeight: MIN_VARIABLES_HEIGHT,
    maxWidth: MAX_VARIABLES_WIDTH,
    maxHeight: MAX_VARIABLES_HEIGHT,
  })

  const [collapsedById, setCollapsedById] = useState<Record<string, boolean>>({})
  const [localNames, setLocalNames] = useState<Record<string, string>>({})
  const [nameErrors, setNameErrors] = useState<Record<string, string>>({})
  const cleanupState = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<Record<string, any>>>,
      currentIds: Set<string>
    ) => {
      setter((prev) => {
        const filtered = Object.fromEntries(
          Object.entries(prev).filter(([id]) => currentIds.has(id))
        )
        return Object.keys(filtered).length !== Object.keys(prev).length ? filtered : prev
      })
    },
    []
  )

  useEffect(() => {
    const currentVariableIds = new Set(workflowVariables.map((v) => v.id))
    cleanupState(setCollapsedById, currentVariableIds)
    cleanupState(setLocalNames, currentVariableIds)
    cleanupState(setNameErrors, currentVariableIds)
  }, [workflowVariables, cleanupState])

  const toggleCollapsed = (variableId: string) => {
    setCollapsedById((prev) => ({
      ...prev,
      [variableId]: !prev[variableId],
    }))
  }

  const handleHeaderKeyDown = (e: React.KeyboardEvent, variableId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleCollapsed(variableId)
    }
  }

  const clearVariableState = (variableId: string, clearNames = true) => {
    if (clearNames) {
      setLocalNames((prev) => {
        const updated = { ...prev }
        delete updated[variableId]
        return updated
      })
    }
    setNameErrors((prev) => {
      if (!prev[variableId]) return prev
      const updated = { ...prev }
      delete updated[variableId]
      return updated
    })
  }

  const handleAddVariable = useCallback(() => {
    if (!activeWorkflowId) return
    collaborativeAddVariable({
      name: '',
      type: 'plain',
      value: '',
      workflowId: activeWorkflowId,
    })
  }, [activeWorkflowId, collaborativeAddVariable])

  const handleRemoveVariable = useCallback(
    (variableId: string) => {
      collaborativeDeleteVariable(variableId)
    },
    [collaborativeDeleteVariable]
  )

  const handleUpdateVariable = useCallback(
    (variableId: string, field: 'name' | 'value' | 'type', value: any) => {
      collaborativeUpdateVariable(variableId, field, value)
    },
    [collaborativeUpdateVariable]
  )
  const isDuplicateName = useCallback(
    (variableId: string, name: string): boolean => {
      const trimmedName = name.trim()
      return (
        !!trimmedName &&
        workflowVariables.some((v) => v.id !== variableId && v.name === trimmedName)
      )
    },
    [workflowVariables]
  )

  const handleVariableNameChange = useCallback((variableId: string, newName: string) => {
    const validatedName = validateName(newName)
    setLocalNames((prev) => ({
      ...prev,
      [variableId]: validatedName,
    }))
    clearVariableState(variableId, false)
  }, [])

  const handleVariableNameBlur = useCallback(
    (variableId: string) => {
      const localName = localNames[variableId]
      if (localName === undefined) return

      const trimmedName = localName.trim()
      if (!trimmedName) {
        setNameErrors((prev) => ({
          ...prev,
          [variableId]: STRINGS.errors.emptyName,
        }))
        return
      }

      if (isDuplicateName(variableId, trimmedName)) {
        setNameErrors((prev) => ({
          ...prev,
          [variableId]: STRINGS.errors.duplicateName,
        }))
        return
      }

      collaborativeUpdateVariable(variableId, 'name', trimmedName)
      clearVariableState(variableId)
    },
    [localNames, isDuplicateName, collaborativeUpdateVariable]
  )

  const handleVariableNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const renderVariableHeader = useCallback(
    (variable: Variable, index: number) => {
      const isCollapsed = collapsedById[variable.id] ?? false
      return (
        <div
          className='flex cursor-pointer items-center justify-between bg-transparent px-[10px] py-[5px]'
          onClick={() => toggleCollapsed(variable.id)}
          onKeyDown={(e) => handleHeaderKeyDown(e, variable.id)}
          role='button'
          tabIndex={0}
          aria-expanded={!isCollapsed}
          aria-controls={`variable-content-${variable.id}`}
        >
          <div className='flex min-w-0 flex-1 items-center gap-[8px]'>
            <span className='block truncate font-medium text-[14px] text-[var(--text-tertiary)]'>
              {variable.name || `Variable ${index + 1}`}
            </span>
            {variable.name && (
              <Badge style={{ height: `${BADGE_HEIGHT}px`, fontSize: `${BADGE_TEXT_SIZE}px` }}>
                {variable.type}
              </Badge>
            )}
          </div>
          <Button
            variant='ghost'
            onClick={(e) => {
              e.stopPropagation()
              handleRemoveVariable(variable.id)
            }}
            className='h-auto p-0 text-[var(--text-error)] hover:text-[var(--text-error)]'
            aria-label={`Delete ${variable.name || `variable ${index + 1}`}`}
          >
            <Trash style={{ width: `${ICON_SIZE}px`, height: `${ICON_SIZE}px` }} />
            <span className='sr-only'>Delete Variable</span>
          </Button>
        </div>
      )
    },
    [collapsedById, toggleCollapsed, handleRemoveVariable]
  )

  /**
   * Renders the value input based on variable type.
   * Memoized with useCallback to prevent unnecessary re-renders.
   */
  const renderValueInput = useCallback(
    (variable: Variable) => {
      const variableValue =
        variable.value === ''
          ? ''
          : typeof variable.value === 'string'
            ? variable.value
            : JSON.stringify(variable.value)

      if (variable.type === 'object' || variable.type === 'array') {
        const lineCount = variableValue.split('\n').length
        const gutterWidth = calculateGutterWidth(lineCount)
        const placeholder =
          variable.type === 'object' ? STRINGS.placeholders.object : STRINGS.placeholders.array

        const renderLineNumbers = () => {
          return Array.from({ length: lineCount }, (_, i) => (
            <div
              key={i}
              className='font-medium font-mono text-[var(--text-muted)] text-xs'
              style={{ height: `${LINE_HEIGHT}px`, lineHeight: `${LINE_HEIGHT}px` }}
            >
              {i + 1}
            </div>
          ))
        }

        return (
          <Code.Container style={{ minHeight: `${MIN_EDITOR_HEIGHT}px` }}>
            <Code.Gutter width={gutterWidth}>{renderLineNumbers()}</Code.Gutter>
            <Code.Content paddingLeft={`${gutterWidth}px`}>
              <Code.Placeholder gutterWidth={gutterWidth} show={variableValue.length === 0}>
                {placeholder}
              </Code.Placeholder>
              <Editor
                value={variableValue}
                onValueChange={(newValue) => handleUpdateVariable(variable.id, 'value', newValue)}
                highlight={(code) => highlight(code, languages.json, 'json')}
                {...getCodeEditorProps()}
              />
            </Code.Content>
          </Code.Container>
        )
      }

      return (
        <Input
          name='value'
          autoComplete='off'
          value={variableValue}
          onChange={(e) => handleUpdateVariable(variable.id, 'value', e.target.value)}
          placeholder={
            variable.type === 'number'
              ? STRINGS.placeholders.number
              : variable.type === 'boolean'
                ? STRINGS.placeholders.boolean
                : STRINGS.placeholders.plain
          }
        />
      )
    },
    [handleUpdateVariable]
  )

  if (!isOpen) return null

  return (
    <div
      className='fixed z-30 flex flex-col overflow-hidden rounded-[6px] border border-[var(--border)] bg-[var(--surface-1)] px-[10px] pt-[2px] pb-[8px]'
      style={{
        left: `${actualPosition.x}px`,
        top: `${actualPosition.y}px`,
        width: `${width}px`,
        height: `${height}px`,
        cursor: resizeCursor || undefined,
      }}
      onMouseMove={handleResizeMouseMove}
      onMouseLeave={handleResizeMouseLeave}
      onMouseDown={handleResizeMouseDown}
    >
      {/* Header (drag handle) */}
      <div
        className='flex h-[32px] flex-shrink-0 cursor-grab items-center justify-between bg-[var(--surface-1)] p-0 active:cursor-grabbing'
        onMouseDown={handleMouseDown}
      >
        <div className='flex items-center'>
          <span className='flex-shrink-0 font-medium text-[14px] text-[var(--text-primary)]'>
            Variables
          </span>
        </div>
        <div className='flex items-center gap-[8px]'>
          <Button
            variant='ghost'
            className='!p-1.5 -m-1.5'
            onClick={(e) => {
              e.stopPropagation()
              handleAddVariable()
            }}
            aria-label='Add new variable'
          >
            <Plus style={{ width: `${HEADER_ICON_SIZE}px`, height: `${HEADER_ICON_SIZE}px` }} />
          </Button>
          <Button
            variant='ghost'
            className='!p-1.5 -m-1.5'
            onClick={handleClose}
            aria-label='Close variables panel'
          >
            <X style={{ width: `${HEADER_ICON_SIZE}px`, height: `${HEADER_ICON_SIZE}px` }} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className='flex flex-1 flex-col overflow-hidden pt-[8px]'>
        {workflowVariables.length === 0 ? (
          <div className='flex h-full items-center justify-center text-[#8D8D8D] text-[13px]'>
            {STRINGS.emptyState}
          </div>
        ) : (
          <div className='h-full overflow-y-auto overflow-x-hidden'>
            <div className='w-full max-w-full space-y-[8px] overflow-hidden'>
              {workflowVariables.map((variable, index) => (
                <div
                  key={variable.id}
                  className={cn(
                    'rounded-[4px] border border-[var(--border-strong)] bg-[var(--surface-1)]',
                    (collapsedById[variable.id] ?? false) ? 'overflow-hidden' : 'overflow-visible'
                  )}
                >
                  {renderVariableHeader(variable, index)}

                  {!(collapsedById[variable.id] ?? false) && (
                    <div
                      id={`variable-content-${variable.id}`}
                      className='flex flex-col gap-[6px] border-[var(--border-strong)] border-t px-[10px] pt-[6px] pb-[10px]'
                    >
                      <div className='flex flex-col gap-[4px]'>
                        <Label className='text-[13px]'>{STRINGS.labels.name}</Label>
                        <Input
                          name='name'
                          autoComplete='off'
                          value={localNames[variable.id] ?? variable.name}
                          onChange={(e) => handleVariableNameChange(variable.id, e.target.value)}
                          onBlur={() => handleVariableNameBlur(variable.id)}
                          onKeyDown={handleVariableNameKeyDown}
                          placeholder={STRINGS.placeholders.name}
                        />
                        {nameErrors[variable.id] && (
                          <p className='text-[var(--text-error)] text-xs' role='alert'>
                            {nameErrors[variable.id]}
                          </p>
                        )}
                      </div>

                      <div className='space-y-[4px]'>
                        <Label className='text-[13px]'>{STRINGS.labels.type}</Label>
                        <Combobox
                          options={TYPE_OPTIONS}
                          value={variable.type}
                          onChange={(value) => handleUpdateVariable(variable.id, 'type', value)}
                        />
                      </div>

                      <div className='space-y-[4px]'>
                        <Label className='text-[13px]'>{STRINGS.labels.value}</Label>
                        <div className='relative'>{renderValueInput(variable)}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: wand-prompt-bar.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/wand-prompt-bar/wand-prompt-bar.tsx
Signals: React

```typescript
import { useEffect, useRef, useState } from 'react'
import { SendIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/core/utils/cn'

interface WandPromptBarProps {
  isVisible: boolean
  isLoading: boolean
  isStreaming: boolean
  promptValue: string
  onSubmit: (prompt: string) => void
  onCancel: () => void
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function WandPromptBar({
  isVisible,
  isLoading,
  isStreaming,
  promptValue,
  onSubmit,
  onCancel,
  onChange,
  placeholder = 'Describe what you want to generate...',
  className,
}: WandPromptBarProps) {
  const promptBarRef = useRef<HTMLDivElement>(null)
  const [isExiting, setIsExiting] = useState(false)

  // Handle the fade-out animation
  const handleCancel = () => {
    if (!isLoading && !isStreaming) {
      setIsExiting(true)
      // Wait for animation to complete before actual cancellation
      setTimeout(() => {
        setIsExiting(false)
        onCancel()
      }, 150) // Matches the CSS transition duration
    }
  }

  useEffect(() => {
    // Handle click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        promptBarRef.current &&
        !promptBarRef.current.contains(event.target as Node) &&
        isVisible &&
        !isStreaming &&
        !isLoading &&
        !isExiting
      ) {
        handleCancel()
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside)

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible, isStreaming, isLoading, isExiting, onCancel])

  // Reset the exit state when visibility changes
  useEffect(() => {
    if (isVisible) {
      setIsExiting(false)
    }
  }, [isVisible])

  if (!isVisible && !isStreaming && !isExiting) {
    return null
  }

  return (
    <div
      ref={promptBarRef}
      className={cn(
        '-translate-y-3 absolute right-0 bottom-full left-0 gap-2',
        'rounded-lg border bg-background shadow-lg',
        'z-9999999 transition-all duration-150',
        isExiting ? 'opacity-0' : 'opacity-100',
        className
      )}
    >
      <div className='flex items-center gap-2 p-2'>
        <div className={cn('status-indicator ml-2 self-center', isStreaming && 'streaming')} />

        <div className='relative flex-1'>
          <Input
            value={isStreaming ? 'Generating...' : promptValue}
            onChange={(e) => !isStreaming && onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              'rounded-xl border-0 text-foreground text-sm placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0',
              isStreaming && 'text-foreground/70',
              (isLoading || isStreaming) && 'loading-placeholder'
            )}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading && !isStreaming && promptValue.trim()) {
                onSubmit(promptValue)
              } else if (e.key === 'Escape') {
                handleCancel()
              }
            }}
            disabled={isLoading || isStreaming}
            autoFocus={!isStreaming}
          />
        </div>

        <Button
          variant='ghost'
          size='icon'
          onClick={handleCancel}
          className='h-8 w-8 rounded-full text-muted-foreground hover:bg-accent/50 hover:text-foreground'
        >
          <XIcon className='h-4 w-4' />
        </Button>

        {!isStreaming && (
          <Button
            variant='ghost'
            size='icon'
            onClick={() => onSubmit(promptValue)}
            className='h-8 w-8 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-foreground'
            disabled={isLoading || isStreaming || !promptValue.trim()}
          >
            <SendIcon className='h-4 w-4' />
          </Button>
        )}
      </div>

      <style jsx global>{`

        @keyframes smoke-pulse {
          0%,
          100% {
            transform: scale(0.8);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        .status-indicator {
          position: relative;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          overflow: hidden;
          background-color: hsl(var(--muted-foreground) / 0.5);
          transition: background-color 0.3s ease;
        }

        .status-indicator.streaming {
          background-color: transparent;
        }

        .status-indicator.streaming::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            hsl(var(--primary) / 0.9) 0%,
            hsl(var(--primary) / 0.4) 60%,
            transparent 80%
          );
          animation: smoke-pulse 1.8s ease-in-out infinite;
          opacity: 0.9;
        }

        .dark .status-indicator.streaming::before {
          background: #6b7280;
          opacity: 0.9;
          animation: smoke-pulse 1.8s ease-in-out infinite;
        }

      `}</style>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-block/constants.ts

```typescript
/**
 * Webhook provider display names
 */
export const WEBHOOK_PROVIDERS: Record<string, string> = {
  whatsapp: 'WhatsApp',
  github: 'GitHub',
  discord: 'Discord',
  stripe: 'Stripe',
  generic: 'General',
  slack: 'Slack',
  airtable: 'Airtable',
  gmail: 'Gmail',
} as const
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-block/types.ts

```typescript
import type { BlockConfig } from '@/blocks/types'

/**
 * Props for the WorkflowBlock component
 */
export interface WorkflowBlockProps {
  type: string
  config: BlockConfig
  name: string
  isActive?: boolean
  isPending?: boolean
  isPreview?: boolean
  subBlockValues?: Record<string, any>
  blockState?: any
}

/**
 * Schedule information for scheduled workflows
 */
export interface ScheduleInfo {
  scheduleTiming: string
  nextRunAt: string | null
  lastRanAt: string | null
  timezone: string
  status?: string
  isDisabled?: boolean
  id?: string
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-block/utils.ts

```typescript
import type { NodeProps } from 'reactflow'
import { WEBHOOK_PROVIDERS } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-block/constants'
import type { WorkflowBlockProps } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-block/types'
import type { SubBlockConfig } from '@/blocks/types'

/**
 * Gets the display name for a webhook provider
 *
 * @param providerId - The provider identifier
 * @returns The human-readable provider name
 */
export function getProviderName(providerId: string): string {
  return WEBHOOK_PROVIDERS[providerId] || 'Webhook'
}

/**
 * Compares two WorkflowBlock props to determine if a re-render should be skipped
 * Used as the comparison function for React.memo
 *
 * @param prevProps - Previous node props
 * @param nextProps - Next node props
 * @returns True if render should be skipped (props are equal), false otherwise
 */
export function shouldSkipBlockRender(
  prevProps: NodeProps<WorkflowBlockProps>,
  nextProps: NodeProps<WorkflowBlockProps>
): boolean {
  return (
    prevProps.id === nextProps.id &&
    prevProps.data.type === nextProps.data.type &&
    prevProps.data.name === nextProps.data.name &&
    prevProps.data.isActive === nextProps.data.isActive &&
    prevProps.data.isPending === nextProps.data.isPending &&
    prevProps.data.isPreview === nextProps.data.isPreview &&
    prevProps.data.config === nextProps.data.config &&
    prevProps.data.subBlockValues === nextProps.data.subBlockValues &&
    prevProps.data.blockState === nextProps.data.blockState &&
    prevProps.selected === nextProps.selected &&
    prevProps.dragging === nextProps.dragging &&
    prevProps.xPos === nextProps.xPos &&
    prevProps.yPos === nextProps.yPos
  )
}

/**
 * Creates a debounced version of a function
 *
 * @param func - The function to debounce
 * @param wait - The delay in milliseconds
 * @returns The debounced function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Generates a stable key for a subblock that accounts for dynamic state changes
 * This is especially important for MCP blocks where server/tool selection affects rendering
 *
 * @param blockId - The parent block ID
 * @param subBlock - The subblock configuration
 * @param stateToUse - The current state values for the block
 * @returns A stable key string for React reconciliation
 */
export function getSubBlockStableKey(
  blockId: string,
  subBlock: SubBlockConfig,
  stateToUse: Record<string, any>
): string {
  if (subBlock.type === 'mcp-dynamic-args') {
    const serverValue = stateToUse.server?.value || 'no-server'
    const toolValue = stateToUse.tool?.value || 'no-tool'
    return `${blockId}-${subBlock.id}-${serverValue}-${toolValue}`
  }

  if (subBlock.type === 'mcp-tool-selector') {
    const serverValue = stateToUse.server?.value || 'no-server'
    return `${blockId}-${subBlock.id}-${serverValue}`
  }

  return `${blockId}-${subBlock.id}`
}
```

--------------------------------------------------------------------------------

````
