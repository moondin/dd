---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 195
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 195 of 1290)

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

---[FILE: upgrade_by_card_with_outdated_lower_seat_count--SetupIntent.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_lower_seat_count--SetupIntent.create.1.json

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
  "id": "upgrade_by_card_with_outdated_lower_seat_count--SetupIntent.create.1.json",
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

---[FILE: upgrade_by_card_with_outdated_lower_seat_count--SetupIntent.list.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_lower_seat_count--SetupIntent.list.1.json

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
      "id": "upgrade_by_card_with_outdated_lower_seat_count--SetupIntent.list.1.json",
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

---[FILE: upgrade_by_card_with_outdated_lower_seat_count--SetupIntent.retrieve.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_lower_seat_count--SetupIntent.retrieve.1.json

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
  "id": "upgrade_by_card_with_outdated_lower_seat_count--SetupIntent.create.1.json",
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

---[FILE: upgrade_by_card_with_outdated_seat_count--Charge.list.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count--Charge.list.1.json

```json
{
  "data": [
    {
      "amount": 48000,
      "amount_captured": 48000,
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
      "id": "upgrade_by_card_with_outdated_seat_count--Charge.list.1.json",
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
          "amount_authorized": 48000,
          "authorization_code": "137078",
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
            "maximum_amount_capturable": 48000,
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

---[FILE: upgrade_by_card_with_outdated_seat_count--checkout.Session.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count--checkout.Session.create.1.json

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
  "id": "upgrade_by_card_with_outdated_seat_count--checkout.Session.create.1.json",
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

---[FILE: upgrade_by_card_with_outdated_seat_count--checkout.Session.list.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count--checkout.Session.list.1.json

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
      "id": "upgrade_by_card_with_outdated_seat_count--checkout.Session.create.1.json",
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

---[FILE: upgrade_by_card_with_outdated_seat_count--Customer.create.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count--Customer.create.1.json

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
  "id": "upgrade_by_card_with_outdated_seat_count--Customer.create.1.json",
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

---[FILE: upgrade_by_card_with_outdated_seat_count--Customer.modify.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count--Customer.modify.1.json

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
  "id": "upgrade_by_card_with_outdated_seat_count--Customer.create.1.json",
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

---[FILE: upgrade_by_card_with_outdated_seat_count--Customer.retrieve.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count--Customer.retrieve.1.json

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
  "id": "upgrade_by_card_with_outdated_seat_count--Customer.create.1.json",
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
      "customer": "upgrade_by_card_with_outdated_seat_count--Customer.create.1.json",
      "id": "upgrade_by_card_with_outdated_seat_count--Customer.retrieve.1.json",
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

---[FILE: upgrade_by_card_with_outdated_seat_count--Customer.retrieve.2.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count--Customer.retrieve.2.json

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
  "id": "upgrade_by_card_with_outdated_seat_count--Customer.create.1.json",
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
      "customer": "upgrade_by_card_with_outdated_seat_count--Customer.create.1.json",
      "id": "upgrade_by_card_with_outdated_seat_count--Customer.retrieve.1.json",
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

---[FILE: upgrade_by_card_with_outdated_seat_count--Event.list.1.json]---
Location: zulip-main/corporate/tests/stripe_fixtures/upgrade_by_card_with_outdated_seat_count--Event.list.1.json

```json
{
  "data": [
    {
      "api_version": "2025-11-17.clover",
      "created": 1000000000,
      "data": {
        "object": {
          "amount_paid": 48000,
          "amount_requested": 48000,
          "created": 1000000000,
          "currency": "usd",
          "id": "upgrade_by_card_with_outdated_seat_count--Event.list.1.json",
          "invoice": "in_NORMALIZED",
          "is_default": true,
          "livemode": false,
          "object": "invoice_payment",
          "payment": {
            "payment_intent": "pi_NORMALIZED",
            "type": "payment_intent"
          },
          "status": "paid",
          "status_transitions": {
            "canceled_at": null,
            "paid_at": 1000000000
          }
        }
      },
      "id": "upgrade_by_card_with_outdated_seat_count--Event.list.1.json",
      "livemode": false,
      "object": "event",
      "pending_webhooks": 0,
      "request": {
        "id": null,
        "idempotency_key": null
      },
      "type": "invoice_payment.paid"
    }
  ],
  "has_more": true,
  "object": "list",
  "url": "/v1/events"
}
```

--------------------------------------------------------------------------------

````
