---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 382
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 382 of 933)

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

---[FILE: folder-item.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/workflow-list/components/folder-item/folder-item.tsx
Signals: React, Next.js

```typescript
'use client'

import { useCallback, useState } from 'react'
import clsx from 'clsx'
import { ChevronRight, Folder, FolderOpen } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { createLogger } from '@/lib/logs/console/logger'
import { useUserPermissionsContext } from '@/app/workspace/[workspaceId]/providers/workspace-permissions-provider'
import { ContextMenu } from '@/app/workspace/[workspaceId]/w/components/sidebar/components/workflow-list/components/context-menu/context-menu'
import { DeleteModal } from '@/app/workspace/[workspaceId]/w/components/sidebar/components/workflow-list/components/delete-modal/delete-modal'
import {
  useContextMenu,
  useFolderExpand,
  useItemDrag,
  useItemRename,
} from '@/app/workspace/[workspaceId]/w/components/sidebar/hooks'
import { SIDEBAR_SCROLL_EVENT } from '@/app/workspace/[workspaceId]/w/components/sidebar/sidebar'
import { useDeleteFolder, useDuplicateFolder } from '@/app/workspace/[workspaceId]/w/hooks'
import { useCreateFolder, useUpdateFolder } from '@/hooks/queries/folders'
import { useCreateWorkflow } from '@/hooks/queries/workflows'
import type { FolderTreeNode } from '@/stores/folders/store'
import {
  generateCreativeWorkflowName,
  getNextWorkflowColor,
} from '@/stores/workflows/registry/utils'

const logger = createLogger('FolderItem')

interface FolderItemProps {
  folder: FolderTreeNode
  level: number
  hoverHandlers?: {
    onDragEnter?: (e: React.DragEvent<HTMLElement>) => void
    onDragLeave?: (e: React.DragEvent<HTMLElement>) => void
  }
}

/**
 * FolderItem component displaying a single folder with drag and expand/collapse support.
 * Uses item drag and folder expand hooks for unified behavior.
 * Supports hover-to-expand during drag operations via hoverHandlers.
 *
 * @param props - Component props
 * @returns Folder item with drag and expand support
 */
export function FolderItem({ folder, level, hoverHandlers }: FolderItemProps) {
  const params = useParams()
  const router = useRouter()
  const workspaceId = params.workspaceId as string
  const updateFolderMutation = useUpdateFolder()
  const createWorkflowMutation = useCreateWorkflow()
  const createFolderMutation = useCreateFolder()
  const userPermissions = useUserPermissionsContext()

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Delete folder hook
  const { isDeleting, handleDeleteFolder } = useDeleteFolder({
    workspaceId,
    getFolderIds: () => folder.id,
    onSuccess: () => setIsDeleteModalOpen(false),
  })

  // Duplicate folder hook
  const { handleDuplicateFolder } = useDuplicateFolder({
    workspaceId,
    getFolderIds: () => folder.id,
  })

  /**
   * Handle create workflow in folder using React Query mutation.
   * Generates name and color upfront for optimistic UI updates.
   * The UI disables the trigger when isPending, so no guard needed here.
   */
  const handleCreateWorkflowInFolder = useCallback(async () => {
    try {
      // Generate name and color upfront for optimistic updates
      const name = generateCreativeWorkflowName()
      const color = getNextWorkflowColor()

      const result = await createWorkflowMutation.mutateAsync({
        workspaceId,
        folderId: folder.id,
        name,
        color,
      })

      if (result.id) {
        router.push(`/workspace/${workspaceId}/w/${result.id}`)
        // Scroll to the newly created workflow
        window.dispatchEvent(
          new CustomEvent(SIDEBAR_SCROLL_EVENT, { detail: { itemId: result.id } })
        )
      }
    } catch (error) {
      // Error already handled by mutation's onError callback
      logger.error('Failed to create workflow in folder:', error)
    }
  }, [createWorkflowMutation, workspaceId, folder.id, router])

  /**
   * Handle create sub-folder using React Query mutation.
   * Creates a new folder inside the current folder.
   */
  const handleCreateFolderInFolder = useCallback(async () => {
    try {
      const result = await createFolderMutation.mutateAsync({
        workspaceId,
        name: 'New Folder',
        parentId: folder.id,
      })
      if (result.id) {
        // Scroll to the newly created folder
        window.dispatchEvent(
          new CustomEvent(SIDEBAR_SCROLL_EVENT, { detail: { itemId: result.id } })
        )
      }
    } catch (error) {
      logger.error('Failed to create folder:', error)
    }
  }, [createFolderMutation, workspaceId, folder.id])

  // Folder expand hook
  const {
    isExpanded,
    handleToggleExpanded,
    handleKeyDown: handleExpandKeyDown,
  } = useFolderExpand({
    folderId: folder.id,
  })

  /**
   * Drag start handler - sets folder data for drag operation
   *
   * @param e - React drag event
   */
  const onDragStart = useCallback(
    (e: React.DragEvent) => {
      // Don't start drag if editing
      if (isEditing) {
        e.preventDefault()
        return
      }

      e.dataTransfer.setData('folder-id', folder.id)
      e.dataTransfer.effectAllowed = 'move'
    },
    [folder.id]
  )

  // Item drag hook
  const { isDragging, shouldPreventClickRef, handleDragStart, handleDragEnd } = useItemDrag({
    onDragStart,
  })

  // Context menu hook
  const {
    isOpen: isContextMenuOpen,
    position,
    menuRef,
    handleContextMenu,
    closeMenu,
  } = useContextMenu()

  // Rename hook
  const {
    isEditing,
    editValue,
    isRenaming,
    inputRef,
    setEditValue,
    handleStartEdit,
    handleKeyDown: handleRenameKeyDown,
    handleInputBlur,
  } = useItemRename({
    initialName: folder.name,
    onSave: async (newName) => {
      await updateFolderMutation.mutateAsync({
        workspaceId,
        id: folder.id,
        updates: { name: newName },
      })
    },
    itemType: 'folder',
    itemId: folder.id,
  })

  /**
   * Handle double-click on folder name to enter rename mode
   */
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      handleStartEdit()
    },
    [handleStartEdit]
  )

  /**
   * Handle click - toggles folder expansion
   *
   * @param e - React mouse event
   */
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()

      if (shouldPreventClickRef.current || isEditing) {
        e.preventDefault()
        return
      }
      handleToggleExpanded()
    },
    [handleToggleExpanded, shouldPreventClickRef, isEditing]
  )

  /**
   * Combined keyboard handler for both expand and rename
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (isEditing) {
        handleRenameKeyDown(e)
      } else {
        handleExpandKeyDown(e)
      }
    },
    [isEditing, handleRenameKeyDown, handleExpandKeyDown]
  )

  return (
    <>
      <div
        role='button'
        tabIndex={0}
        data-item-id={folder.id}
        aria-expanded={isExpanded}
        aria-label={`${folder.name} folder, ${isExpanded ? 'expanded' : 'collapsed'}`}
        className={clsx(
          'flex h-[25px] cursor-pointer items-center rounded-[8px] text-[14px]',
          isDragging ? 'opacity-50' : ''
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onContextMenu={handleContextMenu}
        draggable={!isEditing}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        {...hoverHandlers}
      >
        <ChevronRight
          className={clsx(
            'mr-[8px] h-[10px] w-[10px] flex-shrink-0 text-[var(--text-muted)] transition-all',
            isExpanded ? 'rotate-90' : ''
          )}
          aria-hidden='true'
        />
        {isExpanded ? (
          <FolderOpen
            className='mr-[10px] h-[16px] w-[16px] flex-shrink-0 text-[var(--text-muted)]'
            aria-hidden='true'
          />
        ) : (
          <Folder
            className='mr-[10px] h-[16px] w-[16px] flex-shrink-0 text-[var(--text-muted)]'
            aria-hidden='true'
          />
        )}
        {isEditing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleRenameKeyDown}
            onBlur={handleInputBlur}
            className={clsx(
              'min-w-0 flex-1 border-0 bg-transparent p-0 font-medium text-[14px] text-[var(--text-tertiary)] outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
            )}
            maxLength={50}
            disabled={isRenaming}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck='false'
          />
        ) : (
          <span
            className='truncate font-medium text-[var(--text-tertiary)]'
            onDoubleClick={handleDoubleClick}
          >
            {folder.name}
          </span>
        )}
      </div>

      {/* Context Menu */}
      <ContextMenu
        isOpen={isContextMenuOpen}
        position={position}
        menuRef={menuRef}
        onClose={closeMenu}
        onRename={handleStartEdit}
        onCreate={handleCreateWorkflowInFolder}
        onCreateFolder={handleCreateFolderInFolder}
        onDuplicate={handleDuplicateFolder}
        onDelete={() => setIsDeleteModalOpen(true)}
        showCreate={true}
        showCreateFolder={true}
        disableRename={!userPermissions.canEdit}
        disableCreate={!userPermissions.canEdit || createWorkflowMutation.isPending}
        disableCreateFolder={!userPermissions.canEdit || createFolderMutation.isPending}
        disableDuplicate={!userPermissions.canEdit}
        disableDelete={!userPermissions.canEdit}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteFolder}
        isDeleting={isDeleting}
        itemType='folder'
        itemName={folder.name}
      />
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: workflow-item.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/workflow-list/components/workflow-item/workflow-item.tsx
Signals: React, Next.js

```typescript
'use client'

import { useCallback, useRef, useState } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useUserPermissionsContext } from '@/app/workspace/[workspaceId]/providers/workspace-permissions-provider'
import { ContextMenu } from '@/app/workspace/[workspaceId]/w/components/sidebar/components/workflow-list/components/context-menu/context-menu'
import { DeleteModal } from '@/app/workspace/[workspaceId]/w/components/sidebar/components/workflow-list/components/delete-modal/delete-modal'
import { Avatars } from '@/app/workspace/[workspaceId]/w/components/sidebar/components/workflow-list/components/workflow-item/avatars/avatars'
import {
  useContextMenu,
  useItemDrag,
  useItemRename,
} from '@/app/workspace/[workspaceId]/w/components/sidebar/hooks'
import {
  useDeleteWorkflow,
  useDuplicateWorkflow,
  useExportWorkflow,
} from '@/app/workspace/[workspaceId]/w/hooks'
import { useFolderStore } from '@/stores/folders/store'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import type { WorkflowMetadata } from '@/stores/workflows/registry/types'

interface WorkflowItemProps {
  workflow: WorkflowMetadata
  active: boolean
  level: number
  onWorkflowClick: (workflowId: string, shiftKey: boolean, metaKey: boolean) => void
}

/**
 * WorkflowItem component displaying a single workflow with drag and selection support.
 * Uses the item drag hook for unified drag behavior.
 *
 * @param props - Component props
 * @returns Workflow item with drag and selection support
 */
export function WorkflowItem({ workflow, active, level, onWorkflowClick }: WorkflowItemProps) {
  const params = useParams()
  const workspaceId = params.workspaceId as string
  const { selectedWorkflows } = useFolderStore()
  const { updateWorkflow, workflows } = useWorkflowRegistry()
  const userPermissions = useUserPermissionsContext()
  const isSelected = selectedWorkflows.has(workflow.id)

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [workflowIdsToDelete, setWorkflowIdsToDelete] = useState<string[]>([])
  const [deleteModalNames, setDeleteModalNames] = useState<string | string[]>('')

  // Presence avatars state
  const [hasAvatars, setHasAvatars] = useState(false)

  // Capture selection at right-click time (using ref to persist across renders)
  const capturedSelectionRef = useRef<{
    workflowIds: string[]
    workflowNames: string | string[]
  } | null>(null)

  /**
   * Handle opening the delete modal - uses pre-captured selection state
   */
  const handleOpenDeleteModal = useCallback(() => {
    // Use the selection captured at right-click time
    if (capturedSelectionRef.current) {
      setWorkflowIdsToDelete(capturedSelectionRef.current.workflowIds)
      setDeleteModalNames(capturedSelectionRef.current.workflowNames)
      setIsDeleteModalOpen(true)
    }
  }, [])

  // Delete workflow hook
  const { isDeleting, handleDeleteWorkflow } = useDeleteWorkflow({
    workspaceId,
    getWorkflowIds: () => workflowIdsToDelete,
    isActive: (workflowIds) => workflowIds.includes(params.workflowId as string),
    onSuccess: () => setIsDeleteModalOpen(false),
  })

  // Duplicate workflow hook
  const { handleDuplicateWorkflow } = useDuplicateWorkflow({
    workspaceId,
    getWorkflowIds: () => {
      // Use the selection captured at right-click time
      return capturedSelectionRef.current?.workflowIds || []
    },
  })

  // Export workflow hook
  const { handleExportWorkflow } = useExportWorkflow({
    workspaceId,
    getWorkflowIds: () => {
      // Use the selection captured at right-click time
      return capturedSelectionRef.current?.workflowIds || []
    },
  })

  /**
   * Opens the workflow in a new browser tab
   */
  const handleOpenInNewTab = useCallback(() => {
    window.open(`/workspace/${workspaceId}/w/${workflow.id}`, '_blank')
  }, [workspaceId, workflow.id])

  /**
   * Drag start handler - handles workflow dragging with multi-selection support
   *
   * @param e - React drag event
   */
  const onDragStart = useCallback(
    (e: React.DragEvent) => {
      // Don't start drag if editing
      if (isEditing) {
        e.preventDefault()
        return
      }

      const workflowIds =
        isSelected && selectedWorkflows.size > 1 ? Array.from(selectedWorkflows) : [workflow.id]

      e.dataTransfer.setData('workflow-ids', JSON.stringify(workflowIds))
      e.dataTransfer.effectAllowed = 'move'
    },
    [isSelected, selectedWorkflows, workflow.id]
  )

  // Item drag hook
  const { isDragging, shouldPreventClickRef, handleDragStart, handleDragEnd } = useItemDrag({
    onDragStart,
  })

  // Context menu hook
  const {
    isOpen: isContextMenuOpen,
    position,
    menuRef,
    handleContextMenu: handleContextMenuBase,
    closeMenu,
  } = useContextMenu()

  /**
   * Handle right-click - ensure proper selection behavior and capture selection state
   * If right-clicking on an unselected workflow, select only that workflow
   * If right-clicking on a selected workflow with multiple selections, keep all selections
   */
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      // Check current selection state at time of right-click
      const { selectedWorkflows: currentSelection, selectOnly } = useFolderStore.getState()
      const isCurrentlySelected = currentSelection.has(workflow.id)

      // If this workflow is not in the current selection, select only this workflow
      if (!isCurrentlySelected) {
        selectOnly(workflow.id)
      }

      // Capture the selection state at right-click time
      const finalSelection = useFolderStore.getState().selectedWorkflows
      const finalIsSelected = finalSelection.has(workflow.id)

      const workflowIds =
        finalIsSelected && finalSelection.size > 1 ? Array.from(finalSelection) : [workflow.id]

      const workflowNames = workflowIds
        .map((id) => workflows[id]?.name)
        .filter((name): name is string => !!name)

      // Store in ref so it persists even if selection changes
      capturedSelectionRef.current = {
        workflowIds,
        workflowNames: workflowNames.length > 1 ? workflowNames : workflowNames[0],
      }

      // If already selected with multiple selections, keep all selections
      handleContextMenuBase(e)
    },
    [workflow.id, workflows, handleContextMenuBase]
  )

  // Rename hook
  const {
    isEditing,
    editValue,
    isRenaming,
    inputRef,
    setEditValue,
    handleStartEdit,
    handleKeyDown,
    handleInputBlur,
  } = useItemRename({
    initialName: workflow.name,
    onSave: async (newName) => {
      await updateWorkflow(workflow.id, { name: newName })
    },
    itemType: 'workflow',
    itemId: workflow.id,
  })

  /**
   * Handle double-click on workflow name to enter rename mode
   */
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      handleStartEdit()
    },
    [handleStartEdit]
  )

  /**
   * Handle click - manages workflow selection with shift-key and cmd/ctrl-key support
   *
   * @param e - React mouse event
   */
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.stopPropagation()

      if (shouldPreventClickRef.current || isEditing) {
        e.preventDefault()
        return
      }

      const isModifierClick = e.shiftKey || e.metaKey || e.ctrlKey

      // Prevent default link behavior when using modifier keys
      if (isModifierClick) {
        e.preventDefault()
      }

      // Use metaKey (Cmd on Mac) or ctrlKey (Ctrl on Windows/Linux)
      onWorkflowClick(workflow.id, e.shiftKey, e.metaKey || e.ctrlKey)
    },
    [shouldPreventClickRef, workflow.id, onWorkflowClick, isEditing]
  )

  return (
    <>
      <Link
        href={`/workspace/${workspaceId}/w/${workflow.id}`}
        data-item-id={workflow.id}
        className={clsx(
          'group flex h-[25px] items-center gap-[8px] rounded-[8px] px-[5.5px] text-[14px]',
          active ? 'bg-[var(--surface-9)]' : 'hover:bg-[var(--surface-9)]',
          isSelected && selectedWorkflows.size > 1 && !active ? 'bg-[var(--surface-9)]' : '',
          isDragging ? 'opacity-50' : ''
        )}
        draggable={!isEditing}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <div
          className='h-[14px] w-[14px] flex-shrink-0 rounded-[4px]'
          style={{ backgroundColor: workflow.color }}
        />
        <div className={clsx('min-w-0 flex-1', hasAvatars && 'pr-[8px]')}>
          {isEditing ? (
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleInputBlur}
              className={clsx(
                'w-full border-0 bg-transparent p-0 font-medium text-[14px] outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
                active
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]'
              )}
              maxLength={100}
              disabled={isRenaming}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              autoComplete='off'
              autoCorrect='off'
              autoCapitalize='off'
              spellCheck='false'
            />
          ) : (
            <div
              className={clsx(
                'truncate font-medium',
                active
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]'
              )}
              onDoubleClick={handleDoubleClick}
            >
              {workflow.name}
            </div>
          )}
        </div>
        {!isEditing && (
          <Avatars workflowId={workflow.id} maxVisible={3} onPresenceChange={setHasAvatars} />
        )}
      </Link>

      {/* Context Menu */}
      <ContextMenu
        isOpen={isContextMenuOpen}
        position={position}
        menuRef={menuRef}
        onClose={closeMenu}
        onOpenInNewTab={handleOpenInNewTab}
        onRename={handleStartEdit}
        onDuplicate={handleDuplicateWorkflow}
        onExport={handleExportWorkflow}
        onDelete={handleOpenDeleteModal}
        showOpenInNewTab={selectedWorkflows.size <= 1}
        showRename={selectedWorkflows.size <= 1}
        showDuplicate={true}
        showExport={true}
        disableRename={!userPermissions.canEdit}
        disableDuplicate={!userPermissions.canEdit}
        disableExport={!userPermissions.canEdit}
        disableDelete={!userPermissions.canEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteWorkflow}
        isDeleting={isDeleting}
        itemType='workflow'
        itemName={deleteModalNames}
      />
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: avatars.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/workflow-list/components/workflow-item/avatars/avatars.tsx
Signals: React, Next.js

```typescript
'use client'

import { type CSSProperties, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Tooltip } from '@/components/emcn'
import { useSession } from '@/lib/auth/auth-client'
import { getUserColor } from '@/app/workspace/[workspaceId]/w/utils/get-user-color'
import { useSocket } from '@/app/workspace/providers/socket-provider'

interface AvatarsProps {
  workflowId: string
  maxVisible?: number
  /**
   * Callback fired when the presence visibility changes.
   * Used by parent components to adjust layout (e.g., text truncation spacing).
   */
  onPresenceChange?: (hasAvatars: boolean) => void
}

interface PresenceUser {
  socketId: string
  userId: string
  userName?: string
  avatarUrl?: string | null
}

interface UserAvatarProps {
  user: PresenceUser
  index: number
}

/**
 * Individual user avatar with error handling for image loading.
 * Falls back to colored circle with initials if image fails to load.
 */
function UserAvatar({ user, index }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false)
  const color = getUserColor(user.userId)
  const initials = user.userName ? user.userName.charAt(0).toUpperCase() : '?'
  const hasAvatar = Boolean(user.avatarUrl) && !imageError

  // Reset error state when avatar URL changes
  useEffect(() => {
    setImageError(false)
  }, [user.avatarUrl])

  const avatarElement = (
    <div
      className='relative flex h-[14px] w-[14px] flex-shrink-0 cursor-default items-center justify-center overflow-hidden rounded-full font-semibold text-[7px] text-white'
      style={
        {
          background: hasAvatar ? undefined : color,
          zIndex: 10 - index,
        } as CSSProperties
      }
    >
      {hasAvatar && user.avatarUrl ? (
        <Image
          src={user.avatarUrl}
          alt={user.userName ? `${user.userName}'s avatar` : 'User avatar'}
          fill
          sizes='14px'
          className='object-cover'
          referrerPolicy='no-referrer'
          unoptimized
          onError={() => setImageError(true)}
        />
      ) : (
        initials
      )}
    </div>
  )

  if (user.userName) {
    return (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{avatarElement}</Tooltip.Trigger>
        <Tooltip.Content side='bottom'>
          <span>{user.userName}</span>
        </Tooltip.Content>
      </Tooltip.Root>
    )
  }

  return avatarElement
}

/**
 * Displays user avatars for presence in a workflow item.
 * Only shows avatars for the currently active workflow.
 *
 * @param props - Component props
 * @returns Avatar stack for workflow presence
 */
export function Avatars({ workflowId, maxVisible = 3, onPresenceChange }: AvatarsProps) {
  const { presenceUsers, currentWorkflowId } = useSocket()
  const { data: session } = useSession()
  const currentUserId = session?.user?.id

  /**
   * Only show presence for the currently active workflow
   * Filter out the current user from the list
   */
  const workflowUsers = useMemo(() => {
    if (currentWorkflowId !== workflowId) {
      return []
    }
    return presenceUsers.filter((user) => user.userId !== currentUserId)
  }, [presenceUsers, currentWorkflowId, workflowId, currentUserId])

  /**
   * Calculate visible users and overflow count
   */
  const { visibleUsers, overflowCount } = useMemo(() => {
    if (workflowUsers.length === 0) {
      return { visibleUsers: [], overflowCount: 0 }
    }

    const visible = workflowUsers.slice(0, maxVisible)
    const overflow = Math.max(0, workflowUsers.length - maxVisible)

    return { visibleUsers: visible, overflowCount: overflow }
  }, [workflowUsers, maxVisible])

  // Notify parent when avatars are present or not
  useEffect(() => {
    const hasAnyAvatars = visibleUsers.length > 0
    if (typeof onPresenceChange === 'function') {
      onPresenceChange(hasAnyAvatars)
    }
  }, [visibleUsers, onPresenceChange])

  if (visibleUsers.length === 0) {
    return null
  }

  return (
    <div className='-space-x-1 ml-[-8px] flex items-center'>
      {visibleUsers.map((user, index) => (
        <UserAvatar key={user.socketId} user={user} index={index} />
      ))}

      {overflowCount > 0 && (
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div
              className='relative flex h-[14px] w-[14px] flex-shrink-0 cursor-default items-center justify-center overflow-hidden rounded-full bg-[#404040] font-semibold text-[7px] text-white'
              style={{ zIndex: 10 - visibleUsers.length } as CSSProperties}
            >
              +{overflowCount}
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content side='bottom'>
            {overflowCount} more user{overflowCount > 1 ? 's' : ''}
          </Tooltip.Content>
        </Tooltip.Root>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/workspace-header/index.ts

```typescript
export { WorkspaceHeader } from './workspace-header'
```

--------------------------------------------------------------------------------

````
