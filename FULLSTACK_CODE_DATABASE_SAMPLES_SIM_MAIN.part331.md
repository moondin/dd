---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 331
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 331 of 933)

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

---[FILE: route.test.ts]---
Location: sim-main/apps/sim/app/api/workflows/[id]/variables/route.test.ts
Signals: Next.js

```typescript
/**
 * Tests for workflow variables API route
 * Tests the optimized permissions and caching system
 *
 * @vitest-environment node
 */

import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createMockDatabase,
  mockAuth,
  mockCryptoUuid,
  mockUser,
  setupCommonApiMocks,
} from '@/app/api/__test-utils__/utils'

describe('Workflow Variables API Route', () => {
  let authMocks: ReturnType<typeof mockAuth>
  let databaseMocks: ReturnType<typeof createMockDatabase>
  const mockGetWorkflowAccessContext = vi.fn()

  beforeEach(() => {
    vi.resetModules()
    setupCommonApiMocks()
    mockCryptoUuid('mock-request-id-12345678')
    authMocks = mockAuth(mockUser)
    mockGetWorkflowAccessContext.mockReset()

    vi.doMock('@/lib/workflows/utils', () => ({
      getWorkflowAccessContext: mockGetWorkflowAccessContext,
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/workflows/[id]/variables', () => {
    it('should return 401 when user is not authenticated', async () => {
      authMocks.setUnauthenticated()

      const req = new NextRequest('http://localhost:3000/api/workflows/workflow-123/variables')
      const params = Promise.resolve({ id: 'workflow-123' })

      const { GET } = await import('@/app/api/workflows/[id]/variables/route')
      const response = await GET(req, { params })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 404 when workflow does not exist', async () => {
      authMocks.setAuthenticated({ id: 'user-123', email: 'test@example.com' })
      mockGetWorkflowAccessContext.mockResolvedValueOnce(null)

      const req = new NextRequest('http://localhost:3000/api/workflows/nonexistent/variables')
      const params = Promise.resolve({ id: 'nonexistent' })

      const { GET } = await import('@/app/api/workflows/[id]/variables/route')
      const response = await GET(req, { params })

      expect(response.status).toBe(404)
      const data = await response.json()
      expect(data.error).toBe('Workflow not found')
    })

    it('should allow access when user owns the workflow', async () => {
      const mockWorkflow = {
        id: 'workflow-123',
        userId: 'user-123',
        workspaceId: null,
        variables: {
          'var-1': { id: 'var-1', name: 'test', type: 'string', value: 'hello' },
        },
      }

      authMocks.setAuthenticated({ id: 'user-123', email: 'test@example.com' })
      mockGetWorkflowAccessContext.mockResolvedValueOnce({
        workflow: mockWorkflow,
        workspaceOwnerId: null,
        workspacePermission: null,
        isOwner: true,
        isWorkspaceOwner: false,
      })

      const req = new NextRequest('http://localhost:3000/api/workflows/workflow-123/variables')
      const params = Promise.resolve({ id: 'workflow-123' })

      const { GET } = await import('@/app/api/workflows/[id]/variables/route')
      const response = await GET(req, { params })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.data).toEqual(mockWorkflow.variables)
    })

    it('should allow access when user has workspace permissions', async () => {
      const mockWorkflow = {
        id: 'workflow-123',
        userId: 'other-user',
        workspaceId: 'workspace-456',
        variables: {
          'var-1': { id: 'var-1', name: 'test', type: 'string', value: 'hello' },
        },
      }

      authMocks.setAuthenticated({ id: 'user-123', email: 'test@example.com' })
      mockGetWorkflowAccessContext.mockResolvedValueOnce({
        workflow: mockWorkflow,
        workspaceOwnerId: 'workspace-owner',
        workspacePermission: 'read',
        isOwner: false,
        isWorkspaceOwner: false,
      })

      const req = new NextRequest('http://localhost:3000/api/workflows/workflow-123/variables')
      const params = Promise.resolve({ id: 'workflow-123' })

      const { GET } = await import('@/app/api/workflows/[id]/variables/route')
      const response = await GET(req, { params })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.data).toEqual(mockWorkflow.variables)
    })

    it('should deny access when user has no workspace permissions', async () => {
      const mockWorkflow = {
        id: 'workflow-123',
        userId: 'other-user',
        workspaceId: 'workspace-456',
        variables: {},
      }

      authMocks.setAuthenticated({ id: 'user-123', email: 'test@example.com' })
      mockGetWorkflowAccessContext.mockResolvedValueOnce({
        workflow: mockWorkflow,
        workspaceOwnerId: 'workspace-owner',
        workspacePermission: null,
        isOwner: false,
        isWorkspaceOwner: false,
      })

      const req = new NextRequest('http://localhost:3000/api/workflows/workflow-123/variables')
      const params = Promise.resolve({ id: 'workflow-123' })

      const { GET } = await import('@/app/api/workflows/[id]/variables/route')
      const response = await GET(req, { params })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe('Unauthorized')
    })

    it.concurrent('should include proper cache headers', async () => {
      const mockWorkflow = {
        id: 'workflow-123',
        userId: 'user-123',
        workspaceId: null,
        variables: {
          'var-1': { id: 'var-1', name: 'test', type: 'string', value: 'hello' },
        },
      }

      authMocks.setAuthenticated({ id: 'user-123', email: 'test@example.com' })
      mockGetWorkflowAccessContext.mockResolvedValueOnce({
        workflow: mockWorkflow,
        workspaceOwnerId: null,
        workspacePermission: null,
        isOwner: true,
        isWorkspaceOwner: false,
      })

      const req = new NextRequest('http://localhost:3000/api/workflows/workflow-123/variables')
      const params = Promise.resolve({ id: 'workflow-123' })

      const { GET } = await import('@/app/api/workflows/[id]/variables/route')
      const response = await GET(req, { params })

      expect(response.status).toBe(200)
      expect(response.headers.get('Cache-Control')).toBe('max-age=30, stale-while-revalidate=300')
      expect(response.headers.get('ETag')).toMatch(/^"variables-workflow-123-\d+"$/)
    })
  })

  describe('POST /api/workflows/[id]/variables', () => {
    it('should allow owner to update variables', async () => {
      const mockWorkflow = {
        id: 'workflow-123',
        userId: 'user-123',
        workspaceId: null,
        variables: {},
      }

      authMocks.setAuthenticated({ id: 'user-123', email: 'test@example.com' })
      mockGetWorkflowAccessContext.mockResolvedValueOnce({
        workflow: mockWorkflow,
        workspaceOwnerId: null,
        workspacePermission: null,
        isOwner: true,
        isWorkspaceOwner: false,
      })

      databaseMocks = createMockDatabase({
        update: { results: [{}] },
      })

      const variables = [
        { id: 'var-1', workflowId: 'workflow-123', name: 'test', type: 'string', value: 'hello' },
      ]

      const req = new NextRequest('http://localhost:3000/api/workflows/workflow-123/variables', {
        method: 'POST',
        body: JSON.stringify({ variables }),
      })
      const params = Promise.resolve({ id: 'workflow-123' })

      const { POST } = await import('@/app/api/workflows/[id]/variables/route')
      const response = await POST(req, { params })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    })

    it('should deny access for users without permissions', async () => {
      const mockWorkflow = {
        id: 'workflow-123',
        userId: 'other-user',
        workspaceId: 'workspace-456',
        variables: {},
      }

      authMocks.setAuthenticated({ id: 'user-123', email: 'test@example.com' })
      mockGetWorkflowAccessContext.mockResolvedValueOnce({
        workflow: mockWorkflow,
        workspaceOwnerId: 'workspace-owner',
        workspacePermission: null,
        isOwner: false,
        isWorkspaceOwner: false,
      })

      const variables = [
        { id: 'var-1', workflowId: 'workflow-123', name: 'test', type: 'string', value: 'hello' },
      ]

      const req = new NextRequest('http://localhost:3000/api/workflows/workflow-123/variables', {
        method: 'POST',
        body: JSON.stringify({ variables }),
      })
      const params = Promise.resolve({ id: 'workflow-123' })

      const { POST } = await import('@/app/api/workflows/[id]/variables/route')
      const response = await POST(req, { params })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe('Unauthorized')
    })

    it.concurrent('should validate request data schema', async () => {
      const mockWorkflow = {
        id: 'workflow-123',
        userId: 'user-123',
        workspaceId: null,
        variables: {},
      }

      authMocks.setAuthenticated({ id: 'user-123', email: 'test@example.com' })
      mockGetWorkflowAccessContext.mockResolvedValueOnce({
        workflow: mockWorkflow,
        workspaceOwnerId: null,
        workspacePermission: null,
        isOwner: true,
        isWorkspaceOwner: false,
      })

      // Invalid data - missing required fields
      const invalidData = { variables: [{ name: 'test' }] }

      const req = new NextRequest('http://localhost:3000/api/workflows/workflow-123/variables', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      })
      const params = Promise.resolve({ id: 'workflow-123' })

      const { POST } = await import('@/app/api/workflows/[id]/variables/route')
      const response = await POST(req, { params })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe('Invalid request data')
    })
  })

  describe('Error handling', () => {
    it.concurrent('should handle database errors gracefully', async () => {
      authMocks.setAuthenticated({ id: 'user-123', email: 'test@example.com' })
      mockGetWorkflowAccessContext.mockRejectedValueOnce(new Error('Database connection failed'))

      const req = new NextRequest('http://localhost:3000/api/workflows/workflow-123/variables')
      const params = Promise.resolve({ id: 'workflow-123' })

      const { GET } = await import('@/app/api/workflows/[id]/variables/route')
      const response = await GET(req, { params })

      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data.error).toBe('Database connection failed')
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workflows/[id]/variables/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { workflow } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { getWorkflowAccessContext } from '@/lib/workflows/utils'
import type { Variable } from '@/stores/panel/variables/types'

const logger = createLogger('WorkflowVariablesAPI')

const VariablesSchema = z.object({
  variables: z.array(
    z.object({
      id: z.string(),
      workflowId: z.string(),
      name: z.string(),
      type: z.enum(['string', 'number', 'boolean', 'object', 'array', 'plain']),
      value: z.union([z.string(), z.number(), z.boolean(), z.record(z.any()), z.array(z.any())]),
    })
  ),
})

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const workflowId = (await params).id

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized workflow variables update attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the workflow record
    const accessContext = await getWorkflowAccessContext(workflowId, session.user.id)
    const workflowData = accessContext?.workflow

    if (!workflowData) {
      logger.warn(`[${requestId}] Workflow not found: ${workflowId}`)
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }
    const workspaceId = workflowData.workspaceId

    // Check authorization - either the user owns the workflow or has workspace permissions
    const isAuthorized =
      accessContext?.isOwner || (workspaceId ? accessContext?.workspacePermission !== null : false)

    if (!isAuthorized) {
      logger.warn(
        `[${requestId}] User ${session.user.id} attempted to update variables for workflow ${workflowId} without permission`
      )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    try {
      const { variables } = VariablesSchema.parse(body)

      // Format variables for storage
      const variablesRecord: Record<string, Variable> = {}
      variables.forEach((variable) => {
        variablesRecord[variable.id] = variable
      })

      // Replace variables completely with the incoming ones
      // The frontend is the source of truth for what variables should exist
      const updatedVariables = variablesRecord

      // Update workflow with variables
      await db
        .update(workflow)
        .set({
          variables: updatedVariables,
          updatedAt: new Date(),
        })
        .where(eq(workflow.id, workflowId))

      return NextResponse.json({ success: true })
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        logger.warn(`[${requestId}] Invalid workflow variables data`, {
          errors: validationError.errors,
        })
        return NextResponse.json(
          { error: 'Invalid request data', details: validationError.errors },
          { status: 400 }
        )
      }
      throw validationError
    }
  } catch (error) {
    logger.error(`[${requestId}] Error updating workflow variables`, error)
    return NextResponse.json({ error: 'Failed to update workflow variables' }, { status: 500 })
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const workflowId = (await params).id

  try {
    // Get the session directly in the API route
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized workflow variables access attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the workflow record
    const accessContext = await getWorkflowAccessContext(workflowId, session.user.id)
    const workflowData = accessContext?.workflow

    if (!workflowData) {
      logger.warn(`[${requestId}] Workflow not found: ${workflowId}`)
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }
    const workspaceId = workflowData.workspaceId

    // Check authorization - either the user owns the workflow or has workspace permissions
    const isAuthorized =
      accessContext?.isOwner || (workspaceId ? accessContext?.workspacePermission !== null : false)

    if (!isAuthorized) {
      logger.warn(
        `[${requestId}] User ${session.user.id} attempted to access variables for workflow ${workflowId} without permission`
      )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return variables if they exist
    const variables = (workflowData.variables as Record<string, Variable>) || {}

    // Add cache headers to prevent frequent reloading
    const variableHash = JSON.stringify(variables).length
    const headers = new Headers({
      'Cache-Control': 'max-age=30, stale-while-revalidate=300', // Cache for 30 seconds, stale for 5 min
      ETag: `"variables-${workflowId}-${variableHash}"`,
    })

    return NextResponse.json(
      { data: variables },
      {
        status: 200,
        headers,
      }
    )
  } catch (error: any) {
    logger.error(`[${requestId}] Workflow variables fetch error`, error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workspaces/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { permissions, workflow, workspace } from '@sim/db/schema'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'
import { buildDefaultWorkflowArtifacts } from '@/lib/workflows/defaults'
import { saveWorkflowToNormalizedTables } from '@/lib/workflows/persistence/utils'

const logger = createLogger('Workspaces')

const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
})

// Get all workspaces for the current user
export async function GET() {
  const session = await getSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get all workspaces where the user has permissions
  const userWorkspaces = await db
    .select({
      workspace: workspace,
      permissionType: permissions.permissionType,
    })
    .from(permissions)
    .innerJoin(workspace, eq(permissions.entityId, workspace.id))
    .where(and(eq(permissions.userId, session.user.id), eq(permissions.entityType, 'workspace')))
    .orderBy(desc(workspace.createdAt))

  if (userWorkspaces.length === 0) {
    // Create a default workspace for the user
    const defaultWorkspace = await createDefaultWorkspace(session.user.id, session.user.name)

    // Migrate existing workflows to the default workspace
    await migrateExistingWorkflows(session.user.id, defaultWorkspace.id)

    return NextResponse.json({ workspaces: [defaultWorkspace] })
  }

  // If user has workspaces but might have orphaned workflows, migrate them
  await ensureWorkflowsHaveWorkspace(session.user.id, userWorkspaces[0].workspace.id)

  // Format the response with permission information
  const workspacesWithPermissions = userWorkspaces.map(
    ({ workspace: workspaceDetails, permissionType }) => ({
      ...workspaceDetails,
      role: permissionType === 'admin' ? 'owner' : 'member', // Map admin to owner for compatibility
      permissions: permissionType,
    })
  )

  return NextResponse.json({ workspaces: workspacesWithPermissions })
}

// POST /api/workspaces - Create a new workspace
export async function POST(req: Request) {
  const session = await getSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name } = createWorkspaceSchema.parse(await req.json())

    const newWorkspace = await createWorkspace(session.user.id, name)

    return NextResponse.json({ workspace: newWorkspace })
  } catch (error) {
    logger.error('Error creating workspace:', error)
    return NextResponse.json({ error: 'Failed to create workspace' }, { status: 500 })
  }
}

// Helper function to create a default workspace
async function createDefaultWorkspace(userId: string, userName?: string | null) {
  // Extract first name only by splitting on spaces and taking the first part
  const firstName = userName?.split(' ')[0] || null
  const workspaceName = firstName ? `${firstName}'s Workspace` : 'My Workspace'
  return createWorkspace(userId, workspaceName)
}

// Helper function to create a workspace
async function createWorkspace(userId: string, name: string) {
  const workspaceId = crypto.randomUUID()
  const workflowId = crypto.randomUUID()
  const now = new Date()

  // Create the workspace and initial workflow in a transaction
  try {
    await db.transaction(async (tx) => {
      // Create the workspace
      await tx.insert(workspace).values({
        id: workspaceId,
        name,
        ownerId: userId,
        billedAccountUserId: userId,
        allowPersonalApiKeys: true,
        createdAt: now,
        updatedAt: now,
      })

      // Create admin permissions for the workspace owner
      await tx.insert(permissions).values({
        id: crypto.randomUUID(),
        entityType: 'workspace' as const,
        entityId: workspaceId,
        userId: userId,
        permissionType: 'admin' as const,
        createdAt: now,
        updatedAt: now,
      })

      // Create initial workflow for the workspace (empty canvas)
      // Create the workflow
      await tx.insert(workflow).values({
        id: workflowId,
        userId,
        workspaceId,
        folderId: null,
        name: 'default-agent',
        description: 'Your first workflow - start building here!',
        color: '#3972F6',
        lastSynced: now,
        createdAt: now,
        updatedAt: now,
        isDeployed: false,
        runCount: 0,
        variables: {},
      })

      // No blocks are inserted - empty canvas

      logger.info(
        `Created workspace ${workspaceId} with initial workflow ${workflowId} for user ${userId}`
      )
    })

    const { workflowState } = buildDefaultWorkflowArtifacts()
    const seedResult = await saveWorkflowToNormalizedTables(workflowId, workflowState)

    if (!seedResult.success) {
      throw new Error(seedResult.error || 'Failed to seed default workflow state')
    }
  } catch (error) {
    logger.error(`Failed to create workspace ${workspaceId} with initial workflow:`, error)
    throw error
  }

  // Return the workspace data directly instead of querying again
  return {
    id: workspaceId,
    name,
    ownerId: userId,
    billedAccountUserId: userId,
    allowPersonalApiKeys: true,
    createdAt: now,
    updatedAt: now,
    role: 'owner',
  }
}

// Helper function to migrate existing workflows to a workspace
async function migrateExistingWorkflows(userId: string, workspaceId: string) {
  // Find all workflows that have no workspace ID
  const orphanedWorkflows = await db
    .select({ id: workflow.id })
    .from(workflow)
    .where(and(eq(workflow.userId, userId), isNull(workflow.workspaceId)))

  if (orphanedWorkflows.length === 0) {
    return // No orphaned workflows to migrate
  }

  logger.info(
    `Migrating ${orphanedWorkflows.length} workflows to workspace ${workspaceId} for user ${userId}`
  )

  // Bulk update all orphaned workflows at once
  await db
    .update(workflow)
    .set({
      workspaceId: workspaceId,
      updatedAt: new Date(),
    })
    .where(and(eq(workflow.userId, userId), isNull(workflow.workspaceId)))
}

// Helper function to ensure all workflows have a workspace
async function ensureWorkflowsHaveWorkspace(userId: string, defaultWorkspaceId: string) {
  // First check if there are any orphaned workflows
  const orphanedWorkflows = await db
    .select()
    .from(workflow)
    .where(and(eq(workflow.userId, userId), isNull(workflow.workspaceId)))

  if (orphanedWorkflows.length > 0) {
    // Directly update any workflows that don't have a workspace ID in a single query
    await db
      .update(workflow)
      .set({
        workspaceId: defaultWorkspaceId,
        updatedAt: new Date(),
      })
      .where(and(eq(workflow.userId, userId), isNull(workflow.workspaceId)))

    logger.info(`Fixed ${orphanedWorkflows.length} orphaned workflows for user ${userId}`)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.test.ts]---
Location: sim-main/apps/sim/app/api/workspaces/invitations/route.test.ts

```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockRequest, mockAuth, mockConsoleLogger } from '@/app/api/__test-utils__/utils'

describe('Workspace Invitations API Route', () => {
  const mockWorkspace = { id: 'workspace-1', name: 'Test Workspace' }
  const mockUser = { id: 'user-1', email: 'test@example.com' }
  const mockInvitation = { id: 'invitation-1', status: 'pending' }

  let mockDbResults: any[] = []
  let mockGetSession: any
  let mockResendSend: any
  let mockInsertValues: any

  beforeEach(() => {
    vi.resetModules()
    vi.resetAllMocks()

    mockDbResults = []
    mockConsoleLogger()
    mockAuth(mockUser)

    vi.doMock('crypto', () => ({
      randomUUID: vi.fn().mockReturnValue('mock-uuid-1234'),
    }))

    mockGetSession = vi.fn()
    vi.doMock('@/lib/auth', () => ({
      getSession: mockGetSession,
    }))

    mockInsertValues = vi.fn().mockResolvedValue(undefined)
    const mockDbChain = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      innerJoin: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      then: vi.fn().mockImplementation((callback: any) => {
        const result = mockDbResults.shift() || []
        return callback ? callback(result) : Promise.resolve(result)
      }),
      insert: vi.fn().mockReturnThis(),
      values: mockInsertValues,
    }

    vi.doMock('@sim/db', () => ({
      db: mockDbChain,
    }))

    vi.doMock('@sim/db/schema', () => ({
      user: { id: 'user_id', email: 'user_email', name: 'user_name', image: 'user_image' },
      workspace: { id: 'workspace_id', name: 'workspace_name', ownerId: 'owner_id' },
      permissions: {
        userId: 'user_id',
        entityId: 'entity_id',
        entityType: 'entity_type',
        permissionType: 'permission_type',
      },
      workspaceInvitation: {
        id: 'invitation_id',
        workspaceId: 'workspace_id',
        email: 'invitation_email',
        status: 'invitation_status',
        token: 'invitation_token',
        inviterId: 'inviter_id',
        role: 'invitation_role',
        permissions: 'invitation_permissions',
        expiresAt: 'expires_at',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
      permissionTypeEnum: { enumValues: ['admin', 'write', 'read'] as const },
    }))

    mockResendSend = vi.fn().mockResolvedValue({ id: 'email-id' })
    vi.doMock('resend', () => ({
      Resend: vi.fn().mockImplementation(() => ({
        emails: { send: mockResendSend },
      })),
    }))

    vi.doMock('@react-email/render', () => ({
      render: vi.fn().mockResolvedValue('<html>email content</html>'),
    }))

    vi.doMock('@/components/emails/workspace-invitation', () => ({
      WorkspaceInvitationEmail: vi.fn(),
    }))

    vi.doMock('@/lib/core/config/env', () => ({
      env: {
        RESEND_API_KEY: 'test-resend-key',
        NEXT_PUBLIC_APP_URL: 'https://test.sim.ai',
        FROM_EMAIL_ADDRESS: 'Sim <noreply@test.sim.ai>',
        EMAIL_DOMAIN: 'test.sim.ai',
      },
    }))

    vi.doMock('@/lib/core/utils/urls', () => ({
      getEmailDomain: vi.fn().mockReturnValue('sim.ai'),
    }))

    vi.doMock('drizzle-orm', () => ({
      and: vi.fn().mockImplementation((...args) => ({ type: 'and', conditions: args })),
      eq: vi.fn().mockImplementation((field, value) => ({ type: 'eq', field, value })),
      inArray: vi.fn().mockImplementation((field, values) => ({ type: 'inArray', field, values })),
    }))
  })

  describe('GET /api/workspaces/invitations', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetSession.mockResolvedValue(null)

      const { GET } = await import('@/app/api/workspaces/invitations/route')
      const req = createMockRequest('GET')
      const response = await GET(req)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('should return empty invitations when user has no workspaces', async () => {
      mockGetSession.mockResolvedValue({ user: { id: 'user-123' } })
      mockDbResults = [[], []] // No workspaces, no invitations

      const { GET } = await import('@/app/api/workspaces/invitations/route')
      const req = createMockRequest('GET')
      const response = await GET(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ invitations: [] })
    })

    it('should return invitations for user workspaces', async () => {
      mockGetSession.mockResolvedValue({ user: { id: 'user-123' } })
      const mockWorkspaces = [{ id: 'workspace-1' }, { id: 'workspace-2' }]
      const mockInvitations = [
        { id: 'invitation-1', workspaceId: 'workspace-1', email: 'test@example.com' },
        { id: 'invitation-2', workspaceId: 'workspace-2', email: 'test2@example.com' },
      ]
      mockDbResults = [mockWorkspaces, mockInvitations]

      const { GET } = await import('@/app/api/workspaces/invitations/route')
      const req = createMockRequest('GET')
      const response = await GET(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ invitations: mockInvitations })
    })
  })

  describe('POST /api/workspaces/invitations', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetSession.mockResolvedValue(null)

      const { POST } = await import('@/app/api/workspaces/invitations/route')
      const req = createMockRequest('POST', {
        workspaceId: 'workspace-1',
        email: 'test@example.com',
      })
      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('should return 400 when workspaceId is missing', async () => {
      mockGetSession.mockResolvedValue({ user: { id: 'user-123' } })

      const { POST } = await import('@/app/api/workspaces/invitations/route')
      const req = createMockRequest('POST', { email: 'test@example.com' })
      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({ error: 'Workspace ID and email are required' })
    })

    it('should return 400 when email is missing', async () => {
      mockGetSession.mockResolvedValue({ user: { id: 'user-123' } })

      const { POST } = await import('@/app/api/workspaces/invitations/route')
      const req = createMockRequest('POST', { workspaceId: 'workspace-1' })
      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({ error: 'Workspace ID and email are required' })
    })

    it('should return 400 when permission type is invalid', async () => {
      mockGetSession.mockResolvedValue({ user: { id: 'user-123' } })

      const { POST } = await import('@/app/api/workspaces/invitations/route')
      const req = createMockRequest('POST', {
        workspaceId: 'workspace-1',
        email: 'test@example.com',
        permission: 'invalid-permission',
      })
      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        error: 'Invalid permission: must be one of admin, write, read',
      })
    })

    it('should return 403 when user does not have admin permissions', async () => {
      mockGetSession.mockResolvedValue({ user: { id: 'user-123' } })
      mockDbResults = [[]] // No admin permissions found

      const { POST } = await import('@/app/api/workspaces/invitations/route')
      const req = createMockRequest('POST', {
        workspaceId: 'workspace-1',
        email: 'test@example.com',
      })
      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data).toEqual({ error: 'You need admin permissions to invite users' })
    })

    it('should return 404 when workspace is not found', async () => {
      mockGetSession.mockResolvedValue({ user: { id: 'user-123' } })
      mockDbResults = [
        [{ permissionType: 'admin' }], // User has admin permissions
        [], // Workspace not found
      ]

      const { POST } = await import('@/app/api/workspaces/invitations/route')
      const req = createMockRequest('POST', {
        workspaceId: 'workspace-1',
        email: 'test@example.com',
      })
      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data).toEqual({ error: 'Workspace not found' })
    })

    it('should return 400 when user already has workspace access', async () => {
      mockGetSession.mockResolvedValue({ user: { id: 'user-123' } })
      mockDbResults = [
        [{ permissionType: 'admin' }], // User has admin permissions
        [mockWorkspace], // Workspace exists
        [mockUser], // User exists
        [{ permissionType: 'read' }], // User already has access
      ]

      const { POST } = await import('@/app/api/workspaces/invitations/route')
      const req = createMockRequest('POST', {
        workspaceId: 'workspace-1',
        email: 'test@example.com',
      })
      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        error: 'test@example.com already has access to this workspace',
        email: 'test@example.com',
      })
    })

    it('should return 400 when invitation already exists', async () => {
      mockGetSession.mockResolvedValue({ user: { id: 'user-123' } })
      mockDbResults = [
        [{ permissionType: 'admin' }], // User has admin permissions
        [mockWorkspace], // Workspace exists
        [], // User doesn't exist
        [mockInvitation], // Invitation exists
      ]

      const { POST } = await import('@/app/api/workspaces/invitations/route')
      const req = createMockRequest('POST', {
        workspaceId: 'workspace-1',
        email: 'test@example.com',
      })
      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({
        error: 'test@example.com has already been invited to this workspace',
        email: 'test@example.com',
      })
    })

    it('should successfully create invitation and send email', async () => {
      mockGetSession.mockResolvedValue({
        user: { id: 'user-123', name: 'Test User', email: 'sender@example.com' },
      })
      mockDbResults = [
        [{ permissionType: 'admin' }], // User has admin permissions
        [mockWorkspace], // Workspace exists
        [], // User doesn't exist
        [], // No existing invitation
      ]

      const { POST } = await import('@/app/api/workspaces/invitations/route')
      const req = createMockRequest('POST', {
        workspaceId: 'workspace-1',
        email: 'test@example.com',
        permission: 'read',
      })
      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.invitation).toBeDefined()
      expect(data.invitation.email).toBe('test@example.com')
      expect(data.invitation.permissions).toBe('read')
      expect(data.invitation.token).toBe('mock-uuid-1234')
      expect(mockInsertValues).toHaveBeenCalled()
    })
  })
})
```

--------------------------------------------------------------------------------

````
