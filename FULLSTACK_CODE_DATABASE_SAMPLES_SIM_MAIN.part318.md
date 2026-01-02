---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 318
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 318 of 933)

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
Location: sim-main/apps/sim/app/api/tools/wealthbox/item/route.ts
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

export async function GET(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const session = await getSession()

    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthenticated request rejected`)
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const credentialId = searchParams.get('credentialId')
    const itemId = searchParams.get('itemId')
    const type = searchParams.get('type') || 'note'

    if (!credentialId || !itemId) {
      logger.warn(`[${requestId}] Missing required parameters`, { credentialId, itemId })
      return NextResponse.json({ error: 'Credential ID and Item ID are required' }, { status: 400 })
    }

    const ALLOWED_TYPES = ['note', 'contact', 'task'] as const
    const typeValidation = validateEnum(type, ALLOWED_TYPES, 'type')
    if (!typeValidation.isValid) {
      logger.warn(`[${requestId}] Invalid item type: ${type}`)
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
      logger.warn(`[${requestId}] Invalid itemId format: ${itemId}`)
      return NextResponse.json({ error: itemIdValidation.error }, { status: 400 })
    }

    const credentialIdValidation = validatePathSegment(credentialId, {
      paramName: 'credentialId',
      maxLength: 100,
      allowHyphens: true,
      allowUnderscores: true,
      allowDots: false,
    })
    if (!credentialIdValidation.isValid) {
      logger.warn(`[${requestId}] Invalid credentialId format: ${credentialId}`)
      return NextResponse.json({ error: credentialIdValidation.error }, { status: 400 })
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
      note: 'notes',
      contact: 'contacts',
      task: 'tasks',
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

    const item = {
      id: data.id?.toString() || itemId,
      name:
        data.content || data.name || `${data.first_name} ${data.last_name}` || `${type} ${data.id}`,
      type,
      content: data.content || '',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    logger.info(`[${requestId}] Successfully fetched ${type} ${itemId} from Wealthbox`)

    return NextResponse.json({ item }, { status: 200 })
  } catch (error) {
    logger.error(`[${requestId}] Error fetching Wealthbox item`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/wealthbox/items/route.ts
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

// Interface for transformed Wealthbox items
interface WealthboxItem {
  id: string
  name: string
  type: string
  content: string
  createdAt: string
  updatedAt: string
}

/**
 * Get items (notes, contacts, tasks) from Wealthbox
 */
export async function GET(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const session = await getSession()

    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthenticated request rejected`)
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const credentialId = searchParams.get('credentialId')
    const type = searchParams.get('type') || 'contact'
    const query = searchParams.get('query') || ''

    if (!credentialId) {
      logger.warn(`[${requestId}] Missing credential ID`)
      return NextResponse.json({ error: 'Credential ID is required' }, { status: 400 })
    }

    if (type !== 'contact') {
      logger.warn(`[${requestId}] Invalid item type: ${type}`)
      return NextResponse.json(
        { error: 'Invalid item type. Only contact is supported.' },
        { status: 400 }
      )
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

    const url = new URL(`https://api.crmworkspace.com/v1/${endpoint}`)

    logger.info(`[${requestId}] Fetching ${type}s from Wealthbox`, {
      endpoint,
      url: url.toString(),
      hasQuery: !!query.trim(),
    })

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

    logger.info(`[${requestId}] Wealthbox API raw response`, {
      type,
      status: response.status,
      dataKeys: Object.keys(data || {}),
      hasContacts: !!data.contacts,
      dataStructure: typeof data === 'object' ? Object.keys(data) : 'not an object',
    })

    let items: WealthboxItem[] = []

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
Location: sim-main/apps/sim/app/api/tools/webflow/collections/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { authorizeCredentialUse } from '@/lib/auth/credential-access'
import { validateAlphanumericId } from '@/lib/core/security/input-validation'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { refreshAccessTokenIfNeeded } from '@/app/api/auth/oauth/utils'

const logger = createLogger('WebflowCollectionsAPI')

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const requestId = generateRequestId()
    const body = await request.json()
    const { credential, workflowId, siteId } = body

    if (!credential) {
      logger.error('Missing credential in request')
      return NextResponse.json({ error: 'Credential is required' }, { status: 400 })
    }

    const siteIdValidation = validateAlphanumericId(siteId, 'siteId')
    if (!siteIdValidation.isValid) {
      logger.error('Invalid siteId', { error: siteIdValidation.error })
      return NextResponse.json({ error: siteIdValidation.error }, { status: 400 })
    }

    const authz = await authorizeCredentialUse(request as any, {
      credentialId: credential,
      workflowId,
    })
    if (!authz.ok || !authz.credentialOwnerUserId) {
      return NextResponse.json({ error: authz.error || 'Unauthorized' }, { status: 403 })
    }

    const accessToken = await refreshAccessTokenIfNeeded(
      credential,
      authz.credentialOwnerUserId,
      requestId
    )
    if (!accessToken) {
      logger.error('Failed to get access token', {
        credentialId: credential,
        userId: authz.credentialOwnerUserId,
      })
      return NextResponse.json(
        {
          error: 'Could not retrieve access token',
          authRequired: true,
        },
        { status: 401 }
      )
    }

    const response = await fetch(`https://api.webflow.com/v2/sites/${siteId}/collections`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        accept: 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      logger.error('Failed to fetch Webflow collections', {
        status: response.status,
        error: errorData,
        siteId,
      })
      return NextResponse.json(
        { error: 'Failed to fetch Webflow collections', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    const collections = data.collections || []

    const formattedCollections = collections.map((collection: any) => ({
      id: collection.id,
      name: collection.displayName || collection.slug || collection.id,
    }))

    return NextResponse.json({ collections: formattedCollections })
  } catch (error) {
    logger.error('Error processing Webflow collections request:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve Webflow collections', details: (error as Error).message },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/webflow/items/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { authorizeCredentialUse } from '@/lib/auth/credential-access'
import { validateAlphanumericId } from '@/lib/core/security/input-validation'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { refreshAccessTokenIfNeeded } from '@/app/api/auth/oauth/utils'

const logger = createLogger('WebflowItemsAPI')

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const requestId = generateRequestId()
    const body = await request.json()
    const { credential, workflowId, collectionId, search } = body

    if (!credential) {
      logger.error('Missing credential in request')
      return NextResponse.json({ error: 'Credential is required' }, { status: 400 })
    }

    const collectionIdValidation = validateAlphanumericId(collectionId, 'collectionId')
    if (!collectionIdValidation.isValid) {
      logger.error('Invalid collectionId', { error: collectionIdValidation.error })
      return NextResponse.json({ error: collectionIdValidation.error }, { status: 400 })
    }

    const authz = await authorizeCredentialUse(request as any, {
      credentialId: credential,
      workflowId,
    })
    if (!authz.ok || !authz.credentialOwnerUserId) {
      return NextResponse.json({ error: authz.error || 'Unauthorized' }, { status: 403 })
    }

    const accessToken = await refreshAccessTokenIfNeeded(
      credential,
      authz.credentialOwnerUserId,
      requestId
    )
    if (!accessToken) {
      logger.error('Failed to get access token', {
        credentialId: credential,
        userId: authz.credentialOwnerUserId,
      })
      return NextResponse.json(
        {
          error: 'Could not retrieve access token',
          authRequired: true,
        },
        { status: 401 }
      )
    }

    const response = await fetch(
      `https://api.webflow.com/v2/collections/${collectionId}/items?limit=100`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          accept: 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      logger.error('Failed to fetch Webflow items', {
        status: response.status,
        error: errorData,
        collectionId,
      })
      return NextResponse.json(
        { error: 'Failed to fetch Webflow items', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    const items = data.items || []

    let formattedItems = items.map((item: any) => {
      const fieldData = item.fieldData || {}
      const name = fieldData.name || fieldData.title || fieldData.slug || item.id
      return {
        id: item.id,
        name,
      }
    })

    if (search) {
      const searchLower = search.toLowerCase()
      formattedItems = formattedItems.filter((item: { id: string; name: string }) =>
        item.name.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({ items: formattedItems })
  } catch (error) {
    logger.error('Error processing Webflow items request:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve Webflow items', details: (error as Error).message },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/webflow/sites/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { authorizeCredentialUse } from '@/lib/auth/credential-access'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { refreshAccessTokenIfNeeded } from '@/app/api/auth/oauth/utils'

const logger = createLogger('WebflowSitesAPI')

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const requestId = generateRequestId()
    const body = await request.json()
    const { credential, workflowId } = body

    if (!credential) {
      logger.error('Missing credential in request')
      return NextResponse.json({ error: 'Credential is required' }, { status: 400 })
    }

    const authz = await authorizeCredentialUse(request as any, {
      credentialId: credential,
      workflowId,
    })
    if (!authz.ok || !authz.credentialOwnerUserId) {
      return NextResponse.json({ error: authz.error || 'Unauthorized' }, { status: 403 })
    }

    const accessToken = await refreshAccessTokenIfNeeded(
      credential,
      authz.credentialOwnerUserId,
      requestId
    )
    if (!accessToken) {
      logger.error('Failed to get access token', {
        credentialId: credential,
        userId: authz.credentialOwnerUserId,
      })
      return NextResponse.json(
        {
          error: 'Could not retrieve access token',
          authRequired: true,
        },
        { status: 401 }
      )
    }

    const response = await fetch('https://api.webflow.com/v2/sites', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        accept: 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      logger.error('Failed to fetch Webflow sites', {
        status: response.status,
        error: errorData,
      })
      return NextResponse.json(
        { error: 'Failed to fetch Webflow sites', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    const sites = data.sites || []

    const formattedSites = sites.map((site: any) => ({
      id: site.id,
      name: site.displayName || site.shortName || site.id,
    }))

    return NextResponse.json({ sites: formattedSites })
  } catch (error) {
    logger.error('Error processing Webflow sites request:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve Webflow sites', details: (error as Error).message },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/wordpress/upload/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import {
  getFileExtension,
  getMimeTypeFromExtension,
  processSingleFileToUserFile,
} from '@/lib/uploads/utils/file-utils'
import { downloadFileFromStorage } from '@/lib/uploads/utils/file-utils.server'

export const dynamic = 'force-dynamic'

const logger = createLogger('WordPressUploadAPI')

const WORDPRESS_COM_API_BASE = 'https://public-api.wordpress.com/wp/v2/sites'

const WordPressUploadSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  siteId: z.string().min(1, 'Site ID is required'),
  file: z.any().optional().nullable(),
  filename: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  caption: z.string().optional().nullable(),
  altText: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized WordPress upload attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(
      `[${requestId}] Authenticated WordPress upload request via ${authResult.authType}`,
      {
        userId: authResult.userId,
      }
    )

    const body = await request.json()
    const validatedData = WordPressUploadSchema.parse(body)

    logger.info(`[${requestId}] Uploading file to WordPress`, {
      siteId: validatedData.siteId,
      filename: validatedData.filename,
      hasFile: !!validatedData.file,
    })

    if (!validatedData.file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file provided. Please upload a file.',
        },
        { status: 400 }
      )
    }

    // Process file - convert to UserFile format if needed
    const fileData = validatedData.file

    let userFile
    try {
      userFile = processSingleFileToUserFile(fileData, requestId, logger)
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to process file',
        },
        { status: 400 }
      )
    }

    logger.info(`[${requestId}] Downloading file from storage`, {
      fileName: userFile.name,
      key: userFile.key,
      size: userFile.size,
    })

    let fileBuffer: Buffer

    try {
      fileBuffer = await downloadFileFromStorage(userFile, requestId, logger)
    } catch (error) {
      logger.error(`[${requestId}] Failed to download file:`, error)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
        { status: 500 }
      )
    }

    // Use provided filename or fall back to the original file name
    const filename = validatedData.filename || userFile.name
    const mimeType = userFile.type || getMimeTypeFromExtension(getFileExtension(filename))

    logger.info(`[${requestId}] Uploading to WordPress`, {
      siteId: validatedData.siteId,
      filename,
      mimeType,
      size: fileBuffer.length,
    })

    // Upload to WordPress using multipart form data
    const formData = new FormData()
    // Convert Buffer to Uint8Array for Blob compatibility
    const uint8Array = new Uint8Array(fileBuffer)
    const blob = new Blob([uint8Array], { type: mimeType })
    formData.append('file', blob, filename)

    // Add optional metadata
    if (validatedData.title) {
      formData.append('title', validatedData.title)
    }
    if (validatedData.caption) {
      formData.append('caption', validatedData.caption)
    }
    if (validatedData.altText) {
      formData.append('alt_text', validatedData.altText)
    }
    if (validatedData.description) {
      formData.append('description', validatedData.description)
    }

    const uploadResponse = await fetch(`${WORDPRESS_COM_API_BASE}/${validatedData.siteId}/media`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${validatedData.accessToken}`,
      },
      body: formData,
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      let errorMessage = `WordPress API error: ${uploadResponse.statusText}`

      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.message || errorJson.error || errorMessage
      } catch {
        // Use default error message
      }

      logger.error(`[${requestId}] WordPress API error:`, {
        status: uploadResponse.status,
        statusText: uploadResponse.statusText,
        error: errorText,
      })
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: uploadResponse.status }
      )
    }

    const uploadData = await uploadResponse.json()

    logger.info(`[${requestId}] File uploaded successfully`, {
      mediaId: uploadData.id,
      sourceUrl: uploadData.source_url,
    })

    return NextResponse.json({
      success: true,
      output: {
        media: {
          id: uploadData.id,
          date: uploadData.date,
          slug: uploadData.slug,
          type: uploadData.type,
          link: uploadData.link,
          title: uploadData.title,
          caption: uploadData.caption,
          alt_text: uploadData.alt_text,
          media_type: uploadData.media_type,
          mime_type: uploadData.mime_type,
          source_url: uploadData.source_url,
          media_details: uploadData.media_details,
        },
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid request data`, { errors: error.errors })
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    logger.error(`[${requestId}] Error uploading file to WordPress:`, error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/usage/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { getUserUsageLimitInfo, updateUserUsageLimit } from '@/lib/billing'
import {
  getOrganizationBillingData,
  isOrganizationOwnerOrAdmin,
} from '@/lib/billing/core/organization'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('UnifiedUsageAPI')

const usageContextEnum = z.enum(['user', 'organization'])

const usageUpdateSchema = z
  .object({
    limit: z.number().min(0, 'Limit must be a positive number'),
    context: usageContextEnum.optional().default('user'),
    organizationId: z.string().optional(),
  })
  .refine((data) => data.context !== 'organization' || data.organizationId, {
    message: 'Organization ID is required when context is organization',
  })

/**
 * Unified Usage Endpoint
 * GET/PUT /api/usage?context=user|organization&userId=<id>&organizationId=<id>
 *
 */
export async function GET(request: NextRequest) {
  const session = await getSession()

  try {
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const context = searchParams.get('context') || 'user'
    const userId = searchParams.get('userId') || session.user.id
    const organizationId = searchParams.get('organizationId')

    if (!['user', 'organization'].includes(context)) {
      return NextResponse.json(
        { error: 'Invalid context. Must be "user" or "organization"' },
        { status: 400 }
      )
    }

    if (context === 'user' && userId !== session.user.id) {
      return NextResponse.json(
        { error: "Cannot view other users' usage information" },
        { status: 403 }
      )
    }

    if (context === 'organization') {
      if (!organizationId) {
        return NextResponse.json(
          { error: 'Organization ID is required when context=organization' },
          { status: 400 }
        )
      }
      const org = await getOrganizationBillingData(organizationId)
      return NextResponse.json({
        success: true,
        context,
        userId,
        organizationId,
        data: org,
      })
    }

    const usageLimitInfo = await getUserUsageLimitInfo(userId)

    return NextResponse.json({
      success: true,
      context,
      userId,
      organizationId,
      data: usageLimitInfo,
    })
  } catch (error) {
    logger.error('Failed to get usage limit info', {
      userId: session?.user?.id,
      error,
    })

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSession()

  try {
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = usageUpdateSchema.safeParse(body)

    if (!validation.success) {
      const firstError = validation.error.errors[0]
      logger.error('Validation error:', firstError)
      return NextResponse.json({ error: firstError.message }, { status: 400 })
    }

    const { limit, context, organizationId } = validation.data
    const userId = session.user.id

    if (context === 'user') {
      const result = await updateUserUsageLimit(userId, limit)
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }
    } else if (context === 'organization') {
      // organizationId is guaranteed to exist by Zod refinement
      const hasPermission = await isOrganizationOwnerOrAdmin(session.user.id, organizationId!)
      if (!hasPermission) {
        return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
      }

      const { updateOrganizationUsageLimit } = await import('@/lib/billing/core/organization')
      const result = await updateOrganizationUsageLimit(organizationId!, limit)

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }

      const updated = await getOrganizationBillingData(organizationId!)
      return NextResponse.json({ success: true, context, userId, organizationId, data: updated })
    }

    const updatedInfo = await getUserUsageLimitInfo(userId)

    return NextResponse.json({
      success: true,
      context,
      userId,
      organizationId,
      data: updatedInfo,
    })
  } catch (error) {
    logger.error('Failed to update usage limit', {
      userId: session?.user?.id,
      error,
    })

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/user/super-user/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { user } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('SuperUserAPI')

export const revalidate = 0

// GET /api/user/super-user - Check if current user is a super user (database status)
export async function GET(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const session = await getSession()
    if (!session?.user?.id) {
      logger.warn(`[${requestId}] Unauthorized super user status check attempt`)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await db
      .select({ isSuperUser: user.isSuperUser })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1)

    if (currentUser.length === 0) {
      logger.warn(`[${requestId}] User not found: ${session.user.id}`)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      isSuperUser: currentUser[0].isSuperUser,
    })
  } catch (error) {
    logger.error(`[${requestId}] Error checking super user status`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/users/me/api-keys/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { apiKey } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { type NextRequest, NextResponse } from 'next/server'
import { createApiKey, getApiKeyDisplayFormat } from '@/lib/api-key/auth'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('ApiKeysAPI')

// GET /api/users/me/api-keys - Get all API keys for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const keys = await db
      .select({
        id: apiKey.id,
        name: apiKey.name,
        key: apiKey.key,
        createdAt: apiKey.createdAt,
        lastUsed: apiKey.lastUsed,
        expiresAt: apiKey.expiresAt,
      })
      .from(apiKey)
      .where(and(eq(apiKey.userId, userId), eq(apiKey.type, 'personal')))
      .orderBy(apiKey.createdAt)

    const maskedKeys = await Promise.all(
      keys.map(async (key) => {
        const displayFormat = await getApiKeyDisplayFormat(key.key)
        return {
          ...key,
          key: key.key,
          displayKey: displayFormat,
        }
      })
    )

    return NextResponse.json({ keys: maskedKeys })
  } catch (error) {
    logger.error('Failed to fetch API keys', { error })
    return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 })
  }
}

// POST /api/users/me/api-keys - Create a new API key
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()

    const { name: rawName } = body
    if (!rawName || typeof rawName !== 'string') {
      return NextResponse.json({ error: 'Invalid request. Name is required.' }, { status: 400 })
    }

    const name = rawName.trim()
    if (!name) {
      return NextResponse.json({ error: 'Name cannot be empty.' }, { status: 400 })
    }

    const existingKey = await db
      .select()
      .from(apiKey)
      .where(and(eq(apiKey.userId, userId), eq(apiKey.name, name), eq(apiKey.type, 'personal')))
      .limit(1)

    if (existingKey.length > 0) {
      return NextResponse.json(
        {
          error: `A personal API key named "${name}" already exists. Please choose a different name.`,
        },
        { status: 409 }
      )
    }

    const { key: plainKey, encryptedKey } = await createApiKey(true)

    if (!encryptedKey) {
      throw new Error('Failed to encrypt API key for storage')
    }

    const [newKey] = await db
      .insert(apiKey)
      .values({
        id: nanoid(),
        userId,
        workspaceId: null,
        name,
        key: encryptedKey,
        type: 'personal',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({
        id: apiKey.id,
        name: apiKey.name,
        createdAt: apiKey.createdAt,
      })

    return NextResponse.json({
      key: {
        ...newKey,
        key: plainKey,
      },
    })
  } catch (error) {
    logger.error('Failed to create API key', { error })
    return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/users/me/api-keys/[id]/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { apiKey } from '@sim/db/schema'
import { and, eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('ApiKeyAPI')

// DELETE /api/users/me/api-keys/[id] - Delete an API key
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = generateRequestId()
  const { id } = await params

  try {
    logger.debug(`[${requestId}] Deleting API key: ${id}`)
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const keyId = id

    if (!keyId) {
      return NextResponse.json({ error: 'API key ID is required' }, { status: 400 })
    }

    // Delete the API key, ensuring it belongs to the current user
    const result = await db
      .delete(apiKey)
      .where(and(eq(apiKey.id, keyId), eq(apiKey.userId, userId)))
      .returning({ id: apiKey.id })

    if (!result.length) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Failed to delete API key', { error })
    return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

````
