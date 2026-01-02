---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 444
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 444 of 933)

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

---[FILE: schedule-execution.ts]---
Location: sim-main/apps/sim/background/schedule-execution.ts
Signals: Zod

```typescript
import { db, workflow, workflowSchedule } from '@sim/db'
import { task } from '@trigger.dev/sdk'
import { Cron } from 'croner'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import type { ZodRecord, ZodString } from 'zod'
import { decryptSecret } from '@/lib/core/security/encryption'
import { getPersonalAndWorkspaceEnv } from '@/lib/environment/utils'
import { preprocessExecution } from '@/lib/execution/preprocessing'
import { createLogger } from '@/lib/logs/console/logger'
import { LoggingSession } from '@/lib/logs/execution/logging-session'
import { buildTraceSpans } from '@/lib/logs/execution/trace-spans/trace-spans'
import { executeWorkflowCore } from '@/lib/workflows/executor/execution-core'
import { PauseResumeManager } from '@/lib/workflows/executor/human-in-the-loop-manager'
import {
  blockExistsInDeployment,
  loadDeployedWorkflowState,
} from '@/lib/workflows/persistence/utils'
import {
  type BlockState,
  calculateNextRunTime as calculateNextTime,
  getScheduleTimeValues,
  getSubBlockValue,
} from '@/lib/workflows/schedules/utils'
import { type ExecutionMetadata, ExecutionSnapshot } from '@/executor/execution/snapshot'
import type { ExecutionResult } from '@/executor/types'
import { mergeSubblockState } from '@/stores/workflows/server-utils'

const logger = createLogger('TriggerScheduleExecution')

const MAX_CONSECUTIVE_FAILURES = 10

type WorkflowRecord = typeof workflow.$inferSelect
type WorkflowScheduleUpdate = Partial<typeof workflowSchedule.$inferInsert>
type ExecutionCoreResult = Awaited<ReturnType<typeof executeWorkflowCore>>

type RunWorkflowResult =
  | { status: 'skip'; blocks: Record<string, BlockState> }
  | { status: 'success'; blocks: Record<string, BlockState>; executionResult: ExecutionCoreResult }
  | { status: 'failure'; blocks: Record<string, BlockState>; executionResult: ExecutionCoreResult }

async function applyScheduleUpdate(
  scheduleId: string,
  updates: WorkflowScheduleUpdate,
  requestId: string,
  context: string,
  successLog?: string
) {
  try {
    await db.update(workflowSchedule).set(updates).where(eq(workflowSchedule.id, scheduleId))

    if (successLog) {
      logger.debug(`[${requestId}] ${successLog}`)
    }
  } catch (error) {
    logger.error(`[${requestId}] ${context}`, error)
  }
}

async function releaseScheduleLock(
  scheduleId: string,
  requestId: string,
  now: Date,
  context: string,
  nextRunAt?: Date | null
) {
  const updates: WorkflowScheduleUpdate = {
    updatedAt: now,
    lastQueuedAt: null,
  }

  if (nextRunAt) {
    updates.nextRunAt = nextRunAt
  }

  await applyScheduleUpdate(scheduleId, updates, requestId, context)
}

async function calculateNextRunFromDeployment(
  payload: ScheduleExecutionPayload,
  requestId: string
) {
  try {
    const deployedData = await loadDeployedWorkflowState(payload.workflowId)
    return calculateNextRunTime(payload, deployedData.blocks as Record<string, BlockState>)
  } catch (error) {
    logger.warn(
      `[${requestId}] Unable to calculate nextRunAt for schedule ${payload.scheduleId}`,
      error
    )
    return null
  }
}

async function determineNextRunAfterError(
  payload: ScheduleExecutionPayload,
  now: Date,
  requestId: string
) {
  try {
    const [workflowRecord] = await db
      .select()
      .from(workflow)
      .where(eq(workflow.id, payload.workflowId))
      .limit(1)

    if (workflowRecord?.isDeployed) {
      const nextRunAt = await calculateNextRunFromDeployment(payload, requestId)
      if (nextRunAt) {
        return nextRunAt
      }
    }
  } catch (workflowError) {
    logger.error(`[${requestId}] Error retrieving workflow for next run calculation`, workflowError)
  }

  return new Date(now.getTime() + 24 * 60 * 60 * 1000)
}

async function ensureBlockVariablesResolvable(
  blocks: Record<string, BlockState>,
  variables: Record<string, string>,
  requestId: string
) {
  await Promise.all(
    Object.values(blocks).map(async (block) => {
      const subBlocks = block.subBlocks ?? {}
      await Promise.all(
        Object.values(subBlocks).map(async (subBlock) => {
          const value = subBlock.value
          if (typeof value !== 'string' || !value.includes('{{') || !value.includes('}}')) {
            return
          }

          const matches = value.match(/{{([^}]+)}}/g)
          if (!matches) {
            return
          }

          for (const match of matches) {
            const varName = match.slice(2, -2)
            const encryptedValue = variables[varName]
            if (!encryptedValue) {
              throw new Error(`Environment variable "${varName}" was not found`)
            }

            try {
              await decryptSecret(encryptedValue)
            } catch (error) {
              logger.error(`[${requestId}] Error decrypting value for variable "${varName}"`, error)

              const message = error instanceof Error ? error.message : 'Unknown error'
              throw new Error(`Failed to decrypt environment variable "${varName}": ${message}`)
            }
          }
        })
      )
    })
  )
}

async function ensureEnvVarsDecryptable(variables: Record<string, string>, requestId: string) {
  for (const [key, encryptedValue] of Object.entries(variables)) {
    try {
      await decryptSecret(encryptedValue)
    } catch (error) {
      logger.error(`[${requestId}] Failed to decrypt environment variable "${key}"`, error)
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to decrypt environment variable "${key}": ${message}`)
    }
  }
}

async function runWorkflowExecution({
  payload,
  workflowRecord,
  actorUserId,
  loggingSession,
  requestId,
  executionId,
  EnvVarsSchema,
}: {
  payload: ScheduleExecutionPayload
  workflowRecord: WorkflowRecord
  actorUserId: string
  loggingSession: LoggingSession
  requestId: string
  executionId: string
  EnvVarsSchema: ZodRecord<ZodString, ZodString>
}): Promise<RunWorkflowResult> {
  try {
    logger.debug(`[${requestId}] Loading deployed workflow ${payload.workflowId}`)
    const deployedData = await loadDeployedWorkflowState(payload.workflowId)

    const blocks = deployedData.blocks
    const { deploymentVersionId } = deployedData
    logger.info(`[${requestId}] Loaded deployed workflow ${payload.workflowId}`)

    if (payload.blockId) {
      const blockExists = await blockExistsInDeployment(payload.workflowId, payload.blockId)
      if (!blockExists) {
        logger.warn(
          `[${requestId}] Schedule trigger block ${payload.blockId} not found in deployed workflow ${payload.workflowId}. Skipping execution.`
        )

        return { status: 'skip', blocks: {} as Record<string, BlockState> }
      }
    }

    const mergedStates = mergeSubblockState(blocks)

    const personalEnvUserId = workflowRecord.userId

    const { personalEncrypted, workspaceEncrypted } = await getPersonalAndWorkspaceEnv(
      personalEnvUserId,
      workflowRecord.workspaceId || undefined
    )

    const variables = EnvVarsSchema.parse({
      ...personalEncrypted,
      ...workspaceEncrypted,
    })

    await ensureBlockVariablesResolvable(mergedStates, variables, requestId)
    await ensureEnvVarsDecryptable(variables, requestId)

    const input = {
      _context: {
        workflowId: payload.workflowId,
      },
    }

    await loggingSession.safeStart({
      userId: actorUserId,
      workspaceId: workflowRecord.workspaceId || '',
      variables: variables || {},
      deploymentVersionId,
    })

    const metadata: ExecutionMetadata = {
      requestId,
      executionId,
      workflowId: payload.workflowId,
      workspaceId: workflowRecord.workspaceId || '',
      userId: actorUserId,
      sessionUserId: undefined,
      workflowUserId: workflowRecord.userId,
      triggerType: 'schedule',
      triggerBlockId: payload.blockId || undefined,
      useDraftState: false,
      startTime: new Date().toISOString(),
      isClientSession: false,
    }

    const snapshot = new ExecutionSnapshot(
      metadata,
      workflowRecord,
      input,
      workflowRecord.variables || {},
      []
    )

    const executionResult = await executeWorkflowCore({
      snapshot,
      callbacks: {},
      loggingSession,
    })

    if (executionResult.status === 'paused') {
      if (!executionResult.snapshotSeed) {
        logger.error(`[${requestId}] Missing snapshot seed for paused execution`, {
          executionId,
        })
      } else {
        await PauseResumeManager.persistPauseResult({
          workflowId: payload.workflowId,
          executionId,
          pausePoints: executionResult.pausePoints || [],
          snapshotSeed: executionResult.snapshotSeed,
          executorUserId: executionResult.metadata?.userId,
        })
      }
    } else {
      await PauseResumeManager.processQueuedResumes(executionId)
    }

    logger.info(`[${requestId}] Workflow execution completed: ${payload.workflowId}`, {
      success: executionResult.success,
      executionTime: executionResult.metadata?.duration,
    })

    if (executionResult.success) {
      return { status: 'success', blocks, executionResult }
    }

    return { status: 'failure', blocks, executionResult }
  } catch (earlyError) {
    logger.error(
      `[${requestId}] Early failure in scheduled workflow ${payload.workflowId}`,
      earlyError
    )

    try {
      const executionResult = (earlyError as any)?.executionResult as ExecutionResult | undefined
      const { traceSpans } = executionResult ? buildTraceSpans(executionResult) : { traceSpans: [] }

      await loggingSession.safeCompleteWithError({
        error: {
          message: `Schedule execution failed: ${
            earlyError instanceof Error ? earlyError.message : String(earlyError)
          }`,
          stackTrace: earlyError instanceof Error ? earlyError.stack : undefined,
        },
        traceSpans,
      })
    } catch (loggingError) {
      logger.error(`[${requestId}] Failed to complete log entry for schedule failure`, loggingError)
    }

    throw earlyError
  }
}

export type ScheduleExecutionPayload = {
  scheduleId: string
  workflowId: string
  blockId?: string
  cronExpression?: string
  lastRanAt?: string
  failedCount?: number
  now: string
  scheduledFor?: string
}

function calculateNextRunTime(
  schedule: { cronExpression?: string; lastRanAt?: string },
  blocks: Record<string, BlockState>
): Date {
  const scheduleBlock = Object.values(blocks).find(
    (block) => block.type === 'starter' || block.type === 'schedule'
  )
  if (!scheduleBlock) throw new Error('No starter or schedule block found')
  const scheduleType = getSubBlockValue(scheduleBlock, 'scheduleType')
  const scheduleValues = getScheduleTimeValues(scheduleBlock)

  const timezone = scheduleValues.timezone || 'UTC'

  if (schedule.cronExpression) {
    const cron = new Cron(schedule.cronExpression, {
      timezone,
    })
    const nextDate = cron.nextRun()
    if (!nextDate) throw new Error('Invalid cron expression or no future occurrences')
    return nextDate
  }

  const lastRanAt = schedule.lastRanAt ? new Date(schedule.lastRanAt) : null
  return calculateNextTime(scheduleType, scheduleValues, lastRanAt)
}

export async function executeScheduleJob(payload: ScheduleExecutionPayload) {
  const executionId = uuidv4()
  const requestId = executionId.slice(0, 8)
  const now = new Date(payload.now)
  const scheduledFor = payload.scheduledFor ? new Date(payload.scheduledFor) : null

  logger.info(`[${requestId}] Starting schedule execution`, {
    scheduleId: payload.scheduleId,
    workflowId: payload.workflowId,
    executionId,
  })

  const zod = await import('zod')
  const EnvVarsSchema = zod.z.record(zod.z.string())

  try {
    const loggingSession = new LoggingSession(
      payload.workflowId,
      executionId,
      'schedule',
      requestId
    )

    const preprocessResult = await preprocessExecution({
      workflowId: payload.workflowId,
      userId: 'unknown', // Will be resolved from workflow record
      triggerType: 'schedule',
      executionId,
      requestId,
      checkRateLimit: true,
      checkDeployment: true,
      loggingSession,
    })

    if (!preprocessResult.success) {
      const statusCode = preprocessResult.error?.statusCode || 500

      switch (statusCode) {
        case 401: {
          logger.warn(
            `[${requestId}] Authentication error during preprocessing, disabling schedule`
          )
          await applyScheduleUpdate(
            payload.scheduleId,
            {
              updatedAt: now,
              lastQueuedAt: null,
              lastFailedAt: now,
              status: 'disabled',
            },
            requestId,
            `Failed to disable schedule ${payload.scheduleId} after authentication error`,
            `Disabled schedule ${payload.scheduleId} due to authentication failure (401)`
          )
          return
        }

        case 403: {
          logger.warn(
            `[${requestId}] Authorization error during preprocessing, disabling schedule: ${preprocessResult.error?.message}`
          )
          await applyScheduleUpdate(
            payload.scheduleId,
            {
              updatedAt: now,
              lastQueuedAt: null,
              lastFailedAt: now,
              status: 'disabled',
            },
            requestId,
            `Failed to disable schedule ${payload.scheduleId} after authorization error`,
            `Disabled schedule ${payload.scheduleId} due to authorization failure (403)`
          )
          return
        }

        case 404: {
          logger.warn(`[${requestId}] Workflow not found, disabling schedule`)
          await applyScheduleUpdate(
            payload.scheduleId,
            {
              updatedAt: now,
              lastQueuedAt: null,
              status: 'disabled',
            },
            requestId,
            `Failed to disable schedule ${payload.scheduleId} after missing workflow`,
            `Disabled schedule ${payload.scheduleId} because the workflow no longer exists`
          )
          return
        }

        case 429: {
          logger.warn(`[${requestId}] Rate limit exceeded, scheduling retry`)
          const retryDelay = 5 * 60 * 1000
          const nextRetryAt = new Date(now.getTime() + retryDelay)

          await applyScheduleUpdate(
            payload.scheduleId,
            {
              updatedAt: now,
              nextRunAt: nextRetryAt,
            },
            requestId,
            `Error updating schedule ${payload.scheduleId} for rate limit`,
            `Updated next retry time for schedule ${payload.scheduleId} due to rate limit`
          )
          return
        }

        case 402: {
          logger.warn(`[${requestId}] Usage limit exceeded, scheduling next run`)
          const nextRunAt = await calculateNextRunFromDeployment(payload, requestId)
          if (nextRunAt) {
            await applyScheduleUpdate(
              payload.scheduleId,
              {
                updatedAt: now,
                nextRunAt,
              },
              requestId,
              `Error updating schedule ${payload.scheduleId} after usage limit check`,
              `Scheduled next run for ${payload.scheduleId} after usage limit`
            )
          }
          return
        }

        default: {
          logger.error(`[${requestId}] Preprocessing failed: ${preprocessResult.error?.message}`)
          const nextRunAt = await determineNextRunAfterError(payload, now, requestId)
          const newFailedCount = (payload.failedCount || 0) + 1
          const shouldDisable = newFailedCount >= MAX_CONSECUTIVE_FAILURES

          if (shouldDisable) {
            logger.warn(
              `[${requestId}] Disabling schedule for workflow ${payload.workflowId} after ${MAX_CONSECUTIVE_FAILURES} consecutive failures`
            )
          }

          await applyScheduleUpdate(
            payload.scheduleId,
            {
              updatedAt: now,
              nextRunAt,
              failedCount: newFailedCount,
              lastFailedAt: now,
              status: shouldDisable ? 'disabled' : 'active',
            },
            requestId,
            `Error updating schedule ${payload.scheduleId} after preprocessing failure`,
            `Updated schedule ${payload.scheduleId} after preprocessing failure`
          )
          return
        }
      }
    }

    const { actorUserId, workflowRecord } = preprocessResult
    if (!actorUserId || !workflowRecord) {
      logger.error(`[${requestId}] Missing required preprocessing data`)
      return
    }

    logger.info(`[${requestId}] Executing scheduled workflow ${payload.workflowId}`)

    try {
      const executionResult = await runWorkflowExecution({
        payload,
        workflowRecord,
        actorUserId,
        loggingSession,
        requestId,
        executionId,
        EnvVarsSchema,
      })

      if (executionResult.status === 'skip') {
        await releaseScheduleLock(
          payload.scheduleId,
          requestId,
          now,
          `Failed to release schedule ${payload.scheduleId} after skip`,
          scheduledFor ?? now
        )
        return
      }

      if (executionResult.status === 'success') {
        logger.info(`[${requestId}] Workflow ${payload.workflowId} executed successfully`)

        const nextRunAt = calculateNextRunTime(payload, executionResult.blocks)

        await applyScheduleUpdate(
          payload.scheduleId,
          {
            lastRanAt: now,
            updatedAt: now,
            nextRunAt,
            failedCount: 0,
          },
          requestId,
          `Error updating schedule ${payload.scheduleId} after success`,
          `Updated next run time for workflow ${payload.workflowId} to ${nextRunAt.toISOString()}`
        )
        return
      }

      logger.warn(`[${requestId}] Workflow ${payload.workflowId} execution failed`)

      const newFailedCount = (payload.failedCount || 0) + 1
      const shouldDisable = newFailedCount >= MAX_CONSECUTIVE_FAILURES
      if (shouldDisable) {
        logger.warn(
          `[${requestId}] Disabling schedule for workflow ${payload.workflowId} after ${MAX_CONSECUTIVE_FAILURES} consecutive failures`
        )
      }

      const nextRunAt = calculateNextRunTime(payload, executionResult.blocks)

      await applyScheduleUpdate(
        payload.scheduleId,
        {
          updatedAt: now,
          nextRunAt,
          failedCount: newFailedCount,
          lastFailedAt: now,
          status: shouldDisable ? 'disabled' : 'active',
        },
        requestId,
        `Error updating schedule ${payload.scheduleId} after failure`,
        `Updated schedule ${payload.scheduleId} after failure`
      )
    } catch (error: any) {
      if (error?.message?.includes('Service overloaded')) {
        logger.warn(`[${requestId}] Service overloaded, retrying schedule in 5 minutes`)

        const retryDelay = 5 * 60 * 1000
        const nextRetryAt = new Date(now.getTime() + retryDelay)

        await applyScheduleUpdate(
          payload.scheduleId,
          {
            updatedAt: now,
            nextRunAt: nextRetryAt,
          },
          requestId,
          `Error updating schedule ${payload.scheduleId} for service overload`,
          `Updated schedule ${payload.scheduleId} retry time due to service overload`
        )
        return
      }

      logger.error(`[${requestId}] Error executing scheduled workflow ${payload.workflowId}`, error)

      const nextRunAt = await determineNextRunAfterError(payload, now, requestId)
      const newFailedCount = (payload.failedCount || 0) + 1
      const shouldDisable = newFailedCount >= MAX_CONSECUTIVE_FAILURES

      if (shouldDisable) {
        logger.warn(
          `[${requestId}] Disabling schedule for workflow ${payload.workflowId} after ${MAX_CONSECUTIVE_FAILURES} consecutive failures`
        )
      }

      await applyScheduleUpdate(
        payload.scheduleId,
        {
          updatedAt: now,
          nextRunAt,
          failedCount: newFailedCount,
          lastFailedAt: now,
          status: shouldDisable ? 'disabled' : 'active',
        },
        requestId,
        `Error updating schedule ${payload.scheduleId} after execution error`,
        `Updated schedule ${payload.scheduleId} after execution error`
      )
    }
  } catch (error: any) {
    logger.error(`[${requestId}] Error processing schedule ${payload.scheduleId}`, error)
  }
}

export const scheduleExecution = task({
  id: 'schedule-execution',
  retry: {
    maxAttempts: 1,
  },
  run: async (payload: ScheduleExecutionPayload) => executeScheduleJob(payload),
})
```

--------------------------------------------------------------------------------

---[FILE: webhook-execution.ts]---
Location: sim-main/apps/sim/background/webhook-execution.ts

```typescript
import { db } from '@sim/db'
import { webhook, workflow as workflowTable } from '@sim/db/schema'
import { task } from '@trigger.dev/sdk'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { IdempotencyService, webhookIdempotency } from '@/lib/core/idempotency'
import { processExecutionFiles } from '@/lib/execution/files'
import { createLogger } from '@/lib/logs/console/logger'
import { LoggingSession } from '@/lib/logs/execution/logging-session'
import { buildTraceSpans } from '@/lib/logs/execution/trace-spans/trace-spans'
import { WebhookAttachmentProcessor } from '@/lib/webhooks/attachment-processor'
import { fetchAndProcessAirtablePayloads, formatWebhookInput } from '@/lib/webhooks/utils.server'
import { executeWorkflowCore } from '@/lib/workflows/executor/execution-core'
import { PauseResumeManager } from '@/lib/workflows/executor/human-in-the-loop-manager'
import {
  loadDeployedWorkflowState,
  loadWorkflowFromNormalizedTables,
} from '@/lib/workflows/persistence/utils'
import { getWorkflowById } from '@/lib/workflows/utils'
import { type ExecutionMetadata, ExecutionSnapshot } from '@/executor/execution/snapshot'
import type { ExecutionResult } from '@/executor/types'
import { Serializer } from '@/serializer'
import { mergeSubblockState } from '@/stores/workflows/server-utils'
import { getTrigger, isTriggerValid } from '@/triggers'

const logger = createLogger('TriggerWebhookExecution')

/**
 * Process trigger outputs based on their schema definitions
 * Finds outputs marked as 'file' or 'file[]' and uploads them to execution storage
 */
async function processTriggerFileOutputs(
  input: any,
  triggerOutputs: Record<string, any>,
  context: {
    workspaceId: string
    workflowId: string
    executionId: string
    requestId: string
    userId?: string
  },
  path = ''
): Promise<any> {
  if (!input || typeof input !== 'object') {
    return input
  }

  const processed: any = Array.isArray(input) ? [] : {}

  for (const [key, value] of Object.entries(input)) {
    const currentPath = path ? `${path}.${key}` : key
    const outputDef = triggerOutputs[key]
    const val: any = value

    // If this field is marked as file or file[], process it
    if (outputDef?.type === 'file[]' && Array.isArray(val)) {
      try {
        processed[key] = await WebhookAttachmentProcessor.processAttachments(val as any, context)
      } catch (error) {
        processed[key] = []
      }
    } else if (outputDef?.type === 'file' && val) {
      try {
        const [processedFile] = await WebhookAttachmentProcessor.processAttachments(
          [val as any],
          context
        )
        processed[key] = processedFile
      } catch (error) {
        logger.error(`[${context.requestId}] Error processing ${currentPath}:`, error)
        processed[key] = val
      }
    } else if (outputDef && typeof outputDef === 'object' && !outputDef.type) {
      // Nested object in schema - recurse with the nested schema
      processed[key] = await processTriggerFileOutputs(val, outputDef, context, currentPath)
    } else {
      // Not a file output - keep as is
      processed[key] = val
    }
  }

  return processed
}

export type WebhookExecutionPayload = {
  webhookId: string
  workflowId: string
  userId: string
  provider: string
  body: any
  headers: Record<string, string>
  path: string
  blockId?: string
  testMode?: boolean
  executionTarget?: 'deployed' | 'live'
  credentialId?: string
}

export async function executeWebhookJob(payload: WebhookExecutionPayload) {
  const executionId = uuidv4()
  const requestId = executionId.slice(0, 8)

  logger.info(`[${requestId}] Starting webhook execution`, {
    webhookId: payload.webhookId,
    workflowId: payload.workflowId,
    provider: payload.provider,
    userId: payload.userId,
    executionId,
  })

  const idempotencyKey = IdempotencyService.createWebhookIdempotencyKey(
    payload.webhookId,
    payload.headers,
    payload.body,
    payload.provider
  )

  const runOperation = async () => {
    return await executeWebhookJobInternal(payload, executionId, requestId)
  }

  return await webhookIdempotency.executeWithIdempotency(
    payload.provider,
    idempotencyKey,
    runOperation
  )
}

async function executeWebhookJobInternal(
  payload: WebhookExecutionPayload,
  executionId: string,
  requestId: string
) {
  const loggingSession = new LoggingSession(
    payload.workflowId,
    executionId,
    payload.provider,
    requestId
  )

  // Track deploymentVersionId at function scope so it's available in catch block
  let deploymentVersionId: string | undefined

  try {
    const useDraftState = payload.executionTarget === 'live'
    const workflowData = useDraftState
      ? await loadWorkflowFromNormalizedTables(payload.workflowId)
      : await loadDeployedWorkflowState(payload.workflowId)
    if (!workflowData) {
      throw new Error(
        `Workflow state not found. The workflow may not be ${useDraftState ? 'saved' : 'deployed'} or the deployment data may be corrupted.`
      )
    }

    const { blocks, edges, loops, parallels } = workflowData
    // Only deployed executions have a deployment version ID
    deploymentVersionId =
      !useDraftState && 'deploymentVersionId' in workflowData
        ? (workflowData.deploymentVersionId as string)
        : undefined

    const wfRows = await db
      .select({ workspaceId: workflowTable.workspaceId, variables: workflowTable.variables })
      .from(workflowTable)
      .where(eq(workflowTable.id, payload.workflowId))
      .limit(1)
    const workspaceId = wfRows[0]?.workspaceId || undefined
    const workflowVariables = (wfRows[0]?.variables as Record<string, any>) || {}

    // Merge subblock states (matching workflow-execution pattern)
    const mergedStates = mergeSubblockState(blocks, {})

    // Create serialized workflow
    const serializer = new Serializer()
    const serializedWorkflow = serializer.serializeWorkflow(
      mergedStates,
      edges,
      loops || {},
      parallels || {},
      true // Enable validation during execution
    )

    // Handle special Airtable case
    if (payload.provider === 'airtable') {
      logger.info(`[${requestId}] Processing Airtable webhook via fetchAndProcessAirtablePayloads`)

      // Load the actual webhook record from database to get providerConfig
      const [webhookRecord] = await db
        .select()
        .from(webhook)
        .where(eq(webhook.id, payload.webhookId))
        .limit(1)

      if (!webhookRecord) {
        throw new Error(`Webhook record not found: ${payload.webhookId}`)
      }

      const webhookData = {
        id: payload.webhookId,
        provider: payload.provider,
        providerConfig: webhookRecord.providerConfig,
      }

      // Create a mock workflow object for Airtable processing
      const mockWorkflow = {
        id: payload.workflowId,
        userId: payload.userId,
      }

      // Get the processed Airtable input
      const airtableInput = await fetchAndProcessAirtablePayloads(
        webhookData,
        mockWorkflow,
        requestId
      )

      // If we got input (changes), execute the workflow like other providers
      if (airtableInput) {
        logger.info(`[${requestId}] Executing workflow with Airtable changes`)

        // Get workflow for core execution
        const workflow = await getWorkflowById(payload.workflowId)
        if (!workflow) {
          throw new Error(`Workflow ${payload.workflowId} not found`)
        }

        const metadata: ExecutionMetadata = {
          requestId,
          executionId,
          workflowId: payload.workflowId,
          workspaceId,
          userId: payload.userId,
          sessionUserId: undefined,
          workflowUserId: workflow.userId,
          triggerType: payload.provider || 'webhook',
          triggerBlockId: payload.blockId,
          useDraftState: false,
          startTime: new Date().toISOString(),
          isClientSession: false,
          workflowStateOverride: {
            blocks,
            edges,
            loops: loops || {},
            parallels: parallels || {},
            deploymentVersionId,
          },
        }

        const snapshot = new ExecutionSnapshot(
          metadata,
          workflow,
          airtableInput,
          workflowVariables,
          []
        )

        const executionResult = await executeWorkflowCore({
          snapshot,
          callbacks: {},
          loggingSession,
        })

        if (executionResult.status === 'paused') {
          if (!executionResult.snapshotSeed) {
            logger.error(`[${requestId}] Missing snapshot seed for paused execution`, {
              executionId,
            })
          } else {
            await PauseResumeManager.persistPauseResult({
              workflowId: payload.workflowId,
              executionId,
              pausePoints: executionResult.pausePoints || [],
              snapshotSeed: executionResult.snapshotSeed,
              executorUserId: executionResult.metadata?.userId,
            })
          }
        } else {
          await PauseResumeManager.processQueuedResumes(executionId)
        }

        logger.info(`[${requestId}] Airtable webhook execution completed`, {
          success: executionResult.success,
          workflowId: payload.workflowId,
        })

        return {
          success: executionResult.success,
          workflowId: payload.workflowId,
          executionId,
          output: executionResult.output,
          executedAt: new Date().toISOString(),
          provider: payload.provider,
        }
      }
      // No changes to process
      logger.info(`[${requestId}] No Airtable changes to process`)

      // Start logging session so the complete call has a log entry to update
      await loggingSession.safeStart({
        userId: payload.userId,
        workspaceId: workspaceId || '',
        variables: {},
        triggerData: {
          isTest: payload.testMode === true,
          executionTarget: payload.executionTarget || 'deployed',
        },
        deploymentVersionId,
      })

      await loggingSession.safeComplete({
        endedAt: new Date().toISOString(),
        totalDurationMs: 0,
        finalOutput: { message: 'No Airtable changes to process' },
        traceSpans: [],
      })

      return {
        success: true,
        workflowId: payload.workflowId,
        executionId,
        output: { message: 'No Airtable changes to process' },
        executedAt: new Date().toISOString(),
      }
    }

    // Format input for standard webhooks
    // Load the actual webhook to get providerConfig (needed for Teams credentialId)
    const webhookRows = await db
      .select()
      .from(webhook)
      .where(eq(webhook.id, payload.webhookId))
      .limit(1)

    const actualWebhook =
      webhookRows.length > 0
        ? webhookRows[0]
        : {
            provider: payload.provider,
            blockId: payload.blockId,
            providerConfig: {},
          }

    const mockWorkflow = {
      id: payload.workflowId,
      userId: payload.userId,
    }
    const mockRequest = {
      headers: new Map(Object.entries(payload.headers)),
    } as any

    const input = await formatWebhookInput(actualWebhook, mockWorkflow, payload.body, mockRequest)

    if (!input && payload.provider === 'whatsapp') {
      logger.info(`[${requestId}] No messages in WhatsApp payload, skipping execution`)

      // Start logging session so the complete call has a log entry to update
      await loggingSession.safeStart({
        userId: payload.userId,
        workspaceId: workspaceId || '',
        variables: {},
        triggerData: {
          isTest: payload.testMode === true,
          executionTarget: payload.executionTarget || 'deployed',
        },
        deploymentVersionId,
      })

      await loggingSession.safeComplete({
        endedAt: new Date().toISOString(),
        totalDurationMs: 0,
        finalOutput: { message: 'No messages in WhatsApp payload' },
        traceSpans: [],
      })
      return {
        success: true,
        workflowId: payload.workflowId,
        executionId,
        output: { message: 'No messages in WhatsApp payload' },
        executedAt: new Date().toISOString(),
      }
    }

    // Process trigger file outputs based on schema
    if (input && payload.blockId && blocks[payload.blockId]) {
      try {
        const triggerBlock = blocks[payload.blockId]
        const rawSelectedTriggerId = triggerBlock?.subBlocks?.selectedTriggerId?.value
        const rawTriggerId = triggerBlock?.subBlocks?.triggerId?.value

        const resolvedTriggerId = [rawSelectedTriggerId, rawTriggerId].find(
          (candidate): candidate is string =>
            typeof candidate === 'string' && isTriggerValid(candidate)
        )

        if (resolvedTriggerId) {
          const triggerConfig = getTrigger(resolvedTriggerId)

          if (triggerConfig.outputs) {
            logger.debug(`[${requestId}] Processing trigger ${resolvedTriggerId} file outputs`)
            const processedInput = await processTriggerFileOutputs(input, triggerConfig.outputs, {
              workspaceId: workspaceId || '',
              workflowId: payload.workflowId,
              executionId,
              requestId,
              userId: payload.userId,
            })
            Object.assign(input, processedInput)
          }
        } else {
          logger.debug(`[${requestId}] No valid triggerId found for block ${payload.blockId}`)
        }
      } catch (error) {
        logger.error(`[${requestId}] Error processing trigger file outputs:`, error)
        // Continue without processing attachments rather than failing execution
      }
    }

    // Process generic webhook files based on inputFormat
    if (input && payload.provider === 'generic' && payload.blockId && blocks[payload.blockId]) {
      try {
        const triggerBlock = blocks[payload.blockId]

        if (triggerBlock?.subBlocks?.inputFormat?.value) {
          const inputFormat = triggerBlock.subBlocks.inputFormat.value as unknown as Array<{
            name: string
            type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'files'
          }>
          logger.debug(`[${requestId}] Processing generic webhook files from inputFormat`)

          const fileFields = inputFormat.filter((field) => field.type === 'files')

          if (fileFields.length > 0 && typeof input === 'object' && input !== null) {
            const executionContext = {
              workspaceId: workspaceId || '',
              workflowId: payload.workflowId,
              executionId,
            }

            for (const fileField of fileFields) {
              const fieldValue = input[fileField.name]

              if (fieldValue && typeof fieldValue === 'object') {
                const uploadedFiles = await processExecutionFiles(
                  fieldValue,
                  executionContext,
                  requestId,
                  payload.userId
                )

                if (uploadedFiles.length > 0) {
                  input[fileField.name] = uploadedFiles
                  logger.info(
                    `[${requestId}] Successfully processed ${uploadedFiles.length} file(s) for field: ${fileField.name}`
                  )
                }
              }
            }
          }
        }
      } catch (error) {
        logger.error(`[${requestId}] Error processing generic webhook files:`, error)
        // Continue without processing files rather than failing execution
      }
    }

    logger.info(`[${requestId}] Executing workflow for ${payload.provider} webhook`)

    // Get workflow for core execution
    const workflow = await getWorkflowById(payload.workflowId)
    if (!workflow) {
      throw new Error(`Workflow ${payload.workflowId} not found`)
    }

    const metadata: ExecutionMetadata = {
      requestId,
      executionId,
      workflowId: payload.workflowId,
      workspaceId,
      userId: payload.userId,
      sessionUserId: undefined,
      workflowUserId: workflow.userId,
      triggerType: payload.provider || 'webhook',
      triggerBlockId: payload.blockId,
      useDraftState: false,
      startTime: new Date().toISOString(),
      isClientSession: false,
      workflowStateOverride: {
        blocks,
        edges,
        loops: loops || {},
        parallels: parallels || {},
        deploymentVersionId,
      },
    }

    const snapshot = new ExecutionSnapshot(metadata, workflow, input || {}, workflowVariables, [])

    const executionResult = await executeWorkflowCore({
      snapshot,
      callbacks: {},
      loggingSession,
    })

    if (executionResult.status === 'paused') {
      if (!executionResult.snapshotSeed) {
        logger.error(`[${requestId}] Missing snapshot seed for paused execution`, {
          executionId,
        })
      } else {
        await PauseResumeManager.persistPauseResult({
          workflowId: payload.workflowId,
          executionId,
          pausePoints: executionResult.pausePoints || [],
          snapshotSeed: executionResult.snapshotSeed,
          executorUserId: executionResult.metadata?.userId,
        })
      }
    } else {
      await PauseResumeManager.processQueuedResumes(executionId)
    }

    logger.info(`[${requestId}] Webhook execution completed`, {
      success: executionResult.success,
      workflowId: payload.workflowId,
      provider: payload.provider,
    })

    return {
      success: executionResult.success,
      workflowId: payload.workflowId,
      executionId,
      output: executionResult.output,
      executedAt: new Date().toISOString(),
      provider: payload.provider,
    }
  } catch (error: any) {
    logger.error(`[${requestId}] Webhook execution failed`, {
      error: error.message,
      stack: error.stack,
      workflowId: payload.workflowId,
      provider: payload.provider,
    })

    try {
      await loggingSession.safeStart({
        userId: payload.userId,
        workspaceId: '', // May not be available for early errors
        variables: {},
        triggerData: {
          isTest: payload.testMode === true,
          executionTarget: payload.executionTarget || 'deployed',
        },
        deploymentVersionId, // Pass if available (undefined for early errors)
      })

      const executionResult = (error?.executionResult as ExecutionResult | undefined) || {
        success: false,
        output: {},
        logs: [],
      }
      const { traceSpans } = buildTraceSpans(executionResult)

      await loggingSession.safeCompleteWithError({
        endedAt: new Date().toISOString(),
        totalDurationMs: 0,
        error: {
          message: error.message || 'Webhook execution failed',
          stackTrace: error.stack,
        },
        traceSpans,
      })
    } catch (loggingError) {
      logger.error(`[${requestId}] Failed to complete logging session`, loggingError)
    }

    throw error
  }
}

export const webhookExecution = task({
  id: 'webhook-execution',
  retry: {
    maxAttempts: 1,
  },
  run: async (payload: WebhookExecutionPayload) => executeWebhookJob(payload),
})
```

--------------------------------------------------------------------------------

````
