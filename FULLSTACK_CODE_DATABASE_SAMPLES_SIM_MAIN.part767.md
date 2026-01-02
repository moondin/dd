---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 767
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 767 of 933)

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

---[FILE: update.ts]---
Location: sim-main/apps/sim/tools/supabase/update.ts

```typescript
import type { SupabaseUpdateParams, SupabaseUpdateResponse } from '@/tools/supabase/types'
import type { ToolConfig } from '@/tools/types'

export const updateTool: ToolConfig<SupabaseUpdateParams, SupabaseUpdateResponse> = {
  id: 'supabase_update',
  name: 'Supabase Update Row',
  description: 'Update rows in a Supabase table based on filter criteria',
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
      description: 'The name of the Supabase table to update',
    },
    filter: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'PostgREST filter to identify rows to update (e.g., "id=eq.123")',
    },
    data: {
      type: 'object',
      required: true,
      visibility: 'user-or-llm',
      description: 'Data to update in the matching rows',
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
      // Construct the URL for the Supabase REST API with select to return updated data
      let url = `https://${params.projectId}.supabase.co/rest/v1/${params.table}?select=*`

      // Add filters (required for update) - using PostgREST syntax
      if (params.filter?.trim()) {
        url += `&${params.filter.trim()}`
      }

      return url
    },
    method: 'PATCH',
    headers: (params) => ({
      apikey: params.apiKey,
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }),
    body: (params) => params.data,
  },

  transformResponse: async (response: Response) => {
    const text = await response.text()
    let data

    if (text?.trim()) {
      try {
        data = JSON.parse(text)
      } catch (parseError) {
        throw new Error(`Failed to parse Supabase response: ${parseError}`)
      }
    } else {
      data = []
    }

    const updatedCount = Array.isArray(data) ? data.length : 0

    if (updatedCount === 0) {
      return {
        success: true,
        output: {
          message: 'No rows were updated (no matching records found)',
          results: data,
        },
        error: undefined,
      }
    }

    return {
      success: true,
      output: {
        message: `Successfully updated ${updatedCount} row${updatedCount === 1 ? '' : 's'}`,
        results: data,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    results: { type: 'array', description: 'Array of updated records' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: upsert.ts]---
Location: sim-main/apps/sim/tools/supabase/upsert.ts

```typescript
import type { SupabaseUpsertParams, SupabaseUpsertResponse } from '@/tools/supabase/types'
import type { ToolConfig } from '@/tools/types'

export const upsertTool: ToolConfig<SupabaseUpsertParams, SupabaseUpsertResponse> = {
  id: 'supabase_upsert',
  name: 'Supabase Upsert',
  description: 'Insert or update data in a Supabase table (upsert operation)',
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
      description: 'The name of the Supabase table to upsert data into',
    },
    data: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description: 'The data to upsert (insert or update) - array of objects or a single object',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase service role secret key',
    },
  },

  request: {
    url: (params) => `https://${params.projectId}.supabase.co/rest/v1/${params.table}?select=*`,
    method: 'POST',
    headers: (params) => ({
      apikey: params.apiKey,
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation,resolution=merge-duplicates',
    }),
    body: (params) => {
      // Prepare the data - if it's an object but not an array, wrap it in an array
      const dataToSend =
        typeof params.data === 'object' && !Array.isArray(params.data) ? [params.data] : params.data

      return dataToSend
    },
  },

  transformResponse: async (response: Response) => {
    const text = await response.text()

    if (!text || text.trim() === '') {
      return {
        success: true,
        output: {
          message: 'Successfully upserted data into Supabase (no data returned)',
          results: [],
        },
        error: undefined,
      }
    }

    let data
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      throw new Error(`Failed to parse Supabase response: ${parseError}`)
    }

    // Check if results array is empty and provide better feedback
    const resultsArray = Array.isArray(data) ? data : [data]
    const isEmpty = resultsArray.length === 0 || (resultsArray.length === 1 && !resultsArray[0])

    if (isEmpty) {
      return {
        success: false,
        output: {
          message: 'No data was upserted into Supabase',
          results: data,
        },
        error:
          'No data was upserted into Supabase. This usually indicates invalid data format or schema mismatch. Please check that your JSON is valid and matches your table schema.',
      }
    }

    const upsertedCount = resultsArray.length
    return {
      success: true,
      output: {
        message: `Successfully upserted ${upsertedCount} row${upsertedCount === 1 ? '' : 's'} into Supabase`,
        results: data,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    results: { type: 'array', description: 'Array of upserted records' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: vector_search.ts]---
Location: sim-main/apps/sim/tools/supabase/vector_search.ts

```typescript
import type {
  SupabaseVectorSearchParams,
  SupabaseVectorSearchResponse,
} from '@/tools/supabase/types'
import type { ToolConfig } from '@/tools/types'

export const vectorSearchTool: ToolConfig<
  SupabaseVectorSearchParams,
  SupabaseVectorSearchResponse
> = {
  id: 'supabase_vector_search',
  name: 'Supabase Vector Search',
  description: 'Perform similarity search using pgvector in a Supabase table',
  version: '1.0',

  params: {
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Supabase project ID (e.g., jdrkgepadsdopsntdlom)',
    },
    functionName: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'The name of the PostgreSQL function that performs vector search (e.g., match_documents)',
    },
    queryEmbedding: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description: 'The query vector/embedding to search for similar items',
    },
    matchThreshold: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Minimum similarity threshold (0-1), typically 0.7-0.9',
    },
    matchCount: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Maximum number of results to return (default: 10)',
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
      // Use RPC endpoint for calling PostgreSQL functions
      return `https://${params.projectId}.supabase.co/rest/v1/rpc/${params.functionName}`
    },
    method: 'POST',
    headers: (params) => ({
      apikey: params.apiKey,
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      // Build the RPC call parameters
      const rpcParams: Record<string, any> = {
        query_embedding: params.queryEmbedding,
      }

      // Add optional parameters if provided
      if (params.matchThreshold !== undefined) {
        rpcParams.match_threshold = Number(params.matchThreshold)
      }

      if (params.matchCount !== undefined) {
        rpcParams.match_count = Number(params.matchCount)
      }

      return rpcParams
    },
  },

  transformResponse: async (response: Response) => {
    let data
    try {
      data = await response.json()
    } catch (parseError) {
      throw new Error(`Failed to parse Supabase vector search response: ${parseError}`)
    }

    const resultCount = Array.isArray(data) ? data.length : 0

    if (resultCount === 0) {
      return {
        success: true,
        output: {
          message: 'No similar vectors found matching the search criteria',
          results: data,
        },
        error: undefined,
      }
    }

    return {
      success: true,
      output: {
        message: `Successfully found ${resultCount} similar vector${resultCount === 1 ? '' : 's'}`,
        results: data,
      },
      error: undefined,
    }
  },

  outputs: {
    message: { type: 'string', description: 'Operation status message' },
    results: {
      type: 'array',
      description:
        'Array of records with similarity scores from the vector search. Each record includes a similarity field (0-1) indicating how similar it is to the query vector.',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: crawl.ts]---
Location: sim-main/apps/sim/tools/tavily/crawl.ts

```typescript
import type { CrawlResponse, TavilyCrawlParams } from '@/tools/tavily/types'
import type { ToolConfig } from '@/tools/types'

export const crawlTool: ToolConfig<TavilyCrawlParams, CrawlResponse> = {
  id: 'tavily_crawl',
  name: 'Tavily Crawl',
  description:
    "Systematically crawl and extract content from websites using Tavily's crawl API. Supports depth control, path filtering, domain restrictions, and natural language instructions for targeted crawling.",
  version: '1.0.0',

  params: {
    url: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The root URL to begin the crawl',
    },
    instructions: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Natural language directions for the crawler (costs 2 credits per 10 pages)',
    },
    max_depth: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'How far from base URL to explore (1-5, default: 1)',
    },
    max_breadth: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Links followed per page level (≥1, default: 20)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Total links processed before stopping (≥1, default: 50)',
    },
    select_paths: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated regex patterns to include specific URL paths (e.g., /docs/.*)',
    },
    select_domains: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated regex patterns to restrict crawling to certain domains',
    },
    exclude_paths: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated regex patterns to skip specific URL paths',
    },
    exclude_domains: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated regex patterns to block certain domains',
    },
    allow_external: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Include external domain links in results (default: true)',
    },
    include_images: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Incorporate images in crawl output',
    },
    extract_depth: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Extraction depth: basic (1 credit/5 pages) or advanced (2 credits/5 pages)',
    },
    format: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Output format: markdown or text (default: markdown)',
    },
    include_favicon: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Add favicon URL for each result',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Tavily API Key',
    },
  },

  request: {
    url: 'https://api.tavily.com/crawl',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = {
        url: params.url,
      }

      if (params.instructions) body.instructions = params.instructions
      if (params.max_depth) body.max_depth = Number(params.max_depth)
      if (params.max_breadth) body.max_breadth = Number(params.max_breadth)
      if (params.limit) body.limit = Number(params.limit)
      if (params.select_paths) {
        body.select_paths = params.select_paths.split(',').map((p) => p.trim())
      }
      if (params.select_domains) {
        body.select_domains = params.select_domains.split(',').map((d) => d.trim())
      }
      if (params.exclude_paths) {
        body.exclude_paths = params.exclude_paths.split(',').map((p) => p.trim())
      }
      if (params.exclude_domains) {
        body.exclude_domains = params.exclude_domains.split(',').map((d) => d.trim())
      }
      if (params.allow_external !== undefined) body.allow_external = params.allow_external
      if (params.include_images !== undefined) body.include_images = params.include_images
      if (params.extract_depth) body.extract_depth = params.extract_depth
      if (params.format) body.format = params.format
      if (params.include_favicon !== undefined) body.include_favicon = params.include_favicon

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        base_url: data.base_url,
        results: data.results || [],
        response_time: data.response_time,
        ...(data.request_id && { request_id: data.request_id }),
      },
    }
  },

  outputs: {
    base_url: { type: 'string', description: 'The base URL that was crawled' },
    results: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'The crawled page URL' },
          raw_content: { type: 'string', description: 'Extracted content from the page' },
          favicon: { type: 'string', description: 'Favicon URL (if requested)' },
        },
      },
      description: 'Array of crawled pages with extracted content',
    },
    response_time: { type: 'number', description: 'Time taken for the crawl request in seconds' },
    request_id: { type: 'string', description: 'Unique identifier for support reference' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: extract.ts]---
Location: sim-main/apps/sim/tools/tavily/extract.ts

```typescript
import type { TavilyExtractParams, TavilyExtractResponse } from '@/tools/tavily/types'
import type { ToolConfig } from '@/tools/types'

export const extractTool: ToolConfig<TavilyExtractParams, TavilyExtractResponse> = {
  id: 'tavily_extract',
  name: 'Tavily Extract',
  description:
    "Extract raw content from multiple web pages simultaneously using Tavily's extraction API. Supports basic and advanced extraction depths with detailed error reporting for failed URLs.",
  version: '1.0.0',

  params: {
    urls: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'URL or array of URLs to extract content from',
    },
    extract_depth: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The depth of extraction (basic=1 credit/5 URLs, advanced=2 credits/5 URLs)',
    },
    format: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Output format: markdown or text (default: markdown)',
    },
    include_images: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Incorporate images in extraction output',
    },
    include_favicon: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Add favicon URL for each result',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Tavily API Key',
    },
  },

  request: {
    url: 'https://api.tavily.com/extract',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = {
        urls: typeof params.urls === 'string' ? [params.urls] : params.urls,
      }

      if (params.extract_depth) body.extract_depth = params.extract_depth
      if (params.format) body.format = params.format
      if (params.include_images !== undefined) body.include_images = params.include_images
      if (params.include_favicon !== undefined) body.include_favicon = params.include_favicon

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        results: data.results || [],
        ...(data.failed_results && { failed_results: data.failed_results }),
        response_time: data.response_time,
      },
    }
  },

  outputs: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'The URL that was extracted' },
          raw_content: { type: 'string', description: 'The raw text content from the webpage' },
          favicon: { type: 'string', description: 'Favicon URL (if requested)' },
        },
      },
      description: 'Successfully extracted content from URLs',
    },
    failed_results: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'The URL that failed extraction' },
          error: { type: 'string', description: 'Error message for the failed extraction' },
        },
      },
      description: 'URLs that failed to extract content',
    },
    response_time: {
      type: 'number',
      description: 'Time taken for the extraction request in seconds',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/tavily/index.ts

```typescript
import { crawlTool } from '@/tools/tavily/crawl'
import { extractTool } from '@/tools/tavily/extract'
import { mapTool } from '@/tools/tavily/map'
import { searchTool } from '@/tools/tavily/search'

export const tavilyExtractTool = extractTool
export const tavilySearchTool = searchTool
export const tavilyCrawlTool = crawlTool
export const tavilyMapTool = mapTool
```

--------------------------------------------------------------------------------

---[FILE: map.ts]---
Location: sim-main/apps/sim/tools/tavily/map.ts

```typescript
import type { MapResponse, TavilyMapParams } from '@/tools/tavily/types'
import type { ToolConfig } from '@/tools/types'

export const mapTool: ToolConfig<TavilyMapParams, MapResponse> = {
  id: 'tavily_map',
  name: 'Tavily Map',
  description:
    "Discover and visualize website structure using Tavily's map API. Maps out all accessible URLs from a base URL with depth control, path filtering, and domain restrictions.",
  version: '1.0.0',

  params: {
    url: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The root URL to begin mapping',
    },
    instructions: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Natural language guidance for mapping behavior (costs 2 credits per 10 pages)',
    },
    max_depth: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'How far from base URL to explore (1-5, default: 1)',
    },
    max_breadth: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Links to follow per level (default: 20)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Total links to process (default: 50)',
    },
    select_paths: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated regex patterns for URL path filtering (e.g., /docs/.*)',
    },
    select_domains: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated regex patterns to restrict mapping to specific domains',
    },
    exclude_paths: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated regex patterns to exclude specific URL paths',
    },
    exclude_domains: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated regex patterns to exclude domains',
    },
    allow_external: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Include external domain links in results (default: true)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Tavily API Key',
    },
  },

  request: {
    url: 'https://api.tavily.com/map',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = {
        url: params.url,
      }

      if (params.instructions) body.instructions = params.instructions
      if (params.max_depth) body.max_depth = Number(params.max_depth)
      if (params.max_breadth) body.max_breadth = Number(params.max_breadth)
      if (params.limit) body.limit = Number(params.limit)
      if (params.select_paths) {
        body.select_paths = params.select_paths.split(',').map((p) => p.trim())
      }
      if (params.select_domains) {
        body.select_domains = params.select_domains.split(',').map((d) => d.trim())
      }
      if (params.exclude_paths) {
        body.exclude_paths = params.exclude_paths.split(',').map((p) => p.trim())
      }
      if (params.exclude_domains) {
        body.exclude_domains = params.exclude_domains.split(',').map((d) => d.trim())
      }
      if (params.allow_external !== undefined) body.allow_external = params.allow_external

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        base_url: data.base_url,
        results: data.results || [],
        response_time: data.response_time,
        ...(data.request_id && { request_id: data.request_id }),
      },
    }
  },

  outputs: {
    base_url: { type: 'string', description: 'The base URL that was mapped' },
    results: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'Discovered URL' },
        },
      },
      description: 'Array of discovered URLs during mapping',
    },
    response_time: { type: 'number', description: 'Time taken for the map request in seconds' },
    request_id: { type: 'string', description: 'Unique identifier for support reference' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search.ts]---
Location: sim-main/apps/sim/tools/tavily/search.ts

```typescript
import type { TavilySearchParams, TavilySearchResponse } from '@/tools/tavily/types'
import type { ToolConfig } from '@/tools/types'

export const searchTool: ToolConfig<TavilySearchParams, TavilySearchResponse> = {
  id: 'tavily_search',
  name: 'Tavily Search',
  description:
    "Perform AI-powered web searches using Tavily's search API. Returns structured results with titles, URLs, snippets, and optional raw content, optimized for relevance and accuracy.",
  version: '1.0.0',

  params: {
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The search query to execute',
    },
    max_results: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of results (1-20)',
    },
    topic: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Category type: general, news, or finance (default: general)',
    },
    search_depth: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Search scope: basic (1 credit) or advanced (2 credits) (default: basic)',
    },
    include_answer: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'LLM-generated response: true/basic for quick answer or advanced for detailed',
    },
    include_raw_content: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Parsed HTML content: true/markdown or text format',
    },
    include_images: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Include image search results',
    },
    include_image_descriptions: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Add descriptive text for images',
    },
    include_favicon: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Include favicon URLs',
    },
    chunks_per_source: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of relevant chunks per source (1-3, default: 3)',
    },
    time_range: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by recency: day/d, week/w, month/m, year/y',
    },
    start_date: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Earliest publication date (YYYY-MM-DD format)',
    },
    end_date: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Latest publication date (YYYY-MM-DD format)',
    },
    include_domains: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated list of domains to whitelist (max 300)',
    },
    exclude_domains: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Comma-separated list of domains to blacklist (max 150)',
    },
    country: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Boost results from specified country (general topic only)',
    },
    auto_parameters: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Automatic parameter configuration based on query intent',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Tavily API Key',
    },
  },

  request: {
    url: 'https://api.tavily.com/search',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, any> = {
        query: params.query,
      }

      // Only include optional parameters if explicitly set
      if (params.max_results) body.max_results = Number(params.max_results)
      if (params.topic) body.topic = params.topic
      if (params.search_depth) body.search_depth = params.search_depth

      // Handle include_answer: only include if not empty and not "false"
      if (
        params.include_answer &&
        params.include_answer !== 'false' &&
        params.include_answer !== ''
      ) {
        // Accept "basic" or "advanced" as strings, convert "true" to boolean
        body.include_answer = params.include_answer === 'true' ? true : params.include_answer
      }

      // Handle include_raw_content: only include if not empty and not "false"
      if (
        params.include_raw_content &&
        params.include_raw_content !== 'false' &&
        params.include_raw_content !== ''
      ) {
        // Accept "markdown" or "text" as strings, convert "true" to boolean
        body.include_raw_content =
          params.include_raw_content === 'true' ? true : params.include_raw_content
      }

      if (params.include_images !== undefined) body.include_images = params.include_images
      if (params.include_image_descriptions !== undefined)
        body.include_image_descriptions = params.include_image_descriptions
      if (params.include_favicon !== undefined) body.include_favicon = params.include_favicon
      if (params.chunks_per_source) body.chunks_per_source = Number(params.chunks_per_source)
      if (params.time_range) body.time_range = params.time_range
      if (params.start_date) body.start_date = params.start_date
      if (params.end_date) body.end_date = params.end_date
      if (params.include_domains) {
        body.include_domains = params.include_domains.split(',').map((d) => d.trim())
      }
      if (params.exclude_domains) {
        body.exclude_domains = params.exclude_domains.split(',').map((d) => d.trim())
      }
      if (params.country) body.country = params.country
      if (params.auto_parameters !== undefined) body.auto_parameters = params.auto_parameters

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        query: data.query,
        results: data.results.map((result: any) => ({
          title: result.title,
          url: result.url,
          snippet: result.snippet,
          ...(result.score !== undefined && { score: result.score }),
          ...(result.raw_content && { raw_content: result.raw_content }),
          ...(result.favicon && { favicon: result.favicon }),
        })),
        ...(data.answer && { answer: data.answer }),
        ...(data.images && { images: data.images }),
        ...(data.auto_parameters && { auto_parameters: data.auto_parameters }),
        response_time: data.response_time,
      },
    }
  },

  outputs: {
    query: { type: 'string', description: 'The search query that was executed' },
    results: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          url: { type: 'string' },
          snippet: { type: 'string' },
          score: { type: 'number' },
          raw_content: { type: 'string' },
          favicon: { type: 'string' },
        },
      },
      description: 'Search results with titles, URLs, content snippets, and optional metadata',
    },
    answer: { type: 'string', description: 'LLM-generated answer to the query (if requested)' },
    images: {
      type: 'array',
      items: { type: 'string' },
      description: 'Query-related images (if requested)',
    },
    auto_parameters: {
      type: 'object',
      description: 'Automatically selected parameters based on query intent (if enabled)',
    },
    response_time: { type: 'number', description: 'Time taken for the search request in seconds' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/tavily/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface TavilySearchResult {
  title: string
  url: string
  content: string
  score: number
  images?: string[]
  raw_content?: string
}

export interface TavilySearchResponse extends ToolResponse {
  output: {
    results: TavilySearchResult[]
    answer?: string
    query: string
    images?: string[]
    rawContent?: string
  }
}

export interface TavilyExtractResponse extends ToolResponse {
  output: {
    content: string
    title: string
    url: string
    rawContent?: string
  }
}

export interface TavilyExtractParams {
  urls: string | string[]
  apiKey: string
  extract_depth?: 'basic' | 'advanced'
  format?: string
  include_images?: boolean
  include_favicon?: boolean
}

interface ExtractResult {
  url: string
  raw_content: string
}

export interface ExtractResponse extends ToolResponse {
  output: {
    results: ExtractResult[]
    failed_results?: Array<{
      url: string
      error: string
    }>
    response_time: number
  }
}

export interface TavilySearchParams {
  query: string
  apiKey: string
  max_results?: number
  topic?: string
  search_depth?: string
  include_answer?: string
  include_raw_content?: string
  include_images?: boolean
  include_image_descriptions?: boolean
  include_favicon?: boolean
  chunks_per_source?: number
  time_range?: string
  start_date?: string
  end_date?: string
  include_domains?: string
  exclude_domains?: string
  country?: string
  auto_parameters?: boolean
}

interface SearchResult {
  title: string
  url: string
  snippet: string
  raw_content?: string
}

export interface SearchResponse extends ToolResponse {
  output: {
    query: string
    results: SearchResult[]
    response_time: number
  }
}

export type TavilyResponse = TavilySearchResponse | TavilyExtractResponse

// Crawl API types
export interface TavilyCrawlParams {
  url: string
  apiKey: string
  instructions?: string
  max_depth?: number
  max_breadth?: number
  limit?: number
  select_paths?: string
  select_domains?: string
  exclude_paths?: string
  exclude_domains?: string
  allow_external?: boolean
  include_images?: boolean
  extract_depth?: string
  format?: string
  include_favicon?: boolean
}

interface CrawlResult {
  url: string
  raw_content: string
  favicon?: string
}

export interface CrawlResponse extends ToolResponse {
  output: {
    base_url: string
    results: CrawlResult[]
    response_time: number
    request_id?: string
  }
}

export interface TavilyCrawlResponse extends ToolResponse {
  output: {
    base_url: string
    results: CrawlResult[]
    response_time: number
    request_id?: string
  }
}

// Map API types
export interface TavilyMapParams {
  url: string
  apiKey: string
  instructions?: string
  max_depth?: number
  max_breadth?: number
  limit?: number
  select_paths?: string
  select_domains?: string
  exclude_paths?: string
  exclude_domains?: string
  allow_external?: boolean
}

interface MapResult {
  url: string
}

export interface MapResponse extends ToolResponse {
  output: {
    base_url: string
    results: MapResult[]
    response_time: number
    request_id?: string
  }
}

export interface TavilyMapResponse extends ToolResponse {
  output: {
    base_url: string
    results: MapResult[]
    response_time: number
    request_id?: string
  }
}
```

--------------------------------------------------------------------------------

---[FILE: delete_message.ts]---
Location: sim-main/apps/sim/tools/telegram/delete_message.ts

```typescript
import { ErrorExtractorId } from '@/tools/error-extractors'
import type {
  TelegramDeleteMessageParams,
  TelegramDeleteMessageResponse,
} from '@/tools/telegram/types'
import type { ToolConfig } from '@/tools/types'

export const telegramDeleteMessageTool: ToolConfig<
  TelegramDeleteMessageParams,
  TelegramDeleteMessageResponse
> = {
  id: 'telegram_delete_message',
  name: 'Telegram Delete Message',
  description:
    'Delete messages in Telegram channels or chats through the Telegram Bot API. Requires the message ID of the message to delete.',
  version: '1.0.0',
  errorExtractor: ErrorExtractorId.TELEGRAM_DESCRIPTION,

  params: {
    botToken: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Telegram Bot API Token',
    },
    chatId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Target Telegram chat ID',
    },
    messageId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Message ID to delete',
    },
  },

  request: {
    url: (params: TelegramDeleteMessageParams) =>
      `https://api.telegram.org/bot${params.botToken}/deleteMessage`,
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: TelegramDeleteMessageParams) => ({
      chat_id: params.chatId,
      message_id: params.messageId,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!data.ok) {
      const errorMessage = data.description || data.error || 'Failed to delete message'
      throw new Error(errorMessage)
    }

    return {
      success: true,
      output: {
        message: 'Message deleted successfully',
        data: {
          ok: data.ok,
          deleted: data.result,
        },
      },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success or error message' },
    data: {
      type: 'object',
      description: 'Delete operation result',
      properties: {
        ok: { type: 'boolean', description: 'API response success status' },
        deleted: {
          type: 'boolean',
          description: 'Whether the message was successfully deleted',
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/telegram/index.ts

```typescript
import { telegramDeleteMessageTool } from '@/tools/telegram/delete_message'
import { telegramMessageTool } from '@/tools/telegram/message'
import { telegramSendAnimationTool } from '@/tools/telegram/send_animation'
import { telegramSendAudioTool } from '@/tools/telegram/send_audio'
import { telegramSendDocumentTool } from '@/tools/telegram/send_document'
import { telegramSendPhotoTool } from '@/tools/telegram/send_photo'
import { telegramSendVideoTool } from '@/tools/telegram/send_video'

export {
  telegramSendAnimationTool,
  telegramSendAudioTool,
  telegramDeleteMessageTool,
  telegramMessageTool,
  telegramSendDocumentTool,
  telegramSendPhotoTool,
  telegramSendVideoTool,
}
```

--------------------------------------------------------------------------------

````
