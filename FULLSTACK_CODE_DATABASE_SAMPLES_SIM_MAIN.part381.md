---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 381
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 381 of 933)

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

---[FILE: usage-indicator.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/usage-indicator/usage-indicator.tsx
Signals: React

```typescript
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/emcn'
import { Skeleton } from '@/components/ui'
import { isUsageAtLimit, USAGE_PILL_COLORS } from '@/lib/billing/client/usage-visualization'
import {
  canUpgrade,
  getBillingStatus,
  getSubscriptionStatus,
  getUsage,
} from '@/lib/billing/client/utils'
import { createLogger } from '@/lib/logs/console/logger'
import { useSocket } from '@/app/workspace/providers/socket-provider'
import { subscriptionKeys, useSubscriptionData } from '@/hooks/queries/subscription'
import { MIN_SIDEBAR_WIDTH, useSidebarStore } from '@/stores/sidebar/store'

const logger = createLogger('UsageIndicator')

/**
 * Minimum number of pills to display (at minimum sidebar width).
 */
const MIN_PILL_COUNT = 6

/**
 * Maximum number of pills to display.
 */
const MAX_PILL_COUNT = 8

/**
 * Width increase (in pixels) required to add one additional pill.
 */
const WIDTH_PER_PILL = 50

/**
 * Animation tick interval in milliseconds.
 * Controls the update frequency of the wave animation.
 */
const PILL_ANIMATION_TICK_MS = 30

/**
 * Speed of the wave animation in pills per second.
 */
const PILLS_PER_SECOND = 1.8

/**
 * Distance (in pill units) the wave advances per animation tick.
 * Derived from {@link PILLS_PER_SECOND} and {@link PILL_ANIMATION_TICK_MS}.
 */
const PILL_STEP_PER_TICK = (PILLS_PER_SECOND * PILL_ANIMATION_TICK_MS) / 1000

/**
 * Human-readable plan name labels.
 */
const PLAN_NAMES = {
  enterprise: 'Enterprise',
  team: 'Team',
  pro: 'Pro',
  free: 'Free',
} as const

/**
 * Props for the {@link UsageIndicator} component.
 */
interface UsageIndicatorProps {
  /**
   * Optional click handler. If provided, overrides the default behavior
   * of opening the settings modal to the subscription tab.
   */
  onClick?: () => void
}

/**
 * Displays a visual usage indicator showing current subscription usage
 * with an animated pill bar that responds to hover interactions.
 *
 * The component shows:
 * - Current plan type (Free, Pro, Team, Enterprise)
 * - Current usage vs. limit (e.g., $7.00 / $10.00)
 * - Visual pill bar representing usage percentage
 * - Upgrade button for free plans or when blocked
 *
 * @param props - Component props
 * @returns A usage indicator component with responsive pill visualization
 */
export function UsageIndicator({ onClick }: UsageIndicatorProps) {
  const { data: subscriptionData, isLoading } = useSubscriptionData()
  const sidebarWidth = useSidebarStore((state) => state.sidebarWidth)
  const { onOperationConfirmed } = useSocket()
  const queryClient = useQueryClient()

  // Listen for completed operations to update usage
  useEffect(() => {
    const handleOperationConfirmed = () => {
      // Small delay to ensure backend has updated usage
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: subscriptionKeys.user() })
      }, 1000)
    }

    onOperationConfirmed(handleOperationConfirmed)
  }, [onOperationConfirmed, queryClient])

  /**
   * Calculate pill count based on sidebar width (6-8 pills dynamically).
   * This provides responsive feedback as the sidebar width changes.
   */
  const pillCount = useMemo(() => {
    const widthDelta = sidebarWidth - MIN_SIDEBAR_WIDTH
    const additionalPills = Math.floor(widthDelta / WIDTH_PER_PILL)
    const calculatedCount = MIN_PILL_COUNT + additionalPills
    return Math.max(MIN_PILL_COUNT, Math.min(MAX_PILL_COUNT, calculatedCount))
  }, [sidebarWidth])

  const usage = getUsage(subscriptionData?.data)
  const subscription = getSubscriptionStatus(subscriptionData?.data)

  const progressPercentage = Math.min(usage.percentUsed, 100)

  const planType = subscription.isEnterprise
    ? 'enterprise'
    : subscription.isTeam
      ? 'team'
      : subscription.isPro
        ? 'pro'
        : 'free'

  const billingStatus = getBillingStatus(subscriptionData?.data)
  const isBlocked = billingStatus === 'blocked'
  const blockedReason = subscriptionData?.data?.billingBlockedReason as
    | 'payment_failed'
    | 'dispute'
    | null
  const isDispute = isBlocked && blockedReason === 'dispute'
  const showUpgradeButton =
    (planType === 'free' || isBlocked || progressPercentage >= 80) && planType !== 'enterprise'

  /**
   * Calculate which pills should be filled based on usage percentage.
   * Uses a percentage-based heuristic with dynamic pill count (6-8).
   * The warning/limit (red) state is derived from shared usage visualization utilities
   * so it is consistent with other parts of the app (e.g. UsageHeader).
   */
  const filledPillsCount = Math.ceil((progressPercentage / 100) * pillCount)
  const isAtLimit = isUsageAtLimit(progressPercentage)

  const [isHovered, setIsHovered] = useState(false)
  const [wavePosition, setWavePosition] = useState<number | null>(null)

  const startAnimationIndex = pillCount === 0 ? 0 : Math.min(filledPillsCount, pillCount - 1)

  useEffect(() => {
    // Animation enabled for all plans on hover
    if (!isHovered || pillCount <= 0) {
      setWavePosition(null)
      return
    }

    /**
     * Maximum distance (in pill units) the wave should travel from
     * {@link startAnimationIndex} to the end of the row. The wave stops
     * once it reaches the final pill and does not wrap.
     */
    const maxDistance = pillCount <= 0 ? 0 : Math.max(0, pillCount - startAnimationIndex)

    setWavePosition(0)

    const interval = window.setInterval(() => {
      setWavePosition((prev) => {
        const current = prev ?? 0

        if (current >= maxDistance) {
          return current
        }

        const next = current + PILL_STEP_PER_TICK
        return next >= maxDistance ? maxDistance : next
      })
    }, PILL_ANIMATION_TICK_MS)

    return () => {
      window.clearInterval(interval)
    }
  }, [isHovered, pillCount, startAnimationIndex])

  if (isLoading) {
    return (
      <div className='flex flex-shrink-0 flex-col gap-[8px] border-t pt-[12px] pr-[13.5px] pb-[10px] pl-[12px] dark:border-[var(--border)]'>
        {/* Top row skeleton */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-[6px]'>
            <Skeleton className='h-[14px] w-[40px] rounded-[4px]' />
            <Skeleton className='h-[14px] w-[70px] rounded-[4px]' />
          </div>
          <Skeleton className='h-[12px] w-[50px] rounded-[4px]' />
        </div>

        {/* Pills skeleton */}
        <div className='flex items-center gap-[4px]'>
          {Array.from({ length: pillCount }).map((_, i) => (
            <Skeleton key={i} className='h-[6px] flex-1 rounded-[2px]' />
          ))}
        </div>
      </div>
    )
  }

  const handleClick = async () => {
    try {
      if (onClick) {
        onClick()
        return
      }

      const blocked = getBillingStatus(subscriptionData?.data) === 'blocked'
      const reason = subscriptionData?.data?.billingBlockedReason as
        | 'payment_failed'
        | 'dispute'
        | null
      const canUpg = canUpgrade(subscriptionData?.data)

      // For disputes, open help modal instead of billing portal
      if (blocked && reason === 'dispute') {
        window.dispatchEvent(new CustomEvent('open-help-modal'))
        logger.info('Opened help modal for disputed account')
        return
      }

      // For payment failures, open billing portal
      if (blocked) {
        try {
          const context = subscription.isTeam || subscription.isEnterprise ? 'organization' : 'user'
          const organizationId =
            subscription.isTeam || subscription.isEnterprise
              ? subscriptionData?.data?.organization?.id
              : undefined

          const response = await fetch('/api/billing/portal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ context, organizationId }),
          })

          if (response.ok) {
            const { url } = await response.json()
            window.open(url, '_blank')
            logger.info('Opened billing portal for blocked account', { context, organizationId })
            return
          }
        } catch (portalError) {
          logger.warn('Failed to open billing portal, falling back to settings', {
            error: portalError,
          })
        }
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('open-settings', { detail: { tab: 'subscription' } }))
        logger.info('Opened settings to subscription tab', { blocked, canUpgrade: canUpg })
      }
    } catch (error) {
      logger.error('Failed to handle usage indicator click', { error })
    }
  }

  return (
    <div
      className={`group flex flex-shrink-0 cursor-pointer flex-col gap-[8px] border-t px-[13.5px] pt-[8px] pb-[10px] ${
        isBlocked ? 'border-red-500/50 bg-red-950/20' : ''
      }`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top row */}
      <div className='flex items-center justify-between'>
        <div className='flex min-w-0 flex-1 items-center gap-[6px]'>
          <span className='flex-shrink-0 font-medium text-[#FFFFFF] text-[12px]'>
            {PLAN_NAMES[planType]}
          </span>
          <div className='h-[14px] w-[1.5px] flex-shrink-0 bg-[var(--divider)]' />
          <div className='flex min-w-0 flex-1 items-center gap-[4px]'>
            {isBlocked ? (
              isDispute ? (
                <>
                  <span className='font-medium text-[12px] text-red-400'>Account</span>
                  <span className='font-medium text-[12px] text-red-400'>Frozen</span>
                </>
              ) : (
                <>
                  <span className='font-medium text-[12px] text-red-400'>Payment</span>
                  <span className='font-medium text-[12px] text-red-400'>Required</span>
                </>
              )
            ) : (
              <>
                <span className='font-medium text-[12px] text-[var(--text-tertiary)] tabular-nums'>
                  ${usage.current.toFixed(2)}
                </span>
                <span className='font-medium text-[12px] text-[var(--text-tertiary)]'>/</span>
                <span className='font-medium text-[12px] text-[var(--text-tertiary)] tabular-nums'>
                  ${usage.limit.toFixed(2)}
                </span>
              </>
            )}
          </div>
        </div>
        {showUpgradeButton && (
          <Button
            variant='ghost'
            className={`-mx-1 !h-auto !px-1 !py-0 mt-[-2px] transition-colors duration-100 ${
              isBlocked
                ? '!text-red-400 group-hover:!text-red-300'
                : '!text-[#F473B7] group-hover:!text-[#F789C4]'
            }`}
            onClick={handleClick}
          >
            <span className='font-medium text-[12px]'>
              {isBlocked ? (isDispute ? 'Get Help' : 'Fix Now') : 'Upgrade'}
            </span>
          </Button>
        )}
      </div>

      {/* Pills row */}
      <div className='flex items-center gap-[4px]'>
        {Array.from({ length: pillCount }).map((_, i) => {
          const isFilled = i < filledPillsCount

          const baseColor = isFilled
            ? isBlocked || isAtLimit
              ? USAGE_PILL_COLORS.AT_LIMIT
              : USAGE_PILL_COLORS.FILLED
            : USAGE_PILL_COLORS.UNFILLED

          let backgroundColor = baseColor
          let backgroundImage: string | undefined

          if (isHovered && wavePosition !== null && pillCount > 0) {
            const grayColor = USAGE_PILL_COLORS.UNFILLED
            const activeColor = isAtLimit ? USAGE_PILL_COLORS.AT_LIMIT : USAGE_PILL_COLORS.FILLED

            /**
             * Single-pass wave: travel from {@link startAnimationIndex} to the end
             * of the row without wrapping. Previously highlighted pills remain
             * filled; the wave only affects pills at or after the start index.
             */
            const headIndex = Math.floor(wavePosition)
            const progress = wavePosition - headIndex

            const pillOffsetFromStart = i - startAnimationIndex

            if (pillOffsetFromStart < 0) {
            } else if (pillOffsetFromStart < headIndex) {
              backgroundColor = isFilled ? baseColor : grayColor
              backgroundImage = `linear-gradient(to right, ${activeColor} 0%, ${activeColor} 100%)`
            } else if (pillOffsetFromStart === headIndex) {
              const fillPercent = Math.max(0, Math.min(1, progress)) * 100
              backgroundColor = isFilled ? baseColor : grayColor
              backgroundImage = `linear-gradient(to right, ${activeColor} 0%, ${activeColor} ${fillPercent}%, ${
                isFilled ? baseColor : grayColor
              } ${fillPercent}%, ${isFilled ? baseColor : grayColor} 100%)`
            } else {
              backgroundColor = isFilled ? baseColor : grayColor
            }
          }

          return (
            <div
              key={i}
              className='h-[6px] flex-1 rounded-[2px]'
              style={{
                backgroundColor,
                backgroundImage,
                transition: isHovered ? 'none' : 'background-color 200ms',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: workflow-list.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/workflow-list/workflow-list.tsx
Signals: React, Next.js

```typescript
'use client'

import { useCallback, useEffect, useMemo } from 'react'
import clsx from 'clsx'
import { useParams, usePathname } from 'next/navigation'
import { FolderItem } from '@/app/workspace/[workspaceId]/w/components/sidebar/components/workflow-list/components/folder-item/folder-item'
import { WorkflowItem } from '@/app/workspace/[workspaceId]/w/components/sidebar/components/workflow-list/components/workflow-item/workflow-item'
import {
  useDragDrop,
  useWorkflowSelection,
} from '@/app/workspace/[workspaceId]/w/components/sidebar/hooks'
import { useImportWorkflow } from '@/app/workspace/[workspaceId]/w/hooks/use-import-workflow'
import { useFolders } from '@/hooks/queries/folders'
import { type FolderTreeNode, useFolderStore } from '@/stores/folders/store'
import type { WorkflowMetadata } from '@/stores/workflows/registry/types'

/**
 * Constants for tree layout and styling
 */
const TREE_SPACING = {
  INDENT_PER_LEVEL: 20,
  VERTICAL_LINE_LEFT_OFFSET: 4,
  ITEM_GAP: 4,
  ITEM_HEIGHT: 25,
} as const

const TREE_STYLES = {
  LINE_COLOR: 'hsl(var(--muted-foreground) / 0.2)',
} as const

interface WorkflowListProps {
  regularWorkflows: WorkflowMetadata[]
  isLoading?: boolean
  isImporting: boolean
  setIsImporting: (value: boolean) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
}

/**
 * WorkflowList component displays workflows organized by folders with drag-and-drop support.
 * Uses the workflow import hook for handling JSON imports.
 *
 * @param props - Component props
 * @returns Workflow list with folders and drag-drop support
 */
export function WorkflowList({
  regularWorkflows,
  isLoading = false,
  isImporting,
  setIsImporting,
  fileInputRef,
  scrollContainerRef,
}: WorkflowListProps) {
  const pathname = usePathname()
  const params = useParams()
  const workspaceId = params.workspaceId as string
  const workflowId = params.workflowId as string

  const { isLoading: foldersLoading } = useFolders(workspaceId)

  const { getFolderTree, expandedFolders, getFolderPath, setExpanded } = useFolderStore()

  const {
    dropTargetId,
    isDragging,
    setScrollContainer,
    createFolderDragHandlers,
    createItemDragHandlers,
    createRootDragHandlers,
    createFolderHeaderHoverHandlers,
  } = useDragDrop()

  // Workflow import hook
  const { handleFileChange } = useImportWorkflow({ workspaceId })

  // Set scroll container when ref changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      setScrollContainer(scrollContainerRef.current)
    }
  }, [scrollContainerRef, setScrollContainer])

  const folderTree = workspaceId ? getFolderTree(workspaceId) : []

  const activeWorkflowFolderId = useMemo(() => {
    if (!workflowId || isLoading || foldersLoading) return null
    const activeWorkflow = regularWorkflows.find((workflow) => workflow.id === workflowId)
    return activeWorkflow?.folderId || null
  }, [workflowId, regularWorkflows, isLoading, foldersLoading])

  const workflowsByFolder = useMemo(
    () =>
      regularWorkflows.reduce(
        (acc, workflow) => {
          const folderId = workflow.folderId || 'root'
          if (!acc[folderId]) acc[folderId] = []
          acc[folderId].push(workflow)
          return acc
        },
        {} as Record<string, WorkflowMetadata[]>
      ),
    [regularWorkflows]
  )

  /**
   * Build a flat list of all workflow IDs in display order for range selection
   */
  const orderedWorkflowIds = useMemo(() => {
    const ids: string[] = []

    const collectWorkflowIds = (folder: FolderTreeNode) => {
      const workflowsInFolder = workflowsByFolder[folder.id] || []
      for (const workflow of workflowsInFolder) {
        ids.push(workflow.id)
      }
      for (const childFolder of folder.children) {
        collectWorkflowIds(childFolder)
      }
    }

    // Collect from folders first
    for (const folder of folderTree) {
      collectWorkflowIds(folder)
    }

    // Then collect root workflows
    const rootWorkflows = workflowsByFolder.root || []
    for (const workflow of rootWorkflows) {
      ids.push(workflow.id)
    }

    return ids
  }, [folderTree, workflowsByFolder])

  // Workflow selection hook - uses active workflow ID as anchor for range selection
  const { handleWorkflowClick } = useWorkflowSelection({
    workflowIds: orderedWorkflowIds,
    activeWorkflowId: workflowId,
  })

  const isWorkflowActive = useCallback(
    (workflowId: string) => pathname === `/workspace/${workspaceId}/w/${workflowId}`,
    [pathname, workspaceId]
  )

  /**
   * Auto-expand folders and select active workflow.
   */
  useEffect(() => {
    if (!workflowId || isLoading || foldersLoading) return

    // Expand folder path to reveal workflow
    if (activeWorkflowFolderId) {
      const folderPath = getFolderPath(activeWorkflowFolderId)
      folderPath.forEach((folder) => setExpanded(folder.id, true))
    }

    // Select workflow if not already selected
    const { selectedWorkflows, selectOnly } = useFolderStore.getState()
    if (!selectedWorkflows.has(workflowId)) {
      selectOnly(workflowId)
    }
  }, [workflowId, activeWorkflowFolderId, isLoading, foldersLoading, getFolderPath, setExpanded])

  const renderWorkflowItem = useCallback(
    (workflow: WorkflowMetadata, level: number, parentFolderId: string | null = null) => (
      <div key={workflow.id} className='relative' {...createItemDragHandlers(parentFolderId)}>
        <div
          style={{
            paddingLeft: `${level * TREE_SPACING.INDENT_PER_LEVEL}px`,
          }}
        >
          <WorkflowItem
            workflow={workflow}
            active={isWorkflowActive(workflow.id)}
            level={level}
            onWorkflowClick={handleWorkflowClick}
          />
        </div>
      </div>
    ),
    [isWorkflowActive, createItemDragHandlers, handleWorkflowClick]
  )

  /**
   * Calculate the height of the vertical line for folder trees
   *
   * @param workflowCount - Number of workflows in the folder
   * @param folderCount - Number of child folders
   * @returns Height string in pixels
   */
  const calculateVerticalLineHeight = useCallback((workflowCount: number, folderCount: number) => {
    // If there are workflows, line extends only to the bottom of the last workflow
    if (workflowCount > 0) {
      // Account for: all workflows + gaps between workflows (no extra margin)
      const totalHeight =
        workflowCount * TREE_SPACING.ITEM_HEIGHT + (workflowCount - 1) * TREE_SPACING.ITEM_GAP
      return `${totalHeight}px`
    }

    // If no workflows but there are child folders, extend to folders
    if (folderCount > 0) {
      const totalHeight =
        folderCount * TREE_SPACING.ITEM_HEIGHT + (folderCount - 1) * TREE_SPACING.ITEM_GAP
      return `${totalHeight}px`
    }

    return '0px'
  }, [])

  const renderFolderSection = useCallback(
    (
      folder: FolderTreeNode,
      level: number,
      parentFolderId: string | null = null
    ): React.ReactNode => {
      const workflowsInFolder = workflowsByFolder[folder.id] || []
      const isExpanded = expandedFolders.has(folder.id)
      const hasChildren = workflowsInFolder.length > 0 || folder.children.length > 0
      const isDropTarget = dropTargetId === folder.id

      return (
        <div key={folder.id} className='relative' {...createFolderDragHandlers(folder.id)}>
          {/* Drop target highlight overlay - always rendered for stable DOM */}
          <div
            className={clsx(
              'pointer-events-none absolute inset-0 z-10 rounded-[4px] transition-opacity duration-75',
              isDropTarget && isDragging ? 'bg-gray-400/20 opacity-100' : 'opacity-0'
            )}
          />

          <div
            style={{ paddingLeft: `${level * TREE_SPACING.INDENT_PER_LEVEL}px` }}
            {...createItemDragHandlers(folder.id)}
          >
            <FolderItem
              folder={folder}
              level={level}
              hoverHandlers={createFolderHeaderHoverHandlers(folder.id)}
            />
          </div>

          {isExpanded && hasChildren && (
            <div className='relative' {...createItemDragHandlers(folder.id)}>
              {/* Vertical line from folder bottom extending through all children - only shown if folder has workflows */}
              {workflowsInFolder.length > 0 && (
                <div
                  className='pointer-events-none absolute'
                  style={{
                    left: `${level * TREE_SPACING.INDENT_PER_LEVEL + TREE_SPACING.VERTICAL_LINE_LEFT_OFFSET}px`,
                    top: '0px', // Start immediately after folder item
                    width: '1px',
                    height: calculateVerticalLineHeight(
                      workflowsInFolder.length,
                      folder.children.length
                    ),
                    background: TREE_STYLES.LINE_COLOR,
                  }}
                />
              )}

              {workflowsInFolder.length > 0 && (
                <div className='mt-[2px] space-y-[4px]'>
                  {workflowsInFolder.map((workflow: WorkflowMetadata) =>
                    renderWorkflowItem(workflow, level + 1, folder.id)
                  )}
                </div>
              )}

              {folder.children.length > 0 && (
                <div
                  className={clsx('space-y-[4px]', workflowsInFolder.length > 0 ? 'mt-[2px]' : '')}
                >
                  {folder.children.map((childFolder) => (
                    <div key={childFolder.id} className='relative'>
                      {renderFolderSection(childFolder, level + 1, folder.id)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )
    },
    [
      workflowsByFolder,
      expandedFolders,
      dropTargetId,
      isDragging,
      createFolderDragHandlers,
      createItemDragHandlers,
      createFolderHeaderHoverHandlers,
      calculateVerticalLineHeight,
      renderWorkflowItem,
    ]
  )

  const handleRootDragEvents = createRootDragHandlers()
  const rootWorkflows = workflowsByFolder.root || []
  const isRootDropTarget = dropTargetId === 'root'
  const hasRootWorkflows = rootWorkflows.length > 0
  const hasFolders = folderTree.length > 0

  /**
   * Handle click on empty space to revert to active workflow selection
   */
  const handleContainerClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Only handle clicks directly on the container (empty space)
      if (e.target !== e.currentTarget) return

      const { selectOnly, clearSelection } = useFolderStore.getState()
      workflowId ? selectOnly(workflowId) : clearSelection()
    },
    [workflowId]
  )

  return (
    <div className='flex min-h-full flex-col pb-[8px]' onClick={handleContainerClick}>
      {/* Folders Section */}
      {hasFolders && (
        <div className='mb-[4px] space-y-[4px]'>
          {folderTree.map((folder) => renderFolderSection(folder, 0))}
        </div>
      )}

      {/* Root Workflows Section - Expands to fill remaining space */}
      <div
        className={clsx('relative flex-1', !hasRootWorkflows && 'min-h-[25px]')}
        {...handleRootDragEvents}
      >
        {/* Root drop target highlight overlay - always rendered for stable DOM */}
        <div
          className={clsx(
            'pointer-events-none absolute inset-0 z-10 rounded-[4px] transition-opacity duration-75',
            isRootDropTarget && isDragging ? 'bg-gray-400/20 opacity-100' : 'opacity-0'
          )}
        />

        <div className='space-y-[4px]'>
          {rootWorkflows.map((workflow: WorkflowMetadata) => (
            <WorkflowItem
              key={workflow.id}
              workflow={workflow}
              active={isWorkflowActive(workflow.id)}
              level={0}
              onWorkflowClick={handleWorkflowClick}
            />
          ))}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type='file'
        accept='.json,.zip'
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/workflow-list/components/index.ts

```typescript
export { ContextMenu } from './context-menu/context-menu'
export { FolderItem } from './folder-item/folder-item'
export { WorkflowItem } from './workflow-item/workflow-item'
```

--------------------------------------------------------------------------------

---[FILE: context-menu.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/workflow-list/components/context-menu/context-menu.tsx

```typescript
'use client'

import { Popover, PopoverAnchor, PopoverContent, PopoverItem } from '@/components/emcn'

interface ContextMenuProps {
  /**
   * Whether the context menu is open
   */
  isOpen: boolean
  /**
   * Position of the context menu
   */
  position: { x: number; y: number }
  /**
   * Ref for the menu element
   */
  menuRef: React.RefObject<HTMLDivElement | null>
  /**
   * Callback when menu should close
   */
  onClose: () => void
  /**
   * Callback when open in new tab is clicked
   */
  onOpenInNewTab?: () => void
  /**
   * Callback when rename is clicked
   */
  onRename?: () => void
  /**
   * Callback when create workflow is clicked (for folders)
   */
  onCreate?: () => void
  /**
   * Callback when create folder is clicked (for folders)
   */
  onCreateFolder?: () => void
  /**
   * Callback when duplicate is clicked
   */
  onDuplicate?: () => void
  /**
   * Callback when export is clicked
   */
  onExport?: () => void
  /**
   * Callback when delete is clicked
   */
  onDelete: () => void
  /**
   * Whether to show the open in new tab option (default: false)
   * Set to true for items that can be opened in a new tab
   */
  showOpenInNewTab?: boolean
  /**
   * Whether to show the rename option (default: true)
   * Set to false when multiple items are selected
   */
  showRename?: boolean
  /**
   * Whether to show the create workflow option (default: false)
   * Set to true for folders to create workflows inside
   */
  showCreate?: boolean
  /**
   * Whether to show the create folder option (default: false)
   * Set to true for folders to create sub-folders inside
   */
  showCreateFolder?: boolean
  /**
   * Whether to show the duplicate option (default: true)
   * Set to false for items that cannot be duplicated
   */
  showDuplicate?: boolean
  /**
   * Whether to show the export option (default: false)
   * Set to true for items that can be exported (like workspaces)
   */
  showExport?: boolean
  /**
   * Whether the export option is disabled (default: false)
   * Set to true when user lacks permissions
   */
  disableExport?: boolean
  /**
   * Whether the rename option is disabled (default: false)
   * Set to true when user lacks permissions
   */
  disableRename?: boolean
  /**
   * Whether the duplicate option is disabled (default: false)
   * Set to true when user lacks permissions
   */
  disableDuplicate?: boolean
  /**
   * Whether the delete option is disabled (default: false)
   * Set to true when user lacks permissions
   */
  disableDelete?: boolean
  /**
   * Whether the create workflow option is disabled (default: false)
   * Set to true when creation is in progress or user lacks permissions
   */
  disableCreate?: boolean
  /**
   * Whether the create folder option is disabled (default: false)
   * Set to true when creation is in progress or user lacks permissions
   */
  disableCreateFolder?: boolean
}

/**
 * Context menu component for workflow, folder, and workspace items.
 * Displays context-appropriate options (rename, duplicate, export, delete) in a popover at the right-click position.
 *
 * @param props - Component props
 * @returns Context menu popover
 */
export function ContextMenu({
  isOpen,
  position,
  menuRef,
  onClose,
  onOpenInNewTab,
  onRename,
  onCreate,
  onCreateFolder,
  onDuplicate,
  onExport,
  onDelete,
  showOpenInNewTab = false,
  showRename = true,
  showCreate = false,
  showCreateFolder = false,
  showDuplicate = true,
  showExport = false,
  disableExport = false,
  disableRename = false,
  disableDuplicate = false,
  disableDelete = false,
  disableCreate = false,
  disableCreateFolder = false,
}: ContextMenuProps) {
  return (
    <Popover open={isOpen} onOpenChange={onClose} variant='primary'>
      <PopoverAnchor
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '1px',
          height: '1px',
        }}
      />
      <PopoverContent ref={menuRef} align='start' side='bottom' sideOffset={4}>
        {showOpenInNewTab && onOpenInNewTab && (
          <PopoverItem
            onClick={() => {
              onOpenInNewTab()
              onClose()
            }}
          >
            Open in new tab
          </PopoverItem>
        )}
        {showRename && onRename && (
          <PopoverItem
            disabled={disableRename}
            onClick={() => {
              onRename()
              onClose()
            }}
          >
            Rename
          </PopoverItem>
        )}
        {showCreate && onCreate && (
          <PopoverItem
            disabled={disableCreate}
            onClick={() => {
              onCreate()
              onClose()
            }}
          >
            Create workflow
          </PopoverItem>
        )}
        {showCreateFolder && onCreateFolder && (
          <PopoverItem
            disabled={disableCreateFolder}
            onClick={() => {
              onCreateFolder()
              onClose()
            }}
          >
            Create folder
          </PopoverItem>
        )}
        {showDuplicate && onDuplicate && (
          <PopoverItem
            disabled={disableDuplicate}
            onClick={() => {
              onDuplicate()
              onClose()
            }}
          >
            Duplicate
          </PopoverItem>
        )}
        {showExport && onExport && (
          <PopoverItem
            disabled={disableExport}
            onClick={() => {
              onExport()
              onClose()
            }}
          >
            Export
          </PopoverItem>
        )}
        <PopoverItem
          disabled={disableDelete}
          onClick={() => {
            onDelete()
            onClose()
          }}
        >
          Delete
        </PopoverItem>
      </PopoverContent>
    </Popover>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: delete-modal.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/workflow-list/components/delete-modal/delete-modal.tsx

```typescript
'use client'

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/emcn'

interface DeleteModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean
  /**
   * Callback when modal should close
   */
  onClose: () => void
  /**
   * Callback when delete is confirmed
   */
  onConfirm: () => void
  /**
   * Whether the delete operation is in progress
   */
  isDeleting: boolean
  /**
   * Type of item being deleted
   */
  itemType: 'workflow' | 'folder' | 'workspace'
  /**
   * Name(s) of the item(s) being deleted (optional, for display)
   * Can be a single name or an array of names for multiple items
   */
  itemName?: string | string[]
}

/**
 * Reusable delete confirmation modal for workflow, folder, and workspace items.
 * Displays a warning message and confirmation buttons.
 *
 * @param props - Component props
 * @returns Delete confirmation modal
 */
export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  itemType,
  itemName,
}: DeleteModalProps) {
  const isMultiple = Array.isArray(itemName) && itemName.length > 1
  const isSingle = !isMultiple

  const displayNames = Array.isArray(itemName) ? itemName : itemName ? [itemName] : []

  let title = ''
  if (itemType === 'workflow') {
    title = isMultiple ? 'Delete Workflows' : 'Delete Workflow'
  } else if (itemType === 'folder') {
    title = 'Delete Folder'
  } else {
    title = 'Delete Workspace'
  }

  const renderDescription = () => {
    if (itemType === 'workflow') {
      if (isMultiple) {
        return (
          <>
            Are you sure you want to delete{' '}
            <span className='font-medium text-[var(--text-primary)]'>
              {displayNames.join(', ')}
            </span>
            ? This will permanently remove all associated blocks, executions, and configuration.
          </>
        )
      }
      if (isSingle && displayNames.length > 0) {
        return (
          <>
            Are you sure you want to delete{' '}
            <span className='font-medium text-[var(--text-primary)]'>{displayNames[0]}</span>? This
            will permanently remove all associated blocks, executions, and configuration.
          </>
        )
      }
      return 'Are you sure you want to delete this workflow? This will permanently remove all associated blocks, executions, and configuration.'
    }

    if (itemType === 'folder') {
      if (isSingle && displayNames.length > 0) {
        return (
          <>
            Are you sure you want to delete{' '}
            <span className='font-medium text-[var(--text-primary)]'>{displayNames[0]}</span>? This
            will permanently remove all associated workflows, logs, and knowledge bases.
          </>
        )
      }
      return 'Are you sure you want to delete this folder? This will permanently remove all associated workflows, logs, and knowledge bases.'
    }

    return 'Are you sure you want to delete this workspace? This will permanently remove all associated workflows, folders, logs, and knowledge bases.'
  }

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className='w-[400px]'>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <p className='text-[12px] text-[var(--text-tertiary)]'>
            {renderDescription()}{' '}
            <span className='text-[var(--text-error)]'>This action cannot be undone.</span>
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant='active' onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant='primary'
            onClick={onConfirm}
            disabled={isDeleting}
            className='!bg-[var(--text-error)] !text-white hover:!bg-[var(--text-error)]/90'
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
```

--------------------------------------------------------------------------------

````
