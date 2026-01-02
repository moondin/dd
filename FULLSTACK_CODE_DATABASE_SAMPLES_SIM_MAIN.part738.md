---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 738
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 738 of 933)

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

---[FILE: update.ts]---
Location: sim-main/apps/sim/tools/rds/update.ts

```typescript
import type { RdsUpdateParams, RdsUpdateResponse } from '@/tools/rds/types'
import type { ToolConfig } from '@/tools/types'

export const updateTool: ToolConfig<RdsUpdateParams, RdsUpdateResponse> = {
  id: 'rds_update',
  name: 'RDS Update',
  description: 'Update data in an Amazon RDS table using the Data API',
  version: '1.0',

  params: {
    region: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'AWS region (e.g., us-east-1)',
    },
    accessKeyId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'AWS access key ID',
    },
    secretAccessKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'AWS secret access key',
    },
    resourceArn: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ARN of the Aurora DB cluster',
    },
    secretArn: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ARN of the Secrets Manager secret containing DB credentials',
    },
    database: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Database name (optional)',
    },
    table: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Table name to update',
    },
    data: {
      type: 'object',
      required: true,
      visibility: 'user-or-llm',
      description: 'Data to update as key-value pairs',
    },
    conditions: {
      type: 'object',
      required: true,
      visibility: 'user-or-llm',
      description: 'Conditions for the update (e.g., {"id": 1})',
    },
  },

  request: {
    url: '/api/tools/rds/update',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      region: params.region,
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
      resourceArn: params.resourceArn,
      secretArn: params.secretArn,
      ...(params.database && { database: params.database }),
      table: params.table,
      data: params.data,
      conditions: params.conditions,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'RDS update failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Update executed successfully',
        rows: data.rows || [],
        rowCount: data.rowCount || 0,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    rows: { type: 'array', description: 'Array of updated rows' },
    rowCount: { type: 'number', description: 'Number of rows updated' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete.ts]---
Location: sim-main/apps/sim/tools/reddit/delete.ts

```typescript
import type { RedditDeleteParams, RedditWriteResponse } from '@/tools/reddit/types'
import type { ToolConfig } from '@/tools/types'

export const deleteTool: ToolConfig<RedditDeleteParams, RedditWriteResponse> = {
  id: 'reddit_delete',
  name: 'Delete Reddit Post/Comment',
  description: 'Delete your own Reddit post or comment',
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
      description: 'Thing fullname to delete (e.g., t3_xxxxx for post, t1_xxxxx for comment)',
    },
  },

  request: {
    url: () => 'https://oauth.reddit.com/api/del',
    method: 'POST',
    headers: (params: RedditDeleteParams) => {
      if (!params.accessToken) {
        throw new Error('Access token is required for Reddit API')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'User-Agent': 'sim-studio/1.0 (https://github.com/simstudioai/sim)',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    },
    body: (params: RedditDeleteParams) => {
      const formData = new URLSearchParams({
        id: params.id,
      })

      return {
        body: formData.toString(),
      }
    },
  },

  transformResponse: async (response: Response, requestParams?: RedditDeleteParams) => {
    // Reddit delete API returns empty JSON {} on success
    await response.json()

    if (response.ok) {
      return {
        success: true,
        output: {
          success: true,
          message: `Successfully deleted ${requestParams?.id}`,
        },
      }
    }

    return {
      success: false,
      output: {
        success: false,
        message: 'Failed to delete item',
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the deletion was successful',
    },
    message: {
      type: 'string',
      description: 'Success or error message',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: edit.ts]---
Location: sim-main/apps/sim/tools/reddit/edit.ts

```typescript
import type { RedditEditParams, RedditWriteResponse } from '@/tools/reddit/types'
import type { ToolConfig } from '@/tools/types'

export const editTool: ToolConfig<RedditEditParams, RedditWriteResponse> = {
  id: 'reddit_edit',
  name: 'Edit Reddit Post/Comment',
  description: 'Edit the text of your own Reddit post or comment',
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
    thing_id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Thing fullname to edit (e.g., t3_xxxxx for post, t1_xxxxx for comment)',
    },
    text: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'New text content in markdown format',
    },
  },

  request: {
    url: () => 'https://oauth.reddit.com/api/editusertext',
    method: 'POST',
    headers: (params: RedditEditParams) => {
      if (!params.accessToken) {
        throw new Error('Access token is required for Reddit API')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'User-Agent': 'sim-studio/1.0 (https://github.com/simstudioai/sim)',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    },
    body: (params: RedditEditParams) => {
      const formData = new URLSearchParams({
        thing_id: params.thing_id,
        text: params.text,
        api_type: 'json',
      })

      return formData.toString() as unknown as Record<string, any>
    },
  },

  transformResponse: async (response: Response, requestParams?: RedditEditParams) => {
    const data = await response.json()

    // Reddit API returns errors in json.errors array
    if (data.json?.errors && data.json.errors.length > 0) {
      const errors = data.json.errors.map((err: any) => err.join(': ')).join(', ')
      return {
        success: false,
        output: {
          success: false,
          message: `Failed to edit: ${errors}`,
        },
      }
    }

    // Success response
    const thingData = data.json?.data?.things?.[0]?.data
    return {
      success: true,
      output: {
        success: true,
        message: `Successfully edited ${requestParams?.thing_id}`,
        data: {
          id: thingData?.id,
          body: thingData?.body,
          selftext: thingData?.selftext,
        },
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the edit was successful',
    },
    message: {
      type: 'string',
      description: 'Success or error message',
    },
    data: {
      type: 'object',
      description: 'Updated content data',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_comments.ts]---
Location: sim-main/apps/sim/tools/reddit/get_comments.ts

```typescript
import type { RedditCommentsParams, RedditCommentsResponse } from '@/tools/reddit/types'
import type { ToolConfig } from '@/tools/types'

export const getCommentsTool: ToolConfig<RedditCommentsParams, RedditCommentsResponse> = {
  id: 'reddit_get_comments',
  name: 'Get Reddit Comments',
  description: 'Fetch comments from a specific Reddit post',
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
    postId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the Reddit post to fetch comments from',
    },
    subreddit: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The subreddit where the post is located (without the r/ prefix)',
    },
    sort: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Sort method for comments: "confidence", "top", "new", "controversial", "old", "random", "qa" (default: "confidence")',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of comments to return (default: 50, max: 100)',
    },
    depth: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Maximum depth of subtrees in the thread (controls nested comment levels)',
    },
    context: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of parent comments to include',
    },
    showedits: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Show edit information for comments',
    },
    showmore: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Include "load more comments" elements in the response',
    },
    showtitle: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Include submission title in the response',
    },
    threaded: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Return comments in threaded/nested format',
    },
    truncate: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Integer to truncate comment depth',
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
  },

  request: {
    url: (params: RedditCommentsParams) => {
      // Sanitize inputs
      const subreddit = params.subreddit.trim().replace(/^r\//, '')
      const sort = params.sort || 'confidence'
      const limit = Math.min(Math.max(1, params.limit || 50), 100)

      // Build URL with query parameters
      const urlParams = new URLSearchParams({
        sort: sort,
        limit: limit.toString(),
        raw_json: '1',
      })

      // Add comment-specific parameters if provided
      if (params.depth !== undefined) urlParams.append('depth', Number(params.depth).toString())
      if (params.context !== undefined)
        urlParams.append('context', Number(params.context).toString())
      if (params.showedits !== undefined) urlParams.append('showedits', params.showedits.toString())
      if (params.showmore !== undefined) urlParams.append('showmore', params.showmore.toString())
      if (params.showtitle !== undefined) urlParams.append('showtitle', params.showtitle.toString())
      if (params.threaded !== undefined) urlParams.append('threaded', params.threaded.toString())
      if (params.truncate !== undefined)
        urlParams.append('truncate', Number(params.truncate).toString())

      // Add pagination parameters if provided
      if (params.after) urlParams.append('after', params.after)
      if (params.before) urlParams.append('before', params.before)
      if (params.count !== undefined) urlParams.append('count', Number(params.count).toString())

      // Build URL using OAuth endpoint
      return `https://oauth.reddit.com/r/${subreddit}/comments/${params.postId}?${urlParams.toString()}`
    },
    method: 'GET',
    headers: (params: RedditCommentsParams) => {
      if (!params.accessToken?.trim()) {
        throw new Error('Access token is required for Reddit API')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'User-Agent': 'sim-studio/1.0 (https://github.com/simstudioai/sim)',
        Accept: 'application/json',
      }
    },
  },

  transformResponse: async (response: Response, requestParams?: RedditCommentsParams) => {
    const data = await response.json()

    // Extract post data (first element in the array)
    const postData = data[0]?.data?.children[0]?.data || {}

    // Extract and transform comments (second element in the array)
    const commentsData = data[1]?.data?.children || []

    // Recursive function to process nested comments
    const processComments = (comments: any[]): any[] => {
      return comments
        .map((comment) => {
          const commentData = comment.data

          // Skip non-comment items like "more" items
          if (!commentData || comment.kind !== 't1') {
            return null
          }

          // Process nested replies if they exist
          const replies = commentData.replies?.data?.children
            ? processComments(commentData.replies.data.children)
            : []

          return {
            id: commentData.id || '',
            author: commentData.author || '[deleted]',
            body: commentData.body || '',
            created_utc: commentData.created_utc || 0,
            score: commentData.score || 0,
            permalink: commentData.permalink
              ? `https://www.reddit.com${commentData.permalink}`
              : '',
            replies: replies.filter(Boolean),
          }
        })
        .filter(Boolean)
    }

    const comments = processComments(commentsData)

    return {
      success: true,
      output: {
        post: {
          id: postData.id || '',
          title: postData.title || '',
          author: postData.author || '[deleted]',
          selftext: postData.selftext || '',
          created_utc: postData.created_utc || 0,
          score: postData.score || 0,
          permalink: postData.permalink ? `https://www.reddit.com${postData.permalink}` : '',
        },
        comments: comments,
      },
    }
  },

  outputs: {
    post: {
      type: 'object',
      description: 'Post information including ID, title, author, content, and metadata',
      properties: {
        id: { type: 'string', description: 'Post ID' },
        title: { type: 'string', description: 'Post title' },
        author: { type: 'string', description: 'Post author' },
        selftext: { type: 'string', description: 'Post text content' },
        score: { type: 'number', description: 'Post score' },
        created_utc: { type: 'number', description: 'Creation timestamp' },
        permalink: { type: 'string', description: 'Reddit permalink' },
      },
    },
    comments: {
      type: 'array',
      description: 'Nested comments with author, body, score, timestamps, and replies',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Comment ID' },
          author: { type: 'string', description: 'Comment author' },
          body: { type: 'string', description: 'Comment text' },
          score: { type: 'number', description: 'Comment score' },
          created_utc: { type: 'number', description: 'Creation timestamp' },
          permalink: { type: 'string', description: 'Comment permalink' },
          replies: {
            type: 'array',
            description: 'Nested reply comments',
            items: { type: 'object', description: 'Nested comment with same structure' },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_controversial.ts]---
Location: sim-main/apps/sim/tools/reddit/get_controversial.ts

```typescript
import type { RedditControversialParams, RedditPostsResponse } from '@/tools/reddit/types'
import type { ToolConfig } from '@/tools/types'

export const getControversialTool: ToolConfig<RedditControversialParams, RedditPostsResponse> = {
  id: 'reddit_get_controversial',
  name: 'Get Reddit Controversial Posts',
  description: 'Fetch controversial posts from a subreddit',
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
      description: 'The name of the subreddit to fetch posts from (without the r/ prefix)',
    },
    time: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Time filter for controversial posts: "hour", "day", "week", "month", "year", or "all" (default: "all")',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of posts to return (default: 10, max: 100)',
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
    sr_detail: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Expand subreddit details in the response',
    },
  },

  request: {
    url: (params: RedditControversialParams) => {
      // Sanitize inputs
      const subreddit = params.subreddit.trim().replace(/^r\//, '')
      const limit = Math.min(Math.max(1, params.limit || 10), 100)

      // Build URL with appropriate parameters using OAuth endpoint
      const urlParams = new URLSearchParams({
        limit: limit.toString(),
        raw_json: '1',
      })

      // Add time filter
      if (params.time) {
        urlParams.append('t', params.time)
      }

      // Add pagination parameters if provided
      if (params.after) urlParams.append('after', params.after)
      if (params.before) urlParams.append('before', params.before)
      if (params.count !== undefined) urlParams.append('count', params.count.toString())
      if (params.show) urlParams.append('show', params.show)
      if (params.sr_detail !== undefined) urlParams.append('sr_detail', params.sr_detail.toString())

      return `https://oauth.reddit.com/r/${subreddit}/controversial?${urlParams.toString()}`
    },
    method: 'GET',
    headers: (params: RedditControversialParams) => {
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

  transformResponse: async (response: Response, requestParams?: RedditControversialParams) => {
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
      description: 'Name of the subreddit where posts were fetched from',
    },
    posts: {
      type: 'array',
      description:
        'Array of controversial posts with title, author, URL, score, comments count, and metadata',
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

---[FILE: get_posts.ts]---
Location: sim-main/apps/sim/tools/reddit/get_posts.ts

```typescript
import type { RedditPostsParams, RedditPostsResponse } from '@/tools/reddit/types'
import type { ToolConfig } from '@/tools/types'

export const getPostsTool: ToolConfig<RedditPostsParams, RedditPostsResponse> = {
  id: 'reddit_get_posts',
  name: 'Get Reddit Posts',
  description: 'Fetch posts from a subreddit with different sorting options',
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
      description: 'The name of the subreddit to fetch posts from (without the r/ prefix)',
    },
    sort: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Sort method for posts: "hot", "new", "top", or "rising" (default: "hot")',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of posts to return (default: 10, max: 100)',
    },
    time: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Time filter for "top" sorted posts: "day", "week", "month", "year", or "all" (default: "day")',
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
    sr_detail: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Expand subreddit details in the response',
    },
  },

  request: {
    url: (params: RedditPostsParams) => {
      // Sanitize inputs
      const subreddit = params.subreddit.trim().replace(/^r\//, '')
      const sort = params.sort || 'hot'
      const limit = Math.min(Math.max(1, params.limit || 10), 100)

      // Build URL with appropriate parameters using OAuth endpoint
      const urlParams = new URLSearchParams({
        limit: limit.toString(),
        raw_json: '1',
      })

      // Add time parameter only for 'top' sorting
      if (sort === 'top' && params.time !== undefined && params.time !== null) {
        urlParams.append('t', params.time)
      }

      // Add pagination parameters if provided
      if (params.after !== undefined && params.after !== null && params.after !== '')
        urlParams.append('after', params.after)
      if (params.before !== undefined && params.before !== null && params.before !== '')
        urlParams.append('before', params.before)
      if (params.count !== undefined && params.count !== null)
        urlParams.append('count', params.count.toString())
      if (params.show !== undefined && params.show !== null && params.show !== '')
        urlParams.append('show', params.show)
      if (params.sr_detail !== undefined && params.sr_detail !== null)
        urlParams.append('sr_detail', params.sr_detail.toString())

      return `https://oauth.reddit.com/r/${subreddit}/${sort}?${urlParams.toString()}`
    },
    method: 'GET',
    headers: (params: RedditPostsParams) => {
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

  transformResponse: async (response: Response, requestParams?: RedditPostsParams) => {
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
      description: 'Name of the subreddit where posts were fetched from',
    },
    posts: {
      type: 'array',
      description: 'Array of posts with title, author, URL, score, comments count, and metadata',
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

---[FILE: hot_posts.ts]---
Location: sim-main/apps/sim/tools/reddit/hot_posts.ts

```typescript
import type { RedditHotPostsResponse, RedditPost } from '@/tools/reddit/types'
import type { ToolConfig } from '@/tools/types'

interface HotPostsParams {
  subreddit: string
  limit?: number
  accessToken: string
}

export const hotPostsTool: ToolConfig<HotPostsParams, RedditHotPostsResponse> = {
  id: 'reddit_hot_posts',
  name: 'Reddit Hot Posts',
  description: 'Fetch the most popular (hot) posts from a specified subreddit.',
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
      description: 'The name of the subreddit to fetch posts from (without the r/ prefix)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of posts to return (default: 10, max: 100)',
    },
  },

  request: {
    url: (params) => {
      // Sanitize inputs and enforce limits
      const subreddit = params.subreddit.trim().replace(/^r\//, '')
      const limit = Math.min(Math.max(1, params.limit || 10), 100)

      return `https://oauth.reddit.com/r/${subreddit}/hot?limit=${limit}&raw_json=1`
    },
    method: 'GET',
    headers: (params: HotPostsParams) => {
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

  transformResponse: async (response: Response, requestParams?: HotPostsParams) => {
    const data = await response.json()

    // Process the posts data with proper error handling
    const posts: RedditPost[] = data.data.children.map((child: any) => {
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
        selftext: post.selftext || '',
        thumbnail:
          post.thumbnail !== 'self' && post.thumbnail !== 'default' ? post.thumbnail : undefined,
        is_self: !!post.is_self,
        subreddit: post.subreddit || requestParams?.subreddit || '',
        subreddit_name_prefixed: post.subreddit_name_prefixed || '',
      }
    })

    // Extract the subreddit name from the response data with fallback
    const subreddit =
      data.data?.children?.[0]?.data?.subreddit ||
      (posts.length > 0 ? posts[0].subreddit : requestParams?.subreddit || '')

    return {
      success: true,
      output: {
        subreddit,
        posts,
      },
    }
  },

  outputs: {
    subreddit: {
      type: 'string',
      description: 'Name of the subreddit where hot posts were fetched from',
    },
    posts: {
      type: 'array',
      description:
        'Array of hot posts with title, author, URL, score, comments count, and metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/reddit/index.ts

```typescript
import { deleteTool } from '@/tools/reddit/delete'
import { editTool } from '@/tools/reddit/edit'
import { getCommentsTool } from '@/tools/reddit/get_comments'
import { getControversialTool } from '@/tools/reddit/get_controversial'
import { getPostsTool } from '@/tools/reddit/get_posts'
import { hotPostsTool } from '@/tools/reddit/hot_posts'
import { replyTool } from '@/tools/reddit/reply'
import { saveTool, unsaveTool } from '@/tools/reddit/save'
import { searchTool } from '@/tools/reddit/search'
import { submitPostTool } from '@/tools/reddit/submit_post'
import { subscribeTool } from '@/tools/reddit/subscribe'
import { voteTool } from '@/tools/reddit/vote'

export const redditHotPostsTool = hotPostsTool
export const redditGetPostsTool = getPostsTool
export const redditGetCommentsTool = getCommentsTool
export const redditGetControversialTool = getControversialTool
export const redditSearchTool = searchTool
export const redditSubmitPostTool = submitPostTool
export const redditVoteTool = voteTool
export const redditSaveTool = saveTool
export const redditUnsaveTool = unsaveTool
export const redditReplyTool = replyTool
export const redditEditTool = editTool
export const redditDeleteTool = deleteTool
export const redditSubscribeTool = subscribeTool
```

--------------------------------------------------------------------------------

---[FILE: reply.ts]---
Location: sim-main/apps/sim/tools/reddit/reply.ts

```typescript
import type { RedditReplyParams, RedditWriteResponse } from '@/tools/reddit/types'
import type { ToolConfig } from '@/tools/types'

export const replyTool: ToolConfig<RedditReplyParams, RedditWriteResponse> = {
  id: 'reddit_reply',
  name: 'Reply to Reddit Post/Comment',
  description: 'Add a comment reply to a Reddit post or comment',
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
    parent_id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Thing fullname to reply to (e.g., t3_xxxxx for post, t1_xxxxx for comment)',
    },
    text: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comment text in markdown format',
    },
  },

  request: {
    url: () => 'https://oauth.reddit.com/api/comment',
    method: 'POST',
    headers: (params: RedditReplyParams) => {
      if (!params.accessToken) {
        throw new Error('Access token is required for Reddit API')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'User-Agent': 'sim-studio/1.0 (https://github.com/simstudioai/sim)',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    },
    body: (params: RedditReplyParams) => {
      const formData = new URLSearchParams({
        thing_id: params.parent_id,
        text: params.text,
        api_type: 'json',
      })

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
          message: `Failed to post reply: ${errors}`,
        },
      }
    }

    // Success response includes comment data
    const commentData = data.json?.data?.things?.[0]?.data
    return {
      success: true,
      output: {
        success: true,
        message: 'Reply posted successfully',
        data: {
          id: commentData?.id,
          name: commentData?.name,
          permalink: commentData?.permalink
            ? `https://www.reddit.com${commentData.permalink}`
            : undefined,
          body: commentData?.body,
        },
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the reply was posted successfully',
    },
    message: {
      type: 'string',
      description: 'Success or error message',
    },
    data: {
      type: 'object',
      description: 'Comment data including ID, name, permalink, and body',
    },
  },
}
```

--------------------------------------------------------------------------------

````
