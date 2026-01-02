---
blueprint: "Ecommerce Store for Digital Products"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART3_ECOMMERCE_SOCIAL.md
  - FULLSTACK_CODE_DATABASE_PART5_UPLOADS_EXTRAS.md
  - FULLSTACK_CODE_DATABASE_PART8_HOOKS_ADVANCED.md
---

# Blueprint Part 27 — Ecommerce Store for Digital Products

## Goal
An ecommerce site for digital goods with:
- product catalog managed in Payload CMS
- cart stored client-side
- Stripe Checkout session creation
- webhook-driven order fulfillment
- “thank you” page polling order payment status

## Stack (As Documented)
- Next.js + tRPC
- Payload CMS for products/orders
- Stripe SDK
- Zustand cart persistence (localStorage)

## Key Backend Pieces
### Stripe
From Part 3:
- initialize Stripe with `STRIPE_SECRET_KEY`

### Checkout
From Part 3 payment router:
- `createSession(productIds[])`:
  - load products via Payload
  - create an unpaid order
  - create Stripe checkout session
  - return redirect URL

### Post-payment Confirmation
From Part 3:
- `pollOrderStatus(orderId)` returns `{ isPaid }`
- webhook handler sets `_isPaid: true` on order

## Frontend Pieces
### Cart
From Part 3 `useCart`:
- `addItem(product)` / `removeItem(productId)` / `clearCart()`
- persisted to localStorage

### Pages
- `/cart`
  - list cart items from Zustand
  - button to call `createSession` and redirect
- `/thank-you?orderId=...`
  - polls `pollOrderStatus`

## Uploads (Optional)
If your digital products include user-generated images (e.g., seller avatars), use UploadThing patterns from Part 5.

## Notes / Constraints
- This blueprint is grounded in the DigitalHippo patterns captured in Part 3.
- It does not assume additional inventory, shipping, or coupon systems unless documented.
