---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 763
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 763 of 933)

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

---[FILE: list_prices.ts]---
Location: sim-main/apps/sim/tools/stripe/list_prices.ts

```typescript
import type { ListPricesParams, PriceListResponse } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeListPricesTool: ToolConfig<ListPricesParams, PriceListResponse> = {
  id: 'stripe_list_prices',
  name: 'Stripe List Prices',
  description: 'List all prices',
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
    product: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by product ID',
    },
    active: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by active status',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.stripe.com/v1/prices')
      if (params.limit) url.searchParams.append('limit', params.limit.toString())
      if (params.product) url.searchParams.append('product', params.product)
      if (params.active !== undefined) url.searchParams.append('active', params.active.toString())
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
        prices: data.data || [],
        metadata: {
          count: (data.data || []).length,
          has_more: data.has_more || false,
        },
      },
    }
  },

  outputs: {
    prices: {
      type: 'json',
      description: 'Array of price objects',
    },
    metadata: {
      type: 'json',
      description: 'List metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_products.ts]---
Location: sim-main/apps/sim/tools/stripe/list_products.ts

```typescript
import type { ListProductsParams, ProductListResponse } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeListProductsTool: ToolConfig<ListProductsParams, ProductListResponse> = {
  id: 'stripe_list_products',
  name: 'Stripe List Products',
  description: 'List all products',
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
    active: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by active status',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.stripe.com/v1/products')
      if (params.limit) url.searchParams.append('limit', params.limit.toString())
      if (params.active !== undefined) url.searchParams.append('active', String(params.active))
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
        products: data.data || [],
        metadata: {
          count: (data.data || []).length,
          has_more: data.has_more || false,
        },
      },
    }
  },

  outputs: {
    products: {
      type: 'json',
      description: 'Array of product objects',
    },
    metadata: {
      type: 'json',
      description: 'List metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_subscriptions.ts]---
Location: sim-main/apps/sim/tools/stripe/list_subscriptions.ts

```typescript
import type { ListSubscriptionsParams, SubscriptionListResponse } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeListSubscriptionsTool: ToolConfig<
  ListSubscriptionsParams,
  SubscriptionListResponse
> = {
  id: 'stripe_list_subscriptions',
  name: 'Stripe List Subscriptions',
  description: 'List all subscriptions',
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
      description:
        'Filter by status (active, past_due, unpaid, canceled, incomplete, incomplete_expired, trialing, all)',
    },
    price: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by price ID',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.stripe.com/v1/subscriptions')
      if (params.limit) url.searchParams.append('limit', params.limit.toString())
      if (params.customer) url.searchParams.append('customer', params.customer)
      if (params.status) url.searchParams.append('status', params.status)
      if (params.price) url.searchParams.append('price', params.price)
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
        subscriptions: data.data || [],
        metadata: {
          count: (data.data || []).length,
          has_more: data.has_more || false,
        },
      },
    }
  },

  outputs: {
    subscriptions: {
      type: 'json',
      description: 'Array of subscription objects',
    },
    metadata: {
      type: 'json',
      description: 'List metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: pay_invoice.ts]---
Location: sim-main/apps/sim/tools/stripe/pay_invoice.ts

```typescript
import type { InvoiceResponse, PayInvoiceParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripePayInvoiceTool: ToolConfig<PayInvoiceParams, InvoiceResponse> = {
  id: 'stripe_pay_invoice',
  name: 'Stripe Pay Invoice',
  description: 'Pay an invoice',
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
    paid_out_of_band: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Mark invoice as paid out of band',
    },
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/invoices/${params.id}/pay`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: (params) => {
      const formData = new URLSearchParams()
      if (params.paid_out_of_band !== undefined) {
        formData.append('paid_out_of_band', String(params.paid_out_of_band))
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
      description: 'The paid invoice object',
    },
    metadata: {
      type: 'json',
      description: 'Invoice metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: resume_subscription.ts]---
Location: sim-main/apps/sim/tools/stripe/resume_subscription.ts

```typescript
import type { ResumeSubscriptionParams, SubscriptionResponse } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeResumeSubscriptionTool: ToolConfig<
  ResumeSubscriptionParams,
  SubscriptionResponse
> = {
  id: 'stripe_resume_subscription',
  name: 'Stripe Resume Subscription',
  description: 'Resume a subscription that was scheduled for cancellation',
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
      description: 'Subscription ID (e.g., sub_1234567890)',
    },
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/subscriptions/${params.id}/resume`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: () => {
      const formData = new URLSearchParams()
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
      description: 'The resumed subscription object',
    },
    metadata: {
      type: 'json',
      description: 'Subscription metadata including ID, status, and customer',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: retrieve_charge.ts]---
Location: sim-main/apps/sim/tools/stripe/retrieve_charge.ts

```typescript
import type { ChargeResponse, RetrieveChargeParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeRetrieveChargeTool: ToolConfig<RetrieveChargeParams, ChargeResponse> = {
  id: 'stripe_retrieve_charge',
  name: 'Stripe Retrieve Charge',
  description: 'Retrieve an existing charge by ID',
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
      description: 'Charge ID (e.g., ch_1234567890)',
    },
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/charges/${params.id}`,
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
        charge: data,
        metadata: {
          id: data.id,
          status: data.status,
          amount: data.amount,
          currency: data.currency,
          paid: data.paid,
        },
      },
    }
  },

  outputs: {
    charge: {
      type: 'json',
      description: 'The retrieved Charge object',
    },
    metadata: {
      type: 'json',
      description: 'Charge metadata including ID, status, amount, currency, and paid status',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: retrieve_customer.ts]---
Location: sim-main/apps/sim/tools/stripe/retrieve_customer.ts

```typescript
import type { CustomerResponse, RetrieveCustomerParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeRetrieveCustomerTool: ToolConfig<RetrieveCustomerParams, CustomerResponse> = {
  id: 'stripe_retrieve_customer',
  name: 'Stripe Retrieve Customer',
  description: 'Retrieve an existing customer by ID',
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
        customer: data,
        metadata: {
          id: data.id,
          email: data.email,
          name: data.name,
        },
      },
    }
  },

  outputs: {
    customer: {
      type: 'json',
      description: 'The retrieved customer object',
    },
    metadata: {
      type: 'json',
      description: 'Customer metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: retrieve_event.ts]---
Location: sim-main/apps/sim/tools/stripe/retrieve_event.ts

```typescript
import type { EventResponse, RetrieveEventParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeRetrieveEventTool: ToolConfig<RetrieveEventParams, EventResponse> = {
  id: 'stripe_retrieve_event',
  name: 'Stripe Retrieve Event',
  description: 'Retrieve an existing Event by ID',
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
      description: 'Event ID (e.g., evt_1234567890)',
    },
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/events/${params.id}`,
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
        event: data,
        metadata: {
          id: data.id,
          type: data.type,
          created: data.created,
        },
      },
    }
  },

  outputs: {
    event: {
      type: 'json',
      description: 'The retrieved Event object',
    },
    metadata: {
      type: 'json',
      description: 'Event metadata including ID, type, and created timestamp',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: retrieve_invoice.ts]---
Location: sim-main/apps/sim/tools/stripe/retrieve_invoice.ts

```typescript
import type { InvoiceResponse, RetrieveInvoiceParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeRetrieveInvoiceTool: ToolConfig<RetrieveInvoiceParams, InvoiceResponse> = {
  id: 'stripe_retrieve_invoice',
  name: 'Stripe Retrieve Invoice',
  description: 'Retrieve an existing invoice by ID',
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
      description: 'The retrieved invoice object',
    },
    metadata: {
      type: 'json',
      description: 'Invoice metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: retrieve_payment_intent.ts]---
Location: sim-main/apps/sim/tools/stripe/retrieve_payment_intent.ts

```typescript
import type { PaymentIntentResponse, RetrievePaymentIntentParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeRetrievePaymentIntentTool: ToolConfig<
  RetrievePaymentIntentParams,
  PaymentIntentResponse
> = {
  id: 'stripe_retrieve_payment_intent',
  name: 'Stripe Retrieve Payment Intent',
  description: 'Retrieve an existing Payment Intent by ID',
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
      description: 'Payment Intent ID (e.g., pi_1234567890)',
    },
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/payment_intents/${params.id}`,
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
      description: 'The retrieved Payment Intent object',
    },
    metadata: {
      type: 'json',
      description: 'Payment Intent metadata including ID, status, amount, and currency',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: retrieve_price.ts]---
Location: sim-main/apps/sim/tools/stripe/retrieve_price.ts

```typescript
import type { PriceResponse, RetrievePriceParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeRetrievePriceTool: ToolConfig<RetrievePriceParams, PriceResponse> = {
  id: 'stripe_retrieve_price',
  name: 'Stripe Retrieve Price',
  description: 'Retrieve an existing price by ID',
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
      description: 'Price ID (e.g., price_1234567890)',
    },
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/prices/${params.id}`,
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
      description: 'The retrieved price object',
    },
    metadata: {
      type: 'json',
      description: 'Price metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: retrieve_product.ts]---
Location: sim-main/apps/sim/tools/stripe/retrieve_product.ts

```typescript
import type { ProductResponse, RetrieveProductParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeRetrieveProductTool: ToolConfig<RetrieveProductParams, ProductResponse> = {
  id: 'stripe_retrieve_product',
  name: 'Stripe Retrieve Product',
  description: 'Retrieve an existing product by ID',
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
      description: 'The retrieved product object',
    },
    metadata: {
      type: 'json',
      description: 'Product metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: retrieve_subscription.ts]---
Location: sim-main/apps/sim/tools/stripe/retrieve_subscription.ts

```typescript
import type { RetrieveSubscriptionParams, SubscriptionResponse } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeRetrieveSubscriptionTool: ToolConfig<
  RetrieveSubscriptionParams,
  SubscriptionResponse
> = {
  id: 'stripe_retrieve_subscription',
  name: 'Stripe Retrieve Subscription',
  description: 'Retrieve an existing subscription by ID',
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
      description: 'Subscription ID (e.g., sub_1234567890)',
    },
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/subscriptions/${params.id}`,
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
      description: 'The retrieved subscription object',
    },
    metadata: {
      type: 'json',
      description: 'Subscription metadata including ID, status, and customer',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search_charges.ts]---
Location: sim-main/apps/sim/tools/stripe/search_charges.ts

```typescript
import type { ChargeListResponse, SearchChargesParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeSearchChargesTool: ToolConfig<SearchChargesParams, ChargeListResponse> = {
  id: 'stripe_search_charges',
  name: 'Stripe Search Charges',
  description: 'Search for charges using query syntax',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: "Search query (e.g., \"status:'succeeded' AND currency:'usd'\")",
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of results to return (default 10, max 100)',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.stripe.com/v1/charges/search')
      url.searchParams.append('query', params.query)
      if (params.limit) url.searchParams.append('limit', params.limit.toString())
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
      description: 'Array of matching Charge objects',
    },
    metadata: {
      type: 'json',
      description: 'Search metadata including count and has_more',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search_customers.ts]---
Location: sim-main/apps/sim/tools/stripe/search_customers.ts

```typescript
import type { CustomerListResponse, SearchCustomersParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeSearchCustomersTool: ToolConfig<SearchCustomersParams, CustomerListResponse> = {
  id: 'stripe_search_customers',
  name: 'Stripe Search Customers',
  description: 'Search for customers using query syntax',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Search query (e.g., "email:\'customer@example.com\'")',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of results to return (default 10, max 100)',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.stripe.com/v1/customers/search')
      url.searchParams.append('query', params.query)
      if (params.limit) url.searchParams.append('limit', params.limit.toString())
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
      description: 'Array of matching customer objects',
    },
    metadata: {
      type: 'json',
      description: 'Search metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search_invoices.ts]---
Location: sim-main/apps/sim/tools/stripe/search_invoices.ts

```typescript
import type { InvoiceListResponse, SearchInvoicesParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeSearchInvoicesTool: ToolConfig<SearchInvoicesParams, InvoiceListResponse> = {
  id: 'stripe_search_invoices',
  name: 'Stripe Search Invoices',
  description: 'Search for invoices using query syntax',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Search query (e.g., "customer:\'cus_1234567890\'")',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of results to return (default 10, max 100)',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.stripe.com/v1/invoices/search')
      url.searchParams.append('query', params.query)
      if (params.limit) url.searchParams.append('limit', params.limit.toString())
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
      description: 'Array of matching invoice objects',
    },
    metadata: {
      type: 'json',
      description: 'Search metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search_payment_intents.ts]---
Location: sim-main/apps/sim/tools/stripe/search_payment_intents.ts

```typescript
import type { PaymentIntentListResponse, SearchPaymentIntentsParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeSearchPaymentIntentsTool: ToolConfig<
  SearchPaymentIntentsParams,
  PaymentIntentListResponse
> = {
  id: 'stripe_search_payment_intents',
  name: 'Stripe Search Payment Intents',
  description: 'Search for Payment Intents using query syntax',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: "Search query (e.g., \"status:'succeeded' AND currency:'usd'\")",
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of results to return (default 10, max 100)',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.stripe.com/v1/payment_intents/search')
      url.searchParams.append('query', params.query)
      if (params.limit) url.searchParams.append('limit', params.limit.toString())
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
      description: 'Array of matching Payment Intent objects',
    },
    metadata: {
      type: 'json',
      description: 'Search metadata including count and has_more',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search_prices.ts]---
Location: sim-main/apps/sim/tools/stripe/search_prices.ts

```typescript
import type { PriceListResponse, SearchPricesParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeSearchPricesTool: ToolConfig<SearchPricesParams, PriceListResponse> = {
  id: 'stripe_search_prices',
  name: 'Stripe Search Prices',
  description: 'Search for prices using query syntax',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: "Search query (e.g., \"active:'true' AND currency:'usd'\")",
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of results to return (default 10, max 100)',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.stripe.com/v1/prices/search')
      url.searchParams.append('query', params.query)
      if (params.limit) url.searchParams.append('limit', params.limit.toString())
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
        prices: data.data || [],
        metadata: {
          count: (data.data || []).length,
          has_more: data.has_more || false,
        },
      },
    }
  },

  outputs: {
    prices: {
      type: 'json',
      description: 'Array of matching price objects',
    },
    metadata: {
      type: 'json',
      description: 'Search metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search_products.ts]---
Location: sim-main/apps/sim/tools/stripe/search_products.ts

```typescript
import type { ProductListResponse, SearchProductsParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeSearchProductsTool: ToolConfig<SearchProductsParams, ProductListResponse> = {
  id: 'stripe_search_products',
  name: 'Stripe Search Products',
  description: 'Search for products using query syntax',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Search query (e.g., "name:\'shirt\'")',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of results to return (default 10, max 100)',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.stripe.com/v1/products/search')
      url.searchParams.append('query', params.query)
      if (params.limit) url.searchParams.append('limit', params.limit.toString())
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
        products: data.data || [],
        metadata: {
          count: (data.data || []).length,
          has_more: data.has_more || false,
        },
      },
    }
  },

  outputs: {
    products: {
      type: 'json',
      description: 'Array of matching product objects',
    },
    metadata: {
      type: 'json',
      description: 'Search metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search_subscriptions.ts]---
Location: sim-main/apps/sim/tools/stripe/search_subscriptions.ts

```typescript
import type { SearchSubscriptionsParams, SubscriptionListResponse } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeSearchSubscriptionsTool: ToolConfig<
  SearchSubscriptionsParams,
  SubscriptionListResponse
> = {
  id: 'stripe_search_subscriptions',
  name: 'Stripe Search Subscriptions',
  description: 'Search for subscriptions using query syntax',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Stripe API key (secret key)',
    },
    query: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: "Search query (e.g., \"status:'active' AND customer:'cus_xxx'\")",
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Number of results to return (default 10, max 100)',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://api.stripe.com/v1/subscriptions/search')
      url.searchParams.append('query', params.query)
      if (params.limit) url.searchParams.append('limit', params.limit.toString())
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
        subscriptions: data.data || [],
        metadata: {
          count: (data.data || []).length,
          has_more: data.has_more || false,
        },
      },
    }
  },

  outputs: {
    subscriptions: {
      type: 'json',
      description: 'Array of matching subscription objects',
    },
    metadata: {
      type: 'json',
      description: 'Search metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: send_invoice.ts]---
Location: sim-main/apps/sim/tools/stripe/send_invoice.ts

```typescript
import type { InvoiceResponse, SendInvoiceParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeSendInvoiceTool: ToolConfig<SendInvoiceParams, InvoiceResponse> = {
  id: 'stripe_send_invoice',
  name: 'Stripe Send Invoice',
  description: 'Send an invoice to the customer',
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
    url: (params) => `https://api.stripe.com/v1/invoices/${params.id}/send`,
    method: 'POST',
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
      description: 'The sent invoice object',
    },
    metadata: {
      type: 'json',
      description: 'Invoice metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

````
