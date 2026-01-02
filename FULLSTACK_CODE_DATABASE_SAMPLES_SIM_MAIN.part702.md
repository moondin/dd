---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 702
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 702 of 933)

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
Location: sim-main/apps/sim/tools/knowledge/search.ts

```typescript
import type { KnowledgeSearchResponse } from '@/tools/knowledge/types'
import type { ToolConfig } from '@/tools/types'

export const knowledgeSearchTool: ToolConfig<any, KnowledgeSearchResponse> = {
  id: 'knowledge_search',
  name: 'Knowledge Search',
  description: 'Search for similar content in a knowledge base using vector similarity',
  version: '1.0.0',

  params: {
    knowledgeBaseId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the knowledge base to search in',
    },
    query: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Search query text (optional when using tag filters)',
    },
    topK: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of most similar results to return (1-100)',
    },
    tagFilters: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'Array of tag filters with tagName and tagValue properties',
      items: {
        type: 'object',
        properties: {
          tagName: { type: 'string' },
          tagValue: { type: 'string' },
        },
      },
    },
  },

  request: {
    url: () => '/api/knowledge/search',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const workflowId = params._context?.workflowId

      // Use single knowledge base ID
      const knowledgeBaseIds = [params.knowledgeBaseId]

      // Parse dynamic tag filters and send display names to API
      const filters: Record<string, string> = {}
      if (params.tagFilters) {
        let tagFilters = params.tagFilters

        // Handle both string (JSON) and array formats
        if (typeof tagFilters === 'string') {
          try {
            tagFilters = JSON.parse(tagFilters)
          } catch (error) {
            tagFilters = []
          }
        }

        if (Array.isArray(tagFilters)) {
          // Group filters by tag name for OR logic within same tag
          const groupedFilters: Record<string, string[]> = {}
          tagFilters.forEach((filter: any) => {
            if (filter.tagName && filter.tagValue && filter.tagValue.trim().length > 0) {
              if (!groupedFilters[filter.tagName]) {
                groupedFilters[filter.tagName] = []
              }
              groupedFilters[filter.tagName].push(filter.tagValue)
            }
          })

          // Convert to filters format - for now, join multiple values with OR separator
          Object.entries(groupedFilters).forEach(([tagName, values]) => {
            filters[tagName] = values.join('|OR|') // Use special separator for OR logic
          })
        }
      }

      const requestBody = {
        knowledgeBaseIds,
        query: params.query,
        topK: params.topK ? Math.max(1, Math.min(100, Number(params.topK))) : 10,
        ...(Object.keys(filters).length > 0 && { filters }),
        ...(workflowId && { workflowId }),
      }

      return requestBody
    },
  },
  transformResponse: async (response): Promise<KnowledgeSearchResponse> => {
    const result = await response.json()
    const data = result.data || result

    return {
      success: true,
      output: {
        results: data.results || [],
        query: data.query,
        totalResults: data.totalResults || 0,
        cost: data.cost,
      },
    }
  },

  outputs: {
    results: {
      type: 'array',
      description: 'Array of search results from the knowledge base',
      items: {
        type: 'object',
        properties: {
          documentId: { type: 'string', description: 'Document ID' },
          documentName: { type: 'string', description: 'Document name' },
          content: { type: 'string', description: 'Content of the result' },
          chunkIndex: { type: 'number', description: 'Index of the chunk within the document' },
          similarity: { type: 'number', description: 'Similarity score of the result' },
          metadata: { type: 'object', description: 'Metadata of the result, including tags' },
        },
      },
    },
    query: {
      type: 'string',
      description: 'The search query that was executed',
    },
    totalResults: {
      type: 'number',
      description: 'Total number of results found',
    },
    cost: {
      type: 'object',
      description: 'Cost information for the search operation',
      optional: true,
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/knowledge/types.ts

```typescript
export interface KnowledgeSearchResult {
  documentId: string
  documentName: string
  content: string
  chunkIndex: number
  metadata: Record<string, any>
  similarity: number
}

export interface KnowledgeSearchResponse {
  success: boolean
  output: {
    results: KnowledgeSearchResult[]
    query: string
    totalResults: number
    cost?: {
      input: number
      output: number
      total: number
      tokens: {
        prompt: number
        completion: number
        total: number
      }
      model: string
      pricing: {
        input: number
        output: number
        updatedAt: string
      }
    }
  }
  error?: string
}

export interface KnowledgeSearchParams {
  knowledgeBaseIds: string | string[]
  query: string
  topK?: number
}

export interface KnowledgeUploadChunkResult {
  chunkId: string
  chunkIndex: number
  content: string
  contentLength: number
  tokenCount: number
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface KnowledgeUploadChunkResponse {
  success: boolean
  output: {
    data: KnowledgeUploadChunkResult
    message: string
    documentId: string
    documentName: string
    cost?: {
      input: number
      output: number
      total: number
      tokens: {
        prompt: number
        completion: number
        total: number
      }
      model: string
      pricing: {
        input: number
        output: number
        updatedAt: string
      }
    }
  }
  error?: string
}

export interface KnowledgeUploadChunkParams {
  documentId: string
  content: string
  enabled?: boolean
}

export interface KnowledgeCreateDocumentResult {
  documentId: string
  documentName: string
  type: string
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface KnowledgeCreateDocumentResponse {
  success: boolean
  output: {
    data: KnowledgeCreateDocumentResult
    message: string
  }
  error?: string
}
```

--------------------------------------------------------------------------------

---[FILE: upload_chunk.ts]---
Location: sim-main/apps/sim/tools/knowledge/upload_chunk.ts

```typescript
import type { KnowledgeUploadChunkResponse } from '@/tools/knowledge/types'
import type { ToolConfig } from '@/tools/types'

export const knowledgeUploadChunkTool: ToolConfig<any, KnowledgeUploadChunkResponse> = {
  id: 'knowledge_upload_chunk',
  name: 'Knowledge Upload Chunk',
  description: 'Upload a new chunk to a document in a knowledge base',
  version: '1.0.0',

  params: {
    knowledgeBaseId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the knowledge base containing the document',
    },
    documentId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the document to upload the chunk to',
    },
    content: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Content of the chunk to upload',
    },
  },

  request: {
    url: (params) =>
      `/api/knowledge/${params.knowledgeBaseId}/documents/${params.documentId}/chunks`,
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const workflowId = params._context?.workflowId

      const requestBody = {
        content: params.content,
        enabled: true,
        ...(workflowId && { workflowId }),
      }

      return requestBody
    },
  },

  transformResponse: async (response): Promise<KnowledgeUploadChunkResponse> => {
    const result = await response.json()
    const data = result.data || result

    return {
      success: true,
      output: {
        message: `Successfully uploaded chunk to document`,
        data: {
          chunkId: data.id,
          chunkIndex: data.chunkIndex || 0,
          content: data.content,
          contentLength: data.contentLength || data.content?.length || 0,
          tokenCount: data.tokenCount || 0,
          enabled: data.enabled !== undefined ? data.enabled : true,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
        documentId: data.documentId,
        documentName: data.documentName,
        cost: data.cost,
      },
    }
  },

  outputs: {
    data: {
      type: 'object',
      description: 'Information about the uploaded chunk',
      properties: {
        chunkId: { type: 'string', description: 'Chunk ID' },
        chunkIndex: { type: 'number', description: 'Index of the chunk within the document' },
        content: { type: 'string', description: 'Content of the chunk' },
        contentLength: { type: 'number', description: 'Length of the content in characters' },
        tokenCount: { type: 'number', description: 'Number of tokens in the chunk' },
        enabled: { type: 'boolean', description: 'Whether the chunk is enabled' },
        createdAt: { type: 'string', description: 'Creation timestamp' },
        updatedAt: { type: 'string', description: 'Last update timestamp' },
      },
    },
    message: {
      type: 'string',
      description: 'Success or error message describing the operation result',
    },
    documentId: {
      type: 'string',
      description: 'ID of the document the chunk was added to',
    },
    documentName: {
      type: 'string',
      description: 'Name of the document the chunk was added to',
    },
    cost: {
      type: 'object',
      description: 'Cost information for the upload operation',
      optional: true,
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: add_label_to_issue.ts]---
Location: sim-main/apps/sim/tools/linear/add_label_to_issue.ts

```typescript
import type { LinearAddLabelResponse, LinearAddLabelToIssueParams } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearAddLabelToIssueTool: ToolConfig<
  LinearAddLabelToIssueParams,
  LinearAddLabelResponse
> = {
  id: 'linear_add_label_to_issue',
  name: 'Linear Add Label to Issue',
  description: 'Add a label to an issue in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    issueId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Linear issue ID',
    },
    labelId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Label ID to add to the issue',
    },
  },

  request: {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Linear API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params) => ({
      query: `
        mutation AddLabelToIssue($issueId: String!, $labelId: String!) {
          issueAddLabel(id: $issueId, labelId: $labelId) {
            success
            issue {
              id
            }
          }
        }
      `,
      variables: {
        issueId: params.issueId,
        labelId: params.labelId,
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to add label to issue',
        output: {},
      }
    }

    const result = data.data.issueAddLabel
    return {
      success: result.success,
      output: {
        success: result.success,
        issueId: result.issue?.id || '',
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the label was successfully added',
    },
    issueId: {
      type: 'string',
      description: 'The ID of the issue',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: add_label_to_project.ts]---
Location: sim-main/apps/sim/tools/linear/add_label_to_project.ts

```typescript
import type {
  LinearAddLabelToProjectParams,
  LinearAddLabelToProjectResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearAddLabelToProjectTool: ToolConfig<
  LinearAddLabelToProjectParams,
  LinearAddLabelToProjectResponse
> = {
  id: 'linear_add_label_to_project',
  name: 'Linear Add Label to Project',
  description: 'Add a label to a project in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Project ID',
    },
    labelId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Label ID to add',
    },
  },

  request: {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Linear API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params) => ({
      query: `
        mutation ProjectAddLabel($id: String!, $labelId: String!) {
          projectAddLabel(id: $id, labelId: $labelId) {
            success
            project {
              id
            }
          }
        }
      `,
      variables: {
        id: params.projectId,
        labelId: params.labelId,
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to add label to project',
        output: {},
      }
    }

    const result = data.data.projectAddLabel
    return {
      success: result.success,
      output: {
        success: result.success,
        projectId: result.project?.id,
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the label was added successfully',
    },
    projectId: {
      type: 'string',
      description: 'The project ID',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: archive_issue.ts]---
Location: sim-main/apps/sim/tools/linear/archive_issue.ts

```typescript
import type { LinearArchiveIssueParams, LinearArchiveIssueResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearArchiveIssueTool: ToolConfig<
  LinearArchiveIssueParams,
  LinearArchiveIssueResponse
> = {
  id: 'linear_archive_issue',
  name: 'Linear Archive Issue',
  description: 'Archive an issue in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    issueId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Linear issue ID to archive',
    },
  },

  request: {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Linear API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params) => ({
      query: `
        mutation ArchiveIssue($id: String!) {
          issueArchive(id: $id) {
            success
            entity {
              id
            }
          }
        }
      `,
      variables: {
        id: params.issueId,
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to archive issue',
        output: {},
      }
    }

    const result = data.data.issueArchive
    return {
      success: result.success,
      output: {
        success: result.success,
        issueId: result.entity?.id,
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the archive operation was successful',
    },
    issueId: {
      type: 'string',
      description: 'The ID of the archived issue',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: archive_label.ts]---
Location: sim-main/apps/sim/tools/linear/archive_label.ts

```typescript
import type { LinearArchiveLabelParams, LinearArchiveLabelResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearArchiveLabelTool: ToolConfig<
  LinearArchiveLabelParams,
  LinearArchiveLabelResponse
> = {
  id: 'linear_archive_label',
  name: 'Linear Archive Label',
  description: 'Archive a label in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    labelId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Label ID to archive',
    },
  },

  request: {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Linear API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params) => ({
      query: `
        mutation ArchiveLabel($id: String!) {
          issueLabelArchive(id: $id) {
            success
          }
        }
      `,
      variables: {
        id: params.labelId,
      },
    }),
  },

  transformResponse: async (response, params) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to archive label',
        output: {},
      }
    }

    return {
      success: data.data.issueLabelArchive.success,
      output: {
        success: data.data.issueLabelArchive.success,
        labelId: params?.labelId,
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the archive operation was successful',
    },
    labelId: {
      type: 'string',
      description: 'The ID of the archived label',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: archive_project.ts]---
Location: sim-main/apps/sim/tools/linear/archive_project.ts

```typescript
import type { LinearArchiveProjectParams, LinearArchiveProjectResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearArchiveProjectTool: ToolConfig<
  LinearArchiveProjectParams,
  LinearArchiveProjectResponse
> = {
  id: 'linear_archive_project',
  name: 'Linear Archive Project',
  description: 'Archive a project in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Project ID to archive',
    },
  },

  request: {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Linear API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params) => ({
      query: `
        mutation ArchiveProject($id: String!) {
          projectDelete(id: $id) {
            success
            entity {
              id
            }
          }
        }
      `,
      variables: {
        id: params.projectId,
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to archive project',
        output: {},
      }
    }

    const result = data.data.projectDelete
    if (!result.success) {
      return {
        success: false,
        error: 'Project archive was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        success: result.success,
        projectId: result.entity?.id || '',
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the archive operation was successful',
    },
    projectId: {
      type: 'string',
      description: 'The ID of the archived project',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_attachment.ts]---
Location: sim-main/apps/sim/tools/linear/create_attachment.ts

```typescript
import type {
  LinearCreateAttachmentParams,
  LinearCreateAttachmentResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearCreateAttachmentTool: ToolConfig<
  LinearCreateAttachmentParams,
  LinearCreateAttachmentResponse
> = {
  id: 'linear_create_attachment',
  name: 'Linear Create Attachment',
  description: 'Add an attachment to an issue in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    issueId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Issue ID to attach to',
    },
    url: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'URL of the attachment',
    },
    title: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Attachment title',
    },
    subtitle: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Attachment subtitle/description',
    },
  },

  request: {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Linear API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params) => {
      const input: Record<string, any> = {
        issueId: params.issueId,
        url: params.url,
        title: params.title,
      }

      if (params.subtitle != null && params.subtitle !== '') input.subtitle = params.subtitle

      return {
        query: `
          mutation CreateAttachment($input: AttachmentCreateInput!) {
            attachmentCreate(input: $input) {
              success
              attachment {
                id
                title
                subtitle
                url
                createdAt
                updatedAt
              }
            }
          }
        `,
        variables: {
          input,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to create attachment',
        output: {},
      }
    }

    const result = data.data.attachmentCreate
    if (!result.success) {
      return {
        success: false,
        error: 'Attachment creation was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        attachment: result.attachment,
      },
    }
  },

  outputs: {
    attachment: {
      type: 'object',
      description: 'The created attachment',
      properties: {
        id: { type: 'string', description: 'Attachment ID' },
        title: { type: 'string', description: 'Attachment title' },
        subtitle: { type: 'string', description: 'Attachment subtitle' },
        url: { type: 'string', description: 'Attachment URL' },
        createdAt: { type: 'string', description: 'Creation timestamp' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_comment.ts]---
Location: sim-main/apps/sim/tools/linear/create_comment.ts

```typescript
import type { LinearCreateCommentParams, LinearCreateCommentResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearCreateCommentTool: ToolConfig<
  LinearCreateCommentParams,
  LinearCreateCommentResponse
> = {
  id: 'linear_create_comment',
  name: 'Linear Create Comment',
  description: 'Add a comment to an issue in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    issueId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Linear issue ID to comment on',
    },
    body: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comment text (supports Markdown)',
    },
  },

  request: {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Linear API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params) => ({
      query: `
        mutation CreateComment($input: CommentCreateInput!) {
          commentCreate(input: $input) {
            success
            comment {
              id
              body
              createdAt
              updatedAt
              user {
                id
                name
                email
              }
              issue {
                id
                title
              }
            }
          }
        }
      `,
      variables: {
        input: {
          issueId: params.issueId,
          body: params.body,
        },
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to create comment',
        output: {},
      }
    }

    const result = data.data.commentCreate
    if (!result.success) {
      return {
        success: false,
        error: 'Comment creation was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        comment: result.comment,
      },
    }
  },

  outputs: {
    comment: {
      type: 'object',
      description: 'The created comment',
      properties: {
        id: { type: 'string', description: 'Comment ID' },
        body: { type: 'string', description: 'Comment text' },
        createdAt: { type: 'string', description: 'Creation timestamp' },
        user: { type: 'object', description: 'User who created the comment' },
        issue: { type: 'object', description: 'Associated issue' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_customer.ts]---
Location: sim-main/apps/sim/tools/linear/create_customer.ts

```typescript
import type { LinearCreateCustomerParams, LinearCreateCustomerResponse } from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearCreateCustomerTool: ToolConfig<
  LinearCreateCustomerParams,
  LinearCreateCustomerResponse
> = {
  id: 'linear_create_customer',
  name: 'Linear Create Customer',
  description: 'Create a new customer in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Customer name',
    },
    domains: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'Domains associated with this customer',
    },
    externalIds: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'External IDs from other systems',
    },
    logoUrl: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: "Customer's logo URL",
    },
    ownerId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'ID of the user who owns this customer',
    },
    revenue: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Annual revenue from this customer',
    },
    size: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Size of the customer organization',
    },
    statusId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Customer status ID',
    },
    tierId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Customer tier ID',
    },
  },

  request: {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Linear API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params) => {
      const input: Record<string, any> = {
        name: params.name,
      }

      // Optional fields with proper validation
      if (params.domains != null && Array.isArray(params.domains) && params.domains.length > 0) {
        input.domains = params.domains
      }
      if (
        params.externalIds != null &&
        Array.isArray(params.externalIds) &&
        params.externalIds.length > 0
      ) {
        input.externalIds = params.externalIds
      }
      if (params.logoUrl != null && params.logoUrl !== '') {
        input.logoUrl = params.logoUrl
      }
      if (params.ownerId != null && params.ownerId !== '') {
        input.ownerId = params.ownerId
      }
      if (params.revenue != null) {
        input.revenue = params.revenue
      }
      if (params.size != null) {
        input.size = params.size
      }
      if (params.statusId != null && params.statusId !== '') {
        input.statusId = params.statusId
      }
      if (params.tierId != null && params.tierId !== '') {
        input.tierId = params.tierId
      }

      return {
        query: `
          mutation CustomerCreate($input: CustomerCreateInput!) {
            customerCreate(input: $input) {
              success
              customer {
                id
                name
                domains
                externalIds
                logoUrl
                approximateNeedCount
                createdAt
                archivedAt
              }
            }
          }
        `,
        variables: {
          input,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to create customer',
        output: {},
      }
    }

    const result = data.data.customerCreate
    if (!result.success) {
      return {
        success: false,
        error: 'Customer creation was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        customer: result.customer,
      },
    }
  },

  outputs: {
    customer: {
      type: 'object',
      description: 'The created customer',
      properties: {
        id: { type: 'string', description: 'Customer ID' },
        name: { type: 'string', description: 'Customer name' },
        domains: { type: 'array', description: 'Associated domains' },
        externalIds: { type: 'array', description: 'External IDs' },
        logoUrl: { type: 'string', description: 'Logo URL' },
        approximateNeedCount: { type: 'number', description: 'Number of customer needs' },
        createdAt: { type: 'string', description: 'Creation timestamp' },
        archivedAt: { type: 'string', description: 'Archive timestamp (null if not archived)' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_customer_request.ts]---
Location: sim-main/apps/sim/tools/linear/create_customer_request.ts

```typescript
import type {
  LinearCreateCustomerRequestParams,
  LinearCreateCustomerRequestResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearCreateCustomerRequestTool: ToolConfig<
  LinearCreateCustomerRequestParams,
  LinearCreateCustomerRequestResponse
> = {
  id: 'linear_create_customer_request',
  name: 'Linear Create Customer Request',
  description:
    'Create a customer request (need) in Linear. Assign to customer, set urgency (priority: 0 = Not important, 1 = Important), and optionally link to an issue.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    customerId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Customer ID to assign this request to',
    },
    body: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Description of the customer request',
    },
    priority: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Urgency level: 0 = Not important, 1 = Important (default: 0)',
    },
    issueId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Issue ID to link this request to',
    },
    projectId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Project ID to link this request to',
    },
  },

  request: {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Linear API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params) => {
      const input: Record<string, any> = {
        customerId: params.customerId,
        priority: params.priority != null ? params.priority : 0,
      }

      // Optional fields with proper validation
      if (params.body != null && params.body !== '') {
        input.body = params.body
      }
      if (params.issueId != null && params.issueId !== '') {
        input.issueId = params.issueId
      }
      if (params.projectId != null && params.projectId !== '') {
        input.projectId = params.projectId
      }

      return {
        query: `
          mutation CustomerNeedCreate($input: CustomerNeedCreateInput!) {
            customerNeedCreate(input: $input) {
              success
              need {
                id
                body
                priority
                createdAt
                updatedAt
                archivedAt
                customer {
                  id
                  name
                }
                issue {
                  id
                  title
                }
                project {
                  id
                  name
                }
                creator {
                  id
                  name
                }
                url
              }
            }
          }
        `,
        variables: {
          input,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to create customer request',
        output: {},
      }
    }

    const result = data.data.customerNeedCreate
    if (!result.success) {
      return {
        success: false,
        error: 'Customer request creation was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        customerNeed: result.need,
      },
    }
  },

  outputs: {
    customerNeed: {
      type: 'object',
      description: 'The created customer request',
      properties: {
        id: { type: 'string', description: 'Customer request ID' },
        body: { type: 'string', description: 'Request description' },
        priority: {
          type: 'number',
          description: 'Urgency level (0 = Not important, 1 = Important)',
        },
        createdAt: { type: 'string', description: 'Creation timestamp' },
        updatedAt: { type: 'string', description: 'Last update timestamp' },
        archivedAt: { type: 'string', description: 'Archive timestamp (null if not archived)' },
        customer: { type: 'object', description: 'Assigned customer' },
        issue: { type: 'object', description: 'Linked issue (null if not linked)' },
        project: { type: 'object', description: 'Linked project (null if not linked)' },
        creator: { type: 'object', description: 'User who created the request' },
        url: { type: 'string', description: 'URL to the customer request' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
