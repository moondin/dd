---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 261
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 261 of 933)

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
Location: sim-main/apps/sim/app/api/auth/oauth/token/route.test.ts

```typescript
/**
 * Tests for OAuth token API routes
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockRequest } from '@/app/api/__test-utils__/utils'

describe('OAuth Token API Routes', () => {
  const mockGetUserId = vi.fn()
  const mockGetCredential = vi.fn()
  const mockRefreshTokenIfNeeded = vi.fn()
  const mockAuthorizeCredentialUse = vi.fn()
  const mockCheckHybridAuth = vi.fn()

  const mockLogger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }

  const mockUUID = 'mock-uuid-12345678-90ab-cdef-1234-567890abcdef'
  const mockRequestId = mockUUID.slice(0, 8)

  beforeEach(() => {
    vi.resetModules()

    vi.stubGlobal('crypto', {
      randomUUID: vi.fn().mockReturnValue(mockUUID),
    })

    vi.doMock('@/app/api/auth/oauth/utils', () => ({
      getUserId: mockGetUserId,
      getCredential: mockGetCredential,
      refreshTokenIfNeeded: mockRefreshTokenIfNeeded,
    }))

    vi.doMock('@/lib/logs/console/logger', () => ({
      createLogger: vi.fn().mockReturnValue(mockLogger),
    }))

    vi.doMock('@/lib/auth/credential-access', () => ({
      authorizeCredentialUse: mockAuthorizeCredentialUse,
    }))

    vi.doMock('@/lib/auth/hybrid', () => ({
      checkHybridAuth: mockCheckHybridAuth,
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  /**
   * POST route tests
   */
  describe('POST handler', () => {
    it('should return access token successfully', async () => {
      mockAuthorizeCredentialUse.mockResolvedValueOnce({
        ok: true,
        authType: 'session',
        requesterUserId: 'test-user-id',
        credentialOwnerUserId: 'owner-user-id',
      })
      mockGetCredential.mockResolvedValueOnce({
        id: 'credential-id',
        accessToken: 'test-token',
        refreshToken: 'refresh-token',
        accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
        providerId: 'google',
      })
      mockRefreshTokenIfNeeded.mockResolvedValueOnce({
        accessToken: 'fresh-token',
        refreshed: false,
      })

      // Create mock request
      const req = createMockRequest('POST', {
        credentialId: 'credential-id',
      })

      // Import handler after setting up mocks
      const { POST } = await import('@/app/api/auth/oauth/token/route')

      // Call handler
      const response = await POST(req)
      const data = await response.json()

      // Verify request was handled correctly
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('accessToken', 'fresh-token')

      // Verify mocks were called correctly
      expect(mockAuthorizeCredentialUse).toHaveBeenCalled()
      expect(mockGetCredential).toHaveBeenCalled()
      expect(mockRefreshTokenIfNeeded).toHaveBeenCalled()
    })

    it('should handle workflowId for server-side authentication', async () => {
      mockAuthorizeCredentialUse.mockResolvedValueOnce({
        ok: true,
        authType: 'internal_jwt',
        requesterUserId: 'workflow-owner-id',
        credentialOwnerUserId: 'workflow-owner-id',
      })
      mockGetCredential.mockResolvedValueOnce({
        id: 'credential-id',
        accessToken: 'test-token',
        refreshToken: 'refresh-token',
        accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
        providerId: 'google',
      })
      mockRefreshTokenIfNeeded.mockResolvedValueOnce({
        accessToken: 'fresh-token',
        refreshed: false,
      })

      const req = createMockRequest('POST', {
        credentialId: 'credential-id',
        workflowId: 'workflow-id',
      })

      const { POST } = await import('@/app/api/auth/oauth/token/route')

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('accessToken', 'fresh-token')

      expect(mockAuthorizeCredentialUse).toHaveBeenCalled()
      expect(mockGetCredential).toHaveBeenCalled()
    })

    it('should handle missing credentialId', async () => {
      const req = createMockRequest('POST', {})

      const { POST } = await import('@/app/api/auth/oauth/token/route')

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error', 'Credential ID is required')
      expect(mockLogger.warn).toHaveBeenCalled()
    })

    it('should handle authentication failure', async () => {
      mockAuthorizeCredentialUse.mockResolvedValueOnce({
        ok: false,
        error: 'Authentication required',
      })

      const req = createMockRequest('POST', {
        credentialId: 'credential-id',
      })

      const { POST } = await import('@/app/api/auth/oauth/token/route')

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data).toHaveProperty('error')
    })

    it('should handle workflow not found', async () => {
      mockAuthorizeCredentialUse.mockResolvedValueOnce({ ok: false, error: 'Workflow not found' })

      const req = createMockRequest('POST', {
        credentialId: 'credential-id',
        workflowId: 'nonexistent-workflow-id',
      })

      const { POST } = await import('@/app/api/auth/oauth/token/route')

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(403)
    })

    it('should handle credential not found', async () => {
      mockAuthorizeCredentialUse.mockResolvedValueOnce({
        ok: true,
        authType: 'session',
        requesterUserId: 'test-user-id',
        credentialOwnerUserId: 'owner-user-id',
      })
      mockGetCredential.mockResolvedValueOnce(undefined)

      const req = createMockRequest('POST', {
        credentialId: 'nonexistent-credential-id',
      })

      const { POST } = await import('@/app/api/auth/oauth/token/route')

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data).toHaveProperty('error')
    })

    it('should handle token refresh failure', async () => {
      mockAuthorizeCredentialUse.mockResolvedValueOnce({
        ok: true,
        authType: 'session',
        requesterUserId: 'test-user-id',
        credentialOwnerUserId: 'owner-user-id',
      })
      mockGetCredential.mockResolvedValueOnce({
        id: 'credential-id',
        accessToken: 'test-token',
        refreshToken: 'refresh-token',
        accessTokenExpiresAt: new Date(Date.now() - 3600 * 1000), // Expired
        providerId: 'google',
      })
      mockRefreshTokenIfNeeded.mockRejectedValueOnce(new Error('Refresh failure'))

      const req = createMockRequest('POST', {
        credentialId: 'credential-id',
      })

      const { POST } = await import('@/app/api/auth/oauth/token/route')

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toHaveProperty('error', 'Failed to refresh access token')
    })
  })

  /**
   * GET route tests
   */
  describe('GET handler', () => {
    it('should return access token successfully', async () => {
      mockCheckHybridAuth.mockResolvedValueOnce({
        success: true,
        authType: 'session',
        userId: 'test-user-id',
      })
      mockGetCredential.mockResolvedValueOnce({
        id: 'credential-id',
        accessToken: 'test-token',
        refreshToken: 'refresh-token',
        accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
        providerId: 'google',
      })
      mockRefreshTokenIfNeeded.mockResolvedValueOnce({
        accessToken: 'fresh-token',
        refreshed: false,
      })

      const req = new Request(
        'http://localhost:3000/api/auth/oauth/token?credentialId=credential-id'
      )

      const { GET } = await import('@/app/api/auth/oauth/token/route')

      const response = await GET(req as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('accessToken', 'fresh-token')

      expect(mockCheckHybridAuth).toHaveBeenCalled()
      expect(mockGetCredential).toHaveBeenCalledWith(mockRequestId, 'credential-id', 'test-user-id')
      expect(mockRefreshTokenIfNeeded).toHaveBeenCalled()
    })

    it('should handle missing credentialId', async () => {
      const req = new Request('http://localhost:3000/api/auth/oauth/token')

      const { GET } = await import('@/app/api/auth/oauth/token/route')

      const response = await GET(req as any)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error', 'Credential ID is required')
      expect(mockLogger.warn).toHaveBeenCalled()
    })

    it('should handle authentication failure', async () => {
      mockCheckHybridAuth.mockResolvedValueOnce({
        success: false,
        error: 'Authentication required',
      })

      const req = new Request(
        'http://localhost:3000/api/auth/oauth/token?credentialId=credential-id'
      )

      const { GET } = await import('@/app/api/auth/oauth/token/route')

      const response = await GET(req as any)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toHaveProperty('error')
    })

    it('should handle credential not found', async () => {
      mockCheckHybridAuth.mockResolvedValueOnce({
        success: true,
        authType: 'session',
        userId: 'test-user-id',
      })
      mockGetCredential.mockResolvedValueOnce(undefined)

      const req = new Request(
        'http://localhost:3000/api/auth/oauth/token?credentialId=nonexistent-credential-id'
      )

      const { GET } = await import('@/app/api/auth/oauth/token/route')

      const response = await GET(req as any)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data).toHaveProperty('error')
    })

    it('should handle missing access token', async () => {
      mockCheckHybridAuth.mockResolvedValueOnce({
        success: true,
        authType: 'session',
        userId: 'test-user-id',
      })
      mockGetCredential.mockResolvedValueOnce({
        id: 'credential-id',
        accessToken: null,
        refreshToken: 'refresh-token',
        providerId: 'google',
      })

      const req = new Request(
        'http://localhost:3000/api/auth/oauth/token?credentialId=credential-id'
      )

      const { GET } = await import('@/app/api/auth/oauth/token/route')

      const response = await GET(req as any)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error')
    })

    it('should handle token refresh failure', async () => {
      mockCheckHybridAuth.mockResolvedValueOnce({
        success: true,
        authType: 'session',
        userId: 'test-user-id',
      })
      mockGetCredential.mockResolvedValueOnce({
        id: 'credential-id',
        accessToken: 'test-token',
        refreshToken: 'refresh-token',
        accessTokenExpiresAt: new Date(Date.now() - 3600 * 1000), // Expired
        providerId: 'google',
      })
      mockRefreshTokenIfNeeded.mockRejectedValueOnce(new Error('Refresh failure'))

      const req = new Request(
        'http://localhost:3000/api/auth/oauth/token?credentialId=credential-id'
      )

      const { GET } = await import('@/app/api/auth/oauth/token/route')

      const response = await GET(req as any)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toHaveProperty('error')
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/auth/oauth/token/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { authorizeCredentialUse } from '@/lib/auth/credential-access'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { getCredential, refreshTokenIfNeeded } from '@/app/api/auth/oauth/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('OAuthTokenAPI')

const tokenRequestSchema = z.object({
  credentialId: z
    .string({ required_error: 'Credential ID is required' })
    .min(1, 'Credential ID is required'),
  workflowId: z.string().min(1, 'Workflow ID is required').nullish(),
})

const tokenQuerySchema = z.object({
  credentialId: z
    .string({
      required_error: 'Credential ID is required',
      invalid_type_error: 'Credential ID is required',
    })
    .min(1, 'Credential ID is required'),
})

/**
 * Get an access token for a specific credential
 * Supports both session-based authentication (for client-side requests)
 * and workflow-based authentication (for server-side requests)
 */
export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  logger.info(`[${requestId}] OAuth token API POST request received`)

  try {
    const rawBody = await request.json()
    const parseResult = tokenRequestSchema.safeParse(rawBody)

    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]
      const errorMessage = firstError?.message || 'Validation failed'

      logger.warn(`[${requestId}] Invalid token request`, {
        errors: parseResult.error.errors,
      })

      return NextResponse.json(
        {
          error: errorMessage,
        },
        { status: 400 }
      )
    }

    const { credentialId, workflowId } = parseResult.data

    // We already have workflowId from the parsed body; avoid forcing hybrid auth to re-read it
    const authz = await authorizeCredentialUse(request, {
      credentialId,
      workflowId: workflowId ?? undefined,
      requireWorkflowIdForInternal: false,
    })
    if (!authz.ok || !authz.credentialOwnerUserId) {
      return NextResponse.json({ error: authz.error || 'Unauthorized' }, { status: 403 })
    }

    // Fetch the credential as the owner to enforce ownership scoping
    const credential = await getCredential(requestId, credentialId, authz.credentialOwnerUserId)

    if (!credential) {
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 })
    }

    try {
      // Refresh the token if needed
      const { accessToken } = await refreshTokenIfNeeded(requestId, credential, credentialId)
      return NextResponse.json(
        {
          accessToken,
          idToken: credential.idToken || undefined,
        },
        { status: 200 }
      )
    } catch (error) {
      logger.error(`[${requestId}] Failed to refresh access token:`, error)
      return NextResponse.json({ error: 'Failed to refresh access token' }, { status: 401 })
    }
  } catch (error) {
    logger.error(`[${requestId}] Error getting access token`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * Get the access token for a specific credential
 */
export async function GET(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const { searchParams } = new URL(request.url)
    const rawQuery = {
      credentialId: searchParams.get('credentialId'),
    }

    const parseResult = tokenQuerySchema.safeParse(rawQuery)

    if (!parseResult.success) {
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

    const { credentialId } = parseResult.data

    // For GET requests, we only support session-based authentication
    const auth = await checkHybridAuth(request, { requireWorkflowId: false })
    if (!auth.success || auth.authType !== 'session' || !auth.userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    // Get the credential from the database
    const credential = await getCredential(requestId, credentialId, auth.userId)

    if (!credential) {
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 })
    }

    if (!credential.accessToken) {
      logger.warn(`[${requestId}] No access token available for credential`)
      return NextResponse.json({ error: 'No access token available' }, { status: 400 })
    }

    try {
      const { accessToken } = await refreshTokenIfNeeded(requestId, credential, credentialId)
      return NextResponse.json(
        {
          accessToken,
          idToken: credential.idToken || undefined,
        },
        { status: 200 }
      )
    } catch (_error) {
      return NextResponse.json({ error: 'Failed to refresh access token' }, { status: 401 })
    }
  } catch (error) {
    logger.error(`[${requestId}] Error fetching access token`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/auth/oauth/wealthbox/item/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { account } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { validateEnum, validatePathSegment } from '@/lib/core/security/input-validation'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { refreshAccessTokenIfNeeded } from '@/app/api/auth/oauth/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('WealthboxItemAPI')

/**
 * Get a single item (note, contact, task) from Wealthbox
 */
export async function GET(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    // Get the session
    const session = await getSession()

    // Check if the user is authenticated
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthenticated request rejected`)
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    // Get parameters from query
    const { searchParams } = new URL(request.url)
    const credentialId = searchParams.get('credentialId')
    const itemId = searchParams.get('itemId')
    const type = searchParams.get('type') || 'contact'

    if (!credentialId || !itemId) {
      logger.warn(`[${requestId}] Missing required parameters`, { credentialId, itemId })
      return NextResponse.json({ error: 'Credential ID and Item ID are required' }, { status: 400 })
    }

    const typeValidation = validateEnum(type, ['contact'] as const, 'type')
    if (!typeValidation.isValid) {
      logger.warn(`[${requestId}] Invalid item type: ${typeValidation.error}`)
      return NextResponse.json({ error: typeValidation.error }, { status: 400 })
    }

    const itemIdValidation = validatePathSegment(itemId, {
      paramName: 'itemId',
      maxLength: 100,
      allowHyphens: true,
      allowUnderscores: true,
      allowDots: false,
    })
    if (!itemIdValidation.isValid) {
      logger.warn(`[${requestId}] Invalid item ID: ${itemIdValidation.error}`)
      return NextResponse.json({ error: itemIdValidation.error }, { status: 400 })
    }

    const credentials = await db.select().from(account).where(eq(account.id, credentialId)).limit(1)

    if (!credentials.length) {
      logger.warn(`[${requestId}] Credential not found`, { credentialId })
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 })
    }

    const credential = credentials[0]

    if (credential.userId !== session.user.id) {
      logger.warn(`[${requestId}] Unauthorized credential access attempt`, {
        credentialUserId: credential.userId,
        requestUserId: session.user.id,
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const accessToken = await refreshAccessTokenIfNeeded(credentialId, session.user.id, requestId)

    if (!accessToken) {
      logger.error(`[${requestId}] Failed to obtain valid access token`)
      return NextResponse.json({ error: 'Failed to obtain valid access token' }, { status: 401 })
    }

    const endpoints = {
      contact: 'contacts',
    }
    const endpoint = endpoints[type as keyof typeof endpoints]

    logger.info(`[${requestId}] Fetching ${type} ${itemId} from Wealthbox`)

    const response = await fetch(`https://api.crmworkspace.com/v1/${endpoint}/${itemId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      logger.error(
        `[${requestId}] Wealthbox API error: ${response.status} ${response.statusText}`,
        {
          error: errorText,
          endpoint,
          itemId,
        }
      )

      if (response.status === 404) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 })
      }

      return NextResponse.json(
        { error: `Failed to fetch ${type} from Wealthbox` },
        { status: response.status }
      )
    }

    const data = await response.json()

    logger.info(`[${requestId}] Wealthbox API response structure`, {
      type,
      dataKeys: Object.keys(data || {}),
      hasContacts: !!data.contacts,
      totalCount: data.meta?.total_count,
    })

    let items: any[] = []

    if (type === 'contact') {
      if (data?.id) {
        const item = {
          id: data.id?.toString() || '',
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || `Contact ${data.id}`,
          type: 'contact',
          content: data.background_info || '',
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
        items = [item]
      } else {
        logger.warn(`[${requestId}] Unexpected contact response format`, { data })
        items = []
      }
    }

    logger.info(
      `[${requestId}] Successfully fetched ${items.length} ${type}s from Wealthbox (total: ${data.meta?.total_count || 'unknown'})`
    )

    return NextResponse.json({ item: items[0] }, { status: 200 })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching Wealthbox item`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/auth/oauth/wealthbox/items/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { account } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { refreshAccessTokenIfNeeded } from '@/app/api/auth/oauth/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('WealthboxItemsAPI')

/**
 * Get items (notes, contacts, tasks) from Wealthbox
 */
export async function GET(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    // Get the session
    const session = await getSession()

    // Check if the user is authenticated
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthenticated request rejected`)
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    // Get parameters from query
    const { searchParams } = new URL(request.url)
    const credentialId = searchParams.get('credentialId')
    const type = searchParams.get('type') || 'contact'
    const query = searchParams.get('query') || ''

    if (!credentialId) {
      logger.warn(`[${requestId}] Missing credential ID`)
      return NextResponse.json({ error: 'Credential ID is required' }, { status: 400 })
    }

    // Validate item type - only handle contacts now
    if (type !== 'contact') {
      logger.warn(`[${requestId}] Invalid item type: ${type}`)
      return NextResponse.json(
        { error: 'Invalid item type. Only contact is supported.' },
        { status: 400 }
      )
    }

    // Get the credential from the database
    const credentials = await db.select().from(account).where(eq(account.id, credentialId)).limit(1)

    if (!credentials.length) {
      logger.warn(`[${requestId}] Credential not found`, { credentialId })
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 })
    }

    const credential = credentials[0]

    // Check if the credential belongs to the user
    if (credential.userId !== session.user.id) {
      logger.warn(`[${requestId}] Unauthorized credential access attempt`, {
        credentialUserId: credential.userId,
        requestUserId: session.user.id,
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Refresh access token if needed
    const accessToken = await refreshAccessTokenIfNeeded(credentialId, session.user.id, requestId)

    if (!accessToken) {
      logger.error(`[${requestId}] Failed to obtain valid access token`)
      return NextResponse.json({ error: 'Failed to obtain valid access token' }, { status: 401 })
    }

    // Use correct endpoints based on documentation - only for contacts
    const endpoints = {
      contact: 'contacts',
    }
    const endpoint = endpoints[type as keyof typeof endpoints]

    // Build URL - using correct API base URL
    const url = new URL(`https://api.crmworkspace.com/v1/${endpoint}`)

    logger.info(`[${requestId}] Fetching ${type}s from Wealthbox`, {
      endpoint,
      url: url.toString(),
      hasQuery: !!query.trim(),
    })

    // Make request to Wealthbox API
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      logger.error(
        `[${requestId}] Wealthbox API error: ${response.status} ${response.statusText}`,
        {
          error: errorText,
          endpoint,
          url: url.toString(),
        }
      )
      return NextResponse.json(
        { error: `Failed to fetch ${type}s from Wealthbox` },
        { status: response.status }
      )
    }

    const data = await response.json()

    logger.info(`[${requestId}] Wealthbox API response structure`, {
      type,
      status: response.status,
      dataKeys: Object.keys(data || {}),
      hasContacts: !!data.contacts,
      dataStructure: typeof data === 'object' ? Object.keys(data) : 'not an object',
    })

    // Transform the response based on type and correct response format
    let items: any[] = []

    if (type === 'contact') {
      const contacts = data.contacts || []
      if (!Array.isArray(contacts)) {
        logger.warn(`[${requestId}] Contacts is not an array`, {
          contacts,
          dataType: typeof contacts,
        })
        return NextResponse.json({ items: [] }, { status: 200 })
      }

      items = contacts.map((item: any) => ({
        id: item.id?.toString() || '',
        name: `${item.first_name || ''} ${item.last_name || ''}`.trim() || `Contact ${item.id}`,
        type: 'contact',
        content: item.background_information || '',
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }))
    }

    // Apply client-side filtering if query is provided
    if (query.trim()) {
      const searchTerm = query.trim().toLowerCase()
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.content.toLowerCase().includes(searchTerm)
      )
    }

    logger.info(`[${requestId}] Successfully fetched ${items.length} ${type}s from Wealthbox`, {
      totalItems: items.length,
      hasSearchQuery: !!query.trim(),
    })

    return NextResponse.json({ items }, { status: 200 })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching Wealthbox items`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/auth/oauth2/callback/shopify/route.ts
Signals: Next.js

```typescript
import crypto from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { env } from '@/lib/core/config/env'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('ShopifyCallback')

export const dynamic = 'force-dynamic'

const SHOP_DOMAIN_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/

/**
 * Validates the HMAC signature from Shopify to ensure the request is authentic
 * @see https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/offline-access-tokens
 */
function validateHmac(searchParams: URLSearchParams, clientSecret: string): boolean {
  const hmac = searchParams.get('hmac')
  if (!hmac) {
    return false
  }

  const params: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    if (key !== 'hmac') {
      params[key] = value
    }
  })

  const message = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')

  const generatedHmac = crypto.createHmac('sha256', clientSecret).update(message).digest('hex')

  try {
    return crypto.timingSafeEqual(Buffer.from(hmac, 'hex'), Buffer.from(generatedHmac, 'hex'))
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  const baseUrl = getBaseUrl()

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.redirect(`${baseUrl}/workspace?error=unauthorized`)
    }

    const { searchParams } = request.nextUrl
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const shop = searchParams.get('shop')

    const storedState = request.cookies.get('shopify_oauth_state')?.value
    const storedShop = request.cookies.get('shopify_shop_domain')?.value

    const clientId = env.SHOPIFY_CLIENT_ID
    const clientSecret = env.SHOPIFY_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      logger.error('Shopify credentials not configured')
      return NextResponse.redirect(`${baseUrl}/workspace?error=shopify_config_error`)
    }

    if (!validateHmac(searchParams, clientSecret)) {
      logger.error('HMAC validation failed in Shopify OAuth callback')
      return NextResponse.redirect(`${baseUrl}/workspace?error=shopify_hmac_invalid`)
    }

    if (!state || state !== storedState) {
      logger.error('State mismatch in Shopify OAuth callback')
      return NextResponse.redirect(`${baseUrl}/workspace?error=shopify_state_mismatch`)
    }

    if (!code) {
      logger.error('No code received from Shopify')
      return NextResponse.redirect(`${baseUrl}/workspace?error=shopify_no_code`)
    }

    const shopDomain = shop || storedShop
    if (!shopDomain) {
      logger.error('No shop domain available')
      return NextResponse.redirect(`${baseUrl}/workspace?error=shopify_no_shop`)
    }

    if (!SHOP_DOMAIN_REGEX.test(shopDomain)) {
      logger.error('Invalid shop domain format:', { shopDomain })
      return NextResponse.redirect(`${baseUrl}/workspace?error=shopify_invalid_shop`)
    }

    const tokenResponse = await fetch(`https://${shopDomain}/admin/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      logger.error('Failed to exchange code for token:', {
        status: tokenResponse.status,
        body: errorText,
      })
      return NextResponse.redirect(`${baseUrl}/workspace?error=shopify_token_error`)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token
    const scope = tokenData.scope

    logger.info('Shopify token exchange successful:', {
      hasAccessToken: !!accessToken,
      scope: scope,
    })

    if (!accessToken) {
      logger.error('No access token in response')
      return NextResponse.redirect(`${baseUrl}/workspace?error=shopify_no_token`)
    }

    const storeUrl = new URL(`${baseUrl}/api/auth/oauth2/shopify/store`)

    const response = NextResponse.redirect(storeUrl)

    response.cookies.set('shopify_pending_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60,
      path: '/',
    })

    response.cookies.set('shopify_pending_shop', shopDomain, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60,
      path: '/',
    })

    response.cookies.set('shopify_pending_scope', scope || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60,
      path: '/',
    })

    response.cookies.delete('shopify_oauth_state')
    response.cookies.delete('shopify_shop_domain')

    return response
  } catch (error) {
    logger.error('Error in Shopify OAuth callback:', error)
    return NextResponse.redirect(`${baseUrl}/workspace?error=shopify_callback_error`)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/auth/oauth2/shopify/store/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { account } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import { safeAccountInsert } from '@/app/api/auth/oauth/utils'

const logger = createLogger('ShopifyStore')

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const baseUrl = getBaseUrl()

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn('Unauthorized attempt to store Shopify token')
      return NextResponse.redirect(`${baseUrl}/workspace?error=unauthorized`)
    }

    const accessToken = request.cookies.get('shopify_pending_token')?.value
    const shopDomain = request.cookies.get('shopify_pending_shop')?.value
    const scope = request.cookies.get('shopify_pending_scope')?.value

    if (!accessToken || !shopDomain) {
      logger.error('Missing token or shop domain in cookies')
      return NextResponse.redirect(`${baseUrl}/workspace?error=shopify_missing_data`)
    }

    const shopResponse = await fetch(`https://${shopDomain}/admin/api/2024-10/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    })

    if (!shopResponse.ok) {
      const errorText = await shopResponse.text()
      logger.error('Invalid Shopify token', {
        status: shopResponse.status,
        error: errorText,
      })
      return NextResponse.redirect(`${baseUrl}/workspace?error=shopify_invalid_token`)
    }

    const shopData = await shopResponse.json()
    const shopInfo = shopData.shop

    const existing = await db.query.account.findFirst({
      where: and(eq(account.userId, session.user.id), eq(account.providerId, 'shopify')),
    })

    const now = new Date()

    const accountData = {
      accessToken: accessToken,
      accountId: shopInfo.id?.toString() || shopDomain,
      scope: scope || '',
      updatedAt: now,
      idToken: shopDomain,
    }

    if (existing) {
      await db.update(account).set(accountData).where(eq(account.id, existing.id))
      logger.info('Updated existing Shopify account', { accountId: existing.id })
    } else {
      await safeAccountInsert(
        {
          id: `shopify_${session.user.id}_${Date.now()}`,
          userId: session.user.id,
          providerId: 'shopify',
          accountId: accountData.accountId,
          accessToken: accountData.accessToken,
          scope: accountData.scope,
          idToken: accountData.idToken,
          createdAt: now,
          updatedAt: now,
        },
        { provider: 'Shopify', identifier: shopDomain }
      )
    }

    const returnUrl = request.cookies.get('shopify_return_url')?.value

    const redirectUrl = returnUrl || `${baseUrl}/workspace`
    const finalUrl = new URL(redirectUrl)
    finalUrl.searchParams.set('shopify_connected', 'true')

    const response = NextResponse.redirect(finalUrl.toString())
    response.cookies.delete('shopify_pending_token')
    response.cookies.delete('shopify_pending_shop')
    response.cookies.delete('shopify_pending_scope')
    response.cookies.delete('shopify_return_url')

    return response
  } catch (error) {
    logger.error('Error storing Shopify token:', error)
    return NextResponse.redirect(`${baseUrl}/workspace?error=shopify_store_error`)
  }
}
```

--------------------------------------------------------------------------------

````
