---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 410
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 410 of 933)

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

---[FILE: formatted-text.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/formatted-text.tsx
Signals: React

```typescript
'use client'

import type { ReactNode } from 'react'
import { splitReferenceSegment } from '@/lib/workflows/sanitization/references'
import { REFERENCE } from '@/executor/constants'
import { createCombinedPattern } from '@/executor/utils/reference-validation'
import { normalizeBlockName } from '@/stores/workflows/utils'

export interface HighlightContext {
  accessiblePrefixes?: Set<string>
  highlightAll?: boolean
}

const SYSTEM_PREFIXES = new Set(['start', 'loop', 'parallel', 'variable'])

/**
 * Formats text by highlighting block references (<...>) and environment variables ({{...}})
 * Used in code editor, long inputs, and short inputs for consistent syntax highlighting
 */
export function formatDisplayText(text: string, context?: HighlightContext): ReactNode[] {
  if (!text) return []

  const shouldHighlightReference = (reference: string): boolean => {
    if (!reference.startsWith('<') || !reference.endsWith('>')) {
      return false
    }

    if (context?.highlightAll) {
      return true
    }

    const inner = reference.slice(1, -1)
    const [prefix] = inner.split('.')
    const normalizedPrefix = normalizeBlockName(prefix)

    if (SYSTEM_PREFIXES.has(normalizedPrefix)) {
      return true
    }

    if (context?.accessiblePrefixes?.has(normalizedPrefix)) {
      return true
    }

    return false
  }

  const nodes: ReactNode[] = []
  // Match variable references without allowing nested brackets to prevent matching across references
  // e.g., "<3. text <real.ref>" should match "<3" and "<real.ref>", not the whole string
  const regex = createCombinedPattern()
  let lastIndex = 0
  let key = 0

  const pushPlainText = (value: string) => {
    if (!value) return
    nodes.push(<span key={key++}>{value}</span>)
  }

  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    const matchText = match[0]
    const index = match.index

    if (index > lastIndex) {
      pushPlainText(text.slice(lastIndex, index))
    }

    if (matchText.startsWith(REFERENCE.ENV_VAR_START)) {
      nodes.push(
        <span key={key++} className='text-[#34B5FF]'>
          {matchText}
        </span>
      )
    } else {
      const split = splitReferenceSegment(matchText)

      if (split && shouldHighlightReference(split.reference)) {
        pushPlainText(split.leading)
        nodes.push(
          <span key={key++} className='text-[#34B5FF]'>
            {split.reference}
          </span>
        )
      } else {
        nodes.push(<span key={key++}>{matchText}</span>)
      }
    }

    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    pushPlainText(text.slice(lastIndex))
  }

  return nodes
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/index.ts

```typescript
export { CheckboxList } from './checkbox-list/checkbox-list'
export { Code } from './code/code'
export { ComboBox } from './combobox/combobox'
export { ConditionInput } from './condition-input/condition-input'
export { CredentialSelector } from './credential-selector/credential-selector'
export { DocumentSelector } from './document-selector/document-selector'
export { DocumentTagEntry } from './document-tag-entry/document-tag-entry'
export { Dropdown } from './dropdown/dropdown'
export { EvalInput } from './eval-input/eval-input'
export { FileSelectorInput } from './file-selector/file-selector-input'
export { FileUpload } from './file-upload/file-upload'
export { FolderSelectorInput } from './folder-selector/components/folder-selector-input'
export { GroupedCheckboxList } from './grouped-checkbox-list/grouped-checkbox-list'
export { InputMapping } from './input-mapping/input-mapping'
export { KnowledgeBaseSelector } from './knowledge-base-selector/knowledge-base-selector'
export { KnowledgeTagFilters } from './knowledge-tag-filters/knowledge-tag-filters'
export { LongInput } from './long-input/long-input'
export { McpDynamicArgs } from './mcp-dynamic-args/mcp-dynamic-args'
export { McpServerSelector } from './mcp-server-modal/mcp-server-selector'
export { McpToolSelector } from './mcp-server-modal/mcp-tool-selector'
export { MessagesInput } from './messages-input/messages-input'
export { ProjectSelectorInput } from './project-selector/project-selector-input'
export { ResponseFormat } from './response/response-format'
export { ScheduleSave } from './schedule-save/schedule-save'
export { ShortInput } from './short-input/short-input'
export { SlackSelectorInput } from './slack-selector/slack-selector-input'
export { SliderInput } from './slider-input/slider-input'
export { InputFormat } from './starter/input-format'
export { SubBlockInputController } from './sub-block-input-controller'
export { Switch } from './switch/switch'
export { Table } from './table/table'
export { Text } from './text/text'
export { TimeInput } from './time-input/time-input'
export { ToolInput } from './tool-input/tool-input'
export { TriggerSave } from './trigger-save/trigger-save'
export { VariablesInput } from './variables-input/variables-input'
```

--------------------------------------------------------------------------------

---[FILE: sub-block-dropdowns.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/sub-block-dropdowns.tsx

```typescript
import { EnvVarDropdown } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/env-var-dropdown'
import { TagDropdown } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/tag-dropdown/tag-dropdown'

/**
 * Props for the SubBlockDropdowns component.
 *
 * @remarks
 * This component renders the tag and env-var dropdowns based on the current state.
 * It should be used in conjunction with the useSubBlockDropdowns hook.
 */
export interface SubBlockDropdownsProps {
  /** Unique identifier for the block */
  blockId: string
  /** Unique identifier for the sub-block */
  subBlockId: string
  /** Whether the dropdowns should be visible at all */
  visible: boolean
  /** Whether env vars dropdown should be shown */
  showEnvVars: boolean
  /** Whether tags dropdown should be shown */
  showTags: boolean
  /** Current search term for env vars */
  searchTerm: string
  /** Current input value */
  inputValue: string
  /** Current cursor position */
  cursorPosition: number
  /** Active source block id for tag filtering */
  activeSourceBlockId: string | null
  /** Ref to the input element for dropdown positioning */
  inputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>
  /** Workspace id for env var scoping */
  workspaceId: string
  /** Callback when a tag is selected */
  onTagSelect: (newValue: string) => void
  /** Callback when an env var is selected */
  onEnvVarSelect: (newValue: string) => void
  /** Callback when dropdowns should close */
  onClose: () => void
}

/**
 * Renders the tag and env-var dropdowns for sub-block inputs.
 *
 * @remarks
 * This is a presentation component that displays the EnvVarDropdown and TagDropdown
 * components based on the current state. It does not manage state itself; all state
 * should come from the useSubBlockDropdowns hook.
 *
 * @example
 * ```tsx
 * const dropdowns = useSubBlockDropdowns({ blockId, subBlockId, config })
 *
 * <SubBlockDropdowns
 *   blockId={blockId}
 *   subBlockId={subBlockId}
 *   visible={!isPreview && !disabled}
 *   showEnvVars={dropdowns.showEnvVars}
 *   showTags={dropdowns.showTags}
 *   searchTerm={dropdowns.searchTerm}
 *   inputValue={dropdowns.inputValue}
 *   cursorPosition={dropdowns.cursorPosition}
 *   activeSourceBlockId={dropdowns.activeSourceBlockId}
 *   inputRef={dropdowns.inputRef}
 *   workspaceId={dropdowns.workspaceId}
 *   onTagSelect={(newValue) => dropdowns.handleTagSelect(newValue, onChange)}
 *   onEnvVarSelect={(newValue) => dropdowns.handleEnvVarSelect(newValue, onChange)}
 *   onClose={handleClose}
 * />
 * ```
 */
export function SubBlockDropdowns({
  blockId,
  subBlockId,
  visible,
  showEnvVars,
  showTags,
  searchTerm,
  inputValue,
  cursorPosition,
  activeSourceBlockId,
  inputRef,
  workspaceId,
  onTagSelect,
  onEnvVarSelect,
  onClose,
}: SubBlockDropdownsProps): React.ReactElement | null {
  if (!visible) return null

  return (
    <>
      <EnvVarDropdown
        visible={showEnvVars}
        onSelect={onEnvVarSelect}
        searchTerm={searchTerm}
        inputValue={inputValue}
        cursorPosition={cursorPosition}
        workspaceId={workspaceId}
        onClose={onClose}
        maxHeight='192px'
        inputRef={inputRef as React.RefObject<HTMLTextAreaElement | HTMLInputElement>}
      />
      <TagDropdown
        visible={showTags}
        onSelect={onTagSelect}
        blockId={blockId}
        activeSourceBlockId={activeSourceBlockId}
        inputValue={inputValue}
        cursorPosition={cursorPosition}
        onClose={onClose}
        inputRef={inputRef as React.RefObject<HTMLTextAreaElement | HTMLInputElement>}
      />
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: sub-block-input-controller.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/sub-block-input-controller.tsx
Signals: React

```typescript
import type React from 'react'
import { EnvVarDropdown } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/env-var-dropdown'
import { TagDropdown } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/tag-dropdown/tag-dropdown'
import { useSubBlockInput } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-input'
import type { SubBlockConfig } from '@/blocks/types'
import { useTagSelection } from '@/hooks/use-tag-selection'

/**
 * Props for the headless SubBlockInputController.
 *
 * @remarks
 * This component wires the useSubBlockInput controller to popovers (env-var and tag)
 * and exposes a render-prop for rendering the concrete input element.
 */
export interface SubBlockInputControllerProps {
  /** Workflow block identifier. */
  blockId: string
  /** Sub-block identifier. */
  subBlockId: string
  /** Sub-block configuration. */
  config: SubBlockConfig
  /** Optional externally controlled value. */
  value?: string
  /** Optional change handler for controlled inputs. */
  onChange?: (value: string) => void
  /** Whether the view is in preview mode. */
  isPreview?: boolean
  /** Whether the input should be disabled. */
  disabled?: boolean
  /** When true, user edits are blocked and streaming text may display. */
  isStreaming?: boolean
  /** Callback when streaming ends. */
  onStreamingEnd?: () => void
  /** Optional preview value for read-only preview. */
  previewValue?: string | null
  /** Optional workspace id for env var scoping. */
  workspaceId?: string
  /**
   * Optional callback to force/show the env var dropdown (e.g., API key fields).
   * Return { show: true, searchTerm?: string } to override defaults.
   * Called on 'change' (typing), 'focus', and 'deleteAll' (full selection delete/backspace).
   */
  shouldForceEnvDropdown?: (args: {
    value: string
    cursor: number
    event: 'change' | 'focus' | 'deleteAll'
  }) => { show: boolean; searchTerm?: string } | undefined
  /** Render prop for the actual input element. */
  children: (args: {
    ref: React.RefObject<HTMLTextAreaElement | HTMLInputElement>
    value: string
    disabled: boolean
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => void
    onDrop: (e: React.DragEvent<HTMLTextAreaElement | HTMLInputElement>) => void
    onDragOver: (e: React.DragEvent<HTMLTextAreaElement | HTMLInputElement>) => void
    onFocus: () => void
    onScroll?: (e: React.UIEvent<HTMLTextAreaElement>) => void
  }) => React.ReactNode
}

/**
 * Headless input behavior controller that renders env-var and tag popovers.
 */
export function SubBlockInputController(props: SubBlockInputControllerProps): React.ReactElement {
  const {
    blockId,
    subBlockId,
    config,
    value,
    onChange,
    isPreview,
    disabled,
    isStreaming,
    onStreamingEnd,
    previewValue,
    workspaceId,
    shouldForceEnvDropdown,
    children,
  } = props

  const ctrl = useSubBlockInput({
    blockId,
    subBlockId,
    config,
    value,
    onChange,
    isPreview,
    disabled,
    isStreaming,
    onStreamingEnd,
    previewValue,
    workspaceId,
    shouldForceEnvDropdown,
  })

  const emitTagSelection = useTagSelection(blockId, subBlockId)

  return (
    <>
      {children({
        ref: ctrl.inputRef,
        value: ctrl.valueString,
        disabled: ctrl.isDisabled,
        onChange: ctrl.handlers.onChange,
        onKeyDown: ctrl.handlers.onKeyDown,
        onDrop: ctrl.handlers.onDrop,
        onDragOver: ctrl.handlers.onDragOver,
        onFocus: ctrl.handlers.onFocus,
        onScroll: ctrl.handlers.onScroll,
      })}

      <EnvVarDropdown
        visible={ctrl.showEnvVars && !isStreaming}
        onSelect={(newValue: string) => {
          if (onChange) {
            onChange(newValue)
          } else if (!isPreview) {
            emitTagSelection(newValue)
          }
          ctrl.controls.hideEnvVars()
        }}
        searchTerm={ctrl.searchTerm}
        inputValue={ctrl.valueString}
        cursorPosition={ctrl.cursorPosition}
        workspaceId={ctrl.workspaceId}
        onClose={ctrl.controls.hideEnvVars}
        maxHeight='192px'
        inputRef={ctrl.inputRef}
      />

      <TagDropdown
        visible={ctrl.showTags && !isStreaming}
        onSelect={(newValue: string) => {
          if (onChange) {
            onChange(newValue)
          } else if (!isPreview) {
            emitTagSelection(newValue)
          }
          ctrl.controls.hideTags()
        }}
        blockId={blockId}
        activeSourceBlockId={ctrl.activeSourceBlockId}
        inputValue={ctrl.valueString}
        cursorPosition={ctrl.cursorPosition}
        onClose={ctrl.controls.hideTags}
        inputRef={ctrl.inputRef}
      />
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: checkbox-list.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/checkbox-list/checkbox-list.tsx

```typescript
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useSubBlockValue } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-value'

interface CheckboxListProps {
  blockId: string
  subBlockId: string
  title: string
  options: { label: string; id: string }[]
  isPreview?: boolean
  subBlockValues?: Record<string, any>
  disabled?: boolean
}

interface CheckboxItemProps {
  blockId: string
  option: { label: string; id: string }
  isPreview: boolean
  subBlockValues?: Record<string, any>
  disabled: boolean
}

/**
 * Individual checkbox item component that calls useSubBlockValue hook at top level
 */
function CheckboxItem({ blockId, option, isPreview, subBlockValues, disabled }: CheckboxItemProps) {
  const [storeValue, setStoreValue] = useSubBlockValue(blockId, option.id)

  // Get preview value for this specific option
  const previewValue = isPreview && subBlockValues ? subBlockValues[option.id]?.value : undefined

  // Use preview value when in preview mode, otherwise use store value
  const value = isPreview ? previewValue : storeValue

  const handleChange = (checked: boolean) => {
    // Only update store when not in preview mode or disabled
    if (!isPreview && !disabled) {
      setStoreValue(checked)
    }
  }

  return (
    <div className='flex items-center space-x-2'>
      <Checkbox
        id={`${blockId}-${option.id}`}
        checked={Boolean(value)}
        onCheckedChange={handleChange}
        disabled={isPreview || disabled}
      />
      <Label
        htmlFor={`${blockId}-${option.id}`}
        className='cursor-pointer font-medium font-sans text-[var(--text-primary)] text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50'
      >
        {option.label}
      </Label>
    </div>
  )
}

export function CheckboxList({
  blockId,
  subBlockId,
  title,
  options,
  isPreview = false,
  subBlockValues,
  disabled = false,
}: CheckboxListProps) {
  return (
    <div className='grid grid-cols-1 gap-4 pt-1'>
      {options.map((option) => (
        <CheckboxItem
          key={option.id}
          blockId={blockId}
          option={option}
          isPreview={isPreview}
          subBlockValues={subBlockValues}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
```

--------------------------------------------------------------------------------

````
