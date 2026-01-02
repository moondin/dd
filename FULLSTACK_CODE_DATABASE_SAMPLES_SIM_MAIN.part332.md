---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 332
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 332 of 933)

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
Location: sim-main/apps/sim/app/api/workspaces/invitations/route.ts
Signals: Next.js

```typescript
import { randomUUID } from 'crypto'
import { render } from '@react-email/render'
import { db } from '@sim/db'
import {
  permissions,
  type permissionTypeEnum,
  user,
  type WorkspaceInvitationStatus,
  workspace,
  workspaceInvitation,
} from '@sim/db/schema'
import { and, eq, inArray } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { WorkspaceInvitationEmail } from '@/components/emails/workspace-invitation'
import { getSession } from '@/lib/auth'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import { sendEmail } from '@/lib/messaging/email/mailer'
import { getFromEmailAddress } from '@/lib/messaging/email/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('WorkspaceInvitationsAPI')

type PermissionType = (typeof permissionTypeEnum.enumValues)[number]

// Get all invitations for the user's workspaces
export async function GET(req: NextRequest) {
  const session = await getSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get all workspaces where the user has permissions
    const userWorkspaces = await db
      .select({ id: workspace.id })
      .from(workspace)
      .innerJoin(
        permissions,
        and(
          eq(permissions.entityId, workspace.id),
          eq(permissions.entityType, 'workspace'),
          eq(permissions.userId, session.user.id)
        )
      )

    if (userWorkspaces.length === 0) {
      return NextResponse.json({ invitations: [] })
    }

    // Get all workspaceIds where the user is a member
    const workspaceIds = userWorkspaces.map((w) => w.id)

    // Find all invitations for those workspaces
    const invitations = await db
      .select()
      .from(workspaceInvitation)
      .where(inArray(workspaceInvitation.workspaceId, workspaceIds))

    return NextResponse.json({ invitations })
  } catch (error) {
    logger.error('Error fetching workspace invitations:', error)
    return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 })
  }
}

// Create a new invitation
export async function POST(req: NextRequest) {
  const session = await getSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { workspaceId, email, role = 'member', permission = 'read' } = await req.json()

    if (!workspaceId || !email) {
      return NextResponse.json({ error: 'Workspace ID and email are required' }, { status: 400 })
    }

    // Validate permission type
    const validPermissions: PermissionType[] = ['admin', 'write', 'read']
    if (!validPermissions.includes(permission)) {
      return NextResponse.json(
        { error: `Invalid permission: must be one of ${validPermissions.join(', ')}` },
        { status: 400 }
      )
    }

    // Check if user has admin permissions for this workspace
    const userPermission = await db
      .select()
      .from(permissions)
      .where(
        and(
          eq(permissions.entityId, workspaceId),
          eq(permissions.entityType, 'workspace'),
          eq(permissions.userId, session.user.id),
          eq(permissions.permissionType, 'admin')
        )
      )
      .then((rows) => rows[0])

    if (!userPermission) {
      return NextResponse.json(
        { error: 'You need admin permissions to invite users' },
        { status: 403 }
      )
    }

    // Get the workspace details for the email
    const workspaceDetails = await db
      .select()
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .then((rows) => rows[0])

    if (!workspaceDetails) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    // Check if the user is already a member
    // First find if a user with this email exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .then((rows) => rows[0])

    if (existingUser) {
      // Check if the user already has permissions for this workspace
      const existingPermission = await db
        .select()
        .from(permissions)
        .where(
          and(
            eq(permissions.entityId, workspaceId),
            eq(permissions.entityType, 'workspace'),
            eq(permissions.userId, existingUser.id)
          )
        )
        .then((rows) => rows[0])

      if (existingPermission) {
        return NextResponse.json(
          {
            error: `${email} already has access to this workspace`,
            email,
          },
          { status: 400 }
        )
      }
    }

    // Check if there's already a pending invitation
    const existingInvitation = await db
      .select()
      .from(workspaceInvitation)
      .where(
        and(
          eq(workspaceInvitation.workspaceId, workspaceId),
          eq(workspaceInvitation.email, email),
          eq(workspaceInvitation.status, 'pending' as WorkspaceInvitationStatus)
        )
      )
      .then((rows) => rows[0])

    if (existingInvitation) {
      return NextResponse.json(
        {
          error: `${email} has already been invited to this workspace`,
          email,
        },
        { status: 400 }
      )
    }

    // Generate a unique token and set expiry date (1 week from now)
    const token = randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

    // Create the invitation
    const invitationData = {
      id: randomUUID(),
      workspaceId,
      email,
      inviterId: session.user.id,
      role,
      status: 'pending' as WorkspaceInvitationStatus,
      token,
      permissions: permission,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Create invitation
    await db.insert(workspaceInvitation).values(invitationData)

    // Send the invitation email
    await sendInvitationEmail({
      to: email,
      inviterName: session.user.name || session.user.email || 'A user',
      workspaceName: workspaceDetails.name,
      invitationId: invitationData.id,
      token: token,
    })

    return NextResponse.json({ success: true, invitation: invitationData })
  } catch (error) {
    logger.error('Error creating workspace invitation:', error)
    return NextResponse.json({ error: 'Failed to create invitation' }, { status: 500 })
  }
}

// Helper function to send invitation email using the Resend API
async function sendInvitationEmail({
  to,
  inviterName,
  workspaceName,
  invitationId,
  token,
}: {
  to: string
  inviterName: string
  workspaceName: string
  invitationId: string
  token: string
}) {
  try {
    const baseUrl = getBaseUrl()
    // Use invitation ID in path, token in query parameter for security
    const invitationLink = `${baseUrl}/invite/${invitationId}?token=${token}`

    const emailHtml = await render(
      WorkspaceInvitationEmail({
        workspaceName,
        inviterName,
        invitationLink,
      })
    )

    const fromAddress = getFromEmailAddress()

    logger.info(`Attempting to send email from ${fromAddress} to ${to}`)

    const result = await sendEmail({
      to,
      subject: `You've been invited to join "${workspaceName}" on Sim`,
      html: emailHtml,
      from: fromAddress,
      emailType: 'transactional',
    })

    if (result.success) {
      logger.info(`Invitation email sent successfully to ${to}`, { result })
    } else {
      logger.error(`Failed to send invitation email to ${to}`, { error: result.message })
    }
  } catch (error) {
    logger.error('Error sending invitation email:', error)
    // Continue even if email fails - the invitation is still created
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.test.ts]---
Location: sim-main/apps/sim/app/api/workspaces/invitations/[invitationId]/route.test.ts
Signals: Next.js

```typescript
import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * Tests for workspace invitation by ID API route
 * Tests GET (details + token acceptance), DELETE (cancellation)
 *
 * @vitest-environment node
 */

const mockGetSession = vi.fn()
const mockHasWorkspaceAdminAccess = vi.fn()

let dbSelectResults: any[] = []
let dbSelectCallIndex = 0

const mockDbSelect = vi.fn().mockImplementation(() => ({
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  then: vi.fn().mockImplementation((callback: (rows: any[]) => any) => {
    const result = dbSelectResults[dbSelectCallIndex] || []
    dbSelectCallIndex++
    return Promise.resolve(callback ? callback(result) : result)
  }),
}))

const mockDbInsert = vi.fn().mockImplementation(() => ({
  values: vi.fn().mockResolvedValue(undefined),
}))

const mockDbUpdate = vi.fn().mockImplementation(() => ({
  set: vi.fn().mockReturnThis(),
  where: vi.fn().mockResolvedValue(undefined),
}))

const mockDbDelete = vi.fn().mockImplementation(() => ({
  where: vi.fn().mockResolvedValue(undefined),
}))

const mockDbTransaction = vi.fn().mockImplementation(async (callback: any) => {
  await callback({
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    }),
  })
})

vi.mock('@/lib/auth', () => ({
  getSession: () => mockGetSession(),
}))

vi.mock('@/lib/workspaces/permissions/utils', () => ({
  hasWorkspaceAdminAccess: (userId: string, workspaceId: string) =>
    mockHasWorkspaceAdminAccess(userId, workspaceId),
}))

vi.mock('@/lib/logs/console/logger', () => ({
  createLogger: vi.fn().mockReturnValue({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}))

vi.mock('@/lib/core/utils/urls', () => ({
  getBaseUrl: vi.fn().mockReturnValue('https://test.sim.ai'),
}))

vi.mock('@sim/db', () => ({
  db: {
    select: () => mockDbSelect(),
    insert: (table: any) => mockDbInsert(table),
    update: (table: any) => mockDbUpdate(table),
    delete: (table: any) => mockDbDelete(table),
    transaction: (callback: any) => mockDbTransaction(callback),
  },
}))

vi.mock('@sim/db/schema', () => ({
  workspaceInvitation: {
    id: 'id',
    workspaceId: 'workspaceId',
    email: 'email',
    inviterId: 'inviterId',
    status: 'status',
    token: 'token',
    permissions: 'permissions',
    expiresAt: 'expiresAt',
  },
  workspace: {
    id: 'id',
    name: 'name',
  },
  user: {
    id: 'id',
    email: 'email',
  },
  permissions: {
    id: 'id',
    entityType: 'entityType',
    entityId: 'entityId',
    userId: 'userId',
    permissionType: 'permissionType',
  },
}))

vi.mock('drizzle-orm', () => ({
  eq: vi.fn((a, b) => ({ type: 'eq', a, b })),
  and: vi.fn((...args) => ({ type: 'and', args })),
}))

vi.mock('crypto', () => ({
  randomUUID: vi.fn().mockReturnValue('mock-uuid-1234'),
}))

import { DELETE, GET } from './route'

const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
}

const mockWorkspace = {
  id: 'workspace-456',
  name: 'Test Workspace',
}

const mockInvitation = {
  id: 'invitation-789',
  workspaceId: 'workspace-456',
  email: 'invited@example.com',
  inviterId: 'inviter-321',
  status: 'pending',
  token: 'token-abc123',
  permissions: 'read',
  expiresAt: new Date(Date.now() + 86400000), // 1 day from now
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('Workspace Invitation [invitationId] API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    dbSelectResults = []
    dbSelectCallIndex = 0
  })

  describe('GET /api/workspaces/invitations/[invitationId]', () => {
    it('should return invitation details when called without token', async () => {
      mockGetSession.mockResolvedValue({ user: mockUser })
      dbSelectResults = [[mockInvitation], [mockWorkspace]]

      const request = new NextRequest('http://localhost/api/workspaces/invitations/invitation-789')
      const params = Promise.resolve({ invitationId: 'invitation-789' })

      const response = await GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toMatchObject({
        id: 'invitation-789',
        email: 'invited@example.com',
        status: 'pending',
        workspaceName: 'Test Workspace',
      })
    })

    it('should redirect to login when unauthenticated with token', async () => {
      mockGetSession.mockResolvedValue(null)

      const request = new NextRequest(
        'http://localhost/api/workspaces/invitations/token-abc123?token=token-abc123'
      )
      const params = Promise.resolve({ invitationId: 'token-abc123' })

      const response = await GET(request, { params })

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe(
        'https://test.sim.ai/invite/token-abc123?token=token-abc123'
      )
    })

    it('should return 401 when unauthenticated without token', async () => {
      mockGetSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost/api/workspaces/invitations/invitation-789')
      const params = Promise.resolve({ invitationId: 'invitation-789' })

      const response = await GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('should accept invitation when called with valid token', async () => {
      mockGetSession.mockResolvedValue({
        user: { ...mockUser, email: 'invited@example.com' },
      })

      dbSelectResults = [
        [mockInvitation], // invitation lookup
        [mockWorkspace], // workspace lookup
        [{ ...mockUser, email: 'invited@example.com' }], // user lookup
        [], // existing permission check (empty = no existing)
      ]

      const request = new NextRequest(
        'http://localhost/api/workspaces/invitations/token-abc123?token=token-abc123'
      )
      const params = Promise.resolve({ invitationId: 'token-abc123' })

      const response = await GET(request, { params })

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe('https://test.sim.ai/workspace/workspace-456/w')
    })

    it('should redirect to error page when invitation expired', async () => {
      mockGetSession.mockResolvedValue({
        user: { ...mockUser, email: 'invited@example.com' },
      })

      const expiredInvitation = {
        ...mockInvitation,
        expiresAt: new Date(Date.now() - 86400000), // 1 day ago
      }

      dbSelectResults = [[expiredInvitation], [mockWorkspace]]

      const request = new NextRequest(
        'http://localhost/api/workspaces/invitations/token-abc123?token=token-abc123'
      )
      const params = Promise.resolve({ invitationId: 'token-abc123' })

      const response = await GET(request, { params })

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe(
        'https://test.sim.ai/invite/invitation-789?error=expired'
      )
    })

    it('should redirect to error page when email mismatch', async () => {
      mockGetSession.mockResolvedValue({
        user: { ...mockUser, email: 'wrong@example.com' },
      })

      dbSelectResults = [
        [mockInvitation],
        [mockWorkspace],
        [{ ...mockUser, email: 'wrong@example.com' }],
      ]

      const request = new NextRequest(
        'http://localhost/api/workspaces/invitations/token-abc123?token=token-abc123'
      )
      const params = Promise.resolve({ invitationId: 'token-abc123' })

      const response = await GET(request, { params })

      expect(response.status).toBe(307)
      expect(response.headers.get('location')).toBe(
        'https://test.sim.ai/invite/invitation-789?error=email-mismatch'
      )
    })

    it('should return 404 when invitation not found', async () => {
      mockGetSession.mockResolvedValue({ user: mockUser })
      dbSelectResults = [[]] // Empty result

      const request = new NextRequest('http://localhost/api/workspaces/invitations/non-existent')
      const params = Promise.resolve({ invitationId: 'non-existent' })

      const response = await GET(request, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data).toEqual({ error: 'Invitation not found or has expired' })
    })
  })

  describe('DELETE /api/workspaces/invitations/[invitationId]', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockGetSession.mockResolvedValue(null)

      const request = new NextRequest(
        'http://localhost/api/workspaces/invitations/invitation-789',
        { method: 'DELETE' }
      )
      const params = Promise.resolve({ invitationId: 'invitation-789' })

      const response = await DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('should return 404 when invitation does not exist', async () => {
      mockGetSession.mockResolvedValue({ user: mockUser })
      dbSelectResults = [[]]

      const request = new NextRequest('http://localhost/api/workspaces/invitations/non-existent', {
        method: 'DELETE',
      })
      const params = Promise.resolve({ invitationId: 'non-existent' })

      const response = await DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data).toEqual({ error: 'Invitation not found' })
    })

    it('should return 403 when user lacks admin access', async () => {
      mockGetSession.mockResolvedValue({ user: mockUser })
      mockHasWorkspaceAdminAccess.mockResolvedValue(false)
      dbSelectResults = [[mockInvitation]]

      const request = new NextRequest(
        'http://localhost/api/workspaces/invitations/invitation-789',
        { method: 'DELETE' }
      )
      const params = Promise.resolve({ invitationId: 'invitation-789' })

      const response = await DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data).toEqual({ error: 'Insufficient permissions' })
      expect(mockHasWorkspaceAdminAccess).toHaveBeenCalledWith('user-123', 'workspace-456')
    })

    it('should return 400 when trying to delete non-pending invitation', async () => {
      mockGetSession.mockResolvedValue({ user: mockUser })
      mockHasWorkspaceAdminAccess.mockResolvedValue(true)

      const acceptedInvitation = { ...mockInvitation, status: 'accepted' }
      dbSelectResults = [[acceptedInvitation]]

      const request = new NextRequest(
        'http://localhost/api/workspaces/invitations/invitation-789',
        { method: 'DELETE' }
      )
      const params = Promise.resolve({ invitationId: 'invitation-789' })

      const response = await DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toEqual({ error: 'Can only delete pending invitations' })
    })

    it('should successfully delete pending invitation when user has admin access', async () => {
      mockGetSession.mockResolvedValue({ user: mockUser })
      mockHasWorkspaceAdminAccess.mockResolvedValue(true)
      dbSelectResults = [[mockInvitation]]

      const request = new NextRequest(
        'http://localhost/api/workspaces/invitations/invitation-789',
        { method: 'DELETE' }
      )
      const params = Promise.resolve({ invitationId: 'invitation-789' })

      const response = await DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ success: true })
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workspaces/invitations/[invitationId]/route.ts
Signals: Next.js

```typescript
import { randomUUID } from 'crypto'
import { render } from '@react-email/render'
import { db } from '@sim/db'
import {
  permissions,
  user,
  type WorkspaceInvitationStatus,
  workspace,
  workspaceInvitation,
} from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { WorkspaceInvitationEmail } from '@/components/emails/workspace-invitation'
import { getSession } from '@/lib/auth'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import { sendEmail } from '@/lib/messaging/email/mailer'
import { getFromEmailAddress } from '@/lib/messaging/email/utils'
import { hasWorkspaceAdminAccess } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('WorkspaceInvitationAPI')

// GET /api/workspaces/invitations/[invitationId] - Get invitation details OR accept via token
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> }
) {
  const { invitationId } = await params
  const session = await getSession()
  const token = req.nextUrl.searchParams.get('token')
  const isAcceptFlow = !!token // If token is provided, this is an acceptance flow

  if (!session?.user?.id) {
    // For token-based acceptance flows, redirect to login
    if (isAcceptFlow) {
      return NextResponse.redirect(new URL(`/invite/${invitationId}?token=${token}`, getBaseUrl()))
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const whereClause = token
      ? eq(workspaceInvitation.token, token)
      : eq(workspaceInvitation.id, invitationId)

    const invitation = await db
      .select()
      .from(workspaceInvitation)
      .where(whereClause)
      .then((rows) => rows[0])

    if (!invitation) {
      if (isAcceptFlow) {
        return NextResponse.redirect(
          new URL(`/invite/${invitationId}?error=invalid-token`, getBaseUrl())
        )
      }
      return NextResponse.json({ error: 'Invitation not found or has expired' }, { status: 404 })
    }

    if (new Date() > new Date(invitation.expiresAt)) {
      if (isAcceptFlow) {
        return NextResponse.redirect(
          new URL(`/invite/${invitation.id}?error=expired`, getBaseUrl())
        )
      }
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 })
    }

    const workspaceDetails = await db
      .select()
      .from(workspace)
      .where(eq(workspace.id, invitation.workspaceId))
      .then((rows) => rows[0])

    if (!workspaceDetails) {
      if (isAcceptFlow) {
        return NextResponse.redirect(
          new URL(`/invite/${invitation.id}?error=workspace-not-found`, getBaseUrl())
        )
      }
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    if (isAcceptFlow) {
      if (invitation.status !== ('pending' as WorkspaceInvitationStatus)) {
        return NextResponse.redirect(
          new URL(`/invite/${invitation.id}?error=already-processed`, getBaseUrl())
        )
      }

      const userEmail = session.user.email.toLowerCase()
      const invitationEmail = invitation.email.toLowerCase()

      const userData = await db
        .select()
        .from(user)
        .where(eq(user.id, session.user.id))
        .then((rows) => rows[0])

      if (!userData) {
        return NextResponse.redirect(
          new URL(`/invite/${invitation.id}?error=user-not-found`, getBaseUrl())
        )
      }

      const isValidMatch = userEmail === invitationEmail

      if (!isValidMatch) {
        return NextResponse.redirect(
          new URL(`/invite/${invitation.id}?error=email-mismatch`, getBaseUrl())
        )
      }

      const existingPermission = await db
        .select()
        .from(permissions)
        .where(
          and(
            eq(permissions.entityId, invitation.workspaceId),
            eq(permissions.entityType, 'workspace'),
            eq(permissions.userId, session.user.id)
          )
        )
        .then((rows) => rows[0])

      if (existingPermission) {
        await db
          .update(workspaceInvitation)
          .set({
            status: 'accepted' as WorkspaceInvitationStatus,
            updatedAt: new Date(),
          })
          .where(eq(workspaceInvitation.id, invitation.id))

        return NextResponse.redirect(
          new URL(`/workspace/${invitation.workspaceId}/w`, getBaseUrl())
        )
      }

      await db.transaction(async (tx) => {
        await tx.insert(permissions).values({
          id: randomUUID(),
          entityType: 'workspace' as const,
          entityId: invitation.workspaceId,
          userId: session.user.id,
          permissionType: invitation.permissions || 'read',
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        await tx
          .update(workspaceInvitation)
          .set({
            status: 'accepted' as WorkspaceInvitationStatus,
            updatedAt: new Date(),
          })
          .where(eq(workspaceInvitation.id, invitation.id))
      })

      return NextResponse.redirect(new URL(`/workspace/${invitation.workspaceId}/w`, getBaseUrl()))
    }

    return NextResponse.json({
      ...invitation,
      workspaceName: workspaceDetails.name,
    })
  } catch (error) {
    logger.error('Error fetching workspace invitation:', error)
    return NextResponse.json({ error: 'Failed to fetch invitation details' }, { status: 500 })
  }
}

// DELETE /api/workspaces/invitations/[invitationId] - Delete a workspace invitation
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> }
) {
  const { invitationId } = await params
  const session = await getSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const invitation = await db
      .select({
        id: workspaceInvitation.id,
        workspaceId: workspaceInvitation.workspaceId,
        email: workspaceInvitation.email,
        inviterId: workspaceInvitation.inviterId,
        status: workspaceInvitation.status,
      })
      .from(workspaceInvitation)
      .where(eq(workspaceInvitation.id, invitationId))
      .then((rows) => rows[0])

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
    }

    const hasAdminAccess = await hasWorkspaceAdminAccess(session.user.id, invitation.workspaceId)

    if (!hasAdminAccess) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    if (invitation.status !== ('pending' as WorkspaceInvitationStatus)) {
      return NextResponse.json({ error: 'Can only delete pending invitations' }, { status: 400 })
    }

    await db.delete(workspaceInvitation).where(eq(workspaceInvitation.id, invitationId))

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error deleting workspace invitation:', error)
    return NextResponse.json({ error: 'Failed to delete invitation' }, { status: 500 })
  }
}

// POST /api/workspaces/invitations/[invitationId] - Resend a workspace invitation
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> }
) {
  const { invitationId } = await params
  const session = await getSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const invitation = await db
      .select()
      .from(workspaceInvitation)
      .where(eq(workspaceInvitation.id, invitationId))
      .then((rows) => rows[0])

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
    }

    const hasAdminAccess = await hasWorkspaceAdminAccess(session.user.id, invitation.workspaceId)
    if (!hasAdminAccess) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    if (invitation.status !== ('pending' as WorkspaceInvitationStatus)) {
      return NextResponse.json({ error: 'Can only resend pending invitations' }, { status: 400 })
    }

    const ws = await db
      .select()
      .from(workspace)
      .where(eq(workspace.id, invitation.workspaceId))
      .then((rows) => rows[0])

    if (!ws) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    const newToken = randomUUID()
    const newExpiresAt = new Date()
    newExpiresAt.setDate(newExpiresAt.getDate() + 7)

    await db
      .update(workspaceInvitation)
      .set({ token: newToken, expiresAt: newExpiresAt, updatedAt: new Date() })
      .where(eq(workspaceInvitation.id, invitationId))

    const baseUrl = getBaseUrl()
    const invitationLink = `${baseUrl}/invite/${invitationId}?token=${newToken}`

    const emailHtml = await render(
      WorkspaceInvitationEmail({
        workspaceName: ws.name,
        inviterName: session.user.name || session.user.email || 'A user',
        invitationLink,
      })
    )

    const result = await sendEmail({
      to: invitation.email,
      subject: `You've been invited to join "${ws.name}" on Sim`,
      html: emailHtml,
      from: getFromEmailAddress(),
      emailType: 'transactional',
    })

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send invitation email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error resending workspace invitation:', error)
    return NextResponse.json({ error: 'Failed to resend invitation' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/workspaces/members/[id]/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { permissions, workspace } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'
import { hasWorkspaceAdminAccess } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('WorkspaceMemberAPI')
const deleteMemberSchema = z.object({
  workspaceId: z.string().uuid(),
})

// DELETE /api/workspaces/members/[id] - Remove a member from a workspace
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: userId } = await params
  const session = await getSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get the workspace ID from the request body or URL
    const body = deleteMemberSchema.parse(await req.json())
    const { workspaceId } = body

    const workspaceRow = await db
      .select({ billedAccountUserId: workspace.billedAccountUserId })
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .limit(1)

    if (!workspaceRow.length) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    if (workspaceRow[0].billedAccountUserId === userId) {
      return NextResponse.json(
        { error: 'Cannot remove the workspace billing account. Please reassign billing first.' },
        { status: 400 }
      )
    }

    // Check if the user to be removed actually has permissions for this workspace
    const userPermission = await db
      .select()
      .from(permissions)
      .where(
        and(
          eq(permissions.userId, userId),
          eq(permissions.entityType, 'workspace'),
          eq(permissions.entityId, workspaceId)
        )
      )
      .then((rows) => rows[0])

    if (!userPermission) {
      return NextResponse.json({ error: 'User not found in workspace' }, { status: 404 })
    }

    // Check if current user has admin access to this workspace
    const hasAdminAccess = await hasWorkspaceAdminAccess(session.user.id, workspaceId)
    const isSelf = userId === session.user.id

    if (!hasAdminAccess && !isSelf) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Prevent removing yourself if you're the last admin
    if (isSelf && userPermission.permissionType === 'admin') {
      const otherAdmins = await db
        .select()
        .from(permissions)
        .where(
          and(
            eq(permissions.entityType, 'workspace'),
            eq(permissions.entityId, workspaceId),
            eq(permissions.permissionType, 'admin')
          )
        )
        .then((rows) => rows.filter((row) => row.userId !== session.user.id))

      if (otherAdmins.length === 0) {
        return NextResponse.json(
          { error: 'Cannot remove the last admin from a workspace' },
          { status: 400 }
        )
      }
    }

    // Delete the user's permissions for this workspace
    await db
      .delete(permissions)
      .where(
        and(
          eq(permissions.userId, userId),
          eq(permissions.entityType, 'workspace'),
          eq(permissions.entityId, workspaceId)
        )
      )

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error removing workspace member:', error)
    return NextResponse.json({ error: 'Failed to remove workspace member' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

````
