---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 778
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 778 of 933)

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

---[FILE: search.ts]---
Location: sim-main/apps/sim/tools/x/search.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { XSearchParams, XSearchResponse } from '@/tools/x/types'
import { transformTweet, transformUser } from '@/tools/x/types'

const logger = createLogger('XSearchTool')

export const xSearchTool: ToolConfig<XSearchParams, XSearchResponse> = {
  id: 'x_search',
  name: 'X Search',
  description: 'Search for tweets using keywords, hashtags, or advanced queries',
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
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Search query (supports X search operators)',
    },
    maxResults: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of results to return (default: 10, max: 100)',
    },
    startTime: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Start time for search (ISO 8601 format)',
    },
    endTime: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'End time for search (ISO 8601 format)',
    },
    sortOrder: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Sort order for results (recency or relevancy)',
    },
  },

  request: {
    url: (params) => {
      const query = params.query
      const expansions = [
        'author_id',
        'referenced_tweets.id',
        'attachments.media_keys',
        'attachments.poll_ids',
      ].join(',')

      const queryParams = new URLSearchParams({
        query,
        expansions,
        'tweet.fields':
          'created_at,conversation_id,in_reply_to_user_id,attachments,context_annotations,public_metrics',
        'user.fields': 'name,username,description,profile_image_url,verified,public_metrics',
      })

      if (params.maxResults && Number(params.maxResults) < 10) {
        queryParams.append('max_results', '10')
      } else if (params.maxResults) {
        queryParams.append('max_results', Number(params.maxResults).toString())
      }
      if (params.startTime) queryParams.append('start_time', params.startTime)
      if (params.endTime) queryParams.append('end_time', params.endTime)
      if (params.sortOrder) queryParams.append('sort_order', params.sortOrder)

      return `https://api.twitter.com/2/tweets/search/recent?${queryParams.toString()}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!data.data || !Array.isArray(data.data)) {
      logger.error('X Search API Error:', JSON.stringify(data, null, 2))
      return {
        success: false,
        error:
          data.error?.detail ||
          data.error?.title ||
          'No results found or invalid response from X API',
        output: {
          tweets: [],
          includes: {
            users: [],
            media: [],
            polls: [],
          },
          meta: data.meta || {
            resultCount: 0,
            newestId: null,
            oldestId: null,
            nextToken: null,
          },
        },
      }
    }

    return {
      success: true,
      output: {
        tweets: data.data.map(transformTweet),
        includes: {
          users: data.includes?.users?.map(transformUser) || [],
          media: data.includes?.media || [],
          polls: data.includes?.polls || [],
        },
        meta: {
          resultCount: data.meta.result_count,
          newestId: data.meta.newest_id,
          oldestId: data.meta.oldest_id,
          nextToken: data.meta.next_token,
        },
      },
    }
  },

  outputs: {
    tweets: {
      type: 'array',
      description: 'Array of tweets matching the search query',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Tweet ID' },
          text: { type: 'string', description: 'Tweet content' },
          createdAt: { type: 'string', description: 'Creation timestamp' },
          authorId: { type: 'string', description: 'Author user ID' },
        },
      },
    },
    includes: {
      type: 'object',
      description: 'Additional data including user profiles and media',
      optional: true,
    },
    meta: {
      type: 'object',
      description: 'Search metadata including result count and pagination tokens',
      properties: {
        resultCount: { type: 'number', description: 'Number of results returned' },
        newestId: { type: 'string', description: 'ID of the newest tweet' },
        oldestId: { type: 'string', description: 'ID of the oldest tweet' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/x/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

/**
 * Context annotation domain from X API
 */
export interface XContextAnnotationDomain {
  id: string
  name: string
  description?: string
}

/**
 * Context annotation entity from X API
 */
export interface XContextAnnotationEntity {
  id: string
  name: string
  description?: string
}

/**
 * Context annotation from X API - provides semantic context about tweet content
 */
export interface XContextAnnotation {
  domain: XContextAnnotationDomain
  entity: XContextAnnotationEntity
}

/**
 * Tweet object from X API
 */
export interface XTweet {
  id: string
  text: string
  createdAt: string
  authorId: string
  conversationId?: string
  inReplyToUserId?: string
  attachments?: {
    mediaKeys?: string[]
    pollId?: string
  }
  contextAnnotations?: XContextAnnotation[]
  publicMetrics?: {
    retweetCount: number
    replyCount: number
    likeCount: number
    quoteCount: number
  }
}

export interface XUser {
  id: string
  username: string
  name: string
  description?: string
  profileImageUrl?: string
  verified: boolean
  metrics: {
    followersCount: number
    followingCount: number
    tweetCount: number
  }
}

// Common parameters for all X endpoints
export interface XBaseParams {
  accessToken: string
}

// Write Operation
export interface XWriteParams extends XBaseParams {
  text: string
  replyTo?: string
  mediaIds?: string[]
  poll?: {
    options: string[]
    durationMinutes: number
  }
}

export interface XWriteResponse extends ToolResponse {
  output: {
    tweet: XTweet
  }
}

// Read Operation
export interface XReadParams extends XBaseParams {
  tweetId: string
  includeReplies?: boolean
}

export interface XReadResponse extends ToolResponse {
  output: {
    tweet: XTweet
    replies?: XTweet[]
    context?: {
      parentTweet?: XTweet
      rootTweet?: XTweet
    }
  }
}

// Search Operation
export interface XSearchParams extends XBaseParams {
  query: string
  maxResults?: number
  startTime?: string
  endTime?: string
  sortOrder?: 'recency' | 'relevancy'
}

export interface XSearchResponse extends ToolResponse {
  output: {
    tweets: XTweet[]
    includes?: {
      users: XUser[]
      media: any[]
      polls: any[]
    }
    meta: {
      resultCount: number
      newestId: string
      oldestId: string
      nextToken?: string
    }
  }
}

// User Operation
export interface XUserParams extends XBaseParams {
  username: string
  includeRecentTweets?: boolean
}

export interface XUserResponse extends ToolResponse {
  output: {
    user: XUser
    recentTweets?: XTweet[]
  }
}

export type XResponse = XWriteResponse | XReadResponse | XSearchResponse | XUserResponse

/**
 * Transforms raw X API tweet data (snake_case) into the XTweet format (camelCase)
 */
export const transformTweet = (tweet: any): XTweet => ({
  id: tweet.id,
  text: tweet.text,
  createdAt: tweet.created_at,
  authorId: tweet.author_id,
  conversationId: tweet.conversation_id,
  inReplyToUserId: tweet.in_reply_to_user_id,
  attachments: {
    mediaKeys: tweet.attachments?.media_keys,
    pollId: tweet.attachments?.poll_ids?.[0],
  },
  contextAnnotations: tweet.context_annotations,
  publicMetrics: tweet.public_metrics
    ? {
        retweetCount: tweet.public_metrics.retweet_count,
        replyCount: tweet.public_metrics.reply_count,
        likeCount: tweet.public_metrics.like_count,
        quoteCount: tweet.public_metrics.quote_count,
      }
    : undefined,
})

/**
 * Transforms raw X API user data (snake_case) into the XUser format (camelCase)
 */
export const transformUser = (user: any): XUser => ({
  id: user.id,
  username: user.username,
  name: user.name || '',
  description: user.description || '',
  profileImageUrl: user.profile_image_url || '',
  verified: !!user.verified,
  metrics: {
    followersCount: user.public_metrics?.followers_count || 0,
    followingCount: user.public_metrics?.following_count || 0,
    tweetCount: user.public_metrics?.tweet_count || 0,
  },
})
```

--------------------------------------------------------------------------------

---[FILE: user.ts]---
Location: sim-main/apps/sim/tools/x/user.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { XUserParams, XUserResponse } from '@/tools/x/types'
import { transformUser } from '@/tools/x/types'

const logger = createLogger('XUserTool')

export const xUserTool: ToolConfig<XUserParams, XUserResponse> = {
  id: 'x_user',
  name: 'X User',
  description: 'Get user profile information',
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
    username: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Username to look up (without @ symbol)',
    },
  },

  request: {
    url: (params) => {
      const username = encodeURIComponent(params.username)
      // Keep fields minimal to reduce chance of rate limits
      const userFields = 'description,profile_image_url,verified,public_metrics'

      return `https://api.twitter.com/2/users/by/username/${username}?user.fields=${userFields}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response, params) => {
    // Handle rate limit issues (429 status code)
    if (response.status === 429) {
      logger.warn('X API rate limit exceeded', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
      })

      // Try to extract rate limit reset time from headers if available
      const resetTime = response.headers.get('x-rate-limit-reset')
      const message = resetTime
        ? `Rate limit exceeded. Please try again after ${new Date(Number.parseInt(resetTime) * 1000).toLocaleTimeString()}.`
        : 'X API rate limit exceeded. Please try again later.'

      throw new Error(message)
    }

    try {
      const responseData = await response.json()
      logger.debug('X API response', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        responseData,
      })

      // Check if response contains expected data structure
      if (!responseData.data) {
        // If there's an error object in the response
        if (responseData.errors && responseData.errors.length > 0) {
          const error = responseData.errors[0]
          // Remove the square brackets from the error message
          const cleanedMessage = error.detail ? error.detail.replace(/\[(.*?)\]/, '$1') : ''
          throw new Error(
            `X API error: ${cleanedMessage || error.message || JSON.stringify(error)}`
          )
        }
        throw new Error('Invalid response format from X API')
      }

      const userData = responseData.data
      const user = transformUser(userData)

      return {
        success: true,
        output: {
          user,
        },
      }
    } catch (error) {
      logger.error('Error processing X API response', {
        error,
        status: response.status,
      })
      throw error
    }
  },

  outputs: {
    user: {
      type: 'object',
      description: 'X user profile information',
      properties: {
        id: { type: 'string', description: 'User ID' },
        username: { type: 'string', description: 'Username without @ symbol' },
        name: { type: 'string', description: 'Display name' },
        description: { type: 'string', description: 'User bio/description', optional: true },
        verified: { type: 'boolean', description: 'Whether the user is verified' },
        metrics: {
          type: 'object',
          description: 'User statistics',
          properties: {
            followersCount: { type: 'number', description: 'Number of followers' },
            followingCount: { type: 'number', description: 'Number of users following' },
            tweetCount: { type: 'number', description: 'Total number of tweets' },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: write.ts]---
Location: sim-main/apps/sim/tools/x/write.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { XWriteParams, XWriteResponse } from '@/tools/x/types'
import { transformTweet } from '@/tools/x/types'

export const xWriteTool: ToolConfig<XWriteParams, XWriteResponse> = {
  id: 'x_write',
  name: 'X Write',
  description: 'Post new tweets, reply to tweets, or create polls on X (Twitter)',
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
    text: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The text content of your tweet',
    },
    replyTo: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'ID of the tweet to reply to',
    },
    mediaIds: {
      type: 'array',
      required: false,
      visibility: 'user-only',
      description: 'Array of media IDs to attach to the tweet',
    },
    poll: {
      type: 'object',
      required: false,
      visibility: 'user-only',
      description: 'Poll configuration for the tweet',
    },
  },

  request: {
    url: 'https://api.twitter.com/2/tweets',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: any = {
        text: params.text,
      }

      if (params.replyTo) {
        body.reply = { in_reply_to_tweet_id: params.replyTo }
      }

      if (params.mediaIds?.length) {
        body.media = { media_ids: params.mediaIds }
      }

      if (params.poll) {
        body.poll = {
          options: params.poll.options,
          duration_minutes: params.poll.durationMinutes,
        }
      }

      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        tweet: transformTweet(data.data),
      },
    }
  },

  outputs: {
    tweet: {
      type: 'object',
      description: 'The newly created tweet data',
      properties: {
        id: { type: 'string', description: 'Tweet ID' },
        text: { type: 'string', description: 'Tweet content text' },
        createdAt: { type: 'string', description: 'Tweet creation timestamp' },
        authorId: { type: 'string', description: 'ID of the tweet author' },
        conversationId: { type: 'string', description: 'Conversation thread ID', optional: true },
        attachments: {
          type: 'object',
          description: 'Media or poll attachments',
          optional: true,
          properties: {
            mediaKeys: { type: 'array', description: 'Media attachment keys', optional: true },
            pollId: { type: 'string', description: 'Poll ID if poll attached', optional: true },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: channel_info.ts]---
Location: sim-main/apps/sim/tools/youtube/channel_info.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { YouTubeChannelInfoParams, YouTubeChannelInfoResponse } from '@/tools/youtube/types'

export const youtubeChannelInfoTool: ToolConfig<
  YouTubeChannelInfoParams,
  YouTubeChannelInfoResponse
> = {
  id: 'youtube_channel_info',
  name: 'YouTube Channel Info',
  description: 'Get detailed information about a YouTube channel.',
  version: '1.0.0',
  params: {
    channelId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'YouTube channel ID (use either channelId or username)',
    },
    username: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'YouTube channel username (use either channelId or username)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'YouTube API Key',
    },
  },

  request: {
    url: (params: YouTubeChannelInfoParams) => {
      let url =
        'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails'
      if (params.channelId) {
        url += `&id=${params.channelId}`
      } else if (params.username) {
        url += `&forUsername=${params.username}`
      }
      url += `&key=${params.apiKey}`
      return url
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response): Promise<YouTubeChannelInfoResponse> => {
    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      return {
        success: false,
        output: {
          channelId: '',
          title: '',
          description: '',
          subscriberCount: 0,
          videoCount: 0,
          viewCount: 0,
          publishedAt: '',
          thumbnail: '',
        },
        error: 'Channel not found',
      }
    }

    const item = data.items[0]
    return {
      success: true,
      output: {
        channelId: item.id,
        title: item.snippet?.title || '',
        description: item.snippet?.description || '',
        subscriberCount: Number(item.statistics?.subscriberCount || 0),
        videoCount: Number(item.statistics?.videoCount || 0),
        viewCount: Number(item.statistics?.viewCount || 0),
        publishedAt: item.snippet?.publishedAt || '',
        thumbnail:
          item.snippet?.thumbnails?.high?.url ||
          item.snippet?.thumbnails?.medium?.url ||
          item.snippet?.thumbnails?.default?.url ||
          '',
        customUrl: item.snippet?.customUrl,
      },
    }
  },

  outputs: {
    channelId: {
      type: 'string',
      description: 'YouTube channel ID',
    },
    title: {
      type: 'string',
      description: 'Channel name',
    },
    description: {
      type: 'string',
      description: 'Channel description',
    },
    subscriberCount: {
      type: 'number',
      description: 'Number of subscribers',
    },
    videoCount: {
      type: 'number',
      description: 'Number of videos',
    },
    viewCount: {
      type: 'number',
      description: 'Total channel views',
    },
    publishedAt: {
      type: 'string',
      description: 'Channel creation date',
    },
    thumbnail: {
      type: 'string',
      description: 'Channel thumbnail URL',
    },
    customUrl: {
      type: 'string',
      description: 'Channel custom URL',
      optional: true,
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: channel_playlists.ts]---
Location: sim-main/apps/sim/tools/youtube/channel_playlists.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type {
  YouTubeChannelPlaylistsParams,
  YouTubeChannelPlaylistsResponse,
} from '@/tools/youtube/types'

export const youtubeChannelPlaylistsTool: ToolConfig<
  YouTubeChannelPlaylistsParams,
  YouTubeChannelPlaylistsResponse
> = {
  id: 'youtube_channel_playlists',
  name: 'YouTube Channel Playlists',
  description: 'Get all playlists from a specific YouTube channel.',
  version: '1.0.0',
  params: {
    channelId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'YouTube channel ID to get playlists from',
    },
    maxResults: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      default: 10,
      description: 'Maximum number of playlists to return (1-50)',
    },
    pageToken: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Page token for pagination',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'YouTube API Key',
    },
  },

  request: {
    url: (params: YouTubeChannelPlaylistsParams) => {
      let url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${encodeURIComponent(
        params.channelId
      )}&key=${params.apiKey}`
      url += `&maxResults=${Number(params.maxResults || 10)}`
      if (params.pageToken) {
        url += `&pageToken=${params.pageToken}`
      }
      return url
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response): Promise<YouTubeChannelPlaylistsResponse> => {
    const data = await response.json()

    if (!data.items) {
      return {
        success: false,
        output: {
          items: [],
          totalResults: 0,
        },
        error: 'No playlists found',
      }
    }

    const items = (data.items || []).map((item: any) => ({
      playlistId: item.id,
      title: item.snippet?.title || '',
      description: item.snippet?.description || '',
      thumbnail:
        item.snippet?.thumbnails?.medium?.url ||
        item.snippet?.thumbnails?.default?.url ||
        item.snippet?.thumbnails?.high?.url ||
        '',
      itemCount: item.contentDetails?.itemCount || 0,
      publishedAt: item.snippet?.publishedAt || '',
    }))

    return {
      success: true,
      output: {
        items,
        totalResults: data.pageInfo?.totalResults || 0,
        nextPageToken: data.nextPageToken,
      },
    }
  },

  outputs: {
    items: {
      type: 'array',
      description: 'Array of playlists from the channel',
      items: {
        type: 'object',
        properties: {
          playlistId: { type: 'string', description: 'YouTube playlist ID' },
          title: { type: 'string', description: 'Playlist title' },
          description: { type: 'string', description: 'Playlist description' },
          thumbnail: { type: 'string', description: 'Playlist thumbnail URL' },
          itemCount: { type: 'number', description: 'Number of videos in playlist' },
          publishedAt: { type: 'string', description: 'Playlist creation date' },
        },
      },
    },
    totalResults: {
      type: 'number',
      description: 'Total number of playlists in the channel',
    },
    nextPageToken: {
      type: 'string',
      description: 'Token for accessing the next page of results',
      optional: true,
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: channel_videos.ts]---
Location: sim-main/apps/sim/tools/youtube/channel_videos.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type {
  YouTubeChannelVideosParams,
  YouTubeChannelVideosResponse,
} from '@/tools/youtube/types'

export const youtubeChannelVideosTool: ToolConfig<
  YouTubeChannelVideosParams,
  YouTubeChannelVideosResponse
> = {
  id: 'youtube_channel_videos',
  name: 'YouTube Channel Videos',
  description: 'Get all videos from a specific YouTube channel, with sorting options.',
  version: '1.0.0',
  params: {
    channelId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'YouTube channel ID to get videos from',
    },
    maxResults: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      default: 10,
      description: 'Maximum number of videos to return (1-50)',
    },
    order: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Sort order: "date" (newest first), "rating", "relevance", "title", "viewCount"',
    },
    pageToken: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Page token for pagination',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'YouTube API Key',
    },
  },

  request: {
    url: (params: YouTubeChannelVideosParams) => {
      let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&channelId=${encodeURIComponent(
        params.channelId
      )}&key=${params.apiKey}`
      url += `&maxResults=${Number(params.maxResults || 10)}`
      if (params.order) {
        url += `&order=${params.order}`
      }
      if (params.pageToken) {
        url += `&pageToken=${params.pageToken}`
      }
      return url
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response): Promise<YouTubeChannelVideosResponse> => {
    const data = await response.json()
    const items = (data.items || []).map((item: any) => ({
      videoId: item.id?.videoId,
      title: item.snippet?.title,
      description: item.snippet?.description,
      thumbnail:
        item.snippet?.thumbnails?.medium?.url ||
        item.snippet?.thumbnails?.default?.url ||
        item.snippet?.thumbnails?.high?.url ||
        '',
      publishedAt: item.snippet?.publishedAt || '',
    }))
    return {
      success: true,
      output: {
        items,
        totalResults: data.pageInfo?.totalResults || 0,
        nextPageToken: data.nextPageToken,
      },
    }
  },

  outputs: {
    items: {
      type: 'array',
      description: 'Array of videos from the channel',
      items: {
        type: 'object',
        properties: {
          videoId: { type: 'string', description: 'YouTube video ID' },
          title: { type: 'string', description: 'Video title' },
          description: { type: 'string', description: 'Video description' },
          thumbnail: { type: 'string', description: 'Video thumbnail URL' },
          publishedAt: { type: 'string', description: 'Video publish date' },
        },
      },
    },
    totalResults: {
      type: 'number',
      description: 'Total number of videos in the channel',
    },
    nextPageToken: {
      type: 'string',
      description: 'Token for accessing the next page of results',
      optional: true,
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: comments.ts]---
Location: sim-main/apps/sim/tools/youtube/comments.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { YouTubeCommentsParams, YouTubeCommentsResponse } from '@/tools/youtube/types'

export const youtubeCommentsTool: ToolConfig<YouTubeCommentsParams, YouTubeCommentsResponse> = {
  id: 'youtube_comments',
  name: 'YouTube Video Comments',
  description: 'Get comments from a YouTube video.',
  version: '1.0.0',
  params: {
    videoId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'YouTube video ID',
    },
    maxResults: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      default: 20,
      description: 'Maximum number of comments to return',
    },
    order: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      default: 'relevance',
      description: 'Order of comments: time or relevance',
    },
    pageToken: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Page token for pagination',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'YouTube API Key',
    },
  },

  request: {
    url: (params: YouTubeCommentsParams) => {
      let url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${params.videoId}&key=${params.apiKey}`
      url += `&maxResults=${Number(params.maxResults || 20)}`
      url += `&order=${params.order || 'relevance'}`
      if (params.pageToken) {
        url += `&pageToken=${params.pageToken}`
      }
      return url
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response): Promise<YouTubeCommentsResponse> => {
    const data = await response.json()

    const items = (data.items || []).map((item: any) => {
      const topLevelComment = item.snippet?.topLevelComment?.snippet
      return {
        commentId: item.snippet?.topLevelComment?.id || item.id,
        authorDisplayName: topLevelComment?.authorDisplayName || '',
        authorChannelUrl: topLevelComment?.authorChannelUrl || '',
        textDisplay: topLevelComment?.textDisplay || '',
        textOriginal: topLevelComment?.textOriginal || '',
        likeCount: topLevelComment?.likeCount || 0,
        publishedAt: topLevelComment?.publishedAt || '',
        updatedAt: topLevelComment?.updatedAt || '',
        replyCount: item.snippet?.totalReplyCount || 0,
      }
    })

    return {
      success: true,
      output: {
        items,
        totalResults: data.pageInfo?.totalResults || 0,
        nextPageToken: data.nextPageToken,
      },
    }
  },

  outputs: {
    items: {
      type: 'array',
      description: 'Array of comments from the video',
      items: {
        type: 'object',
        properties: {
          commentId: { type: 'string', description: 'Comment ID' },
          authorDisplayName: { type: 'string', description: 'Comment author name' },
          authorChannelUrl: { type: 'string', description: 'Comment author channel URL' },
          textDisplay: { type: 'string', description: 'Comment text (HTML formatted)' },
          textOriginal: { type: 'string', description: 'Comment text (plain text)' },
          likeCount: { type: 'number', description: 'Number of likes' },
          publishedAt: { type: 'string', description: 'Comment publish date' },
          updatedAt: { type: 'string', description: 'Comment last updated date' },
          replyCount: { type: 'number', description: 'Number of replies', optional: true },
        },
      },
    },
    totalResults: {
      type: 'number',
      description: 'Total number of comments',
    },
    nextPageToken: {
      type: 'string',
      description: 'Token for accessing the next page of results',
      optional: true,
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/youtube/index.ts

```typescript
import { youtubeChannelInfoTool } from '@/tools/youtube/channel_info'
import { youtubeChannelPlaylistsTool } from '@/tools/youtube/channel_playlists'
import { youtubeChannelVideosTool } from '@/tools/youtube/channel_videos'
import { youtubeCommentsTool } from '@/tools/youtube/comments'
import { youtubePlaylistItemsTool } from '@/tools/youtube/playlist_items'
import { youtubeSearchTool } from '@/tools/youtube/search'
import { youtubeVideoDetailsTool } from '@/tools/youtube/video_details'

export { youtubeSearchTool }
export { youtubeVideoDetailsTool }
export { youtubeChannelInfoTool }
export { youtubePlaylistItemsTool }
export { youtubeCommentsTool }
export { youtubeChannelVideosTool }
export { youtubeChannelPlaylistsTool }
```

--------------------------------------------------------------------------------

---[FILE: playlist_items.ts]---
Location: sim-main/apps/sim/tools/youtube/playlist_items.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type {
  YouTubePlaylistItemsParams,
  YouTubePlaylistItemsResponse,
} from '@/tools/youtube/types'

export const youtubePlaylistItemsTool: ToolConfig<
  YouTubePlaylistItemsParams,
  YouTubePlaylistItemsResponse
> = {
  id: 'youtube_playlist_items',
  name: 'YouTube Playlist Items',
  description: 'Get videos from a YouTube playlist.',
  version: '1.0.0',
  params: {
    playlistId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'YouTube playlist ID',
    },
    maxResults: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      default: 10,
      description: 'Maximum number of videos to return',
    },
    pageToken: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Page token for pagination',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'YouTube API Key',
    },
  },

  request: {
    url: (params: YouTubePlaylistItemsParams) => {
      let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${params.playlistId}&key=${params.apiKey}`
      url += `&maxResults=${Number(params.maxResults || 10)}`
      if (params.pageToken) {
        url += `&pageToken=${params.pageToken}`
      }
      return url
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response): Promise<YouTubePlaylistItemsResponse> => {
    const data = await response.json()

    const items = (data.items || []).map((item: any, index: number) => ({
      videoId: item.contentDetails?.videoId || item.snippet?.resourceId?.videoId,
      title: item.snippet?.title || '',
      description: item.snippet?.description || '',
      thumbnail:
        item.snippet?.thumbnails?.medium?.url ||
        item.snippet?.thumbnails?.default?.url ||
        item.snippet?.thumbnails?.high?.url ||
        '',
      publishedAt: item.snippet?.publishedAt || '',
      channelTitle: item.snippet?.channelTitle || '',
      position: item.snippet?.position ?? index,
    }))

    return {
      success: true,
      output: {
        items,
        totalResults: data.pageInfo?.totalResults || 0,
        nextPageToken: data.nextPageToken,
      },
    }
  },

  outputs: {
    items: {
      type: 'array',
      description: 'Array of videos in the playlist',
      items: {
        type: 'object',
        properties: {
          videoId: { type: 'string', description: 'YouTube video ID' },
          title: { type: 'string', description: 'Video title' },
          description: { type: 'string', description: 'Video description' },
          thumbnail: { type: 'string', description: 'Video thumbnail URL' },
          publishedAt: { type: 'string', description: 'Date added to playlist' },
          channelTitle: { type: 'string', description: 'Channel name' },
          position: { type: 'number', description: 'Position in playlist' },
        },
      },
    },
    totalResults: {
      type: 'number',
      description: 'Total number of items in playlist',
    },
    nextPageToken: {
      type: 'string',
      description: 'Token for accessing the next page of results',
      optional: true,
    },
  },
}
```

--------------------------------------------------------------------------------

````
