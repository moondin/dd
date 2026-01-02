---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 774
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 774 of 933)

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

---[FILE: send_message.ts]---
Location: sim-main/apps/sim/tools/whatsapp/send_message.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { WhatsAppResponse, WhatsAppSendMessageParams } from '@/tools/whatsapp/types'

export const sendMessageTool: ToolConfig<WhatsAppSendMessageParams, WhatsAppResponse> = {
  id: 'whatsapp_send_message',
  name: 'WhatsApp',
  description: 'Send WhatsApp messages',
  version: '1.0.0',

  params: {
    phoneNumber: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Recipient phone number with country code',
    },
    message: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Message content to send',
    },
    phoneNumberId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'WhatsApp Business Phone Number ID',
    },
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'WhatsApp Business API Access Token',
    },
  },

  request: {
    url: (params) => {
      if (!params.phoneNumberId) {
        throw new Error('WhatsApp Phone Number ID is required')
      }
      return `https://graph.facebook.com/v22.0/${params.phoneNumberId}/messages`
    },
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('WhatsApp Access Token is required')
      }
      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      // Check if required parameters exist
      if (!params.phoneNumber) {
        throw new Error('Phone number is required but was not provided')
      }

      if (!params.message) {
        throw new Error('Message content is required but was not provided')
      }

      // Format the phone number (remove + if present)
      const formattedPhoneNumber = params.phoneNumber.startsWith('+')
        ? params.phoneNumber.substring(1)
        : params.phoneNumber

      return {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formattedPhoneNumber,
        type: 'text',
        text: {
          body: params.message,
        },
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        success: true,
        messageId: data.messages?.[0]?.id,
        phoneNumber: '',
        status: '',
        timestamp: '',
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'WhatsApp message send success status' },
    messageId: { type: 'string', description: 'Unique WhatsApp message identifier' },
    phoneNumber: { type: 'string', description: 'Recipient phone number' },
    status: { type: 'string', description: 'Message delivery status' },
    timestamp: { type: 'string', description: 'Message send timestamp' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/whatsapp/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface WhatsAppSendMessageParams {
  phoneNumber: string
  message: string
  phoneNumberId: string
  accessToken: string
}

export interface WhatsAppResponse extends ToolResponse {
  output: {
    success: boolean
    messageId?: string
    error?: string
  }
}
```

--------------------------------------------------------------------------------

---[FILE: content.ts]---
Location: sim-main/apps/sim/tools/wikipedia/content.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type {
  WikipediaPageContentParams,
  WikipediaPageContentResponse,
} from '@/tools/wikipedia/types'

export const pageContentTool: ToolConfig<WikipediaPageContentParams, WikipediaPageContentResponse> =
  {
    id: 'wikipedia_content',
    name: 'Wikipedia Page Content',
    description: 'Get the full HTML content of a Wikipedia page.',
    version: '1.0.0',

    params: {
      pageTitle: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'Title of the Wikipedia page to get content for',
      },
    },

    request: {
      url: (params: WikipediaPageContentParams) => {
        const encodedTitle = encodeURIComponent(params.pageTitle.replace(/ /g, '_'))
        return `https://en.wikipedia.org/api/rest_v1/page/html/${encodedTitle}`
      },
      method: 'GET',
      headers: () => ({
        'User-Agent': 'SimStudio/1.0 (https://sim.ai)',
        Accept:
          'text/html; charset=utf-8; profile="https://www.mediawiki.org/wiki/Specs/HTML/2.1.0"',
      }),
    },

    transformResponse: async (response: Response) => {
      const html = await response.text()

      // Extract metadata from response headers
      const revision = response.headers.get('etag')?.match(/^"(\d+)/)?.[1] || '0'
      const timestamp = response.headers.get('last-modified') || new Date().toISOString()

      return {
        success: true,
        output: {
          content: {
            title: '', // Will be filled by the calling code
            pageid: 0, // Not available from this endpoint
            html: html,
            revision: Number.parseInt(revision, 10),
            tid: response.headers.get('etag') || '',
            timestamp: timestamp,
            content_model: 'wikitext',
            content_format: 'text/html',
          },
        },
      }
    },

    outputs: {
      content: {
        type: 'object',
        description: 'Full HTML content and metadata of the Wikipedia page',
        properties: {
          title: { type: 'string', description: 'Page title' },
          pageid: { type: 'number', description: 'Wikipedia page ID' },
          html: { type: 'string', description: 'Full HTML content of the page' },
          revision: { type: 'number', description: 'Page revision number' },
          timestamp: { type: 'string', description: 'Last modified timestamp' },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/wikipedia/index.ts

```typescript
import { pageContentTool } from '@/tools/wikipedia/content'
import { randomPageTool } from '@/tools/wikipedia/random'
import { searchTool } from '@/tools/wikipedia/search'
import { pageSummaryTool } from '@/tools/wikipedia/summary'

export const wikipediaPageSummaryTool = pageSummaryTool
export const wikipediaSearchTool = searchTool
export const wikipediaPageContentTool = pageContentTool
export const wikipediaRandomPageTool = randomPageTool
```

--------------------------------------------------------------------------------

---[FILE: random.ts]---
Location: sim-main/apps/sim/tools/wikipedia/random.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { WikipediaRandomPageResponse } from '@/tools/wikipedia/types'

export const randomPageTool: ToolConfig<Record<string, never>, WikipediaRandomPageResponse> = {
  id: 'wikipedia_random',
  name: 'Wikipedia Random Page',
  description: 'Get a random Wikipedia page.',
  version: '1.0.0',

  params: {},

  request: {
    url: () => {
      return 'https://en.wikipedia.org/api/rest_v1/page/random/summary'
    },
    method: 'GET',
    headers: () => ({
      'User-Agent': 'SimStudio/1.0 (https://sim.ai)',
      Accept: 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        randomPage: {
          type: data.type || '',
          title: data.title || '',
          displaytitle: data.displaytitle || data.title || '',
          description: data.description,
          extract: data.extract || '',
          thumbnail: data.thumbnail,
          content_urls: data.content_urls || { desktop: { page: '' }, mobile: { page: '' } },
          lang: data.lang || '',
          timestamp: data.timestamp || '',
          pageid: data.pageid || 0,
        },
      },
    }
  },

  outputs: {
    randomPage: {
      type: 'object',
      description: 'Random Wikipedia page data',
      properties: {
        title: { type: 'string', description: 'Page title' },
        extract: { type: 'string', description: 'Page extract/summary' },
        description: { type: 'string', description: 'Page description', optional: true },
        thumbnail: { type: 'object', description: 'Thumbnail image data', optional: true },
        content_urls: { type: 'object', description: 'URLs to access the page' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search.ts]---
Location: sim-main/apps/sim/tools/wikipedia/search.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { WikipediaSearchParams, WikipediaSearchResponse } from '@/tools/wikipedia/types'

export const searchTool: ToolConfig<WikipediaSearchParams, WikipediaSearchResponse> = {
  id: 'wikipedia_search',
  name: 'Wikipedia Search',
  description: 'Search for Wikipedia pages by title or content.',
  version: '1.0.0',

  params: {
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Search query to find Wikipedia pages',
    },
    searchLimit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of results to return (default: 10, max: 50)',
    },
  },

  request: {
    url: (params: WikipediaSearchParams) => {
      const baseUrl = 'https://en.wikipedia.org/w/api.php'
      const searchParams = new URLSearchParams()

      searchParams.append('action', 'opensearch')
      searchParams.append('search', params.query)
      searchParams.append('format', 'json')
      searchParams.append('namespace', '0')
      if (params.searchLimit) {
        searchParams.append('limit', Math.min(Number(params.searchLimit), 50).toString())
      } else {
        searchParams.append('limit', '10')
      }

      return `${baseUrl}?${searchParams.toString()}`
    },
    method: 'GET',
    headers: () => ({
      'User-Agent': 'SimStudio/1.0 (https://sim.ai)',
      Accept: 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    const [searchTerm, titles, descriptions, urls] = data
    const searchResults = titles.map((title: string, index: number) => ({
      id: index,
      key: title.replace(/ /g, '_'),
      title: title,
      excerpt: descriptions[index] || '',
      matched_title: title,
      description: descriptions[index] || '',
      thumbnail: undefined, // OpenSearch doesn't provide thumbnails
      url: urls[index] || '',
    }))

    return {
      success: true,
      output: {
        searchResults,
        totalHits: titles.length,
        query: searchTerm,
      },
    }
  },

  outputs: {
    searchResults: {
      type: 'array',
      description: 'Array of matching Wikipedia pages',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          excerpt: { type: 'string' },
          url: { type: 'string' },
        },
      },
    },
    totalHits: {
      type: 'number',
      description: 'Total number of search results found',
    },
    query: {
      type: 'string',
      description: 'The search query that was executed',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: summary.ts]---
Location: sim-main/apps/sim/tools/wikipedia/summary.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type {
  WikipediaPageSummaryParams,
  WikipediaPageSummaryResponse,
} from '@/tools/wikipedia/types'

export const pageSummaryTool: ToolConfig<WikipediaPageSummaryParams, WikipediaPageSummaryResponse> =
  {
    id: 'wikipedia_summary',
    name: 'Wikipedia Page Summary',
    description: 'Get a summary and metadata for a specific Wikipedia page.',
    version: '1.0.0',

    params: {
      pageTitle: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'Title of the Wikipedia page to get summary for',
      },
    },

    request: {
      url: (params: WikipediaPageSummaryParams) => {
        const encodedTitle = encodeURIComponent(params.pageTitle.replace(/ /g, '_'))
        return `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedTitle}`
      },
      method: 'GET',
      headers: () => ({
        'User-Agent': 'SimStudio/1.0 (https://sim.ai)',
        Accept: 'application/json',
      }),
    },

    transformResponse: async (response: Response) => {
      const data = await response.json()

      return {
        success: true,
        output: {
          summary: {
            type: data.type || '',
            title: data.title || '',
            displaytitle: data.displaytitle || data.title || '',
            description: data.description,
            extract: data.extract || '',
            extract_html: data.extract_html,
            thumbnail: data.thumbnail,
            originalimage: data.originalimage,
            content_urls: data.content_urls || {
              desktop: { page: '', revisions: '', edit: '', talk: '' },
              mobile: { page: '', revisions: '', edit: '', talk: '' },
            },
            lang: data.lang || '',
            dir: data.dir || 'ltr',
            timestamp: data.timestamp || '',
            pageid: data.pageid || 0,
            wikibase_item: data.wikibase_item,
            coordinates: data.coordinates,
          },
        },
      }
    },

    outputs: {
      summary: {
        type: 'object',
        description: 'Wikipedia page summary and metadata',
        properties: {
          title: { type: 'string', description: 'Page title' },
          extract: { type: 'string', description: 'Page extract/summary text' },
          description: { type: 'string', description: 'Short page description', optional: true },
          thumbnail: { type: 'object', description: 'Thumbnail image data', optional: true },
          content_urls: { type: 'object', description: 'URLs to access the page' },
          pageid: { type: 'number', description: 'Wikipedia page ID' },
        },
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/wikipedia/types.ts

```typescript
// Common types for Wikipedia tools
import type { ToolResponse } from '@/tools/types'

// Page Summary tool types
export interface WikipediaPageSummaryParams {
  pageTitle: string
}

export interface WikipediaPageSummary {
  type: string
  title: string
  displaytitle: string
  description?: string
  extract: string
  extract_html?: string
  thumbnail?: {
    source: string
    width: number
    height: number
  }
  originalimage?: {
    source: string
    width: number
    height: number
  }
  content_urls: {
    desktop: {
      page: string
      revisions: string
      edit: string
      talk: string
    }
    mobile: {
      page: string
      revisions: string
      edit: string
      talk: string
    }
  }
  lang: string
  dir: string
  timestamp: string
  pageid: number
  wikibase_item?: string
  coordinates?: {
    lat: number
    lon: number
  }
}

export interface WikipediaPageSummaryResponse extends ToolResponse {
  output: {
    summary: WikipediaPageSummary
  }
}

// Search Pages tool types
export interface WikipediaSearchParams {
  query: string
  searchLimit?: number
}

export interface WikipediaSearchResult {
  id: number
  key: string
  title: string
  excerpt: string
  matched_title?: string
  description?: string
  thumbnail?: {
    mimetype: string
    size?: number
    width: number
    height: number
    duration?: number
    url: string
  }
  url: string
}

export interface WikipediaSearchResponse extends ToolResponse {
  output: {
    searchResults: WikipediaSearchResult[]
    totalHits: number
    query: string
  }
}

// Get Page Content tool types
export interface WikipediaPageContentParams {
  pageTitle: string
}

export interface WikipediaPageContent {
  title: string
  pageid: number
  html: string
  revision: number
  tid: string
  timestamp: string
  content_model: string
  content_format: string
}

export interface WikipediaPageContentResponse extends ToolResponse {
  output: {
    content: WikipediaPageContent
  }
}

// Random Page tool types
export interface WikipediaRandomPage {
  type: string
  title: string
  displaytitle: string
  description?: string
  extract: string
  thumbnail?: {
    source: string
    width: number
    height: number
  }
  content_urls: {
    desktop: {
      page: string
    }
    mobile: {
      page: string
    }
  }
  lang: string
  timestamp: string
  pageid: number
}

export interface WikipediaRandomPageResponse extends ToolResponse {
  output: {
    randomPage: WikipediaRandomPage
  }
}

export type WikipediaResponse =
  | WikipediaPageSummaryResponse
  | WikipediaSearchResponse
  | WikipediaPageContentResponse
  | WikipediaRandomPageResponse
```

--------------------------------------------------------------------------------

---[FILE: create_category.ts]---
Location: sim-main/apps/sim/tools/wordpress/create_category.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressCreateCategoryParams,
  type WordPressCreateCategoryResponse,
} from './types'

export const createCategoryTool: ToolConfig<
  WordPressCreateCategoryParams,
  WordPressCreateCategoryResponse
> = {
  id: 'wordpress_create_category',
  name: 'WordPress Create Category',
  description: 'Create a new category in WordPress.com',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'wordpress',
    requiredScopes: ['global'],
  },

  params: {
    siteId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'WordPress.com site ID or domain (e.g., 12345678 or mysite.wordpress.com)',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Category name',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Category description',
    },
    parent: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Parent category ID for hierarchical categories',
    },
    slug: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'URL slug for the category',
    },
  },

  request: {
    url: (params) => `${WORDPRESS_COM_API_BASE}/${params.siteId}/categories`,
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        name: params.name,
      }

      if (params.description) body.description = params.description
      if (params.parent) body.parent = params.parent
      if (params.slug) body.slug = params.slug

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `WordPress API error: ${response.status}`)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        category: {
          id: data.id,
          count: data.count,
          description: data.description,
          link: data.link,
          name: data.name,
          slug: data.slug,
          taxonomy: data.taxonomy,
          parent: data.parent,
        },
      },
    }
  },

  outputs: {
    category: {
      type: 'object',
      description: 'The created category',
      properties: {
        id: { type: 'number', description: 'Category ID' },
        count: { type: 'number', description: 'Number of posts in this category' },
        description: { type: 'string', description: 'Category description' },
        link: { type: 'string', description: 'Category archive URL' },
        name: { type: 'string', description: 'Category name' },
        slug: { type: 'string', description: 'Category slug' },
        taxonomy: { type: 'string', description: 'Taxonomy name' },
        parent: { type: 'number', description: 'Parent category ID' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_comment.ts]---
Location: sim-main/apps/sim/tools/wordpress/create_comment.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressCreateCommentParams,
  type WordPressCreateCommentResponse,
} from './types'

export const createCommentTool: ToolConfig<
  WordPressCreateCommentParams,
  WordPressCreateCommentResponse
> = {
  id: 'wordpress_create_comment',
  name: 'WordPress Create Comment',
  description: 'Create a new comment on a WordPress.com post',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'wordpress',
    requiredScopes: ['global'],
  },

  params: {
    siteId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'WordPress.com site ID or domain (e.g., 12345678 or mysite.wordpress.com)',
    },
    postId: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the post to comment on',
    },
    content: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comment content',
    },
    parent: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Parent comment ID for replies',
    },
    authorName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comment author display name',
    },
    authorEmail: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comment author email',
    },
    authorUrl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comment author URL',
    },
  },

  request: {
    url: (params) => `${WORDPRESS_COM_API_BASE}/${params.siteId}/comments`,
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        post: params.postId,
        content: params.content,
      }

      if (params.parent) body.parent = params.parent
      if (params.authorName) body.author_name = params.authorName
      if (params.authorEmail) body.author_email = params.authorEmail
      if (params.authorUrl) body.author_url = params.authorUrl

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `WordPress API error: ${response.status}`)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        comment: {
          id: data.id,
          post: data.post,
          parent: data.parent,
          author: data.author,
          author_name: data.author_name,
          author_email: data.author_email,
          author_url: data.author_url,
          date: data.date,
          content: data.content,
          link: data.link,
          status: data.status,
        },
      },
    }
  },

  outputs: {
    comment: {
      type: 'object',
      description: 'The created comment',
      properties: {
        id: { type: 'number', description: 'Comment ID' },
        post: { type: 'number', description: 'Post ID' },
        parent: { type: 'number', description: 'Parent comment ID' },
        author: { type: 'number', description: 'Author user ID' },
        author_name: { type: 'string', description: 'Author display name' },
        author_email: { type: 'string', description: 'Author email' },
        author_url: { type: 'string', description: 'Author URL' },
        date: { type: 'string', description: 'Comment date' },
        content: { type: 'object', description: 'Comment content object' },
        link: { type: 'string', description: 'Comment permalink' },
        status: { type: 'string', description: 'Comment status' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_page.ts]---
Location: sim-main/apps/sim/tools/wordpress/create_page.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressCreatePageParams,
  type WordPressCreatePageResponse,
} from './types'

export const createPageTool: ToolConfig<WordPressCreatePageParams, WordPressCreatePageResponse> = {
  id: 'wordpress_create_page',
  name: 'WordPress Create Page',
  description: 'Create a new page in WordPress.com',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'wordpress',
    requiredScopes: ['global'],
  },

  params: {
    siteId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'WordPress.com site ID or domain (e.g., 12345678 or mysite.wordpress.com)',
    },
    title: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Page title',
    },
    content: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Page content (HTML or plain text)',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Page status: publish, draft, pending, private',
    },
    excerpt: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Page excerpt',
    },
    parent: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Parent page ID for hierarchical pages',
    },
    menuOrder: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Order in page menu',
    },
    featuredMedia: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Featured image media ID',
    },
    slug: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'URL slug for the page',
    },
  },

  request: {
    url: (params) => `${WORDPRESS_COM_API_BASE}/${params.siteId}/pages`,
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        title: params.title,
      }

      if (params.content) body.content = params.content
      if (params.status) body.status = params.status
      if (params.excerpt) body.excerpt = params.excerpt
      if (params.slug) body.slug = params.slug
      if (params.parent) body.parent = params.parent
      if (params.menuOrder) body.menu_order = params.menuOrder
      if (params.featuredMedia) body.featured_media = params.featuredMedia

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `WordPress API error: ${response.status}`)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        page: {
          id: data.id,
          date: data.date,
          modified: data.modified,
          slug: data.slug,
          status: data.status,
          type: data.type,
          link: data.link,
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          author: data.author,
          featured_media: data.featured_media,
          parent: data.parent,
          menu_order: data.menu_order,
        },
      },
    }
  },

  outputs: {
    page: {
      type: 'object',
      description: 'The created page',
      properties: {
        id: { type: 'number', description: 'Page ID' },
        date: { type: 'string', description: 'Page creation date' },
        modified: { type: 'string', description: 'Page modification date' },
        slug: { type: 'string', description: 'Page slug' },
        status: { type: 'string', description: 'Page status' },
        type: { type: 'string', description: 'Content type' },
        link: { type: 'string', description: 'Page URL' },
        title: { type: 'object', description: 'Page title object' },
        content: { type: 'object', description: 'Page content object' },
        excerpt: { type: 'object', description: 'Page excerpt object' },
        author: { type: 'number', description: 'Author ID' },
        featured_media: { type: 'number', description: 'Featured media ID' },
        parent: { type: 'number', description: 'Parent page ID' },
        menu_order: { type: 'number', description: 'Menu order' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_post.ts]---
Location: sim-main/apps/sim/tools/wordpress/create_post.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressCreatePostParams,
  type WordPressCreatePostResponse,
} from './types'

export const createPostTool: ToolConfig<WordPressCreatePostParams, WordPressCreatePostResponse> = {
  id: 'wordpress_create_post',
  name: 'WordPress Create Post',
  description: 'Create a new blog post in WordPress.com',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'wordpress',
    requiredScopes: ['global'],
  },

  params: {
    siteId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'WordPress.com site ID or domain (e.g., 12345678 or mysite.wordpress.com)',
    },
    title: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Post title',
    },
    content: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Post content (HTML or plain text)',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Post status: publish, draft, pending, private, or future',
    },
    excerpt: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Post excerpt',
    },
    categories: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated category IDs',
    },
    tags: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated tag IDs',
    },
    featuredMedia: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Featured image media ID',
    },
    slug: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'URL slug for the post',
    },
  },

  request: {
    url: (params) => `${WORDPRESS_COM_API_BASE}/${params.siteId}/posts`,
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        title: params.title,
      }

      if (params.content) body.content = params.content
      if (params.status) body.status = params.status
      if (params.excerpt) body.excerpt = params.excerpt
      if (params.slug) body.slug = params.slug
      if (params.featuredMedia) body.featured_media = params.featuredMedia

      if (params.categories) {
        body.categories = params.categories
          .split(',')
          .map((id: string) => Number.parseInt(id.trim(), 10))
          .filter((id: number) => !Number.isNaN(id))
      }

      if (params.tags) {
        body.tags = params.tags
          .split(',')
          .map((id: string) => Number.parseInt(id.trim(), 10))
          .filter((id: number) => !Number.isNaN(id))
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `WordPress API error: ${response.status}`)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        post: {
          id: data.id,
          date: data.date,
          modified: data.modified,
          slug: data.slug,
          status: data.status,
          type: data.type,
          link: data.link,
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          author: data.author,
          featured_media: data.featured_media,
          categories: data.categories || [],
          tags: data.tags || [],
        },
      },
    }
  },

  outputs: {
    post: {
      type: 'object',
      description: 'The created post',
      properties: {
        id: { type: 'number', description: 'Post ID' },
        date: { type: 'string', description: 'Post creation date' },
        modified: { type: 'string', description: 'Post modification date' },
        slug: { type: 'string', description: 'Post slug' },
        status: { type: 'string', description: 'Post status' },
        type: { type: 'string', description: 'Post type' },
        link: { type: 'string', description: 'Post URL' },
        title: { type: 'object', description: 'Post title object' },
        content: { type: 'object', description: 'Post content object' },
        excerpt: { type: 'object', description: 'Post excerpt object' },
        author: { type: 'number', description: 'Author ID' },
        featured_media: { type: 'number', description: 'Featured media ID' },
        categories: { type: 'array', description: 'Category IDs' },
        tags: { type: 'array', description: 'Tag IDs' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_tag.ts]---
Location: sim-main/apps/sim/tools/wordpress/create_tag.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressCreateTagParams,
  type WordPressCreateTagResponse,
} from './types'

export const createTagTool: ToolConfig<WordPressCreateTagParams, WordPressCreateTagResponse> = {
  id: 'wordpress_create_tag',
  name: 'WordPress Create Tag',
  description: 'Create a new tag in WordPress.com',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'wordpress',
    requiredScopes: ['global'],
  },

  params: {
    siteId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'WordPress.com site ID or domain (e.g., 12345678 or mysite.wordpress.com)',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Tag name',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Tag description',
    },
    slug: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'URL slug for the tag',
    },
  },

  request: {
    url: (params) => `${WORDPRESS_COM_API_BASE}/${params.siteId}/tags`,
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        name: params.name,
      }

      if (params.description) body.description = params.description
      if (params.slug) body.slug = params.slug

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `WordPress API error: ${response.status}`)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        tag: {
          id: data.id,
          count: data.count,
          description: data.description,
          link: data.link,
          name: data.name,
          slug: data.slug,
          taxonomy: data.taxonomy,
        },
      },
    }
  },

  outputs: {
    tag: {
      type: 'object',
      description: 'The created tag',
      properties: {
        id: { type: 'number', description: 'Tag ID' },
        count: { type: 'number', description: 'Number of posts with this tag' },
        description: { type: 'string', description: 'Tag description' },
        link: { type: 'string', description: 'Tag archive URL' },
        name: { type: 'string', description: 'Tag name' },
        slug: { type: 'string', description: 'Tag slug' },
        taxonomy: { type: 'string', description: 'Taxonomy name' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
