---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 203
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 203 of 1290)

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

---[FILE: upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--PaymentMethod.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--PaymentMethod.create.1.json

```json
{
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
      "address_line1_check": "unchecked",
      "address_postal_code_check": "unchecked",
      "cvc_check": "unchecked"
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
  "customer": null,
  "id": "upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--Customer.retrieve.1.json",
  "livemode": false,
  "metadata": {},
  "object": "payment_method",
  "type": "card"
}
```

--------------------------------------------------------------------------------

---[FILE: upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--SetupIntent.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--SetupIntent.create.1.json

```json
{
  "application": null,
  "automatic_payment_methods": null,
  "cancellation_reason": null,
  "client_secret": "NORMALIZED",
  "created": 1000000000,
  "customer": "cus_NORMALIZED",
  "description": null,
  "excluded_payment_method_types": null,
  "flow_directions": null,
  "id": "upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--SetupIntent.create.1.json",
  "last_setup_error": null,
  "latest_attempt": "setatt_NORMALIZED",
  "livemode": false,
  "mandate": null,
  "metadata": {},
  "next_action": null,
  "object": "setup_intent",
  "on_behalf_of": null,
  "payment_method": "pm_NORMALIZED",
  "payment_method_configuration_details": null,
  "payment_method_options": {
    "card": {
      "mandate_options": null,
      "network": null,
      "request_three_d_secure": "automatic"
    }
  },
  "payment_method_types": [
    "card"
  ],
  "single_use_mandate": null,
  "status": "succeeded",
  "usage": "off_session"
}
```

--------------------------------------------------------------------------------

---[FILE: upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--SetupIntent.list.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--SetupIntent.list.1.json

```json
{
  "data": [
    {
      "application": null,
      "automatic_payment_methods": null,
      "cancellation_reason": null,
      "client_secret": "NORMALIZED",
      "created": 1000000000,
      "customer": "cus_NORMALIZED",
      "description": null,
      "excluded_payment_method_types": null,
      "flow_directions": null,
      "id": "upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--SetupIntent.list.1.json",
      "last_setup_error": null,
      "latest_attempt": null,
      "livemode": false,
      "mandate": null,
      "metadata": {},
      "next_action": null,
      "object": "setup_intent",
      "on_behalf_of": null,
      "payment_method": null,
      "payment_method_configuration_details": null,
      "payment_method_options": {
        "card": {
          "mandate_options": null,
          "network": null,
          "request_three_d_secure": "automatic"
        }
      },
      "payment_method_types": [
        "card"
      ],
      "single_use_mandate": null,
      "status": "requires_payment_method",
      "usage": "off_session"
    }
  ],
  "has_more": false,
  "object": "list",
  "url": "/v1/setup_intents"
}
```

--------------------------------------------------------------------------------

---[FILE: upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--SetupIntent.retrieve.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--SetupIntent.retrieve.1.json

```json
{
  "application": null,
  "automatic_payment_methods": null,
  "cancellation_reason": null,
  "client_secret": "NORMALIZED",
  "created": 1000000000,
  "customer": "cus_NORMALIZED",
  "description": null,
  "excluded_payment_method_types": null,
  "flow_directions": null,
  "id": "upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--SetupIntent.create.1.json",
  "last_setup_error": null,
  "latest_attempt": "setatt_NORMALIZED",
  "livemode": false,
  "mandate": null,
  "metadata": {},
  "next_action": null,
  "object": "setup_intent",
  "on_behalf_of": null,
  "payment_method": "pm_NORMALIZED",
  "payment_method_configuration_details": null,
  "payment_method_options": {
    "card": {
      "mandate_options": null,
      "network": null,
      "request_three_d_secure": "automatic"
    }
  },
  "payment_method_types": [
    "card"
  ],
  "single_use_mandate": null,
  "status": "succeeded",
  "usage": "off_session"
}
```

--------------------------------------------------------------------------------

---[FILE: upgrade_by_invoice--Charge.list.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_invoice--Charge.list.1.json

```json
{
  "data": [],
  "has_more": false,
  "object": "list",
  "url": "/v1/charges"
}
```

--------------------------------------------------------------------------------

---[FILE: upgrade_by_invoice--Customer.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_invoice--Customer.create.1.json

```json
{
  "address": null,
  "balance": 0,
  "created": 1000000000,
  "currency": null,
  "default_source": null,
  "delinquent": false,
  "description": "zulip (Zulip Dev)",
  "discount": null,
  "email": "hamlet@zulip.com",
  "id": "upgrade_by_invoice--Customer.create.1.json",
  "invoice_prefix": "NORMALIZED",
  "invoice_settings": {
    "custom_fields": null,
    "default_payment_method": null,
    "footer": null,
    "rendering_options": null
  },
  "livemode": false,
  "metadata": {
    "realm_id": "1",
    "realm_str": "zulip"
  },
  "name": null,
  "next_invoice_sequence": 1,
  "object": "customer",
  "phone": null,
  "preferred_locales": [],
  "shipping": null,
  "tax_exempt": "none",
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: upgrade_by_invoice--Customer.retrieve.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_invoice--Customer.retrieve.1.json

```json
{
  "address": null,
  "balance": 0,
  "created": 1000000000,
  "currency": null,
  "default_source": null,
  "delinquent": false,
  "description": "zulip (Zulip Dev)",
  "discount": null,
  "email": "hamlet@zulip.com",
  "id": "upgrade_by_invoice--Customer.create.1.json",
  "invoice_prefix": "NORMALIZED",
  "invoice_settings": {
    "custom_fields": null,
    "default_payment_method": null,
    "footer": null,
    "rendering_options": null
  },
  "livemode": false,
  "metadata": {
    "realm_id": "1",
    "realm_str": "zulip"
  },
  "name": null,
  "next_invoice_sequence": 1,
  "object": "customer",
  "phone": null,
  "preferred_locales": [],
  "shipping": null,
  "tax_exempt": "none",
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: upgrade_by_invoice--Customer.retrieve.2.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_invoice--Customer.retrieve.2.json

```json
{
  "address": null,
  "balance": 0,
  "created": 1000000000,
  "currency": "usd",
  "default_source": null,
  "delinquent": false,
  "description": "zulip (Zulip Dev)",
  "discount": null,
  "email": "hamlet@zulip.com",
  "id": "upgrade_by_invoice--Customer.create.1.json",
  "invoice_prefix": "NORMALIZED",
  "invoice_settings": {
    "custom_fields": null,
    "default_payment_method": null,
    "footer": null,
    "rendering_options": null
  },
  "livemode": false,
  "metadata": {
    "realm_id": "1",
    "realm_str": "zulip"
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

---[FILE: upgrade_by_invoice--Customer.retrieve.3.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_invoice--Customer.retrieve.3.json

```json
{
  "address": null,
  "balance": 0,
  "created": 1000000000,
  "currency": "usd",
  "default_source": null,
  "delinquent": false,
  "description": "zulip (Zulip Dev)",
  "discount": null,
  "email": "hamlet@zulip.com",
  "id": "upgrade_by_invoice--Customer.create.1.json",
  "invoice_prefix": "NORMALIZED",
  "invoice_settings": {
    "custom_fields": null,
    "default_payment_method": null,
    "footer": null,
    "rendering_options": null
  },
  "livemode": false,
  "metadata": {
    "realm_id": "1",
    "realm_str": "zulip"
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

---[FILE: upgrade_by_invoice--Event.list.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_invoice--Event.list.1.json

```json
{
  "data": [
    {
      "api_version": "2025-11-17.clover",
      "created": 1000000000,
      "data": {
        "object": {
          "account_country": "US",
          "account_name": "NORMALIZED",
          "account_tax_ids": null,
          "amount_due": 960000,
          "amount_overpaid": 0,
          "amount_paid": 0,
          "amount_remaining": 960000,
          "amount_shipping": 0,
          "application": null,
          "attempt_count": 0,
          "attempted": false,
          "auto_advance": true,
          "automatic_tax": {
            "disabled_reason": null,
            "enabled": false,
            "liability": null,
            "provider": null,
            "status": null
          },
          "automatically_finalizes_at": null,
          "billing_reason": "manual",
          "collection_method": "send_invoice",
          "created": 1000000000,
          "currency": "usd",
          "custom_fields": null,
          "customer": "cus_NORMALIZED",
          "customer_address": null,
          "customer_email": "hamlet@zulip.com",
          "customer_name": null,
          "customer_phone": null,
          "customer_shipping": null,
          "customer_tax_exempt": "none",
          "customer_tax_ids": [],
          "default_payment_method": null,
          "default_source": null,
          "default_tax_rates": [],
          "description": "If paying by bank transfer outside of the US, use the OUR option for who should pay bank transfer fees, to make sure that your invoice is paid in full.",
          "discounts": [],
          "due_date": 1000000000,
          "effective_at": 1000000000,
          "ending_balance": 0,
          "footer": null,
          "from_invoice": null,
          "hosted_invoice_url": "https://invoice.stripe.com/i/acct_NORMALIZED/test_NORMALIZED?s=ap",
          "id": "upgrade_by_invoice--Event.list.1.json",
          "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
          "issuer": {
            "type": "self"
          },
          "last_finalization_error": null,
          "latest_revision": null,
          "lines": {
            "data": [
              {
                "amount": 960000,
                "currency": "usd",
                "description": "Zulip Cloud Standard - renewal",
                "discount_amounts": [],
                "discountable": false,
                "discounts": [],
                "id": "upgrade_by_invoice--Event.list.1.json",
                "invoice": "upgrade_by_invoice--Event.list.1.json",
                "livemode": false,
                "metadata": {},
                "object": "line_item",
                "parent": {
                  "invoice_item_details": {
                    "invoice_item": "ii_NORMALIZED",
                    "proration": false,
                    "proration_details": {
                      "credited_items": null
                    },
                    "subscription": null
                  },
                  "subscription_item_details": null,
                  "type": "invoice_item_details"
                },
                "period": {
                  "end": 1420167845,
                  "start": 1388631845
                },
                "pretax_credit_amounts": [],
                "pricing": {
                  "price_details": {
                    "price": "price_NORMALIZED",
                    "product": "prod_NORMALIZED"
                  },
                  "type": "price_details",
                  "unit_amount_decimal": "8000"
                },
                "quantity": 120,
                "taxes": []
              }
            ],
            "has_more": false,
            "object": "list",
            "total_count": 1,
            "url": "/v1/invoices/upgrade_by_invoice--Event.list.1.json/lines"
          },
          "livemode": false,
          "metadata": {},
          "next_payment_attempt": null,
          "number": "NORMALIZED",
          "object": "invoice",
          "on_behalf_of": null,
          "parent": null,
          "payment_settings": {
            "default_mandate": null,
            "payment_method_options": null,
            "payment_method_types": null
          },
          "period_end": 1000000000,
          "period_start": 1000000000,
          "post_payment_credit_notes_amount": 0,
          "pre_payment_credit_notes_amount": 0,
          "receipt_number": null,
          "rendering": {
            "amount_tax_display": null,
            "pdf": {
              "page_size": "letter"
            },
            "template": null,
            "template_version": null
          },
          "shipping_cost": null,
          "shipping_details": null,
          "starting_balance": 0,
          "statement_descriptor": "Zulip Cloud Standard",
          "status": "open",
          "status_transitions": {
            "finalized_at": 1000000000,
            "marked_uncollectible_at": null,
            "paid_at": null,
            "voided_at": null
          },
          "subtotal": 960000,
          "subtotal_excluding_tax": 960000,
          "test_clock": null,
          "total": 960000,
          "total_discount_amounts": [],
          "total_excluding_tax": 960000,
          "total_pretax_credit_amounts": [],
          "total_taxes": [],
          "webhooks_delivered_at": 1000000000
        }
      },
      "id": "upgrade_by_invoice--Event.list.1.json",
      "livemode": false,
      "object": "event",
      "pending_webhooks": 0,
      "request": {
        "id": "upgrade_by_invoice--Event.list.1.json",
        "idempotency_key": "00000000-0000-0000-0000-000000000000"
      },
      "type": "invoice.finalized"
    }
  ],
  "has_more": true,
  "object": "list",
  "url": "/v1/events"
}
```

--------------------------------------------------------------------------------

````
