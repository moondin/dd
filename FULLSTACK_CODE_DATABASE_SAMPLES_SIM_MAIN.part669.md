---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 669
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 669 of 933)

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

---[FILE: crawl.ts]---
Location: sim-main/apps/sim/tools/firecrawl/crawl.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { FirecrawlCrawlParams, FirecrawlCrawlResponse } from '@/tools/firecrawl/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('FirecrawlCrawlTool')

const POLL_INTERVAL_MS = 5000 // 5 seconds between polls
const MAX_POLL_TIME_MS = 300000 // 5 minutes maximum polling time

export const crawlTool: ToolConfig<FirecrawlCrawlParams, FirecrawlCrawlResponse> = {
  id: 'firecrawl_crawl',
  name: 'Firecrawl Crawl',
  description: 'Crawl entire websites and extract structured content from all accessible pages',
  version: '1.0.0',
  params: {
    url: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The website URL to crawl',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of pages to crawl (default: 100)',
    },
    onlyMainContent: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Extract only main content from pages',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Firecrawl API Key',
    },
  },
  request: {
    url: 'https://api.firecrawl.dev/v2/crawl',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        url: params.url,
        limit: Number(params.limit) || 100,
        scrapeOptions: params.scrapeOptions || {
          formats: ['markdown'],
          onlyMainContent: params.onlyMainContent || false,
        },
      }

      if (params.prompt) body.prompt = params.prompt
      if (params.maxDiscoveryDepth) body.maxDiscoveryDepth = Number(params.maxDiscoveryDepth)
      if (params.sitemap) body.sitemap = params.sitemap
      if (typeof params.crawlEntireDomain === 'boolean')
        body.crawlEntireDomain = params.crawlEntireDomain
      if (typeof params.allowExternalLinks === 'boolean')
        body.allowExternalLinks = params.allowExternalLinks
      if (typeof params.allowSubdomains === 'boolean') body.allowSubdomains = params.allowSubdomains
      if (typeof params.ignoreQueryParameters === 'boolean')
        body.ignoreQueryParameters = params.ignoreQueryParameters
      if (params.delay) body.delay = Number(params.delay)
      if (params.maxConcurrency) body.maxConcurrency = Number(params.maxConcurrency)
      if (params.excludePaths) body.excludePaths = params.excludePaths
      if (params.includePaths) body.includePaths = params.includePaths
      if (params.webhook) body.webhook = params.webhook
      if (typeof params.zeroDataRetention === 'boolean')
        body.zeroDataRetention = params.zeroDataRetention

      return body
    },
  },
  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        jobId: data.jobId || data.id,
        pages: [],
        total: 0,
        creditsUsed: 0,
      },
    }
  },
  postProcess: async (result, params) => {
    if (!result.success) {
      return result
    }

    const jobId = result.output.jobId
    logger.info(`Firecrawl crawl job ${jobId} created, polling for completion...`)

    let elapsedTime = 0

    while (elapsedTime < MAX_POLL_TIME_MS) {
      try {
        const statusResponse = await fetch(`https://api.firecrawl.dev/v2/crawl/${jobId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${params.apiKey}`,
            'Content-Type': 'application/json',
          },
        })

        if (!statusResponse.ok) {
          throw new Error(`Failed to get crawl status: ${statusResponse.statusText}`)
        }

        const crawlData = await statusResponse.json()
        logger.info(`Firecrawl crawl job ${jobId} status: ${crawlData.status}`)

        if (crawlData.status === 'completed') {
          result.output = {
            pages: crawlData.data || [],
            total: crawlData.total || 0,
            creditsUsed: crawlData.creditsUsed || 0,
          }
          return result
        }

        if (crawlData.status === 'failed') {
          return {
            ...result,
            success: false,
            error: `Crawl job failed: ${crawlData.error || 'Unknown error'}`,
          }
        }

        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
        elapsedTime += POLL_INTERVAL_MS
      } catch (error: any) {
        logger.error('Error polling for crawl job status:', {
          message: error.message || 'Unknown error',
          jobId,
        })

        return {
          ...result,
          success: false,
          error: `Error polling for crawl job status: ${error.message || 'Unknown error'}`,
        }
      }
    }

    logger.warn(
      `Crawl job ${jobId} did not complete within the maximum polling time (${MAX_POLL_TIME_MS / 1000}s)`
    )
    return {
      ...result,
      success: false,
      error: `Crawl job did not complete within the maximum polling time (${MAX_POLL_TIME_MS / 1000}s)`,
    }
  },

  outputs: {
    pages: {
      type: 'array',
      description: 'Array of crawled pages with their content and metadata',
      items: {
        type: 'object',
        properties: {
          markdown: { type: 'string', description: 'Page content in markdown format' },
          html: { type: 'string', description: 'Page HTML content' },
          metadata: {
            type: 'object',
            description: 'Page metadata',
            properties: {
              title: { type: 'string', description: 'Page title' },
              description: { type: 'string', description: 'Page description' },
              language: { type: 'string', description: 'Page language' },
              sourceURL: { type: 'string', description: 'Source URL of the page' },
              statusCode: { type: 'number', description: 'HTTP status code' },
            },
          },
        },
      },
    },
    total: { type: 'number', description: 'Total number of pages found during crawl' },
    creditsUsed: {
      type: 'number',
      description: 'Number of credits consumed by the crawl operation',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: extract.ts]---
Location: sim-main/apps/sim/tools/firecrawl/extract.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ExtractParams, ExtractResponse } from '@/tools/firecrawl/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('FirecrawlExtractTool')

const POLL_INTERVAL_MS = 5000 // 5 seconds between polls
const MAX_POLL_TIME_MS = 300000 // 5 minutes maximum polling time

export const extractTool: ToolConfig<ExtractParams, ExtractResponse> = {
  id: 'firecrawl_extract',
  name: 'Firecrawl Extract',
  description:
    'Extract structured data from entire webpages using natural language prompts and JSON schema. Powerful agentic feature for intelligent data extraction.',
  version: '1.0.0',

  params: {
    urls: {
      type: 'json',
      required: true,
      visibility: 'user-or-llm',
      description: 'Array of URLs to extract data from (supports glob format)',
    },
    prompt: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Natural language guidance for the extraction process',
    },
    schema: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'JSON Schema defining the structure of data to extract',
    },
    enableWebSearch: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Enable web search to find supplementary information (default: false)',
    },
    ignoreSitemap: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Ignore sitemap.xml files during scanning (default: false)',
    },
    includeSubdomains: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Extend scanning to subdomains (default: true)',
    },
    showSources: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Return data sources in the response (default: false)',
    },
    ignoreInvalidURLs: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Skip invalid URLs in the array (default: true)',
    },
    scrapeOptions: {
      type: 'json',
      required: false,
      visibility: 'hidden',
      description: 'Advanced scraping configuration options',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Firecrawl API key',
    },
  },

  request: {
    method: 'POST',
    url: 'https://api.firecrawl.dev/v2/extract',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        urls: params.urls,
      }

      if (params.prompt) body.prompt = params.prompt
      if (params.schema) body.schema = params.schema
      if (typeof params.enableWebSearch === 'boolean') body.enableWebSearch = params.enableWebSearch
      if (typeof params.ignoreSitemap === 'boolean') body.ignoreSitemap = params.ignoreSitemap
      if (typeof params.includeSubdomains === 'boolean')
        body.includeSubdomains = params.includeSubdomains
      if (typeof params.showSources === 'boolean') body.showSources = params.showSources
      if (typeof params.ignoreInvalidURLs === 'boolean')
        body.ignoreInvalidURLs = params.ignoreInvalidURLs

      if (params.scrapeOptions != null) {
        const cleanedScrapeOptions = Object.entries(params.scrapeOptions).reduce(
          (acc, [key, val]) => {
            if (val != null) {
              acc[key] = val
            }
            return acc
          },
          {} as Record<string, any>
        )
        if (Object.keys(cleanedScrapeOptions).length > 0) {
          body.scrapeOptions = cleanedScrapeOptions
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
        jobId: data.id,
        success: false,
        data: {},
      },
    }
  },
  postProcess: async (result, params) => {
    if (!result.success) {
      return result
    }

    const jobId = result.output.jobId
    logger.info(`Firecrawl extract job ${jobId} created, polling for completion...`)

    let elapsedTime = 0

    while (elapsedTime < MAX_POLL_TIME_MS) {
      try {
        const statusResponse = await fetch(`https://api.firecrawl.dev/v2/extract/${jobId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${params.apiKey}`,
            'Content-Type': 'application/json',
          },
        })

        if (!statusResponse.ok) {
          throw new Error(`Failed to get extract status: ${statusResponse.statusText}`)
        }

        const extractData = await statusResponse.json()
        logger.info(`Firecrawl extract job ${jobId} status: ${extractData.status}`)

        if (extractData.status === 'completed') {
          result.output = {
            jobId,
            success: true,
            data: extractData.data || {},
          }
          return result
        }

        if (extractData.status === 'failed') {
          return {
            ...result,
            success: false,
            error: `Extract job failed: ${extractData.error || 'Unknown error'}`,
          }
        }

        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
        elapsedTime += POLL_INTERVAL_MS
      } catch (error: any) {
        logger.error('Error polling for extract job status:', {
          message: error.message || 'Unknown error',
          jobId,
        })

        return {
          ...result,
          success: false,
          error: `Error polling for extract job status: ${error.message || 'Unknown error'}`,
        }
      }
    }

    logger.warn(
      `Extract job ${jobId} did not complete within the maximum polling time (${MAX_POLL_TIME_MS / 1000}s)`
    )
    return {
      ...result,
      success: false,
      error: `Extract job did not complete within the maximum polling time (${MAX_POLL_TIME_MS / 1000}s)`,
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the extraction operation was successful',
    },
    data: {
      type: 'object',
      description: 'Extracted structured data according to the schema or prompt',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/firecrawl/index.ts

```typescript
import { crawlTool } from '@/tools/firecrawl/crawl'
import { extractTool } from '@/tools/firecrawl/extract'
import { mapTool } from '@/tools/firecrawl/map'
import { scrapeTool } from '@/tools/firecrawl/scrape'
import { searchTool } from '@/tools/firecrawl/search'

export const firecrawlScrapeTool = scrapeTool
export const firecrawlSearchTool = searchTool
export const firecrawlCrawlTool = crawlTool
export const firecrawlMapTool = mapTool
export const firecrawlExtractTool = extractTool
```

--------------------------------------------------------------------------------

---[FILE: map.ts]---
Location: sim-main/apps/sim/tools/firecrawl/map.ts

```typescript
import type { MapParams, MapResponse } from '@/tools/firecrawl/types'
import type { ToolConfig } from '@/tools/types'

export const mapTool: ToolConfig<MapParams, MapResponse> = {
  id: 'firecrawl_map',
  name: 'Firecrawl Map',
  description:
    'Get a complete list of URLs from any website quickly and reliably. Useful for discovering all pages on a site without crawling them.',
  version: '1.0.0',

  params: {
    url: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The base URL to map and discover links from',
    },
    search: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter results by relevance to a search term (e.g., "blog")',
    },
    sitemap: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Controls sitemap usage: "skip", "include" (default), or "only"',
    },
    includeSubdomains: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Whether to include URLs from subdomains (default: true)',
    },
    ignoreQueryParameters: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Exclude URLs containing query strings (default: true)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of links to return (max: 100,000, default: 5,000)',
    },
    timeout: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Request timeout in milliseconds',
    },
    location: {
      type: 'json',
      required: false,
      visibility: 'hidden',
      description: 'Geographic context for proxying (country, languages)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Firecrawl API key',
    },
  },

  request: {
    method: 'POST',
    url: 'https://api.firecrawl.dev/v2/map',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        url: params.url,
      }

      if (params.search) body.search = params.search
      if (params.sitemap) body.sitemap = params.sitemap
      if (typeof params.includeSubdomains === 'boolean')
        body.includeSubdomains = params.includeSubdomains
      if (typeof params.ignoreQueryParameters === 'boolean')
        body.ignoreQueryParameters = params.ignoreQueryParameters
      if (params.limit) body.limit = Number(params.limit)
      if (params.timeout) body.timeout = Number(params.timeout)
      if (params.location) body.location = params.location

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: data.success,
      output: {
        success: data.success,
        links: data.links || [],
      },
    }
  },

  outputs: {
    success: {
      type: 'boolean',
      description: 'Whether the mapping operation was successful',
    },
    links: {
      type: 'array',
      description: 'Array of discovered URLs from the website',
      items: {
        type: 'string',
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: scrape.ts]---
Location: sim-main/apps/sim/tools/firecrawl/scrape.ts

```typescript
import type { ScrapeParams, ScrapeResponse } from '@/tools/firecrawl/types'
import type { ToolConfig } from '@/tools/types'

export const scrapeTool: ToolConfig<ScrapeParams, ScrapeResponse> = {
  id: 'firecrawl_scrape',
  name: 'Firecrawl Website Scraper',
  description:
    'Extract structured content from web pages with comprehensive metadata support. Converts content to markdown or HTML while capturing SEO metadata, Open Graph tags, and page information.',
  version: '1.0.0',

  params: {
    url: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The URL to scrape content from',
    },
    scrapeOptions: {
      type: 'json',
      required: false,
      visibility: 'hidden',
      description: 'Options for content scraping',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Firecrawl API key',
    },
  },

  request: {
    method: 'POST',
    url: 'https://api.firecrawl.dev/v2/scrape',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        url: params.url,
        formats: params.formats || params.scrapeOptions?.formats || ['markdown'],
      }

      if (typeof params.onlyMainContent === 'boolean') body.onlyMainContent = params.onlyMainContent
      if (params.includeTags) body.includeTags = params.includeTags
      if (params.excludeTags) body.excludeTags = params.excludeTags
      if (params.maxAge) body.maxAge = Number(params.maxAge)
      if (params.headers) body.headers = params.headers
      if (params.waitFor) body.waitFor = Number(params.waitFor)
      if (typeof params.mobile === 'boolean') body.mobile = params.mobile
      if (typeof params.skipTlsVerification === 'boolean')
        body.skipTlsVerification = params.skipTlsVerification
      if (params.timeout) body.timeout = Number(params.timeout)
      if (params.parsers) body.parsers = params.parsers
      if (params.actions) body.actions = params.actions
      if (params.location) body.location = params.location
      if (typeof params.removeBase64Images === 'boolean')
        body.removeBase64Images = params.removeBase64Images
      if (typeof params.blockAds === 'boolean') body.blockAds = params.blockAds
      if (params.proxy) body.proxy = params.proxy
      if (typeof params.storeInCache === 'boolean') body.storeInCache = params.storeInCache
      if (typeof params.zeroDataRetention === 'boolean')
        body.zeroDataRetention = params.zeroDataRetention

      if (params.scrapeOptions) {
        Object.assign(body, params.scrapeOptions)
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        markdown: data.data.markdown,
        html: data.data.html,
        metadata: data.data.metadata,
      },
    }
  },

  outputs: {
    markdown: { type: 'string', description: 'Page content in markdown format' },
    html: { type: 'string', description: 'Raw HTML content of the page' },
    metadata: {
      type: 'object',
      description: 'Page metadata including SEO and Open Graph information',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search.ts]---
Location: sim-main/apps/sim/tools/firecrawl/search.ts

```typescript
import type { SearchParams, SearchResponse } from '@/tools/firecrawl/types'
import type { ToolConfig } from '@/tools/types'

export const searchTool: ToolConfig<SearchParams, SearchResponse> = {
  id: 'firecrawl_search',
  name: 'Firecrawl Search',
  description: 'Search for information on the web using Firecrawl',
  version: '1.0.0',

  params: {
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The search query to use',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Firecrawl API key',
    },
  },

  request: {
    method: 'POST',
    url: 'https://api.firecrawl.dev/v2/search',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        query: params.query,
      }

      // Add optional parameters if provided (truthy check filters empty strings, null, undefined)
      if (params.limit) body.limit = Number(params.limit)
      if (params.sources) body.sources = params.sources
      if (params.categories) body.categories = params.categories
      if (params.tbs) body.tbs = params.tbs
      if (params.location) body.location = params.location
      if (params.country) body.country = params.country
      if (params.timeout) body.timeout = Number(params.timeout)
      if (typeof params.ignoreInvalidURLs === 'boolean')
        body.ignoreInvalidURLs = params.ignoreInvalidURLs
      if (params.scrapeOptions) body.scrapeOptions = params.scrapeOptions

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: {
        data: data.data,
      },
    }
  },

  outputs: {
    data: {
      type: 'array',
      description: 'Search results data',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          url: { type: 'string' },
          markdown: { type: 'string' },
          html: { type: 'string' },
          rawHtml: { type: 'string' },
          links: { type: 'array' },
          screenshot: { type: 'string' },
          metadata: { type: 'object' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/firecrawl/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

// Common types
export interface LocationConfig {
  country?: string
  languages?: string[]
}

export interface ScrapeOptions {
  formats?: string[]
  onlyMainContent?: boolean
  includeTags?: string[]
  excludeTags?: string[]
  maxAge?: number
  headers?: Record<string, string>
  waitFor?: number
  mobile?: boolean
  skipTlsVerification?: boolean
  timeout?: number
  parsers?: string[]
  actions?: Array<{
    type: string
    [key: string]: any
  }>
  location?: LocationConfig
  removeBase64Images?: boolean
  blockAds?: boolean
  proxy?: 'basic' | 'stealth' | 'auto'
  storeInCache?: boolean
}

export interface ScrapeParams {
  apiKey: string
  url: string
  scrapeOptions?: ScrapeOptions
  // Additional top-level scrape params
  onlyMainContent?: boolean
  formats?: string[]
  includeTags?: string[]
  excludeTags?: string[]
  maxAge?: number
  headers?: Record<string, string>
  waitFor?: number
  mobile?: boolean
  skipTlsVerification?: boolean
  timeout?: number
  parsers?: string[]
  actions?: Array<{
    type: string
    [key: string]: any
  }>
  location?: LocationConfig
  removeBase64Images?: boolean
  blockAds?: boolean
  proxy?: 'basic' | 'stealth' | 'auto'
  storeInCache?: boolean
  zeroDataRetention?: boolean
}

export interface SearchParams {
  apiKey: string
  query: string
  limit?: number
  sources?: ('web' | 'images' | 'news')[]
  categories?: ('github' | 'research' | 'pdf')[]
  tbs?: string
  location?: string
  country?: string
  timeout?: number
  ignoreInvalidURLs?: boolean
  scrapeOptions?: ScrapeOptions
}

export interface FirecrawlCrawlParams {
  apiKey: string
  url: string
  limit?: number
  onlyMainContent?: boolean
  prompt?: string
  maxDiscoveryDepth?: number
  sitemap?: 'skip' | 'include'
  crawlEntireDomain?: boolean
  allowExternalLinks?: boolean
  allowSubdomains?: boolean
  ignoreQueryParameters?: boolean
  delay?: number
  maxConcurrency?: number
  excludePaths?: string[]
  includePaths?: string[]
  webhook?: {
    url: string
    headers?: Record<string, string>
    metadata?: Record<string, any>
    events?: ('completed' | 'page' | 'failed' | 'started')[]
  }
  scrapeOptions?: ScrapeOptions
  zeroDataRetention?: boolean
}

export interface MapParams {
  apiKey: string
  url: string
  search?: string
  sitemap?: 'skip' | 'include' | 'only'
  includeSubdomains?: boolean
  ignoreQueryParameters?: boolean
  limit?: number
  timeout?: number
  location?: LocationConfig
}

export interface ExtractParams {
  apiKey: string
  urls: string[]
  prompt?: string
  schema?: Record<string, any>
  enableWebSearch?: boolean
  ignoreSitemap?: boolean
  includeSubdomains?: boolean
  showSources?: boolean
  ignoreInvalidURLs?: boolean
  scrapeOptions?: ScrapeOptions
}

export interface ScrapeResponse extends ToolResponse {
  output: {
    markdown: string
    html?: string
    metadata: {
      title: string
      description: string
      language: string
      keywords: string
      robots: string
      ogTitle: string
      ogDescription: string
      ogUrl: string
      ogImage: string
      ogLocaleAlternate: string[]
      ogSiteName: string
      sourceURL: string
      statusCode: number
    }
  }
}

export interface SearchResponse extends ToolResponse {
  output: {
    data: Array<{
      title: string
      description: string
      url: string
      markdown?: string
      html?: string
      rawHtml?: string
      links?: string[]
      screenshot?: string
      metadata: {
        title: string
        description: string
        sourceURL: string
        statusCode: number
        error?: string
      }
    }>
  }
}

export interface FirecrawlCrawlResponse extends ToolResponse {
  output: {
    jobId?: string
    pages: Array<{
      markdown: string
      html?: string
      metadata: {
        title: string
        description: string
        language: string
        sourceURL: string
        statusCode: number
      }
    }>
    total: number
    creditsUsed: number
  }
}

export interface MapResponse extends ToolResponse {
  output: {
    success: boolean
    links: string[]
  }
}

export interface ExtractResponse extends ToolResponse {
  output: {
    jobId: string
    success: boolean
    data: Record<string, any>
  }
}

export type FirecrawlResponse =
  | ScrapeResponse
  | SearchResponse
  | FirecrawlCrawlResponse
  | MapResponse
  | ExtractResponse
```

--------------------------------------------------------------------------------

---[FILE: execute.test.ts]---
Location: sim-main/apps/sim/tools/function/execute.test.ts

```typescript
/**
 * @vitest-environment jsdom
 *
 * Function Execute Tool Unit Tests
 *
 * This file contains unit tests for the Function Execute tool,
 * which runs JavaScript code in a secure sandbox.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_EXECUTION_TIMEOUT_MS } from '@/lib/execution/constants'
import { ToolTester } from '@/tools/__test-utils__/test-tools'
import { functionExecuteTool } from '@/tools/function/execute'

describe('Function Execute Tool', () => {
  let tester: ToolTester

  beforeEach(() => {
    tester = new ToolTester(functionExecuteTool)
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
  })

  afterEach(() => {
    tester.cleanup()
    vi.resetAllMocks()
    process.env.NEXT_PUBLIC_APP_URL = undefined
  })

  describe('Request Construction', () => {
    it.concurrent('should set correct URL for code execution', () => {
      // Since this is an internal route, actual URL will be the concatenated base URL + path
      expect(tester.getRequestUrl({})).toBe('/api/function/execute')
    })

    it.concurrent('should include correct headers for JSON payload', () => {
      const headers = tester.getRequestHeaders({
        code: 'return 42',
      })

      expect(headers['Content-Type']).toBe('application/json')
    })

    it.concurrent('should format single string code correctly', () => {
      const body = tester.getRequestBody({
        code: 'return 42',
        envVars: {},
        isCustomTool: false,
        timeout: 5000,
        workflowId: undefined,
      })

      expect(body).toEqual({
        code: 'return 42',
        envVars: {},
        workflowVariables: {},
        blockData: {},
        blockNameMapping: {},
        isCustomTool: false,
        language: 'javascript',
        timeout: 5000,
        workflowId: undefined,
      })
    })

    it.concurrent('should format array of code blocks correctly', () => {
      const body = tester.getRequestBody({
        code: [
          { content: 'const x = 40;', id: 'block1' },
          { content: 'const y = 2;', id: 'block2' },
          { content: 'return x + y;', id: 'block3' },
        ],
        envVars: {},
        isCustomTool: false,
        timeout: 10000,
        workflowId: undefined,
      })

      expect(body).toEqual({
        code: 'const x = 40;\nconst y = 2;\nreturn x + y;',
        timeout: 10000,
        envVars: {},
        workflowVariables: {},
        blockData: {},
        blockNameMapping: {},
        isCustomTool: false,
        language: 'javascript',
        workflowId: undefined,
      })
    })

    it.concurrent('should use default timeout and memory limit when not provided', () => {
      const body = tester.getRequestBody({
        code: 'return 42',
      })

      expect(body).toEqual({
        code: 'return 42',
        timeout: DEFAULT_EXECUTION_TIMEOUT_MS,
        envVars: {},
        workflowVariables: {},
        blockData: {},
        blockNameMapping: {},
        isCustomTool: false,
        language: 'javascript',
        workflowId: undefined,
      })
    })
  })

  describe('Response Handling', () => {
    it.concurrent('should process successful code execution response', async () => {
      tester.setup({
        success: true,
        output: {
          result: 42,
          stdout: 'console.log output',
        },
      })

      const result = await tester.execute({
        code: 'console.log("output"); return 42;',
      })

      expect(result.success).toBe(true)
      expect(result.output.result).toBe(42)
      expect(result.output.stdout).toBe('console.log output')
    })

    it.concurrent('should handle execution errors', async () => {
      tester.setup(
        {
          success: false,
          error: 'Syntax error in code',
        },
        { ok: false, status: 400 }
      )

      const result = await tester.execute({
        code: 'invalid javascript code!!!',
      })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
      expect(result.error).toBe('Syntax error in code')
    })

    it.concurrent('should handle timeout errors', async () => {
      tester.setup(
        {
          success: false,
          error: 'Code execution timed out',
        },
        { ok: false, status: 408 }
      )

      const result = await tester.execute({
        code: 'while(true) {}',
        timeout: 1000,
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Code execution timed out')
    })
  })

  describe('Error Handling', () => {
    it.concurrent('should handle syntax error with line content', async () => {
      tester.setup(
        {
          success: false,
          error:
            'Syntax Error: Line 3: `description: "This has a missing closing quote` - Invalid or unexpected token (Check for missing quotes, brackets, or semicolons)',
          output: {
            result: null,
            stdout: '',
            executionTime: 5,
          },
          debug: {
            line: 3,
            column: undefined,
            errorType: 'SyntaxError',
            lineContent: 'description: "This has a missing closing quote',
            stack: 'user-function.js:5\n      description: "This has a missing closing quote\n...',
          },
        },
        { ok: false, status: 500 }
      )

      const result = await tester.execute({
        code: 'const obj = {\n  name: "test",\n  description: "This has a missing closing quote\n};\nreturn obj;',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Syntax Error')
      expect(result.error).toContain('Line 3')
      expect(result.error).toContain('description: "This has a missing closing quote')
      expect(result.error).toContain('Invalid or unexpected token')
      expect(result.error).toContain('(Check for missing quotes, brackets, or semicolons)')
    })

    it.concurrent('should handle runtime error with line and column', async () => {
      tester.setup(
        {
          success: false,
          error:
            "Type Error: Line 2:16: `return obj.someMethod();` - Cannot read properties of null (reading 'someMethod')",
          output: {
            result: null,
            stdout: 'ERROR: {}\n',
            executionTime: 12,
          },
          debug: {
            line: 2,
            column: 16,
            errorType: 'TypeError',
            lineContent: 'return obj.someMethod();',
            stack: 'TypeError: Cannot read properties of null...',
          },
        },
        { ok: false, status: 500 }
      )

      const result = await tester.execute({
        code: 'const obj = null;\nreturn obj.someMethod();',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Type Error')
      expect(result.error).toContain('Line 2:16')
      expect(result.error).toContain('return obj.someMethod();')
      expect(result.error).toContain('Cannot read properties of null')
    })

    it.concurrent('should handle error information in tool response', async () => {
      tester.setup(
        {
          success: false,
          error: 'Reference Error: Line 1: `return undefinedVar` - undefinedVar is not defined',
          output: {
            result: null,
            stdout: '',
            executionTime: 3,
          },
          debug: {
            line: 1,
            column: 7,
            errorType: 'ReferenceError',
            lineContent: 'return undefinedVar',
            stack: 'ReferenceError: undefinedVar is not defined...',
          },
        },
        { ok: false, status: 500 }
      )

      const result = await tester.execute({
        code: 'return undefinedVar',
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe(
        'Reference Error: Line 1: `return undefinedVar` - undefinedVar is not defined'
      )
    })

    it.concurrent('should preserve debug information in error object', async () => {
      tester.setup(
        {
          success: false,
          error: 'Syntax Error: Line 2 - Invalid syntax',
          debug: {
            line: 2,
            column: 5,
            errorType: 'SyntaxError',
            lineContent: 'invalid syntax here',
            stack: 'SyntaxError: Invalid syntax...',
          },
        },
        { ok: false, status: 500 }
      )

      const result = await tester.execute({
        code: 'valid line\ninvalid syntax here',
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Syntax Error: Line 2 - Invalid syntax')
    })

    it.concurrent('should handle enhanced error without line information', async () => {
      tester.setup(
        {
          success: false,
          error: 'Generic error message',
          debug: {
            errorType: 'Error',
            stack: 'Error: Generic error message...',
          },
        },
        { ok: false, status: 500 }
      )

      const result = await tester.execute({
        code: 'return "test";',
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Generic error message')
    })

    it.concurrent('should provide line-specific error message when available', async () => {
      tester.setup(
        {
          success: false,
          error:
            'Type Error: Line 5:20: `obj.nonExistentMethod()` - obj.nonExistentMethod is not a function',
          debug: {
            line: 5,
            column: 20,
            errorType: 'TypeError',
            lineContent: 'obj.nonExistentMethod()',
          },
        },
        { ok: false, status: 500 }
      )

      const result = await tester.execute({
        code: 'const obj = {};\nobj.nonExistentMethod();',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Line 5:20')
      expect(result.error).toContain('obj.nonExistentMethod()')
    })
  })

  describe('Edge Cases', () => {
    it.concurrent('should handle empty code input', async () => {
      await tester.execute({
        code: '',
      })

      const body = tester.getRequestBody({ code: '' })
      expect(body.code).toBe('')
    })

    it.concurrent('should handle extremely short timeout', async () => {
      const body = tester.getRequestBody({
        code: 'return 42',
        timeout: 1, // 1ms timeout
      })

      expect(body.timeout).toBe(1)
    })
  })
})
```

--------------------------------------------------------------------------------

````
