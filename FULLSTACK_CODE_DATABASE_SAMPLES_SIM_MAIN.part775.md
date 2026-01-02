---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 775
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 775 of 933)

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

---[FILE: delete_comment.ts]---
Location: sim-main/apps/sim/tools/wordpress/delete_comment.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressDeleteCommentParams,
  type WordPressDeleteCommentResponse,
} from './types'

export const deleteCommentTool: ToolConfig<
  WordPressDeleteCommentParams,
  WordPressDeleteCommentResponse
> = {
  id: 'wordpress_delete_comment',
  name: 'WordPress Delete Comment',
  description: 'Delete a comment from WordPress.com',
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
    commentId: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the comment to delete',
    },
    force: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Bypass trash and force delete permanently',
    },
  },

  request: {
    url: (params) => {
      const forceParam = params.force ? '?force=true' : ''
      return `${WORDPRESS_COM_API_BASE}/${params.siteId}/comments/${params.commentId}${forceParam}`
    },
    method: 'DELETE',
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

    return {
      success: true,
      output: {
        deleted: data.deleted || true,
        comment: {
          id: data.id || data.previous?.id,
          post: data.post || data.previous?.post,
          parent: data.parent || data.previous?.parent,
          author: data.author || data.previous?.author,
          author_name: data.author_name || data.previous?.author_name,
          author_email: data.author_email || data.previous?.author_email,
          author_url: data.author_url || data.previous?.author_url,
          date: data.date || data.previous?.date,
          content: data.content || data.previous?.content,
          link: data.link || data.previous?.link,
          status: data.status || data.previous?.status || 'trash',
        },
      },
    }
  },

  outputs: {
    deleted: {
      type: 'boolean',
      description: 'Whether the comment was deleted',
    },
    comment: {
      type: 'object',
      description: 'The deleted comment',
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

---[FILE: delete_media.ts]---
Location: sim-main/apps/sim/tools/wordpress/delete_media.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressDeleteMediaParams,
  type WordPressDeleteMediaResponse,
} from './types'

export const deleteMediaTool: ToolConfig<WordPressDeleteMediaParams, WordPressDeleteMediaResponse> =
  {
    id: 'wordpress_delete_media',
    name: 'WordPress Delete Media',
    description: 'Delete a media item from WordPress.com',
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
      mediaId: {
        type: 'number',
        required: true,
        visibility: 'user-or-llm',
        description: 'The ID of the media item to delete',
      },
      force: {
        type: 'boolean',
        required: false,
        visibility: 'user-only',
        description: 'Force delete (media has no trash, so deletion is permanent)',
      },
    },

    request: {
      url: (params) => {
        // Media deletion requires force=true to actually delete
        return `${WORDPRESS_COM_API_BASE}/${params.siteId}/media/${params.mediaId}?force=true`
      },
      method: 'DELETE',
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

      return {
        success: true,
        output: {
          deleted: data.deleted || true,
          media: {
            id: data.id || data.previous?.id,
            date: data.date || data.previous?.date,
            slug: data.slug || data.previous?.slug,
            type: data.type || data.previous?.type,
            link: data.link || data.previous?.link,
            title: data.title || data.previous?.title,
            caption: data.caption || data.previous?.caption,
            alt_text: data.alt_text || data.previous?.alt_text,
            media_type: data.media_type || data.previous?.media_type,
            mime_type: data.mime_type || data.previous?.mime_type,
            source_url: data.source_url || data.previous?.source_url,
            media_details: data.media_details || data.previous?.media_details,
          },
        },
      }
    },

    outputs: {
      deleted: {
        type: 'boolean',
        description: 'Whether the media was deleted',
      },
      media: {
        type: 'object',
        description: 'The deleted media item',
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
  }
```

--------------------------------------------------------------------------------

---[FILE: delete_page.ts]---
Location: sim-main/apps/sim/tools/wordpress/delete_page.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressDeletePageParams,
  type WordPressDeletePageResponse,
} from './types'

export const deletePageTool: ToolConfig<WordPressDeletePageParams, WordPressDeletePageResponse> = {
  id: 'wordpress_delete_page',
  name: 'WordPress Delete Page',
  description: 'Delete a page from WordPress.com',
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
    pageId: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the page to delete',
    },
    force: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Bypass trash and force delete permanently',
    },
  },

  request: {
    url: (params) => {
      const forceParam = params.force ? '?force=true' : ''
      return `${WORDPRESS_COM_API_BASE}/${params.siteId}/pages/${params.pageId}${forceParam}`
    },
    method: 'DELETE',
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

    return {
      success: true,
      output: {
        deleted: data.deleted || true,
        page: {
          id: data.id || data.previous?.id,
          date: data.date || data.previous?.date,
          modified: data.modified || data.previous?.modified,
          slug: data.slug || data.previous?.slug,
          status: data.status || data.previous?.status || 'trash',
          type: data.type || data.previous?.type,
          link: data.link || data.previous?.link,
          title: data.title || data.previous?.title,
          content: data.content || data.previous?.content,
          excerpt: data.excerpt || data.previous?.excerpt,
          author: data.author || data.previous?.author,
          featured_media: data.featured_media || data.previous?.featured_media,
          parent: data.parent || data.previous?.parent,
          menu_order: data.menu_order || data.previous?.menu_order,
        },
      },
    }
  },

  outputs: {
    deleted: {
      type: 'boolean',
      description: 'Whether the page was deleted',
    },
    page: {
      type: 'object',
      description: 'The deleted page',
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

---[FILE: delete_post.ts]---
Location: sim-main/apps/sim/tools/wordpress/delete_post.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressDeletePostParams,
  type WordPressDeletePostResponse,
} from './types'

export const deletePostTool: ToolConfig<WordPressDeletePostParams, WordPressDeletePostResponse> = {
  id: 'wordpress_delete_post',
  name: 'WordPress Delete Post',
  description: 'Delete a blog post from WordPress.com',
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
      description: 'The ID of the post to delete',
    },
    force: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Bypass trash and force delete permanently',
    },
  },

  request: {
    url: (params) => {
      const forceParam = params.force ? '?force=true' : ''
      return `${WORDPRESS_COM_API_BASE}/${params.siteId}/posts/${params.postId}${forceParam}`
    },
    method: 'DELETE',
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

    return {
      success: true,
      output: {
        deleted: data.deleted || true,
        post: {
          id: data.id || data.previous?.id,
          date: data.date || data.previous?.date,
          modified: data.modified || data.previous?.modified,
          slug: data.slug || data.previous?.slug,
          status: data.status || data.previous?.status || 'trash',
          type: data.type || data.previous?.type,
          link: data.link || data.previous?.link,
          title: data.title || data.previous?.title,
          content: data.content || data.previous?.content,
          excerpt: data.excerpt || data.previous?.excerpt,
          author: data.author || data.previous?.author,
          featured_media: data.featured_media || data.previous?.featured_media,
          categories: data.categories || data.previous?.categories || [],
          tags: data.tags || data.previous?.tags || [],
        },
      },
    }
  },

  outputs: {
    deleted: {
      type: 'boolean',
      description: 'Whether the post was deleted',
    },
    post: {
      type: 'object',
      description: 'The deleted post',
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

---[FILE: get_current_user.ts]---
Location: sim-main/apps/sim/tools/wordpress/get_current_user.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressGetCurrentUserParams,
  type WordPressGetCurrentUserResponse,
} from './types'

export const getCurrentUserTool: ToolConfig<
  WordPressGetCurrentUserParams,
  WordPressGetCurrentUserResponse
> = {
  id: 'wordpress_get_current_user',
  name: 'WordPress Get Current User',
  description: 'Get information about the currently authenticated WordPress.com user',
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
  },

  request: {
    url: (params) => `${WORDPRESS_COM_API_BASE}/${params.siteId}/users/me`,
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

    return {
      success: true,
      output: {
        user: {
          id: data.id,
          username: data.username,
          name: data.name,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          url: data.url,
          description: data.description,
          link: data.link,
          slug: data.slug,
          roles: data.roles || [],
          avatar_urls: data.avatar_urls,
        },
      },
    }
  },

  outputs: {
    user: {
      type: 'object',
      description: 'The current user',
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
}
```

--------------------------------------------------------------------------------

---[FILE: get_media.ts]---
Location: sim-main/apps/sim/tools/wordpress/get_media.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressGetMediaParams,
  type WordPressGetMediaResponse,
} from './types'

export const getMediaTool: ToolConfig<WordPressGetMediaParams, WordPressGetMediaResponse> = {
  id: 'wordpress_get_media',
  name: 'WordPress Get Media',
  description: 'Get a single media item from WordPress.com by ID',
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
    mediaId: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the media item to retrieve',
    },
  },

  request: {
    url: (params) => `${WORDPRESS_COM_API_BASE}/${params.siteId}/media/${params.mediaId}`,
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

    return {
      success: true,
      output: {
        media: {
          id: data.id,
          date: data.date,
          slug: data.slug,
          type: data.type,
          link: data.link,
          title: data.title,
          caption: data.caption,
          alt_text: data.alt_text,
          media_type: data.media_type,
          mime_type: data.mime_type,
          source_url: data.source_url,
          media_details: data.media_details,
        },
      },
    }
  },

  outputs: {
    media: {
      type: 'object',
      description: 'The retrieved media item',
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
}
```

--------------------------------------------------------------------------------

---[FILE: get_page.ts]---
Location: sim-main/apps/sim/tools/wordpress/get_page.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressGetPageParams,
  type WordPressGetPageResponse,
} from './types'

export const getPageTool: ToolConfig<WordPressGetPageParams, WordPressGetPageResponse> = {
  id: 'wordpress_get_page',
  name: 'WordPress Get Page',
  description: 'Get a single page from WordPress.com by ID',
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
    pageId: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the page to retrieve',
    },
  },

  request: {
    url: (params) => `${WORDPRESS_COM_API_BASE}/${params.siteId}/pages/${params.pageId}`,
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
      description: 'The retrieved page',
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

---[FILE: get_post.ts]---
Location: sim-main/apps/sim/tools/wordpress/get_post.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressGetPostParams,
  type WordPressGetPostResponse,
} from './types'

export const getPostTool: ToolConfig<WordPressGetPostParams, WordPressGetPostResponse> = {
  id: 'wordpress_get_post',
  name: 'WordPress Get Post',
  description: 'Get a single blog post from WordPress.com by ID',
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
      description: 'The ID of the post to retrieve',
    },
  },

  request: {
    url: (params) => `${WORDPRESS_COM_API_BASE}/${params.siteId}/posts/${params.postId}`,
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
      description: 'The retrieved post',
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

---[FILE: get_user.ts]---
Location: sim-main/apps/sim/tools/wordpress/get_user.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressGetUserParams,
  type WordPressGetUserResponse,
} from './types'

export const getUserTool: ToolConfig<WordPressGetUserParams, WordPressGetUserResponse> = {
  id: 'wordpress_get_user',
  name: 'WordPress Get User',
  description: 'Get a specific user from WordPress.com by ID',
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
    userId: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the user to retrieve',
    },
  },

  request: {
    url: (params) => `${WORDPRESS_COM_API_BASE}/${params.siteId}/users/${params.userId}`,
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

    return {
      success: true,
      output: {
        user: {
          id: data.id,
          username: data.username,
          name: data.name,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          url: data.url,
          description: data.description,
          link: data.link,
          slug: data.slug,
          roles: data.roles || [],
          avatar_urls: data.avatar_urls,
        },
      },
    }
  },

  outputs: {
    user: {
      type: 'object',
      description: 'The retrieved user',
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
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/wordpress/index.ts

```typescript
// WordPress tools exports
import { createCategoryTool } from '@/tools/wordpress/create_category'
import { createCommentTool } from '@/tools/wordpress/create_comment'
import { createPageTool } from '@/tools/wordpress/create_page'
import { createPostTool } from '@/tools/wordpress/create_post'
import { createTagTool } from '@/tools/wordpress/create_tag'
import { deleteCommentTool } from '@/tools/wordpress/delete_comment'
import { deleteMediaTool } from '@/tools/wordpress/delete_media'
import { deletePageTool } from '@/tools/wordpress/delete_page'
import { deletePostTool } from '@/tools/wordpress/delete_post'
import { getCurrentUserTool } from '@/tools/wordpress/get_current_user'
import { getMediaTool } from '@/tools/wordpress/get_media'
import { getPageTool } from '@/tools/wordpress/get_page'
import { getPostTool } from '@/tools/wordpress/get_post'
import { getUserTool } from '@/tools/wordpress/get_user'
import { listCategoriesTool } from '@/tools/wordpress/list_categories'
import { listCommentsTool } from '@/tools/wordpress/list_comments'
import { listMediaTool } from '@/tools/wordpress/list_media'
import { listPagesTool } from '@/tools/wordpress/list_pages'
import { listPostsTool } from '@/tools/wordpress/list_posts'
import { listTagsTool } from '@/tools/wordpress/list_tags'
import { listUsersTool } from '@/tools/wordpress/list_users'
import { searchContentTool } from '@/tools/wordpress/search_content'
import { updateCommentTool } from '@/tools/wordpress/update_comment'
import { updatePageTool } from '@/tools/wordpress/update_page'
import { updatePostTool } from '@/tools/wordpress/update_post'
import { uploadMediaTool } from '@/tools/wordpress/upload_media'

// Post operations
export const wordpressCreatePostTool = createPostTool
export const wordpressUpdatePostTool = updatePostTool
export const wordpressDeletePostTool = deletePostTool
export const wordpressGetPostTool = getPostTool
export const wordpressListPostsTool = listPostsTool

// Page operations
export const wordpressCreatePageTool = createPageTool
export const wordpressUpdatePageTool = updatePageTool
export const wordpressDeletePageTool = deletePageTool
export const wordpressGetPageTool = getPageTool
export const wordpressListPagesTool = listPagesTool

// Media operations
export const wordpressUploadMediaTool = uploadMediaTool
export const wordpressGetMediaTool = getMediaTool
export const wordpressListMediaTool = listMediaTool
export const wordpressDeleteMediaTool = deleteMediaTool

// Comment operations
export const wordpressCreateCommentTool = createCommentTool
export const wordpressListCommentsTool = listCommentsTool
export const wordpressUpdateCommentTool = updateCommentTool
export const wordpressDeleteCommentTool = deleteCommentTool

// Category operations
export const wordpressCreateCategoryTool = createCategoryTool
export const wordpressListCategoriesTool = listCategoriesTool

// Tag operations
export const wordpressCreateTagTool = createTagTool
export const wordpressListTagsTool = listTagsTool

// User operations
export const wordpressGetCurrentUserTool = getCurrentUserTool
export const wordpressListUsersTool = listUsersTool
export const wordpressGetUserTool = getUserTool

// Search operations
export const wordpressSearchContentTool = searchContentTool
```

--------------------------------------------------------------------------------

---[FILE: list_categories.ts]---
Location: sim-main/apps/sim/tools/wordpress/list_categories.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressListCategoriesParams,
  type WordPressListCategoriesResponse,
} from './types'

export const listCategoriesTool: ToolConfig<
  WordPressListCategoriesParams,
  WordPressListCategoriesResponse
> = {
  id: 'wordpress_list_categories',
  name: 'WordPress List Categories',
  description: 'List categories from WordPress.com',
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
      description: 'Number of categories per request (default: 10, max: 100)',
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
      description: 'Search term to filter categories',
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
      return `${WORDPRESS_COM_API_BASE}/${params.siteId}/categories${queryString ? `?${queryString}` : ''}`
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
        categories: data.map((cat: any) => ({
          id: cat.id,
          count: cat.count,
          description: cat.description,
          link: cat.link,
          name: cat.name,
          slug: cat.slug,
          taxonomy: cat.taxonomy,
          parent: cat.parent,
        })),
        total,
        totalPages,
      },
    }
  },

  outputs: {
    categories: {
      type: 'array',
      description: 'List of categories',
      items: {
        type: 'object',
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
    total: {
      type: 'number',
      description: 'Total number of categories',
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
