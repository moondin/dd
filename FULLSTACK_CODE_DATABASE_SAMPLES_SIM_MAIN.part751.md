---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 751
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 751 of 933)

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

---[FILE: delete_product.ts]---
Location: sim-main/apps/sim/tools/shopify/delete_product.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ShopifyDeleteProductParams, ShopifyDeleteResponse } from './types'

export const shopifyDeleteProductTool: ToolConfig<
  ShopifyDeleteProductParams,
  ShopifyDeleteResponse
> = {
  id: 'shopify_delete_product',
  name: 'Shopify Delete Product',
  description: 'Delete a product from your Shopify store',
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
    productId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Product ID to delete (gid://shopify/Product/123456789)',
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
      if (!params.productId) {
        throw new Error('Product ID is required to delete a product')
      }

      return {
        query: `
          mutation productDelete($input: ProductDeleteInput!) {
            productDelete(input: $input) {
              deletedProductId
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          input: {
            id: params.productId,
          },
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to delete product',
        output: {},
      }
    }

    const result = data.data?.productDelete
    if (result?.userErrors?.length > 0) {
      return {
        success: false,
        error: result.userErrors.map((e: { message: string }) => e.message).join(', '),
        output: {},
      }
    }

    if (!result?.deletedProductId) {
      return {
        success: false,
        error: 'Product deletion was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        deletedId: result.deletedProductId,
      },
    }
  },

  outputs: {
    deletedId: {
      type: 'string',
      description: 'The ID of the deleted product',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_collection.ts]---
Location: sim-main/apps/sim/tools/shopify/get_collection.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'
import type { ShopifyBaseParams } from './types'

interface ShopifyGetCollectionParams extends ShopifyBaseParams {
  collectionId: string
  productsFirst?: number
}

interface ShopifyGetCollectionResponse extends ToolResponse {
  output: {
    collection?: {
      id: string
      title: string
      handle: string
      description: string | null
      descriptionHtml: string | null
      productsCount: number
      sortOrder: string
      updatedAt: string
      image: {
        url: string
        altText: string | null
      } | null
      products: Array<{
        id: string
        title: string
        handle: string
        status: string
        vendor: string
        productType: string
        totalInventory: number
        featuredImage: {
          url: string
          altText: string | null
        } | null
      }>
    }
  }
}

export const shopifyGetCollectionTool: ToolConfig<
  ShopifyGetCollectionParams,
  ShopifyGetCollectionResponse
> = {
  id: 'shopify_get_collection',
  name: 'Shopify Get Collection',
  description:
    'Get a specific collection by ID, including its products. Use this to retrieve products within a collection.',
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
    collectionId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The collection ID (e.g., gid://shopify/Collection/123456789)',
    },
    productsFirst: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of products to return from this collection (default: 50, max: 250)',
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
      const productsFirst = Math.min(params.productsFirst || 50, 250)

      return {
        query: `
          query getCollection($id: ID!, $productsFirst: Int!) {
            collection(id: $id) {
              id
              title
              handle
              description
              descriptionHtml
              productsCount {
                count
              }
              sortOrder
              updatedAt
              image {
                url
                altText
              }
              products(first: $productsFirst) {
                edges {
                  node {
                    id
                    title
                    handle
                    status
                    vendor
                    productType
                    totalInventory
                    featuredMedia {
                      preview {
                        image {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          id: params.collectionId,
          productsFirst,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to get collection',
        output: {},
      }
    }

    const collection = data.data?.collection
    if (!collection) {
      return {
        success: false,
        error: 'Collection not found',
        output: {},
      }
    }

    // Transform products from edges format and map featuredMedia to featuredImage
    const products =
      collection.products?.edges?.map(
        (edge: {
          node: {
            id: string
            title: string
            handle: string
            status: string
            vendor: string
            productType: string
            totalInventory: number
            featuredMedia?: {
              preview?: {
                image?: {
                  url: string
                  altText: string | null
                }
              }
            }
          }
        }) => {
          const product = edge.node
          return {
            id: product.id,
            title: product.title,
            handle: product.handle,
            status: product.status,
            vendor: product.vendor,
            productType: product.productType,
            totalInventory: product.totalInventory,
            featuredImage: product.featuredMedia?.preview?.image || null,
          }
        }
      ) || []

    return {
      success: true,
      output: {
        collection: {
          id: collection.id,
          title: collection.title,
          handle: collection.handle,
          description: collection.description,
          descriptionHtml: collection.descriptionHtml,
          productsCount: collection.productsCount?.count ?? 0,
          sortOrder: collection.sortOrder,
          updatedAt: collection.updatedAt,
          image: collection.image,
          products,
        },
      },
    }
  },

  outputs: {
    collection: {
      type: 'object',
      description: 'The collection details including its products',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_customer.ts]---
Location: sim-main/apps/sim/tools/shopify/get_customer.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ShopifyCustomerResponse, ShopifyGetCustomerParams } from './types'

export const shopifyGetCustomerTool: ToolConfig<ShopifyGetCustomerParams, ShopifyCustomerResponse> =
  {
    id: 'shopify_get_customer',
    name: 'Shopify Get Customer',
    description: 'Get a single customer by ID from your Shopify store',
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
        description: 'Customer ID (gid://shopify/Customer/123456789)',
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
          throw new Error('Customer ID is required')
        }

        return {
          query: `
          query getCustomer($id: ID!) {
            customer(id: $id) {
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
                firstName
                lastName
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
              defaultAddress {
                firstName
                lastName
                address1
                address2
                city
                province
                country
                zip
              }
            }
          }
        `,
          variables: {
            id: params.customerId,
          },
        }
      },
    },

    transformResponse: async (response) => {
      const data = await response.json()

      if (data.errors) {
        return {
          success: false,
          error: data.errors[0]?.message || 'Failed to get customer',
          output: {},
        }
      }

      const customer = data.data?.customer
      if (!customer) {
        return {
          success: false,
          error: 'Customer not found',
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
        description: 'The customer details',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: get_inventory_level.ts]---
Location: sim-main/apps/sim/tools/shopify/get_inventory_level.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ShopifyGetInventoryLevelParams, ShopifyInventoryResponse } from './types'

export const shopifyGetInventoryLevelTool: ToolConfig<
  ShopifyGetInventoryLevelParams,
  ShopifyInventoryResponse
> = {
  id: 'shopify_get_inventory_level',
  name: 'Shopify Get Inventory Level',
  description: 'Get inventory level for a product variant at a specific location',
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
    inventoryItemId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Inventory item ID (gid://shopify/InventoryItem/123456789)',
    },
    locationId: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Location ID to filter by (optional)',
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
      if (!params.inventoryItemId) {
        throw new Error('Inventory item ID is required')
      }

      return {
        query: `
          query getInventoryItem($id: ID!) {
            inventoryItem(id: $id) {
              id
              sku
              tracked
              inventoryLevels(first: 50) {
                edges {
                  node {
                    id
                    quantities(names: ["available", "on_hand", "committed", "incoming", "reserved"]) {
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
        `,
        variables: {
          id: params.inventoryItemId,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to get inventory level',
        output: {},
      }
    }

    const inventoryItem = data.data?.inventoryItem
    if (!inventoryItem) {
      return {
        success: false,
        error: 'Inventory item not found',
        output: {},
      }
    }

    const inventoryLevels = inventoryItem.inventoryLevels.edges.map(
      (edge: {
        node: {
          id: string
          quantities: Array<{ name: string; quantity: number }>
          location: { id: string; name: string }
        }
      }) => {
        const node = edge.node
        // Extract quantities into a more usable format
        const quantitiesMap: Record<string, number> = {}
        node.quantities.forEach((q) => {
          quantitiesMap[q.name] = q.quantity
        })
        return {
          id: node.id,
          available: quantitiesMap.available ?? 0,
          onHand: quantitiesMap.on_hand ?? 0,
          committed: quantitiesMap.committed ?? 0,
          incoming: quantitiesMap.incoming ?? 0,
          reserved: quantitiesMap.reserved ?? 0,
          location: node.location,
        }
      }
    )

    return {
      success: true,
      output: {
        inventoryLevel: {
          id: inventoryItem.id,
          sku: inventoryItem.sku,
          tracked: inventoryItem.tracked,
          levels: inventoryLevels,
        },
      },
    }
  },

  outputs: {
    inventoryLevel: {
      type: 'object',
      description: 'The inventory level details',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_order.ts]---
Location: sim-main/apps/sim/tools/shopify/get_order.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ShopifyGetOrderParams, ShopifyOrderResponse } from './types'

export const shopifyGetOrderTool: ToolConfig<ShopifyGetOrderParams, ShopifyOrderResponse> = {
  id: 'shopify_get_order',
  name: 'Shopify Get Order',
  description: 'Get a single order by ID from your Shopify store',
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
      description: 'Order ID (gid://shopify/Order/123456789)',
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
        throw new Error('Order ID is required')
      }

      return {
        query: `
          query getOrder($id: ID!) {
            order(id: $id) {
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
              totalTaxSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              totalShippingPriceSet {
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
                phone
              }
              lineItems(first: 50) {
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
                    originalTotalSet {
                      shopMoney {
                        amount
                        currencyCode
                      }
                    }
                    discountedTotalSet {
                      shopMoney {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
              shippingAddress {
                firstName
                lastName
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
              billingAddress {
                firstName
                lastName
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
              fulfillments {
                id
                status
                createdAt
                updatedAt
                trackingInfo {
                  company
                  number
                  url
                }
              }
            }
          }
        `,
        variables: {
          id: params.orderId,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to get order',
        output: {},
      }
    }

    const order = data.data?.order
    if (!order) {
      return {
        success: false,
        error: 'Order not found',
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
      description: 'The order details',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_product.ts]---
Location: sim-main/apps/sim/tools/shopify/get_product.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ShopifyGetProductParams, ShopifyProductResponse } from './types'

export const shopifyGetProductTool: ToolConfig<ShopifyGetProductParams, ShopifyProductResponse> = {
  id: 'shopify_get_product',
  name: 'Shopify Get Product',
  description: 'Get a single product by ID from your Shopify store',
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
    productId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Product ID (gid://shopify/Product/123456789)',
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
      if (!params.productId) {
        throw new Error('Product ID is required')
      }

      return {
        query: `
          query getProduct($id: ID!) {
            product(id: $id) {
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
              variants(first: 50) {
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
              images(first: 20) {
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
        `,
        variables: {
          id: params.productId,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to get product',
        output: {},
      }
    }

    const product = data.data?.product
    if (!product) {
      return {
        success: false,
        error: 'Product not found',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        product,
      },
    }
  },

  outputs: {
    product: {
      type: 'object',
      description: 'The product details',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/shopify/index.ts

```typescript
// Product Tools

export { shopifyAdjustInventoryTool } from './adjust_inventory'
export { shopifyCancelOrderTool } from './cancel_order'
// Customer Tools
export { shopifyCreateCustomerTool } from './create_customer'
// Fulfillment Tools
export { shopifyCreateFulfillmentTool } from './create_fulfillment'
export { shopifyCreateProductTool } from './create_product'
export { shopifyDeleteCustomerTool } from './delete_customer'
export { shopifyDeleteProductTool } from './delete_product'
export { shopifyGetCollectionTool } from './get_collection'
export { shopifyGetCustomerTool } from './get_customer'
export { shopifyGetInventoryLevelTool } from './get_inventory_level'
// Order Tools
export { shopifyGetOrderTool } from './get_order'
export { shopifyGetProductTool } from './get_product'
// Collection Tools
export { shopifyListCollectionsTool } from './list_collections'
export { shopifyListCustomersTool } from './list_customers'
// Inventory Tools
export { shopifyListInventoryItemsTool } from './list_inventory_items'
// Location Tools
export { shopifyListLocationsTool } from './list_locations'
export { shopifyListOrdersTool } from './list_orders'
export { shopifyListProductsTool } from './list_products'
export { shopifyUpdateCustomerTool } from './update_customer'
export { shopifyUpdateOrderTool } from './update_order'
export { shopifyUpdateProductTool } from './update_product'
```

--------------------------------------------------------------------------------

---[FILE: list_collections.ts]---
Location: sim-main/apps/sim/tools/shopify/list_collections.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'
import type { ShopifyBaseParams } from './types'

interface ShopifyListCollectionsParams extends ShopifyBaseParams {
  first?: number
  query?: string
}

interface ShopifyCollectionsResponse extends ToolResponse {
  output: {
    collections?: Array<{
      id: string
      title: string
      handle: string
      description: string | null
      descriptionHtml: string | null
      productsCount: number
      sortOrder: string
      updatedAt: string
      image: {
        url: string
        altText: string | null
      } | null
    }>
    pageInfo?: {
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
  }
}

export const shopifyListCollectionsTool: ToolConfig<
  ShopifyListCollectionsParams,
  ShopifyCollectionsResponse
> = {
  id: 'shopify_list_collections',
  name: 'Shopify List Collections',
  description:
    'List product collections from your Shopify store. Filter by title, type (custom/smart), or handle.',
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
      description: 'Number of collections to return (default: 50, max: 250)',
    },
    query: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Search query to filter collections (e.g., "title:Summer" or "collection_type:smart")',
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
          query listCollections($first: Int!, $query: String) {
            collections(first: $first, query: $query) {
              edges {
                node {
                  id
                  title
                  handle
                  description
                  descriptionHtml
                  productsCount {
                    count
                  }
                  sortOrder
                  updatedAt
                  image {
                    url
                    altText
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
        error: data.errors[0]?.message || 'Failed to list collections',
        output: {},
      }
    }

    const collectionsData = data.data?.collections
    if (!collectionsData) {
      return {
        success: false,
        error: 'Failed to retrieve collections',
        output: {},
      }
    }

    const collections = collectionsData.edges.map(
      (edge: {
        node: {
          id: string
          title: string
          handle: string
          description: string | null
          descriptionHtml: string | null
          productsCount: { count: number }
          sortOrder: string
          updatedAt: string
          image: { url: string; altText: string | null } | null
        }
      }) => ({
        id: edge.node.id,
        title: edge.node.title,
        handle: edge.node.handle,
        description: edge.node.description,
        descriptionHtml: edge.node.descriptionHtml,
        productsCount: edge.node.productsCount?.count ?? 0,
        sortOrder: edge.node.sortOrder,
        updatedAt: edge.node.updatedAt,
        image: edge.node.image,
      })
    )

    return {
      success: true,
      output: {
        collections,
        pageInfo: collectionsData.pageInfo,
      },
    }
  },

  outputs: {
    collections: {
      type: 'array',
      description: 'List of collections with their IDs, titles, and product counts',
    },
    pageInfo: {
      type: 'object',
      description: 'Pagination information',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_customers.ts]---
Location: sim-main/apps/sim/tools/shopify/list_customers.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ShopifyCustomersResponse, ShopifyListCustomersParams } from './types'

export const shopifyListCustomersTool: ToolConfig<
  ShopifyListCustomersParams,
  ShopifyCustomersResponse
> = {
  id: 'shopify_list_customers',
  name: 'Shopify List Customers',
  description: 'List customers from your Shopify store with optional filtering',
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
      description: 'Number of customers to return (default: 50, max: 250)',
    },
    query: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Search query to filter customers (e.g., "first_name:John" or "last_name:Smith" or "email:*@gmail.com" or "tag:vip")',
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
          query listCustomers($first: Int!, $query: String) {
            customers(first: $first, query: $query) {
              edges {
                node {
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
                  defaultAddress {
                    address1
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
        error: data.errors[0]?.message || 'Failed to list customers',
        output: {},
      }
    }

    const customersData = data.data?.customers
    if (!customersData) {
      return {
        success: false,
        error: 'Failed to retrieve customers',
        output: {},
      }
    }

    const customers = customersData.edges.map((edge: { node: unknown }) => edge.node)

    return {
      success: true,
      output: {
        customers,
        pageInfo: customersData.pageInfo,
      },
    }
  },

  outputs: {
    customers: {
      type: 'array',
      description: 'List of customers',
    },
    pageInfo: {
      type: 'object',
      description: 'Pagination information',
    },
  },
}
```

--------------------------------------------------------------------------------

````
