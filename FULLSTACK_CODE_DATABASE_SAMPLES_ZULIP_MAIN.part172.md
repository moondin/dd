---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 172
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 172 of 1290)

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

---[FILE: switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Invoice.list.4.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Invoice.list.4.json

```json
{
  "data": [
    {
      "account_country": "US",
      "account_name": "NORMALIZED",
      "account_tax_ids": null,
      "amount_due": 240000,
      "amount_overpaid": 0,
      "amount_paid": 0,
      "amount_remaining": 240000,
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
      "id": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Invoice.create.5.json",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
      "issuer": {
        "type": "self"
      },
      "last_finalization_error": null,
      "latest_revision": null,
      "lines": {
        "data": [
          {
            "amount": 240000,
            "currency": "usd",
            "description": "Zulip Cloud Standard - renewal",
            "discount_amounts": [],
            "discountable": false,
            "discounts": [],
            "id": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Invoice.finalize_invoice.5.json",
            "invoice": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Invoice.create.5.json",
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
              "end": 1391310245,
              "start": 1359774245
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
            "quantity": 30,
            "taxes": []
          }
        ],
        "has_more": false,
        "object": "list",
        "total_count": 1,
        "url": "/v1/invoices/switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Invoice.create.5.json/lines"
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
      "subtotal": 240000,
      "subtotal_excluding_tax": 240000,
      "test_clock": null,
      "total": 240000,
      "total_discount_amounts": [],
      "total_excluding_tax": 240000,
      "total_pretax_credit_amounts": [],
      "total_taxes": [],
      "webhooks_delivered_at": 1000000000
    },
    {
      "account_country": "US",
      "account_name": "NORMALIZED",
      "account_tax_ids": null,
      "amount_due": 36830,
      "amount_overpaid": 0,
      "amount_paid": 0,
      "amount_remaining": 36830,
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
      "id": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Invoice.create.4.json",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
      "issuer": {
        "type": "self"
      },
      "last_finalization_error": null,
      "latest_revision": null,
      "lines": {
        "data": [
          {
            "amount": 36830,
            "currency": "usd",
            "description": "Additional Zulip Cloud Standard license",
            "discount_amounts": [],
            "discountable": false,
            "discounts": [],
            "id": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Invoice.finalize_invoice.4.json",
            "invoice": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Invoice.create.4.json",
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
              "end": 1359774245,
              "start": 1330657445
            },
            "pretax_credit_amounts": [],
            "pricing": {
              "price_details": {
                "price": "price_NORMALIZED",
                "product": "prod_NORMALIZED"
              },
              "type": "price_details",
              "unit_amount_decimal": "7366"
            },
            "quantity": 5,
            "taxes": []
          }
        ],
        "has_more": false,
        "object": "list",
        "total_count": 1,
        "url": "/v1/invoices/switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Invoice.create.4.json/lines"
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
      "subtotal": 36830,
      "subtotal_excluding_tax": 36830,
      "test_clock": null,
      "total": 36830,
      "total_discount_amounts": [],
      "total_excluding_tax": 36830,
      "total_pretax_credit_amounts": [],
      "total_taxes": [],
      "webhooks_delivered_at": 1000000000
    },
    {
      "account_country": "US",
      "account_name": "NORMALIZED",
      "account_tax_ids": null,
      "amount_due": 200000,
      "amount_overpaid": 0,
      "amount_paid": 0,
      "amount_remaining": 200000,
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
      "id": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Invoice.create.3.json",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
      "issuer": {
        "type": "self"
      },
      "last_finalization_error": null,
      "latest_revision": null,
      "lines": {
        "data": [
          {
            "amount": 40000,
            "currency": "usd",
            "description": "Additional Zulip Cloud Standard license",
            "discount_amounts": [],
            "discountable": false,
            "discounts": [],
            "id": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Invoice.finalize_invoice.3.json",
            "invoice": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Invoice.create.3.json",
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
              "end": 1359774245,
              "start": 1328151845
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
            "quantity": 5,
            "taxes": []
          },
          {
            "amount": 160000,
            "currency": "usd",
            "description": "Zulip Cloud Standard - renewal",
            "discount_amounts": [],
            "discountable": false,
            "discounts": [],
            "id": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Invoice.finalize_invoice.3.json",
            "invoice": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Invoice.create.3.json",
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
              "end": 1359774245,
              "start": 1328151845
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
            "quantity": 20,
            "taxes": []
          }
        ],
        "has_more": false,
        "object": "list",
        "total_count": 2,
        "url": "/v1/invoices/switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Invoice.create.3.json/lines"
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
      "subtotal": 200000,
      "subtotal_excluding_tax": 200000,
      "test_clock": null,
      "total": 200000,
      "total_discount_amounts": [],
      "total_excluding_tax": 200000,
      "total_pretax_credit_amounts": [],
      "total_taxes": [],
      "webhooks_delivered_at": 1000000000
    },
    {
      "account_country": "US",
      "account_name": "NORMALIZED",
      "account_tax_ids": null,
      "amount_due": 11200,
      "amount_overpaid": 0,
      "amount_paid": 0,
      "amount_remaining": 11200,
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
      "id": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Invoice.create.2.json",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
      "issuer": {
        "type": "self"
      },
      "last_finalization_error": null,
      "latest_revision": null,
      "lines": {
        "data": [
          {
            "amount": 11200,
            "currency": "usd",
            "description": "Additional Zulip Cloud Standard license",
            "discount_amounts": [],
            "discountable": false,
            "discounts": [],
            "id": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Invoice.finalize_invoice.2.json",
            "invoice": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Invoice.create.2.json",
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
              "end": 1328151845,
              "start": 1325473445
            },
            "pretax_credit_amounts": [],
            "pricing": {
              "price_details": {
                "price": "price_NORMALIZED",
                "product": "prod_NORMALIZED"
              },
              "type": "price_details",
              "unit_amount_decimal": "800"
            },
            "quantity": 14,
            "taxes": []
          }
        ],
        "has_more": false,
        "object": "list",
        "total_count": 1,
        "url": "/v1/invoices/switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Invoice.create.2.json/lines"
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
      "subtotal": 11200,
      "subtotal_excluding_tax": 11200,
      "test_clock": null,
      "total": 11200,
      "total_discount_amounts": [],
      "total_excluding_tax": 11200,
      "total_pretax_credit_amounts": [],
      "total_taxes": [],
      "webhooks_delivered_at": 1000000000
    },
    {
      "account_country": "US",
      "account_name": "NORMALIZED",
      "account_tax_ids": null,
      "amount_due": 4800,
      "amount_overpaid": 0,
      "amount_paid": 4800,
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
      "id": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Event.list.2.json",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
      "issuer": {
        "type": "self"
      },
      "last_finalization_error": null,
      "latest_revision": null,
      "lines": {
        "data": [
          {
            "amount": 4800,
            "currency": "usd",
            "description": "Zulip Cloud Standard",
            "discount_amounts": [],
            "discountable": false,
            "discounts": [],
            "id": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Event.list.2.json",
            "invoice": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Event.list.2.json",
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
              "end": 1328151845,
              "start": 1325473445
            },
            "pretax_credit_amounts": [],
            "pricing": {
              "price_details": {
                "price": "price_NORMALIZED",
                "product": "prod_NORMALIZED"
              },
              "type": "price_details",
              "unit_amount_decimal": "800"
            },
            "quantity": 6,
            "taxes": []
          }
        ],
        "has_more": false,
        "object": "list",
        "total_count": 1,
        "url": "/v1/invoices/switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Event.list.2.json/lines"
      },
      "livemode": false,
      "metadata": {
        "billing_schedule": "2",
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
      "subtotal": 4800,
      "subtotal_excluding_tax": 4800,
      "test_clock": null,
      "total": 4800,
      "total_discount_amounts": [],
      "total_excluding_tax": 4800,
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

---[FILE: switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Invoice.pay.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Invoice.pay.1.json

```json
{
  "account_country": "US",
  "account_name": "NORMALIZED",
  "account_tax_ids": null,
  "amount_due": 4800,
  "amount_overpaid": 0,
  "amount_paid": 4800,
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
  "id": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Event.list.2.json",
  "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
  "issuer": {
    "type": "self"
  },
  "last_finalization_error": null,
  "latest_revision": null,
  "lines": {
    "data": [
      {
        "amount": 4800,
        "currency": "usd",
        "description": "Zulip Cloud Standard",
        "discount_amounts": [],
        "discountable": false,
        "discounts": [],
        "id": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Event.list.2.json",
        "invoice": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Event.list.2.json",
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
          "end": 1328151845,
          "start": 1325473445
        },
        "pretax_credit_amounts": [],
        "pricing": {
          "price_details": {
            "price": "price_NORMALIZED",
            "product": "prod_NORMALIZED"
          },
          "type": "price_details",
          "unit_amount_decimal": "800"
        },
        "quantity": 6,
        "taxes": []
      }
    ],
    "has_more": false,
    "object": "list",
    "total_count": 1,
    "url": "/v1/invoices/switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Event.list.2.json/lines"
  },
  "livemode": false,
  "metadata": {
    "billing_schedule": "2",
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
  "subtotal": 4800,
  "subtotal_excluding_tax": 4800,
  "test_clock": null,
  "total": 4800,
  "total_discount_amounts": [],
  "total_excluding_tax": 4800,
  "total_pretax_credit_amounts": [],
  "total_taxes": [],
  "webhooks_delivered_at": 1000000000
}
```

--------------------------------------------------------------------------------

---[FILE: switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--InvoiceItem.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--InvoiceItem.create.1.json

```json
{
  "amount": 4800,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Cloud Standard",
  "discountable": false,
  "discounts": [],
  "id": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Event.list.2.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 4800,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1328151845,
    "start": 1325473445
  },
  "pricing": {
    "price_details": {
      "price": "price_NORMALIZED",
      "product": "prod_NORMALIZED"
    },
    "type": "price_details",
    "unit_amount_decimal": "800"
  },
  "proration": false,
  "quantity": 6,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--InvoiceItem.create.2.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--InvoiceItem.create.2.json

```json
{
  "amount": 11200,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Additional Zulip Cloud Standard license",
  "discountable": false,
  "discounts": [],
  "id": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--InvoiceItem.create.2.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 11200,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1328151845,
    "start": 1325473445
  },
  "pricing": {
    "price_details": {
      "price": "price_NORMALIZED",
      "product": "prod_NORMALIZED"
    },
    "type": "price_details",
    "unit_amount_decimal": "800"
  },
  "proration": false,
  "quantity": 14,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--InvoiceItem.create.3.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--InvoiceItem.create.3.json

```json
{
  "amount": 160000,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Cloud Standard - renewal",
  "discountable": false,
  "discounts": [],
  "id": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--InvoiceItem.create.3.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 160000,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1359774245,
    "start": 1328151845
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
  "quantity": 20,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--InvoiceItem.create.4.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--InvoiceItem.create.4.json

```json
{
  "amount": 40000,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Additional Zulip Cloud Standard license",
  "discountable": false,
  "discounts": [],
  "id": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--InvoiceItem.create.4.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 40000,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1359774245,
    "start": 1328151845
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
  "quantity": 5,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--InvoiceItem.create.5.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--InvoiceItem.create.5.json

```json
{
  "amount": 36830,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Additional Zulip Cloud Standard license",
  "discountable": false,
  "discounts": [],
  "id": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--InvoiceItem.create.5.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 36830,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1359774245,
    "start": 1330657445
  },
  "pricing": {
    "price_details": {
      "price": "price_NORMALIZED",
      "product": "prod_NORMALIZED"
    },
    "type": "price_details",
    "unit_amount_decimal": "7366"
  },
  "proration": false,
  "quantity": 5,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--InvoiceItem.create.6.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--InvoiceItem.create.6.json

```json
{
  "amount": 240000,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Cloud Standard - renewal",
  "discountable": false,
  "discounts": [],
  "id": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--InvoiceItem.create.6.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 240000,
  "object": "invoiceitem",
  "parent": null,
  "period": {
    "end": 1391310245,
    "start": 1359774245
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
  "quantity": 30,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--PaymentMethod.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--PaymentMethod.create.1.json

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
  "id": "switch_from_monthly_plan_to_annual_plan_for_automatic_license_management--Customer.retrieve.1.json",
  "livemode": false,
  "metadata": {},
  "object": "payment_method",
  "type": "card"
}
```

--------------------------------------------------------------------------------

````
