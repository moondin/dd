---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 387
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 387 of 933)

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

---[FILE: workflow-preview.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/workflow-preview/workflow-preview.tsx
Signals: React

```typescript
'use client'

import { useEffect, useMemo } from 'react'
import ReactFlow, {
  ConnectionLineType,
  type Edge,
  type EdgeTypes,
  type Node,
  type NodeTypes,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { cn } from '@/lib/core/utils/cn'
import { createLogger } from '@/lib/logs/console/logger'
import { NoteBlock } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/note-block/note-block'
import { SubflowNodeComponent } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/subflows/subflow-node'
import { WorkflowBlock } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-block/workflow-block'
import { WorkflowEdge } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-edge/workflow-edge'
import { WorkflowPreviewBlock } from '@/app/workspace/[workspaceId]/w/components/workflow-preview/workflow-preview-block'
import { WorkflowPreviewSubflow } from '@/app/workspace/[workspaceId]/w/components/workflow-preview/workflow-preview-subflow'
import { getBlock } from '@/blocks'
import type { WorkflowState } from '@/stores/workflows/workflow/types'

const logger = createLogger('WorkflowPreview')

interface WorkflowPreviewProps {
  workflowState: WorkflowState
  showSubBlocks?: boolean
  className?: string
  height?: string | number
  width?: string | number
  isPannable?: boolean
  defaultPosition?: { x: number; y: number }
  defaultZoom?: number
  fitPadding?: number
  onNodeClick?: (blockId: string, mousePosition: { x: number; y: number }) => void
  /** Use lightweight blocks for better performance in template cards */
  lightweight?: boolean
  /** Cursor style to show when hovering the canvas */
  cursorStyle?: 'default' | 'pointer' | 'grab'
}

/**
 * Full node types with interactive WorkflowBlock for detailed previews
 */
const fullNodeTypes: NodeTypes = {
  workflowBlock: WorkflowBlock,
  noteBlock: NoteBlock,
  subflowNode: SubflowNodeComponent,
}

/**
 * Lightweight node types for template cards and other high-volume previews.
 * Uses minimal components without hooks or store subscriptions.
 */
const lightweightNodeTypes: NodeTypes = {
  workflowBlock: WorkflowPreviewBlock,
  noteBlock: WorkflowPreviewBlock,
  subflowNode: WorkflowPreviewSubflow,
}

// Define edge types
const edgeTypes: EdgeTypes = {
  default: WorkflowEdge,
  workflowEdge: WorkflowEdge, // Keep for backward compatibility
}

interface FitViewOnChangeProps {
  nodes: Node[]
  fitPadding: number
}

/**
 * Helper component that calls fitView when nodes change.
 * Must be rendered inside ReactFlowProvider.
 */
function FitViewOnChange({ nodes, fitPadding }: FitViewOnChangeProps) {
  const { fitView } = useReactFlow()

  useEffect(() => {
    if (nodes.length > 0) {
      // Small delay to ensure nodes are rendered before fitting
      const timeoutId = setTimeout(() => {
        fitView({ padding: fitPadding, duration: 200 })
      }, 50)
      return () => clearTimeout(timeoutId)
    }
  }, [nodes, fitPadding, fitView])

  return null
}

export function WorkflowPreview({
  workflowState,
  showSubBlocks = true,
  className,
  height = '100%',
  width = '100%',
  isPannable = false,
  defaultPosition,
  defaultZoom = 0.8,
  fitPadding = 0.25,
  onNodeClick,
  lightweight = false,
  cursorStyle = 'grab',
}: WorkflowPreviewProps) {
  // Use lightweight node types for better performance in template cards
  const nodeTypes = lightweight ? lightweightNodeTypes : fullNodeTypes
  // Check if the workflow state is valid
  const isValidWorkflowState = workflowState?.blocks && workflowState.edges

  const blocksStructure = useMemo(() => {
    if (!isValidWorkflowState) return { count: 0, ids: '' }
    return {
      count: Object.keys(workflowState.blocks || {}).length,
      ids: Object.keys(workflowState.blocks || {}).join(','),
    }
  }, [workflowState.blocks, isValidWorkflowState])

  const loopsStructure = useMemo(() => {
    if (!isValidWorkflowState) return { count: 0, ids: '' }
    return {
      count: Object.keys(workflowState.loops || {}).length,
      ids: Object.keys(workflowState.loops || {}).join(','),
    }
  }, [workflowState.loops, isValidWorkflowState])

  const parallelsStructure = useMemo(() => {
    if (!isValidWorkflowState) return { count: 0, ids: '' }
    return {
      count: Object.keys(workflowState.parallels || {}).length,
      ids: Object.keys(workflowState.parallels || {}).join(','),
    }
  }, [workflowState.parallels, isValidWorkflowState])

  const edgesStructure = useMemo(() => {
    if (!isValidWorkflowState) return { count: 0, ids: '' }
    return {
      count: workflowState.edges?.length || 0,
      ids: workflowState.edges?.map((e) => e.id).join(',') || '',
    }
  }, [workflowState.edges, isValidWorkflowState])

  const calculateAbsolutePosition = (
    block: any,
    blocks: Record<string, any>
  ): { x: number; y: number } => {
    if (!block.data?.parentId) {
      return block.position
    }

    const parentBlock = blocks[block.data.parentId]
    if (!parentBlock) {
      logger.warn(`Parent block not found for child block: ${block.id}`)
      return block.position
    }

    const parentAbsolutePosition = calculateAbsolutePosition(parentBlock, blocks)

    return {
      x: parentAbsolutePosition.x + block.position.x,
      y: parentAbsolutePosition.y + block.position.y,
    }
  }

  const nodes: Node[] = useMemo(() => {
    if (!isValidWorkflowState) return []

    const nodeArray: Node[] = []

    Object.entries(workflowState.blocks || {}).forEach(([blockId, block]) => {
      if (!block || !block.type) {
        logger.warn(`Skipping invalid block: ${blockId}`)
        return
      }

      const absolutePosition = calculateAbsolutePosition(block, workflowState.blocks)

      // Lightweight mode: create minimal node data for performance
      if (lightweight) {
        // Handle loops and parallels as subflow nodes
        if (block.type === 'loop' || block.type === 'parallel') {
          nodeArray.push({
            id: blockId,
            type: 'subflowNode',
            position: absolutePosition,
            draggable: false,
            data: {
              name: block.name,
              width: block.data?.width || 500,
              height: block.data?.height || 300,
              kind: block.type as 'loop' | 'parallel',
            },
          })
          return
        }

        // Regular blocks
        nodeArray.push({
          id: blockId,
          type: 'workflowBlock',
          position: absolutePosition,
          draggable: false,
          data: {
            type: block.type,
            name: block.name,
            isTrigger: block.triggerMode === true,
            horizontalHandles: block.horizontalHandles ?? false,
            enabled: block.enabled ?? true,
          },
        })
        return
      }

      // Full mode: create detailed node data for interactive previews
      if (block.type === 'loop') {
        nodeArray.push({
          id: block.id,
          type: 'subflowNode',
          position: absolutePosition,
          parentId: block.data?.parentId,
          extent: block.data?.extent || undefined,
          draggable: false,
          data: {
            ...block.data,
            name: block.name,
            width: block.data?.width || 500,
            height: block.data?.height || 300,
            state: 'valid',
            isPreview: true,
            kind: 'loop',
          },
        })
        return
      }

      if (block.type === 'parallel') {
        nodeArray.push({
          id: block.id,
          type: 'subflowNode',
          position: absolutePosition,
          parentId: block.data?.parentId,
          extent: block.data?.extent || undefined,
          draggable: false,
          data: {
            ...block.data,
            name: block.name,
            width: block.data?.width || 500,
            height: block.data?.height || 300,
            state: 'valid',
            isPreview: true,
            kind: 'parallel',
          },
        })
        return
      }

      const blockConfig = getBlock(block.type)
      if (!blockConfig) {
        logger.error(`No configuration found for block type: ${block.type}`, { blockId })
        return
      }

      const nodeType = block.type === 'note' ? 'noteBlock' : 'workflowBlock'

      nodeArray.push({
        id: blockId,
        type: nodeType,
        position: absolutePosition,
        draggable: false,
        data: {
          type: block.type,
          config: blockConfig,
          name: block.name,
          blockState: block,
          canEdit: false,
          isPreview: true,
          subBlockValues: block.subBlocks ?? {},
        },
      })

      if (block.type === 'loop') {
        const childBlocks = Object.entries(workflowState.blocks || {}).filter(
          ([_, childBlock]) => childBlock.data?.parentId === blockId
        )

        childBlocks.forEach(([childId, childBlock]) => {
          const childConfig = getBlock(childBlock.type)

          if (childConfig) {
            const childNodeType = childBlock.type === 'note' ? 'noteBlock' : 'workflowBlock'

            nodeArray.push({
              id: childId,
              type: childNodeType,
              position: {
                x: block.position.x + 50,
                y: block.position.y + (childBlock.position?.y || 100),
              },
              data: {
                type: childBlock.type,
                config: childConfig,
                name: childBlock.name,
                blockState: childBlock,
                showSubBlocks,
                isChild: true,
                parentId: blockId,
                canEdit: false,
                isPreview: true,
              },
              draggable: false,
            })
          }
        })
      }
    })

    return nodeArray
  }, [
    blocksStructure,
    loopsStructure,
    parallelsStructure,
    showSubBlocks,
    workflowState.blocks,
    isValidWorkflowState,
    lightweight,
  ])

  const edges: Edge[] = useMemo(() => {
    if (!isValidWorkflowState) return []

    return (workflowState.edges || []).map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    }))
  }, [edgesStructure, workflowState.edges, isValidWorkflowState])

  // Handle migrated logs that don't have complete workflow state
  if (!isValidWorkflowState) {
    return (
      <div
        style={{ height, width }}
        className='flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
      >
        <div className='text-center text-gray-500 dark:text-gray-400'>
          <div className='mb-2 font-medium text-lg'>⚠️ Logged State Not Found</div>
          <div className='text-sm'>
            This log was migrated from the old system and doesn't contain workflow state data.
          </div>
        </div>
      </div>
    )
  }

  return (
    <ReactFlowProvider>
      <div
        style={{ height, width, backgroundColor: 'var(--bg)' }}
        className={cn('preview-mode', className)}
      >
        {cursorStyle && (
          <style>{`
            .preview-mode .react-flow__pane {
              cursor: ${cursorStyle} !important;
            }
          `}</style>
        )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          fitViewOptions={{ padding: fitPadding }}
          panOnScroll={false}
          panOnDrag={isPannable}
          zoomOnScroll={false}
          draggable={false}
          defaultViewport={{
            x: defaultPosition?.x ?? 0,
            y: defaultPosition?.y ?? 0,
            zoom: defaultZoom ?? 1,
          }}
          minZoom={0.1}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
          elementsSelectable={false}
          nodesDraggable={false}
          nodesConnectable={false}
          onNodeClick={
            onNodeClick
              ? (event, node) => {
                  logger.debug('Node clicked:', { nodeId: node.id, event })
                  onNodeClick(node.id, { x: event.clientX, y: event.clientY })
                }
              : undefined
          }
        />
        <FitViewOnChange nodes={nodes} fitPadding={fitPadding} />
      </div>
    </ReactFlowProvider>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/hooks/index.ts

```typescript
export { useDeleteFolder } from './use-delete-folder'
export { useDeleteWorkflow } from './use-delete-workflow'
export { useDuplicateFolder } from './use-duplicate-folder'
export { useDuplicateWorkflow } from './use-duplicate-workflow'
export { useDuplicateWorkspace } from './use-duplicate-workspace'
export { useExportWorkflow } from './use-export-workflow'
export { useExportWorkspace } from './use-export-workspace'
export { useImportWorkflow } from './use-import-workflow'
export { useImportWorkspace } from './use-import-workspace'
```

--------------------------------------------------------------------------------

---[FILE: use-delete-folder.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/hooks/use-delete-folder.ts
Signals: React

```typescript
import { useCallback, useState } from 'react'
import { createLogger } from '@/lib/logs/console/logger'
import { useDeleteFolderMutation } from '@/hooks/queries/folders'
import { useFolderStore } from '@/stores/folders/store'

const logger = createLogger('useDeleteFolder')

interface UseDeleteFolderProps {
  /**
   * Current workspace ID
   */
  workspaceId: string
  /**
   * Function that returns the folder ID(s) to delete
   * This function is called when deletion occurs to get fresh selection state
   */
  getFolderIds: () => string | string[]
  /**
   * Optional callback after successful deletion
   */
  onSuccess?: () => void
}

/**
 * Hook for managing folder deletion.
 *
 * Handles:
 * - Single or bulk folder deletion
 * - Calling delete API for each folder
 * - Loading state management
 * - Error handling and logging
 * - Clearing selection after deletion
 *
 * @param props - Hook configuration
 * @returns Delete folder handlers and state
 */
export function useDeleteFolder({ workspaceId, getFolderIds, onSuccess }: UseDeleteFolderProps) {
  const deleteFolderMutation = useDeleteFolderMutation()
  const [isDeleting, setIsDeleting] = useState(false)

  /**
   * Delete the folder(s)
   */
  const handleDeleteFolder = useCallback(async () => {
    if (isDeleting) {
      return
    }

    setIsDeleting(true)
    try {
      // Get fresh folder IDs at deletion time
      const folderIdsOrId = getFolderIds()
      if (!folderIdsOrId) {
        return
      }

      // Normalize to array for consistent handling
      const folderIdsToDelete = Array.isArray(folderIdsOrId) ? folderIdsOrId : [folderIdsOrId]

      // Delete each folder sequentially
      for (const folderId of folderIdsToDelete) {
        await deleteFolderMutation.mutateAsync({ id: folderId, workspaceId })
      }

      // Clear selection after successful deletion
      const { clearSelection } = useFolderStore.getState()
      clearSelection()

      logger.info('Folder(s) deleted successfully', { folderIds: folderIdsToDelete })
      onSuccess?.()
    } catch (error) {
      logger.error('Error deleting folder(s):', { error })
      throw error
    } finally {
      setIsDeleting(false)
    }
  }, [getFolderIds, isDeleting, deleteFolderMutation, workspaceId, onSuccess])

  return {
    isDeleting,
    handleDeleteFolder,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-delete-workflow.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/hooks/use-delete-workflow.ts
Signals: React, Next.js

```typescript
import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createLogger } from '@/lib/logs/console/logger'
import { useFolderStore } from '@/stores/folders/store'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

const logger = createLogger('useDeleteWorkflow')

interface UseDeleteWorkflowProps {
  /**
   * Current workspace ID
   */
  workspaceId: string
  /**
   * Function that returns the workflow ID(s) to delete
   * This function is called when deletion occurs to get fresh selection state
   */
  getWorkflowIds: () => string | string[]
  /**
   * Whether the active workflow is being deleted
   * Can be a boolean or a function that receives the workflow IDs
   */
  isActive?: boolean | ((workflowIds: string[]) => boolean)
  /**
   * Optional callback after successful deletion
   */
  onSuccess?: () => void
}

/**
 * Hook for managing workflow deletion with navigation logic.
 *
 * Handles:
 * - Single or bulk workflow deletion
 * - Finding next workflow to navigate to
 * - Navigating before deletion (if active workflow)
 * - Removing workflow(s) from registry
 * - Loading state management
 * - Error handling and logging
 *
 * @param props - Hook configuration
 * @returns Delete workflow handlers and state
 */
export function useDeleteWorkflow({
  workspaceId,
  getWorkflowIds,
  isActive = false,
  onSuccess,
}: UseDeleteWorkflowProps) {
  const router = useRouter()
  const { workflows, removeWorkflow } = useWorkflowRegistry()
  const [isDeleting, setIsDeleting] = useState(false)

  /**
   * Delete the workflow(s) and navigate if needed
   */
  const handleDeleteWorkflow = useCallback(async () => {
    if (isDeleting) {
      return
    }

    setIsDeleting(true)
    try {
      // Get fresh workflow IDs at deletion time
      const workflowIdsOrId = getWorkflowIds()
      if (!workflowIdsOrId) {
        return
      }

      // Normalize to array for consistent handling
      const workflowIdsToDelete = Array.isArray(workflowIdsOrId)
        ? workflowIdsOrId
        : [workflowIdsOrId]

      // Determine if active workflow is being deleted
      const isActiveWorkflowBeingDeleted =
        typeof isActive === 'function' ? isActive(workflowIdsToDelete) : isActive

      // Find next workflow to navigate to (if active workflow is being deleted)
      const sidebarWorkflows = Object.values(workflows).filter((w) => w.workspaceId === workspaceId)

      // Find which specific workflow is the active one (if any in the deletion list)
      let activeWorkflowId: string | null = null
      if (isActiveWorkflowBeingDeleted && typeof isActive === 'function') {
        // Check each workflow being deleted to find which one is active
        activeWorkflowId =
          workflowIdsToDelete.find((id) => isActive([id])) || workflowIdsToDelete[0]
      } else {
        activeWorkflowId = workflowIdsToDelete[0]
      }

      const currentIndex = sidebarWorkflows.findIndex((w) => w.id === activeWorkflowId)

      let nextWorkflowId: string | null = null
      if (isActiveWorkflowBeingDeleted && sidebarWorkflows.length > workflowIdsToDelete.length) {
        // Find the first workflow that's not being deleted
        const remainingWorkflows = sidebarWorkflows.filter(
          (w) => !workflowIdsToDelete.includes(w.id)
        )

        if (remainingWorkflows.length > 0) {
          // Try to find the next workflow after the current one
          const workflowsAfterCurrent = remainingWorkflows.filter((w) => {
            const idx = sidebarWorkflows.findIndex((sw) => sw.id === w.id)
            return idx > currentIndex
          })

          if (workflowsAfterCurrent.length > 0) {
            nextWorkflowId = workflowsAfterCurrent[0].id
          } else {
            // Otherwise, use the first remaining workflow
            nextWorkflowId = remainingWorkflows[0].id
          }
        }
      }

      // Navigate first if this is the active workflow
      if (isActiveWorkflowBeingDeleted) {
        if (nextWorkflowId) {
          router.push(`/workspace/${workspaceId}/w/${nextWorkflowId}`)
        } else {
          router.push(`/workspace/${workspaceId}/w`)
        }
      }

      // Delete all workflows
      await Promise.all(workflowIdsToDelete.map((id) => removeWorkflow(id)))

      // Clear selection after successful deletion
      const { clearSelection } = useFolderStore.getState()
      clearSelection()

      logger.info('Workflow(s) deleted successfully', { workflowIds: workflowIdsToDelete })
      onSuccess?.()
    } catch (error) {
      logger.error('Error deleting workflow(s):', { error })
      throw error
    } finally {
      setIsDeleting(false)
    }
  }, [
    getWorkflowIds,
    isDeleting,
    workflows,
    workspaceId,
    isActive,
    router,
    removeWorkflow,
    onSuccess,
  ])

  return {
    isDeleting,
    handleDeleteWorkflow,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-duplicate-folder.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/hooks/use-duplicate-folder.ts
Signals: React

```typescript
import { useCallback, useState } from 'react'
import { createLogger } from '@/lib/logs/console/logger'
import { useDuplicateFolderMutation } from '@/hooks/queries/folders'
import { useFolderStore } from '@/stores/folders/store'

const logger = createLogger('useDuplicateFolder')

interface UseDuplicateFolderProps {
  workspaceId: string
  getFolderIds: () => string | string[]
  onSuccess?: () => void
}

/**
 * Hook for managing folder duplication.
 *
 * @param props - Hook configuration
 * @returns Duplicate folder handlers and state
 */
export function useDuplicateFolder({
  workspaceId,
  getFolderIds,
  onSuccess,
}: UseDuplicateFolderProps) {
  const duplicateFolderMutation = useDuplicateFolderMutation()
  const [isDuplicating, setIsDuplicating] = useState(false)

  const generateDuplicateName = useCallback((baseName: string, siblingNames: Set<string>) => {
    const trimmedName = (baseName || 'Untitled Folder').trim()
    let candidate = `${trimmedName} Copy`
    let counter = 2

    while (siblingNames.has(candidate)) {
      candidate = `${trimmedName} Copy ${counter}`
      counter += 1
    }

    return candidate
  }, [])

  /**
   * Duplicate the folder(s)
   */
  const handleDuplicateFolder = useCallback(async () => {
    if (isDuplicating) {
      return
    }

    setIsDuplicating(true)
    try {
      // Get fresh folder IDs at duplication time
      const folderIdsOrId = getFolderIds()
      if (!folderIdsOrId) {
        return
      }

      // Normalize to array for consistent handling
      const folderIdsToDuplicate = Array.isArray(folderIdsOrId) ? folderIdsOrId : [folderIdsOrId]

      const duplicatedIds: string[] = []
      const folderStore = useFolderStore.getState()

      // Duplicate each folder sequentially
      for (const folderId of folderIdsToDuplicate) {
        const folder = folderStore.getFolderById(folderId)

        if (!folder) {
          logger.warn('Attempted to duplicate folder that no longer exists', { folderId })
          continue
        }

        const siblingNames = new Set(
          folderStore.getChildFolders(folder.parentId).map((sibling) => sibling.name)
        )
        // Avoid colliding with the original folder name
        siblingNames.add(folder.name)

        const duplicateName = generateDuplicateName(folder.name, siblingNames)

        const result = await duplicateFolderMutation.mutateAsync({
          id: folderId,
          workspaceId,
          name: duplicateName,
          parentId: folder.parentId,
          color: folder.color,
        })
        const newFolderId = result?.id
        if (newFolderId) {
          duplicatedIds.push(newFolderId)
        }
      }

      // Clear selection after successful duplication
      const { clearSelection } = useFolderStore.getState()
      clearSelection()

      logger.info('Folder(s) duplicated successfully', {
        folderIds: folderIdsToDuplicate,
        duplicatedIds,
      })

      onSuccess?.()
    } catch (error) {
      logger.error('Error duplicating folder(s):', { error })
      throw error
    } finally {
      setIsDuplicating(false)
    }
  }, [
    getFolderIds,
    generateDuplicateName,
    isDuplicating,
    duplicateFolderMutation,
    workspaceId,
    onSuccess,
  ])

  return {
    isDuplicating,
    handleDuplicateFolder,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-duplicate-workflow.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/hooks/use-duplicate-workflow.ts
Signals: React, Next.js

```typescript
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createLogger } from '@/lib/logs/console/logger'
import { useDuplicateWorkflowMutation } from '@/hooks/queries/workflows'
import { useFolderStore } from '@/stores/folders/store'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import { getNextWorkflowColor } from '@/stores/workflows/registry/utils'

const logger = createLogger('useDuplicateWorkflow')

interface UseDuplicateWorkflowProps {
  /**
   * Current workspace ID
   */
  workspaceId: string
  /**
   * Function that returns the workflow ID(s) to duplicate
   * This function is called when duplication occurs to get fresh selection state
   */
  getWorkflowIds: () => string | string[]
  /**
   * Optional callback after successful duplication
   */
  onSuccess?: () => void
}

/**
 * Hook for managing workflow duplication with optimistic updates.
 *
 * Handles:
 * - Single or bulk workflow duplication
 * - Optimistic UI updates (shows new workflow immediately)
 * - Automatic rollback on failure
 * - Loading state management
 * - Error handling and logging
 * - Clearing selection after duplication
 * - Navigation to duplicated workflow (single only)
 *
 * @param props - Hook configuration
 * @returns Duplicate workflow handlers and state
 */
export function useDuplicateWorkflow({
  workspaceId,
  getWorkflowIds,
  onSuccess,
}: UseDuplicateWorkflowProps) {
  const router = useRouter()
  const { workflows } = useWorkflowRegistry()
  const duplicateMutation = useDuplicateWorkflowMutation()

  /**
   * Duplicate the workflow(s)
   */
  const handleDuplicateWorkflow = useCallback(async () => {
    if (duplicateMutation.isPending) {
      return
    }

    // Get fresh workflow IDs at duplication time
    const workflowIdsOrId = getWorkflowIds()
    if (!workflowIdsOrId) {
      return
    }

    // Normalize to array for consistent handling
    const workflowIdsToDuplicate = Array.isArray(workflowIdsOrId)
      ? workflowIdsOrId
      : [workflowIdsOrId]

    const duplicatedIds: string[] = []

    try {
      // Duplicate each workflow sequentially
      for (const sourceId of workflowIdsToDuplicate) {
        const sourceWorkflow = workflows[sourceId]
        if (!sourceWorkflow) {
          logger.warn(`Workflow ${sourceId} not found, skipping`)
          continue
        }

        const result = await duplicateMutation.mutateAsync({
          workspaceId,
          sourceId,
          name: `${sourceWorkflow.name} (Copy)`,
          description: sourceWorkflow.description,
          color: getNextWorkflowColor(),
          folderId: sourceWorkflow.folderId,
        })

        duplicatedIds.push(result.id)
      }

      // Clear selection after successful duplication
      const { clearSelection } = useFolderStore.getState()
      clearSelection()

      logger.info('Workflow(s) duplicated successfully', {
        workflowIds: workflowIdsToDuplicate,
        duplicatedIds,
      })

      // Navigate to duplicated workflow if single duplication
      if (duplicatedIds.length === 1) {
        router.push(`/workspace/${workspaceId}/w/${duplicatedIds[0]}`)
      }

      onSuccess?.()
    } catch (error) {
      logger.error('Error duplicating workflow(s):', { error })
      throw error
    }
  }, [getWorkflowIds, duplicateMutation, workflows, workspaceId, router, onSuccess])

  return {
    isDuplicating: duplicateMutation.isPending,
    handleDuplicateWorkflow,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-duplicate-workspace.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/hooks/use-duplicate-workspace.ts
Signals: React, Next.js

```typescript
import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('useDuplicateWorkspace')

interface UseDuplicateWorkspaceProps {
  /**
   * Function that returns the workspace ID to duplicate
   * This function is called when duplication occurs to get fresh state
   */
  getWorkspaceId: () => string | null
  /**
   * Optional callback after successful duplication
   */
  onSuccess?: () => void
}

/**
 * Hook for managing workspace duplication.
 *
 * Handles:
 * - Workspace duplication
 * - Calling duplicate API
 * - Loading state management
 * - Error handling and logging
 * - Navigation to duplicated workspace
 *
 * @param props - Hook configuration
 * @returns Duplicate workspace handlers and state
 */
export function useDuplicateWorkspace({ getWorkspaceId, onSuccess }: UseDuplicateWorkspaceProps) {
  const router = useRouter()
  const [isDuplicating, setIsDuplicating] = useState(false)

  /**
   * Duplicate the workspace
   */
  const handleDuplicateWorkspace = useCallback(
    async (workspaceName: string) => {
      if (isDuplicating) {
        return
      }

      setIsDuplicating(true)
      try {
        // Get fresh workspace ID at duplication time
        const workspaceId = getWorkspaceId()
        if (!workspaceId) {
          return
        }

        const response = await fetch(`/api/workspaces/${workspaceId}/duplicate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `${workspaceName} (Copy)`,
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to duplicate workspace: ${response.statusText}`)
        }

        const duplicatedWorkspace = await response.json()

        logger.info('Workspace duplicated successfully', {
          sourceWorkspaceId: workspaceId,
          newWorkspaceId: duplicatedWorkspace.id,
          workflowsCount: duplicatedWorkspace.workflowsCount,
        })

        // Navigate to duplicated workspace
        router.push(`/workspace/${duplicatedWorkspace.id}/w`)

        onSuccess?.()

        return duplicatedWorkspace.id
      } catch (error) {
        logger.error('Error duplicating workspace:', { error })
        throw error
      } finally {
        setIsDuplicating(false)
      }
    },
    [getWorkspaceId, isDuplicating, router, onSuccess]
  )

  return {
    isDuplicating,
    handleDuplicateWorkspace,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-export-workflow.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/hooks/use-export-workflow.ts
Signals: React

```typescript
import { useCallback, useState } from 'react'
import JSZip from 'jszip'
import { createLogger } from '@/lib/logs/console/logger'
import { sanitizeForExport } from '@/lib/workflows/sanitization/json-sanitizer'
import { useFolderStore } from '@/stores/folders/store'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

const logger = createLogger('useExportWorkflow')

interface UseExportWorkflowProps {
  /**
   * Current workspace ID
   */
  workspaceId: string
  /**
   * Function that returns the workflow ID(s) to export
   * This function is called when export occurs to get fresh selection state
   */
  getWorkflowIds: () => string | string[]
  /**
   * Optional callback after successful export
   */
  onSuccess?: () => void
}

/**
 * Hook for managing workflow export to JSON.
 *
 * Handles:
 * - Single or bulk workflow export
 * - Fetching workflow data and variables from API
 * - Sanitizing workflow state for export
 * - Downloading as JSON file(s)
 * - Loading state management
 * - Error handling and logging
 * - Clearing selection after export
 *
 * @param props - Hook configuration
 * @returns Export workflow handlers and state
 */
export function useExportWorkflow({
  workspaceId,
  getWorkflowIds,
  onSuccess,
}: UseExportWorkflowProps) {
  const { workflows } = useWorkflowRegistry()
  const [isExporting, setIsExporting] = useState(false)

  /**
   * Download file helper
   */
  const downloadFile = (
    content: Blob | string,
    filename: string,
    mimeType = 'application/json'
  ) => {
    try {
      const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      logger.error('Failed to download file:', error)
    }
  }

  /**
   * Export the workflow(s) to JSON or ZIP
   * - Single workflow: exports as JSON file
   * - Multiple workflows: exports as ZIP file containing all JSON files
   * Fetches workflow data from API to support bulk export of non-active workflows
   */
  const handleExportWorkflow = useCallback(async () => {
    if (isExporting) {
      return
    }

    setIsExporting(true)
    try {
      // Get fresh workflow IDs at export time
      const workflowIdsOrId = getWorkflowIds()
      if (!workflowIdsOrId) {
        return
      }

      // Normalize to array for consistent handling
      const workflowIdsToExport = Array.isArray(workflowIdsOrId)
        ? workflowIdsOrId
        : [workflowIdsOrId]

      logger.info('Starting workflow export', {
        workflowIdsToExport,
        count: workflowIdsToExport.length,
      })

      const exportedWorkflows: Array<{ name: string; content: string }> = []

      // Export each workflow
      for (const workflowId of workflowIdsToExport) {
        try {
          const workflow = workflows[workflowId]
          if (!workflow) {
            logger.warn(`Workflow ${workflowId} not found in registry`)
            continue
          }

          // Fetch workflow state from API
          const workflowResponse = await fetch(`/api/workflows/${workflowId}`)
          if (!workflowResponse.ok) {
            logger.error(`Failed to fetch workflow ${workflowId}`)
            continue
          }

          const { data: workflowData } = await workflowResponse.json()
          if (!workflowData?.state) {
            logger.warn(`Workflow ${workflowId} has no state`)
            continue
          }

          // Fetch workflow variables
          const variablesResponse = await fetch(`/api/workflows/${workflowId}/variables`)
          let workflowVariables: any[] = []
          if (variablesResponse.ok) {
            const variablesData = await variablesResponse.json()
            workflowVariables = Object.values(variablesData?.data || {}).map((v: any) => ({
              id: v.id,
              name: v.name,
              type: v.type,
              value: v.value,
            }))
          }

          // Prepare export state
          const workflowState = {
            ...workflowData.state,
            metadata: {
              name: workflow.name,
              description: workflow.description,
              color: workflow.color,
              exportedAt: new Date().toISOString(),
            },
            variables: workflowVariables,
          }

          const exportState = sanitizeForExport(workflowState)
          const jsonString = JSON.stringify(exportState, null, 2)

          exportedWorkflows.push({
            name: workflow.name,
            content: jsonString,
          })

          logger.info(`Workflow ${workflowId} exported successfully`)
        } catch (error) {
          logger.error(`Failed to export workflow ${workflowId}:`, error)
        }
      }

      if (exportedWorkflows.length === 0) {
        logger.warn('No workflows were successfully exported')
        return
      }

      // Download as single JSON or ZIP depending on count
      if (exportedWorkflows.length === 1) {
        // Single workflow - download as JSON
        const filename = `${exportedWorkflows[0].name.replace(/[^a-z0-9]/gi, '-')}.json`
        downloadFile(exportedWorkflows[0].content, filename, 'application/json')
      } else {
        // Multiple workflows - download as ZIP
        const zip = new JSZip()

        for (const exportedWorkflow of exportedWorkflows) {
          const filename = `${exportedWorkflow.name.replace(/[^a-z0-9]/gi, '-')}.json`
          zip.file(filename, exportedWorkflow.content)
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' })
        const zipFilename = `workflows-export-${Date.now()}.zip`
        downloadFile(zipBlob, zipFilename, 'application/zip')
      }

      // Clear selection after successful export
      const { clearSelection } = useFolderStore.getState()
      clearSelection()

      logger.info('Workflow(s) exported successfully', {
        workflowIds: workflowIdsToExport,
        count: exportedWorkflows.length,
        format: exportedWorkflows.length === 1 ? 'JSON' : 'ZIP',
      })

      onSuccess?.()
    } catch (error) {
      logger.error('Error exporting workflow(s):', { error })
      throw error
    } finally {
      setIsExporting(false)
    }
  }, [getWorkflowIds, isExporting, workflows, onSuccess])

  return {
    isExporting,
    handleExportWorkflow,
  }
}
```

--------------------------------------------------------------------------------

````
