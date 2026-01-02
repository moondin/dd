---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 484
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 484 of 933)

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

---[FILE: servicenow.ts]---
Location: sim-main/apps/sim/blocks/blocks/servicenow.ts

```typescript
import { ServiceNowIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import type { ServiceNowResponse } from '@/tools/servicenow/types'

export const ServiceNowBlock: BlockConfig<ServiceNowResponse> = {
  type: 'servicenow',
  name: 'ServiceNow',
  description: 'Create, read, update, and delete ServiceNow records',
  longDescription:
    'Integrate ServiceNow into your workflow. Create, read, update, and delete records in any ServiceNow table including incidents, tasks, change requests, users, and more.',
  docsLink: 'https://docs.sim.ai/tools/servicenow',
  category: 'tools',
  bgColor: '#032D42',
  icon: ServiceNowIcon,
  subBlocks: [
    // Operation selector
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Create Record', id: 'servicenow_create_record' },
        { label: 'Read Records', id: 'servicenow_read_record' },
        { label: 'Update Record', id: 'servicenow_update_record' },
        { label: 'Delete Record', id: 'servicenow_delete_record' },
      ],
      value: () => 'servicenow_read_record',
    },
    // Instance URL
    {
      id: 'instanceUrl',
      title: 'Instance URL',
      type: 'short-input',
      placeholder: 'https://instance.service-now.com',
      required: true,
      description: 'Your ServiceNow instance URL (e.g., https://yourcompany.service-now.com)',
    },
    // Username
    {
      id: 'username',
      title: 'Username',
      type: 'short-input',
      placeholder: 'Enter your ServiceNow username',
      required: true,
      description: 'ServiceNow user with web service access',
    },
    // Password
    {
      id: 'password',
      title: 'Password',
      type: 'short-input',
      placeholder: 'Enter your ServiceNow password',
      password: true,
      required: true,
      description: 'Password for the ServiceNow user',
    },
    // Table Name
    {
      id: 'tableName',
      title: 'Table Name',
      type: 'short-input',
      placeholder: 'incident, task, sys_user, etc.',
      required: true,
      description: 'ServiceNow table name',
    },
    // Create-specific: Fields
    {
      id: 'fields',
      title: 'Fields (JSON)',
      type: 'code',
      language: 'json',
      placeholder: '{\n  "short_description": "Issue description",\n  "priority": "1"\n}',
      condition: { field: 'operation', value: 'servicenow_create_record' },
      required: true,
      wandConfig: {
        enabled: true,
        maintainHistory: true,
        prompt: `You are an expert ServiceNow developer. Generate ServiceNow record field objects as JSON based on the user's request.

### CONTEXT
ServiceNow records use specific field names depending on the table. Common tables and their key fields include:
- incident: short_description, description, priority (1-5), urgency (1-3), impact (1-3), caller_id, assignment_group, assigned_to, category, subcategory, state
- task: short_description, description, priority, assignment_group, assigned_to, state
- sys_user: user_name, first_name, last_name, email, active, department, title
- change_request: short_description, description, type, risk, impact, priority, assignment_group

### RULES
- Output ONLY valid JSON object starting with { and ending with }
- Use correct ServiceNow field names for the target table
- Values should be strings unless the field specifically requires another type
- For reference fields (like caller_id, assigned_to), use sys_id values or display values
- Do not include sys_id in create operations (it's auto-generated)

### EXAMPLE
User: "Create a high priority incident for network outage"
Output: {"short_description": "Network outage", "description": "Network connectivity issue affecting users", "priority": "1", "urgency": "1", "impact": "1", "category": "Network"}`,
        generationType: 'json-object',
      },
    },
    // Read-specific: Query options
    {
      id: 'sysId',
      title: 'Record sys_id',
      type: 'short-input',
      placeholder: 'Specific record sys_id (optional)',
      condition: { field: 'operation', value: 'servicenow_read_record' },
    },
    {
      id: 'number',
      title: 'Record Number',
      type: 'short-input',
      placeholder: 'e.g., INC0010001 (optional)',
      condition: { field: 'operation', value: 'servicenow_read_record' },
    },
    {
      id: 'query',
      title: 'Query String',
      type: 'short-input',
      placeholder: 'active=true^priority=1',
      condition: { field: 'operation', value: 'servicenow_read_record' },
      description: 'ServiceNow encoded query string',
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: '10',
      condition: { field: 'operation', value: 'servicenow_read_record' },
    },
    {
      id: 'fields',
      title: 'Fields to Return',
      type: 'short-input',
      placeholder: 'number,short_description,priority',
      condition: { field: 'operation', value: 'servicenow_read_record' },
      description: 'Comma-separated list of fields',
    },
    // Update-specific: sysId and fields
    {
      id: 'sysId',
      title: 'Record sys_id',
      type: 'short-input',
      placeholder: 'Record sys_id to update',
      condition: { field: 'operation', value: 'servicenow_update_record' },
      required: true,
    },
    {
      id: 'fields',
      title: 'Fields to Update (JSON)',
      type: 'code',
      language: 'json',
      placeholder: '{\n  "state": "2",\n  "assigned_to": "user.sys_id"\n}',
      condition: { field: 'operation', value: 'servicenow_update_record' },
      required: true,
      wandConfig: {
        enabled: true,
        maintainHistory: true,
        prompt: `You are an expert ServiceNow developer. Generate ServiceNow record update field objects as JSON based on the user's request.

### CONTEXT
ServiceNow records use specific field names depending on the table. Common update scenarios include:
- incident: state (1=New, 2=In Progress, 3=On Hold, 6=Resolved, 7=Closed), assigned_to, work_notes, close_notes, close_code
- task: state, assigned_to, work_notes, percent_complete
- change_request: state, risk, approval, work_notes

### RULES
- Output ONLY valid JSON object starting with { and ending with }
- Include only the fields that need to be updated
- Use correct ServiceNow field names for the target table
- For state transitions, use the correct numeric state values
- work_notes and comments fields append to existing values

### EXAMPLE
User: "Assign the incident to John and set to in progress"
Output: {"state": "2", "assigned_to": "john.doe", "work_notes": "Assigned and starting investigation"}`,
        generationType: 'json-object',
      },
    },
    // Delete-specific: sysId
    {
      id: 'sysId',
      title: 'Record sys_id',
      type: 'short-input',
      placeholder: 'Record sys_id to delete',
      condition: { field: 'operation', value: 'servicenow_delete_record' },
      required: true,
    },
  ],
  tools: {
    access: [
      'servicenow_create_record',
      'servicenow_read_record',
      'servicenow_update_record',
      'servicenow_delete_record',
    ],
    config: {
      tool: (params) => params.operation,
      params: (params) => {
        const { operation, fields, ...rest } = params
        const isCreateOrUpdate =
          operation === 'servicenow_create_record' || operation === 'servicenow_update_record'

        if (fields && isCreateOrUpdate) {
          const parsedFields = typeof fields === 'string' ? JSON.parse(fields) : fields
          return { ...rest, fields: parsedFields }
        }

        return rest
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    instanceUrl: { type: 'string', description: 'ServiceNow instance URL' },
    username: { type: 'string', description: 'ServiceNow username' },
    password: { type: 'string', description: 'ServiceNow password' },
    tableName: { type: 'string', description: 'Table name' },
    sysId: { type: 'string', description: 'Record sys_id' },
    number: { type: 'string', description: 'Record number' },
    query: { type: 'string', description: 'Query string' },
    limit: { type: 'number', description: 'Result limit' },
    fields: { type: 'json', description: 'Fields object or JSON string' },
  },
  outputs: {
    record: { type: 'json', description: 'Single ServiceNow record' },
    records: { type: 'json', description: 'Array of ServiceNow records' },
    success: { type: 'boolean', description: 'Operation success status' },
    metadata: { type: 'json', description: 'Operation metadata' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: sftp.ts]---
Location: sim-main/apps/sim/blocks/blocks/sftp.ts

```typescript
import { SftpIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { SftpUploadResult } from '@/tools/sftp/types'

export const SftpBlock: BlockConfig<SftpUploadResult> = {
  type: 'sftp',
  name: 'SFTP',
  description: 'Transfer files via SFTP (SSH File Transfer Protocol)',
  longDescription:
    'Upload, download, list, and manage files on remote servers via SFTP. Supports both password and private key authentication for secure file transfers.',
  docsLink: 'https://docs.sim.ai/tools/sftp',
  category: 'tools',
  bgColor: '#2D3748',
  icon: SftpIcon,
  authMode: AuthMode.ApiKey,

  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Upload Files', id: 'sftp_upload' },
        { label: 'Create File', id: 'sftp_create' },
        { label: 'Download File', id: 'sftp_download' },
        { label: 'List Directory', id: 'sftp_list' },
        { label: 'Delete File/Directory', id: 'sftp_delete' },
        { label: 'Create Directory', id: 'sftp_mkdir' },
      ],
      value: () => 'sftp_upload',
    },

    {
      id: 'host',
      title: 'SFTP Host',
      type: 'short-input',
      placeholder: 'sftp.example.com or 192.168.1.100',
      required: true,
    },
    {
      id: 'port',
      title: 'SFTP Port',
      type: 'short-input',
      placeholder: '22',
      value: () => '22',
    },
    {
      id: 'username',
      title: 'Username',
      type: 'short-input',
      placeholder: 'sftp-user',
      required: true,
    },

    {
      id: 'authMethod',
      title: 'Authentication Method',
      type: 'dropdown',
      options: [
        { label: 'Password', id: 'password' },
        { label: 'Private Key', id: 'privateKey' },
      ],
      value: () => 'password',
    },

    {
      id: 'password',
      title: 'Password',
      type: 'short-input',
      password: true,
      placeholder: 'Your SFTP password',
      condition: { field: 'authMethod', value: 'password' },
    },

    {
      id: 'privateKey',
      title: 'Private Key',
      type: 'code',
      placeholder: '-----BEGIN OPENSSH PRIVATE KEY-----\n...',
      condition: { field: 'authMethod', value: 'privateKey' },
    },
    {
      id: 'passphrase',
      title: 'Passphrase',
      type: 'short-input',
      password: true,
      placeholder: 'Passphrase for encrypted key (optional)',
      condition: { field: 'authMethod', value: 'privateKey' },
    },

    {
      id: 'remotePath',
      title: 'Remote Path',
      type: 'short-input',
      placeholder: '/home/user/uploads',
      required: true,
    },

    {
      id: 'uploadFiles',
      title: 'Files to Upload',
      type: 'file-upload',
      canonicalParamId: 'files',
      placeholder: 'Select files to upload',
      mode: 'basic',
      multiple: true,
      required: false,
      condition: { field: 'operation', value: 'sftp_upload' },
    },
    {
      id: 'files',
      title: 'File Reference',
      type: 'short-input',
      canonicalParamId: 'files',
      placeholder: 'Reference file from previous block (e.g., {{block_name.file}})',
      mode: 'advanced',
      required: false,
      condition: { field: 'operation', value: 'sftp_upload' },
    },

    {
      id: 'overwrite',
      title: 'Overwrite Existing Files',
      type: 'switch',
      defaultValue: true,
      condition: { field: 'operation', value: ['sftp_upload', 'sftp_create'] },
    },

    {
      id: 'permissions',
      title: 'File Permissions',
      type: 'short-input',
      placeholder: '0644',
      condition: { field: 'operation', value: ['sftp_upload', 'sftp_create'] },
      mode: 'advanced',
    },

    {
      id: 'fileName',
      title: 'File Name',
      type: 'short-input',
      placeholder: 'filename.txt',
      condition: { field: 'operation', value: 'sftp_create' },
      required: true,
    },
    {
      id: 'fileContent',
      title: 'File Content',
      type: 'code',
      placeholder: 'Text content to write to the file',
      condition: { field: 'operation', value: 'sftp_create' },
      required: true,
    },

    {
      id: 'encoding',
      title: 'Output Encoding',
      type: 'dropdown',
      options: [
        { label: 'UTF-8 (Text)', id: 'utf-8' },
        { label: 'Base64 (Binary)', id: 'base64' },
      ],
      value: () => 'utf-8',
      condition: { field: 'operation', value: 'sftp_download' },
    },

    {
      id: 'detailed',
      title: 'Show Detailed Info',
      type: 'switch',
      defaultValue: false,
      condition: { field: 'operation', value: 'sftp_list' },
    },

    {
      id: 'recursive',
      title: 'Recursive Delete',
      type: 'switch',
      defaultValue: false,
      condition: { field: 'operation', value: 'sftp_delete' },
    },

    {
      id: 'mkdirRecursive',
      title: 'Create Parent Directories',
      type: 'switch',
      defaultValue: true,
      condition: { field: 'operation', value: 'sftp_mkdir' },
    },
  ],

  tools: {
    access: ['sftp_upload', 'sftp_download', 'sftp_list', 'sftp_delete', 'sftp_mkdir'],
    config: {
      tool: (params) => {
        const operation = params.operation || 'sftp_upload'
        if (operation === 'sftp_create') return 'sftp_upload'
        return operation
      },
      params: (params) => {
        const connectionConfig: Record<string, unknown> = {
          host: params.host,
          port:
            typeof params.port === 'string' ? Number.parseInt(params.port, 10) : params.port || 22,
          username: params.username,
        }

        if (params.authMethod === 'privateKey') {
          connectionConfig.privateKey = params.privateKey
          if (params.passphrase) {
            connectionConfig.passphrase = params.passphrase
          }
        } else {
          connectionConfig.password = params.password
        }

        const operation = params.operation || 'sftp_upload'

        switch (operation) {
          case 'sftp_upload':
            return {
              ...connectionConfig,
              remotePath: params.remotePath,
              files: params.files,
              overwrite: params.overwrite !== false,
              permissions: params.permissions,
            }
          case 'sftp_create':
            return {
              ...connectionConfig,
              remotePath: params.remotePath,
              fileContent: params.fileContent,
              fileName: params.fileName,
              overwrite: params.overwrite !== false,
              permissions: params.permissions,
            }
          case 'sftp_download':
            return {
              ...connectionConfig,
              remotePath: params.remotePath,
              encoding: params.encoding || 'utf-8',
            }
          case 'sftp_list':
            return {
              ...connectionConfig,
              remotePath: params.remotePath,
              detailed: params.detailed || false,
            }
          case 'sftp_delete':
            return {
              ...connectionConfig,
              remotePath: params.remotePath,
              recursive: params.recursive || false,
            }
          case 'sftp_mkdir':
            return {
              ...connectionConfig,
              remotePath: params.remotePath,
              recursive: params.mkdirRecursive !== false,
            }
          default:
            return {
              ...connectionConfig,
              remotePath: params.remotePath,
            }
        }
      },
    },
  },

  inputs: {
    operation: { type: 'string', description: 'SFTP operation to perform' },
    host: { type: 'string', description: 'SFTP server hostname' },
    port: { type: 'number', description: 'SFTP server port' },
    username: { type: 'string', description: 'SFTP username' },
    authMethod: { type: 'string', description: 'Authentication method (password or privateKey)' },
    password: { type: 'string', description: 'Password for authentication' },
    privateKey: { type: 'string', description: 'Private key for authentication' },
    passphrase: { type: 'string', description: 'Passphrase for encrypted key' },
    remotePath: { type: 'string', description: 'Remote path on the SFTP server' },
    files: { type: 'array', description: 'Files to upload (UserFile array)' },
    fileContent: { type: 'string', description: 'Direct content to upload' },
    fileName: { type: 'string', description: 'File name for direct content' },
    overwrite: { type: 'boolean', description: 'Overwrite existing files' },
    permissions: { type: 'string', description: 'File permissions (e.g., 0644)' },
    encoding: { type: 'string', description: 'Output encoding for download' },
    detailed: { type: 'boolean', description: 'Show detailed file info' },
    recursive: { type: 'boolean', description: 'Recursive delete' },
    mkdirRecursive: { type: 'boolean', description: 'Create parent directories' },
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the operation was successful' },
    uploadedFiles: { type: 'json', description: 'Array of uploaded file details' },
    fileName: { type: 'string', description: 'Downloaded file name' },
    content: { type: 'string', description: 'Downloaded file content' },
    size: { type: 'number', description: 'File size in bytes' },
    entries: { type: 'json', description: 'Directory listing entries' },
    count: { type: 'number', description: 'Number of entries' },
    deletedPath: { type: 'string', description: 'Path that was deleted' },
    createdPath: { type: 'string', description: 'Directory that was created' },
    message: { type: 'string', description: 'Operation status message' },
    error: { type: 'string', description: 'Error message if operation failed' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: sharepoint.ts]---
Location: sim-main/apps/sim/blocks/blocks/sharepoint.ts

```typescript
import { MicrosoftSharepointIcon } from '@/components/icons'
import { createLogger } from '@/lib/logs/console/logger'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { SharepointResponse } from '@/tools/sharepoint/types'

const logger = createLogger('SharepointBlock')

export const SharepointBlock: BlockConfig<SharepointResponse> = {
  type: 'sharepoint',
  name: 'Sharepoint',
  description: 'Work with pages and lists',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrate SharePoint into the workflow. Read/create pages, list sites, and work with lists (read, create, update items). Requires OAuth.',
  docsLink: 'https://docs.sim.ai/tools/sharepoint',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: MicrosoftSharepointIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Create Page', id: 'create_page' },
        { label: 'Read Page', id: 'read_page' },
        { label: 'List Sites', id: 'list_sites' },
        { label: 'Create List', id: 'create_list' },
        { label: 'Read List', id: 'read_list' },
        { label: 'Update List', id: 'update_list' },
        { label: 'Add List Items', id: 'add_list_items' },
        { label: 'Upload File', id: 'upload_file' },
      ],
    },
    {
      id: 'credential',
      title: 'Microsoft Account',
      type: 'oauth-input',
      serviceId: 'sharepoint',
      requiredScopes: [
        'openid',
        'profile',
        'email',
        'Sites.Read.All',
        'Sites.ReadWrite.All',
        'Sites.Manage.All',
        'offline_access',
      ],
      placeholder: 'Select Microsoft account',
    },

    {
      id: 'siteSelector',
      title: 'Select Site',
      type: 'file-selector',
      canonicalParamId: 'siteId',
      serviceId: 'sharepoint',
      requiredScopes: [
        'openid',
        'profile',
        'email',
        'Files.Read',
        'Files.ReadWrite',
        'offline_access',
      ],
      mimeType: 'application/vnd.microsoft.graph.folder',
      placeholder: 'Select a site',
      dependsOn: ['credential'],
      mode: 'basic',
      condition: {
        field: 'operation',
        value: [
          'create_page',
          'read_page',
          'list_sites',
          'create_list',
          'read_list',
          'update_list',
          'add_list_items',
          'upload_file',
        ],
      },
    },

    {
      id: 'pageName',
      title: 'Page Name',
      type: 'short-input',
      placeholder: 'Name of the page',
      condition: { field: 'operation', value: ['create_page', 'read_page'] },
    },

    {
      id: 'pageId',
      title: 'Page ID',
      type: 'short-input',
      placeholder: 'Page ID (alternative to page name)',
      condition: { field: 'operation', value: 'read_page' },
      mode: 'advanced',
    },

    {
      id: 'listId',
      title: 'List ID',
      type: 'short-input',
      placeholder: 'Enter list ID (GUID). Required for Update; optional for Read.',
      canonicalParamId: 'listId',
      condition: { field: 'operation', value: ['read_list', 'update_list', 'add_list_items'] },
    },

    {
      id: 'listItemId',
      title: 'Item ID',
      type: 'short-input',
      placeholder: 'Enter item ID',
      canonicalParamId: 'itemId',
      condition: { field: 'operation', value: ['update_list'] },
    },

    {
      id: 'listDisplayName',
      title: 'List Display Name',
      type: 'short-input',
      placeholder: 'Name of the list',
      condition: { field: 'operation', value: 'create_list' },
    },

    {
      id: 'listTemplate',
      title: 'List Template',
      type: 'short-input',
      placeholder: "Template (e.g., 'genericList')",
      condition: { field: 'operation', value: 'create_list' },
    },

    {
      id: 'pageContent',
      title: 'Page Content',
      type: 'long-input',
      placeholder: 'Provide page content',
      condition: { field: 'operation', value: ['create_list'] },
    },
    {
      id: 'listDescription',
      title: 'List Description',
      type: 'long-input',
      placeholder: 'Optional description',
      condition: { field: 'operation', value: 'create_list' },
    },

    {
      id: 'manualSiteId',
      title: 'Site ID',
      type: 'short-input',
      canonicalParamId: 'siteId',
      placeholder: 'Enter site ID (leave empty for root site)',
      dependsOn: ['credential'],
      mode: 'advanced',
      condition: { field: 'operation', value: 'create_page' },
    },

    {
      id: 'listItemFields',
      title: 'List Item Fields',
      type: 'long-input',
      placeholder: 'Enter list item fields',
      canonicalParamId: 'listItemFields',
      condition: { field: 'operation', value: ['update_list', 'add_list_items'] },
    },

    // Upload File operation fields
    {
      id: 'driveId',
      title: 'Document Library ID',
      type: 'short-input',
      placeholder: 'Enter document library (drive) ID',
      canonicalParamId: 'driveId',
      condition: { field: 'operation', value: 'upload_file' },
      mode: 'advanced',
    },
    {
      id: 'folderPath',
      title: 'Folder Path',
      type: 'short-input',
      placeholder: 'Optional folder path (e.g., /Documents/Subfolder)',
      condition: { field: 'operation', value: 'upload_file' },
      required: false,
    },
    {
      id: 'fileName',
      title: 'File Name',
      type: 'short-input',
      placeholder: 'Optional: override uploaded file name',
      condition: { field: 'operation', value: 'upload_file' },
      mode: 'advanced',
      required: false,
    },
    // File upload (basic mode)
    {
      id: 'uploadFiles',
      title: 'Files',
      type: 'file-upload',
      canonicalParamId: 'files',
      placeholder: 'Upload files to SharePoint',
      condition: { field: 'operation', value: 'upload_file' },
      mode: 'basic',
      multiple: true,
      required: false,
    },
    // Variable reference (advanced mode)
    {
      id: 'files',
      title: 'Files',
      type: 'short-input',
      canonicalParamId: 'files',
      placeholder: 'Reference files from previous blocks',
      condition: { field: 'operation', value: 'upload_file' },
      mode: 'advanced',
      required: false,
    },
  ],
  tools: {
    access: [
      'sharepoint_create_page',
      'sharepoint_read_page',
      'sharepoint_list_sites',
      'sharepoint_create_list',
      'sharepoint_get_list',
      'sharepoint_update_list',
      'sharepoint_add_list_items',
      'sharepoint_upload_file',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'create_page':
            return 'sharepoint_create_page'
          case 'read_page':
            return 'sharepoint_read_page'
          case 'list_sites':
            return 'sharepoint_list_sites'
          case 'create_list':
            return 'sharepoint_create_list'
          case 'read_list':
            return 'sharepoint_get_list'
          case 'update_list':
            return 'sharepoint_update_list'
          case 'add_list_items':
            return 'sharepoint_add_list_items'
          case 'upload_file':
            return 'sharepoint_upload_file'
          default:
            throw new Error(`Invalid Sharepoint operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const { credential, siteSelector, manualSiteId, mimeType, ...rest } = params

        const effectiveSiteId = (siteSelector || manualSiteId || '').trim()

        const {
          itemId: providedItemId,
          listItemId,
          listItemFields,
          includeColumns,
          includeItems,
          uploadFiles,
          files,
          ...others
        } = rest as any

        let parsedItemFields: any = listItemFields
        if (typeof listItemFields === 'string' && listItemFields.trim()) {
          try {
            parsedItemFields = JSON.parse(listItemFields)
          } catch (error) {
            logger.error('Failed to parse listItemFields JSON', {
              error: error instanceof Error ? error.message : String(error),
            })
          }
        }
        if (typeof parsedItemFields !== 'object' || parsedItemFields === null) {
          parsedItemFields = undefined
        }

        const rawItemId = providedItemId ?? listItemId
        const sanitizedItemId =
          rawItemId === undefined || rawItemId === null
            ? undefined
            : String(rawItemId).trim() || undefined

        const coerceBoolean = (value: any) => {
          if (typeof value === 'boolean') return value
          if (typeof value === 'string') return value.toLowerCase() === 'true'
          return undefined
        }

        if (others.operation === 'update_list' || others.operation === 'add_list_items') {
          try {
            logger.info('SharepointBlock list item param check', {
              siteId: effectiveSiteId || undefined,
              listId: (others as any)?.listId,
              listTitle: (others as any)?.listTitle,
              itemId: sanitizedItemId,
              hasItemFields: !!parsedItemFields && typeof parsedItemFields === 'object',
              itemFieldKeys:
                parsedItemFields && typeof parsedItemFields === 'object'
                  ? Object.keys(parsedItemFields)
                  : [],
            })
          } catch {}
        }

        // Handle file upload files parameter
        const fileParam = uploadFiles || files
        const baseParams = {
          credential,
          siteId: effectiveSiteId || undefined,
          pageSize: others.pageSize ? Number.parseInt(others.pageSize as string, 10) : undefined,
          mimeType: mimeType,
          ...others,
          itemId: sanitizedItemId,
          listItemFields: parsedItemFields,
          includeColumns: coerceBoolean(includeColumns),
          includeItems: coerceBoolean(includeItems),
        }

        // Add files if provided
        if (fileParam) {
          baseParams.files = fileParam
        }

        return baseParams
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'Microsoft account credential' },
    pageName: { type: 'string', description: 'Page name' },
    pageContent: { type: 'string', description: 'Page content' },
    pageTitle: { type: 'string', description: 'Page title' },
    pageId: { type: 'string', description: 'Page ID' },
    siteSelector: { type: 'string', description: 'Site selector' },
    manualSiteId: { type: 'string', description: 'Manual site ID' },
    pageSize: { type: 'number', description: 'Results per page' },
    listDisplayName: { type: 'string', description: 'List display name' },
    listDescription: { type: 'string', description: 'List description' },
    listTemplate: { type: 'string', description: 'List template' },
    listId: { type: 'string', description: 'List ID' },
    listTitle: { type: 'string', description: 'List title' },
    includeColumns: { type: 'boolean', description: 'Include columns in response' },
    includeItems: { type: 'boolean', description: 'Include items in response' },
    listItemId: { type: 'string', description: 'List item ID' },
    listItemFields: { type: 'string', description: 'List item fields' },
    driveId: { type: 'string', description: 'Document library (drive) ID' },
    folderPath: { type: 'string', description: 'Folder path for file upload' },
    fileName: { type: 'string', description: 'File name override' },
    uploadFiles: { type: 'json', description: 'Files to upload (UI upload)' },
    files: { type: 'array', description: 'Files to upload (UserFile array)' },
  },
  outputs: {
    sites: {
      type: 'json',
      description:
        'An array of SharePoint site objects, each containing details such as id, name, and more.',
    },
    list: {
      type: 'json',
      description: 'SharePoint list object (id, displayName, name, webUrl, etc.)',
    },
    item: {
      type: 'json',
      description: 'SharePoint list item with fields',
    },
    items: {
      type: 'json',
      description: 'Array of SharePoint list items with fields',
    },
    uploadedFiles: {
      type: 'json',
      description: 'Array of uploaded file objects with id, name, webUrl, size',
    },
    fileCount: {
      type: 'number',
      description: 'Number of files uploaded',
    },
    success: {
      type: 'boolean',
      description: 'Success status',
    },
    error: {
      type: 'string',
      description: 'Error message',
    },
  },
}
```

--------------------------------------------------------------------------------

````
