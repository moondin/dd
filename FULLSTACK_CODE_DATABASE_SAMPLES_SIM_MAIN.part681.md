---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 681
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 681 of 933)

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
Location: sim-main/apps/sim/tools/google_docs/utils.ts

```typescript
// Helper function to extract text content from Google Docs document structure
export function extractTextFromDocument(document: any): string {
  let text = ''

  if (!document.body || !document.body.content) {
    return text
  }

  // Process each structural element in the document
  for (const element of document.body.content) {
    if (element.paragraph) {
      for (const paragraphElement of element.paragraph.elements) {
        if (paragraphElement.textRun?.content) {
          text += paragraphElement.textRun.content
        }
      }
    } else if (element.table) {
      // Process tables if needed
      for (const tableRow of element.table.tableRows) {
        for (const tableCell of tableRow.tableCells) {
          if (tableCell.content) {
            for (const cellContent of tableCell.content) {
              if (cellContent.paragraph) {
                for (const paragraphElement of cellContent.paragraph.elements) {
                  if (paragraphElement.textRun?.content) {
                    text += paragraphElement.textRun.content
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return text
}
```

--------------------------------------------------------------------------------

---[FILE: write.ts]---
Location: sim-main/apps/sim/tools/google_docs/write.ts

```typescript
import type { GoogleDocsToolParams, GoogleDocsWriteResponse } from '@/tools/google_docs/types'
import type { ToolConfig } from '@/tools/types'

export const writeTool: ToolConfig<GoogleDocsToolParams, GoogleDocsWriteResponse> = {
  id: 'google_docs_write',
  name: 'Write to Google Docs Document',
  description: 'Write or update content in a Google Docs document',
  version: '1.0',
  oauth: {
    required: true,
    provider: 'google-docs',
  },
  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Google Docs API',
    },
    documentId: {
      type: 'string',
      required: true,
      description: 'The ID of the document to write to',
    },
    content: {
      type: 'string',
      required: true,
      description: 'The content to write to the document',
    },
  },
  request: {
    url: (params) => {
      // Ensure documentId is valid
      const documentId = params.documentId?.trim() || params.manualDocumentId?.trim()
      if (!documentId) {
        throw new Error('Document ID is required')
      }

      return `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`
    },
    method: 'POST',
    headers: (params) => {
      // Validate access token
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      // Validate content
      if (!params.content) {
        throw new Error('Content is required')
      }

      // Following the exact format from the Google Docs API examples
      // Always insert at the end of the document to avoid duplication
      // See: https://developers.google.com/docs/api/reference/rest/v1/documents/request#InsertTextRequest
      const requestBody = {
        requests: [
          {
            insertText: {
              endOfSegmentLocation: {},
              text: params.content,
            },
          },
        ],
      }

      return requestBody
    },
  },

  outputs: {
    updatedContent: {
      type: 'boolean',
      description: 'Indicates if document content was updated successfully',
    },
    metadata: {
      type: 'json',
      description: 'Updated document metadata including ID, title, and URL',
    },
  },

  transformResponse: async (response: Response) => {
    const responseText = await response.text()

    // Parse the response if it's not empty
    let _data = {}
    if (responseText.trim()) {
      _data = JSON.parse(responseText)
    }

    // Get the document ID from the URL
    const urlParts = response.url.split('/')
    let documentId = ''
    for (let i = 0; i < urlParts.length; i++) {
      if (urlParts[i] === 'documents' && i + 1 < urlParts.length) {
        documentId = urlParts[i + 1].split(':')[0]
        break
      }
    }

    // Create document metadata
    const metadata = {
      documentId,
      title: 'Updated Document',
      mimeType: 'application/vnd.google-apps.document',
      url: `https://docs.google.com/document/d/${documentId}/edit`,
    }

    return {
      success: true,
      output: {
        updatedContent: true,
        metadata,
      },
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_folder.ts]---
Location: sim-main/apps/sim/tools/google_drive/create_folder.ts

```typescript
import type { GoogleDriveToolParams, GoogleDriveUploadResponse } from '@/tools/google_drive/types'
import type { ToolConfig } from '@/tools/types'

export const createFolderTool: ToolConfig<GoogleDriveToolParams, GoogleDriveUploadResponse> = {
  id: 'google_drive_create_folder',
  name: 'Create Folder in Google Drive',
  description: 'Create a new folder in Google Drive',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-drive',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Google Drive API',
    },
    fileName: {
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
    folderId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'ID of the parent folder (internal use)',
    },
  },

  request: {
    url: 'https://www.googleapis.com/drive/v3/files?supportsAllDrives=true',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const metadata: {
        name: string | undefined
        mimeType: string
        parents?: string[]
      } = {
        name: params.fileName,
        mimeType: 'application/vnd.google-apps.folder',
      }

      // Add parent folder if specified (prefer folderSelector over folderId)
      const parentFolderId = params.folderSelector || params.folderId
      if (parentFolderId) {
        metadata.parents = [parentFolderId]
      }

      return metadata
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.error?.message || 'Failed to create folder in Google Drive')
    }
    const data = await response.json()

    return {
      success: true,
      output: {
        file: {
          id: data.id,
          name: data.name,
          mimeType: data.mimeType,
          webViewLink: data.webViewLink,
          webContentLink: data.webContentLink,
          size: data.size,
          createdTime: data.createdTime,
          modifiedTime: data.modifiedTime,
          parents: data.parents,
        },
      },
    }
  },

  outputs: {
    file: {
      type: 'json',
      description: 'Created folder metadata including ID, name, and parent information',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: download.ts]---
Location: sim-main/apps/sim/tools/google_drive/download.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { GoogleDriveDownloadResponse, GoogleDriveToolParams } from '@/tools/google_drive/types'
import { DEFAULT_EXPORT_FORMATS, GOOGLE_WORKSPACE_MIME_TYPES } from '@/tools/google_drive/utils'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('GoogleDriveDownloadTool')

export const downloadTool: ToolConfig<GoogleDriveToolParams, GoogleDriveDownloadResponse> = {
  id: 'google_drive_download',
  name: 'Download File from Google Drive',
  description: 'Download a file from Google Drive (exports Google Workspace files automatically)',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-drive',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Google Drive API',
    },
    fileId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the file to download',
    },
    mimeType: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The MIME type to export Google Workspace files to (optional)',
    },
    fileName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Optional filename override',
    },
  },

  request: {
    url: (params) =>
      `https://www.googleapis.com/drive/v3/files/${params.fileId}?fields=id,name,mimeType&supportsAllDrives=true`,
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },

  transformResponse: async (response: Response, params?: GoogleDriveToolParams) => {
    try {
      if (!response.ok) {
        const errorDetails = await response.json().catch(() => ({}))
        logger.error('Failed to get file metadata', {
          status: response.status,
          statusText: response.statusText,
          error: errorDetails,
        })
        throw new Error(errorDetails.error?.message || 'Failed to get file metadata')
      }

      const metadata = await response.json()
      const fileId = metadata.id
      const mimeType = metadata.mimeType
      const authHeader = `Bearer ${params?.accessToken || ''}`

      let fileBuffer: Buffer
      let finalMimeType = mimeType

      if (GOOGLE_WORKSPACE_MIME_TYPES.includes(mimeType)) {
        const exportFormat = params?.mimeType || DEFAULT_EXPORT_FORMATS[mimeType] || 'text/plain'
        finalMimeType = exportFormat

        logger.info('Exporting Google Workspace file', {
          fileId,
          mimeType,
          exportFormat,
        })

        const exportResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=${encodeURIComponent(exportFormat)}&supportsAllDrives=true`,
          {
            headers: {
              Authorization: authHeader,
            },
          }
        )

        if (!exportResponse.ok) {
          const exportError = await exportResponse.json().catch(() => ({}))
          logger.error('Failed to export file', {
            status: exportResponse.status,
            statusText: exportResponse.statusText,
            error: exportError,
          })
          throw new Error(exportError.error?.message || 'Failed to export Google Workspace file')
        }

        const arrayBuffer = await exportResponse.arrayBuffer()
        fileBuffer = Buffer.from(arrayBuffer)
      } else {
        logger.info('Downloading regular file', {
          fileId,
          mimeType,
        })

        const downloadResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`,
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
        fileBuffer = Buffer.from(arrayBuffer)
      }

      const resolvedName = params?.fileName || metadata.name || 'download'

      logger.info('File downloaded successfully', {
        fileId,
        name: resolvedName,
        size: fileBuffer.length,
        mimeType: finalMimeType,
      })

      return {
        success: true,
        output: {
          file: {
            name: resolvedName,
            mimeType: finalMimeType,
            data: fileBuffer,
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

---[FILE: get_content.ts]---
Location: sim-main/apps/sim/tools/google_drive/get_content.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  GoogleDriveGetContentResponse,
  GoogleDriveToolParams,
} from '@/tools/google_drive/types'
import { DEFAULT_EXPORT_FORMATS, GOOGLE_WORKSPACE_MIME_TYPES } from '@/tools/google_drive/utils'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('GoogleDriveGetContentTool')

export const getContentTool: ToolConfig<GoogleDriveToolParams, GoogleDriveGetContentResponse> = {
  id: 'google_drive_get_content',
  name: 'Get Content from Google Drive',
  description:
    'Get content from a file in Google Drive (exports Google Workspace files automatically)',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-drive',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Google Drive API',
    },
    fileId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the file to get content from',
    },
    mimeType: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The MIME type to export Google Workspace files to (optional)',
    },
  },

  request: {
    url: (params) =>
      `https://www.googleapis.com/drive/v3/files/${params.fileId}?fields=id,name,mimeType&supportsAllDrives=true`,
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
    }),
  },
  transformResponse: async (response: Response, params?: GoogleDriveToolParams) => {
    try {
      if (!response.ok) {
        const errorDetails = await response.json().catch(() => ({}))
        logger.error('Failed to get file metadata', {
          status: response.status,
          statusText: response.statusText,
          error: errorDetails,
        })
        throw new Error(errorDetails.error?.message || 'Failed to get file metadata')
      }

      const metadata = await response.json()
      const fileId = metadata.id
      const mimeType = metadata.mimeType
      const authHeader = `Bearer ${params?.accessToken || ''}`

      let content: string

      if (GOOGLE_WORKSPACE_MIME_TYPES.includes(mimeType)) {
        const exportFormat = params?.mimeType || DEFAULT_EXPORT_FORMATS[mimeType] || 'text/plain'
        logger.info('Exporting Google Workspace file', {
          fileId,
          mimeType,
          exportFormat,
        })

        const exportResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=${encodeURIComponent(exportFormat)}&supportsAllDrives=true`,
          {
            headers: {
              Authorization: authHeader,
            },
          }
        )

        if (!exportResponse.ok) {
          const exportError = await exportResponse.json().catch(() => ({}))
          logger.error('Failed to export file', {
            status: exportResponse.status,
            statusText: exportResponse.statusText,
            error: exportError,
          })
          throw new Error(exportError.error?.message || 'Failed to export Google Workspace file')
        }

        content = await exportResponse.text()
      } else {
        logger.info('Downloading regular file', {
          fileId,
          mimeType,
        })

        const downloadResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`,
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

        content = await downloadResponse.text()
      }

      const metadataResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,webViewLink,webContentLink,size,createdTime,modifiedTime,parents&supportsAllDrives=true`,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      )

      if (!metadataResponse.ok) {
        logger.warn('Failed to get full metadata, using partial metadata', {
          status: metadataResponse.status,
          statusText: metadataResponse.statusText,
        })
      } else {
        const fullMetadata = await metadataResponse.json()
        Object.assign(metadata, fullMetadata)
      }

      return {
        success: true,
        output: {
          content,
          metadata: {
            id: metadata.id,
            name: metadata.name,
            mimeType: metadata.mimeType,
            webViewLink: metadata.webViewLink,
            webContentLink: metadata.webContentLink,
            size: metadata.size,
            createdTime: metadata.createdTime,
            modifiedTime: metadata.modifiedTime,
            parents: metadata.parents,
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
    content: {
      type: 'string',
      description: 'File content as text (Google Workspace files are exported)',
    },
    metadata: {
      type: 'json',
      description: 'File metadata including ID, name, MIME type, and links',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/google_drive/index.ts

```typescript
import { createFolderTool } from '@/tools/google_drive/create_folder'
import { downloadTool } from '@/tools/google_drive/download'
import { getContentTool } from '@/tools/google_drive/get_content'
import { listTool } from '@/tools/google_drive/list'
import { uploadTool } from '@/tools/google_drive/upload'

export const googleDriveCreateFolderTool = createFolderTool
export const googleDriveDownloadTool = downloadTool
export const googleDriveGetContentTool = getContentTool
export const googleDriveListTool = listTool
export const googleDriveUploadTool = uploadTool
```

--------------------------------------------------------------------------------

---[FILE: list.ts]---
Location: sim-main/apps/sim/tools/google_drive/list.ts

```typescript
import type { GoogleDriveListResponse, GoogleDriveToolParams } from '@/tools/google_drive/types'
import type { ToolConfig } from '@/tools/types'

export const listTool: ToolConfig<GoogleDriveToolParams, GoogleDriveListResponse> = {
  id: 'google_drive_list',
  name: 'List Google Drive Files',
  description: 'List files and folders in Google Drive',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-drive',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Google Drive API',
    },
    folderSelector: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Select the folder to list files from',
    },
    folderId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The ID of the folder to list files from (internal use)',
    },
    query: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Search term to filter files by name (e.g. "budget" finds files with "budget" in the name). Do NOT use Google Drive query syntax here - just provide a plain search term.',
    },
    pageSize: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'The maximum number of files to return (default: 100)',
    },
    pageToken: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The page token to use for pagination',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://www.googleapis.com/drive/v3/files')
      url.searchParams.append(
        'fields',
        'files(id,name,mimeType,webViewLink,webContentLink,size,createdTime,modifiedTime,parents),nextPageToken'
      )
      // Ensure shared drives support - corpora=allDrives is critical for searching across shared drives
      url.searchParams.append('corpora', 'allDrives')
      url.searchParams.append('supportsAllDrives', 'true')
      url.searchParams.append('includeItemsFromAllDrives', 'true')

      // Build the query conditions
      const conditions = ['trashed = false'] // Always exclude trashed files
      const folderId = params.folderId || params.folderSelector
      if (folderId) {
        conditions.push(`'${folderId}' in parents`)
      }

      // Combine all conditions with AND
      url.searchParams.append('q', conditions.join(' and '))

      if (params.query) {
        const existingQ = url.searchParams.get('q')
        const queryPart = `name contains '${params.query}'`
        url.searchParams.set('q', `${existingQ} and ${queryPart}`)
      }
      if (params.pageSize) {
        url.searchParams.append('pageSize', Number(params.pageSize).toString())
      }
      if (params.pageToken) {
        url.searchParams.append('pageToken', params.pageToken)
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

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to list Google Drive files')
    }

    return {
      success: true,
      output: {
        files: data.files.map((file: any) => ({
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
          webViewLink: file.webViewLink,
          webContentLink: file.webContentLink,
          size: file.size,
          createdTime: file.createdTime,
          modifiedTime: file.modifiedTime,
          parents: file.parents,
        })),
        nextPageToken: data.nextPageToken,
      },
    }
  },

  outputs: {
    files: {
      type: 'json',
      description: 'Array of file metadata objects from the specified folder',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/google_drive/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface GoogleDriveFile {
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

export interface GoogleDriveListResponse extends ToolResponse {
  output: {
    files: GoogleDriveFile[]
    nextPageToken?: string
  }
}

export interface GoogleDriveUploadResponse extends ToolResponse {
  output: {
    file: GoogleDriveFile
  }
}

export interface GoogleDriveGetContentResponse extends ToolResponse {
  output: {
    content: string
    metadata: GoogleDriveFile
  }
}

export interface GoogleDriveDownloadResponse extends ToolResponse {
  output: {
    file: {
      name: string
      mimeType: string
      data: Buffer
      size: number
    }
  }
}

export interface GoogleDriveToolParams {
  accessToken: string
  folderId?: string
  folderSelector?: string
  fileId?: string
  fileName?: string
  file?: any // UserFile object
  content?: string
  mimeType?: string
  query?: string
  pageSize?: number
  pageToken?: string
  exportMimeType?: string
}

export type GoogleDriveResponse =
  | GoogleDriveUploadResponse
  | GoogleDriveGetContentResponse
  | GoogleDriveDownloadResponse
  | GoogleDriveListResponse
```

--------------------------------------------------------------------------------

---[FILE: upload.ts]---
Location: sim-main/apps/sim/tools/google_drive/upload.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { GoogleDriveToolParams, GoogleDriveUploadResponse } from '@/tools/google_drive/types'
import {
  GOOGLE_WORKSPACE_MIME_TYPES,
  handleSheetsFormat,
  SOURCE_MIME_TYPES,
} from '@/tools/google_drive/utils'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('GoogleDriveUploadTool')

export const uploadTool: ToolConfig<GoogleDriveToolParams, GoogleDriveUploadResponse> = {
  id: 'google_drive_upload',
  name: 'Upload to Google Drive',
  description: 'Upload a file to Google Drive',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-drive',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Google Drive API',
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
      description: 'Binary file to upload (UserFile object)',
    },
    content: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Text content to upload (use this OR file, not both)',
    },
    mimeType: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The MIME type of the file to upload (auto-detected from file if not provided)',
    },
    folderSelector: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Select the folder to upload the file to',
    },
    folderId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The ID of the folder to upload the file to (internal use)',
    },
  },

  request: {
    url: (params) => {
      // Use custom API route if file is provided, otherwise use Google Drive API directly
      if (params.file) {
        return '/api/tools/google_drive/upload'
      }
      return 'https://www.googleapis.com/drive/v3/files?supportsAllDrives=true'
    },
    method: 'POST',
    headers: (params) => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      // Google Drive API for text-only uploads needs Authorization
      if (!params.file) {
        headers.Authorization = `Bearer ${params.accessToken}`
      }
      return headers
    },
    body: (params) => {
      // Custom route handles file uploads
      if (params.file) {
        return {
          accessToken: params.accessToken,
          fileName: params.fileName,
          file: params.file,
          mimeType: params.mimeType,
          folderId: params.folderSelector || params.folderId,
        }
      }

      // Original text-only upload logic
      const metadata: {
        name: string | undefined
        mimeType: string
        parents?: string[]
      } = {
        name: params.fileName, // Important: Always include the filename in metadata
        mimeType: params.mimeType || 'text/plain',
      }

      // Add parent folder if specified (prefer folderSelector over folderId)
      const parentFolderId = params.folderSelector || params.folderId
      if (parentFolderId && parentFolderId.trim() !== '') {
        metadata.parents = [parentFolderId]
      }

      return metadata
    },
  },

  transformResponse: async (response: Response, params?: GoogleDriveToolParams) => {
    try {
      const data = await response.json()

      // Handle custom API route response (for file uploads)
      if (params?.file && data.success !== undefined) {
        if (!data.success) {
          logger.error('Failed to upload file via custom API route', {
            error: data.error,
          })
          throw new Error(data.error || 'Failed to upload file to Google Drive')
        }
        return {
          success: true,
          output: {
            file: data.output.file,
          },
        }
      }

      // Handle Google Drive API response (for text-only uploads)
      if (!response.ok) {
        logger.error('Failed to create file in Google Drive', {
          status: response.status,
          statusText: response.statusText,
          data,
        })
        throw new Error(data.error?.message || 'Failed to create file in Google Drive')
      }

      const fileId = data.id
      const requestedMimeType = params?.mimeType || 'text/plain'
      const authHeader =
        response.headers.get('Authorization') || `Bearer ${params?.accessToken || ''}`

      let preparedContent: string | undefined =
        typeof params?.content === 'string' ? (params?.content as string) : undefined

      if (requestedMimeType === 'application/vnd.google-apps.spreadsheet' && params?.content) {
        const { csv, rowCount, columnCount } = handleSheetsFormat(params.content as unknown)
        if (csv !== undefined) {
          preparedContent = csv
          logger.info('Prepared CSV content for Google Sheets upload', {
            fileId,
            fileName: params?.fileName,
            rowCount,
            columnCount,
          })
        }
      }

      const uploadMimeType = GOOGLE_WORKSPACE_MIME_TYPES.includes(requestedMimeType)
        ? SOURCE_MIME_TYPES[requestedMimeType] || 'text/plain'
        : requestedMimeType

      logger.info('Uploading content to file', {
        fileId,
        fileName: params?.fileName,
        requestedMimeType,
        uploadMimeType,
      })

      const uploadResponse = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media&supportsAllDrives=true`,
        {
          method: 'PATCH',
          headers: {
            Authorization: authHeader,
            'Content-Type': uploadMimeType,
          },
          body: preparedContent !== undefined ? preparedContent : params?.content || '',
        }
      )

      if (!uploadResponse.ok) {
        const uploadError = await uploadResponse.json()
        logger.error('Failed to upload content to file', {
          status: uploadResponse.status,
          statusText: uploadResponse.statusText,
          error: uploadError,
        })
        throw new Error(uploadError.error?.message || 'Failed to upload content to file')
      }

      if (GOOGLE_WORKSPACE_MIME_TYPES.includes(requestedMimeType)) {
        logger.info('Updating file name to ensure it persists after conversion', {
          fileId,
          fileName: params?.fileName,
        })

        const updateNameResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files/${fileId}?supportsAllDrives=true`,
          {
            method: 'PATCH',
            headers: {
              Authorization: authHeader,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: params?.fileName,
            }),
          }
        )

        if (!updateNameResponse.ok) {
          logger.warn('Failed to update filename after conversion, but content was uploaded', {
            status: updateNameResponse.status,
            statusText: updateNameResponse.statusText,
          })
        }
      }

      const finalFileResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?supportsAllDrives=true&fields=id,name,mimeType,webViewLink,webContentLink,size,createdTime,modifiedTime,parents`,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      )

      const finalFile = await finalFileResponse.json()

      return {
        success: true,
        output: {
          file: {
            id: finalFile.id,
            name: finalFile.name,
            mimeType: finalFile.mimeType,
            webViewLink: finalFile.webViewLink,
            webContentLink: finalFile.webContentLink,
            size: finalFile.size,
            createdTime: finalFile.createdTime,
            modifiedTime: finalFile.modifiedTime,
            parents: finalFile.parents,
          },
        },
      }
    } catch (error: any) {
      logger.error('Error in upload transformation', {
        error: error.message,
        stack: error.stack,
      })
      throw error
    }
  },

  outputs: {
    file: { type: 'json', description: 'Uploaded file metadata including ID, name, and links' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/tools/google_drive/utils.ts

```typescript
export const GOOGLE_WORKSPACE_MIME_TYPES = [
  'application/vnd.google-apps.document', // Google Docs
  'application/vnd.google-apps.spreadsheet', // Google Sheets
  'application/vnd.google-apps.presentation', // Google Slides
  'application/vnd.google-apps.drawing', // Google Drawings
  'application/vnd.google-apps.form', // Google Forms
  'application/vnd.google-apps.script', // Google Apps Scripts
]

export const DEFAULT_EXPORT_FORMATS: Record<string, string> = {
  'application/vnd.google-apps.document': 'text/plain',
  'application/vnd.google-apps.spreadsheet': 'text/csv',
  'application/vnd.google-apps.presentation': 'text/plain',
  'application/vnd.google-apps.drawing': 'image/png',
  'application/vnd.google-apps.form': 'application/pdf',
  'application/vnd.google-apps.script': 'application/json',
}

export const SOURCE_MIME_TYPES: Record<string, string> = {
  'application/vnd.google-apps.document': 'text/plain',
  'application/vnd.google-apps.spreadsheet': 'text/csv',
  'application/vnd.google-apps.presentation': 'application/vnd.ms-powerpoint',
}

export function handleSheetsFormat(input: unknown): {
  csv?: string
  rowCount: number
  columnCount: number
} {
  let workingValue: unknown = input

  if (typeof workingValue === 'string') {
    try {
      workingValue = JSON.parse(workingValue)
    } catch (_error) {
      const csvString = workingValue as string
      return { csv: csvString, rowCount: 0, columnCount: 0 }
    }
  }

  if (!Array.isArray(workingValue)) {
    return { rowCount: 0, columnCount: 0 }
  }

  let table: unknown[] = workingValue

  if (
    table.length > 0 &&
    typeof (table as any)[0] === 'object' &&
    (table as any)[0] !== null &&
    !Array.isArray((table as any)[0])
  ) {
    const allKeys = new Set<string>()
    ;(table as any[]).forEach((obj) => {
      if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach((key) => allKeys.add(key))
      }
    })
    const headers = Array.from(allKeys)
    const rows = (table as any[]).map((obj) => {
      if (!obj || typeof obj !== 'object') {
        return Array(headers.length).fill('')
      }
      return headers.map((key) => {
        const value = (obj as Record<string, unknown>)[key]
        if (value !== null && typeof value === 'object') {
          return JSON.stringify(value)
        }
        return value === undefined ? '' : (value as any)
      })
    })
    table = [headers, ...rows]
  }

  const escapeCell = (cell: unknown): string => {
    if (cell === null || cell === undefined) return ''
    const stringValue = String(cell)
    const mustQuote = /[",\n\r]/.test(stringValue)
    const doubledQuotes = stringValue.replace(/"/g, '""')
    return mustQuote ? `"${doubledQuotes}"` : doubledQuotes
  }

  const rowsAsStrings = (table as unknown[]).map((row) => {
    if (!Array.isArray(row)) {
      return escapeCell(row)
    }
    return row.map((cell) => escapeCell(cell)).join(',')
  })

  const csv = rowsAsStrings.join('\r\n')
  const rowCount = Array.isArray(table) ? (table as any[]).length : 0
  const columnCount =
    Array.isArray(table) && Array.isArray((table as any[])[0]) ? (table as any[])[0].length : 0

  return { csv, rowCount, columnCount }
}
```

--------------------------------------------------------------------------------

````
