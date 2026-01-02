---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 140
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 140 of 1290)

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

---[FILE: schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--Invoice.pay.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--Invoice.pay.1.json

```json
{
  "account_country": "US",
  "account_name": "NORMALIZED",
  "account_tax_ids": null,
  "amount_due": 10000,
  "amount_overpaid": 0,
  "amount_paid": 10000,
  "amount_remaining": 0,
  "amount_shipping": 0,
  "application": null,
  "attempt_count": 1,
  "attempted": true,
  "auto_advance": false,
  "automatic_tax": {
    "disabled_reason": null,
    "enabled": false,
    "liability": null,
    "provider": null,
    "status": null
  },
  "automatically_finalizes_at": null,
  "billing_reason": "manual",
  "collection_method": "charge_automatically",
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
  "due_date": null,
  "effective_at": 1000000000,
  "ending_balance": 0,
  "footer": null,
  "from_invoice": null,
  "hosted_invoice_url": "https://invoice.stripe.com/i/acct_NORMALIZED/test_NORMALIZED?s=ap",
  "id": "schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--Event.list.2.json",
  "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
  "issuer": {
    "type": "self"
  },
  "last_finalization_error": null,
  "latest_revision": null,
  "lines": {
    "data": [
      {
        "amount": 10000,
        "currency": "usd",
        "description": "Zulip Basic",
        "discount_amounts": [],
        "discountable": false,
        "discounts": [],
        "id": "schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--Event.list.2.json",
        "invoice": "schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--Event.list.2.json",
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
          "end": 1357095845,
          "start": 1325473445
        },
        "pretax_credit_amounts": [],
        "pricing": {
          "price_details": {
            "price": "price_NORMALIZED",
            "product": "prod_NORMALIZED"
          },
          "type": "price_details",
          "unit_amount_decimal": "10000"
        },
        "quantity": 1,
        "taxes": []
      }
    ],
    "has_more": false,
    "object": "list",
    "total_count": 1,
    "url": "/v1/invoices/schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--Event.list.2.json/lines"
  },
  "livemode": false,
  "metadata": {
    "billing_schedule": "2",
    "current_plan_id": "None",
    "license_management": "automatic",
    "licenses": "11",
    "on_free_trial": "False",
    "plan_tier": "103"
  },
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
  "statement_descriptor": "Zulip Basic",
  "status": "paid",
  "status_transitions": {
    "finalized_at": 1000000000,
    "marked_uncollectible_at": null,
    "paid_at": 1000000000,
    "voided_at": null
  },
  "subtotal": 10000,
  "subtotal_excluding_tax": 10000,
  "test_clock": null,
  "total": 10000,
  "total_discount_amounts": [],
  "total_excluding_tax": 10000,
  "total_pretax_credit_amounts": [],
  "total_taxes": [],
  "webhooks_delivered_at": 1000000000
}
```

--------------------------------------------------------------------------------

---[FILE: schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.1.json

```json
{
  "amount": 10000,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Basic",
  "discountable": false,
  "discounts": [],
  "id": "schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--Event.list.2.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 10000,
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
    "unit_amount_decimal": "10000"
  },
  "proration": false,
  "quantity": 1,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.10.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.10.json

```json
{
  "amount": 10000,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Basic - renewal",
  "discountable": false,
  "discounts": [],
  "id": "schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.10.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 10000,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1351825445,
    "start": 1349147045
  },
  "pricing": {
    "price_details": {
      "price": "price_NORMALIZED",
      "product": "prod_NORMALIZED"
    },
    "type": "price_details",
    "unit_amount_decimal": "10000"
  },
  "proration": false,
  "quantity": 1,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.11.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.11.json

```json
{
  "amount": 10000,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Basic - renewal",
  "discountable": false,
  "discounts": [],
  "id": "schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.11.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 10000,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1354417445,
    "start": 1351825445
  },
  "pricing": {
    "price_details": {
      "price": "price_NORMALIZED",
      "product": "prod_NORMALIZED"
    },
    "type": "price_details",
    "unit_amount_decimal": "10000"
  },
  "proration": false,
  "quantity": 1,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.12.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.12.json

```json
{
  "amount": 10000,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Basic - renewal",
  "discountable": false,
  "discounts": [],
  "id": "schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.12.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 10000,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1357095845,
    "start": 1354417445
  },
  "pricing": {
    "price_details": {
      "price": "price_NORMALIZED",
      "product": "prod_NORMALIZED"
    },
    "type": "price_details",
    "unit_amount_decimal": "10000"
  },
  "proration": false,
  "quantity": 1,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.13.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.13.json

```json
{
  "amount": 14166,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Basic - renewal",
  "discountable": false,
  "discounts": [],
  "id": "schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.13.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 14166,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1359774245,
    "start": 1357095845
  },
  "pricing": {
    "price_details": {
      "price": "price_NORMALIZED",
      "product": "prod_NORMALIZED"
    },
    "type": "price_details",
    "unit_amount_decimal": "14166"
  },
  "proration": false,
  "quantity": 1,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.2.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.2.json

```json
{
  "amount": 10000,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Basic - renewal",
  "discountable": false,
  "discounts": [],
  "id": "schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.2.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 10000,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1330657445,
    "start": 1328151845
  },
  "pricing": {
    "price_details": {
      "price": "price_NORMALIZED",
      "product": "prod_NORMALIZED"
    },
    "type": "price_details",
    "unit_amount_decimal": "10000"
  },
  "proration": false,
  "quantity": 1,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.3.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.3.json

```json
{
  "amount": 10000,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Basic - renewal",
  "discountable": false,
  "discounts": [],
  "id": "schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.3.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 10000,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1333335845,
    "start": 1330657445
  },
  "pricing": {
    "price_details": {
      "price": "price_NORMALIZED",
      "product": "prod_NORMALIZED"
    },
    "type": "price_details",
    "unit_amount_decimal": "10000"
  },
  "proration": false,
  "quantity": 1,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.4.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.4.json

```json
{
  "amount": 10000,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Basic - renewal",
  "discountable": false,
  "discounts": [],
  "id": "schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.4.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 10000,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1335927845,
    "start": 1333335845
  },
  "pricing": {
    "price_details": {
      "price": "price_NORMALIZED",
      "product": "prod_NORMALIZED"
    },
    "type": "price_details",
    "unit_amount_decimal": "10000"
  },
  "proration": false,
  "quantity": 1,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.5.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.5.json

```json
{
  "amount": 10000,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Basic - renewal",
  "discountable": false,
  "discounts": [],
  "id": "schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.5.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 10000,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1338606245,
    "start": 1335927845
  },
  "pricing": {
    "price_details": {
      "price": "price_NORMALIZED",
      "product": "prod_NORMALIZED"
    },
    "type": "price_details",
    "unit_amount_decimal": "10000"
  },
  "proration": false,
  "quantity": 1,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.6.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.6.json

```json
{
  "amount": 10000,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Basic - renewal",
  "discountable": false,
  "discounts": [],
  "id": "schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.6.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 10000,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1341198245,
    "start": 1338606245
  },
  "pricing": {
    "price_details": {
      "price": "price_NORMALIZED",
      "product": "prod_NORMALIZED"
    },
    "type": "price_details",
    "unit_amount_decimal": "10000"
  },
  "proration": false,
  "quantity": 1,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.7.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.7.json

```json
{
  "amount": 10000,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Basic - renewal",
  "discountable": false,
  "discounts": [],
  "id": "schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.7.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 10000,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1343876645,
    "start": 1341198245
  },
  "pricing": {
    "price_details": {
      "price": "price_NORMALIZED",
      "product": "prod_NORMALIZED"
    },
    "type": "price_details",
    "unit_amount_decimal": "10000"
  },
  "proration": false,
  "quantity": 1,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.8.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.8.json

```json
{
  "amount": 10000,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Basic - renewal",
  "discountable": false,
  "discounts": [],
  "id": "schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.8.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 10000,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1346555045,
    "start": 1343876645
  },
  "pricing": {
    "price_details": {
      "price": "price_NORMALIZED",
      "product": "prod_NORMALIZED"
    },
    "type": "price_details",
    "unit_amount_decimal": "10000"
  },
  "proration": false,
  "quantity": 1,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.9.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.9.json

```json
{
  "amount": 10000,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Basic - renewal",
  "discountable": false,
  "discounts": [],
  "id": "schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--InvoiceItem.create.9.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 10000,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1349147045,
    "start": 1346555045
  },
  "pricing": {
    "price_details": {
      "price": "price_NORMALIZED",
      "product": "prod_NORMALIZED"
    },
    "type": "price_details",
    "unit_amount_decimal": "10000"
  },
  "proration": false,
  "quantity": 1,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--PaymentMethod.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--PaymentMethod.create.1.json

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
  "id": "schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--Customer.retrieve.1.json",
  "livemode": false,
  "metadata": {},
  "object": "payment_method",
  "type": "card"
}
```

--------------------------------------------------------------------------------

---[FILE: schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--SetupIntent.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--SetupIntent.create.1.json

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
  "id": "schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--SetupIntent.create.1.json",
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

---[FILE: schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--SetupIntent.list.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--SetupIntent.list.1.json

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
      "id": "schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--SetupIntent.list.1.json",
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

---[FILE: schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--SetupIntent.retrieve.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--SetupIntent.retrieve.1.json

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
  "id": "schedule_fixed_price_plan_upgrade_to_another_fixed_price_plan--SetupIntent.create.1.json",
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

---[FILE: schedule_server_complimentary_access_plan_upgrade_to_fixed_price_plan--checkout.Session.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_server_complimentary_access_plan_upgrade_to_fixed_price_plan--checkout.Session.create.1.json

```json
{
  "adaptive_pricing": {
    "enabled": false
  },
  "after_expiration": null,
  "allow_promotion_codes": null,
  "amount_subtotal": null,
  "amount_total": null,
  "automatic_tax": {
    "enabled": false,
    "liability": null,
    "provider": null,
    "status": null
  },
  "billing_address_collection": "required",
  "branding_settings": {
    "background_color": "#dbedff",
    "border_style": "rounded",
    "button_color": "#3e6bfe",
    "display_name": "Violet Beam",
    "font_family": "source_sans_pro",
    "icon": {
      "file": "file_1RxpnoDwzgQ85STgf3bBl5KY",
      "type": "file"
    },
    "logo": {
      "file": "file_1RxpnoDwzgQ85STgvEm4ntJu",
      "type": "file"
    }
  },
  "cancel_url": "http://selfhosting.testserver/server/6cde5f7a-1f7e-4978-9716-49f69ebfc9fe/upgrade/?manual_license_management=false&tier=1",
  "client_reference_id": null,
  "client_secret": null,
  "collected_information": {
    "business_name": null,
    "individual_name": null,
    "shipping_details": null
  },
  "consent": null,
  "consent_collection": null,
  "created": 1000000000,
  "currency": null,
  "currency_conversion": null,
  "custom_fields": [],
  "custom_text": {
    "after_submit": null,
    "shipping_address": null,
    "submit": null,
    "terms_of_service_acceptance": null
  },
  "customer": "cus_NORMALIZED",
  "customer_creation": null,
  "customer_details": {
    "address": null,
    "business_name": null,
    "email": "hamlet@zulip.com",
    "individual_name": null,
    "name": null,
    "phone": null,
    "tax_exempt": null,
    "tax_ids": null
  },
  "customer_email": null,
  "discounts": null,
  "expires_at": 1000000000,
  "id": "schedule_server_complimentary_access_plan_upgrade_to_fixed_price_plan--checkout.Session.create.1.json",
  "invoice": null,
  "invoice_creation": null,
  "livemode": false,
  "locale": null,
  "metadata": {
    "remote_server_user_id": "11",
    "type": "card_update"
  },
  "mode": "setup",
  "object": "checkout.session",
  "origin_context": null,
  "payment_intent": null,
  "payment_link": null,
  "payment_method_collection": "always",
  "payment_method_configuration_details": null,
  "payment_method_options": {
    "card": {
      "request_three_d_secure": "automatic"
    }
  },
  "payment_method_types": [
    "card"
  ],
  "payment_status": "no_payment_required",
  "permissions": null,
  "phone_number_collection": {
    "enabled": false
  },
  "recovered_from": null,
  "saved_payment_method_options": null,
  "setup_intent": "seti_NORMALIZED",
  "shipping_address_collection": null,
  "shipping_cost": null,
  "shipping_options": [],
  "status": "open",
  "submit_type": null,
  "subscription": null,
  "success_url": "http://selfhosting.testserver/server/6cde5f7a-1f7e-4978-9716-49f69ebfc9fe/billing/event_status/?stripe_session_id={CHECKOUT_SESSION_ID}",
  "total_details": null,
  "ui_mode": "hosted",
  "url": "https://checkout.stripe.com/c/pay/cs_test_NORMALIZED",
  "wallet_options": null
}
```

--------------------------------------------------------------------------------

---[FILE: schedule_server_complimentary_access_plan_upgrade_to_fixed_price_plan--checkout.Session.list.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_server_complimentary_access_plan_upgrade_to_fixed_price_plan--checkout.Session.list.1.json

```json
{
  "data": [
    {
      "adaptive_pricing": {
        "enabled": false
      },
      "after_expiration": null,
      "allow_promotion_codes": null,
      "amount_subtotal": null,
      "amount_total": null,
      "automatic_tax": {
        "enabled": false,
        "liability": null,
        "provider": null,
        "status": null
      },
      "billing_address_collection": "required",
      "branding_settings": {
        "background_color": "#dbedff",
        "border_style": "rounded",
        "button_color": "#3e6bfe",
        "display_name": "Violet Beam",
        "font_family": "source_sans_pro",
        "icon": {
          "file": "file_1RxpnoDwzgQ85STgf3bBl5KY",
          "type": "file"
        },
        "logo": {
          "file": "file_1RxpnoDwzgQ85STgvEm4ntJu",
          "type": "file"
        }
      },
      "cancel_url": "http://selfhosting.testserver/server/6cde5f7a-1f7e-4978-9716-49f69ebfc9fe/upgrade/?manual_license_management=false&tier=1",
      "client_reference_id": null,
      "client_secret": null,
      "collected_information": {
        "business_name": null,
        "individual_name": null,
        "shipping_details": null
      },
      "consent": null,
      "consent_collection": null,
      "created": 1000000000,
      "currency": null,
      "currency_conversion": null,
      "custom_fields": [],
      "custom_text": {
        "after_submit": null,
        "shipping_address": null,
        "submit": null,
        "terms_of_service_acceptance": null
      },
      "customer": "cus_NORMALIZED",
      "customer_creation": null,
      "customer_details": {
        "address": null,
        "business_name": null,
        "email": "hamlet@zulip.com",
        "individual_name": null,
        "name": null,
        "phone": null,
        "tax_exempt": null,
        "tax_ids": null
      },
      "customer_email": null,
      "discounts": null,
      "expires_at": 1000000000,
      "id": "schedule_server_complimentary_access_plan_upgrade_to_fixed_price_plan--checkout.Session.create.1.json",
      "invoice": null,
      "invoice_creation": null,
      "livemode": false,
      "locale": null,
      "metadata": {
        "remote_server_user_id": "11",
        "type": "card_update"
      },
      "mode": "setup",
      "object": "checkout.session",
      "origin_context": null,
      "payment_intent": null,
      "payment_link": null,
      "payment_method_collection": "always",
      "payment_method_configuration_details": null,
      "payment_method_options": {
        "card": {
          "request_three_d_secure": "automatic"
        }
      },
      "payment_method_types": [
        "card"
      ],
      "payment_status": "no_payment_required",
      "permissions": null,
      "phone_number_collection": {
        "enabled": false
      },
      "recovered_from": null,
      "saved_payment_method_options": null,
      "setup_intent": "seti_NORMALIZED",
      "shipping_address_collection": null,
      "shipping_cost": null,
      "shipping_options": [],
      "status": "open",
      "submit_type": null,
      "subscription": null,
      "success_url": "http://selfhosting.testserver/server/6cde5f7a-1f7e-4978-9716-49f69ebfc9fe/billing/event_status/?stripe_session_id={CHECKOUT_SESSION_ID}",
      "total_details": null,
      "ui_mode": "hosted",
      "url": "https://checkout.stripe.com/c/pay/cs_test_NORMALIZED",
      "wallet_options": null
    }
  ],
  "has_more": false,
  "object": "list",
  "url": "/v1/checkout/sessions"
}
```

--------------------------------------------------------------------------------

---[FILE: schedule_server_complimentary_access_plan_upgrade_to_fixed_price_plan--Customer.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_server_complimentary_access_plan_upgrade_to_fixed_price_plan--Customer.create.1.json

```json
{
  "address": null,
  "balance": 0,
  "created": 1000000000,
  "currency": null,
  "default_source": null,
  "delinquent": false,
  "description": "demo.example.com 6cde5f7a-1f7",
  "discount": null,
  "email": "hamlet@zulip.com",
  "id": "schedule_server_complimentary_access_plan_upgrade_to_fixed_price_plan--Customer.create.1.json",
  "invoice_prefix": "NORMALIZED",
  "invoice_settings": {
    "custom_fields": null,
    "default_payment_method": null,
    "footer": null,
    "rendering_options": null
  },
  "livemode": false,
  "metadata": {
    "remote_server_str": "demo.example.com 6cde5f7a-1f7",
    "remote_server_uuid": "6cde5f7a-1f7e-4978-9716-49f69ebfc9fe"
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

---[FILE: schedule_server_complimentary_access_plan_upgrade_to_fixed_price_plan--Customer.modify.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_server_complimentary_access_plan_upgrade_to_fixed_price_plan--Customer.modify.1.json

```json
{
  "address": null,
  "balance": 0,
  "created": 1000000000,
  "currency": null,
  "default_source": null,
  "delinquent": false,
  "description": "demo.example.com 6cde5f7a-1f7",
  "discount": null,
  "email": "hamlet@zulip.com",
  "id": "schedule_server_complimentary_access_plan_upgrade_to_fixed_price_plan--Customer.create.1.json",
  "invoice_prefix": "NORMALIZED",
  "invoice_settings": {
    "custom_fields": null,
    "default_payment_method": "pm_NORMALIZED",
    "footer": null,
    "rendering_options": null
  },
  "livemode": false,
  "metadata": {
    "remote_server_str": "demo.example.com 6cde5f7a-1f7",
    "remote_server_uuid": "6cde5f7a-1f7e-4978-9716-49f69ebfc9fe"
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

---[FILE: schedule_server_complimentary_access_plan_upgrade_to_fixed_price_plan--Customer.retrieve.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_server_complimentary_access_plan_upgrade_to_fixed_price_plan--Customer.retrieve.1.json

```json
{
  "address": null,
  "balance": 0,
  "created": 1000000000,
  "currency": null,
  "default_source": null,
  "delinquent": false,
  "description": "demo.example.com 6cde5f7a-1f7",
  "discount": null,
  "email": "hamlet@zulip.com",
  "id": "schedule_server_complimentary_access_plan_upgrade_to_fixed_price_plan--Customer.create.1.json",
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
      "customer": "schedule_server_complimentary_access_plan_upgrade_to_fixed_price_plan--Customer.create.1.json",
      "id": "schedule_server_complimentary_access_plan_upgrade_to_fixed_price_plan--Customer.retrieve.1.json",
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
    "remote_server_str": "demo.example.com 6cde5f7a-1f7",
    "remote_server_uuid": "6cde5f7a-1f7e-4978-9716-49f69ebfc9fe"
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

---[FILE: schedule_server_complimentary_access_plan_upgrade_to_fixed_price_plan--Customer.retrieve.2.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/schedule_server_complimentary_access_plan_upgrade_to_fixed_price_plan--Customer.retrieve.2.json

```json
{
  "address": null,
  "balance": 0,
  "created": 1000000000,
  "currency": null,
  "default_source": null,
  "delinquent": false,
  "description": "demo.example.com 6cde5f7a-1f7",
  "discount": null,
  "email": "hamlet@zulip.com",
  "id": "schedule_server_complimentary_access_plan_upgrade_to_fixed_price_plan--Customer.create.1.json",
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
      "customer": "schedule_server_complimentary_access_plan_upgrade_to_fixed_price_plan--Customer.create.1.json",
      "id": "schedule_server_complimentary_access_plan_upgrade_to_fixed_price_plan--Customer.retrieve.1.json",
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
    "remote_server_str": "demo.example.com 6cde5f7a-1f7",
    "remote_server_uuid": "6cde5f7a-1f7e-4978-9716-49f69ebfc9fe"
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

````
