---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 665
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 665 of 933)

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

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/dropbox/index.ts

```typescript
import { dropboxCopyTool } from '@/tools/dropbox/copy'
import { dropboxCreateFolderTool } from '@/tools/dropbox/create_folder'
import { dropboxCreateSharedLinkTool } from '@/tools/dropbox/create_shared_link'
import { dropboxDeleteTool } from '@/tools/dropbox/delete'
import { dropboxDownloadTool } from '@/tools/dropbox/download'
import { dropboxGetMetadataTool } from '@/tools/dropbox/get_metadata'
import { dropboxListFolderTool } from '@/tools/dropbox/list_folder'
import { dropboxMoveTool } from '@/tools/dropbox/move'
import { dropboxSearchTool } from '@/tools/dropbox/search'
import { dropboxUploadTool } from '@/tools/dropbox/upload'

export {
  dropboxCopyTool,
  dropboxCreateFolderTool,
  dropboxCreateSharedLinkTool,
  dropboxDeleteTool,
  dropboxDownloadTool,
  dropboxGetMetadataTool,
  dropboxListFolderTool,
  dropboxMoveTool,
  dropboxSearchTool,
  dropboxUploadTool,
}
```

--------------------------------------------------------------------------------

---[FILE: list_folder.ts]---
Location: sim-main/apps/sim/tools/dropbox/list_folder.ts

```typescript
import type { DropboxListFolderParams, DropboxListFolderResponse } from '@/tools/dropbox/types'
import type { ToolConfig } from '@/tools/types'

export const dropboxListFolderTool: ToolConfig<DropboxListFolderParams, DropboxListFolderResponse> =
  {
    id: 'dropbox_list_folder',
    name: 'Dropbox List Folder',
    description: 'List the contents of a folder in Dropbox',
    version: '1.0.0',

    oauth: {
      required: true,
      provider: 'dropbox',
    },

    params: {
      path: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'The path of the folder to list (use "" for root)',
      },
      recursive: {
        type: 'boolean',
        required: false,
        visibility: 'user-only',
        description: 'If true, list contents recursively',
      },
      includeDeleted: {
        type: 'boolean',
        required: false,
        visibility: 'user-only',
        description: 'If true, include deleted files/folders',
      },
      includeMediaInfo: {
        type: 'boolean',
        required: false,
        visibility: 'user-only',
        description: 'If true, include media info for photos/videos',
      },
      limit: {
        type: 'number',
        required: false,
        visibility: 'user-only',
        description: 'Maximum number of results to return (default: 500)',
      },
    },

    request: {
      url: 'https://api.dropboxapi.com/2/files/list_folder',
      method: 'POST',
      headers: (params) => {
        if (!params.accessToken) {
          throw new Error('Missing access token for Dropbox API request')
        }
        return {
          Authorization: `Bearer ${params.accessToken}`,
          'Content-Type': 'application/json',
        }
      },
      body: (params) => ({
        path: params.path === '/' ? '' : params.path,
        recursive: params.recursive ?? false,
        include_deleted: params.includeDeleted ?? false,
        include_media_info: params.includeMediaInfo ?? false,
        limit: params.limit,
      }),
    },

    transformResponse: async (response) => {
      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error_summary || data.error?.message || 'Failed to list folder',
          output: {},
        }
      }

      return {
        success: true,
        output: {
          entries: data.entries,
          cursor: data.cursor,
          hasMore: data.has_more,
        },
      }
    },

    outputs: {
      entries: {
        type: 'array',
        description: 'List of files and folders in the directory',
        items: {
          type: 'object',
          properties: {
            '.tag': { type: 'string', description: 'Type: file, folder, or deleted' },
            id: { type: 'string', description: 'Unique identifier' },
            name: { type: 'string', description: 'Name of the file/folder' },
            path_display: { type: 'string', description: 'Display path' },
            size: { type: 'number', description: 'Size in bytes (files only)' },
          },
        },
      },
      cursor: {
        type: 'string',
        description: 'Cursor for pagination',
      },
      hasMore: {
        type: 'boolean',
        description: 'Whether there are more results',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: move.ts]---
Location: sim-main/apps/sim/tools/dropbox/move.ts

```typescript
import type { DropboxMoveParams, DropboxMoveResponse } from '@/tools/dropbox/types'
import type { ToolConfig } from '@/tools/types'

export const dropboxMoveTool: ToolConfig<DropboxMoveParams, DropboxMoveResponse> = {
  id: 'dropbox_move',
  name: 'Dropbox Move',
  description: 'Move or rename a file or folder in Dropbox',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'dropbox',
  },

  params: {
    fromPath: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The source path of the file or folder to move',
    },
    toPath: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The destination path for the moved file or folder',
    },
    autorename: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'If true, rename the file if there is a conflict at destination',
    },
  },

  request: {
    url: 'https://api.dropboxapi.com/2/files/move_v2',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Dropbox API request')
      }
      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => ({
      from_path: params.fromPath,
      to_path: params.toPath,
      autorename: params.autorename ?? false,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error_summary || data.error?.message || 'Failed to move file/folder',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        metadata: data.metadata,
      },
    }
  },

  outputs: {
    metadata: {
      type: 'object',
      description: 'Metadata of the moved item',
      properties: {
        '.tag': { type: 'string', description: 'Type: file or folder' },
        id: { type: 'string', description: 'Unique identifier' },
        name: { type: 'string', description: 'Name of the moved item' },
        path_display: { type: 'string', description: 'Display path' },
        size: { type: 'number', description: 'Size in bytes (files only)' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search.ts]---
Location: sim-main/apps/sim/tools/dropbox/search.ts

```typescript
import type { DropboxSearchParams, DropboxSearchResponse } from '@/tools/dropbox/types'
import type { ToolConfig } from '@/tools/types'

export const dropboxSearchTool: ToolConfig<DropboxSearchParams, DropboxSearchResponse> = {
  id: 'dropbox_search',
  name: 'Dropbox Search',
  description: 'Search for files and folders in Dropbox',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'dropbox',
  },

  params: {
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The search query',
    },
    path: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Limit search to a specific folder path',
    },
    fileExtensions: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated list of file extensions to filter by (e.g., pdf,xlsx)',
    },
    maxResults: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of results to return (default: 100)',
    },
  },

  request: {
    url: 'https://api.dropboxapi.com/2/files/search_v2',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Dropbox API request')
      }
      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      const body: Record<string, any> = {
        query: params.query,
      }

      const options: Record<string, any> = {}

      if (params.path) {
        options.path = params.path
      }

      if (params.fileExtensions) {
        const extensions = params.fileExtensions
          .split(',')
          .map((ext) => ext.trim())
          .filter((ext) => ext.length > 0)
        if (extensions.length > 0) {
          options.file_extensions = extensions
        }
      }

      if (params.maxResults) {
        options.max_results = params.maxResults
      }

      if (Object.keys(options).length > 0) {
        body.options = options
      }

      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error_summary || data.error?.message || 'Failed to search files',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        matches: data.matches || [],
        hasMore: data.has_more || false,
        cursor: data.cursor,
      },
    }
  },

  outputs: {
    matches: {
      type: 'array',
      description: 'Search results',
      items: {
        type: 'object',
        properties: {
          match_type: {
            type: 'object',
            description: 'Type of match: filename, content, or both',
          },
          metadata: {
            type: 'object',
            description: 'File or folder metadata',
          },
        },
      },
    },
    hasMore: {
      type: 'boolean',
      description: 'Whether there are more results',
    },
    cursor: {
      type: 'string',
      description: 'Cursor for pagination',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/dropbox/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

// ===== Core Types =====

export interface DropboxFileMetadata {
  '.tag': 'file'
  id: string
  name: string
  path_display: string
  path_lower: string
  size: number
  client_modified: string
  server_modified: string
  rev: string
  content_hash?: string
  is_downloadable?: boolean
}

export interface DropboxFolderMetadata {
  '.tag': 'folder'
  id: string
  name: string
  path_display: string
  path_lower: string
}

export interface DropboxDeletedMetadata {
  '.tag': 'deleted'
  name: string
  path_display: string
  path_lower: string
}

export type DropboxMetadata = DropboxFileMetadata | DropboxFolderMetadata | DropboxDeletedMetadata

export interface DropboxSharedLinkMetadata {
  url: string
  name: string
  path_lower: string
  link_permissions: {
    can_revoke: boolean
    resolved_visibility: {
      '.tag': 'public' | 'team_only' | 'password' | 'team_and_password' | 'shared_folder_only'
    }
    revoke_failure_reason?: {
      '.tag': string
    }
  }
  expires?: string
  id?: string
}

export interface DropboxSearchMatch {
  match_type: {
    '.tag': 'filename' | 'content' | 'both'
  }
  metadata: {
    '.tag': 'metadata'
    metadata: DropboxMetadata
  }
}

// ===== Base Params =====

export interface DropboxBaseParams {
  accessToken?: string
}

// ===== Upload Params =====

export interface DropboxUploadParams extends DropboxBaseParams {
  path: string
  fileContent: string // Base64 encoded file content
  fileName?: string
  mode?: 'add' | 'overwrite'
  autorename?: boolean
  mute?: boolean
}

export interface DropboxUploadResponse extends ToolResponse {
  output: {
    file?: DropboxFileMetadata
  }
}

// ===== Download Params =====

export interface DropboxDownloadParams extends DropboxBaseParams {
  path: string
}

export interface DropboxDownloadResponse extends ToolResponse {
  output: {
    file?: DropboxFileMetadata
    content?: string // Base64 encoded file content
    temporaryLink?: string
  }
}

// ===== List Folder Params =====

export interface DropboxListFolderParams extends DropboxBaseParams {
  path: string
  recursive?: boolean
  includeDeleted?: boolean
  includeMediaInfo?: boolean
  limit?: number
}

export interface DropboxListFolderResponse extends ToolResponse {
  output: {
    entries?: DropboxMetadata[]
    cursor?: string
    hasMore?: boolean
  }
}

// ===== Create Folder Params =====

export interface DropboxCreateFolderParams extends DropboxBaseParams {
  path: string
  autorename?: boolean
}

export interface DropboxCreateFolderResponse extends ToolResponse {
  output: {
    folder?: DropboxFolderMetadata
  }
}

// ===== Delete Params =====

export interface DropboxDeleteParams extends DropboxBaseParams {
  path: string
}

export interface DropboxDeleteResponse extends ToolResponse {
  output: {
    metadata?: DropboxMetadata
    deleted?: boolean
  }
}

// ===== Copy Params =====

export interface DropboxCopyParams extends DropboxBaseParams {
  fromPath: string
  toPath: string
  autorename?: boolean
}

export interface DropboxCopyResponse extends ToolResponse {
  output: {
    metadata?: DropboxMetadata
  }
}

// ===== Move Params =====

export interface DropboxMoveParams extends DropboxBaseParams {
  fromPath: string
  toPath: string
  autorename?: boolean
}

export interface DropboxMoveResponse extends ToolResponse {
  output: {
    metadata?: DropboxMetadata
  }
}

// ===== Get Metadata Params =====

export interface DropboxGetMetadataParams extends DropboxBaseParams {
  path: string
  includeMediaInfo?: boolean
  includeDeleted?: boolean
}

export interface DropboxGetMetadataResponse extends ToolResponse {
  output: {
    metadata?: DropboxMetadata
  }
}

// ===== Create Shared Link Params =====

export interface DropboxCreateSharedLinkParams extends DropboxBaseParams {
  path: string
  requestedVisibility?: 'public' | 'team_only' | 'password'
  linkPassword?: string
  expires?: string
}

export interface DropboxCreateSharedLinkResponse extends ToolResponse {
  output: {
    sharedLink?: DropboxSharedLinkMetadata
  }
}

// ===== Search Params =====

export interface DropboxSearchParams extends DropboxBaseParams {
  query: string
  path?: string
  fileExtensions?: string
  maxResults?: number
}

export interface DropboxSearchResponse extends ToolResponse {
  output: {
    matches?: DropboxSearchMatch[]
    hasMore?: boolean
    cursor?: string
  }
}

// ===== Get Temporary Link Params =====

export interface DropboxGetTemporaryLinkParams extends DropboxBaseParams {
  path: string
}

export interface DropboxGetTemporaryLinkResponse extends ToolResponse {
  output: {
    metadata?: DropboxFileMetadata
    link?: string
  }
}

// ===== Combined Response Type =====

export type DropboxResponse =
  | DropboxUploadResponse
  | DropboxDownloadResponse
  | DropboxListFolderResponse
  | DropboxCreateFolderResponse
  | DropboxDeleteResponse
  | DropboxCopyResponse
  | DropboxMoveResponse
  | DropboxGetMetadataResponse
  | DropboxCreateSharedLinkResponse
  | DropboxSearchResponse
  | DropboxGetTemporaryLinkResponse
```

--------------------------------------------------------------------------------

---[FILE: upload.ts]---
Location: sim-main/apps/sim/tools/dropbox/upload.ts

```typescript
import type { DropboxUploadParams, DropboxUploadResponse } from '@/tools/dropbox/types'
import type { ToolConfig } from '@/tools/types'

export const dropboxUploadTool: ToolConfig<DropboxUploadParams, DropboxUploadResponse> = {
  id: 'dropbox_upload',
  name: 'Dropbox Upload File',
  description: 'Upload a file to Dropbox',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'dropbox',
  },

  params: {
    path: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'The path in Dropbox where the file should be saved (e.g., /folder/document.pdf)',
    },
    fileContent: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The base64 encoded content of the file to upload',
    },
    fileName: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Optional filename (used if path is a folder)',
    },
    mode: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Write mode: add (default) or overwrite',
    },
    autorename: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'If true, rename the file if there is a conflict',
    },
    mute: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: "If true, don't notify the user about this upload",
    },
  },

  request: {
    url: 'https://content.dropboxapi.com/2/files/upload',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Dropbox API request')
      }

      const dropboxApiArg = {
        path: params.path,
        mode: params.mode || 'add',
        autorename: params.autorename ?? true,
        mute: params.mute ?? false,
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify(dropboxApiArg),
      }
    },
    body: (params) => {
      // The body should be the raw binary data
      // In this case we're passing the base64 content which will be decoded
      return params.fileContent
    },
  },

  transformResponse: async (response, params) => {
    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error_summary || data.error?.message || 'Failed to upload file',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        file: data,
      },
    }
  },

  outputs: {
    file: {
      type: 'object',
      description: 'The uploaded file metadata',
      properties: {
        id: { type: 'string', description: 'Unique identifier for the file' },
        name: { type: 'string', description: 'Name of the file' },
        path_display: { type: 'string', description: 'Display path of the file' },
        path_lower: { type: 'string', description: 'Lowercase path of the file' },
        size: { type: 'number', description: 'Size of the file in bytes' },
        client_modified: { type: 'string', description: 'Client modification time' },
        server_modified: { type: 'string', description: 'Server modification time' },
        rev: { type: 'string', description: 'Revision identifier' },
        content_hash: { type: 'string', description: 'Content hash for the file' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/duckduckgo/index.ts

```typescript
import { searchTool } from '@/tools/duckduckgo/search'

export const duckduckgoSearchTool = searchTool
```

--------------------------------------------------------------------------------

---[FILE: search.ts]---
Location: sim-main/apps/sim/tools/duckduckgo/search.ts

```typescript
import type { DuckDuckGoSearchParams, DuckDuckGoSearchResponse } from '@/tools/duckduckgo/types'
import type { ToolConfig } from '@/tools/types'

export const searchTool: ToolConfig<DuckDuckGoSearchParams, DuckDuckGoSearchResponse> = {
  id: 'duckduckgo_search',
  name: 'DuckDuckGo Search',
  description:
    'Search the web using DuckDuckGo Instant Answers API. Returns instant answers, abstracts, and related topics for your query. Free to use without an API key.',
  version: '1.0.0',

  params: {
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The search query to execute',
    },
    noHtml: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Remove HTML from text in results (default: true)',
    },
    skipDisambig: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Skip disambiguation results (default: false)',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = 'https://api.duckduckgo.com/'
      const searchParams = new URLSearchParams({
        q: params.query,
        format: 'json',
        no_html: params.noHtml !== false ? '1' : '0',
        skip_disambig: params.skipDisambig ? '1' : '0',
      })
      return `${baseUrl}?${searchParams.toString()}`
    },
    method: 'GET',
    headers: () => ({
      Accept: 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    // Map related topics
    const relatedTopics = (data.RelatedTopics || []).map((topic: any) => ({
      FirstURL: topic.FirstURL,
      Text: topic.Text,
      Result: topic.Result,
      Icon: topic.Icon
        ? {
            URL: topic.Icon.URL,
            Height: topic.Icon.Height,
            Width: topic.Icon.Width,
          }
        : undefined,
    }))

    // Map results (external links)
    const results = (data.Results || []).map((result: any) => ({
      FirstURL: result.FirstURL,
      Text: result.Text,
      Result: result.Result,
      Icon: result.Icon
        ? {
            URL: result.Icon.URL,
            Height: result.Icon.Height,
            Width: result.Icon.Width,
          }
        : undefined,
    }))

    return {
      success: true,
      output: {
        heading: data.Heading || '',
        abstract: data.Abstract || '',
        abstractText: data.AbstractText || '',
        abstractSource: data.AbstractSource || '',
        abstractURL: data.AbstractURL || '',
        image: data.Image || '',
        answer: data.Answer || '',
        answerType: data.AnswerType || '',
        type: data.Type || '',
        relatedTopics,
        results,
      },
    }
  },

  outputs: {
    heading: {
      type: 'string',
      description: 'The heading/title of the instant answer',
    },
    abstract: {
      type: 'string',
      description: 'A short abstract summary of the topic',
    },
    abstractText: {
      type: 'string',
      description: 'Plain text version of the abstract',
    },
    abstractSource: {
      type: 'string',
      description: 'The source of the abstract (e.g., Wikipedia)',
    },
    abstractURL: {
      type: 'string',
      description: 'URL to the source of the abstract',
    },
    image: {
      type: 'string',
      description: 'URL to an image related to the topic',
    },
    answer: {
      type: 'string',
      description: 'Direct answer if available (e.g., for calculations)',
    },
    answerType: {
      type: 'string',
      description: 'Type of the answer (e.g., calc, ip, etc.)',
    },
    type: {
      type: 'string',
      description:
        'Response type: A (article), D (disambiguation), C (category), N (name), E (exclusive)',
    },
    relatedTopics: {
      type: 'array',
      description: 'Array of related topics with URLs and descriptions',
      items: {
        type: 'object',
        properties: {
          FirstURL: { type: 'string', description: 'URL to the related topic' },
          Text: { type: 'string', description: 'Description of the related topic' },
          Result: { type: 'string', description: 'HTML result snippet' },
        },
      },
    },
    results: {
      type: 'array',
      description: 'Array of external link results',
      items: {
        type: 'object',
        properties: {
          FirstURL: { type: 'string', description: 'URL of the result' },
          Text: { type: 'string', description: 'Description of the result' },
          Result: { type: 'string', description: 'HTML result snippet' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/duckduckgo/types.ts

```typescript
// Common types for DuckDuckGo tools
import type { ToolResponse } from '@/tools/types'

// Search tool types
export interface DuckDuckGoSearchParams {
  query: string
  noHtml?: boolean
  skipDisambig?: boolean
}

export interface DuckDuckGoRelatedTopic {
  FirstURL?: string
  Text?: string
  Result?: string
  Icon?: {
    URL?: string
    Height?: string
    Width?: string
  }
}

export interface DuckDuckGoResult {
  FirstURL?: string
  Text?: string
  Result?: string
  Icon?: {
    URL?: string
    Height?: string
    Width?: string
  }
}

export interface DuckDuckGoSearchOutput {
  heading: string
  abstract: string
  abstractText: string
  abstractSource: string
  abstractURL: string
  image: string
  answer: string
  answerType: string
  type: string
  relatedTopics: DuckDuckGoRelatedTopic[]
  results: DuckDuckGoResult[]
}

export interface DuckDuckGoSearchResponse extends ToolResponse {
  output: DuckDuckGoSearchOutput
}

export type DuckDuckGoResponse = DuckDuckGoSearchResponse
```

--------------------------------------------------------------------------------

---[FILE: delete.ts]---
Location: sim-main/apps/sim/tools/dynamodb/delete.ts

```typescript
import type { DynamoDBDeleteParams, DynamoDBDeleteResponse } from '@/tools/dynamodb/types'
import type { ToolConfig } from '@/tools/types'

export const deleteTool: ToolConfig<DynamoDBDeleteParams, DynamoDBDeleteResponse> = {
  id: 'dynamodb_delete',
  name: 'DynamoDB Delete',
  description: 'Delete an item from a DynamoDB table',
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
    tableName: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'DynamoDB table name',
    },
    key: {
      type: 'object',
      required: true,
      visibility: 'user-or-llm',
      description: 'Primary key of the item to delete',
    },
    conditionExpression: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Condition that must be met for the delete to succeed',
    },
  },

  request: {
    url: '/api/tools/dynamodb/delete',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      region: params.region,
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
      tableName: params.tableName,
      key: params.key,
      ...(params.conditionExpression && { conditionExpression: params.conditionExpression }),
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'DynamoDB delete failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Item deleted successfully',
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get.ts]---
Location: sim-main/apps/sim/tools/dynamodb/get.ts

```typescript
import type { DynamoDBGetParams, DynamoDBGetResponse } from '@/tools/dynamodb/types'
import type { ToolConfig } from '@/tools/types'

export const getTool: ToolConfig<DynamoDBGetParams, DynamoDBGetResponse> = {
  id: 'dynamodb_get',
  name: 'DynamoDB Get',
  description: 'Get an item from a DynamoDB table by primary key',
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
    tableName: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'DynamoDB table name',
    },
    key: {
      type: 'object',
      required: true,
      visibility: 'user-or-llm',
      description: 'Primary key of the item to retrieve',
    },
    consistentRead: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Use strongly consistent read',
    },
  },

  request: {
    url: '/api/tools/dynamodb/get',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      region: params.region,
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
      tableName: params.tableName,
      key: params.key,
      ...(params.consistentRead !== undefined && { consistentRead: params.consistentRead }),
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'DynamoDB get failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Item retrieved successfully',
        item: data.item,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    item: { type: 'object', description: 'Retrieved item' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/dynamodb/index.ts

```typescript
import { deleteTool } from './delete'
import { getTool } from './get'
import { putTool } from './put'
import { queryTool } from './query'
import { scanTool } from './scan'
import { updateTool } from './update'

export const dynamodbDeleteTool = deleteTool
export const dynamodbGetTool = getTool
export const dynamodbPutTool = putTool
export const dynamodbQueryTool = queryTool
export const dynamodbScanTool = scanTool
export const dynamodbUpdateTool = updateTool
```

--------------------------------------------------------------------------------

---[FILE: put.ts]---
Location: sim-main/apps/sim/tools/dynamodb/put.ts

```typescript
import type { DynamoDBPutParams, DynamoDBPutResponse } from '@/tools/dynamodb/types'
import type { ToolConfig } from '@/tools/types'

export const putTool: ToolConfig<DynamoDBPutParams, DynamoDBPutResponse> = {
  id: 'dynamodb_put',
  name: 'DynamoDB Put',
  description: 'Put an item into a DynamoDB table',
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
    tableName: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'DynamoDB table name',
    },
    item: {
      type: 'object',
      required: true,
      visibility: 'user-or-llm',
      description: 'Item to put into the table',
    },
  },

  request: {
    url: '/api/tools/dynamodb/put',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      region: params.region,
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
      tableName: params.tableName,
      item: params.item,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'DynamoDB put failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Item created successfully',
        item: data.item,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    item: { type: 'object', description: 'Created item' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: query.ts]---
Location: sim-main/apps/sim/tools/dynamodb/query.ts

```typescript
import type { DynamoDBQueryParams, DynamoDBQueryResponse } from '@/tools/dynamodb/types'
import type { ToolConfig } from '@/tools/types'

export const queryTool: ToolConfig<DynamoDBQueryParams, DynamoDBQueryResponse> = {
  id: 'dynamodb_query',
  name: 'DynamoDB Query',
  description: 'Query items from a DynamoDB table using key conditions',
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
    tableName: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'DynamoDB table name',
    },
    keyConditionExpression: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Key condition expression (e.g., "pk = :pk")',
    },
    filterExpression: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter expression for results',
    },
    expressionAttributeNames: {
      type: 'object',
      required: false,
      visibility: 'user-or-llm',
      description: 'Attribute name mappings for reserved words',
    },
    expressionAttributeValues: {
      type: 'object',
      required: false,
      visibility: 'user-or-llm',
      description: 'Expression attribute values',
    },
    indexName: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Secondary index name to query',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Maximum number of items to return',
    },
  },

  request: {
    url: '/api/tools/dynamodb/query',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      region: params.region,
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
      tableName: params.tableName,
      keyConditionExpression: params.keyConditionExpression,
      ...(params.filterExpression && { filterExpression: params.filterExpression }),
      ...(params.expressionAttributeNames && {
        expressionAttributeNames: params.expressionAttributeNames,
      }),
      ...(params.expressionAttributeValues && {
        expressionAttributeValues: params.expressionAttributeValues,
      }),
      ...(params.indexName && { indexName: params.indexName }),
      ...(params.limit && { limit: params.limit }),
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'DynamoDB query failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Query executed successfully',
        items: data.items || [],
        count: data.count || 0,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    items: { type: 'array', description: 'Array of items returned' },
    count: { type: 'number', description: 'Number of items returned' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: scan.ts]---
Location: sim-main/apps/sim/tools/dynamodb/scan.ts

```typescript
import type { DynamoDBScanParams, DynamoDBScanResponse } from '@/tools/dynamodb/types'
import type { ToolConfig } from '@/tools/types'

export const scanTool: ToolConfig<DynamoDBScanParams, DynamoDBScanResponse> = {
  id: 'dynamodb_scan',
  name: 'DynamoDB Scan',
  description: 'Scan all items in a DynamoDB table',
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
    tableName: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'DynamoDB table name',
    },
    filterExpression: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter expression for results',
    },
    projectionExpression: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Attributes to retrieve',
    },
    expressionAttributeNames: {
      type: 'object',
      required: false,
      visibility: 'user-or-llm',
      description: 'Attribute name mappings for reserved words',
    },
    expressionAttributeValues: {
      type: 'object',
      required: false,
      visibility: 'user-or-llm',
      description: 'Expression attribute values',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Maximum number of items to return',
    },
  },

  request: {
    url: '/api/tools/dynamodb/scan',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      region: params.region,
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
      tableName: params.tableName,
      ...(params.filterExpression && { filterExpression: params.filterExpression }),
      ...(params.projectionExpression && { projectionExpression: params.projectionExpression }),
      ...(params.expressionAttributeNames && {
        expressionAttributeNames: params.expressionAttributeNames,
      }),
      ...(params.expressionAttributeValues && {
        expressionAttributeValues: params.expressionAttributeValues,
      }),
      ...(params.limit && { limit: params.limit }),
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'DynamoDB scan failed')
    }

    return {
      success: true,
      output: {
        message: data.message || 'Scan executed successfully',
        items: data.items || [],
        count: data.count || 0,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    items: { type: 'array', description: 'Array of items returned' },
    count: { type: 'number', description: 'Number of items returned' },
  },
}
```

--------------------------------------------------------------------------------

````
