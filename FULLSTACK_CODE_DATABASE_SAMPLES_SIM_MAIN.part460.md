---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 460
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 460 of 933)

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

---[FILE: google_slides.ts]---
Location: sim-main/apps/sim/blocks/blocks/google_slides.ts

```typescript
import { GoogleSlidesIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { GoogleSlidesResponse } from '@/tools/google_slides/types'

export const GoogleSlidesBlock: BlockConfig<GoogleSlidesResponse> = {
  type: 'google_slides',
  name: 'Google Slides',
  description: 'Read, write, and create presentations',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrate Google Slides into the workflow. Can read, write, create presentations, replace text, add slides, add images, and get thumbnails.',
  docsLink: 'https://docs.sim.ai/tools/google_slides',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: GoogleSlidesIcon,
  subBlocks: [
    // Operation selector
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Read Presentation', id: 'read' },
        { label: 'Write to Presentation', id: 'write' },
        { label: 'Create Presentation', id: 'create' },
        { label: 'Replace All Text', id: 'replace_all_text' },
        { label: 'Add Slide', id: 'add_slide' },
        { label: 'Add Image', id: 'add_image' },
        { label: 'Get Thumbnail', id: 'get_thumbnail' },
      ],
      value: () => 'read',
    },
    // Google Slides Credentials
    {
      id: 'credential',
      title: 'Google Account',
      type: 'oauth-input',
      required: true,
      serviceId: 'google-drive',
      requiredScopes: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive',
      ],
      placeholder: 'Select Google account',
    },
    // Presentation selector (basic mode) - for operations that need an existing presentation
    {
      id: 'presentationId',
      title: 'Select Presentation',
      type: 'file-selector',
      canonicalParamId: 'presentationId',
      serviceId: 'google-drive',
      requiredScopes: [],
      mimeType: 'application/vnd.google-apps.presentation',
      placeholder: 'Select a presentation',
      dependsOn: ['credential'],
      mode: 'basic',
      condition: {
        field: 'operation',
        value: ['read', 'write', 'replace_all_text', 'add_slide', 'add_image', 'get_thumbnail'],
      },
    },
    // Manual presentation ID input (advanced mode)
    {
      id: 'manualPresentationId',
      title: 'Presentation ID',
      type: 'short-input',
      canonicalParamId: 'presentationId',
      placeholder: 'Enter presentation ID',
      dependsOn: ['credential'],
      mode: 'advanced',
      condition: {
        field: 'operation',
        value: ['read', 'write', 'replace_all_text', 'add_slide', 'add_image', 'get_thumbnail'],
      },
    },

    // ========== Write Operation Fields ==========
    {
      id: 'slideIndex',
      title: 'Slide Index',
      type: 'short-input',
      placeholder: 'Enter slide index (0 for first slide)',
      condition: { field: 'operation', value: 'write' },
    },
    {
      id: 'content',
      title: 'Content',
      type: 'long-input',
      placeholder: 'Enter slide content',
      condition: { field: 'operation', value: 'write' },
      required: true,
    },

    // ========== Create Operation Fields ==========
    {
      id: 'title',
      title: 'Presentation Title',
      type: 'short-input',
      placeholder: 'Enter title for the new presentation',
      condition: { field: 'operation', value: 'create' },
      required: true,
    },
    // Folder selector (basic mode)
    {
      id: 'folderSelector',
      title: 'Select Parent Folder',
      type: 'file-selector',
      canonicalParamId: 'folderId',
      serviceId: 'google-drive',
      requiredScopes: [],
      mimeType: 'application/vnd.google-apps.folder',
      placeholder: 'Select a parent folder',
      dependsOn: ['credential'],
      mode: 'basic',
      condition: { field: 'operation', value: 'create' },
    },
    // Manual folder ID input (advanced mode)
    {
      id: 'folderId',
      title: 'Parent Folder ID',
      type: 'short-input',
      canonicalParamId: 'folderId',
      placeholder: 'Enter parent folder ID (leave empty for root folder)',
      dependsOn: ['credential'],
      mode: 'advanced',
      condition: { field: 'operation', value: 'create' },
    },
    // Content Field for create operation
    {
      id: 'createContent',
      title: 'Initial Content',
      type: 'long-input',
      placeholder: 'Enter initial slide content (optional)',
      condition: { field: 'operation', value: 'create' },
    },

    // ========== Replace All Text Operation Fields ==========
    {
      id: 'findText',
      title: 'Find Text',
      type: 'short-input',
      placeholder: 'Text to find (e.g., {{placeholder}})',
      condition: { field: 'operation', value: 'replace_all_text' },
      required: true,
    },
    {
      id: 'replaceText',
      title: 'Replace With',
      type: 'short-input',
      placeholder: 'Text to replace with',
      condition: { field: 'operation', value: 'replace_all_text' },
      required: true,
    },
    {
      id: 'matchCase',
      title: 'Match Case',
      type: 'switch',
      condition: { field: 'operation', value: 'replace_all_text' },
    },
    {
      id: 'pageObjectIds',
      title: 'Limit to Slides (IDs)',
      type: 'short-input',
      placeholder: 'Comma-separated slide IDs (leave empty for all)',
      condition: { field: 'operation', value: 'replace_all_text' },
      mode: 'advanced',
    },

    // ========== Add Slide Operation Fields ==========
    {
      id: 'layout',
      title: 'Slide Layout',
      type: 'dropdown',
      options: [
        { label: 'Blank', id: 'BLANK' },
        { label: 'Title', id: 'TITLE' },
        { label: 'Title and Body', id: 'TITLE_AND_BODY' },
        { label: 'Title Only', id: 'TITLE_ONLY' },
        { label: 'Title and Two Columns', id: 'TITLE_AND_TWO_COLUMNS' },
        { label: 'Section Header', id: 'SECTION_HEADER' },
        { label: 'Caption Only', id: 'CAPTION_ONLY' },
        { label: 'Main Point', id: 'MAIN_POINT' },
        { label: 'Big Number', id: 'BIG_NUMBER' },
      ],
      condition: { field: 'operation', value: 'add_slide' },
      value: () => 'BLANK',
    },
    {
      id: 'insertionIndex',
      title: 'Insertion Position',
      type: 'short-input',
      placeholder: 'Position to insert slide (leave empty for end)',
      condition: { field: 'operation', value: 'add_slide' },
    },
    {
      id: 'placeholderIdMappings',
      title: 'Placeholder ID Mappings',
      type: 'long-input',
      placeholder: 'JSON array: [{"layoutPlaceholder":{"type":"TITLE"},"objectId":"my_title"}]',
      condition: { field: 'operation', value: 'add_slide' },
      mode: 'advanced',
    },

    // ========== Add Image Operation Fields ==========
    {
      id: 'pageObjectId',
      title: 'Slide ID',
      type: 'short-input',
      placeholder: 'Object ID of the slide to add image to',
      condition: { field: 'operation', value: 'add_image' },
      required: true,
    },
    {
      id: 'imageUrl',
      title: 'Image URL',
      type: 'short-input',
      placeholder: 'Public URL of the image (PNG, JPEG, or GIF)',
      condition: { field: 'operation', value: 'add_image' },
      required: true,
    },
    {
      id: 'imageWidth',
      title: 'Width (points)',
      type: 'short-input',
      placeholder: 'Image width in points (default: 300)',
      condition: { field: 'operation', value: 'add_image' },
    },
    {
      id: 'imageHeight',
      title: 'Height (points)',
      type: 'short-input',
      placeholder: 'Image height in points (default: 200)',
      condition: { field: 'operation', value: 'add_image' },
    },
    {
      id: 'positionX',
      title: 'X Position (points)',
      type: 'short-input',
      placeholder: 'X position from left (default: 100)',
      condition: { field: 'operation', value: 'add_image' },
    },
    {
      id: 'positionY',
      title: 'Y Position (points)',
      type: 'short-input',
      placeholder: 'Y position from top (default: 100)',
      condition: { field: 'operation', value: 'add_image' },
    },

    // ========== Get Thumbnail Operation Fields ==========
    {
      id: 'thumbnailPageId',
      title: 'Slide ID',
      type: 'short-input',
      placeholder: 'Object ID of the slide to get thumbnail for',
      condition: { field: 'operation', value: 'get_thumbnail' },
      required: true,
    },
    {
      id: 'thumbnailSize',
      title: 'Thumbnail Size',
      type: 'dropdown',
      options: [
        { label: 'Small (200px)', id: 'SMALL' },
        { label: 'Medium (800px)', id: 'MEDIUM' },
        { label: 'Large (1600px)', id: 'LARGE' },
      ],
      condition: { field: 'operation', value: 'get_thumbnail' },
      value: () => 'MEDIUM',
    },
    {
      id: 'mimeType',
      title: 'Image Format',
      type: 'dropdown',
      options: [
        { label: 'PNG', id: 'PNG' },
        { label: 'GIF', id: 'GIF' },
      ],
      condition: { field: 'operation', value: 'get_thumbnail' },
      value: () => 'PNG',
    },
  ],
  tools: {
    access: [
      'google_slides_read',
      'google_slides_write',
      'google_slides_create',
      'google_slides_replace_all_text',
      'google_slides_add_slide',
      'google_slides_add_image',
      'google_slides_get_thumbnail',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'read':
            return 'google_slides_read'
          case 'write':
            return 'google_slides_write'
          case 'create':
            return 'google_slides_create'
          case 'replace_all_text':
            return 'google_slides_replace_all_text'
          case 'add_slide':
            return 'google_slides_add_slide'
          case 'add_image':
            return 'google_slides_add_image'
          case 'get_thumbnail':
            return 'google_slides_get_thumbnail'
          default:
            throw new Error(`Invalid Google Slides operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const {
          credential,
          presentationId,
          manualPresentationId,
          folderSelector,
          folderId,
          slideIndex,
          createContent,
          thumbnailPageId,
          imageWidth,
          imageHeight,
          ...rest
        } = params

        const effectivePresentationId = (presentationId || manualPresentationId || '').trim()
        const effectiveFolderId = (folderSelector || folderId || '').trim()

        const result: Record<string, any> = {
          ...rest,
          presentationId: effectivePresentationId || undefined,
          credential,
        }

        // Handle operation-specific params
        if (params.operation === 'write' && slideIndex) {
          result.slideIndex = Number.parseInt(slideIndex as string, 10)
        }

        if (params.operation === 'create') {
          result.folderId = effectiveFolderId || undefined
          if (createContent) {
            result.content = createContent
          }
        }

        if (params.operation === 'add_slide' && params.insertionIndex) {
          result.insertionIndex = Number.parseInt(params.insertionIndex as string, 10)
        }

        if (params.operation === 'add_image') {
          if (imageWidth) {
            result.width = Number.parseInt(imageWidth as string, 10)
          }
          if (imageHeight) {
            result.height = Number.parseInt(imageHeight as string, 10)
          }
          if (params.positionX) {
            result.positionX = Number.parseInt(params.positionX as string, 10)
          }
          if (params.positionY) {
            result.positionY = Number.parseInt(params.positionY as string, 10)
          }
        }

        if (params.operation === 'get_thumbnail') {
          result.pageObjectId = thumbnailPageId
        }

        return result
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'Google Slides access token' },
    presentationId: { type: 'string', description: 'Presentation identifier' },
    manualPresentationId: { type: 'string', description: 'Manual presentation identifier' },
    // Write operation
    slideIndex: { type: 'number', description: 'Slide index to write to' },
    content: { type: 'string', description: 'Slide content' },
    // Create operation
    title: { type: 'string', description: 'Presentation title' },
    folderSelector: { type: 'string', description: 'Selected folder' },
    folderId: { type: 'string', description: 'Folder identifier' },
    createContent: { type: 'string', description: 'Initial slide content' },
    // Replace all text operation
    findText: { type: 'string', description: 'Text to find' },
    replaceText: { type: 'string', description: 'Text to replace with' },
    matchCase: { type: 'boolean', description: 'Whether to match case' },
    pageObjectIds: {
      type: 'string',
      description: 'Comma-separated slide IDs to limit replacements',
    },
    // Add slide operation
    layout: { type: 'string', description: 'Slide layout' },
    insertionIndex: { type: 'number', description: 'Position to insert slide' },
    placeholderIdMappings: { type: 'string', description: 'JSON array of placeholder ID mappings' },
    // Add image operation
    pageObjectId: { type: 'string', description: 'Slide object ID for image' },
    imageUrl: { type: 'string', description: 'Image URL' },
    imageWidth: { type: 'number', description: 'Image width in points' },
    imageHeight: { type: 'number', description: 'Image height in points' },
    positionX: { type: 'number', description: 'X position in points' },
    positionY: { type: 'number', description: 'Y position in points' },
    // Get thumbnail operation
    thumbnailPageId: { type: 'string', description: 'Slide object ID for thumbnail' },
    thumbnailSize: { type: 'string', description: 'Thumbnail size' },
    mimeType: { type: 'string', description: 'Image format (PNG or GIF)' },
  },
  outputs: {
    // Read operation
    slides: { type: 'json', description: 'Presentation slides' },
    metadata: { type: 'json', description: 'Presentation metadata' },
    // Write operation
    updatedContent: { type: 'boolean', description: 'Content update status' },
    // Replace all text operation
    occurrencesChanged: { type: 'number', description: 'Number of text occurrences replaced' },
    // Add slide operation
    slideId: { type: 'string', description: 'Object ID of newly created slide' },
    // Add image operation
    imageId: { type: 'string', description: 'Object ID of newly created image' },
    // Get thumbnail operation
    contentUrl: { type: 'string', description: 'URL to the thumbnail image' },
    width: { type: 'number', description: 'Thumbnail width in pixels' },
    height: { type: 'number', description: 'Thumbnail height in pixels' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: google_vault.ts]---
Location: sim-main/apps/sim/blocks/blocks/google_vault.ts

```typescript
import { GoogleVaultIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'

export const GoogleVaultBlock: BlockConfig = {
  type: 'google_vault',
  name: 'Google Vault',
  description: 'Search, export, and manage holds/exports for Vault matters',
  authMode: AuthMode.OAuth,
  longDescription:
    'Connect Google Vault to create exports, list exports, and manage holds within matters.',
  docsLink: 'https://developers.google.com/vault',
  category: 'tools',
  bgColor: '#E8F0FE',
  icon: GoogleVaultIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Create Export', id: 'create_matters_export' },
        { label: 'List Exports', id: 'list_matters_export' },
        { label: 'Download Export File', id: 'download_export_file' },
        { label: 'Create Hold', id: 'create_matters_holds' },
        { label: 'List Holds', id: 'list_matters_holds' },
        { label: 'Create Matter', id: 'create_matters' },
        { label: 'List Matters', id: 'list_matters' },
      ],
      value: () => 'list_matters_export',
    },

    {
      id: 'credential',
      title: 'Google Vault Account',
      type: 'oauth-input',
      required: true,
      serviceId: 'google-vault',
      requiredScopes: [
        'https://www.googleapis.com/auth/ediscovery',
        'https://www.googleapis.com/auth/devstorage.read_only',
      ],
      placeholder: 'Select Google Vault account',
    },
    // Create Hold inputs
    {
      id: 'matterId',
      title: 'Matter ID',
      type: 'short-input',
      placeholder: 'Enter Matter ID',
      condition: () => ({
        field: 'operation',
        value: [
          'create_matters_export',
          'list_matters_export',
          'download_export_file',
          'create_matters_holds',
          'list_matters_holds',
        ],
      }),
    },
    // Download Export File inputs
    {
      id: 'bucketName',
      title: 'Bucket Name',
      type: 'short-input',
      placeholder: 'Vault export bucket (from cloudStorageSink.files.bucketName)',
      condition: { field: 'operation', value: 'download_export_file' },
      required: true,
    },
    {
      id: 'objectName',
      title: 'Object Name',
      type: 'long-input',
      placeholder: 'Vault export object (from cloudStorageSink.files.objectName)',
      condition: { field: 'operation', value: 'download_export_file' },
      required: true,
    },
    {
      id: 'fileName',
      title: 'File Name',
      type: 'short-input',
      placeholder: 'Override filename used for storage/display',
      condition: { field: 'operation', value: 'download_export_file' },
    },
    {
      id: 'exportName',
      title: 'Export Name',
      type: 'short-input',
      placeholder: 'Name for the export',
      condition: { field: 'operation', value: 'create_matters_export' },
      required: true,
    },
    {
      id: 'holdName',
      title: 'Hold Name',
      type: 'short-input',
      placeholder: 'Name of the hold',
      condition: { field: 'operation', value: 'create_matters_holds' },
      required: true,
    },
    {
      id: 'corpus',
      title: 'Corpus',
      type: 'dropdown',
      options: [
        { id: 'MAIL', label: 'MAIL' },
        { id: 'DRIVE', label: 'DRIVE' },
        { id: 'GROUPS', label: 'GROUPS' },
        { id: 'HANGOUTS_CHAT', label: 'HANGOUTS_CHAT' },
        { id: 'VOICE', label: 'VOICE' },
      ],
      condition: { field: 'operation', value: ['create_matters_holds', 'create_matters_export'] },
      required: true,
    },
    {
      id: 'accountEmails',
      title: 'Account Emails',
      type: 'long-input',
      placeholder: 'Comma-separated emails (alternative to Org Unit)',
      condition: { field: 'operation', value: ['create_matters_holds', 'create_matters_export'] },
    },
    {
      id: 'orgUnitId',
      title: 'Org Unit ID',
      type: 'short-input',
      placeholder: 'Org Unit ID (alternative to emails)',
      condition: { field: 'operation', value: ['create_matters_holds', 'create_matters_export'] },
    },
    {
      id: 'exportId',
      title: 'Export ID',
      type: 'short-input',
      placeholder: 'Enter Export ID (optional to fetch a specific export)',
      condition: { field: 'operation', value: 'list_matters_export' },
    },
    {
      id: 'holdId',
      title: 'Hold ID',
      type: 'short-input',
      placeholder: 'Enter Hold ID (optional to fetch a specific hold)',
      condition: { field: 'operation', value: 'list_matters_holds' },
    },
    {
      id: 'pageSize',
      title: 'Page Size',
      type: 'short-input',
      placeholder: 'Number of items to return',
      condition: {
        field: 'operation',
        value: ['list_matters_export', 'list_matters_holds', 'list_matters'],
      },
    },
    {
      id: 'pageToken',
      title: 'Page Token',
      type: 'short-input',
      placeholder: 'Pagination token',
      condition: {
        field: 'operation',
        value: ['list_matters_export', 'list_matters_holds', 'list_matters'],
      },
    },

    {
      id: 'name',
      title: 'Matter Name',
      type: 'short-input',
      placeholder: 'Enter Matter name',
      condition: { field: 'operation', value: 'create_matters' },
      required: true,
    },
    {
      id: 'description',
      title: 'Description',
      type: 'short-input',
      placeholder: 'Optional description for the matter',
      condition: { field: 'operation', value: 'create_matters' },
    },
    // Optional get specific matter by ID
    {
      id: 'matterId',
      title: 'Matter ID',
      type: 'short-input',
      placeholder: 'Enter Matter ID (optional to fetch a specific matter)',
      condition: { field: 'operation', value: 'list_matters' },
    },
  ],
  tools: {
    access: [
      'google_vault_create_matters_export',
      'google_vault_list_matters_export',
      'google_vault_download_export_file',
      'google_vault_create_matters_holds',
      'google_vault_list_matters_holds',
      'google_vault_create_matters',
      'google_vault_list_matters',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'create_matters_export':
            return 'google_vault_create_matters_export'
          case 'list_matters_export':
            return 'google_vault_list_matters_export'
          case 'download_export_file':
            return 'google_vault_download_export_file'
          case 'create_matters_holds':
            return 'google_vault_create_matters_holds'
          case 'list_matters_holds':
            return 'google_vault_list_matters_holds'
          case 'create_matters':
            return 'google_vault_create_matters'
          case 'list_matters':
            return 'google_vault_list_matters'
          default:
            throw new Error(`Invalid Google Vault operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const { credential, ...rest } = params
        return {
          ...rest,
          credential,
        }
      },
    },
  },
  inputs: {
    // Core inputs
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'Google Vault OAuth credential' },
    matterId: { type: 'string', description: 'Matter ID' },

    // Create export inputs
    exportName: { type: 'string', description: 'Name for the export' },
    corpus: { type: 'string', description: 'Data corpus (MAIL, DRIVE, GROUPS, etc.)' },
    accountEmails: { type: 'string', description: 'Comma-separated account emails' },
    orgUnitId: { type: 'string', description: 'Organization unit ID' },

    // Create hold inputs
    holdName: { type: 'string', description: 'Name for the hold' },

    // Download export file inputs
    bucketName: { type: 'string', description: 'GCS bucket name from export' },
    objectName: { type: 'string', description: 'GCS object name from export' },
    fileName: { type: 'string', description: 'Optional filename override' },

    // List operations inputs
    exportId: { type: 'string', description: 'Specific export ID to fetch' },
    holdId: { type: 'string', description: 'Specific hold ID to fetch' },
    pageSize: { type: 'number', description: 'Number of items per page' },
    pageToken: { type: 'string', description: 'Pagination token' },

    // Create matter inputs
    name: { type: 'string', description: 'Matter name' },
    description: { type: 'string', description: 'Matter description' },
  },
  outputs: {
    matters: { type: 'json', description: 'Array of matter objects (for list_matters)' },
    exports: { type: 'json', description: 'Array of export objects (for list_matters_export)' },
    holds: { type: 'json', description: 'Array of hold objects (for list_matters_holds)' },
    matter: { type: 'json', description: 'Created matter object (for create_matters)' },
    export: { type: 'json', description: 'Created export object (for create_matters_export)' },
    hold: { type: 'json', description: 'Created hold object (for create_matters_holds)' },
    file: { type: 'json', description: 'Downloaded export file (UserFile) from execution files' },
    nextPageToken: {
      type: 'string',
      description: 'Token for fetching next page of results (for list operations)',
    },
  },
}
```

--------------------------------------------------------------------------------

````
