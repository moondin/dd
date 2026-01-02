---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 541
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 541 of 933)

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

---[FILE: purchase.ts]---
Location: sim-main/apps/sim/lib/billing/credits/purchase.ts

```typescript
import { db } from '@sim/db'
import { organization, userStats } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import type Stripe from 'stripe'
import { getPlanPricing } from '@/lib/billing/core/billing'
import { getHighestPrioritySubscription } from '@/lib/billing/core/subscription'
import { canPurchaseCredits, isOrgAdmin } from '@/lib/billing/credits/balance'
import { requireStripeClient } from '@/lib/billing/stripe-client'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('CreditPurchase')

/**
 * Sets usage limit to planBase + creditBalance.
 * This ensures users can use their plan's included amount plus any prepaid credits.
 */
export async function setUsageLimitForCredits(
  entityType: 'user' | 'organization',
  entityId: string,
  plan: string,
  seats: number | null,
  creditBalance: number
): Promise<void> {
  try {
    const { basePrice } = getPlanPricing(plan)
    const planBase =
      entityType === 'organization' ? Number(basePrice) * (seats || 1) : Number(basePrice)
    const creditBalanceNum = Number(creditBalance)
    const newLimit = planBase + creditBalanceNum

    if (entityType === 'organization') {
      const orgRows = await db
        .select({ orgUsageLimit: organization.orgUsageLimit })
        .from(organization)
        .where(eq(organization.id, entityId))
        .limit(1)

      const currentLimit =
        orgRows.length > 0 ? Number.parseFloat(orgRows[0].orgUsageLimit || '0') : 0

      if (newLimit > currentLimit) {
        await db
          .update(organization)
          .set({ orgUsageLimit: newLimit.toString() })
          .where(eq(organization.id, entityId))

        logger.info('Set org usage limit to planBase + credits', {
          organizationId: entityId,
          plan,
          seats,
          planBase,
          creditBalance,
          previousLimit: currentLimit,
          newLimit,
        })
      }
    } else {
      const userStatsRows = await db
        .select({ currentUsageLimit: userStats.currentUsageLimit })
        .from(userStats)
        .where(eq(userStats.userId, entityId))
        .limit(1)

      const currentLimit =
        userStatsRows.length > 0 ? Number.parseFloat(userStatsRows[0].currentUsageLimit || '0') : 0

      if (newLimit > currentLimit) {
        await db
          .update(userStats)
          .set({ currentUsageLimit: newLimit.toString() })
          .where(eq(userStats.userId, entityId))

        logger.info('Set user usage limit to planBase + credits', {
          userId: entityId,
          plan,
          planBase,
          creditBalance,
          previousLimit: currentLimit,
          newLimit,
        })
      }
    }
  } catch (error) {
    logger.error('Failed to set usage limit for credits', { entityType, entityId, error })
  }
}

export interface PurchaseCreditsParams {
  userId: string
  amountDollars: number
  requestId: string
}

export interface PurchaseResult {
  success: boolean
  error?: string
}

function getPaymentMethodId(
  pm: string | Stripe.PaymentMethod | null | undefined
): string | undefined {
  return typeof pm === 'string' ? pm : pm?.id
}

export async function purchaseCredits(params: PurchaseCreditsParams): Promise<PurchaseResult> {
  const { userId, amountDollars, requestId } = params

  if (amountDollars < 10 || amountDollars > 1000) {
    return { success: false, error: 'Amount must be between $10 and $1000' }
  }

  const canPurchase = await canPurchaseCredits(userId)
  if (!canPurchase) {
    return { success: false, error: 'Only Pro and Team users can purchase credits' }
  }

  const subscription = await getHighestPrioritySubscription(userId)
  if (!subscription || !subscription.stripeSubscriptionId) {
    return { success: false, error: 'No active subscription found' }
  }

  // Enterprise users must contact support
  if (subscription.plan === 'enterprise') {
    return { success: false, error: 'Enterprise users must contact support to purchase credits' }
  }

  let entityType: 'user' | 'organization' = 'user'
  let entityId = userId

  if (subscription.plan === 'team') {
    const isAdmin = await isOrgAdmin(userId, subscription.referenceId)
    if (!isAdmin) {
      return { success: false, error: 'Only organization owners and admins can purchase credits' }
    }
    entityType = 'organization'
    entityId = subscription.referenceId
  }

  try {
    const stripe = requireStripeClient()

    // Get customer ID and payment method from subscription
    const stripeSub = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId)
    const customerId =
      typeof stripeSub.customer === 'string' ? stripeSub.customer : stripeSub.customer.id

    // Get default payment method
    let defaultPaymentMethod: string | undefined
    const subPm = getPaymentMethodId(stripeSub.default_payment_method)
    if (subPm) {
      defaultPaymentMethod = subPm
    } else {
      const customer = await stripe.customers.retrieve(customerId)
      if (customer && !('deleted' in customer)) {
        defaultPaymentMethod = getPaymentMethodId(customer.invoice_settings?.default_payment_method)
      }
    }

    if (!defaultPaymentMethod) {
      return {
        success: false,
        error: 'No payment method on file. Please update your billing info.',
      }
    }

    const amountCents = Math.round(amountDollars * 100)
    const idempotencyKey = `credit-purchase:${requestId}`

    const creditMetadata = {
      type: 'credit_purchase',
      entityType,
      entityId,
      amountDollars: amountDollars.toString(),
      purchasedBy: userId,
    }

    // Create invoice
    const invoice = await stripe.invoices.create(
      {
        customer: customerId,
        collection_method: 'charge_automatically',
        auto_advance: false,
        description: `Credit purchase - $${amountDollars}`,
        metadata: creditMetadata,
        default_payment_method: defaultPaymentMethod,
      },
      { idempotencyKey: `${idempotencyKey}-invoice` }
    )

    // Add line item
    await stripe.invoiceItems.create(
      {
        customer: customerId,
        invoice: invoice.id,
        amount: amountCents,
        currency: 'usd',
        description: `Prepaid credits ($${amountDollars})`,
        metadata: creditMetadata,
      },
      { idempotencyKey }
    )

    // Finalize and pay
    if (!invoice.id) {
      return { success: false, error: 'Failed to create invoice' }
    }

    const finalized = await stripe.invoices.finalizeInvoice(invoice.id)

    if (finalized.status === 'open' && finalized.id) {
      await stripe.invoices.pay(finalized.id, {
        payment_method: defaultPaymentMethod,
      })
      // Credits are added via webhook (handleInvoicePaymentSucceeded) after payment confirmation
    }

    logger.info('Credit purchase invoice created and paid', {
      invoiceId: invoice.id,
      entityType,
      entityId,
      amountDollars,
      purchasedBy: userId,
    })

    return { success: true }
  } catch (error) {
    logger.error('Failed to purchase credits', { error, userId, amountDollars })
    const message = error instanceof Error ? error.message : 'Failed to process payment'
    return { success: false, error: message }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: membership.ts]---
Location: sim-main/apps/sim/lib/billing/organizations/membership.ts

```typescript
/**
 * Organization Membership Management
 *
 * Shared helpers for adding and removing users from organizations.
 * Used by both regular routes and admin routes to ensure consistent business logic.
 */

import { randomUUID } from 'crypto'
import { db } from '@sim/db'
import {
  member,
  organization,
  subscription as subscriptionTable,
  user,
  userStats,
} from '@sim/db/schema'
import { and, eq, sql } from 'drizzle-orm'
import { requireStripeClient } from '@/lib/billing/stripe-client'
import { validateSeatAvailability } from '@/lib/billing/validation/seat-management'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('OrganizationMembership')

export interface RestoreProResult {
  restored: boolean
  usageRestored: boolean
  subscriptionId?: string
}

/**
 * Restore a user's personal Pro subscription if it was paused (cancelAtPeriodEnd=true).
 * Also restores any snapshotted Pro usage from when they joined a team.
 *
 * Called when:
 * - A member leaves a team (via removeUserFromOrganization)
 * - A team subscription ends (members stay but get Pro restored)
 */
export async function restoreUserProSubscription(userId: string): Promise<RestoreProResult> {
  const result: RestoreProResult = {
    restored: false,
    usageRestored: false,
  }

  try {
    const [personalPro] = await db
      .select()
      .from(subscriptionTable)
      .where(
        and(
          eq(subscriptionTable.referenceId, userId),
          eq(subscriptionTable.status, 'active'),
          eq(subscriptionTable.plan, 'pro')
        )
      )
      .limit(1)

    if (!personalPro?.cancelAtPeriodEnd || !personalPro.stripeSubscriptionId) {
      return result
    }

    result.subscriptionId = personalPro.id

    try {
      const stripe = requireStripeClient()
      await stripe.subscriptions.update(personalPro.stripeSubscriptionId, {
        cancel_at_period_end: false,
      })
    } catch (stripeError) {
      logger.error('Stripe restore cancel_at_period_end failed for personal Pro', {
        userId,
        stripeSubscriptionId: personalPro.stripeSubscriptionId,
        error: stripeError,
      })
    }

    try {
      await db
        .update(subscriptionTable)
        .set({ cancelAtPeriodEnd: false })
        .where(eq(subscriptionTable.id, personalPro.id))

      result.restored = true

      logger.info('Restored personal Pro subscription', {
        userId,
        subscriptionId: personalPro.id,
      })
    } catch (dbError) {
      logger.error('DB update failed when restoring personal Pro', {
        userId,
        subscriptionId: personalPro.id,
        error: dbError,
      })
    }

    try {
      const [stats] = await db
        .select({
          currentPeriodCost: userStats.currentPeriodCost,
          proPeriodCostSnapshot: userStats.proPeriodCostSnapshot,
        })
        .from(userStats)
        .where(eq(userStats.userId, userId))
        .limit(1)

      if (stats) {
        const currentUsage = stats.currentPeriodCost || '0'
        const snapshotUsage = stats.proPeriodCostSnapshot || '0'
        const snapshotNum = Number.parseFloat(snapshotUsage)

        if (snapshotNum > 0) {
          const currentNum = Number.parseFloat(currentUsage)
          const restoredUsage = (currentNum + snapshotNum).toString()

          await db
            .update(userStats)
            .set({
              currentPeriodCost: restoredUsage,
              proPeriodCostSnapshot: '0',
            })
            .where(eq(userStats.userId, userId))

          result.usageRestored = true

          logger.info('Restored Pro usage snapshot', {
            userId,
            previousUsage: currentUsage,
            snapshotUsage,
            restoredUsage,
          })
        }
      }
    } catch (usageRestoreError) {
      logger.error('Failed to restore Pro usage snapshot', {
        userId,
        error: usageRestoreError,
      })
    }
  } catch (error) {
    logger.error('Failed to restore user Pro subscription', {
      userId,
      error,
    })
  }

  return result
}

export interface AddMemberParams {
  userId: string
  organizationId: string
  role: 'admin' | 'member' | 'owner'
  /** Skip Pro snapshot/cancellation logic (default: false) */
  skipBillingLogic?: boolean
  /** Skip seat validation (default: false) */
  skipSeatValidation?: boolean
}

export interface AddMemberResult {
  success: boolean
  memberId?: string
  error?: string
  billingActions: {
    proUsageSnapshotted: boolean
    proCancelledAtPeriodEnd: boolean
    /** If Pro was cancelled, contains info for Stripe update (caller can optionally call Stripe) */
    proSubscriptionToCancel?: {
      subscriptionId: string
      stripeSubscriptionId: string | null
    }
  }
}

export interface RemoveMemberParams {
  userId: string
  organizationId: string
  memberId: string
  /** Skip departed usage capture and Pro restoration (default: false) */
  skipBillingLogic?: boolean
}

export interface RemoveMemberResult {
  success: boolean
  error?: string
  billingActions: {
    usageCaptured: number
    proRestored: boolean
    usageRestored: boolean
  }
}

export interface MembershipValidationResult {
  canAdd: boolean
  reason?: string
  existingOrgId?: string
  seatValidation?: {
    currentSeats: number
    maxSeats: number
    availableSeats: number
  }
}

/**
 * Validate if a user can be added to an organization.
 * Checks single-org constraint and seat availability.
 */
export async function validateMembershipAddition(
  userId: string,
  organizationId: string
): Promise<MembershipValidationResult> {
  const [userData] = await db.select({ id: user.id }).from(user).where(eq(user.id, userId)).limit(1)

  if (!userData) {
    return { canAdd: false, reason: 'User not found' }
  }

  const [orgData] = await db
    .select({ id: organization.id })
    .from(organization)
    .where(eq(organization.id, organizationId))
    .limit(1)

  if (!orgData) {
    return { canAdd: false, reason: 'Organization not found' }
  }

  const existingMemberships = await db
    .select({ organizationId: member.organizationId })
    .from(member)
    .where(eq(member.userId, userId))

  if (existingMemberships.length > 0) {
    const isAlreadyMemberOfThisOrg = existingMemberships.some(
      (m) => m.organizationId === organizationId
    )

    if (isAlreadyMemberOfThisOrg) {
      return { canAdd: false, reason: 'User is already a member of this organization' }
    }

    return {
      canAdd: false,
      reason:
        'User is already a member of another organization. Users can only belong to one organization at a time.',
      existingOrgId: existingMemberships[0].organizationId,
    }
  }

  const seatValidation = await validateSeatAvailability(organizationId, 1)
  if (!seatValidation.canInvite) {
    return {
      canAdd: false,
      reason: seatValidation.reason || 'No seats available',
      seatValidation: {
        currentSeats: seatValidation.currentSeats,
        maxSeats: seatValidation.maxSeats,
        availableSeats: seatValidation.availableSeats,
      },
    }
  }

  return {
    canAdd: true,
    seatValidation: {
      currentSeats: seatValidation.currentSeats,
      maxSeats: seatValidation.maxSeats,
      availableSeats: seatValidation.availableSeats,
    },
  }
}

/**
 * Add a user to an organization with full billing logic.
 *
 * Handles:
 * - Single organization constraint validation
 * - Seat availability validation
 * - Member record creation
 * - Pro usage snapshot when joining paid team
 * - Pro subscription cancellation at period end
 * - Usage limit sync
 */
export async function addUserToOrganization(params: AddMemberParams): Promise<AddMemberResult> {
  const {
    userId,
    organizationId,
    role,
    skipBillingLogic = false,
    skipSeatValidation = false,
  } = params

  const billingActions: AddMemberResult['billingActions'] = {
    proUsageSnapshotted: false,
    proCancelledAtPeriodEnd: false,
  }

  try {
    if (!skipSeatValidation) {
      const validation = await validateMembershipAddition(userId, organizationId)
      if (!validation.canAdd) {
        return { success: false, error: validation.reason, billingActions }
      }
    } else {
      const existingMemberships = await db
        .select({ organizationId: member.organizationId })
        .from(member)
        .where(eq(member.userId, userId))

      if (existingMemberships.length > 0) {
        const isAlreadyMemberOfThisOrg = existingMemberships.some(
          (m) => m.organizationId === organizationId
        )

        if (isAlreadyMemberOfThisOrg) {
          return {
            success: false,
            error: 'User is already a member of this organization',
            billingActions,
          }
        }

        return {
          success: false,
          error:
            'User is already a member of another organization. Users can only belong to one organization at a time.',
          billingActions,
        }
      }
    }

    const [orgSub] = await db
      .select()
      .from(subscriptionTable)
      .where(
        and(
          eq(subscriptionTable.referenceId, organizationId),
          eq(subscriptionTable.status, 'active')
        )
      )
      .limit(1)

    const orgIsPaid = orgSub && (orgSub.plan === 'team' || orgSub.plan === 'enterprise')

    let memberId = ''

    await db.transaction(async (tx) => {
      memberId = randomUUID()
      await tx.insert(member).values({
        id: memberId,
        userId,
        organizationId,
        role,
        createdAt: new Date(),
      })

      // Handle Pro subscription if org is paid and we're not skipping billing logic
      if (orgIsPaid && !skipBillingLogic) {
        // Find user's active personal Pro subscription
        const [personalPro] = await tx
          .select()
          .from(subscriptionTable)
          .where(
            and(
              eq(subscriptionTable.referenceId, userId),
              eq(subscriptionTable.status, 'active'),
              eq(subscriptionTable.plan, 'pro')
            )
          )
          .limit(1)

        if (personalPro) {
          // Snapshot the current Pro usage before resetting
          const [userStatsRow] = await tx
            .select({ currentPeriodCost: userStats.currentPeriodCost })
            .from(userStats)
            .where(eq(userStats.userId, userId))
            .limit(1)

          if (userStatsRow) {
            const currentProUsage = userStatsRow.currentPeriodCost || '0'

            // Snapshot Pro usage and reset currentPeriodCost so new usage goes to team
            await tx
              .update(userStats)
              .set({
                proPeriodCostSnapshot: currentProUsage,
                currentPeriodCost: '0',
                currentPeriodCopilotCost: '0',
              })
              .where(eq(userStats.userId, userId))

            billingActions.proUsageSnapshotted = true

            logger.info('Snapshotted Pro usage when adding to team', {
              userId,
              proUsageSnapshot: currentProUsage,
              organizationId,
            })
          }

          // Mark Pro for cancellation at period end
          if (!personalPro.cancelAtPeriodEnd) {
            await tx
              .update(subscriptionTable)
              .set({ cancelAtPeriodEnd: true })
              .where(eq(subscriptionTable.id, personalPro.id))

            billingActions.proCancelledAtPeriodEnd = true
            billingActions.proSubscriptionToCancel = {
              subscriptionId: personalPro.id,
              stripeSubscriptionId: personalPro.stripeSubscriptionId,
            }

            logger.info('Marked personal Pro for cancellation at period end', {
              userId,
              subscriptionId: personalPro.id,
              organizationId,
            })
          }
        }
      }
    })

    logger.info('Added user to organization', {
      userId,
      organizationId,
      role,
      memberId,
      billingActions,
    })

    return { success: true, memberId, billingActions }
  } catch (error) {
    logger.error('Failed to add user to organization', { userId, organizationId, error })
    return { success: false, error: 'Failed to add user to organization', billingActions }
  }
}

/**
 * Remove a user from an organization with full billing logic.
 *
 * Handles:
 * - Owner removal prevention
 * - Departed member usage capture
 * - Member record deletion
 * - Pro subscription restoration when leaving a paid team
 * - Pro usage restoration from snapshot
 *
 * Note: Users can only belong to one organization at a time.
 */
export async function removeUserFromOrganization(
  params: RemoveMemberParams
): Promise<RemoveMemberResult> {
  const { userId, organizationId, memberId, skipBillingLogic = false } = params

  const billingActions = {
    usageCaptured: 0,
    proRestored: false,
    usageRestored: false,
  }

  try {
    // Check member exists and get their details
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
      return { success: false, error: 'Member not found', billingActions }
    }

    // Prevent removing owner
    if (existingMember.role === 'owner') {
      return { success: false, error: 'Cannot remove organization owner', billingActions }
    }

    // STEP 1: Capture departed member's usage (add to org's departedMemberUsage)
    if (!skipBillingLogic) {
      try {
        const [departingUserStats] = await db
          .select({ currentPeriodCost: userStats.currentPeriodCost })
          .from(userStats)
          .where(eq(userStats.userId, userId))
          .limit(1)

        if (departingUserStats?.currentPeriodCost) {
          const usage = Number.parseFloat(departingUserStats.currentPeriodCost)
          if (usage > 0) {
            await db
              .update(organization)
              .set({
                departedMemberUsage: sql`${organization.departedMemberUsage} + ${usage}`,
              })
              .where(eq(organization.id, organizationId))

            await db
              .update(userStats)
              .set({ currentPeriodCost: '0' })
              .where(eq(userStats.userId, userId))

            billingActions.usageCaptured = usage

            logger.info('Captured departed member usage', {
              organizationId,
              userId,
              usage,
            })
          }
        }
      } catch (usageCaptureError) {
        logger.error('Failed to capture departed member usage', {
          organizationId,
          userId,
          error: usageCaptureError,
        })
      }
    }

    // STEP 2: Delete the member record
    await db.delete(member).where(eq(member.id, memberId))

    logger.info('Removed member from organization', {
      organizationId,
      userId,
      memberId,
    })

    // STEP 3: Restore personal Pro if user has no remaining paid team memberships
    if (!skipBillingLogic) {
      try {
        const remainingPaidTeams = await db
          .select({ orgId: member.organizationId })
          .from(member)
          .where(eq(member.userId, userId))

        let hasAnyPaidTeam = false
        if (remainingPaidTeams.length > 0) {
          const orgIds = remainingPaidTeams.map((m) => m.orgId)
          const orgPaidSubs = await db
            .select()
            .from(subscriptionTable)
            .where(eq(subscriptionTable.status, 'active'))

          hasAnyPaidTeam = orgPaidSubs.some(
            (s) => orgIds.includes(s.referenceId) && ['team', 'enterprise'].includes(s.plan ?? '')
          )
        }

        if (!hasAnyPaidTeam) {
          const restoreResult = await restoreUserProSubscription(userId)
          billingActions.proRestored = restoreResult.restored
          billingActions.usageRestored = restoreResult.usageRestored
        }
      } catch (postRemoveError) {
        logger.error('Post-removal personal Pro restore check failed', {
          organizationId,
          userId,
          error: postRemoveError,
        })
      }
    }

    return { success: true, billingActions }
  } catch (error) {
    logger.error('Failed to remove user from organization', {
      userId,
      organizationId,
      memberId,
      error,
    })
    return { success: false, error: 'Failed to remove user from organization', billingActions }
  }
}

/**
 * Check if a user is a member of a specific organization.
 */
export async function isUserMemberOfOrganization(
  userId: string,
  organizationId: string
): Promise<{ isMember: boolean; role?: string; memberId?: string }> {
  const [memberRecord] = await db
    .select({ id: member.id, role: member.role })
    .from(member)
    .where(and(eq(member.userId, userId), eq(member.organizationId, organizationId)))
    .limit(1)

  if (memberRecord) {
    return { isMember: true, role: memberRecord.role, memberId: memberRecord.id }
  }

  return { isMember: false }
}

/**
 * Get user's current organization membership (if any).
 */
export async function getUserOrganization(
  userId: string
): Promise<{ organizationId: string; role: string; memberId: string } | null> {
  const [memberRecord] = await db
    .select({
      organizationId: member.organizationId,
      role: member.role,
      memberId: member.id,
    })
    .from(member)
    .where(eq(member.userId, userId))
    .limit(1)

  return memberRecord || null
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/lib/billing/storage/index.ts

```typescript
export { checkStorageQuota, getUserStorageLimit, getUserStorageUsage } from './limits'
export { decrementStorageUsage, incrementStorageUsage } from './tracking'
```

--------------------------------------------------------------------------------

---[FILE: limits.ts]---
Location: sim-main/apps/sim/lib/billing/storage/limits.ts

```typescript
/**
 * Storage limit management
 * Similar to cost limits but for file storage quotas
 */

import { db } from '@sim/db'
import {
  DEFAULT_ENTERPRISE_STORAGE_LIMIT_GB,
  DEFAULT_FREE_STORAGE_LIMIT_GB,
  DEFAULT_PRO_STORAGE_LIMIT_GB,
  DEFAULT_TEAM_STORAGE_LIMIT_GB,
} from '@sim/db/constants'
import { organization, subscription, userStats } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { getEnv } from '@/lib/core/config/env'
import { isBillingEnabled } from '@/lib/core/config/feature-flags'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('StorageLimits')

/**
 * Convert GB to bytes
 */
function gbToBytes(gb: number): number {
  return gb * 1024 * 1024 * 1024
}

/**
 * Get storage limits from environment variables with fallback to constants
 * Returns limits in bytes
 */
export function getStorageLimits() {
  return {
    free: gbToBytes(
      Number.parseInt(getEnv('FREE_STORAGE_LIMIT_GB') || String(DEFAULT_FREE_STORAGE_LIMIT_GB))
    ),
    pro: gbToBytes(
      Number.parseInt(getEnv('PRO_STORAGE_LIMIT_GB') || String(DEFAULT_PRO_STORAGE_LIMIT_GB))
    ),
    team: gbToBytes(
      Number.parseInt(getEnv('TEAM_STORAGE_LIMIT_GB') || String(DEFAULT_TEAM_STORAGE_LIMIT_GB))
    ),
    enterpriseDefault: gbToBytes(
      Number.parseInt(
        getEnv('ENTERPRISE_STORAGE_LIMIT_GB') || String(DEFAULT_ENTERPRISE_STORAGE_LIMIT_GB)
      )
    ),
  }
}

/**
 * Get storage limit for a specific plan
 * Returns limit in bytes
 */
export function getStorageLimitForPlan(plan: string, metadata?: any): number {
  const limits = getStorageLimits()

  switch (plan) {
    case 'free':
      return limits.free
    case 'pro':
      return limits.pro
    case 'team':
      return limits.team
    case 'enterprise':
      // Check for custom limit in metadata (stored in GB)
      if (metadata?.storageLimitGB) {
        return gbToBytes(Number.parseInt(metadata.storageLimitGB))
      }
      return limits.enterpriseDefault
    default:
      return limits.free
  }
}

/**
 * Get storage limit for a user based on their subscription
 * Returns limit in bytes
 */
export async function getUserStorageLimit(userId: string): Promise<number> {
  try {
    // Check if user is in a team/enterprise org
    const { getHighestPrioritySubscription } = await import('@/lib/billing/core/subscription')
    const sub = await getHighestPrioritySubscription(userId)

    const limits = getStorageLimits()

    if (!sub || sub.plan === 'free') {
      return limits.free
    }

    if (sub.plan === 'pro') {
      return limits.pro
    }

    // Team/Enterprise: Use organization limit
    if (sub.plan === 'team' || sub.plan === 'enterprise') {
      // Get organization storage limit
      const orgRecord = await db
        .select({ metadata: subscription.metadata })
        .from(subscription)
        .where(eq(subscription.id, sub.id))
        .limit(1)

      if (orgRecord.length > 0 && orgRecord[0].metadata) {
        const metadata = orgRecord[0].metadata as any
        if (metadata.customStorageLimitGB) {
          return metadata.customStorageLimitGB * 1024 * 1024 * 1024
        }
      }

      // Default for team/enterprise
      return sub.plan === 'enterprise' ? limits.enterpriseDefault : limits.team
    }

    return limits.free
  } catch (error) {
    logger.error('Error getting user storage limit:', error)
    return getStorageLimits().free
  }
}

/**
 * Get current storage usage for a user
 * Returns usage in bytes
 */
export async function getUserStorageUsage(userId: string): Promise<number> {
  try {
    // Check if user is in a team/enterprise org
    const { getHighestPrioritySubscription } = await import('@/lib/billing/core/subscription')
    const sub = await getHighestPrioritySubscription(userId)

    if (sub && (sub.plan === 'team' || sub.plan === 'enterprise')) {
      // Use organization storage
      const orgRecord = await db
        .select({ storageUsedBytes: organization.storageUsedBytes })
        .from(organization)
        .where(eq(organization.id, sub.referenceId))
        .limit(1)

      return orgRecord.length > 0 ? orgRecord[0].storageUsedBytes || 0 : 0
    }

    // Free/Pro: Use user stats
    const stats = await db
      .select({ storageUsedBytes: userStats.storageUsedBytes })
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1)

    return stats.length > 0 ? stats[0].storageUsedBytes || 0 : 0
  } catch (error) {
    logger.error('Error getting user storage usage:', error)
    return 0
  }
}

/**
 * Check if user has storage quota available
 * Always allows uploads when billing is disabled
 */
export async function checkStorageQuota(
  userId: string,
  additionalBytes: number
): Promise<{ allowed: boolean; currentUsage: number; limit: number; error?: string }> {
  if (!isBillingEnabled) {
    return {
      allowed: true,
      currentUsage: 0,
      limit: Number.MAX_SAFE_INTEGER,
    }
  }

  try {
    const [currentUsage, limit] = await Promise.all([
      getUserStorageUsage(userId),
      getUserStorageLimit(userId),
    ])

    const newUsage = currentUsage + additionalBytes
    const allowed = newUsage <= limit

    return {
      allowed,
      currentUsage,
      limit,
      error: allowed
        ? undefined
        : `Storage limit exceeded. Used: ${(newUsage / (1024 * 1024 * 1024)).toFixed(2)}GB, Limit: ${(limit / (1024 * 1024 * 1024)).toFixed(0)}GB`,
    }
  } catch (error) {
    logger.error('Error checking storage quota:', error)
    return {
      allowed: false,
      currentUsage: 0,
      limit: 0,
      error: 'Failed to check storage quota',
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: tracking.ts]---
Location: sim-main/apps/sim/lib/billing/storage/tracking.ts

```typescript
/**
 * Storage usage tracking
 * Updates storage_used_bytes for users and organizations
 * Only tracks when billing is enabled
 */

import { db } from '@sim/db'
import { organization, userStats } from '@sim/db/schema'
import { eq, sql } from 'drizzle-orm'
import { isBillingEnabled } from '@/lib/core/config/feature-flags'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('StorageTracking')

/**
 * Increment storage usage after successful file upload
 * Only tracks if billing is enabled
 */
export async function incrementStorageUsage(userId: string, bytes: number): Promise<void> {
  if (!isBillingEnabled) {
    logger.debug('Billing disabled, skipping storage increment')
    return
  }

  try {
    // Check if user is in a team/enterprise org
    const { getHighestPrioritySubscription } = await import('@/lib/billing/core/subscription')
    const sub = await getHighestPrioritySubscription(userId)

    if (sub && (sub.plan === 'team' || sub.plan === 'enterprise')) {
      // Update organization storage
      await db
        .update(organization)
        .set({
          storageUsedBytes: sql`${organization.storageUsedBytes} + ${bytes}`,
        })
        .where(eq(organization.id, sub.referenceId))

      logger.info(`Incremented org storage: ${bytes} bytes for org ${sub.referenceId}`)
    } else {
      // Update user stats storage
      await db
        .update(userStats)
        .set({
          storageUsedBytes: sql`${userStats.storageUsedBytes} + ${bytes}`,
        })
        .where(eq(userStats.userId, userId))

      logger.info(`Incremented user storage: ${bytes} bytes for user ${userId}`)
    }
  } catch (error) {
    logger.error('Error incrementing storage usage:', error)
    throw error
  }
}

/**
 * Decrement storage usage after file deletion
 * Only tracks if billing is enabled
 */
export async function decrementStorageUsage(userId: string, bytes: number): Promise<void> {
  if (!isBillingEnabled) {
    logger.debug('Billing disabled, skipping storage decrement')
    return
  }

  try {
    // Check if user is in a team/enterprise org
    const { getHighestPrioritySubscription } = await import('@/lib/billing/core/subscription')
    const sub = await getHighestPrioritySubscription(userId)

    if (sub && (sub.plan === 'team' || sub.plan === 'enterprise')) {
      // Update organization storage
      await db
        .update(organization)
        .set({
          storageUsedBytes: sql`GREATEST(0, ${organization.storageUsedBytes} - ${bytes})`,
        })
        .where(eq(organization.id, sub.referenceId))

      logger.info(`Decremented org storage: ${bytes} bytes for org ${sub.referenceId}`)
    } else {
      // Update user stats storage
      await db
        .update(userStats)
        .set({
          storageUsedBytes: sql`GREATEST(0, ${userStats.storageUsedBytes} - ${bytes})`,
        })
        .where(eq(userStats.userId, userId))

      logger.info(`Decremented user storage: ${bytes} bytes for user ${userId}`)
    }
  } catch (error) {
    logger.error('Error decrementing storage usage:', error)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/lib/billing/subscriptions/utils.ts

```typescript
import {
  DEFAULT_ENTERPRISE_TIER_COST_LIMIT,
  DEFAULT_FREE_CREDITS,
  DEFAULT_PRO_TIER_COST_LIMIT,
  DEFAULT_TEAM_TIER_COST_LIMIT,
} from '@/lib/billing/constants'
import type { EnterpriseSubscriptionMetadata } from '@/lib/billing/types'
import { env } from '@/lib/core/config/env'

/**
 * Get the free tier limit from env or fallback to default
 */
export function getFreeTierLimit(): number {
  return env.FREE_TIER_COST_LIMIT || DEFAULT_FREE_CREDITS
}

/**
 * Get the pro tier limit from env or fallback to default
 */
export function getProTierLimit(): number {
  return env.PRO_TIER_COST_LIMIT || DEFAULT_PRO_TIER_COST_LIMIT
}

/**
 * Get the team tier limit per seat from env or fallback to default
 */
export function getTeamTierLimitPerSeat(): number {
  return env.TEAM_TIER_COST_LIMIT || DEFAULT_TEAM_TIER_COST_LIMIT
}

/**
 * Get the enterprise tier limit per seat from env or fallback to default
 */
export function getEnterpriseTierLimitPerSeat(): number {
  return env.ENTERPRISE_TIER_COST_LIMIT || DEFAULT_ENTERPRISE_TIER_COST_LIMIT
}

export function checkEnterprisePlan(subscription: any): boolean {
  return subscription?.plan === 'enterprise' && subscription?.status === 'active'
}

/**
 * Type guard to check if metadata is valid EnterpriseSubscriptionMetadata
 */
function isEnterpriseMetadata(metadata: unknown): metadata is EnterpriseSubscriptionMetadata {
  return (
    !!metadata &&
    typeof metadata === 'object' &&
    'seats' in metadata &&
    typeof (metadata as EnterpriseSubscriptionMetadata).seats === 'string'
  )
}

export function getEffectiveSeats(subscription: any): number {
  if (!subscription) {
    return 0
  }

  if (subscription.plan === 'enterprise') {
    const metadata = subscription.metadata as EnterpriseSubscriptionMetadata | null
    if (isEnterpriseMetadata(metadata)) {
      return Number.parseInt(metadata.seats, 10)
    }
    return 0
  }

  if (subscription.plan === 'team') {
    return subscription.seats ?? 0
  }

  return 0
}

export function checkProPlan(subscription: any): boolean {
  return subscription?.plan === 'pro' && subscription?.status === 'active'
}

export function checkTeamPlan(subscription: any): boolean {
  return subscription?.plan === 'team' && subscription?.status === 'active'
}

/**
 * Get the minimum usage limit for an individual user (used for validation)
 * Only applicable for plans with individual limits (Free/Pro)
 * Team and Enterprise plans use organization-level limits instead
 * @param subscription The subscription object
 * @returns The per-user minimum limit in dollars
 */
export function getPerUserMinimumLimit(subscription: any): number {
  if (!subscription || subscription.status !== 'active') {
    return getFreeTierLimit()
  }

  if (subscription.plan === 'pro') {
    return getProTierLimit()
  }

  if (subscription.plan === 'team' || subscription.plan === 'enterprise') {
    // Team and Enterprise don't have individual limits - they use organization limits
    // This function should not be called for these plans
    // Returning 0 to indicate no individual minimum
    return 0
  }

  return getFreeTierLimit()
}

/**
 * Check if a user can edit their usage limits based on their subscription
 * Free and Enterprise plans cannot edit limits
 * Pro and Team plans can increase their limits
 * @param subscription The subscription object
 * @returns Whether the user can edit their usage limits
 */
export function canEditUsageLimit(subscription: any): boolean {
  if (!subscription || subscription.status !== 'active') {
    return false // Free plan users cannot edit limits
  }

  // Only Pro and Team plans can edit limits
  // Enterprise has fixed limits that match their monthly cost
  return subscription.plan === 'pro' || subscription.plan === 'team'
}

/**
 * Get pricing info for a plan
 */
export function getPlanPricing(plan: string): { basePrice: number } {
  switch (plan) {
    case 'free':
      return { basePrice: 0 }
    case 'pro':
      return { basePrice: getProTierLimit() }
    case 'team':
      return { basePrice: getTeamTierLimitPerSeat() }
    case 'enterprise':
      return { basePrice: getEnterpriseTierLimitPerSeat() }
    default:
      return { basePrice: 0 }
  }
}
```

--------------------------------------------------------------------------------

````
