---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 761
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 761 of 933)

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

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/ssh/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

// Base SSH connection configuration
export interface SSHConnectionConfig {
  host: string
  port: number
  username: string
  password?: string
  privateKey?: string
  passphrase?: string
  timeout?: number
  keepaliveInterval?: number
  readyTimeout?: number
}

// Execute Command parameters
export interface SSHExecuteCommandParams extends SSHConnectionConfig {
  command: string
  workingDirectory?: string
}

// Execute Script parameters
export interface SSHExecuteScriptParams extends SSHConnectionConfig {
  script: string
  interpreter?: string
  workingDirectory?: string
}

// Check Command Exists parameters
export interface SSHCheckCommandExistsParams extends SSHConnectionConfig {
  commandName: string
}

// Upload File parameters
export interface SSHUploadFileParams extends SSHConnectionConfig {
  fileContent: string
  fileName: string
  remotePath: string
  permissions?: string
  overwrite?: boolean
}

// Upload Directory parameters
export interface SSHUploadDirectoryParams extends SSHConnectionConfig {
  localDirectory: string
  remoteDirectory: string
  recursive?: boolean
  concurrency?: number
}

// Download File parameters
export interface SSHDownloadFileParams extends SSHConnectionConfig {
  remotePath: string
}

// Download Directory parameters
export interface SSHDownloadDirectoryParams extends SSHConnectionConfig {
  remotePath: string
  recursive?: boolean
}

// List Directory parameters
export interface SSHListDirectoryParams extends SSHConnectionConfig {
  path: string
  detailed?: boolean
  recursive?: boolean
}

// Check File Exists parameters
export interface SSHCheckFileExistsParams extends SSHConnectionConfig {
  path: string
  type?: 'file' | 'directory' | 'any'
}

// Create Directory parameters
export interface SSHCreateDirectoryParams extends SSHConnectionConfig {
  path: string
  recursive?: boolean
  permissions?: string
}

// Delete File parameters
export interface SSHDeleteFileParams extends SSHConnectionConfig {
  path: string
  recursive?: boolean
  force?: boolean
}

// Move/Rename parameters
export interface SSHMoveRenameParams extends SSHConnectionConfig {
  sourcePath: string
  destinationPath: string
  overwrite?: boolean
}

// Get System Info parameters
export interface SSHGetSystemInfoParams extends SSHConnectionConfig {}

// Read File Content parameters
export interface SSHReadFileContentParams extends SSHConnectionConfig {
  path: string
  encoding?: string
  maxSize?: number
}

// Write File Content parameters
export interface SSHWriteFileContentParams extends SSHConnectionConfig {
  path: string
  content: string
  mode?: 'overwrite' | 'append' | 'create'
  permissions?: string
}

// File info interface
export interface SSHFileInfo {
  name: string
  type: 'file' | 'directory' | 'symlink' | 'other'
  size: number
  permissions: string
  modified: string
  owner?: string
  group?: string
}

// System info interface
export interface SSHSystemInfo {
  hostname: string
  os: string
  architecture: string
  uptime: number
  memory: {
    total: number
    free: number
    used: number
  }
  diskSpace: {
    total: number
    free: number
    used: number
  }
}

export interface SSHResponse extends ToolResponse {
  output: {
    stdout?: string
    stderr?: string
    exitCode?: number
    success?: boolean

    uploaded?: boolean
    downloaded?: boolean
    fileContent?: string
    fileName?: string
    remotePath?: string
    localPath?: string
    size?: number

    entries?: SSHFileInfo[]
    totalFiles?: number
    totalDirectories?: number

    exists?: boolean
    type?: 'file' | 'directory' | 'symlink' | 'not_found'
    permissions?: string
    modified?: string

    hostname?: string
    os?: string
    architecture?: string
    uptime?: number
    memory?: {
      total: number
      free: number
      used: number
    }
    diskSpace?: {
      total: number
      free: number
      used: number
    }

    content?: string
    lines?: number

    created?: boolean
    deleted?: boolean
    written?: boolean
    moved?: boolean
    alreadyExists?: boolean

    commandExists?: boolean
    commandPath?: string
    version?: string

    scriptPath?: string

    message?: string
    metadata?: Record<string, unknown>
  }
}

// Union type for all SSH parameters
export type SSHParams =
  | SSHExecuteCommandParams
  | SSHExecuteScriptParams
  | SSHCheckCommandExistsParams
  | SSHUploadFileParams
  | SSHUploadDirectoryParams
  | SSHDownloadFileParams
  | SSHDownloadDirectoryParams
  | SSHListDirectoryParams
  | SSHCheckFileExistsParams
  | SSHCreateDirectoryParams
  | SSHDeleteFileParams
  | SSHMoveRenameParams
  | SSHGetSystemInfoParams
  | SSHReadFileContentParams
  | SSHWriteFileContentParams
```

--------------------------------------------------------------------------------

---[FILE: upload_file.ts]---
Location: sim-main/apps/sim/tools/ssh/upload_file.ts

```typescript
import type { SSHResponse, SSHUploadFileParams } from '@/tools/ssh/types'
import type { ToolConfig } from '@/tools/types'

export const uploadFileTool: ToolConfig<SSHUploadFileParams, SSHResponse> = {
  id: 'ssh_upload_file',
  name: 'SSH Upload File',
  description: 'Upload a file to a remote SSH server',
  version: '1.0.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'SSH server port (default: 22)',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH username',
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
    fileContent: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'File content to upload (base64 encoded for binary files)',
    },
    fileName: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Name of the file being uploaded',
    },
    remotePath: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Destination path on the remote server',
    },
    permissions: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'File permissions (e.g., 0644)',
    },
    overwrite: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Whether to overwrite existing files (default: true)',
    },
  },

  request: {
    url: '/api/tools/ssh/upload-file',
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
      fileContent: params.fileContent,
      fileName: params.fileName,
      remotePath: params.remotePath,
      permissions: params.permissions,
      overwrite: params.overwrite !== false,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'SSH file upload failed')
    }

    return {
      success: true,
      output: {
        uploaded: true,
        remotePath: data.remotePath,
        size: data.size,
        message: data.message,
      },
    }
  },

  outputs: {
    uploaded: { type: 'boolean', description: 'Whether the file was uploaded successfully' },
    remotePath: { type: 'string', description: 'Final path on the remote server' },
    size: { type: 'number', description: 'File size in bytes' },
    message: { type: 'string', description: 'Operation status message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: write_file_content.ts]---
Location: sim-main/apps/sim/tools/ssh/write_file_content.ts

```typescript
import type { SSHResponse, SSHWriteFileContentParams } from '@/tools/ssh/types'
import type { ToolConfig } from '@/tools/types'

export const writeFileContentTool: ToolConfig<SSHWriteFileContentParams, SSHResponse> = {
  id: 'ssh_write_file_content',
  name: 'SSH Write File Content',
  description: 'Write or append content to a remote file',
  version: '1.0.0',

  params: {
    host: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH server hostname or IP address',
    },
    port: {
      type: 'number',
      required: true,
      visibility: 'user-only',
      description: 'SSH server port (default: 22)',
    },
    username: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'SSH username',
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
    path: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Remote file path to write to',
    },
    content: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Content to write to the file',
    },
    mode: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Write mode: overwrite, append, or create (default: overwrite)',
    },
    permissions: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'File permissions (e.g., 0644)',
    },
  },

  request: {
    url: '/api/tools/ssh/write-file-content',
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
      path: params.path,
      content: params.content,
      mode: params.mode || 'overwrite',
      permissions: params.permissions,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'SSH write file content failed')
    }

    return {
      success: true,
      output: {
        written: data.written ?? true,
        remotePath: data.path,
        size: data.size,
        message: data.message,
      },
    }
  },

  outputs: {
    written: { type: 'boolean', description: 'Whether the file was written successfully' },
    remotePath: { type: 'string', description: 'File path' },
    size: { type: 'number', description: 'Final file size in bytes' },
    message: { type: 'string', description: 'Operation status message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: agent.ts]---
Location: sim-main/apps/sim/tools/stagehand/agent.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { StagehandAgentParams, StagehandAgentResponse } from '@/tools/stagehand/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('StagehandAgentTool')

export const agentTool: ToolConfig<StagehandAgentParams, StagehandAgentResponse> = {
  id: 'stagehand_agent',
  name: 'Stagehand Agent',
  description: 'Run an autonomous web agent to complete tasks and extract structured data',
  version: '1.0.0',

  params: {
    startUrl: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'URL of the webpage to start the agent on',
    },
    task: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The task to complete or goal to achieve on the website',
    },
    variables: {
      type: 'json',
      required: false,
      visibility: 'user-only',
      description:
        'Optional variables to substitute in the task (format: {key: value}). Reference in task using %key%',
    },
    provider: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'AI provider to use: openai or anthropic',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'API key for the selected provider',
    },
    outputSchema: {
      type: 'json',
      required: false,
      visibility: 'user-only',
      description: 'Optional JSON schema defining the structure of data the agent should return',
    },
  },

  request: {
    url: '/api/tools/stagehand/agent',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      let startUrl = params.startUrl
      if (startUrl && !startUrl.match(/^https?:\/\//i)) {
        startUrl = `https://${startUrl.trim()}`
        logger.info(`Normalized URL from ${params.startUrl} to ${startUrl}`)
      }

      return {
        task: params.task,
        startUrl: startUrl,
        outputSchema: params.outputSchema,
        variables: params.variables,
        provider: params.provider || 'openai',
        apiKey: params.apiKey,
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        agentResult: data.agentResult,
        structuredOutput: data.structuredOutput || {},
      },
    }
  },

  outputs: {
    agentResult: {
      type: 'object',
      description: 'Result from the Stagehand agent execution',
      properties: {
        success: { type: 'boolean', description: 'Whether the agent task completed successfully' },
        completed: { type: 'boolean', description: 'Whether the task was fully completed' },
        message: { type: 'string', description: 'Status message or final result' },
        actions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', description: 'Type of action performed' },
              params: { type: 'object', description: 'Parameters used for the action' },
              result: { type: 'object', description: 'Result of the action' },
            },
          },
          description: 'List of actions performed by the agent',
        },
      },
    },
    structuredOutput: {
      type: 'object',
      description: 'Extracted data matching the provided output schema',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: extract.ts]---
Location: sim-main/apps/sim/tools/stagehand/extract.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { StagehandExtractParams, StagehandExtractResponse } from '@/tools/stagehand/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('StagehandExtractTool')

export const extractTool: ToolConfig<StagehandExtractParams, StagehandExtractResponse> = {
  id: 'stagehand_extract',
  name: 'Stagehand Extract',
  description: 'Extract structured data from a webpage using Stagehand',
  version: '1.0.0',

  params: {
    url: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'URL of the webpage to extract data from',
    },
    instruction: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Instructions for extraction',
    },
    provider: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'AI provider to use: openai or anthropic',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'API key for the selected provider',
    },
    schema: {
      type: 'json',
      required: true,
      visibility: 'user-only',
      description: 'JSON schema defining the structure of the data to extract',
    },
  },

  request: {
    url: '/api/tools/stagehand/extract',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      instruction: params.instruction,
      schema: params.schema,
      provider: params.provider || 'openai',
      apiKey: params.apiKey,
      url: params.url,
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: data.data || {},
    }
  },

  outputs: {
    data: {
      type: 'object',
      description: 'Extracted structured data matching the provided schema',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/stagehand/index.ts

```typescript
import { agentTool } from '@/tools/stagehand/agent'
import { extractTool } from '@/tools/stagehand/extract'

export const stagehandExtractTool = extractTool
export const stagehandAgentTool = agentTool
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/stagehand/types.ts
Signals: Zod

```typescript
import { z } from 'zod'
import type { ToolResponse } from '@/tools/types'

export interface StagehandExtractParams {
  instruction: string
  schema: Record<string, any>
  provider?: 'openai' | 'anthropic'
  apiKey: string
  url: string
}

export interface StagehandExtractResponse extends ToolResponse {
  output: Record<string, any>
}

export interface StagehandAgentParams {
  task: string
  startUrl: string
  outputSchema?: Record<string, any>
  variables?: Record<string, string>
  provider?: 'openai' | 'anthropic'
  apiKey: string
  options?: {
    useTextExtract?: boolean
    selector?: string
  }
}

export interface StagehandAgentAction {
  type: string
  params: Record<string, any>
  result: Record<string, any>
}

export interface StagehandAgentResult {
  success: boolean
  completed: boolean
  message: string
  actions: StagehandAgentAction[]
}

export interface StagehandAgentResponse extends ToolResponse {
  output: {
    agentResult: StagehandAgentResult
    structuredOutput?: Record<string, any>
  }
}

export function jsonSchemaToZod(jsonSchema: Record<string, any>): z.ZodTypeAny {
  if (!jsonSchema) {
    throw new Error('Invalid schema: Schema is required')
  }

  // Handle different schema types
  switch (jsonSchema.type) {
    case 'object': {
      if (!jsonSchema.properties) {
        return z.object({})
      }

      const shape: Record<string, z.ZodTypeAny> = {}
      const requiredFields = new Set(jsonSchema.required || [])

      for (const [key, propSchema] of Object.entries(jsonSchema.properties)) {
        // Create the base schema for this property
        let fieldSchema = jsonSchemaToZod(propSchema as Record<string, any>)

        // Make it optional if not in required fields
        if (!requiredFields.has(key)) {
          fieldSchema = fieldSchema.optional()
        }

        // Add description if available
        if ((propSchema as Record<string, any>).description) {
          fieldSchema = fieldSchema.describe((propSchema as Record<string, any>).description)
        }

        shape[key] = fieldSchema
      }

      return z.object(shape)
    }

    case 'array':
      if (!jsonSchema.items) {
        return z.array(z.any())
      }
      return z.array(jsonSchemaToZod(jsonSchema.items as Record<string, any>))

    case 'string':
      return z.string()

    case 'number':
      return z.number()

    case 'boolean':
      return z.boolean()

    case 'null':
      return z.null()

    default:
      return z.any()
  }
}
```

--------------------------------------------------------------------------------

---[FILE: cancel_payment_intent.ts]---
Location: sim-main/apps/sim/tools/stripe/cancel_payment_intent.ts

```typescript
import type { CancelPaymentIntentParams, PaymentIntentResponse } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeCancelPaymentIntentTool: ToolConfig<
  CancelPaymentIntentParams,
  PaymentIntentResponse
> = {
  id: 'stripe_cancel_payment_intent',
  name: 'Stripe Cancel Payment Intent',
  description: 'Cancel a Payment Intent',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Payment Intent ID (e.g., pi_1234567890)',
    },
    cancellation_reason: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Reason for cancellation (duplicate, fraudulent, requested_by_customer, abandoned)',
    },
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/payment_intents/${params.id}/cancel`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: (params) => {
      const formData = new URLSearchParams()
      if (params.cancellation_reason) {
        formData.append('cancellation_reason', params.cancellation_reason)
      }
      return { body: formData.toString() }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        payment_intent: data,
        metadata: {
          id: data.id,
          status: data.status,
          amount: data.amount,
          currency: data.currency,
        },
      },
    }
  },

  outputs: {
    payment_intent: {
      type: 'json',
      description: 'The canceled Payment Intent object',
    },
    metadata: {
      type: 'json',
      description: 'Payment Intent metadata including ID, status, amount, and currency',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: cancel_subscription.ts]---
Location: sim-main/apps/sim/tools/stripe/cancel_subscription.ts

```typescript
import type { CancelSubscriptionParams, SubscriptionResponse } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeCancelSubscriptionTool: ToolConfig<
  CancelSubscriptionParams,
  SubscriptionResponse
> = {
  id: 'stripe_cancel_subscription',
  name: 'Stripe Cancel Subscription',
  description: 'Cancel a subscription',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Subscription ID (e.g., sub_1234567890)',
    },
    prorate: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether to prorate the cancellation',
    },
    invoice_now: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether to invoice immediately',
    },
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/subscriptions/${params.id}`,
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: (params) => {
      const formData = new URLSearchParams()

      if (params.prorate !== undefined) {
        formData.append('prorate', String(params.prorate))
      }
      if (params.invoice_now !== undefined) {
        formData.append('invoice_now', String(params.invoice_now))
      }

      return { body: formData.toString() }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        subscription: data,
        metadata: {
          id: data.id,
          status: data.status,
          customer: data.customer,
        },
      },
    }
  },

  outputs: {
    subscription: {
      type: 'json',
      description: 'The canceled subscription object',
    },
    metadata: {
      type: 'json',
      description: 'Subscription metadata including ID, status, and customer',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: capture_charge.ts]---
Location: sim-main/apps/sim/tools/stripe/capture_charge.ts

```typescript
import type { CaptureChargeParams, ChargeResponse } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeCaptureChargeTool: ToolConfig<CaptureChargeParams, ChargeResponse> = {
  id: 'stripe_capture_charge',
  name: 'Stripe Capture Charge',
  description: 'Capture an uncaptured charge',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Charge ID (e.g., ch_1234567890)',
    },
    amount: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Amount to capture in cents (defaults to full amount)',
    },
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/charges/${params.id}/capture`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: (params) => {
      const formData = new URLSearchParams()
      if (params.amount) {
        formData.append('amount', Number(params.amount).toString())
      }
      return { body: formData.toString() }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        charge: data,
        metadata: {
          id: data.id,
          status: data.status,
          amount: data.amount,
          currency: data.currency,
          paid: data.paid,
        },
      },
    }
  },

  outputs: {
    charge: {
      type: 'json',
      description: 'The captured Charge object',
    },
    metadata: {
      type: 'json',
      description: 'Charge metadata including ID, status, amount, currency, and paid status',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: capture_payment_intent.ts]---
Location: sim-main/apps/sim/tools/stripe/capture_payment_intent.ts

```typescript
import type { CapturePaymentIntentParams, PaymentIntentResponse } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeCapturePaymentIntentTool: ToolConfig<
  CapturePaymentIntentParams,
  PaymentIntentResponse
> = {
  id: 'stripe_capture_payment_intent',
  name: 'Stripe Capture Payment Intent',
  description: 'Capture an authorized Payment Intent',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Payment Intent ID (e.g., pi_1234567890)',
    },
    amount_to_capture: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Amount to capture in cents (defaults to full amount)',
    },
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/payment_intents/${params.id}/capture`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: (params) => {
      const formData = new URLSearchParams()
      if (params.amount_to_capture) {
        formData.append('amount_to_capture', Number(params.amount_to_capture).toString())
      }
      return { body: formData.toString() }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        payment_intent: data,
        metadata: {
          id: data.id,
          status: data.status,
          amount: data.amount,
          currency: data.currency,
        },
      },
    }
  },

  outputs: {
    payment_intent: {
      type: 'json',
      description: 'The captured Payment Intent object',
    },
    metadata: {
      type: 'json',
      description: 'Payment Intent metadata including ID, status, amount, and currency',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: confirm_payment_intent.ts]---
Location: sim-main/apps/sim/tools/stripe/confirm_payment_intent.ts

```typescript
import type { ConfirmPaymentIntentParams, PaymentIntentResponse } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeConfirmPaymentIntentTool: ToolConfig<
  ConfirmPaymentIntentParams,
  PaymentIntentResponse
> = {
  id: 'stripe_confirm_payment_intent',
  name: 'Stripe Confirm Payment Intent',
  description: 'Confirm a Payment Intent to complete the payment',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Payment Intent ID (e.g., pi_1234567890)',
    },
    payment_method: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Payment method ID to confirm with',
    },
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/payment_intents/${params.id}/confirm`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: (params) => {
      const formData = new URLSearchParams()
      if (params.payment_method) formData.append('payment_method', params.payment_method)
      return { body: formData.toString() }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        payment_intent: data,
        metadata: {
          id: data.id,
          status: data.status,
          amount: data.amount,
          currency: data.currency,
        },
      },
    }
  },

  outputs: {
    payment_intent: {
      type: 'json',
      description: 'The confirmed Payment Intent object',
    },
    metadata: {
      type: 'json',
      description: 'Payment Intent metadata including ID, status, amount, and currency',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_charge.ts]---
Location: sim-main/apps/sim/tools/stripe/create_charge.ts

```typescript
import type { ChargeResponse, CreateChargeParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeCreateChargeTool: ToolConfig<CreateChargeParams, ChargeResponse> = {
  id: 'stripe_create_charge',
  name: 'Stripe Create Charge',
  description: 'Create a new charge to process a payment',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    amount: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'Amount in cents (e.g., 2000 for $20.00)',
    },
    currency: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Three-letter ISO currency code (e.g., usd, eur)',
    },
    customer: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Customer ID to associate with this charge',
    },
    source: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Payment source ID (e.g., card token or saved card ID)',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Description of the charge',
    },
    metadata: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Set of key-value pairs for storing additional information',
    },
    capture: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether to immediately capture the charge (defaults to true)',
    },
  },

  request: {
    url: () => 'https://api.stripe.com/v1/charges',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: (params) => {
      const formData = new URLSearchParams()
      formData.append('amount', Number(params.amount).toString())
      formData.append('currency', params.currency)

      if (params.customer) formData.append('customer', params.customer)
      if (params.source) formData.append('source', params.source)
      if (params.description) formData.append('description', params.description)
      if (params.capture !== undefined) formData.append('capture', String(params.capture))

      if (params.metadata) {
        Object.entries(params.metadata).forEach(([key, value]) => {
          formData.append(`metadata[${key}]`, String(value))
        })
      }

      return { body: formData.toString() }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        charge: data,
        metadata: {
          id: data.id,
          status: data.status,
          amount: data.amount,
          currency: data.currency,
          paid: data.paid,
        },
      },
    }
  },

  outputs: {
    charge: {
      type: 'json',
      description: 'The created Charge object',
    },
    metadata: {
      type: 'json',
      description: 'Charge metadata including ID, status, amount, currency, and paid status',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_customer.ts]---
Location: sim-main/apps/sim/tools/stripe/create_customer.ts

```typescript
import type { CreateCustomerParams, CustomerResponse } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeCreateCustomerTool: ToolConfig<CreateCustomerParams, CustomerResponse> = {
  id: 'stripe_create_customer',
  name: 'Stripe Create Customer',
  description: 'Create a new customer object',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    email: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Customer email address',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Customer full name',
    },
    phone: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Customer phone number',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Description of the customer',
    },
    address: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Customer address object',
    },
    metadata: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Set of key-value pairs',
    },
    payment_method: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Payment method ID to attach',
    },
  },

  request: {
    url: () => 'https://api.stripe.com/v1/customers',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: (params) => {
      const formData = new URLSearchParams()

      if (params.email) formData.append('email', params.email)
      if (params.name) formData.append('name', params.name)
      if (params.phone) formData.append('phone', params.phone)
      if (params.description) formData.append('description', params.description)
      if (params.payment_method) formData.append('payment_method', params.payment_method)

      if (params.address) {
        Object.entries(params.address).forEach(([key, value]) => {
          if (value) formData.append(`address[${key}]`, String(value))
        })
      }

      if (params.metadata) {
        Object.entries(params.metadata).forEach(([key, value]) => {
          formData.append(`metadata[${key}]`, String(value))
        })
      }

      return { body: formData.toString() }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        customer: data,
        metadata: {
          id: data.id,
          email: data.email,
          name: data.name,
        },
      },
    }
  },

  outputs: {
    customer: {
      type: 'json',
      description: 'The created customer object',
    },
    metadata: {
      type: 'json',
      description: 'Customer metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

````
