---
source_txt: FULLSTACK_CODE_DATABASE_PART3_ECOMMERCE_SOCIAL.txt
converted_utc: 2025-12-17T23:22:00Z
---

# FULLSTACK CODE DATABASE PART3 ECOMMERCE SOCIAL

## Verbatim Content

````text
================================================================================
FULLSTACK CODE DATABASE - PART 3: E-COMMERCE & SOCIAL MEDIA FEATURES
================================================================================
Generated: December 16, 2025
Projects: DigitalHippo (E-commerce), Breadit (Social Platform)
Tech Stack: Stripe, Payload CMS, Next.js, Prisma, Redis
================================================================================

TABLE OF CONTENTS:
1. COMPLETE E-COMMERCE SYSTEM (Stripe + Payload CMS)
   - Payment Router with Stripe
   - Shopping Cart with Zustand
   - Stripe Webhook Handler
   - Order Management
   - Email Receipts

2. SOCIAL MEDIA PLATFORM (Reddit Clone)
   - Database Schema (Prisma)
   - Post Creation with Validation
   - Comment System with Nested Replies
   - Voting System with Redis Caching
   - Subreddit Management

================================================================================
1. COMPLETE E-COMMERCE SYSTEM (Stripe + Payload CMS)
================================================================================
Source: DigitalHippo
Tech Stack: Stripe, Payload CMS, Next.js, tRPC, Resend (emails)
================================================================================

---[FILE: Stripe Configuration - stripe.ts]---
Location: src/lib/stripe.ts
Purpose: Initialize Stripe SDK

```typescript
import Stripe from 'stripe'

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ?? '',
  {
    apiVersion: '2023-10-16',
    typescript: true,
  }
)
```

USAGE NOTES:
- Requires STRIPE_SECRET_KEY in environment variables
- Latest Stripe API version
- TypeScript support enabled

---[FILE: Payment Router - payment-router.ts]---
Location: src/trpc/payment-router.ts
Purpose: Complete Stripe checkout flow with tRPC

```typescript
import { z } from 'zod'
import {
  privateProcedure,
  publicProcedure,
  router,
} from './trpc'
import { TRPCError } from '@trpc/server'
import { getPayloadClient } from '../get-payload'
import { stripe } from '../lib/stripe'
import type Stripe from 'stripe'

export const paymentRouter = router({
  // CREATE STRIPE CHECKOUT SESSION
  createSession: privateProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx
      let { productIds } = input

      if (productIds.length === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      const payload = await getPayloadClient()

      // Fetch products from Payload CMS
      const { docs: products } = await payload.find({
        collection: 'products',
        where: {
          id: {
            in: productIds,
          },
        },
      })

      // Filter products that have Stripe price IDs
      const filteredProducts = products.filter((prod) =>
        Boolean(prod.priceId)
      )

      // Create order in database (unpaid initially)
      const order = await payload.create({
        collection: 'orders',
        data: {
          _isPaid: false,
          products: filteredProducts.map((prod) => prod.id),
          user: user.id,
        },
      })

      // Build Stripe line items
      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

      filteredProducts.forEach((product) => {
        line_items.push({
          price: product.priceId!,
          quantity: 1,
        })
      })

      // Add transaction fee (example)
      line_items.push({
        price: 'price_1OCeBwA19umTXGu8s4p2G3aX',
        quantity: 1,
        adjustable_quantity: {
          enabled: false,
        },
      })

      try {
        // Create Stripe checkout session
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          payment_method_types: ['card', 'paypal'],
          mode: 'payment',
          metadata: {
            userId: user.id,
            orderId: order.id,
          },
          line_items,
        })

        return { url: stripeSession.url }
      } catch (err) {
        return { url: null }
      }
    }),

  // POLL ORDER STATUS (for thank you page)
  pollOrderStatus: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const { orderId } = input

      const payload = await getPayloadClient()

      const { docs: orders } = await payload.find({
        collection: 'orders',
        where: {
          id: {
            equals: orderId,
          },
        },
      })

      if (!orders.length) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      const [order] = orders

      return { isPaid: order._isPaid }
    }),
})
```

USAGE NOTES:
- Creates unpaid order first, then Stripe session
- Metadata includes userId and orderId for webhook processing
- Supports card and PayPal payments
- Returns Stripe checkout URL for redirect
- Poll endpoint checks payment status after redirect

---[FILE: Shopping Cart Hook - use-cart.ts]---
Location: src/hooks/use-cart.ts
Purpose: Persistent shopping cart with Zustand and localStorage

```typescript
import { Product } from '@/payload-types'
import { create } from 'zustand'
import {
  createJSONStorage,
  persist,
} from 'zustand/middleware'

export type CartItem = {
  product: Product
}

type CartState = {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (product) =>
        set((state) => {
          return { items: [...state.items, { product }] }
        }),
      
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter(
            (item) => item.product.id !== id
          ),
        })),
      
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

USAGE NOTES:
- Persistent cart survives page refreshes
- Stored in localStorage as JSON
- Simple add/remove/clear operations
- Can be used in any React component

USAGE EXAMPLE:
```typescript
import { useCart } from '@/hooks/use-cart'

function ProductCard({ product }) {
  const { addItem } = useCart()
  
  return (
    <button onClick={() => addItem(product)}>
      Add to Cart
    </button>
  )
}
```

---[FILE: Stripe Webhook Handler - webhooks.ts]---
Location: src/webhooks.ts
Purpose: Handle Stripe webhook events and send receipts

```typescript
import express from 'express'
import { WebhookRequest } from './server'
import { stripe } from './lib/stripe'
import type Stripe from 'stripe'
import { getPayloadClient } from './get-payload'
import { Product } from './payload-types'
import { Resend } from 'resend'
import { ReceiptEmailHtml } from './components/emails/ReceiptEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export const stripeWebhookHandler = async (
  req: express.Request,
  res: express.Response
) => {
  const webhookRequest = req as any as WebhookRequest
  const body = webhookRequest.rawBody
  const signature = req.headers['stripe-signature'] || ''

  let event
  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err) {
    return res
      .status(400)
      .send(
        `Webhook Error: ${
          err instanceof Error
            ? err.message
            : 'Unknown Error'
        }`
      )
  }

  const session = event.data
    .object as Stripe.Checkout.Session

  if (
    !session?.metadata?.userId ||
    !session?.metadata?.orderId
  ) {
    return res
      .status(400)
      .send(`Webhook Error: No user present in metadata`)
  }

  // Handle successful checkout
  if (event.type === 'checkout.session.completed') {
    const payload = await getPayloadClient()

    // Get user
    const { docs: users } = await payload.find({
      collection: 'users',
      where: {
        id: {
          equals: session.metadata.userId,
        },
      },
    })

    const [user] = users

    if (!user)
      return res
        .status(404)
        .json({ error: 'No such user exists.' })

    // Get order with products
    const { docs: orders } = await payload.find({
      collection: 'orders',
      depth: 2,
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    })

    const [order] = orders

    if (!order)
      return res
        .status(404)
        .json({ error: 'No such order exists.' })

    // Mark order as paid
    await payload.update({
      collection: 'orders',
      data: {
        _isPaid: true,
      },
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    })

    // Send receipt email
    try {
      const data = await resend.emails.send({
        from: 'DigitalHippo <hello@joshtriedcoding.com>',
        to: [user.email],
        subject:
          'Thanks for your order! This is your receipt.',
        html: ReceiptEmailHtml({
          date: new Date(),
          email: user.email,
          orderId: session.metadata.orderId,
          products: order.products as Product[],
        }),
      })
      res.status(200).json({ data })
    } catch (error) {
      res.status(500).json({ error })
    }
  }

  return res.status(200).send()
}
```

USAGE NOTES:
- Verifies webhook signature for security
- Updates order status to paid
- Sends email receipt with Resend
- Handles only 'checkout.session.completed' event
- Metadata from checkout session links payment to order

---[FILE: Order Collection - Orders.ts]---
Location: src/collections/Orders.ts
Purpose: Payload CMS collection for orders

```typescript
import { Access, CollectionConfig } from 'payload/types'

const yourOwn: Access = ({ req: { user } }) => {
  if (user.role === 'admin') return true

  return {
    user: {
      equals: user?.id,
    },
  }
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'Your Orders',
    description:
      'A summary of all your orders on DigitalHippo.',
  },
  access: {
    read: yourOwn,
    update: ({ req }) => req.user.role === 'admin',
    delete: ({ req }) => req.user.role === 'admin',
    create: ({ req }) => req.user.role === 'admin',
  },
  fields: [
    {
      name: '_isPaid',
      type: 'checkbox',
      access: {
        read: ({ req }) => req.user.role === 'admin',
        create: () => false,
        update: () => false,
      },
      admin: {
        hidden: true,
      },
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      admin: {
        hidden: true,
      },
      relationTo: 'users',
      required: true,
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      hasMany: true,
    },
  ],
}
```

USAGE NOTES:
- Users can only read their own orders
- Only admins can create/update/delete orders
- _isPaid hidden from UI, set only by webhook
- Relationships to users and products collections

================================================================================
CONTINUED IN PART 4...
================================================================================

````
