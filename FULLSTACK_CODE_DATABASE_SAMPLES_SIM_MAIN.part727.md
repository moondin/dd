---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 727
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 727 of 933)

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

---[FILE: deep_research.ts]---
Location: sim-main/apps/sim/tools/parallel/deep_research.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ParallelDeepResearchParams } from '@/tools/parallel/types'
import type { ToolConfig, ToolResponse } from '@/tools/types'

const logger = createLogger('ParallelDeepResearchTool')

export const deepResearchTool: ToolConfig<ParallelDeepResearchParams, ToolResponse> = {
  id: 'parallel_deep_research',
  name: 'Parallel AI Deep Research',
  description:
    'Conduct comprehensive deep research across the web using Parallel AI. Synthesizes information from multiple sources with citations. Can take up to 15 minutes to complete.',
  version: '1.0.0',

  params: {
    input: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Research query or question (up to 15,000 characters)',
    },
    processor: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Compute level: base, lite, pro, ultra, ultra2x, ultra4x, ultra8x (default: base)',
    },
    include_domains: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated list of domains to restrict research to (source policy)',
    },
    exclude_domains: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated list of domains to exclude from research (source policy)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Parallel AI API Key',
    },
  },

  request: {
    url: 'https://api.parallel.ai/v1/tasks/runs',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'x-api-key': params.apiKey,
    }),
    body: (params) => {
      const body: Record<string, unknown> = {
        input: params.input,
        processor: params.processor || 'base',
      }

      const taskSpec: Record<string, unknown> = {}

      taskSpec.output_schema = 'auto'

      body.task_spec = taskSpec

      if (params.include_domains || params.exclude_domains) {
        const sourcePolicy: Record<string, string[]> = {}

        if (params.include_domains) {
          sourcePolicy.include_domains = params.include_domains
            .split(',')
            .map((d) => d.trim())
            .filter((d) => d.length > 0)
        }

        if (params.exclude_domains) {
          sourcePolicy.exclude_domains = params.exclude_domains
            .split(',')
            .map((d) => d.trim())
            .filter((d) => d.length > 0)
        }

        if (Object.keys(sourcePolicy).length > 0) {
          body.source_policy = sourcePolicy
        }
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        run_id: data.run_id,
        status: data.status,
        message: `Research task ${data.status}, waiting for completion...`,
        content: {},
        basis: [],
      },
    }
  },

  postProcess: async (result, params) => {
    if (!result.success) {
      return result
    }

    const runId = result.output.run_id
    if (!runId) {
      return {
        ...result,
        success: false,
        error: 'No run_id returned from task creation',
      }
    }

    logger.info(`Parallel AI deep research task ${runId} created, fetching results...`)

    try {
      const resultResponse = await fetch(`https://api.parallel.ai/v1/tasks/runs/${runId}/result`, {
        method: 'GET',
        headers: {
          'x-api-key': params.apiKey,
          'Content-Type': 'application/json',
        },
      })

      if (!resultResponse.ok) {
        const errorText = await resultResponse.text()
        throw new Error(`Failed to get task result: ${resultResponse.status} - ${errorText}`)
      }

      const taskResult = await resultResponse.json()
      logger.info(`Parallel AI deep research task ${runId} completed`)

      const output = taskResult.output || {}
      const run = taskResult.run || {}

      return {
        success: true,
        output: {
          status: run.status || 'completed',
          run_id: runId,
          message: 'Research completed successfully',
          content: output.content || {},
          basis: output.basis || [],
        },
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('Error fetching research task result:', {
        message: errorMessage,
        runId,
      })

      return {
        ...result,
        success: false,
        error: `Error fetching research task result: ${errorMessage}`,
      }
    }
  },

  outputs: {
    status: {
      type: 'string',
      description: 'Task status (completed, failed)',
    },
    run_id: {
      type: 'string',
      description: 'Unique ID for this research task',
    },
    message: {
      type: 'string',
      description: 'Status message',
    },
    content: {
      type: 'object',
      description: 'Research results (structured based on output_schema)',
    },
    basis: {
      type: 'array',
      description: 'Citations and sources with reasoning and confidence levels',
      items: {
        type: 'object',
        properties: {
          field: { type: 'string', description: 'Output field name' },
          reasoning: { type: 'string', description: 'Explanation for the result' },
          citations: {
            type: 'array',
            description: 'Array of sources',
            items: {
              type: 'object',
              properties: {
                url: { type: 'string', description: 'Source URL' },
                title: { type: 'string', description: 'Source title' },
                excerpts: { type: 'array', description: 'Relevant excerpts from the source' },
              },
            },
          },
          confidence: { type: 'string', description: 'Confidence level indicator' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: extract.ts]---
Location: sim-main/apps/sim/tools/parallel/extract.ts

```typescript
import type { ParallelExtractParams } from '@/tools/parallel/types'
import type { ToolConfig, ToolResponse } from '@/tools/types'

export const extractTool: ToolConfig<ParallelExtractParams, ToolResponse> = {
  id: 'parallel_extract',
  name: 'Parallel AI Extract',
  description:
    'Extract targeted information from specific URLs using Parallel AI. Processes provided URLs to pull relevant content based on your objective.',
  version: '1.0.0',

  params: {
    urls: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of URLs to extract information from',
    },
    objective: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'What information to extract from the provided URLs',
    },
    excerpts: {
      type: 'boolean',
      required: true,
      visibility: 'user-only',
      description: 'Include relevant excerpts from the content',
    },
    full_content: {
      type: 'boolean',
      required: true,
      visibility: 'user-only',
      description: 'Include full page content',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Parallel AI API Key',
    },
  },

  request: {
    url: 'https://api.parallel.ai/v1beta/extract',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'x-api-key': params.apiKey,
      'parallel-beta': 'search-extract-2025-10-10',
    }),
    body: (params) => {
      // Convert comma-separated URLs to array
      const urlArray = params.urls
        .split(',')
        .map((url) => url.trim())
        .filter((url) => url.length > 0)

      const body: Record<string, unknown> = {
        urls: urlArray,
        objective: params.objective,
      }

      // Add optional parameters if provided
      if (params.excerpts !== undefined) body.excerpts = params.excerpts
      if (params.full_content !== undefined) body.full_content = params.full_content

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        results: data.results || [],
      },
    }
  },

  outputs: {
    results: {
      type: 'array',
      description: 'Extracted information from the provided URLs',
      items: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'The source URL' },
          title: { type: 'string', description: 'The title of the page' },
          content: { type: 'string', description: 'Extracted content' },
          excerpts: {
            type: 'array',
            description: 'Relevant text excerpts',
            items: { type: 'string' },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/parallel/index.ts

```typescript
import { deepResearchTool } from '@/tools/parallel/deep_research'
import { extractTool } from '@/tools/parallel/extract'
import { searchTool } from '@/tools/parallel/search'

export const parallelSearchTool = searchTool
export const parallelExtractTool = extractTool
export const parallelDeepResearchTool = deepResearchTool
```

--------------------------------------------------------------------------------

---[FILE: search.ts]---
Location: sim-main/apps/sim/tools/parallel/search.ts

```typescript
import type { ParallelSearchParams } from '@/tools/parallel/types'
import type { ToolConfig, ToolResponse } from '@/tools/types'

export const searchTool: ToolConfig<ParallelSearchParams, ToolResponse> = {
  id: 'parallel_search',
  name: 'Parallel AI Search',
  description:
    'Search the web using Parallel AI. Provides comprehensive search results with intelligent processing and content extraction.',
  version: '1.0.0',

  params: {
    objective: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The search objective or question to answer',
    },
    search_queries: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Optional comma-separated list of search queries to execute',
    },
    processor: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Processing method: base or pro (default: base)',
    },
    max_results: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of results to return (default: 5)',
    },
    max_chars_per_result: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum characters per result (default: 1500)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Parallel AI API Key',
    },
  },

  request: {
    url: 'https://api.parallel.ai/v1beta/search',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'x-api-key': params.apiKey,
      'parallel-beta': 'search-extract-2025-10-10',
    }),
    body: (params) => {
      const body: Record<string, unknown> = {
        objective: params.objective,
      }

      // Only include search_queries if it's not empty
      if (
        params.search_queries !== undefined &&
        params.search_queries !== null &&
        params.search_queries.length > 0
      ) {
        body.search_queries = params.search_queries
      }

      // Add optional parameters if provided
      if (params.processor) body.processor = params.processor
      if (params.max_results) body.max_results = Number(params.max_results)
      if (params.max_chars_per_result)
        body.max_chars_per_result = Number(params.max_chars_per_result)

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        results: data.results.map((result: unknown) => {
          const resultObj = result as Record<string, unknown>
          return {
            url: resultObj.url || '',
            title: resultObj.title || '',
            excerpts: resultObj.excerpts || [],
          }
        }),
      },
    }
  },

  outputs: {
    results: {
      type: 'array',
      description: 'Search results with excerpts from relevant pages',
      items: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'The URL of the search result' },
          title: { type: 'string', description: 'The title of the search result' },
          excerpts: {
            type: 'array',
            description: 'Text excerpts from the page',
            items: { type: 'string' },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/parallel/types.ts

```typescript
export interface ParallelSearchParams {
  objective: string
  search_queries: string[]
  processor?: string
  max_results?: number
  max_chars_per_result?: number
  apiKey: string
}

export interface ParallelSearchResult {
  url: string
  title: string
  excerpts: string[]
}

export interface ParallelSearchResponse {
  results: ParallelSearchResult[]
}

export interface ParallelExtractParams {
  urls: string
  objective: string
  excerpts: boolean
  full_content: boolean
  apiKey: string
}

export interface ParallelExtractResult {
  url: string
  title: string
  content?: string
  excerpts?: string[]
}

export interface ParallelExtractResponse {
  results: ParallelExtractResult[]
}

export interface ParallelDeepResearchParams {
  input: string
  processor?: string
  include_domains?: string
  exclude_domains?: string
  apiKey: string
}

export interface ParallelDeepResearchBasis {
  url: string
  title: string
  excerpt: string
  confidence?: number
}

export interface ParallelDeepResearchResponse {
  status: string
  run_id: string
  message?: string
  content?: Record<string, unknown>
  basis?: ParallelDeepResearchBasis[]
  metadata?: Record<string, unknown>
}
```

--------------------------------------------------------------------------------

---[FILE: chat.ts]---
Location: sim-main/apps/sim/tools/perplexity/chat.ts

```typescript
import type { PerplexityChatParams, PerplexityChatResponse } from '@/tools/perplexity/types'
import type { ToolConfig } from '@/tools/types'

export const chatTool: ToolConfig<PerplexityChatParams, PerplexityChatResponse> = {
  id: 'perplexity_chat',
  name: 'Perplexity Chat',
  description: 'Generate completions using Perplexity AI chat models',
  version: '1.0',

  params: {
    systemPrompt: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'System prompt to guide the model behavior',
    },
    content: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The user message content to send to the model',
    },
    model: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Model to use for chat completions (e.g., sonar, mistral)',
    },
    max_tokens: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of tokens to generate',
    },
    temperature: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Sampling temperature between 0 and 1',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Perplexity API key',
    },
  },

  request: {
    method: 'POST',
    url: () => 'https://api.perplexity.ai/chat/completions',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const messages: Array<{ role: string; content: string }> = []

      // Add system prompt if provided
      if (params.systemPrompt) {
        messages.push({
          role: 'system',
          content: params.systemPrompt,
        })
      }

      // Add user message
      messages.push({
        role: 'user',
        content: params.content,
      })

      const body: Record<string, any> = {
        model: params.model,
        messages: messages,
      }

      // Add optional parameters if provided
      if (params.max_tokens !== undefined) {
        body.max_tokens = Number(params.max_tokens) || 10000
      }

      if (params.temperature !== undefined) {
        body.temperature = Number(params.temperature)
      }

      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        content: data.choices[0].message.content,
        model: data.model,
        usage: {
          prompt_tokens: data.usage.prompt_tokens,
          completion_tokens: data.usage.completion_tokens,
          total_tokens: data.usage.total_tokens,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Generated text content' },
    model: { type: 'string', description: 'Model used for generation' },
    usage: {
      type: 'object',
      description: 'Token usage information',
      properties: {
        prompt_tokens: { type: 'number', description: 'Number of tokens in the prompt' },
        completion_tokens: {
          type: 'number',
          description: 'Number of tokens in the completion',
        },
        total_tokens: { type: 'number', description: 'Total number of tokens used' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/perplexity/index.ts

```typescript
import { chatTool } from '@/tools/perplexity/chat'
import { searchTool } from '@/tools/perplexity/search'

export const perplexityChatTool = chatTool
export const perplexitySearchTool = searchTool
```

--------------------------------------------------------------------------------

---[FILE: search.ts]---
Location: sim-main/apps/sim/tools/perplexity/search.ts

```typescript
import type { PerplexitySearchParams, PerplexitySearchResponse } from '@/tools/perplexity/types'
import type { ToolConfig } from '@/tools/types'

export const searchTool: ToolConfig<PerplexitySearchParams, PerplexitySearchResponse> = {
  id: 'perplexity_search',
  name: 'Perplexity Search',
  description:
    "Get ranked search results from Perplexity's continuously refreshed index with advanced filtering and customization options",
  version: '1.0',

  params: {
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'A search query or array of queries (max 5 for multi-query search)',
    },
    max_results: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of search results to return (1-20, default: 10)',
    },
    search_domain_filter: {
      type: 'array',
      required: false,
      visibility: 'user-only',
      description: 'List of domains/URLs to limit search results to (max 20)',
    },
    max_tokens_per_page: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of tokens retrieved from each webpage (default: 1024)',
    },
    country: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Country code to filter search results (e.g., US, GB, DE)',
    },
    search_recency_filter: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter results by recency: hour, day, week, month, or year',
    },
    search_after_date: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Include only content published after this date (format: MM/DD/YYYY)',
    },
    search_before_date: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Include only content published before this date (format: MM/DD/YYYY)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Perplexity API key',
    },
  },

  request: {
    method: 'POST',
    url: () => 'https://api.perplexity.ai/search',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = {
        query: params.query,
      }

      if (params.max_results !== undefined) {
        body.max_results = Number(params.max_results)
      }

      if (params.search_domain_filter && params.search_domain_filter.length > 0) {
        body.search_domain_filter = params.search_domain_filter
      }

      if (params.max_tokens_per_page !== undefined) {
        body.max_tokens_per_page = Number(params.max_tokens_per_page)
      }

      if (params.country) {
        body.country = params.country
      }

      if (params.search_recency_filter) {
        body.search_recency_filter = params.search_recency_filter
      }

      if (params.search_after_date) {
        body.search_after_date = params.search_after_date
      }

      if (params.search_before_date) {
        body.search_before_date = params.search_before_date
      }

      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        results: data.results.map((result: any) => ({
          title: result.title,
          url: result.url,
          snippet: result.snippet,
          date: result.date,
          last_updated: result.last_updated,
        })),
      },
    }
  },

  outputs: {
    results: {
      type: 'array',
      description: 'Array of search results',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Title of the search result' },
          url: { type: 'string', description: 'URL of the search result' },
          snippet: { type: 'string', description: 'Brief excerpt or summary of the content' },
          date: {
            type: 'string',
            description: "Date the page was crawled and added to Perplexity's index",
          },
          last_updated: {
            type: 'string',
            description: "Date the page was last updated in Perplexity's index",
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/perplexity/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface PerplexityMessage {
  role: string
  content: string
}

export interface PerplexityChatParams {
  systemPrompt?: string
  content: string
  model: string
  max_tokens?: number
  temperature?: number
  apiKey: string
}

export interface PerplexityChatResponse extends ToolResponse {
  output: {
    content: string
    model: string
    usage: {
      prompt_tokens: number
      completion_tokens: number
      total_tokens: number
    }
  }
}

export interface PerplexitySearchParams {
  query: string | string[]
  max_results?: number
  search_domain_filter?: string[]
  max_tokens_per_page?: number
  country?: string
  search_recency_filter?: 'hour' | 'day' | 'week' | 'month' | 'year'
  search_after_date?: string
  search_before_date?: string
  apiKey: string
}

export interface PerplexitySearchResult {
  title: string
  url: string
  snippet: string
  date: string
  last_updated: string
}

export interface PerplexitySearchResponse extends ToolResponse {
  output: {
    results: PerplexitySearchResult[]
  }
}
```

--------------------------------------------------------------------------------

---[FILE: fetch.ts]---
Location: sim-main/apps/sim/tools/pinecone/fetch.ts

```typescript
import type { PineconeFetchParams, PineconeResponse, PineconeVector } from '@/tools/pinecone/types'
import type { ToolConfig } from '@/tools/types'

export const fetchTool: ToolConfig<PineconeFetchParams, PineconeResponse> = {
  id: 'pinecone_fetch',
  name: 'Pinecone Fetch',
  description: 'Fetch vectors by ID from a Pinecone index',
  version: '1.0',

  params: {
    indexHost: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Full Pinecone index host URL',
    },
    ids: {
      type: 'array',
      required: true,
      visibility: 'user-only',
      description: 'Array of vector IDs to fetch',
    },
    namespace: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Namespace to fetch vectors from',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Pinecone API key',
    },
  },

  request: {
    method: 'GET',
    url: (params) => {
      const baseUrl = `${params.indexHost}/vectors/fetch`
      const queryParams = new URLSearchParams()
      queryParams.append('ids', params.ids.join(','))
      if (params.namespace) {
        queryParams.append('namespace', params.namespace)
      }
      return `${baseUrl}?${queryParams.toString()}`
    },
    headers: (params) => ({
      'Api-Key': params.apiKey,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    const vectors = data.vectors as Record<string, PineconeVector>

    return {
      success: true,
      output: {
        matches: Object.entries(vectors).map(([id, vector]) => ({
          id,
          values: vector.values,
          metadata: vector.metadata,
          score: 1.0, // Fetch returns exact matches
        })),
        data: Object.values(vectors).map((vector) => ({
          values: vector.values,
          vector_type: 'dense' as const,
        })),
        usage: {
          total_tokens: data.usage?.readUnits || 0,
        },
      },
    }
  },

  outputs: {
    matches: {
      type: 'array',
      description: 'Fetched vectors with ID, values, metadata, and score',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Vector ID' },
          values: { type: 'array', description: 'Vector values' },
          metadata: { type: 'object', description: 'Associated metadata' },
          score: { type: 'number', description: 'Match score (1.0 for exact matches)' },
        },
      },
    },
    data: {
      type: 'array',
      description: 'Vector data with values and vector type',
      items: {
        type: 'object',
        properties: {
          values: { type: 'array', description: 'Vector values' },
          vector_type: { type: 'string', description: 'Vector type (dense/sparse)' },
        },
      },
    },
    usage: {
      type: 'object',
      description: 'Usage statistics including total read units',
      properties: {
        total_tokens: { type: 'number', description: 'Read units consumed' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: generate_embeddings.ts]---
Location: sim-main/apps/sim/tools/pinecone/generate_embeddings.ts

```typescript
import type { PineconeGenerateEmbeddingsParams, PineconeResponse } from '@/tools/pinecone/types'
import type { ToolConfig } from '@/tools/types'

export const generateEmbeddingsTool: ToolConfig<
  PineconeGenerateEmbeddingsParams,
  PineconeResponse
> = {
  id: 'pinecone_generate_embeddings',
  name: 'Pinecone Generate Embeddings',
  description: "Generate embeddings from text using Pinecone's hosted models",
  version: '1.0',

  params: {
    model: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Model to use for generating embeddings',
    },
    inputs: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description: 'Array of text inputs to generate embeddings for',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Pinecone API key',
    },
  },

  request: {
    method: 'POST',
    url: () => 'https://api.pinecone.io/embed',
    headers: (params) => ({
      'Api-Key': params.apiKey,
      'Content-Type': 'application/json',
      'X-Pinecone-API-Version': '2025-01',
    }),
    body: (params) => ({
      model: params.model,
      inputs: params.inputs,
      parameters: params.parameters || {
        input_type: 'passage',
        truncate: 'END',
      },
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        data: data.data,
        model: data.model,
        vector_type: data.vector_type,
        usage: data.usage,
      },
    }
  },

  outputs: {
    data: {
      type: 'array',
      description: 'Generated embeddings data with values and vector type',
    },
    model: {
      type: 'string',
      description: 'Model used for generating embeddings',
    },
    vector_type: {
      type: 'string',
      description: 'Type of vector generated (dense/sparse)',
    },
    usage: {
      type: 'object',
      description: 'Usage statistics for embeddings generation',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/pinecone/index.ts

```typescript
import { fetchTool } from '@/tools/pinecone/fetch'
import { generateEmbeddingsTool } from '@/tools/pinecone/generate_embeddings'
import { searchTextTool } from '@/tools/pinecone/search_text'
import { searchVectorTool } from '@/tools/pinecone/search_vector'
import { upsertTextTool } from '@/tools/pinecone/upsert_text'

export const pineconeFetchTool = fetchTool
export const pineconeGenerateEmbeddingsTool = generateEmbeddingsTool
export const pineconeSearchTextTool = searchTextTool
export const pineconeSearchVectorTool = searchVectorTool
export const pineconeUpsertTextTool = upsertTextTool
```

--------------------------------------------------------------------------------

---[FILE: search_text.ts]---
Location: sim-main/apps/sim/tools/pinecone/search_text.ts

```typescript
import type {
  PineconeResponse,
  PineconeSearchHit,
  PineconeSearchTextParams,
} from '@/tools/pinecone/types'
import type { ToolConfig } from '@/tools/types'

export const searchTextTool: ToolConfig<PineconeSearchTextParams, PineconeResponse> = {
  id: 'pinecone_search_text',
  name: 'Pinecone Search Text',
  description: 'Search for similar text in a Pinecone index',
  version: '1.0',

  params: {
    indexHost: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Full Pinecone index host URL',
    },
    namespace: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Namespace to search in',
    },
    searchQuery: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Text to search for',
    },
    topK: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to return',
    },
    fields: {
      type: 'array',
      required: false,
      visibility: 'user-only',
      description: 'Fields to return in the results',
    },
    filter: {
      type: 'object',
      required: false,
      visibility: 'user-only',
      description: 'Filter to apply to the search',
    },
    rerank: {
      type: 'object',
      required: false,
      visibility: 'user-only',
      description: 'Reranking parameters',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Pinecone API key',
    },
  },

  request: {
    method: 'POST',
    url: (params) => `${params.indexHost}/records/namespaces/${params.namespace}/search`,
    headers: (params) => ({
      'Api-Key': params.apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Pinecone-API-Version': '2025-01',
    }),
    body: (params) => {
      // Format the query object
      const query = {
        inputs: { text: params.searchQuery },
        top_k: params.topK ? Number(params.topK) : 10,
      }

      // Build the request body
      const body: any = {
        query,
      }

      // Add optional parameters if provided
      if (params.fields) {
        body.fields = typeof params.fields === 'string' ? JSON.parse(params.fields) : params.fields
      }

      if (params.filter) {
        body.query.filter =
          typeof params.filter === 'string' ? JSON.parse(params.filter) : params.filter
      }

      if (params.rerank) {
        body.rerank = typeof params.rerank === 'string' ? JSON.parse(params.rerank) : params.rerank
        // If rerank query is not specified, use the search query
        if (!body.rerank.query) {
          body.rerank.query = { text: params.searchQuery }
        }
      }

      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        matches: data.result.hits.map((hit: PineconeSearchHit) => ({
          id: hit._id,
          score: hit._score,
          metadata: hit.fields,
        })),
        usage: {
          total_tokens: data.usage.embed_total_tokens || 0,
          read_units: data.usage.read_units,
          rerank_units: data.usage.rerank_units,
        },
      },
    }
  },

  outputs: {
    matches: {
      type: 'array',
      description: 'Search results with ID, score, and metadata',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Vector ID' },
          score: { type: 'number', description: 'Similarity score' },
          metadata: { type: 'object', description: 'Associated metadata' },
        },
      },
    },
    usage: {
      type: 'object',
      description: 'Usage statistics including tokens, read units, and rerank units',
      properties: {
        total_tokens: { type: 'number', description: 'Total tokens used for embedding' },
        read_units: { type: 'number', description: 'Read units consumed' },
        rerank_units: { type: 'number', description: 'Rerank units used' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search_vector.ts]---
Location: sim-main/apps/sim/tools/pinecone/search_vector.ts

```typescript
import type { PineconeResponse, PineconeSearchVectorParams } from '@/tools/pinecone/types'
import type { ToolConfig } from '@/tools/types'

export const searchVectorTool: ToolConfig<PineconeSearchVectorParams, PineconeResponse> = {
  id: 'pinecone_search_vector',
  name: 'Pinecone Search Vector',
  description: 'Search for similar vectors in a Pinecone index',
  version: '1.0',

  params: {
    indexHost: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Full Pinecone index host URL',
    },
    namespace: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Namespace to search in',
    },
    vector: {
      type: 'array',
      required: true,
      visibility: 'user-only',
      description: 'Vector to search for',
    },
    topK: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to return',
    },
    filter: {
      type: 'object',
      required: false,
      visibility: 'user-only',
      description: 'Filter to apply to the search',
    },
    includeValues: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Include vector values in response',
    },
    includeMetadata: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Include metadata in response',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Pinecone API key',
    },
  },

  request: {
    method: 'POST',
    url: (params) => `${params.indexHost}/query`,
    headers: (params) => ({
      'Api-Key': params.apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
    body: (params) => ({
      namespace: params.namespace,
      vector: typeof params.vector === 'string' ? JSON.parse(params.vector) : params.vector,
      topK: params.topK ? Number(params.topK) : 10,
      filter: params.filter
        ? typeof params.filter === 'string'
          ? JSON.parse(params.filter)
          : params.filter
        : undefined,
      includeValues: true, //TODO: Make this dynamic
      includeMetadata: true, //TODO: Make this dynamic
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        matches: data.matches.map((match: any) => ({
          id: match.id,
          score: match.score,
          values: match.values,
          metadata: match.metadata,
        })),
        namespace: data.namespace,
      },
    }
  },

  outputs: {
    matches: {
      type: 'array',
      description: 'Vector search results with ID, score, values, and metadata',
    },
    namespace: {
      type: 'string',
      description: 'Namespace where the search was performed',
    },
  },
}
```

--------------------------------------------------------------------------------

````
