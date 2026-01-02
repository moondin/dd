---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 542
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 542 of 933)

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

---[FILE: index.ts]---
Location: sim-main/apps/sim/lib/billing/types/index.ts

```typescript
/**
 * Billing System Types
 * Centralized type definitions for the billing system
 */

export interface EnterpriseSubscriptionMetadata {
  plan: 'enterprise'
  // The referenceId must be provided in Stripe metadata to link to the organization
  // This gets stored in the subscription.referenceId column
  referenceId: string
  // The fixed monthly price for this enterprise customer (as string from Stripe metadata)
  // This will be used to set the organization's usage limit
  monthlyPrice: string
  // Number of seats for invitation limits (not for billing) (as string from Stripe metadata)
  // We set Stripe quantity to 1 and use this for actual seat count
  seats: string
}

export interface UsageData {
  currentUsage: number
  limit: number
  percentUsed: number
  isWarning: boolean
  isExceeded: boolean
  billingPeriodStart: Date | null
  billingPeriodEnd: Date | null
  lastPeriodCost: number
}

export interface UsageLimitInfo {
  currentLimit: number
  canEdit: boolean
  minimumLimit: number
  plan: string
  updatedAt: Date | null
}

export interface BillingData {
  currentPeriodCost: number
  projectedCost: number
  limit: number
  billingPeriodStart: Date | null
  billingPeriodEnd: Date | null
  daysRemaining: number
}

export interface UserSubscriptionState {
  isPro: boolean
  isTeam: boolean
  isEnterprise: boolean
  isFree: boolean
  highestPrioritySubscription: any | null
  hasExceededLimit: boolean
  planName: string
}

export interface SubscriptionPlan {
  name: string
  priceId: string
  limits: {
    cost: number
  }
}

export interface BillingEntity {
  id: string
  type: 'user' | 'organization'
  referenceId: string
  metadata?: { stripeCustomerId?: string; [key: string]: any } | null
  createdAt: Date
  updatedAt: Date
}

export interface BillingConfig {
  id: string
  entityType: 'user' | 'organization'
  entityId: string
  usageLimit: number
  limitSetBy?: string
  limitUpdatedAt?: Date
  billingPeriodType: 'monthly' | 'annual'
  autoResetEnabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UsagePeriod {
  id: string
  entityType: 'user' | 'organization'
  entityId: string
  periodStart: Date
  periodEnd: Date
  totalCost: number
  finalCost?: number
  isCurrent: boolean
  status: 'active' | 'finalized' | 'billed'
  createdAt: Date
  finalizedAt?: Date
}

export interface BillingStatus {
  status: 'ok' | 'warning' | 'exceeded'
  usageData: UsageData
}

export interface TeamUsageLimit {
  userId: string
  userName: string
  userEmail: string
  currentLimit: number
  currentUsage: number
  totalCost: number
  lastActive: Date | null
  limitSetBy: string | null
  limitUpdatedAt: Date | null
}

export interface BillingSummary {
  userId: string
  email: string
  name: string
  currentPeriodCost: number
  currentUsageLimit: number
  currentUsagePercentage: number
  billingPeriodStart: Date | null
  billingPeriodEnd: Date | null
  plan: string
  subscriptionStatus: string | null
  seats: number | null
  billingStatus: 'ok' | 'warning' | 'exceeded'
}

export interface SubscriptionAPIResponse {
  isPaid: boolean
  isPro: boolean
  isTeam: boolean
  isEnterprise: boolean
  plan: string
  status: string | null
  seats: number | null
  metadata: any | null
  usage: UsageData
}

export interface UsageLimitAPIResponse {
  currentLimit: number
  canEdit: boolean
  minimumLimit: number
  plan: string
  setBy?: string
  updatedAt?: Date
}

// Utility Types
export type PlanType = 'free' | 'pro' | 'team' | 'enterprise'
export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'unpaid'
  | 'trialing'
  | 'incomplete'
  | 'incomplete_expired'
export type BillingEntityType = 'user' | 'organization'
export type BillingPeriodType = 'monthly' | 'annual'
export type UsagePeriodStatus = 'active' | 'finalized' | 'billed'
export type BillingStatusType = 'ok' | 'warning' | 'exceeded'

// Error Types
export interface BillingError {
  code: string
  message: string
  details?: any
}

export interface UpdateUsageLimitResult {
  success: boolean
  error?: string
}

// Hook Types for React
export interface UseSubscriptionStateReturn {
  subscription: {
    isPaid: boolean
    isPro: boolean
    isTeam: boolean
    isEnterprise: boolean
    isFree: boolean
    plan: string
    status?: string
    seats?: number
    metadata?: any
  }
  usage: UsageData
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<any>
  isAtLeastPro: () => boolean
  isAtLeastTeam: () => boolean
  canUpgrade: () => boolean
  getBillingStatus: () => BillingStatusType
  getRemainingBudget: () => number
  getDaysRemainingInPeriod: () => number | null
}

export interface UseUsageLimitReturn {
  currentLimit: number
  canEdit: boolean
  minimumLimit: number
  plan: string
  setBy?: string
  updatedAt?: Date
  updateLimit: (newLimit: number) => Promise<{ success: boolean }>
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<any>
}
```

--------------------------------------------------------------------------------

---[FILE: seat-management.ts]---
Location: sim-main/apps/sim/lib/billing/validation/seat-management.ts

```typescript
import { db } from '@sim/db'
import { invitation, member, organization, subscription, user, userStats } from '@sim/db/schema'
import { and, count, eq } from 'drizzle-orm'
import { getOrganizationSubscription } from '@/lib/billing/core/billing'
import { getEffectiveSeats } from '@/lib/billing/subscriptions/utils'
import { createLogger } from '@/lib/logs/console/logger'
import { quickValidateEmail } from '@/lib/messaging/email/validation'

const logger = createLogger('SeatManagement')

interface SeatValidationResult {
  canInvite: boolean
  reason?: string
  currentSeats: number
  maxSeats: number
  availableSeats: number
}

interface OrganizationSeatInfo {
  organizationId: string
  organizationName: string
  currentSeats: number
  maxSeats: number
  availableSeats: number
  subscriptionPlan: string
  canAddSeats: boolean
}

/**
 * Validate if an organization can invite new members based on seat limits
 */
export async function validateSeatAvailability(
  organizationId: string,
  additionalSeats = 1
): Promise<SeatValidationResult> {
  try {
    // Get organization subscription directly (referenceId = organizationId)
    const subscription = await getOrganizationSubscription(organizationId)

    if (!subscription) {
      return {
        canInvite: false,
        reason: 'No active subscription found',
        currentSeats: 0,
        maxSeats: 0,
        availableSeats: 0,
      }
    }

    // Free and Pro plans don't support organizations
    if (['free', 'pro'].includes(subscription.plan)) {
      return {
        canInvite: false,
        reason: 'Organization features require Team or Enterprise plan',
        currentSeats: 0,
        maxSeats: 0,
        availableSeats: 0,
      }
    }

    // Get current member count
    const memberCount = await db
      .select({ count: count() })
      .from(member)
      .where(eq(member.organizationId, organizationId))

    const currentSeats = memberCount[0]?.count || 0

    // Determine seat limits based on subscription
    // Team: seats from Stripe subscription quantity (seats column)
    // Enterprise: seats from metadata.seats (not from seats column which is always 1)
    const maxSeats = getEffectiveSeats(subscription)

    const availableSeats = Math.max(0, maxSeats - currentSeats)
    const canInvite = availableSeats >= additionalSeats

    const result: SeatValidationResult = {
      canInvite,
      currentSeats,
      maxSeats,
      availableSeats,
    }

    if (!canInvite) {
      if (additionalSeats === 1) {
        result.reason = `No available seats. Currently using ${currentSeats} of ${maxSeats} seats.`
      } else {
        result.reason = `Not enough available seats. Need ${additionalSeats} seats, but only ${availableSeats} available.`
      }
    }

    logger.debug('Seat validation result', {
      organizationId,
      additionalSeats,
      result,
    })

    return result
  } catch (error) {
    logger.error('Failed to validate seat availability', { organizationId, additionalSeats, error })
    return {
      canInvite: false,
      reason: 'Failed to check seat availability',
      currentSeats: 0,
      maxSeats: 0,
      availableSeats: 0,
    }
  }
}

/**
 * Get comprehensive seat information for an organization
 */
export async function getOrganizationSeatInfo(
  organizationId: string
): Promise<OrganizationSeatInfo | null> {
  try {
    const organizationData = await db
      .select({
        id: organization.id,
        name: organization.name,
      })
      .from(organization)
      .where(eq(organization.id, organizationId))
      .limit(1)

    if (organizationData.length === 0) {
      return null
    }

    const subscription = await getOrganizationSubscription(organizationId)

    if (!subscription) {
      return null
    }

    const memberCount = await db
      .select({ count: count() })
      .from(member)
      .where(eq(member.organizationId, organizationId))

    const currentSeats = memberCount[0]?.count || 0

    // Team: seats from column, Enterprise: seats from metadata
    const maxSeats = getEffectiveSeats(subscription)

    const canAddSeats = subscription.plan !== 'enterprise'

    const availableSeats = Math.max(0, maxSeats - currentSeats)

    return {
      organizationId,
      organizationName: organizationData[0].name,
      currentSeats,
      maxSeats,
      availableSeats,
      subscriptionPlan: subscription.plan,
      canAddSeats,
    }
  } catch (error) {
    logger.error('Failed to get organization seat info', { organizationId, error })
    return null
  }
}

/**
 * Validate and reserve seats for bulk invitations
 */
export async function validateBulkInvitations(
  organizationId: string,
  emailList: string[]
): Promise<{
  canInviteAll: boolean
  validEmails: string[]
  duplicateEmails: string[]
  existingMembers: string[]
  seatsNeeded: number
  seatsAvailable: number
  validationResult: SeatValidationResult
}> {
  try {
    const uniqueEmails = [...new Set(emailList)]
    const validEmails = uniqueEmails.filter(
      (email) => quickValidateEmail(email.trim().toLowerCase()).isValid
    )
    const duplicateEmails = emailList.filter((email, index) => emailList.indexOf(email) !== index)

    const existingMembers = await db
      .select({ userEmail: user.email })
      .from(member)
      .innerJoin(user, eq(member.userId, user.id))
      .where(eq(member.organizationId, organizationId))

    const existingEmails = existingMembers.map((m) => m.userEmail)
    const newEmails = validEmails.filter((email) => !existingEmails.includes(email))

    const pendingInvitations = await db
      .select({ email: invitation.email })
      .from(invitation)
      .where(and(eq(invitation.organizationId, organizationId), eq(invitation.status, 'pending')))

    const pendingEmails = pendingInvitations.map((i) => i.email)
    const finalEmailsToInvite = newEmails.filter((email) => !pendingEmails.includes(email))

    const seatsNeeded = finalEmailsToInvite.length
    const validationResult = await validateSeatAvailability(organizationId, seatsNeeded)

    return {
      canInviteAll: validationResult.canInvite && finalEmailsToInvite.length > 0,
      validEmails: finalEmailsToInvite,
      duplicateEmails,
      existingMembers: validEmails.filter((email) => existingEmails.includes(email)),
      seatsNeeded,
      seatsAvailable: validationResult.availableSeats,
      validationResult,
    }
  } catch (error) {
    logger.error('Failed to validate bulk invitations', {
      organizationId,
      emailCount: emailList.length,
      error,
    })

    const validationResult: SeatValidationResult = {
      canInvite: false,
      reason: 'Validation failed',
      currentSeats: 0,
      maxSeats: 0,
      availableSeats: 0,
    }

    return {
      canInviteAll: false,
      validEmails: [],
      duplicateEmails: [],
      existingMembers: [],
      seatsNeeded: 0,
      seatsAvailable: 0,
      validationResult,
    }
  }
}

/**
 * Get seat usage analytics for an organization
 */
export async function getOrganizationSeatAnalytics(organizationId: string) {
  try {
    const seatInfo = await getOrganizationSeatInfo(organizationId)

    if (!seatInfo) {
      return null
    }

    const memberActivity = await db
      .select({
        userId: member.userId,
        userName: user.name,
        userEmail: user.email,
        role: member.role,
        joinedAt: member.createdAt,
        lastActive: userStats.lastActive,
      })
      .from(member)
      .innerJoin(user, eq(member.userId, user.id))
      .leftJoin(userStats, eq(member.userId, userStats.userId))
      .where(eq(member.organizationId, organizationId))

    const utilizationRate =
      seatInfo.maxSeats > 0 ? (seatInfo.currentSeats / seatInfo.maxSeats) * 100 : 0

    const recentlyActive = memberActivity.filter((memberData) => {
      if (!memberData.lastActive) return false
      const daysSinceActive = (Date.now() - memberData.lastActive.getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceActive <= 30 // Active in last 30 days
    }).length

    return {
      ...seatInfo,
      utilizationRate: Math.round(utilizationRate * 100) / 100,
      activeMembers: recentlyActive,
      inactiveMembers: seatInfo.currentSeats - recentlyActive,
      memberActivity,
    }
  } catch (error) {
    logger.error('Failed to get organization seat analytics', { organizationId, error })
    return null
  }
}

/**
 * Sync seat count from Stripe subscription quantity.
 * Used by webhook handlers to keep local DB in sync with Stripe.
 */
export async function syncSeatsFromStripeQuantity(
  subscriptionId: string,
  currentSeats: number | null,
  stripeQuantity: number
): Promise<{ synced: boolean; previousSeats: number | null; newSeats: number }> {
  const effectiveCurrentSeats = currentSeats ?? 0

  // Only update if quantity differs
  if (stripeQuantity === effectiveCurrentSeats) {
    return {
      synced: false,
      previousSeats: effectiveCurrentSeats,
      newSeats: stripeQuantity,
    }
  }

  try {
    await db
      .update(subscription)
      .set({ seats: stripeQuantity })
      .where(eq(subscription.id, subscriptionId))

    logger.info('Synced seat count from Stripe', {
      subscriptionId,
      previousSeats: effectiveCurrentSeats,
      newSeats: stripeQuantity,
    })

    return {
      synced: true,
      previousSeats: effectiveCurrentSeats,
      newSeats: stripeQuantity,
    }
  } catch (error) {
    logger.error('Failed to sync seat count from Stripe', {
      subscriptionId,
      stripeQuantity,
      error,
    })
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: disputes.ts]---
Location: sim-main/apps/sim/lib/billing/webhooks/disputes.ts

```typescript
import { db } from '@sim/db'
import { member, subscription, user, userStats } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import type Stripe from 'stripe'
import { requireStripeClient } from '@/lib/billing/stripe-client'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('DisputeWebhooks')

async function getCustomerIdFromDispute(dispute: Stripe.Dispute): Promise<string | null> {
  const chargeId = typeof dispute.charge === 'string' ? dispute.charge : dispute.charge?.id
  if (!chargeId) return null

  const stripe = requireStripeClient()
  const charge = await stripe.charges.retrieve(chargeId)
  return typeof charge.customer === 'string' ? charge.customer : (charge.customer?.id ?? null)
}

/**
 * Handles charge.dispute.created - blocks the responsible user
 */
export async function handleChargeDispute(event: Stripe.Event): Promise<void> {
  const dispute = event.data.object as Stripe.Dispute

  const customerId = await getCustomerIdFromDispute(dispute)
  if (!customerId) {
    logger.warn('No customer ID found in dispute', { disputeId: dispute.id })
    return
  }

  // Find user by stripeCustomerId (Pro plans)
  const users = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.stripeCustomerId, customerId))
    .limit(1)

  if (users.length > 0) {
    await db
      .update(userStats)
      .set({ billingBlocked: true, billingBlockedReason: 'dispute' })
      .where(eq(userStats.userId, users[0].id))

    logger.warn('Blocked user due to dispute', {
      disputeId: dispute.id,
      userId: users[0].id,
    })
    return
  }

  // Find subscription by stripeCustomerId (Team/Enterprise)
  const subs = await db
    .select({ referenceId: subscription.referenceId })
    .from(subscription)
    .where(eq(subscription.stripeCustomerId, customerId))
    .limit(1)

  if (subs.length > 0) {
    const orgId = subs[0].referenceId

    const owners = await db
      .select({ userId: member.userId })
      .from(member)
      .where(and(eq(member.organizationId, orgId), eq(member.role, 'owner')))
      .limit(1)

    if (owners.length > 0) {
      await db
        .update(userStats)
        .set({ billingBlocked: true, billingBlockedReason: 'dispute' })
        .where(eq(userStats.userId, owners[0].userId))

      logger.warn('Blocked org owner due to dispute', {
        disputeId: dispute.id,
        ownerId: owners[0].userId,
        organizationId: orgId,
      })
    }
  }
}

/**
 * Handles charge.dispute.closed - unblocks user if dispute was won
 */
export async function handleDisputeClosed(event: Stripe.Event): Promise<void> {
  const dispute = event.data.object as Stripe.Dispute

  if (dispute.status !== 'won') {
    logger.info('Dispute not won, user remains blocked', {
      disputeId: dispute.id,
      status: dispute.status,
    })
    return
  }

  const customerId = await getCustomerIdFromDispute(dispute)
  if (!customerId) {
    return
  }

  // Find and unblock user (Pro plans)
  const users = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.stripeCustomerId, customerId))
    .limit(1)

  if (users.length > 0) {
    await db
      .update(userStats)
      .set({ billingBlocked: false, billingBlockedReason: null })
      .where(eq(userStats.userId, users[0].id))

    logger.info('Unblocked user after winning dispute', {
      disputeId: dispute.id,
      userId: users[0].id,
    })
    return
  }

  // Find and unblock org owner (Team/Enterprise)
  const subs = await db
    .select({ referenceId: subscription.referenceId })
    .from(subscription)
    .where(eq(subscription.stripeCustomerId, customerId))
    .limit(1)

  if (subs.length > 0) {
    const orgId = subs[0].referenceId

    const owners = await db
      .select({ userId: member.userId })
      .from(member)
      .where(and(eq(member.organizationId, orgId), eq(member.role, 'owner')))
      .limit(1)

    if (owners.length > 0) {
      await db
        .update(userStats)
        .set({ billingBlocked: false, billingBlockedReason: null })
        .where(eq(userStats.userId, owners[0].userId))

      logger.info('Unblocked org owner after winning dispute', {
        disputeId: dispute.id,
        ownerId: owners[0].userId,
        organizationId: orgId,
      })
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: enterprise.ts]---
Location: sim-main/apps/sim/lib/billing/webhooks/enterprise.ts

```typescript
import { db } from '@sim/db'
import { organization, subscription, user } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import type Stripe from 'stripe'
import {
  getEmailSubject,
  renderEnterpriseSubscriptionEmail,
} from '@/components/emails/render-email'
import { createLogger } from '@/lib/logs/console/logger'
import { sendEmail } from '@/lib/messaging/email/mailer'
import { getFromEmailAddress } from '@/lib/messaging/email/utils'
import type { EnterpriseSubscriptionMetadata } from '../types'

const logger = createLogger('BillingEnterprise')

function isEnterpriseMetadata(value: unknown): value is EnterpriseSubscriptionMetadata {
  return (
    !!value &&
    typeof value === 'object' &&
    'plan' in value &&
    'referenceId' in value &&
    'monthlyPrice' in value &&
    'seats' in value &&
    typeof value.plan === 'string' &&
    value.plan.toLowerCase() === 'enterprise' &&
    typeof value.referenceId === 'string' &&
    typeof value.monthlyPrice === 'string' &&
    typeof value.seats === 'string'
  )
}

export async function handleManualEnterpriseSubscription(event: Stripe.Event) {
  const stripeSubscription = event.data.object as Stripe.Subscription

  const metaPlan = (stripeSubscription.metadata?.plan as string | undefined)?.toLowerCase() || ''

  if (metaPlan !== 'enterprise') {
    logger.info('[subscription.created] Skipping non-enterprise subscription', {
      subscriptionId: stripeSubscription.id,
      plan: metaPlan || 'unknown',
    })
    return
  }

  const stripeCustomerId = stripeSubscription.customer as string

  if (!stripeCustomerId) {
    logger.error('[subscription.created] Missing Stripe customer ID', {
      subscriptionId: stripeSubscription.id,
    })
    throw new Error('Missing Stripe customer ID on subscription')
  }

  const metadata = stripeSubscription.metadata || {}

  const referenceId =
    typeof metadata.referenceId === 'string' && metadata.referenceId.length > 0
      ? metadata.referenceId
      : null

  if (!referenceId) {
    logger.error('[subscription.created] Unable to resolve referenceId', {
      subscriptionId: stripeSubscription.id,
      stripeCustomerId,
    })
    throw new Error('Unable to resolve referenceId for subscription')
  }

  if (!isEnterpriseMetadata(metadata)) {
    logger.error('[subscription.created] Invalid enterprise metadata shape', {
      subscriptionId: stripeSubscription.id,
      metadata,
    })
    throw new Error('Invalid enterprise metadata for subscription')
  }
  const enterpriseMetadata = metadata
  const metadataJson: Record<string, unknown> = { ...enterpriseMetadata }

  // Extract and parse seats and monthly price from metadata (they come as strings from Stripe)
  const seats = Number.parseInt(enterpriseMetadata.seats, 10)
  const monthlyPrice = Number.parseFloat(enterpriseMetadata.monthlyPrice)

  if (!seats || seats <= 0 || Number.isNaN(seats)) {
    logger.error('[subscription.created] Invalid or missing seats in enterprise metadata', {
      subscriptionId: stripeSubscription.id,
      seatsRaw: enterpriseMetadata.seats,
      seatsParsed: seats,
    })
    throw new Error('Enterprise subscription must include valid seats in metadata')
  }

  if (!monthlyPrice || monthlyPrice <= 0 || Number.isNaN(monthlyPrice)) {
    logger.error('[subscription.created] Invalid or missing monthlyPrice in enterprise metadata', {
      subscriptionId: stripeSubscription.id,
      monthlyPriceRaw: enterpriseMetadata.monthlyPrice,
      monthlyPriceParsed: monthlyPrice,
    })
    throw new Error('Enterprise subscription must include valid monthlyPrice in metadata')
  }

  // Get the first subscription item which contains the period information
  const referenceItem = stripeSubscription.items?.data?.[0]

  const subscriptionRow = {
    id: crypto.randomUUID(),
    plan: 'enterprise',
    referenceId,
    stripeCustomerId,
    stripeSubscriptionId: stripeSubscription.id,
    status: stripeSubscription.status || null,
    periodStart: referenceItem?.current_period_start
      ? new Date(referenceItem.current_period_start * 1000)
      : null,
    periodEnd: referenceItem?.current_period_end
      ? new Date(referenceItem.current_period_end * 1000)
      : null,
    cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end ?? null,
    seats: 1, // Enterprise uses metadata.seats for actual seat count, column is always 1
    trialStart: stripeSubscription.trial_start
      ? new Date(stripeSubscription.trial_start * 1000)
      : null,
    trialEnd: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000) : null,
    metadata: metadataJson,
  }

  const existing = await db
    .select({ id: subscription.id })
    .from(subscription)
    .where(eq(subscription.stripeSubscriptionId, stripeSubscription.id))
    .limit(1)

  if (existing.length > 0) {
    await db
      .update(subscription)
      .set({
        plan: subscriptionRow.plan,
        referenceId: subscriptionRow.referenceId,
        stripeCustomerId: subscriptionRow.stripeCustomerId,
        status: subscriptionRow.status,
        periodStart: subscriptionRow.periodStart,
        periodEnd: subscriptionRow.periodEnd,
        cancelAtPeriodEnd: subscriptionRow.cancelAtPeriodEnd,
        seats: 1, // Enterprise uses metadata.seats for actual seat count, column is always 1
        trialStart: subscriptionRow.trialStart,
        trialEnd: subscriptionRow.trialEnd,
        metadata: subscriptionRow.metadata,
      })
      .where(eq(subscription.stripeSubscriptionId, stripeSubscription.id))
  } else {
    await db.insert(subscription).values(subscriptionRow)
  }

  // Update the organization's usage limit to match the monthly price
  // The referenceId for enterprise plans is the organization ID
  try {
    await db
      .update(organization)
      .set({
        orgUsageLimit: monthlyPrice.toFixed(2),
        updatedAt: new Date(),
      })
      .where(eq(organization.id, referenceId))

    logger.info('[subscription.created] Updated organization usage limit', {
      organizationId: referenceId,
      usageLimit: monthlyPrice,
    })
  } catch (error) {
    logger.error('[subscription.created] Failed to update organization usage limit', {
      organizationId: referenceId,
      usageLimit: monthlyPrice,
      error,
    })
    // Don't throw - the subscription was created successfully, just log the error
  }

  logger.info('[subscription.created] Upserted enterprise subscription', {
    subscriptionId: subscriptionRow.id,
    referenceId: subscriptionRow.referenceId,
    plan: subscriptionRow.plan,
    status: subscriptionRow.status,
    monthlyPrice,
    seats,
    note: 'Seats from metadata, Stripe quantity set to 1',
  })

  try {
    const userDetails = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
      })
      .from(user)
      .where(eq(user.stripeCustomerId, stripeCustomerId))
      .limit(1)

    const orgDetails = await db
      .select({
        id: organization.id,
        name: organization.name,
      })
      .from(organization)
      .where(eq(organization.id, referenceId))
      .limit(1)

    if (userDetails.length > 0 && orgDetails.length > 0) {
      const user = userDetails[0]
      const org = orgDetails[0]

      const html = await renderEnterpriseSubscriptionEmail(user.name || user.email, user.email)

      const emailResult = await sendEmail({
        to: user.email,
        subject: getEmailSubject('enterprise-subscription'),
        html,
        from: getFromEmailAddress(),
        emailType: 'transactional',
      })

      if (emailResult.success) {
        logger.info('[subscription.created] Enterprise subscription email sent successfully', {
          userId: user.id,
          email: user.email,
          organizationId: org.id,
          subscriptionId: subscriptionRow.id,
        })
      } else {
        logger.warn('[subscription.created] Failed to send enterprise subscription email', {
          userId: user.id,
          email: user.email,
          error: emailResult.message,
        })
      }
    } else {
      logger.warn(
        '[subscription.created] Could not find user or organization for email notification',
        {
          userFound: userDetails.length > 0,
          orgFound: orgDetails.length > 0,
          stripeCustomerId,
          referenceId,
        }
      )
    }
  } catch (emailError) {
    logger.error('[subscription.created] Error sending enterprise subscription email', {
      error: emailError,
      stripeCustomerId,
      referenceId,
      subscriptionId: subscriptionRow.id,
    })
  }
}
```

--------------------------------------------------------------------------------

````
