---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 259
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 259 of 933)

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
Location: sim-main/apps/sim/app/api/auth/forget-password/route.test.ts

```typescript
/**
 * Tests for forget password API route
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockRequest, setupAuthApiMocks } from '@/app/api/__test-utils__/utils'

describe('Forget Password API Route', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should send password reset email successfully', async () => {
    setupAuthApiMocks({
      operations: {
        forgetPassword: { success: true },
      },
    })

    const req = createMockRequest('POST', {
      email: 'test@example.com',
      redirectTo: 'https://example.com/reset',
    })

    const { POST } = await import('@/app/api/auth/forget-password/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)

    const auth = await import('@/lib/auth')
    expect(auth.auth.api.forgetPassword).toHaveBeenCalledWith({
      body: {
        email: 'test@example.com',
        redirectTo: 'https://example.com/reset',
      },
      method: 'POST',
    })
  })

  it('should send password reset email without redirectTo', async () => {
    setupAuthApiMocks({
      operations: {
        forgetPassword: { success: true },
      },
    })

    const req = createMockRequest('POST', {
      email: 'test@example.com',
    })

    const { POST } = await import('@/app/api/auth/forget-password/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)

    const auth = await import('@/lib/auth')
    expect(auth.auth.api.forgetPassword).toHaveBeenCalledWith({
      body: {
        email: 'test@example.com',
        redirectTo: undefined,
      },
      method: 'POST',
    })
  })

  it('should handle missing email', async () => {
    setupAuthApiMocks()

    const req = createMockRequest('POST', {})

    const { POST } = await import('@/app/api/auth/forget-password/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toBe('Email is required')

    const auth = await import('@/lib/auth')
    expect(auth.auth.api.forgetPassword).not.toHaveBeenCalled()
  })

  it('should handle empty email', async () => {
    setupAuthApiMocks()

    const req = createMockRequest('POST', {
      email: '',
    })

    const { POST } = await import('@/app/api/auth/forget-password/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toBe('Please provide a valid email address')

    const auth = await import('@/lib/auth')
    expect(auth.auth.api.forgetPassword).not.toHaveBeenCalled()
  })

  it('should handle auth service error with message', async () => {
    const errorMessage = 'User not found'

    setupAuthApiMocks({
      operations: {
        forgetPassword: {
          success: false,
          error: errorMessage,
        },
      },
    })

    const req = createMockRequest('POST', {
      email: 'nonexistent@example.com',
    })

    const { POST } = await import('@/app/api/auth/forget-password/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.message).toBe(errorMessage)

    const logger = await import('@/lib/logs/console/logger')
    const mockLogger = logger.createLogger('ForgetPasswordTest')
    expect(mockLogger.error).toHaveBeenCalledWith('Error requesting password reset:', {
      error: expect.any(Error),
    })
  })

  it('should handle unknown error', async () => {
    setupAuthApiMocks()

    vi.doMock('@/lib/auth', () => ({
      auth: {
        api: {
          forgetPassword: vi.fn().mockRejectedValue('Unknown error'),
        },
      },
    }))

    const req = createMockRequest('POST', {
      email: 'test@example.com',
    })

    const { POST } = await import('@/app/api/auth/forget-password/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.message).toBe('Failed to send password reset email. Please try again later.')

    const logger = await import('@/lib/logs/console/logger')
    const mockLogger = logger.createLogger('ForgetPasswordTest')
    expect(mockLogger.error).toHaveBeenCalled()
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/auth/forget-password/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('ForgetPasswordAPI')

const forgetPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please provide a valid email address'),
  redirectTo: z
    .string()
    .url('Redirect URL must be a valid URL')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationResult = forgetPasswordSchema.safeParse(body)

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]
      const errorMessage = firstError?.message || 'Invalid request data'

      logger.warn('Invalid forget password request data', {
        errors: validationResult.error.format(),
      })
      return NextResponse.json({ message: errorMessage }, { status: 400 })
    }

    const { email, redirectTo } = validationResult.data

    await auth.api.forgetPassword({
      body: {
        email,
        redirectTo,
      },
      method: 'POST',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error requesting password reset:', { error })

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to send password reset email. Please try again later.',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: utils.test.ts]---
Location: sim-main/apps/sim/app/api/auth/oauth/utils.test.ts

```typescript
/**
 * Tests for OAuth utility functions
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockSession = { user: { id: 'test-user-id' } }
const mockGetSession = vi.fn()

vi.mock('@/lib/auth', () => ({
  getSession: () => mockGetSession(),
}))

vi.mock('@sim/db', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnValue([]),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
  },
}))

vi.mock('@/lib/oauth/oauth', () => ({
  refreshOAuthToken: vi.fn(),
}))

vi.mock('@/lib/logs/console/logger', () => ({
  createLogger: vi.fn().mockReturnValue({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}))

import { db } from '@sim/db'
import { refreshOAuthToken } from '@/lib/oauth/oauth'
import {
  getCredential,
  getUserId,
  refreshAccessTokenIfNeeded,
  refreshTokenIfNeeded,
} from '@/app/api/auth/oauth/utils'

const mockDb = db as any
const mockRefreshOAuthToken = refreshOAuthToken as any

describe('OAuth Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSession.mockResolvedValue(mockSession)
    mockDb.limit.mockReturnValue([])
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getUserId', () => {
    it('should get user ID from session when no workflowId is provided', async () => {
      const userId = await getUserId('request-id')

      expect(userId).toBe('test-user-id')
    })

    it('should get user ID from workflow when workflowId is provided', async () => {
      mockDb.limit.mockReturnValueOnce([{ userId: 'workflow-owner-id' }])

      const userId = await getUserId('request-id', 'workflow-id')

      expect(mockDb.select).toHaveBeenCalled()
      expect(mockDb.from).toHaveBeenCalled()
      expect(mockDb.where).toHaveBeenCalled()
      expect(mockDb.limit).toHaveBeenCalledWith(1)
      expect(userId).toBe('workflow-owner-id')
    })

    it('should return undefined if no session is found', async () => {
      mockGetSession.mockResolvedValueOnce(null)

      const userId = await getUserId('request-id')

      expect(userId).toBeUndefined()
    })

    it('should return undefined if workflow is not found', async () => {
      mockDb.limit.mockReturnValueOnce([])

      const userId = await getUserId('request-id', 'nonexistent-workflow-id')

      expect(userId).toBeUndefined()
    })
  })

  describe('getCredential', () => {
    it('should return credential when found', async () => {
      const mockCredential = { id: 'credential-id', userId: 'test-user-id' }
      mockDb.limit.mockReturnValueOnce([mockCredential])

      const credential = await getCredential('request-id', 'credential-id', 'test-user-id')

      expect(mockDb.select).toHaveBeenCalled()
      expect(mockDb.from).toHaveBeenCalled()
      expect(mockDb.where).toHaveBeenCalled()
      expect(mockDb.limit).toHaveBeenCalledWith(1)

      expect(credential).toEqual(mockCredential)
    })

    it('should return undefined when credential is not found', async () => {
      mockDb.limit.mockReturnValueOnce([])

      const credential = await getCredential('request-id', 'nonexistent-id', 'test-user-id')

      expect(credential).toBeUndefined()
    })
  })

  describe('refreshTokenIfNeeded', () => {
    it('should return valid token without refresh if not expired', async () => {
      const mockCredential = {
        id: 'credential-id',
        accessToken: 'valid-token',
        refreshToken: 'refresh-token',
        accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour in the future
        providerId: 'google',
      }

      const result = await refreshTokenIfNeeded('request-id', mockCredential, 'credential-id')

      expect(mockRefreshOAuthToken).not.toHaveBeenCalled()
      expect(result).toEqual({ accessToken: 'valid-token', refreshed: false })
    })

    it('should refresh token when expired', async () => {
      const mockCredential = {
        id: 'credential-id',
        accessToken: 'expired-token',
        refreshToken: 'refresh-token',
        accessTokenExpiresAt: new Date(Date.now() - 3600 * 1000), // 1 hour in the past
        providerId: 'google',
      }

      mockRefreshOAuthToken.mockResolvedValueOnce({
        accessToken: 'new-token',
        expiresIn: 3600,
        refreshToken: 'new-refresh-token',
      })

      const result = await refreshTokenIfNeeded('request-id', mockCredential, 'credential-id')

      expect(mockRefreshOAuthToken).toHaveBeenCalledWith('google', 'refresh-token')
      expect(mockDb.update).toHaveBeenCalled()
      expect(mockDb.set).toHaveBeenCalled()
      expect(result).toEqual({ accessToken: 'new-token', refreshed: true })
    })

    it('should handle refresh token error', async () => {
      const mockCredential = {
        id: 'credential-id',
        accessToken: 'expired-token',
        refreshToken: 'refresh-token',
        accessTokenExpiresAt: new Date(Date.now() - 3600 * 1000), // 1 hour in the past
        providerId: 'google',
      }

      mockRefreshOAuthToken.mockResolvedValueOnce(null)

      await expect(
        refreshTokenIfNeeded('request-id', mockCredential, 'credential-id')
      ).rejects.toThrow('Failed to refresh token')
    })

    it('should not attempt refresh if no refresh token', async () => {
      const mockCredential = {
        id: 'credential-id',
        accessToken: 'token',
        refreshToken: null,
        accessTokenExpiresAt: new Date(Date.now() - 3600 * 1000), // 1 hour in the past
        providerId: 'google',
      }

      const result = await refreshTokenIfNeeded('request-id', mockCredential, 'credential-id')

      expect(mockRefreshOAuthToken).not.toHaveBeenCalled()
      expect(result).toEqual({ accessToken: 'token', refreshed: false })
    })
  })

  describe('refreshAccessTokenIfNeeded', () => {
    it('should return valid access token without refresh if not expired', async () => {
      const mockCredential = {
        id: 'credential-id',
        accessToken: 'valid-token',
        refreshToken: 'refresh-token',
        accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour in the future
        providerId: 'google',
        userId: 'test-user-id',
      }
      mockDb.limit.mockReturnValueOnce([mockCredential])

      const token = await refreshAccessTokenIfNeeded('credential-id', 'test-user-id', 'request-id')

      expect(mockRefreshOAuthToken).not.toHaveBeenCalled()
      expect(token).toBe('valid-token')
    })

    it('should refresh token when expired', async () => {
      const mockCredential = {
        id: 'credential-id',
        accessToken: 'expired-token',
        refreshToken: 'refresh-token',
        accessTokenExpiresAt: new Date(Date.now() - 3600 * 1000), // 1 hour in the past
        providerId: 'google',
        userId: 'test-user-id',
      }
      mockDb.limit.mockReturnValueOnce([mockCredential])

      mockRefreshOAuthToken.mockResolvedValueOnce({
        accessToken: 'new-token',
        expiresIn: 3600,
        refreshToken: 'new-refresh-token',
      })

      const token = await refreshAccessTokenIfNeeded('credential-id', 'test-user-id', 'request-id')

      expect(mockRefreshOAuthToken).toHaveBeenCalledWith('google', 'refresh-token')
      expect(mockDb.update).toHaveBeenCalled()
      expect(mockDb.set).toHaveBeenCalled()
      expect(token).toBe('new-token')
    })

    it('should return null if credential not found', async () => {
      mockDb.limit.mockReturnValueOnce([])

      const token = await refreshAccessTokenIfNeeded('nonexistent-id', 'test-user-id', 'request-id')

      expect(token).toBeNull()
    })

    it('should return null if refresh fails', async () => {
      const mockCredential = {
        id: 'credential-id',
        accessToken: 'expired-token',
        refreshToken: 'refresh-token',
        accessTokenExpiresAt: new Date(Date.now() - 3600 * 1000), // 1 hour in the past
        providerId: 'google',
        userId: 'test-user-id',
      }
      mockDb.limit.mockReturnValueOnce([mockCredential])

      mockRefreshOAuthToken.mockResolvedValueOnce(null)

      const token = await refreshAccessTokenIfNeeded('credential-id', 'test-user-id', 'request-id')

      expect(token).toBeNull()
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/app/api/auth/oauth/utils.ts

```typescript
import { db } from '@sim/db'
import { account, workflow } from '@sim/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'
import { refreshOAuthToken } from '@/lib/oauth/oauth'

const logger = createLogger('OAuthUtilsAPI')

interface AccountInsertData {
  id: string
  userId: string
  providerId: string
  accountId: string
  accessToken: string
  scope: string
  createdAt: Date
  updatedAt: Date
  refreshToken?: string
  idToken?: string
  accessTokenExpiresAt?: Date
}

/**
 * Safely inserts an account record, handling duplicate constraint violations gracefully.
 * If a duplicate is detected (unique constraint violation), logs a warning and returns success.
 */
export async function safeAccountInsert(
  data: AccountInsertData,
  context: { provider: string; identifier?: string }
): Promise<void> {
  try {
    await db.insert(account).values(data)
    logger.info(`Created new ${context.provider} account for user`, { userId: data.userId })
  } catch (error: any) {
    if (error?.code === '23505') {
      logger.error(`Duplicate ${context.provider} account detected, credential already exists`, {
        userId: data.userId,
        identifier: context.identifier,
      })
    } else {
      throw error
    }
  }
}

/**
 * Get the user ID based on either a session or a workflow ID
 */
export async function getUserId(
  requestId: string,
  workflowId?: string
): Promise<string | undefined> {
  // If workflowId is provided, this is a server-side request
  if (workflowId) {
    // Get the workflow to verify the user ID
    const workflows = await db
      .select({ userId: workflow.userId })
      .from(workflow)
      .where(eq(workflow.id, workflowId))
      .limit(1)

    if (!workflows.length) {
      logger.warn(`[${requestId}] Workflow not found`)
      return undefined
    }

    return workflows[0].userId
  }
  // This is a client-side request, use the session
  const session = await getSession()

  // Check if the user is authenticated
  if (!session?.user?.id) {
    logger.warn(`[${requestId}] Unauthenticated request rejected`)
    return undefined
  }

  return session.user.id
}

/**
 * Get a credential by ID and verify it belongs to the user
 */
export async function getCredential(requestId: string, credentialId: string, userId: string) {
  const credentials = await db
    .select()
    .from(account)
    .where(and(eq(account.id, credentialId), eq(account.userId, userId)))
    .limit(1)

  if (!credentials.length) {
    logger.warn(`[${requestId}] Credential not found`)
    return undefined
  }

  return credentials[0]
}

export async function getOAuthToken(userId: string, providerId: string): Promise<string | null> {
  const connections = await db
    .select({
      id: account.id,
      accessToken: account.accessToken,
      refreshToken: account.refreshToken,
      accessTokenExpiresAt: account.accessTokenExpiresAt,
      idToken: account.idToken,
    })
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, providerId)))
    // Always use the most recently updated credential for this provider
    .orderBy(desc(account.updatedAt))
    .limit(1)

  if (connections.length === 0) {
    logger.warn(`No OAuth token found for user ${userId}, provider ${providerId}`)
    return null
  }

  const credential = connections[0]

  // Determine whether we should refresh: missing token OR expired token
  const now = new Date()
  const tokenExpiry = credential.accessTokenExpiresAt
  const shouldAttemptRefresh =
    !!credential.refreshToken && (!credential.accessToken || (tokenExpiry && tokenExpiry < now))

  if (shouldAttemptRefresh) {
    logger.info(
      `Access token expired for user ${userId}, provider ${providerId}. Attempting to refresh.`
    )

    try {
      // Use the existing refreshOAuthToken function
      const refreshResult = await refreshOAuthToken(providerId, credential.refreshToken!)

      if (!refreshResult) {
        logger.error(`Failed to refresh token for user ${userId}, provider ${providerId}`, {
          providerId,
          userId,
          hasRefreshToken: !!credential.refreshToken,
        })
        return null
      }

      const { accessToken, expiresIn, refreshToken: newRefreshToken } = refreshResult

      // Update the database with new tokens
      const updateData: any = {
        accessToken,
        accessTokenExpiresAt: new Date(Date.now() + expiresIn * 1000), // Convert seconds to milliseconds
        updatedAt: new Date(),
      }

      // If we received a new refresh token (some providers like Airtable rotate them), save it
      if (newRefreshToken && newRefreshToken !== credential.refreshToken) {
        logger.info(`Updating refresh token for user ${userId}, provider ${providerId}`)
        updateData.refreshToken = newRefreshToken
      }

      // Update the token in the database with the actual expiration time from the provider
      await db.update(account).set(updateData).where(eq(account.id, credential.id))

      logger.info(`Successfully refreshed token for user ${userId}, provider ${providerId}`)
      return accessToken
    } catch (error) {
      logger.error(`Error refreshing token for user ${userId}, provider ${providerId}`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        providerId,
        userId,
      })
      return null
    }
  }

  if (!credential.accessToken) {
    logger.warn(
      `Access token is null and no refresh attempted or available for user ${userId}, provider ${providerId}`
    )
    return null
  }

  logger.info(`Found valid OAuth token for user ${userId}, provider ${providerId}`)
  return credential.accessToken
}

/**
 * Refreshes an OAuth token if needed based on credential information
 * @param credentialId The ID of the credential to check and potentially refresh
 * @param userId The user ID who owns the credential (for security verification)
 * @param requestId Request ID for log correlation
 * @returns The valid access token or null if refresh fails
 */
export async function refreshAccessTokenIfNeeded(
  credentialId: string,
  userId: string,
  requestId: string
): Promise<string | null> {
  // Get the credential directly using the getCredential helper
  const credential = await getCredential(requestId, credentialId, userId)

  if (!credential) {
    return null
  }

  // Decide if we should refresh: token missing OR expired
  const expiresAt = credential.accessTokenExpiresAt
  const now = new Date()
  const shouldRefresh =
    !!credential.refreshToken && (!credential.accessToken || (expiresAt && expiresAt <= now))

  const accessToken = credential.accessToken

  if (shouldRefresh) {
    logger.info(`[${requestId}] Token expired, attempting to refresh for credential`)
    try {
      const refreshedToken = await refreshOAuthToken(
        credential.providerId,
        credential.refreshToken!
      )

      if (!refreshedToken) {
        logger.error(`[${requestId}] Failed to refresh token for credential: ${credentialId}`, {
          credentialId,
          providerId: credential.providerId,
          userId: credential.userId,
          hasRefreshToken: !!credential.refreshToken,
        })
        return null
      }

      // Prepare update data
      const updateData: any = {
        accessToken: refreshedToken.accessToken,
        accessTokenExpiresAt: new Date(Date.now() + refreshedToken.expiresIn * 1000),
        updatedAt: new Date(),
      }

      // If we received a new refresh token, update it
      if (refreshedToken.refreshToken && refreshedToken.refreshToken !== credential.refreshToken) {
        logger.info(`[${requestId}] Updating refresh token for credential`)
        updateData.refreshToken = refreshedToken.refreshToken
      }

      // Update the token in the database
      await db.update(account).set(updateData).where(eq(account.id, credentialId))

      logger.info(`[${requestId}] Successfully refreshed access token for credential`)
      return refreshedToken.accessToken
    } catch (error) {
      logger.error(`[${requestId}] Error refreshing token for credential`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        providerId: credential.providerId,
        credentialId,
        userId: credential.userId,
      })
      return null
    }
  } else if (!accessToken) {
    // We have no access token and either no refresh token or not eligible to refresh
    logger.error(`[${requestId}] Missing access token for credential`)
    return null
  }

  logger.info(`[${requestId}] Access token is valid for credential`)
  return accessToken
}

/**
 * Enhanced version that returns additional information about the refresh operation
 */
export async function refreshTokenIfNeeded(
  requestId: string,
  credential: any,
  credentialId: string
): Promise<{ accessToken: string; refreshed: boolean }> {
  // Decide if we should refresh: token missing OR expired
  const expiresAt = credential.accessTokenExpiresAt
  const now = new Date()
  const shouldRefresh =
    !!credential.refreshToken && (!credential.accessToken || (expiresAt && expiresAt <= now))

  // If token appears valid and present, return it directly
  if (!shouldRefresh) {
    logger.info(`[${requestId}] Access token is valid`)
    return { accessToken: credential.accessToken, refreshed: false }
  }

  try {
    const refreshResult = await refreshOAuthToken(credential.providerId, credential.refreshToken!)

    if (!refreshResult) {
      logger.error(`[${requestId}] Failed to refresh token for credential`)
      throw new Error('Failed to refresh token')
    }

    const { accessToken: refreshedToken, expiresIn, refreshToken: newRefreshToken } = refreshResult

    // Prepare update data
    const updateData: any = {
      accessToken: refreshedToken,
      accessTokenExpiresAt: new Date(Date.now() + expiresIn * 1000), // Use provider's expiry
      updatedAt: new Date(),
    }

    // If we received a new refresh token, update it
    if (newRefreshToken && newRefreshToken !== credential.refreshToken) {
      logger.info(`[${requestId}] Updating refresh token`)
      updateData.refreshToken = newRefreshToken
    }

    await db.update(account).set(updateData).where(eq(account.id, credentialId))

    logger.info(`[${requestId}] Successfully refreshed access token`)
    return { accessToken: refreshedToken, refreshed: true }
  } catch (error) {
    logger.warn(
      `[${requestId}] Refresh attempt failed, checking if another concurrent request succeeded`
    )

    const freshCredential = await getCredential(requestId, credentialId, credential.userId)
    if (freshCredential?.accessToken) {
      const freshExpiresAt = freshCredential.accessTokenExpiresAt
      const stillValid = !freshExpiresAt || freshExpiresAt > new Date()

      if (stillValid) {
        logger.info(`[${requestId}] Found valid token from concurrent refresh, using it`)
        return { accessToken: freshCredential.accessToken, refreshed: true }
      }
    }

    logger.error(`[${requestId}] Refresh failed and no valid token found in DB`, error)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.test.ts]---
Location: sim-main/apps/sim/app/api/auth/oauth/connections/route.test.ts

```typescript
/**
 * Tests for OAuth connections API route
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockRequest } from '@/app/api/__test-utils__/utils'

describe('OAuth Connections API Route', () => {
  const mockGetSession = vi.fn()
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
  const mockParseProvider = vi.fn()
  const mockEvaluateScopeCoverage = vi.fn()

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
      account: { userId: 'userId', providerId: 'providerId' },
      user: { email: 'email', id: 'id' },
      eq: vi.fn((field, value) => ({ field, value, type: 'eq' })),
    }))

    vi.doMock('drizzle-orm', () => ({
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
      featureType: providerId.split('-')[1] || 'default',
    }))

    mockEvaluateScopeCoverage.mockImplementation(
      (_providerId: string, _grantedScopes: string[]) => ({
        canonicalScopes: ['email', 'profile'],
        grantedScopes: ['email', 'profile'],
        missingScopes: [],
        extraScopes: [],
        requiresReauthorization: false,
      })
    )

    vi.doMock('@/lib/oauth/oauth', () => ({
      parseProvider: mockParseProvider,
      evaluateScopeCoverage: mockEvaluateScopeCoverage,
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return connections successfully', async () => {
    mockGetSession.mockResolvedValueOnce({
      user: { id: 'user-123' },
    })

    const mockAccounts = [
      {
        id: 'account-1',
        providerId: 'google-email',
        accountId: 'test@example.com',
        scope: 'email profile',
        updatedAt: new Date('2024-01-01'),
        idToken: null,
      },
      {
        id: 'account-2',
        providerId: 'github',
        accountId: 'testuser',
        scope: 'repo',
        updatedAt: new Date('2024-01-02'),
        idToken: null,
      },
    ]

    const mockUserRecord = [{ email: 'user@example.com' }]

    mockDb.select.mockReturnValueOnce(mockDb)
    mockDb.from.mockReturnValueOnce(mockDb)
    mockDb.where.mockResolvedValueOnce(mockAccounts)

    mockDb.select.mockReturnValueOnce(mockDb)
    mockDb.from.mockReturnValueOnce(mockDb)
    mockDb.where.mockReturnValueOnce(mockDb)
    mockDb.limit.mockResolvedValueOnce(mockUserRecord)

    const req = createMockRequest('GET')
    const { GET } = await import('@/app/api/auth/oauth/connections/route')

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.connections).toHaveLength(2)
    expect(data.connections[0]).toMatchObject({
      provider: 'google-email',
      baseProvider: 'google',
      featureType: 'email',
      isConnected: true,
    })
    expect(data.connections[1]).toMatchObject({
      provider: 'github',
      baseProvider: 'github',
      featureType: 'default',
      isConnected: true,
    })
  })

  it('should handle unauthenticated user', async () => {
    mockGetSession.mockResolvedValueOnce(null)

    const req = createMockRequest('GET')
    const { GET } = await import('@/app/api/auth/oauth/connections/route')

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('User not authenticated')
    expect(mockLogger.warn).toHaveBeenCalled()
  })

  it('should handle user with no connections', async () => {
    mockGetSession.mockResolvedValueOnce({
      user: { id: 'user-123' },
    })

    mockDb.select.mockReturnValueOnce(mockDb)
    mockDb.from.mockReturnValueOnce(mockDb)
    mockDb.where.mockResolvedValueOnce([])

    mockDb.select.mockReturnValueOnce(mockDb)
    mockDb.from.mockReturnValueOnce(mockDb)
    mockDb.where.mockReturnValueOnce(mockDb)
    mockDb.limit.mockResolvedValueOnce([])

    const req = createMockRequest('GET')
    const { GET } = await import('@/app/api/auth/oauth/connections/route')

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.connections).toHaveLength(0)
  })

  it('should handle database error', async () => {
    mockGetSession.mockResolvedValueOnce({
      user: { id: 'user-123' },
    })

    mockDb.select.mockReturnValueOnce(mockDb)
    mockDb.from.mockReturnValueOnce(mockDb)
    mockDb.where.mockRejectedValueOnce(new Error('Database error'))

    const req = createMockRequest('GET')
    const { GET } = await import('@/app/api/auth/oauth/connections/route')

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Internal server error')
    expect(mockLogger.error).toHaveBeenCalled()
  })

  it('should decode ID token for display name', async () => {
    const { jwtDecode } = await import('jwt-decode')
    const mockJwtDecode = jwtDecode as any

    mockGetSession.mockResolvedValueOnce({
      user: { id: 'user-123' },
    })

    const mockAccounts = [
      {
        id: 'account-1',
        providerId: 'google',
        accountId: 'google-user-id',
        scope: 'email profile',
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

    mockDb.select.mockReturnValueOnce(mockDb)
    mockDb.from.mockReturnValueOnce(mockDb)
    mockDb.where.mockReturnValueOnce(mockDb)
    mockDb.limit.mockResolvedValueOnce([])

    const req = createMockRequest('GET')
    const { GET } = await import('@/app/api/auth/oauth/connections/route')

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.connections[0].accounts[0].name).toBe('decoded@example.com')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/auth/oauth/connections/route.ts
Signals: Next.js

```typescript
import { account, db, user } from '@sim/db'
import { eq } from 'drizzle-orm'
import { jwtDecode } from 'jwt-decode'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import type { OAuthProvider } from '@/lib/oauth/oauth'
import { evaluateScopeCoverage, parseProvider } from '@/lib/oauth/oauth'

const logger = createLogger('OAuthConnectionsAPI')

interface GoogleIdToken {
  email?: string
  sub?: string
  name?: string
}

/**
 * Get all OAuth connections for the current user
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

    // Get all accounts for this user
    const accounts = await db.select().from(account).where(eq(account.userId, session.user.id))

    // Get the user's email for fallback
    const userRecord = await db
      .select({ email: user.email })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1)

    const userEmail = userRecord.length > 0 ? userRecord[0]?.email : null

    // Process accounts to determine connections
    const connections: any[] = []

    for (const acc of accounts) {
      const { baseProvider, featureType } = parseProvider(acc.providerId as OAuthProvider)
      const grantedScopes = acc.scope ? acc.scope.split(/\s+/).filter(Boolean) : []
      const scopeEvaluation = evaluateScopeCoverage(acc.providerId, grantedScopes)

      if (baseProvider) {
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

        // Method 3: Use the user's email from our database
        if (!displayName && userEmail) {
          displayName = userEmail
        }

        // Fallback: Use accountId with provider type as context
        if (!displayName) {
          displayName = `${acc.accountId} (${baseProvider})`
        }

        // Create a unique connection key that includes the full provider ID
        const connectionKey = acc.providerId

        // Find existing connection for this specific provider ID
        const existingConnection = connections.find((conn) => conn.provider === connectionKey)

        const accountSummary = {
          id: acc.id,
          name: displayName,
          scopes: scopeEvaluation.grantedScopes,
          missingScopes: scopeEvaluation.missingScopes,
          extraScopes: scopeEvaluation.extraScopes,
          requiresReauthorization: scopeEvaluation.requiresReauthorization,
        }

        if (existingConnection) {
          // Add account to existing connection
          existingConnection.accounts = existingConnection.accounts || []
          existingConnection.accounts.push(accountSummary)

          existingConnection.scopes = Array.from(
            new Set([...(existingConnection.scopes || []), ...scopeEvaluation.grantedScopes])
          )
          existingConnection.missingScopes = Array.from(
            new Set([...(existingConnection.missingScopes || []), ...scopeEvaluation.missingScopes])
          )
          existingConnection.extraScopes = Array.from(
            new Set([...(existingConnection.extraScopes || []), ...scopeEvaluation.extraScopes])
          )
          existingConnection.canonicalScopes =
            existingConnection.canonicalScopes && existingConnection.canonicalScopes.length > 0
              ? existingConnection.canonicalScopes
              : scopeEvaluation.canonicalScopes
          existingConnection.requiresReauthorization =
            existingConnection.requiresReauthorization || scopeEvaluation.requiresReauthorization

          const existingTimestamp = existingConnection.lastConnected
            ? new Date(existingConnection.lastConnected).getTime()
            : 0
          const candidateTimestamp = acc.updatedAt.getTime()

          if (candidateTimestamp > existingTimestamp) {
            existingConnection.lastConnected = acc.updatedAt.toISOString()
          }
        } else {
          // Create new connection
          connections.push({
            provider: connectionKey,
            baseProvider,
            featureType,
            isConnected: true,
            scopes: scopeEvaluation.grantedScopes,
            canonicalScopes: scopeEvaluation.canonicalScopes,
            missingScopes: scopeEvaluation.missingScopes,
            extraScopes: scopeEvaluation.extraScopes,
            requiresReauthorization: scopeEvaluation.requiresReauthorization,
            lastConnected: acc.updatedAt.toISOString(),
            accounts: [accountSummary],
          })
        }
      }
    }

    return NextResponse.json({ connections }, { status: 200 })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching OAuth connections`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

````
