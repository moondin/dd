---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:12Z
part: 132
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 132 of 1290)

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

---[FILE: replace_payment_method--Invoice.list.3.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/replace_payment_method--Invoice.list.3.json

```json
{
  "data": [
    {
      "account_country": "US",
      "account_name": "NORMALIZED",
      "account_tax_ids": null,
      "amount_due": 5000,
      "amount_overpaid": 0,
      "amount_paid": 0,
      "amount_remaining": 5000,
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
      "id": "replace_payment_method--Invoice.create.2.json",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
      "issuer": {
        "type": "self"
      },
      "last_finalization_error": null,
      "latest_revision": null,
      "lines": {
        "data": [
          {
            "amount": 5000,
            "currency": "usd",
            "description": null,
            "discount_amounts": [],
            "discountable": true,
            "discounts": [],
            "id": "replace_payment_method--Invoice.finalize_invoice.2.json",
            "invoice": "replace_payment_method--Invoice.create.2.json",
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
              "end": 1000000000,
              "start": 1000000000
            },
            "pretax_credit_amounts": [],
            "pricing": {
              "price_details": {
                "price": "price_NORMALIZED",
                "product": "prod_NORMALIZED"
              },
              "type": "price_details",
              "unit_amount_decimal": "5000"
            },
            "quantity": 1,
            "taxes": []
          }
        ],
        "has_more": false,
        "object": "list",
        "total_count": 1,
        "url": "/v1/invoices/replace_payment_method--Invoice.create.2.json/lines"
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
      "statement_descriptor": null,
      "status": "open",
      "status_transitions": {
        "finalized_at": 1000000000,
        "marked_uncollectible_at": null,
        "paid_at": null,
        "voided_at": null
      },
      "subtotal": 5000,
      "subtotal_excluding_tax": 5000,
      "test_clock": null,
      "total": 5000,
      "total_discount_amounts": [],
      "total_excluding_tax": 5000,
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

---[FILE: replace_payment_method--Invoice.list.4.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/replace_payment_method--Invoice.list.4.json

```json
{
  "data": [
    {
      "account_country": "US",
      "account_name": "NORMALIZED",
      "account_tax_ids": null,
      "amount_due": 5000,
      "amount_overpaid": 0,
      "amount_paid": 5000,
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
      "id": "replace_payment_method--Invoice.create.2.json",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
      "issuer": {
        "type": "self"
      },
      "last_finalization_error": null,
      "latest_revision": null,
      "lines": {
        "data": [
          {
            "amount": 5000,
            "currency": "usd",
            "description": null,
            "discount_amounts": [],
            "discountable": true,
            "discounts": [],
            "id": "replace_payment_method--Invoice.finalize_invoice.2.json",
            "invoice": "replace_payment_method--Invoice.create.2.json",
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
              "end": 1000000000,
              "start": 1000000000
            },
            "pretax_credit_amounts": [],
            "pricing": {
              "price_details": {
                "price": "price_NORMALIZED",
                "product": "prod_NORMALIZED"
              },
              "type": "price_details",
              "unit_amount_decimal": "5000"
            },
            "quantity": 1,
            "taxes": []
          }
        ],
        "has_more": false,
        "object": "list",
        "total_count": 1,
        "url": "/v1/invoices/replace_payment_method--Invoice.create.2.json/lines"
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
      "statement_descriptor": null,
      "status": "paid",
      "status_transitions": {
        "finalized_at": 1000000000,
        "marked_uncollectible_at": null,
        "paid_at": 1000000000,
        "voided_at": null
      },
      "subtotal": 5000,
      "subtotal_excluding_tax": 5000,
      "test_clock": null,
      "total": 5000,
      "total_discount_amounts": [],
      "total_excluding_tax": 5000,
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
      "id": "replace_payment_method--Event.list.2.json",
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
            "id": "replace_payment_method--Event.list.2.json",
            "invoice": "replace_payment_method--Event.list.2.json",
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
        "url": "/v1/invoices/replace_payment_method--Event.list.2.json/lines"
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

---[FILE: replace_payment_method--Invoice.pay.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/replace_payment_method--Invoice.pay.1.json

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
  "id": "replace_payment_method--Event.list.2.json",
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
        "id": "replace_payment_method--Event.list.2.json",
        "invoice": "replace_payment_method--Event.list.2.json",
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
    "url": "/v1/invoices/replace_payment_method--Event.list.2.json/lines"
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

---[FILE: replace_payment_method--Invoice.pay.2.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/replace_payment_method--Invoice.pay.2.json

```json
{
  "_message": "Your card was declined.",
  "code": "card_declined",
  "error": {
    "advice_code": "try_again_later",
    "charge": "ch_NORMALIZED",
    "code": "card_declined",
    "decline_code": "generic_decline",
    "doc_url": "https://stripe.com/docs/error-codes/card-declined",
    "message": "Your card was declined.",
    "network_decline_code": "01",
    "param": null,
    "payment_intent": {
      "amount": 5000,
      "amount_capturable": 0,
      "amount_details": {
        "tip": {}
      },
      "amount_received": 0,
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
      "id": "replace_payment_method--Invoice.pay.2.json",
      "last_payment_error": {
        "advice_code": "try_again_later",
        "charge": "ch_NORMALIZED",
        "code": "card_declined",
        "decline_code": "generic_decline",
        "doc_url": "https://stripe.com/docs/error-codes/card-declined",
        "message": "Your card was declined.",
        "network_decline_code": "01",
        "payment_method": {
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
            "last4": "0341",
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
          "customer": "cus_NORMALIZED",
          "id": "replace_payment_method--Customer.retrieve.7.json",
          "livemode": false,
          "metadata": {},
          "object": "payment_method",
          "type": "card"
        },
        "type": "card_error"
      },
      "latest_charge": "ch_NORMALIZED",
      "livemode": false,
      "metadata": {},
      "next_action": null,
      "object": "payment_intent",
      "on_behalf_of": null,
      "payment_details": {
        "customer_reference": null,
        "order_reference": "in_1SVWoDDwzgQ85STg31e2Dg"
      },
      "payment_method": null,
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
      "statement_descriptor": null,
      "statement_descriptor_suffix": null,
      "status": "requires_payment_method",
      "transfer_data": null,
      "transfer_group": null
    },
    "payment_method": {
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
        "last4": "0341",
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
      "customer": "cus_NORMALIZED",
      "id": "replace_payment_method--Customer.retrieve.7.json",
      "livemode": false,
      "metadata": {},
      "object": "payment_method",
      "type": "card"
    },
    "request_log_url": "https://dashboard.stripe.com/test/logs/req_NORMALIZED?t=1763641085",
    "setup_intent": null,
    "source": null,
    "type": "card_error"
  },
  "headers": {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, HEAD, PUT, PATCH, POST, DELETE",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "Request-Id, Stripe-Manage-Version, Stripe-Should-Retry, X-Stripe-External-Auth-Required, X-Stripe-Privileged-Session-Required",
    "Access-Control-Max-Age": "300",
    "Cache-Control": "no-cache, no-store",
    "Connection": "keep-alive",
    "Content-Length": "5502",
    "Content-Security-Policy": "base-uri 'none'; default-src 'none'; form-action 'none'; frame-ancestors 'none'; img-src 'self'; script-src 'self' 'report-sample'; style-src 'self'; worker-src 'none'; upgrade-insecure-requests; report-uri https://q.stripe.com/csp-violation?q=kLfPfx2HhngGH4OXW3QNuWE1S2_gVK0u8e4llr0D2d7xwJ06Tpo8OdyAiKhx5i96CuFU9UP_LP1tKqhn",
    "Content-Type": "application/json",
    "Date": "NORMALIZED DATETIME",
    "Idempotency-Key": "57eb0faa-3bf9-4416-90b1-99496c13b2ea",
    "Original-Request": "req_NORMALIZED",
    "Request-Id": "req_NORMALIZED",
    "Server": "nginx",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "Stripe-Should-Retry": "false",
    "Stripe-Version": "2025-11-17.clover",
    "Vary": "Origin",
    "X-Stripe-Priority-Routing-Enabled": "true",
    "X-Stripe-Routing-Context-Priority-Tier": "api-testmode",
    "X-Wc": "ABGHIJ"
  },
  "http_body": "{\n  \"error\": {\n    \"advice_code\": \"try_again_later\",\n    \"charge\": \"ch_NORMALIZED\",\n    \"code\": \"card_declined\",\n    \"decline_code\": \"generic_decline\",\n    \"doc_url\": \"https://stripe.com/docs/error-codes/card-declined\",\n    \"message\": \"Your card was declined.\",\n    \"network_decline_code\": \"01\",\n    \"payment_intent\": {\n      \"id\": \"replace_payment_method--Invoice.pay.2.json\",\n      \"object\": \"payment_intent\",\n      \"amount\": 5000,\n      \"amount_capturable\": 0,\n      \"amount_details\": {\n        \"tip\": {}\n      },\n      \"amount_received\": 0,\n      \"application\": null,\n      \"application_fee_amount\": null,\n      \"automatic_payment_methods\": null,\n      \"canceled_at\": null,\n      \"cancellation_reason\": null,\n      \"capture_method\": \"automatic\",\n      \"client_secret\": \"replace_payment_method--Invoice.pay.2.json_secret_n39n12ZSNVGwO09bGYTwjIJ1S\",\n      \"confirmation_method\": \"automatic\",\n      \"created\": 1000000000,\n      \"currency\": \"usd\",\n      \"customer\": \"cus_NORMALIZED\",\n      \"description\": \"Payment for Invoice\",\n      \"excluded_payment_method_types\": null,\n      \"last_payment_error\": {\n        \"advice_code\": \"try_again_later\",\n        \"charge\": \"ch_NORMALIZED\",\n        \"code\": \"card_declined\",\n        \"decline_code\": \"generic_decline\",\n        \"doc_url\": \"https://stripe.com/docs/error-codes/card-declined\",\n        \"message\": \"Your card was declined.\",\n        \"network_decline_code\": \"01\",\n        \"payment_method\": {\n          \"id\": \"replace_payment_method--Customer.retrieve.7.json\",\n          \"object\": \"payment_method\",\n          \"allow_redisplay\": \"unspecified\",\n          \"billing_details\": {\n            \"address\": {\n              \"city\": \"San Francisco\",\n              \"country\": \"US\",\n              \"line1\": \"123 Main St\",\n              \"line2\": null,\n              \"postal_code\": \"94105\",\n              \"state\": \"CA\"\n            },\n            \"email\": null,\n            \"name\": \"John Doe\",\n            \"phone\": null,\n            \"tax_id\": null\n          },\n          \"card\": {\n            \"brand\": \"visa\",\n            \"checks\": {\n              \"address_line1_check\": \"pass\",\n              \"address_postal_code_check\": \"pass\",\n              \"cvc_check\": \"pass\"\n            },\n            \"country\": \"US\",\n            \"display_brand\": \"visa\",\n            \"exp_month\": 11,\n            \"exp_year\": 2026,\n            \"fingerprint\": \"mZkoRizHb5PdJf0T\",\n            \"funding\": \"credit\",\n            \"generated_from\": null,\n            \"last4\": \"0341\",\n            \"networks\": {\n              \"available\": [\n                \"visa\"\n              ],\n              \"preferred\": null\n            },\n            \"regulated_status\": \"unregulated\",\n            \"three_d_secure_usage\": {\n              \"supported\": true\n            },\n            \"wallet\": null\n          },\n          \"created\": 1000000000,\n          \"customer\": \"cus_NORMALIZED\",\n          \"livemode\": false,\n          \"metadata\": {},\n          \"type\": \"card\"\n        },\n        \"type\": \"card_error\"\n      },\n      \"latest_charge\": \"ch_NORMALIZED\",\n      \"livemode\": false,\n      \"metadata\": {},\n      \"next_action\": null,\n      \"on_behalf_of\": null,\n      \"payment_details\": {\n        \"customer_reference\": null,\n        \"order_reference\": \"in_1SVWoDDwzgQ85STg31e2Dg\"\n      },\n      \"payment_method\": null,\n      \"payment_method_configuration_details\": null,\n      \"payment_method_options\": {\n        \"card\": {\n          \"installments\": null,\n          \"mandate_options\": null,\n          \"network\": null,\n          \"request_three_d_secure\": \"automatic\"\n        },\n        \"link\": {\n          \"persistent_token\": null\n        }\n      },\n      \"payment_method_types\": [\n        \"card\",\n        \"link\"\n      ],\n      \"processing\": null,\n      \"receipt_email\": \"hamlet@zulip.com\",\n      \"review\": null,\n      \"setup_future_usage\": null,\n      \"shipping\": null,\n      \"source\": null,\n      \"statement_descriptor\": null,\n      \"statement_descriptor_suffix\": null,\n      \"status\": \"requires_payment_method\",\n      \"transfer_data\": null,\n      \"transfer_group\": null\n    },\n    \"payment_method\": {\n      \"id\": \"replace_payment_method--Customer.retrieve.7.json\",\n      \"object\": \"payment_method\",\n      \"allow_redisplay\": \"unspecified\",\n      \"billing_details\": {\n        \"address\": {\n          \"city\": \"San Francisco\",\n          \"country\": \"US\",\n          \"line1\": \"123 Main St\",\n          \"line2\": null,\n          \"postal_code\": \"94105\",\n          \"state\": \"CA\"\n        },\n        \"email\": null,\n        \"name\": \"John Doe\",\n        \"phone\": null,\n        \"tax_id\": null\n      },\n      \"card\": {\n        \"brand\": \"visa\",\n        \"checks\": {\n          \"address_line1_check\": \"pass\",\n          \"address_postal_code_check\": \"pass\",\n          \"cvc_check\": \"pass\"\n        },\n        \"country\": \"US\",\n        \"display_brand\": \"visa\",\n        \"exp_month\": 11,\n        \"exp_year\": 2026,\n        \"fingerprint\": \"mZkoRizHb5PdJf0T\",\n        \"funding\": \"credit\",\n        \"generated_from\": null,\n        \"last4\": \"0341\",\n        \"networks\": {\n          \"available\": [\n            \"visa\"\n          ],\n          \"preferred\": null\n        },\n        \"regulated_status\": \"unregulated\",\n        \"three_d_secure_usage\": {\n          \"supported\": true\n        },\n        \"wallet\": null\n      },\n      \"created\": 1000000000,\n      \"customer\": \"cus_NORMALIZED\",\n      \"livemode\": false,\n      \"metadata\": {},\n      \"type\": \"card\"\n    },\n    \"request_log_url\": \"https://dashboard.stripe.com/test/logs/req_NORMALIZED?t=1763641085\",\n    \"type\": \"card_error\"\n  }\n}\n",
  "http_status": 402,
  "json_body": {
    "error": {
      "advice_code": "try_again_later",
      "charge": "ch_NORMALIZED",
      "code": "card_declined",
      "decline_code": "generic_decline",
      "doc_url": "https://stripe.com/docs/error-codes/card-declined",
      "message": "Your card was declined.",
      "network_decline_code": "01",
      "payment_intent": {
        "amount": 5000,
        "amount_capturable": 0,
        "amount_details": {
          "tip": {}
        },
        "amount_received": 0,
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
        "id": "replace_payment_method--Invoice.pay.2.json",
        "last_payment_error": {
          "advice_code": "try_again_later",
          "charge": "ch_NORMALIZED",
          "code": "card_declined",
          "decline_code": "generic_decline",
          "doc_url": "https://stripe.com/docs/error-codes/card-declined",
          "message": "Your card was declined.",
          "network_decline_code": "01",
          "payment_method": {
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
              "last4": "0341",
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
            "customer": "cus_NORMALIZED",
            "id": "replace_payment_method--Customer.retrieve.7.json",
            "livemode": false,
            "metadata": {},
            "object": "payment_method",
            "type": "card"
          },
          "type": "card_error"
        },
        "latest_charge": "ch_NORMALIZED",
        "livemode": false,
        "metadata": {},
        "next_action": null,
        "object": "payment_intent",
        "on_behalf_of": null,
        "payment_details": {
          "customer_reference": null,
          "order_reference": "in_1SVWoDDwzgQ85STg31e2Dg"
        },
        "payment_method": null,
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
        "statement_descriptor": null,
        "statement_descriptor_suffix": null,
        "status": "requires_payment_method",
        "transfer_data": null,
        "transfer_group": null
      },
      "payment_method": {
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
          "last4": "0341",
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
        "customer": "cus_NORMALIZED",
        "id": "replace_payment_method--Customer.retrieve.7.json",
        "livemode": false,
        "metadata": {},
        "object": "payment_method",
        "type": "card"
      },
      "request_log_url": "https://dashboard.stripe.com/test/logs/req_NORMALIZED?t=1763641085",
      "type": "card_error"
    }
  },
  "param": null,
  "request_id": "req_NORMALIZED"
}
```

--------------------------------------------------------------------------------

````
