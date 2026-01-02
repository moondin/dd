---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 438
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 438 of 933)

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

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-block/components/index.ts

```typescript
export { ActionBar } from './action-bar/action-bar'
export { Connections } from './connections/connections'
```

--------------------------------------------------------------------------------

---[FILE: action-bar.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-block/components/action-bar/action-bar.tsx
Signals: React

```typescript
import { memo, useCallback } from 'react'
import { ArrowLeftRight, ArrowUpDown, Circle, CircleOff, LogOut } from 'lucide-react'
import { Button, Copy, Tooltip, Trash2 } from '@/components/emcn'
import { cn } from '@/lib/core/utils/cn'
import { useUserPermissionsContext } from '@/app/workspace/[workspaceId]/providers/workspace-permissions-provider'
import { useCollaborativeWorkflow } from '@/hooks/use-collaborative-workflow'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'

/**
 * Props for the ActionBar component
 */
interface ActionBarProps {
  /** Unique identifier for the block */
  blockId: string
  /** Type of the block */
  blockType: string
  /** Whether the action bar is disabled */
  disabled?: boolean
}

/**
 * ActionBar component displays action buttons for workflow blocks
 * Provides controls for enabling/disabling, duplicating, removing, and toggling block handles
 *
 * @component
 */
export const ActionBar = memo(
  function ActionBar({ blockId, blockType, disabled = false }: ActionBarProps) {
    const {
      collaborativeRemoveBlock,
      collaborativeToggleBlockEnabled,
      collaborativeDuplicateBlock,
      collaborativeToggleBlockHandles,
    } = useCollaborativeWorkflow()

    /**
     * Optimized single store subscription for all block data
     */
    const { isEnabled, horizontalHandles, parentId, parentType } = useWorkflowStore(
      useCallback(
        (state) => {
          const block = state.blocks[blockId]
          const parentId = block?.data?.parentId
          return {
            isEnabled: block?.enabled ?? true,
            horizontalHandles: block?.horizontalHandles ?? false,
            parentId,
            parentType: parentId ? state.blocks[parentId]?.type : undefined,
          }
        },
        [blockId]
      )
    )

    const userPermissions = useUserPermissionsContext()

    const isStarterBlock = blockType === 'starter'
    // Check for start_trigger (unified start block) - prevent duplication but allow deletion
    const isStartBlock = blockType === 'starter' || blockType === 'start_trigger'

    /**
     * Get appropriate tooltip message based on disabled state
     *
     * @param defaultMessage - The default message to show when not disabled
     * @returns The tooltip message
     */
    const getTooltipMessage = (defaultMessage: string) => {
      if (disabled) {
        return userPermissions.isOfflineMode ? 'Connection lost - please refresh' : 'Read-only mode'
      }
      return defaultMessage
    }

    return (
      <div
        className={cn(
          '-top-[46px] absolute right-0',
          'flex flex-row items-center',
          'opacity-0 transition-opacity duration-200 group-hover:opacity-100',
          'gap-[5px] rounded-[10px] bg-[var(--surface-3)] p-[5px]'
        )}
      >
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Button
              variant='ghost'
              onClick={(e) => {
                e.stopPropagation()
                if (!disabled) {
                  collaborativeToggleBlockEnabled(blockId)
                }
              }}
              className='hover:!text-[var(--text-inverse)] h-[23px] w-[23px] rounded-[8px] bg-[var(--surface-9)] p-0 text-[#868686] hover:bg-[var(--brand-secondary)]'
              disabled={disabled}
            >
              {isEnabled ? (
                <Circle className='h-[11px] w-[11px]' />
              ) : (
                <CircleOff className='h-[11px] w-[11px]' />
              )}
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content side='top'>
            {getTooltipMessage(isEnabled ? 'Disable Block' : 'Enable Block')}
          </Tooltip.Content>
        </Tooltip.Root>

        {!isStartBlock && (
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Button
                variant='ghost'
                onClick={(e) => {
                  e.stopPropagation()
                  if (!disabled) {
                    collaborativeDuplicateBlock(blockId)
                  }
                }}
                className='hover:!text-[var(--text-inverse)] h-[23px] w-[23px] rounded-[8px] bg-[var(--surface-9)] p-0 text-[#868686] hover:bg-[var(--brand-secondary)]'
                disabled={disabled}
              >
                <Copy className='h-[11px] w-[11px]' />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content side='top'>{getTooltipMessage('Duplicate Block')}</Tooltip.Content>
          </Tooltip.Root>
        )}

        {!isStartBlock && parentId && (parentType === 'loop' || parentType === 'parallel') && (
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Button
                variant='ghost'
                onClick={(e) => {
                  e.stopPropagation()
                  if (!disabled && userPermissions.canEdit) {
                    window.dispatchEvent(
                      new CustomEvent('remove-from-subflow', { detail: { blockId } })
                    )
                  }
                }}
                className='hover:!text-[var(--text-inverse)] h-[23px] w-[23px] rounded-[8px] bg-[var(--surface-9)] p-0 text-[#868686] hover:bg-[var(--brand-secondary)]'
                disabled={disabled || !userPermissions.canEdit}
              >
                <LogOut className='h-[11px] w-[11px]' />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content side='top'>{getTooltipMessage('Remove from Subflow')}</Tooltip.Content>
          </Tooltip.Root>
        )}

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Button
              variant='ghost'
              onClick={(e) => {
                e.stopPropagation()
                if (!disabled) {
                  collaborativeToggleBlockHandles(blockId)
                }
              }}
              className='hover:!text-[var(--text-inverse)] h-[23px] w-[23px] rounded-[8px] bg-[var(--surface-9)] p-0 text-[#868686] hover:bg-[var(--brand-secondary)]'
              disabled={disabled}
            >
              {horizontalHandles ? (
                <ArrowLeftRight className='h-[11px] w-[11px]' />
              ) : (
                <ArrowUpDown className='h-[11px] w-[11px]' />
              )}
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content side='top'>
            {getTooltipMessage(horizontalHandles ? 'Vertical Ports' : 'Horizontal Ports')}
          </Tooltip.Content>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Button
              variant='ghost'
              onClick={(e) => {
                e.stopPropagation()
                if (!disabled) {
                  collaborativeRemoveBlock(blockId)
                }
              }}
              className='hover:!text-[var(--text-inverse)] h-[23px] w-[23px] rounded-[8px] bg-[var(--surface-9)] p-0 text-[#868686] hover:bg-[var(--brand-secondary)]'
              disabled={disabled}
            >
              <Trash2 className='h-[11px] w-[11px]' />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content side='top'>{getTooltipMessage('Delete Block')}</Tooltip.Content>
        </Tooltip.Root>
      </div>
    )
  },
  /**
   * Custom comparison function for memo optimization
   * Only re-renders if props actually changed
   *
   * @param prevProps - Previous component props
   * @param nextProps - Next component props
   * @returns True if props are equal (should not re-render), false otherwise
   */
  (prevProps, nextProps) => {
    return (
      prevProps.blockId === nextProps.blockId &&
      prevProps.blockType === nextProps.blockType &&
      prevProps.disabled === nextProps.disabled
    )
  }
)
```

--------------------------------------------------------------------------------

---[FILE: connections.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-block/components/connections/connections.tsx

```typescript
import { useBlockConnections } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/hooks/use-block-connections'

interface ConnectionsProps {
  blockId: string
}

/**
 * Displays incoming connections at the bottom left of the workflow block
 */
export function Connections({ blockId }: ConnectionsProps) {
  const { incomingConnections, hasIncomingConnections } = useBlockConnections(blockId)

  if (!hasIncomingConnections) return null

  const connectionCount = incomingConnections.length
  const connectionText = `${connectionCount} ${connectionCount === 1 ? 'connection' : 'connections'}`

  return (
    <div className='pointer-events-none absolute top-full left-0 ml-[8px] flex items-center gap-[8px] pt-[8px] opacity-0 transition-opacity group-hover:opacity-100'>
      <span className='text-[12px] text-[var(--text-tertiary)]'>{connectionText}</span>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-block/hooks/index.ts

```typescript
export { useBlockProperties } from './use-block-properties'
export { useBlockState } from './use-block-state'
export { useChildWorkflow } from './use-child-workflow'
export { useScheduleInfo } from './use-schedule-info'
export { useWebhookInfo } from './use-webhook-info'
```

--------------------------------------------------------------------------------

---[FILE: use-block-properties.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-block/hooks/use-block-properties.ts
Signals: React

```typescript
import { useCallback } from 'react'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'
import type { WorkflowBlockProps } from '../types'

/**
 * Return type for the useBlockProperties hook
 */
export interface UseBlockPropertiesReturn {
  /** Whether the block uses horizontal handles for connections */
  horizontalHandles: boolean
  /** The measured height of the block in pixels */
  blockHeight: number
  /** The measured width of the block in pixels */
  blockWidth: number
  /** Whether the block is in advanced mode for display */
  displayAdvancedMode: boolean
  /** Whether the block is in trigger mode for display */
  displayTriggerMode: boolean
}

/**
 * Custom hook for managing block properties (trigger mode, advanced mode, handles, dimensions)
 *
 * @param blockId - The ID of the block
 * @param isDiffMode - Whether the workflow is in diff mode
 * @param isPreview - Whether the block is in preview mode
 * @param blockState - The block state in preview mode
 * @param currentWorkflowBlocks - Current workflow blocks for diff mode
 * @returns Block properties and display states
 */
export function useBlockProperties(
  blockId: string,
  isDiffMode: boolean,
  isPreview: boolean,
  blockState: WorkflowBlockProps['blockState'],
  currentWorkflowBlocks: Record<string, any>
): UseBlockPropertiesReturn {
  // Get block properties from workflow store
  const {
    storeHorizontalHandles,
    storeBlockHeight,
    storeBlockLayout,
    storeBlockAdvancedMode,
    storeBlockTriggerMode,
  } = useWorkflowStore(
    useCallback(
      (state) => {
        const block = state.blocks[blockId]
        return {
          storeHorizontalHandles: block?.horizontalHandles ?? true,
          storeBlockHeight: block?.height ?? 0,
          storeBlockLayout: block?.layout,
          storeBlockAdvancedMode: block?.advancedMode ?? false,
          storeBlockTriggerMode: block?.triggerMode ?? false,
        }
      },
      [blockId]
    )
  )

  // Determine horizontal handles
  const horizontalHandles = isPreview
    ? (blockState?.horizontalHandles ?? true)
    : isDiffMode
      ? (currentWorkflowBlocks[blockId]?.horizontalHandles ?? true)
      : storeHorizontalHandles

  // Determine block dimensions
  const blockHeight = isDiffMode ? (currentWorkflowBlocks[blockId]?.height ?? 0) : storeBlockHeight

  const blockWidth = isDiffMode
    ? (currentWorkflowBlocks[blockId]?.layout?.measuredWidth ?? 0)
    : (storeBlockLayout?.measuredWidth ?? 0)

  // Get advanced mode from appropriate source
  const blockAdvancedMode = isDiffMode
    ? (currentWorkflowBlocks[blockId]?.advancedMode ?? false)
    : storeBlockAdvancedMode

  // Get trigger mode from appropriate source
  const blockTriggerMode = isDiffMode
    ? (currentWorkflowBlocks[blockId]?.triggerMode ?? false)
    : storeBlockTriggerMode

  // Compute display states
  const displayAdvancedMode = isPreview ? (blockState?.advancedMode ?? false) : blockAdvancedMode

  const displayTriggerMode = isPreview ? (blockState?.triggerMode ?? false) : blockTriggerMode

  return {
    horizontalHandles,
    blockHeight,
    blockWidth,
    displayAdvancedMode,
    displayTriggerMode,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-block-state.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-block/hooks/use-block-state.ts
Signals: React

```typescript
import { useCallback } from 'react'
import type { DiffStatus } from '@/lib/workflows/diff/types'
import { hasDiffStatus } from '@/lib/workflows/diff/types'
import { useExecutionStore } from '@/stores/execution/store'
import { useWorkflowDiffStore } from '@/stores/workflow-diff'
import type { CurrentWorkflow } from '../../../hooks/use-current-workflow'
import type { WorkflowBlockProps } from '../types'

/**
 * Return type for the useBlockState hook
 */
export interface UseBlockStateReturn {
  /** Whether the block is currently enabled */
  isEnabled: boolean
  /** Whether the block is currently active (executing) */
  isActive: boolean
  /** The diff status of the block */
  diffStatus: DiffStatus
  /** Whether this is a deleted block in diff mode */
  isDeletedBlock: boolean
}

/**
 * Custom hook for managing block state, execution status, and diff information
 *
 * @param blockId - The ID of the block
 * @param currentWorkflow - The current workflow object
 * @param data - The block data props
 * @returns Block state and status information
 */
export function useBlockState(
  blockId: string,
  currentWorkflow: CurrentWorkflow,
  data: WorkflowBlockProps
): UseBlockStateReturn {
  const currentBlock = currentWorkflow.getBlockById(blockId)

  // Determine if block is enabled
  const isEnabled = data.isPreview
    ? (data.blockState?.enabled ?? true)
    : (currentBlock?.enabled ?? true)

  // Get diff status
  const diffStatus: DiffStatus =
    currentWorkflow.isDiffMode && currentBlock && hasDiffStatus(currentBlock)
      ? currentBlock.is_diff
      : undefined

  // Get diff-related data
  const { diffAnalysis, isShowingDiff } = useWorkflowDiffStore(
    useCallback(
      (state) => ({
        diffAnalysis: state.diffAnalysis,
        isShowingDiff: state.isShowingDiff,
      }),
      []
    )
  )

  const isDeletedBlock = !isShowingDiff && diffAnalysis?.deleted_blocks?.includes(blockId)

  // Execution state
  const isActiveBlock = useExecutionStore((state) => state.activeBlockIds.has(blockId))
  const isActive = data.isActive || isActiveBlock

  return {
    isEnabled,
    isActive,
    diffStatus,
    isDeletedBlock: isDeletedBlock ?? false,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-child-deployment.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-block/hooks/use-child-deployment.ts
Signals: React

```typescript
import { useCallback, useEffect, useState } from 'react'

/**
 * Return type for the useChildDeployment hook
 */
export interface UseChildDeploymentReturn {
  /** The active version number of the child workflow */
  activeVersion: number | null
  /** Whether the child workflow has an active deployment */
  isDeployed: boolean | null
  /** Whether the child workflow needs redeployment due to changes */
  needsRedeploy: boolean
  /** Whether the deployment information is currently being fetched */
  isLoading: boolean
  /** Function to manually refetch deployment status */
  refetch: () => void
}

/**
 * Custom hook for managing child workflow deployment information
 *
 * @param childWorkflowId - The ID of the child workflow
 * @returns Deployment status and version information
 */
export function useChildDeployment(childWorkflowId: string | undefined): UseChildDeploymentReturn {
  const [activeVersion, setActiveVersion] = useState<number | null>(null)
  const [isDeployed, setIsDeployed] = useState<boolean | null>(null)
  const [needsRedeploy, setNeedsRedeploy] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  const fetchActiveVersion = useCallback(async (wfId: string) => {
    let cancelled = false

    try {
      setIsLoading(true)

      const statusRes = await fetch(`/api/workflows/${wfId}/status`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      })

      if (!statusRes.ok) {
        if (!cancelled) {
          setActiveVersion(null)
          setIsDeployed(null)
          setNeedsRedeploy(false)
        }
        return
      }

      const statusData = await statusRes.json()

      const deploymentsRes = await fetch(`/api/workflows/${wfId}/deployments`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      })

      let activeVersion = null
      if (deploymentsRes.ok) {
        const deploymentsJson = await deploymentsRes.json()
        const versions = Array.isArray(deploymentsJson?.data?.versions)
          ? deploymentsJson.data.versions
          : Array.isArray(deploymentsJson?.versions)
            ? deploymentsJson.versions
            : []

        const active = versions.find((v: any) => v.isActive)
        activeVersion = active ? Number(active.version) : null
      }

      if (!cancelled) {
        setActiveVersion(activeVersion)
        setIsDeployed(statusData.isDeployed || false)
        setNeedsRedeploy(statusData.needsRedeployment || false)
      }
    } catch {
      if (!cancelled) {
        setActiveVersion(null)
        setIsDeployed(null)
        setNeedsRedeploy(false)
      }
    } finally {
      if (!cancelled) setIsLoading(false)
    }

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (childWorkflowId) {
      void fetchActiveVersion(childWorkflowId)
    } else {
      setActiveVersion(null)
      setIsDeployed(null)
      setNeedsRedeploy(false)
    }
  }, [childWorkflowId, refetchTrigger, fetchActiveVersion])

  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1)
  }, [])

  return {
    activeVersion,
    isDeployed,
    needsRedeploy,
    isLoading,
    refetch,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-child-workflow.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-block/hooks/use-child-workflow.ts

```typescript
import { useSubBlockValue } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-value'
import { useChildDeployment } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-block/hooks/use-child-deployment'
import type { WorkflowBlockProps } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-block/types'

/**
 * Return type for the useChildWorkflow hook
 */
export interface UseChildWorkflowReturn {
  /** The ID of the child workflow if configured */
  childWorkflowId: string | undefined
  /** The active version of the child workflow */
  childActiveVersion: number | null
  /** Whether the child workflow is deployed */
  childIsDeployed: boolean | null
  /** Whether the child workflow needs redeployment due to changes */
  childNeedsRedeploy: boolean
  /** Whether the child version information is loading */
  isLoadingChildVersion: boolean
  /** Function to manually refetch deployment status */
  refetchDeployment: () => void
}

/**
 * Custom hook for managing child workflow information for workflow selector blocks
 *
 * @param blockId - The ID of the block
 * @param blockType - The type of the block
 * @param isPreview - Whether the block is in preview mode
 * @param previewSubBlockValues - The subblock values in preview mode
 * @returns Child workflow configuration and deployment status
 */
export function useChildWorkflow(
  blockId: string,
  blockType: string,
  isPreview: boolean,
  previewSubBlockValues?: WorkflowBlockProps['subBlockValues']
): UseChildWorkflowReturn {
  const isWorkflowSelector = blockType === 'workflow' || blockType === 'workflow_input'

  const [workflowIdFromStore] = useSubBlockValue<string>(blockId, 'workflowId')

  let childWorkflowId: string | undefined

  if (!isPreview) {
    const val = workflowIdFromStore
    if (typeof val === 'string' && val.trim().length > 0) {
      childWorkflowId = val
    }
  } else if (isPreview && previewSubBlockValues?.workflowId?.value) {
    const val = previewSubBlockValues.workflowId.value
    if (typeof val === 'string' && val.trim().length > 0) {
      childWorkflowId = val
    }
  }

  const {
    activeVersion: childActiveVersion,
    isDeployed: childIsDeployed,
    needsRedeploy: childNeedsRedeploy,
    isLoading: isLoadingChildVersion,
    refetch: refetchDeployment,
  } = useChildDeployment(isWorkflowSelector ? childWorkflowId : undefined)

  return {
    childWorkflowId,
    childActiveVersion,
    childIsDeployed,
    childNeedsRedeploy,
    isLoadingChildVersion,
    refetchDeployment,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-schedule-info.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-block/hooks/use-schedule-info.ts
Signals: React

```typescript
import { useCallback, useEffect, useState } from 'react'
import { createLogger } from '@/lib/logs/console/logger'
import { parseCronToHumanReadable } from '@/lib/workflows/schedules/utils'
import type { ScheduleInfo } from '../types'

const logger = createLogger('useScheduleInfo')

/**
 * Return type for the useScheduleInfo hook
 */
export interface UseScheduleInfoReturn {
  /** The schedule configuration and timing information */
  scheduleInfo: ScheduleInfo | null
  /** Whether the schedule information is currently being fetched */
  isLoading: boolean
  /** Function to reactivate a disabled schedule */
  reactivateSchedule: (scheduleId: string) => Promise<void>
  /** Function to disable an active schedule */
  disableSchedule: (scheduleId: string) => Promise<void>
}

/**
 * Custom hook for managing schedule information
 *
 * @param blockId - The ID of the block
 * @param blockType - The type of the block
 * @param workflowId - The current workflow ID
 * @returns Schedule information state and operations
 */
export function useScheduleInfo(
  blockId: string,
  blockType: string,
  workflowId: string
): UseScheduleInfoReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [scheduleInfo, setScheduleInfo] = useState<ScheduleInfo | null>(null)

  const fetchScheduleInfo = useCallback(
    async (wfId: string) => {
      if (!wfId) return

      try {
        setIsLoading(true)

        const params = new URLSearchParams({
          workflowId: wfId,
          mode: 'schedule',
          blockId,
        })

        const response = await fetch(`/api/schedules?${params}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        })

        if (!response.ok) {
          setScheduleInfo(null)
          return
        }

        const data = await response.json()

        if (!data.schedule) {
          setScheduleInfo(null)
          return
        }

        const schedule = data.schedule
        const scheduleTimezone = schedule.timezone || 'UTC'

        setScheduleInfo({
          scheduleTiming: schedule.cronExpression
            ? parseCronToHumanReadable(schedule.cronExpression, scheduleTimezone)
            : 'Unknown schedule',
          nextRunAt: schedule.nextRunAt,
          lastRanAt: schedule.lastRanAt,
          timezone: scheduleTimezone,
          status: schedule.status,
          isDisabled: schedule.status === 'disabled',
          id: schedule.id,
        })
      } catch (error) {
        logger.error('Error fetching schedule info:', error)
        setScheduleInfo(null)
      } finally {
        setIsLoading(false)
      }
    },
    [blockId]
  )

  const reactivateSchedule = useCallback(
    async (scheduleId: string) => {
      try {
        const response = await fetch(`/api/schedules/${scheduleId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'reactivate' }),
        })

        if (response.ok && workflowId) {
          fetchScheduleInfo(workflowId)
        } else {
          logger.error('Failed to reactivate schedule')
        }
      } catch (error) {
        logger.error('Error reactivating schedule:', error)
      }
    },
    [workflowId, fetchScheduleInfo]
  )

  const disableSchedule = useCallback(
    async (scheduleId: string) => {
      try {
        const response = await fetch(`/api/schedules/${scheduleId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'disable' }),
        })

        if (response.ok && workflowId) {
          fetchScheduleInfo(workflowId)
        } else {
          logger.error('Failed to disable schedule')
        }
      } catch (error) {
        logger.error('Error disabling schedule:', error)
      }
    },
    [workflowId, fetchScheduleInfo]
  )

  useEffect(() => {
    if (blockType === 'schedule' && workflowId) {
      fetchScheduleInfo(workflowId)
    } else {
      setScheduleInfo(null)
      setIsLoading(false)
    }

    const handleScheduleUpdate = (event: CustomEvent) => {
      if (event.detail?.workflowId === workflowId && event.detail?.blockId === blockId) {
        logger.debug('Schedule update event received, refetching schedule info')
        if (blockType === 'schedule') {
          fetchScheduleInfo(workflowId)
        }
      }
    }

    window.addEventListener('schedule-updated', handleScheduleUpdate as EventListener)

    return () => {
      setIsLoading(false)
      window.removeEventListener('schedule-updated', handleScheduleUpdate as EventListener)
    }
  }, [blockType, workflowId, blockId, fetchScheduleInfo])

  return {
    scheduleInfo,
    isLoading,
    reactivateSchedule,
    disableSchedule,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-webhook-info.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-block/hooks/use-webhook-info.ts
Signals: React

```typescript
import { useCallback, useEffect, useState } from 'react'
import { createLogger } from '@/lib/logs/console/logger'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'

const logger = createLogger('useWebhookInfo')

/**
 * Return type for the useWebhookInfo hook
 */
export interface UseWebhookInfoReturn {
  /** Whether the webhook is configured with provider and path */
  isWebhookConfigured: boolean
  /** The webhook provider identifier */
  webhookProvider: string | undefined
  /** The webhook path */
  webhookPath: string | undefined
  /** Whether the webhook is disabled */
  isDisabled: boolean
  /** The webhook ID if it exists in the database */
  webhookId: string | undefined
  /** Function to reactivate a disabled webhook */
  reactivateWebhook: (webhookId: string) => Promise<void>
}

/**
 * Custom hook for managing webhook information for a block
 *
 * @param blockId - The ID of the block
 * @param workflowId - The current workflow ID
 * @returns Webhook configuration status and details
 */
export function useWebhookInfo(blockId: string, workflowId: string): UseWebhookInfoReturn {
  const activeWorkflowId = useWorkflowRegistry((state) => state.activeWorkflowId)
  const [webhookStatus, setWebhookStatus] = useState<{
    isDisabled: boolean
    webhookId: string | undefined
  }>({
    isDisabled: false,
    webhookId: undefined,
  })

  const isWebhookConfigured = useSubBlockStore(
    useCallback(
      (state) => {
        const blockValues = state.workflowValues[activeWorkflowId || '']?.[blockId]
        return !!(blockValues?.webhookProvider && blockValues?.webhookPath)
      },
      [activeWorkflowId, blockId]
    )
  )

  const webhookProvider = useSubBlockStore(
    useCallback(
      (state) => {
        if (!activeWorkflowId) return undefined
        return state.workflowValues[activeWorkflowId]?.[blockId]?.webhookProvider?.value as
          | string
          | undefined
      },
      [activeWorkflowId, blockId]
    )
  )

  const webhookPath = useSubBlockStore(
    useCallback(
      (state) => {
        if (!activeWorkflowId) return undefined
        return state.workflowValues[activeWorkflowId]?.[blockId]?.webhookPath as string | undefined
      },
      [activeWorkflowId, blockId]
    )
  )

  const fetchWebhookStatus = useCallback(async () => {
    if (!workflowId || !blockId || !isWebhookConfigured) {
      setWebhookStatus({ isDisabled: false, webhookId: undefined })
      return
    }

    try {
      const params = new URLSearchParams({
        workflowId,
        blockId,
      })

      const response = await fetch(`/api/webhooks?${params}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      })

      if (!response.ok) {
        setWebhookStatus({ isDisabled: false, webhookId: undefined })
        return
      }

      const data = await response.json()
      const webhooks = data.webhooks || []

      if (webhooks.length > 0) {
        const webhook = webhooks[0].webhook
        setWebhookStatus({
          isDisabled: !webhook.isActive,
          webhookId: webhook.id,
        })
      } else {
        setWebhookStatus({ isDisabled: false, webhookId: undefined })
      }
    } catch (error) {
      logger.error('Error fetching webhook status:', error)
      setWebhookStatus({ isDisabled: false, webhookId: undefined })
    }
  }, [workflowId, blockId, isWebhookConfigured])

  useEffect(() => {
    fetchWebhookStatus()
  }, [fetchWebhookStatus])

  const reactivateWebhook = useCallback(
    async (webhookId: string) => {
      try {
        const response = await fetch(`/api/webhooks/${webhookId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isActive: true,
            failedCount: 0,
          }),
        })

        if (response.ok) {
          await fetchWebhookStatus()
        } else {
          logger.error('Failed to reactivate webhook')
        }
      } catch (error) {
        logger.error('Error reactivating webhook:', error)
      }
    },
    [fetchWebhookStatus]
  )

  return {
    isWebhookConfigured,
    webhookProvider,
    webhookPath,
    isDisabled: webhookStatus.isDisabled,
    webhookId: webhookStatus.webhookId,
    reactivateWebhook,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: workflow-edge.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-edge/workflow-edge.tsx
Signals: React

```typescript
import { memo, useMemo } from 'react'
import { X } from 'lucide-react'
import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getSmoothStepPath } from 'reactflow'
import { useShallow } from 'zustand/react/shallow'
import type { EdgeDiffStatus } from '@/lib/workflows/diff/types'
import { useExecutionStore } from '@/stores/execution/store'
import { useWorkflowDiffStore } from '@/stores/workflow-diff'

interface WorkflowEdgeProps extends EdgeProps {
  sourceHandle?: string | null
  targetHandle?: string | null
}

const WorkflowEdgeComponent = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style,
  source,
  target,
  sourceHandle,
  targetHandle,
}: WorkflowEdgeProps) => {
  const isHorizontal = sourcePosition === 'right' || sourcePosition === 'left'

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
    offset: isHorizontal ? 30 : 20,
  })

  const isSelected = data?.isSelected ?? false
  const isInsideLoop = data?.isInsideLoop ?? false
  const parentLoopId = data?.parentLoopId

  // Combined store subscription to reduce subscription overhead
  const { diffAnalysis, isShowingDiff, isDiffReady } = useWorkflowDiffStore(
    useShallow((state) => ({
      diffAnalysis: state.diffAnalysis,
      isShowingDiff: state.isShowingDiff,
      isDiffReady: state.isDiffReady,
    }))
  )
  const lastRunEdges = useExecutionStore((state) => state.lastRunEdges)

  const dataSourceHandle = (data as { sourceHandle?: string } | undefined)?.sourceHandle
  const isErrorEdge = (sourceHandle ?? dataSourceHandle) === 'error'
  const edgeRunStatus = lastRunEdges.get(id)

  // Memoize diff status calculation to avoid recomputing on every render
  const edgeDiffStatus = useMemo((): EdgeDiffStatus => {
    if (data?.isDeleted) return 'deleted'
    if (!diffAnalysis?.edge_diff || !isDiffReady) return null

    const actualSourceHandle = sourceHandle || 'source'
    const actualTargetHandle = targetHandle || 'target'
    const edgeIdentifier = `${source}-${actualSourceHandle}-${target}-${actualTargetHandle}`

    if (isShowingDiff) {
      if (diffAnalysis.edge_diff.new_edges.includes(edgeIdentifier)) return 'new'
      if (diffAnalysis.edge_diff.unchanged_edges.includes(edgeIdentifier)) return 'unchanged'
    } else {
      if (diffAnalysis.edge_diff.deleted_edges.includes(edgeIdentifier)) return 'deleted'
    }
    return null
  }, [
    data?.isDeleted,
    diffAnalysis,
    isDiffReady,
    isShowingDiff,
    source,
    target,
    sourceHandle,
    targetHandle,
  ])

  // Memoize edge style to prevent object recreation
  const edgeStyle = useMemo(() => {
    let color = 'var(--surface-12)'
    if (edgeDiffStatus === 'deleted') color = 'var(--text-error)'
    else if (isErrorEdge) color = 'var(--text-error)'
    else if (edgeDiffStatus === 'new') color = 'var(--brand-tertiary)'
    else if (edgeRunStatus === 'success') color = 'var(--border-success)'
    else if (edgeRunStatus === 'error') color = 'var(--text-error)'

    return {
      ...(style ?? {}),
      strokeWidth: edgeDiffStatus ? 3 : isSelected ? 2.5 : 2,
      stroke: color,
      strokeDasharray: edgeDiffStatus === 'deleted' ? '10,5' : undefined,
      opacity: edgeDiffStatus === 'deleted' ? 0.7 : isSelected ? 0.5 : 1,
    }
  }, [style, edgeDiffStatus, isSelected, isErrorEdge, edgeRunStatus])

  return (
    <>
      <BaseEdge
        path={edgePath}
        data-testid='workflow-edge'
        style={edgeStyle}
        interactionWidth={30}
        data-edge-id={id}
        data-parent-loop-id={parentLoopId}
        data-is-selected={isSelected ? 'true' : 'false'}
        data-is-inside-loop={isInsideLoop ? 'true' : 'false'}
      />
      {/* Animate dash offset for edge movement effect */}
      <animate
        attributeName='stroke-dashoffset'
        from={edgeDiffStatus === 'deleted' ? '15' : '10'}
        to='0'
        dur={edgeDiffStatus === 'deleted' ? '2s' : '1s'}
        repeatCount='indefinite'
      />

      {isSelected && (
        <EdgeLabelRenderer>
          <div
            className='nodrag nopan group flex h-[22px] w-[22px] cursor-pointer items-center justify-center transition-colors'
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              zIndex: 100,
            }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()

              if (data?.onDelete) {
                // Pass this specific edge's ID to the delete function
                data.onDelete(id)
              }
            }}
          >
            <X className='h-4 w-4 text-[var(--text-error)] transition-colors group-hover:text-[var(--text-error)]/80' />
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

export const WorkflowEdge = memo(WorkflowEdgeComponent)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/hooks/index.ts

```typescript
export { useAutoLayout } from './use-auto-layout'
export { BLOCK_DIMENSIONS, useBlockDimensions } from './use-block-dimensions'
export { useBlockVisual } from './use-block-visual'
export { type CurrentWorkflow, useCurrentWorkflow } from './use-current-workflow'
export { useFloatBoundarySync, useFloatDrag, useFloatResize } from './use-float'
export { useNodeUtilities } from './use-node-utilities'
export { useScrollManagement } from './use-scroll-management'
export { useWorkflowExecution } from './use-workflow-execution'
```

--------------------------------------------------------------------------------

````
