---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:12Z
part: 79
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 79 of 1290)

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

---[FILE: free_trial_upgrade_by_card--Invoice.list.5.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/free_trial_upgrade_by_card--Invoice.list.5.json

```json
{
  "data": [
    {
      "account_country": "US",
      "account_name": "NORMALIZED",
      "account_tax_ids": null,
      "amount_due": 120000,
      "amount_overpaid": 0,
      "amount_paid": 0,
      "amount_remaining": 120000,
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
      "id": "free_trial_upgrade_by_card--Invoice.create.1.json",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
      "issuer": {
        "type": "self"
      },
      "last_finalization_error": null,
      "latest_revision": null,
      "lines": {
        "data": [
          {
            "amount": 120000,
            "currency": "usd",
            "description": "Zulip Cloud Standard - renewal",
            "discount_amounts": [],
            "discountable": false,
            "discounts": [],
            "id": "free_trial_upgrade_by_card--Invoice.finalize_invoice.1.json",
            "invoice": "free_trial_upgrade_by_card--Invoice.create.1.json",
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
              "end": 1362193445,
              "start": 1330657445
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
            "quantity": 15,
            "taxes": []
          }
        ],
        "has_more": false,
        "object": "list",
        "total_count": 1,
        "url": "/v1/invoices/free_trial_upgrade_by_card--Invoice.create.1.json/lines"
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
      "subtotal": 120000,
      "subtotal_excluding_tax": 120000,
      "test_clock": null,
      "total": 120000,
      "total_discount_amounts": [],
      "total_excluding_tax": 120000,
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

---[FILE: free_trial_upgrade_by_card--Invoice.list.6.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/free_trial_upgrade_by_card--Invoice.list.6.json

```json
{
  "data": [
    {
      "account_country": "US",
      "account_name": "NORMALIZED",
      "account_tax_ids": null,
      "amount_due": 5172,
      "amount_overpaid": 0,
      "amount_paid": 0,
      "amount_remaining": 5172,
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
      "id": "free_trial_upgrade_by_card--Invoice.create.2.json",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
      "issuer": {
        "type": "self"
      },
      "last_finalization_error": null,
      "latest_revision": null,
      "lines": {
        "data": [
          {
            "amount": 5172,
            "currency": "usd",
            "description": "Additional Zulip Cloud Standard license",
            "discount_amounts": [],
            "discountable": false,
            "discounts": [],
            "id": "free_trial_upgrade_by_card--Invoice.finalize_invoice.2.json",
            "invoice": "free_trial_upgrade_by_card--Invoice.create.2.json",
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
              "end": 1362193445,
              "start": 1357095845
            },
            "pretax_credit_amounts": [],
            "pricing": {
              "price_details": {
                "price": "price_NORMALIZED",
                "product": "prod_NORMALIZED"
              },
              "type": "price_details",
              "unit_amount_decimal": "1293"
            },
            "quantity": 4,
            "taxes": []
          }
        ],
        "has_more": false,
        "object": "list",
        "total_count": 1,
        "url": "/v1/invoices/free_trial_upgrade_by_card--Invoice.create.2.json/lines"
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
      "subtotal": 5172,
      "subtotal_excluding_tax": 5172,
      "test_clock": null,
      "total": 5172,
      "total_discount_amounts": [],
      "total_excluding_tax": 5172,
      "total_pretax_credit_amounts": [],
      "total_taxes": [],
      "webhooks_delivered_at": 1000000000
    },
    {
      "account_country": "US",
      "account_name": "NORMALIZED",
      "account_tax_ids": null,
      "amount_due": 120000,
      "amount_overpaid": 0,
      "amount_paid": 0,
      "amount_remaining": 120000,
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
      "id": "free_trial_upgrade_by_card--Invoice.create.1.json",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
      "issuer": {
        "type": "self"
      },
      "last_finalization_error": null,
      "latest_revision": null,
      "lines": {
        "data": [
          {
            "amount": 120000,
            "currency": "usd",
            "description": "Zulip Cloud Standard - renewal",
            "discount_amounts": [],
            "discountable": false,
            "discounts": [],
            "id": "free_trial_upgrade_by_card--Invoice.finalize_invoice.1.json",
            "invoice": "free_trial_upgrade_by_card--Invoice.create.1.json",
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
              "end": 1362193445,
              "start": 1330657445
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
            "quantity": 15,
            "taxes": []
          }
        ],
        "has_more": false,
        "object": "list",
        "total_count": 1,
        "url": "/v1/invoices/free_trial_upgrade_by_card--Invoice.create.1.json/lines"
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
      "subtotal": 120000,
      "subtotal_excluding_tax": 120000,
      "test_clock": null,
      "total": 120000,
      "total_discount_amounts": [],
      "total_excluding_tax": 120000,
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

---[FILE: free_trial_upgrade_by_card--Invoice.list.7.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/free_trial_upgrade_by_card--Invoice.list.7.json

```json
{
  "data": [
    {
      "account_country": "US",
      "account_name": "NORMALIZED",
      "account_tax_ids": null,
      "amount_due": 152000,
      "amount_overpaid": 0,
      "amount_paid": 0,
      "amount_remaining": 152000,
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
      "id": "free_trial_upgrade_by_card--Invoice.create.3.json",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
      "issuer": {
        "type": "self"
      },
      "last_finalization_error": null,
      "latest_revision": null,
      "lines": {
        "data": [
          {
            "amount": 152000,
            "currency": "usd",
            "description": "Zulip Cloud Standard - renewal",
            "discount_amounts": [],
            "discountable": false,
            "discounts": [],
            "id": "free_trial_upgrade_by_card--Invoice.finalize_invoice.3.json",
            "invoice": "free_trial_upgrade_by_card--Invoice.create.3.json",
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
              "end": 1393729445,
              "start": 1362193445
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
            "quantity": 19,
            "taxes": []
          }
        ],
        "has_more": false,
        "object": "list",
        "total_count": 1,
        "url": "/v1/invoices/free_trial_upgrade_by_card--Invoice.create.3.json/lines"
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
      "subtotal": 152000,
      "subtotal_excluding_tax": 152000,
      "test_clock": null,
      "total": 152000,
      "total_discount_amounts": [],
      "total_excluding_tax": 152000,
      "total_pretax_credit_amounts": [],
      "total_taxes": [],
      "webhooks_delivered_at": 1000000000
    },
    {
      "account_country": "US",
      "account_name": "NORMALIZED",
      "account_tax_ids": null,
      "amount_due": 5172,
      "amount_overpaid": 0,
      "amount_paid": 0,
      "amount_remaining": 5172,
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
      "id": "free_trial_upgrade_by_card--Invoice.create.2.json",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
      "issuer": {
        "type": "self"
      },
      "last_finalization_error": null,
      "latest_revision": null,
      "lines": {
        "data": [
          {
            "amount": 5172,
            "currency": "usd",
            "description": "Additional Zulip Cloud Standard license",
            "discount_amounts": [],
            "discountable": false,
            "discounts": [],
            "id": "free_trial_upgrade_by_card--Invoice.finalize_invoice.2.json",
            "invoice": "free_trial_upgrade_by_card--Invoice.create.2.json",
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
              "end": 1362193445,
              "start": 1357095845
            },
            "pretax_credit_amounts": [],
            "pricing": {
              "price_details": {
                "price": "price_NORMALIZED",
                "product": "prod_NORMALIZED"
              },
              "type": "price_details",
              "unit_amount_decimal": "1293"
            },
            "quantity": 4,
            "taxes": []
          }
        ],
        "has_more": false,
        "object": "list",
        "total_count": 1,
        "url": "/v1/invoices/free_trial_upgrade_by_card--Invoice.create.2.json/lines"
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
      "subtotal": 5172,
      "subtotal_excluding_tax": 5172,
      "test_clock": null,
      "total": 5172,
      "total_discount_amounts": [],
      "total_excluding_tax": 5172,
      "total_pretax_credit_amounts": [],
      "total_taxes": [],
      "webhooks_delivered_at": 1000000000
    },
    {
      "account_country": "US",
      "account_name": "NORMALIZED",
      "account_tax_ids": null,
      "amount_due": 120000,
      "amount_overpaid": 0,
      "amount_paid": 0,
      "amount_remaining": 120000,
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
      "id": "free_trial_upgrade_by_card--Invoice.create.1.json",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
      "issuer": {
        "type": "self"
      },
      "last_finalization_error": null,
      "latest_revision": null,
      "lines": {
        "data": [
          {
            "amount": 120000,
            "currency": "usd",
            "description": "Zulip Cloud Standard - renewal",
            "discount_amounts": [],
            "discountable": false,
            "discounts": [],
            "id": "free_trial_upgrade_by_card--Invoice.finalize_invoice.1.json",
            "invoice": "free_trial_upgrade_by_card--Invoice.create.1.json",
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
              "end": 1362193445,
              "start": 1330657445
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
            "quantity": 15,
            "taxes": []
          }
        ],
        "has_more": false,
        "object": "list",
        "total_count": 1,
        "url": "/v1/invoices/free_trial_upgrade_by_card--Invoice.create.1.json/lines"
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
      "subtotal": 120000,
      "subtotal_excluding_tax": 120000,
      "test_clock": null,
      "total": 120000,
      "total_discount_amounts": [],
      "total_excluding_tax": 120000,
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

---[FILE: free_trial_upgrade_by_card--InvoiceItem.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/free_trial_upgrade_by_card--InvoiceItem.create.1.json

```json
{
  "amount": 120000,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Cloud Standard - renewal",
  "discountable": false,
  "discounts": [],
  "id": "free_trial_upgrade_by_card--InvoiceItem.create.1.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 120000,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1362193445,
    "start": 1330657445
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
  "quantity": 15,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: free_trial_upgrade_by_card--InvoiceItem.create.2.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/free_trial_upgrade_by_card--InvoiceItem.create.2.json

```json
{
  "amount": 5172,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Additional Zulip Cloud Standard license",
  "discountable": false,
  "discounts": [],
  "id": "free_trial_upgrade_by_card--InvoiceItem.create.2.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 5172,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1362193445,
    "start": 1357095845
  },
  "pricing": {
    "price_details": {
      "price": "price_NORMALIZED",
      "product": "prod_NORMALIZED"
    },
    "type": "price_details",
    "unit_amount_decimal": "1293"
  },
  "proration": false,
  "quantity": 4,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: free_trial_upgrade_by_card--InvoiceItem.create.3.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/free_trial_upgrade_by_card--InvoiceItem.create.3.json

```json
{
  "amount": 152000,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Cloud Standard - renewal",
  "discountable": false,
  "discounts": [],
  "id": "free_trial_upgrade_by_card--InvoiceItem.create.3.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 152000,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1393729445,
    "start": 1362193445
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
  "quantity": 19,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: free_trial_upgrade_by_card--PaymentMethod.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/free_trial_upgrade_by_card--PaymentMethod.create.1.json

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
  "id": "free_trial_upgrade_by_card--Customer.retrieve.2.json",
  "livemode": false,
  "metadata": {},
  "object": "payment_method",
  "type": "card"
}
```

--------------------------------------------------------------------------------

---[FILE: free_trial_upgrade_by_card--SetupIntent.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/free_trial_upgrade_by_card--SetupIntent.create.1.json

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
  "id": "free_trial_upgrade_by_card--SetupIntent.create.1.json",
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

---[FILE: free_trial_upgrade_by_card--SetupIntent.list.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/free_trial_upgrade_by_card--SetupIntent.list.1.json

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
      "id": "free_trial_upgrade_by_card--SetupIntent.list.1.json",
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

---[FILE: free_trial_upgrade_by_card--SetupIntent.retrieve.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/free_trial_upgrade_by_card--SetupIntent.retrieve.1.json

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
  "id": "free_trial_upgrade_by_card--SetupIntent.create.1.json",
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

---[FILE: free_trial_upgrade_by_invoice--Customer.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/free_trial_upgrade_by_invoice--Customer.create.1.json

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
  "id": "free_trial_upgrade_by_invoice--Customer.create.1.json",
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

---[FILE: free_trial_upgrade_by_invoice--Customer.retrieve.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/free_trial_upgrade_by_invoice--Customer.retrieve.1.json

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
  "id": "free_trial_upgrade_by_invoice--Customer.create.1.json",
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

````
