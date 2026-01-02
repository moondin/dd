---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 633
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 633 of 933)

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
Location: sim-main/apps/sim/stores/chat/store.ts

```typescript
import { v4 as uuidv4 } from 'uuid'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('ChatStore')

/**
 * Maximum number of messages to store across all workflows
 */
const MAX_MESSAGES = 50

/**
 * Floating chat dimensions
 */
const DEFAULT_WIDTH = 305
const DEFAULT_HEIGHT = 286

/**
 * Minimum chat dimensions (same as baseline default)
 */
export const MIN_CHAT_WIDTH = DEFAULT_WIDTH
export const MIN_CHAT_HEIGHT = DEFAULT_HEIGHT

/**
 * Maximum chat dimensions
 */
export const MAX_CHAT_WIDTH = 500
export const MAX_CHAT_HEIGHT = 600

/**
 * Position interface for floating chat
 */
interface ChatPosition {
  x: number
  y: number
}

/**
 * Chat attachment interface
 */
export interface ChatAttachment {
  id: string
  name: string
  type: string
  dataUrl: string
  size?: number
}

/**
 * Chat message interface
 */
export interface ChatMessage {
  id: string
  content: string | any
  workflowId: string
  type: 'user' | 'workflow'
  timestamp: string
  blockId?: string
  isStreaming?: boolean
  attachments?: ChatAttachment[]
}

/**
 * Output configuration for chat deployments
 */
export interface OutputConfig {
  blockId: string
  path: string
}

/**
 * Chat dimensions interface
 */
export interface ChatDimensions {
  width: number
  height: number
}

/**
 * Chat store state interface combining UI state and message data
 */
interface ChatState {
  // UI State
  isChatOpen: boolean
  chatPosition: ChatPosition | null
  chatWidth: number
  chatHeight: number
  setIsChatOpen: (open: boolean) => void
  setChatPosition: (position: ChatPosition) => void
  setChatDimensions: (dimensions: ChatDimensions) => void
  resetChatPosition: () => void

  // Message State
  messages: ChatMessage[]
  selectedWorkflowOutputs: Record<string, string[]>
  conversationIds: Record<string, string>

  // Message Actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'> & { id?: string }) => void
  clearChat: (workflowId: string | null) => void
  exportChatCSV: (workflowId: string) => void
  setSelectedWorkflowOutput: (workflowId: string, outputIds: string[]) => void
  getSelectedWorkflowOutput: (workflowId: string) => string[]
  appendMessageContent: (messageId: string, content: string) => void
  finalizeMessageStream: (messageId: string) => void
  getConversationId: (workflowId: string) => string
  generateNewConversationId: (workflowId: string) => string
}

/**
 * Calculate default position in top right of canvas, 32px from top and right of panel
 */
const calculateDefaultPosition = (): ChatPosition => {
  if (typeof window === 'undefined') {
    return { x: 100, y: 100 }
  }

  // Get current layout dimensions
  const panelWidth = Number.parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--panel-width') || '0'
  )

  // Position in top right of canvas, 32px from top and 32px from right of panel
  const x = window.innerWidth - panelWidth - 32 - DEFAULT_WIDTH
  const y = 32

  return { x, y }
}

/**
 * Floating chat store
 * Manages the open/close state, position, messages, and all chat functionality
 */
export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set, get) => ({
        // UI State
        isChatOpen: false,
        chatPosition: null,
        chatWidth: DEFAULT_WIDTH,
        chatHeight: DEFAULT_HEIGHT,

        setIsChatOpen: (open) => {
          set({ isChatOpen: open })
        },

        setChatPosition: (position) => {
          set({ chatPosition: position })
        },

        setChatDimensions: (dimensions) => {
          set({
            chatWidth: Math.max(MIN_CHAT_WIDTH, Math.min(MAX_CHAT_WIDTH, dimensions.width)),
            chatHeight: Math.max(MIN_CHAT_HEIGHT, Math.min(MAX_CHAT_HEIGHT, dimensions.height)),
          })
        },

        resetChatPosition: () => {
          set({ chatPosition: null })
        },

        // Message State
        messages: [],
        selectedWorkflowOutputs: {},
        conversationIds: {},

        addMessage: (message) => {
          set((state) => {
            const newMessage: ChatMessage = {
              ...message,
              // Preserve provided id and timestamp if they exist; otherwise generate new ones
              id: (message as any).id ?? crypto.randomUUID(),
              timestamp: (message as any).timestamp ?? new Date().toISOString(),
            }

            // Keep only the last MAX_MESSAGES
            const newMessages = [newMessage, ...state.messages].slice(0, MAX_MESSAGES)

            return { messages: newMessages }
          })
        },

        clearChat: (workflowId: string | null) => {
          set((state) => {
            const newState = {
              messages: state.messages.filter(
                (message) => !workflowId || message.workflowId !== workflowId
              ),
            }

            // Generate a new conversationId when clearing chat for a specific workflow
            if (workflowId) {
              const newConversationIds = { ...state.conversationIds }
              newConversationIds[workflowId] = uuidv4()
              return {
                ...newState,
                conversationIds: newConversationIds,
              }
            }
            // When clearing all chats (workflowId is null), also clear all conversationIds
            return {
              ...newState,
              conversationIds: {},
            }
          })
        },

        exportChatCSV: (workflowId: string) => {
          const messages = get().messages.filter((message) => message.workflowId === workflowId)

          if (messages.length === 0) {
            return
          }

          /**
           * Safely stringify and escape CSV values
           */
          const formatCSVValue = (value: any): string => {
            if (value === null || value === undefined) {
              return ''
            }

            let stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value)

            // Truncate very long strings
            if (stringValue.length > 2000) {
              stringValue = `${stringValue.substring(0, 2000)}...`
            }

            // Escape quotes and wrap in quotes if contains special characters
            if (
              stringValue.includes('"') ||
              stringValue.includes(',') ||
              stringValue.includes('\n')
            ) {
              stringValue = `"${stringValue.replace(/"/g, '""')}"`
            }

            return stringValue
          }

          // CSV Headers
          const headers = ['timestamp', 'type', 'content']

          // Sort messages by timestamp (oldest first)
          const sortedMessages = messages.sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )

          // Generate CSV rows
          const csvRows = [
            headers.join(','),
            ...sortedMessages.map((message) =>
              [
                formatCSVValue(message.timestamp),
                formatCSVValue(message.type),
                formatCSVValue(message.content),
              ].join(',')
            ),
          ]

          // Create CSV content
          const csvContent = csvRows.join('\n')

          // Generate filename with timestamp
          const now = new Date()
          const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19)
          const filename = `chat-${workflowId}-${timestamp}.csv`

          // Create and trigger download
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
          const link = document.createElement('a')

          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob)
            link.setAttribute('href', url)
            link.setAttribute('download', filename)
            link.style.visibility = 'hidden'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
          }
        },

        setSelectedWorkflowOutput: (workflowId, outputIds) => {
          set((state) => {
            // Create a new copy of the selections state
            const newSelections = { ...state.selectedWorkflowOutputs }

            // If empty array, explicitly remove the key to prevent empty arrays from persisting
            if (outputIds.length === 0) {
              // Delete the key entirely instead of setting to empty array
              delete newSelections[workflowId]
            } else {
              // Ensure no duplicates in the selection by using Set
              newSelections[workflowId] = [...new Set(outputIds)]
            }

            return { selectedWorkflowOutputs: newSelections }
          })
        },

        getSelectedWorkflowOutput: (workflowId) => {
          return get().selectedWorkflowOutputs[workflowId] || []
        },

        getConversationId: (workflowId) => {
          const state = get()
          if (!state.conversationIds[workflowId]) {
            // Generate a new conversation ID if one doesn't exist
            return get().generateNewConversationId(workflowId)
          }
          return state.conversationIds[workflowId]
        },

        generateNewConversationId: (workflowId) => {
          const newId = uuidv4()
          set((state) => {
            const newConversationIds = { ...state.conversationIds }
            newConversationIds[workflowId] = newId
            return { conversationIds: newConversationIds }
          })
          return newId
        },

        appendMessageContent: (messageId, content) => {
          logger.debug('[ChatStore] appendMessageContent called', {
            messageId,
            contentLength: content.length,
            content: content.substring(0, 30),
          })
          set((state) => {
            const message = state.messages.find((m) => m.id === messageId)
            if (!message) {
              logger.warn('[ChatStore] Message not found for appending', { messageId })
            }

            const newMessages = state.messages.map((message) => {
              if (message.id === messageId) {
                const newContent =
                  typeof message.content === 'string'
                    ? message.content + content
                    : message.content
                      ? String(message.content) + content
                      : content
                logger.debug('[ChatStore] Updated message content', {
                  messageId,
                  oldLength: typeof message.content === 'string' ? message.content.length : 0,
                  newLength: newContent.length,
                  addedLength: content.length,
                })
                return {
                  ...message,
                  content: newContent,
                }
              }
              return message
            })

            return { messages: newMessages }
          })
        },

        finalizeMessageStream: (messageId) => {
          set((state) => {
            const newMessages = state.messages.map((message) => {
              if (message.id === messageId) {
                const { isStreaming, ...rest } = message
                return rest
              }
              return message
            })

            return { messages: newMessages }
          })
        },
      }),
      {
        name: 'chat-store',
      }
    )
  )
)

/**
 * Get the default chat dimensions
 */
export const getDefaultChatDimensions = () => ({
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
})

/**
 * Calculate constrained position ensuring chat stays within bounds
 * @param position - Current position to constrain
 * @param width - Chat width
 * @param height - Chat height
 * @returns Constrained position
 */
export const constrainChatPosition = (
  position: ChatPosition,
  width: number = DEFAULT_WIDTH,
  height: number = DEFAULT_HEIGHT
): ChatPosition => {
  if (typeof window === 'undefined') {
    return position
  }

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

  // Calculate bounds
  const minX = sidebarWidth
  const maxX = window.innerWidth - panelWidth - width
  const minY = 0
  const maxY = window.innerHeight - terminalHeight - height

  // Constrain position
  return {
    x: Math.max(minX, Math.min(maxX, position.x)),
    y: Math.max(minY, Math.min(maxY, position.y)),
  }
}

/**
 * Get chat position (default if not set or if invalid)
 * @param storedPosition - Stored position from store
 * @param width - Chat width
 * @param height - Chat height
 * @returns Valid chat position
 */
export const getChatPosition = (
  storedPosition: ChatPosition | null,
  width: number = DEFAULT_WIDTH,
  height: number = DEFAULT_HEIGHT
): ChatPosition => {
  if (!storedPosition) {
    return calculateDefaultPosition()
  }

  // Validate stored position is still within bounds
  const constrained = constrainChatPosition(storedPosition, width, height)

  // If position significantly changed, it's likely invalid (window resized, etc)
  // Return default position
  const deltaX = Math.abs(constrained.x - storedPosition.x)
  const deltaY = Math.abs(constrained.y - storedPosition.y)

  if (deltaX > 100 || deltaY > 100) {
    return calculateDefaultPosition()
  }

  return constrained
}
```

--------------------------------------------------------------------------------

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/copilot-training/store.ts

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createLogger } from '@/lib/logs/console/logger'
import { sanitizeForCopilot } from '@/lib/workflows/sanitization/json-sanitizer'
import {
  computeEditSequence,
  type EditOperation,
} from '@/lib/workflows/training/compute-edit-sequence'
import { mergeSubblockState } from '@/stores/workflows/utils'
import { useWorkflowStore } from '@/stores/workflows/workflow/store'
import type { WorkflowState } from '@/stores/workflows/workflow/types'

const logger = createLogger('CopilotTrainingStore')

export interface TrainingDataset {
  id: string
  workflowId: string
  title: string
  prompt: string
  startState: WorkflowState
  endState: WorkflowState
  editSequence: EditOperation[]
  createdAt: Date
  sentAt?: Date
  metadata?: {
    duration?: number // Time taken to complete edits in ms
    blockCount?: number
    edgeCount?: number
  }
}

interface CopilotTrainingState {
  // Current training session
  isTraining: boolean
  currentTitle: string
  currentPrompt: string
  startSnapshot: WorkflowState | null
  startTime: number | null

  // Completed datasets
  datasets: TrainingDataset[]

  // UI state
  showModal: boolean

  // Actions
  startTraining: (title: string, prompt: string) => void
  stopTraining: () => TrainingDataset | null
  cancelTraining: () => void
  setPrompt: (prompt: string) => void
  toggleModal: () => void
  clearDatasets: () => void
  exportDatasets: () => string
  markDatasetSent: (id: string, sentAt?: Date) => void
}

/**
 * Get a clean snapshot of the current workflow state
 */
function captureWorkflowSnapshot(): WorkflowState {
  const rawState = useWorkflowStore.getState().getWorkflowState()

  // Merge subblock values to get complete state
  const blocksWithSubblockValues = mergeSubblockState(rawState.blocks)

  // Clean the state - only include essential fields
  return {
    blocks: blocksWithSubblockValues,
    edges: rawState.edges || [],
    loops: rawState.loops || {},
    parallels: rawState.parallels || {},
    lastSaved: Date.now(),
  }
}

export const useCopilotTrainingStore = create<CopilotTrainingState>()(
  devtools(
    (set, get) => ({
      // Initial state
      isTraining: false,
      currentTitle: '',
      currentPrompt: '',
      startSnapshot: null,
      startTime: null,
      datasets: [],
      showModal: false,

      // Start a new training session
      startTraining: (title: string, prompt: string) => {
        if (!prompt.trim()) {
          logger.warn('Cannot start training without a prompt')
          return
        }
        if (!title.trim()) {
          logger.warn('Cannot start training without a title')
          return
        }

        const snapshot = captureWorkflowSnapshot()

        logger.info('Starting training session', {
          title,
          prompt,
          blockCount: Object.keys(snapshot.blocks).length,
          edgeCount: snapshot.edges.length,
        })

        set({
          isTraining: true,
          currentTitle: title,
          currentPrompt: prompt,
          startSnapshot: snapshot,
          startTime: Date.now(),
          showModal: false, // Close modal when starting
        })
      },

      // Stop training and save the dataset
      stopTraining: () => {
        const state = get()

        if (!state.isTraining || !state.startSnapshot) {
          logger.warn('No active training session to stop')
          return null
        }

        const endSnapshot = captureWorkflowSnapshot()
        const duration = state.startTime ? Date.now() - state.startTime : 0

        // Sanitize snapshots for compute-edit-sequence (it works with sanitized state)
        const sanitizedStart = sanitizeForCopilot(state.startSnapshot!)
        const sanitizedEnd = sanitizeForCopilot(endSnapshot)

        // Compute the edit sequence
        const { operations, summary } = computeEditSequence(sanitizedStart, sanitizedEnd)

        // Get workflow ID from the store
        const { activeWorkflowId } = useWorkflowStore.getState() as any

        const dataset: TrainingDataset = {
          id: crypto.randomUUID(),
          workflowId: activeWorkflowId || 'unknown',
          title: state.currentTitle,
          prompt: state.currentPrompt,
          startState: state.startSnapshot,
          endState: endSnapshot,
          editSequence: operations,
          createdAt: new Date(),
          metadata: {
            duration,
            blockCount: Object.keys(endSnapshot.blocks).length,
            edgeCount: endSnapshot.edges.length,
          },
        }

        logger.info('Training session completed', {
          title: state.currentTitle,
          prompt: state.currentPrompt,
          duration,
          operations: operations.length,
          summary,
        })

        set((prev) => ({
          isTraining: false,
          currentTitle: '',
          currentPrompt: '',
          startSnapshot: null,
          startTime: null,
          datasets: [...prev.datasets, dataset],
        }))

        return dataset
      },

      // Cancel training without saving
      cancelTraining: () => {
        logger.info('Training session cancelled')

        set({
          isTraining: false,
          currentTitle: '',
          currentPrompt: '',
          startSnapshot: null,
          startTime: null,
        })
      },

      // Update the prompt
      setPrompt: (prompt: string) => {
        set({ currentPrompt: prompt })
      },

      // Toggle modal visibility
      toggleModal: () => {
        set((state) => ({ showModal: !state.showModal }))
      },

      // Clear all datasets
      clearDatasets: () => {
        logger.info('Clearing all training datasets')
        set({ datasets: [] })
      },

      // Export datasets as JSON
      exportDatasets: () => {
        const { datasets } = get()

        const exportData = {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          datasets: datasets.map((d) => ({
            id: d.id,
            workflowId: d.workflowId,
            prompt: d.prompt,
            startState: d.startState,
            endState: d.endState,
            editSequence: d.editSequence,
            createdAt: d.createdAt.toISOString(),
            sentAt: d.sentAt ? d.sentAt.toISOString() : undefined,
            metadata: d.metadata,
          })),
        }

        return JSON.stringify(exportData, null, 2)
      },

      // Mark a dataset as sent (persist a timestamp)
      markDatasetSent: (id: string, sentAt?: Date) => {
        const when = sentAt ?? new Date()
        set((state) => ({
          datasets: state.datasets.map((d) => (d.id === id ? { ...d, sentAt: when } : d)),
        }))
      },
    }),
    {
      name: 'copilot-training-store',
    }
  )
)
```

--------------------------------------------------------------------------------

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/custom-tools/store.ts

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createLogger } from '@/lib/logs/console/logger'
import type { CustomToolsState, CustomToolsStore } from '@/stores/custom-tools/types'

const logger = createLogger('CustomToolsStore')

const initialState: CustomToolsState = {
  tools: [],
}

export const useCustomToolsStore = create<CustomToolsStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setTools: (tools) => {
        logger.info(`Synced ${tools.length} custom tools`)
        set({ tools })
      },

      getTool: (id: string) => {
        return get().tools.find((tool) => tool.id === id)
      },

      getAllTools: () => {
        return get().tools
      },

      reset: () => set(initialState),
    }),
    {
      name: 'custom-tools-store',
    }
  )
)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/stores/custom-tools/types.ts

```typescript
export interface CustomToolSchema {
  type: string
  function: {
    name: string
    description?: string
    parameters: {
      type: string
      properties: Record<string, any>
      required?: string[]
    }
  }
}

export interface CustomToolDefinition {
  id: string
  workspaceId: string | null
  userId: string | null
  title: string
  schema: CustomToolSchema
  code: string
  createdAt: string
  updatedAt?: string
}

export interface CustomToolsState {
  tools: CustomToolDefinition[]
}

export interface CustomToolsActions {
  setTools: (tools: CustomToolDefinition[]) => void
  getTool: (id: string) => CustomToolDefinition | undefined
  getAllTools: () => CustomToolDefinition[]
  reset: () => void
}

export interface CustomToolsStore extends CustomToolsState, CustomToolsActions {}
```

--------------------------------------------------------------------------------

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/execution/store.ts

```typescript
import { create } from 'zustand'
import { type ExecutionActions, type ExecutionState, initialState } from '@/stores/execution/types'

export const useExecutionStore = create<ExecutionState & ExecutionActions>()((set, get) => ({
  ...initialState,

  setActiveBlocks: (blockIds) => {
    set({ activeBlockIds: new Set(blockIds) })
  },

  setPendingBlocks: (pendingBlocks) => {
    set({ pendingBlocks })
  },

  setIsExecuting: (isExecuting) => {
    set({ isExecuting })
    if (isExecuting) {
      set({ lastRunPath: new Map(), lastRunEdges: new Map() })
    }
  },
  setIsDebugging: (isDebugging) => set({ isDebugging }),
  setExecutor: (executor) => set({ executor }),
  setDebugContext: (debugContext) => set({ debugContext }),
  setBlockRunStatus: (blockId, status) => {
    const { lastRunPath } = get()
    const newRunPath = new Map(lastRunPath)
    newRunPath.set(blockId, status)
    set({ lastRunPath: newRunPath })
  },
  setEdgeRunStatus: (edgeId, status) => {
    const { lastRunEdges } = get()
    const newRunEdges = new Map(lastRunEdges)
    newRunEdges.set(edgeId, status)
    set({ lastRunEdges: newRunEdges })
  },
  clearRunPath: () => set({ lastRunPath: new Map(), lastRunEdges: new Map() }),
  reset: () => set(initialState),
}))
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/stores/execution/types.ts

```typescript
import type { Executor } from '@/executor'
import type { ExecutionContext } from '@/executor/types'

/**
 * Represents the execution result of a block in the last run
 */
export type BlockRunStatus = 'success' | 'error'

/**
 * Represents the execution result of an edge in the last run
 */
export type EdgeRunStatus = 'success' | 'error'

export interface ExecutionState {
  activeBlockIds: Set<string>
  isExecuting: boolean
  isDebugging: boolean
  pendingBlocks: string[]
  executor: Executor | null
  debugContext: ExecutionContext | null
  /**
   * Tracks blocks from the last execution run and their success/error status.
   * Cleared when a new run starts. Used to show run path indicators (rings on blocks).
   */
  lastRunPath: Map<string, BlockRunStatus>
  /**
   * Tracks edges from the last execution run and their success/error status.
   * Cleared when a new run starts. Used to show run path indicators on edges.
   */
  lastRunEdges: Map<string, EdgeRunStatus>
}

export interface ExecutionActions {
  setActiveBlocks: (blockIds: Set<string>) => void
  setIsExecuting: (isExecuting: boolean) => void
  setIsDebugging: (isDebugging: boolean) => void
  setPendingBlocks: (blockIds: string[]) => void
  setExecutor: (executor: Executor | null) => void
  setDebugContext: (context: ExecutionContext | null) => void
  setBlockRunStatus: (blockId: string, status: BlockRunStatus) => void
  setEdgeRunStatus: (edgeId: string, status: EdgeRunStatus) => void
  clearRunPath: () => void
  reset: () => void
}

export const initialState: ExecutionState = {
  activeBlockIds: new Set(),
  isExecuting: false,
  isDebugging: false,
  pendingBlocks: [],
  executor: null,
  debugContext: null,
  lastRunPath: new Map(),
  lastRunEdges: new Map(),
}
```

--------------------------------------------------------------------------------

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/folders/store.ts

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('FoldersStore')

export interface Workflow {
  id: string
  folderId?: string | null
  name?: string
  description?: string
  userId?: string
  workspaceId?: string
  [key: string]: any // For additional properties
}

export interface WorkflowFolder {
  id: string
  name: string
  userId: string
  workspaceId: string
  parentId: string | null
  color: string
  isExpanded: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface FolderTreeNode extends WorkflowFolder {
  children: FolderTreeNode[]
  level: number
}

interface FolderState {
  folders: Record<string, WorkflowFolder>
  expandedFolders: Set<string>
  selectedWorkflows: Set<string>

  setFolders: (folders: WorkflowFolder[]) => void
  toggleExpanded: (folderId: string) => void
  setExpanded: (folderId: string, expanded: boolean) => void

  // Selection actions
  selectWorkflow: (workflowId: string) => void
  deselectWorkflow: (workflowId: string) => void
  toggleWorkflowSelection: (workflowId: string) => void
  clearSelection: () => void
  selectOnly: (workflowId: string) => void
  selectRange: (workflowIds: string[], fromId: string, toId: string) => void
  isWorkflowSelected: (workflowId: string) => boolean

  // Computed values
  getFolderTree: (workspaceId: string) => FolderTreeNode[]
  getFolderById: (id: string) => WorkflowFolder | undefined
  getChildFolders: (parentId: string | null) => WorkflowFolder[]
  getFolderPath: (folderId: string) => WorkflowFolder[]
}

export const useFolderStore = create<FolderState>()(
  devtools(
    (set, get) => ({
      folders: {},
      expandedFolders: new Set(),
      selectedWorkflows: new Set(),

      setFolders: (folders) =>
        set(() => ({
          folders: folders.reduce(
            (acc, folder) => {
              acc[folder.id] = folder
              return acc
            },
            {} as Record<string, WorkflowFolder>
          ),
        })),

      toggleExpanded: (folderId) =>
        set((state) => {
          const newExpanded = new Set(state.expandedFolders)
          if (newExpanded.has(folderId)) {
            newExpanded.delete(folderId)
          } else {
            newExpanded.add(folderId)
          }
          return { expandedFolders: newExpanded }
        }),

      setExpanded: (folderId, expanded) =>
        set((state) => {
          const newExpanded = new Set(state.expandedFolders)
          if (expanded) {
            newExpanded.add(folderId)
          } else {
            newExpanded.delete(folderId)
          }
          return { expandedFolders: newExpanded }
        }),

      // Selection actions
      selectWorkflow: (workflowId) =>
        set((state) => {
          const newSelected = new Set(state.selectedWorkflows)
          newSelected.add(workflowId)
          return { selectedWorkflows: newSelected }
        }),

      deselectWorkflow: (workflowId) =>
        set((state) => {
          const newSelected = new Set(state.selectedWorkflows)
          newSelected.delete(workflowId)
          return { selectedWorkflows: newSelected }
        }),

      toggleWorkflowSelection: (workflowId) =>
        set((state) => {
          const newSelected = new Set(state.selectedWorkflows)
          if (newSelected.has(workflowId)) {
            newSelected.delete(workflowId)
          } else {
            newSelected.add(workflowId)
          }
          return { selectedWorkflows: newSelected }
        }),

      clearSelection: () => set({ selectedWorkflows: new Set() }),

      selectOnly: (workflowId) => set({ selectedWorkflows: new Set([workflowId]) }),

      selectRange: (workflowIds, fromId, toId) => {
        const fromIndex = workflowIds.indexOf(fromId)
        const toIndex = workflowIds.indexOf(toId)

        if (fromIndex === -1 || toIndex === -1) return

        const [start, end] = fromIndex < toIndex ? [fromIndex, toIndex] : [toIndex, fromIndex]
        const rangeIds = workflowIds.slice(start, end + 1)

        set({ selectedWorkflows: new Set(rangeIds) })
      },

      isWorkflowSelected: (workflowId) => get().selectedWorkflows.has(workflowId),

      getFolderTree: (workspaceId) => {
        const folders = Object.values(get().folders).filter((f) => f.workspaceId === workspaceId)

        const buildTree = (parentId: string | null, level = 0): FolderTreeNode[] => {
          return folders
            .filter((folder) => folder.parentId === parentId)
            .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
            .map((folder) => ({
              ...folder,
              children: buildTree(folder.id, level + 1),
              level,
            }))
        }

        return buildTree(null)
      },

      getFolderById: (id) => get().folders[id],

      getChildFolders: (parentId) =>
        Object.values(get().folders)
          .filter((folder) => folder.parentId === parentId)
          .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)),

      getFolderPath: (folderId) => {
        const folders = get().folders
        const path: WorkflowFolder[] = []
        let currentId: string | null = folderId

        while (currentId && folders[currentId]) {
          const folder: WorkflowFolder = folders[currentId]
          path.unshift(folder)
          currentId = folder.parentId
        }

        return path
      },
    }),
    { name: 'folder-store' }
  )
)

export const useIsWorkflowSelected = (workflowId: string) =>
  useFolderStore((state) => state.selectedWorkflows.has(workflowId))
```

--------------------------------------------------------------------------------

````
