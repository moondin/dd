---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 684
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 684 of 933)

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

---[FILE: get_thumbnail.ts]---
Location: sim-main/apps/sim/tools/google_slides/get_thumbnail.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('GoogleSlidesGetThumbnailTool')

interface GetThumbnailParams {
  accessToken: string
  presentationId: string
  pageObjectId: string
  thumbnailSize?: string
  mimeType?: string
}

interface GetThumbnailResponse {
  success: boolean
  output: {
    contentUrl: string
    width: number
    height: number
    metadata: {
      presentationId: string
      pageObjectId: string
      thumbnailSize: string
      mimeType: string
    }
  }
}

// Available thumbnail sizes
const THUMBNAIL_SIZES = ['SMALL', 'MEDIUM', 'LARGE'] as const

// Available MIME types for thumbnails
const MIME_TYPES = ['PNG', 'GIF'] as const

export const getThumbnailTool: ToolConfig<GetThumbnailParams, GetThumbnailResponse> = {
  id: 'google_slides_get_thumbnail',
  name: 'Get Slide Thumbnail',
  description: 'Generate a thumbnail image of a specific slide in a Google Slides presentation',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-drive',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Google Slides API',
    },
    presentationId: {
      type: 'string',
      required: true,
      description: 'The ID of the presentation',
    },
    pageObjectId: {
      type: 'string',
      required: true,
      description: 'The object ID of the slide/page to get a thumbnail for',
    },
    thumbnailSize: {
      type: 'string',
      required: false,
      description:
        'The size of the thumbnail: SMALL (200px), MEDIUM (800px), or LARGE (1600px). Defaults to MEDIUM.',
    },
    mimeType: {
      type: 'string',
      required: false,
      description: 'The MIME type of the thumbnail image: PNG or GIF. Defaults to PNG.',
    },
  },

  request: {
    url: (params) => {
      const presentationId = params.presentationId?.trim()
      const pageObjectId = params.pageObjectId?.trim()

      if (!presentationId) {
        throw new Error('Presentation ID is required')
      }
      if (!pageObjectId) {
        throw new Error('Page Object ID is required')
      }

      // Build the URL with query parameters for thumbnail properties
      let size = (params.thumbnailSize || 'MEDIUM').toUpperCase()
      if (!THUMBNAIL_SIZES.includes(size as (typeof THUMBNAIL_SIZES)[number])) {
        size = 'MEDIUM'
      }

      // Validate and normalize mimeType
      let mimeType = (params.mimeType || 'PNG').toUpperCase()
      if (!MIME_TYPES.includes(mimeType as (typeof MIME_TYPES)[number])) {
        mimeType = 'PNG'
      }

      // The API uses thumbnailProperties as query parameters
      let url = `https://slides.googleapis.com/v1/presentations/${presentationId}/pages/${pageObjectId}/thumbnail?thumbnailProperties.thumbnailSize=${size}`

      // Add mimeType if not the default (PNG)
      if (mimeType !== 'PNG') {
        url += `&thumbnailProperties.mimeType=${mimeType}`
      }

      return url
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }
      return {
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response: Response, params) => {
    const data = await response.json()

    if (!response.ok) {
      logger.error('Google Slides API error:', { data })
      throw new Error(data.error?.message || 'Failed to get thumbnail')
    }

    const presentationId = params?.presentationId?.trim() || ''
    const pageObjectId = params?.pageObjectId?.trim() || ''
    const thumbnailSize = (params?.thumbnailSize || 'MEDIUM').toUpperCase()
    const mimeType = (params?.mimeType || 'PNG').toUpperCase()

    return {
      success: true,
      output: {
        contentUrl: data.contentUrl,
        width: data.width,
        height: data.height,
        metadata: {
          presentationId,
          pageObjectId,
          thumbnailSize,
          mimeType,
        },
      },
    }
  },

  outputs: {
    contentUrl: {
      type: 'string',
      description: 'URL to the thumbnail image (valid for 30 minutes)',
    },
    width: {
      type: 'number',
      description: 'Width of the thumbnail in pixels',
    },
    height: {
      type: 'number',
      description: 'Height of the thumbnail in pixels',
    },
    metadata: {
      type: 'json',
      description: 'Operation metadata including presentation ID and page object ID',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/google_slides/index.ts

```typescript
import { addImageTool } from '@/tools/google_slides/add_image'
import { addSlideTool } from '@/tools/google_slides/add_slide'
import { createTool } from '@/tools/google_slides/create'
import { getThumbnailTool } from '@/tools/google_slides/get_thumbnail'
import { readTool } from '@/tools/google_slides/read'
import { replaceAllTextTool } from '@/tools/google_slides/replace_all_text'
import { writeTool } from '@/tools/google_slides/write'

export const googleSlidesReadTool = readTool
export const googleSlidesWriteTool = writeTool
export const googleSlidesCreateTool = createTool
export const googleSlidesReplaceAllTextTool = replaceAllTextTool
export const googleSlidesAddSlideTool = addSlideTool
export const googleSlidesGetThumbnailTool = getThumbnailTool
export const googleSlidesAddImageTool = addImageTool
```

--------------------------------------------------------------------------------

---[FILE: read.ts]---
Location: sim-main/apps/sim/tools/google_slides/read.ts

```typescript
import type { GoogleSlidesReadResponse, GoogleSlidesToolParams } from '@/tools/google_slides/types'
import type { ToolConfig } from '@/tools/types'

export const readTool: ToolConfig<GoogleSlidesToolParams, GoogleSlidesReadResponse> = {
  id: 'google_slides_read',
  name: 'Read Google Slides Presentation',
  description: 'Read content from a Google Slides presentation',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-drive',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Google Slides API',
    },
    presentationId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the presentation to read',
    },
  },

  request: {
    url: (params) => {
      // Ensure presentationId is valid
      const presentationId = params.presentationId?.trim() || params.manualPresentationId?.trim()
      if (!presentationId) {
        throw new Error('Presentation ID is required')
      }

      return `https://slides.googleapis.com/v1/presentations/${presentationId}`
    },
    method: 'GET',
    headers: (params) => {
      // Validate access token
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    // Extract slides from the response
    const slides = data.slides || []

    // Create presentation metadata
    const metadata = {
      presentationId: data.presentationId,
      title: data.title || 'Untitled Presentation',
      pageSize: data.pageSize,
      mimeType: 'application/vnd.google-apps.presentation',
      url: `https://docs.google.com/presentation/d/${data.presentationId}/edit`,
    }

    return {
      success: true,
      output: {
        slides,
        metadata,
      },
    }
  },

  outputs: {
    slides: { type: 'json', description: 'Array of slides with their content' },
    metadata: {
      type: 'json',
      description: 'Presentation metadata including ID, title, and URL',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: replace_all_text.ts]---
Location: sim-main/apps/sim/tools/google_slides/replace_all_text.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('GoogleSlidesReplaceAllTextTool')

interface ReplaceAllTextParams {
  accessToken: string
  presentationId: string
  findText: string
  replaceText: string
  matchCase?: boolean
  pageObjectIds?: string
}

interface ReplaceAllTextResponse {
  success: boolean
  output: {
    occurrencesChanged: number
    metadata: {
      presentationId: string
      findText: string
      replaceText: string
      url: string
    }
  }
}

export const replaceAllTextTool: ToolConfig<ReplaceAllTextParams, ReplaceAllTextResponse> = {
  id: 'google_slides_replace_all_text',
  name: 'Replace All Text in Google Slides',
  description: 'Find and replace all occurrences of text throughout a Google Slides presentation',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-drive',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Google Slides API',
    },
    presentationId: {
      type: 'string',
      required: true,
      description: 'The ID of the presentation',
    },
    findText: {
      type: 'string',
      required: true,
      description: 'The text to find (e.g., {{placeholder}})',
    },
    replaceText: {
      type: 'string',
      required: true,
      description: 'The text to replace with',
    },
    matchCase: {
      type: 'boolean',
      required: false,
      description: 'Whether the search should be case-sensitive (default: true)',
    },
    pageObjectIds: {
      type: 'string',
      required: false,
      description:
        'Comma-separated list of slide object IDs to limit replacements to specific slides (leave empty for all slides)',
    },
  },

  request: {
    url: (params) => {
      const presentationId = params.presentationId?.trim()
      if (!presentationId) {
        throw new Error('Presentation ID is required')
      }
      return `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`
    },
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }
      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      if (!params.findText) {
        throw new Error('Find text is required')
      }
      if (params.replaceText === undefined || params.replaceText === null) {
        throw new Error('Replace text is required')
      }

      const replaceAllTextRequest: Record<string, any> = {
        containsText: {
          text: params.findText,
          matchCase: params.matchCase !== false, // Default to true
        },
        replaceText: params.replaceText,
      }

      // Add pageObjectIds if specified to limit replacements to specific slides
      if (params.pageObjectIds?.trim()) {
        replaceAllTextRequest.pageObjectIds = params.pageObjectIds
          .split(',')
          .map((id) => id.trim())
          .filter((id) => id.length > 0)
      }

      return {
        requests: [
          {
            replaceAllText: replaceAllTextRequest,
          },
        ],
      }
    },
  },

  transformResponse: async (response: Response, params) => {
    const data = await response.json()

    if (!response.ok) {
      logger.error('Google Slides API error:', { data })
      throw new Error(data.error?.message || 'Failed to replace text')
    }

    // The response contains replies array with replaceAllText results
    const replaceResult = data.replies?.[0]?.replaceAllText
    const occurrencesChanged = replaceResult?.occurrencesChanged || 0

    const presentationId = params?.presentationId?.trim() || ''

    return {
      success: true,
      output: {
        occurrencesChanged,
        metadata: {
          presentationId,
          findText: params?.findText || '',
          replaceText: params?.replaceText || '',
          url: `https://docs.google.com/presentation/d/${presentationId}/edit`,
        },
      },
    }
  },

  outputs: {
    occurrencesChanged: {
      type: 'number',
      description: 'Number of text occurrences that were replaced',
    },
    metadata: {
      type: 'json',
      description: 'Operation metadata including presentation ID and URL',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/google_slides/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface GoogleSlidesMetadata {
  presentationId: string
  title: string
  pageSize?: {
    width: number
    height: number
  }
  mimeType?: string
  createdTime?: string
  modifiedTime?: string
  url?: string
}

export interface GoogleSlidesReadResponse extends ToolResponse {
  output: {
    slides: any[]
    metadata: GoogleSlidesMetadata
  }
}

export interface GoogleSlidesWriteResponse extends ToolResponse {
  output: {
    updatedContent: boolean
    metadata: GoogleSlidesMetadata
  }
}

export interface GoogleSlidesCreateResponse extends ToolResponse {
  output: {
    metadata: GoogleSlidesMetadata
  }
}

export interface GoogleSlidesToolParams {
  accessToken: string
  presentationId?: string
  manualPresentationId?: string
  title?: string
  content?: string
  slideIndex?: number
  folderId?: string
  folderSelector?: string
}

export type GoogleSlidesResponse =
  | GoogleSlidesReadResponse
  | GoogleSlidesWriteResponse
  | GoogleSlidesCreateResponse
```

--------------------------------------------------------------------------------

---[FILE: write.ts]---
Location: sim-main/apps/sim/tools/google_slides/write.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { GoogleSlidesToolParams, GoogleSlidesWriteResponse } from '@/tools/google_slides/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('GoogleSlidesWriteTool')

export const writeTool: ToolConfig<GoogleSlidesToolParams, GoogleSlidesWriteResponse> = {
  id: 'google_slides_write',
  name: 'Write to Google Slides Presentation',
  description: 'Write or update content in a Google Slides presentation',
  version: '1.0',
  oauth: {
    required: true,
    provider: 'google-drive',
  },
  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Google Slides API',
    },
    presentationId: {
      type: 'string',
      required: true,
      description: 'The ID of the presentation to write to',
    },
    content: {
      type: 'string',
      required: true,
      description: 'The content to write to the slide',
    },
    slideIndex: {
      type: 'number',
      required: false,
      description: 'The index of the slide to write to (defaults to first slide)',
    },
  },

  request: {
    url: (params) => {
      // Ensure presentationId is valid
      const presentationId = params.presentationId?.trim() || params.manualPresentationId?.trim()
      if (!presentationId) {
        throw new Error('Presentation ID is required')
      }

      // First, we'll read the presentation to get slide information
      return `https://slides.googleapis.com/v1/presentations/${presentationId}`
    },
    method: 'GET',
    headers: (params) => {
      // Validate access token
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  postProcess: async (result, params, _executeTool) => {
    if (!result.success) {
      return result
    }

    // Validate content
    if (!params.content) {
      throw new Error('Content is required')
    }

    const presentationId = params.presentationId?.trim() || params.manualPresentationId?.trim()

    if (!presentationId) {
      throw new Error('Presentation ID is required')
    }

    try {
      // Get the presentation data from the initial read
      const presentationData = await fetch(
        `https://slides.googleapis.com/v1/presentations/${presentationId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${params.accessToken}`,
          },
        }
      ).then((res) => res.json())

      const slideIndex = params.slideIndex || 0
      const slide = presentationData.slides?.[slideIndex]

      if (!slide) {
        throw new Error(`Slide at index ${slideIndex} not found`)
      }

      // Create requests to add content to the slide
      const textBoxId = `textbox_${Date.now()}`
      const requests = [
        {
          createShape: {
            objectId: textBoxId,
            shapeType: 'TEXT_BOX',
            elementProperties: {
              pageObjectId: slide.objectId,
              size: {
                width: {
                  magnitude: 400,
                  unit: 'PT',
                },
                height: {
                  magnitude: 100,
                  unit: 'PT',
                },
              },
              transform: {
                scaleX: 1,
                scaleY: 1,
                translateX: 50,
                translateY: 100,
                unit: 'PT',
              },
            },
          },
        },
        {
          insertText: {
            objectId: textBoxId,
            text: params.content,
            insertionIndex: 0,
          },
        },
      ]

      // Make the batchUpdate request
      const updateResponse = await fetch(
        `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${params.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ requests }),
        }
      )

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text()
        logger.error('Failed to update presentation:', { errorText })
        throw new Error('Failed to update presentation')
      }

      // Create presentation metadata
      const metadata = {
        presentationId,
        title: presentationData.title || 'Updated Presentation',
        mimeType: 'application/vnd.google-apps.presentation',
        url: `https://docs.google.com/presentation/d/${presentationId}/edit`,
      }

      return {
        success: true,
        output: {
          updatedContent: true,
          metadata,
        },
      }
    } catch (error) {
      logger.error('Error in postProcess:', { error })
      throw error
    }
  },

  outputs: {
    updatedContent: {
      type: 'boolean',
      description: 'Indicates if presentation content was updated successfully',
    },
    metadata: {
      type: 'json',
      description: 'Updated presentation metadata including ID, title, and URL',
    },
  },

  transformResponse: async (response: Response) => {
    // This is just for the initial read, the actual response comes from postProcess
    const data = await response.json()

    const metadata = {
      presentationId: data.presentationId,
      title: data.title || 'Presentation',
      mimeType: 'application/vnd.google-apps.presentation',
      url: `https://docs.google.com/presentation/d/${data.presentationId}/edit`,
    }

    return {
      success: true,
      output: {
        updatedContent: false,
        metadata,
      },
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_matters.ts]---
Location: sim-main/apps/sim/tools/google_vault/create_matters.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface GoogleVaultCreateMattersParams {
  accessToken: string
  name: string
  description?: string
}

// matters.create
// POST https://vault.googleapis.com/v1/matters
export const createMattersTool: ToolConfig<GoogleVaultCreateMattersParams> = {
  id: 'create_matters',
  name: 'Vault Create Matter',
  description: 'Create a new matter in Google Vault',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-vault',
  },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    name: { type: 'string', required: true, visibility: 'user-only' },
    description: { type: 'string', required: false, visibility: 'user-only' },
  },

  request: {
    url: () => `https://vault.googleapis.com/v1/matters`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => ({ name: params.name, description: params.description }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to create matter')
    }
    return { success: true, output: { matter: data } }
  },

  outputs: {
    matter: { type: 'json', description: 'Created matter object' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_matters_export.ts]---
Location: sim-main/apps/sim/tools/google_vault/create_matters_export.ts

```typescript
import type { GoogleVaultCreateMattersExportParams } from '@/tools/google_vault/types'
import type { ToolConfig } from '@/tools/types'

// matters.exports.create
// POST https://vault.googleapis.com/v1/matters/{matterId}/exports
export const createMattersExportTool: ToolConfig<GoogleVaultCreateMattersExportParams> = {
  id: 'create_matters_export',
  name: 'Vault Create Export (by Matter)',
  description: 'Create an export in a matter',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-vault',
  },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    matterId: { type: 'string', required: true, visibility: 'user-only' },
    exportName: { type: 'string', required: true, visibility: 'user-only' },
    corpus: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Data corpus to export (MAIL, DRIVE, GROUPS, HANGOUTS_CHAT, VOICE)',
    },
    accountEmails: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated list of user emails to scope export',
    },
    orgUnitId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Organization unit ID to scope export (alternative to emails)',
    },
  },

  request: {
    url: (params) => `https://vault.googleapis.com/v1/matters/${params.matterId}/exports`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      // Handle accountEmails - can be string (comma-separated) or array
      let emails: string[] = []
      if (params.accountEmails) {
        if (Array.isArray(params.accountEmails)) {
          emails = params.accountEmails
        } else if (typeof params.accountEmails === 'string') {
          emails = params.accountEmails
            .split(',')
            .map((e) => e.trim())
            .filter(Boolean)
        }
      }

      const scope =
        emails.length > 0
          ? { accountInfo: { emails } }
          : params.orgUnitId
            ? { orgUnitInfo: { orgUnitId: params.orgUnitId } }
            : {}

      const searchMethod = emails.length > 0 ? 'ACCOUNT' : params.orgUnitId ? 'ORG_UNIT' : undefined

      const query: any = {
        corpus: params.corpus,
        dataScope: 'ALL_DATA',
        searchMethod: searchMethod,
        terms: params.terms || undefined,
        startTime: params.startTime || undefined,
        endTime: params.endTime || undefined,
        timeZone: params.timeZone || undefined,
        ...scope,
      }

      return {
        name: params.exportName,
        query,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to create export')
    }
    return { success: true, output: { export: data } }
  },

  outputs: {
    export: { type: 'json', description: 'Created export object' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_matters_holds.ts]---
Location: sim-main/apps/sim/tools/google_vault/create_matters_holds.ts

```typescript
import type { GoogleVaultCreateMattersHoldsParams } from '@/tools/google_vault/types'
import type { ToolConfig } from '@/tools/types'

// matters.holds.create
// POST https://vault.googleapis.com/v1/matters/{matterId}/holds
export const createMattersHoldsTool: ToolConfig<GoogleVaultCreateMattersHoldsParams> = {
  id: 'create_matters_holds',
  name: 'Vault Create Hold (by Matter)',
  description: 'Create a hold in a matter',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-vault',
  },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    matterId: { type: 'string', required: true, visibility: 'user-only' },
    holdName: { type: 'string', required: true, visibility: 'user-only' },
    corpus: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Data corpus to hold (MAIL, DRIVE, GROUPS, HANGOUTS_CHAT, VOICE)',
    },
    accountEmails: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated list of user emails to put on hold',
    },
    orgUnitId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Organization unit ID to put on hold (alternative to accounts)',
    },
  },

  request: {
    url: (params) => `https://vault.googleapis.com/v1/matters/${params.matterId}/holds`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      // Build Hold body. One of accounts or orgUnit must be provided.
      const body: any = {
        name: params.holdName,
        corpus: params.corpus,
      }

      // Handle accountEmails - can be string (comma-separated) or array
      let emails: string[] = []
      if (params.accountEmails) {
        if (Array.isArray(params.accountEmails)) {
          emails = params.accountEmails
        } else if (typeof params.accountEmails === 'string') {
          emails = params.accountEmails
            .split(',')
            .map((e) => e.trim())
            .filter(Boolean)
        }
      }

      if (emails.length > 0) {
        // Google Vault expects HeldAccount objects with 'email' or 'accountId'. Use 'email' here.
        body.accounts = emails.map((email: string) => ({ email }))
      } else if (params.orgUnitId) {
        body.orgUnit = { orgUnitId: params.orgUnitId }
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to create hold')
    }
    return { success: true, output: { hold: data } }
  },

  outputs: {
    hold: { type: 'json', description: 'Created hold object' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: download_export_file.ts]---
Location: sim-main/apps/sim/tools/google_vault/download_export_file.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('GoogleVaultDownloadExportFileTool')

interface DownloadParams {
  accessToken: string
  matterId: string
  bucketName: string
  objectName: string
  fileName?: string
}

export const downloadExportFileTool: ToolConfig<DownloadParams> = {
  id: 'google_vault_download_export_file',
  name: 'Vault Download Export File',
  description: 'Download a single file from a Google Vault export (GCS object)',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-vault',
  },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    matterId: { type: 'string', required: true, visibility: 'user-only' },
    bucketName: { type: 'string', required: true, visibility: 'user-only' },
    objectName: { type: 'string', required: true, visibility: 'user-only' },
    fileName: { type: 'string', required: false, visibility: 'user-only' },
  },

  request: {
    url: (params) => {
      const bucket = encodeURIComponent(params.bucketName)
      const object = encodeURIComponent(params.objectName)
      // Use GCS media endpoint directly; framework will prefetch token and inject accessToken
      return `https://storage.googleapis.com/storage/v1/b/${bucket}/o/${object}?alt=media`
    },
    method: 'GET',
    headers: (params) => ({
      // Access token is injected by the tools framework when 'credential' is present
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response: Response, params?: DownloadParams) => {
    if (!response.ok) {
      let details: any
      try {
        details = await response.json()
      } catch {
        try {
          const text = await response.text()
          details = { error: text }
        } catch {
          details = undefined
        }
      }
      throw new Error(details?.error || `Failed to download Vault export file (${response.status})`)
    }

    // Since we're just doing a HEAD request to verify access, we need to fetch the actual file
    if (!params?.accessToken || !params?.bucketName || !params?.objectName) {
      throw new Error('Missing required parameters for download')
    }

    const bucket = encodeURIComponent(params.bucketName)
    const object = encodeURIComponent(params.objectName)
    const downloadUrl = `https://storage.googleapis.com/storage/v1/b/${bucket}/o/${object}?alt=media`

    // Fetch the actual file content
    const downloadResponse = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    })

    if (!downloadResponse.ok) {
      const errorText = await downloadResponse.text().catch(() => '')
      throw new Error(`Failed to download file: ${errorText || downloadResponse.statusText}`)
    }

    const contentType = downloadResponse.headers.get('content-type') || 'application/octet-stream'
    const disposition = downloadResponse.headers.get('content-disposition') || ''
    const match = disposition.match(/filename\*=UTF-8''([^;]+)|filename="([^"]+)"/)

    let resolvedName = params.fileName
    if (!resolvedName) {
      if (match?.[1]) {
        try {
          resolvedName = decodeURIComponent(match[1])
        } catch {
          resolvedName = match[1]
        }
      } else if (match?.[2]) {
        resolvedName = match[2]
      } else if (params.objectName) {
        const parts = params.objectName.split('/')
        resolvedName = parts[parts.length - 1] || 'vault-export.bin'
      } else {
        resolvedName = 'vault-export.bin'
      }
    }

    // Get the file as an array buffer and convert to Buffer
    const arrayBuffer = await downloadResponse.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return {
      success: true,
      output: {
        file: {
          name: resolvedName,
          mimeType: contentType,
          data: buffer,
          size: buffer.length,
        },
      },
    }
  },

  outputs: {
    file: { type: 'file', description: 'Downloaded Vault export file stored in execution files' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/google_vault/index.ts

```typescript
export { createMattersTool } from '@/tools/google_vault/create_matters'
export { createMattersExportTool } from '@/tools/google_vault/create_matters_export'
export { createMattersHoldsTool } from '@/tools/google_vault/create_matters_holds'
export { downloadExportFileTool } from '@/tools/google_vault/download_export_file'
export { listMattersTool } from '@/tools/google_vault/list_matters'
export { listMattersExportTool } from '@/tools/google_vault/list_matters_export'
export { listMattersHoldsTool } from '@/tools/google_vault/list_matters_holds'
```

--------------------------------------------------------------------------------

---[FILE: list_matters.ts]---
Location: sim-main/apps/sim/tools/google_vault/list_matters.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface GoogleVaultListMattersParams {
  accessToken: string
  pageSize?: number
  pageToken?: string
  matterId?: string // Optional get for a specific matter
}

export const listMattersTool: ToolConfig<GoogleVaultListMattersParams> = {
  id: 'list_matters',
  name: 'Vault List Matters',
  description: 'List matters, or get a specific matter if matterId is provided',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-vault',
  },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    pageSize: { type: 'number', required: false, visibility: 'user-only' },
    pageToken: { type: 'string', required: false, visibility: 'hidden' },
    matterId: { type: 'string', required: false, visibility: 'user-only' },
  },

  request: {
    url: (params) => {
      if (params.matterId) {
        return `https://vault.googleapis.com/v1/matters/${params.matterId}`
      }
      const url = new URL('https://vault.googleapis.com/v1/matters')
      if (params.pageSize !== undefined && params.pageSize !== null) {
        const pageSize = Number(params.pageSize)
        if (Number.isFinite(pageSize) && pageSize > 0) {
          url.searchParams.set('pageSize', String(pageSize))
        }
      }
      if (params.pageToken) url.searchParams.set('pageToken', params.pageToken)
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({ Authorization: `Bearer ${params.accessToken}` }),
  },

  transformResponse: async (response: Response, params?: GoogleVaultListMattersParams) => {
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to list matters')
    }
    if (params?.matterId) {
      return { success: true, output: { matter: data } }
    }
    return { success: true, output: data }
  },

  outputs: {
    matters: { type: 'json', description: 'Array of matter objects' },
    matter: { type: 'json', description: 'Single matter object (when matterId is provided)' },
    nextPageToken: { type: 'string', description: 'Token for fetching next page of results' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_matters_export.ts]---
Location: sim-main/apps/sim/tools/google_vault/list_matters_export.ts

```typescript
import type { GoogleVaultListMattersExportParams } from '@/tools/google_vault/types'
import type { ToolConfig } from '@/tools/types'

export const listMattersExportTool: ToolConfig<GoogleVaultListMattersExportParams> = {
  id: 'list_matters_export',
  name: 'Vault List Exports (by Matter)',
  description: 'List exports for a matter',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-vault',
  },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    matterId: { type: 'string', required: true, visibility: 'user-only' },
    pageSize: { type: 'number', required: false, visibility: 'user-only' },
    pageToken: { type: 'string', required: false, visibility: 'hidden' },
    exportId: { type: 'string', required: false, visibility: 'user-only' },
  },

  request: {
    url: (params) => {
      if (params.exportId) {
        return `https://vault.googleapis.com/v1/matters/${params.matterId}/exports/${params.exportId}`
      }
      const url = new URL(`https://vault.googleapis.com/v1/matters/${params.matterId}/exports`)
      if (params.pageSize !== undefined && params.pageSize !== null) {
        const pageSize = Number(params.pageSize)
        if (Number.isFinite(pageSize) && pageSize > 0) {
          url.searchParams.set('pageSize', String(pageSize))
        }
      }
      if (params.pageToken) url.searchParams.set('pageToken', params.pageToken)
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({ Authorization: `Bearer ${params.accessToken}` }),
  },

  transformResponse: async (response: Response, params?: GoogleVaultListMattersExportParams) => {
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to list exports')
    }
    if (params?.exportId) {
      return { success: true, output: { export: data } }
    }
    return { success: true, output: data }
  },

  outputs: {
    exports: { type: 'json', description: 'Array of export objects' },
    export: { type: 'json', description: 'Single export object (when exportId is provided)' },
    nextPageToken: { type: 'string', description: 'Token for fetching next page of results' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_matters_holds.ts]---
Location: sim-main/apps/sim/tools/google_vault/list_matters_holds.ts

```typescript
import type { GoogleVaultListMattersHoldsParams } from '@/tools/google_vault/types'
import type { ToolConfig } from '@/tools/types'

export const listMattersHoldsTool: ToolConfig<GoogleVaultListMattersHoldsParams> = {
  id: 'list_matters_holds',
  name: 'Vault List Holds (by Matter)',
  description: 'List holds for a matter',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-vault',
  },

  params: {
    accessToken: { type: 'string', required: true, visibility: 'hidden' },
    matterId: { type: 'string', required: true, visibility: 'user-only' },
    pageSize: { type: 'number', required: false, visibility: 'user-only' },
    pageToken: { type: 'string', required: false, visibility: 'hidden' },
    holdId: { type: 'string', required: false, visibility: 'user-only' },
  },

  request: {
    url: (params) => {
      if (params.holdId) {
        return `https://vault.googleapis.com/v1/matters/${params.matterId}/holds/${params.holdId}`
      }
      const url = new URL(`https://vault.googleapis.com/v1/matters/${params.matterId}/holds`)
      if (params.pageSize !== undefined && params.pageSize !== null) {
        const pageSize = Number(params.pageSize)
        if (Number.isFinite(pageSize) && pageSize > 0) {
          url.searchParams.set('pageSize', String(pageSize))
        }
      }
      if (params.pageToken) url.searchParams.set('pageToken', params.pageToken)
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({ Authorization: `Bearer ${params.accessToken}` }),
  },

  transformResponse: async (response: Response, params?: GoogleVaultListMattersHoldsParams) => {
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to list holds')
    }
    if (params?.holdId) {
      return { success: true, output: { hold: data } }
    }
    return { success: true, output: data }
  },

  outputs: {
    holds: { type: 'json', description: 'Array of hold objects' },
    hold: { type: 'json', description: 'Single hold object (when holdId is provided)' },
    nextPageToken: { type: 'string', description: 'Token for fetching next page of results' },
  },
}
```

--------------------------------------------------------------------------------

````
