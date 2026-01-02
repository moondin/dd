---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 762
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 762 of 933)

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

---[FILE: create_invoice.ts]---
Location: sim-main/apps/sim/tools/stripe/create_invoice.ts

```typescript
import type { CreateInvoiceParams, InvoiceResponse } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeCreateInvoiceTool: ToolConfig<CreateInvoiceParams, InvoiceResponse> = {
  id: 'stripe_create_invoice',
  name: 'Stripe Create Invoice',
  description: 'Create a new invoice',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    customer: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Customer ID (e.g., cus_1234567890)',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Description of the invoice',
    },
    metadata: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Set of key-value pairs',
    },
    auto_advance: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Auto-finalize the invoice',
    },
    collection_method: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Collection method: charge_automatically or send_invoice',
    },
  },

  request: {
    url: () => 'https://api.stripe.com/v1/invoices',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: (params) => {
      const formData = new URLSearchParams()
      formData.append('customer', params.customer)

      if (params.description) formData.append('description', params.description)
      if (params.auto_advance !== undefined) {
        formData.append('auto_advance', String(params.auto_advance))
      }
      if (params.collection_method) formData.append('collection_method', params.collection_method)

      if (params.metadata) {
        Object.entries(params.metadata).forEach(([key, value]) => {
          formData.append(`metadata[${key}]`, String(value))
        })
      }

      return { body: formData.toString() }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        invoice: data,
        metadata: {
          id: data.id,
          status: data.status,
          amount_due: data.amount_due,
          currency: data.currency,
        },
      },
    }
  },

  outputs: {
    invoice: {
      type: 'json',
      description: 'The created invoice object',
    },
    metadata: {
      type: 'json',
      description: 'Invoice metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_payment_intent.ts]---
Location: sim-main/apps/sim/tools/stripe/create_payment_intent.ts

```typescript
import type { CreatePaymentIntentParams, PaymentIntentResponse } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeCreatePaymentIntentTool: ToolConfig<
  CreatePaymentIntentParams,
  PaymentIntentResponse
> = {
  id: 'stripe_create_payment_intent',
  name: 'Stripe Create Payment Intent',
  description: 'Create a new Payment Intent to process a payment',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    amount: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'Amount in cents (e.g., 2000 for $20.00)',
    },
    currency: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Three-letter ISO currency code (e.g., usd, eur)',
    },
    customer: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Customer ID to associate with this payment',
    },
    payment_method: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Payment method ID',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Description of the payment',
    },
    receipt_email: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Email address to send receipt to',
    },
    metadata: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Set of key-value pairs for storing additional information',
    },
    automatic_payment_methods: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Enable automatic payment methods (e.g., {"enabled": true})',
    },
  },

  request: {
    url: () => 'https://api.stripe.com/v1/payment_intents',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: (params) => {
      const formData = new URLSearchParams()

      formData.append('amount', Number(params.amount).toString())
      formData.append('currency', params.currency)

      if (params.customer) formData.append('customer', params.customer)
      if (params.payment_method) formData.append('payment_method', params.payment_method)
      if (params.description) formData.append('description', params.description)
      if (params.receipt_email) formData.append('receipt_email', params.receipt_email)

      if (params.metadata) {
        Object.entries(params.metadata).forEach(([key, value]) => {
          formData.append(`metadata[${key}]`, String(value))
        })
      }

      if (params.automatic_payment_methods?.enabled) {
        formData.append('automatic_payment_methods[enabled]', 'true')
      }

      return { body: formData.toString() }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        payment_intent: data,
        metadata: {
          id: data.id,
          status: data.status,
          amount: data.amount,
          currency: data.currency,
        },
      },
    }
  },

  outputs: {
    payment_intent: {
      type: 'json',
      description: 'The created Payment Intent object',
    },
    metadata: {
      type: 'json',
      description: 'Payment Intent metadata including ID, status, amount, and currency',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_price.ts]---
Location: sim-main/apps/sim/tools/stripe/create_price.ts

```typescript
import type { CreatePriceParams, PriceResponse } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeCreatePriceTool: ToolConfig<CreatePriceParams, PriceResponse> = {
  id: 'stripe_create_price',
  name: 'Stripe Create Price',
  description: 'Create a new price for a product',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    product: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Product ID (e.g., prod_1234567890)',
    },
    currency: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Three-letter ISO currency code (e.g., usd, eur)',
    },
    unit_amount: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Amount in cents (e.g., 1000 for $10.00)',
    },
    recurring: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Recurring billing configuration (interval: day/week/month/year)',
    },
    metadata: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Set of key-value pairs',
    },
    billing_scheme: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Billing scheme (per_unit or tiered)',
    },
  },

  request: {
    url: () => 'https://api.stripe.com/v1/prices',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: (params) => {
      const formData = new URLSearchParams()

      formData.append('product', params.product)
      formData.append('currency', params.currency)

      if (params.unit_amount !== undefined)
        formData.append('unit_amount', Number(params.unit_amount).toString())
      if (params.billing_scheme) formData.append('billing_scheme', params.billing_scheme)

      if (params.recurring) {
        Object.entries(params.recurring).forEach(([key, value]) => {
          if (value) formData.append(`recurring[${key}]`, String(value))
        })
      }

      if (params.metadata) {
        Object.entries(params.metadata).forEach(([key, value]) => {
          formData.append(`metadata[${key}]`, String(value))
        })
      }

      return { body: formData.toString() }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        price: data,
        metadata: {
          id: data.id,
          product: data.product,
          unit_amount: data.unit_amount,
          currency: data.currency,
        },
      },
    }
  },

  outputs: {
    price: {
      type: 'json',
      description: 'The created price object',
    },
    metadata: {
      type: 'json',
      description: 'Price metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_product.ts]---
Location: sim-main/apps/sim/tools/stripe/create_product.ts

```typescript
import type { CreateProductParams, ProductResponse } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeCreateProductTool: ToolConfig<CreateProductParams, ProductResponse> = {
  id: 'stripe_create_product',
  name: 'Stripe Create Product',
  description: 'Create a new product object',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Product name',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Product description',
    },
    active: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether the product is active',
    },
    images: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Array of image URLs for the product',
    },
    metadata: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Set of key-value pairs',
    },
  },

  request: {
    url: () => 'https://api.stripe.com/v1/products',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: (params) => {
      const formData = new URLSearchParams()

      formData.append('name', params.name)
      if (params.description) formData.append('description', params.description)
      if (params.active !== undefined) formData.append('active', String(params.active))

      if (params.images) {
        params.images.forEach((image: string, index: number) => {
          formData.append(`images[${index}]`, image)
        })
      }

      if (params.metadata) {
        Object.entries(params.metadata).forEach(([key, value]) => {
          formData.append(`metadata[${key}]`, String(value))
        })
      }

      return { body: formData.toString() }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        product: data,
        metadata: {
          id: data.id,
          name: data.name,
          active: data.active,
        },
      },
    }
  },

  outputs: {
    product: {
      type: 'json',
      description: 'The created product object',
    },
    metadata: {
      type: 'json',
      description: 'Product metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_subscription.ts]---
Location: sim-main/apps/sim/tools/stripe/create_subscription.ts

```typescript
import type { CreateSubscriptionParams, SubscriptionResponse } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeCreateSubscriptionTool: ToolConfig<
  CreateSubscriptionParams,
  SubscriptionResponse
> = {
  id: 'stripe_create_subscription',
  name: 'Stripe Create Subscription',
  description: 'Create a new subscription for a customer',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    customer: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Customer ID to subscribe',
    },
    items: {
      type: 'json',
      required: true,
      visibility: 'user-or-llm',
      description: 'Array of items with price IDs (e.g., [{"price": "price_xxx", "quantity": 1}])',
    },
    trial_period_days: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of trial days',
    },
    default_payment_method: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Payment method ID',
    },
    cancel_at_period_end: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Cancel subscription at period end',
    },
    metadata: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Set of key-value pairs for storing additional information',
    },
  },

  request: {
    url: () => 'https://api.stripe.com/v1/subscriptions',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: (params) => {
      const formData = new URLSearchParams()

      formData.append('customer', params.customer)

      if (params.items && Array.isArray(params.items)) {
        params.items.forEach((item, index) => {
          formData.append(`items[${index}][price]`, item.price)
          if (item.quantity) {
            formData.append(`items[${index}][quantity]`, Number(item.quantity).toString())
          }
        })
      }

      if (params.trial_period_days !== undefined) {
        formData.append('trial_period_days', Number(params.trial_period_days).toString())
      }
      if (params.default_payment_method) {
        formData.append('default_payment_method', params.default_payment_method)
      }
      if (params.cancel_at_period_end !== undefined) {
        formData.append('cancel_at_period_end', String(params.cancel_at_period_end))
      }

      if (params.metadata) {
        Object.entries(params.metadata).forEach(([key, value]) => {
          formData.append(`metadata[${key}]`, String(value))
        })
      }

      return { body: formData.toString() }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        subscription: data,
        metadata: {
          id: data.id,
          status: data.status,
          customer: data.customer,
        },
      },
    }
  },

  outputs: {
    subscription: {
      type: 'json',
      description: 'The created subscription object',
    },
    metadata: {
      type: 'json',
      description: 'Subscription metadata including ID, status, and customer',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_customer.ts]---
Location: sim-main/apps/sim/tools/stripe/delete_customer.ts

```typescript
import type { CustomerDeleteResponse, DeleteCustomerParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeDeleteCustomerTool: ToolConfig<DeleteCustomerParams, CustomerDeleteResponse> = {
  id: 'stripe_delete_customer',
  name: 'Stripe Delete Customer',
  description: 'Permanently delete a customer',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Customer ID (e.g., cus_1234567890)',
    },
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/customers/${params.id}`,
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        deleted: data.deleted,
        id: data.id,
        metadata: {
          id: data.id,
          deleted: data.deleted,
        },
      },
    }
  },

  outputs: {
    deleted: {
      type: 'boolean',
      description: 'Whether the customer was deleted',
    },
    id: {
      type: 'string',
      description: 'The ID of the deleted customer',
    },
    metadata: {
      type: 'json',
      description: 'Deletion metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_invoice.ts]---
Location: sim-main/apps/sim/tools/stripe/delete_invoice.ts

```typescript
import type { DeleteInvoiceParams, InvoiceDeleteResponse } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeDeleteInvoiceTool: ToolConfig<DeleteInvoiceParams, InvoiceDeleteResponse> = {
  id: 'stripe_delete_invoice',
  name: 'Stripe Delete Invoice',
  description: 'Permanently delete a draft invoice',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Invoice ID (e.g., in_1234567890)',
    },
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/invoices/${params.id}`,
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        deleted: data.deleted,
        id: data.id,
        metadata: {
          id: data.id,
          deleted: data.deleted,
        },
      },
    }
  },

  outputs: {
    deleted: {
      type: 'boolean',
      description: 'Whether the invoice was deleted',
    },
    id: {
      type: 'string',
      description: 'The ID of the deleted invoice',
    },
    metadata: {
      type: 'json',
      description: 'Deletion metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_product.ts]---
Location: sim-main/apps/sim/tools/stripe/delete_product.ts

```typescript
import type { DeleteProductParams, ProductDeleteResponse } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeDeleteProductTool: ToolConfig<DeleteProductParams, ProductDeleteResponse> = {
  id: 'stripe_delete_product',
  name: 'Stripe Delete Product',
  description: 'Permanently delete a product',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Product ID (e.g., prod_1234567890)',
    },
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/products/${params.id}`,
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        deleted: data.deleted,
        id: data.id,
        metadata: {
          id: data.id,
          deleted: data.deleted,
        },
      },
    }
  },

  outputs: {
    deleted: {
      type: 'boolean',
      description: 'Whether the product was deleted',
    },
    id: {
      type: 'string',
      description: 'The ID of the deleted product',
    },
    metadata: {
      type: 'json',
      description: 'Deletion metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: finalize_invoice.ts]---
Location: sim-main/apps/sim/tools/stripe/finalize_invoice.ts

```typescript
import type { FinalizeInvoiceParams, InvoiceResponse } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeFinalizeInvoiceTool: ToolConfig<FinalizeInvoiceParams, InvoiceResponse> = {
  id: 'stripe_finalize_invoice',
  name: 'Stripe Finalize Invoice',
  description: 'Finalize a draft invoice',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Invoice ID (e.g., in_1234567890)',
    },
    auto_advance: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Auto-advance the invoice',
    },
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/invoices/${params.id}/finalize`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: (params) => {
      const formData = new URLSearchParams()

      if (params.auto_advance !== undefined) {
        formData.append('auto_advance', String(params.auto_advance))
      }

      return { body: formData.toString() }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        invoice: data,
        metadata: {
          id: data.id,
          status: data.status,
          amount_due: data.amount_due,
          currency: data.currency,
        },
      },
    }
  },

  outputs: {
    invoice: {
      type: 'json',
      description: 'The finalized invoice object',
    },
    metadata: {
      type: 'json',
      description: 'Invoice metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/stripe/index.ts

```typescript
export { stripeCancelPaymentIntentTool } from './cancel_payment_intent'
export { stripeCancelSubscriptionTool } from './cancel_subscription'
export { stripeCaptureChargeTool } from './capture_charge'
export { stripeCapturePaymentIntentTool } from './capture_payment_intent'
export { stripeConfirmPaymentIntentTool } from './confirm_payment_intent'
export { stripeCreateChargeTool } from './create_charge'
export { stripeCreateCustomerTool } from './create_customer'
export { stripeCreateInvoiceTool } from './create_invoice'
export { stripeCreatePaymentIntentTool } from './create_payment_intent'
export { stripeCreatePriceTool } from './create_price'
export { stripeCreateProductTool } from './create_product'
export { stripeCreateSubscriptionTool } from './create_subscription'
export { stripeDeleteCustomerTool } from './delete_customer'
export { stripeDeleteInvoiceTool } from './delete_invoice'
export { stripeDeleteProductTool } from './delete_product'
export { stripeFinalizeInvoiceTool } from './finalize_invoice'
export { stripeListChargesTool } from './list_charges'
export { stripeListCustomersTool } from './list_customers'
export { stripeListEventsTool } from './list_events'
export { stripeListInvoicesTool } from './list_invoices'
export { stripeListPaymentIntentsTool } from './list_payment_intents'
export { stripeListPricesTool } from './list_prices'
export { stripeListProductsTool } from './list_products'
export { stripeListSubscriptionsTool } from './list_subscriptions'
export { stripePayInvoiceTool } from './pay_invoice'
export { stripeResumeSubscriptionTool } from './resume_subscription'
export { stripeRetrieveChargeTool } from './retrieve_charge'
export { stripeRetrieveCustomerTool } from './retrieve_customer'
export { stripeRetrieveEventTool } from './retrieve_event'
export { stripeRetrieveInvoiceTool } from './retrieve_invoice'
export { stripeRetrievePaymentIntentTool } from './retrieve_payment_intent'
export { stripeRetrievePriceTool } from './retrieve_price'
export { stripeRetrieveProductTool } from './retrieve_product'
export { stripeRetrieveSubscriptionTool } from './retrieve_subscription'
export { stripeSearchChargesTool } from './search_charges'
export { stripeSearchCustomersTool } from './search_customers'
export { stripeSearchInvoicesTool } from './search_invoices'
export { stripeSearchPaymentIntentsTool } from './search_payment_intents'
export { stripeSearchPricesTool } from './search_prices'
export { stripeSearchProductsTool } from './search_products'
export { stripeSearchSubscriptionsTool } from './search_subscriptions'
export { stripeSendInvoiceTool } from './send_invoice'
export * from './types'
export { stripeUpdateChargeTool } from './update_charge'
export { stripeUpdateCustomerTool } from './update_customer'
export { stripeUpdateInvoiceTool } from './update_invoice'
export { stripeUpdatePaymentIntentTool } from './update_payment_intent'
export { stripeUpdatePriceTool } from './update_price'
export { stripeUpdateProductTool } from './update_product'
export { stripeUpdateSubscriptionTool } from './update_subscription'
export { stripeVoidInvoiceTool } from './void_invoice'
```

--------------------------------------------------------------------------------

---[FILE: list_charges.ts]---
Location: sim-main/apps/sim/tools/stripe/list_charges.ts

```typescript
import type { ChargeListResponse, ListChargesParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeListChargesTool: ToolConfig<ListChargesParams, ChargeListResponse> = {
  id: 'stripe_list_charges',
  name: 'Stripe List Charges',
  description: 'List all charges',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of results to return (default 10, max 100)',
    },
    customer: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by customer ID',
    },
    created: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by creation date (e.g., {"gt": 1633024800})',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.stripe.com/v1/charges')
      if (params.limit) url.searchParams.append('limit', params.limit.toString())
      if (params.customer) url.searchParams.append('customer', params.customer)
      if (params.created) {
        Object.entries(params.created).forEach(([key, value]) => {
          url.searchParams.append(`created[${key}]`, String(value))
        })
      }
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        charges: data.data || [],
        metadata: {
          count: (data.data || []).length,
          has_more: data.has_more || false,
        },
      },
    }
  },

  outputs: {
    charges: {
      type: 'json',
      description: 'Array of Charge objects',
    },
    metadata: {
      type: 'json',
      description: 'List metadata including count and has_more',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_customers.ts]---
Location: sim-main/apps/sim/tools/stripe/list_customers.ts

```typescript
import type { CustomerListResponse, ListCustomersParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeListCustomersTool: ToolConfig<ListCustomersParams, CustomerListResponse> = {
  id: 'stripe_list_customers',
  name: 'Stripe List Customers',
  description: 'List all customers',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of results to return (default 10, max 100)',
    },
    email: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by email address',
    },
    created: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by creation date',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.stripe.com/v1/customers')
      if (params.limit) url.searchParams.append('limit', params.limit.toString())
      if (params.email) url.searchParams.append('email', params.email)
      if (params.created) {
        Object.entries(params.created).forEach(([key, value]) => {
          url.searchParams.append(`created[${key}]`, String(value))
        })
      }
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        customers: data.data || [],
        metadata: {
          count: (data.data || []).length,
          has_more: data.has_more || false,
        },
      },
    }
  },

  outputs: {
    customers: {
      type: 'json',
      description: 'Array of customer objects',
    },
    metadata: {
      type: 'json',
      description: 'List metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_events.ts]---
Location: sim-main/apps/sim/tools/stripe/list_events.ts

```typescript
import type { EventListResponse, ListEventsParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeListEventsTool: ToolConfig<ListEventsParams, EventListResponse> = {
  id: 'stripe_list_events',
  name: 'Stripe List Events',
  description: 'List all Events',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of results to return (default 10, max 100)',
    },
    type: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by event type (e.g., payment_intent.created)',
    },
    created: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by creation date (e.g., {"gt": 1633024800})',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.stripe.com/v1/events')
      if (params.limit) url.searchParams.append('limit', params.limit.toString())
      if (params.type) url.searchParams.append('type', params.type)
      if (params.created) {
        Object.entries(params.created).forEach(([key, value]) => {
          url.searchParams.append(`created[${key}]`, String(value))
        })
      }
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        events: data.data || [],
        metadata: {
          count: (data.data || []).length,
          has_more: data.has_more || false,
        },
      },
    }
  },

  outputs: {
    events: {
      type: 'json',
      description: 'Array of Event objects',
    },
    metadata: {
      type: 'json',
      description: 'List metadata including count and has_more',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_invoices.ts]---
Location: sim-main/apps/sim/tools/stripe/list_invoices.ts

```typescript
import type { InvoiceListResponse, ListInvoicesParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeListInvoicesTool: ToolConfig<ListInvoicesParams, InvoiceListResponse> = {
  id: 'stripe_list_invoices',
  name: 'Stripe List Invoices',
  description: 'List all invoices',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of results to return (default 10, max 100)',
    },
    customer: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by customer ID',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by invoice status',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.stripe.com/v1/invoices')
      if (params.limit) url.searchParams.append('limit', params.limit.toString())
      if (params.customer) url.searchParams.append('customer', params.customer)
      if (params.status) url.searchParams.append('status', params.status)
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        invoices: data.data || [],
        metadata: {
          count: (data.data || []).length,
          has_more: data.has_more || false,
        },
      },
    }
  },

  outputs: {
    invoices: {
      type: 'json',
      description: 'Array of invoice objects',
    },
    metadata: {
      type: 'json',
      description: 'List metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_payment_intents.ts]---
Location: sim-main/apps/sim/tools/stripe/list_payment_intents.ts

```typescript
import type { ListPaymentIntentsParams, PaymentIntentListResponse } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeListPaymentIntentsTool: ToolConfig<
  ListPaymentIntentsParams,
  PaymentIntentListResponse
> = {
  id: 'stripe_list_payment_intents',
  name: 'Stripe List Payment Intents',
  description: 'List all Payment Intents',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of results to return (default 10, max 100)',
    },
    customer: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by customer ID',
    },
    created: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by creation date (e.g., {"gt": 1633024800})',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.stripe.com/v1/payment_intents')
      if (params.limit) url.searchParams.append('limit', params.limit.toString())
      if (params.customer) url.searchParams.append('customer', params.customer)
      if (params.created) {
        Object.entries(params.created).forEach(([key, value]) => {
          url.searchParams.append(`created[${key}]`, String(value))
        })
      }
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    return {
      success: true,
      output: {
        payment_intents: data.data || [],
        metadata: {
          count: (data.data || []).length,
          has_more: data.has_more || false,
        },
      },
    }
  },

  outputs: {
    payment_intents: {
      type: 'json',
      description: 'Array of Payment Intent objects',
    },
    metadata: {
      type: 'json',
      description: 'List metadata including count and has_more',
    },
  },
}
```

--------------------------------------------------------------------------------

````
