---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 416
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 416 of 933)

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

---[FILE: folder-selector-input.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/folder-selector/components/folder-selector-input.tsx
Signals: React

```typescript
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { getProviderIdFromServiceId } from '@/lib/oauth'
import { SelectorCombobox } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/selector-combobox/selector-combobox'
import { useDependsOnGate } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-depends-on-gate'
import { useForeignCredential } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-foreign-credential'
import { useSubBlockValue } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-value'
import type { SubBlockConfig } from '@/blocks/types'
import { resolveSelectorForSubBlock } from '@/hooks/selectors/resolution'
import { useCollaborativeWorkflow } from '@/hooks/use-collaborative-workflow'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

interface FolderSelectorInputProps {
  blockId: string
  subBlock: SubBlockConfig
  disabled?: boolean
  isPreview?: boolean
  previewValue?: any | null
}

export function FolderSelectorInput({
  blockId,
  subBlock,
  disabled = false,
  isPreview = false,
  previewValue,
}: FolderSelectorInputProps) {
  const [storeValue] = useSubBlockValue(blockId, subBlock.id)
  const [connectedCredential] = useSubBlockValue(blockId, 'credential')
  const { collaborativeSetSubblockValue } = useCollaborativeWorkflow()
  const { activeWorkflowId } = useWorkflowRegistry()
  const [selectedFolderId, setSelectedFolderId] = useState<string>('')

  // Derive provider from serviceId using OAuth config (same pattern as credential-selector)
  const serviceId = subBlock.serviceId || ''
  const effectiveProviderId = useMemo(() => getProviderIdFromServiceId(serviceId), [serviceId])
  const providerKey = serviceId.toLowerCase()

  const isCopyDestinationSelector =
    subBlock.canonicalParamId === 'copyDestinationId' ||
    subBlock.id === 'copyDestinationFolder' ||
    subBlock.id === 'manualCopyDestinationFolder'
  const { isForeignCredential } = useForeignCredential(
    effectiveProviderId,
    (connectedCredential as string) || ''
  )

  // Central dependsOn gating
  const { finalDisabled } = useDependsOnGate(blockId, subBlock, { disabled, isPreview })

  // Get the current value from the store or prop value if in preview mode
  useEffect(() => {
    if (finalDisabled) return
    if (isPreview && previewValue !== undefined) {
      setSelectedFolderId(previewValue)
      return
    }
    const current = storeValue as string | undefined
    if (current) {
      setSelectedFolderId(current)
      return
    }
    const shouldDefaultInbox = providerKey === 'gmail' && !isCopyDestinationSelector
    if (shouldDefaultInbox) {
      setSelectedFolderId('INBOX')
      if (!isPreview) {
        collaborativeSetSubblockValue(blockId, subBlock.id, 'INBOX')
      }
    }
  }, [
    blockId,
    subBlock.id,
    storeValue,
    collaborativeSetSubblockValue,
    isPreview,
    previewValue,
    finalDisabled,
    providerKey,
    isCopyDestinationSelector,
  ])

  const credentialId = (connectedCredential as string) || ''
  const missingCredential = credentialId.length === 0
  const selectorResolution = useMemo(
    () =>
      resolveSelectorForSubBlock(subBlock, {
        credentialId: credentialId || undefined,
        workflowId: activeWorkflowId || undefined,
      }),
    [subBlock, credentialId, activeWorkflowId]
  )

  const handleChange = useCallback(
    (value: string) => {
      setSelectedFolderId(value)
      if (!isPreview) {
        collaborativeSetSubblockValue(blockId, subBlock.id, value)
      }
    },
    [blockId, subBlock.id, collaborativeSetSubblockValue, isPreview]
  )

  return (
    <SelectorCombobox
      blockId={blockId}
      subBlock={subBlock}
      selectorKey={selectorResolution?.key ?? 'gmail.labels'}
      selectorContext={
        selectorResolution?.context ?? { credentialId, workflowId: activeWorkflowId || '' }
      }
      disabled={
        finalDisabled || isForeignCredential || missingCredential || !selectorResolution?.key
      }
      isPreview={isPreview}
      previewValue={previewValue ?? null}
      placeholder={subBlock.placeholder || 'Select folder'}
      onOptionChange={handleChange}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: grouped-checkbox-list.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/grouped-checkbox-list/grouped-checkbox-list.tsx
Signals: React

```typescript
'use client'

import { useMemo, useState } from 'react'
import { Settings2 } from 'lucide-react'
import { Button } from '@/components/emcn/components'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/core/utils/cn'
import { useSubBlockValue } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-value'

interface GroupedCheckboxListProps {
  blockId: string
  subBlockId: string
  title: string
  options: { label: string; id: string; group?: string }[]
  isPreview?: boolean
  subBlockValues: Record<string, any>
  disabled?: boolean
  maxHeight?: number
}

export function GroupedCheckboxList({
  blockId,
  subBlockId,
  title,
  options,
  isPreview = false,
  subBlockValues,
  disabled = false,
  maxHeight = 400,
}: GroupedCheckboxListProps) {
  const [open, setOpen] = useState(false)
  const [storeValue, setStoreValue] = useSubBlockValue(blockId, subBlockId)

  const previewValue = isPreview && subBlockValues ? subBlockValues[subBlockId]?.value : undefined
  const selectedValues = ((isPreview ? previewValue : storeValue) as string[]) || []

  const groupedOptions = useMemo(() => {
    const groups: Record<string, { label: string; id: string }[]> = {}

    options.forEach((option) => {
      const groupName = option.group || 'Other'
      if (!groups[groupName]) {
        groups[groupName] = []
      }
      groups[groupName].push({ label: option.label, id: option.id })
    })

    return groups
  }, [options])

  const handleToggle = (optionId: string) => {
    if (isPreview || disabled) return

    const currentValues = (selectedValues || []) as string[]
    const newValues = currentValues.includes(optionId)
      ? currentValues.filter((id) => id !== optionId)
      : [...currentValues, optionId]

    setStoreValue(newValues)
  }

  const handleSelectAll = () => {
    if (isPreview || disabled) return
    const allIds = options.map((opt) => opt.id)
    setStoreValue(allIds)
  }

  const handleClear = () => {
    if (isPreview || disabled) return
    setStoreValue([])
  }

  const allSelected = selectedValues.length === options.length
  const noneSelected = selectedValues.length === 0

  const SelectedCountDisplay = () => {
    if (noneSelected) {
      return (
        <span className='truncate font-medium text-[var(--text-muted)] text-sm'>None selected</span>
      )
    }
    if (allSelected) {
      return (
        <span className='truncate font-medium text-[var(--text-primary)] text-sm'>
          All selected
        </span>
      )
    }
    return (
      <span className='truncate font-medium text-[var(--text-primary)] text-sm'>
        {selectedValues.length} selected
      </span>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          disabled={disabled}
          className={cn(
            'flex w-full cursor-pointer items-center justify-between rounded-[4px] border border-[var(--surface-11)] bg-[var(--surface-6)] px-[8px] py-[6px] font-medium font-sans text-[var(--text-primary)] text-sm outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-[var(--surface-9)]',
            'hover:border-[var(--surface-14)] hover:bg-[var(--surface-9)] dark:hover:border-[var(--surface-13)] dark:hover:bg-[var(--surface-11)]'
          )}
        >
          <span className='flex flex-1 items-center gap-2 truncate text-[var(--text-muted)]'>
            <Settings2 className='h-4 w-4 flex-shrink-0 opacity-50' />
            <span className='truncate'>Configure PII Types</span>
          </span>
          <SelectedCountDisplay />
        </Button>
      </DialogTrigger>
      <DialogContent
        className='flex max-h-[80vh] max-w-2xl flex-col'
        onWheel={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Select PII Types to Detect</DialogTitle>
          <p className='text-muted-foreground text-sm'>
            Choose which types of personally identifiable information to detect and block.
          </p>
        </DialogHeader>

        {/* Header with Select All and Clear */}
        <div className='flex items-center justify-between border-b pb-3'>
          <div className='flex items-center gap-2'>
            <Checkbox
              id='select-all'
              checked={allSelected}
              onCheckedChange={(checked) => {
                if (checked) {
                  handleSelectAll()
                } else {
                  handleClear()
                }
              }}
              disabled={disabled}
            />
            <label
              htmlFor='select-all'
              className='cursor-pointer font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Select all entities
            </label>
          </div>
          <Button variant='ghost' onClick={handleClear} disabled={disabled || noneSelected}>
            <span className='flex items-center gap-1'>
              Clear{!noneSelected && <span>({selectedValues.length})</span>}
            </span>
          </Button>
        </div>

        {/* Scrollable grouped checkboxes */}
        <div
          className='flex-1 overflow-y-auto pr-4'
          onWheel={(e) => e.stopPropagation()}
          style={{ maxHeight: '60vh' }}
        >
          <div className='space-y-6'>
            {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
              <div key={groupName}>
                <h3 className='mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider'>
                  {groupName}
                </h3>
                <div className='space-y-3'>
                  {groupOptions.map((option) => (
                    <div key={option.id} className='flex items-center gap-2'>
                      <Checkbox
                        id={`${subBlockId}-${option.id}`}
                        checked={selectedValues.includes(option.id)}
                        onCheckedChange={() => handleToggle(option.id)}
                        disabled={disabled}
                      />
                      <label
                        htmlFor={`${subBlockId}-${option.id}`}
                        className='cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: input-mapping.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/input-mapping/input-mapping.tsx
Signals: React

```typescript
import { useEffect, useMemo, useRef, useState } from 'react'
import { Badge, Input } from '@/components/emcn'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/core/utils/cn'
import { formatDisplayText } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/formatted-text'
import { TagDropdown } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/tag-dropdown/tag-dropdown'
import { useSubBlockInput } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-input'
import { useSubBlockValue } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-value'
import { useAccessibleReferencePrefixes } from '@/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-accessible-reference-prefixes'

/**
 * Represents a field in the input format configuration
 */
interface InputFormatField {
  name: string
  type?: string
}

/**
 * Represents an input trigger block structure
 */
interface InputTriggerBlock {
  type: 'input_trigger' | 'start_trigger'
  subBlocks?: {
    inputFormat?: { value?: InputFormatField[] }
  }
}

/**
 * Represents a legacy starter block structure
 */
interface StarterBlockLegacy {
  type: 'starter'
  subBlocks?: {
    inputFormat?: { value?: InputFormatField[] }
  }
  config?: {
    params?: {
      inputFormat?: InputFormatField[]
    }
  }
}

/**
 * Props for the InputMappingField component
 */
interface InputMappingFieldProps {
  fieldName: string
  fieldType?: string
  value: string
  onChange: (value: string) => void
  blockId: string
  disabled: boolean
  accessiblePrefixes: Set<string> | undefined
  inputController: ReturnType<typeof useSubBlockInput>
  inputRefs: React.RefObject<Map<string, HTMLInputElement>>
  overlayRefs: React.RefObject<Map<string, HTMLDivElement>>
  collapsed: boolean
  onToggleCollapse: () => void
}

/**
 * Props for the InputMapping component
 */
interface InputMappingProps {
  blockId: string
  subBlockId: string
  isPreview?: boolean
  previewValue?: Record<string, unknown>
  disabled?: boolean
}

/**
 * Type guard to check if a value is an InputTriggerBlock
 * @param value - The value to check
 * @returns True if the value is an InputTriggerBlock
 */
function isInputTriggerBlock(value: unknown): value is InputTriggerBlock {
  const type = (value as { type?: unknown }).type
  return (
    !!value && typeof value === 'object' && (type === 'input_trigger' || type === 'start_trigger')
  )
}

/**
 * Type guard to check if a value is a StarterBlockLegacy
 * @param value - The value to check
 * @returns True if the value is a StarterBlockLegacy
 */
function isStarterBlock(value: unknown): value is StarterBlockLegacy {
  return !!value && typeof value === 'object' && (value as { type?: unknown }).type === 'starter'
}

/**
 * Type guard to check if a value is an InputFormatField
 * @param value - The value to check
 * @returns True if the value is an InputFormatField
 */
function isInputFormatField(value: unknown): value is InputFormatField {
  if (typeof value !== 'object' || value === null) return false
  if (!('name' in value)) return false
  const { name, type } = value as { name: unknown; type?: unknown }
  if (typeof name !== 'string' || name.trim() === '') return false
  if (type !== undefined && typeof type !== 'string') return false
  return true
}

/**
 * Extracts input format fields from workflow blocks
 * @param blocks - The workflow blocks to extract from
 * @returns Array of input format fields or null if not found
 */
function extractInputFormatFields(blocks: Record<string, unknown>): InputFormatField[] | null {
  const triggerEntry = Object.entries(blocks).find(([, b]) => isInputTriggerBlock(b))
  if (triggerEntry && isInputTriggerBlock(triggerEntry[1])) {
    const inputFormat = triggerEntry[1].subBlocks?.inputFormat?.value
    if (Array.isArray(inputFormat)) {
      return (inputFormat as unknown[])
        .filter(isInputFormatField)
        .map((f) => ({ name: f.name, type: f.type }))
    }
  }

  const starterEntry = Object.entries(blocks).find(([, b]) => isStarterBlock(b))
  if (starterEntry && isStarterBlock(starterEntry[1])) {
    const starter = starterEntry[1]
    const subBlockFormat = starter.subBlocks?.inputFormat?.value
    const legacyParamsFormat = starter.config?.params?.inputFormat
    const chosen = Array.isArray(subBlockFormat) ? subBlockFormat : legacyParamsFormat
    if (Array.isArray(chosen)) {
      return (chosen as unknown[])
        .filter(isInputFormatField)
        .map((f) => ({ name: f.name, type: f.type }))
    }
  }

  return null
}

/**
 * InputMapping component displays and manages input field mappings for workflow execution
 * @param props - The component props
 * @returns The rendered InputMapping component
 */
export function InputMapping({
  blockId,
  subBlockId,
  isPreview = false,
  previewValue,
  disabled = false,
}: InputMappingProps) {
  const [mapping, setMapping] = useSubBlockValue(blockId, subBlockId)
  const [selectedWorkflowId] = useSubBlockValue(blockId, 'workflowId')

  const inputController = useSubBlockInput({
    blockId,
    subBlockId,
    config: {
      id: subBlockId,
      type: 'input-mapping',
      connectionDroppable: true,
    },
    isPreview,
    disabled,
  })

  const accessiblePrefixes = useAccessibleReferencePrefixes(blockId)
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map())
  const overlayRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const [childInputFields, setChildInputFields] = useState<InputFormatField[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [collapsedFields, setCollapsedFields] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    async function fetchChildSchema() {
      if (!selectedWorkflowId) {
        if (isMounted) {
          setChildInputFields([])
          setIsLoading(false)
        }
        return
      }

      try {
        if (isMounted) setIsLoading(true)

        const res = await fetch(`/api/workflows/${selectedWorkflowId}`, {
          signal: controller.signal,
        })

        if (!res.ok) {
          if (isMounted) {
            setChildInputFields([])
            setIsLoading(false)
          }
          return
        }

        const { data } = await res.json()
        const blocks = (data?.state?.blocks as Record<string, unknown>) || {}
        const fields = extractInputFormatFields(blocks)

        if (isMounted) {
          setChildInputFields(fields || [])
          setIsLoading(false)
        }
      } catch (error) {
        if (isMounted) {
          setChildInputFields([])
          setIsLoading(false)
        }
      }
    }

    fetchChildSchema()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [selectedWorkflowId])

  const valueObj: Record<string, string> = useMemo(() => {
    if (isPreview && previewValue && typeof previewValue === 'object') {
      return previewValue as Record<string, string>
    }
    if (mapping && typeof mapping === 'object') {
      return mapping as Record<string, string>
    }
    try {
      if (typeof mapping === 'string') {
        return JSON.parse(mapping)
      }
    } catch {
      // Invalid JSON, return empty object
    }
    return {}
  }, [mapping, isPreview, previewValue])

  const handleFieldUpdate = (field: string, value: string) => {
    if (disabled) return
    const updated = { ...valueObj, [field]: value }
    setMapping(updated)
  }

  const toggleCollapse = (fieldName: string) => {
    setCollapsedFields((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }))
  }

  if (!selectedWorkflowId) {
    return (
      <div className='flex flex-col items-center justify-center rounded-[4px] border border-[var(--border-strong)] bg-[var(--surface-3)] p-8 text-center dark:bg-[#1F1F1F]'>
        <svg
          className='mb-3 h-10 w-10 text-[var(--text-tertiary)]'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M13 10V3L4 14h7v7l9-11h-7z'
          />
        </svg>
        <p className='font-medium text-[var(--text-tertiary)] text-sm'>No workflow selected</p>
        <p className='mt-1 text-[var(--text-tertiary)]/80 text-xs'>
          Select a workflow above to configure inputs
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className='space-y-[8px]'>
        <InputMappingField
          key='loading'
          fieldName='loading...'
          value=''
          onChange={() => {}}
          blockId={blockId}
          disabled={true}
          accessiblePrefixes={accessiblePrefixes}
          inputController={inputController}
          inputRefs={inputRefs}
          overlayRefs={overlayRefs}
          collapsed={false}
          onToggleCollapse={() => {}}
        />
      </div>
    )
  }

  if (!childInputFields || childInputFields.length === 0) {
    return <p className='text-[var(--text-muted)] text-sm'>No inputs available</p>
  }

  return (
    <div className='space-y-[8px]'>
      {childInputFields.map((field) => (
        <InputMappingField
          key={field.name}
          fieldName={field.name}
          fieldType={field.type}
          value={valueObj[field.name] || ''}
          onChange={(value) => handleFieldUpdate(field.name, value)}
          blockId={blockId}
          disabled={isPreview || disabled}
          accessiblePrefixes={accessiblePrefixes}
          inputController={inputController}
          inputRefs={inputRefs}
          overlayRefs={overlayRefs}
          collapsed={collapsedFields[field.name] || false}
          onToggleCollapse={() => toggleCollapse(field.name)}
        />
      ))}
    </div>
  )
}

/**
 * InputMappingField component renders an individual input field with tag dropdown support
 * @param props - The component props
 * @returns The rendered InputMappingField component
 */
function InputMappingField({
  fieldName,
  fieldType,
  value,
  onChange,
  blockId,
  disabled,
  accessiblePrefixes,
  inputController,
  inputRefs,
  overlayRefs,
  collapsed,
  onToggleCollapse,
}: InputMappingFieldProps) {
  const fieldId = fieldName
  const fieldState = inputController.fieldHelpers.getFieldState(fieldId)
  const handlers = inputController.fieldHelpers.createFieldHandlers(fieldId, value, onChange)
  const tagSelectHandler = inputController.fieldHelpers.createTagSelectHandler(
    fieldId,
    value,
    onChange
  )

  /**
   * Synchronizes scroll position between input and overlay
   * @param e - The scroll event
   */
  const handleScroll = (e: React.UIEvent<HTMLInputElement>) => {
    const overlay = overlayRefs.current.get(fieldId)
    if (overlay) {
      overlay.scrollLeft = e.currentTarget.scrollLeft
    }
  }

  return (
    <div
      className={cn(
        'rounded-[4px] border border-[var(--border-strong)] bg-[var(--surface-3)] dark:bg-[#1F1F1F]',
        collapsed ? 'overflow-hidden' : 'overflow-visible'
      )}
    >
      <div
        className='flex cursor-pointer items-center justify-between bg-transparent px-[10px] py-[5px]'
        onClick={onToggleCollapse}
      >
        <div className='flex min-w-0 flex-1 items-center gap-[8px]'>
          <span className='block truncate font-medium text-[14px] text-[var(--text-tertiary)]'>
            {fieldName}
          </span>
          {fieldType && <Badge className='h-[20px] text-[13px]'>{fieldType}</Badge>}
        </div>
      </div>

      {!collapsed && (
        <div className='flex flex-col gap-[6px] border-[var(--border-strong)] border-t px-[10px] pt-[6px] pb-[10px]'>
          <div className='space-y-[4px]'>
            <Label className='text-[13px]'>Value</Label>
            <div className='relative'>
              <Input
                ref={(el) => {
                  if (el) inputRefs.current.set(fieldId, el)
                }}
                name='value'
                value={value}
                onChange={handlers.onChange}
                onKeyDown={handlers.onKeyDown}
                onDrop={handlers.onDrop}
                onDragOver={handlers.onDragOver}
                onScroll={(e) => handleScroll(e)}
                onPaste={() =>
                  setTimeout(() => {
                    const input = inputRefs.current.get(fieldId)
                    input && handleScroll({ currentTarget: input } as any)
                  }, 0)
                }
                placeholder='Enter value or reference'
                disabled={disabled}
                autoComplete='off'
                className={cn(
                  'allow-scroll w-full overflow-auto text-transparent caret-foreground'
                )}
                style={{ overflowX: 'auto' }}
              />
              <div
                ref={(el) => {
                  if (el) overlayRefs.current.set(fieldId, el)
                }}
                className='pointer-events-none absolute inset-0 flex items-center overflow-x-auto bg-transparent px-[8px] py-[6px] font-medium font-sans text-sm'
                style={{ overflowX: 'auto' }}
              >
                <div
                  className='w-full whitespace-pre'
                  style={{ scrollbarWidth: 'none', minWidth: 'fit-content' }}
                >
                  {formatDisplayText(
                    value,
                    accessiblePrefixes ? { accessiblePrefixes } : { highlightAll: true }
                  )}
                </div>
              </div>
              {fieldState.showTags && (
                <TagDropdown
                  visible={fieldState.showTags}
                  onSelect={tagSelectHandler}
                  blockId={blockId}
                  activeSourceBlockId={fieldState.activeSourceBlockId}
                  inputValue={value}
                  cursorPosition={fieldState.cursorPosition}
                  onClose={() => inputController.fieldHelpers.hideFieldDropdowns(fieldId)}
                  inputRef={
                    {
                      current: inputRefs.current.get(fieldId) || null,
                    } as React.RefObject<HTMLInputElement>
                  }
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: knowledge-base-selector.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/knowledge-base-selector/knowledge-base-selector.tsx
Signals: React, Next.js

```typescript
'use client'

import { useCallback, useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useParams } from 'next/navigation'
import { Combobox, type ComboboxOption } from '@/components/emcn'
import { PackageSearchIcon } from '@/components/icons'
import { useSubBlockValue } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-value'
import type { SubBlockConfig } from '@/blocks/types'
import { fetchKnowledgeBase, knowledgeKeys } from '@/hooks/queries/knowledge'
import { useKnowledgeBasesList } from '@/hooks/use-knowledge'
import type { KnowledgeBaseData } from '@/stores/knowledge/store'

interface KnowledgeBaseSelectorProps {
  blockId: string
  subBlock: SubBlockConfig
  disabled?: boolean
  onKnowledgeBaseSelect?: (knowledgeBaseId: string | string[]) => void
  isPreview?: boolean
  previewValue?: string | null
}

export function KnowledgeBaseSelector({
  blockId,
  subBlock,
  disabled = false,
  onKnowledgeBaseSelect,
  isPreview = false,
  previewValue,
}: KnowledgeBaseSelectorProps) {
  const params = useParams()
  const workspaceId = params.workspaceId as string

  const {
    knowledgeBases,
    isLoading: isKnowledgeBasesLoading,
    error,
  } = useKnowledgeBasesList(workspaceId)

  // Use the proper hook to get the current value and setter - this prevents infinite loops
  const [storeValue, setStoreValue] = useSubBlockValue(blockId, subBlock.id)

  // Use preview value when in preview mode, otherwise use store value
  const value = isPreview ? previewValue : storeValue

  const isMultiSelect = subBlock.multiSelect === true

  /**
   * Parse value into array of selected IDs
   */
  const selectedIds = useMemo(() => {
    if (!value) return []
    if (typeof value === 'string') {
      return value.includes(',')
        ? value
            .split(',')
            .map((id) => id.trim())
            .filter((id) => id.length > 0)
        : [value]
    }
    return []
  }, [value])

  /**
   * Convert knowledge bases to combobox options format
   */
  const selectedKnowledgeBaseQueries = useQueries({
    queries: selectedIds.map((selectedId) => ({
      queryKey: knowledgeKeys.detail(selectedId),
      queryFn: () => fetchKnowledgeBase(selectedId),
      enabled: Boolean(selectedId),
      staleTime: 60 * 1000,
    })),
  })

  const combinedKnowledgeBases = useMemo<KnowledgeBaseData[]>(() => {
    const merged = new Map<string, KnowledgeBaseData>()
    knowledgeBases.forEach((kb) => merged.set(kb.id, kb))

    selectedKnowledgeBaseQueries.forEach((query) => {
      if (query.data) {
        merged.set(query.data.id, query.data)
      }
    })

    return Array.from(merged.values())
  }, [knowledgeBases, selectedKnowledgeBaseQueries])

  const options = useMemo<ComboboxOption[]>(() => {
    return combinedKnowledgeBases.map((kb) => ({
      label: kb.name,
      value: kb.id,
      icon: PackageSearchIcon,
    }))
  }, [combinedKnowledgeBases])

  /**
   * Compute selected knowledge bases for tag display
   */
  const selectedKnowledgeBases = useMemo<KnowledgeBaseData[]>(() => {
    if (selectedIds.length === 0) return []

    const lookup = new Map<string, KnowledgeBaseData>()
    combinedKnowledgeBases.forEach((kb) => {
      lookup.set(kb.id, kb)
    })

    return selectedIds
      .map((id) => lookup.get(id))
      .filter((kb): kb is KnowledgeBaseData => Boolean(kb))
  }, [selectedIds, combinedKnowledgeBases])

  /**
   * Handle single selection
   */
  const handleChange = useCallback(
    (selectedValue: string) => {
      if (isPreview) return

      setStoreValue(selectedValue)
      onKnowledgeBaseSelect?.(selectedValue)
    },
    [isPreview, setStoreValue, onKnowledgeBaseSelect]
  )

  /**
   * Handle multi-select changes
   */
  const handleMultiSelectChange = useCallback(
    (values: string[]) => {
      if (isPreview) return

      const valueToStore = values.length === 1 ? values[0] : values.join(',')
      setStoreValue(valueToStore)
      onKnowledgeBaseSelect?.(values)
    },
    [isPreview, setStoreValue, onKnowledgeBaseSelect]
  )

  /**
   * Remove selected knowledge base from multi-select tags
   */
  const handleRemoveKnowledgeBase = useCallback(
    (knowledgeBaseId: string) => {
      if (isPreview) return

      const newSelectedIds = selectedIds.filter((id) => id !== knowledgeBaseId)
      const valueToStore =
        newSelectedIds.length === 1 ? newSelectedIds[0] : newSelectedIds.join(',')

      setStoreValue(valueToStore)
      onKnowledgeBaseSelect?.(newSelectedIds)
    },
    [isPreview, selectedIds, setStoreValue, onKnowledgeBaseSelect]
  )

  const label =
    subBlock.placeholder || (isMultiSelect ? 'Select knowledge bases' : 'Select knowledge base')

  return (
    <div className='w-full'>
      {/* Selected knowledge bases display (for multi-select) */}
      {isMultiSelect && selectedKnowledgeBases.length > 0 && (
        <div className='mb-2 flex flex-wrap gap-1'>
          {selectedKnowledgeBases.map((kb) => (
            <div
              key={kb.id}
              className='inline-flex items-center rounded-md border border-[#00B0B0]/20 bg-[#00B0B0]/10 px-2 py-1 text-xs'
            >
              <PackageSearchIcon className='mr-1 h-3 w-3 text-[#00B0B0]' />
              <span className='font-medium text-[#00B0B0]'>{kb.name}</span>
              {!disabled && !isPreview && (
                <button
                  type='button'
                  onClick={() => handleRemoveKnowledgeBase(kb.id)}
                  className='ml-1 text-[#00B0B0]/60 hover:text-[#00B0B0]'
                  aria-label={`Remove ${kb.name}`}
                >
                  <X className='h-3 w-3' />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Combobox
        options={options}
        value={isMultiSelect ? undefined : (selectedIds[0] ?? '')}
        multiSelect={isMultiSelect}
        multiSelectValues={isMultiSelect ? selectedIds : undefined}
        onChange={handleChange}
        onMultiSelectChange={handleMultiSelectChange}
        placeholder={label}
        disabled={disabled || isPreview}
        isLoading={isKnowledgeBasesLoading}
        error={error}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

````
