---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 230
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 230 of 1290)

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

---[FILE: upgrade_user_to_business_plan--Customer.retrieve.7.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_user_to_business_plan--Customer.retrieve.7.json

```json
{
  "address": null,
  "balance": 0,
  "created": 1000000000,
  "currency": "usd",
  "default_source": null,
  "delinquent": false,
  "description": "zulip.testserver 696c2d4f-86b",
  "discount": null,
  "email": "hamlet@zulip.com",
  "id": "upgrade_user_to_business_plan--Customer.create.1.json",
  "invoice_prefix": "NORMALIZED",
  "invoice_settings": {
    "custom_fields": null,
    "default_payment_method": {
      "allow_redisplay": "unspecified",
      "billing_details": {
        "address": {
          "city": "San Francisco",
          "country": "US",
          "line1": "123 Main St",
          "line2": null,
          "postal_code": "12345",
          "state": "CA"
        },
        "email": null,
        "name": "John Doe",
        "phone": null,
        "tax_id": null
      },
      "card": {
        "brand": "visa",
        "checks": {
          "address_line1_check": "pass",
          "address_postal_code_check": "pass",
          "cvc_check": "pass"
        },
        "country": "US",
        "display_brand": "visa",
        "exp_month": 1,
        "exp_year": 9999,
        "fingerprint": "NORMALIZED",
        "funding": "credit",
        "generated_from": null,
        "last4": "4242",
        "networks": {
          "available": [
            "visa"
          ],
          "preferred": null
        },
        "regulated_status": "unregulated",
        "three_d_secure_usage": {
          "supported": true
        },
        "wallet": null
      },
      "created": 1000000000,
      "customer": "upgrade_user_to_business_plan--Customer.create.1.json",
      "id": "upgrade_user_to_business_plan--Customer.retrieve.1.json",
      "livemode": false,
      "metadata": {},
      "object": "payment_method",
      "type": "card"
    },
    "footer": null,
    "rendering_options": null
  },
  "livemode": false,
  "metadata": {
    "remote_realm_host": "zulip.testserver",
    "remote_realm_uuid": "696c2d4f-86ba-44c0-9137-8d2908ba59b6"
  },
  "name": null,
  "next_invoice_sequence": 2,
  "object": "customer",
  "phone": null,
  "preferred_locales": [],
  "shipping": null,
  "tax_exempt": "none",
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: upgrade_user_to_business_plan--Event.list.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_user_to_business_plan--Event.list.1.json

```json
{
  "data": [
    {
      "api_version": "2025-11-17.clover",
      "created": 1000000000,
      "data": {
        "object": {
          "address": null,
          "balance": 0,
          "created": 1000000000,
          "currency": null,
          "default_source": null,
          "delinquent": false,
          "description": "zulip.testserver 696c2d4f-86b",
          "discount": null,
          "email": "hamlet@zulip.com",
          "id": "upgrade_user_to_business_plan--Customer.create.1.json",
          "invoice_prefix": "NORMALIZED",
          "invoice_settings": {
            "custom_fields": null,
            "default_payment_method": "pm_NORMALIZED",
            "footer": null,
            "rendering_options": null
          },
          "livemode": false,
          "metadata": {
            "remote_realm_host": "zulip.testserver",
            "remote_realm_uuid": "696c2d4f-86ba-44c0-9137-8d2908ba59b6"
          },
          "name": null,
          "next_invoice_sequence": 1,
          "object": "customer",
          "phone": null,
          "preferred_locales": [],
          "shipping": null,
          "tax_exempt": "none",
          "test_clock": null
        },
        "previous_attributes": {
          "invoice_settings": {
            "default_payment_method": null
          }
        }
      },
      "id": "upgrade_user_to_business_plan--Event.list.1.json",
      "livemode": false,
      "object": "event",
      "pending_webhooks": 0,
      "request": {
        "id": "upgrade_user_to_business_plan--Event.list.1.json",
        "idempotency_key": "00000000-0000-0000-0000-000000000000"
      },
      "type": "customer.updated"
    }
  ],
  "has_more": true,
  "object": "list",
  "url": "/v1/events"
}
```

--------------------------------------------------------------------------------

````
