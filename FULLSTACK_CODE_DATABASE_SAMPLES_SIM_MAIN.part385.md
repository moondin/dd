---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 385
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 385 of 933)

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

---[FILE: permissions-table.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/workspace-header/components/invite-modal/components/permissions-table.tsx
Signals: React

```typescript
import { useEffect, useMemo, useState } from 'react'
import { Loader2, RotateCw, X } from 'lucide-react'
import { Badge, Button, Tooltip } from '@/components/emcn'
import { useSession } from '@/lib/auth/auth-client'
import type { PermissionType } from '@/lib/workspaces/permissions/utils'
import { useUserPermissionsContext } from '@/app/workspace/[workspaceId]/providers/workspace-permissions-provider'
import type { WorkspacePermissions } from '@/hooks/use-workspace-permissions'
import { PermissionSelector } from './permission-selector'
import { PermissionsTableSkeleton } from './permissions-table-skeleton'
import type { UserPermissions } from './types'

export interface PermissionsTableProps {
  userPermissions: UserPermissions[]
  onPermissionChange: (userId: string, permissionType: PermissionType) => void
  onRemoveMember?: (userId: string, email: string) => void
  onRemoveInvitation?: (invitationId: string, email: string) => void
  onResendInvitation?: (invitationId: string, email: string) => void
  disabled?: boolean
  existingUserPermissionChanges: Record<string, Partial<UserPermissions>>
  isSaving?: boolean
  workspacePermissions: WorkspacePermissions | null
  permissionsLoading: boolean
  pendingInvitations: UserPermissions[]
  isPendingInvitationsLoading: boolean
  resendingInvitationIds?: Record<string, boolean>
  resentInvitationIds?: Record<string, boolean>
  resendCooldowns?: Record<string, number>
}

export const PermissionsTable = ({
  userPermissions,
  onPermissionChange,
  onRemoveMember,
  onRemoveInvitation,
  disabled,
  existingUserPermissionChanges,
  isSaving,
  workspacePermissions,
  permissionsLoading,
  pendingInvitations,
  isPendingInvitationsLoading,
  onResendInvitation,
  resendingInvitationIds,
  resentInvitationIds,
  resendCooldowns,
}: PermissionsTableProps) => {
  const { data: session } = useSession()
  const userPerms = useUserPermissionsContext()
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)

  useEffect(() => {
    if (!permissionsLoading && !userPerms.isLoading && !isPendingInvitationsLoading) {
      setHasLoadedOnce(true)
    }
  }, [permissionsLoading, userPerms.isLoading, isPendingInvitationsLoading])

  const existingUsers: UserPermissions[] = useMemo(
    () =>
      workspacePermissions?.users?.map((user) => {
        const changes = existingUserPermissionChanges[user.userId] || {}
        const permissionType = user.permissionType || 'read'

        return {
          userId: user.userId,
          email: user.email,
          permissionType:
            changes.permissionType !== undefined ? changes.permissionType : permissionType,
          isCurrentUser: user.email === session?.user?.email,
        }
      }) || [],
    [workspacePermissions?.users, existingUserPermissionChanges, session?.user?.email]
  )

  const currentUser: UserPermissions | null = useMemo(
    () =>
      session?.user?.email
        ? existingUsers.find((user) => user.isCurrentUser) || {
            email: session.user.email,
            permissionType: 'admin',
            isCurrentUser: true,
          }
        : null,
    [session?.user?.email, existingUsers]
  )

  const filteredExistingUsers = useMemo(
    () => existingUsers.filter((user) => !user.isCurrentUser),
    [existingUsers]
  )

  const allUsers: UserPermissions[] = useMemo(() => {
    const existingUserEmails = new Set([
      ...(currentUser ? [currentUser.email] : []),
      ...filteredExistingUsers.map((user) => user.email),
    ])

    const filteredPendingInvitations = pendingInvitations.filter(
      (invitation) => !existingUserEmails.has(invitation.email)
    )

    return [
      ...(currentUser ? [currentUser] : []),
      ...filteredExistingUsers,
      ...userPermissions,
      ...filteredPendingInvitations,
    ]
  }, [currentUser, filteredExistingUsers, userPermissions, pendingInvitations])

  const shouldShowSkeleton =
    !hasLoadedOnce && (permissionsLoading || userPerms.isLoading || isPendingInvitationsLoading)

  if (shouldShowSkeleton) {
    return <PermissionsTableSkeleton />
  }

  if (userPermissions.length === 0 && !session?.user?.email && !workspacePermissions?.users?.length)
    return null

  if (isSaving) {
    return (
      <div className='space-y-[12px]'>
        <h3 className='font-medium text-[14px] text-[var(--text-primary)]'>Member Permissions</h3>
        <div className='rounded-[8px] border border-[var(--surface-11)] bg-[var(--surface-3)]'>
          <div className='flex items-center justify-center py-[48px]'>
            <div className='flex items-center gap-[8px] text-[var(--text-secondary)]'>
              <Loader2 className='h-[16px] w-[16px] animate-spin' />
              <span className='font-medium text-[13px]'>Saving permission changes...</span>
            </div>
          </div>
        </div>
        <p className='flex min-h-[2rem] items-start text-[12px] text-[var(--text-tertiary)]'>
          Please wait while we update the permissions.
        </p>
      </div>
    )
  }

  const currentUserIsAdmin = userPerms.canAdmin

  return (
    <div className='scrollbar-hide max-h-[300px] overflow-y-auto'>
      {allUsers.length > 0 && (
        <div>
          {allUsers.map((user) => {
            const isCurrentUser = user.isCurrentUser === true
            const isExistingUser = filteredExistingUsers.some((eu) => eu.email === user.email)
            const isPendingInvitation = user.isPendingInvitation === true
            const userIdentifier = user.userId || user.email
            const originalPermission = workspacePermissions?.users?.find(
              (eu) => eu.userId === user.userId
            )?.permissionType
            const currentPermission =
              existingUserPermissionChanges[userIdentifier]?.permissionType ?? user.permissionType
            const hasChanges = originalPermission && currentPermission !== originalPermission
            const isWorkspaceMember = workspacePermissions?.users?.some(
              (eu) => eu.email === user.email && eu.userId
            )
            const canShowRemoveButton =
              isWorkspaceMember &&
              !isCurrentUser &&
              !isPendingInvitation &&
              currentUserIsAdmin &&
              user.userId

            const uniqueKey = user.userId
              ? `existing-${user.userId}`
              : isPendingInvitation
                ? `pending-${user.email}`
                : `new-${user.email}`

            return (
              <div key={uniqueKey} className='flex items-center justify-between gap-[8px] py-[8px]'>
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center gap-[8px]'>
                    <span className='truncate font-medium text-[13px] text-[var(--text-primary)]'>
                      {user.email}
                    </span>
                    {isPendingInvitation && (
                      <Badge variant='default' className='gap-[4px] text-[12px]'>
                        {resendingInvitationIds &&
                        user.invitationId &&
                        resendingInvitationIds[user.invitationId] ? (
                          <>
                            <Loader2 className='h-[12px] w-[12px] animate-spin' />
                            <span>Sending...</span>
                          </>
                        ) : resentInvitationIds &&
                          user.invitationId &&
                          resentInvitationIds[user.invitationId] ? (
                          <span>Resent</span>
                        ) : (
                          <span>Sent</span>
                        )}
                      </Badge>
                    )}
                    {hasChanges && (
                      <Badge variant='default' className='text-[12px]'>
                        Modified
                      </Badge>
                    )}

                    {isPendingInvitation &&
                      currentUserIsAdmin &&
                      user.invitationId &&
                      onResendInvitation && (
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <span className='inline-flex'>
                              <Button
                                variant='ghost'
                                onClick={() => onResendInvitation(user.invitationId!, user.email)}
                                disabled={
                                  disabled ||
                                  isSaving ||
                                  resendingInvitationIds?.[user.invitationId!] ||
                                  (resendCooldowns && resendCooldowns[user.invitationId!] > 0)
                                }
                                className='h-[16px] w-[16px] p-0'
                              >
                                {resendingInvitationIds?.[user.invitationId!] ? (
                                  <Loader2 className='h-[12px] w-[12px] animate-spin' />
                                ) : (
                                  <RotateCw className='h-[12px] w-[12px]' />
                                )}
                                <span className='sr-only'>Resend invite</span>
                              </Button>
                            </span>
                          </Tooltip.Trigger>
                          <Tooltip.Content>
                            <p>
                              {resendCooldowns?.[user.invitationId!]
                                ? `Resend in ${resendCooldowns[user.invitationId!]}s`
                                : 'Resend invite'}
                            </p>
                          </Tooltip.Content>
                        </Tooltip.Root>
                      )}
                    {((canShowRemoveButton && onRemoveMember) ||
                      (isPendingInvitation &&
                        currentUserIsAdmin &&
                        user.invitationId &&
                        onRemoveInvitation)) && (
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <Button
                            variant='ghost'
                            onClick={() => {
                              if (canShowRemoveButton && onRemoveMember) {
                                onRemoveMember(user.userId!, user.email)
                              } else if (
                                isPendingInvitation &&
                                user.invitationId &&
                                onRemoveInvitation
                              ) {
                                onRemoveInvitation(user.invitationId, user.email)
                              }
                            }}
                            disabled={disabled || isSaving}
                            className='h-[16px] w-[16px] p-0'
                          >
                            <X className='h-[14px] w-[14px]' />
                            <span className='sr-only'>
                              {isPendingInvitation ? 'Revoke invite' : 'Remove member'}
                            </span>
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          <p>{isPendingInvitation ? 'Revoke invite' : 'Remove member'}</p>
                        </Tooltip.Content>
                      </Tooltip.Root>
                    )}
                  </div>
                </div>

                <div className='flex flex-shrink-0 items-center'>
                  <PermissionSelector
                    value={user.permissionType}
                    onChange={(newPermission) => onPermissionChange(userIdentifier, newPermission)}
                    disabled={
                      disabled ||
                      !currentUserIsAdmin ||
                      isPendingInvitation ||
                      (isCurrentUser && user.permissionType === 'admin')
                    }
                    className='w-auto'
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

PermissionsTable.displayName = 'PermissionsTable'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/workspace-header/components/invite-modal/components/types.ts

```typescript
import type { PermissionType } from '@/lib/workspaces/permissions/utils'

export type { PermissionType }

export interface UserPermissions {
  userId?: string
  email: string
  permissionType: PermissionType
  isCurrentUser?: boolean
  isPendingInvitation?: boolean
  invitationId?: string
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/hooks/index.ts

```typescript
export { useAutoScroll } from './use-auto-scroll'
export { useContextMenu } from './use-context-menu'
export { useDragDrop } from './use-drag-drop'
export { useFolderExpand } from './use-folder-expand'
export { useFolderOperations } from './use-folder-operations'
export { useItemDrag } from './use-item-drag'
export { useItemRename } from './use-item-rename'
export { useSidebarResize } from './use-sidebar-resize'
export { useWorkflowOperations } from './use-workflow-operations'
export { useWorkflowSelection } from './use-workflow-selection'
export { useWorkspaceManagement } from './use-workspace-management'
```

--------------------------------------------------------------------------------

---[FILE: use-auto-scroll.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/hooks/use-auto-scroll.ts
Signals: React

```typescript
import { useCallback, useRef } from 'react'

/**
 * Optimized auto-scroll hook for smooth drag operations
 */
export const useAutoScroll = (containerRef: React.RefObject<HTMLDivElement | null>) => {
  const animationRef = useRef<number | null>(null)
  const speedRef = useRef<number>(0)
  const lastUpdateRef = useRef<number>(0)

  const animateScroll = useCallback(() => {
    const scrollContainer = containerRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    ) as HTMLElement
    if (!scrollContainer || speedRef.current === 0) {
      animationRef.current = null
      return
    }

    const currentScrollTop = scrollContainer.scrollTop
    const maxScrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight

    // Check bounds and stop if needed
    if (
      (speedRef.current < 0 && currentScrollTop <= 0) ||
      (speedRef.current > 0 && currentScrollTop >= maxScrollTop)
    ) {
      speedRef.current = 0
      animationRef.current = null
      return
    }

    // Apply smooth scroll
    scrollContainer.scrollTop = Math.max(
      0,
      Math.min(maxScrollTop, currentScrollTop + speedRef.current)
    )
    animationRef.current = requestAnimationFrame(animateScroll)
  }, [containerRef])

  const startScroll = useCallback(
    (speed: number) => {
      speedRef.current = speed
      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(animateScroll)
      }
    },
    [animateScroll]
  )

  const stopScroll = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    speedRef.current = 0
  }, [])

  const handleDragOver = useCallback(
    (e: DragEvent) => {
      const now = performance.now()
      // Throttle to ~16ms for 60fps
      if (now - lastUpdateRef.current < 16) return
      lastUpdateRef.current = now

      const scrollContainer = containerRef.current
      if (!scrollContainer) return

      const rect = scrollContainer.getBoundingClientRect()
      const mouseY = e.clientY

      // Early exit if mouse is outside container
      if (mouseY < rect.top || mouseY > rect.bottom) {
        stopScroll()
        return
      }

      const scrollZone = 50
      const maxSpeed = 4
      const distanceFromTop = mouseY - rect.top
      const distanceFromBottom = rect.bottom - mouseY

      let scrollSpeed = 0

      if (distanceFromTop < scrollZone) {
        const intensity = (scrollZone - distanceFromTop) / scrollZone
        scrollSpeed = -maxSpeed * intensity ** 2
      } else if (distanceFromBottom < scrollZone) {
        const intensity = (scrollZone - distanceFromBottom) / scrollZone
        scrollSpeed = maxSpeed * intensity ** 2
      }

      if (Math.abs(scrollSpeed) > 0.1) {
        startScroll(scrollSpeed)
      } else {
        stopScroll()
      }
    },
    [containerRef, startScroll, stopScroll]
  )

  return { handleDragOver, stopScroll }
}
```

--------------------------------------------------------------------------------

---[FILE: use-context-menu.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/hooks/use-context-menu.ts
Signals: React

```typescript
import { useCallback, useEffect, useRef, useState } from 'react'

interface UseContextMenuProps {
  /**
   * Callback when context menu should open
   */
  onContextMenu?: (e: React.MouseEvent) => void
}

interface ContextMenuPosition {
  x: number
  y: number
}

/**
 * Hook for managing context menu (right-click) state and positioning.
 *
 * Handles:
 * - Right-click event prevention and positioning
 * - Menu open/close state
 * - Click-outside detection to close menu
 *
 * @param props - Hook configuration
 * @returns Context menu state and handlers
 */
export function useContextMenu({ onContextMenu }: UseContextMenuProps = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<ContextMenuPosition>({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement>(null)

  /**
   * Handle right-click event
   */
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      // Calculate position relative to viewport
      const x = e.clientX
      const y = e.clientY

      setPosition({ x, y })
      setIsOpen(true)

      onContextMenu?.(e)
    },
    [onContextMenu]
  )

  /**
   * Close the context menu
   */
  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  /**
   * Handle clicks outside the menu to close it
   */
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu()
      }
    }

    // Small delay to prevent immediate close from the same click that opened the menu
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen, closeMenu])

  return {
    isOpen,
    position,
    menuRef,
    handleContextMenu,
    closeMenu,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-drag-drop.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/hooks/use-drag-drop.ts
Signals: React, Next.js

```typescript
import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { createLogger } from '@/lib/logs/console/logger'
import { useUpdateFolder } from '@/hooks/queries/folders'
import { useFolderStore } from '@/stores/folders/store'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

const logger = createLogger('WorkflowList:DragDrop')

/**
 * Constants for auto-scroll behavior
 */
const SCROLL_THRESHOLD = 60 // Distance from edge to trigger scroll
const SCROLL_SPEED = 8 // Pixels per frame

/**
 * Constants for folder auto-expand on hover during drag
 */
const HOVER_EXPAND_DELAY = 400 // Milliseconds to wait before expanding folder

/**
 * Custom hook for handling drag and drop operations for workflows and folders.
 * Includes auto-scrolling, drop target highlighting, and hover-to-expand.
 *
 * @returns Drag and drop state and event handlers
 */
export function useDragDrop() {
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hoverFolderId, setHoverFolderId] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const scrollIntervalRef = useRef<number | null>(null)
  const hoverExpandTimerRef = useRef<number | null>(null)
  const lastDragYRef = useRef<number>(0)

  const params = useParams()
  const workspaceId = params.workspaceId as string | undefined
  const updateFolderMutation = useUpdateFolder()
  const { setExpanded, expandedFolders } = useFolderStore()
  const { updateWorkflow } = useWorkflowRegistry()

  /**
   * Auto-scroll handler - scrolls container when dragging near edges
   */
  const handleAutoScroll = useCallback(() => {
    if (!scrollContainerRef.current || !isDragging) return

    const container = scrollContainerRef.current
    const rect = container.getBoundingClientRect()
    const mouseY = lastDragYRef.current

    // Only scroll if mouse is within container bounds
    if (mouseY < rect.top || mouseY > rect.bottom) return

    // Calculate distance from top and bottom edges
    const distanceFromTop = mouseY - rect.top
    const distanceFromBottom = rect.bottom - mouseY

    let scrollDelta = 0

    // Scroll up if near top and not at scroll top
    if (distanceFromTop < SCROLL_THRESHOLD && container.scrollTop > 0) {
      const intensity = Math.max(0, Math.min(1, 1 - distanceFromTop / SCROLL_THRESHOLD))
      scrollDelta = -SCROLL_SPEED * intensity
    }
    // Scroll down if near bottom and not at scroll bottom
    else if (distanceFromBottom < SCROLL_THRESHOLD) {
      const maxScroll = container.scrollHeight - container.clientHeight
      if (container.scrollTop < maxScroll) {
        const intensity = Math.max(0, Math.min(1, 1 - distanceFromBottom / SCROLL_THRESHOLD))
        scrollDelta = SCROLL_SPEED * intensity
      }
    }

    if (scrollDelta !== 0) {
      container.scrollTop += scrollDelta
    }
  }, [isDragging])

  /**
   * Start auto-scroll animation loop
   */
  useEffect(() => {
    if (isDragging) {
      scrollIntervalRef.current = window.setInterval(handleAutoScroll, 10) // ~100fps for smoother response
    } else {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
        scrollIntervalRef.current = null
      }
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
      }
    }
  }, [isDragging, handleAutoScroll])

  /**
   * Handle hover folder changes - start/clear expand timer
   */
  useEffect(() => {
    // Clear existing timer when hover folder changes
    if (hoverExpandTimerRef.current) {
      clearTimeout(hoverExpandTimerRef.current)
      hoverExpandTimerRef.current = null
    }

    // Don't start timer if not dragging or no folder is hovered
    if (!isDragging || !hoverFolderId) {
      return
    }

    // Don't expand if folder is already expanded
    if (expandedFolders.has(hoverFolderId)) {
      return
    }

    // Start timer to expand folder after delay
    hoverExpandTimerRef.current = window.setTimeout(() => {
      setExpanded(hoverFolderId, true)
      logger.info(`Auto-expanded folder ${hoverFolderId} during drag`)
    }, HOVER_EXPAND_DELAY)

    return () => {
      if (hoverExpandTimerRef.current) {
        clearTimeout(hoverExpandTimerRef.current)
        hoverExpandTimerRef.current = null
      }
    }
  }, [hoverFolderId, isDragging, expandedFolders, setExpanded])

  /**
   * Cleanup hover state when dragging stops
   */
  useEffect(() => {
    if (!isDragging) {
      setHoverFolderId(null)
    }
  }, [isDragging])

  /**
   * Moves one or more workflows to a target folder
   *
   * @param workflowIds - Array of workflow IDs to move
   * @param targetFolderId - Target folder ID or null for root
   */
  const handleWorkflowDrop = useCallback(
    async (workflowIds: string[], targetFolderId: string | null) => {
      if (!workflowIds.length) {
        logger.warn('No workflows to move')
        return
      }

      try {
        await Promise.all(
          workflowIds.map((workflowId) => updateWorkflow(workflowId, { folderId: targetFolderId }))
        )
        logger.info(`Moved ${workflowIds.length} workflow(s)`)
      } catch (error) {
        logger.error('Failed to move workflows:', error)
      }
    },
    [updateWorkflow]
  )

  /**
   * Moves a folder to a new parent folder, with validation
   *
   * @param draggedFolderId - ID of the folder being moved
   * @param targetFolderId - Target folder ID or null for root
   */
  const handleFolderMove = useCallback(
    async (draggedFolderId: string, targetFolderId: string | null) => {
      if (!draggedFolderId) {
        logger.warn('No folder to move')
        return
      }

      try {
        const folderStore = useFolderStore.getState()
        const draggedFolderPath = folderStore.getFolderPath(draggedFolderId)

        // Prevent moving folder into its own descendant
        if (
          targetFolderId &&
          draggedFolderPath.some((ancestor) => ancestor.id === targetFolderId)
        ) {
          logger.info('Cannot move folder into its own descendant')
          return
        }

        // Prevent moving folder into itself
        if (draggedFolderId === targetFolderId) {
          logger.info('Cannot move folder into itself')
          return
        }

        if (!workspaceId) {
          logger.warn('No workspaceId available for folder move')
          return
        }
        await updateFolderMutation.mutateAsync({
          workspaceId,
          id: draggedFolderId,
          updates: { parentId: targetFolderId },
        })
        logger.info(`Moved folder to ${targetFolderId ? `folder ${targetFolderId}` : 'root'}`)
      } catch (error) {
        logger.error('Failed to move folder:', error)
      }
    },
    [updateFolderMutation, workspaceId]
  )

  /**
   * Handles drop events for both workflows and folders
   *
   * @param e - React drag event
   * @param targetFolderId - Target folder ID or null for root
   */
  const handleFolderDrop = useCallback(
    async (e: React.DragEvent, targetFolderId: string | null) => {
      e.preventDefault()
      e.stopPropagation()
      setDropTargetId(null)
      setIsDragging(false)

      try {
        // Check if dropping workflows
        const workflowIdsData = e.dataTransfer.getData('workflow-ids')
        if (workflowIdsData) {
          const workflowIds = JSON.parse(workflowIdsData) as string[]
          await handleWorkflowDrop(workflowIds, targetFolderId)
          return
        }

        // Check if dropping a folder
        const folderIdData = e.dataTransfer.getData('folder-id')
        if (folderIdData && targetFolderId !== folderIdData) {
          await handleFolderMove(folderIdData, targetFolderId)
        }
      } catch (error) {
        logger.error('Failed to handle drop:', error)
      }
    },
    [handleWorkflowDrop, handleFolderMove]
  )

  /**
   * Creates drag event handlers for a specific folder section
   * These handlers are attached to the entire folder section container
   *
   * @param folderId - Folder ID to create handlers for
   * @returns Object containing drag event handlers
   */
  const createFolderDragHandlers = useCallback(
    (folderId: string) => ({
      onDragEnter: (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault()
        setIsDragging(true)
      },
      onDragOver: (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault()
        lastDragYRef.current = e.clientY
        setDropTargetId(folderId)
        setIsDragging(true)
      },
      onDragLeave: (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault()
        const relatedTarget = e.relatedTarget as HTMLElement | null
        const currentTarget = e.currentTarget as HTMLElement
        // Only clear if we're leaving the folder section completely
        if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
          setDropTargetId(null)
        }
      },
      onDrop: (e: React.DragEvent<HTMLElement>) => handleFolderDrop(e, folderId),
    }),
    [handleFolderDrop]
  )

  /**
   * Creates drag event handlers for items (workflows/folders) that belong to a parent folder
   * When dragging over an item, highlights the parent folder section
   *
   * @param parentFolderId - Parent folder ID or null for root
   * @returns Object containing drag event handlers
   */
  const createItemDragHandlers = useCallback(
    (parentFolderId: string | null) => ({
      onDragOver: (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault()
        e.stopPropagation()
        lastDragYRef.current = e.clientY
        setDropTargetId(parentFolderId || 'root')
        setIsDragging(true)
      },
    }),
    []
  )

  /**
   * Creates drag event handlers for the root drop zone
   *
   * @returns Object containing drag event handlers for root
   */
  const createRootDragHandlers = useCallback(
    () => ({
      onDragEnter: (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault()
        setIsDragging(true)
      },
      onDragOver: (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault()
        lastDragYRef.current = e.clientY
        setDropTargetId('root')
        setIsDragging(true)
      },
      onDragLeave: (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault()
        const relatedTarget = e.relatedTarget as HTMLElement | null
        const currentTarget = e.currentTarget as HTMLElement
        // Only clear if we're leaving the root completely
        if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
          setDropTargetId(null)
        }
      },
      onDrop: (e: React.DragEvent<HTMLElement>) => handleFolderDrop(e, null),
    }),
    [handleFolderDrop]
  )

  /**
   * Creates drag event handlers for folder header (the clickable part)
   * These handlers trigger folder expansion on hover during drag
   *
   * @param folderId - Folder ID to handle hover for
   * @returns Object containing drag event handlers for folder header
   */
  const createFolderHeaderHoverHandlers = useCallback(
    (folderId: string) => ({
      onDragEnter: (e: React.DragEvent<HTMLElement>) => {
        if (isDragging) {
          setHoverFolderId(folderId)
        }
      },
      onDragLeave: (e: React.DragEvent<HTMLElement>) => {
        const relatedTarget = e.relatedTarget as HTMLElement | null
        const currentTarget = e.currentTarget as HTMLElement
        // Only clear if we're leaving the folder header completely
        if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
          setHoverFolderId(null)
        }
      },
    }),
    [isDragging]
  )

  /**
   * Set the scroll container ref for auto-scrolling
   *
   * @param element - Scrollable container element
   */
  const setScrollContainer = useCallback((element: HTMLDivElement | null) => {
    scrollContainerRef.current = element
  }, [])

  return {
    dropTargetId,
    isDragging,
    setScrollContainer,
    createFolderDragHandlers,
    createItemDragHandlers,
    createRootDragHandlers,
    createFolderHeaderHoverHandlers,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-folder-expand.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/hooks/use-folder-expand.ts
Signals: React

```typescript
import { useCallback } from 'react'
import { useFolderStore } from '@/stores/folders/store'

interface UseFolderExpandProps {
  folderId: string
}

/**
 * Custom hook to handle folder expand/collapse functionality.
 * Provides handlers for mouse clicks and keyboard navigation.
 *
 * @param props - Configuration object containing folderId
 * @returns Expansion state and event handlers
 */
export function useFolderExpand({ folderId }: UseFolderExpandProps) {
  const { expandedFolders, toggleExpanded } = useFolderStore()
  const isExpanded = expandedFolders.has(folderId)

  /**
   * Toggle folder expansion state
   */
  const handleToggleExpanded = useCallback(() => {
    toggleExpanded(folderId)
  }, [folderId, toggleExpanded])

  /**
   * Handle keyboard navigation (Enter/Space)
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleToggleExpanded()
      }
    },
    [handleToggleExpanded]
  )

  return {
    isExpanded,
    handleToggleExpanded,
    handleKeyDown,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-folder-operations.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/hooks/use-folder-operations.ts
Signals: React

```typescript
import { useCallback } from 'react'
import { createLogger } from '@/lib/logs/console/logger'
import { generateFolderName } from '@/lib/workspaces/naming'
import { useCreateFolder } from '@/hooks/queries/folders'

const logger = createLogger('useFolderOperations')

interface UseFolderOperationsProps {
  workspaceId: string
}

/**
 * Custom hook to manage folder operations including creating folders.
 * Handles folder name generation and state management.
 * Uses React Query mutation's isPending state for immediate loading feedback.
 *
 * @param props - Configuration object containing workspaceId
 * @returns Folder operations state and handlers
 */
export function useFolderOperations({ workspaceId }: UseFolderOperationsProps) {
  const createFolderMutation = useCreateFolder()

  const handleCreateFolder = useCallback(async (): Promise<string | null> => {
    if (!workspaceId) {
      return null
    }

    try {
      const folderName = await generateFolderName(workspaceId)
      const folder = await createFolderMutation.mutateAsync({ name: folderName, workspaceId })
      logger.info(`Created folder: ${folderName}`)
      return folder.id
    } catch (error) {
      logger.error('Failed to create folder:', { error })
      return null
    }
  }, [createFolderMutation, workspaceId])

  return {
    // State
    isCreatingFolder: createFolderMutation.isPending,

    // Operations
    handleCreateFolder,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-item-drag.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/hooks/use-item-drag.ts
Signals: React

```typescript
import { useCallback, useRef, useState } from 'react'

interface UseItemDragProps {
  onDragStart: (e: React.DragEvent) => void
}

/**
 * Custom hook to handle drag operations for workflow and folder items.
 * Manages drag state and provides unified drag event handlers.
 *
 * @param props - Configuration object containing drag start callback
 * @returns Drag state and event handlers
 */
export function useItemDrag({ onDragStart }: UseItemDragProps) {
  const [isDragging, setIsDragging] = useState(false)
  const shouldPreventClickRef = useRef(false)

  /**
   * Handle drag start - sets dragging state and prevents click
   */
  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      shouldPreventClickRef.current = true
      setIsDragging(true)
      onDragStart(e)
    },
    [onDragStart]
  )

  /**
   * Handle drag end - resets dragging state and re-enables clicks
   */
  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    requestAnimationFrame(() => {
      shouldPreventClickRef.current = false
    })
  }, [])

  return {
    isDragging,
    shouldPreventClickRef,
    handleDragStart,
    handleDragEnd,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-item-rename.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/hooks/use-item-rename.ts
Signals: React

```typescript
import { useCallback, useEffect, useRef, useState } from 'react'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('useItemRename')

interface UseItemRenameProps {
  /**
   * Current item name
   */
  initialName: string
  /**
   * Callback to save the new name
   */
  onSave: (newName: string) => Promise<void>
  /**
   * Item type for logging
   */
  itemType: 'workflow' | 'folder' | 'workspace'
  /**
   * Item ID for logging
   */
  itemId: string
}

/**
 * Hook for managing inline rename functionality for workflows, folders, and workspaces.
 *
 * Handles:
 * - Edit state management
 * - Input value tracking
 * - Save/cancel operations
 * - Keyboard shortcuts (Enter to save, Escape to cancel)
 * - Auto-focus and selection
 * - Loading state during save
 *
 * @param props - Hook configuration
 * @returns Rename state and handlers
 */
export function useItemRename({ initialName, onSave, itemType, itemId }: UseItemRenameProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(initialName)
  const [isRenaming, setIsRenaming] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  /**
   * Update edit value when initial name changes
   */
  useEffect(() => {
    setEditValue(initialName)
  }, [initialName])

  /**
   * Focus and select input when entering edit mode
   */
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  /**
   * Start editing mode
   */
  const handleStartEdit = useCallback(() => {
    setIsEditing(true)
    setEditValue(initialName)
  }, [initialName])

  /**
   * Save the new name
   */
  const handleSaveEdit = useCallback(async () => {
    const trimmedValue = editValue.trim()

    // If empty or unchanged, just cancel
    if (!trimmedValue || trimmedValue === initialName) {
      setIsEditing(false)
      setEditValue(initialName)
      return
    }

    setIsRenaming(true)
    try {
      await onSave(trimmedValue)
      logger.info(`Successfully renamed ${itemType} from "${initialName}" to "${trimmedValue}"`)
      setIsEditing(false)
    } catch (error) {
      logger.error(`Failed to rename ${itemType}:`, {
        error,
        itemId,
        oldName: initialName,
        newName: trimmedValue,
      })
      // Reset to original name on error
      setEditValue(initialName)
    } finally {
      setIsRenaming(false)
    }
  }, [editValue, initialName, onSave, itemType, itemId])

  /**
   * Cancel editing and restore original name
   */
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false)
    setEditValue(initialName)
  }, [initialName])

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSaveEdit()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        handleCancelEdit()
      }
    },
    [handleSaveEdit, handleCancelEdit]
  )

  /**
   * Handle input blur (unfocus)
   */
  const handleInputBlur = useCallback(() => {
    handleSaveEdit()
  }, [handleSaveEdit])

  return {
    isEditing,
    editValue,
    isRenaming,
    inputRef,
    setEditValue,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleKeyDown,
    handleInputBlur,
  }
}
```

--------------------------------------------------------------------------------

````
