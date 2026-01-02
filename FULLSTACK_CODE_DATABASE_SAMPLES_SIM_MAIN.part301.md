---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 301
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 301 of 933)

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
Location: sim-main/apps/sim/app/api/tools/confluence/create-page/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { validateAlphanumericId, validateJiraCloudId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'
import { getConfluenceCloudId } from '@/tools/confluence/utils'

const logger = createLogger('ConfluenceCreatePageAPI')

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const {
      domain,
      accessToken,
      cloudId: providedCloudId,
      spaceId,
      title,
      content,
      parentId,
    } = await request.json()

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    if (!spaceId) {
      return NextResponse.json({ error: 'Space ID is required' }, { status: 400 })
    }

    if (!/^\d+$/.test(String(spaceId))) {
      return NextResponse.json(
        {
          error:
            'Invalid Space ID. The Space ID must be a numeric value, not the space key from the URL. Use the "list" operation to get all spaces with their numeric IDs.',
        },
        { status: 400 }
      )
    }

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const spaceIdValidation = validateAlphanumericId(spaceId, 'spaceId', 255)
    if (!spaceIdValidation.isValid) {
      return NextResponse.json({ error: spaceIdValidation.error }, { status: 400 })
    }

    if (parentId) {
      const parentIdValidation = validateAlphanumericId(parentId, 'parentId', 255)
      if (!parentIdValidation.isValid) {
        return NextResponse.json({ error: parentIdValidation.error }, { status: 400 })
      }
    }

    const cloudId = providedCloudId || (await getConfluenceCloudId(domain, accessToken))

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    const createBody: any = {
      spaceId,
      status: 'current',
      title,
      body: {
        representation: 'storage',
        value: content,
      },
    }

    if (parentId !== undefined && parentId !== null && parentId !== '') {
      createBody.parentId = parentId
    }

    const url = `https://api.atlassian.com/ex/confluence/${cloudId}/wiki/api/v2/pages`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(createBody),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      logger.error('Confluence API error response:', {
        status: response.status,
        statusText: response.statusText,
        error: JSON.stringify(errorData, null, 2),
      })

      let errorMessage = `Failed to create Confluence page (${response.status})`
      if (errorData?.message) {
        errorMessage = errorData.message
      } else if (errorData?.errors && Array.isArray(errorData.errors)) {
        const firstError = errorData.errors[0]
        if (firstError?.title) {
          if (firstError.title.includes("'spaceId'") && firstError.title.includes('Long')) {
            errorMessage =
              'Invalid Space ID. Use the list spaces operation to find valid space IDs.'
          } else {
            errorMessage = firstError.title
          }
        } else {
          errorMessage = JSON.stringify(errorData.errors)
        }
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error creating Confluence page:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/confluence/labels/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { validateAlphanumericId, validateJiraCloudId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'
import { getConfluenceCloudId } from '@/tools/confluence/utils'

const logger = createLogger('ConfluenceLabelsAPI')

export const dynamic = 'force-dynamic'

// Add a label to a page
export async function POST(request: Request) {
  try {
    const {
      domain,
      accessToken,
      cloudId: providedCloudId,
      pageId,
      labelName,
    } = await request.json()

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }

    if (!labelName) {
      return NextResponse.json({ error: 'Label name is required' }, { status: 400 })
    }

    const pageIdValidation = validateAlphanumericId(pageId, 'pageId', 255)
    if (!pageIdValidation.isValid) {
      return NextResponse.json({ error: pageIdValidation.error }, { status: 400 })
    }

    const cloudId = providedCloudId || (await getConfluenceCloudId(domain, accessToken))

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    const url = `https://api.atlassian.com/ex/confluence/${cloudId}/wiki/api/v2/pages/${pageId}/labels`

    const body = {
      prefix: 'global',
      name: labelName,
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      logger.error('Confluence API error response:', {
        status: response.status,
        statusText: response.statusText,
        error: JSON.stringify(errorData, null, 2),
      })
      const errorMessage =
        errorData?.message || `Failed to add Confluence label (${response.status})`
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({ ...data, pageId, labelName })
  } catch (error) {
    logger.error('Error adding Confluence label:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// List labels on a page
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain')
    const accessToken = searchParams.get('accessToken')
    const pageId = searchParams.get('pageId')
    const providedCloudId = searchParams.get('cloudId')

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }

    const pageIdValidation = validateAlphanumericId(pageId, 'pageId', 255)
    if (!pageIdValidation.isValid) {
      return NextResponse.json({ error: pageIdValidation.error }, { status: 400 })
    }

    const cloudId = providedCloudId || (await getConfluenceCloudId(domain, accessToken))

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    const url = `https://api.atlassian.com/ex/confluence/${cloudId}/wiki/api/v2/pages/${pageId}/labels`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      logger.error('Confluence API error response:', {
        status: response.status,
        statusText: response.statusText,
        error: JSON.stringify(errorData, null, 2),
      })
      const errorMessage =
        errorData?.message || `Failed to list Confluence labels (${response.status})`
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()

    const labels = (data.results || []).map((label: any) => ({
      id: label.id,
      name: label.name,
      prefix: label.prefix || 'global',
    }))

    return NextResponse.json({ labels })
  } catch (error) {
    logger.error('Error listing Confluence labels:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/confluence/page/route.ts
Signals: Next.js, Zod

```typescript
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { validateAlphanumericId, validateJiraCloudId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'
import { getConfluenceCloudId } from '@/tools/confluence/utils'

const logger = createLogger('ConfluencePageAPI')

export const dynamic = 'force-dynamic'

const postPageSchema = z
  .object({
    domain: z.string().min(1, 'Domain is required'),
    accessToken: z.string().min(1, 'Access token is required'),
    cloudId: z.string().optional(),
    pageId: z.string().min(1, 'Page ID is required'),
  })
  .refine(
    (data) => {
      const validation = validateAlphanumericId(data.pageId, 'pageId', 255)
      return validation.isValid
    },
    (data) => {
      const validation = validateAlphanumericId(data.pageId, 'pageId', 255)
      return { message: validation.error || 'Invalid page ID', path: ['pageId'] }
    }
  )

const putPageSchema = z
  .object({
    domain: z.string().min(1, 'Domain is required'),
    accessToken: z.string().min(1, 'Access token is required'),
    cloudId: z.string().optional(),
    pageId: z.string().min(1, 'Page ID is required'),
    title: z.string().optional(),
    body: z
      .object({
        value: z.string().optional(),
      })
      .optional(),
    version: z
      .object({
        message: z.string().optional(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      const validation = validateAlphanumericId(data.pageId, 'pageId', 255)
      return validation.isValid
    },
    (data) => {
      const validation = validateAlphanumericId(data.pageId, 'pageId', 255)
      return { message: validation.error || 'Invalid page ID', path: ['pageId'] }
    }
  )

const deletePageSchema = z
  .object({
    domain: z.string().min(1, 'Domain is required'),
    accessToken: z.string().min(1, 'Access token is required'),
    cloudId: z.string().optional(),
    pageId: z.string().min(1, 'Page ID is required'),
  })
  .refine(
    (data) => {
      const validation = validateAlphanumericId(data.pageId, 'pageId', 255)
      return validation.isValid
    },
    (data) => {
      const validation = validateAlphanumericId(data.pageId, 'pageId', 255)
      return { message: validation.error || 'Invalid page ID', path: ['pageId'] }
    }
  )

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const validation = postPageSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return NextResponse.json({ error: firstError.message }, { status: 400 })
    }

    const { domain, accessToken, cloudId: providedCloudId, pageId } = validation.data

    const cloudId = providedCloudId || (await getConfluenceCloudId(domain, accessToken))

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    const url = `https://api.atlassian.com/ex/confluence/${cloudId}/wiki/api/v2/pages/${pageId}?expand=body.storage,body.view,body.atlas_doc_format`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      logger.error(`Confluence API error: ${response.status} ${response.statusText}`)
      let errorMessage

      try {
        const errorData = await response.json()
        logger.error('Error details:', JSON.stringify(errorData, null, 2))
        errorMessage = errorData.message || `Failed to fetch Confluence page (${response.status})`
      } catch (e) {
        logger.error('Could not parse error response as JSON:', e)
        errorMessage = `Failed to fetch Confluence page: ${response.status} ${response.statusText}`
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json({
      id: data.id,
      title: data.title,
      body: {
        view: {
          value:
            data.body?.storage?.value ||
            data.body?.view?.value ||
            data.body?.atlas_doc_format?.value ||
            data.content || // try alternative fields
            data.description ||
            `Content for page ${data.title}`, // fallback content
        },
      },
    })
  } catch (error) {
    logger.error('Error fetching Confluence page:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    const validation = putPageSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return NextResponse.json({ error: firstError.message }, { status: 400 })
    }

    const {
      domain,
      accessToken,
      pageId,
      cloudId: providedCloudId,
      title,
      body: pageBody,
      version,
    } = validation.data

    const cloudId = providedCloudId || (await getConfluenceCloudId(domain, accessToken))

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    const currentPageUrl = `https://api.atlassian.com/ex/confluence/${cloudId}/wiki/api/v2/pages/${pageId}`
    const currentPageResponse = await fetch(currentPageUrl, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!currentPageResponse.ok) {
      throw new Error(`Failed to fetch current page: ${currentPageResponse.status}`)
    }

    const currentPage = await currentPageResponse.json()
    const currentVersion = currentPage.version.number

    const updateBody: any = {
      id: pageId,
      version: {
        number: currentVersion + 1,
        message: version?.message || 'Updated via API',
      },
      status: 'current',
    }

    if (title !== undefined && title !== null && title !== '') {
      updateBody.title = title
    } else {
      updateBody.title = currentPage.title
    }

    if (pageBody?.value !== undefined && pageBody?.value !== null && pageBody?.value !== '') {
      updateBody.body = {
        representation: 'storage',
        value: pageBody.value,
      }
    } else {
      updateBody.body = {
        representation: 'storage',
        value: currentPage.body?.storage?.value || '',
      }
    }

    const response = await fetch(currentPageUrl, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updateBody),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      logger.error('Confluence API error response:', {
        status: response.status,
        statusText: response.statusText,
        error: JSON.stringify(errorData, null, 2),
      })
      const errorMessage =
        errorData?.message ||
        (errorData?.errors && JSON.stringify(errorData.errors)) ||
        `Failed to update Confluence page (${response.status})`
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error updating Confluence page:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()

    const validation = deletePageSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.errors[0]
      return NextResponse.json({ error: firstError.message }, { status: 400 })
    }

    const { domain, accessToken, cloudId: providedCloudId, pageId } = validation.data

    const cloudId = providedCloudId || (await getConfluenceCloudId(domain, accessToken))

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    const url = `https://api.atlassian.com/ex/confluence/${cloudId}/wiki/api/v2/pages/${pageId}`

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      logger.error('Confluence API error response:', {
        status: response.status,
        statusText: response.statusText,
        error: JSON.stringify(errorData, null, 2),
      })
      const errorMessage =
        errorData?.message || `Failed to delete Confluence page (${response.status})`
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    return NextResponse.json({ pageId, deleted: true })
  } catch (error) {
    logger.error('Error deleting Confluence page:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/confluence/pages/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { validateJiraCloudId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'
import { getConfluenceCloudId } from '@/tools/confluence/utils'

const logger = createLogger('ConfluencePagesAPI')

export const dynamic = 'force-dynamic'

// List pages or search pages
export async function POST(request: Request) {
  try {
    const {
      domain,
      accessToken,
      title,
      cloudId: providedCloudId,
      limit = 50,
    } = await request.json()

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    // Use provided cloudId or fetch it if not provided
    const cloudId = providedCloudId || (await getConfluenceCloudId(domain, accessToken))

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    // Build the URL with query parameters
    const baseUrl = `https://api.atlassian.com/ex/confluence/${cloudId}/wiki/api/v2/pages`
    const queryParams = new URLSearchParams()

    if (limit) {
      queryParams.append('limit', limit.toString())
    }

    if (title) {
      queryParams.append('title', title)
    }

    const queryString = queryParams.toString()
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl

    logger.info(`Fetching Confluence pages from: ${url}`)

    // Make the request to Confluence API with OAuth Bearer token
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    logger.info('Response status:', response.status, response.statusText)

    if (!response.ok) {
      logger.error(`Confluence API error: ${response.status} ${response.statusText}`)
      let errorMessage

      try {
        const errorData = await response.json()
        logger.error('Error details:', JSON.stringify(errorData, null, 2))
        errorMessage = errorData.message || `Failed to fetch Confluence pages (${response.status})`
      } catch (e) {
        logger.error('Could not parse error response as JSON:', e)

        // Try to get the response text for more context
        try {
          const text = await response.text()
          logger.error('Response text:', text)
          errorMessage = `Failed to fetch Confluence pages: ${response.status} ${response.statusText}`
        } catch (_textError) {
          errorMessage = `Failed to fetch Confluence pages: ${response.status} ${response.statusText}`
        }
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    logger.info('Confluence API response:', `${JSON.stringify(data, null, 2).substring(0, 300)}...`)
    logger.info(`Found ${data.results?.length || 0} pages`)

    if (data.results && data.results.length > 0) {
      logger.info('First few pages:')
      for (const page of data.results.slice(0, 3)) {
        logger.info(`- ${page.id}: ${page.title}`)
      }
    }

    return NextResponse.json({
      files: data.results.map((page: any) => ({
        id: page.id,
        name: page.title,
        mimeType: 'confluence/page',
        url: page._links?.webui || '',
        modifiedTime: page.version?.createdAt || '',
        spaceId: page.spaceId,
        webViewLink: page._links?.webui || '',
      })),
    })
  } catch (error) {
    logger.error('Error fetching Confluence pages:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/confluence/search/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { validateJiraCloudId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'
import { getConfluenceCloudId } from '@/tools/confluence/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('Confluence Search')

export async function POST(request: Request) {
  try {
    const {
      domain,
      accessToken,
      cloudId: providedCloudId,
      query,
      limit = 25,
    } = await request.json()

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
    }

    const cloudId = providedCloudId || (await getConfluenceCloudId(domain, accessToken))

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    const searchParams = new URLSearchParams({
      cql: `text ~ "${query}"`,
      limit: limit.toString(),
    })

    const url = `https://api.atlassian.com/ex/confluence/${cloudId}/wiki/rest/api/search?${searchParams.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      logger.error('Confluence API error response:', {
        status: response.status,
        statusText: response.statusText,
        error: JSON.stringify(errorData, null, 2),
      })
      const errorMessage = errorData?.message || `Failed to search Confluence (${response.status})`
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()

    const results = (data.results || []).map((result: any) => ({
      id: result.content?.id || result.id,
      title: result.content?.title || result.title,
      type: result.content?.type || result.type,
      url: result.url || result._links?.webui || '',
      excerpt: result.excerpt || '',
    }))

    return NextResponse.json({ results })
  } catch (error) {
    logger.error('Error searching Confluence:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/confluence/space/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { validateAlphanumericId, validateJiraCloudId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'
import { getConfluenceCloudId } from '@/tools/confluence/utils'

const logger = createLogger('ConfluenceSpaceAPI')

export const dynamic = 'force-dynamic'

// Get a specific space
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain')
    const accessToken = searchParams.get('accessToken')
    const spaceId = searchParams.get('spaceId')
    const providedCloudId = searchParams.get('cloudId')

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    if (!spaceId) {
      return NextResponse.json({ error: 'Space ID is required' }, { status: 400 })
    }

    const spaceIdValidation = validateAlphanumericId(spaceId, 'spaceId', 255)
    if (!spaceIdValidation.isValid) {
      return NextResponse.json({ error: spaceIdValidation.error }, { status: 400 })
    }

    const cloudId = providedCloudId || (await getConfluenceCloudId(domain, accessToken))

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    const url = `https://api.atlassian.com/ex/confluence/${cloudId}/wiki/api/v2/spaces/${spaceId}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      logger.error('Confluence API error response:', {
        status: response.status,
        statusText: response.statusText,
        error: JSON.stringify(errorData, null, 2),
      })
      const errorMessage =
        errorData?.message || `Failed to get Confluence space (${response.status})`
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error getting Confluence space:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/confluence/spaces/route.ts
Signals: Next.js

```typescript
import { NextResponse } from 'next/server'
import { validateJiraCloudId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'
import { getConfluenceCloudId } from '@/tools/confluence/utils'

const logger = createLogger('ConfluenceSpacesAPI')

export const dynamic = 'force-dynamic'

// List all spaces
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain')
    const accessToken = searchParams.get('accessToken')
    const providedCloudId = searchParams.get('cloudId')
    const limit = searchParams.get('limit') || '25'

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    const cloudId = providedCloudId || (await getConfluenceCloudId(domain, accessToken))

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    const url = `https://api.atlassian.com/ex/confluence/${cloudId}/wiki/api/v2/spaces?limit=${limit}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      logger.error('Confluence API error response:', {
        status: response.status,
        statusText: response.statusText,
        error: JSON.stringify(errorData, null, 2),
      })
      const errorMessage =
        errorData?.message || `Failed to list Confluence spaces (${response.status})`
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()

    const spaces = (data.results || []).map((space: any) => ({
      id: space.id,
      name: space.name,
      key: space.key,
      type: space.type,
      status: space.status,
    }))

    return NextResponse.json({ spaces })
  } catch (error) {
    logger.error('Error listing Confluence spaces:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/confluence/upload-attachment/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { validateAlphanumericId, validateJiraCloudId } from '@/lib/core/security/input-validation'
import { createLogger } from '@/lib/logs/console/logger'
import { processSingleFileToUserFile } from '@/lib/uploads/utils/file-utils'
import { downloadFileFromStorage } from '@/lib/uploads/utils/file-utils.server'
import { getConfluenceCloudId } from '@/tools/confluence/utils'

const logger = createLogger('ConfluenceUploadAttachmentAPI')

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { domain, accessToken, cloudId: providedCloudId, pageId, file, fileName, comment } = body

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }

    const pageIdValidation = validateAlphanumericId(pageId, 'pageId', 255)
    if (!pageIdValidation.isValid) {
      return NextResponse.json({ error: pageIdValidation.error }, { status: 400 })
    }

    const cloudId = providedCloudId || (await getConfluenceCloudId(domain, accessToken))

    const cloudIdValidation = validateJiraCloudId(cloudId, 'cloudId')
    if (!cloudIdValidation.isValid) {
      return NextResponse.json({ error: cloudIdValidation.error }, { status: 400 })
    }

    let fileToProcess = file
    if (Array.isArray(file)) {
      if (file.length === 0) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }
      fileToProcess = file[0]
    }

    let userFile
    try {
      userFile = processSingleFileToUserFile(fileToProcess, 'confluence-upload', logger)
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to process file' },
        { status: 400 }
      )
    }

    let fileBuffer: Buffer
    try {
      fileBuffer = await downloadFileFromStorage(userFile, 'confluence-upload', logger)
    } catch (error) {
      logger.error('Failed to download file from storage:', error)
      return NextResponse.json(
        {
          error: `Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
        { status: 500 }
      )
    }

    const uploadFileName = fileName || userFile.name || 'attachment'
    const mimeType = userFile.type || 'application/octet-stream'

    const url = `https://api.atlassian.com/ex/confluence/${cloudId}/wiki/rest/api/content/${pageId}/child/attachment`

    const formData = new FormData()
    const blob = new Blob([new Uint8Array(fileBuffer)], { type: mimeType })
    formData.append('file', blob, uploadFileName)

    if (comment) {
      formData.append('comment', comment)
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Atlassian-Token': 'nocheck',
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      logger.error('Confluence API error response:', {
        status: response.status,
        statusText: response.statusText,
        error: JSON.stringify(errorData, null, 2),
      })

      let errorMessage = `Failed to upload attachment to Confluence (${response.status})`
      if (errorData?.message) {
        errorMessage = errorData.message
      } else if (errorData?.errorMessage) {
        errorMessage = errorData.errorMessage
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()

    const attachment = data.results?.[0] || data

    return NextResponse.json({
      attachmentId: attachment.id,
      title: attachment.title,
      fileSize: attachment.extensions?.fileSize || 0,
      mediaType: attachment.extensions?.mediaType || mimeType,
      downloadUrl: attachment._links?.download || '',
      pageId: pageId,
    })
  } catch (error) {
    logger.error('Error uploading Confluence attachment:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

````
