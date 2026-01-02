---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 319
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 319 of 933)

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
Location: sim-main/apps/sim/app/api/users/me/profile/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { user } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('UpdateUserProfileAPI')

const UpdateProfileSchema = z
  .object({
    name: z.string().min(1, 'Name is required').optional(),
    image: z
      .string()
      .refine(
        (val) => {
          return val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/api/')
        },
        { message: 'Invalid image URL' }
      )
      .optional(),
  })
  .refine((data) => data.name !== undefined || data.image !== undefined, {
    message: 'At least one field (name or image) must be provided',
  })

interface UpdateData {
  updatedAt: Date
  name?: string
  image?: string | null
}

export const dynamic = 'force-dynamic'

export async function PATCH(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const session = await getSession()

    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized profile update attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()

    const validatedData = UpdateProfileSchema.parse(body)

    const updateData: UpdateData = { updatedAt: new Date() }
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.image !== undefined) updateData.image = validatedData.image

    const [updatedUser] = await db
      .update(user)
      .set(updateData)
      .where(eq(user.id, userId))
      .returning()

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    logger.info(`[${requestId}] User profile updated`, {
      userId,
      updatedFields: Object.keys(validatedData),
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
      },
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid profile data`, {
        errors: error.errors,
      })
      return NextResponse.json(
        { error: 'Invalid profile data', details: error.errors },
        { status: 400 }
      )
    }

    logger.error(`[${requestId}] Profile update error`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET endpoint to fetch current user profile
export async function GET() {
  const requestId = generateRequestId()

  try {
    const session = await getSession()

    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized profile fetch attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const [userRecord] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1)

    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: userRecord,
    })
  } catch (error: any) {
    logger.error(`[${requestId}] Profile fetch error`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/users/me/settings/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { settings } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('UserSettingsAPI')

const SettingsSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']).optional(),
  autoConnect: z.boolean().optional(),
  telemetryEnabled: z.boolean().optional(),
  emailPreferences: z
    .object({
      unsubscribeAll: z.boolean().optional(),
      unsubscribeMarketing: z.boolean().optional(),
      unsubscribeUpdates: z.boolean().optional(),
      unsubscribeNotifications: z.boolean().optional(),
    })
    .optional(),
  billingUsageNotificationsEnabled: z.boolean().optional(),
  showTrainingControls: z.boolean().optional(),
  superUserModeEnabled: z.boolean().optional(),
  errorNotificationsEnabled: z.boolean().optional(),
})

// Default settings values
const defaultSettings = {
  theme: 'system',
  autoConnect: true,
  telemetryEnabled: true,
  emailPreferences: {},
  billingUsageNotificationsEnabled: true,
  showTrainingControls: false,
  superUserModeEnabled: false,
  errorNotificationsEnabled: true,
}

export async function GET() {
  const requestId = generateRequestId()

  try {
    const session = await getSession()

    // Return default settings for unauthenticated users instead of 401 error
    if (!session?.user?.id) {
      logger.info(`[${requestId}] Returning default settings for unauthenticated user`)
      return NextResponse.json({ data: defaultSettings }, { status: 200 })
    }

    const userId = session.user.id
    const result = await db.select().from(settings).where(eq(settings.userId, userId)).limit(1)

    if (!result.length) {
      return NextResponse.json({ data: defaultSettings }, { status: 200 })
    }

    const userSettings = result[0]

    return NextResponse.json(
      {
        data: {
          theme: userSettings.theme,
          autoConnect: userSettings.autoConnect,
          telemetryEnabled: userSettings.telemetryEnabled,
          emailPreferences: userSettings.emailPreferences ?? {},
          billingUsageNotificationsEnabled: userSettings.billingUsageNotificationsEnabled ?? true,
          showTrainingControls: userSettings.showTrainingControls ?? false,
          superUserModeEnabled: userSettings.superUserModeEnabled ?? true,
          errorNotificationsEnabled: userSettings.errorNotificationsEnabled ?? true,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    logger.error(`[${requestId}] Settings fetch error`, error)
    // Return default settings on error instead of error response
    return NextResponse.json({ data: defaultSettings }, { status: 200 })
  }
}

export async function PATCH(request: Request) {
  const requestId = generateRequestId()

  try {
    const session = await getSession()

    // Return success for unauthenticated users instead of error
    if (!session?.user?.id) {
      logger.info(
        `[${requestId}] Settings update attempted by unauthenticated user - acknowledged without saving`
      )
      return NextResponse.json({ success: true }, { status: 200 })
    }

    const userId = session.user.id
    const body = await request.json()

    try {
      const validatedData = SettingsSchema.parse(body)

      // Store the settings
      await db
        .insert(settings)
        .values({
          id: nanoid(),
          userId,
          ...validatedData,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [settings.userId],
          set: {
            ...validatedData,
            updatedAt: new Date(),
          },
        })

      return NextResponse.json({ success: true }, { status: 200 })
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        logger.warn(`[${requestId}] Invalid settings data`, {
          errors: validationError.errors,
        })
        return NextResponse.json(
          { error: 'Invalid settings data', details: validationError.errors },
          { status: 400 }
        )
      }
      throw validationError
    }
  } catch (error: any) {
    logger.error(`[${requestId}] Settings update error`, error)
    // Return success on error instead of error response
    return NextResponse.json({ success: true }, { status: 200 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/users/me/settings/unsubscribe/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import type { EmailType } from '@/lib/messaging/email/mailer'
import {
  getEmailPreferences,
  isTransactionalEmail,
  unsubscribeFromAll,
  updateEmailPreferences,
  verifyUnsubscribeToken,
} from '@/lib/messaging/email/unsubscribe'

const logger = createLogger('UnsubscribeAPI')

const unsubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  token: z.string().min(1, 'Token is required'),
  type: z.enum(['all', 'marketing', 'updates', 'notifications']).optional().default('all'),
})

export async function GET(req: NextRequest) {
  const requestId = generateRequestId()

  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const token = searchParams.get('token')

    if (!email || !token) {
      logger.warn(`[${requestId}] Missing email or token in GET request`)
      return NextResponse.json({ error: 'Missing email or token parameter' }, { status: 400 })
    }

    // Verify token and get email type
    const tokenVerification = verifyUnsubscribeToken(email, token)
    if (!tokenVerification.valid) {
      logger.warn(`[${requestId}] Invalid unsubscribe token for email: ${email}`)
      return NextResponse.json({ error: 'Invalid or expired unsubscribe link' }, { status: 400 })
    }

    const emailType = tokenVerification.emailType as EmailType
    const isTransactional = isTransactionalEmail(emailType)

    // Get current preferences
    const preferences = await getEmailPreferences(email)

    logger.info(
      `[${requestId}] Valid unsubscribe GET request for email: ${email}, type: ${emailType}`
    )

    return NextResponse.json({
      success: true,
      email,
      token,
      emailType,
      isTransactional,
      currentPreferences: preferences || {},
    })
  } catch (error) {
    logger.error(`[${requestId}] Error processing unsubscribe GET request:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const requestId = generateRequestId()

  try {
    const body = await req.json()
    const result = unsubscribeSchema.safeParse(body)

    if (!result.success) {
      logger.warn(`[${requestId}] Invalid unsubscribe POST data`, {
        errors: result.error.format(),
      })
      return NextResponse.json(
        { error: 'Invalid request data', details: result.error.format() },
        { status: 400 }
      )
    }

    const { email, token, type } = result.data

    // Verify token and get email type
    const tokenVerification = verifyUnsubscribeToken(email, token)
    if (!tokenVerification.valid) {
      logger.warn(`[${requestId}] Invalid unsubscribe token for email: ${email}`)
      return NextResponse.json({ error: 'Invalid or expired unsubscribe link' }, { status: 400 })
    }

    const emailType = tokenVerification.emailType as EmailType
    const isTransactional = isTransactionalEmail(emailType)

    // Prevent unsubscribing from transactional emails
    if (isTransactional) {
      logger.warn(`[${requestId}] Attempted to unsubscribe from transactional email: ${email}`)
      return NextResponse.json(
        {
          error: 'Cannot unsubscribe from transactional emails',
          isTransactional: true,
          message:
            'Transactional emails cannot be unsubscribed from as they contain important account information.',
        },
        { status: 400 }
      )
    }

    // Process unsubscribe based on type
    let success = false
    switch (type) {
      case 'all':
        success = await unsubscribeFromAll(email)
        break
      case 'marketing':
        success = await updateEmailPreferences(email, { unsubscribeMarketing: true })
        break
      case 'updates':
        success = await updateEmailPreferences(email, { unsubscribeUpdates: true })
        break
      case 'notifications':
        success = await updateEmailPreferences(email, { unsubscribeNotifications: true })
        break
    }

    if (!success) {
      logger.error(`[${requestId}] Failed to update unsubscribe preferences for: ${email}`)
      return NextResponse.json({ error: 'Failed to process unsubscribe request' }, { status: 500 })
    }

    logger.info(`[${requestId}] Successfully unsubscribed ${email} from ${type}`)

    // Return 200 for one-click unsubscribe compliance
    return NextResponse.json(
      {
        success: true,
        message: `Successfully unsubscribed from ${type} emails`,
        email,
        type,
        emailType,
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error(`[${requestId}] Error processing unsubscribe POST request:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/users/me/subscription/[id]/transfer/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { member, organization, subscription } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('SubscriptionTransferAPI')

const transferSubscriptionSchema = z.object({
  organizationId: z.string().min(1),
})

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const subscriptionId = (await params).id
    const session = await getSession()

    if (!session?.user?.id) {
      logger.warn('Unauthorized subscription transfer attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body
    try {
      body = await request.json()
    } catch (_parseError) {
      return NextResponse.json(
        {
          error: 'Invalid JSON in request body',
        },
        { status: 400 }
      )
    }

    const validationResult = transferSubscriptionSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request parameters',
          details: validationResult.error.format(),
        },
        { status: 400 }
      )
    }

    const { organizationId } = validationResult.data
    logger.info('Processing subscription transfer', { subscriptionId, organizationId })

    const sub = await db
      .select()
      .from(subscription)
      .where(eq(subscription.id, subscriptionId))
      .then((rows) => rows[0])

    if (!sub) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    if (sub.referenceId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - subscription does not belong to user' },
        { status: 403 }
      )
    }

    const org = await db
      .select()
      .from(organization)
      .where(eq(organization.id, organizationId))
      .then((rows) => rows[0])

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    const mem = await db
      .select()
      .from(member)
      .where(and(eq(member.userId, session.user.id), eq(member.organizationId, organizationId)))
      .then((rows) => rows[0])

    if (!mem || (mem.role !== 'owner' && mem.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized - user is not admin of organization' },
        { status: 403 }
      )
    }

    await db
      .update(subscription)
      .set({ referenceId: organizationId })
      .where(eq(subscription.id, subscriptionId))

    logger.info('Subscription transfer completed', {
      subscriptionId,
      organizationId,
      userId: session.user.id,
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription transferred successfully',
    })
  } catch (error) {
    logger.error('Error transferring subscription', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json({ error: 'Failed to transfer subscription' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/users/me/usage-limits/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { checkServerSideUsageLimits } from '@/lib/billing'
import { getHighestPrioritySubscription } from '@/lib/billing/core/subscription'
import { getEffectiveCurrentPeriodCost } from '@/lib/billing/core/usage'
import { getUserStorageLimit, getUserStorageUsage } from '@/lib/billing/storage'
import { RateLimiter } from '@/lib/core/rate-limiter'
import { createLogger } from '@/lib/logs/console/logger'
import { createErrorResponse } from '@/app/api/workflows/utils'

const logger = createLogger('UsageLimitsAPI')

export async function GET(request: NextRequest) {
  try {
    const auth = await checkHybridAuth(request, { requireWorkflowId: false })
    if (!auth.success || !auth.userId) {
      return createErrorResponse('Authentication required', 401)
    }
    const authenticatedUserId = auth.userId

    const userSubscription = await getHighestPrioritySubscription(authenticatedUserId)
    const rateLimiter = new RateLimiter()
    const triggerType = auth.authType === 'api_key' ? 'api' : 'manual'
    const [syncStatus, asyncStatus] = await Promise.all([
      rateLimiter.getRateLimitStatusWithSubscription(
        authenticatedUserId,
        userSubscription,
        triggerType,
        false
      ),
      rateLimiter.getRateLimitStatusWithSubscription(
        authenticatedUserId,
        userSubscription,
        triggerType,
        true
      ),
    ])

    const [usageCheck, effectiveCost, storageUsage, storageLimit] = await Promise.all([
      checkServerSideUsageLimits(authenticatedUserId),
      getEffectiveCurrentPeriodCost(authenticatedUserId),
      getUserStorageUsage(authenticatedUserId),
      getUserStorageLimit(authenticatedUserId),
    ])

    const currentPeriodCost = effectiveCost

    return NextResponse.json({
      success: true,
      rateLimit: {
        sync: {
          isLimited: syncStatus.remaining === 0,
          requestsPerMinute: syncStatus.requestsPerMinute,
          maxBurst: syncStatus.maxBurst,
          remaining: syncStatus.remaining,
          resetAt: syncStatus.resetAt,
        },
        async: {
          isLimited: asyncStatus.remaining === 0,
          requestsPerMinute: asyncStatus.requestsPerMinute,
          maxBurst: asyncStatus.maxBurst,
          remaining: asyncStatus.remaining,
          resetAt: asyncStatus.resetAt,
        },
        authType: triggerType,
      },
      usage: {
        currentPeriodCost,
        limit: usageCheck.limit,
        plan: userSubscription?.plan || 'free',
      },
      storage: {
        usedBytes: storageUsage,
        limitBytes: storageLimit,
        percentUsed: storageLimit > 0 ? (storageUsage / storageLimit) * 100 : 0,
      },
    })
  } catch (error: any) {
    logger.error('Error checking usage limits:', error)
    return createErrorResponse(error.message || 'Failed to check usage limits', 500)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: auth.ts]---
Location: sim-main/apps/sim/app/api/v1/auth.ts
Signals: Next.js

```typescript
import type { NextRequest } from 'next/server'
import { authenticateApiKeyFromHeader, updateApiKeyLastUsed } from '@/lib/api-key/service'
import { ANONYMOUS_USER_ID } from '@/lib/auth/constants'
import { isAuthDisabled } from '@/lib/core/config/feature-flags'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('V1Auth')

export interface AuthResult {
  authenticated: boolean
  userId?: string
  workspaceId?: string
  keyType?: 'personal' | 'workspace'
  error?: string
}

export async function authenticateV1Request(request: NextRequest): Promise<AuthResult> {
  if (isAuthDisabled) {
    return {
      authenticated: true,
      userId: ANONYMOUS_USER_ID,
      keyType: 'personal',
    }
  }

  const apiKey = request.headers.get('x-api-key')

  if (!apiKey) {
    return {
      authenticated: false,
      error: 'API key required',
    }
  }

  try {
    const result = await authenticateApiKeyFromHeader(apiKey)

    if (!result.success) {
      logger.warn('Invalid API key attempted', { keyPrefix: apiKey.slice(0, 8) })
      return {
        authenticated: false,
        error: result.error || 'Invalid API key',
      }
    }

    await updateApiKeyLastUsed(result.keyId!)

    return {
      authenticated: true,
      userId: result.userId!,
      workspaceId: result.workspaceId,
      keyType: result.keyType,
    }
  } catch (error) {
    logger.error('API key authentication error', { error })
    return {
      authenticated: false,
      error: 'Authentication failed',
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: middleware.ts]---
Location: sim-main/apps/sim/app/api/v1/middleware.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { getHighestPrioritySubscription } from '@/lib/billing/core/subscription'
import { RateLimiter } from '@/lib/core/rate-limiter'
import { createLogger } from '@/lib/logs/console/logger'
import { authenticateV1Request } from '@/app/api/v1/auth'

const logger = createLogger('V1Middleware')
const rateLimiter = new RateLimiter()

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
  limit: number
  retryAfterMs?: number
  userId?: string
  error?: string
}

export async function checkRateLimit(
  request: NextRequest,
  endpoint: 'logs' | 'logs-detail' = 'logs'
): Promise<RateLimitResult> {
  try {
    const auth = await authenticateV1Request(request)
    if (!auth.authenticated) {
      return {
        allowed: false,
        remaining: 0,
        limit: 10,
        resetAt: new Date(),
        error: auth.error,
      }
    }

    const userId = auth.userId!
    const subscription = await getHighestPrioritySubscription(userId)

    const result = await rateLimiter.checkRateLimitWithSubscription(
      userId,
      subscription,
      'api-endpoint',
      false
    )

    if (!result.allowed) {
      logger.warn(`Rate limit exceeded for user ${userId}`, {
        endpoint,
        remaining: result.remaining,
        resetAt: result.resetAt,
      })
    }

    const rateLimitStatus = await rateLimiter.getRateLimitStatusWithSubscription(
      userId,
      subscription,
      'api-endpoint',
      false
    )

    return {
      allowed: result.allowed,
      remaining: result.remaining,
      resetAt: result.resetAt,
      limit: rateLimitStatus.requestsPerMinute,
      retryAfterMs: result.retryAfterMs,
      userId,
    }
  } catch (error) {
    logger.error('Rate limit check error', { error })
    return {
      allowed: false,
      remaining: 0,
      limit: 10,
      resetAt: new Date(Date.now() + 60000),
      error: 'Rate limit check failed',
    }
  }
}

export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  const headers = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetAt.toISOString(),
  }

  if (result.error) {
    return NextResponse.json({ error: result.error || 'Unauthorized' }, { status: 401, headers })
  }

  if (!result.allowed) {
    const retryAfterSeconds = result.retryAfterMs
      ? Math.ceil(result.retryAfterMs / 1000)
      : Math.ceil((result.resetAt.getTime() - Date.now()) / 1000)

    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: `API rate limit exceeded. Please retry after ${result.resetAt.toISOString()}`,
        retryAfter: result.resetAt.getTime(),
      },
      {
        status: 429,
        headers: {
          ...headers,
          'Retry-After': retryAfterSeconds.toString(),
        },
      }
    )
  }

  return NextResponse.json({ error: 'Bad request' }, { status: 400, headers })
}
```

--------------------------------------------------------------------------------

---[FILE: auth.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/auth.ts
Signals: Next.js

```typescript
/**
 * Admin API Authentication
 *
 * Authenticates admin API requests using the ADMIN_API_KEY environment variable.
 * Designed for self-hosted deployments where GitOps/scripted access is needed.
 *
 * Usage:
 *   curl -H "x-admin-key: your_admin_key" https://your-instance/api/v1/admin/...
 */

import { createHash, timingSafeEqual } from 'crypto'
import type { NextRequest } from 'next/server'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('AdminAuth')

export interface AdminAuthSuccess {
  authenticated: true
}

export interface AdminAuthFailure {
  authenticated: false
  error: string
  notConfigured?: boolean
}

export type AdminAuthResult = AdminAuthSuccess | AdminAuthFailure

/**
 * Authenticate an admin API request.
 *
 * @param request - The incoming Next.js request
 * @returns Authentication result with success status and optional error
 */
export function authenticateAdminRequest(request: NextRequest): AdminAuthResult {
  const adminKey = env.ADMIN_API_KEY

  if (!adminKey) {
    logger.warn('ADMIN_API_KEY environment variable is not set')
    return {
      authenticated: false,
      error: 'Admin API is not configured. Set ADMIN_API_KEY environment variable.',
      notConfigured: true,
    }
  }

  const providedKey = request.headers.get('x-admin-key')

  if (!providedKey) {
    return {
      authenticated: false,
      error: 'Admin API key required. Provide x-admin-key header.',
    }
  }

  if (!constantTimeCompare(providedKey, adminKey)) {
    logger.warn('Invalid admin API key attempted', { keyPrefix: providedKey.slice(0, 8) })
    return {
      authenticated: false,
      error: 'Invalid admin API key',
    }
  }

  return { authenticated: true }
}

/**
 * Constant-time string comparison.
 *
 * @param a - First string to compare
 * @param b - Second string to compare
 * @returns True if strings are equal, false otherwise
 */
function constantTimeCompare(a: string, b: string): boolean {
  const aHash = createHash('sha256').update(a).digest()
  const bHash = createHash('sha256').update(b).digest()
  return timingSafeEqual(aHash, bHash)
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/index.ts

```typescript
/**
 * Admin API v1
 *
 * A RESTful API for administrative operations on Sim.
 *
 * Authentication:
 *   Set ADMIN_API_KEY environment variable and use x-admin-key header.
 *
 * Endpoints:
 *
 *   Users:
 *   GET    /api/v1/admin/users                              - List all users
 *   GET    /api/v1/admin/users/:id                          - Get user details
 *   GET    /api/v1/admin/users/:id/billing                  - Get user billing info
 *   PATCH  /api/v1/admin/users/:id/billing                  - Update user billing (limit, blocked)
 *
 *   Workspaces:
 *   GET    /api/v1/admin/workspaces                         - List all workspaces
 *   GET    /api/v1/admin/workspaces/:id                     - Get workspace details
 *   GET    /api/v1/admin/workspaces/:id/workflows           - List workspace workflows
 *   DELETE /api/v1/admin/workspaces/:id/workflows           - Delete all workspace workflows
 *   GET    /api/v1/admin/workspaces/:id/folders             - List workspace folders
 *   GET    /api/v1/admin/workspaces/:id/export              - Export workspace (ZIP/JSON)
 *   POST   /api/v1/admin/workspaces/:id/import              - Import into workspace
 *
 *   Workflows:
 *   GET    /api/v1/admin/workflows                          - List all workflows
 *   GET    /api/v1/admin/workflows/:id                      - Get workflow details
 *   DELETE /api/v1/admin/workflows/:id                      - Delete workflow
 *   GET    /api/v1/admin/workflows/:id/export               - Export workflow (JSON)
 *   POST   /api/v1/admin/workflows/import                   - Import single workflow
 *
 *   Organizations:
 *   GET    /api/v1/admin/organizations                      - List all organizations
 *   GET    /api/v1/admin/organizations/:id                  - Get organization details
 *   PATCH  /api/v1/admin/organizations/:id                  - Update organization
 *   GET    /api/v1/admin/organizations/:id/members          - List organization members
 *   POST   /api/v1/admin/organizations/:id/members          - Add/update member (validates seat availability)
 *   GET    /api/v1/admin/organizations/:id/members/:mid     - Get member details
 *   PATCH  /api/v1/admin/organizations/:id/members/:mid     - Update member role
 *   DELETE /api/v1/admin/organizations/:id/members/:mid     - Remove member
 *   GET    /api/v1/admin/organizations/:id/billing          - Get org billing summary
 *   PATCH  /api/v1/admin/organizations/:id/billing          - Update org usage limit
 *   GET    /api/v1/admin/organizations/:id/seats            - Get seat analytics
 *
 *   Subscriptions:
 *   GET    /api/v1/admin/subscriptions                      - List all subscriptions
 *   GET    /api/v1/admin/subscriptions/:id                  - Get subscription details
 *   DELETE /api/v1/admin/subscriptions/:id                  - Cancel subscription (?atPeriodEnd=true for scheduled)
 */

export type { AdminAuthFailure, AdminAuthResult, AdminAuthSuccess } from '@/app/api/v1/admin/auth'
export { authenticateAdminRequest } from '@/app/api/v1/admin/auth'
export type { AdminRouteHandler, AdminRouteHandlerWithParams } from '@/app/api/v1/admin/middleware'
export { withAdminAuth, withAdminAuthParams } from '@/app/api/v1/admin/middleware'
export {
  badRequestResponse,
  errorResponse,
  forbiddenResponse,
  internalErrorResponse,
  listResponse,
  notConfiguredResponse,
  notFoundResponse,
  singleResponse,
  unauthorizedResponse,
} from '@/app/api/v1/admin/responses'
export type {
  AdminErrorResponse,
  AdminFolder,
  AdminListResponse,
  AdminMember,
  AdminMemberDetail,
  AdminOrganization,
  AdminOrganizationBillingSummary,
  AdminOrganizationDetail,
  AdminSeatAnalytics,
  AdminSingleResponse,
  AdminSubscription,
  AdminUser,
  AdminUserBilling,
  AdminUserBillingWithSubscription,
  AdminWorkflow,
  AdminWorkflowDetail,
  AdminWorkspace,
  AdminWorkspaceDetail,
  DbMember,
  DbOrganization,
  DbSubscription,
  DbUser,
  DbUserStats,
  DbWorkflow,
  DbWorkflowFolder,
  DbWorkspace,
  FolderExportPayload,
  ImportResult,
  PaginationMeta,
  PaginationParams,
  VariableType,
  WorkflowExportPayload,
  WorkflowExportState,
  WorkflowImportRequest,
  WorkflowVariable,
  WorkspaceExportPayload,
  WorkspaceImportRequest,
  WorkspaceImportResponse,
} from '@/app/api/v1/admin/types'
export {
  createPaginationMeta,
  DEFAULT_LIMIT,
  extractWorkflowMetadata,
  MAX_LIMIT,
  parsePaginationParams,
  parseWorkflowVariables,
  toAdminFolder,
  toAdminOrganization,
  toAdminSubscription,
  toAdminUser,
  toAdminWorkflow,
  toAdminWorkspace,
} from '@/app/api/v1/admin/types'
```

--------------------------------------------------------------------------------

---[FILE: middleware.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/middleware.ts
Signals: Next.js

```typescript
import type { NextRequest, NextResponse } from 'next/server'
import { authenticateAdminRequest } from '@/app/api/v1/admin/auth'
import { notConfiguredResponse, unauthorizedResponse } from '@/app/api/v1/admin/responses'

export type AdminRouteHandler = (request: NextRequest) => Promise<NextResponse>

export type AdminRouteHandlerWithParams<TParams> = (
  request: NextRequest,
  context: { params: Promise<TParams> }
) => Promise<NextResponse>

/**
 * Wrap a route handler with admin authentication.
 * Returns early with an error response if authentication fails.
 */
export function withAdminAuth(handler: AdminRouteHandler): AdminRouteHandler {
  return async (request: NextRequest) => {
    const auth = authenticateAdminRequest(request)

    if (!auth.authenticated) {
      if (auth.notConfigured) {
        return notConfiguredResponse()
      }
      return unauthorizedResponse(auth.error)
    }

    return handler(request)
  }
}

/**
 * Wrap a route handler with params with admin authentication.
 * Returns early with an error response if authentication fails.
 */
export function withAdminAuthParams<TParams>(
  handler: AdminRouteHandlerWithParams<TParams>
): AdminRouteHandlerWithParams<TParams> {
  return async (request: NextRequest, context: { params: Promise<TParams> }) => {
    const auth = authenticateAdminRequest(request)

    if (!auth.authenticated) {
      if (auth.notConfigured) {
        return notConfiguredResponse()
      }
      return unauthorizedResponse(auth.error)
    }

    return handler(request, context)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: responses.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/responses.ts
Signals: Next.js

```typescript
/**
 * Admin API Response Helpers
 *
 * Consistent response formatting for all Admin API endpoints.
 */

import { NextResponse } from 'next/server'
import type {
  AdminErrorResponse,
  AdminListResponse,
  AdminSingleResponse,
  PaginationMeta,
} from '@/app/api/v1/admin/types'

/**
 * Create a successful list response with pagination
 */
export function listResponse<T>(
  data: T[],
  pagination: PaginationMeta
): NextResponse<AdminListResponse<T>> {
  return NextResponse.json({ data, pagination })
}

/**
 * Create a successful single resource response
 */
export function singleResponse<T>(data: T): NextResponse<AdminSingleResponse<T>> {
  return NextResponse.json({ data })
}

/**
 * Create an error response
 */
export function errorResponse(
  code: string,
  message: string,
  status: number,
  details?: unknown
): NextResponse<AdminErrorResponse> {
  const body: AdminErrorResponse = {
    error: { code, message },
  }

  if (details !== undefined) {
    body.error.details = details
  }

  return NextResponse.json(body, { status })
}

// =============================================================================
// Common Error Responses
// =============================================================================

export function unauthorizedResponse(message = 'Authentication required'): NextResponse {
  return errorResponse('UNAUTHORIZED', message, 401)
}

export function forbiddenResponse(message = 'Access denied'): NextResponse {
  return errorResponse('FORBIDDEN', message, 403)
}

export function notFoundResponse(resource: string): NextResponse {
  return errorResponse('NOT_FOUND', `${resource} not found`, 404)
}

export function badRequestResponse(message: string, details?: unknown): NextResponse {
  return errorResponse('BAD_REQUEST', message, 400, details)
}

export function internalErrorResponse(message = 'Internal server error'): NextResponse {
  return errorResponse('INTERNAL_ERROR', message, 500)
}

export function notConfiguredResponse(): NextResponse {
  return errorResponse(
    'NOT_CONFIGURED',
    'Admin API is not configured. Set ADMIN_API_KEY environment variable.',
    503
  )
}
```

--------------------------------------------------------------------------------

````
