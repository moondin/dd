---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 764
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 764 of 933)

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

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/stripe/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface StripeAddress {
  line1?: string
  line2?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
}

export interface StripeMetadata {
  [key: string]: string
}

// ============================================================================
// Payment Intent Types
// ============================================================================

export interface PaymentIntentObject {
  id: string
  object: 'payment_intent'
  amount: number
  currency: string
  status: string
  customer?: string
  payment_method?: string
  description?: string
  receipt_email?: string
  metadata?: StripeMetadata
  created: number
  [key: string]: any
}

export interface CreatePaymentIntentParams {
  apiKey: string
  amount: number
  currency: string
  customer?: string
  payment_method?: string
  description?: string
  receipt_email?: string
  metadata?: StripeMetadata
  automatic_payment_methods?: { enabled: boolean }
}

export interface RetrievePaymentIntentParams {
  apiKey: string
  id: string
}

export interface UpdatePaymentIntentParams {
  apiKey: string
  id: string
  amount?: number
  currency?: string
  customer?: string
  description?: string
  metadata?: StripeMetadata
}

export interface ConfirmPaymentIntentParams {
  apiKey: string
  id: string
  payment_method?: string
}

export interface CapturePaymentIntentParams {
  apiKey: string
  id: string
  amount_to_capture?: number
}

export interface CancelPaymentIntentParams {
  apiKey: string
  id: string
  cancellation_reason?: string
}

export interface ListPaymentIntentsParams {
  apiKey: string
  limit?: number
  customer?: string
  created?: any
}

export interface SearchPaymentIntentsParams {
  apiKey: string
  query: string
  limit?: number
}

export interface PaymentIntentResponse extends ToolResponse {
  output: {
    payment_intent: PaymentIntentObject
    metadata: {
      id: string
      status: string
      amount: number
      currency: string
    }
  }
}

export interface PaymentIntentListResponse extends ToolResponse {
  output: {
    payment_intents: PaymentIntentObject[]
    metadata: {
      count: number
      has_more: boolean
    }
  }
}

// ============================================================================
// Customer Types
// ============================================================================

export interface CustomerObject {
  id: string
  object: 'customer'
  email?: string
  name?: string
  phone?: string
  description?: string
  address?: StripeAddress
  metadata?: StripeMetadata
  created: number
  [key: string]: any
}

export interface CreateCustomerParams {
  apiKey: string
  email?: string
  name?: string
  phone?: string
  description?: string
  address?: StripeAddress
  metadata?: StripeMetadata
  payment_method?: string
}

export interface RetrieveCustomerParams {
  apiKey: string
  id: string
}

export interface UpdateCustomerParams {
  apiKey: string
  id: string
  email?: string
  name?: string
  phone?: string
  description?: string
  address?: StripeAddress
  metadata?: StripeMetadata
}

export interface DeleteCustomerParams {
  apiKey: string
  id: string
}

export interface ListCustomersParams {
  apiKey: string
  limit?: number
  email?: string
  created?: any
}

export interface SearchCustomersParams {
  apiKey: string
  query: string
  limit?: number
}

export interface CustomerResponse extends ToolResponse {
  output: {
    customer: CustomerObject
    metadata: {
      id: string
      email?: string
      name?: string
    }
  }
}

export interface CustomerListResponse extends ToolResponse {
  output: {
    customers: CustomerObject[]
    metadata: {
      count: number
      has_more: boolean
    }
  }
}

export interface CustomerDeleteResponse extends ToolResponse {
  output: {
    deleted: boolean
    id: string
    metadata: {
      id: string
      deleted: boolean
    }
  }
}

// ============================================================================
// Subscription Types
// ============================================================================

export interface SubscriptionObject {
  id: string
  object: 'subscription'
  customer: string
  status: string
  items: {
    data: Array<{
      id: string
      price: {
        id: string
        [key: string]: any
      }
      [key: string]: any
    }>
  }
  current_period_start: number
  current_period_end: number
  cancel_at_period_end: boolean
  metadata?: StripeMetadata
  created: number
  [key: string]: any
}

export interface CreateSubscriptionParams {
  apiKey: string
  customer: string
  items: Array<{ price: string; quantity?: number }>
  trial_period_days?: number
  default_payment_method?: string
  cancel_at_period_end?: boolean
  metadata?: StripeMetadata
}

export interface RetrieveSubscriptionParams {
  apiKey: string
  id: string
}

export interface UpdateSubscriptionParams {
  apiKey: string
  id: string
  items?: Array<{ price: string; quantity?: number }>
  cancel_at_period_end?: boolean
  metadata?: StripeMetadata
}

export interface CancelSubscriptionParams {
  apiKey: string
  id: string
  prorate?: boolean
  invoice_now?: boolean
}

export interface ResumeSubscriptionParams {
  apiKey: string
  id: string
}

export interface ListSubscriptionsParams {
  apiKey: string
  limit?: number
  customer?: string
  status?: string
  price?: string
}

export interface SearchSubscriptionsParams {
  apiKey: string
  query: string
  limit?: number
}

export interface SubscriptionResponse extends ToolResponse {
  output: {
    subscription: SubscriptionObject
    metadata: {
      id: string
      status: string
      customer: string
    }
  }
}

export interface SubscriptionListResponse extends ToolResponse {
  output: {
    subscriptions: SubscriptionObject[]
    metadata: {
      count: number
      has_more: boolean
    }
  }
}

// ============================================================================
// Invoice Types
// ============================================================================

export interface InvoiceObject {
  id: string
  object: 'invoice'
  customer: string
  amount_due: number
  amount_paid: number
  amount_remaining: number
  currency: string
  status: string
  description?: string
  metadata?: StripeMetadata
  created: number
  [key: string]: any
}

export interface CreateInvoiceParams {
  apiKey: string
  customer: string
  description?: string
  metadata?: StripeMetadata
  auto_advance?: boolean
  collection_method?: 'charge_automatically' | 'send_invoice'
}

export interface RetrieveInvoiceParams {
  apiKey: string
  id: string
}

export interface UpdateInvoiceParams {
  apiKey: string
  id: string
  description?: string
  metadata?: StripeMetadata
  auto_advance?: boolean
}

export interface DeleteInvoiceParams {
  apiKey: string
  id: string
}

export interface FinalizeInvoiceParams {
  apiKey: string
  id: string
  auto_advance?: boolean
}

export interface PayInvoiceParams {
  apiKey: string
  id: string
  paid_out_of_band?: boolean
}

export interface VoidInvoiceParams {
  apiKey: string
  id: string
}

export interface SendInvoiceParams {
  apiKey: string
  id: string
}

export interface ListInvoicesParams {
  apiKey: string
  limit?: number
  customer?: string
  status?: string
}

export interface SearchInvoicesParams {
  apiKey: string
  query: string
  limit?: number
}

export interface InvoiceResponse extends ToolResponse {
  output: {
    invoice: InvoiceObject
    metadata: {
      id: string
      status: string
      amount_due: number
      currency: string
    }
  }
}

export interface InvoiceListResponse extends ToolResponse {
  output: {
    invoices: InvoiceObject[]
    metadata: {
      count: number
      has_more: boolean
    }
  }
}

export interface InvoiceDeleteResponse extends ToolResponse {
  output: {
    deleted: boolean
    id: string
    metadata: {
      id: string
      deleted: boolean
    }
  }
}

// ============================================================================
// Charge Types
// ============================================================================

export interface ChargeObject {
  id: string
  object: 'charge'
  amount: number
  currency: string
  status: string
  customer?: string
  description?: string
  paid: boolean
  refunded: boolean
  metadata?: StripeMetadata
  created: number
  [key: string]: any
}

export interface CreateChargeParams {
  apiKey: string
  amount: number
  currency: string
  customer?: string
  source?: string
  description?: string
  metadata?: StripeMetadata
  capture?: boolean
}

export interface RetrieveChargeParams {
  apiKey: string
  id: string
}

export interface UpdateChargeParams {
  apiKey: string
  id: string
  description?: string
  metadata?: StripeMetadata
}

export interface CaptureChargeParams {
  apiKey: string
  id: string
  amount?: number
}

export interface ListChargesParams {
  apiKey: string
  limit?: number
  customer?: string
  created?: any
}

export interface SearchChargesParams {
  apiKey: string
  query: string
  limit?: number
}

export interface ChargeResponse extends ToolResponse {
  output: {
    charge: ChargeObject
    metadata: {
      id: string
      status: string
      amount: number
      currency: string
      paid: boolean
    }
  }
}

export interface ChargeListResponse extends ToolResponse {
  output: {
    charges: ChargeObject[]
    metadata: {
      count: number
      has_more: boolean
    }
  }
}

// ============================================================================
// Product Types
// ============================================================================

export interface ProductObject {
  id: string
  object: 'product'
  name: string
  description?: string
  active: boolean
  images?: string[]
  metadata?: StripeMetadata
  created: number
  [key: string]: any
}

export interface CreateProductParams {
  apiKey: string
  name: string
  description?: string
  active?: boolean
  images?: string[]
  metadata?: StripeMetadata
}

export interface RetrieveProductParams {
  apiKey: string
  id: string
}

export interface UpdateProductParams {
  apiKey: string
  id: string
  name?: string
  description?: string
  active?: boolean
  images?: string[]
  metadata?: StripeMetadata
}

export interface DeleteProductParams {
  apiKey: string
  id: string
}

export interface ListProductsParams {
  apiKey: string
  limit?: number
  active?: boolean
}

export interface SearchProductsParams {
  apiKey: string
  query: string
  limit?: number
}

export interface ProductResponse extends ToolResponse {
  output: {
    product: ProductObject
    metadata: {
      id: string
      name: string
      active: boolean
    }
  }
}

export interface ProductListResponse extends ToolResponse {
  output: {
    products: ProductObject[]
    metadata: {
      count: number
      has_more: boolean
    }
  }
}

export interface ProductDeleteResponse extends ToolResponse {
  output: {
    deleted: boolean
    id: string
    metadata: {
      id: string
      deleted: boolean
    }
  }
}

// ============================================================================
// Price Types
// ============================================================================

export interface PriceObject {
  id: string
  object: 'price'
  product: string
  unit_amount?: number
  currency: string
  recurring?: {
    interval: string
    interval_count: number
  }
  metadata?: StripeMetadata
  active: boolean
  created: number
  [key: string]: any
}

export interface CreatePriceParams {
  apiKey: string
  product: string
  currency: string
  unit_amount?: number
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year'
    interval_count?: number
  }
  metadata?: StripeMetadata
  billing_scheme?: 'per_unit' | 'tiered'
}

export interface RetrievePriceParams {
  apiKey: string
  id: string
}

export interface UpdatePriceParams {
  apiKey: string
  id: string
  active?: boolean
  metadata?: StripeMetadata
}

export interface ListPricesParams {
  apiKey: string
  limit?: number
  product?: string
  active?: boolean
}

export interface SearchPricesParams {
  apiKey: string
  query: string
  limit?: number
}

export interface PriceResponse extends ToolResponse {
  output: {
    price: PriceObject
    metadata: {
      id: string
      product: string
      unit_amount?: number
      currency: string
    }
  }
}

export interface PriceListResponse extends ToolResponse {
  output: {
    prices: PriceObject[]
    metadata: {
      count: number
      has_more: boolean
    }
  }
}

// ============================================================================
// Event Types
// ============================================================================

export interface EventObject {
  id: string
  object: 'event'
  type: string
  data: {
    object: any
  }
  created: number
  livemode: boolean
  api_version?: string
  request?: {
    id: string
    idempotency_key?: string
  }
  [key: string]: any
}

export interface RetrieveEventParams {
  apiKey: string
  id: string
}

export interface ListEventsParams {
  apiKey: string
  limit?: number
  type?: string
  created?: any
}

export interface EventResponse extends ToolResponse {
  output: {
    event: EventObject
    metadata: {
      id: string
      type: string
      created: number
    }
  }
}

export interface EventListResponse extends ToolResponse {
  output: {
    events: EventObject[]
    metadata: {
      count: number
      has_more: boolean
    }
  }
}

export type StripeResponse =
  | PaymentIntentResponse
  | PaymentIntentListResponse
  | CustomerResponse
  | CustomerListResponse
  | CustomerDeleteResponse
  | SubscriptionResponse
  | SubscriptionListResponse
  | InvoiceResponse
  | InvoiceListResponse
  | InvoiceDeleteResponse
  | ChargeResponse
  | ChargeListResponse
  | ProductResponse
  | ProductListResponse
  | ProductDeleteResponse
  | PriceResponse
  | PriceListResponse
  | EventResponse
  | EventListResponse
```

--------------------------------------------------------------------------------

---[FILE: update_charge.ts]---
Location: sim-main/apps/sim/tools/stripe/update_charge.ts

```typescript
import type { ChargeResponse, UpdateChargeParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeUpdateChargeTool: ToolConfig<UpdateChargeParams, ChargeResponse> = {
  id: 'stripe_update_charge',
  name: 'Stripe Update Charge',
  description: 'Update an existing charge',
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
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated description',
    },
    metadata: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated metadata',
    },
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/charges/${params.id}`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: (params) => {
      const formData = new URLSearchParams()

      if (params.description) formData.append('description', params.description)

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
      description: 'The updated Charge object',
    },
    metadata: {
      type: 'json',
      description: 'Charge metadata including ID, status, amount, currency, and paid status',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_customer.ts]---
Location: sim-main/apps/sim/tools/stripe/update_customer.ts

```typescript
import type { CustomerResponse, UpdateCustomerParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeUpdateCustomerTool: ToolConfig<UpdateCustomerParams, CustomerResponse> = {
  id: 'stripe_update_customer',
  name: 'Stripe Update Customer',
  description: 'Update an existing customer',
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
    email: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated email address',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated name',
    },
    phone: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated phone number',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated description',
    },
    address: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated address object',
    },
    metadata: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated metadata',
    },
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/customers/${params.id}`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: (params) => {
      const formData = new URLSearchParams()

      if (params.email) formData.append('email', params.email)
      if (params.name) formData.append('name', params.name)
      if (params.phone) formData.append('phone', params.phone)
      if (params.description) formData.append('description', params.description)

      if (params.address) {
        Object.entries(params.address).forEach(([key, value]) => {
          if (value) formData.append(`address[${key}]`, String(value))
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
      description: 'The updated customer object',
    },
    metadata: {
      type: 'json',
      description: 'Customer metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_invoice.ts]---
Location: sim-main/apps/sim/tools/stripe/update_invoice.ts

```typescript
import type { InvoiceResponse, UpdateInvoiceParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeUpdateInvoiceTool: ToolConfig<UpdateInvoiceParams, InvoiceResponse> = {
  id: 'stripe_update_invoice',
  name: 'Stripe Update Invoice',
  description: 'Update an existing invoice',
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
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/invoices/${params.id}`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: (params) => {
      const formData = new URLSearchParams()

      if (params.description) formData.append('description', params.description)
      if (params.auto_advance !== undefined) {
        formData.append('auto_advance', String(params.auto_advance))
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
      description: 'The updated invoice object',
    },
    metadata: {
      type: 'json',
      description: 'Invoice metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_payment_intent.ts]---
Location: sim-main/apps/sim/tools/stripe/update_payment_intent.ts

```typescript
import type { PaymentIntentResponse, UpdatePaymentIntentParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeUpdatePaymentIntentTool: ToolConfig<
  UpdatePaymentIntentParams,
  PaymentIntentResponse
> = {
  id: 'stripe_update_payment_intent',
  name: 'Stripe Update Payment Intent',
  description: 'Update an existing Payment Intent',
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
    amount: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated amount in cents',
    },
    currency: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Three-letter ISO currency code',
    },
    customer: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Customer ID',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated description',
    },
    metadata: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated metadata',
    },
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/payment_intents/${params.id}`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: (params) => {
      const formData = new URLSearchParams()

      if (params.amount) formData.append('amount', Number(params.amount).toString())
      if (params.currency) formData.append('currency', params.currency)
      if (params.customer) formData.append('customer', params.customer)
      if (params.description) formData.append('description', params.description)

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
      description: 'The updated Payment Intent object',
    },
    metadata: {
      type: 'json',
      description: 'Payment Intent metadata including ID, status, amount, and currency',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_price.ts]---
Location: sim-main/apps/sim/tools/stripe/update_price.ts

```typescript
import type { PriceResponse, UpdatePriceParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeUpdatePriceTool: ToolConfig<UpdatePriceParams, PriceResponse> = {
  id: 'stripe_update_price',
  name: 'Stripe Update Price',
  description: 'Update an existing price',
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
    active: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether the price is active',
    },
    metadata: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated metadata',
    },
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/prices/${params.id}`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: (params) => {
      const formData = new URLSearchParams()

      if (params.active !== undefined) formData.append('active', String(params.active))

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
      description: 'The updated price object',
    },
    metadata: {
      type: 'json',
      description: 'Price metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_product.ts]---
Location: sim-main/apps/sim/tools/stripe/update_product.ts

```typescript
import type { ProductResponse, UpdateProductParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeUpdateProductTool: ToolConfig<UpdateProductParams, ProductResponse> = {
  id: 'stripe_update_product',
  name: 'Stripe Update Product',
  description: 'Update an existing product',
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
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated product name',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated product description',
    },
    active: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated active status',
    },
    images: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated array of image URLs',
    },
    metadata: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated metadata',
    },
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/products/${params.id}`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: (params) => {
      const formData = new URLSearchParams()

      if (params.name) formData.append('name', params.name)
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
      description: 'The updated product object',
    },
    metadata: {
      type: 'json',
      description: 'Product metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_subscription.ts]---
Location: sim-main/apps/sim/tools/stripe/update_subscription.ts

```typescript
import type { SubscriptionResponse, UpdateSubscriptionParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeUpdateSubscriptionTool: ToolConfig<
  UpdateSubscriptionParams,
  SubscriptionResponse
> = {
  id: 'stripe_update_subscription',
  name: 'Stripe Update Subscription',
  description: 'Update an existing subscription',
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
    items: {
      type: 'json',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated array of items with price IDs',
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
      description: 'Updated metadata',
    },
  },

  request: {
    url: (params) => `https://api.stripe.com/v1/subscriptions/${params.id}`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    body: (params) => {
      const formData = new URLSearchParams()

      if (params.items && Array.isArray(params.items)) {
        params.items.forEach((item, index) => {
          formData.append(`items[${index}][price]`, item.price)
          if (item.quantity) {
            formData.append(`items[${index}][quantity]`, String(item.quantity))
          }
        })
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
      description: 'The updated subscription object',
    },
    metadata: {
      type: 'json',
      description: 'Subscription metadata including ID, status, and customer',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: void_invoice.ts]---
Location: sim-main/apps/sim/tools/stripe/void_invoice.ts

```typescript
import type { InvoiceResponse, VoidInvoiceParams } from '@/tools/stripe/types'
import type { ToolConfig } from '@/tools/types'

export const stripeVoidInvoiceTool: ToolConfig<VoidInvoiceParams, InvoiceResponse> = {
  id: 'stripe_void_invoice',
  name: 'Stripe Void Invoice',
  description: 'Void an invoice',
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
    url: (params) => `https://api.stripe.com/v1/invoices/${params.id}/void`,
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
      description: 'The voided invoice object',
    },
    metadata: {
      type: 'json',
      description: 'Invoice metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: assemblyai.ts]---
Location: sim-main/apps/sim/tools/stt/assemblyai.ts

```typescript
import type { SttParams, SttResponse } from '@/tools/stt/types'
import type { ToolConfig } from '@/tools/types'

export const assemblyaiSttTool: ToolConfig<SttParams, SttResponse> = {
  id: 'stt_assemblyai',
  name: 'AssemblyAI STT',
  description: 'Transcribe audio to text using AssemblyAI with advanced NLP features',
  version: '1.0.0',

  params: {
    provider: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'STT provider (assemblyai)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'AssemblyAI API key',
    },
    model: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'AssemblyAI model to use (default: best)',
    },
    audioFile: {
      type: 'file',
      required: false,
      visibility: 'user-or-llm',
      description: 'Audio or video file to transcribe',
    },
    audioFileReference: {
      type: 'file',
      required: false,
      visibility: 'user-or-llm',
      description: 'Reference to audio/video file from previous blocks',
    },
    audioUrl: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'URL to audio or video file',
    },
    language: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Language code (e.g., "en", "es", "fr") or "auto" for auto-detection',
    },
    timestamps: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Timestamp granularity: none, sentence, or word',
    },
    diarization: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Enable speaker diarization',
    },
    sentiment: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Enable sentiment analysis',
    },
    entityDetection: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Enable entity detection',
    },
    piiRedaction: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Enable PII redaction',
    },
    summarization: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Enable automatic summarization',
    },
  },

  request: {
    url: '/api/proxy/stt',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (
      params: SttParams & {
        _context?: { workspaceId?: string; workflowId?: string; executionId?: string }
      }
    ) => ({
      provider: 'assemblyai',
      apiKey: params.apiKey,
      model: params.model,
      audioFile: params.audioFile,
      audioFileReference: params.audioFileReference,
      audioUrl: params.audioUrl,
      language: params.language || 'auto',
      timestamps: params.timestamps || 'none',
      diarization: params.diarization || false,
      sentiment: (params as any).sentiment || false,
      entityDetection: (params as any).entityDetection || false,
      piiRedaction: (params as any).piiRedaction || false,
      summarization: (params as any).summarization || false,
      workspaceId: params._context?.workspaceId,
      workflowId: params._context?.workflowId,
      executionId: params._context?.executionId,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok || data.error) {
      return {
        success: false,
        error: data.error || 'Transcription failed',
        output: {
          transcript: '',
        },
      }
    }

    return {
      success: true,
      output: {
        transcript: data.transcript,
        segments: data.segments,
        language: data.language,
        duration: data.duration,
        confidence: data.confidence,
        sentiment: data.sentiment,
        entities: data.entities,
        summary: data.summary,
      },
    }
  },

  outputs: {
    transcript: { type: 'string', description: 'Full transcribed text' },
    segments: { type: 'array', description: 'Timestamped segments with speaker labels' },
    language: { type: 'string', description: 'Detected or specified language' },
    duration: { type: 'number', description: 'Audio duration in seconds' },
    confidence: { type: 'number', description: 'Overall confidence score' },
    sentiment: { type: 'array', description: 'Sentiment analysis results' },
    entities: { type: 'array', description: 'Detected entities' },
    summary: { type: 'string', description: 'Auto-generated summary' },
  },
}
```

--------------------------------------------------------------------------------

````
