---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 328
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 328 of 933)

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
Location: sim-main/apps/sim/app/api/workflows/[id]/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { templates, webhook, workflow } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { authenticateApiKeyFromHeader, updateApiKeyLastUsed } from '@/lib/api-key/service'
import { getSession } from '@/lib/auth'
import { verifyInternalToken } from '@/lib/auth/internal'
import { env } from '@/lib/core/config/env'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { loadWorkflowFromNormalizedTables } from '@/lib/workflows/persistence/utils'
import { getWorkflowAccessContext, getWorkflowById } from '@/lib/workflows/utils'

const logger = createLogger('WorkflowByIdAPI')

const UpdateWorkflowSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  folderId: z.string().nullable().optional(),
})

/**
 * GET /api/workflows/[id]
 * Fetch a single workflow by ID
 * Uses hybrid approach: try normalized tables first, fallback to JSON blob
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const startTime = Date.now()
  const { id: workflowId } = await params

  try {
    const authHeader = request.headers.get('authorization')
    let isInternalCall = false

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const verification = await verifyInternalToken(token)
      isInternalCall = verification.valid
    }

    let userId: string | null = null

    if (isInternalCall) {
      logger.info(`[${requestId}] Internal API call for workflow ${workflowId}`)
    } else {
      const session = await getSession()
      let authenticatedUserId: string | null = session?.user?.id || null

      if (!authenticatedUserId) {
        const apiKeyHeader = request.headers.get('x-api-key')
        if (apiKeyHeader) {
          const authResult = await authenticateApiKeyFromHeader(apiKeyHeader)
          if (authResult.success && authResult.userId) {
            authenticatedUserId = authResult.userId
            if (authResult.keyId) {
              await updateApiKeyLastUsed(authResult.keyId).catch((error) => {
                logger.warn(`[${requestId}] Failed to update API key last used timestamp:`, {
                  keyId: authResult.keyId,
                  error,
                })
              })
            }
          }
        }
      }

      if (!authenticatedUserId) {
        logger.warn(`[${requestId}] Unauthorized access attempt for workflow ${workflowId}`)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      userId = authenticatedUserId
    }

    let accessContext = null
    let workflowData = await getWorkflowById(workflowId)

    if (!workflowData) {
      logger.warn(`[${requestId}] Workflow ${workflowId} not found`)
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    // Check if user has access to this workflow
    let hasAccess = false

    if (isInternalCall) {
      // Internal calls have full access
      hasAccess = true
    } else {
      // Case 1: User owns the workflow
      if (workflowData) {
        accessContext = await getWorkflowAccessContext(workflowId, userId ?? undefined)

        if (!accessContext) {
          logger.warn(`[${requestId}] Workflow ${workflowId} not found`)
          return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
        }

        workflowData = accessContext.workflow

        if (accessContext.isOwner) {
          hasAccess = true
        }

        if (!hasAccess && workflowData.workspaceId && accessContext.workspacePermission) {
          hasAccess = true
        }
      }

      if (!hasAccess) {
        logger.warn(`[${requestId}] User ${userId} denied access to workflow ${workflowId}`)
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    logger.debug(`[${requestId}] Attempting to load workflow ${workflowId} from normalized tables`)
    const normalizedData = await loadWorkflowFromNormalizedTables(workflowId)

    if (normalizedData) {
      logger.debug(`[${requestId}] Found normalized data for workflow ${workflowId}:`, {
        blocksCount: Object.keys(normalizedData.blocks).length,
        edgesCount: normalizedData.edges.length,
        loopsCount: Object.keys(normalizedData.loops).length,
        parallelsCount: Object.keys(normalizedData.parallels).length,
        loops: normalizedData.loops,
      })

      const finalWorkflowData = {
        ...workflowData,
        state: {
          // Default values for expected properties
          deploymentStatuses: {},
          // Data from normalized tables
          blocks: normalizedData.blocks,
          edges: normalizedData.edges,
          loops: normalizedData.loops,
          parallels: normalizedData.parallels,
          lastSaved: Date.now(),
          isDeployed: workflowData.isDeployed || false,
          deployedAt: workflowData.deployedAt,
        },
        // Include workflow variables
        variables: workflowData.variables || {},
      }

      logger.info(`[${requestId}] Loaded workflow ${workflowId} from normalized tables`)
      const elapsed = Date.now() - startTime
      logger.info(`[${requestId}] Successfully fetched workflow ${workflowId} in ${elapsed}ms`)

      return NextResponse.json({ data: finalWorkflowData }, { status: 200 })
    }

    const emptyWorkflowData = {
      ...workflowData,
      state: {
        deploymentStatuses: {},
        blocks: {},
        edges: [],
        loops: {},
        parallels: {},
        lastSaved: Date.now(),
        isDeployed: workflowData.isDeployed || false,
        deployedAt: workflowData.deployedAt,
      },
      variables: workflowData.variables || {},
    }

    return NextResponse.json({ data: emptyWorkflowData }, { status: 200 })
  } catch (error: any) {
    const elapsed = Date.now() - startTime
    logger.error(`[${requestId}] Error fetching workflow ${workflowId} after ${elapsed}ms`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/workflows/[id]
 * Delete a workflow by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = generateRequestId()
  const startTime = Date.now()
  const { id: workflowId } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized deletion attempt for workflow ${workflowId}`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const accessContext = await getWorkflowAccessContext(workflowId, userId)
    const workflowData = accessContext?.workflow || (await getWorkflowById(workflowId))

    if (!workflowData) {
      logger.warn(`[${requestId}] Workflow ${workflowId} not found for deletion`)
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    // Check if user has permission to delete this workflow
    let canDelete = false

    // Case 1: User owns the workflow
    if (workflowData.userId === userId) {
      canDelete = true
    }

    // Case 2: Workflow belongs to a workspace and user has admin permission
    if (!canDelete && workflowData.workspaceId) {
      const context = accessContext || (await getWorkflowAccessContext(workflowId, userId))
      if (context?.workspacePermission === 'admin') {
        canDelete = true
      }
    }

    if (!canDelete) {
      logger.warn(
        `[${requestId}] User ${userId} denied permission to delete workflow ${workflowId}`
      )
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Check if workflow has published templates before deletion
    const { searchParams } = new URL(request.url)
    const checkTemplates = searchParams.get('check-templates') === 'true'
    const deleteTemplatesParam = searchParams.get('deleteTemplates')

    if (checkTemplates) {
      // Return template information for frontend to handle
      const publishedTemplates = await db
        .select({
          id: templates.id,
          name: templates.name,
          views: templates.views,
          stars: templates.stars,
          status: templates.status,
        })
        .from(templates)
        .where(eq(templates.workflowId, workflowId))

      return NextResponse.json({
        hasPublishedTemplates: publishedTemplates.length > 0,
        count: publishedTemplates.length,
        publishedTemplates: publishedTemplates.map((t) => ({
          id: t.id,
          name: t.name,
          views: t.views,
          stars: t.stars,
        })),
      })
    }

    // Handle template deletion based on user choice
    if (deleteTemplatesParam !== null) {
      const deleteTemplates = deleteTemplatesParam === 'delete'

      if (deleteTemplates) {
        // Delete all templates associated with this workflow
        await db.delete(templates).where(eq(templates.workflowId, workflowId))
        logger.info(`[${requestId}] Deleted templates for workflow ${workflowId}`)
      } else {
        // Orphan the templates (set workflowId to null)
        await db
          .update(templates)
          .set({ workflowId: null })
          .where(eq(templates.workflowId, workflowId))
        logger.info(`[${requestId}] Orphaned templates for workflow ${workflowId}`)
      }
    }

    // Clean up external webhooks before deleting workflow
    try {
      const { cleanupExternalWebhook } = await import('@/lib/webhooks/provider-subscriptions')
      const webhooksToCleanup = await db
        .select({
          webhook: webhook,
          workflow: {
            id: workflow.id,
            userId: workflow.userId,
            workspaceId: workflow.workspaceId,
          },
        })
        .from(webhook)
        .innerJoin(workflow, eq(webhook.workflowId, workflow.id))
        .where(eq(webhook.workflowId, workflowId))

      if (webhooksToCleanup.length > 0) {
        logger.info(
          `[${requestId}] Found ${webhooksToCleanup.length} webhook(s) to cleanup for workflow ${workflowId}`
        )

        // Clean up each webhook (don't fail if cleanup fails)
        for (const webhookData of webhooksToCleanup) {
          try {
            await cleanupExternalWebhook(webhookData.webhook, webhookData.workflow, requestId)
          } catch (cleanupError) {
            logger.warn(
              `[${requestId}] Failed to cleanup external webhook ${webhookData.webhook.id} during workflow deletion`,
              cleanupError
            )
            // Continue with deletion even if cleanup fails
          }
        }
      }
    } catch (webhookCleanupError) {
      logger.warn(
        `[${requestId}] Error during webhook cleanup for workflow deletion (continuing with deletion)`,
        webhookCleanupError
      )
      // Continue with workflow deletion even if webhook cleanup fails
    }

    await db.delete(workflow).where(eq(workflow.id, workflowId))

    const elapsed = Date.now() - startTime
    logger.info(`[${requestId}] Successfully deleted workflow ${workflowId} in ${elapsed}ms`)

    // Notify Socket.IO system to disconnect users from this workflow's room
    // This prevents "Block not found" errors when collaborative updates try to process
    // after the workflow has been deleted
    try {
      const socketUrl = env.SOCKET_SERVER_URL || 'http://localhost:3002'
      const socketResponse = await fetch(`${socketUrl}/api/workflow-deleted`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId }),
      })

      if (socketResponse.ok) {
        logger.info(
          `[${requestId}] Notified Socket.IO server about workflow ${workflowId} deletion`
        )
      } else {
        logger.warn(
          `[${requestId}] Failed to notify Socket.IO server about workflow ${workflowId} deletion`
        )
      }
    } catch (error) {
      logger.warn(
        `[${requestId}] Error notifying Socket.IO server about workflow ${workflowId} deletion:`,
        error
      )
      // Don't fail the deletion if Socket.IO notification fails
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    const elapsed = Date.now() - startTime
    logger.error(`[${requestId}] Error deleting workflow ${workflowId} after ${elapsed}ms`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PUT /api/workflows/[id]
 * Update workflow metadata (name, description, color, folderId)
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const startTime = Date.now()
  const { id: workflowId } = await params

  try {
    // Get the session
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized update attempt for workflow ${workflowId}`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const body = await request.json()
    const updates = UpdateWorkflowSchema.parse(body)

    // Fetch the workflow to check ownership/access
    const accessContext = await getWorkflowAccessContext(workflowId, userId)
    const workflowData = accessContext?.workflow || (await getWorkflowById(workflowId))

    if (!workflowData) {
      logger.warn(`[${requestId}] Workflow ${workflowId} not found for update`)
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    // Check if user has permission to update this workflow
    let canUpdate = false

    // Case 1: User owns the workflow
    if (workflowData.userId === userId) {
      canUpdate = true
    }

    // Case 2: Workflow belongs to a workspace and user has write or admin permission
    if (!canUpdate && workflowData.workspaceId) {
      const context = accessContext || (await getWorkflowAccessContext(workflowId, userId))
      if (context?.workspacePermission === 'write' || context?.workspacePermission === 'admin') {
        canUpdate = true
      }
    }

    if (!canUpdate) {
      logger.warn(
        `[${requestId}] User ${userId} denied permission to update workflow ${workflowId}`
      )
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Build update object
    const updateData: any = { updatedAt: new Date() }
    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.color !== undefined) updateData.color = updates.color
    if (updates.folderId !== undefined) updateData.folderId = updates.folderId

    // Update the workflow
    const [updatedWorkflow] = await db
      .update(workflow)
      .set(updateData)
      .where(eq(workflow.id, workflowId))
      .returning()

    const elapsed = Date.now() - startTime
    logger.info(`[${requestId}] Successfully updated workflow ${workflowId} in ${elapsed}ms`, {
      updates: updateData,
    })

    return NextResponse.json({ workflow: updatedWorkflow }, { status: 200 })
  } catch (error: any) {
    const elapsed = Date.now() - startTime
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid workflow update data for ${workflowId}`, {
        errors: error.errors,
      })
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    logger.error(`[${requestId}] Error updating workflow ${workflowId} after ${elapsed}ms`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workflows/[id]/autolayout/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { applyAutoLayout } from '@/lib/workflows/autolayout'
import {
  DEFAULT_HORIZONTAL_SPACING,
  DEFAULT_LAYOUT_PADDING,
  DEFAULT_VERTICAL_SPACING,
} from '@/lib/workflows/autolayout/constants'
import {
  loadWorkflowFromNormalizedTables,
  type NormalizedWorkflowData,
} from '@/lib/workflows/persistence/utils'
import { getWorkflowAccessContext } from '@/lib/workflows/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('AutoLayoutAPI')

const AutoLayoutRequestSchema = z.object({
  spacing: z
    .object({
      horizontal: z.number().min(100).max(1000).optional(),
      vertical: z.number().min(50).max(500).optional(),
    })
    .optional()
    .default({}),
  alignment: z.enum(['start', 'center', 'end']).optional().default('center'),
  padding: z
    .object({
      x: z.number().min(50).max(500).optional(),
      y: z.number().min(50).max(500).optional(),
    })
    .optional()
    .default({}),
  // Optional: if provided, use these blocks instead of loading from DB
  // This allows using blocks with live measurements from the UI
  blocks: z.record(z.any()).optional(),
  edges: z.array(z.any()).optional(),
  loops: z.record(z.any()).optional(),
  parallels: z.record(z.any()).optional(),
})

/**
 * POST /api/workflows/[id]/autolayout
 * Apply autolayout to an existing workflow
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const startTime = Date.now()
  const { id: workflowId } = await params

  try {
    // Get the session
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized autolayout attempt for workflow ${workflowId}`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Parse request body
    const body = await request.json()
    const layoutOptions = AutoLayoutRequestSchema.parse(body)

    logger.info(`[${requestId}] Processing autolayout request for workflow ${workflowId}`, {
      userId,
    })

    // Fetch the workflow to check ownership/access
    const accessContext = await getWorkflowAccessContext(workflowId, userId)
    const workflowData = accessContext?.workflow

    if (!workflowData) {
      logger.warn(`[${requestId}] Workflow ${workflowId} not found for autolayout`)
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    // Check if user has permission to update this workflow
    const canUpdate =
      accessContext?.isOwner ||
      (workflowData.workspaceId
        ? accessContext?.workspacePermission === 'write' ||
          accessContext?.workspacePermission === 'admin'
        : false)

    if (!canUpdate) {
      logger.warn(
        `[${requestId}] User ${userId} denied permission to autolayout workflow ${workflowId}`
      )
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Use provided blocks/edges if available (with live measurements from UI),
    // otherwise load from database
    let currentWorkflowData: NormalizedWorkflowData | null

    if (layoutOptions.blocks && layoutOptions.edges) {
      logger.info(`[${requestId}] Using provided blocks with live measurements`)
      currentWorkflowData = {
        blocks: layoutOptions.blocks,
        edges: layoutOptions.edges,
        loops: layoutOptions.loops || {},
        parallels: layoutOptions.parallels || {},
        isFromNormalizedTables: false,
      }
    } else {
      logger.info(`[${requestId}] Loading blocks from database`)
      currentWorkflowData = await loadWorkflowFromNormalizedTables(workflowId)
    }

    if (!currentWorkflowData) {
      logger.error(`[${requestId}] Could not load workflow ${workflowId} for autolayout`)
      return NextResponse.json({ error: 'Could not load workflow data' }, { status: 500 })
    }

    const autoLayoutOptions = {
      horizontalSpacing: layoutOptions.spacing?.horizontal ?? DEFAULT_HORIZONTAL_SPACING,
      verticalSpacing: layoutOptions.spacing?.vertical ?? DEFAULT_VERTICAL_SPACING,
      padding: {
        x: layoutOptions.padding?.x ?? DEFAULT_LAYOUT_PADDING.x,
        y: layoutOptions.padding?.y ?? DEFAULT_LAYOUT_PADDING.y,
      },
      alignment: layoutOptions.alignment,
    }

    const layoutResult = applyAutoLayout(
      currentWorkflowData.blocks,
      currentWorkflowData.edges,
      autoLayoutOptions
    )

    if (!layoutResult.success || !layoutResult.blocks) {
      logger.error(`[${requestId}] Auto layout failed:`, {
        error: layoutResult.error,
      })
      return NextResponse.json(
        {
          error: 'Auto layout failed',
          details: layoutResult.error || 'Unknown error',
        },
        { status: 500 }
      )
    }

    const elapsed = Date.now() - startTime
    const blockCount = Object.keys(layoutResult.blocks).length

    logger.info(`[${requestId}] Autolayout completed successfully in ${elapsed}ms`, {
      blockCount,
      workflowId,
    })

    return NextResponse.json({
      success: true,
      message: `Autolayout applied successfully to ${blockCount} blocks`,
      data: {
        blockCount,
        elapsed: `${elapsed}ms`,
        layoutedBlocks: layoutResult.blocks,
      },
    })
  } catch (error) {
    const elapsed = Date.now() - startTime

    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid autolayout request data`, { errors: error.errors })
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    logger.error(`[${requestId}] Autolayout failed after ${elapsed}ms:`, error)
    return NextResponse.json(
      {
        error: 'Autolayout failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workflows/[id]/chat/status/route.ts

```typescript
import { db } from '@sim/db'
import { chat } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { createErrorResponse, createSuccessResponse } from '@/app/api/workflows/utils'

const logger = createLogger('ChatStatusAPI')

/**
 * GET endpoint to check if a workflow has an active chat deployment
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const requestId = generateRequestId()

  try {
    logger.debug(`[${requestId}] Checking chat deployment status for workflow: ${id}`)

    // Find any active chat deployments for this workflow
    const deploymentResults = await db
      .select({
        id: chat.id,
        identifier: chat.identifier,
        isActive: chat.isActive,
      })
      .from(chat)
      .where(eq(chat.workflowId, id))
      .limit(1)

    const isDeployed = deploymentResults.length > 0 && deploymentResults[0].isActive
    const deploymentInfo =
      deploymentResults.length > 0
        ? {
            id: deploymentResults[0].id,
            identifier: deploymentResults[0].identifier,
          }
        : null

    return createSuccessResponse({
      isDeployed,
      deployment: deploymentInfo,
    })
  } catch (error: any) {
    logger.error(`[${requestId}] Error checking chat deployment status:`, error)
    return createErrorResponse(error.message || 'Failed to check chat deployment status', 500)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workflows/[id]/deploy/route.ts
Signals: Next.js

```typescript
import { db, workflow, workflowDeploymentVersion } from '@sim/db'
import { and, desc, eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { deployWorkflow } from '@/lib/workflows/persistence/utils'
import { validateWorkflowPermissions } from '@/lib/workflows/utils'
import { createErrorResponse, createSuccessResponse } from '@/app/api/workflows/utils'

const logger = createLogger('WorkflowDeployAPI')

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    logger.debug(`[${requestId}] Fetching deployment info for workflow: ${id}`)

    const { error, workflow: workflowData } = await validateWorkflowPermissions(
      id,
      requestId,
      'read'
    )
    if (error) {
      return createErrorResponse(error.message, error.status)
    }

    if (!workflowData.isDeployed) {
      logger.info(`[${requestId}] Workflow is not deployed: ${id}`)
      return createSuccessResponse({
        isDeployed: false,
        deployedAt: null,
        apiKey: null,
        needsRedeployment: false,
      })
    }

    let needsRedeployment = false
    const [active] = await db
      .select({ state: workflowDeploymentVersion.state })
      .from(workflowDeploymentVersion)
      .where(
        and(
          eq(workflowDeploymentVersion.workflowId, id),
          eq(workflowDeploymentVersion.isActive, true)
        )
      )
      .orderBy(desc(workflowDeploymentVersion.createdAt))
      .limit(1)

    if (active?.state) {
      const { loadWorkflowFromNormalizedTables } = await import('@/lib/workflows/persistence/utils')
      const normalizedData = await loadWorkflowFromNormalizedTables(id)
      if (normalizedData) {
        const currentState = {
          blocks: normalizedData.blocks,
          edges: normalizedData.edges,
          loops: normalizedData.loops,
          parallels: normalizedData.parallels,
        }
        const { hasWorkflowChanged } = await import('@/lib/workflows/utils')
        needsRedeployment = hasWorkflowChanged(currentState as any, active.state as any)
      }
    }

    logger.info(`[${requestId}] Successfully retrieved deployment info: ${id}`)

    const responseApiKeyInfo = workflowData.workspaceId ? 'Workspace API keys' : 'Personal API keys'

    return createSuccessResponse({
      apiKey: responseApiKeyInfo,
      isDeployed: workflowData.isDeployed,
      deployedAt: workflowData.deployedAt,
      needsRedeployment,
    })
  } catch (error: any) {
    logger.error(`[${requestId}] Error fetching deployment info: ${id}`, error)
    return createErrorResponse(error.message || 'Failed to fetch deployment information', 500)
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    logger.debug(`[${requestId}] Deploying workflow: ${id}`)

    const {
      error,
      session,
      workflow: workflowData,
    } = await validateWorkflowPermissions(id, requestId, 'admin')
    if (error) {
      return createErrorResponse(error.message, error.status)
    }

    // Attribution: this route is UI-only; require session user as actor
    const actorUserId: string | null = session?.user?.id ?? null
    if (!actorUserId) {
      logger.warn(`[${requestId}] Unable to resolve actor user for workflow deployment: ${id}`)
      return createErrorResponse('Unable to determine deploying user', 400)
    }

    const deployResult = await deployWorkflow({
      workflowId: id,
      deployedBy: actorUserId,
      workflowName: workflowData!.name,
    })

    if (!deployResult.success) {
      return createErrorResponse(deployResult.error || 'Failed to deploy workflow', 500)
    }

    const deployedAt = deployResult.deployedAt!

    logger.info(`[${requestId}] Workflow deployed successfully: ${id}`)

    const responseApiKeyInfo = workflowData!.workspaceId
      ? 'Workspace API keys'
      : 'Personal API keys'

    return createSuccessResponse({
      apiKey: responseApiKeyInfo,
      isDeployed: true,
      deployedAt,
    })
  } catch (error: any) {
    logger.error(`[${requestId}] Error deploying workflow: ${id}`, {
      error: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause,
      fullError: error,
    })
    return createErrorResponse(error.message || 'Failed to deploy workflow', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    logger.debug(`[${requestId}] Undeploying workflow: ${id}`)

    const { error } = await validateWorkflowPermissions(id, requestId, 'admin')
    if (error) {
      return createErrorResponse(error.message, error.status)
    }

    await db.transaction(async (tx) => {
      await tx
        .update(workflowDeploymentVersion)
        .set({ isActive: false })
        .where(eq(workflowDeploymentVersion.workflowId, id))

      await tx
        .update(workflow)
        .set({ isDeployed: false, deployedAt: null })
        .where(eq(workflow.id, id))
    })

    logger.info(`[${requestId}] Workflow undeployed successfully: ${id}`)

    // Track workflow undeployment
    try {
      const { trackPlatformEvent } = await import('@/lib/core/telemetry')
      trackPlatformEvent('platform.workflow.undeployed', {
        'workflow.id': id,
      })
    } catch (_e) {
      // Silently fail
    }

    return createSuccessResponse({
      isDeployed: false,
      deployedAt: null,
      apiKey: null,
    })
  } catch (error: any) {
    logger.error(`[${requestId}] Error undeploying workflow: ${id}`, error)
    return createErrorResponse(error.message || 'Failed to undeploy workflow', 500)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workflows/[id]/deployed/route.ts
Signals: Next.js

```typescript
import { db, workflowDeploymentVersion } from '@sim/db'
import { and, desc, eq } from 'drizzle-orm'
import type { NextRequest, NextResponse } from 'next/server'
import { verifyInternalToken } from '@/lib/auth/internal'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { validateWorkflowPermissions } from '@/lib/workflows/utils'
import { createErrorResponse, createSuccessResponse } from '@/app/api/workflows/utils'

const logger = createLogger('WorkflowDeployedStateAPI')

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function addNoCacheHeaders(response: NextResponse): NextResponse {
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  return response
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    logger.debug(`[${requestId}] Fetching deployed state for workflow: ${id}`)

    const authHeader = request.headers.get('authorization')
    let isInternalCall = false

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const verification = await verifyInternalToken(token)
      isInternalCall = verification.valid
    }

    if (!isInternalCall) {
      const { error } = await validateWorkflowPermissions(id, requestId, 'read')
      if (error) {
        const response = createErrorResponse(error.message, error.status)
        return addNoCacheHeaders(response)
      }
    } else {
      logger.debug(`[${requestId}] Internal API call for deployed workflow: ${id}`)
    }

    const [active] = await db
      .select({ state: workflowDeploymentVersion.state })
      .from(workflowDeploymentVersion)
      .where(
        and(
          eq(workflowDeploymentVersion.workflowId, id),
          eq(workflowDeploymentVersion.isActive, true)
        )
      )
      .orderBy(desc(workflowDeploymentVersion.createdAt))
      .limit(1)

    const response = createSuccessResponse({
      deployedState: active?.state || null,
    })
    return addNoCacheHeaders(response)
  } catch (error: any) {
    logger.error(`[${requestId}] Error fetching deployed state: ${id}`, error)
    const response = createErrorResponse(error.message || 'Failed to fetch deployed state', 500)
    return addNoCacheHeaders(response)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workflows/[id]/deployments/route.ts
Signals: Next.js

```typescript
import { db, user, workflowDeploymentVersion } from '@sim/db'
import { desc, eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { validateWorkflowPermissions } from '@/lib/workflows/utils'
import { createErrorResponse, createSuccessResponse } from '@/app/api/workflows/utils'

const logger = createLogger('WorkflowDeploymentsListAPI')

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    const { error } = await validateWorkflowPermissions(id, requestId, 'read')
    if (error) {
      return createErrorResponse(error.message, error.status)
    }

    const versions = await db
      .select({
        id: workflowDeploymentVersion.id,
        version: workflowDeploymentVersion.version,
        name: workflowDeploymentVersion.name,
        isActive: workflowDeploymentVersion.isActive,
        createdAt: workflowDeploymentVersion.createdAt,
        createdBy: workflowDeploymentVersion.createdBy,
        deployedBy: user.name,
      })
      .from(workflowDeploymentVersion)
      .leftJoin(user, eq(workflowDeploymentVersion.createdBy, user.id))
      .where(eq(workflowDeploymentVersion.workflowId, id))
      .orderBy(desc(workflowDeploymentVersion.version))

    return createSuccessResponse({ versions })
  } catch (error: any) {
    logger.error(`[${requestId}] Error listing deployments for workflow: ${id}`, error)
    return createErrorResponse(error.message || 'Failed to list deployments', 500)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workflows/[id]/deployments/[version]/route.ts
Signals: Next.js, Zod

```typescript
import { db, workflowDeploymentVersion } from '@sim/db'
import { and, eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { validateWorkflowPermissions } from '@/lib/workflows/utils'
import { createErrorResponse, createSuccessResponse } from '@/app/api/workflows/utils'

const logger = createLogger('WorkflowDeploymentVersionAPI')

const patchBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name cannot be empty')
    .max(100, 'Name must be 100 characters or less'),
})

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; version: string }> }
) {
  const requestId = generateRequestId()
  const { id, version } = await params

  try {
    const { error } = await validateWorkflowPermissions(id, requestId, 'read')
    if (error) {
      return createErrorResponse(error.message, error.status)
    }

    const versionNum = Number(version)
    if (!Number.isFinite(versionNum)) {
      return createErrorResponse('Invalid version', 400)
    }

    const [row] = await db
      .select({ state: workflowDeploymentVersion.state })
      .from(workflowDeploymentVersion)
      .where(
        and(
          eq(workflowDeploymentVersion.workflowId, id),
          eq(workflowDeploymentVersion.version, versionNum)
        )
      )
      .limit(1)

    if (!row?.state) {
      return createErrorResponse('Deployment version not found', 404)
    }

    return createSuccessResponse({ deployedState: row.state })
  } catch (error: any) {
    logger.error(
      `[${requestId}] Error fetching deployment version ${version} for workflow ${id}`,
      error
    )
    return createErrorResponse(error.message || 'Failed to fetch deployment version', 500)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; version: string }> }
) {
  const requestId = generateRequestId()
  const { id, version } = await params

  try {
    const { error } = await validateWorkflowPermissions(id, requestId, 'write')
    if (error) {
      return createErrorResponse(error.message, error.status)
    }

    const versionNum = Number(version)
    if (!Number.isFinite(versionNum)) {
      return createErrorResponse('Invalid version', 400)
    }

    const body = await request.json()
    const validation = patchBodySchema.safeParse(body)

    if (!validation.success) {
      return createErrorResponse(validation.error.errors[0]?.message || 'Invalid request body', 400)
    }

    const { name } = validation.data

    const [updated] = await db
      .update(workflowDeploymentVersion)
      .set({ name })
      .where(
        and(
          eq(workflowDeploymentVersion.workflowId, id),
          eq(workflowDeploymentVersion.version, versionNum)
        )
      )
      .returning({ id: workflowDeploymentVersion.id, name: workflowDeploymentVersion.name })

    if (!updated) {
      return createErrorResponse('Deployment version not found', 404)
    }

    logger.info(
      `[${requestId}] Renamed deployment version ${version} for workflow ${id} to "${name}"`
    )

    return createSuccessResponse({ name: updated.name })
  } catch (error: any) {
    logger.error(
      `[${requestId}] Error renaming deployment version ${version} for workflow ${id}`,
      error
    )
    return createErrorResponse(error.message || 'Failed to rename deployment version', 500)
  }
}
```

--------------------------------------------------------------------------------

````
