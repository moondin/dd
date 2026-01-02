---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 427
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 427 of 933)

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

---[FILE: tool-command.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/tool-input/components/tool-command/tool-command.tsx
Signals: React

```typescript
import React, {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { cn } from '@/lib/core/utils/cn'

type CommandContextType = {
  searchQuery: string
  setSearchQuery: (value: string) => void
  activeIndex: number
  setActiveIndex: (index: number) => void
  filteredItems: string[]
  registerItem: (id: string) => void
  unregisterItem: (id: string) => void
  selectItem: (id: string) => void
  handleKeyDown: (e: React.KeyboardEvent) => void
}

const CommandContext = createContext<CommandContextType | undefined>(undefined)

const useCommandContext = () => {
  const context = useContext(CommandContext)
  if (!context) {
    throw new Error('Command components must be used within a CommandProvider')
  }
  return context
}

export const useCommandKeyDown = () => {
  const context = useContext(CommandContext)
  return context?.handleKeyDown
}

interface CommandProps {
  children: ReactNode
  className?: string
  filter?: (value: string, search: string) => number
  searchQuery?: string
}

interface CommandListProps {
  children: ReactNode
  className?: string
}

interface CommandEmptyProps {
  children: ReactNode
  className?: string
}

interface CommandItemProps {
  children: ReactNode
  className?: string
  value: string
  onSelect?: () => void
  disabled?: boolean
}

interface CommandSeparatorProps {
  className?: string
}

export function Command({
  children,
  className,
  filter,
  searchQuery: externalSearchQuery,
}: CommandProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [items, setItems] = useState<string[]>([])
  const [filteredItems, setFilteredItems] = useState<string[]>([])

  const searchQuery = externalSearchQuery ?? internalSearchQuery

  const registerItem = useCallback((id: string) => {
    setItems((prev) => {
      if (prev.includes(id)) return prev
      return [...prev, id]
    })
  }, [])

  const unregisterItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item !== id))
  }, [])

  const selectItem = useCallback(
    (id: string) => {
      const index = filteredItems.indexOf(id)
      if (index >= 0) {
        setActiveIndex(index)
      }
    },
    [filteredItems]
  )

  useEffect(() => {
    if (!searchQuery) {
      setFilteredItems(items)
      return
    }

    const filtered = items.filter((item) => {
      const score = filter ? filter(item, searchQuery) : defaultFilter(item, searchQuery)
      return score > 0
    })

    setFilteredItems(filtered)
    setActiveIndex(filtered.length > 0 ? 0 : -1)
  }, [searchQuery, items, filter])

  useEffect(() => {
    if (activeIndex >= 0 && filteredItems[activeIndex]) {
      const activeElement = document.getElementById(filteredItems[activeIndex])
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }
    }
  }, [activeIndex, filteredItems])

  const defaultFilter = useCallback((value: string, search: string): number => {
    const normalizedValue = value.toLowerCase()
    const normalizedSearch = search.toLowerCase()

    if (normalizedValue === normalizedSearch) return 1
    if (normalizedValue.startsWith(normalizedSearch)) return 0.8
    if (normalizedValue.includes(normalizedSearch)) return 0.6
    return 0
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (filteredItems.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setActiveIndex((prev) => (prev + 1) % filteredItems.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
          break
        case 'Enter':
          if (activeIndex >= 0) {
            e.preventDefault()
            document.getElementById(filteredItems[activeIndex])?.click()
          }
          break
      }
    },
    [filteredItems, activeIndex]
  )

  const contextValue = useMemo(
    () => ({
      searchQuery,
      setSearchQuery: setInternalSearchQuery,
      activeIndex,
      setActiveIndex,
      filteredItems,
      registerItem,
      unregisterItem,
      selectItem,
      handleKeyDown,
    }),
    [
      searchQuery,
      activeIndex,
      filteredItems,
      registerItem,
      unregisterItem,
      selectItem,
      handleKeyDown,
    ]
  )

  return (
    <CommandContext.Provider value={contextValue}>
      <div className={cn('flex w-full flex-col', className)}>{children}</div>
    </CommandContext.Provider>
  )
}

export function CommandList({ children, className }: CommandListProps) {
  return <div className={cn(className)}>{children}</div>
}

export function CommandEmpty({ children, className }: CommandEmptyProps) {
  const { filteredItems } = useCommandContext()

  if (filteredItems.length > 0) return null

  return (
    <div className={cn('px-[6px] py-[8px] text-[12px] text-[var(--white)]/60', className)}>
      {children}
    </div>
  )
}

export function CommandItem({
  children,
  className,
  value,
  onSelect,
  disabled = false,
}: CommandItemProps) {
  const { activeIndex, filteredItems, registerItem, unregisterItem } = useCommandContext()
  const isActive = filteredItems.indexOf(value) === activeIndex
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (value) {
      registerItem(value)
      return () => unregisterItem(value)
    }
  }, [value, registerItem, unregisterItem])

  const shouldDisplay = filteredItems.includes(value)

  if (!shouldDisplay) return null

  return (
    <button
      id={value}
      className={cn(
        'flex h-[25px] w-full cursor-pointer select-none items-center gap-[8px] rounded-[6px] px-[6px] font-base text-[12px] text-[var(--text-primary)] outline-none transition-colors hover:bg-[var(--surface-9)] hover:text-[var(--text-primary)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:pointer-events-none data-[selected=true]:bg-[var(--surface-9)] data-[selected=true]:text-[var(--text-primary)] data-[disabled=true]:opacity-50',
        (isActive || isHovered) && 'bg-[var(--surface-9)] text-[var(--text-primary)]',
        className
      )}
      onClick={() => !disabled && onSelect?.()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-selected={isActive || isHovered}
      data-disabled={disabled}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export function CommandSeparator({ className }: CommandSeparatorProps) {
  return <div className={cn('-mx-1 h-px bg-border', className)} />
}

export const ToolCommand = {
  Root: Command,
  List: CommandList,
  Empty: CommandEmpty,
  Item: CommandItem,
  Separator: CommandSeparator,
}
```

--------------------------------------------------------------------------------

---[FILE: trigger-save.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/trigger-save/trigger-save.tsx
Signals: React

```typescript
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@/components/emcn/components'
import { Trash } from '@/components/emcn/icons/trash'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/core/utils/cn'
import { createLogger } from '@/lib/logs/console/logger'
import { useCollaborativeWorkflow } from '@/hooks/use-collaborative-workflow'
import { useTriggerConfigAggregation } from '@/hooks/use-trigger-config-aggregation'
import { useWebhookManagement } from '@/hooks/use-webhook-management'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'
import { getTrigger, isTriggerValid } from '@/triggers'
import { SYSTEM_SUBBLOCK_IDS } from '@/triggers/constants'
import { ShortInput } from '../short-input/short-input'

const logger = createLogger('TriggerSave')

interface TriggerSaveProps {
  blockId: string
  subBlockId: string
  triggerId?: string
  isPreview?: boolean
  disabled?: boolean
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export function TriggerSave({
  blockId,
  subBlockId,
  triggerId,
  isPreview = false,
  disabled = false,
}: TriggerSaveProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'deleting'>('idle')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isGeneratingTestUrl, setIsGeneratingTestUrl] = useState(false)

  const storedTestUrl = useSubBlockStore((state) => state.getValue(blockId, 'testUrl'))
  const storedTestUrlExpiresAt = useSubBlockStore((state) =>
    state.getValue(blockId, 'testUrlExpiresAt')
  )

  const isTestUrlExpired = useMemo(() => {
    if (!storedTestUrlExpiresAt) return true
    return new Date(storedTestUrlExpiresAt) < new Date()
  }, [storedTestUrlExpiresAt])

  const testUrl = isTestUrlExpired ? null : (storedTestUrl as string | null)
  const testUrlExpiresAt = isTestUrlExpired ? null : (storedTestUrlExpiresAt as string | null)

  const effectiveTriggerId = useMemo(() => {
    if (triggerId && isTriggerValid(triggerId)) {
      return triggerId
    }
    const selectedTriggerId = useSubBlockStore.getState().getValue(blockId, 'selectedTriggerId')
    if (typeof selectedTriggerId === 'string' && isTriggerValid(selectedTriggerId)) {
      return selectedTriggerId
    }
    return triggerId
  }, [blockId, triggerId])

  const { collaborativeSetSubblockValue } = useCollaborativeWorkflow()

  const { webhookId, saveConfig, deleteConfig, isLoading } = useWebhookManagement({
    blockId,
    triggerId: effectiveTriggerId,
    isPreview,
  })

  const triggerConfig = useSubBlockStore((state) => state.getValue(blockId, 'triggerConfig'))
  const triggerCredentials = useSubBlockStore((state) =>
    state.getValue(blockId, 'triggerCredentials')
  )

  const triggerDef =
    effectiveTriggerId && isTriggerValid(effectiveTriggerId) ? getTrigger(effectiveTriggerId) : null

  const hasWebhookUrlDisplay =
    triggerDef?.subBlocks.some((sb) => sb.id === 'webhookUrlDisplay') ?? false

  const validateRequiredFields = useCallback(
    (
      configToCheck: Record<string, any> | null | undefined
    ): { valid: boolean; missingFields: string[] } => {
      if (!triggerDef) {
        return { valid: true, missingFields: [] }
      }

      const missingFields: string[] = []

      triggerDef.subBlocks
        .filter(
          (sb) => sb.required && sb.mode === 'trigger' && !SYSTEM_SUBBLOCK_IDS.includes(sb.id)
        )
        .forEach((subBlock) => {
          if (subBlock.id === 'triggerCredentials') {
            if (!triggerCredentials) {
              missingFields.push(subBlock.title || 'Credentials')
            }
          } else {
            const value = configToCheck?.[subBlock.id]
            if (value === undefined || value === null || value === '') {
              missingFields.push(subBlock.title || subBlock.id)
            }
          }
        })

      return {
        valid: missingFields.length === 0,
        missingFields,
      }
    },
    [triggerDef, triggerCredentials]
  )

  const requiredSubBlockIds = useMemo(() => {
    if (!triggerDef) return []
    return triggerDef.subBlocks
      .filter((sb) => sb.required && sb.mode === 'trigger' && !SYSTEM_SUBBLOCK_IDS.includes(sb.id))
      .map((sb) => sb.id)
  }, [triggerDef])

  const subscribedSubBlockValues = useSubBlockStore(
    useCallback(
      (state) => {
        if (!triggerDef) return {}
        const values: Record<string, any> = {}
        requiredSubBlockIds.forEach((subBlockId) => {
          const value = state.getValue(blockId, subBlockId)
          if (value !== null && value !== undefined && value !== '') {
            values[subBlockId] = value
          }
        })
        return values
      },
      [blockId, triggerDef, requiredSubBlockIds]
    )
  )

  const previousValuesRef = useRef<Record<string, any>>({})
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (saveStatus !== 'error' || !triggerDef) {
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
      const aggregatedConfig = useTriggerConfigAggregation(blockId, effectiveTriggerId)

      if (aggregatedConfig) {
        useSubBlockStore.getState().setValue(blockId, 'triggerConfig', aggregatedConfig)
      }

      const validation = validateRequiredFields(aggregatedConfig)

      if (validation.valid) {
        setErrorMessage(null)
        setSaveStatus('idle')
        logger.debug('Error cleared after validation passed', {
          blockId,
          triggerId: effectiveTriggerId,
        })
      } else {
        setErrorMessage(`Missing required fields: ${validation.missingFields.join(', ')}`)
        logger.debug('Error message updated', {
          blockId,
          triggerId: effectiveTriggerId,
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
  }, [
    blockId,
    effectiveTriggerId,
    triggerDef,
    subscribedSubBlockValues,
    saveStatus,
    validateRequiredFields,
  ])

  useEffect(() => {
    if (isTestUrlExpired && storedTestUrl) {
      useSubBlockStore.getState().setValue(blockId, 'testUrl', null)
      useSubBlockStore.getState().setValue(blockId, 'testUrlExpiresAt', null)
    }
  }, [blockId, isTestUrlExpired, storedTestUrl])

  const handleSave = async () => {
    if (isPreview || disabled) return

    setSaveStatus('saving')
    setErrorMessage(null)

    try {
      const aggregatedConfig = useTriggerConfigAggregation(blockId, effectiveTriggerId)

      if (aggregatedConfig) {
        useSubBlockStore.getState().setValue(blockId, 'triggerConfig', aggregatedConfig)
        logger.debug('Stored aggregated trigger config', {
          blockId,
          triggerId: effectiveTriggerId,
          aggregatedConfig,
        })
      }

      const validation = validateRequiredFields(aggregatedConfig)
      if (!validation.valid) {
        setErrorMessage(`Missing required fields: ${validation.missingFields.join(', ')}`)
        setSaveStatus('error')
        return
      }

      const success = await saveConfig()
      if (!success) {
        throw new Error('Save config returned false')
      }

      setSaveStatus('saved')
      setErrorMessage(null)

      const savedWebhookId = useSubBlockStore.getState().getValue(blockId, 'webhookId')
      const savedTriggerPath = useSubBlockStore.getState().getValue(blockId, 'triggerPath')
      const savedTriggerId = useSubBlockStore.getState().getValue(blockId, 'triggerId')
      const savedTriggerConfig = useSubBlockStore.getState().getValue(blockId, 'triggerConfig')

      collaborativeSetSubblockValue(blockId, 'webhookId', savedWebhookId)
      collaborativeSetSubblockValue(blockId, 'triggerPath', savedTriggerPath)
      collaborativeSetSubblockValue(blockId, 'triggerId', savedTriggerId)
      collaborativeSetSubblockValue(blockId, 'triggerConfig', savedTriggerConfig)

      setTimeout(() => {
        setSaveStatus('idle')
      }, 2000)

      logger.info('Trigger configuration saved successfully', {
        blockId,
        triggerId: effectiveTriggerId,
        hasWebhookId: !!webhookId,
      })
    } catch (error: any) {
      setSaveStatus('error')
      setErrorMessage(error.message || 'An error occurred while saving.')
      logger.error('Error saving trigger configuration', { error })
    }
  }

  const generateTestUrl = async () => {
    if (!webhookId) return
    try {
      setIsGeneratingTestUrl(true)
      const res = await fetch(`/api/webhooks/${webhookId}/test-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || 'Failed to generate test URL')
      }
      const json = await res.json()
      useSubBlockStore.getState().setValue(blockId, 'testUrl', json.url)
      useSubBlockStore.getState().setValue(blockId, 'testUrlExpiresAt', json.expiresAt)
      collaborativeSetSubblockValue(blockId, 'testUrl', json.url)
      collaborativeSetSubblockValue(blockId, 'testUrlExpiresAt', json.expiresAt)
    } catch (e) {
      logger.error('Failed to generate test webhook URL', { error: e })
      setErrorMessage(
        e instanceof Error ? e.message : 'Failed to generate test URL. Please try again.'
      )
    } finally {
      setIsGeneratingTestUrl(false)
    }
  }

  const handleDeleteClick = () => {
    if (isPreview || disabled || !webhookId) return
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    setShowDeleteDialog(false)
    setDeleteStatus('deleting')
    setErrorMessage(null)

    try {
      const success = await deleteConfig()

      if (success) {
        setDeleteStatus('idle')
        setSaveStatus('idle')
        setErrorMessage(null)

        useSubBlockStore.getState().setValue(blockId, 'testUrl', null)
        useSubBlockStore.getState().setValue(blockId, 'testUrlExpiresAt', null)

        collaborativeSetSubblockValue(blockId, 'triggerPath', '')
        collaborativeSetSubblockValue(blockId, 'webhookId', null)
        collaborativeSetSubblockValue(blockId, 'triggerConfig', null)
        collaborativeSetSubblockValue(blockId, 'testUrl', null)
        collaborativeSetSubblockValue(blockId, 'testUrlExpiresAt', null)

        logger.info('Trigger configuration deleted successfully', {
          blockId,
          triggerId: effectiveTriggerId,
        })
      } else {
        setDeleteStatus('idle')
        setErrorMessage('Failed to delete trigger configuration.')
        logger.error('Failed to delete trigger configuration')
      }
    } catch (error: any) {
      setDeleteStatus('idle')
      setErrorMessage(error.message || 'An error occurred while deleting.')
      logger.error('Error deleting trigger configuration', { error })
    }
  }

  if (isPreview) {
    return null
  }

  const isProcessing = saveStatus === 'saving' || deleteStatus === 'deleting' || isLoading

  return (
    <div id={`${blockId}-${subBlockId}`}>
      <div className='flex gap-2'>
        <Button
          variant='default'
          onClick={handleSave}
          disabled={disabled || isProcessing}
          className={cn(
            'h-[32px] flex-1 rounded-[8px] px-[12px] transition-all duration-200',
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
          {saveStatus === 'error' && 'Error'}
          {saveStatus === 'idle' && (webhookId ? 'Update Configuration' : 'Save Configuration')}
        </Button>

        {webhookId && (
          <Button
            variant='default'
            onClick={handleDeleteClick}
            disabled={disabled || isProcessing}
            className='h-[32px] rounded-[8px] px-[12px]'
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

      {webhookId && hasWebhookUrlDisplay && (
        <div className='mt-2 space-y-1'>
          <div className='flex items-center justify-between'>
            <span className='font-medium text-sm'>Test Webhook URL</span>
            <Button
              variant='outline'
              onClick={generateTestUrl}
              disabled={isGeneratingTestUrl || isProcessing}
              className='h-[32px] rounded-[8px] px-[12px]'
            >
              {isGeneratingTestUrl ? (
                <>
                  <div className='mr-2 h-3 w-3 animate-spin rounded-full border-[1.5px] border-current border-t-transparent' />
                  Generating…
                </>
              ) : testUrl ? (
                'Regenerate'
              ) : (
                'Generate'
              )}
            </Button>
          </div>
          {testUrl ? (
            <ShortInput
              blockId={blockId}
              subBlockId={`${subBlockId}-test-url`}
              config={{
                id: `${subBlockId}-test-url`,
                type: 'short-input',
                readOnly: true,
                showCopyButton: true,
              }}
              value={testUrl}
              readOnly={true}
              showCopyButton={true}
              disabled={isPreview || disabled}
              isPreview={isPreview}
            />
          ) : (
            <p className='text-muted-foreground text-xs'>
              Generate a temporary URL that executes this webhook against the live (undeployed)
              workflow state.
            </p>
          )}
          {testUrlExpiresAt && (
            <p className='text-muted-foreground text-xs'>
              Expires at {new Date(testUrlExpiresAt).toLocaleString()}
            </p>
          )}
        </div>
      )}

      <Modal open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <ModalContent size='sm'>
          <ModalHeader>Delete Trigger</ModalHeader>
          <ModalBody>
            <p className='text-[12px] text-[var(--text-tertiary)]'>
              Are you sure you want to delete this trigger configuration? This will remove the
              webhook and stop all incoming triggers.{' '}
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

````
