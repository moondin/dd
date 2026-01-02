---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 386
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 386 of 933)

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

---[FILE: use-sidebar-resize.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/hooks/use-sidebar-resize.ts
Signals: React

```typescript
import { useCallback, useEffect, useState } from 'react'
import { MIN_SIDEBAR_WIDTH, useSidebarStore } from '@/stores/sidebar/store'

/**
 * Constants for sidebar sizing
 */
const MAX_WIDTH_PERCENTAGE = 0.3 // 30% of viewport width

/**
 * Custom hook to handle sidebar resize functionality.
 * Manages mouse events for resizing and enforces min/max width constraints.
 * Maximum width is capped at 30% of the viewport width for optimal layout.
 *
 * @returns Resize state and handlers
 */
export function useSidebarResize() {
  const { setSidebarWidth } = useSidebarStore()
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
      const newWidth = e.clientX
      const maxWidth = window.innerWidth * MAX_WIDTH_PERCENTAGE

      if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= maxWidth) {
        setSidebarWidth(newWidth)
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
  }, [isResizing, setSidebarWidth])

  return {
    isResizing,
    handleMouseDown,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-workflow-operations.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/hooks/use-workflow-operations.ts
Signals: React, Next.js

```typescript
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createLogger } from '@/lib/logs/console/logger'
import { useCreateWorkflow, useWorkflows } from '@/hooks/queries/workflows'
import { useWorkflowDiffStore } from '@/stores/workflow-diff/store'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import {
  generateCreativeWorkflowName,
  getNextWorkflowColor,
} from '@/stores/workflows/registry/utils'

const logger = createLogger('useWorkflowOperations')

interface UseWorkflowOperationsProps {
  workspaceId: string
}

export function useWorkflowOperations({ workspaceId }: UseWorkflowOperationsProps) {
  const router = useRouter()
  const { workflows } = useWorkflowRegistry()
  const workflowsQuery = useWorkflows(workspaceId)
  const createWorkflowMutation = useCreateWorkflow()

  /**
   * Filter and sort workflows for the current workspace
   */
  const regularWorkflows = Object.values(workflows)
    .filter((workflow) => workflow.workspaceId === workspaceId)
    .sort((a, b) => {
      // Sort by creation date (newest first) for stable ordering
      return b.createdAt.getTime() - a.createdAt.getTime()
    })

  const handleCreateWorkflow = useCallback(async (): Promise<string | null> => {
    try {
      const { clearDiff } = useWorkflowDiffStore.getState()
      clearDiff()

      const name = generateCreativeWorkflowName()
      const color = getNextWorkflowColor()

      const result = await createWorkflowMutation.mutateAsync({
        workspaceId,
        name,
        color,
      })

      if (result.id) {
        router.push(`/workspace/${workspaceId}/w/${result.id}`)
        return result.id
      }
      return null
    } catch (error) {
      logger.error('Error creating workflow:', error)
      return null
    }
  }, [createWorkflowMutation, workspaceId, router])

  return {
    // State
    workflows,
    regularWorkflows,
    workflowsLoading: workflowsQuery.isLoading,
    isCreatingWorkflow: createWorkflowMutation.isPending,

    // Operations
    handleCreateWorkflow,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-workflow-selection.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/hooks/use-workflow-selection.ts
Signals: React

```typescript
import { useCallback } from 'react'
import { useFolderStore } from '@/stores/folders/store'

interface UseWorkflowSelectionProps {
  /**
   * Flat array of all workflow IDs in display order
   */
  workflowIds: string[]
  /**
   * Active workflow ID (from URL) - used as anchor for range selection
   */
  activeWorkflowId: string | undefined
}

/**
 * Hook for managing workflow selection with support for single, range, and toggle selection.
 * Handles shift-click for range selection and regular click for single selection.
 * Uses the active workflow ID as the anchor point for range selections.
 *
 * @param props - Hook props
 * @returns Selection handlers
 */
export function useWorkflowSelection({ workflowIds, activeWorkflowId }: UseWorkflowSelectionProps) {
  const { selectedWorkflows, selectOnly, selectRange, toggleWorkflowSelection } = useFolderStore()

  /**
   * Handle workflow click with support for shift-click range selection and cmd/ctrl-click toggle
   *
   * @param workflowId - ID of clicked workflow
   * @param shiftKey - Whether shift key was pressed
   * @param metaKey - Whether cmd (Mac) or ctrl (Windows) key was pressed
   */
  const handleWorkflowClick = useCallback(
    (workflowId: string, shiftKey: boolean, metaKey: boolean) => {
      // Cmd/Ctrl+Click: Toggle individual selection
      if (metaKey) {
        toggleWorkflowSelection(workflowId)
      }
      // Shift+Click: Range selection from active workflow to clicked workflow
      else if (shiftKey && activeWorkflowId && activeWorkflowId !== workflowId) {
        selectRange(workflowIds, activeWorkflowId, workflowId)
      }
      // Shift+Click without active workflow: Toggle selection
      else if (shiftKey) {
        toggleWorkflowSelection(workflowId)
      }
      // Regular click: Select only this workflow
      else {
        selectOnly(workflowId)
      }
    },
    [workflowIds, activeWorkflowId, selectOnly, selectRange, toggleWorkflowSelection]
  )

  return {
    selectedWorkflows,
    handleWorkflowClick,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-workspace-management.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/hooks/use-workspace-management.ts
Signals: React, Next.js

```typescript
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createLogger } from '@/lib/logs/console/logger'
import { generateWorkspaceName } from '@/lib/workspaces/naming'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

const logger = createLogger('useWorkspaceManagement')

interface Workspace {
  id: string
  name: string
  ownerId: string
  role?: string
  membershipId?: string
  permissions?: 'admin' | 'write' | 'read' | null
}

interface UseWorkspaceManagementProps {
  workspaceId: string
  sessionUserId?: string
}

/**
 * Custom hook to manage workspace operations including fetching, switching, creating, deleting, and leaving workspaces.
 * Handles workspace validation and URL synchronization.
 *
 * @param props - Configuration object containing workspaceId and sessionUserId
 * @returns Workspace management state and operations
 */
export function useWorkspaceManagement({
  workspaceId,
  sessionUserId,
}: UseWorkspaceManagementProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { switchToWorkspace } = useWorkflowRegistry()

  // Workspace management state
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null)
  const [isWorkspacesLoading, setIsWorkspacesLoading] = useState(true)
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  // Refs to avoid dependency issues
  const workspaceIdRef = useRef<string>(workspaceId)
  const routerRef = useRef<ReturnType<typeof useRouter>>(router)
  const pathnameRef = useRef<string | null>(pathname || null)
  const activeWorkspaceRef = useRef<Workspace | null>(null)
  const isInitializedRef = useRef<boolean>(false)

  // Update refs when values change
  workspaceIdRef.current = workspaceId
  routerRef.current = router
  pathnameRef.current = pathname || null
  activeWorkspaceRef.current = activeWorkspace

  /**
   * Refresh workspace list without validation logic - used for non-current workspace operations
   */
  const refreshWorkspaceList = useCallback(async () => {
    setIsWorkspacesLoading(true)
    try {
      const response = await fetch('/api/workspaces')
      const data = await response.json()

      if (data.workspaces && Array.isArray(data.workspaces)) {
        const fetchedWorkspaces = data.workspaces as Workspace[]
        setWorkspaces(fetchedWorkspaces)

        // Only update activeWorkspace if it still exists in the fetched workspaces
        // Use functional update to avoid dependency on activeWorkspace
        setActiveWorkspace((currentActive) => {
          if (!currentActive) {
            return currentActive
          }

          const matchingWorkspace = fetchedWorkspaces.find(
            (workspace) => workspace.id === currentActive.id
          )
          if (matchingWorkspace) {
            return matchingWorkspace
          }

          // Active workspace was deleted, clear it
          logger.warn(`Active workspace ${currentActive.id} no longer exists`)
          return null
        })
      }
    } catch (err) {
      logger.error('Error refreshing workspace list:', err)
    } finally {
      setIsWorkspacesLoading(false)
    }
  }, [])

  /**
   * Fetch workspaces for the current user with full validation and URL handling
   * Uses refs for workspaceId and router to avoid unnecessary recreations
   */
  const fetchWorkspaces = useCallback(async () => {
    setIsWorkspacesLoading(true)
    try {
      const response = await fetch('/api/workspaces')
      const data = await response.json()

      if (data.workspaces && Array.isArray(data.workspaces)) {
        const fetchedWorkspaces = data.workspaces as Workspace[]
        setWorkspaces(fetchedWorkspaces)

        // Handle active workspace selection with URL validation using refs
        const currentWorkspaceId = workspaceIdRef.current
        const currentRouter = routerRef.current

        if (currentWorkspaceId) {
          const matchingWorkspace = fetchedWorkspaces.find(
            (workspace) => workspace.id === currentWorkspaceId
          )
          if (matchingWorkspace) {
            setActiveWorkspace(matchingWorkspace)
          } else {
            logger.warn(`Workspace ${currentWorkspaceId} not found in user's workspaces`)

            // Fallback to first workspace if current not found
            if (fetchedWorkspaces.length > 0) {
              const fallbackWorkspace = fetchedWorkspaces[0]
              setActiveWorkspace(fallbackWorkspace)

              // Update URL to match the fallback workspace
              logger.info(`Redirecting to fallback workspace: ${fallbackWorkspace.id}`)
              currentRouter?.push(`/workspace/${fallbackWorkspace.id}/w`)
            } else {
              logger.error('No workspaces available for user')
            }
          }
        }
      }
    } catch (err) {
      logger.error('Error fetching workspaces:', err)
    } finally {
      setIsWorkspacesLoading(false)
    }
  }, [])

  /**
   * Update workspace name both in API and local state
   */
  const updateWorkspaceName = useCallback(
    async (workspaceId: string, newName: string): Promise<boolean> => {
      try {
        const response = await fetch(`/api/workspaces/${workspaceId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName.trim() }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to update workspace name')
        }

        // Update local state immediately after successful API call
        setActiveWorkspace((prev) => (prev ? { ...prev, name: newName.trim() } : null))
        setWorkspaces((prev) =>
          prev.map((workspace) =>
            workspace.id === workspaceId ? { ...workspace, name: newName.trim() } : workspace
          )
        )

        logger.info('Successfully updated workspace name to:', newName.trim())
        return true
      } catch (error) {
        logger.error('Error updating workspace name:', error)
        return false
      }
    },
    []
  )

  /**
   * Switch to a different workspace
   * Uses refs for activeWorkspace and router to avoid unnecessary recreations
   */
  const switchWorkspace = useCallback(
    async (workspace: Workspace) => {
      // If already on this workspace, return
      if (activeWorkspaceRef.current?.id === workspace.id) {
        return
      }

      try {
        // Switch workspace and update URL
        await switchToWorkspace(workspace.id)
        const currentPath = pathnameRef.current || ''
        // Preserve templates route if user is on templates or template detail
        const templateDetailMatch = currentPath.match(/^\/workspace\/[^/]+\/templates\/([^/]+)$/)
        if (templateDetailMatch) {
          const templateId = templateDetailMatch[1]
          routerRef.current?.push(`/workspace/${workspace.id}/templates/${templateId}`)
        } else if (/^\/workspace\/[^/]+\/templates$/.test(currentPath)) {
          routerRef.current?.push(`/workspace/${workspace.id}/templates`)
        } else {
          routerRef.current?.push(`/workspace/${workspace.id}/w`)
        }
        logger.info(`Switched to workspace: ${workspace.name} (${workspace.id})`)
      } catch (error) {
        logger.error('Error switching workspace:', error)
      }
    },
    [switchToWorkspace]
  )

  /**
   * Handle create workspace
   */
  const handleCreateWorkspace = useCallback(async () => {
    if (isCreatingWorkspace) {
      logger.info('Workspace creation already in progress, ignoring request')
      return
    }

    try {
      setIsCreatingWorkspace(true)
      logger.info('Creating new workspace')

      // Generate workspace name using utility function
      const workspaceName = await generateWorkspaceName()

      logger.info(`Generated workspace name: ${workspaceName}`)

      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: workspaceName,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create workspace')
      }

      const data = await response.json()
      const newWorkspace = data.workspace

      logger.info('Created new workspace:', newWorkspace)

      // Refresh workspace list (no URL validation needed for creation)
      await refreshWorkspaceList()

      // Switch to the new workspace
      await switchWorkspace(newWorkspace)
    } catch (error) {
      logger.error('Error creating workspace:', error)
    } finally {
      setIsCreatingWorkspace(false)
    }
  }, [refreshWorkspaceList, switchWorkspace, isCreatingWorkspace])

  /**
   * Confirm delete workspace
   */
  const confirmDeleteWorkspace = useCallback(
    async (workspaceToDelete: Workspace, templateAction?: 'keep' | 'delete') => {
      setIsDeleting(true)
      try {
        logger.info('Deleting workspace:', workspaceToDelete.id)

        const deleteTemplates = templateAction === 'delete'

        const response = await fetch(`/api/workspaces/${workspaceToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ deleteTemplates }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to delete workspace')
        }

        logger.info('Workspace deleted successfully:', workspaceToDelete.id)

        // Check if we're deleting the current workspace (either active or in URL)
        const isDeletingCurrentWorkspace =
          workspaceIdRef.current === workspaceToDelete.id ||
          activeWorkspaceRef.current?.id === workspaceToDelete.id

        if (isDeletingCurrentWorkspace) {
          // For current workspace deletion, use full fetchWorkspaces with URL validation
          logger.info(
            'Deleting current workspace - using full workspace refresh with URL validation'
          )
          await fetchWorkspaces()

          // If we deleted the active workspace, switch to the first available workspace
          if (activeWorkspaceRef.current?.id === workspaceToDelete.id) {
            const remainingWorkspaces = workspaces.filter((w) => w.id !== workspaceToDelete.id)
            if (remainingWorkspaces.length > 0) {
              await switchWorkspace(remainingWorkspaces[0])
            }
          }
        } else {
          // For non-current workspace deletion, just refresh the list without URL validation
          logger.info('Deleting non-current workspace - using simple list refresh')
          await refreshWorkspaceList()
        }
      } catch (error) {
        logger.error('Error deleting workspace:', error)
      } finally {
        setIsDeleting(false)
      }
    },
    [fetchWorkspaces, refreshWorkspaceList, workspaces, switchWorkspace]
  )

  /**
   * Handle leave workspace
   */
  const handleLeaveWorkspace = useCallback(
    async (workspaceToLeave: Workspace) => {
      setIsLeaving(true)
      try {
        logger.info('Leaving workspace:', workspaceToLeave.id)

        // Use the existing member removal API with current user's ID
        const response = await fetch(`/api/workspaces/members/${sessionUserId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workspaceId: workspaceToLeave.id,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to leave workspace')
        }

        logger.info('Left workspace successfully:', workspaceToLeave.id)

        // Check if we're leaving the current workspace (either active or in URL)
        const isLeavingCurrentWorkspace =
          workspaceIdRef.current === workspaceToLeave.id ||
          activeWorkspaceRef.current?.id === workspaceToLeave.id

        if (isLeavingCurrentWorkspace) {
          // For current workspace leaving, use full fetchWorkspaces with URL validation
          logger.info(
            'Leaving current workspace - using full workspace refresh with URL validation'
          )
          await fetchWorkspaces()

          // If we left the active workspace, switch to the first available workspace
          if (activeWorkspaceRef.current?.id === workspaceToLeave.id) {
            const remainingWorkspaces = workspaces.filter((w) => w.id !== workspaceToLeave.id)
            if (remainingWorkspaces.length > 0) {
              await switchWorkspace(remainingWorkspaces[0])
            }
          }
        } else {
          // For non-current workspace leaving, just refresh the list without URL validation
          logger.info('Leaving non-current workspace - using simple list refresh')
          await refreshWorkspaceList()
        }
      } catch (error) {
        logger.error('Error leaving workspace:', error)
      } finally {
        setIsLeaving(false)
      }
    },
    [fetchWorkspaces, refreshWorkspaceList, workspaces, switchWorkspace, sessionUserId]
  )

  /**
   * Validate workspace exists before making API calls
   */
  const isWorkspaceValid = useCallback(async (workspaceId: string) => {
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}`)
      return response.ok
    } catch {
      return false
    }
  }, [])

  /**
   * Initialize workspace data on mount (uses full validation with URL handling)
   * fetchWorkspaces is stable (empty deps array), so it's safe to call without including it
   */
  useEffect(() => {
    if (sessionUserId && !isInitializedRef.current) {
      isInitializedRef.current = true
      fetchWorkspaces()
    }
  }, [sessionUserId, fetchWorkspaces])

  return {
    // State
    workspaces,
    activeWorkspace,
    isWorkspacesLoading,
    isCreatingWorkspace,
    isDeleting,
    isLeaving,

    // Operations
    fetchWorkspaces,
    refreshWorkspaceList,
    updateWorkspaceName,
    switchWorkspace,
    handleCreateWorkspace,
    confirmDeleteWorkspace,
    handleLeaveWorkspace,
    isWorkspaceValid,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: workflow-preview-block.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/workflow-preview/workflow-preview-block.tsx
Signals: React

```typescript
'use client'

import { memo, useMemo } from 'react'
import { Handle, type NodeProps, Position } from 'reactflow'
import { HANDLE_POSITIONS } from '@/lib/workflows/blocks/block-dimensions'
import { getBlock } from '@/blocks/registry'

interface WorkflowPreviewBlockData {
  type: string
  name: string
  isTrigger?: boolean
  horizontalHandles?: boolean
  enabled?: boolean
}

/**
 * Lightweight block component for workflow previews.
 * Renders block header, dummy subblocks skeleton, and handles.
 * Respects horizontalHandles and enabled state from workflow.
 * No heavy hooks, store subscriptions, or interactive features.
 * Used in template cards and other preview contexts for performance.
 */
function WorkflowPreviewBlockInner({ data }: NodeProps<WorkflowPreviewBlockData>) {
  const { type, name, isTrigger = false, horizontalHandles = false, enabled = true } = data

  const blockConfig = getBlock(type)
  if (!blockConfig) {
    return null
  }

  const IconComponent = blockConfig.icon
  // Hide input handle for triggers, starters, or blocks in trigger mode
  const isStarterOrTrigger = blockConfig.category === 'triggers' || type === 'starter' || isTrigger

  // Get visible subblocks from config (no fetching, just config structure)
  const visibleSubBlocks = useMemo(() => {
    if (!blockConfig.subBlocks) return []

    return blockConfig.subBlocks.filter((subBlock) => {
      if (subBlock.hidden) return false
      if (subBlock.hideFromPreview) return false
      if (subBlock.mode === 'trigger') return false
      if (subBlock.mode === 'advanced') return false
      return true
    })
  }, [blockConfig.subBlocks])

  const hasSubBlocks = visibleSubBlocks.length > 0
  const showErrorRow = !isStarterOrTrigger

  // Handle styles based on orientation
  const horizontalHandleClass = '!border-none !bg-[var(--surface-12)] !h-5 !w-[7px] !rounded-[2px]'
  const verticalHandleClass = '!border-none !bg-[var(--surface-12)] !h-[7px] !w-5 !rounded-[2px]'

  return (
    <div className='relative w-[250px] select-none rounded-[8px] border border-[var(--border)] bg-[var(--surface-2)]'>
      {/* Target handle - not shown for triggers/starters */}
      {!isStarterOrTrigger && (
        <Handle
          type='target'
          position={horizontalHandles ? Position.Left : Position.Top}
          id='target'
          className={horizontalHandles ? horizontalHandleClass : verticalHandleClass}
          style={
            horizontalHandles
              ? { left: '-7px', top: `${HANDLE_POSITIONS.DEFAULT_Y_OFFSET}px` }
              : { top: '-7px', left: '50%', transform: 'translateX(-50%)' }
          }
        />
      )}

      {/* Header */}
      <div
        className={`flex items-center gap-[10px] p-[8px] ${hasSubBlocks || showErrorRow ? 'border-[var(--divider)] border-b' : ''}`}
      >
        <div
          className='flex h-[24px] w-[24px] flex-shrink-0 items-center justify-center rounded-[6px]'
          style={{ background: enabled ? blockConfig.bgColor : 'gray' }}
        >
          <IconComponent className='h-[16px] w-[16px] text-white' />
        </div>
        <span
          className={`truncate font-medium text-[16px] ${!enabled ? 'text-[#808080]' : ''}`}
          title={name}
        >
          {name}
        </span>
      </div>

      {/* Subblocks skeleton */}
      {(hasSubBlocks || showErrorRow) && (
        <div className='flex flex-col gap-[8px] p-[8px]'>
          {visibleSubBlocks.slice(0, 4).map((subBlock) => (
            <div key={subBlock.id} className='flex items-center gap-[8px]'>
              <span className='min-w-0 truncate text-[14px] text-[var(--text-tertiary)] capitalize'>
                {subBlock.title ?? subBlock.id}
              </span>
              <span className='flex-1 truncate text-right text-[14px] text-[var(--white)]'>-</span>
            </div>
          ))}
          {visibleSubBlocks.length > 4 && (
            <div className='flex items-center gap-[8px]'>
              <span className='text-[14px] text-[var(--text-tertiary)]'>
                +{visibleSubBlocks.length - 4} more
              </span>
            </div>
          )}
          {showErrorRow && (
            <div className='flex items-center gap-[8px]'>
              <span className='min-w-0 truncate text-[14px] text-[var(--text-tertiary)] capitalize'>
                error
              </span>
            </div>
          )}
        </div>
      )}

      {/* Source handle */}
      <Handle
        type='source'
        position={horizontalHandles ? Position.Right : Position.Bottom}
        id='source'
        className={horizontalHandles ? horizontalHandleClass : verticalHandleClass}
        style={
          horizontalHandles
            ? { right: '-7px', top: `${HANDLE_POSITIONS.DEFAULT_Y_OFFSET}px` }
            : { bottom: '-7px', left: '50%', transform: 'translateX(-50%)' }
        }
      />
    </div>
  )
}

export const WorkflowPreviewBlock = memo(WorkflowPreviewBlockInner)
```

--------------------------------------------------------------------------------

---[FILE: workflow-preview-subflow.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/workflow-preview/workflow-preview-subflow.tsx
Signals: React

```typescript
'use client'

import { memo } from 'react'
import { RepeatIcon, SplitIcon } from 'lucide-react'
import { Handle, type NodeProps, Position } from 'reactflow'
import { HANDLE_POSITIONS } from '@/lib/workflows/blocks/block-dimensions'

interface WorkflowPreviewSubflowData {
  name: string
  width?: number
  height?: number
  kind: 'loop' | 'parallel'
}

/**
 * Lightweight subflow component for workflow previews.
 * Matches the styling of the actual SubflowNodeComponent but without
 * hooks, store subscriptions, or interactive features.
 * Used in template cards and other preview contexts for performance.
 */
function WorkflowPreviewSubflowInner({ data }: NodeProps<WorkflowPreviewSubflowData>) {
  const { name, width = 500, height = 300, kind } = data

  const isLoop = kind === 'loop'
  const BlockIcon = isLoop ? RepeatIcon : SplitIcon
  const blockIconBg = isLoop ? '#2FB3FF' : '#FEE12B'
  const blockName = name || (isLoop ? 'Loop' : 'Parallel')

  // Handle IDs matching the actual subflow component
  const startHandleId = isLoop ? 'loop-start-source' : 'parallel-start-source'
  const endHandleId = isLoop ? 'loop-end-source' : 'parallel-end-source'

  // Handle styles matching the actual subflow component
  const handleClass =
    '!border-none !bg-[var(--surface-12)] !h-5 !w-[7px] !rounded-l-[2px] !rounded-r-[2px]'

  return (
    <div
      className='relative select-none rounded-[8px] border border-[var(--divider)]'
      style={{
        width,
        height,
      }}
    >
      {/* Target handle on left (input to the subflow) */}
      <Handle
        type='target'
        position={Position.Left}
        id='target'
        className={handleClass}
        style={{
          left: '-7px',
          top: `${HANDLE_POSITIONS.DEFAULT_Y_OFFSET}px`,
          transform: 'translateY(-50%)',
        }}
      />

      {/* Header - matches actual subflow header */}
      <div className='flex items-center gap-[10px] rounded-t-[8px] border-[var(--divider)] border-b bg-[var(--surface-2)] py-[8px] pr-[12px] pl-[8px]'>
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

      {/* Start handle inside - connects to first block in subflow */}
      <div className='absolute top-[56px] left-[16px] flex items-center justify-center rounded-[8px] bg-[var(--surface-2)] px-[12px] py-[6px]'>
        <span className='font-medium text-[14px] text-white'>Start</span>
        <Handle
          type='source'
          position={Position.Right}
          id={startHandleId}
          className={handleClass}
          style={{ right: '-7px', top: '50%', transform: 'translateY(-50%)' }}
        />
      </div>

      {/* End source handle on right (output from the subflow) */}
      <Handle
        type='source'
        position={Position.Right}
        id={endHandleId}
        className={handleClass}
        style={{
          right: '-7px',
          top: `${HANDLE_POSITIONS.DEFAULT_Y_OFFSET}px`,
          transform: 'translateY(-50%)',
        }}
      />
    </div>
  )
}

export const WorkflowPreviewSubflow = memo(WorkflowPreviewSubflowInner)
```

--------------------------------------------------------------------------------

````
