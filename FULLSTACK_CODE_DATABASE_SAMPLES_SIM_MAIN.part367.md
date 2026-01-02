---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 367
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 367 of 933)

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

---[FILE: commands-utils.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/utils/commands-utils.ts

```typescript
import type { GlobalCommand } from '@/app/workspace/[workspaceId]/providers/global-commands-provider'

/**
 * Identifiers for all globally-available commands.
 *
 * Components must use these identifiers (via {@link createCommand}) rather than
 * ad-hoc ids or shortcuts to ensure a single source of truth.
 */
export type CommandId =
  | 'add-agent'
  | 'goto-templates'
  | 'goto-logs'
  | 'open-search'
  | 'run-workflow'
  | 'focus-copilot-tab'
  | 'focus-toolbar-tab'
  | 'focus-editor-tab'
  | 'clear-terminal-console'
  | 'focus-toolbar-search'
  | 'clear-notifications'

/**
 * Static metadata for a global command.
 *
 * This central registry defines the keyboard shortcut and default behavior
 * for whether the command is allowed inside editable elements.
 */
export interface CommandDefinition {
  /** Stable identifier for the command. */
  id: CommandId
  /** Shortcut string in the form "Mod+Shift+A", "Mod+Enter", etc. */
  shortcut: string
  /**
   * Whether to allow the command inside editable elements such as inputs and
   * textareas. When omitted, the command provider will default to `true`.
   */
  allowInEditable?: boolean
}

/**
 * Central mapping from command id to its definition.
 *
 * All global commands must be declared here to be usable.
 */
export const COMMAND_DEFINITIONS: Record<CommandId, CommandDefinition> = {
  'add-agent': {
    id: 'add-agent',
    shortcut: 'Mod+Shift+A',
    allowInEditable: true,
  },
  'goto-templates': {
    id: 'goto-templates',
    shortcut: 'Mod+Y',
    allowInEditable: true,
  },
  'goto-logs': {
    id: 'goto-logs',
    shortcut: 'Mod+L',
    allowInEditable: true,
  },
  'open-search': {
    id: 'open-search',
    shortcut: 'Mod+K',
    allowInEditable: true,
  },
  'run-workflow': {
    id: 'run-workflow',
    shortcut: 'Mod+Enter',
    allowInEditable: false,
  },
  'focus-copilot-tab': {
    id: 'focus-copilot-tab',
    shortcut: 'C',
    allowInEditable: false,
  },
  'focus-toolbar-tab': {
    id: 'focus-toolbar-tab',
    shortcut: 'T',
    allowInEditable: false,
  },
  'focus-editor-tab': {
    id: 'focus-editor-tab',
    shortcut: 'E',
    allowInEditable: false,
  },
  'clear-terminal-console': {
    id: 'clear-terminal-console',
    shortcut: 'Mod+D',
    allowInEditable: false,
  },
  'focus-toolbar-search': {
    id: 'focus-toolbar-search',
    shortcut: 'Mod+F',
    allowInEditable: false,
  },
  'clear-notifications': {
    id: 'clear-notifications',
    shortcut: 'Mod+E',
    allowInEditable: false,
  },
}

/**
 * Input for creating a concrete command instance from the registry.
 */
export interface CreateCommandInput {
  /** Identifier of the command to materialize. */
  id: CommandId
  /**
   * Handler invoked when the shortcut is matched. This is the only dynamic
   * part supplied by call sites.
   */
  handler: (event: KeyboardEvent) => void
  /**
   * Optional overrides for definition defaults. Use sparingly; most behavior
   * should be configured in {@link COMMAND_DEFINITIONS}.
   */
  overrides?: Pick<GlobalCommand, 'allowInEditable'>
}

/**
 * Creates a concrete {@link GlobalCommand} from a registry definition.
 *
 * This ensures:
 * - Only commands declared in {@link COMMAND_DEFINITIONS} can be registered.
 * - Shortcut strings and ids are centralized and consistent.
 *
 * @throws Error when the `id` is not present in the registry.
 */
export function createCommand(input: CreateCommandInput): GlobalCommand {
  const definition = COMMAND_DEFINITIONS[input.id]
  if (!definition) {
    throw new Error(`Unknown global command id: ${input.id as string}`)
  }

  return {
    id: definition.id,
    shortcut: definition.shortcut,
    allowInEditable: input.overrides?.allowInEditable ?? definition.allowInEditable,
    handler: input.handler,
  }
}

/**
 * Convenience helper to create multiple commands from the registry in one call.
 *
 * @param inputs - List of command inputs to materialize.
 * @returns Array of {@link GlobalCommand} instances ready for registration.
 */
export function createCommands(inputs: CreateCommandInput[]): GlobalCommand[] {
  return inputs.map((input) => createCommand(input))
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/page.tsx
Signals: React, Next.js

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createLogger } from '@/lib/logs/console/logger'
import { Panel, Terminal } from '@/app/workspace/[workspaceId]/w/[workflowId]/components'
import { useWorkflows } from '@/hooks/queries/workflows'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

const logger = createLogger('WorkflowsPage')

export default function WorkflowsPage() {
  const router = useRouter()
  const { workflows, setActiveWorkflow } = useWorkflowRegistry()
  const params = useParams()
  const workspaceId = params.workspaceId as string
  const [isMounted, setIsMounted] = useState(false)

  // Fetch workflows using React Query
  const { isLoading, isError } = useWorkflows(workspaceId)

  // Track when component is mounted to avoid hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle redirection once workflows are loaded and component is mounted
  useEffect(() => {
    // Wait for component to be mounted to avoid hydration mismatches
    if (!isMounted) return

    // Only proceed if workflows are done loading
    if (isLoading) return

    if (isError) {
      logger.error('Failed to load workflows for workspace')
      return
    }

    const workflowIds = Object.keys(workflows)

    // Validate that workflows belong to the current workspace
    const workspaceWorkflows = workflowIds.filter((id) => {
      const workflow = workflows[id]
      return workflow.workspaceId === workspaceId
    })

    // If we have valid workspace workflows, redirect to the first one
    if (workspaceWorkflows.length > 0) {
      const firstWorkflowId = workspaceWorkflows[0]
      router.replace(`/workspace/${workspaceId}/w/${firstWorkflowId}`)
    }
  }, [isMounted, isLoading, workflows, workspaceId, router, setActiveWorkflow, isError])

  // Always show loading state until redirect happens
  // There should always be a default workflow, so we never show "no workflows found"
  return (
    <div className='flex h-full w-full flex-col overflow-hidden bg-[var(--bg)]'>
      <div className='relative h-full w-full flex-1 bg-[var(--bg)]'>
        <div className='workflow-container flex h-full items-center justify-center bg-[var(--bg)]'>
          <div className='h-[18px] w-[18px] animate-spin rounded-full border-[1.5px] border-muted-foreground border-t-transparent' />
        </div>
        <Panel />
      </div>
      <Terminal />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: sidebar.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/sidebar.tsx
Signals: React, Next.js

```typescript
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, Database, HelpCircle, Layout, Plus, Search, Settings } from 'lucide-react'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Button, FolderPlus, Library, Tooltip } from '@/components/emcn'
import { useSession } from '@/lib/auth/auth-client'
import { getEnv, isTruthy } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'
import { useRegisterGlobalCommands } from '@/app/workspace/[workspaceId]/providers/global-commands-provider'
import { useUserPermissionsContext } from '@/app/workspace/[workspaceId]/providers/workspace-permissions-provider'
import { createCommands } from '@/app/workspace/[workspaceId]/utils/commands-utils'
import {
  HelpModal,
  SearchModal,
  SettingsModal,
  UsageIndicator,
  WorkflowList,
  WorkspaceHeader,
} from '@/app/workspace/[workspaceId]/w/components/sidebar/components'
import {
  useFolderOperations,
  useSidebarResize,
  useWorkflowOperations,
  useWorkspaceManagement,
} from '@/app/workspace/[workspaceId]/w/components/sidebar/hooks'
import {
  useDuplicateWorkspace,
  useExportWorkspace,
  useImportWorkspace,
} from '@/app/workspace/[workspaceId]/w/hooks'
import { useFolderStore } from '@/stores/folders/store'
import { useSearchModalStore } from '@/stores/search-modal/store'
import { useSettingsModalStore } from '@/stores/settings-modal/store'
import { MIN_SIDEBAR_WIDTH, useSidebarStore } from '@/stores/sidebar/store'

const logger = createLogger('Sidebar')

/** Feature flag for billing usage indicator visibility */
const isBillingEnabled = isTruthy(getEnv('NEXT_PUBLIC_BILLING_ENABLED'))

/** Event name for sidebar scroll operations - centralized for consistency */
export const SIDEBAR_SCROLL_EVENT = 'sidebar-scroll-to-item'

/**
 * Sidebar component with resizable width that persists across page refreshes.
 *
 * Uses a CSS-based approach to prevent hydration mismatches:
 * 1. Dimensions are controlled by CSS variables (--sidebar-width)
 * 2. Blocking script in layout.tsx sets CSS variables before React hydrates
 * 3. Store updates CSS variables when dimensions change
 *
 * This ensures server and client render identical HTML, preventing hydration errors.
 *
 * @returns Sidebar with workflows panel
 */
export function Sidebar() {
  const params = useParams()
  const workspaceId = params.workspaceId as string
  const workflowId = params.workflowId as string | undefined
  const router = useRouter()
  const pathname = usePathname()

  const sidebarRef = useRef<HTMLElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const { data: sessionData, isPending: sessionLoading } = useSession()
  const { canEdit } = useUserPermissionsContext()

  /**
   * Sidebar state from store with hydration tracking to prevent SSR mismatch.
   * Uses default (expanded) state until hydrated.
   */
  const hasHydrated = useSidebarStore((state) => state._hasHydrated)
  const isCollapsedStore = useSidebarStore((state) => state.isCollapsed)
  const setIsCollapsed = useSidebarStore((state) => state.setIsCollapsed)
  const setSidebarWidth = useSidebarStore((state) => state.setSidebarWidth)
  const isCollapsed = hasHydrated ? isCollapsedStore : false
  const isOnWorkflowPage = !!workflowId

  const [isImporting, setIsImporting] = useState(false)
  const workspaceFileInputRef = useRef<HTMLInputElement>(null)

  const { isImporting: isImportingWorkspace, handleImportWorkspace: importWorkspace } =
    useImportWorkspace()
  const { handleExportWorkspace: exportWorkspace } = useExportWorkspace()

  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)
  const {
    isOpen: isSettingsModalOpen,
    openModal: openSettingsModal,
    closeModal: closeSettingsModal,
  } = useSettingsModalStore()

  /** Listens for external events to open help modal */
  useEffect(() => {
    const handleOpenHelpModal = () => setIsHelpModalOpen(true)
    window.addEventListener('open-help-modal', handleOpenHelpModal)
    return () => window.removeEventListener('open-help-modal', handleOpenHelpModal)
  }, [])

  /** Listens for scroll events and scrolls items into view if off-screen */
  useEffect(() => {
    const handleScrollToItem = (e: CustomEvent<{ itemId: string }>) => {
      const { itemId } = e.detail
      if (!itemId) return

      const tryScroll = (retriesLeft: number) => {
        requestAnimationFrame(() => {
          const element = document.querySelector(`[data-item-id="${itemId}"]`)
          const container = scrollContainerRef.current

          if (!element || !container) {
            if (retriesLeft > 0) tryScroll(retriesLeft - 1)
            return
          }

          const { top: elTop, bottom: elBottom } = element.getBoundingClientRect()
          const { top: ctTop, bottom: ctBottom } = container.getBoundingClientRect()

          if (elBottom <= ctTop || elTop >= ctBottom) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        })
      }

      tryScroll(10)
    }
    window.addEventListener(SIDEBAR_SCROLL_EVENT, handleScrollToItem as EventListener)
    return () =>
      window.removeEventListener(SIDEBAR_SCROLL_EVENT, handleScrollToItem as EventListener)
  }, [])

  const {
    isOpen: isSearchModalOpen,
    setOpen: setIsSearchModalOpen,
    open: openSearchModal,
  } = useSearchModalStore()

  const {
    workspaces,
    activeWorkspace,
    isWorkspacesLoading,
    switchWorkspace,
    handleCreateWorkspace,
    isCreatingWorkspace,
    updateWorkspaceName,
    confirmDeleteWorkspace,
  } = useWorkspaceManagement({
    workspaceId,
    sessionUserId: sessionData?.user?.id,
  })

  const { handleMouseDown } = useSidebarResize()

  const {
    regularWorkflows,
    workflowsLoading,
    isCreatingWorkflow,
    handleCreateWorkflow: createWorkflow,
  } = useWorkflowOperations({ workspaceId })

  const { isCreatingFolder, handleCreateFolder: createFolder } = useFolderOperations({
    workspaceId,
  })

  const { handleDuplicateWorkspace: duplicateWorkspace } = useDuplicateWorkspace({
    getWorkspaceId: () => workspaceId,
  })

  const searchModalWorkflows = useMemo(
    () =>
      regularWorkflows.map((workflow) => ({
        id: workflow.id,
        name: workflow.name,
        href: `/workspace/${workspaceId}/w/${workflow.id}`,
        color: workflow.color,
        isCurrent: workflow.id === workflowId,
      })),
    [regularWorkflows, workspaceId, workflowId]
  )

  const searchModalWorkspaces = useMemo(
    () =>
      workspaces.map((workspace) => ({
        id: workspace.id,
        name: workspace.name,
        href: `/workspace/${workspace.id}/w`,
        isCurrent: workspace.id === workspaceId,
      })),
    [workspaces, workspaceId]
  )

  const footerNavigationItems = useMemo(
    () => [
      {
        id: 'logs',
        label: 'Logs',
        icon: Library,
        href: `/workspace/${workspaceId}/logs`,
      },
      {
        id: 'templates',
        label: 'Templates',
        icon: Layout,
        href: `/workspace/${workspaceId}/templates`,
      },
      {
        id: 'knowledge-base',
        label: 'Knowledge Base',
        icon: Database,
        href: `/workspace/${workspaceId}/knowledge`,
      },
      {
        id: 'help',
        label: 'Help',
        icon: HelpCircle,
        onClick: () => setIsHelpModalOpen(true),
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        onClick: () => openSettingsModal(),
      },
    ],
    [workspaceId]
  )

  const isLoading = workflowsLoading || sessionLoading
  const initialScrollDoneRef = useRef(false)

  /** Scrolls to active workflow on initial page load only */
  useEffect(() => {
    if (!workflowId || workflowsLoading || initialScrollDoneRef.current) return
    initialScrollDoneRef.current = true
    requestAnimationFrame(() => {
      window.dispatchEvent(
        new CustomEvent(SIDEBAR_SCROLL_EVENT, { detail: { itemId: workflowId } })
      )
    })
  }, [workflowId, workflowsLoading])

  /** Forces sidebar to minimum width and ensures it's expanded when not on a workflow page */
  useEffect(() => {
    if (!isOnWorkflowPage) {
      if (isCollapsed) {
        setIsCollapsed(false)
      }
      setSidebarWidth(MIN_SIDEBAR_WIDTH)
    }
  }, [isOnWorkflowPage, isCollapsed, setIsCollapsed, setSidebarWidth])

  /** Creates a workflow and scrolls to it */
  const handleCreateWorkflow = useCallback(async () => {
    const workflowId = await createWorkflow()
    if (workflowId) {
      window.dispatchEvent(
        new CustomEvent(SIDEBAR_SCROLL_EVENT, { detail: { itemId: workflowId } })
      )
    }
  }, [createWorkflow])

  /** Creates a folder and scrolls to it */
  const handleCreateFolder = useCallback(async () => {
    const folderId = await createFolder()
    if (folderId) {
      window.dispatchEvent(new CustomEvent(SIDEBAR_SCROLL_EVENT, { detail: { itemId: folderId } }))
    }
  }, [createFolder])

  /** Triggers file input for workflow import */
  const handleImportWorkflow = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  /** Handles workspace switch from popover menu */
  const handleWorkspaceSwitch = useCallback(
    async (workspace: { id: string; name: string; ownerId: string; role?: string }) => {
      if (workspace.id === workspaceId) {
        setIsWorkspaceMenuOpen(false)
        return
      }
      await switchWorkspace(workspace)
      setIsWorkspaceMenuOpen(false)
    },
    [workspaceId, switchWorkspace]
  )

  /** Toggles sidebar collapse state */
  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed)
  }, [isCollapsed, setIsCollapsed])

  /** Reverts to active workflow selection when clicking sidebar background */
  const handleSidebarClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.closest('button, [role="button"], a')) {
        return
      }
      const { selectOnly, clearSelection } = useFolderStore.getState()
      workflowId ? selectOnly(workflowId) : clearSelection()
    },
    [workflowId]
  )

  /** Renames a workspace */
  const handleRenameWorkspace = useCallback(
    async (workspaceIdToRename: string, newName: string) => {
      await updateWorkspaceName(workspaceIdToRename, newName)
    },
    [updateWorkspaceName]
  )

  /** Deletes a workspace */
  const handleDeleteWorkspace = useCallback(
    async (workspaceIdToDelete: string) => {
      const workspaceToDelete = workspaces.find((w) => w.id === workspaceIdToDelete)
      if (workspaceToDelete) {
        await confirmDeleteWorkspace(workspaceToDelete, 'keep')
      }
    },
    [workspaces, confirmDeleteWorkspace]
  )

  /** Duplicates a workspace */
  const handleDuplicateWorkspace = useCallback(
    async (_workspaceIdToDuplicate: string, workspaceName: string) => {
      await duplicateWorkspace(workspaceName)
    },
    [duplicateWorkspace]
  )

  /** Exports a workspace */
  const handleExportWorkspace = useCallback(
    async (workspaceIdToExport: string, workspaceName: string) => {
      await exportWorkspace(workspaceIdToExport, workspaceName)
    },
    [exportWorkspace]
  )

  /** Triggers file input for workspace import */
  const handleImportWorkspace = useCallback(() => {
    workspaceFileInputRef.current?.click()
  }, [])

  /** Handles workspace import file selection */
  const handleWorkspaceFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (!files || files.length === 0) return

      const zipFile = files[0]
      await importWorkspace(zipFile)

      if (event.target) {
        event.target.value = ''
      }
    },
    [importWorkspace]
  )

  /** Resolves workspace ID from params or URL path */
  const resolveWorkspaceIdFromPath = useCallback((): string | undefined => {
    if (workspaceId) return workspaceId
    if (typeof window === 'undefined') return undefined

    const parts = window.location.pathname.split('/')
    const idx = parts.indexOf('workspace')
    if (idx === -1) return undefined

    return parts[idx + 1]
  }, [workspaceId])

  /** Registers global sidebar commands with the central commands registry */
  useRegisterGlobalCommands(() =>
    createCommands([
      {
        id: 'add-agent',
        handler: () => {
          try {
            const event = new CustomEvent('add-block-from-toolbar', {
              detail: { type: 'agent', enableTriggerMode: false },
            })
            window.dispatchEvent(event)
            logger.info('Dispatched add-agent command')
          } catch (err) {
            logger.error('Failed to dispatch add-agent command', { err })
          }
        },
      },
      {
        id: 'goto-templates',
        handler: () => {
          try {
            const pathWorkspaceId = resolveWorkspaceIdFromPath()
            if (pathWorkspaceId) {
              router.push(`/workspace/${pathWorkspaceId}/templates`)
              logger.info('Navigated to templates', { workspaceId: pathWorkspaceId })
            } else {
              logger.warn('No workspace ID found, cannot navigate to templates')
            }
          } catch (err) {
            logger.error('Failed to navigate to templates', { err })
          }
        },
      },
      {
        id: 'goto-logs',
        handler: () => {
          try {
            const pathWorkspaceId = resolveWorkspaceIdFromPath()
            if (pathWorkspaceId) {
              router.push(`/workspace/${pathWorkspaceId}/logs`)
              logger.info('Navigated to logs', { workspaceId: pathWorkspaceId })
            } else {
              logger.warn('No workspace ID found, cannot navigate to logs')
            }
          } catch (err) {
            logger.error('Failed to navigate to logs', { err })
          }
        },
      },
      {
        id: 'open-search',
        handler: () => {
          openSearchModal()
        },
      },
    ])
  )

  return (
    <>
      {isCollapsed ? (
        /* Floating collapsed header */
        <div className='fixed top-[14px] left-[10px] z-10 max-w-[232px] rounded-[8px] border border-[var(--border)] bg-[var(--surface-1)] px-[12px] py-[8px]'>
          <WorkspaceHeader
            activeWorkspace={activeWorkspace}
            workspaceId={workspaceId}
            workspaces={workspaces}
            isWorkspacesLoading={isWorkspacesLoading}
            isCreatingWorkspace={isCreatingWorkspace}
            isWorkspaceMenuOpen={isWorkspaceMenuOpen}
            setIsWorkspaceMenuOpen={setIsWorkspaceMenuOpen}
            onWorkspaceSwitch={handleWorkspaceSwitch}
            onCreateWorkspace={handleCreateWorkspace}
            onToggleCollapse={handleToggleCollapse}
            isCollapsed={isCollapsed}
            onRenameWorkspace={handleRenameWorkspace}
            onDeleteWorkspace={handleDeleteWorkspace}
            onDuplicateWorkspace={handleDuplicateWorkspace}
            onExportWorkspace={handleExportWorkspace}
            onImportWorkspace={handleImportWorkspace}
            isImportingWorkspace={isImportingWorkspace}
            showCollapseButton={isOnWorkflowPage}
          />
        </div>
      ) : (
        /* Full sidebar */
        <>
          <aside
            ref={sidebarRef}
            className='sidebar-container fixed inset-y-0 left-0 z-10 overflow-hidden bg-[var(--surface-1)]'
            aria-label='Workspace sidebar'
            onClick={handleSidebarClick}
          >
            <div className='flex h-full flex-col border-[var(--border)] border-r pt-[14px]'>
              {/* Header */}
              <div className='flex-shrink-0 px-[14px]'>
                <WorkspaceHeader
                  activeWorkspace={activeWorkspace}
                  workspaceId={workspaceId}
                  workspaces={workspaces}
                  isWorkspacesLoading={isWorkspacesLoading}
                  isCreatingWorkspace={isCreatingWorkspace}
                  isWorkspaceMenuOpen={isWorkspaceMenuOpen}
                  setIsWorkspaceMenuOpen={setIsWorkspaceMenuOpen}
                  onWorkspaceSwitch={handleWorkspaceSwitch}
                  onCreateWorkspace={handleCreateWorkspace}
                  onToggleCollapse={handleToggleCollapse}
                  isCollapsed={isCollapsed}
                  onRenameWorkspace={handleRenameWorkspace}
                  onDeleteWorkspace={handleDeleteWorkspace}
                  onDuplicateWorkspace={handleDuplicateWorkspace}
                  onExportWorkspace={handleExportWorkspace}
                  onImportWorkspace={handleImportWorkspace}
                  isImportingWorkspace={isImportingWorkspace}
                  showCollapseButton={isOnWorkflowPage}
                />
              </div>

              {/* Search */}
              <div
                className='mx-[8px] mt-[12px] flex flex-shrink-0 cursor-pointer items-center justify-between rounded-[8px] border border-[var(--border-strong)] bg-transparent px-[8px] py-[7px] dark:border-0 dark:bg-[var(--surface-5)]'
                onClick={() => setIsSearchModalOpen(true)}
              >
                <div className='flex items-center gap-[6px]'>
                  <Search className='h-[14px] w-[14px] text-[var(--text-subtle)]' />
                  <p className='translate-y-[0.25px] font-medium text-[var(--text-tertiary)] text-small'>
                    Search
                  </p>
                </div>
                <p className='font-medium text-[var(--text-subtle)] text-small'>⌘K</p>
              </div>

              {/* Workflows */}
              <div className='workflows-section relative mt-[14px] flex flex-1 flex-col overflow-hidden'>
                {/* Header - Always visible */}
                <div className='flex flex-shrink-0 flex-col space-y-[4px] px-[14px]'>
                  <div className='flex items-center justify-between'>
                    <div className='font-medium text-[var(--text-tertiary)] text-small'>
                      Workflows
                    </div>
                    <div className='flex items-center justify-center gap-[10px]'>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <Button
                            variant='ghost'
                            className='translate-y-[-0.25px] p-[1px]'
                            onClick={handleImportWorkflow}
                            disabled={isImporting || !canEdit}
                          >
                            <ArrowDown className='h-[14px] w-[14px]' />
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content className='py-[2.5px]'>
                          <p>{isImporting ? 'Importing workflow...' : 'Import workflow'}</p>
                        </Tooltip.Content>
                      </Tooltip.Root>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <Button
                            variant='ghost'
                            className='mr-[1px] translate-y-[-0.25px] p-[1px]'
                            onClick={handleCreateFolder}
                            disabled={isCreatingFolder || !canEdit}
                          >
                            <FolderPlus className='h-[14px] w-[14px]' />
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content className='py-[2.5px]'>
                          <p>{isCreatingFolder ? 'Creating folder...' : 'Create folder'}</p>
                        </Tooltip.Content>
                      </Tooltip.Root>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <Button
                            variant='outline'
                            className='translate-y-[-0.25px] p-[1px]'
                            onClick={handleCreateWorkflow}
                            disabled={isCreatingWorkflow || !canEdit}
                          >
                            <Plus className='h-[14px] w-[14px]' />
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content className='py-[2.5px]'>
                          <p>{isCreatingWorkflow ? 'Creating workflow...' : 'Create workflow'}</p>
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </div>
                  </div>
                </div>

                {/* Scrollable workflow list */}
                <div
                  ref={scrollContainerRef}
                  className='mt-[6px] flex-1 overflow-y-auto overflow-x-hidden px-[8px]'
                >
                  <WorkflowList
                    regularWorkflows={regularWorkflows}
                    isLoading={isLoading}
                    isImporting={isImporting}
                    setIsImporting={setIsImporting}
                    fileInputRef={fileInputRef}
                    scrollContainerRef={scrollContainerRef}
                  />
                </div>
              </div>

              {/* Usage Indicator */}
              {isBillingEnabled && <UsageIndicator />}

              {/* Footer Navigation */}
              <div className='flex flex-shrink-0 flex-col gap-[2px] border-[var(--border)] border-t px-[7.75px] pt-[8px] pb-[8px]'>
                {footerNavigationItems.map((item) => {
                  const Icon = item.icon
                  const active = item.href ? pathname?.startsWith(item.href) : false
                  const baseClasses =
                    'group flex h-[25px] items-center gap-[8px] rounded-[8px] px-[5.5px] text-[14px] hover:bg-[var(--surface-9)]'
                  const activeClasses = active ? 'bg-[var(--surface-9)]' : ''
                  const textClasses = active
                    ? 'text-[var(--text-primary)]'
                    : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]'

                  const content = (
                    <>
                      <Icon className={`h-[14px] w-[14px] flex-shrink-0 ${textClasses}`} />
                      <span className={`truncate font-medium text-[13px] ${textClasses}`}>
                        {item.label}
                      </span>
                    </>
                  )

                  if (item.onClick) {
                    return (
                      <button
                        key={item.id}
                        type='button'
                        data-item-id={item.id}
                        className={`${baseClasses} ${activeClasses}`}
                        onClick={item.onClick}
                      >
                        {content}
                      </button>
                    )
                  }

                  return (
                    <Link
                      key={item.id}
                      href={item.href!}
                      data-item-id={item.id}
                      className={`${baseClasses} ${activeClasses}`}
                    >
                      {content}
                    </Link>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* Resize Handle - Only visible on workflow pages */}
          {isOnWorkflowPage && (
            <div
              className='fixed top-0 bottom-0 left-[calc(var(--sidebar-width)-4px)] z-20 w-[8px] cursor-ew-resize'
              onMouseDown={handleMouseDown}
              role='separator'
              aria-orientation='vertical'
              aria-label='Resize sidebar'
            />
          )}
        </>
      )}

      {/* Universal Search Modal */}
      <SearchModal
        open={isSearchModalOpen}
        onOpenChange={setIsSearchModalOpen}
        workflows={searchModalWorkflows}
        workspaces={searchModalWorkspaces}
        isOnWorkflowPage={!!workflowId}
      />

      {/* Footer Navigation Modals */}
      <HelpModal open={isHelpModalOpen} onOpenChange={setIsHelpModalOpen} />
      <SettingsModal
        open={isSettingsModalOpen}
        onOpenChange={(open) => (open ? openSettingsModal() : closeSettingsModal())}
      />

      {/* Hidden file input for workspace import */}
      <input
        ref={workspaceFileInputRef}
        type='file'
        accept='.zip'
        style={{ display: 'none' }}
        onChange={handleWorkspaceFileChange}
      />
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/index.ts

```typescript
export { HelpModal } from './help-modal/help-modal'
export { SearchModal } from './search-modal/search-modal'
export { SettingsModal } from './settings-modal/settings-modal'
export { UsageIndicator } from './usage-indicator/usage-indicator'
export { WorkflowList } from './workflow-list/workflow-list'
export { WorkspaceHeader } from './workspace-header'
```

--------------------------------------------------------------------------------

````
