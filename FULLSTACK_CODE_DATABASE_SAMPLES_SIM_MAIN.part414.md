---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 414
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 414 of 933)

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

---[FILE: document-tag-entry.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/document-tag-entry/document-tag-entry.tsx
Signals: React

```typescript
'use client'

import { useMemo, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { Trash } from '@/components/emcn/icons/trash'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/core/utils/cn'
import { MAX_TAG_SLOTS } from '@/lib/knowledge/constants'
import { formatDisplayText } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/formatted-text'
import { TagDropdown } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/tag-dropdown/tag-dropdown'
import { useSubBlockInput } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-input'
import { useSubBlockValue } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-value'
import { useAccessibleReferencePrefixes } from '@/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-accessible-reference-prefixes'
import type { SubBlockConfig } from '@/blocks/types'
import { useKnowledgeBaseTagDefinitions } from '@/hooks/use-knowledge-base-tag-definitions'
import { useTagSelection } from '@/hooks/use-tag-selection'

interface DocumentTagRow {
  id: string
  cells: {
    tagName: string
    type: string
    value: string
  }
}

interface DocumentTagEntryProps {
  blockId: string
  subBlock: SubBlockConfig
  disabled?: boolean
  isPreview?: boolean
  previewValue?: any
}

export function DocumentTagEntry({
  blockId,
  subBlock,
  disabled = false,
  isPreview = false,
  previewValue,
}: DocumentTagEntryProps) {
  const [storeValue, setStoreValue] = useSubBlockValue<string>(blockId, subBlock.id)
  const accessiblePrefixes = useAccessibleReferencePrefixes(blockId)
  const valueInputRefs = useRef<Record<number, HTMLInputElement>>({})

  // Use the extended hook for field-level management
  const inputController = useSubBlockInput({
    blockId,
    subBlockId: subBlock.id,
    config: {
      id: subBlock.id,
      type: 'document-tag-entry',
      connectionDroppable: true,
    },
    isPreview,
    disabled,
  })

  // Get the knowledge base ID from other sub-blocks
  const [knowledgeBaseIdValue] = useSubBlockValue(blockId, 'knowledgeBaseId')
  const knowledgeBaseId = knowledgeBaseIdValue || null

  // Use KB tag definitions hook to get available tags
  const { tagDefinitions, isLoading } = useKnowledgeBaseTagDefinitions(knowledgeBaseId)

  const emitTagSelection = useTagSelection(blockId, subBlock.id)

  // State for dropdown visibility - one for each row
  const [dropdownStates, setDropdownStates] = useState<Record<number, boolean>>({})
  // State for type dropdown visibility - one for each row
  const [typeDropdownStates, setTypeDropdownStates] = useState<Record<number, boolean>>({})

  // Use preview value when in preview mode, otherwise use store value
  const currentValue = isPreview ? previewValue : storeValue

  // Transform stored JSON string to table format for display
  const rows = useMemo(() => {
    // If we have stored data, use it
    if (currentValue) {
      try {
        const tagData = JSON.parse(currentValue)
        if (Array.isArray(tagData) && tagData.length > 0) {
          return tagData.map((tag: any, index: number) => ({
            id: tag.id || `tag-${index}`,
            cells: {
              tagName: tag.tagName || '',
              type: tag.fieldType || 'text',
              value: tag.value || '',
            },
          }))
        }
      } catch {
        // If parsing fails, fall through to default
      }
    }

    // Default: just one empty row
    return [
      {
        id: 'empty-row-0',
        cells: { tagName: '', type: 'text', value: '' },
      },
    ]
  }, [currentValue])

  // Get available tag names and check for case-insensitive duplicates
  const usedTagNames = new Set(
    rows.map((row) => row.cells.tagName?.toLowerCase()).filter((name) => name?.trim())
  )

  const availableTagDefinitions = tagDefinitions.filter(
    (def) => !usedTagNames.has(def.displayName.toLowerCase())
  )

  // Check if we can add more tags based on MAX_TAG_SLOTS
  const newTagsBeingCreated = rows.filter(
    (row) =>
      row.cells.tagName?.trim() &&
      !tagDefinitions.some(
        (def) => def.displayName.toLowerCase() === row.cells.tagName.toLowerCase()
      )
  ).length
  const canAddMoreTags = tagDefinitions.length + newTagsBeingCreated < MAX_TAG_SLOTS

  // Function to pre-fill existing tags
  const handlePreFillTags = () => {
    if (isPreview || disabled) return

    const existingTagRows = tagDefinitions.map((tagDef, index) => ({
      id: `prefill-${tagDef.id}-${index}`,
      tagName: tagDef.displayName,
      fieldType: tagDef.fieldType,
      value: '',
    }))

    const jsonString = existingTagRows.length > 0 ? JSON.stringify(existingTagRows) : ''
    setStoreValue(jsonString)
  }

  // Shared helper function for updating rows and generating JSON
  const updateRowsAndGenerateJson = (rowIndex: number, column: string, value: string) => {
    const updatedRows = [...rows].map((row, idx) => {
      if (idx === rowIndex) {
        const newCells = { ...row.cells, [column]: value }

        // Auto-select type when existing tag is selected
        if (column === 'tagName' && value) {
          const tagDef = tagDefinitions.find(
            (def) => def.displayName.toLowerCase() === value.toLowerCase()
          )
          if (tagDef) {
            newCells.type = tagDef.fieldType
          }
        }

        return {
          ...row,
          cells: newCells,
        }
      }
      return row
    })

    // Store all rows including empty ones - don't auto-remove
    const dataToStore = updatedRows.map((row) => ({
      id: row.id,
      tagName: row.cells.tagName || '',
      fieldType: row.cells.type || 'text',
      value: row.cells.value || '',
    }))

    return dataToStore.length > 0 ? JSON.stringify(dataToStore) : ''
  }

  const handleCellChange = (rowIndex: number, column: string, value: string) => {
    if (isPreview || disabled) return

    // Check if this is a new tag name that would exceed the limit
    if (column === 'tagName' && value.trim()) {
      const isExistingTag = tagDefinitions.some(
        (def) => def.displayName.toLowerCase() === value.toLowerCase()
      )

      if (!isExistingTag) {
        // Count current new tags being created (excluding the current row)
        const currentNewTags = rows.filter(
          (row, idx) =>
            idx !== rowIndex &&
            row.cells.tagName?.trim() &&
            !tagDefinitions.some(
              (def) => def.displayName.toLowerCase() === row.cells.tagName.toLowerCase()
            )
        ).length

        if (tagDefinitions.length + currentNewTags >= MAX_TAG_SLOTS) {
          // Don't allow creating new tags if we've reached the limit
          return
        }
      }
    }

    const jsonString = updateRowsAndGenerateJson(rowIndex, column, value)
    setStoreValue(jsonString)
  }

  const handleTagDropdownSelection = (rowIndex: number, column: string, value: string) => {
    if (isPreview || disabled) return

    const jsonString = updateRowsAndGenerateJson(rowIndex, column, value)
    emitTagSelection(jsonString)
  }

  const handleAddRow = () => {
    if (isPreview || disabled) return

    // Get current data and add a new empty row
    const currentData = currentValue ? JSON.parse(currentValue) : []
    const newRowId = `tag-${currentData.length}-${Math.random().toString(36).substr(2, 9)}`
    const newData = [...currentData, { id: newRowId, tagName: '', fieldType: 'text', value: '' }]
    setStoreValue(JSON.stringify(newData))
  }

  const handleDeleteRow = (rowIndex: number) => {
    if (isPreview || disabled || rows.length <= 1) return
    const updatedRows = rows.filter((_, idx) => idx !== rowIndex)

    // Store all remaining rows including empty ones - don't auto-remove
    const tableDataForStorage = updatedRows.map((row) => ({
      id: row.id,
      tagName: row.cells.tagName || '',
      fieldType: row.cells.type || 'text',
      value: row.cells.value || '',
    }))

    const jsonString = tableDataForStorage.length > 0 ? JSON.stringify(tableDataForStorage) : ''
    setStoreValue(jsonString)
  }

  // Check for duplicate tag names (case-insensitive)
  const getDuplicateStatus = (rowIndex: number, tagName: string) => {
    if (!tagName.trim()) return false
    const lowerTagName = tagName.toLowerCase()
    return rows.some(
      (row, idx) =>
        idx !== rowIndex &&
        row.cells.tagName?.toLowerCase() === lowerTagName &&
        row.cells.tagName.trim()
    )
  }

  if (isLoading) {
    return <div className='p-4 text-muted-foreground text-sm'>Loading tag definitions...</div>
  }

  const renderHeader = () => (
    <thead>
      <tr className='border-b'>
        <th className='w-2/5 border-r px-4 py-2 text-center font-medium text-sm'>Tag Name</th>
        <th className='w-1/5 border-r px-4 py-2 text-center font-medium text-sm'>Type</th>
        <th className='px-4 py-2 text-center font-medium text-sm'>Value</th>
      </tr>
    </thead>
  )

  const renderTagNameCell = (row: DocumentTagRow, rowIndex: number) => {
    const cellValue = row.cells.tagName || ''
    const isDuplicate = getDuplicateStatus(rowIndex, cellValue)
    const showDropdown = dropdownStates[rowIndex] || false

    const setShowDropdown = (show: boolean) => {
      setDropdownStates((prev) => ({ ...prev, [rowIndex]: show }))
    }

    const handleDropdownClick = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) {
        if (!showDropdown) {
          setShowDropdown(true)
        }
      }
    }

    const handleFocus = () => {
      if (!disabled) {
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
            onChange={(e) => handleCellChange(rowIndex, 'tagName', e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            autoComplete='off'
            className={cn(
              'w-full border-0 text-transparent caret-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0',
              isDuplicate && 'border-red-500 bg-red-50'
            )}
          />
          <div className='pointer-events-none absolute inset-0 flex items-center overflow-hidden bg-transparent px-3 text-sm'>
            <div className='whitespace-pre'>
              {formatDisplayText(cellValue, {
                accessiblePrefixes,
                highlightAll: !accessiblePrefixes,
              })}
            </div>
          </div>
          {showDropdown && availableTagDefinitions.length > 0 && (
            <div className='absolute top-full left-0 z-[100] mt-1 w-full'>
              <div className='allow-scroll fade-in-0 zoom-in-95 animate-in rounded-md border bg-popover text-popover-foreground shadow-lg'>
                <div
                  className='allow-scroll max-h-48 overflow-y-auto p-1'
                  style={{ scrollbarWidth: 'thin' }}
                >
                  {availableTagDefinitions
                    .filter((tagDef) =>
                      tagDef.displayName.toLowerCase().includes(cellValue.toLowerCase())
                    )
                    .map((tagDef) => (
                      <div
                        key={tagDef.id}
                        className='relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground'
                        onMouseDown={(e) => {
                          e.preventDefault()
                          handleCellChange(rowIndex, 'tagName', tagDef.displayName)
                          setShowDropdown(false)
                        }}
                      >
                        <span className='flex-1 truncate'>{tagDef.displayName}</span>
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

  const renderTypeCell = (row: DocumentTagRow, rowIndex: number) => {
    const cellValue = row.cells.type || 'text'
    const tagName = row.cells.tagName || ''

    // Check if this is an existing tag (should be read-only)
    const existingTag = tagDefinitions.find(
      (def) => def.displayName.toLowerCase() === tagName.toLowerCase()
    )
    const isReadOnly = !!existingTag

    const showTypeDropdown = typeDropdownStates[rowIndex] || false

    const setShowTypeDropdown = (show: boolean) => {
      setTypeDropdownStates((prev) => ({ ...prev, [rowIndex]: show }))
    }

    const handleTypeDropdownClick = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled && !isReadOnly) {
        if (!showTypeDropdown) {
          setShowTypeDropdown(true)
        }
      }
    }

    const handleTypeFocus = () => {
      if (!disabled && !isReadOnly) {
        setShowTypeDropdown(true)
      }
    }

    const handleTypeBlur = () => {
      // Delay closing to allow dropdown selection
      setTimeout(() => setShowTypeDropdown(false), 150)
    }

    const typeOptions = [{ value: 'text', label: 'Text' }]

    return (
      <td className='border-r p-1'>
        <div className='relative w-full'>
          <Input
            value={cellValue}
            readOnly
            disabled={disabled || isReadOnly}
            autoComplete='off'
            className='w-full cursor-pointer border-0 text-transparent caret-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0'
            onClick={handleTypeDropdownClick}
            onFocus={handleTypeFocus}
            onBlur={handleTypeBlur}
          />
          <div className='pointer-events-none absolute inset-0 flex items-center overflow-hidden bg-transparent px-3 text-sm'>
            <div className='whitespace-pre text-muted-foreground'>
              {formatDisplayText(cellValue, {
                accessiblePrefixes,
                highlightAll: !accessiblePrefixes,
              })}
            </div>
          </div>
          {showTypeDropdown && !isReadOnly && (
            <div className='absolute top-full left-0 z-[100] mt-1 w-full'>
              <div className='allow-scroll fade-in-0 zoom-in-95 animate-in rounded-md border bg-popover text-popover-foreground shadow-lg'>
                <div
                  className='allow-scroll max-h-48 overflow-y-auto p-1'
                  style={{ scrollbarWidth: 'thin' }}
                >
                  {typeOptions.map((option) => (
                    <div
                      key={option.value}
                      className='relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground'
                      onMouseDown={(e) => {
                        e.preventDefault()
                        handleCellChange(rowIndex, 'type', option.value)
                        setShowTypeDropdown(false)
                      }}
                    >
                      <span className='flex-1 truncate'>{option.label}</span>
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

  const renderValueCell = (row: DocumentTagRow, rowIndex: number) => {
    const cellValue = row.cells.value || ''
    const cellKey = `value-${rowIndex}`

    const fieldState = inputController.fieldHelpers.getFieldState(cellKey)
    const handlers = inputController.fieldHelpers.createFieldHandlers(
      cellKey,
      cellValue,
      (newValue) => handleCellChange(rowIndex, 'value', newValue)
    )
    const tagSelectHandler = inputController.fieldHelpers.createTagSelectHandler(
      cellKey,
      cellValue,
      (newValue) => handleTagDropdownSelection(rowIndex, 'value', newValue)
    )

    return (
      <td className='p-1'>
        <div className='relative w-full'>
          <Input
            ref={(el) => {
              if (el) valueInputRefs.current[rowIndex] = el
            }}
            value={cellValue}
            onChange={handlers.onChange}
            onKeyDown={handlers.onKeyDown}
            onDrop={handlers.onDrop}
            onDragOver={handlers.onDragOver}
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
          {fieldState.showTags && (
            <TagDropdown
              visible={fieldState.showTags}
              onSelect={tagSelectHandler}
              blockId={blockId}
              activeSourceBlockId={fieldState.activeSourceBlockId}
              inputValue={cellValue}
              cursorPosition={fieldState.cursorPosition}
              onClose={() => inputController.fieldHelpers.hideFieldDropdowns(cellKey)}
              inputRef={
                {
                  current: valueInputRefs.current[rowIndex] || null,
                } as React.RefObject<HTMLInputElement>
              }
            />
          )}
        </div>
      </td>
    )
  }

  const renderDeleteButton = (rowIndex: number) => {
    // Allow deletion of any row
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

  // Show pre-fill button if there are available tags and only empty rows
  const showPreFillButton =
    tagDefinitions.length > 0 &&
    rows.length === 1 &&
    !rows[0].cells.tagName &&
    !rows[0].cells.value &&
    !isPreview &&
    !disabled

  return (
    <div className='relative'>
      {showPreFillButton && (
        <div className='mb-2'>
          <Button variant='outline' size='sm' onClick={handlePreFillTags}>
            Prefill Existing Tags
          </Button>
        </div>
      )}
      <div className='overflow-visible rounded-md border'>
        <table className='w-full'>
          {renderHeader()}
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.id} className='group relative border-t'>
                {renderTagNameCell(row, rowIndex)}
                {renderTypeCell(row, rowIndex)}
                {renderValueCell(row, rowIndex)}
                {renderDeleteButton(rowIndex)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Row Button and Tag slots usage indicator */}
      {!isPreview && !disabled && (
        <div className='mt-3 flex items-center justify-between'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleAddRow}
            disabled={!canAddMoreTags}
            className='h-7 px-2 text-xs'
          >
            <Plus className='mr-1 h-2.5 w-2.5' />
            Add Tag
          </Button>

          {/* Tag slots usage indicator */}
          <div className='text-muted-foreground text-xs'>
            {tagDefinitions.length + newTagsBeingCreated} of {MAX_TAG_SLOTS} tag slots used
          </div>
        </div>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: dropdown.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/dropdown/dropdown.tsx
Signals: React

```typescript
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Badge } from '@/components/emcn'
import { Combobox, type ComboboxOption } from '@/components/emcn/components'
import { useSubBlockValue } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-value'
import type { SubBlockConfig } from '@/blocks/types'
import { getDependsOnFields } from '@/blocks/utils'
import { ResponseBlockHandler } from '@/executor/handlers/response/response-handler'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'

/**
 * Dropdown option type - can be a simple string or an object with label, id, and optional icon
 */
type DropdownOption =
  | string
  | { label: string; id: string; icon?: React.ComponentType<{ className?: string }> }

/**
 * Props for the Dropdown component
 */
interface DropdownProps {
  /** Static options array or function that returns options */
  options: DropdownOption[] | (() => DropdownOption[])
  /** Default value to select when no value is set */
  defaultValue?: string
  /** Unique identifier for the block */
  blockId: string
  /** Unique identifier for the sub-block */
  subBlockId: string
  /** Current value(s) - string for single select, array for multi-select */
  value?: string | string[]
  /** Whether component is in preview mode */
  isPreview?: boolean
  /** Value to display in preview mode */
  previewValue?: string | string[] | null
  /** Whether the dropdown is disabled */
  disabled?: boolean
  /** Placeholder text when no value is selected */
  placeholder?: string
  /** Enable multi-select mode */
  multiSelect?: boolean
  /** Async function to fetch options dynamically */
  fetchOptions?: (
    blockId: string,
    subBlockId: string
  ) => Promise<Array<{ label: string; id: string }>>
  /** Field dependencies that trigger option refetch when changed */
  dependsOn?: SubBlockConfig['dependsOn']
}

/**
 * Dropdown component with support for single/multi-select, async options, and data mode conversion
 *
 * @remarks
 * - Supports both static and dynamic (fetched) options
 * - Can operate in single-select or multi-select mode
 * - Special handling for dataMode subblock to convert between JSON and structured formats
 * - Integrates with the workflow state management system
 */
export function Dropdown({
  options,
  defaultValue,
  blockId,
  subBlockId,
  value: propValue,
  isPreview = false,
  previewValue,
  disabled,
  placeholder = 'Select an option...',
  multiSelect = false,
  fetchOptions,
  dependsOn,
}: DropdownProps) {
  const [storeValue, setStoreValue] = useSubBlockValue<string | string[]>(blockId, subBlockId) as [
    string | string[] | null | undefined,
    (value: string | string[]) => void,
  ]

  const dependsOnFields = useMemo(() => getDependsOnFields(dependsOn), [dependsOn])

  const activeWorkflowId = useWorkflowRegistry((s) => s.activeWorkflowId)
  const dependencyValues = useSubBlockStore(
    useCallback(
      (state) => {
        if (dependsOnFields.length === 0 || !activeWorkflowId) return []
        const workflowValues = state.workflowValues[activeWorkflowId] || {}
        const blockValues = workflowValues[blockId] || {}
        return dependsOnFields.map((depKey) => blockValues[depKey] ?? null)
      },
      [dependsOnFields, activeWorkflowId, blockId]
    )
  )

  const [storeInitialized, setStoreInitialized] = useState(false)
  const [fetchedOptions, setFetchedOptions] = useState<Array<{ label: string; id: string }>>([])
  const [isLoadingOptions, setIsLoadingOptions] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const previousModeRef = useRef<string | null>(null)
  const previousDependencyValuesRef = useRef<string>('')

  const [builderData, setBuilderData] = useSubBlockValue<any[]>(blockId, 'builderData')
  const [data, setData] = useSubBlockValue<string>(blockId, 'data')

  const builderDataRef = useRef(builderData)
  const dataRef = useRef(data)

  useEffect(() => {
    builderDataRef.current = builderData
    dataRef.current = data
  }, [builderData, data])

  const value = isPreview ? previewValue : propValue !== undefined ? propValue : storeValue

  const singleValue = multiSelect ? null : (value as string | null | undefined)
  const multiValues = multiSelect ? (value as string[] | null | undefined) || [] : null

  const fetchOptionsIfNeeded = useCallback(async () => {
    if (!fetchOptions || isPreview || disabled) return

    setIsLoadingOptions(true)
    setFetchError(null)
    try {
      const options = await fetchOptions(blockId, subBlockId)
      setFetchedOptions(options)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch options'
      setFetchError(errorMessage)
      setFetchedOptions([])
    } finally {
      setIsLoadingOptions(false)
    }
  }, [fetchOptions, blockId, subBlockId, isPreview, disabled])

  const evaluatedOptions = useMemo(() => {
    return typeof options === 'function' ? options() : options
  }, [options])

  const normalizedFetchedOptions = useMemo(() => {
    return fetchedOptions.map((opt) => ({ label: opt.label, id: opt.id }))
  }, [fetchedOptions])

  const availableOptions = useMemo(() => {
    if (fetchOptions && normalizedFetchedOptions.length > 0) {
      return normalizedFetchedOptions
    }
    return evaluatedOptions
  }, [fetchOptions, normalizedFetchedOptions, evaluatedOptions])

  /**
   * Convert dropdown options to Combobox format
   */
  const comboboxOptions = useMemo((): ComboboxOption[] => {
    return availableOptions.map((opt) => {
      if (typeof opt === 'string') {
        return { label: opt.toLowerCase(), value: opt }
      }
      return {
        label: opt.label.toLowerCase(),
        value: opt.id,
        icon: 'icon' in opt ? opt.icon : undefined,
      }
    })
  }, [availableOptions])

  const optionMap = useMemo(() => {
    return new Map(comboboxOptions.map((opt) => [opt.value, opt.label]))
  }, [comboboxOptions])

  const defaultOptionValue = useMemo(() => {
    if (multiSelect) return undefined
    if (defaultValue !== undefined) {
      return defaultValue
    }

    if (comboboxOptions.length > 0) {
      return comboboxOptions[0].value
    }

    return undefined
  }, [defaultValue, comboboxOptions, multiSelect])

  useEffect(() => {
    setStoreInitialized(true)
  }, [])

  useEffect(() => {
    if (multiSelect || !storeInitialized || defaultOptionValue === undefined) {
      return
    }
    if (storeValue === null || storeValue === undefined || storeValue === '') {
      setStoreValue(defaultOptionValue)
    }
  }, [storeInitialized, storeValue, defaultOptionValue, setStoreValue, multiSelect])

  /**
   * Normalizes variable references in JSON strings by wrapping them in quotes
   * @param jsonString - The JSON string containing variable references
   * @returns Normalized JSON string with quoted variable references
   */
  const normalizeVariableReferences = (jsonString: string): string => {
    return jsonString.replace(/([^"]<[^>]+>)/g, '"$1"')
  }

  /**
   * Converts a JSON string to builder data format for structured editing
   * @param jsonString - The JSON string to convert
   * @returns Array of field objects with id, name, type, value, and collapsed properties
   */
  const convertJsonToBuilderData = (jsonString: string): any[] => {
    try {
      const normalizedJson = normalizeVariableReferences(jsonString)
      const parsed = JSON.parse(normalizedJson)

      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return Object.entries(parsed).map(([key, value]) => {
          const fieldType = inferType(value)
          const fieldValue =
            fieldType === 'object' || fieldType === 'array' ? JSON.stringify(value, null, 2) : value

          return {
            id: crypto.randomUUID(),
            name: key,
            type: fieldType,
            value: fieldValue,
            collapsed: false,
          }
        })
      }

      return []
    } catch (error) {
      return []
    }
  }

  /**
   * Infers the type of a value for builder data field configuration
   * @param value - The value to infer type from
   * @returns The inferred type as a string literal
   */
  const inferType = (value: any): 'string' | 'number' | 'boolean' | 'object' | 'array' => {
    if (typeof value === 'boolean') return 'boolean'
    if (typeof value === 'number') return 'number'
    if (Array.isArray(value)) return 'array'
    if (typeof value === 'object' && value !== null) return 'object'
    return 'string'
  }

  useEffect(() => {
    if (multiSelect || subBlockId !== 'dataMode' || isPreview || disabled) return

    const currentMode = storeValue as string
    const previousMode = previousModeRef.current

    if (previousMode !== null && previousMode !== currentMode) {
      if (currentMode === 'json' && previousMode === 'structured') {
        const currentBuilderData = builderDataRef.current
        if (
          currentBuilderData &&
          Array.isArray(currentBuilderData) &&
          currentBuilderData.length > 0
        ) {
          const jsonString = ResponseBlockHandler.convertBuilderDataToJsonString(currentBuilderData)
          setData(jsonString)
        }
      } else if (currentMode === 'structured' && previousMode === 'json') {
        const currentData = dataRef.current
        if (currentData && typeof currentData === 'string' && currentData.trim().length > 0) {
          const builderArray = convertJsonToBuilderData(currentData)
          setBuilderData(builderArray)
        }
      }
    }

    previousModeRef.current = currentMode
  }, [storeValue, subBlockId, isPreview, disabled, setData, setBuilderData, multiSelect])

  /**
   * Handles selection change for both single and multi-select modes
   */
  const handleChange = useCallback(
    (selectedValue: string) => {
      if (!isPreview && !disabled) {
        setStoreValue(selectedValue)
      }
    },
    [isPreview, disabled, setStoreValue]
  )

  /**
   * Handles multi-select changes
   */
  const handleMultiSelectChange = useCallback(
    (selectedValues: string[]) => {
      if (!isPreview && !disabled) {
        setStoreValue(selectedValues)
      }
    },
    [isPreview, disabled, setStoreValue]
  )

  /**
   * Effect to clear fetched options when dependencies actually change
   * This ensures options are refetched with new dependency values (e.g., new credentials)
   */
  useEffect(() => {
    if (fetchOptions && dependsOnFields.length > 0) {
      const currentDependencyValuesStr = JSON.stringify(dependencyValues)
      const previousDependencyValuesStr = previousDependencyValuesRef.current

      if (
        previousDependencyValuesStr &&
        currentDependencyValuesStr !== previousDependencyValuesStr
      ) {
        setFetchedOptions([])
      }

      previousDependencyValuesRef.current = currentDependencyValuesStr
    }
  }, [dependencyValues, fetchOptions, dependsOnFields.length])

  /**
   * Effect to fetch options when needed (on mount, when enabled, or when dependencies change)
   */
  useEffect(() => {
    if (
      fetchOptions &&
      !isPreview &&
      !disabled &&
      fetchedOptions.length === 0 &&
      !isLoadingOptions
    ) {
      fetchOptionsIfNeeded()
    }
  }, [
    fetchOptions,
    isPreview,
    disabled,
    fetchedOptions.length,
    isLoadingOptions,
    fetchOptionsIfNeeded,
    dependencyValues, // Refetch when dependencies change
  ])

  /**
   * Custom overlay content for multi-select mode showing badges
   */
  const multiSelectOverlay = useMemo(() => {
    if (!multiSelect || !multiValues || multiValues.length === 0) return undefined

    return (
      <div className='flex items-center gap-1 overflow-hidden whitespace-nowrap'>
        {multiValues.map((selectedValue: string) => (
          <Badge
            key={selectedValue}
            className='shrink-0 rounded-[8px] py-[4px] text-[12px] leading-none'
          >
            {(optionMap.get(selectedValue) || selectedValue).toLowerCase()}
          </Badge>
        ))}
      </div>
    )
  }, [multiSelect, multiValues, optionMap])

  const isSearchable = subBlockId === 'operation'

  return (
    <Combobox
      options={comboboxOptions}
      value={multiSelect ? undefined : (singleValue ?? undefined)}
      multiSelectValues={multiSelect ? (multiValues ?? undefined) : undefined}
      onChange={handleChange}
      onMultiSelectChange={handleMultiSelectChange}
      placeholder={placeholder}
      disabled={disabled}
      editable={false}
      onOpenChange={(open) => {
        if (open) {
          void fetchOptionsIfNeeded()
        }
      }}
      overlayContent={multiSelectOverlay}
      multiSelect={multiSelect}
      isLoading={isLoadingOptions}
      error={fetchError}
      searchable={isSearchable}
      searchPlaceholder='Search operations...'
    />
  )
}
```

--------------------------------------------------------------------------------

````
