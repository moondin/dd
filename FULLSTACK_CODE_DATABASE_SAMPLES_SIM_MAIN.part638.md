---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 638
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 638 of 933)

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
Location: sim-main/apps/sim/stores/terminal/store.ts

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Display mode type for terminal output.
 *
 * @remarks
 * Currently unused but kept for future customization of terminal rendering.
 */
// export type DisplayMode = 'raw' | 'prettier'

/**
 * Terminal state persisted across workspace sessions.
 */
interface TerminalState {
  terminalHeight: number
  setTerminalHeight: (height: number) => void
  lastExpandedHeight: number
  outputPanelWidth: number
  setOutputPanelWidth: (width: number) => void
  openOnRun: boolean
  setOpenOnRun: (open: boolean) => void
  wrapText: boolean
  setWrapText: (wrap: boolean) => void
  /**
   * Indicates whether the terminal is currently being resized via mouse drag.
   *
   * @remarks
   * This flag is used by other workspace UI elements (e.g. notifications,
   * diff controls) to temporarily disable position transitions while the
   * terminal height is actively changing, avoiding janky animations.
   */
  isResizing: boolean
  /**
   * Updates the {@link TerminalState.isResizing} flag.
   *
   * @param isResizing - True while the terminal is being resized.
   */
  setIsResizing: (isResizing: boolean) => void
  _hasHydrated: boolean
  setHasHydrated: (hasHydrated: boolean) => void
}

/**
 * Terminal height constraints.
 *
 * @remarks
 * The maximum height is enforced dynamically at 70% of the viewport height
 * inside the resize hook to keep the workflow canvas visible.
 */
export const MIN_TERMINAL_HEIGHT = 30
export const DEFAULT_TERMINAL_HEIGHT = 196

/**
 * Output panel width constraints.
 */
const MIN_OUTPUT_PANEL_WIDTH = 440
const DEFAULT_OUTPUT_PANEL_WIDTH = 440

/**
 * Default display mode for terminal output.
 */
// const DEFAULT_DISPLAY_MODE: DisplayMode = 'prettier'

export const useTerminalStore = create<TerminalState>()(
  persist(
    (set) => ({
      terminalHeight: DEFAULT_TERMINAL_HEIGHT,
      lastExpandedHeight: DEFAULT_TERMINAL_HEIGHT,
      isResizing: false,
      /**
       * Updates the terminal height and synchronizes the CSS custom property.
       *
       * @remarks
       * - Enforces a minimum height to keep the resize handle usable.
       * - Persists {@link TerminalState.lastExpandedHeight} only when the
       *   height is expanded above the minimum.
       *
       * @param height - Desired terminal height in pixels.
       */
      setTerminalHeight: (height) => {
        const clampedHeight = Math.max(MIN_TERMINAL_HEIGHT, height)

        set((state) => ({
          terminalHeight: clampedHeight,
          lastExpandedHeight:
            clampedHeight > MIN_TERMINAL_HEIGHT ? clampedHeight : state.lastExpandedHeight,
        }))

        // Update CSS variable for immediate visual feedback
        if (typeof window !== 'undefined') {
          document.documentElement.style.setProperty('--terminal-height', `${clampedHeight}px`)
        }
      },
      /**
       * Updates the terminal resize state used to coordinate layout transitions.
       *
       * @param isResizing - True while the terminal is being resized via mouse drag.
       */
      setIsResizing: (isResizing) => {
        set({ isResizing })
      },
      outputPanelWidth: DEFAULT_OUTPUT_PANEL_WIDTH,
      /**
       * Updates the output panel width, enforcing the minimum constraint.
       *
       * @param width - Desired width in pixels for the output panel.
       */
      setOutputPanelWidth: (width) => {
        const clampedWidth = Math.max(MIN_OUTPUT_PANEL_WIDTH, width)
        set({ outputPanelWidth: clampedWidth })
      },
      openOnRun: true,
      /**
       * Enables or disables automatic terminal opening when new entries are added.
       *
       * @param open - Whether the terminal should open on new console entries.
       */
      setOpenOnRun: (open) => {
        set({ openOnRun: open })
      },
      wrapText: true,
      /**
       * Enables or disables text wrapping in the output panel.
       *
       * @param wrap - Whether output text should wrap.
       */
      setWrapText: (wrap) => {
        set({ wrapText: wrap })
      },
      /**
       * Indicates whether the terminal store has finished client-side hydration.
       */
      _hasHydrated: false,
      /**
       * Marks the store as hydrated on the client.
       *
       * @param hasHydrated - True when client-side hydration is complete.
       */
      setHasHydrated: (hasHydrated) => {
        set({ _hasHydrated: hasHydrated })
      },
    }),
    {
      name: 'terminal-state',
      /**
       * Synchronizes the `--terminal-height` CSS custom property with the
       * persisted store value after client-side rehydration.
       */
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          document.documentElement.style.setProperty(
            '--terminal-height',
            `${state.terminalHeight}px`
          )
        }
      },
    }
  )
)
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/stores/terminal/console/index.ts

```typescript
export { useTerminalConsoleStore } from './store'
export type { ConsoleEntry, ConsoleStore, ConsoleUpdate } from './types'
```

--------------------------------------------------------------------------------

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/terminal/console/store.ts

```typescript
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { redactApiKeys } from '@/lib/core/security/redaction'
import { createLogger } from '@/lib/logs/console/logger'
import type { NormalizedBlockOutput } from '@/executor/types'
import { useExecutionStore } from '@/stores/execution/store'
import { useNotificationStore } from '@/stores/notifications'
import { useGeneralStore } from '@/stores/settings/general/store'
import type { ConsoleEntry, ConsoleStore, ConsoleUpdate } from '@/stores/terminal/console/types'

const logger = createLogger('TerminalConsoleStore')

/**
 * Updates a NormalizedBlockOutput with new content
 */
const updateBlockOutput = (
  existingOutput: NormalizedBlockOutput | undefined,
  contentUpdate: string
): NormalizedBlockOutput => {
  return {
    ...(existingOutput || {}),
    content: contentUpdate,
  }
}

/**
 * Checks if output represents a streaming object that should be skipped
 */
const isStreamingOutput = (output: any): boolean => {
  if (typeof ReadableStream !== 'undefined' && output instanceof ReadableStream) {
    return true
  }

  if (typeof output !== 'object' || !output) {
    return false
  }

  // Check for streaming indicators
  return (
    output.isStreaming === true ||
    ('executionData' in output &&
      typeof output.executionData === 'object' &&
      output.executionData?.isStreaming === true) ||
    'stream' in output
  )
}

/**
 * Checks if entry should be skipped to prevent duplicates
 */
const shouldSkipEntry = (output: any): boolean => {
  if (typeof output !== 'object' || !output) {
    return false
  }

  // Skip raw streaming objects with both stream and executionData
  if ('stream' in output && 'executionData' in output) {
    return true
  }

  // Skip raw StreamingExecution objects
  if ('stream' in output && 'execution' in output) {
    return true
  }

  return false
}

export const useTerminalConsoleStore = create<ConsoleStore>()(
  devtools(
    persist(
      (set, get) => ({
        entries: [],
        isOpen: false,

        addConsole: (entry: Omit<ConsoleEntry, 'id' | 'timestamp'>) => {
          set((state) => {
            // Skip duplicate streaming entries
            if (shouldSkipEntry(entry.output)) {
              return { entries: state.entries }
            }

            // Redact API keys from output
            const redactedEntry = { ...entry }
            if (
              !isStreamingOutput(entry.output) &&
              redactedEntry.output &&
              typeof redactedEntry.output === 'object'
            ) {
              redactedEntry.output = redactApiKeys(redactedEntry.output)
            }

            // Create new entry with ID and timestamp
            const newEntry: ConsoleEntry = {
              ...redactedEntry,
              id: crypto.randomUUID(),
              timestamp: new Date().toISOString(),
            }

            return { entries: [newEntry, ...state.entries] }
          })

          const newEntry = get().entries[0]

          // Surface error notifications immediately when error entries are added
          // Only show if error notifications are enabled in settings
          if (newEntry?.error) {
            const { isErrorNotificationsEnabled } = useGeneralStore.getState()

            if (isErrorNotificationsEnabled) {
              try {
                const errorMessage = String(newEntry.error)
                const blockName = newEntry.blockName || 'Unknown Block'

                // Copilot message includes block name for better debugging context
                const copilotMessage = `${errorMessage}\n\nError in ${blockName}.\n\nPlease fix this.`

                useNotificationStore.getState().addNotification({
                  level: 'error',
                  message: errorMessage,
                  workflowId: entry.workflowId,
                  action: {
                    type: 'copilot',
                    message: copilotMessage,
                  },
                })
              } catch (notificationError) {
                logger.error('Failed to create block error notification', {
                  entryId: newEntry.id,
                  error: notificationError,
                })
              }
            }
          }

          return newEntry
        },

        /**
         * Clears console entries for a specific workflow and clears the run path
         * @param workflowId - The workflow ID to clear entries for
         */
        clearWorkflowConsole: (workflowId: string) => {
          set((state) => ({
            entries: state.entries.filter((entry) => entry.workflowId !== workflowId),
          }))
          // Clear run path indicators when console is cleared
          useExecutionStore.getState().clearRunPath()
        },

        /**
         * Clears all console entries or entries for a specific workflow and clears the run path
         * @param workflowId - The workflow ID to clear entries for, or null to clear all
         * @deprecated Use clearWorkflowConsole for clearing specific workflows
         */
        clearConsole: (workflowId: string | null) => {
          set((state) => ({
            entries: workflowId
              ? state.entries.filter((entry) => entry.workflowId !== workflowId)
              : [],
          }))
          // Clear run path indicators when console is cleared
          useExecutionStore.getState().clearRunPath()
        },

        exportConsoleCSV: (workflowId: string) => {
          const entries = get().entries.filter((entry) => entry.workflowId === workflowId)

          if (entries.length === 0) {
            return
          }

          /**
           * Formats a value for CSV export
           */
          const formatCSVValue = (value: any): string => {
            if (value === null || value === undefined) {
              return ''
            }

            let stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value)

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

          const headers = [
            'timestamp',
            'blockName',
            'blockType',
            'startedAt',
            'endedAt',
            'durationMs',
            'success',
            'input',
            'output',
            'error',
            'warning',
          ]

          const csvRows = [
            headers.join(','),
            ...entries.map((entry) =>
              [
                formatCSVValue(entry.timestamp),
                formatCSVValue(entry.blockName),
                formatCSVValue(entry.blockType),
                formatCSVValue(entry.startedAt),
                formatCSVValue(entry.endedAt),
                formatCSVValue(entry.durationMs),
                formatCSVValue(entry.success),
                formatCSVValue(entry.input),
                formatCSVValue(entry.output),
                formatCSVValue(entry.error),
                formatCSVValue(entry.warning),
              ].join(',')
            ),
          ]

          const csvContent = csvRows.join('\n')
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
          const filename = `terminal-console-${workflowId}-${timestamp}.csv`

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

        getWorkflowEntries: (workflowId) => {
          return get().entries.filter((entry) => entry.workflowId === workflowId)
        },

        toggleConsole: () => {
          set((state) => ({ isOpen: !state.isOpen }))
        },

        updateConsole: (blockId: string, update: string | ConsoleUpdate, executionId?: string) => {
          set((state) => {
            const updatedEntries = state.entries.map((entry) => {
              // Only update if both blockId and executionId match
              if (entry.blockId !== blockId || entry.executionId !== executionId) {
                return entry
              }

              // Handle simple string update
              if (typeof update === 'string') {
                const newOutput = updateBlockOutput(entry.output, update)
                return { ...entry, output: newOutput }
              }

              // Handle complex update
              const updatedEntry = { ...entry }

              if (update.content !== undefined) {
                updatedEntry.output = updateBlockOutput(entry.output, update.content)
              }

              if (update.replaceOutput !== undefined) {
                updatedEntry.output = update.replaceOutput
              } else if (update.output !== undefined) {
                updatedEntry.output = {
                  ...(entry.output || {}),
                  ...update.output,
                }
              }

              if (update.error !== undefined) {
                updatedEntry.error = update.error
              }

              if (update.warning !== undefined) {
                updatedEntry.warning = update.warning
              }

              if (update.success !== undefined) {
                updatedEntry.success = update.success
              }

              if (update.endedAt !== undefined) {
                updatedEntry.endedAt = update.endedAt
              }

              if (update.durationMs !== undefined) {
                updatedEntry.durationMs = update.durationMs
              }

              if (update.input !== undefined) {
                updatedEntry.input = update.input
              }

              return updatedEntry
            })

            return { entries: updatedEntries }
          })
        },
      }),
      {
        name: 'terminal-console-store',
      }
    )
  )
)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/stores/terminal/console/types.ts

```typescript
import type { NormalizedBlockOutput } from '@/executor/types'
import type { SubflowType } from '@/stores/workflows/workflow/types'

/**
 * Console entry for terminal logs
 */
export interface ConsoleEntry {
  id: string
  timestamp: string
  workflowId: string
  blockId: string
  blockName: string
  blockType: string
  executionId?: string
  startedAt?: string
  endedAt?: string
  durationMs?: number
  success?: boolean
  input?: any
  output?: NormalizedBlockOutput
  error?: string | Error | null
  warning?: string
  iterationCurrent?: number
  iterationTotal?: number
  iterationType?: SubflowType
}

/**
 * Console update payload for partial updates
 */
export interface ConsoleUpdate {
  content?: string
  output?: Partial<NormalizedBlockOutput>
  replaceOutput?: NormalizedBlockOutput
  error?: string | Error | null
  warning?: string
  success?: boolean
  endedAt?: string
  durationMs?: number
  input?: any
}

/**
 * Console store state and actions
 */
export interface ConsoleStore {
  entries: ConsoleEntry[]
  isOpen: boolean
  addConsole: (entry: Omit<ConsoleEntry, 'id' | 'timestamp'>) => ConsoleEntry
  clearWorkflowConsole: (workflowId: string) => void
  clearConsole: (workflowId: string | null) => void
  exportConsoleCSV: (workflowId: string) => void
  getWorkflowEntries: (workflowId: string) => ConsoleEntry[]
  toggleConsole: () => void
  updateConsole: (blockId: string, update: string | ConsoleUpdate, executionId?: string) => void
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/stores/undo-redo/index.ts

```typescript
export { runWithUndoRedoRecordingSuspended, useUndoRedoStore } from './store'
export * from './types'
export * from './utils'
```

--------------------------------------------------------------------------------

---[FILE: store.ts]---
Location: sim-main/apps/sim/stores/undo-redo/store.ts

```typescript
import type { Edge } from 'reactflow'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createLogger } from '@/lib/logs/console/logger'
import type {
  MoveBlockOperation,
  Operation,
  OperationEntry,
  RemoveBlockOperation,
  RemoveEdgeOperation,
  UndoRedoState,
} from '@/stores/undo-redo/types'
import type { BlockState } from '@/stores/workflows/workflow/types'

const logger = createLogger('UndoRedoStore')
const DEFAULT_CAPACITY = 100
const MAX_STACKS = 5

let recordingSuspendDepth = 0

function isRecordingSuspended(): boolean {
  return recordingSuspendDepth > 0
}

/**
 * Temporarily suspends undo/redo recording while the provided callback runs.
 *
 * @param callback - Function to execute while recording is disabled.
 * @returns The callback result.
 */
export async function runWithUndoRedoRecordingSuspended<T>(
  callback: () => Promise<T> | T
): Promise<T> {
  recordingSuspendDepth += 1
  try {
    return await Promise.resolve(callback())
  } finally {
    recordingSuspendDepth = Math.max(0, recordingSuspendDepth - 1)
  }
}

function getStackKey(workflowId: string, userId: string): string {
  return `${workflowId}:${userId}`
}

/**
 * Custom storage adapter for Zustand's persist middleware.
 * We need this wrapper to gracefully handle 'QuotaExceededError' when localStorage is full,
 * Without this, the default storage engine would throw and crash the application.
 * and to properly handle SSR/Node.js environments.
 */
const safeStorageAdapter = {
  getItem: (name: string): string | null => {
    if (typeof localStorage === 'undefined') return null
    try {
      return localStorage.getItem(name)
    } catch (e) {
      logger.warn('Failed to read from localStorage', e)
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem(name, value)
    } catch (e) {
      // Log warning but don't crash - this handles QuotaExceededError
      logger.warn('Failed to save to localStorage', e)
    }
  },
  removeItem: (name: string): void => {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.removeItem(name)
    } catch (e) {
      logger.warn('Failed to remove from localStorage', e)
    }
  },
}

function isOperationApplicable(
  operation: Operation,
  graph: { blocksById: Record<string, BlockState>; edgesById: Record<string, Edge> }
): boolean {
  switch (operation.type) {
    case 'remove-block': {
      const op = operation as RemoveBlockOperation
      return Boolean(graph.blocksById[op.data.blockId])
    }
    case 'add-block': {
      const blockId = operation.data.blockId
      return !graph.blocksById[blockId]
    }
    case 'move-block': {
      const op = operation as MoveBlockOperation
      return Boolean(graph.blocksById[op.data.blockId])
    }
    case 'update-parent': {
      const blockId = operation.data.blockId
      return Boolean(graph.blocksById[blockId])
    }
    case 'duplicate-block': {
      const duplicatedId = operation.data.duplicatedBlockId
      return Boolean(graph.blocksById[duplicatedId])
    }
    case 'remove-edge': {
      const op = operation as RemoveEdgeOperation
      return Boolean(graph.edgesById[op.data.edgeId])
    }
    case 'add-edge': {
      const edgeId = operation.data.edgeId
      return !graph.edgesById[edgeId]
    }
    case 'add-subflow':
    case 'remove-subflow': {
      const subflowId = operation.data.subflowId
      return operation.type === 'remove-subflow'
        ? Boolean(graph.blocksById[subflowId])
        : !graph.blocksById[subflowId]
    }
    default:
      return true
  }
}

export const useUndoRedoStore = create<UndoRedoState>()(
  persist(
    (set, get) => ({
      stacks: {},
      capacity: DEFAULT_CAPACITY,

      push: (workflowId: string, userId: string, entry: OperationEntry) => {
        if (isRecordingSuspended()) {
          logger.debug('Skipped push while undo/redo recording suspended', {
            workflowId,
            userId,
            operationType: entry.operation.type,
          })
          return
        }

        const key = getStackKey(workflowId, userId)
        const state = get()
        const currentStacks = { ...state.stacks }

        // Limit number of stacks
        const stackKeys = Object.keys(currentStacks)
        if (stackKeys.length >= MAX_STACKS && !currentStacks[key]) {
          let oldestKey: string | null = null
          let oldestTime = Number.POSITIVE_INFINITY

          for (const k of stackKeys) {
            const t = currentStacks[k].lastUpdated ?? 0
            if (t < oldestTime) {
              oldestTime = t
              oldestKey = k
            }
          }

          if (oldestKey) {
            delete currentStacks[oldestKey]
          }
        }

        const stack = currentStacks[key] || { undo: [], redo: [] }

        // Prevent duplicate diff operations (apply-diff, accept-diff, reject-diff)
        if (['apply-diff', 'accept-diff', 'reject-diff'].includes(entry.operation.type)) {
          const lastEntry = stack.undo[stack.undo.length - 1]
          if (lastEntry && lastEntry.operation.type === entry.operation.type) {
            // Check if it's a duplicate by comparing the relevant state data
            const lastData = lastEntry.operation.data as any
            const newData = entry.operation.data as any

            // For each diff operation type, check the relevant state
            let isDuplicate = false
            if (entry.operation.type === 'apply-diff') {
              isDuplicate =
                JSON.stringify(lastData.baselineSnapshot?.blocks) ===
                  JSON.stringify(newData.baselineSnapshot?.blocks) &&
                JSON.stringify(lastData.proposedState?.blocks) ===
                  JSON.stringify(newData.proposedState?.blocks)
            } else if (entry.operation.type === 'accept-diff') {
              isDuplicate =
                JSON.stringify(lastData.afterAccept?.blocks) ===
                JSON.stringify(newData.afterAccept?.blocks)
            } else if (entry.operation.type === 'reject-diff') {
              isDuplicate =
                JSON.stringify(lastData.afterReject?.blocks) ===
                JSON.stringify(newData.afterReject?.blocks)
            }

            if (isDuplicate) {
              logger.debug('Skipping duplicate diff operation', {
                type: entry.operation.type,
                workflowId,
                userId,
              })
              return
            }
          }
        }

        // Coalesce consecutive move-block operations for the same block
        if (entry.operation.type === 'move-block') {
          const incoming = entry.operation as MoveBlockOperation
          const last = stack.undo[stack.undo.length - 1]

          // Skip no-op moves
          const b1 = incoming.data.before
          const a1 = incoming.data.after
          const sameParent = (b1.parentId ?? null) === (a1.parentId ?? null)
          if (b1.x === a1.x && b1.y === a1.y && sameParent) {
            logger.debug('Skipped no-op move push')
            return
          }

          if (last && last.operation.type === 'move-block' && last.inverse.type === 'move-block') {
            const prev = last.operation as MoveBlockOperation
            if (prev.data.blockId === incoming.data.blockId) {
              // Merge: keep earliest before, latest after
              const mergedBefore = prev.data.before
              const mergedAfter = incoming.data.after

              const sameAfter =
                mergedBefore.x === mergedAfter.x &&
                mergedBefore.y === mergedAfter.y &&
                (mergedBefore.parentId ?? null) === (mergedAfter.parentId ?? null)

              const newUndoCoalesced: OperationEntry[] = sameAfter
                ? stack.undo.slice(0, -1)
                : (() => {
                    const op = entry.operation as MoveBlockOperation
                    const inv = entry.inverse as MoveBlockOperation
                    const newEntry: OperationEntry = {
                      id: entry.id,
                      createdAt: entry.createdAt,
                      operation: {
                        id: op.id,
                        type: 'move-block',
                        timestamp: op.timestamp,
                        workflowId,
                        userId,
                        data: {
                          blockId: incoming.data.blockId,
                          before: mergedBefore,
                          after: mergedAfter,
                        },
                      },
                      inverse: {
                        id: inv.id,
                        type: 'move-block',
                        timestamp: inv.timestamp,
                        workflowId,
                        userId,
                        data: {
                          blockId: incoming.data.blockId,
                          before: mergedAfter,
                          after: mergedBefore,
                        },
                      },
                    }
                    return [...stack.undo.slice(0, -1), newEntry]
                  })()

              currentStacks[key] = {
                undo: newUndoCoalesced,
                redo: [],
                lastUpdated: Date.now(),
              }

              set({ stacks: currentStacks })

              logger.debug('Coalesced consecutive move operations', {
                workflowId,
                userId,
                blockId: incoming.data.blockId,
                undoSize: newUndoCoalesced.length,
              })
              return
            }
          }
        }

        const newUndo = [...stack.undo, entry]
        if (newUndo.length > state.capacity) {
          newUndo.shift()
        }

        currentStacks[key] = {
          undo: newUndo,
          redo: [],
          lastUpdated: Date.now(),
        }

        set({ stacks: currentStacks })

        logger.debug('Pushed operation to undo stack', {
          workflowId,
          userId,
          operationType: entry.operation.type,
          undoSize: newUndo.length,
        })
      },

      undo: (workflowId: string, userId: string) => {
        const key = getStackKey(workflowId, userId)
        const state = get()
        const stack = state.stacks[key]

        if (!stack || stack.undo.length === 0) {
          return null
        }

        const entry = stack.undo[stack.undo.length - 1]
        const newUndo = stack.undo.slice(0, -1)
        const newRedo = [...stack.redo, entry]

        if (newRedo.length > state.capacity) {
          newRedo.shift()
        }

        set({
          stacks: {
            ...state.stacks,
            [key]: {
              undo: newUndo,
              redo: newRedo,
              lastUpdated: Date.now(),
            },
          },
        })

        logger.debug('Undo operation', {
          workflowId,
          userId,
          operationType: entry.operation.type,
          undoSize: newUndo.length,
          redoSize: newRedo.length,
        })

        return entry
      },

      redo: (workflowId: string, userId: string) => {
        const key = getStackKey(workflowId, userId)
        const state = get()
        const stack = state.stacks[key]

        if (!stack || stack.redo.length === 0) {
          return null
        }

        const entry = stack.redo[stack.redo.length - 1]
        const newRedo = stack.redo.slice(0, -1)
        const newUndo = [...stack.undo, entry]

        if (newUndo.length > state.capacity) {
          newUndo.shift()
        }

        set({
          stacks: {
            ...state.stacks,
            [key]: {
              undo: newUndo,
              redo: newRedo,
              lastUpdated: Date.now(),
            },
          },
        })

        logger.debug('Redo operation', {
          workflowId,
          userId,
          operationType: entry.operation.type,
          undoSize: newUndo.length,
          redoSize: newRedo.length,
        })

        return entry
      },

      clear: (workflowId: string, userId: string) => {
        const key = getStackKey(workflowId, userId)
        const state = get()
        const { [key]: _, ...rest } = state.stacks

        set({ stacks: rest })

        logger.debug('Cleared undo/redo stacks', { workflowId, userId })
      },

      clearRedo: (workflowId: string, userId: string) => {
        const key = getStackKey(workflowId, userId)
        const state = get()
        const stack = state.stacks[key]

        if (!stack) return

        set({
          stacks: {
            ...state.stacks,
            [key]: { ...stack, redo: [] },
          },
        })

        logger.debug('Cleared redo stack', { workflowId, userId })
      },

      getStackSizes: (workflowId: string, userId: string) => {
        const key = getStackKey(workflowId, userId)
        const state = get()
        const stack = state.stacks[key]

        if (!stack) {
          return { undoSize: 0, redoSize: 0 }
        }

        return {
          undoSize: stack.undo.length,
          redoSize: stack.redo.length,
        }
      },

      setCapacity: (capacity: number) => {
        const state = get()
        const newStacks: typeof state.stacks = {}

        for (const [key, stack] of Object.entries(state.stacks)) {
          newStacks[key] = {
            undo: stack.undo.slice(-capacity),
            redo: stack.redo.slice(-capacity),
            lastUpdated: stack.lastUpdated,
          }
        }

        set({ capacity, stacks: newStacks })

        logger.debug('Set capacity', { capacity })
      },

      pruneInvalidEntries: (
        workflowId: string,
        userId: string,
        graph: { blocksById: Record<string, BlockState>; edgesById: Record<string, Edge> }
      ) => {
        const key = getStackKey(workflowId, userId)
        const state = get()
        const stack = state.stacks[key]

        if (!stack) return

        const originalUndoCount = stack.undo.length
        const originalRedoCount = stack.redo.length

        const validUndo = stack.undo.filter((entry) => isOperationApplicable(entry.inverse, graph))

        const validRedo = stack.redo.filter((entry) =>
          isOperationApplicable(entry.operation, graph)
        )

        const prunedUndoCount = originalUndoCount - validUndo.length
        const prunedRedoCount = originalRedoCount - validRedo.length

        if (prunedUndoCount > 0 || prunedRedoCount > 0) {
          set({
            stacks: {
              ...state.stacks,
              [key]: { ...stack, undo: validUndo, redo: validRedo },
            },
          })

          logger.debug('Pruned invalid entries', {
            workflowId,
            userId,
            prunedUndo: prunedUndoCount,
            prunedRedo: prunedRedoCount,
            remainingUndo: validUndo.length,
            remainingRedo: validRedo.length,
          })
        }
      },
    }),
    {
      name: 'workflow-undo-redo',
      storage: createJSONStorage(() => safeStorageAdapter),
      partialize: (state) => ({
        stacks: state.stacks,
        capacity: state.capacity,
      }),
    }
  )
)
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/stores/undo-redo/types.ts

```typescript
import type { Edge } from 'reactflow'
import type { BlockState } from '@/stores/workflows/workflow/types'

export type OperationType =
  | 'add-block'
  | 'remove-block'
  | 'add-edge'
  | 'remove-edge'
  | 'add-subflow'
  | 'remove-subflow'
  | 'move-block'
  | 'move-subflow'
  | 'duplicate-block'
  | 'update-parent'
  | 'apply-diff'
  | 'accept-diff'
  | 'reject-diff'

export interface BaseOperation {
  id: string
  type: OperationType
  timestamp: number
  workflowId: string
  userId: string
}

export interface AddBlockOperation extends BaseOperation {
  type: 'add-block'
  data: {
    blockId: string
  }
}

export interface RemoveBlockOperation extends BaseOperation {
  type: 'remove-block'
  data: {
    blockId: string
    blockSnapshot: BlockState | null
    edgeSnapshots?: Edge[]
    allBlockSnapshots?: Record<string, BlockState>
  }
}

export interface AddEdgeOperation extends BaseOperation {
  type: 'add-edge'
  data: {
    edgeId: string
  }
}

export interface RemoveEdgeOperation extends BaseOperation {
  type: 'remove-edge'
  data: {
    edgeId: string
    edgeSnapshot: Edge | null
  }
}

export interface AddSubflowOperation extends BaseOperation {
  type: 'add-subflow'
  data: {
    subflowId: string
  }
}

export interface RemoveSubflowOperation extends BaseOperation {
  type: 'remove-subflow'
  data: {
    subflowId: string
    subflowSnapshot: BlockState | null
  }
}

export interface MoveBlockOperation extends BaseOperation {
  type: 'move-block'
  data: {
    blockId: string
    before: {
      x: number
      y: number
      parentId?: string
    }
    after: {
      x: number
      y: number
      parentId?: string
    }
  }
}

export interface MoveSubflowOperation extends BaseOperation {
  type: 'move-subflow'
  data: {
    subflowId: string
    before: {
      x: number
      y: number
    }
    after: {
      x: number
      y: number
    }
  }
}

export interface DuplicateBlockOperation extends BaseOperation {
  type: 'duplicate-block'
  data: {
    sourceBlockId: string
    duplicatedBlockId: string
    duplicatedBlockSnapshot: BlockState
    autoConnectEdge?: Edge
  }
}

export interface UpdateParentOperation extends BaseOperation {
  type: 'update-parent'
  data: {
    blockId: string
    oldParentId?: string
    newParentId?: string
    oldPosition: { x: number; y: number }
    newPosition: { x: number; y: number }
    affectedEdges?: Edge[]
  }
}

export interface ApplyDiffOperation extends BaseOperation {
  type: 'apply-diff'
  data: {
    baselineSnapshot: any // WorkflowState snapshot before diff
    proposedState: any // WorkflowState with diff applied
    diffAnalysis: any // DiffAnalysis for re-applying markers
  }
}

export interface AcceptDiffOperation extends BaseOperation {
  type: 'accept-diff'
  data: {
    beforeAccept: any // WorkflowState with diff markers
    afterAccept: any // WorkflowState without diff markers
    diffAnalysis: any // DiffAnalysis to restore markers on undo
    baselineSnapshot: any // Baseline workflow state
  }
}

export interface RejectDiffOperation extends BaseOperation {
  type: 'reject-diff'
  data: {
    beforeReject: any // WorkflowState with diff markers
    afterReject: any // WorkflowState baseline (after reject)
    diffAnalysis: any // DiffAnalysis to restore markers on undo
    baselineSnapshot: any // Baseline workflow state
  }
}

export type Operation =
  | AddBlockOperation
  | RemoveBlockOperation
  | AddEdgeOperation
  | RemoveEdgeOperation
  | AddSubflowOperation
  | RemoveSubflowOperation
  | MoveBlockOperation
  | MoveSubflowOperation
  | DuplicateBlockOperation
  | UpdateParentOperation
  | ApplyDiffOperation
  | AcceptDiffOperation
  | RejectDiffOperation

export interface OperationEntry {
  id: string
  operation: Operation
  inverse: Operation
  createdAt: number
}

export interface UndoRedoState {
  stacks: Record<
    string,
    {
      undo: OperationEntry[]
      redo: OperationEntry[]
      lastUpdated?: number
    }
  >
  capacity: number
  push: (workflowId: string, userId: string, entry: OperationEntry) => void
  undo: (workflowId: string, userId: string) => OperationEntry | null
  redo: (workflowId: string, userId: string) => OperationEntry | null
  clear: (workflowId: string, userId: string) => void
  clearRedo: (workflowId: string, userId: string) => void
  getStackSizes: (workflowId: string, userId: string) => { undoSize: number; redoSize: number }
  setCapacity: (capacity: number) => void
  pruneInvalidEntries: (
    workflowId: string,
    userId: string,
    graph: { blocksById: Record<string, BlockState>; edgesById: Record<string, Edge> }
  ) => void
}
```

--------------------------------------------------------------------------------

````
