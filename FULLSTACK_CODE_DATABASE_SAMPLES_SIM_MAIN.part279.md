---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 279
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 279 of 933)

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
Location: sim-main/apps/sim/app/api/folders/[id]/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { workflow, workflowFolder } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('FoldersIDAPI')

const updateFolderSchema = z.object({
  name: z.string().optional(),
  color: z.string().optional(),
  isExpanded: z.boolean().optional(),
  parentId: z.string().nullable().optional(),
})

// PUT - Update a folder
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const validationResult = updateFolderSchema.safeParse(body)
    if (!validationResult.success) {
      logger.error('Folder update validation failed:', {
        errors: validationResult.error.errors,
      })
      const errorMessages = validationResult.error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ')
      return NextResponse.json({ error: `Validation failed: ${errorMessages}` }, { status: 400 })
    }

    const { name, color, isExpanded, parentId } = validationResult.data

    // Verify the folder exists
    const existingFolder = await db
      .select()
      .from(workflowFolder)
      .where(eq(workflowFolder.id, id))
      .then((rows) => rows[0])

    if (!existingFolder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
    }

    // Check if user has write permissions for the workspace
    const workspacePermission = await getUserEntityPermissions(
      session.user.id,
      'workspace',
      existingFolder.workspaceId
    )

    if (!workspacePermission || workspacePermission === 'read') {
      return NextResponse.json(
        { error: 'Write access required to update folders' },
        { status: 403 }
      )
    }

    // Prevent setting a folder as its own parent or creating circular references
    if (parentId && parentId === id) {
      return NextResponse.json({ error: 'Folder cannot be its own parent' }, { status: 400 })
    }

    // Check for circular references if parentId is provided
    if (parentId) {
      const wouldCreateCycle = await checkForCircularReference(id, parentId)
      if (wouldCreateCycle) {
        return NextResponse.json(
          { error: 'Cannot create circular folder reference' },
          { status: 400 }
        )
      }
    }

    // Update the folder
    const updates: any = { updatedAt: new Date() }
    if (name !== undefined) updates.name = name.trim()
    if (color !== undefined) updates.color = color
    if (isExpanded !== undefined) updates.isExpanded = isExpanded
    if (parentId !== undefined) updates.parentId = parentId || null

    const [updatedFolder] = await db
      .update(workflowFolder)
      .set(updates)
      .where(eq(workflowFolder.id, id))
      .returning()

    logger.info('Updated folder:', { id, updates })

    return NextResponse.json({ folder: updatedFolder })
  } catch (error) {
    logger.error('Error updating folder:', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete a folder and all its contents
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify the folder exists
    const existingFolder = await db
      .select()
      .from(workflowFolder)
      .where(eq(workflowFolder.id, id))
      .then((rows) => rows[0])

    if (!existingFolder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
    }

    // Check if user has admin permissions for the workspace (admin-only for deletions)
    const workspacePermission = await getUserEntityPermissions(
      session.user.id,
      'workspace',
      existingFolder.workspaceId
    )

    if (workspacePermission !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required to delete folders' },
        { status: 403 }
      )
    }

    // Recursively delete folder and all its contents
    const deletionStats = await deleteFolderRecursively(id, existingFolder.workspaceId)

    logger.info('Deleted folder and all contents:', {
      id,
      deletionStats,
    })

    return NextResponse.json({
      success: true,
      deletedItems: deletionStats,
    })
  } catch (error) {
    logger.error('Error deleting folder:', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to recursively delete a folder and all its contents
async function deleteFolderRecursively(
  folderId: string,
  workspaceId: string
): Promise<{ folders: number; workflows: number }> {
  const stats = { folders: 0, workflows: 0 }

  // Get all child folders first (workspace-scoped, not user-scoped)
  const childFolders = await db
    .select({ id: workflowFolder.id })
    .from(workflowFolder)
    .where(and(eq(workflowFolder.parentId, folderId), eq(workflowFolder.workspaceId, workspaceId)))

  // Recursively delete child folders
  for (const childFolder of childFolders) {
    const childStats = await deleteFolderRecursively(childFolder.id, workspaceId)
    stats.folders += childStats.folders
    stats.workflows += childStats.workflows
  }

  // Delete all workflows in this folder (workspace-scoped, not user-scoped)
  // The database cascade will handle deleting related workflow_blocks, workflow_edges, workflow_subflows
  const workflowsInFolder = await db
    .select({ id: workflow.id })
    .from(workflow)
    .where(and(eq(workflow.folderId, folderId), eq(workflow.workspaceId, workspaceId)))

  if (workflowsInFolder.length > 0) {
    await db
      .delete(workflow)
      .where(and(eq(workflow.folderId, folderId), eq(workflow.workspaceId, workspaceId)))

    stats.workflows += workflowsInFolder.length
  }

  // Delete this folder
  await db.delete(workflowFolder).where(eq(workflowFolder.id, folderId))

  stats.folders += 1

  return stats
}

// Helper function to check for circular references
async function checkForCircularReference(folderId: string, parentId: string): Promise<boolean> {
  let currentParentId: string | null = parentId
  const visited = new Set<string>()

  while (currentParentId) {
    if (visited.has(currentParentId)) {
      return true // Circular reference detected
    }

    if (currentParentId === folderId) {
      return true // Would create a cycle
    }

    visited.add(currentParentId)

    // Get the parent of the current parent
    const parent: { parentId: string | null } | undefined = await db
      .select({ parentId: workflowFolder.parentId })
      .from(workflowFolder)
      .where(eq(workflowFolder.id, currentParentId))
      .then((rows) => rows[0])

    currentParentId = parent?.parentId || null
  }

  return false
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/folders/[id]/duplicate/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { workflow, workflowFolder } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { duplicateWorkflow } from '@/lib/workflows/persistence/duplicate'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('FolderDuplicateAPI')

const DuplicateRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  workspaceId: z.string().optional(),
  parentId: z.string().nullable().optional(),
  color: z.string().optional(),
})

// POST /api/folders/[id]/duplicate - Duplicate a folder with all its child folders and workflows
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: sourceFolderId } = await params
  const requestId = generateRequestId()
  const startTime = Date.now()

  const session = await getSession()
  if (!session?.user?.id) {
    logger.warn(`[${requestId}] Unauthorized folder duplication attempt for ${sourceFolderId}`)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, workspaceId, parentId, color } = DuplicateRequestSchema.parse(body)

    logger.info(`[${requestId}] Duplicating folder ${sourceFolderId} for user ${session.user.id}`)

    // Verify the source folder exists
    const sourceFolder = await db
      .select()
      .from(workflowFolder)
      .where(eq(workflowFolder.id, sourceFolderId))
      .then((rows) => rows[0])

    if (!sourceFolder) {
      throw new Error('Source folder not found')
    }

    // Check if user has permission to access the source folder
    const userPermission = await getUserEntityPermissions(
      session.user.id,
      'workspace',
      sourceFolder.workspaceId
    )

    if (!userPermission || userPermission === 'read') {
      throw new Error('Source folder not found or access denied')
    }

    const targetWorkspaceId = workspaceId || sourceFolder.workspaceId

    // Step 1: Duplicate folder structure
    const { newFolderId, folderMapping } = await db.transaction(async (tx) => {
      const newFolderId = crypto.randomUUID()
      const now = new Date()

      // Create the new root folder
      await tx.insert(workflowFolder).values({
        id: newFolderId,
        userId: session.user.id,
        workspaceId: targetWorkspaceId,
        name,
        color: color || sourceFolder.color,
        parentId: parentId || sourceFolder.parentId,
        sortOrder: sourceFolder.sortOrder,
        isExpanded: false,
        createdAt: now,
        updatedAt: now,
      })

      // Recursively duplicate child folders
      const folderMapping = new Map<string, string>([[sourceFolderId, newFolderId]])
      await duplicateFolderStructure(
        tx,
        sourceFolderId,
        newFolderId,
        sourceFolder.workspaceId,
        targetWorkspaceId,
        session.user.id,
        now,
        folderMapping
      )

      return { newFolderId, folderMapping }
    })

    // Step 2: Duplicate workflows
    const workflowStats = await duplicateWorkflowsInFolderTree(
      sourceFolder.workspaceId,
      targetWorkspaceId,
      folderMapping,
      session.user.id,
      requestId
    )

    const elapsed = Date.now() - startTime
    logger.info(
      `[${requestId}] Successfully duplicated folder ${sourceFolderId} to ${newFolderId} in ${elapsed}ms`,
      {
        foldersCount: folderMapping.size,
        workflowsCount: workflowStats.total,
        workflowsSucceeded: workflowStats.succeeded,
        workflowsFailed: workflowStats.failed,
      }
    )

    return NextResponse.json(
      {
        id: newFolderId,
        name,
        color: color || sourceFolder.color,
        workspaceId: targetWorkspaceId,
        parentId: parentId || sourceFolder.parentId,
        foldersCount: folderMapping.size,
        workflowsCount: workflowStats.succeeded,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Source folder not found') {
        logger.warn(`[${requestId}] Source folder ${sourceFolderId} not found`)
        return NextResponse.json({ error: 'Source folder not found' }, { status: 404 })
      }

      if (error.message === 'Source folder not found or access denied') {
        logger.warn(
          `[${requestId}] User ${session.user.id} denied access to source folder ${sourceFolderId}`
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
      `[${requestId}] Error duplicating folder ${sourceFolderId} after ${elapsed}ms:`,
      error
    )
    return NextResponse.json({ error: 'Failed to duplicate folder' }, { status: 500 })
  }
}

// Helper to recursively duplicate folder structure
async function duplicateFolderStructure(
  tx: any,
  sourceFolderId: string,
  newParentFolderId: string,
  sourceWorkspaceId: string,
  targetWorkspaceId: string,
  userId: string,
  timestamp: Date,
  folderMapping: Map<string, string>
): Promise<void> {
  // Get all child folders
  const childFolders = await tx
    .select()
    .from(workflowFolder)
    .where(
      and(
        eq(workflowFolder.parentId, sourceFolderId),
        eq(workflowFolder.workspaceId, sourceWorkspaceId)
      )
    )

  // Create each child folder and recurse
  for (const childFolder of childFolders) {
    const newChildFolderId = crypto.randomUUID()
    folderMapping.set(childFolder.id, newChildFolderId)

    await tx.insert(workflowFolder).values({
      id: newChildFolderId,
      userId,
      workspaceId: targetWorkspaceId,
      name: childFolder.name,
      color: childFolder.color,
      parentId: newParentFolderId,
      sortOrder: childFolder.sortOrder,
      isExpanded: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    })

    // Recurse for this child's children
    await duplicateFolderStructure(
      tx,
      childFolder.id,
      newChildFolderId,
      sourceWorkspaceId,
      targetWorkspaceId,
      userId,
      timestamp,
      folderMapping
    )
  }
}

// Helper to duplicate all workflows in a folder tree
async function duplicateWorkflowsInFolderTree(
  sourceWorkspaceId: string,
  targetWorkspaceId: string,
  folderMapping: Map<string, string>,
  userId: string,
  requestId: string
): Promise<{ total: number; succeeded: number; failed: number }> {
  const stats = { total: 0, succeeded: 0, failed: 0 }

  // Process each folder in the mapping
  for (const [oldFolderId, newFolderId] of folderMapping.entries()) {
    // Get workflows in this folder
    const workflowsInFolder = await db
      .select()
      .from(workflow)
      .where(and(eq(workflow.folderId, oldFolderId), eq(workflow.workspaceId, sourceWorkspaceId)))

    stats.total += workflowsInFolder.length

    // Duplicate each workflow
    for (const sourceWorkflow of workflowsInFolder) {
      try {
        await duplicateWorkflow({
          sourceWorkflowId: sourceWorkflow.id,
          userId,
          name: sourceWorkflow.name,
          description: sourceWorkflow.description || undefined,
          color: sourceWorkflow.color,
          workspaceId: targetWorkspaceId,
          folderId: newFolderId,
          requestId,
        })

        stats.succeeded++
      } catch (error) {
        stats.failed++
        logger.error(`[${requestId}] Error duplicating workflow ${sourceWorkflow.id}:`, error)
      }
    }
  }

  return stats
}
```

--------------------------------------------------------------------------------

---[FILE: route.test.ts]---
Location: sim-main/apps/sim/app/api/function/execute/route.test.ts
Signals: Next.js

```typescript
/**
 * Tests for function execution API route
 *
 * @vitest-environment node
 */
import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockRequest } from '@/app/api/__test-utils__/utils'

vi.mock('@/lib/execution/isolated-vm', () => ({
  executeInIsolatedVM: vi.fn().mockImplementation(async (req) => {
    const { code, params, envVars, contextVariables } = req
    const stdoutChunks: string[] = []

    const mockConsole = {
      log: (...args: unknown[]) => {
        stdoutChunks.push(
          `${args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')}\n`
        )
      },
      error: (...args: unknown[]) => {
        stdoutChunks.push(
          'ERROR: ' +
            args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ') +
            '\n'
        )
      },
      warn: (...args: unknown[]) => mockConsole.log('WARN:', ...args),
      info: (...args: unknown[]) => mockConsole.log(...args),
    }

    try {
      const escapePattern = /this\.constructor\.constructor|\.constructor\s*\(/
      if (escapePattern.test(code)) {
        return { result: undefined, stdout: '' }
      }

      const context: Record<string, unknown> = {
        console: mockConsole,
        params,
        environmentVariables: envVars,
        ...contextVariables,
        process: undefined,
        require: undefined,
        module: undefined,
        exports: undefined,
        __dirname: undefined,
        __filename: undefined,
        fetch: async () => {
          throw new Error('fetch not implemented in test mock')
        },
      }

      const paramNames = Object.keys(context)
      const paramValues = Object.values(context)

      const wrappedCode = `
        return (async () => {
          ${code}
        })();
      `

      const fn = new Function(...paramNames, wrappedCode)
      const result = await fn(...paramValues)

      return {
        result,
        stdout: stdoutChunks.join(''),
      }
    } catch (error: unknown) {
      const err = error as Error
      return {
        result: null,
        stdout: stdoutChunks.join(''),
        error: {
          message: err.message || String(error),
          name: err.name || 'Error',
          stack: err.stack,
        },
      }
    }
  }),
}))

vi.mock('@/lib/logs/console/logger', () => ({
  createLogger: vi.fn(() => ({
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  })),
}))

vi.mock('@/lib/execution/e2b', () => ({
  executeInE2B: vi.fn(),
}))

import { validateProxyUrl } from '@/lib/core/security/input-validation'
import { executeInE2B } from '@/lib/execution/e2b'
import { POST } from './route'

const mockedExecuteInE2B = vi.mocked(executeInE2B)

describe('Function Execute API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockedExecuteInE2B.mockResolvedValue({
      result: 'e2b success',
      stdout: 'e2b output',
      sandboxId: 'test-sandbox-id',
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Security Tests', () => {
    it.concurrent('should use isolated-vm for secure sandboxed execution', async () => {
      const req = createMockRequest('POST', {
        code: 'return "test"',
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.output.result).toBe('test')
    })

    it.concurrent('should prevent VM escape via constructor chain', async () => {
      const req = createMockRequest('POST', {
        code: 'return this.constructor.constructor("return process")().env',
      })

      const response = await POST(req)
      const data = await response.json()

      if (response.status === 500) {
        expect(data.success).toBe(false)
      } else {
        const result = data.output?.result
        expect(result === undefined || result === null).toBe(true)
      }
    })

    it.concurrent('should prevent access to require via constructor chain', async () => {
      const req = createMockRequest('POST', {
        code: `
          const proc = this.constructor.constructor("return process")();
          const fs = proc.mainModule.require("fs");
          return fs.readFileSync("/etc/passwd", "utf8");
        `,
      })

      const response = await POST(req)
      const data = await response.json()

      if (response.status === 200) {
        const result = data.output?.result
        if (result !== undefined && result !== null && typeof result === 'string') {
          expect(result).not.toContain('root:')
        }
      }
    })

    it.concurrent('should not expose process object', async () => {
      const req = createMockRequest('POST', {
        code: 'return typeof process',
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.output.result).toBe('undefined')
    })

    it.concurrent('should not expose require function', async () => {
      const req = createMockRequest('POST', {
        code: 'return typeof require',
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.output.result).toBe('undefined')
    })

    it.concurrent('should block SSRF attacks through secure fetch wrapper', async () => {
      expect(validateProxyUrl('http://169.254.169.254/latest/meta-data/').isValid).toBe(false)
      expect(validateProxyUrl('http://127.0.0.1:8080/admin').isValid).toBe(false)
      expect(validateProxyUrl('http://192.168.1.1/config').isValid).toBe(false)
      expect(validateProxyUrl('http://10.0.0.1/internal').isValid).toBe(false)
    })

    it.concurrent('should allow legitimate external URLs', async () => {
      expect(validateProxyUrl('https://api.github.com/user').isValid).toBe(true)
      expect(validateProxyUrl('https://httpbin.org/get').isValid).toBe(true)
      expect(validateProxyUrl('https://example.com/api').isValid).toBe(true)
    })

    it.concurrent('should block dangerous protocols', async () => {
      expect(validateProxyUrl('file:///etc/passwd').isValid).toBe(false)
      expect(validateProxyUrl('ftp://internal.server/files').isValid).toBe(false)
      expect(validateProxyUrl('gopher://old.server/menu').isValid).toBe(false)
    })
  })

  describe('Basic Function Execution', () => {
    it.concurrent('should execute simple JavaScript code successfully', async () => {
      const req = createMockRequest('POST', {
        code: 'return "Hello World"',
        timeout: 5000,
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.output).toHaveProperty('result')
      expect(data.output).toHaveProperty('executionTime')
    })

    it.concurrent('should return computed result for multi-line code', async () => {
      const req = createMockRequest('POST', {
        code: 'const a = 1;\nconst b = 2;\nconst c = 3;\nconst d = 4;\nreturn a + b + c + d;',
        timeout: 5000,
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.output.result).toBe(10)
    })

    it.concurrent('should handle missing code parameter', async () => {
      const req = createMockRequest('POST', {
        timeout: 5000,
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data).toHaveProperty('error')
    })

    it.concurrent('should use default timeout when not provided', async () => {
      const req = createMockRequest('POST', {
        code: 'return "test"',
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })

  describe('Template Variable Resolution', () => {
    it.concurrent('should resolve environment variables with {{var_name}} syntax', async () => {
      const req = createMockRequest('POST', {
        code: 'return {{API_KEY}}',
        envVars: {
          API_KEY: 'secret-key-123',
        },
      })

      const response = await POST(req)

      expect(response.status).toBe(200)
    })

    it.concurrent('should resolve tag variables with <tag_name> syntax', async () => {
      const req = createMockRequest('POST', {
        code: 'return <email>',
        params: {
          email: { id: '123', subject: 'Test Email' },
        },
      })

      const response = await POST(req)

      expect(response.status).toBe(200)
    })

    it.concurrent('should NOT treat email addresses as template variables', async () => {
      const req = createMockRequest('POST', {
        code: 'return "Email sent to user"',
        params: {
          email: {
            from: 'Waleed Latif <waleed@sim.ai>',
            to: 'User <user@example.com>',
          },
        },
      })

      const response = await POST(req)

      expect(response.status).toBe(200)
    })

    it.concurrent('should only match valid variable names in angle brackets', async () => {
      const req = createMockRequest('POST', {
        code: 'return <validVar> + "<invalid@email.com>" + <another_valid>',
        params: {
          validVar: 'hello',
          another_valid: 'world',
        },
      })

      const response = await POST(req)

      expect(response.status).toBe(200)
    })
  })

  describe('Gmail Email Data Handling', () => {
    it.concurrent(
      'should handle Gmail webhook data with email addresses containing angle brackets',
      async () => {
        const gmailData = {
          email: {
            id: '123',
            from: 'Waleed Latif <waleed@sim.ai>',
            to: 'User <user@example.com>',
            subject: 'Test Email',
            bodyText: 'Hello world',
          },
          rawEmail: {
            id: '123',
            payload: {
              headers: [
                { name: 'From', value: 'Waleed Latif <waleed@sim.ai>' },
                { name: 'To', value: 'User <user@example.com>' },
              ],
            },
          },
        }

        const req = createMockRequest('POST', {
          code: 'return <email>',
          params: gmailData,
        })

        const response = await POST(req)

        expect(response.status).toBe(200)
        const data = await response.json()
        expect(data.success).toBe(true)
      }
    )

    it.concurrent(
      'should properly serialize complex email objects with special characters',
      async () => {
        const complexEmailData = {
          email: {
            from: 'Test User <test@example.com>',
            bodyHtml: '<div>HTML content with "quotes" and \'apostrophes\'</div>',
            bodyText: 'Text with\nnewlines\tand\ttabs',
          },
        }

        const req = createMockRequest('POST', {
          code: 'return <email>',
          params: complexEmailData,
        })

        const response = await POST(req)

        expect(response.status).toBe(200)
      }
    )
  })

  describe('Custom Tools', () => {
    it.concurrent('should handle custom tool execution with direct parameter access', async () => {
      const req = createMockRequest('POST', {
        code: 'return location + " weather is sunny"',
        params: {
          location: 'San Francisco',
        },
        isCustomTool: true,
      })

      const response = await POST(req)

      expect(response.status).toBe(200)
    })
  })

  describe('Security and Edge Cases', () => {
    it.concurrent('should handle malformed JSON in request body', async () => {
      const req = new NextRequest('http://localhost:3000/api/function/execute', {
        method: 'POST',
        body: 'invalid json{',
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(req)

      expect(response.status).toBe(500)
    })

    it.concurrent('should handle timeout parameter', async () => {
      const req = createMockRequest('POST', {
        code: 'return "test"',
        timeout: 10000,
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it.concurrent('should handle empty parameters object', async () => {
      const req = createMockRequest('POST', {
        code: 'return "no params"',
        params: {},
      })

      const response = await POST(req)

      expect(response.status).toBe(200)
    })
  })

  describe('Enhanced Error Handling', () => {
    it('should provide detailed syntax error with line content', async () => {
      const req = createMockRequest('POST', {
        code: 'const obj = {\n  name: "test",\n  description: "This has a missing closing quote\n};\nreturn obj;',
        timeout: 5000,
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBeTruthy()
    })

    it('should provide detailed runtime error with line and column', async () => {
      const req = createMockRequest('POST', {
        code: 'const obj = null;\nreturn obj.someMethod();',
        timeout: 5000,
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Type Error')
      expect(data.error).toContain('Cannot read properties of null')
    })

    it('should handle ReferenceError with enhanced details', async () => {
      const req = createMockRequest('POST', {
        code: 'const x = 42;\nreturn undefinedVariable + x;',
        timeout: 5000,
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Reference Error')
      expect(data.error).toContain('undefinedVariable is not defined')
    })

    it('should handle thrown errors gracefully', async () => {
      const req = createMockRequest('POST', {
        code: 'throw new Error("Custom error message");',
        timeout: 5000,
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Custom error message')
    })

    it.concurrent('should provide helpful suggestions for common syntax errors', async () => {
      const req = createMockRequest('POST', {
        code: 'const obj = {\n  name: "test"\n// Missing closing brace',
        timeout: 5000,
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBeTruthy()
    })
  })

  describe('Utility Functions', () => {
    it.concurrent('should properly escape regex special characters', async () => {
      const req = createMockRequest('POST', {
        code: 'return {{special.chars+*?}}',
        envVars: {
          'special.chars+*?': 'escaped-value',
        },
      })

      const response = await POST(req)

      expect(response.status).toBe(200)
    })

    it.concurrent('should handle JSON serialization edge cases', async () => {
      const req = createMockRequest('POST', {
        code: 'return <complexData>',
        params: {
          complexData: {
            special: 'chars"with\'quotes',
            unicode: '🎉 Unicode content',
            nested: {
              deep: {
                value: 'test',
              },
            },
          },
        },
      })

      const response = await POST(req)

      expect(response.status).toBe(200)
    })
  })
})
```

--------------------------------------------------------------------------------

````
