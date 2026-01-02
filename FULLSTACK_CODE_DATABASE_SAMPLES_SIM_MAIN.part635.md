---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 635
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 635 of 933)

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

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/notifications/store.ts

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('NotificationStore')

/**
 * Notification action configuration
 * Stores serializable data - handlers are reconstructed at runtime
 */
export interface NotificationAction {
  /**
   * Action type identifier for handler reconstruction
   */
  type: 'copilot' | 'refresh'

  /**
   * Message or data to pass to the action handler.
   *
   * For:
   * - {@link NotificationAction.type} = `copilot` - message sent to Copilot
   * - {@link NotificationAction.type} = `refresh` - optional context, not required for the action
   */
  message: string
}

/**
 * Core notification data structure
 */
export interface Notification {
  /**
   * Unique identifier for the notification
   */
  id: string

  /**
   * Notification severity level
   */
  level: 'info' | 'error'

  /**
   * Message to display to the user
   */
  message: string

  /**
   * Optional action to execute when user clicks the action button
   */
  action?: NotificationAction

  /**
   * Timestamp when notification was created
   */
  createdAt: number

  /**
   * Optional workflow ID - if provided, notification is workflow-specific
   * If omitted, notification is shown across all workflows
   */
  workflowId?: string
}

/**
 * Parameters for adding a new notification
 * Omits auto-generated fields (id, createdAt)
 */
export type AddNotificationParams = Omit<Notification, 'id' | 'createdAt'>

interface NotificationStore {
  /**
   * Array of active notifications (newest first)
   */
  notifications: Notification[]

  /**
   * Adds a new notification to the stack
   *
   * @param params - Notification parameters
   * @returns The created notification ID
   */
  addNotification: (params: AddNotificationParams) => string

  /**
   * Removes a notification by ID
   *
   * @param id - Notification ID to remove
   */
  removeNotification: (id: string) => void

  /**
   * Gets notifications for a specific workflow
   * Returns both global notifications (no workflowId) and workflow-specific notifications
   *
   * @param workflowId - The workflow ID to filter by
   * @returns Array of notifications for the workflow
   */
  getNotificationsForWorkflow: (workflowId: string) => Notification[]

  /**
   * Clears notifications.
   *
   * When a workflow ID is provided, this removes:
   * - All notifications scoped to that workflow.
   * - Global notifications (without a workflowId), since they are visible in all workflows.
   *
   * When omitted, all notifications are cleared.
   *
   * @param workflowId - Optional workflow ID to scope the clear operation.
   */
  clearNotifications: (workflowId?: string) => void
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (params: AddNotificationParams) => {
        const id = crypto.randomUUID()

        const notification: Notification = {
          id,
          level: params.level,
          message: params.message,
          action: params.action,
          createdAt: Date.now(),
          workflowId: params.workflowId,
        }

        set((state) => ({
          notifications: [notification, ...state.notifications],
        }))

        logger.info('Notification added', {
          id,
          level: params.level,
          message: params.message,
          workflowId: params.workflowId,
          actionType: params.action?.type,
        })

        return id
      },

      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }))

        logger.info('Notification removed', { id })
      },

      getNotificationsForWorkflow: (workflowId: string) => {
        return get().notifications.filter((n) => !n.workflowId || n.workflowId === workflowId)
      },

      clearNotifications: (workflowId?: string) => {
        set((state) => {
          if (!workflowId) {
            return { notifications: [] }
          }

          return {
            notifications: state.notifications.filter(
              (notification) =>
                // Keep notifications for other workflows only.
                notification.workflowId && notification.workflowId !== workflowId
            ),
          }
        })
      },
    }),
    {
      name: 'notification-storage',
      /**
       * Only persist workflow-level notifications.
       * Global notifications (without a workflowId) are kept in memory only.
       */
      partialize: (state): Pick<NotificationStore, 'notifications'> => ({
        notifications: state.notifications.filter((notification) => !!notification.workflowId),
      }),
    }
  )
)
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/stores/notifications/utils.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { useCopilotStore } from '@/stores/panel/copilot/store'
import { usePanelStore } from '@/stores/panel/store'

const logger = createLogger('NotificationUtils')

/**
 * Opens the copilot panel and directly sends the message.
 *
 * @param message - The message to send in the copilot.
 */
export function openCopilotWithMessage(message: string): void {
  try {
    const trimmedMessage = message.trim()

    // Avoid sending empty/whitespace messages
    if (!trimmedMessage) {
      logger.warn('openCopilotWithMessage called with empty message')
      return
    }

    // Switch to copilot tab
    const panelStore = usePanelStore.getState()
    panelStore.setActiveTab('copilot')

    // Read current copilot state
    const copilotStore = useCopilotStore.getState()

    // If workflowId is not set, sendMessage will early-return; surface that explicitly
    if (!copilotStore.workflowId) {
      logger.warn('Copilot workflowId is not set, skipping sendMessage', {
        messageLength: trimmedMessage.length,
      })
      return
    }

    // Avoid overlapping sends; let existing stream finish/abort first
    if (copilotStore.isSendingMessage) {
      logger.warn('Copilot is already sending a message, skipping new send', {
        messageLength: trimmedMessage.length,
      })
      return
    }

    void copilotStore.sendMessage(trimmedMessage, { stream: true }).catch((error) => {
      logger.error('Failed to send message to copilot', { error })
    })

    logger.info('Opened copilot and sent message', { messageLength: trimmedMessage.length })
  } catch (error) {
    logger.error('Failed to open copilot with message', { error })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/operation-queue/store.ts

```typescript
import { create } from 'zustand'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('OperationQueue')

export interface QueuedOperation {
  id: string
  operation: {
    operation: string
    target: string
    payload: any
  }
  workflowId: string
  timestamp: number
  retryCount: number
  status: 'pending' | 'processing' | 'confirmed' | 'failed'
  userId: string
  immediate?: boolean // Flag for immediate processing (skips debouncing)
}

interface OperationQueueState {
  operations: QueuedOperation[]
  isProcessing: boolean
  hasOperationError: boolean

  addToQueue: (operation: Omit<QueuedOperation, 'timestamp' | 'retryCount' | 'status'>) => void
  confirmOperation: (operationId: string) => void
  failOperation: (operationId: string, retryable?: boolean) => void
  handleOperationTimeout: (operationId: string) => void
  processNextOperation: () => void
  cancelOperationsForBlock: (blockId: string) => void
  cancelOperationsForVariable: (variableId: string) => void

  cancelOperationsForWorkflow: (workflowId: string) => void

  triggerOfflineMode: () => void
  clearError: () => void
}

const retryTimeouts = new Map<string, NodeJS.Timeout>()
const operationTimeouts = new Map<string, NodeJS.Timeout>()

let emitWorkflowOperation:
  | ((operation: string, target: string, payload: any, operationId?: string) => void)
  | null = null
let emitSubblockUpdate:
  | ((blockId: string, subblockId: string, value: any, operationId?: string) => void)
  | null = null
let emitVariableUpdate:
  | ((variableId: string, field: string, value: any, operationId?: string) => void)
  | null = null

export function registerEmitFunctions(
  workflowEmit: (operation: string, target: string, payload: any, operationId?: string) => void,
  subblockEmit: (blockId: string, subblockId: string, value: any, operationId?: string) => void,
  variableEmit: (variableId: string, field: string, value: any, operationId?: string) => void,
  workflowId: string | null
) {
  emitWorkflowOperation = workflowEmit
  emitSubblockUpdate = subblockEmit
  emitVariableUpdate = variableEmit
  currentRegisteredWorkflowId = workflowId
}

let currentRegisteredWorkflowId: string | null = null

export const useOperationQueueStore = create<OperationQueueState>((set, get) => ({
  operations: [],
  isProcessing: false,
  hasOperationError: false,

  addToQueue: (operation) => {
    // Immediate coalescing without client-side debouncing:
    // For subblock updates, keep only latest pending op for the same blockId+subblockId
    if (
      operation.operation.operation === 'subblock-update' &&
      operation.operation.target === 'subblock'
    ) {
      const { blockId, subblockId } = operation.operation.payload
      set((state) => ({
        operations: [
          ...state.operations.filter(
            (op) =>
              !(
                op.status === 'pending' &&
                op.operation.operation === 'subblock-update' &&
                op.operation.target === 'subblock' &&
                op.operation.payload?.blockId === blockId &&
                op.operation.payload?.subblockId === subblockId
              )
          ),
        ],
      }))
    }

    // For variable updates, keep only latest pending op for same variableId+field
    if (
      operation.operation.operation === 'variable-update' &&
      operation.operation.target === 'variable'
    ) {
      const { variableId, field } = operation.operation.payload
      set((state) => ({
        operations: [
          ...state.operations.filter(
            (op) =>
              !(
                op.status === 'pending' &&
                op.operation.operation === 'variable-update' &&
                op.operation.target === 'variable' &&
                op.operation.payload?.variableId === variableId &&
                op.operation.payload?.field === field
              )
          ),
        ],
      }))
    }

    // Handle remaining logic
    const state = get()

    // Check for duplicate operation ID
    const existingOp = state.operations.find((op) => op.id === operation.id)
    if (existingOp) {
      logger.debug('Skipping duplicate operation ID', {
        operationId: operation.id,
        existingStatus: existingOp.status,
      })
      return
    }

    // Enhanced duplicate content check - especially important for block operations
    const duplicateContent = state.operations.find(
      (op) =>
        op.operation.operation === operation.operation.operation &&
        op.operation.target === operation.operation.target &&
        op.workflowId === operation.workflowId &&
        // For block operations, check the block ID specifically
        ((operation.operation.target === 'block' &&
          op.operation.payload?.id === operation.operation.payload?.id) ||
          // For other operations, fall back to full payload comparison
          (operation.operation.target !== 'block' &&
            JSON.stringify(op.operation.payload) === JSON.stringify(operation.operation.payload)))
    )

    const isReplaceStateWorkflowOp =
      operation.operation.target === 'workflow' && operation.operation.operation === 'replace-state'

    if (duplicateContent && !isReplaceStateWorkflowOp) {
      logger.debug('Skipping duplicate operation content', {
        operationId: operation.id,
        existingOperationId: duplicateContent.id,
        operation: operation.operation.operation,
        target: operation.operation.target,
        existingStatus: duplicateContent.status,
        payload:
          operation.operation.target === 'block'
            ? { id: operation.operation.payload?.id }
            : operation.operation.payload,
      })
      return
    }

    const queuedOp: QueuedOperation = {
      ...operation,
      timestamp: Date.now(),
      retryCount: 0,
      status: 'pending',
    }

    logger.debug('Adding operation to queue', {
      operationId: queuedOp.id,
      operation: queuedOp.operation,
    })

    set((state) => ({
      operations: [...state.operations, queuedOp],
    }))

    // Start processing if not already processing
    get().processNextOperation()
  },

  confirmOperation: (operationId) => {
    const state = get()
    const operation = state.operations.find((op) => op.id === operationId)
    const newOperations = state.operations.filter((op) => op.id !== operationId)

    const retryTimeout = retryTimeouts.get(operationId)
    if (retryTimeout) {
      clearTimeout(retryTimeout)
      retryTimeouts.delete(operationId)
    }

    const operationTimeout = operationTimeouts.get(operationId)
    if (operationTimeout) {
      clearTimeout(operationTimeout)
      operationTimeouts.delete(operationId)
    }

    logger.debug('Removing operation from queue', {
      operationId,
      remainingOps: newOperations.length,
    })

    set({ operations: newOperations, isProcessing: false })

    // Process next operation in queue
    get().processNextOperation()
  },

  failOperation: (operationId: string, retryable = true) => {
    const state = get()
    const operation = state.operations.find((op) => op.id === operationId)
    if (!operation) {
      logger.warn('Attempted to fail operation that does not exist in queue', { operationId })
      return
    }

    const operationTimeout = operationTimeouts.get(operationId)
    if (operationTimeout) {
      clearTimeout(operationTimeout)
      operationTimeouts.delete(operationId)
    }

    if (!retryable) {
      logger.debug('Operation marked as non-retryable, removing from queue', { operationId })

      set((state) => ({
        operations: state.operations.filter((op) => op.id !== operationId),
        isProcessing: false,
      }))

      get().processNextOperation()
      return
    }

    // More aggressive retry for subblock/variable updates, less aggressive for structural ops
    const isSubblockOrVariable =
      (operation.operation.operation === 'subblock-update' &&
        operation.operation.target === 'subblock') ||
      (operation.operation.operation === 'variable-update' &&
        operation.operation.target === 'variable')

    const maxRetries = isSubblockOrVariable ? 5 : 3 // 5 retries for text, 3 for structural

    if (operation.retryCount < maxRetries) {
      const newRetryCount = operation.retryCount + 1
      // Faster retries for subblock/variable, exponential for structural
      const delay = isSubblockOrVariable
        ? Math.min(1000 * newRetryCount, 3000) // 1s, 2s, 3s, 3s, 3s (cap at 3s)
        : 2 ** newRetryCount * 1000 // 2s, 4s, 8s (exponential for structural)

      logger.warn(
        `Operation failed, retrying in ${delay}ms (attempt ${newRetryCount}/${maxRetries})`,
        {
          operationId,
          retryCount: newRetryCount,
          operation: operation.operation.operation,
        }
      )

      // Update retry count and mark as pending for retry
      set((state) => ({
        operations: state.operations.map((op) =>
          op.id === operationId
            ? { ...op, retryCount: newRetryCount, status: 'pending' as const }
            : op
        ),
        isProcessing: false, // Allow processing to continue
      }))

      // Schedule retry
      const timeout = setTimeout(() => {
        retryTimeouts.delete(operationId)
        get().processNextOperation()
      }, delay)

      retryTimeouts.set(operationId, timeout)
    } else {
      // Always trigger offline mode when we can't persist - never silently drop data
      logger.error('Operation failed after max retries, triggering offline mode', {
        operationId,
        operation: operation.operation.operation,
        retryCount: operation.retryCount,
      })
      get().triggerOfflineMode()
    }
  },

  handleOperationTimeout: (operationId: string) => {
    const state = get()
    const operation = state.operations.find((op) => op.id === operationId)
    if (!operation) {
      logger.debug('Ignoring timeout for operation not in queue', { operationId })
      return
    }

    logger.warn('Operation timeout detected - treating as failure to trigger retries', {
      operationId,
    })

    get().failOperation(operationId)
  },

  processNextOperation: () => {
    const state = get()

    // Don't process if already processing
    if (state.isProcessing) {
      return
    }

    const nextOperation = currentRegisteredWorkflowId
      ? state.operations.find(
          (op) => op.status === 'pending' && op.workflowId === currentRegisteredWorkflowId
        )
      : state.operations.find((op) => op.status === 'pending')
    if (!nextOperation) {
      return
    }

    if (currentRegisteredWorkflowId && nextOperation.workflowId !== currentRegisteredWorkflowId) {
      return
    }

    // Mark as processing
    set((state) => ({
      operations: state.operations.map((op) =>
        op.id === nextOperation.id ? { ...op, status: 'processing' as const } : op
      ),
      isProcessing: true,
    }))

    logger.debug('Processing operation sequentially', {
      operationId: nextOperation.id,
      operation: nextOperation.operation,
      retryCount: nextOperation.retryCount,
    })

    // Emit the operation
    const { operation: op, target, payload } = nextOperation.operation
    if (op === 'subblock-update' && target === 'subblock') {
      if (emitSubblockUpdate) {
        emitSubblockUpdate(payload.blockId, payload.subblockId, payload.value, nextOperation.id)
      }
    } else if (op === 'variable-update' && target === 'variable') {
      if (emitVariableUpdate) {
        emitVariableUpdate(payload.variableId, payload.field, payload.value, nextOperation.id)
      }
    } else {
      if (emitWorkflowOperation) {
        emitWorkflowOperation(op, target, payload, nextOperation.id)
      }
    }

    // Create operation timeout - longer for subblock/variable updates to handle reconnects
    const isSubblockOrVariable =
      (nextOperation.operation.operation === 'subblock-update' &&
        nextOperation.operation.target === 'subblock') ||
      (nextOperation.operation.operation === 'variable-update' &&
        nextOperation.operation.target === 'variable')
    const timeoutDuration = isSubblockOrVariable ? 15000 : 5000 // 15s for text edits, 5s for structural ops

    const timeoutId = setTimeout(() => {
      logger.warn(`Operation timeout - no server response after ${timeoutDuration}ms`, {
        operationId: nextOperation.id,
        operation: nextOperation.operation.operation,
      })
      operationTimeouts.delete(nextOperation.id)
      get().handleOperationTimeout(nextOperation.id)
    }, timeoutDuration)

    operationTimeouts.set(nextOperation.id, timeoutId)
  },

  cancelOperationsForBlock: (blockId: string) => {
    logger.debug('Canceling all operations for block', { blockId })

    // No debounced timeouts to cancel (moved to server-side)

    // Find and cancel operation timeouts for operations related to this block
    const state = get()
    const operationsToCancel = state.operations.filter(
      (op) =>
        (op.operation.target === 'block' && op.operation.payload?.id === blockId) ||
        (op.operation.target === 'subblock' && op.operation.payload?.blockId === blockId)
    )

    // Cancel timeouts for these operations
    operationsToCancel.forEach((op) => {
      const operationTimeout = operationTimeouts.get(op.id)
      if (operationTimeout) {
        clearTimeout(operationTimeout)
        operationTimeouts.delete(op.id)
      }

      const retryTimeout = retryTimeouts.get(op.id)
      if (retryTimeout) {
        clearTimeout(retryTimeout)
        retryTimeouts.delete(op.id)
      }
    })

    // Remove all operations for this block (both pending and processing)
    const newOperations = state.operations.filter(
      (op) =>
        !(
          (op.operation.target === 'block' && op.operation.payload?.id === blockId) ||
          (op.operation.target === 'subblock' && op.operation.payload?.blockId === blockId)
        )
    )

    set({
      operations: newOperations,
      isProcessing: false, // Reset processing state in case we removed the current operation
    })

    logger.debug('Cancelled operations for block', {
      blockId,
      cancelledOperations: operationsToCancel.length,
    })

    // Process next operation if there are any remaining
    get().processNextOperation()
  },

  cancelOperationsForVariable: (variableId: string) => {
    logger.debug('Canceling all operations for variable', { variableId })

    // No debounced timeouts to cancel (moved to server-side)

    // Find and cancel operation timeouts for operations related to this variable
    const state = get()
    const operationsToCancel = state.operations.filter(
      (op) =>
        (op.operation.target === 'variable' && op.operation.payload?.variableId === variableId) ||
        (op.operation.target === 'variable' &&
          op.operation.payload?.sourceVariableId === variableId)
    )

    // Cancel timeouts for these operations
    operationsToCancel.forEach((op) => {
      const operationTimeout = operationTimeouts.get(op.id)
      if (operationTimeout) {
        clearTimeout(operationTimeout)
        operationTimeouts.delete(op.id)
      }

      const retryTimeout = retryTimeouts.get(op.id)
      if (retryTimeout) {
        clearTimeout(retryTimeout)
        retryTimeouts.delete(op.id)
      }
    })

    // Remove all operations for this variable (both pending and processing)
    const newOperations = state.operations.filter(
      (op) =>
        !(
          (op.operation.target === 'variable' && op.operation.payload?.variableId === variableId) ||
          (op.operation.target === 'variable' &&
            op.operation.payload?.sourceVariableId === variableId)
        )
    )

    set({
      operations: newOperations,
      isProcessing: false, // Reset processing state in case we removed the current operation
    })

    logger.debug('Cancelled operations for variable', {
      variableId,
      cancelledOperations: operationsToCancel.length,
    })

    // Process next operation if there are any remaining
    get().processNextOperation()
  },

  cancelOperationsForWorkflow: (workflowId: string) => {
    const state = get()
    retryTimeouts.forEach((timeout, opId) => {
      const op = state.operations.find((o) => o.id === opId)
      if (op && op.workflowId === workflowId) {
        clearTimeout(timeout)
        retryTimeouts.delete(opId)
      }
    })
    operationTimeouts.forEach((timeout, opId) => {
      const op = state.operations.find((o) => o.id === opId)
      if (op && op.workflowId === workflowId) {
        clearTimeout(timeout)
        operationTimeouts.delete(opId)
      }
    })
    set((s) => ({
      operations: s.operations.filter((op) => op.workflowId !== workflowId),
      isProcessing: false,
    }))
  },

  triggerOfflineMode: () => {
    logger.error('Operation failed after retries - triggering offline mode')

    retryTimeouts.forEach((timeout) => clearTimeout(timeout))
    retryTimeouts.clear()
    operationTimeouts.forEach((timeout) => clearTimeout(timeout))
    operationTimeouts.clear()

    set({
      operations: [],
      isProcessing: false,
      hasOperationError: true,
    })
  },

  clearError: () => {
    set({ hasOperationError: false })
  },
}))

export function useOperationQueue() {
  const store = useOperationQueueStore()

  return {
    queue: store.operations,
    isProcessing: store.isProcessing,
    hasOperationError: store.hasOperationError,
    addToQueue: store.addToQueue,
    confirmOperation: store.confirmOperation,
    failOperation: store.failOperation,
    processNextOperation: store.processNextOperation,
    cancelOperationsForBlock: store.cancelOperationsForBlock,
    cancelOperationsForVariable: store.cancelOperationsForVariable,
    triggerOfflineMode: store.triggerOfflineMode,
    clearError: store.clearError,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/panel/store.ts

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PanelState, PanelTab } from '@/stores/panel/types'

/**
 * Panel width constraints
 * Note: Maximum width is enforced dynamically at 40% of viewport width in the resize hook
 */
const MIN_PANEL_WIDTH = 244

/**
 * Default panel tab
 */
const DEFAULT_TAB: PanelTab = 'copilot'

export const usePanelStore = create<PanelState>()(
  persist(
    (set) => ({
      panelWidth: MIN_PANEL_WIDTH,
      setPanelWidth: (width) => {
        // Only enforce minimum - maximum is enforced dynamically by the resize hook
        const clampedWidth = Math.max(MIN_PANEL_WIDTH, width)
        set({ panelWidth: clampedWidth })
        // Update CSS variable for immediate visual feedback
        if (typeof window !== 'undefined') {
          document.documentElement.style.setProperty('--panel-width', `${clampedWidth}px`)
        }
      },
      activeTab: DEFAULT_TAB,
      setActiveTab: (tab) => {
        set({ activeTab: tab })
        // Remove data attribute once React takes control
        if (typeof document !== 'undefined') {
          document.documentElement.removeAttribute('data-panel-active-tab')
        }
      },
      _hasHydrated: false,
      setHasHydrated: (hasHydrated) => {
        set({ _hasHydrated: hasHydrated })
      },
    }),
    {
      name: 'panel-state',
      onRehydrateStorage: () => (state) => {
        // Sync CSS variables with stored state after rehydration
        if (state && typeof window !== 'undefined') {
          document.documentElement.style.setProperty('--panel-width', `${state.panelWidth}px`)
          // Remove the data attribute so CSS rules stop interfering
          document.documentElement.removeAttribute('data-panel-active-tab')
        }
      },
    }
  )
)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/stores/panel/types.ts

```typescript
/**
 * Available panel tabs
 */
export type PanelTab = 'copilot' | 'editor' | 'toolbar'

/**
 * Panel state interface
 */
export interface PanelState {
  panelWidth: number
  setPanelWidth: (width: number) => void
  activeTab: PanelTab
  setActiveTab: (tab: PanelTab) => void
  _hasHydrated: boolean
  setHasHydrated: (hasHydrated: boolean) => void
}
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: sim-main/apps/sim/stores/panel/copilot/constants.ts

```typescript
// Tool IDs
export const COPILOT_TOOL_IDS = {
  GET_USER_WORKFLOW: 'get_user_workflow',
  EDIT_WORKFLOW: 'edit_workflow',
  SEARCH_DOCUMENTATION: 'search_documentation',
  GET_BLOCKS_AND_TOOLS: 'get_blocks_and_tools',
  GET_BLOCKS_METADATA: 'get_blocks_metadata',
  GET_YAML_STRUCTURE: 'get_yaml_structure',
  GET_WORKFLOW_EXAMPLES: 'get_workflow_examples',
  GET_ENVIRONMENT_VARIABLES: 'get_environment_variables',
  SET_ENVIRONMENT_VARIABLES: 'set_environment_variables',
  GET_WORKFLOW_CONSOLE: 'get_workflow_console',
  RUN_WORKFLOW: 'run_workflow',
  SEARCH_ONLINE: 'search_online',
} as const
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/stores/panel/copilot/index.ts

```typescript
export { useCopilotStore } from '@/stores/panel/copilot/store'
export type {
  CopilotActions,
  CopilotChat,
  CopilotMessage,
  CopilotState,
  CopilotStore,
} from '@/stores/panel/copilot/types'
```

--------------------------------------------------------------------------------

---[FILE: preview-store.ts]---
Location: sim-main/apps/sim/stores/panel/copilot/preview-store.ts

```typescript
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { COPILOT_TOOL_IDS } from '@/stores/panel/copilot/constants'
import type { CopilotMessage, CopilotToolCall } from '@/stores/panel/copilot/types'

export interface PreviewData {
  id: string
  workflowState: any
  yamlContent: string
  description?: string
  timestamp: number
  status: 'pending' | 'accepted' | 'rejected'
  workflowId: string
  toolCallId?: string
  chatId?: string // Track which chat session this preview belongs to
  messageTimestamp?: number // Track when the message containing this preview was created
}

interface PreviewStore {
  previews: Record<string, PreviewData>
  seenToolCallIds: Set<string>
  addPreview: (preview: Omit<PreviewData, 'id' | 'timestamp' | 'status'>) => string
  acceptPreview: (previewId: string) => void
  rejectPreview: (previewId: string) => void
  getLatestPendingPreview: (workflowId: string, chatId?: string) => PreviewData | null
  getPreviewById: (previewId: string) => PreviewData | null
  getPreviewsForWorkflow: (workflowId: string) => PreviewData[]
  getPreviewByToolCall: (toolCallId: string) => PreviewData | null
  clearPreviewsForWorkflow: (workflowId: string) => void
  clearPreviewsForChat: (chatId: string) => void
  clearStalePreviewsForWorkflow: (workflowId: string, maxAgeMinutes?: number) => void
  expireOldPreviews: (maxAgeHours?: number) => void
  markToolCallAsSeen: (toolCallId: string) => void
  isToolCallSeen: (toolCallId: string) => boolean
  scanAndMarkExistingPreviews: (messages: CopilotMessage[]) => void
}

export const usePreviewStore = create<PreviewStore>()(
  persist(
    (set, get) => ({
      previews: {},
      seenToolCallIds: new Set<string>(),

      addPreview: (preview) => {
        const id = `preview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const newPreview: PreviewData = {
          ...preview,
          id,
          timestamp: Date.now(),
          status: 'pending',
        }

        set((state) => ({
          previews: {
            ...state.previews,
            [id]: newPreview,
          },
        }))

        return id
      },

      acceptPreview: (previewId) => {
        set((state) => {
          const existingPreview = state.previews[previewId]
          if (!existingPreview) {
            return state
          }

          return {
            previews: {
              ...state.previews,
              [previewId]: {
                ...existingPreview,
                status: 'accepted' as const,
              },
            },
          }
        })
      },

      rejectPreview: (previewId) => {
        set((state) => {
          const existingPreview = state.previews[previewId]
          if (!existingPreview) {
            return state
          }

          return {
            previews: {
              ...state.previews,
              [previewId]: {
                ...existingPreview,
                status: 'rejected' as const,
              },
            },
          }
        })
      },

      getLatestPendingPreview: (workflowId, chatId) => {
        const now = Date.now()
        const maxAge = 30 * 60 * 1000 // 30 minutes
        const allPreviews = Object.values(get().previews)

        const previews = allPreviews
          .filter((p) => {
            // Must be for the current workflow and pending
            if (p.workflowId !== workflowId || p.status !== 'pending') {
              return false
            }

            // If chatId is provided, only show previews from this chat session
            // If no chatId provided or preview has no chatId, allow it (for backward compatibility)
            if (chatId && p.chatId && p.chatId !== chatId) {
              return false
            }

            // Filter out previews older than 30 minutes to avoid stale previews
            if (now - p.timestamp > maxAge) {
              return false
            }

            return true
          })
          .sort((a, b) => b.timestamp - a.timestamp)

        return previews[0] || null
      },

      getPreviewById: (previewId) => {
        return get().previews[previewId] || null
      },

      getPreviewsForWorkflow: (workflowId) => {
        return Object.values(get().previews).filter((p) => p.workflowId === workflowId)
      },

      getPreviewByToolCall: (toolCallId) => {
        return Object.values(get().previews).find((p) => p.toolCallId === toolCallId) || null
      },

      clearPreviewsForWorkflow: (workflowId) => {
        set((state) => ({
          previews: Object.fromEntries(
            Object.entries(state.previews).filter(
              ([_, preview]) => preview.workflowId !== workflowId
            )
          ),
        }))
      },

      clearPreviewsForChat: (chatId) => {
        set((state) => ({
          previews: Object.fromEntries(
            Object.entries(state.previews).filter(([_, preview]) => preview.chatId !== chatId)
          ),
        }))
      },

      clearStalePreviewsForWorkflow: (workflowId, maxAgeMinutes = 30) => {
        const now = Date.now()
        const maxAge = maxAgeMinutes * 60 * 1000

        set((state) => ({
          previews: Object.fromEntries(
            Object.entries(state.previews).filter(([_, preview]) => {
              if (preview.workflowId === workflowId && preview.status === 'pending') {
                return now - preview.timestamp <= maxAge
              }
              return true // Keep previews from other workflows or accepted/rejected previews
            })
          ),
        }))
      },

      expireOldPreviews: (maxAgeHours = 24) => {
        const now = Date.now()
        const maxAge = maxAgeHours * 60 * 60 * 1000

        set((state) => ({
          previews: Object.fromEntries(
            Object.entries(state.previews).filter(
              ([_, preview]) => now - preview.timestamp <= maxAge
            )
          ),
        }))
      },

      markToolCallAsSeen: (toolCallId) => {
        set((state) => ({
          seenToolCallIds: new Set([...state.seenToolCallIds, toolCallId]),
        }))
      },

      isToolCallSeen: (toolCallId) => {
        return get().seenToolCallIds.has(toolCallId)
      },

      scanAndMarkExistingPreviews: (messages: CopilotMessage[]) => {
        const toolCallIds = new Set<string>()

        messages.forEach((message) => {
          if (message.role === 'assistant' && message.toolCalls) {
            message.toolCalls.forEach((toolCall: CopilotToolCall) => {
              if (
                toolCall.name === COPILOT_TOOL_IDS.EDIT_WORKFLOW &&
                toolCall.state === 'success' &&
                toolCall.id
              ) {
                toolCallIds.add(toolCall.id)
              }
            })
          }
        })

        set((state) => ({
          seenToolCallIds: new Set([...state.seenToolCallIds, ...toolCallIds]),
        }))
      },
    }),
    {
      name: 'copilot-preview-store',
      partialize: (state) => ({
        previews: Object.fromEntries(
          Object.entries(state.previews).filter(
            ([_, preview]) => Date.now() - preview.timestamp < 24 * 60 * 60 * 1000 // Keep for 24 hours
          )
        ),
        seenToolCallIds: Array.from(state.seenToolCallIds), // Convert Set to Array for serialization
      }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        seenToolCallIds: new Set(persistedState?.seenToolCallIds || []), // Convert Array back to Set
      }),
    }
  )
)
```

--------------------------------------------------------------------------------

````
