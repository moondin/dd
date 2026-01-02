---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 263
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 263 of 933)

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
Location: sim-main/apps/sim/app/api/billing/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { member, userStats } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getSimplifiedBillingSummary } from '@/lib/billing/core/billing'
import { getOrganizationBillingData } from '@/lib/billing/core/organization'
import { createLogger } from '@/lib/logs/console/logger'

/**
 * Gets the effective billing blocked status for a user.
 * If user is in an org, also checks if the org owner is blocked.
 */
async function getEffectiveBillingStatus(userId: string): Promise<{
  billingBlocked: boolean
  billingBlockedReason: 'payment_failed' | 'dispute' | null
  blockedByOrgOwner: boolean
}> {
  // Check user's own status
  const userStatsRows = await db
    .select({
      blocked: userStats.billingBlocked,
      blockedReason: userStats.billingBlockedReason,
    })
    .from(userStats)
    .where(eq(userStats.userId, userId))
    .limit(1)

  const userBlocked = userStatsRows.length > 0 ? !!userStatsRows[0].blocked : false
  const userBlockedReason = userStatsRows.length > 0 ? userStatsRows[0].blockedReason : null

  if (userBlocked) {
    return {
      billingBlocked: true,
      billingBlockedReason: userBlockedReason,
      blockedByOrgOwner: false,
    }
  }

  // Check if user is in an org where owner is blocked
  const memberships = await db
    .select({ organizationId: member.organizationId })
    .from(member)
    .where(eq(member.userId, userId))

  for (const m of memberships) {
    const owners = await db
      .select({ userId: member.userId })
      .from(member)
      .where(and(eq(member.organizationId, m.organizationId), eq(member.role, 'owner')))
      .limit(1)

    if (owners.length > 0 && owners[0].userId !== userId) {
      const ownerStats = await db
        .select({
          blocked: userStats.billingBlocked,
          blockedReason: userStats.billingBlockedReason,
        })
        .from(userStats)
        .where(eq(userStats.userId, owners[0].userId))
        .limit(1)

      if (ownerStats.length > 0 && ownerStats[0].blocked) {
        return {
          billingBlocked: true,
          billingBlockedReason: ownerStats[0].blockedReason,
          blockedByOrgOwner: true,
        }
      }
    }
  }

  return {
    billingBlocked: false,
    billingBlockedReason: null,
    blockedByOrgOwner: false,
  }
}

const logger = createLogger('UnifiedBillingAPI')

/**
 * Unified Billing Endpoint
 */
export async function GET(request: NextRequest) {
  const session = await getSession()

  try {
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const context = searchParams.get('context') || 'user'
    const contextId = searchParams.get('id')

    // Validate context parameter
    if (!['user', 'organization'].includes(context)) {
      return NextResponse.json(
        { error: 'Invalid context. Must be "user" or "organization"' },
        { status: 400 }
      )
    }

    // For organization context, require contextId
    if (context === 'organization' && !contextId) {
      return NextResponse.json(
        { error: 'Organization ID is required when context=organization' },
        { status: 400 }
      )
    }

    let billingData

    if (context === 'user') {
      // Get user billing (may include organization if they're part of one)
      billingData = await getSimplifiedBillingSummary(session.user.id, contextId || undefined)
      // Attach effective billing blocked status (includes org owner check)
      const billingStatus = await getEffectiveBillingStatus(session.user.id)
      billingData = {
        ...billingData,
        billingBlocked: billingStatus.billingBlocked,
        billingBlockedReason: billingStatus.billingBlockedReason,
        blockedByOrgOwner: billingStatus.blockedByOrgOwner,
      }
    } else {
      // Get user role in organization for permission checks first
      const memberRecord = await db
        .select({ role: member.role })
        .from(member)
        .where(and(eq(member.organizationId, contextId!), eq(member.userId, session.user.id)))
        .limit(1)

      if (memberRecord.length === 0) {
        return NextResponse.json(
          { error: 'Access denied - not a member of this organization' },
          { status: 403 }
        )
      }

      // Get organization-specific billing
      const rawBillingData = await getOrganizationBillingData(contextId!)

      if (!rawBillingData) {
        return NextResponse.json(
          { error: 'Organization not found or access denied' },
          { status: 404 }
        )
      }

      // Transform data to match component expectations
      billingData = {
        organizationId: rawBillingData.organizationId,
        organizationName: rawBillingData.organizationName,
        subscriptionPlan: rawBillingData.subscriptionPlan,
        subscriptionStatus: rawBillingData.subscriptionStatus,
        totalSeats: rawBillingData.totalSeats,
        usedSeats: rawBillingData.usedSeats,
        seatsCount: rawBillingData.seatsCount,
        totalCurrentUsage: rawBillingData.totalCurrentUsage,
        totalUsageLimit: rawBillingData.totalUsageLimit,
        minimumBillingAmount: rawBillingData.minimumBillingAmount,
        averageUsagePerMember: rawBillingData.averageUsagePerMember,
        billingPeriodStart: rawBillingData.billingPeriodStart?.toISOString() || null,
        billingPeriodEnd: rawBillingData.billingPeriodEnd?.toISOString() || null,
        members: rawBillingData.members.map((member) => ({
          ...member,
          joinedAt: member.joinedAt.toISOString(),
          lastActive: member.lastActive?.toISOString() || null,
        })),
      }

      const userRole = memberRecord[0].role

      // Get effective billing blocked status (includes org owner check)
      const billingStatus = await getEffectiveBillingStatus(session.user.id)

      // Merge blocked flag into data for convenience
      billingData = {
        ...billingData,
        billingBlocked: billingStatus.billingBlocked,
        billingBlockedReason: billingStatus.billingBlockedReason,
        blockedByOrgOwner: billingStatus.blockedByOrgOwner,
      }

      return NextResponse.json({
        success: true,
        context,
        data: billingData,
        userRole,
        billingBlocked: billingData.billingBlocked,
        billingBlockedReason: billingData.billingBlockedReason,
        blockedByOrgOwner: billingData.blockedByOrgOwner,
      })
    }

    return NextResponse.json({
      success: true,
      context,
      data: billingData,
    })
  } catch (error) {
    logger.error('Failed to get billing data', {
      userId: session?.user?.id,
      error,
    })

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/billing/credits/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { getCreditBalance } from '@/lib/billing/credits/balance'
import { purchaseCredits } from '@/lib/billing/credits/purchase'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('CreditsAPI')

const PurchaseSchema = z.object({
  amount: z.number().min(10).max(1000),
  requestId: z.string().uuid(),
})

export async function GET() {
  const session = await getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { balance, entityType, entityId } = await getCreditBalance(session.user.id)
    return NextResponse.json({
      success: true,
      data: { balance, entityType, entityId },
    })
  } catch (error) {
    logger.error('Failed to get credit balance', { error, userId: session.user.id })
    return NextResponse.json({ error: 'Failed to get credit balance' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validation = PurchaseSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid amount. Must be between $10 and $1000' },
        { status: 400 }
      )
    }

    const result = await purchaseCredits({
      userId: session.user.id,
      amountDollars: validation.data.amount,
      requestId: validation.data.requestId,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Failed to purchase credits', { error, userId: session.user.id })
    return NextResponse.json({ error: 'Failed to purchase credits' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/billing/portal/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { subscription as subscriptionTable, user } from '@sim/db/schema'
import { and, eq, or } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { requireStripeClient } from '@/lib/billing/stripe-client'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('BillingPortal')

export async function POST(request: NextRequest) {
  const session = await getSession()

  try {
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const context: 'user' | 'organization' =
      body?.context === 'organization' ? 'organization' : 'user'
    const organizationId: string | undefined = body?.organizationId || undefined
    const returnUrl: string = body?.returnUrl || `${getBaseUrl()}/workspace?billing=updated`

    const stripe = requireStripeClient()

    let stripeCustomerId: string | null = null

    if (context === 'organization') {
      if (!organizationId) {
        return NextResponse.json({ error: 'organizationId is required' }, { status: 400 })
      }

      const rows = await db
        .select({ customer: subscriptionTable.stripeCustomerId })
        .from(subscriptionTable)
        .where(
          and(
            eq(subscriptionTable.referenceId, organizationId),
            or(
              eq(subscriptionTable.status, 'active'),
              eq(subscriptionTable.cancelAtPeriodEnd, true)
            )
          )
        )
        .limit(1)

      stripeCustomerId = rows.length > 0 ? rows[0].customer || null : null
    } else {
      const rows = await db
        .select({ customer: user.stripeCustomerId })
        .from(user)
        .where(eq(user.id, session.user.id))
        .limit(1)

      stripeCustomerId = rows.length > 0 ? rows[0].customer || null : null
    }

    if (!stripeCustomerId) {
      logger.error('Stripe customer not found for portal session', {
        context,
        organizationId,
        userId: session.user.id,
      })
      return NextResponse.json({ error: 'Stripe customer not found' }, { status: 404 })
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    })

    return NextResponse.json({ url: portal.url })
  } catch (error) {
    logger.error('Failed to create billing portal session', { error })
    return NextResponse.json({ error: 'Failed to create billing portal session' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/billing/update-cost/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { userStats } from '@sim/db/schema'
import { eq, sql } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkAndBillOverageThreshold } from '@/lib/billing/threshold-billing'
import { checkInternalApiKey } from '@/lib/copilot/utils'
import { isBillingEnabled } from '@/lib/core/config/feature-flags'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('BillingUpdateCostAPI')

const UpdateCostSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  cost: z.number().min(0, 'Cost must be a non-negative number'),
})

/**
 * POST /api/billing/update-cost
 * Update user cost with a pre-calculated cost value (internal API key auth required)
 */
export async function POST(req: NextRequest) {
  const requestId = generateRequestId()
  const startTime = Date.now()

  try {
    logger.info(`[${requestId}] Update cost request started`)

    if (!isBillingEnabled) {
      logger.debug(`[${requestId}] Billing is disabled, skipping cost update`)
      return NextResponse.json({
        success: true,
        message: 'Billing disabled, cost update skipped',
        data: {
          billingEnabled: false,
          processedAt: new Date().toISOString(),
          requestId,
        },
      })
    }

    // Check authentication (internal API key)
    const authResult = checkInternalApiKey(req)
    if (!authResult.success) {
      logger.warn(`[${requestId}] Authentication failed: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication failed',
        },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validation = UpdateCostSchema.safeParse(body)

    if (!validation.success) {
      logger.warn(`[${requestId}] Invalid request body`, {
        errors: validation.error.issues,
        body,
      })
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const { userId, cost } = validation.data

    logger.info(`[${requestId}] Processing cost update`, {
      userId,
      cost,
    })

    // Check if user stats record exists (same as ExecutionLogger)
    const userStatsRecords = await db.select().from(userStats).where(eq(userStats.userId, userId))

    if (userStatsRecords.length === 0) {
      logger.error(
        `[${requestId}] User stats record not found - should be created during onboarding`,
        {
          userId,
        }
      )
      return NextResponse.json({ error: 'User stats record not found' }, { status: 500 })
    }

    const updateFields = {
      totalCost: sql`total_cost + ${cost}`,
      currentPeriodCost: sql`current_period_cost + ${cost}`,
      totalCopilotCost: sql`total_copilot_cost + ${cost}`,
      currentPeriodCopilotCost: sql`current_period_copilot_cost + ${cost}`,
      totalCopilotCalls: sql`total_copilot_calls + 1`,
      lastActive: new Date(),
    }

    await db.update(userStats).set(updateFields).where(eq(userStats.userId, userId))

    logger.info(`[${requestId}] Updated user stats record`, {
      userId,
      addedCost: cost,
    })

    // Check if user has hit overage threshold and bill incrementally
    await checkAndBillOverageThreshold(userId)

    const duration = Date.now() - startTime

    logger.info(`[${requestId}] Cost update completed successfully`, {
      userId,
      duration,
      cost,
    })

    return NextResponse.json({
      success: true,
      data: {
        userId,
        cost,
        processedAt: new Date().toISOString(),
        requestId,
      },
    })
  } catch (error) {
    const duration = Date.now() - startTime

    logger.error(`[${requestId}] Cost update failed`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      duration,
    })

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        requestId,
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/careers/submit/route.ts
Signals: Next.js, Zod

```typescript
import { render } from '@react-email/components'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import CareersConfirmationEmail from '@/components/emails/careers/careers-confirmation-email'
import CareersSubmissionEmail from '@/components/emails/careers/careers-submission-email'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { sendEmail } from '@/lib/messaging/email/mailer'

export const dynamic = 'force-dynamic'

const logger = createLogger('CareersAPI')

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const CareersSubmissionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  position: z.string().min(2, 'Please specify the position you are interested in'),
  linkedin: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  portfolio: z.string().url('Please enter a valid portfolio URL').optional().or(z.literal('')),
  experience: z.enum(['0-1', '1-3', '3-5', '5-10', '10+']),
  location: z.string().min(2, 'Please enter your location'),
  message: z.string().min(50, 'Please tell us more about yourself (at least 50 characters)'),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const formData = await request.formData()

    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      position: formData.get('position') as string,
      linkedin: formData.get('linkedin') as string,
      portfolio: formData.get('portfolio') as string,
      experience: formData.get('experience') as string,
      location: formData.get('location') as string,
      message: formData.get('message') as string,
    }

    const resumeFile = formData.get('resume') as File | null
    if (!resumeFile) {
      return NextResponse.json(
        {
          success: false,
          message: 'Resume is required',
          errors: [{ path: ['resume'], message: 'Resume is required' }],
        },
        { status: 400 }
      )
    }

    if (resumeFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: 'Resume file size must be less than 10MB',
          errors: [{ path: ['resume'], message: 'File size must be less than 10MB' }],
        },
        { status: 400 }
      )
    }

    if (!ALLOWED_FILE_TYPES.includes(resumeFile.type)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Resume must be a PDF or Word document',
          errors: [{ path: ['resume'], message: 'File must be PDF or Word document' }],
        },
        { status: 400 }
      )
    }

    const resumeBuffer = await resumeFile.arrayBuffer()
    const resumeBase64 = Buffer.from(resumeBuffer).toString('base64')

    const validatedData = CareersSubmissionSchema.parse(data)

    logger.info(`[${requestId}] Processing career application`, {
      name: validatedData.name,
      email: validatedData.email,
      position: validatedData.position,
      resumeSize: resumeFile.size,
      resumeType: resumeFile.type,
    })

    const submittedDate = new Date()

    const careersEmailHtml = await render(
      CareersSubmissionEmail({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        position: validatedData.position,
        linkedin: validatedData.linkedin,
        portfolio: validatedData.portfolio,
        experience: validatedData.experience,
        location: validatedData.location,
        message: validatedData.message,
        submittedDate,
      })
    )

    const confirmationEmailHtml = await render(
      CareersConfirmationEmail({
        name: validatedData.name,
        position: validatedData.position,
        submittedDate,
      })
    )

    const careersEmailResult = await sendEmail({
      to: 'careers@sim.ai',
      subject: `New Career Application: ${validatedData.name} - ${validatedData.position}`,
      html: careersEmailHtml,
      emailType: 'transactional',
      replyTo: validatedData.email,
      attachments: [
        {
          filename: resumeFile.name,
          content: resumeBase64,
          contentType: resumeFile.type,
        },
      ],
    })

    if (!careersEmailResult.success) {
      logger.error(`[${requestId}] Failed to send email to careers@sim.ai`, {
        error: careersEmailResult.message,
      })
      throw new Error('Failed to submit application')
    }

    const confirmationResult = await sendEmail({
      to: validatedData.email,
      subject: `Your Application to Sim - ${validatedData.position}`,
      html: confirmationEmailHtml,
      emailType: 'transactional',
      replyTo: validatedData.email,
    })

    if (!confirmationResult.success) {
      logger.warn(`[${requestId}] Failed to send confirmation email to applicant`, {
        email: validatedData.email,
        error: confirmationResult.message,
      })
    }

    logger.info(`[${requestId}] Career application submitted successfully`, {
      careersEmailSent: careersEmailResult.success,
      confirmationEmailSent: confirmationResult.success,
    })

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid application data`, { errors: error.errors })
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid application data',
          errors: error.errors,
        },
        { status: 400 }
      )
    }

    logger.error(`[${requestId}] Error processing career application:`, error)

    return NextResponse.json(
      {
        success: false,
        message:
          'Failed to submit application. Please try again or email us directly at careers@sim.ai',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.test.ts]---
Location: sim-main/apps/sim/app/api/chat/route.test.ts
Signals: Next.js

```typescript
import { NextRequest } from 'next/server'
/**
 * Tests for chat API route
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('Chat API Route', () => {
  const mockSelect = vi.fn()
  const mockFrom = vi.fn()
  const mockWhere = vi.fn()
  const mockLimit = vi.fn()
  const mockInsert = vi.fn()
  const mockValues = vi.fn()
  const mockReturning = vi.fn()

  const mockCreateSuccessResponse = vi.fn()
  const mockCreateErrorResponse = vi.fn()
  const mockEncryptSecret = vi.fn()
  const mockCheckWorkflowAccessForChatCreation = vi.fn()
  const mockDeployWorkflow = vi.fn()

  beforeEach(() => {
    vi.resetModules()

    mockSelect.mockReturnValue({ from: mockFrom })
    mockFrom.mockReturnValue({ where: mockWhere })
    mockWhere.mockReturnValue({ limit: mockLimit })
    mockInsert.mockReturnValue({ values: mockValues })
    mockValues.mockReturnValue({ returning: mockReturning })

    vi.doMock('@sim/db', () => ({
      db: {
        select: mockSelect,
        insert: mockInsert,
      },
    }))

    vi.doMock('@sim/db/schema', () => ({
      chat: { userId: 'userId', identifier: 'identifier' },
      workflow: { id: 'id', userId: 'userId', isDeployed: 'isDeployed' },
    }))

    vi.doMock('@/lib/logs/console/logger', () => ({
      createLogger: vi.fn().mockReturnValue({
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
        debug: vi.fn(),
      }),
    }))

    vi.doMock('@/app/api/workflows/utils', () => ({
      createSuccessResponse: mockCreateSuccessResponse.mockImplementation((data) => {
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }),
      createErrorResponse: mockCreateErrorResponse.mockImplementation((message, status = 500) => {
        return new Response(JSON.stringify({ error: message }), {
          status,
          headers: { 'Content-Type': 'application/json' },
        })
      }),
    }))

    vi.doMock('@/lib/core/security/encryption', () => ({
      encryptSecret: mockEncryptSecret.mockResolvedValue({ encrypted: 'encrypted-password' }),
    }))

    vi.doMock('uuid', () => ({
      v4: vi.fn().mockReturnValue('test-uuid'),
    }))

    vi.doMock('@/app/api/chat/utils', () => ({
      checkWorkflowAccessForChatCreation: mockCheckWorkflowAccessForChatCreation,
    }))

    vi.doMock('@/lib/workflows/persistence/utils', () => ({
      deployWorkflow: mockDeployWorkflow.mockResolvedValue({
        success: true,
        version: 1,
        deployedAt: new Date(),
      }),
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('should return 401 when user is not authenticated', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue(null),
      }))

      const req = new NextRequest('http://localhost:3000/api/chat')
      const { GET } = await import('@/app/api/chat/route')
      const response = await GET(req)

      expect(response.status).toBe(401)
      expect(mockCreateErrorResponse).toHaveBeenCalledWith('Unauthorized', 401)
    })

    it('should return chat deployments for authenticated user', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue({
          user: { id: 'user-id' },
        }),
      }))

      const mockDeployments = [{ id: 'deployment-1' }, { id: 'deployment-2' }]
      mockWhere.mockResolvedValue(mockDeployments)

      const req = new NextRequest('http://localhost:3000/api/chat')
      const { GET } = await import('@/app/api/chat/route')
      const response = await GET(req)

      expect(response.status).toBe(200)
      expect(mockCreateSuccessResponse).toHaveBeenCalledWith({ deployments: mockDeployments })
      expect(mockWhere).toHaveBeenCalled()
    })

    it('should handle errors when fetching deployments', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue({
          user: { id: 'user-id' },
        }),
      }))

      mockWhere.mockRejectedValue(new Error('Database error'))

      const req = new NextRequest('http://localhost:3000/api/chat')
      const { GET } = await import('@/app/api/chat/route')
      const response = await GET(req)

      expect(response.status).toBe(500)
      expect(mockCreateErrorResponse).toHaveBeenCalledWith('Database error', 500)
    })
  })

  describe('POST', () => {
    it('should return 401 when user is not authenticated', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue(null),
      }))

      const req = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({}),
      })
      const { POST } = await import('@/app/api/chat/route')
      const response = await POST(req)

      expect(response.status).toBe(401)
      expect(mockCreateErrorResponse).toHaveBeenCalledWith('Unauthorized', 401)
    })

    it('should validate request data', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue({
          user: { id: 'user-id' },
        }),
      }))

      const invalidData = { title: 'Test Chat' } // Missing required fields

      const req = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      })
      const { POST } = await import('@/app/api/chat/route')
      const response = await POST(req)

      expect(response.status).toBe(400)
    })

    it('should reject if identifier already exists', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue({
          user: { id: 'user-id' },
        }),
      }))

      const validData = {
        workflowId: 'workflow-123',
        identifier: 'test-chat',
        title: 'Test Chat',
        customizations: {
          primaryColor: '#000000',
          welcomeMessage: 'Hello',
        },
      }

      mockLimit.mockResolvedValueOnce([{ id: 'existing-chat' }]) // Identifier exists

      const req = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify(validData),
      })
      const { POST } = await import('@/app/api/chat/route')
      const response = await POST(req)

      expect(response.status).toBe(400)
      expect(mockCreateErrorResponse).toHaveBeenCalledWith('Identifier already in use', 400)
    })

    it('should reject if workflow not found', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue({
          user: { id: 'user-id' },
        }),
      }))

      const validData = {
        workflowId: 'workflow-123',
        identifier: 'test-chat',
        title: 'Test Chat',
        customizations: {
          primaryColor: '#000000',
          welcomeMessage: 'Hello',
        },
      }

      mockLimit.mockResolvedValueOnce([]) // Identifier is available
      mockCheckWorkflowAccessForChatCreation.mockResolvedValue({ hasAccess: false })

      const req = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify(validData),
      })
      const { POST } = await import('@/app/api/chat/route')
      const response = await POST(req)

      expect(response.status).toBe(404)
      expect(mockCreateErrorResponse).toHaveBeenCalledWith(
        'Workflow not found or access denied',
        404
      )
    })

    it('should allow chat deployment when user owns workflow directly', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue({
          user: { id: 'user-id', email: 'user@example.com' },
        }),
      }))

      vi.doMock('@/lib/core/config/env', () => ({
        env: {
          NODE_ENV: 'development',
          NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
        },
        isTruthy: (value: string | boolean | number | undefined) =>
          typeof value === 'string'
            ? value.toLowerCase() === 'true' || value === '1'
            : Boolean(value),
        getEnv: (variable: string) => process.env[variable],
      }))

      const validData = {
        workflowId: 'workflow-123',
        identifier: 'test-chat',
        title: 'Test Chat',
        customizations: {
          primaryColor: '#000000',
          welcomeMessage: 'Hello',
        },
      }

      mockLimit.mockResolvedValueOnce([]) // Identifier is available
      mockCheckWorkflowAccessForChatCreation.mockResolvedValue({
        hasAccess: true,
        workflow: { userId: 'user-id', workspaceId: null, isDeployed: true },
      })
      mockReturning.mockResolvedValue([{ id: 'test-uuid' }])

      const req = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify(validData),
      })
      const { POST } = await import('@/app/api/chat/route')
      const response = await POST(req)

      expect(response.status).toBe(200)
      expect(mockCheckWorkflowAccessForChatCreation).toHaveBeenCalledWith('workflow-123', 'user-id')
    })

    it('should allow chat deployment when user has workspace admin permission', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue({
          user: { id: 'user-id', email: 'user@example.com' },
        }),
      }))

      vi.doMock('@/lib/core/config/env', () => ({
        env: {
          NODE_ENV: 'development',
          NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
        },
        isTruthy: (value: string | boolean | number | undefined) =>
          typeof value === 'string' ? value === 'true' || value === '1' : Boolean(value),
        getEnv: (variable: string) => process.env[variable],
      }))

      const validData = {
        workflowId: 'workflow-123',
        identifier: 'test-chat',
        title: 'Test Chat',
        customizations: {
          primaryColor: '#000000',
          welcomeMessage: 'Hello',
        },
      }

      mockLimit.mockResolvedValueOnce([]) // Identifier is available
      mockCheckWorkflowAccessForChatCreation.mockResolvedValue({
        hasAccess: true,
        workflow: { userId: 'other-user-id', workspaceId: 'workspace-123', isDeployed: true },
      })
      mockReturning.mockResolvedValue([{ id: 'test-uuid' }])

      const req = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify(validData),
      })
      const { POST } = await import('@/app/api/chat/route')
      const response = await POST(req)

      expect(response.status).toBe(200)
      expect(mockCheckWorkflowAccessForChatCreation).toHaveBeenCalledWith('workflow-123', 'user-id')
    })

    it('should reject when workflow is in workspace but user lacks admin permission', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue({
          user: { id: 'user-id' },
        }),
      }))

      const validData = {
        workflowId: 'workflow-123',
        identifier: 'test-chat',
        title: 'Test Chat',
        customizations: {
          primaryColor: '#000000',
          welcomeMessage: 'Hello',
        },
      }

      mockLimit.mockResolvedValueOnce([]) // Identifier is available
      mockCheckWorkflowAccessForChatCreation.mockResolvedValue({
        hasAccess: false,
      })

      const req = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify(validData),
      })
      const { POST } = await import('@/app/api/chat/route')
      const response = await POST(req)

      expect(response.status).toBe(404)
      expect(mockCreateErrorResponse).toHaveBeenCalledWith(
        'Workflow not found or access denied',
        404
      )
      expect(mockCheckWorkflowAccessForChatCreation).toHaveBeenCalledWith('workflow-123', 'user-id')
    })

    it('should handle workspace permission check errors gracefully', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue({
          user: { id: 'user-id' },
        }),
      }))

      const validData = {
        workflowId: 'workflow-123',
        identifier: 'test-chat',
        title: 'Test Chat',
        customizations: {
          primaryColor: '#000000',
          welcomeMessage: 'Hello',
        },
      }

      mockLimit.mockResolvedValueOnce([]) // Identifier is available
      mockCheckWorkflowAccessForChatCreation.mockRejectedValue(new Error('Permission check failed'))

      const req = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify(validData),
      })
      const { POST } = await import('@/app/api/chat/route')
      const response = await POST(req)

      expect(response.status).toBe(500)
      expect(mockCheckWorkflowAccessForChatCreation).toHaveBeenCalledWith('workflow-123', 'user-id')
    })

    it('should auto-deploy workflow if not already deployed', async () => {
      vi.doMock('@/lib/auth', () => ({
        getSession: vi.fn().mockResolvedValue({
          user: { id: 'user-id', email: 'user@example.com' },
        }),
      }))

      const validData = {
        workflowId: 'workflow-123',
        identifier: 'test-chat',
        title: 'Test Chat',
        customizations: {
          primaryColor: '#000000',
          welcomeMessage: 'Hello',
        },
      }

      mockLimit.mockResolvedValueOnce([]) // Identifier is available
      mockCheckWorkflowAccessForChatCreation.mockResolvedValue({
        hasAccess: true,
        workflow: { userId: 'user-id', workspaceId: null, isDeployed: false },
      })
      mockReturning.mockResolvedValue([{ id: 'test-uuid' }])

      const req = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify(validData),
      })
      const { POST } = await import('@/app/api/chat/route')
      const response = await POST(req)

      expect(response.status).toBe(200)
      expect(mockDeployWorkflow).toHaveBeenCalledWith({
        workflowId: 'workflow-123',
        deployedBy: 'user-id',
      })
    })
  })
})
```

--------------------------------------------------------------------------------

````
