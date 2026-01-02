---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 766
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 766 of 933)

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

---[FILE: storage_create_bucket.ts]---
Location: sim-main/apps/sim/tools/supabase/storage_create_bucket.ts

```typescript
import type {
  SupabaseStorageCreateBucketParams,
  SupabaseStorageCreateBucketResponse,
} from '@/tools/supabase/types'
import type { ToolConfig } from '@/tools/types'

export const storageCreateBucketTool: ToolConfig<
  SupabaseStorageCreateBucketParams,
  SupabaseStorageCreateBucketResponse
> = {
  id: 'supabase_storage_create_bucket',
  name: 'Supabase Storage Create Bucket',
  description: 'Create a new storage bucket in Supabase',
  version: '1.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase project ID (e.g., jdrkgepadsdopsntdlom)',
    },
    bucket: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the bucket to create',
    },
    isPublic: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether the bucket should be publicly accessible (default: false)',
    },
    fileSizeLimit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Maximum file size in bytes (optional)',
    },
    allowedMimeTypes: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'Array of allowed MIME types (e.g., ["image/png", "image/jpeg"])',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase service role secret key',
    },
  },

  request: {
    url: (params) => {
      return `https://${params.projectId}.supabase.co/storage/v1/bucket`
    },
    method: 'POST',
    headers: (params) => ({
      apikey: params.apiKey,
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const payload: any = {
        id: params.bucket,
        name: params.bucket,
        public: params.isPublic || false,
      }

      if (params.fileSizeLimit) {
        payload.file_size_limit = Number(params.fileSizeLimit)
      }

      if (params.allowedMimeTypes && params.allowedMimeTypes.length > 0) {
        payload.allowed_mime_types = params.allowedMimeTypes
      }

      return payload
    },
  },

  transformResponse: async (response: Response) => {
    let data
    try {
      data = await response.json()
    } catch (parseError) {
      throw new Error(`Failed to parse Supabase storage create bucket response: ${parseError}`)
    }

    return {
      success: true,
      output: {
        message: 'Successfully created storage bucket',
        results: data,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    results: {
      type: 'object',
      description: 'Created bucket information',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: storage_create_signed_url.ts]---
Location: sim-main/apps/sim/tools/supabase/storage_create_signed_url.ts

```typescript
import type {
  SupabaseStorageCreateSignedUrlParams,
  SupabaseStorageCreateSignedUrlResponse,
} from '@/tools/supabase/types'
import type { ToolConfig } from '@/tools/types'

export const storageCreateSignedUrlTool: ToolConfig<
  SupabaseStorageCreateSignedUrlParams,
  SupabaseStorageCreateSignedUrlResponse
> = {
  id: 'supabase_storage_create_signed_url',
  name: 'Supabase Storage Create Signed URL',
  description: 'Create a temporary signed URL for a file in a Supabase storage bucket',
  version: '1.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase project ID (e.g., jdrkgepadsdopsntdlom)',
    },
    bucket: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the storage bucket',
    },
    path: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The path to the file (e.g., "folder/file.jpg")',
    },
    expiresIn: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'Number of seconds until the URL expires (e.g., 3600 for 1 hour)',
    },
    download: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'If true, forces download instead of inline display (default: false)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase service role secret key',
    },
  },

  request: {
    url: (params) => {
      return `https://${params.projectId}.supabase.co/storage/v1/object/sign/${params.bucket}/${params.path}`
    },
    method: 'POST',
    headers: (params) => ({
      apikey: params.apiKey,
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const payload: any = {
        expiresIn: Number(params.expiresIn),
      }

      if (params.download !== undefined) {
        payload.download = params.download
      }

      return payload
    },
  },

  transformResponse: async (response: Response, params?: SupabaseStorageCreateSignedUrlParams) => {
    let data
    try {
      data = await response.json()
    } catch (parseError) {
      throw new Error(`Failed to parse Supabase storage create signed URL response: ${parseError}`)
    }

    const relativePath = data.signedURL || data.signedUrl
    const fullUrl = `https://${params?.projectId}.supabase.co/storage/v1${relativePath}`

    return {
      success: true,
      output: {
        message: 'Successfully created signed URL',
        signedUrl: fullUrl,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    signedUrl: {
      type: 'string',
      description: 'The temporary signed URL to access the file',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: storage_delete.ts]---
Location: sim-main/apps/sim/tools/supabase/storage_delete.ts

```typescript
import type {
  SupabaseStorageDeleteParams,
  SupabaseStorageDeleteResponse,
} from '@/tools/supabase/types'
import type { ToolConfig } from '@/tools/types'

export const storageDeleteTool: ToolConfig<
  SupabaseStorageDeleteParams,
  SupabaseStorageDeleteResponse
> = {
  id: 'supabase_storage_delete',
  name: 'Supabase Storage Delete',
  description: 'Delete files from a Supabase storage bucket',
  version: '1.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase project ID (e.g., jdrkgepadsdopsntdlom)',
    },
    bucket: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the storage bucket',
    },
    paths: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description: 'Array of file paths to delete (e.g., ["folder/file1.jpg", "folder/file2.jpg"])',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase service role secret key',
    },
  },

  request: {
    url: (params) => {
      return `https://${params.projectId}.supabase.co/storage/v1/object/${params.bucket}`
    },
    method: 'DELETE',
    headers: (params) => ({
      apikey: params.apiKey,
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      return {
        prefixes: params.paths,
      }
    },
  },

  transformResponse: async (response: Response) => {
    let data
    try {
      data = await response.json()
    } catch (parseError) {
      throw new Error(`Failed to parse Supabase storage delete response: ${parseError}`)
    }

    return {
      success: true,
      output: {
        message: 'Successfully deleted files from storage',
        results: data,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    results: {
      type: 'array',
      description: 'Array of deleted file objects',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: storage_delete_bucket.ts]---
Location: sim-main/apps/sim/tools/supabase/storage_delete_bucket.ts

```typescript
import type {
  SupabaseStorageDeleteBucketParams,
  SupabaseStorageDeleteBucketResponse,
} from '@/tools/supabase/types'
import type { ToolConfig } from '@/tools/types'

export const storageDeleteBucketTool: ToolConfig<
  SupabaseStorageDeleteBucketParams,
  SupabaseStorageDeleteBucketResponse
> = {
  id: 'supabase_storage_delete_bucket',
  name: 'Supabase Storage Delete Bucket',
  description: 'Delete a storage bucket in Supabase',
  version: '1.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase project ID (e.g., jdrkgepadsdopsntdlom)',
    },
    bucket: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the bucket to delete',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase service role secret key',
    },
  },

  request: {
    url: (params) => {
      return `https://${params.projectId}.supabase.co/storage/v1/bucket/${params.bucket}`
    },
    method: 'DELETE',
    headers: (params) => ({
      apikey: params.apiKey,
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    let data
    try {
      data = await response.json()
    } catch (parseError) {
      throw new Error(`Failed to parse Supabase storage delete bucket response: ${parseError}`)
    }

    return {
      success: true,
      output: {
        message: 'Successfully deleted storage bucket',
        results: data,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    results: {
      type: 'object',
      description: 'Delete operation result',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: storage_download.ts]---
Location: sim-main/apps/sim/tools/supabase/storage_download.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  SupabaseStorageDownloadParams,
  SupabaseStorageDownloadResponse,
} from '@/tools/supabase/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('SupabaseStorageDownloadTool')

export const storageDownloadTool: ToolConfig<
  SupabaseStorageDownloadParams,
  SupabaseStorageDownloadResponse
> = {
  id: 'supabase_storage_download',
  name: 'Supabase Storage Download',
  description: 'Download a file from a Supabase storage bucket',
  version: '1.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase project ID (e.g., jdrkgepadsdopsntdlom)',
    },
    bucket: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the storage bucket',
    },
    path: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The path to the file to download (e.g., "folder/file.jpg")',
    },
    fileName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Optional filename override',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase service role secret key',
    },
  },

  request: {
    url: (params) => {
      return `https://${params.projectId}.supabase.co/storage/v1/object/${params.bucket}/${params.path}`
    },
    method: 'GET',
    headers: (params) => ({
      apikey: params.apiKey,
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response, params?: SupabaseStorageDownloadParams) => {
    try {
      if (!response.ok) {
        logger.error('Failed to download file from Supabase storage', {
          status: response.status,
          statusText: response.statusText,
        })
        throw new Error(`Failed to download file: ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type') || 'application/octet-stream'

      const pathParts = params?.path?.split('/') || []
      const defaultFileName = pathParts[pathParts.length - 1] || 'download'
      const resolvedName = params?.fileName || defaultFileName

      logger.info('Downloading file from Supabase storage', {
        bucket: params?.bucket,
        path: params?.path,
        fileName: resolvedName,
        contentType,
      })

      const arrayBuffer = await response.arrayBuffer()
      const fileBuffer = Buffer.from(arrayBuffer)

      logger.info('File downloaded successfully from Supabase storage', {
        name: resolvedName,
        size: fileBuffer.length,
        contentType,
      })

      const base64Data = fileBuffer.toString('base64')

      return {
        success: true,
        output: {
          file: {
            name: resolvedName,
            mimeType: contentType,
            data: base64Data,
            size: fileBuffer.length,
          },
        },
        error: undefined,
      }
    } catch (error: any) {
      logger.error('Error downloading file from Supabase storage', {
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

---[FILE: storage_get_public_url.ts]---
Location: sim-main/apps/sim/tools/supabase/storage_get_public_url.ts

```typescript
import type {
  SupabaseStorageGetPublicUrlParams,
  SupabaseStorageGetPublicUrlResponse,
} from '@/tools/supabase/types'
import type { ToolConfig } from '@/tools/types'

export const storageGetPublicUrlTool: ToolConfig<
  SupabaseStorageGetPublicUrlParams,
  SupabaseStorageGetPublicUrlResponse
> = {
  id: 'supabase_storage_get_public_url',
  name: 'Supabase Storage Get Public URL',
  description: 'Get the public URL for a file in a Supabase storage bucket',
  version: '1.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase project ID (e.g., jdrkgepadsdopsntdlom)',
    },
    bucket: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the storage bucket',
    },
    path: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The path to the file (e.g., "folder/file.jpg")',
    },
    download: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'If true, forces download instead of inline display (default: false)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase service role secret key',
    },
  },

  request: {
    url: (params) => `https://${params.projectId}.supabase.co/storage/v1/bucket/${params.bucket}`,
    method: 'GET',
    headers: (params) => ({
      apikey: params.apiKey,
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response, params?: SupabaseStorageGetPublicUrlParams) => {
    let publicUrl = `https://${params?.projectId}.supabase.co/storage/v1/object/public/${params?.bucket}/${params?.path}`

    if (params?.download) {
      publicUrl += '?download=true'
    }

    return {
      success: true,
      output: {
        message: 'Successfully generated public URL',
        publicUrl: publicUrl,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    publicUrl: {
      type: 'string',
      description: 'The public URL to access the file',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: storage_list.ts]---
Location: sim-main/apps/sim/tools/supabase/storage_list.ts

```typescript
import type { SupabaseStorageListParams, SupabaseStorageListResponse } from '@/tools/supabase/types'
import type { ToolConfig } from '@/tools/types'

export const storageListTool: ToolConfig<SupabaseStorageListParams, SupabaseStorageListResponse> = {
  id: 'supabase_storage_list',
  name: 'Supabase Storage List',
  description: 'List files in a Supabase storage bucket',
  version: '1.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase project ID (e.g., jdrkgepadsdopsntdlom)',
    },
    bucket: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the storage bucket',
    },
    path: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'The folder path to list files from (default: root)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Maximum number of files to return (default: 100)',
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of files to skip (for pagination)',
    },
    sortBy: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Column to sort by: name, created_at, updated_at (default: name)',
    },
    sortOrder: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Sort order: asc or desc (default: asc)',
    },
    search: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Search term to filter files by name',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase service role secret key',
    },
  },

  request: {
    url: (params) => {
      return `https://${params.projectId}.supabase.co/storage/v1/object/list/${params.bucket}`
    },
    method: 'POST',
    headers: (params) => ({
      apikey: params.apiKey,
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const payload: any = {
        prefix: params.path || '',
        limit: params.limit ? Number(params.limit) : 100,
        offset: params.offset ? Number(params.offset) : 0,
      }

      if (params.sortBy) {
        payload.sortBy = {
          column: params.sortBy,
          order: params.sortOrder || 'asc',
        }
      }

      if (params.search) {
        payload.search = params.search
      }

      return payload
    },
  },

  transformResponse: async (response: Response) => {
    let data
    try {
      data = await response.json()
    } catch (parseError) {
      throw new Error(`Failed to parse Supabase storage list response: ${parseError}`)
    }

    const fileCount = Array.isArray(data) ? data.length : 0

    return {
      success: true,
      output: {
        message: `Successfully listed ${fileCount} file${fileCount === 1 ? '' : 's'}`,
        results: data,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    results: {
      type: 'array',
      description: 'Array of file objects with metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: storage_list_buckets.ts]---
Location: sim-main/apps/sim/tools/supabase/storage_list_buckets.ts

```typescript
import type {
  SupabaseStorageListBucketsParams,
  SupabaseStorageListBucketsResponse,
} from '@/tools/supabase/types'
import type { ToolConfig } from '@/tools/types'

export const storageListBucketsTool: ToolConfig<
  SupabaseStorageListBucketsParams,
  SupabaseStorageListBucketsResponse
> = {
  id: 'supabase_storage_list_buckets',
  name: 'Supabase Storage List Buckets',
  description: 'List all storage buckets in Supabase',
  version: '1.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase project ID (e.g., jdrkgepadsdopsntdlom)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase service role secret key',
    },
  },

  request: {
    url: (params) => {
      return `https://${params.projectId}.supabase.co/storage/v1/bucket`
    },
    method: 'GET',
    headers: (params) => ({
      apikey: params.apiKey,
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    let data
    try {
      data = await response.json()
    } catch (parseError) {
      throw new Error(`Failed to parse Supabase storage list buckets response: ${parseError}`)
    }

    const bucketCount = Array.isArray(data) ? data.length : 0

    return {
      success: true,
      output: {
        message: `Successfully listed ${bucketCount} bucket${bucketCount === 1 ? '' : 's'}`,
        results: data,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    results: {
      type: 'array',
      description: 'Array of bucket objects',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: storage_move.ts]---
Location: sim-main/apps/sim/tools/supabase/storage_move.ts

```typescript
import type { SupabaseStorageMoveParams, SupabaseStorageMoveResponse } from '@/tools/supabase/types'
import type { ToolConfig } from '@/tools/types'

export const storageMoveTool: ToolConfig<SupabaseStorageMoveParams, SupabaseStorageMoveResponse> = {
  id: 'supabase_storage_move',
  name: 'Supabase Storage Move',
  description: 'Move a file within a Supabase storage bucket',
  version: '1.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase project ID (e.g., jdrkgepadsdopsntdlom)',
    },
    bucket: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the storage bucket',
    },
    fromPath: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The current path of the file (e.g., "folder/old.jpg")',
    },
    toPath: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The new path for the file (e.g., "newfolder/new.jpg")',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase service role secret key',
    },
  },

  request: {
    url: (params) => {
      return `https://${params.projectId}.supabase.co/storage/v1/object/move`
    },
    method: 'POST',
    headers: (params) => ({
      apikey: params.apiKey,
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      return {
        bucketId: params.bucket,
        sourceKey: params.fromPath,
        destinationKey: params.toPath,
      }
    },
  },

  transformResponse: async (response: Response) => {
    let data
    try {
      data = await response.json()
    } catch (parseError) {
      throw new Error(`Failed to parse Supabase storage move response: ${parseError}`)
    }

    return {
      success: true,
      output: {
        message: 'Successfully moved file in storage',
        results: data,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    results: {
      type: 'object',
      description: 'Move operation result',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: storage_upload.ts]---
Location: sim-main/apps/sim/tools/supabase/storage_upload.ts

```typescript
import type {
  SupabaseStorageUploadParams,
  SupabaseStorageUploadResponse,
} from '@/tools/supabase/types'
import type { ToolConfig } from '@/tools/types'

export const storageUploadTool: ToolConfig<
  SupabaseStorageUploadParams,
  SupabaseStorageUploadResponse
> = {
  id: 'supabase_storage_upload',
  name: 'Supabase Storage Upload',
  description: 'Upload a file to a Supabase storage bucket',
  version: '1.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase project ID (e.g., jdrkgepadsdopsntdlom)',
    },
    bucket: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the storage bucket',
    },
    path: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The path where the file will be stored (e.g., "folder/file.jpg")',
    },
    fileContent: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The file content (base64 encoded for binary files, or plain text)',
    },
    contentType: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'MIME type of the file (e.g., "image/jpeg", "text/plain")',
    },
    upsert: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'If true, overwrites existing file (default: false)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase service role secret key',
    },
  },

  request: {
    url: (params) => {
      return `https://${params.projectId}.supabase.co/storage/v1/object/${params.bucket}/${params.path}`
    },
    method: 'POST',
    headers: (params) => {
      const headers: Record<string, string> = {
        apikey: params.apiKey,
        Authorization: `Bearer ${params.apiKey}`,
      }

      if (params.contentType) {
        headers['Content-Type'] = params.contentType
      }

      if (params.upsert) {
        headers['x-upsert'] = 'true'
      }

      return headers
    },
    body: (params) => {
      // Return the file content wrapped in an object
      // The actual upload will need to handle this appropriately
      return {
        content: params.fileContent,
      }
    },
  },

  transformResponse: async (response: Response) => {
    let data
    try {
      data = await response.json()
    } catch (parseError) {
      throw new Error(`Failed to parse Supabase storage upload response: ${parseError}`)
    }

    return {
      success: true,
      output: {
        message: 'Successfully uploaded file to storage',
        results: data,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    results: {
      type: 'object',
      description: 'Upload result including file path and metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: text_search.ts]---
Location: sim-main/apps/sim/tools/supabase/text_search.ts

```typescript
import type { SupabaseTextSearchParams, SupabaseTextSearchResponse } from '@/tools/supabase/types'
import type { ToolConfig } from '@/tools/types'

export const textSearchTool: ToolConfig<SupabaseTextSearchParams, SupabaseTextSearchResponse> = {
  id: 'supabase_text_search',
  name: 'Supabase Text Search',
  description: 'Perform full-text search on a Supabase table',
  version: '1.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase project ID (e.g., jdrkgepadsdopsntdlom)',
    },
    table: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the Supabase table to search',
    },
    column: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The column to search in',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The search query',
    },
    searchType: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Search type: plain, phrase, or websearch (default: websearch)',
    },
    language: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Language for text search configuration (default: english)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Maximum number of rows to return',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase service role secret key',
    },
  },

  request: {
    url: (params) => {
      const searchType = params.searchType || 'websearch'
      const language = params.language || 'english'

      // Build the text search filter
      let url = `https://${params.projectId}.supabase.co/rest/v1/${params.table}?select=*`

      // Map search types to PostgREST operators
      const operatorMap: Record<string, string> = {
        plain: 'fts',
        phrase: 'phfts',
        websearch: 'wfts',
      }

      const operator = operatorMap[searchType] || 'wfts'

      // Add text search filter using PostgREST syntax
      url += `&${params.column}=${operator}(${language}).${encodeURIComponent(params.query)}`

      // Add limit if provided
      if (params.limit) {
        url += `&limit=${Number(params.limit)}`
      }

      return url
    },
    method: 'GET',
    headers: (params) => ({
      apikey: params.apiKey,
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    let data
    try {
      data = await response.json()
    } catch (parseError) {
      throw new Error(`Failed to parse Supabase text search response: ${parseError}`)
    }

    if (!response.ok && data?.message) {
      const errorMessage = data.message

      if (errorMessage.includes('to_tsvector') && errorMessage.includes('does not exist')) {
        throw new Error(
          'Full-text search can only be performed on text columns. The selected column appears to be a non-text type (e.g., integer, boolean). Please select a text/varchar column or use a different operation.'
        )
      }

      if (errorMessage.includes('column') && errorMessage.includes('does not exist')) {
        throw new Error(`The specified column does not exist in the table. Error: ${errorMessage}`)
      }

      throw new Error(errorMessage)
    }

    const rowCount = Array.isArray(data) ? data.length : 0

    if (rowCount === 0) {
      return {
        success: true,
        output: {
          message: 'No results found matching the search query',
          results: data,
        },
        error: undefined,
      }
    }

    return {
      success: true,
      output: {
        message: `Successfully found ${rowCount} result${rowCount === 1 ? '' : 's'}`,
        results: data,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    results: { type: 'array', description: 'Array of records matching the search query' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/supabase/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface SupabaseQueryParams {
  apiKey: string
  projectId: string
  table: string
  filter?: string
  orderBy?: string
  limit?: number
}

export interface SupabaseInsertParams {
  apiKey: string
  projectId: string
  table: string
  data: any
}

export interface SupabaseGetRowParams {
  apiKey: string
  projectId: string
  table: string
  filter: string
}

export interface SupabaseUpdateParams {
  apiKey: string
  projectId: string
  table: string
  filter: string
  data: any
}

export interface SupabaseDeleteParams {
  apiKey: string
  projectId: string
  table: string
  filter: string
}

export interface SupabaseUpsertParams {
  apiKey: string
  projectId: string
  table: string
  data: any
}

export interface SupabaseVectorSearchParams {
  apiKey: string
  projectId: string
  functionName: string
  queryEmbedding: number[]
  matchThreshold?: number
  matchCount?: number
}

export interface SupabaseBaseResponse extends ToolResponse {
  output: {
    message: string
    results: any
  }
  error?: string
}

export interface SupabaseQueryResponse extends SupabaseBaseResponse {}

export interface SupabaseInsertResponse extends SupabaseBaseResponse {}

export interface SupabaseGetRowResponse extends SupabaseBaseResponse {}

export interface SupabaseUpdateResponse extends SupabaseBaseResponse {}

export interface SupabaseDeleteResponse extends SupabaseBaseResponse {}

export interface SupabaseUpsertResponse extends SupabaseBaseResponse {}

export interface SupabaseVectorSearchResponse extends SupabaseBaseResponse {}

export interface SupabaseResponse extends SupabaseBaseResponse {}

// RPC types
export interface SupabaseRpcParams {
  apiKey: string
  projectId: string
  functionName: string
  params?: any
}

export interface SupabaseRpcResponse extends SupabaseBaseResponse {}

// Text Search types
export interface SupabaseTextSearchParams {
  apiKey: string
  projectId: string
  table: string
  column: string
  query: string
  searchType?: string
  language?: string
  limit?: number
}

export interface SupabaseTextSearchResponse extends SupabaseBaseResponse {}

// Count types
export interface SupabaseCountParams {
  apiKey: string
  projectId: string
  table: string
  filter?: string
  countType?: string
}

export interface SupabaseCountResponse extends ToolResponse {
  output: {
    message: string
    count: number
  }
  error?: string
}

// Storage Upload types
export interface SupabaseStorageUploadParams {
  apiKey: string
  projectId: string
  bucket: string
  path: string
  fileContent: string
  contentType?: string
  upsert?: boolean
}

export interface SupabaseStorageUploadResponse extends SupabaseBaseResponse {}

// Storage Download types
export interface SupabaseStorageDownloadParams {
  apiKey: string
  projectId: string
  bucket: string
  path: string
  fileName?: string
}

export interface SupabaseStorageDownloadResponse extends ToolResponse {
  output: {
    file: {
      name: string
      mimeType: string
      data: string | Buffer
      size: number
    }
  }
  error?: string
}

// Storage List types
export interface SupabaseStorageListParams {
  apiKey: string
  projectId: string
  bucket: string
  path?: string
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: string
  search?: string
}

export interface SupabaseStorageListResponse extends SupabaseBaseResponse {}

// Storage Delete types
export interface SupabaseStorageDeleteParams {
  apiKey: string
  projectId: string
  bucket: string
  paths: string[]
}

export interface SupabaseStorageDeleteResponse extends SupabaseBaseResponse {}

// Storage Move types
export interface SupabaseStorageMoveParams {
  apiKey: string
  projectId: string
  bucket: string
  fromPath: string
  toPath: string
}

export interface SupabaseStorageMoveResponse extends SupabaseBaseResponse {}

// Storage Copy types
export interface SupabaseStorageCopyParams {
  apiKey: string
  projectId: string
  bucket: string
  fromPath: string
  toPath: string
}

export interface SupabaseStorageCopyResponse extends SupabaseBaseResponse {}

// Storage Create Bucket types
export interface SupabaseStorageCreateBucketParams {
  apiKey: string
  projectId: string
  bucket: string
  isPublic?: boolean
  fileSizeLimit?: number
  allowedMimeTypes?: string[]
}

export interface SupabaseStorageCreateBucketResponse extends SupabaseBaseResponse {}

// Storage List Buckets types
export interface SupabaseStorageListBucketsParams {
  apiKey: string
  projectId: string
}

export interface SupabaseStorageListBucketsResponse extends SupabaseBaseResponse {}

// Storage Delete Bucket types
export interface SupabaseStorageDeleteBucketParams {
  apiKey: string
  projectId: string
  bucket: string
}

export interface SupabaseStorageDeleteBucketResponse extends SupabaseBaseResponse {}

// Storage Get Public URL types
export interface SupabaseStorageGetPublicUrlParams {
  apiKey: string
  projectId: string
  bucket: string
  path: string
  download?: boolean
}

export interface SupabaseStorageGetPublicUrlResponse extends ToolResponse {
  output: {
    message: string
    publicUrl: string
  }
  error?: string
}

// Storage Create Signed URL types
export interface SupabaseStorageCreateSignedUrlParams {
  apiKey: string
  projectId: string
  bucket: string
  path: string
  expiresIn: number
  download?: boolean
}

export interface SupabaseStorageCreateSignedUrlResponse extends ToolResponse {
  output: {
    message: string
    signedUrl: string
  }
  error?: string
}
```

--------------------------------------------------------------------------------

````
