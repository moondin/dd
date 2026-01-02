---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 447
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 447 of 933)

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

---[FILE: agent.ts]---
Location: sim-main/apps/sim/blocks/blocks/agent.ts

```typescript
import { AgentIcon } from '@/components/icons'
import { isHosted } from '@/lib/core/config/feature-flags'
import { createLogger } from '@/lib/logs/console/logger'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import {
  getAllModelProviders,
  getHostedModels,
  getMaxTemperature,
  getProviderIcon,
  getReasoningEffortValuesForModel,
  getVerbosityValuesForModel,
  MODELS_WITH_REASONING_EFFORT,
  MODELS_WITH_VERBOSITY,
  providers,
  supportsTemperature,
} from '@/providers/utils'

const getCurrentOllamaModels = () => {
  return useProvidersStore.getState().providers.ollama.models
}

const getCurrentVLLMModels = () => {
  return useProvidersStore.getState().providers.vllm.models
}

import { useProvidersStore } from '@/stores/providers/store'
import type { ToolResponse } from '@/tools/types'

const logger = createLogger('AgentBlock')

interface AgentResponse extends ToolResponse {
  output: {
    content: string
    model: string
    tokens?: {
      prompt?: number
      completion?: number
      total?: number
    }
    toolCalls?: {
      list: Array<{
        name: string
        arguments: Record<string, any>
      }>
      count: number
    }
  }
}

// Helper function to get the tool ID from a block type
const getToolIdFromBlock = (blockType: string): string | undefined => {
  try {
    const { getAllBlocks } = require('@/blocks/registry')
    const blocks = getAllBlocks()
    const block = blocks.find(
      (b: { type: string; tools?: { access?: string[] } }) => b.type === blockType
    )
    return block?.tools?.access?.[0]
  } catch (error) {
    logger.error('Error getting tool ID from block', { error })
    return undefined
  }
}

export const AgentBlock: BlockConfig<AgentResponse> = {
  type: 'agent',
  name: 'Agent',
  description: 'Build an agent',
  authMode: AuthMode.ApiKey,
  longDescription:
    'The Agent block is a core workflow block that is a wrapper around an LLM. It takes in system/user prompts and calls an LLM provider. It can also make tool calls by directly containing tools inside of its tool input. It can additionally return structured output.',
  bestPractices: `
  - Cannot use core blocks like API, Webhook, Function, Workflow, Memory as tools. Only integrations or custom tools. 
  - Check custom tools examples for YAML syntax. Only construct these if there isn't an existing integration for that purpose.
  - Response Format should be a valid JSON Schema. This determines the output of the agent only if present. Fields can be accessed at root level by the following blocks: e.g. <agent1.field>. If response format is not present, the agent will return the standard outputs: content, model, tokens, toolCalls.
  `,
  docsLink: 'https://docs.sim.ai/blocks/agent',
  category: 'blocks',
  bgColor: 'var(--brand-primary-hex)',
  icon: AgentIcon,
  subBlocks: [
    {
      id: 'messages',
      // title: 'Messages',
      type: 'messages-input',
      placeholder: 'Enter messages...',
    },
    {
      id: 'model',
      title: 'Model',
      type: 'combobox',
      placeholder: 'Type or select a model...',
      required: true,
      defaultValue: 'claude-sonnet-4-5',
      options: () => {
        const providersState = useProvidersStore.getState()
        const baseModels = providersState.providers.base.models
        const ollamaModels = providersState.providers.ollama.models
        const vllmModels = providersState.providers.vllm.models
        const openrouterModels = providersState.providers.openrouter.models
        const allModels = Array.from(
          new Set([...baseModels, ...ollamaModels, ...vllmModels, ...openrouterModels])
        )

        return allModels.map((model) => {
          const icon = getProviderIcon(model)
          return { label: model, id: model, ...(icon && { icon }) }
        })
      },
    },

    {
      id: 'reasoningEffort',
      title: 'Reasoning Effort',
      type: 'dropdown',
      placeholder: 'Select reasoning effort...',
      options: [
        { label: 'low', id: 'low' },
        { label: 'medium', id: 'medium' },
        { label: 'high', id: 'high' },
      ],
      dependsOn: ['model'],
      fetchOptions: async (blockId: string) => {
        const { useSubBlockStore } = await import('@/stores/workflows/subblock/store')
        const { useWorkflowRegistry } = await import('@/stores/workflows/registry/store')

        const activeWorkflowId = useWorkflowRegistry.getState().activeWorkflowId
        if (!activeWorkflowId) {
          return [
            { label: 'low', id: 'low' },
            { label: 'medium', id: 'medium' },
            { label: 'high', id: 'high' },
          ]
        }

        const workflowValues = useSubBlockStore.getState().workflowValues[activeWorkflowId]
        const blockValues = workflowValues?.[blockId]
        const modelValue = blockValues?.model as string

        if (!modelValue) {
          return [
            { label: 'low', id: 'low' },
            { label: 'medium', id: 'medium' },
            { label: 'high', id: 'high' },
          ]
        }

        const validOptions = getReasoningEffortValuesForModel(modelValue)
        if (!validOptions) {
          return [
            { label: 'low', id: 'low' },
            { label: 'medium', id: 'medium' },
            { label: 'high', id: 'high' },
          ]
        }

        return validOptions.map((opt) => ({ label: opt, id: opt }))
      },
      value: () => 'medium',
      condition: {
        field: 'model',
        value: MODELS_WITH_REASONING_EFFORT,
      },
    },
    {
      id: 'verbosity',
      title: 'Verbosity',
      type: 'dropdown',
      placeholder: 'Select verbosity...',
      options: [
        { label: 'low', id: 'low' },
        { label: 'medium', id: 'medium' },
        { label: 'high', id: 'high' },
      ],
      dependsOn: ['model'],
      fetchOptions: async (blockId: string) => {
        const { useSubBlockStore } = await import('@/stores/workflows/subblock/store')
        const { useWorkflowRegistry } = await import('@/stores/workflows/registry/store')

        const activeWorkflowId = useWorkflowRegistry.getState().activeWorkflowId
        if (!activeWorkflowId) {
          return [
            { label: 'low', id: 'low' },
            { label: 'medium', id: 'medium' },
            { label: 'high', id: 'high' },
          ]
        }

        const workflowValues = useSubBlockStore.getState().workflowValues[activeWorkflowId]
        const blockValues = workflowValues?.[blockId]
        const modelValue = blockValues?.model as string

        if (!modelValue) {
          return [
            { label: 'low', id: 'low' },
            { label: 'medium', id: 'medium' },
            { label: 'high', id: 'high' },
          ]
        }

        const validOptions = getVerbosityValuesForModel(modelValue)
        if (!validOptions) {
          return [
            { label: 'low', id: 'low' },
            { label: 'medium', id: 'medium' },
            { label: 'high', id: 'high' },
          ]
        }

        return validOptions.map((opt) => ({ label: opt, id: opt }))
      },
      value: () => 'medium',
      condition: {
        field: 'model',
        value: MODELS_WITH_VERBOSITY,
      },
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
      id: 'tools',
      title: 'Tools',
      type: 'tool-input',
      defaultValue: [],
    },
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter your API key',
      password: true,
      connectionDroppable: false,
      required: true,
      // Hide API key for hosted models, Ollama models, and vLLM models
      condition: isHosted
        ? {
            field: 'model',
            value: getHostedModels(),
            not: true, // Show for all models EXCEPT those listed
          }
        : () => ({
            field: 'model',
            value: [...getCurrentOllamaModels(), ...getCurrentVLLMModels()],
            not: true, // Show for all models EXCEPT Ollama and vLLM models
          }),
    },
    {
      id: 'memoryType',
      title: 'Memory',
      type: 'dropdown',
      placeholder: 'Select memory...',
      options: [
        { label: 'None', id: 'none' },
        { label: 'Conversation', id: 'conversation' },
        { label: 'Sliding window (messages)', id: 'sliding_window' },
        { label: 'Sliding window (tokens)', id: 'sliding_window_tokens' },
      ],
      defaultValue: 'none',
    },
    {
      id: 'conversationId',
      title: 'Conversation ID',
      type: 'short-input',
      placeholder: 'e.g., user-123, session-abc, customer-456',
      required: {
        field: 'memoryType',
        value: ['conversation', 'sliding_window', 'sliding_window_tokens'],
      },
      condition: {
        field: 'memoryType',
        value: ['conversation', 'sliding_window', 'sliding_window_tokens'],
      },
    },
    {
      id: 'slidingWindowSize',
      title: 'Sliding Window Size',
      type: 'short-input',
      placeholder: 'Enter number of messages (e.g., 10)...',
      condition: {
        field: 'memoryType',
        value: ['sliding_window'],
      },
    },
    {
      id: 'slidingWindowTokens',
      title: 'Max Tokens',
      type: 'short-input',
      placeholder: 'Enter max tokens (e.g., 4000)...',
      condition: {
        field: 'memoryType',
        value: ['sliding_window_tokens'],
      },
    },
    {
      id: 'temperature',
      title: 'Temperature',
      type: 'slider',
      min: 0,
      max: 1,
      defaultValue: 0.3,
      condition: () => ({
        field: 'model',
        value: (() => {
          const allModels = Object.keys(getAllModelProviders())
          return allModels.filter(
            (model) => supportsTemperature(model) && getMaxTemperature(model) === 1
          )
        })(),
      }),
    },
    {
      id: 'temperature',
      title: 'Temperature',
      type: 'slider',
      min: 0,
      max: 2,
      defaultValue: 0.3,
      condition: () => ({
        field: 'model',
        value: (() => {
          const allModels = Object.keys(getAllModelProviders())
          return allModels.filter(
            (model) => supportsTemperature(model) && getMaxTemperature(model) === 2
          )
        })(),
      }),
    },
    {
      id: 'responseFormat',
      title: 'Response Format',
      type: 'code',
      placeholder: 'Enter JSON schema...',
      language: 'json',
      wandConfig: {
        enabled: true,
        maintainHistory: true,
        prompt: `You are an expert programmer specializing in creating JSON schemas according to a specific format.
Generate ONLY the JSON schema based on the user's request.
The output MUST be a single, valid JSON object, starting with { and ending with }.
The JSON object MUST have the following top-level properties: 'name' (string), 'description' (string), 'strict' (boolean, usually true), and 'schema' (object).
The 'schema' object must define the structure and MUST contain 'type': 'object', 'properties': {...}, 'additionalProperties': false, and 'required': [...].
Inside 'properties', use standard JSON Schema properties (type, description, enum, items for arrays, etc.).

Current schema: {context}

Do not include any explanations, markdown formatting, or other text outside the JSON object.

Valid Schema Examples:

Example 1:
{
    "name": "reddit_post",
    "description": "Fetches the reddit posts in the given subreddit",
    "strict": true,
    "schema": {
        "type": "object",
        "properties": {
            "title": {
                "type": "string",
                "description": "The title of the post"
            },
            "content": {
                "type": "string",
                "description": "The content of the post"
            }
        },
        "additionalProperties": false,
        "required": [ "title", "content" ]
    }
}

Example 2:
{
    "name": "get_weather",
    "description": "Fetches the current weather for a specific location.",
    "strict": true,
    "schema": {
        "type": "object",
        "properties": {
            "location": {
                "type": "string",
                "description": "The city and state, e.g., San Francisco, CA"
            },
            "unit": {
                "type": "string",
                "description": "Temperature unit",
                "enum": ["celsius", "fahrenheit"]
            }
        },
        "additionalProperties": false,
        "required": ["location", "unit"]
    }
}

Example 3 (Array Input):
{
    "name": "process_items",
    "description": "Processes a list of items with specific IDs.",
    "strict": true,
    "schema": {
        "type": "object",
        "properties": {
            "item_ids": {
                "type": "array",
                "description": "A list of unique item identifiers to process.",
                "items": {
                    "type": "string",
                    "description": "An item ID"
                }
            },
            "processing_mode": {
                "type": "string",
                "description": "The mode for processing",
                "enum": ["fast", "thorough"]
            }
        },
        "additionalProperties": false,
        "required": ["item_ids", "processing_mode"]
    }
}
`,
        placeholder: 'Describe the JSON schema structure you need...',
        generationType: 'json-schema',
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
        const model = params.model || 'claude-sonnet-4-5'
        if (!model) {
          throw new Error('No model selected')
        }
        const tool = getAllModelProviders()[model]
        if (!tool) {
          throw new Error(`Invalid model selected: ${model}`)
        }
        return tool
      },
      params: (params: Record<string, any>) => {
        // If tools array is provided, handle tool usage control
        if (params.tools && Array.isArray(params.tools)) {
          // Transform tools to include usageControl
          const transformedTools = params.tools
            // Filter out tools set to 'none' - they should never be passed to the provider
            .filter((tool: any) => {
              const usageControl = tool.usageControl || 'auto'
              return usageControl !== 'none'
            })
            .map((tool: any) => {
              const toolConfig = {
                id:
                  tool.type === 'custom-tool'
                    ? tool.schema?.function?.name
                    : tool.operation || getToolIdFromBlock(tool.type),
                name: tool.title,
                description: tool.type === 'custom-tool' ? tool.schema?.function?.description : '',
                params: tool.params || {},
                parameters: tool.type === 'custom-tool' ? tool.schema?.function?.parameters : {},
                usageControl: tool.usageControl || 'auto',
                type: tool.type,
              }
              return toolConfig
            })

          // Log which tools are being passed and which are filtered out
          const filteredOutTools = params.tools
            .filter((tool: any) => (tool.usageControl || 'auto') === 'none')
            .map((tool: any) => tool.title)

          if (filteredOutTools.length > 0) {
            logger.info('Filtered out tools set to none', { tools: filteredOutTools.join(', ') })
          }

          return { ...params, tools: transformedTools }
        }
        return params
      },
    },
  },
  inputs: {
    messages: {
      type: 'json',
      description:
        'Array of message objects with role and content: [{ role: "system", content: "..." }, { role: "user", content: "..." }]',
    },
    memoryType: {
      type: 'string',
      description:
        'Type of memory to use: none, conversation, sliding_window, or sliding_window_tokens',
    },
    conversationId: {
      type: 'string',
      description:
        'Specific conversation ID to retrieve memories from (when memoryType is conversation_id)',
    },
    slidingWindowSize: {
      type: 'string',
      description:
        'Number of recent messages to include (when memoryType is sliding_window, e.g., "10")',
    },
    slidingWindowTokens: {
      type: 'string',
      description:
        'Maximum number of tokens for token-based sliding window memory (when memoryType is sliding_window_tokens, e.g., "4000")',
    },
    model: { type: 'string', description: 'AI model to use' },
    apiKey: { type: 'string', description: 'Provider API key' },
    azureEndpoint: { type: 'string', description: 'Azure OpenAI endpoint URL' },
    azureApiVersion: { type: 'string', description: 'Azure API version' },
    vertexProject: { type: 'string', description: 'Google Cloud project ID for Vertex AI' },
    vertexLocation: { type: 'string', description: 'Google Cloud location for Vertex AI' },
    responseFormat: {
      type: 'json',
      description: 'JSON response format schema',
      schema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'A name for your schema (optional)',
          },
          schema: {
            type: 'object',
            description: 'The JSON Schema definition',
            properties: {
              type: {
                type: 'string',
                enum: ['object'],
                description: 'Must be "object" for a valid JSON Schema',
              },
              properties: {
                type: 'object',
                description: 'Object containing property definitions',
              },
              required: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of required property names',
              },
              additionalProperties: {
                type: 'boolean',
                description: 'Whether additional properties are allowed',
              },
            },
            required: ['type', 'properties'],
          },
          strict: {
            type: 'boolean',
            description: 'Whether to enforce strict schema validation',
            default: true,
          },
        },
        required: ['schema'],
      },
    },
    temperature: { type: 'number', description: 'Response randomness level' },
    reasoningEffort: { type: 'string', description: 'Reasoning effort level for GPT-5 models' },
    verbosity: { type: 'string', description: 'Verbosity level for GPT-5 models' },
    tools: { type: 'json', description: 'Available tools configuration' },
  },
  outputs: {
    content: { type: 'string', description: 'Generated response content' },
    model: { type: 'string', description: 'Model used for generation' },
    tokens: { type: 'any', description: 'Token usage statistics' },
    toolCalls: { type: 'any', description: 'Tool calls made' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: ahrefs.ts]---
Location: sim-main/apps/sim/blocks/blocks/ahrefs.ts

```typescript
import { AhrefsIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { AhrefsResponse } from '@/tools/ahrefs/types'

export const AhrefsBlock: BlockConfig<AhrefsResponse> = {
  type: 'ahrefs',
  name: 'Ahrefs',
  description: 'SEO analysis with Ahrefs',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Integrate Ahrefs SEO tools into your workflow. Analyze domain ratings, backlinks, organic keywords, top pages, and more. Requires an Ahrefs Enterprise plan with API access.',
  docsLink: 'https://docs.ahrefs.com/docs/api/reference/introduction',
  category: 'tools',
  bgColor: '#E0E0E0',
  icon: AhrefsIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Domain Rating', id: 'ahrefs_domain_rating' },
        { label: 'Backlinks', id: 'ahrefs_backlinks' },
        { label: 'Backlinks Stats', id: 'ahrefs_backlinks_stats' },
        { label: 'Referring Domains', id: 'ahrefs_referring_domains' },
        { label: 'Organic Keywords', id: 'ahrefs_organic_keywords' },
        { label: 'Top Pages', id: 'ahrefs_top_pages' },
        { label: 'Keyword Overview', id: 'ahrefs_keyword_overview' },
        { label: 'Broken Backlinks', id: 'ahrefs_broken_backlinks' },
      ],
      value: () => 'ahrefs_domain_rating',
    },
    // Domain Rating operation inputs
    {
      id: 'target',
      title: 'Target Domain',
      type: 'short-input',
      placeholder: 'example.com',
      condition: { field: 'operation', value: 'ahrefs_domain_rating' },
      required: true,
    },
    {
      id: 'date',
      title: 'Date',
      type: 'short-input',
      placeholder: 'YYYY-MM-DD (defaults to today)',
      condition: { field: 'operation', value: 'ahrefs_domain_rating' },
    },
    // Backlinks operation inputs
    {
      id: 'target',
      title: 'Target Domain/URL',
      type: 'short-input',
      placeholder: 'example.com or https://example.com/page',
      condition: { field: 'operation', value: 'ahrefs_backlinks' },
      required: true,
    },
    {
      id: 'mode',
      title: 'Analysis Mode',
      type: 'dropdown',
      options: [
        { label: 'Domain (entire domain)', id: 'domain' },
        { label: 'Prefix (URL prefix)', id: 'prefix' },
        { label: 'Subdomains (include all)', id: 'subdomains' },
        { label: 'Exact (exact URL)', id: 'exact' },
      ],
      value: () => 'domain',
      condition: { field: 'operation', value: 'ahrefs_backlinks' },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: '100',
      condition: { field: 'operation', value: 'ahrefs_backlinks' },
    },
    {
      id: 'offset',
      title: 'Offset',
      type: 'short-input',
      placeholder: '0',
      condition: { field: 'operation', value: 'ahrefs_backlinks' },
    },
    {
      id: 'date',
      title: 'Date',
      type: 'short-input',
      placeholder: 'YYYY-MM-DD (defaults to today)',
      condition: { field: 'operation', value: 'ahrefs_backlinks' },
    },
    // Backlinks Stats operation inputs
    {
      id: 'target',
      title: 'Target Domain/URL',
      type: 'short-input',
      placeholder: 'example.com',
      condition: { field: 'operation', value: 'ahrefs_backlinks_stats' },
      required: true,
    },
    {
      id: 'mode',
      title: 'Analysis Mode',
      type: 'dropdown',
      options: [
        { label: 'Domain (entire domain)', id: 'domain' },
        { label: 'Prefix (URL prefix)', id: 'prefix' },
        { label: 'Subdomains (include all)', id: 'subdomains' },
        { label: 'Exact (exact URL)', id: 'exact' },
      ],
      value: () => 'domain',
      condition: { field: 'operation', value: 'ahrefs_backlinks_stats' },
    },
    {
      id: 'date',
      title: 'Date',
      type: 'short-input',
      placeholder: 'YYYY-MM-DD (defaults to today)',
      condition: { field: 'operation', value: 'ahrefs_backlinks_stats' },
    },
    // Referring Domains operation inputs
    {
      id: 'target',
      title: 'Target Domain/URL',
      type: 'short-input',
      placeholder: 'example.com',
      condition: { field: 'operation', value: 'ahrefs_referring_domains' },
      required: true,
    },
    {
      id: 'mode',
      title: 'Analysis Mode',
      type: 'dropdown',
      options: [
        { label: 'Domain (entire domain)', id: 'domain' },
        { label: 'Prefix (URL prefix)', id: 'prefix' },
        { label: 'Subdomains (include all)', id: 'subdomains' },
        { label: 'Exact (exact URL)', id: 'exact' },
      ],
      value: () => 'domain',
      condition: { field: 'operation', value: 'ahrefs_referring_domains' },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: '100',
      condition: { field: 'operation', value: 'ahrefs_referring_domains' },
    },
    {
      id: 'offset',
      title: 'Offset',
      type: 'short-input',
      placeholder: '0',
      condition: { field: 'operation', value: 'ahrefs_referring_domains' },
    },
    {
      id: 'date',
      title: 'Date',
      type: 'short-input',
      placeholder: 'YYYY-MM-DD (defaults to today)',
      condition: { field: 'operation', value: 'ahrefs_referring_domains' },
    },
    // Organic Keywords operation inputs
    {
      id: 'target',
      title: 'Target Domain/URL',
      type: 'short-input',
      placeholder: 'example.com',
      condition: { field: 'operation', value: 'ahrefs_organic_keywords' },
      required: true,
    },
    {
      id: 'country',
      title: 'Country',
      type: 'dropdown',
      options: [
        { label: 'United States', id: 'us' },
        { label: 'United Kingdom', id: 'gb' },
        { label: 'Germany', id: 'de' },
        { label: 'France', id: 'fr' },
        { label: 'Spain', id: 'es' },
        { label: 'Italy', id: 'it' },
        { label: 'Canada', id: 'ca' },
        { label: 'Australia', id: 'au' },
        { label: 'Japan', id: 'jp' },
        { label: 'Brazil', id: 'br' },
        { label: 'India', id: 'in' },
        { label: 'Netherlands', id: 'nl' },
        { label: 'Poland', id: 'pl' },
        { label: 'Russia', id: 'ru' },
        { label: 'Mexico', id: 'mx' },
      ],
      value: () => 'us',
      condition: { field: 'operation', value: 'ahrefs_organic_keywords' },
    },
    {
      id: 'mode',
      title: 'Analysis Mode',
      type: 'dropdown',
      options: [
        { label: 'Domain (entire domain)', id: 'domain' },
        { label: 'Prefix (URL prefix)', id: 'prefix' },
        { label: 'Subdomains (include all)', id: 'subdomains' },
        { label: 'Exact (exact URL)', id: 'exact' },
      ],
      value: () => 'domain',
      condition: { field: 'operation', value: 'ahrefs_organic_keywords' },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: '100',
      condition: { field: 'operation', value: 'ahrefs_organic_keywords' },
    },
    {
      id: 'offset',
      title: 'Offset',
      type: 'short-input',
      placeholder: '0',
      condition: { field: 'operation', value: 'ahrefs_organic_keywords' },
    },
    {
      id: 'date',
      title: 'Date',
      type: 'short-input',
      placeholder: 'YYYY-MM-DD (defaults to today)',
      condition: { field: 'operation', value: 'ahrefs_organic_keywords' },
    },
    // Top Pages operation inputs
    {
      id: 'target',
      title: 'Target Domain',
      type: 'short-input',
      placeholder: 'example.com',
      condition: { field: 'operation', value: 'ahrefs_top_pages' },
      required: true,
    },
    {
      id: 'country',
      title: 'Country',
      type: 'dropdown',
      options: [
        { label: 'United States', id: 'us' },
        { label: 'United Kingdom', id: 'gb' },
        { label: 'Germany', id: 'de' },
        { label: 'France', id: 'fr' },
        { label: 'Spain', id: 'es' },
        { label: 'Italy', id: 'it' },
        { label: 'Canada', id: 'ca' },
        { label: 'Australia', id: 'au' },
        { label: 'Japan', id: 'jp' },
        { label: 'Brazil', id: 'br' },
        { label: 'India', id: 'in' },
        { label: 'Netherlands', id: 'nl' },
        { label: 'Poland', id: 'pl' },
        { label: 'Russia', id: 'ru' },
        { label: 'Mexico', id: 'mx' },
      ],
      value: () => 'us',
      condition: { field: 'operation', value: 'ahrefs_top_pages' },
    },
    {
      id: 'mode',
      title: 'Analysis Mode',
      type: 'dropdown',
      options: [
        { label: 'Domain (entire domain)', id: 'domain' },
        { label: 'Prefix (URL prefix)', id: 'prefix' },
        { label: 'Subdomains (include all)', id: 'subdomains' },
      ],
      value: () => 'domain',
      condition: { field: 'operation', value: 'ahrefs_top_pages' },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: '100',
      condition: { field: 'operation', value: 'ahrefs_top_pages' },
    },
    {
      id: 'offset',
      title: 'Offset',
      type: 'short-input',
      placeholder: '0',
      condition: { field: 'operation', value: 'ahrefs_top_pages' },
    },
    {
      id: 'date',
      title: 'Date',
      type: 'short-input',
      placeholder: 'YYYY-MM-DD (defaults to today)',
      condition: { field: 'operation', value: 'ahrefs_top_pages' },
    },
    // Keyword Overview operation inputs
    {
      id: 'keyword',
      title: 'Keyword',
      type: 'short-input',
      placeholder: 'Enter keyword to analyze',
      condition: { field: 'operation', value: 'ahrefs_keyword_overview' },
      required: true,
    },
    {
      id: 'country',
      title: 'Country',
      type: 'dropdown',
      options: [
        { label: 'United States', id: 'us' },
        { label: 'United Kingdom', id: 'gb' },
        { label: 'Germany', id: 'de' },
        { label: 'France', id: 'fr' },
        { label: 'Spain', id: 'es' },
        { label: 'Italy', id: 'it' },
        { label: 'Canada', id: 'ca' },
        { label: 'Australia', id: 'au' },
        { label: 'Japan', id: 'jp' },
        { label: 'Brazil', id: 'br' },
        { label: 'India', id: 'in' },
        { label: 'Netherlands', id: 'nl' },
        { label: 'Poland', id: 'pl' },
        { label: 'Russia', id: 'ru' },
        { label: 'Mexico', id: 'mx' },
      ],
      value: () => 'us',
      condition: { field: 'operation', value: 'ahrefs_keyword_overview' },
    },
    // Broken Backlinks operation inputs
    {
      id: 'target',
      title: 'Target Domain/URL',
      type: 'short-input',
      placeholder: 'example.com',
      condition: { field: 'operation', value: 'ahrefs_broken_backlinks' },
      required: true,
    },
    {
      id: 'mode',
      title: 'Analysis Mode',
      type: 'dropdown',
      options: [
        { label: 'Domain (entire domain)', id: 'domain' },
        { label: 'Prefix (URL prefix)', id: 'prefix' },
        { label: 'Subdomains (include all)', id: 'subdomains' },
        { label: 'Exact (exact URL)', id: 'exact' },
      ],
      value: () => 'domain',
      condition: { field: 'operation', value: 'ahrefs_broken_backlinks' },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: '100',
      condition: { field: 'operation', value: 'ahrefs_broken_backlinks' },
    },
    {
      id: 'offset',
      title: 'Offset',
      type: 'short-input',
      placeholder: '0',
      condition: { field: 'operation', value: 'ahrefs_broken_backlinks' },
    },
    {
      id: 'date',
      title: 'Date',
      type: 'short-input',
      placeholder: 'YYYY-MM-DD (defaults to today)',
      condition: { field: 'operation', value: 'ahrefs_broken_backlinks' },
    },
    // API Key (common to all operations)
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter your Ahrefs API key',
      password: true,
      required: true,
    },
  ],
  tools: {
    access: [
      'ahrefs_domain_rating',
      'ahrefs_backlinks',
      'ahrefs_backlinks_stats',
      'ahrefs_referring_domains',
      'ahrefs_organic_keywords',
      'ahrefs_top_pages',
      'ahrefs_keyword_overview',
      'ahrefs_broken_backlinks',
    ],
    config: {
      tool: (params) => {
        // Convert numeric string inputs to numbers
        if (params.limit) {
          params.limit = Number(params.limit)
        }
        if (params.offset) {
          params.offset = Number(params.offset)
        }

        switch (params.operation) {
          case 'ahrefs_domain_rating':
            return 'ahrefs_domain_rating'
          case 'ahrefs_backlinks':
            return 'ahrefs_backlinks'
          case 'ahrefs_backlinks_stats':
            return 'ahrefs_backlinks_stats'
          case 'ahrefs_referring_domains':
            return 'ahrefs_referring_domains'
          case 'ahrefs_organic_keywords':
            return 'ahrefs_organic_keywords'
          case 'ahrefs_top_pages':
            return 'ahrefs_top_pages'
          case 'ahrefs_keyword_overview':
            return 'ahrefs_keyword_overview'
          case 'ahrefs_broken_backlinks':
            return 'ahrefs_broken_backlinks'
          default:
            return 'ahrefs_domain_rating'
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    apiKey: { type: 'string', description: 'Ahrefs API key' },
    target: { type: 'string', description: 'Target domain or URL to analyze' },
    keyword: { type: 'string', description: 'Keyword to analyze' },
    mode: { type: 'string', description: 'Analysis mode (domain, prefix, subdomains, exact)' },
    country: { type: 'string', description: 'Country code for geo-specific data' },
    date: { type: 'string', description: 'Date for historical data in YYYY-MM-DD format' },
    limit: { type: 'number', description: 'Maximum number of results to return' },
    offset: { type: 'number', description: 'Number of results to skip for pagination' },
  },
  outputs: {
    // Domain Rating output
    domainRating: { type: 'number', description: 'Domain Rating score (0-100)' },
    ahrefsRank: { type: 'number', description: 'Ahrefs Rank (global ranking)' },
    // Backlinks output
    backlinks: { type: 'json', description: 'List of backlinks' },
    // Backlinks Stats output
    stats: { type: 'json', description: 'Backlink statistics' },
    // Referring Domains output
    referringDomains: { type: 'json', description: 'List of referring domains' },
    // Organic Keywords output
    keywords: { type: 'json', description: 'List of organic keywords' },
    // Top Pages output
    pages: { type: 'json', description: 'List of top pages' },
    // Keyword Overview output
    overview: { type: 'json', description: 'Keyword metrics overview' },
    // Broken Backlinks output
    brokenBacklinks: { type: 'json', description: 'List of broken backlinks' },
  },
}
```

--------------------------------------------------------------------------------

````
