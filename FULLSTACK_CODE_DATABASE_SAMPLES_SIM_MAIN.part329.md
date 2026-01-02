---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 329
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 329 of 933)

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
Location: sim-main/apps/sim/app/api/workflows/[id]/deployments/[version]/activate/route.ts
Signals: Next.js

```typescript
import { db, workflow, workflowDeploymentVersion } from '@sim/db'
import { and, eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { validateWorkflowPermissions } from '@/lib/workflows/utils'
import { createErrorResponse, createSuccessResponse } from '@/app/api/workflows/utils'

const logger = createLogger('WorkflowActivateDeploymentAPI')

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; version: string }> }
) {
  const requestId = generateRequestId()
  const { id, version } = await params

  try {
    const { error } = await validateWorkflowPermissions(id, requestId, 'admin')
    if (error) {
      return createErrorResponse(error.message, error.status)
    }

    const versionNum = Number(version)
    if (!Number.isFinite(versionNum)) {
      return createErrorResponse('Invalid version', 400)
    }

    const now = new Date()

    await db.transaction(async (tx) => {
      await tx
        .update(workflowDeploymentVersion)
        .set({ isActive: false })
        .where(
          and(
            eq(workflowDeploymentVersion.workflowId, id),
            eq(workflowDeploymentVersion.isActive, true)
          )
        )

      const updated = await tx
        .update(workflowDeploymentVersion)
        .set({ isActive: true })
        .where(
          and(
            eq(workflowDeploymentVersion.workflowId, id),
            eq(workflowDeploymentVersion.version, versionNum)
          )
        )
        .returning({ id: workflowDeploymentVersion.id })

      if (updated.length === 0) {
        throw new Error('Deployment version not found')
      }

      const updateData: Record<string, unknown> = {
        isDeployed: true,
        deployedAt: now,
      }

      await tx.update(workflow).set(updateData).where(eq(workflow.id, id))
    })

    return createSuccessResponse({ success: true, deployedAt: now })
  } catch (error: any) {
    logger.error(`[${requestId}] Error activating deployment for workflow: ${id}`, error)
    return createErrorResponse(error.message || 'Failed to activate deployment', 500)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workflows/[id]/deployments/[version]/revert/route.ts
Signals: Next.js

```typescript
import { db, workflow, workflowDeploymentVersion } from '@sim/db'
import { and, eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { env } from '@/lib/core/config/env'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { saveWorkflowToNormalizedTables } from '@/lib/workflows/persistence/utils'
import { validateWorkflowPermissions } from '@/lib/workflows/utils'
import { createErrorResponse, createSuccessResponse } from '@/app/api/workflows/utils'

const logger = createLogger('RevertToDeploymentVersionAPI')

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; version: string }> }
) {
  const requestId = generateRequestId()
  const { id, version } = await params

  try {
    const { error } = await validateWorkflowPermissions(id, requestId, 'admin')
    if (error) {
      return createErrorResponse(error.message, error.status)
    }

    const versionSelector = version === 'active' ? null : Number(version)
    if (version !== 'active' && !Number.isFinite(versionSelector)) {
      return createErrorResponse('Invalid version', 400)
    }

    let stateRow: { state: any } | null = null
    if (version === 'active') {
      const [row] = await db
        .select({ state: workflowDeploymentVersion.state })
        .from(workflowDeploymentVersion)
        .where(
          and(
            eq(workflowDeploymentVersion.workflowId, id),
            eq(workflowDeploymentVersion.isActive, true)
          )
        )
        .limit(1)
      stateRow = row || null
    } else {
      const [row] = await db
        .select({ state: workflowDeploymentVersion.state })
        .from(workflowDeploymentVersion)
        .where(
          and(
            eq(workflowDeploymentVersion.workflowId, id),
            eq(workflowDeploymentVersion.version, versionSelector as number)
          )
        )
        .limit(1)
      stateRow = row || null
    }

    if (!stateRow?.state) {
      return createErrorResponse('Deployment version not found', 404)
    }

    const deployedState = stateRow.state
    if (!deployedState.blocks || !deployedState.edges) {
      return createErrorResponse('Invalid deployed state structure', 500)
    }

    const saveResult = await saveWorkflowToNormalizedTables(id, {
      blocks: deployedState.blocks,
      edges: deployedState.edges,
      loops: deployedState.loops || {},
      parallels: deployedState.parallels || {},
      lastSaved: Date.now(),
      isDeployed: true,
      deployedAt: new Date(),
      deploymentStatuses: deployedState.deploymentStatuses || {},
    })

    if (!saveResult.success) {
      return createErrorResponse(saveResult.error || 'Failed to save deployed state', 500)
    }

    await db
      .update(workflow)
      .set({ lastSynced: new Date(), updatedAt: new Date() })
      .where(eq(workflow.id, id))

    try {
      const socketServerUrl = env.SOCKET_SERVER_URL || 'http://localhost:3002'
      await fetch(`${socketServerUrl}/api/workflow-reverted`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId: id, timestamp: Date.now() }),
      })
    } catch (e) {
      logger.error('Error sending workflow reverted event to socket server', e)
    }

    return createSuccessResponse({
      message: 'Reverted to deployment version',
      lastSaved: Date.now(),
    })
  } catch (error: any) {
    logger.error('Error reverting to deployment version', error)
    return createErrorResponse(error.message || 'Failed to revert', 500)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workflows/[id]/duplicate/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { duplicateWorkflow } from '@/lib/workflows/persistence/duplicate'

const logger = createLogger('WorkflowDuplicateAPI')

const DuplicateRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  color: z.string().optional(),
  workspaceId: z.string().optional(),
  folderId: z.string().nullable().optional(),
})

// POST /api/workflows/[id]/duplicate - Duplicate a workflow with all its blocks, edges, and subflows
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: sourceWorkflowId } = await params
  const requestId = generateRequestId()
  const startTime = Date.now()

  const session = await getSession()
  if (!session?.user?.id) {
    logger.warn(`[${requestId}] Unauthorized workflow duplication attempt for ${sourceWorkflowId}`)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, description, color, workspaceId, folderId } = DuplicateRequestSchema.parse(body)

    logger.info(
      `[${requestId}] Duplicating workflow ${sourceWorkflowId} for user ${session.user.id}`
    )

    const result = await duplicateWorkflow({
      sourceWorkflowId,
      userId: session.user.id,
      name,
      description,
      color,
      workspaceId,
      folderId,
      requestId,
    })

    const elapsed = Date.now() - startTime
    logger.info(
      `[${requestId}] Successfully duplicated workflow ${sourceWorkflowId} to ${result.id} in ${elapsed}ms`
    )

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Source workflow not found') {
        logger.warn(`[${requestId}] Source workflow ${sourceWorkflowId} not found`)
        return NextResponse.json({ error: 'Source workflow not found' }, { status: 404 })
      }

      if (error.message === 'Source workflow not found or access denied') {
        logger.warn(
          `[${requestId}] User ${session.user.id} denied access to source workflow ${sourceWorkflowId}`
        )
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid duplication request data`, { errors: error.errors })
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    const elapsed = Date.now() - startTime
    logger.error(
      `[${requestId}] Error duplicating workflow ${sourceWorkflowId} after ${elapsed}ms:`,
      error
    )
    return NextResponse.json({ error: 'Failed to duplicate workflow' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workflows/[id]/execute/route.ts
Signals: Next.js, Zod

```typescript
import { tasks } from '@trigger.dev/sdk'
import { type NextRequest, NextResponse } from 'next/server'
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { isTriggerDevEnabled } from '@/lib/core/config/feature-flags'
import { generateRequestId } from '@/lib/core/utils/request'
import { SSE_HEADERS } from '@/lib/core/utils/sse'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { processInputFileFields } from '@/lib/execution/files'
import { preprocessExecution } from '@/lib/execution/preprocessing'
import { createLogger } from '@/lib/logs/console/logger'
import { LoggingSession } from '@/lib/logs/execution/logging-session'
import { executeWorkflowCore } from '@/lib/workflows/executor/execution-core'
import { type ExecutionEvent, encodeSSEEvent } from '@/lib/workflows/executor/execution-events'
import { PauseResumeManager } from '@/lib/workflows/executor/human-in-the-loop-manager'
import {
  loadDeployedWorkflowState,
  loadWorkflowFromNormalizedTables,
} from '@/lib/workflows/persistence/utils'
import { createStreamingResponse } from '@/lib/workflows/streaming/streaming'
import { createHttpResponseFromBlock, workflowHasResponseBlock } from '@/lib/workflows/utils'
import type { WorkflowExecutionPayload } from '@/background/workflow-execution'
import { type ExecutionMetadata, ExecutionSnapshot } from '@/executor/execution/snapshot'
import type { StreamingExecution } from '@/executor/types'
import { Serializer } from '@/serializer'
import type { SubflowType } from '@/stores/workflows/workflow/types'

const logger = createLogger('WorkflowExecuteAPI')

const ExecuteWorkflowSchema = z.object({
  selectedOutputs: z.array(z.string()).optional().default([]),
  triggerType: z.enum(['api', 'webhook', 'schedule', 'manual', 'chat']).optional(),
  stream: z.boolean().optional(),
  useDraftState: z.boolean().optional(),
  input: z.any().optional(),
  isClientSession: z.boolean().optional(),
  workflowStateOverride: z
    .object({
      blocks: z.record(z.any()),
      edges: z.array(z.any()),
      loops: z.record(z.any()).optional(),
      parallels: z.record(z.any()).optional(),
    })
    .optional(),
})

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Execute workflow with streaming support - used by chat and other streaming endpoints
 *
 * This function assumes preprocessing has already been completed.
 * Callers must run preprocessExecution() first to validate workflow, check usage limits,
 * and resolve actor before calling this function.
 *
 * This is a wrapper function that:
 * - Supports streaming callbacks (onStream, onBlockComplete)
 * - Returns ExecutionResult instead of NextResponse
 * - Handles pause/resume logic
 *
 * Used by:
 * - Chat execution (/api/chat/[identifier]/route.ts)
 * - Streaming responses (lib/workflows/streaming.ts)
 */
export async function executeWorkflow(
  workflow: any,
  requestId: string,
  input: any | undefined,
  actorUserId: string,
  streamConfig?: {
    enabled: boolean
    selectedOutputs?: string[]
    isSecureMode?: boolean
    workflowTriggerType?: 'api' | 'chat'
    onStream?: (streamingExec: any) => Promise<void>
    onBlockComplete?: (blockId: string, output: any) => Promise<void>
    skipLoggingComplete?: boolean
  },
  providedExecutionId?: string
): Promise<any> {
  const workflowId = workflow.id
  const executionId = providedExecutionId || uuidv4()
  const triggerType = streamConfig?.workflowTriggerType || 'api'
  const loggingSession = new LoggingSession(workflowId, executionId, triggerType, requestId)

  try {
    const metadata: ExecutionMetadata = {
      requestId,
      executionId,
      workflowId,
      workspaceId: workflow.workspaceId,
      userId: actorUserId,
      workflowUserId: workflow.userId,
      triggerType,
      useDraftState: false,
      startTime: new Date().toISOString(),
      isClientSession: false,
    }

    const snapshot = new ExecutionSnapshot(
      metadata,
      workflow,
      input,
      workflow.variables || {},
      streamConfig?.selectedOutputs || []
    )

    const result = await executeWorkflowCore({
      snapshot,
      callbacks: {
        onStream: streamConfig?.onStream,
        onBlockComplete: streamConfig?.onBlockComplete
          ? async (blockId: string, _blockName: string, _blockType: string, output: any) => {
              await streamConfig.onBlockComplete!(blockId, output)
            }
          : undefined,
      },
      loggingSession,
    })

    if (result.status === 'paused') {
      if (!result.snapshotSeed) {
        logger.error(`[${requestId}] Missing snapshot seed for paused execution`, {
          executionId,
        })
      } else {
        await PauseResumeManager.persistPauseResult({
          workflowId,
          executionId,
          pausePoints: result.pausePoints || [],
          snapshotSeed: result.snapshotSeed,
          executorUserId: result.metadata?.userId,
        })
      }
    } else {
      await PauseResumeManager.processQueuedResumes(executionId)
    }

    if (streamConfig?.skipLoggingComplete) {
      return {
        ...result,
        _streamingMetadata: {
          loggingSession,
          processedInput: input,
        },
      }
    }

    return result
  } catch (error: any) {
    logger.error(`[${requestId}] Workflow execution failed:`, error)
    throw error
  }
}

export function createFilteredResult(result: any) {
  return {
    ...result,
    logs: undefined,
    metadata: result.metadata
      ? {
          ...result.metadata,
          workflowConnections: undefined,
        }
      : undefined,
  }
}

function resolveOutputIds(
  selectedOutputs: string[] | undefined,
  blocks: Record<string, any>
): string[] | undefined {
  if (!selectedOutputs || selectedOutputs.length === 0) {
    return selectedOutputs
  }

  return selectedOutputs.map((outputId) => {
    const underscoreIndex = outputId.indexOf('_')
    const dotIndex = outputId.indexOf('.')
    if (underscoreIndex > 0) {
      const maybeUuid = outputId.substring(0, underscoreIndex)
      if (uuidValidate(maybeUuid)) {
        return outputId
      }
    }

    if (dotIndex > 0) {
      const maybeUuid = outputId.substring(0, dotIndex)
      if (uuidValidate(maybeUuid)) {
        return `${outputId.substring(0, dotIndex)}_${outputId.substring(dotIndex + 1)}`
      }
    }

    if (uuidValidate(outputId)) {
      return outputId
    }

    if (dotIndex === -1) {
      logger.warn(`Invalid output ID format (missing dot): ${outputId}`)
      return outputId
    }

    const blockName = outputId.substring(0, dotIndex)
    const path = outputId.substring(dotIndex + 1)

    const normalizedBlockName = blockName.toLowerCase().replace(/\s+/g, '')
    const block = Object.values(blocks).find((b: any) => {
      const normalized = (b.name || '').toLowerCase().replace(/\s+/g, '')
      return normalized === normalizedBlockName
    })

    if (!block) {
      logger.warn(`Block not found for name: ${blockName} (from output ID: ${outputId})`)
      return outputId
    }

    const resolvedId = `${block.id}_${path}`
    logger.debug(`Resolved output ID: ${outputId} -> ${resolvedId}`)
    return resolvedId
  })
}

type AsyncExecutionParams = {
  requestId: string
  workflowId: string
  userId: string
  input: any
  triggerType: 'api' | 'webhook' | 'schedule' | 'manual' | 'chat'
}

/**
 * Handles async workflow execution by queueing a background job.
 * Returns immediately with a 202 Accepted response containing the job ID.
 */
async function handleAsyncExecution(params: AsyncExecutionParams): Promise<NextResponse> {
  const { requestId, workflowId, userId, input, triggerType } = params

  if (!isTriggerDevEnabled) {
    logger.warn(`[${requestId}] Async mode requested but TRIGGER_DEV_ENABLED is false`)
    return NextResponse.json(
      { error: 'Async execution is not enabled. Set TRIGGER_DEV_ENABLED=true to use async mode.' },
      { status: 400 }
    )
  }

  const payload: WorkflowExecutionPayload = {
    workflowId,
    userId,
    input,
    triggerType,
  }

  try {
    const handle = await tasks.trigger('workflow-execution', payload)

    logger.info(`[${requestId}] Queued async workflow execution`, {
      workflowId,
      jobId: handle.id,
    })

    return NextResponse.json(
      {
        success: true,
        async: true,
        jobId: handle.id,
        message: 'Workflow execution queued',
        statusUrl: `${getBaseUrl()}/api/jobs/${handle.id}`,
      },
      { status: 202 }
    )
  } catch (error: any) {
    logger.error(`[${requestId}] Failed to queue async execution`, error)
    return NextResponse.json(
      { error: `Failed to queue async execution: ${error.message}` },
      { status: 500 }
    )
  }
}

/**
 * POST /api/workflows/[id]/execute
 *
 * Unified server-side workflow execution endpoint.
 * Supports both SSE streaming (for interactive/manual runs) and direct JSON responses (for background jobs).
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id: workflowId } = await params

  try {
    const auth = await checkHybridAuth(req, { requireWorkflowId: false })
    if (!auth.success || !auth.userId) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 })
    }
    const userId = auth.userId

    let body: any = {}
    try {
      const text = await req.text()
      if (text) {
        body = JSON.parse(text)
      }
    } catch (error) {
      logger.warn(`[${requestId}] Failed to parse request body, using defaults`)
    }

    const validation = ExecuteWorkflowSchema.safeParse(body)
    if (!validation.success) {
      logger.warn(`[${requestId}] Invalid request body:`, validation.error.errors)
      return NextResponse.json(
        {
          error: 'Invalid request body',
          details: validation.error.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      )
    }

    const defaultTriggerType = auth.authType === 'api_key' ? 'api' : 'manual'

    const {
      selectedOutputs,
      triggerType = defaultTriggerType,
      stream: streamParam,
      useDraftState,
      input: validatedInput,
      isClientSession = false,
      workflowStateOverride,
    } = validation.data

    // For API key auth, the entire body is the input (except for our control fields)
    // For session auth, the input is explicitly provided in the input field
    const input =
      auth.authType === 'api_key'
        ? (() => {
            const {
              selectedOutputs,
              triggerType,
              stream,
              useDraftState,
              workflowStateOverride,
              ...rest
            } = body
            return Object.keys(rest).length > 0 ? rest : validatedInput
          })()
        : validatedInput

    const shouldUseDraftState = useDraftState ?? auth.authType === 'session'

    const streamHeader = req.headers.get('X-Stream-Response') === 'true'
    const enableSSE = streamHeader || streamParam === true
    const executionModeHeader = req.headers.get('X-Execution-Mode')
    const isAsyncMode = executionModeHeader === 'async'

    logger.info(`[${requestId}] Starting server-side execution`, {
      workflowId,
      userId,
      hasInput: !!input,
      triggerType,
      authType: auth.authType,
      streamParam,
      streamHeader,
      enableSSE,
      isAsyncMode,
    })

    const executionId = uuidv4()
    type LoggingTriggerType = 'api' | 'webhook' | 'schedule' | 'manual' | 'chat'
    let loggingTriggerType: LoggingTriggerType = 'manual'
    if (
      triggerType === 'api' ||
      triggerType === 'chat' ||
      triggerType === 'webhook' ||
      triggerType === 'schedule' ||
      triggerType === 'manual'
    ) {
      loggingTriggerType = triggerType as LoggingTriggerType
    }
    const loggingSession = new LoggingSession(
      workflowId,
      executionId,
      loggingTriggerType,
      requestId
    )

    const preprocessResult = await preprocessExecution({
      workflowId,
      userId,
      triggerType: loggingTriggerType,
      executionId,
      requestId,
      checkDeployment: !shouldUseDraftState,
      loggingSession,
    })

    if (!preprocessResult.success) {
      return NextResponse.json(
        { error: preprocessResult.error!.message },
        { status: preprocessResult.error!.statusCode }
      )
    }

    const actorUserId = preprocessResult.actorUserId!
    const workflow = preprocessResult.workflowRecord!

    logger.info(`[${requestId}] Preprocessing passed`, {
      workflowId,
      actorUserId,
      workspaceId: workflow.workspaceId,
    })

    if (isAsyncMode) {
      return handleAsyncExecution({
        requestId,
        workflowId,
        userId: actorUserId,
        input,
        triggerType: loggingTriggerType,
      })
    }

    let cachedWorkflowData: {
      blocks: Record<string, any>
      edges: any[]
      loops: Record<string, any>
      parallels: Record<string, any>
      deploymentVersionId?: string
    } | null = null

    let processedInput = input
    try {
      const workflowData = shouldUseDraftState
        ? await loadWorkflowFromNormalizedTables(workflowId)
        : await loadDeployedWorkflowState(workflowId)

      if (workflowData) {
        cachedWorkflowData = {
          blocks: workflowData.blocks,
          edges: workflowData.edges,
          loops: workflowData.loops || {},
          parallels: workflowData.parallels || {},
          deploymentVersionId:
            !shouldUseDraftState && 'deploymentVersionId' in workflowData
              ? (workflowData.deploymentVersionId as string)
              : undefined,
        }

        const serializedWorkflow = new Serializer().serializeWorkflow(
          workflowData.blocks,
          workflowData.edges,
          workflowData.loops,
          workflowData.parallels,
          false
        )

        const executionContext = {
          workspaceId: workflow.workspaceId || '',
          workflowId,
          executionId,
        }

        processedInput = await processInputFileFields(
          input,
          serializedWorkflow.blocks,
          executionContext,
          requestId,
          actorUserId
        )
      }
    } catch (fileError) {
      logger.error(`[${requestId}] Failed to process input file fields:`, fileError)

      await loggingSession.safeStart({
        userId: actorUserId,
        workspaceId: workflow.workspaceId || '',
        variables: {},
      })

      await loggingSession.safeCompleteWithError({
        error: {
          message: `File processing failed: ${fileError instanceof Error ? fileError.message : 'Unable to process input files'}`,
          stackTrace: fileError instanceof Error ? fileError.stack : undefined,
        },
        traceSpans: [],
      })

      return NextResponse.json(
        {
          error: `File processing failed: ${fileError instanceof Error ? fileError.message : 'Unable to process input files'}`,
        },
        { status: 400 }
      )
    }

    const effectiveWorkflowStateOverride = workflowStateOverride || cachedWorkflowData || undefined

    if (!enableSSE) {
      logger.info(`[${requestId}] Using non-SSE execution (direct JSON response)`)
      try {
        const metadata: ExecutionMetadata = {
          requestId,
          executionId,
          workflowId,
          workspaceId: workflow.workspaceId ?? undefined,
          userId: actorUserId,
          sessionUserId: isClientSession ? userId : undefined,
          workflowUserId: workflow.userId,
          triggerType,
          useDraftState: shouldUseDraftState,
          startTime: new Date().toISOString(),
          isClientSession,
          workflowStateOverride: effectiveWorkflowStateOverride,
        }

        const snapshot = new ExecutionSnapshot(
          metadata,
          workflow,
          processedInput,
          workflow.variables || {},
          selectedOutputs
        )

        const result = await executeWorkflowCore({
          snapshot,
          callbacks: {},
          loggingSession,
        })

        const hasResponseBlock = workflowHasResponseBlock(result)
        if (hasResponseBlock) {
          return createHttpResponseFromBlock(result)
        }

        const filteredResult = {
          success: result.success,
          output: result.output,
          error: result.error,
          metadata: result.metadata
            ? {
                duration: result.metadata.duration,
                startTime: result.metadata.startTime,
                endTime: result.metadata.endTime,
              }
            : undefined,
        }

        return NextResponse.json(filteredResult)
      } catch (error: any) {
        const errorMessage = error.message || 'Unknown error'
        logger.error(`[${requestId}] Non-SSE execution failed: ${errorMessage}`)

        const executionResult = error.executionResult

        return NextResponse.json(
          {
            success: false,
            output: executionResult?.output,
            error: executionResult?.error || error.message || 'Execution failed',
            metadata: executionResult?.metadata
              ? {
                  duration: executionResult.metadata.duration,
                  startTime: executionResult.metadata.startTime,
                  endTime: executionResult.metadata.endTime,
                }
              : undefined,
          },
          { status: 500 }
        )
      }
    }

    if (shouldUseDraftState) {
      logger.info(`[${requestId}] Using SSE console log streaming (manual execution)`)
    } else {
      logger.info(`[${requestId}] Using streaming API response`)

      const resolvedSelectedOutputs = resolveOutputIds(
        selectedOutputs,
        cachedWorkflowData?.blocks || {}
      )
      const stream = await createStreamingResponse({
        requestId,
        workflow: {
          id: workflow.id,
          userId: actorUserId,
          workspaceId: workflow.workspaceId,
          isDeployed: workflow.isDeployed,
          variables: (workflow as any).variables,
        },
        input: processedInput,
        executingUserId: actorUserId,
        streamConfig: {
          selectedOutputs: resolvedSelectedOutputs,
          isSecureMode: false,
          workflowTriggerType: triggerType === 'chat' ? 'chat' : 'api',
        },
        createFilteredResult,
        executionId,
      })

      return new NextResponse(stream, {
        status: 200,
        headers: SSE_HEADERS,
      })
    }

    const encoder = new TextEncoder()
    let executorInstance: any = null
    let isStreamClosed = false

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const sendEvent = (event: ExecutionEvent) => {
          if (isStreamClosed) return

          try {
            controller.enqueue(encodeSSEEvent(event))
          } catch {
            isStreamClosed = true
          }
        }

        try {
          const startTime = new Date()

          sendEvent({
            type: 'execution:started',
            timestamp: startTime.toISOString(),
            executionId,
            workflowId,
            data: {
              startTime: startTime.toISOString(),
            },
          })

          const onBlockStart = async (
            blockId: string,
            blockName: string,
            blockType: string,
            iterationContext?: {
              iterationCurrent: number
              iterationTotal: number
              iterationType: SubflowType
            }
          ) => {
            logger.info(`[${requestId}] 🔷 onBlockStart called:`, { blockId, blockName, blockType })
            sendEvent({
              type: 'block:started',
              timestamp: new Date().toISOString(),
              executionId,
              workflowId,
              data: {
                blockId,
                blockName,
                blockType,
                ...(iterationContext && {
                  iterationCurrent: iterationContext.iterationCurrent,
                  iterationTotal: iterationContext.iterationTotal,
                  iterationType: iterationContext.iterationType,
                }),
              },
            })
          }

          const onBlockComplete = async (
            blockId: string,
            blockName: string,
            blockType: string,
            callbackData: any,
            iterationContext?: {
              iterationCurrent: number
              iterationTotal: number
              iterationType: SubflowType
            }
          ) => {
            const hasError = callbackData.output?.error

            if (hasError) {
              logger.info(`[${requestId}] ✗ onBlockComplete (error) called:`, {
                blockId,
                blockName,
                blockType,
                error: callbackData.output.error,
              })
              sendEvent({
                type: 'block:error',
                timestamp: new Date().toISOString(),
                executionId,
                workflowId,
                data: {
                  blockId,
                  blockName,
                  blockType,
                  input: callbackData.input,
                  error: callbackData.output.error,
                  durationMs: callbackData.executionTime || 0,
                  ...(iterationContext && {
                    iterationCurrent: iterationContext.iterationCurrent,
                    iterationTotal: iterationContext.iterationTotal,
                    iterationType: iterationContext.iterationType,
                  }),
                },
              })
            } else {
              logger.info(`[${requestId}] ✓ onBlockComplete called:`, {
                blockId,
                blockName,
                blockType,
              })
              sendEvent({
                type: 'block:completed',
                timestamp: new Date().toISOString(),
                executionId,
                workflowId,
                data: {
                  blockId,
                  blockName,
                  blockType,
                  input: callbackData.input,
                  output: callbackData.output,
                  durationMs: callbackData.executionTime || 0,
                  ...(iterationContext && {
                    iterationCurrent: iterationContext.iterationCurrent,
                    iterationTotal: iterationContext.iterationTotal,
                    iterationType: iterationContext.iterationType,
                  }),
                },
              })
            }
          }

          const onStream = async (streamingExec: StreamingExecution) => {
            const blockId = (streamingExec.execution as any).blockId
            const reader = streamingExec.stream.getReader()
            const decoder = new TextDecoder()

            try {
              while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value, { stream: true })
                sendEvent({
                  type: 'stream:chunk',
                  timestamp: new Date().toISOString(),
                  executionId,
                  workflowId,
                  data: { blockId, chunk },
                })
              }

              sendEvent({
                type: 'stream:done',
                timestamp: new Date().toISOString(),
                executionId,
                workflowId,
                data: { blockId },
              })
            } catch (error) {
              logger.error(`[${requestId}] Error streaming block content:`, error)
            } finally {
              try {
                reader.releaseLock()
              } catch {}
            }
          }

          const metadata: ExecutionMetadata = {
            requestId,
            executionId,
            workflowId,
            workspaceId: workflow.workspaceId ?? undefined,
            userId: actorUserId,
            sessionUserId: isClientSession ? userId : undefined,
            workflowUserId: workflow.userId,
            triggerType,
            useDraftState: shouldUseDraftState,
            startTime: new Date().toISOString(),
            isClientSession,
            workflowStateOverride: effectiveWorkflowStateOverride,
          }

          const snapshot = new ExecutionSnapshot(
            metadata,
            workflow,
            processedInput,
            workflow.variables || {},
            selectedOutputs
          )

          const result = await executeWorkflowCore({
            snapshot,
            callbacks: {
              onBlockStart,
              onBlockComplete,
              onStream,
              onExecutorCreated: (executor) => {
                executorInstance = executor
              },
            },
            loggingSession,
          })

          if (result.status === 'paused') {
            if (!result.snapshotSeed) {
              logger.error(`[${requestId}] Missing snapshot seed for paused execution`, {
                executionId,
              })
            } else {
              await PauseResumeManager.persistPauseResult({
                workflowId,
                executionId,
                pausePoints: result.pausePoints || [],
                snapshotSeed: result.snapshotSeed,
                executorUserId: result.metadata?.userId,
              })
            }
          } else {
            await PauseResumeManager.processQueuedResumes(executionId)
          }

          if (result.error === 'Workflow execution was cancelled') {
            logger.info(`[${requestId}] Workflow execution was cancelled`)
            sendEvent({
              type: 'execution:cancelled',
              timestamp: new Date().toISOString(),
              executionId,
              workflowId,
              data: {
                duration: result.metadata?.duration || 0,
              },
            })
            return
          }

          sendEvent({
            type: 'execution:completed',
            timestamp: new Date().toISOString(),
            executionId,
            workflowId,
            data: {
              success: result.success,
              output: result.output,
              duration: result.metadata?.duration || 0,
              startTime: result.metadata?.startTime || startTime.toISOString(),
              endTime: result.metadata?.endTime || new Date().toISOString(),
            },
          })
        } catch (error: any) {
          const errorMessage = error.message || 'Unknown error'
          logger.error(`[${requestId}] SSE execution failed: ${errorMessage}`)

          const executionResult = error.executionResult

          sendEvent({
            type: 'execution:error',
            timestamp: new Date().toISOString(),
            executionId,
            workflowId,
            data: {
              error: executionResult?.error || errorMessage,
              duration: executionResult?.metadata?.duration || 0,
            },
          })
        } finally {
          if (!isStreamClosed) {
            try {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'))
              controller.close()
            } catch {
              // Stream already closed - nothing to do
            }
          }
        }
      },
      cancel() {
        isStreamClosed = true
        logger.info(`[${requestId}] Client aborted SSE stream, cancelling executor`)

        if (executorInstance && typeof executorInstance.cancel === 'function') {
          executorInstance.cancel()
        }
      },
    })

    return new NextResponse(stream, {
      headers: {
        ...SSE_HEADERS,
        'X-Execution-Id': executionId,
      },
    })
  } catch (error: any) {
    logger.error(`[${requestId}] Failed to start workflow execution:`, error)
    return NextResponse.json(
      { error: error.message || 'Failed to start workflow execution' },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

````
