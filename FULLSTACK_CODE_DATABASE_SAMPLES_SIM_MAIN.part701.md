---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 701
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 701 of 933)

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

---[FILE: get_exchange_status.ts]---
Location: sim-main/apps/sim/tools/kalshi/get_exchange_status.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { KalshiExchangeStatus } from './types'
import { buildKalshiUrl, handleKalshiError } from './types'

export type KalshiGetExchangeStatusParams = Record<string, never>

export interface KalshiGetExchangeStatusResponse {
  success: boolean
  output: {
    status: KalshiExchangeStatus
  }
}

export const kalshiGetExchangeStatusTool: ToolConfig<
  KalshiGetExchangeStatusParams,
  KalshiGetExchangeStatusResponse
> = {
  id: 'kalshi_get_exchange_status',
  name: 'Get Exchange Status from Kalshi',
  description: 'Retrieve the current status of the Kalshi exchange (trading and exchange activity)',
  version: '1.0.0',

  params: {},

  request: {
    url: () => {
      return buildKalshiUrl('/exchange/status')
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handleKalshiError(data, response.status, 'get_exchange_status')
    }

    const status = {
      trading_active: data.trading_active ?? false,
      exchange_active: data.exchange_active ?? false,
    }

    return {
      success: true,
      output: {
        status,
      },
    }
  },

  outputs: {
    status: {
      type: 'object',
      description: 'Exchange status with trading_active and exchange_active flags',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_fills.ts]---
Location: sim-main/apps/sim/tools/kalshi/get_fills.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type {
  KalshiAuthParams,
  KalshiFill,
  KalshiPaginationParams,
  KalshiPagingInfo,
} from './types'
import { buildKalshiAuthHeaders, buildKalshiUrl, handleKalshiError } from './types'

export interface KalshiGetFillsParams extends KalshiAuthParams, KalshiPaginationParams {
  ticker?: string
  orderId?: string
  minTs?: number
  maxTs?: number
}

export interface KalshiGetFillsResponse {
  success: boolean
  output: {
    fills: KalshiFill[]
    paging?: KalshiPagingInfo
  }
}

export const kalshiGetFillsTool: ToolConfig<KalshiGetFillsParams, KalshiGetFillsResponse> = {
  id: 'kalshi_get_fills',
  name: 'Get Fills from Kalshi',
  description: "Retrieve your portfolio's fills/trades from Kalshi",
  version: '1.0.0',

  params: {
    keyId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Kalshi API Key ID',
    },
    privateKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your RSA Private Key (PEM format)',
    },
    ticker: {
      type: 'string',
      required: false,
      description: 'Filter by market ticker',
    },
    orderId: {
      type: 'string',
      required: false,
      description: 'Filter by order ID',
    },
    minTs: {
      type: 'number',
      required: false,
      description: 'Minimum timestamp (Unix milliseconds)',
    },
    maxTs: {
      type: 'number',
      required: false,
      description: 'Maximum timestamp (Unix milliseconds)',
    },
    limit: {
      type: 'string',
      required: false,
      description: 'Number of results (1-1000, default: 100)',
    },
    cursor: {
      type: 'string',
      required: false,
      description: 'Pagination cursor for next page',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.ticker) queryParams.append('ticker', params.ticker)
      if (params.orderId) queryParams.append('order_id', params.orderId)
      if (params.minTs !== undefined) queryParams.append('min_ts', params.minTs.toString())
      if (params.maxTs !== undefined) queryParams.append('max_ts', params.maxTs.toString())
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.cursor) queryParams.append('cursor', params.cursor)

      const query = queryParams.toString()
      const url = buildKalshiUrl('/portfolio/fills')
      return query ? `${url}?${query}` : url
    },
    method: 'GET',
    headers: (params) => {
      const path = '/trade-api/v2/portfolio/fills'
      return buildKalshiAuthHeaders(params.keyId, params.privateKey, 'GET', path)
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handleKalshiError(data, response.status, 'get_fills')
    }

    const fills = data.fills || []

    return {
      success: true,
      output: {
        fills,
        paging: {
          cursor: data.cursor || null,
        },
      },
    }
  },

  outputs: {
    fills: {
      type: 'array',
      description: 'Array of fill/trade objects',
    },
    paging: {
      type: 'object',
      description: 'Pagination cursor for fetching more results',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_market.ts]---
Location: sim-main/apps/sim/tools/kalshi/get_market.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { KalshiMarket } from './types'
import { buildKalshiUrl, handleKalshiError } from './types'

export interface KalshiGetMarketParams {
  ticker: string // Market ticker
}

export interface KalshiGetMarketResponse {
  success: boolean
  output: {
    market: KalshiMarket
  }
}

export const kalshiGetMarketTool: ToolConfig<KalshiGetMarketParams, KalshiGetMarketResponse> = {
  id: 'kalshi_get_market',
  name: 'Get Market from Kalshi',
  description: 'Retrieve details of a specific prediction market by ticker',
  version: '1.0.0',

  params: {
    ticker: {
      type: 'string',
      required: true,
      description: 'The market ticker (e.g., "KXBTC-24DEC31")',
    },
  },

  request: {
    url: (params) => buildKalshiUrl(`/markets/${params.ticker}`),
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handleKalshiError(data, response.status, 'get_market')
    }

    return {
      success: true,
      output: {
        market: data.market,
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
Location: sim-main/apps/sim/tools/kalshi/get_markets.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { KalshiMarket, KalshiPaginationParams, KalshiPagingInfo } from './types'
import { buildKalshiUrl, handleKalshiError } from './types'

export interface KalshiGetMarketsParams extends KalshiPaginationParams {
  status?: string // unopened, open, closed, settled
  seriesTicker?: string
  eventTicker?: string
}

export interface KalshiGetMarketsResponse {
  success: boolean
  output: {
    markets: KalshiMarket[]
    paging?: KalshiPagingInfo
  }
}

export const kalshiGetMarketsTool: ToolConfig<KalshiGetMarketsParams, KalshiGetMarketsResponse> = {
  id: 'kalshi_get_markets',
  name: 'Get Markets from Kalshi',
  description: 'Retrieve a list of prediction markets from Kalshi with optional filtering',
  version: '1.0.0',

  params: {
    status: {
      type: 'string',
      required: false,
      description: 'Filter by status (unopened, open, closed, settled)',
    },
    seriesTicker: {
      type: 'string',
      required: false,
      description: 'Filter by series ticker',
    },
    eventTicker: {
      type: 'string',
      required: false,
      description: 'Filter by event ticker',
    },
    limit: {
      type: 'string',
      required: false,
      description: 'Number of results (1-1000, default: 100)',
    },
    cursor: {
      type: 'string',
      required: false,
      description: 'Pagination cursor for next page',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.status) queryParams.append('status', params.status)
      if (params.seriesTicker) queryParams.append('series_ticker', params.seriesTicker)
      if (params.eventTicker) queryParams.append('event_ticker', params.eventTicker)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.cursor) queryParams.append('cursor', params.cursor)

      const query = queryParams.toString()
      const url = buildKalshiUrl('/markets')
      return query ? `${url}?${query}` : url
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handleKalshiError(data, response.status, 'get_markets')
    }

    const markets = data.markets || []

    return {
      success: true,
      output: {
        markets,
        paging: {
          cursor: data.cursor || null,
        },
      },
    }
  },

  outputs: {
    markets: {
      type: 'array',
      description: 'Array of market objects',
    },
    paging: {
      type: 'object',
      description: 'Pagination cursor for fetching more results',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_order.ts]---
Location: sim-main/apps/sim/tools/kalshi/get_order.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { KalshiAuthParams, KalshiOrder } from './types'
import { buildKalshiAuthHeaders, buildKalshiUrl, handleKalshiError } from './types'

export interface KalshiGetOrderParams extends KalshiAuthParams {
  orderId: string // Order ID to retrieve (required)
}

export interface KalshiGetOrderResponse {
  success: boolean
  output: {
    order: KalshiOrder
  }
}

export const kalshiGetOrderTool: ToolConfig<KalshiGetOrderParams, KalshiGetOrderResponse> = {
  id: 'kalshi_get_order',
  name: 'Get Order from Kalshi',
  description: 'Retrieve details of a specific order by ID from Kalshi',
  version: '1.0.0',

  params: {
    keyId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Kalshi API Key ID',
    },
    privateKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your RSA Private Key (PEM format)',
    },
    orderId: {
      type: 'string',
      required: true,
      description: 'The order ID to retrieve',
    },
  },

  request: {
    url: (params) => buildKalshiUrl(`/portfolio/orders/${params.orderId}`),
    method: 'GET',
    headers: (params) => {
      const path = `/trade-api/v2/portfolio/orders/${params.orderId}`
      return buildKalshiAuthHeaders(params.keyId, params.privateKey, 'GET', path)
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handleKalshiError(data, response.status, 'get_order')
    }

    return {
      success: true,
      output: {
        order: data.order,
      },
    }
  },

  outputs: {
    order: {
      type: 'object',
      description: 'Order object with details',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_orderbook.ts]---
Location: sim-main/apps/sim/tools/kalshi/get_orderbook.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { KalshiOrderbook } from './types'
import { buildKalshiUrl, handleKalshiError } from './types'

export interface KalshiGetOrderbookParams {
  ticker: string
}

export interface KalshiGetOrderbookResponse {
  success: boolean
  output: {
    orderbook: KalshiOrderbook
  }
}

export const kalshiGetOrderbookTool: ToolConfig<
  KalshiGetOrderbookParams,
  KalshiGetOrderbookResponse
> = {
  id: 'kalshi_get_orderbook',
  name: 'Get Market Orderbook from Kalshi',
  description: 'Retrieve the orderbook (yes and no bids) for a specific market',
  version: '1.0.0',

  params: {
    ticker: {
      type: 'string',
      required: true,
      description: 'Market ticker (e.g., KXBTC-24DEC31)',
    },
  },

  request: {
    url: (params) => buildKalshiUrl(`/markets/${params.ticker}/orderbook`),
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handleKalshiError(data, response.status, 'get_orderbook')
    }

    const orderbook = data.orderbook || { yes: [], no: [] }

    return {
      success: true,
      output: {
        orderbook,
      },
    }
  },

  outputs: {
    orderbook: {
      type: 'object',
      description: 'Orderbook with yes/no bids and asks',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_orders.ts]---
Location: sim-main/apps/sim/tools/kalshi/get_orders.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type {
  KalshiAuthParams,
  KalshiOrder,
  KalshiPaginationParams,
  KalshiPagingInfo,
} from './types'
import { buildKalshiAuthHeaders, buildKalshiUrl, handleKalshiError } from './types'

export interface KalshiGetOrdersParams extends KalshiAuthParams, KalshiPaginationParams {
  ticker?: string
  eventTicker?: string
  status?: string // resting, canceled, executed
}

export interface KalshiGetOrdersResponse {
  success: boolean
  output: {
    orders: KalshiOrder[]
    paging?: KalshiPagingInfo
  }
}

export const kalshiGetOrdersTool: ToolConfig<KalshiGetOrdersParams, KalshiGetOrdersResponse> = {
  id: 'kalshi_get_orders',
  name: 'Get Orders from Kalshi',
  description: 'Retrieve your orders from Kalshi with optional filtering',
  version: '1.0.0',

  params: {
    keyId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Kalshi API Key ID',
    },
    privateKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your RSA Private Key (PEM format)',
    },
    ticker: {
      type: 'string',
      required: false,
      description: 'Filter by market ticker',
    },
    eventTicker: {
      type: 'string',
      required: false,
      description: 'Filter by event ticker (max 10 comma-separated)',
    },
    status: {
      type: 'string',
      required: false,
      description: 'Filter by status (resting, canceled, executed)',
    },
    limit: {
      type: 'string',
      required: false,
      description: 'Number of results (1-200, default: 100)',
    },
    cursor: {
      type: 'string',
      required: false,
      description: 'Pagination cursor for next page',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.ticker) queryParams.append('ticker', params.ticker)
      if (params.eventTicker) queryParams.append('event_ticker', params.eventTicker)
      if (params.status) queryParams.append('status', params.status)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.cursor) queryParams.append('cursor', params.cursor)

      const query = queryParams.toString()
      const url = buildKalshiUrl('/portfolio/orders')
      return query ? `${url}?${query}` : url
    },
    method: 'GET',
    headers: (params) => {
      const path = '/trade-api/v2/portfolio/orders'
      return buildKalshiAuthHeaders(params.keyId, params.privateKey, 'GET', path)
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handleKalshiError(data, response.status, 'get_orders')
    }

    const orders = data.orders || []

    return {
      success: true,
      output: {
        orders,
        paging: {
          cursor: data.cursor || null,
        },
      },
    }
  },

  outputs: {
    orders: {
      type: 'array',
      description: 'Array of order objects',
    },
    paging: {
      type: 'object',
      description: 'Pagination cursor for fetching more results',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_positions.ts]---
Location: sim-main/apps/sim/tools/kalshi/get_positions.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type {
  KalshiAuthParams,
  KalshiPaginationParams,
  KalshiPagingInfo,
  KalshiPosition,
} from './types'
import { buildKalshiAuthHeaders, buildKalshiUrl, handleKalshiError } from './types'

export interface KalshiGetPositionsParams extends KalshiAuthParams, KalshiPaginationParams {
  ticker?: string
  eventTicker?: string
  settlementStatus?: string // all, unsettled, settled
}

export interface KalshiGetPositionsResponse {
  success: boolean
  output: {
    positions: KalshiPosition[]
    paging?: KalshiPagingInfo
  }
}

export const kalshiGetPositionsTool: ToolConfig<
  KalshiGetPositionsParams,
  KalshiGetPositionsResponse
> = {
  id: 'kalshi_get_positions',
  name: 'Get Positions from Kalshi',
  description: 'Retrieve your open positions from Kalshi',
  version: '1.0.0',

  params: {
    keyId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Kalshi API Key ID',
    },
    privateKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your RSA Private Key (PEM format)',
    },
    ticker: {
      type: 'string',
      required: false,
      description: 'Filter by market ticker',
    },
    eventTicker: {
      type: 'string',
      required: false,
      description: 'Filter by event ticker (max 10 comma-separated)',
    },
    settlementStatus: {
      type: 'string',
      required: false,
      description: 'Filter by settlement status (all, unsettled, settled). Default: unsettled',
    },
    limit: {
      type: 'string',
      required: false,
      description: 'Number of results (1-1000, default: 100)',
    },
    cursor: {
      type: 'string',
      required: false,
      description: 'Pagination cursor for next page',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.ticker) queryParams.append('ticker', params.ticker)
      if (params.eventTicker) queryParams.append('event_ticker', params.eventTicker)
      if (params.settlementStatus) queryParams.append('settlement_status', params.settlementStatus)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.cursor) queryParams.append('cursor', params.cursor)

      const query = queryParams.toString()
      const url = buildKalshiUrl('/portfolio/positions')
      return query ? `${url}?${query}` : url
    },
    method: 'GET',
    headers: (params) => {
      const path = '/trade-api/v2/portfolio/positions'
      return buildKalshiAuthHeaders(params.keyId, params.privateKey, 'GET', path)
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handleKalshiError(data, response.status, 'get_positions')
    }

    const positions = data.market_positions || data.positions || []

    return {
      success: true,
      output: {
        positions,
        paging: {
          cursor: data.cursor || null,
        },
      },
    }
  },

  outputs: {
    positions: {
      type: 'array',
      description: 'Array of position objects',
    },
    paging: {
      type: 'object',
      description: 'Pagination cursor for fetching more results',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_series_by_ticker.ts]---
Location: sim-main/apps/sim/tools/kalshi/get_series_by_ticker.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { KalshiSeries } from './types'
import { buildKalshiUrl, handleKalshiError } from './types'

export interface KalshiGetSeriesByTickerParams {
  seriesTicker: string
}

export interface KalshiGetSeriesByTickerResponse {
  success: boolean
  output: {
    series: KalshiSeries
  }
}

export const kalshiGetSeriesByTickerTool: ToolConfig<
  KalshiGetSeriesByTickerParams,
  KalshiGetSeriesByTickerResponse
> = {
  id: 'kalshi_get_series_by_ticker',
  name: 'Get Series by Ticker from Kalshi',
  description: 'Retrieve details of a specific market series by ticker',
  version: '1.0.0',

  params: {
    seriesTicker: {
      type: 'string',
      required: true,
      description: 'Series ticker',
    },
  },

  request: {
    url: (params) => {
      return buildKalshiUrl(`/series/${params.seriesTicker}`)
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handleKalshiError(data, response.status, 'get_series_by_ticker')
    }

    const series = data.series || data

    return {
      success: true,
      output: {
        series,
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

---[FILE: get_trades.ts]---
Location: sim-main/apps/sim/tools/kalshi/get_trades.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { KalshiPaginationParams, KalshiPagingInfo, KalshiTrade } from './types'
import { buildKalshiUrl, handleKalshiError } from './types'

export interface KalshiGetTradesParams extends KalshiPaginationParams {}

export interface KalshiGetTradesResponse {
  success: boolean
  output: {
    trades: KalshiTrade[]
    paging?: KalshiPagingInfo
  }
}

export const kalshiGetTradesTool: ToolConfig<KalshiGetTradesParams, KalshiGetTradesResponse> = {
  id: 'kalshi_get_trades',
  name: 'Get Trades from Kalshi',
  description: 'Retrieve recent trades across all markets',
  version: '1.0.0',

  params: {
    limit: {
      type: 'string',
      required: false,
      description: 'Number of results (1-1000, default: 100)',
    },
    cursor: {
      type: 'string',
      required: false,
      description: 'Pagination cursor for next page',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.cursor) queryParams.append('cursor', params.cursor)

      const query = queryParams.toString()
      const url = buildKalshiUrl('/markets/trades')
      return query ? `${url}?${query}` : url
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handleKalshiError(data, response.status, 'get_trades')
    }

    const trades = data.trades || []

    return {
      success: true,
      output: {
        trades,
        paging: {
          cursor: data.cursor || null,
        },
      },
    }
  },

  outputs: {
    trades: {
      type: 'array',
      description: 'Array of trade objects',
    },
    paging: {
      type: 'object',
      description: 'Pagination cursor for fetching more results',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/kalshi/index.ts

```typescript
export { kalshiAmendOrderTool } from './amend_order'
export { kalshiCancelOrderTool } from './cancel_order'
export { kalshiCreateOrderTool } from './create_order'
export { kalshiGetBalanceTool } from './get_balance'
export { kalshiGetCandlesticksTool } from './get_candlesticks'
export { kalshiGetEventTool } from './get_event'
export { kalshiGetEventsTool } from './get_events'
export { kalshiGetExchangeStatusTool } from './get_exchange_status'
export { kalshiGetFillsTool } from './get_fills'
export { kalshiGetMarketTool } from './get_market'
export { kalshiGetMarketsTool } from './get_markets'
export { kalshiGetOrderTool } from './get_order'
export { kalshiGetOrderbookTool } from './get_orderbook'
export { kalshiGetOrdersTool } from './get_orders'
export { kalshiGetPositionsTool } from './get_positions'
export { kalshiGetSeriesByTickerTool } from './get_series_by_ticker'
export { kalshiGetTradesTool } from './get_trades'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/kalshi/types.ts

```typescript
import crypto from 'crypto'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('Kalshi')

// Base URL for Kalshi API
export const KALSHI_BASE_URL = 'https://api.elections.kalshi.com/trade-api/v2'

// Base params for authenticated endpoints
export interface KalshiAuthParams {
  keyId: string // API Key ID
  privateKey: string // RSA Private Key (PEM format)
}

// Pagination params
export interface KalshiPaginationParams {
  limit?: string // 1-1000, default 100
  cursor?: string // Pagination cursor
}

// Pagination info in response
export interface KalshiPagingInfo {
  cursor?: string | null
}

// Generic response type
export interface KalshiResponse<T> {
  success: boolean
  output: T & {
    paging?: KalshiPagingInfo
    metadata: {
      operation: string
      [key: string]: any
    }
    success: boolean
  }
}

// Market type
export interface KalshiMarket {
  ticker: string
  event_ticker: string
  market_type: string
  title: string
  subtitle?: string
  yes_sub_title?: string
  no_sub_title?: string
  open_time: string
  close_time: string
  expiration_time: string
  status: string
  yes_bid: number
  yes_ask: number
  no_bid: number
  no_ask: number
  last_price: number
  previous_yes_bid?: number
  previous_yes_ask?: number
  previous_price?: number
  volume: number
  volume_24h: number
  liquidity?: number
  open_interest?: number
  result?: string
  cap_strike?: number
  floor_strike?: number
}

// Event type
export interface KalshiEvent {
  event_ticker: string
  series_ticker: string
  sub_title?: string
  title: string
  mutually_exclusive: boolean
  category: string
  markets?: KalshiMarket[]
  strike_date?: string
  status?: string
}

// Balance type
export interface KalshiBalance {
  balance: number // In cents
  portfolio_value?: number // In cents
}

// Position type
export interface KalshiPosition {
  ticker: string
  event_ticker: string
  event_title?: string
  market_title?: string
  position: number
  market_exposure?: number
  realized_pnl?: number
  total_traded?: number
  resting_orders_count?: number
}

// Order type
export interface KalshiOrder {
  order_id: string
  ticker: string
  event_ticker: string
  status: string
  side: string
  type: string
  yes_price?: number
  no_price?: number
  action: string
  count: number
  remaining_count: number
  created_time: string
  expiration_time?: string
  place_count?: number
  decrease_count?: number
  maker_fill_count?: number
  taker_fill_count?: number
  taker_fees?: number
}

// Orderbook type
export interface KalshiOrderbookLevel {
  price: number
  quantity: number
}

export interface KalshiOrderbook {
  yes: KalshiOrderbookLevel[]
  no: KalshiOrderbookLevel[]
}

// Trade type
export interface KalshiTrade {
  ticker: string
  yes_price: number
  no_price: number
  count: number
  created_time: string
  taker_side: string
}

// Candlestick type
export interface KalshiCandlestick {
  open_time: string
  close_time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// Fill type
export interface KalshiFill {
  created_time: string
  ticker: string
  is_taker: boolean
  side: string
  yes_price: number
  no_price: number
  count: number
  order_id: string
  trade_id: string
}

// Settlement source type
export interface KalshiSettlementSource {
  name: string
  url: string
}

// Series type
export interface KalshiSeries {
  ticker: string
  title: string
  frequency: string
  category: string
  tags?: string[]
  settlement_sources?: KalshiSettlementSource[]
  contract_url?: string
  contract_terms_url?: string
  fee_type?: string // 'quadratic' | 'quadratic_with_maker_fees' | 'flat'
  fee_multiplier?: number
  additional_prohibitions?: string[]
  product_metadata?: Record<string, unknown>
}

// Exchange status type
export interface KalshiExchangeStatus {
  trading_active: boolean
  exchange_active: boolean
}

// Helper function to build Kalshi API URLs
export function buildKalshiUrl(path: string): string {
  return `${KALSHI_BASE_URL}${path}`
}

// Helper to normalize PEM key format
// Handles: literal \n strings, missing line breaks, various PEM formats
function normalizePemKey(privateKey: string): string {
  let key = privateKey.trim()

  // Convert literal \n strings to actual newlines
  key = key.replace(/\\n/g, '\n')

  // Extract the key type and base64 content
  const beginMatch = key.match(/-----BEGIN ([A-Z\s]+)-----/)
  const endMatch = key.match(/-----END ([A-Z\s]+)-----/)

  if (beginMatch && endMatch) {
    // Extract the key type (e.g., "RSA PRIVATE KEY" or "PRIVATE KEY")
    const keyType = beginMatch[1]

    // Extract base64 content between headers
    const startIdx = key.indexOf('-----', key.indexOf('-----') + 5) + 5
    const endIdx = key.lastIndexOf('-----END')
    let base64Content = key.substring(startIdx, endIdx)

    // Remove all whitespace from base64 content
    base64Content = base64Content.replace(/\s/g, '')

    // Reconstruct PEM with proper 64-character line breaks
    const lines: string[] = []
    for (let i = 0; i < base64Content.length; i += 64) {
      lines.push(base64Content.substring(i, i + 64))
    }

    return `-----BEGIN ${keyType}-----\n${lines.join('\n')}\n-----END ${keyType}-----`
  }

  // No PEM headers found - assume raw base64, wrap in PKCS#8 format
  const cleanKey = key.replace(/\s/g, '')
  const lines: string[] = []
  for (let i = 0; i < cleanKey.length; i += 64) {
    lines.push(cleanKey.substring(i, i + 64))
  }

  return `-----BEGIN PRIVATE KEY-----\n${lines.join('\n')}\n-----END PRIVATE KEY-----`
}

// RSA-PSS signature generation for authenticated requests
// Kalshi requires RSA-PSS with SHA256, not plain PKCS#1 v1.5
export function generateKalshiSignature(
  privateKey: string,
  timestamp: string,
  method: string,
  path: string
): string {
  // Sign: timestamp + method + path (without query params)
  // Strip query params from path for signing
  const pathWithoutQuery = path.split('?')[0]
  const message = timestamp + method.toUpperCase() + pathWithoutQuery

  // Normalize PEM key format (handles literal \n, missing line breaks, etc.)
  const pemKey = normalizePemKey(privateKey)

  // Use RSA-PSS padding with SHA256 (required by Kalshi API)
  const signature = crypto.sign('sha256', Buffer.from(message, 'utf-8'), {
    key: pemKey,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
  })

  return signature.toString('base64')
}

// Build auth headers for authenticated requests
export function buildKalshiAuthHeaders(
  keyId: string,
  privateKey: string,
  method: string,
  path: string
): Record<string, string> {
  const timestamp = Date.now().toString()
  const signature = generateKalshiSignature(privateKey, timestamp, method, path)

  return {
    'KALSHI-ACCESS-KEY': keyId,
    'KALSHI-ACCESS-TIMESTAMP': timestamp,
    'KALSHI-ACCESS-SIGNATURE': signature,
    'Content-Type': 'application/json',
  }
}

// Helper function for consistent error handling
export function handleKalshiError(data: any, status: number, operation: string): never {
  logger.error(`Kalshi API request failed for ${operation}`, { data, status })

  const errorMessage =
    data.error?.message || data.error || data.message || data.detail || 'Unknown error'
  throw new Error(`Kalshi ${operation} failed: ${errorMessage}`)
}
```

--------------------------------------------------------------------------------

---[FILE: create_document.ts]---
Location: sim-main/apps/sim/tools/knowledge/create_document.ts

```typescript
import type { KnowledgeCreateDocumentResponse } from '@/tools/knowledge/types'
import type { ToolConfig } from '@/tools/types'

export const knowledgeCreateDocumentTool: ToolConfig<any, KnowledgeCreateDocumentResponse> = {
  id: 'knowledge_create_document',
  name: 'Knowledge Create Document',
  description: 'Create a new document in a knowledge base',
  version: '1.0.0',

  params: {
    knowledgeBaseId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'ID of the knowledge base containing the document',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Name of the document',
    },
    content: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Content of the document',
    },
    tag1: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Tag 1 value for the document',
    },
    tag2: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Tag 2 value for the document',
    },
    tag3: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Tag 3 value for the document',
    },
    tag4: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Tag 4 value for the document',
    },
    tag5: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Tag 5 value for the document',
    },
    tag6: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Tag 6 value for the document',
    },
    tag7: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Tag 7 value for the document',
    },
    documentTagsData: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'Structured tag data with names, types, and values',
      items: {
        type: 'object',
        properties: {
          tagName: { type: 'string' },
          tagValue: { type: 'string' },
          tagType: { type: 'string' },
        },
      },
    },
  },

  request: {
    url: (params) => `/api/knowledge/${params.knowledgeBaseId}/documents`,
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const workflowId = params._context?.workflowId
      const textContent = params.content?.trim()
      const documentName = params.name?.trim()

      if (!documentName || documentName.length === 0) {
        throw new Error('Document name is required')
      }
      if (documentName.length > 255) {
        throw new Error('Document name must be 255 characters or less')
      }
      if (!textContent || textContent.length < 1) {
        throw new Error('Document content cannot be empty')
      }
      if (textContent.length > 1000000) {
        throw new Error('Document content exceeds maximum size of 1MB')
      }

      const contentBytes = new TextEncoder().encode(textContent).length

      const utf8Bytes = new TextEncoder().encode(textContent)
      const base64Content =
        typeof Buffer !== 'undefined'
          ? Buffer.from(textContent, 'utf8').toString('base64')
          : btoa(String.fromCharCode(...utf8Bytes))

      const dataUri = `data:text/plain;base64,${base64Content}`

      const tagData: Record<string, string> = {}

      if (params.documentTags) {
        let parsedTags = params.documentTags

        // Handle both string (JSON) and array formats
        if (typeof params.documentTags === 'string') {
          try {
            parsedTags = JSON.parse(params.documentTags)
          } catch (error) {
            parsedTags = []
          }
        }

        if (Array.isArray(parsedTags)) {
          tagData.documentTagsData = JSON.stringify(parsedTags)
        }
      }

      const documents = [
        {
          filename: documentName.endsWith('.txt') ? documentName : `${documentName}.txt`,
          fileUrl: dataUri,
          fileSize: contentBytes,
          mimeType: 'text/plain',
          ...tagData,
        },
      ]

      const requestBody = {
        documents: documents,
        processingOptions: {
          chunkSize: 1024,
          minCharactersPerChunk: 1,
          chunkOverlap: 200,
          recipe: 'default',
          lang: 'en',
        },
        bulk: true,
        ...(workflowId && { workflowId }),
      }

      return requestBody
    },
  },

  transformResponse: async (response): Promise<KnowledgeCreateDocumentResponse> => {
    const result = await response.json()
    const data = result.data || result
    const documentsCreated = data.documentsCreated || []

    // Handle multiple documents response
    const uploadCount = documentsCreated.length
    const firstDocument = documentsCreated[0]

    return {
      success: true,
      output: {
        message:
          uploadCount > 1
            ? `Successfully created ${uploadCount} documents in knowledge base`
            : `Successfully created document in knowledge base`,
        data: {
          documentId: firstDocument?.documentId || firstDocument?.id || '',
          documentName:
            uploadCount > 1 ? `${uploadCount} documents` : firstDocument?.filename || 'Unknown',
          type: 'document',
          enabled: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    }
  },

  outputs: {
    data: {
      type: 'object',
      description: 'Information about the created document',
      properties: {
        documentId: { type: 'string', description: 'Document ID' },
        documentName: { type: 'string', description: 'Document name' },
        type: { type: 'string', description: 'Document type' },
        enabled: { type: 'boolean', description: 'Whether the document is enabled' },
        createdAt: { type: 'string', description: 'Creation timestamp' },
        updatedAt: { type: 'string', description: 'Last update timestamp' },
      },
    },
    message: {
      type: 'string',
      description: 'Success or error message describing the operation result',
    },
    documentId: {
      type: 'string',
      description: 'ID of the created document',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/knowledge/index.ts

```typescript
import { knowledgeCreateDocumentTool } from '@/tools/knowledge/create_document'
import { knowledgeSearchTool } from '@/tools/knowledge/search'
import { knowledgeUploadChunkTool } from '@/tools/knowledge/upload_chunk'

export { knowledgeSearchTool, knowledgeUploadChunkTool, knowledgeCreateDocumentTool }
```

--------------------------------------------------------------------------------

````
