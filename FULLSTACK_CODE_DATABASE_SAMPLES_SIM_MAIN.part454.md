---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 454
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 454 of 933)

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

---[FILE: evaluator.ts]---
Location: sim-main/apps/sim/blocks/blocks/evaluator.ts

```typescript
import { ChartBarIcon } from '@/components/icons'
import { isHosted } from '@/lib/core/config/feature-flags'
import { createLogger } from '@/lib/logs/console/logger'
import type { BlockConfig, ParamType } from '@/blocks/types'
import type { ProviderId } from '@/providers/types'
import {
  getAllModelProviders,
  getHostedModels,
  getProviderIcon,
  providers,
} from '@/providers/utils'
import { useProvidersStore } from '@/stores/providers/store'
import type { ToolResponse } from '@/tools/types'

const logger = createLogger('EvaluatorBlock')

const getCurrentOllamaModels = () => {
  return useProvidersStore.getState().providers.ollama.models
}

interface Metric {
  name: string
  description: string
  range: {
    min: number
    max: number
  }
}

interface EvaluatorResponse extends ToolResponse {
  output: {
    content: string
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
    [metricName: string]: any // Allow dynamic metric fields
  }
}

export const generateEvaluatorPrompt = (metrics: Metric[], content: string): string => {
  // Filter out invalid/incomplete metrics first
  const validMetrics = metrics.filter((m) => m?.name && m.range)

  // Create a clear metrics description with name, range, and description
  const metricsDescription = validMetrics
    .map(
      (metric) =>
        `"${metric.name}" (${metric.range.min}-${metric.range.max}): ${metric.description || ''}` // Handle potentially missing description
    )
    .join('\n')

  // Format the content properly - try to detect and format JSON
  let formattedContent = content
  try {
    // If content looks like JSON (starts with { or [)
    if (
      typeof content === 'string' &&
      (content.trim().startsWith('{') || content.trim().startsWith('['))
    ) {
      // Try to parse and pretty-print
      const parsedContent = JSON.parse(content)
      formattedContent = JSON.stringify(parsedContent, null, 2)
    }
    // If it's already an object (shouldn't happen here but just in case)
    else if (typeof content === 'object') {
      formattedContent = JSON.stringify(content, null, 2)
    }
  } catch (e) {
    logger.warn('Warning: Content may not be valid JSON, using as-is', { e })
    formattedContent = content
  }

  // Generate an example of the expected output format using only valid metrics
  const exampleOutput = validMetrics.reduce(
    (acc, metric) => {
      // Ensure metric and name are valid before using them
      if (metric?.name) {
        acc[metric.name.toLowerCase()] = Math.floor((metric.range.min + metric.range.max) / 2) // Use middle of range as example
      } else {
        logger.warn('Skipping invalid metric during example generation:', metric)
      }
      return acc
    },
    {} as Record<string, number>
  )

  return `You are an objective evaluation agent. Analyze the content against the provided metrics and provide detailed scoring.

Evaluation Instructions:
- You MUST evaluate the content against each metric
- For each metric, provide a numeric score within the specified range
- Your response MUST be a valid JSON object with each metric name as a key and a numeric score as the value
- IMPORTANT: Use lowercase versions of the metric names as keys in your JSON response
- Follow the exact schema of the response format provided to you
- Do not include explanations in the JSON - only numeric scores
- Do not add any additional fields not specified in the schema
- Do not include ANY text before or after the JSON object

Metrics to evaluate:
${metricsDescription}

Content to evaluate:
${formattedContent}

Example of expected response format (with different scores):
${JSON.stringify(exampleOutput, null, 2)}

Remember: Your response MUST be a valid JSON object containing only the lowercase metric names as keys with their numeric scores as values. No text explanations.`
}

// Simplified response format generator that matches the agent block schema structure
const generateResponseFormat = (metrics: Metric[]) => {
  // Filter out invalid/incomplete metrics first
  const validMetrics = metrics.filter((m) => m?.name)

  // Create properties for each metric
  const properties: Record<string, any> = {}

  // Add each metric as a property
  validMetrics.forEach((metric) => {
    // We've already filtered, but double-check just in case
    if (metric?.name) {
      properties[metric.name.toLowerCase()] = {
        type: 'number',
        description: `${metric.description || ''} (Score between ${metric.range?.min ?? 0}-${metric.range?.max ?? 'N/A'})`, // Safely access range
      }
    } else {
      logger.warn('Skipping invalid metric during response format property generation:', metric)
    }
  })

  // Return a proper JSON Schema format
  return {
    name: 'evaluation_response',
    schema: {
      type: 'object',
      properties,
      // Use only valid, lowercase metric names for the required array
      required: validMetrics
        .filter((metric) => metric?.name)
        .map((metric) => metric.name.toLowerCase()),
      additionalProperties: false,
    },
    strict: true,
  }
}

export const EvaluatorBlock: BlockConfig<EvaluatorResponse> = {
  type: 'evaluator',
  name: 'Evaluator',
  description: 'Evaluate content',
  longDescription:
    'This is a core workflow block. Assess content quality using customizable evaluation metrics and scoring criteria. Create objective evaluation frameworks with numeric scoring to measure performance across multiple dimensions.',
  docsLink: 'https://docs.sim.ai/blocks/evaluator',
  category: 'tools',
  bgColor: '#4D5FFF',
  icon: ChartBarIcon,
  subBlocks: [
    {
      id: 'metrics',
      title: 'Evaluation Metrics',
      type: 'eval-input',
      required: true,
    },
    {
      id: 'content',
      title: 'Content',
      type: 'long-input',
      placeholder: 'Enter the content to evaluate',
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
      min: 0,
      max: 2,
      hidden: true,
    },
    {
      id: 'systemPrompt',
      title: 'System Prompt',
      type: 'code',
      hidden: true,
      value: (params: Record<string, any>) => {
        try {
          const metrics = params.metrics || []

          // Process content safely
          let processedContent = ''
          if (typeof params.content === 'object') {
            processedContent = JSON.stringify(params.content, null, 2)
          } else {
            processedContent = String(params.content || '')
          }

          // Generate prompt and response format directly
          const promptText = generateEvaluatorPrompt(metrics, processedContent)
          const responseFormatObj = generateResponseFormat(metrics)

          // Create a clean, simple JSON object
          const result = {
            systemPrompt: promptText,
            responseFormat: responseFormatObj,
          }

          return JSON.stringify(result)
        } catch (e) {
          logger.error('Error in systemPrompt value function:', { e })
          // Return a minimal valid JSON as fallback
          return JSON.stringify({
            systemPrompt: 'Evaluate the content and return a JSON with metric scores.',
            responseFormat: {
              schema: {
                type: 'object',
                properties: {},
                additionalProperties: true,
              },
            },
          })
        }
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
    metrics: {
      type: 'json' as ParamType,
      description: 'Evaluation metrics configuration',
      schema: {
        type: 'array',
        properties: {},
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the metric',
            },
            description: {
              type: 'string',
              description: 'Description of what this metric measures',
            },
            range: {
              type: 'object',
              properties: {
                min: {
                  type: 'number',
                  description: 'Minimum possible score',
                },
                max: {
                  type: 'number',
                  description: 'Maximum possible score',
                },
              },
              required: ['min', 'max'],
            },
          },
          required: ['name', 'description', 'range'],
        },
      },
    },
    model: { type: 'string' as ParamType, description: 'AI model to use' },
    apiKey: { type: 'string' as ParamType, description: 'Provider API key' },
    azureEndpoint: { type: 'string' as ParamType, description: 'Azure OpenAI endpoint URL' },
    azureApiVersion: { type: 'string' as ParamType, description: 'Azure API version' },
    vertexProject: {
      type: 'string' as ParamType,
      description: 'Google Cloud project ID for Vertex AI',
    },
    vertexLocation: {
      type: 'string' as ParamType,
      description: 'Google Cloud location for Vertex AI',
    },
    temperature: {
      type: 'number' as ParamType,
      description: 'Response randomness level (low for consistent evaluation)',
    },
    content: { type: 'string' as ParamType, description: 'Content to evaluate' },
  },
  outputs: {
    content: { type: 'string', description: 'Evaluation results' },
    model: { type: 'string', description: 'Model used' },
    tokens: { type: 'json', description: 'Token usage' },
    cost: { type: 'json', description: 'Cost information' },
  } as any,
}
```

--------------------------------------------------------------------------------

---[FILE: exa.ts]---
Location: sim-main/apps/sim/blocks/blocks/exa.ts

```typescript
import { ExaAIIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { ExaResponse } from '@/tools/exa/types'

export const ExaBlock: BlockConfig<ExaResponse> = {
  type: 'exa',
  name: 'Exa',
  description: 'Search with Exa AI',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Integrate Exa into the workflow. Can search, get contents, find similar links, answer a question, and perform research.',
  docsLink: 'https://docs.sim.ai/tools/exa',
  category: 'tools',
  bgColor: '#1F40ED',
  icon: ExaAIIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Search', id: 'exa_search' },
        { label: 'Get Contents', id: 'exa_get_contents' },
        { label: 'Find Similar Links', id: 'exa_find_similar_links' },
        { label: 'Answer', id: 'exa_answer' },
        { label: 'Research', id: 'exa_research' },
      ],
      value: () => 'exa_search',
    },
    // Search operation inputs
    {
      id: 'query',
      title: 'Search Query',
      type: 'long-input',
      placeholder: 'Enter your search query...',
      condition: { field: 'operation', value: 'exa_search' },
      required: true,
    },
    {
      id: 'numResults',
      title: 'Number of Results',
      type: 'short-input',
      placeholder: '10',
      condition: { field: 'operation', value: 'exa_search' },
    },
    {
      id: 'useAutoprompt',
      title: 'Use Autoprompt',
      type: 'switch',
      condition: { field: 'operation', value: 'exa_search' },
    },
    {
      id: 'type',
      title: 'Search Type',
      type: 'dropdown',
      options: [
        { label: 'Auto', id: 'auto' },
        { label: 'Neural', id: 'neural' },
        { label: 'Keyword', id: 'keyword' },
        { label: 'Fast', id: 'fast' },
      ],
      value: () => 'auto',
      condition: { field: 'operation', value: 'exa_search' },
    },
    {
      id: 'includeDomains',
      title: 'Include Domains',
      type: 'long-input',
      placeholder: 'example.com, another.com (comma-separated)',
      condition: { field: 'operation', value: 'exa_search' },
    },
    {
      id: 'excludeDomains',
      title: 'Exclude Domains',
      type: 'long-input',
      placeholder: 'exclude.com, another.com (comma-separated)',
      condition: { field: 'operation', value: 'exa_search' },
    },
    {
      id: 'category',
      title: 'Category Filter',
      type: 'dropdown',
      options: [
        { label: 'None', id: '' },
        { label: 'Company', id: 'company' },
        { label: 'Research Paper', id: 'research_paper' },
        { label: 'News Article', id: 'news_article' },
        { label: 'PDF', id: 'pdf' },
        { label: 'GitHub', id: 'github' },
        { label: 'Tweet', id: 'tweet' },
        { label: 'Movie', id: 'movie' },
        { label: 'Song', id: 'song' },
        { label: 'Personal Site', id: 'personal_site' },
      ],
      value: () => '',
      condition: { field: 'operation', value: 'exa_search' },
    },
    {
      id: 'text',
      title: 'Include Text',
      type: 'switch',
      condition: { field: 'operation', value: 'exa_search' },
    },
    {
      id: 'highlights',
      title: 'Include Highlights',
      type: 'switch',
      condition: { field: 'operation', value: 'exa_search' },
    },
    {
      id: 'summary',
      title: 'Include Summary',
      type: 'switch',
      condition: { field: 'operation', value: 'exa_search' },
    },
    {
      id: 'livecrawl',
      title: 'Live Crawl Mode',
      type: 'dropdown',
      options: [
        { label: 'Never (default)', id: 'never' },
        { label: 'Fallback', id: 'fallback' },
        { label: 'Always', id: 'always' },
      ],
      value: () => 'never',
      condition: { field: 'operation', value: 'exa_search' },
    },
    // Get Contents operation inputs
    {
      id: 'urls',
      title: 'URLs',
      type: 'long-input',
      placeholder: 'Enter URLs to retrieve content from (comma-separated)...',
      condition: { field: 'operation', value: 'exa_get_contents' },
      required: true,
    },
    {
      id: 'text',
      title: 'Include Text',
      type: 'switch',
      condition: { field: 'operation', value: 'exa_get_contents' },
    },
    {
      id: 'summaryQuery',
      title: 'Summary Query',
      type: 'long-input',
      placeholder: 'Enter a query to guide the summary generation...',
      condition: { field: 'operation', value: 'exa_get_contents' },
    },
    {
      id: 'subpages',
      title: 'Number of Subpages',
      type: 'short-input',
      placeholder: '5',
      condition: { field: 'operation', value: 'exa_get_contents' },
    },
    {
      id: 'subpageTarget',
      title: 'Subpage Target Keywords',
      type: 'long-input',
      placeholder: 'docs, tutorial, about (comma-separated)',
      condition: { field: 'operation', value: 'exa_get_contents' },
    },
    {
      id: 'highlights',
      title: 'Include Highlights',
      type: 'switch',
      condition: { field: 'operation', value: 'exa_get_contents' },
    },
    // Find Similar Links operation inputs
    {
      id: 'url',
      title: 'URL',
      type: 'long-input',
      placeholder: 'Enter URL to find similar links for...',
      condition: { field: 'operation', value: 'exa_find_similar_links' },
      required: true,
    },
    {
      id: 'numResults',
      title: 'Number of Results',
      type: 'short-input',
      placeholder: '10',
      condition: { field: 'operation', value: 'exa_find_similar_links' },
    },
    {
      id: 'text',
      title: 'Include Text',
      type: 'switch',
      condition: { field: 'operation', value: 'exa_find_similar_links' },
    },
    {
      id: 'includeDomains',
      title: 'Include Domains',
      type: 'long-input',
      placeholder: 'example.com, another.com (comma-separated)',
      condition: { field: 'operation', value: 'exa_find_similar_links' },
    },
    {
      id: 'excludeDomains',
      title: 'Exclude Domains',
      type: 'long-input',
      placeholder: 'exclude.com, another.com (comma-separated)',
      condition: { field: 'operation', value: 'exa_find_similar_links' },
    },
    {
      id: 'excludeSourceDomain',
      title: 'Exclude Source Domain',
      type: 'switch',
      condition: { field: 'operation', value: 'exa_find_similar_links' },
    },
    {
      id: 'category',
      title: 'Category Filter',
      type: 'dropdown',
      options: [
        { label: 'None', id: '' },
        { label: 'Company', id: 'company' },
        { label: 'Research Paper', id: 'research_paper' },
        { label: 'News Article', id: 'news_article' },
        { label: 'PDF', id: 'pdf' },
        { label: 'GitHub', id: 'github' },
        { label: 'Tweet', id: 'tweet' },
        { label: 'Movie', id: 'movie' },
        { label: 'Song', id: 'song' },
        { label: 'Personal Site', id: 'personal_site' },
      ],
      value: () => '',
      condition: { field: 'operation', value: 'exa_find_similar_links' },
    },
    {
      id: 'highlights',
      title: 'Include Highlights',
      type: 'switch',
      condition: { field: 'operation', value: 'exa_find_similar_links' },
    },
    {
      id: 'summary',
      title: 'Include Summary',
      type: 'switch',
      condition: { field: 'operation', value: 'exa_find_similar_links' },
    },
    {
      id: 'livecrawl',
      title: 'Live Crawl Mode',
      type: 'dropdown',
      options: [
        { label: 'Never (default)', id: 'never' },
        { label: 'Fallback', id: 'fallback' },
        { label: 'Always', id: 'always' },
      ],
      value: () => 'never',
      condition: { field: 'operation', value: 'exa_find_similar_links' },
    },
    // Answer operation inputs
    {
      id: 'query',
      title: 'Question',
      type: 'long-input',
      placeholder: 'Enter your question...',
      condition: { field: 'operation', value: 'exa_answer' },
      required: true,
    },
    {
      id: 'text',
      title: 'Include Text',
      type: 'switch',
      condition: { field: 'operation', value: 'exa_answer' },
    },
    // Research operation inputs
    {
      id: 'query',
      title: 'Research Query',
      type: 'long-input',
      placeholder: 'Enter your research topic or question...',
      condition: { field: 'operation', value: 'exa_research' },
      required: true,
    },
    {
      id: 'model',
      title: 'Research Model',
      type: 'dropdown',
      options: [
        { label: 'Standard (default)', id: 'exa-research' },
        { label: 'Fast', id: 'exa-research-fast' },
        { label: 'Pro', id: 'exa-research-pro' },
      ],
      value: () => 'exa-research',
      condition: { field: 'operation', value: 'exa_research' },
    },
    // API Key (common)
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter your Exa API key',
      password: true,
      required: true,
    },
  ],
  tools: {
    access: [
      'exa_search',
      'exa_get_contents',
      'exa_find_similar_links',
      'exa_answer',
      'exa_research',
    ],
    config: {
      tool: (params) => {
        // Convert numResults to a number for operations that use it
        if (params.numResults) {
          params.numResults = Number(params.numResults)
        }

        // Convert subpages to a number if provided
        if (params.subpages) {
          params.subpages = Number(params.subpages)
        }

        switch (params.operation) {
          case 'exa_search':
            return 'exa_search'
          case 'exa_get_contents':
            return 'exa_get_contents'
          case 'exa_find_similar_links':
            return 'exa_find_similar_links'
          case 'exa_answer':
            return 'exa_answer'
          case 'exa_research':
            return 'exa_research'
          default:
            return 'exa_search'
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    apiKey: { type: 'string', description: 'Exa API key' },
    // Search operation
    query: { type: 'string', description: 'Search query terms' },
    numResults: { type: 'number', description: 'Number of results' },
    useAutoprompt: { type: 'boolean', description: 'Use autoprompt feature' },
    type: { type: 'string', description: 'Search type' },
    includeDomains: { type: 'string', description: 'Include domains filter' },
    excludeDomains: { type: 'string', description: 'Exclude domains filter' },
    category: { type: 'string', description: 'Category filter' },
    text: { type: 'boolean', description: 'Include text content' },
    highlights: { type: 'boolean', description: 'Include highlights' },
    summary: { type: 'boolean', description: 'Include summary' },
    livecrawl: { type: 'string', description: 'Live crawl mode' },
    // Get Contents operation
    urls: { type: 'string', description: 'URLs to retrieve' },
    summaryQuery: { type: 'string', description: 'Summary query guidance' },
    subpages: { type: 'number', description: 'Number of subpages to crawl' },
    subpageTarget: { type: 'string', description: 'Subpage target keywords' },
    // Find Similar Links operation
    url: { type: 'string', description: 'Source URL' },
    excludeSourceDomain: { type: 'boolean', description: 'Exclude source domain' },
    // Research operation
    model: { type: 'string', description: 'Research model selection' },
  },
  outputs: {
    // Search output
    results: { type: 'json', description: 'Search results' },
    // Find Similar Links output
    similarLinks: { type: 'json', description: 'Similar links found' },
    // Answer output
    answer: { type: 'string', description: 'Generated answer' },
    citations: { type: 'json', description: 'Answer citations' },
    // Research output
    research: { type: 'json', description: 'Research findings' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: file.ts]---
Location: sim-main/apps/sim/blocks/blocks/file.ts

```typescript
import { DocumentIcon } from '@/components/icons'
import { createLogger } from '@/lib/logs/console/logger'
import type { BlockConfig, SubBlockType } from '@/blocks/types'
import type { FileParserOutput } from '@/tools/file/types'

const logger = createLogger('FileBlock')

export const FileBlock: BlockConfig<FileParserOutput> = {
  type: 'file',
  name: 'File',
  description: 'Read and parse multiple files',
  longDescription: `Integrate File into the workflow. Can upload a file manually or insert a file url.`,
  bestPractices: `
  - You should always use the File URL input method and enter the file URL if the user gives it to you or clarify if they have one.
  `,
  docsLink: 'https://docs.sim.ai/tools/file',
  category: 'tools',
  bgColor: '#40916C',
  icon: DocumentIcon,
  subBlocks: [
    {
      id: 'inputMethod',
      title: 'Select Input Method',
      type: 'dropdown' as SubBlockType,
      options: [
        { id: 'url', label: 'File URL' },
        { id: 'upload', label: 'Uploaded Files' },
      ],
    },
    {
      id: 'filePath',
      title: 'File URL',
      type: 'short-input' as SubBlockType,
      placeholder: 'Enter URL to a file (https://example.com/document.pdf)',
      condition: {
        field: 'inputMethod',
        value: 'url',
      },
    },

    {
      id: 'file',
      title: 'Process Files',
      type: 'file-upload' as SubBlockType,
      acceptedTypes:
        '.pdf,.csv,.doc,.docx,.txt,.md,.xlsx,.xls,.html,.htm,.pptx,.ppt,.json,.xml,.rtf',
      multiple: true,
      condition: {
        field: 'inputMethod',
        value: 'upload',
      },
      maxSize: 100, // 100MB max via direct upload
    },
  ],
  tools: {
    access: ['file_parser'],
    config: {
      tool: () => 'file_parser',
      params: (params) => {
        // Determine input method - default to 'url' if not specified
        const inputMethod = params.inputMethod || 'url'

        if (inputMethod === 'url') {
          if (!params.filePath || params.filePath.trim() === '') {
            logger.error('Missing file URL')
            throw new Error('File URL is required')
          }

          const fileUrl = params.filePath.trim()

          return {
            filePath: fileUrl,
            fileType: params.fileType || 'auto',
            workspaceId: params._context?.workspaceId,
          }
        }

        // Handle file upload input
        if (inputMethod === 'upload') {
          // Handle case where 'file' is an array (multiple files)
          if (params.file && Array.isArray(params.file) && params.file.length > 0) {
            const filePaths = params.file.map((file) => file.path)

            return {
              filePath: filePaths.length === 1 ? filePaths[0] : filePaths,
              fileType: params.fileType || 'auto',
            }
          }

          // Handle case where 'file' is a single file object
          if (params.file?.path) {
            return {
              filePath: params.file.path,
              fileType: params.fileType || 'auto',
            }
          }

          // If no files, return error
          logger.error('No files provided for upload method')
          throw new Error('Please upload a file')
        }

        // This part should ideally not be reached if logic above is correct
        logger.error(`Invalid configuration or state: ${inputMethod}`)
        throw new Error('Invalid configuration: Unable to determine input method')
      },
    },
  },
  inputs: {
    inputMethod: { type: 'string', description: 'Input method selection' },
    filePath: { type: 'string', description: 'File URL path' },
    fileType: { type: 'string', description: 'File type' },
    file: { type: 'json', description: 'Uploaded file data' },
  },
  outputs: {
    files: {
      type: 'json',
      description: 'Array of parsed file objects with content, metadata, and file properties',
    },
    combinedContent: {
      type: 'string',
      description: 'All file contents merged into a single text string',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: firecrawl.ts]---
Location: sim-main/apps/sim/blocks/blocks/firecrawl.ts

```typescript
import { FirecrawlIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { FirecrawlResponse } from '@/tools/firecrawl/types'

export const FirecrawlBlock: BlockConfig<FirecrawlResponse> = {
  type: 'firecrawl',
  name: 'Firecrawl',
  description: 'Scrape, search, crawl, map, and extract web data',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Integrate Firecrawl into the workflow. Scrape pages, search the web, crawl entire sites, map URL structures, and extract structured data with AI.',
  docsLink: 'https://docs.sim.ai/tools/firecrawl',
  category: 'tools',
  bgColor: '#181C1E',
  icon: FirecrawlIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Scrape', id: 'scrape' },
        { label: 'Search', id: 'search' },
        { label: 'Crawl', id: 'crawl' },
        { label: 'Map', id: 'map' },
        { label: 'Extract', id: 'extract' },
      ],
      value: () => 'scrape',
    },
    {
      id: 'url',
      title: 'Website URL',
      type: 'short-input',
      placeholder: 'Enter the website URL',
      condition: {
        field: 'operation',
        value: ['scrape', 'crawl', 'map'],
      },
      required: true,
    },
    {
      id: 'urls',
      title: 'URLs',
      type: 'long-input',
      placeholder: '["https://example.com/page1", "https://example.com/page2"]',
      condition: {
        field: 'operation',
        value: 'extract',
      },
      required: true,
    },
    {
      id: 'prompt',
      title: 'Extraction Prompt',
      type: 'long-input',
      placeholder:
        'Describe what data to extract (e.g., "Extract product names, prices, and descriptions")',
      condition: {
        field: 'operation',
        value: 'extract',
      },
    },
    {
      id: 'onlyMainContent',
      title: 'Only Main Content',
      type: 'switch',
      condition: {
        field: 'operation',
        value: 'scrape',
      },
    },
    {
      id: 'formats',
      title: 'Output Formats',
      type: 'long-input',
      placeholder: '["markdown", "html"]',
      condition: {
        field: 'operation',
        value: 'scrape',
      },
    },
    {
      id: 'waitFor',
      title: 'Wait For (ms)',
      type: 'short-input',
      placeholder: '0',
      condition: {
        field: 'operation',
        value: 'scrape',
      },
    },
    {
      id: 'mobile',
      title: 'Mobile Mode',
      type: 'switch',
      condition: {
        field: 'operation',
        value: 'scrape',
      },
    },
    {
      id: 'timeout',
      title: 'Timeout (ms)',
      type: 'short-input',
      placeholder: '60000',
      condition: {
        field: 'operation',
        value: ['scrape', 'search'],
      },
    },
    {
      id: 'limit',
      title: 'Limit',
      type: 'short-input',
      placeholder: '100',
      condition: {
        field: 'operation',
        value: ['crawl', 'map', 'search'],
      },
    },
    {
      id: 'query',
      title: 'Search Query',
      type: 'short-input',
      placeholder: 'Enter the search query',
      condition: {
        field: 'operation',
        value: 'search',
      },
      required: true,
    },
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter your Firecrawl API key',
      password: true,
      required: true,
    },
  ],
  tools: {
    access: [
      'firecrawl_scrape',
      'firecrawl_search',
      'firecrawl_crawl',
      'firecrawl_map',
      'firecrawl_extract',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'scrape':
            return 'firecrawl_scrape'
          case 'search':
            return 'firecrawl_search'
          case 'crawl':
            return 'firecrawl_crawl'
          case 'map':
            return 'firecrawl_map'
          case 'extract':
            return 'firecrawl_extract'
          default:
            return 'firecrawl_scrape'
        }
      },
      params: (params) => {
        const {
          operation,
          limit,
          urls,
          formats,
          timeout,
          waitFor,
          url,
          query,
          onlyMainContent,
          mobile,
          prompt,
          apiKey,
        } = params

        const result: Record<string, any> = { apiKey }

        switch (operation) {
          case 'scrape':
            if (url) result.url = url
            if (formats) {
              if (Array.isArray(formats)) {
                result.formats = formats
              } else if (typeof formats === 'string') {
                try {
                  const parsed = JSON.parse(formats)
                  result.formats = Array.isArray(parsed) ? parsed : ['markdown']
                } catch {
                  result.formats = ['markdown']
                }
              }
            }
            if (timeout) result.timeout = Number.parseInt(timeout)
            if (waitFor) result.waitFor = Number.parseInt(waitFor)
            if (onlyMainContent != null) result.onlyMainContent = onlyMainContent
            if (mobile != null) result.mobile = mobile
            break

          case 'search':
            if (query) result.query = query
            if (timeout) result.timeout = Number.parseInt(timeout)
            if (limit) result.limit = Number.parseInt(limit)
            break

          case 'crawl':
            if (url) result.url = url
            if (limit) result.limit = Number.parseInt(limit)
            if (onlyMainContent != null) result.onlyMainContent = onlyMainContent
            break

          case 'map':
            if (url) result.url = url
            if (limit) result.limit = Number.parseInt(limit)
            break

          case 'extract':
            if (urls) {
              if (Array.isArray(urls)) {
                result.urls = urls
              } else if (typeof urls === 'string') {
                try {
                  const parsed = JSON.parse(urls)
                  result.urls = Array.isArray(parsed) ? parsed : [parsed]
                } catch {
                  result.urls = [urls]
                }
              }
            }
            if (prompt) result.prompt = prompt
            break
        }

        return result
      },
    },
  },
  inputs: {
    apiKey: { type: 'string', description: 'Firecrawl API key' },
    operation: { type: 'string', description: 'Operation to perform' },
    url: { type: 'string', description: 'Target website URL' },
    urls: { type: 'json', description: 'Array of URLs for extraction' },
    query: { type: 'string', description: 'Search query terms' },
    prompt: { type: 'string', description: 'Extraction prompt' },
    limit: { type: 'string', description: 'Result/page limit' },
    formats: { type: 'json', description: 'Output formats array' },
    timeout: { type: 'number', description: 'Request timeout in ms' },
    waitFor: { type: 'number', description: 'Wait time before scraping in ms' },
    mobile: { type: 'boolean', description: 'Use mobile emulation' },
    onlyMainContent: { type: 'boolean', description: 'Extract only main content' },
    scrapeOptions: { type: 'json', description: 'Advanced scraping options' },
  },
  outputs: {
    // Scrape output
    markdown: { type: 'string', description: 'Page content markdown' },
    html: { type: 'string', description: 'Raw HTML content' },
    metadata: { type: 'json', description: 'Page metadata' },
    // Search output
    data: { type: 'json', description: 'Search results or extracted data' },
    warning: { type: 'string', description: 'Warning messages' },
    // Crawl output
    pages: { type: 'json', description: 'Crawled pages data' },
    total: { type: 'number', description: 'Total pages found' },
    creditsUsed: { type: 'number', description: 'Credits consumed' },
    // Map output
    success: { type: 'boolean', description: 'Operation success status' },
    links: { type: 'json', description: 'Discovered URLs array' },
    // Extract output
    sources: { type: 'json', description: 'Data sources array' },
  },
}
```

--------------------------------------------------------------------------------

````
