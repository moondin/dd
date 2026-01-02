---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 463
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 463 of 933)

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

---[FILE: human_in_the_loop.ts]---
Location: sim-main/apps/sim/blocks/blocks/human_in_the_loop.ts

```typescript
import { HumanInTheLoopIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import type { ResponseBlockOutput } from '@/tools/response/types'

export const HumanInTheLoopBlock: BlockConfig<ResponseBlockOutput> = {
  type: 'human_in_the_loop',
  name: 'Human in the Loop',
  description: 'Pause workflow execution and wait for human input',
  longDescription:
    'Combines response and start functionality. Sends structured responses and allows workflow to resume from this point.',
  category: 'blocks',
  bgColor: '#10B981',
  icon: HumanInTheLoopIcon,
  subBlocks: [
    // Operation dropdown hidden - block defaults to human approval mode
    // {
    //   id: 'operation',
    //   title: 'Operation',
    //   type: 'dropdown',
    //   layout: 'full',
    //   options: [
    //     { label: 'Human Approval', id: 'human' },
    //     { label: 'API Response', id: 'api' },
    //   ],
    //   value: () => 'human',
    //   description: 'Choose whether to wait for human approval or send an API response',
    // },
    {
      id: 'builderData',
      title: 'Paused Output',
      type: 'response-format',
      // condition: { field: 'operation', value: 'human' }, // Always shown since we only support human mode
      description:
        'Define the structure of your response data. Use <variable.name> in field names to reference workflow variables.',
    },
    {
      id: 'notification',
      title: 'Notification',
      type: 'tool-input',
      // condition: { field: 'operation', value: 'human' }, // Always shown since we only support human mode
      description: 'Configure notification tools to alert approvers (e.g., Slack, Email)',
      defaultValue: [],
    },
    // API mode subBlocks commented out - only human approval mode is supported
    // {
    //   id: 'dataMode',
    //   title: 'Response Data Mode',
    //   type: 'dropdown',
    //   layout: 'full',
    //   options: [
    //     { label: 'Builder', id: 'structured' },
    //     { label: 'Editor', id: 'json' },
    //   ],
    //   value: () => 'structured',
    //   condition: { field: 'operation', value: 'api' },
    //   description: 'Choose how to define your response data structure',
    // },
    {
      id: 'inputFormat',
      title: 'Resume Input',
      type: 'input-format',
      // condition: { field: 'operation', value: 'human' }, // Always shown since we only support human mode
      description: 'Define the fields the approver can fill in when resuming',
    },
    // {
    //   id: 'data',
    //   title: 'Response Data',
    //   type: 'code',
    //   layout: 'full',
    //   placeholder: '{\n  "message": "Hello world",\n  "userId": "<variable.userId>"\n}',
    //   language: 'json',
    //   condition: {
    //     field: 'operation',
    //     value: 'api',
    //     and: { field: 'dataMode', value: 'json' },
    //   },
    //   description:
    //     'Data that will be sent as the response body on API calls. Use <variable.name> to reference workflow variables.',
    //   wandConfig: {
    //     enabled: true,
    //     maintainHistory: true,
    //     prompt: `You are an expert JSON programmer.
    // Generate ONLY the raw JSON object based on the user's request.
    // The output MUST be a single, valid JSON object, starting with { and ending with }.
    //
    // Current response: {context}
    //
    // Do not include any explanations, markdown formatting, or other text outside the JSON object.
    //
    // You have access to the following variables you can use to generate the JSON body:
    // - 'params' (object): Contains input parameters derived from the JSON schema. Access these directly using the parameter name wrapped in angle brackets, e.g., '<paramName>'. Do NOT use 'params.paramName'.
    // - 'environmentVariables' (object): Contains environment variables. Reference these using the double curly brace syntax: '{{ENV_VAR_NAME}}'. Do NOT use 'environmentVariables.VAR_NAME' or env.
    //
    // Example:
    // {
    //   "name": "<block.agent.response.content>",
    //   "age": <block.function.output.age>,
    //   "success": true
    // }`,
    //     placeholder: 'Describe the API response structure you need...',
    //     generationType: 'json-object',
    //   },
    // },
    // {
    //   id: 'status',
    //   title: 'Status Code',
    //   type: 'short-input',
    //   layout: 'half',
    //   placeholder: '200',
    //   condition: { field: 'operation', value: 'api' },
    //   description: 'HTTP status code (default: 200)',
    // },
    // {
    //   id: 'headers',
    //   title: 'Response Headers',
    //   type: 'table',
    //   layout: 'full',
    //   columns: ['Key', 'Value'],
    //   condition: { field: 'operation', value: 'api' },
    //   description: 'Additional HTTP headers to include in the response',
    // },
  ],
  tools: { access: [] },
  inputs: {
    operation: {
      type: 'string',
      description: 'Operation mode: human or api',
    },
    inputFormat: {
      type: 'json',
      description: 'Input fields for resume',
    },
    notification: {
      type: 'json',
      description: 'Notification tools configuration',
    },
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
    url: { type: 'string', description: 'Resume UI URL' },
    // apiUrl: { type: 'string', description: 'Resume API URL' }, // Commented out - not accessible as output
  },
}
```

--------------------------------------------------------------------------------

---[FILE: hunter.ts]---
Location: sim-main/apps/sim/blocks/blocks/hunter.ts

```typescript
import { HunterIOIcon } from '@/components/icons'
import { AuthMode, type BlockConfig } from '@/blocks/types'
import type { HunterResponse } from '@/tools/hunter/types'

export const HunterBlock: BlockConfig<HunterResponse> = {
  type: 'hunter',
  name: 'Hunter io',
  description: 'Find and verify professional email addresses',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Integrate Hunter into the workflow. Can search domains, find email addresses, verify email addresses, discover companies, find companies, and count email addresses.',
  docsLink: 'https://docs.sim.ai/tools/hunter',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: HunterIOIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Domain Search', id: 'hunter_domain_search' },
        { label: 'Email Finder', id: 'hunter_email_finder' },
        { label: 'Email Verifier', id: 'hunter_email_verifier' },
        { label: 'Discover Companies', id: 'hunter_discover' },
        { label: 'Find Company', id: 'hunter_companies_find' },
        { label: 'Email Count', id: 'hunter_email_count' },
      ],
      value: () => 'hunter_domain_search',
    },
    // Domain Search operation inputs
    {
      id: 'domain',
      title: 'Domain',
      type: 'short-input',
      required: true,
      placeholder: 'Enter domain name (e.g., stripe.com)',
      condition: { field: 'operation', value: 'hunter_domain_search' },
    },
    {
      id: 'limit',
      title: 'Number of Results',
      type: 'short-input',
      placeholder: '10',
      condition: { field: 'operation', value: 'hunter_domain_search' },
    },
    {
      id: 'type',
      title: 'Email Type',
      type: 'dropdown',
      options: [
        { label: 'All', id: 'all' },
        { label: 'Personal', id: 'personal' },
        { label: 'Generic', id: 'generic' },
      ],
      value: () => 'all',
      condition: { field: 'operation', value: 'hunter_domain_search' },
    },
    {
      id: 'seniority',
      title: 'Seniority Level',
      type: 'dropdown',
      options: [
        { label: 'All', id: 'all' },
        { label: 'Junior', id: 'junior' },
        { label: 'Senior', id: 'senior' },
        { label: 'Executive', id: 'executive' },
      ],
      value: () => 'all',
      condition: { field: 'operation', value: 'hunter_domain_search' },
    },
    {
      id: 'department',
      title: 'Department',
      type: 'short-input',
      placeholder: 'e.g., sales, marketing, engineering',
      condition: { field: 'operation', value: 'hunter_domain_search' },
    },
    // Email Finder operation inputs
    {
      id: 'domain',
      title: 'Domain',
      type: 'short-input',
      required: true,
      placeholder: 'Enter domain name (e.g., stripe.com)',
      condition: { field: 'operation', value: 'hunter_email_finder' },
    },
    {
      id: 'first_name',
      title: 'First Name',
      type: 'short-input',
      required: true,
      placeholder: 'Enter first name',
      condition: { field: 'operation', value: 'hunter_email_finder' },
    },
    {
      id: 'last_name',
      title: 'Last Name',
      type: 'short-input',
      required: true,
      placeholder: 'Enter last name',
      condition: { field: 'operation', value: 'hunter_email_finder' },
    },
    {
      id: 'company',
      title: 'Company Name',
      type: 'short-input',
      placeholder: 'Enter company name',
      condition: { field: 'operation', value: 'hunter_email_finder' },
    },
    // Email Verifier operation inputs
    {
      id: 'email',
      title: 'Email Address',
      type: 'short-input',
      required: true,
      placeholder: 'Enter email address to verify',
      condition: { field: 'operation', value: 'hunter_email_verifier' },
    },
    // Discover operation inputs
    {
      id: 'query',
      title: 'Search Query',
      type: 'long-input',
      placeholder: 'Enter search query (e.g., "software companies in San Francisco")',
      condition: { field: 'operation', value: 'hunter_discover' },
      required: true,
    },
    {
      id: 'domain',
      title: 'Domain Filter',
      type: 'short-input',
      placeholder: 'Filter by domain',
      condition: { field: 'operation', value: 'hunter_discover' },
    },

    // Find Company operation inputs
    {
      id: 'domain',
      title: 'Domain',
      type: 'short-input',
      required: true,
      placeholder: 'Enter company domain',
      condition: { field: 'operation', value: 'hunter_companies_find' },
    },
    // Email Count operation inputs
    {
      id: 'domain',
      title: 'Domain',
      type: 'short-input',
      placeholder: 'Enter domain name',
      condition: { field: 'operation', value: 'hunter_email_count' },
      required: true,
    },
    {
      id: 'company',
      title: 'Company Name',
      type: 'short-input',
      placeholder: 'Enter company name',
      condition: { field: 'operation', value: 'hunter_email_count' },
    },
    {
      id: 'type',
      title: 'Email Type',
      type: 'dropdown',
      options: [
        { label: 'All', id: 'all' },
        { label: 'Personal', id: 'personal' },
        { label: 'Generic', id: 'generic' },
      ],
      value: () => 'all',
      condition: { field: 'operation', value: 'hunter_email_count' },
    },
    // API Key (common)
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      required: true,
      placeholder: 'Enter your Hunter.io API key',
      password: true,
    },
  ],
  tools: {
    access: [
      'hunter_discover',
      'hunter_domain_search',
      'hunter_email_finder',
      'hunter_email_verifier',
      'hunter_companies_find',
      'hunter_email_count',
    ],
    config: {
      tool: (params) => {
        // Convert numeric parameters
        if (params.limit) {
          params.limit = Number(params.limit)
        }

        switch (params.operation) {
          case 'hunter_discover':
            return 'hunter_discover'
          case 'hunter_domain_search':
            return 'hunter_domain_search'
          case 'hunter_email_finder':
            return 'hunter_email_finder'
          case 'hunter_email_verifier':
            return 'hunter_email_verifier'
          case 'hunter_companies_find':
            return 'hunter_companies_find'
          case 'hunter_email_count':
            return 'hunter_email_count'
          default:
            return 'hunter_domain_search'
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    apiKey: { type: 'string', description: 'Hunter.io API key' },
    // Domain Search & Email Count
    domain: { type: 'string', description: 'Company domain name' },
    limit: { type: 'number', description: 'Result limit' },
    offset: { type: 'number', description: 'Result offset' },
    type: { type: 'string', description: 'Email type filter' },
    seniority: { type: 'string', description: 'Seniority level filter' },
    department: { type: 'string', description: 'Department filter' },
    // Email Finder
    first_name: { type: 'string', description: 'First name' },
    last_name: { type: 'string', description: 'Last name' },
    company: { type: 'string', description: 'Company name' },
    // Email Verifier & Enrichment
    email: { type: 'string', description: 'Email address' },
    // Discover
    query: { type: 'string', description: 'Search query' },
    headcount: { type: 'string', description: 'Company headcount filter' },
    company_type: { type: 'string', description: 'Company type filter' },
    technology: { type: 'string', description: 'Technology filter' },
  },
  outputs: {
    results: { type: 'json', description: 'Search results' },
    emails: { type: 'json', description: 'Email addresses found' },
    email: { type: 'string', description: 'Found email address' },
    score: { type: 'number', description: 'Confidence score' },
    result: { type: 'string', description: 'Verification result' },
    status: { type: 'string', description: 'Status message' },
    total: { type: 'number', description: 'Total results count' },
    personal_emails: { type: 'number', description: 'Personal emails count' },
    generic_emails: { type: 'number', description: 'Generic emails count' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: image_generator.ts]---
Location: sim-main/apps/sim/blocks/blocks/image_generator.ts

```typescript
import { ImageIcon } from '@/components/icons'
import { AuthMode, type BlockConfig } from '@/blocks/types'
import type { DalleResponse } from '@/tools/openai/types'

export const ImageGeneratorBlock: BlockConfig<DalleResponse> = {
  type: 'image_generator',
  name: 'Image Generator',
  description: 'Generate images',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Integrate Image Generator into the workflow. Can generate images using DALL-E 3 or GPT Image.',
  docsLink: 'https://docs.sim.ai/tools/image_generator',
  category: 'tools',
  bgColor: '#4D5FFF',
  icon: ImageIcon,
  subBlocks: [
    {
      id: 'model',
      title: 'Model',
      type: 'dropdown',
      options: [
        { label: 'DALL-E 3', id: 'dall-e-3' },
        { label: 'GPT Image', id: 'gpt-image-1' },
      ],
      value: () => 'dall-e-3',
    },
    {
      id: 'prompt',
      title: 'Prompt',
      type: 'long-input',
      required: true,
      placeholder: 'Describe the image you want to generate...',
    },
    {
      id: 'size',
      title: 'Size',
      type: 'dropdown',
      options: [
        { label: '1024x1024', id: '1024x1024' },
        { label: '1024x1792', id: '1024x1792' },
        { label: '1792x1024', id: '1792x1024' },
      ],
      value: () => '1024x1024',
      condition: { field: 'model', value: 'dall-e-3' },
    },
    {
      id: 'size',
      title: 'Size',
      type: 'dropdown',
      options: [
        { label: 'Auto', id: 'auto' },
        { label: '1024x1024', id: '1024x1024' },
        { label: '1536x1024', id: '1536x1024' },
        { label: '1024x1536', id: '1024x1536' },
      ],
      value: () => 'auto',
      condition: { field: 'model', value: 'gpt-image-1' },
    },
    {
      id: 'quality',
      title: 'Quality',
      type: 'dropdown',
      options: [
        { label: 'Standard', id: 'standard' },
        { label: 'HD', id: 'hd' },
      ],
      value: () => 'standard',
      condition: { field: 'model', value: 'dall-e-3' },
    },
    {
      id: 'style',
      title: 'Style',
      type: 'dropdown',
      options: [
        { label: 'Vivid', id: 'vivid' },
        { label: 'Natural', id: 'natural' },
      ],
      value: () => 'vivid',
      condition: { field: 'model', value: 'dall-e-3' },
    },
    {
      id: 'background',
      title: 'Background',
      type: 'dropdown',
      options: [
        { label: 'Auto', id: 'auto' },
        { label: 'Transparent', id: 'transparent' },
        { label: 'Opaque', id: 'opaque' },
      ],
      value: () => 'auto',
      condition: { field: 'model', value: 'gpt-image-1' },
    },
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      required: true,
      placeholder: 'Enter your OpenAI API key',
      password: true,
      connectionDroppable: false,
    },
  ],
  tools: {
    access: ['openai_image'],
    config: {
      tool: () => 'openai_image',
      params: (params) => {
        if (!params.apiKey) {
          throw new Error('API key is required')
        }
        if (!params.prompt) {
          throw new Error('Prompt is required')
        }

        // Base parameters for all models
        const baseParams = {
          prompt: params.prompt,
          model: params.model || 'dall-e-3',
          size: params.size || '1024x1024',
          apiKey: params.apiKey,
        }

        if (params.model === 'dall-e-3') {
          return {
            ...baseParams,
            quality: params.quality || 'standard',
            style: params.style || 'vivid',
          }
        }
        if (params.model === 'gpt-image-1') {
          return {
            ...baseParams,
            ...(params.background && { background: params.background }),
          }
        }

        return baseParams
      },
    },
  },
  inputs: {
    prompt: { type: 'string', description: 'Image description prompt' },
    model: { type: 'string', description: 'Image generation model' },
    size: { type: 'string', description: 'Image dimensions' },
    quality: { type: 'string', description: 'Image quality level' },
    style: { type: 'string', description: 'Image style' },
    background: { type: 'string', description: 'Background type' },
    apiKey: { type: 'string', description: 'OpenAI API key' },
  },
  outputs: {
    content: { type: 'string', description: 'Generation response' },
    image: { type: 'string', description: 'Generated image URL' },
    metadata: { type: 'json', description: 'Generation metadata' },
  },
}
```

--------------------------------------------------------------------------------

````
