---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 750
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 750 of 933)

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

---[FILE: update_list.ts]---
Location: sim-main/apps/sim/tools/sharepoint/update_list.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  SharepointToolParams,
  SharepointUpdateListItemResponse,
} from '@/tools/sharepoint/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('SharePointUpdateListItem')

export const updateListItemTool: ToolConfig<
  SharepointToolParams,
  SharepointUpdateListItemResponse
> = {
  id: 'sharepoint_update_list',
  name: 'Update SharePoint List Item',
  description: 'Update the properties (fields) on a SharePoint list item',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'sharepoint',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the SharePoint API',
    },
    siteSelector: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Select the SharePoint site',
    },
    siteId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The ID of the SharePoint site (internal use)',
    },
    listId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The ID of the list containing the item',
    },
    itemId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the list item to update',
    },
    listItemFields: {
      type: 'object',
      required: true,
      visibility: 'user-only',
      description: 'Field values to update on the list item',
    },
  },

  request: {
    url: (params) => {
      const siteId = params.siteId || params.siteSelector || 'root'
      if (!params.itemId) throw new Error('itemId is required')
      if (!params.listId) {
        throw new Error('listId must be provided')
      }
      const listSegment = params.listId
      return `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listSegment}/items/${params.itemId}/fields`
    },
    method: 'PATCH',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
    body: (params) => {
      if (!params.listItemFields || Object.keys(params.listItemFields).length === 0) {
        throw new Error('listItemFields must not be empty')
      }

      // Filter out system/read-only fields that cannot be updated via Graph
      const readOnlyFields = new Set<string>([
        'Id',
        'id',
        'UniqueId',
        'GUID',
        'ContentTypeId',
        'Created',
        'Modified',
        'Author',
        'Editor',
        'CreatedBy',
        'ModifiedBy',
        'AuthorId',
        'EditorId',
        '_UIVersionString',
        'Attachments',
        'FileRef',
        'FileDirRef',
        'FileLeafRef',
      ])

      const entries = Object.entries(params.listItemFields)
      const updatableEntries = entries.filter(([key]) => !readOnlyFields.has(key))

      if (updatableEntries.length !== entries.length) {
        const removed = entries.filter(([key]) => readOnlyFields.has(key)).map(([key]) => key)
        logger.warn('Removed read-only SharePoint fields from update', {
          removed,
        })
      }

      if (updatableEntries.length === 0) {
        const requestedKeys = Object.keys(params.listItemFields)
        throw new Error(
          `All provided fields are read-only and cannot be updated: ${requestedKeys.join(', ')}`
        )
      }

      const sanitizedFields = Object.fromEntries(updatableEntries)

      logger.info('Updating SharePoint list item fields', {
        listItemId: params.itemId,
        listId: params.listId,
        fieldsKeys: Object.keys(sanitizedFields),
      })
      return sanitizedFields
    },
  },

  transformResponse: async (response: Response, params) => {
    let fields: Record<string, unknown> | undefined
    if (response.status !== 204) {
      try {
        fields = await response.json()
      } catch {
        // Fall back to submitted fields if no body is returned
        fields = params?.listItemFields
      }
    } else {
      fields = params?.listItemFields
    }

    return {
      success: true,
      output: {
        item: {
          id: params?.itemId!,
          fields,
        },
      },
    }
  },

  outputs: {
    item: {
      type: 'object',
      description: 'Updated SharePoint list item',
      properties: {
        id: { type: 'string', description: 'Item ID' },
        fields: { type: 'object', description: 'Updated field values' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: upload_file.ts]---
Location: sim-main/apps/sim/tools/sharepoint/upload_file.ts

```typescript
import type { SharepointToolParams, SharepointUploadFileResponse } from '@/tools/sharepoint/types'
import type { ToolConfig } from '@/tools/types'

export const uploadFileTool: ToolConfig<SharepointToolParams, SharepointUploadFileResponse> = {
  id: 'sharepoint_upload_file',
  name: 'Upload File to SharePoint',
  description: 'Upload files to a SharePoint document library',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'sharepoint',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the SharePoint API',
    },
    siteId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The ID of the SharePoint site',
    },
    driveId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The ID of the document library (drive). If not provided, uses default drive.',
    },
    folderPath: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Optional folder path within the document library (e.g., /Documents/Subfolder)',
    },
    fileName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Optional: override the uploaded file name',
    },
    files: {
      type: 'file[]',
      required: false,
      visibility: 'user-only',
      description: 'Files to upload to SharePoint',
    },
  },

  request: {
    url: '/api/tools/sharepoint/upload',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params: SharepointToolParams) => {
      return {
        accessToken: params.accessToken,
        siteId: params.siteId || 'root',
        driveId: params.driveId || null,
        folderPath: params.folderPath || null,
        fileName: params.fileName || null,
        files: params.files || null,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    if (!data.success) {
      throw new Error(data.error || 'Failed to upload files to SharePoint')
    }
    return {
      success: true,
      output: {
        uploadedFiles: data.output.uploadedFiles,
        fileCount: data.output.fileCount,
      },
    }
  },

  outputs: {
    uploadedFiles: {
      type: 'array',
      description: 'Array of uploaded file objects',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'The unique ID of the uploaded file' },
          name: { type: 'string', description: 'The name of the uploaded file' },
          webUrl: { type: 'string', description: 'The URL to access the file' },
          size: { type: 'number', description: 'The size of the file in bytes' },
          createdDateTime: { type: 'string', description: 'When the file was created' },
          lastModifiedDateTime: { type: 'string', description: 'When the file was last modified' },
        },
      },
    },
    fileCount: {
      type: 'number',
      description: 'Number of files uploaded',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/tools/sharepoint/utils.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { CanvasLayout } from '@/tools/sharepoint/types'

const logger = createLogger('SharepointUtils')

function stripHtmlTags(html: string): string {
  let text = html
  let previous: string

  do {
    previous = text
    text = text.replace(/<[^>]*>/g, '')
    text = text.replace(/[<>]/g, '')
  } while (text !== previous)

  return text.trim()
}

export function extractTextFromCanvasLayout(canvasLayout: CanvasLayout | null | undefined): string {
  logger.info('Extracting text from canvas layout', {
    hasCanvasLayout: !!canvasLayout,
    hasHorizontalSections: !!canvasLayout?.horizontalSections,
    sectionsCount: canvasLayout?.horizontalSections?.length || 0,
  })

  if (!canvasLayout?.horizontalSections) {
    logger.info('No canvas layout or horizontal sections found')
    return ''
  }

  const textParts: string[] = []

  for (const section of canvasLayout.horizontalSections) {
    logger.info('Processing section', {
      sectionId: section.id,
      hasColumns: !!section.columns,
      hasWebparts: !!section.webparts,
      columnsCount: section.columns?.length || 0,
    })

    if (section.columns) {
      for (const column of section.columns) {
        if (column.webparts) {
          for (const webpart of column.webparts) {
            logger.info('Processing webpart', {
              webpartId: webpart.id,
              hasInnerHtml: !!webpart.innerHtml,
              innerHtml: webpart.innerHtml,
            })

            if (webpart.innerHtml) {
              const text = stripHtmlTags(webpart.innerHtml)
              if (text) {
                textParts.push(text)
                logger.info('Extracted text', { text })
              }
            }
          }
        }
      }
    } else if (section.webparts) {
      for (const webpart of section.webparts) {
        if (webpart.innerHtml) {
          const text = stripHtmlTags(webpart.innerHtml)
          if (text) textParts.push(text)
        }
      }
    }
  }

  const finalContent = textParts.join('\n\n')
  logger.info('Final extracted content', {
    textPartsCount: textParts.length,
    finalContentLength: finalContent.length,
    finalContent,
  })

  return finalContent
}

export function cleanODataMetadata<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj

  if (Array.isArray(obj)) {
    return obj.map((item) => cleanODataMetadata(item)) as T
  }

  const cleaned: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (key.includes('@odata')) continue

    cleaned[key] = cleanODataMetadata(value)
  }

  return cleaned as T
}
```

--------------------------------------------------------------------------------

---[FILE: adjust_inventory.ts]---
Location: sim-main/apps/sim/tools/shopify/adjust_inventory.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ShopifyAdjustInventoryParams, ShopifyInventoryResponse } from './types'

export const shopifyAdjustInventoryTool: ToolConfig<
  ShopifyAdjustInventoryParams,
  ShopifyInventoryResponse
> = {
  id: 'shopify_adjust_inventory',
  name: 'Shopify Adjust Inventory',
  description: 'Adjust inventory quantity for a product variant at a specific location',
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
      required: true,
      visibility: 'user-or-llm',
      description: 'Location ID (gid://shopify/Location/123456789)',
    },
    delta: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'Amount to adjust (positive to increase, negative to decrease)',
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
      if (!params.locationId) {
        throw new Error('Location ID is required')
      }
      if (params.delta === undefined || params.delta === null) {
        throw new Error('Delta is required')
      }

      return {
        query: `
          mutation inventoryAdjustQuantities($input: InventoryAdjustQuantitiesInput!) {
            inventoryAdjustQuantities(input: $input) {
              inventoryAdjustmentGroup {
                createdAt
                reason
                changes {
                  name
                  delta
                  quantityAfterChange
                  item {
                    id
                    sku
                  }
                  location {
                    id
                    name
                  }
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
          input: {
            reason: 'correction',
            name: 'available',
            changes: [
              {
                inventoryItemId: params.inventoryItemId,
                locationId: params.locationId,
                delta: params.delta,
              },
            ],
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
        error: data.errors[0]?.message || 'Failed to adjust inventory',
        output: {},
      }
    }

    const result = data.data?.inventoryAdjustQuantities
    if (result?.userErrors?.length > 0) {
      return {
        success: false,
        error: result.userErrors.map((e: { message: string }) => e.message).join(', '),
        output: {},
      }
    }

    const adjustmentGroup = result?.inventoryAdjustmentGroup
    if (!adjustmentGroup) {
      return {
        success: false,
        error: 'Inventory adjustment was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        inventoryLevel: {
          adjustmentGroup,
          changes: adjustmentGroup.changes,
        },
      },
    }
  },

  outputs: {
    inventoryLevel: {
      type: 'object',
      description: 'The inventory adjustment result',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: cancel_order.ts]---
Location: sim-main/apps/sim/tools/shopify/cancel_order.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ShopifyCancelOrderParams, ShopifyOrderResponse } from './types'

export const shopifyCancelOrderTool: ToolConfig<ShopifyCancelOrderParams, ShopifyOrderResponse> = {
  id: 'shopify_cancel_order',
  name: 'Shopify Cancel Order',
  description: 'Cancel an order in your Shopify store',
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
      description: 'Order ID to cancel (gid://shopify/Order/123456789)',
    },
    reason: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Cancellation reason (CUSTOMER, DECLINED, FRAUD, INVENTORY, STAFF, OTHER)',
    },
    notifyCustomer: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether to notify the customer about the cancellation',
    },
    refund: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether to refund the order',
    },
    restock: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether to restock the inventory',
    },
    staffNote: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'A note about the cancellation for staff reference',
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
        throw new Error('Order ID is required to cancel an order')
      }
      if (!params.reason) {
        throw new Error('Cancellation reason is required')
      }

      return {
        query: `
          mutation orderCancel($orderId: ID!, $reason: OrderCancelReason!, $notifyCustomer: Boolean, $refund: Boolean!, $restock: Boolean!, $staffNote: String) {
            orderCancel(orderId: $orderId, reason: $reason, notifyCustomer: $notifyCustomer, refund: $refund, restock: $restock, staffNote: $staffNote) {
              job {
                id
                done
              }
              orderCancelUserErrors {
                field
                message
                code
              }
            }
          }
        `,
        variables: {
          orderId: params.orderId,
          reason: params.reason,
          notifyCustomer: params.notifyCustomer ?? false,
          refund: params.refund ?? false,
          restock: params.restock ?? false,
          staffNote: params.staffNote || null,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to cancel order',
        output: {},
      }
    }

    const result = data.data?.orderCancel
    if (result?.orderCancelUserErrors?.length > 0) {
      return {
        success: false,
        error: result.orderCancelUserErrors.map((e: { message: string }) => e.message).join(', '),
        output: {},
      }
    }

    return {
      success: true,
      output: {
        order: {
          id: result?.job?.id,
          cancelled: result?.job?.done ?? true,
          message: 'Order cancellation initiated',
        },
      },
    }
  },

  outputs: {
    order: {
      type: 'object',
      description: 'The cancellation result',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_customer.ts]---
Location: sim-main/apps/sim/tools/shopify/create_customer.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ShopifyCreateCustomerParams, ShopifyCustomerResponse } from './types'

export const shopifyCreateCustomerTool: ToolConfig<
  ShopifyCreateCustomerParams,
  ShopifyCustomerResponse
> = {
  id: 'shopify_create_customer',
  name: 'Shopify Create Customer',
  description: 'Create a new customer in your Shopify store',
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
    email: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Customer email address',
    },
    firstName: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Customer first name',
    },
    lastName: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Customer last name',
    },
    phone: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Customer phone number',
    },
    note: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Note about the customer',
    },
    tags: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'Customer tags',
    },
    addresses: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'Customer addresses',
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
      // Shopify requires at least one of: email, phone, firstName, or lastName
      const hasEmail = params.email?.trim()
      const hasPhone = params.phone?.trim()
      const hasFirstName = params.firstName?.trim()
      const hasLastName = params.lastName?.trim()

      if (!hasEmail && !hasPhone && !hasFirstName && !hasLastName) {
        throw new Error('Customer must have at least one of: email, phone, firstName, or lastName')
      }

      const input: Record<string, unknown> = {}

      if (hasEmail) {
        input.email = params.email
      }
      if (hasFirstName) {
        input.firstName = params.firstName
      }
      if (hasLastName) {
        input.lastName = params.lastName
      }
      if (hasPhone) {
        input.phone = params.phone
      }
      if (params.note) {
        input.note = params.note
      }
      if (params.tags && Array.isArray(params.tags)) {
        input.tags = params.tags
      }
      if (params.addresses && Array.isArray(params.addresses)) {
        input.addresses = params.addresses
      }

      return {
        query: `
          mutation customerCreate($input: CustomerInput!) {
            customerCreate(input: $input) {
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
                  address2
                  city
                  province
                  country
                  zip
                  phone
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
        error: data.errors[0]?.message || 'Failed to create customer',
        output: {},
      }
    }

    const result = data.data?.customerCreate
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
        error: 'Customer creation was not successful',
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
      description: 'The created customer',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_fulfillment.ts]---
Location: sim-main/apps/sim/tools/shopify/create_fulfillment.ts

```typescript
import type { ToolConfig, ToolResponse } from '@/tools/types'
import type { ShopifyBaseParams } from './types'

interface ShopifyCreateFulfillmentParams extends ShopifyBaseParams {
  fulfillmentOrderId: string
  trackingNumber?: string
  trackingCompany?: string
  trackingUrl?: string
  notifyCustomer?: boolean
}

interface ShopifyCreateFulfillmentResponse extends ToolResponse {
  output: {
    fulfillment?: {
      id: string
      status: string
      createdAt: string
      updatedAt: string
      trackingInfo: Array<{
        company: string | null
        number: string | null
        url: string | null
      }>
      fulfillmentLineItems: Array<{
        id: string
        quantity: number
        lineItem: {
          title: string
        }
      }>
    }
  }
}

export const shopifyCreateFulfillmentTool: ToolConfig<
  ShopifyCreateFulfillmentParams,
  ShopifyCreateFulfillmentResponse
> = {
  id: 'shopify_create_fulfillment',
  name: 'Shopify Create Fulfillment',
  description:
    'Create a fulfillment to mark order items as shipped. Requires a fulfillment order ID (get this from the order details).',
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
    fulfillmentOrderId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The fulfillment order ID (e.g., gid://shopify/FulfillmentOrder/123456789)',
    },
    trackingNumber: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Tracking number for the shipment',
    },
    trackingCompany: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Shipping carrier name (e.g., UPS, FedEx, USPS, DHL)',
    },
    trackingUrl: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'URL to track the shipment',
    },
    notifyCustomer: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether to send a shipping confirmation email to the customer (default: true)',
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
      // Build tracking info if any tracking details provided
      const trackingInfo: {
        number?: string
        company?: string
        url?: string
      } = {}

      if (params.trackingNumber) {
        trackingInfo.number = params.trackingNumber
      }
      if (params.trackingCompany) {
        trackingInfo.company = params.trackingCompany
      }
      if (params.trackingUrl) {
        trackingInfo.url = params.trackingUrl
      }

      const fulfillmentInput: {
        lineItemsByFulfillmentOrder: Array<{ fulfillmentOrderId: string }>
        notifyCustomer?: boolean
        trackingInfo?: typeof trackingInfo
      } = {
        lineItemsByFulfillmentOrder: [
          {
            fulfillmentOrderId: params.fulfillmentOrderId,
          },
        ],
        notifyCustomer: params.notifyCustomer !== false, // Default to true
      }

      // Only include trackingInfo if we have at least one tracking field
      if (Object.keys(trackingInfo).length > 0) {
        fulfillmentInput.trackingInfo = trackingInfo
      }

      return {
        query: `
          mutation fulfillmentCreateV2($fulfillment: FulfillmentV2Input!) {
            fulfillmentCreateV2(fulfillment: $fulfillment) {
              fulfillment {
                id
                status
                createdAt
                updatedAt
                trackingInfo {
                  company
                  number
                  url
                }
                fulfillmentLineItems(first: 50) {
                  edges {
                    node {
                      id
                      quantity
                      lineItem {
                        title
                      }
                    }
                  }
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
          fulfillment: fulfillmentInput,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to create fulfillment',
        output: {},
      }
    }

    const result = data.data?.fulfillmentCreateV2
    if (!result) {
      return {
        success: false,
        error: 'Failed to create fulfillment',
        output: {},
      }
    }

    if (result.userErrors && result.userErrors.length > 0) {
      return {
        success: false,
        error: result.userErrors.map((e: { message: string }) => e.message).join(', '),
        output: {},
      }
    }

    const fulfillment = result.fulfillment
    if (!fulfillment) {
      return {
        success: false,
        error: 'No fulfillment returned',
        output: {},
      }
    }

    // Transform fulfillment line items from edges format
    const fulfillmentLineItems =
      fulfillment.fulfillmentLineItems?.edges?.map((edge: { node: unknown }) => edge.node) || []

    return {
      success: true,
      output: {
        fulfillment: {
          id: fulfillment.id,
          status: fulfillment.status,
          createdAt: fulfillment.createdAt,
          updatedAt: fulfillment.updatedAt,
          trackingInfo: fulfillment.trackingInfo || [],
          fulfillmentLineItems,
        },
      },
    }
  },

  outputs: {
    fulfillment: {
      type: 'object',
      description: 'The created fulfillment with tracking info and fulfilled items',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_product.ts]---
Location: sim-main/apps/sim/tools/shopify/create_product.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ShopifyCreateProductParams, ShopifyProductResponse } from './types'

export const shopifyCreateProductTool: ToolConfig<
  ShopifyCreateProductParams,
  ShopifyProductResponse
> = {
  id: 'shopify_create_product',
  name: 'Shopify Create Product',
  description: 'Create a new product in your Shopify store',
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
    title: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Product title',
    },
    descriptionHtml: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Product description (HTML)',
    },
    vendor: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Product vendor/brand',
    },
    productType: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Product type/category',
    },
    tags: {
      type: 'array',
      required: false,
      visibility: 'user-or-llm',
      description: 'Product tags',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Product status (ACTIVE, DRAFT, ARCHIVED)',
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
      if (!params.title || !params.title.trim()) {
        throw new Error('Title is required to create a Shopify product')
      }

      const input: Record<string, unknown> = {
        title: params.title,
      }

      if (params.descriptionHtml) {
        input.descriptionHtml = params.descriptionHtml
      }
      if (params.vendor) {
        input.vendor = params.vendor
      }
      if (params.productType) {
        input.productType = params.productType
      }
      if (params.tags && Array.isArray(params.tags)) {
        input.tags = params.tags
      }
      if (params.status) {
        input.status = params.status
      }

      return {
        query: `
          mutation productCreate($input: ProductInput!) {
            productCreate(input: $input) {
              product {
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
                images(first: 10) {
                  edges {
                    node {
                      id
                      url
                      altText
                    }
                  }
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
        error: data.errors[0]?.message || 'Failed to create product',
        output: {},
      }
    }

    const result = data.data?.productCreate
    if (result?.userErrors?.length > 0) {
      return {
        success: false,
        error: result.userErrors.map((e: { message: string }) => e.message).join(', '),
        output: {},
      }
    }

    const product = result?.product
    if (!product) {
      return {
        success: false,
        error: 'Product creation was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        product: {
          id: product.id,
          title: product.title,
          handle: product.handle,
          descriptionHtml: product.descriptionHtml,
          vendor: product.vendor,
          productType: product.productType,
          tags: product.tags,
          status: product.status,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          variants: product.variants,
          images: product.images,
        },
      },
    }
  },

  outputs: {
    product: {
      type: 'object',
      description: 'The created product',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_customer.ts]---
Location: sim-main/apps/sim/tools/shopify/delete_customer.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { ShopifyDeleteCustomerParams, ShopifyDeleteResponse } from './types'

export const shopifyDeleteCustomerTool: ToolConfig<
  ShopifyDeleteCustomerParams,
  ShopifyDeleteResponse
> = {
  id: 'shopify_delete_customer',
  name: 'Shopify Delete Customer',
  description: 'Delete a customer from your Shopify store',
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
      description: 'Customer ID to delete (gid://shopify/Customer/123456789)',
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
        throw new Error('Customer ID is required to delete a customer')
      }

      return {
        query: `
          mutation customerDelete($input: CustomerDeleteInput!) {
            customerDelete(input: $input) {
              deletedCustomerId
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          input: {
            id: params.customerId,
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
        error: data.errors[0]?.message || 'Failed to delete customer',
        output: {},
      }
    }

    const result = data.data?.customerDelete
    if (result?.userErrors?.length > 0) {
      return {
        success: false,
        error: result.userErrors.map((e: { message: string }) => e.message).join(', '),
        output: {},
      }
    }

    if (!result?.deletedCustomerId) {
      return {
        success: false,
        error: 'Customer deletion was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        deletedId: result.deletedCustomerId,
      },
    }
  },

  outputs: {
    deletedId: {
      type: 'string',
      description: 'The ID of the deleted customer',
    },
  },
}
```

--------------------------------------------------------------------------------

````
