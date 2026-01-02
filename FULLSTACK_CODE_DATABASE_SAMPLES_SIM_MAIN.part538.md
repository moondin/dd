---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 538
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 538 of 933)

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

---[FILE: threshold-billing.ts]---
Location: sim-main/apps/sim/lib/billing/threshold-billing.ts

```typescript
import { db } from '@sim/db'
import { member, organization, subscription, userStats } from '@sim/db/schema'
import { and, eq, inArray, sql } from 'drizzle-orm'
import type Stripe from 'stripe'
import { DEFAULT_OVERAGE_THRESHOLD } from '@/lib/billing/constants'
import { calculateSubscriptionOverage, getPlanPricing } from '@/lib/billing/core/billing'
import { getHighestPrioritySubscription } from '@/lib/billing/core/subscription'
import { requireStripeClient } from '@/lib/billing/stripe-client'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('ThresholdBilling')

const OVERAGE_THRESHOLD = env.OVERAGE_THRESHOLD_DOLLARS || DEFAULT_OVERAGE_THRESHOLD

function parseDecimal(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0
  return Number.parseFloat(value.toString())
}

async function createAndFinalizeOverageInvoice(
  stripe: ReturnType<typeof requireStripeClient>,
  params: {
    customerId: string
    stripeSubscriptionId: string
    amountCents: number
    description: string
    itemDescription: string
    metadata: Record<string, string>
    idempotencyKey: string
  }
): Promise<string> {
  const getPaymentMethodId = (
    pm: string | Stripe.PaymentMethod | null | undefined
  ): string | undefined => (typeof pm === 'string' ? pm : pm?.id)

  let defaultPaymentMethod: string | undefined
  try {
    const stripeSub = await stripe.subscriptions.retrieve(params.stripeSubscriptionId)
    const subDpm = getPaymentMethodId(stripeSub.default_payment_method)
    if (subDpm) {
      defaultPaymentMethod = subDpm
    } else {
      const custObj = await stripe.customers.retrieve(params.customerId)
      if (custObj && !('deleted' in custObj)) {
        const cust = custObj as Stripe.Customer
        const custDpm = getPaymentMethodId(cust.invoice_settings?.default_payment_method)
        if (custDpm) defaultPaymentMethod = custDpm
      }
    }
  } catch (e) {
    logger.error('Failed to retrieve subscription or customer', { error: e })
  }

  const invoice = await stripe.invoices.create(
    {
      customer: params.customerId,
      collection_method: 'charge_automatically',
      auto_advance: false,
      description: params.description,
      metadata: params.metadata,
      ...(defaultPaymentMethod ? { default_payment_method: defaultPaymentMethod } : {}),
    },
    { idempotencyKey: `${params.idempotencyKey}-invoice` }
  )

  await stripe.invoiceItems.create(
    {
      customer: params.customerId,
      invoice: invoice.id,
      amount: params.amountCents,
      currency: 'usd',
      description: params.itemDescription,
      metadata: params.metadata,
    },
    { idempotencyKey: params.idempotencyKey }
  )

  if (invoice.id) {
    const finalized = await stripe.invoices.finalizeInvoice(invoice.id)

    if (finalized.status === 'open' && finalized.id) {
      try {
        await stripe.invoices.pay(finalized.id, {
          payment_method: defaultPaymentMethod,
        })
      } catch (payError) {
        logger.error('Failed to auto-pay threshold overage invoice', {
          error: payError,
          invoiceId: finalized.id,
        })
      }
    }
  }

  return invoice.id || ''
}

export async function checkAndBillOverageThreshold(userId: string): Promise<void> {
  try {
    const threshold = OVERAGE_THRESHOLD

    const userSubscription = await getHighestPrioritySubscription(userId)

    if (!userSubscription || userSubscription.status !== 'active') {
      logger.debug('No active subscription for threshold billing', { userId })
      return
    }

    if (
      !userSubscription.plan ||
      userSubscription.plan === 'free' ||
      userSubscription.plan === 'enterprise'
    ) {
      return
    }

    if (userSubscription.plan === 'team') {
      logger.debug('Team plan detected - triggering org-level threshold billing', {
        userId,
        organizationId: userSubscription.referenceId,
      })
      await checkAndBillOrganizationOverageThreshold(userSubscription.referenceId)
      return
    }

    await db.transaction(async (tx) => {
      const statsRecords = await tx
        .select()
        .from(userStats)
        .where(eq(userStats.userId, userId))
        .for('update')
        .limit(1)

      if (statsRecords.length === 0) {
        logger.warn('User stats not found for threshold billing', { userId })
        return
      }

      const stats = statsRecords[0]

      const currentOverage = await calculateSubscriptionOverage({
        id: userSubscription.id,
        plan: userSubscription.plan,
        referenceId: userSubscription.referenceId,
        seats: userSubscription.seats,
      })
      const billedOverageThisPeriod = parseDecimal(stats.billedOverageThisPeriod)
      const unbilledOverage = Math.max(0, currentOverage - billedOverageThisPeriod)

      logger.debug('Threshold billing check', {
        userId,
        plan: userSubscription.plan,
        currentOverage,
        billedOverageThisPeriod,
        unbilledOverage,
        threshold,
      })

      if (unbilledOverage < threshold) {
        return
      }

      // Apply credits to reduce the amount to bill (use stats from locked row)
      let amountToBill = unbilledOverage
      let creditsApplied = 0
      const creditBalance = Number.parseFloat(stats.creditBalance?.toString() || '0')

      if (creditBalance > 0) {
        creditsApplied = Math.min(creditBalance, amountToBill)
        // Update credit balance within the transaction
        await tx
          .update(userStats)
          .set({
            creditBalance: sql`GREATEST(0, ${userStats.creditBalance} - ${creditsApplied})`,
          })
          .where(eq(userStats.userId, userId))
        amountToBill = amountToBill - creditsApplied

        logger.info('Applied credits to reduce threshold overage', {
          userId,
          creditBalance,
          creditsApplied,
          remainingToBill: amountToBill,
        })
      }

      // If credits covered everything, just update the billed amount but don't create invoice
      if (amountToBill <= 0) {
        await tx
          .update(userStats)
          .set({
            billedOverageThisPeriod: sql`${userStats.billedOverageThisPeriod} + ${unbilledOverage}`,
          })
          .where(eq(userStats.userId, userId))

        logger.info('Credits fully covered threshold overage', {
          userId,
          creditsApplied,
          unbilledOverage,
        })
        return
      }

      const stripeSubscriptionId = userSubscription.stripeSubscriptionId
      if (!stripeSubscriptionId) {
        logger.error('No Stripe subscription ID found', { userId })
        return
      }

      const stripe = requireStripeClient()
      const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)
      const customerId =
        typeof stripeSubscription.customer === 'string'
          ? stripeSubscription.customer
          : stripeSubscription.customer.id

      const periodEnd = userSubscription.periodEnd
        ? Math.floor(userSubscription.periodEnd.getTime() / 1000)
        : Math.floor(Date.now() / 1000)
      const billingPeriod = new Date(periodEnd * 1000).toISOString().slice(0, 7)

      const amountCents = Math.round(amountToBill * 100)
      const totalOverageCents = Math.round(currentOverage * 100)
      const idempotencyKey = `threshold-overage:${customerId}:${stripeSubscriptionId}:${billingPeriod}:${totalOverageCents}:${amountCents}`

      logger.info('Creating threshold overage invoice', {
        userId,
        plan: userSubscription.plan,
        amountToBill,
        billingPeriod,
        idempotencyKey,
      })

      const cents = amountCents

      const invoiceId = await createAndFinalizeOverageInvoice(stripe, {
        customerId,
        stripeSubscriptionId,
        amountCents: cents,
        description: `Threshold overage billing – ${billingPeriod}`,
        itemDescription: `Usage overage ($${amountToBill.toFixed(2)})`,
        metadata: {
          type: 'overage_threshold_billing',
          userId,
          subscriptionId: stripeSubscriptionId,
          billingPeriod,
          totalOverageAtTimeOfBilling: currentOverage.toFixed(2),
        },
        idempotencyKey,
      })

      await tx
        .update(userStats)
        .set({
          billedOverageThisPeriod: sql`${userStats.billedOverageThisPeriod} + ${unbilledOverage}`,
        })
        .where(eq(userStats.userId, userId))

      logger.info('Successfully created and finalized threshold overage invoice', {
        userId,
        creditsApplied,
        amountBilled: amountToBill,
        totalProcessed: unbilledOverage,
        invoiceId,
        newBilledTotal: billedOverageThisPeriod + unbilledOverage,
      })
    })
  } catch (error) {
    logger.error('Error in threshold billing check', {
      userId,
      error,
    })
  }
}

export async function checkAndBillOrganizationOverageThreshold(
  organizationId: string
): Promise<void> {
  logger.info('=== ENTERED checkAndBillOrganizationOverageThreshold ===', { organizationId })

  try {
    const threshold = OVERAGE_THRESHOLD

    logger.debug('Starting organization threshold billing check', { organizationId, threshold })

    const orgSubscriptions = await db
      .select()
      .from(subscription)
      .where(and(eq(subscription.referenceId, organizationId), eq(subscription.status, 'active')))
      .limit(1)

    if (orgSubscriptions.length === 0) {
      logger.debug('No active subscription for organization', { organizationId })
      return
    }

    const orgSubscription = orgSubscriptions[0]
    logger.debug('Found organization subscription', {
      organizationId,
      plan: orgSubscription.plan,
      seats: orgSubscription.seats,
      stripeSubscriptionId: orgSubscription.stripeSubscriptionId,
    })

    if (orgSubscription.plan !== 'team') {
      logger.debug('Organization plan is not team, skipping', {
        organizationId,
        plan: orgSubscription.plan,
      })
      return
    }

    const members = await db
      .select({ userId: member.userId, role: member.role })
      .from(member)
      .where(eq(member.organizationId, organizationId))

    logger.debug('Found organization members', {
      organizationId,
      memberCount: members.length,
      members: members.map((m) => ({ userId: m.userId, role: m.role })),
    })

    if (members.length === 0) {
      logger.warn('No members found for organization', { organizationId })
      return
    }

    const owner = members.find((m) => m.role === 'owner')
    if (!owner) {
      logger.error('No owner found for organization', { organizationId })
      return
    }

    logger.debug('Found organization owner, starting transaction', {
      organizationId,
      ownerId: owner.userId,
    })

    await db.transaction(async (tx) => {
      // Lock both owner stats and organization rows
      const ownerStatsLock = await tx
        .select()
        .from(userStats)
        .where(eq(userStats.userId, owner.userId))
        .for('update')
        .limit(1)

      const orgLock = await tx
        .select()
        .from(organization)
        .where(eq(organization.id, organizationId))
        .for('update')
        .limit(1)

      if (ownerStatsLock.length === 0) {
        logger.error('Owner stats not found', { organizationId, ownerId: owner.userId })
        return
      }

      if (orgLock.length === 0) {
        logger.error('Organization not found', { organizationId })
        return
      }

      let totalTeamUsage = parseDecimal(ownerStatsLock[0].currentPeriodCost)
      const totalBilledOverage = parseDecimal(ownerStatsLock[0].billedOverageThisPeriod)
      const orgCreditBalance = Number.parseFloat(orgLock[0].creditBalance?.toString() || '0')

      const nonOwnerIds = members.filter((m) => m.userId !== owner.userId).map((m) => m.userId)

      if (nonOwnerIds.length > 0) {
        const memberStatsRows = await tx
          .select({
            userId: userStats.userId,
            currentPeriodCost: userStats.currentPeriodCost,
          })
          .from(userStats)
          .where(inArray(userStats.userId, nonOwnerIds))

        for (const stats of memberStatsRows) {
          totalTeamUsage += parseDecimal(stats.currentPeriodCost)
        }
      }

      const { basePrice: basePricePerSeat } = getPlanPricing(orgSubscription.plan)
      const basePrice = basePricePerSeat * (orgSubscription.seats ?? 0)
      const currentOverage = Math.max(0, totalTeamUsage - basePrice)
      const unbilledOverage = Math.max(0, currentOverage - totalBilledOverage)

      logger.debug('Organization threshold billing check', {
        organizationId,
        totalTeamUsage,
        basePrice,
        currentOverage,
        totalBilledOverage,
        unbilledOverage,
        threshold,
      })

      if (unbilledOverage < threshold) {
        return
      }

      // Apply credits to reduce the amount to bill (use locked org's balance)
      let amountToBill = unbilledOverage
      let creditsApplied = 0

      if (orgCreditBalance > 0) {
        creditsApplied = Math.min(orgCreditBalance, amountToBill)
        // Update credit balance within the transaction
        await tx
          .update(organization)
          .set({
            creditBalance: sql`GREATEST(0, ${organization.creditBalance} - ${creditsApplied})`,
          })
          .where(eq(organization.id, organizationId))
        amountToBill = amountToBill - creditsApplied

        logger.info('Applied org credits to reduce threshold overage', {
          organizationId,
          creditBalance: orgCreditBalance,
          creditsApplied,
          remainingToBill: amountToBill,
        })
      }

      // If credits covered everything, just update the billed amount but don't create invoice
      if (amountToBill <= 0) {
        await tx
          .update(userStats)
          .set({
            billedOverageThisPeriod: sql`${userStats.billedOverageThisPeriod} + ${unbilledOverage}`,
          })
          .where(eq(userStats.userId, owner.userId))

        logger.info('Credits fully covered org threshold overage', {
          organizationId,
          creditsApplied,
          unbilledOverage,
        })
        return
      }

      const stripeSubscriptionId = orgSubscription.stripeSubscriptionId
      if (!stripeSubscriptionId) {
        logger.error('No Stripe subscription ID for organization', { organizationId })
        return
      }

      const stripe = requireStripeClient()
      const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)
      const customerId =
        typeof stripeSubscription.customer === 'string'
          ? stripeSubscription.customer
          : stripeSubscription.customer.id

      const periodEnd = orgSubscription.periodEnd
        ? Math.floor(orgSubscription.periodEnd.getTime() / 1000)
        : Math.floor(Date.now() / 1000)
      const billingPeriod = new Date(periodEnd * 1000).toISOString().slice(0, 7)
      const amountCents = Math.round(amountToBill * 100)
      const totalOverageCents = Math.round(currentOverage * 100)

      const idempotencyKey = `threshold-overage-org:${customerId}:${stripeSubscriptionId}:${billingPeriod}:${totalOverageCents}:${amountCents}`

      logger.info('Creating organization threshold overage invoice', {
        organizationId,
        amountToBill,
        creditsApplied,
        billingPeriod,
      })

      const cents = amountCents

      const invoiceId = await createAndFinalizeOverageInvoice(stripe, {
        customerId,
        stripeSubscriptionId,
        amountCents: cents,
        description: `Team threshold overage billing – ${billingPeriod}`,
        itemDescription: `Team usage overage ($${amountToBill.toFixed(2)})`,
        metadata: {
          type: 'overage_threshold_billing_org',
          organizationId,
          subscriptionId: stripeSubscriptionId,
          billingPeriod,
          totalOverageAtTimeOfBilling: currentOverage.toFixed(2),
        },
        idempotencyKey,
      })

      await tx
        .update(userStats)
        .set({
          billedOverageThisPeriod: sql`${userStats.billedOverageThisPeriod} + ${unbilledOverage}`,
        })
        .where(eq(userStats.userId, owner.userId))

      logger.info('Successfully created and finalized organization threshold overage invoice', {
        organizationId,
        ownerId: owner.userId,
        creditsApplied,
        amountBilled: amountToBill,
        totalProcessed: unbilledOverage,
        invoiceId,
      })
    })
  } catch (error) {
    logger.error('Error in organization threshold billing', {
      organizationId,
      error,
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: usage-monitor.ts]---
Location: sim-main/apps/sim/lib/billing/calculations/usage-monitor.ts

```typescript
import { db } from '@sim/db'
import { member, organization, userStats } from '@sim/db/schema'
import { and, eq, inArray } from 'drizzle-orm'
import { getUserUsageLimit } from '@/lib/billing/core/usage'
import { isBillingEnabled } from '@/lib/core/config/feature-flags'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('UsageMonitor')

const WARNING_THRESHOLD = 80

interface UsageData {
  percentUsed: number
  isWarning: boolean
  isExceeded: boolean
  currentUsage: number
  limit: number
}

/**
 * Checks a user's cost usage against their subscription plan limit
 * and returns usage information including whether they're approaching the limit
 */
export async function checkUsageStatus(userId: string): Promise<UsageData> {
  try {
    // If billing is disabled, always return permissive limits
    if (!isBillingEnabled) {
      // Get actual usage from the database for display purposes
      const statsRecords = await db.select().from(userStats).where(eq(userStats.userId, userId))
      const currentUsage =
        statsRecords.length > 0
          ? Number.parseFloat(statsRecords[0].currentPeriodCost?.toString())
          : 0

      return {
        percentUsed: Math.min((currentUsage / 1000) * 100, 100),
        isWarning: false,
        isExceeded: false,
        currentUsage,
        limit: 1000,
      }
    }

    // Get usage limit from user_stats (per-user cap)
    const limit = await getUserUsageLimit(userId)
    logger.info('Using stored usage limit', { userId, limit })

    // Get actual usage from the database
    const statsRecords = await db.select().from(userStats).where(eq(userStats.userId, userId))

    // If no stats record exists, create a default one
    if (statsRecords.length === 0) {
      logger.info('No usage stats found for user', { userId, limit })

      return {
        percentUsed: 0,
        isWarning: false,
        isExceeded: false,
        currentUsage: 0,
        limit,
      }
    }

    // Get the current period cost from the user stats (use currentPeriodCost if available, fallback to totalCost)
    const currentUsage = Number.parseFloat(
      statsRecords[0].currentPeriodCost?.toString() || statsRecords[0].totalCost.toString()
    )

    // Calculate percentage used
    const percentUsed = Math.min((currentUsage / limit) * 100, 100)

    // Check org-level cap for team/enterprise pooled usage
    let isExceeded = currentUsage >= limit
    let isWarning = percentUsed >= WARNING_THRESHOLD && percentUsed < 100
    try {
      const memberships = await db
        .select({ organizationId: member.organizationId })
        .from(member)
        .where(eq(member.userId, userId))
      if (memberships.length > 0) {
        for (const m of memberships) {
          const orgRows = await db
            .select({ id: organization.id, orgUsageLimit: organization.orgUsageLimit })
            .from(organization)
            .where(eq(organization.id, m.organizationId))
            .limit(1)
          if (orgRows.length) {
            const org = orgRows[0]
            // Sum pooled usage
            const teamMembers = await db
              .select({ userId: member.userId })
              .from(member)
              .where(eq(member.organizationId, org.id))

            // Get all team member usage in a single query to avoid N+1
            let pooledUsage = 0
            if (teamMembers.length > 0) {
              const memberIds = teamMembers.map((tm) => tm.userId)
              const allMemberStats = await db
                .select({ current: userStats.currentPeriodCost, total: userStats.totalCost })
                .from(userStats)
                .where(inArray(userStats.userId, memberIds))

              for (const stats of allMemberStats) {
                pooledUsage += Number.parseFloat(
                  stats.current?.toString() || stats.total.toString()
                )
              }
            }
            // Determine org cap from orgUsageLimit (should always be set for team/enterprise)
            const orgCap = org.orgUsageLimit ? Number.parseFloat(String(org.orgUsageLimit)) : 0
            if (!orgCap || Number.isNaN(orgCap)) {
              logger.warn('Organization missing usage limit', { orgId: org.id })
            }
            if (pooledUsage >= orgCap) {
              isExceeded = true
              isWarning = false
              break
            }
          }
        }
      }
    } catch (error) {
      logger.warn('Error checking organization usage limits', { error, userId })
    }

    logger.info('Final usage statistics', {
      userId,
      currentUsage,
      limit,
      percentUsed,
      isWarning,
      isExceeded,
    })

    return {
      percentUsed,
      isWarning,
      isExceeded,
      currentUsage,
      limit,
    }
  } catch (error) {
    logger.error('Error checking usage status', {
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
      userId,
    })

    // Block execution if we can't determine usage status
    logger.error('Cannot determine usage status - blocking execution', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    })

    return {
      percentUsed: 100,
      isWarning: false,
      isExceeded: true, // Block execution when we can't determine status
      currentUsage: 0,
      limit: 0, // Zero limit forces blocking
    }
  }
}

/**
 * Displays a notification to the user when they're approaching their usage limit
 * Can be called on app startup or before executing actions that might incur costs
 */
export async function checkAndNotifyUsage(userId: string): Promise<void> {
  try {
    // Skip usage notifications if billing is disabled
    if (!isBillingEnabled) {
      return
    }

    const usageData = await checkUsageStatus(userId)

    if (usageData.isExceeded) {
      // User has exceeded their limit
      logger.warn('User has exceeded usage limits', {
        userId,
        usage: usageData.currentUsage,
        limit: usageData.limit,
      })

      // Dispatch event to show a UI notification
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('usage-exceeded', {
            detail: { usageData },
          })
        )
      }
    } else if (usageData.isWarning) {
      // User is approaching their limit
      logger.info('User approaching usage limits', {
        userId,
        usage: usageData.currentUsage,
        limit: usageData.limit,
        percent: usageData.percentUsed,
      })

      // Dispatch event to show a UI notification
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('usage-warning', {
            detail: { usageData },
          })
        )

        // Optionally open the subscription tab in settings
        window.dispatchEvent(
          new CustomEvent('open-settings', {
            detail: { tab: 'subscription' },
          })
        )
      }
    }
  } catch (error) {
    logger.error('Error in usage notification system', { error, userId })
  }
}

/**
 * Server-side function to check if a user has exceeded their usage limits
 * For use in API routes, webhooks, and scheduled executions
 *
 * @param userId The ID of the user to check
 * @returns An object containing the exceeded status and usage details
 */
export async function checkServerSideUsageLimits(userId: string): Promise<{
  isExceeded: boolean
  currentUsage: number
  limit: number
  message?: string
}> {
  try {
    if (!isBillingEnabled) {
      return {
        isExceeded: false,
        currentUsage: 0,
        limit: 99999,
      }
    }

    logger.info('Server-side checking usage limits for user', { userId })

    // Check user's own blocked status
    const stats = await db
      .select({
        blocked: userStats.billingBlocked,
        blockedReason: userStats.billingBlockedReason,
        current: userStats.currentPeriodCost,
        total: userStats.totalCost,
      })
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1)

    const currentUsage =
      stats.length > 0
        ? Number.parseFloat(stats[0].current?.toString() || stats[0].total.toString())
        : 0

    if (stats.length > 0 && stats[0].blocked) {
      const message =
        stats[0].blockedReason === 'dispute'
          ? 'Account frozen. Please contact support to resolve this issue.'
          : 'Billing issue detected. Please update your payment method to continue.'
      return {
        isExceeded: true,
        currentUsage,
        limit: 0,
        message,
      }
    }

    // Check if user is in an org where the owner is blocked
    const memberships = await db
      .select({ organizationId: member.organizationId })
      .from(member)
      .where(eq(member.userId, userId))

    for (const m of memberships) {
      // Find the owner of this org
      const owners = await db
        .select({ userId: member.userId })
        .from(member)
        .where(and(eq(member.organizationId, m.organizationId), eq(member.role, 'owner')))
        .limit(1)

      if (owners.length > 0) {
        const ownerStats = await db
          .select({
            blocked: userStats.billingBlocked,
            blockedReason: userStats.billingBlockedReason,
          })
          .from(userStats)
          .where(eq(userStats.userId, owners[0].userId))
          .limit(1)

        if (ownerStats.length > 0 && ownerStats[0].blocked) {
          const message =
            ownerStats[0].blockedReason === 'dispute'
              ? 'Organization account frozen. Please contact support to resolve this issue.'
              : 'Organization billing issue. Please contact your organization owner.'
          return {
            isExceeded: true,
            currentUsage,
            limit: 0,
            message,
          }
        }
      }
    }

    const usageData = await checkUsageStatus(userId)

    return {
      isExceeded: usageData.isExceeded,
      currentUsage: usageData.currentUsage,
      limit: usageData.limit,
      message: usageData.isExceeded
        ? `Usage limit exceeded: ${usageData.currentUsage?.toFixed(2) || 0}$ used of ${usageData.limit?.toFixed(2) || 0}$ limit. Please upgrade your plan to continue.`
        : undefined,
    }
  } catch (error) {
    logger.error('Error in server-side usage limit check', {
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
      userId,
    })

    logger.error('Cannot determine usage limits - blocking execution', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    })

    return {
      isExceeded: true, // Block execution when we can't determine limits
      currentUsage: 0,
      limit: 0, // Zero limit forces blocking
      message:
        error instanceof Error && error.message.includes('No user stats record found')
          ? 'User account not properly initialized. Please contact support.'
          : 'Unable to determine usage limits. Execution blocked for security. Please contact support.',
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/lib/billing/client/index.ts

```typescript
export type {
  BillingStatus,
  SubscriptionData,
  UsageData,
  UsageLimitData,
} from './types'
export {
  canUpgrade,
  getBillingStatus,
  getDaysRemainingInPeriod,
  getRemainingBudget,
  getSubscriptionStatus,
  getUsage,
  isAtLeastPro,
  isAtLeastTeam,
} from './utils'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/lib/billing/client/types.ts

```typescript
export interface UsageData {
  current: number
  limit: number
  percentUsed: number
  isWarning: boolean
  isExceeded: boolean
  billingPeriodStart: Date | null
  billingPeriodEnd: Date | null
  lastPeriodCost: number
  lastPeriodCopilotCost?: number
  copilotCost?: number
}

export interface UsageLimitData {
  currentLimit: number
  canEdit: boolean
  minimumLimit: number
  plan: string
  setBy?: string
  updatedAt?: Date
}

export interface SubscriptionData {
  isPaid: boolean
  isPro: boolean
  isTeam: boolean
  isEnterprise: boolean
  plan: string
  status: string | null
  seats: number | null
  metadata: any | null
  stripeSubscriptionId: string | null
  periodEnd: Date | null
  cancelAtPeriodEnd?: boolean
  usage: UsageData
  billingBlocked?: boolean
}

export type BillingStatus = 'unknown' | 'ok' | 'warning' | 'exceeded' | 'blocked'

export interface SubscriptionStore {
  subscriptionData: SubscriptionData | null
  usageLimitData: UsageLimitData | null
  isLoading: boolean
  error: string | null
  lastFetched: number | null
  loadSubscriptionData: () => Promise<SubscriptionData | null>
  loadUsageLimitData: () => Promise<UsageLimitData | null>
  loadData: () => Promise<{
    subscriptionData: SubscriptionData | null
    usageLimitData: UsageLimitData | null
  }>
  updateUsageLimit: (newLimit: number) => Promise<{ success: boolean; error?: string }>
  refresh: () => Promise<void>
  clearError: () => void
  reset: () => void
  getSubscriptionStatus: () => {
    isPaid: boolean
    isPro: boolean
    isTeam: boolean
    isEnterprise: boolean
    isFree: boolean
    plan: string
    status: string | null
    seats: number | null
    metadata: any | null
  }
  getUsage: () => UsageData
  getBillingStatus: () => BillingStatus
  getRemainingBudget: () => number
  getDaysRemainingInPeriod: () => number | null
  isAtLeastPro: () => boolean
  isAtLeastTeam: () => boolean
  canUpgrade: () => boolean
}
```

--------------------------------------------------------------------------------

---[FILE: upgrade.ts]---
Location: sim-main/apps/sim/lib/billing/client/upgrade.ts
Signals: React

```typescript
import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { client, useSession, useSubscription } from '@/lib/auth/auth-client'
import { createLogger } from '@/lib/logs/console/logger'
import { organizationKeys } from '@/hooks/queries/organization'

const logger = createLogger('SubscriptionUpgrade')

type TargetPlan = 'pro' | 'team'

const CONSTANTS = {
  INITIAL_TEAM_SEATS: 1,
} as const

export function useSubscriptionUpgrade() {
  const { data: session } = useSession()
  const betterAuthSubscription = useSubscription()
  const queryClient = useQueryClient()

  const handleUpgrade = useCallback(
    async (targetPlan: TargetPlan) => {
      const userId = session?.user?.id
      if (!userId) {
        throw new Error('User not authenticated')
      }

      let currentSubscriptionId: string | undefined
      try {
        const listResult = await client.subscription.list()
        const activePersonalSub = listResult.data?.find(
          (sub: any) => sub.status === 'active' && sub.referenceId === userId
        )
        currentSubscriptionId = activePersonalSub?.id
      } catch (_e) {
        currentSubscriptionId = undefined
      }

      let referenceId = userId

      if (targetPlan === 'team') {
        try {
          const orgsResponse = await fetch('/api/organizations')
          if (!orgsResponse.ok) {
            throw new Error('Failed to check organization status')
          }

          const orgsData = await orgsResponse.json()
          const existingOrg = orgsData.organizations?.find(
            (org: any) => org.role === 'owner' || org.role === 'admin'
          )

          if (existingOrg) {
            logger.info('Using existing organization for team plan upgrade', {
              userId,
              organizationId: existingOrg.id,
            })
            referenceId = existingOrg.id

            try {
              await client.organization.setActive({ organizationId: referenceId })
              logger.info('Set organization as active', { organizationId: referenceId })
            } catch (error) {
              logger.warn('Failed to set organization as active, proceeding with upgrade', {
                organizationId: referenceId,
                error: error instanceof Error ? error.message : 'Unknown error',
              })
            }
          } else if (orgsData.isMemberOfAnyOrg) {
            throw new Error(
              'You are already a member of an organization. Please leave it or ask an admin to upgrade.'
            )
          } else {
            logger.info('Will create organization after payment succeeds', { userId })
          }
        } catch (error) {
          logger.error('Failed to prepare for team plan upgrade', error)
          throw error instanceof Error
            ? error
            : new Error('Failed to prepare team workspace. Please try again or contact support.')
        }
      }

      const currentUrl = `${window.location.origin}${window.location.pathname}`

      try {
        const upgradeParams = {
          plan: targetPlan,
          referenceId,
          successUrl: currentUrl,
          cancelUrl: currentUrl,
          ...(targetPlan === 'team' && { seats: CONSTANTS.INITIAL_TEAM_SEATS }),
        } as const

        const finalParams = currentSubscriptionId
          ? { ...upgradeParams, subscriptionId: currentSubscriptionId }
          : upgradeParams

        logger.info(
          currentSubscriptionId ? 'Upgrading existing subscription' : 'Creating new subscription',
          { targetPlan, currentSubscriptionId, referenceId }
        )

        await betterAuthSubscription.upgrade(finalParams)

        if (targetPlan === 'team' && currentSubscriptionId && referenceId !== userId) {
          try {
            logger.info('Transferring subscription to organization after upgrade', {
              subscriptionId: currentSubscriptionId,
              organizationId: referenceId,
            })

            const transferResponse = await fetch(
              `/api/users/me/subscription/${currentSubscriptionId}/transfer`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ organizationId: referenceId }),
              }
            )

            if (!transferResponse.ok) {
              const text = await transferResponse.text()
              logger.error('Failed to transfer subscription to organization', {
                subscriptionId: currentSubscriptionId,
                organizationId: referenceId,
                error: text,
              })
            } else {
              logger.info('Successfully transferred subscription to organization', {
                subscriptionId: currentSubscriptionId,
                organizationId: referenceId,
              })
            }
          } catch (error) {
            logger.error('Error transferring subscription after upgrade', error)
          }
        }

        if (targetPlan === 'team') {
          try {
            await queryClient.invalidateQueries({ queryKey: organizationKeys.lists() })
            logger.info('Refreshed organization data after team upgrade')
          } catch (error) {
            logger.warn('Failed to refresh organization data after upgrade', error)
          }
        }

        logger.info('Subscription upgrade completed successfully', { targetPlan, referenceId })
      } catch (error) {
        logger.error('Failed to initiate subscription upgrade:', error)

        if (error instanceof Error) {
          logger.error('Detailed error:', {
            message: error.message,
            stack: error.stack,
            cause: error.cause,
          })
        }

        throw new Error(
          `Failed to upgrade subscription: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
      }
    },
    [session?.user?.id, betterAuthSubscription, queryClient]
  )

  return { handleUpgrade }
}
```

--------------------------------------------------------------------------------

---[FILE: usage-visualization.ts]---
Location: sim-main/apps/sim/lib/billing/client/usage-visualization.ts

```typescript
/**
 * Shared utilities for consistent usage visualization across the application.
 *
 * This module provides a single source of truth for how usage metrics are
 * displayed visually through "pills" or progress indicators.
 */

/**
 * Number of pills to display in usage indicators.
 *
 * Using 8 pills provides:
 * - 12.5% granularity per pill
 * - Good balance between precision and visual clarity
 * - Consistent representation across panel and settings
 */
export const USAGE_PILL_COUNT = 8

/**
 * Color values for usage pill states
 */
export const USAGE_PILL_COLORS = {
  /** Unfilled pill color (gray) */
  UNFILLED: '#414141',
  /** Normal filled pill color (blue) */
  FILLED: '#34B5FF',
  /** Warning/limit reached pill color (red) */
  AT_LIMIT: '#ef4444',
} as const

/**
 * Calculate the number of filled pills based on usage percentage.
 *
 * Uses Math.ceil() to ensure even minimal usage (0.01%) shows visual feedback.
 * This provides better UX by making it clear that there is some usage, even if small.
 *
 * @param percentUsed - The usage percentage (0-100). Can be a decimal (e.g., 0.315 for 0.315%)
 * @returns Number of pills that should be filled (0 to USAGE_PILL_COUNT)
 *
 * @example
 * calculateFilledPills(0.315)  // Returns 1 (shows feedback for 0.315% usage)
 * calculateFilledPills(50)     // Returns 4 (50% of 8 pills)
 * calculateFilledPills(100)    // Returns 8 (completely filled)
 * calculateFilledPills(150)    // Returns 8 (clamped to maximum)
 */
export function calculateFilledPills(percentUsed: number): number {
  // Clamp percentage to valid range [0, 100]
  const safePercent = Math.min(Math.max(percentUsed, 0), 100)

  // Calculate filled pills using ceil to show feedback for any usage
  return Math.ceil((safePercent / 100) * USAGE_PILL_COUNT)
}

/**
 * Determine if usage has reached the limit (all pills filled).
 *
 * @param percentUsed - The usage percentage (0-100)
 * @returns true if all pills should be filled (at or over limit)
 */
export function isUsageAtLimit(percentUsed: number): boolean {
  return calculateFilledPills(percentUsed) >= USAGE_PILL_COUNT
}

/**
 * Get the appropriate color for a pill based on its state.
 *
 * @param isFilled - Whether this pill should be filled
 * @param isAtLimit - Whether usage has reached the limit
 * @returns Hex color string
 */
export function getPillColor(isFilled: boolean, isAtLimit: boolean): string {
  if (!isFilled) return USAGE_PILL_COLORS.UNFILLED
  if (isAtLimit) return USAGE_PILL_COLORS.AT_LIMIT
  return USAGE_PILL_COLORS.FILLED
}

/**
 * Generate an array of pill states for rendering.
 *
 * @param percentUsed - The usage percentage (0-100)
 * @returns Array of pill states with colors
 *
 * @example
 * const pills = generatePillStates(50)
 * pills.forEach((pill, index) => (
 *   <Pill key={index} color={pill.color} filled={pill.filled} />
 * ))
 */
export function generatePillStates(percentUsed: number): Array<{
  filled: boolean
  color: string
  index: number
}> {
  const filledCount = calculateFilledPills(percentUsed)
  const atLimit = isUsageAtLimit(percentUsed)

  return Array.from({ length: USAGE_PILL_COUNT }, (_, index) => {
    const filled = index < filledCount
    return {
      filled,
      color: getPillColor(filled, atLimit),
      index,
    }
  })
}
```

--------------------------------------------------------------------------------

````
