---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 540
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 540 of 933)

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

---[FILE: subscription.ts]---
Location: sim-main/apps/sim/lib/billing/core/subscription.ts

```typescript
import { db } from '@sim/db'
import { member, subscription, user, userStats } from '@sim/db/schema'
import { and, eq, inArray } from 'drizzle-orm'
import {
  checkEnterprisePlan,
  checkProPlan,
  checkTeamPlan,
  getFreeTierLimit,
  getPerUserMinimumLimit,
} from '@/lib/billing/subscriptions/utils'
import type { UserSubscriptionState } from '@/lib/billing/types'
import { isProd } from '@/lib/core/config/feature-flags'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('SubscriptionCore')

/**
 * Core subscription management - single source of truth
 * Consolidates logic from both lib/subscription.ts and lib/subscription/subscription.ts
 */

/**
 * Get the highest priority active subscription for a user
 * Priority: Enterprise > Team > Pro > Free
 */
export async function getHighestPrioritySubscription(userId: string) {
  try {
    // Get direct subscriptions
    const personalSubs = await db
      .select()
      .from(subscription)
      .where(and(eq(subscription.referenceId, userId), eq(subscription.status, 'active')))

    // Get organization memberships
    const memberships = await db
      .select({ organizationId: member.organizationId })
      .from(member)
      .where(eq(member.userId, userId))

    const orgIds = memberships.map((m: { organizationId: string }) => m.organizationId)

    // Get organization subscriptions
    let orgSubs: any[] = []
    if (orgIds.length > 0) {
      orgSubs = await db
        .select()
        .from(subscription)
        .where(and(inArray(subscription.referenceId, orgIds), eq(subscription.status, 'active')))
    }

    const allSubs = [...personalSubs, ...orgSubs]

    if (allSubs.length === 0) return null

    // Return highest priority subscription
    const enterpriseSub = allSubs.find((s) => checkEnterprisePlan(s))
    if (enterpriseSub) return enterpriseSub

    const teamSub = allSubs.find((s) => checkTeamPlan(s))
    if (teamSub) return teamSub

    const proSub = allSubs.find((s) => checkProPlan(s))
    if (proSub) return proSub

    return null
  } catch (error) {
    logger.error('Error getting highest priority subscription', { error, userId })
    return null
  }
}

/**
 * Check if user is on Pro plan (direct or via organization)
 */
export async function isProPlan(userId: string): Promise<boolean> {
  try {
    if (!isProd) {
      return true
    }

    const subscription = await getHighestPrioritySubscription(userId)
    const isPro =
      subscription &&
      (checkProPlan(subscription) ||
        checkTeamPlan(subscription) ||
        checkEnterprisePlan(subscription))

    if (isPro) {
      logger.info('User has pro-level plan', { userId, plan: subscription.plan })
    }

    return !!isPro
  } catch (error) {
    logger.error('Error checking pro plan status', { error, userId })
    return false
  }
}

/**
 * Check if user is on Team plan (direct or via organization)
 */
export async function isTeamPlan(userId: string): Promise<boolean> {
  try {
    if (!isProd) {
      return true
    }

    const subscription = await getHighestPrioritySubscription(userId)
    const isTeam =
      subscription && (checkTeamPlan(subscription) || checkEnterprisePlan(subscription))

    if (isTeam) {
      logger.info('User has team-level plan', { userId, plan: subscription.plan })
    }

    return !!isTeam
  } catch (error) {
    logger.error('Error checking team plan status', { error, userId })
    return false
  }
}

/**
 * Check if user is on Enterprise plan (direct or via organization)
 */
export async function isEnterprisePlan(userId: string): Promise<boolean> {
  try {
    if (!isProd) {
      return true
    }

    const subscription = await getHighestPrioritySubscription(userId)
    const isEnterprise = subscription && checkEnterprisePlan(subscription)

    if (isEnterprise) {
      logger.info('User has enterprise plan', { userId, plan: subscription.plan })
    }

    return !!isEnterprise
  } catch (error) {
    logger.error('Error checking enterprise plan status', { error, userId })
    return false
  }
}

/**
 * Check if user has exceeded their cost limit based on current period usage
 */
export async function hasExceededCostLimit(userId: string): Promise<boolean> {
  try {
    if (!isProd) {
      return false
    }

    const subscription = await getHighestPrioritySubscription(userId)

    let limit = getFreeTierLimit() // Default free tier limit

    if (subscription) {
      // Team/Enterprise: Use organization limit
      if (subscription.plan === 'team' || subscription.plan === 'enterprise') {
        const { getUserUsageLimit } = await import('@/lib/billing/core/usage')
        limit = await getUserUsageLimit(userId)
        logger.info('Using organization limit', {
          userId,
          plan: subscription.plan,
          limit,
        })
      } else {
        // Pro/Free: Use individual limit
        limit = getPerUserMinimumLimit(subscription)
        logger.info('Using subscription-based limit', {
          userId,
          plan: subscription.plan,
          limit,
        })
      }
    } else {
      logger.info('Using free tier limit', { userId, limit })
    }

    // Get user stats to check current period usage
    const statsRecords = await db.select().from(userStats).where(eq(userStats.userId, userId))

    if (statsRecords.length === 0) {
      return false
    }

    // Use current period cost instead of total cost for accurate billing period tracking
    const currentCost = Number.parseFloat(
      statsRecords[0].currentPeriodCost?.toString() || statsRecords[0].totalCost.toString()
    )

    logger.info('Checking cost limit', { userId, currentCost, limit })

    return currentCost >= limit
  } catch (error) {
    logger.error('Error checking cost limit', { error, userId })
    return false // Be conservative in case of error
  }
}

/**
 * Check if sharing features are enabled for user
 */
// Removed unused feature flag helpers: isSharingEnabled, isMultiplayerEnabled, isWorkspaceCollaborationEnabled

/**
 * Get comprehensive subscription state for a user
 * Single function to get all subscription information
 */
export async function getUserSubscriptionState(userId: string): Promise<UserSubscriptionState> {
  try {
    // Get subscription and user stats in parallel to minimize DB calls
    const [subscription, statsRecords] = await Promise.all([
      getHighestPrioritySubscription(userId),
      db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1),
    ])

    // Determine plan types based on subscription (avoid redundant DB calls)
    const isPro =
      !isProd ||
      (subscription &&
        (checkProPlan(subscription) ||
          checkTeamPlan(subscription) ||
          checkEnterprisePlan(subscription)))
    const isTeam =
      !isProd ||
      (subscription && (checkTeamPlan(subscription) || checkEnterprisePlan(subscription)))
    const isEnterprise = !isProd || (subscription && checkEnterprisePlan(subscription))
    const isFree = !isPro && !isTeam && !isEnterprise

    // Determine plan name
    let planName = 'free'
    if (isEnterprise) planName = 'enterprise'
    else if (isTeam) planName = 'team'
    else if (isPro) planName = 'pro'

    // Check cost limit using already-fetched user stats
    let hasExceededLimit = false
    if (isProd && statsRecords.length > 0) {
      let limit = getFreeTierLimit() // Default free tier limit
      if (subscription) {
        // Team/Enterprise: Use organization limit
        if (subscription.plan === 'team' || subscription.plan === 'enterprise') {
          const { getUserUsageLimit } = await import('@/lib/billing/core/usage')
          limit = await getUserUsageLimit(userId)
        } else {
          // Pro/Free: Use individual limit
          limit = getPerUserMinimumLimit(subscription)
        }
      }

      const currentCost = Number.parseFloat(
        statsRecords[0].currentPeriodCost?.toString() || statsRecords[0].totalCost.toString()
      )
      hasExceededLimit = currentCost >= limit
    }

    return {
      isPro,
      isTeam,
      isEnterprise,
      isFree,
      highestPrioritySubscription: subscription,
      hasExceededLimit,
      planName,
    }
  } catch (error) {
    logger.error('Error getting user subscription state', { error, userId })

    // Return safe defaults in case of error
    return {
      isPro: false,
      isTeam: false,
      isEnterprise: false,
      isFree: true,
      highestPrioritySubscription: null,
      hasExceededLimit: false,
      planName: 'free',
    }
  }
}

/**
 * Send welcome email for Pro and Team plan subscriptions
 */
export async function sendPlanWelcomeEmail(subscription: any): Promise<void> {
  try {
    const subPlan = subscription.plan
    if (subPlan === 'pro' || subPlan === 'team') {
      const userId = subscription.referenceId
      const users = await db
        .select({ email: user.email, name: user.name })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1)

      if (users.length > 0 && users[0].email) {
        const { getEmailSubject, renderPlanWelcomeEmail } = await import(
          '@/components/emails/render-email'
        )
        const { sendEmail } = await import('@/lib/messaging/email/mailer')

        const baseUrl = getBaseUrl()
        const html = await renderPlanWelcomeEmail({
          planName: subPlan === 'pro' ? 'Pro' : 'Team',
          userName: users[0].name || undefined,
          loginLink: `${baseUrl}/login`,
        })

        await sendEmail({
          to: users[0].email,
          subject: getEmailSubject(subPlan === 'pro' ? 'plan-welcome-pro' : 'plan-welcome-team'),
          html,
          emailType: 'updates',
        })

        logger.info('Plan welcome email sent successfully', {
          userId,
          email: users[0].email,
          plan: subPlan,
        })
      }
    }
  } catch (error) {
    logger.error('Failed to send plan welcome email', {
      error,
      subscriptionId: subscription.id,
      plan: subscription.plan,
    })
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: usage.ts]---
Location: sim-main/apps/sim/lib/billing/core/usage.ts

```typescript
import { db } from '@sim/db'
import { member, organization, settings, user, userStats } from '@sim/db/schema'
import { eq, inArray } from 'drizzle-orm'
import {
  getEmailSubject,
  renderFreeTierUpgradeEmail,
  renderUsageThresholdEmail,
} from '@/components/emails/render-email'
import { getHighestPrioritySubscription } from '@/lib/billing/core/subscription'
import {
  canEditUsageLimit,
  getFreeTierLimit,
  getPerUserMinimumLimit,
  getPlanPricing,
} from '@/lib/billing/subscriptions/utils'
import type { BillingData, UsageData, UsageLimitInfo } from '@/lib/billing/types'
import { isBillingEnabled } from '@/lib/core/config/feature-flags'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import { sendEmail } from '@/lib/messaging/email/mailer'
import { getEmailPreferences } from '@/lib/messaging/email/unsubscribe'

const logger = createLogger('UsageManagement')

export interface OrgUsageLimitResult {
  limit: number
  minimum: number
}

/**
 * Calculates the effective usage limit for a team or enterprise organization.
 * - Enterprise: Uses orgUsageLimit directly (fixed pricing)
 * - Team: Uses orgUsageLimit but never below seats × basePrice
 */
export async function getOrgUsageLimit(
  organizationId: string,
  plan: string,
  seats: number | null
): Promise<OrgUsageLimitResult> {
  const orgData = await db
    .select({ orgUsageLimit: organization.orgUsageLimit })
    .from(organization)
    .where(eq(organization.id, organizationId))
    .limit(1)

  const configured =
    orgData.length > 0 && orgData[0].orgUsageLimit
      ? Number.parseFloat(orgData[0].orgUsageLimit)
      : null

  if (plan === 'enterprise') {
    // Enterprise: Use configured limit directly (no per-seat minimum)
    if (configured !== null) {
      return { limit: configured, minimum: configured }
    }
    logger.warn('Enterprise org missing usage limit', { orgId: organizationId })
    return { limit: 0, minimum: 0 }
  }

  const { basePrice } = getPlanPricing(plan)
  const minimum = (seats ?? 0) * basePrice

  if (configured !== null) {
    return { limit: Math.max(configured, minimum), minimum }
  }

  logger.warn('Team org missing usage limit, using seats × basePrice fallback', {
    orgId: organizationId,
    seats,
    minimum,
  })
  return { limit: minimum, minimum }
}

/**
 * Handle new user setup when they join the platform
 * Creates userStats record with default free credits
 */
export async function handleNewUser(userId: string): Promise<void> {
  try {
    await db.insert(userStats).values({
      id: crypto.randomUUID(),
      userId: userId,
      currentUsageLimit: getFreeTierLimit().toString(),
      usageLimitUpdatedAt: new Date(),
    })

    logger.info('User stats record created for new user', { userId })
  } catch (error) {
    logger.error('Failed to create user stats record for new user', {
      userId,
      error,
    })
    throw error
  }
}

/**
 * Get comprehensive usage data for a user
 */
export async function getUserUsageData(userId: string): Promise<UsageData> {
  try {
    const [userStatsData, subscription] = await Promise.all([
      db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1),
      getHighestPrioritySubscription(userId),
    ])

    if (userStatsData.length === 0) {
      logger.error('User stats not found for userId', { userId })
      throw new Error(`User stats not found for userId: ${userId}`)
    }

    const stats = userStatsData[0]
    let currentUsage = Number.parseFloat(stats.currentPeriodCost?.toString() ?? '0')

    // For Pro users, include any snapshotted usage (from when they joined a team)
    // This ensures they see their total Pro usage in the UI
    if (subscription && subscription.plan === 'pro' && subscription.referenceId === userId) {
      const snapshotUsage = Number.parseFloat(stats.proPeriodCostSnapshot?.toString() ?? '0')
      if (snapshotUsage > 0) {
        currentUsage += snapshotUsage
        logger.info('Including Pro snapshot in usage display', {
          userId,
          currentPeriodCost: stats.currentPeriodCost,
          proPeriodCostSnapshot: snapshotUsage,
          totalUsage: currentUsage,
        })
      }
    }

    // Determine usage limit based on plan type
    let limit: number

    if (!subscription || subscription.plan === 'free' || subscription.plan === 'pro') {
      // Free/Pro: Use individual user limit from userStats
      limit = stats.currentUsageLimit
        ? Number.parseFloat(stats.currentUsageLimit)
        : getFreeTierLimit()
    } else {
      // Team/Enterprise: Use organization limit
      const orgLimit = await getOrgUsageLimit(
        subscription.referenceId,
        subscription.plan,
        subscription.seats
      )
      limit = orgLimit.limit
    }

    const percentUsed = limit > 0 ? Math.min((currentUsage / limit) * 100, 100) : 0
    const isWarning = percentUsed >= 80
    const isExceeded = currentUsage >= limit

    // Derive billing period dates from subscription (source of truth).
    // For free users or missing dates, expose nulls.
    const billingPeriodStart = subscription?.periodStart ?? null
    const billingPeriodEnd = subscription?.periodEnd ?? null

    return {
      currentUsage,
      limit,
      percentUsed,
      isWarning,
      isExceeded,
      billingPeriodStart,
      billingPeriodEnd,
      lastPeriodCost: Number.parseFloat(stats.lastPeriodCost?.toString() || '0'),
    }
  } catch (error) {
    logger.error('Failed to get user usage data', { userId, error })
    throw error
  }
}

/**
 * Get usage limit information for a user
 */
export async function getUserUsageLimitInfo(userId: string): Promise<UsageLimitInfo> {
  try {
    const [subscription, userStatsRecord] = await Promise.all([
      getHighestPrioritySubscription(userId),
      db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1),
    ])

    if (userStatsRecord.length === 0) {
      throw new Error(`User stats not found for userId: ${userId}`)
    }

    const stats = userStatsRecord[0]

    // Determine limits based on plan type
    let currentLimit: number
    let minimumLimit: number
    let canEdit: boolean

    if (!subscription || subscription.plan === 'free' || subscription.plan === 'pro') {
      // Free/Pro: Use individual limits
      currentLimit = stats.currentUsageLimit
        ? Number.parseFloat(stats.currentUsageLimit)
        : getFreeTierLimit()
      minimumLimit = getPerUserMinimumLimit(subscription)
      canEdit = canEditUsageLimit(subscription)
    } else {
      // Team/Enterprise: Use organization limits
      const orgLimit = await getOrgUsageLimit(
        subscription.referenceId,
        subscription.plan,
        subscription.seats
      )
      currentLimit = orgLimit.limit
      minimumLimit = orgLimit.minimum
      canEdit = false
    }

    return {
      currentLimit,
      canEdit,
      minimumLimit,
      plan: subscription?.plan || 'free',
      updatedAt: stats.usageLimitUpdatedAt,
    }
  } catch (error) {
    logger.error('Failed to get usage limit info', { userId, error })
    throw error
  }
}

/**
 * Initialize usage limits for a new user
 */
export async function initializeUserUsageLimit(userId: string): Promise<void> {
  // Check if user already has usage stats
  const existingStats = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, userId))
    .limit(1)

  if (existingStats.length > 0) {
    return // User already has usage stats
  }

  // Check user's subscription to determine initial limit
  const subscription = await getHighestPrioritySubscription(userId)
  const isTeamOrEnterprise =
    subscription && (subscription.plan === 'team' || subscription.plan === 'enterprise')

  // Create initial usage stats
  await db.insert(userStats).values({
    id: crypto.randomUUID(),
    userId,
    // Team/enterprise: null (use org limit), Free/Pro: individual limit
    currentUsageLimit: isTeamOrEnterprise ? null : getFreeTierLimit().toString(),
    usageLimitUpdatedAt: new Date(),
  })

  logger.info('Initialized user stats', {
    userId,
    plan: subscription?.plan || 'free',
    hasIndividualLimit: !isTeamOrEnterprise,
  })
}

/**
 * Update a user's custom usage limit
 */
export async function updateUserUsageLimit(
  userId: string,
  newLimit: number,
  setBy?: string // For team admin tracking
): Promise<{ success: boolean; error?: string }> {
  try {
    const subscription = await getHighestPrioritySubscription(userId)

    // Team/enterprise users don't have individual limits
    if (subscription && (subscription.plan === 'team' || subscription.plan === 'enterprise')) {
      return {
        success: false,
        error: 'Team and enterprise members use organization limits',
      }
    }

    // Only pro users can edit limits (free users cannot)
    if (!subscription || subscription.plan === 'free') {
      return { success: false, error: 'Free plan users cannot edit usage limits' }
    }

    const minimumLimit = getPerUserMinimumLimit(subscription)

    logger.info('Applying plan-based validation', {
      userId,
      newLimit,
      minimumLimit,
      plan: subscription?.plan,
    })

    // Validate new limit is not below minimum
    if (newLimit < minimumLimit) {
      return {
        success: false,
        error: `Usage limit cannot be below plan minimum of $${minimumLimit}`,
      }
    }

    await db
      .update(userStats)
      .set({
        currentUsageLimit: newLimit.toString(),
        usageLimitUpdatedAt: new Date(),
      })
      .where(eq(userStats.userId, userId))

    logger.info('Updated user usage limit', {
      userId,
      newLimit,
      setBy: setBy || userId,
      planMinimum: minimumLimit,
      plan: subscription?.plan,
    })

    return { success: true }
  } catch (error) {
    logger.error('Failed to update usage limit', { userId, newLimit, error })
    return { success: false, error: 'Failed to update usage limit' }
  }
}

/**
 * Get usage limit for a user (used by checkUsageStatus for server-side checks)
 * Free/Pro: Individual user limit from userStats
 * Team/Enterprise: Organization limit
 */
export async function getUserUsageLimit(userId: string): Promise<number> {
  const subscription = await getHighestPrioritySubscription(userId)

  if (!subscription || subscription.plan === 'free' || subscription.plan === 'pro') {
    // Free/Pro: Use individual limit from userStats
    const userStatsQuery = await db
      .select({ currentUsageLimit: userStats.currentUsageLimit })
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1)

    if (userStatsQuery.length === 0) {
      throw new Error(
        `No user stats record found for userId: ${userId}. User must be properly initialized before execution.`
      )
    }

    // Individual limits should never be null for free/pro users
    if (!userStatsQuery[0].currentUsageLimit) {
      throw new Error(
        `Invalid null usage limit for ${subscription?.plan || 'free'} user: ${userId}. User stats must be properly initialized.`
      )
    }

    return Number.parseFloat(userStatsQuery[0].currentUsageLimit)
  }
  // Team/Enterprise: Verify org exists then use organization limit
  const orgExists = await db
    .select({ id: organization.id })
    .from(organization)
    .where(eq(organization.id, subscription.referenceId))
    .limit(1)

  if (orgExists.length === 0) {
    throw new Error(`Organization not found: ${subscription.referenceId} for user: ${userId}`)
  }

  const orgLimit = await getOrgUsageLimit(
    subscription.referenceId,
    subscription.plan,
    subscription.seats
  )
  return orgLimit.limit
}

/**
 * Check usage status with warning thresholds
 */
export async function checkUsageStatus(userId: string): Promise<{
  status: 'ok' | 'warning' | 'exceeded'
  usageData: UsageData
}> {
  try {
    const usageData = await getUserUsageData(userId)

    let status: 'ok' | 'warning' | 'exceeded' = 'ok'
    if (usageData.isExceeded) {
      status = 'exceeded'
    } else if (usageData.isWarning) {
      status = 'warning'
    }

    return {
      status,
      usageData,
    }
  } catch (error) {
    logger.error('Failed to check usage status', { userId, error })
    throw error
  }
}

/**
 * Sync usage limits based on subscription changes
 */
export async function syncUsageLimitsFromSubscription(userId: string): Promise<void> {
  const [subscription, currentUserStats] = await Promise.all([
    getHighestPrioritySubscription(userId),
    db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1),
  ])

  if (currentUserStats.length === 0) {
    throw new Error(`User stats not found for userId: ${userId}`)
  }

  const currentStats = currentUserStats[0]

  // Team/enterprise: Should have null individual limits
  if (subscription && (subscription.plan === 'team' || subscription.plan === 'enterprise')) {
    if (currentStats.currentUsageLimit !== null) {
      await db
        .update(userStats)
        .set({
          currentUsageLimit: null,
          usageLimitUpdatedAt: new Date(),
        })
        .where(eq(userStats.userId, userId))

      logger.info('Cleared individual limit for team/enterprise member', {
        userId,
        plan: subscription.plan,
      })
    }
    return
  }

  // Free/Pro: Handle individual limits
  const defaultLimit = getPerUserMinimumLimit(subscription)
  const currentLimit = currentStats.currentUsageLimit
    ? Number.parseFloat(currentStats.currentUsageLimit)
    : 0

  if (!subscription || subscription.status !== 'active') {
    // Downgraded to free
    await db
      .update(userStats)
      .set({
        currentUsageLimit: getFreeTierLimit().toString(),
        usageLimitUpdatedAt: new Date(),
      })
      .where(eq(userStats.userId, userId))

    logger.info('Set limit to free tier', { userId })
  } else if (currentLimit < defaultLimit) {
    await db
      .update(userStats)
      .set({
        currentUsageLimit: defaultLimit.toString(),
        usageLimitUpdatedAt: new Date(),
      })
      .where(eq(userStats.userId, userId))

    logger.info('Raised limit to plan minimum', {
      userId,
      newLimit: defaultLimit,
    })
  }
  // Keep higher custom limits unchanged
}

/**
 * Get usage limit information for team members (for admin dashboard)
 */
export async function getTeamUsageLimits(organizationId: string): Promise<
  Array<{
    userId: string
    userName: string
    userEmail: string
    currentLimit: number
    currentUsage: number
    totalCost: number
    lastActive: Date | null
  }>
> {
  try {
    const teamMembers = await db
      .select({
        userId: member.userId,
        userName: user.name,
        userEmail: user.email,
        currentLimit: userStats.currentUsageLimit,
        currentPeriodCost: userStats.currentPeriodCost,
        totalCost: userStats.totalCost,
        lastActive: userStats.lastActive,
      })
      .from(member)
      .innerJoin(user, eq(member.userId, user.id))
      .leftJoin(userStats, eq(member.userId, userStats.userId))
      .where(eq(member.organizationId, organizationId))

    return teamMembers.map((memberData) => ({
      userId: memberData.userId,
      userName: memberData.userName,
      userEmail: memberData.userEmail,
      currentLimit: Number.parseFloat(memberData.currentLimit || getFreeTierLimit().toString()),
      currentUsage: Number.parseFloat(memberData.currentPeriodCost || '0'),
      totalCost: Number.parseFloat(memberData.totalCost || '0'),
      lastActive: memberData.lastActive,
    }))
  } catch (error) {
    logger.error('Failed to get team usage limits', { organizationId, error })
    return []
  }
}

/**
 * Returns the effective current period usage cost for a user.
 * - Free/Pro: user's own currentPeriodCost (fallback to totalCost)
 * - Team/Enterprise: pooled sum of all members' currentPeriodCost within the organization
 */
export async function getEffectiveCurrentPeriodCost(userId: string): Promise<number> {
  const subscription = await getHighestPrioritySubscription(userId)

  // If no team/org subscription, return the user's own usage
  if (!subscription || subscription.plan === 'free' || subscription.plan === 'pro') {
    const rows = await db
      .select({ current: userStats.currentPeriodCost })
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1)

    if (rows.length === 0) return 0
    return rows[0].current ? Number.parseFloat(rows[0].current.toString()) : 0
  }

  // Team/Enterprise: pooled usage across org members
  const teamMembers = await db
    .select({ userId: member.userId })
    .from(member)
    .where(eq(member.organizationId, subscription.referenceId))

  if (teamMembers.length === 0) return 0

  const memberIds = teamMembers.map((m) => m.userId)
  const rows = await db
    .select({ current: userStats.currentPeriodCost })
    .from(userStats)
    .where(inArray(userStats.userId, memberIds))

  let pooled = 0
  for (const r of rows) {
    pooled += r.current ? Number.parseFloat(r.current.toString()) : 0
  }
  return pooled
}

/**
 * Calculate billing projection based on current usage
 */
export async function calculateBillingProjection(userId: string): Promise<BillingData> {
  try {
    const usageData = await getUserUsageData(userId)

    if (!usageData.billingPeriodStart || !usageData.billingPeriodEnd) {
      return {
        currentPeriodCost: usageData.currentUsage,
        projectedCost: usageData.currentUsage,
        limit: usageData.limit,
        billingPeriodStart: null,
        billingPeriodEnd: null,
        daysRemaining: 0,
      }
    }

    const now = new Date()
    const periodStart = new Date(usageData.billingPeriodStart)
    const periodEnd = new Date(usageData.billingPeriodEnd)

    const totalDays = Math.ceil(
      (periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)
    )
    const daysElapsed = Math.ceil((now.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24))
    const daysRemaining = Math.max(0, totalDays - daysElapsed)

    // Project cost based on daily usage rate
    const dailyRate = daysElapsed > 0 ? usageData.currentUsage / daysElapsed : 0
    const projectedCost = dailyRate * totalDays

    return {
      currentPeriodCost: usageData.currentUsage,
      projectedCost: Math.min(projectedCost, usageData.limit), // Cap at limit
      limit: usageData.limit,
      billingPeriodStart: usageData.billingPeriodStart,
      billingPeriodEnd: usageData.billingPeriodEnd,
      daysRemaining,
    }
  } catch (error) {
    logger.error('Failed to calculate billing projection', { userId, error })
    throw error
  }
}

/**
 * Send usage threshold notification when crossing from <80% to ≥80%.
 * - Skips when billing is disabled.
 * - Respects user-level notifications toggle and unsubscribe preferences.
 * - For organization plans, emails owners/admins who have notifications enabled.
 */
export async function maybeSendUsageThresholdEmail(params: {
  scope: 'user' | 'organization'
  planName: string
  percentBefore: number
  percentAfter: number
  userId?: string
  userEmail?: string
  userName?: string
  organizationId?: string
  currentUsageAfter: number
  limit: number
}): Promise<void> {
  try {
    if (!isBillingEnabled) return
    if (params.limit <= 0 || params.currentUsageAfter <= 0) return

    const baseUrl = getBaseUrl()
    const isFreeUser = params.planName === 'Free'

    // Check for 80% threshold (all users)
    const crosses80 = params.percentBefore < 80 && params.percentAfter >= 80
    // Check for 90% threshold (free users only)
    const crosses90 = params.percentBefore < 90 && params.percentAfter >= 90

    // Skip if no thresholds crossed
    if (!crosses80 && !crosses90) return

    // For 80% threshold email (all users)
    if (crosses80) {
      const ctaLink = `${baseUrl}/workspace?billing=usage`
      const sendTo = async (email: string, name?: string) => {
        const prefs = await getEmailPreferences(email)
        if (prefs?.unsubscribeAll || prefs?.unsubscribeNotifications) return

        const html = await renderUsageThresholdEmail({
          userName: name,
          planName: params.planName,
          percentUsed: Math.min(100, Math.round(params.percentAfter)),
          currentUsage: params.currentUsageAfter,
          limit: params.limit,
          ctaLink,
        })

        await sendEmail({
          to: email,
          subject: getEmailSubject('usage-threshold'),
          html,
          emailType: 'notifications',
        })
      }

      if (params.scope === 'user' && params.userId && params.userEmail) {
        const rows = await db
          .select({ enabled: settings.billingUsageNotificationsEnabled })
          .from(settings)
          .where(eq(settings.userId, params.userId))
          .limit(1)
        if (rows.length > 0 && rows[0].enabled === false) return
        await sendTo(params.userEmail, params.userName)
      } else if (params.scope === 'organization' && params.organizationId) {
        const admins = await db
          .select({
            email: user.email,
            name: user.name,
            enabled: settings.billingUsageNotificationsEnabled,
            role: member.role,
          })
          .from(member)
          .innerJoin(user, eq(member.userId, user.id))
          .leftJoin(settings, eq(settings.userId, member.userId))
          .where(eq(member.organizationId, params.organizationId))

        for (const a of admins) {
          const isAdmin = a.role === 'owner' || a.role === 'admin'
          if (!isAdmin) continue
          if (a.enabled === false) continue
          if (!a.email) continue
          await sendTo(a.email, a.name || undefined)
        }
      }
    }

    // For 90% threshold email (free users only)
    if (crosses90 && isFreeUser) {
      const upgradeLink = `${baseUrl}/workspace?billing=upgrade`
      const sendFreeTierEmail = async (email: string, name?: string) => {
        const prefs = await getEmailPreferences(email)
        if (prefs?.unsubscribeAll || prefs?.unsubscribeNotifications) return

        const html = await renderFreeTierUpgradeEmail({
          userName: name,
          percentUsed: Math.min(100, Math.round(params.percentAfter)),
          currentUsage: params.currentUsageAfter,
          limit: params.limit,
          upgradeLink,
        })

        await sendEmail({
          to: email,
          subject: getEmailSubject('free-tier-upgrade'),
          html,
          emailType: 'notifications',
        })

        logger.info('Free tier upgrade email sent', {
          email,
          percentUsed: Math.round(params.percentAfter),
          currentUsage: params.currentUsageAfter,
          limit: params.limit,
        })
      }

      // Free users are always individual scope (not organization)
      if (params.scope === 'user' && params.userId && params.userEmail) {
        const rows = await db
          .select({ enabled: settings.billingUsageNotificationsEnabled })
          .from(settings)
          .where(eq(settings.userId, params.userId))
          .limit(1)
        if (rows.length > 0 && rows[0].enabled === false) return
        await sendFreeTierEmail(params.userEmail, params.userName)
      }
    }
  } catch (error) {
    logger.error('Failed to send usage threshold email', {
      scope: params.scope,
      userId: params.userId,
      organizationId: params.organizationId,
      error,
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: balance.ts]---
Location: sim-main/apps/sim/lib/billing/credits/balance.ts

```typescript
import { db } from '@sim/db'
import { member, organization, userStats } from '@sim/db/schema'
import { and, eq, sql } from 'drizzle-orm'
import { getHighestPrioritySubscription } from '@/lib/billing/core/subscription'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('CreditBalance')

export interface CreditBalanceInfo {
  balance: number
  entityType: 'user' | 'organization'
  entityId: string
}

export async function getCreditBalance(userId: string): Promise<CreditBalanceInfo> {
  const subscription = await getHighestPrioritySubscription(userId)

  if (subscription?.plan === 'team' || subscription?.plan === 'enterprise') {
    const orgRows = await db
      .select({ creditBalance: organization.creditBalance })
      .from(organization)
      .where(eq(organization.id, subscription.referenceId))
      .limit(1)

    return {
      balance: orgRows.length > 0 ? Number.parseFloat(orgRows[0].creditBalance || '0') : 0,
      entityType: 'organization',
      entityId: subscription.referenceId,
    }
  }

  const userRows = await db
    .select({ creditBalance: userStats.creditBalance })
    .from(userStats)
    .where(eq(userStats.userId, userId))
    .limit(1)

  return {
    balance: userRows.length > 0 ? Number.parseFloat(userRows[0].creditBalance || '0') : 0,
    entityType: 'user',
    entityId: userId,
  }
}

export async function addCredits(
  entityType: 'user' | 'organization',
  entityId: string,
  amount: number
): Promise<void> {
  if (entityType === 'organization') {
    await db
      .update(organization)
      .set({ creditBalance: sql`${organization.creditBalance} + ${amount}` })
      .where(eq(organization.id, entityId))

    logger.info('Added credits to organization', { organizationId: entityId, amount })
  } else {
    await db
      .update(userStats)
      .set({ creditBalance: sql`${userStats.creditBalance} + ${amount}` })
      .where(eq(userStats.userId, entityId))

    logger.info('Added credits to user', { userId: entityId, amount })
  }
}

export async function removeCredits(
  entityType: 'user' | 'organization',
  entityId: string,
  amount: number
): Promise<void> {
  if (entityType === 'organization') {
    await db
      .update(organization)
      .set({ creditBalance: sql`GREATEST(0, ${organization.creditBalance} - ${amount})` })
      .where(eq(organization.id, entityId))

    logger.info('Removed credits from organization', { organizationId: entityId, amount })
  } else {
    await db
      .update(userStats)
      .set({ creditBalance: sql`GREATEST(0, ${userStats.creditBalance} - ${amount})` })
      .where(eq(userStats.userId, entityId))

    logger.info('Removed credits from user', { userId: entityId, amount })
  }
}

export interface DeductResult {
  creditsUsed: number
  overflow: number
}

async function atomicDeductUserCredits(userId: string, cost: number): Promise<number> {
  const costStr = cost.toFixed(6)

  // Use raw SQL with CTE to capture old balance before update
  const result = await db.execute<{ old_balance: string; new_balance: string }>(sql`
    WITH old_balance AS (
      SELECT credit_balance FROM user_stats WHERE user_id = ${userId}
    )
    UPDATE user_stats 
    SET credit_balance = CASE 
      WHEN credit_balance >= ${costStr}::decimal THEN credit_balance - ${costStr}::decimal
      ELSE 0
    END
    WHERE user_id = ${userId} AND credit_balance >= 0
    RETURNING 
      (SELECT credit_balance FROM old_balance) as old_balance,
      credit_balance as new_balance
  `)

  const rows = Array.from(result)
  if (rows.length === 0) return 0

  const oldBalance = Number.parseFloat(rows[0].old_balance || '0')
  return Math.min(oldBalance, cost)
}

async function atomicDeductOrgCredits(orgId: string, cost: number): Promise<number> {
  const costStr = cost.toFixed(6)

  // Use raw SQL with CTE to capture old balance before update
  const result = await db.execute<{ old_balance: string; new_balance: string }>(sql`
    WITH old_balance AS (
      SELECT credit_balance FROM organization WHERE id = ${orgId}
    )
    UPDATE organization 
    SET credit_balance = CASE 
      WHEN credit_balance >= ${costStr}::decimal THEN credit_balance - ${costStr}::decimal
      ELSE 0
    END
    WHERE id = ${orgId} AND credit_balance >= 0
    RETURNING 
      (SELECT credit_balance FROM old_balance) as old_balance,
      credit_balance as new_balance
  `)

  const rows = Array.from(result)
  if (rows.length === 0) return 0

  const oldBalance = Number.parseFloat(rows[0].old_balance || '0')
  return Math.min(oldBalance, cost)
}

export async function deductFromCredits(userId: string, cost: number): Promise<DeductResult> {
  if (cost <= 0) {
    return { creditsUsed: 0, overflow: 0 }
  }

  const subscription = await getHighestPrioritySubscription(userId)
  const isTeamOrEnterprise = subscription?.plan === 'team' || subscription?.plan === 'enterprise'

  let creditsUsed: number

  if (isTeamOrEnterprise && subscription?.referenceId) {
    creditsUsed = await atomicDeductOrgCredits(subscription.referenceId, cost)
  } else {
    creditsUsed = await atomicDeductUserCredits(userId, cost)
  }

  const overflow = Math.max(0, cost - creditsUsed)

  if (creditsUsed > 0) {
    logger.info('Deducted credits atomically', {
      userId,
      creditsUsed,
      overflow,
      entityType: isTeamOrEnterprise ? 'organization' : 'user',
    })
  }

  return { creditsUsed, overflow }
}

export async function canPurchaseCredits(userId: string): Promise<boolean> {
  const subscription = await getHighestPrioritySubscription(userId)
  if (!subscription || subscription.status !== 'active') {
    return false
  }
  // Enterprise users must contact support to purchase credits
  return subscription.plan === 'pro' || subscription.plan === 'team'
}

export async function isOrgAdmin(userId: string, organizationId: string): Promise<boolean> {
  const memberRows = await db
    .select({ role: member.role })
    .from(member)
    .where(and(eq(member.organizationId, organizationId), eq(member.userId, userId)))
    .limit(1)

  if (memberRows.length === 0) return false
  return memberRows[0].role === 'owner' || memberRows[0].role === 'admin'
}
```

--------------------------------------------------------------------------------

````
