---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 409
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 409 of 933)

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

---[FILE: field-item.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/connection-blocks/components/field-item/field-item.tsx
Signals: React

```typescript
'use client'

import { useCallback } from 'react'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'
import { Badge } from '@/components/emcn'
import { createLogger } from '@/lib/logs/console/logger'
import type { ConnectedBlock } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/hooks/use-block-connections'

const logger = createLogger('FieldItem')

/**
 * Represents a schema field with optional nested children
 */
export interface SchemaField {
  name: string
  type: string
  description?: string
  children?: SchemaField[]
}

interface FieldItemProps {
  connection: ConnectedBlock
  field: SchemaField
  path: string
  level: number
  hasChildren?: boolean
  isExpanded?: boolean
  onToggleExpand?: (path: string) => void
}

/**
 * Tree layout constants shared with parent component
 */
export const TREE_SPACING = {
  INDENT_PER_LEVEL: 20,
  BASE_INDENT: 20,
  VERTICAL_LINE_LEFT_OFFSET: 4,
  ITEM_GAP: 0,
  ITEM_HEIGHT: 25,
} as const

/**
 * Individual field item component with drag functionality
 */
export function FieldItem({
  connection,
  field,
  path,
  level,
  hasChildren,
  isExpanded,
  onToggleExpand,
}: FieldItemProps) {
  const indent = TREE_SPACING.BASE_INDENT + level * TREE_SPACING.INDENT_PER_LEVEL

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      const normalizedBlockName = connection.name.replace(/\s+/g, '').toLowerCase()
      const fullTag = `${normalizedBlockName}.${path}`

      e.dataTransfer.setData(
        'application/json',
        JSON.stringify({
          type: 'connectionBlock',
          connectionData: {
            sourceBlockId: connection.id,
            tag: fullTag,
            blockName: connection.name,
            fieldName: field.name,
            fieldType: field.type,
          },
        })
      )
      e.dataTransfer.effectAllowed = 'copy'

      logger.info('Field drag started', { tag: fullTag, field: field.name })
    },
    [connection, field, path]
  )

  const handleClick = useCallback(() => {
    if (hasChildren) {
      onToggleExpand?.(path)
    }
  }, [hasChildren, onToggleExpand, path])

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      className={clsx(
        'group flex h-[25px] cursor-grab items-center gap-[8px] rounded-[8px] px-[8px] text-[14px] hover:bg-[var(--border)] active:cursor-grabbing',
        hasChildren && 'cursor-pointer'
      )}
      style={{ marginLeft: `${indent}px` }}
    >
      <span
        className={clsx(
          'flex-1 truncate font-medium',
          'text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]'
        )}
      >
        {field.name}
      </span>
      <Badge className='rounded-[2px] px-[4px] py-[1px] font-mono text-[10px]'>{field.type}</Badge>
      {hasChildren && (
        <ChevronDown
          className={clsx(
            'h-3.5 w-3.5 flex-shrink-0 transition-transform',
            'text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]',
            isExpanded && 'rotate-180'
          )}
        />
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: sub-block.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/sub-block.tsx
Signals: React

```typescript
import { type JSX, type MouseEvent, memo, useRef, useState } from 'react'
import { AlertTriangle, Wand2 } from 'lucide-react'
import { Label, Tooltip } from '@/components/emcn/components'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/core/utils/cn'
import type { FieldDiffStatus } from '@/lib/workflows/diff/types'
import {
  CheckboxList,
  Code,
  ComboBox,
  ConditionInput,
  CredentialSelector,
  DocumentSelector,
  DocumentTagEntry,
  Dropdown,
  EvalInput,
  FileSelectorInput,
  FileUpload,
  FolderSelectorInput,
  GroupedCheckboxList,
  InputFormat,
  InputMapping,
  KnowledgeBaseSelector,
  KnowledgeTagFilters,
  LongInput,
  McpDynamicArgs,
  McpServerSelector,
  McpToolSelector,
  MessagesInput,
  ProjectSelectorInput,
  ResponseFormat,
  ScheduleSave,
  ShortInput,
  SlackSelectorInput,
  SliderInput,
  Switch,
  Table,
  Text,
  TimeInput,
  ToolInput,
  TriggerSave,
  VariablesInput,
} from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components'
import { useDependsOnGate } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-depends-on-gate'
import type { SubBlockConfig } from '@/blocks/types'

/**
 * Interface for wand control handlers exposed by sub-block inputs
 */
export interface WandControlHandlers {
  onWandTrigger: (prompt: string) => void
  isWandActive: boolean
  isWandStreaming: boolean
}

/**
 * Props for the `SubBlock` UI element. Renders a single configurable input within a workflow block.
 */
interface SubBlockProps {
  blockId: string
  config: SubBlockConfig
  isPreview?: boolean
  subBlockValues?: Record<string, any>
  disabled?: boolean
  fieldDiffStatus?: FieldDiffStatus
  allowExpandInPreview?: boolean
}

/**
 * Returns whether the field is required for validation.
 * Evaluates conditional requirements based on current field values.
 * @param config - The sub-block configuration
 * @param subBlockValues - Current values of all subblocks
 * @returns True if the field is required
 */
const isFieldRequired = (config: SubBlockConfig, subBlockValues?: Record<string, any>): boolean => {
  if (!config.required) return false
  if (typeof config.required === 'boolean') return config.required

  // Helper function to evaluate a condition
  const evalCond = (
    cond: {
      field: string
      value: string | number | boolean | Array<string | number | boolean>
      not?: boolean
      and?: {
        field: string
        value: string | number | boolean | Array<string | number | boolean> | undefined
        not?: boolean
      }
    },
    values: Record<string, any>
  ): boolean => {
    const fieldValue = values[cond.field]?.value
    const condValue = cond.value

    let match: boolean
    if (Array.isArray(condValue)) {
      match = condValue.includes(fieldValue)
    } else {
      match = fieldValue === condValue
    }

    if (cond.not) match = !match

    if (cond.and) {
      const andFieldValue = values[cond.and.field]?.value
      const andCondValue = cond.and.value
      let andMatch: boolean
      if (Array.isArray(andCondValue)) {
        andMatch = andCondValue.includes(andFieldValue)
      } else {
        andMatch = andFieldValue === andCondValue
      }
      if (cond.and.not) andMatch = !andMatch
      match = match && andMatch
    }

    return match
  }

  // If required is a condition object or function, evaluate it
  const condition = typeof config.required === 'function' ? config.required() : config.required
  return evalCond(condition, subBlockValues || {})
}

/**
 * Retrieves the preview value for a specific sub-block.
 * @param config - The sub-block configuration
 * @param isPreview - Whether the component is in preview mode
 * @param subBlockValues - Optional record of sub-block values
 * @returns The preview value or undefined
 */
const getPreviewValue = (
  config: SubBlockConfig,
  isPreview: boolean,
  subBlockValues?: Record<string, any>
): unknown => {
  if (!isPreview || !subBlockValues) return undefined
  return subBlockValues[config.id]?.value ?? null
}

/**
 * Renders the label with optional validation, description tooltips, and inline wand control.
 * @param config - The sub-block configuration
 * @param isValidJson - Whether the JSON is valid
 * @param wandState - Wand interaction state
 * @param subBlockValues - Current values of all subblocks for evaluating conditional requirements
 * @returns The label JSX element or null if no title or for switch types
 */
const renderLabel = (
  config: SubBlockConfig,
  isValidJson: boolean,
  wandState: {
    isSearchActive: boolean
    searchQuery: string
    isWandEnabled: boolean
    isPreview: boolean
    isStreaming: boolean
    disabled: boolean
    onSearchClick: () => void
    onSearchBlur: () => void
    onSearchChange: (value: string) => void
    onSearchSubmit: () => void
    onSearchCancel: () => void
    searchInputRef: React.RefObject<HTMLInputElement | null>
  },
  subBlockValues?: Record<string, any>
): JSX.Element | null => {
  if (config.type === 'switch') return null
  if (!config.title) return null

  const {
    isSearchActive,
    searchQuery,
    isWandEnabled,
    isPreview,
    isStreaming,
    disabled,
    onSearchClick,
    onSearchBlur,
    onSearchChange,
    onSearchSubmit,
    onSearchCancel,
    searchInputRef,
  } = wandState

  const required = isFieldRequired(config, subBlockValues)

  return (
    <Label className='flex items-center justify-between gap-[6px] pl-[2px]'>
      <div className='flex items-center gap-[6px] whitespace-nowrap'>
        {config.title}
        {required && <span className='ml-0.5'>*</span>}
        {config.type === 'code' && config.language === 'json' && (
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <AlertTriangle
                className={cn(
                  'h-4 w-4 cursor-pointer text-destructive',
                  !isValidJson ? 'opacity-100' : 'opacity-0'
                )}
              />
            </Tooltip.Trigger>
            <Tooltip.Content side='top'>
              <p>Invalid JSON</p>
            </Tooltip.Content>
          </Tooltip.Root>
        )}
      </div>

      {/* Wand inline prompt */}
      {isWandEnabled && !isPreview && !disabled && (
        <div className='flex min-w-0 flex-1 items-center justify-end pr-[4px]'>
          {!isSearchActive ? (
            <Button
              variant='ghost'
              className='h-[12px] w-[12px] flex-shrink-0 p-0 hover:bg-transparent'
              aria-label='Generate with AI'
              onClick={onSearchClick}
            >
              <Wand2 className='!h-[12px] !w-[12px] bg-transparent text-[var(--text-secondary)]' />
            </Button>
          ) : (
            <input
              ref={searchInputRef}
              type='text'
              value={isStreaming ? 'Generating...' : searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onBlur={onSearchBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim() && !isStreaming) {
                  onSearchSubmit()
                } else if (e.key === 'Escape') {
                  onSearchCancel()
                }
              }}
              disabled={isStreaming}
              className={cn(
                'h-[12px] w-full min-w-[100px] border-none bg-transparent py-0 pr-[2px] text-right font-medium text-[12px] text-[var(--text-primary)] leading-[14px] placeholder:text-[var(--text-muted)] focus:outline-none',
                isStreaming && 'text-muted-foreground'
              )}
              placeholder='Describe...'
            />
          )}
        </div>
      )}
    </Label>
  )
}

/**
 * Compares props to prevent unnecessary re-renders.
 * @param prevProps - Previous component props
 * @param nextProps - Next component props
 * @returns True if props are equal (skip re-render)
 */
const arePropsEqual = (prevProps: SubBlockProps, nextProps: SubBlockProps): boolean => {
  return (
    prevProps.blockId === nextProps.blockId &&
    prevProps.config === nextProps.config &&
    prevProps.isPreview === nextProps.isPreview &&
    prevProps.subBlockValues === nextProps.subBlockValues &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.fieldDiffStatus === nextProps.fieldDiffStatus &&
    prevProps.allowExpandInPreview === nextProps.allowExpandInPreview
  )
}

/**
 * Renders a single workflow sub-block input based on `config.type`, supporting preview and disabled states.
 */
function SubBlockComponent({
  blockId,
  config,
  isPreview = false,
  subBlockValues,
  disabled = false,
  fieldDiffStatus,
  allowExpandInPreview,
}: SubBlockProps): JSX.Element {
  const [isValidJson, setIsValidJson] = useState(true)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const wandControlRef = useRef<WandControlHandlers | null>(null)

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation()
  }

  const handleValidationChange = (isValid: boolean): void => {
    setIsValidJson(isValid)
  }

  // Check if wand is enabled for this sub-block
  const isWandEnabled = config.wandConfig?.enabled ?? false

  /**
   * Handle wand icon click to activate inline prompt mode
   */
  const handleSearchClick = (): void => {
    setIsSearchActive(true)
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 0)
  }

  /**
   * Handle search input blur - deactivate if empty and not streaming
   */
  const handleSearchBlur = (): void => {
    if (!searchQuery.trim() && !wandControlRef.current?.isWandStreaming) {
      setIsSearchActive(false)
    }
  }

  /**
   * Handle search query change
   */
  const handleSearchChange = (value: string): void => {
    setSearchQuery(value)
  }

  /**
   * Handle search submit - trigger generation
   */
  const handleSearchSubmit = (): void => {
    if (searchQuery.trim() && wandControlRef.current) {
      wandControlRef.current.onWandTrigger(searchQuery)
      setSearchQuery('')
      setIsSearchActive(false)
    }
  }

  /**
   * Handle search cancel
   */
  const handleSearchCancel = (): void => {
    setSearchQuery('')
    setIsSearchActive(false)
  }

  const previewValue = getPreviewValue(config, isPreview, subBlockValues) as
    | string
    | string[]
    | null
    | undefined

  // Use dependsOn gating to compute final disabled state
  // Only pass previewContextValues when in preview mode to avoid format mismatches
  const { finalDisabled: gatedDisabled } = useDependsOnGate(blockId, config, {
    disabled,
    isPreview,
    previewContextValues: isPreview ? subBlockValues : undefined,
  })

  const isDisabled = gatedDisabled

  /**
   * Selects and renders the appropriate input component for the current sub-block `config.type`.
   */
  const renderInput = (): JSX.Element => {
    switch (config.type) {
      case 'short-input':
        return (
          <ShortInput
            blockId={blockId}
            subBlockId={config.id}
            placeholder={config.placeholder}
            password={config.password}
            readOnly={config.readOnly}
            showCopyButton={config.showCopyButton}
            useWebhookUrl={config.useWebhookUrl}
            config={config}
            isPreview={isPreview}
            previewValue={previewValue as string | null | undefined}
            disabled={isDisabled}
            wandControlRef={wandControlRef}
            hideInternalWand={true}
          />
        )

      case 'long-input':
        return (
          <LongInput
            blockId={blockId}
            subBlockId={config.id}
            placeholder={config.placeholder}
            rows={config.rows}
            config={config}
            isPreview={isPreview}
            previewValue={previewValue as any}
            disabled={isDisabled}
            wandControlRef={wandControlRef}
            hideInternalWand={true}
          />
        )

      case 'dropdown':
        return (
          <div onMouseDown={handleMouseDown}>
            <Dropdown
              blockId={blockId}
              subBlockId={config.id}
              options={config.options as { label: string; id: string }[]}
              defaultValue={typeof config.value === 'function' ? config.value({}) : config.value}
              placeholder={config.placeholder}
              isPreview={isPreview}
              previewValue={previewValue}
              disabled={isDisabled}
              multiSelect={config.multiSelect}
              fetchOptions={config.fetchOptions}
              dependsOn={config.dependsOn}
            />
          </div>
        )

      case 'combobox':
        return (
          <div onMouseDown={handleMouseDown}>
            <ComboBox
              blockId={blockId}
              subBlockId={config.id}
              options={config.options as { label: string; id: string }[]}
              defaultValue={typeof config.value === 'function' ? config.value({}) : config.value}
              placeholder={config.placeholder}
              isPreview={isPreview}
              previewValue={previewValue as any}
              disabled={isDisabled}
              config={config}
            />
          </div>
        )

      case 'slider':
        return (
          <SliderInput
            blockId={blockId}
            subBlockId={config.id}
            min={config.min}
            max={config.max}
            defaultValue={(config.min || 0) + ((config.max || 100) - (config.min || 0)) / 2}
            step={config.step}
            integer={config.integer}
            isPreview={isPreview}
            previewValue={previewValue as any}
            disabled={isDisabled}
          />
        )

      case 'table':
        return (
          <Table
            blockId={blockId}
            subBlockId={config.id}
            columns={config.columns ?? []}
            isPreview={isPreview}
            previewValue={previewValue as any}
            disabled={isDisabled}
          />
        )

      case 'code':
        return (
          <Code
            blockId={blockId}
            subBlockId={config.id}
            placeholder={config.placeholder}
            language={config.language}
            generationType={config.generationType}
            value={
              typeof config.value === 'function' ? config.value(subBlockValues || {}) : undefined
            }
            isPreview={isPreview}
            previewValue={previewValue as string | null | undefined}
            disabled={isDisabled}
            readOnly={config.readOnly}
            collapsible={config.collapsible}
            defaultCollapsed={config.defaultCollapsed}
            defaultValue={config.defaultValue}
            showCopyButton={config.showCopyButton}
            onValidationChange={handleValidationChange}
            wandConfig={
              config.wandConfig || {
                enabled: false,
                prompt: '',
                placeholder: '',
              }
            }
            wandControlRef={wandControlRef}
            hideInternalWand={true}
          />
        )

      case 'switch':
        return (
          <Switch
            blockId={blockId}
            subBlockId={config.id}
            title={config.title ?? ''}
            isPreview={isPreview}
            previewValue={previewValue as any}
            disabled={isDisabled}
          />
        )

      case 'tool-input':
        return (
          <ToolInput
            blockId={blockId}
            subBlockId={config.id}
            isPreview={isPreview}
            previewValue={previewValue}
            disabled={allowExpandInPreview ? false : isDisabled}
            allowExpandInPreview={allowExpandInPreview}
          />
        )

      case 'checkbox-list':
        return (
          <CheckboxList
            blockId={blockId}
            subBlockId={config.id}
            title={config.title ?? ''}
            options={config.options as { label: string; id: string }[]}
            isPreview={isPreview}
            subBlockValues={subBlockValues}
            disabled={isDisabled}
          />
        )

      case 'grouped-checkbox-list':
        return (
          <GroupedCheckboxList
            blockId={blockId}
            subBlockId={config.id}
            title={config.title ?? ''}
            options={config.options as { label: string; id: string; group?: string }[]}
            isPreview={isPreview}
            subBlockValues={subBlockValues ?? {}}
            disabled={isDisabled}
            maxHeight={config.maxHeight}
          />
        )

      case 'condition-input':
        return (
          <ConditionInput
            blockId={blockId}
            subBlockId={config.id}
            isPreview={isPreview}
            previewValue={previewValue as any}
            disabled={isDisabled}
          />
        )

      case 'eval-input':
        return (
          <EvalInput
            blockId={blockId}
            subBlockId={config.id}
            isPreview={isPreview}
            previewValue={previewValue as any}
            disabled={isDisabled}
          />
        )

      case 'time-input':
        return (
          <TimeInput
            blockId={blockId}
            subBlockId={config.id}
            placeholder={config.placeholder}
            isPreview={isPreview}
            previewValue={previewValue as any}
            disabled={isDisabled}
          />
        )

      case 'file-upload':
        return (
          <FileUpload
            blockId={blockId}
            subBlockId={config.id}
            acceptedTypes={config.acceptedTypes || '*'}
            multiple={config.multiple === true}
            maxSize={config.maxSize}
            isPreview={isPreview}
            previewValue={previewValue as any}
            disabled={isDisabled}
          />
        )

      case 'schedule-save':
        return <ScheduleSave blockId={blockId} isPreview={isPreview} disabled={disabled} />

      case 'oauth-input':
        return (
          <CredentialSelector
            blockId={blockId}
            subBlock={config}
            disabled={isDisabled}
            isPreview={isPreview}
            previewValue={previewValue}
          />
        )

      case 'file-selector':
        return (
          <FileSelectorInput
            blockId={blockId}
            subBlock={config}
            disabled={isDisabled}
            isPreview={isPreview}
            previewValue={previewValue}
            previewContextValues={isPreview ? subBlockValues : undefined}
          />
        )

      case 'project-selector':
        return (
          <ProjectSelectorInput
            blockId={blockId}
            subBlock={config}
            disabled={isDisabled}
            isPreview={isPreview}
            previewValue={previewValue}
          />
        )

      case 'folder-selector':
        return (
          <FolderSelectorInput
            blockId={blockId}
            subBlock={config}
            disabled={isDisabled}
            isPreview={isPreview}
            previewValue={previewValue}
          />
        )

      case 'knowledge-base-selector':
        return (
          <KnowledgeBaseSelector
            blockId={blockId}
            subBlock={config}
            disabled={isDisabled}
            isPreview={isPreview}
            previewValue={previewValue as any}
          />
        )

      case 'knowledge-tag-filters':
        return (
          <KnowledgeTagFilters
            blockId={blockId}
            subBlock={config}
            disabled={isDisabled}
            isPreview={isPreview}
            previewValue={previewValue as any}
          />
        )

      case 'document-tag-entry':
        return (
          <DocumentTagEntry
            blockId={blockId}
            subBlock={config}
            disabled={isDisabled}
            isPreview={isPreview}
            previewValue={previewValue as any}
          />
        )

      case 'document-selector':
        return (
          <DocumentSelector
            blockId={blockId}
            subBlock={config}
            disabled={isDisabled}
            isPreview={isPreview}
            previewValue={previewValue as any}
          />
        )

      case 'input-format':
        return (
          <InputFormat
            blockId={blockId}
            subBlockId={config.id}
            isPreview={isPreview}
            previewValue={previewValue as any}
            disabled={isDisabled}
            config={config}
            showValue={true}
          />
        )

      case 'input-mapping':
        return (
          <InputMapping
            blockId={blockId}
            subBlockId={config.id}
            isPreview={isPreview}
            previewValue={previewValue as any}
            disabled={isDisabled}
          />
        )

      case 'variables-input':
        return (
          <VariablesInput
            blockId={blockId}
            subBlockId={config.id}
            isPreview={isPreview}
            previewValue={previewValue as any}
            disabled={isDisabled}
          />
        )

      case 'response-format':
        return (
          <ResponseFormat
            blockId={blockId}
            subBlockId={config.id}
            isPreview={isPreview}
            previewValue={previewValue}
            config={config}
            disabled={isDisabled}
          />
        )

      case 'channel-selector':
      case 'user-selector':
        return (
          <SlackSelectorInput
            blockId={blockId}
            subBlock={config}
            disabled={isDisabled}
            isPreview={isPreview}
            previewValue={previewValue}
          />
        )

      case 'mcp-server-selector':
        return (
          <McpServerSelector
            blockId={blockId}
            subBlock={config}
            disabled={isDisabled}
            isPreview={isPreview}
            previewValue={previewValue as any}
          />
        )

      case 'mcp-tool-selector':
        return (
          <McpToolSelector
            blockId={blockId}
            subBlock={config}
            disabled={isDisabled}
            isPreview={isPreview}
            previewValue={previewValue as any}
          />
        )

      case 'mcp-dynamic-args':
        return (
          <McpDynamicArgs
            blockId={blockId}
            subBlockId={config.id}
            disabled={isDisabled}
            isPreview={isPreview}
            previewValue={previewValue}
          />
        )

      case 'text':
        return (
          <Text
            blockId={blockId}
            subBlockId={config.id}
            content={
              typeof config.value === 'function'
                ? config.value(subBlockValues || {})
                : (config.defaultValue as string) || ''
            }
          />
        )
      case 'trigger-save':
        return (
          <TriggerSave
            blockId={blockId}
            subBlockId={config.id}
            triggerId={config.triggerId}
            isPreview={isPreview}
            disabled={disabled}
          />
        )

      case 'messages-input':
        return (
          <MessagesInput
            blockId={blockId}
            subBlockId={config.id}
            config={config}
            isPreview={isPreview}
            previewValue={previewValue as any}
            disabled={isDisabled}
          />
        )

      default:
        return <div>Unknown input type: {config.type}</div>
    }
  }

  return (
    <div onMouseDown={handleMouseDown} className='flex flex-col gap-[10px]'>
      {renderLabel(
        config,
        isValidJson,
        {
          isSearchActive,
          searchQuery,
          isWandEnabled,
          isPreview,
          isStreaming: wandControlRef.current?.isWandStreaming ?? false,
          disabled: isDisabled,
          onSearchClick: handleSearchClick,
          onSearchBlur: handleSearchBlur,
          onSearchChange: handleSearchChange,
          onSearchSubmit: handleSearchSubmit,
          onSearchCancel: handleSearchCancel,
          searchInputRef,
        },
        subBlockValues
      )}
      {renderInput()}
    </div>
  )
}

export const SubBlock = memo(SubBlockComponent, arePropsEqual)
```

--------------------------------------------------------------------------------

---[FILE: env-var-dropdown.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/env-var-dropdown.tsx
Signals: React

```typescript
import { useCallback, useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverItem,
  PopoverScrollArea,
  PopoverSection,
} from '@/components/emcn'
import { cn } from '@/lib/core/utils/cn'
import {
  usePersonalEnvironment,
  useWorkspaceEnvironment,
  type WorkspaceEnvironmentData,
} from '@/hooks/queries/environment'

/**
 * Props for the EnvVarDropdown component
 */
interface EnvVarDropdownProps {
  /** Whether the dropdown is visible */
  visible: boolean
  /** Callback when an environment variable is selected */
  onSelect: (newValue: string) => void
  /** Search term to filter environment variables */
  searchTerm?: string
  /** Additional CSS class names */
  className?: string
  /** Current value of the input field */
  inputValue: string
  /** Current cursor position in the input */
  cursorPosition: number
  /** Callback when the dropdown should close */
  onClose?: () => void
  /** Custom styles for positioning */
  style?: React.CSSProperties
  /** Workspace ID for loading workspace-specific environment variables */
  workspaceId?: string
  /** Maximum height for the dropdown */
  maxHeight?: string
  /** Reference to the input element for caret positioning */
  inputRef?: React.RefObject<HTMLTextAreaElement | HTMLInputElement>
}

/**
 * Environment variable group for organizing variables by scope
 */
interface EnvVarGroup {
  label: string
  variables: string[]
}

/**
 * Calculates the viewport position of the caret in a textarea/input
 */
const getCaretViewportPosition = (
  element: HTMLTextAreaElement | HTMLInputElement,
  caretPosition: number,
  text: string
) => {
  const elementRect = element.getBoundingClientRect()
  const style = window.getComputedStyle(element)

  const mirrorDiv = document.createElement('div')
  mirrorDiv.style.position = 'absolute'
  mirrorDiv.style.visibility = 'hidden'
  mirrorDiv.style.whiteSpace = 'pre-wrap'
  mirrorDiv.style.wordWrap = 'break-word'
  mirrorDiv.style.font = style.font
  mirrorDiv.style.padding = style.padding
  mirrorDiv.style.border = style.border
  mirrorDiv.style.width = style.width
  mirrorDiv.style.lineHeight = style.lineHeight
  mirrorDiv.style.boxSizing = style.boxSizing
  mirrorDiv.style.letterSpacing = style.letterSpacing
  mirrorDiv.style.textTransform = style.textTransform
  mirrorDiv.style.textIndent = style.textIndent
  mirrorDiv.style.textAlign = style.textAlign

  mirrorDiv.textContent = text.substring(0, caretPosition)

  const caretMarker = document.createElement('span')
  caretMarker.style.display = 'inline-block'
  caretMarker.style.width = '0px'
  caretMarker.style.padding = '0'
  caretMarker.style.border = '0'
  mirrorDiv.appendChild(caretMarker)

  document.body.appendChild(mirrorDiv)
  const markerRect = caretMarker.getBoundingClientRect()
  const mirrorRect = mirrorDiv.getBoundingClientRect()
  document.body.removeChild(mirrorDiv)

  const leftOffset = markerRect.left - mirrorRect.left - element.scrollLeft
  const topOffset = markerRect.top - mirrorRect.top - element.scrollTop

  return {
    left: elementRect.left + leftOffset,
    top: elementRect.top + topOffset,
  }
}

/**
 * EnvVarDropdown component that displays available environment variables
 * for selection in input fields. Uses the Popover component system for consistent styling.
 */
export const EnvVarDropdown: React.FC<EnvVarDropdownProps> = ({
  visible,
  onSelect,
  searchTerm = '',
  className,
  inputValue,
  cursorPosition,
  onClose,
  style,
  workspaceId,
  maxHeight = 'none',
  inputRef,
}) => {
  // React Query hooks for environment variables
  const { data: personalEnv = {} } = usePersonalEnvironment()
  const { data: workspaceEnvData } = useWorkspaceEnvironment(workspaceId || '', {
    select: useCallback(
      (data: WorkspaceEnvironmentData): WorkspaceEnvironmentData => ({
        workspace: data.workspace || {},
        personal: data.personal || {},
        conflicts: data.conflicts || [],
      }),
      []
    ),
  })

  const userEnvVars = Object.keys(personalEnv)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const envVarGroups: EnvVarGroup[] = []

  if (workspaceId && workspaceEnvData) {
    const workspaceVars = Object.keys(workspaceEnvData?.workspace || {})
    const personalVars = Object.keys(workspaceEnvData?.personal || {})

    envVarGroups.push({ label: 'Workspace', variables: workspaceVars })
    envVarGroups.push({ label: 'Personal', variables: personalVars })
  } else {
    if (userEnvVars.length > 0) {
      envVarGroups.push({ label: 'Personal', variables: userEnvVars })
    }
  }

  const allEnvVars = envVarGroups.flatMap((group) => group.variables)

  const filteredEnvVars = allEnvVars.filter((envVar) =>
    envVar.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredGroups = envVarGroups
    .map((group) => ({
      ...group,
      variables: group.variables.filter((envVar) =>
        envVar.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((group) => group.variables.length > 0)

  useEffect(() => {
    setSelectedIndex(0)
  }, [searchTerm])

  const openEnvironmentSettings = () => {
    window.dispatchEvent(new CustomEvent('open-settings', { detail: { tab: 'environment' } }))
    onClose?.()
  }

  const handleEnvVarSelect = (envVar: string) => {
    const textBeforeCursor = inputValue.slice(0, cursorPosition)
    const textAfterCursor = inputValue.slice(cursorPosition)

    const lastOpenBraces = textBeforeCursor.lastIndexOf('{{')

    const isStandardEnvVarContext = lastOpenBraces !== -1

    if (isStandardEnvVarContext) {
      const startText = textBeforeCursor.slice(0, lastOpenBraces)

      const closeIndex = textAfterCursor.indexOf('}}')
      const endText = closeIndex !== -1 ? textAfterCursor.slice(closeIndex + 2) : textAfterCursor

      const newValue = `${startText}{{${envVar}}}${endText}`
      onSelect(newValue)
    } else {
      if (inputValue.trim() !== '') {
        onSelect(`{{${envVar}}}`)
      } else {
        onSelect(`{{${envVar}}}`)
      }
    }

    onClose?.()
  }

  useEffect(() => {
    if (visible) {
      const handleKeyboardEvent = (e: KeyboardEvent) => {
        if (!filteredEnvVars.length) return

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            e.stopPropagation()
            setSelectedIndex((prev) => {
              const newIndex = prev < filteredEnvVars.length - 1 ? prev + 1 : prev
              setTimeout(() => {
                const selectedElement = document.querySelector(`[data-env-var-index="${newIndex}"]`)
                if (selectedElement) {
                  selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                }
              }, 0)
              return newIndex
            })
            break
          case 'ArrowUp':
            e.preventDefault()
            e.stopPropagation()
            setSelectedIndex((prev) => {
              const newIndex = prev > 0 ? prev - 1 : prev
              setTimeout(() => {
                const selectedElement = document.querySelector(`[data-env-var-index="${newIndex}"]`)
                if (selectedElement) {
                  selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                }
              }, 0)
              return newIndex
            })
            break
          case 'Enter':
            e.preventDefault()
            e.stopPropagation()
            handleEnvVarSelect(filteredEnvVars[selectedIndex])
            break
          case 'Escape':
            e.preventDefault()
            e.stopPropagation()
            onClose?.()
            break
        }
      }

      window.addEventListener('keydown', handleKeyboardEvent, true)
      return () => window.removeEventListener('keydown', handleKeyboardEvent, true)
    }
  }, [visible, selectedIndex, filteredEnvVars])

  if (!visible) return null

  // Calculate caret position for proper anchoring
  const inputElement = inputRef?.current
  let caretViewport = { left: 0, top: 0 }
  let side: 'top' | 'bottom' = 'bottom'

  if (inputElement) {
    caretViewport = getCaretViewportPosition(inputElement, cursorPosition, inputValue)

    // Decide preferred side based on available space
    const margin = 8
    const spaceAbove = caretViewport.top - margin
    const spaceBelow = window.innerHeight - caretViewport.top - margin
    side = spaceBelow >= spaceAbove ? 'bottom' : 'top'
  }

  return (
    <Popover open={visible} onOpenChange={(open) => !open && onClose?.()}>
      <PopoverAnchor asChild>
        <div
          className={cn('pointer-events-none', className)}
          style={{
            ...style,
            position: inputElement ? 'fixed' : 'absolute',
            top: inputElement ? `${caretViewport.top}px` : style?.top,
            left: inputElement ? `${caretViewport.left}px` : style?.left,
            width: '1px',
            height: '1px',
          }}
        />
      </PopoverAnchor>
      <PopoverContent
        maxHeight={maxHeight !== 'none' ? 192 : 400}
        className='min-w-[280px]'
        side={side}
        align='start'
        collisionPadding={6}
        style={{ zIndex: 100000000 }}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {filteredEnvVars.length === 0 ? (
          <PopoverScrollArea>
            <PopoverItem
              onMouseDown={(e) => {
                e.preventDefault()
                openEnvironmentSettings()
              }}
            >
              <Plus className='h-3 w-3' />
              <span>Create environment variable</span>
            </PopoverItem>
          </PopoverScrollArea>
        ) : (
          <PopoverScrollArea>
            {filteredGroups.map((group) => (
              <div key={group.label}>
                {workspaceId && <PopoverSection>{group.label}</PopoverSection>}
                {group.variables.map((envVar) => {
                  const globalIndex = filteredEnvVars.indexOf(envVar)
                  return (
                    <PopoverItem
                      key={`${group.label}-${envVar}`}
                      data-env-var-index={globalIndex}
                      active={globalIndex === selectedIndex}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        handleEnvVarSelect(envVar)
                      }}
                    >
                      {envVar}
                    </PopoverItem>
                  )
                })}
              </div>
            ))}
          </PopoverScrollArea>
        )}
      </PopoverContent>
    </Popover>
  )
}

/**
 * Checks if the environment variable trigger ({{) should show the dropdown
 * @param text - The full text content
 * @param cursorPosition - Current cursor position
 * @returns Object indicating whether to show the dropdown and the current search term
 */
export const checkEnvVarTrigger = (
  text: string,
  cursorPosition: number
): { show: boolean; searchTerm: string } => {
  if (cursorPosition >= 2) {
    const textBeforeCursor = text.slice(0, cursorPosition)
    const match = textBeforeCursor.match(/\{\{(\w*)$/)
    if (match) {
      return { show: true, searchTerm: match[1] }
    }

    if (textBeforeCursor.endsWith('{{')) {
      return { show: true, searchTerm: '' }
    }
  }
  return { show: false, searchTerm: '' }
}
```

--------------------------------------------------------------------------------

````
