---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 668
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 668 of 933)

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

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/elevenlabs/index.ts

```typescript
import { elevenLabsTtsTool } from '@/tools/elevenlabs/tts'

export { elevenLabsTtsTool }
```

--------------------------------------------------------------------------------

---[FILE: tts.ts]---
Location: sim-main/apps/sim/tools/elevenlabs/tts.ts

```typescript
import type { ElevenLabsTtsParams, ElevenLabsTtsResponse } from '@/tools/elevenlabs/types'
import type { ToolConfig } from '@/tools/types'

export const elevenLabsTtsTool: ToolConfig<ElevenLabsTtsParams, ElevenLabsTtsResponse> = {
  id: 'elevenlabs_tts',
  name: 'ElevenLabs TTS',
  description: 'Convert TTS using ElevenLabs voices',
  version: '1.0.0',

  params: {
    text: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The text to convert to speech',
    },
    voiceId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the voice to use',
    },
    modelId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The ID of the model to use (defaults to eleven_monolingual_v1)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your ElevenLabs API key',
    },
  },

  request: {
    url: '/api/proxy/tts',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
    }),
    body: (
      params: ElevenLabsTtsParams & {
        _context?: { workspaceId?: string; workflowId?: string; executionId?: string }
      }
    ) => ({
      apiKey: params.apiKey,
      text: params.text,
      voiceId: params.voiceId,
      modelId: params.modelId || 'eleven_monolingual_v1',
      workspaceId: params._context?.workspaceId,
      workflowId: params._context?.workflowId,
      executionId: params._context?.executionId,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok || data.error) {
      return {
        success: false,
        error: data.error || 'Unknown error occurred',
        output: {
          audioUrl: '',
        },
      }
    }

    return {
      success: true,
      output: {
        audioUrl: data.audioUrl,
        audioFile: data.audioFile,
      },
    }
  },

  outputs: {
    audioUrl: { type: 'string', description: 'The URL of the generated audio' },
    audioFile: { type: 'file', description: 'The generated audio file' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/elevenlabs/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface ElevenLabsTtsParams {
  apiKey: string
  text: string
  voiceId: string
  modelId?: string
}

export interface ElevenLabsTtsResponse extends ToolResponse {
  output: {
    audioUrl: string
  }
}

export interface ElevenLabsBlockResponse extends ToolResponse {
  output: {
    audioUrl: string
  }
}
```

--------------------------------------------------------------------------------

---[FILE: answer.ts]---
Location: sim-main/apps/sim/tools/exa/answer.ts

```typescript
import type { ExaAnswerParams, ExaAnswerResponse } from '@/tools/exa/types'
import type { ToolConfig } from '@/tools/types'

export const answerTool: ToolConfig<ExaAnswerParams, ExaAnswerResponse> = {
  id: 'exa_answer',
  name: 'Exa Answer',
  description: 'Get an AI-generated answer to a question with citations from the web using Exa AI.',
  version: '1.0.0',

  params: {
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The question to answer',
    },
    text: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Whether to include the full text of the answer',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Exa AI API Key',
    },
  },

  request: {
    url: 'https://api.exa.ai/answer',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'x-api-key': params.apiKey,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        query: params.query,
      }

      // Add optional parameters if provided
      if (params.text) body.text = params.text

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        query: data.query || '',
        answer: data.answer || '',
        citations:
          data.citations?.map((citation: any) => ({
            title: citation.title || '',
            url: citation.url,
            text: citation.text || '',
          })) || [],
      },
    }
  },

  outputs: {
    answer: {
      type: 'string',
      description: 'AI-generated answer to the question',
    },
    citations: {
      type: 'array',
      description: 'Sources and citations for the answer',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'The title of the cited source' },
          url: { type: 'string', description: 'The URL of the cited source' },
          text: { type: 'string', description: 'Relevant text from the cited source' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: find_similar_links.ts]---
Location: sim-main/apps/sim/tools/exa/find_similar_links.ts

```typescript
import type { ExaFindSimilarLinksParams, ExaFindSimilarLinksResponse } from '@/tools/exa/types'
import type { ToolConfig } from '@/tools/types'

export const findSimilarLinksTool: ToolConfig<
  ExaFindSimilarLinksParams,
  ExaFindSimilarLinksResponse
> = {
  id: 'exa_find_similar_links',
  name: 'Exa Find Similar Links',
  description:
    'Find webpages similar to a given URL using Exa AI. Returns a list of similar links with titles and text snippets.',
  version: '1.0.0',

  params: {
    url: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The URL to find similar links for',
    },
    numResults: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of similar links to return (default: 10, max: 25)',
    },
    text: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether to include the full text of the similar pages',
    },
    includeDomains: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated list of domains to include in results',
    },
    excludeDomains: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated list of domains to exclude from results',
    },
    excludeSourceDomain: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Exclude the source domain from results (default: false)',
    },
    highlights: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Include highlighted snippets in results (default: false)',
    },
    summary: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Include AI-generated summaries in results (default: false)',
    },
    livecrawl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Live crawling mode: never (default), fallback, always, or preferred (always try livecrawl, fall back to cache if fails)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Exa AI API Key',
    },
  },

  request: {
    url: 'https://api.exa.ai/findSimilar',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'x-api-key': params.apiKey,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        url: params.url,
      }

      // Add optional parameters if provided
      if (params.numResults) body.numResults = Number(params.numResults)

      // Domain filtering
      if (params.includeDomains) {
        body.includeDomains = params.includeDomains
          .split(',')
          .map((d: string) => d.trim())
          .filter((d: string) => d.length > 0)
      }
      if (params.excludeDomains) {
        body.excludeDomains = params.excludeDomains
          .split(',')
          .map((d: string) => d.trim())
          .filter((d: string) => d.length > 0)
      }
      if (params.excludeSourceDomain !== undefined) {
        body.excludeSourceDomain = params.excludeSourceDomain
      }

      // Content options - build contents object
      const contents: Record<string, any> = {}
      if (params.text !== undefined) contents.text = params.text
      if (params.highlights !== undefined) contents.highlights = params.highlights
      if (params.summary !== undefined) contents.summary = params.summary

      // Live crawl mode should be inside contents
      if (params.livecrawl) contents.livecrawl = params.livecrawl

      if (Object.keys(contents).length > 0) {
        body.contents = contents
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        similarLinks: data.results.map((result: any) => ({
          title: result.title || '',
          url: result.url,
          text: result.text || '',
          summary: result.summary,
          highlights: result.highlights,
          score: result.score || 0,
        })),
      },
    }
  },

  outputs: {
    similarLinks: {
      type: 'array',
      description: 'Similar links found with titles, URLs, and text snippets',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'The title of the similar webpage' },
          url: { type: 'string', description: 'The URL of the similar webpage' },
          text: {
            type: 'string',
            description: 'Text snippet or full content from the similar webpage',
          },
          score: {
            type: 'number',
            description: 'Similarity score indicating how similar the page is',
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_contents.ts]---
Location: sim-main/apps/sim/tools/exa/get_contents.ts

```typescript
import type { ExaGetContentsParams, ExaGetContentsResponse } from '@/tools/exa/types'
import type { ToolConfig } from '@/tools/types'

export const getContentsTool: ToolConfig<ExaGetContentsParams, ExaGetContentsResponse> = {
  id: 'exa_get_contents',
  name: 'Exa Get Contents',
  description:
    'Retrieve the contents of webpages using Exa AI. Returns the title, text content, and optional summaries for each URL.',
  version: '1.0.0',

  params: {
    urls: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of URLs to retrieve content from',
    },
    text: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description:
        'If true, returns full page text with default settings. If false, disables text return.',
    },
    summaryQuery: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Query to guide the summary generation',
    },
    subpages: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of subpages to crawl from the provided URLs',
    },
    subpageTarget: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Comma-separated keywords to target specific subpages (e.g., "docs,tutorial,about")',
    },
    highlights: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Include highlighted snippets in results (default: false)',
    },
    livecrawl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Live crawling mode: never (default), fallback, always, or preferred (always try livecrawl, fall back to cache if fails)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Exa AI API Key',
    },
  },

  request: {
    url: 'https://api.exa.ai/contents',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'x-api-key': params.apiKey,
    }),
    body: (params) => {
      // Parse the comma-separated URLs into an array
      const urlsString = params.urls
      const urlArray = urlsString
        .split(',')
        .map((url: string) => url.trim())
        .filter((url: string) => url.length > 0)

      const body: Record<string, any> = {
        urls: urlArray,
      }

      // Add optional parameters if provided
      if (params.text !== undefined) {
        body.text = params.text
      }

      // Add summary with query if provided
      if (params.summaryQuery) {
        body.summary = {
          query: params.summaryQuery,
        }
      }

      // Subpages crawling
      if (params.subpages !== undefined) {
        body.subpages = Number(params.subpages)
      }

      if (params.subpageTarget) {
        body.subpageTarget = params.subpageTarget
          .split(',')
          .map((target: string) => target.trim())
          .filter((target: string) => target.length > 0)
      }

      // Content options
      if (params.highlights !== undefined) {
        body.highlights = params.highlights
      }

      // Live crawl mode
      if (params.livecrawl) {
        body.livecrawl = params.livecrawl
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        results: data.results.map((result: any) => ({
          url: result.url,
          title: result.title || '',
          text: result.text || '',
          summary: result.summary || '',
          highlights: result.highlights,
        })),
      },
    }
  },

  outputs: {
    results: {
      type: 'array',
      description: 'Retrieved content from URLs with title, text, and summaries',
      items: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'The URL that content was retrieved from' },
          title: { type: 'string', description: 'The title of the webpage' },
          text: { type: 'string', description: 'The full text content of the webpage' },
          summary: { type: 'string', description: 'AI-generated summary of the webpage content' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/exa/index.ts

```typescript
import { answerTool } from '@/tools/exa/answer'
import { findSimilarLinksTool } from '@/tools/exa/find_similar_links'
import { getContentsTool } from '@/tools/exa/get_contents'
import { researchTool } from '@/tools/exa/research'
import { searchTool } from '@/tools/exa/search'

export const exaAnswerTool = answerTool
export const exaFindSimilarLinksTool = findSimilarLinksTool
export const exaGetContentsTool = getContentsTool
export const exaSearchTool = searchTool
export const exaResearchTool = researchTool
```

--------------------------------------------------------------------------------

---[FILE: research.ts]---
Location: sim-main/apps/sim/tools/exa/research.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ExaResearchParams, ExaResearchResponse } from '@/tools/exa/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('ExaResearchTool')

const POLL_INTERVAL_MS = 5000 // 5 seconds between polls
const MAX_POLL_TIME_MS = 300000 // 5 minutes maximum polling time

export const researchTool: ToolConfig<ExaResearchParams, ExaResearchResponse> = {
  id: 'exa_research',
  name: 'Exa Research',
  description:
    'Perform comprehensive research using AI to generate detailed reports with citations',
  version: '1.0.0',
  params: {
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Research query or topic',
    },
    model: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Research model: exa-research-fast, exa-research (default), or exa-research-pro',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Exa AI API Key',
    },
  },

  request: {
    url: 'https://api.exa.ai/research/v1',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'x-api-key': params.apiKey,
    }),
    body: (params) => {
      const body: any = {
        instructions: params.query,
      }

      // Add model if specified, otherwise use default
      if (params.model) {
        body.model = params.model
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        taskId: data.researchId,
        research: [],
      },
    }
  },
  postProcess: async (result, params) => {
    if (!result.success) {
      return result
    }

    const taskId = result.output.taskId
    logger.info(`Exa research task ${taskId} created, polling for completion...`)

    let elapsedTime = 0

    while (elapsedTime < MAX_POLL_TIME_MS) {
      try {
        const statusResponse = await fetch(`https://api.exa.ai/research/v1/${taskId}`, {
          method: 'GET',
          headers: {
            'x-api-key': params.apiKey,
            'Content-Type': 'application/json',
          },
        })

        if (!statusResponse.ok) {
          throw new Error(`Failed to get task status: ${statusResponse.statusText}`)
        }

        const taskData = await statusResponse.json()
        logger.info(`Exa research task ${taskId} status: ${taskData.status}`)

        if (taskData.status === 'completed') {
          // The completed response contains output.content (text) and output.parsed (structured data)
          const content =
            taskData.output?.content || taskData.output?.parsed || 'Research completed successfully'

          result.output = {
            research: [
              {
                title: 'Research Complete',
                url: '',
                summary: typeof content === 'string' ? content : JSON.stringify(content, null, 2),
                text: typeof content === 'string' ? content : JSON.stringify(content, null, 2),
                publishedDate: undefined,
                author: undefined,
                score: 1.0,
              },
            ],
          }
          return result
        }

        if (taskData.status === 'failed' || taskData.status === 'canceled') {
          return {
            ...result,
            success: false,
            error: `Research task ${taskData.status}: ${taskData.error || 'Unknown error'}`,
          }
        }

        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
        elapsedTime += POLL_INTERVAL_MS
      } catch (error: any) {
        logger.error('Error polling for research task status:', {
          message: error.message || 'Unknown error',
          taskId,
        })

        return {
          ...result,
          success: false,
          error: `Error polling for research task status: ${error.message || 'Unknown error'}`,
        }
      }
    }

    logger.warn(
      `Research task ${taskId} did not complete within the maximum polling time (${MAX_POLL_TIME_MS / 1000}s)`
    )
    return {
      ...result,
      success: false,
      error: `Research task did not complete within the maximum polling time (${MAX_POLL_TIME_MS / 1000}s)`,
    }
  },

  outputs: {
    research: {
      type: 'array',
      description: 'Comprehensive research findings with citations and summaries',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          url: { type: 'string' },
          summary: { type: 'string' },
          text: { type: 'string' },
          publishedDate: { type: 'string' },
          author: { type: 'string' },
          score: { type: 'number' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search.ts]---
Location: sim-main/apps/sim/tools/exa/search.ts

```typescript
import type { ExaSearchParams, ExaSearchResponse } from '@/tools/exa/types'
import type { ToolConfig } from '@/tools/types'

export const searchTool: ToolConfig<ExaSearchParams, ExaSearchResponse> = {
  id: 'exa_search',
  name: 'Exa Search',
  description:
    'Search the web using Exa AI. Returns relevant search results with titles, URLs, and text snippets.',
  version: '1.0.0',

  params: {
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The search query to execute',
    },
    numResults: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to return (default: 10, max: 25)',
    },
    useAutoprompt: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Whether to use autoprompt to improve the query (default: false)',
    },
    type: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Search type: neural, keyword, auto or fast (default: auto)',
    },
    includeDomains: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated list of domains to include in results',
    },
    excludeDomains: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated list of domains to exclude from results',
    },
    category: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Filter by category: company, research paper, news, pdf, github, tweet, personal site, linkedin profile, financial report',
    },
    text: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Include full text content in results (default: false)',
    },
    highlights: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Include highlighted snippets in results (default: false)',
    },
    summary: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Include AI-generated summaries in results (default: false)',
    },
    livecrawl: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Live crawling mode: never (default), fallback, always, or preferred (always try livecrawl, fall back to cache if fails)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Exa AI API Key',
    },
  },

  request: {
    url: 'https://api.exa.ai/search',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      'x-api-key': params.apiKey,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        query: params.query,
      }

      // Add optional parameters if provided
      if (params.numResults) body.numResults = Number(params.numResults)
      if (params.useAutoprompt !== undefined) body.useAutoprompt = params.useAutoprompt
      if (params.type) body.type = params.type

      // Domain filtering
      if (params.includeDomains) {
        body.includeDomains = params.includeDomains
          .split(',')
          .map((d: string) => d.trim())
          .filter((d: string) => d.length > 0)
      }
      if (params.excludeDomains) {
        body.excludeDomains = params.excludeDomains
          .split(',')
          .map((d: string) => d.trim())
          .filter((d: string) => d.length > 0)
      }

      // Category filtering
      if (params.category) body.category = params.category

      // Build contents object for content options
      const contents: Record<string, any> = {}

      if (params.text !== undefined) {
        contents.text = params.text
      }

      if (params.highlights !== undefined) {
        contents.highlights = params.highlights
      }

      if (params.summary !== undefined) {
        contents.summary = params.summary
      }

      if (params.livecrawl) {
        contents.livecrawl = params.livecrawl
      }

      // Add contents to body if not empty
      if (Object.keys(contents).length > 0) {
        body.contents = contents
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        results: data.results.map((result: any) => ({
          title: result.title || '',
          url: result.url,
          publishedDate: result.publishedDate,
          author: result.author,
          summary: result.summary,
          favicon: result.favicon,
          image: result.image,
          text: result.text,
          highlights: result.highlights,
          score: result.score,
        })),
      },
    }
  },

  outputs: {
    results: {
      type: 'array',
      description: 'Search results with titles, URLs, and text snippets',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'The title of the search result' },
          url: { type: 'string', description: 'The URL of the search result' },
          publishedDate: { type: 'string', description: 'Date when the content was published' },
          author: { type: 'string', description: 'The author of the content' },
          summary: { type: 'string', description: 'A brief summary of the content' },
          favicon: { type: 'string', description: "URL of the site's favicon" },
          image: { type: 'string', description: 'URL of a representative image from the page' },
          text: { type: 'string', description: 'Text snippet or full content from the page' },
          score: { type: 'number', description: 'Relevance score for the search result' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/exa/types.ts

```typescript
// Common types for Exa AI tools
import type { ToolResponse } from '@/tools/types'

// Common parameters for all Exa AI tools
export interface ExaBaseParams {
  apiKey: string
}

// Search tool types
export interface ExaSearchParams extends ExaBaseParams {
  query: string
  numResults?: number
  useAutoprompt?: boolean
  type?: 'auto' | 'neural' | 'keyword' | 'fast'
  // Domain filtering
  includeDomains?: string
  excludeDomains?: string
  // Category filtering
  category?:
    | 'company'
    | 'research_paper'
    | 'news_article'
    | 'pdf'
    | 'github'
    | 'tweet'
    | 'movie'
    | 'song'
    | 'personal_site'
  // Content options
  text?: boolean | { maxCharacters?: number }
  highlights?: boolean | { query?: string; numSentences?: number; highlightsPerUrl?: number }
  summary?: boolean | { query?: string }
  // Live crawl mode
  livecrawl?: 'always' | 'fallback' | 'never'
}

export interface ExaSearchResult {
  title: string
  url: string
  publishedDate?: string
  author?: string
  summary?: string
  favicon?: string
  image?: string
  text?: string
  highlights?: string[]
  score: number
}

export interface ExaSearchResponse extends ToolResponse {
  output: {
    results: ExaSearchResult[]
  }
}

// Get Contents tool types
export interface ExaGetContentsParams extends ExaBaseParams {
  urls: string
  text?: boolean | { maxCharacters?: number }
  summaryQuery?: string
  // Subpages crawling
  subpages?: number
  subpageTarget?: string
  // Content options
  highlights?: boolean | { query?: string; numSentences?: number; highlightsPerUrl?: number }
  // Live crawl mode
  livecrawl?: 'always' | 'fallback' | 'never'
}

export interface ExaGetContentsResult {
  url: string
  title: string
  text?: string
  summary?: string
  highlights?: string[]
}

export interface ExaGetContentsResponse extends ToolResponse {
  output: {
    results: ExaGetContentsResult[]
  }
}

// Find Similar Links tool types
export interface ExaFindSimilarLinksParams extends ExaBaseParams {
  url: string
  numResults?: number
  text?: boolean | { maxCharacters?: number }
  // Domain filtering
  includeDomains?: string
  excludeDomains?: string
  excludeSourceDomain?: boolean
  // Category filtering
  category?:
    | 'company'
    | 'research_paper'
    | 'news_article'
    | 'pdf'
    | 'github'
    | 'tweet'
    | 'movie'
    | 'song'
    | 'personal_site'
  // Content options
  highlights?: boolean | { query?: string; numSentences?: number; highlightsPerUrl?: number }
  summary?: boolean | { query?: string }
  // Live crawl mode
  livecrawl?: 'always' | 'fallback' | 'never'
}

export interface ExaSimilarLink {
  title: string
  url: string
  text?: string
  summary?: string
  highlights?: string[]
  score: number
}

export interface ExaFindSimilarLinksResponse extends ToolResponse {
  output: {
    similarLinks: ExaSimilarLink[]
  }
}

// Answer tool types
export interface ExaAnswerParams extends ExaBaseParams {
  query: string
  text?: boolean
}

export interface ExaAnswerResponse extends ToolResponse {
  output: {
    answer: string
    citations: {
      title: string
      url: string
      text: string
    }[]
  }
}

// Research tool types
export interface ExaResearchParams extends ExaBaseParams {
  query: string
  model?: 'exa-research-fast' | 'exa-research' | 'exa-research-pro'
}

export interface ExaResearchResponse extends ToolResponse {
  output: {
    taskId?: string
    research: {
      title: string
      url: string
      summary: string
      text?: string
      publishedDate?: string
      author?: string
      score: number
    }[]
  }
}

export type ExaResponse =
  | ExaSearchResponse
  | ExaGetContentsResponse
  | ExaFindSimilarLinksResponse
  | ExaAnswerResponse
  | ExaResearchResponse
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/file/index.ts

```typescript
import { fileParserTool } from '@/tools/file/parser'

export const fileParseTool = fileParserTool
```

--------------------------------------------------------------------------------

---[FILE: parser.ts]---
Location: sim-main/apps/sim/tools/file/parser.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  FileParseResult,
  FileParserInput,
  FileParserOutput,
  FileParserOutputData,
} from '@/tools/file/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('FileParserTool')

export const fileParserTool: ToolConfig<FileParserInput, FileParserOutput> = {
  id: 'file_parser',
  name: 'File Parser',
  description: 'Parse one or more uploaded files or files from URLs (text, PDF, CSV, images, etc.)',
  version: '1.0.0',

  params: {
    filePath: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Path to the file(s). Can be a single path, URL, or an array of paths.',
    },
    fileType: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'Type of file to parse (auto-detected if not specified)',
    },
  },

  request: {
    url: '/api/files/parse',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: any) => {
      logger.info('Request parameters received by tool body:', params)

      if (!params) {
        logger.error('Tool body received no parameters')
        throw new Error('No parameters provided to tool body')
      }

      let determinedFilePath: string | string[] | null = null
      const determinedFileType: string | undefined = params.fileType

      // Determine the file path(s) based on input parameters.
      // Precedence: direct filePath > file array > single file object > legacy files array
      // 1. Check for direct filePath (URL or single path from upload)
      if (params.filePath) {
        logger.info('Tool body found direct filePath:', params.filePath)
        determinedFilePath = params.filePath
      }
      // 2. Check for file upload (array)
      else if (params.file && Array.isArray(params.file) && params.file.length > 0) {
        logger.info('Tool body processing file array upload')
        const filePaths = params.file.map((file: any) => file.path)
        determinedFilePath = filePaths // Always send as array
      }
      // 3. Check for file upload (single object)
      else if (params.file?.path) {
        logger.info('Tool body processing single file object upload')
        determinedFilePath = params.file.path
      }
      // 4. Check for deprecated multiple files case (from older blocks?)
      else if (params.files && Array.isArray(params.files)) {
        logger.info('Tool body processing legacy files array:', params.files.length)
        if (params.files.length > 0) {
          determinedFilePath = params.files.map((file: any) => file.path)
        } else {
          logger.warn('Legacy files array provided but is empty')
        }
      }

      // Final check if filePath was determined
      if (!determinedFilePath) {
        logger.error('Tool body could not determine filePath from parameters:', params)
        throw new Error('Missing required parameter: filePath')
      }

      logger.info('Tool body determined filePath:', determinedFilePath)
      return {
        filePath: determinedFilePath,
        fileType: determinedFileType,
        workspaceId: params.workspaceId || params._context?.workspaceId,
      }
    },
  },

  transformResponse: async (response: Response): Promise<FileParserOutput> => {
    logger.info('Received response status:', response.status)

    const result = await response.json()
    logger.info('Response parsed successfully')

    // Handle multiple files response
    if (result.results) {
      logger.info('Processing multiple files response')

      // Extract individual file results
      const fileResults = result.results.map((fileResult: any) => {
        return fileResult.output || fileResult
      })

      // Combine all file contents with clear dividers
      const combinedContent = fileResults
        .map((file: FileParseResult, index: number) => {
          const divider = `\n${'='.repeat(80)}\n`

          return file.content + (index < fileResults.length - 1 ? divider : '')
        })
        .join('\n')

      // Create the base output
      const output: FileParserOutputData = {
        files: fileResults,
        combinedContent,
      }

      return {
        success: true,
        output,
      }
    }

    // Handle single file response
    logger.info('Successfully parsed file:', result.output?.name || 'unknown')

    // For a single file, create the output with just array format
    const output: FileParserOutputData = {
      files: [result.output || result],
      combinedContent: result.output?.content || result.content || '',
    }

    return {
      success: true,
      output,
    }
  },

  outputs: {
    files: { type: 'array', description: 'Array of parsed files' },
    combinedContent: { type: 'string', description: 'Combined content of all parsed files' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/file/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface FileParserInput {
  filePath: string | string[]
  fileType?: string
}

export interface FileParseResult {
  content: string
  fileType: string
  size: number
  name: string
  binary: boolean
  metadata?: Record<string, any>
}

export interface FileParserOutputData {
  files: FileParseResult[]
  combinedContent: string
  [key: string]: any
}

export interface FileParserOutput extends ToolResponse {
  output: FileParserOutputData
}
```

--------------------------------------------------------------------------------

````
