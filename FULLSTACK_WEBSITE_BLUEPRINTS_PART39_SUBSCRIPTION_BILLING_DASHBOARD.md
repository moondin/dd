---
blueprint: "Subscription/Billing Dashboard (Stripe checkout + orders + receipts)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART3_ECOMMERCE_SOCIAL.md
  - FULLSTACK_CODE_DATABASE_PART2_TRPC_REALTIME.md
  - FULLSTACK_CODE_DATABASE_PART1_AUTHENTICATION.md
  - FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.part01.md
  - FULLSTACK_CODE_DATABASE_PART9_UTILITIES_HELPERS.part02.md
---

# Blueprint Part 39 — Subscription/Billing Dashboard

## Goal
A fullstack website where authenticated users can:
- manage a cart-like set of products/plans
- start a Stripe Checkout session
- land on a “thank you” page after successful payment
- view order/payment status

This blueprint stays within the Stripe + Payload + tRPC flow documented in Part 3.

## Architecture (As Documented)
- API layer: tRPC router + protected procedure patterns (Part 2)
- Billing: Stripe SDK initialization and Checkout Session creation (Part 3)
- Orders: create an unpaid order before redirect; mark paid in webhook handler (Part 3)
- UI: reusable components (Part 7) + snackbar notifications (Part 9)

## Core Routes / Screens
- Plans page
  - list available products (from Payload CMS pattern in Part 3)
  - add/remove from cart (Zustand cart pattern in Part 3)
- Checkout
  - call `paymentRouter.createSession` (Part 3) via tRPC
  - redirect to Stripe
- Thank-you page
  - reads `orderId` from query string (Part 3 success_url pattern)
  - shows paid/unpaid status
- Orders page
  - DataTable list of orders and their status

## Notes / Constraints
- This blueprint uses the digital-product ecommerce flow exactly as documented; it does not assume Stripe customer portal features unless they’re present in Part 3.
- Email receipts are mentioned in Part 3; implement only the patterns shown there.
