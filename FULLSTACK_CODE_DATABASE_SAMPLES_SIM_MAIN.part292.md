---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 292
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 292 of 933)

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
Location: sim-main/apps/sim/app/api/organizations/[id]/members/route.ts
Signals: Next.js

```typescript
import { randomUUID } from 'crypto'
import { db } from '@sim/db'
import { invitation, member, organization, user, userStats } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getEmailSubject, renderInvitationEmail } from '@/components/emails/render-email'
import { getSession } from '@/lib/auth'
import { getUserUsageData } from '@/lib/billing/core/usage'
import { validateSeatAvailability } from '@/lib/billing/validation/seat-management'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import { sendEmail } from '@/lib/messaging/email/mailer'
import { quickValidateEmail } from '@/lib/messaging/email/validation'

const logger = createLogger('OrganizationMembersAPI')

/**
 * GET /api/organizations/[id]/members
 * Get organization members with optional usage data
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: organizationId } = await params
    const url = new URL(request.url)
    const includeUsage = url.searchParams.get('include') === 'usage'

    // Verify user has access to this organization
    const memberEntry = await db
      .select()
      .from(member)
      .where(and(eq(member.organizationId, organizationId), eq(member.userId, session.user.id)))
      .limit(1)

    if (memberEntry.length === 0) {
      return NextResponse.json(
        { error: 'Forbidden - Not a member of this organization' },
        { status: 403 }
      )
    }

    const userRole = memberEntry[0].role
    const hasAdminAccess = ['owner', 'admin'].includes(userRole)

    // Get organization members
    const query = db
      .select({
        id: member.id,
        userId: member.userId,
        organizationId: member.organizationId,
        role: member.role,
        createdAt: member.createdAt,
        userName: user.name,
        userEmail: user.email,
      })
      .from(member)
      .innerJoin(user, eq(member.userId, user.id))
      .where(eq(member.organizationId, organizationId))

    // Include usage data if requested and user has admin access
    if (includeUsage && hasAdminAccess) {
      const base = await db
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
          usageLimitUpdatedAt: userStats.usageLimitUpdatedAt,
        })
        .from(member)
        .innerJoin(user, eq(member.userId, user.id))
        .leftJoin(userStats, eq(user.id, userStats.userId))
        .where(eq(member.organizationId, organizationId))

      const membersWithUsage = await Promise.all(
        base.map(async (row) => {
          const usage = await getUserUsageData(row.userId)
          return {
            ...row,
            billingPeriodStart: usage.billingPeriodStart,
            billingPeriodEnd: usage.billingPeriodEnd,
          }
        })
      )

      return NextResponse.json({
        success: true,
        data: membersWithUsage,
        total: membersWithUsage.length,
        userRole,
        hasAdminAccess,
      })
    }

    const members = await query

    return NextResponse.json({
      success: true,
      data: members,
      total: members.length,
      userRole,
      hasAdminAccess,
    })
  } catch (error) {
    logger.error('Failed to get organization members', {
      organizationId: (await params).id,
      error,
    })

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/organizations/[id]/members
 * Invite new member to organization
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: organizationId } = await params
    const { email, role = 'member' } = await request.json()

    // Validate input
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!['admin', 'member'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Validate and normalize email
    const normalizedEmail = email.trim().toLowerCase()
    const validation = quickValidateEmail(normalizedEmail)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.reason || 'Invalid email format' },
        { status: 400 }
      )
    }

    // Verify user has admin access
    const memberEntry = await db
      .select()
      .from(member)
      .where(and(eq(member.organizationId, organizationId), eq(member.userId, session.user.id)))
      .limit(1)

    if (memberEntry.length === 0) {
      return NextResponse.json(
        { error: 'Forbidden - Not a member of this organization' },
        { status: 403 }
      )
    }

    if (!['owner', 'admin'].includes(memberEntry[0].role)) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    // Check seat availability
    const seatValidation = await validateSeatAvailability(organizationId, 1)
    if (!seatValidation.canInvite) {
      return NextResponse.json(
        {
          error: `Cannot invite member. Using ${seatValidation.currentSeats} of ${seatValidation.maxSeats} seats.`,
          details: seatValidation,
        },
        { status: 400 }
      )
    }

    // Check if user is already a member
    const existingUser = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, normalizedEmail))
      .limit(1)

    if (existingUser.length > 0) {
      const existingMember = await db
        .select()
        .from(member)
        .where(
          and(eq(member.organizationId, organizationId), eq(member.userId, existingUser[0].id))
        )
        .limit(1)

      if (existingMember.length > 0) {
        return NextResponse.json(
          { error: 'User is already a member of this organization' },
          { status: 400 }
        )
      }
    }

    // Check for existing pending invitation
    const existingInvitation = await db
      .select()
      .from(invitation)
      .where(
        and(
          eq(invitation.organizationId, organizationId),
          eq(invitation.email, normalizedEmail),
          eq(invitation.status, 'pending')
        )
      )
      .limit(1)

    if (existingInvitation.length > 0) {
      return NextResponse.json(
        { error: 'Pending invitation already exists for this email' },
        { status: 400 }
      )
    }

    // Create invitation
    const invitationId = randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

    await db.insert(invitation).values({
      id: invitationId,
      email: normalizedEmail,
      inviterId: session.user.id,
      organizationId,
      role,
      status: 'pending',
      expiresAt,
      createdAt: new Date(),
    })

    const organizationEntry = await db
      .select({ name: organization.name })
      .from(organization)
      .where(eq(organization.id, organizationId))
      .limit(1)

    const inviter = await db
      .select({ name: user.name })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1)

    const emailHtml = await renderInvitationEmail(
      inviter[0]?.name || 'Someone',
      organizationEntry[0]?.name || 'organization',
      `${getBaseUrl()}/invite/organization?id=${invitationId}`,
      normalizedEmail
    )

    const emailResult = await sendEmail({
      to: normalizedEmail,
      subject: getEmailSubject('invitation'),
      html: emailHtml,
      emailType: 'transactional',
    })

    if (emailResult.success) {
      logger.info('Member invitation sent', {
        email: normalizedEmail,
        organizationId,
        invitationId,
        role,
      })
    } else {
      logger.error('Failed to send invitation email', {
        email: normalizedEmail,
        error: emailResult.message,
      })
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: `Invitation sent to ${normalizedEmail}`,
      data: {
        invitationId,
        email: normalizedEmail,
        role,
        expiresAt,
      },
    })
  } catch (error) {
    logger.error('Failed to invite organization member', {
      organizationId: (await params).id,
      error,
    })

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/organizations/[id]/members/[memberId]/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { member, user, userStats } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { getUserUsageData } from '@/lib/billing/core/usage'
import { removeUserFromOrganization } from '@/lib/billing/organizations/membership'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('OrganizationMemberAPI')

const updateMemberSchema = z.object({
  role: z.enum(['owner', 'admin', 'member'], {
    errorMap: () => ({ message: 'Invalid role' }),
  }),
})

/**
 * GET /api/organizations/[id]/members/[memberId]
 * Get individual organization member details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: organizationId, memberId } = await params
    const url = new URL(request.url)
    const includeUsage = url.searchParams.get('include') === 'usage'

    const userMember = await db
      .select()
      .from(member)
      .where(and(eq(member.organizationId, organizationId), eq(member.userId, session.user.id)))
      .limit(1)

    if (userMember.length === 0) {
      return NextResponse.json(
        { error: 'Forbidden - Not a member of this organization' },
        { status: 403 }
      )
    }

    const userRole = userMember[0].role
    const hasAdminAccess = ['owner', 'admin'].includes(userRole)

    const memberQuery = db
      .select({
        id: member.id,
        userId: member.userId,
        organizationId: member.organizationId,
        role: member.role,
        createdAt: member.createdAt,
        userName: user.name,
        userEmail: user.email,
      })
      .from(member)
      .innerJoin(user, eq(member.userId, user.id))
      .where(and(eq(member.organizationId, organizationId), eq(member.userId, memberId)))
      .limit(1)

    const memberEntry = await memberQuery

    if (memberEntry.length === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    const canViewDetails = hasAdminAccess || session.user.id === memberId

    if (!canViewDetails) {
      return NextResponse.json({ error: 'Forbidden - Insufficient permissions' }, { status: 403 })
    }

    let memberData = memberEntry[0]

    if (includeUsage && hasAdminAccess) {
      const usageData = await db
        .select({
          currentPeriodCost: userStats.currentPeriodCost,
          currentUsageLimit: userStats.currentUsageLimit,
          usageLimitUpdatedAt: userStats.usageLimitUpdatedAt,
          lastPeriodCost: userStats.lastPeriodCost,
        })
        .from(userStats)
        .where(eq(userStats.userId, memberId))
        .limit(1)

      const computed = await getUserUsageData(memberId)

      if (usageData.length > 0) {
        memberData = {
          ...memberData,
          usage: {
            ...usageData[0],
            billingPeriodStart: computed.billingPeriodStart,
            billingPeriodEnd: computed.billingPeriodEnd,
          },
        } as typeof memberData & {
          usage: (typeof usageData)[0] & {
            billingPeriodStart: Date | null
            billingPeriodEnd: Date | null
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: memberData,
      userRole,
      hasAdminAccess,
    })
  } catch (error) {
    logger.error('Failed to get organization member', {
      organizationId: (await params).id,
      memberId: (await params).memberId,
      error,
    })

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PUT /api/organizations/[id]/members/[memberId]
 * Update organization member role
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: organizationId, memberId } = await params
    const body = await request.json()

    const validation = updateMemberSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return NextResponse.json({ error: firstError.message }, { status: 400 })
    }

    const { role } = validation.data

    const userMember = await db
      .select()
      .from(member)
      .where(and(eq(member.organizationId, organizationId), eq(member.userId, session.user.id)))
      .limit(1)

    if (userMember.length === 0) {
      return NextResponse.json(
        { error: 'Forbidden - Not a member of this organization' },
        { status: 403 }
      )
    }

    if (!['owner', 'admin'].includes(userMember[0].role)) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const targetMember = await db
      .select()
      .from(member)
      .where(and(eq(member.organizationId, organizationId), eq(member.userId, memberId)))
      .limit(1)

    if (targetMember.length === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    if (targetMember[0].role === 'owner') {
      return NextResponse.json({ error: 'Cannot change owner role' }, { status: 400 })
    }

    if (role === 'admin' && userMember[0].role !== 'owner') {
      return NextResponse.json(
        { error: 'Only owners can promote members to admin' },
        { status: 403 }
      )
    }

    if (targetMember[0].role === 'admin' && userMember[0].role !== 'owner') {
      return NextResponse.json({ error: 'Only owners can change admin roles' }, { status: 403 })
    }

    const updatedMember = await db
      .update(member)
      .set({ role })
      .where(and(eq(member.organizationId, organizationId), eq(member.userId, memberId)))
      .returning()

    if (updatedMember.length === 0) {
      return NextResponse.json({ error: 'Failed to update member role' }, { status: 500 })
    }

    logger.info('Organization member role updated', {
      organizationId,
      memberId,
      newRole: role,
      updatedBy: session.user.id,
    })

    return NextResponse.json({
      success: true,
      message: 'Member role updated successfully',
      data: {
        id: updatedMember[0].id,
        userId: updatedMember[0].userId,
        role: updatedMember[0].role,
        updatedBy: session.user.id,
      },
    })
  } catch (error) {
    logger.error('Failed to update organization member role', {
      organizationId: (await params).id,
      memberId: (await params).memberId,
      error,
    })

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/organizations/[id]/members/[memberId]
 * Remove member from organization
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: organizationId, memberId: targetUserId } = await params

    const userMember = await db
      .select()
      .from(member)
      .where(and(eq(member.organizationId, organizationId), eq(member.userId, session.user.id)))
      .limit(1)

    if (userMember.length === 0) {
      return NextResponse.json(
        { error: 'Forbidden - Not a member of this organization' },
        { status: 403 }
      )
    }

    const canRemoveMembers =
      ['owner', 'admin'].includes(userMember[0].role) || session.user.id === targetUserId

    if (!canRemoveMembers) {
      return NextResponse.json({ error: 'Forbidden - Insufficient permissions' }, { status: 403 })
    }

    const targetMember = await db
      .select({ id: member.id, role: member.role })
      .from(member)
      .where(and(eq(member.organizationId, organizationId), eq(member.userId, targetUserId)))
      .limit(1)

    if (targetMember.length === 0) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    const result = await removeUserFromOrganization({
      userId: targetUserId,
      organizationId,
      memberId: targetMember[0].id,
    })

    if (!result.success) {
      if (result.error === 'Cannot remove organization owner') {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }
      if (result.error === 'Member not found') {
        return NextResponse.json({ error: result.error }, { status: 404 })
      }
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    logger.info('Organization member removed', {
      organizationId,
      removedMemberId: targetUserId,
      removedBy: session.user.id,
      wasSelfRemoval: session.user.id === targetUserId,
      billingActions: result.billingActions,
    })

    return NextResponse.json({
      success: true,
      message:
        session.user.id === targetUserId
          ? 'You have left the organization'
          : 'Member removed successfully',
      data: {
        removedMemberId: targetUserId,
        removedBy: session.user.id,
        removedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    logger.error('Failed to remove organization member', {
      organizationId: (await params).id,
      memberId: (await params).memberId,
      error,
    })

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/organizations/[id]/seats/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { member, organization, subscription } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { getPlanPricing } from '@/lib/billing/core/billing'
import { requireStripeClient } from '@/lib/billing/stripe-client'
import { isBillingEnabled } from '@/lib/core/config/feature-flags'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('OrganizationSeatsAPI')

const updateSeatsSchema = z.object({
  seats: z.number().int().min(1, 'Minimum 1 seat required').max(50, 'Maximum 50 seats allowed'),
})

/**
 * PUT /api/organizations/[id]/seats
 * Update organization seat count using Stripe's subscription.update API.
 * This is the recommended approach for per-seat billing changes.
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isBillingEnabled) {
      return NextResponse.json({ error: 'Billing is not enabled' }, { status: 400 })
    }

    const { id: organizationId } = await params
    const body = await request.json()

    const validation = updateSeatsSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return NextResponse.json({ error: firstError.message }, { status: 400 })
    }

    const { seats: newSeatCount } = validation.data

    // Verify user has admin access to this organization
    const memberEntry = await db
      .select()
      .from(member)
      .where(and(eq(member.organizationId, organizationId), eq(member.userId, session.user.id)))
      .limit(1)

    if (memberEntry.length === 0) {
      return NextResponse.json(
        { error: 'Forbidden - Not a member of this organization' },
        { status: 403 }
      )
    }

    if (!['owner', 'admin'].includes(memberEntry[0].role)) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    // Get the organization's subscription
    const subscriptionRecord = await db
      .select()
      .from(subscription)
      .where(and(eq(subscription.referenceId, organizationId), eq(subscription.status, 'active')))
      .limit(1)

    if (subscriptionRecord.length === 0) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
    }

    const orgSubscription = subscriptionRecord[0]

    // Only team plans support seat changes (not enterprise - those are handled manually)
    if (orgSubscription.plan !== 'team') {
      return NextResponse.json(
        { error: 'Seat changes are only available for Team plans' },
        { status: 400 }
      )
    }

    if (!orgSubscription.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'No Stripe subscription found for this organization' },
        { status: 400 }
      )
    }

    // Validate that we're not reducing below current member count
    const memberCount = await db
      .select({ userId: member.userId })
      .from(member)
      .where(eq(member.organizationId, organizationId))

    if (newSeatCount < memberCount.length) {
      return NextResponse.json(
        {
          error: `Cannot reduce seats below current member count (${memberCount.length})`,
          currentMembers: memberCount.length,
        },
        { status: 400 }
      )
    }

    const currentSeats = orgSubscription.seats || 1

    // If no change, return early
    if (newSeatCount === currentSeats) {
      return NextResponse.json({
        success: true,
        message: 'No change in seat count',
        data: {
          seats: currentSeats,
          stripeSubscriptionId: orgSubscription.stripeSubscriptionId,
        },
      })
    }

    const stripe = requireStripeClient()

    // Get the Stripe subscription to find the subscription item ID
    const stripeSubscription = await stripe.subscriptions.retrieve(
      orgSubscription.stripeSubscriptionId
    )

    if (stripeSubscription.status !== 'active') {
      return NextResponse.json({ error: 'Stripe subscription is not active' }, { status: 400 })
    }

    // Find the subscription item (there should be only one for team plans)
    const subscriptionItem = stripeSubscription.items.data[0]

    if (!subscriptionItem) {
      return NextResponse.json(
        { error: 'No subscription item found in Stripe subscription' },
        { status: 500 }
      )
    }

    logger.info('Updating Stripe subscription quantity', {
      organizationId,
      stripeSubscriptionId: orgSubscription.stripeSubscriptionId,
      subscriptionItemId: subscriptionItem.id,
      currentSeats,
      newSeatCount,
      userId: session.user.id,
    })

    // Update the subscription item quantity using Stripe's recommended approach
    // This will automatically prorate the billing
    const updatedSubscription = await stripe.subscriptions.update(
      orgSubscription.stripeSubscriptionId,
      {
        items: [
          {
            id: subscriptionItem.id,
            quantity: newSeatCount,
          },
        ],
        proration_behavior: 'create_prorations', // Stripe's default - charge/credit immediately
      }
    )

    // Update our local database to reflect the change
    // Note: This will also be updated via webhook, but we update immediately for UX
    await db
      .update(subscription)
      .set({
        seats: newSeatCount,
      })
      .where(eq(subscription.id, orgSubscription.id))

    // Update orgUsageLimit to reflect new seat count (seats × basePrice as minimum)
    const { basePrice } = getPlanPricing('team')
    const newMinimumLimit = newSeatCount * basePrice

    const orgData = await db
      .select({ orgUsageLimit: organization.orgUsageLimit })
      .from(organization)
      .where(eq(organization.id, organizationId))
      .limit(1)

    const currentOrgLimit =
      orgData.length > 0 && orgData[0].orgUsageLimit
        ? Number.parseFloat(orgData[0].orgUsageLimit)
        : 0

    // Update if new minimum is higher than current limit
    if (newMinimumLimit > currentOrgLimit) {
      await db
        .update(organization)
        .set({
          orgUsageLimit: newMinimumLimit.toFixed(2),
          updatedAt: new Date(),
        })
        .where(eq(organization.id, organizationId))

      logger.info('Updated organization usage limit for seat change', {
        organizationId,
        newSeatCount,
        newMinimumLimit,
        previousLimit: currentOrgLimit,
      })
    }

    logger.info('Successfully updated seat count', {
      organizationId,
      stripeSubscriptionId: orgSubscription.stripeSubscriptionId,
      oldSeats: currentSeats,
      newSeats: newSeatCount,
      updatedBy: session.user.id,
      prorationBehavior: 'create_prorations',
    })

    return NextResponse.json({
      success: true,
      message:
        newSeatCount > currentSeats
          ? `Added ${newSeatCount - currentSeats} seat(s). Your billing has been adjusted.`
          : `Removed ${currentSeats - newSeatCount} seat(s). You'll receive a prorated credit.`,
      data: {
        seats: newSeatCount,
        previousSeats: currentSeats,
        stripeSubscriptionId: updatedSubscription.id,
        stripeStatus: updatedSubscription.status,
      },
    })
  } catch (error) {
    const { id: organizationId } = await params

    // Handle Stripe-specific errors
    if (error instanceof Error && 'type' in error) {
      const stripeError = error as any
      logger.error('Stripe error updating seats', {
        organizationId,
        type: stripeError.type,
        code: stripeError.code,
        message: stripeError.message,
      })

      return NextResponse.json(
        {
          error: stripeError.message || 'Failed to update seats in Stripe',
          code: stripeError.code,
        },
        { status: 400 }
      )
    }

    logger.error('Failed to update organization seats', {
      organizationId,
      error,
    })

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/organizations/[id]/workspaces/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { member, permissions, user, workspace } from '@sim/db/schema'
import { and, eq, or } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('OrganizationWorkspacesAPI')

/**
 * GET /api/organizations/[id]/workspaces
 * Get workspaces related to the organization with optional filtering
 * Query parameters:
 * - ?available=true - Only workspaces where user can invite others (admin permissions)
 * - ?member=userId - Workspaces where specific member has access
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: organizationId } = await params
    const url = new URL(request.url)
    const availableOnly = url.searchParams.get('available') === 'true'
    const memberId = url.searchParams.get('member')

    // Verify user is a member of this organization
    const memberEntry = await db
      .select()
      .from(member)
      .where(and(eq(member.organizationId, organizationId), eq(member.userId, session.user.id)))
      .limit(1)

    if (memberEntry.length === 0) {
      return NextResponse.json(
        {
          error: 'Forbidden - Not a member of this organization',
        },
        { status: 403 }
      )
    }

    const userRole = memberEntry[0].role
    const hasAdminAccess = ['owner', 'admin'].includes(userRole)

    if (availableOnly) {
      // Get workspaces where user has admin permissions (can invite others)
      const availableWorkspaces = await db
        .select({
          id: workspace.id,
          name: workspace.name,
          ownerId: workspace.ownerId,
          createdAt: workspace.createdAt,
          isOwner: eq(workspace.ownerId, session.user.id),
          permissionType: permissions.permissionType,
        })
        .from(workspace)
        .leftJoin(
          permissions,
          and(
            eq(permissions.entityType, 'workspace'),
            eq(permissions.entityId, workspace.id),
            eq(permissions.userId, session.user.id)
          )
        )
        .where(
          or(
            // User owns the workspace
            eq(workspace.ownerId, session.user.id),
            // User has admin permission on the workspace
            and(
              eq(permissions.userId, session.user.id),
              eq(permissions.entityType, 'workspace'),
              eq(permissions.permissionType, 'admin')
            )
          )
        )

      // Filter and format the results
      const workspacesWithInvitePermission = availableWorkspaces
        .filter((workspace) => {
          // Include if user owns the workspace OR has admin permission
          return workspace.isOwner || workspace.permissionType === 'admin'
        })
        .map((workspace) => ({
          id: workspace.id,
          name: workspace.name,
          isOwner: workspace.isOwner,
          canInvite: true, // All returned workspaces have invite permission
          createdAt: workspace.createdAt,
        }))

      logger.info('Retrieved available workspaces for organization member', {
        organizationId,
        userId: session.user.id,
        workspaceCount: workspacesWithInvitePermission.length,
      })

      return NextResponse.json({
        success: true,
        data: {
          workspaces: workspacesWithInvitePermission,
          totalCount: workspacesWithInvitePermission.length,
          filter: 'available',
        },
      })
    }

    if (memberId && hasAdminAccess) {
      // Get workspaces where specific member has access (admin only)
      const memberWorkspaces = await db
        .select({
          id: workspace.id,
          name: workspace.name,
          ownerId: workspace.ownerId,
          isOwner: eq(workspace.ownerId, memberId),
          permissionType: permissions.permissionType,
          createdAt: permissions.createdAt,
        })
        .from(workspace)
        .leftJoin(
          permissions,
          and(
            eq(permissions.entityType, 'workspace'),
            eq(permissions.entityId, workspace.id),
            eq(permissions.userId, memberId)
          )
        )
        .where(
          or(
            // Member owns the workspace
            eq(workspace.ownerId, memberId),
            // Member has permissions on the workspace
            and(eq(permissions.userId, memberId), eq(permissions.entityType, 'workspace'))
          )
        )

      const formattedWorkspaces = memberWorkspaces.map((workspace) => ({
        id: workspace.id,
        name: workspace.name,
        isOwner: workspace.isOwner,
        permission: workspace.permissionType,
        joinedAt: workspace.createdAt,
        createdAt: workspace.createdAt,
      }))

      return NextResponse.json({
        success: true,
        data: {
          workspaces: formattedWorkspaces,
          totalCount: formattedWorkspaces.length,
          filter: 'member',
          memberId,
        },
      })
    }

    // Default: Get all workspaces (basic info only for regular members)
    if (!hasAdminAccess) {
      return NextResponse.json({
        success: true,
        data: {
          workspaces: [],
          totalCount: 0,
          message: 'Workspace access information is only available to organization admins',
        },
      })
    }

    // For admins: Get summary of all workspaces
    const allWorkspaces = await db
      .select({
        id: workspace.id,
        name: workspace.name,
        ownerId: workspace.ownerId,
        createdAt: workspace.createdAt,
        ownerName: user.name,
      })
      .from(workspace)
      .leftJoin(user, eq(workspace.ownerId, user.id))

    return NextResponse.json({
      success: true,
      data: {
        workspaces: allWorkspaces,
        totalCount: allWorkspaces.length,
        filter: 'all',
      },
      userRole,
      hasAdminAccess,
    })
  } catch (error) {
    logger.error('Failed to get organization workspaces', { error })
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

````
