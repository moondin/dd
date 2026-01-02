---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1257
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1257 of 1290)

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

---[FILE: view.py]---
Location: zulip-main/zerver/webhooks/stripe/view.py
Signals: Django

```python
# Webhooks for external integrations.
import time
from collections.abc import Sequence

from django.http import HttpRequest, HttpResponse

from zerver.decorator import webhook_view
from zerver.lib.exceptions import UnsupportedWebhookEventTypeError
from zerver.lib.response import json_success
from zerver.lib.timestamp import datetime_to_global_time, timestamp_to_datetime
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_bool, check_int, check_none_or, check_string
from zerver.lib.webhooks.common import check_send_webhook_message
from zerver.models import UserProfile


class SuppressedEventError(Exception):
    pass


class NotImplementedEventTypeError(SuppressedEventError):
    pass


ALL_EVENT_TYPES = [
    "charge.dispute.closed",
    "charge.dispute.created",
    "charge.failed",
    "charge.succeeded",
    "charge.succeeded",
    "customer.created",
    "customer.created",
    "customer.deleted",
    "customer.discount.created",
    "customer.subscription.created",
    "customer.subscription.deleted",
    "customer.subscription.trial_will_end",
    "customer.subscription.updated",
    "customer.updated",
    "invoice.created",
    "invoice.updated",
    "invoice.payment_failed",
    "invoiceitem.created",
    "charge.refund.updated",
    "charge.refund.updated",
]


@webhook_view("Stripe", all_event_types=ALL_EVENT_TYPES)
@typed_endpoint
def api_stripe_webhook(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    payload: JsonBodyPayload[WildValue],
    stream: str = "test",
) -> HttpResponse:
    try:
        topic_name, body = topic_and_body(payload)
    except SuppressedEventError:  # nocoverage
        return json_success(request)
    check_send_webhook_message(
        request, user_profile, topic_name, body, payload["type"].tame(check_string)
    )
    return json_success(request)


def topic_and_body(payload: WildValue) -> tuple[str, str]:
    event_type = payload["type"].tame(
        check_string
    )  # invoice.created, customer.subscription.created, etc
    if len(event_type.split(".")) == 3:
        category, resource, event = event_type.split(".")
    else:
        resource, event = event_type.split(".")
        category = resource

    object_ = payload["data"]["object"]  # The full, updated Stripe object

    # Set the topic to the customer_id when we can
    topic_name = ""
    customer_id = object_.get("customer").tame(check_none_or(check_string))
    if customer_id is not None:
        # Running into the 60 character topic limit.
        # topic = '[{}](https://dashboard.stripe.com/customers/{})' % (customer_id, customer_id)
        topic_name = customer_id
    body = None

    def update_string(blacklist: Sequence[str] = []) -> str:
        assert "previous_attributes" in payload["data"]
        previous_attributes = set(payload["data"]["previous_attributes"].keys()).difference(
            blacklist
        )
        if not previous_attributes:  # nocoverage
            raise SuppressedEventError
        return "".join(
            "\n* "
            + attribute.replace("_", " ").capitalize()
            + " is now "
            + stringify(object_[attribute].value)
            for attribute in sorted(previous_attributes)
        )

    def default_body(update_blacklist: Sequence[str] = []) -> str:
        body = "{resource} {verbed}".format(
            resource=linkified_id(object_["id"].tame(check_string)), verbed=event.replace("_", " ")
        )
        if event == "updated":
            return body + update_string(blacklist=update_blacklist)
        return body

    if category == "account":  # nocoverage
        if resource == "account":
            if event == "updated":
                if "previous_attributes" not in payload["data"]:
                    raise SuppressedEventError
                topic_name = "account updates"
                body = update_string()
        else:
            # Part of Stripe Connect
            raise NotImplementedEventTypeError
    if category == "application_fee":  # nocoverage
        # Part of Stripe Connect
        raise NotImplementedEventTypeError
    if category == "balance":  # nocoverage
        # Not that interesting to most businesses, I think
        raise NotImplementedEventTypeError
    if category == "charge":
        if resource == "charge":
            if not topic_name:  # only in legacy fixtures
                topic_name = "charges"
            body = "{resource} for {amount} {verbed}".format(
                resource=linkified_id(object_["id"].tame(check_string)),
                amount=amount_string(
                    object_["amount"].tame(check_int), object_["currency"].tame(check_string)
                ),
                verbed=event,
            )
            if object_["failure_code"]:  # nocoverage
                body += ". Failure code: {}".format(object_["failure_code"].tame(check_string))
        if resource == "dispute":
            topic_name = "disputes"
            body = default_body() + ". Current status: {status}.".format(
                status=object_["status"].tame(check_string).replace("_", " ")
            )
        if resource == "refund":
            topic_name = "refunds"
            body = "A {resource} for a {charge} of {amount} was updated.".format(
                resource=linkified_id(object_["id"].tame(check_string), lower=True),
                charge=linkified_id(object_["charge"].tame(check_string), lower=True),
                amount=amount_string(
                    object_["amount"].tame(check_int), object_["currency"].tame(check_string)
                ),
            )
    if category == "checkout_beta":  # nocoverage
        # Not sure what this is
        raise NotImplementedEventTypeError
    if category == "coupon":  # nocoverage
        # Not something that likely happens programmatically
        raise NotImplementedEventTypeError
    if category == "customer":
        if resource == "customer":
            # Running into the 60 character topic limit.
            # topic = '[{}](https://dashboard.stripe.com/customers/{})' % (object_['id'], object_['id'])
            topic_name = object_["id"].tame(check_string)
            body = default_body(update_blacklist=["delinquent", "currency", "default_source"])
            if event == "created":
                if object_["email"]:
                    body += "\nEmail: {}".format(object_["email"].tame(check_string))
                if object_["metadata"]:  # nocoverage
                    for key, value in object_["metadata"].items():
                        body += f"\n{key}: {value.tame(check_string)}"
        if resource == "discount":
            body = "Discount {verbed} ([{coupon_name}]({coupon_url})).".format(
                verbed=event.replace("_", " "),
                coupon_name=object_["coupon"]["name"].tame(check_string),
                coupon_url="https://dashboard.stripe.com/{}/{}".format(
                    "coupons", object_["coupon"]["id"].tame(check_string)
                ),
            )
        if resource == "source":  # nocoverage
            body = default_body()
        if resource == "subscription":
            body = default_body()
            if event == "trial_will_end":
                DAY = 60 * 60 * 24  # seconds in a day
                # Basically always three: https://stripe.com/docs/api/python#event_types
                body += " in {days} days".format(
                    days=int((object_["trial_end"].tame(check_int) - time.time() + DAY // 2) // DAY)
                )
            if event == "created":
                if object_["plan"]:
                    nickname = object_["plan"]["nickname"].tame(check_none_or(check_string))
                    if nickname is not None:
                        body += "\nPlan: [{plan_nickname}](https://dashboard.stripe.com/plans/{plan_id})".format(
                            plan_nickname=object_["plan"]["nickname"].tame(check_string),
                            plan_id=object_["plan"]["id"].tame(check_string),
                        )
                    else:
                        body += "\nPlan: https://dashboard.stripe.com/plans/{plan_id}".format(
                            plan_id=object_["plan"]["id"].tame(check_string),
                        )
                if object_["quantity"]:
                    body += "\nQuantity: {}".format(object_["quantity"].tame(check_int))
                if "billing" in object_:  # nocoverage
                    body += "\nBilling method: {}".format(
                        object_["billing"].tame(check_string).replace("_", " ")
                    )
    if category == "file":  # nocoverage
        topic_name = "files"
        body = default_body() + " ({purpose}). \nTitle: {title}".format(
            purpose=object_["purpose"].tame(check_string).replace("_", " "),
            title=object_["title"].tame(check_string),
        )
    if category == "invoice":
        if event == "upcoming":  # nocoverage
            body = "Upcoming invoice created"
        elif (
            event == "updated"
            and payload["data"]["previous_attributes"].get("paid").tame(check_none_or(check_bool))
            is False
            and object_["paid"].tame(check_bool) is True
            and object_["amount_paid"].tame(check_int) != 0
            and object_["amount_remaining"].tame(check_int) == 0
        ):
            # We are taking advantage of logical AND short circuiting here since we need the else
            # statement below.
            object_id = object_["id"].tame(check_string)
            invoice_link = f"https://dashboard.stripe.com/invoices/{object_id}"
            body = f"[Invoice]({invoice_link}) is now paid"
        else:
            body = default_body(
                update_blacklist=[
                    "lines",
                    "description",
                    "number",
                    "finalized_at",
                    "status_transitions",
                    "payment_intent",
                ]
            )
        if event == "created":
            # Could potentially add link to invoice PDF here
            body += " ({reason})\nTotal: {total}\nAmount due: {due}".format(
                reason=object_["billing_reason"].tame(check_string).replace("_", " "),
                total=amount_string(
                    object_["total"].tame(check_int), object_["currency"].tame(check_string)
                ),
                due=amount_string(
                    object_["amount_due"].tame(check_int), object_["currency"].tame(check_string)
                ),
            )
    if category == "invoiceitem":
        body = default_body(update_blacklist=["description", "invoice"])
        if event == "created":
            body += " for {amount}".format(
                amount=amount_string(
                    object_["amount"].tame(check_int), object_["currency"].tame(check_string)
                )
            )
    if category.startswith("issuing"):  # nocoverage
        # Not implemented
        raise NotImplementedEventTypeError
    if category.startswith("order"):  # nocoverage
        # Not implemented
        raise NotImplementedEventTypeError
    if category in [
        "payment_intent",
        "payout",
        "plan",
        "product",
        "recipient",
        "reporting",
        "review",
        "sigma",
        "sku",
        "source",
        "subscription_schedule",
        "topup",
        "transfer",
    ]:  # nocoverage
        # Not implemented. In theory doing something like
        #   body = default_body()
        # may not be hard for some of these
        raise NotImplementedEventTypeError

    if body is None:
        raise UnsupportedWebhookEventTypeError(event_type)
    return (topic_name, body)


def amount_string(amount: int, currency: str) -> str:
    zero_decimal_currencies = [
        "bif",
        "djf",
        "jpy",
        "krw",
        "pyg",
        "vnd",
        "xaf",
        "xpf",
        "clp",
        "gnf",
        "kmf",
        "mga",
        "rwf",
        "vuv",
        "xof",
    ]
    if currency in zero_decimal_currencies:
        decimal_amount = str(amount)  # nocoverage
    else:
        decimal_amount = f"{float(amount) * 0.01:.02f}"

    if currency == "usd":  # nocoverage
        return "$" + decimal_amount
    return decimal_amount + f" {currency.upper()}"


def linkified_id(object_id: str, lower: bool = False) -> str:
    names_and_urls: dict[str, tuple[str, str | None]] = {
        # Core resources
        "ch": ("Charge", "charges"),
        "cus": ("Customer", "customers"),
        "dp": ("Dispute", "disputes"),
        "du": ("Dispute", "disputes"),
        "file": ("File", "files"),
        "link": ("File link", "file_links"),
        "pi": ("Payment intent", "payment_intents"),
        "po": ("Payout", "payouts"),
        "prod": ("Product", "products"),
        "re": ("Refund", "refunds"),
        "tok": ("Token", "tokens"),
        # Payment methods
        # payment methods have URL prefixes like /customers/cus_id/sources
        "ba": ("Bank account", None),
        "card": ("Card", None),
        "src": ("Source", None),
        # Billing
        # coupons have a configurable id, but the URL prefix is /coupons
        # discounts don't have a URL, I think
        "in": ("Invoice", "invoices"),
        "ii": ("Invoice item", "invoiceitems"),
        # products are covered in core resources
        # plans have a configurable id, though by default they are created with this pattern
        # 'plan': ('Plan', 'plans'),
        "sub": ("Subscription", "subscriptions"),
        "si": ("Subscription item", "subscription_items"),
        # I think usage records have URL prefixes like /subscription_items/si_id/usage_record_summaries
        "mbur": ("Usage record", None),
        # Undocumented :|
        "py": ("Payment", "payments"),
        "pyr": ("Refund", "refunds"),  # Pseudo refunds. Not fully tested.
        # Connect, Fraud, Orders, etc not implemented
    }
    name, url_prefix = names_and_urls[object_id.split("_")[0]]
    if lower:  # nocoverage
        name = name.lower()
    if url_prefix is None:  # nocoverage
        return name
    return f"[{name}](https://dashboard.stripe.com/{url_prefix}/{object_id})"


def stringify(value: object) -> str:
    if isinstance(value, int) and value > 1500000000 and value < 2000000000:
        return datetime_to_global_time(timestamp_to_datetime(value))
    return str(value)
```

--------------------------------------------------------------------------------

---[FILE: account_updated_without_previous_attributes.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/account_updated_without_previous_attributes.json

```json
{
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "account.updated",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2018-02-28",
    "data": {
        "object": {
            "id": "acct_00000000000000",
            "object": "account",
            "business_logo": null,
            "business_logo_large": null,
            "business_name": null,
            "business_primary_color": null,
            "business_url": null,
            "charges_enabled": false,
            "country": "CA",
            "created": 1523744779,
            "debit_negative_balances": true,
            "decline_charge_on": {
                "avs_failure": false,
                "cvc_failure": true
            },
            "default_currency": "cad",
            "details_submitted": true,
            "display_name": null,
            "email": "test@stripe.com",
            "external_accounts": {
                "object": "list",
                "data": [
                ],
                "has_more": false,
                "total_count": 0,
                "url": "/v1/accounts/acct_1CGwp5HSaWXyvFpK/external_accounts"
            },
            "legal_entity": {
                "additional_owners": [
                ],
                "address": {
                    "city": null,
                    "country": "CA",
                    "line1": null,
                    "line2": null,
                    "postal_code": null,
                    "state": null
                },
                "business_name": null,
                "business_tax_id_provided": false,
                "dob": {
                    "day": null,
                    "month": null,
                    "year": null
                },
                "first_name": null,
                "last_name": null,
                "personal_address": {
                    "city": null,
                    "country": "CA",
                    "line1": null,
                    "line2": null,
                    "postal_code": null,
                    "state": null
                },
                "personal_id_number_provided": false,
                "type": null,
                "verification": {
                    "details": null,
                    "details_code": null,
                    "document": null,
                    "document_back": null,
                    "status": "unverified"
                }
            },
            "mcc": null,
            "metadata": {
            },
            "payout_schedule": {
                "delay_days": 7,
                "interval": "daily"
            },
            "payout_statement_descriptor": null,
            "payouts_enabled": false,
            "product_description": null,
            "statement_descriptor": "TEST",
            "support_address": null,
            "support_email": null,
            "support_phone": null,
            "support_url": null,
            "timezone": "America/St_Johns",
            "tos_acceptance": {
                "date": null,
                "ip": null,
                "user_agent": null
            },
            "type": "standard",
            "verification": {
                "disabled_reason": "fields_needed",
                "due_by": 1554669463,
                "fields_needed": [
                    "legal_entity.verification.document"
                ]
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: charge_dispute_closed.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/charge_dispute_closed.json

```json
{
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "charge.dispute.closed",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2016-07-06",
    "data": {
        "object": {
            "id": "dp_00000000000000",
            "object": "dispute",
            "amount": 1001,
            "balance_transactions": [],
            "charge": "ch_00000000000000",
            "created": 1480672052,
            "currency": "aud",
            "evidence": {
                "access_activity_log": null,
                "billing_address": null,
                "cancellation_policy": null,
                "cancellation_policy_disclosure": null,
                "cancellation_rebuttal": null,
                "customer_communication": null,
                "customer_email_address": null,
                "customer_name": null,
                "customer_purchase_ip": null,
                "customer_signature": null,
                "duplicate_charge_documentation": null,
                "duplicate_charge_explanation": null,
                "duplicate_charge_id": null,
                "product_description": null,
                "receipt": null,
                "refund_policy": null,
                "refund_policy_disclosure": null,
                "refund_refusal_explanation": null,
                "service_date": null,
                "service_documentation": null,
                "shipping_address": null,
                "shipping_carrier": null,
                "shipping_date": null,
                "shipping_documentation": null,
                "shipping_tracking_number": null,
                "uncategorized_file": null,
                "uncategorized_text": "Here is some evidence"
            },
            "evidence_details": {
                "due_by": 1482364799,
                "has_evidence": false,
                "past_due": false,
                "submission_count": 0
            },
            "is_charge_refundable": false,
            "livemode": false,
            "metadata": {},
            "reason": "general",
            "status": "won"
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: charge_dispute_created.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/charge_dispute_created.json

```json
{
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "charge.dispute.created",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2016-07-06",
    "data": {
        "object": {
            "id": "dp_00000000000000",
            "object": "dispute",
            "amount": 1000,
            "balance_transactions": [],
            "charge": "ch_00000000000000",
            "created": 1480672043,
            "currency": "jpy",
            "evidence": {
                "access_activity_log": null,
                "billing_address": null,
                "cancellation_policy": null,
                "cancellation_policy_disclosure": null,
                "cancellation_rebuttal": null,
                "customer_communication": null,
                "customer_email_address": null,
                "customer_name": null,
                "customer_purchase_ip": null,
                "customer_signature": null,
                "duplicate_charge_documentation": null,
                "duplicate_charge_explanation": null,
                "duplicate_charge_id": null,
                "product_description": null,
                "receipt": null,
                "refund_policy": null,
                "refund_policy_disclosure": null,
                "refund_refusal_explanation": null,
                "service_date": null,
                "service_documentation": null,
                "shipping_address": null,
                "shipping_carrier": null,
                "shipping_date": null,
                "shipping_documentation": null,
                "shipping_tracking_number": null,
                "uncategorized_file": null,
                "uncategorized_text": null
            },
            "evidence_details": {
                "due_by": 1482364799,
                "has_evidence": false,
                "past_due": false,
                "submission_count": 0
            },
            "is_charge_refundable": false,
            "livemode": false,
            "metadata": {},
            "reason": "general",
            "status": "needs_response"
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: charge_failed.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/charge_failed.json

```json
{
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "charge.failed",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2016-07-06",
    "data": {
        "object": {
            "id": "ch_00000000000000",
            "object": "charge",
            "amount": 100,
            "amount_refunded": 0,
            "application": null,
            "application_fee": null,
            "balance_transaction": "txn_00000000000000",
            "captured": true,
            "created": 1480671978,
            "currency": "aud",
            "customer": null,
            "description": "My First Test Charge (created for API docs)",
            "destination": null,
            "dispute": null,
            "failure_code": null,
            "failure_message": null,
            "fraud_details": {},
            "invoice": null,
            "livemode": false,
            "metadata": {},
            "order": null,
            "outcome": null,
            "paid": false,
            "receipt_email": null,
            "receipt_number": null,
            "refunded": false,
            "refunds": {
                "object": "list",
                "data": [],
                "has_more": false,
                "total_count": 0,
                "url": "/v1/charges/ch_19MDcUCV4wXizEw4AsxeFwTn/refunds"
            },
            "review": null,
            "shipping": null,
            "source": {
                "id": "card_00000000000000",
                "object": "card",
                "address_city": null,
                "address_country": null,
                "address_line1": null,
                "address_line1_check": null,
                "address_line2": null,
                "address_state": null,
                "address_zip": null,
                "address_zip_check": null,
                "brand": "Visa",
                "country": "US",
                "customer": null,
                "cvc_check": null,
                "dynamic_last4": null,
                "exp_month": 8,
                "exp_year": 2017,
                "funding": "credit",
                "last4": "4242",
                "metadata": {},
                "name": null,
                "tokenization_method": null
            },
            "source_transfer": null,
            "statement_descriptor": null,
            "status": "succeeded"
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: charge_succeeded__card.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/charge_succeeded__card.json

```json
{
    "id": "evt_1DbqCuDEQaroqDjsojJSNhmh",
    "pending_webhooks": 1,
    "data": {
        "object": {
            "id": "ch_000000000000000000000000",
            "object": "charge",
            "amount": 100,
            "amount_refunded": 0,
            "application": null,
            "application_fee": null,
            "balance_transaction": "txn_000000000000000000000000",
            "captured": true,
            "created": 1542991183,
            "currency": "aud",
            "customer": "cus_00000000000000",
            "description": null,
            "destination": null,
            "dispute": null,
            "failure_code": null,
            "failure_message": null,
            "fraud_details": {
            },
            "invoice": "in_000000000000000000000000",
            "livemode": true,
            "metadata": {
            },
            "on_behalf_of": null,
            "order": null,
            "outcome": {
                "network_status": "approved_by_network",
                "reason": null,
                "risk_level": "normal",
                "seller_message": "Payment complete.",
                "type": "authorized"
            },
            "paid": true,
            "payment_intent": null,
            "receipt_email": "user@example.com",
            "receipt_number": "0000-0000",
            "refunded": false,
            "refunds": {
                "object": "list",
                "data": [
                ],
                "has_more": false,
                "total_count": 0,
                "url": "/v1/charges/ch_000000000000000000000000/refunds"
            },
            "review": null,
            "shipping": null,
            "source": {
                "id": "card_000000000000000000000000",
                "object": "card",
                "address_city": "city",
                "address_country": "country",
                "address_line1": "line1",
                "address_line1_check": "unavailable",
                "address_line2": null,
                "address_state": "ST",
                "address_zip": "00000",
                "address_zip_check": "unavailable",
                "brand": "Visa",
                "country": "CO",
                "customer": "cus_00000000000000",
                "cvc_check": null,
                "dynamic_last4": null,
                "exp_month": 1,
                "exp_year": 2023,
                "fingerprint": "0000000000000000",
                "funding": "credit",
                "last4": "0000",
                "metadata": {
                },
                "name": "name",
                "tokenization_method": null
            },
            "source_transfer": null,
            "statement_descriptor": "Zulip Cloud Standard",
            "status": "succeeded",
            "transfer_group": null
        }
    },
    "type": "charge.succeeded",
    "api_version": "2018-11-08",
    "object": "event",
    "livemode": true,
    "created": 1543500572
}
```

--------------------------------------------------------------------------------

---[FILE: charge_succeeded__invoice.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/charge_succeeded__invoice.json

```json
{
    "id": "evt_1DbqCuDEQaroqDjsojJSNhmh",
    "pending_webhooks": 1,
    "data": {
        "object": {
            "failure_message": null,
            "id": "py_000000000000000000000000",
            "amount": 100,
            "refunds": {
                "total_count": 0,
                "has_more": false,
                "url": "\/v1\/charges\/py_000000000000000000000000\/refunds",
                "object": "list",
                "data": [

                ]
            },
            "invoice": "in_000000000000000000000000",
            "application": null,
            "source": {
                "id": "src_000000000000000000000000",
                "type": "ach_credit_transfer",
                "usage": "reusable",
                "amount": null,
                "flow": "receiver",
                "customer": "cus_00000000000000",
                "livemode": true,
                "object": "source",
                "owner": {
                    "address": null,
                    "verified_name": null,
                    "email": "username@example.com",
                    "verified_phone": null,
                    "phone": null,
                    "verified_email": null,
                    "verified_address": null,
                    "name": null
                },
                "statement_descriptor": null,
                "metadata": {

                },
                "client_secret": "secret",
                "currency": "usd",
                "receiver": {
                    "amount_received": 100,
                    "refund_attributes_status": "missing",
                    "amount_charged": 100,
                    "amount_returned": 0,
                    "refund_attributes_method": "email",
                    "address": "1234-1234"
                },
                "status": "pending",
                "ach_credit_transfer": {
                    "refund_account_holder_name": null,
                    "bank_name": "WELLS FARGO BANK, N.A.",
                    "fingerprint": "1234",
                    "routing_number": "1234",
                    "swift_code": "WFBIUS6S",
                    "refund_account_holder_type": null,
                    "account_number": "1234",
                    "refund_account_number": null,
                    "refund_routing_number": null
                },
                "created": 1543500572
            },
            "refunded": false,
            "statement_descriptor": null,
            "metadata": {

            },
            "transfer_group": null,
            "amount_refunded": 0,
            "currency": "usd",
            "application_fee": null,
            "source_transfer": null,
            "object": "charge",
            "receipt_email": "username@example.com",
            "receipt_number": "1234-1234",
            "captured": true,
            "failure_code": null,
            "description": null,
            "payment_intent": null,
            "paid": true,
            "shipping": null,
            "livemode": true,
            "balance_transaction": "txn_000000000000000000000000",
            "outcome": {
                "type": "authorized",
                "network_status": "approved_by_network",
                "risk_level": "not_assessed",
                "seller_message": "Payment complete.",
                "reason": null
            },
            "dispute": null,
            "on_behalf_of": null,
            "status": "succeeded",
            "fraud_details": {

            },
            "order": null,
            "review": null,
            "customer": "cus_00000000000000",
            "destination": null,
            "created": 1543500571
        }
    },
    "request": {
        "id": null,
        "idempotency_key": "in_000000000000000000000000"
    },
    "type": "charge.succeeded",
    "api_version": "2018-11-08",
    "object": "event",
    "livemode": true,
    "created": 1543500572
}
```

--------------------------------------------------------------------------------

---[FILE: customer_created.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/customer_created.json

```json
{
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "customer.created",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2016-07-06",
    "data": {
        "object": {
            "id": "cus_00000000000000",
            "object": "customer",
            "account_balance": 0,
            "created": 1480672088,
            "currency": "aud",
            "default_source": null,
            "delinquent": false,
            "description": null,
            "discount": null,
            "email": null,
            "livemode": false,
            "metadata": {},
            "shipping": null,
            "sources": {
                "object": "list",
                "data": [],
                "has_more": false,
                "total_count": 0,
                "url": "/v1/customers/cus_9fYl7K4F7pQxrY/sources"
            },
            "subscriptions": {
                "object": "list",
                "data": [],
                "has_more": false,
                "total_count": 0,
                "url": "/v1/customers/cus_9fYl7K4F7pQxrY/subscriptions"
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: customer_created_email.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/customer_created_email.json

```json
{
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "customer.created",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2016-07-06",
    "data": {
        "object": {
            "id": "cus_00000000000000",
            "object": "customer",
            "account_balance": 0,
            "created": 1480672088,
            "currency": "aud",
            "default_source": null,
            "delinquent": false,
            "description": null,
            "discount": null,
            "email": "example@abc.com",
            "livemode": false,
            "metadata": {},
            "shipping": null,
            "sources": {
                "object": "list",
                "data": [],
                "has_more": false,
                "total_count": 0,
                "url": "/v1/customers/cus_9fYl7K4F7pQxrY/sources"
            },
            "subscriptions": {
                "object": "list",
                "data": [],
                "has_more": false,
                "total_count": 0,
                "url": "/v1/customers/cus_9fYl7K4F7pQxrY/subscriptions"
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: customer_deleted.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/customer_deleted.json

```json
{
    "created": 1326853478,
    "livemode": false,
    "id": "evt_00000000000000",
    "type": "customer.deleted",
    "object": "event",
    "request": null,
    "pending_webhooks": 1,
    "api_version": "2016-07-06",
    "data": {
        "object": {
            "id": "cus_00000000000000",
            "object": "customer",
            "account_balance": 0,
            "created": 1480672097,
            "currency": "aud",
            "default_source": null,
            "delinquent": false,
            "description": null,
            "discount": null,
            "email": null,
            "livemode": false,
            "metadata": {},
            "shipping": null,
            "sources": {
                "object": "list",
                "data": [],
                "has_more": false,
                "total_count": 0,
                "url": "/v1/customers/cus_9fYlWRryEw2I9B/sources"
            },
            "subscriptions": {
                "object": "list",
                "data": [],
                "has_more": false,
                "total_count": 0,
                "url": "/v1/customers/cus_9fYlWRryEw2I9B/subscriptions"
            }
        }
    }
}
```

--------------------------------------------------------------------------------

---[FILE: customer_discount_created.json]---
Location: zulip-main/zerver/webhooks/stripe/fixtures/customer_discount_created.json

```json
{
    "created":1326853478,
    "livemode":false,
    "id":"customer.discount.created_00000000000000",
    "type":"customer.discount.created",
    "object":"event",
    "request":null,
    "pending_webhooks":1,
    "api_version":"2018-02-28",
    "data":{
        "object":{
            "object":"discount",
            "coupon":{
                "id":"25_00000000000000",
                "object":"coupon",
                "amount_off":null,
                "created":1543438043,
                "currency":null,
                "duration":"repeating",
                "duration_in_months":3,
                "livemode":false,
                "max_redemptions":null,
                "metadata":{

                },
                "name":"25.5% off",
                "percent_off":26,
                "percent_off_precise":25.5,
                "redeem_by":null,
                "times_redeemed":0,
                "valid":true
            },
            "customer":"cus_00000000000000",
            "end":1551386843,
            "start":1543438043,
            "subscription":null
        }
    }
}
```

--------------------------------------------------------------------------------

````
