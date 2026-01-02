---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 321
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 321 of 933)

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
Location: sim-main/apps/sim/app/api/v1/admin/organizations/[id]/members/[memberId]/route.ts

```typescript
/**
 * GET /api/v1/admin/organizations/[id]/members/[memberId]
 *
 * Get member details.
 *
 * Response: AdminSingleResponse<AdminMemberDetail>
 *
 * PATCH /api/v1/admin/organizations/[id]/members/[memberId]
 *
 * Update member role.
 *
 * Body:
 *   - role: string - New role ('admin' | 'member')
 *
 * Response: AdminSingleResponse<AdminMember>
 *
 * DELETE /api/v1/admin/organizations/[id]/members/[memberId]
 *
 * Remove member from organization with full billing logic.
 * Handles departed usage capture and Pro restoration like the regular flow.
 *
 * Query Parameters:
 *   - skipBillingLogic: boolean - Skip billing logic (default: false)
 *
 * Response: { success: true, memberId: string, billingActions: {...} }
 */

import { db } from '@sim/db'
import { member, organization, user, userStats } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { removeUserFromOrganization } from '@/lib/billing/organizations/membership'
import { createLogger } from '@/lib/logs/console/logger'
import { withAdminAuthParams } from '@/app/api/v1/admin/middleware'
import {
  badRequestResponse,
  internalErrorResponse,
  notFoundResponse,
  singleResponse,
} from '@/app/api/v1/admin/responses'
import type { AdminMember, AdminMemberDetail } from '@/app/api/v1/admin/types'

const logger = createLogger('AdminOrganizationMemberDetailAPI')

interface RouteParams {
  id: string
  memberId: string
}

export const GET = withAdminAuthParams<RouteParams>(async (_, context) => {
  const { id: organizationId, memberId } = await context.params

  try {
    const [orgData] = await db
      .select({ id: organization.id })
      .from(organization)
      .where(eq(organization.id, organizationId))
      .limit(1)

    if (!orgData) {
      return notFoundResponse('Organization')
    }

    const [memberData] = await db
      .select({
        id: member.id,
        userId: member.userId,
        organizationId: member.organizationId,
        role: member.role,
        createdAt: member.createdAt,
        userName: user.name,
        userEmail: user.email,
        currentPeriodCost: userStats.currentPeriodCost,
        currentUsageLimit: userStats.currentUsageLimit,
        lastActive: userStats.lastActive,
        billingBlocked: userStats.billingBlocked,
      })
      .from(member)
      .innerJoin(user, eq(member.userId, user.id))
      .leftJoin(userStats, eq(member.userId, userStats.userId))
      .where(and(eq(member.id, memberId), eq(member.organizationId, organizationId)))
      .limit(1)

    if (!memberData) {
      return notFoundResponse('Member')
    }

    const data: AdminMemberDetail = {
      id: memberData.id,
      userId: memberData.userId,
      organizationId: memberData.organizationId,
      role: memberData.role,
      createdAt: memberData.createdAt.toISOString(),
      userName: memberData.userName,
      userEmail: memberData.userEmail,
      currentPeriodCost: memberData.currentPeriodCost ?? '0',
      currentUsageLimit: memberData.currentUsageLimit,
      lastActive: memberData.lastActive?.toISOString() ?? null,
      billingBlocked: memberData.billingBlocked ?? false,
    }

    logger.info(`Admin API: Retrieved member ${memberId} from organization ${organizationId}`)

    return singleResponse(data)
  } catch (error) {
    logger.error('Admin API: Failed to get member', { error, organizationId, memberId })
    return internalErrorResponse('Failed to get member')
  }
})

export const PATCH = withAdminAuthParams<RouteParams>(async (request, context) => {
  const { id: organizationId, memberId } = await context.params

  try {
    const body = await request.json()

    if (!body.role || !['admin', 'member'].includes(body.role)) {
      return badRequestResponse('role must be "admin" or "member"')
    }

    const [orgData] = await db
      .select({ id: organization.id })
      .from(organization)
      .where(eq(organization.id, organizationId))
      .limit(1)

    if (!orgData) {
      return notFoundResponse('Organization')
    }

    const [existingMember] = await db
      .select({
        id: member.id,
        userId: member.userId,
        role: member.role,
      })
      .from(member)
      .where(and(eq(member.id, memberId), eq(member.organizationId, organizationId)))
      .limit(1)

    if (!existingMember) {
      return notFoundResponse('Member')
    }

    if (existingMember.role === 'owner') {
      return badRequestResponse('Cannot change owner role')
    }

    const [updated] = await db
      .update(member)
      .set({ role: body.role })
      .where(eq(member.id, memberId))
      .returning()

    const [userData] = await db
      .select({ name: user.name, email: user.email })
      .from(user)
      .where(eq(user.id, updated.userId))
      .limit(1)

    const data: AdminMember = {
      id: updated.id,
      userId: updated.userId,
      organizationId: updated.organizationId,
      role: updated.role,
      createdAt: updated.createdAt.toISOString(),
      userName: userData?.name ?? '',
      userEmail: userData?.email ?? '',
    }

    logger.info(`Admin API: Updated member ${memberId} role to ${body.role}`, {
      organizationId,
      previousRole: existingMember.role,
    })

    return singleResponse(data)
  } catch (error) {
    logger.error('Admin API: Failed to update member', { error, organizationId, memberId })
    return internalErrorResponse('Failed to update member')
  }
})

export const DELETE = withAdminAuthParams<RouteParams>(async (request, context) => {
  const { id: organizationId, memberId } = await context.params
  const url = new URL(request.url)
  const skipBillingLogic = url.searchParams.get('skipBillingLogic') === 'true'

  try {
    const [orgData] = await db
      .select({ id: organization.id })
      .from(organization)
      .where(eq(organization.id, organizationId))
      .limit(1)

    if (!orgData) {
      return notFoundResponse('Organization')
    }

    const [existingMember] = await db
      .select({
        id: member.id,
        userId: member.userId,
        role: member.role,
      })
      .from(member)
      .where(and(eq(member.id, memberId), eq(member.organizationId, organizationId)))
      .limit(1)

    if (!existingMember) {
      return notFoundResponse('Member')
    }

    const userId = existingMember.userId

    const result = await removeUserFromOrganization({
      userId,
      organizationId,
      memberId,
      skipBillingLogic,
    })

    if (!result.success) {
      if (result.error === 'Cannot remove organization owner') {
        return badRequestResponse(result.error)
      }
      if (result.error === 'Member not found') {
        return notFoundResponse('Member')
      }
      return internalErrorResponse(result.error || 'Failed to remove member')
    }

    logger.info(`Admin API: Removed member ${memberId} from organization ${organizationId}`, {
      userId,
      billingActions: result.billingActions,
    })

    return singleResponse({
      success: true,
      memberId,
      userId,
      billingActions: {
        usageCaptured: result.billingActions.usageCaptured,
        proRestored: result.billingActions.proRestored,
        usageRestored: result.billingActions.usageRestored,
        skipBillingLogic,
      },
    })
  } catch (error) {
    logger.error('Admin API: Failed to remove member', { error, organizationId, memberId })
    return internalErrorResponse('Failed to remove member')
  }
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/organizations/[id]/seats/route.ts

```typescript
/**
 * GET /api/v1/admin/organizations/[id]/seats
 *
 * Get organization seat analytics including member activity.
 *
 * Response: AdminSingleResponse<AdminSeatAnalytics>
 */

import { getOrganizationSeatAnalytics } from '@/lib/billing/validation/seat-management'
import { createLogger } from '@/lib/logs/console/logger'
import { withAdminAuthParams } from '@/app/api/v1/admin/middleware'
import {
  internalErrorResponse,
  notFoundResponse,
  singleResponse,
} from '@/app/api/v1/admin/responses'
import type { AdminSeatAnalytics } from '@/app/api/v1/admin/types'

const logger = createLogger('AdminOrganizationSeatsAPI')

interface RouteParams {
  id: string
}

export const GET = withAdminAuthParams<RouteParams>(async (_, context) => {
  const { id: organizationId } = await context.params

  try {
    const analytics = await getOrganizationSeatAnalytics(organizationId)

    if (!analytics) {
      return notFoundResponse('Organization or subscription')
    }

    const data: AdminSeatAnalytics = {
      organizationId: analytics.organizationId,
      organizationName: analytics.organizationName,
      currentSeats: analytics.currentSeats,
      maxSeats: analytics.maxSeats,
      availableSeats: analytics.availableSeats,
      subscriptionPlan: analytics.subscriptionPlan,
      canAddSeats: analytics.canAddSeats,
      utilizationRate: analytics.utilizationRate,
      activeMembers: analytics.activeMembers,
      inactiveMembers: analytics.inactiveMembers,
      memberActivity: analytics.memberActivity.map((m) => ({
        userId: m.userId,
        userName: m.userName,
        userEmail: m.userEmail,
        role: m.role,
        joinedAt: m.joinedAt.toISOString(),
        lastActive: m.lastActive?.toISOString() ?? null,
      })),
    }

    logger.info(`Admin API: Retrieved seat analytics for organization ${organizationId}`)

    return singleResponse(data)
  } catch (error) {
    logger.error('Admin API: Failed to get organization seats', { error, organizationId })
    return internalErrorResponse('Failed to get organization seats')
  }
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/subscriptions/route.ts

```typescript
/**
 * GET /api/v1/admin/subscriptions
 *
 * List all subscriptions with pagination.
 *
 * Query Parameters:
 *   - limit: number (default: 50, max: 250)
 *   - offset: number (default: 0)
 *   - plan: string (optional) - Filter by plan (free, pro, team, enterprise)
 *   - status: string (optional) - Filter by status (active, canceled, etc.)
 *
 * Response: AdminListResponse<AdminSubscription>
 */

import { db } from '@sim/db'
import { subscription } from '@sim/db/schema'
import { and, count, eq, type SQL } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'
import { withAdminAuth } from '@/app/api/v1/admin/middleware'
import { internalErrorResponse, listResponse } from '@/app/api/v1/admin/responses'
import {
  type AdminSubscription,
  createPaginationMeta,
  parsePaginationParams,
  toAdminSubscription,
} from '@/app/api/v1/admin/types'

const logger = createLogger('AdminSubscriptionsAPI')

export const GET = withAdminAuth(async (request) => {
  const url = new URL(request.url)
  const { limit, offset } = parsePaginationParams(url)
  const planFilter = url.searchParams.get('plan')
  const statusFilter = url.searchParams.get('status')

  try {
    const conditions: SQL<unknown>[] = []
    if (planFilter) {
      conditions.push(eq(subscription.plan, planFilter))
    }
    if (statusFilter) {
      conditions.push(eq(subscription.status, statusFilter))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const [countResult, subscriptions] = await Promise.all([
      db.select({ total: count() }).from(subscription).where(whereClause),
      db
        .select()
        .from(subscription)
        .where(whereClause)
        .orderBy(subscription.plan)
        .limit(limit)
        .offset(offset),
    ])

    const total = countResult[0].total
    const data: AdminSubscription[] = subscriptions.map(toAdminSubscription)
    const pagination = createPaginationMeta(total, limit, offset)

    logger.info(`Admin API: Listed ${data.length} subscriptions (total: ${total})`)

    return listResponse(data, pagination)
  } catch (error) {
    logger.error('Admin API: Failed to list subscriptions', { error })
    return internalErrorResponse('Failed to list subscriptions')
  }
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/subscriptions/[id]/route.ts

```typescript
/**
 * GET /api/v1/admin/subscriptions/[id]
 *
 * Get subscription details.
 *
 * Response: AdminSingleResponse<AdminSubscription>
 *
 * DELETE /api/v1/admin/subscriptions/[id]
 *
 * Cancel a subscription by triggering Stripe cancellation.
 * The Stripe webhook handles all cleanup (same as platform cancellation):
 *   - Updates subscription status to canceled
 *   - Bills final period overages
 *   - Resets usage
 *   - Restores member Pro subscriptions (for team/enterprise)
 *   - Deletes organization (for team/enterprise)
 *   - Syncs usage limits to free tier
 *
 * Query Parameters:
 *   - atPeriodEnd?: boolean - Schedule cancellation at period end instead of immediate (default: false)
 *   - reason?: string - Reason for cancellation (for audit logging)
 *
 * Response: { success: true, message: string, subscriptionId: string, atPeriodEnd: boolean }
 */

import { db } from '@sim/db'
import { subscription } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { requireStripeClient } from '@/lib/billing/stripe-client'
import { createLogger } from '@/lib/logs/console/logger'
import { withAdminAuthParams } from '@/app/api/v1/admin/middleware'
import {
  badRequestResponse,
  internalErrorResponse,
  notFoundResponse,
  singleResponse,
} from '@/app/api/v1/admin/responses'
import { toAdminSubscription } from '@/app/api/v1/admin/types'

const logger = createLogger('AdminSubscriptionDetailAPI')

interface RouteParams {
  id: string
}

export const GET = withAdminAuthParams<RouteParams>(async (_, context) => {
  const { id: subscriptionId } = await context.params

  try {
    const [subData] = await db
      .select()
      .from(subscription)
      .where(eq(subscription.id, subscriptionId))
      .limit(1)

    if (!subData) {
      return notFoundResponse('Subscription')
    }

    logger.info(`Admin API: Retrieved subscription ${subscriptionId}`)

    return singleResponse(toAdminSubscription(subData))
  } catch (error) {
    logger.error('Admin API: Failed to get subscription', { error, subscriptionId })
    return internalErrorResponse('Failed to get subscription')
  }
})

export const DELETE = withAdminAuthParams<RouteParams>(async (request, context) => {
  const { id: subscriptionId } = await context.params
  const url = new URL(request.url)
  const atPeriodEnd = url.searchParams.get('atPeriodEnd') === 'true'
  const reason = url.searchParams.get('reason') || 'Admin cancellation (no reason provided)'

  try {
    const [existing] = await db
      .select()
      .from(subscription)
      .where(eq(subscription.id, subscriptionId))
      .limit(1)

    if (!existing) {
      return notFoundResponse('Subscription')
    }

    if (existing.status === 'canceled') {
      return badRequestResponse('Subscription is already canceled')
    }

    if (!existing.stripeSubscriptionId) {
      return badRequestResponse('Subscription has no Stripe subscription ID')
    }

    const stripe = requireStripeClient()

    if (atPeriodEnd) {
      // Schedule cancellation at period end
      await stripe.subscriptions.update(existing.stripeSubscriptionId, {
        cancel_at_period_end: true,
      })

      // Update DB (webhooks don't sync cancelAtPeriodEnd)
      await db
        .update(subscription)
        .set({ cancelAtPeriodEnd: true })
        .where(eq(subscription.id, subscriptionId))

      logger.info('Admin API: Scheduled subscription cancellation at period end', {
        subscriptionId,
        stripeSubscriptionId: existing.stripeSubscriptionId,
        plan: existing.plan,
        referenceId: existing.referenceId,
        periodEnd: existing.periodEnd,
        reason,
      })

      return singleResponse({
        success: true,
        message: 'Subscription scheduled to cancel at period end.',
        subscriptionId,
        stripeSubscriptionId: existing.stripeSubscriptionId,
        atPeriodEnd: true,
        periodEnd: existing.periodEnd?.toISOString() ?? null,
      })
    }

    // Immediate cancellation
    await stripe.subscriptions.cancel(existing.stripeSubscriptionId, {
      prorate: true,
      invoice_now: true,
    })

    logger.info('Admin API: Triggered immediate subscription cancellation on Stripe', {
      subscriptionId,
      stripeSubscriptionId: existing.stripeSubscriptionId,
      plan: existing.plan,
      referenceId: existing.referenceId,
      reason,
    })

    return singleResponse({
      success: true,
      message: 'Subscription cancellation triggered. Webhook will complete cleanup.',
      subscriptionId,
      stripeSubscriptionId: existing.stripeSubscriptionId,
      atPeriodEnd: false,
    })
  } catch (error) {
    logger.error('Admin API: Failed to cancel subscription', { error, subscriptionId })
    return internalErrorResponse('Failed to cancel subscription')
  }
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/users/route.ts

```typescript
/**
 * GET /api/v1/admin/users
 *
 * List all users with pagination.
 *
 * Query Parameters:
 *   - limit: number (default: 50, max: 250)
 *   - offset: number (default: 0)
 *
 * Response: AdminListResponse<AdminUser>
 */

import { db } from '@sim/db'
import { user } from '@sim/db/schema'
import { count } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'
import { withAdminAuth } from '@/app/api/v1/admin/middleware'
import { internalErrorResponse, listResponse } from '@/app/api/v1/admin/responses'
import {
  type AdminUser,
  createPaginationMeta,
  parsePaginationParams,
  toAdminUser,
} from '@/app/api/v1/admin/types'

const logger = createLogger('AdminUsersAPI')

export const GET = withAdminAuth(async (request) => {
  const url = new URL(request.url)
  const { limit, offset } = parsePaginationParams(url)

  try {
    const [countResult, users] = await Promise.all([
      db.select({ total: count() }).from(user),
      db.select().from(user).orderBy(user.name).limit(limit).offset(offset),
    ])

    const total = countResult[0].total
    const data: AdminUser[] = users.map(toAdminUser)
    const pagination = createPaginationMeta(total, limit, offset)

    logger.info(`Admin API: Listed ${data.length} users (total: ${total})`)

    return listResponse(data, pagination)
  } catch (error) {
    logger.error('Admin API: Failed to list users', { error })
    return internalErrorResponse('Failed to list users')
  }
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/users/[id]/route.ts

```typescript
/**
 * GET /api/v1/admin/users/[id]
 *
 * Get user details.
 *
 * Response: AdminSingleResponse<AdminUser>
 */

import { db } from '@sim/db'
import { user } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'
import { withAdminAuthParams } from '@/app/api/v1/admin/middleware'
import {
  internalErrorResponse,
  notFoundResponse,
  singleResponse,
} from '@/app/api/v1/admin/responses'
import { toAdminUser } from '@/app/api/v1/admin/types'

const logger = createLogger('AdminUserDetailAPI')

interface RouteParams {
  id: string
}

export const GET = withAdminAuthParams<RouteParams>(async (request, context) => {
  const { id: userId } = await context.params

  try {
    const [userData] = await db.select().from(user).where(eq(user.id, userId)).limit(1)

    if (!userData) {
      return notFoundResponse('User')
    }

    const data = toAdminUser(userData)

    logger.info(`Admin API: Retrieved user ${userId}`)

    return singleResponse(data)
  } catch (error) {
    logger.error('Admin API: Failed to get user', { error, userId })
    return internalErrorResponse('Failed to get user')
  }
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/users/[id]/billing/route.ts

```typescript
/**
 * GET /api/v1/admin/users/[id]/billing
 *
 * Get user billing information including usage stats, subscriptions, and org memberships.
 *
 * Response: AdminSingleResponse<AdminUserBillingWithSubscription>
 *
 * PATCH /api/v1/admin/users/[id]/billing
 *
 * Update user billing settings with proper validation.
 *
 * Body:
 *   - currentUsageLimit?: number | null - Usage limit (null to use default)
 *   - billingBlocked?: boolean - Block/unblock billing
 *   - currentPeriodCost?: number - Reset/adjust current period cost (use with caution)
 *   - reason?: string - Reason for the change (for audit logging)
 *
 * Response: AdminSingleResponse<{ success: true, updated: string[], warnings: string[] }>
 */

import { db } from '@sim/db'
import { member, organization, subscription, user, userStats } from '@sim/db/schema'
import { eq, or } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { getHighestPrioritySubscription } from '@/lib/billing/core/subscription'
import { createLogger } from '@/lib/logs/console/logger'
import { withAdminAuthParams } from '@/app/api/v1/admin/middleware'
import {
  badRequestResponse,
  internalErrorResponse,
  notFoundResponse,
  singleResponse,
} from '@/app/api/v1/admin/responses'
import {
  type AdminUserBillingWithSubscription,
  toAdminSubscription,
} from '@/app/api/v1/admin/types'

const logger = createLogger('AdminUserBillingAPI')

interface RouteParams {
  id: string
}

export const GET = withAdminAuthParams<RouteParams>(async (_, context) => {
  const { id: userId } = await context.params

  try {
    const [userData] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        stripeCustomerId: user.stripeCustomerId,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1)

    if (!userData) {
      return notFoundResponse('User')
    }

    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1)

    const memberOrgs = await db
      .select({
        organizationId: member.organizationId,
        organizationName: organization.name,
        role: member.role,
      })
      .from(member)
      .innerJoin(organization, eq(member.organizationId, organization.id))
      .where(eq(member.userId, userId))

    const orgIds = memberOrgs.map((m) => m.organizationId)

    const subscriptions = await db
      .select()
      .from(subscription)
      .where(
        orgIds.length > 0
          ? or(
              eq(subscription.referenceId, userId),
              ...orgIds.map((orgId) => eq(subscription.referenceId, orgId))
            )
          : eq(subscription.referenceId, userId)
      )

    const data: AdminUserBillingWithSubscription = {
      userId: userData.id,
      userName: userData.name,
      userEmail: userData.email,
      stripeCustomerId: userData.stripeCustomerId,
      totalManualExecutions: stats?.totalManualExecutions ?? 0,
      totalApiCalls: stats?.totalApiCalls ?? 0,
      totalWebhookTriggers: stats?.totalWebhookTriggers ?? 0,
      totalScheduledExecutions: stats?.totalScheduledExecutions ?? 0,
      totalChatExecutions: stats?.totalChatExecutions ?? 0,
      totalTokensUsed: stats?.totalTokensUsed ?? 0,
      totalCost: stats?.totalCost ?? '0',
      currentUsageLimit: stats?.currentUsageLimit ?? null,
      currentPeriodCost: stats?.currentPeriodCost ?? '0',
      lastPeriodCost: stats?.lastPeriodCost ?? null,
      billedOverageThisPeriod: stats?.billedOverageThisPeriod ?? '0',
      storageUsedBytes: stats?.storageUsedBytes ?? 0,
      lastActive: stats?.lastActive?.toISOString() ?? null,
      billingBlocked: stats?.billingBlocked ?? false,
      totalCopilotCost: stats?.totalCopilotCost ?? '0',
      currentPeriodCopilotCost: stats?.currentPeriodCopilotCost ?? '0',
      lastPeriodCopilotCost: stats?.lastPeriodCopilotCost ?? null,
      totalCopilotTokens: stats?.totalCopilotTokens ?? 0,
      totalCopilotCalls: stats?.totalCopilotCalls ?? 0,
      subscriptions: subscriptions.map(toAdminSubscription),
      organizationMemberships: memberOrgs.map((m) => ({
        organizationId: m.organizationId,
        organizationName: m.organizationName,
        role: m.role,
      })),
    }

    logger.info(`Admin API: Retrieved billing for user ${userId}`)

    return singleResponse(data)
  } catch (error) {
    logger.error('Admin API: Failed to get user billing', { error, userId })
    return internalErrorResponse('Failed to get user billing')
  }
})

export const PATCH = withAdminAuthParams<RouteParams>(async (request, context) => {
  const { id: userId } = await context.params

  try {
    const body = await request.json()
    const reason = body.reason || 'Admin update (no reason provided)'

    const [userData] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1)

    if (!userData) {
      return notFoundResponse('User')
    }

    const [existingStats] = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1)

    const userSubscription = await getHighestPrioritySubscription(userId)
    const isTeamOrEnterpriseMember =
      userSubscription && ['team', 'enterprise'].includes(userSubscription.plan)

    const [orgMembership] = await db
      .select({ organizationId: member.organizationId })
      .from(member)
      .where(eq(member.userId, userId))
      .limit(1)

    const updateData: Record<string, unknown> = {}
    const updated: string[] = []
    const warnings: string[] = []

    if (body.currentUsageLimit !== undefined) {
      if (isTeamOrEnterpriseMember && orgMembership) {
        warnings.push(
          'User is a team/enterprise member. Individual limits may be ignored in favor of organization limits.'
        )
      }

      if (body.currentUsageLimit === null) {
        updateData.currentUsageLimit = null
      } else if (typeof body.currentUsageLimit === 'number' && body.currentUsageLimit >= 0) {
        const currentCost = Number.parseFloat(existingStats?.currentPeriodCost || '0')
        if (body.currentUsageLimit < currentCost) {
          warnings.push(
            `New limit ($${body.currentUsageLimit.toFixed(2)}) is below current usage ($${currentCost.toFixed(2)}). User may be immediately blocked.`
          )
        }
        updateData.currentUsageLimit = body.currentUsageLimit.toFixed(2)
      } else {
        return badRequestResponse('currentUsageLimit must be a non-negative number or null')
      }
      updateData.usageLimitUpdatedAt = new Date()
      updated.push('currentUsageLimit')
    }

    if (body.billingBlocked !== undefined) {
      if (typeof body.billingBlocked !== 'boolean') {
        return badRequestResponse('billingBlocked must be a boolean')
      }

      if (body.billingBlocked === false && existingStats?.billingBlocked === true) {
        warnings.push(
          'Unblocking user. Ensure payment issues are resolved to prevent re-blocking on next invoice.'
        )
      }

      updateData.billingBlocked = body.billingBlocked
      updated.push('billingBlocked')
    }

    if (body.currentPeriodCost !== undefined) {
      if (typeof body.currentPeriodCost !== 'number' || body.currentPeriodCost < 0) {
        return badRequestResponse('currentPeriodCost must be a non-negative number')
      }

      const previousCost = existingStats?.currentPeriodCost || '0'
      warnings.push(
        `Manually adjusting currentPeriodCost from $${previousCost} to $${body.currentPeriodCost.toFixed(2)}. This may affect billing accuracy.`
      )

      updateData.currentPeriodCost = body.currentPeriodCost.toFixed(2)
      updated.push('currentPeriodCost')
    }

    if (updated.length === 0) {
      return badRequestResponse('No valid fields to update')
    }

    if (existingStats) {
      await db.update(userStats).set(updateData).where(eq(userStats.userId, userId))
    } else {
      await db.insert(userStats).values({
        id: nanoid(),
        userId,
        ...updateData,
      })
    }

    logger.info(`Admin API: Updated billing for user ${userId}`, {
      updated,
      warnings,
      reason,
      previousValues: existingStats
        ? {
            currentUsageLimit: existingStats.currentUsageLimit,
            billingBlocked: existingStats.billingBlocked,
            currentPeriodCost: existingStats.currentPeriodCost,
          }
        : null,
      newValues: updateData,
      isTeamMember: !!orgMembership,
    })

    return singleResponse({
      success: true,
      updated,
      warnings,
      reason,
    })
  } catch (error) {
    logger.error('Admin API: Failed to update user billing', { error, userId })
    return internalErrorResponse('Failed to update user billing')
  }
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/workflows/route.ts

```typescript
/**
 * GET /api/v1/admin/workflows
 *
 * List all workflows across all workspaces with pagination.
 *
 * Query Parameters:
 *   - limit: number (default: 50, max: 250)
 *   - offset: number (default: 0)
 *
 * Response: AdminListResponse<AdminWorkflow>
 */

import { db } from '@sim/db'
import { workflow } from '@sim/db/schema'
import { count } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'
import { withAdminAuth } from '@/app/api/v1/admin/middleware'
import { internalErrorResponse, listResponse } from '@/app/api/v1/admin/responses'
import {
  type AdminWorkflow,
  createPaginationMeta,
  parsePaginationParams,
  toAdminWorkflow,
} from '@/app/api/v1/admin/types'

const logger = createLogger('AdminWorkflowsAPI')

export const GET = withAdminAuth(async (request) => {
  const url = new URL(request.url)
  const { limit, offset } = parsePaginationParams(url)

  try {
    const [countResult, workflows] = await Promise.all([
      db.select({ total: count() }).from(workflow),
      db.select().from(workflow).orderBy(workflow.name).limit(limit).offset(offset),
    ])

    const total = countResult[0].total
    const data: AdminWorkflow[] = workflows.map(toAdminWorkflow)
    const pagination = createPaginationMeta(total, limit, offset)

    logger.info(`Admin API: Listed ${data.length} workflows (total: ${total})`)

    return listResponse(data, pagination)
  } catch (error) {
    logger.error('Admin API: Failed to list workflows', { error })
    return internalErrorResponse('Failed to list workflows')
  }
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/workflows/import/route.ts
Signals: Next.js

```typescript
/**
 * POST /api/v1/admin/workflows/import
 *
 * Import a single workflow into a workspace.
 *
 * Request Body:
 *   {
 *     workspaceId: string,           // Required: target workspace
 *     folderId?: string,             // Optional: target folder
 *     name?: string,                 // Optional: override workflow name
 *     workflow: object | string      // The workflow JSON (from export or raw state)
 *   }
 *
 * Response: { workflowId: string, name: string, success: true }
 */

import { db } from '@sim/db'
import { workflow, workspace } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { createLogger } from '@/lib/logs/console/logger'
import { saveWorkflowToNormalizedTables } from '@/lib/workflows/persistence/utils'
import { withAdminAuth } from '@/app/api/v1/admin/middleware'
import {
  badRequestResponse,
  internalErrorResponse,
  notFoundResponse,
} from '@/app/api/v1/admin/responses'
import {
  extractWorkflowMetadata,
  type WorkflowImportRequest,
  type WorkflowVariable,
} from '@/app/api/v1/admin/types'
import { parseWorkflowJson } from '@/stores/workflows/json/importer'

const logger = createLogger('AdminWorkflowImportAPI')

interface ImportSuccessResponse {
  workflowId: string
  name: string
  success: true
}

export const POST = withAdminAuth(async (request) => {
  try {
    const body = (await request.json()) as WorkflowImportRequest

    if (!body.workspaceId) {
      return badRequestResponse('workspaceId is required')
    }

    if (!body.workflow) {
      return badRequestResponse('workflow is required')
    }

    const { workspaceId, folderId, name: overrideName } = body

    const [workspaceData] = await db
      .select({ id: workspace.id, ownerId: workspace.ownerId })
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .limit(1)

    if (!workspaceData) {
      return notFoundResponse('Workspace')
    }

    const workflowContent =
      typeof body.workflow === 'string' ? body.workflow : JSON.stringify(body.workflow)

    const { data: workflowData, errors } = parseWorkflowJson(workflowContent)

    if (!workflowData || errors.length > 0) {
      return badRequestResponse(`Invalid workflow: ${errors.join(', ')}`)
    }

    const parsedWorkflow =
      typeof body.workflow === 'string'
        ? (() => {
            try {
              return JSON.parse(body.workflow)
            } catch {
              return null
            }
          })()
        : body.workflow

    const {
      name: workflowName,
      color: workflowColor,
      description: workflowDescription,
    } = extractWorkflowMetadata(parsedWorkflow, overrideName)

    const workflowId = crypto.randomUUID()
    const now = new Date()

    await db.insert(workflow).values({
      id: workflowId,
      userId: workspaceData.ownerId,
      workspaceId,
      folderId: folderId || null,
      name: workflowName,
      description: workflowDescription,
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
      return internalErrorResponse(`Failed to save workflow state: ${saveResult.error}`)
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

    logger.info(
      `Admin API: Imported workflow ${workflowId} (${workflowName}) into workspace ${workspaceId}`
    )

    const response: ImportSuccessResponse = {
      workflowId,
      name: workflowName,
      success: true,
    }

    return NextResponse.json(response)
  } catch (error) {
    logger.error('Admin API: Failed to import workflow', { error })
    return internalErrorResponse('Failed to import workflow')
  }
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/workflows/[id]/route.ts
Signals: Next.js

```typescript
/**
 * GET /api/v1/admin/workflows/[id]
 *
 * Get workflow details including block and edge counts.
 *
 * Response: AdminSingleResponse<AdminWorkflowDetail>
 *
 * DELETE /api/v1/admin/workflows/[id]
 *
 * Delete a workflow and all its associated data.
 *
 * Response: { success: true, workflowId: string }
 */

import { db } from '@sim/db'
import { workflow, workflowBlocks, workflowEdges, workflowSchedule } from '@sim/db/schema'
import { count, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { createLogger } from '@/lib/logs/console/logger'
import { withAdminAuthParams } from '@/app/api/v1/admin/middleware'
import {
  internalErrorResponse,
  notFoundResponse,
  singleResponse,
} from '@/app/api/v1/admin/responses'
import { type AdminWorkflowDetail, toAdminWorkflow } from '@/app/api/v1/admin/types'

const logger = createLogger('AdminWorkflowDetailAPI')

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

    const [blockCountResult, edgeCountResult] = await Promise.all([
      db
        .select({ count: count() })
        .from(workflowBlocks)
        .where(eq(workflowBlocks.workflowId, workflowId)),
      db
        .select({ count: count() })
        .from(workflowEdges)
        .where(eq(workflowEdges.workflowId, workflowId)),
    ])

    const data: AdminWorkflowDetail = {
      ...toAdminWorkflow(workflowData),
      blockCount: blockCountResult[0].count,
      edgeCount: edgeCountResult[0].count,
    }

    logger.info(`Admin API: Retrieved workflow ${workflowId}`)

    return singleResponse(data)
  } catch (error) {
    logger.error('Admin API: Failed to get workflow', { error, workflowId })
    return internalErrorResponse('Failed to get workflow')
  }
})

export const DELETE = withAdminAuthParams<RouteParams>(async (request, context) => {
  const { id: workflowId } = await context.params

  try {
    const [workflowData] = await db
      .select({ id: workflow.id, name: workflow.name })
      .from(workflow)
      .where(eq(workflow.id, workflowId))
      .limit(1)

    if (!workflowData) {
      return notFoundResponse('Workflow')
    }

    await db.transaction(async (tx) => {
      await Promise.all([
        tx.delete(workflowBlocks).where(eq(workflowBlocks.workflowId, workflowId)),
        tx.delete(workflowEdges).where(eq(workflowEdges.workflowId, workflowId)),
        tx.delete(workflowSchedule).where(eq(workflowSchedule.workflowId, workflowId)),
      ])

      await tx.delete(workflow).where(eq(workflow.id, workflowId))
    })

    logger.info(`Admin API: Deleted workflow ${workflowId} (${workflowData.name})`)

    return NextResponse.json({ success: true, workflowId })
  } catch (error) {
    logger.error('Admin API: Failed to delete workflow', { error, workflowId })
    return internalErrorResponse('Failed to delete workflow')
  }
})
```

--------------------------------------------------------------------------------

````
