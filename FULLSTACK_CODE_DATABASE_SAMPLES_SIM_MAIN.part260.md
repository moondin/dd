---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 260
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 260 of 933)

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

---[FILE: route.test.ts]---
Location: sim-main/apps/sim/app/api/auth/oauth/credentials/route.test.ts
Signals: Next.js

```typescript
/**
 * Tests for OAuth credentials API route
 *
 * @vitest-environment node
 */

import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('OAuth Credentials API Route', () => {
  const mockGetSession = vi.fn()
  const mockParseProvider = vi.fn()
  const mockEvaluateScopeCoverage = vi.fn()
  const mockDb = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn(),
  }
  const mockLogger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }

  const mockUUID = 'mock-uuid-12345678-90ab-cdef-1234-567890abcdef'

  function createMockRequestWithQuery(method = 'GET', queryParams = ''): NextRequest {
    const url = `http://localhost:3000/api/auth/oauth/credentials${queryParams}`
    return new NextRequest(new URL(url), { method })
  }

  beforeEach(() => {
    vi.resetModules()

    vi.stubGlobal('crypto', {
      randomUUID: vi.fn().mockReturnValue(mockUUID),
    })

    vi.doMock('@/lib/auth', () => ({
      getSession: mockGetSession,
    }))

    vi.doMock('@/lib/oauth/oauth', () => ({
      parseProvider: mockParseProvider,
      evaluateScopeCoverage: mockEvaluateScopeCoverage,
    }))

    vi.doMock('@sim/db', () => ({
      db: mockDb,
    }))

    vi.doMock('@sim/db/schema', () => ({
      account: { userId: 'userId', providerId: 'providerId' },
      user: { email: 'email', id: 'id' },
    }))

    vi.doMock('drizzle-orm', () => ({
      and: vi.fn((...conditions) => ({ conditions, type: 'and' })),
      eq: vi.fn((field, value) => ({ field, value, type: 'eq' })),
    }))

    vi.doMock('jwt-decode', () => ({
      jwtDecode: vi.fn(),
    }))

    vi.doMock('@/lib/logs/console/logger', () => ({
      createLogger: vi.fn().mockReturnValue(mockLogger),
    }))

    mockParseProvider.mockImplementation((providerId: string) => ({
      baseProvider: providerId.split('-')[0] || providerId,
    }))

    mockEvaluateScopeCoverage.mockImplementation(
      (_providerId: string, grantedScopes: string[]) => ({
        canonicalScopes: grantedScopes,
        grantedScopes,
        missingScopes: [],
        extraScopes: [],
        requiresReauthorization: false,
      })
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return credentials successfully', async () => {
    mockGetSession.mockResolvedValueOnce({
      user: { id: 'user-123' },
    })

    mockParseProvider.mockReturnValueOnce({
      baseProvider: 'google',
    })

    const mockAccounts = [
      {
        id: 'credential-1',
        userId: 'user-123',
        providerId: 'google-email',
        accountId: 'test@example.com',
        updatedAt: new Date('2024-01-01'),
        idToken: null,
      },
      {
        id: 'credential-2',
        userId: 'user-123',
        providerId: 'google-default',
        accountId: 'user-id',
        updatedAt: new Date('2024-01-02'),
        idToken: null,
      },
    ]

    mockDb.select.mockReturnValueOnce(mockDb)
    mockDb.from.mockReturnValueOnce(mockDb)
    mockDb.where.mockResolvedValueOnce(mockAccounts)

    mockDb.select.mockReturnValueOnce(mockDb)
    mockDb.from.mockReturnValueOnce(mockDb)
    mockDb.where.mockReturnValueOnce(mockDb)
    mockDb.limit.mockResolvedValueOnce([{ email: 'user@example.com' }])

    const req = createMockRequestWithQuery('GET', '?provider=google-email')

    const { GET } = await import('@/app/api/auth/oauth/credentials/route')

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.credentials).toHaveLength(2)
    expect(data.credentials[0]).toMatchObject({
      id: 'credential-1',
      provider: 'google-email',
      isDefault: false,
    })
    expect(data.credentials[1]).toMatchObject({
      id: 'credential-2',
      provider: 'google-default',
      isDefault: true,
    })
  })

  it('should handle unauthenticated user', async () => {
    mockGetSession.mockResolvedValueOnce(null)

    const req = createMockRequestWithQuery('GET', '?provider=google')

    const { GET } = await import('@/app/api/auth/oauth/credentials/route')

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('User not authenticated')
    expect(mockLogger.warn).toHaveBeenCalled()
  })

  it('should handle missing provider parameter', async () => {
    mockGetSession.mockResolvedValueOnce({
      user: { id: 'user-123' },
    })

    const req = createMockRequestWithQuery('GET')

    const { GET } = await import('@/app/api/auth/oauth/credentials/route')

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Provider or credentialId is required')
    expect(mockLogger.warn).toHaveBeenCalled()
  })

  it('should handle no credentials found', async () => {
    mockGetSession.mockResolvedValueOnce({
      user: { id: 'user-123' },
    })

    mockParseProvider.mockReturnValueOnce({
      baseProvider: 'github',
    })

    mockDb.select.mockReturnValueOnce(mockDb)
    mockDb.from.mockReturnValueOnce(mockDb)
    mockDb.where.mockResolvedValueOnce([])

    const req = createMockRequestWithQuery('GET', '?provider=github')

    const { GET } = await import('@/app/api/auth/oauth/credentials/route')

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.credentials).toHaveLength(0)
  })

  it('should decode ID token for display name', async () => {
    const { jwtDecode } = await import('jwt-decode')
    const mockJwtDecode = jwtDecode as any

    mockGetSession.mockResolvedValueOnce({
      user: { id: 'user-123' },
    })

    mockParseProvider.mockReturnValueOnce({
      baseProvider: 'google',
    })

    const mockAccounts = [
      {
        id: 'credential-1',
        userId: 'user-123',
        providerId: 'google-default',
        accountId: 'google-user-id',
        updatedAt: new Date('2024-01-01'),
        idToken: 'mock-jwt-token',
      },
    ]

    mockJwtDecode.mockReturnValueOnce({
      email: 'decoded@example.com',
      name: 'Decoded User',
    })

    mockDb.select.mockReturnValueOnce(mockDb)
    mockDb.from.mockReturnValueOnce(mockDb)
    mockDb.where.mockResolvedValueOnce(mockAccounts)

    const req = createMockRequestWithQuery('GET', '?provider=google')

    const { GET } = await import('@/app/api/auth/oauth/credentials/route')

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.credentials[0].name).toBe('decoded@example.com')
  })

  it('should handle database error', async () => {
    mockGetSession.mockResolvedValueOnce({
      user: { id: 'user-123' },
    })

    mockParseProvider.mockReturnValueOnce({
      baseProvider: 'google',
    })

    mockDb.select.mockReturnValueOnce(mockDb)
    mockDb.from.mockReturnValueOnce(mockDb)
    mockDb.where.mockRejectedValueOnce(new Error('Database error'))

    const req = createMockRequestWithQuery('GET', '?provider=google')

    const { GET } = await import('@/app/api/auth/oauth/credentials/route')

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Internal server error')
    expect(mockLogger.error).toHaveBeenCalled()
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/auth/oauth/credentials/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { account, user, workflow } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { jwtDecode } from 'jwt-decode'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { evaluateScopeCoverage, parseProvider } from '@/lib/oauth/oauth'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('OAuthCredentialsAPI')

const credentialsQuerySchema = z
  .object({
    provider: z.string().nullish(),
    workflowId: z.string().uuid('Workflow ID must be a valid UUID').nullish(),
    credentialId: z
      .string()
      .min(1, 'Credential ID must not be empty')
      .max(255, 'Credential ID is too long')
      .nullish(),
  })
  .refine((data) => data.provider || data.credentialId, {
    message: 'Provider or credentialId is required',
    path: ['provider'],
  })

interface GoogleIdToken {
  email?: string
  sub?: string
  name?: string
}

/**
 * Get credentials for a specific provider
 */
export async function GET(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const { searchParams } = new URL(request.url)
    const rawQuery = {
      provider: searchParams.get('provider'),
      workflowId: searchParams.get('workflowId'),
      credentialId: searchParams.get('credentialId'),
    }

    const parseResult = credentialsQuerySchema.safeParse(rawQuery)

    if (!parseResult.success) {
      const refinementError = parseResult.error.errors.find((err) => err.code === 'custom')
      if (refinementError) {
        logger.warn(`[${requestId}] Invalid query parameters: ${refinementError.message}`)
        return NextResponse.json(
          {
            error: refinementError.message,
          },
          { status: 400 }
        )
      }

      const firstError = parseResult.error.errors[0]
      const errorMessage = firstError?.message || 'Validation failed'

      logger.warn(`[${requestId}] Invalid query parameters`, {
        errors: parseResult.error.errors,
      })

      return NextResponse.json(
        {
          error: errorMessage,
        },
        { status: 400 }
      )
    }

    const { provider: providerParam, workflowId, credentialId } = parseResult.data

    // Authenticate requester (supports session, API key, internal JWT)
    const authResult = await checkHybridAuth(request)
    if (!authResult.success || !authResult.userId) {
      logger.warn(`[${requestId}] Unauthenticated credentials request rejected`)
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }
    const requesterUserId = authResult.userId

    // Resolve effective user id: workflow owner if workflowId provided (with access check); else requester
    let effectiveUserId: string
    if (workflowId) {
      // Load workflow owner and workspace for access control
      const rows = await db
        .select({ userId: workflow.userId, workspaceId: workflow.workspaceId })
        .from(workflow)
        .where(eq(workflow.id, workflowId))
        .limit(1)

      if (!rows.length) {
        logger.warn(`[${requestId}] Workflow not found for credentials request`, { workflowId })
        return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
      }

      const wf = rows[0]

      if (requesterUserId !== wf.userId) {
        if (!wf.workspaceId) {
          logger.warn(
            `[${requestId}] Forbidden - workflow has no workspace and requester is not owner`,
            {
              requesterUserId,
            }
          )
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const perm = await getUserEntityPermissions(requesterUserId, 'workspace', wf.workspaceId)
        if (perm === null) {
          logger.warn(`[${requestId}] Forbidden credentials request - no workspace access`, {
            requesterUserId,
            workspaceId: wf.workspaceId,
          })
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
      }

      effectiveUserId = wf.userId
    } else {
      effectiveUserId = requesterUserId
    }

    // Parse the provider to get base provider and feature type (if provider is present)
    const { baseProvider } = parseProvider(providerParam || 'google-default')

    let accountsData

    if (credentialId) {
      // Foreign-aware lookup for a specific credential by id
      // If workflowId is provided and requester has access (checked above), allow fetching by id only
      if (workflowId) {
        accountsData = await db.select().from(account).where(eq(account.id, credentialId))
      } else {
        // Fallback: constrain to requester's own credentials when not in a workflow context
        accountsData = await db
          .select()
          .from(account)
          .where(and(eq(account.userId, effectiveUserId), eq(account.id, credentialId)))
      }
    } else {
      // Fetch all credentials for provider and effective user
      accountsData = await db
        .select()
        .from(account)
        .where(and(eq(account.userId, effectiveUserId), eq(account.providerId, providerParam!)))
    }

    // Transform accounts into credentials
    const credentials = await Promise.all(
      accountsData.map(async (acc) => {
        // Extract the feature type from providerId (e.g., 'google-default' -> 'default')
        const [_, featureType = 'default'] = acc.providerId.split('-')

        // Try multiple methods to get a user-friendly display name
        let displayName = ''

        // Method 1: Try to extract email from ID token (works for Google, etc.)
        if (acc.idToken) {
          try {
            const decoded = jwtDecode<GoogleIdToken>(acc.idToken)
            if (decoded.email) {
              displayName = decoded.email
            } else if (decoded.name) {
              displayName = decoded.name
            }
          } catch (_error) {
            logger.warn(`[${requestId}] Error decoding ID token`, {
              accountId: acc.id,
            })
          }
        }

        // Method 2: For GitHub, the accountId might be the username
        if (!displayName && baseProvider === 'github') {
          displayName = `${acc.accountId} (GitHub)`
        }

        // Method 3: Try to get the user's email from our database
        if (!displayName) {
          try {
            const userRecord = await db
              .select({ email: user.email })
              .from(user)
              .where(eq(user.id, acc.userId))
              .limit(1)

            if (userRecord.length > 0) {
              displayName = userRecord[0].email
            }
          } catch (_error) {
            logger.warn(`[${requestId}] Error fetching user email`, {
              userId: acc.userId,
            })
          }
        }

        // Fallback: Use accountId with provider type as context
        if (!displayName) {
          displayName = `${acc.accountId} (${baseProvider})`
        }

        const storedScope = acc.scope?.trim()
        const grantedScopes = storedScope ? storedScope.split(/[\s,]+/).filter(Boolean) : []
        const scopeEvaluation = evaluateScopeCoverage(acc.providerId, grantedScopes)

        return {
          id: acc.id,
          name: displayName,
          provider: acc.providerId,
          lastUsed: acc.updatedAt.toISOString(),
          isDefault: featureType === 'default',
          scopes: scopeEvaluation.grantedScopes,
          canonicalScopes: scopeEvaluation.canonicalScopes,
          missingScopes: scopeEvaluation.missingScopes,
          extraScopes: scopeEvaluation.extraScopes,
          requiresReauthorization: scopeEvaluation.requiresReauthorization,
        }
      })
    )

    return NextResponse.json({ credentials }, { status: 200 })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching OAuth credentials`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.test.ts]---
Location: sim-main/apps/sim/app/api/auth/oauth/disconnect/route.test.ts

```typescript
/**
 * Tests for OAuth disconnect API route
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockRequest } from '@/app/api/__test-utils__/utils'

describe('OAuth Disconnect API Route', () => {
  const mockGetSession = vi.fn()
  const mockDb = {
    delete: vi.fn().mockReturnThis(),
    where: vi.fn(),
  }
  const mockLogger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }

  const mockUUID = 'mock-uuid-12345678-90ab-cdef-1234-567890abcdef'

  beforeEach(() => {
    vi.resetModules()

    vi.stubGlobal('crypto', {
      randomUUID: vi.fn().mockReturnValue(mockUUID),
    })

    vi.doMock('@/lib/auth', () => ({
      getSession: mockGetSession,
    }))

    vi.doMock('@sim/db', () => ({
      db: mockDb,
    }))

    vi.doMock('@sim/db/schema', () => ({
      account: { userId: 'userId', providerId: 'providerId' },
    }))

    vi.doMock('drizzle-orm', () => ({
      and: vi.fn((...conditions) => ({ conditions, type: 'and' })),
      eq: vi.fn((field, value) => ({ field, value, type: 'eq' })),
      like: vi.fn((field, value) => ({ field, value, type: 'like' })),
      or: vi.fn((...conditions) => ({ conditions, type: 'or' })),
    }))

    vi.doMock('@/lib/logs/console/logger', () => ({
      createLogger: vi.fn().mockReturnValue(mockLogger),
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should disconnect provider successfully', async () => {
    mockGetSession.mockResolvedValueOnce({
      user: { id: 'user-123' },
    })

    mockDb.delete.mockReturnValueOnce(mockDb)
    mockDb.where.mockResolvedValueOnce(undefined)

    const req = createMockRequest('POST', {
      provider: 'google',
    })

    const { POST } = await import('@/app/api/auth/oauth/disconnect/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(mockLogger.info).toHaveBeenCalled()
  })

  it('should disconnect specific provider ID successfully', async () => {
    mockGetSession.mockResolvedValueOnce({
      user: { id: 'user-123' },
    })

    mockDb.delete.mockReturnValueOnce(mockDb)
    mockDb.where.mockResolvedValueOnce(undefined)

    const req = createMockRequest('POST', {
      provider: 'google',
      providerId: 'google-email',
    })

    const { POST } = await import('@/app/api/auth/oauth/disconnect/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(mockLogger.info).toHaveBeenCalled()
  })

  it('should handle unauthenticated user', async () => {
    mockGetSession.mockResolvedValueOnce(null)

    const req = createMockRequest('POST', {
      provider: 'google',
    })

    const { POST } = await import('@/app/api/auth/oauth/disconnect/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('User not authenticated')
    expect(mockLogger.warn).toHaveBeenCalled()
  })

  it('should handle missing provider', async () => {
    mockGetSession.mockResolvedValueOnce({
      user: { id: 'user-123' },
    })

    const req = createMockRequest('POST', {})

    const { POST } = await import('@/app/api/auth/oauth/disconnect/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Provider is required')
    expect(mockLogger.warn).toHaveBeenCalled()
  })

  it('should handle database error', async () => {
    mockGetSession.mockResolvedValueOnce({
      user: { id: 'user-123' },
    })

    mockDb.delete.mockReturnValueOnce(mockDb)
    mockDb.where.mockRejectedValueOnce(new Error('Database error'))

    const req = createMockRequest('POST', {
      provider: 'google',
    })

    const { POST } = await import('@/app/api/auth/oauth/disconnect/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Internal server error')
    expect(mockLogger.error).toHaveBeenCalled()
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/auth/oauth/disconnect/route.ts
Signals: Next.js, Zod

```typescript
import { db } from '@sim/db'
import { account } from '@sim/db/schema'
import { and, eq, like, or } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('OAuthDisconnectAPI')

const disconnectSchema = z.object({
  provider: z.string({ required_error: 'Provider is required' }).min(1, 'Provider is required'),
  providerId: z.string().optional(),
})

/**
 * Disconnect an OAuth provider for the current user
 */
export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const session = await getSession()

    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthenticated disconnect request rejected`)
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const rawBody = await request.json()
    const parseResult = disconnectSchema.safeParse(rawBody)

    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]
      const errorMessage = firstError?.message || 'Validation failed'

      logger.warn(`[${requestId}] Invalid disconnect request`, {
        errors: parseResult.error.errors,
      })

      return NextResponse.json(
        {
          error: errorMessage,
        },
        { status: 400 }
      )
    }

    const { provider, providerId } = parseResult.data

    logger.info(`[${requestId}] Processing OAuth disconnect request`, {
      provider,
      hasProviderId: !!providerId,
    })

    // If a specific providerId is provided, delete only that account
    if (providerId) {
      await db
        .delete(account)
        .where(and(eq(account.userId, session.user.id), eq(account.providerId, providerId)))
    } else {
      // Otherwise, delete all accounts for this provider
      // Handle both exact matches (e.g., 'confluence') and prefixed matches (e.g., 'google-email')
      await db
        .delete(account)
        .where(
          and(
            eq(account.userId, session.user.id),
            or(eq(account.providerId, provider), like(account.providerId, `${provider}-%`))
          )
        )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    logger.error(`[${requestId}] Error disconnecting OAuth provider`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/auth/oauth/microsoft/file/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { authorizeCredentialUse } from '@/lib/auth/credential-access'
import { validateMicrosoftGraphId } from '@/lib/core/security/input-validation'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { getCredential, refreshAccessTokenIfNeeded } from '@/app/api/auth/oauth/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('MicrosoftFileAPI')

export async function GET(request: NextRequest) {
  const requestId = generateRequestId()
  try {
    const { searchParams } = new URL(request.url)
    const credentialId = searchParams.get('credentialId')
    const fileId = searchParams.get('fileId')
    const workflowId = searchParams.get('workflowId') || undefined

    if (!credentialId || !fileId) {
      return NextResponse.json({ error: 'Credential ID and File ID are required' }, { status: 400 })
    }

    const fileIdValidation = validateMicrosoftGraphId(fileId, 'fileId')
    if (!fileIdValidation.isValid) {
      logger.warn(`[${requestId}] Invalid file ID: ${fileIdValidation.error}`)
      return NextResponse.json({ error: fileIdValidation.error }, { status: 400 })
    }

    const authz = await authorizeCredentialUse(request, {
      credentialId,
      workflowId,
      requireWorkflowIdForInternal: false,
    })

    if (!authz.ok || !authz.credentialOwnerUserId) {
      const status = authz.error === 'Credential not found' ? 404 : 403
      return NextResponse.json({ error: authz.error || 'Unauthorized' }, { status })
    }

    const credential = await getCredential(requestId, credentialId, authz.credentialOwnerUserId)
    if (!credential) {
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 })
    }

    const accessToken = await refreshAccessTokenIfNeeded(
      credentialId,
      authz.credentialOwnerUserId,
      requestId
    )

    if (!accessToken) {
      return NextResponse.json({ error: 'Failed to obtain valid access token' }, { status: 401 })
    }

    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}?$select=id,name,mimeType,webUrl,thumbnails,createdDateTime,lastModifiedDateTime,size,createdBy`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
      logger.error(`[${requestId}] Microsoft Graph API error`, {
        status: response.status,
        error: errorData.error?.message || 'Failed to fetch file from Microsoft OneDrive',
      })
      return NextResponse.json(
        {
          error: errorData.error?.message || 'Failed to fetch file from Microsoft OneDrive',
        },
        { status: response.status }
      )
    }

    const file = await response.json()

    const transformedFile = {
      id: file.id,
      name: file.name,
      mimeType:
        file.mimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      iconLink: file.thumbnails?.[0]?.small?.url,
      webViewLink: file.webUrl,
      thumbnailLink: file.thumbnails?.[0]?.medium?.url,
      createdTime: file.createdDateTime,
      modifiedTime: file.lastModifiedDateTime,
      size: file.size?.toString(),
      owners: file.createdBy
        ? [
            {
              displayName: file.createdBy.user?.displayName || 'Unknown',
              emailAddress: file.createdBy.user?.email || '',
            },
          ]
        : [],
      downloadUrl: `https://graph.microsoft.com/v1.0/me/drive/items/${file.id}/content`,
    }

    return NextResponse.json({ file: transformedFile }, { status: 200 })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching file from Microsoft OneDrive`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/auth/oauth/microsoft/files/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { authorizeCredentialUse } from '@/lib/auth/credential-access'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { getCredential, refreshAccessTokenIfNeeded } from '@/app/api/auth/oauth/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('MicrosoftFilesAPI')

/**
 * Get Excel files from Microsoft OneDrive
 */
export async function GET(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    // Get the credential ID from the query params
    const { searchParams } = new URL(request.url)
    const credentialId = searchParams.get('credentialId')
    const query = searchParams.get('query') || ''
    const workflowId = searchParams.get('workflowId') || undefined

    if (!credentialId) {
      logger.warn(`[${requestId}] Missing credential ID`)
      return NextResponse.json({ error: 'Credential ID is required' }, { status: 400 })
    }

    const authz = await authorizeCredentialUse(request, {
      credentialId,
      workflowId,
      requireWorkflowIdForInternal: false,
    })

    if (!authz.ok || !authz.credentialOwnerUserId) {
      const status = authz.error === 'Credential not found' ? 404 : 403
      return NextResponse.json({ error: authz.error || 'Unauthorized' }, { status })
    }

    const credential = await getCredential(requestId, credentialId, authz.credentialOwnerUserId)
    if (!credential) {
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 })
    }

    // Refresh access token if needed using the utility function
    const accessToken = await refreshAccessTokenIfNeeded(
      credentialId,
      authz.credentialOwnerUserId,
      requestId
    )

    if (!accessToken) {
      return NextResponse.json({ error: 'Failed to obtain valid access token' }, { status: 401 })
    }

    // Build search query for Excel files
    let searchQuery = '.xlsx'
    if (query) {
      searchQuery = `${query} .xlsx`
    }

    // Build the query parameters for Microsoft Graph API
    const searchParams_new = new URLSearchParams()
    searchParams_new.append(
      '$select',
      'id,name,mimeType,webUrl,thumbnails,createdDateTime,lastModifiedDateTime,size,createdBy'
    )
    searchParams_new.append('$top', '50')

    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/drive/root/search(q='${encodeURIComponent(searchQuery)}')?${searchParams_new.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
      logger.error(`[${requestId}] Microsoft Graph API error`, {
        status: response.status,
        error: errorData.error?.message || 'Failed to fetch Excel files from Microsoft OneDrive',
      })
      return NextResponse.json(
        {
          error: errorData.error?.message || 'Failed to fetch Excel files from Microsoft OneDrive',
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    let files = data.value || []

    // Transform Microsoft Graph response to match expected format and filter for Excel files
    files = files
      .filter(
        (file: any) =>
          file.name?.toLowerCase().endsWith('.xlsx') ||
          file.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      .map((file: any) => ({
        id: file.id,
        name: file.name,
        mimeType:
          file.mimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        iconLink: file.thumbnails?.[0]?.small?.url,
        webViewLink: file.webUrl,
        thumbnailLink: file.thumbnails?.[0]?.medium?.url,
        createdTime: file.createdDateTime,
        modifiedTime: file.lastModifiedDateTime,
        size: file.size?.toString(),
        owners: file.createdBy
          ? [
              {
                displayName: file.createdBy.user?.displayName || 'Unknown',
                emailAddress: file.createdBy.user?.email || '',
              },
            ]
          : [],
      }))

    return NextResponse.json({ files }, { status: 200 })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching Excel files from Microsoft OneDrive`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

````
