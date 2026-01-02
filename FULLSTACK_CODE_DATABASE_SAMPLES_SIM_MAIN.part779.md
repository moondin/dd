---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 779
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 779 of 933)

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
Location: sim-main/apps/sim/tools/youtube/search.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { YouTubeSearchParams, YouTubeSearchResponse } from '@/tools/youtube/types'

export const youtubeSearchTool: ToolConfig<YouTubeSearchParams, YouTubeSearchResponse> = {
  id: 'youtube_search',
  name: 'YouTube Search',
  description:
    'Search for videos on YouTube using the YouTube Data API. Supports advanced filtering by channel, date range, duration, category, quality, captions, and more.',
  version: '1.0.0',
  params: {
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Search query for YouTube videos',
    },
    maxResults: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      default: 5,
      description: 'Maximum number of videos to return (1-50)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'YouTube API Key',
    },
    // Priority 1: Essential filters
    channelId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter results to a specific YouTube channel ID',
    },
    publishedAfter: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Only return videos published after this date (RFC 3339 format: "2024-01-01T00:00:00Z")',
    },
    publishedBefore: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Only return videos published before this date (RFC 3339 format: "2024-01-01T00:00:00Z")',
    },
    videoDuration: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Filter by video length: "short" (<4 min), "medium" (4-20 min), "long" (>20 min), "any"',
    },
    order: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Sort results by: "date", "rating", "relevance" (default), "title", "videoCount", "viewCount"',
    },
    videoCategoryId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by YouTube category ID (e.g., "10" for Music, "20" for Gaming)',
    },
    // Priority 2: Very useful filters
    videoDefinition: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by video quality: "high" (HD), "standard", "any"',
    },
    videoCaption: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Filter by caption availability: "closedCaption" (has captions), "none" (no captions), "any"',
    },
    regionCode: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Return results relevant to a specific region (ISO 3166-1 alpha-2 country code, e.g., "US", "GB")',
    },
    relevanceLanguage: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Return results most relevant to a language (ISO 639-1 code, e.g., "en", "es")',
    },
    safeSearch: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Content filtering level: "moderate" (default), "none", "strict"',
    },
  },

  request: {
    url: (params: YouTubeSearchParams) => {
      let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=${params.apiKey}&q=${encodeURIComponent(
        params.query
      )}`
      url += `&maxResults=${Number(params.maxResults || 5)}`

      // Add Priority 1 filters if provided
      if (params.channelId) {
        url += `&channelId=${encodeURIComponent(params.channelId)}`
      }
      if (params.publishedAfter) {
        url += `&publishedAfter=${encodeURIComponent(params.publishedAfter)}`
      }
      if (params.publishedBefore) {
        url += `&publishedBefore=${encodeURIComponent(params.publishedBefore)}`
      }
      if (params.videoDuration) {
        url += `&videoDuration=${params.videoDuration}`
      }
      if (params.order) {
        url += `&order=${params.order}`
      }
      if (params.videoCategoryId) {
        url += `&videoCategoryId=${params.videoCategoryId}`
      }

      // Add Priority 2 filters if provided
      if (params.videoDefinition) {
        url += `&videoDefinition=${params.videoDefinition}`
      }
      if (params.videoCaption) {
        url += `&videoCaption=${params.videoCaption}`
      }
      if (params.regionCode) {
        url += `&regionCode=${params.regionCode}`
      }
      if (params.relevanceLanguage) {
        url += `&relevanceLanguage=${params.relevanceLanguage}`
      }
      if (params.safeSearch) {
        url += `&safeSearch=${params.safeSearch}`
      }

      return url
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response): Promise<YouTubeSearchResponse> => {
    const data = await response.json()
    const items = (data.items || []).map((item: any) => ({
      videoId: item.id?.videoId,
      title: item.snippet?.title,
      description: item.snippet?.description,
      thumbnail:
        item.snippet?.thumbnails?.default?.url ||
        item.snippet?.thumbnails?.medium?.url ||
        item.snippet?.thumbnails?.high?.url ||
        '',
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
      description: 'Array of YouTube videos matching the search query',
      items: {
        type: 'object',
        properties: {
          videoId: { type: 'string', description: 'YouTube video ID' },
          title: { type: 'string', description: 'Video title' },
          description: { type: 'string', description: 'Video description' },
          thumbnail: { type: 'string', description: 'Video thumbnail URL' },
        },
      },
    },
    totalResults: {
      type: 'number',
      description: 'Total number of search results available',
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

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/youtube/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface YouTubeSearchParams {
  apiKey: string
  query: string
  maxResults?: number
  pageToken?: string
  channelId?: string
  publishedAfter?: string
  publishedBefore?: string
  videoDuration?: 'any' | 'short' | 'medium' | 'long'
  order?: 'date' | 'rating' | 'relevance' | 'title' | 'videoCount' | 'viewCount'
  videoCategoryId?: string
  videoDefinition?: 'any' | 'high' | 'standard'
  videoCaption?: 'any' | 'closedCaption' | 'none'
  regionCode?: string
  relevanceLanguage?: string
  safeSearch?: 'moderate' | 'none' | 'strict'
}

export interface YouTubeSearchResponse extends ToolResponse {
  output: {
    items: Array<{
      videoId: string
      title: string
      description: string
      thumbnail: string
    }>
    totalResults: number
    nextPageToken?: string
  }
}

export interface YouTubeVideoDetailsParams {
  apiKey: string
  videoId: string
}

export interface YouTubeVideoDetailsResponse extends ToolResponse {
  output: {
    videoId: string
    title: string
    description: string
    channelId: string
    channelTitle: string
    publishedAt: string
    duration: string
    viewCount: number
    likeCount: number
    commentCount: number
    thumbnail: string
    tags?: string[]
  }
}

export interface YouTubeChannelInfoParams {
  apiKey: string
  channelId?: string
  username?: string
}

export interface YouTubeChannelInfoResponse extends ToolResponse {
  output: {
    channelId: string
    title: string
    description: string
    subscriberCount: number
    videoCount: number
    viewCount: number
    publishedAt: string
    thumbnail: string
    customUrl?: string
  }
}

export interface YouTubePlaylistItemsParams {
  apiKey: string
  playlistId: string
  maxResults?: number
  pageToken?: string
}

export interface YouTubePlaylistItemsResponse extends ToolResponse {
  output: {
    items: Array<{
      videoId: string
      title: string
      description: string
      thumbnail: string
      publishedAt: string
      channelTitle: string
      position: number
    }>
    totalResults: number
    nextPageToken?: string
  }
}

export interface YouTubeCommentsParams {
  apiKey: string
  videoId: string
  maxResults?: number
  order?: 'time' | 'relevance'
  pageToken?: string
}

export interface YouTubeCommentsResponse extends ToolResponse {
  output: {
    items: Array<{
      commentId: string
      authorDisplayName: string
      authorChannelUrl: string
      textDisplay: string
      textOriginal: string
      likeCount: number
      publishedAt: string
      updatedAt: string
      replyCount?: number
    }>
    totalResults: number
    nextPageToken?: string
  }
}

export interface YouTubeChannelVideosParams {
  apiKey: string
  channelId: string
  maxResults?: number
  order?: 'date' | 'rating' | 'relevance' | 'title' | 'viewCount'
  pageToken?: string
}

export interface YouTubeChannelVideosResponse extends ToolResponse {
  output: {
    items: Array<{
      videoId: string
      title: string
      description: string
      thumbnail: string
      publishedAt: string
    }>
    totalResults: number
    nextPageToken?: string
  }
}

export interface YouTubeChannelPlaylistsParams {
  apiKey: string
  channelId: string
  maxResults?: number
  pageToken?: string
}

export interface YouTubeChannelPlaylistsResponse extends ToolResponse {
  output: {
    items: Array<{
      playlistId: string
      title: string
      description: string
      thumbnail: string
      itemCount: number
      publishedAt: string
    }>
    totalResults: number
    nextPageToken?: string
  }
}

export type YouTubeResponse =
  | YouTubeSearchResponse
  | YouTubeVideoDetailsResponse
  | YouTubeChannelInfoResponse
  | YouTubePlaylistItemsResponse
  | YouTubeCommentsResponse
  | YouTubeChannelVideosResponse
  | YouTubeChannelPlaylistsResponse
```

--------------------------------------------------------------------------------

---[FILE: video_details.ts]---
Location: sim-main/apps/sim/tools/youtube/video_details.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { YouTubeVideoDetailsParams, YouTubeVideoDetailsResponse } from '@/tools/youtube/types'

export const youtubeVideoDetailsTool: ToolConfig<
  YouTubeVideoDetailsParams,
  YouTubeVideoDetailsResponse
> = {
  id: 'youtube_video_details',
  name: 'YouTube Video Details',
  description: 'Get detailed information about a specific YouTube video.',
  version: '1.0.0',
  params: {
    videoId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'YouTube video ID',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'YouTube API Key',
    },
  },

  request: {
    url: (params: YouTubeVideoDetailsParams) => {
      return `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${params.videoId}&key=${params.apiKey}`
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response): Promise<YouTubeVideoDetailsResponse> => {
    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      return {
        success: false,
        output: {
          videoId: '',
          title: '',
          description: '',
          channelId: '',
          channelTitle: '',
          publishedAt: '',
          duration: '',
          viewCount: 0,
          likeCount: 0,
          commentCount: 0,
          thumbnail: '',
        },
        error: 'Video not found',
      }
    }

    const item = data.items[0]
    return {
      success: true,
      output: {
        videoId: item.id,
        title: item.snippet?.title || '',
        description: item.snippet?.description || '',
        channelId: item.snippet?.channelId || '',
        channelTitle: item.snippet?.channelTitle || '',
        publishedAt: item.snippet?.publishedAt || '',
        duration: item.contentDetails?.duration || '',
        viewCount: Number(item.statistics?.viewCount || 0),
        likeCount: Number(item.statistics?.likeCount || 0),
        commentCount: Number(item.statistics?.commentCount || 0),
        thumbnail:
          item.snippet?.thumbnails?.high?.url ||
          item.snippet?.thumbnails?.medium?.url ||
          item.snippet?.thumbnails?.default?.url ||
          '',
        tags: item.snippet?.tags || [],
      },
    }
  },

  outputs: {
    videoId: {
      type: 'string',
      description: 'YouTube video ID',
    },
    title: {
      type: 'string',
      description: 'Video title',
    },
    description: {
      type: 'string',
      description: 'Video description',
    },
    channelId: {
      type: 'string',
      description: 'Channel ID',
    },
    channelTitle: {
      type: 'string',
      description: 'Channel name',
    },
    publishedAt: {
      type: 'string',
      description: 'Published date and time',
    },
    duration: {
      type: 'string',
      description: 'Video duration in ISO 8601 format',
    },
    viewCount: {
      type: 'number',
      description: 'Number of views',
    },
    likeCount: {
      type: 'number',
      description: 'Number of likes',
    },
    commentCount: {
      type: 'number',
      description: 'Number of comments',
    },
    thumbnail: {
      type: 'string',
      description: 'Video thumbnail URL',
    },
    tags: {
      type: 'array',
      description: 'Video tags',
      items: {
        type: 'string',
      },
      optional: true,
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: autocomplete_organizations.ts]---
Location: sim-main/apps/sim/tools/zendesk/autocomplete_organizations.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskAutocompleteOrganizations')

export interface ZendeskAutocompleteOrganizationsParams {
  email: string
  apiToken: string
  subdomain: string
  name: string
  perPage?: string
  page?: string
}

export interface ZendeskAutocompleteOrganizationsResponse {
  success: boolean
  output: {
    organizations: any[]
    paging?: {
      nextPage?: string | null
      previousPage?: string | null
      count: number
    }
    metadata: {
      operation: 'autocomplete_organizations'
      totalReturned: number
    }
    success: boolean
  }
}

export const zendeskAutocompleteOrganizationsTool: ToolConfig<
  ZendeskAutocompleteOrganizationsParams,
  ZendeskAutocompleteOrganizationsResponse
> = {
  id: 'zendesk_autocomplete_organizations',
  name: 'Autocomplete Organizations in Zendesk',
  description:
    'Autocomplete organizations in Zendesk by name prefix (for name matching/autocomplete)',
  version: '1.0.0',

  params: {
    email: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk email address',
    },
    apiToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Zendesk API token',
    },
    subdomain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk subdomain',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Organization name to search for',
    },
    perPage: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Results per page (default: 100, max: 100)',
    },
    page: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Page number',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      queryParams.append('name', params.name)
      if (params.page) queryParams.append('page', params.page)
      if (params.perPage) queryParams.append('per_page', params.perPage)

      const query = queryParams.toString()
      const url = buildZendeskUrl(params.subdomain, '/organizations/autocomplete')
      return `${url}?${query}`
    },
    method: 'GET',
    headers: (params) => {
      const credentials = `${params.email}/token:${params.apiToken}`
      const base64Credentials = Buffer.from(credentials).toString('base64')
      return {
        Authorization: `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
      }
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleZendeskError(data, response.status, 'autocomplete_organizations')
    }

    const data = await response.json()
    const organizations = data.organizations || []

    return {
      success: true,
      output: {
        organizations,
        paging: {
          nextPage: data.next_page,
          previousPage: data.previous_page,
          count: data.count || organizations.length,
        },
        metadata: {
          operation: 'autocomplete_organizations' as const,
          totalReturned: organizations.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    organizations: { type: 'array', description: 'Array of organization objects' },
    paging: { type: 'object', description: 'Pagination information' },
    metadata: { type: 'object', description: 'Operation metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_organization.ts]---
Location: sim-main/apps/sim/tools/zendesk/create_organization.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskCreateOrganization')

export interface ZendeskCreateOrganizationParams {
  email: string
  apiToken: string
  subdomain: string
  name: string
  domainNames?: string
  details?: string
  notes?: string
  tags?: string
  customFields?: string
}

export interface ZendeskCreateOrganizationResponse {
  success: boolean
  output: {
    organization: any
    metadata: {
      operation: 'create_organization'
      organizationId: string
    }
    success: boolean
  }
}

export const zendeskCreateOrganizationTool: ToolConfig<
  ZendeskCreateOrganizationParams,
  ZendeskCreateOrganizationResponse
> = {
  id: 'zendesk_create_organization',
  name: 'Create Organization in Zendesk',
  description: 'Create a new organization in Zendesk',
  version: '1.0.0',

  params: {
    email: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk email address',
    },
    apiToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Zendesk API token',
    },
    subdomain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk subdomain',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Organization name',
    },
    domainNames: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated domain names',
    },
    details: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Organization details',
    },
    notes: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Organization notes',
    },
    tags: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated tags',
    },
    customFields: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Custom fields as JSON object (e.g., {"field_id": "value"})',
    },
  },

  request: {
    url: (params) => buildZendeskUrl(params.subdomain, '/organizations'),
    method: 'POST',
    headers: (params) => {
      const credentials = `${params.email}/token:${params.apiToken}`
      const base64Credentials = Buffer.from(credentials).toString('base64')
      return {
        Authorization: `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      const organization: any = {
        name: params.name,
      }

      if (params.domainNames)
        organization.domain_names = params.domainNames.split(',').map((d) => d.trim())
      if (params.details) organization.details = params.details
      if (params.notes) organization.notes = params.notes
      if (params.tags) organization.tags = params.tags.split(',').map((t) => t.trim())

      if (params.customFields) {
        try {
          const customFields = JSON.parse(params.customFields)
          organization.organization_fields = customFields
        } catch (error) {
          logger.warn('Failed to parse custom fields', { error })
        }
      }

      return { organization }
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleZendeskError(data, response.status, 'create_organization')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        organization: data.organization,
        metadata: {
          operation: 'create_organization' as const,
          organizationId: data.organization?.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    organization: { type: 'object', description: 'Created organization object' },
    metadata: { type: 'object', description: 'Operation metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_organizations_bulk.ts]---
Location: sim-main/apps/sim/tools/zendesk/create_organizations_bulk.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskCreateOrganizationsBulk')

export interface ZendeskCreateOrganizationsBulkParams {
  email: string
  apiToken: string
  subdomain: string
  organizations: string
}

export interface ZendeskCreateOrganizationsBulkResponse {
  success: boolean
  output: {
    jobStatus: any
    metadata: {
      operation: 'create_organizations_bulk'
      jobId: string
    }
    success: boolean
  }
}

export const zendeskCreateOrganizationsBulkTool: ToolConfig<
  ZendeskCreateOrganizationsBulkParams,
  ZendeskCreateOrganizationsBulkResponse
> = {
  id: 'zendesk_create_organizations_bulk',
  name: 'Bulk Create Organizations in Zendesk',
  description: 'Create multiple organizations in Zendesk using bulk import',
  version: '1.0.0',

  params: {
    email: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk email address',
    },
    apiToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Zendesk API token',
    },
    subdomain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk subdomain',
    },
    organizations: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'JSON array of organization objects to create',
    },
  },

  request: {
    url: (params) => buildZendeskUrl(params.subdomain, '/organizations/create_many'),
    method: 'POST',
    headers: (params) => {
      const credentials = `${params.email}/token:${params.apiToken}`
      const base64Credentials = Buffer.from(credentials).toString('base64')
      return {
        Authorization: `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      try {
        const organizations = JSON.parse(params.organizations)
        return { organizations }
      } catch (error) {
        logger.error('Failed to parse organizations array', { error })
        throw new Error('Invalid organizations JSON format')
      }
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleZendeskError(data, response.status, 'create_organizations_bulk')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        jobStatus: data.job_status,
        metadata: {
          operation: 'create_organizations_bulk' as const,
          jobId: data.job_status?.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    jobStatus: { type: 'object', description: 'Job status object' },
    metadata: { type: 'object', description: 'Operation metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_ticket.ts]---
Location: sim-main/apps/sim/tools/zendesk/create_ticket.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskCreateTicket')

export interface ZendeskCreateTicketParams {
  email: string
  apiToken: string
  subdomain: string
  subject: string
  description: string
  priority?: string
  status?: string
  type?: string
  tags?: string
  assigneeId?: string
  groupId?: string
  requesterId?: string
  customFields?: string
}

export interface ZendeskCreateTicketResponse {
  success: boolean
  output: {
    ticket: any
    metadata: {
      operation: 'create_ticket'
      ticketId: string
    }
    success: boolean
  }
}

export const zendeskCreateTicketTool: ToolConfig<
  ZendeskCreateTicketParams,
  ZendeskCreateTicketResponse
> = {
  id: 'zendesk_create_ticket',
  name: 'Create Ticket in Zendesk',
  description: 'Create a new ticket in Zendesk with support for custom fields',
  version: '1.0.0',

  params: {
    email: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk email address',
    },
    apiToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Zendesk API token',
    },
    subdomain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk subdomain',
    },
    subject: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Ticket subject (optional - will be auto-generated if not provided)',
    },
    description: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Ticket description (first comment)',
    },
    priority: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Priority (low, normal, high, urgent)',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Status (new, open, pending, hold, solved, closed)',
    },
    type: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Type (problem, incident, question, task)',
    },
    tags: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated tags',
    },
    assigneeId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Assignee user ID',
    },
    groupId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Group ID',
    },
    requesterId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Requester user ID',
    },
    customFields: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Custom fields as JSON object (e.g., {"field_id": "value"})',
    },
  },

  request: {
    url: (params) => buildZendeskUrl(params.subdomain, '/tickets'),
    method: 'POST',
    headers: (params) => {
      // Use Basic Authentication with email/token format for Zendesk API tokens
      const credentials = `${params.email}/token:${params.apiToken}`
      const base64Credentials = Buffer.from(credentials).toString('base64')
      return {
        Authorization: `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      const ticket: any = {
        subject: params.subject,
        comment: { body: params.description },
      }

      if (params.priority) ticket.priority = params.priority
      if (params.status) ticket.status = params.status
      if (params.type) ticket.type = params.type
      if (params.assigneeId) ticket.assignee_id = params.assigneeId
      if (params.groupId) ticket.group_id = params.groupId
      if (params.requesterId) ticket.requester_id = params.requesterId
      if (params.tags) ticket.tags = params.tags.split(',').map((t) => t.trim())

      if (params.customFields) {
        try {
          const customFields = JSON.parse(params.customFields)
          ticket.custom_fields = Object.entries(customFields).map(([id, value]) => ({ id, value }))
        } catch (error) {
          logger.warn('Failed to parse custom fields', { error })
        }
      }

      return { ticket }
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleZendeskError(data, response.status, 'create_ticket')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        ticket: data.ticket,
        metadata: {
          operation: 'create_ticket' as const,
          ticketId: data.ticket?.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    ticket: { type: 'object', description: 'Created ticket object' },
    metadata: { type: 'object', description: 'Operation metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_tickets_bulk.ts]---
Location: sim-main/apps/sim/tools/zendesk/create_tickets_bulk.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskCreateTicketsBulk')

export interface ZendeskCreateTicketsBulkParams {
  email: string
  apiToken: string
  subdomain: string
  tickets: string
}

export interface ZendeskCreateTicketsBulkResponse {
  success: boolean
  output: {
    jobStatus: any
    metadata: {
      operation: 'create_tickets_bulk'
      jobId?: string
    }
    success: boolean
  }
}

export const zendeskCreateTicketsBulkTool: ToolConfig<
  ZendeskCreateTicketsBulkParams,
  ZendeskCreateTicketsBulkResponse
> = {
  id: 'zendesk_create_tickets_bulk',
  name: 'Bulk Create Tickets in Zendesk',
  description: 'Create multiple tickets in Zendesk at once (max 100)',
  version: '1.0.0',

  params: {
    email: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk email address',
    },
    apiToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Zendesk API token',
    },
    subdomain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Zendesk subdomain',
    },
    tickets: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description:
        'JSON array of ticket objects to create (max 100). Each ticket should have subject and comment properties.',
    },
  },

  request: {
    url: (params) => buildZendeskUrl(params.subdomain, '/tickets/create_many'),
    method: 'POST',
    headers: (params) => {
      const credentials = `${params.email}/token:${params.apiToken}`
      const base64Credentials = Buffer.from(credentials).toString('base64')
      return {
        Authorization: `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      try {
        const tickets = JSON.parse(params.tickets)
        return { tickets }
      } catch (error) {
        logger.error('Failed to parse tickets JSON', { error })
        throw new Error('Invalid tickets JSON format')
      }
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleZendeskError(data, response.status, 'create_tickets_bulk')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        jobStatus: data.job_status,
        metadata: {
          operation: 'create_tickets_bulk' as const,
          jobId: data.job_status?.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    jobStatus: { type: 'object', description: 'Job status object' },
    metadata: { type: 'object', description: 'Operation metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_user.ts]---
Location: sim-main/apps/sim/tools/zendesk/create_user.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildZendeskUrl, handleZendeskError } from './types'

const logger = createLogger('ZendeskCreateUser')

export interface ZendeskCreateUserParams {
  email: string
  apiToken: string
  subdomain: string
  name: string
  userEmail?: string
  role?: string
  phone?: string
  organizationId?: string
  verified?: string
  tags?: string
  customFields?: string
}

export interface ZendeskCreateUserResponse {
  success: boolean
  output: {
    user: any
    metadata: {
      operation: 'create_user'
      userId: string
    }
    success: boolean
  }
}

export const zendeskCreateUserTool: ToolConfig<ZendeskCreateUserParams, ZendeskCreateUserResponse> =
  {
    id: 'zendesk_create_user',
    name: 'Create User in Zendesk',
    description: 'Create a new user in Zendesk',
    version: '1.0.0',

    params: {
      email: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'Your Zendesk email address',
      },
      apiToken: {
        type: 'string',
        required: true,
        visibility: 'hidden',
        description: 'Zendesk API token',
      },
      subdomain: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'Your Zendesk subdomain',
      },
      name: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'User name',
      },
      userEmail: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'User email',
      },
      role: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'User role (end-user, agent, admin)',
      },
      phone: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'User phone number',
      },
      organizationId: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Organization ID',
      },
      verified: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Set to "true" to skip email verification',
      },
      tags: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Comma-separated tags',
      },
      customFields: {
        type: 'string',
        required: false,
        visibility: 'user-only',
        description: 'Custom fields as JSON object (e.g., {"field_id": "value"})',
      },
    },

    request: {
      url: (params) => buildZendeskUrl(params.subdomain, '/users'),
      method: 'POST',
      headers: (params) => {
        const credentials = `${params.email}/token:${params.apiToken}`
        const base64Credentials = Buffer.from(credentials).toString('base64')
        return {
          Authorization: `Basic ${base64Credentials}`,
          'Content-Type': 'application/json',
        }
      },
      body: (params) => {
        const user: any = {}

        if (params.name) user.name = params.name
        if (params.userEmail) user.email = params.userEmail
        if (params.role) user.role = params.role
        if (params.phone) user.phone = params.phone
        if (params.organizationId) user.organization_id = params.organizationId
        if (params.verified) user.verified = params.verified === 'true'
        if (params.tags) user.tags = params.tags.split(',').map((t) => t.trim())

        if (params.customFields) {
          try {
            const customFields = JSON.parse(params.customFields)
            user.user_fields = customFields
          } catch (error) {
            logger.warn('Failed to parse custom fields', { error })
          }
        }

        return { user }
      },
    },

    transformResponse: async (response: Response) => {
      if (!response.ok) {
        const data = await response.json()
        handleZendeskError(data, response.status, 'create_user')
      }

      const data = await response.json()

      return {
        success: true,
        output: {
          user: data.user,
          metadata: {
            operation: 'create_user' as const,
            userId: data.user?.id,
          },
          success: true,
        },
      }
    },

    outputs: {
      user: { type: 'object', description: 'Created user object' },
      metadata: { type: 'object', description: 'Operation metadata' },
    },
  }
```

--------------------------------------------------------------------------------

````
