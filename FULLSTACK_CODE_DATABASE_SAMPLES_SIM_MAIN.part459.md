---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 459
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 459 of 933)

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

---[FILE: google_drive.ts]---
Location: sim-main/apps/sim/blocks/blocks/google_drive.ts

```typescript
import { GoogleDriveIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { GoogleDriveResponse } from '@/tools/google_drive/types'

export const GoogleDriveBlock: BlockConfig<GoogleDriveResponse> = {
  type: 'google_drive',
  name: 'Google Drive',
  description: 'Create, upload, and list files',
  authMode: AuthMode.OAuth,
  longDescription: 'Integrate Google Drive into the workflow. Can create, upload, and list files.',
  docsLink: 'https://docs.sim.ai/tools/google_drive',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: GoogleDriveIcon,
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
      ],
      value: () => 'create_folder',
    },
    // Google Drive Credentials
    {
      id: 'credential',
      title: 'Google Drive Account',
      type: 'oauth-input',
      required: true,
      serviceId: 'google-drive',
      requiredScopes: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive',
      ],
      placeholder: 'Select Google Drive account',
    },
    // Create/Upload File Fields
    {
      id: 'fileName',
      title: 'File Name',
      type: 'short-input',
      placeholder: 'Name of the file (e.g., document.txt)',
      condition: { field: 'operation', value: ['create_file', 'upload'] },
      required: true,
    },
    // File upload (basic mode) - binary files
    {
      id: 'fileUpload',
      title: 'Upload File',
      type: 'file-upload',
      canonicalParamId: 'file',
      placeholder: 'Upload a file to Google Drive',
      condition: { field: 'operation', value: 'upload' },
      mode: 'basic',
      multiple: false,
      required: false,
    },
    // Variable reference (advanced mode) - for referencing files from previous blocks
    {
      id: 'file',
      title: 'File Reference',
      type: 'short-input',
      canonicalParamId: 'file',
      placeholder: 'Reference file from previous block (e.g., {{block_name.file}})',
      condition: { field: 'operation', value: 'upload' },
      mode: 'advanced',
      required: false,
    },
    {
      id: 'content',
      title: 'Text Content',
      type: 'long-input',
      placeholder: 'Text content for the file',
      condition: { field: 'operation', value: 'create_file' },
      required: true,
    },
    {
      id: 'mimeType',
      title: 'MIME Type',
      type: 'dropdown',
      options: [
        { label: 'Plain Text (text/plain)', id: 'text/plain' },
        { label: 'Google Doc', id: 'application/vnd.google-apps.document' },
        { label: 'Google Sheet', id: 'application/vnd.google-apps.spreadsheet' },
        { label: 'Google Slides', id: 'application/vnd.google-apps.presentation' },
        { label: 'HTML (text/html)', id: 'text/html' },
        { label: 'CSV (text/csv)', id: 'text/csv' },
        { label: 'PDF (application/pdf)', id: 'application/pdf' },
      ],
      placeholder: 'Select file type',
      condition: { field: 'operation', value: 'create_file' },
      required: false,
    },
    {
      id: 'folderSelector',
      title: 'Select Parent Folder',
      type: 'file-selector',
      canonicalParamId: 'folderId',
      serviceId: 'google-drive',
      requiredScopes: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive',
      ],
      mimeType: 'application/vnd.google-apps.folder',
      placeholder: 'Select a parent folder',
      mode: 'basic',
      dependsOn: ['credential'],
      condition: { field: 'operation', value: ['create_file', 'upload'] },
    },
    {
      id: 'manualFolderId',
      title: 'Parent Folder ID',
      type: 'short-input',
      canonicalParamId: 'folderId',
      placeholder: 'Enter parent folder ID (leave empty for root folder)',
      mode: 'advanced',
      condition: { field: 'operation', value: ['create_file', 'upload'] },
    },
    // Get Content Fields
    // {
    //   id: 'fileId',
    //   title: 'Select File',
    //   type: 'file-selector',
    //   provider: 'google-drive',
    //   serviceId: 'google-drive',
    //   requiredScopes: [],
    //   placeholder: 'Select a file',
    //   condition: { field: 'operation', value: 'get_content' },
    // },
    // // Manual File ID input (shown only when no file is selected)
    // {
    //   id: 'fileId',
    //   title: 'Or Enter File ID Manually',
    //   type: 'short-input',
    //   placeholder: 'ID of the file to get content from',
    //   condition: {
    //     field: 'operation',
    //     value: 'get_content',
    //     and: {
    //       field: 'fileId',
    //       value: '',
    //     },
    //   },
    // },
    // Export format for Google Workspace files
    // {
    //   id: 'mimeType',
    //   title: 'Export Format',
    //   type: 'dropdown',
    //   options: [
    //     { label: 'Plain Text', id: 'text/plain' },
    //     { label: 'HTML', id: 'text/html' },
    //   ],
    //   placeholder: 'Optional: Choose export format for Google Workspace files',
    //   condition: { field: 'operation', value: 'get_content' },
    // },
    // Create Folder Fields
    {
      id: 'fileName',
      title: 'Folder Name',
      type: 'short-input',
      placeholder: 'Name for the new folder',
      condition: { field: 'operation', value: 'create_folder' },
      required: true,
    },
    {
      id: 'folderSelector',
      title: 'Select Parent Folder',
      type: 'file-selector',
      canonicalParamId: 'folderId',
      serviceId: 'google-drive',
      requiredScopes: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive',
      ],
      mimeType: 'application/vnd.google-apps.folder',
      placeholder: 'Select a parent folder',
      mode: 'basic',
      dependsOn: ['credential'],
      condition: { field: 'operation', value: 'create_folder' },
    },
    // Manual Folder ID input (advanced mode)
    {
      id: 'manualFolderId',
      title: 'Parent Folder ID',
      type: 'short-input',
      canonicalParamId: 'folderId',
      placeholder: 'Enter parent folder ID (leave empty for root folder)',
      mode: 'advanced',
      condition: { field: 'operation', value: 'create_folder' },
    },
    // List Fields - Folder Selector (basic mode)
    {
      id: 'folderSelector',
      title: 'Select Folder',
      type: 'file-selector',
      canonicalParamId: 'folderId',
      serviceId: 'google-drive',
      requiredScopes: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive',
      ],
      mimeType: 'application/vnd.google-apps.folder',
      placeholder: 'Select a folder to list files from',
      mode: 'basic',
      dependsOn: ['credential'],
      condition: { field: 'operation', value: 'list' },
    },
    // Manual Folder ID input (advanced mode)
    {
      id: 'manualFolderId',
      title: 'Folder ID',
      type: 'short-input',
      canonicalParamId: 'folderId',
      placeholder: 'Enter folder ID (leave empty for root folder)',
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
      serviceId: 'google-drive',
      requiredScopes: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive',
      ],
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
    // Export format for Google Workspace files (download operation)
    {
      id: 'mimeType',
      title: 'Export Format',
      type: 'dropdown',
      options: [
        { label: 'Plain Text (text/plain)', id: 'text/plain' },
        { label: 'HTML (text/html)', id: 'text/html' },
        { label: 'PDF (application/pdf)', id: 'application/pdf' },
        {
          label: 'DOCX (MS Word)',
          id: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        },
        {
          label: 'XLSX (MS Excel)',
          id: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
        {
          label: 'PPTX (MS PowerPoint)',
          id: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        },
        { label: 'CSV (text/csv)', id: 'text/csv' },
      ],
      placeholder: 'Optional: Choose export format for Google Docs/Sheets/Slides',
      condition: { field: 'operation', value: 'download' },
    },
    {
      id: 'fileName',
      title: 'File Name Override',
      type: 'short-input',
      placeholder: 'Optional: Override the filename',
      condition: { field: 'operation', value: 'download' },
    },
  ],
  tools: {
    access: [
      'google_drive_upload',
      'google_drive_create_folder',
      'google_drive_download',
      'google_drive_list',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'create_file':
          case 'upload':
            return 'google_drive_upload'
          case 'create_folder':
            return 'google_drive_create_folder'
          case 'download':
            return 'google_drive_download'
          case 'list':
            return 'google_drive_list'
          default:
            throw new Error(`Invalid Google Drive operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const {
          credential,
          folderSelector,
          manualFolderId,
          fileSelector,
          manualFileId,
          mimeType,
          ...rest
        } = params

        // Use folderSelector if provided, otherwise use manualFolderId
        const effectiveFolderId = (folderSelector || manualFolderId || '').trim()

        // Use fileSelector if provided, otherwise use manualFileId
        const effectiveFileId = (fileSelector || manualFileId || '').trim()

        return {
          credential,
          folderId: effectiveFolderId || undefined,
          fileId: effectiveFileId || undefined,
          pageSize: rest.pageSize ? Number.parseInt(rest.pageSize as string, 10) : undefined,
          mimeType: mimeType,
          ...rest,
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'Google Drive access token' },
    // Upload and Create Folder operation inputs
    fileName: { type: 'string', description: 'File or folder name' },
    file: { type: 'json', description: 'File to upload (UserFile object)' },
    content: { type: 'string', description: 'Text content to upload' },
    mimeType: { type: 'string', description: 'File MIME type or export format' },
    // Download operation inputs
    fileSelector: { type: 'string', description: 'Selected file to download' },
    manualFileId: { type: 'string', description: 'Manual file identifier' },
    // List operation inputs
    folderSelector: { type: 'string', description: 'Selected folder' },
    manualFolderId: { type: 'string', description: 'Manual folder identifier' },
    query: { type: 'string', description: 'Search query' },
    pageSize: { type: 'number', description: 'Results per page' },
  },
  outputs: {
    file: { type: 'json', description: 'File data' },
    files: { type: 'json', description: 'Files list' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: google_form.ts]---
Location: sim-main/apps/sim/blocks/blocks/google_form.ts

```typescript
import { GoogleFormsIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { getTrigger } from '@/triggers'

export const GoogleFormsBlock: BlockConfig = {
  type: 'google_forms',
  name: 'Google Forms',
  description: 'Read responses from a Google Form',
  longDescription:
    'Integrate Google Forms into your workflow. Provide a Form ID to list responses, or specify a Response ID to fetch a single response. Requires OAuth.',
  docsLink: 'https://docs.sim.ai/tools/google_forms',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: GoogleFormsIcon,
  subBlocks: [
    {
      id: 'credential',
      title: 'Google Account',
      type: 'oauth-input',
      required: true,
      serviceId: 'google-forms',
      requiredScopes: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/forms.responses.readonly',
      ],
      placeholder: 'Select Google account',
    },
    {
      id: 'formId',
      title: 'Form ID',
      type: 'short-input',
      required: true,
      placeholder: 'Enter the Google Form ID',
      dependsOn: ['credential'],
    },
    {
      id: 'responseId',
      title: 'Response ID',
      type: 'short-input',
      placeholder: 'Enter a specific response ID',
    },
    {
      id: 'pageSize',
      title: 'Page Size',
      type: 'short-input',
      placeholder: 'Max responses to retrieve (default 5000)',
    },
    ...getTrigger('google_forms_webhook').subBlocks,
  ],
  tools: {
    access: ['google_forms_get_responses'],
    config: {
      tool: () => 'google_forms_get_responses',
      params: (params) => {
        const { credential, formId, responseId, pageSize, ...rest } = params

        const effectiveFormId = String(formId || '').trim()
        if (!effectiveFormId) {
          throw new Error('Form ID is required.')
        }

        return {
          ...rest,
          formId: effectiveFormId,
          responseId: responseId ? String(responseId).trim() : undefined,
          pageSize: pageSize ? Number(pageSize) : undefined,
          credential,
        }
      },
    },
  },
  inputs: {
    credential: { type: 'string', description: 'Google OAuth credential' },
    formId: { type: 'string', description: 'Google Form ID' },
    responseId: { type: 'string', description: 'Specific response ID' },
    pageSize: { type: 'string', description: 'Max responses to retrieve (default 5000)' },
  },
  outputs: {
    data: { type: 'json', description: 'Response or list of responses' },
  },
  triggers: {
    enabled: true,
    available: ['google_forms_webhook'],
  },
}
```

--------------------------------------------------------------------------------

---[FILE: google_groups.ts]---
Location: sim-main/apps/sim/blocks/blocks/google_groups.ts

```typescript
import { GoogleGroupsIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'

export const GoogleGroupsBlock: BlockConfig = {
  type: 'google_groups',
  name: 'Google Groups',
  description: 'Manage Google Workspace Groups and their members',
  authMode: AuthMode.OAuth,
  longDescription:
    'Connect to Google Workspace to create, update, and manage groups and their members using the Admin SDK Directory API.',
  docsLink: 'https://developers.google.com/admin-sdk/directory/v1/guides/manage-groups',
  category: 'tools',
  bgColor: '#E8F0FE',
  icon: GoogleGroupsIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'List Groups', id: 'list_groups' },
        { label: 'Get Group', id: 'get_group' },
        { label: 'Create Group', id: 'create_group' },
        { label: 'Update Group', id: 'update_group' },
        { label: 'Delete Group', id: 'delete_group' },
        { label: 'List Members', id: 'list_members' },
        { label: 'Get Member', id: 'get_member' },
        { label: 'Add Member', id: 'add_member' },
        { label: 'Update Member Role', id: 'update_member' },
        { label: 'Remove Member', id: 'remove_member' },
        { label: 'Check Membership', id: 'has_member' },
      ],
      value: () => 'list_groups',
    },
    {
      id: 'credential',
      title: 'Google Groups Account',
      type: 'oauth-input',
      required: true,
      serviceId: 'google-groups',
      requiredScopes: [
        'https://www.googleapis.com/auth/admin.directory.group',
        'https://www.googleapis.com/auth/admin.directory.group.member',
      ],
      placeholder: 'Select Google Workspace account',
    },

    {
      id: 'customer',
      title: 'Customer ID',
      type: 'short-input',
      placeholder: 'my_customer (default)',
      condition: { field: 'operation', value: 'list_groups' },
    },
    {
      id: 'domain',
      title: 'Domain',
      type: 'short-input',
      placeholder: 'Filter by domain (e.g., example.com)',
      condition: { field: 'operation', value: 'list_groups' },
    },
    {
      id: 'query',
      title: 'Search Query',
      type: 'short-input',
      placeholder: 'Filter query (e.g., email:admin*)',
      condition: { field: 'operation', value: 'list_groups' },
    },
    {
      id: 'maxResults',
      title: 'Max Results',
      type: 'short-input',
      placeholder: 'Maximum results (1-200)',
      condition: {
        field: 'operation',
        value: ['list_groups', 'list_members'],
      },
    },

    {
      id: 'groupKey',
      title: 'Group Email or ID',
      type: 'short-input',
      placeholder: 'group@example.com or group ID',
      required: true,
      condition: {
        field: 'operation',
        value: [
          'get_group',
          'update_group',
          'delete_group',
          'list_members',
          'get_member',
          'add_member',
          'update_member',
          'remove_member',
          'has_member',
        ],
      },
    },

    {
      id: 'email',
      title: 'Group Email',
      type: 'short-input',
      placeholder: 'newgroup@example.com',
      required: true,
      condition: { field: 'operation', value: 'create_group' },
    },
    {
      id: 'name',
      title: 'Group Name',
      type: 'short-input',
      placeholder: 'Display name for the group',
      required: true,
      condition: { field: 'operation', value: 'create_group' },
    },
    {
      id: 'description',
      title: 'Description',
      type: 'long-input',
      placeholder: 'Optional description for the group',
      condition: { field: 'operation', value: ['create_group', 'update_group'] },
    },

    {
      id: 'newName',
      title: 'New Name',
      type: 'short-input',
      placeholder: 'New display name',
      condition: { field: 'operation', value: 'update_group' },
    },
    {
      id: 'newEmail',
      title: 'New Email',
      type: 'short-input',
      placeholder: 'New email address',
      condition: { field: 'operation', value: 'update_group' },
    },

    {
      id: 'memberKey',
      title: 'Member Email or ID',
      type: 'short-input',
      placeholder: 'user@example.com or member ID',
      required: true,
      condition: {
        field: 'operation',
        value: ['get_member', 'update_member', 'remove_member', 'has_member'],
      },
    },
    {
      id: 'memberEmail',
      title: 'Member Email',
      type: 'short-input',
      placeholder: 'user@example.com',
      required: true,
      condition: { field: 'operation', value: 'add_member' },
    },
    {
      id: 'role',
      title: 'Member Role',
      type: 'dropdown',
      options: [
        { id: 'MEMBER', label: 'Member' },
        { id: 'MANAGER', label: 'Manager' },
        { id: 'OWNER', label: 'Owner' },
      ],
      condition: { field: 'operation', value: ['add_member', 'update_member'] },
    },
    {
      id: 'roles',
      title: 'Filter by Roles',
      type: 'short-input',
      placeholder: 'OWNER,MANAGER,MEMBER',
      condition: { field: 'operation', value: 'list_members' },
    },
  ],
  tools: {
    access: [
      'google_groups_list_groups',
      'google_groups_get_group',
      'google_groups_create_group',
      'google_groups_update_group',
      'google_groups_delete_group',
      'google_groups_list_members',
      'google_groups_get_member',
      'google_groups_add_member',
      'google_groups_remove_member',
      'google_groups_update_member',
      'google_groups_has_member',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'list_groups':
            return 'google_groups_list_groups'
          case 'get_group':
            return 'google_groups_get_group'
          case 'create_group':
            return 'google_groups_create_group'
          case 'update_group':
            return 'google_groups_update_group'
          case 'delete_group':
            return 'google_groups_delete_group'
          case 'list_members':
            return 'google_groups_list_members'
          case 'get_member':
            return 'google_groups_get_member'
          case 'add_member':
            return 'google_groups_add_member'
          case 'update_member':
            return 'google_groups_update_member'
          case 'remove_member':
            return 'google_groups_remove_member'
          case 'has_member':
            return 'google_groups_has_member'
          default:
            throw new Error(`Invalid Google Groups operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const { credential, operation, ...rest } = params

        switch (operation) {
          case 'list_groups':
            return {
              credential,
              customer: rest.customer,
              domain: rest.domain,
              query: rest.query,
              maxResults: rest.maxResults ? Number(rest.maxResults) : undefined,
            }
          case 'get_group':
          case 'delete_group':
            return {
              credential,
              groupKey: rest.groupKey,
            }
          case 'create_group':
            return {
              credential,
              email: rest.email,
              name: rest.name,
              description: rest.description,
            }
          case 'update_group':
            return {
              credential,
              groupKey: rest.groupKey,
              name: rest.newName,
              email: rest.newEmail,
              description: rest.description,
            }
          case 'list_members':
            return {
              credential,
              groupKey: rest.groupKey,
              maxResults: rest.maxResults ? Number(rest.maxResults) : undefined,
              roles: rest.roles,
            }
          case 'get_member':
          case 'remove_member':
            return {
              credential,
              groupKey: rest.groupKey,
              memberKey: rest.memberKey,
            }
          case 'add_member':
            return {
              credential,
              groupKey: rest.groupKey,
              email: rest.memberEmail,
              role: rest.role,
            }
          case 'update_member':
            return {
              credential,
              groupKey: rest.groupKey,
              memberKey: rest.memberKey,
              role: rest.role,
            }
          case 'has_member':
            return {
              credential,
              groupKey: rest.groupKey,
              memberKey: rest.memberKey,
            }
          default:
            return { credential, ...rest }
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'Google Workspace OAuth credential' },
    customer: { type: 'string', description: 'Customer ID for listing groups' },
    domain: { type: 'string', description: 'Domain filter for listing groups' },
    query: { type: 'string', description: 'Search query for filtering groups' },
    maxResults: { type: 'number', description: 'Maximum results to return' },
    groupKey: { type: 'string', description: 'Group email address or ID' },
    email: { type: 'string', description: 'Email address for new group' },
    name: { type: 'string', description: 'Display name for group' },
    description: { type: 'string', description: 'Group description' },
    newName: { type: 'string', description: 'New display name for update' },
    newEmail: { type: 'string', description: 'New email for update' },
    memberKey: { type: 'string', description: 'Member email or ID' },
    memberEmail: { type: 'string', description: 'Email of member to add' },
    role: { type: 'string', description: 'Member role (MEMBER, MANAGER, OWNER)' },
    roles: { type: 'string', description: 'Filter by roles for list members' },
  },
  outputs: {
    groups: { type: 'json', description: 'Array of group objects (for list_groups)' },
    group: { type: 'json', description: 'Single group object (for get/create/update_group)' },
    members: { type: 'json', description: 'Array of member objects (for list_members)' },
    member: { type: 'json', description: 'Single member object (for get/add/update_member)' },
    isMember: { type: 'boolean', description: 'Membership check result (for has_member)' },
    message: { type: 'string', description: 'Success message (for delete/remove operations)' },
    nextPageToken: { type: 'string', description: 'Token for fetching next page of results' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: google_sheets.ts]---
Location: sim-main/apps/sim/blocks/blocks/google_sheets.ts

```typescript
import { GoogleSheetsIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { GoogleSheetsResponse } from '@/tools/google_sheets/types'

export const GoogleSheetsBlock: BlockConfig<GoogleSheetsResponse> = {
  type: 'google_sheets',
  name: 'Google Sheets',
  description: 'Read, write, and update data',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrate Google Sheets into the workflow. Can read, write, append, and update data.',
  docsLink: 'https://docs.sim.ai/tools/google_sheets',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: GoogleSheetsIcon,
  subBlocks: [
    // Operation selector
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Read Data', id: 'read' },
        { label: 'Write Data', id: 'write' },
        { label: 'Update Data', id: 'update' },
        { label: 'Append Data', id: 'append' },
      ],
      value: () => 'read',
    },
    // Google Sheets Credentials
    {
      id: 'credential',
      title: 'Google Account',
      type: 'oauth-input',
      required: true,
      serviceId: 'google-sheets',
      requiredScopes: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive',
      ],
      placeholder: 'Select Google account',
    },
    // Spreadsheet Selector
    {
      id: 'spreadsheetId',
      title: 'Select Sheet',
      type: 'file-selector',
      canonicalParamId: 'spreadsheetId',
      serviceId: 'google-sheets',
      requiredScopes: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive',
      ],
      mimeType: 'application/vnd.google-apps.spreadsheet',
      placeholder: 'Select a spreadsheet',
      dependsOn: ['credential'],
      mode: 'basic',
    },
    // Manual Spreadsheet ID (advanced mode)
    {
      id: 'manualSpreadsheetId',
      title: 'Spreadsheet ID',
      type: 'short-input',
      canonicalParamId: 'spreadsheetId',
      placeholder: 'ID of the spreadsheet (from URL)',
      dependsOn: ['credential'],
      mode: 'advanced',
    },
    // Range
    {
      id: 'range',
      title: 'Range',
      type: 'short-input',
      placeholder: 'Sheet name and cell range (e.g., Sheet1!A1:D10)',
    },
    // Write-specific Fields
    {
      id: 'values',
      title: 'Values',
      type: 'long-input',
      placeholder:
        'Enter values as JSON array of arrays (e.g., [["A1", "B1"], ["A2", "B2"]]) or an array of objects (e.g., [{"name":"John", "age":30}, {"name":"Jane", "age":25}])',
      condition: { field: 'operation', value: 'write' },
      required: true,
    },
    {
      id: 'valueInputOption',
      title: 'Value Input Option',
      type: 'dropdown',
      options: [
        { label: 'User Entered (Parse formulas)', id: 'USER_ENTERED' },
        { label: "Raw (Don't parse formulas)", id: 'RAW' },
      ],
      condition: { field: 'operation', value: 'write' },
    },
    // Update-specific Fields
    {
      id: 'values',
      title: 'Values',
      type: 'long-input',
      placeholder:
        'Enter values as JSON array of arrays (e.g., [["A1", "B1"], ["A2", "B2"]]) or an array of objects (e.g., [{"name":"John", "age":30}, {"name":"Jane", "age":25}])',
      condition: { field: 'operation', value: 'update' },
      required: true,
    },
    {
      id: 'valueInputOption',
      title: 'Value Input Option',
      type: 'dropdown',
      options: [
        { label: 'User Entered (Parse formulas)', id: 'USER_ENTERED' },
        { label: "Raw (Don't parse formulas)", id: 'RAW' },
      ],
      condition: { field: 'operation', value: 'update' },
    },
    // Append-specific Fields
    {
      id: 'values',
      title: 'Values',
      type: 'long-input',
      placeholder:
        'Enter values as JSON array of arrays (e.g., [["A1", "B1"], ["A2", "B2"]]) or an array of objects (e.g., [{"name":"John", "age":30}, {"name":"Jane", "age":25}])',
      condition: { field: 'operation', value: 'append' },
      required: true,
    },
    {
      id: 'valueInputOption',
      title: 'Value Input Option',
      type: 'dropdown',
      options: [
        { label: 'User Entered (Parse formulas)', id: 'USER_ENTERED' },
        { label: "Raw (Don't parse formulas)", id: 'RAW' },
      ],
      condition: { field: 'operation', value: 'append' },
    },
    {
      id: 'insertDataOption',
      title: 'Insert Data Option',
      type: 'dropdown',
      options: [
        { label: 'Insert Rows (Add new rows)', id: 'INSERT_ROWS' },
        { label: 'Overwrite (Add to existing data)', id: 'OVERWRITE' },
      ],
      condition: { field: 'operation', value: 'append' },
    },
  ],
  tools: {
    access: [
      'google_sheets_read',
      'google_sheets_write',
      'google_sheets_update',
      'google_sheets_append',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'read':
            return 'google_sheets_read'
          case 'write':
            return 'google_sheets_write'
          case 'update':
            return 'google_sheets_update'
          case 'append':
            return 'google_sheets_append'
          default:
            throw new Error(`Invalid Google Sheets operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const { credential, values, spreadsheetId, manualSpreadsheetId, ...rest } = params

        const parsedValues = values ? JSON.parse(values as string) : undefined

        const effectiveSpreadsheetId = (spreadsheetId || manualSpreadsheetId || '').trim()

        if (!effectiveSpreadsheetId) {
          throw new Error('Spreadsheet ID is required.')
        }

        return {
          ...rest,
          spreadsheetId: effectiveSpreadsheetId,
          values: parsedValues,
          credential,
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'Google Sheets access token' },
    spreadsheetId: { type: 'string', description: 'Spreadsheet identifier' },
    manualSpreadsheetId: { type: 'string', description: 'Manual spreadsheet identifier' },
    range: { type: 'string', description: 'Cell range' },
    values: { type: 'string', description: 'Cell values data' },
    valueInputOption: { type: 'string', description: 'Value input option' },
    insertDataOption: { type: 'string', description: 'Data insertion option' },
  },
  outputs: {
    data: { type: 'json', description: 'Sheet data' },
    metadata: { type: 'json', description: 'Operation metadata' },
    updatedRange: { type: 'string', description: 'Updated range' },
    updatedRows: { type: 'number', description: 'Updated rows count' },
    updatedColumns: { type: 'number', description: 'Updated columns count' },
    updatedCells: { type: 'number', description: 'Updated cells count' },
    tableRange: { type: 'string', description: 'Table range' },
  },
}
```

--------------------------------------------------------------------------------

````
