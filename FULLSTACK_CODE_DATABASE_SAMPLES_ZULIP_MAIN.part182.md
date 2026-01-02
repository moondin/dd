---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 182
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 182 of 1290)

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

---[FILE: switch_realm_from_standard_to_plus_plan--InvoiceItem.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/switch_realm_from_standard_to_plus_plan--InvoiceItem.create.1.json

```json
{
  "amount": 48000,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Cloud Standard",
  "discountable": false,
  "discounts": [],
  "id": "switch_realm_from_standard_to_plus_plan--Event.list.2.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 48000,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1357095845,
    "start": 1325473445
  },
  "pricing": {
    "price_details": {
      "price": "price_NORMALIZED",
      "product": "prod_NORMALIZED"
    },
    "type": "price_details",
    "unit_amount_decimal": "8000"
  },
  "proration": false,
  "quantity": 6,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: switch_realm_from_standard_to_plus_plan--InvoiceItem.create.2.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/switch_realm_from_standard_to_plus_plan--InvoiceItem.create.2.json

```json
{
  "amount": 120000,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Cloud Plus - renewal",
  "discountable": false,
  "discounts": [],
  "id": "switch_realm_from_standard_to_plus_plan--InvoiceItem.create.2.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 120000,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1000000000,
    "start": 1000000000
  },
  "pricing": {
    "price_details": {
      "price": "price_NORMALIZED",
      "product": "prod_NORMALIZED"
    },
    "type": "price_details",
    "unit_amount_decimal": "12000"
  },
  "proration": false,
  "quantity": 10,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: switch_realm_from_standard_to_plus_plan--PaymentMethod.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/switch_realm_from_standard_to_plus_plan--PaymentMethod.create.1.json

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
  "id": "switch_realm_from_standard_to_plus_plan--Customer.retrieve.1.json",
  "livemode": false,
  "metadata": {},
  "object": "payment_method",
  "type": "card"
}
```

--------------------------------------------------------------------------------

---[FILE: switch_realm_from_standard_to_plus_plan--SetupIntent.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/switch_realm_from_standard_to_plus_plan--SetupIntent.create.1.json

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
  "id": "switch_realm_from_standard_to_plus_plan--SetupIntent.create.1.json",
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

---[FILE: switch_realm_from_standard_to_plus_plan--SetupIntent.list.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/switch_realm_from_standard_to_plus_plan--SetupIntent.list.1.json

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
      "id": "switch_realm_from_standard_to_plus_plan--SetupIntent.list.1.json",
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

---[FILE: switch_realm_from_standard_to_plus_plan--SetupIntent.retrieve.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/switch_realm_from_standard_to_plus_plan--SetupIntent.retrieve.1.json

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
  "id": "switch_realm_from_standard_to_plus_plan--SetupIntent.create.1.json",
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

---[FILE: update_licenses_of_manual_plan_from_billing_page--Customer.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/update_licenses_of_manual_plan_from_billing_page--Customer.create.1.json

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
  "id": "update_licenses_of_manual_plan_from_billing_page--Customer.create.1.json",
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

---[FILE: update_licenses_of_manual_plan_from_billing_page--Customer.retrieve.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/update_licenses_of_manual_plan_from_billing_page--Customer.retrieve.1.json

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
  "id": "update_licenses_of_manual_plan_from_billing_page--Customer.create.1.json",
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

---[FILE: update_licenses_of_manual_plan_from_billing_page--Customer.retrieve.2.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/update_licenses_of_manual_plan_from_billing_page--Customer.retrieve.2.json

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
  "id": "update_licenses_of_manual_plan_from_billing_page--Customer.create.1.json",
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
  "next_invoice_sequence": 4,
  "object": "customer",
  "phone": null,
  "preferred_locales": [],
  "shipping": null,
  "tax_exempt": "none",
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: update_licenses_of_manual_plan_from_billing_page--Event.list.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/update_licenses_of_manual_plan_from_billing_page--Event.list.1.json

```json
{
  "data": [
    {
      "api_version": "2025-11-17.clover",
      "created": 1000000000,
      "data": {
        "object": {
          "amount": 984000,
          "amount_capturable": 0,
          "amount_details": {
            "tip": {}
          },
          "amount_received": 0,
          "application": null,
          "application_fee_amount": null,
          "automatic_payment_methods": null,
          "canceled_at": 1000000000,
          "cancellation_reason": "requested_by_customer",
          "capture_method": "automatic",
          "client_secret": "NORMALIZED",
          "confirmation_method": "automatic",
          "created": 1000000000,
          "currency": "usd",
          "customer": "cus_NORMALIZED",
          "description": "Payment for Invoice",
          "excluded_payment_method_types": null,
          "id": "update_licenses_of_manual_plan_from_billing_page--Event.list.1.json",
          "last_payment_error": null,
          "latest_charge": null,
          "livemode": false,
          "metadata": {},
          "next_action": null,
          "object": "payment_intent",
          "on_behalf_of": null,
          "payment_details": {
            "customer_reference": null,
            "order_reference": "in_1SVX00DwzgQ85STgjo66s8"
          },
          "payment_method": "pm_NORMALIZED",
          "payment_method_configuration_details": null,
          "payment_method_options": {
            "card": {
              "installments": null,
              "mandate_options": null,
              "network": null,
              "request_three_d_secure": "automatic"
            },
            "link": {
              "persistent_token": null
            }
          },
          "payment_method_types": [
            "card",
            "link"
          ],
          "processing": null,
          "receipt_email": "hamlet@zulip.com",
          "review": null,
          "setup_future_usage": null,
          "shipping": null,
          "source": null,
          "statement_descriptor": "Zulip Cloud Standard",
          "statement_descriptor_suffix": null,
          "status": "canceled",
          "transfer_data": null,
          "transfer_group": null
        }
      },
      "id": "update_licenses_of_manual_plan_from_billing_page--Event.list.1.json",
      "livemode": false,
      "object": "event",
      "pending_webhooks": 0,
      "request": {
        "id": "update_licenses_of_manual_plan_from_billing_page--Event.list.1.json",
        "idempotency_key": "00000000-0000-0000-0000-000000000000"
      },
      "type": "payment_intent.canceled"
    }
  ],
  "has_more": true,
  "object": "list",
  "url": "/v1/events"
}
```

--------------------------------------------------------------------------------

````
