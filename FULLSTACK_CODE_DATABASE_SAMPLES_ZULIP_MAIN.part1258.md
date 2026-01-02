---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1258
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1258 of 1290)

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

---[FILE: customer_subscription_created.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/customer_subscription_created.json

```json
{
  "id": "evt_1DeFYZDEQaroqDjsX811NXeq",
  "object": "event",
  "api_version": "2018-11-08",
  "created": 1544074671,
  "data": {
    "object": {
      "id": "sub_E6STM5w5EX3K28",
      "object": "subscription",
      "application_fee_percent": null,
      "billing": "send_invoice",
      "billing_cycle_anchor": 1544074670,
      "cancel_at_period_end": false,
      "canceled_at": null,
      "created": 1544074670,
      "current_period_end": 1575610670,
      "current_period_start": 1544074670,
      "customer": "cus_00000000000000",
      "days_until_due": 7,
      "default_source": null,
      "discount": null,
      "ended_at": null,
      "items": {
        "object": "list",
        "data": [
          {
            "id": "si_E6STR3cU0bwWFG",
            "object": "subscription_item",
            "created": 1544074671,
            "metadata": {
            },
            "plan": {
              "id": "plan_E6SQ6RAtmLVtzg",
              "object": "plan",
              "active": true,
              "aggregate_usage": null,
              "amount": 100,
              "billing_scheme": "per_unit",
              "created": 1544074513,
              "currency": "usd",
              "interval": "year",
              "interval_count": 1,
              "livemode": true,
              "metadata": {
              },
              "nickname": "flatrate",
              "product": "prod_E6SPZ5RKfKClNL",
              "tiers": null,
              "tiers_mode": null,
              "transform_usage": null,
              "trial_period_days": null,
              "usage_type": "licensed"
            },
            "quantity": 800,
            "subscription": "sub_E6STM5w5EX3K28"
          }
        ],
        "has_more": false,
        "total_count": 1,
        "url": "/v1/subscription_items?subscription=sub_E6STM5w5EX3K28"
      },
      "livemode": true,
      "metadata": {
      },
      "plan": {
        "id": "plan_E6SQ6RAtmLVtzg",
        "object": "plan",
        "active": true,
        "aggregate_usage": null,
        "amount": 100,
        "billing_scheme": "per_unit",
        "created": 1544074513,
        "currency": "usd",
        "interval": "year",
        "interval_count": 1,
        "livemode": true,
        "metadata": {
        },
        "nickname": "flatrate",
        "product": "prod_E6SPZ5RKfKClNL",
        "tiers": null,
        "tiers_mode": null,
        "transform_usage": null,
        "trial_period_days": null,
        "usage_type": "licensed"
      },
      "quantity": 800,
      "start": 1544074670,
      "status": "active",
      "tax_percent": null,
      "trial_end": null,
      "trial_start": null
    }
  },
  "livemode": true,
  "pending_webhooks": 1,
  "request": {
    "id": "req_J85F0AkACDDTBU",
    "idempotency_key": null
  },
  "type": "customer.subscription.created"
}
```

--------------------------------------------------------------------------------

---[FILE: customer_subscription_created_no_nickname.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/customer_subscription_created_no_nickname.json

```json
{
  "id": "evt_1DeFYZDEQaroqDjsX811NXeq",
  "object": "event",
  "api_version": "2018-11-08",
  "created": 1544074671,
  "data": {
    "object": {
      "id": "sub_E6STM5w5EX3K28",
      "object": "subscription",
      "application_fee_percent": null,
      "billing": "send_invoice",
      "billing_cycle_anchor": 1544074670,
      "cancel_at_period_end": false,
      "canceled_at": null,
      "created": 1544074670,
      "current_period_end": 1575610670,
      "current_period_start": 1544074670,
      "customer": "cus_00000000000000",
      "days_until_due": 7,
      "default_source": null,
      "discount": null,
      "ended_at": null,
      "items": {
        "object": "list",
        "data": [
          {
            "id": "si_E6STR3cU0bwWFG",
            "object": "subscription_item",
            "created": 1544074671,
            "metadata": {
            },
            "plan": {
              "id": "plan_E6SQ6RAtmLVtzg",
              "object": "plan",
              "active": true,
              "aggregate_usage": null,
              "amount": 100,
              "billing_scheme": "per_unit",
              "created": 1544074513,
              "currency": "usd",
              "interval": "year",
              "interval_count": 1,
              "livemode": true,
              "metadata": {
              },
              "nickname": null,
              "product": "prod_E6SPZ5RKfKClNL",
              "tiers": null,
              "tiers_mode": null,
              "transform_usage": null,
              "trial_period_days": null,
              "usage_type": "licensed"
            },
            "quantity": 800,
            "subscription": "sub_E6STM5w5EX3K28"
          }
        ],
        "has_more": false,
        "total_count": 1,
        "url": "/v1/subscription_items?subscription=sub_E6STM5w5EX3K28"
      },
      "livemode": true,
      "metadata": {
      },
      "plan": {
        "id": "plan_E6SQ6RAtmLVtzg",
        "object": "plan",
        "active": true,
        "aggregate_usage": null,
        "amount": 100,
        "billing_scheme": "per_unit",
        "created": 1544074513,
        "currency": "usd",
        "interval": "year",
        "interval_count": 1,
        "livemode": true,
        "metadata": {
        },
        "nickname": null,
        "product": "prod_E6SPZ5RKfKClNL",
        "tiers": null,
        "tiers_mode": null,
        "transform_usage": null,
        "trial_period_days": null,
        "usage_type": "licensed"
      },
      "quantity": 800,
      "start": 1544074670,
      "status": "active",
      "tax_percent": null,
      "trial_end": null,
      "trial_start": null
    }
  },
  "livemode": true,
  "pending_webhooks": 1,
  "request": {
    "id": "req_J85F0AkACDDTBU",
    "idempotency_key": null
  },
  "type": "customer.subscription.created"
}
```

--------------------------------------------------------------------------------

---[FILE: customer_subscription_deleted.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/customer_subscription_deleted.json

```json
{
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "customer.subscription.deleted",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2016-07-06",
    "data": {
        "object": {
            "id": "sub_00000000000000",
            "object": "subscription",
            "application_fee_percent": null,
            "cancel_at_period_end": false,
            "canceled_at": null,
            "created": 1480672113,
            "current_period_end": 1483350513,
            "current_period_start": 1480672113,
            "customer": "cus_00000000000000",
            "discount": null,
            "ended_at": 1480633660,
            "livemode": false,
            "metadata": {},
            "plan": {
                "id": "gold_00000000000000",
                "object": "plan",
                "amount": 2000,
                "created": 1394782886,
                "currency": "aud",
                "interval": "month",
                "interval_count": 1,
                "livemode": false,
                "metadata": {},
                "name": "Gold Special",
                "statement_descriptor": null,
                "trial_period_days": null
            },
            "quantity": 1,
            "start": 1480672113,
            "status": "canceled",
            "tax_percent": null,
            "trial_end": null,
            "trial_start": null
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: customer_subscription_trial_will_end.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/customer_subscription_trial_will_end.json

```json
{
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "customer.subscription.trial_will_end",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2016-07-06",
    "data": {
        "object": {
            "id": "sub_00000000000000",
            "object": "subscription",
            "application_fee_percent": null,
            "cancel_at_period_end": false,
            "canceled_at": null,
            "created": 1480672121,
            "current_period_end": 1483350521,
            "current_period_start": 1480672121,
            "customer": "cus_00000000000000",
            "discount": null,
            "ended_at": null,
            "livemode": false,
            "metadata": {},
            "plan": {
                "id": "gold_00000000000000",
                "object": "plan",
                "amount": 2000,
                "created": 1394782886,
                "currency": "aud",
                "interval": "month",
                "interval_count": 1,
                "livemode": false,
                "metadata": {},
                "name": "Gold Special",
                "statement_descriptor": null,
                "trial_period_days": null
            },
            "quantity": 1,
            "start": 1480672121,
            "status": "trialing",
            "tax_percent": null,
            "trial_end": 1480892861,
            "trial_start": 1480633661
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: customer_subscription_updated.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/customer_subscription_updated.json

```json
{
  "id": "evt_1DeFo8DEQaroqDjsk4tzzzdV",
  "object": "event",
  "api_version": "2018-11-08",
  "created": 1544075636,
  "data": {
    "object": {
      "id": "sub_E6STM5w5EX3K28",
      "object": "subscription",
      "application_fee_percent": null,
      "billing": "send_invoice",
      "billing_cycle_anchor": 1572609600,
      "cancel_at_period_end": false,
      "canceled_at": null,
      "created": 1544074670,
      "current_period_end": 1572609600,
      "current_period_start": 1544075635,
      "customer": "cus_00000000000000",
      "days_until_due": 7,
      "default_source": null,
      "discount": null,
      "ended_at": null,
      "items": {
        "object": "list",
        "data": [
          {
            "id": "si_E6STR3cU0bwWFG",
            "object": "subscription_item",
            "created": 1544074671,
            "metadata": {
            },
            "plan": {
              "id": "plan_E6SQ6RAtmLVtzg",
              "object": "plan",
              "active": true,
              "aggregate_usage": null,
              "amount": 100,
              "billing_scheme": "per_unit",
              "created": 1544074513,
              "currency": "usd",
              "interval": "year",
              "interval_count": 1,
              "livemode": true,
              "metadata": {
              },
              "nickname": "flatrate",
              "product": "prod_E6SPZ5RKfKClNL",
              "tiers": null,
              "tiers_mode": null,
              "transform_usage": null,
              "trial_period_days": null,
              "usage_type": "licensed"
            },
            "quantity": 800,
            "subscription": "sub_E6STM5w5EX3K28"
          }
        ],
        "has_more": false,
        "total_count": 1,
        "url": "/v1/subscription_items?subscription=sub_E6STM5w5EX3K28"
      },
      "livemode": true,
      "metadata": {
      },
      "plan": {
        "id": "plan_E6SQ6RAtmLVtzg",
        "object": "plan",
        "active": true,
        "aggregate_usage": null,
        "amount": 100,
        "billing_scheme": "per_unit",
        "created": 1544074513,
        "currency": "usd",
        "interval": "year",
        "interval_count": 1,
        "livemode": true,
        "metadata": {
        },
        "nickname": "flatrate",
        "product": "prod_E6SPZ5RKfKClNL",
        "tiers": null,
        "tiers_mode": null,
        "transform_usage": null,
        "trial_period_days": null,
        "usage_type": "licensed"
      },
      "quantity": 800,
      "start": 1544075635,
      "status": "trialing",
      "tax_percent": null,
      "trial_end": 1572609600,
      "trial_start": 1544075635
    },
    "previous_attributes": {
      "billing_cycle_anchor": 1544074670,
      "current_period_end": 1575610670,
      "current_period_start": 1544074670,
      "start": 1544074670,
      "status": "active",
      "trial_end": null,
      "trial_start": null
    }
  },
  "livemode": true,
  "pending_webhooks": 1,
  "request": {
    "id": "req_X3p7qbGSX2wZ8D",
    "idempotency_key": null
  },
  "type": "customer.subscription.updated"
}
```

--------------------------------------------------------------------------------

---[FILE: customer_updated__account_balance.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/customer_updated__account_balance.json

```json
{
    "id": "evt_1DbqCuDEQaroqDjsIkZIT6uP",
    "object": "event",
    "api_version": "2018-11-08",
    "created": 1543500572,
    "data": {
        "object": {
            "id": "cus_00000000000000",
            "object": "customer",
            "account_balance": 100,
            "created": 1543971209,
            "currency": "usd",
            "default_source": "src_1DdoduGh0CmXqmnwKJmq8lpv",
            "delinquent": false,
            "description": "zulip (Zulip Dev)",
            "discount": null,
            "email": "hamlet@zulip.com",
            "invoice_prefix": "6E2831C",
            "livemode": false,
            "metadata": {
                "realm_id": "2",
                "realm_str": "zulip"
            },
            "shipping": null,
            "sources": {
                "object": "list",
                "data": [
                    {
                        "id": "src_1DdoduGh0CmXqmnwKJmq8lpv",
                        "object": "source",
                        "ach_credit_transfer": {
                            "account_number": "test_a479e261d1bb",
                            "bank_name": "TEST BANK",
                            "fingerprint": "cAzkzdbKgZYS8NhC",
                            "routing_number": "110000000",
                            "swift_code": "TSTEZ122",
                            "refund_routing_number": null,
                            "refund_account_number": null,
                            "refund_account_holder_type": null,
                            "refund_account_holder_name": null
                        },
                        "amount": null,
                        "client_secret": "src_client_secret_E60fLRPcrzhAJNmOjvsUHTli",
                        "created": 1543971214,
                        "currency": "usd",
                        "customer": "cus_E60fF1CuG8K36D",
                        "flow": "receiver",
                        "livemode": false,
                        "metadata": {
                        },
                        "owner": {
                            "address": null,
                            "email": "amount_0@stripe.com",
                            "name": null,
                            "phone": null,
                            "verified_address": null,
                            "verified_email": null,
                            "verified_name": null,
                            "verified_phone": null
                        },
                        "receiver": {
                            "address": "110000000-test_a479e261d1bb",
                            "amount_charged": 0,
                            "amount_received": 0,
                            "amount_returned": 0,
                            "refund_attributes_method": "email",
                            "refund_attributes_status": "missing"
                        },
                        "statement_descriptor": null,
                        "status": "pending",
                        "type": "ach_credit_transfer",
                        "usage": "reusable"
                    }
                ],
                "has_more": false,
                "total_count": 1,
                "url": "/v1/customers/cus_E60fF1CuG8K36D/sources"
            },
            "subscriptions": {
                "object": "list",
                "data": [
                    {
                        "id": "sub_E60fxv28JMUWOG",
                        "object": "subscription",
                        "application_fee_percent": null,
                        "billing": "send_invoice",
                        "billing_cycle_anchor": 1543971209,
                        "cancel_at_period_end": false,
                        "canceled_at": null,
                        "created": 1543971209,
                        "current_period_end": 1575507209,
                        "current_period_start": 1543971209,
                        "customer": "cus_E60fF1CuG8K36D",
                        "days_until_due": 30,
                        "default_source": null,
                        "discount": null,
                        "ended_at": null,
                        "items": {
                            "object": "list",
                            "data": [
                                {
                                    "id": "si_E60fDuBL4e55ZF",
                                    "object": "subscription_item",
                                    "created": 1543971210,
                                    "metadata": {
                                    },
                                    "plan": {
                                        "id": "plan_Do3xCvbzO89OsR",
                                        "object": "plan",
                                        "active": true,
                                        "aggregate_usage": null,
                                        "amount": 8000,
                                        "billing_scheme": "per_unit",
                                        "created": 1539831971,
                                        "currency": "usd",
                                        "interval": "year",
                                        "interval_count": 1,
                                        "livemode": false,
                                        "metadata": {
                                        },
                                        "nickname": "annual",
                                        "product": "prod_Do3x494SetTDpx",
                                        "tiers": null,
                                        "tiers_mode": null,
                                        "transform_usage": null,
                                        "trial_period_days": null,
                                        "usage_type": "licensed"
                                    },
                                    "quantity": 8,
                                    "subscription": "sub_E60fxv28JMUWOG"
                                }
                            ],
                            "has_more": false,
                            "total_count": 1,
                            "url": "/v1/subscription_items?subscription=sub_E60fxv28JMUWOG"
                        },
                        "livemode": false,
                        "metadata": {
                        },
                        "plan": {
                            "id": "plan_Do3xCvbzO89OsR",
                            "object": "plan",
                            "active": true,
                            "aggregate_usage": null,
                            "amount": 8000,
                            "billing_scheme": "per_unit",
                            "created": 1539831971,
                            "currency": "usd",
                            "interval": "year",
                            "interval_count": 1,
                            "livemode": false,
                            "metadata": {
                            },
                            "nickname": "annual",
                            "product": "prod_Do3x494SetTDpx",
                            "tiers": null,
                            "tiers_mode": null,
                            "transform_usage": null,
                            "trial_period_days": null,
                            "usage_type": "licensed"
                        },
                        "quantity": 8,
                        "start": 1543971210,
                        "status": "active",
                        "tax_percent": 0,
                        "trial_end": null,
                        "trial_start": null
                    }
                ],
                "has_more": false,
                "total_count": 1,
                "url": "/v1/customers/cus_E60fF1CuG8K36D/subscriptions"
            },
            "tax_info": null,
            "tax_info_verification": null
        },
        "previous_attributes": {
            "account_balance": 0
        }
    },
    "livemode": true,
    "pending_webhooks": 1,
    "request": {
        "id": null,
        "idempotency_key": null
    },
    "type": "customer.updated"
}
```

--------------------------------------------------------------------------------

---[FILE: invoiceitem_created.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/invoiceitem_created.json

```json
{
  "created": 1326853478,
  "livemode": false,
  "id": "invoiceitem.created_00000000000000",
  "type": "invoiceitem.created",
  "object": "event",
  "request": null,
  "pending_webhooks": 1,
  "api_version": "2018-02-28",
  "data": {
    "object": {
      "id": "ii_00000000000000",
      "object": "invoiceitem",
      "amount": 1000,
      "currency": "cad",
      "customer": "cus_00000000000000",
      "date": 1549404213,
      "description": "My First Invoice Item (created for API docs)",
      "discountable": true,
      "invoice": null,
      "livemode": false,
      "metadata": {
      },
      "period": {
        "end": 1549404213,
        "start": 1549404213
      },
      "plan": null,
      "proration": false,
      "quantity": 1,
      "subscription": null,
      "unit_amount": 1000
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: invoiceitem_updated__description.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/invoiceitem_updated__description.json

```json
{
    "object": "event",
    "type": "invoiceitem.updated",
    "pending_webhooks": 1,
    "created": 1560063405,
    "livemode": false,
    "request": {
        "idempotency_key": null,
        "id": "req_9TWblyRuNHDMEr"
    },
    "data": {
        "previous_attributes": {
            "description": null
        },
        "object": {
            "customer": "cus_FDmT2sIGjFskP2",
            "discountable": true,
            "livemode": false,
            "description": "Watermelons",
            "subscription": null,
            "proration": false,
            "object": "invoiceitem",
            "period": {
                "start": 1560063400,
                "end": 1560063400
            },
            "tax_rates": [],
            "currency": "usd",
            "amount": 0,
            "plan": null,
            "invoice": "in_1EjKuzHuGUuNWDDZmFUP3FxU",
            "date": 1560063400,
            "unit_amount": 0,
            "quantity": 1,
            "id": "ii_1EjKxIHuGUuNWDDZhiVHinLl",
            "metadata": {}
        }
    },
    "id": "evt_1EjKxNHuGUuNWDDZXVzriO4I",
    "api_version": "2019-03-14"
}
```

--------------------------------------------------------------------------------

---[FILE: invoiceitem_updated__quantity.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/invoiceitem_updated__quantity.json

```json
{
    "object": "event",
    "type": "invoiceitem.updated",
    "pending_webhooks": 1,
    "created": 1560063407,
    "livemode": false,
    "request": {
        "idempotency_key": null,
        "id": "req_AApRWrApSzs6rP"
    },
    "data": {
        "previous_attributes": {
            "quantity": 1
        },
        "object": {
            "customer": "cus_FDmT2sIGjFskP2",
            "discountable": true,
            "livemode": false,
            "description": "Watermelons",
            "subscription": null,
            "proration": false,
            "object": "invoiceitem",
            "period": {
                "start": 1560063400,
                "end": 1560063400
            },
            "tax_rates": [],
            "currency": "usd",
            "amount": 0,
            "plan": null,
            "invoice": "in_1EjKuzHuGUuNWDDZmFUP3FxU",
            "date": 1560063400,
            "unit_amount": 0,
            "quantity": 0,
            "id": "ii_1EjKxIHuGUuNWDDZhiVHinLl",
            "metadata": {}
        }
    },
    "id": "evt_1EjKxPHuGUuNWDDZvbb9RsLf",
    "api_version": "2019-03-14"
}
```

--------------------------------------------------------------------------------

---[FILE: invoice_created.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/invoice_created.json

```json
{
    "id": "evt_1GpmuvHLwdCOCoR7Q22hCa2N",
    "object": "event",
    "api_version": "2020-03-02",
    "created": 1591153524,
    "data": {
        "object": {
            "id": "in_1GpmuuHLwdCOCoR7ghzQDQLW",
            "object": "invoice",
            "account_country": "IN",
            "account_name": null,
            "amount_due": 0,
            "amount_paid": 0,
            "amount_remaining": 0,
            "application_fee_amount": null,
            "attempt_count": 0,
            "attempted": false,
            "auto_advance": false,
            "billing_reason": "manual",
            "charge": null,
            "collection_method": "send_invoice",
            "created": 1591153524,
            "currency": "inr",
            "custom_fields": null,
            "customer": "cus_HH97asvHvaYQYp",
            "customer_address": null,
            "customer_email": "zenitsu_agatsuma@mail.example.com",
            "customer_name": "Zenitsu Agatsuma",
            "customer_phone": null,
            "customer_shipping": {
                "address": {
                    "city": "",
                    "country": "",
                    "line1": "",
                    "line2": "",
                    "postal_code": "",
                    "state": ""
                },
                "name": "Zenitsu Agatsuma",
                "phone": ""
            },
            "customer_tax_exempt": "none",
            "customer_tax_ids": [],
            "default_payment_method": null,
            "default_source": null,
            "default_tax_rates": [],
            "description": null,
            "discount": null,
            "due_date": null,
            "ending_balance": null,
            "footer": null,
            "hosted_invoice_url": null,
            "invoice_pdf": null,
            "lines": {
                "object": "list",
                "data": [
                    {
                        "id": "il_1GpmuuHLwdCOCoR7nCRM5MXl",
                        "object": "line_item",
                        "amount": 0,
                        "currency": "inr",
                        "description": null,
                        "discountable": true,
                        "invoice_item": "ii_1GpmuuHLwdCOCoR7VOeTr2BM",
                        "livemode": false,
                        "metadata": {},
                        "period": {
                            "end": 1591153524,
                            "start": 1591153524
                        },
                        "plan": null,
                        "price": {
                            "id": "price_1GpmuuHLwdCOCoR7ff5A7n1i",
                            "object": "price",
                            "active": false,
                            "billing_scheme": "per_unit",
                            "created": 1591153524,
                            "currency": "inr",
                            "livemode": false,
                            "lookup_key": null,
                            "metadata": {},
                            "nickname": null,
                            "product": "prod_HOa5MrXjZ9YBuA",
                            "recurring": null,
                            "tiers_mode": null,
                            "transform_quantity": null,
                            "type": "one_time",
                            "unit_amount": 0,
                            "unit_amount_decimal": "0"
                        },
                        "proration": false,
                        "quantity": 1,
                        "subscription": null,
                        "tax_amounts": [],
                        "tax_rates": [],
                        "type": "invoiceitem"
                    }
                ],
                "has_more": false,
                "total_count": 1,
                "url": "/v1/invoices/in_1GpmuuHLwdCOCoR7ghzQDQLW/lines"
            },
            "livemode": false,
            "metadata": {},
            "next_payment_attempt": null,
            "number": null,
            "paid": false,
            "payment_intent": null,
            "period_end": 1591153524,
            "period_start": 1591153524,
            "post_payment_credit_notes_amount": 0,
            "pre_payment_credit_notes_amount": 0,
            "receipt_number": null,
            "starting_balance": 0,
            "statement_descriptor": null,
            "status": "draft",
            "status_transitions": {
                "finalized_at": null,
                "marked_uncollectible_at": null,
                "paid_at": null,
                "voided_at": null
            },
            "subscription": null,
            "subtotal": 0,
            "tax": null,
            "tax_percent": null,
            "total": 0,
            "total_tax_amounts": [],
            "transfer_data": null,
            "webhooks_delivered_at": null
        }
    },
    "livemode": false,
    "pending_webhooks": 1,
    "request": {
        "id": "req_cz0vh1VJ1U4MzE",
        "idempotency_key": null
    },
    "type": "invoice.created"
}
```

--------------------------------------------------------------------------------

---[FILE: invoice_payment_failed.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/invoice_payment_failed.json

```json
{
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "invoice.payment_failed",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2016-07-06",
    "data": {
        "object": {
            "id": "in_00000000000000",
            "object": "invoice",
            "amount_due": 0,
            "application_fee": null,
            "attempt_count": 0,
            "attempted": true,
            "charge": null,
            "closed": false,
            "currency": "aud",
            "customer": "cus_00000000000000",
            "date": 1480672129,
            "description": null,
            "discount": null,
            "ending_balance": null,
            "forgiven": false,
            "lines": {
                "data": [
                    {
                        "id": "sub_9fYmJQOQy04yoh",
                        "object": "line_item",
                        "amount": 2000,
                        "currency": "aud",
                        "description": null,
                        "discountable": true,
                        "livemode": true,
                        "metadata": {},
                        "period": {
                            "start": 1483350529,
                            "end": 1486028929
                        },
                        "plan": {
                            "id": "gold",
                            "object": "plan",
                            "amount": 2000,
                            "created": 1480672129,
                            "currency": "aud",
                            "interval": "month",
                            "interval_count": 1,
                            "livemode": false,
                            "metadata": {},
                            "name": "Gold Special",
                            "statement_descriptor": null,
                            "trial_period_days": null
                        },
                        "proration": false,
                        "quantity": 1,
                        "subscription": null,
                        "type": "subscription"
                    }
                ],
                "total_count": 1,
                "object": "list",
                "url": "/v1/invoices/in_19MDevCV4wXizEw4B4lY7YPR/lines"
            },
            "livemode": false,
            "metadata": {},
            "next_payment_attempt": 1480675729,
            "paid": false,
            "period_end": 1480672129,
            "period_start": 1480672129,
            "receipt_number": null,
            "starting_balance": 0,
            "statement_descriptor": null,
            "subscription": null,
            "subtotal": 0,
            "tax": null,
            "tax_percent": null,
            "total": 0,
            "webhooks_delivered_at": null
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: invoice_updated__open.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/invoice_updated__open.json

```json
{
    "object": "event",
    "type": "invoice.updated",
    "pending_webhooks": 1,
    "created": 1560063585,
    "livemode": false,
    "request": {
        "idempotency_key": null,
        "id": "req_wRT7KgbXvlQMfC"
    },
    "data": {
        "previous_attributes": {
            "status": "draft",
            "due_date": null,
            "invoice_pdf": null,
            "status_transitions": {
                "finalized_at": null
            },
            "number": "B7C8CA7D-DRAFT",
            "ending_balance": null,
            "payment_intent": null,
            "hosted_invoice_url": null
        },
        "object": {
            "default_tax_rates": [],
            "livemode": false,
            "tax": null,
            "number": "B7C8CA7D-0001",
            "attempt_count": 0,
            "currency": "usd",
            "payment_intent": "pi_1EjL0HHuGUuNWDDZ6TdrsWzQ",
            "default_payment_method": null,
            "total": 3000,
            "account_name": null,
            "custom_fields": [
                {
                    "name": "Custom field",
                    "value": "test value"
                }
            ],
            "customer_name": "Test Customer",
            "customer_shipping": null,
            "customer_tax_ids": [],
            "invoice_pdf": "https://pay.stripe.com/invoice/invst_444pftvnD8HFMJCXHn6TQKTDMc/pdf",
            "billing": "send_invoice",
            "footer": "Some random help and legal information.",
            "description": "Thank you for your business!",
            "customer_phone": null,
            "id": "in_1EjKuzHuGUuNWDDZmFUP3FxU",
            "webhooks_delivered_at": 1560063257,
            "charge": null,
            "period_end": 1560063257,
            "discount": null,
            "customer_tax_exempt": "none",
            "post_payment_credit_notes_amount": 0,
            "metadata": {},
            "status": "open",
            "due_date": 1562655586,
            "pre_payment_credit_notes_amount": 0,
            "customer_email": "test_customer@test.gmail.com",
            "collection_method": "send_invoice",
            "statement_descriptor": null,
            "attempted": false,
            "amount_paid": 0,
            "object": "invoice",
            "amount_remaining": 3000,
            "paid": false,
            "customer_address": null,
            "auto_advance": true,
            "ending_balance": 0,
            "billing_reason": "manual",
            "hosted_invoice_url": "https://pay.stripe.com/invoice/invst_444pftvnD8HFMJCXHn6TQKTDMc",
            "period_start": 1560063257,
            "subtotal": 3000,
            "tax_percent": null,
            "subscription": null,
            "customer": "cus_FDmT2sIGjFskP2",
            "total_tax_amounts": [],
            "application_fee_amount": null,
            "next_payment_attempt": null,
            "created": 1560063257,
            "status_transitions": {
                "voided_at": null,
                "finalized_at": 1560063585,
                "marked_uncollectible_at": null,
                "paid_at": null
            },
            "default_source": null,
            "lines": {
                "has_more": false,
                "total_count": 2,
                "object": "list",
                "data": [
                    {
                        "discountable": true,
                        "livemode": false,
                        "description": "Watermelons",
                        "subscription": null,
                        "proration": false,
                        "object": "line_item",
                        "period": {
                            "start": 1560063400,
                            "end": 1560063400
                        },
                        "tax_rates": [],
                        "currency": "usd",
                        "amount": 1000,
                        "invoice_item": "ii_1EjKxIHuGUuNWDDZhiVHinLl",
                        "tax_amounts": [],
                        "plan": null,
                        "quantity": 2,
                        "type": "invoiceitem",
                        "id": "ii_1EjKxIHuGUuNWDDZhiVHinLl",
                        "metadata": {}
                    },
                    {
                        "discountable": true,
                        "livemode": false,
                        "description": "Apples",
                        "subscription": null,
                        "proration": false,
                        "object": "line_item",
                        "period": {
                            "start": 1560063257,
                            "end": 1560063257
                        },
                        "tax_rates": [],
                        "currency": "usd",
                        "amount": 2000,
                        "invoice_item": "ii_1EjKuzHuGUuNWDDZKrPUb2KA",
                        "tax_amounts": [],
                        "plan": null,
                        "quantity": 10,
                        "type": "invoiceitem",
                        "id": "ii_1EjKuzHuGUuNWDDZKrPUb2KA",
                        "metadata": {}
                    }
                ],
                "url": "/v1/invoices/in_1EjKuzHuGUuNWDDZmFUP3FxU/lines"
            },
            "account_country": "US",
            "starting_balance": 0,
            "amount_due": 3000,
            "receipt_number": null
        }
    },
    "id": "evt_1EjL0IHuGUuNWDDZCFLOYrNv",
    "api_version": "2019-03-14"
}
```

--------------------------------------------------------------------------------

````
