---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 475
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 475 of 933)

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

---[FILE: notion.ts]---
Location: sim-main/apps/sim/blocks/blocks/notion.ts

```typescript
import { NotionIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { NotionResponse } from '@/tools/notion/types'

export const NotionBlock: BlockConfig<NotionResponse> = {
  type: 'notion',
  name: 'Notion',
  description: 'Manage Notion pages',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrate with Notion into the workflow. Can read page, read database, create page, create database, append content, query database, and search workspace.',
  docsLink: 'https://docs.sim.ai/tools/notion',
  category: 'tools',
  bgColor: '#181C1E',
  icon: NotionIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Read Page', id: 'notion_read' },
        { label: 'Read Database', id: 'notion_read_database' },
        { label: 'Create Page', id: 'notion_create_page' },
        { label: 'Create Database', id: 'notion_create_database' },
        { label: 'Append Content', id: 'notion_write' },
        { label: 'Query Database', id: 'notion_query_database' },
        { label: 'Search Workspace', id: 'notion_search' },
      ],
      value: () => 'notion_read',
    },
    {
      id: 'credential',
      title: 'Notion Account',
      type: 'oauth-input',
      serviceId: 'notion',
      requiredScopes: ['workspace.content', 'workspace.name', 'page.read', 'page.write'],
      placeholder: 'Select Notion account',
      required: true,
    },
    // Read/Write operation - Page ID
    {
      id: 'pageId',
      title: 'Page ID',
      type: 'short-input',
      placeholder: 'Enter Notion page ID',
      condition: {
        field: 'operation',
        value: 'notion_read',
      },
      required: true,
    },
    {
      id: 'databaseId',
      title: 'Database ID',
      type: 'short-input',
      placeholder: 'Enter Notion database ID',
      condition: {
        field: 'operation',
        value: 'notion_read_database',
      },
      required: true,
    },
    {
      id: 'pageId',
      title: 'Page ID',
      type: 'short-input',
      placeholder: 'Enter Notion page ID',
      condition: {
        field: 'operation',
        value: 'notion_write',
      },
      required: true,
    },
    // Create operation fields
    {
      id: 'parentId',
      title: 'Parent Page ID',
      type: 'short-input',
      placeholder: 'ID of parent page',
      condition: { field: 'operation', value: 'notion_create_page' },
      required: true,
    },
    {
      id: 'title',
      title: 'Page Title',
      type: 'short-input',
      placeholder: 'Title for the new page',
      condition: {
        field: 'operation',
        value: 'notion_create_page',
      },
    },
    // Content input for write/create operations
    {
      id: 'content',
      title: 'Content',
      type: 'long-input',
      placeholder: 'Enter content to add to the page',
      condition: {
        field: 'operation',
        value: 'notion_write',
      },
      required: true,
    },
    {
      id: 'content',
      title: 'Content',
      type: 'long-input',
      placeholder: 'Enter content to add to the page',
      condition: {
        field: 'operation',
        value: 'notion_create_page',
      },
      required: true,
    },
    // Query Database Fields
    {
      id: 'databaseId',
      title: 'Database ID',
      type: 'short-input',
      placeholder: 'Enter Notion database ID',
      condition: { field: 'operation', value: 'notion_query_database' },
      required: true,
    },
    {
      id: 'filter',
      title: 'Filter (JSON)',
      type: 'long-input',
      placeholder: 'Enter filter conditions as JSON (optional)',
      condition: { field: 'operation', value: 'notion_query_database' },
      required: true,
    },
    {
      id: 'sorts',
      title: 'Sort Criteria (JSON)',
      type: 'long-input',
      placeholder: 'Enter sort criteria as JSON array (optional)',
      condition: { field: 'operation', value: 'notion_query_database' },
    },
    {
      id: 'pageSize',
      title: 'Page Size',
      type: 'short-input',
      placeholder: 'Number of results (default: 100, max: 100)',
      condition: { field: 'operation', value: 'notion_query_database' },
    },
    // Search Fields
    {
      id: 'query',
      title: 'Search Query',
      type: 'short-input',
      placeholder: 'Enter search terms (leave empty for all pages)',
      condition: { field: 'operation', value: 'notion_search' },
    },
    {
      id: 'filterType',
      title: 'Filter Type',
      type: 'dropdown',
      options: [
        { label: 'All', id: 'all' },
        { label: 'Pages Only', id: 'page' },
        { label: 'Databases Only', id: 'database' },
      ],
      condition: { field: 'operation', value: 'notion_search' },
    },
    // Create Database Fields
    {
      id: 'parentId',
      title: 'Parent Page ID',
      type: 'short-input',
      placeholder: 'ID of parent page where database will be created',
      condition: { field: 'operation', value: 'notion_create_database' },
      required: true,
    },
    {
      id: 'title',
      title: 'Database Title',
      type: 'short-input',
      placeholder: 'Title for the new database',
      condition: { field: 'operation', value: 'notion_create_database' },
      required: true,
    },
    {
      id: 'properties',
      title: 'Database Properties (JSON)',
      type: 'long-input',
      placeholder: 'Enter database properties as JSON object',
      condition: { field: 'operation', value: 'notion_create_database' },
    },
  ],
  tools: {
    access: [
      'notion_read',
      'notion_read_database',
      'notion_write',
      'notion_create_page',
      'notion_query_database',
      'notion_search',
      'notion_create_database',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'notion_read':
            return 'notion_read'
          case 'notion_read_database':
            return 'notion_read_database'
          case 'notion_write':
            return 'notion_write'
          case 'notion_create_page':
            return 'notion_create_page'
          case 'notion_query_database':
            return 'notion_query_database'
          case 'notion_search':
            return 'notion_search'
          case 'notion_create_database':
            return 'notion_create_database'
          default:
            return 'notion_read'
        }
      },
      params: (params) => {
        const { credential, operation, properties, filter, sorts, ...rest } = params

        // Parse properties from JSON string for create operations
        let parsedProperties
        if (
          (operation === 'notion_create_page' || operation === 'notion_create_database') &&
          properties
        ) {
          try {
            parsedProperties = JSON.parse(properties)
          } catch (error) {
            throw new Error(
              `Invalid JSON for properties: ${error instanceof Error ? error.message : String(error)}`
            )
          }
        }

        // Parse filter for query database operations
        let parsedFilter
        if (operation === 'notion_query_database' && filter) {
          try {
            parsedFilter = JSON.parse(filter)
          } catch (error) {
            throw new Error(
              `Invalid JSON for filter: ${error instanceof Error ? error.message : String(error)}`
            )
          }
        }

        // Parse sorts for query database operations
        let parsedSorts
        if (operation === 'notion_query_database' && sorts) {
          try {
            parsedSorts = JSON.parse(sorts)
          } catch (error) {
            throw new Error(
              `Invalid JSON for sorts: ${error instanceof Error ? error.message : String(error)}`
            )
          }
        }

        return {
          ...rest,
          credential,
          ...(parsedProperties ? { properties: parsedProperties } : {}),
          ...(parsedFilter ? { filter: JSON.stringify(parsedFilter) } : {}),
          ...(parsedSorts ? { sorts: JSON.stringify(parsedSorts) } : {}),
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'Notion access token' },
    pageId: { type: 'string', description: 'Page identifier' },
    content: { type: 'string', description: 'Page content' },
    // Create page inputs
    parentId: { type: 'string', description: 'Parent page identifier' },
    title: { type: 'string', description: 'Page title' },
    // Query database inputs
    databaseId: { type: 'string', description: 'Database identifier' },
    filter: { type: 'string', description: 'Filter criteria' },
    sorts: { type: 'string', description: 'Sort criteria' },
    pageSize: { type: 'number', description: 'Page size limit' },
    // Search inputs
    query: { type: 'string', description: 'Search query' },
    filterType: { type: 'string', description: 'Filter type' },
  },
  outputs: {
    // Common outputs across all Notion operations
    content: {
      type: 'string',
      description: 'Page content, search results, or confirmation messages',
    },

    // Metadata object containing operation-specific information
    metadata: {
      type: 'json',
      description:
        'Metadata containing operation-specific details including page/database info, results, and pagination data',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: onedrive.ts]---
Location: sim-main/apps/sim/blocks/blocks/onedrive.ts

```typescript
import { MicrosoftOneDriveIcon } from '@/components/icons'
import { createLogger } from '@/lib/logs/console/logger'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { OneDriveResponse } from '@/tools/onedrive/types'
import { normalizeExcelValuesForToolParams } from '@/tools/onedrive/utils'

const logger = createLogger('OneDriveBlock')

export const OneDriveBlock: BlockConfig<OneDriveResponse> = {
  type: 'onedrive',
  name: 'OneDrive',
  description: 'Create, upload, download, list, and delete files',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrate OneDrive into the workflow. Can create text and Excel files, upload files, download files, list files, and delete files or folders.',
  docsLink: 'https://docs.sim.ai/tools/onedrive',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: MicrosoftOneDriveIcon,
  subBlocks: [
    // Operation selector
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Create Folder', id: 'create_folder' },
        { label: 'Create File', id: 'create_file' },
        { label: 'Upload File', id: 'upload' },
        { label: 'Download File', id: 'download' },
        { label: 'List Files', id: 'list' },
        { label: 'Delete File', id: 'delete' },
      ],
    },
    // One Drive Credentials
    {
      id: 'credential',
      title: 'Microsoft Account',
      type: 'oauth-input',
      serviceId: 'onedrive',
      requiredScopes: [
        'openid',
        'profile',
        'email',
        'Files.Read',
        'Files.ReadWrite',
        'offline_access',
      ],
      placeholder: 'Select Microsoft account',
    },
    // Create File Fields
    {
      id: 'fileName',
      title: 'File Name',
      type: 'short-input',
      placeholder: 'Name of the file',
      condition: { field: 'operation', value: ['create_file', 'upload'] },
      required: true,
    },
    // File Type selector for create_file operation
    {
      id: 'mimeType',
      title: 'File Type',
      type: 'dropdown',
      options: [
        { label: 'Text File (.txt)', id: 'text/plain' },
        {
          label: 'Excel File (.xlsx)',
          id: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      ],
      placeholder: 'Select file type',
      condition: { field: 'operation', value: 'create_file' },
      required: true,
    },
    // Excel values input when creating an .xlsx file
    {
      id: 'values',
      title: 'Values',
      type: 'code',
      language: 'json',
      generationType: 'json-object',
      placeholder: 'Enter a JSON array of rows (e.g., [["A1","B1"],["A2","B2"]])',
      condition: {
        field: 'operation',
        value: 'create_file',
        and: {
          field: 'mimeType',
          value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      },
      wandConfig: {
        enabled: true,
        prompt:
          'Generate a JSON array of arrays that can be written directly into an Excel worksheet.',
        placeholder: 'Describe the table you want to generate...',
        generationType: 'json-object',
      },
      required: false,
    },
    // File upload (basic mode)
    {
      id: 'file',
      title: 'File',
      type: 'file-upload',
      canonicalParamId: 'file',
      placeholder: 'Upload a file',
      condition: { field: 'operation', value: 'upload' },
      mode: 'basic',
      multiple: false,
      required: false,
    },
    // Variable reference (advanced mode)
    {
      id: 'fileReference',
      title: 'File',
      type: 'short-input',
      canonicalParamId: 'file',
      placeholder: 'Reference file from previous block (e.g., {{block_1.file}})',
      condition: { field: 'operation', value: 'upload' },
      mode: 'advanced',
      required: false,
    },
    {
      id: 'content',
      title: 'Text Content',
      type: 'long-input',
      placeholder: 'Text content for the file',
      condition: {
        field: 'operation',
        value: 'create_file',
        and: {
          field: 'mimeType',
          value: 'text/plain',
        },
      },
      required: true,
    },

    {
      id: 'folderSelector',
      title: 'Select Parent Folder',
      type: 'file-selector',
      canonicalParamId: 'folderId',
      serviceId: 'onedrive',
      requiredScopes: [
        'openid',
        'profile',
        'email',
        'Files.Read',
        'Files.ReadWrite',
        'offline_access',
      ],
      mimeType: 'application/vnd.microsoft.graph.folder',
      placeholder: 'Select a parent folder',
      dependsOn: ['credential'],
      mode: 'basic',
      condition: { field: 'operation', value: ['create_file', 'upload'] },
    },
    {
      id: 'manualFolderId',
      title: 'Parent Folder ID',
      type: 'short-input',
      canonicalParamId: 'folderId',
      placeholder: 'Enter parent folder ID (leave empty for root folder)',
      dependsOn: ['credential'],
      mode: 'advanced',
      condition: { field: 'operation', value: ['create_file', 'upload'] },
    },
    {
      id: 'folderName',
      title: 'Folder Name',
      type: 'short-input',
      placeholder: 'Name for the new folder',
      condition: { field: 'operation', value: 'create_folder' },
    },
    {
      id: 'folderSelector',
      title: 'Select Parent Folder',
      type: 'file-selector',
      canonicalParamId: 'folderId',
      serviceId: 'onedrive',
      requiredScopes: [
        'openid',
        'profile',
        'email',
        'Files.Read',
        'Files.ReadWrite',
        'offline_access',
      ],
      mimeType: 'application/vnd.microsoft.graph.folder',
      placeholder: 'Select a parent folder',
      dependsOn: ['credential'],
      mode: 'basic',
      condition: { field: 'operation', value: 'create_folder' },
    },
    // Manual Folder ID input (advanced mode)
    {
      id: 'manualFolderId',
      title: 'Parent Folder ID',
      type: 'short-input',
      canonicalParamId: 'folderId',
      placeholder: 'Enter parent folder ID (leave empty for root folder)',
      dependsOn: ['credential'],
      mode: 'advanced',
      condition: { field: 'operation', value: 'create_folder' },
    },
    // List Fields - Folder Selector (basic mode)
    {
      id: 'folderSelector',
      title: 'Select Folder',
      type: 'file-selector',
      canonicalParamId: 'folderId',
      serviceId: 'onedrive',
      requiredScopes: [
        'openid',
        'profile',
        'email',
        'Files.Read',
        'Files.ReadWrite',
        'offline_access',
      ],
      mimeType: 'application/vnd.microsoft.graph.folder',
      placeholder: 'Select a folder to list files from',
      dependsOn: ['credential'],
      mode: 'basic',
      condition: { field: 'operation', value: 'list' },
    },
    // Manual Folder ID input (advanced mode)
    {
      id: 'manualFolderId',
      title: 'Folder ID',
      type: 'short-input',
      canonicalParamId: 'folderId',
      placeholder: 'Enter folder ID (leave empty for root folder)',
      dependsOn: ['credential'],
      mode: 'advanced',
      condition: { field: 'operation', value: 'list' },
    },
    {
      id: 'query',
      title: 'Search Query',
      type: 'short-input',
      placeholder: 'Search for specific files (e.g., name contains "report")',
      condition: { field: 'operation', value: 'list' },
    },
    {
      id: 'pageSize',
      title: 'Results Per Page',
      type: 'short-input',
      placeholder: 'Number of results (default: 100, max: 1000)',
      condition: { field: 'operation', value: 'list' },
    },
    // Download File Fields - File Selector (basic mode)
    {
      id: 'fileSelector',
      title: 'Select File',
      type: 'file-selector',
      canonicalParamId: 'fileId',
      serviceId: 'onedrive',
      requiredScopes: [
        'openid',
        'profile',
        'email',
        'Files.Read',
        'Files.ReadWrite',
        'offline_access',
      ],
      mimeType: 'file', // Exclude folders, show only files
      placeholder: 'Select a file to download',
      mode: 'basic',
      dependsOn: ['credential'],
      condition: { field: 'operation', value: 'download' },
    },
    // Manual File ID input (advanced mode)
    {
      id: 'manualFileId',
      title: 'File ID',
      type: 'short-input',
      canonicalParamId: 'fileId',
      placeholder: 'Enter file ID',
      mode: 'advanced',
      condition: { field: 'operation', value: 'download' },
      required: true,
    },
    {
      id: 'downloadFileName',
      title: 'File Name Override',
      type: 'short-input',
      placeholder: 'Optional: Override the filename',
      condition: { field: 'operation', value: 'download' },
    },
    // Delete File Fields - File Selector (basic mode)
    {
      id: 'fileSelector',
      title: 'Select File to Delete',
      type: 'file-selector',
      canonicalParamId: 'fileId',
      serviceId: 'onedrive',
      requiredScopes: [
        'openid',
        'profile',
        'email',
        'Files.Read',
        'Files.ReadWrite',
        'offline_access',
      ],
      mimeType: 'file', // Exclude folders, show only files
      placeholder: 'Select a file to delete',
      mode: 'basic',
      dependsOn: ['credential'],
      condition: { field: 'operation', value: 'delete' },
      required: true,
    },
    // Manual File ID input (advanced mode)
    {
      id: 'manualFileId',
      title: 'File ID',
      type: 'short-input',
      canonicalParamId: 'fileId',
      placeholder: 'Enter file or folder ID to delete',
      mode: 'advanced',
      condition: { field: 'operation', value: 'delete' },
      required: true,
    },
  ],
  tools: {
    access: [
      'onedrive_upload',
      'onedrive_create_folder',
      'onedrive_download',
      'onedrive_list',
      'onedrive_delete',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'create_file':
          case 'upload':
            return 'onedrive_upload'
          case 'create_folder':
            return 'onedrive_create_folder'
          case 'download':
            return 'onedrive_download'
          case 'list':
            return 'onedrive_list'
          case 'delete':
            return 'onedrive_delete'
          default:
            throw new Error(`Invalid OneDrive operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const { credential, folderId, fileId, mimeType, values, downloadFileName, ...rest } = params

        let normalizedValues: ReturnType<typeof normalizeExcelValuesForToolParams>
        if (values !== undefined) {
          normalizedValues = normalizeExcelValuesForToolParams(values)
        }

        return {
          credential,
          ...rest,
          values: normalizedValues,
          folderId: folderId || undefined,
          fileId: fileId || undefined,
          pageSize: rest.pageSize ? Number.parseInt(rest.pageSize as string, 10) : undefined,
          mimeType: mimeType,
          ...(downloadFileName && { fileName: downloadFileName }),
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'Microsoft account credential' },
    // Upload and Create Folder operation inputs
    fileName: { type: 'string', description: 'File name' },
    file: { type: 'json', description: 'File to upload (UserFile object)' },
    fileReference: { type: 'json', description: 'File reference from previous block' },
    content: { type: 'string', description: 'Text content to upload' },
    mimeType: { type: 'string', description: 'MIME type of file to create' },
    values: { type: 'json', description: 'Cell values for new Excel as JSON' },
    fileId: { type: 'string', description: 'File ID to download' },
    downloadFileName: { type: 'string', description: 'File name override for download' },
    folderId: { type: 'string', description: 'Folder ID' },
    query: { type: 'string', description: 'Search query' },
    pageSize: { type: 'number', description: 'Results per page' },
  },
  outputs: {
    success: { type: 'boolean', description: 'Whether the operation was successful' },
    deleted: { type: 'boolean', description: 'Whether the file was deleted' },
    fileId: { type: 'string', description: 'The ID of the deleted file' },
    file: {
      type: 'json',
      description: 'The OneDrive file object, including details such as id, name, size, and more.',
    },
    files: {
      type: 'json',
      description:
        'An array of OneDrive file objects, each containing details such as id, name, size, and more.',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: openai.ts]---
Location: sim-main/apps/sim/blocks/blocks/openai.ts

```typescript
import { OpenAIIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'

export const OpenAIBlock: BlockConfig = {
  type: 'openai',
  name: 'Embeddings',
  description: 'Generate Open AI embeddings',
  authMode: AuthMode.ApiKey,
  longDescription: 'Integrate Embeddings into the workflow. Can generate embeddings from text.',
  category: 'tools',
  docsLink: 'https://docs.sim.ai/tools/openai',
  bgColor: '#10a37f',
  icon: OpenAIIcon,
  subBlocks: [
    {
      id: 'input',
      title: 'Input Text',
      type: 'long-input',
      placeholder: 'Enter text to generate embeddings for',
      required: true,
    },
    {
      id: 'model',
      title: 'Model',
      type: 'dropdown',
      options: [
        { label: 'text-embedding-3-small', id: 'text-embedding-3-small' },
        { label: 'text-embedding-3-large', id: 'text-embedding-3-large' },
        { label: 'text-embedding-ada-002', id: 'text-embedding-ada-002' },
      ],
      value: () => 'text-embedding-3-small',
    },
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter your OpenAI API key',
      password: true,
      required: true,
    },
  ],
  tools: {
    access: ['openai_embeddings'],
  },
  inputs: {
    input: { type: 'string', description: 'Text to embed' },
    model: { type: 'string', description: 'Embedding model' },
    apiKey: { type: 'string', description: 'OpenAI API key' },
  },
  outputs: {
    embeddings: { type: 'json', description: 'Generated embeddings' },
    model: { type: 'string', description: 'Model used' },
    usage: { type: 'json', description: 'Token usage' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: outlook.ts]---
Location: sim-main/apps/sim/blocks/blocks/outlook.ts

```typescript
import { OutlookIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { OutlookResponse } from '@/tools/outlook/types'
import { getTrigger } from '@/triggers'

export const OutlookBlock: BlockConfig<OutlookResponse> = {
  type: 'outlook',
  name: 'Outlook',
  description: 'Send, read, draft, forward, and move Outlook email messages',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrate Outlook into the workflow. Can read, draft, send, forward, and move email messages. Can be used in trigger mode to trigger a workflow when a new email is received.',
  docsLink: 'https://docs.sim.ai/tools/outlook',
  category: 'tools',
  triggerAllowed: true,
  bgColor: '#E0E0E0',
  icon: OutlookIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Send Email', id: 'send_outlook' },
        { label: 'Draft Email', id: 'draft_outlook' },
        { label: 'Read Email', id: 'read_outlook' },
        { label: 'Forward Email', id: 'forward_outlook' },
        { label: 'Move Email', id: 'move_outlook' },
        { label: 'Mark as Read', id: 'mark_read_outlook' },
        { label: 'Mark as Unread', id: 'mark_unread_outlook' },
        { label: 'Delete Email', id: 'delete_outlook' },
        { label: 'Copy Email', id: 'copy_outlook' },
      ],
      value: () => 'send_outlook',
    },
    {
      id: 'credential',
      title: 'Microsoft Account',
      type: 'oauth-input',
      serviceId: 'outlook',
      requiredScopes: [
        'Mail.ReadWrite',
        'Mail.ReadBasic',
        'Mail.Read',
        'Mail.Send',
        'offline_access',
        'openid',
        'profile',
        'email',
      ],
      placeholder: 'Select Microsoft account',
      required: true,
    },
    {
      id: 'to',
      title: 'To',
      type: 'short-input',
      placeholder: 'Recipient email address',
      condition: {
        field: 'operation',
        value: ['send_outlook', 'draft_outlook', 'forward_outlook'],
      },
      required: true,
    },
    {
      id: 'messageId',
      title: 'Message ID',
      type: 'short-input',
      placeholder: 'Message ID to forward',
      condition: { field: 'operation', value: ['forward_outlook'] },
      required: true,
    },
    {
      id: 'comment',
      title: 'Comment',
      type: 'long-input',
      placeholder: 'Optional comment to include when forwarding',
      condition: { field: 'operation', value: ['forward_outlook'] },
      required: false,
    },
    {
      id: 'subject',
      title: 'Subject',
      type: 'short-input',
      placeholder: 'Email subject',
      condition: { field: 'operation', value: ['send_outlook', 'draft_outlook'] },
      required: true,
    },
    {
      id: 'body',
      title: 'Body',
      type: 'long-input',
      placeholder: 'Email content',
      condition: { field: 'operation', value: ['send_outlook', 'draft_outlook'] },
      required: true,
    },
    {
      id: 'contentType',
      title: 'Content Type',
      type: 'dropdown',
      options: [
        { label: 'Plain Text', id: 'text' },
        { label: 'HTML', id: 'html' },
      ],
      condition: { field: 'operation', value: ['send_outlook', 'draft_outlook'] },
      value: () => 'text',
      required: false,
    },
    // File upload (basic mode)
    {
      id: 'attachmentFiles',
      title: 'Attachments',
      type: 'file-upload',
      canonicalParamId: 'attachments',
      placeholder: 'Upload files to attach',
      condition: { field: 'operation', value: ['send_outlook', 'draft_outlook'] },
      mode: 'basic',
      multiple: true,
      required: false,
    },
    // Variable reference (advanced mode)
    {
      id: 'attachments',
      title: 'Attachments',
      type: 'short-input',
      canonicalParamId: 'attachments',
      placeholder: 'Reference files from previous blocks',
      condition: { field: 'operation', value: ['send_outlook', 'draft_outlook'] },
      mode: 'advanced',
      required: false,
    },
    // Advanced Settings - Threading
    {
      id: 'replyToMessageId',
      title: 'Reply to Message ID',
      type: 'short-input',
      placeholder: 'Message ID to reply to (for threading)',
      condition: { field: 'operation', value: ['send_outlook'] },
      mode: 'advanced',
      required: false,
    },
    {
      id: 'conversationId',
      title: 'Conversation ID',
      type: 'short-input',
      placeholder: 'Conversation ID for threading',
      condition: { field: 'operation', value: ['send_outlook'] },
      mode: 'advanced',
      required: false,
    },
    // Advanced Settings - Additional Recipients
    {
      id: 'cc',
      title: 'CC',
      type: 'short-input',
      placeholder: 'CC recipients (comma-separated)',
      condition: { field: 'operation', value: ['send_outlook', 'draft_outlook'] },
      mode: 'advanced',
      required: false,
    },
    {
      id: 'bcc',
      title: 'BCC',
      type: 'short-input',
      placeholder: 'BCC recipients (comma-separated)',
      condition: { field: 'operation', value: ['send_outlook', 'draft_outlook'] },
      mode: 'advanced',
      required: false,
    },
    // Read Email Fields - Add folder selector (basic mode)
    {
      id: 'folder',
      title: 'Folder',
      type: 'folder-selector',
      canonicalParamId: 'folder',
      serviceId: 'outlook',
      requiredScopes: ['Mail.ReadWrite', 'Mail.ReadBasic', 'Mail.Read'],
      placeholder: 'Select Outlook folder',
      dependsOn: ['credential'],
      mode: 'basic',
      condition: { field: 'operation', value: 'read_outlook' },
    },
    // Manual folder input (advanced mode)
    {
      id: 'manualFolder',
      title: 'Folder',
      type: 'short-input',
      canonicalParamId: 'folder',
      placeholder: 'Enter Outlook folder name (e.g., INBOX, SENT, or custom folder)',
      mode: 'advanced',
      condition: { field: 'operation', value: 'read_outlook' },
    },
    {
      id: 'maxResults',
      title: 'Number of Emails',
      type: 'short-input',
      placeholder: 'Number of emails to retrieve (default: 1, max: 10)',
      condition: { field: 'operation', value: 'read_outlook' },
    },
    {
      id: 'includeAttachments',
      title: 'Include Attachments',
      type: 'switch',
      condition: { field: 'operation', value: 'read_outlook' },
    },
    // Move Email Fields
    {
      id: 'moveMessageId',
      title: 'Message ID',
      type: 'short-input',
      placeholder: 'ID of the email to move',
      condition: { field: 'operation', value: 'move_outlook' },
      required: true,
    },
    // Destination folder selector (basic mode)
    {
      id: 'destinationFolder',
      title: 'Move To Folder',
      type: 'folder-selector',
      canonicalParamId: 'destinationId',
      serviceId: 'outlook',
      requiredScopes: ['Mail.ReadWrite', 'Mail.ReadBasic', 'Mail.Read'],
      placeholder: 'Select destination folder',
      dependsOn: ['credential'],
      mode: 'basic',
      condition: { field: 'operation', value: 'move_outlook' },
      required: true,
    },
    // Manual destination folder input (advanced mode)
    {
      id: 'manualDestinationFolder',
      title: 'Move To Folder',
      type: 'short-input',
      canonicalParamId: 'destinationId',
      placeholder: 'Enter folder ID',
      mode: 'advanced',
      condition: { field: 'operation', value: 'move_outlook' },
      required: true,
    },
    // Mark as Read/Unread, Delete - Message ID field
    {
      id: 'actionMessageId',
      title: 'Message ID',
      type: 'short-input',
      placeholder: 'ID of the email',
      condition: {
        field: 'operation',
        value: ['mark_read_outlook', 'mark_unread_outlook', 'delete_outlook'],
      },
      required: true,
    },
    // Copy Email - Message ID field
    {
      id: 'copyMessageId',
      title: 'Message ID',
      type: 'short-input',
      placeholder: 'ID of the email to copy',
      condition: { field: 'operation', value: 'copy_outlook' },
      required: true,
    },
    // Copy Email - Destination folder selector (basic mode)
    {
      id: 'copyDestinationFolder',
      title: 'Copy To Folder',
      type: 'folder-selector',
      canonicalParamId: 'copyDestinationId',
      serviceId: 'outlook',
      requiredScopes: ['Mail.ReadWrite', 'Mail.ReadBasic', 'Mail.Read'],
      placeholder: 'Select destination folder',
      dependsOn: ['credential'],
      mode: 'basic',
      condition: { field: 'operation', value: 'copy_outlook' },
      required: true,
    },
    // Copy Email - Manual destination folder input (advanced mode)
    {
      id: 'manualCopyDestinationFolder',
      title: 'Copy To Folder',
      type: 'short-input',
      canonicalParamId: 'copyDestinationId',
      placeholder: 'Enter folder ID',
      mode: 'advanced',
      condition: { field: 'operation', value: 'copy_outlook' },
      required: true,
    },
    ...getTrigger('outlook_poller').subBlocks,
  ],
  tools: {
    access: [
      'outlook_send',
      'outlook_draft',
      'outlook_read',
      'outlook_forward',
      'outlook_move',
      'outlook_mark_read',
      'outlook_mark_unread',
      'outlook_delete',
      'outlook_copy',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'send_outlook':
            return 'outlook_send'
          case 'read_outlook':
            return 'outlook_read'
          case 'draft_outlook':
            return 'outlook_draft'
          case 'forward_outlook':
            return 'outlook_forward'
          case 'move_outlook':
            return 'outlook_move'
          case 'mark_read_outlook':
            return 'outlook_mark_read'
          case 'mark_unread_outlook':
            return 'outlook_mark_unread'
          case 'delete_outlook':
            return 'outlook_delete'
          case 'copy_outlook':
            return 'outlook_copy'
          default:
            throw new Error(`Invalid Outlook operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const {
          credential,
          folder,
          manualFolder,
          destinationFolder,
          manualDestinationFolder,
          moveMessageId,
          actionMessageId,
          copyMessageId,
          copyDestinationFolder,
          manualCopyDestinationFolder,
          ...rest
        } = params

        // Handle both selector and manual folder input
        const effectiveFolder = (folder || manualFolder || '').trim()

        if (rest.operation === 'read_outlook') {
          rest.folder = effectiveFolder || 'INBOX'
        }

        // Handle move operation
        if (rest.operation === 'move_outlook') {
          if (moveMessageId) {
            rest.messageId = moveMessageId
          }
          if (!rest.destinationId) {
            rest.destinationId = (destinationFolder || manualDestinationFolder || '').trim()
          }
        }

        if (
          ['mark_read_outlook', 'mark_unread_outlook', 'delete_outlook'].includes(rest.operation)
        ) {
          if (actionMessageId) {
            rest.messageId = actionMessageId
          }
        }

        if (rest.operation === 'copy_outlook') {
          if (copyMessageId) {
            rest.messageId = copyMessageId
          }
          // Handle copyDestinationId (from UI canonical param) or destinationId (from trigger)
          if (rest.copyDestinationId) {
            rest.destinationId = rest.copyDestinationId
            rest.copyDestinationId = undefined
          } else if (!rest.destinationId) {
            rest.destinationId = (copyDestinationFolder || manualCopyDestinationFolder || '').trim()
          }
        }

        return {
          ...rest,
          credential,
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'Outlook access token' },
    // Send operation inputs
    to: { type: 'string', description: 'Recipient email address' },
    subject: { type: 'string', description: 'Email subject' },
    body: { type: 'string', description: 'Email content' },
    contentType: { type: 'string', description: 'Content type (Text or HTML)' },
    attachmentFiles: { type: 'json', description: 'Files to attach (UI upload)' },
    attachments: { type: 'array', description: 'Files to attach (UserFile array)' },
    // Forward operation inputs
    messageId: { type: 'string', description: 'Message ID to forward' },
    comment: { type: 'string', description: 'Optional comment for forwarding' },
    // Read operation inputs
    folder: { type: 'string', description: 'Email folder' },
    manualFolder: { type: 'string', description: 'Manual folder name' },
    maxResults: { type: 'number', description: 'Maximum emails' },
    includeAttachments: { type: 'boolean', description: 'Include email attachments' },
    // Move operation inputs
    moveMessageId: { type: 'string', description: 'Message ID to move' },
    destinationFolder: { type: 'string', description: 'Destination folder ID' },
    manualDestinationFolder: { type: 'string', description: 'Manual destination folder ID' },
    destinationId: { type: 'string', description: 'Destination folder ID for move' },
    // Action operation inputs
    actionMessageId: { type: 'string', description: 'Message ID for actions' },
    copyMessageId: { type: 'string', description: 'Message ID to copy' },
    copyDestinationFolder: { type: 'string', description: 'Copy destination folder ID' },
    manualCopyDestinationFolder: {
      type: 'string',
      description: 'Manual copy destination folder ID',
    },
    copyDestinationId: { type: 'string', description: 'Destination folder ID for copy' },
  },
  outputs: {
    // Common outputs
    message: { type: 'string', description: 'Response message' },
    results: { type: 'json', description: 'Operation results' },
    // Send operation specific outputs
    status: { type: 'string', description: 'Email send status (sent)' },
    timestamp: { type: 'string', description: 'Operation timestamp' },
    // Draft operation specific outputs
    messageId: { type: 'string', description: 'Draft message ID' },
    subject: { type: 'string', description: 'Draft email subject' },
    // Read operation specific outputs
    emailCount: { type: 'number', description: 'Number of emails retrieved' },
    emails: { type: 'json', description: 'Array of email objects' },
    emailId: { type: 'string', description: 'Individual email ID' },
    emailSubject: { type: 'string', description: 'Individual email subject' },
    bodyPreview: { type: 'string', description: 'Email body preview' },
    bodyContent: { type: 'string', description: 'Full email body content' },
    sender: { type: 'json', description: 'Email sender information' },
    from: { type: 'json', description: 'Email from information' },
    recipients: { type: 'json', description: 'Email recipients' },
    receivedDateTime: { type: 'string', description: 'Email received timestamp' },
    sentDateTime: { type: 'string', description: 'Email sent timestamp' },
    hasAttachments: { type: 'boolean', description: 'Whether email has attachments' },
    attachments: {
      type: 'json',
      description: 'Email attachments (if includeAttachments is enabled)',
    },
    isRead: { type: 'boolean', description: 'Whether email is read' },
    importance: { type: 'string', description: 'Email importance level' },
    // Trigger outputs
    email: { type: 'json', description: 'Email data from trigger' },
    rawEmail: { type: 'json', description: 'Complete raw email data from Microsoft Graph API' },
  },
  triggers: {
    enabled: true,
    available: ['outlook_poller'],
  },
}
```

--------------------------------------------------------------------------------

````
