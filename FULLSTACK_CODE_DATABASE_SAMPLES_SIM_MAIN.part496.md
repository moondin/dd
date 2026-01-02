---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 496
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 496 of 933)

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

---[FILE: x.ts]---
Location: sim-main/apps/sim/blocks/blocks/x.ts

```typescript
import { xIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { XResponse } from '@/tools/x/types'

export const XBlock: BlockConfig<XResponse> = {
  type: 'x',
  name: 'X',
  description: 'Interact with X',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrate X into the workflow. Can post a new tweet, get tweet details, search tweets, and get user profile.',
  docsLink: 'https://docs.sim.ai/tools/x',
  category: 'tools',
  bgColor: '#000000', // X's black color
  icon: xIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Post a New Tweet', id: 'x_write' },
        { label: 'Get Tweet Details', id: 'x_read' },
        { label: 'Search Tweets', id: 'x_search' },
        { label: 'Get User Profile', id: 'x_user' },
      ],
      value: () => 'x_write',
    },
    {
      id: 'credential',
      title: 'X Account',
      type: 'oauth-input',
      serviceId: 'x',
      requiredScopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
      placeholder: 'Select X account',
    },
    {
      id: 'text',
      title: 'Tweet Text',
      type: 'long-input',
      placeholder: "What's happening?",
      condition: { field: 'operation', value: 'x_write' },
      required: true,
    },
    {
      id: 'replyTo',
      title: 'Reply To (Tweet ID)',
      type: 'short-input',
      placeholder: 'Enter tweet ID to reply to',
      condition: { field: 'operation', value: 'x_write' },
    },
    {
      id: 'mediaIds',
      title: 'Media IDs',
      type: 'short-input',
      placeholder: 'Enter comma-separated media IDs',
      condition: { field: 'operation', value: 'x_write' },
    },
    {
      id: 'tweetId',
      title: 'Tweet ID',
      type: 'short-input',
      placeholder: 'Enter tweet ID to read',
      condition: { field: 'operation', value: 'x_read' },
      required: true,
    },
    {
      id: 'includeReplies',
      title: 'Include Replies',
      type: 'dropdown',
      options: [
        { label: 'true', id: 'true' },
        { label: 'false', id: 'false' },
      ],
      value: () => 'false',
      condition: { field: 'operation', value: 'x_read' },
    },
    {
      id: 'query',
      title: 'Search Query',
      type: 'long-input',
      placeholder: 'Enter search terms (supports X search operators)',
      condition: { field: 'operation', value: 'x_search' },
      required: true,
    },
    {
      id: 'maxResults',
      title: 'Max Results',
      type: 'short-input',
      placeholder: '10',
      condition: { field: 'operation', value: 'x_search' },
    },
    {
      id: 'sortOrder',
      title: 'Sort Order',
      type: 'dropdown',
      options: [
        { label: 'recency', id: 'recency' },
        { label: 'relevancy', id: 'relevancy' },
      ],
      value: () => 'recency',
      condition: { field: 'operation', value: 'x_search' },
    },
    {
      id: 'startTime',
      title: 'Start Time',
      type: 'short-input',
      placeholder: 'YYYY-MM-DDTHH:mm:ssZ',
      condition: { field: 'operation', value: 'x_search' },
    },
    {
      id: 'endTime',
      title: 'End Time',
      type: 'short-input',
      placeholder: 'YYYY-MM-DDTHH:mm:ssZ',
      condition: { field: 'operation', value: 'x_search' },
    },
    {
      id: 'username',
      title: 'Username',
      type: 'short-input',
      placeholder: 'Enter username (without @)',
      condition: { field: 'operation', value: 'x_user' },
      required: true,
    },
  ],
  tools: {
    access: ['x_write', 'x_read', 'x_search', 'x_user'],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'x_write':
            return 'x_write'
          case 'x_read':
            return 'x_read'
          case 'x_search':
            return 'x_search'
          case 'x_user':
            return 'x_user'
          default:
            return 'x_write'
        }
      },
      params: (params) => {
        const { credential, ...rest } = params

        const parsedParams: Record<string, any> = {
          credential: credential,
        }

        Object.keys(rest).forEach((key) => {
          const value = rest[key]

          if (value === 'true' || value === 'false') {
            parsedParams[key] = value === 'true'
          } else if (key === 'maxResults' && value) {
            parsedParams[key] = Number.parseInt(value as string, 10)
          } else if (key === 'mediaIds' && typeof value === 'string') {
            parsedParams[key] = value
              .split(',')
              .map((id) => id.trim())
              .filter((id) => id !== '')
          } else {
            parsedParams[key] = value
          }
        })

        return parsedParams
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'X account credential' },
    text: { type: 'string', description: 'Tweet text content' },
    replyTo: { type: 'string', description: 'Reply to tweet ID' },
    mediaIds: { type: 'string', description: 'Media identifiers' },
    poll: { type: 'json', description: 'Poll configuration' },
    tweetId: { type: 'string', description: 'Tweet identifier' },
    includeReplies: { type: 'boolean', description: 'Include replies' },
    query: { type: 'string', description: 'Search query terms' },
    maxResults: { type: 'number', description: 'Maximum search results' },
    startTime: { type: 'string', description: 'Search start time' },
    endTime: { type: 'string', description: 'Search end time' },
    sortOrder: { type: 'string', description: 'Result sort order' },
    username: { type: 'string', description: 'User profile name' },
    includeRecentTweets: { type: 'boolean', description: 'Include recent tweets' },
  },
  outputs: {
    // Write and Read operation outputs
    tweet: {
      type: 'json',
      description: 'Tweet data including contextAnnotations and publicMetrics',
      condition: { field: 'operation', value: ['x_write', 'x_read'] },
    },
    // Read operation outputs
    replies: {
      type: 'json',
      description: 'Tweet replies (when includeReplies is true)',
      condition: { field: 'operation', value: 'x_read' },
    },
    context: {
      type: 'json',
      description: 'Tweet context (parent and quoted tweets)',
      condition: { field: 'operation', value: 'x_read' },
    },
    // Search operation outputs
    tweets: {
      type: 'json',
      description: 'Tweets data including contextAnnotations and publicMetrics',
      condition: { field: 'operation', value: 'x_search' },
    },
    includes: {
      type: 'json',
      description: 'Additional data (users, media, polls)',
      condition: { field: 'operation', value: 'x_search' },
    },
    meta: {
      type: 'json',
      description: 'Response metadata',
      condition: { field: 'operation', value: 'x_search' },
    },
    // User operation outputs
    user: {
      type: 'json',
      description: 'User profile data',
      condition: { field: 'operation', value: 'x_user' },
    },
    recentTweets: {
      type: 'json',
      description: 'Recent tweets data',
      condition: { field: 'operation', value: 'x_user' },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: youtube.ts]---
Location: sim-main/apps/sim/blocks/blocks/youtube.ts

```typescript
import { YouTubeIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { YouTubeResponse } from '@/tools/youtube/types'

export const YouTubeBlock: BlockConfig<YouTubeResponse> = {
  type: 'youtube',
  name: 'YouTube',
  description: 'Interact with YouTube videos, channels, and playlists',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Integrate YouTube into the workflow. Can search for videos, get video details, get channel information, get all videos from a channel, get channel playlists, get playlist items, find related videos, and get video comments.',
  docsLink: 'https://docs.sim.ai/tools/youtube',
  category: 'tools',
  bgColor: '#FF0000',
  icon: YouTubeIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Search Videos', id: 'youtube_search' },
        { label: 'Get Video Details', id: 'youtube_video_details' },
        { label: 'Get Channel Info', id: 'youtube_channel_info' },
        { label: 'Get Channel Videos', id: 'youtube_channel_videos' },
        { label: 'Get Channel Playlists', id: 'youtube_channel_playlists' },
        { label: 'Get Playlist Items', id: 'youtube_playlist_items' },
        { label: 'Get Video Comments', id: 'youtube_comments' },
      ],
      value: () => 'youtube_search',
    },
    // Search Videos operation inputs
    {
      id: 'query',
      title: 'Search Query',
      type: 'short-input',
      placeholder: 'Enter search query',
      required: true,
      condition: { field: 'operation', value: 'youtube_search' },
    },
    {
      id: 'maxResults',
      title: 'Max Results',
      type: 'slider',
      min: 1,
      max: 50,
      step: 1,
      integer: true,
      condition: { field: 'operation', value: 'youtube_search' },
    },
    {
      id: 'channelId',
      title: 'Filter by Channel ID',
      type: 'short-input',
      placeholder: 'Filter results to a specific channel',
      condition: { field: 'operation', value: 'youtube_search' },
    },
    {
      id: 'publishedAfter',
      title: 'Published After',
      type: 'short-input',
      placeholder: '2024-01-01T00:00:00Z',
      condition: { field: 'operation', value: 'youtube_search' },
    },
    {
      id: 'publishedBefore',
      title: 'Published Before',
      type: 'short-input',
      placeholder: '2024-12-31T23:59:59Z',
      condition: { field: 'operation', value: 'youtube_search' },
    },
    {
      id: 'videoDuration',
      title: 'Video Duration',
      type: 'dropdown',
      options: [
        { label: 'Any', id: 'any' },
        { label: 'Short (<4 min)', id: 'short' },
        { label: 'Medium (4-20 min)', id: 'medium' },
        { label: 'Long (>20 min)', id: 'long' },
      ],
      value: () => 'any',
      condition: { field: 'operation', value: 'youtube_search' },
    },
    {
      id: 'order',
      title: 'Sort Order',
      type: 'dropdown',
      options: [
        { label: 'Relevance', id: 'relevance' },
        { label: 'Date (Newest First)', id: 'date' },
        { label: 'View Count', id: 'viewCount' },
        { label: 'Rating', id: 'rating' },
        { label: 'Title', id: 'title' },
      ],
      value: () => 'relevance',
      condition: { field: 'operation', value: 'youtube_search' },
    },
    {
      id: 'videoCategoryId',
      title: 'Category ID',
      type: 'short-input',
      placeholder: '10 for Music, 20 for Gaming',
      condition: { field: 'operation', value: 'youtube_search' },
    },
    {
      id: 'videoDefinition',
      title: 'Video Quality',
      type: 'dropdown',
      options: [
        { label: 'Any', id: 'any' },
        { label: 'HD', id: 'high' },
        { label: 'Standard', id: 'standard' },
      ],
      value: () => 'any',
      condition: { field: 'operation', value: 'youtube_search' },
    },
    {
      id: 'videoCaption',
      title: 'Captions',
      type: 'dropdown',
      options: [
        { label: 'Any', id: 'any' },
        { label: 'Has Captions', id: 'closedCaption' },
        { label: 'No Captions', id: 'none' },
      ],
      value: () => 'any',
      condition: { field: 'operation', value: 'youtube_search' },
    },
    {
      id: 'regionCode',
      title: 'Region Code',
      type: 'short-input',
      placeholder: 'US, GB, JP',
      condition: { field: 'operation', value: 'youtube_search' },
    },
    {
      id: 'relevanceLanguage',
      title: 'Language Code',
      type: 'short-input',
      placeholder: 'en, es, fr',
      condition: { field: 'operation', value: 'youtube_search' },
    },
    {
      id: 'safeSearch',
      title: 'Safe Search',
      type: 'dropdown',
      options: [
        { label: 'Moderate', id: 'moderate' },
        { label: 'None', id: 'none' },
        { label: 'Strict', id: 'strict' },
      ],
      value: () => 'moderate',
      condition: { field: 'operation', value: 'youtube_search' },
    },
    // Get Video Details operation inputs
    {
      id: 'videoId',
      title: 'Video ID',
      type: 'short-input',
      placeholder: 'Enter YouTube video ID',
      required: true,
      condition: { field: 'operation', value: 'youtube_video_details' },
    },
    // Get Channel Info operation inputs
    {
      id: 'channelId',
      title: 'Channel ID',
      type: 'short-input',
      placeholder: 'Enter channel ID (or leave blank to use username)',
      condition: { field: 'operation', value: 'youtube_channel_info' },
    },
    {
      id: 'username',
      title: 'Channel Username',
      type: 'short-input',
      placeholder: 'Enter channel username (if not using channel ID)',
      condition: { field: 'operation', value: 'youtube_channel_info' },
    },
    // Get Channel Videos operation inputs
    {
      id: 'channelId',
      title: 'Channel ID',
      type: 'short-input',
      placeholder: 'Enter YouTube channel ID',
      required: true,
      condition: { field: 'operation', value: 'youtube_channel_videos' },
    },
    {
      id: 'maxResults',
      title: 'Max Results',
      type: 'slider',
      min: 1,
      max: 50,
      step: 1,
      integer: true,
      condition: { field: 'operation', value: 'youtube_channel_videos' },
    },
    {
      id: 'order',
      title: 'Sort Order',
      type: 'dropdown',
      options: [
        { label: 'Date (Newest First)', id: 'date' },
        { label: 'Relevance', id: 'relevance' },
        { label: 'View Count', id: 'viewCount' },
        { label: 'Rating', id: 'rating' },
        { label: 'Title', id: 'title' },
      ],
      value: () => 'date',
      condition: { field: 'operation', value: 'youtube_channel_videos' },
    },
    // Get Channel Playlists operation inputs
    {
      id: 'channelId',
      title: 'Channel ID',
      type: 'short-input',
      placeholder: 'Enter YouTube channel ID',
      required: true,
      condition: { field: 'operation', value: 'youtube_channel_playlists' },
    },
    {
      id: 'maxResults',
      title: 'Max Results',
      type: 'slider',
      min: 1,
      max: 50,
      step: 1,
      integer: true,
      condition: { field: 'operation', value: 'youtube_channel_playlists' },
    },
    // Get Playlist Items operation inputs
    {
      id: 'playlistId',
      title: 'Playlist ID',
      type: 'short-input',
      placeholder: 'Enter YouTube playlist ID',
      required: true,
      condition: { field: 'operation', value: 'youtube_playlist_items' },
    },
    {
      id: 'maxResults',
      title: 'Max Results',
      type: 'slider',
      min: 1,
      max: 50,
      step: 1,
      integer: true,
      condition: { field: 'operation', value: 'youtube_playlist_items' },
    },
    // Get Video Comments operation inputs
    {
      id: 'videoId',
      title: 'Video ID',
      type: 'short-input',
      placeholder: 'Enter YouTube video ID',
      required: true,
      condition: { field: 'operation', value: 'youtube_comments' },
    },
    {
      id: 'maxResults',
      title: 'Max Results',
      type: 'slider',
      min: 1,
      max: 100,
      step: 1,
      integer: true,
      condition: { field: 'operation', value: 'youtube_comments' },
    },
    {
      id: 'order',
      title: 'Sort Order',
      type: 'dropdown',
      options: [
        { label: 'Most Relevant', id: 'relevance' },
        { label: 'Most Recent', id: 'time' },
      ],
      value: () => 'relevance',
      condition: { field: 'operation', value: 'youtube_comments' },
    },
    // API Key (common to all operations)
    {
      id: 'apiKey',
      title: 'YouTube API Key',
      type: 'short-input',
      placeholder: 'Enter YouTube API Key',
      password: true,
      required: true,
    },
  ],
  tools: {
    access: [
      'youtube_search',
      'youtube_video_details',
      'youtube_channel_info',
      'youtube_channel_videos',
      'youtube_channel_playlists',
      'youtube_playlist_items',
      'youtube_comments',
    ],
    config: {
      tool: (params) => {
        // Convert numeric parameters
        if (params.maxResults) {
          params.maxResults = Number(params.maxResults)
        }

        switch (params.operation) {
          case 'youtube_search':
            return 'youtube_search'
          case 'youtube_video_details':
            return 'youtube_video_details'
          case 'youtube_channel_info':
            return 'youtube_channel_info'
          case 'youtube_channel_videos':
            return 'youtube_channel_videos'
          case 'youtube_channel_playlists':
            return 'youtube_channel_playlists'
          case 'youtube_playlist_items':
            return 'youtube_playlist_items'
          case 'youtube_comments':
            return 'youtube_comments'
          default:
            return 'youtube_search'
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    apiKey: { type: 'string', description: 'YouTube API key' },
    // Search Videos
    query: { type: 'string', description: 'Search query' },
    maxResults: { type: 'number', description: 'Maximum number of results' },
    // Search Filters
    publishedAfter: { type: 'string', description: 'Published after date (RFC 3339)' },
    publishedBefore: { type: 'string', description: 'Published before date (RFC 3339)' },
    videoDuration: { type: 'string', description: 'Video duration filter' },
    videoCategoryId: { type: 'string', description: 'YouTube category ID' },
    videoDefinition: { type: 'string', description: 'Video quality filter' },
    videoCaption: { type: 'string', description: 'Caption availability filter' },
    regionCode: { type: 'string', description: 'Region code (ISO 3166-1)' },
    relevanceLanguage: { type: 'string', description: 'Language code (ISO 639-1)' },
    safeSearch: { type: 'string', description: 'Safe search level' },
    // Video Details & Comments
    videoId: { type: 'string', description: 'YouTube video ID' },
    // Channel Info
    channelId: { type: 'string', description: 'YouTube channel ID' },
    username: { type: 'string', description: 'YouTube channel username' },
    // Playlist Items
    playlistId: { type: 'string', description: 'YouTube playlist ID' },
    // Sort Order (used by multiple operations)
    order: { type: 'string', description: 'Sort order' },
  },
  outputs: {
    // Search Videos & Playlist Items
    items: { type: 'json', description: 'List of items returned' },
    totalResults: { type: 'number', description: 'Total number of results' },
    nextPageToken: { type: 'string', description: 'Token for next page' },
    // Video Details
    videoId: { type: 'string', description: 'Video ID' },
    title: { type: 'string', description: 'Video or channel title' },
    description: { type: 'string', description: 'Video or channel description' },
    channelId: { type: 'string', description: 'Channel ID' },
    channelTitle: { type: 'string', description: 'Channel name' },
    publishedAt: { type: 'string', description: 'Published date' },
    duration: { type: 'string', description: 'Video duration' },
    viewCount: { type: 'number', description: 'View count' },
    likeCount: { type: 'number', description: 'Like count' },
    commentCount: { type: 'number', description: 'Comment count' },
    thumbnail: { type: 'string', description: 'Thumbnail URL' },
    tags: { type: 'json', description: 'Video tags' },
    // Channel Info
    subscriberCount: { type: 'number', description: 'Subscriber count' },
    videoCount: { type: 'number', description: 'Total video count' },
    customUrl: { type: 'string', description: 'Channel custom URL' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: zendesk.ts]---
Location: sim-main/apps/sim/blocks/blocks/zendesk.ts

```typescript
import { ZendeskIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'

export const ZendeskBlock: BlockConfig = {
  type: 'zendesk',
  name: 'Zendesk',
  description: 'Manage support tickets, users, and organizations in Zendesk',
  longDescription:
    'Integrate Zendesk into the workflow. Can get tickets, get ticket, create ticket, create tickets bulk, update ticket, update tickets bulk, delete ticket, merge tickets, get users, get user, get current user, search users, create user, create users bulk, update user, update users bulk, delete user, get organizations, get organization, autocomplete organizations, create organization, create organizations bulk, update organization, delete organization, search, search count.',
  docsLink: 'https://docs.sim.ai/tools/zendesk',
  authMode: AuthMode.ApiKey,
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: ZendeskIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Get Tickets', id: 'get_tickets' },
        { label: 'Get Ticket', id: 'get_ticket' },
        { label: 'Create Ticket', id: 'create_ticket' },
        { label: 'Create Tickets Bulk', id: 'create_tickets_bulk' },
        { label: 'Update Ticket', id: 'update_ticket' },
        { label: 'Update Tickets Bulk', id: 'update_tickets_bulk' },
        { label: 'Delete Ticket', id: 'delete_ticket' },
        { label: 'Merge Tickets', id: 'merge_tickets' },
        { label: 'Get Users', id: 'get_users' },
        { label: 'Get User', id: 'get_user' },
        { label: 'Get Current User', id: 'get_current_user' },
        { label: 'Search Users', id: 'search_users' },
        { label: 'Create User', id: 'create_user' },
        { label: 'Create Users Bulk', id: 'create_users_bulk' },
        { label: 'Update User', id: 'update_user' },
        { label: 'Update Users Bulk', id: 'update_users_bulk' },
        { label: 'Delete User', id: 'delete_user' },
        { label: 'Get Organizations', id: 'get_organizations' },
        { label: 'Get Organization', id: 'get_organization' },
        { label: 'Autocomplete Organizations', id: 'autocomplete_organizations' },
        { label: 'Create Organization', id: 'create_organization' },
        { label: 'Create Organizations Bulk', id: 'create_organizations_bulk' },
        { label: 'Update Organization', id: 'update_organization' },
        { label: 'Delete Organization', id: 'delete_organization' },
        { label: 'Search', id: 'search' },
        { label: 'Search Count', id: 'search_count' },
      ],
      value: () => 'get_tickets',
    },
    {
      id: 'email',
      title: 'Email',
      type: 'short-input',
      placeholder: 'Your Zendesk email address',
      required: true,
      description: 'The email address associated with your Zendesk account',
    },
    {
      id: 'apiToken',
      title: 'API Token',
      type: 'short-input',
      password: true,
      placeholder: 'Enter your Zendesk API token',
      required: true,
    },
    {
      id: 'subdomain',
      title: 'Subdomain',
      type: 'short-input',
      placeholder: 'Your Zendesk subdomain (e.g., "mycompany")',
      required: true,
      description: 'The subdomain from your Zendesk URL (mycompany.zendesk.com)',
    },
    // Ticket fields
    {
      id: 'ticketId',
      title: 'Ticket ID',
      type: 'short-input',
      placeholder: 'Ticket ID',
      required: true,
      condition: {
        field: 'operation',
        value: ['get_ticket', 'update_ticket', 'delete_ticket'],
      },
    },
    {
      id: 'subject',
      title: 'Subject',
      type: 'short-input',
      placeholder: 'Ticket subject',
      condition: {
        field: 'operation',
        value: ['create_ticket', 'update_ticket'],
      },
    },
    {
      id: 'description',
      title: 'Description',
      type: 'long-input',
      placeholder: 'Ticket description',
      required: {
        field: 'operation',
        value: ['create_ticket'],
      },
      condition: {
        field: 'operation',
        value: ['create_ticket', 'update_ticket'],
      },
    },
    {
      id: 'status',
      title: 'Status',
      type: 'short-input',
      placeholder: 'Status (new, open, pending, hold, solved, closed)',
      condition: {
        field: 'operation',
        value: ['get_tickets', 'create_ticket', 'update_ticket'],
      },
    },
    {
      id: 'priority',
      title: 'Priority',
      type: 'short-input',
      placeholder: 'Priority (low, normal, high, urgent)',
      condition: {
        field: 'operation',
        value: ['get_tickets', 'create_ticket', 'update_ticket'],
      },
    },
    {
      id: 'type',
      title: 'Type',
      type: 'short-input',
      placeholder: 'Type (problem, incident, question, task)',
      condition: {
        field: 'operation',
        value: ['get_tickets', 'create_ticket', 'update_ticket'],
      },
    },
    {
      id: 'tags',
      title: 'Tags',
      type: 'short-input',
      placeholder: 'Comma-separated tags',
      condition: {
        field: 'operation',
        value: ['create_ticket', 'update_ticket'],
      },
    },
    {
      id: 'assigneeId',
      title: 'Assignee ID',
      type: 'short-input',
      placeholder: 'User ID to assign ticket to',
      condition: {
        field: 'operation',
        value: ['get_tickets', 'create_ticket', 'update_ticket'],
      },
    },
    {
      id: 'groupId',
      title: 'Group ID',
      type: 'short-input',
      placeholder: 'Group ID',
      condition: {
        field: 'operation',
        value: ['create_ticket', 'update_ticket'],
      },
    },
    {
      id: 'customFields',
      title: 'Custom Fields',
      type: 'long-input',
      placeholder: 'JSON object with custom fields',
      condition: {
        field: 'operation',
        value: ['create_ticket', 'update_ticket'],
      },
    },
    {
      id: 'tickets',
      title: 'Tickets',
      type: 'long-input',
      placeholder: 'JSON array of ticket objects',
      required: true,
      condition: {
        field: 'operation',
        value: ['create_tickets_bulk', 'update_tickets_bulk'],
      },
    },
    {
      id: 'targetTicketId',
      title: 'Target Ticket ID',
      type: 'short-input',
      placeholder: 'Ticket ID to merge into',
      required: true,
      condition: {
        field: 'operation',
        value: ['merge_tickets'],
      },
    },
    {
      id: 'sourceTicketIds',
      title: 'Source Ticket IDs',
      type: 'short-input',
      placeholder: 'Comma-separated ticket IDs to merge',
      required: true,
      condition: {
        field: 'operation',
        value: ['merge_tickets'],
      },
    },
    // User fields
    {
      id: 'userId',
      title: 'User ID',
      type: 'short-input',
      placeholder: 'User ID',
      required: true,
      condition: {
        field: 'operation',
        value: ['get_user', 'update_user', 'delete_user'],
      },
    },
    {
      id: 'name',
      title: 'Name',
      type: 'short-input',
      placeholder: 'User name',
      required: {
        field: 'operation',
        value: ['create_user'],
      },
      condition: {
        field: 'operation',
        value: ['create_user', 'update_user'],
      },
    },
    {
      id: 'userEmail',
      title: 'Email',
      type: 'short-input',
      placeholder: 'User email',
      condition: {
        field: 'operation',
        value: ['create_user', 'update_user'],
      },
    },
    {
      id: 'users',
      title: 'Users',
      type: 'long-input',
      placeholder: 'JSON array of user objects',
      required: true,
      condition: {
        field: 'operation',
        value: ['create_users_bulk', 'update_users_bulk'],
      },
    },
    // Organization fields
    {
      id: 'organizationId',
      title: 'Organization ID',
      type: 'short-input',
      placeholder: 'Organization ID',
      required: {
        field: 'operation',
        value: ['get_organization', 'delete_organization'],
      },
      condition: {
        field: 'operation',
        value: [
          'get_tickets',
          'create_ticket',
          'get_organization',
          'delete_organization',
          'update_organization',
          'create_user',
          'update_user',
        ],
      },
    },
    {
      id: 'organizationName',
      title: 'Organization Name',
      type: 'short-input',
      placeholder: 'Organization name',
      required: {
        field: 'operation',
        value: ['autocomplete_organizations'],
      },
      condition: {
        field: 'operation',
        value: ['autocomplete_organizations', 'create_organization', 'update_organization'],
      },
    },
    {
      id: 'organizations',
      title: 'Organizations',
      type: 'long-input',
      placeholder: 'JSON array of organization objects',
      required: true,
      condition: {
        field: 'operation',
        value: ['create_organizations_bulk'],
      },
    },
    // Search fields
    {
      id: 'query',
      title: 'Query',
      type: 'short-input',
      placeholder: 'Search query',
      required: {
        field: 'operation',
        value: ['search', 'search_count'],
      },
      condition: {
        field: 'operation',
        value: ['search_users', 'search', 'search_count'],
      },
    },
    {
      id: 'sortBy',
      title: 'Sort By',
      type: 'dropdown',
      options: [
        { label: 'Relevance', id: 'relevance' },
        { label: 'Created At', id: 'created_at' },
        { label: 'Updated At', id: 'updated_at' },
        { label: 'Priority', id: 'priority' },
        { label: 'Status', id: 'status' },
        { label: 'Ticket Type', id: 'ticket_type' },
      ],
      condition: {
        field: 'operation',
        value: ['search'],
      },
    },
    {
      id: 'sortOrder',
      title: 'Sort Order',
      type: 'dropdown',
      options: [
        { label: 'Ascending', id: 'asc' },
        { label: 'Descending', id: 'desc' },
      ],
      condition: {
        field: 'operation',
        value: ['search'],
      },
    },
    // Pagination fields
    {
      id: 'perPage',
      title: 'Per Page',
      type: 'short-input',
      placeholder: 'Results per page (default: 100, max: 100)',
      condition: {
        field: 'operation',
        value: [
          'get_tickets',
          'get_users',
          'get_organizations',
          'search_users',
          'autocomplete_organizations',
          'search',
        ],
      },
    },
    {
      id: 'page',
      title: 'Page',
      type: 'short-input',
      placeholder: 'Page number',
      condition: {
        field: 'operation',
        value: [
          'get_tickets',
          'get_users',
          'get_organizations',
          'search_users',
          'autocomplete_organizations',
          'search',
        ],
      },
    },
  ],
  tools: {
    access: [
      'zendesk_get_tickets',
      'zendesk_get_ticket',
      'zendesk_create_ticket',
      'zendesk_create_tickets_bulk',
      'zendesk_update_ticket',
      'zendesk_update_tickets_bulk',
      'zendesk_delete_ticket',
      'zendesk_merge_tickets',
      'zendesk_get_users',
      'zendesk_get_user',
      'zendesk_get_current_user',
      'zendesk_search_users',
      'zendesk_create_user',
      'zendesk_create_users_bulk',
      'zendesk_update_user',
      'zendesk_update_users_bulk',
      'zendesk_delete_user',
      'zendesk_get_organizations',
      'zendesk_get_organization',
      'zendesk_autocomplete_organizations',
      'zendesk_create_organization',
      'zendesk_create_organizations_bulk',
      'zendesk_update_organization',
      'zendesk_delete_organization',
      'zendesk_search',
      'zendesk_search_count',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'get_tickets':
            return 'zendesk_get_tickets'
          case 'get_ticket':
            return 'zendesk_get_ticket'
          case 'create_ticket':
            return 'zendesk_create_ticket'
          case 'create_tickets_bulk':
            return 'zendesk_create_tickets_bulk'
          case 'update_ticket':
            return 'zendesk_update_ticket'
          case 'update_tickets_bulk':
            return 'zendesk_update_tickets_bulk'
          case 'delete_ticket':
            return 'zendesk_delete_ticket'
          case 'merge_tickets':
            return 'zendesk_merge_tickets'
          case 'get_users':
            return 'zendesk_get_users'
          case 'get_user':
            return 'zendesk_get_user'
          case 'get_current_user':
            return 'zendesk_get_current_user'
          case 'search_users':
            return 'zendesk_search_users'
          case 'create_user':
            return 'zendesk_create_user'
          case 'create_users_bulk':
            return 'zendesk_create_users_bulk'
          case 'update_user':
            return 'zendesk_update_user'
          case 'update_users_bulk':
            return 'zendesk_update_users_bulk'
          case 'delete_user':
            return 'zendesk_delete_user'
          case 'get_organizations':
            return 'zendesk_get_organizations'
          case 'get_organization':
            return 'zendesk_get_organization'
          case 'autocomplete_organizations':
            return 'zendesk_autocomplete_organizations'
          case 'create_organization':
            return 'zendesk_create_organization'
          case 'create_organizations_bulk':
            return 'zendesk_create_organizations_bulk'
          case 'update_organization':
            return 'zendesk_update_organization'
          case 'delete_organization':
            return 'zendesk_delete_organization'
          case 'search':
            return 'zendesk_search'
          case 'search_count':
            return 'zendesk_search_count'
          default:
            throw new Error(`Unknown operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const { apiToken, operation, ...rest } = params
        const cleanParams: Record<string, any> = { apiToken }

        // Special mapping for autocomplete_organizations
        if (operation === 'autocomplete_organizations' && params.organizationName) {
          cleanParams.name = params.organizationName
        }

        Object.entries(rest).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            // Skip organizationName for autocomplete_organizations as it's mapped to 'name'
            if (operation === 'autocomplete_organizations' && key === 'organizationName') {
              return
            }
            cleanParams[key] = value
          }
        })
        return cleanParams
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    email: { type: 'string', description: 'Zendesk email address' },
    apiToken: { type: 'string', description: 'Zendesk API token' },
    subdomain: { type: 'string', description: 'Zendesk subdomain' },
  },
  outputs: {
    // Ticket operations - list
    tickets: { type: 'json', description: 'Array of ticket objects (get_tickets)' },
    // Ticket operations - single
    ticket: {
      type: 'json',
      description: 'Single ticket object (get_ticket, create_ticket, update_ticket)',
    },
    // User operations - list
    users: { type: 'json', description: 'Array of user objects (get_users, search_users)' },
    // User operations - single
    user: {
      type: 'json',
      description: 'Single user object (get_user, get_current_user, create_user, update_user)',
    },
    // Organization operations - list
    organizations: {
      type: 'json',
      description: 'Array of organization objects (get_organizations, autocomplete_organizations)',
    },
    // Organization operations - single
    organization: {
      type: 'json',
      description:
        'Single organization object (get_organization, create_organization, update_organization)',
    },
    // Search operations
    results: { type: 'json', description: 'Array of search result objects (search)' },
    count: { type: 'number', description: 'Number of matching results (search_count)' },
    // Bulk/async operations
    jobStatus: {
      type: 'json',
      description:
        'Job status for async operations (create_tickets_bulk, update_tickets_bulk, merge_tickets, create_users_bulk, update_users_bulk, create_organizations_bulk)',
    },
    // Delete operations
    deleted: {
      type: 'boolean',
      description: 'Deletion confirmation (delete_ticket, delete_user, delete_organization)',
    },
    // Pagination (shared across list operations)
    paging: { type: 'json', description: 'Pagination information for list operations' },
    // Metadata (shared across all operations)
    metadata: { type: 'json', description: 'Operation metadata including operation type' },
  },
}
```

--------------------------------------------------------------------------------

````
