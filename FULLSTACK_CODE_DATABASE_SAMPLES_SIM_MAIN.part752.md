---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 752
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 752 of 933)

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

---[FILE: list_inventory_items.ts]---
Location: sim-main/apps/sim/tools/shopify/list_inventory_items.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'
import type { ShopifyBaseParams } from './types'

interface ShopifyListInventoryItemsParams extends ShopifyBaseParams {
  first?: number
  query?: string
}

interface ShopifyInventoryItemsResponse extends ToolResponse {
  output: {
    inventoryItems?: Array<{
      id: string
      sku: string | null
      tracked: boolean
      createdAt: string
      updatedAt: string
      variant?: {
        id: string
        title: string
        product?: {
          id: string
          title: string
        }
      }
      inventoryLevels: Array<{
        id: string
        available: number
        location: {
          id: string
          name: string
        }
      }>
    }>
    pageInfo?: {
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
  }
}

export const shopifyListInventoryItemsTool: ToolConfig<
  ShopifyListInventoryItemsParams,
  ShopifyInventoryItemsResponse
> = {
  id: 'shopify_list_inventory_items',
  name: 'Shopify List Inventory Items',
  description:
    'List inventory items from your Shopify store. Use this to find inventory item IDs by SKU.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'shopify',
  },

  params: {
    shopDomain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Shopify store domain (e.g., mystore.myshopify.com)',
    },
    first: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of inventory items to return (default: 50, max: 250)',
    },
    query: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Search query to filter inventory items (e.g., "sku:ABC123")',
    },
  },

  request: {
    url: (params) =>
      `https://${params.shopDomain || params.idToken}/admin/api/2024-10/graphql.json`,
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Shopify API request')
      }
      return {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': params.accessToken,
      }
    },
    body: (params) => {
      const first = Math.min(params.first || 50, 250)

      return {
        query: `
          query listInventoryItems($first: Int!, $query: String) {
            inventoryItems(first: $first, query: $query) {
              edges {
                node {
                  id
                  sku
                  tracked
                  createdAt
                  updatedAt
                  variant {
                    id
                    title
                    product {
                      id
                      title
                    }
                  }
                  inventoryLevels(first: 10) {
                    edges {
                      node {
                        id
                        quantities(names: ["available", "on_hand"]) {
                          name
                          quantity
                        }
                        location {
                          id
                          name
                        }
                      }
                    }
                  }
                }
              }
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
            }
          }
        `,
        variables: {
          first,
          query: params.query || null,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to list inventory items',
        output: {},
      }
    }

    const inventoryItemsData = data.data?.inventoryItems
    if (!inventoryItemsData) {
      return {
        success: false,
        error: 'Failed to retrieve inventory items',
        output: {},
      }
    }

    const inventoryItems = inventoryItemsData.edges.map(
      (edge: {
        node: {
          id: string
          sku: string | null
          tracked: boolean
          createdAt: string
          updatedAt: string
          variant?: {
            id: string
            title: string
            product?: {
              id: string
              title: string
            }
          }
          inventoryLevels: {
            edges: Array<{
              node: {
                id: string
                quantities: Array<{ name: string; quantity: number }>
                location: { id: string; name: string }
              }
            }>
          }
        }
      }) => {
        const node = edge.node
        // Transform inventory levels to include available quantity
        const inventoryLevels = node.inventoryLevels.edges.map((levelEdge) => {
          const levelNode = levelEdge.node
          const availableQty =
            levelNode.quantities.find((q) => q.name === 'available')?.quantity ?? 0
          return {
            id: levelNode.id,
            available: availableQty,
            location: levelNode.location,
          }
        })

        return {
          id: node.id,
          sku: node.sku,
          tracked: node.tracked,
          createdAt: node.createdAt,
          updatedAt: node.updatedAt,
          variant: node.variant,
          inventoryLevels,
        }
      }
    )

    return {
      success: true,
      output: {
        inventoryItems,
        pageInfo: inventoryItemsData.pageInfo,
      },
    }
  },

  outputs: {
    inventoryItems: {
      type: 'array',
      description: 'List of inventory items with their IDs, SKUs, and stock levels',
    },
    pageInfo: {
      type: 'object',
      description: 'Pagination information',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_locations.ts]---
Location: sim-main/apps/sim/tools/shopify/list_locations.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'
import type { ShopifyBaseParams } from './types'

interface ShopifyListLocationsParams extends ShopifyBaseParams {
  first?: number
  includeInactive?: boolean
}

interface ShopifyLocationsResponse extends ToolResponse {
  output: {
    locations?: Array<{
      id: string
      name: string
      isActive: boolean
      fulfillsOnlineOrders: boolean
      address: {
        address1: string | null
        address2: string | null
        city: string | null
        province: string | null
        provinceCode: string | null
        country: string | null
        countryCode: string | null
        zip: string | null
        phone: string | null
      } | null
    }>
    pageInfo?: {
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
  }
}

export const shopifyListLocationsTool: ToolConfig<
  ShopifyListLocationsParams,
  ShopifyLocationsResponse
> = {
  id: 'shopify_list_locations',
  name: 'Shopify List Locations',
  description:
    'List inventory locations from your Shopify store. Use this to find location IDs needed for inventory operations.',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'shopify',
  },

  params: {
    shopDomain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Shopify store domain (e.g., mystore.myshopify.com)',
    },
    first: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of locations to return (default: 50, max: 250)',
    },
    includeInactive: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether to include deactivated locations (default: false)',
    },
  },

  request: {
    url: (params) =>
      `https://${params.shopDomain || params.idToken}/admin/api/2024-10/graphql.json`,
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Shopify API request')
      }
      return {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': params.accessToken,
      }
    },
    body: (params) => {
      const first = Math.min(params.first || 50, 250)

      return {
        query: `
          query listLocations($first: Int!, $includeInactive: Boolean) {
            locations(first: $first, includeInactive: $includeInactive) {
              edges {
                node {
                  id
                  name
                  isActive
                  fulfillsOnlineOrders
                  address {
                    address1
                    address2
                    city
                    province
                    provinceCode
                    country
                    countryCode
                    zip
                    phone
                  }
                }
              }
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
            }
          }
        `,
        variables: {
          first,
          includeInactive: params.includeInactive || false,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to list locations',
        output: {},
      }
    }

    const locationsData = data.data?.locations
    if (!locationsData) {
      return {
        success: false,
        error: 'Failed to retrieve locations',
        output: {},
      }
    }

    const locations = locationsData.edges.map((edge: { node: unknown }) => edge.node)

    return {
      success: true,
      output: {
        locations,
        pageInfo: locationsData.pageInfo,
      },
    }
  },

  outputs: {
    locations: {
      type: 'array',
      description: 'List of locations with their IDs, names, and addresses',
    },
    pageInfo: {
      type: 'object',
      description: 'Pagination information',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_orders.ts]---
Location: sim-main/apps/sim/tools/shopify/list_orders.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ShopifyListOrdersParams, ShopifyOrdersResponse } from './types'

export const shopifyListOrdersTool: ToolConfig<ShopifyListOrdersParams, ShopifyOrdersResponse> = {
  id: 'shopify_list_orders',
  name: 'Shopify List Orders',
  description: 'List orders from your Shopify store with optional filtering',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'shopify',
  },

  params: {
    shopDomain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Shopify store domain (e.g., mystore.myshopify.com)',
    },
    first: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of orders to return (default: 50, max: 250)',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by order status (open, closed, cancelled, any)',
    },
    query: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Search query to filter orders (e.g., "financial_status:paid" or "fulfillment_status:unfulfilled" or "email:customer@example.com")',
    },
  },

  request: {
    url: (params) =>
      `https://${params.shopDomain || params.idToken}/admin/api/2024-10/graphql.json`,
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Shopify API request')
      }
      return {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': params.accessToken,
      }
    },
    body: (params) => {
      const first = Math.min(params.first || 50, 250)

      // Build query string with status filter if provided
      const queryParts: string[] = []
      if (params.status && params.status !== 'any') {
        queryParts.push(`status:${params.status}`)
      }
      if (params.query) {
        queryParts.push(params.query)
      }
      const queryString = queryParts.length > 0 ? queryParts.join(' ') : null

      return {
        query: `
          query listOrders($first: Int!, $query: String) {
            orders(first: $first, query: $query) {
              edges {
                node {
                  id
                  name
                  email
                  phone
                  createdAt
                  updatedAt
                  cancelledAt
                  closedAt
                  displayFinancialStatus
                  displayFulfillmentStatus
                  totalPriceSet {
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                  subtotalPriceSet {
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                  note
                  tags
                  customer {
                    id
                    email
                    firstName
                    lastName
                  }
                  lineItems(first: 10) {
                    edges {
                      node {
                        id
                        title
                        quantity
                        variant {
                          id
                          title
                          price
                          sku
                        }
                      }
                    }
                  }
                  shippingAddress {
                    firstName
                    lastName
                    city
                    province
                    country
                    zip
                  }
                }
              }
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
            }
          }
        `,
        variables: {
          first,
          query: queryString,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to list orders',
        output: {},
      }
    }

    const ordersData = data.data?.orders
    if (!ordersData) {
      return {
        success: false,
        error: 'Failed to retrieve orders',
        output: {},
      }
    }

    const orders = ordersData.edges.map((edge: { node: unknown }) => edge.node)

    return {
      success: true,
      output: {
        orders,
        pageInfo: ordersData.pageInfo,
      },
    }
  },

  outputs: {
    orders: {
      type: 'array',
      description: 'List of orders',
    },
    pageInfo: {
      type: 'object',
      description: 'Pagination information',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_products.ts]---
Location: sim-main/apps/sim/tools/shopify/list_products.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ShopifyListProductsParams, ShopifyProductsResponse } from './types'

export const shopifyListProductsTool: ToolConfig<
  ShopifyListProductsParams,
  ShopifyProductsResponse
> = {
  id: 'shopify_list_products',
  name: 'Shopify List Products',
  description: 'List products from your Shopify store with optional filtering',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'shopify',
  },

  params: {
    shopDomain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Shopify store domain (e.g., mystore.myshopify.com)',
    },
    first: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of products to return (default: 50, max: 250)',
    },
    query: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Search query to filter products (e.g., "title:shirt" or "vendor:Nike" or "status:active")',
    },
  },

  request: {
    url: (params) =>
      `https://${params.shopDomain || params.idToken}/admin/api/2024-10/graphql.json`,
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Shopify API request')
      }
      return {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': params.accessToken,
      }
    },
    body: (params) => {
      const first = Math.min(params.first || 50, 250)

      return {
        query: `
          query listProducts($first: Int!, $query: String) {
            products(first: $first, query: $query) {
              edges {
                node {
                  id
                  title
                  handle
                  descriptionHtml
                  vendor
                  productType
                  tags
                  status
                  createdAt
                  updatedAt
                  variants(first: 10) {
                    edges {
                      node {
                        id
                        title
                        price
                        compareAtPrice
                        sku
                        inventoryQuantity
                      }
                    }
                  }
                  images(first: 5) {
                    edges {
                      node {
                        id
                        url
                        altText
                      }
                    }
                  }
                }
              }
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
            }
          }
        `,
        variables: {
          first,
          query: params.query || null,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to list products',
        output: {},
      }
    }

    const productsData = data.data?.products
    if (!productsData) {
      return {
        success: false,
        error: 'Failed to retrieve products',
        output: {},
      }
    }

    const products = productsData.edges.map((edge: { node: unknown }) => edge.node)

    return {
      success: true,
      output: {
        products,
        pageInfo: productsData.pageInfo,
      },
    }
  },

  outputs: {
    products: {
      type: 'array',
      description: 'List of products',
    },
    pageInfo: {
      type: 'object',
      description: 'Pagination information',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/shopify/types.ts

```typescript
// Shopify GraphQL API Types
import type { ToolResponse } from '@/tools/types'

// Common GraphQL Response Types
export interface ShopifyGraphQLError {
  message: string
  locations?: { line: number; column: number }[]
  path?: string[]
  extensions?: Record<string, unknown>
}

export interface ShopifyUserError {
  field: string[]
  message: string
}

// Product Types
export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  descriptionHtml: string
  vendor: string
  productType: string
  tags: string[]
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
  variants: {
    edges: Array<{
      node: ShopifyVariant
    }>
  }
  images: {
    edges: Array<{
      node: ShopifyImage
    }>
  }
}

export interface ShopifyVariant {
  id: string
  title: string
  price: string
  compareAtPrice: string | null
  sku: string | null
  inventoryQuantity: number
}

export interface ShopifyImage {
  id: string
  url: string
  altText: string | null
}

// Order Types
export interface ShopifyOrder {
  id: string
  name: string
  email: string | null
  phone: string | null
  createdAt: string
  updatedAt: string
  cancelledAt: string | null
  closedAt: string | null
  displayFinancialStatus: string
  displayFulfillmentStatus: string
  totalPriceSet: ShopifyMoneyBag
  subtotalPriceSet: ShopifyMoneyBag
  totalTaxSet: ShopifyMoneyBag
  totalShippingPriceSet: ShopifyMoneyBag
  note: string | null
  tags: string[]
  customer: ShopifyCustomer | null
  lineItems: {
    edges: Array<{
      node: ShopifyLineItem
    }>
  }
  shippingAddress: ShopifyAddress | null
  billingAddress: ShopifyAddress | null
  fulfillments: ShopifyFulfillment[]
}

export interface ShopifyMoneyBag {
  shopMoney: {
    amount: string
    currencyCode: string
  }
  presentmentMoney: {
    amount: string
    currencyCode: string
  }
}

export interface ShopifyLineItem {
  id: string
  title: string
  quantity: number
  variant: ShopifyVariant | null
  originalTotalSet: ShopifyMoneyBag
  discountedTotalSet: ShopifyMoneyBag
}

export interface ShopifyAddress {
  firstName: string | null
  lastName: string | null
  address1: string | null
  address2: string | null
  city: string | null
  province: string | null
  provinceCode: string | null
  country: string | null
  countryCode: string | null
  zip: string | null
  phone: string | null
}

// Customer Types
export interface ShopifyCustomer {
  id: string
  email: string | null
  firstName: string | null
  lastName: string | null
  phone: string | null
  createdAt: string
  updatedAt: string
  note: string | null
  tags: string[]
  amountSpent: {
    amount: string
    currencyCode: string
  }
  addresses: ShopifyAddress[]
  defaultAddress: ShopifyAddress | null
}

// Fulfillment Types
export interface ShopifyFulfillment {
  id: string
  status: string
  createdAt: string
  updatedAt: string
  trackingInfo: Array<{
    company: string | null
    number: string | null
    url: string | null
  }>
}

// Inventory Types
export interface ShopifyInventoryLevel {
  id: string
  available: number
  onHand: number
  committed: number
  incoming: number
  reserved: number
  location: {
    id: string
    name: string
  }
}

export interface ShopifyInventoryItem {
  id: string
  sku: string | null
  tracked: boolean
  inventoryLevels: {
    edges: Array<{
      node: ShopifyInventoryLevel
    }>
  }
}

// Tool Parameter Types
export interface ShopifyBaseParams {
  accessToken: string
  shopDomain: string
  idToken?: string // Shop domain from OAuth, used as fallback
}

// Product Tool Params
export interface ShopifyCreateProductParams extends ShopifyBaseParams {
  title: string
  descriptionHtml?: string
  vendor?: string
  productType?: string
  tags?: string[]
  status?: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
}

export interface ShopifyGetProductParams extends ShopifyBaseParams {
  productId: string
}

export interface ShopifyListProductsParams extends ShopifyBaseParams {
  first?: number
  query?: string
}

export interface ShopifyUpdateProductParams extends ShopifyBaseParams {
  productId: string
  title?: string
  descriptionHtml?: string
  vendor?: string
  productType?: string
  tags?: string[]
  status?: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
}

export interface ShopifyDeleteProductParams extends ShopifyBaseParams {
  productId: string
}

// Order Tool Params
export interface ShopifyGetOrderParams extends ShopifyBaseParams {
  orderId: string
}

export interface ShopifyListOrdersParams extends ShopifyBaseParams {
  first?: number
  status?: string
  query?: string
}

export interface ShopifyUpdateOrderParams extends ShopifyBaseParams {
  orderId: string
  note?: string
  tags?: string[]
  email?: string
}

export interface ShopifyCancelOrderParams extends ShopifyBaseParams {
  orderId: string
  reason: 'CUSTOMER' | 'FRAUD' | 'INVENTORY' | 'DECLINED' | 'OTHER'
  notifyCustomer?: boolean
  refund?: boolean
  restock?: boolean
  staffNote?: string
}

// Customer Tool Params
export interface ShopifyCreateCustomerParams extends ShopifyBaseParams {
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  note?: string
  tags?: string[]
  addresses?: Array<{
    address1?: string
    address2?: string
    city?: string
    province?: string
    country?: string
    zip?: string
    phone?: string
  }>
}

export interface ShopifyGetCustomerParams extends ShopifyBaseParams {
  customerId: string
}

export interface ShopifyListCustomersParams extends ShopifyBaseParams {
  first?: number
  query?: string
}

export interface ShopifyUpdateCustomerParams extends ShopifyBaseParams {
  customerId: string
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  note?: string
  tags?: string[]
}

export interface ShopifyDeleteCustomerParams extends ShopifyBaseParams {
  customerId: string
}

// Inventory Tool Params
export interface ShopifyGetInventoryLevelParams extends ShopifyBaseParams {
  inventoryItemId: string
  locationId?: string
}

export interface ShopifyAdjustInventoryParams extends ShopifyBaseParams {
  inventoryItemId: string
  locationId: string
  delta: number
}

export interface ShopifySetInventoryParams extends ShopifyBaseParams {
  inventoryItemId: string
  locationId: string
  quantity: number
}

// Fulfillment Tool Params
export interface ShopifyCreateFulfillmentParams extends ShopifyBaseParams {
  orderId: string
  lineItemIds?: string[]
  trackingNumber?: string
  trackingCompany?: string
  trackingUrl?: string
  notifyCustomer?: boolean
}

// Tool Response Types
export interface ShopifyProductResponse extends ToolResponse {
  output: {
    product?: ShopifyProduct
  }
}

export interface ShopifyProductsResponse extends ToolResponse {
  output: {
    products?: ShopifyProduct[]
    pageInfo?: {
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
  }
}

export interface ShopifyOrderResponse extends ToolResponse {
  output: {
    order?: ShopifyOrder | Record<string, unknown>
  }
}

export interface ShopifyOrdersResponse extends ToolResponse {
  output: {
    orders?: ShopifyOrder[]
    pageInfo?: {
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
  }
}

export interface ShopifyCustomerResponse extends ToolResponse {
  output: {
    customer?: ShopifyCustomer
  }
}

export interface ShopifyCustomersResponse extends ToolResponse {
  output: {
    customers?: ShopifyCustomer[]
    pageInfo?: {
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
  }
}

export interface ShopifyInventoryResponse extends ToolResponse {
  output: {
    inventoryLevel?: ShopifyInventoryLevel | Record<string, unknown>
  }
}

export interface ShopifyFulfillmentResponse extends ToolResponse {
  output: {
    fulfillment?: ShopifyFulfillment
  }
}

export interface ShopifyDeleteResponse extends ToolResponse {
  output: {
    deletedId?: string
  }
}
```

--------------------------------------------------------------------------------

---[FILE: update_customer.ts]---
Location: sim-main/apps/sim/tools/shopify/update_customer.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ShopifyCustomerResponse, ShopifyUpdateCustomerParams } from './types'

export const shopifyUpdateCustomerTool: ToolConfig<
  ShopifyUpdateCustomerParams,
  ShopifyCustomerResponse
> = {
  id: 'shopify_update_customer',
  name: 'Shopify Update Customer',
  description: 'Update an existing customer in your Shopify store',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'shopify',
  },

  params: {
    shopDomain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Shopify store domain (e.g., mystore.myshopify.com)',
    },
    customerId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Customer ID to update (gid://shopify/Customer/123456789)',
    },
    email: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New customer email address',
    },
    firstName: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New customer first name',
    },
    lastName: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New customer last name',
    },
    phone: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New customer phone number',
    },
    note: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New note about the customer',
    },
    tags: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'New customer tags',
    },
  },

  request: {
    url: (params) =>
      `https://${params.shopDomain || params.idToken}/admin/api/2024-10/graphql.json`,
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Shopify API request')
      }
      return {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': params.accessToken,
      }
    },
    body: (params) => {
      if (!params.customerId) {
        throw new Error('Customer ID is required to update a customer')
      }

      const input: Record<string, unknown> = {
        id: params.customerId,
      }

      if (params.email !== undefined) {
        input.email = params.email
      }
      if (params.firstName !== undefined) {
        input.firstName = params.firstName
      }
      if (params.lastName !== undefined) {
        input.lastName = params.lastName
      }
      if (params.phone !== undefined) {
        input.phone = params.phone
      }
      if (params.note !== undefined) {
        input.note = params.note
      }
      if (params.tags !== undefined) {
        input.tags = params.tags
      }

      return {
        query: `
          mutation customerUpdate($input: CustomerInput!) {
            customerUpdate(input: $input) {
              customer {
                id
                email
                firstName
                lastName
                phone
                createdAt
                updatedAt
                note
                tags
                amountSpent {
                  amount
                  currencyCode
                }
                addresses {
                  address1
                  city
                  province
                  country
                  zip
                }
                defaultAddress {
                  address1
                  city
                  province
                  country
                  zip
                }
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          input,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to update customer',
        output: {},
      }
    }

    const result = data.data?.customerUpdate
    if (result?.userErrors?.length > 0) {
      return {
        success: false,
        error: result.userErrors.map((e: { message: string }) => e.message).join(', '),
        output: {},
      }
    }

    const customer = result?.customer
    if (!customer) {
      return {
        success: false,
        error: 'Customer update was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        customer,
      },
    }
  },

  outputs: {
    customer: {
      type: 'object',
      description: 'The updated customer',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_order.ts]---
Location: sim-main/apps/sim/tools/shopify/update_order.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ShopifyOrderResponse, ShopifyUpdateOrderParams } from './types'

export const shopifyUpdateOrderTool: ToolConfig<ShopifyUpdateOrderParams, ShopifyOrderResponse> = {
  id: 'shopify_update_order',
  name: 'Shopify Update Order',
  description: 'Update an existing order in your Shopify store (note, tags, email)',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'shopify',
  },

  params: {
    shopDomain: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Shopify store domain (e.g., mystore.myshopify.com)',
    },
    orderId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Order ID to update (gid://shopify/Order/123456789)',
    },
    note: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New order note',
    },
    tags: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'New order tags',
    },
    email: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New customer email for the order',
    },
  },

  request: {
    url: (params) =>
      `https://${params.shopDomain || params.idToken}/admin/api/2024-10/graphql.json`,
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Shopify API request')
      }
      return {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': params.accessToken,
      }
    },
    body: (params) => {
      if (!params.orderId) {
        throw new Error('Order ID is required to update an order')
      }

      const input: Record<string, unknown> = {
        id: params.orderId,
      }

      if (params.note !== undefined) {
        input.note = params.note
      }
      if (params.tags !== undefined) {
        input.tags = params.tags
      }
      if (params.email !== undefined) {
        input.email = params.email
      }

      return {
        query: `
          mutation orderUpdate($input: OrderInput!) {
            orderUpdate(input: $input) {
              order {
                id
                name
                email
                phone
                createdAt
                updatedAt
                note
                tags
                displayFinancialStatus
                displayFulfillmentStatus
                totalPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                customer {
                  id
                  email
                  firstName
                  lastName
                }
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          input,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to update order',
        output: {},
      }
    }

    const result = data.data?.orderUpdate
    if (result?.userErrors?.length > 0) {
      return {
        success: false,
        error: result.userErrors.map((e: { message: string }) => e.message).join(', '),
        output: {},
      }
    }

    const order = result?.order
    if (!order) {
      return {
        success: false,
        error: 'Order update was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        order,
      },
    }
  },

  outputs: {
    order: {
      type: 'object',
      description: 'The updated order',
    },
  },
}
```

--------------------------------------------------------------------------------

````
