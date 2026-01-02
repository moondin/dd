---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 637
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 637 of 933)

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

---[FILE: tools.ts]---
Location: sim-main/apps/sim/stores/panel/copilot/tools.ts

```typescript
// Copilot tool definitions with schemas for LLM consumption
export const COPILOT_TOOLS = [
  {
    id: 'run_workflow',
    description:
      'Execute the current workflow. Use this to run workflows that require manual execution or input fields.',
    parameters: {
      type: 'object',
      properties: {
        workflow_input: {
          type: 'object',
          description:
            'JSON object with key-value mappings where each key is an input field name required by the workflow. For example: {"message": "Hello", "temperature": 0.7}',
        },
      },
      required: [],
    },
  },
] as const
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/stores/panel/copilot/types.ts

```typescript
import type { ClientToolCallState, ClientToolDisplay } from '@/lib/copilot/tools/client/base-tool'

export type ToolState = ClientToolCallState

export interface CopilotToolCall {
  id: string
  name: string
  state: ClientToolCallState
  params?: Record<string, any>
  display?: ClientToolDisplay
}

export interface MessageFileAttachment {
  id: string
  key: string
  filename: string
  media_type: string
  size: number
}

export interface CopilotMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  citations?: { id: number; title: string; url: string; similarity?: number }[]
  toolCalls?: CopilotToolCall[]
  contentBlocks?: Array<
    | { type: 'text'; content: string; timestamp: number }
    | {
        type: 'thinking'
        content: string
        timestamp: number
        duration?: number
        startTime?: number
      }
    | { type: 'tool_call'; toolCall: CopilotToolCall; timestamp: number }
    | { type: 'contexts'; contexts: ChatContext[]; timestamp: number }
  >
  fileAttachments?: MessageFileAttachment[]
  contexts?: ChatContext[]
}

// Contexts attached to a user message
export type ChatContext =
  | { kind: 'past_chat'; chatId: string; label: string }
  | { kind: 'workflow'; workflowId: string; label: string }
  | { kind: 'current_workflow'; workflowId: string; label: string }
  | { kind: 'blocks'; blockIds: string[]; label: string }
  | { kind: 'logs'; executionId?: string; label: string }
  | { kind: 'workflow_block'; workflowId: string; blockId: string; label: string }
  | { kind: 'knowledge'; knowledgeId?: string; label: string }
  | { kind: 'templates'; templateId?: string; label: string }
  | { kind: 'docs'; label: string }

import type { CopilotChat as ApiCopilotChat } from '@/lib/copilot/api'

export type CopilotChat = ApiCopilotChat

export type CopilotMode = 'ask' | 'build' | 'plan'

export interface CopilotState {
  mode: CopilotMode
  selectedModel:
    | 'gpt-5-fast'
    | 'gpt-5'
    | 'gpt-5-medium'
    | 'gpt-5-high'
    | 'gpt-5.1-fast'
    | 'gpt-5.1'
    | 'gpt-5.1-medium'
    | 'gpt-5.1-high'
    | 'gpt-5-codex'
    | 'gpt-5.1-codex'
    | 'gpt-4o'
    | 'gpt-4.1'
    | 'o3'
    | 'claude-4-sonnet'
    | 'claude-4.5-haiku'
    | 'claude-4.5-sonnet'
    | 'claude-4.5-opus'
    | 'claude-4.1-opus'
    | 'gemini-3-pro'
  agentPrefetch: boolean
  enabledModels: string[] | null // Null means not loaded yet, array of model IDs when loaded
  isCollapsed: boolean

  currentChat: CopilotChat | null
  chats: CopilotChat[]
  messages: CopilotMessage[]
  workflowId: string | null

  checkpoints: any[]
  messageCheckpoints: Record<string, any[]>

  isLoading: boolean
  isLoadingChats: boolean
  isLoadingCheckpoints: boolean
  isSendingMessage: boolean
  isSaving: boolean
  isRevertingCheckpoint: boolean
  isAborting: boolean

  error: string | null
  saveError: string | null
  checkpointError: string | null

  abortController: AbortController | null

  chatsLastLoadedAt: Date | null
  chatsLoadedForWorkflow: string | null

  revertState: { messageId: string; messageContent: string } | null
  inputValue: string

  planTodos: Array<{ id: string; content: string; completed?: boolean; executing?: boolean }>
  showPlanTodos: boolean

  // Streaming plan content from design_workflow tool (for plan mode section)
  streamingPlanContent: string

  // Map of toolCallId -> CopilotToolCall for quick access during streaming
  toolCallsById: Record<string, CopilotToolCall>

  // Transient flag to prevent auto-selecting a chat during new-chat UX
  suppressAutoSelect?: boolean

  // Explicitly track the current user message id for this in-flight query (for stats/diff correlation)
  currentUserMessageId?: string | null

  // Per-message metadata captured at send-time for reliable stats

  // Context usage tracking for percentage pill
  contextUsage: {
    usage: number
    percentage: number
    model: string
    contextWindow: number
    when: 'start' | 'end'
    estimatedTokens?: number
  } | null

  // Auto-allowed integration tools (tools that can run without confirmation)
  autoAllowedTools: string[]
}

export interface CopilotActions {
  setMode: (mode: CopilotMode) => void
  setSelectedModel: (model: CopilotStore['selectedModel']) => Promise<void>
  setAgentPrefetch: (prefetch: boolean) => void
  setEnabledModels: (models: string[] | null) => void
  fetchContextUsage: () => Promise<void>

  setWorkflowId: (workflowId: string | null) => Promise<void>
  validateCurrentChat: () => boolean
  loadChats: (forceRefresh?: boolean) => Promise<void>
  areChatsFresh: (workflowId: string) => boolean
  selectChat: (chat: CopilotChat) => Promise<void>
  createNewChat: () => Promise<void>
  deleteChat: (chatId: string) => Promise<void>

  sendMessage: (
    message: string,
    options?: {
      stream?: boolean
      fileAttachments?: MessageFileAttachment[]
      contexts?: ChatContext[]
      messageId?: string
    }
  ) => Promise<void>
  abortMessage: () => void
  sendImplicitFeedback: (
    implicitFeedback: string,
    toolCallState?: 'accepted' | 'rejected' | 'error'
  ) => Promise<void>
  updatePreviewToolCallState: (
    toolCallState: 'accepted' | 'rejected' | 'error',
    toolCallId?: string
  ) => void
  setToolCallState: (toolCall: any, newState: ClientToolCallState, options?: any) => void
  sendDocsMessage: (query: string, options?: { stream?: boolean; topK?: number }) => Promise<void>
  saveChatMessages: (chatId: string) => Promise<void>

  loadCheckpoints: (chatId: string) => Promise<void>
  loadMessageCheckpoints: (chatId: string) => Promise<void>
  revertToCheckpoint: (checkpointId: string) => Promise<void>
  getCheckpointsForMessage: (messageId: string) => any[]

  setPreviewYaml: (yamlContent: string) => Promise<void>
  clearPreviewYaml: () => Promise<void>

  clearMessages: () => void
  clearError: () => void
  clearSaveError: () => void
  clearCheckpointError: () => void
  retrySave: (chatId: string) => Promise<void>
  cleanup: () => void
  reset: () => void

  setInputValue: (value: string) => void
  clearRevertState: () => void

  setPlanTodos: (
    todos: Array<{ id: string; content: string; completed?: boolean; executing?: boolean }>
  ) => void
  updatePlanTodoStatus: (id: string, status: 'executing' | 'completed') => void
  closePlanTodos: () => void
  clearPlanArtifact: () => Promise<void>
  savePlanArtifact: (content: string) => Promise<void>

  handleStreamingResponse: (
    stream: ReadableStream,
    messageId: string,
    isContinuation?: boolean,
    triggerUserMessageId?: string
  ) => Promise<void>
  handleNewChatCreation: (newChatId: string) => Promise<void>
  updateDiffStore: (yamlContent: string, toolName?: string) => Promise<void>
  updateDiffStoreWithWorkflowState: (workflowState: any, toolName?: string) => Promise<void>
  executeIntegrationTool: (toolCallId: string) => Promise<void>
  skipIntegrationTool: (toolCallId: string) => void
  loadAutoAllowedTools: () => Promise<void>
  addAutoAllowedTool: (toolId: string) => Promise<void>
  removeAutoAllowedTool: (toolId: string) => Promise<void>
  isToolAutoAllowed: (toolId: string) => boolean
}

export type CopilotStore = CopilotState & CopilotActions
```

--------------------------------------------------------------------------------

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/panel/editor/store.ts

```typescript
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { usePanelStore } from '../store'

/**
 * Connections height constraints
 */
const DEFAULT_CONNECTIONS_HEIGHT = 115
const MIN_CONNECTIONS_HEIGHT = 30
const MAX_CONNECTIONS_HEIGHT = 300

/**
 * State for the Editor panel.
 * Tracks the currently selected block to edit its subblocks/values and connections panel height.
 */
interface PanelEditorState {
  /** Currently selected block identifier, or null when nothing is selected */
  currentBlockId: string | null
  /** Sets the current selected block identifier (use null to clear) */
  setCurrentBlockId: (blockId: string | null) => void
  /** Clears the current selection */
  clearCurrentBlock: () => void
  /** Height of the connections section in pixels */
  connectionsHeight: number
  /** Sets the connections section height */
  setConnectionsHeight: (height: number) => void
  /** Toggle connections between collapsed (min height) and expanded (default height) */
  toggleConnectionsCollapsed: () => void
}

/**
 * Editor panel store.
 * Persisted to preserve selection across navigations/refreshes.
 */
export const usePanelEditorStore = create<PanelEditorState>()(
  persist(
    (set, get) => ({
      currentBlockId: null,
      connectionsHeight: DEFAULT_CONNECTIONS_HEIGHT,
      setCurrentBlockId: (blockId) => {
        set({ currentBlockId: blockId })

        // When a block is selected, always switch to the editor tab
        if (blockId !== null) {
          const panelState = usePanelStore.getState()
          panelState.setActiveTab('editor')
        }
      },
      clearCurrentBlock: () => {
        set({ currentBlockId: null })
      },
      setConnectionsHeight: (height) => {
        const clampedHeight = Math.max(
          MIN_CONNECTIONS_HEIGHT,
          Math.min(MAX_CONNECTIONS_HEIGHT, height)
        )
        set({ connectionsHeight: clampedHeight })
        // Update CSS variable for immediate visual feedback
        if (typeof window !== 'undefined') {
          document.documentElement.style.setProperty(
            '--editor-connections-height',
            `${clampedHeight}px`
          )
        }
      },
      toggleConnectionsCollapsed: () => {
        const currentState = get()
        const isAtMinHeight = currentState.connectionsHeight <= 35
        const newHeight = isAtMinHeight ? DEFAULT_CONNECTIONS_HEIGHT : MIN_CONNECTIONS_HEIGHT

        set({ connectionsHeight: newHeight })

        // Update CSS variable
        if (typeof window !== 'undefined') {
          document.documentElement.style.setProperty(
            '--editor-connections-height',
            `${newHeight}px`
          )
        }
      },
    }),
    {
      name: 'panel-editor-state',
      onRehydrateStorage: () => (state) => {
        // Sync CSS variables with stored state after rehydration
        if (state && typeof window !== 'undefined') {
          document.documentElement.style.setProperty(
            '--editor-connections-height',
            `${state.connectionsHeight || DEFAULT_CONNECTIONS_HEIGHT}px`
          )
        }
      },
    }
  )
)
```

--------------------------------------------------------------------------------

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/panel/toolbar/store.ts

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Toolbar triggers height constraints
 * Minimum is set low to allow collapsing to just the header height (~30-40px)
 */
const DEFAULT_TOOLBAR_TRIGGERS_HEIGHT = 300
const MIN_TOOLBAR_HEIGHT = 30
const MAX_TOOLBAR_HEIGHT = 800

/**
 * Toolbar state interface
 */
interface ToolbarState {
  toolbarTriggersHeight: number
  setToolbarTriggersHeight: (height: number) => void
  preSearchHeight: number | null
  setPreSearchHeight: (height: number | null) => void
}

export const useToolbarStore = create<ToolbarState>()(
  persist(
    (set) => ({
      toolbarTriggersHeight: DEFAULT_TOOLBAR_TRIGGERS_HEIGHT,
      setToolbarTriggersHeight: (height) => {
        const clampedHeight = Math.max(MIN_TOOLBAR_HEIGHT, Math.min(MAX_TOOLBAR_HEIGHT, height))
        set({ toolbarTriggersHeight: clampedHeight })
        // Update CSS variable for immediate visual feedback
        if (typeof window !== 'undefined') {
          document.documentElement.style.setProperty(
            '--toolbar-triggers-height',
            `${clampedHeight}px`
          )
        }
      },
      preSearchHeight: null,
      setPreSearchHeight: (height) => set({ preSearchHeight: height }),
    }),
    {
      name: 'toolbar-state',
      onRehydrateStorage: () => (state) => {
        // Sync CSS variables with stored state after rehydration
        if (state && typeof window !== 'undefined') {
          document.documentElement.style.setProperty(
            '--toolbar-triggers-height',
            `${state.toolbarTriggersHeight || DEFAULT_TOOLBAR_TRIGGERS_HEIGHT}px`
          )
        }
      },
    }
  )
)
```

--------------------------------------------------------------------------------

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/panel/variables/store.ts

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createLogger } from '@/lib/logs/console/logger'
import type { Variable, VariablesStore } from '@/stores/panel/variables/types'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'

const logger = createLogger('VariablesStore')

function validateVariable(variable: Variable): string | undefined {
  try {
    switch (variable.type) {
      case 'number':
        if (Number.isNaN(Number(variable.value))) {
          return 'Not a valid number'
        }
        break
      case 'boolean':
        if (!/^(true|false)$/i.test(String(variable.value).trim())) {
          return 'Expected "true" or "false"'
        }
        break
      case 'object':
        try {
          const valueToEvaluate = String(variable.value).trim()

          if (!valueToEvaluate.startsWith('{') || !valueToEvaluate.endsWith('}')) {
            return 'Not a valid object format'
          }

          const parsed = new Function(`return ${valueToEvaluate}`)()

          if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
            return 'Not a valid object'
          }

          return undefined
        } catch (e) {
          logger.error('Object parsing error:', e)
          return 'Invalid object syntax'
        }
      case 'array':
        try {
          const parsed = JSON.parse(String(variable.value))
          if (!Array.isArray(parsed)) {
            return 'Not a valid JSON array'
          }
        } catch {
          return 'Invalid JSON array syntax'
        }
        break
    }
    return undefined
  } catch (e) {
    return e instanceof Error ? e.message : 'Invalid format'
  }
}

function migrateStringToPlain(variable: Variable): Variable {
  if (variable.type !== 'string') {
    return variable
  }

  const updated = {
    ...variable,
    type: 'plain' as const,
  }

  return updated
}

export const useVariablesStore = create<VariablesStore>()(
  devtools((set, get) => ({
    variables: {},
    isLoading: false,
    error: null,
    isEditing: null,

    async loadForWorkflow(workflowId) {
      try {
        set({ isLoading: true, error: null })
        const res = await fetch(`/api/workflows/${workflowId}/variables`, { method: 'GET' })
        if (!res.ok) {
          const text = await res.text().catch(() => '')
          throw new Error(text || `Failed to load variables: ${res.statusText}`)
        }
        const data = await res.json()
        const variables = (data?.data as Record<string, Variable>) || {}
        set((state) => {
          const withoutWorkflow = Object.fromEntries(
            Object.entries(state.variables).filter(
              (entry): entry is [string, Variable] => entry[1].workflowId !== workflowId
            )
          )
          return {
            variables: { ...withoutWorkflow, ...variables },
            isLoading: false,
            error: null,
          }
        })
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error'
        set({ isLoading: false, error: message })
      }
    },

    addVariable: (variable, providedId?: string) => {
      const id = providedId || crypto.randomUUID()

      const workflowVariables = get().getVariablesByWorkflowId(variable.workflowId)

      if (!variable.name || /^variable\d+$/.test(variable.name)) {
        const existingNumbers = workflowVariables
          .map((v) => {
            const match = v.name.match(/^variable(\d+)$/)
            return match ? Number.parseInt(match[1]) : 0
          })
          .filter((n) => !Number.isNaN(n))

        const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1

        variable.name = `variable${nextNumber}`
      }

      let uniqueName = variable.name
      let nameIndex = 1

      while (workflowVariables.some((v) => v.name === uniqueName)) {
        uniqueName = `${variable.name} (${nameIndex})`
        nameIndex++
      }

      if (variable.type === 'string') {
        variable.type = 'plain'
      }

      const newVariable: Variable = {
        id,
        workflowId: variable.workflowId,
        name: uniqueName,
        type: variable.type,
        value: variable.value || '',
        validationError: undefined,
      }

      const validationError = validateVariable(newVariable)
      if (validationError) {
        newVariable.validationError = validationError
      }

      set((state) => ({
        variables: {
          ...state.variables,
          [id]: newVariable,
        },
      }))

      return id
    },

    updateVariable: (id, update) => {
      set((state) => {
        if (!state.variables[id]) return state

        if (update.name !== undefined) {
          const oldVariable = state.variables[id]
          const oldVariableName = oldVariable.name
          const newName = update.name.trim()

          if (!newName) {
            update = { ...update }
            update.name = undefined
          } else if (newName !== oldVariableName) {
            const subBlockStore = useSubBlockStore.getState()
            const activeWorkflowId = useWorkflowRegistry.getState().activeWorkflowId

            if (activeWorkflowId) {
              const workflowValues = subBlockStore.workflowValues[activeWorkflowId] || {}
              const updatedWorkflowValues = { ...workflowValues }

              Object.entries(workflowValues).forEach(([blockId, blockValues]) => {
                Object.entries(blockValues as Record<string, any>).forEach(
                  ([subBlockId, value]) => {
                    const oldVarName = oldVariableName.replace(/\s+/g, '').toLowerCase()
                    const newVarName = newName.replace(/\s+/g, '').toLowerCase()
                    const regex = new RegExp(`<variable\.${oldVarName}>`, 'gi')

                    updatedWorkflowValues[blockId][subBlockId] = updateReferences(
                      value,
                      regex,
                      `<variable.${newVarName}>`
                    )

                    function updateReferences(value: any, regex: RegExp, replacement: string): any {
                      if (typeof value === 'string') {
                        return regex.test(value) ? value.replace(regex, replacement) : value
                      }

                      if (Array.isArray(value)) {
                        return value.map((item) => updateReferences(item, regex, replacement))
                      }

                      if (value !== null && typeof value === 'object') {
                        const result = { ...value }
                        for (const key in result) {
                          result[key] = updateReferences(result[key], regex, replacement)
                        }
                        return result
                      }

                      return value
                    }
                  }
                )
              })

              useSubBlockStore.setState({
                workflowValues: {
                  ...subBlockStore.workflowValues,
                  [activeWorkflowId]: updatedWorkflowValues,
                },
              })
            }
          }
        }

        if (update.type === 'string') {
          update = { ...update, type: 'plain' }
        }

        const updatedVariable: Variable = {
          ...state.variables[id],
          ...update,
          validationError: undefined,
        }

        if (update.type || update.value !== undefined) {
          updatedVariable.validationError = validateVariable(updatedVariable)
        }

        const updated = {
          ...state.variables,
          [id]: updatedVariable,
        }

        return { variables: updated }
      })
    },

    deleteVariable: (id) => {
      set((state) => {
        if (!state.variables[id]) return state

        const workflowId = state.variables[id].workflowId
        const { [id]: _, ...rest } = state.variables

        return { variables: rest }
      })
    },

    duplicateVariable: (id, providedId?: string) => {
      const state = get()
      if (!state.variables[id]) return ''

      const variable = state.variables[id]
      const newId = providedId || crypto.randomUUID()

      const workflowVariables = get().getVariablesByWorkflowId(variable.workflowId)
      const baseName = `${variable.name} (copy)`
      let uniqueName = baseName
      let nameIndex = 1

      while (workflowVariables.some((v) => v.name === uniqueName)) {
        uniqueName = `${baseName} (${nameIndex})`
        nameIndex++
      }

      set((state) => ({
        variables: {
          ...state.variables,
          [newId]: {
            id: newId,
            workflowId: variable.workflowId,
            name: uniqueName,
            type: variable.type,
            value: variable.value,
          },
        },
      }))

      return newId
    },

    getVariablesByWorkflowId: (workflowId) => {
      return Object.values(get().variables).filter((variable) => variable.workflowId === workflowId)
    },
  }))
)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/stores/panel/variables/types.ts

```typescript
/**
 * Variable types supported in the application
 * Note: 'string' is deprecated - use 'plain' for text values instead
 */
export type VariableType = 'plain' | 'number' | 'boolean' | 'object' | 'array' | 'string'

/**
 * Represents a workflow variable with workflow-specific naming
 * Variable names must be unique within each workflow
 */
export interface Variable {
  id: string
  workflowId: string
  name: string // Must be unique per workflow
  type: VariableType
  value: any
  validationError?: string // Tracks format validation errors
}

export interface VariablesStore {
  variables: Record<string, Variable>
  isLoading: boolean
  error: string | null
  isEditing: string | null

  /**
   * Loads variables for a specific workflow from the API and hydrates the store.
   */
  loadForWorkflow: (workflowId: string) => Promise<void>

  /**
   * Adds a new variable with automatic name uniqueness validation
   * If a variable with the same name exists, it will be suffixed with a number
   * Optionally accepts a predetermined ID for collaborative operations
   */
  addVariable: (variable: Omit<Variable, 'id'>, providedId?: string) => string

  /**
   * Updates a variable, ensuring name remains unique within the workflow
   * If an updated name conflicts with existing ones, a numbered suffix is added
   */
  updateVariable: (id: string, update: Partial<Omit<Variable, 'id' | 'workflowId'>>) => void

  deleteVariable: (id: string) => void

  /**
   * Duplicates a variable with a "(copy)" suffix, ensuring name uniqueness
   * Optionally accepts a predetermined ID for collaborative operations
   */
  duplicateVariable: (id: string, providedId?: string) => string

  /**
   * Returns all variables for a specific workflow
   */
  getVariablesByWorkflowId: (workflowId: string) => Variable[]
}
```

--------------------------------------------------------------------------------

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/providers/store.ts

```typescript
import { create } from 'zustand'
import { createLogger } from '@/lib/logs/console/logger'
import type { ProvidersStore } from '@/stores/providers/types'

const logger = createLogger('ProvidersStore')

export const useProvidersStore = create<ProvidersStore>((set, get) => ({
  providers: {
    base: { models: [], isLoading: false },
    ollama: { models: [], isLoading: false },
    vllm: { models: [], isLoading: false },
    openrouter: { models: [], isLoading: false },
  },

  setProviderModels: (provider, models) => {
    logger.info(`Updated ${provider} models`, { count: models.length })
    set((state) => ({
      providers: {
        ...state.providers,
        [provider]: {
          ...state.providers[provider],
          models,
        },
      },
    }))
  },

  setProviderLoading: (provider, isLoading) => {
    set((state) => ({
      providers: {
        ...state.providers,
        [provider]: {
          ...state.providers[provider],
          isLoading,
        },
      },
    }))
  },

  getProvider: (provider) => {
    return get().providers[provider]
  },
}))
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/stores/providers/types.ts

```typescript
export type ProviderName = 'ollama' | 'vllm' | 'openrouter' | 'base'

export interface ProviderState {
  models: string[]
  isLoading: boolean
}

export interface ProvidersStore {
  providers: Record<ProviderName, ProviderState>
  setProviderModels: (provider: ProviderName, models: string[]) => void
  setProviderLoading: (provider: ProviderName, isLoading: boolean) => void
  getProvider: (provider: ProviderName) => ProviderState
}
```

--------------------------------------------------------------------------------

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/search-modal/store.ts

```typescript
import { create } from 'zustand'

/**
 * Global state for the universal search modal.
 *
 * Centralizing this state in a store allows any component (e.g. sidebar,
 * workflow command list, keyboard shortcuts) to open or close the modal
 * without relying on DOM events or prop drilling.
 */
interface SearchModalState {
  /** Whether the search modal is currently open. */
  isOpen: boolean
  /**
   * Explicitly set the open state of the modal.
   *
   * @param open - New open state.
   */
  setOpen: (open: boolean) => void
  /**
   * Convenience method to open the modal.
   */
  open: () => void
  /**
   * Convenience method to close the modal.
   */
  close: () => void
}

export const useSearchModalStore = create<SearchModalState>((set) => ({
  isOpen: false,
  setOpen: (open: boolean) => {
    set({ isOpen: open })
  },
  open: () => {
    set({ isOpen: true })
  },
  close: () => {
    set({ isOpen: false })
  },
}))
```

--------------------------------------------------------------------------------

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/settings/environment/store.ts

```typescript
import { create } from 'zustand'
import { fetchPersonalEnvironment } from '@/lib/environment/api'
import { createLogger } from '@/lib/logs/console/logger'
import type { EnvironmentStore, EnvironmentVariable } from '@/stores/settings/environment/types'

const logger = createLogger('EnvironmentStore')

export const useEnvironmentStore = create<EnvironmentStore>()((set, get) => ({
  variables: {},
  isLoading: false,
  error: null,

  loadEnvironmentVariables: async () => {
    try {
      set({ isLoading: true, error: null })
      const data = await fetchPersonalEnvironment()
      set({ variables: data, isLoading: false })
    } catch (error) {
      logger.error('Error loading environment variables:', { error })
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      })
      throw error
    }
  },

  setVariables: (variables: Record<string, EnvironmentVariable>) => {
    set({ variables })
  },

  getAllVariables: () => {
    return get().variables
  },

  reset: () => {
    set({
      variables: {},
      isLoading: false,
      error: null,
    })
  },
}))
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/stores/settings/environment/types.ts

```typescript
export interface EnvironmentVariable {
  key: string
  value: string
}

export interface CachedWorkspaceEnvData {
  workspace: Record<string, string>
  personal: Record<string, string>
  conflicts: string[]
  cachedAt: number
}

export interface EnvironmentState {
  variables: Record<string, EnvironmentVariable>
  isLoading: boolean
  error: string | null
}

export interface EnvironmentStore extends EnvironmentState {
  loadEnvironmentVariables: () => Promise<void>
  setVariables: (variables: Record<string, EnvironmentVariable>) => void
  getAllVariables: () => Record<string, EnvironmentVariable>
  reset: () => void
}
```

--------------------------------------------------------------------------------

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/settings/general/store.ts

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createLogger } from '@/lib/logs/console/logger'
import type { General, GeneralStore } from '@/stores/settings/general/types'

const logger = createLogger('GeneralStore')

const initialState: General = {
  isAutoConnectEnabled: true,
  showTrainingControls: false,
  superUserModeEnabled: true,
  theme: 'system',
  telemetryEnabled: true,
  isBillingUsageNotificationsEnabled: true,
  isErrorNotificationsEnabled: true,
}

export const useGeneralStore = create<GeneralStore>()(
  devtools(
    (set) => ({
      ...initialState,
      setSettings: (settings) => {
        logger.debug('Updating general settings store', {
          keys: Object.keys(settings),
        })
        set((state) => ({
          ...state,
          ...settings,
        }))
      },
      reset: () => set(initialState),
    }),
    { name: 'general-store' }
  )
)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/stores/settings/general/types.ts

```typescript
export interface General {
  isAutoConnectEnabled: boolean
  showTrainingControls: boolean
  superUserModeEnabled: boolean
  theme: 'system' | 'light' | 'dark'
  telemetryEnabled: boolean
  isBillingUsageNotificationsEnabled: boolean
  isErrorNotificationsEnabled: boolean
}

export interface GeneralStore extends General {
  setSettings: (settings: Partial<General>) => void
  reset: () => void
}

export type UserSettings = {
  theme: 'system' | 'light' | 'dark'
  autoConnect: boolean
  showTrainingControls: boolean
  superUserModeEnabled: boolean
  telemetryEnabled: boolean
  isBillingUsageNotificationsEnabled: boolean
  errorNotificationsEnabled: boolean
}
```

--------------------------------------------------------------------------------

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/settings-modal/store.ts

```typescript
'use client'

import { create } from 'zustand'

type SettingsSection =
  | 'general'
  | 'environment'
  | 'template-profile'
  | 'integrations'
  | 'apikeys'
  | 'files'
  | 'subscription'
  | 'team'
  | 'sso'
  | 'copilot'
  | 'mcp'
  | 'custom-tools'

interface SettingsModalState {
  isOpen: boolean
  initialSection: SettingsSection | null
  mcpServerId: string | null

  openModal: (options?: { section?: SettingsSection; mcpServerId?: string }) => void
  closeModal: () => void
  clearInitialState: () => void
}

export const useSettingsModalStore = create<SettingsModalState>((set) => ({
  isOpen: false,
  initialSection: null,
  mcpServerId: null,

  openModal: (options) =>
    set({
      isOpen: true,
      initialSection: options?.section || null,
      mcpServerId: options?.mcpServerId || null,
    }),

  closeModal: () =>
    set({
      isOpen: false,
    }),

  clearInitialState: () =>
    set({
      initialSection: null,
      mcpServerId: null,
    }),
}))
```

--------------------------------------------------------------------------------

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/sidebar/store.ts

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Sidebar state interface
 */
interface SidebarState {
  workspaceDropdownOpen: boolean
  sidebarWidth: number
  isCollapsed: boolean
  _hasHydrated: boolean
  setWorkspaceDropdownOpen: (isOpen: boolean) => void
  setSidebarWidth: (width: number) => void
  setIsCollapsed: (isCollapsed: boolean) => void
  setHasHydrated: (hasHydrated: boolean) => void
}

/**
 * Sidebar width constraints
 * Note: Maximum width is enforced dynamically at 30% of viewport width in the resize hook
 */
export const DEFAULT_SIDEBAR_WIDTH = 232
export const MIN_SIDEBAR_WIDTH = 232

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      workspaceDropdownOpen: false,
      sidebarWidth: DEFAULT_SIDEBAR_WIDTH,
      isCollapsed: false,
      _hasHydrated: false,
      setWorkspaceDropdownOpen: (isOpen) => set({ workspaceDropdownOpen: isOpen }),
      setSidebarWidth: (width) => {
        // Only enforce minimum - maximum is enforced dynamically by the resize hook
        const clampedWidth = Math.max(MIN_SIDEBAR_WIDTH, width)
        set({ sidebarWidth: clampedWidth })
        // Update CSS variable for immediate visual feedback
        if (typeof window !== 'undefined') {
          document.documentElement.style.setProperty('--sidebar-width', `${clampedWidth}px`)
        }
      },
      setIsCollapsed: (isCollapsed) => {
        set({ isCollapsed })
        // Set width to 0 when collapsed (floating UI doesn't need sidebar space)
        if (isCollapsed && typeof window !== 'undefined') {
          document.documentElement.style.setProperty('--sidebar-width', '0px')
        } else if (!isCollapsed && typeof window !== 'undefined') {
          // Restore to stored width when expanding
          const currentWidth = get().sidebarWidth
          document.documentElement.style.setProperty('--sidebar-width', `${currentWidth}px`)
        }
      },
      setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
    }),
    {
      name: 'sidebar-state',
      onRehydrateStorage: () => (state) => {
        // Mark store as hydrated and apply CSS variables
        if (state) {
          state.setHasHydrated(true)
          if (typeof window !== 'undefined') {
            const width = state.isCollapsed ? 0 : state.sidebarWidth
            document.documentElement.style.setProperty('--sidebar-width', `${width}px`)
          }
        }
      },
      partialize: (state) => ({
        sidebarWidth: state.sidebarWidth,
        isCollapsed: state.isCollapsed,
      }),
    }
  )
)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/stores/terminal/index.ts

```typescript
export type { ConsoleEntry, ConsoleStore, ConsoleUpdate } from './console'
export { useTerminalConsoleStore } from './console'
export { DEFAULT_TERMINAL_HEIGHT, MIN_TERMINAL_HEIGHT, useTerminalStore } from './store'
```

--------------------------------------------------------------------------------

````
