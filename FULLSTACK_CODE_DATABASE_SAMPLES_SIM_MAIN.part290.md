---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 290
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 290 of 933)

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
Location: sim-main/apps/sim/app/api/mcp/tools/stored/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { workflow, workflowBlocks } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { createLogger } from '@/lib/logs/console/logger'
import { withMcpAuth } from '@/lib/mcp/middleware'
import { createMcpErrorResponse, createMcpSuccessResponse } from '@/lib/mcp/utils'

const logger = createLogger('McpStoredToolsAPI')

export const dynamic = 'force-dynamic'

interface StoredMcpTool {
  workflowId: string
  workflowName: string
  serverId: string
  serverUrl?: string
  toolName: string
  schema?: Record<string, unknown>
}

/**
 * GET - Get all stored MCP tools from workflows in the workspace
 *
 * Scans all workflows in the workspace and extracts MCP tools that have been
 * added to agent blocks. Returns the stored state of each tool for comparison
 * against current server state.
 */
export const GET = withMcpAuth('read')(
  async (request: NextRequest, { userId, workspaceId, requestId }) => {
    try {
      logger.info(`[${requestId}] Fetching stored MCP tools for workspace ${workspaceId}`)

      // Get all workflows in workspace
      const workflows = await db
        .select({
          id: workflow.id,
          name: workflow.name,
        })
        .from(workflow)
        .where(eq(workflow.workspaceId, workspaceId))

      const workflowMap = new Map(workflows.map((w) => [w.id, w.name]))
      const workflowIds = workflows.map((w) => w.id)

      if (workflowIds.length === 0) {
        return createMcpSuccessResponse({ tools: [] })
      }

      // Get all agent blocks from these workflows
      const agentBlocks = await db
        .select({
          workflowId: workflowBlocks.workflowId,
          subBlocks: workflowBlocks.subBlocks,
        })
        .from(workflowBlocks)
        .where(eq(workflowBlocks.type, 'agent'))

      const storedTools: StoredMcpTool[] = []

      for (const block of agentBlocks) {
        if (!workflowMap.has(block.workflowId)) continue

        const subBlocks = block.subBlocks as Record<string, unknown> | null
        if (!subBlocks) continue

        const toolsSubBlock = subBlocks.tools as Record<string, unknown> | undefined
        const toolsValue = toolsSubBlock?.value

        if (!toolsValue || !Array.isArray(toolsValue)) continue

        for (const tool of toolsValue) {
          if (tool.type !== 'mcp') continue

          const params = tool.params as Record<string, unknown> | undefined
          if (!params?.serverId || !params?.toolName) continue

          storedTools.push({
            workflowId: block.workflowId,
            workflowName: workflowMap.get(block.workflowId) || 'Untitled',
            serverId: params.serverId as string,
            serverUrl: params.serverUrl as string | undefined,
            toolName: params.toolName as string,
            schema: tool.schema as Record<string, unknown> | undefined,
          })
        }
      }

      logger.info(
        `[${requestId}] Found ${storedTools.length} stored MCP tools across ${workflows.length} workflows`
      )

      return createMcpSuccessResponse({ tools: storedTools })
    } catch (error) {
      logger.error(`[${requestId}] Error fetching stored MCP tools:`, error)
      return createMcpErrorResponse(
        error instanceof Error ? error : new Error('Failed to fetch stored MCP tools'),
        'Failed to fetch stored MCP tools',
        500
      )
    }
  }
)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/memory/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { memory, workflowBlocks } from '@sim/db/schema'
import { and, eq, inArray, isNull, like } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { getWorkflowAccessContext } from '@/lib/workflows/utils'

const logger = createLogger('MemoryAPI')

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Parse memory key into conversationId and blockId
 * Key format: conversationId:blockId
 * @param key The memory key to parse
 * @returns Object with conversationId and blockId, or null if invalid
 */
function parseMemoryKey(key: string): { conversationId: string; blockId: string } | null {
  const parts = key.split(':')
  if (parts.length !== 2) {
    return null
  }
  return {
    conversationId: parts[0],
    blockId: parts[1],
  }
}

/**
 * GET handler for searching and retrieving memories
 * Supports query parameters:
 * - query: Search string for memory keys
 * - type: Filter by memory type
 * - limit: Maximum number of results (default: 50)
 * - workflowId: Filter by workflow ID (required)
 */
export async function GET(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request)
    if (!authResult.success || !authResult.userId) {
      logger.warn(`[${requestId}] Unauthorized memory access attempt`)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: authResult.error || 'Authentication required',
          },
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Processing memory search request`)

    const url = new URL(request.url)
    const workflowId = url.searchParams.get('workflowId')
    const searchQuery = url.searchParams.get('query')
    const blockNameFilter = url.searchParams.get('blockName')
    const limit = Number.parseInt(url.searchParams.get('limit') || '50')

    if (!workflowId) {
      logger.warn(`[${requestId}] Missing required parameter: workflowId`)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'workflowId parameter is required',
          },
        },
        { status: 400 }
      )
    }

    const accessContext = await getWorkflowAccessContext(workflowId, authResult.userId)
    if (!accessContext) {
      logger.warn(`[${requestId}] Workflow ${workflowId} not found for user ${authResult.userId}`)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Workflow not found',
          },
        },
        { status: 404 }
      )
    }

    const { workspacePermission, isOwner } = accessContext

    if (!isOwner && !workspacePermission) {
      logger.warn(
        `[${requestId}] User ${authResult.userId} denied access to workflow ${workflowId}`
      )
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Access denied to this workflow',
          },
        },
        { status: 403 }
      )
    }

    logger.info(
      `[${requestId}] User ${authResult.userId} (${authResult.authType}) accessing memories for workflow ${workflowId}`
    )

    const conditions = []

    conditions.push(isNull(memory.deletedAt))

    conditions.push(eq(memory.workflowId, workflowId))

    let blockIdsToFilter: string[] | null = null
    if (blockNameFilter) {
      const blocks = await db
        .select({ id: workflowBlocks.id })
        .from(workflowBlocks)
        .where(
          and(eq(workflowBlocks.workflowId, workflowId), eq(workflowBlocks.name, blockNameFilter))
        )

      if (blocks.length === 0) {
        logger.info(
          `[${requestId}] No blocks found with name "${blockNameFilter}" for workflow: ${workflowId}`
        )
        return NextResponse.json(
          {
            success: true,
            data: { memories: [] },
          },
          { status: 200 }
        )
      }

      blockIdsToFilter = blocks.map((b) => b.id)
    }

    if (searchQuery) {
      conditions.push(like(memory.key, `%${searchQuery}%`))
    }

    const rawMemories = await db
      .select()
      .from(memory)
      .where(and(...conditions))
      .orderBy(memory.createdAt)
      .limit(limit)

    const filteredMemories = blockIdsToFilter
      ? rawMemories.filter((mem) => {
          const parsed = parseMemoryKey(mem.key)
          return parsed && blockIdsToFilter.includes(parsed.blockId)
        })
      : rawMemories

    const blockIds = new Set<string>()
    const parsedKeys = new Map<string, { conversationId: string; blockId: string }>()

    for (const mem of filteredMemories) {
      const parsed = parseMemoryKey(mem.key)
      if (parsed) {
        blockIds.add(parsed.blockId)
        parsedKeys.set(mem.key, parsed)
      }
    }

    const blockNameMap = new Map<string, string>()
    if (blockIds.size > 0) {
      const blocks = await db
        .select({ id: workflowBlocks.id, name: workflowBlocks.name })
        .from(workflowBlocks)
        .where(
          and(
            eq(workflowBlocks.workflowId, workflowId),
            inArray(workflowBlocks.id, Array.from(blockIds))
          )
        )

      for (const block of blocks) {
        blockNameMap.set(block.id, block.name)
      }
    }

    const enrichedMemories = filteredMemories.map((mem) => {
      const parsed = parsedKeys.get(mem.key)

      if (!parsed) {
        return {
          conversationId: mem.key,
          blockId: 'unknown',
          blockName: 'unknown',
          data: mem.data,
        }
      }

      const { conversationId, blockId } = parsed
      const blockName = blockNameMap.get(blockId) || 'unknown'

      return {
        conversationId,
        blockId,
        blockName,
        data: mem.data,
      }
    })

    logger.info(
      `[${requestId}] Found ${enrichedMemories.length} memories for workflow: ${workflowId}`
    )
    return NextResponse.json(
      {
        success: true,
        data: { memories: enrichedMemories },
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || 'Failed to search memories',
        },
      },
      { status: 500 }
    )
  }
}

/**
 * POST handler for creating new memories
 * Requires:
 * - key: Unique identifier for the memory (within workflow scope)
 * - type: Memory type ('agent')
 * - data: Memory content (agent message with role and content)
 * - workflowId: ID of the workflow this memory belongs to
 */
export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request)
    if (!authResult.success || !authResult.userId) {
      logger.warn(`[${requestId}] Unauthorized memory creation attempt`)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: authResult.error || 'Authentication required',
          },
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Processing memory creation request`)

    const body = await request.json()
    const { key, data, workflowId } = body

    if (!key) {
      logger.warn(`[${requestId}] Missing required field: key`)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Memory key is required',
          },
        },
        { status: 400 }
      )
    }

    if (!data) {
      logger.warn(`[${requestId}] Missing required field: data`)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Memory data is required',
          },
        },
        { status: 400 }
      )
    }

    if (!workflowId) {
      logger.warn(`[${requestId}] Missing required field: workflowId`)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'workflowId is required',
          },
        },
        { status: 400 }
      )
    }

    const accessContext = await getWorkflowAccessContext(workflowId, authResult.userId)
    if (!accessContext) {
      logger.warn(`[${requestId}] Workflow ${workflowId} not found for user ${authResult.userId}`)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Workflow not found',
          },
        },
        { status: 404 }
      )
    }

    const { workspacePermission, isOwner } = accessContext

    const hasWritePermission =
      isOwner || workspacePermission === 'write' || workspacePermission === 'admin'

    if (!hasWritePermission) {
      logger.warn(
        `[${requestId}] User ${authResult.userId} denied write access to workflow ${workflowId}`
      )
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Write access denied to this workflow',
          },
        },
        { status: 403 }
      )
    }

    logger.info(
      `[${requestId}] User ${authResult.userId} (${authResult.authType}) creating memory for workflow ${workflowId}`
    )

    const dataToValidate = Array.isArray(data) ? data : [data]

    for (const msg of dataToValidate) {
      if (!msg || typeof msg !== 'object' || !msg.role || !msg.content) {
        logger.warn(`[${requestId}] Missing required message fields`)
        return NextResponse.json(
          {
            success: false,
            error: {
              message: 'Memory requires messages with role and content',
            },
          },
          { status: 400 }
        )
      }

      if (!['user', 'assistant', 'system'].includes(msg.role)) {
        logger.warn(`[${requestId}] Invalid message role: ${msg.role}`)
        return NextResponse.json(
          {
            success: false,
            error: {
              message: 'Message role must be user, assistant, or system',
            },
          },
          { status: 400 }
        )
      }
    }

    const initialData = Array.isArray(data) ? data : [data]
    const now = new Date()
    const id = `mem_${crypto.randomUUID().replace(/-/g, '')}`

    const { sql } = await import('drizzle-orm')

    await db
      .insert(memory)
      .values({
        id,
        workflowId,
        key,
        data: initialData,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [memory.workflowId, memory.key],
        set: {
          data: sql`${memory.data} || ${JSON.stringify(initialData)}::jsonb`,
          updatedAt: now,
        },
      })

    logger.info(
      `[${requestId}] Memory operation successful (atomic): ${key} for workflow: ${workflowId}`
    )

    const allMemories = await db
      .select()
      .from(memory)
      .where(and(eq(memory.key, key), eq(memory.workflowId, workflowId), isNull(memory.deletedAt)))
      .orderBy(memory.createdAt)

    if (allMemories.length === 0) {
      logger.warn(`[${requestId}] No memories found after creating/updating memory: ${key}`)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Failed to retrieve memory after creation/update',
          },
        },
        { status: 500 }
      )
    }

    const memoryRecord = allMemories[0]
    const parsed = parseMemoryKey(memoryRecord.key)

    let enrichedMemory
    if (!parsed) {
      enrichedMemory = {
        conversationId: memoryRecord.key,
        blockId: 'unknown',
        blockName: 'unknown',
        data: memoryRecord.data,
      }
    } else {
      const { conversationId, blockId } = parsed
      const blockName = await (async () => {
        const blocks = await db
          .select({ name: workflowBlocks.name })
          .from(workflowBlocks)
          .where(and(eq(workflowBlocks.id, blockId), eq(workflowBlocks.workflowId, workflowId)))
          .limit(1)
        return blocks.length > 0 ? blocks[0].name : 'unknown'
      })()

      enrichedMemory = {
        conversationId,
        blockId,
        blockName,
        data: memoryRecord.data,
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: enrichedMemory,
      },
      { status: 200 }
    )
  } catch (error: any) {
    if (error.code === '23505') {
      logger.warn(`[${requestId}] Duplicate key violation`)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Memory with this key already exists',
          },
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || 'Failed to create memory',
        },
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE handler for pattern-based memory deletion
 * Supports query parameters:
 * - workflowId: Required
 * - conversationId: Optional - delete all memories for this conversation
 * - blockId: Optional - delete all memories for this block
 * - blockName: Optional - delete all memories for blocks with this name
 */
export async function DELETE(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request)
    if (!authResult.success || !authResult.userId) {
      logger.warn(`[${requestId}] Unauthorized memory deletion attempt`)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: authResult.error || 'Authentication required',
          },
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Processing memory deletion request`)

    const url = new URL(request.url)
    const workflowId = url.searchParams.get('workflowId')
    const conversationId = url.searchParams.get('conversationId')
    const blockId = url.searchParams.get('blockId')
    const blockName = url.searchParams.get('blockName')

    if (!workflowId) {
      logger.warn(`[${requestId}] Missing required parameter: workflowId`)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'workflowId parameter is required',
          },
        },
        { status: 400 }
      )
    }

    if (!conversationId && !blockId && !blockName) {
      logger.warn(`[${requestId}] No filter parameters provided`)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'At least one of conversationId, blockId, or blockName must be provided',
          },
        },
        { status: 400 }
      )
    }

    const accessContext = await getWorkflowAccessContext(workflowId, authResult.userId)
    if (!accessContext) {
      logger.warn(`[${requestId}] Workflow ${workflowId} not found for user ${authResult.userId}`)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Workflow not found',
          },
        },
        { status: 404 }
      )
    }

    const { workspacePermission, isOwner } = accessContext

    const hasWritePermission =
      isOwner || workspacePermission === 'write' || workspacePermission === 'admin'

    if (!hasWritePermission) {
      logger.warn(
        `[${requestId}] User ${authResult.userId} denied delete access to workflow ${workflowId}`
      )
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Write access denied to this workflow',
          },
        },
        { status: 403 }
      )
    }

    logger.info(
      `[${requestId}] User ${authResult.userId} (${authResult.authType}) deleting memories for workflow ${workflowId}`
    )

    let deletedCount = 0

    if (conversationId && blockId) {
      const key = `${conversationId}:${blockId}`
      const result = await db
        .delete(memory)
        .where(and(eq(memory.key, key), eq(memory.workflowId, workflowId)))
        .returning({ id: memory.id })

      deletedCount = result.length
    } else if (conversationId && blockName) {
      const blocks = await db
        .select({ id: workflowBlocks.id })
        .from(workflowBlocks)
        .where(and(eq(workflowBlocks.workflowId, workflowId), eq(workflowBlocks.name, blockName)))

      if (blocks.length === 0) {
        return NextResponse.json(
          {
            success: true,
            data: {
              message: `No blocks found with name "${blockName}"`,
              deletedCount: 0,
            },
          },
          { status: 200 }
        )
      }

      for (const block of blocks) {
        const key = `${conversationId}:${block.id}`
        const result = await db
          .delete(memory)
          .where(and(eq(memory.key, key), eq(memory.workflowId, workflowId)))
          .returning({ id: memory.id })

        deletedCount += result.length
      }
    } else if (conversationId) {
      const pattern = `${conversationId}:%`
      const result = await db
        .delete(memory)
        .where(and(like(memory.key, pattern), eq(memory.workflowId, workflowId)))
        .returning({ id: memory.id })

      deletedCount = result.length
    } else if (blockId) {
      const pattern = `%:${blockId}`
      const result = await db
        .delete(memory)
        .where(and(like(memory.key, pattern), eq(memory.workflowId, workflowId)))
        .returning({ id: memory.id })

      deletedCount = result.length
    } else if (blockName) {
      const blocks = await db
        .select({ id: workflowBlocks.id })
        .from(workflowBlocks)
        .where(and(eq(workflowBlocks.workflowId, workflowId), eq(workflowBlocks.name, blockName)))

      if (blocks.length === 0) {
        return NextResponse.json(
          {
            success: true,
            data: {
              message: `No blocks found with name "${blockName}"`,
              deletedCount: 0,
            },
          },
          { status: 200 }
        )
      }

      for (const block of blocks) {
        const pattern = `%:${block.id}`
        const result = await db
          .delete(memory)
          .where(and(like(memory.key, pattern), eq(memory.workflowId, workflowId)))
          .returning({ id: memory.id })

        deletedCount += result.length
      }
    }

    logger.info(
      `[${requestId}] Successfully deleted ${deletedCount} memories for workflow: ${workflowId}`
    )
    return NextResponse.json(
      {
        success: true,
        data: {
          message:
            deletedCount > 0
              ? `Successfully deleted ${deletedCount} memories`
              : 'No memories found matching the criteria',
          deletedCount,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    logger.error(`[${requestId}] Error deleting memories`, { error })
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || 'Failed to delete memories',
        },
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/memory/[id]/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { memory, workflowBlocks } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('MemoryByIdAPI')

/**
 * Parse memory key into conversationId and blockId
 * Key format: conversationId:blockId
 */
function parseMemoryKey(key: string): { conversationId: string; blockId: string } | null {
  const parts = key.split(':')
  if (parts.length !== 2) {
    return null
  }
  return {
    conversationId: parts[0],
    blockId: parts[1],
  }
}

/**
 * Lookup block name from block ID
 */
async function getBlockName(blockId: string, workflowId: string): Promise<string | undefined> {
  try {
    const result = await db
      .select({ name: workflowBlocks.name })
      .from(workflowBlocks)
      .where(and(eq(workflowBlocks.id, blockId), eq(workflowBlocks.workflowId, workflowId)))
      .limit(1)

    if (result.length === 0) {
      return undefined
    }

    return result[0].name
  } catch (error) {
    logger.error('Error looking up block name', { error, blockId, workflowId })
    return undefined
  }
}

const memoryQuerySchema = z.object({
  workflowId: z.string().uuid('Invalid workflow ID format'),
})

const agentMemoryDataSchema = z.object({
  role: z.enum(['user', 'assistant', 'system'], {
    errorMap: () => ({ message: 'Role must be user, assistant, or system' }),
  }),
  content: z.string().min(1, 'Content is required'),
})

const genericMemoryDataSchema = z.record(z.unknown())

const memoryPutBodySchema = z.object({
  data: z.union([agentMemoryDataSchema, genericMemoryDataSchema], {
    errorMap: () => ({ message: 'Invalid memory data structure' }),
  }),
  workflowId: z.string().uuid('Invalid workflow ID format'),
})

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET handler for retrieving a specific memory by ID
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    logger.info(`[${requestId}] Processing memory get request for ID: ${id}`)

    const url = new URL(request.url)
    const workflowId = url.searchParams.get('workflowId')

    const validation = memoryQuerySchema.safeParse({ workflowId })

    if (!validation.success) {
      const errorMessage = validation.error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ')
      logger.warn(`[${requestId}] Validation error: ${errorMessage}`)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: errorMessage,
          },
        },
        { status: 400 }
      )
    }

    const { workflowId: validatedWorkflowId } = validation.data

    const memories = await db
      .select()
      .from(memory)
      .where(and(eq(memory.key, id), eq(memory.workflowId, validatedWorkflowId)))
      .orderBy(memory.createdAt)
      .limit(1)

    if (memories.length === 0) {
      logger.warn(`[${requestId}] Memory not found: ${id} for workflow: ${validatedWorkflowId}`)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Memory not found',
          },
        },
        { status: 404 }
      )
    }

    const mem = memories[0]
    const parsed = parseMemoryKey(mem.key)

    let enrichedMemory
    if (!parsed) {
      enrichedMemory = {
        conversationId: mem.key,
        blockId: 'unknown',
        blockName: 'unknown',
        data: mem.data,
      }
    } else {
      const { conversationId, blockId } = parsed
      const blockName = (await getBlockName(blockId, validatedWorkflowId)) || 'unknown'

      enrichedMemory = {
        conversationId,
        blockId,
        blockName,
        data: mem.data,
      }
    }

    logger.info(
      `[${requestId}] Memory retrieved successfully: ${id} for workflow: ${validatedWorkflowId}`
    )
    return NextResponse.json(
      {
        success: true,
        data: enrichedMemory,
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || 'Failed to retrieve memory',
        },
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE handler for removing a specific memory
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    logger.info(`[${requestId}] Processing memory delete request for ID: ${id}`)

    const url = new URL(request.url)
    const workflowId = url.searchParams.get('workflowId')

    const validation = memoryQuerySchema.safeParse({ workflowId })

    if (!validation.success) {
      const errorMessage = validation.error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ')
      logger.warn(`[${requestId}] Validation error: ${errorMessage}`)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: errorMessage,
          },
        },
        { status: 400 }
      )
    }

    const { workflowId: validatedWorkflowId } = validation.data

    const existingMemory = await db
      .select({ id: memory.id })
      .from(memory)
      .where(and(eq(memory.key, id), eq(memory.workflowId, validatedWorkflowId)))
      .limit(1)

    if (existingMemory.length === 0) {
      logger.warn(`[${requestId}] Memory not found: ${id} for workflow: ${validatedWorkflowId}`)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Memory not found',
          },
        },
        { status: 404 }
      )
    }

    await db
      .delete(memory)
      .where(and(eq(memory.key, id), eq(memory.workflowId, validatedWorkflowId)))

    logger.info(
      `[${requestId}] Memory deleted successfully: ${id} for workflow: ${validatedWorkflowId}`
    )
    return NextResponse.json(
      {
        success: true,
        data: { message: 'Memory deleted successfully' },
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || 'Failed to delete memory',
        },
      },
      { status: 500 }
    )
  }
}

/**
 * PUT handler for updating a specific memory
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    logger.info(`[${requestId}] Processing memory update request for ID: ${id}`)

    let validatedData
    let validatedWorkflowId
    try {
      const body = await request.json()
      const validation = memoryPutBodySchema.safeParse(body)

      if (!validation.success) {
        const errorMessage = validation.error.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ')
        logger.warn(`[${requestId}] Validation error: ${errorMessage}`)
        return NextResponse.json(
          {
            success: false,
            error: {
              message: `Invalid request body: ${errorMessage}`,
            },
          },
          { status: 400 }
        )
      }

      validatedData = validation.data.data
      validatedWorkflowId = validation.data.workflowId
    } catch (error: any) {
      logger.warn(`[${requestId}] Failed to parse request body: ${error.message}`)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Invalid JSON in request body',
          },
        },
        { status: 400 }
      )
    }

    const existingMemories = await db
      .select()
      .from(memory)
      .where(and(eq(memory.key, id), eq(memory.workflowId, validatedWorkflowId)))
      .limit(1)

    if (existingMemories.length === 0) {
      logger.warn(`[${requestId}] Memory not found: ${id} for workflow: ${validatedWorkflowId}`)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Memory not found',
          },
        },
        { status: 404 }
      )
    }

    const agentValidation = agentMemoryDataSchema.safeParse(validatedData)
    if (!agentValidation.success) {
      const errorMessage = agentValidation.error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ')
      logger.warn(`[${requestId}] Agent memory validation error: ${errorMessage}`)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Invalid agent memory data: ${errorMessage}`,
          },
        },
        { status: 400 }
      )
    }

    const now = new Date()
    await db
      .update(memory)
      .set({
        data: validatedData,
        updatedAt: now,
      })
      .where(and(eq(memory.key, id), eq(memory.workflowId, validatedWorkflowId)))

    const updatedMemories = await db
      .select()
      .from(memory)
      .where(and(eq(memory.key, id), eq(memory.workflowId, validatedWorkflowId)))
      .limit(1)

    const mem = updatedMemories[0]
    const parsed = parseMemoryKey(mem.key)

    let enrichedMemory
    if (!parsed) {
      enrichedMemory = {
        conversationId: mem.key,
        blockId: 'unknown',
        blockName: 'unknown',
        data: mem.data,
      }
    } else {
      const { conversationId, blockId } = parsed
      const blockName = (await getBlockName(blockId, validatedWorkflowId)) || 'unknown'

      enrichedMemory = {
        conversationId,
        blockId,
        blockName,
        data: mem.data,
      }
    }

    logger.info(
      `[${requestId}] Memory updated successfully: ${id} for workflow: ${validatedWorkflowId}`
    )
    return NextResponse.json(
      {
        success: true,
        data: enrichedMemory,
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message || 'Failed to update memory',
        },
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/notifications/poll/route.ts
Signals: Next.js

```typescript
import { nanoid } from 'nanoid'
import { type NextRequest, NextResponse } from 'next/server'
import { verifyCronAuth } from '@/lib/auth/internal'
import { acquireLock, releaseLock } from '@/lib/core/config/redis'
import { createLogger } from '@/lib/logs/console/logger'
import { pollInactivityAlerts } from '@/lib/notifications/inactivity-polling'

const logger = createLogger('InactivityAlertPoll')

export const maxDuration = 120

const LOCK_KEY = 'inactivity-alert-polling-lock'
const LOCK_TTL_SECONDS = 120

export async function GET(request: NextRequest) {
  const requestId = nanoid()
  logger.info(`Inactivity alert polling triggered (${requestId})`)

  let lockAcquired = false

  try {
    const authError = verifyCronAuth(request, 'Inactivity alert polling')
    if (authError) {
      return authError
    }

    lockAcquired = await acquireLock(LOCK_KEY, requestId, LOCK_TTL_SECONDS)

    if (!lockAcquired) {
      return NextResponse.json(
        {
          success: true,
          message: 'Polling already in progress – skipped',
          requestId,
          status: 'skip',
        },
        { status: 202 }
      )
    }

    const results = await pollInactivityAlerts()

    return NextResponse.json({
      success: true,
      message: 'Inactivity alert polling completed',
      requestId,
      status: 'completed',
      ...results,
    })
  } catch (error) {
    logger.error(`Error during inactivity alert polling (${requestId}):`, error)
    return NextResponse.json(
      {
        success: false,
        message: 'Inactivity alert polling failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId,
      },
      { status: 500 }
    )
  } finally {
    if (lockAcquired) {
      await releaseLock(LOCK_KEY, requestId).catch(() => {})
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/organizations/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { member, organization } from '@sim/db/schema'
import { and, eq, or } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createOrganizationForTeamPlan } from '@/lib/billing/organization'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('OrganizationsAPI')

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userOrganizations = await db
      .select({
        id: organization.id,
        name: organization.name,
        role: member.role,
      })
      .from(member)
      .innerJoin(organization, eq(member.organizationId, organization.id))
      .where(
        and(
          eq(member.userId, session.user.id),
          or(eq(member.role, 'owner'), eq(member.role, 'admin'))
        )
      )

    const anyMembership = await db
      .select({ id: member.id })
      .from(member)
      .where(eq(member.userId, session.user.id))
      .limit(1)

    return NextResponse.json({
      organizations: userOrganizations,
      isMemberOfAnyOrg: anyMembership.length > 0,
    })
  } catch (error) {
    logger.error('Failed to fetch organizations', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized - no active session' }, { status: 401 })
    }

    const user = session.user

    // Parse request body for optional name and slug
    let organizationName = user.name
    let organizationSlug: string | undefined

    try {
      const body = await request.json()
      if (body.name && typeof body.name === 'string') {
        organizationName = body.name
      }
      if (body.slug && typeof body.slug === 'string') {
        organizationSlug = body.slug
      }
    } catch {
      // If no body or invalid JSON, use defaults
    }

    logger.info('Creating organization for team plan', {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      organizationName,
      organizationSlug,
    })

    // Enforce: a user can only belong to one organization at a time
    const existingOrgMembership = await db
      .select({ id: member.id })
      .from(member)
      .where(eq(member.userId, user.id))
      .limit(1)

    if (existingOrgMembership.length > 0) {
      return NextResponse.json(
        {
          error:
            'You are already a member of an organization. Leave your current organization before creating a new one.',
        },
        { status: 409 }
      )
    }

    // Create organization and make user the owner/admin
    const organizationId = await createOrganizationForTeamPlan(
      user.id,
      organizationName || undefined,
      user.email,
      organizationSlug
    )

    logger.info('Successfully created organization for team plan', {
      userId: user.id,
      organizationId,
    })

    return NextResponse.json({
      success: true,
      organizationId,
    })
  } catch (error) {
    logger.error('Failed to create organization for team plan', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        error: 'Failed to create organization',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

````
