---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 448
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 448 of 933)

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

---[FILE: airtable.ts]---
Location: sim-main/apps/sim/blocks/blocks/airtable.ts

```typescript
import { AirtableIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { AirtableResponse } from '@/tools/airtable/types'
import { getTrigger } from '@/triggers'

export const AirtableBlock: BlockConfig<AirtableResponse> = {
  type: 'airtable',
  name: 'Airtable',
  description: 'Read, create, and update Airtable',
  authMode: AuthMode.OAuth,
  longDescription:
    'Integrates Airtable into the workflow. Can create, get, list, or update Airtable records. Can be used in trigger mode to trigger a workflow when an update is made to an Airtable table.',
  docsLink: 'https://docs.sim.ai/tools/airtable',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: AirtableIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'List Records', id: 'list' },
        { label: 'Get Record', id: 'get' },
        { label: 'Create Records', id: 'create' },
        { label: 'Update Record', id: 'update' },
      ],
      value: () => 'list',
    },
    {
      id: 'credential',
      title: 'Airtable Account',
      type: 'oauth-input',
      serviceId: 'airtable',
      requiredScopes: [
        'data.records:read',
        'data.records:write',
        'user.email:read',
        'webhook:manage',
      ],
      placeholder: 'Select Airtable account',
      required: true,
    },
    {
      id: 'baseId',
      title: 'Base ID',
      type: 'short-input',
      placeholder: 'Enter your base ID (e.g., appXXXXXXXXXXXXXX)',
      dependsOn: ['credential'],
      required: true,
    },
    {
      id: 'tableId',
      title: 'Table ID',
      type: 'short-input',
      placeholder: 'Enter table ID (e.g., tblXXXXXXXXXXXXXX)',
      dependsOn: ['credential', 'baseId'],
      required: true,
    },
    {
      id: 'recordId',
      title: 'Record ID',
      type: 'short-input',
      placeholder: 'ID of the record (e.g., recXXXXXXXXXXXXXX)',
      condition: { field: 'operation', value: ['get', 'update'] },
      required: true,
    },
    {
      id: 'maxRecords',
      title: 'Max Records',
      type: 'short-input',
      placeholder: 'Maximum records to return',
      condition: { field: 'operation', value: 'list' },
    },
    {
      id: 'filterFormula',
      title: 'Filter Formula',
      type: 'long-input',
      placeholder: 'Airtable formula to filter records (optional)',
      condition: { field: 'operation', value: 'list' },
    },
    {
      id: 'records',
      title: 'Records (JSON Array)',
      type: 'code',
      placeholder: 'For Create: `[{ "fields": { ... } }]`\n',
      condition: { field: 'operation', value: ['create', 'updateMultiple'] },
      required: true,
    },
    {
      id: 'fields',
      title: 'Fields (JSON Object)',
      type: 'code',
      placeholder: 'Fields to update: `{ "Field Name": "New Value" }`',
      condition: { field: 'operation', value: 'update' },
      required: true,
    },
    ...getTrigger('airtable_webhook').subBlocks,
  ],
  tools: {
    access: [
      'airtable_list_records',
      'airtable_get_record',
      'airtable_create_records',
      'airtable_update_record',
      'airtable_update_multiple_records',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'list':
            return 'airtable_list_records'
          case 'get':
            return 'airtable_get_record'
          case 'create':
            return 'airtable_create_records'
          case 'update':
            return 'airtable_update_record'
          case 'updateMultiple':
            return 'airtable_update_multiple_records'
          default:
            throw new Error(`Invalid Airtable operation: ${params.operation}`)
        }
      },
      params: (params) => {
        const { credential, records, fields, ...rest } = params
        let parsedRecords: any | undefined
        let parsedFields: any | undefined

        // Parse JSON inputs safely
        try {
          if (records && (params.operation === 'create' || params.operation === 'updateMultiple')) {
            parsedRecords = JSON.parse(records)
          }
          if (fields && params.operation === 'update') {
            parsedFields = JSON.parse(fields)
          }
        } catch (error: any) {
          throw new Error(`Invalid JSON input for ${params.operation} operation: ${error.message}`)
        }

        // Construct parameters based on operation
        const baseParams = {
          credential,
          ...rest,
        }

        switch (params.operation) {
          case 'create':
          case 'updateMultiple':
            return { ...baseParams, records: parsedRecords }
          case 'update':
            return { ...baseParams, fields: parsedFields }
          default:
            return baseParams // No JSON parsing needed for list/get
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    credential: { type: 'string', description: 'Airtable access token' },
    baseId: { type: 'string', description: 'Airtable base identifier' },
    tableId: { type: 'string', description: 'Airtable table identifier' },
    // Conditional inputs
    recordId: { type: 'string', description: 'Record identifier' }, // Required for get/update
    maxRecords: { type: 'number', description: 'Maximum records to return' }, // Optional for list
    filterFormula: { type: 'string', description: 'Filter formula expression' }, // Optional for list
    records: { type: 'json', description: 'Record data array' }, // Required for create/updateMultiple
    fields: { type: 'json', description: 'Field data object' }, // Required for update single
  },
  // Output structure depends on the operation, covered by AirtableResponse union type
  outputs: {
    records: { type: 'json', description: 'Retrieved record data' }, // Optional: for list, create, updateMultiple
    record: { type: 'json', description: 'Single record data' }, // Optional: for get, update single
    metadata: { type: 'json', description: 'Operation metadata' }, // Required: present in all responses
    // Trigger outputs
    event_type: { type: 'string', description: 'Type of Airtable event' },
    base_id: { type: 'string', description: 'Airtable base identifier' },
    table_id: { type: 'string', description: 'Airtable table identifier' },
    record_id: { type: 'string', description: 'Record identifier that was modified' },
    record_data: {
      type: 'string',
      description: 'Complete record data (when Include Full Record Data is enabled)',
    },
    changed_fields: { type: 'string', description: 'Fields that were changed in the record' },
    webhook_id: { type: 'string', description: 'Unique webhook identifier' },
    timestamp: { type: 'string', description: 'Event timestamp' },
  },
  triggers: {
    enabled: true,
    available: ['airtable_webhook'],
  },
}
```

--------------------------------------------------------------------------------

---[FILE: api.ts]---
Location: sim-main/apps/sim/blocks/blocks/api.ts

```typescript
import { ApiIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import type { RequestResponse } from '@/tools/http/types'

export const ApiBlock: BlockConfig<RequestResponse> = {
  type: 'api',
  name: 'API',
  description: 'Use any API',
  longDescription:
    'This is a core workflow block. Connect to any external API with support for all standard HTTP methods and customizable request parameters. Configure headers, query parameters, and request bodies. Standard headers (User-Agent, Accept, Cache-Control, etc.) are automatically included.',
  docsLink: 'https://docs.sim.ai/blocks/api',
  bestPractices: `
  - Curl the endpoint yourself before filling out the API block to make sure it's working IF you have the necessary authentication headers. Clarify with the user if you need any additional headers.
  `,
  category: 'blocks',
  bgColor: '#2F55FF',
  icon: ApiIcon,
  subBlocks: [
    {
      id: 'url',
      title: 'URL',
      type: 'short-input',
      placeholder: 'Enter URL',
      required: true,
    },
    {
      id: 'method',
      title: 'Method',
      type: 'dropdown',
      required: true,
      options: [
        { label: 'GET', id: 'GET' },
        { label: 'POST', id: 'POST' },
        { label: 'PUT', id: 'PUT' },
        { label: 'DELETE', id: 'DELETE' },
        { label: 'PATCH', id: 'PATCH' },
      ],
    },
    {
      id: 'params',
      title: 'Query Params',
      type: 'table',
      columns: ['Key', 'Value'],
    },
    {
      id: 'headers',
      title: 'Headers',
      type: 'table',
      columns: ['Key', 'Value'],
      description:
        'Custom headers (standard headers like User-Agent, Accept, etc. are added automatically)',
    },
    {
      id: 'body',
      title: 'Body',
      type: 'code',
      placeholder: 'Enter JSON...',
      wandConfig: {
        enabled: true,
        maintainHistory: true,
        prompt: `You are an expert JSON programmer.
Generate ONLY the raw JSON object based on the user's request.
The output MUST be a single, valid JSON object, starting with { and ending with }.

Current body: {context}

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
        placeholder: 'Describe the API request body you need...',
        generationType: 'json-object',
      },
    },
  ],
  tools: {
    access: ['http_request'],
  },
  inputs: {
    url: { type: 'string', description: 'Request URL' },
    method: { type: 'string', description: 'HTTP method' },
    headers: { type: 'json', description: 'Request headers' },
    body: { type: 'json', description: 'Request body data' },
    params: { type: 'json', description: 'URL query parameters' },
  },
  outputs: {
    data: { type: 'json', description: 'API response data (JSON, text, or other formats)' },
    status: { type: 'number', description: 'HTTP status code (200, 404, 500, etc.)' },
    headers: { type: 'json', description: 'HTTP response headers as key-value pairs' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: apify.ts]---
Location: sim-main/apps/sim/blocks/blocks/apify.ts

```typescript
import { ApifyIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import type { RunActorResult } from '@/tools/apify/types'

export const ApifyBlock: BlockConfig<RunActorResult> = {
  type: 'apify',
  name: 'Apify',
  description: 'Run Apify actors and retrieve results',
  longDescription:
    'Integrate Apify into your workflow. Run any Apify actor with custom input and retrieve results. Supports both synchronous and asynchronous execution with automatic dataset fetching.',
  docsLink: 'https://docs.sim.ai/tools/apify',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: ApifyIcon,

  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Run Actor', id: 'apify_run_actor_sync' },
        { label: 'Run Actor (Async)', id: 'apify_run_actor_async' },
      ],
      value: () => 'apify_run_actor_sync',
    },
    {
      id: 'apiKey',
      title: 'Apify API Token',
      type: 'short-input',
      password: true,
      placeholder: 'Enter your Apify API token',
      required: true,
    },
    {
      id: 'actorId',
      title: 'Actor ID',
      type: 'short-input',
      placeholder: 'e.g., janedoe/my-actor or actor ID',
      required: true,
    },
    {
      id: 'input',
      title: 'Actor Input',
      type: 'code',
      language: 'json',
      placeholder: '{\n  "startUrl": "https://example.com",\n  "maxPages": 10\n}',
      required: false,
    },
    {
      id: 'timeout',
      title: 'Timeout',
      type: 'short-input',
      placeholder: 'Actor timeout in seconds',
      required: false,
    },
    {
      id: 'build',
      title: 'Build',
      type: 'short-input',
      placeholder: 'Actor build (e.g., "latest", "beta", or build tag)',
      required: false,
    },
    {
      id: 'waitForFinish',
      title: 'Wait For Finish',
      type: 'short-input',
      placeholder: 'Initial wait time in seconds (0-60)',
      required: false,
      condition: {
        field: 'operation',
        value: 'apify_run_actor_async',
      },
    },
    {
      id: 'itemLimit',
      title: 'Item Limit',
      type: 'short-input',
      placeholder: 'Max dataset items to fetch (1-250000)',
      required: false,
      condition: {
        field: 'operation',
        value: 'apify_run_actor_async',
      },
    },
  ],

  tools: {
    access: ['apify_run_actor_sync', 'apify_run_actor_async'],
    config: {
      tool: (params) => params.operation,
      params: (params: Record<string, any>) => {
        const { operation, ...rest } = params
        const result: Record<string, any> = {
          apiKey: rest.apiKey,
          actorId: rest.actorId,
        }

        if (rest.input) {
          result.input = rest.input
        }

        if (rest.timeout) {
          result.timeout = Number(rest.timeout)
        }

        if (rest.build) {
          result.build = rest.build
        }

        if (rest.waitForFinish) {
          result.waitForFinish = Number(rest.waitForFinish)
        }

        if (rest.itemLimit) {
          result.itemLimit = Number(rest.itemLimit)
        }

        return result
      },
    },
  },

  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    apiKey: { type: 'string', description: 'Apify API token' },
    actorId: { type: 'string', description: 'Actor ID or username/actor-name' },
    input: { type: 'string', description: 'Actor input as JSON string' },
    timeout: { type: 'number', description: 'Timeout in seconds' },
    build: { type: 'string', description: 'Actor build version' },
    waitForFinish: { type: 'number', description: 'Initial wait time in seconds' },
    itemLimit: { type: 'number', description: 'Max dataset items to fetch' },
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the actor run succeeded' },
    runId: { type: 'string', description: 'Apify run ID' },
    status: { type: 'string', description: 'Run status (SUCCEEDED, FAILED, etc.)' },
    datasetId: { type: 'string', description: 'Dataset ID containing results' },
    items: { type: 'json', description: 'Dataset items (if completed)' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: api_trigger.ts]---
Location: sim-main/apps/sim/blocks/blocks/api_trigger.ts

```typescript
import { ApiIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'

export const ApiTriggerBlock: BlockConfig = {
  type: 'api_trigger',
  triggerAllowed: true,
  name: 'API (Legacy)',
  description: 'Legacy block for exposing HTTP API endpoint. Prefer Start block.',
  longDescription:
    'API trigger to start the workflow via authenticated HTTP calls with structured input.',
  bestPractices: `
  - Can run the workflow manually to test implementation when this is the trigger point.
  - The input format determines variables accesssible in the following blocks. E.g. <api1.paramName>. You can set the value in the input format to test the workflow manually.
  - In production, the curl would come in as e.g. curl -X POST -H "X-API-Key: $SIM_API_KEY" -H "Content-Type: application/json" -d '{"paramName":"example"}' https://www.staging.sim.ai/api/workflows/9e7e4f26-fc5e-4659-b270-7ea474b14f4a/execute -- If user asks to test via API, you might need to clarify the API key.
  `,
  category: 'triggers',
  hideFromToolbar: true,
  bgColor: '#2F55FF',
  icon: ApiIcon,
  subBlocks: [
    {
      id: 'inputFormat',
      title: 'Input Format',
      type: 'input-format',
      description: 'Define the JSON input schema accepted by the API endpoint.',
    },
  ],
  tools: {
    access: [],
  },
  inputs: {},
  outputs: {
    // Dynamic outputs will be added from inputFormat at runtime
    // Always includes 'input' field plus any fields defined in inputFormat
  },
  triggers: {
    enabled: true,
    available: ['api'],
  },
}
```

--------------------------------------------------------------------------------

````
