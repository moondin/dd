---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 320
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 320 of 933)

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

---[FILE: types.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/types.ts

```typescript
/**
 * Admin API Types
 *
 * This file defines the types for the Admin API endpoints.
 * All responses follow a consistent structure for predictability.
 */

import type {
  member,
  organization,
  subscription,
  user,
  userStats,
  workflow,
  workflowFolder,
  workspace,
} from '@sim/db/schema'
import type { InferSelectModel } from 'drizzle-orm'
import type { Edge } from 'reactflow'
import type { BlockState, Loop, Parallel } from '@/stores/workflows/workflow/types'

// =============================================================================
// Database Model Types (inferred from schema)
// =============================================================================

export type DbUser = InferSelectModel<typeof user>
export type DbWorkspace = InferSelectModel<typeof workspace>
export type DbWorkflow = InferSelectModel<typeof workflow>
export type DbWorkflowFolder = InferSelectModel<typeof workflowFolder>
export type DbOrganization = InferSelectModel<typeof organization>
export type DbSubscription = InferSelectModel<typeof subscription>
export type DbMember = InferSelectModel<typeof member>
export type DbUserStats = InferSelectModel<typeof userStats>

// =============================================================================
// Pagination
// =============================================================================

export interface PaginationParams {
  limit: number
  offset: number
}

export interface PaginationMeta {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export const DEFAULT_LIMIT = 50
export const MAX_LIMIT = 250

export function parsePaginationParams(url: URL): PaginationParams {
  const limitParam = url.searchParams.get('limit')
  const offsetParam = url.searchParams.get('offset')

  let limit = limitParam ? Number.parseInt(limitParam, 10) : DEFAULT_LIMIT
  let offset = offsetParam ? Number.parseInt(offsetParam, 10) : 0

  if (Number.isNaN(limit) || limit < 1) limit = DEFAULT_LIMIT
  if (limit > MAX_LIMIT) limit = MAX_LIMIT
  if (Number.isNaN(offset) || offset < 0) offset = 0

  return { limit, offset }
}

export function createPaginationMeta(total: number, limit: number, offset: number): PaginationMeta {
  return {
    total,
    limit,
    offset,
    hasMore: offset + limit < total,
  }
}

// =============================================================================
// API Response Types
// =============================================================================

export interface AdminListResponse<T> {
  data: T[]
  pagination: PaginationMeta
}

export interface AdminSingleResponse<T> {
  data: T
}

export interface AdminErrorResponse {
  error: {
    code: string
    message: string
    details?: unknown
  }
}

// =============================================================================
// User Types
// =============================================================================

export interface AdminUser {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: string
  updatedAt: string
}

export function toAdminUser(dbUser: DbUser): AdminUser {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    emailVerified: dbUser.emailVerified,
    image: dbUser.image,
    createdAt: dbUser.createdAt.toISOString(),
    updatedAt: dbUser.updatedAt.toISOString(),
  }
}

// =============================================================================
// Workspace Types
// =============================================================================

export interface AdminWorkspace {
  id: string
  name: string
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface AdminWorkspaceDetail extends AdminWorkspace {
  workflowCount: number
  folderCount: number
}

export function toAdminWorkspace(dbWorkspace: DbWorkspace): AdminWorkspace {
  return {
    id: dbWorkspace.id,
    name: dbWorkspace.name,
    ownerId: dbWorkspace.ownerId,
    createdAt: dbWorkspace.createdAt.toISOString(),
    updatedAt: dbWorkspace.updatedAt.toISOString(),
  }
}

// =============================================================================
// Folder Types
// =============================================================================

export interface AdminFolder {
  id: string
  name: string
  parentId: string | null
  color: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export function toAdminFolder(dbFolder: DbWorkflowFolder): AdminFolder {
  return {
    id: dbFolder.id,
    name: dbFolder.name,
    parentId: dbFolder.parentId,
    color: dbFolder.color,
    sortOrder: dbFolder.sortOrder,
    createdAt: dbFolder.createdAt.toISOString(),
    updatedAt: dbFolder.updatedAt.toISOString(),
  }
}

// =============================================================================
// Workflow Types
// =============================================================================

export interface AdminWorkflow {
  id: string
  name: string
  description: string | null
  color: string
  workspaceId: string | null
  folderId: string | null
  isDeployed: boolean
  deployedAt: string | null
  runCount: number
  lastRunAt: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminWorkflowDetail extends AdminWorkflow {
  blockCount: number
  edgeCount: number
}

export function toAdminWorkflow(dbWorkflow: DbWorkflow): AdminWorkflow {
  return {
    id: dbWorkflow.id,
    name: dbWorkflow.name,
    description: dbWorkflow.description,
    color: dbWorkflow.color,
    workspaceId: dbWorkflow.workspaceId,
    folderId: dbWorkflow.folderId,
    isDeployed: dbWorkflow.isDeployed,
    deployedAt: dbWorkflow.deployedAt?.toISOString() ?? null,
    runCount: dbWorkflow.runCount,
    lastRunAt: dbWorkflow.lastRunAt?.toISOString() ?? null,
    createdAt: dbWorkflow.createdAt.toISOString(),
    updatedAt: dbWorkflow.updatedAt.toISOString(),
  }
}

// =============================================================================
// Workflow Variable Types
// =============================================================================

export type VariableType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'plain'

export interface WorkflowVariable {
  id: string
  name: string
  type: VariableType
  value: unknown
}

// =============================================================================
// Export/Import Types
// =============================================================================

export interface WorkflowExportState {
  blocks: Record<string, BlockState>
  edges: Edge[]
  loops: Record<string, Loop>
  parallels: Record<string, Parallel>
  metadata?: {
    name?: string
    description?: string
    color?: string
    exportedAt?: string
  }
  variables?: WorkflowVariable[]
}

export interface WorkflowExportPayload {
  version: '1.0'
  exportedAt: string
  workflow: {
    id: string
    name: string
    description: string | null
    color: string
    workspaceId: string | null
    folderId: string | null
  }
  state: WorkflowExportState
}

export interface FolderExportPayload {
  id: string
  name: string
  parentId: string | null
}

export interface WorkspaceExportPayload {
  version: '1.0'
  exportedAt: string
  workspace: {
    id: string
    name: string
  }
  workflows: Array<{
    workflow: WorkflowExportPayload['workflow']
    state: WorkflowExportState
  }>
  folders: FolderExportPayload[]
}

// =============================================================================
// Import Types
// =============================================================================

export interface WorkflowImportRequest {
  workspaceId: string
  folderId?: string
  name?: string
  workflow: WorkflowExportPayload | WorkflowExportState | string
}

export interface WorkspaceImportRequest {
  workflows: Array<{
    content: string | WorkflowExportPayload | WorkflowExportState
    name?: string
    folderPath?: string[]
  }>
}

export interface ImportResult {
  workflowId: string
  name: string
  success: boolean
  error?: string
}

export interface WorkspaceImportResponse {
  imported: number
  failed: number
  results: ImportResult[]
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Parse workflow variables from database JSON format to array format.
 * Handles both array and Record<string, Variable> formats.
 */
export function parseWorkflowVariables(
  dbVariables: DbWorkflow['variables']
): WorkflowVariable[] | undefined {
  if (!dbVariables) return undefined

  try {
    const varsObj = typeof dbVariables === 'string' ? JSON.parse(dbVariables) : dbVariables

    if (Array.isArray(varsObj)) {
      return varsObj.map((v) => ({
        id: v.id,
        name: v.name,
        type: v.type,
        value: v.value,
      }))
    }

    if (typeof varsObj === 'object' && varsObj !== null) {
      return Object.values(varsObj).map((v: unknown) => {
        const variable = v as { id: string; name: string; type: VariableType; value: unknown }
        return {
          id: variable.id,
          name: variable.name,
          type: variable.type,
          value: variable.value,
        }
      })
    }
  } catch {
    // pass
  }

  return undefined
}

/**
 * Extract workflow metadata from various export formats.
 * Handles both full export payload and raw state formats.
 */
export function extractWorkflowMetadata(
  workflowJson: unknown,
  overrideName?: string
): { name: string; color: string; description: string } {
  const defaults = {
    name: overrideName || 'Imported Workflow',
    color: '#3972F6',
    description: 'Imported via Admin API',
  }

  if (!workflowJson || typeof workflowJson !== 'object') {
    return defaults
  }

  const parsed = workflowJson as Record<string, unknown>

  const name =
    overrideName ||
    getNestedString(parsed, 'workflow.name') ||
    getNestedString(parsed, 'state.metadata.name') ||
    getNestedString(parsed, 'metadata.name') ||
    defaults.name

  const color =
    getNestedString(parsed, 'workflow.color') ||
    getNestedString(parsed, 'state.metadata.color') ||
    getNestedString(parsed, 'metadata.color') ||
    defaults.color

  const description =
    getNestedString(parsed, 'workflow.description') ||
    getNestedString(parsed, 'state.metadata.description') ||
    getNestedString(parsed, 'metadata.description') ||
    defaults.description

  return { name, color, description }
}

/**
 * Safely get a nested string value from an object.
 */
function getNestedString(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.')
  let current: unknown = obj

  for (const part of parts) {
    if (current === null || typeof current !== 'object') {
      return undefined
    }
    current = (current as Record<string, unknown>)[part]
  }

  return typeof current === 'string' ? current : undefined
}

// =============================================================================
// Organization Types
// =============================================================================

export interface AdminOrganization {
  id: string
  name: string
  slug: string
  logo: string | null
  orgUsageLimit: string | null
  storageUsedBytes: number
  departedMemberUsage: string
  createdAt: string
  updatedAt: string
}

export interface AdminOrganizationDetail extends AdminOrganization {
  memberCount: number
  subscription: AdminSubscription | null
}

export function toAdminOrganization(dbOrg: DbOrganization): AdminOrganization {
  return {
    id: dbOrg.id,
    name: dbOrg.name,
    slug: dbOrg.slug,
    logo: dbOrg.logo,
    orgUsageLimit: dbOrg.orgUsageLimit,
    storageUsedBytes: dbOrg.storageUsedBytes,
    departedMemberUsage: dbOrg.departedMemberUsage,
    createdAt: dbOrg.createdAt.toISOString(),
    updatedAt: dbOrg.updatedAt.toISOString(),
  }
}

// =============================================================================
// Subscription Types
// =============================================================================

export interface AdminSubscription {
  id: string
  plan: string
  referenceId: string
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  status: string | null
  periodStart: string | null
  periodEnd: string | null
  cancelAtPeriodEnd: boolean | null
  seats: number | null
  trialStart: string | null
  trialEnd: string | null
  metadata: unknown
}

export function toAdminSubscription(dbSub: DbSubscription): AdminSubscription {
  return {
    id: dbSub.id,
    plan: dbSub.plan,
    referenceId: dbSub.referenceId,
    stripeCustomerId: dbSub.stripeCustomerId,
    stripeSubscriptionId: dbSub.stripeSubscriptionId,
    status: dbSub.status,
    periodStart: dbSub.periodStart?.toISOString() ?? null,
    periodEnd: dbSub.periodEnd?.toISOString() ?? null,
    cancelAtPeriodEnd: dbSub.cancelAtPeriodEnd,
    seats: dbSub.seats,
    trialStart: dbSub.trialStart?.toISOString() ?? null,
    trialEnd: dbSub.trialEnd?.toISOString() ?? null,
    metadata: dbSub.metadata,
  }
}

// =============================================================================
// Member Types
// =============================================================================

export interface AdminMember {
  id: string
  userId: string
  organizationId: string
  role: string
  createdAt: string
  // Joined user info
  userName: string
  userEmail: string
}

export interface AdminMemberDetail extends AdminMember {
  // Billing/usage info from userStats
  currentPeriodCost: string
  currentUsageLimit: string | null
  lastActive: string | null
  billingBlocked: boolean
}

// =============================================================================
// User Billing Types
// =============================================================================

export interface AdminUserBilling {
  userId: string
  // User info
  userName: string
  userEmail: string
  stripeCustomerId: string | null
  // Usage stats
  totalManualExecutions: number
  totalApiCalls: number
  totalWebhookTriggers: number
  totalScheduledExecutions: number
  totalChatExecutions: number
  totalTokensUsed: number
  totalCost: string
  currentUsageLimit: string | null
  currentPeriodCost: string
  lastPeriodCost: string | null
  billedOverageThisPeriod: string
  storageUsedBytes: number
  lastActive: string | null
  billingBlocked: boolean
  // Copilot usage
  totalCopilotCost: string
  currentPeriodCopilotCost: string
  lastPeriodCopilotCost: string | null
  totalCopilotTokens: number
  totalCopilotCalls: number
}

export interface AdminUserBillingWithSubscription extends AdminUserBilling {
  subscriptions: AdminSubscription[]
  organizationMemberships: Array<{
    organizationId: string
    organizationName: string
    role: string
  }>
}

// =============================================================================
// Organization Billing Summary Types
// =============================================================================

export interface AdminOrganizationBillingSummary {
  organizationId: string
  organizationName: string
  subscriptionPlan: string
  subscriptionStatus: string
  // Seats
  totalSeats: number
  usedSeats: number
  availableSeats: number
  // Usage
  totalCurrentUsage: number
  totalUsageLimit: number
  minimumBillingAmount: number
  averageUsagePerMember: number
  usagePercentage: number
  // Billing period
  billingPeriodStart: string | null
  billingPeriodEnd: string | null
  // Alerts
  membersOverLimit: number
  membersNearLimit: number
}

export interface AdminSeatAnalytics {
  organizationId: string
  organizationName: string
  currentSeats: number
  maxSeats: number
  availableSeats: number
  subscriptionPlan: string
  canAddSeats: boolean
  utilizationRate: number
  activeMembers: number
  inactiveMembers: number
  memberActivity: Array<{
    userId: string
    userName: string
    userEmail: string
    role: string
    joinedAt: string
    lastActive: string | null
  }>
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/organizations/route.ts

```typescript
/**
 * GET /api/v1/admin/organizations
 *
 * List all organizations with pagination.
 *
 * Query Parameters:
 *   - limit: number (default: 50, max: 250)
 *   - offset: number (default: 0)
 *
 * Response: AdminListResponse<AdminOrganization>
 */

import { db } from '@sim/db'
import { organization } from '@sim/db/schema'
import { count } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'
import { withAdminAuth } from '@/app/api/v1/admin/middleware'
import { internalErrorResponse, listResponse } from '@/app/api/v1/admin/responses'
import {
  type AdminOrganization,
  createPaginationMeta,
  parsePaginationParams,
  toAdminOrganization,
} from '@/app/api/v1/admin/types'

const logger = createLogger('AdminOrganizationsAPI')

export const GET = withAdminAuth(async (request) => {
  const url = new URL(request.url)
  const { limit, offset } = parsePaginationParams(url)

  try {
    const [countResult, organizations] = await Promise.all([
      db.select({ total: count() }).from(organization),
      db.select().from(organization).orderBy(organization.name).limit(limit).offset(offset),
    ])

    const total = countResult[0].total
    const data: AdminOrganization[] = organizations.map(toAdminOrganization)
    const pagination = createPaginationMeta(total, limit, offset)

    logger.info(`Admin API: Listed ${data.length} organizations (total: ${total})`)

    return listResponse(data, pagination)
  } catch (error) {
    logger.error('Admin API: Failed to list organizations', { error })
    return internalErrorResponse('Failed to list organizations')
  }
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/organizations/[id]/route.ts

```typescript
/**
 * GET /api/v1/admin/organizations/[id]
 *
 * Get organization details including member count and subscription.
 *
 * Response: AdminSingleResponse<AdminOrganizationDetail>
 *
 * PATCH /api/v1/admin/organizations/[id]
 *
 * Update organization details.
 *
 * Body:
 *   - name?: string - Organization name
 *   - slug?: string - Organization slug
 *
 * Response: AdminSingleResponse<AdminOrganization>
 */

import { db } from '@sim/db'
import { member, organization, subscription } from '@sim/db/schema'
import { and, count, eq } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'
import { withAdminAuthParams } from '@/app/api/v1/admin/middleware'
import {
  badRequestResponse,
  internalErrorResponse,
  notFoundResponse,
  singleResponse,
} from '@/app/api/v1/admin/responses'
import {
  type AdminOrganizationDetail,
  toAdminOrganization,
  toAdminSubscription,
} from '@/app/api/v1/admin/types'

const logger = createLogger('AdminOrganizationDetailAPI')

interface RouteParams {
  id: string
}

export const GET = withAdminAuthParams<RouteParams>(async (request, context) => {
  const { id: organizationId } = await context.params

  try {
    const [orgData] = await db
      .select()
      .from(organization)
      .where(eq(organization.id, organizationId))
      .limit(1)

    if (!orgData) {
      return notFoundResponse('Organization')
    }

    const [memberCountResult, subscriptionData] = await Promise.all([
      db.select({ count: count() }).from(member).where(eq(member.organizationId, organizationId)),
      db
        .select()
        .from(subscription)
        .where(and(eq(subscription.referenceId, organizationId), eq(subscription.status, 'active')))
        .limit(1),
    ])

    const data: AdminOrganizationDetail = {
      ...toAdminOrganization(orgData),
      memberCount: memberCountResult[0].count,
      subscription: subscriptionData[0] ? toAdminSubscription(subscriptionData[0]) : null,
    }

    logger.info(`Admin API: Retrieved organization ${organizationId}`)

    return singleResponse(data)
  } catch (error) {
    logger.error('Admin API: Failed to get organization', { error, organizationId })
    return internalErrorResponse('Failed to get organization')
  }
})

export const PATCH = withAdminAuthParams<RouteParams>(async (request, context) => {
  const { id: organizationId } = await context.params

  try {
    const body = await request.json()

    const [existing] = await db
      .select()
      .from(organization)
      .where(eq(organization.id, organizationId))
      .limit(1)

    if (!existing) {
      return notFoundResponse('Organization')
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    }

    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim().length === 0) {
        return badRequestResponse('name must be a non-empty string')
      }
      updateData.name = body.name.trim()
    }

    if (body.slug !== undefined) {
      if (typeof body.slug !== 'string' || body.slug.trim().length === 0) {
        return badRequestResponse('slug must be a non-empty string')
      }
      updateData.slug = body.slug.trim()
    }

    if (Object.keys(updateData).length === 1) {
      return badRequestResponse(
        'No valid fields to update. Use /billing endpoint for orgUsageLimit.'
      )
    }

    const [updated] = await db
      .update(organization)
      .set(updateData)
      .where(eq(organization.id, organizationId))
      .returning()

    logger.info(`Admin API: Updated organization ${organizationId}`, {
      fields: Object.keys(updateData).filter((k) => k !== 'updatedAt'),
    })

    return singleResponse(toAdminOrganization(updated))
  } catch (error) {
    logger.error('Admin API: Failed to update organization', { error, organizationId })
    return internalErrorResponse('Failed to update organization')
  }
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/organizations/[id]/billing/route.ts

```typescript
/**
 * GET /api/v1/admin/organizations/[id]/billing
 *
 * Get organization billing summary including usage, seats, and member data.
 *
 * Response: AdminSingleResponse<AdminOrganizationBillingSummary>
 *
 * PATCH /api/v1/admin/organizations/[id]/billing
 *
 * Update organization billing settings.
 *
 * Body:
 *   - orgUsageLimit?: number - New usage limit (null to clear)
 *
 * Response: AdminSingleResponse<{ success: true, orgUsageLimit: string | null }>
 */

import { db } from '@sim/db'
import { organization } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { getOrganizationBillingData } from '@/lib/billing/core/organization'
import { createLogger } from '@/lib/logs/console/logger'
import { withAdminAuthParams } from '@/app/api/v1/admin/middleware'
import {
  badRequestResponse,
  internalErrorResponse,
  notFoundResponse,
  singleResponse,
} from '@/app/api/v1/admin/responses'
import type { AdminOrganizationBillingSummary } from '@/app/api/v1/admin/types'

const logger = createLogger('AdminOrganizationBillingAPI')

interface RouteParams {
  id: string
}

export const GET = withAdminAuthParams<RouteParams>(async (_, context) => {
  const { id: organizationId } = await context.params

  try {
    const billingData = await getOrganizationBillingData(organizationId)

    if (!billingData) {
      return notFoundResponse('Organization or subscription')
    }

    const membersOverLimit = billingData.members.filter((m) => m.isOverLimit).length
    const membersNearLimit = billingData.members.filter(
      (m) => !m.isOverLimit && m.percentUsed >= 80
    ).length
    const usagePercentage =
      billingData.totalUsageLimit > 0
        ? Math.round((billingData.totalCurrentUsage / billingData.totalUsageLimit) * 10000) / 100
        : 0

    const data: AdminOrganizationBillingSummary = {
      organizationId: billingData.organizationId,
      organizationName: billingData.organizationName,
      subscriptionPlan: billingData.subscriptionPlan,
      subscriptionStatus: billingData.subscriptionStatus,
      totalSeats: billingData.totalSeats,
      usedSeats: billingData.usedSeats,
      availableSeats: billingData.totalSeats - billingData.usedSeats,
      totalCurrentUsage: billingData.totalCurrentUsage,
      totalUsageLimit: billingData.totalUsageLimit,
      minimumBillingAmount: billingData.minimumBillingAmount,
      averageUsagePerMember: billingData.averageUsagePerMember,
      usagePercentage,
      billingPeriodStart: billingData.billingPeriodStart?.toISOString() ?? null,
      billingPeriodEnd: billingData.billingPeriodEnd?.toISOString() ?? null,
      membersOverLimit,
      membersNearLimit,
    }

    logger.info(`Admin API: Retrieved billing summary for organization ${organizationId}`)

    return singleResponse(data)
  } catch (error) {
    logger.error('Admin API: Failed to get organization billing', { error, organizationId })
    return internalErrorResponse('Failed to get organization billing')
  }
})

export const PATCH = withAdminAuthParams<RouteParams>(async (request, context) => {
  const { id: organizationId } = await context.params

  try {
    const body = await request.json()

    const [orgData] = await db
      .select()
      .from(organization)
      .where(eq(organization.id, organizationId))
      .limit(1)

    if (!orgData) {
      return notFoundResponse('Organization')
    }

    if (body.orgUsageLimit !== undefined) {
      let newLimit: string | null = null

      if (body.orgUsageLimit === null) {
        newLimit = null
      } else if (typeof body.orgUsageLimit === 'number' && body.orgUsageLimit >= 0) {
        newLimit = body.orgUsageLimit.toFixed(2)
      } else {
        return badRequestResponse('orgUsageLimit must be a non-negative number or null')
      }

      await db
        .update(organization)
        .set({
          orgUsageLimit: newLimit,
          updatedAt: new Date(),
        })
        .where(eq(organization.id, organizationId))

      logger.info(`Admin API: Updated usage limit for organization ${organizationId}`, {
        newLimit,
      })

      return singleResponse({
        success: true,
        orgUsageLimit: newLimit,
      })
    }

    return badRequestResponse('No valid fields to update')
  } catch (error) {
    logger.error('Admin API: Failed to update organization billing', { error, organizationId })
    return internalErrorResponse('Failed to update organization billing')
  }
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/v1/admin/organizations/[id]/members/route.ts

```typescript
/**
 * GET /api/v1/admin/organizations/[id]/members
 *
 * List all members of an organization with their billing info.
 *
 * Query Parameters:
 *   - limit: number (default: 50, max: 250)
 *   - offset: number (default: 0)
 *
 * Response: AdminListResponse<AdminMemberDetail>
 *
 * POST /api/v1/admin/organizations/[id]/members
 *
 * Add a user to an organization with full billing logic.
 * Validates seat availability before adding (uses same logic as invitation flow):
 *   - Team plans: checks seats column
 *   - Enterprise plans: checks metadata.seats
 * Handles Pro usage snapshot and subscription cancellation like the invitation flow.
 * If user is already a member, updates their role if different.
 *
 * Body:
 *   - userId: string - User ID to add
 *   - role: string - Role ('admin' | 'member')
 *
 * Response: AdminSingleResponse<AdminMember & {
 *   action: 'created' | 'updated' | 'already_member',
 *   billingActions: { proUsageSnapshotted, proCancelledAtPeriodEnd }
 * }>
 */

import { db } from '@sim/db'
import { member, organization, user, userStats } from '@sim/db/schema'
import { count, eq } from 'drizzle-orm'
import { addUserToOrganization } from '@/lib/billing/organizations/membership'
import { requireStripeClient } from '@/lib/billing/stripe-client'
import { createLogger } from '@/lib/logs/console/logger'
import { withAdminAuthParams } from '@/app/api/v1/admin/middleware'
import {
  badRequestResponse,
  internalErrorResponse,
  listResponse,
  notFoundResponse,
  singleResponse,
} from '@/app/api/v1/admin/responses'
import {
  type AdminMember,
  type AdminMemberDetail,
  createPaginationMeta,
  parsePaginationParams,
} from '@/app/api/v1/admin/types'

const logger = createLogger('AdminOrganizationMembersAPI')

interface RouteParams {
  id: string
}

export const GET = withAdminAuthParams<RouteParams>(async (request, context) => {
  const { id: organizationId } = await context.params
  const url = new URL(request.url)
  const { limit, offset } = parsePaginationParams(url)

  try {
    const [orgData] = await db
      .select({ id: organization.id })
      .from(organization)
      .where(eq(organization.id, organizationId))
      .limit(1)

    if (!orgData) {
      return notFoundResponse('Organization')
    }

    const [countResult, membersData] = await Promise.all([
      db.select({ count: count() }).from(member).where(eq(member.organizationId, organizationId)),
      db
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
        .where(eq(member.organizationId, organizationId))
        .orderBy(member.createdAt)
        .limit(limit)
        .offset(offset),
    ])

    const total = countResult[0].count
    const data: AdminMemberDetail[] = membersData.map((m) => ({
      id: m.id,
      userId: m.userId,
      organizationId: m.organizationId,
      role: m.role,
      createdAt: m.createdAt.toISOString(),
      userName: m.userName,
      userEmail: m.userEmail,
      currentPeriodCost: m.currentPeriodCost ?? '0',
      currentUsageLimit: m.currentUsageLimit,
      lastActive: m.lastActive?.toISOString() ?? null,
      billingBlocked: m.billingBlocked ?? false,
    }))

    const pagination = createPaginationMeta(total, limit, offset)

    logger.info(`Admin API: Listed ${data.length} members for organization ${organizationId}`)

    return listResponse(data, pagination)
  } catch (error) {
    logger.error('Admin API: Failed to list organization members', { error, organizationId })
    return internalErrorResponse('Failed to list organization members')
  }
})

export const POST = withAdminAuthParams<RouteParams>(async (request, context) => {
  const { id: organizationId } = await context.params

  try {
    const body = await request.json()

    if (!body.userId || typeof body.userId !== 'string') {
      return badRequestResponse('userId is required')
    }

    if (!body.role || !['admin', 'member'].includes(body.role)) {
      return badRequestResponse('role must be "admin" or "member"')
    }

    const [orgData] = await db
      .select({ id: organization.id, name: organization.name })
      .from(organization)
      .where(eq(organization.id, organizationId))
      .limit(1)

    if (!orgData) {
      return notFoundResponse('Organization')
    }

    const [userData] = await db
      .select({ id: user.id, name: user.name, email: user.email })
      .from(user)
      .where(eq(user.id, body.userId))
      .limit(1)

    if (!userData) {
      return notFoundResponse('User')
    }

    const [existingMember] = await db
      .select({
        id: member.id,
        role: member.role,
        createdAt: member.createdAt,
        organizationId: member.organizationId,
      })
      .from(member)
      .where(eq(member.userId, body.userId))
      .limit(1)

    if (existingMember) {
      if (existingMember.organizationId === organizationId) {
        if (existingMember.role !== body.role) {
          await db.update(member).set({ role: body.role }).where(eq(member.id, existingMember.id))

          logger.info(
            `Admin API: Updated user ${body.userId} role in organization ${organizationId}`,
            {
              previousRole: existingMember.role,
              newRole: body.role,
            }
          )

          return singleResponse({
            id: existingMember.id,
            userId: body.userId,
            organizationId,
            role: body.role,
            createdAt: existingMember.createdAt.toISOString(),
            userName: userData.name,
            userEmail: userData.email,
            action: 'updated' as const,
            billingActions: {
              proUsageSnapshotted: false,
              proCancelledAtPeriodEnd: false,
            },
          })
        }

        return singleResponse({
          id: existingMember.id,
          userId: body.userId,
          organizationId,
          role: existingMember.role,
          createdAt: existingMember.createdAt.toISOString(),
          userName: userData.name,
          userEmail: userData.email,
          action: 'already_member' as const,
          billingActions: {
            proUsageSnapshotted: false,
            proCancelledAtPeriodEnd: false,
          },
        })
      }

      return badRequestResponse(
        `User is already a member of another organization. Users can only belong to one organization at a time.`
      )
    }

    const result = await addUserToOrganization({
      userId: body.userId,
      organizationId,
      role: body.role,
    })

    if (!result.success) {
      return badRequestResponse(result.error || 'Failed to add member')
    }

    // Sync Pro subscription cancellation with Stripe (same as invitation flow)
    if (result.billingActions.proSubscriptionToCancel?.stripeSubscriptionId) {
      try {
        const stripe = requireStripeClient()
        await stripe.subscriptions.update(
          result.billingActions.proSubscriptionToCancel.stripeSubscriptionId,
          { cancel_at_period_end: true }
        )
        logger.info('Admin API: Synced Pro cancellation with Stripe', {
          userId: body.userId,
          subscriptionId: result.billingActions.proSubscriptionToCancel.subscriptionId,
          stripeSubscriptionId: result.billingActions.proSubscriptionToCancel.stripeSubscriptionId,
        })
      } catch (stripeError) {
        logger.error('Admin API: Failed to sync Pro cancellation with Stripe', {
          userId: body.userId,
          subscriptionId: result.billingActions.proSubscriptionToCancel.subscriptionId,
          stripeSubscriptionId: result.billingActions.proSubscriptionToCancel.stripeSubscriptionId,
          error: stripeError,
        })
      }
    }

    const data: AdminMember = {
      id: result.memberId!,
      userId: body.userId,
      organizationId,
      role: body.role,
      createdAt: new Date().toISOString(),
      userName: userData.name,
      userEmail: userData.email,
    }

    logger.info(`Admin API: Added user ${body.userId} to organization ${organizationId}`, {
      role: body.role,
      memberId: result.memberId,
      billingActions: result.billingActions,
    })

    return singleResponse({
      ...data,
      action: 'created' as const,
      billingActions: {
        proUsageSnapshotted: result.billingActions.proUsageSnapshotted,
        proCancelledAtPeriodEnd: result.billingActions.proCancelledAtPeriodEnd,
      },
    })
  } catch (error) {
    logger.error('Admin API: Failed to add organization member', { error, organizationId })
    return internalErrorResponse('Failed to add organization member')
  }
})
```

--------------------------------------------------------------------------------

````
