---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 777
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 777 of 933)

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

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/wordpress/types.ts

```typescript
// Common types for WordPress REST API tools
import type { ToolResponse } from '@/tools/types'

// Common parameters for all WordPress tools (WordPress.com OAuth)
// Note: accessToken is injected by the OAuth system at runtime, not defined in tool params
export interface WordPressBaseParams {
  siteId: string // WordPress.com site ID or domain (e.g., 12345678 or mysite.wordpress.com)
  accessToken: string // OAuth access token (injected by OAuth system)
}

// WordPress.com API base URL
export const WORDPRESS_COM_API_BASE = 'https://public-api.wordpress.com/wp/v2/sites'

// Post status types
export type PostStatus = 'publish' | 'draft' | 'pending' | 'private' | 'future'

// Comment status types
export type CommentStatus = 'approved' | 'hold' | 'spam' | 'trash'

// ============================================
// POST OPERATIONS
// ============================================

// Create Post
export interface WordPressCreatePostParams extends WordPressBaseParams {
  title: string
  content?: string
  status?: PostStatus
  excerpt?: string
  categories?: string // Comma-separated category IDs
  tags?: string // Comma-separated tag IDs
  featuredMedia?: number
  slug?: string
}

export interface WordPressPost {
  id: number
  date: string
  modified: string
  slug: string
  status: PostStatus
  type: string
  link: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  author: number
  featured_media: number
  categories: number[]
  tags: number[]
}

export interface WordPressCreatePostResponse extends ToolResponse {
  output: {
    post: WordPressPost
  }
}

// Update Post
export interface WordPressUpdatePostParams extends WordPressBaseParams {
  postId: number
  title?: string
  content?: string
  status?: PostStatus
  excerpt?: string
  categories?: string
  tags?: string
  featuredMedia?: number
  slug?: string
}

export interface WordPressUpdatePostResponse extends ToolResponse {
  output: {
    post: WordPressPost
  }
}

// Delete Post
export interface WordPressDeletePostParams extends WordPressBaseParams {
  postId: number
  force?: boolean // Bypass trash and force delete
}

export interface WordPressDeletePostResponse extends ToolResponse {
  output: {
    deleted: boolean
    post: WordPressPost
  }
}

// Get Post
export interface WordPressGetPostParams extends WordPressBaseParams {
  postId: number
}

export interface WordPressGetPostResponse extends ToolResponse {
  output: {
    post: WordPressPost
  }
}

// List Posts
export interface WordPressListPostsParams extends WordPressBaseParams {
  perPage?: number
  page?: number
  status?: PostStatus
  author?: number
  categories?: string
  tags?: string
  search?: string
  orderBy?: 'date' | 'id' | 'title' | 'slug' | 'modified'
  order?: 'asc' | 'desc'
}

export interface WordPressListPostsResponse extends ToolResponse {
  output: {
    posts: WordPressPost[]
    total: number
    totalPages: number
  }
}

// Search Posts
export interface WordPressSearchPostsParams extends WordPressBaseParams {
  query: string
  perPage?: number
  page?: number
}

export interface WordPressSearchPostsResponse extends ToolResponse {
  output: {
    posts: WordPressPost[]
    total: number
    totalPages: number
  }
}

// ============================================
// PAGE OPERATIONS
// ============================================

// Create Page
export interface WordPressCreatePageParams extends WordPressBaseParams {
  title: string
  content?: string
  status?: PostStatus
  excerpt?: string
  parent?: number
  menuOrder?: number
  featuredMedia?: number
  slug?: string
}

export interface WordPressPage {
  id: number
  date: string
  modified: string
  slug: string
  status: PostStatus
  type: string
  link: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  author: number
  featured_media: number
  parent: number
  menu_order: number
}

export interface WordPressCreatePageResponse extends ToolResponse {
  output: {
    page: WordPressPage
  }
}

// Update Page
export interface WordPressUpdatePageParams extends WordPressBaseParams {
  pageId: number
  title?: string
  content?: string
  status?: PostStatus
  excerpt?: string
  parent?: number
  menuOrder?: number
  featuredMedia?: number
  slug?: string
}

export interface WordPressUpdatePageResponse extends ToolResponse {
  output: {
    page: WordPressPage
  }
}

// Delete Page
export interface WordPressDeletePageParams extends WordPressBaseParams {
  pageId: number
  force?: boolean
}

export interface WordPressDeletePageResponse extends ToolResponse {
  output: {
    deleted: boolean
    page: WordPressPage
  }
}

// Get Page
export interface WordPressGetPageParams extends WordPressBaseParams {
  pageId: number
}

export interface WordPressGetPageResponse extends ToolResponse {
  output: {
    page: WordPressPage
  }
}

// List Pages
export interface WordPressListPagesParams extends WordPressBaseParams {
  perPage?: number
  page?: number
  status?: PostStatus
  parent?: number
  search?: string
  orderBy?: 'date' | 'id' | 'title' | 'slug' | 'modified' | 'menu_order'
  order?: 'asc' | 'desc'
}

export interface WordPressListPagesResponse extends ToolResponse {
  output: {
    pages: WordPressPage[]
    total: number
    totalPages: number
  }
}

// ============================================
// MEDIA OPERATIONS
// ============================================

// Upload Media
export interface WordPressUploadMediaParams extends WordPressBaseParams {
  file: any // UserFile object from file upload
  filename?: string // Optional filename override
  title?: string
  caption?: string
  altText?: string
  description?: string
}

export interface WordPressMedia {
  id: number
  date: string
  slug: string
  type: string
  link: string
  title: {
    rendered: string
  }
  caption: {
    rendered: string
  }
  alt_text: string
  media_type: string
  mime_type: string
  source_url: string
  media_details?: {
    width?: number
    height?: number
    file?: string
  }
}

export interface WordPressUploadMediaResponse extends ToolResponse {
  output: {
    media: WordPressMedia
  }
}

// Get Media
export interface WordPressGetMediaParams extends WordPressBaseParams {
  mediaId: number
}

export interface WordPressGetMediaResponse extends ToolResponse {
  output: {
    media: WordPressMedia
  }
}

// List Media
export interface WordPressListMediaParams extends WordPressBaseParams {
  perPage?: number
  page?: number
  search?: string
  mediaType?: 'image' | 'video' | 'audio' | 'application'
  mimeType?: string
  orderBy?: 'date' | 'id' | 'title' | 'slug'
  order?: 'asc' | 'desc'
}

export interface WordPressListMediaResponse extends ToolResponse {
  output: {
    media: WordPressMedia[]
    total: number
    totalPages: number
  }
}

// Delete Media
export interface WordPressDeleteMediaParams extends WordPressBaseParams {
  mediaId: number
  force?: boolean
}

export interface WordPressDeleteMediaResponse extends ToolResponse {
  output: {
    deleted: boolean
    media: WordPressMedia
  }
}

// ============================================
// COMMENT OPERATIONS
// ============================================

// Create Comment
export interface WordPressCreateCommentParams extends WordPressBaseParams {
  postId: number
  content: string
  parent?: number
  authorName?: string
  authorEmail?: string
  authorUrl?: string
}

export interface WordPressComment {
  id: number
  post: number
  parent: number
  author: number
  author_name: string
  author_email?: string
  author_url: string
  date: string
  content: {
    rendered: string
  }
  link: string
  status: string
}

export interface WordPressCreateCommentResponse extends ToolResponse {
  output: {
    comment: WordPressComment
  }
}

// Get Comment
export interface WordPressGetCommentParams extends WordPressBaseParams {
  commentId: number
}

export interface WordPressGetCommentResponse extends ToolResponse {
  output: {
    comment: WordPressComment
  }
}

// List Comments
export interface WordPressListCommentsParams extends WordPressBaseParams {
  perPage?: number
  page?: number
  postId?: number
  status?: CommentStatus
  search?: string
  orderBy?: 'date' | 'id' | 'parent'
  order?: 'asc' | 'desc'
}

export interface WordPressListCommentsResponse extends ToolResponse {
  output: {
    comments: WordPressComment[]
    total: number
    totalPages: number
  }
}

// Update Comment
export interface WordPressUpdateCommentParams extends WordPressBaseParams {
  commentId: number
  content?: string
  status?: CommentStatus
}

export interface WordPressUpdateCommentResponse extends ToolResponse {
  output: {
    comment: WordPressComment
  }
}

// Delete Comment
export interface WordPressDeleteCommentParams extends WordPressBaseParams {
  commentId: number
  force?: boolean
}

export interface WordPressDeleteCommentResponse extends ToolResponse {
  output: {
    deleted: boolean
    comment: WordPressComment
  }
}

// ============================================
// TAXONOMY OPERATIONS (Categories & Tags)
// ============================================

// Create Category
export interface WordPressCreateCategoryParams extends WordPressBaseParams {
  name: string
  description?: string
  parent?: number
  slug?: string
}

export interface WordPressCategory {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: string
  parent: number
}

export interface WordPressCreateCategoryResponse extends ToolResponse {
  output: {
    category: WordPressCategory
  }
}

// List Categories
export interface WordPressListCategoriesParams extends WordPressBaseParams {
  perPage?: number
  page?: number
  search?: string
  order?: 'asc' | 'desc'
}

export interface WordPressListCategoriesResponse extends ToolResponse {
  output: {
    categories: WordPressCategory[]
    total: number
    totalPages: number
  }
}

// Create Tag
export interface WordPressCreateTagParams extends WordPressBaseParams {
  name: string
  description?: string
  slug?: string
}

export interface WordPressTag {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: string
}

export interface WordPressCreateTagResponse extends ToolResponse {
  output: {
    tag: WordPressTag
  }
}

// List Tags
export interface WordPressListTagsParams extends WordPressBaseParams {
  perPage?: number
  page?: number
  search?: string
  order?: 'asc' | 'desc'
}

export interface WordPressListTagsResponse extends ToolResponse {
  output: {
    tags: WordPressTag[]
    total: number
    totalPages: number
  }
}

// ============================================
// USER OPERATIONS
// ============================================

// Get Current User
export interface WordPressGetCurrentUserParams extends WordPressBaseParams {}

export interface WordPressUser {
  id: number
  username: string
  name: string
  first_name: string
  last_name: string
  email?: string
  url: string
  description: string
  link: string
  slug: string
  roles: string[]
  avatar_urls?: Record<string, string>
}

export interface WordPressGetCurrentUserResponse extends ToolResponse {
  output: {
    user: WordPressUser
  }
}

// List Users
export interface WordPressListUsersParams extends WordPressBaseParams {
  perPage?: number
  page?: number
  search?: string
  roles?: string
  order?: 'asc' | 'desc'
}

export interface WordPressListUsersResponse extends ToolResponse {
  output: {
    users: WordPressUser[]
    total: number
    totalPages: number
  }
}

// Get User
export interface WordPressGetUserParams extends WordPressBaseParams {
  userId: number
}

export interface WordPressGetUserResponse extends ToolResponse {
  output: {
    user: WordPressUser
  }
}

// ============================================
// SEARCH OPERATIONS
// ============================================

// Search Content
export interface WordPressSearchContentParams extends WordPressBaseParams {
  query: string
  perPage?: number
  page?: number
  type?: 'post' | 'page' | 'attachment'
  subtype?: string
}

export interface WordPressSearchResult {
  id: number
  title: string
  url: string
  type: string
  subtype: string
}

export interface WordPressSearchContentResponse extends ToolResponse {
  output: {
    results: WordPressSearchResult[]
    total: number
    totalPages: number
  }
}

// Union type for all WordPress responses
export type WordPressResponse =
  | WordPressCreatePostResponse
  | WordPressUpdatePostResponse
  | WordPressDeletePostResponse
  | WordPressGetPostResponse
  | WordPressListPostsResponse
  | WordPressSearchPostsResponse
  | WordPressCreatePageResponse
  | WordPressUpdatePageResponse
  | WordPressDeletePageResponse
  | WordPressGetPageResponse
  | WordPressListPagesResponse
  | WordPressUploadMediaResponse
  | WordPressGetMediaResponse
  | WordPressListMediaResponse
  | WordPressDeleteMediaResponse
  | WordPressCreateCommentResponse
  | WordPressGetCommentResponse
  | WordPressListCommentsResponse
  | WordPressUpdateCommentResponse
  | WordPressDeleteCommentResponse
  | WordPressCreateCategoryResponse
  | WordPressListCategoriesResponse
  | WordPressCreateTagResponse
  | WordPressListTagsResponse
  | WordPressGetCurrentUserResponse
  | WordPressListUsersResponse
  | WordPressGetUserResponse
  | WordPressSearchContentResponse
```

--------------------------------------------------------------------------------

---[FILE: update_comment.ts]---
Location: sim-main/apps/sim/tools/wordpress/update_comment.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressUpdateCommentParams,
  type WordPressUpdateCommentResponse,
} from './types'

export const updateCommentTool: ToolConfig<
  WordPressUpdateCommentParams,
  WordPressUpdateCommentResponse
> = {
  id: 'wordpress_update_comment',
  name: 'WordPress Update Comment',
  description: 'Update a comment in WordPress.com (content or status)',
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
      description: 'The ID of the comment to update',
    },
    content: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated comment content',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comment status: approved, hold, spam, trash',
    },
  },

  request: {
    url: (params) => `${WORDPRESS_COM_API_BASE}/${params.siteId}/comments/${params.commentId}`,
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {}

      if (params.content) body.content = params.content
      if (params.status) body.status = params.status

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
      description: 'The updated comment',
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

---[FILE: update_page.ts]---
Location: sim-main/apps/sim/tools/wordpress/update_page.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressUpdatePageParams,
  type WordPressUpdatePageResponse,
} from './types'

export const updatePageTool: ToolConfig<WordPressUpdatePageParams, WordPressUpdatePageResponse> = {
  id: 'wordpress_update_page',
  name: 'WordPress Update Page',
  description: 'Update an existing page in WordPress.com',
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
      description: 'The ID of the page to update',
    },
    title: {
      type: 'string',
      required: false,
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
    url: (params) => `${WORDPRESS_COM_API_BASE}/${params.siteId}/pages/${params.pageId}`,
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {}

      if (params.title) body.title = params.title
      if (params.content) body.content = params.content
      if (params.status) body.status = params.status
      if (params.excerpt) body.excerpt = params.excerpt
      if (params.slug) body.slug = params.slug
      if (params.parent !== undefined) body.parent = params.parent
      if (params.menuOrder !== undefined) body.menu_order = params.menuOrder
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
      description: 'The updated page',
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

---[FILE: update_post.ts]---
Location: sim-main/apps/sim/tools/wordpress/update_post.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import {
  WORDPRESS_COM_API_BASE,
  type WordPressUpdatePostParams,
  type WordPressUpdatePostResponse,
} from './types'

export const updatePostTool: ToolConfig<WordPressUpdatePostParams, WordPressUpdatePostResponse> = {
  id: 'wordpress_update_post',
  name: 'WordPress Update Post',
  description: 'Update an existing blog post in WordPress.com',
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
      description: 'The ID of the post to update',
    },
    title: {
      type: 'string',
      required: false,
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
    url: (params) => `${WORDPRESS_COM_API_BASE}/${params.siteId}/posts/${params.postId}`,
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.accessToken}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {}

      if (params.title) body.title = params.title
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
      description: 'The updated post',
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

---[FILE: upload_media.ts]---
Location: sim-main/apps/sim/tools/wordpress/upload_media.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { WordPressUploadMediaParams, WordPressUploadMediaResponse } from './types'

const logger = createLogger('WordPressUploadMediaTool')

export const uploadMediaTool: ToolConfig<WordPressUploadMediaParams, WordPressUploadMediaResponse> =
  {
    id: 'wordpress_upload_media',
    name: 'WordPress Upload Media',
    description: 'Upload a media file (image, video, document) to WordPress.com',
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
      file: {
        type: 'file',
        required: false,
        visibility: 'user-only',
        description: 'File to upload (UserFile object)',
      },
      filename: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Optional filename override (e.g., image.jpg)',
      },
      title: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Media title',
      },
      caption: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Media caption',
      },
      altText: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Alternative text for accessibility',
      },
      description: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Media description',
      },
    },

    request: {
      url: () => '/api/tools/wordpress/upload',
      method: 'POST',
      headers: () => ({
        'Content-Type': 'application/json',
      }),
      body: (params) => ({
        accessToken: params.accessToken,
        siteId: params.siteId,
        file: params.file,
        filename: params.filename,
        title: params.title,
        caption: params.caption,
        altText: params.altText,
        description: params.description,
      }),
    },

    transformResponse: async (response: Response) => {
      const data = await response.json()

      if (!data.success) {
        logger.error('Failed to upload media via custom API route', {
          error: data.error,
        })
        throw new Error(data.error || 'Failed to upload media to WordPress')
      }

      return {
        success: true,
        output: {
          media: data.output.media,
        },
      }
    },

    outputs: {
      media: {
        type: 'object',
        description: 'The uploaded media item',
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

---[FILE: executor.ts]---
Location: sim-main/apps/sim/tools/workflow/executor.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { WorkflowExecutorParams, WorkflowExecutorResponse } from '@/tools/workflow/types'

/**
 * Tool for executing workflows as blocks within other workflows.
 * This tool is used by the WorkflowBlockHandler to provide the execution capability.
 */
export const workflowExecutorTool: ToolConfig<
  WorkflowExecutorParams,
  WorkflowExecutorResponse['output']
> = {
  id: 'workflow_executor',
  name: 'Workflow Executor',
  description:
    'Execute another workflow as a sub-workflow. Pass inputs as a JSON object with field names matching the child workflow\'s input format. Example: if child expects "name" and "email", pass {"name": "John", "email": "john@example.com"}',
  version: '1.0.0',
  params: {
    workflowId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the workflow to execute',
    },
    inputMapping: {
      type: 'object',
      required: false,
      visibility: 'user-or-llm',
      description:
        'JSON object with keys matching the child workflow\'s input field names. Each key should map to the value you want to pass for that input field. Example: {"fieldName": "value", "otherField": 123}',
    },
  },
  request: {
    url: (params: WorkflowExecutorParams) => `/api/workflows/${params.workflowId}/execute`,
    method: 'POST',
    headers: () => ({ 'Content-Type': 'application/json' }),
    body: (params: WorkflowExecutorParams) => ({
      input: params.inputMapping || {},
      triggerType: 'api',
      useDraftState: false,
    }),
  },
  transformResponse: async (response: Response) => {
    const data = await response.json()
    const outputData = data?.output ?? {}

    return {
      success: data?.success ?? false,
      duration: data?.metadata?.duration ?? 0,
      childWorkflowId: data?.workflowId ?? '',
      childWorkflowName: data?.workflowName ?? '',
      output: outputData, // For OpenAI provider
      result: outputData, // For backwards compatibility
      error: data?.error,
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/workflow/index.ts

```typescript
export { workflowExecutorTool } from '@/tools/workflow/executor'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/workflow/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface WorkflowExecutorParams {
  workflowId: string
  inputMapping?: Record<string, any>
}

export interface WorkflowExecutorResponse extends ToolResponse {
  output: {
    success: boolean
    duration: number
    childWorkflowId: string
    childWorkflowName: string
    [key: string]: any
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/x/index.ts

```typescript
import { xReadTool } from '@/tools/x/read'
import { xSearchTool } from '@/tools/x/search'
import { xUserTool } from '@/tools/x/user'
import { xWriteTool } from '@/tools/x/write'

export { xReadTool }
export { xWriteTool }
export { xSearchTool }
export { xUserTool }
```

--------------------------------------------------------------------------------

---[FILE: read.ts]---
Location: sim-main/apps/sim/tools/x/read.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { XReadParams, XReadResponse, XTweet } from '@/tools/x/types'
import { transformTweet } from '@/tools/x/types'

const logger = createLogger('XReadTool')

export const xReadTool: ToolConfig<XReadParams, XReadResponse> = {
  id: 'x_read',
  name: 'X Read',
  description: 'Read tweet details, including replies and conversation context',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'x',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'X OAuth access token',
    },
    tweetId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ID of the tweet to read',
    },
    includeReplies: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Whether to include replies to the tweet',
    },
  },

  request: {
    url: (params) => {
      const expansions = [
        'author_id',
        'in_reply_to_user_id',
        'referenced_tweets.id',
        'referenced_tweets.id.author_id',
        'attachments.media_keys',
        'attachments.poll_ids',
      ].join(',')

      const tweetFields = [
        'created_at',
        'conversation_id',
        'in_reply_to_user_id',
        'attachments',
        'context_annotations',
        'public_metrics',
      ].join(',')

      const userFields = [
        'name',
        'username',
        'description',
        'profile_image_url',
        'verified',
        'public_metrics',
      ].join(',')

      const queryParams = new URLSearchParams({
        expansions,
        'tweet.fields': tweetFields,
        'user.fields': userFields,
      })

      return `https://api.twitter.com/2/tweets/${params.tweetId}?${queryParams.toString()}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response, params) => {
    const data = await response.json()

    if (data.errors && !data.data) {
      logger.error('X Read API Error:', JSON.stringify(data, null, 2))
      return {
        success: false,
        error: data.errors?.[0]?.detail || data.errors?.[0]?.message || 'Failed to fetch tweet',
        output: {
          tweet: {} as XTweet,
        },
      }
    }

    const mainTweet = transformTweet(data.data)
    const context: { parentTweet?: XTweet; rootTweet?: XTweet } = {}

    if (data.includes?.tweets) {
      const referencedTweets = data.data.referenced_tweets || []
      const parentTweetRef = referencedTweets.find((ref: any) => ref.type === 'replied_to')
      const quotedTweetRef = referencedTweets.find((ref: any) => ref.type === 'quoted')

      if (parentTweetRef) {
        const parentTweet = data.includes.tweets.find((t: any) => t.id === parentTweetRef.id)
        if (parentTweet) context.parentTweet = transformTweet(parentTweet)
      }

      if (!parentTweetRef && quotedTweetRef) {
        const quotedTweet = data.includes.tweets.find((t: any) => t.id === quotedTweetRef.id)
        if (quotedTweet) context.rootTweet = transformTweet(quotedTweet)
      }
    }

    let replies: XTweet[] = []
    if (params?.includeReplies && mainTweet.id) {
      try {
        const repliesExpansions = ['author_id', 'referenced_tweets.id'].join(',')
        const repliesTweetFields = [
          'created_at',
          'conversation_id',
          'in_reply_to_user_id',
          'public_metrics',
        ].join(',')

        const conversationId = mainTweet.conversationId || mainTweet.id
        const searchQuery = `conversation_id:${conversationId}`
        const searchParams = new URLSearchParams({
          query: searchQuery,
          expansions: repliesExpansions,
          'tweet.fields': repliesTweetFields,
          max_results: '100', // Max allowed
        })

        const repliesResponse = await fetch(
          `https://api.twitter.com/2/tweets/search/recent?${searchParams.toString()}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${params?.accessToken || ''}`,
              'Content-Type': 'application/json',
            },
          }
        )

        const repliesData = await repliesResponse.json()

        if (repliesData.data && Array.isArray(repliesData.data)) {
          replies = repliesData.data
            .filter((tweet: any) => tweet.id !== mainTweet.id)
            .map(transformTweet)
        }
      } catch (error) {
        logger.warn('Failed to fetch replies:', error)
      }
    }

    return {
      success: true,
      output: {
        tweet: mainTweet,
        replies: replies.length > 0 ? replies : undefined,
        context: Object.keys(context).length > 0 ? context : undefined,
      },
    }
  },

  outputs: {
    tweet: {
      type: 'object',
      description: 'The main tweet data',
      properties: {
        id: { type: 'string', description: 'Tweet ID' },
        text: { type: 'string', description: 'Tweet content text' },
        createdAt: { type: 'string', description: 'Tweet creation timestamp' },
        authorId: { type: 'string', description: 'ID of the tweet author' },
      },
    },
    context: {
      type: 'object',
      description: 'Conversation context including parent and root tweets',
      optional: true,
    },
  },
}
```

--------------------------------------------------------------------------------

````
