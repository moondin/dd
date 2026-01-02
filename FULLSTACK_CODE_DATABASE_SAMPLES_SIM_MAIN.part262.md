---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 262
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 262 of 933)

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
Location: sim-main/apps/sim/app/api/auth/reset-password/route.test.ts

```typescript
/**
 * Tests for reset password API route
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockRequest, setupAuthApiMocks } from '@/app/api/__test-utils__/utils'

describe('Reset Password API Route', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should reset password successfully', async () => {
    setupAuthApiMocks({
      operations: {
        resetPassword: { success: true },
      },
    })

    const req = createMockRequest('POST', {
      token: 'valid-reset-token',
      newPassword: 'newSecurePassword123!',
    })

    const { POST } = await import('@/app/api/auth/reset-password/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)

    const auth = await import('@/lib/auth')
    expect(auth.auth.api.resetPassword).toHaveBeenCalledWith({
      body: {
        token: 'valid-reset-token',
        newPassword: 'newSecurePassword123!',
      },
      method: 'POST',
    })
  })

  it('should handle missing token', async () => {
    setupAuthApiMocks()

    const req = createMockRequest('POST', {
      newPassword: 'newSecurePassword123',
    })

    const { POST } = await import('@/app/api/auth/reset-password/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toBe('Token is required')

    const auth = await import('@/lib/auth')
    expect(auth.auth.api.resetPassword).not.toHaveBeenCalled()
  })

  it('should handle missing new password', async () => {
    setupAuthApiMocks()

    const req = createMockRequest('POST', {
      token: 'valid-reset-token',
    })

    const { POST } = await import('./route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toBe('Password is required')

    const auth = await import('@/lib/auth')
    expect(auth.auth.api.resetPassword).not.toHaveBeenCalled()
  })

  it('should handle empty token', async () => {
    setupAuthApiMocks()

    const req = createMockRequest('POST', {
      token: '',
      newPassword: 'newSecurePassword123',
    })

    const { POST } = await import('@/app/api/auth/reset-password/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toBe('Token is required')

    const auth = await import('@/lib/auth')
    expect(auth.auth.api.resetPassword).not.toHaveBeenCalled()
  })

  it('should handle empty new password', async () => {
    setupAuthApiMocks()

    const req = createMockRequest('POST', {
      token: 'valid-reset-token',
      newPassword: '',
    })

    const { POST } = await import('@/app/api/auth/reset-password/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.message).toBe('Password must be at least 8 characters long')

    const auth = await import('@/lib/auth')
    expect(auth.auth.api.resetPassword).not.toHaveBeenCalled()
  })

  it('should handle auth service error with message', async () => {
    const errorMessage = 'Invalid or expired token'

    setupAuthApiMocks({
      operations: {
        resetPassword: {
          success: false,
          error: errorMessage,
        },
      },
    })

    const req = createMockRequest('POST', {
      token: 'invalid-token',
      newPassword: 'newSecurePassword123!',
    })

    const { POST } = await import('@/app/api/auth/reset-password/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.message).toBe(errorMessage)

    const logger = await import('@/lib/logs/console/logger')
    const mockLogger = logger.createLogger('PasswordResetAPI')
    expect(mockLogger.error).toHaveBeenCalledWith('Error during password reset:', {
      error: expect.any(Error),
    })
  })

  it('should handle unknown error', async () => {
    setupAuthApiMocks()

    vi.doMock('@/lib/auth', () => ({
      auth: {
        api: {
          resetPassword: vi.fn().mockRejectedValue('Unknown error'),
        },
      },
    }))

    const req = createMockRequest('POST', {
      token: 'valid-reset-token',
      newPassword: 'newSecurePassword123!',
    })

    const { POST } = await import('@/app/api/auth/reset-password/route')

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.message).toBe(
      'Failed to reset password. Please try again or request a new reset link.'
    )

    const logger = await import('@/lib/logs/console/logger')
    const mockLogger = logger.createLogger('PasswordResetAPI')
    expect(mockLogger.error).toHaveBeenCalled()
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/auth/reset-password/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('PasswordResetAPI')

const resetPasswordSchema = z.object({
  token: z.string({ required_error: 'Token is required' }).min(1, 'Token is required'),
  newPassword: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password must not exceed 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationResult = resetPasswordSchema.safeParse(body)

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]
      const errorMessage = firstError?.message || 'Invalid request data'

      logger.warn('Invalid password reset request data', {
        errors: validationResult.error.format(),
      })
      return NextResponse.json({ message: errorMessage }, { status: 400 })
    }

    const { token, newPassword } = validationResult.data

    await auth.api.resetPassword({
      body: {
        newPassword,
        token,
      },
      method: 'POST',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error during password reset:', { error })

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to reset password. Please try again or request a new reset link.',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/auth/shopify/authorize/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { env } from '@/lib/core/config/env'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('ShopifyAuthorize')

export const dynamic = 'force-dynamic'

const SHOPIFY_SCOPES = [
  'write_products',
  'write_orders',
  'write_customers',
  'write_inventory',
  'read_locations',
  'write_merchant_managed_fulfillment_orders',
].join(',')

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clientId = env.SHOPIFY_CLIENT_ID

    if (!clientId) {
      logger.error('SHOPIFY_CLIENT_ID not configured')
      return NextResponse.json({ error: 'Shopify client ID not configured' }, { status: 500 })
    }

    const shopDomain = request.nextUrl.searchParams.get('shop')
    const returnUrl = request.nextUrl.searchParams.get('returnUrl')

    if (!shopDomain) {
      const returnUrlParam = returnUrl ? encodeURIComponent(returnUrl) : ''
      return new NextResponse(
        `<!DOCTYPE html>
<html>
  <head>
    <title>Connect Shopify Store</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
        background: linear-gradient(135deg, #96BF48 0%, #5C8A23 100%);
      }
      .container {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        text-align: center;
        max-width: 400px;
        width: 90%;
      }
      h2 {
        color: #111827;
        margin: 0 0 0.5rem 0;
      }
      p {
        color: #6b7280;
        margin: 0 0 1.5rem 0;
      }
      input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 1rem;
        margin-bottom: 1rem;
        box-sizing: border-box;
      }
      input:focus {
        outline: none;
        border-color: #96BF48;
        box-shadow: 0 0 0 3px rgba(150, 191, 72, 0.2);
      }
      button {
        width: 100%;
        padding: 0.75rem;
        background: #96BF48;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        font-weight: 500;
      }
      button:hover {
        background: #7FA93D;
      }
      .help {
        font-size: 0.875rem;
        color: #9ca3af;
        margin-top: 1rem;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Connect Your Shopify Store</h2>
      <p>Enter your Shopify store domain to continue</p>
      <form onsubmit="handleSubmit(event)">
        <input
          type="text"
          id="shop"
          placeholder="mystore.myshopify.com"
          required
          pattern="[a-zA-Z0-9-]+\\.myshopify\\.com"
        />
        <button type="submit">Connect Store</button>
      </form>
      <p class="help">Your store domain looks like: yourstore.myshopify.com</p>
    </div>

    <script>
      const returnUrl = '${returnUrlParam}';
      function handleSubmit(e) {
        e.preventDefault();
        let shop = document.getElementById('shop').value.trim().toLowerCase();

        // Clean up the shop domain
        shop = shop.replace('https://', '').replace('http://', '');
        if (!shop.endsWith('.myshopify.com')) {
          shop = shop.replace('.myshopify.com', '') + '.myshopify.com';
        }

        let url = window.location.pathname + '?shop=' + encodeURIComponent(shop);
        if (returnUrl) {
          url += '&returnUrl=' + returnUrl;
        }
        window.location.href = url;
      }
    </script>
  </body>
</html>`,
        {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        }
      )
    }

    let cleanShop = shopDomain.toLowerCase().trim()
    cleanShop = cleanShop.replace('https://', '').replace('http://', '')
    if (!cleanShop.endsWith('.myshopify.com')) {
      cleanShop = `${cleanShop.replace('.myshopify.com', '')}.myshopify.com`
    }

    const baseUrl = getBaseUrl()
    const redirectUri = `${baseUrl}/api/auth/oauth2/callback/shopify`

    const state = crypto.randomUUID()

    const oauthUrl =
      `https://${cleanShop}/admin/oauth/authorize?` +
      new URLSearchParams({
        client_id: clientId,
        scope: SHOPIFY_SCOPES,
        redirect_uri: redirectUri,
        state: state,
      }).toString()

    logger.info('Initiating Shopify OAuth:', {
      shop: cleanShop,
      requestedScopes: SHOPIFY_SCOPES,
      redirectUri,
      returnUrl: returnUrl || 'not specified',
    })

    const response = NextResponse.redirect(oauthUrl)

    response.cookies.set('shopify_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10,
      path: '/',
    })

    response.cookies.set('shopify_shop_domain', cleanShop, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10,
      path: '/',
    })

    if (returnUrl) {
      response.cookies.set('shopify_return_url', returnUrl, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 10,
        path: '/',
      })
    }

    return response
  } catch (error) {
    logger.error('Error initiating Shopify authorization:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/auth/socket-token/route.ts
Signals: Next.js

```typescript
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAuthDisabled } from '@/lib/core/config/feature-flags'

export async function POST() {
  try {
    if (isAuthDisabled) {
      return NextResponse.json({ token: 'anonymous-socket-token' })
    }

    const hdrs = await headers()
    const response = await auth.api.generateOneTimeToken({
      headers: hdrs,
    })

    if (!response) {
      return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 })
    }

    return NextResponse.json({ token: response.token })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/auth/sso/providers/route.ts
Signals: Next.js

```typescript
import { db, ssoProvider } from '@sim/db'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('SSO-Providers')

export async function GET() {
  try {
    const session = await getSession()

    let providers
    if (session?.user?.id) {
      const results = await db
        .select({
          id: ssoProvider.id,
          providerId: ssoProvider.providerId,
          domain: ssoProvider.domain,
          issuer: ssoProvider.issuer,
          oidcConfig: ssoProvider.oidcConfig,
          samlConfig: ssoProvider.samlConfig,
          userId: ssoProvider.userId,
          organizationId: ssoProvider.organizationId,
        })
        .from(ssoProvider)
        .where(eq(ssoProvider.userId, session.user.id))

      providers = results.map((provider) => ({
        ...provider,
        providerType:
          provider.oidcConfig && provider.samlConfig
            ? 'oidc'
            : provider.oidcConfig
              ? 'oidc'
              : provider.samlConfig
                ? 'saml'
                : ('oidc' as 'oidc' | 'saml'),
      }))
    } else {
      const results = await db
        .select({
          domain: ssoProvider.domain,
        })
        .from(ssoProvider)

      providers = results.map((provider) => ({
        domain: provider.domain,
      }))
    }

    logger.info('Fetched SSO providers', {
      userId: session?.user?.id,
      authenticated: !!session?.user?.id,
      providerCount: providers.length,
    })

    return NextResponse.json({ providers })
  } catch (error) {
    logger.error('Failed to fetch SSO providers', { error })
    return NextResponse.json({ error: 'Failed to fetch SSO providers' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/auth/sso/register/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('SSO-Register')

const mappingSchema = z
  .object({
    id: z.string().default('sub'),
    email: z.string().default('email'),
    name: z.string().default('name'),
    image: z.string().default('picture'),
  })
  .default({
    id: 'sub',
    email: 'email',
    name: 'name',
    image: 'picture',
  })

const ssoRegistrationSchema = z.discriminatedUnion('providerType', [
  z.object({
    providerType: z.literal('oidc').default('oidc'),
    providerId: z.string().min(1, 'Provider ID is required'),
    issuer: z.string().url('Issuer must be a valid URL'),
    domain: z.string().min(1, 'Domain is required'),
    mapping: mappingSchema,
    clientId: z.string().min(1, 'Client ID is required for OIDC'),
    clientSecret: z.string().min(1, 'Client Secret is required for OIDC'),
    scopes: z
      .union([
        z.string().transform((s) =>
          s
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s !== '')
        ),
        z.array(z.string()),
      ])
      .default(['openid', 'profile', 'email']),
    pkce: z.boolean().default(true),
  }),
  z.object({
    providerType: z.literal('saml'),
    providerId: z.string().min(1, 'Provider ID is required'),
    issuer: z.string().url('Issuer must be a valid URL'),
    domain: z.string().min(1, 'Domain is required'),
    mapping: mappingSchema,
    entryPoint: z.string().url('Entry point must be a valid URL for SAML'),
    cert: z.string().min(1, 'Certificate is required for SAML'),
    callbackUrl: z.string().url().optional(),
    audience: z.string().optional(),
    wantAssertionsSigned: z.boolean().optional(),
    signatureAlgorithm: z.string().optional(),
    digestAlgorithm: z.string().optional(),
    identifierFormat: z.string().optional(),
    idpMetadata: z.string().optional(),
  }),
])

export async function POST(request: NextRequest) {
  try {
    if (!env.SSO_ENABLED) {
      return NextResponse.json({ error: 'SSO is not enabled' }, { status: 400 })
    }

    const rawBody = await request.json()

    const parseResult = ssoRegistrationSchema.safeParse(rawBody)

    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]
      const errorMessage = firstError?.message || 'Validation failed'

      logger.warn('Invalid SSO registration request', {
        errors: parseResult.error.errors,
      })

      return NextResponse.json(
        {
          error: errorMessage,
        },
        { status: 400 }
      )
    }

    const body = parseResult.data
    const { providerId, issuer, domain, providerType, mapping } = body

    const headers: Record<string, string> = {}
    request.headers.forEach((value, key) => {
      headers[key] = value
    })

    const providerConfig: any = {
      providerId,
      issuer,
      domain,
      mapping,
    }

    if (providerType === 'oidc') {
      const { clientId, clientSecret, scopes, pkce } = body

      const oidcConfig: any = {
        clientId,
        clientSecret,
        scopes: Array.isArray(scopes)
          ? scopes.filter((s: string) => s !== 'offline_access')
          : ['openid', 'profile', 'email'].filter((s: string) => s !== 'offline_access'),
        pkce: pkce ?? true,
      }

      // Add manual endpoints for providers that might need them
      // Common patterns for OIDC providers that don't support discovery properly
      if (
        issuer.includes('okta.com') ||
        issuer.includes('auth0.com') ||
        issuer.includes('identityserver')
      ) {
        const baseUrl = issuer.includes('/oauth2/default')
          ? issuer.replace('/oauth2/default', '')
          : issuer.replace('/oauth', '').replace('/v2.0', '').replace('/oauth2', '')

        // Okta-style endpoints
        if (issuer.includes('okta.com')) {
          oidcConfig.authorizationEndpoint = `${baseUrl}/oauth2/default/v1/authorize`
          oidcConfig.tokenEndpoint = `${baseUrl}/oauth2/default/v1/token`
          oidcConfig.userInfoEndpoint = `${baseUrl}/oauth2/default/v1/userinfo`
          oidcConfig.jwksEndpoint = `${baseUrl}/oauth2/default/v1/keys`
        }
        // Auth0-style endpoints
        else if (issuer.includes('auth0.com')) {
          oidcConfig.authorizationEndpoint = `${baseUrl}/authorize`
          oidcConfig.tokenEndpoint = `${baseUrl}/oauth/token`
          oidcConfig.userInfoEndpoint = `${baseUrl}/userinfo`
          oidcConfig.jwksEndpoint = `${baseUrl}/.well-known/jwks.json`
        }
        // Generic OIDC endpoints (IdentityServer, etc.)
        else {
          oidcConfig.authorizationEndpoint = `${baseUrl}/connect/authorize`
          oidcConfig.tokenEndpoint = `${baseUrl}/connect/token`
          oidcConfig.userInfoEndpoint = `${baseUrl}/connect/userinfo`
          oidcConfig.jwksEndpoint = `${baseUrl}/.well-known/jwks`
        }

        logger.info('Using manual OIDC endpoints for provider', {
          providerId,
          provider: issuer.includes('okta.com')
            ? 'Okta'
            : issuer.includes('auth0.com')
              ? 'Auth0'
              : 'Generic',
          authEndpoint: oidcConfig.authorizationEndpoint,
        })
      }

      providerConfig.oidcConfig = oidcConfig
    } else if (providerType === 'saml') {
      const {
        entryPoint,
        cert,
        callbackUrl,
        audience,
        wantAssertionsSigned,
        signatureAlgorithm,
        digestAlgorithm,
        identifierFormat,
        idpMetadata,
      } = body

      const computedCallbackUrl =
        callbackUrl || `${issuer.replace('/metadata', '')}/callback/${providerId}`

      const escapeXml = (str: string) =>
        str.replace(/[<>&"']/g, (c) => {
          switch (c) {
            case '<':
              return '&lt;'
            case '>':
              return '&gt;'
            case '&':
              return '&amp;'
            case '"':
              return '&quot;'
            case "'":
              return '&apos;'
            default:
              return c
          }
        })

      const spMetadataXml = `<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="${escapeXml(issuer)}">
  <md:SPSSODescriptor AuthnRequestsSigned="false" WantAssertionsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="${escapeXml(computedCallbackUrl)}" index="1"/>
  </md:SPSSODescriptor>
</md:EntityDescriptor>`

      const samlConfig: any = {
        entryPoint,
        cert,
        callbackUrl: computedCallbackUrl,
        spMetadata: {
          metadata: spMetadataXml,
        },
        mapping,
      }

      if (audience) samlConfig.audience = audience
      if (wantAssertionsSigned !== undefined) samlConfig.wantAssertionsSigned = wantAssertionsSigned
      if (signatureAlgorithm) samlConfig.signatureAlgorithm = signatureAlgorithm
      if (digestAlgorithm) samlConfig.digestAlgorithm = digestAlgorithm
      if (identifierFormat) samlConfig.identifierFormat = identifierFormat
      if (idpMetadata) {
        samlConfig.idpMetadata = {
          metadata: idpMetadata,
        }
      }

      providerConfig.samlConfig = samlConfig
      providerConfig.mapping = undefined
    }

    logger.info('Calling Better Auth registerSSOProvider with config:', {
      providerId: providerConfig.providerId,
      domain: providerConfig.domain,
      hasOidcConfig: !!providerConfig.oidcConfig,
      hasSamlConfig: !!providerConfig.samlConfig,
      samlConfigKeys: providerConfig.samlConfig ? Object.keys(providerConfig.samlConfig) : [],
      fullConfig: JSON.stringify(
        {
          ...providerConfig,
          oidcConfig: providerConfig.oidcConfig
            ? {
                ...providerConfig.oidcConfig,
                clientSecret: '[REDACTED]',
              }
            : undefined,
          samlConfig: providerConfig.samlConfig
            ? {
                ...providerConfig.samlConfig,
                cert: '[REDACTED]',
              }
            : undefined,
        },
        null,
        2
      ),
    })

    const registration = await auth.api.registerSSOProvider({
      body: providerConfig,
      headers,
    })

    logger.info('SSO provider registered successfully', {
      providerId,
      providerType,
      domain,
    })

    return NextResponse.json({
      success: true,
      providerId: registration.providerId,
      providerType,
      message: `${providerType.toUpperCase()} provider registered successfully`,
    })
  } catch (error) {
    logger.error('Failed to register SSO provider', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
      errorDetails: JSON.stringify(error),
    })

    return NextResponse.json(
      {
        error: 'Failed to register SSO provider',
        details: error instanceof Error ? error.message : 'Unknown error',
        fullError: JSON.stringify(error),
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/auth/trello/authorize/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { env } from '@/lib/core/config/env'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('TrelloAuthorize')

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const apiKey = env.TRELLO_API_KEY

    if (!apiKey) {
      logger.error('TRELLO_API_KEY not configured')
      return NextResponse.json({ error: 'Trello API key not configured' }, { status: 500 })
    }

    const baseUrl = getBaseUrl()
    const returnUrl = `${baseUrl}/api/auth/trello/callback`

    const authUrl = new URL('https://trello.com/1/authorize')
    authUrl.searchParams.set('key', apiKey)
    authUrl.searchParams.set('name', 'Sim Studio')
    authUrl.searchParams.set('expiration', 'never')
    authUrl.searchParams.set('response_type', 'token')
    authUrl.searchParams.set('scope', 'read,write')
    authUrl.searchParams.set('return_url', returnUrl)

    return NextResponse.redirect(authUrl.toString())
  } catch (error) {
    logger.error('Error initiating Trello authorization:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/auth/trello/callback/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { getBaseUrl } from '@/lib/core/utils/urls'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const baseUrl = getBaseUrl()

  return new NextResponse(
    `<!DOCTYPE html>
<html>
  <head>
    <title>Connecting to Trello...</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
        background: linear-gradient(135deg, #0052CC 0%, #0079BF 100%);
      }
      .container {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        text-align: center;
        max-width: 400px;
      }
      .spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #0052CC;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .error {
        color: #ef4444;
        margin-top: 1rem;
      }
      h2 {
        color: #111827;
        margin: 0 0 0.5rem 0;
      }
      p {
        color: #6b7280;
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="spinner"></div>
      <h2>Connecting to Trello</h2>
      <p id="status">Processing authorization...</p>
      <p id="error" class="error" style="display:none;"></p>
    </div>

    <script>
      (function() {
        const statusEl = document.getElementById('status');
        const errorEl = document.getElementById('error');

        try {
          const fragment = window.location.hash.substring(1);
          const params = new URLSearchParams(fragment);
          const token = params.get('token');

          if (!token) {
            throw new Error('No token received from Trello');
          }

          statusEl.textContent = 'Saving your connection...';

          fetch('${baseUrl}/api/auth/trello/store', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ token: token })
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              statusEl.textContent = 'Success! Redirecting...';
              setTimeout(function() {
                window.location.href = '${baseUrl}/workspace?trello_connected=true';
              }, 500);
            } else {
              throw new Error(data.error || 'Failed to save connection');
            }
          })
          .catch(error => {
            errorEl.textContent = error.message || 'Failed to save connection';
            errorEl.style.display = 'block';
            statusEl.textContent = 'Connection failed';
            setTimeout(function() {
              window.location.href = '${baseUrl}/workspace?error=trello_failed';
            }, 3000);
          });

        } catch (error) {
          errorEl.textContent = error.message || 'Authorization failed';
          errorEl.style.display = 'block';
          statusEl.textContent = 'Connection failed';
          setTimeout(function() {
            window.location.href = '${baseUrl}/workspace?error=trello_auth_failed';
          }, 3000);
        }
      })();
    </script>
  </body>
</html>`,
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  )
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/auth/trello/store/route.ts
Signals: Next.js

```typescript
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'
import { safeAccountInsert } from '@/app/api/auth/oauth/utils'
import { db } from '@/../../packages/db'
import { account } from '@/../../packages/db/schema'

const logger = createLogger('TrelloStore')

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn('Unauthorized attempt to store Trello token')
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token required' }, { status: 400 })
    }

    const apiKey = env.TRELLO_API_KEY
    if (!apiKey) {
      logger.error('TRELLO_API_KEY not configured')
      return NextResponse.json({ success: false, error: 'Trello not configured' }, { status: 500 })
    }

    const validationUrl = `https://api.trello.com/1/members/me?key=${apiKey}&token=${token}&fields=id,username,fullName,email`
    const userResponse = await fetch(validationUrl, {
      headers: { Accept: 'application/json' },
    })

    if (!userResponse.ok) {
      const errorText = await userResponse.text()
      logger.error('Invalid Trello token', {
        status: userResponse.status,
        error: errorText,
      })
      return NextResponse.json(
        { success: false, error: `Invalid Trello token: ${errorText}` },
        { status: 400 }
      )
    }

    const trelloUser = await userResponse.json()

    const existing = await db.query.account.findFirst({
      where: and(eq(account.userId, session.user.id), eq(account.providerId, 'trello')),
    })

    const now = new Date()

    if (existing) {
      await db
        .update(account)
        .set({
          accessToken: token,
          accountId: trelloUser.id,
          scope: 'read,write',
          updatedAt: now,
        })
        .where(eq(account.id, existing.id))
    } else {
      await safeAccountInsert(
        {
          id: `trello_${session.user.id}_${Date.now()}`,
          userId: session.user.id,
          providerId: 'trello',
          accountId: trelloUser.id,
          accessToken: token,
          scope: 'read,write',
          createdAt: now,
          updatedAt: now,
        },
        { provider: 'Trello', identifier: trelloUser.id }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error storing Trello token:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/auth/webhook/stripe/route.ts

```typescript
import { toNextJsHandler } from 'better-auth/next-js'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Handle Stripe webhooks through better-auth
export const { GET, POST } = toNextJsHandler(auth.handler)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/auth/[...all]/route.ts
Signals: Next.js

```typescript
import { toNextJsHandler } from 'better-auth/next-js'
import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createAnonymousSession, ensureAnonymousUserExists } from '@/lib/auth/anonymous'
import { isAuthDisabled } from '@/lib/core/config/feature-flags'

export const dynamic = 'force-dynamic'

const { GET: betterAuthGET, POST: betterAuthPOST } = toNextJsHandler(auth.handler)

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const path = url.pathname.replace('/api/auth/', '')

  if (path === 'get-session' && isAuthDisabled) {
    await ensureAnonymousUserExists()
    return NextResponse.json(createAnonymousSession())
  }

  return betterAuthGET(request)
}

export const POST = betterAuthPOST
```

--------------------------------------------------------------------------------

````
