---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 199
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 199 of 1290)

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

---[FILE: upgrade_by_card_with_outdated_seat_count--Invoice.finalize_invoice.2.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count--Invoice.finalize_invoice.2.json

```json
{
  "account_country": "US",
  "account_name": "NORMALIZED",
  "account_tax_ids": null,
  "amount_due": 136000,
  "amount_overpaid": 0,
  "amount_paid": 0,
  "amount_remaining": 136000,
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
  "id": "upgrade_by_card_with_outdated_seat_count--Event.list.4.json",
  "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
  "issuer": {
    "type": "self"
  },
  "last_finalization_error": null,
  "latest_revision": null,
  "lines": {
    "data": [
      {
        "amount": 136000,
        "currency": "usd",
        "description": "Additional Zulip Cloud Standard license",
        "discount_amounts": [],
        "discountable": false,
        "discounts": [],
        "id": "upgrade_by_card_with_outdated_seat_count--Event.list.4.json",
        "invoice": "upgrade_by_card_with_outdated_seat_count--Event.list.4.json",
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
          "unit_amount_decimal": "8000"
        },
        "quantity": 17,
        "taxes": []
      }
    ],
    "has_more": false,
    "object": "list",
    "total_count": 1,
    "url": "/v1/invoices/upgrade_by_card_with_outdated_seat_count--Event.list.4.json/lines"
  },
  "livemode": false,
  "metadata": {},
  "next_payment_attempt": 1000000000,
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
  "subtotal": 136000,
  "subtotal_excluding_tax": 136000,
  "test_clock": null,
  "total": 136000,
  "total_discount_amounts": [],
  "total_excluding_tax": 136000,
  "total_pretax_credit_amounts": [],
  "total_taxes": [],
  "webhooks_delivered_at": 1000000000
}
```

--------------------------------------------------------------------------------

---[FILE: upgrade_by_card_with_outdated_seat_count--Invoice.list.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count--Invoice.list.1.json

```json
{
  "data": [],
  "has_more": false,
  "object": "list",
  "url": "/v1/invoices"
}
```

--------------------------------------------------------------------------------

---[FILE: upgrade_by_card_with_outdated_seat_count--Invoice.list.2.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count--Invoice.list.2.json

```json
{
  "data": [
    {
      "account_country": "US",
      "account_name": "NORMALIZED",
      "account_tax_ids": null,
      "amount_due": 136000,
      "amount_overpaid": 0,
      "amount_paid": 0,
      "amount_remaining": 136000,
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
      "id": "upgrade_by_card_with_outdated_seat_count--Event.list.4.json",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
      "issuer": {
        "type": "self"
      },
      "last_finalization_error": null,
      "latest_revision": null,
      "lines": {
        "data": [
          {
            "amount": 136000,
            "currency": "usd",
            "description": "Additional Zulip Cloud Standard license",
            "discount_amounts": [],
            "discountable": false,
            "discounts": [],
            "id": "upgrade_by_card_with_outdated_seat_count--Event.list.4.json",
            "invoice": "upgrade_by_card_with_outdated_seat_count--Event.list.4.json",
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
              "unit_amount_decimal": "8000"
            },
            "quantity": 17,
            "taxes": []
          }
        ],
        "has_more": false,
        "object": "list",
        "total_count": 1,
        "url": "/v1/invoices/upgrade_by_card_with_outdated_seat_count--Event.list.4.json/lines"
      },
      "livemode": false,
      "metadata": {},
      "next_payment_attempt": 1000000000,
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
      "subtotal": 136000,
      "subtotal_excluding_tax": 136000,
      "test_clock": null,
      "total": 136000,
      "total_discount_amounts": [],
      "total_excluding_tax": 136000,
      "total_pretax_credit_amounts": [],
      "total_taxes": [],
      "webhooks_delivered_at": 1000000000
    },
    {
      "account_country": "US",
      "account_name": "NORMALIZED",
      "account_tax_ids": null,
      "amount_due": 48000,
      "amount_overpaid": 0,
      "amount_paid": 48000,
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
      "id": "upgrade_by_card_with_outdated_seat_count--Event.list.2.json",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
      "issuer": {
        "type": "self"
      },
      "last_finalization_error": null,
      "latest_revision": null,
      "lines": {
        "data": [
          {
            "amount": 48000,
            "currency": "usd",
            "description": "Zulip Cloud Standard",
            "discount_amounts": [],
            "discountable": false,
            "discounts": [],
            "id": "upgrade_by_card_with_outdated_seat_count--Event.list.2.json",
            "invoice": "upgrade_by_card_with_outdated_seat_count--Event.list.2.json",
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
              "unit_amount_decimal": "8000"
            },
            "quantity": 6,
            "taxes": []
          }
        ],
        "has_more": false,
        "object": "list",
        "total_count": 1,
        "url": "/v1/invoices/upgrade_by_card_with_outdated_seat_count--Event.list.2.json/lines"
      },
      "livemode": false,
      "metadata": {
        "billing_schedule": "1",
        "current_plan_id": "None",
        "license_management": "automatic",
        "licenses": "6",
        "on_free_trial": "False",
        "plan_tier": "1",
        "user_id": "10"
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
      "statement_descriptor": "Zulip Cloud Standard",
      "status": "paid",
      "status_transitions": {
        "finalized_at": 1000000000,
        "marked_uncollectible_at": null,
        "paid_at": 1000000000,
        "voided_at": null
      },
      "subtotal": 48000,
      "subtotal_excluding_tax": 48000,
      "test_clock": null,
      "total": 48000,
      "total_discount_amounts": [],
      "total_excluding_tax": 48000,
      "total_pretax_credit_amounts": [],
      "total_taxes": [],
      "webhooks_delivered_at": 1000000000
    }
  ],
  "has_more": false,
  "object": "list",
  "url": "/v1/invoices"
}
```

--------------------------------------------------------------------------------

---[FILE: upgrade_by_card_with_outdated_seat_count--Invoice.pay.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count--Invoice.pay.1.json

```json
{
  "account_country": "US",
  "account_name": "NORMALIZED",
  "account_tax_ids": null,
  "amount_due": 48000,
  "amount_overpaid": 0,
  "amount_paid": 48000,
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
  "id": "upgrade_by_card_with_outdated_seat_count--Event.list.2.json",
  "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
  "issuer": {
    "type": "self"
  },
  "last_finalization_error": null,
  "latest_revision": null,
  "lines": {
    "data": [
      {
        "amount": 48000,
        "currency": "usd",
        "description": "Zulip Cloud Standard",
        "discount_amounts": [],
        "discountable": false,
        "discounts": [],
        "id": "upgrade_by_card_with_outdated_seat_count--Event.list.2.json",
        "invoice": "upgrade_by_card_with_outdated_seat_count--Event.list.2.json",
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
          "unit_amount_decimal": "8000"
        },
        "quantity": 6,
        "taxes": []
      }
    ],
    "has_more": false,
    "object": "list",
    "total_count": 1,
    "url": "/v1/invoices/upgrade_by_card_with_outdated_seat_count--Event.list.2.json/lines"
  },
  "livemode": false,
  "metadata": {
    "billing_schedule": "1",
    "current_plan_id": "None",
    "license_management": "automatic",
    "licenses": "6",
    "on_free_trial": "False",
    "plan_tier": "1",
    "user_id": "10"
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
  "statement_descriptor": "Zulip Cloud Standard",
  "status": "paid",
  "status_transitions": {
    "finalized_at": 1000000000,
    "marked_uncollectible_at": null,
    "paid_at": 1000000000,
    "voided_at": null
  },
  "subtotal": 48000,
  "subtotal_excluding_tax": 48000,
  "test_clock": null,
  "total": 48000,
  "total_discount_amounts": [],
  "total_excluding_tax": 48000,
  "total_pretax_credit_amounts": [],
  "total_taxes": [],
  "webhooks_delivered_at": 1000000000
}
```

--------------------------------------------------------------------------------

---[FILE: upgrade_by_card_with_outdated_seat_count--InvoiceItem.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count--InvoiceItem.create.1.json

```json
{
  "amount": 48000,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Cloud Standard",
  "discountable": false,
  "discounts": [],
  "id": "upgrade_by_card_with_outdated_seat_count--Event.list.2.json",
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

---[FILE: upgrade_by_card_with_outdated_seat_count--InvoiceItem.create.2.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count--InvoiceItem.create.2.json

```json
{
  "amount": 136000,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Additional Zulip Cloud Standard license",
  "discountable": false,
  "discounts": [],
  "id": "upgrade_by_card_with_outdated_seat_count--Event.list.4.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 136000,
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
  "quantity": 17,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: upgrade_by_card_with_outdated_seat_count--PaymentMethod.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count--PaymentMethod.create.1.json

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
  "id": "upgrade_by_card_with_outdated_seat_count--Customer.retrieve.1.json",
  "livemode": false,
  "metadata": {},
  "object": "payment_method",
  "type": "card"
}
```

--------------------------------------------------------------------------------

---[FILE: upgrade_by_card_with_outdated_seat_count--SetupIntent.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count--SetupIntent.create.1.json

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
  "id": "upgrade_by_card_with_outdated_seat_count--SetupIntent.create.1.json",
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

---[FILE: upgrade_by_card_with_outdated_seat_count--SetupIntent.list.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count--SetupIntent.list.1.json

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
      "id": "upgrade_by_card_with_outdated_seat_count--SetupIntent.list.1.json",
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

---[FILE: upgrade_by_card_with_outdated_seat_count--SetupIntent.retrieve.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count--SetupIntent.retrieve.1.json

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
  "id": "upgrade_by_card_with_outdated_seat_count--SetupIntent.create.1.json",
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

---[FILE: upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--Charge.list.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--Charge.list.1.json

```json
{
  "data": [
    {
      "amount": 40000,
      "amount_captured": 40000,
      "amount_refunded": 0,
      "application": null,
      "application_fee": null,
      "application_fee_amount": null,
      "balance_transaction": "txn_NORMALIZED",
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
      "calculated_statement_descriptor": "ZULIP CLOUD STANDARD",
      "captured": true,
      "created": 1000000000,
      "currency": "usd",
      "customer": "cus_NORMALIZED",
      "description": "Payment for Invoice",
      "destination": null,
      "dispute": null,
      "disputed": false,
      "failure_balance_transaction": null,
      "failure_code": null,
      "failure_message": null,
      "fraud_details": {},
      "id": "upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--Charge.list.1.json",
      "livemode": false,
      "metadata": {},
      "object": "charge",
      "on_behalf_of": null,
      "order": null,
      "outcome": {
        "advice_code": null,
        "network_advice_code": null,
        "network_decline_code": null,
        "network_status": "approved_by_network",
        "reason": null,
        "risk_level": "normal",
        "risk_score": 0,
        "seller_message": "Payment complete.",
        "type": "authorized"
      },
      "paid": true,
      "payment_intent": "pi_NORMALIZED",
      "payment_method": "pm_NORMALIZED",
      "payment_method_details": {
        "card": {
          "amount_authorized": 40000,
          "authorization_code": "192510",
          "brand": "visa",
          "checks": {
            "address_line1_check": "pass",
            "address_postal_code_check": "pass",
            "cvc_check": "pass"
          },
          "country": "US",
          "exp_month": 1,
          "exp_year": 9999,
          "extended_authorization": {
            "status": "disabled"
          },
          "fingerprint": "NORMALIZED",
          "funding": "credit",
          "incremental_authorization": {
            "status": "unavailable"
          },
          "installments": null,
          "last4": "4242",
          "mandate": null,
          "multicapture": {
            "status": "unavailable"
          },
          "network": "visa",
          "network_token": {
            "used": false
          },
          "network_transaction_id": "749857738210088",
          "overcapture": {
            "maximum_amount_capturable": 40000,
            "status": "unavailable"
          },
          "regulated_status": "unregulated",
          "three_d_secure": null,
          "wallet": null
        },
        "type": "card"
      },
      "radar_options": {},
      "receipt_email": "hamlet@zulip.com",
      "receipt_number": null,
      "receipt_url": "https://pay.stripe.com/receipts/invoices/NORMALIZED?s=ap",
      "refunded": false,
      "review": null,
      "shipping": null,
      "source": null,
      "source_transfer": null,
      "statement_descriptor": "Zulip Cloud Standard",
      "statement_descriptor_suffix": null,
      "status": "succeeded",
      "transfer_data": null,
      "transfer_group": null
    }
  ],
  "has_more": false,
  "object": "list",
  "url": "/v1/charges"
}
```

--------------------------------------------------------------------------------

---[FILE: upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--checkout.Session.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--checkout.Session.create.1.json

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
  "cancel_url": "http://zulip.testserver/upgrade/?manual_license_management=false&tier=1",
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
  "id": "upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--checkout.Session.create.1.json",
  "invoice": null,
  "invoice_creation": null,
  "livemode": false,
  "locale": null,
  "metadata": {
    "type": "card_update",
    "user_id": "10"
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
  "success_url": "http://zulip.testserver/billing/event_status/?stripe_session_id={CHECKOUT_SESSION_ID}",
  "total_details": null,
  "ui_mode": "hosted",
  "url": "https://checkout.stripe.com/c/pay/cs_test_NORMALIZED",
  "wallet_options": null
}
```

--------------------------------------------------------------------------------

---[FILE: upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--checkout.Session.list.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--checkout.Session.list.1.json

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
      "cancel_url": "http://zulip.testserver/upgrade/?manual_license_management=false&tier=1",
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
      "id": "upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--checkout.Session.create.1.json",
      "invoice": null,
      "invoice_creation": null,
      "livemode": false,
      "locale": null,
      "metadata": {
        "type": "card_update",
        "user_id": "10"
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
      "success_url": "http://zulip.testserver/billing/event_status/?stripe_session_id={CHECKOUT_SESSION_ID}",
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

---[FILE: upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--Customer.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--Customer.create.1.json

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
  "id": "upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--Customer.create.1.json",
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

---[FILE: upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--Customer.modify.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--Customer.modify.1.json

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
  "id": "upgrade_by_card_with_outdated_seat_count_and_minimum_for_plan_tier--Customer.create.1.json",
  "invoice_prefix": "NORMALIZED",
  "invoice_settings": {
    "custom_fields": null,
    "default_payment_method": "pm_NORMALIZED",
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

````
