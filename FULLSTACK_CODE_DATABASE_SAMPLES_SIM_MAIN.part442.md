---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 442
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 442 of 933)

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
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-float/index.ts

```typescript
export { useFloatBoundarySync } from './use-float-boundary-sync'
export { useFloatDrag } from './use-float-drag'
export { useFloatResize } from './use-float-resize'
```

--------------------------------------------------------------------------------

---[FILE: use-float-boundary-sync.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-float/use-float-boundary-sync.ts
Signals: React

```typescript
import { useCallback, useEffect, useRef } from 'react'

interface UseFloatBoundarySyncProps {
  isOpen: boolean
  position: { x: number; y: number }
  width: number
  height: number
  onPositionChange: (position: { x: number; y: number }) => void
}

/**
 * Hook to synchronize floats position with layout boundary changes.
 * Keeps the float within bounds when sidebar, panel, or terminal resize.
 * Uses requestAnimationFrame for smooth real-time updates
 */
export function useFloatBoundarySync({
  isOpen,
  position,
  width,
  height,
  onPositionChange,
}: UseFloatBoundarySyncProps) {
  const rafIdRef = useRef<number | null>(null)
  const positionRef = useRef(position)
  const previousDimensionsRef = useRef({ sidebarWidth: 0, panelWidth: 0, terminalHeight: 0 })

  // Keep position ref up to date
  positionRef.current = position

  const checkAndUpdatePosition = useCallback(() => {
    // Get current layout dimensions
    const sidebarWidth = Number.parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width') || '0'
    )
    const panelWidth = Number.parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--panel-width') || '0'
    )
    const terminalHeight = Number.parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--terminal-height') || '0'
    )

    // Check if dimensions actually changed
    const prev = previousDimensionsRef.current
    if (
      prev.sidebarWidth === sidebarWidth &&
      prev.panelWidth === panelWidth &&
      prev.terminalHeight === terminalHeight
    ) {
      return // No change, skip update
    }

    // Update previous dimensions
    previousDimensionsRef.current = { sidebarWidth, panelWidth, terminalHeight }

    // Calculate bounds
    const minX = sidebarWidth
    const maxX = window.innerWidth - panelWidth - width
    const minY = 0
    const maxY = window.innerHeight - terminalHeight - height

    const currentPos = positionRef.current

    // Check if current position is out of bounds
    if (currentPos.x < minX || currentPos.x > maxX || currentPos.y < minY || currentPos.y > maxY) {
      // Constrain to new bounds
      const newPosition = {
        x: Math.max(minX, Math.min(maxX, currentPos.x)),
        y: Math.max(minY, Math.min(maxY, currentPos.y)),
      }
      onPositionChange(newPosition)
    }
  }, [width, height, onPositionChange])

  useEffect(() => {
    if (!isOpen) return

    const handleResize = () => {
      // Cancel any pending animation frame
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }

      // Schedule update on next animation frame for smooth 60fps updates
      rafIdRef.current = requestAnimationFrame(() => {
        checkAndUpdatePosition()
        rafIdRef.current = null
      })
    }

    // Listen for window resize
    window.addEventListener('resize', handleResize)

    // Create MutationObserver to watch for CSS variable changes
    // This fires immediately when sidebar/panel/terminal resize
    const observer = new MutationObserver(handleResize)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'],
    })

    // Initial check
    checkAndUpdatePosition()

    return () => {
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [isOpen, checkAndUpdatePosition])
}
```

--------------------------------------------------------------------------------

---[FILE: use-float-drag.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-float/use-float-drag.ts
Signals: React

```typescript
import { useCallback, useEffect, useRef } from 'react'
import { constrainChatPosition } from '@/stores/chat/store'

interface UseFloatDragProps {
  position: { x: number; y: number }
  width: number
  height: number
  onPositionChange: (position: { x: number; y: number }) => void
}

/**
 * Hook for handling drag functionality of floats.
 * Provides mouse event handlers and manages drag state
 */
export function useFloatDrag({ position, width, height, onPositionChange }: UseFloatDragProps) {
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const initialPositionRef = useRef({ x: 0, y: 0 })

  /**
   * Handle mouse down on drag handle - start dragging
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only left click
      if (e.button !== 0) return

      e.preventDefault()
      e.stopPropagation()

      isDraggingRef.current = true
      dragStartRef.current = { x: e.clientX, y: e.clientY }
      initialPositionRef.current = { ...position }

      // Add dragging cursor to body
      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
    },
    [position]
  )

  /**
   * Handle mouse move - update position while dragging
   */
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current) return

      const deltaX = e.clientX - dragStartRef.current.x
      const deltaY = e.clientY - dragStartRef.current.y

      const newPosition = {
        x: initialPositionRef.current.x + deltaX,
        y: initialPositionRef.current.y + deltaY,
      }

      // Constrain to bounds
      const constrainedPosition = constrainChatPosition(newPosition, width, height)
      onPositionChange(constrainedPosition)
    },
    [onPositionChange, width, height]
  )

  /**
   * Handle mouse up - stop dragging
   */
  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return

    isDraggingRef.current = false

    // Remove dragging cursor
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  /**
   * Set up global mouse event listeners
   */
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return {
    handleMouseDown,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-float-resize.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-float/use-float-resize.ts
Signals: React

```typescript
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  MAX_CHAT_HEIGHT,
  MAX_CHAT_WIDTH,
  MIN_CHAT_HEIGHT,
  MIN_CHAT_WIDTH,
} from '@/stores/chat/store'

interface UseFloatResizeProps {
  position: { x: number; y: number }
  width: number
  height: number
  onPositionChange: (position: { x: number; y: number }) => void
  onDimensionsChange: (dimensions: { width: number; height: number }) => void
  /**
   * Optional dimension constraints.
   * If omitted, chat defaults are used for backward compatibility.
   */
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
}

/**
 * Resize direction types - supports all 8 directions (4 corners + 4 edges)
 */
type ResizeDirection =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'right'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'left'
  | null

/**
 * Edge detection threshold in pixels (matches sidebar/panel resize handle width)
 */
const EDGE_THRESHOLD = 8

/**
 * Hook for handling multi-directional resize functionality of floating panels.
 * Supports resizing from all 8 directions: 4 corners and 4 edges.
 */
export function useFloatResize({
  position,
  width,
  height,
  onPositionChange,
  onDimensionsChange,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
}: UseFloatResizeProps) {
  const [cursor, setCursor] = useState<string>('')
  const isResizingRef = useRef(false)
  const activeDirectionRef = useRef<ResizeDirection>(null)
  const resizeStartRef = useRef({ x: 0, y: 0 })
  const initialStateRef = useRef({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })

  /**
   * Detect which edge or corner the mouse is near
   * @param e - Mouse event
   * @param chatElement - Chat container element
   * @returns The direction the mouse is near, or null
   */
  const detectResizeDirection = useCallback(
    (e: React.MouseEvent, chatElement: HTMLElement): ResizeDirection => {
      const rect = chatElement.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const isNearTop = y <= EDGE_THRESHOLD
      const isNearBottom = y >= rect.height - EDGE_THRESHOLD
      const isNearLeft = x <= EDGE_THRESHOLD
      const isNearRight = x >= rect.width - EDGE_THRESHOLD

      // Check corners first (they take priority over edges)
      if (isNearTop && isNearLeft) return 'top-left'
      if (isNearTop && isNearRight) return 'top-right'
      if (isNearBottom && isNearLeft) return 'bottom-left'
      if (isNearBottom && isNearRight) return 'bottom-right'

      // Check edges
      if (isNearTop) return 'top'
      if (isNearBottom) return 'bottom'
      if (isNearLeft) return 'left'
      if (isNearRight) return 'right'

      return null
    },
    []
  )

  /**
   * Get cursor style for a given resize direction
   */
  const getCursorForDirection = useCallback((direction: ResizeDirection): string => {
    switch (direction) {
      case 'top-left':
      case 'bottom-right':
        return 'nwse-resize'
      case 'top-right':
      case 'bottom-left':
        return 'nesw-resize'
      case 'top':
      case 'bottom':
        return 'ns-resize'
      case 'left':
      case 'right':
        return 'ew-resize'
      default:
        return ''
    }
  }, [])

  /**
   * Handle mouse move over chat - update cursor based on proximity to edges/corners
   */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isResizingRef.current) return

      const chatElement = e.currentTarget as HTMLElement
      const direction = detectResizeDirection(e, chatElement)
      const newCursor = getCursorForDirection(direction)

      if (newCursor !== cursor) {
        setCursor(newCursor)
      }
    },
    [cursor, detectResizeDirection, getCursorForDirection]
  )

  /**
   * Handle mouse leave - reset cursor
   */
  const handleMouseLeave = useCallback(() => {
    if (!isResizingRef.current) {
      setCursor('')
    }
  }, [])

  /**
   * Handle mouse down on edge/corner - start resizing
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only left click
      if (e.button !== 0) return

      const chatElement = e.currentTarget as HTMLElement
      const direction = detectResizeDirection(e, chatElement)

      if (!direction) return

      e.preventDefault()
      e.stopPropagation()

      isResizingRef.current = true
      activeDirectionRef.current = direction
      resizeStartRef.current = { x: e.clientX, y: e.clientY }
      initialStateRef.current = {
        x: position.x,
        y: position.y,
        width,
        height,
      }

      // Set cursor on body
      document.body.style.cursor = getCursorForDirection(direction)
      document.body.style.userSelect = 'none'
    },
    [position, width, height, detectResizeDirection, getCursorForDirection]
  )

  /**
   * Handle global mouse move - update dimensions while resizing
   */
  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizingRef.current || !activeDirectionRef.current) return

      let deltaX = e.clientX - resizeStartRef.current.x
      let deltaY = e.clientY - resizeStartRef.current.y
      const initial = initialStateRef.current
      const direction = activeDirectionRef.current

      // Get layout bounds
      const sidebarWidth = Number.parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width') || '0'
      )
      const panelWidth = Number.parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--panel-width') || '0'
      )
      const terminalHeight = Number.parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--terminal-height') || '0'
      )

      // Clamp vertical drag when resizing from the top so the chat does not grow downward
      // after its top edge hits the top of the viewport.
      if (direction === 'top' || direction === 'top-left' || direction === 'top-right') {
        // newY = initial.y + deltaY should never be less than 0
        const maxUpwardDelta = initial.y
        if (deltaY < -maxUpwardDelta) {
          deltaY = -maxUpwardDelta
        }
      }

      // Clamp vertical drag when resizing from the bottom so the chat does not grow upward
      // after its bottom edge hits the top of the terminal.
      if (direction === 'bottom' || direction === 'bottom-left' || direction === 'bottom-right') {
        const maxBottom = window.innerHeight - terminalHeight
        const initialBottom = initial.y + initial.height
        const maxDeltaY = maxBottom - initialBottom

        if (deltaY > maxDeltaY) {
          deltaY = maxDeltaY
        }
      }

      // Clamp horizontal drag when resizing from the left so the chat does not grow to the right
      // after its left edge hits the sidebar.
      if (direction === 'left' || direction === 'top-left' || direction === 'bottom-left') {
        const minLeft = sidebarWidth
        const minDeltaX = minLeft - initial.x

        if (deltaX < minDeltaX) {
          deltaX = minDeltaX
        }
      }

      // Clamp horizontal drag when resizing from the right so the chat does not grow to the left
      // after its right edge hits the panel.
      if (direction === 'right' || direction === 'top-right' || direction === 'bottom-right') {
        const maxRight = window.innerWidth - panelWidth
        const initialRight = initial.x + initial.width
        const maxDeltaX = maxRight - initialRight

        if (deltaX > maxDeltaX) {
          deltaX = maxDeltaX
        }
      }

      let newX = initial.x
      let newY = initial.y
      let newWidth = initial.width
      let newHeight = initial.height

      // Calculate new dimensions based on resize direction
      switch (direction) {
        // Corners
        case 'top-left':
          newWidth = initial.width - deltaX
          newHeight = initial.height - deltaY
          newX = initial.x + deltaX
          newY = initial.y + deltaY
          break
        case 'top-right':
          newWidth = initial.width + deltaX
          newHeight = initial.height - deltaY
          newY = initial.y + deltaY
          break
        case 'bottom-left':
          newWidth = initial.width - deltaX
          newHeight = initial.height + deltaY
          newX = initial.x + deltaX
          break
        case 'bottom-right':
          newWidth = initial.width + deltaX
          newHeight = initial.height + deltaY
          break

        // Edges
        case 'top':
          newHeight = initial.height - deltaY
          newY = initial.y + deltaY
          break
        case 'bottom':
          newHeight = initial.height + deltaY
          break
        case 'left':
          newWidth = initial.width - deltaX
          newX = initial.x + deltaX
          break
        case 'right':
          newWidth = initial.width + deltaX
          break
      }

      // Constrain dimensions to min/max. If explicit constraints are not provided,
      // fall back to the chat defaults for backward compatibility.
      const effectiveMinWidth = typeof minWidth === 'number' ? minWidth : MIN_CHAT_WIDTH
      const effectiveMaxWidth = typeof maxWidth === 'number' ? maxWidth : MAX_CHAT_WIDTH
      const effectiveMinHeight = typeof minHeight === 'number' ? minHeight : MIN_CHAT_HEIGHT
      const effectiveMaxHeight = typeof maxHeight === 'number' ? maxHeight : MAX_CHAT_HEIGHT

      const constrainedWidth = Math.max(effectiveMinWidth, Math.min(effectiveMaxWidth, newWidth))
      const constrainedHeight = Math.max(
        effectiveMinHeight,
        Math.min(effectiveMaxHeight, newHeight)
      )

      // Adjust position if dimensions were constrained on left/top edges
      if (direction === 'top-left' || direction === 'bottom-left' || direction === 'left') {
        if (constrainedWidth !== newWidth) {
          newX = initial.x + initial.width - constrainedWidth
        }
      }
      if (direction === 'top-left' || direction === 'top-right' || direction === 'top') {
        if (constrainedHeight !== newHeight) {
          newY = initial.y + initial.height - constrainedHeight
        }
      }

      // Constrain position to bounds
      const minX = sidebarWidth
      const maxX = window.innerWidth - panelWidth - constrainedWidth
      const minY = 0
      const maxY = window.innerHeight - terminalHeight - constrainedHeight

      const finalX = Math.max(minX, Math.min(maxX, newX))
      const finalY = Math.max(minY, Math.min(maxY, newY))

      // Update state
      onDimensionsChange({
        width: constrainedWidth,
        height: constrainedHeight,
      })
      onPositionChange({
        x: finalX,
        y: finalY,
      })
    },
    [onDimensionsChange, onPositionChange]
  )

  /**
   * Handle global mouse up - stop resizing
   */
  const handleGlobalMouseUp = useCallback(() => {
    if (!isResizingRef.current) return

    isResizingRef.current = false
    activeDirectionRef.current = null

    // Remove cursor from body
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    setCursor('')
  }, [])

  /**
   * Set up global mouse event listeners
   */
  useEffect(() => {
    window.addEventListener('mousemove', handleGlobalMouseMove)
    window.addEventListener('mouseup', handleGlobalMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [handleGlobalMouseMove, handleGlobalMouseUp])

  return {
    cursor,
    handleMouseMove,
    handleMouseLeave,
    handleMouseDown,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: auto-layout-utils.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/utils/auto-layout-utils.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import {
  DEFAULT_HORIZONTAL_SPACING,
  DEFAULT_LAYOUT_PADDING,
  DEFAULT_VERTICAL_SPACING,
} from '@/lib/workflows/autolayout/constants'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'

const logger = createLogger('AutoLayoutUtils')

/**
 * Auto layout options interface
 */
export interface AutoLayoutOptions {
  spacing?: {
    horizontal?: number
    vertical?: number
  }
  alignment?: 'start' | 'center' | 'end'
  padding?: {
    x?: number
    y?: number
  }
}

/**
 * Apply auto layout and update store
 * Standalone utility for use outside React context (event handlers, tools, etc.)
 */
export async function applyAutoLayoutAndUpdateStore(
  workflowId: string,
  options: AutoLayoutOptions = {}
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const workflowStore = useWorkflowStore.getState()
    const { blocks, edges, loops = {}, parallels = {} } = workflowStore

    logger.info('Auto layout store data:', {
      workflowId,
      blockCount: Object.keys(blocks).length,
      edgeCount: edges.length,
      loopCount: Object.keys(loops).length,
      parallelCount: Object.keys(parallels).length,
    })

    if (Object.keys(blocks).length === 0) {
      logger.warn('No blocks to layout', { workflowId })
      return { success: false, error: 'No blocks to layout' }
    }

    // Merge with default options
    const layoutOptions = {
      spacing: {
        horizontal: options.spacing?.horizontal ?? DEFAULT_HORIZONTAL_SPACING,
        vertical: options.spacing?.vertical ?? DEFAULT_VERTICAL_SPACING,
      },
      alignment: options.alignment ?? 'center',
      padding: {
        x: options.padding?.x ?? DEFAULT_LAYOUT_PADDING.x,
        y: options.padding?.y ?? DEFAULT_LAYOUT_PADDING.y,
      },
    }

    // Call the autolayout API route
    const response = await fetch(`/api/workflows/${workflowId}/autolayout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...layoutOptions,
        blocks,
        edges,
        loops,
        parallels,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const errorMessage = errorData?.error || `Auto layout failed: ${response.statusText}`
      logger.error('Auto layout API call failed:', {
        status: response.status,
        error: errorMessage,
      })
      return { success: false, error: errorMessage }
    }

    const result = await response.json()

    if (!result.success) {
      const errorMessage = result.error || 'Auto layout failed'
      logger.error('Auto layout failed:', { error: errorMessage })
      return { success: false, error: errorMessage }
    }

    // Update workflow store immediately with new positions
    const newWorkflowState = {
      ...workflowStore.getWorkflowState(),
      blocks: result.data?.layoutedBlocks || blocks,
      lastSaved: Date.now(),
    }

    useWorkflowStore.setState(newWorkflowState)

    logger.info('Successfully updated workflow store with auto layout', { workflowId })

    // Persist the changes to the database optimistically
    try {
      useWorkflowStore.getState().updateLastSaved()

      const { deploymentStatuses, needsRedeployment, dragStartPosition, ...stateToSave } =
        newWorkflowState

      const cleanedWorkflowState = {
        ...stateToSave,
        deployedAt: stateToSave.deployedAt ? new Date(stateToSave.deployedAt) : undefined,
        loops: stateToSave.loops || {},
        parallels: stateToSave.parallels || {},
        edges: (stateToSave.edges || []).map((edge: any) => {
          const { sourceHandle, targetHandle, ...rest } = edge || {}
          const sanitized: any = { ...rest }
          if (typeof sourceHandle === 'string' && sourceHandle.length > 0) {
            sanitized.sourceHandle = sourceHandle
          }
          if (typeof targetHandle === 'string' && targetHandle.length > 0) {
            sanitized.targetHandle = targetHandle
          }
          return sanitized
        }),
      }

      const saveResponse = await fetch(`/api/workflows/${workflowId}/state`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedWorkflowState),
      })

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json()
        throw new Error(
          errorData.error || `HTTP ${saveResponse.status}: ${saveResponse.statusText}`
        )
      }

      logger.info('Auto layout successfully persisted to database', { workflowId })
      return { success: true }
    } catch (saveError) {
      logger.error('Failed to save auto layout to database, reverting store changes:', {
        workflowId,
        error: saveError,
      })

      // Revert the store changes since database save failed
      useWorkflowStore.setState({
        ...workflowStore.getWorkflowState(),
        blocks: blocks,
        lastSaved: workflowStore.lastSaved,
      })

      return {
        success: false,
        error: `Failed to save positions to database: ${saveError instanceof Error ? saveError.message : 'Unknown error'}`,
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown store update error'
    logger.error('Failed to update store with auto layout:', { workflowId, error: errorMessage })

    return {
      success: false,
      error: errorMessage,
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: block-ring-utils.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/utils/block-ring-utils.ts

```typescript
import { cn } from '@/lib/core/utils/cn'

export type BlockDiffStatus = 'new' | 'edited' | null | undefined

export type BlockRunPathStatus = 'success' | 'error' | undefined

export interface BlockRingOptions {
  isActive: boolean
  isPending: boolean
  isFocused: boolean
  isDeletedBlock: boolean
  diffStatus: BlockDiffStatus
  runPathStatus: BlockRunPathStatus
}

/**
 * Derives visual ring visibility and class names for workflow blocks
 * based on execution, focus, diff, deletion, and run-path states.
 */
export function getBlockRingStyles(options: BlockRingOptions): {
  hasRing: boolean
  ringClassName: string
} {
  const { isActive, isPending, isFocused, isDeletedBlock, diffStatus, runPathStatus } = options

  const hasRing =
    isActive ||
    isPending ||
    isFocused ||
    diffStatus === 'new' ||
    diffStatus === 'edited' ||
    isDeletedBlock ||
    !!runPathStatus

  const ringClassName = cn(
    // Executing block: pulsing success ring with prominent thickness
    isActive && 'ring-[3.5px] ring-[var(--border-success)] animate-ring-pulse',
    // Non-active states use standard ring utilities
    !isActive && hasRing && 'ring-[1.75px]',
    // Pending state: warning ring
    !isActive && isPending && 'ring-[var(--warning)]',
    // Focused (selected) state: brand ring
    !isActive && !isPending && isFocused && 'ring-[var(--brand-secondary)]',
    // Deleted state (highest priority after active/pending/focused)
    !isActive && !isPending && !isFocused && isDeletedBlock && 'ring-[var(--text-error)]',
    // Diff states
    !isActive &&
      !isPending &&
      !isFocused &&
      !isDeletedBlock &&
      diffStatus === 'new' &&
      'ring-[var(--brand-tertiary)]',
    !isActive &&
      !isPending &&
      !isFocused &&
      !isDeletedBlock &&
      diffStatus === 'edited' &&
      'ring-[var(--warning)]',
    // Run path states (lowest priority - only show if no other states active)
    !isActive &&
      !isPending &&
      !isFocused &&
      !isDeletedBlock &&
      !diffStatus &&
      runPathStatus === 'success' &&
      'ring-[var(--border-success)]',
    !isActive &&
      !isPending &&
      !isFocused &&
      !isDeletedBlock &&
      !diffStatus &&
      runPathStatus === 'error' &&
      'ring-[var(--text-error)]'
  )

  return { hasRing, ringClassName }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/utils/index.ts

```typescript
export * from './auto-layout-utils'
export * from './block-ring-utils'
export * from './workflow-execution-utils'
```

--------------------------------------------------------------------------------

---[FILE: workflow-execution-utils.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/utils/workflow-execution-utils.ts

```typescript
import { v4 as uuidv4 } from 'uuid'
import type { ExecutionResult, StreamingExecution } from '@/executor/types'
import { useExecutionStore } from '@/stores/execution/store'
import { useTerminalConsoleStore } from '@/stores/terminal'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'

export interface WorkflowExecutionOptions {
  workflowInput?: any
  onStream?: (se: StreamingExecution) => Promise<void>
  executionId?: string
  onBlockComplete?: (blockId: string, output: any) => Promise<void>
  overrideTriggerType?: 'chat' | 'manual' | 'api'
}

/**
 * Execute workflow with full logging (used by copilot tools)
 * Handles SSE streaming and populates console logs in real-time
 */
export async function executeWorkflowWithFullLogging(
  options: WorkflowExecutionOptions = {}
): Promise<ExecutionResult | StreamingExecution> {
  const { activeWorkflowId } = useWorkflowRegistry.getState()

  if (!activeWorkflowId) {
    throw new Error('No active workflow')
  }

  const executionId = options.executionId || uuidv4()
  const { addConsole } = useTerminalConsoleStore.getState()
  const { setActiveBlocks, setBlockRunStatus, setEdgeRunStatus } = useExecutionStore.getState()
  const workflowEdges = useWorkflowStore.getState().edges

  // Track active blocks for pulsing animation
  const activeBlocksSet = new Set<string>()

  const payload: any = {
    input: options.workflowInput,
    stream: true,
    triggerType: options.overrideTriggerType || 'manual',
    useDraftState: true,
    isClientSession: true,
  }

  const response = await fetch(`/api/workflows/${activeWorkflowId}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Workflow execution failed')
  }

  if (!response.body) {
    throw new Error('No response body')
  }

  // Parse SSE stream
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let executionResult: ExecutionResult = {
    success: false,
    output: {},
    logs: [],
  }

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.trim() || !line.startsWith('data: ')) continue

        const data = line.substring(6).trim()
        if (data === '[DONE]') continue

        try {
          const event = JSON.parse(data)

          switch (event.type) {
            case 'block:started': {
              // Add block to active set for pulsing animation
              activeBlocksSet.add(event.data.blockId)
              setActiveBlocks(new Set(activeBlocksSet))

              // Track edges that led to this block as soon as execution starts
              const incomingEdges = workflowEdges.filter(
                (edge) => edge.target === event.data.blockId
              )
              incomingEdges.forEach((edge) => {
                setEdgeRunStatus(edge.id, 'success')
              })
              break
            }

            case 'block:completed':
              // Remove block from active set
              activeBlocksSet.delete(event.data.blockId)
              setActiveBlocks(new Set(activeBlocksSet))

              // Track successful block execution in run path
              setBlockRunStatus(event.data.blockId, 'success')

              addConsole({
                input: event.data.input || {},
                output: event.data.output,
                success: true,
                durationMs: event.data.durationMs,
                startedAt: new Date(Date.now() - event.data.durationMs).toISOString(),
                endedAt: new Date().toISOString(),
                workflowId: activeWorkflowId,
                blockId: event.data.blockId,
                executionId,
                blockName: event.data.blockName,
                blockType: event.data.blockType,
                iterationCurrent: event.data.iterationCurrent,
                iterationTotal: event.data.iterationTotal,
                iterationType: event.data.iterationType,
              })

              if (options.onBlockComplete) {
                options.onBlockComplete(event.data.blockId, event.data.output).catch(() => {})
              }
              break

            case 'block:error':
              // Remove block from active set
              activeBlocksSet.delete(event.data.blockId)
              setActiveBlocks(new Set(activeBlocksSet))

              // Track failed block execution in run path
              setBlockRunStatus(event.data.blockId, 'error')

              addConsole({
                input: event.data.input || {},
                output: {},
                success: false,
                error: event.data.error,
                durationMs: event.data.durationMs,
                startedAt: new Date(Date.now() - event.data.durationMs).toISOString(),
                endedAt: new Date().toISOString(),
                workflowId: activeWorkflowId,
                blockId: event.data.blockId,
                executionId,
                blockName: event.data.blockName,
                blockType: event.data.blockType,
                iterationCurrent: event.data.iterationCurrent,
                iterationTotal: event.data.iterationTotal,
                iterationType: event.data.iterationType,
              })
              break

            case 'execution:completed':
              executionResult = {
                success: event.data.success,
                output: event.data.output,
                logs: [],
                metadata: {
                  duration: event.data.duration,
                  startTime: event.data.startTime,
                  endTime: event.data.endTime,
                },
              }
              break

            case 'execution:error':
              throw new Error(event.data.error || 'Execution failed')
          }
        } catch (parseError) {
          // Skip malformed SSE events
        }
      }
    }
  } finally {
    reader.releaseLock()
    // Clear active blocks when execution ends
    setActiveBlocks(new Set())
  }

  return executionResult
}
```

--------------------------------------------------------------------------------

---[FILE: hydration-error-handler.tsx]---
Location: sim-main/apps/sim/app/_shell/hydration-error-handler.tsx
Signals: React

```typescript
'use client'

import { useEffect } from 'react'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('RootLayout')

const BROWSER_EXTENSION_ATTRIBUTES = [
  'data-new-gr-c-s-check-loaded',
  'data-gr-ext-installed',
  'data-gr-ext-disabled',
  'data-grammarly',
  'data-fgm',
  'data-lt-installed',
]

/**
 * Client component that intercepts console.error to filter and log hydration errors
 * while ignoring errors caused by browser extensions.
 */
export function HydrationErrorHandler() {
  useEffect(() => {
    const originalError = console.error
    console.error = (...args) => {
      if (args[0].includes('Hydration')) {
        const isExtensionError = BROWSER_EXTENSION_ATTRIBUTES.some((attr) =>
          args.some((arg) => typeof arg === 'string' && arg.includes(attr))
        )

        if (!isExtensionError) {
          logger.error('Hydration Error', {
            details: args,
            componentStack: args.find(
              (arg) => typeof arg === 'string' && arg.includes('component stack')
            ),
          })
        }
      }
      originalError.apply(console, args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: zoom-prevention.tsx]---
Location: sim-main/apps/sim/app/_shell/zoom-prevention.tsx
Signals: React

```typescript
'use client'

import { useEffect } from 'react'

export function ZoomPrevention() {
  useEffect(() => {
    const preventZoom = (e: KeyboardEvent | WheelEvent) => {
      // Prevent zoom on ctrl/cmd + wheel
      if (e instanceof WheelEvent && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
      }

      // Prevent zoom on ctrl/cmd + plus/minus/zero
      if (e instanceof KeyboardEvent && (e.ctrlKey || e.metaKey)) {
        if (e.key === '=' || e.key === '-' || e.key === '0') {
          e.preventDefault()
        }
      }
    }

    // Add event listeners
    document.addEventListener('wheel', preventZoom, { passive: false })
    document.addEventListener('keydown', preventZoom)

    // Cleanup
    return () => {
      document.removeEventListener('wheel', preventZoom)
      document.removeEventListener('keydown', preventZoom)
    }
  }, [])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: posthog-provider.tsx]---
Location: sim-main/apps/sim/app/_shell/providers/posthog-provider.tsx
Signals: React

```typescript
'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { getEnv, isTruthy } from '@/lib/core/config/env'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const posthogEnabled = getEnv('NEXT_PUBLIC_POSTHOG_ENABLED')
    const posthogKey = getEnv('NEXT_PUBLIC_POSTHOG_KEY')

    if (isTruthy(posthogEnabled) && posthogKey && !posthog.__loaded) {
      posthog.init(posthogKey, {
        api_host: '/ingest',
        ui_host: 'https://us.posthog.com',
        defaults: '2025-05-24',
        person_profiles: 'identified_only',
        capture_pageview: true,
        capture_pageleave: false,
        capture_performance: false,
        session_recording: {
          maskAllInputs: false,
          maskInputOptions: {
            password: true,
            email: false,
          },
          recordCrossOriginIframes: false,
          recordHeaders: false,
          recordBody: false,
        },
        autocapture: {
          dom_event_allowlist: ['click', 'submit', 'change'],
          element_allowlist: ['button', 'a', 'input'],
        },
        capture_dead_clicks: false,
        persistence: 'localStorage+cookie',
        enable_heatmaps: false,
      })
    }
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
```

--------------------------------------------------------------------------------

---[FILE: query-provider.tsx]---
Location: sim-main/apps/sim/app/_shell/providers/query-provider.tsx
Signals: React

```typescript
'use client'

import { type ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            gcTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
            retryOnMount: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
```

--------------------------------------------------------------------------------

````
