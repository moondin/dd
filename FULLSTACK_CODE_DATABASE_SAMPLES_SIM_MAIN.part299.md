---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 299
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 299 of 933)

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
Location: sim-main/apps/sim/app/api/templates/approved/sanitized/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { templates } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { checkInternalApiKey } from '@/lib/copilot/utils'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { sanitizeForCopilot } from '@/lib/workflows/sanitization/json-sanitizer'

const logger = createLogger('TemplatesSanitizedAPI')

export const revalidate = 0

/**
 * GET /api/templates/approved/sanitized
 * Returns all approved templates with their sanitized JSONs, names, and descriptions
 * Requires internal API secret authentication via X-API-Key header
 */
export async function GET(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const url = new URL(request.url)
    const hasApiKey = !!request.headers.get('x-api-key')

    // Check internal API key authentication
    const authResult = checkInternalApiKey(request)
    if (!authResult.success) {
      logger.warn(`[${requestId}] Authentication failed for approved sanitized templates`, {
        error: authResult.error,
        hasApiKey,
        howToUse: 'Add header: X-API-Key: <INTERNAL_API_SECRET>',
      })
      return NextResponse.json(
        {
          error: authResult.error,
          hint: 'Include X-API-Key header with INTERNAL_API_SECRET value',
        },
        { status: 401 }
      )
    }

    // Fetch all approved templates
    const approvedTemplates = await db
      .select({
        id: templates.id,
        name: templates.name,
        details: templates.details,
        state: templates.state,
        tags: templates.tags,
        requiredCredentials: templates.requiredCredentials,
      })
      .from(templates)
      .where(eq(templates.status, 'approved'))

    // Process each template to sanitize for copilot
    const sanitizedTemplates = approvedTemplates
      .map((template) => {
        try {
          const copilotSanitized = sanitizeForCopilot(template.state as any)

          if (copilotSanitized?.blocks) {
            Object.values(copilotSanitized.blocks).forEach((block: any) => {
              if (block && typeof block === 'object') {
                block.outputs = undefined
                block.position = undefined
                block.height = undefined
                block.layout = undefined
                block.horizontalHandles = undefined

                // Also clean nested nodes recursively
                if (block.nestedNodes) {
                  Object.values(block.nestedNodes).forEach((nestedBlock: any) => {
                    if (nestedBlock && typeof nestedBlock === 'object') {
                      nestedBlock.outputs = undefined
                      nestedBlock.position = undefined
                      nestedBlock.height = undefined
                      nestedBlock.layout = undefined
                      nestedBlock.horizontalHandles = undefined
                    }
                  })
                }
              }
            })
          }

          const details = template.details as { tagline?: string; about?: string } | null
          const description = details?.tagline || details?.about || ''

          return {
            id: template.id,
            name: template.name,
            description,
            tags: template.tags,
            requiredCredentials: template.requiredCredentials,
            sanitizedJson: copilotSanitized,
          }
        } catch (error) {
          logger.error(`[${requestId}] Error sanitizing template ${template.id}`, {
            error: error instanceof Error ? error.message : String(error),
          })
          return null
        }
      })
      .filter((t): t is NonNullable<typeof t> => t !== null)

    const response = {
      templates: sanitizedTemplates,
      count: sanitizedTemplates.length,
    }

    return NextResponse.json(response)
  } catch (error) {
    logger.error(`[${requestId}] Error fetching approved sanitized templates`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      {
        error: 'Internal server error',
        requestId,
      },
      { status: 500 }
    )
  }
}

// Add a helpful OPTIONS handler for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const requestId = generateRequestId()
  logger.info(`[${requestId}] OPTIONS request received for /api/templates/approved/sanitized`)

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'X-API-Key, Content-Type',
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/templates/[id]/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { member, templateCreators, templates, workflow } from '@sim/db/schema'
import { and, eq, or, sql } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import {
  extractRequiredCredentials,
  sanitizeCredentials,
} from '@/lib/workflows/credentials/credential-extractor'

const logger = createLogger('TemplateByIdAPI')

export const revalidate = 0

// GET /api/templates/[id] - Retrieve a single template by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    const session = await getSession()

    logger.debug(`[${requestId}] Fetching template: ${id}`)

    // Fetch the template by ID with creator info
    const result = await db
      .select({
        template: templates,
        creator: templateCreators,
      })
      .from(templates)
      .leftJoin(templateCreators, eq(templates.creatorId, templateCreators.id))
      .where(eq(templates.id, id))
      .limit(1)

    if (result.length === 0) {
      logger.warn(`[${requestId}] Template not found: ${id}`)
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    const { template, creator } = result[0]
    const templateWithCreator = {
      ...template,
      creator: creator || undefined,
    }

    // Only show approved templates to non-authenticated users
    if (!session?.user?.id && template.status !== 'approved') {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Check if user has starred (only if authenticated)
    let isStarred = false
    if (session?.user?.id) {
      const { templateStars } = await import('@sim/db/schema')
      const starResult = await db
        .select()
        .from(templateStars)
        .where(
          sql`${templateStars.templateId} = ${id} AND ${templateStars.userId} = ${session.user.id}`
        )
        .limit(1)
      isStarred = starResult.length > 0
    }

    const shouldIncrementView = template.status === 'approved'

    if (shouldIncrementView) {
      try {
        await db
          .update(templates)
          .set({
            views: sql`${templates.views} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(templates.id, id))

        logger.debug(`[${requestId}] Incremented view count for template: ${id}`)
      } catch (viewError) {
        // Log the error but don't fail the request
        logger.warn(`[${requestId}] Failed to increment view count for template: ${id}`, viewError)
      }
    }

    logger.info(`[${requestId}] Successfully retrieved template: ${id}`)

    return NextResponse.json({
      data: {
        ...templateWithCreator,
        views: template.views + (shouldIncrementView ? 1 : 0),
        isStarred,
      },
    })
  } catch (error: any) {
    logger.error(`[${requestId}] Error fetching template: ${id}`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const updateTemplateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  details: z
    .object({
      tagline: z.string().max(500, 'Tagline must be less than 500 characters').optional(),
      about: z.string().optional(), // Markdown long description
    })
    .optional(),
  creatorId: z.string().optional(), // Creator profile ID
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').optional(),
  updateState: z.boolean().optional(), // Explicitly request state update from current workflow
})

// PUT /api/templates/[id] - Update a template
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized template update attempt for ID: ${id}`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = updateTemplateSchema.safeParse(body)

    if (!validationResult.success) {
      logger.warn(`[${requestId}] Invalid template data for update: ${id}`, validationResult.error)
      return NextResponse.json(
        { error: 'Invalid template data', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { name, details, creatorId, tags, updateState } = validationResult.data

    // Check if template exists
    const existingTemplate = await db.select().from(templates).where(eq(templates.id, id)).limit(1)

    if (existingTemplate.length === 0) {
      logger.warn(`[${requestId}] Template not found for update: ${id}`)
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // No permission check needed - template updates only happen from within the workspace
    // where the user is already editing the connected workflow

    // Prepare update data - only include fields that were provided
    const updateData: any = {
      updatedAt: new Date(),
    }

    // Only update fields that were provided
    if (name !== undefined) updateData.name = name
    if (details !== undefined) updateData.details = details
    if (tags !== undefined) updateData.tags = tags
    if (creatorId !== undefined) updateData.creatorId = creatorId

    // Only update the state if explicitly requested and the template has a connected workflow
    if (updateState && existingTemplate[0].workflowId) {
      // Load the current workflow state from normalized tables
      const { loadWorkflowFromNormalizedTables } = await import('@/lib/workflows/persistence/utils')
      const normalizedData = await loadWorkflowFromNormalizedTables(existingTemplate[0].workflowId)

      if (normalizedData) {
        // Also fetch workflow variables
        const [workflowRecord] = await db
          .select({ variables: workflow.variables })
          .from(workflow)
          .where(eq(workflow.id, existingTemplate[0].workflowId))
          .limit(1)

        const currentState = {
          blocks: normalizedData.blocks,
          edges: normalizedData.edges,
          loops: normalizedData.loops,
          parallels: normalizedData.parallels,
          variables: workflowRecord?.variables || undefined,
          lastSaved: Date.now(),
        }

        // Extract credential requirements from the new state
        const requiredCredentials = extractRequiredCredentials(currentState)

        // Sanitize the state before storing
        const sanitizedState = sanitizeCredentials(currentState)

        updateData.state = sanitizedState
        updateData.requiredCredentials = requiredCredentials

        logger.info(
          `[${requestId}] Updating template state and credentials from current workflow: ${existingTemplate[0].workflowId}`
        )
      } else {
        logger.warn(`[${requestId}] Could not load workflow state for template: ${id}`)
      }
    }

    const updatedTemplate = await db
      .update(templates)
      .set(updateData)
      .where(eq(templates.id, id))
      .returning()

    logger.info(`[${requestId}] Successfully updated template: ${id}`)

    return NextResponse.json({
      data: updatedTemplate[0],
      message: 'Template updated successfully',
    })
  } catch (error: any) {
    logger.error(`[${requestId}] Error updating template: ${id}`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/templates/[id] - Delete a template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized template delete attempt for ID: ${id}`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch template
    const existing = await db.select().from(templates).where(eq(templates.id, id)).limit(1)
    if (existing.length === 0) {
      logger.warn(`[${requestId}] Template not found for delete: ${id}`)
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    const template = existing[0]

    // Permission: Only admin/owner of creator profile can delete
    if (template.creatorId) {
      const creatorProfile = await db
        .select()
        .from(templateCreators)
        .where(eq(templateCreators.id, template.creatorId))
        .limit(1)

      if (creatorProfile.length > 0) {
        const creator = creatorProfile[0]
        let hasPermission = false

        if (creator.referenceType === 'user') {
          hasPermission = creator.referenceId === session.user.id
        } else if (creator.referenceType === 'organization') {
          // For delete, require admin/owner role
          const membership = await db
            .select()
            .from(member)
            .where(
              and(
                eq(member.userId, session.user.id),
                eq(member.organizationId, creator.referenceId),
                or(eq(member.role, 'admin'), eq(member.role, 'owner'))
              )
            )
            .limit(1)
          hasPermission = membership.length > 0
        }

        if (!hasPermission) {
          logger.warn(`[${requestId}] User denied permission to delete template ${id}`)
          return NextResponse.json({ error: 'Access denied' }, { status: 403 })
        }
      }
    }

    await db.delete(templates).where(eq(templates.id, id))

    logger.info(`[${requestId}] Deleted template: ${id}`)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    logger.error(`[${requestId}] Error deleting template: ${id}`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/templates/[id]/approve/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { templates, user } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('TemplateApprovalAPI')

export const revalidate = 0

// POST /api/templates/[id]/approve - Approve a template (super users only)
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized template approval attempt for ID: ${id}`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a super user
    const currentUser = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)

    if (!currentUser[0]?.isSuperUser) {
      logger.warn(`[${requestId}] Non-super user attempted to approve template: ${id}`)
      return NextResponse.json({ error: 'Only super users can approve templates' }, { status: 403 })
    }

    // Check if template exists
    const existingTemplate = await db.select().from(templates).where(eq(templates.id, id)).limit(1)

    if (existingTemplate.length === 0) {
      logger.warn(`[${requestId}] Template not found for approval: ${id}`)
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Update template status to approved
    await db
      .update(templates)
      .set({ status: 'approved', updatedAt: new Date() })
      .where(eq(templates.id, id))

    logger.info(`[${requestId}] Template approved: ${id} by super user: ${session.user.id}`)

    return NextResponse.json({
      message: 'Template approved successfully',
      templateId: id,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error approving template ${id}`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/templates/[id]/reject - Reject a template (super users only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized template rejection attempt for ID: ${id}`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a super user
    const currentUser = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)

    if (!currentUser[0]?.isSuperUser) {
      logger.warn(`[${requestId}] Non-super user attempted to reject template: ${id}`)
      return NextResponse.json({ error: 'Only super users can reject templates' }, { status: 403 })
    }

    // Check if template exists
    const existingTemplate = await db.select().from(templates).where(eq(templates.id, id)).limit(1)

    if (existingTemplate.length === 0) {
      logger.warn(`[${requestId}] Template not found for rejection: ${id}`)
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Update template status to rejected
    await db
      .update(templates)
      .set({ status: 'rejected', updatedAt: new Date() })
      .where(eq(templates.id, id))

    logger.info(`[${requestId}] Template rejected: ${id} by super user: ${session.user.id}`)

    return NextResponse.json({
      message: 'Template rejected successfully',
      templateId: id,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error rejecting template ${id}`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/templates/[id]/reject/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { templates, user } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('TemplateRejectionAPI')

export const revalidate = 0

// POST /api/templates/[id]/reject - Reject a template (super users only)
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized template rejection attempt for ID: ${id}`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a super user
    const currentUser = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)

    if (!currentUser[0]?.isSuperUser) {
      logger.warn(`[${requestId}] Non-super user attempted to reject template: ${id}`)
      return NextResponse.json({ error: 'Only super users can reject templates' }, { status: 403 })
    }

    // Check if template exists
    const existingTemplate = await db.select().from(templates).where(eq(templates.id, id)).limit(1)

    if (existingTemplate.length === 0) {
      logger.warn(`[${requestId}] Template not found for rejection: ${id}`)
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Update template status to rejected
    await db
      .update(templates)
      .set({ status: 'rejected', updatedAt: new Date() })
      .where(eq(templates.id, id))

    logger.info(`[${requestId}] Template rejected: ${id} by super user: ${session.user.id}`)

    return NextResponse.json({
      message: 'Template rejected successfully',
      templateId: id,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error rejecting template ${id}`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/templates/[id]/star/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { templateStars, templates } from '@sim/db/schema'
import { and, eq, sql } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('TemplateStarAPI')

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET /api/templates/[id]/star - Check if user has starred this template
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized star check attempt for template: ${id}`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.debug(
      `[${requestId}] Checking star status for template: ${id}, user: ${session.user.id}`
    )

    // Check if the user has starred this template
    const starRecord = await db
      .select({ id: templateStars.id })
      .from(templateStars)
      .where(and(eq(templateStars.templateId, id), eq(templateStars.userId, session.user.id)))
      .limit(1)

    const isStarred = starRecord.length > 0

    logger.info(`[${requestId}] Star status checked: ${isStarred} for template: ${id}`)

    return NextResponse.json({ data: { isStarred } })
  } catch (error: any) {
    logger.error(`[${requestId}] Error checking star status for template: ${id}`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/templates/[id]/star - Add a star to the template
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized star attempt for template: ${id}`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.debug(`[${requestId}] Adding star for template: ${id}, user: ${session.user.id}`)

    // Verify the template exists
    const templateExists = await db
      .select({ id: templates.id })
      .from(templates)
      .where(eq(templates.id, id))
      .limit(1)

    if (templateExists.length === 0) {
      logger.warn(`[${requestId}] Template not found: ${id}`)
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Check if user has already starred this template
    const existingStar = await db
      .select({ id: templateStars.id })
      .from(templateStars)
      .where(and(eq(templateStars.templateId, id), eq(templateStars.userId, session.user.id)))
      .limit(1)

    if (existingStar.length > 0) {
      logger.info(`[${requestId}] Template already starred: ${id}`)
      return NextResponse.json({ message: 'Template already starred' }, { status: 200 })
    }

    // Use a transaction to ensure consistency
    await db.transaction(async (tx) => {
      // Add the star record
      await tx.insert(templateStars).values({
        id: uuidv4(),
        userId: session.user.id,
        templateId: id,
        starredAt: new Date(),
        createdAt: new Date(),
      })

      // Increment the star count
      await tx
        .update(templates)
        .set({
          stars: sql`${templates.stars} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(templates.id, id))
    })

    logger.info(`[${requestId}] Successfully starred template: ${id}`)
    return NextResponse.json({ message: 'Template starred successfully' }, { status: 201 })
  } catch (error: any) {
    // Handle unique constraint violations gracefully
    if (error.code === '23505') {
      logger.info(`[${requestId}] Duplicate star attempt for template: ${id}`)
      return NextResponse.json({ message: 'Template already starred' }, { status: 200 })
    }

    logger.error(`[${requestId}] Error starring template: ${id}`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/templates/[id]/star - Remove a star from the template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized unstar attempt for template: ${id}`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.debug(`[${requestId}] Removing star for template: ${id}, user: ${session.user.id}`)

    // Check if the star exists
    const existingStar = await db
      .select({ id: templateStars.id })
      .from(templateStars)
      .where(and(eq(templateStars.templateId, id), eq(templateStars.userId, session.user.id)))
      .limit(1)

    if (existingStar.length === 0) {
      logger.info(`[${requestId}] No star found to remove for template: ${id}`)
      return NextResponse.json({ message: 'Template not starred' }, { status: 200 })
    }

    // Use a transaction to ensure consistency
    await db.transaction(async (tx) => {
      // Remove the star record
      await tx
        .delete(templateStars)
        .where(and(eq(templateStars.templateId, id), eq(templateStars.userId, session.user.id)))

      // Decrement the star count (prevent negative values)
      await tx
        .update(templates)
        .set({
          stars: sql`GREATEST(${templates.stars} - 1, 0)`,
          updatedAt: new Date(),
        })
        .where(eq(templates.id, id))
    })

    logger.info(`[${requestId}] Successfully unstarred template: ${id}`)
    return NextResponse.json({ message: 'Template unstarred successfully' }, { status: 200 })
  } catch (error: any) {
    logger.error(`[${requestId}] Error unstarring template: ${id}`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/templates/[id]/use/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { templates, workflow, workflowDeploymentVersion } from '@sim/db/schema'
import { eq, sql } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import { regenerateWorkflowStateIds } from '@/lib/workflows/persistence/utils'

const logger = createLogger('TemplateUseAPI')

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Type for template details
interface TemplateDetails {
  tagline?: string
  about?: string
}

// POST /api/templates/[id]/use - Use a template (increment views and create workflow)
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized use attempt for template: ${id}`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get workspace ID and connectToTemplate flag from request body
    const body = await request.json()
    const { workspaceId, connectToTemplate = false } = body

    if (!workspaceId) {
      logger.warn(`[${requestId}] Missing workspaceId in request body`)
      return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 })
    }

    logger.debug(
      `[${requestId}] Using template: ${id}, user: ${session.user.id}, workspace: ${workspaceId}, connect: ${connectToTemplate}`
    )

    // Get the template
    const template = await db
      .select({
        id: templates.id,
        name: templates.name,
        details: templates.details,
        state: templates.state,
        workflowId: templates.workflowId,
      })
      .from(templates)
      .where(eq(templates.id, id))
      .limit(1)

    if (template.length === 0) {
      logger.warn(`[${requestId}] Template not found: ${id}`)
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    const templateData = template[0]

    // Create a new workflow ID
    const newWorkflowId = uuidv4()
    const now = new Date()

    // Extract variables from the template state and remap to the new workflow
    const templateVariables = (templateData.state as any)?.variables as
      | Record<string, any>
      | undefined
    const remappedVariables: Record<string, any> = (() => {
      if (!templateVariables || typeof templateVariables !== 'object') return {}
      const mapped: Record<string, any> = {}
      for (const [, variable] of Object.entries(templateVariables)) {
        const newVarId = uuidv4()
        mapped[newVarId] = { ...variable, id: newVarId, workflowId: newWorkflowId }
      }
      return mapped
    })()

    // Step 1: Create the workflow record (like imports do)
    await db.insert(workflow).values({
      id: newWorkflowId,
      workspaceId: workspaceId,
      name:
        connectToTemplate && !templateData.workflowId
          ? templateData.name
          : `${templateData.name} (copy)`,
      description: (templateData.details as TemplateDetails | null)?.tagline || null,
      userId: session.user.id,
      variables: remappedVariables, // Remap variable IDs and workflowId for the new workflow
      createdAt: now,
      updatedAt: now,
      lastSynced: now,
      isDeployed: connectToTemplate && !templateData.workflowId,
      deployedAt: connectToTemplate && !templateData.workflowId ? now : null,
    })

    // Step 2: Regenerate IDs when creating a copy (not when connecting/editing template)
    // When connecting to template (edit mode), keep original IDs
    // When using template (copy mode), regenerate all IDs to avoid conflicts
    const workflowState = connectToTemplate
      ? templateData.state
      : regenerateWorkflowStateIds(templateData.state)

    // Step 3: Save the workflow state using the existing state endpoint (like imports do)
    // Ensure variables in state are remapped for the new workflow as well
    const workflowStateWithVariables = { ...workflowState, variables: remappedVariables }
    const stateResponse = await fetch(`${getBaseUrl()}/api/workflows/${newWorkflowId}/state`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Forward the session cookie for authentication
        cookie: request.headers.get('cookie') || '',
      },
      body: JSON.stringify(workflowStateWithVariables),
    })

    if (!stateResponse.ok) {
      logger.error(`[${requestId}] Failed to save workflow state for template use`)
      // Clean up the workflow we created
      await db.delete(workflow).where(eq(workflow.id, newWorkflowId))
      return NextResponse.json(
        { error: 'Failed to create workflow from template' },
        { status: 500 }
      )
    }

    // Use a transaction for template updates and deployment version
    const result = await db.transaction(async (tx) => {
      // Prepare template update data
      const updateData: any = {
        views: sql`${templates.views} + 1`,
        updatedAt: now,
      }

      // If connecting to template for editing, also update the workflowId
      // Also create a new deployment version for this workflow with the same state
      if (connectToTemplate && !templateData.workflowId) {
        updateData.workflowId = newWorkflowId

        // Create a deployment version for the new workflow
        if (templateData.state) {
          const newDeploymentVersionId = uuidv4()
          await tx.insert(workflowDeploymentVersion).values({
            id: newDeploymentVersionId,
            workflowId: newWorkflowId,
            version: 1,
            state: templateData.state,
            isActive: true,
            createdAt: now,
            createdBy: session.user.id,
          })
        }
      }

      // Update template with view count and potentially new workflow connection
      await tx.update(templates).set(updateData).where(eq(templates.id, id))

      return { id: newWorkflowId }
    })

    logger.info(
      `[${requestId}] Successfully used template: ${id}, created workflow: ${newWorkflowId}`
    )

    // Track template usage
    try {
      const { trackPlatformEvent } = await import('@/lib/core/telemetry')
      const templateState = templateData.state as any
      trackPlatformEvent('platform.template.used', {
        'template.id': id,
        'template.name': templateData.name,
        'workflow.created_id': newWorkflowId,
        'workflow.blocks_count': templateState?.blocks
          ? Object.keys(templateState.blocks).length
          : 0,
        'workspace.id': workspaceId,
      })
    } catch (_e) {
      // Silently fail
    }

    return NextResponse.json(
      {
        message: 'Template used successfully',
        workflowId: newWorkflowId,
        workspaceId: workspaceId,
      },
      { status: 201 }
    )
  } catch (error: any) {
    logger.error(`[${requestId}] Error using template: ${id}`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/asana/add-comment/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { validateAlphanumericId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('AsanaAddCommentAPI')

export async function POST(request: Request) {
  try {
    const { accessToken, taskGid, text } = await request.json()

    if (!accessToken) {
      logger.error('Missing access token in request')
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    if (!taskGid) {
      logger.error('Missing task GID in request')
      return NextResponse.json({ error: 'Task GID is required' }, { status: 400 })
    }

    if (!text) {
      logger.error('Missing comment text in request')
      return NextResponse.json({ error: 'Comment text is required' }, { status: 400 })
    }

    const taskGidValidation = validateAlphanumericId(taskGid, 'taskGid', 100)
    if (!taskGidValidation.isValid) {
      return NextResponse.json({ error: taskGidValidation.error }, { status: 400 })
    }

    const url = `https://app.asana.com/api/1.0/tasks/${taskGid}/stories`

    const body = {
      data: {
        text,
      },
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Asana API error: ${response.status} ${response.statusText}`

      try {
        const errorData = JSON.parse(errorText)
        const asanaError = errorData.errors?.[0]
        if (asanaError) {
          errorMessage = `${asanaError.message || errorMessage} (${asanaError.help || ''})`
        }
        logger.error('Asana API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        })
      } catch (_e) {
        logger.error('Asana API error (unparsed):', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        })
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          details: errorText,
        },
        { status: response.status }
      )
    }

    const result = await response.json()
    const story = result.data

    return NextResponse.json({
      success: true,
      ts: new Date().toISOString(),
      gid: story.gid,
      text: story.text || '',
      created_at: story.created_at,
      created_by: story.created_by
        ? {
            gid: story.created_by.gid,
            name: story.created_by.name,
          }
        : undefined,
    })
  } catch (error) {
    logger.error('Error processing request:', error)
    return NextResponse.json(
      {
        error: 'Failed to add comment to Asana task',
        details: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

````
