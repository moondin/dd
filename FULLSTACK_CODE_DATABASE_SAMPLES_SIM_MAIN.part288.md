---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 288
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 288 of 933)

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

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/logs/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import {
  pausedExecutions,
  permissions,
  workflow,
  workflowDeploymentVersion,
  workflowExecutionLogs,
} from '@sim/db/schema'
import {
  and,
  desc,
  eq,
  gt,
  gte,
  inArray,
  isNotNull,
  isNull,
  lt,
  lte,
  ne,
  or,
  type SQL,
  sql,
} from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('LogsAPI')

export const revalidate = 0

const QueryParamsSchema = z.object({
  details: z.enum(['basic', 'full']).optional().default('basic'),
  limit: z.coerce.number().optional().default(100),
  offset: z.coerce.number().optional().default(0),
  level: z.string().optional(),
  workflowIds: z.string().optional(),
  folderIds: z.string().optional(),
  triggers: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
  workflowName: z.string().optional(),
  folderName: z.string().optional(),
  executionId: z.string().optional(),
  costOperator: z.enum(['=', '>', '<', '>=', '<=', '!=']).optional(),
  costValue: z.coerce.number().optional(),
  durationOperator: z.enum(['=', '>', '<', '>=', '<=', '!=']).optional(),
  durationValue: z.coerce.number().optional(),
  workspaceId: z.string(),
})

export async function GET(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized logs access attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    try {
      const { searchParams } = new URL(request.url)
      const params = QueryParamsSchema.parse(Object.fromEntries(searchParams.entries()))

      const selectColumns =
        params.details === 'full'
          ? {
              id: workflowExecutionLogs.id,
              workflowId: workflowExecutionLogs.workflowId,
              executionId: workflowExecutionLogs.executionId,
              stateSnapshotId: workflowExecutionLogs.stateSnapshotId,
              deploymentVersionId: workflowExecutionLogs.deploymentVersionId,
              level: workflowExecutionLogs.level,
              trigger: workflowExecutionLogs.trigger,
              startedAt: workflowExecutionLogs.startedAt,
              endedAt: workflowExecutionLogs.endedAt,
              totalDurationMs: workflowExecutionLogs.totalDurationMs,
              executionData: workflowExecutionLogs.executionData,
              cost: workflowExecutionLogs.cost,
              files: workflowExecutionLogs.files,
              createdAt: workflowExecutionLogs.createdAt,
              workflowName: workflow.name,
              workflowDescription: workflow.description,
              workflowColor: workflow.color,
              workflowFolderId: workflow.folderId,
              workflowUserId: workflow.userId,
              workflowWorkspaceId: workflow.workspaceId,
              workflowCreatedAt: workflow.createdAt,
              workflowUpdatedAt: workflow.updatedAt,
              pausedStatus: pausedExecutions.status,
              pausedTotalPauseCount: pausedExecutions.totalPauseCount,
              pausedResumedCount: pausedExecutions.resumedCount,
              deploymentVersion: workflowDeploymentVersion.version,
              deploymentVersionName: workflowDeploymentVersion.name,
            }
          : {
              id: workflowExecutionLogs.id,
              workflowId: workflowExecutionLogs.workflowId,
              executionId: workflowExecutionLogs.executionId,
              stateSnapshotId: workflowExecutionLogs.stateSnapshotId,
              deploymentVersionId: workflowExecutionLogs.deploymentVersionId,
              level: workflowExecutionLogs.level,
              trigger: workflowExecutionLogs.trigger,
              startedAt: workflowExecutionLogs.startedAt,
              endedAt: workflowExecutionLogs.endedAt,
              totalDurationMs: workflowExecutionLogs.totalDurationMs,
              executionData: sql<null>`NULL`,
              cost: workflowExecutionLogs.cost,
              files: sql<null>`NULL`,
              createdAt: workflowExecutionLogs.createdAt,
              workflowName: workflow.name,
              workflowDescription: workflow.description,
              workflowColor: workflow.color,
              workflowFolderId: workflow.folderId,
              workflowUserId: workflow.userId,
              workflowWorkspaceId: workflow.workspaceId,
              workflowCreatedAt: workflow.createdAt,
              workflowUpdatedAt: workflow.updatedAt,
              pausedStatus: pausedExecutions.status,
              pausedTotalPauseCount: pausedExecutions.totalPauseCount,
              pausedResumedCount: pausedExecutions.resumedCount,
              deploymentVersion: workflowDeploymentVersion.version,
              deploymentVersionName: sql<null>`NULL`,
            }

      const baseQuery = db
        .select(selectColumns)
        .from(workflowExecutionLogs)
        .leftJoin(
          pausedExecutions,
          eq(pausedExecutions.executionId, workflowExecutionLogs.executionId)
        )
        .leftJoin(
          workflowDeploymentVersion,
          eq(workflowDeploymentVersion.id, workflowExecutionLogs.deploymentVersionId)
        )
        .innerJoin(
          workflow,
          and(
            eq(workflowExecutionLogs.workflowId, workflow.id),
            eq(workflow.workspaceId, params.workspaceId)
          )
        )
        .innerJoin(
          permissions,
          and(
            eq(permissions.entityType, 'workspace'),
            eq(permissions.entityId, workflow.workspaceId),
            eq(permissions.userId, userId)
          )
        )

      let conditions: SQL | undefined

      if (params.level && params.level !== 'all') {
        const levels = params.level.split(',').filter(Boolean)
        const levelConditions: SQL[] = []

        for (const level of levels) {
          if (level === 'error') {
            levelConditions.push(eq(workflowExecutionLogs.level, 'error'))
          } else if (level === 'info') {
            const condition = and(
              eq(workflowExecutionLogs.level, 'info'),
              isNotNull(workflowExecutionLogs.endedAt)
            )
            if (condition) levelConditions.push(condition)
          } else if (level === 'running') {
            const condition = and(
              eq(workflowExecutionLogs.level, 'info'),
              isNull(workflowExecutionLogs.endedAt)
            )
            if (condition) levelConditions.push(condition)
          } else if (level === 'pending') {
            const condition = and(
              eq(workflowExecutionLogs.level, 'info'),
              or(
                sql`(${pausedExecutions.totalPauseCount} > 0 AND ${pausedExecutions.resumedCount} < ${pausedExecutions.totalPauseCount})`,
                and(
                  isNotNull(pausedExecutions.status),
                  sql`${pausedExecutions.status} != 'fully_resumed'`
                )
              )
            )
            if (condition) levelConditions.push(condition)
          }
        }

        if (levelConditions.length > 0) {
          conditions = and(
            conditions,
            levelConditions.length === 1 ? levelConditions[0] : or(...levelConditions)
          )
        }
      }

      if (params.workflowIds) {
        const workflowIds = params.workflowIds.split(',').filter(Boolean)
        if (workflowIds.length > 0) {
          conditions = and(conditions, inArray(workflow.id, workflowIds))
        }
      }

      if (params.folderIds) {
        const folderIds = params.folderIds.split(',').filter(Boolean)
        if (folderIds.length > 0) {
          conditions = and(conditions, inArray(workflow.folderId, folderIds))
        }
      }

      if (params.triggers) {
        const triggers = params.triggers.split(',').filter(Boolean)
        if (triggers.length > 0 && !triggers.includes('all')) {
          conditions = and(conditions, inArray(workflowExecutionLogs.trigger, triggers))
        }
      }

      if (params.startDate) {
        conditions = and(
          conditions,
          gte(workflowExecutionLogs.startedAt, new Date(params.startDate))
        )
      }
      if (params.endDate) {
        conditions = and(conditions, lte(workflowExecutionLogs.startedAt, new Date(params.endDate)))
      }

      if (params.search) {
        const searchTerm = `%${params.search}%`
        conditions = and(conditions, sql`${workflowExecutionLogs.executionId} ILIKE ${searchTerm}`)
      }

      if (params.workflowName) {
        const nameTerm = `%${params.workflowName}%`
        conditions = and(conditions, sql`${workflow.name} ILIKE ${nameTerm}`)
      }

      if (params.folderName) {
        const folderTerm = `%${params.folderName}%`
        conditions = and(conditions, sql`${workflow.name} ILIKE ${folderTerm}`)
      }

      if (params.executionId) {
        conditions = and(conditions, eq(workflowExecutionLogs.executionId, params.executionId))
      }

      if (params.costOperator && params.costValue !== undefined) {
        const costField = sql`(${workflowExecutionLogs.cost}->>'total')::numeric`
        switch (params.costOperator) {
          case '=':
            conditions = and(conditions, sql`${costField} = ${params.costValue}`)
            break
          case '>':
            conditions = and(conditions, sql`${costField} > ${params.costValue}`)
            break
          case '<':
            conditions = and(conditions, sql`${costField} < ${params.costValue}`)
            break
          case '>=':
            conditions = and(conditions, sql`${costField} >= ${params.costValue}`)
            break
          case '<=':
            conditions = and(conditions, sql`${costField} <= ${params.costValue}`)
            break
          case '!=':
            conditions = and(conditions, sql`${costField} != ${params.costValue}`)
            break
        }
      }

      if (params.durationOperator && params.durationValue !== undefined) {
        const durationField = workflowExecutionLogs.totalDurationMs
        switch (params.durationOperator) {
          case '=':
            conditions = and(conditions, eq(durationField, params.durationValue))
            break
          case '>':
            conditions = and(conditions, gt(durationField, params.durationValue))
            break
          case '<':
            conditions = and(conditions, lt(durationField, params.durationValue))
            break
          case '>=':
            conditions = and(conditions, gte(durationField, params.durationValue))
            break
          case '<=':
            conditions = and(conditions, lte(durationField, params.durationValue))
            break
          case '!=':
            conditions = and(conditions, ne(durationField, params.durationValue))
            break
        }
      }

      const logs = await baseQuery
        .where(conditions)
        .orderBy(desc(workflowExecutionLogs.startedAt))
        .limit(params.limit)
        .offset(params.offset)

      const countQuery = db
        .select({ count: sql<number>`count(*)` })
        .from(workflowExecutionLogs)
        .leftJoin(
          pausedExecutions,
          eq(pausedExecutions.executionId, workflowExecutionLogs.executionId)
        )
        .innerJoin(
          workflow,
          and(
            eq(workflowExecutionLogs.workflowId, workflow.id),
            eq(workflow.workspaceId, params.workspaceId)
          )
        )
        .innerJoin(
          permissions,
          and(
            eq(permissions.entityType, 'workspace'),
            eq(permissions.entityId, workflow.workspaceId),
            eq(permissions.userId, userId)
          )
        )
        .where(conditions)

      const countResult = await countQuery

      const count = countResult[0]?.count || 0

      const blockExecutionsByExecution: Record<string, any[]> = {}

      const createTraceSpans = (blockExecutions: any[]) => {
        return blockExecutions.map((block, index) => {
          let output = block.outputData
          if (block.status === 'error' && block.errorMessage) {
            output = {
              ...output,
              error: block.errorMessage,
              stackTrace: block.errorStackTrace,
            }
          }

          return {
            id: block.id,
            name: `Block ${block.blockName || block.blockType} (${block.blockType})`,
            type: block.blockType,
            duration: block.durationMs,
            startTime: block.startedAt,
            endTime: block.endedAt,
            status: block.status === 'success' ? 'success' : 'error',
            blockId: block.blockId,
            input: block.inputData,
            output,
            tokens: block.cost?.tokens?.total || 0,
            relativeStartMs: index * 100,
            children: [],
            toolCalls: [],
          }
        })
      }

      const extractCostSummary = (blockExecutions: any[]) => {
        let totalCost = 0
        let totalInputCost = 0
        let totalOutputCost = 0
        let totalTokens = 0
        let totalPromptTokens = 0
        let totalCompletionTokens = 0
        const models = new Map()

        blockExecutions.forEach((block) => {
          if (block.cost) {
            totalCost += Number(block.cost.total) || 0
            totalInputCost += Number(block.cost.input) || 0
            totalOutputCost += Number(block.cost.output) || 0
            totalTokens += block.cost.tokens?.total || 0
            totalPromptTokens += block.cost.tokens?.prompt || 0
            totalCompletionTokens += block.cost.tokens?.completion || 0

            if (block.cost.model) {
              if (!models.has(block.cost.model)) {
                models.set(block.cost.model, {
                  input: 0,
                  output: 0,
                  total: 0,
                  tokens: { prompt: 0, completion: 0, total: 0 },
                })
              }
              const modelCost = models.get(block.cost.model)
              modelCost.input += Number(block.cost.input) || 0
              modelCost.output += Number(block.cost.output) || 0
              modelCost.total += Number(block.cost.total) || 0
              modelCost.tokens.prompt += block.cost.tokens?.prompt || 0
              modelCost.tokens.completion += block.cost.tokens?.completion || 0
              modelCost.tokens.total += block.cost.tokens?.total || 0
            }
          }
        })

        return {
          total: totalCost,
          input: totalInputCost,
          output: totalOutputCost,
          tokens: {
            total: totalTokens,
            prompt: totalPromptTokens,
            completion: totalCompletionTokens,
          },
          models: Object.fromEntries(models),
        }
      }

      const enhancedLogs = logs.map((log) => {
        const blockExecutions = blockExecutionsByExecution[log.executionId] || []

        let traceSpans = []
        let finalOutput: any
        let costSummary = (log.cost as any) || { total: 0 }

        if (params.details === 'full' && log.executionData) {
          const storedTraceSpans = (log.executionData as any)?.traceSpans
          traceSpans =
            storedTraceSpans && Array.isArray(storedTraceSpans) && storedTraceSpans.length > 0
              ? storedTraceSpans
              : createTraceSpans(blockExecutions)

          costSummary =
            log.cost && Object.keys(log.cost as any).length > 0
              ? (log.cost as any)
              : extractCostSummary(blockExecutions)

          try {
            const fo = (log.executionData as any)?.finalOutput
            if (fo !== undefined) finalOutput = fo
          } catch {}
        }

        const workflowSummary = {
          id: log.workflowId,
          name: log.workflowName,
          description: log.workflowDescription,
          color: log.workflowColor,
          folderId: log.workflowFolderId,
          userId: log.workflowUserId,
          workspaceId: log.workflowWorkspaceId,
          createdAt: log.workflowCreatedAt,
          updatedAt: log.workflowUpdatedAt,
        }

        return {
          id: log.id,
          workflowId: log.workflowId,
          executionId: log.executionId,
          deploymentVersionId: log.deploymentVersionId,
          deploymentVersion: log.deploymentVersion ?? null,
          deploymentVersionName: log.deploymentVersionName ?? null,
          level: log.level,
          duration: log.totalDurationMs ? `${log.totalDurationMs}ms` : null,
          trigger: log.trigger,
          createdAt: log.startedAt.toISOString(),
          files: params.details === 'full' ? log.files || undefined : undefined,
          workflow: workflowSummary,
          pauseSummary: {
            status: log.pausedStatus ?? null,
            total: log.pausedTotalPauseCount ?? 0,
            resumed: log.pausedResumedCount ?? 0,
          },
          executionData:
            params.details === 'full'
              ? {
                  totalDuration: log.totalDurationMs,
                  traceSpans,
                  blockExecutions,
                  finalOutput,
                  enhanced: true,
                }
              : undefined,
          cost:
            params.details === 'full'
              ? (costSummary as any)
              : { total: (costSummary as any)?.total || 0 },
          hasPendingPause:
            (Number(log.pausedTotalPauseCount ?? 0) > 0 &&
              Number(log.pausedResumedCount ?? 0) < Number(log.pausedTotalPauseCount ?? 0)) ||
            (log.pausedStatus && log.pausedStatus !== 'fully_resumed'),
        }
      })
      return NextResponse.json(
        {
          data: enhancedLogs,
          total: Number(count),
          page: Math.floor(params.offset / params.limit) + 1,
          pageSize: params.limit,
          totalPages: Math.ceil(Number(count) / params.limit),
        },
        { status: 200 }
      )
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        logger.warn(`[${requestId}] Invalid logs request parameters`, {
          errors: validationError.errors,
        })
        return NextResponse.json(
          {
            error: 'Invalid request parameters',
            details: validationError.errors,
          },
          { status: 400 }
        )
      }
      throw validationError
    }
  } catch (error: any) {
    logger.error(`[${requestId}] logs fetch error`, error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/logs/cleanup/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { subscription, user, workflow, workflowExecutionLogs } from '@sim/db/schema'
import { and, eq, inArray, lt, sql } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { verifyCronAuth } from '@/lib/auth/internal'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'
import { snapshotService } from '@/lib/logs/execution/snapshot/service'
import { isUsingCloudStorage, StorageService } from '@/lib/uploads'

export const dynamic = 'force-dynamic'

const logger = createLogger('LogsCleanupAPI')

const BATCH_SIZE = 2000

export async function GET(request: NextRequest) {
  try {
    const authError = verifyCronAuth(request, 'logs cleanup')
    if (authError) {
      return authError
    }

    const retentionDate = new Date()
    retentionDate.setDate(retentionDate.getDate() - Number(env.FREE_PLAN_LOG_RETENTION_DAYS || '7'))

    const freeUsers = await db
      .select({ userId: user.id })
      .from(user)
      .leftJoin(
        subscription,
        sql`${user.id} = ${subscription.referenceId} AND ${subscription.status} = 'active' AND ${subscription.plan} IN ('pro', 'team', 'enterprise')`
      )
      .where(sql`${subscription.id} IS NULL`)

    if (freeUsers.length === 0) {
      logger.info('No free users found for log cleanup')
      return NextResponse.json({ message: 'No free users found for cleanup' })
    }

    const freeUserIds = freeUsers.map((u) => u.userId)

    const workflowsQuery = await db
      .select({ id: workflow.id })
      .from(workflow)
      .where(inArray(workflow.userId, freeUserIds))

    if (workflowsQuery.length === 0) {
      logger.info('No workflows found for free users')
      return NextResponse.json({ message: 'No workflows found for cleanup' })
    }

    const workflowIds = workflowsQuery.map((w) => w.id)

    const results = {
      enhancedLogs: {
        total: 0,
        archived: 0,
        archiveFailed: 0,
        deleted: 0,
        deleteFailed: 0,
      },
      files: {
        total: 0,
        deleted: 0,
        deleteFailed: 0,
      },
      snapshots: {
        cleaned: 0,
        cleanupFailed: 0,
      },
    }

    const startTime = Date.now()
    const MAX_BATCHES = 10

    let batchesProcessed = 0
    let hasMoreLogs = true

    logger.info(`Starting enhanced logs cleanup for ${workflowIds.length} workflows`)

    while (hasMoreLogs && batchesProcessed < MAX_BATCHES) {
      const oldEnhancedLogs = await db
        .select({
          id: workflowExecutionLogs.id,
          workflowId: workflowExecutionLogs.workflowId,
          executionId: workflowExecutionLogs.executionId,
          stateSnapshotId: workflowExecutionLogs.stateSnapshotId,
          level: workflowExecutionLogs.level,
          trigger: workflowExecutionLogs.trigger,
          startedAt: workflowExecutionLogs.startedAt,
          endedAt: workflowExecutionLogs.endedAt,
          totalDurationMs: workflowExecutionLogs.totalDurationMs,
          executionData: workflowExecutionLogs.executionData,
          cost: workflowExecutionLogs.cost,
          files: workflowExecutionLogs.files,
          createdAt: workflowExecutionLogs.createdAt,
        })
        .from(workflowExecutionLogs)
        .where(
          and(
            inArray(workflowExecutionLogs.workflowId, workflowIds),
            lt(workflowExecutionLogs.createdAt, retentionDate)
          )
        )
        .limit(BATCH_SIZE)

      results.enhancedLogs.total += oldEnhancedLogs.length

      for (const log of oldEnhancedLogs) {
        const today = new Date().toISOString().split('T')[0]

        const enhancedLogKey = `logs/archived/${today}/${log.id}.json`
        const enhancedLogData = JSON.stringify({
          ...log,
          archivedAt: new Date().toISOString(),
          logType: 'enhanced',
        })

        try {
          await StorageService.uploadFile({
            file: Buffer.from(enhancedLogData),
            fileName: enhancedLogKey,
            contentType: 'application/json',
            context: 'logs',
            preserveKey: true,
            customKey: enhancedLogKey,
            metadata: {
              logId: String(log.id),
              workflowId: String(log.workflowId),
              executionId: String(log.executionId),
              logType: 'enhanced',
              archivedAt: new Date().toISOString(),
            },
          })

          results.enhancedLogs.archived++

          if (isUsingCloudStorage() && log.files && Array.isArray(log.files)) {
            for (const file of log.files) {
              if (file && typeof file === 'object' && file.key) {
                results.files.total++
                try {
                  await StorageService.deleteFile({
                    key: file.key,
                    context: 'execution',
                  })
                  results.files.deleted++

                  // Also delete from workspace_files table
                  const { deleteFileMetadata } = await import('@/lib/uploads/server/metadata')
                  await deleteFileMetadata(file.key)

                  logger.info(`Deleted execution file: ${file.key}`)
                } catch (fileError) {
                  results.files.deleteFailed++
                  logger.error(`Failed to delete file ${file.key}:`, { fileError })
                }
              }
            }
          }

          try {
            const deleteResult = await db
              .delete(workflowExecutionLogs)
              .where(eq(workflowExecutionLogs.id, log.id))
              .returning({ id: workflowExecutionLogs.id })

            if (deleteResult.length > 0) {
              results.enhancedLogs.deleted++
            } else {
              results.enhancedLogs.deleteFailed++
              logger.warn(`Failed to delete log ${log.id} after archiving: No rows deleted`)
            }
          } catch (deleteError) {
            results.enhancedLogs.deleteFailed++
            logger.error(`Error deleting log ${log.id} after archiving:`, { deleteError })
          }
        } catch (archiveError) {
          results.enhancedLogs.archiveFailed++
          logger.error(`Failed to archive log ${log.id}:`, { archiveError })
        }
      }

      batchesProcessed++
      hasMoreLogs = oldEnhancedLogs.length === BATCH_SIZE

      logger.info(`Processed logs batch ${batchesProcessed}: ${oldEnhancedLogs.length} logs`)
    }

    try {
      const snapshotRetentionDays = Number(env.FREE_PLAN_LOG_RETENTION_DAYS || '7') + 1 // Keep snapshots 1 day longer
      const cleanedSnapshots = await snapshotService.cleanupOrphanedSnapshots(snapshotRetentionDays)
      results.snapshots.cleaned = cleanedSnapshots
      logger.info(`Cleaned up ${cleanedSnapshots} orphaned snapshots`)
    } catch (snapshotError) {
      results.snapshots.cleanupFailed = 1
      logger.error('Error cleaning up orphaned snapshots:', { snapshotError })
    }

    const timeElapsed = (Date.now() - startTime) / 1000
    const reachedLimit = batchesProcessed >= MAX_BATCHES && hasMoreLogs

    return NextResponse.json({
      message: `Processed ${batchesProcessed} enhanced log batches (${results.enhancedLogs.total} logs, ${results.files.total} files) in ${timeElapsed.toFixed(2)}s${reachedLimit ? ' (batch limit reached)' : ''}`,
      results,
      complete: !hasMoreLogs,
      batchLimitReached: reachedLimit,
    })
  } catch (error) {
    logger.error('Error in log cleanup process:', { error })
    return NextResponse.json({ error: 'Failed to process log cleanup' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/logs/execution/[executionId]/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { workflowExecutionLogs, workflowExecutionSnapshots } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('LogsByExecutionIdAPI')

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ executionId: string }> }
) {
  try {
    const { executionId } = await params

    logger.debug(`Fetching execution data for: ${executionId}`)

    // Get the workflow execution log to find the snapshot
    const [workflowLog] = await db
      .select()
      .from(workflowExecutionLogs)
      .where(eq(workflowExecutionLogs.executionId, executionId))
      .limit(1)

    if (!workflowLog) {
      return NextResponse.json({ error: 'Workflow execution not found' }, { status: 404 })
    }

    // Get the workflow state snapshot
    const [snapshot] = await db
      .select()
      .from(workflowExecutionSnapshots)
      .where(eq(workflowExecutionSnapshots.id, workflowLog.stateSnapshotId))
      .limit(1)

    if (!snapshot) {
      return NextResponse.json({ error: 'Workflow state snapshot not found' }, { status: 404 })
    }

    const response = {
      executionId,
      workflowId: workflowLog.workflowId,
      workflowState: snapshot.stateData,
      executionMetadata: {
        trigger: workflowLog.trigger,
        startedAt: workflowLog.startedAt.toISOString(),
        endedAt: workflowLog.endedAt?.toISOString(),
        totalDurationMs: workflowLog.totalDurationMs,
        cost: workflowLog.cost || null,
      },
    }

    logger.debug(`Successfully fetched execution data for: ${executionId}`)
    logger.debug(
      `Workflow state contains ${Object.keys((snapshot.stateData as any)?.blocks || {}).length} blocks`
    )

    return NextResponse.json(response)
  } catch (error) {
    logger.error('Error fetching execution data:', error)
    return NextResponse.json({ error: 'Failed to fetch execution data' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/logs/export/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { permissions, workflow, workflowExecutionLogs } from '@sim/db/schema'
import { and, desc, eq, gte, inArray, lte, type SQL, sql } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('LogsExportAPI')

export const revalidate = 0

const ExportParamsSchema = z.object({
  level: z.string().optional(),
  workflowIds: z.string().optional(),
  folderIds: z.string().optional(),
  triggers: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
  workflowName: z.string().optional(),
  folderName: z.string().optional(),
  workspaceId: z.string(),
})

function escapeCsv(value: any): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const params = ExportParamsSchema.parse(Object.fromEntries(searchParams.entries()))

    const selectColumns = {
      id: workflowExecutionLogs.id,
      workflowId: workflowExecutionLogs.workflowId,
      executionId: workflowExecutionLogs.executionId,
      level: workflowExecutionLogs.level,
      trigger: workflowExecutionLogs.trigger,
      startedAt: workflowExecutionLogs.startedAt,
      endedAt: workflowExecutionLogs.endedAt,
      totalDurationMs: workflowExecutionLogs.totalDurationMs,
      cost: workflowExecutionLogs.cost,
      executionData: workflowExecutionLogs.executionData,
      workflowName: workflow.name,
    }

    let conditions: SQL | undefined = eq(workflow.workspaceId, params.workspaceId)

    if (params.level && params.level !== 'all') {
      const levels = params.level.split(',').filter(Boolean)
      if (levels.length === 1) {
        conditions = and(conditions, eq(workflowExecutionLogs.level, levels[0]))
      } else if (levels.length > 1) {
        conditions = and(conditions, inArray(workflowExecutionLogs.level, levels))
      }
    }

    if (params.workflowIds) {
      const workflowIds = params.workflowIds.split(',').filter(Boolean)
      if (workflowIds.length > 0) conditions = and(conditions, inArray(workflow.id, workflowIds))
    }

    if (params.folderIds) {
      const folderIds = params.folderIds.split(',').filter(Boolean)
      if (folderIds.length > 0) conditions = and(conditions, inArray(workflow.folderId, folderIds))
    }

    if (params.triggers) {
      const triggers = params.triggers.split(',').filter(Boolean)
      if (triggers.length > 0 && !triggers.includes('all')) {
        conditions = and(conditions, inArray(workflowExecutionLogs.trigger, triggers))
      }
    }

    if (params.startDate) {
      conditions = and(conditions, gte(workflowExecutionLogs.startedAt, new Date(params.startDate)))
    }
    if (params.endDate) {
      conditions = and(conditions, lte(workflowExecutionLogs.startedAt, new Date(params.endDate)))
    }

    if (params.search) {
      const term = `%${params.search}%`
      conditions = and(conditions, sql`${workflowExecutionLogs.executionId} ILIKE ${term}`)
    }
    if (params.workflowName) {
      const nameTerm = `%${params.workflowName}%`
      conditions = and(conditions, sql`${workflow.name} ILIKE ${nameTerm}`)
    }
    if (params.folderName) {
      const folderTerm = `%${params.folderName}%`
      conditions = and(conditions, sql`${workflow.name} ILIKE ${folderTerm}`)
    }

    const header = [
      'startedAt',
      'level',
      'workflow',
      'trigger',
      'durationMs',
      'costTotal',
      'workflowId',
      'executionId',
      'message',
      'traceSpans',
    ].join(',')

    const encoder = new TextEncoder()
    const stream = new ReadableStream<Uint8Array>({
      start: async (controller) => {
        controller.enqueue(encoder.encode(`${header}\n`))
        const pageSize = 1000
        let offset = 0
        try {
          while (true) {
            const rows = await db
              .select(selectColumns)
              .from(workflowExecutionLogs)
              .innerJoin(workflow, eq(workflowExecutionLogs.workflowId, workflow.id))
              .innerJoin(
                permissions,
                and(
                  eq(permissions.entityType, 'workspace'),
                  eq(permissions.entityId, workflow.workspaceId),
                  eq(permissions.userId, userId)
                )
              )
              .where(conditions)
              .orderBy(desc(workflowExecutionLogs.startedAt))
              .limit(pageSize)
              .offset(offset)

            if (!rows.length) break

            for (const r of rows as any[]) {
              let message = ''
              let traces: any = null
              try {
                const ed = (r as any).executionData
                if (ed) {
                  if (ed.finalOutput)
                    message =
                      typeof ed.finalOutput === 'string'
                        ? ed.finalOutput
                        : JSON.stringify(ed.finalOutput)
                  if (ed.message) message = ed.message
                  if (ed.traceSpans) traces = ed.traceSpans
                }
              } catch {}
              const line = [
                escapeCsv(r.startedAt?.toISOString?.() || r.startedAt),
                escapeCsv(r.level),
                escapeCsv(r.workflowName),
                escapeCsv(r.trigger),
                escapeCsv(r.totalDurationMs ?? ''),
                escapeCsv(r.cost?.total ?? r.cost?.value?.total ?? ''),
                escapeCsv(r.workflowId ?? ''),
                escapeCsv(r.executionId ?? ''),
                escapeCsv(message),
                escapeCsv(traces ? JSON.stringify(traces) : ''),
              ].join(',')
              controller.enqueue(encoder.encode(`${line}\n`))
            }

            offset += pageSize
          }
          controller.close()
        } catch (e: any) {
          logger.error('Export stream error', { error: e?.message })
          try {
            controller.error(e)
          } catch {}
        }
      },
    })

    const ts = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `logs-${ts}.csv`

    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error: any) {
    logger.error('Export error', { error: error?.message })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/logs/triggers/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { permissions, workflow, workflowExecutionLogs } from '@sim/db/schema'
import { and, eq, isNotNull, sql } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('TriggersAPI')

export const revalidate = 0

const QueryParamsSchema = z.object({
  workspaceId: z.string(),
})

/**
 * GET /api/logs/triggers
 *
 * Returns unique trigger types from workflow execution logs
 * Only includes integration triggers (excludes core types: api, manual, webhook, chat, schedule)
 */
export async function GET(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized triggers access attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    try {
      const { searchParams } = new URL(request.url)
      const params = QueryParamsSchema.parse(Object.fromEntries(searchParams.entries()))

      const triggers = await db
        .selectDistinct({
          trigger: workflowExecutionLogs.trigger,
        })
        .from(workflowExecutionLogs)
        .innerJoin(
          workflow,
          and(
            eq(workflowExecutionLogs.workflowId, workflow.id),
            eq(workflow.workspaceId, params.workspaceId)
          )
        )
        .innerJoin(
          permissions,
          and(
            eq(permissions.entityType, 'workspace'),
            eq(permissions.entityId, workflow.workspaceId),
            eq(permissions.userId, userId)
          )
        )
        .where(
          and(
            isNotNull(workflowExecutionLogs.trigger),
            sql`${workflowExecutionLogs.trigger} NOT IN ('api', 'manual', 'webhook', 'chat', 'schedule')`
          )
        )

      const triggerValues = triggers
        .map((row) => row.trigger)
        .filter((t): t is string => Boolean(t))
        .sort()

      return NextResponse.json({
        triggers: triggerValues,
        count: triggerValues.length,
      })
    } catch (err) {
      if (err instanceof z.ZodError) {
        logger.error(`[${requestId}] Invalid query parameters`, { error: err })
        return NextResponse.json(
          { error: 'Invalid query parameters', details: err.errors },
          { status: 400 }
        )
      }

      throw err
    }
  } catch (err) {
    logger.error(`[${requestId}] Failed to fetch triggers`, { error: err })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

````
