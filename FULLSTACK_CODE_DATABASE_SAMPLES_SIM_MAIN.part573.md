---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 573
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 573 of 933)

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

---[FILE: logging-session.ts]---
Location: sim-main/apps/sim/lib/logs/execution/logging-session.ts

```typescript
import { BASE_EXECUTION_CHARGE } from '@/lib/billing/constants'
import { createLogger } from '@/lib/logs/console/logger'
import { executionLogger } from '@/lib/logs/execution/logger'
import {
  calculateCostSummary,
  createEnvironmentObject,
  createTriggerObject,
  loadWorkflowStateForExecution,
} from '@/lib/logs/execution/logging-factory'
import type {
  ExecutionEnvironment,
  ExecutionTrigger,
  TraceSpan,
  WorkflowState,
} from '@/lib/logs/types'

const logger = createLogger('LoggingSession')

export interface SessionStartParams {
  userId?: string
  workspaceId?: string
  variables?: Record<string, string>
  triggerData?: Record<string, unknown>
  skipLogCreation?: boolean // For resume executions - reuse existing log entry
  deploymentVersionId?: string // ID of the deployment version used (null for manual/editor executions)
}

export interface SessionCompleteParams {
  endedAt?: string
  totalDurationMs?: number
  finalOutput?: any
  traceSpans?: any[]
  workflowInput?: any
}

export interface SessionErrorCompleteParams {
  endedAt?: string
  totalDurationMs?: number
  error?: {
    message?: string
    stackTrace?: string
  }
  traceSpans?: TraceSpan[]
}

export class LoggingSession {
  private workflowId: string
  private executionId: string
  private triggerType: ExecutionTrigger['type']
  private requestId?: string
  private trigger?: ExecutionTrigger
  private environment?: ExecutionEnvironment
  private workflowState?: WorkflowState
  private isResume = false // Track if this is a resume execution

  constructor(
    workflowId: string,
    executionId: string,
    triggerType: ExecutionTrigger['type'],
    requestId?: string
  ) {
    this.workflowId = workflowId
    this.executionId = executionId
    this.triggerType = triggerType
    this.requestId = requestId
  }

  async start(params: SessionStartParams = {}): Promise<void> {
    const { userId, workspaceId, variables, triggerData, skipLogCreation, deploymentVersionId } =
      params

    try {
      this.trigger = createTriggerObject(this.triggerType, triggerData)
      this.environment = createEnvironmentObject(
        this.workflowId,
        this.executionId,
        userId,
        workspaceId,
        variables
      )
      this.workflowState = await loadWorkflowStateForExecution(this.workflowId)

      // Only create a new log entry if not resuming
      if (!skipLogCreation) {
        await executionLogger.startWorkflowExecution({
          workflowId: this.workflowId,
          executionId: this.executionId,
          trigger: this.trigger,
          environment: this.environment,
          workflowState: this.workflowState,
          deploymentVersionId,
        })

        if (this.requestId) {
          logger.debug(`[${this.requestId}] Started logging for execution ${this.executionId}`)
        }
      } else {
        this.isResume = true // Mark as resume
        if (this.requestId) {
          logger.debug(
            `[${this.requestId}] Resuming logging for existing execution ${this.executionId}`
          )
        }
      }
    } catch (error) {
      if (this.requestId) {
        logger.error(`[${this.requestId}] Failed to start logging:`, error)
      }
      throw error
    }
  }

  /**
   * Set up logging on an executor instance
   * Note: Logging now works through trace spans only, no direct executor integration needed
   */
  setupExecutor(executor: any): void {
    // No longer setting logger on executor - trace spans handle everything
    if (this.requestId) {
      logger.debug(`[${this.requestId}] Logging session ready for execution ${this.executionId}`)
    }
  }

  async complete(params: SessionCompleteParams = {}): Promise<void> {
    const { endedAt, totalDurationMs, finalOutput, traceSpans, workflowInput } = params

    try {
      const costSummary = calculateCostSummary(traceSpans || [])
      const endTime = endedAt || new Date().toISOString()
      const duration = totalDurationMs || 0

      await executionLogger.completeWorkflowExecution({
        executionId: this.executionId,
        endedAt: endTime,
        totalDurationMs: duration,
        costSummary,
        finalOutput: finalOutput || {},
        traceSpans: traceSpans || [],
        workflowInput,
        isResume: this.isResume,
      })

      // Track workflow execution outcome
      if (traceSpans && traceSpans.length > 0) {
        try {
          const { trackPlatformEvent } = await import('@/lib/core/telemetry')

          // Determine status from trace spans
          const hasErrors = traceSpans.some((span: any) => {
            const checkForErrors = (s: any): boolean => {
              if (s.status === 'error') return true
              if (s.children && Array.isArray(s.children)) {
                return s.children.some(checkForErrors)
              }
              return false
            }
            return checkForErrors(span)
          })

          trackPlatformEvent('platform.workflow.executed', {
            'workflow.id': this.workflowId,
            'execution.duration_ms': duration,
            'execution.status': hasErrors ? 'error' : 'success',
            'execution.trigger': this.triggerType,
            'execution.blocks_executed': traceSpans.length,
            'execution.has_errors': hasErrors,
            'execution.total_cost': costSummary.totalCost || 0,
          })
        } catch (_e) {
          // Silently fail
        }
      }

      if (this.requestId) {
        logger.debug(`[${this.requestId}] Completed logging for execution ${this.executionId}`)
      }
    } catch (error) {
      // Always log completion failures with full details - these should not be silent
      logger.error(`Failed to complete logging for execution ${this.executionId}:`, {
        requestId: this.requestId,
        workflowId: this.workflowId,
        executionId: this.executionId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      })
      // Rethrow so safeComplete can decide what to do
      throw error
    }
  }

  async completeWithError(params: SessionErrorCompleteParams = {}): Promise<void> {
    try {
      const { endedAt, totalDurationMs, error, traceSpans } = params

      const endTime = endedAt ? new Date(endedAt) : new Date()
      const durationMs = typeof totalDurationMs === 'number' ? totalDurationMs : 0
      const startTime = new Date(endTime.getTime() - Math.max(1, durationMs))

      const hasProvidedSpans = Array.isArray(traceSpans) && traceSpans.length > 0

      const costSummary = hasProvidedSpans
        ? calculateCostSummary(traceSpans)
        : {
            totalCost: BASE_EXECUTION_CHARGE,
            totalInputCost: 0,
            totalOutputCost: 0,
            totalTokens: 0,
            totalPromptTokens: 0,
            totalCompletionTokens: 0,
            baseExecutionCharge: BASE_EXECUTION_CHARGE,
            modelCost: 0,
            models: {},
          }

      const message = error?.message || 'Execution failed before starting blocks'

      const errorSpan: TraceSpan = {
        id: 'workflow-error-root',
        name: 'Workflow Error',
        type: 'workflow',
        duration: Math.max(1, durationMs),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status: 'error',
        ...(hasProvidedSpans ? {} : { children: [] }),
        output: { error: message },
      }

      const spans = hasProvidedSpans ? traceSpans : [errorSpan]

      await executionLogger.completeWorkflowExecution({
        executionId: this.executionId,
        endedAt: endTime.toISOString(),
        totalDurationMs: Math.max(1, durationMs),
        costSummary,
        finalOutput: { error: message },
        traceSpans: spans,
      })

      // Track workflow execution error outcome
      try {
        const { trackPlatformEvent } = await import('@/lib/core/telemetry')
        trackPlatformEvent('platform.workflow.executed', {
          'workflow.id': this.workflowId,
          'execution.duration_ms': Math.max(1, durationMs),
          'execution.status': 'error',
          'execution.trigger': this.triggerType,
          'execution.blocks_executed': spans.length,
          'execution.has_errors': true,
          'execution.error_message': message,
        })
      } catch (_e) {
        // Silently fail
      }

      if (this.requestId) {
        logger.debug(
          `[${this.requestId}] Completed error logging for execution ${this.executionId}`
        )
      }
    } catch (enhancedError) {
      // Always log completion failures with full details
      logger.error(`Failed to complete error logging for execution ${this.executionId}:`, {
        requestId: this.requestId,
        workflowId: this.workflowId,
        executionId: this.executionId,
        error: enhancedError instanceof Error ? enhancedError.message : String(enhancedError),
        stack: enhancedError instanceof Error ? enhancedError.stack : undefined,
      })
      // Rethrow so safeCompleteWithError can decide what to do
      throw enhancedError
    }
  }

  async safeStart(params: SessionStartParams = {}): Promise<boolean> {
    try {
      await this.start(params)
      return true
    } catch (error) {
      if (this.requestId) {
        logger.warn(
          `[${this.requestId}] Logging start failed - falling back to minimal session:`,
          error
        )
      }

      // Fallback: create a minimal logging session without full workflow state
      try {
        const { userId, workspaceId, variables, triggerData, deploymentVersionId } = params
        this.trigger = createTriggerObject(this.triggerType, triggerData)
        this.environment = createEnvironmentObject(
          this.workflowId,
          this.executionId,
          userId,
          workspaceId,
          variables
        )
        // Minimal workflow state when normalized data is unavailable
        this.workflowState = {
          blocks: {},
          edges: [],
          loops: {},
          parallels: {},
        } as unknown as WorkflowState

        await executionLogger.startWorkflowExecution({
          workflowId: this.workflowId,
          executionId: this.executionId,
          trigger: this.trigger,
          environment: this.environment,
          workflowState: this.workflowState,
          deploymentVersionId,
        })

        if (this.requestId) {
          logger.debug(
            `[${this.requestId}] Started minimal logging for execution ${this.executionId}`
          )
        }
        return true
      } catch (fallbackError) {
        if (this.requestId) {
          logger.error(`[${this.requestId}] Minimal logging start also failed:`, fallbackError)
        }
        return false
      }
    }
  }

  async safeComplete(params: SessionCompleteParams = {}): Promise<void> {
    try {
      await this.complete(params)
    } catch (error) {
      // Error already logged in complete(), log a summary here
      logger.warn(
        `[${this.requestId || 'unknown'}] Logging completion failed for execution ${this.executionId} - execution data not persisted`
      )
    }
  }

  async safeCompleteWithError(error?: SessionErrorCompleteParams): Promise<void> {
    try {
      await this.completeWithError(error)
    } catch (enhancedError) {
      // Error already logged in completeWithError(), log a summary here
      logger.warn(
        `[${this.requestId || 'unknown'}] Error logging completion failed for execution ${this.executionId} - execution data not persisted`
      )
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: service.test.ts]---
Location: sim-main/apps/sim/lib/logs/execution/snapshot/service.test.ts

```typescript
import { beforeEach, describe, expect, test } from 'vitest'
import { SnapshotService } from '@/lib/logs/execution/snapshot/service'
import type { WorkflowState } from '@/lib/logs/types'

describe('SnapshotService', () => {
  let service: SnapshotService

  beforeEach(() => {
    service = new SnapshotService()
  })

  describe('computeStateHash', () => {
    test('should generate consistent hashes for identical states', () => {
      const state: WorkflowState = {
        blocks: {
          block1: {
            id: 'block1',
            name: 'Test Agent',
            type: 'agent',
            position: { x: 100, y: 200 },

            subBlocks: {},
            outputs: {},
            enabled: true,
            horizontalHandles: true,
            advancedMode: false,
            height: 0,
          },
        },
        edges: [{ id: 'edge1', source: 'block1', target: 'block2' }],
        loops: {},
        parallels: {},
      }

      const hash1 = service.computeStateHash(state)
      const hash2 = service.computeStateHash(state)

      expect(hash1).toBe(hash2)
      expect(hash1).toHaveLength(64) // SHA-256 hex string
    })

    test('should ignore position changes', () => {
      const baseState: WorkflowState = {
        blocks: {
          block1: {
            id: 'block1',
            name: 'Test Agent',
            type: 'agent',
            position: { x: 100, y: 200 },

            subBlocks: {},
            outputs: {},
            enabled: true,
            horizontalHandles: true,
            advancedMode: false,
            height: 0,
          },
        },
        edges: [],
        loops: {},
        parallels: {},
      }

      const stateWithDifferentPosition: WorkflowState = {
        ...baseState,
        blocks: {
          block1: {
            ...baseState.blocks.block1,
            position: { x: 500, y: 600 }, // Different position
          },
        },
      }

      const hash1 = service.computeStateHash(baseState)
      const hash2 = service.computeStateHash(stateWithDifferentPosition)

      expect(hash1).toBe(hash2)
    })

    test('should detect meaningful changes', () => {
      const baseState: WorkflowState = {
        blocks: {
          block1: {
            id: 'block1',
            name: 'Test Agent',
            type: 'agent',
            position: { x: 100, y: 200 },

            subBlocks: {},
            outputs: {},
            enabled: true,
            horizontalHandles: true,
            advancedMode: false,
            height: 0,
          },
        },
        edges: [],
        loops: {},
        parallels: {},
      }

      const stateWithDifferentPrompt: WorkflowState = {
        ...baseState,
        blocks: {
          block1: {
            ...baseState.blocks.block1,
            // Different block state - we can change outputs to make it different
            outputs: { response: { content: 'different result' } as Record<string, any> },
          },
        },
      }

      const hash1 = service.computeStateHash(baseState)
      const hash2 = service.computeStateHash(stateWithDifferentPrompt)

      expect(hash1).not.toBe(hash2)
    })

    test('should handle edge order consistently', () => {
      const state1: WorkflowState = {
        blocks: {},
        edges: [
          { id: 'edge1', source: 'a', target: 'b' },
          { id: 'edge2', source: 'b', target: 'c' },
        ],
        loops: {},
        parallels: {},
      }

      const state2: WorkflowState = {
        blocks: {},
        edges: [
          { id: 'edge2', source: 'b', target: 'c' }, // Different order
          { id: 'edge1', source: 'a', target: 'b' },
        ],
        loops: {},
        parallels: {},
      }

      const hash1 = service.computeStateHash(state1)
      const hash2 = service.computeStateHash(state2)

      expect(hash1).toBe(hash2) // Should be same despite different order
    })

    test('should handle empty states', () => {
      const emptyState: WorkflowState = {
        blocks: {},
        edges: [],
        loops: {},
        parallels: {},
      }

      const hash = service.computeStateHash(emptyState)
      expect(hash).toHaveLength(64)
    })

    test('should handle complex nested structures', () => {
      const complexState: WorkflowState = {
        blocks: {
          block1: {
            id: 'block1',
            name: 'Complex Agent',
            type: 'agent',
            position: { x: 100, y: 200 },

            subBlocks: {
              prompt: {
                id: 'prompt',
                type: 'short-input',
                value: 'Test prompt',
              },
              model: {
                id: 'model',
                type: 'short-input',
                value: 'gpt-4',
              },
            },
            outputs: {
              response: { content: 'Agent response' } as Record<string, any>,
            },
            enabled: true,
            horizontalHandles: true,
            advancedMode: true,
            height: 200,
          },
        },
        edges: [{ id: 'edge1', source: 'block1', target: 'block2', sourceHandle: 'output' }],
        loops: {
          loop1: {
            id: 'loop1',
            nodes: ['block1'],
            iterations: 10,
            loopType: 'for',
          },
        },
        parallels: {
          parallel1: {
            id: 'parallel1',
            nodes: ['block1'],
            count: 3,
            parallelType: 'count',
          },
        },
      }

      const hash = service.computeStateHash(complexState)
      expect(hash).toHaveLength(64)

      // Should be consistent
      const hash2 = service.computeStateHash(complexState)
      expect(hash).toBe(hash2)
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: service.ts]---
Location: sim-main/apps/sim/lib/logs/execution/snapshot/service.ts

```typescript
import { createHash } from 'crypto'
import { db } from '@sim/db'
import { workflowExecutionSnapshots } from '@sim/db/schema'
import { and, eq, lt } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { createLogger } from '@/lib/logs/console/logger'
import type {
  SnapshotService as ISnapshotService,
  SnapshotCreationResult,
  WorkflowExecutionSnapshot,
  WorkflowExecutionSnapshotInsert,
  WorkflowState,
} from '@/lib/logs/types'

const logger = createLogger('SnapshotService')

export class SnapshotService implements ISnapshotService {
  async createSnapshot(
    workflowId: string,
    state: WorkflowState
  ): Promise<WorkflowExecutionSnapshot> {
    const result = await this.createSnapshotWithDeduplication(workflowId, state)
    return result.snapshot
  }

  async createSnapshotWithDeduplication(
    workflowId: string,
    state: WorkflowState
  ): Promise<SnapshotCreationResult> {
    // Hash the position-less state for deduplication (functional equivalence)
    const stateHash = this.computeStateHash(state)

    const existingSnapshot = await this.getSnapshotByHash(workflowId, stateHash)
    if (existingSnapshot) {
      logger.debug(`Reusing existing snapshot for workflow ${workflowId} with hash ${stateHash}`)
      return {
        snapshot: existingSnapshot,
        isNew: false,
      }
    }

    // Store the FULL state (including positions) so we can recreate the exact workflow
    // Even though we hash without positions, we want to preserve the complete state
    const snapshotData: WorkflowExecutionSnapshotInsert = {
      id: uuidv4(),
      workflowId,
      stateHash,
      stateData: state, // Full state with positions, subblock values, etc.
    }

    const [newSnapshot] = await db
      .insert(workflowExecutionSnapshots)
      .values(snapshotData)
      .returning()

    logger.debug(`Created new snapshot for workflow ${workflowId} with hash ${stateHash}`)
    logger.debug(`Stored full state with ${Object.keys(state.blocks || {}).length} blocks`)
    return {
      snapshot: {
        ...newSnapshot,
        stateData: newSnapshot.stateData as WorkflowState,
        createdAt: newSnapshot.createdAt.toISOString(),
      },
      isNew: true,
    }
  }

  async getSnapshot(id: string): Promise<WorkflowExecutionSnapshot | null> {
    const [snapshot] = await db
      .select()
      .from(workflowExecutionSnapshots)
      .where(eq(workflowExecutionSnapshots.id, id))
      .limit(1)

    if (!snapshot) return null

    return {
      ...snapshot,
      stateData: snapshot.stateData as WorkflowState,
      createdAt: snapshot.createdAt.toISOString(),
    }
  }

  async getSnapshotByHash(
    workflowId: string,
    hash: string
  ): Promise<WorkflowExecutionSnapshot | null> {
    const [snapshot] = await db
      .select()
      .from(workflowExecutionSnapshots)
      .where(
        and(
          eq(workflowExecutionSnapshots.workflowId, workflowId),
          eq(workflowExecutionSnapshots.stateHash, hash)
        )
      )
      .limit(1)

    if (!snapshot) return null

    return {
      ...snapshot,
      stateData: snapshot.stateData as WorkflowState,
      createdAt: snapshot.createdAt.toISOString(),
    }
  }

  computeStateHash(state: WorkflowState): string {
    const normalizedState = this.normalizeStateForHashing(state)
    const stateString = this.normalizedStringify(normalizedState)
    return createHash('sha256').update(stateString).digest('hex')
  }

  async cleanupOrphanedSnapshots(olderThanDays: number): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

    const deletedSnapshots = await db
      .delete(workflowExecutionSnapshots)
      .where(lt(workflowExecutionSnapshots.createdAt, cutoffDate))
      .returning({ id: workflowExecutionSnapshots.id })

    const deletedCount = deletedSnapshots.length
    logger.info(`Cleaned up ${deletedCount} orphaned snapshots older than ${olderThanDays} days`)
    return deletedCount
  }

  private normalizeStateForHashing(state: WorkflowState): any {
    // Use the same normalization logic as hasWorkflowChanged for consistency

    // 1. Normalize edges (same as hasWorkflowChanged)
    const normalizedEdges = (state.edges || [])
      .map((edge) => ({
        source: edge.source,
        sourceHandle: edge.sourceHandle,
        target: edge.target,
        targetHandle: edge.targetHandle,
      }))
      .sort((a, b) =>
        `${a.source}-${a.sourceHandle}-${a.target}-${a.targetHandle}`.localeCompare(
          `${b.source}-${b.sourceHandle}-${b.target}-${b.targetHandle}`
        )
      )

    // 2. Normalize blocks (same as hasWorkflowChanged)
    const normalizedBlocks: Record<string, any> = {}

    for (const [blockId, block] of Object.entries(state.blocks || {})) {
      const { position, layout, height, ...blockWithoutLayoutFields } = block

      // Also exclude width/height from data object (container dimensions from autolayout)
      const {
        width: _dataWidth,
        height: _dataHeight,
        ...dataRest
      } = blockWithoutLayoutFields.data || {}

      // Handle subBlocks with detailed comparison (same as hasWorkflowChanged)
      const subBlocks = blockWithoutLayoutFields.subBlocks || {}
      const normalizedSubBlocks: Record<string, any> = {}

      for (const [subBlockId, subBlock] of Object.entries(subBlocks)) {
        // Normalize value with special handling for null/undefined
        const value = subBlock.value ?? null

        normalizedSubBlocks[subBlockId] = {
          type: subBlock.type,
          value: this.normalizeValue(value),
          // Include other properties except value
          ...Object.fromEntries(
            Object.entries(subBlock).filter(([key]) => key !== 'value' && key !== 'type')
          ),
        }
      }

      normalizedBlocks[blockId] = {
        ...blockWithoutLayoutFields,
        data: dataRest,
        subBlocks: normalizedSubBlocks,
      }
    }

    // 3. Normalize loops and parallels
    const normalizedLoops: Record<string, any> = {}
    for (const [loopId, loop] of Object.entries(state.loops || {})) {
      normalizedLoops[loopId] = this.normalizeValue(loop)
    }

    const normalizedParallels: Record<string, any> = {}
    for (const [parallelId, parallel] of Object.entries(state.parallels || {})) {
      normalizedParallels[parallelId] = this.normalizeValue(parallel)
    }

    return {
      blocks: normalizedBlocks,
      edges: normalizedEdges,
      loops: normalizedLoops,
      parallels: normalizedParallels,
    }
  }

  private normalizeValue(value: any): any {
    // Handle null/undefined consistently
    if (value === null || value === undefined) return null

    // Handle arrays
    if (Array.isArray(value)) {
      return value.map((item) => this.normalizeValue(item))
    }

    // Handle objects
    if (typeof value === 'object') {
      const normalized: Record<string, any> = {}
      for (const [key, val] of Object.entries(value)) {
        normalized[key] = this.normalizeValue(val)
      }
      return normalized
    }

    // Handle primitives
    return value
  }

  private normalizedStringify(obj: any): string {
    if (obj === null || obj === undefined) return 'null'
    if (typeof obj === 'string') return `"${obj}"`
    if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj)

    if (Array.isArray(obj)) {
      return `[${obj.map((item) => this.normalizedStringify(item)).join(',')}]`
    }

    if (typeof obj === 'object') {
      const keys = Object.keys(obj).sort()
      const pairs = keys.map((key) => `"${key}":${this.normalizedStringify(obj[key])}`)
      return `{${pairs.join(',')}}`
    }

    return String(obj)
  }
}

export const snapshotService = new SnapshotService()
```

--------------------------------------------------------------------------------

````
