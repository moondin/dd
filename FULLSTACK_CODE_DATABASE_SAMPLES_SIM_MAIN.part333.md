---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 333
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 333 of 933)

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
Location: sim-main/apps/sim/app/api/workspaces/[id]/route.ts
Signals: Next.js, Zod

```typescript
import { workflow } from '@sim/db/schema'
import { and, eq, inArray } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('WorkspaceByIdAPI')

import { db } from '@sim/db'
import { knowledgeBase, permissions, templates, workspace } from '@sim/db/schema'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

const patchWorkspaceSchema = z.object({
  name: z.string().trim().min(1).optional(),
  billedAccountUserId: z.string().optional(),
  allowPersonalApiKeys: z.boolean().optional(),
})

const deleteWorkspaceSchema = z.object({
  deleteTemplates: z.boolean().default(false),
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const workspaceId = id
  const url = new URL(request.url)
  const checkTemplates = url.searchParams.get('check-templates') === 'true'

  // Check if user has any access to this workspace
  const userPermission = await getUserEntityPermissions(session.user.id, 'workspace', workspaceId)
  if (!userPermission) {
    return NextResponse.json({ error: 'Workspace not found or access denied' }, { status: 404 })
  }

  // If checking for published templates before deletion
  if (checkTemplates) {
    try {
      // Get all workflows in this workspace
      const workspaceWorkflows = await db
        .select({ id: workflow.id })
        .from(workflow)
        .where(eq(workflow.workspaceId, workspaceId))

      if (workspaceWorkflows.length === 0) {
        return NextResponse.json({ hasPublishedTemplates: false, publishedTemplates: [] })
      }

      const workflowIds = workspaceWorkflows.map((w) => w.id)

      // Check for published templates that reference these workflows
      const publishedTemplates = await db
        .select({
          id: templates.id,
          name: templates.name,
          workflowId: templates.workflowId,
        })
        .from(templates)
        .where(inArray(templates.workflowId, workflowIds))

      return NextResponse.json({
        hasPublishedTemplates: publishedTemplates.length > 0,
        publishedTemplates,
        count: publishedTemplates.length,
      })
    } catch (error) {
      logger.error(`Error checking published templates for workspace ${workspaceId}:`, error)
      return NextResponse.json({ error: 'Failed to check published templates' }, { status: 500 })
    }
  }

  // Get workspace details
  const workspaceDetails = await db
    .select()
    .from(workspace)
    .where(eq(workspace.id, workspaceId))
    .then((rows) => rows[0])

  if (!workspaceDetails) {
    return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
  }

  return NextResponse.json({
    workspace: {
      ...workspaceDetails,
      permissions: userPermission,
    },
  })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const workspaceId = id

  // Check if user has admin permissions to update workspace
  const userPermission = await getUserEntityPermissions(session.user.id, 'workspace', workspaceId)
  if (userPermission !== 'admin') {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  try {
    const body = patchWorkspaceSchema.parse(await request.json())
    const { name, billedAccountUserId, allowPersonalApiKeys } = body

    if (
      name === undefined &&
      billedAccountUserId === undefined &&
      allowPersonalApiKeys === undefined
    ) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
    }

    const existingWorkspace = await db
      .select()
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .then((rows) => rows[0])

    if (!existingWorkspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {}

    if (name !== undefined) {
      updateData.name = name
    }

    if (allowPersonalApiKeys !== undefined) {
      updateData.allowPersonalApiKeys = Boolean(allowPersonalApiKeys)
    }

    if (billedAccountUserId !== undefined) {
      const candidateId = billedAccountUserId

      const isOwner = candidateId === existingWorkspace.ownerId

      let hasAdminAccess = isOwner

      if (!hasAdminAccess) {
        const adminPermission = await db
          .select({ id: permissions.id })
          .from(permissions)
          .where(
            and(
              eq(permissions.entityType, 'workspace'),
              eq(permissions.entityId, workspaceId),
              eq(permissions.userId, candidateId),
              eq(permissions.permissionType, 'admin')
            )
          )
          .limit(1)

        hasAdminAccess = adminPermission.length > 0
      }

      if (!hasAdminAccess) {
        return NextResponse.json(
          { error: 'Billed account must be a workspace admin' },
          { status: 400 }
        )
      }

      updateData.billedAccountUserId = candidateId
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 })
    }

    updateData.updatedAt = new Date()

    await db.update(workspace).set(updateData).where(eq(workspace.id, workspaceId))

    const updatedWorkspace = await db
      .select()
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .then((rows) => rows[0])

    return NextResponse.json({
      workspace: {
        ...updatedWorkspace,
        permissions: userPermission,
      },
    })
  } catch (error) {
    logger.error('Error updating workspace:', error)
    return NextResponse.json({ error: 'Failed to update workspace' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const workspaceId = id
  const body = deleteWorkspaceSchema.parse(await request.json().catch(() => ({})))
  const { deleteTemplates } = body // User's choice: false = keep templates (recommended), true = delete templates

  // Check if user has admin permissions to delete workspace
  const userPermission = await getUserEntityPermissions(session.user.id, 'workspace', workspaceId)
  if (userPermission !== 'admin') {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  }

  try {
    logger.info(
      `Deleting workspace ${workspaceId} for user ${session.user.id}, deleteTemplates: ${deleteTemplates}`
    )

    // Delete workspace and all related data in a transaction
    await db.transaction(async (tx) => {
      // Get all workflows in this workspace before deletion
      const workspaceWorkflows = await tx
        .select({ id: workflow.id })
        .from(workflow)
        .where(eq(workflow.workspaceId, workspaceId))

      if (workspaceWorkflows.length > 0) {
        const workflowIds = workspaceWorkflows.map((w) => w.id)

        // Handle templates based on user choice
        if (deleteTemplates) {
          // Delete published templates that reference these workflows
          await tx.delete(templates).where(inArray(templates.workflowId, workflowIds))
          logger.info(`Deleted templates for workflows in workspace ${workspaceId}`)
        } else {
          // Set workflowId to null for templates to create "orphaned" templates
          // This allows templates to remain without source workflows
          await tx
            .update(templates)
            .set({ workflowId: null })
            .where(inArray(templates.workflowId, workflowIds))
          logger.info(
            `Updated templates to orphaned status for workflows in workspace ${workspaceId}`
          )
        }
      }

      // Delete all workflows in the workspace - database cascade will handle all workflow-related data
      // The database cascade will handle deleting related workflow_blocks, workflow_edges, workflow_subflows,
      // workflow_logs, workflow_execution_snapshots, workflow_execution_logs, workflow_execution_trace_spans,
      // workflow_schedule, webhook, chat, and memory records
      await tx.delete(workflow).where(eq(workflow.workspaceId, workspaceId))

      // Clear workspace ID from knowledge bases instead of deleting them
      // This allows knowledge bases to become "unassigned" rather than being deleted
      await tx
        .update(knowledgeBase)
        .set({ workspaceId: null, updatedAt: new Date() })
        .where(eq(knowledgeBase.workspaceId, workspaceId))

      // Delete all permissions associated with this workspace
      await tx
        .delete(permissions)
        .where(and(eq(permissions.entityType, 'workspace'), eq(permissions.entityId, workspaceId)))

      // Delete the workspace itself
      await tx.delete(workspace).where(eq(workspace.id, workspaceId))

      logger.info(`Successfully deleted workspace ${workspaceId} and all related data`)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error(`Error deleting workspace ${workspaceId}:`, error)
    return NextResponse.json({ error: 'Failed to delete workspace' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Reuse the PATCH handler implementation for PUT requests
  return PATCH(request, { params })
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workspaces/[id]/api-keys/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { apiKey, workspace } from '@sim/db/schema'
import { and, eq, inArray } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createApiKey, getApiKeyDisplayFormat } from '@/lib/api-key/auth'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('WorkspaceApiKeysAPI')

const CreateKeySchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
})

const DeleteKeysSchema = z.object({
  keys: z.array(z.string()).min(1),
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const workspaceId = (await params).id

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized workspace API keys access attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const ws = await db.select().from(workspace).where(eq(workspace.id, workspaceId)).limit(1)
    if (!ws.length) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    const permission = await getUserEntityPermissions(userId, 'workspace', workspaceId)
    if (!permission) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const workspaceKeys = await db
      .select({
        id: apiKey.id,
        name: apiKey.name,
        key: apiKey.key,
        createdAt: apiKey.createdAt,
        lastUsed: apiKey.lastUsed,
        expiresAt: apiKey.expiresAt,
        createdBy: apiKey.createdBy,
      })
      .from(apiKey)
      .where(and(eq(apiKey.workspaceId, workspaceId), eq(apiKey.type, 'workspace')))
      .orderBy(apiKey.createdAt)

    const formattedWorkspaceKeys = await Promise.all(
      workspaceKeys.map(async (key) => {
        const displayFormat = await getApiKeyDisplayFormat(key.key)
        return {
          ...key,
          key: key.key,
          displayKey: displayFormat,
        }
      })
    )

    return NextResponse.json({
      keys: formattedWorkspaceKeys,
    })
  } catch (error: unknown) {
    logger.error(`[${requestId}] Workspace API keys GET error`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load API keys' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const workspaceId = (await params).id

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized workspace API key creation attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const permission = await getUserEntityPermissions(userId, 'workspace', workspaceId)
    if (permission !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const workspaceRows = await db
      .select({ billedAccountUserId: workspace.billedAccountUserId })
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .limit(1)

    if (!workspaceRows.length) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    if (workspaceRows[0].billedAccountUserId !== userId) {
      return NextResponse.json(
        { error: 'Only the workspace billing account can create workspace API keys' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name } = CreateKeySchema.parse(body)

    const existingKey = await db
      .select()
      .from(apiKey)
      .where(
        and(
          eq(apiKey.workspaceId, workspaceId),
          eq(apiKey.name, name),
          eq(apiKey.type, 'workspace')
        )
      )
      .limit(1)

    if (existingKey.length > 0) {
      return NextResponse.json(
        {
          error: `A workspace API key named "${name}" already exists. Please choose a different name.`,
        },
        { status: 409 }
      )
    }

    const { key: plainKey, encryptedKey } = await createApiKey(true)

    if (!encryptedKey) {
      throw new Error('Failed to encrypt API key for storage')
    }

    const [newKey] = await db
      .insert(apiKey)
      .values({
        id: nanoid(),
        workspaceId,
        userId: userId,
        createdBy: userId,
        name,
        key: encryptedKey,
        type: 'workspace',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({
        id: apiKey.id,
        name: apiKey.name,
        createdAt: apiKey.createdAt,
      })

    logger.info(`[${requestId}] Created workspace API key: ${name} in workspace ${workspaceId}`)

    return NextResponse.json({
      key: {
        ...newKey,
        key: plainKey,
      },
    })
  } catch (error: unknown) {
    logger.error(`[${requestId}] Workspace API key POST error`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create workspace API key' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = generateRequestId()
  const workspaceId = (await params).id

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized workspace API key deletion attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const permission = await getUserEntityPermissions(userId, 'workspace', workspaceId)
    if (permission !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const workspaceRows = await db
      .select({ billedAccountUserId: workspace.billedAccountUserId })
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .limit(1)

    if (!workspaceRows.length) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    if (workspaceRows[0].billedAccountUserId !== userId) {
      return NextResponse.json(
        { error: 'Only the workspace billing account can delete workspace API keys' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { keys } = DeleteKeysSchema.parse(body)

    const deletedCount = await db
      .delete(apiKey)
      .where(
        and(
          eq(apiKey.workspaceId, workspaceId),
          eq(apiKey.type, 'workspace'),
          inArray(apiKey.id, keys)
        )
      )

    logger.info(
      `[${requestId}] Deleted ${deletedCount} workspace API keys from workspace ${workspaceId}`
    )
    return NextResponse.json({ success: true, deletedCount })
  } catch (error: unknown) {
    logger.error(`[${requestId}] Workspace API key DELETE error`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete workspace API keys' },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workspaces/[id]/api-keys/[keyId]/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { apiKey } from '@sim/db/schema'
import { and, eq, not } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('WorkspaceApiKeyAPI')

const UpdateKeySchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; keyId: string }> }
) {
  const requestId = generateRequestId()
  const { id: workspaceId, keyId } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized workspace API key update attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const permission = await getUserEntityPermissions(userId, 'workspace', workspaceId)
    if (!permission || (permission !== 'admin' && permission !== 'write')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { name } = UpdateKeySchema.parse(body)

    const existingKey = await db
      .select()
      .from(apiKey)
      .where(
        and(eq(apiKey.workspaceId, workspaceId), eq(apiKey.id, keyId), eq(apiKey.type, 'workspace'))
      )
      .limit(1)

    if (existingKey.length === 0) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 })
    }

    const conflictingKey = await db
      .select()
      .from(apiKey)
      .where(
        and(
          eq(apiKey.workspaceId, workspaceId),
          eq(apiKey.name, name),
          eq(apiKey.type, 'workspace'),
          not(eq(apiKey.id, keyId))
        )
      )
      .limit(1)

    if (conflictingKey.length > 0) {
      return NextResponse.json(
        { error: 'A workspace API key with this name already exists' },
        { status: 400 }
      )
    }

    const [updatedKey] = await db
      .update(apiKey)
      .set({
        name,
        updatedAt: new Date(),
      })
      .where(
        and(eq(apiKey.workspaceId, workspaceId), eq(apiKey.id, keyId), eq(apiKey.type, 'workspace'))
      )
      .returning({
        id: apiKey.id,
        name: apiKey.name,
        createdAt: apiKey.createdAt,
        updatedAt: apiKey.updatedAt,
      })

    logger.info(`[${requestId}] Updated workspace API key: ${keyId} in workspace ${workspaceId}`)
    return NextResponse.json({ key: updatedKey })
  } catch (error: unknown) {
    logger.error(`[${requestId}] Workspace API key PUT error`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update workspace API key' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; keyId: string }> }
) {
  const requestId = generateRequestId()
  const { id: workspaceId, keyId } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized workspace API key deletion attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const permission = await getUserEntityPermissions(userId, 'workspace', workspaceId)
    if (!permission || (permission !== 'admin' && permission !== 'write')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const deletedRows = await db
      .delete(apiKey)
      .where(
        and(eq(apiKey.workspaceId, workspaceId), eq(apiKey.id, keyId), eq(apiKey.type, 'workspace'))
      )
      .returning({ id: apiKey.id })

    if (deletedRows.length === 0) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 })
    }

    logger.info(`[${requestId}] Deleted workspace API key: ${keyId} from workspace ${workspaceId}`)
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    logger.error(`[${requestId}] Workspace API key DELETE error`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete workspace API key' },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workspaces/[id]/duplicate/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { duplicateWorkspace } from '@/lib/workspaces/duplicate'

const logger = createLogger('WorkspaceDuplicateAPI')

const DuplicateRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

// POST /api/workspaces/[id]/duplicate - Duplicate a workspace with all its workflows
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: sourceWorkspaceId } = await params
  const requestId = generateRequestId()
  const startTime = Date.now()

  const session = await getSession()
  if (!session?.user?.id) {
    logger.warn(
      `[${requestId}] Unauthorized workspace duplication attempt for ${sourceWorkspaceId}`
    )
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name } = DuplicateRequestSchema.parse(body)

    logger.info(
      `[${requestId}] Duplicating workspace ${sourceWorkspaceId} for user ${session.user.id}`
    )

    const result = await duplicateWorkspace({
      sourceWorkspaceId,
      userId: session.user.id,
      name,
      requestId,
    })

    const elapsed = Date.now() - startTime
    logger.info(
      `[${requestId}] Successfully duplicated workspace ${sourceWorkspaceId} to ${result.id} in ${elapsed}ms`
    )

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Source workspace not found') {
        logger.warn(`[${requestId}] Source workspace ${sourceWorkspaceId} not found`)
        return NextResponse.json({ error: 'Source workspace not found' }, { status: 404 })
      }

      if (error.message === 'Source workspace not found or access denied') {
        logger.warn(
          `[${requestId}] User ${session.user.id} denied access to source workspace ${sourceWorkspaceId}`
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
      `[${requestId}] Error duplicating workspace ${sourceWorkspaceId} after ${elapsed}ms:`,
      error
    )
    return NextResponse.json({ error: 'Failed to duplicate workspace' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workspaces/[id]/environment/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { environment, workspace, workspaceEnvironment } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { decryptSecret, encryptSecret } from '@/lib/core/security/encryption'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('WorkspaceEnvironmentAPI')

const UpsertSchema = z.object({
  variables: z.record(z.string()),
})

const DeleteSchema = z.object({
  keys: z.array(z.string()).min(1),
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const workspaceId = (await params).id

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized workspace env access attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Validate workspace exists
    const ws = await db.select().from(workspace).where(eq(workspace.id, workspaceId)).limit(1)
    if (!ws.length) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    // Require any permission to read
    const permission = await getUserEntityPermissions(userId, 'workspace', workspaceId)
    if (!permission) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Workspace env (encrypted)
    const wsEnvRow = await db
      .select()
      .from(workspaceEnvironment)
      .where(eq(workspaceEnvironment.workspaceId, workspaceId))
      .limit(1)

    const wsEncrypted: Record<string, string> = (wsEnvRow[0]?.variables as any) || {}

    // Personal env (encrypted)
    const personalRow = await db
      .select()
      .from(environment)
      .where(eq(environment.userId, userId))
      .limit(1)

    const personalEncrypted: Record<string, string> = (personalRow[0]?.variables as any) || {}

    // Decrypt both for UI
    const decryptAll = async (src: Record<string, string>) => {
      const out: Record<string, string> = {}
      for (const [k, v] of Object.entries(src)) {
        try {
          const { decrypted } = await decryptSecret(v)
          out[k] = decrypted
        } catch {
          out[k] = ''
        }
      }
      return out
    }

    const [workspaceDecrypted, personalDecrypted] = await Promise.all([
      decryptAll(wsEncrypted),
      decryptAll(personalEncrypted),
    ])

    const conflicts = Object.keys(personalDecrypted).filter((k) => k in workspaceDecrypted)

    return NextResponse.json(
      {
        data: {
          workspace: workspaceDecrypted,
          personal: personalDecrypted,
          conflicts,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    logger.error(`[${requestId}] Workspace env GET error`, error)
    return NextResponse.json(
      { error: error.message || 'Failed to load environment' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const workspaceId = (await params).id

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized workspace env update attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const permission = await getUserEntityPermissions(userId, 'workspace', workspaceId)
    if (!permission || (permission !== 'admin' && permission !== 'write')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { variables } = UpsertSchema.parse(body)

    // Read existing encrypted ws vars
    const existingRows = await db
      .select()
      .from(workspaceEnvironment)
      .where(eq(workspaceEnvironment.workspaceId, workspaceId))
      .limit(1)

    const existingEncrypted: Record<string, string> = (existingRows[0]?.variables as any) || {}

    // Encrypt incoming
    const encryptedIncoming = await Promise.all(
      Object.entries(variables).map(async ([key, value]) => {
        const { encrypted } = await encryptSecret(value)
        return [key, encrypted] as const
      })
    ).then((entries) => Object.fromEntries(entries))

    const merged = { ...existingEncrypted, ...encryptedIncoming }

    // Upsert by unique workspace_id
    await db
      .insert(workspaceEnvironment)
      .values({
        id: crypto.randomUUID(),
        workspaceId,
        variables: merged,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [workspaceEnvironment.workspaceId],
        set: { variables: merged, updatedAt: new Date() },
      })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    logger.error(`[${requestId}] Workspace env PUT error`, error)
    return NextResponse.json(
      { error: error.message || 'Failed to update environment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = generateRequestId()
  const workspaceId = (await params).id

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized workspace env delete attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const permission = await getUserEntityPermissions(userId, 'workspace', workspaceId)
    if (!permission || (permission !== 'admin' && permission !== 'write')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { keys } = DeleteSchema.parse(body)

    const wsRows = await db
      .select()
      .from(workspaceEnvironment)
      .where(eq(workspaceEnvironment.workspaceId, workspaceId))
      .limit(1)

    const current: Record<string, string> = (wsRows[0]?.variables as any) || {}
    let changed = false
    for (const k of keys) {
      if (k in current) {
        delete current[k]
        changed = true
      }
    }

    if (!changed) {
      return NextResponse.json({ success: true })
    }

    await db
      .insert(workspaceEnvironment)
      .values({
        id: wsRows[0]?.id || crypto.randomUUID(),
        workspaceId,
        variables: current,
        createdAt: wsRows[0]?.createdAt || new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [workspaceEnvironment.workspaceId],
        set: { variables: current, updatedAt: new Date() },
      })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    logger.error(`[${requestId}] Workspace env DELETE error`, error)
    return NextResponse.json(
      { error: error.message || 'Failed to remove environment keys' },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workspaces/[id]/files/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { listWorkspaceFiles, uploadWorkspaceFile } from '@/lib/uploads/contexts/workspace'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'
import { verifyWorkspaceMembership } from '@/app/api/workflows/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('WorkspaceFilesAPI')

/**
 * GET /api/workspaces/[id]/files
 * List all files for a workspace (requires read permission)
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id: workspaceId } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check workspace permissions (requires read)
    const userPermission = await verifyWorkspaceMembership(session.user.id, workspaceId)
    if (!userPermission) {
      logger.warn(
        `[${requestId}] User ${session.user.id} lacks permission for workspace ${workspaceId}`
      )
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const files = await listWorkspaceFiles(workspaceId)

    logger.info(`[${requestId}] Listed ${files.length} files for workspace ${workspaceId}`)

    return NextResponse.json({
      success: true,
      files,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error listing workspace files:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list files',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/workspaces/[id]/files
 * Upload a new file to workspace storage (requires write permission)
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id: workspaceId } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check workspace permissions (requires write)
    const userPermission = await getUserEntityPermissions(session.user.id, 'workspace', workspaceId)
    if (userPermission !== 'admin' && userPermission !== 'write') {
      logger.warn(
        `[${requestId}] User ${session.user.id} lacks write permission for workspace ${workspaceId}`
      )
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds 100MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB)` },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const userFile = await uploadWorkspaceFile(
      workspaceId,
      session.user.id,
      buffer,
      file.name,
      file.type || 'application/octet-stream'
    )

    logger.info(`[${requestId}] Uploaded workspace file: ${file.name}`)

    return NextResponse.json({
      success: true,
      file: userFile,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error uploading workspace file:`, error)

    // Check if it's a duplicate file error
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload file'
    const isDuplicate = errorMessage.includes('already exists')

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        isDuplicate,
      },
      { status: isDuplicate ? 409 : 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workspaces/[id]/files/[fileId]/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { deleteWorkspaceFile } from '@/lib/uploads/contexts/workspace'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('WorkspaceFileAPI')

/**
 * DELETE /api/workspaces/[id]/files/[fileId]
 * Delete a workspace file (requires write permission)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  const requestId = generateRequestId()
  const { id: workspaceId, fileId } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check workspace permissions (requires write)
    const userPermission = await getUserEntityPermissions(session.user.id, 'workspace', workspaceId)
    if (userPermission !== 'admin' && userPermission !== 'write') {
      logger.warn(
        `[${requestId}] User ${session.user.id} lacks write permission for workspace ${workspaceId}`
      )
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    await deleteWorkspaceFile(workspaceId, fileId)

    logger.info(`[${requestId}] Deleted workspace file: ${fileId}`)

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error deleting workspace file:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete file',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

````
