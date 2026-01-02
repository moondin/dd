---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 539
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 539 of 933)

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

---[FILE: utils.ts]---
Location: sim-main/apps/sim/lib/billing/client/utils.ts

```typescript
/**
 * Helper functions for subscription-related computations
 * These are pure functions that compute values from subscription data
 */

import { DEFAULT_FREE_CREDITS } from '@/lib/billing/constants'
import type { BillingStatus, SubscriptionData, UsageData } from './types'

const defaultUsage: UsageData = {
  current: 0,
  limit: DEFAULT_FREE_CREDITS,
  percentUsed: 0,
  isWarning: false,
  isExceeded: false,
  billingPeriodStart: null,
  billingPeriodEnd: null,
  lastPeriodCost: 0,
}

/**
 * Get subscription status flags from subscription data
 */
export function getSubscriptionStatus(subscriptionData: SubscriptionData | null | undefined) {
  return {
    isPaid: subscriptionData?.isPaid ?? false,
    isPro: subscriptionData?.isPro ?? false,
    isTeam: subscriptionData?.isTeam ?? false,
    isEnterprise: subscriptionData?.isEnterprise ?? false,
    isFree: !(subscriptionData?.isPaid ?? false),
    plan: subscriptionData?.plan ?? 'free',
    status: subscriptionData?.status ?? null,
    seats: subscriptionData?.seats ?? null,
    metadata: subscriptionData?.metadata ?? null,
  }
}

/**
 * Get usage data from subscription data
 */
export function getUsage(subscriptionData: SubscriptionData | null | undefined): UsageData {
  return subscriptionData?.usage ?? defaultUsage
}

/**
 * Get billing status based on usage and blocked state
 */
export function getBillingStatus(
  subscriptionData: SubscriptionData | null | undefined
): BillingStatus {
  const usage = getUsage(subscriptionData)
  const blocked = subscriptionData?.billingBlocked
  if (blocked) return 'blocked'
  if (usage.isExceeded) return 'exceeded'
  if (usage.isWarning) return 'warning'
  return 'ok'
}

/**
 * Get remaining budget
 */
export function getRemainingBudget(subscriptionData: SubscriptionData | null | undefined): number {
  const usage = getUsage(subscriptionData)
  return Math.max(0, usage.limit - usage.current)
}

/**
 * Get days remaining in billing period
 */
export function getDaysRemainingInPeriod(
  subscriptionData: SubscriptionData | null | undefined
): number | null {
  const usage = getUsage(subscriptionData)
  if (!usage.billingPeriodEnd) return null

  const now = new Date()
  const endDate = usage.billingPeriodEnd
  const diffTime = endDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays)
}

/**
 * Check if subscription is at least Pro tier
 */
export function isAtLeastPro(subscriptionData: SubscriptionData | null | undefined): boolean {
  const status = getSubscriptionStatus(subscriptionData)
  return status.isPro || status.isTeam || status.isEnterprise
}

/**
 * Check if subscription is at least Team tier
 */
export function isAtLeastTeam(subscriptionData: SubscriptionData | null | undefined): boolean {
  const status = getSubscriptionStatus(subscriptionData)
  return status.isTeam || status.isEnterprise
}

export function canUpgrade(subscriptionData: SubscriptionData | null | undefined): boolean {
  const status = getSubscriptionStatus(subscriptionData)
  return status.plan === 'free' || status.plan === 'pro'
}
```

--------------------------------------------------------------------------------

---[FILE: billing.ts]---
Location: sim-main/apps/sim/lib/billing/core/billing.ts

```typescript
import { db } from '@sim/db'
import { member, organization, subscription, user, userStats } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { getHighestPrioritySubscription } from '@/lib/billing/core/subscription'
import { getUserUsageData } from '@/lib/billing/core/usage'
import { getCreditBalance } from '@/lib/billing/credits/balance'
import { getFreeTierLimit, getPlanPricing } from '@/lib/billing/subscriptions/utils'

export { getPlanPricing }

import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('Billing')

/**
 * Get organization subscription directly by organization ID
 */
export async function getOrganizationSubscription(organizationId: string) {
  try {
    const orgSubs = await db
      .select()
      .from(subscription)
      .where(and(eq(subscription.referenceId, organizationId), eq(subscription.status, 'active')))
      .limit(1)

    return orgSubs.length > 0 ? orgSubs[0] : null
  } catch (error) {
    logger.error('Error getting organization subscription', { error, organizationId })
    return null
  }
}

/**
 * BILLING MODEL:
 * 1. User purchases $20 Pro plan → Gets charged $20 immediately via Stripe subscription
 * 2. User uses $15 during the month → No additional charge (covered by $20)
 * 3. User uses $35 during the month → Gets charged $15 overage at month end
 * 4. Usage resets, next month they pay $20 again + any overages
 */

/**
 * Calculate overage billing for a user
 * Returns only the amount that exceeds their subscription base price
 */
export async function calculateUserOverage(userId: string): Promise<{
  basePrice: number
  actualUsage: number
  overageAmount: number
  plan: string
} | null> {
  try {
    // Get user's subscription and usage data
    const [subscription, usageData, userRecord] = await Promise.all([
      getHighestPrioritySubscription(userId),
      getUserUsageData(userId),
      db.select().from(user).where(eq(user.id, userId)).limit(1),
    ])

    if (userRecord.length === 0) {
      logger.warn('User not found for overage calculation', { userId })
      return null
    }

    const plan = subscription?.plan || 'free'
    const { basePrice } = getPlanPricing(plan)
    const actualUsage = usageData.currentUsage

    // Calculate overage: any usage beyond what they already paid for
    const overageAmount = Math.max(0, actualUsage - basePrice)

    return {
      basePrice,
      actualUsage,
      overageAmount,
      plan,
    }
  } catch (error) {
    logger.error('Failed to calculate user overage', { userId, error })
    return null
  }
}

/**
 * Calculate overage amount for a subscription
 * Shared logic between invoice.finalized and customer.subscription.deleted handlers
 */
export async function calculateSubscriptionOverage(sub: {
  id: string
  plan: string | null
  referenceId: string
  seats?: number | null
}): Promise<number> {
  // Enterprise plans have no overages
  if (sub.plan === 'enterprise') {
    logger.info('Enterprise plan has no overages', {
      subscriptionId: sub.id,
      plan: sub.plan,
    })
    return 0
  }

  let totalOverage = 0

  if (sub.plan === 'team') {
    const members = await db
      .select({ userId: member.userId })
      .from(member)
      .where(eq(member.organizationId, sub.referenceId))

    let totalTeamUsage = 0
    for (const m of members) {
      const usage = await getUserUsageData(m.userId)
      totalTeamUsage += usage.currentUsage
    }

    const orgData = await db
      .select({ departedMemberUsage: organization.departedMemberUsage })
      .from(organization)
      .where(eq(organization.id, sub.referenceId))
      .limit(1)

    const departedUsage =
      orgData.length > 0 && orgData[0].departedMemberUsage
        ? Number.parseFloat(orgData[0].departedMemberUsage)
        : 0

    const totalUsageWithDeparted = totalTeamUsage + departedUsage
    const { basePrice } = getPlanPricing(sub.plan)
    const baseSubscriptionAmount = (sub.seats ?? 0) * basePrice
    totalOverage = Math.max(0, totalUsageWithDeparted - baseSubscriptionAmount)

    logger.info('Calculated team overage', {
      subscriptionId: sub.id,
      currentMemberUsage: totalTeamUsage,
      departedMemberUsage: departedUsage,
      totalUsage: totalUsageWithDeparted,
      baseSubscriptionAmount,
      totalOverage,
    })
  } else if (sub.plan === 'pro') {
    // Pro plan: include snapshot if user joined a team
    const usage = await getUserUsageData(sub.referenceId)
    let totalProUsage = usage.currentUsage

    // Add any snapshotted Pro usage (from when they joined a team)
    const userStatsRows = await db
      .select({ proPeriodCostSnapshot: userStats.proPeriodCostSnapshot })
      .from(userStats)
      .where(eq(userStats.userId, sub.referenceId))
      .limit(1)

    if (userStatsRows.length > 0 && userStatsRows[0].proPeriodCostSnapshot) {
      const snapshotUsage = Number.parseFloat(userStatsRows[0].proPeriodCostSnapshot.toString())
      totalProUsage += snapshotUsage
      logger.info('Including snapshotted Pro usage in overage calculation', {
        userId: sub.referenceId,
        currentUsage: usage.currentUsage,
        snapshotUsage,
        totalProUsage,
      })
    }

    const { basePrice } = getPlanPricing(sub.plan)
    totalOverage = Math.max(0, totalProUsage - basePrice)

    logger.info('Calculated pro overage', {
      subscriptionId: sub.id,
      totalProUsage,
      basePrice,
      totalOverage,
    })
  } else {
    // Free plan or unknown plan type
    const usage = await getUserUsageData(sub.referenceId)
    const { basePrice } = getPlanPricing(sub.plan || 'free')
    totalOverage = Math.max(0, usage.currentUsage - basePrice)

    logger.info('Calculated overage for plan', {
      subscriptionId: sub.id,
      plan: sub.plan || 'free',
      usage: usage.currentUsage,
      basePrice,
      totalOverage,
    })
  }

  return totalOverage
}

/**
 * Get comprehensive billing and subscription summary
 */
export async function getSimplifiedBillingSummary(
  userId: string,
  organizationId?: string
): Promise<{
  type: 'individual' | 'organization'
  plan: string
  basePrice: number
  currentUsage: number
  overageAmount: number
  totalProjected: number
  usageLimit: number
  percentUsed: number
  isWarning: boolean
  isExceeded: boolean
  daysRemaining: number
  creditBalance: number
  // Subscription details
  isPaid: boolean
  isPro: boolean
  isTeam: boolean
  isEnterprise: boolean
  status: string | null
  seats: number | null
  metadata: any
  stripeSubscriptionId: string | null
  periodEnd: Date | string | null
  cancelAtPeriodEnd?: boolean
  // Usage details
  usage: {
    current: number
    limit: number
    percentUsed: number
    isWarning: boolean
    isExceeded: boolean
    billingPeriodStart: Date | null
    billingPeriodEnd: Date | null
    lastPeriodCost: number
    lastPeriodCopilotCost: number
    daysRemaining: number
    copilotCost: number
  }
  organizationData?: {
    seatCount: number
    memberCount: number
    totalBasePrice: number
    totalCurrentUsage: number
    totalOverage: number
  }
}> {
  try {
    // Get subscription and usage data upfront
    const [subscription, usageData] = await Promise.all([
      organizationId
        ? getOrganizationSubscription(organizationId)
        : getHighestPrioritySubscription(userId),
      getUserUsageData(userId),
    ])

    // Determine subscription type flags
    const plan = subscription?.plan || 'free'
    const isPaid = plan !== 'free'
    const isPro = plan === 'pro'
    const isTeam = plan === 'team'
    const isEnterprise = plan === 'enterprise'

    if (organizationId) {
      // Organization billing summary
      if (!subscription) {
        return getDefaultBillingSummary('organization')
      }

      // Get all organization members
      const members = await db
        .select({ userId: member.userId })
        .from(member)
        .where(eq(member.organizationId, organizationId))

      const { basePrice: basePricePerSeat } = getPlanPricing(subscription.plan)
      // Use licensed seats from Stripe as source of truth
      const licensedSeats = subscription.seats ?? 0
      const totalBasePrice = basePricePerSeat * licensedSeats // Based on Stripe subscription

      let totalCurrentUsage = 0
      let totalCopilotCost = 0
      let totalLastPeriodCopilotCost = 0

      // Calculate total team usage across all members
      for (const memberInfo of members) {
        const memberUsageData = await getUserUsageData(memberInfo.userId)
        totalCurrentUsage += memberUsageData.currentUsage

        // Fetch copilot cost for this member
        const memberStats = await db
          .select({
            currentPeriodCopilotCost: userStats.currentPeriodCopilotCost,
            lastPeriodCopilotCost: userStats.lastPeriodCopilotCost,
          })
          .from(userStats)
          .where(eq(userStats.userId, memberInfo.userId))
          .limit(1)

        if (memberStats.length > 0) {
          totalCopilotCost += Number.parseFloat(
            memberStats[0].currentPeriodCopilotCost?.toString() || '0'
          )
          totalLastPeriodCopilotCost += Number.parseFloat(
            memberStats[0].lastPeriodCopilotCost?.toString() || '0'
          )
        }
      }

      // Calculate team-level overage: total usage beyond what was already paid to Stripe
      const totalOverage = Math.max(0, totalCurrentUsage - totalBasePrice)

      // Get user's personal limits for warnings
      const percentUsed =
        usageData.limit > 0 ? Math.round((usageData.currentUsage / usageData.limit) * 100) : 0

      // Calculate days remaining in billing period
      const daysRemaining = usageData.billingPeriodEnd
        ? Math.max(
            0,
            Math.ceil((usageData.billingPeriodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          )
        : 0

      const orgCredits = await getCreditBalance(userId)

      return {
        type: 'organization',
        plan: subscription.plan,
        basePrice: totalBasePrice,
        currentUsage: totalCurrentUsage,
        overageAmount: totalOverage,
        totalProjected: totalBasePrice + totalOverage,
        usageLimit: usageData.limit,
        percentUsed,
        isWarning: percentUsed >= 80 && percentUsed < 100,
        isExceeded: usageData.currentUsage >= usageData.limit,
        daysRemaining,
        creditBalance: orgCredits.balance,
        // Subscription details
        isPaid,
        isPro,
        isTeam,
        isEnterprise,
        status: subscription.status || null,
        seats: subscription.seats || null,
        metadata: subscription.metadata || null,
        stripeSubscriptionId: subscription.stripeSubscriptionId || null,
        periodEnd: subscription.periodEnd || null,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd || undefined,
        // Usage details
        usage: {
          current: usageData.currentUsage,
          limit: usageData.limit,
          percentUsed,
          isWarning: percentUsed >= 80 && percentUsed < 100,
          isExceeded: usageData.currentUsage >= usageData.limit,
          billingPeriodStart: usageData.billingPeriodStart,
          billingPeriodEnd: usageData.billingPeriodEnd,
          lastPeriodCost: usageData.lastPeriodCost,
          lastPeriodCopilotCost: totalLastPeriodCopilotCost,
          daysRemaining,
          copilotCost: totalCopilotCost,
        },
        organizationData: {
          seatCount: licensedSeats,
          memberCount: members.length,
          totalBasePrice,
          totalCurrentUsage,
          totalOverage,
        },
      }
    }

    // Individual billing summary
    const { basePrice } = getPlanPricing(plan)

    // Fetch user stats for copilot cost breakdown
    const userStatsRows = await db
      .select({
        currentPeriodCopilotCost: userStats.currentPeriodCopilotCost,
        lastPeriodCopilotCost: userStats.lastPeriodCopilotCost,
      })
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1)

    const copilotCost =
      userStatsRows.length > 0
        ? Number.parseFloat(userStatsRows[0].currentPeriodCopilotCost?.toString() || '0')
        : 0

    const lastPeriodCopilotCost =
      userStatsRows.length > 0
        ? Number.parseFloat(userStatsRows[0].lastPeriodCopilotCost?.toString() || '0')
        : 0

    // For team and enterprise plans, calculate total team usage instead of individual usage
    let currentUsage = usageData.currentUsage
    let totalCopilotCost = copilotCost
    let totalLastPeriodCopilotCost = lastPeriodCopilotCost
    if ((isTeam || isEnterprise) && subscription?.referenceId) {
      // Get all team members and sum their usage
      const teamMembers = await db
        .select({ userId: member.userId })
        .from(member)
        .where(eq(member.organizationId, subscription.referenceId))

      let totalTeamUsage = 0
      let totalTeamCopilotCost = 0
      let totalTeamLastPeriodCopilotCost = 0
      for (const teamMember of teamMembers) {
        const memberUsageData = await getUserUsageData(teamMember.userId)
        totalTeamUsage += memberUsageData.currentUsage

        // Fetch copilot cost for this team member
        const memberStats = await db
          .select({
            currentPeriodCopilotCost: userStats.currentPeriodCopilotCost,
            lastPeriodCopilotCost: userStats.lastPeriodCopilotCost,
          })
          .from(userStats)
          .where(eq(userStats.userId, teamMember.userId))
          .limit(1)

        if (memberStats.length > 0) {
          totalTeamCopilotCost += Number.parseFloat(
            memberStats[0].currentPeriodCopilotCost?.toString() || '0'
          )
          totalTeamLastPeriodCopilotCost += Number.parseFloat(
            memberStats[0].lastPeriodCopilotCost?.toString() || '0'
          )
        }
      }
      currentUsage = totalTeamUsage
      totalCopilotCost = totalTeamCopilotCost
      totalLastPeriodCopilotCost = totalTeamLastPeriodCopilotCost
    }

    const overageAmount = Math.max(0, currentUsage - basePrice)
    const percentUsed = usageData.limit > 0 ? (currentUsage / usageData.limit) * 100 : 0

    // Calculate days remaining in billing period
    const daysRemaining = usageData.billingPeriodEnd
      ? Math.max(
          0,
          Math.ceil((usageData.billingPeriodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        )
      : 0

    const userCredits = await getCreditBalance(userId)

    return {
      type: 'individual',
      plan,
      basePrice,
      currentUsage: currentUsage,
      overageAmount,
      totalProjected: basePrice + overageAmount,
      usageLimit: usageData.limit,
      percentUsed,
      isWarning: percentUsed >= 80 && percentUsed < 100,
      isExceeded: currentUsage >= usageData.limit,
      daysRemaining,
      creditBalance: userCredits.balance,
      // Subscription details
      isPaid,
      isPro,
      isTeam,
      isEnterprise,
      status: subscription?.status || null,
      seats: subscription?.seats || null,
      metadata: subscription?.metadata || null,
      stripeSubscriptionId: subscription?.stripeSubscriptionId || null,
      periodEnd: subscription?.periodEnd || null,
      cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd || undefined,
      // Usage details
      usage: {
        current: currentUsage,
        limit: usageData.limit,
        percentUsed,
        isWarning: percentUsed >= 80 && percentUsed < 100,
        isExceeded: currentUsage >= usageData.limit,
        billingPeriodStart: usageData.billingPeriodStart,
        billingPeriodEnd: usageData.billingPeriodEnd,
        lastPeriodCost: usageData.lastPeriodCost,
        lastPeriodCopilotCost: totalLastPeriodCopilotCost,
        daysRemaining,
        copilotCost: totalCopilotCost,
      },
    }
  } catch (error) {
    logger.error('Failed to get simplified billing summary', { userId, organizationId, error })
    return getDefaultBillingSummary(organizationId ? 'organization' : 'individual')
  }
}

/**
 * Get default billing summary for error cases
 */
function getDefaultBillingSummary(type: 'individual' | 'organization') {
  return {
    type,
    plan: 'free',
    basePrice: 0,
    currentUsage: 0,
    overageAmount: 0,
    totalProjected: 0,
    usageLimit: getFreeTierLimit(),
    percentUsed: 0,
    isWarning: false,
    isExceeded: false,
    daysRemaining: 0,
    creditBalance: 0,
    // Subscription details
    isPaid: false,
    isPro: false,
    isTeam: false,
    isEnterprise: false,
    status: null,
    seats: null,
    metadata: null,
    stripeSubscriptionId: null,
    periodEnd: null,
    // Usage details
    usage: {
      current: 0,
      limit: getFreeTierLimit(),
      percentUsed: 0,
      isWarning: false,
      isExceeded: false,
      billingPeriodStart: null,
      billingPeriodEnd: null,
      lastPeriodCost: 0,
      lastPeriodCopilotCost: 0,
      daysRemaining: 0,
      copilotCost: 0,
    },
    ...(type === 'organization' && {
      organizationData: {
        seatCount: 0,
        memberCount: 0,
        totalBasePrice: 0,
        totalCurrentUsage: 0,
        totalOverage: 0,
      },
    }),
  }
}
```

--------------------------------------------------------------------------------

---[FILE: organization.ts]---
Location: sim-main/apps/sim/lib/billing/core/organization.ts

```typescript
import { db } from '@sim/db'
import { member, organization, subscription, user, userStats } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { getPlanPricing } from '@/lib/billing/core/billing'
import { getEffectiveSeats, getFreeTierLimit } from '@/lib/billing/subscriptions/utils'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('OrganizationBilling')

/**
 * Get organization subscription directly by organization ID
 * This is for our new pattern where referenceId = organizationId
 */
async function getOrganizationSubscription(organizationId: string) {
  try {
    const orgSubs = await db
      .select()
      .from(subscription)
      .where(and(eq(subscription.referenceId, organizationId), eq(subscription.status, 'active')))
      .limit(1)

    return orgSubs.length > 0 ? orgSubs[0] : null
  } catch (error) {
    logger.error('Error getting organization subscription', { error, organizationId })
    return null
  }
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100
}

interface OrganizationUsageData {
  organizationId: string
  organizationName: string
  subscriptionPlan: string
  subscriptionStatus: string
  totalSeats: number
  usedSeats: number
  seatsCount: number
  totalCurrentUsage: number
  totalUsageLimit: number
  minimumBillingAmount: number
  averageUsagePerMember: number
  billingPeriodStart: Date | null
  billingPeriodEnd: Date | null
  members: MemberUsageData[]
}

interface MemberUsageData {
  userId: string
  userName: string
  userEmail: string
  currentUsage: number
  usageLimit: number
  percentUsed: number
  isOverLimit: boolean
  role: string
  joinedAt: Date
  lastActive: Date | null
}

/**
 * Get comprehensive organization billing and usage data
 */
export async function getOrganizationBillingData(
  organizationId: string
): Promise<OrganizationUsageData | null> {
  try {
    // Get organization info
    const orgRecord = await db
      .select()
      .from(organization)
      .where(eq(organization.id, organizationId))
      .limit(1)

    if (orgRecord.length === 0) {
      logger.warn('Organization not found', { organizationId })
      return null
    }

    const organizationData = orgRecord[0]

    // Get organization subscription directly (referenceId = organizationId)
    const subscription = await getOrganizationSubscription(organizationId)

    if (!subscription) {
      logger.warn('No subscription found for organization', { organizationId })
      return null
    }

    // Get all organization members with their usage data
    const membersWithUsage = await db
      .select({
        userId: member.userId,
        userName: user.name,
        userEmail: user.email,
        role: member.role,
        joinedAt: member.createdAt,
        // User stats fields
        currentPeriodCost: userStats.currentPeriodCost,
        currentUsageLimit: userStats.currentUsageLimit,
        lastActive: userStats.lastActive,
      })
      .from(member)
      .innerJoin(user, eq(member.userId, user.id))
      .leftJoin(userStats, eq(member.userId, userStats.userId))
      .where(eq(member.organizationId, organizationId))

    // Process member data
    const members: MemberUsageData[] = membersWithUsage.map((memberRecord) => {
      const currentUsage = Number(memberRecord.currentPeriodCost || 0)
      const usageLimit = Number(memberRecord.currentUsageLimit || getFreeTierLimit())
      const percentUsed = usageLimit > 0 ? (currentUsage / usageLimit) * 100 : 0

      return {
        userId: memberRecord.userId,
        userName: memberRecord.userName,
        userEmail: memberRecord.userEmail,
        currentUsage,
        usageLimit,
        percentUsed: Math.round(percentUsed * 100) / 100,
        isOverLimit: currentUsage > usageLimit,
        role: memberRecord.role,
        joinedAt: memberRecord.joinedAt,
        lastActive: memberRecord.lastActive,
      }
    })

    // Calculate aggregated statistics
    const totalCurrentUsage = members.reduce((sum, member) => sum + member.currentUsage, 0)

    // Get per-seat pricing for the plan
    const { basePrice: pricePerSeat } = getPlanPricing(subscription.plan)

    const licensedSeats = subscription.seats ?? 0

    // For seat count used in UI (invitations, team management):
    // Team: seats column (Stripe quantity)
    // Enterprise: metadata.seats (allocated seats, not Stripe quantity which is always 1)
    const effectiveSeats = getEffectiveSeats(subscription)

    // Calculate minimum billing amount
    let minimumBillingAmount: number
    let totalUsageLimit: number

    if (subscription.plan === 'enterprise') {
      // Enterprise has fixed pricing set through custom Stripe product
      // Their usage limit is configured to match their monthly cost
      const configuredLimit = organizationData.orgUsageLimit
        ? Number.parseFloat(organizationData.orgUsageLimit)
        : 0
      minimumBillingAmount = configuredLimit // For enterprise, this equals their fixed monthly cost
      totalUsageLimit = configuredLimit // Same as their monthly cost
    } else {
      // Team plan: Billing is based on licensed seats from Stripe
      minimumBillingAmount = licensedSeats * pricePerSeat

      // Total usage limit: never below the minimum based on licensed seats
      const configuredLimit = organizationData.orgUsageLimit
        ? Number.parseFloat(organizationData.orgUsageLimit)
        : null
      totalUsageLimit =
        configuredLimit !== null
          ? Math.max(configuredLimit, minimumBillingAmount)
          : minimumBillingAmount
    }

    const averageUsagePerMember = members.length > 0 ? totalCurrentUsage / members.length : 0

    // Billing period comes from the organization's subscription
    const billingPeriodStart = subscription.periodStart || null
    const billingPeriodEnd = subscription.periodEnd || null

    return {
      organizationId,
      organizationName: organizationData.name || '',
      subscriptionPlan: subscription.plan,
      subscriptionStatus: subscription.status || 'inactive',
      totalSeats: effectiveSeats, // Uses metadata.seats for enterprise, seats column for team
      usedSeats: members.length,
      seatsCount: licensedSeats, // Used for billing calculations (Stripe quantity)
      totalCurrentUsage: roundCurrency(totalCurrentUsage),
      totalUsageLimit: roundCurrency(totalUsageLimit),
      minimumBillingAmount: roundCurrency(minimumBillingAmount),
      averageUsagePerMember: roundCurrency(averageUsagePerMember),
      billingPeriodStart,
      billingPeriodEnd,
      members: members.sort((a, b) => b.currentUsage - a.currentUsage), // Sort by usage desc
    }
  } catch (error) {
    logger.error('Failed to get organization billing data', { organizationId, error })
    throw error
  }
}

/**
 * Update organization usage limit (cap)
 */
export async function updateOrganizationUsageLimit(
  organizationId: string,
  newLimit: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate the organization exists
    const orgRecord = await db
      .select()
      .from(organization)
      .where(eq(organization.id, organizationId))
      .limit(1)

    if (orgRecord.length === 0) {
      return { success: false, error: 'Organization not found' }
    }

    // Get subscription to validate minimum
    const subscription = await getOrganizationSubscription(organizationId)
    if (!subscription) {
      return { success: false, error: 'No active subscription found' }
    }

    // Enterprise plans have fixed usage limits that cannot be changed
    if (subscription.plan === 'enterprise') {
      return {
        success: false,
        error: 'Enterprise plans have fixed usage limits that cannot be changed',
      }
    }

    // Only team plans can update their usage limits
    if (subscription.plan !== 'team') {
      return {
        success: false,
        error: 'Only team organizations can update usage limits',
      }
    }

    const { basePrice } = getPlanPricing(subscription.plan)
    const minimumLimit = (subscription.seats ?? 0) * basePrice

    // Validate new limit is not below minimum
    if (newLimit < minimumLimit) {
      return {
        success: false,
        error: `Usage limit cannot be less than minimum billing amount of $${roundCurrency(minimumLimit).toFixed(2)}`,
      }
    }

    // Update the organization usage limit
    // Convert number to string for decimal column
    await db
      .update(organization)
      .set({
        orgUsageLimit: roundCurrency(newLimit).toFixed(2),
        updatedAt: new Date(),
      })
      .where(eq(organization.id, organizationId))

    logger.info('Organization usage limit updated', {
      organizationId,
      newLimit,
      minimumLimit,
    })

    return { success: true }
  } catch (error) {
    logger.error('Failed to update organization usage limit', {
      organizationId,
      newLimit,
      error,
    })
    return {
      success: false,
      error: 'Failed to update usage limit',
    }
  }
}

/**
 * Get organization billing summary for admin dashboard
 */
export async function getOrganizationBillingSummary(organizationId: string) {
  try {
    const billingData = await getOrganizationBillingData(organizationId)

    if (!billingData) {
      return null
    }

    // Calculate additional metrics
    const membersOverLimit = billingData.members.filter((m) => m.isOverLimit).length
    const membersNearLimit = billingData.members.filter(
      (m) => !m.isOverLimit && m.percentUsed >= 80
    ).length

    const topUsers = billingData.members.slice(0, 5).map((m) => ({
      name: m.userName,
      usage: m.currentUsage,
      limit: m.usageLimit,
      percentUsed: m.percentUsed,
    }))

    return {
      organization: {
        id: billingData.organizationId,
        name: billingData.organizationName,
        plan: billingData.subscriptionPlan,
        status: billingData.subscriptionStatus,
      },
      usage: {
        total: billingData.totalCurrentUsage,
        limit: billingData.totalUsageLimit,
        average: billingData.averageUsagePerMember,
        percentUsed:
          billingData.totalUsageLimit > 0
            ? (billingData.totalCurrentUsage / billingData.totalUsageLimit) * 100
            : 0,
      },
      seats: {
        total: billingData.totalSeats,
        used: billingData.usedSeats,
        available: billingData.totalSeats - billingData.usedSeats,
      },
      alerts: {
        membersOverLimit,
        membersNearLimit,
      },
      billingPeriod: {
        start: billingData.billingPeriodStart,
        end: billingData.billingPeriodEnd,
      },
      topUsers,
    }
  } catch (error) {
    logger.error('Failed to get organization billing summary', { organizationId, error })
    throw error
  }
}

/**
 * Check if a user is an owner or admin of a specific organization
 *
 * @param userId - The ID of the user to check
 * @param organizationId - The ID of the organization
 * @returns Promise<boolean> - True if the user is an owner or admin of the organization
 */
export async function isOrganizationOwnerOrAdmin(
  userId: string,
  organizationId: string
): Promise<boolean> {
  try {
    const memberRecord = await db
      .select({ role: member.role })
      .from(member)
      .where(and(eq(member.userId, userId), eq(member.organizationId, organizationId)))
      .limit(1)

    if (memberRecord.length === 0) {
      return false
    }

    const userRole = memberRecord[0].role
    return ['owner', 'admin'].includes(userRole)
  } catch (error) {
    logger.error('Error checking organization ownership/admin status:', error)
    return false
  }
}
```

--------------------------------------------------------------------------------

````
