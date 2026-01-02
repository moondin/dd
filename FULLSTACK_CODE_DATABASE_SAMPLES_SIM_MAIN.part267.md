---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 267
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 267 of 933)

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
Location: sim-main/apps/sim/app/api/copilot/api-keys/generate/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { SIM_AGENT_API_URL_DEFAULT } from '@/lib/copilot/constants'
import { env } from '@/lib/core/config/env'

const GenerateApiKeySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Move environment variable access inside the function
    const SIM_AGENT_API_URL = env.SIM_AGENT_API_URL || SIM_AGENT_API_URL_DEFAULT

    const body = await req.json().catch(() => ({}))
    const validationResult = GenerateApiKeySchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request body',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const { name } = validationResult.data

    const res = await fetch(`${SIM_AGENT_API_URL}/api/validate-key/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(env.COPILOT_API_KEY ? { 'x-api-key': env.COPILOT_API_KEY } : {}),
      },
      body: JSON.stringify({ userId, name }),
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to generate copilot API key' },
        { status: res.status || 500 }
      )
    }

    const data = (await res.json().catch(() => null)) as { apiKey?: string; id?: string } | null

    if (!data?.apiKey) {
      return NextResponse.json({ error: 'Invalid response from Sim Agent' }, { status: 500 })
    }

    return NextResponse.json(
      { success: true, key: { id: data?.id || 'new', apiKey: data.apiKey } },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate copilot API key' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/copilot/api-keys/validate/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkServerSideUsageLimits } from '@/lib/billing/calculations/usage-monitor'
import { checkInternalApiKey } from '@/lib/copilot/utils'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('CopilotApiKeysValidate')

const ValidateApiKeySchema = z.object({
  userId: z.string().min(1, 'userId is required'),
})

export async function POST(req: NextRequest) {
  try {
    const auth = checkInternalApiKey(req)
    if (!auth.success) {
      return new NextResponse(null, { status: 401 })
    }

    const body = await req.json().catch(() => null)

    const validationResult = ValidateApiKeySchema.safeParse(body)

    if (!validationResult.success) {
      logger.warn('Invalid validation request', { errors: validationResult.error.errors })
      return NextResponse.json(
        {
          error: 'userId is required',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const { userId } = validationResult.data

    logger.info('[API VALIDATION] Validating usage limit', { userId })

    const { isExceeded, currentUsage, limit } = await checkServerSideUsageLimits(userId)

    logger.info('[API VALIDATION] Usage limit validated', {
      userId,
      currentUsage,
      limit,
      isExceeded,
    })

    if (isExceeded) {
      logger.info('[API VALIDATION] Usage exceeded', { userId, currentUsage, limit })
      return new NextResponse(null, { status: 402 })
    }

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    logger.error('Error validating usage limit', { error })
    return NextResponse.json({ error: 'Failed to validate usage' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/copilot/auto-allowed-tools/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { settings } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('CopilotAutoAllowedToolsAPI')

/**
 * GET - Fetch user's auto-allowed integration tools
 */
export async function GET() {
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
      const autoAllowedTools = (userSettings.copilotAutoAllowedTools as string[]) || []
      return NextResponse.json({ autoAllowedTools })
    }

    await db.insert(settings).values({
      id: userId,
      userId,
      copilotAutoAllowedTools: [],
    })

    return NextResponse.json({ autoAllowedTools: [] })
  } catch (error) {
    logger.error('Failed to fetch auto-allowed tools', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST - Add a tool to the auto-allowed list
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()

    if (!body.toolId || typeof body.toolId !== 'string') {
      return NextResponse.json({ error: 'toolId must be a string' }, { status: 400 })
    }

    const toolId = body.toolId

    const [existing] = await db.select().from(settings).where(eq(settings.userId, userId)).limit(1)

    if (existing) {
      const currentTools = (existing.copilotAutoAllowedTools as string[]) || []

      if (!currentTools.includes(toolId)) {
        const updatedTools = [...currentTools, toolId]
        await db
          .update(settings)
          .set({
            copilotAutoAllowedTools: updatedTools,
            updatedAt: new Date(),
          })
          .where(eq(settings.userId, userId))

        logger.info('Added tool to auto-allowed list', { userId, toolId })
        return NextResponse.json({ success: true, autoAllowedTools: updatedTools })
      }

      return NextResponse.json({ success: true, autoAllowedTools: currentTools })
    }

    await db.insert(settings).values({
      id: userId,
      userId,
      copilotAutoAllowedTools: [toolId],
    })

    logger.info('Created settings and added tool to auto-allowed list', { userId, toolId })
    return NextResponse.json({ success: true, autoAllowedTools: [toolId] })
  } catch (error) {
    logger.error('Failed to add auto-allowed tool', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE - Remove a tool from the auto-allowed list
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const toolId = searchParams.get('toolId')

    if (!toolId) {
      return NextResponse.json({ error: 'toolId query parameter is required' }, { status: 400 })
    }

    const [existing] = await db.select().from(settings).where(eq(settings.userId, userId)).limit(1)

    if (existing) {
      const currentTools = (existing.copilotAutoAllowedTools as string[]) || []
      const updatedTools = currentTools.filter((t) => t !== toolId)

      await db
        .update(settings)
        .set({
          copilotAutoAllowedTools: updatedTools,
          updatedAt: new Date(),
        })
        .where(eq(settings.userId, userId))

      logger.info('Removed tool from auto-allowed list', { userId, toolId })
      return NextResponse.json({ success: true, autoAllowedTools: updatedTools })
    }

    return NextResponse.json({ success: true, autoAllowedTools: [] })
  } catch (error) {
    logger.error('Failed to remove auto-allowed tool', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

````
