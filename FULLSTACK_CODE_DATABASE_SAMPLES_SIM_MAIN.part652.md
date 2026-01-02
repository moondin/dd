---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 652
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 652 of 933)

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

---[FILE: backlinks.ts]---
Location: sim-main/apps/sim/tools/ahrefs/backlinks.ts

```typescript
import type { AhrefsBacklinksParams, AhrefsBacklinksResponse } from '@/tools/ahrefs/types'
import type { ToolConfig } from '@/tools/types'

export const backlinksTool: ToolConfig<AhrefsBacklinksParams, AhrefsBacklinksResponse> = {
  id: 'ahrefs_backlinks',
  name: 'Ahrefs Backlinks',
  description:
    'Get a list of backlinks pointing to a target domain or URL. Returns details about each backlink including source URL, anchor text, and domain rating.',
  version: '1.0.0',

  params: {
    target: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The target domain or URL to analyze',
    },
    mode: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Analysis mode: domain (entire domain), prefix (URL prefix), subdomains (include all subdomains), exact (exact URL match)',
    },
    date: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Date for historical data in YYYY-MM-DD format (defaults to today)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of results to return (default: 100)',
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip for pagination',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Ahrefs API Key',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.ahrefs.com/v3/site-explorer/backlinks')
      url.searchParams.set('target', params.target)
      // Date is required - default to today if not provided
      const date = params.date || new Date().toISOString().split('T')[0]
      url.searchParams.set('date', date)
      if (params.mode) url.searchParams.set('mode', params.mode)
      if (params.limit) url.searchParams.set('limit', String(params.limit))
      if (params.offset) url.searchParams.set('offset', String(params.offset))
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || data.error || 'Failed to get backlinks')
    }

    const backlinks = (data.backlinks || []).map((link: any) => ({
      urlFrom: link.url_from || '',
      urlTo: link.url_to || '',
      anchor: link.anchor || '',
      domainRatingSource: link.domain_rating_source ?? link.domain_rating ?? 0,
      isDofollow: link.is_dofollow ?? link.dofollow ?? false,
      firstSeen: link.first_seen || '',
      lastVisited: link.last_visited || '',
    }))

    return {
      success: true,
      output: {
        backlinks,
      },
    }
  },

  outputs: {
    backlinks: {
      type: 'array',
      description: 'List of backlinks pointing to the target',
      items: {
        type: 'object',
        properties: {
          urlFrom: { type: 'string', description: 'The URL of the page containing the backlink' },
          urlTo: { type: 'string', description: 'The URL being linked to' },
          anchor: { type: 'string', description: 'The anchor text of the link' },
          domainRatingSource: {
            type: 'number',
            description: 'Domain Rating of the linking domain',
          },
          isDofollow: { type: 'boolean', description: 'Whether the link is dofollow' },
          firstSeen: { type: 'string', description: 'When the backlink was first discovered' },
          lastVisited: { type: 'string', description: 'When the backlink was last checked' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: backlinks_stats.ts]---
Location: sim-main/apps/sim/tools/ahrefs/backlinks_stats.ts

```typescript
import type { AhrefsBacklinksStatsParams, AhrefsBacklinksStatsResponse } from '@/tools/ahrefs/types'
import type { ToolConfig } from '@/tools/types'

export const backlinksStatsTool: ToolConfig<
  AhrefsBacklinksStatsParams,
  AhrefsBacklinksStatsResponse
> = {
  id: 'ahrefs_backlinks_stats',
  name: 'Ahrefs Backlinks Stats',
  description:
    'Get backlink statistics for a target domain or URL. Returns totals for different backlink types including dofollow, nofollow, text, image, and redirect links.',
  version: '1.0.0',

  params: {
    target: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The target domain or URL to analyze',
    },
    mode: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Analysis mode: domain (entire domain), prefix (URL prefix), subdomains (include all subdomains), exact (exact URL match)',
    },
    date: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Date for historical data in YYYY-MM-DD format (defaults to today)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Ahrefs API Key',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.ahrefs.com/v3/site-explorer/backlinks-stats')
      url.searchParams.set('target', params.target)
      // Date is required - default to today if not provided
      const date = params.date || new Date().toISOString().split('T')[0]
      url.searchParams.set('date', date)
      if (params.mode) url.searchParams.set('mode', params.mode)
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || data.error || 'Failed to get backlinks stats')
    }

    return {
      success: true,
      output: {
        stats: {
          total: data.live ?? data.total ?? 0,
          dofollow: data.live_dofollow ?? data.dofollow ?? 0,
          nofollow: data.live_nofollow ?? data.nofollow ?? 0,
          text: data.text ?? 0,
          image: data.image ?? 0,
          redirect: data.redirect ?? 0,
        },
      },
    }
  },

  outputs: {
    stats: {
      type: 'object',
      description: 'Backlink statistics summary',
      properties: {
        total: { type: 'number', description: 'Total number of live backlinks' },
        dofollow: { type: 'number', description: 'Number of dofollow backlinks' },
        nofollow: { type: 'number', description: 'Number of nofollow backlinks' },
        text: { type: 'number', description: 'Number of text backlinks' },
        image: { type: 'number', description: 'Number of image backlinks' },
        redirect: { type: 'number', description: 'Number of redirect backlinks' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: broken_backlinks.ts]---
Location: sim-main/apps/sim/tools/ahrefs/broken_backlinks.ts

```typescript
import type {
  AhrefsBrokenBacklinksParams,
  AhrefsBrokenBacklinksResponse,
} from '@/tools/ahrefs/types'
import type { ToolConfig } from '@/tools/types'

export const brokenBacklinksTool: ToolConfig<
  AhrefsBrokenBacklinksParams,
  AhrefsBrokenBacklinksResponse
> = {
  id: 'ahrefs_broken_backlinks',
  name: 'Ahrefs Broken Backlinks',
  description:
    'Get a list of broken backlinks pointing to a target domain or URL. Useful for identifying link reclamation opportunities.',
  version: '1.0.0',

  params: {
    target: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The target domain or URL to analyze',
    },
    mode: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Analysis mode: domain (entire domain), prefix (URL prefix), subdomains (include all subdomains), exact (exact URL match)',
    },
    date: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Date for historical data in YYYY-MM-DD format (defaults to today)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of results to return (default: 100)',
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip for pagination',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Ahrefs API Key',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.ahrefs.com/v3/site-explorer/broken-backlinks')
      url.searchParams.set('target', params.target)
      // Date is required - default to today if not provided
      const date = params.date || new Date().toISOString().split('T')[0]
      url.searchParams.set('date', date)
      if (params.mode) url.searchParams.set('mode', params.mode)
      if (params.limit) url.searchParams.set('limit', String(params.limit))
      if (params.offset) url.searchParams.set('offset', String(params.offset))
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || data.error || 'Failed to get broken backlinks')
    }

    const brokenBacklinks = (data.backlinks || data.broken_backlinks || []).map((link: any) => ({
      urlFrom: link.url_from || '',
      urlTo: link.url_to || '',
      httpCode: link.http_code ?? link.status_code ?? 404,
      anchor: link.anchor || '',
      domainRatingSource: link.domain_rating_source ?? link.domain_rating ?? 0,
    }))

    return {
      success: true,
      output: {
        brokenBacklinks,
      },
    }
  },

  outputs: {
    brokenBacklinks: {
      type: 'array',
      description: 'List of broken backlinks',
      items: {
        type: 'object',
        properties: {
          urlFrom: {
            type: 'string',
            description: 'The URL of the page containing the broken link',
          },
          urlTo: { type: 'string', description: 'The broken URL being linked to' },
          httpCode: { type: 'number', description: 'HTTP status code (e.g., 404, 410)' },
          anchor: { type: 'string', description: 'The anchor text of the link' },
          domainRatingSource: {
            type: 'number',
            description: 'Domain Rating of the linking domain',
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: domain_rating.ts]---
Location: sim-main/apps/sim/tools/ahrefs/domain_rating.ts

```typescript
import type { AhrefsDomainRatingParams, AhrefsDomainRatingResponse } from '@/tools/ahrefs/types'
import type { ToolConfig } from '@/tools/types'

export const domainRatingTool: ToolConfig<AhrefsDomainRatingParams, AhrefsDomainRatingResponse> = {
  id: 'ahrefs_domain_rating',
  name: 'Ahrefs Domain Rating',
  description:
    "Get the Domain Rating (DR) and Ahrefs Rank for a target domain. Domain Rating shows the strength of a website's backlink profile on a scale from 0 to 100.",
  version: '1.0.0',

  params: {
    target: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The target domain to analyze (e.g., example.com)',
    },
    date: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Date for historical data in YYYY-MM-DD format (defaults to today)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Ahrefs API Key',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.ahrefs.com/v3/site-explorer/domain-rating')
      url.searchParams.set('target', params.target)
      // Date is required - default to today if not provided
      const date = params.date || new Date().toISOString().split('T')[0]
      url.searchParams.set('date', date)
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || data.error || 'Failed to get domain rating')
    }

    return {
      success: true,
      output: {
        domainRating: data.domain_rating ?? 0,
        ahrefsRank: data.ahrefs_rank ?? 0,
      },
    }
  },

  outputs: {
    domainRating: {
      type: 'number',
      description: 'Domain Rating score (0-100)',
    },
    ahrefsRank: {
      type: 'number',
      description: 'Ahrefs Rank - global ranking based on backlink profile strength',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/ahrefs/index.ts

```typescript
import { backlinksTool } from '@/tools/ahrefs/backlinks'
import { backlinksStatsTool } from '@/tools/ahrefs/backlinks_stats'
import { brokenBacklinksTool } from '@/tools/ahrefs/broken_backlinks'
import { domainRatingTool } from '@/tools/ahrefs/domain_rating'
import { keywordOverviewTool } from '@/tools/ahrefs/keyword_overview'
import { organicKeywordsTool } from '@/tools/ahrefs/organic_keywords'
import { referringDomainsTool } from '@/tools/ahrefs/referring_domains'
import { topPagesTool } from '@/tools/ahrefs/top_pages'

export const ahrefsDomainRatingTool = domainRatingTool
export const ahrefsBacklinksTool = backlinksTool
export const ahrefsBacklinksStatsTool = backlinksStatsTool
export const ahrefsReferringDomainsTool = referringDomainsTool
export const ahrefsOrganicKeywordsTool = organicKeywordsTool
export const ahrefsTopPagesTool = topPagesTool
export const ahrefsKeywordOverviewTool = keywordOverviewTool
export const ahrefsBrokenBacklinksTool = brokenBacklinksTool
```

--------------------------------------------------------------------------------

---[FILE: keyword_overview.ts]---
Location: sim-main/apps/sim/tools/ahrefs/keyword_overview.ts

```typescript
import type {
  AhrefsKeywordOverviewParams,
  AhrefsKeywordOverviewResponse,
} from '@/tools/ahrefs/types'
import type { ToolConfig } from '@/tools/types'

export const keywordOverviewTool: ToolConfig<
  AhrefsKeywordOverviewParams,
  AhrefsKeywordOverviewResponse
> = {
  id: 'ahrefs_keyword_overview',
  name: 'Ahrefs Keyword Overview',
  description:
    'Get detailed metrics for a keyword including search volume, keyword difficulty, CPC, clicks, and traffic potential.',
  version: '1.0.0',

  params: {
    keyword: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The keyword to analyze',
    },
    country: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Country code for keyword data (e.g., us, gb, de). Default: us',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Ahrefs API Key',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.ahrefs.com/v3/keywords-explorer/overview')
      url.searchParams.set('keyword', params.keyword)
      url.searchParams.set('country', params.country || 'us')
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || data.error || 'Failed to get keyword overview')
    }

    return {
      success: true,
      output: {
        overview: {
          keyword: data.keyword || '',
          searchVolume: data.volume ?? 0,
          keywordDifficulty: data.keyword_difficulty ?? data.difficulty ?? 0,
          cpc: data.cpc ?? 0,
          clicks: data.clicks ?? 0,
          clicksPercentage: data.clicks_percentage ?? 0,
          parentTopic: data.parent_topic || '',
          trafficPotential: data.traffic_potential ?? 0,
        },
      },
    }
  },

  outputs: {
    overview: {
      type: 'object',
      description: 'Keyword metrics overview',
      properties: {
        keyword: { type: 'string', description: 'The analyzed keyword' },
        searchVolume: { type: 'number', description: 'Monthly search volume' },
        keywordDifficulty: {
          type: 'number',
          description: 'Keyword difficulty score (0-100)',
        },
        cpc: { type: 'number', description: 'Cost per click in USD' },
        clicks: { type: 'number', description: 'Estimated clicks per month' },
        clicksPercentage: {
          type: 'number',
          description: 'Percentage of searches that result in clicks',
        },
        parentTopic: { type: 'string', description: 'The parent topic for this keyword' },
        trafficPotential: {
          type: 'number',
          description: 'Estimated traffic potential if ranking #1',
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: organic_keywords.ts]---
Location: sim-main/apps/sim/tools/ahrefs/organic_keywords.ts

```typescript
import type {
  AhrefsOrganicKeywordsParams,
  AhrefsOrganicKeywordsResponse,
} from '@/tools/ahrefs/types'
import type { ToolConfig } from '@/tools/types'

export const organicKeywordsTool: ToolConfig<
  AhrefsOrganicKeywordsParams,
  AhrefsOrganicKeywordsResponse
> = {
  id: 'ahrefs_organic_keywords',
  name: 'Ahrefs Organic Keywords',
  description:
    'Get organic keywords that a target domain or URL ranks for in Google search results. Returns keyword details including search volume, ranking position, and estimated traffic.',
  version: '1.0.0',

  params: {
    target: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The target domain or URL to analyze',
    },
    country: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Country code for search results (e.g., us, gb, de). Default: us',
    },
    mode: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Analysis mode: domain (entire domain), prefix (URL prefix), subdomains (include all subdomains), exact (exact URL match)',
    },
    date: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Date for historical data in YYYY-MM-DD format (defaults to today)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of results to return (default: 100)',
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip for pagination',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Ahrefs API Key',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.ahrefs.com/v3/site-explorer/organic-keywords')
      url.searchParams.set('target', params.target)
      url.searchParams.set('country', params.country || 'us')
      // Date is required - default to today if not provided
      const date = params.date || new Date().toISOString().split('T')[0]
      url.searchParams.set('date', date)
      if (params.mode) url.searchParams.set('mode', params.mode)
      if (params.limit) url.searchParams.set('limit', String(params.limit))
      if (params.offset) url.searchParams.set('offset', String(params.offset))
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || data.error || 'Failed to get organic keywords')
    }

    const keywords = (data.keywords || data.organic_keywords || []).map((kw: any) => ({
      keyword: kw.keyword || '',
      volume: kw.volume ?? 0,
      position: kw.position ?? 0,
      url: kw.url || '',
      traffic: kw.traffic ?? 0,
      keywordDifficulty: kw.keyword_difficulty ?? kw.difficulty ?? 0,
    }))

    return {
      success: true,
      output: {
        keywords,
      },
    }
  },

  outputs: {
    keywords: {
      type: 'array',
      description: 'List of organic keywords the target ranks for',
      items: {
        type: 'object',
        properties: {
          keyword: { type: 'string', description: 'The keyword' },
          volume: { type: 'number', description: 'Monthly search volume' },
          position: { type: 'number', description: 'Current ranking position' },
          url: { type: 'string', description: 'The URL that ranks for this keyword' },
          traffic: { type: 'number', description: 'Estimated monthly organic traffic' },
          keywordDifficulty: {
            type: 'number',
            description: 'Keyword difficulty score (0-100)',
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: referring_domains.ts]---
Location: sim-main/apps/sim/tools/ahrefs/referring_domains.ts

```typescript
import type {
  AhrefsReferringDomainsParams,
  AhrefsReferringDomainsResponse,
} from '@/tools/ahrefs/types'
import type { ToolConfig } from '@/tools/types'

export const referringDomainsTool: ToolConfig<
  AhrefsReferringDomainsParams,
  AhrefsReferringDomainsResponse
> = {
  id: 'ahrefs_referring_domains',
  name: 'Ahrefs Referring Domains',
  description:
    'Get a list of domains that link to a target domain or URL. Returns unique referring domains with their domain rating, backlink counts, and discovery dates.',
  version: '1.0.0',

  params: {
    target: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The target domain or URL to analyze',
    },
    mode: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Analysis mode: domain (entire domain), prefix (URL prefix), subdomains (include all subdomains), exact (exact URL match)',
    },
    date: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Date for historical data in YYYY-MM-DD format (defaults to today)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of results to return (default: 100)',
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip for pagination',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Ahrefs API Key',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.ahrefs.com/v3/site-explorer/refdomains')
      url.searchParams.set('target', params.target)
      // Date is required - default to today if not provided
      const date = params.date || new Date().toISOString().split('T')[0]
      url.searchParams.set('date', date)
      if (params.mode) url.searchParams.set('mode', params.mode)
      if (params.limit) url.searchParams.set('limit', String(params.limit))
      if (params.offset) url.searchParams.set('offset', String(params.offset))
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || data.error || 'Failed to get referring domains')
    }

    const referringDomains = (data.refdomains || data.referring_domains || []).map(
      (domain: any) => ({
        domain: domain.domain || domain.refdomain || '',
        domainRating: domain.domain_rating ?? 0,
        backlinks: domain.backlinks ?? 0,
        dofollowBacklinks: domain.dofollow_backlinks ?? domain.dofollow ?? 0,
        firstSeen: domain.first_seen || '',
        lastVisited: domain.last_visited || '',
      })
    )

    return {
      success: true,
      output: {
        referringDomains,
      },
    }
  },

  outputs: {
    referringDomains: {
      type: 'array',
      description: 'List of domains linking to the target',
      items: {
        type: 'object',
        properties: {
          domain: { type: 'string', description: 'The referring domain' },
          domainRating: { type: 'number', description: 'Domain Rating of the referring domain' },
          backlinks: {
            type: 'number',
            description: 'Total number of backlinks from this domain',
          },
          dofollowBacklinks: {
            type: 'number',
            description: 'Number of dofollow backlinks from this domain',
          },
          firstSeen: { type: 'string', description: 'When the domain was first seen linking' },
          lastVisited: { type: 'string', description: 'When the domain was last checked' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: top_pages.ts]---
Location: sim-main/apps/sim/tools/ahrefs/top_pages.ts

```typescript
import type { AhrefsTopPagesParams, AhrefsTopPagesResponse } from '@/tools/ahrefs/types'
import type { ToolConfig } from '@/tools/types'

export const topPagesTool: ToolConfig<AhrefsTopPagesParams, AhrefsTopPagesResponse> = {
  id: 'ahrefs_top_pages',
  name: 'Ahrefs Top Pages',
  description:
    'Get the top pages of a target domain sorted by organic traffic. Returns page URLs with their traffic, keyword counts, and estimated traffic value.',
  version: '1.0.0',

  params: {
    target: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The target domain to analyze',
    },
    country: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Country code for traffic data (e.g., us, gb, de). Default: us',
    },
    mode: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Analysis mode: domain (entire domain), prefix (URL prefix), subdomains (include all subdomains)',
    },
    date: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Date for historical data in YYYY-MM-DD format (defaults to today)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of results to return (default: 100)',
    },
    offset: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip for pagination',
    },
    select: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Comma-separated list of fields to return (e.g., url,traffic,keywords,top_keyword,value). Default: url,traffic,keywords,top_keyword,value',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Ahrefs API Key',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.ahrefs.com/v3/site-explorer/top-pages')
      url.searchParams.set('target', params.target)
      url.searchParams.set('country', params.country || 'us')
      // Date is required - default to today if not provided
      const date = params.date || new Date().toISOString().split('T')[0]
      url.searchParams.set('date', date)
      // Select is required by API v3 - default to common fields if not provided
      const select = params.select || 'url,traffic,keywords,top_keyword,value'
      url.searchParams.set('select', select)
      if (params.mode) url.searchParams.set('mode', params.mode)
      if (params.limit) url.searchParams.set('limit', String(params.limit))
      if (params.offset) url.searchParams.set('offset', String(params.offset))
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || data.error || 'Failed to get top pages')
    }

    const pages = (data.pages || data.top_pages || []).map((page: any) => ({
      url: page.url || '',
      traffic: page.traffic ?? 0,
      keywords: page.keywords ?? page.keyword_count ?? 0,
      topKeyword: page.top_keyword || '',
      value: page.value ?? page.traffic_value ?? 0,
    }))

    return {
      success: true,
      output: {
        pages,
      },
    }
  },

  outputs: {
    pages: {
      type: 'array',
      description: 'List of top pages by organic traffic',
      items: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'The page URL' },
          traffic: { type: 'number', description: 'Estimated monthly organic traffic' },
          keywords: { type: 'number', description: 'Number of keywords the page ranks for' },
          topKeyword: {
            type: 'string',
            description: 'The top keyword driving traffic to this page',
          },
          value: { type: 'number', description: 'Estimated traffic value in USD' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/ahrefs/types.ts

```typescript
// Common types for Ahrefs API tools
import type { ToolResponse } from '@/tools/types'

// Common parameters for all Ahrefs tools
export interface AhrefsBaseParams {
  apiKey: string
  date?: string // Date in YYYY-MM-DD format, defaults to today
}

// Target mode for analysis
export type AhrefsTargetMode = 'domain' | 'prefix' | 'subdomains' | 'exact'

// Domain Rating tool types
export interface AhrefsDomainRatingParams extends AhrefsBaseParams {
  target: string
}

export interface AhrefsDomainRatingResult {
  domain_rating: number
  ahrefs_rank: number
}

export interface AhrefsDomainRatingResponse extends ToolResponse {
  output: {
    domainRating: number
    ahrefsRank: number
  }
}

// Backlinks tool types
export interface AhrefsBacklinksParams extends AhrefsBaseParams {
  target: string
  mode?: AhrefsTargetMode
  limit?: number
  offset?: number
}

export interface AhrefsBacklink {
  urlFrom: string
  urlTo: string
  anchor: string
  domainRatingSource: number
  isDofollow: boolean
  firstSeen: string
  lastVisited: string
}

export interface AhrefsBacklinksResponse extends ToolResponse {
  output: {
    backlinks: AhrefsBacklink[]
  }
}

// Backlinks Stats tool types
export interface AhrefsBacklinksStatsParams extends AhrefsBaseParams {
  target: string
  mode?: AhrefsTargetMode
}

export interface AhrefsBacklinksStatsResult {
  total: number
  dofollow: number
  nofollow: number
  text: number
  image: number
  redirect: number
}

export interface AhrefsBacklinksStatsResponse extends ToolResponse {
  output: {
    stats: AhrefsBacklinksStatsResult
  }
}

// Referring Domains tool types
export interface AhrefsReferringDomainsParams extends AhrefsBaseParams {
  target: string
  mode?: AhrefsTargetMode
  limit?: number
  offset?: number
}

export interface AhrefsReferringDomain {
  domain: string
  domainRating: number
  backlinks: number
  dofollowBacklinks: number
  firstSeen: string
  lastVisited: string
}

export interface AhrefsReferringDomainsResponse extends ToolResponse {
  output: {
    referringDomains: AhrefsReferringDomain[]
  }
}

// Organic Keywords tool types
export interface AhrefsOrganicKeywordsParams extends AhrefsBaseParams {
  target: string
  country?: string
  mode?: AhrefsTargetMode
  limit?: number
  offset?: number
}

export interface AhrefsOrganicKeyword {
  keyword: string
  volume: number
  position: number
  url: string
  traffic: number
  keywordDifficulty: number
}

export interface AhrefsOrganicKeywordsResponse extends ToolResponse {
  output: {
    keywords: AhrefsOrganicKeyword[]
  }
}

// Top Pages tool types
export interface AhrefsTopPagesParams extends AhrefsBaseParams {
  target: string
  country?: string
  mode?: AhrefsTargetMode
  limit?: number
  offset?: number
  select?: string // Comma-separated list of fields to return (e.g., "url,traffic,keywords,top_keyword,value")
}

export interface AhrefsTopPage {
  url: string
  traffic: number
  keywords: number
  topKeyword: string
  value: number
}

export interface AhrefsTopPagesResponse extends ToolResponse {
  output: {
    pages: AhrefsTopPage[]
  }
}

// Keyword Overview tool types
export interface AhrefsKeywordOverviewParams extends AhrefsBaseParams {
  keyword: string
  country?: string
}

export interface AhrefsKeywordOverviewResult {
  keyword: string
  searchVolume: number
  keywordDifficulty: number
  cpc: number
  clicks: number
  clicksPercentage: number
  parentTopic: string
  trafficPotential: number
}

export interface AhrefsKeywordOverviewResponse extends ToolResponse {
  output: {
    overview: AhrefsKeywordOverviewResult
  }
}

// Broken Backlinks tool types
export interface AhrefsBrokenBacklinksParams extends AhrefsBaseParams {
  target: string
  mode?: AhrefsTargetMode
  limit?: number
  offset?: number
}

export interface AhrefsBrokenBacklink {
  urlFrom: string
  urlTo: string
  httpCode: number
  anchor: string
  domainRatingSource: number
}

export interface AhrefsBrokenBacklinksResponse extends ToolResponse {
  output: {
    brokenBacklinks: AhrefsBrokenBacklink[]
  }
}

// Union type for all possible responses
export type AhrefsResponse =
  | AhrefsDomainRatingResponse
  | AhrefsBacklinksResponse
  | AhrefsBacklinksStatsResponse
  | AhrefsReferringDomainsResponse
  | AhrefsOrganicKeywordsResponse
  | AhrefsTopPagesResponse
  | AhrefsKeywordOverviewResponse
  | AhrefsBrokenBacklinksResponse
```

--------------------------------------------------------------------------------

---[FILE: create_records.ts]---
Location: sim-main/apps/sim/tools/airtable/create_records.ts

```typescript
import type { AirtableCreateParams, AirtableCreateResponse } from '@/tools/airtable/types'
import type { ToolConfig } from '@/tools/types'

export const airtableCreateRecordsTool: ToolConfig<AirtableCreateParams, AirtableCreateResponse> = {
  id: 'airtable_create_records',
  name: 'Airtable Create Records',
  description: 'Write new records to an Airtable table',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'airtable',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token',
    },
    baseId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ID of the Airtable base',
    },
    tableId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ID or name of the table',
    },
    records: {
      type: 'json',
      required: true,
      visibility: 'user-or-llm',
      description: 'Array of records to create, each with a `fields` object',
      // Example: [{ fields: { "Field 1": "Value1", "Field 2": "Value2" } }]
    },
  },

  request: {
    url: (params) => `https://api.airtable.com/v0/${params.baseId}/${params.tableId}`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => ({ records: params.records }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        records: data.records || [],
        metadata: {
          recordCount: (data.records || []).length,
        },
      },
    }
  },

  outputs: {
    records: {
      type: 'json',
      description: 'Array of created Airtable records',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          createdTime: { type: 'string' },
          fields: { type: 'object' },
        },
      },
    },
    metadata: {
      type: 'json',
      description: 'Operation metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_record.ts]---
Location: sim-main/apps/sim/tools/airtable/get_record.ts

```typescript
import type { AirtableGetParams, AirtableGetResponse } from '@/tools/airtable/types'
import type { ToolConfig } from '@/tools/types'

export const airtableGetRecordTool: ToolConfig<AirtableGetParams, AirtableGetResponse> = {
  id: 'airtable_get_record',
  name: 'Airtable Get Record',
  description: 'Retrieve a single record from an Airtable table by its ID',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'airtable',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token',
    },
    baseId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ID of the Airtable base',
    },
    tableId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ID or name of the table',
    },
    recordId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ID of the record to retrieve',
    },
  },

  request: {
    url: (params) =>
      `https://api.airtable.com/v0/${params.baseId}/${params.tableId}/${params.recordId}`,
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        record: data, // API returns the single record object
        metadata: {
          recordCount: 1,
        },
      },
    }
  },

  outputs: {
    record: {
      type: 'json',
      description: 'Retrieved Airtable record with id, createdTime, and fields',
    },
    metadata: {
      type: 'json',
      description: 'Operation metadata including record count',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/airtable/index.ts

```typescript
import { airtableCreateRecordsTool } from '@/tools/airtable/create_records'
import { airtableGetRecordTool } from '@/tools/airtable/get_record'
import { airtableListRecordsTool } from '@/tools/airtable/list_records'
import { airtableUpdateMultipleRecordsTool } from '@/tools/airtable/update_multiple_records'
import { airtableUpdateRecordTool } from '@/tools/airtable/update_record'

export {
  airtableCreateRecordsTool,
  airtableGetRecordTool,
  airtableListRecordsTool,
  airtableUpdateMultipleRecordsTool,
  airtableUpdateRecordTool,
}
```

--------------------------------------------------------------------------------

````
