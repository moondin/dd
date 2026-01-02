---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 739
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 739 of 933)

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

---[FILE: save.ts]---
Location: sim-main/apps/sim/tools/reddit/save.ts

```typescript
import type { RedditSaveParams, RedditWriteResponse } from '@/tools/reddit/types'
import type { ToolConfig } from '@/tools/types'

export const saveTool: ToolConfig<RedditSaveParams, RedditWriteResponse> = {
  id: 'reddit_save',
  name: 'Save Reddit Post/Comment',
  description: 'Save a Reddit post or comment to your saved items',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'reddit',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Reddit API',
    },
    id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Thing fullname to save (e.g., t3_xxxxx for post, t1_xxxxx for comment)',
    },
    category: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Category to save under (Reddit Gold feature)',
    },
  },

  request: {
    url: () => 'https://oauth.reddit.com/api/save',
    method: 'POST',
    headers: (params: RedditSaveParams) => {
      if (!params.accessToken) {
        throw new Error('Access token is required for Reddit API')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'User-Agent': 'sim-studio/1.0 (https://github.com/simstudioai/sim)',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    },
    body: (params: RedditSaveParams) => {
      const formData = new URLSearchParams({
        id: params.id,
      })

      if (params.category) {
        formData.append('category', params.category)
      }

      return formData.toString() as unknown as Record<string, any>
    },
  },

  transformResponse: async (response: Response, requestParams?: RedditSaveParams) => {
    // Reddit save API returns empty JSON {} on success
    await response.json()

    if (response.ok) {
      return {
        success: true,
        output: {
          success: true,
          message: `Successfully saved ${requestParams?.id}`,
        },
      }
    }

    return {
      success: false,
      output: {
        success: false,
        message: 'Failed to save item',
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the save was successful',
    },
    message: {
      type: 'string',
      description: 'Success or error message',
    },
  },
}

export const unsaveTool: ToolConfig<RedditSaveParams, RedditWriteResponse> = {
  id: 'reddit_unsave',
  name: 'Unsave Reddit Post/Comment',
  description: 'Remove a Reddit post or comment from your saved items',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'reddit',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Reddit API',
    },
    id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Thing fullname to unsave (e.g., t3_xxxxx for post, t1_xxxxx for comment)',
    },
  },

  request: {
    url: () => 'https://oauth.reddit.com/api/unsave',
    method: 'POST',
    headers: (params: RedditSaveParams) => {
      if (!params.accessToken) {
        throw new Error('Access token is required for Reddit API')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'User-Agent': 'sim-studio/1.0 (https://github.com/simstudioai/sim)',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    },
    body: (params: RedditSaveParams) => {
      const formData = new URLSearchParams({
        id: params.id,
      })

      return formData.toString() as unknown as Record<string, any>
    },
  },

  transformResponse: async (response: Response, requestParams?: RedditSaveParams) => {
    // Reddit unsave API returns empty JSON {} on success
    await response.json()

    if (response.ok) {
      return {
        success: true,
        output: {
          success: true,
          message: `Successfully unsaved ${requestParams?.id}`,
        },
      }
    }

    return {
      success: false,
      output: {
        success: false,
        message: 'Failed to unsave item',
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the unsave was successful',
    },
    message: {
      type: 'string',
      description: 'Success or error message',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search.ts]---
Location: sim-main/apps/sim/tools/reddit/search.ts

```typescript
import type { RedditPostsResponse, RedditSearchParams } from '@/tools/reddit/types'
import type { ToolConfig } from '@/tools/types'

export const searchTool: ToolConfig<RedditSearchParams, RedditPostsResponse> = {
  id: 'reddit_search',
  name: 'Search Reddit',
  description: 'Search for posts within a subreddit',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'reddit',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Reddit API',
    },
    subreddit: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the subreddit to search in (without the r/ prefix)',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Search query text',
    },
    sort: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Sort method for search results: "relevance", "hot", "top", "new", or "comments" (default: "relevance")',
    },
    time: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Time filter for search results: "hour", "day", "week", "month", "year", or "all" (default: "all")',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of posts to return (default: 10, max: 100)',
    },
    restrict_sr: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Restrict search to the specified subreddit only (default: true)',
    },
    after: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Fullname of a thing to fetch items after (for pagination)',
    },
    before: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Fullname of a thing to fetch items before (for pagination)',
    },
    count: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'A count of items already seen in the listing (used for numbering)',
    },
    show: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Show items that would normally be filtered (e.g., "all")',
    },
  },

  request: {
    url: (params: RedditSearchParams) => {
      // Sanitize inputs
      const subreddit = params.subreddit.trim().replace(/^r\//, '')
      const sort = params.sort || 'relevance'
      const limit = Math.min(Math.max(1, params.limit || 10), 100)
      const restrict_sr = params.restrict_sr !== false // Default to true

      // Build URL with appropriate parameters using OAuth endpoint
      const urlParams = new URLSearchParams({
        q: params.query,
        sort: sort,
        limit: limit.toString(),
        restrict_sr: restrict_sr.toString(),
        raw_json: '1',
      })

      // Add time filter if provided
      if (params.time) {
        urlParams.append('t', params.time)
      }

      // Add pagination parameters if provided
      if (params.after) urlParams.append('after', params.after)
      if (params.before) urlParams.append('before', params.before)
      if (params.count !== undefined) urlParams.append('count', Number(params.count).toString())
      if (params.show) urlParams.append('show', params.show)

      return `https://oauth.reddit.com/r/${subreddit}/search?${urlParams.toString()}`
    },
    method: 'GET',
    headers: (params: RedditSearchParams) => {
      if (!params.accessToken) {
        throw new Error('Access token is required for Reddit API')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'User-Agent': 'sim-studio/1.0 (https://github.com/simstudioai/sim)',
        Accept: 'application/json',
      }
    },
  },

  transformResponse: async (response: Response, requestParams?: RedditSearchParams) => {
    const data = await response.json()

    // Extract subreddit name from response (with fallback)
    const subredditName =
      data.data?.children[0]?.data?.subreddit || requestParams?.subreddit || 'unknown'

    // Transform posts data
    const posts =
      data.data?.children?.map((child: any) => {
        const post = child.data || {}
        return {
          id: post.id || '',
          title: post.title || '',
          author: post.author || '[deleted]',
          url: post.url || '',
          permalink: post.permalink ? `https://www.reddit.com${post.permalink}` : '',
          created_utc: post.created_utc || 0,
          score: post.score || 0,
          num_comments: post.num_comments || 0,
          is_self: !!post.is_self,
          selftext: post.selftext || '',
          thumbnail: post.thumbnail || '',
          subreddit: post.subreddit || subredditName,
        }
      }) || []

    return {
      success: true,
      output: {
        subreddit: subredditName,
        posts,
      },
    }
  },

  outputs: {
    subreddit: {
      type: 'string',
      description: 'Name of the subreddit where search was performed',
    },
    posts: {
      type: 'array',
      description:
        'Array of search result posts with title, author, URL, score, comments count, and metadata',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Post ID' },
          title: { type: 'string', description: 'Post title' },
          author: { type: 'string', description: 'Author username' },
          url: { type: 'string', description: 'Post URL' },
          permalink: { type: 'string', description: 'Reddit permalink' },
          score: { type: 'number', description: 'Post score (upvotes - downvotes)' },
          num_comments: { type: 'number', description: 'Number of comments' },
          created_utc: { type: 'number', description: 'Creation timestamp (UTC)' },
          is_self: { type: 'boolean', description: 'Whether this is a text post' },
          selftext: { type: 'string', description: 'Text content for self posts' },
          thumbnail: { type: 'string', description: 'Thumbnail URL' },
          subreddit: { type: 'string', description: 'Subreddit name' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: submit_post.ts]---
Location: sim-main/apps/sim/tools/reddit/submit_post.ts

```typescript
import type { RedditSubmitParams, RedditWriteResponse } from '@/tools/reddit/types'
import type { ToolConfig } from '@/tools/types'

export const submitPostTool: ToolConfig<RedditSubmitParams, RedditWriteResponse> = {
  id: 'reddit_submit_post',
  name: 'Submit Reddit Post',
  description: 'Submit a new post to a subreddit (text or link)',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'reddit',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Reddit API',
    },
    subreddit: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the subreddit to post to (without the r/ prefix)',
    },
    title: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Title of the submission (max 300 characters)',
    },
    text: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Text content for a self post (markdown supported)',
    },
    url: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'URL for a link post (cannot be used with text)',
    },
    nsfw: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Mark post as NSFW',
    },
    spoiler: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Mark post as spoiler',
    },
    send_replies: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Send reply notifications to inbox (default: true)',
    },
  },

  request: {
    url: () => 'https://oauth.reddit.com/api/submit',
    method: 'POST',
    headers: (params: RedditSubmitParams) => {
      if (!params.accessToken) {
        throw new Error('Access token is required for Reddit API')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'User-Agent': 'sim-studio/1.0 (https://github.com/simstudioai/sim)',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    },
    body: (params: RedditSubmitParams) => {
      // Sanitize subreddit
      const subreddit = params.subreddit.trim().replace(/^r\//, '')

      // Build form data
      const formData = new URLSearchParams({
        sr: subreddit,
        title: params.title,
        api_type: 'json',
      })

      // Determine post kind (self or link)
      if (params.text) {
        formData.append('kind', 'self')
        formData.append('text', params.text)
      } else if (params.url) {
        formData.append('kind', 'link')
        formData.append('url', params.url)
      } else {
        formData.append('kind', 'self')
        formData.append('text', '')
      }

      // Add optional parameters
      if (params.nsfw !== undefined) formData.append('nsfw', params.nsfw.toString())
      if (params.spoiler !== undefined) formData.append('spoiler', params.spoiler.toString())
      if (params.send_replies !== undefined)
        formData.append('sendreplies', params.send_replies.toString())

      return formData.toString() as unknown as Record<string, any>
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    // Reddit API returns errors in json.errors array
    if (data.json?.errors && data.json.errors.length > 0) {
      const errors = data.json.errors.map((err: any) => err.join(': ')).join(', ')
      return {
        success: false,
        output: {
          success: false,
          message: `Failed to submit post: ${errors}`,
        },
      }
    }

    // Success response includes post data
    const postData = data.json?.data
    return {
      success: true,
      output: {
        success: true,
        message: 'Post submitted successfully',
        data: {
          id: postData?.id,
          name: postData?.name,
          url: postData?.url,
          permalink: `https://www.reddit.com${postData?.url}`,
        },
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the post was submitted successfully',
    },
    message: {
      type: 'string',
      description: 'Success or error message',
    },
    data: {
      type: 'object',
      description: 'Post data including ID, name, URL, and permalink',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: subscribe.ts]---
Location: sim-main/apps/sim/tools/reddit/subscribe.ts

```typescript
import type { RedditSubscribeParams, RedditWriteResponse } from '@/tools/reddit/types'
import type { ToolConfig } from '@/tools/types'

export const subscribeTool: ToolConfig<RedditSubscribeParams, RedditWriteResponse> = {
  id: 'reddit_subscribe',
  name: 'Subscribe/Unsubscribe from Subreddit',
  description: 'Subscribe or unsubscribe from a subreddit',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'reddit',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Reddit API',
    },
    subreddit: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the subreddit (without the r/ prefix)',
    },
    action: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Action to perform: "sub" to subscribe or "unsub" to unsubscribe',
    },
  },

  request: {
    url: () => 'https://oauth.reddit.com/api/subscribe',
    method: 'POST',
    headers: (params: RedditSubscribeParams) => {
      if (!params.accessToken) {
        throw new Error('Access token is required for Reddit API')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'User-Agent': 'sim-studio/1.0 (https://github.com/simstudioai/sim)',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    },
    body: (params: RedditSubscribeParams) => {
      // Validate action
      if (!['sub', 'unsub'].includes(params.action)) {
        throw new Error('action must be "sub" or "unsub"')
      }

      // Sanitize subreddit
      const subreddit = params.subreddit.trim().replace(/^r\//, '')

      const formData = new URLSearchParams({
        action: params.action,
        sr_name: subreddit,
      })

      return formData.toString() as unknown as Record<string, any>
    },
  },

  transformResponse: async (response: Response, requestParams?: RedditSubscribeParams) => {
    // Reddit subscribe API returns empty JSON {} on success
    await response.json()

    if (response.ok) {
      const actionText =
        requestParams?.action === 'sub'
          ? `subscribed to r/${requestParams?.subreddit || 'subreddit'}`
          : `unsubscribed from r/${requestParams?.subreddit || 'subreddit'}`

      return {
        success: true,
        output: {
          success: true,
          message: `Successfully ${actionText}`,
        },
      }
    }

    return {
      success: false,
      output: {
        success: false,
        message: 'Failed to update subscription',
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the subscription action was successful',
    },
    message: {
      type: 'string',
      description: 'Success or error message',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/reddit/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface RedditPost {
  id: string
  title: string
  author: string
  url: string
  permalink: string
  created_utc: number
  score: number
  num_comments: number
  selftext?: string
  thumbnail?: string
  is_self: boolean
  subreddit: string
  subreddit_name_prefixed: string
}

export interface RedditComment {
  id: string
  author: string
  body: string
  created_utc: number
  score: number
  permalink: string
  replies: RedditComment[]
}

export interface RedditHotPostsResponse extends ToolResponse {
  output: {
    subreddit: string
    posts: RedditPost[]
  }
}

// Parameters for the generalized get_posts tool
export interface RedditPostsParams {
  subreddit: string
  sort?: 'hot' | 'new' | 'top' | 'rising'
  limit?: number
  time?: 'day' | 'week' | 'month' | 'year' | 'all'
  // Pagination parameters
  after?: string
  before?: string
  count?: number
  show?: string
  sr_detail?: boolean
  accessToken?: string
}

// Response for the generalized get_posts tool
export interface RedditPostsResponse extends ToolResponse {
  output: {
    subreddit: string
    posts: RedditPost[]
  }
}

// Parameters for the get_comments tool
export interface RedditCommentsParams {
  postId: string
  subreddit: string
  sort?: 'confidence' | 'top' | 'new' | 'controversial' | 'old' | 'random' | 'qa'
  limit?: number
  // Comment-specific parameters
  depth?: number
  context?: number
  showedits?: boolean
  showmore?: boolean
  showtitle?: boolean
  threaded?: boolean
  truncate?: number
  // Pagination parameters
  after?: string
  before?: string
  count?: number
  accessToken?: string
}

// Response for the get_comments tool
export interface RedditCommentsResponse extends ToolResponse {
  output: {
    post: {
      id: string
      title: string
      author: string
      selftext?: string
      created_utc: number
      score: number
      permalink: string
    }
    comments: RedditComment[]
  }
}

// Parameters for controversial posts
export interface RedditControversialParams {
  subreddit: string
  time?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all'
  limit?: number
  after?: string
  before?: string
  count?: number
  show?: string
  sr_detail?: boolean
  accessToken?: string
}

// Parameters for search
export interface RedditSearchParams {
  subreddit: string
  query: string
  sort?: 'relevance' | 'hot' | 'top' | 'new' | 'comments'
  time?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all'
  limit?: number
  after?: string
  before?: string
  count?: number
  show?: string
  restrict_sr?: boolean
  accessToken?: string
}

// Parameters for submit post
export interface RedditSubmitParams {
  subreddit: string
  title: string
  text?: string
  url?: string
  nsfw?: boolean
  spoiler?: boolean
  send_replies?: boolean
  accessToken?: string
}

// Parameters for vote
export interface RedditVoteParams {
  id: string // Thing fullname (e.g., t3_xxxxx for post, t1_xxxxx for comment)
  dir: 1 | 0 | -1 // 1 = upvote, 0 = unvote, -1 = downvote
  accessToken?: string
}

// Parameters for save/unsave
export interface RedditSaveParams {
  id: string // Thing fullname
  category?: string // Save category
  accessToken?: string
}

// Parameters for reply
export interface RedditReplyParams {
  parent_id: string // Thing fullname to reply to
  text: string // Comment text in markdown
  accessToken?: string
}

// Parameters for edit
export interface RedditEditParams {
  thing_id: string // Thing fullname to edit
  text: string // New text in markdown
  accessToken?: string
}

// Parameters for delete
export interface RedditDeleteParams {
  id: string // Thing fullname to delete
  accessToken?: string
}

// Parameters for subscribe/unsubscribe
export interface RedditSubscribeParams {
  subreddit: string
  action: 'sub' | 'unsub'
  accessToken?: string
}

// Generic success response for write operations
export interface RedditWriteResponse extends ToolResponse {
  output: {
    success: boolean
    message?: string
    data?: any
  }
}

export type RedditResponse =
  | RedditHotPostsResponse
  | RedditPostsResponse
  | RedditCommentsResponse
  | RedditWriteResponse
```

--------------------------------------------------------------------------------

---[FILE: vote.ts]---
Location: sim-main/apps/sim/tools/reddit/vote.ts

```typescript
import type { RedditVoteParams, RedditWriteResponse } from '@/tools/reddit/types'
import type { ToolConfig } from '@/tools/types'

export const voteTool: ToolConfig<RedditVoteParams, RedditWriteResponse> = {
  id: 'reddit_vote',
  name: 'Vote on Reddit Post/Comment',
  description: 'Upvote, downvote, or unvote a Reddit post or comment',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'reddit',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for Reddit API',
    },
    id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Thing fullname to vote on (e.g., t3_xxxxx for post, t1_xxxxx for comment)',
    },
    dir: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'Vote direction: 1 (upvote), 0 (unvote), or -1 (downvote)',
    },
  },

  request: {
    url: () => 'https://oauth.reddit.com/api/vote',
    method: 'POST',
    headers: (params: RedditVoteParams) => {
      if (!params.accessToken) {
        throw new Error('Access token is required for Reddit API')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'User-Agent': 'sim-studio/1.0 (https://github.com/simstudioai/sim)',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    },
    body: (params: RedditVoteParams) => {
      // Validate dir parameter
      if (![1, 0, -1].includes(params.dir)) {
        throw new Error('dir must be 1 (upvote), 0 (unvote), or -1 (downvote)')
      }

      const formData = new URLSearchParams({
        id: params.id,
        dir: params.dir.toString(),
      })

      return formData.toString() as unknown as Record<string, any>
    },
  },

  transformResponse: async (response: Response, requestParams?: RedditVoteParams) => {
    // Reddit vote API returns empty JSON {} on success
    const data = await response.json()

    if (response.ok) {
      const action =
        requestParams?.dir === 1 ? 'upvoted' : requestParams?.dir === -1 ? 'downvoted' : 'unvoted'

      return {
        success: true,
        output: {
          success: true,
          message: `Successfully ${action} ${requestParams?.id}`,
        },
      }
    }

    return {
      success: false,
      output: {
        success: false,
        message: 'Failed to vote',
        data,
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the vote was successful',
    },
    message: {
      type: 'string',
      description: 'Success or error message',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/resend/index.ts

```typescript
import { mailSendTool } from '@/tools/resend/send'

export { mailSendTool }
```

--------------------------------------------------------------------------------

---[FILE: send.ts]---
Location: sim-main/apps/sim/tools/resend/send.ts

```typescript
import type { MailSendParams, MailSendResult } from '@/tools/resend/types'
import type { ToolConfig } from '@/tools/types'

export const mailSendTool: ToolConfig<MailSendParams, MailSendResult> = {
  id: 'resend_send',
  name: 'Send Email',
  description: 'Send an email using your own Resend API key and from address',
  version: '1.0.0',

  params: {
    fromAddress: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Email address to send from',
    },
    to: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Recipient email address',
    },
    subject: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Email subject',
    },
    body: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Email body content',
    },
    contentType: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Content type for the email body (text or html)',
    },
    resendApiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Resend API key for sending emails',
    },
  },

  request: {
    url: '/api/tools/mail/send',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: MailSendParams) => ({
      resendApiKey: params.resendApiKey,
      fromAddress: params.fromAddress,
      to: params.to,
      subject: params.subject,
      body: params.body,
      contentType: params.contentType || 'text',
    }),
  },

  transformResponse: async (response: Response, params): Promise<MailSendResult> => {
    const result = await response.json()

    return {
      success: true,
      output: {
        success: result.success,
        to: params?.to || '',
        subject: params?.subject || '',
        body: params?.body || '',
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the email was sent successfully' },
    to: { type: 'string', description: 'Recipient email address' },
    subject: { type: 'string', description: 'Email subject' },
    body: { type: 'string', description: 'Email body content' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/resend/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface MailSendParams {
  resendApiKey: string
  fromAddress: string
  to: string
  subject: string
  body: string
  contentType?: 'text' | 'html'
}

export interface MailSendResult extends ToolResponse {
  output: {
    success: boolean
    to: string
    subject: string
    body: string
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/response/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface ResponseBlockOutput extends ToolResponse {
  success: boolean
  output: {
    data: Record<string, any>
    status: number
    headers: Record<string, string>
  }
}
```

--------------------------------------------------------------------------------

---[FILE: copy_object.ts]---
Location: sim-main/apps/sim/tools/s3/copy_object.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export const s3CopyObjectTool: ToolConfig = {
  id: 's3_copy_object',
  name: 'S3 Copy Object',
  description: 'Copy an object within or between AWS S3 buckets',
  version: '1.0.0',

  params: {
    accessKeyId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your AWS Access Key ID',
    },
    secretAccessKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your AWS Secret Access Key',
    },
    region: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'AWS region (e.g., us-east-1)',
    },
    sourceBucket: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Source bucket name',
    },
    sourceKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Source object key/path',
    },
    destinationBucket: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Destination bucket name',
    },
    destinationKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Destination object key/path',
    },
    acl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Access control list for the copied object (e.g., private, public-read)',
    },
  },

  request: {
    url: '/api/tools/s3/copy-object',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
      region: params.region,
      sourceBucket: params.sourceBucket,
      sourceKey: params.sourceKey,
      destinationBucket: params.destinationBucket,
      destinationKey: params.destinationKey,
      acl: params.acl,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!data.success) {
      return {
        success: false,
        output: {
          url: '',
          metadata: {
            error: data.error || 'Failed to copy object',
          },
        },
        error: data.error,
      }
    }

    return {
      success: true,
      output: {
        url: data.output.url,
        metadata: {
          copySourceVersionId: data.output.copySourceVersionId,
          versionId: data.output.versionId,
          etag: data.output.etag,
        },
      },
    }
  },

  outputs: {
    url: {
      type: 'string',
      description: 'URL of the copied S3 object',
    },
    metadata: {
      type: 'object',
      description: 'Copy operation metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_object.ts]---
Location: sim-main/apps/sim/tools/s3/delete_object.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export const s3DeleteObjectTool: ToolConfig = {
  id: 's3_delete_object',
  name: 'S3 Delete Object',
  description: 'Delete an object from an AWS S3 bucket',
  version: '1.0.0',

  params: {
    accessKeyId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your AWS Access Key ID',
    },
    secretAccessKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your AWS Secret Access Key',
    },
    region: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'AWS region (e.g., us-east-1)',
    },
    bucketName: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'S3 bucket name',
    },
    objectKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Object key/path to delete',
    },
  },

  request: {
    url: '/api/tools/s3/delete-object',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
      region: params.region,
      bucketName: params.bucketName,
      objectKey: params.objectKey,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!data.success) {
      return {
        success: false,
        output: {
          deleted: false,
          metadata: {
            error: data.error || 'Failed to delete object',
          },
        },
        error: data.error,
      }
    }

    return {
      success: true,
      output: {
        deleted: true,
        metadata: {
          key: data.output.key,
          deleteMarker: data.output.deleteMarker,
          versionId: data.output.versionId,
        },
      },
    }
  },

  outputs: {
    deleted: {
      type: 'boolean',
      description: 'Whether the object was successfully deleted',
    },
    metadata: {
      type: 'object',
      description: 'Deletion metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_object.ts]---
Location: sim-main/apps/sim/tools/s3/get_object.ts

```typescript
import crypto from 'crypto'
import {
  encodeS3PathComponent,
  generatePresignedUrl,
  getSignatureKey,
  parseS3Uri,
} from '@/tools/s3/utils'
import type { ToolConfig } from '@/tools/types'

export const s3GetObjectTool: ToolConfig = {
  id: 's3_get_object',
  name: 'S3 Get Object',
  description: 'Retrieve an object from an AWS S3 bucket',
  version: '1.0.0',

  params: {
    accessKeyId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your AWS Access Key ID',
    },
    secretAccessKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your AWS Secret Access Key',
    },
    s3Uri: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'S3 Object URL',
    },
  },

  request: {
    url: (params) => {
      try {
        const { bucketName, region, objectKey } = parseS3Uri(params.s3Uri)

        params.bucketName = bucketName
        params.region = region
        params.objectKey = objectKey

        return `https://${bucketName}.s3.${region}.amazonaws.com/${encodeS3PathComponent(objectKey)}`
      } catch (_error) {
        throw new Error(
          'Invalid S3 Object URL format. Expected format: https://bucket-name.s3.region.amazonaws.com/path/to/file'
        )
      }
    },
    method: 'HEAD',
    headers: (params) => {
      try {
        // Parse S3 URI if not already parsed
        if (!params.bucketName || !params.region || !params.objectKey) {
          const { bucketName, region, objectKey } = parseS3Uri(params.s3Uri)
          params.bucketName = bucketName
          params.region = region
          params.objectKey = objectKey
        }

        // Use UTC time explicitly
        const date = new Date()
        const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, '')
        const dateStamp = amzDate.slice(0, 8)

        const method = 'HEAD'
        const encodedPath = encodeS3PathComponent(params.objectKey)
        const canonicalUri = `/${encodedPath}`
        const canonicalQueryString = ''
        const payloadHash = crypto.createHash('sha256').update('').digest('hex')
        const host = `${params.bucketName}.s3.${params.region}.amazonaws.com`
        const canonicalHeaders =
          `host:${host}\n` + `x-amz-content-sha256:${payloadHash}\n` + `x-amz-date:${amzDate}\n`
        const signedHeaders = 'host;x-amz-content-sha256;x-amz-date'
        const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`

        const algorithm = 'AWS4-HMAC-SHA256'
        const credentialScope = `${dateStamp}/${params.region}/s3/aws4_request`
        const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${crypto.createHash('sha256').update(canonicalRequest).digest('hex')}`

        const signingKey = getSignatureKey(params.secretAccessKey, dateStamp, params.region, 's3')
        const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex')

        const authorizationHeader = `${algorithm} Credential=${params.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

        return {
          Host: host,
          'X-Amz-Content-Sha256': payloadHash,
          'X-Amz-Date': amzDate,
          Authorization: authorizationHeader,
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        throw new Error(`Failed to generate request headers: ${errorMessage}`)
      }
    },
  },

  transformResponse: async (response: Response, params) => {
    // Parse S3 URI if not already parsed
    if (!params.bucketName || !params.region || !params.objectKey) {
      const { bucketName, region, objectKey } = parseS3Uri(params.s3Uri)
      params.bucketName = bucketName
      params.region = region
      params.objectKey = objectKey
    }

    // Get file metadata
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const contentLength = Number.parseInt(response.headers.get('content-length') || '0', 10)
    const lastModified = response.headers.get('last-modified') || new Date().toISOString()
    const fileName = params.objectKey.split('/').pop() || params.objectKey

    // Generate pre-signed URL for download
    const url = generatePresignedUrl(params, 3600)

    return {
      success: true,
      output: {
        url,
        metadata: {
          fileType: contentType,
          size: contentLength,
          name: fileName,
          lastModified: lastModified,
        },
      },
    }
  },

  outputs: {
    url: {
      type: 'string',
      description: 'Pre-signed URL for downloading the S3 object',
    },
    metadata: {
      type: 'object',
      description: 'File metadata including type, size, name, and last modified date',
    },
  },
}
```

--------------------------------------------------------------------------------

````
