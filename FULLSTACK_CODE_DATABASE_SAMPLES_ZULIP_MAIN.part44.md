---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:12Z
part: 44
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 44 of 1290)

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

---[FILE: billing_page_permissions--Event.list.3.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/billing_page_permissions--Event.list.3.json

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
          "customer_email": "desdemona@zulip.com",
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
          "id": "billing_page_permissions--Event.list.2.json",
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
                "id": "billing_page_permissions--Event.list.2.json",
                "invoice": "billing_page_permissions--Event.list.2.json",
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
            "url": "/v1/invoices/billing_page_permissions--Event.list.2.json/lines"
          },
          "livemode": false,
          "metadata": {
            "billing_schedule": "1",
            "current_plan_id": "None",
            "license_management": "automatic",
            "licenses": "6",
            "on_free_trial": "False",
            "plan_tier": "1",
            "user_id": "9"
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
      },
      "id": "billing_page_permissions--Event.list.3.json",
      "livemode": false,
      "object": "event",
      "pending_webhooks": 0,
      "request": {
        "id": "billing_page_permissions--Event.list.2.json",
        "idempotency_key": "00000000-0000-0000-0000-000000000000"
      },
      "type": "invoice.payment_succeeded"
    },
    {
      "api_version": "2025-11-17.clover",
      "created": 1000000000,
      "data": {
        "object": {
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
          "customer_email": "desdemona@zulip.com",
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
          "id": "billing_page_permissions--Event.list.2.json",
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
                "id": "billing_page_permissions--Event.list.2.json",
                "invoice": "billing_page_permissions--Event.list.2.json",
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
            "url": "/v1/invoices/billing_page_permissions--Event.list.2.json/lines"
          },
          "livemode": false,
          "metadata": {
            "billing_schedule": "1",
            "current_plan_id": "None",
            "license_management": "automatic",
            "licenses": "6",
            "on_free_trial": "False",
            "plan_tier": "1",
            "user_id": "9"
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
      },
      "id": "billing_page_permissions--Event.list.3.json",
      "livemode": false,
      "object": "event",
      "pending_webhooks": 0,
      "request": {
        "id": "billing_page_permissions--Event.list.2.json",
        "idempotency_key": "00000000-0000-0000-0000-000000000000"
      },
      "type": "invoice.paid"
    },
    {
      "api_version": "2025-11-17.clover",
      "created": 1000000000,
      "data": {
        "object": {
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
          "customer_email": "desdemona@zulip.com",
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
          "id": "billing_page_permissions--Event.list.2.json",
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
                "id": "billing_page_permissions--Event.list.2.json",
                "invoice": "billing_page_permissions--Event.list.2.json",
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
            "url": "/v1/invoices/billing_page_permissions--Event.list.2.json/lines"
          },
          "livemode": false,
          "metadata": {
            "billing_schedule": "1",
            "current_plan_id": "None",
            "license_management": "automatic",
            "licenses": "6",
            "on_free_trial": "False",
            "plan_tier": "1",
            "user_id": "9"
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
        },
        "previous_attributes": {
          "amount_paid": 0,
          "amount_remaining": 48000,
          "attempt_count": 0,
          "attempted": false,
          "status": "open",
          "status_transitions": {
            "paid_at": null
          }
        }
      },
      "id": "billing_page_permissions--Event.list.3.json",
      "livemode": false,
      "object": "event",
      "pending_webhooks": 0,
      "request": {
        "id": "billing_page_permissions--Event.list.2.json",
        "idempotency_key": "00000000-0000-0000-0000-000000000000"
      },
      "type": "invoice.updated"
    },
    {
      "api_version": "2025-11-17.clover",
      "created": 1000000000,
      "data": {
        "object": {
          "amount": 48000,
          "amount_capturable": 0,
          "amount_details": {
            "tip": {}
          },
          "amount_received": 48000,
          "application": null,
          "application_fee_amount": null,
          "automatic_payment_methods": null,
          "canceled_at": null,
          "cancellation_reason": null,
          "capture_method": "automatic",
          "client_secret": "NORMALIZED",
          "confirmation_method": "automatic",
          "created": 1000000000,
          "currency": "usd",
          "customer": "cus_NORMALIZED",
          "description": "Payment for Invoice",
          "excluded_payment_method_types": null,
          "id": "billing_page_permissions--Event.list.2.json",
          "last_payment_error": null,
          "latest_charge": "ch_NORMALIZED",
          "livemode": false,
          "metadata": {},
          "next_action": null,
          "object": "payment_intent",
          "on_behalf_of": null,
          "payment_details": {
            "customer_reference": null,
            "order_reference": "in_1SVWkfDwzgQ85STgCc4u9h"
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
          "receipt_email": "desdemona@zulip.com",
          "review": null,
          "setup_future_usage": null,
          "shipping": null,
          "source": null,
          "statement_descriptor": "Zulip Cloud Standard",
          "statement_descriptor_suffix": null,
          "status": "succeeded",
          "transfer_data": null,
          "transfer_group": null
        }
      },
      "id": "billing_page_permissions--Event.list.3.json",
      "livemode": false,
      "object": "event",
      "pending_webhooks": 0,
      "request": {
        "id": "billing_page_permissions--Event.list.2.json",
        "idempotency_key": "00000000-0000-0000-0000-000000000000"
      },
      "type": "payment_intent.succeeded"
    }
  ],
  "has_more": false,
  "object": "list",
  "url": "/v1/events"
}
```

--------------------------------------------------------------------------------

---[FILE: billing_page_permissions--Event.list.4.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/billing_page_permissions--Event.list.4.json

```json
{
  "data": [],
  "has_more": false,
  "object": "list",
  "url": "/v1/events"
}
```

--------------------------------------------------------------------------------

---[FILE: billing_page_permissions--Invoice.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/billing_page_permissions--Invoice.create.1.json

```json
{
  "account_country": "US",
  "account_name": "NORMALIZED",
  "account_tax_ids": null,
  "amount_due": 0,
  "amount_overpaid": 0,
  "amount_paid": 0,
  "amount_remaining": 0,
  "amount_shipping": 0,
  "application": null,
  "attempt_count": 0,
  "attempted": false,
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
  "customer_email": "desdemona@zulip.com",
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
  "effective_at": null,
  "ending_balance": null,
  "footer": null,
  "from_invoice": null,
  "hosted_invoice_url": null,
  "id": "billing_page_permissions--Event.list.2.json",
  "invoice_pdf": null,
  "issuer": {
    "type": "self"
  },
  "last_finalization_error": null,
  "latest_revision": null,
  "lines": {
    "data": [],
    "has_more": false,
    "object": "list",
    "total_count": 0,
    "url": "/v1/invoices/billing_page_permissions--Event.list.2.json/lines"
  },
  "livemode": false,
  "metadata": {
    "billing_schedule": "1",
    "current_plan_id": "None",
    "license_management": "automatic",
    "licenses": "6",
    "on_free_trial": "False",
    "plan_tier": "1",
    "user_id": "9"
  },
  "next_payment_attempt": null,
  "number": null,
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
      "page_size": "auto"
    },
    "template": null,
    "template_version": null
  },
  "shipping_cost": null,
  "shipping_details": null,
  "starting_balance": 0,
  "statement_descriptor": "Zulip Cloud Standard",
  "status": "draft",
  "status_transitions": {
    "finalized_at": null,
    "marked_uncollectible_at": null,
    "paid_at": null,
    "voided_at": null
  },
  "subtotal": 0,
  "subtotal_excluding_tax": 0,
  "test_clock": null,
  "total": 0,
  "total_discount_amounts": [],
  "total_excluding_tax": 0,
  "total_pretax_credit_amounts": [],
  "total_taxes": [],
  "webhooks_delivered_at": 1000000000
}
```

--------------------------------------------------------------------------------

---[FILE: billing_page_permissions--Invoice.finalize_invoice.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/billing_page_permissions--Invoice.finalize_invoice.1.json

```json
{
  "account_country": "US",
  "account_name": "NORMALIZED",
  "account_tax_ids": null,
  "amount_due": 48000,
  "amount_overpaid": 0,
  "amount_paid": 0,
  "amount_remaining": 48000,
  "amount_shipping": 0,
  "application": null,
  "attempt_count": 0,
  "attempted": false,
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
  "customer_email": "desdemona@zulip.com",
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
  "id": "billing_page_permissions--Event.list.2.json",
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
        "id": "billing_page_permissions--Event.list.2.json",
        "invoice": "billing_page_permissions--Event.list.2.json",
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
    "url": "/v1/invoices/billing_page_permissions--Event.list.2.json/lines"
  },
  "livemode": false,
  "metadata": {
    "billing_schedule": "1",
    "current_plan_id": "None",
    "license_management": "automatic",
    "licenses": "6",
    "on_free_trial": "False",
    "plan_tier": "1",
    "user_id": "9"
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
  "status": "open",
  "status_transitions": {
    "finalized_at": 1000000000,
    "marked_uncollectible_at": null,
    "paid_at": null,
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

---[FILE: billing_page_permissions--Invoice.list.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/billing_page_permissions--Invoice.list.1.json

```json
{
  "data": [],
  "has_more": false,
  "object": "list",
  "url": "/v1/invoices"
}
```

--------------------------------------------------------------------------------

---[FILE: billing_page_permissions--Invoice.pay.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/billing_page_permissions--Invoice.pay.1.json

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
  "customer_email": "desdemona@zulip.com",
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
  "id": "billing_page_permissions--Event.list.2.json",
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
        "id": "billing_page_permissions--Event.list.2.json",
        "invoice": "billing_page_permissions--Event.list.2.json",
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
    "url": "/v1/invoices/billing_page_permissions--Event.list.2.json/lines"
  },
  "livemode": false,
  "metadata": {
    "billing_schedule": "1",
    "current_plan_id": "None",
    "license_management": "automatic",
    "licenses": "6",
    "on_free_trial": "False",
    "plan_tier": "1",
    "user_id": "9"
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

---[FILE: billing_page_permissions--InvoiceItem.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/billing_page_permissions--InvoiceItem.create.1.json

```json
{
  "amount": 48000,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Cloud Standard",
  "discountable": false,
  "discounts": [],
  "id": "billing_page_permissions--Event.list.2.json",
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

---[FILE: billing_page_permissions--PaymentMethod.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/billing_page_permissions--PaymentMethod.create.1.json

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
  "id": "billing_page_permissions--Customer.retrieve.1.json",
  "livemode": false,
  "metadata": {},
  "object": "payment_method",
  "type": "card"
}
```

--------------------------------------------------------------------------------

---[FILE: billing_page_permissions--SetupIntent.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/billing_page_permissions--SetupIntent.create.1.json

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
  "id": "billing_page_permissions--SetupIntent.create.1.json",
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

---[FILE: billing_page_permissions--SetupIntent.list.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/billing_page_permissions--SetupIntent.list.1.json

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
      "id": "billing_page_permissions--SetupIntent.list.1.json",
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

---[FILE: billing_page_permissions--SetupIntent.retrieve.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/billing_page_permissions--SetupIntent.retrieve.1.json

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
  "id": "billing_page_permissions--SetupIntent.create.1.json",
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

````
