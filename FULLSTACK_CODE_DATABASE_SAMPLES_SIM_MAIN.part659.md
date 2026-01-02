---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 659
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 659 of 933)

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
Location: sim-main/apps/sim/tools/confluence/list_comments.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface ConfluenceListCommentsParams {
  accessToken: string
  domain: string
  pageId: string
  limit?: number
  cloudId?: string
}

export interface ConfluenceListCommentsResponse {
  success: boolean
  output: {
    ts: string
    comments: Array<{
      id: string
      body: string
      createdAt: string
      authorId: string
    }>
  }
}

export const confluenceListCommentsTool: ToolConfig<
  ConfluenceListCommentsParams,
  ConfluenceListCommentsResponse
> = {
  id: 'confluence_list_comments',
  name: 'Confluence List Comments',
  description: 'List all comments on a Confluence page.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'confluence',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Confluence',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Confluence domain (e.g., yourcompany.atlassian.net)',
    },
    pageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Confluence page ID to list comments from',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Maximum number of comments to return (default: 25)',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: (params: ConfluenceListCommentsParams) => {
      const query = new URLSearchParams({
        domain: params.domain,
        accessToken: params.accessToken,
        pageId: params.pageId,
        limit: String(params.limit || 25),
      })
      if (params.cloudId) {
        query.set('cloudId', params.cloudId)
      }
      return `/api/tools/confluence/comments?${query.toString()}`
    },
    method: 'GET',
    headers: (params: ConfluenceListCommentsParams) => {
      return {
        Accept: 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params: ConfluenceListCommentsParams) => {
      return {
        domain: params.domain,
        accessToken: params.accessToken,
        cloudId: params.cloudId,
        pageId: params.pageId,
        limit: params.limit ? Number(params.limit) : 25,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        comments: data.comments || [],
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of retrieval' },
    comments: { type: 'array', description: 'List of comments' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_labels.ts]---
Location: sim-main/apps/sim/tools/confluence/list_labels.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface ConfluenceListLabelsParams {
  accessToken: string
  domain: string
  pageId: string
  cloudId?: string
}

export interface ConfluenceListLabelsResponse {
  success: boolean
  output: {
    ts: string
    labels: Array<{
      id: string
      name: string
      prefix: string
    }>
  }
}

export const confluenceListLabelsTool: ToolConfig<
  ConfluenceListLabelsParams,
  ConfluenceListLabelsResponse
> = {
  id: 'confluence_list_labels',
  name: 'Confluence List Labels',
  description: 'List all labels on a Confluence page.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'confluence',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Confluence',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Confluence domain (e.g., yourcompany.atlassian.net)',
    },
    pageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Confluence page ID to list labels from',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: (params: ConfluenceListLabelsParams) => {
      const query = new URLSearchParams({
        domain: params.domain,
        accessToken: params.accessToken,
        pageId: params.pageId,
      })
      if (params.cloudId) {
        query.set('cloudId', params.cloudId)
      }
      return `/api/tools/confluence/labels?${query.toString()}`
    },
    method: 'GET',
    headers: (params: ConfluenceListLabelsParams) => {
      return {
        Accept: 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        labels: data.labels || [],
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of retrieval' },
    labels: { type: 'array', description: 'List of labels' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_spaces.ts]---
Location: sim-main/apps/sim/tools/confluence/list_spaces.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface ConfluenceListSpacesParams {
  accessToken: string
  domain: string
  limit?: number
  cloudId?: string
}

export interface ConfluenceListSpacesResponse {
  success: boolean
  output: {
    ts: string
    spaces: Array<{
      id: string
      name: string
      key: string
      type: string
      status: string
    }>
  }
}

export const confluenceListSpacesTool: ToolConfig<
  ConfluenceListSpacesParams,
  ConfluenceListSpacesResponse
> = {
  id: 'confluence_list_spaces',
  name: 'Confluence List Spaces',
  description: 'List all Confluence spaces accessible to the user.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'confluence',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Confluence',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Confluence domain (e.g., yourcompany.atlassian.net)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Maximum number of spaces to return (default: 25)',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: (params: ConfluenceListSpacesParams) => {
      const query = new URLSearchParams({
        domain: params.domain,
        accessToken: params.accessToken,
        limit: String(params.limit || 25),
      })
      if (params.cloudId) {
        query.set('cloudId', params.cloudId)
      }
      return `/api/tools/confluence/spaces?${query.toString()}`
    },
    method: 'GET',
    headers: (params: ConfluenceListSpacesParams) => {
      return {
        Accept: 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params: ConfluenceListSpacesParams) => {
      return {
        domain: params.domain,
        accessToken: params.accessToken,
        cloudId: params.cloudId,
        limit: params.limit ? Number(params.limit) : 25,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        spaces: data.spaces || [],
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of retrieval' },
    spaces: { type: 'array', description: 'List of spaces' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: retrieve.ts]---
Location: sim-main/apps/sim/tools/confluence/retrieve.ts

```typescript
import type { ConfluenceRetrieveParams, ConfluenceRetrieveResponse } from '@/tools/confluence/types'
import { transformPageData } from '@/tools/confluence/utils'
import type { ToolConfig } from '@/tools/types'

export const confluenceRetrieveTool: ToolConfig<
  ConfluenceRetrieveParams,
  ConfluenceRetrieveResponse
> = {
  id: 'confluence_retrieve',
  name: 'Confluence Retrieve',
  description: 'Retrieve content from Confluence pages using the Confluence API.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'confluence',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Confluence',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Confluence domain (e.g., yourcompany.atlassian.net)',
    },
    pageId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Confluence page ID to retrieve',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: (params: ConfluenceRetrieveParams) => {
      return '/api/tools/confluence/page'
    },
    method: 'POST',
    headers: (params: ConfluenceRetrieveParams) => {
      return {
        Accept: 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params: ConfluenceRetrieveParams) => {
      return {
        domain: params.domain,
        accessToken: params.accessToken,
        pageId: params.pageId,
        cloudId: params.cloudId,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    return transformPageData(data)
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of retrieval' },
    pageId: { type: 'string', description: 'Confluence page ID' },
    content: { type: 'string', description: 'Page content with HTML tags stripped' },
    title: { type: 'string', description: 'Page title' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search.ts]---
Location: sim-main/apps/sim/tools/confluence/search.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface ConfluenceSearchParams {
  accessToken: string
  domain: string
  query: string
  limit?: number
  cloudId?: string
}

export interface ConfluenceSearchResponse {
  success: boolean
  output: {
    ts: string
    results: Array<{
      id: string
      title: string
      type: string
      url: string
      excerpt: string
    }>
  }
}

export const confluenceSearchTool: ToolConfig<ConfluenceSearchParams, ConfluenceSearchResponse> = {
  id: 'confluence_search',
  name: 'Confluence Search',
  description: 'Search for content across Confluence pages, blog posts, and other content.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'confluence',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Confluence',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Confluence domain (e.g., yourcompany.atlassian.net)',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Search query string',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Maximum number of results to return (default: 25)',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: () => '/api/tools/confluence/search',
    method: 'POST',
    headers: (params: ConfluenceSearchParams) => {
      return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params: ConfluenceSearchParams) => {
      return {
        domain: params.domain,
        accessToken: params.accessToken,
        cloudId: params.cloudId,
        query: params.query,
        limit: params.limit ? Number(params.limit) : 25,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        results: data.results || [],
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of search' },
    results: { type: 'array', description: 'Search results' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/confluence/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

// Page operations
export interface ConfluenceRetrieveParams {
  accessToken: string
  pageId: string
  domain: string
  cloudId?: string
}

export interface ConfluenceRetrieveResponse extends ToolResponse {
  output: {
    ts: string
    pageId: string
    content: string
    title: string
  }
}

export interface ConfluencePage {
  id: string
  title: string
  spaceKey?: string
  url?: string
  lastModified?: string
}

export interface ConfluenceUpdateParams {
  accessToken: string
  domain: string
  pageId: string
  title?: string
  content?: string
  version?: number
  cloudId?: string
}

export interface ConfluenceUpdateResponse extends ToolResponse {
  output: {
    ts: string
    pageId: string
    title: string
    success: boolean
  }
}

export interface ConfluenceCreatePageParams {
  accessToken: string
  domain: string
  spaceId: string
  title: string
  content: string
  parentId?: string
  cloudId?: string
}

export interface ConfluenceCreatePageResponse extends ToolResponse {
  output: {
    ts: string
    pageId: string
    title: string
    url: string
  }
}

export interface ConfluenceDeletePageParams {
  accessToken: string
  domain: string
  pageId: string
  cloudId?: string
}

export interface ConfluenceDeletePageResponse extends ToolResponse {
  output: {
    ts: string
    pageId: string
    deleted: boolean
  }
}

// Search operations
export interface ConfluenceSearchParams {
  accessToken: string
  domain: string
  query: string
  limit?: number
  cloudId?: string
}

export interface ConfluenceSearchResponse extends ToolResponse {
  output: {
    ts: string
    results: Array<{
      id: string
      title: string
      type: string
      url: string
      excerpt: string
    }>
  }
}

// Comment operations
export interface ConfluenceCommentParams {
  accessToken: string
  domain: string
  pageId: string
  comment: string
  cloudId?: string
}

export interface ConfluenceCommentResponse extends ToolResponse {
  output: {
    ts: string
    commentId: string
    pageId: string
  }
}

// Attachment operations
export interface ConfluenceAttachmentParams {
  accessToken: string
  domain: string
  pageId?: string
  attachmentId?: string
  limit?: number
  cloudId?: string
}

export interface ConfluenceAttachmentResponse extends ToolResponse {
  output: {
    ts: string
    attachments?: Array<{
      id: string
      title: string
      fileSize: number
      mediaType: string
      downloadUrl: string
    }>
    attachmentId?: string
    deleted?: boolean
  }
}

export interface ConfluenceUploadAttachmentParams {
  accessToken: string
  domain: string
  pageId: string
  file: any
  fileName?: string
  comment?: string
  cloudId?: string
}

export interface ConfluenceUploadAttachmentResponse extends ToolResponse {
  output: {
    ts: string
    attachmentId: string
    title: string
    fileSize: number
    mediaType: string
    downloadUrl: string
    pageId: string
  }
}

// Label operations
export interface ConfluenceLabelParams {
  accessToken: string
  domain: string
  pageId: string
  labelName?: string
  cloudId?: string
}

export interface ConfluenceLabelResponse extends ToolResponse {
  output: {
    ts: string
    labels?: Array<{
      id: string
      name: string
      prefix: string
    }>
    pageId?: string
    labelName?: string
    added?: boolean
    removed?: boolean
  }
}

// Space operations
export interface ConfluenceSpaceParams {
  accessToken: string
  domain: string
  spaceId?: string
  limit?: number
  cloudId?: string
}

export interface ConfluenceSpaceResponse extends ToolResponse {
  output: {
    ts: string
    spaces?: Array<{
      id: string
      name: string
      key: string
      type: string
      status: string
    }>
    spaceId?: string
    name?: string
    key?: string
    type?: string
    status?: string
  }
}

export type ConfluenceResponse =
  | ConfluenceRetrieveResponse
  | ConfluenceUpdateResponse
  | ConfluenceCreatePageResponse
  | ConfluenceDeletePageResponse
  | ConfluenceSearchResponse
  | ConfluenceCommentResponse
  | ConfluenceAttachmentResponse
  | ConfluenceUploadAttachmentResponse
  | ConfluenceLabelResponse
  | ConfluenceSpaceResponse
```

--------------------------------------------------------------------------------

---[FILE: update.ts]---
Location: sim-main/apps/sim/tools/confluence/update.ts

```typescript
import type { ConfluenceUpdateParams, ConfluenceUpdateResponse } from '@/tools/confluence/types'
import type { ToolConfig } from '@/tools/types'

export const confluenceUpdateTool: ToolConfig<ConfluenceUpdateParams, ConfluenceUpdateResponse> = {
  id: 'confluence_update',
  name: 'Confluence Update',
  description: 'Update a Confluence page using the Confluence API.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'confluence',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Confluence',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Confluence domain (e.g., yourcompany.atlassian.net)',
    },
    pageId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Confluence page ID to update',
    },
    title: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New title for the page',
    },
    content: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New content for the page in Confluence storage format',
    },
    version: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Version number of the page (required for preventing conflicts)',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: (params: ConfluenceUpdateParams) => {
      return '/api/tools/confluence/page'
    },
    method: 'PUT',
    headers: (params: ConfluenceUpdateParams) => {
      return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params: ConfluenceUpdateParams) => {
      const body: Record<string, any> = {
        domain: params.domain,
        accessToken: params.accessToken,
        pageId: params.pageId,
        cloudId: params.cloudId,
        title: params.title,
        body: params.content
          ? {
              representation: 'storage',
              value: params.content,
            }
          : undefined,
        version: {
          number: params.version || 1,
          message: params.version ? 'Updated via Sim' : 'Initial update via Sim',
        },
      }
      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        pageId: data.id,
        title: data.title,
        body: data.body,
        success: true,
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of update' },
    pageId: { type: 'string', description: 'Confluence page ID' },
    title: { type: 'string', description: 'Updated page title' },
    success: { type: 'boolean', description: 'Update operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_comment.ts]---
Location: sim-main/apps/sim/tools/confluence/update_comment.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface ConfluenceUpdateCommentParams {
  accessToken: string
  domain: string
  commentId: string
  comment: string
  cloudId?: string
}

export interface ConfluenceUpdateCommentResponse {
  success: boolean
  output: {
    ts: string
    commentId: string
    updated: boolean
  }
}

export const confluenceUpdateCommentTool: ToolConfig<
  ConfluenceUpdateCommentParams,
  ConfluenceUpdateCommentResponse
> = {
  id: 'confluence_update_comment',
  name: 'Confluence Update Comment',
  description: 'Update an existing comment on a Confluence page.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'confluence',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Confluence',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Confluence domain (e.g., yourcompany.atlassian.net)',
    },
    commentId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Confluence comment ID to update',
    },
    comment: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Updated comment text in Confluence storage format',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: () => '/api/tools/confluence/comment',
    method: 'PUT',
    headers: (params: ConfluenceUpdateCommentParams) => {
      return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params: ConfluenceUpdateCommentParams) => {
      return {
        domain: params.domain,
        accessToken: params.accessToken,
        cloudId: params.cloudId,
        commentId: params.commentId,
        comment: params.comment,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        commentId: data.id || data.commentId,
        updated: true,
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of update' },
    commentId: { type: 'string', description: 'Updated comment ID' },
    updated: { type: 'boolean', description: 'Update status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: upload_attachment.ts]---
Location: sim-main/apps/sim/tools/confluence/upload_attachment.ts

```typescript
import type { ToolConfig } from '@/tools/types'

export interface ConfluenceUploadAttachmentParams {
  accessToken: string
  domain: string
  pageId: string
  file: any
  fileName?: string
  comment?: string
  cloudId?: string
}

export interface ConfluenceUploadAttachmentResponse {
  success: boolean
  output: {
    ts: string
    attachmentId: string
    title: string
    fileSize: number
    mediaType: string
    downloadUrl: string
    pageId: string
  }
}

export const confluenceUploadAttachmentTool: ToolConfig<
  ConfluenceUploadAttachmentParams,
  ConfluenceUploadAttachmentResponse
> = {
  id: 'confluence_upload_attachment',
  name: 'Confluence Upload Attachment',
  description: 'Upload a file as an attachment to a Confluence page.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'confluence',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Confluence',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Confluence domain (e.g., yourcompany.atlassian.net)',
    },
    pageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Confluence page ID to attach the file to',
    },
    file: {
      type: 'file',
      required: true,
      visibility: 'user-or-llm',
      description: 'The file to upload as an attachment',
    },
    fileName: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Optional custom file name for the attachment',
    },
    comment: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Optional comment to add to the attachment',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Confluence Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
  },

  request: {
    url: () => '/api/tools/confluence/upload-attachment',
    method: 'POST',
    headers: (params: ConfluenceUploadAttachmentParams) => {
      return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params: ConfluenceUploadAttachmentParams) => {
      return {
        domain: params.domain,
        accessToken: params.accessToken,
        cloudId: params.cloudId,
        pageId: params.pageId,
        file: params.file,
        fileName: params.fileName,
        comment: params.comment,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        ts: new Date().toISOString(),
        attachmentId: data.attachmentId || '',
        title: data.title || '',
        fileSize: data.fileSize || 0,
        mediaType: data.mediaType || '',
        downloadUrl: data.downloadUrl || '',
        pageId: data.pageId || '',
      },
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of upload' },
    attachmentId: { type: 'string', description: 'Uploaded attachment ID' },
    title: { type: 'string', description: 'Attachment file name' },
    fileSize: { type: 'number', description: 'File size in bytes' },
    mediaType: { type: 'string', description: 'MIME type of the attachment' },
    downloadUrl: { type: 'string', description: 'Download URL for the attachment' },
    pageId: { type: 'string', description: 'Page ID the attachment was added to' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/tools/confluence/utils.ts

```typescript
export async function getConfluenceCloudId(domain: string, accessToken: string): Promise<string> {
  const response = await fetch('https://api.atlassian.com/oauth/token/accessible-resources', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  })

  const resources = await response.json()

  if (Array.isArray(resources) && resources.length > 0) {
    const normalizedInput = `https://${domain}`.toLowerCase()
    const matchedResource = resources.find((r) => r.url.toLowerCase() === normalizedInput)

    if (matchedResource) {
      return matchedResource.id
    }
  }

  if (Array.isArray(resources) && resources.length > 0) {
    return resources[0].id
  }

  throw new Error('No Confluence resources found')
}

function decodeHtmlEntities(text: string): string {
  let decoded = text
  let previous: string

  do {
    previous = decoded
    decoded = decoded
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
    decoded = decoded.replace(/&amp;/g, '&')
  } while (decoded !== previous)

  return decoded
}

function stripHtmlTags(html: string): string {
  let text = html
  let previous: string

  do {
    previous = text
    text = text.replace(/<[^>]*>/g, '')
    text = text.replace(/[<>]/g, '')
  } while (text !== previous)

  return text.trim()
}

export function transformPageData(data: any) {
  const content =
    data.body?.view?.value ||
    data.body?.storage?.value ||
    data.body?.atlas_doc_format?.value ||
    data.content ||
    data.description ||
    `Content for page ${data.title || 'Unknown'}`

  let cleanContent = stripHtmlTags(content)
  cleanContent = decodeHtmlEntities(cleanContent)
  cleanContent = cleanContent.replace(/\s+/g, ' ').trim()

  return {
    success: true,
    output: {
      ts: new Date().toISOString(),
      pageId: data.id || '',
      content: cleanContent,
      title: data.title || '',
    },
  }
}
```

--------------------------------------------------------------------------------

---[FILE: add_followup.ts]---
Location: sim-main/apps/sim/tools/cursor/add_followup.ts

```typescript
import type { AddFollowupParams, AddFollowupResponse } from '@/tools/cursor/types'
import type { ToolConfig } from '@/tools/types'

export const addFollowupTool: ToolConfig<AddFollowupParams, AddFollowupResponse> = {
  id: 'cursor_add_followup',
  name: 'Cursor Add Follow-up',
  description: 'Add a follow-up instruction to an existing cloud agent.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Cursor API key',
    },
    agentId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Unique identifier for the cloud agent (e.g., bc_abc123)',
    },
    followupPromptText: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The follow-up instruction text for the agent',
    },
    promptImages: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'JSON array of image objects with base64 data and dimensions (max 5)',
    },
  },

  request: {
    url: (params) => `https://api.cursor.com/v0/agents/${params.agentId}/followup`,
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${params.apiKey}:`).toString('base64')}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        prompt: {
          text: params.followupPromptText,
        },
      }

      if (params.promptImages) {
        try {
          body.prompt.images = JSON.parse(params.promptImages)
        } catch {
          body.prompt.images = []
        }
      }

      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    const content = `Follow-up added to agent ${data.id}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          id: data.id,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Success message' },
    metadata: {
      type: 'object',
      description: 'Result metadata',
      properties: {
        id: { type: 'string', description: 'Agent ID' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_agent.ts]---
Location: sim-main/apps/sim/tools/cursor/delete_agent.ts

```typescript
import type { DeleteAgentParams, DeleteAgentResponse } from '@/tools/cursor/types'
import type { ToolConfig } from '@/tools/types'

export const deleteAgentTool: ToolConfig<DeleteAgentParams, DeleteAgentResponse> = {
  id: 'cursor_delete_agent',
  name: 'Cursor Delete Agent',
  description: 'Permanently delete a cloud agent. This action cannot be undone.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Cursor API key',
    },
    agentId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Unique identifier for the cloud agent (e.g., bc_abc123)',
    },
  },

  request: {
    url: (params) => `https://api.cursor.com/v0/agents/${params.agentId}`,
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Basic ${Buffer.from(`${params.apiKey}:`).toString('base64')}`,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    const content = `Agent ${data.id} has been deleted`

    return {
      success: true,
      output: {
        content,
        metadata: {
          id: data.id,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Success message' },
    metadata: {
      type: 'object',
      description: 'Result metadata',
      properties: {
        id: { type: 'string', description: 'Agent ID' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_agent.ts]---
Location: sim-main/apps/sim/tools/cursor/get_agent.ts

```typescript
import type { GetAgentParams, GetAgentResponse } from '@/tools/cursor/types'
import type { ToolConfig } from '@/tools/types'

export const getAgentTool: ToolConfig<GetAgentParams, GetAgentResponse> = {
  id: 'cursor_get_agent',
  name: 'Cursor Get Agent',
  description: 'Retrieve the current status and results of a cloud agent.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Cursor API key',
    },
    agentId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Unique identifier for the cloud agent (e.g., bc_abc123)',
    },
  },

  request: {
    url: (params) => `https://api.cursor.com/v0/agents/${params.agentId}`,
    method: 'GET',
    headers: (params) => ({
      Authorization: `Basic ${Buffer.from(`${params.apiKey}:`).toString('base64')}`,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        content: `Agent "${data.name}" is ${data.status}`,
        metadata: data,
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable agent details' },
    metadata: {
      type: 'object',
      description: 'Agent metadata',
      properties: {
        id: { type: 'string', description: 'Agent ID' },
        name: { type: 'string', description: 'Agent name' },
        status: { type: 'string', description: 'Agent status' },
        source: { type: 'object', description: 'Source repository info' },
        target: { type: 'object', description: 'Target branch info' },
        summary: { type: 'string', description: 'Agent summary', optional: true },
        createdAt: { type: 'string', description: 'Creation timestamp' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_conversation.ts]---
Location: sim-main/apps/sim/tools/cursor/get_conversation.ts

```typescript
import type { GetConversationParams, GetConversationResponse } from '@/tools/cursor/types'
import type { ToolConfig } from '@/tools/types'

export const getConversationTool: ToolConfig<GetConversationParams, GetConversationResponse> = {
  id: 'cursor_get_conversation',
  name: 'Cursor Get Conversation',
  description:
    'Retrieve the conversation history of a cloud agent, including all user prompts and assistant responses.',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Cursor API key',
    },
    agentId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Unique identifier for the cloud agent (e.g., bc_abc123)',
    },
  },

  request: {
    url: (params) => `https://api.cursor.com/v0/agents/${params.agentId}/conversation`,
    method: 'GET',
    headers: (params) => ({
      Authorization: `Basic ${Buffer.from(`${params.apiKey}:`).toString('base64')}`,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        content: `Retrieved ${data.messages.length} messages`,
        metadata: {
          id: data.id,
          messages: data.messages,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable conversation history' },
    metadata: {
      type: 'object',
      description: 'Conversation metadata',
      properties: {
        id: { type: 'string', description: 'Agent ID' },
        messages: {
          type: 'array',
          description: 'Array of conversation messages',
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/cursor/index.ts

```typescript
import { addFollowupTool } from '@/tools/cursor/add_followup'
import { deleteAgentTool } from '@/tools/cursor/delete_agent'
import { getAgentTool } from '@/tools/cursor/get_agent'
import { getConversationTool } from '@/tools/cursor/get_conversation'
import { launchAgentTool } from '@/tools/cursor/launch_agent'
import { listAgentsTool } from '@/tools/cursor/list_agents'
import { stopAgentTool } from '@/tools/cursor/stop_agent'

export const cursorListAgentsTool = listAgentsTool
export const cursorGetAgentTool = getAgentTool
export const cursorGetConversationTool = getConversationTool
export const cursorLaunchAgentTool = launchAgentTool
export const cursorAddFollowupTool = addFollowupTool
export const cursorStopAgentTool = stopAgentTool
export const cursorDeleteAgentTool = deleteAgentTool
```

--------------------------------------------------------------------------------

````
