---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 725
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 725 of 933)

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

---[FILE: utils.ts]---
Location: sim-main/apps/sim/tools/notion/utils.ts

```typescript
export function formatPropertyValue(property: any): string {
  switch (property.type) {
    case 'title':
      return property.title?.map((t: any) => t.plain_text || '').join('') || ''
    case 'rich_text':
      return property.rich_text?.map((t: any) => t.plain_text || '').join('') || ''
    case 'number':
      return String(property.number || '')
    case 'select':
      return property.select?.name || ''
    case 'multi_select':
      return property.multi_select?.map((s: any) => s.name).join(', ') || ''
    case 'date':
      return property.date?.start || ''
    case 'checkbox':
      return property.checkbox ? 'Yes' : 'No'
    case 'url':
      return property.url || ''
    case 'email':
      return property.email || ''
    case 'phone_number':
      return property.phone_number || ''
    default:
      return JSON.stringify(property)
  }
}

export function extractTitle(properties: Record<string, any>): string {
  for (const [, value] of Object.entries(properties)) {
    if (
      value.type === 'title' &&
      value.title &&
      Array.isArray(value.title) &&
      value.title.length > 0
    ) {
      return value.title.map((t: any) => t.plain_text || '').join('')
    }
  }
  return ''
}

export function extractTitleFromItem(item: any): string {
  if (item.object === 'page') {
    // For pages, check properties first
    if (item.properties?.title?.title && Array.isArray(item.properties.title.title)) {
      const title = item.properties.title.title.map((t: any) => t.plain_text || '').join('')
      if (title) return title
    }
    // Fallback to page title
    return item.title || 'Untitled Page'
  }
  if (item.object === 'database') {
    // For databases, get title from title array
    if (item.title && Array.isArray(item.title)) {
      return item.title.map((t: any) => t.plain_text || '').join('') || 'Untitled Database'
    }
    return 'Untitled Database'
  }
  return 'Untitled'
}
```

--------------------------------------------------------------------------------

---[FILE: write.ts]---
Location: sim-main/apps/sim/tools/notion/write.ts

```typescript
import type { NotionResponse, NotionWriteParams } from '@/tools/notion/types'
import type { ToolConfig } from '@/tools/types'

export const notionWriteTool: ToolConfig<NotionWriteParams, NotionResponse> = {
  id: 'notion_write',
  name: 'Notion Content Appender',
  description: 'Append content to a Notion page',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'notion',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Notion OAuth access token',
    },
    pageId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the Notion page to append content to',
    },
    content: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The content to append to the page',
    },
  },

  request: {
    url: (params: NotionWriteParams) => {
      // Format page ID with hyphens if needed
      const formattedId = params.pageId.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')
      return `https://api.notion.com/v1/blocks/${formattedId}/children`
    },
    method: 'PATCH',
    headers: (params: NotionWriteParams) => {
      // Validate access token
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      }
    },
    body: (params: NotionWriteParams) => ({
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: params.content,
                },
              },
            ],
          },
        },
      ],
    }),
  },

  transformResponse: async (response: Response) => {
    const _data = await response.json()
    return {
      success: response.ok,
      output: {
        content: 'Successfully appended content to Notion page',
      },
    }
  },

  outputs: {
    content: {
      type: 'string',
      description: 'Success message confirming content was appended to page',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_folder.ts]---
Location: sim-main/apps/sim/tools/onedrive/create_folder.ts

```typescript
import type { OneDriveToolParams, OneDriveUploadResponse } from '@/tools/onedrive/types'
import type { ToolConfig } from '@/tools/types'

export const createFolderTool: ToolConfig<OneDriveToolParams, OneDriveUploadResponse> = {
  id: 'onedrive_create_folder',
  name: 'Create Folder in OneDrive',
  description: 'Create a new folder in OneDrive',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'onedrive',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the OneDrive API',
    },
    folderName: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Name of the folder to create',
    },
    folderSelector: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Select the parent folder to create the folder in',
    },
    manualFolderId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'Manually entered parent folder ID (advanced mode)',
    },
  },

  request: {
    url: (params) => {
      // Use specific parent folder URL if parentId is provided
      const parentFolderId = params.manualFolderId || params.folderSelector
      if (parentFolderId) {
        return `https://graph.microsoft.com/v1.0/me/drive/items/${encodeURIComponent(parentFolderId)}/children`
      }
      return 'https://graph.microsoft.com/v1.0/me/drive/root/children'
    },
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      return {
        name: params.folderName,
        folder: {}, // Required facet for folder creation in Microsoft Graph API
        '@microsoft.graph.conflictBehavior': 'rename', // Handle name conflicts
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        file: {
          id: data.id,
          name: data.name,
          mimeType: 'application/vnd.microsoft.graph.folder',
          webViewLink: data.webUrl,
          size: data.size,
          createdTime: data.createdDateTime,
          modifiedTime: data.lastModifiedDateTime,
          parentReference: data.parentReference,
        },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the folder was created successfully' },
    file: {
      type: 'object',
      description:
        'The created folder object with metadata including id, name, webViewLink, and timestamps',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete.ts]---
Location: sim-main/apps/sim/tools/onedrive/delete.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { OneDriveDeleteResponse, OneDriveToolParams } from '@/tools/onedrive/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('OneDriveDeleteTool')

export const deleteTool: ToolConfig<OneDriveToolParams, OneDriveDeleteResponse> = {
  id: 'onedrive_delete',
  name: 'Delete File from OneDrive',
  description: 'Delete a file or folder from OneDrive',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'onedrive',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the OneDrive API',
    },
    fileId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the file or folder to delete',
    },
  },

  request: {
    url: (params) => {
      return `https://graph.microsoft.com/v1.0/me/drive/items/${encodeURIComponent(params.fileId || '')}`
    },
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response: Response, params?: OneDriveToolParams) => {
    if (response.status === 204) {
      logger.info('Successfully deleted file from OneDrive', {
        fileId: params?.fileId,
      })

      return {
        success: true,
        output: {
          fileId: params?.fileId || '',
          deleted: true,
        },
      }
    }

    // If not 204, try to parse error
    const data = await response.json().catch(() => ({}))
    const errorMessage = data.error?.message || 'Failed to delete file'

    logger.error('Failed to delete file from OneDrive', {
      fileId: params?.fileId,
      error: errorMessage,
    })

    throw new Error(errorMessage)
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the file was deleted successfully' },
    deleted: { type: 'boolean', description: 'Confirmation that the file was deleted' },
    fileId: { type: 'string', description: 'The ID of the deleted file' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: download.ts]---
Location: sim-main/apps/sim/tools/onedrive/download.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { OneDriveDownloadResponse, OneDriveToolParams } from '@/tools/onedrive/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('OneDriveDownloadTool')

export const downloadTool: ToolConfig<OneDriveToolParams, OneDriveDownloadResponse> = {
  id: 'onedrive_download',
  name: 'Download File from OneDrive',
  description: 'Download a file from OneDrive',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'onedrive',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Microsoft Graph API',
    },
    fileId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the file to download',
    },
    fileName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Optional filename override',
    },
  },

  request: {
    url: (params) => {
      return `https://graph.microsoft.com/v1.0/me/drive/items/${params.fileId}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response: Response, params?: OneDriveToolParams) => {
    try {
      if (!response.ok) {
        const errorDetails = await response.json().catch(() => ({}))
        logger.error('Failed to get file metadata', {
          status: response.status,
          statusText: response.statusText,
          error: errorDetails,
          requestedFileId: params?.fileId,
        })
        throw new Error(errorDetails.error?.message || 'Failed to get file metadata')
      }

      const metadata = await response.json()

      // Check if this is actually a folder
      if (metadata.folder && !metadata.file) {
        logger.error('Attempted to download a folder instead of a file', {
          itemId: metadata.id,
          itemName: metadata.name,
          isFolder: true,
        })
        throw new Error(`Cannot download folder "${metadata.name}". Please select a file instead.`)
      }

      const fileId = metadata.id
      const fileName = metadata.name
      const mimeType = metadata.file?.mimeType || 'application/octet-stream'
      const authHeader = `Bearer ${params?.accessToken || ''}`

      const downloadResponse = await fetch(
        `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/content`,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      )

      if (!downloadResponse.ok) {
        const downloadError = await downloadResponse.json().catch(() => ({}))
        logger.error('Failed to download file', {
          status: downloadResponse.status,
          statusText: downloadResponse.statusText,
          error: downloadError,
        })
        throw new Error(downloadError.error?.message || 'Failed to download file')
      }

      const arrayBuffer = await downloadResponse.arrayBuffer()
      const fileBuffer = Buffer.from(arrayBuffer)

      const resolvedName = params?.fileName || fileName || 'download'

      // Convert buffer to base64 string for proper JSON serialization
      // This ensures the file data survives the proxy round-trip
      const base64Data = fileBuffer.toString('base64')

      return {
        success: true,
        output: {
          file: {
            name: resolvedName,
            mimeType,
            data: base64Data,
            size: fileBuffer.length,
          },
        },
      }
    } catch (error: any) {
      logger.error('Error in transform response', {
        error: error.message,
        stack: error.stack,
      })
      throw error
    }
  },

  outputs: {
    file: { type: 'file', description: 'Downloaded file stored in execution files' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/onedrive/index.ts

```typescript
import { createFolderTool } from '@/tools/onedrive/create_folder'
import { deleteTool } from '@/tools/onedrive/delete'
import { downloadTool } from '@/tools/onedrive/download'
import { listTool } from '@/tools/onedrive/list'
import { uploadTool } from '@/tools/onedrive/upload'

export const onedriveCreateFolderTool = createFolderTool
export const onedriveDeleteTool = deleteTool
export const onedriveDownloadTool = downloadTool
export const onedriveListTool = listTool
export const onedriveUploadTool = uploadTool
```

--------------------------------------------------------------------------------

---[FILE: list.ts]---
Location: sim-main/apps/sim/tools/onedrive/list.ts

```typescript
import type {
  MicrosoftGraphDriveItem,
  OneDriveListResponse,
  OneDriveToolParams,
} from '@/tools/onedrive/types'
import type { ToolConfig } from '@/tools/types'

export const listTool: ToolConfig<OneDriveToolParams, OneDriveListResponse> = {
  id: 'onedrive_list',
  name: 'List OneDrive Files',
  description: 'List files and folders in OneDrive',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'onedrive',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the OneDrive API',
    },
    folderSelector: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Select the folder to list files from',
    },
    manualFolderId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The manually entered folder ID (advanced mode)',
    },
    query: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'A query to filter the files',
    },
    pageSize: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'The number of files to return',
    },
  },

  request: {
    url: (params) => {
      // Use specific folder if provided, otherwise use root
      const folderId = params.manualFolderId || params.folderSelector
      const encodedFolderId = folderId ? encodeURIComponent(folderId) : ''
      const baseUrl = encodedFolderId
        ? `https://graph.microsoft.com/v1.0/me/drive/items/${encodedFolderId}/children`
        : 'https://graph.microsoft.com/v1.0/me/drive/root/children'

      const url = new URL(baseUrl)

      // Use Microsoft Graph $select parameter
      url.searchParams.append(
        '$select',
        'id,name,file,folder,webUrl,size,createdDateTime,lastModifiedDateTime,parentReference'
      )

      // Add name filter if query provided
      if (params.query) {
        url.searchParams.append('$filter', `startswith(name,'${params.query}')`)
      }

      // Add pagination
      if (params.pageSize) {
        url.searchParams.append('$top', Number(params.pageSize).toString())
      }

      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        files: data.value.map((item: MicrosoftGraphDriveItem) => ({
          id: item.id,
          name: item.name,
          mimeType: item.file?.mimeType || (item.folder ? 'application/folder' : 'unknown'),
          webViewLink: item.webUrl,
          webContentLink: item['@microsoft.graph.downloadUrl'],
          size: item.size?.toString() || '0',
          createdTime: item.createdDateTime,
          modifiedTime: item.lastModifiedDateTime,
          parents: item.parentReference ? [item.parentReference.id] : [],
        })),
        // Use the actual @odata.nextLink URL as the continuation token
        nextPageToken: data['@odata.nextLink'] || undefined,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether files were listed successfully' },
    files: { type: 'array', description: 'Array of file and folder objects with metadata' },
    nextPageToken: {
      type: 'string',
      description: 'Token for retrieving the next page of results (optional)',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/onedrive/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface MicrosoftGraphDriveItem {
  id: string
  name: string
  file?: {
    mimeType: string
  }
  folder?: {
    childCount: number
  }
  webUrl: string
  createdDateTime: string
  lastModifiedDateTime: string
  size?: number
  '@microsoft.graph.downloadUrl'?: string
  parentReference?: {
    id: string
    driveId: string
    path: string
  }
  thumbnails?: Array<{
    small?: { url: string }
    medium?: { url: string }
    large?: { url: string }
  }>
  createdBy?: {
    user?: {
      displayName?: string
      email?: string
    }
  }
}

export interface OneDriveFile {
  id: string
  name: string
  mimeType: string
  webViewLink?: string
  webContentLink?: string
  size?: string
  createdTime?: string
  modifiedTime?: string
  parents?: string[]
}

export interface OneDriveListResponse extends ToolResponse {
  output: {
    files: OneDriveFile[]
    nextPageToken?: string
  }
}

export interface OneDriveUploadResponse extends ToolResponse {
  output: {
    file: OneDriveFile
    excelWriteResult?: {
      success: boolean
      updatedRange?: string
      updatedRows?: number
      updatedColumns?: number
      updatedCells?: number
      error?: string
      details?: string
    }
  }
}

export interface OneDriveDownloadResponse extends ToolResponse {
  output: {
    file: {
      name: string
      mimeType: string
      data: Buffer | string // Buffer for direct use, string for base64-encoded data
      size: number
    }
  }
}

export interface OneDriveDeleteResponse extends ToolResponse {
  output: {
    fileId: string
    deleted: boolean
  }
}

export interface OneDriveToolParams {
  accessToken: string
  folderSelector?: string
  manualFolderId?: string
  folderName?: string
  fileId?: string
  fileName?: string
  file?: unknown // UserFile or UserFile array
  content?: string
  mimeType?: string
  query?: string
  pageSize?: number
  pageToken?: string
  exportMimeType?: string
  // Optional Excel write parameters (used when creating an .xlsx without file content)
  values?:
    | (string | number | boolean | null)[][]
    | Array<Record<string, string | number | boolean | null>>
}

export type OneDriveResponse =
  | OneDriveUploadResponse
  | OneDriveDownloadResponse
  | OneDriveListResponse
  | OneDriveDeleteResponse
```

--------------------------------------------------------------------------------

---[FILE: upload.ts]---
Location: sim-main/apps/sim/tools/onedrive/upload.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { OneDriveToolParams, OneDriveUploadResponse } from '@/tools/onedrive/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('OneDriveUploadTool')

export const uploadTool: ToolConfig<OneDriveToolParams, OneDriveUploadResponse> = {
  id: 'onedrive_upload',
  name: 'Upload to OneDrive',
  description: 'Upload a file to OneDrive',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'onedrive',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the OneDrive API',
    },
    fileName: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the file to upload',
    },
    file: {
      type: 'file',
      required: false,
      visibility: 'user-only',
      description: 'The file to upload (binary)',
    },
    content: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'The text content to upload (if no file is provided)',
    },
    mimeType: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'The MIME type of the file to create (e.g., text/plain for .txt, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet for .xlsx)',
    },
    folderSelector: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Select the folder to upload the file to',
    },
    manualFolderId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'Manually entered folder ID (advanced mode)',
    },
  },

  request: {
    url: (params) => {
      const isExcelFile =
        params.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      if (params.file || isExcelFile) {
        return '/api/tools/onedrive/upload'
      }

      let fileName = params.fileName || 'untitled'

      if (!fileName.endsWith('.txt')) {
        fileName = `${fileName.replace(/\.[^.]*$/, '')}.txt`
      }

      const parentFolderId = params.manualFolderId || params.folderSelector
      if (parentFolderId && parentFolderId.trim() !== '') {
        return `https://graph.microsoft.com/v1.0/me/drive/items/${encodeURIComponent(parentFolderId)}:/${fileName}:/content`
      }
      return `https://graph.microsoft.com/v1.0/me/drive/root:/${fileName}:/content`
    },
    method: (params) => {
      const isExcelFile =
        params.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      return params.file || isExcelFile ? 'POST' : 'PUT'
    },
    headers: (params) => {
      const headers: Record<string, string> = {}
      const isExcelFile =
        params.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

      if (params.file || isExcelFile) {
        headers['Content-Type'] = 'application/json'
      } else {
        headers.Authorization = `Bearer ${params.accessToken}`
        headers['Content-Type'] = 'text/plain'
      }
      return headers
    },
    body: (params) => {
      const isExcelFile =
        params.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

      if (params.file || isExcelFile) {
        return {
          accessToken: params.accessToken,
          fileName: params.fileName,
          file: params.file,
          folderId: params.manualFolderId || params.folderSelector,
          ...(params.mimeType && { mimeType: params.mimeType }),
          ...(params.values && { values: params.values }),
        }
      }

      return (params.content || '') as unknown as Record<string, unknown>
    },
  },

  transformResponse: async (response: Response, params?: OneDriveToolParams) => {
    const data = await response.json()

    const isExcelFile =
      params?.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

    if ((params?.file || isExcelFile) && data.success !== undefined) {
      if (!data.success) {
        throw new Error(data.error || 'Failed to upload file')
      }

      logger.info('Successfully uploaded file to OneDrive via custom API', {
        fileId: data.output?.file?.id,
        fileName: data.output?.file?.name,
      })

      return {
        success: true,
        output: data.output,
      }
    }

    const fileData = data

    logger.info('Successfully uploaded file to OneDrive', {
      fileId: fileData.id,
      fileName: fileData.name,
    })

    return {
      success: true,
      output: {
        file: {
          id: fileData.id,
          name: fileData.name,
          mimeType: fileData.file?.mimeType || params?.mimeType || 'text/plain',
          webViewLink: fileData.webUrl,
          webContentLink: fileData['@microsoft.graph.downloadUrl'],
          size: fileData.size,
          createdTime: fileData.createdDateTime,
          modifiedTime: fileData.lastModifiedDateTime,
          parentReference: fileData.parentReference,
        },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the file was uploaded successfully' },
    file: {
      type: 'object',
      description:
        'The uploaded file object with metadata including id, name, webViewLink, webContentLink, and timestamps',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/tools/onedrive/utils.ts

```typescript
import type { OneDriveToolParams } from '@/tools/onedrive/types'

export type ExcelCell = string | number | boolean | null
export type ExcelArrayValues = ExcelCell[][]
export type ExcelObjectValues = Array<Record<string, ExcelCell>>
export type NormalizedExcelValues = ExcelArrayValues | ExcelObjectValues

/**
 * Ensures Excel values are always represented as arrays before hitting downstream tooling.
 * Accepts JSON strings, array-of-arrays, or array-of-objects and normalizes them.
 */
export function normalizeExcelValues(values: unknown): NormalizedExcelValues | undefined {
  if (values === null || values === undefined) {
    return undefined
  }

  if (typeof values === 'string') {
    const trimmed = values.trim()
    if (!trimmed) {
      return undefined
    }

    try {
      const parsed = JSON.parse(trimmed)
      if (!Array.isArray(parsed)) {
        throw new Error('Excel values must be an array of rows or array of objects')
      }
      return parsed as NormalizedExcelValues
    } catch (_error) {
      throw new Error('Invalid JSON format for values')
    }
  }

  if (Array.isArray(values)) {
    return values as NormalizedExcelValues
  }

  throw new Error('Excel values must be an array of rows or array of objects')
}

/**
 * Convenience helper for contexts that expect the narrower ToolParams typing.
 */
export function normalizeExcelValuesForToolParams(
  values: unknown
): OneDriveToolParams['values'] | undefined {
  const normalized = normalizeExcelValues(values)
  return normalized as OneDriveToolParams['values'] | undefined
}
```

--------------------------------------------------------------------------------

---[FILE: embeddings.ts]---
Location: sim-main/apps/sim/tools/openai/embeddings.ts

```typescript
import type { OpenAIEmbeddingsParams } from '@/tools/openai/types'
import type { ToolConfig } from '@/tools/types'

export const embeddingsTool: ToolConfig<OpenAIEmbeddingsParams> = {
  id: 'openai_embeddings',
  name: 'OpenAI Embeddings',
  description: "Generate embeddings from text using OpenAI's embedding models",
  version: '1.0',

  params: {
    input: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Text to generate embeddings for',
    },
    model: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Model to use for embeddings',
      default: 'text-embedding-3-small',
    },
    encodingFormat: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The format to return the embeddings in',
      default: 'float',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'OpenAI API key',
    },
  },

  request: {
    method: 'POST',
    url: () => 'https://api.openai.com/v1/embeddings',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      input: params.input,
      model: params.model || 'text-embedding-3-small',
      encoding_format: params.encodingFormat || 'float',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        embeddings: data.data.map((item: any) => item.embedding),
        model: data.model,
        usage: {
          prompt_tokens: data.usage.prompt_tokens,
          total_tokens: data.usage.total_tokens,
        },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Embeddings generation results',
      properties: {
        embeddings: { type: 'array', description: 'Array of embedding vectors' },
        model: { type: 'string', description: 'Model used for generating embeddings' },
        usage: {
          type: 'object',
          description: 'Token usage information',
          properties: {
            prompt_tokens: { type: 'number', description: 'Number of tokens in the prompt' },
            total_tokens: { type: 'number', description: 'Total number of tokens used' },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: image.ts]---
Location: sim-main/apps/sim/tools/openai/image.ts

```typescript
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import type { BaseImageRequestBody } from '@/tools/openai/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('ImageTool')

export const imageTool: ToolConfig = {
  id: 'openai_image',
  name: 'Image Generator',
  description: "Generate images using OpenAI's Image models",
  version: '1.0.0',

  params: {
    model: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The model to use (gpt-image-1 or dall-e-3)',
    },
    prompt: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'A text description of the desired image',
    },
    size: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The size of the generated images (1024x1024, 1024x1792, or 1792x1024)',
    },
    quality: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'The quality of the image (standard or hd)',
    },
    style: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'The style of the image (vivid or natural)',
    },
    background: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'The background color, only for gpt-image-1',
    },
    n: {
      type: 'number',
      required: false,
      visibility: 'hidden',
      description: 'The number of images to generate (1-10)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your OpenAI API key',
    },
  },

  request: {
    url: 'https://api.openai.com/v1/images/generations',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => {
      const body: BaseImageRequestBody = {
        model: params.model,
        prompt: params.prompt,
        size: params.size || '1024x1024',
        n: params.n ? Number(params.n) : 1,
      }

      // Add model-specific parameters
      if (params.model === 'dall-e-3') {
        if (params.quality) body.quality = params.quality
        if (params.style) body.style = params.style
      } else if (params.model === 'gpt-image-1') {
        if (params.background) body.background = params.background
      }

      return body
    },
  },

  transformResponse: async (response, params) => {
    try {
      const data = await response.json()

      const sanitizedData = JSON.parse(JSON.stringify(data))
      if (sanitizedData.data && Array.isArray(sanitizedData.data)) {
        sanitizedData.data.forEach((item: { b64_json?: string }) => {
          if (item.b64_json) {
            item.b64_json = `[base64 data truncated, length: ${item.b64_json.length}]`
          }
        })
      }

      const modelName = params?.model || 'dall-e-3'
      let imageUrl = null
      let base64Image = null

      if (data.data?.[0]?.url) {
        imageUrl = data.data[0].url
        logger.info('Found image URL in response for DALL-E 3')
      } else if (data.data?.[0]?.b64_json) {
        base64Image = data.data[0].b64_json
        logger.info(
          'Found base64 encoded image in response for GPT-Image-1',
          `length: ${base64Image.length}`
        )
      } else {
        logger.error('No image data found in API response:', data)
        throw new Error('No image data found in response')
      }

      if (imageUrl && !base64Image) {
        try {
          logger.info('Fetching image from URL via proxy...')
          const baseUrl = getBaseUrl()
          const proxyUrl = new URL('/api/proxy/image', baseUrl)
          proxyUrl.searchParams.append('url', imageUrl)

          const headers: Record<string, string> = {
            Accept: 'image/*, */*',
          }

          if (typeof window === 'undefined') {
            const { generateInternalToken } = await import('@/lib/auth/internal')
            try {
              const token = await generateInternalToken()
              headers.Authorization = `Bearer ${token}`
              logger.info('Added internal auth token for image proxy request')
            } catch (error) {
              logger.error('Failed to generate internal token for image proxy:', error)
            }
          }

          const imageResponse = await fetch(proxyUrl.toString(), {
            headers,
            cache: 'no-store',
          })

          if (!imageResponse.ok) {
            logger.error('Failed to fetch image:', imageResponse.status, imageResponse.statusText)
            throw new Error(`Failed to fetch image: ${imageResponse.statusText}`)
          }

          const imageBlob = await imageResponse.blob()

          if (imageBlob.size === 0) {
            logger.error('Empty image blob received')
            throw new Error('Empty image received')
          }

          const arrayBuffer = await imageBlob.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          base64Image = buffer.toString('base64')
        } catch (error) {
          logger.error('Error fetching or processing image:', error)

          try {
            logger.info('Attempting fallback with direct browser fetch...')
            const directImageResponse = await fetch(imageUrl, {
              cache: 'no-store',
              headers: {
                Accept: 'image/*, */*',
                'User-Agent': 'Mozilla/5.0 (compatible DalleProxy/1.0)',
              },
            })

            if (!directImageResponse.ok) {
              throw new Error(`Direct fetch failed: ${directImageResponse.status}`)
            }

            const imageBlob = await directImageResponse.blob()
            if (imageBlob.size === 0) {
              throw new Error('Empty blob received from direct fetch')
            }

            const arrayBuffer = await imageBlob.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            base64Image = buffer.toString('base64')

            logger.info(
              'Successfully converted image to base64 via direct fetch, length:',
              base64Image.length
            )
          } catch (fallbackError) {
            logger.error('Fallback fetch also failed:', fallbackError)
          }
        }
      }

      return {
        success: true,
        output: {
          content: imageUrl || 'direct-image',
          image: base64Image || '',
          metadata: {
            model: modelName,
          },
        },
      }
    } catch (error) {
      logger.error('Error in image generation response handling:', error)
      throw error
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Generated image data',
      properties: {
        content: { type: 'string', description: 'Image URL or identifier' },
        image: { type: 'string', description: 'Base64 encoded image data' },
        metadata: {
          type: 'object',
          description: 'Image generation metadata',
          properties: {
            model: { type: 'string', description: 'Model used for image generation' },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/openai/index.ts

```typescript
import { embeddingsTool } from '@/tools/openai/embeddings'
import { imageTool } from '@/tools/openai/image'

export const openAIEmbeddingsTool = embeddingsTool
export const openAIImageTool = imageTool
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/openai/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface BaseImageRequestBody {
  model: string
  prompt: string
  size: string
  n: number
  [key: string]: any // Allow for additional properties
}

export interface DalleResponse extends ToolResponse {
  output: {
    content: string // This will now be the image URL
    image: string // This will be the base64 image data
    metadata: {
      model: string // Only contains model name now
    }
  }
}

export interface OpenAIEmbeddingsParams {
  apiKey: string
  input: string | string[]
  model?: string
  encodingFormat?: 'float' | 'base64'
  user?: string
}
```

--------------------------------------------------------------------------------

````
