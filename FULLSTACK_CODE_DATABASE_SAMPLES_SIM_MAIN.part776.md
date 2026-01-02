---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 776
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 776 of 933)

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

---[FILE: list_comments.ts]---
Location: sim-main/apps/sim/tools/wordpress/list_comments.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressListCommentsParams,
  type WordPressListCommentsResponse,
} from './types'

export const listCommentsTool: ToolConfig<
  WordPressListCommentsParams,
  WordPressListCommentsResponse
> = {
  id: 'wordpress_list_comments',
  name: 'WordPress List Comments',
  description: 'List comments from WordPress.com with optional filters',
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
    perPage: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of comments per request (default: 10, max: 100)',
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Page number for pagination',
    },
    postId: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Filter by post ID',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by comment status: approved, hold, spam, trash',
    },
    search: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Search term to filter comments',
    },
    orderBy: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Order by field: date, id, parent',
    },
    order: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Order direction: asc or desc',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()

      if (params.perPage) queryParams.append('per_page', String(params.perPage))
      if (params.page) queryParams.append('page', String(params.page))
      if (params.postId) queryParams.append('post', String(params.postId))
      if (params.status) queryParams.append('status', params.status)
      if (params.search) queryParams.append('search', params.search)
      if (params.orderBy) queryParams.append('orderby', params.orderBy)
      if (params.order) queryParams.append('order', params.order)

      const queryString = queryParams.toString()
      return `${WORDPRESS_COM_API_BASE}/${params.siteId}/comments${queryString ? `?${queryString}` : ''}`
    },
    method: 'GET',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `WordPress API error: ${response.status}`)
    }

    const data = await response.json()
    const total = Number.parseInt(response.headers.get('X-WP-Total') || '0', 10)
    const totalPages = Number.parseInt(response.headers.get('X-WP-TotalPages') || '0', 10)

    return {
      success: true,
      output: {
        comments: data.map((comment: any) => ({
          id: comment.id,
          post: comment.post,
          parent: comment.parent,
          author: comment.author,
          author_name: comment.author_name,
          author_email: comment.author_email,
          author_url: comment.author_url,
          date: comment.date,
          content: comment.content,
          link: comment.link,
          status: comment.status,
        })),
        total,
        totalPages,
      },
    }
  },

  outputs: {
    comments: {
      type: 'array',
      description: 'List of comments',
      items: {
        type: 'object',
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
    total: {
      type: 'number',
      description: 'Total number of comments',
    },
    totalPages: {
      type: 'number',
      description: 'Total number of result pages',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_media.ts]---
Location: sim-main/apps/sim/tools/wordpress/list_media.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressListMediaParams,
  type WordPressListMediaResponse,
} from './types'

export const listMediaTool: ToolConfig<WordPressListMediaParams, WordPressListMediaResponse> = {
  id: 'wordpress_list_media',
  name: 'WordPress List Media',
  description: 'List media items from the WordPress.com media library',
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
    perPage: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of media items per request (default: 10, max: 100)',
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Page number for pagination',
    },
    search: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Search term to filter media',
    },
    mediaType: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by media type: image, video, audio, application',
    },
    mimeType: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by specific MIME type (e.g., image/jpeg)',
    },
    orderBy: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Order by field: date, id, title, slug',
    },
    order: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Order direction: asc or desc',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()

      if (params.perPage) queryParams.append('per_page', String(params.perPage))
      if (params.page) queryParams.append('page', String(params.page))
      if (params.search) queryParams.append('search', params.search)
      if (params.mediaType) queryParams.append('media_type', params.mediaType)
      if (params.mimeType) queryParams.append('mime_type', params.mimeType)
      if (params.orderBy) queryParams.append('orderby', params.orderBy)
      if (params.order) queryParams.append('order', params.order)

      const queryString = queryParams.toString()
      return `${WORDPRESS_COM_API_BASE}/${params.siteId}/media${queryString ? `?${queryString}` : ''}`
    },
    method: 'GET',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `WordPress API error: ${response.status}`)
    }

    const data = await response.json()
    const total = Number.parseInt(response.headers.get('X-WP-Total') || '0', 10)
    const totalPages = Number.parseInt(response.headers.get('X-WP-TotalPages') || '0', 10)

    return {
      success: true,
      output: {
        media: data.map((item: any) => ({
          id: item.id,
          date: item.date,
          slug: item.slug,
          type: item.type,
          link: item.link,
          title: item.title,
          caption: item.caption,
          alt_text: item.alt_text,
          media_type: item.media_type,
          mime_type: item.mime_type,
          source_url: item.source_url,
          media_details: item.media_details,
        })),
        total,
        totalPages,
      },
    }
  },

  outputs: {
    media: {
      type: 'array',
      description: 'List of media items',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', description: 'Media ID' },
          date: { type: 'string', description: 'Upload date' },
          slug: { type: 'string', description: 'Media slug' },
          type: { type: 'string', description: 'Content type' },
          link: { type: 'string', description: 'Media page URL' },
          title: { type: 'object', description: 'Media title object' },
          caption: { type: 'object', description: 'Media caption object' },
          alt_text: { type: 'string', description: 'Alt text' },
          media_type: { type: 'string', description: 'Media type (image, video, etc.)' },
          mime_type: { type: 'string', description: 'MIME type' },
          source_url: { type: 'string', description: 'Direct URL to the media file' },
          media_details: { type: 'object', description: 'Media details (dimensions, etc.)' },
        },
      },
    },
    total: {
      type: 'number',
      description: 'Total number of media items',
    },
    totalPages: {
      type: 'number',
      description: 'Total number of result pages',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_pages.ts]---
Location: sim-main/apps/sim/tools/wordpress/list_pages.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressListPagesParams,
  type WordPressListPagesResponse,
} from './types'

export const listPagesTool: ToolConfig<WordPressListPagesParams, WordPressListPagesResponse> = {
  id: 'wordpress_list_pages',
  name: 'WordPress List Pages',
  description: 'List pages from WordPress.com with optional filters',
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
    perPage: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of pages per request (default: 10, max: 100)',
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Page number for pagination',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Page status filter: publish, draft, pending, private',
    },
    parent: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Filter by parent page ID',
    },
    search: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Search term to filter pages',
    },
    orderBy: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Order by field: date, id, title, slug, modified, menu_order',
    },
    order: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Order direction: asc or desc',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()

      if (params.perPage) queryParams.append('per_page', String(params.perPage))
      if (params.page) queryParams.append('page', String(params.page))
      if (params.status) queryParams.append('status', params.status)
      if (params.parent !== undefined) queryParams.append('parent', String(params.parent))
      if (params.search) queryParams.append('search', params.search)
      if (params.orderBy) queryParams.append('orderby', params.orderBy)
      if (params.order) queryParams.append('order', params.order)

      const queryString = queryParams.toString()
      return `${WORDPRESS_COM_API_BASE}/${params.siteId}/pages${queryString ? `?${queryString}` : ''}`
    },
    method: 'GET',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `WordPress API error: ${response.status}`)
    }

    const data = await response.json()
    const total = Number.parseInt(response.headers.get('X-WP-Total') || '0', 10)
    const totalPages = Number.parseInt(response.headers.get('X-WP-TotalPages') || '0', 10)

    return {
      success: true,
      output: {
        pages: data.map((page: any) => ({
          id: page.id,
          date: page.date,
          modified: page.modified,
          slug: page.slug,
          status: page.status,
          type: page.type,
          link: page.link,
          title: page.title,
          content: page.content,
          excerpt: page.excerpt,
          author: page.author,
          featured_media: page.featured_media,
          parent: page.parent,
          menu_order: page.menu_order,
        })),
        total,
        totalPages,
      },
    }
  },

  outputs: {
    pages: {
      type: 'array',
      description: 'List of pages',
      items: {
        type: 'object',
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
    total: {
      type: 'number',
      description: 'Total number of pages',
    },
    totalPages: {
      type: 'number',
      description: 'Total number of result pages',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_posts.ts]---
Location: sim-main/apps/sim/tools/wordpress/list_posts.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressListPostsParams,
  type WordPressListPostsResponse,
} from './types'

export const listPostsTool: ToolConfig<WordPressListPostsParams, WordPressListPostsResponse> = {
  id: 'wordpress_list_posts',
  name: 'WordPress List Posts',
  description: 'List blog posts from WordPress.com with optional filters',
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
    perPage: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of posts per page (default: 10, max: 100)',
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Page number for pagination',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Post status filter: publish, draft, pending, private',
    },
    author: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Filter by author ID',
    },
    categories: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated category IDs to filter by',
    },
    tags: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated tag IDs to filter by',
    },
    search: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Search term to filter posts',
    },
    orderBy: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Order by field: date, id, title, slug, modified',
    },
    order: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Order direction: asc or desc',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()

      if (params.perPage) queryParams.append('per_page', String(params.perPage))
      if (params.page) queryParams.append('page', String(params.page))
      if (params.status) queryParams.append('status', params.status)
      if (params.author) queryParams.append('author', String(params.author))
      if (params.search) queryParams.append('search', params.search)
      if (params.orderBy) queryParams.append('orderby', params.orderBy)
      if (params.order) queryParams.append('order', params.order)

      if (params.categories) {
        const catIds = params.categories
          .split(',')
          .map((id: string) => id.trim())
          .filter((id: string) => id.length > 0)
        queryParams.append('categories', catIds.join(','))
      }

      if (params.tags) {
        const tagIds = params.tags
          .split(',')
          .map((id: string) => id.trim())
          .filter((id: string) => id.length > 0)
        queryParams.append('tags', tagIds.join(','))
      }

      const queryString = queryParams.toString()
      return `${WORDPRESS_COM_API_BASE}/${params.siteId}/posts${queryString ? `?${queryString}` : ''}`
    },
    method: 'GET',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `WordPress API error: ${response.status}`)
    }

    const data = await response.json()
    const total = Number.parseInt(response.headers.get('X-WP-Total') || '0', 10)
    const totalPages = Number.parseInt(response.headers.get('X-WP-TotalPages') || '0', 10)

    return {
      success: true,
      output: {
        posts: data.map((post: any) => ({
          id: post.id,
          date: post.date,
          modified: post.modified,
          slug: post.slug,
          status: post.status,
          type: post.type,
          link: post.link,
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          author: post.author,
          featured_media: post.featured_media,
          categories: post.categories || [],
          tags: post.tags || [],
        })),
        total,
        totalPages,
      },
    }
  },

  outputs: {
    posts: {
      type: 'array',
      description: 'List of posts',
      items: {
        type: 'object',
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
    total: {
      type: 'number',
      description: 'Total number of posts',
    },
    totalPages: {
      type: 'number',
      description: 'Total number of pages',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_tags.ts]---
Location: sim-main/apps/sim/tools/wordpress/list_tags.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressListTagsParams,
  type WordPressListTagsResponse,
} from './types'

export const listTagsTool: ToolConfig<WordPressListTagsParams, WordPressListTagsResponse> = {
  id: 'wordpress_list_tags',
  name: 'WordPress List Tags',
  description: 'List tags from WordPress.com',
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
    perPage: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of tags per request (default: 10, max: 100)',
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Page number for pagination',
    },
    search: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Search term to filter tags',
    },
    order: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Order direction: asc or desc',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()

      if (params.perPage) queryParams.append('per_page', String(params.perPage))
      if (params.page) queryParams.append('page', String(params.page))
      if (params.search) queryParams.append('search', params.search)
      if (params.order) queryParams.append('order', params.order)

      const queryString = queryParams.toString()
      return `${WORDPRESS_COM_API_BASE}/${params.siteId}/tags${queryString ? `?${queryString}` : ''}`
    },
    method: 'GET',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `WordPress API error: ${response.status}`)
    }

    const data = await response.json()
    const total = Number.parseInt(response.headers.get('X-WP-Total') || '0', 10)
    const totalPages = Number.parseInt(response.headers.get('X-WP-TotalPages') || '0', 10)

    return {
      success: true,
      output: {
        tags: data.map((tag: any) => ({
          id: tag.id,
          count: tag.count,
          description: tag.description,
          link: tag.link,
          name: tag.name,
          slug: tag.slug,
          taxonomy: tag.taxonomy,
        })),
        total,
        totalPages,
      },
    }
  },

  outputs: {
    tags: {
      type: 'array',
      description: 'List of tags',
      items: {
        type: 'object',
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
    total: {
      type: 'number',
      description: 'Total number of tags',
    },
    totalPages: {
      type: 'number',
      description: 'Total number of result pages',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_users.ts]---
Location: sim-main/apps/sim/tools/wordpress/list_users.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressListUsersParams,
  type WordPressListUsersResponse,
} from './types'

export const listUsersTool: ToolConfig<WordPressListUsersParams, WordPressListUsersResponse> = {
  id: 'wordpress_list_users',
  name: 'WordPress List Users',
  description: 'List users from WordPress.com (requires admin privileges)',
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
    perPage: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of users per request (default: 10, max: 100)',
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Page number for pagination',
    },
    search: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Search term to filter users',
    },
    roles: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated role names to filter by',
    },
    order: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Order direction: asc or desc',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()

      if (params.perPage) queryParams.append('per_page', String(params.perPage))
      if (params.page) queryParams.append('page', String(params.page))
      if (params.search) queryParams.append('search', params.search)
      if (params.roles) queryParams.append('roles', params.roles)
      if (params.order) queryParams.append('order', params.order)

      const queryString = queryParams.toString()
      return `${WORDPRESS_COM_API_BASE}/${params.siteId}/users${queryString ? `?${queryString}` : ''}`
    },
    method: 'GET',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `WordPress API error: ${response.status}`)
    }

    const data = await response.json()
    const total = Number.parseInt(response.headers.get('X-WP-Total') || '0', 10)
    const totalPages = Number.parseInt(response.headers.get('X-WP-TotalPages') || '0', 10)

    return {
      success: true,
      output: {
        users: data.map((user: any) => ({
          id: user.id,
          username: user.username,
          name: user.name,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          url: user.url,
          description: user.description,
          link: user.link,
          slug: user.slug,
          roles: user.roles || [],
          avatar_urls: user.avatar_urls,
        })),
        total,
        totalPages,
      },
    }
  },

  outputs: {
    users: {
      type: 'array',
      description: 'List of users',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', description: 'User ID' },
          username: { type: 'string', description: 'Username' },
          name: { type: 'string', description: 'Display name' },
          first_name: { type: 'string', description: 'First name' },
          last_name: { type: 'string', description: 'Last name' },
          email: { type: 'string', description: 'Email address' },
          url: { type: 'string', description: 'User website URL' },
          description: { type: 'string', description: 'User bio' },
          link: { type: 'string', description: 'Author archive URL' },
          slug: { type: 'string', description: 'User slug' },
          roles: { type: 'array', description: 'User roles' },
          avatar_urls: { type: 'object', description: 'Avatar URLs at different sizes' },
        },
      },
    },
    total: {
      type: 'number',
      description: 'Total number of users',
    },
    totalPages: {
      type: 'number',
      description: 'Total number of result pages',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search_content.ts]---
Location: sim-main/apps/sim/tools/wordpress/search_content.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressSearchContentParams,
  type WordPressSearchContentResponse,
} from './types'

export const searchContentTool: ToolConfig<
  WordPressSearchContentParams,
  WordPressSearchContentResponse
> = {
  id: 'wordpress_search_content',
  name: 'WordPress Search Content',
  description: 'Search across all content types in WordPress.com (posts, pages, media)',
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
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Search query',
    },
    perPage: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results per request (default: 10, max: 100)',
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Page number for pagination',
    },
    type: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by content type: post, page, attachment',
    },
    subtype: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by post type slug (e.g., post, page)',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()

      queryParams.append('search', params.query)
      if (params.perPage) queryParams.append('per_page', String(params.perPage))
      if (params.page) queryParams.append('page', String(params.page))
      if (params.type) queryParams.append('type', params.type)
      if (params.subtype) queryParams.append('subtype', params.subtype)

      return `${WORDPRESS_COM_API_BASE}/${params.siteId}/search?${queryParams.toString()}`
    },
    method: 'GET',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `WordPress API error: ${response.status}`)
    }

    const data = await response.json()
    const total = Number.parseInt(response.headers.get('X-WP-Total') || '0', 10)
    const totalPages = Number.parseInt(response.headers.get('X-WP-TotalPages') || '0', 10)

    return {
      success: true,
      output: {
        results: data.map((result: any) => ({
          id: result.id,
          title: result.title,
          url: result.url,
          type: result.type,
          subtype: result.subtype,
        })),
        total,
        totalPages,
      },
    }
  },

  outputs: {
    results: {
      type: 'array',
      description: 'Search results',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', description: 'Content ID' },
          title: { type: 'string', description: 'Content title' },
          url: { type: 'string', description: 'Content URL' },
          type: { type: 'string', description: 'Content type (post, page, attachment)' },
          subtype: { type: 'string', description: 'Post type slug' },
        },
      },
    },
    total: {
      type: 'number',
      description: 'Total number of results',
    },
    totalPages: {
      type: 'number',
      description: 'Total number of result pages',
    },
  },
}
```

--------------------------------------------------------------------------------

````
