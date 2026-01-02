---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 160
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 160 of 1290)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - zulip-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/zulip-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: stripe_billing_portal_urls_for_remote_server--Event.list.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/stripe_billing_portal_urls_for_remote_server--Event.list.1.json

```json
{
  "data": [
    {
      "api_version": "2025-11-17.clover",
      "created": 1000000000,
      "data": {
        "object": {
          "amount_paid": 176000,
          "amount_requested": 176000,
          "created": 1000000000,
          "currency": "usd",
          "id": "stripe_billing_portal_urls_for_remote_server--Event.list.1.json",
          "invoice": "in_NORMALIZED",
          "is_default": true,
          "livemode": false,
          "object": "invoice_payment",
          "payment": {
            "payment_intent": "pi_NORMALIZED",
            "type": "payment_intent"
          },
          "status": "paid",
          "status_transitions": {
            "canceled_at": null,
            "paid_at": 1000000000
          }
        }
      },
      "id": "stripe_billing_portal_urls_for_remote_server--Event.list.1.json",
      "livemode": false,
      "object": "event",
      "pending_webhooks": 0,
      "request": {
        "id": null,
        "idempotency_key": null
      },
      "type": "invoice_payment.paid"
    }
  ],
  "has_more": true,
  "object": "list",
  "url": "/v1/events"
}
```

--------------------------------------------------------------------------------

````
