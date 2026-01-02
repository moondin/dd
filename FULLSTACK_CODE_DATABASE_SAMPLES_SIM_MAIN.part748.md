---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 748
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 748 of 933)

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

---[FILE: read_record.ts]---
Location: sim-main/apps/sim/tools/servicenow/read_record.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ServiceNowReadParams, ServiceNowReadResponse } from '@/tools/servicenow/types'
import { createBasicAuthHeader } from '@/tools/servicenow/utils'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('ServiceNowReadRecordTool')

export const readRecordTool: ToolConfig<ServiceNowReadParams, ServiceNowReadResponse> = {
  id: 'servicenow_read_record',
  name: 'Read ServiceNow Records',
  description: 'Read records from a ServiceNow table',
  version: '1.0.0',

  params: {
    instanceUrl: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ServiceNow instance URL (e.g., https://instance.service-now.com)',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ServiceNow username',
    },
    password: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ServiceNow password',
    },
    tableName: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Table name',
    },
    sysId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Specific record sys_id',
    },
    number: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Record number (e.g., INC0010001)',
    },
    query: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Encoded query string (e.g., "active=true^priority=1")',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of records to return',
    },
    fields: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated list of fields to return',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.instanceUrl.replace(/\/$/, '')
      if (!baseUrl) {
        throw new Error('ServiceNow instance URL is required')
      }
      let url = `${baseUrl}/api/now/table/${params.tableName}`

      const queryParams = new URLSearchParams()

      if (params.sysId) {
        url = `${url}/${params.sysId}`
      } else if (params.number) {
        const numberQuery = `number=${params.number}`
        const existingQuery = params.query
        queryParams.append(
          'sysparm_query',
          existingQuery ? `${existingQuery}^${numberQuery}` : numberQuery
        )
      } else if (params.query) {
        queryParams.append('sysparm_query', params.query)
      }

      if (params.limit) {
        queryParams.append('sysparm_limit', params.limit.toString())
      }

      if (params.fields) {
        queryParams.append('sysparm_fields', params.fields)
      }

      const queryString = queryParams.toString()
      return queryString ? `${url}?${queryString}` : url
    },
    method: 'GET',
    headers: (params) => {
      if (!params.username || !params.password) {
        throw new Error('ServiceNow username and password are required')
      }
      return {
        Authorization: createBasicAuthHeader(params.username, params.password),
        Accept: 'application/json',
      }
    },
  },

  transformResponse: async (response: Response) => {
    try {
      const data = await response.json()

      if (!response.ok) {
        const error = data.error || data
        throw new Error(typeof error === 'string' ? error : error.message || JSON.stringify(error))
      }

      const records = Array.isArray(data.result) ? data.result : [data.result]

      return {
        success: true,
        output: {
          records,
          metadata: {
            recordCount: records.length,
          },
        },
      }
    } catch (error) {
      logger.error('ServiceNow read record - Error processing response:', { error })
      throw error
    }
  },

  outputs: {
    records: {
      type: 'array',
      description: 'Array of ServiceNow records',
    },
    metadata: {
      type: 'json',
      description: 'Operation metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/servicenow/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface ServiceNowRecord {
  sys_id: string
  number?: string
  [key: string]: any
}

export interface ServiceNowBaseParams {
  instanceUrl: string
  username: string
  password: string
  tableName: string
}

export interface ServiceNowCreateParams extends ServiceNowBaseParams {
  fields: Record<string, any>
}

export interface ServiceNowCreateResponse extends ToolResponse {
  output: {
    record: ServiceNowRecord
    metadata: {
      recordCount: 1
    }
  }
}

export interface ServiceNowReadParams extends ServiceNowBaseParams {
  sysId?: string
  number?: string
  query?: string
  limit?: number
  fields?: string
}

export interface ServiceNowReadResponse extends ToolResponse {
  output: {
    records: ServiceNowRecord[]
    metadata: {
      recordCount: number
    }
  }
}

export interface ServiceNowUpdateParams extends ServiceNowBaseParams {
  sysId: string
  fields: Record<string, any>
}

export interface ServiceNowUpdateResponse extends ToolResponse {
  output: {
    record: ServiceNowRecord
    metadata: {
      recordCount: 1
      updatedFields: string[]
    }
  }
}

export interface ServiceNowDeleteParams extends ServiceNowBaseParams {
  sysId: string
}

export interface ServiceNowDeleteResponse extends ToolResponse {
  output: {
    success: boolean
    metadata: {
      deletedSysId: string
    }
  }
}

export type ServiceNowResponse =
  | ServiceNowCreateResponse
  | ServiceNowReadResponse
  | ServiceNowUpdateResponse
  | ServiceNowDeleteResponse
```

--------------------------------------------------------------------------------

---[FILE: update_record.ts]---
Location: sim-main/apps/sim/tools/servicenow/update_record.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ServiceNowUpdateParams, ServiceNowUpdateResponse } from '@/tools/servicenow/types'
import { createBasicAuthHeader } from '@/tools/servicenow/utils'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('ServiceNowUpdateRecordTool')

export const updateRecordTool: ToolConfig<ServiceNowUpdateParams, ServiceNowUpdateResponse> = {
  id: 'servicenow_update_record',
  name: 'Update ServiceNow Record',
  description: 'Update an existing record in a ServiceNow table',
  version: '1.0.0',

  params: {
    instanceUrl: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ServiceNow instance URL (e.g., https://instance.service-now.com)',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ServiceNow username',
    },
    password: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ServiceNow password',
    },
    tableName: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Table name',
    },
    sysId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Record sys_id to update',
    },
    fields: {
      type: 'json',
      required: true,
      visibility: 'user-or-llm',
      description: 'Fields to update (JSON object)',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = params.instanceUrl.replace(/\/$/, '')
      if (!baseUrl) {
        throw new Error('ServiceNow instance URL is required')
      }
      return `${baseUrl}/api/now/table/${params.tableName}/${params.sysId}`
    },
    method: 'PATCH',
    headers: (params) => {
      if (!params.username || !params.password) {
        throw new Error('ServiceNow username and password are required')
      }
      return {
        Authorization: createBasicAuthHeader(params.username, params.password),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    },
    body: (params) => {
      if (!params.fields || typeof params.fields !== 'object') {
        throw new Error('Fields must be a JSON object')
      }
      return params.fields
    },
  },

  transformResponse: async (response: Response, params?: ServiceNowUpdateParams) => {
    try {
      const data = await response.json()

      if (!response.ok) {
        const error = data.error || data
        throw new Error(typeof error === 'string' ? error : error.message || JSON.stringify(error))
      }

      return {
        success: true,
        output: {
          record: data.result,
          metadata: {
            recordCount: 1,
            updatedFields: params ? Object.keys(params.fields || {}) : [],
          },
        },
      }
    } catch (error) {
      logger.error('ServiceNow update record - Error processing response:', { error })
      throw error
    }
  },

  outputs: {
    record: {
      type: 'json',
      description: 'Updated ServiceNow record',
    },
    metadata: {
      type: 'json',
      description: 'Operation metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/tools/servicenow/utils.ts

```typescript
/**
 * Creates a Basic Authentication header from username and password
 * @param username ServiceNow username
 * @param password ServiceNow password
 * @returns Base64 encoded Basic Auth header value
 */
export function createBasicAuthHeader(username: string, password: string): string {
  const credentials = Buffer.from(`${username}:${password}`).toString('base64')
  return `Basic ${credentials}`
}
```

--------------------------------------------------------------------------------

---[FILE: delete.ts]---
Location: sim-main/apps/sim/tools/sftp/delete.ts

```typescript
import type { SftpDeleteParams, SftpDeleteResult } from '@/tools/sftp/types'
import type { ToolConfig } from '@/tools/types'

export const sftpDeleteTool: ToolConfig<SftpDeleteParams, SftpDeleteResult> = {
  id: 'sftp_delete',
  name: 'SFTP Delete',
  description: 'Delete a file or directory on a remote SFTP server',
  version: '1.0.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SFTP server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'SFTP server port (default: 22)',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SFTP username',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for authentication (if not using private key)',
    },
    privateKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Private key for authentication (OpenSSH format)',
    },
    passphrase: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Passphrase for encrypted private key',
    },
    remotePath: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Path to the file or directory to delete',
    },
    recursive: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Delete directories recursively',
    },
  },

  request: {
    url: '/api/tools/sftp/delete',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port) || 22,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
      remotePath: params.remotePath,
      recursive: params.recursive || false,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        output: {
          success: false,
        },
        error: data.error || 'SFTP delete failed',
      }
    }

    return {
      success: true,
      output: {
        success: true,
        deletedPath: data.deletedPath,
        message: data.message,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the deletion was successful' },
    deletedPath: { type: 'string', description: 'Path that was deleted' },
    message: { type: 'string', description: 'Operation status message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: download.ts]---
Location: sim-main/apps/sim/tools/sftp/download.ts

```typescript
import type { SftpDownloadParams, SftpDownloadResult } from '@/tools/sftp/types'
import type { ToolConfig } from '@/tools/types'

export const sftpDownloadTool: ToolConfig<SftpDownloadParams, SftpDownloadResult> = {
  id: 'sftp_download',
  name: 'SFTP Download',
  description: 'Download a file from a remote SFTP server',
  version: '1.0.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SFTP server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'SFTP server port (default: 22)',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SFTP username',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for authentication (if not using private key)',
    },
    privateKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Private key for authentication (OpenSSH format)',
    },
    passphrase: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Passphrase for encrypted private key',
    },
    remotePath: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Path to the file on the remote server',
    },
    encoding: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Output encoding: utf-8 for text, base64 for binary (default: utf-8)',
    },
  },

  request: {
    url: '/api/tools/sftp/download',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port) || 22,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
      remotePath: params.remotePath,
      encoding: params.encoding || 'utf-8',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        output: {
          success: false,
        },
        error: data.error || 'SFTP download failed',
      }
    }

    return {
      success: true,
      output: {
        success: true,
        fileName: data.fileName,
        content: data.content,
        size: data.size,
        encoding: data.encoding,
        message: data.message,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the download was successful' },
    fileName: { type: 'string', description: 'Name of the downloaded file' },
    content: { type: 'string', description: 'File content (text or base64 encoded)' },
    size: { type: 'number', description: 'File size in bytes' },
    encoding: { type: 'string', description: 'Content encoding (utf-8 or base64)' },
    message: { type: 'string', description: 'Operation status message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/sftp/index.ts

```typescript
export { sftpDeleteTool } from './delete'
export { sftpDownloadTool } from './download'
export { sftpListTool } from './list'
export { sftpMkdirTool } from './mkdir'
export type {
  SftpConnectionConfig,
  SftpDeleteParams,
  SftpDeleteResult,
  SftpDownloadParams,
  SftpDownloadResult,
  SftpListParams,
  SftpListResult,
  SftpMkdirParams,
  SftpMkdirResult,
  SftpUploadParams,
  SftpUploadResult,
} from './types'
export { sftpUploadTool } from './upload'
```

--------------------------------------------------------------------------------

---[FILE: list.ts]---
Location: sim-main/apps/sim/tools/sftp/list.ts

```typescript
import type { SftpListParams, SftpListResult } from '@/tools/sftp/types'
import type { ToolConfig } from '@/tools/types'

export const sftpListTool: ToolConfig<SftpListParams, SftpListResult> = {
  id: 'sftp_list',
  name: 'SFTP List Directory',
  description: 'List files and directories on a remote SFTP server',
  version: '1.0.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SFTP server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'SFTP server port (default: 22)',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SFTP username',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for authentication (if not using private key)',
    },
    privateKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Private key for authentication (OpenSSH format)',
    },
    passphrase: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Passphrase for encrypted private key',
    },
    remotePath: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Directory path on the remote server',
    },
    detailed: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Include detailed file information (size, permissions, modified date)',
    },
  },

  request: {
    url: '/api/tools/sftp/list',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port) || 22,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
      remotePath: params.remotePath,
      detailed: params.detailed || false,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        output: {
          success: false,
        },
        error: data.error || 'SFTP list failed',
      }
    }

    return {
      success: true,
      output: {
        success: true,
        path: data.path,
        entries: data.entries,
        count: data.count,
        message: data.message,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the operation was successful' },
    path: { type: 'string', description: 'Directory path that was listed' },
    entries: {
      type: 'json',
      description: 'Array of directory entries with name, type, size, permissions, modifiedAt',
    },
    count: { type: 'number', description: 'Number of entries in the directory' },
    message: { type: 'string', description: 'Operation status message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: mkdir.ts]---
Location: sim-main/apps/sim/tools/sftp/mkdir.ts

```typescript
import type { SftpMkdirParams, SftpMkdirResult } from '@/tools/sftp/types'
import type { ToolConfig } from '@/tools/types'

export const sftpMkdirTool: ToolConfig<SftpMkdirParams, SftpMkdirResult> = {
  id: 'sftp_mkdir',
  name: 'SFTP Create Directory',
  description: 'Create a directory on a remote SFTP server',
  version: '1.0.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SFTP server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'SFTP server port (default: 22)',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SFTP username',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for authentication (if not using private key)',
    },
    privateKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Private key for authentication (OpenSSH format)',
    },
    passphrase: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Passphrase for encrypted private key',
    },
    remotePath: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Path for the new directory',
    },
    recursive: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Create parent directories if they do not exist',
    },
  },

  request: {
    url: '/api/tools/sftp/mkdir',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port) || 22,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
      remotePath: params.remotePath,
      recursive: params.recursive || false,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        output: {
          success: false,
        },
        error: data.error || 'SFTP mkdir failed',
      }
    }

    return {
      success: true,
      output: {
        success: true,
        createdPath: data.createdPath,
        message: data.message,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the directory was created successfully' },
    createdPath: { type: 'string', description: 'Path of the created directory' },
    message: { type: 'string', description: 'Operation status message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/sftp/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface SftpConnectionConfig {
  host: string
  port: number
  username: string
  password?: string
  privateKey?: string
  passphrase?: string
}

// Upload file params
export interface SftpUploadParams extends SftpConnectionConfig {
  remotePath: string
  files?: any[] // UserFile array from file-upload component
  fileContent?: string // Direct content for text files
  fileName?: string // File name when using direct content
  overwrite?: boolean
  permissions?: string
}

export interface SftpUploadResult extends ToolResponse {
  output: {
    success: boolean
    uploadedFiles?: Array<{
      name: string
      remotePath: string
      size: number
    }>
    message?: string
  }
}

// Download file params
export interface SftpDownloadParams extends SftpConnectionConfig {
  remotePath: string
  encoding?: 'utf-8' | 'base64'
}

export interface SftpDownloadResult extends ToolResponse {
  output: {
    success: boolean
    fileName?: string
    content?: string
    size?: number
    encoding?: string
    message?: string
  }
}

// List directory params
export interface SftpListParams extends SftpConnectionConfig {
  remotePath: string
  detailed?: boolean
}

export interface SftpListResult extends ToolResponse {
  output: {
    success: boolean
    path?: string
    entries?: Array<{
      name: string
      type: 'file' | 'directory' | 'symlink' | 'other'
      size?: number
      permissions?: string
      modifiedAt?: string
    }>
    count?: number
    message?: string
  }
}

// Delete file params
export interface SftpDeleteParams extends SftpConnectionConfig {
  remotePath: string
  recursive?: boolean
}

export interface SftpDeleteResult extends ToolResponse {
  output: {
    success: boolean
    deletedPath?: string
    message?: string
  }
}

// Mkdir params
export interface SftpMkdirParams extends SftpConnectionConfig {
  remotePath: string
  recursive?: boolean
}

export interface SftpMkdirResult extends ToolResponse {
  output: {
    success: boolean
    createdPath?: string
    message?: string
  }
}
```

--------------------------------------------------------------------------------

---[FILE: upload.ts]---
Location: sim-main/apps/sim/tools/sftp/upload.ts

```typescript
import type { SftpUploadParams, SftpUploadResult } from '@/tools/sftp/types'
import type { ToolConfig } from '@/tools/types'

export const sftpUploadTool: ToolConfig<SftpUploadParams, SftpUploadResult> = {
  id: 'sftp_upload',
  name: 'SFTP Upload',
  description: 'Upload files to a remote SFTP server',
  version: '1.0.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SFTP server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'SFTP server port (default: 22)',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SFTP username',
    },
    password: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Password for authentication (if not using private key)',
    },
    privateKey: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Private key for authentication (OpenSSH format)',
    },
    passphrase: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Passphrase for encrypted private key',
    },
    remotePath: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Destination directory on the remote server',
    },
    files: {
      type: 'file[]',
      required: false,
      visibility: 'user-only',
      description: 'Files to upload',
    },
    fileContent: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Direct file content to upload (for text files)',
    },
    fileName: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'File name when using direct content',
    },
    overwrite: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Whether to overwrite existing files (default: true)',
    },
    permissions: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'File permissions (e.g., 0644)',
    },
  },

  request: {
    url: '/api/tools/sftp/upload',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      host: params.host,
      port: Number(params.port) || 22,
      username: params.username,
      password: params.password,
      privateKey: params.privateKey,
      passphrase: params.passphrase,
      remotePath: params.remotePath,
      files: params.files,
      fileContent: params.fileContent,
      fileName: params.fileName,
      overwrite: params.overwrite !== false,
      permissions: params.permissions,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        output: {
          success: false,
        },
        error: data.error || 'SFTP upload failed',
      }
    }

    return {
      success: true,
      output: {
        success: true,
        uploadedFiles: data.uploadedFiles,
        message: data.message,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the upload was successful' },
    uploadedFiles: {
      type: 'json',
      description: 'Array of uploaded file details (name, remotePath, size)',
    },
    message: { type: 'string', description: 'Operation status message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: add_list_items.ts]---
Location: sim-main/apps/sim/tools/sharepoint/add_list_items.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { SharepointAddListItemResponse, SharepointToolParams } from '@/tools/sharepoint/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('SharePointAddListItem')

export const addListItemTool: ToolConfig<SharepointToolParams, SharepointAddListItemResponse> = {
  id: 'sharepoint_add_list_items',
  name: 'Add SharePoint List Item',
  description: 'Add a new item to a SharePoint list',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'sharepoint',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the SharePoint API',
    },
    siteSelector: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Select the SharePoint site',
    },
    siteId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The ID of the SharePoint site (internal use)',
    },
    listId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the list to add the item to',
    },
    listItemFields: {
      type: 'object',
      required: true,
      visibility: 'user-only',
      description: 'Field values for the new list item',
    },
  },

  request: {
    url: (params) => {
      const siteId = params.siteId || params.siteSelector || 'root'
      if (!params.listId) {
        throw new Error('listId must be provided')
      }
      const listSegment = params.listId
      return `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listSegment}/items`
    },
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
    body: (params) => {
      if (!params.listItemFields || Object.keys(params.listItemFields).length === 0) {
        throw new Error('listItemFields must not be empty')
      }

      const providedFields =
        typeof params.listItemFields === 'object' &&
        params.listItemFields !== null &&
        'fields' in (params.listItemFields as Record<string, unknown>) &&
        Object.keys(params.listItemFields as Record<string, unknown>).length === 1
          ? ((params.listItemFields as any).fields as Record<string, unknown>)
          : (params.listItemFields as Record<string, unknown>)

      if (!providedFields || Object.keys(providedFields).length === 0) {
        throw new Error('No fields provided to create the SharePoint list item')
      }

      const readOnlyFields = new Set<string>([
        'Id',
        'id',
        'UniqueId',
        'GUID',
        'ContentTypeId',
        'Created',
        'Modified',
        'Author',
        'Editor',
        'CreatedBy',
        'ModifiedBy',
        'AuthorId',
        'EditorId',
        '_UIVersionString',
        'Attachments',
        'FileRef',
        'FileDirRef',
        'FileLeafRef',
      ])

      const entries = Object.entries(providedFields)
      const creatableEntries = entries.filter(([key]) => !readOnlyFields.has(key))

      if (creatableEntries.length !== entries.length) {
        const removed = entries.filter(([key]) => readOnlyFields.has(key)).map(([key]) => key)
        logger.warn('Removed read-only SharePoint fields from create', {
          removed,
        })
      }

      if (creatableEntries.length === 0) {
        const requestedKeys = Object.keys(providedFields)
        throw new Error(
          `All provided fields are read-only and cannot be set: ${requestedKeys.join(', ')}`
        )
      }

      const sanitizedFields = Object.fromEntries(creatableEntries)

      logger.info('Creating SharePoint list item', {
        listId: params.listId,
        fieldsKeys: Object.keys(sanitizedFields),
      })

      return {
        fields: sanitizedFields,
      }
    },
  },

  transformResponse: async (response: Response, params) => {
    let data: any
    try {
      data = await response.json()
    } catch {
      data = undefined
    }

    const itemId: string | undefined = data?.id
    const fields: Record<string, unknown> | undefined = data?.fields || params?.listItemFields

    return {
      success: true,
      output: {
        item: {
          id: itemId || 'unknown',
          fields,
        },
      },
    }
  },

  outputs: {
    item: {
      type: 'object',
      description: 'Created SharePoint list item',
      properties: {
        id: { type: 'string', description: 'Item ID' },
        fields: { type: 'object', description: 'Field values for the new item' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_list.ts]---
Location: sim-main/apps/sim/tools/sharepoint/create_list.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  SharepointCreateListResponse,
  SharepointList,
  SharepointToolParams,
} from '@/tools/sharepoint/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('SharePointCreateList')

export const createListTool: ToolConfig<SharepointToolParams, SharepointCreateListResponse> = {
  id: 'sharepoint_create_list',
  name: 'Create SharePoint List',
  description: 'Create a new list in a SharePoint site',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'sharepoint',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the SharePoint API',
    },
    siteId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The ID of the SharePoint site (internal use)',
    },
    siteSelector: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Select the SharePoint site',
    },
    listDisplayName: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Display name of the list to create',
    },
    listDescription: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Description of the list',
    },
    listTemplate: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: "List template name (e.g., 'genericList')",
    },
    pageContent: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Optional JSON of columns. Either a top-level array of column definitions or an object with { columns: [...] }.',
    },
  },

  request: {
    url: (params) => {
      const siteId = params.siteSelector || params.siteId || 'root'
      return `https://graph.microsoft.com/v1.0/sites/${siteId}/lists`
    },
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
    body: (params) => {
      if (!params.listDisplayName) {
        throw new Error('listDisplayName is required')
      }

      // Derive columns from pageContent JSON (object or string) or top-level array
      let columns: unknown[] | undefined
      if (params.pageContent) {
        if (typeof params.pageContent === 'string') {
          try {
            const parsed = JSON.parse(params.pageContent)
            if (Array.isArray(parsed)) columns = parsed
            else if (parsed && Array.isArray((parsed as any).columns))
              columns = (parsed as any).columns
          } catch (error) {
            logger.warn('Invalid JSON in pageContent for create list; ignoring', {
              error: error instanceof Error ? error.message : String(error),
            })
          }
        } else if (typeof params.pageContent === 'object') {
          const pc: any = params.pageContent
          if (Array.isArray(pc)) columns = pc
          else if (pc && Array.isArray(pc.columns)) columns = pc.columns
        }
      }

      const payload: any = {
        displayName: params.listDisplayName,
        description: params.listDescription,
        list: { template: params.listTemplate || 'genericList' },
      }
      if (columns && columns.length > 0) payload.columns = columns

      logger.info('Creating SharePoint list', {
        displayName: payload.displayName,
        template: payload.list.template,
        hasDescription: !!payload.description,
      })

      return payload
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    const list: SharepointList = {
      id: data.id,
      displayName: data.displayName ?? data.name,
      name: data.name,
      webUrl: data.webUrl,
      createdDateTime: data.createdDateTime,
      lastModifiedDateTime: data.lastModifiedDateTime,
      list: data.list,
    }

    logger.info('SharePoint list created successfully', {
      listId: list.id,
      displayName: list.displayName,
    })

    return {
      success: true,
      output: { list },
    }
  },

  outputs: {
    list: {
      type: 'object',
      description: 'Created SharePoint list information',
      properties: {
        id: { type: 'string', description: 'The unique ID of the list' },
        displayName: { type: 'string', description: 'The display name of the list' },
        name: { type: 'string', description: 'The internal name of the list' },
        webUrl: { type: 'string', description: 'The web URL of the list' },
        createdDateTime: { type: 'string', description: 'When the list was created' },
        lastModifiedDateTime: {
          type: 'string',
          description: 'When the list was last modified',
        },
        list: { type: 'object', description: 'List properties (e.g., template)' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
