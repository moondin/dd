---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 432
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 432 of 933)

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

---[FILE: use-panel-resize.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/hooks/use-panel-resize.ts
Signals: React

```typescript
import { useCallback, useEffect, useState } from 'react'
import { usePanelStore } from '@/stores/panel/store'

/**
 * Constants for panel sizing
 */
const MIN_WIDTH = 244
const MAX_WIDTH_PERCENTAGE = 0.4 // 40% of viewport width

/**
 * Custom hook to handle panel resize functionality.
 * Manages mouse events for resizing and enforces min/max width constraints.
 * Maximum width is capped at 40% of the viewport width for optimal layout.
 *
 * @returns Resize state and handlers
 */
export function usePanelResize() {
  const { setPanelWidth } = usePanelStore()
  const [isResizing, setIsResizing] = useState(false)

  /**
   * Handles mouse down on resize handle
   */
  const handleMouseDown = useCallback(() => {
    setIsResizing(true)
  }, [])

  /**
   * Setup resize event listeners and body styles when resizing
   * Cleanup is handled automatically by the effect's return function
   */
  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate width from the right edge of the viewport
      const newWidth = window.innerWidth - e.clientX
      const maxWidth = window.innerWidth * MAX_WIDTH_PERCENTAGE

      if (newWidth >= MIN_WIDTH && newWidth <= maxWidth) {
        setPanelWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, setPanelWidth])

  return {
    isResizing,
    handleMouseDown,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-usage-limits.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/hooks/use-usage-limits.ts

```typescript
import { useSubscriptionData } from '@/hooks/queries/subscription'

/**
 * Simplified hook that uses React Query for usage limits.
 * Provides usage exceeded status from existing subscription data.
 */

export function useUsageLimits(options?: {
  context?: 'user' | 'organization'
  organizationId?: string
  autoRefresh?: boolean
}) {
  // For now, we only support user context via React Query
  // Organization context should use useOrganizationBilling directly
  const { data: subscriptionData, isLoading } = useSubscriptionData()

  const usageExceeded = subscriptionData?.data?.usage?.isExceeded || false

  return {
    usageExceeded,
    isLoading,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: skeleton-loading.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/skeleton-loading/skeleton-loading.tsx

```typescript
'use client'

import { Bug, Copy, Layers, Play, Rocket, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const SkeletonControlBar = () => {
  return (
    <div className='fixed top-4 right-4 z-20 flex items-center gap-1'>
      {/* Delete Button */}
      <Button
        variant='outline'
        className='h-12 w-12 cursor-not-allowed rounded-[11px] border-[hsl(var(--card-border))] bg-[hsl(var(--card-background))] text-[hsl(var(--card-text))] opacity-50 shadow-xs hover:border-[hsl(var(--card-border))] hover:bg-[hsl(var(--card-background))]'
        disabled
      >
        <Trash2 className='h-5 w-5' />
      </Button>

      {/* Duplicate Button */}
      <Button
        variant='outline'
        className='h-12 w-12 cursor-not-allowed rounded-[11px] border-[hsl(var(--card-border))] bg-[hsl(var(--card-background))] text-[hsl(var(--card-text))] opacity-50 shadow-xs hover:border-[hsl(var(--card-border))] hover:bg-[hsl(var(--card-background))] hover:bg-gray-100'
        disabled
      >
        <Copy className='h-5 w-5' />
      </Button>

      {/* Auto Layout Button */}
      <Button
        variant='outline'
        className='h-12 w-12 cursor-not-allowed rounded-[11px] border-[hsl(var(--card-border))] bg-[hsl(var(--card-background))] text-[hsl(var(--card-text))] opacity-50 shadow-xs hover:border-[hsl(var(--card-border))] hover:bg-[hsl(var(--card-background))] hover:bg-gray-100'
        disabled
      >
        <Layers className='h-5 w-5' />
      </Button>

      {/* Debug Mode Button */}
      <Button
        variant='outline'
        className='h-12 w-12 cursor-not-allowed rounded-[11px] border-[hsl(var(--card-border))] bg-[hsl(var(--card-background))] text-[hsl(var(--card-text))] opacity-50 shadow-xs hover:border-[hsl(var(--card-border))] hover:bg-[hsl(var(--card-background))] hover:bg-gray-100'
        disabled
      >
        <Bug className='h-5 w-5' />
      </Button>

      {/* Deploy Button */}
      <Button
        variant='outline'
        className='h-12 w-12 cursor-not-allowed rounded-[11px] border-[hsl(var(--card-border))] bg-[hsl(var(--card-background))] text-[hsl(var(--card-text))] opacity-50 shadow-xs hover:border-[hsl(var(--card-border))] hover:bg-[hsl(var(--card-background))] hover:bg-gray-100'
        disabled
      >
        <Rocket className='h-5 w-5' />
      </Button>

      {/* Run Button */}
      <Button
        className='h-12 cursor-not-allowed gap-2 rounded-[11px] bg-[var(--brand-primary-hex)] px-4 py-2 font-medium text-white shadow-[0_0_0_0_var(--brand-primary-hex)] transition-all duration-200 hover:bg-[var(--brand-primary-hover-hex)] hover:shadow-[0_0_0_4px_rgba(127,47,255,0.15)] disabled:opacity-50 disabled:hover:bg-[var(--brand-primary-hex)] disabled:hover:shadow-none'
        disabled
      >
        <Play className='h-3.5 w-3.5 fill-current stroke-current' />
      </Button>
    </div>
  )
}

const SkeletonPanelComponent = () => {
  return (
    <div className='fixed top-0 right-0 z-10'>
      {/* Panel skeleton */}
      <div className='h-96 w-80 space-y-4 rounded-bl-lg border-b border-l bg-background p-4'>
        {/* Tab headers skeleton */}
        <div className='flex gap-2 border-b pb-2'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-6 w-16' />
          ))}
        </div>

        {/* Content skeleton */}
        <div className='space-y-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-4' style={{ width: `${Math.random() * 40 + 60}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

const SkeletonNodes = () => {
  return [
    // Starter node skeleton
    {
      id: 'skeleton-starter',
      type: 'workflowBlock',
      position: { x: 100, y: 100 },
      data: {
        type: 'skeleton',
        config: { name: '', description: '', bgColor: '#9CA3AF' },
        name: '',
        isActive: false,
        isPending: false,
        isSkeleton: true,
      },
      dragHandle: '.workflow-drag-handle',
    },
    // Additional skeleton nodes
    {
      id: 'skeleton-node-1',
      type: 'workflowBlock',
      position: { x: 500, y: 100 },
      data: {
        type: 'skeleton',
        config: { name: '', description: '', bgColor: '#9CA3AF' },
        name: '',
        isActive: false,
        isPending: false,
        isSkeleton: true,
      },
      dragHandle: '.workflow-drag-handle',
    },
    {
      id: 'skeleton-node-2',
      type: 'workflowBlock',
      position: { x: 300, y: 300 },
      data: {
        type: 'skeleton',
        config: { name: '', description: '', bgColor: '#9CA3AF' },
        name: '',
        isActive: false,
        isPending: false,
        isSkeleton: true,
      },
      dragHandle: '.workflow-drag-handle',
    },
  ]
}

interface SkeletonLoadingProps {
  showSkeleton: boolean
  isSidebarCollapsed: boolean
  children: React.ReactNode
}

export function SkeletonLoading({
  showSkeleton,
  isSidebarCollapsed,
  children,
}: SkeletonLoadingProps) {
  return (
    <div className='flex h-full w-full flex-1 flex-col overflow-hidden'>
      {/* Skeleton Control Bar */}
      <div
        className={`transition-opacity duration-500 ${showSkeleton ? 'opacity-100' : 'pointer-events-none absolute opacity-0'}`}
        style={{ zIndex: showSkeleton ? 10 : -1 }}
      >
        <SkeletonControlBar />
      </div>

      {/* Real Control Bar */}
      <div
        className={`transition-opacity duration-500 ${showSkeleton ? 'pointer-events-none absolute opacity-0' : 'opacity-100'}`}
        style={{ zIndex: showSkeleton ? -1 : 10 }}
      >
        {children}
      </div>

      {/* Real content will be rendered by children - sidebar will show its own loading state */}
    </div>
  )
}

export function SkeletonPanelWrapper({ showSkeleton }: { showSkeleton: boolean }) {
  return (
    <div
      className={`transition-opacity duration-500 ${showSkeleton ? 'opacity-100' : 'pointer-events-none absolute opacity-0'}`}
      style={{ zIndex: showSkeleton ? 10 : -1 }}
    >
      <SkeletonPanelComponent />
    </div>
  )
}

export { SkeletonNodes, SkeletonPanelComponent }
```

--------------------------------------------------------------------------------

---[FILE: subflow-node.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/subflows/subflow-node.tsx
Signals: React

```typescript
import { memo, useMemo, useRef } from 'react'
import { RepeatIcon, SplitIcon } from 'lucide-react'
import { Handle, type NodeProps, Position, useReactFlow } from 'reactflow'
import { Button, Trash } from '@/components/emcn'
import { cn } from '@/lib/core/utils/cn'
import { HANDLE_POSITIONS } from '@/lib/workflows/blocks/block-dimensions'
import { type DiffStatus, hasDiffStatus } from '@/lib/workflows/diff/types'
import { useCurrentWorkflow } from '@/app/workspace/[workspaceId]/w/[workflowId]/hooks'
import { useCollaborativeWorkflow } from '@/hooks/use-collaborative-workflow'
import { usePanelEditorStore } from '@/stores/panel/editor/store'

/**
 * Global styles for subflow nodes (loop and parallel containers).
 * Includes animations for drag-over states and hover effects.
 *
 * @returns Style component with global CSS
 */
const SubflowNodeStyles: React.FC = () => {
  return (
    <style jsx global>{`
      /* Z-index management for subflow nodes */
      .workflow-container .react-flow__node-subflowNode {
        z-index: -1 !important;
      }

      /* Drag-over states */
      .loop-node-drag-over,
      .parallel-node-drag-over {
        box-shadow: 0 0 0 1.75px var(--brand-secondary) !important;
        border-radius: 8px !important;
      }

      /* Handle z-index for nested nodes */
      .react-flow__node[data-parent-node-id] .react-flow__handle {
        z-index: 30;
      }
    `}</style>
  )
}

/**
 * Data structure for subflow nodes (loop and parallel containers)
 */
export interface SubflowNodeData {
  width?: number
  height?: number
  parentId?: string
  extent?: 'parent'
  isPreview?: boolean
  kind: 'loop' | 'parallel'
  name?: string
}

/**
 * Subflow node component for loop and parallel execution containers.
 * Renders a resizable container with a header displaying the block name and icon,
 * handles for connections, and supports nested execution contexts.
 *
 * @param props - Node properties containing data and id
 * @returns Rendered subflow node component
 */
export const SubflowNodeComponent = memo(({ data, id }: NodeProps<SubflowNodeData>) => {
  const { getNodes } = useReactFlow()
  const { collaborativeRemoveBlock } = useCollaborativeWorkflow()
  const blockRef = useRef<HTMLDivElement>(null)

  const currentWorkflow = useCurrentWorkflow()
  const currentBlock = currentWorkflow.getBlockById(id)
  const diffStatus: DiffStatus =
    currentWorkflow.isDiffMode && currentBlock && hasDiffStatus(currentBlock)
      ? currentBlock.is_diff
      : undefined

  const isPreview = data?.isPreview || false

  // Focus state
  const setCurrentBlockId = usePanelEditorStore((state) => state.setCurrentBlockId)
  const currentBlockId = usePanelEditorStore((state) => state.currentBlockId)
  const isFocused = currentBlockId === id

  /**
   * Calculate the nesting level of this subflow node based on its parent hierarchy.
   * Used to apply appropriate styling for nested containers.
   */
  const nestingLevel = useMemo(() => {
    let level = 0
    let currentParentId = data?.parentId

    while (currentParentId) {
      level++
      const parentNode = getNodes().find((n) => n.id === currentParentId)
      if (!parentNode) break
      currentParentId = parentNode.data?.parentId
    }

    return level
  }, [id, data?.parentId, getNodes])

  const startHandleId = data.kind === 'loop' ? 'loop-start-source' : 'parallel-start-source'
  const endHandleId = data.kind === 'loop' ? 'loop-end-source' : 'parallel-end-source'
  const BlockIcon = data.kind === 'loop' ? RepeatIcon : SplitIcon
  const blockIconBg = data.kind === 'loop' ? '#2FB3FF' : '#FEE12B'
  const blockName = data.name || (data.kind === 'loop' ? 'Loop' : 'Parallel')

  /**
   * Reusable styles and positioning for Handle components.
   * Matches the styling pattern from workflow-block.tsx.
   */
  const getHandleClasses = (position: 'left' | 'right') => {
    const baseClasses = '!z-[10] !cursor-crosshair !border-none !transition-[colors] !duration-150'
    const colorClasses = '!bg-[var(--surface-12)]'

    const positionClasses = {
      left: '!left-[-7px] !h-5 !w-[7px] !rounded-l-[2px] !rounded-r-none hover:!left-[-10px] hover:!w-[10px] hover:!rounded-l-full',
      right:
        '!right-[-7px] !h-5 !w-[7px] !rounded-r-[2px] !rounded-l-none hover:!right-[-10px] hover:!w-[10px] hover:!rounded-r-full',
    }

    return cn(baseClasses, colorClasses, positionClasses[position])
  }

  const getHandleStyle = () => {
    return { top: `${HANDLE_POSITIONS.DEFAULT_Y_OFFSET}px`, transform: 'translateY(-50%)' }
  }

  /**
   * Determine the ring styling based on subflow state priority:
   * 1. Focused (selected in editor) - blue ring
   * 2. Diff status (version comparison) - green/orange ring
   */
  const hasRing = isFocused || diffStatus === 'new' || diffStatus === 'edited'
  const ringStyles = cn(
    hasRing && 'ring-[1.75px]',
    isFocused && 'ring-[var(--brand-secondary)]',
    diffStatus === 'new' && 'ring-[#22C55F]',
    diffStatus === 'edited' && 'ring-[var(--warning)]'
  )

  return (
    <>
      <SubflowNodeStyles />
      <div className='group relative'>
        <div
          ref={blockRef}
          onClick={() => setCurrentBlockId(id)}
          className={cn(
            'relative cursor-pointer select-none rounded-[8px] border border-[var(--divider)]',
            'transition-block-bg transition-ring',
            'z-[20]'
          )}
          style={{
            width: data.width || 500,
            height: data.height || 300,
            position: 'relative',
            overflow: 'visible',
            pointerEvents: isPreview ? 'none' : 'all',
          }}
          data-node-id={id}
          data-type='subflowNode'
          data-nesting-level={nestingLevel}
        >
          {/* Header Section */}
          <div
            className={cn(
              'workflow-drag-handle flex cursor-grab items-center justify-between rounded-t-[8px] border-[var(--divider)] border-b bg-[var(--surface-2)] py-[8px] pr-[12px] pl-[8px] [&:active]:cursor-grabbing'
            )}
            onMouseDown={(e) => {
              e.stopPropagation()
            }}
          >
            <div className='flex min-w-0 flex-1 items-center gap-[10px]'>
              <div
                className='flex h-[24px] w-[24px] flex-shrink-0 items-center justify-center rounded-[6px]'
                style={{ backgroundColor: blockIconBg }}
              >
                <BlockIcon className='h-[16px] w-[16px] text-white' />
              </div>
              <span className='font-medium text-[16px]' title={blockName}>
                {blockName}
              </span>
            </div>
            {!isPreview && (
              <Button
                variant='ghost'
                onClick={(e) => {
                  e.stopPropagation()
                  collaborativeRemoveBlock(id)
                }}
                className='h-[14px] w-[14px] p-0 opacity-0 transition-opacity duration-100 group-hover:opacity-100'
              >
                <Trash className='h-[14px] w-[14px]' />
              </Button>
            )}
          </div>

          {!isPreview && (
            <div
              className='absolute right-[8px] bottom-[8px] z-20 flex h-[32px] w-[32px] cursor-se-resize items-center justify-center text-muted-foreground'
              style={{ pointerEvents: 'auto' }}
            />
          )}

          <div
            className='h-[calc(100%-50px)] pt-[16px] pr-[80px] pb-[16px] pl-[16px]'
            data-dragarea='true'
            style={{
              position: 'relative',
              minHeight: '100%',
              pointerEvents: isPreview ? 'none' : 'auto',
            }}
          >
            {/* Subflow Start */}
            <div
              className='absolute top-[16px] left-[16px] flex items-center justify-center rounded-[8px] bg-[var(--surface-2)] px-[12px] py-[6px]'
              style={{ pointerEvents: isPreview ? 'none' : 'auto' }}
              data-parent-id={id}
              data-node-role={`${data.kind}-start`}
              data-extent='parent'
            >
              <span className='font-medium text-[14px] text-[var(--text-primary)]'>Start</span>

              <Handle
                type='source'
                position={Position.Right}
                id={startHandleId}
                className={getHandleClasses('right')}
                style={{
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'auto',
                }}
                data-parent-id={id}
              />
            </div>
          </div>

          {/* Input handle on left middle */}
          <Handle
            type='target'
            position={Position.Left}
            className={getHandleClasses('left')}
            style={{
              ...getHandleStyle(),
              pointerEvents: 'auto',
            }}
          />

          {/* Output handle on right middle */}
          <Handle
            type='source'
            position={Position.Right}
            className={getHandleClasses('right')}
            style={{
              ...getHandleStyle(),
              pointerEvents: 'auto',
            }}
            id={endHandleId}
          />

          {hasRing && (
            <div
              className={cn('pointer-events-none absolute inset-0 z-40 rounded-[8px]', ringStyles)}
            />
          )}
        </div>
      </div>
    </>
  )
})

SubflowNodeComponent.displayName = 'SubflowNodeComponent'
```

--------------------------------------------------------------------------------

---[FILE: loop-config.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/subflows/loop/loop-config.ts

```typescript
import { RepeatIcon } from 'lucide-react'

/**
 * Loop tool configuration for the toolbar.
 * Defines the visual appearance of the Loop subflow container in the toolbar.
 */
export const LoopTool = {
  type: 'loop',
  name: 'Loop',
  icon: RepeatIcon,
  bgColor: '#2FB3FF',
} as const
```

--------------------------------------------------------------------------------

---[FILE: parallel-config.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/subflows/parallel/parallel-config.ts

```typescript
import { SplitIcon } from 'lucide-react'

/**
 * Parallel tool configuration for the toolbar.
 * Defines the visual appearance of the Parallel subflow container in the toolbar.
 */
export const ParallelTool = {
  type: 'parallel',
  name: 'Parallel',
  icon: SplitIcon,
  bgColor: '#FEE12B',
} as const
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/terminal/index.ts

```typescript
export { Terminal } from './terminal'
```

--------------------------------------------------------------------------------

````
