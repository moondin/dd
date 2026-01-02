---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 421
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 421 of 933)

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

---[FILE: slack-selector-input.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/slack-selector/slack-selector-input.tsx
Signals: React, Next.js

```typescript
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { Tooltip } from '@/components/emcn'
import { getProviderIdFromServiceId } from '@/lib/oauth/oauth'
import { SelectorCombobox } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/selector-combobox/selector-combobox'
import { useDependsOnGate } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-depends-on-gate'
import { useForeignCredential } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-foreign-credential'
import { useSubBlockValue } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-value'
import type { SubBlockConfig } from '@/blocks/types'
import type { SelectorContext, SelectorKey } from '@/hooks/selectors/types'

type SlackSelectorType = 'channel-selector' | 'user-selector'

const SELECTOR_CONFIG: Record<
  SlackSelectorType,
  { selectorKey: SelectorKey; placeholder: string; label: string }
> = {
  'channel-selector': {
    selectorKey: 'slack.channels',
    placeholder: 'Select Slack channel',
    label: 'Channel',
  },
  'user-selector': {
    selectorKey: 'slack.users',
    placeholder: 'Select Slack user',
    label: 'User',
  },
}

interface SlackSelectorInputProps {
  blockId: string
  subBlock: SubBlockConfig
  disabled?: boolean
  onSelect?: (value: string) => void
  isPreview?: boolean
  previewValue?: any | null
  previewContextValues?: Record<string, any>
}

export function SlackSelectorInput({
  blockId,
  subBlock,
  disabled = false,
  onSelect,
  isPreview = false,
  previewValue,
  previewContextValues,
}: SlackSelectorInputProps) {
  const selectorType = subBlock.type as SlackSelectorType
  const config = SELECTOR_CONFIG[selectorType]

  const params = useParams()
  const workflowIdFromUrl = (params?.workflowId as string) || ''
  const [storeValue] = useSubBlockValue(blockId, subBlock.id)
  const [authMethod] = useSubBlockValue(blockId, 'authMethod')
  const [botToken] = useSubBlockValue(blockId, 'botToken')
  const [connectedCredential] = useSubBlockValue(blockId, 'credential')

  const effectiveAuthMethod = previewContextValues?.authMethod ?? authMethod
  const effectiveBotToken = previewContextValues?.botToken ?? botToken
  const effectiveCredential = previewContextValues?.credential ?? connectedCredential
  const [_selectedValue, setSelectedValue] = useState<string | null>(null)

  const serviceId = subBlock.serviceId || ''
  const effectiveProviderId = useMemo(() => getProviderIdFromServiceId(serviceId), [serviceId])
  const isSlack = serviceId === 'slack'

  const { finalDisabled, dependsOn } = useDependsOnGate(blockId, subBlock, {
    disabled,
    isPreview,
    previewContextValues,
  })

  const credential: string =
    (effectiveAuthMethod as string) === 'bot_token'
      ? (effectiveBotToken as string) || ''
      : (effectiveCredential as string) || ''

  const { isForeignCredential } = useForeignCredential(
    effectiveProviderId,
    (effectiveAuthMethod as string) === 'bot_token' ? '' : (effectiveCredential as string) || ''
  )

  useEffect(() => {
    const val = isPreview && previewValue !== undefined ? previewValue : storeValue
    if (typeof val === 'string') {
      setSelectedValue(val)
    }
  }, [isPreview, previewValue, storeValue])

  const requiresCredential = dependsOn.includes('credential')
  const missingCredential = !credential || credential.trim().length === 0
  const shouldForceDisable = requiresCredential && (missingCredential || isForeignCredential)

  const context: SelectorContext = useMemo(
    () => ({
      credentialId: credential,
      workflowId: workflowIdFromUrl,
    }),
    [credential, workflowIdFromUrl]
  )

  if (!isSlack) {
    return (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className='w-full rounded border p-4 text-center text-muted-foreground text-sm'>
            {config.label} selector not supported for service: {serviceId || 'unknown'}
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content side='top'>
          <p>
            This {config.label.toLowerCase()} selector is not yet implemented for{' '}
            {serviceId || 'unknown'}
          </p>
        </Tooltip.Content>
      </Tooltip.Root>
    )
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <div className='w-full'>
          <SelectorCombobox
            blockId={blockId}
            subBlock={subBlock}
            selectorKey={config.selectorKey}
            selectorContext={context}
            disabled={finalDisabled || shouldForceDisable || isForeignCredential}
            isPreview={isPreview}
            previewValue={previewValue ?? null}
            placeholder={subBlock.placeholder || config.placeholder}
            onOptionChange={(value) => {
              setSelectedValue(value)
              if (!isPreview) {
                onSelect?.(value)
              }
            }}
          />
        </div>
      </Tooltip.Trigger>
    </Tooltip.Root>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: slider-input.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/slider-input/slider-input.tsx
Signals: React

```typescript
import { useEffect } from 'react'
import { Slider } from '@/components/ui/slider'
import { useSubBlockValue } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-value'

interface SliderInputProps {
  blockId: string
  subBlockId: string
  min?: number
  max?: number
  defaultValue?: number
  step?: number
  integer?: boolean
  isPreview?: boolean
  previewValue?: number | null
  disabled?: boolean
}

export function SliderInput({
  blockId,
  subBlockId,
  min = 0,
  max = 100,
  defaultValue,
  step = 0.1,
  integer = false,
  isPreview = false,
  previewValue,
  disabled = false,
}: SliderInputProps) {
  // Smart default value: if no default provided, use midpoint or 0.7 for 0-1 ranges
  const computedDefaultValue = defaultValue ?? (max <= 1 ? 0.7 : (min + max) / 2)
  const [storeValue, setStoreValue] = useSubBlockValue<number>(blockId, subBlockId)

  // Use preview value when in preview mode, otherwise use store value
  const value = isPreview ? previewValue : storeValue

  // Clamp the value within bounds while preserving relative position when possible
  const normalizedValue =
    value !== null && value !== undefined
      ? Math.max(min, Math.min(max, value))
      : computedDefaultValue

  const displayValue = normalizedValue ?? computedDefaultValue

  // Ensure the normalized value is set if it differs from the current value
  useEffect(() => {
    if (!isPreview && value !== null && value !== undefined && value !== normalizedValue) {
      setStoreValue(normalizedValue)
    }
  }, [normalizedValue, value, setStoreValue, isPreview])

  const handleValueChange = (newValue: number[]) => {
    if (!isPreview && !disabled) {
      const processedValue = integer ? Math.round(newValue[0]) : newValue[0]
      setStoreValue(processedValue)
    }
  }

  const percentage = ((normalizedValue - min) / (max - min)) * 100

  return (
    <div className='relative pt-2 pb-[22px]'>
      <Slider
        value={[normalizedValue]}
        min={min}
        max={max}
        step={integer ? 1 : step}
        onValueChange={handleValueChange}
        disabled={isPreview || disabled}
        className='[&_[class*=SliderTrack]]:h-1 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:cursor-pointer'
      />
      <div
        className='absolute top-6 text-muted-foreground text-sm'
        style={{
          left: `${percentage}%`,
          transform: `translateX(-${percentage}%)`,
        }}
      >
        {integer ? Math.round(normalizedValue).toString() : Number(normalizedValue).toFixed(1)}
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: input-format.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/starter/input-format.tsx
Signals: React

```typescript
import { useRef } from 'react'
import { Plus } from 'lucide-react'
import { Trash } from '@/components/emcn/icons/trash'
import 'prismjs/components/prism-json'
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
  languages,
} from '@/components/emcn'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/core/utils/cn'
import { formatDisplayText } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/formatted-text'
import { TagDropdown } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/tag-dropdown/tag-dropdown'
import { useSubBlockInput } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-input'
import { useSubBlockValue } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-value'
import { useAccessibleReferencePrefixes } from '@/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-accessible-reference-prefixes'

interface Field {
  id: string
  name: string
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'files'
  value?: string
  collapsed?: boolean
}

interface FieldFormatProps {
  blockId: string
  subBlockId: string
  isPreview?: boolean
  previewValue?: Field[] | null
  disabled?: boolean
  title?: string
  placeholder?: string
  showType?: boolean
  showValue?: boolean
  valuePlaceholder?: string
  config?: any
}

/**
 * Type options for field type selection
 */
const TYPE_OPTIONS: ComboboxOption[] = [
  { label: 'String', value: 'string' },
  { label: 'Number', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Object', value: 'object' },
  { label: 'Array', value: 'array' },
  { label: 'Files', value: 'files' },
]

/**
 * Boolean value options for Combobox
 */
const BOOLEAN_OPTIONS: ComboboxOption[] = [
  { label: 'true', value: 'true' },
  { label: 'false', value: 'false' },
]

/**
 * Creates a new field with default values
 */
const createDefaultField = (): Field => ({
  id: crypto.randomUUID(),
  name: '',
  type: 'string',
  value: '',
  collapsed: false,
})

/**
 * Validates and sanitizes field names by removing control characters and quotes
 */
const validateFieldName = (name: string): string => name.replace(/[\x00-\x1F"\\]/g, '').trim()

export function FieldFormat({
  blockId,
  subBlockId,
  isPreview = false,
  previewValue,
  disabled = false,
  title = 'Field',
  placeholder = 'fieldName',
  showType = true,
  showValue = false,
  valuePlaceholder = 'Enter default value',
}: FieldFormatProps) {
  const [storeValue, setStoreValue] = useSubBlockValue<Field[]>(blockId, subBlockId)
  const valueInputRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement>>({})
  const overlayRefs = useRef<Record<string, HTMLDivElement>>({})
  const accessiblePrefixes = useAccessibleReferencePrefixes(blockId)

  const inputController = useSubBlockInput({
    blockId,
    subBlockId,
    config: {
      id: subBlockId,
      type: 'input-format',
      connectionDroppable: true,
    },
    isPreview,
    disabled,
  })

  const value = isPreview ? previewValue : storeValue
  const fields: Field[] = Array.isArray(value) && value.length > 0 ? value : [createDefaultField()]
  const isReadOnly = isPreview || disabled

  /**
   * Adds a new field to the list
   */
  const addField = () => {
    if (isReadOnly) return
    setStoreValue([...fields, createDefaultField()])
  }

  /**
   * Removes a field by ID, preventing removal of the last field
   */
  const removeField = (id: string) => {
    if (isReadOnly || fields.length === 1) return
    setStoreValue(fields.filter((field) => field.id !== id))
  }

  /**
   * Updates a specific field property
   */
  const updateField = (id: string, field: keyof Field, value: any) => {
    if (isReadOnly) return

    const updatedValue =
      field === 'name' && typeof value === 'string' ? validateFieldName(value) : value

    setStoreValue(fields.map((f) => (f.id === id ? { ...f, [field]: updatedValue } : f)))
  }

  /**
   * Toggles the collapsed state of a field
   */
  const toggleCollapse = (id: string) => {
    if (isReadOnly) return
    setStoreValue(fields.map((f) => (f.id === id ? { ...f, collapsed: !f.collapsed } : f)))
  }

  /**
   * Syncs scroll position between input and overlay for text highlighting
   */
  const syncOverlayScroll = (fieldId: string, scrollLeft: number) => {
    const overlay = overlayRefs.current[fieldId]
    if (overlay) overlay.scrollLeft = scrollLeft
  }

  /**
   * Renders the field header with name, type badge, and action buttons
   */
  const renderFieldHeader = (field: Field, index: number) => (
    <div
      className='flex cursor-pointer items-center justify-between bg-transparent px-[10px] py-[5px]'
      onClick={() => toggleCollapse(field.id)}
    >
      <div className='flex min-w-0 flex-1 items-center gap-[8px]'>
        <span className='block truncate font-medium text-[14px] text-[var(--text-tertiary)]'>
          {field.name || `${title} ${index + 1}`}
        </span>
        {field.name && showType && <Badge className='h-[20px] text-[13px]'>{field.type}</Badge>}
      </div>
      <div className='flex items-center gap-[8px] pl-[8px]' onClick={(e) => e.stopPropagation()}>
        <Button variant='ghost' onClick={addField} disabled={isReadOnly} className='h-auto p-0'>
          <Plus className='h-[14px] w-[14px]' />
          <span className='sr-only'>Add {title}</span>
        </Button>
        <Button
          variant='ghost'
          onClick={() => removeField(field.id)}
          disabled={isReadOnly || fields.length === 1}
          className='h-auto p-0 text-[var(--text-error)] hover:text-[var(--text-error)]'
        >
          <Trash className='h-[14px] w-[14px]' />
          <span className='sr-only'>Delete Field</span>
        </Button>
      </div>
    </div>
  )

  /**
   * Renders the value input field based on the field type
   */
  const renderValueInput = (field: Field) => {
    if (field.type === 'boolean') {
      return (
        <Combobox
          options={BOOLEAN_OPTIONS}
          value={field.value ?? ''}
          onChange={(v) => !isReadOnly && updateField(field.id, 'value', v)}
          placeholder='Select value'
          disabled={isReadOnly}
        />
      )
    }

    const fieldValue = field.value ?? ''
    const fieldState = inputController.fieldHelpers.getFieldState(field.id)
    const handlers = inputController.fieldHelpers.createFieldHandlers(
      field.id,
      fieldValue,
      (newValue) => updateField(field.id, 'value', newValue)
    )
    const tagSelectHandler = inputController.fieldHelpers.createTagSelectHandler(
      field.id,
      fieldValue,
      (newValue) => updateField(field.id, 'value', newValue)
    )

    const inputClassName = cn('text-transparent caret-foreground')

    const tagDropdown = fieldState.showTags && (
      <TagDropdown
        visible={fieldState.showTags}
        onSelect={tagSelectHandler}
        blockId={blockId}
        activeSourceBlockId={fieldState.activeSourceBlockId}
        inputValue={fieldValue}
        cursorPosition={fieldState.cursorPosition}
        onClose={() => inputController.fieldHelpers.hideFieldDropdowns(field.id)}
        inputRef={{ current: valueInputRefs.current[field.id] || null }}
      />
    )

    if (field.type === 'object') {
      const lineCount = fieldValue.split('\n').length
      const gutterWidth = calculateGutterWidth(lineCount)

      const renderLineNumbers = () => {
        return Array.from({ length: lineCount }, (_, i) => (
          <div
            key={i}
            className='font-medium font-mono text-[var(--text-muted)] text-xs'
            style={{ height: `${21}px`, lineHeight: `${21}px` }}
          >
            {i + 1}
          </div>
        ))
      }

      return (
        <Code.Container className='min-h-[120px]'>
          <Code.Gutter width={gutterWidth}>{renderLineNumbers()}</Code.Gutter>
          <Code.Content paddingLeft={`${gutterWidth}px`}>
            <Code.Placeholder gutterWidth={gutterWidth} show={fieldValue.length === 0}>
              {'{\n  "key": "value"\n}'}
            </Code.Placeholder>
            <Editor
              value={fieldValue}
              onValueChange={(newValue) => {
                if (!isReadOnly) {
                  updateField(field.id, 'value', newValue)
                }
              }}
              highlight={(code) => highlight(code, languages.json, 'json')}
              disabled={isReadOnly}
              {...getCodeEditorProps({ disabled: isReadOnly })}
            />
          </Code.Content>
        </Code.Container>
      )
    }

    if (field.type === 'array') {
      const lineCount = fieldValue.split('\n').length
      const gutterWidth = calculateGutterWidth(lineCount)

      const renderLineNumbers = () => {
        return Array.from({ length: lineCount }, (_, i) => (
          <div
            key={i}
            className='font-medium font-mono text-[var(--text-muted)] text-xs'
            style={{ height: `${21}px`, lineHeight: `${21}px` }}
          >
            {i + 1}
          </div>
        ))
      }

      return (
        <Code.Container className='min-h-[120px]'>
          <Code.Gutter width={gutterWidth}>{renderLineNumbers()}</Code.Gutter>
          <Code.Content paddingLeft={`${gutterWidth}px`}>
            <Code.Placeholder gutterWidth={gutterWidth} show={fieldValue.length === 0}>
              {'[\n  1, 2, 3\n]'}
            </Code.Placeholder>
            <Editor
              value={fieldValue}
              onValueChange={(newValue) => {
                if (!isReadOnly) {
                  updateField(field.id, 'value', newValue)
                }
              }}
              highlight={(code) => highlight(code, languages.json, 'json')}
              disabled={isReadOnly}
              {...getCodeEditorProps({ disabled: isReadOnly })}
            />
          </Code.Content>
        </Code.Container>
      )
    }

    if (field.type === 'files') {
      const lineCount = fieldValue.split('\n').length
      const gutterWidth = calculateGutterWidth(lineCount)

      const renderLineNumbers = () => {
        return Array.from({ length: lineCount }, (_, i) => (
          <div
            key={i}
            className='font-medium font-mono text-[var(--text-muted)] text-xs'
            style={{ height: `${21}px`, lineHeight: `${21}px` }}
          >
            {i + 1}
          </div>
        ))
      }

      return (
        <Code.Container className='min-h-[120px]'>
          <Code.Gutter width={gutterWidth}>{renderLineNumbers()}</Code.Gutter>
          <Code.Content paddingLeft={`${gutterWidth}px`}>
            <Code.Placeholder gutterWidth={gutterWidth} show={fieldValue.length === 0}>
              {
                '[\n  {\n    "data": "<base64>",\n    "type": "file",\n    "name": "document.pdf",\n    "mime": "application/pdf"\n  }\n]'
              }
            </Code.Placeholder>
            <Editor
              value={fieldValue}
              onValueChange={(newValue) => {
                if (!isReadOnly) {
                  updateField(field.id, 'value', newValue)
                }
              }}
              highlight={(code) => highlight(code, languages.json, 'json')}
              disabled={isReadOnly}
              {...getCodeEditorProps({ disabled: isReadOnly })}
            />
          </Code.Content>
        </Code.Container>
      )
    }

    return (
      <>
        <Input
          ref={(el) => {
            if (el) valueInputRefs.current[field.id] = el
          }}
          name='value'
          value={fieldValue}
          onChange={handlers.onChange}
          onKeyDown={handlers.onKeyDown}
          onDrop={handlers.onDrop}
          onDragOver={handlers.onDragOver}
          onScroll={(e) => syncOverlayScroll(field.id, e.currentTarget.scrollLeft)}
          onPaste={() =>
            setTimeout(() => {
              const input = valueInputRefs.current[field.id] as HTMLInputElement | undefined
              input && syncOverlayScroll(field.id, input.scrollLeft)
            }, 0)
          }
          placeholder={valuePlaceholder}
          disabled={isReadOnly}
          autoComplete='off'
          className={cn('allow-scroll w-full overflow-auto', inputClassName)}
          style={{ overflowX: 'auto' }}
        />
        <div
          ref={(el) => {
            if (el) overlayRefs.current[field.id] = el
          }}
          className='pointer-events-none absolute inset-0 flex items-center overflow-x-auto bg-transparent px-[8px] py-[6px] font-medium font-sans text-sm'
          style={{ overflowX: 'auto' }}
        >
          <div
            className='w-full whitespace-pre'
            style={{ scrollbarWidth: 'none', minWidth: 'fit-content' }}
          >
            {formatDisplayText(
              fieldValue,
              accessiblePrefixes ? { accessiblePrefixes } : { highlightAll: true }
            )}
          </div>
        </div>
        {tagDropdown}
      </>
    )
  }

  return (
    <div className='space-y-[8px]'>
      {fields.map((field, index) => (
        <div
          key={field.id}
          data-field-id={field.id}
          className={cn(
            'rounded-[4px] border border-[var(--border-strong)] bg-[var(--surface-3)] dark:bg-[#1F1F1F]',
            field.collapsed ? 'overflow-hidden' : 'overflow-visible'
          )}
        >
          {renderFieldHeader(field, index)}

          {!field.collapsed && (
            <div className='flex flex-col gap-[6px] border-[var(--border-strong)] border-t px-[10px] pt-[6px] pb-[10px]'>
              <div className='flex flex-col gap-[4px]'>
                <Label className='text-[13px]'>Name</Label>
                <Input
                  name='name'
                  value={field.name}
                  onChange={(e) => updateField(field.id, 'name', e.target.value)}
                  placeholder={placeholder}
                  disabled={isReadOnly}
                  autoComplete='off'
                />
              </div>

              {showType && (
                <div className='space-y-[4px]'>
                  <Label className='text-[13px]'>Type</Label>
                  <Combobox
                    options={TYPE_OPTIONS}
                    value={field.type}
                    onChange={(value) => updateField(field.id, 'type', value)}
                    disabled={isReadOnly}
                  />
                </div>
              )}

              {showValue && (
                <div className='space-y-[4px]'>
                  <Label className='text-[13px]'>Value</Label>
                  <div className='relative'>{renderValueInput(field)}</div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export function InputFormat(props: Omit<FieldFormatProps, 'title' | 'placeholder'>) {
  return <FieldFormat {...props} title='Input' placeholder='firstName' />
}

export function ResponseFormat(
  props: Omit<
    FieldFormatProps,
    'title' | 'placeholder' | 'showType' | 'showValue' | 'valuePlaceholder'
  >
) {
  return (
    <FieldFormat
      {...props}
      title='Field'
      placeholder='output'
      showType={false}
      showValue={true}
      valuePlaceholder='Enter return value'
    />
  )
}

export type { Field as InputField, Field as ResponseField }
```

--------------------------------------------------------------------------------

---[FILE: switch.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/switch/switch.tsx

```typescript
import { Label } from '@/components/ui/label'
import { Switch as UISwitch } from '@/components/ui/switch'
import { useSubBlockValue } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-value'

interface SwitchProps {
  blockId: string
  subBlockId: string
  title: string
  value?: boolean
  isPreview?: boolean
  previewValue?: boolean | null
  disabled?: boolean
}

export function Switch({
  blockId,
  subBlockId,
  title,
  value: propValue,
  isPreview = false,
  previewValue,
  disabled = false,
}: SwitchProps) {
  const [storeValue, setStoreValue] = useSubBlockValue<boolean>(blockId, subBlockId)

  // Use preview value when in preview mode, otherwise use store value or prop value
  const value = isPreview ? previewValue : propValue !== undefined ? propValue : storeValue

  const handleChange = (checked: boolean) => {
    // Only update store when not in preview mode and not disabled
    if (!isPreview && !disabled) {
      setStoreValue(checked)
    }
  }

  return (
    <div className='flex items-center space-x-3'>
      <UISwitch
        id={`${blockId}-${subBlockId}`}
        checked={Boolean(value)}
        onCheckedChange={handleChange}
        disabled={isPreview || disabled}
      />
      <Label
        htmlFor={`${blockId}-${subBlockId}`}
        className='cursor-pointer font-medium font-sans text-[var(--text-primary)] text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50'
      >
        {title}
      </Label>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: table.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/table/table.tsx
Signals: React, Next.js

```typescript
import { useEffect, useMemo, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/emcn'
import { Trash } from '@/components/emcn/icons/trash'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/core/utils/cn'
import { createLogger } from '@/lib/logs/console/logger'
import { EnvVarDropdown } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/env-var-dropdown'
import { formatDisplayText } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/formatted-text'
import { TagDropdown } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/tag-dropdown/tag-dropdown'
import { useSubBlockInput } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-input'
import { useSubBlockValue } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-value'
import { useAccessibleReferencePrefixes } from '@/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-accessible-reference-prefixes'

const logger = createLogger('Table')

interface TableProps {
  blockId: string
  subBlockId: string
  columns: string[]
  isPreview?: boolean
  previewValue?: TableRow[] | null
  disabled?: boolean
}

interface TableRow {
  id: string
  cells: Record<string, string>
}

export function Table({
  blockId,
  subBlockId,
  columns,
  isPreview = false,
  previewValue,
  disabled = false,
}: TableProps) {
  const params = useParams()
  const workspaceId = params.workspaceId as string
  const [storeValue, setStoreValue] = useSubBlockValue<TableRow[]>(blockId, subBlockId)
  const accessiblePrefixes = useAccessibleReferencePrefixes(blockId)

  // Use the extended hook for field-level management
  const inputController = useSubBlockInput({
    blockId,
    subBlockId,
    config: {
      id: subBlockId,
      type: 'table',
      connectionDroppable: true,
    },
    isPreview,
    disabled,
  })

  // Use preview value when in preview mode, otherwise use store value
  const value = isPreview ? previewValue : storeValue

  // Create refs for input and overlay elements
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map())
  const overlayRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // Memoized template for empty cells for current columns
  const emptyCellsTemplate = useMemo(
    () => Object.fromEntries(columns.map((col) => [col, ''])),
    [columns]
  )

  /**
   * Initialize the table with a default empty row when the component mounts
   * and when the current store value is missing or empty.
   */
  useEffect(() => {
    if (!isPreview && !disabled && (!Array.isArray(storeValue) || storeValue.length === 0)) {
      const initialRow: TableRow = {
        id: crypto.randomUUID(),
        cells: { ...emptyCellsTemplate },
      }
      setStoreValue([initialRow])
    }
  }, [isPreview, disabled, storeValue, setStoreValue, emptyCellsTemplate])

  // Ensure value is properly typed and initialized
  const rows = useMemo(() => {
    if (!Array.isArray(value) || value.length === 0) {
      return [
        {
          id: crypto.randomUUID(),
          cells: { ...emptyCellsTemplate },
        },
      ]
    }

    // Validate and normalize each row without in-place mutation
    const validatedRows = value.map((row) => {
      const hasValidCells = row?.cells && typeof row.cells === 'object'
      if (!hasValidCells) {
        logger.warn('Fixing malformed table row:', row)
      }

      const normalizedCells = {
        ...emptyCellsTemplate,
        ...(hasValidCells ? row.cells : {}),
      }

      return {
        id: row?.id ?? crypto.randomUUID(),
        cells: normalizedCells,
      }
    })

    return validatedRows as TableRow[]
  }, [value, emptyCellsTemplate])

  // Helper to update a cell value
  const updateCellValue = (rowIndex: number, column: string, newValue: string) => {
    if (isPreview || disabled) return

    const updatedRows = [...rows].map((row, idx) => {
      if (idx === rowIndex) {
        const hasValidCells = row.cells && typeof row.cells === 'object'
        const baseCells = hasValidCells ? row.cells : { ...emptyCellsTemplate }
        if (!hasValidCells) logger.warn('Fixing malformed row cells during cell change:', row)

        return {
          ...row,
          cells: { ...baseCells, [column]: newValue },
        }
      }
      return row
    })

    if (rowIndex === rows.length - 1 && newValue !== '') {
      updatedRows.push({
        id: crypto.randomUUID(),
        cells: { ...emptyCellsTemplate },
      })
    }

    setStoreValue(updatedRows)
  }

  const handleDeleteRow = (rowIndex: number) => {
    if (isPreview || disabled || rows.length === 1) return
    setStoreValue(rows.filter((_, index) => index !== rowIndex))
  }

  const renderHeader = () => (
    <thead className='bg-transparent'>
      <tr className='border-[var(--border-strong)] border-b bg-transparent'>
        {columns.map((column, index) => (
          <th
            key={column}
            className={cn(
              'bg-transparent px-[10px] py-[5px] text-left font-medium text-[14px] text-[var(--text-tertiary)]',
              index < columns.length - 1 && 'border-[var(--border-strong)] border-r'
            )}
          >
            {column}
          </th>
        ))}
      </tr>
    </thead>
  )

  const renderCell = (row: TableRow, rowIndex: number, column: string, cellIndex: number) => {
    // Defensive programming: ensure row.cells exists and has the expected structure
    const hasValidCells = row.cells && typeof row.cells === 'object'
    if (!hasValidCells) logger.warn('Table row has malformed cells data:', row)

    const cells = hasValidCells ? row.cells : { ...emptyCellsTemplate }

    const cellValue = cells[column] || ''
    const cellKey = `${rowIndex}-${column}`

    // Get field state and handlers for this cell
    const fieldState = inputController.fieldHelpers.getFieldState(cellKey)
    const handlers = inputController.fieldHelpers.createFieldHandlers(
      cellKey,
      cellValue,
      (newValue) => updateCellValue(rowIndex, column, newValue)
    )
    const handleScroll = (e: React.UIEvent<HTMLInputElement>) => {
      const overlay = overlayRefs.current.get(cellKey)
      if (overlay) {
        overlay.scrollLeft = e.currentTarget.scrollLeft
      }
    }

    const syncScrollAfterUpdate = () => {
      requestAnimationFrame(() => {
        const input = inputRefs.current.get(cellKey)
        const overlay = overlayRefs.current.get(cellKey)
        if (input && overlay) {
          overlay.scrollLeft = input.scrollLeft
        }
      })
    }

    const baseTagSelectHandler = inputController.fieldHelpers.createTagSelectHandler(
      cellKey,
      cellValue,
      (newValue) => updateCellValue(rowIndex, column, newValue)
    )
    const tagSelectHandler = (tag: string) => {
      baseTagSelectHandler(tag)
      syncScrollAfterUpdate()
    }

    const baseEnvVarSelectHandler = inputController.fieldHelpers.createEnvVarSelectHandler(
      cellKey,
      cellValue,
      (newValue) => updateCellValue(rowIndex, column, newValue)
    )
    const envVarSelectHandler = (envVar: string) => {
      baseEnvVarSelectHandler(envVar)
      syncScrollAfterUpdate()
    }

    return (
      <td
        key={`${row.id}-${column}`}
        className={cn(
          'relative bg-transparent p-0',
          cellIndex < columns.length - 1 && 'border-[var(--border-strong)] border-r'
        )}
      >
        <div className='relative w-full'>
          <Input
            ref={(el) => {
              if (el) inputRefs.current.set(cellKey, el)
            }}
            value={cellValue}
            placeholder={column}
            onChange={handlers.onChange}
            onKeyDown={handlers.onKeyDown}
            onScroll={handleScroll}
            onDrop={handlers.onDrop}
            onDragOver={handlers.onDragOver}
            disabled={isPreview || disabled}
            autoComplete='off'
            className='w-full border-0 bg-transparent px-[10px] py-[8px] font-medium text-sm text-transparent leading-[21px] caret-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:ring-0 focus-visible:ring-offset-0'
          />
          <div
            ref={(el) => {
              if (el) overlayRefs.current.set(cellKey, el)
            }}
            data-overlay={cellKey}
            className='scrollbar-hide pointer-events-none absolute top-0 right-[10px] bottom-0 left-[10px] overflow-x-auto overflow-y-hidden bg-transparent'
          >
            <div className='whitespace-pre py-[8px] font-medium text-[var(--text-primary)] text-sm leading-[21px]'>
              {formatDisplayText(cellValue, {
                accessiblePrefixes,
                highlightAll: !accessiblePrefixes,
              })}
            </div>
          </div>
          {fieldState.showEnvVars && (
            <EnvVarDropdown
              visible={fieldState.showEnvVars}
              onSelect={envVarSelectHandler}
              searchTerm={fieldState.searchTerm}
              inputValue={cellValue}
              cursorPosition={fieldState.cursorPosition}
              workspaceId={workspaceId}
              onClose={() => inputController.fieldHelpers.hideFieldDropdowns(cellKey)}
              inputRef={
                {
                  current: inputRefs.current.get(cellKey) || null,
                } as React.RefObject<HTMLInputElement>
              }
            />
          )}
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
                  current: inputRefs.current.get(cellKey) || null,
                } as React.RefObject<HTMLInputElement>
              }
            />
          )}
        </div>
      </td>
    )
  }

  const renderDeleteButton = (rowIndex: number) =>
    rows.length > 1 &&
    !isPreview &&
    !disabled && (
      <td className='w-0 p-0'>
        <Button
          variant='ghost'
          className='-translate-y-1/2 absolute top-1/2 right-[8px] opacity-0 transition-opacity group-hover:opacity-100'
          onClick={() => handleDeleteRow(rowIndex)}
        >
          <Trash className='h-[14px] w-[14px]' />
        </Button>
      </td>
    )

  return (
    <div className='relative'>
      <div className='overflow-visible rounded-[4px] border border-[var(--border-strong)] bg-[var(--surface-2)] dark:bg-[#1F1F1F]'>
        <table className='w-full bg-transparent'>
          {renderHeader()}
          <tbody className='bg-transparent'>
            {rows.map((row, rowIndex) => (
              <tr
                key={row.id}
                className='group relative border-[var(--border-strong)] border-t bg-transparent'
              >
                {columns.map((column, cellIndex) => renderCell(row, rowIndex, column, cellIndex))}
                {renderDeleteButton(rowIndex)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

````
