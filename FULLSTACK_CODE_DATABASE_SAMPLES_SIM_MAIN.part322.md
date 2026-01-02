---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 322
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 322 of 933)

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
Location: sim-main/apps/sim/app/api/v1/admin/workflows/[id]/export/route.ts

```typescript
/**
 * GET /api/v1/admin/workflows/[id]/export
 *
 * Export a single workflow as JSON.
 *
 * Response: AdminSingleResponse<WorkflowExportPayload>
 */

import { db } from '@sim/db'
import { workflow } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'
import { loadWorkflowFromNormalizedTables } from '@/lib/workflows/persistence/utils'
import { withAdminAuthParams } from '@/app/api/v1/admin/middleware'
import {
  internalErrorResponse,
  notFoundResponse,
  singleResponse,
} from '@/app/api/v1/admin/responses'
import {
  parseWorkflowVariables,
  type WorkflowExportPayload,
  type WorkflowExportState,
} from '@/app/api/v1/admin/types'

const logger = createLogger('AdminWorkflowExportAPI')

interface RouteParams {
  id: string
}

export const GET = withAdminAuthParams<RouteParams>(async (request, context) => {
  const { id: workflowId } = await context.params

  try {
    const [workflowData] = await db
      .select()
      .from(workflow)
      .where(eq(workflow.id, workflowId))
      .limit(1)

    if (!workflowData) {
      return notFoundResponse('Workflow')
    }

    const normalizedData = await loadWorkflowFromNormalizedTables(workflowId)

    if (!normalizedData) {
      return notFoundResponse('Workflow state')
    }

    const variables = parseWorkflowVariables(workflowData.variables)

    const state: WorkflowExportState = {
      blocks: normalizedData.blocks,
      edges: normalizedData.edges,
      loops: normalizedData.loops,
      parallels: normalizedData.parallels,
      metadata: {
        name: workflowData.name,
        description: workflowData.description ?? undefined,
        color: workflowData.color,
        exportedAt: new Date().toISOString(),
      },
      variables,
    }

    const exportPayload: WorkflowExportPayload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      workflow: {
        id: workflowData.id,
        name: workflowData.name,
        description: workflowData.description,
        color: workflowData.color,
        workspaceId: workflowData.workspaceId,
        folderId: workflowData.folderId,
      },
      state,
    }

    logger.info(`Admin API: Exported workflow ${workflowId}`)

    return singleResponse(exportPayload)
  } catch (error) {
    logger.error('Admin API: Failed to export workflow', { error, workflowId })
    return internalErrorResponse('Failed to export workflow')
  }
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/workspaces/route.ts

```typescript
/**
 * GET /api/v1/admin/workspaces
 *
 * List all workspaces with pagination.
 *
 * Query Parameters:
 *   - limit: number (default: 50, max: 250)
 *   - offset: number (default: 0)
 *
 * Response: AdminListResponse<AdminWorkspace>
 */

import { db } from '@sim/db'
import { workspace } from '@sim/db/schema'
import { count } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'
import { withAdminAuth } from '@/app/api/v1/admin/middleware'
import { internalErrorResponse, listResponse } from '@/app/api/v1/admin/responses'
import {
  type AdminWorkspace,
  createPaginationMeta,
  parsePaginationParams,
  toAdminWorkspace,
} from '@/app/api/v1/admin/types'

const logger = createLogger('AdminWorkspacesAPI')

export const GET = withAdminAuth(async (request) => {
  const url = new URL(request.url)
  const { limit, offset } = parsePaginationParams(url)

  try {
    const [countResult, workspaces] = await Promise.all([
      db.select({ total: count() }).from(workspace),
      db.select().from(workspace).orderBy(workspace.name).limit(limit).offset(offset),
    ])

    const total = countResult[0].total
    const data: AdminWorkspace[] = workspaces.map(toAdminWorkspace)
    const pagination = createPaginationMeta(total, limit, offset)

    logger.info(`Admin API: Listed ${data.length} workspaces (total: ${total})`)

    return listResponse(data, pagination)
  } catch (error) {
    logger.error('Admin API: Failed to list workspaces', { error })
    return internalErrorResponse('Failed to list workspaces')
  }
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/workspaces/[id]/route.ts

```typescript
/**
 * GET /api/v1/admin/workspaces/[id]
 *
 * Get workspace details including workflow and folder counts.
 *
 * Response: AdminSingleResponse<AdminWorkspaceDetail>
 */

import { db } from '@sim/db'
import { workflow, workflowFolder, workspace } from '@sim/db/schema'
import { count, eq } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'
import { withAdminAuthParams } from '@/app/api/v1/admin/middleware'
import {
  internalErrorResponse,
  notFoundResponse,
  singleResponse,
} from '@/app/api/v1/admin/responses'
import { type AdminWorkspaceDetail, toAdminWorkspace } from '@/app/api/v1/admin/types'

const logger = createLogger('AdminWorkspaceDetailAPI')

interface RouteParams {
  id: string
}

export const GET = withAdminAuthParams<RouteParams>(async (request, context) => {
  const { id: workspaceId } = await context.params

  try {
    const [workspaceData] = await db
      .select()
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .limit(1)

    if (!workspaceData) {
      return notFoundResponse('Workspace')
    }

    const [workflowCountResult, folderCountResult] = await Promise.all([
      db.select({ count: count() }).from(workflow).where(eq(workflow.workspaceId, workspaceId)),
      db
        .select({ count: count() })
        .from(workflowFolder)
        .where(eq(workflowFolder.workspaceId, workspaceId)),
    ])

    const data: AdminWorkspaceDetail = {
      ...toAdminWorkspace(workspaceData),
      workflowCount: workflowCountResult[0].count,
      folderCount: folderCountResult[0].count,
    }

    logger.info(`Admin API: Retrieved workspace ${workspaceId}`)

    return singleResponse(data)
  } catch (error) {
    logger.error('Admin API: Failed to get workspace', { error, workspaceId })
    return internalErrorResponse('Failed to get workspace')
  }
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/workspaces/[id]/export/route.ts
Signals: Next.js

```typescript
/**
 * GET /api/v1/admin/workspaces/[id]/export
 *
 * Export an entire workspace as a ZIP file or JSON.
 *
 * Query Parameters:
 *   - format: 'zip' (default) or 'json'
 *
 * Response:
 *   - ZIP file download (Content-Type: application/zip)
 *   - JSON: WorkspaceExportPayload
 */

import { db } from '@sim/db'
import { workflow, workflowFolder, workspace } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { createLogger } from '@/lib/logs/console/logger'
import { exportWorkspaceToZip } from '@/lib/workflows/operations/import-export'
import { loadWorkflowFromNormalizedTables } from '@/lib/workflows/persistence/utils'
import { withAdminAuthParams } from '@/app/api/v1/admin/middleware'
import {
  internalErrorResponse,
  notFoundResponse,
  singleResponse,
} from '@/app/api/v1/admin/responses'
import {
  type FolderExportPayload,
  parseWorkflowVariables,
  type WorkflowExportState,
  type WorkspaceExportPayload,
} from '@/app/api/v1/admin/types'

const logger = createLogger('AdminWorkspaceExportAPI')

interface RouteParams {
  id: string
}

export const GET = withAdminAuthParams<RouteParams>(async (request, context) => {
  const { id: workspaceId } = await context.params
  const url = new URL(request.url)
  const format = url.searchParams.get('format') || 'zip'

  try {
    const [workspaceData] = await db
      .select({ id: workspace.id, name: workspace.name })
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .limit(1)

    if (!workspaceData) {
      return notFoundResponse('Workspace')
    }

    const workflows = await db.select().from(workflow).where(eq(workflow.workspaceId, workspaceId))

    const folders = await db
      .select()
      .from(workflowFolder)
      .where(eq(workflowFolder.workspaceId, workspaceId))

    const workflowExports: Array<{
      workflow: WorkspaceExportPayload['workflows'][number]['workflow']
      state: WorkflowExportState
    }> = []

    for (const wf of workflows) {
      try {
        const normalizedData = await loadWorkflowFromNormalizedTables(wf.id)

        if (!normalizedData) {
          logger.warn(`Skipping workflow ${wf.id} - no normalized data found`)
          continue
        }

        const variables = parseWorkflowVariables(wf.variables)

        const state: WorkflowExportState = {
          blocks: normalizedData.blocks,
          edges: normalizedData.edges,
          loops: normalizedData.loops,
          parallels: normalizedData.parallels,
          metadata: {
            name: wf.name,
            description: wf.description ?? undefined,
            color: wf.color,
            exportedAt: new Date().toISOString(),
          },
          variables,
        }

        workflowExports.push({
          workflow: {
            id: wf.id,
            name: wf.name,
            description: wf.description,
            color: wf.color,
            workspaceId: wf.workspaceId,
            folderId: wf.folderId,
          },
          state,
        })
      } catch (error) {
        logger.error(`Failed to load workflow ${wf.id}:`, { error })
      }
    }

    const folderExports: FolderExportPayload[] = folders.map((f) => ({
      id: f.id,
      name: f.name,
      parentId: f.parentId,
    }))

    logger.info(
      `Admin API: Exporting workspace ${workspaceId} with ${workflowExports.length} workflows and ${folderExports.length} folders`
    )

    if (format === 'json') {
      const exportPayload: WorkspaceExportPayload = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        workspace: {
          id: workspaceData.id,
          name: workspaceData.name,
        },
        workflows: workflowExports,
        folders: folderExports,
      }

      return singleResponse(exportPayload)
    }

    const zipWorkflows = workflowExports.map((wf) => ({
      workflow: {
        id: wf.workflow.id,
        name: wf.workflow.name,
        description: wf.workflow.description ?? undefined,
        color: wf.workflow.color ?? undefined,
        folderId: wf.workflow.folderId,
      },
      state: wf.state,
      variables: wf.state.variables,
    }))

    const zipBlob = await exportWorkspaceToZip(workspaceData.name, zipWorkflows, folderExports)
    const arrayBuffer = await zipBlob.arrayBuffer()

    const sanitizedName = workspaceData.name.replace(/[^a-z0-9-_]/gi, '-')
    const filename = `${sanitizedName}-${new Date().toISOString().split('T')[0]}.zip`

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': arrayBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    logger.error('Admin API: Failed to export workspace', { error, workspaceId })
    return internalErrorResponse('Failed to export workspace')
  }
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/workspaces/[id]/folders/route.ts

```typescript
/**
 * GET /api/v1/admin/workspaces/[id]/folders
 *
 * List all folders in a workspace with pagination.
 *
 * Query Parameters:
 *   - limit: number (default: 50, max: 250)
 *   - offset: number (default: 0)
 *
 * Response: AdminListResponse<AdminFolder>
 */

import { db } from '@sim/db'
import { workflowFolder, workspace } from '@sim/db/schema'
import { count, eq } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'
import { withAdminAuthParams } from '@/app/api/v1/admin/middleware'
import { internalErrorResponse, listResponse, notFoundResponse } from '@/app/api/v1/admin/responses'
import {
  type AdminFolder,
  createPaginationMeta,
  parsePaginationParams,
  toAdminFolder,
} from '@/app/api/v1/admin/types'

const logger = createLogger('AdminWorkspaceFoldersAPI')

interface RouteParams {
  id: string
}

export const GET = withAdminAuthParams<RouteParams>(async (request, context) => {
  const { id: workspaceId } = await context.params
  const url = new URL(request.url)
  const { limit, offset } = parsePaginationParams(url)

  try {
    const [workspaceData] = await db
      .select({ id: workspace.id })
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .limit(1)

    if (!workspaceData) {
      return notFoundResponse('Workspace')
    }

    const [countResult, folders] = await Promise.all([
      db
        .select({ total: count() })
        .from(workflowFolder)
        .where(eq(workflowFolder.workspaceId, workspaceId)),
      db
        .select()
        .from(workflowFolder)
        .where(eq(workflowFolder.workspaceId, workspaceId))
        .orderBy(workflowFolder.sortOrder, workflowFolder.name)
        .limit(limit)
        .offset(offset),
    ])

    const total = countResult[0].total
    const data: AdminFolder[] = folders.map(toAdminFolder)
    const pagination = createPaginationMeta(total, limit, offset)

    logger.info(
      `Admin API: Listed ${data.length} folders in workspace ${workspaceId} (total: ${total})`
    )

    return listResponse(data, pagination)
  } catch (error) {
    logger.error('Admin API: Failed to list workspace folders', { error, workspaceId })
    return internalErrorResponse('Failed to list folders')
  }
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/workspaces/[id]/import/route.ts
Signals: Next.js

```typescript
/**
 * POST /api/v1/admin/workspaces/[id]/import
 *
 * Import workflows into a workspace from a ZIP file or JSON.
 *
 * Content-Type:
 *   - application/zip or multipart/form-data (with 'file' field) for ZIP upload
 *   - application/json for JSON payload
 *
 * JSON Body:
 *   {
 *     workflows: Array<{
 *       content: string | object,  // Workflow JSON
 *       name?: string,             // Override name
 *       folderPath?: string[]      // Folder path to create
 *     }>
 *   }
 *
 * Query Parameters:
 *   - createFolders: 'true' (default) or 'false'
 *   - rootFolderName: optional name for root import folder
 *
 * Response: WorkspaceImportResponse
 */

import { db } from '@sim/db'
import { workflow, workflowFolder, workspace } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { createLogger } from '@/lib/logs/console/logger'
import {
  extractWorkflowName,
  extractWorkflowsFromZip,
} from '@/lib/workflows/operations/import-export'
import { saveWorkflowToNormalizedTables } from '@/lib/workflows/persistence/utils'
import { withAdminAuthParams } from '@/app/api/v1/admin/middleware'
import {
  badRequestResponse,
  internalErrorResponse,
  notFoundResponse,
} from '@/app/api/v1/admin/responses'
import {
  extractWorkflowMetadata,
  type ImportResult,
  type WorkflowVariable,
  type WorkspaceImportRequest,
  type WorkspaceImportResponse,
} from '@/app/api/v1/admin/types'
import { parseWorkflowJson } from '@/stores/workflows/json/importer'

const logger = createLogger('AdminWorkspaceImportAPI')

interface RouteParams {
  id: string
}

interface ParsedWorkflow {
  content: string
  name: string
  folderPath: string[]
}

export const POST = withAdminAuthParams<RouteParams>(async (request, context) => {
  const { id: workspaceId } = await context.params
  const url = new URL(request.url)
  const createFolders = url.searchParams.get('createFolders') !== 'false'
  const rootFolderName = url.searchParams.get('rootFolderName')

  try {
    const [workspaceData] = await db
      .select({ id: workspace.id, ownerId: workspace.ownerId })
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .limit(1)

    if (!workspaceData) {
      return notFoundResponse('Workspace')
    }

    const contentType = request.headers.get('content-type') || ''
    let workflowsToImport: ParsedWorkflow[] = []

    if (contentType.includes('application/json')) {
      const body = (await request.json()) as WorkspaceImportRequest

      if (!body.workflows || !Array.isArray(body.workflows)) {
        return badRequestResponse('Invalid JSON body. Expected { workflows: [...] }')
      }

      workflowsToImport = body.workflows.map((w) => ({
        content: typeof w.content === 'string' ? w.content : JSON.stringify(w.content),
        name: w.name || 'Imported Workflow',
        folderPath: w.folderPath || [],
      }))
    } else if (
      contentType.includes('application/zip') ||
      contentType.includes('multipart/form-data')
    ) {
      let zipBuffer: ArrayBuffer

      if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData()
        const file = formData.get('file') as File | null

        if (!file) {
          return badRequestResponse('No file provided in form data. Use field name "file".')
        }

        zipBuffer = await file.arrayBuffer()
      } else {
        zipBuffer = await request.arrayBuffer()
      }

      const blob = new Blob([zipBuffer], { type: 'application/zip' })
      const file = new File([blob], 'import.zip', { type: 'application/zip' })

      const { workflows } = await extractWorkflowsFromZip(file)
      workflowsToImport = workflows
    } else {
      return badRequestResponse(
        'Unsupported Content-Type. Use application/json or application/zip.'
      )
    }

    if (workflowsToImport.length === 0) {
      return badRequestResponse('No workflows found to import')
    }

    let rootFolderId: string | undefined
    if (rootFolderName && createFolders) {
      rootFolderId = crypto.randomUUID()
      await db.insert(workflowFolder).values({
        id: rootFolderId,
        name: rootFolderName,
        userId: workspaceData.ownerId,
        workspaceId,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    const folderMap = new Map<string, string>()
    const results: ImportResult[] = []

    for (const wf of workflowsToImport) {
      const result = await importSingleWorkflow(
        wf,
        workspaceId,
        workspaceData.ownerId,
        createFolders,
        rootFolderId,
        folderMap
      )
      results.push(result)

      if (result.success) {
        logger.info(`Admin API: Imported workflow ${result.workflowId} (${result.name})`)
      } else {
        logger.warn(`Admin API: Failed to import workflow ${result.name}: ${result.error}`)
      }
    }

    const imported = results.filter((r) => r.success).length
    const failed = results.filter((r) => !r.success).length

    logger.info(`Admin API: Import complete - ${imported} succeeded, ${failed} failed`)

    const response: WorkspaceImportResponse = { imported, failed, results }
    return NextResponse.json(response)
  } catch (error) {
    logger.error('Admin API: Failed to import into workspace', { error, workspaceId })
    return internalErrorResponse('Failed to import workflows')
  }
})

async function importSingleWorkflow(
  wf: ParsedWorkflow,
  workspaceId: string,
  ownerId: string,
  createFolders: boolean,
  rootFolderId: string | undefined,
  folderMap: Map<string, string>
): Promise<ImportResult> {
  try {
    const { data: workflowData, errors } = parseWorkflowJson(wf.content)

    if (!workflowData || errors.length > 0) {
      return {
        workflowId: '',
        name: wf.name,
        success: false,
        error: `Parse error: ${errors.join(', ')}`,
      }
    }

    const workflowName = extractWorkflowName(wf.content, wf.name)
    let targetFolderId: string | null = rootFolderId || null

    if (createFolders && wf.folderPath.length > 0) {
      let parentId = rootFolderId || null

      for (let i = 0; i < wf.folderPath.length; i++) {
        const pathSegment = wf.folderPath.slice(0, i + 1).join('/')
        const fullPath = rootFolderId ? `root/${pathSegment}` : pathSegment

        if (!folderMap.has(fullPath)) {
          const folderId = crypto.randomUUID()
          await db.insert(workflowFolder).values({
            id: folderId,
            name: wf.folderPath[i],
            userId: ownerId,
            workspaceId,
            parentId,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          folderMap.set(fullPath, folderId)
          parentId = folderId
        } else {
          parentId = folderMap.get(fullPath)!
        }
      }

      const fullFolderPath = rootFolderId
        ? `root/${wf.folderPath.join('/')}`
        : wf.folderPath.join('/')
      targetFolderId = folderMap.get(fullFolderPath) || parentId
    }

    const parsedContent = (() => {
      try {
        return JSON.parse(wf.content)
      } catch {
        return null
      }
    })()
    const { color: workflowColor } = extractWorkflowMetadata(parsedContent)
    const workflowId = crypto.randomUUID()
    const now = new Date()

    await db.insert(workflow).values({
      id: workflowId,
      userId: ownerId,
      workspaceId,
      folderId: targetFolderId,
      name: workflowName,
      description: workflowData.metadata?.description || 'Imported via Admin API',
      color: workflowColor,
      lastSynced: now,
      createdAt: now,
      updatedAt: now,
      isDeployed: false,
      runCount: 0,
      variables: {},
    })

    const saveResult = await saveWorkflowToNormalizedTables(workflowId, workflowData)

    if (!saveResult.success) {
      await db.delete(workflow).where(eq(workflow.id, workflowId))
      return {
        workflowId: '',
        name: workflowName,
        success: false,
        error: `Failed to save state: ${saveResult.error}`,
      }
    }

    if (workflowData.variables && Array.isArray(workflowData.variables)) {
      const variablesRecord: Record<string, WorkflowVariable> = {}
      workflowData.variables.forEach((v) => {
        const varId = v.id || crypto.randomUUID()
        variablesRecord[varId] = {
          id: varId,
          name: v.name,
          type: v.type || 'string',
          value: v.value,
        }
      })

      await db
        .update(workflow)
        .set({ variables: variablesRecord, updatedAt: new Date() })
        .where(eq(workflow.id, workflowId))
    }

    return {
      workflowId,
      name: workflowName,
      success: true,
    }
  } catch (error) {
    return {
      workflowId: '',
      name: wf.name,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/workspaces/[id]/workflows/route.ts
Signals: Next.js

```typescript
/**
 * GET /api/v1/admin/workspaces/[id]/workflows
 *
 * List all workflows in a workspace with pagination.
 *
 * Query Parameters:
 *   - limit: number (default: 50, max: 250)
 *   - offset: number (default: 0)
 *
 * Response: AdminListResponse<AdminWorkflow>
 *
 * DELETE /api/v1/admin/workspaces/[id]/workflows
 *
 * Delete all workflows in a workspace (clean slate for reimport).
 *
 * Response: { success: true, deleted: number }
 */

import { db } from '@sim/db'
import {
  workflow,
  workflowBlocks,
  workflowEdges,
  workflowSchedule,
  workspace,
} from '@sim/db/schema'
import { count, eq, inArray } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { createLogger } from '@/lib/logs/console/logger'
import { withAdminAuthParams } from '@/app/api/v1/admin/middleware'
import { internalErrorResponse, listResponse, notFoundResponse } from '@/app/api/v1/admin/responses'
import {
  type AdminWorkflow,
  createPaginationMeta,
  parsePaginationParams,
  toAdminWorkflow,
} from '@/app/api/v1/admin/types'

const logger = createLogger('AdminWorkspaceWorkflowsAPI')

interface RouteParams {
  id: string
}

export const GET = withAdminAuthParams<RouteParams>(async (request, context) => {
  const { id: workspaceId } = await context.params
  const url = new URL(request.url)
  const { limit, offset } = parsePaginationParams(url)

  try {
    const [workspaceData] = await db
      .select({ id: workspace.id })
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .limit(1)

    if (!workspaceData) {
      return notFoundResponse('Workspace')
    }

    const [countResult, workflows] = await Promise.all([
      db.select({ total: count() }).from(workflow).where(eq(workflow.workspaceId, workspaceId)),
      db
        .select()
        .from(workflow)
        .where(eq(workflow.workspaceId, workspaceId))
        .orderBy(workflow.name)
        .limit(limit)
        .offset(offset),
    ])

    const total = countResult[0].total
    const data: AdminWorkflow[] = workflows.map(toAdminWorkflow)
    const pagination = createPaginationMeta(total, limit, offset)

    logger.info(
      `Admin API: Listed ${data.length} workflows in workspace ${workspaceId} (total: ${total})`
    )

    return listResponse(data, pagination)
  } catch (error) {
    logger.error('Admin API: Failed to list workspace workflows', { error, workspaceId })
    return internalErrorResponse('Failed to list workflows')
  }
})

export const DELETE = withAdminAuthParams<RouteParams>(async (request, context) => {
  const { id: workspaceId } = await context.params

  try {
    const [workspaceData] = await db
      .select({ id: workspace.id })
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .limit(1)

    if (!workspaceData) {
      return notFoundResponse('Workspace')
    }

    const workflowsToDelete = await db
      .select({ id: workflow.id })
      .from(workflow)
      .where(eq(workflow.workspaceId, workspaceId))

    if (workflowsToDelete.length === 0) {
      return NextResponse.json({ success: true, deleted: 0 })
    }

    const workflowIds = workflowsToDelete.map((w) => w.id)

    await db.transaction(async (tx) => {
      await Promise.all([
        tx.delete(workflowBlocks).where(inArray(workflowBlocks.workflowId, workflowIds)),
        tx.delete(workflowEdges).where(inArray(workflowEdges.workflowId, workflowIds)),
        tx.delete(workflowSchedule).where(inArray(workflowSchedule.workflowId, workflowIds)),
      ])

      await tx.delete(workflow).where(eq(workflow.workspaceId, workspaceId))
    })

    logger.info(`Admin API: Deleted ${workflowIds.length} workflows from workspace ${workspaceId}`)

    return NextResponse.json({ success: true, deleted: workflowIds.length })
  } catch (error) {
    logger.error('Admin API: Failed to delete workspace workflows', { error, workspaceId })
    return internalErrorResponse('Failed to delete workflows')
  }
})
```

--------------------------------------------------------------------------------

---[FILE: filters.ts]---
Location: sim-main/apps/sim/app/api/v1/logs/filters.ts

```typescript
import { workflow, workflowExecutionLogs } from '@sim/db/schema'
import { and, desc, eq, gte, inArray, lte, type SQL, sql } from 'drizzle-orm'

export interface LogFilters {
  workspaceId: string
  workflowIds?: string[]
  folderIds?: string[]
  triggers?: string[]
  level?: 'info' | 'error'
  startDate?: Date
  endDate?: Date
  executionId?: string
  minDurationMs?: number
  maxDurationMs?: number
  minCost?: number
  maxCost?: number
  model?: string
  cursor?: {
    startedAt: string
    id: string
  }
  order?: 'desc' | 'asc'
}

export function buildLogFilters(filters: LogFilters): SQL<unknown> {
  const conditions: SQL<unknown>[] = []

  // Required: workspace and permissions check
  conditions.push(eq(workflow.workspaceId, filters.workspaceId))

  // Cursor-based pagination
  if (filters.cursor) {
    const cursorDate = new Date(filters.cursor.startedAt)
    if (filters.order === 'desc') {
      conditions.push(
        sql`(${workflowExecutionLogs.startedAt}, ${workflowExecutionLogs.id}) < (${cursorDate}, ${filters.cursor.id})`
      )
    } else {
      conditions.push(
        sql`(${workflowExecutionLogs.startedAt}, ${workflowExecutionLogs.id}) > (${cursorDate}, ${filters.cursor.id})`
      )
    }
  }

  // Workflow IDs filter
  if (filters.workflowIds && filters.workflowIds.length > 0) {
    conditions.push(inArray(workflow.id, filters.workflowIds))
  }

  // Folder IDs filter
  if (filters.folderIds && filters.folderIds.length > 0) {
    conditions.push(inArray(workflow.folderId, filters.folderIds))
  }

  // Triggers filter
  if (filters.triggers && filters.triggers.length > 0 && !filters.triggers.includes('all')) {
    conditions.push(inArray(workflowExecutionLogs.trigger, filters.triggers))
  }

  // Level filter
  if (filters.level) {
    conditions.push(eq(workflowExecutionLogs.level, filters.level))
  }

  // Date range filters
  if (filters.startDate) {
    conditions.push(gte(workflowExecutionLogs.startedAt, filters.startDate))
  }

  if (filters.endDate) {
    conditions.push(lte(workflowExecutionLogs.startedAt, filters.endDate))
  }

  // Search filter (execution ID)
  if (filters.executionId) {
    conditions.push(eq(workflowExecutionLogs.executionId, filters.executionId))
  }

  // Duration filters
  if (filters.minDurationMs !== undefined) {
    conditions.push(gte(workflowExecutionLogs.totalDurationMs, filters.minDurationMs))
  }

  if (filters.maxDurationMs !== undefined) {
    conditions.push(lte(workflowExecutionLogs.totalDurationMs, filters.maxDurationMs))
  }

  // Cost filters
  if (filters.minCost !== undefined) {
    conditions.push(sql`(${workflowExecutionLogs.cost}->>'total')::numeric >= ${filters.minCost}`)
  }

  if (filters.maxCost !== undefined) {
    conditions.push(sql`(${workflowExecutionLogs.cost}->>'total')::numeric <= ${filters.maxCost}`)
  }

  // Model filter
  if (filters.model) {
    conditions.push(sql`${workflowExecutionLogs.cost}->>'models' ? ${filters.model}`)
  }

  // Combine all conditions with AND
  return conditions.length > 0 ? and(...conditions)! : sql`true`
}

export function getOrderBy(order: 'desc' | 'asc' = 'desc') {
  return order === 'desc'
    ? desc(workflowExecutionLogs.startedAt)
    : sql`${workflowExecutionLogs.startedAt} ASC`
}
```

--------------------------------------------------------------------------------

---[FILE: meta.ts]---
Location: sim-main/apps/sim/app/api/v1/logs/meta.ts

```typescript
import { checkServerSideUsageLimits } from '@/lib/billing'
import { getHighestPrioritySubscription } from '@/lib/billing/core/subscription'
import { getEffectiveCurrentPeriodCost } from '@/lib/billing/core/usage'
import { RateLimiter } from '@/lib/core/rate-limiter'

export interface UserLimits {
  workflowExecutionRateLimit: {
    sync: {
      requestsPerMinute: number
      maxBurst: number
      remaining: number
      resetAt: string
    }
    async: {
      requestsPerMinute: number
      maxBurst: number
      remaining: number
      resetAt: string
    }
  }
  usage: {
    currentPeriodCost: number
    limit: number
    plan: string
    isExceeded: boolean
  }
}

export async function getUserLimits(userId: string): Promise<UserLimits> {
  const [userSubscription, usageCheck, effectiveCost, rateLimiter] = await Promise.all([
    getHighestPrioritySubscription(userId),
    checkServerSideUsageLimits(userId),
    getEffectiveCurrentPeriodCost(userId),
    Promise.resolve(new RateLimiter()),
  ])

  const [syncStatus, asyncStatus] = await Promise.all([
    rateLimiter.getRateLimitStatusWithSubscription(userId, userSubscription, 'api', false),
    rateLimiter.getRateLimitStatusWithSubscription(userId, userSubscription, 'api', true),
  ])

  return {
    workflowExecutionRateLimit: {
      sync: {
        requestsPerMinute: syncStatus.requestsPerMinute,
        maxBurst: syncStatus.maxBurst,
        remaining: syncStatus.remaining,
        resetAt: syncStatus.resetAt.toISOString(),
      },
      async: {
        requestsPerMinute: asyncStatus.requestsPerMinute,
        maxBurst: asyncStatus.maxBurst,
        remaining: asyncStatus.remaining,
        resetAt: asyncStatus.resetAt.toISOString(),
      },
    },
    usage: {
      currentPeriodCost: effectiveCost,
      limit: usageCheck.limit,
      plan: userSubscription?.plan || 'free',
      isExceeded: usageCheck.isExceeded,
    },
  }
}

export function createApiResponse<T>(
  data: T,
  limits: UserLimits,
  apiRateLimit: { limit: number; remaining: number; resetAt: Date }
) {
  return {
    body: {
      ...data,
      limits,
    },
    headers: {
      'X-RateLimit-Limit': apiRateLimit.limit.toString(),
      'X-RateLimit-Remaining': apiRateLimit.remaining.toString(),
      'X-RateLimit-Reset': apiRateLimit.resetAt.toISOString(),
    },
  }
}
```

--------------------------------------------------------------------------------

````
