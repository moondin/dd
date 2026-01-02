---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 239
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 239 of 1290)

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

---[FILE: void_all_open_invoices--Invoice.list.3.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/void_all_open_invoices--Invoice.list.3.json

```json
{
  "data": [
    {
      "account_country": "US",
      "account_name": "NORMALIZED",
      "account_tax_ids": null,
      "amount_due": 6400,
      "amount_overpaid": 0,
      "amount_paid": 0,
      "amount_remaining": 6400,
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
      "collection_method": "send_invoice",
      "created": 1000000000,
      "currency": "usd",
      "custom_fields": null,
      "customer": "cus_NORMALIZED",
      "customer_address": null,
      "customer_email": "iago@zulip.com",
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
      "id": "void_all_open_invoices--Invoice.create.1.json",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
      "issuer": {
        "type": "self"
      },
      "last_finalization_error": null,
      "latest_revision": null,
      "lines": {
        "data": [
          {
            "amount": 6400,
            "currency": "usd",
            "description": "Zulip Cloud Standard upgrade",
            "discount_amounts": [],
            "discountable": false,
            "discounts": [],
            "id": "void_all_open_invoices--Invoice.finalize_invoice.1.json",
            "invoice": "void_all_open_invoices--Invoice.create.1.json",
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
              "unit_amount_decimal": "800"
            },
            "quantity": 8,
            "taxes": []
          }
        ],
        "has_more": false,
        "object": "list",
        "total_count": 1,
        "url": "/v1/invoices/void_all_open_invoices--Invoice.create.1.json/lines"
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
      "status": "void",
      "status_transitions": {
        "finalized_at": 1000000000,
        "marked_uncollectible_at": null,
        "paid_at": null,
        "voided_at": 1000000000
      },
      "subtotal": 6400,
      "subtotal_excluding_tax": 6400,
      "test_clock": null,
      "total": 6400,
      "total_discount_amounts": [],
      "total_excluding_tax": 6400,
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

---[FILE: void_all_open_invoices--Invoice.list.4.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/void_all_open_invoices--Invoice.list.4.json

```json
{
  "data": [
    {
      "account_country": "US",
      "account_name": "NORMALIZED",
      "account_tax_ids": null,
      "amount_due": 6400,
      "amount_overpaid": 0,
      "amount_paid": 0,
      "amount_remaining": 6400,
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
      "customer_email": "king@lear.org",
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
      "id": "void_all_open_invoices--Invoice.create.2.json",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
      "issuer": {
        "type": "self"
      },
      "last_finalization_error": null,
      "latest_revision": null,
      "lines": {
        "data": [
          {
            "amount": 6400,
            "currency": "usd",
            "description": "Zulip Cloud Standard upgrade",
            "discount_amounts": [],
            "discountable": false,
            "discounts": [],
            "id": "void_all_open_invoices--Invoice.finalize_invoice.2.json",
            "invoice": "void_all_open_invoices--Invoice.create.2.json",
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
              "unit_amount_decimal": "800"
            },
            "quantity": 8,
            "taxes": []
          }
        ],
        "has_more": false,
        "object": "list",
        "total_count": 1,
        "url": "/v1/invoices/void_all_open_invoices--Invoice.create.2.json/lines"
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
      "subtotal": 6400,
      "subtotal_excluding_tax": 6400,
      "test_clock": null,
      "total": 6400,
      "total_discount_amounts": [],
      "total_excluding_tax": 6400,
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

---[FILE: void_all_open_invoices--Invoice.list.5.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/void_all_open_invoices--Invoice.list.5.json

```json
{
  "data": [],
  "has_more": false,
  "object": "list",
  "url": "/v1/invoices"
}
```

--------------------------------------------------------------------------------

---[FILE: void_all_open_invoices--Invoice.list.6.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/void_all_open_invoices--Invoice.list.6.json

```json
{
  "data": [
    {
      "account_country": "US",
      "account_name": "NORMALIZED",
      "account_tax_ids": null,
      "amount_due": 6400,
      "amount_overpaid": 0,
      "amount_paid": 0,
      "amount_remaining": 6400,
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
      "collection_method": "send_invoice",
      "created": 1000000000,
      "currency": "usd",
      "custom_fields": null,
      "customer": "cus_NORMALIZED",
      "customer_address": null,
      "customer_email": "king@lear.org",
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
      "id": "void_all_open_invoices--Invoice.create.2.json",
      "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
      "issuer": {
        "type": "self"
      },
      "last_finalization_error": null,
      "latest_revision": null,
      "lines": {
        "data": [
          {
            "amount": 6400,
            "currency": "usd",
            "description": "Zulip Cloud Standard upgrade",
            "discount_amounts": [],
            "discountable": false,
            "discounts": [],
            "id": "void_all_open_invoices--Invoice.finalize_invoice.2.json",
            "invoice": "void_all_open_invoices--Invoice.create.2.json",
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
              "unit_amount_decimal": "800"
            },
            "quantity": 8,
            "taxes": []
          }
        ],
        "has_more": false,
        "object": "list",
        "total_count": 1,
        "url": "/v1/invoices/void_all_open_invoices--Invoice.create.2.json/lines"
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
      "status": "void",
      "status_transitions": {
        "finalized_at": 1000000000,
        "marked_uncollectible_at": null,
        "paid_at": null,
        "voided_at": 1000000000
      },
      "subtotal": 6400,
      "subtotal_excluding_tax": 6400,
      "test_clock": null,
      "total": 6400,
      "total_discount_amounts": [],
      "total_excluding_tax": 6400,
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

---[FILE: void_all_open_invoices--Invoice.void_invoice.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/void_all_open_invoices--Invoice.void_invoice.1.json

```json
{
  "account_country": "US",
  "account_name": "NORMALIZED",
  "account_tax_ids": null,
  "amount_due": 6400,
  "amount_overpaid": 0,
  "amount_paid": 0,
  "amount_remaining": 6400,
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
  "collection_method": "send_invoice",
  "created": 1000000000,
  "currency": "usd",
  "custom_fields": null,
  "customer": "cus_NORMALIZED",
  "customer_address": null,
  "customer_email": "iago@zulip.com",
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
  "id": "void_all_open_invoices--Invoice.create.1.json",
  "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
  "issuer": {
    "type": "self"
  },
  "last_finalization_error": null,
  "latest_revision": null,
  "lines": {
    "data": [
      {
        "amount": 6400,
        "currency": "usd",
        "description": "Zulip Cloud Standard upgrade",
        "discount_amounts": [],
        "discountable": false,
        "discounts": [],
        "id": "void_all_open_invoices--Invoice.finalize_invoice.1.json",
        "invoice": "void_all_open_invoices--Invoice.create.1.json",
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
          "unit_amount_decimal": "800"
        },
        "quantity": 8,
        "taxes": []
      }
    ],
    "has_more": false,
    "object": "list",
    "total_count": 1,
    "url": "/v1/invoices/void_all_open_invoices--Invoice.create.1.json/lines"
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
  "status": "void",
  "status_transitions": {
    "finalized_at": 1000000000,
    "marked_uncollectible_at": null,
    "paid_at": null,
    "voided_at": 1000000000
  },
  "subtotal": 6400,
  "subtotal_excluding_tax": 6400,
  "test_clock": null,
  "total": 6400,
  "total_discount_amounts": [],
  "total_excluding_tax": 6400,
  "total_pretax_credit_amounts": [],
  "total_taxes": [],
  "webhooks_delivered_at": 1000000000
}
```

--------------------------------------------------------------------------------

---[FILE: void_all_open_invoices--Invoice.void_invoice.2.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/void_all_open_invoices--Invoice.void_invoice.2.json

```json
{
  "account_country": "US",
  "account_name": "NORMALIZED",
  "account_tax_ids": null,
  "amount_due": 6400,
  "amount_overpaid": 0,
  "amount_paid": 0,
  "amount_remaining": 6400,
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
  "collection_method": "send_invoice",
  "created": 1000000000,
  "currency": "usd",
  "custom_fields": null,
  "customer": "cus_NORMALIZED",
  "customer_address": null,
  "customer_email": "king@lear.org",
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
  "id": "void_all_open_invoices--Invoice.create.2.json",
  "invoice_pdf": "https://pay.stripe.com/invoice/acct_NORMALIZED/test_NORMALIZED/pdf?s=ap",
  "issuer": {
    "type": "self"
  },
  "last_finalization_error": null,
  "latest_revision": null,
  "lines": {
    "data": [
      {
        "amount": 6400,
        "currency": "usd",
        "description": "Zulip Cloud Standard upgrade",
        "discount_amounts": [],
        "discountable": false,
        "discounts": [],
        "id": "void_all_open_invoices--Invoice.finalize_invoice.2.json",
        "invoice": "void_all_open_invoices--Invoice.create.2.json",
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
          "unit_amount_decimal": "800"
        },
        "quantity": 8,
        "taxes": []
      }
    ],
    "has_more": false,
    "object": "list",
    "total_count": 1,
    "url": "/v1/invoices/void_all_open_invoices--Invoice.create.2.json/lines"
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
  "status": "void",
  "status_transitions": {
    "finalized_at": 1000000000,
    "marked_uncollectible_at": null,
    "paid_at": null,
    "voided_at": 1000000000
  },
  "subtotal": 6400,
  "subtotal_excluding_tax": 6400,
  "test_clock": null,
  "total": 6400,
  "total_discount_amounts": [],
  "total_excluding_tax": 6400,
  "total_pretax_credit_amounts": [],
  "total_taxes": [],
  "webhooks_delivered_at": 1000000000
}
```

--------------------------------------------------------------------------------

---[FILE: void_all_open_invoices--InvoiceItem.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/void_all_open_invoices--InvoiceItem.create.1.json

```json
{
  "amount": 6400,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Cloud Standard upgrade",
  "discountable": false,
  "discounts": [],
  "id": "void_all_open_invoices--InvoiceItem.create.1.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 6400,
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
    "unit_amount_decimal": "800"
  },
  "proration": false,
  "quantity": 8,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: void_all_open_invoices--InvoiceItem.create.2.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/void_all_open_invoices--InvoiceItem.create.2.json

```json
{
  "amount": 6400,
  "currency": "usd",
  "customer": "cus_NORMALIZED",
  "date": 1000000000,
  "description": "Zulip Cloud Standard upgrade",
  "discountable": false,
  "discounts": [],
  "id": "void_all_open_invoices--InvoiceItem.create.2.json",
  "invoice": "in_NORMALIZED",
  "livemode": false,
  "metadata": {},
  "net_amount": 6400,
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
    "unit_amount_decimal": "800"
  },
  "proration": false,
  "quantity": 8,
  "tax_rates": [],
  "test_clock": null
}
```

--------------------------------------------------------------------------------

---[FILE: audit_logs.py]---
Location: zulip-main/corporate/views/audit_logs.py
Signals: Django

```python
from typing import Any

from django.http import HttpRequest, HttpResponse, HttpResponseNotFound
from django.shortcuts import render

from corporate.lib.activity import ActivityHeaderEntry, format_optional_datetime, make_table
from zerver.decorator import require_server_admin
from zerver.lib.typed_endpoint import PathOnly
from zerver.models.realm_audit_logs import AbstractRealmAuditLog, AuditLogEventType
from zilencer.models import RemoteRealmAuditLog, RemoteZulipServer, RemoteZulipServerAuditLog

USER_ROLES_KEY = "100: owner, 200: admin, 300: moderator, 400: member, 600: guest"


def get_remote_realm_host(audit_log: RemoteRealmAuditLog) -> str:
    if audit_log.remote_realm is None:
        # For pre-8.0 servers, we might only have the realm ID and thus
        # no RemoteRealm object yet, so we show that information instead.
        return f"N/A, realm ID: {audit_log.realm_id}"
    return audit_log.remote_realm.host


def get_human_role_count_data(audit_log: RemoteRealmAuditLog | RemoteZulipServerAuditLog) -> str:
    extra_data = audit_log.extra_data
    role_count = extra_data.get(AbstractRealmAuditLog.ROLE_COUNT, {})
    human_count_raw: dict[str, Any] = role_count.get(AbstractRealmAuditLog.ROLE_COUNT_HUMANS, {})
    if human_count_raw == {}:
        return "N/A"
    human_count_string = ""
    for role, count in human_count_raw.items():
        if int(count) > 0:
            human_count_string += f"{(role)}: {count}, "
    return human_count_string.strip(", ")


@require_server_admin
def get_remote_server_logs(request: HttpRequest, *, uuid: PathOnly[str]) -> HttpResponse:
    try:
        remote_server = RemoteZulipServer.objects.get(uuid=uuid)
    except RemoteZulipServer.DoesNotExist:
        return HttpResponseNotFound()

    remote_server_audit_logs = RemoteZulipServerAuditLog.objects.filter(
        server=remote_server
    ).order_by("-id")
    remote_realm_audit_logs = (
        RemoteRealmAuditLog.objects.filter(server=remote_server)
        .order_by("-id")
        .select_related("remote_realm")
    )

    title = f"{remote_server.hostname}"
    cols = [
        "Event time",
        "Event type",
        "Audit log ID",
        "Remote realm host",
        "Role count: human",
    ]

    def row(audit_log: RemoteRealmAuditLog | RemoteZulipServerAuditLog) -> list[Any]:
        return [
            audit_log.event_time,
            AuditLogEventType(audit_log.event_type).name,
            audit_log.id if isinstance(audit_log, RemoteRealmAuditLog) else f"S{audit_log.id}",
            get_remote_realm_host(audit_log) if isinstance(audit_log, RemoteRealmAuditLog) else "",
            get_human_role_count_data(audit_log)
            if audit_log.event_type in AbstractRealmAuditLog.SYNCED_BILLING_EVENTS
            else "",
        ]

    remote_server_audit_log_rows = list(map(row, remote_server_audit_logs))
    remote_realm_audit_log_rows = list(map(row, remote_realm_audit_logs))
    rows = remote_server_audit_log_rows + remote_realm_audit_log_rows

    header_entries = []
    if remote_server.last_version is not None:
        header_entries.append(
            ActivityHeaderEntry(
                name="Zulip version",
                value=remote_server.last_version,
            )
        )
    header_entries.append(
        ActivityHeaderEntry(
            name="Last audit log update",
            value=format_optional_datetime(remote_server.last_audit_log_update),
        )
    )
    header_entries.append(ActivityHeaderEntry(name="Role key", value=USER_ROLES_KEY))

    content = make_table(title, cols, rows, header=header_entries)

    return render(
        request,
        "corporate/activity/activity.html",
        context=dict(
            data=content,
            title=title,
            is_home=False,
        ),
    )
```

--------------------------------------------------------------------------------

````
