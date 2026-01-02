---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 287
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 287 of 933)

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
Location: sim-main/apps/sim/app/api/knowledge/[id]/documents/[documentId]/chunks/[chunkId]/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { deleteChunk, updateChunk } from '@/lib/knowledge/chunks/service'
import { createLogger } from '@/lib/logs/console/logger'
import { checkChunkAccess } from '@/app/api/knowledge/utils'

const logger = createLogger('ChunkByIdAPI')

const UpdateChunkSchema = z.object({
  content: z.string().min(1, 'Content is required').optional(),
  enabled: z.boolean().optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string; chunkId: string }> }
) {
  const requestId = randomUUID().slice(0, 8)
  const { id: knowledgeBaseId, documentId, chunkId } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized chunk access attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accessCheck = await checkChunkAccess(
      knowledgeBaseId,
      documentId,
      chunkId,
      session.user.id
    )

    if (!accessCheck.hasAccess) {
      if (accessCheck.notFound) {
        logger.warn(
          `[${requestId}] ${accessCheck.reason}: KB=${knowledgeBaseId}, Doc=${documentId}, Chunk=${chunkId}`
        )
        return NextResponse.json({ error: accessCheck.reason }, { status: 404 })
      }
      logger.warn(
        `[${requestId}] User ${session.user.id} attempted unauthorized chunk access: ${accessCheck.reason}`
      )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.info(
      `[${requestId}] Retrieved chunk: ${chunkId} from document ${documentId} in knowledge base ${knowledgeBaseId}`
    )

    return NextResponse.json({
      success: true,
      data: accessCheck.chunk,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching chunk`, error)
    return NextResponse.json({ error: 'Failed to fetch chunk' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string; chunkId: string }> }
) {
  const requestId = randomUUID().slice(0, 8)
  const { id: knowledgeBaseId, documentId, chunkId } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized chunk update attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accessCheck = await checkChunkAccess(
      knowledgeBaseId,
      documentId,
      chunkId,
      session.user.id
    )

    if (!accessCheck.hasAccess) {
      if (accessCheck.notFound) {
        logger.warn(
          `[${requestId}] ${accessCheck.reason}: KB=${knowledgeBaseId}, Doc=${documentId}, Chunk=${chunkId}`
        )
        return NextResponse.json({ error: accessCheck.reason }, { status: 404 })
      }
      logger.warn(
        `[${requestId}] User ${session.user.id} attempted unauthorized chunk update: ${accessCheck.reason}`
      )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    try {
      const validatedData = UpdateChunkSchema.parse(body)

      const updatedChunk = await updateChunk(chunkId, validatedData, requestId)

      logger.info(
        `[${requestId}] Chunk updated: ${chunkId} in document ${documentId} in knowledge base ${knowledgeBaseId}`
      )

      return NextResponse.json({
        success: true,
        data: updatedChunk,
      })
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        logger.warn(`[${requestId}] Invalid chunk update data`, {
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
    logger.error(`[${requestId}] Error updating chunk`, error)
    return NextResponse.json({ error: 'Failed to update chunk' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string; chunkId: string }> }
) {
  const requestId = randomUUID().slice(0, 8)
  const { id: knowledgeBaseId, documentId, chunkId } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized chunk delete attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accessCheck = await checkChunkAccess(
      knowledgeBaseId,
      documentId,
      chunkId,
      session.user.id
    )

    if (!accessCheck.hasAccess) {
      if (accessCheck.notFound) {
        logger.warn(
          `[${requestId}] ${accessCheck.reason}: KB=${knowledgeBaseId}, Doc=${documentId}, Chunk=${chunkId}`
        )
        return NextResponse.json({ error: accessCheck.reason }, { status: 404 })
      }
      logger.warn(
        `[${requestId}] User ${session.user.id} attempted unauthorized chunk deletion: ${accessCheck.reason}`
      )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await deleteChunk(chunkId, documentId, requestId)

    logger.info(
      `[${requestId}] Chunk deleted: ${chunkId} from document ${documentId} in knowledge base ${knowledgeBaseId}`
    )

    return NextResponse.json({
      success: true,
      data: { message: 'Chunk deleted successfully' },
    })
  } catch (error) {
    logger.error(`[${requestId}] Error deleting chunk`, error)
    return NextResponse.json({ error: 'Failed to delete chunk' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/knowledge/[id]/documents/[documentId]/tag-definitions/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { SUPPORTED_FIELD_TYPES } from '@/lib/knowledge/constants'
import {
  cleanupUnusedTagDefinitions,
  createOrUpdateTagDefinitionsBulk,
  deleteAllTagDefinitions,
  getDocumentTagDefinitions,
} from '@/lib/knowledge/tags/service'
import type { BulkTagDefinitionsData } from '@/lib/knowledge/tags/types'
import { createLogger } from '@/lib/logs/console/logger'
import { checkDocumentAccess, checkDocumentWriteAccess } from '@/app/api/knowledge/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('DocumentTagDefinitionsAPI')

const TagDefinitionSchema = z.object({
  tagSlot: z.string(), // Will be validated against field type slots
  displayName: z.string().min(1, 'Display name is required').max(100, 'Display name too long'),
  fieldType: z.enum(SUPPORTED_FIELD_TYPES as [string, ...string[]]).default('text'),
  // Optional: for editing existing definitions
  _originalDisplayName: z.string().optional(),
})

const BulkTagDefinitionsSchema = z.object({
  definitions: z.array(TagDefinitionSchema),
})

// GET /api/knowledge/[id]/documents/[documentId]/tag-definitions - Get tag definitions for a document
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  const requestId = randomUUID().slice(0, 8)
  const { id: knowledgeBaseId, documentId } = await params

  try {
    logger.info(`[${requestId}] Getting tag definitions for document ${documentId}`)

    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify document exists and belongs to the knowledge base
    const accessCheck = await checkDocumentAccess(knowledgeBaseId, documentId, session.user.id)
    if (!accessCheck.hasAccess) {
      if (accessCheck.notFound) {
        logger.warn(
          `[${requestId}] ${accessCheck.reason}: KB=${knowledgeBaseId}, Doc=${documentId}`
        )
        return NextResponse.json({ error: accessCheck.reason }, { status: 404 })
      }
      logger.warn(
        `[${requestId}] User ${session.user.id} attempted unauthorized document access: ${accessCheck.reason}`
      )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tagDefinitions = await getDocumentTagDefinitions(knowledgeBaseId)

    logger.info(`[${requestId}] Retrieved ${tagDefinitions.length} tag definitions`)

    return NextResponse.json({
      success: true,
      data: tagDefinitions,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error getting tag definitions`, error)
    return NextResponse.json({ error: 'Failed to get tag definitions' }, { status: 500 })
  }
}

// POST /api/knowledge/[id]/documents/[documentId]/tag-definitions - Create/update tag definitions
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  const requestId = randomUUID().slice(0, 8)
  const { id: knowledgeBaseId, documentId } = await params

  try {
    logger.info(`[${requestId}] Creating/updating tag definitions for document ${documentId}`)

    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify document exists and user has write access
    const accessCheck = await checkDocumentWriteAccess(knowledgeBaseId, documentId, session.user.id)
    if (!accessCheck.hasAccess) {
      if (accessCheck.notFound) {
        logger.warn(
          `[${requestId}] ${accessCheck.reason}: KB=${knowledgeBaseId}, Doc=${documentId}`
        )
        return NextResponse.json({ error: accessCheck.reason }, { status: 404 })
      }
      logger.warn(
        `[${requestId}] User ${session.user.id} attempted unauthorized document write access: ${accessCheck.reason}`
      )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body
    try {
      body = await req.json()
    } catch (error) {
      logger.error(`[${requestId}] Failed to parse JSON body:`, error)
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
    }

    if (!body || typeof body !== 'object') {
      logger.error(`[${requestId}] Invalid request body:`, body)
      return NextResponse.json(
        { error: 'Request body must be a valid JSON object' },
        { status: 400 }
      )
    }

    const validatedData = BulkTagDefinitionsSchema.parse(body)

    const bulkData: BulkTagDefinitionsData = {
      definitions: validatedData.definitions.map((def) => ({
        tagSlot: def.tagSlot,
        displayName: def.displayName,
        fieldType: def.fieldType,
        originalDisplayName: def._originalDisplayName,
      })),
    }

    const result = await createOrUpdateTagDefinitionsBulk(knowledgeBaseId, bulkData, requestId)

    return NextResponse.json({
      success: true,
      data: {
        created: result.created,
        updated: result.updated,
        errors: result.errors,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    logger.error(`[${requestId}] Error creating/updating tag definitions`, error)
    return NextResponse.json({ error: 'Failed to create/update tag definitions' }, { status: 500 })
  }
}

// DELETE /api/knowledge/[id]/documents/[documentId]/tag-definitions - Delete all tag definitions for a document
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  const requestId = randomUUID().slice(0, 8)
  const { id: knowledgeBaseId, documentId } = await params
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action') // 'cleanup' or 'all'

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify document exists and user has write access
    const accessCheck = await checkDocumentWriteAccess(knowledgeBaseId, documentId, session.user.id)
    if (!accessCheck.hasAccess) {
      if (accessCheck.notFound) {
        logger.warn(
          `[${requestId}] ${accessCheck.reason}: KB=${knowledgeBaseId}, Doc=${documentId}`
        )
        return NextResponse.json({ error: accessCheck.reason }, { status: 404 })
      }
      logger.warn(
        `[${requestId}] User ${session.user.id} attempted unauthorized document write access: ${accessCheck.reason}`
      )
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (action === 'cleanup') {
      // Just run cleanup
      logger.info(`[${requestId}] Running cleanup for KB ${knowledgeBaseId}`)
      const cleanedUpCount = await cleanupUnusedTagDefinitions(knowledgeBaseId, requestId)

      return NextResponse.json({
        success: true,
        data: { cleanedUp: cleanedUpCount },
      })
    }
    // Delete all tag definitions (original behavior)
    logger.info(`[${requestId}] Deleting all tag definitions for KB ${knowledgeBaseId}`)

    const deletedCount = await deleteAllTagDefinitions(knowledgeBaseId, requestId)

    return NextResponse.json({
      success: true,
      message: 'Tag definitions deleted successfully',
      data: { deleted: deletedCount },
    })
  } catch (error) {
    logger.error(`[${requestId}] Error with tag definitions operation`, error)
    return NextResponse.json({ error: 'Failed to process tag definitions' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/knowledge/[id]/next-available-slot/route.ts
Signals: Next.js

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getNextAvailableSlot, getTagDefinitions } from '@/lib/knowledge/tags/service'
import { createLogger } from '@/lib/logs/console/logger'
import { checkKnowledgeBaseAccess } from '@/app/api/knowledge/utils'

const logger = createLogger('NextAvailableSlotAPI')

// GET /api/knowledge/[id]/next-available-slot - Get the next available tag slot for a knowledge base and field type
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = randomUUID().slice(0, 8)
  const { id: knowledgeBaseId } = await params
  const { searchParams } = new URL(req.url)
  const fieldType = searchParams.get('fieldType')

  if (!fieldType) {
    return NextResponse.json({ error: 'fieldType parameter is required' }, { status: 400 })
  }

  try {
    logger.info(
      `[${requestId}] Getting next available slot for knowledge base ${knowledgeBaseId}, fieldType: ${fieldType}`
    )

    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accessCheck = await checkKnowledgeBaseAccess(knowledgeBaseId, session.user.id)
    if (!accessCheck.hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get existing definitions once and reuse
    const existingDefinitions = await getTagDefinitions(knowledgeBaseId)
    const usedSlots = existingDefinitions
      .filter((def) => def.fieldType === fieldType)
      .map((def) => def.tagSlot)

    // Create a map for efficient lookup and pass to avoid redundant query
    const existingBySlot = new Map(existingDefinitions.map((def) => [def.tagSlot as string, def]))
    const nextAvailableSlot = await getNextAvailableSlot(knowledgeBaseId, fieldType, existingBySlot)

    logger.info(
      `[${requestId}] Next available slot for fieldType ${fieldType}: ${nextAvailableSlot}`
    )

    const result = {
      nextAvailableSlot,
      fieldType,
      usedSlots,
      totalSlots: 7,
      availableSlots: nextAvailableSlot ? 7 - usedSlots.length : 0,
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error getting next available slot`, error)
    return NextResponse.json({ error: 'Failed to get next available slot' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/knowledge/[id]/tag-definitions/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { SUPPORTED_FIELD_TYPES } from '@/lib/knowledge/constants'
import { createTagDefinition, getTagDefinitions } from '@/lib/knowledge/tags/service'
import { createLogger } from '@/lib/logs/console/logger'
import { checkKnowledgeBaseAccess } from '@/app/api/knowledge/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('KnowledgeBaseTagDefinitionsAPI')

// GET /api/knowledge/[id]/tag-definitions - Get all tag definitions for a knowledge base
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = randomUUID().slice(0, 8)
  const { id: knowledgeBaseId } = await params

  try {
    logger.info(`[${requestId}] Getting tag definitions for knowledge base ${knowledgeBaseId}`)

    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accessCheck = await checkKnowledgeBaseAccess(knowledgeBaseId, session.user.id)
    if (!accessCheck.hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const tagDefinitions = await getTagDefinitions(knowledgeBaseId)

    logger.info(`[${requestId}] Retrieved ${tagDefinitions.length} tag definitions`)

    return NextResponse.json({
      success: true,
      data: tagDefinitions,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error getting tag definitions`, error)
    return NextResponse.json({ error: 'Failed to get tag definitions' }, { status: 500 })
  }
}

// POST /api/knowledge/[id]/tag-definitions - Create a new tag definition
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = randomUUID().slice(0, 8)
  const { id: knowledgeBaseId } = await params

  try {
    logger.info(`[${requestId}] Creating tag definition for knowledge base ${knowledgeBaseId}`)

    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accessCheck = await checkKnowledgeBaseAccess(knowledgeBaseId, session.user.id)
    if (!accessCheck.hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()

    const CreateTagDefinitionSchema = z.object({
      tagSlot: z.string().min(1, 'Tag slot is required'),
      displayName: z.string().min(1, 'Display name is required'),
      fieldType: z.enum(SUPPORTED_FIELD_TYPES as [string, ...string[]], {
        errorMap: () => ({ message: 'Invalid field type' }),
      }),
    })

    let validatedData
    try {
      validatedData = CreateTagDefinitionSchema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid request data', details: error.errors },
          { status: 400 }
        )
      }
      throw error
    }

    const newTagDefinition = await createTagDefinition(
      {
        knowledgeBaseId,
        tagSlot: validatedData.tagSlot,
        displayName: validatedData.displayName,
        fieldType: validatedData.fieldType,
      },
      requestId
    )

    return NextResponse.json({
      success: true,
      data: newTagDefinition,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error creating tag definition`, error)
    return NextResponse.json({ error: 'Failed to create tag definition' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/knowledge/[id]/tag-definitions/[tagId]/route.ts
Signals: Next.js

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { deleteTagDefinition } from '@/lib/knowledge/tags/service'
import { createLogger } from '@/lib/logs/console/logger'
import { checkKnowledgeBaseAccess } from '@/app/api/knowledge/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('TagDefinitionAPI')

// DELETE /api/knowledge/[id]/tag-definitions/[tagId] - Delete a tag definition
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; tagId: string }> }
) {
  const requestId = randomUUID().slice(0, 8)
  const { id: knowledgeBaseId, tagId } = await params

  try {
    logger.info(
      `[${requestId}] Deleting tag definition ${tagId} from knowledge base ${knowledgeBaseId}`
    )

    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accessCheck = await checkKnowledgeBaseAccess(knowledgeBaseId, session.user.id)
    if (!accessCheck.hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const deletedTag = await deleteTagDefinition(tagId, requestId)

    return NextResponse.json({
      success: true,
      message: `Tag definition "${deletedTag.displayName}" deleted successfully`,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error deleting tag definition`, error)
    return NextResponse.json({ error: 'Failed to delete tag definition' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/knowledge/[id]/tag-usage/route.ts
Signals: Next.js

```typescript
import { randomUUID } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getTagUsage } from '@/lib/knowledge/tags/service'
import { createLogger } from '@/lib/logs/console/logger'
import { checkKnowledgeBaseAccess } from '@/app/api/knowledge/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('TagUsageAPI')

// GET /api/knowledge/[id]/tag-usage - Get usage statistics for all tag definitions
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = randomUUID().slice(0, 8)
  const { id: knowledgeBaseId } = await params

  try {
    logger.info(`[${requestId}] Getting tag usage statistics for knowledge base ${knowledgeBaseId}`)

    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accessCheck = await checkKnowledgeBaseAccess(knowledgeBaseId, session.user.id)
    if (!accessCheck.hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const usageStats = await getTagUsage(knowledgeBaseId, requestId)

    logger.info(
      `[${requestId}] Retrieved usage statistics for ${usageStats.length} tag definitions`
    )

    return NextResponse.json({
      success: true,
      data: usageStats,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error getting tag usage statistics`, error)
    return NextResponse.json({ error: 'Failed to get tag usage statistics' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

````
