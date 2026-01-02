---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 291
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 291 of 933)

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
Location: sim-main/apps/sim/app/api/organizations/[id]/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { member, organization } from '@sim/db/schema'
import { and, eq, ne } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import {
  getOrganizationSeatAnalytics,
  getOrganizationSeatInfo,
} from '@/lib/billing/validation/seat-management'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('OrganizationAPI')

const updateOrganizationSchema = z.object({
  name: z.string().trim().min(1, 'Organization name is required').optional(),
  slug: z
    .string()
    .trim()
    .min(1, 'Organization slug is required')
    .regex(
      /^[a-z0-9-_]+$/,
      'Slug can only contain lowercase letters, numbers, hyphens, and underscores'
    )
    .optional(),
  logo: z.string().nullable().optional(),
})

/**
 * GET /api/organizations/[id]
 * Get organization details including settings and seat information
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: organizationId } = await params
    const url = new URL(request.url)
    const includeSeats = url.searchParams.get('include') === 'seats'

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

    // Get organization data
    const organizationEntry = await db
      .select()
      .from(organization)
      .where(eq(organization.id, organizationId))
      .limit(1)

    if (organizationEntry.length === 0) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    const userRole = memberEntry[0].role
    const hasAdminAccess = ['owner', 'admin'].includes(userRole)

    const response: any = {
      success: true,
      data: {
        id: organizationEntry[0].id,
        name: organizationEntry[0].name,
        slug: organizationEntry[0].slug,
        logo: organizationEntry[0].logo,
        metadata: organizationEntry[0].metadata,
        createdAt: organizationEntry[0].createdAt,
        updatedAt: organizationEntry[0].updatedAt,
      },
      userRole,
      hasAdminAccess,
    }

    // Include seat information if requested
    if (includeSeats) {
      const seatInfo = await getOrganizationSeatInfo(organizationId)
      if (seatInfo) {
        response.data.seats = seatInfo
      }

      // Include analytics for admins
      if (hasAdminAccess) {
        const analytics = await getOrganizationSeatAnalytics(organizationId)
        if (analytics) {
          response.data.seatAnalytics = analytics
        }
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    logger.error('Failed to get organization', {
      organizationId: (await params).id,
      error,
    })

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PUT /api/organizations/[id]
 * Update organization settings (name, slug, logo)
 * Note: For seat updates, use PUT /api/organizations/[id]/seats instead
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: organizationId } = await params
    const body = await request.json()

    const validation = updateOrganizationSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return NextResponse.json({ error: firstError.message }, { status: 400 })
    }

    const { name, slug, logo } = validation.data

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

    // Handle settings update
    if (name !== undefined || slug !== undefined || logo !== undefined) {
      // Check if slug is already taken by another organization
      if (slug !== undefined) {
        const existingSlug = await db
          .select()
          .from(organization)
          .where(and(eq(organization.slug, slug), ne(organization.id, organizationId)))
          .limit(1)

        if (existingSlug.length > 0) {
          return NextResponse.json({ error: 'This slug is already taken' }, { status: 400 })
        }
      }

      // Build update object with only provided fields
      const updateData: any = { updatedAt: new Date() }
      if (name !== undefined) updateData.name = name
      if (slug !== undefined) updateData.slug = slug
      if (logo !== undefined) updateData.logo = logo

      // Update organization
      const updatedOrg = await db
        .update(organization)
        .set(updateData)
        .where(eq(organization.id, organizationId))
        .returning()

      if (updatedOrg.length === 0) {
        return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
      }

      logger.info('Organization settings updated', {
        organizationId,
        updatedBy: session.user.id,
        changes: { name, slug, logo },
      })

      return NextResponse.json({
        success: true,
        message: 'Organization updated successfully',
        data: {
          id: updatedOrg[0].id,
          name: updatedOrg[0].name,
          slug: updatedOrg[0].slug,
          logo: updatedOrg[0].logo,
          updatedAt: updatedOrg[0].updatedAt,
        },
      })
    }

    return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 })
  } catch (error) {
    logger.error('Failed to update organization', {
      organizationId: (await params).id,
      error,
    })

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE method removed - organization deletion not implemented
// If deletion is needed in the future, it should be implemented with proper
// cleanup of subscriptions, members, workspaces, and billing data
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/organizations/[id]/invitations/route.ts
Signals: Next.js

```typescript
import { randomUUID } from 'crypto'
import { db } from '@sim/db'
import {
  invitation,
  member,
  organization,
  user,
  type WorkspaceInvitationStatus,
  workspace,
  workspaceInvitation,
} from '@sim/db/schema'
import { and, eq, inArray, isNull, or } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import {
  getEmailSubject,
  renderBatchInvitationEmail,
  renderInvitationEmail,
} from '@/components/emails/render-email'
import { getSession } from '@/lib/auth'
import {
  validateBulkInvitations,
  validateSeatAvailability,
} from '@/lib/billing/validation/seat-management'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import { sendEmail } from '@/lib/messaging/email/mailer'
import { quickValidateEmail } from '@/lib/messaging/email/validation'
import { hasWorkspaceAdminAccess } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('OrganizationInvitations')

interface WorkspaceInvitation {
  workspaceId: string
  permission: 'admin' | 'write' | 'read'
}

/**
 * GET /api/organizations/[id]/invitations
 * Get all pending invitations for an organization
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: organizationId } = await params

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

    if (!hasAdminAccess) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const invitations = await db
      .select({
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        expiresAt: invitation.expiresAt,
        createdAt: invitation.createdAt,
        inviterName: user.name,
        inviterEmail: user.email,
      })
      .from(invitation)
      .leftJoin(user, eq(invitation.inviterId, user.id))
      .where(eq(invitation.organizationId, organizationId))
      .orderBy(invitation.createdAt)

    return NextResponse.json({
      success: true,
      data: {
        invitations,
        userRole,
      },
    })
  } catch (error) {
    logger.error('Failed to get organization invitations', {
      organizationId: (await params).id,
      error,
    })

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/organizations/[id]/invitations
 * Create organization invitations with optional validation and batch workspace invitations
 * Query parameters:
 * - ?validate=true - Only validate, don't send invitations
 * - ?batch=true - Include workspace invitations
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: organizationId } = await params
    const url = new URL(request.url)
    const validateOnly = url.searchParams.get('validate') === 'true'
    const isBatch = url.searchParams.get('batch') === 'true'

    const body = await request.json()
    const { email, emails, role = 'member', workspaceInvitations } = body

    const invitationEmails = email ? [email] : emails

    if (!invitationEmails || !Array.isArray(invitationEmails) || invitationEmails.length === 0) {
      return NextResponse.json({ error: 'Email or emails array is required' }, { status: 400 })
    }

    if (!['member', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

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

    if (validateOnly) {
      const validationResult = await validateBulkInvitations(organizationId, invitationEmails)

      logger.info('Invitation validation completed', {
        organizationId,
        userId: session.user.id,
        emailCount: invitationEmails.length,
        result: validationResult,
      })

      return NextResponse.json({
        success: true,
        data: validationResult,
        validatedBy: session.user.id,
        validatedAt: new Date().toISOString(),
      })
    }

    const seatValidation = await validateSeatAvailability(organizationId, invitationEmails.length)

    if (!seatValidation.canInvite) {
      return NextResponse.json(
        {
          error: seatValidation.reason,
          seatInfo: {
            currentSeats: seatValidation.currentSeats,
            maxSeats: seatValidation.maxSeats,
            availableSeats: seatValidation.availableSeats,
            seatsRequested: invitationEmails.length,
          },
        },
        { status: 400 }
      )
    }

    const organizationEntry = await db
      .select({ name: organization.name })
      .from(organization)
      .where(eq(organization.id, organizationId))
      .limit(1)

    if (organizationEntry.length === 0) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    const processedEmails = invitationEmails
      .map((email: string) => {
        const normalized = email.trim().toLowerCase()
        const validation = quickValidateEmail(normalized)
        return validation.isValid ? normalized : null
      })
      .filter(Boolean) as string[]

    if (processedEmails.length === 0) {
      return NextResponse.json({ error: 'No valid emails provided' }, { status: 400 })
    }

    const validWorkspaceInvitations: WorkspaceInvitation[] = []
    if (isBatch && workspaceInvitations && workspaceInvitations.length > 0) {
      for (const wsInvitation of workspaceInvitations) {
        const canInvite = await hasWorkspaceAdminAccess(session.user.id, wsInvitation.workspaceId)

        if (!canInvite) {
          return NextResponse.json(
            {
              error: `You don't have permission to invite users to workspace ${wsInvitation.workspaceId}`,
            },
            { status: 403 }
          )
        }

        validWorkspaceInvitations.push(wsInvitation)
      }
    }

    const existingMembers = await db
      .select({ userEmail: user.email })
      .from(member)
      .innerJoin(user, eq(member.userId, user.id))
      .where(eq(member.organizationId, organizationId))

    const existingEmails = existingMembers.map((m) => m.userEmail)
    const newEmails = processedEmails.filter((email: string) => !existingEmails.includes(email))

    const existingInvitations = await db
      .select({ email: invitation.email })
      .from(invitation)
      .where(and(eq(invitation.organizationId, organizationId), eq(invitation.status, 'pending')))

    const pendingEmails = existingInvitations.map((i) => i.email)
    const emailsToInvite = newEmails.filter((email: string) => !pendingEmails.includes(email))

    if (emailsToInvite.length === 0) {
      const isSingleEmail = processedEmails.length === 1
      const existingMembersEmails = processedEmails.filter((email: string) =>
        existingEmails.includes(email)
      )
      const pendingInvitationEmails = processedEmails.filter((email: string) =>
        pendingEmails.includes(email)
      )

      if (isSingleEmail) {
        if (existingMembersEmails.length > 0) {
          return NextResponse.json(
            {
              error: 'Failed to send invitation. User is already a part of the organization.',
            },
            { status: 400 }
          )
        }
        if (pendingInvitationEmails.length > 0) {
          return NextResponse.json(
            {
              error:
                'Failed to send invitation. A pending invitation already exists for this email.',
            },
            { status: 400 }
          )
        }
      }

      return NextResponse.json(
        {
          error: 'All emails are already members or have pending invitations.',
          details: {
            existingMembers: existingMembersEmails,
            pendingInvitations: pendingInvitationEmails,
          },
        },
        { status: 400 }
      )
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    const invitationsToCreate = emailsToInvite.map((email: string) => ({
      id: randomUUID(),
      email,
      inviterId: session.user.id,
      organizationId,
      role,
      status: 'pending' as const,
      expiresAt,
      createdAt: new Date(),
    }))

    await db.insert(invitation).values(invitationsToCreate)

    const workspaceInvitationIds: string[] = []
    if (isBatch && validWorkspaceInvitations.length > 0) {
      for (const email of emailsToInvite) {
        const orgInviteForEmail = invitationsToCreate.find((inv) => inv.email === email)
        for (const wsInvitation of validWorkspaceInvitations) {
          const wsInvitationId = randomUUID()
          const token = randomUUID()

          await db.insert(workspaceInvitation).values({
            id: wsInvitationId,
            workspaceId: wsInvitation.workspaceId,
            email,
            inviterId: session.user.id,
            role: 'member',
            status: 'pending',
            token,
            permissions: wsInvitation.permission,
            orgInvitationId: orgInviteForEmail?.id,
            expiresAt,
            createdAt: new Date(),
            updatedAt: new Date(),
          })

          workspaceInvitationIds.push(wsInvitationId)
        }
      }
    }

    const inviter = await db
      .select({ name: user.name })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1)

    for (const email of emailsToInvite) {
      const orgInvitation = invitationsToCreate.find((inv) => inv.email === email)
      if (!orgInvitation) continue

      let emailResult
      if (isBatch && validWorkspaceInvitations.length > 0) {
        const workspaceDetails = await db
          .select({
            id: workspace.id,
            name: workspace.name,
          })
          .from(workspace)
          .where(
            inArray(
              workspace.id,
              validWorkspaceInvitations.map((w) => w.workspaceId)
            )
          )

        const workspaceInvitationsWithNames = validWorkspaceInvitations.map((wsInv) => ({
          workspaceId: wsInv.workspaceId,
          workspaceName:
            workspaceDetails.find((w) => w.id === wsInv.workspaceId)?.name || 'Unknown Workspace',
          permission: wsInv.permission,
        }))

        const emailHtml = await renderBatchInvitationEmail(
          inviter[0]?.name || 'Someone',
          organizationEntry[0]?.name || 'organization',
          role,
          workspaceInvitationsWithNames,
          `${getBaseUrl()}/invite/${orgInvitation.id}`
        )

        emailResult = await sendEmail({
          to: email,
          subject: getEmailSubject('batch-invitation'),
          html: emailHtml,
          emailType: 'transactional',
        })
      } else {
        const emailHtml = await renderInvitationEmail(
          inviter[0]?.name || 'Someone',
          organizationEntry[0]?.name || 'organization',
          `${getBaseUrl()}/invite/${orgInvitation.id}`,
          email
        )

        emailResult = await sendEmail({
          to: email,
          subject: getEmailSubject('invitation'),
          html: emailHtml,
          emailType: 'transactional',
        })
      }

      if (!emailResult.success) {
        logger.error('Failed to send invitation email', {
          email,
          error: emailResult.message,
        })
      }
    }

    logger.info('Organization invitations created', {
      organizationId,
      invitedBy: session.user.id,
      invitationCount: invitationsToCreate.length,
      emails: emailsToInvite,
      role,
      isBatch,
      workspaceInvitationCount: workspaceInvitationIds.length,
    })

    return NextResponse.json({
      success: true,
      message: `${invitationsToCreate.length} invitation(s) sent successfully`,
      data: {
        invitationsSent: invitationsToCreate.length,
        invitedEmails: emailsToInvite,
        existingMembers: processedEmails.filter((email: string) => existingEmails.includes(email)),
        pendingInvitations: processedEmails.filter((email: string) =>
          pendingEmails.includes(email)
        ),
        invalidEmails: invitationEmails.filter(
          (email: string) => !quickValidateEmail(email.trim().toLowerCase()).isValid
        ),
        workspaceInvitations: isBatch ? validWorkspaceInvitations.length : 0,
        seatInfo: {
          seatsUsed: seatValidation.currentSeats + invitationsToCreate.length,
          maxSeats: seatValidation.maxSeats,
          availableSeats: seatValidation.availableSeats - invitationsToCreate.length,
        },
      },
    })
  } catch (error) {
    logger.error('Failed to create organization invitations', {
      organizationId: (await params).id,
      error,
    })

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/organizations/[id]/invitations?invitationId=...
 * Cancel a pending invitation
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: organizationId } = await params
    const url = new URL(request.url)
    const invitationId = url.searchParams.get('invitationId')

    if (!invitationId) {
      return NextResponse.json(
        { error: 'Invitation ID is required as query parameter' },
        { status: 400 }
      )
    }

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

    const result = await db
      .update(invitation)
      .set({ status: 'cancelled' })
      .where(
        and(
          eq(invitation.id, invitationId),
          eq(invitation.organizationId, organizationId),
          or(
            eq(invitation.status, 'pending'),
            eq(invitation.status, 'rejected') // Allow cancelling rejected invitations too
          )
        )
      )
      .returning()

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Invitation not found or already processed' },
        { status: 404 }
      )
    }

    await db
      .update(workspaceInvitation)
      .set({ status: 'cancelled' as WorkspaceInvitationStatus })
      .where(eq(workspaceInvitation.orgInvitationId, invitationId))

    await db
      .update(workspaceInvitation)
      .set({ status: 'cancelled' as WorkspaceInvitationStatus })
      .where(
        and(
          isNull(workspaceInvitation.orgInvitationId),
          eq(workspaceInvitation.email, result[0].email),
          eq(workspaceInvitation.status, 'pending' as WorkspaceInvitationStatus),
          eq(workspaceInvitation.inviterId, session.user.id)
        )
      )

    logger.info('Organization invitation cancelled', {
      organizationId,
      invitationId,
      cancelledBy: session.user.id,
      email: result[0].email,
    })

    return NextResponse.json({
      success: true,
      message: 'Invitation cancelled successfully',
    })
  } catch (error) {
    logger.error('Failed to cancel organization invitation', {
      organizationId: (await params).id,
      error,
    })

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/organizations/[id]/invitations/[invitationId]/route.ts
Signals: Next.js, Zod

```typescript
import { randomUUID } from 'crypto'
import { db } from '@sim/db'
import {
  invitation,
  member,
  organization,
  permissions,
  subscription as subscriptionTable,
  user,
  userStats,
  type WorkspaceInvitationStatus,
  workspaceInvitation,
} from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { requireStripeClient } from '@/lib/billing/stripe-client'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('OrganizationInvitation')

const updateInvitationSchema = z.object({
  status: z.enum(['accepted', 'rejected', 'cancelled'], {
    errorMap: () => ({ message: 'Invalid status. Must be "accepted", "rejected", or "cancelled"' }),
  }),
})

// Get invitation details
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; invitationId: string }> }
) {
  const { id: organizationId, invitationId } = await params
  const session = await getSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const orgInvitation = await db
      .select()
      .from(invitation)
      .where(and(eq(invitation.id, invitationId), eq(invitation.organizationId, organizationId)))
      .then((rows) => rows[0])

    if (!orgInvitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
    }

    const org = await db
      .select()
      .from(organization)
      .where(eq(organization.id, organizationId))
      .then((rows) => rows[0])

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    return NextResponse.json({
      invitation: orgInvitation,
      organization: org,
    })
  } catch (error) {
    logger.error('Error fetching organization invitation:', error)
    return NextResponse.json({ error: 'Failed to fetch invitation' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; invitationId: string }> }
) {
  const { id: organizationId, invitationId } = await params

  logger.info(
    '[PUT /api/organizations/[id]/invitations/[invitationId]] Invitation acceptance request',
    {
      organizationId,
      invitationId,
      path: req.url,
    }
  )

  const session = await getSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()

    const validation = updateInvitationSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return NextResponse.json({ error: firstError.message }, { status: 400 })
    }

    const { status } = validation.data

    const orgInvitation = await db
      .select()
      .from(invitation)
      .where(and(eq(invitation.id, invitationId), eq(invitation.organizationId, organizationId)))
      .then((rows) => rows[0])

    if (!orgInvitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
    }

    if (orgInvitation.status !== 'pending') {
      return NextResponse.json({ error: 'Invitation already processed' }, { status: 400 })
    }

    if (status === 'accepted') {
      const userData = await db
        .select()
        .from(user)
        .where(eq(user.id, session.user.id))
        .then((rows) => rows[0])

      if (!userData || userData.email.toLowerCase() !== orgInvitation.email.toLowerCase()) {
        return NextResponse.json(
          { error: 'Email mismatch. You can only accept invitations sent to your email address.' },
          { status: 403 }
        )
      }
    }

    if (status === 'cancelled') {
      const isAdmin = await db
        .select()
        .from(member)
        .where(
          and(
            eq(member.organizationId, organizationId),
            eq(member.userId, session.user.id),
            eq(member.role, 'admin')
          )
        )
        .then((rows) => rows.length > 0)

      if (!isAdmin) {
        return NextResponse.json(
          { error: 'Only organization admins can cancel invitations' },
          { status: 403 }
        )
      }
    }

    // Enforce: user can only be part of a single organization
    if (status === 'accepted') {
      // Check if user is already a member of ANY organization
      const existingOrgMemberships = await db
        .select({ organizationId: member.organizationId })
        .from(member)
        .where(eq(member.userId, session.user.id))

      if (existingOrgMemberships.length > 0) {
        // Check if already a member of THIS specific organization
        const alreadyMemberOfThisOrg = existingOrgMemberships.some(
          (m) => m.organizationId === organizationId
        )

        if (alreadyMemberOfThisOrg) {
          return NextResponse.json(
            { error: 'You are already a member of this organization' },
            { status: 400 }
          )
        }

        // Member of a different organization
        // Mark the invitation as rejected since they can't accept it
        await db
          .update(invitation)
          .set({
            status: 'rejected',
          })
          .where(eq(invitation.id, invitationId))

        return NextResponse.json(
          {
            error:
              'You are already a member of an organization. Leave your current organization before accepting a new invitation.',
          },
          { status: 409 }
        )
      }
    }

    let personalProToCancel: any = null

    await db.transaction(async (tx) => {
      await tx.update(invitation).set({ status }).where(eq(invitation.id, invitationId))

      if (status === 'accepted') {
        await tx.insert(member).values({
          id: randomUUID(),
          userId: session.user.id,
          organizationId,
          role: orgInvitation.role,
          createdAt: new Date(),
        })

        // Snapshot Pro usage and cancel Pro subscription when joining a paid team
        try {
          const orgSubs = await tx
            .select()
            .from(subscriptionTable)
            .where(
              and(
                eq(subscriptionTable.referenceId, organizationId),
                eq(subscriptionTable.status, 'active')
              )
            )
            .limit(1)

          const orgSub = orgSubs[0]
          const orgIsPaid = orgSub && (orgSub.plan === 'team' || orgSub.plan === 'enterprise')

          if (orgIsPaid) {
            const userId = session.user.id

            // Find user's active personal Pro subscription
            const personalSubs = await tx
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

            const personalPro = personalSubs[0]
            if (personalPro) {
              // Snapshot the current Pro usage before resetting
              const userStatsRows = await tx
                .select({
                  currentPeriodCost: userStats.currentPeriodCost,
                })
                .from(userStats)
                .where(eq(userStats.userId, userId))
                .limit(1)

              if (userStatsRows.length > 0) {
                const currentProUsage = userStatsRows[0].currentPeriodCost || '0'

                // Snapshot Pro usage and reset currentPeriodCost so new usage goes to team
                await tx
                  .update(userStats)
                  .set({
                    proPeriodCostSnapshot: currentProUsage,
                    currentPeriodCost: '0', // Reset so new usage is attributed to team
                    currentPeriodCopilotCost: '0', // Reset copilot cost for new period
                  })
                  .where(eq(userStats.userId, userId))

                logger.info('Snapshotted Pro usage when joining team', {
                  userId,
                  proUsageSnapshot: currentProUsage,
                  organizationId,
                })
              }

              // Mark for cancellation after transaction
              if (personalPro.cancelAtPeriodEnd !== true) {
                personalProToCancel = personalPro
              }
            }
          }
        } catch (error) {
          logger.error('Failed to handle Pro user joining team', {
            userId: session.user.id,
            organizationId,
            error,
          })
          // Don't fail the whole invitation acceptance due to this
        }

        const linkedWorkspaceInvitations = await tx
          .select()
          .from(workspaceInvitation)
          .where(
            and(
              eq(workspaceInvitation.orgInvitationId, invitationId),
              eq(workspaceInvitation.status, 'pending' as WorkspaceInvitationStatus)
            )
          )

        for (const wsInvitation of linkedWorkspaceInvitations) {
          await tx
            .update(workspaceInvitation)
            .set({
              status: 'accepted' as WorkspaceInvitationStatus,
              updatedAt: new Date(),
            })
            .where(eq(workspaceInvitation.id, wsInvitation.id))

          await tx.insert(permissions).values({
            id: randomUUID(),
            entityType: 'workspace',
            entityId: wsInvitation.workspaceId,
            userId: session.user.id,
            permissionType: wsInvitation.permissions || 'read',
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }
      } else if (status === 'cancelled') {
        await tx
          .update(workspaceInvitation)
          .set({ status: 'cancelled' as WorkspaceInvitationStatus })
          .where(eq(workspaceInvitation.orgInvitationId, invitationId))
      }
    })

    // Handle Pro subscription cancellation after transaction commits
    if (personalProToCancel) {
      try {
        const stripe = requireStripeClient()
        if (personalProToCancel.stripeSubscriptionId) {
          try {
            await stripe.subscriptions.update(personalProToCancel.stripeSubscriptionId, {
              cancel_at_period_end: true,
            })
          } catch (stripeError) {
            logger.error('Failed to set cancel_at_period_end on Stripe for personal Pro', {
              userId: session.user.id,
              subscriptionId: personalProToCancel.id,
              stripeSubscriptionId: personalProToCancel.stripeSubscriptionId,
              error: stripeError,
            })
          }
        }

        await db
          .update(subscriptionTable)
          .set({ cancelAtPeriodEnd: true })
          .where(eq(subscriptionTable.id, personalProToCancel.id))

        logger.info('Auto-cancelled personal Pro at period end after joining paid team', {
          userId: session.user.id,
          personalSubscriptionId: personalProToCancel.id,
          organizationId,
        })
      } catch (dbError) {
        logger.error('Failed to update DB cancelAtPeriodEnd for personal Pro', {
          userId: session.user.id,
          subscriptionId: personalProToCancel.id,
          error: dbError,
        })
      }
    }

    logger.info(`Organization invitation ${status}`, {
      organizationId,
      invitationId,
      userId: session.user.id,
      email: orgInvitation.email,
    })

    return NextResponse.json({
      success: true,
      message: `Invitation ${status} successfully`,
      invitation: { ...orgInvitation, status },
    })
  } catch (error) {
    logger.error(`Error updating organization invitation:`, error)
    return NextResponse.json({ error: 'Failed to update invitation' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

````
