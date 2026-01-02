---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 420
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 420 of 933)

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

---[FILE: schedule-save.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/schedule-save/schedule-save.tsx
Signals: React, Next.js

```typescript
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/emcn'
import { Trash } from '@/components/emcn/icons/trash'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/core/utils/cn'
import { createLogger } from '@/lib/logs/console/logger'
import { parseCronToHumanReadable } from '@/lib/workflows/schedules/utils'
import { useCollaborativeWorkflow } from '@/hooks/use-collaborative-workflow'
import { useScheduleManagement } from '@/hooks/use-schedule-management'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'

const logger = createLogger('ScheduleSave')

interface ScheduleSaveProps {
  blockId: string
  isPreview?: boolean
  disabled?: boolean
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export function ScheduleSave({ blockId, isPreview = false, disabled = false }: ScheduleSaveProps) {
  const params = useParams()
  const workflowId = params.workflowId as string
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'deleting'>('idle')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [scheduleStatus, setScheduleStatus] = useState<'active' | 'disabled' | null>(null)
  const [nextRunAt, setNextRunAt] = useState<Date | null>(null)
  const [lastRanAt, setLastRanAt] = useState<Date | null>(null)
  const [failedCount, setFailedCount] = useState<number>(0)
  const [isLoadingStatus, setIsLoadingStatus] = useState(false)
  const [savedCronExpression, setSavedCronExpression] = useState<string | null>(null)

  const { collaborativeSetSubblockValue } = useCollaborativeWorkflow()

  const { scheduleId, saveConfig, deleteConfig, isSaving } = useScheduleManagement({
    blockId,
    isPreview,
  })

  const scheduleType = useSubBlockStore((state) => state.getValue(blockId, 'scheduleType'))
  const scheduleMinutesInterval = useSubBlockStore((state) =>
    state.getValue(blockId, 'minutesInterval')
  )
  const scheduleHourlyMinute = useSubBlockStore((state) => state.getValue(blockId, 'hourlyMinute'))
  const scheduleDailyTime = useSubBlockStore((state) => state.getValue(blockId, 'dailyTime'))
  const scheduleWeeklyDay = useSubBlockStore((state) => state.getValue(blockId, 'weeklyDay'))
  const scheduleWeeklyTime = useSubBlockStore((state) => state.getValue(blockId, 'weeklyDayTime'))
  const scheduleMonthlyDay = useSubBlockStore((state) => state.getValue(blockId, 'monthlyDay'))
  const scheduleMonthlyTime = useSubBlockStore((state) => state.getValue(blockId, 'monthlyTime'))
  const scheduleCronExpression = useSubBlockStore((state) =>
    state.getValue(blockId, 'cronExpression')
  )
  const scheduleTimezone = useSubBlockStore((state) => state.getValue(blockId, 'timezone'))

  const validateRequiredFields = useCallback((): { valid: boolean; missingFields: string[] } => {
    const missingFields: string[] = []

    if (!scheduleType) {
      missingFields.push('Frequency')
      return { valid: false, missingFields }
    }

    switch (scheduleType) {
      case 'minutes': {
        const minutesNum = Number(scheduleMinutesInterval)
        if (
          !scheduleMinutesInterval ||
          Number.isNaN(minutesNum) ||
          minutesNum < 1 ||
          minutesNum > 1440
        ) {
          missingFields.push('Minutes Interval (must be 1-1440)')
        }
        break
      }
      case 'hourly': {
        const hourlyNum = Number(scheduleHourlyMinute)
        if (
          scheduleHourlyMinute === null ||
          scheduleHourlyMinute === undefined ||
          scheduleHourlyMinute === '' ||
          Number.isNaN(hourlyNum) ||
          hourlyNum < 0 ||
          hourlyNum > 59
        ) {
          missingFields.push('Minute (must be 0-59)')
        }
        break
      }
      case 'daily':
        if (!scheduleDailyTime) {
          missingFields.push('Time')
        }
        break
      case 'weekly':
        if (!scheduleWeeklyDay) {
          missingFields.push('Day of Week')
        }
        if (!scheduleWeeklyTime) {
          missingFields.push('Time')
        }
        break
      case 'monthly': {
        const monthlyNum = Number(scheduleMonthlyDay)
        if (!scheduleMonthlyDay || Number.isNaN(monthlyNum) || monthlyNum < 1 || monthlyNum > 31) {
          missingFields.push('Day of Month (must be 1-31)')
        }
        if (!scheduleMonthlyTime) {
          missingFields.push('Time')
        }
        break
      }
      case 'custom':
        if (!scheduleCronExpression) {
          missingFields.push('Cron Expression')
        }
        break
    }

    if (!scheduleTimezone && scheduleType !== 'minutes' && scheduleType !== 'hourly') {
      missingFields.push('Timezone')
    }

    return {
      valid: missingFields.length === 0,
      missingFields,
    }
  }, [
    scheduleType,
    scheduleMinutesInterval,
    scheduleHourlyMinute,
    scheduleDailyTime,
    scheduleWeeklyDay,
    scheduleWeeklyTime,
    scheduleMonthlyDay,
    scheduleMonthlyTime,
    scheduleCronExpression,
    scheduleTimezone,
  ])

  const requiredSubBlockIds = useMemo(() => {
    return [
      'scheduleType',
      'minutesInterval',
      'hourlyMinute',
      'dailyTime',
      'weeklyDay',
      'weeklyDayTime',
      'monthlyDay',
      'monthlyTime',
      'cronExpression',
      'timezone',
    ]
  }, [])

  const subscribedSubBlockValues = useSubBlockStore(
    useCallback(
      (state) => {
        const values: Record<string, any> = {}
        requiredSubBlockIds.forEach((subBlockId) => {
          const value = state.getValue(blockId, subBlockId)
          if (value !== null && value !== undefined && value !== '') {
            values[subBlockId] = value
          }
        })
        return values
      },
      [blockId, requiredSubBlockIds]
    )
  )

  const previousValuesRef = useRef<Record<string, any>>({})
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (saveStatus !== 'error') {
      previousValuesRef.current = subscribedSubBlockValues
      return
    }

    const hasChanges = Object.keys(subscribedSubBlockValues).some(
      (key) =>
        previousValuesRef.current[key] !== (subscribedSubBlockValues as Record<string, any>)[key]
    )

    if (!hasChanges) {
      return
    }

    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current)
    }

    validationTimeoutRef.current = setTimeout(() => {
      const validation = validateRequiredFields()

      if (validation.valid) {
        setErrorMessage(null)
        setSaveStatus('idle')
        logger.debug('Error cleared after validation passed', { blockId })
      } else {
        setErrorMessage(`Missing required fields: ${validation.missingFields.join(', ')}`)
        logger.debug('Error message updated', {
          blockId,
          missingFields: validation.missingFields,
        })
      }

      previousValuesRef.current = subscribedSubBlockValues
    }, 300)

    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current)
      }
    }
  }, [blockId, subscribedSubBlockValues, saveStatus, validateRequiredFields])

  const fetchScheduleStatus = useCallback(async () => {
    if (!scheduleId || isPreview) return

    setIsLoadingStatus(true)
    try {
      const response = await fetch(
        `/api/schedules?workflowId=${workflowId}&blockId=${blockId}&mode=schedule`
      )
      if (response.ok) {
        const data = await response.json()
        if (data.schedule) {
          setScheduleStatus(data.schedule.status)
          setNextRunAt(data.schedule.nextRunAt ? new Date(data.schedule.nextRunAt) : null)
          setLastRanAt(data.schedule.lastRanAt ? new Date(data.schedule.lastRanAt) : null)
          setFailedCount(data.schedule.failedCount || 0)
          setSavedCronExpression(data.schedule.cronExpression || null)
        }
      }
    } catch (error) {
      logger.error('Error fetching schedule status', { error })
    } finally {
      setIsLoadingStatus(false)
    }
  }, [workflowId, blockId, scheduleId, isPreview])

  useEffect(() => {
    if (scheduleId && !isPreview) {
      fetchScheduleStatus()
    }
  }, [scheduleId, isPreview, fetchScheduleStatus])

  const handleSave = async () => {
    if (isPreview || disabled) return

    setSaveStatus('saving')
    setErrorMessage(null)

    try {
      const validation = validateRequiredFields()
      if (!validation.valid) {
        setErrorMessage(`Missing required fields: ${validation.missingFields.join(', ')}`)
        setSaveStatus('error')
        return
      }

      const result = await saveConfig()
      if (!result.success) {
        throw new Error('Save config returned false')
      }

      setSaveStatus('saved')
      setErrorMessage(null)

      const scheduleIdValue = useSubBlockStore.getState().getValue(blockId, 'scheduleId')
      collaborativeSetSubblockValue(blockId, 'scheduleId', scheduleIdValue)

      if (result.nextRunAt) {
        setNextRunAt(new Date(result.nextRunAt))
        setScheduleStatus('active')
      }

      // Fetch additional status info, then apply cron from save result to prevent stale data
      await fetchScheduleStatus()

      if (result.cronExpression) {
        setSavedCronExpression(result.cronExpression)
      }

      setTimeout(() => {
        setSaveStatus('idle')
      }, 2000)

      logger.info('Schedule configuration saved successfully', {
        blockId,
        hasScheduleId: !!scheduleId,
      })
    } catch (error: any) {
      setSaveStatus('error')
      setErrorMessage(error.message || 'An error occurred while saving.')
      logger.error('Error saving schedule config', { error })
    }
  }

  const handleDelete = async () => {
    if (isPreview || disabled) return

    setShowDeleteDialog(false)
    setDeleteStatus('deleting')

    try {
      const success = await deleteConfig()
      if (!success) {
        throw new Error('Failed to delete schedule')
      }

      setScheduleStatus(null)
      setNextRunAt(null)
      setLastRanAt(null)
      setFailedCount(0)

      collaborativeSetSubblockValue(blockId, 'scheduleId', null)

      logger.info('Schedule deleted successfully', { blockId })
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred while deleting.')
      logger.error('Error deleting schedule', { error })
    } finally {
      setDeleteStatus('idle')
    }
  }

  const handleDeleteConfirm = () => {
    handleDelete()
  }

  const handleToggleStatus = async () => {
    if (!scheduleId || isPreview || disabled) return

    try {
      const action = scheduleStatus === 'active' ? 'disable' : 'reactivate'
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        await fetchScheduleStatus()
        logger.info(`Schedule ${action}d successfully`, { scheduleId })
      } else {
        throw new Error(`Failed to ${action} schedule`)
      }
    } catch (error: any) {
      setErrorMessage(
        error.message ||
          `An error occurred while ${scheduleStatus === 'active' ? 'disabling' : 'reactivating'} the schedule.`
      )
      logger.error('Error toggling schedule status', { error })
    }
  }

  return (
    <div className='mt-2'>
      <div className='flex gap-2'>
        <Button
          variant='default'
          onClick={handleSave}
          disabled={disabled || isPreview || isSaving || saveStatus === 'saving' || isLoadingStatus}
          className={cn(
            'h-9 flex-1 rounded-[8px] transition-all duration-200',
            saveStatus === 'saved' && 'bg-green-600 hover:bg-green-700',
            saveStatus === 'error' && 'bg-red-600 hover:bg-red-700'
          )}
        >
          {saveStatus === 'saving' && (
            <>
              <div className='mr-2 h-4 w-4 animate-spin rounded-full border-[1.5px] border-current border-t-transparent' />
              Saving...
            </>
          )}
          {saveStatus === 'saved' && 'Saved'}
          {saveStatus === 'idle' && (scheduleId ? 'Update Schedule' : 'Save Schedule')}
          {saveStatus === 'error' && 'Error'}
        </Button>

        {scheduleId && (
          <Button
            variant='default'
            onClick={() => setShowDeleteDialog(true)}
            disabled={disabled || isPreview || deleteStatus === 'deleting' || isSaving}
            className='h-9 rounded-[8px] px-3'
          >
            {deleteStatus === 'deleting' ? (
              <div className='h-4 w-4 animate-spin rounded-full border-[1.5px] border-current border-t-transparent' />
            ) : (
              <Trash className='h-[14px] w-[14px]' />
            )}
          </Button>
        )}
      </div>

      {errorMessage && (
        <Alert variant='destructive' className='mt-2'>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {scheduleId && (scheduleStatus || isLoadingStatus || nextRunAt) && (
        <div className='mt-2 space-y-1'>
          {isLoadingStatus ? (
            <div className='flex items-center gap-2 text-muted-foreground text-sm'>
              <div className='h-4 w-4 animate-spin rounded-full border-[1.5px] border-current border-t-transparent' />
              Loading schedule status...
            </div>
          ) : (
            <>
              {failedCount > 0 && (
                <div className='flex items-center gap-2'>
                  <span className='text-destructive text-sm'>
                    ⚠️ {failedCount} failed run{failedCount !== 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {savedCronExpression && (
                <p className='text-muted-foreground text-sm'>
                  Runs{' '}
                  {parseCronToHumanReadable(
                    savedCronExpression,
                    scheduleTimezone || 'UTC'
                  ).toLowerCase()}
                </p>
              )}

              {nextRunAt && (
                <p className='text-sm'>
                  <span className='font-medium'>Next run:</span>{' '}
                  {nextRunAt.toLocaleString('en-US', {
                    timeZone: scheduleTimezone || 'UTC',
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}{' '}
                  {scheduleTimezone || 'UTC'}
                </p>
              )}

              {lastRanAt && (
                <p className='text-muted-foreground text-sm'>
                  <span className='font-medium'>Last ran:</span>{' '}
                  {lastRanAt.toLocaleString('en-US', {
                    timeZone: scheduleTimezone || 'UTC',
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}{' '}
                  {scheduleTimezone || 'UTC'}
                </p>
              )}
            </>
          )}
        </div>
      )}

      <Modal open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <ModalContent size='sm'>
          <ModalHeader>Delete Schedule</ModalHeader>
          <ModalBody>
            <p className='text-[12px] text-[var(--text-tertiary)]'>
              Are you sure you want to delete this schedule configuration? This will stop the
              workflow from running automatically.{' '}
              <span className='text-[var(--text-error)]'>This action cannot be undone.</span>
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant='active' onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={handleDeleteConfirm}
              className='!bg-[var(--text-error)] !text-white hover:!bg-[var(--text-error)]/90'
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: selector-combobox.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/selector-combobox/selector-combobox.tsx
Signals: React

```typescript
import type React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Combobox as EditableCombobox } from '@/components/emcn/components'
import { SubBlockInputController } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/sub-block-input-controller'
import { useSubBlockValue } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-value'
import type { SubBlockConfig } from '@/blocks/types'
import type { SelectorContext, SelectorKey } from '@/hooks/selectors/types'
import {
  useSelectorOptionDetail,
  useSelectorOptionMap,
  useSelectorOptions,
} from '@/hooks/selectors/use-selector-query'

interface SelectorComboboxProps {
  blockId: string
  subBlock: SubBlockConfig
  selectorKey: SelectorKey
  selectorContext: SelectorContext
  disabled?: boolean
  isPreview?: boolean
  previewValue?: string | null
  placeholder?: string
  readOnly?: boolean
  onOptionChange?: (value: string) => void
  allowSearch?: boolean
}

export function SelectorCombobox({
  blockId,
  subBlock,
  selectorKey,
  selectorContext,
  disabled,
  isPreview,
  previewValue,
  placeholder,
  readOnly,
  onOptionChange,
  allowSearch = true,
}: SelectorComboboxProps) {
  const [storeValueRaw, setStoreValue] = useSubBlockValue<string | null | undefined>(
    blockId,
    subBlock.id
  )
  const storeValue = storeValueRaw ?? undefined
  const previewedValue = previewValue ?? undefined
  const activeValue: string | undefined = isPreview ? previewedValue : storeValue
  const [searchTerm, setSearchTerm] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const {
    data: options = [],
    isLoading,
    error,
  } = useSelectorOptions(selectorKey, {
    context: selectorContext,
    search: allowSearch ? searchTerm : undefined,
  })
  const { data: detailOption } = useSelectorOptionDetail(selectorKey, {
    context: selectorContext,
    detailId: activeValue,
  })
  const optionMap = useSelectorOptionMap(options, detailOption ?? undefined)
  const selectedLabel = activeValue ? (optionMap.get(activeValue)?.label ?? activeValue) : ''
  const [inputValue, setInputValue] = useState(selectedLabel)
  const previousActiveValue = useRef<string | undefined>(activeValue)

  useEffect(() => {
    if (previousActiveValue.current !== activeValue) {
      previousActiveValue.current = activeValue
      setIsEditing(false)
    }
  }, [activeValue])

  useEffect(() => {
    if (!allowSearch) return
    if (!isEditing) {
      setInputValue(selectedLabel)
    }
  }, [selectedLabel, allowSearch, isEditing])

  const comboboxOptions = useMemo(
    () =>
      Array.from(optionMap.values()).map((option) => ({
        label: option.label,
        value: option.id,
      })),
    [optionMap]
  )

  const handleSelection = useCallback(
    (value: string) => {
      if (readOnly || disabled) return
      setStoreValue(value)
      setIsEditing(false)
      onOptionChange?.(value)
    },
    [setStoreValue, onOptionChange, readOnly, disabled]
  )

  return (
    <div className='w-full'>
      <SubBlockInputController
        blockId={blockId}
        subBlockId={subBlock.id}
        config={subBlock}
        value={activeValue ?? ''}
        disabled={disabled || readOnly}
        isPreview={isPreview}
      >
        {({ ref, onDrop, onDragOver }) => (
          <EditableCombobox
            options={comboboxOptions}
            value={allowSearch ? inputValue : selectedLabel}
            selectedValue={activeValue ?? ''}
            onChange={(newValue) => {
              const matched = optionMap.get(newValue)
              if (matched) {
                setInputValue(matched.label)
                setIsEditing(false)
                handleSelection(matched.id)
                return
              }
              if (allowSearch) {
                setInputValue(newValue)
                setIsEditing(true)
                setSearchTerm(newValue)
              }
            }}
            placeholder={placeholder || subBlock.placeholder || 'Select an option'}
            disabled={disabled || readOnly}
            editable={allowSearch}
            filterOptions={allowSearch}
            inputRef={ref as React.RefObject<HTMLInputElement>}
            inputProps={{
              onDrop: onDrop as (e: React.DragEvent<HTMLInputElement>) => void,
              onDragOver: onDragOver as (e: React.DragEvent<HTMLInputElement>) => void,
            }}
            isLoading={isLoading}
            error={error instanceof Error ? error.message : null}
          />
        )}
      </SubBlockInputController>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: short-input.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/short-input/short-input.tsx
Signals: React

```typescript
import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Check, Copy, Wand2 } from 'lucide-react'
import { useReactFlow } from 'reactflow'
import { Input } from '@/components/emcn'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/core/utils/cn'
import { formatDisplayText } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/formatted-text'
import { SubBlockInputController } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/sub-block-input-controller'
import { useSubBlockValue } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-value'
import type { WandControlHandlers } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/sub-block'
import { WandPromptBar } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/wand-prompt-bar/wand-prompt-bar'
import { useAccessibleReferencePrefixes } from '@/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-accessible-reference-prefixes'
import { useWand } from '@/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-wand'
import type { SubBlockConfig } from '@/blocks/types'
import { useWebhookManagement } from '@/hooks/use-webhook-management'

/**
 * Props for the ShortInput component
 */
interface ShortInputProps {
  /** Placeholder text to display when empty */
  placeholder?: string
  /** Whether to mask the input as a password field */
  password?: boolean
  /** Unique identifier for the block */
  blockId: string
  /** Unique identifier for the sub-block */
  subBlockId: string
  /** Configuration object for the sub-block */
  config: SubBlockConfig
  /** Controlled value from parent */
  value?: string
  /** Callback when value changes */
  onChange?: (value: string) => void
  /** Whether component is in preview mode */
  isPreview?: boolean
  /** Value to display in preview mode */
  previewValue?: string | null
  /** Whether the input is disabled */
  disabled?: boolean
  /** Whether the input is read-only */
  readOnly?: boolean
  /** Whether to show a copy button */
  showCopyButton?: boolean
  /** Whether to use webhook URL as value */
  useWebhookUrl?: boolean
  /** Ref to expose wand control handlers to parent */
  wandControlRef?: React.MutableRefObject<WandControlHandlers | null>
  /** Whether to hide the internal wand button (controlled by parent) */
  hideInternalWand?: boolean
}

/**
 * Single-line text input component with advanced features
 *
 * @remarks
 * - Supports AI-powered content generation via Wand functionality
 * - Auto-detects API key fields and provides environment variable suggestions
 * - Handles drag-and-drop for connections and variable references
 * - Provides environment variable and tag autocomplete
 * - Password masking with reveal on focus
 * - Copy to clipboard functionality
 * - Integrates with ReactFlow for zoom control
 */
export function ShortInput({
  blockId,
  subBlockId,
  placeholder,
  password,
  config,
  onChange,
  value: propValue,
  isPreview = false,
  previewValue,
  disabled = false,
  readOnly = false,
  showCopyButton = false,
  useWebhookUrl = false,
  wandControlRef,
  hideInternalWand = false,
}: ShortInputProps) {
  const [localContent, setLocalContent] = useState<string>('')
  const [isFocused, setIsFocused] = useState(false)
  const [copied, setCopied] = useState(false)
  const persistSubBlockValueRef = useRef<(value: string) => void>(() => {})

  const justPastedRef = useRef(false)

  const webhookManagement = useWebhookManagement({
    blockId,
    triggerId: undefined,
    isPreview,
  })

  const wandHook = useWand({
    wandConfig: config.wandConfig,
    currentValue: localContent,
    onStreamStart: () => {
      setLocalContent('')
    },
    onStreamChunk: (chunk) => {
      setLocalContent((current) => current + chunk)
    },
    onGeneratedContent: (content) => {
      setLocalContent(content)
      if (!isPreview && !disabled && !readOnly) {
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

  const isWandEnabled = config.wandConfig?.enabled ?? false

  const overlayRef = useRef<HTMLDivElement>(null)

  const reactFlowInstance = useReactFlow()

  const accessiblePrefixes = useAccessibleReferencePrefixes(blockId)

  const isApiKeyField = useMemo(() => {
    const normalizedId = config?.id?.replace(/\s+/g, '').toLowerCase() || ''
    const normalizedTitle = config?.title?.replace(/\s+/g, '').toLowerCase() || ''

    const apiKeyPatterns = [
      'apikey',
      'api_key',
      'api-key',
      'secretkey',
      'secret_key',
      'secret-key',
      'token',
      'access_token',
      'auth_token',
      'secret',
      'password',
    ]

    return apiKeyPatterns.some(
      (pattern) =>
        normalizedId === pattern ||
        normalizedTitle === pattern ||
        normalizedId.includes(pattern) ||
        normalizedTitle.includes(pattern)
    )
  }, [config?.id, config?.title])

  const shouldForceEnvDropdown = useCallback(
    ({
      value,
      event,
    }: {
      value: string
      cursor: number
      event: 'change' | 'focus' | 'deleteAll'
    }) => {
      if (!isApiKeyField || isPreview || disabled || readOnly) return { show: false }

      if (justPastedRef.current) {
        return { show: false }
      }

      if (event === 'focus') {
        if (value.length > 20 && !value.includes('{{')) {
          return { show: false }
        }
        return { show: true, searchTerm: '' }
      }
      if (event === 'change') {
        const looksLikeRawApiKey =
          value.length > 30 && !value.includes('{{') && !value.match(/^[A-Z_][A-Z0-9_]*$/i)
        if (looksLikeRawApiKey) {
          return { show: false }
        }
        return { show: true, searchTerm: value }
      }
      if (event === 'deleteAll') {
        return { show: true, searchTerm: '' }
      }
      return { show: false }
    },
    [isApiKeyField, isPreview, disabled, readOnly]
  )

  const baseValue = isPreview ? previewValue : propValue !== undefined ? propValue : undefined

  const effectiveValue =
    useWebhookUrl && webhookManagement.webhookUrl ? webhookManagement.webhookUrl : baseValue

  const value = wandHook?.isStreaming ? localContent : effectiveValue

  useEffect(() => {
    if (!wandHook.isStreaming) {
      const baseValueString = baseValue?.toString() ?? ''
      if (baseValueString !== localContent) {
        setLocalContent(baseValueString)
      }
    }
  }, [baseValue, wandHook.isStreaming, localContent])

  const handleScroll = useCallback((e: React.UIEvent<HTMLInputElement>) => {
    if (overlayRef.current) {
      overlayRef.current.scrollLeft = e.currentTarget.scrollLeft
    }
  }, [])

  const handlePaste = useCallback((_e: React.ClipboardEvent<HTMLInputElement>) => {
    justPastedRef.current = true
    setTimeout(() => {
      justPastedRef.current = false
    }, 100)
  }, [])

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLInputElement>) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        e.stopPropagation()

        const currentZoom = reactFlowInstance.getZoom()
        const { x: viewportX, y: viewportY } = reactFlowInstance.getViewport()

        const delta = e.deltaY > 0 ? 1 : -1
        const zoomFactor = 0.96 ** delta

        const newZoom = Math.min(Math.max(currentZoom * zoomFactor, 0.1), 1)

        const { x: pointerX, y: pointerY } = reactFlowInstance.screenToFlowPosition({
          x: e.clientX,
          y: e.clientY,
        })

        const newViewportX = viewportX + (pointerX * currentZoom - pointerX * newZoom)
        const newViewportY = viewportY + (pointerY * currentZoom - pointerY * newZoom)

        reactFlowInstance.setViewport(
          {
            x: newViewportX,
            y: newViewportY,
            zoom: newZoom,
          },
          { duration: 0 }
        )

        return false
      }

      return true
    },
    [reactFlowInstance]
  )

  /**
   * Handles copying the value to the clipboard.
   */
  const handleCopy = useCallback(() => {
    const textToCopy = useWebhookUrl ? webhookManagement?.webhookUrl : value?.toString()
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [useWebhookUrl, webhookManagement?.webhookUrl, value])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
  }, [])

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
      {isWandEnabled && !hideInternalWand && (
        <WandPromptBar
          isVisible={wandHook.isPromptVisible}
          isLoading={wandHook.isLoading}
          isStreaming={wandHook.isStreaming}
          promptValue={wandHook.promptInputValue}
          onSubmit={(prompt: string) => wandHook.generateStream({ prompt })}
          onCancel={wandHook.isStreaming ? wandHook.cancelGeneration : wandHook.hidePromptInline}
          onChange={(newValue: string) => wandHook.updatePromptValue(newValue)}
          placeholder={config.wandConfig?.placeholder || 'Describe what you want to generate...'}
        />
      )}

      <div className='group relative w-full'>
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
          shouldForceEnvDropdown={shouldForceEnvDropdown}
        >
          {({
            ref,
            value: ctrlValue,
            onChange: handleChange,
            onKeyDown,
            onDrop,
            onDragOver,
            onFocus,
          }) => {
            const actualValue = wandHook.isStreaming
              ? localContent
              : useWebhookUrl && webhookManagement.webhookUrl
                ? webhookManagement.webhookUrl
                : ctrlValue

            const displayValue =
              password && !isFocused ? '•'.repeat(actualValue?.length ?? 0) : actualValue

            const formattedText =
              password && !isFocused
                ? '•'.repeat(actualValue?.length ?? 0)
                : formatDisplayText(actualValue, {
                    accessiblePrefixes,
                    highlightAll: !accessiblePrefixes,
                  })

            return (
              <>
                <Input
                  ref={ref as React.RefObject<HTMLInputElement>}
                  className={cn(
                    'allow-scroll w-full overflow-auto text-transparent caret-foreground [-ms-overflow-style:none] [scrollbar-width:none] placeholder:text-muted-foreground/50 [&::-webkit-scrollbar]:hidden',
                    showCopyButton && 'pr-14'
                  )}
                  readOnly={readOnly}
                  placeholder={placeholder ?? ''}
                  type='text'
                  value={displayValue}
                  onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                  onFocus={() => {
                    setIsFocused(true)
                    onFocus()
                  }}
                  onBlur={handleBlur}
                  onDrop={onDrop as (e: React.DragEvent<HTMLInputElement>) => void}
                  onDragOver={onDragOver as (e: React.DragEvent<HTMLInputElement>) => void}
                  onScroll={handleScroll}
                  onPaste={handlePaste}
                  onWheel={handleWheel}
                  onKeyDown={onKeyDown as (e: React.KeyboardEvent<HTMLInputElement>) => void}
                  autoComplete='off'
                  disabled={disabled}
                />
                <div
                  ref={overlayRef}
                  className={cn(
                    'pointer-events-none absolute inset-0 flex items-center overflow-x-auto bg-transparent px-[8px] py-[6px] font-medium font-sans text-foreground text-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
                    showCopyButton ? 'pr-14' : 'pr-3'
                  )}
                >
                  <div className='min-w-fit whitespace-pre'>{formattedText}</div>
                </div>
              </>
            )
          }}
        </SubBlockInputController>

        {/* Copy Button */}
        {showCopyButton && value && (
          <div className='pointer-events-none absolute top-0 right-0 bottom-0 z-10 flex w-14 items-center justify-end pr-2 opacity-0 transition-opacity group-hover:opacity-100'>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={handleCopy}
              disabled={!value}
              className='pointer-events-auto h-6 w-6 p-0'
              aria-label='Copy value'
            >
              {copied ? (
                <Check className='h-3.5 w-3.5 text-green-500' />
              ) : (
                <Copy className='h-3.5 w-3.5 text-muted-foreground' />
              )}
            </Button>
          </div>
        )}

        {/* Wand Button - only show if not hidden by parent */}
        {isWandEnabled && !isPreview && !wandHook.isStreaming && !hideInternalWand && (
          <div className='-translate-y-1/2 absolute top-1/2 right-3 z-10 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
            <Button
              variant='ghost'
              size='icon'
              onClick={
                wandHook.isPromptVisible ? wandHook.hidePromptInline : wandHook.showPromptInline
              }
              disabled={wandHook.isLoading || wandHook.isStreaming || disabled}
              aria-label='Generate content with AI'
              className='h-8 w-8 rounded-full border border-transparent bg-muted/80 text-muted-foreground shadow-sm transition-all duration-200 hover:border-primary/20 hover:bg-muted hover:text-foreground hover:shadow'
            >
              <Wand2 className='h-4 w-4' />
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
```

--------------------------------------------------------------------------------

````
