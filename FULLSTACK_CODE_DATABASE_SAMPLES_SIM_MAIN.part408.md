---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 408
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 408 of 933)

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

---[FILE: use-change-detection.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/deploy/hooks/use-change-detection.ts
Signals: React

```typescript
import { useEffect, useMemo, useState } from 'react'
import { createLogger } from '@/lib/logs/console/logger'
import { useDebounce } from '@/hooks/use-debounce'
import { useOperationQueueStore } from '@/stores/operation-queue/store'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'
import type { WorkflowState } from '@/stores/workflows/workflow/types'

const logger = createLogger('useChangeDetection')

interface UseChangeDetectionProps {
  workflowId: string | null
  deployedState: WorkflowState | null
  isLoadingDeployedState: boolean
}

/**
 * Hook to detect changes between current workflow state and deployed state
 * Uses API-based change detection for accuracy
 */
export function useChangeDetection({
  workflowId,
  deployedState,
  isLoadingDeployedState,
}: UseChangeDetectionProps) {
  const [changeDetected, setChangeDetected] = useState(false)
  const [blockStructureVersion, setBlockStructureVersion] = useState(0)
  const [edgeStructureVersion, setEdgeStructureVersion] = useState(0)
  const [subBlockStructureVersion, setSubBlockStructureVersion] = useState(0)

  // Get current store state for change detection
  const currentBlocks = useWorkflowStore((state) => state.blocks)
  const currentEdges = useWorkflowStore((state) => state.edges)
  const lastSaved = useWorkflowStore((state) => state.lastSaved)
  const subBlockValues = useSubBlockStore((state) =>
    workflowId ? state.workflowValues[workflowId] : null
  )

  // Track structure changes
  useEffect(() => {
    setBlockStructureVersion((version) => version + 1)
  }, [currentBlocks])

  useEffect(() => {
    setEdgeStructureVersion((version) => version + 1)
  }, [currentEdges])

  useEffect(() => {
    setSubBlockStructureVersion((version) => version + 1)
  }, [subBlockValues])

  // Reset version counters when workflow changes
  useEffect(() => {
    setBlockStructureVersion(0)
    setEdgeStructureVersion(0)
    setSubBlockStructureVersion(0)
  }, [workflowId])

  // Create trigger for status check
  const statusCheckTrigger = useMemo(() => {
    return JSON.stringify({
      lastSaved: lastSaved ?? 0,
      blockVersion: blockStructureVersion,
      edgeVersion: edgeStructureVersion,
      subBlockVersion: subBlockStructureVersion,
    })
  }, [lastSaved, blockStructureVersion, edgeStructureVersion, subBlockStructureVersion])

  const debouncedStatusCheckTrigger = useDebounce(statusCheckTrigger, 500)

  useEffect(() => {
    // Avoid off-by-one false positives: wait until operation queue is idle
    const { operations, isProcessing } = useOperationQueueStore.getState()
    const hasPendingOps =
      isProcessing || operations.some((op) => op.status === 'pending' || op.status === 'processing')

    if (!workflowId || !deployedState) {
      setChangeDetected(false)
      return
    }

    if (isLoadingDeployedState || hasPendingOps) {
      return
    }

    // Use the workflow status API to get accurate change detection
    // This uses the same logic as the deployment API (reading from normalized tables)
    const checkForChanges = async () => {
      try {
        const response = await fetch(`/api/workflows/${workflowId}/status`)
        if (response.ok) {
          const data = await response.json()
          setChangeDetected(data.needsRedeployment || false)
        } else {
          logger.error('Failed to fetch workflow status:', response.status, response.statusText)
          setChangeDetected(false)
        }
      } catch (error) {
        logger.error('Error fetching workflow status:', error)
        setChangeDetected(false)
      }
    }

    checkForChanges()
  }, [workflowId, deployedState, debouncedStatusCheckTrigger, isLoadingDeployedState])

  return {
    changeDetected,
    setChangeDetected,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-deployed-state.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/deploy/hooks/use-deployed-state.ts
Signals: React

```typescript
import { useEffect, useState } from 'react'
import { createLogger } from '@/lib/logs/console/logger'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import type { WorkflowState } from '@/stores/workflows/workflow/types'

const logger = createLogger('useDeployedState')

interface UseDeployedStateProps {
  workflowId: string | null
  isDeployed: boolean
  isRegistryLoading: boolean
}

/**
 * Hook to fetch and manage deployed workflow state
 * Includes race condition protection for workflow changes
 */
export function useDeployedState({
  workflowId,
  isDeployed,
  isRegistryLoading,
}: UseDeployedStateProps) {
  const [deployedState, setDeployedState] = useState<WorkflowState | null>(null)
  const [isLoadingDeployedState, setIsLoadingDeployedState] = useState<boolean>(false)

  const setNeedsRedeploymentFlag = useWorkflowRegistry(
    (state) => state.setWorkflowNeedsRedeployment
  )

  /**
   * Fetches the deployed state of the workflow from the server
   * This is the single source of truth for deployed workflow state
   */
  const fetchDeployedState = async () => {
    if (!workflowId || !isDeployed) {
      setDeployedState(null)
      return
    }

    // Store the workflow ID at the start of the request to prevent race conditions
    const requestWorkflowId = workflowId

    // Helper to get current active workflow ID for race condition checks
    const getCurrentActiveWorkflowId = () => useWorkflowRegistry.getState().activeWorkflowId

    try {
      setIsLoadingDeployedState(true)

      const response = await fetch(`/api/workflows/${requestWorkflowId}/deployed`)

      // Check if the workflow ID changed during the request (user navigated away)
      if (requestWorkflowId !== getCurrentActiveWorkflowId()) {
        logger.debug('Workflow changed during deployed state fetch, ignoring response')
        return
      }

      if (!response.ok) {
        if (response.status === 404) {
          setDeployedState(null)
          return
        }
        throw new Error(`Failed to fetch deployed state: ${response.statusText}`)
      }

      const data = await response.json()

      if (requestWorkflowId === getCurrentActiveWorkflowId()) {
        setDeployedState(data.deployedState || null)
      } else {
        logger.debug('Workflow changed after deployed state response, ignoring result')
      }
    } catch (error) {
      logger.error('Error fetching deployed state:', { error })
      if (requestWorkflowId === getCurrentActiveWorkflowId()) {
        setDeployedState(null)
      }
    } finally {
      if (requestWorkflowId === getCurrentActiveWorkflowId()) {
        setIsLoadingDeployedState(false)
      }
    }
  }

  useEffect(() => {
    if (!workflowId) {
      setDeployedState(null)
      setIsLoadingDeployedState(false)
      return
    }

    if (isRegistryLoading) {
      setDeployedState(null)
      setIsLoadingDeployedState(false)
      return
    }

    if (isDeployed) {
      setNeedsRedeploymentFlag(workflowId, false)
      fetchDeployedState()
    } else {
      setDeployedState(null)
      setIsLoadingDeployedState(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowId, isDeployed, isRegistryLoading, setNeedsRedeploymentFlag])

  return {
    deployedState,
    isLoadingDeployedState,
    refetchDeployedState: fetchDeployedState,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-deployment.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/deploy/hooks/use-deployment.ts
Signals: React

```typescript
import { useCallback, useState } from 'react'
import { createLogger } from '@/lib/logs/console/logger'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

const logger = createLogger('useDeployment')

interface UseDeploymentProps {
  workflowId: string | null
  isDeployed: boolean
  refetchDeployedState: () => Promise<void>
}

/**
 * Hook to manage deployment operations (deploy, undeploy, redeploy)
 */
export function useDeployment({
  workflowId,
  isDeployed,
  refetchDeployedState,
}: UseDeploymentProps) {
  const [isDeploying, setIsDeploying] = useState(false)
  const setDeploymentStatus = useWorkflowRegistry((state) => state.setDeploymentStatus)

  /**
   * Handle initial deployment and open modal
   */
  const handleDeployClick = useCallback(async () => {
    if (!workflowId) return { success: false, shouldOpenModal: false }

    // If undeployed, deploy first then open modal
    if (!isDeployed) {
      setIsDeploying(true)
      try {
        const response = await fetch(`/api/workflows/${workflowId}/deploy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            deployChatEnabled: false,
          }),
        })

        if (response.ok) {
          const responseData = await response.json()
          const isDeployedStatus = responseData.isDeployed ?? false
          const deployedAtTime = responseData.deployedAt
            ? new Date(responseData.deployedAt)
            : undefined
          setDeploymentStatus(
            workflowId,
            isDeployedStatus,
            deployedAtTime,
            responseData.apiKey || ''
          )
          await refetchDeployedState()
          return { success: true, shouldOpenModal: true }
        }
        return { success: false, shouldOpenModal: true }
      } catch (error) {
        logger.error('Error deploying workflow:', error)
        return { success: false, shouldOpenModal: true }
      } finally {
        setIsDeploying(false)
      }
    }

    // If already deployed, just signal to open modal
    return { success: true, shouldOpenModal: true }
  }, [workflowId, isDeployed, refetchDeployedState, setDeploymentStatus])

  return {
    isDeploying,
    handleDeployClick,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: editor.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/editor.tsx
Signals: React

```typescript
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { BookOpen, Check, ChevronUp, Pencil, RepeatIcon, Settings, SplitIcon } from 'lucide-react'
import { Button, Tooltip } from '@/components/emcn'
import { useUserPermissionsContext } from '@/app/workspace/[workspaceId]/providers/workspace-permissions-provider'
import {
  ConnectionBlocks,
  SubBlock,
  SubflowEditor,
} from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components'
import {
  useBlockConnections,
  useConnectionsResize,
  useEditorBlockProperties,
  useEditorSubblockLayout,
} from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/hooks'
import { getSubBlockStableKey } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/workflow-block/utils'
import { useCurrentWorkflow } from '@/app/workspace/[workspaceId]/w/[workflowId]/hooks'
import { getBlock } from '@/blocks/registry'
import { useCollaborativeWorkflow } from '@/hooks/use-collaborative-workflow'
import { usePanelEditorStore } from '@/stores/panel/editor/store'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'

/**
 * Icon component for rendering block icons.
 *
 * @param icon - The icon component to render
 * @param className - Optional CSS classes
 * @returns Rendered icon or null if no icon provided
 */
const IconComponent = ({ icon: Icon, className }: { icon: any; className?: string }) => {
  if (!Icon) return null
  return <Icon className={className} />
}

/**
 * Editor panel component.
 * Provides editor configuration and customization options for the workflow.
 *
 * @returns Editor panel content
 */
export function Editor() {
  const { currentBlockId, connectionsHeight, toggleConnectionsCollapsed } = usePanelEditorStore()
  const currentWorkflow = useCurrentWorkflow()
  const currentBlock = currentBlockId ? currentWorkflow.getBlockById(currentBlockId) : null
  const blockConfig = currentBlock ? getBlock(currentBlock.type) : null
  const title = currentBlock?.name || 'Editor'

  // Check if selected block is a subflow (loop or parallel)
  const isSubflow =
    currentBlock && (currentBlock.type === 'loop' || currentBlock.type === 'parallel')

  // Get subflow display properties
  const subflowIcon = isSubflow && currentBlock.type === 'loop' ? RepeatIcon : SplitIcon
  const subflowBgColor = isSubflow && currentBlock.type === 'loop' ? '#2FB3FF' : '#FEE12B'

  // Refs for resize functionality
  const subBlocksRef = useRef<HTMLDivElement>(null)

  // Get user permissions
  const userPermissions = useUserPermissionsContext()

  // Get active workflow ID
  const activeWorkflowId = useWorkflowRegistry((state) => state.activeWorkflowId)

  // Get block properties (advanced/trigger modes)
  const { advancedMode, triggerMode } = useEditorBlockProperties(
    currentBlockId,
    currentWorkflow.isSnapshotView
  )

  // Subscribe to block's subblock values
  const blockSubBlockValues = useSubBlockStore(
    useCallback(
      (state) => {
        if (!activeWorkflowId || !currentBlockId) return {}
        return state.workflowValues[activeWorkflowId]?.[currentBlockId] || {}
      },
      [activeWorkflowId, currentBlockId]
    )
  )

  // Get subblock layout using custom hook
  const { subBlocks, stateToUse: subBlockState } = useEditorSubblockLayout(
    blockConfig || ({} as any),
    currentBlockId || '',
    advancedMode,
    triggerMode,
    activeWorkflowId,
    blockSubBlockValues,
    currentWorkflow.isSnapshotView
  )

  // Get block connections
  const { incomingConnections, hasIncomingConnections } = useBlockConnections(currentBlockId || '')

  // Connections resize hook
  const { handleMouseDown: handleConnectionsResizeMouseDown, isResizing } = useConnectionsResize({
    subBlocksRef,
  })

  // Collaborative actions
  const { collaborativeToggleBlockAdvancedMode, collaborativeUpdateBlockName } =
    useCollaborativeWorkflow()

  // Rename state
  const [isRenaming, setIsRenaming] = useState(false)
  const [editedName, setEditedName] = useState('')
  const nameInputRef = useRef<HTMLInputElement>(null)

  // Mode toggle handlers
  const handleToggleAdvancedMode = useCallback(() => {
    if (currentBlockId && userPermissions.canEdit) {
      collaborativeToggleBlockAdvancedMode(currentBlockId)
    }
  }, [currentBlockId, userPermissions.canEdit, collaborativeToggleBlockAdvancedMode])

  /**
   * Handles starting the rename process.
   */
  const handleStartRename = useCallback(() => {
    if (!userPermissions.canEdit || !currentBlock) return
    setEditedName(currentBlock.name || '')
    setIsRenaming(true)
  }, [userPermissions.canEdit, currentBlock])

  /**
   * Handles saving the renamed block.
   */
  const handleSaveRename = useCallback(() => {
    if (!currentBlockId || !isRenaming) return

    const trimmedName = editedName.trim()
    if (trimmedName && trimmedName !== currentBlock?.name) {
      collaborativeUpdateBlockName(currentBlockId, trimmedName)
    }
    setIsRenaming(false)
  }, [currentBlockId, isRenaming, editedName, currentBlock?.name, collaborativeUpdateBlockName])

  /**
   * Handles canceling the rename process.
   */
  const handleCancelRename = useCallback(() => {
    setIsRenaming(false)
    setEditedName('')
  }, [])

  // Focus input when entering rename mode
  useEffect(() => {
    if (isRenaming && nameInputRef.current) {
      nameInputRef.current.select()
    }
  }, [isRenaming])

  /**
   * Handles opening documentation link in a new secure tab.
   */
  const handleOpenDocs = () => {
    if (blockConfig?.docsLink) {
      window.open(blockConfig.docsLink, '_blank', 'noopener,noreferrer')
    }
  }

  // Check if block has advanced mode or trigger mode available
  const hasAdvancedMode = blockConfig?.subBlocks?.some((sb) => sb.mode === 'advanced')

  // Determine if connections are at minimum height (collapsed state)
  const isConnectionsAtMinHeight = connectionsHeight <= 35

  return (
    <div className='flex h-full flex-col'>
      {/* Header */}
      <div className='flex flex-shrink-0 items-center justify-between rounded-[4px] bg-[var(--surface-5)] px-[12px] py-[8px]'>
        <div className='flex min-w-0 flex-1 items-center gap-[8px]'>
          {(blockConfig || isSubflow) && (
            <div
              className='flex h-[18px] w-[18px] items-center justify-center rounded-[4px]'
              style={{ background: isSubflow ? subflowBgColor : blockConfig?.bgColor }}
            >
              <IconComponent
                icon={isSubflow ? subflowIcon : blockConfig?.icon}
                className='h-[12px] w-[12px] text-[var(--white)]'
              />
            </div>
          )}
          {isRenaming ? (
            <input
              ref={nameInputRef}
              type='text'
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleSaveRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveRename()
                } else if (e.key === 'Escape') {
                  handleCancelRename()
                }
              }}
              className='min-w-0 flex-1 truncate bg-transparent pr-[8px] font-medium text-[14px] text-[var(--text-primary)] outline-none'
            />
          ) : (
            <h2
              className='min-w-0 flex-1 cursor-pointer select-none truncate pr-[8px] font-medium text-[14px] text-[var(--text-primary)]'
              title={title}
              onDoubleClick={handleStartRename}
              onMouseDown={(e) => {
                if (e.detail === 2) {
                  e.preventDefault()
                }
              }}
            >
              {title}
            </h2>
          )}
        </div>
        <div className='flex shrink-0 items-center gap-[8px]'>
          {/* Rename button */}
          {currentBlock && !isSubflow && (
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Button
                  variant='ghost'
                  className='p-0'
                  onClick={isRenaming ? handleSaveRename : handleStartRename}
                  disabled={!userPermissions.canEdit}
                  aria-label={isRenaming ? 'Save name' : 'Rename block'}
                >
                  {isRenaming ? (
                    <Check className='h-[14px] w-[14px]' />
                  ) : (
                    <Pencil className='h-[14px] w-[14px]' />
                  )}
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content side='top'>
                <p>{isRenaming ? 'Save name' : 'Rename block'}</p>
              </Tooltip.Content>
            </Tooltip.Root>
          )}
          {/* Focus on block button */}
          {/* {currentBlock && (
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Button
                  variant='ghost'
                  className='p-0'
                  onClick={handleFocusOnBlock}
                  aria-label='Focus on block'
                >
                  <Crosshair className='h-[14px] w-[14px]' />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content side='top'>
                <p>Focus on block</p>
              </Tooltip.Content>
            </Tooltip.Root>
          )} */}
          {/* Mode toggles - Only show for regular blocks, not subflows */}
          {currentBlock && !isSubflow && hasAdvancedMode && (
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Button
                  variant='ghost'
                  className='p-0'
                  onClick={handleToggleAdvancedMode}
                  disabled={!userPermissions.canEdit}
                  aria-label='Toggle advanced mode'
                >
                  <Settings className='h-[14px] w-[14px]' />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content side='top'>
                <p>Advanced mode</p>
              </Tooltip.Content>
            </Tooltip.Root>
          )}
          {currentBlock && !isSubflow && blockConfig?.docsLink && (
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Button
                  variant='ghost'
                  className='p-0'
                  onClick={handleOpenDocs}
                  aria-label='Open documentation'
                >
                  <BookOpen className='h-[14px] w-[14px]' />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content side='top'>
                <p>Open docs</p>
              </Tooltip.Content>
            </Tooltip.Root>
          )}
        </div>
      </div>

      {!currentBlockId || !currentBlock ? (
        <div className='flex flex-1 items-center justify-center text-[#8D8D8D] text-[13px]'>
          Select a block to edit
        </div>
      ) : isSubflow ? (
        <SubflowEditor
          currentBlock={currentBlock}
          currentBlockId={currentBlockId}
          subBlocksRef={subBlocksRef}
          connectionsHeight={connectionsHeight}
          isResizing={isResizing}
          hasIncomingConnections={hasIncomingConnections}
          incomingConnections={incomingConnections}
          handleConnectionsResizeMouseDown={handleConnectionsResizeMouseDown}
          toggleConnectionsCollapsed={toggleConnectionsCollapsed}
          userCanEdit={userPermissions.canEdit}
          isConnectionsAtMinHeight={isConnectionsAtMinHeight}
        />
      ) : (
        <div className='flex flex-1 flex-col overflow-hidden pt-[0px]'>
          {/* Subblocks Section */}
          <div
            ref={subBlocksRef}
            className='subblocks-section flex flex-1 flex-col overflow-hidden'
          >
            <div className='flex-1 overflow-y-auto overflow-x-hidden px-[8px] pt-[8px] pb-[8px]'>
              {subBlocks.length === 0 ? (
                <div className='flex h-full items-center justify-center text-center text-[#8D8D8D] text-[13px]'>
                  This block has no subblocks
                </div>
              ) : (
                <div className='flex flex-col'>
                  {subBlocks.map((subBlock, index) => {
                    const stableKey = getSubBlockStableKey(
                      currentBlockId || '',
                      subBlock,
                      subBlockState
                    )

                    return (
                      <div key={stableKey}>
                        <SubBlock
                          blockId={currentBlockId}
                          config={subBlock}
                          isPreview={false}
                          subBlockValues={subBlockState}
                          disabled={!userPermissions.canEdit}
                          fieldDiffStatus={undefined}
                          allowExpandInPreview={false}
                        />
                        {index < subBlocks.length - 1 && (
                          <div className='px-[2px] pt-[16px] pb-[13px]'>
                            <div
                              className='h-[1.25px]'
                              style={{
                                backgroundImage:
                                  'repeating-linear-gradient(to right, var(--border) 0px, var(--border) 6px, transparent 6px, transparent 12px)',
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Connections Section - Only show when there are connections */}
          {hasIncomingConnections && (
            <div
              className={
                'connections-section flex flex-shrink-0 flex-col overflow-hidden border-[var(--border)] border-t' +
                (!isResizing ? ' transition-[height] duration-100 ease-out' : '')
              }
              style={{ height: `${connectionsHeight}px` }}
            >
              {/* Resize Handle */}
              <div className='relative'>
                <div
                  className='absolute top-[-4px] right-0 left-0 z-30 h-[8px] cursor-ns-resize'
                  onMouseDown={handleConnectionsResizeMouseDown}
                />
              </div>

              {/* Connections Header with Chevron */}
              <div
                className='flex flex-shrink-0 cursor-pointer items-center gap-[8px] px-[10px] pt-[5px] pb-[5px]'
                onClick={toggleConnectionsCollapsed}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggleConnectionsCollapsed()
                  }
                }}
                role='button'
                tabIndex={0}
                aria-label={
                  isConnectionsAtMinHeight ? 'Expand connections' : 'Collapse connections'
                }
              >
                <ChevronUp
                  className={
                    'h-[14px] w-[14px] transition-transform' +
                    (!isConnectionsAtMinHeight ? ' rotate-180' : '')
                  }
                />
                <div className='font-medium text-[13px] text-[var(--text-primary)]'>
                  Connections
                </div>
              </div>

              {/* Connections Content - Always visible */}
              <div className='flex-1 overflow-y-auto overflow-x-hidden px-[6px] pb-[8px]'>
                <ConnectionBlocks
                  connections={incomingConnections}
                  currentBlockId={currentBlock.id}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/index.ts

```typescript
export { ConnectionBlocks } from './connection-blocks/connection-blocks'
export { SubBlock } from './sub-block/sub-block'
export { SubflowEditor } from './subflow-editor/subflow-editor'
```

--------------------------------------------------------------------------------

---[FILE: connection-blocks.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/connection-blocks/connection-blocks.tsx
Signals: React

```typescript
'use client'

import { useCallback, useRef, useState } from 'react'
import clsx from 'clsx'
import { ChevronDown, RepeatIcon, SplitIcon } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { createLogger } from '@/lib/logs/console/logger'
import {
  FieldItem,
  type SchemaField,
  TREE_SPACING,
} from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/connection-blocks/components/field-item/field-item'
import type { ConnectedBlock } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/hooks/use-block-connections'
import { useBlockOutputFields } from '@/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-block-output-fields'
import { getBlock } from '@/blocks/registry'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'

const logger = createLogger('ConnectionBlocks')

interface ConnectionBlocksProps {
  connections: ConnectedBlock[]
  currentBlockId: string
}

const TREE_STYLES = {
  LINE_COLOR: 'var(--border)',
  LINE_OFFSET: 4,
} as const

/**
 * Calculates total height of visible nested fields recursively
 */
const calculateFieldsHeight = (
  fields: SchemaField[] | undefined,
  parentPath: string,
  connectionId: string,
  isExpanded: (connectionId: string, path: string) => boolean
): number => {
  if (!fields || fields.length === 0) return 0

  let totalHeight = 0

  fields.forEach((field, index) => {
    const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name
    const expanded = isExpanded(connectionId, fieldPath)

    totalHeight += TREE_SPACING.ITEM_HEIGHT

    if (index < fields.length - 1) {
      totalHeight += TREE_SPACING.ITEM_GAP
    }

    if (expanded && field.children && field.children.length > 0) {
      totalHeight += TREE_SPACING.ITEM_GAP
      totalHeight += calculateFieldsHeight(field.children, fieldPath, connectionId, isExpanded)
    }
  })

  return totalHeight
}

interface ConnectionItemProps {
  connection: ConnectedBlock
  isExpanded: boolean
  onToggleExpand: (connectionId: string) => void
  isFieldExpanded: (connectionId: string, fieldPath: string) => boolean
  onConnectionDragStart: (e: React.DragEvent, connection: ConnectedBlock) => void
  renderFieldTree: (
    fields: SchemaField[],
    parentPath: string,
    level: number,
    connection: ConnectedBlock
  ) => React.ReactNode
  connectionRef: (el: HTMLDivElement | null) => void
  mergedSubBlocks: Record<string, any>
  sourceBlock: { triggerMode?: boolean } | undefined
}

/**
 * Individual connection item component that uses the hook
 */
function ConnectionItem({
  connection,
  isExpanded,
  onToggleExpand,
  isFieldExpanded,
  onConnectionDragStart,
  renderFieldTree,
  connectionRef,
  mergedSubBlocks,
  sourceBlock,
}: ConnectionItemProps) {
  const blockConfig = getBlock(connection.type)

  const fields = useBlockOutputFields({
    blockId: connection.id,
    blockType: connection.type,
    mergedSubBlocks,
    responseFormat: connection.responseFormat,
    operation: connection.operation,
    triggerMode: sourceBlock?.triggerMode,
  })
  const hasFields = fields.length > 0

  let Icon = blockConfig?.icon
  let bgColor = blockConfig?.bgColor || '#6B7280'

  if (!blockConfig) {
    if (connection.type === 'loop') {
      Icon = RepeatIcon as typeof Icon
      bgColor = '#2FB3FF'
    } else if (connection.type === 'parallel') {
      Icon = SplitIcon as typeof Icon
      bgColor = '#FEE12B'
    }
  }

  return (
    <div className='mb-[2px] last:mb-0' ref={connectionRef}>
      <div
        draggable
        onDragStart={(e) => onConnectionDragStart(e, connection)}
        className={clsx(
          'group flex h-[25px] cursor-grab items-center gap-[8px] rounded-[8px] px-[5.5px] text-[14px] hover:bg-[var(--border)] active:cursor-grabbing',
          hasFields && 'cursor-pointer'
        )}
        onClick={() => hasFields && onToggleExpand(connection.id)}
      >
        <div
          className='relative flex h-[16px] w-[16px] flex-shrink-0 items-center justify-center overflow-hidden rounded-[4px]'
          style={{ background: bgColor }}
        >
          {Icon && (
            <Icon
              className={clsx(
                'text-white transition-transform duration-200',
                hasFields && 'group-hover:scale-110',
                '!h-[10px] !w-[10px]'
              )}
            />
          )}
        </div>
        <span
          className={clsx(
            'truncate font-medium',
            'text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]'
          )}
        >
          {connection.name}
        </span>
        {hasFields && (
          <ChevronDown
            className={clsx(
              'h-3.5 w-3.5 flex-shrink-0 transition-transform',
              'text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]',
              isExpanded && 'rotate-180'
            )}
          />
        )}
      </div>

      {isExpanded && hasFields && (
        <div className='relative'>
          <div
            className='pointer-events-none absolute'
            style={{
              left: `${TREE_SPACING.VERTICAL_LINE_LEFT_OFFSET}px`,
              top: `${TREE_STYLES.LINE_OFFSET}px`,
              width: '1px',
              height: `${calculateFieldsHeight(fields, '', connection.id, isFieldExpanded) - TREE_STYLES.LINE_OFFSET * 2}px`,
              background: TREE_STYLES.LINE_COLOR,
            }}
          />
          {renderFieldTree(fields, '', 0, connection)}
        </div>
      )}
    </div>
  )
}

/**
 * Connection blocks component that displays incoming connections with their schemas
 */
export function ConnectionBlocks({ connections, currentBlockId }: ConnectionBlocksProps) {
  const [expandedConnections, setExpandedConnections] = useState<Set<string>>(new Set())
  const [expandedFieldPaths, setExpandedFieldPaths] = useState<Set<string>>(new Set())
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const connectionRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const { blocks } = useWorkflowStore(
    useShallow((state) => ({
      blocks: state.blocks,
    }))
  )

  const workflowId = useWorkflowRegistry((state) => state.activeWorkflowId)
  const workflowSubBlockValues = useSubBlockStore((state) =>
    workflowId ? (state.workflowValues[workflowId] ?? {}) : {}
  )

  const getMergedSubBlocks = useCallback(
    (sourceBlockId: string): Record<string, any> => {
      const base = blocks[sourceBlockId]?.subBlocks || {}
      const live = workflowSubBlockValues?.[sourceBlockId] || {}
      const merged: Record<string, any> = { ...base }
      for (const [subId, liveVal] of Object.entries(live)) {
        merged[subId] = { ...(base[subId] || {}), value: liveVal }
      }
      return merged
    },
    [blocks, workflowSubBlockValues]
  )

  const toggleConnectionExpansion = useCallback((connectionId: string) => {
    setExpandedConnections((prev) => {
      const newSet = new Set(prev)
      const isExpanding = !newSet.has(connectionId)

      if (newSet.has(connectionId)) {
        newSet.delete(connectionId)
      } else {
        newSet.add(connectionId)
      }

      if (isExpanding) {
        setTimeout(() => {
          const connectionElement = connectionRefs.current.get(connectionId)
          const scrollContainer = scrollContainerRef.current

          if (connectionElement && scrollContainer) {
            const containerRect = scrollContainer.getBoundingClientRect()
            const elementRect = connectionElement.getBoundingClientRect()
            const scrollOffset = elementRect.top - containerRect.top + scrollContainer.scrollTop

            scrollContainer.scrollTo({
              top: scrollOffset,
              behavior: 'smooth',
            })
          }
        }, 0)
      }

      return newSet
    })
  }, [])

  const toggleFieldExpansion = useCallback((connectionId: string, fieldPath: string) => {
    setExpandedFieldPaths((prev) => {
      const next = new Set(prev)
      const key = `${connectionId}|${fieldPath}`
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }, [])

  const isFieldExpanded = useCallback(
    (connectionId: string, fieldPath: string) =>
      expandedFieldPaths.has(`${connectionId}|${fieldPath}`),
    [expandedFieldPaths]
  )

  const handleConnectionDragStart = useCallback(
    (e: React.DragEvent, connection: ConnectedBlock) => {
      const normalizedBlockName = connection.name.replace(/\s+/g, '').toLowerCase()

      e.dataTransfer.setData(
        'application/json',
        JSON.stringify({
          type: 'connectionBlock',
          connectionData: {
            sourceBlockId: connection.id,
            tag: normalizedBlockName,
            blockName: connection.name,
            fieldName: null,
            fieldType: 'connection',
          },
        })
      )
      e.dataTransfer.effectAllowed = 'copy'

      logger.info('Connection block drag started', {
        tag: normalizedBlockName,
        blockName: connection.name,
      })
    },
    []
  )

  const renderFieldTree = useCallback(
    (fields: SchemaField[], parentPath: string, level: number, connection: ConnectedBlock) => {
      return fields.map((field) => {
        const fieldPath = parentPath ? `${parentPath}.${field.name}` : field.name
        const hasChildren = !!(field.children && field.children.length > 0)
        const expanded = isFieldExpanded(connection.id, fieldPath)

        return (
          <div key={fieldPath}>
            <FieldItem
              connection={connection}
              field={field}
              path={fieldPath}
              level={level}
              hasChildren={hasChildren}
              isExpanded={expanded}
              onToggleExpand={(p) => toggleFieldExpansion(connection.id, p)}
            />
            {hasChildren && expanded && (
              <div className='relative'>
                <div
                  className='pointer-events-none absolute'
                  style={{
                    left: `${TREE_SPACING.BASE_INDENT + level * TREE_SPACING.INDENT_PER_LEVEL + TREE_SPACING.VERTICAL_LINE_LEFT_OFFSET}px`,
                    top: `${TREE_STYLES.LINE_OFFSET}px`,
                    width: '1px',
                    height: `${calculateFieldsHeight(field.children, fieldPath, connection.id, isFieldExpanded) - TREE_STYLES.LINE_OFFSET * 2}px`,
                    background: TREE_STYLES.LINE_COLOR,
                  }}
                />
                <div>{renderFieldTree(field.children!, fieldPath, level + 1, connection)}</div>
              </div>
            )}
          </div>
        )
      })
    },
    [isFieldExpanded, toggleFieldExpansion]
  )

  if (!connections || connections.length === 0) {
    return null
  }

  return (
    <div ref={scrollContainerRef} className='space-y-[2px]'>
      {connections.map((connection) => {
        const mergedSubBlocks = getMergedSubBlocks(connection.id)
        const sourceBlock = blocks[connection.id]

        return (
          <ConnectionItem
            key={connection.id}
            connection={connection}
            isExpanded={expandedConnections.has(connection.id)}
            onToggleExpand={toggleConnectionExpansion}
            isFieldExpanded={isFieldExpanded}
            onConnectionDragStart={handleConnectionDragStart}
            renderFieldTree={renderFieldTree}
            connectionRef={(el) => {
              if (el) {
                connectionRefs.current.set(connection.id, el)
              } else {
                connectionRefs.current.delete(connection.id)
              }
            }}
            mergedSubBlocks={mergedSubBlocks}
            sourceBlock={sourceBlock}
          />
        )
      })}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/connection-blocks/index.ts

```typescript
export { ConnectionBlocks } from './connection-blocks'
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/connection-blocks/components/index.ts

```typescript
export { FieldItem } from './field-item/field-item'
```

--------------------------------------------------------------------------------

````
