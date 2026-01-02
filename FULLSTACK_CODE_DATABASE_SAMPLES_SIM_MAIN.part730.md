---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 730
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 730 of 933)

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

---[FILE: update_lead.ts]---
Location: sim-main/apps/sim/tools/pipedrive/update_lead.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  PipedriveUpdateLeadParams,
  PipedriveUpdateLeadResponse,
} from '@/tools/pipedrive/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('PipedriveUpdateLead')

export const pipedriveUpdateLeadTool: ToolConfig<
  PipedriveUpdateLeadParams,
  PipedriveUpdateLeadResponse
> = {
  id: 'pipedrive_update_lead',
  name: 'Update Lead in Pipedrive',
  description: 'Update an existing lead in Pipedrive',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'pipedrive',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Pipedrive API',
    },
    lead_id: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the lead to update',
    },
    title: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New name for the lead',
    },
    person_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New person ID',
    },
    organization_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New organization ID',
    },
    owner_id: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New owner user ID',
    },
    value_amount: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New value amount',
    },
    value_currency: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New currency code (e.g., USD, EUR)',
    },
    expected_close_date: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'New expected close date in YYYY-MM-DD format',
    },
    is_archived: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Archive the lead: true or false',
    },
  },

  request: {
    url: (params) => `https://api.pipedrive.com/v1/leads/${params.lead_id}`,
    method: 'PATCH',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      const body: Record<string, any> = {}

      if (params.title) body.title = params.title
      if (params.person_id) body.person_id = Number(params.person_id)
      if (params.organization_id) body.organization_id = Number(params.organization_id)
      if (params.owner_id) body.owner_id = Number(params.owner_id)

      // Build value object if both amount and currency are provided
      if (params.value_amount && params.value_currency) {
        body.value = {
          amount: Number(params.value_amount),
          currency: params.value_currency,
        }
      }

      if (params.expected_close_date) body.expected_close_date = params.expected_close_date
      if (params.is_archived) body.is_archived = params.is_archived === 'true'

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!data.success) {
      logger.error('Pipedrive API request failed', { data })
      throw new Error(data.error || 'Failed to update lead in Pipedrive')
    }

    return {
      success: true,
      output: {
        lead: data.data,
        metadata: {
          operation: 'update_lead' as const,
        },
        success: true,
      },
    }
  },

  outputs: {
    lead: { type: 'object', description: 'The updated lead object' },
    metadata: { type: 'object', description: 'Operation metadata' },
    success: { type: 'boolean', description: 'Operation success status' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_event.ts]---
Location: sim-main/apps/sim/tools/polymarket/get_event.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { PolymarketEvent } from './types'
import { buildGammaUrl, handlePolymarketError } from './types'

export interface PolymarketGetEventParams {
  eventId?: string // Event ID
  slug?: string // Event slug (alternative to ID)
}

export interface PolymarketGetEventResponse {
  success: boolean
  output: {
    event: PolymarketEvent
  }
}

export const polymarketGetEventTool: ToolConfig<
  PolymarketGetEventParams,
  PolymarketGetEventResponse
> = {
  id: 'polymarket_get_event',
  name: 'Get Event from Polymarket',
  description: 'Retrieve details of a specific event by ID or slug',
  version: '1.0.0',

  params: {
    eventId: {
      type: 'string',
      required: false,
      description: 'The event ID. Required if slug is not provided.',
    },
    slug: {
      type: 'string',
      required: false,
      description:
        'The event slug (e.g., "2024-presidential-election"). Required if eventId is not provided.',
    },
  },

  request: {
    url: (params) => {
      if (params.slug) {
        return buildGammaUrl(`/events/slug/${params.slug}`)
      }
      return buildGammaUrl(`/events/${params.eventId}`)
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handlePolymarketError(data, response.status, 'get_event')
    }

    return {
      success: true,
      output: {
        event: data,
      },
    }
  },

  outputs: {
    event: {
      type: 'object',
      description: 'Event object with details',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_events.ts]---
Location: sim-main/apps/sim/tools/polymarket/get_events.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { PolymarketEvent, PolymarketPaginationParams } from './types'
import { buildGammaUrl, handlePolymarketError } from './types'

export interface PolymarketGetEventsParams extends PolymarketPaginationParams {
  closed?: string // 'true' or 'false' - filter for closed/active events
  order?: string // sort field (e.g., 'volume', 'liquidity', 'startDate', 'endDate')
  ascending?: string // 'true' or 'false' - sort direction
  tagId?: string // filter by tag ID
}

export interface PolymarketGetEventsResponse {
  success: boolean
  output: {
    events: PolymarketEvent[]
  }
}

export const polymarketGetEventsTool: ToolConfig<
  PolymarketGetEventsParams,
  PolymarketGetEventsResponse
> = {
  id: 'polymarket_get_events',
  name: 'Get Events from Polymarket',
  description: 'Retrieve a list of events from Polymarket with optional filtering',
  version: '1.0.0',

  params: {
    closed: {
      type: 'string',
      required: false,
      description: 'Filter by closed status (true/false). Use false for active events only.',
    },
    order: {
      type: 'string',
      required: false,
      description: 'Sort field (e.g., volume, liquidity, startDate, endDate, createdAt)',
    },
    ascending: {
      type: 'string',
      required: false,
      description: 'Sort direction (true for ascending, false for descending)',
    },
    tagId: {
      type: 'string',
      required: false,
      description: 'Filter by tag ID',
    },
    limit: {
      type: 'string',
      required: false,
      description: 'Number of results per page (max 50)',
    },
    offset: {
      type: 'string',
      required: false,
      description: 'Pagination offset (skip this many results)',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.closed) queryParams.append('closed', params.closed)
      if (params.order) queryParams.append('order', params.order)
      if (params.ascending) queryParams.append('ascending', params.ascending)
      if (params.tagId) queryParams.append('tag_id', params.tagId)
      // Default limit to 50 to prevent browser crashes from large data sets
      queryParams.append('limit', params.limit || '50')
      if (params.offset) queryParams.append('offset', params.offset)

      const query = queryParams.toString()
      const url = buildGammaUrl('/events')
      return `${url}?${query}`
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handlePolymarketError(data, response.status, 'get_events')
    }

    // Response is an array of events
    const events = Array.isArray(data) ? data : []

    return {
      success: true,
      output: {
        events,
      },
    }
  },

  outputs: {
    events: {
      type: 'array',
      description: 'Array of event objects',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_last_trade_price.ts]---
Location: sim-main/apps/sim/tools/polymarket/get_last_trade_price.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import { buildClobUrl, handlePolymarketError } from './types'

export interface PolymarketGetLastTradePriceParams {
  tokenId: string // The token ID (CLOB token ID from market)
}

export interface PolymarketGetLastTradePriceResponse {
  success: boolean
  output: {
    price: string
  }
}

export const polymarketGetLastTradePriceTool: ToolConfig<
  PolymarketGetLastTradePriceParams,
  PolymarketGetLastTradePriceResponse
> = {
  id: 'polymarket_get_last_trade_price',
  name: 'Get Last Trade Price from Polymarket',
  description: 'Retrieve the last trade price for a specific token',
  version: '1.0.0',

  params: {
    tokenId: {
      type: 'string',
      required: true,
      description: 'The CLOB token ID (from market clobTokenIds)',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      queryParams.append('token_id', params.tokenId)
      return `${buildClobUrl('/last-trade-price')}?${queryParams.toString()}`
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handlePolymarketError(data, response.status, 'get_last_trade_price')
    }

    return {
      success: true,
      output: {
        price: typeof data === 'string' ? data : data.price || '',
      },
    }
  },

  outputs: {
    price: {
      type: 'string',
      description: 'Last trade price',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_market.ts]---
Location: sim-main/apps/sim/tools/polymarket/get_market.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { PolymarketMarket } from './types'
import { buildGammaUrl, handlePolymarketError } from './types'

export interface PolymarketGetMarketParams {
  marketId?: string // Market ID
  slug?: string // Market slug (alternative to ID)
}

export interface PolymarketGetMarketResponse {
  success: boolean
  output: {
    market: PolymarketMarket
  }
}

export const polymarketGetMarketTool: ToolConfig<
  PolymarketGetMarketParams,
  PolymarketGetMarketResponse
> = {
  id: 'polymarket_get_market',
  name: 'Get Market from Polymarket',
  description: 'Retrieve details of a specific prediction market by ID or slug',
  version: '1.0.0',

  params: {
    marketId: {
      type: 'string',
      required: false,
      description: 'The market ID. Required if slug is not provided.',
    },
    slug: {
      type: 'string',
      required: false,
      description:
        'The market slug (e.g., "will-trump-win"). Required if marketId is not provided.',
    },
  },

  request: {
    url: (params) => {
      if (params.slug) {
        return buildGammaUrl(`/markets/slug/${params.slug}`)
      }
      return buildGammaUrl(`/markets/${params.marketId}`)
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handlePolymarketError(data, response.status, 'get_market')
    }

    return {
      success: true,
      output: {
        market: data,
      },
    }
  },

  outputs: {
    market: {
      type: 'object',
      description: 'Market object with details',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_markets.ts]---
Location: sim-main/apps/sim/tools/polymarket/get_markets.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { PolymarketMarket, PolymarketPaginationParams } from './types'
import { buildGammaUrl, handlePolymarketError } from './types'

export interface PolymarketGetMarketsParams extends PolymarketPaginationParams {
  closed?: string // 'true' or 'false' - filter for closed/active markets
  order?: string // sort field - use camelCase (e.g., 'volumeNum', 'liquidityNum', 'startDate', 'endDate')
  ascending?: string // 'true' or 'false' - sort direction
  tagId?: string // filter by tag ID
}

export interface PolymarketGetMarketsResponse {
  success: boolean
  output: {
    markets: PolymarketMarket[]
  }
}

export const polymarketGetMarketsTool: ToolConfig<
  PolymarketGetMarketsParams,
  PolymarketGetMarketsResponse
> = {
  id: 'polymarket_get_markets',
  name: 'Get Markets from Polymarket',
  description: 'Retrieve a list of prediction markets from Polymarket with optional filtering',
  version: '1.0.0',

  params: {
    closed: {
      type: 'string',
      required: false,
      description: 'Filter by closed status (true/false). Use false for active markets only.',
    },
    order: {
      type: 'string',
      required: false,
      description: 'Sort field (e.g., volumeNum, liquidityNum, startDate, endDate, createdAt)',
    },
    ascending: {
      type: 'string',
      required: false,
      description: 'Sort direction (true for ascending, false for descending)',
    },
    tagId: {
      type: 'string',
      required: false,
      description: 'Filter by tag ID',
    },
    limit: {
      type: 'string',
      required: false,
      description: 'Number of results per page (max 50)',
    },
    offset: {
      type: 'string',
      required: false,
      description: 'Pagination offset (skip this many results)',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.closed) queryParams.append('closed', params.closed)
      if (params.order) queryParams.append('order', params.order)
      if (params.ascending) queryParams.append('ascending', params.ascending)
      if (params.tagId) queryParams.append('tag_id', params.tagId)
      // Default limit to 50 to prevent browser crashes from large data sets
      queryParams.append('limit', params.limit || '50')
      if (params.offset) queryParams.append('offset', params.offset)

      const query = queryParams.toString()
      const url = buildGammaUrl('/markets')
      return `${url}?${query}`
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handlePolymarketError(data, response.status, 'get_markets')
    }

    // Response is an array of markets
    const markets = Array.isArray(data) ? data : []

    return {
      success: true,
      output: {
        markets,
      },
    }
  },

  outputs: {
    markets: {
      type: 'array',
      description: 'Array of market objects',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_midpoint.ts]---
Location: sim-main/apps/sim/tools/polymarket/get_midpoint.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import { buildClobUrl, handlePolymarketError } from './types'

export interface PolymarketGetMidpointParams {
  tokenId: string // The token ID (CLOB token ID from market)
}

export interface PolymarketGetMidpointResponse {
  success: boolean
  output: {
    midpoint: string
  }
}

export const polymarketGetMidpointTool: ToolConfig<
  PolymarketGetMidpointParams,
  PolymarketGetMidpointResponse
> = {
  id: 'polymarket_get_midpoint',
  name: 'Get Midpoint Price from Polymarket',
  description: 'Retrieve the midpoint price for a specific token',
  version: '1.0.0',

  params: {
    tokenId: {
      type: 'string',
      required: true,
      description: 'The CLOB token ID (from market clobTokenIds)',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      queryParams.append('token_id', params.tokenId)
      return `${buildClobUrl('/midpoint')}?${queryParams.toString()}`
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handlePolymarketError(data, response.status, 'get_midpoint')
    }

    return {
      success: true,
      output: {
        midpoint: data.mid || data.midpoint || data,
      },
    }
  },

  outputs: {
    midpoint: {
      type: 'string',
      description: 'Midpoint price',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_orderbook.ts]---
Location: sim-main/apps/sim/tools/polymarket/get_orderbook.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { PolymarketOrderBook } from './types'
import { buildClobUrl, handlePolymarketError } from './types'

export interface PolymarketGetOrderbookParams {
  tokenId: string // The token ID (CLOB token ID from market)
}

export interface PolymarketGetOrderbookResponse {
  success: boolean
  output: {
    orderbook: PolymarketOrderBook
  }
}

export const polymarketGetOrderbookTool: ToolConfig<
  PolymarketGetOrderbookParams,
  PolymarketGetOrderbookResponse
> = {
  id: 'polymarket_get_orderbook',
  name: 'Get Orderbook from Polymarket',
  description: 'Retrieve the order book summary for a specific token',
  version: '1.0.0',

  params: {
    tokenId: {
      type: 'string',
      required: true,
      description: 'The CLOB token ID (from market clobTokenIds)',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      queryParams.append('token_id', params.tokenId)
      return `${buildClobUrl('/book')}?${queryParams.toString()}`
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handlePolymarketError(data, response.status, 'get_orderbook')
    }

    return {
      success: true,
      output: {
        orderbook: data,
      },
    }
  },

  outputs: {
    orderbook: {
      type: 'object',
      description: 'Order book with bids and asks arrays',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_positions.ts]---
Location: sim-main/apps/sim/tools/polymarket/get_positions.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { PolymarketPosition } from './types'
import { buildDataUrl, handlePolymarketError } from './types'

export interface PolymarketGetPositionsParams {
  user: string // Wallet address (required)
  market?: string // Optional market filter
}

export interface PolymarketGetPositionsResponse {
  success: boolean
  output: {
    positions: PolymarketPosition[]
  }
}

export const polymarketGetPositionsTool: ToolConfig<
  PolymarketGetPositionsParams,
  PolymarketGetPositionsResponse
> = {
  id: 'polymarket_get_positions',
  name: 'Get Positions from Polymarket',
  description: 'Retrieve user positions from Polymarket',
  version: '1.0.0',

  params: {
    user: {
      type: 'string',
      required: true,
      description: 'User wallet address',
    },
    market: {
      type: 'string',
      required: false,
      description: 'Optional market ID to filter positions',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      queryParams.append('user', params.user)
      if (params.market) queryParams.append('market', params.market)

      return `${buildDataUrl('/positions')}?${queryParams.toString()}`
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handlePolymarketError(data, response.status, 'get_positions')
    }

    // Response is an array of positions
    const positions = Array.isArray(data) ? data : []

    return {
      success: true,
      output: {
        positions,
      },
    }
  },

  outputs: {
    positions: {
      type: 'array',
      description: 'Array of position objects',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_price.ts]---
Location: sim-main/apps/sim/tools/polymarket/get_price.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import { buildClobUrl, handlePolymarketError } from './types'

export interface PolymarketGetPriceParams {
  tokenId: string // The token ID (CLOB token ID from market)
  side: string // 'buy' or 'sell'
}

export interface PolymarketGetPriceResponse {
  success: boolean
  output: {
    price: string
  }
}

export const polymarketGetPriceTool: ToolConfig<
  PolymarketGetPriceParams,
  PolymarketGetPriceResponse
> = {
  id: 'polymarket_get_price',
  name: 'Get Price from Polymarket',
  description: 'Retrieve the market price for a specific token and side',
  version: '1.0.0',

  params: {
    tokenId: {
      type: 'string',
      required: true,
      description: 'The CLOB token ID (from market clobTokenIds)',
    },
    side: {
      type: 'string',
      required: true,
      description: 'Order side: buy or sell',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      queryParams.append('token_id', params.tokenId)
      queryParams.append('side', params.side.toUpperCase())
      return `${buildClobUrl('/price')}?${queryParams.toString()}`
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handlePolymarketError(data, response.status, 'get_price')
    }

    return {
      success: true,
      output: {
        price: data.price || data,
      },
    }
  },

  outputs: {
    price: {
      type: 'string',
      description: 'Market price',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_price_history.ts]---
Location: sim-main/apps/sim/tools/polymarket/get_price_history.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { PolymarketPriceHistoryEntry } from './types'
import { buildClobUrl, handlePolymarketError } from './types'

export interface PolymarketGetPriceHistoryParams {
  tokenId: string
  interval?: string
  fidelity?: number
  startTs?: number
  endTs?: number
}

export interface PolymarketGetPriceHistoryResponse {
  success: boolean
  output: {
    history: PolymarketPriceHistoryEntry[]
  }
}

export const polymarketGetPriceHistoryTool: ToolConfig<
  PolymarketGetPriceHistoryParams,
  PolymarketGetPriceHistoryResponse
> = {
  id: 'polymarket_get_price_history',
  name: 'Get Price History from Polymarket',
  description: 'Retrieve historical price data for a specific market token',
  version: '1.0.0',

  params: {
    tokenId: {
      type: 'string',
      required: true,
      description: 'The CLOB token ID (from market clobTokenIds)',
    },
    interval: {
      type: 'string',
      required: false,
      description:
        'Duration ending at current time (1m, 1h, 6h, 1d, 1w, max). Mutually exclusive with startTs/endTs.',
    },
    fidelity: {
      type: 'number',
      required: false,
      description: 'Data resolution in minutes (e.g., 60 for hourly)',
    },
    startTs: {
      type: 'number',
      required: false,
      description: 'Start timestamp (Unix seconds UTC)',
    },
    endTs: {
      type: 'number',
      required: false,
      description: 'End timestamp (Unix seconds UTC)',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      queryParams.append('market', params.tokenId)
      if (params.interval) queryParams.append('interval', params.interval)
      if (params.fidelity != null && !Number.isNaN(params.fidelity))
        queryParams.append('fidelity', String(params.fidelity))
      if (params.startTs != null && !Number.isNaN(params.startTs))
        queryParams.append('startTs', String(params.startTs))
      if (params.endTs != null && !Number.isNaN(params.endTs))
        queryParams.append('endTs', String(params.endTs))
      return `${buildClobUrl('/prices-history')}?${queryParams.toString()}`
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handlePolymarketError(data, response.status, 'get_price_history')
    }

    const history = data.history || (Array.isArray(data) ? data : [])

    return {
      success: true,
      output: {
        history,
      },
    }
  },

  outputs: {
    history: {
      type: 'array',
      description: 'Array of price history entries with timestamp (t) and price (p)',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_series.ts]---
Location: sim-main/apps/sim/tools/polymarket/get_series.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { PolymarketPaginationParams, PolymarketSeries } from './types'
import { buildGammaUrl, handlePolymarketError } from './types'

export interface PolymarketGetSeriesParams extends PolymarketPaginationParams {}

export interface PolymarketGetSeriesResponse {
  success: boolean
  output: {
    series: PolymarketSeries[]
  }
}

export const polymarketGetSeriesTool: ToolConfig<
  PolymarketGetSeriesParams,
  PolymarketGetSeriesResponse
> = {
  id: 'polymarket_get_series',
  name: 'Get Series from Polymarket',
  description: 'Retrieve series (related market groups) from Polymarket',
  version: '1.0.0',

  params: {
    limit: {
      type: 'string',
      required: false,
      description: 'Number of results per page (max 50)',
    },
    offset: {
      type: 'string',
      required: false,
      description: 'Pagination offset (skip this many results)',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      // Default limit to 50 to prevent browser crashes from large data sets
      queryParams.append('limit', params.limit || '50')
      if (params.offset) queryParams.append('offset', params.offset)

      const query = queryParams.toString()
      const url = buildGammaUrl('/series')
      return `${url}?${query}`
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handlePolymarketError(data, response.status, 'get_series')
    }

    // Response is an array of series - each series can contain thousands of nested events
    // Strip the events array to prevent browser crashes (use get_events to fetch events separately)
    const series = Array.isArray(data)
      ? data.map((s: any) => ({
          id: s.id,
          ticker: s.ticker,
          slug: s.slug,
          title: s.title,
          seriesType: s.seriesType,
          recurrence: s.recurrence,
          image: s.image,
          icon: s.icon,
          active: s.active,
          closed: s.closed,
          archived: s.archived,
          featured: s.featured,
          restricted: s.restricted,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          volume: s.volume,
          liquidity: s.liquidity,
          commentCount: s.commentCount,
          eventCount: s.events?.length || 0, // Include count instead of full array
        }))
      : []

    return {
      success: true,
      output: {
        series,
      },
    }
  },

  outputs: {
    series: {
      type: 'array',
      description: 'Array of series objects',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_series_by_id.ts]---
Location: sim-main/apps/sim/tools/polymarket/get_series_by_id.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { PolymarketSeries } from './types'
import { buildGammaUrl, handlePolymarketError } from './types'

export interface PolymarketGetSeriesByIdParams {
  seriesId: string // Series ID (required)
}

export interface PolymarketGetSeriesByIdResponse {
  success: boolean
  output: {
    series: PolymarketSeries
  }
}

export const polymarketGetSeriesByIdTool: ToolConfig<
  PolymarketGetSeriesByIdParams,
  PolymarketGetSeriesByIdResponse
> = {
  id: 'polymarket_get_series_by_id',
  name: 'Get Series by ID from Polymarket',
  description: 'Retrieve a specific series (related market group) by ID from Polymarket',
  version: '1.0.0',

  params: {
    seriesId: {
      type: 'string',
      required: true,
      description: 'The series ID',
    },
  },

  request: {
    url: (params) => buildGammaUrl(`/series/${params.seriesId}`),
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handlePolymarketError(data, response.status, 'get_series_by_id')
    }

    return {
      success: true,
      output: {
        series: data,
      },
    }
  },

  outputs: {
    series: {
      type: 'object',
      description: 'Series object with details',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_spread.ts]---
Location: sim-main/apps/sim/tools/polymarket/get_spread.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { PolymarketSpread } from './types'
import { buildClobUrl, handlePolymarketError } from './types'

export interface PolymarketGetSpreadParams {
  tokenId: string // The token ID (CLOB token ID from market)
}

export interface PolymarketGetSpreadResponse {
  success: boolean
  output: {
    spread: PolymarketSpread
  }
}

export const polymarketGetSpreadTool: ToolConfig<
  PolymarketGetSpreadParams,
  PolymarketGetSpreadResponse
> = {
  id: 'polymarket_get_spread',
  name: 'Get Spread from Polymarket',
  description: 'Retrieve the bid-ask spread for a specific token',
  version: '1.0.0',

  params: {
    tokenId: {
      type: 'string',
      required: true,
      description: 'The CLOB token ID (from market clobTokenIds)',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      queryParams.append('token_id', params.tokenId)
      return `${buildClobUrl('/spread')}?${queryParams.toString()}`
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handlePolymarketError(data, response.status, 'get_spread')
    }

    return {
      success: true,
      output: {
        spread: data,
      },
    }
  },

  outputs: {
    spread: {
      type: 'object',
      description: 'Bid-ask spread with bid and ask prices',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_tags.ts]---
Location: sim-main/apps/sim/tools/polymarket/get_tags.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { PolymarketPaginationParams, PolymarketTag } from './types'
import { buildGammaUrl, handlePolymarketError } from './types'

export interface PolymarketGetTagsParams extends PolymarketPaginationParams {}

export interface PolymarketGetTagsResponse {
  success: boolean
  output: {
    tags: PolymarketTag[]
  }
}

export const polymarketGetTagsTool: ToolConfig<PolymarketGetTagsParams, PolymarketGetTagsResponse> =
  {
    id: 'polymarket_get_tags',
    name: 'Get Tags from Polymarket',
    description: 'Retrieve available tags for filtering markets from Polymarket',
    version: '1.0.0',

    params: {
      limit: {
        type: 'string',
        required: false,
        description: 'Number of results per page (max 50)',
      },
      offset: {
        type: 'string',
        required: false,
        description: 'Pagination offset (skip this many results)',
      },
    },

    request: {
      url: (params) => {
        const queryParams = new URLSearchParams()
        // Default limit to 50 to prevent browser crashes from large data sets
        queryParams.append('limit', params.limit || '50')
        if (params.offset) queryParams.append('offset', params.offset)

        const query = queryParams.toString()
        const url = buildGammaUrl('/tags')
        return `${url}?${query}`
      },
      method: 'GET',
      headers: () => ({
        'Content-Type': 'application/json',
      }),
    },

    transformResponse: async (response: Response) => {
      const data = await response.json()

      if (!response.ok) {
        handlePolymarketError(data, response.status, 'get_tags')
      }

      // Response is an array of tags
      const tags = Array.isArray(data) ? data : []

      return {
        success: true,
        output: {
          tags,
        },
      }
    },

    outputs: {
      tags: {
        type: 'array',
        description: 'Array of tag objects with id, label, and slug',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: get_tick_size.ts]---
Location: sim-main/apps/sim/tools/polymarket/get_tick_size.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import { buildClobUrl, handlePolymarketError } from './types'

export interface PolymarketGetTickSizeParams {
  tokenId: string // The token ID (CLOB token ID from market)
}

export interface PolymarketGetTickSizeResponse {
  success: boolean
  output: {
    tickSize: string
  }
}

export const polymarketGetTickSizeTool: ToolConfig<
  PolymarketGetTickSizeParams,
  PolymarketGetTickSizeResponse
> = {
  id: 'polymarket_get_tick_size',
  name: 'Get Tick Size from Polymarket',
  description: 'Retrieve the minimum tick size for a specific token',
  version: '1.0.0',

  params: {
    tokenId: {
      type: 'string',
      required: true,
      description: 'The CLOB token ID (from market clobTokenIds)',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      queryParams.append('token_id', params.tokenId)
      return `${buildClobUrl('/tick-size')}?${queryParams.toString()}`
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handlePolymarketError(data, response.status, 'get_tick_size')
    }

    // API returns { minimum_tick_size: "0.01" }
    const tickSize =
      typeof data === 'string' ? data : data.minimum_tick_size || data.tick_size || ''

    return {
      success: true,
      output: {
        tickSize: String(tickSize),
      },
    }
  },

  outputs: {
    tickSize: {
      type: 'string',
      description: 'Minimum tick size',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_trades.ts]---
Location: sim-main/apps/sim/tools/polymarket/get_trades.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { PolymarketPaginationParams, PolymarketTrade } from './types'
import { buildDataUrl, handlePolymarketError } from './types'

export interface PolymarketGetTradesParams extends PolymarketPaginationParams {
  user?: string // Optional user wallet address
  market?: string // Optional market filter
}

export interface PolymarketGetTradesResponse {
  success: boolean
  output: {
    trades: PolymarketTrade[]
  }
}

export const polymarketGetTradesTool: ToolConfig<
  PolymarketGetTradesParams,
  PolymarketGetTradesResponse
> = {
  id: 'polymarket_get_trades',
  name: 'Get Trades from Polymarket',
  description: 'Retrieve trade history from Polymarket',
  version: '1.0.0',

  params: {
    user: {
      type: 'string',
      required: false,
      description: 'User wallet address to filter trades',
    },
    market: {
      type: 'string',
      required: false,
      description: 'Market ID to filter trades',
    },
    limit: {
      type: 'string',
      required: false,
      description: 'Number of results per page (max 50)',
    },
    offset: {
      type: 'string',
      required: false,
      description: 'Pagination offset (skip this many results)',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.user) queryParams.append('user', params.user)
      if (params.market) queryParams.append('market', params.market)
      // Default limit to 50 to prevent browser crashes from large data sets
      queryParams.append('limit', params.limit || '50')
      if (params.offset) queryParams.append('offset', params.offset)

      const query = queryParams.toString()
      const url = buildDataUrl('/trades')
      return `${url}?${query}`
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handlePolymarketError(data, response.status, 'get_trades')
    }

    // Response is an array of trades
    const trades = Array.isArray(data) ? data : []

    return {
      success: true,
      output: {
        trades,
      },
    }
  },

  outputs: {
    trades: {
      type: 'array',
      description: 'Array of trade objects',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/polymarket/index.ts

```typescript
export * from './get_event'
export * from './get_events'
export * from './get_last_trade_price'
export * from './get_market'
export * from './get_markets'
export * from './get_midpoint'
export * from './get_orderbook'
export * from './get_positions'
export * from './get_price'
export * from './get_price_history'
export * from './get_series'
export * from './get_series_by_id'
export * from './get_spread'
export * from './get_tags'
export * from './get_tick_size'
export * from './get_trades'
export * from './search'
export * from './types'
```

--------------------------------------------------------------------------------

````
