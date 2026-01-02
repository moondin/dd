# FULLSTACK WEBSITE TYPES - PART 03: E-COMMERCE & MARKETPLACE

**Category:** E-commerce & Marketplace  
**Total Types:** 7  
**Complexity:** Medium to High  
**Database References:** PART1, PART3 (Complete Stripe integration), PART5 (File uploads)

---

## 📋 WEBSITE TYPES IN THIS CATEGORY

1. [Digital Products Store](#1-digital-products-store)
2. [Physical Products E-commerce](#2-physical-products-ecommerce)
3. [Subscription/SaaS Platform](#3-subscription-saas-platform)
4. [Marketplace (Multi-vendor)](#4-marketplace-multi-vendor)
5. [Auction Platform](#5-auction-platform)
6. [Booking/Reservation System](#6-booking-reservation-system)
7. [Donation/Crowdfunding Platform](#7-donation-crowdfunding-platform)

---

## 1. DIGITAL PRODUCTS STORE

### Description
E-commerce platform for selling digital products (ebooks, courses, software, templates) with instant delivery after purchase.

### Tech Stack
- **Framework:** Next.js 14+ + TypeScript
- **Auth:** NextAuth or Better Auth
- **Database:** PostgreSQL + Prisma/Drizzle
- **Payments:** Stripe
- **Storage:** S3 or UploadThing (for product files)
- **CMS:** Payload CMS
- **Email:** Resend

### Database Parts
- **Core:** PART1 (Auth), PART3 (Complete Stripe + Payload implementation)
- **Additional:** PART5 (File uploads), PART7 (UI)

### Complete Project Scaffold (from PART3 - DigitalHippo)

```
digital-store/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   └── verify-email/
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── product/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── thank-you/
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── trpc/[trpc]/
│   │   │   └── webhooks/
│   │   │       └── stripe/
│   │   │           └── route.ts
│   │   └── page.tsx
│   ├── collections/             # Payload CMS collections
│   │   ├── Products.ts
│   │   ├── Orders.ts
│   │   ├── ProductFiles.ts
│   │   ├── Users.ts
│   │   └── Media.ts
│   ├── components/
│   │   ├── cart/
│   │   │   ├── cart-item.tsx
│   │   │   └── cart.tsx
│   │   ├── product/
│   │   │   ├── product-card.tsx
│   │   │   ├── product-listing.tsx
│   │   │   └── product-reel.tsx
│   │   ├── email/
│   │   │   ├── receipt-email.tsx
│   │   │   └── verification-email.tsx
│   │   └── checkout/
│   │       └── payment-status.tsx
│   ├── hooks/
│   │   ├── use-cart.ts
│   │   └── use-auth.ts
│   ├── lib/
│   │   ├── stripe.ts
│   │   ├── payload.ts
│   │   └── validators/
│   │       ├── account-credentials-validator.ts
│   │       └── query-validator.ts
│   ├── trpc/
│   │   ├── index.ts
│   │   ├── client.ts
│   │   └── routers/
│   │       ├── payment-router.ts
│   │       ├── auth-router.ts
│   │       └── product-router.ts
│   └── payload.config.ts
├── public/
├── .env
└── package.json
```

### Payload CMS Collections

```typescript
// collections/Products.ts
import { CollectionConfig } from 'payload/types'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user.role === 'admin',
    update: ({ req: { user } }) => user.role === 'admin',
    delete: ({ req: { user } }) => user.role === 'admin',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Product details',
    },
    {
      name: 'price',
      label: 'Price in USD',
      min: 0,
      max: 1000,
      type: 'number',
      required: true,
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      options: [
        {
          label: 'UI Kits',
          value: 'ui_kits',
        },
        {
          label: 'Icons',
          value: 'icons',
        },
      ],
      required: true,
    },
    {
      name: 'product_files',
      label: 'Product file(s)',
      type: 'relationship',
      required: true,
      relationTo: 'product_files',
      hasMany: false,
    },
    {
      name: 'approvedForSale',
      label: 'Product Status',
      type: 'select',
      defaultValue: 'pending',
      access: {
        create: ({ req }) => req.user.role === 'admin',
        read: ({ req }) => req.user.role === 'admin',
        update: ({ req }) => req.user.role === 'admin',
      },
      options: [
        {
          label: 'Pending verification',
          value: 'pending',
        },
        {
          label: 'Approved',
          value: 'approved',
        },
        {
          label: 'Denied',
          value: 'denied',
        },
      ],
    },
    {
      name: 'priceId',
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'stripeId',
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Product images',
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}

// collections/Orders.ts
export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'Your Orders',
    description: 'A summary of all your orders on DigitalHippo.',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user.role === 'admin') return true
      return {
        user: {
          equals: user?.id,
        },
      }
    },
    create: () => false,
    update: () => false,
    delete: () => false,
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

### Complete Stripe Payment Router (from PART3)

```typescript
// trpc/routers/payment-router.ts
import { z } from 'zod'
import { privateProcedure, publicProcedure, router } from '../trpc'
import { TRPCError } from '@trpc/server'
import { getPayloadClient } from '../../get-payload'
import { stripe } from '../../lib/stripe'

export const paymentRouter = router({
  createSession: privateProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx
      let { productIds } = input

      if (productIds.length === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      const payload = await getPayloadClient()

      const { docs: products } = await payload.find({
        collection: 'products',
        where: {
          id: {
            in: productIds,
          },
        },
      })

      const filteredProducts = products.filter((prod) => Boolean(prod.priceId))

      const order = await payload.create({
        collection: 'orders',
        data: {
          _isPaid: false,
          products: filteredProducts.map((prod) => prod.id),
          user: user.id,
        },
      })

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

      filteredProducts.forEach((product) => {
        line_items.push({
          price: product.priceId!,
          quantity: 1,
        })
      })

      line_items.push({
        price: 'price_1234567890', // Transaction fee
        quantity: 1,
        adjustable_quantity: {
          enabled: false,
        },
      })

      try {
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          payment_method_types: ['card'],
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

### Stripe Webhook Handler (from PART3)

```typescript
// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

import { stripe } from '@/lib/stripe'
import { getPayloadClient } from '@/get-payload'
import { Resend } from 'resend'
import { ReceiptEmailHtml } from '@/components/emails/ReceiptEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature') ?? ''

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err) {
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`,
      { status: 400 }
    )
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (!session?.metadata?.userId || !session?.metadata?.orderId) {
    return new Response(null, { status: 200 })
  }

  if (event.type === 'checkout.session.completed') {
    const payload = await getPayloadClient()

    const { docs: users } = await payload.find({
      collection: 'users',
      where: {
        id: {
          equals: session.metadata.userId,
        },
      },
    })

    const [user] = users

    if (!user) return new Response('No such user exists.', { status: 404 })

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

    if (!order) return new Response('No such order exists.', { status: 404 })

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
        subject: 'Thanks for your order! This is your receipt.',
        html: ReceiptEmailHtml({
          date: new Date(),
          email: user.email,
          orderId: session.metadata.orderId,
          products: order.products as any,
        }),
      })
    } catch (error) {
      return new Response(
        JSON.stringify({ error }),
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ result: event, ok: true })
}
```

### Cart Hook with Zustand

```typescript
// hooks/use-cart.ts
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { Product } from '@/payload-types'

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
          items: state.items.filter((item) => item.product.id !== id),
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

### Estimated Build Time
- **MVP:** 3-4 weeks
- **Production:** 6-8 weeks

### Key Features
- Product catalog with categories
- Shopping cart
- Secure checkout (Stripe)
- Instant digital delivery
- Order history
- Email receipts
- Admin dashboard (Payload CMS)
- File versioning
- License management

---

## 2. PHYSICAL PRODUCTS E-COMMERCE

### Description
Full e-commerce platform for physical goods with inventory management, shipping integration, and order tracking.

### Tech Stack
Same as Digital Products Store plus:
- **Shipping:** Shippo, ShipStation, or EasyPost
- **Inventory:** Real-time stock tracking
- **Tax:** Stripe Tax or TaxJar

### Additional Schema

```typescript
export const inventory = pgTable("inventory", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  sku: text("sku").notNull().unique(),
  quantity: integer("quantity").notNull().default(0),
  reorderPoint: integer("reorder_point").default(10),
  warehouse: text("warehouse").default("main"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const shipments = pgTable("shipments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id).notNull(),
  carrier: text("carrier").notNull(), // USPS, FedEx, UPS
  trackingNumber: text("tracking_number"),
  status: text("status").default("pending"), // pending, shipped, in_transit, delivered
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
  shippingLabel: text("shipping_label_url"),
})

export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // shipping, billing
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  addressLine1: text("address_line1").notNull(),
  addressLine2: text("address_line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),
  phone: text("phone"),
  isDefault: boolean("is_default").default(false),
})
```

### Estimated Build Time
- **MVP:** 4-6 weeks
- **Production:** 8-12 weeks

---

## 3. SUBSCRIPTION/SAAS PLATFORM

### Description
Recurring billing platform for SaaS products with multiple subscription tiers, usage tracking, and billing management.

### Tech Stack
- **Framework:** Next.js 14+
- **Auth:** Better Auth (from PART1)
- **Database:** PostgreSQL + Drizzle
- **Payments:** Stripe Billing
- **API:** tRPC

### Complete Subscription Schema

```typescript
export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "free", "starter", "pro", "enterprise"
])

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active", "past_due", "canceled", "incomplete", "trialing"
])

export const subscriptionTiers = pgTable("subscription_tiers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  tier: subscriptionTierEnum("tier").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),
  priceMonthly: integer("price_monthly").notNull(), // in cents
  priceYearly: integer("price_yearly").notNull(),
  
  // Feature limits
  maxProjects: integer("max_projects").default(999999),
  maxMembers: integer("max_members").default(999999),
  maxStorage: integer("max_storage_gb").default(999999),
  
  features: text("features").array(), // JSON array of feature names
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull().unique(),
  
  tier: subscriptionTierEnum("tier").notNull().default("free"),
  status: subscriptionStatusEnum("status").notNull(),
  
  // Stripe IDs
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripePriceId: text("stripe_price_id"),
  
  // Billing
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  canceledAt: timestamp("canceled_at"),
  
  // Trial
  trialStart: timestamp("trial_start"),
  trialEnd: timestamp("trial_end"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const usageTracking = pgTable("usage_tracking", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  // Usage metrics
  projectsUsed: integer("projects_used").default(0),
  membersUsed: integer("members_used").default(0),
  storageUsedGb: integer("storage_used_gb").default(0),
  apiCallsThisMonth: integer("api_calls_this_month").default(0),
  
  month: timestamp("month").notNull(),
  
  @@unique([userId, month])
})

export const invoices = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  subscriptionId: uuid("subscription_id").references(() => subscriptions.id),
  
  stripeInvoiceId: text("stripe_invoice_id").notNull().unique(),
  status: text("status").notNull(), // draft, open, paid, uncollectible, void
  
  amountDue: integer("amount_due").notNull(),
  amountPaid: integer("amount_paid").notNull(),
  currency: text("currency").default("usd"),
  
  invoicePdf: text("invoice_pdf"),
  hostedInvoiceUrl: text("hosted_invoice_url"),
  
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
```

### Stripe Subscription Management

```typescript
// lib/subscription.ts
import { stripe } from './stripe'
import { db } from '@/db'
import { subscriptions, users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function createSubscription(userId: string, priceId: string) {
  // Get or create Stripe customer
  const [user] = await db.select().from(users).where(eq(users.id, userId))
  
  let customerId = user.stripeCustomerId
  
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        userId: user.id,
      },
    })
    customerId = customer.id
    
    await db.update(users)
      .set({ stripeCustomerId: customerId })
      .where(eq(users.id, userId))
  }
  
  // Create subscription
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
    trial_period_days: 14, // 14-day trial
  })
  
  // Save to database
  await db.insert(subscriptions).values({
    userId,
    status: 'trialing',
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceId,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
    trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
  })
  
  return subscription
}

export async function cancelSubscription(userId: string, immediately = false) {
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
  
  if (!subscription.stripeSubscriptionId) {
    throw new Error('No active subscription')
  }
  
  if (immediately) {
    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId)
    await db.update(subscriptions)
      .set({ 
        status: 'canceled',
        canceledAt: new Date(),
      })
      .where(eq(subscriptions.userId, userId))
  } else {
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    })
    await db.update(subscriptions)
      .set({ cancelAtPeriodEnd: true })
      .where(eq(subscriptions.userId, userId))
  }
}

export async function resumeSubscription(userId: string) {
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
  
  await stripe.subscriptions.update(subscription.stripeSubscriptionId!, {
    cancel_at_period_end: false,
  })
  
  await db.update(subscriptions)
    .set({ cancelAtPeriodEnd: false })
    .where(eq(subscriptions.userId, userId))
}
```

### Estimated Build Time
- **MVP:** 4-6 weeks
- **Production:** 8-10 weeks

---

## 4-7. ADDITIONAL E-COMMERCE TYPES

### 4. Marketplace (Multi-vendor)
- **Stack:** Next.js + Stripe Connect + PostgreSQL
- **Build Time:** 12-16 weeks
- **Key:** Vendor dashboards, commission system, escrow
- **DB Parts:** PART1, PART3 (extend with vendor tables)

### 5. Auction Platform
- **Stack:** Next.js + Real-time bidding + PostgreSQL
- **Build Time:** 8-12 weeks
- **Key:** Real-time bids, auto-bidding, escrow
- **DB Parts:** PART1, PART2 (WebSockets), PART3

### 6. Booking/Reservation System
- **Stack:** Next.js + Calendar + Stripe + PostgreSQL
- **Build Time:** 6-10 weeks
- **Key:** Availability calendar, time slots, reminders
- **DB Parts:** PART1, PART3

### 7. Donation/Crowdfunding Platform
- **Stack:** Next.js + Stripe + PostgreSQL
- **Build Time:** 6-8 weeks
- **Key:** Campaign progress, recurring donations, rewards
- **DB Parts:** PART1, PART3

---

**Next:** [PART 04 - Content & Media Platforms →](FULLSTACK_WEBSITE_TYPES_PART04_CONTENT_MEDIA.md)
