---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 537
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 537 of 933)

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

---[FILE: constants.ts]---
Location: sim-main/apps/sim/lib/auth/constants.ts

```typescript
/** Anonymous user ID used when DISABLE_AUTH is enabled */
export const ANONYMOUS_USER_ID = '00000000-0000-0000-0000-000000000000'

export const ANONYMOUS_USER = {
  id: ANONYMOUS_USER_ID,
  name: 'Anonymous',
  email: 'anonymous@localhost',
  emailVerified: true,
  image: null,
} as const
```

--------------------------------------------------------------------------------

---[FILE: credential-access.ts]---
Location: sim-main/apps/sim/lib/auth/credential-access.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { account, workflow as workflowTable } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

export interface CredentialAccessResult {
  ok: boolean
  error?: string
  authType?: 'session' | 'api_key' | 'internal_jwt'
  requesterUserId?: string
  credentialOwnerUserId?: string
  workspaceId?: string
}

/**
 * Centralizes auth + collaboration rules for credential use.
 * - Uses checkHybridAuth to authenticate the caller
 * - Fetches credential owner
 * - Authorization rules:
 *   - session/api_key: allow if requester owns the credential; otherwise require workflowId and
 *     verify BOTH requester and owner have access to the workflow's workspace
 *   - internal_jwt: require workflowId (by default) and verify credential owner has access to the
 *     workflow's workspace (requester identity is the system/workflow)
 */
export async function authorizeCredentialUse(
  request: NextRequest,
  params: { credentialId: string; workflowId?: string; requireWorkflowIdForInternal?: boolean }
): Promise<CredentialAccessResult> {
  const { credentialId, workflowId, requireWorkflowIdForInternal = true } = params

  const auth = await checkHybridAuth(request, { requireWorkflowId: requireWorkflowIdForInternal })
  if (!auth.success || !auth.userId) {
    return { ok: false, error: auth.error || 'Authentication required' }
  }

  // Lookup credential owner
  const [credRow] = await db
    .select({ userId: account.userId })
    .from(account)
    .where(eq(account.id, credentialId))
    .limit(1)

  if (!credRow) {
    return { ok: false, error: 'Credential not found' }
  }

  const credentialOwnerUserId = credRow.userId

  // If requester owns the credential, allow immediately
  if (auth.authType !== 'internal_jwt' && auth.userId === credentialOwnerUserId) {
    return {
      ok: true,
      authType: auth.authType,
      requesterUserId: auth.userId,
      credentialOwnerUserId,
    }
  }

  // For collaboration paths, workflowId is required to scope to a workspace
  if (!workflowId) {
    return { ok: false, error: 'workflowId is required' }
  }

  const [wf] = await db
    .select({ workspaceId: workflowTable.workspaceId })
    .from(workflowTable)
    .where(eq(workflowTable.id, workflowId))
    .limit(1)

  if (!wf || !wf.workspaceId) {
    return { ok: false, error: 'Workflow not found' }
  }

  if (auth.authType === 'internal_jwt') {
    // Internal calls: verify credential owner belongs to the workflow's workspace
    const ownerPerm = await getUserEntityPermissions(
      credentialOwnerUserId,
      'workspace',
      wf.workspaceId
    )
    if (ownerPerm === null) {
      return { ok: false, error: 'Unauthorized' }
    }
    return {
      ok: true,
      authType: auth.authType,
      requesterUserId: auth.userId,
      credentialOwnerUserId,
      workspaceId: wf.workspaceId,
    }
  }

  // Session/API key: verify BOTH requester and owner belong to the workflow's workspace
  const requesterPerm = await getUserEntityPermissions(auth.userId, 'workspace', wf.workspaceId)
  const ownerPerm = await getUserEntityPermissions(
    credentialOwnerUserId,
    'workspace',
    wf.workspaceId
  )
  if (requesterPerm === null || ownerPerm === null) {
    return { ok: false, error: 'Unauthorized' }
  }

  return {
    ok: true,
    authType: auth.authType,
    requesterUserId: auth.userId,
    credentialOwnerUserId,
    workspaceId: wf.workspaceId,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: hybrid.ts]---
Location: sim-main/apps/sim/lib/auth/hybrid.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { workflow } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { authenticateApiKeyFromHeader, updateApiKeyLastUsed } from '@/lib/api-key/service'
import { getSession } from '@/lib/auth'
import { verifyInternalToken } from '@/lib/auth/internal'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('HybridAuth')

export interface AuthResult {
  success: boolean
  userId?: string
  authType?: 'session' | 'api_key' | 'internal_jwt'
  error?: string
}

/**
 * Check for authentication using any of the 3 supported methods:
 * 1. Session authentication (cookies)
 * 2. API key authentication (X-API-Key header)
 * 3. Internal JWT authentication (Authorization: Bearer header)
 *
 * For internal JWT calls, requires workflowId to determine user context
 */
export async function checkHybridAuth(
  request: NextRequest,
  options: { requireWorkflowId?: boolean } = {}
): Promise<AuthResult> {
  try {
    // 1. Check for internal JWT token first
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const verification = await verifyInternalToken(token)

      if (verification.valid) {
        let workflowId: string | null = null
        let userId: string | null = verification.userId || null

        const { searchParams } = new URL(request.url)
        workflowId = searchParams.get('workflowId')
        if (!userId) {
          userId = searchParams.get('userId')
        }

        if (!workflowId && !userId && request.method === 'POST') {
          try {
            // Clone the request to avoid consuming the original body
            const clonedRequest = request.clone()
            const bodyText = await clonedRequest.text()
            if (bodyText) {
              const body = JSON.parse(bodyText)
              workflowId = body.workflowId || body._context?.workflowId
              userId = userId || body.userId || body._context?.userId
            }
          } catch {
            // Ignore JSON parse errors
          }
        }

        if (userId) {
          return {
            success: true,
            userId,
            authType: 'internal_jwt',
          }
        }

        if (workflowId) {
          const [workflowData] = await db
            .select({ userId: workflow.userId })
            .from(workflow)
            .where(eq(workflow.id, workflowId))
            .limit(1)

          if (!workflowData) {
            return {
              success: false,
              error: 'Workflow not found',
            }
          }

          return {
            success: true,
            userId: workflowData.userId,
            authType: 'internal_jwt',
          }
        }

        if (options.requireWorkflowId !== false) {
          return {
            success: false,
            error: 'workflowId or userId required for internal JWT calls',
          }
        }

        return {
          success: true,
          authType: 'internal_jwt',
        }
      }
    }

    // 2. Try session auth (for web UI)
    const session = await getSession()
    if (session?.user?.id) {
      return {
        success: true,
        userId: session.user.id,
        authType: 'session',
      }
    }

    // 3. Try API key auth
    const apiKeyHeader = request.headers.get('x-api-key')
    if (apiKeyHeader) {
      const result = await authenticateApiKeyFromHeader(apiKeyHeader)
      if (result.success) {
        await updateApiKeyLastUsed(result.keyId!)
        return {
          success: true,
          userId: result.userId!,
          authType: 'api_key',
        }
      }

      return {
        success: false,
        error: 'Invalid API key',
      }
    }

    // No authentication found
    return {
      success: false,
      error: 'Authentication required - provide session, API key, or internal JWT',
    }
  } catch (error) {
    logger.error('Error in hybrid authentication:', error)
    return {
      success: false,
      error: 'Authentication error',
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/lib/auth/index.ts

```typescript
export type { AnonymousSession } from './anonymous'
export { createAnonymousSession, ensureAnonymousUserExists } from './anonymous'
export { auth, getSession, signIn, signUp } from './auth'
export { ANONYMOUS_USER, ANONYMOUS_USER_ID } from './constants'
```

--------------------------------------------------------------------------------

---[FILE: internal.ts]---
Location: sim-main/apps/sim/lib/auth/internal.ts
Signals: Next.js

```typescript
import { jwtVerify, SignJWT } from 'jose'
import { type NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('CronAuth')

const getJwtSecret = () => {
  const secret = new TextEncoder().encode(env.INTERNAL_API_SECRET)
  return secret
}

/**
 * Generate an internal JWT token for server-side API calls
 * Token expires in 5 minutes to keep it short-lived
 * @param userId Optional user ID to embed in token payload
 */
export async function generateInternalToken(userId?: string): Promise<string> {
  const secret = getJwtSecret()

  const payload: { type: string; userId?: string } = { type: 'internal' }
  if (userId) {
    payload.userId = userId
  }

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('5m')
    .setIssuer('sim-internal')
    .setAudience('sim-api')
    .sign(secret)

  return token
}

/**
 * Verify an internal JWT token
 * Returns verification result with userId if present in token
 */
export async function verifyInternalToken(
  token: string
): Promise<{ valid: boolean; userId?: string }> {
  try {
    const secret = getJwtSecret()

    const { payload } = await jwtVerify(token, secret, {
      issuer: 'sim-internal',
      audience: 'sim-api',
    })

    // Check that it's an internal token
    if (payload.type === 'internal') {
      return {
        valid: true,
        userId: typeof payload.userId === 'string' ? payload.userId : undefined,
      }
    }

    return { valid: false }
  } catch (error) {
    // Token verification failed
    return { valid: false }
  }
}

/**
 * Verify CRON authentication for scheduled API endpoints
 * Returns null if authorized, or a NextResponse with error if unauthorized
 */
export function verifyCronAuth(request: NextRequest, context?: string): NextResponse | null {
  if (!env.CRON_SECRET) {
    const contextInfo = context ? ` for ${context}` : ''
    logger.warn(`CRON endpoint accessed but CRON_SECRET is not configured${contextInfo}`, {
      ip: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown',
      userAgent: request.headers.get('user-agent') ?? 'unknown',
      context,
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const authHeader = request.headers.get('authorization')
  const expectedAuth = `Bearer ${env.CRON_SECRET}`
  if (authHeader !== expectedAuth) {
    const contextInfo = context ? ` for ${context}` : ''
    logger.warn(`Unauthorized CRON access attempt${contextInfo}`, {
      providedAuth: authHeader,
      ip: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown',
      userAgent: request.headers.get('user-agent') ?? 'unknown',
      context,
    })

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: sim-main/apps/sim/lib/auth/sso/constants.ts

```typescript
export const SSO_TRUSTED_PROVIDERS = [
  'okta',
  'okta-saml',
  'okta-prod',
  'okta-dev',
  'okta-staging',
  'okta-test',
  'azure-ad',
  'azure-active-directory',
  'azure-corp',
  'azure-enterprise',
  'adfs',
  'adfs-company',
  'adfs-corp',
  'adfs-enterprise',
  'auth0',
  'auth0-prod',
  'auth0-dev',
  'auth0-staging',
  'onelogin',
  'onelogin-prod',
  'onelogin-corp',
  'jumpcloud',
  'jumpcloud-prod',
  'jumpcloud-corp',
  'ping-identity',
  'ping-federate',
  'pingone',
  'shibboleth',
  'shibboleth-idp',
  'google-workspace',
  'google-sso',
  'saml',
  'saml2',
  'saml-sso',
  'oidc',
  'oidc-sso',
  'openid-connect',
  'custom-sso',
  'enterprise-sso',
  'company-sso',
]
```

--------------------------------------------------------------------------------

---[FILE: authorization.ts]---
Location: sim-main/apps/sim/lib/billing/authorization.ts

```typescript
import { db } from '@sim/db'
import * as schema from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'

/**
 * Check if a user is authorized to manage billing for a given reference ID
 * Reference ID can be either a user ID (individual subscription) or organization ID (team subscription)
 */
export async function authorizeSubscriptionReference(
  userId: string,
  referenceId: string
): Promise<boolean> {
  // User can always manage their own subscriptions
  if (referenceId === userId) {
    return true
  }

  // Check if referenceId is an organizationId the user has admin rights to
  const members = await db
    .select()
    .from(schema.member)
    .where(and(eq(schema.member.userId, userId), eq(schema.member.organizationId, referenceId)))

  const member = members[0]

  // Allow if the user is an owner or admin of the organization
  return member?.role === 'owner' || member?.role === 'admin'
}
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: sim-main/apps/sim/lib/billing/constants.ts

```typescript
/**
 * Billing and cost constants shared between client and server code
 */

/**
 * Fallback free credits (in dollars) when env var is not set
 */
export const DEFAULT_FREE_CREDITS = 10

/**
 * Default per-user minimum limits (in dollars) for paid plans when env vars are absent
 */
export const DEFAULT_PRO_TIER_COST_LIMIT = 20
export const DEFAULT_TEAM_TIER_COST_LIMIT = 40
export const DEFAULT_ENTERPRISE_TIER_COST_LIMIT = 200

/**
 * Base charge applied to every workflow execution
 * This charge is applied regardless of whether the workflow uses AI models
 */
export const BASE_EXECUTION_CHARGE = 0.001

/**
 * Fixed cost for search tool invocation (in dollars)
 */
export const SEARCH_TOOL_COST = 0.01

/**
 * Default threshold (in dollars) for incremental overage billing
 * When unbilled overage reaches this amount, an invoice item is created
 */
export const DEFAULT_OVERAGE_THRESHOLD = 50
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/lib/billing/index.ts

```typescript
/**
 * Billing System - Main Entry Point
 * Provides clean, organized exports for the billing system
 */

export * from '@/lib/billing/calculations/usage-monitor'
export * from '@/lib/billing/core/billing'
export * from '@/lib/billing/core/organization'
export * from '@/lib/billing/core/subscription'
export {
  getHighestPrioritySubscription as getActiveSubscription,
  getUserSubscriptionState as getSubscriptionState,
  isEnterprisePlan as hasEnterprisePlan,
  isProPlan as hasProPlan,
  isTeamPlan as hasTeamPlan,
  sendPlanWelcomeEmail,
} from '@/lib/billing/core/subscription'
export * from '@/lib/billing/core/usage'
export {
  checkUsageStatus,
  getTeamUsageLimits,
  getUserUsageData as getUsageData,
  getUserUsageLimit as getUsageLimit,
  updateUserUsageLimit as updateUsageLimit,
} from '@/lib/billing/core/usage'
export * from '@/lib/billing/credits/balance'
export * from '@/lib/billing/credits/purchase'
export * from '@/lib/billing/subscriptions/utils'
export { canEditUsageLimit as canEditLimit } from '@/lib/billing/subscriptions/utils'
export * from '@/lib/billing/types'
export * from '@/lib/billing/validation/seat-management'
```

--------------------------------------------------------------------------------

---[FILE: organization.ts]---
Location: sim-main/apps/sim/lib/billing/organization.ts

```typescript
import { db } from '@sim/db'
import * as schema from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { getPlanPricing } from '@/lib/billing/core/billing'
import { syncUsageLimitsFromSubscription } from '@/lib/billing/core/usage'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('BillingOrganization')

type SubscriptionData = {
  id: string
  plan: string
  referenceId: string
  status: string
  seats?: number
}

/**
 * Check if a user already owns an organization
 */
async function getUserOwnedOrganization(userId: string): Promise<string | null> {
  const existingMemberships = await db
    .select({ organizationId: schema.member.organizationId })
    .from(schema.member)
    .where(and(eq(schema.member.userId, userId), eq(schema.member.role, 'owner')))
    .limit(1)

  if (existingMemberships.length > 0) {
    const [existingOrg] = await db
      .select({ id: schema.organization.id })
      .from(schema.organization)
      .where(eq(schema.organization.id, existingMemberships[0].organizationId))
      .limit(1)

    return existingOrg?.id || null
  }

  return null
}

/**
 * Create a new organization and add user as owner
 */
async function createOrganizationWithOwner(
  userId: string,
  organizationName: string,
  organizationSlug: string,
  metadata: Record<string, any> = {}
): Promise<string> {
  const orgId = `org_${crypto.randomUUID()}`

  const [newOrg] = await db
    .insert(schema.organization)
    .values({
      id: orgId,
      name: organizationName,
      slug: organizationSlug,
      metadata,
    })
    .returning({ id: schema.organization.id })

  // Add user as owner/admin of the organization
  await db.insert(schema.member).values({
    id: crypto.randomUUID(),
    userId: userId,
    organizationId: newOrg.id,
    role: 'owner',
  })

  logger.info('Created organization with owner', {
    userId,
    organizationId: newOrg.id,
    organizationName,
  })

  return newOrg.id
}

export async function createOrganizationForTeamPlan(
  userId: string,
  userName?: string,
  userEmail?: string,
  organizationSlug?: string
): Promise<string> {
  try {
    const existingOrgId = await getUserOwnedOrganization(userId)
    if (existingOrgId) {
      return existingOrgId
    }

    const organizationName = userName || `${userEmail || 'User'}'s Team`
    const slug = organizationSlug || `${userId}-team-${Date.now()}`

    const orgId = await createOrganizationWithOwner(userId, organizationName, slug, {
      createdForTeamPlan: true,
      originalUserId: userId,
    })

    logger.info('Created organization for team/enterprise plan', {
      userId,
      organizationId: orgId,
      organizationName,
    })

    return orgId
  } catch (error) {
    logger.error('Failed to create organization for team/enterprise plan', {
      userId,
      error,
    })
    throw error
  }
}

export async function ensureOrganizationForTeamSubscription(
  subscription: SubscriptionData
): Promise<SubscriptionData> {
  if (subscription.plan !== 'team') {
    return subscription
  }

  if (subscription.referenceId.startsWith('org_')) {
    return subscription
  }

  const userId = subscription.referenceId

  logger.info('Creating organization for team subscription', {
    subscriptionId: subscription.id,
    userId,
  })

  const existingMembership = await db
    .select({
      id: schema.member.id,
      organizationId: schema.member.organizationId,
      role: schema.member.role,
    })
    .from(schema.member)
    .where(eq(schema.member.userId, userId))
    .limit(1)

  if (existingMembership.length > 0) {
    const membership = existingMembership[0]
    if (membership.role === 'owner' || membership.role === 'admin') {
      logger.info('User already owns/admins an org, using it', {
        userId,
        organizationId: membership.organizationId,
      })

      await db
        .update(schema.subscription)
        .set({ referenceId: membership.organizationId })
        .where(eq(schema.subscription.id, subscription.id))

      return { ...subscription, referenceId: membership.organizationId }
    }

    logger.error('User is member of org but not owner/admin - cannot create team subscription', {
      userId,
      existingOrgId: membership.organizationId,
      subscriptionId: subscription.id,
    })
    throw new Error('User is already member of another organization')
  }

  const [userData] = await db
    .select({ name: schema.user.name, email: schema.user.email })
    .from(schema.user)
    .where(eq(schema.user.id, userId))
    .limit(1)

  const orgId = await createOrganizationForTeamPlan(
    userId,
    userData?.name || undefined,
    userData?.email || undefined
  )

  await db
    .update(schema.subscription)
    .set({ referenceId: orgId })
    .where(eq(schema.subscription.id, subscription.id))

  logger.info('Created organization and updated subscription referenceId', {
    subscriptionId: subscription.id,
    userId,
    organizationId: orgId,
  })

  return { ...subscription, referenceId: orgId }
}

/**
 * Sync usage limits for subscription members
 * Updates usage limits for all users associated with the subscription
 */
export async function syncSubscriptionUsageLimits(subscription: SubscriptionData) {
  try {
    logger.info('Syncing subscription usage limits', {
      subscriptionId: subscription.id,
      referenceId: subscription.referenceId,
      plan: subscription.plan,
    })

    // Check if this is a user or organization subscription
    const users = await db
      .select({ id: schema.user.id })
      .from(schema.user)
      .where(eq(schema.user.id, subscription.referenceId))
      .limit(1)

    if (users.length > 0) {
      // Individual user subscription - sync their usage limits
      await syncUsageLimitsFromSubscription(subscription.referenceId)

      logger.info('Synced usage limits for individual user subscription', {
        userId: subscription.referenceId,
        subscriptionId: subscription.id,
        plan: subscription.plan,
      })
    } else {
      // Organization subscription - set org usage limit and sync member limits
      const organizationId = subscription.referenceId

      // Set orgUsageLimit for team plans (enterprise is set via webhook with custom pricing)
      if (subscription.plan === 'team') {
        const { basePrice } = getPlanPricing(subscription.plan)
        const seats = subscription.seats ?? 1
        const orgLimit = seats * basePrice

        // Only set if not already set or if updating to a higher value based on seats
        const orgData = await db
          .select({ orgUsageLimit: schema.organization.orgUsageLimit })
          .from(schema.organization)
          .where(eq(schema.organization.id, organizationId))
          .limit(1)

        const currentLimit =
          orgData.length > 0 && orgData[0].orgUsageLimit
            ? Number.parseFloat(orgData[0].orgUsageLimit)
            : 0

        // Update if no limit set, or if new seat-based minimum is higher
        if (currentLimit < orgLimit) {
          await db
            .update(schema.organization)
            .set({
              orgUsageLimit: orgLimit.toFixed(2),
              updatedAt: new Date(),
            })
            .where(eq(schema.organization.id, organizationId))

          logger.info('Set organization usage limit for team plan', {
            organizationId,
            seats,
            basePrice,
            orgLimit,
            previousLimit: currentLimit,
          })
        }
      }

      // Sync usage limits for all members
      const members = await db
        .select({ userId: schema.member.userId })
        .from(schema.member)
        .where(eq(schema.member.organizationId, organizationId))

      if (members.length > 0) {
        for (const member of members) {
          try {
            await syncUsageLimitsFromSubscription(member.userId)
          } catch (memberError) {
            logger.error('Failed to sync usage limits for organization member', {
              userId: member.userId,
              organizationId,
              subscriptionId: subscription.id,
              error: memberError,
            })
          }
        }

        logger.info('Synced usage limits for organization members', {
          organizationId,
          memberCount: members.length,
          subscriptionId: subscription.id,
          plan: subscription.plan,
        })
      }
    }
  } catch (error) {
    logger.error('Failed to sync subscription usage limits', {
      subscriptionId: subscription.id,
      referenceId: subscription.referenceId,
      error,
    })
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: plans.ts]---
Location: sim-main/apps/sim/lib/billing/plans.ts

```typescript
import {
  getFreeTierLimit,
  getProTierLimit,
  getTeamTierLimitPerSeat,
} from '@/lib/billing/subscriptions/utils'
import { env } from '@/lib/core/config/env'

export interface BillingPlan {
  name: string
  priceId: string
  limits: {
    cost: number
  }
}

/**
 * Get the billing plans configuration for Better Auth Stripe plugin
 */
export function getPlans(): BillingPlan[] {
  return [
    {
      name: 'free',
      priceId: env.STRIPE_FREE_PRICE_ID || '',
      limits: {
        cost: getFreeTierLimit(),
      },
    },
    {
      name: 'pro',
      priceId: env.STRIPE_PRO_PRICE_ID || '',
      limits: {
        cost: getProTierLimit(),
      },
    },
    {
      name: 'team',
      priceId: env.STRIPE_TEAM_PRICE_ID || '',
      limits: {
        cost: getTeamTierLimitPerSeat(),
      },
    },
    {
      name: 'enterprise',
      priceId: 'price_dynamic',
      limits: {
        cost: getTeamTierLimitPerSeat(),
      },
    },
  ]
}

/**
 * Get a specific plan by name
 */
export function getPlanByName(planName: string): BillingPlan | undefined {
  return getPlans().find((plan) => plan.name === planName)
}

/**
 * Get plan limits for a given plan name
 */
export function getPlanLimits(planName: string): number {
  const plan = getPlanByName(planName)
  return plan?.limits.cost ?? getFreeTierLimit()
}
```

--------------------------------------------------------------------------------

---[FILE: stripe-client.ts]---
Location: sim-main/apps/sim/lib/billing/stripe-client.ts

```typescript
import Stripe from 'stripe'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('StripeClient')

/**
 * Check if Stripe credentials are valid
 */
export function hasValidStripeCredentials(): boolean {
  return !!env.STRIPE_SECRET_KEY
}

/**
 * Secure Stripe client singleton with initialization guard
 */
const createStripeClientSingleton = () => {
  let stripeClient: Stripe | null = null
  let isInitializing = false

  return {
    getInstance(): Stripe | null {
      // If already initialized, return immediately
      if (stripeClient) return stripeClient

      // Prevent concurrent initialization attempts
      if (isInitializing) {
        logger.debug('Stripe client initialization already in progress')
        return null
      }

      if (!hasValidStripeCredentials()) {
        logger.warn('Stripe credentials not available - Stripe operations will be disabled')
        return null
      }

      try {
        isInitializing = true

        stripeClient = new Stripe(env.STRIPE_SECRET_KEY || '', {
          apiVersion: '2025-08-27.basil',
        })

        logger.info('Stripe client initialized successfully')
        return stripeClient
      } catch (error) {
        logger.error('Failed to initialize Stripe client', { error })
        stripeClient = null // Ensure cleanup on failure
        return null
      } finally {
        isInitializing = false
      }
    },

    // For testing purposes only - allows resetting the singleton
    reset(): void {
      stripeClient = null
      isInitializing = false
    },
  }
}

const stripeClientSingleton = createStripeClientSingleton()

/**
 * Get the Stripe client instance
 * @returns Stripe client or null if credentials are not available
 */
export function getStripeClient(): Stripe | null {
  return stripeClientSingleton.getInstance()
}

/**
 * Get the Stripe client instance, throwing an error if not available
 * Use this when Stripe operations are required
 */
export function requireStripeClient(): Stripe {
  const client = getStripeClient()

  if (!client) {
    throw new Error(
      'Stripe client is not available. Set STRIPE_SECRET_KEY in your environment variables.'
    )
  }

  return client
}
```

--------------------------------------------------------------------------------

````
