---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 272
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 272 of 933)

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
Location: sim-main/apps/sim/app/api/copilot/stats/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { SIM_AGENT_API_URL_DEFAULT } from '@/lib/copilot/constants'
import {
  authenticateCopilotRequestSessionOnly,
  createBadRequestResponse,
  createInternalServerErrorResponse,
  createRequestTracker,
  createUnauthorizedResponse,
} from '@/lib/copilot/request-helpers'
import { env } from '@/lib/core/config/env'

const SIM_AGENT_API_URL = env.SIM_AGENT_API_URL || SIM_AGENT_API_URL_DEFAULT

const BodySchema = z.object({
  messageId: z.string(),
  diffCreated: z.boolean(),
  diffAccepted: z.boolean(),
})

export async function POST(req: NextRequest) {
  const tracker = createRequestTracker()
  try {
    const { userId, isAuthenticated } = await authenticateCopilotRequestSessionOnly()
    if (!isAuthenticated || !userId) {
      return createUnauthorizedResponse()
    }

    const json = await req.json().catch(() => ({}))
    const parsed = BodySchema.safeParse(json)
    if (!parsed.success) {
      return createBadRequestResponse('Invalid request body for copilot stats')
    }

    const { messageId, diffCreated, diffAccepted } = parsed.data as any

    // Build outgoing payload for Sim Agent with only required fields
    const payload: Record<string, any> = {
      messageId,
      diffCreated,
      diffAccepted,
    }

    const agentRes = await fetch(`${SIM_AGENT_API_URL}/api/stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(env.COPILOT_API_KEY ? { 'x-api-key': env.COPILOT_API_KEY } : {}),
      },
      body: JSON.stringify(payload),
    })

    // Prefer not to block clients; still relay status
    let agentJson: any = null
    try {
      agentJson = await agentRes.json()
    } catch {}

    if (!agentRes.ok) {
      const message = (agentJson && (agentJson.error || agentJson.message)) || 'Upstream error'
      return NextResponse.json({ success: false, error: message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return createInternalServerErrorResponse('Failed to forward copilot stats')
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/copilot/tools/mark-complete/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { SIM_AGENT_API_URL_DEFAULT } from '@/lib/copilot/constants'
import {
  authenticateCopilotRequestSessionOnly,
  createBadRequestResponse,
  createInternalServerErrorResponse,
  createRequestTracker,
  createUnauthorizedResponse,
} from '@/lib/copilot/request-helpers'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('CopilotMarkToolCompleteAPI')

const SIM_AGENT_API_URL = env.SIM_AGENT_API_URL || SIM_AGENT_API_URL_DEFAULT

const MarkCompleteSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.number().int(),
  message: z.any().optional(),
  data: z.any().optional(),
})

/**
 * POST /api/copilot/tools/mark-complete
 * Proxy to Sim Agent: POST /api/tools/mark-complete
 */
export async function POST(req: NextRequest) {
  const tracker = createRequestTracker()

  try {
    const { userId, isAuthenticated } = await authenticateCopilotRequestSessionOnly()
    if (!isAuthenticated || !userId) {
      return createUnauthorizedResponse()
    }

    const body = await req.json()

    // Log raw body shape for diagnostics (avoid dumping huge payloads)
    try {
      const bodyPreview = JSON.stringify(body).slice(0, 300)
      logger.debug(`[${tracker.requestId}] Incoming mark-complete raw body preview`, {
        preview: `${bodyPreview}${bodyPreview.length === 300 ? '...' : ''}`,
      })
    } catch {}

    const parsed = MarkCompleteSchema.parse(body)

    const messagePreview = (() => {
      try {
        const s =
          typeof parsed.message === 'string' ? parsed.message : JSON.stringify(parsed.message)
        return s ? `${s.slice(0, 200)}${s.length > 200 ? '...' : ''}` : undefined
      } catch {
        return undefined
      }
    })()

    logger.info(`[${tracker.requestId}] Forwarding tool mark-complete`, {
      userId,
      toolCallId: parsed.id,
      toolName: parsed.name,
      status: parsed.status,
      hasMessage: parsed.message !== undefined,
      hasData: parsed.data !== undefined,
      messagePreview,
      agentUrl: `${SIM_AGENT_API_URL}/api/tools/mark-complete`,
    })

    const agentRes = await fetch(`${SIM_AGENT_API_URL}/api/tools/mark-complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(env.COPILOT_API_KEY ? { 'x-api-key': env.COPILOT_API_KEY } : {}),
      },
      body: JSON.stringify(parsed),
    })

    // Attempt to parse agent response JSON
    let agentJson: any = null
    let agentText: string | null = null
    try {
      agentJson = await agentRes.json()
    } catch (_) {
      try {
        agentText = await agentRes.text()
      } catch {}
    }

    logger.info(`[${tracker.requestId}] Agent responded to mark-complete`, {
      status: agentRes.status,
      ok: agentRes.ok,
      responseJsonPreview: agentJson ? JSON.stringify(agentJson).slice(0, 300) : undefined,
      responseTextPreview: agentText ? agentText.slice(0, 300) : undefined,
    })

    if (agentRes.ok) {
      return NextResponse.json({ success: true })
    }

    const errorMessage =
      agentJson?.error || agentText || `Agent responded with status ${agentRes.status}`
    const status = agentRes.status >= 500 ? 500 : 400

    logger.warn(`[${tracker.requestId}] Mark-complete failed`, {
      status,
      error: errorMessage,
    })

    return NextResponse.json({ success: false, error: errorMessage }, { status })
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${tracker.requestId}] Invalid mark-complete request body`, {
        issues: error.issues,
      })
      return createBadRequestResponse('Invalid request body for mark-complete')
    }
    logger.error(`[${tracker.requestId}] Failed to proxy mark-complete:`, error)
    return createInternalServerErrorResponse('Failed to mark tool as complete')
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/copilot/training/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('CopilotTrainingAPI')

const WorkflowStateSchema = z.record(z.unknown())

const OperationSchema = z.object({
  operation_type: z.string(),
  block_id: z.string(),
  params: z.record(z.unknown()).optional(),
})

const TrainingDataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  prompt: z.string().min(1, 'Prompt is required'),
  input: WorkflowStateSchema,
  output: WorkflowStateSchema,
  operations: z.array(OperationSchema),
})

export async function POST(request: NextRequest) {
  try {
    const baseUrl = env.AGENT_INDEXER_URL
    if (!baseUrl) {
      logger.error('Missing AGENT_INDEXER_URL environment variable')
      return NextResponse.json({ error: 'Agent indexer not configured' }, { status: 500 })
    }

    const apiKey = env.AGENT_INDEXER_API_KEY
    if (!apiKey) {
      logger.error('Missing AGENT_INDEXER_API_KEY environment variable')
      return NextResponse.json(
        { error: 'Agent indexer authentication not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const validationResult = TrainingDataSchema.safeParse(body)

    if (!validationResult.success) {
      logger.warn('Invalid training data format', { errors: validationResult.error.errors })
      return NextResponse.json(
        {
          error: 'Invalid training data format',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const { title, prompt, input, output, operations } = validationResult.data

    logger.info('Sending training data to agent indexer', {
      title,
      operationsCount: operations.length,
    })

    const upstreamUrl = `${baseUrl}/operations/add`
    const upstreamResponse = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        title,
        prompt,
        input,
        output,
        operations: { operations },
      }),
    })

    const responseData = await upstreamResponse.json()

    if (!upstreamResponse.ok) {
      logger.error('Agent indexer rejected the data', {
        status: upstreamResponse.status,
        response: responseData,
      })
      return NextResponse.json(responseData, { status: upstreamResponse.status })
    }

    logger.info('Successfully sent training data to agent indexer', {
      title,
      response: responseData,
    })

    return NextResponse.json(responseData)
  } catch (error) {
    logger.error('Failed to send training data to agent indexer', { error })
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to send training data',
      },
      { status: 502 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/copilot/training/examples/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('CopilotTrainingExamplesAPI')

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const TrainingExampleSchema = z.object({
  json: z.string().min(1, 'JSON string is required'),
  title: z.string().min(1, 'Title is required'),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.unknown()).optional(),
})

export async function POST(request: NextRequest) {
  const baseUrl = env.AGENT_INDEXER_URL
  if (!baseUrl) {
    logger.error('Missing AGENT_INDEXER_URL environment variable')
    return NextResponse.json({ error: 'Missing AGENT_INDEXER_URL env' }, { status: 500 })
  }

  const apiKey = env.AGENT_INDEXER_API_KEY
  if (!apiKey) {
    logger.error('Missing AGENT_INDEXER_API_KEY environment variable')
    return NextResponse.json({ error: 'Missing AGENT_INDEXER_API_KEY env' }, { status: 500 })
  }

  try {
    const body = await request.json()

    const validationResult = TrainingExampleSchema.safeParse(body)

    if (!validationResult.success) {
      logger.warn('Invalid training example format', { errors: validationResult.error.errors })
      return NextResponse.json(
        {
          error: 'Invalid training example format',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    logger.info('Sending workflow example to agent indexer', {
      hasJsonField: typeof validatedData.json === 'string',
      title: validatedData.title,
    })

    const upstream = await fetch(`${baseUrl}/examples/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(validatedData),
    })

    if (!upstream.ok) {
      const errorText = await upstream.text()
      logger.error('Agent indexer rejected the example', {
        status: upstream.status,
        error: errorText,
      })
      return NextResponse.json({ error: errorText }, { status: upstream.status })
    }

    const data = await upstream.json()
    logger.info('Successfully sent workflow example to agent indexer')

    return NextResponse.json(data, {
      headers: { 'content-type': 'application/json' },
    })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to add example'
    logger.error('Failed to send workflow example', { error: err })
    return NextResponse.json({ error: errorMessage }, { status: 502 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/copilot/user-models/route.ts
Signals: Next.js

```typescript
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'
import { db } from '@/../../packages/db'
import { settings } from '@/../../packages/db/schema'

const logger = createLogger('CopilotUserModelsAPI')

const DEFAULT_ENABLED_MODELS: Record<string, boolean> = {
  'gpt-4o': false,
  'gpt-4.1': false,
  'gpt-5-fast': false,
  'gpt-5': true,
  'gpt-5-medium': false,
  'gpt-5-high': false,
  'gpt-5.1-fast': false,
  'gpt-5.1': true,
  'gpt-5.1-medium': true,
  'gpt-5.1-high': false,
  'gpt-5-codex': false,
  'gpt-5.1-codex': true,
  o3: true,
  'claude-4-sonnet': false,
  'claude-4.5-haiku': true,
  'claude-4.5-sonnet': true,
  'claude-4.5-opus': true,
  // 'claude-4.1-opus': true,
  'gemini-3-pro': true,
}

// GET - Fetch user's enabled models
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const [userSettings] = await db
      .select()
      .from(settings)
      .where(eq(settings.userId, userId))
      .limit(1)

    if (userSettings) {
      const userModelsMap = (userSettings.copilotEnabledModels as Record<string, boolean>) || {}

      const mergedModels = { ...DEFAULT_ENABLED_MODELS }
      for (const [modelId, enabled] of Object.entries(userModelsMap)) {
        mergedModels[modelId] = enabled
      }

      const hasNewModels = Object.keys(DEFAULT_ENABLED_MODELS).some(
        (key) => !(key in userModelsMap)
      )

      if (hasNewModels) {
        await db
          .update(settings)
          .set({
            copilotEnabledModels: mergedModels,
            updatedAt: new Date(),
          })
          .where(eq(settings.userId, userId))
      }

      return NextResponse.json({
        enabledModels: mergedModels,
      })
    }

    await db.insert(settings).values({
      id: userId,
      userId,
      copilotEnabledModels: DEFAULT_ENABLED_MODELS,
    })

    logger.info('Created new settings record with default models', { userId })

    return NextResponse.json({
      enabledModels: DEFAULT_ENABLED_MODELS,
    })
  } catch (error) {
    logger.error('Failed to fetch user models', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update user's enabled models
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()

    if (!body.enabledModels || typeof body.enabledModels !== 'object') {
      return NextResponse.json({ error: 'enabledModels must be an object' }, { status: 400 })
    }

    const [existing] = await db.select().from(settings).where(eq(settings.userId, userId)).limit(1)

    if (existing) {
      await db
        .update(settings)
        .set({
          copilotEnabledModels: body.enabledModels,
          updatedAt: new Date(),
        })
        .where(eq(settings.userId, userId))
    } else {
      await db.insert(settings).values({
        id: userId,
        userId,
        copilotEnabledModels: body.enabledModels,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Failed to update user models', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/creators/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { member, templateCreators } from '@sim/db/schema'
import { and, eq, or } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import type { CreatorProfileDetails } from '@/app/_types/creator-profile'

const logger = createLogger('CreatorProfilesAPI')

const CreatorProfileDetailsSchema = z.object({
  about: z.string().max(2000, 'Max 2000 characters').optional(),
  xUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  contactEmail: z.string().email().optional().or(z.literal('')),
})

const CreateCreatorProfileSchema = z.object({
  referenceType: z.enum(['user', 'organization']),
  referenceId: z.string().min(1, 'Reference ID is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Max 100 characters'),
  profileImageUrl: z.string().min(1, 'Profile image is required'),
  details: CreatorProfileDetailsSchema.optional(),
})

// GET /api/creators - Get creator profiles for current user
export async function GET(request: NextRequest) {
  const requestId = generateRequestId()
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized access attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's organizations where they're admin or owner
    const userOrgs = await db
      .select({ organizationId: member.organizationId })
      .from(member)
      .where(
        and(
          eq(member.userId, session.user.id),
          or(eq(member.role, 'owner'), eq(member.role, 'admin'))
        )
      )

    const orgIds = userOrgs.map((m) => m.organizationId)

    // Get creator profiles for user and their organizations
    const profiles = await db
      .select()
      .from(templateCreators)
      .where(
        or(
          and(
            eq(templateCreators.referenceType, 'user'),
            eq(templateCreators.referenceId, session.user.id)
          ),
          ...orgIds.map((orgId) =>
            and(
              eq(templateCreators.referenceType, 'organization'),
              eq(templateCreators.referenceId, orgId)
            )
          )
        )
      )

    logger.info(`[${requestId}] Retrieved ${profiles.length} creator profiles`)

    return NextResponse.json({ profiles })
  } catch (error: any) {
    logger.error(`[${requestId}] Error fetching creator profiles`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/creators - Create a new creator profile
export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized creation attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = CreateCreatorProfileSchema.parse(body)

    logger.debug(`[${requestId}] Creating creator profile:`, {
      referenceType: data.referenceType,
      referenceId: data.referenceId,
    })

    // Validate permissions
    if (data.referenceType === 'user') {
      if (data.referenceId !== session.user.id) {
        logger.warn(`[${requestId}] User tried to create profile for another user`)
        return NextResponse.json(
          { error: 'Cannot create profile for another user' },
          { status: 403 }
        )
      }
    } else if (data.referenceType === 'organization') {
      // Check if user is admin/owner of the organization
      const membership = await db
        .select()
        .from(member)
        .where(
          and(
            eq(member.userId, session.user.id),
            eq(member.organizationId, data.referenceId),
            or(eq(member.role, 'owner'), eq(member.role, 'admin'))
          )
        )
        .limit(1)

      if (membership.length === 0) {
        logger.warn(`[${requestId}] User not authorized for organization: ${data.referenceId}`)
        return NextResponse.json(
          { error: 'You must be an admin or owner to create an organization profile' },
          { status: 403 }
        )
      }
    }

    // Check if profile already exists
    const existing = await db
      .select()
      .from(templateCreators)
      .where(
        and(
          eq(templateCreators.referenceType, data.referenceType),
          eq(templateCreators.referenceId, data.referenceId)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      logger.warn(
        `[${requestId}] Profile already exists for ${data.referenceType}:${data.referenceId}`
      )
      return NextResponse.json({ error: 'Creator profile already exists' }, { status: 409 })
    }

    // Create the profile
    const profileId = uuidv4()
    const now = new Date()

    const details: CreatorProfileDetails = {}
    if (data.details?.about) details.about = data.details.about
    if (data.details?.xUrl) details.xUrl = data.details.xUrl
    if (data.details?.linkedinUrl) details.linkedinUrl = data.details.linkedinUrl
    if (data.details?.websiteUrl) details.websiteUrl = data.details.websiteUrl
    if (data.details?.contactEmail) details.contactEmail = data.details.contactEmail

    const newProfile = {
      id: profileId,
      referenceType: data.referenceType,
      referenceId: data.referenceId,
      name: data.name,
      profileImageUrl: data.profileImageUrl || null,
      details: Object.keys(details).length > 0 ? details : null,
      createdBy: session.user.id,
      createdAt: now,
      updatedAt: now,
    }

    await db.insert(templateCreators).values(newProfile)

    logger.info(`[${requestId}] Successfully created creator profile: ${profileId}`)

    return NextResponse.json({ data: newProfile }, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid profile data`, { errors: error.errors })
      return NextResponse.json(
        { error: 'Invalid profile data', details: error.errors },
        { status: 400 }
      )
    }

    logger.error(`[${requestId}] Error creating creator profile`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/creators/[id]/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { member, templateCreators } from '@sim/db/schema'
import { and, eq, or } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('CreatorProfileByIdAPI')

const CreatorProfileDetailsSchema = z.object({
  about: z.string().max(2000, 'Max 2000 characters').optional(),
  xUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  contactEmail: z.string().email().optional().or(z.literal('')),
})

const UpdateCreatorProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Max 100 characters').optional(),
  profileImageUrl: z.string().optional().or(z.literal('')),
  details: CreatorProfileDetailsSchema.optional(),
})

// Helper to check if user has permission to manage profile
async function hasPermission(userId: string, profile: any): Promise<boolean> {
  if (profile.referenceType === 'user') {
    return profile.referenceId === userId
  }
  if (profile.referenceType === 'organization') {
    const membership = await db
      .select()
      .from(member)
      .where(
        and(
          eq(member.userId, userId),
          eq(member.organizationId, profile.referenceId),
          or(eq(member.role, 'owner'), eq(member.role, 'admin'))
        )
      )
      .limit(1)
    return membership.length > 0
  }
  return false
}

// GET /api/creators/[id] - Get a specific creator profile
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    const profile = await db
      .select()
      .from(templateCreators)
      .where(eq(templateCreators.id, id))
      .limit(1)

    if (profile.length === 0) {
      logger.warn(`[${requestId}] Profile not found: ${id}`)
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    logger.info(`[${requestId}] Retrieved creator profile: ${id}`)
    return NextResponse.json({ data: profile[0] })
  } catch (error: any) {
    logger.error(`[${requestId}] Error fetching creator profile: ${id}`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/creators/[id] - Update a creator profile
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized update attempt for profile: ${id}`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = UpdateCreatorProfileSchema.parse(body)

    // Check if profile exists
    const existing = await db
      .select()
      .from(templateCreators)
      .where(eq(templateCreators.id, id))
      .limit(1)

    if (existing.length === 0) {
      logger.warn(`[${requestId}] Profile not found for update: ${id}`)
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check permissions
    const canEdit = await hasPermission(session.user.id, existing[0])
    if (!canEdit) {
      logger.warn(`[${requestId}] User denied permission to update profile: ${id}`)
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (data.name !== undefined) updateData.name = data.name
    if (data.profileImageUrl !== undefined) updateData.profileImageUrl = data.profileImageUrl
    if (data.details !== undefined) updateData.details = data.details

    const updated = await db
      .update(templateCreators)
      .set(updateData)
      .where(eq(templateCreators.id, id))
      .returning()

    logger.info(`[${requestId}] Successfully updated creator profile: ${id}`)

    return NextResponse.json({ data: updated[0] })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid update data for profile: ${id}`, { errors: error.errors })
      return NextResponse.json(
        { error: 'Invalid update data', details: error.errors },
        { status: 400 }
      )
    }

    logger.error(`[${requestId}] Error updating creator profile: ${id}`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/creators/[id] - Delete a creator profile
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized delete attempt for profile: ${id}`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if profile exists
    const existing = await db
      .select()
      .from(templateCreators)
      .where(eq(templateCreators.id, id))
      .limit(1)

    if (existing.length === 0) {
      logger.warn(`[${requestId}] Profile not found for delete: ${id}`)
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check permissions
    const canDelete = await hasPermission(session.user.id, existing[0])
    if (!canDelete) {
      logger.warn(`[${requestId}] User denied permission to delete profile: ${id}`)
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    await db.delete(templateCreators).where(eq(templateCreators.id, id))

    logger.info(`[${requestId}] Successfully deleted creator profile: ${id}`)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    logger.error(`[${requestId}] Error deleting creator profile: ${id}`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/creators/[id]/verify/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { templateCreators, user } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('CreatorVerificationAPI')

export const revalidate = 0

// POST /api/creators/[id]/verify - Verify a creator (super users only)
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized verification attempt for creator: ${id}`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a super user
    const currentUser = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)

    if (!currentUser[0]?.isSuperUser) {
      logger.warn(`[${requestId}] Non-super user attempted to verify creator: ${id}`)
      return NextResponse.json({ error: 'Only super users can verify creators' }, { status: 403 })
    }

    // Check if creator exists
    const existingCreator = await db
      .select()
      .from(templateCreators)
      .where(eq(templateCreators.id, id))
      .limit(1)

    if (existingCreator.length === 0) {
      logger.warn(`[${requestId}] Creator not found for verification: ${id}`)
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
    }

    // Update creator verified status to true
    await db
      .update(templateCreators)
      .set({ verified: true, updatedAt: new Date() })
      .where(eq(templateCreators.id, id))

    logger.info(`[${requestId}] Creator verified: ${id} by super user: ${session.user.id}`)

    return NextResponse.json({
      message: 'Creator verified successfully',
      creatorId: id,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error verifying creator ${id}`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/creators/[id]/verify - Unverify a creator (super users only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized unverification attempt for creator: ${id}`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a super user
    const currentUser = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)

    if (!currentUser[0]?.isSuperUser) {
      logger.warn(`[${requestId}] Non-super user attempted to unverify creator: ${id}`)
      return NextResponse.json({ error: 'Only super users can unverify creators' }, { status: 403 })
    }

    // Check if creator exists
    const existingCreator = await db
      .select()
      .from(templateCreators)
      .where(eq(templateCreators.id, id))
      .limit(1)

    if (existingCreator.length === 0) {
      logger.warn(`[${requestId}] Creator not found for unverification: ${id}`)
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
    }

    // Update creator verified status to false
    await db
      .update(templateCreators)
      .set({ verified: false, updatedAt: new Date() })
      .where(eq(templateCreators.id, id))

    logger.info(`[${requestId}] Creator unverified: ${id} by super user: ${session.user.id}`)

    return NextResponse.json({
      message: 'Creator unverified successfully',
      creatorId: id,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error unverifying creator ${id}`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/cron/renew-subscriptions/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { webhook as webhookTable, workflow as workflowTable } from '@sim/db/schema'
import { and, eq, or } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { verifyCronAuth } from '@/lib/auth/internal'
import { createLogger } from '@/lib/logs/console/logger'
import { refreshAccessTokenIfNeeded } from '@/app/api/auth/oauth/utils'

const logger = createLogger('TeamsSubscriptionRenewal')

/**
 * Cron endpoint to renew Microsoft Teams chat subscriptions before they expire
 *
 * Teams subscriptions expire after ~3 days and must be renewed.
 * Configured in helm/sim/values.yaml under cronjobs.jobs.renewSubscriptions
 */
export async function GET(request: NextRequest) {
  try {
    const authError = verifyCronAuth(request, 'Teams subscription renewal')
    if (authError) {
      return authError
    }

    logger.info('Starting Teams subscription renewal job')

    let totalRenewed = 0
    let totalFailed = 0
    let totalChecked = 0

    // Get all active Microsoft Teams webhooks with their workflows
    const webhooksWithWorkflows = await db
      .select({
        webhook: webhookTable,
        workflow: workflowTable,
      })
      .from(webhookTable)
      .innerJoin(workflowTable, eq(webhookTable.workflowId, workflowTable.id))
      .where(
        and(
          eq(webhookTable.isActive, true),
          or(
            eq(webhookTable.provider, 'microsoft-teams'),
            eq(webhookTable.provider, 'microsoftteams')
          )
        )
      )

    logger.info(
      `Found ${webhooksWithWorkflows.length} active Teams webhooks, checking for expiring subscriptions`
    )

    // Renewal threshold: 48 hours before expiration
    const renewalThreshold = new Date(Date.now() + 48 * 60 * 60 * 1000)

    for (const { webhook, workflow } of webhooksWithWorkflows) {
      const config = (webhook.providerConfig as Record<string, any>) || {}

      // Check if this is a Teams chat subscription that needs renewal
      if (config.triggerId !== 'microsoftteams_chat_subscription') continue

      const expirationStr = config.subscriptionExpiration as string | undefined
      if (!expirationStr) continue

      const expiresAt = new Date(expirationStr)
      if (expiresAt > renewalThreshold) continue // Not expiring soon

      totalChecked++

      try {
        logger.info(
          `Renewing Teams subscription for webhook ${webhook.id} (expires: ${expiresAt.toISOString()})`
        )

        const credentialId = config.credentialId as string | undefined
        const externalSubscriptionId = config.externalSubscriptionId as string | undefined

        if (!credentialId || !externalSubscriptionId) {
          logger.error(`Missing credentialId or externalSubscriptionId for webhook ${webhook.id}`)
          totalFailed++
          continue
        }

        // Get fresh access token
        const accessToken = await refreshAccessTokenIfNeeded(
          credentialId,
          workflow.userId,
          `renewal-${webhook.id}`
        )

        if (!accessToken) {
          logger.error(`Failed to get access token for webhook ${webhook.id}`)
          totalFailed++
          continue
        }

        // Extend subscription to maximum lifetime (4230 minutes = ~3 days)
        const maxLifetimeMinutes = 4230
        const newExpirationDateTime = new Date(
          Date.now() + maxLifetimeMinutes * 60 * 1000
        ).toISOString()

        const res = await fetch(
          `https://graph.microsoft.com/v1.0/subscriptions/${externalSubscriptionId}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ expirationDateTime: newExpirationDateTime }),
          }
        )

        if (!res.ok) {
          const error = await res.json()
          logger.error(
            `Failed to renew Teams subscription ${externalSubscriptionId} for webhook ${webhook.id}`,
            { status: res.status, error: error.error }
          )
          totalFailed++
          continue
        }

        const payload = await res.json()

        // Update webhook config with new expiration
        const updatedConfig = {
          ...config,
          subscriptionExpiration: payload.expirationDateTime,
        }

        await db
          .update(webhookTable)
          .set({ providerConfig: updatedConfig, updatedAt: new Date() })
          .where(eq(webhookTable.id, webhook.id))

        logger.info(
          `Successfully renewed Teams subscription for webhook ${webhook.id}. New expiration: ${payload.expirationDateTime}`
        )
        totalRenewed++
      } catch (error) {
        logger.error(`Error renewing subscription for webhook ${webhook.id}:`, error)
        totalFailed++
      }
    }

    logger.info(
      `Teams subscription renewal job completed. Checked: ${totalChecked}, Renewed: ${totalRenewed}, Failed: ${totalFailed}`
    )

    return NextResponse.json({
      success: true,
      checked: totalChecked,
      renewed: totalRenewed,
      failed: totalFailed,
      total: webhooksWithWorkflows.length,
    })
  } catch (error) {
    logger.error('Error in Teams subscription renewal job:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

````
