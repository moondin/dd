---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 429
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 429 of 933)

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

---[FILE: use-sub-block-input.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-input.ts
Signals: React, Next.js

```typescript
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { createLogger } from '@/lib/logs/console/logger'
import { checkEnvVarTrigger } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/env-var-dropdown'
import { checkTagTrigger } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/tag-dropdown/tag-dropdown'
import { useSubBlockValue } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-value'
import type { SubBlockConfig } from '@/blocks/types'
import { useTagSelection } from '@/hooks/use-tag-selection'

const logger = createLogger('useSubBlockInput')

/**
 * Options for the useSubBlockInput hook.
 *
 * @remarks
 * This controller centralizes shared input behaviors for sub-block inputs:
 * typing, caret tracking, env-var/tag triggers, DnD for connections, escape handling,
 * preview/disabled/streaming guards, and store synchronization.
 */
export interface UseSubBlockInputOptions {
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
  /** When true, user edits are blocked and streaming content may be displayed. */
  isStreaming?: boolean
  /** Callback invoked when streaming finishes; used to persist store value. */
  onStreamingEnd?: () => void
  /** Optional preview value for read-only preview displays. */
  previewValue?: string | null
  /** Optional workspace id; if omitted, derived from route params. */
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
}

/**
 * Field-level state for array-based inputs
 */
export interface FieldState {
  cursorPosition: number
  showEnvVars: boolean
  showTags: boolean
  searchTerm: string
  activeSourceBlockId: string | null
}

/**
 * Return shape for the useSubBlockInput hook.
 */
export interface UseSubBlockInputResult {
  /** Unified ref for anchoring popovers and reading caret. */
  inputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement>
  /** Current computed string value to render. */
  valueString: string
  /** Whether input interactions are disabled. */
  isDisabled: boolean
  /** Current caret position. */
  cursorPosition: number
  /** Whether env var dropdown should be visible. */
  showEnvVars: boolean
  /** Whether tag dropdown should be visible. */
  showTags: boolean
  /** Current env var search term. */
  searchTerm: string
  /** Active source block id for tag dropdown context. */
  activeSourceBlockId: string | null
  /** Handlers to attach to input-like components. */
  handlers: {
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => void
    onDrop: (e: React.DragEvent<HTMLTextAreaElement | HTMLInputElement>) => void
    onDragOver: (e: React.DragEvent<HTMLTextAreaElement | HTMLInputElement>) => void
    onFocus: () => void
    onScroll?: (e: React.UIEvent<HTMLTextAreaElement>) => void
  }
  /** Workspace id for env var dropdown scoping. */
  workspaceId: string | undefined
  /** Imperative controls for popovers. */
  controls: {
    hideEnvVars: () => void
    hideTags: () => void
    setActiveSourceBlockId: (id: string | null) => void
  }
  /** Field-level helpers for array-based inputs */
  fieldHelpers: {
    /** Get state for a specific field */
    getFieldState: (fieldId: string) => FieldState
    /** Create handlers for a specific field in an array */
    createFieldHandlers: (
      fieldId: string,
      fieldValue: string,
      onFieldChange: (newValue: string) => void
    ) => {
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
      onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => void
      onDrop: (e: React.DragEvent<HTMLTextAreaElement | HTMLInputElement>) => void
      onDragOver: (e: React.DragEvent<HTMLTextAreaElement | HTMLInputElement>) => void
    }
    /** Hide dropdowns for a specific field */
    hideFieldDropdowns: (fieldId: string) => void
    /** Create tag select handler for a field */
    createTagSelectHandler: (
      fieldId: string,
      fieldValue: string,
      onFieldChange: (newValue: string) => void
    ) => (newValue: string) => void
    /** Create env var select handler for a field */
    createEnvVarSelectHandler: (
      fieldId: string,
      fieldValue: string,
      onFieldChange: (newValue: string) => void
    ) => (newValue: string) => void
  }
}

/**
 * useSubBlockInput centralizes shared input behavior for workflow sub-block inputs.
 *
 * The hook is UI-agnostic and exposes refs, state, and event handlers needed by
 * headless wrappers or concrete input components. Popover rendering is intended
 * to be handled by a thin controller component using the returned state.
 */
export function useSubBlockInput(options: UseSubBlockInputOptions): UseSubBlockInputResult {
  const {
    blockId,
    subBlockId,
    config,
    value: propValue,
    onChange,
    isPreview = false,
    disabled = false,
    isStreaming = false,
    onStreamingEnd,
    previewValue,
    workspaceId: workspaceIdProp,
    shouldForceEnvDropdown,
  } = options

  const params = useParams()
  const workspaceId = (workspaceIdProp || (params?.workspaceId as string)) ?? undefined

  const [storeValue, setStoreValue] = useSubBlockValue(blockId, subBlockId, false, {
    isStreaming,
    onStreamingEnd,
  })

  const emitTagSelection = useTagSelection(blockId, subBlockId)

  // Local content enables immediate UI updates and streaming text display
  const [localContent, setLocalContent] = useState<string>('')

  const [showEnvVars, setShowEnvVars] = useState(false)
  const [showTags, setShowTags] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const [activeSourceBlockId, setActiveSourceBlockId] = useState<string | null>(null)

  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null)

  // Compute the value to render
  const value = useMemo(() => {
    if (isStreaming) return localContent
    if (isPreview) return previewValue
    if (propValue !== undefined) return propValue
    return storeValue
  }, [isStreaming, localContent, isPreview, previewValue, propValue, storeValue])

  const valueString = useMemo(() => value?.toString?.() ?? '', [value])

  const baseValue = isPreview ? previewValue : propValue !== undefined ? propValue : storeValue

  // Sync local content with base value when not streaming
  useEffect(() => {
    if (!isStreaming) {
      const baseValueString = baseValue?.toString?.() ?? ''
      if (baseValueString !== localContent) {
        setLocalContent(baseValueString)
      }
    }
  }, [baseValue, isStreaming])

  // Update store during streaming (deferred persistence is handled by onStreamingEnd)
  useEffect(() => {
    if (isStreaming && localContent !== '' && !isPreview && !disabled) {
      setStoreValue(localContent)
    }
  }, [localContent, isStreaming, isPreview, disabled, setStoreValue])

  const isDisabled = isPreview || disabled

  // Handlers
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (isDisabled || isStreaming) return
      const newValue = e.target.value
      const newCursor = (e.target as HTMLTextAreaElement | HTMLInputElement).selectionStart ?? 0

      setLocalContent(newValue)
      if (onChange) {
        onChange(newValue)
      } else if (!isPreview) {
        setStoreValue(newValue)
      }

      setCursorPosition(newCursor)

      // Triggers
      const envVar = checkEnvVarTrigger(newValue, newCursor)
      let showEnv = envVar.show
      let nextSearch = envVar.show ? envVar.searchTerm : ''
      if (shouldForceEnvDropdown) {
        const forced = shouldForceEnvDropdown({
          value: newValue,
          cursor: newCursor,
          event: 'change',
        })
        if (forced?.show) {
          // Always allow the callback to show the dropdown, but
          // do not override the search term if the standard `{{` trigger is active.
          showEnv = true
          if (!envVar.show) {
            nextSearch = forced.searchTerm ?? newValue
          }
        }
      }
      setShowEnvVars(showEnv)
      setSearchTerm(showEnv ? nextSearch : '')

      const tag = checkTagTrigger(newValue, newCursor)
      setShowTags(tag.show)
    },
    [isDisabled, isStreaming, onChange, isPreview, setStoreValue, shouldForceEnvDropdown]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (e.key === 'Escape') {
        setShowEnvVars(false)
        setShowTags(false)
        setSearchTerm('')
      }
      if (isStreaming) {
        e.preventDefault()
      }
      // If Delete/Backspace with full selection, allow forcing env dropdown
      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        shouldForceEnvDropdown &&
        inputRef.current
      ) {
        const el = inputRef.current as HTMLInputElement | HTMLTextAreaElement
        const val = el.value ?? valueString
        if (typeof el.selectionStart === 'number' && typeof el.selectionEnd === 'number') {
          if (el.selectionStart === 0 && el.selectionEnd === val.length) {
            const forced = shouldForceEnvDropdown({
              value: val,
              cursor: 0,
              event: 'deleteAll',
            })
            if (forced?.show) {
              setTimeout(() => {
                setShowEnvVars(true)
                setSearchTerm(forced.searchTerm ?? '')
              }, 0)
            }
          }
        }
      }
    },
    [isStreaming, shouldForceEnvDropdown, valueString]
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (config?.connectionDroppable === false) return
      e.preventDefault()
    },
    [config?.connectionDroppable]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (config?.connectionDroppable === false) return
      e.preventDefault()
      try {
        const dataRaw = e.dataTransfer.getData('application/json')
        const data = dataRaw ? JSON.parse(dataRaw) : null
        if (!data || data.type !== 'connectionBlock') return

        const el = inputRef.current as HTMLTextAreaElement | HTMLInputElement | null
        const dropPos = el?.selectionStart ?? valueString.length
        const newValue = `${valueString.slice(0, dropPos)}<${valueString.slice(dropPos)}`

        if (el) el.focus()

        Promise.resolve().then(() => {
          setLocalContent(newValue)
          if (onChange) {
            onChange(newValue)
          } else if (!isPreview) {
            setStoreValue(newValue)
          }
          setCursorPosition(dropPos + 1)
          setShowTags(true)
          if (data.connectionData?.sourceBlockId) {
            setActiveSourceBlockId(data.connectionData.sourceBlockId)
          }
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.selectionStart = dropPos + 1
              inputRef.current.selectionEnd = dropPos + 1
            }
          }, 0)
        })
      } catch (error) {
        logger.error('Failed to handle drop', { error })
      }
    },
    [config?.connectionDroppable, valueString, onChange, isPreview, setStoreValue]
  )

  const handleFocus = useCallback(() => {
    if (shouldForceEnvDropdown) {
      // Use a slight delay to ensure the input ref is populated
      setTimeout(() => {
        const forced = shouldForceEnvDropdown({
          value: (inputRef.current as any)?.value ?? valueString,
          cursor: (inputRef.current as any)?.selectionStart ?? valueString.length,
          event: 'focus',
        })
        if (forced?.show) {
          setShowEnvVars(true)
          setSearchTerm(forced.searchTerm ?? '')
        }
      }, 0)
    }
  }, [shouldForceEnvDropdown, valueString])

  const onScroll = useCallback((_: React.UIEvent<HTMLTextAreaElement>) => {
    // Intentionally empty; consumers may mirror scroll to overlays if needed
  }, [])

  // Helper to apply selected value coming from popovers
  const applySelectedValue = useCallback(
    (newValue: string, isTagSelection: boolean) => {
      if (onChange) {
        onChange(newValue)
      } else if (!isPreview) {
        if (isTagSelection) {
          emitTagSelection(newValue)
        } else {
          setStoreValue(newValue)
        }
      }
    },
    [onChange, isPreview, emitTagSelection, setStoreValue]
  )

  // Field-level state tracking for array-based inputs
  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>({})

  // Get field state with defaults
  const getFieldState = useCallback(
    (fieldId: string): FieldState => {
      return (
        fieldStates[fieldId] || {
          cursorPosition: 0,
          showEnvVars: false,
          showTags: false,
          searchTerm: '',
          activeSourceBlockId: null,
        }
      )
    },
    [fieldStates]
  )

  // Update field state
  const updateFieldState = useCallback((fieldId: string, updates: Partial<FieldState>) => {
    setFieldStates((prev) => ({
      ...prev,
      [fieldId]: { ...prev[fieldId], ...updates } as FieldState,
    }))
  }, [])

  // Create handlers for a specific field
  const createFieldHandlers = useCallback(
    (fieldId: string, fieldValue: string, onFieldChange: (newValue: string) => void) => {
      return {
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
          if (isDisabled || isStreaming) return
          const newValue = e.target.value
          const newCursor = e.target.selectionStart ?? 0

          onFieldChange(newValue)
          updateFieldState(fieldId, { cursorPosition: newCursor })

          // Check triggers
          const envVar = checkEnvVarTrigger(newValue, newCursor)
          const tag = checkTagTrigger(newValue, newCursor)

          updateFieldState(fieldId, {
            cursorPosition: newCursor,
            showEnvVars: envVar.show,
            searchTerm: envVar.show ? envVar.searchTerm : '',
            showTags: tag.show,
          })
        },
        onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
          if (e.key === 'Escape') {
            updateFieldState(fieldId, {
              showEnvVars: false,
              showTags: false,
              searchTerm: '',
            })
          }
          if (isStreaming) {
            e.preventDefault()
          }
        },
        onDrop: (e: React.DragEvent<HTMLTextAreaElement | HTMLInputElement>) => {
          if (config?.connectionDroppable === false) return
          e.preventDefault()
          try {
            const dataRaw = e.dataTransfer.getData('application/json')
            const data = dataRaw ? JSON.parse(dataRaw) : null
            if (!data || data.type !== 'connectionBlock') return

            const el = e.currentTarget
            const dropPos = el.selectionStart ?? fieldValue.length
            const newValue = `${fieldValue.slice(0, dropPos)}<${fieldValue.slice(dropPos)}`

            onFieldChange(newValue)
            updateFieldState(fieldId, {
              cursorPosition: dropPos + 1,
              showTags: true,
              activeSourceBlockId: data.connectionData?.sourceBlockId || null,
            })

            setTimeout(() => {
              el.focus()
              el.selectionStart = dropPos + 1
              el.selectionEnd = dropPos + 1
            }, 0)
          } catch (error) {
            logger.error('Failed to handle field drop', { error, fieldId })
          }
        },
        onDragOver: (e: React.DragEvent<HTMLTextAreaElement | HTMLInputElement>) => {
          if (config?.connectionDroppable === false) return
          e.preventDefault()
        },
      }
    },
    [isDisabled, isStreaming, config?.connectionDroppable, updateFieldState]
  )

  // Hide dropdowns for a field
  const hideFieldDropdowns = useCallback(
    (fieldId: string) => {
      updateFieldState(fieldId, {
        showEnvVars: false,
        showTags: false,
        searchTerm: '',
        activeSourceBlockId: null,
      })
    },
    [updateFieldState]
  )

  // Create tag select handler for a field
  const createTagSelectHandler = useCallback(
    (fieldId: string, fieldValue: string, onFieldChange: (newValue: string) => void) => {
      return (newValue: string) => {
        if (!isPreview && !disabled) {
          onFieldChange(newValue)
          hideFieldDropdowns(fieldId)
        }
      }
    },
    [isPreview, disabled, hideFieldDropdowns]
  )

  // Create env var select handler for a field
  const createEnvVarSelectHandler = useCallback(
    (fieldId: string, fieldValue: string, onFieldChange: (newValue: string) => void) => {
      return (newValue: string) => {
        if (!isPreview && !disabled) {
          onFieldChange(newValue)
          hideFieldDropdowns(fieldId)
        }
      }
    },
    [isPreview, disabled, hideFieldDropdowns]
  )

  return {
    inputRef: inputRef as React.RefObject<HTMLTextAreaElement | HTMLInputElement>,
    valueString,
    isDisabled,
    cursorPosition,
    showEnvVars,
    showTags,
    searchTerm,
    activeSourceBlockId,
    handlers: {
      onChange: handleChange,
      onKeyDown: handleKeyDown,
      onDrop: handleDrop,
      onDragOver: handleDragOver,
      onFocus: handleFocus,
      onScroll,
    },
    workspaceId,
    controls: {
      hideEnvVars: () => {
        setShowEnvVars(false)
        setSearchTerm('')
      },
      hideTags: () => {
        setShowTags(false)
        setActiveSourceBlockId(null)
      },
      setActiveSourceBlockId,
    },
    fieldHelpers: {
      getFieldState,
      createFieldHandlers,
      hideFieldDropdowns,
      createTagSelectHandler,
      createEnvVarSelectHandler,
    },
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-sub-block-value.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-value.ts
Signals: React

```typescript
import { useCallback, useEffect, useRef } from 'react'
import { isEqual } from 'lodash'
import { createLogger } from '@/lib/logs/console/logger'
import { useCollaborativeWorkflow } from '@/hooks/use-collaborative-workflow'
import { getProviderFromModel } from '@/providers/utils'
import { useWorkflowDiffStore } from '@/stores/workflow-diff/store'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'

const logger = createLogger('SubBlockValue')

interface UseSubBlockValueOptions {
  isStreaming?: boolean
  onStreamingEnd?: () => void
}

/**
 * Custom hook to get and set values for a sub-block in a workflow.
 * Handles complex object values properly by using deep equality comparison.
 * Supports explicit streaming mode for AI generation.
 *
 * @param blockId The ID of the block containing the sub-block
 * @param subBlockId The ID of the sub-block
 * @param triggerWorkflowUpdate Whether to trigger a workflow update when the value changes
 * @param options Configuration for debouncing and streaming behavior
 * @returns A tuple containing the current value and setter function
 */
export function useSubBlockValue<T = any>(
  blockId: string,
  subBlockId: string,
  triggerWorkflowUpdate = false,
  options?: UseSubBlockValueOptions
): readonly [T | null, (value: T) => void] {
  const { isStreaming = false, onStreamingEnd } = options || {}

  const { collaborativeSetSubblockValue } = useCollaborativeWorkflow()

  // Subscribe to active workflow id to avoid races where the workflow id is set after mount.
  // This ensures our selector recomputes when the active workflow changes.
  const activeWorkflowId = useWorkflowRegistry((s) => s.activeWorkflowId)

  const blockType = useWorkflowStore(
    useCallback((state) => state.blocks?.[blockId]?.type, [blockId])
  )

  const initialValue = useWorkflowStore(
    useCallback(
      (state) => state.blocks?.[blockId]?.subBlocks?.[subBlockId]?.value ?? null,
      [blockId, subBlockId]
    )
  )

  // Keep a ref to the latest value to prevent unnecessary re-renders
  const valueRef = useRef<T | null>(null)

  // Streaming refs
  const lastEmittedValueRef = useRef<T | null>(null)
  const streamingValueRef = useRef<T | null>(null)
  const wasStreamingRef = useRef<boolean>(false)

  // Get value from subblock store, keyed by active workflow id
  // Optimized: use shallow equality comparison to prevent re-renders when other fields change
  const storeValue = useSubBlockStore(
    useCallback(
      (state) => {
        // If the active workflow ID isn't available yet, return undefined so we can fall back to initialValue
        if (!activeWorkflowId) return undefined
        return state.workflowValues[activeWorkflowId]?.[blockId]?.[subBlockId] ?? null
      },
      [activeWorkflowId, blockId, subBlockId]
    ),
    (a, b) => isEqual(a, b) // Use deep equality to prevent re-renders for same values
  )

  // Check if we're in diff mode and get diff value if available
  const { isShowingDiff, hasActiveDiff, baselineWorkflow } = useWorkflowDiffStore()
  const isBaselineView = hasActiveDiff && !isShowingDiff
  const snapshotSubBlock =
    isBaselineView && baselineWorkflow
      ? baselineWorkflow.blocks?.[blockId]?.subBlocks?.[subBlockId]
      : undefined
  const hasSnapshotValue = snapshotSubBlock !== undefined
  const snapshotValue = hasSnapshotValue ? ((snapshotSubBlock as any)?.value ?? null) : null

  // Check if this is an API key field that could be auto-filled
  const isApiKey =
    subBlockId === 'apiKey' || (subBlockId?.toLowerCase().includes('apikey') ?? false)

  // Always call this hook unconditionally - don't wrap it in a condition
  // Optimized: only re-render if model value actually changes
  const modelSubBlockValue = useSubBlockStore(
    useCallback((state) => (blockId ? state.getValue(blockId, 'model') : null), [blockId]),
    (a, b) => a === b
  )

  // Determine if this is a provider-based block type
  const isProviderBasedBlock =
    blockType === 'agent' || blockType === 'router' || blockType === 'evaluator'

  // Compute the modelValue based on block type
  const modelValue = isProviderBasedBlock ? (modelSubBlockValue as string) : null

  // Emit the value to socket/DB
  const emitValue = useCallback(
    (value: T) => {
      collaborativeSetSubblockValue(blockId, subBlockId, value)
      lastEmittedValueRef.current = value
    },
    [blockId, subBlockId, collaborativeSetSubblockValue]
  )

  // Handle streaming mode changes
  useEffect(() => {
    // If we just exited streaming mode, emit the final value
    if (wasStreamingRef.current && !isStreaming && streamingValueRef.current !== null) {
      logger.debug('Streaming ended, persisting final value', { blockId, subBlockId })
      emitValue(streamingValueRef.current)
      streamingValueRef.current = null
      onStreamingEnd?.()
    }
    wasStreamingRef.current = isStreaming
  }, [isStreaming, blockId, subBlockId, emitValue, onStreamingEnd])

  // Hook to set a value in the subblock store
  const setValue = useCallback(
    (newValue: T) => {
      // Don't allow updates when showing the baseline snapshot (readonly preview)
      if (isBaselineView) {
        logger.debug('Ignoring setValue while viewing baseline diff', { blockId, subBlockId })
        return
      }

      const currentActiveWorkflowId = useWorkflowRegistry.getState().activeWorkflowId
      if (!currentActiveWorkflowId) {
        logger.warn('No active workflow ID when setting value', { blockId, subBlockId })
        return
      }

      // Use deep comparison to avoid unnecessary updates for complex objects
      if (!isEqual(valueRef.current, newValue)) {
        valueRef.current = newValue

        // Ensure we're passing the actual value, not a reference that might change
        const valueCopy =
          newValue === null
            ? null
            : typeof newValue === 'object'
              ? JSON.parse(JSON.stringify(newValue))
              : newValue

        // If streaming, hold value locally and do not update global store to avoid render-phase updates
        if (isStreaming) {
          streamingValueRef.current = valueCopy
          return
        }

        // Update local store immediately for UI responsiveness (non-streaming)
        useSubBlockStore.setState((state) => ({
          workflowValues: {
            ...state.workflowValues,
            [currentActiveWorkflowId]: {
              ...state.workflowValues[currentActiveWorkflowId],
              [blockId]: {
                ...state.workflowValues[currentActiveWorkflowId]?.[blockId],
                [subBlockId]: newValue,
              },
            },
          },
        }))

        // Handle model changes for provider-based blocks - clear API key when provider changes (non-streaming)
        if (
          subBlockId === 'model' &&
          isProviderBasedBlock &&
          newValue &&
          typeof newValue === 'string'
        ) {
          const currentApiKeyValue = useSubBlockStore.getState().getValue(blockId, 'apiKey')
          if (currentApiKeyValue && currentApiKeyValue !== '') {
            const oldModelValue = storeValue as string
            const oldProvider = oldModelValue ? getProviderFromModel(oldModelValue) : null
            const newProvider = getProviderFromModel(newValue)
            if (oldProvider !== newProvider) {
              collaborativeSetSubblockValue(blockId, 'apiKey', '')
            }
          }
        }

        // Emit immediately; the client queue coalesces same-key ops and the server debounces
        emitValue(valueCopy)

        if (triggerWorkflowUpdate) {
          useWorkflowStore.getState().triggerUpdate()
        }
      }
    },
    [
      blockId,
      subBlockId,
      blockType,
      isApiKey,
      storeValue,
      triggerWorkflowUpdate,
      modelValue,
      isStreaming,
      emitValue,
      isBaselineView,
    ]
  )

  // Determine the effective value: diff value takes precedence if in diff mode
  const effectiveValue = hasSnapshotValue
    ? snapshotValue
    : storeValue !== undefined
      ? storeValue
      : initialValue

  // Initialize valueRef on first render
  useEffect(() => {
    valueRef.current = effectiveValue
  }, [])

  // Update the ref if the effective value changes
  // This ensures we're always working with the latest value
  useEffect(() => {
    // Use deep comparison for objects to prevent unnecessary updates
    if (!isEqual(valueRef.current, effectiveValue)) {
      valueRef.current = effectiveValue
    }
  }, [effectiveValue])

  // Return appropriate tuple based on whether options were provided
  return [effectiveValue, setValue] as const
}
```

--------------------------------------------------------------------------------

---[FILE: subflow-editor.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/subflow-editor/subflow-editor.tsx

```typescript
'use client'

import { ChevronUp } from 'lucide-react'
import SimpleCodeEditor from 'react-simple-code-editor'
import { Code as CodeEditor, Combobox, getCodeEditorProps, Input, Label } from '@/components/emcn'
import { TagDropdown } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/tag-dropdown/tag-dropdown'
import type { BlockState } from '@/stores/workflows/workflow/types'
import type { ConnectedBlock } from '../../hooks/use-block-connections'
import { useSubflowEditor } from '../../hooks/use-subflow-editor'
import { ConnectionBlocks } from '../connection-blocks'

interface SubflowEditorProps {
  currentBlock: BlockState
  currentBlockId: string
  subBlocksRef: React.RefObject<HTMLDivElement | null>
  connectionsHeight: number
  isResizing: boolean
  hasIncomingConnections: boolean
  incomingConnections: ConnectedBlock[]
  handleConnectionsResizeMouseDown: (e: React.MouseEvent) => void
  toggleConnectionsCollapsed: () => void
  userCanEdit: boolean
  isConnectionsAtMinHeight: boolean
}

/**
 * SubflowEditor component for editing loop and parallel blocks
 *
 * @param props - Component props
 * @returns Rendered subflow editor
 */
export function SubflowEditor({
  currentBlock,
  currentBlockId,
  subBlocksRef,
  connectionsHeight,
  isResizing,
  hasIncomingConnections,
  incomingConnections,
  handleConnectionsResizeMouseDown,
  toggleConnectionsCollapsed,
  userCanEdit,
  isConnectionsAtMinHeight,
}: SubflowEditorProps) {
  const {
    subflowConfig,
    currentType,
    isCountMode,
    isConditionMode,
    inputValue,
    editorValue,
    typeOptions,
    showTagDropdown,
    cursorPosition,
    editorContainerRef,
    handleSubflowTypeChange,
    handleSubflowIterationsChange,
    handleSubflowIterationsSave,
    handleSubflowEditorChange,
    handleSubflowTagSelect,
    highlightWithReferences,
    setShowTagDropdown,
  } = useSubflowEditor(currentBlock, currentBlockId)

  if (!subflowConfig) return null

  return (
    <div className='flex flex-1 flex-col overflow-hidden pt-[0px]'>
      {/* Subflow Editor Section */}
      <div ref={subBlocksRef} className='subblocks-section flex flex-1 flex-col overflow-hidden'>
        <div className='flex-1 overflow-y-auto overflow-x-hidden px-[8px] pt-[5px] pb-[8px]'>
          {/* Type Selection */}
          <div>
            <Label className='mb-[6.5px] block pl-[2px] font-medium text-[13px] text-[var(--text-primary)]'>
              {currentBlock.type === 'loop' ? 'Loop Type' : 'Parallel Type'}
            </Label>
            <Combobox
              options={typeOptions}
              value={currentType || ''}
              onChange={handleSubflowTypeChange}
              disabled={!userCanEdit}
              placeholder='Select type...'
            />
          </div>

          {/* Dashed Line Separator */}
          <div className='px-[2px] pt-[16px] pb-[10px]'>
            <div
              className='h-[1.25px]'
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to right, var(--border) 0px, var(--border) 6px, transparent 6px, transparent 12px)',
              }}
            />
          </div>

          {/* Configuration */}
          <div>
            <Label className='mb-[6.5px] block pl-[2px] font-medium text-[13px] text-[var(--text-primary)]'>
              {isCountMode
                ? `${currentBlock.type === 'loop' ? 'Loop' : 'Parallel'} Iterations`
                : isConditionMode
                  ? 'While Condition'
                  : `${currentBlock.type === 'loop' ? 'Collection' : 'Parallel'} Items`}
            </Label>

            {isCountMode ? (
              <div>
                <Input
                  type='text'
                  value={inputValue}
                  onChange={handleSubflowIterationsChange}
                  onBlur={handleSubflowIterationsSave}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubflowIterationsSave()}
                  disabled={!userCanEdit}
                  className='mb-[4px]'
                />
                <div className='text-[10px] text-muted-foreground'>
                  Enter a number between 1 and {subflowConfig.maxIterations}
                </div>
              </div>
            ) : (
              <div ref={editorContainerRef} className='relative'>
                <CodeEditor.Container>
                  <CodeEditor.Content>
                    <CodeEditor.Placeholder gutterWidth={0} show={editorValue.length === 0}>
                      {isConditionMode ? '<counter.value> < 10' : "['item1', 'item2', 'item3']"}
                    </CodeEditor.Placeholder>

                    <SimpleCodeEditor
                      value={editorValue}
                      onValueChange={handleSubflowEditorChange}
                      highlight={highlightWithReferences}
                      {...getCodeEditorProps({
                        isPreview: false,
                        disabled: !userCanEdit,
                      })}
                    />

                    {showTagDropdown && (
                      <TagDropdown
                        visible={showTagDropdown}
                        onSelect={handleSubflowTagSelect}
                        blockId={currentBlockId}
                        activeSourceBlockId={null}
                        inputValue={editorValue}
                        cursorPosition={cursorPosition}
                        onClose={() => setShowTagDropdown(false)}
                        inputRef={{
                          current: editorContainerRef.current?.querySelector(
                            'textarea'
                          ) as HTMLTextAreaElement,
                        }}
                      />
                    )}
                  </CodeEditor.Content>
                </CodeEditor.Container>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Connections Section - Only show when there are connections */}
      {hasIncomingConnections && (
        <div
          className={
            'connections-section flex flex-shrink-0 flex-col overflow-hidden border-[var(--border)] border-t' +
            (!isResizing ? ' transition-[height] duration-100 ease-out' : '')
          }
          style={{ height: `${connectionsHeight}px` }}
        >
          {/* Resize Handle */}
          <div className='relative'>
            <div
              className='absolute top-[-4px] right-0 left-0 z-30 h-[8px] cursor-ns-resize'
              onMouseDown={handleConnectionsResizeMouseDown}
            />
          </div>

          {/* Connections Header with Chevron */}
          <div
            className='flex flex-shrink-0 cursor-pointer items-center gap-[8px] px-[10px] pt-[5px] pb-[5px]'
            onClick={toggleConnectionsCollapsed}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggleConnectionsCollapsed()
              }
            }}
            role='button'
            tabIndex={0}
            aria-label={isConnectionsAtMinHeight ? 'Expand connections' : 'Collapse connections'}
          >
            <ChevronUp
              className={
                'h-[14px] w-[14px] transition-transform' +
                (!isConnectionsAtMinHeight ? ' rotate-180' : '')
              }
            />
            <div className='font-medium text-[13px] text-[var(--text-primary)]'>Connections</div>
          </div>

          {/* Connections Content - Always visible */}
          <div className='flex-1 overflow-y-auto overflow-x-hidden px-[6px] pb-[8px]'>
            <ConnectionBlocks connections={incomingConnections} currentBlockId={currentBlock.id} />
          </div>
        </div>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/hooks/index.ts

```typescript
export { useBlockConnections } from './use-block-connections'
export { useConnectionsResize } from './use-connections-resize'
export { useEditorBlockProperties } from './use-editor-block-properties'
export { useEditorSubblockLayout } from './use-editor-subblock-layout'
export { useSubflowEditor } from './use-subflow-editor'
```

--------------------------------------------------------------------------------

````
