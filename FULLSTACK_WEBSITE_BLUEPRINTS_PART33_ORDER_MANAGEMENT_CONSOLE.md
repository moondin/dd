---
blueprint: "Order Management Console (Stripe orders + admin workflows)"
created_utc: 2025-12-17T00:00:00Z
depends_on:
  - FULLSTACK_CODE_DATABASE_PART3_ECOMMERCE_SOCIAL.md
  - FULLSTACK_CODE_DATABASE_PART7_UI_COMPONENTS.part01.md
  - FULLSTACK_CODE_DATABASE_PART5_UPLOADS_EXTRAS.md
  - FULLSTACK_CODE_DATABASE_PART9_UTILITIES_HELPERS.part02.md
---

# Blueprint Part 33 — Order Management Console

## Goal
An internal console for managing ecommerce orders, built around the order lifecycle documented in the Stripe + Payload flow:
- view orders
- view payment status
- reconcile webhook updates

## Backend (As Documented)
From Part 3:
- orders are created unpaid before checkout
- webhook handler marks `_isPaid: true`
- thank-you page polls order status

Console backend requirements (pattern-level):
- an authenticated endpoint/query to list orders from Payload CMS
- an endpoint/query to fetch a single order and its `_isPaid` status

## UI (Part 7)
- Orders list:
  - DataTable + Pagination
  - columns: Order ID, Customer, CreatedAt, Paid
- Order detail:
  - show products
  - show payment status

## Uploads (Optional)
From Part 5:
- if customer support staff attach images/receipts, use UploadThing authenticated upload endpoint.

## Notifications
Use SnackBar context (Part 9) for:
- webhook mismatch warnings
- manual refresh successes

## Notes / Constraints
- This blueprint is strictly tied to the Stripe/Payload order patterns already documented.
- It does not add shipping/fulfillment logic unless you document it in the database later.
