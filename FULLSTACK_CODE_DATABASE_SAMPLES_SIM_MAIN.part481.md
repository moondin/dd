---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 481
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 481 of 933)

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

---[FILE: response.ts]---
Location: sim-main/apps/sim/blocks/blocks/response.ts

```typescript
import { ResponseIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import type { ResponseBlockOutput } from '@/tools/response/types'

export const ResponseBlock: BlockConfig<ResponseBlockOutput> = {
  type: 'response',
  name: 'Response',
  description: 'Send structured API response',
  longDescription:
    'Integrate Response into the workflow. Can send build or edit structured responses into a final workflow response.',
  docsLink: 'https://docs.sim.ai/blocks/response',
  bestPractices: `
  - Only use this if the trigger block is the API Trigger.
  - Prefer the builder mode over the editor mode.
  - This is usually used as the last block in the workflow.
  `,
  category: 'blocks',
  bgColor: '#2F55FF',
  icon: ResponseIcon,
  subBlocks: [
    {
      id: 'dataMode',
      title: 'Response Data Mode',
      type: 'dropdown',
      options: [
        { label: 'Builder', id: 'structured' },
        { label: 'Editor', id: 'json' },
      ],
      value: () => 'structured',
      description: 'Choose how to define your response data structure',
    },
    {
      id: 'builderData',
      title: 'Response Structure',
      type: 'response-format',
      condition: { field: 'dataMode', value: 'structured' },
      description:
        'Define the structure of your response data. Use <variable.name> in field names to reference workflow variables.',
    },
    {
      id: 'data',
      title: 'Response Data',
      type: 'code',
      placeholder: '{\n  "message": "Hello world",\n  "userId": "<variable.userId>"\n}',
      language: 'json',
      condition: { field: 'dataMode', value: 'json' },
      description:
        'Data that will be sent as the response body on API calls. Use <variable.name> to reference workflow variables.',
      wandConfig: {
        enabled: true,
        maintainHistory: true,
        prompt: `You are an expert JSON programmer.
Generate ONLY the raw JSON object based on the user's request.
The output MUST be a single, valid JSON object, starting with { and ending with }.

Current response: {context}

Do not include any explanations, markdown formatting, or other text outside the JSON object.

You have access to the following variables you can use to generate the JSON body:
- 'params' (object): Contains input parameters derived from the JSON schema. Access these directly using the parameter name wrapped in angle brackets, e.g., '<paramName>'. Do NOT use 'params.paramName'.
- 'environmentVariables' (object): Contains environment variables. Reference these using the double curly brace syntax: '{{ENV_VAR_NAME}}'. Do NOT use 'environmentVariables.VAR_NAME' or env.

Example:
{
  "name": "<block.agent.response.content>",
  "age": <block.function.output.age>,
  "success": true
}`,
        placeholder: 'Describe the API response structure you need...',
        generationType: 'json-object',
      },
    },
    {
      id: 'status',
      title: 'Status Code',
      type: 'short-input',
      placeholder: '200',
      description: 'HTTP status code (default: 200)',
    },
    {
      id: 'headers',
      title: 'Response Headers',
      type: 'table',
      columns: ['Key', 'Value'],
      description: 'Additional HTTP headers to include in the response',
    },
  ],
  tools: { access: [] },
  inputs: {
    dataMode: {
      type: 'string',
      description: 'Response data definition mode',
    },
    builderData: {
      type: 'json',
      description: 'Structured response data',
    },
    data: {
      type: 'json',
      description: 'JSON response body',
    },
    status: {
      type: 'number',
      description: 'HTTP status code',
    },
    headers: {
      type: 'json',
      description: 'Response headers',
    },
  },
  outputs: {
    data: { type: 'json', description: 'Response data' },
    status: { type: 'number', description: 'HTTP status code' },
    headers: { type: 'json', description: 'Response headers' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: router.ts]---
Location: sim-main/apps/sim/blocks/blocks/router.ts

```typescript
import { ConnectIcon } from '@/components/icons'
import { isHosted } from '@/lib/core/config/feature-flags'
import { AuthMode, type BlockConfig } from '@/blocks/types'
import type { ProviderId } from '@/providers/types'
import {
  getAllModelProviders,
  getHostedModels,
  getProviderIcon,
  providers,
} from '@/providers/utils'
import { useProvidersStore } from '@/stores/providers/store'
import type { ToolResponse } from '@/tools/types'

const getCurrentOllamaModels = () => {
  return useProvidersStore.getState().providers.ollama.models
}

interface RouterResponse extends ToolResponse {
  output: {
    prompt: string
    model: string
    tokens?: {
      prompt?: number
      completion?: number
      total?: number
    }
    cost?: {
      input: number
      output: number
      total: number
    }
    selectedPath: {
      blockId: string
      blockType: string
      blockTitle: string
    }
  }
}

interface TargetBlock {
  id: string
  type?: string
  title?: string
  description?: string
  category?: string
  subBlocks?: Record<string, any>
  currentState?: any
}

export const generateRouterPrompt = (prompt: string, targetBlocks?: TargetBlock[]): string => {
  const basePrompt = `You are an intelligent routing agent responsible for directing workflow requests to the most appropriate block. Your task is to analyze the input and determine the single most suitable destination based on the request.

Key Instructions:
1. You MUST choose exactly ONE destination from the IDs of the blocks in the workflow. The destination must be a valid block id.

2. Analysis Framework:
   - Carefully evaluate the intent and requirements of the request
   - Consider the primary action needed
   - Match the core functionality with the most appropriate destination`

  // If we have target blocks, add their information to the prompt
  const targetBlocksInfo = targetBlocks
    ? `

Available Target Blocks:
${targetBlocks
  .map(
    (block) => `
ID: ${block.id}
Type: ${block.type}
Title: ${block.title}
Description: ${block.description}
System Prompt: ${JSON.stringify(block.subBlocks?.systemPrompt || '')}
Configuration: ${JSON.stringify(block.subBlocks, null, 2)}
${block.currentState ? `Current State: ${JSON.stringify(block.currentState, null, 2)}` : ''}
---`
  )
  .join('\n')}

Routing Instructions:
1. Analyze the input request carefully against each block's:
   - Primary purpose (from title, description, and system prompt)
   - Look for keywords in the system prompt that match the user's request
   - Configuration settings
   - Current state (if available)
   - Processing capabilities

2. Selection Criteria:
   - Choose the block that best matches the input's requirements
   - Consider the block's specific functionality and constraints
   - Factor in any relevant current state or configuration
   - Prioritize blocks that can handle the input most effectively`
    : ''

  return `${basePrompt}${targetBlocksInfo}

Routing Request: ${prompt}

Response Format:
Return ONLY the destination id as a single word, lowercase, no punctuation or explanation.
Example: "2acd9007-27e8-4510-a487-73d3b825e7c1"

Remember: Your response must be ONLY the block ID - no additional text, formatting, or explanation.`
}

export const RouterBlock: BlockConfig<RouterResponse> = {
  type: 'router',
  name: 'Router',
  description: 'Route workflow',
  authMode: AuthMode.ApiKey,
  longDescription:
    'This is a core workflow block. Intelligently direct workflow execution to different paths based on input analysis. Use natural language to instruct the router to route to certain blocks based on the input.',
  bestPractices: `
  - For the prompt, make it almost programmatic. Use the system prompt to define the routing criteria. Should be very specific with no ambiguity.
  - Use the target block *names* to define the routing criteria.
  `,
  category: 'blocks',
  bgColor: '#28C43F',
  icon: ConnectIcon,
  subBlocks: [
    {
      id: 'prompt',
      title: 'Prompt',
      type: 'long-input',
      placeholder: 'Route to the correct block based on the input...',
      required: true,
    },
    {
      id: 'model',
      title: 'Model',
      type: 'combobox',
      placeholder: 'Type or select a model...',
      required: true,
      options: () => {
        const providersState = useProvidersStore.getState()
        const baseModels = providersState.providers.base.models
        const ollamaModels = providersState.providers.ollama.models
        const openrouterModels = providersState.providers.openrouter.models
        const allModels = Array.from(new Set([...baseModels, ...ollamaModels, ...openrouterModels]))

        return allModels.map((model) => {
          const icon = getProviderIcon(model)
          return { label: model, id: model, ...(icon && { icon }) }
        })
      },
    },
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter your API key',
      password: true,
      connectionDroppable: false,
      required: true,
      // Hide API key for hosted models and Ollama models
      condition: isHosted
        ? {
            field: 'model',
            value: getHostedModels(),
            not: true, // Show for all models EXCEPT those listed
          }
        : () => ({
            field: 'model',
            value: getCurrentOllamaModels(),
            not: true, // Show for all models EXCEPT Ollama models
          }),
    },
    {
      id: 'azureEndpoint',
      title: 'Azure OpenAI Endpoint',
      type: 'short-input',
      password: true,
      placeholder: 'https://your-resource.openai.azure.com',
      connectionDroppable: false,
      condition: {
        field: 'model',
        value: providers['azure-openai'].models,
      },
    },
    {
      id: 'azureApiVersion',
      title: 'Azure API Version',
      type: 'short-input',
      placeholder: '2024-07-01-preview',
      connectionDroppable: false,
      condition: {
        field: 'model',
        value: providers['azure-openai'].models,
      },
    },
    {
      id: 'vertexProject',
      title: 'Vertex AI Project',
      type: 'short-input',
      placeholder: 'your-gcp-project-id',
      connectionDroppable: false,
      condition: {
        field: 'model',
        value: providers.vertex.models,
      },
    },
    {
      id: 'vertexLocation',
      title: 'Vertex AI Location',
      type: 'short-input',
      placeholder: 'us-central1',
      connectionDroppable: false,
      condition: {
        field: 'model',
        value: providers.vertex.models,
      },
    },
    {
      id: 'temperature',
      title: 'Temperature',
      type: 'slider',
      hidden: true,
      min: 0,
      max: 2,
    },
    {
      id: 'systemPrompt',
      title: 'System Prompt',
      type: 'code',
      hidden: true,
      value: (params: Record<string, any>) => {
        return generateRouterPrompt(params.prompt || '')
      },
    },
  ],
  tools: {
    access: [
      'openai_chat',
      'anthropic_chat',
      'google_chat',
      'xai_chat',
      'deepseek_chat',
      'deepseek_reasoner',
    ],
    config: {
      tool: (params: Record<string, any>) => {
        const model = params.model || 'gpt-4o'
        if (!model) {
          throw new Error('No model selected')
        }
        const tool = getAllModelProviders()[model as ProviderId]
        if (!tool) {
          throw new Error(`Invalid model selected: ${model}`)
        }
        return tool
      },
    },
  },
  inputs: {
    prompt: { type: 'string', description: 'Routing prompt content' },
    model: { type: 'string', description: 'AI model to use' },
    apiKey: { type: 'string', description: 'Provider API key' },
    azureEndpoint: { type: 'string', description: 'Azure OpenAI endpoint URL' },
    azureApiVersion: { type: 'string', description: 'Azure API version' },
    vertexProject: { type: 'string', description: 'Google Cloud project ID for Vertex AI' },
    vertexLocation: { type: 'string', description: 'Google Cloud location for Vertex AI' },
    temperature: {
      type: 'number',
      description: 'Response randomness level (low for consistent routing)',
    },
  },
  outputs: {
    prompt: { type: 'string', description: 'Routing prompt used' },
    model: { type: 'string', description: 'Model used' },
    tokens: { type: 'json', description: 'Token usage' },
    cost: { type: 'json', description: 'Cost information' },
    selectedPath: { type: 'json', description: 'Selected routing path' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: rss.ts]---
Location: sim-main/apps/sim/blocks/blocks/rss.ts

```typescript
import { RssIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { getTrigger } from '@/triggers'

export const RssBlock: BlockConfig = {
  type: 'rss',
  name: 'RSS Feed',
  description: 'Monitor RSS feeds and trigger workflows when new items are published',
  longDescription:
    'Subscribe to any RSS or Atom feed and automatically trigger your workflow when new content is published. Perfect for monitoring blogs, news sites, podcasts, and any content that publishes an RSS feed.',
  category: 'triggers',
  bgColor: '#F97316',
  icon: RssIcon,
  triggerAllowed: true,

  subBlocks: [...getTrigger('rss_poller').subBlocks],

  tools: {
    access: [], // Trigger-only for now
  },

  inputs: {},

  outputs: {
    title: { type: 'string', description: 'Item title' },
    link: { type: 'string', description: 'Item link' },
    pubDate: { type: 'string', description: 'Publication date' },
    item: { type: 'json', description: 'Raw item object with all fields' },
    feed: { type: 'json', description: 'Raw feed object with all fields' },
  },

  triggers: {
    enabled: true,
    available: ['rss_poller'],
  },
}
```

--------------------------------------------------------------------------------

---[FILE: s3.ts]---
Location: sim-main/apps/sim/blocks/blocks/s3.ts

```typescript
import { S3Icon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { S3Response } from '@/tools/s3/types'

export const S3Block: BlockConfig<S3Response> = {
  type: 's3',
  name: 'S3',
  description: 'Upload, download, list, and manage S3 files',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Integrate S3 into the workflow. Upload files, download objects, list bucket contents, delete objects, and copy objects between buckets. Requires AWS access key and secret access key.',
  docsLink: 'https://docs.sim.ai/tools/s3',
  category: 'tools',
  bgColor: 'linear-gradient(45deg, #1B660F 0%, #6CAE3E 100%)',
  icon: S3Icon,
  subBlocks: [
    // Operation selector
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Download File', id: 'get_object' },
        { label: 'Upload File', id: 'put_object' },
        { label: 'List Objects', id: 'list_objects' },
        { label: 'Delete Object', id: 'delete_object' },
        { label: 'Copy Object', id: 'copy_object' },
      ],
      value: () => 'get_object',
    },
    // AWS Credentials
    {
      id: 'accessKeyId',
      title: 'Access Key ID',
      type: 'short-input',
      placeholder: 'Enter your AWS Access Key ID',
      password: true,
      required: true,
    },
    {
      id: 'secretAccessKey',
      title: 'Secret Access Key',
      type: 'short-input',
      placeholder: 'Enter your AWS Secret Access Key',
      password: true,
      required: true,
    },
    {
      id: 'region',
      title: 'AWS Region',
      type: 'short-input',
      placeholder: 'e.g., us-east-1, us-west-2',
      condition: {
        field: 'operation',
        value: ['put_object', 'list_objects', 'delete_object', 'copy_object'],
      },
      required: true,
    },
    {
      id: 'bucketName',
      title: 'Bucket Name',
      type: 'short-input',
      placeholder: 'Enter S3 bucket name',
      condition: { field: 'operation', value: ['put_object', 'list_objects', 'delete_object'] },
      required: true,
    },

    // ===== UPLOAD (PUT OBJECT) FIELDS =====
    {
      id: 'objectKey',
      title: 'Object Key/Path',
      type: 'short-input',
      placeholder: 'e.g., myfile.pdf or documents/report.pdf',
      condition: { field: 'operation', value: 'put_object' },
      required: true,
    },
    {
      id: 'uploadFile',
      title: 'File to Upload',
      type: 'file-upload',
      canonicalParamId: 'file',
      placeholder: 'Upload a file',
      condition: { field: 'operation', value: 'put_object' },
      mode: 'basic',
      multiple: false,
    },
    {
      id: 'file',
      title: 'File Reference',
      type: 'short-input',
      canonicalParamId: 'file',
      placeholder: 'Reference a file from previous blocks',
      condition: { field: 'operation', value: 'put_object' },
      mode: 'advanced',
    },
    {
      id: 'content',
      title: 'Text Content',
      type: 'long-input',
      placeholder: 'Or enter text content to upload',
      condition: { field: 'operation', value: 'put_object' },
    },
    {
      id: 'contentType',
      title: 'Content Type',
      type: 'short-input',
      placeholder: 'e.g., text/plain, application/json (auto-detected if not provided)',
      condition: { field: 'operation', value: 'put_object' },
      mode: 'advanced',
    },
    {
      id: 'acl',
      title: 'Access Control',
      type: 'dropdown',
      options: [
        { label: 'Private', id: 'private' },
        { label: 'Public Read', id: 'public-read' },
        { label: 'Public Read/Write', id: 'public-read-write' },
        { label: 'Authenticated Read', id: 'authenticated-read' },
      ],
      placeholder: 'Select ACL (default: private)',
      condition: { field: 'operation', value: 'put_object' },
      mode: 'advanced',
    },

    // ===== DOWNLOAD (GET OBJECT) FIELDS =====
    {
      id: 's3Uri',
      title: 'S3 Object URL',
      type: 'short-input',
      placeholder: 'e.g., https://bucket-name.s3.region.amazonaws.com/path/to/file',
      condition: { field: 'operation', value: 'get_object' },
      required: true,
    },

    // ===== LIST OBJECTS FIELDS =====
    {
      id: 'prefix',
      title: 'Prefix/Folder',
      type: 'short-input',
      placeholder: 'Filter by prefix (e.g., folder/ or leave empty for all)',
      condition: { field: 'operation', value: 'list_objects' },
    },
    {
      id: 'maxKeys',
      title: 'Max Results',
      type: 'short-input',
      placeholder: 'Maximum number of objects to return (default: 1000)',
      condition: { field: 'operation', value: 'list_objects' },
      mode: 'advanced',
    },
    {
      id: 'continuationToken',
      title: 'Continuation Token',
      type: 'short-input',
      placeholder: 'Token for pagination (from previous response)',
      condition: { field: 'operation', value: 'list_objects' },
      mode: 'advanced',
    },

    // ===== DELETE OBJECT FIELDS =====
    {
      id: 'objectKey',
      title: 'Object Key/Path',
      type: 'short-input',
      placeholder: 'e.g., myfile.pdf or documents/report.pdf',
      condition: { field: 'operation', value: 'delete_object' },
      required: true,
    },

    // ===== COPY OBJECT FIELDS =====
    {
      id: 'sourceBucket',
      title: 'Source Bucket',
      type: 'short-input',
      placeholder: 'Source bucket name',
      condition: { field: 'operation', value: 'copy_object' },
      required: true,
    },
    {
      id: 'sourceKey',
      title: 'Source Object Key',
      type: 'short-input',
      placeholder: 'e.g., oldfile.pdf or folder/file.pdf',
      condition: { field: 'operation', value: 'copy_object' },
      required: true,
    },
    {
      id: 'destinationBucket',
      title: 'Destination Bucket',
      type: 'short-input',
      placeholder: 'Destination bucket name (can be same as source)',
      condition: { field: 'operation', value: 'copy_object' },
      required: true,
    },
    {
      id: 'destinationKey',
      title: 'Destination Object Key',
      type: 'short-input',
      placeholder: 'e.g., newfile.pdf or backup/file.pdf',
      condition: { field: 'operation', value: 'copy_object' },
      required: true,
    },
    {
      id: 'copyAcl',
      title: 'Access Control',
      type: 'dropdown',
      options: [
        { label: 'Private', id: 'private' },
        { label: 'Public Read', id: 'public-read' },
        { label: 'Public Read/Write', id: 'public-read-write' },
        { label: 'Authenticated Read', id: 'authenticated-read' },
      ],
      placeholder: 'Select ACL for copied object (default: private)',
      condition: { field: 'operation', value: 'copy_object' },
      mode: 'advanced',
      canonicalParamId: 'acl',
    },
  ],
  tools: {
    access: [
      's3_put_object',
      's3_get_object',
      's3_list_objects',
      's3_delete_object',
      's3_copy_object',
    ],
    config: {
      tool: (params) => {
        // Default to get_object for backward compatibility with existing workflows
        const operation = params.operation || 'get_object'

        switch (operation) {
          case 'put_object':
            return 's3_put_object'
          case 'get_object':
            return 's3_get_object'
          case 'list_objects':
            return 's3_list_objects'
          case 'delete_object':
            return 's3_delete_object'
          case 'copy_object':
            return 's3_copy_object'
          default:
            throw new Error(`Invalid S3 operation: ${operation}`)
        }
      },
      params: (params) => {
        // Validate required fields (common to all operations)
        if (!params.accessKeyId) {
          throw new Error('Access Key ID is required')
        }
        if (!params.secretAccessKey) {
          throw new Error('Secret Access Key is required')
        }

        // Default to get_object for backward compatibility with existing workflows
        const operation = params.operation || 'get_object'

        // Operation-specific parameters
        switch (operation) {
          case 'put_object': {
            if (!params.region) {
              throw new Error('AWS Region is required')
            }
            if (!params.bucketName) {
              throw new Error('Bucket Name is required')
            }
            if (!params.objectKey) {
              throw new Error('Object Key is required for upload')
            }
            // Use file from uploadFile if in basic mode, otherwise use file reference
            const fileParam = params.uploadFile || params.file

            return {
              accessKeyId: params.accessKeyId,
              secretAccessKey: params.secretAccessKey,
              region: params.region,
              bucketName: params.bucketName,
              objectKey: params.objectKey,
              file: fileParam,
              content: params.content,
              contentType: params.contentType,
              acl: params.acl,
            }
          }

          case 'get_object': {
            if (!params.s3Uri) {
              throw new Error('S3 Object URL is required')
            }

            // Parse S3 URI for get_object
            try {
              const url = new URL(params.s3Uri)
              const hostname = url.hostname
              const bucketName = hostname.split('.')[0]
              const regionMatch = hostname.match(/s3[.-]([^.]+)\.amazonaws\.com/)
              const region = regionMatch ? regionMatch[1] : params.region
              const objectKey = url.pathname.startsWith('/')
                ? url.pathname.substring(1)
                : url.pathname

              if (!bucketName || !objectKey) {
                throw new Error('Could not parse S3 URL')
              }

              return {
                accessKeyId: params.accessKeyId,
                secretAccessKey: params.secretAccessKey,
                region,
                bucketName,
                objectKey,
                s3Uri: params.s3Uri,
              }
            } catch (_error) {
              throw new Error(
                'Invalid S3 Object URL format. Expected: https://bucket-name.s3.region.amazonaws.com/path/to/file'
              )
            }
          }

          case 'list_objects':
            if (!params.region) {
              throw new Error('AWS Region is required')
            }
            if (!params.bucketName) {
              throw new Error('Bucket Name is required')
            }
            return {
              accessKeyId: params.accessKeyId,
              secretAccessKey: params.secretAccessKey,
              region: params.region,
              bucketName: params.bucketName,
              prefix: params.prefix,
              maxKeys: params.maxKeys ? Number.parseInt(params.maxKeys as string, 10) : undefined,
              continuationToken: params.continuationToken,
            }

          case 'delete_object':
            if (!params.region) {
              throw new Error('AWS Region is required')
            }
            if (!params.bucketName) {
              throw new Error('Bucket Name is required')
            }
            if (!params.objectKey) {
              throw new Error('Object Key is required for deletion')
            }
            return {
              accessKeyId: params.accessKeyId,
              secretAccessKey: params.secretAccessKey,
              region: params.region,
              bucketName: params.bucketName,
              objectKey: params.objectKey,
            }

          case 'copy_object': {
            if (!params.region) {
              throw new Error('AWS Region is required')
            }
            if (!params.sourceBucket || !params.sourceKey) {
              throw new Error('Source bucket and key are required')
            }
            if (!params.destinationBucket || !params.destinationKey) {
              throw new Error('Destination bucket and key are required')
            }
            // Use copyAcl if provided, map to acl parameter
            const acl = params.copyAcl || params.acl
            return {
              accessKeyId: params.accessKeyId,
              secretAccessKey: params.secretAccessKey,
              region: params.region,
              sourceBucket: params.sourceBucket,
              sourceKey: params.sourceKey,
              destinationBucket: params.destinationBucket,
              destinationKey: params.destinationKey,
              acl: acl,
            }
          }

          default:
            throw new Error(`Unknown operation: ${operation}`)
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    accessKeyId: { type: 'string', description: 'AWS access key ID' },
    secretAccessKey: { type: 'string', description: 'AWS secret access key' },
    region: { type: 'string', description: 'AWS region' },
    bucketName: { type: 'string', description: 'S3 bucket name' },
    // Upload inputs
    objectKey: { type: 'string', description: 'Object key/path in S3' },
    uploadFile: { type: 'json', description: 'File to upload (UI)' },
    file: { type: 'json', description: 'File to upload (reference)' },
    content: { type: 'string', description: 'Text content to upload' },
    contentType: { type: 'string', description: 'Content-Type header' },
    acl: { type: 'string', description: 'Access control list' },
    // Download inputs
    s3Uri: { type: 'string', description: 'S3 object URL' },
    // List inputs
    prefix: { type: 'string', description: 'Prefix filter' },
    maxKeys: { type: 'number', description: 'Maximum results' },
    continuationToken: { type: 'string', description: 'Pagination token' },
    // Copy inputs
    sourceBucket: { type: 'string', description: 'Source bucket name' },
    sourceKey: { type: 'string', description: 'Source object key' },
    destinationBucket: { type: 'string', description: 'Destination bucket name' },
    destinationKey: { type: 'string', description: 'Destination object key' },
    copyAcl: { type: 'string', description: 'ACL for copied object' },
  },
  outputs: {
    url: { type: 'string', description: 'URL of S3 object' },
    objects: { type: 'json', description: 'List of objects (for list operation)' },
    deleted: { type: 'boolean', description: 'Deletion status' },
    metadata: { type: 'json', description: 'Operation metadata' },
  },
}
```

--------------------------------------------------------------------------------

````
