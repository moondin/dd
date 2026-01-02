---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:12Z
part: 27
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 27 of 1290)

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

---[FILE: plans.py]---
Location: zulip-main/corporate/models/plans.py
Signals: Django

```python
from django.db import models
from django.db.models import CASCADE
from typing_extensions import override

from corporate.models.customers import Customer, get_customer_by_realm
from zerver.models import Realm


class AbstractCustomerPlan(models.Model):
    # A customer can only have one ACTIVE / CONFIGURED plan,
    # but old, inactive / processed plans are preserved to allow
    # auditing - so there can be multiple CustomerPlan / CustomerPlanOffer
    # objects pointing to one Customer.
    customer = models.ForeignKey(Customer, on_delete=CASCADE)

    fixed_price = models.IntegerField(null=True)

    class Meta:
        abstract = True


class CustomerPlanOffer(AbstractCustomerPlan):
    """
    This is for storing offers configured via /support which
    the customer is yet to buy or schedule a purchase.

    Once customer buys or schedules a purchase, we create a
    CustomerPlan record. The record in this table stays for
    audit purpose with status=PROCESSED.
    """

    TIER_CLOUD_STANDARD = 1
    TIER_CLOUD_PLUS = 2
    TIER_SELF_HOSTED_BASIC = 103
    TIER_SELF_HOSTED_BUSINESS = 104
    tier = models.SmallIntegerField()

    # Whether the offer is:
    # * only configured
    # * processed by the customer to buy or schedule a purchase.
    CONFIGURED = 1
    PROCESSED = 2
    status = models.SmallIntegerField()

    # ID of invoice sent when chose to 'Pay by invoice'.
    sent_invoice_id = models.CharField(max_length=255, null=True)

    @override
    def __str__(self) -> str:
        return f"{self.name} for {self.customer!r} (status: {self.get_plan_status_as_text()})"

    def get_plan_status_as_text(self) -> str:
        return {
            self.CONFIGURED: "Configured",
            self.PROCESSED: "Processed",
        }[self.status]

    @staticmethod
    def name_from_tier(tier: int) -> str:
        return {
            CustomerPlanOffer.TIER_CLOUD_STANDARD: "Zulip Cloud Standard",
            CustomerPlanOffer.TIER_CLOUD_PLUS: "Zulip Cloud Plus",
            CustomerPlanOffer.TIER_SELF_HOSTED_BASIC: "Zulip Basic",
            CustomerPlanOffer.TIER_SELF_HOSTED_BUSINESS: "Zulip Business",
        }[tier]

    @property
    def name(self) -> str:
        return self.name_from_tier(self.tier)


class CustomerPlan(AbstractCustomerPlan):
    """
    This is for storing most of the fiddly details
    of the customer's plan.
    """

    automanage_licenses = models.BooleanField(default=False)
    charge_automatically = models.BooleanField(default=False)

    # Both of the price_per_license and fixed_price are in cents. Exactly
    # one of them should be set. fixed_price is only for manual deals, and
    # can't be set via the self-serve billing system.
    price_per_license = models.IntegerField(null=True)

    # Discount for current `billing_schedule`. For display purposes only.
    # Explicitly set to be TextField to avoid being used in calculations.
    # NOTE: This discount can be different for annual and monthly schedules.
    discount = models.TextField(null=True)

    # Initialized with the time of plan creation. Used for calculating
    # start of next billing cycle, next invoice date etc. This value
    # should never be modified. The only exception is when we change
    # the status of the plan from free trial to active and reset the
    # billing_cycle_anchor.
    billing_cycle_anchor = models.DateTimeField()

    BILLING_SCHEDULE_ANNUAL = 1
    BILLING_SCHEDULE_MONTHLY = 2
    BILLING_SCHEDULES = {
        BILLING_SCHEDULE_ANNUAL: "Annual",
        BILLING_SCHEDULE_MONTHLY: "Monthly",
    }
    billing_schedule = models.SmallIntegerField()

    # The next date the billing system should go through ledger
    # entries and create invoices for additional users or plan
    # renewal. Since we use a daily cron job for invoicing, the
    # invoice will be generated the first time the cron job runs after
    # next_invoice_date.
    next_invoice_date = models.DateTimeField(db_index=True, null=True)

    # Flag to track if an email has been sent to Zulip team for delay
    # of invoicing by >= one day. Helps to send an email only once
    # and not every time when cron run.
    stale_audit_log_data_email_sent = models.BooleanField(default=False)

    # Flag to track if an email has been sent to Zulip team to
    # review the pricing, 60 days before the end date. Helps to send
    # an email only once and not every time when cron run.
    reminder_to_review_plan_email_sent = models.BooleanField(default=False)

    # On next_invoice_date, we call invoice_plan, which goes through
    # ledger entries that were created after invoiced_through and
    # process them. An invoice will be generated for any additional
    # users and/or plan renewal (if it's the end of the billing cycle).
    # Once all new ledger entries have been processed, invoiced_through
    # will be have been set to the last ledger entry we checked.
    invoiced_through = models.ForeignKey(
        "LicenseLedger", null=True, on_delete=CASCADE, related_name="+"
    )
    end_date = models.DateTimeField(null=True)

    INVOICING_STATUS_DONE = 1
    INVOICING_STATUS_STARTED = 2
    INVOICING_STATUS_INITIAL_INVOICE_TO_BE_SENT = 3
    # This status field helps ensure any errors encountered during the
    # invoicing process do not leave our invoicing system in a broken
    # state.
    invoicing_status = models.SmallIntegerField(default=INVOICING_STATUS_DONE)

    TIER_CLOUD_STANDARD = 1
    TIER_CLOUD_PLUS = 2
    # Reserved tier IDs for future use
    TIER_CLOUD_COMMUNITY = 3
    TIER_CLOUD_ENTERPRISE = 4

    TIER_SELF_HOSTED_BASE = 100
    TIER_SELF_HOSTED_LEGACY = 101
    TIER_SELF_HOSTED_COMMUNITY = 102
    TIER_SELF_HOSTED_BASIC = 103
    TIER_SELF_HOSTED_BUSINESS = 104
    TIER_SELF_HOSTED_ENTERPRISE = 105
    tier = models.SmallIntegerField()

    PAID_PLAN_TIERS = [
        TIER_CLOUD_STANDARD,
        TIER_CLOUD_PLUS,
        TIER_SELF_HOSTED_BASIC,
        TIER_SELF_HOSTED_BUSINESS,
        TIER_SELF_HOSTED_ENTERPRISE,
    ]

    COMPLIMENTARY_PLAN_TIERS = [TIER_SELF_HOSTED_LEGACY]

    ACTIVE = 1
    DOWNGRADE_AT_END_OF_CYCLE = 2
    FREE_TRIAL = 3
    SWITCH_TO_ANNUAL_AT_END_OF_CYCLE = 4
    SWITCH_PLAN_TIER_NOW = 5
    SWITCH_TO_MONTHLY_AT_END_OF_CYCLE = 6
    DOWNGRADE_AT_END_OF_FREE_TRIAL = 7
    SWITCH_PLAN_TIER_AT_PLAN_END = 8
    # "Live" plans should have a value < LIVE_STATUS_THRESHOLD.
    # There should be at most one live plan per customer.
    LIVE_STATUS_THRESHOLD = 10
    ENDED = 11
    NEVER_STARTED = 12
    status = models.SmallIntegerField(default=ACTIVE)

    # Currently, all the fixed-price plans are configured for one year.
    # In future, we might change this to a field.
    FIXED_PRICE_PLAN_DURATION_MONTHS = 12

    # TODO maybe override setattr to ensure billing_cycle_anchor, etc
    # are immutable.

    @override
    def __str__(self) -> str:
        return f"{self.name} for {self.customer!r} (status: {self.get_plan_status_as_text()})"

    @staticmethod
    def name_from_tier(tier: int) -> str:
        # NOTE: Check `statement_descriptor` values after updating this.
        # Stripe has a 22 character limit on the statement descriptor length.
        # https://stripe.com/docs/payments/account/statement-descriptors
        return {
            CustomerPlan.TIER_CLOUD_STANDARD: "Zulip Cloud Standard",
            CustomerPlan.TIER_CLOUD_PLUS: "Zulip Cloud Plus",
            CustomerPlan.TIER_CLOUD_ENTERPRISE: "Zulip Enterprise",
            CustomerPlan.TIER_SELF_HOSTED_BASIC: "Zulip Basic",
            CustomerPlan.TIER_SELF_HOSTED_BUSINESS: "Zulip Business",
            CustomerPlan.TIER_SELF_HOSTED_COMMUNITY: "Community",
            # Complimentary access plans should never be billed through Stripe,
            # so the tier name can exceed the 22 character limit noted above.
            CustomerPlan.TIER_SELF_HOSTED_LEGACY: "Zulip Basic (complimentary)",
        }[tier]

    @property
    def name(self) -> str:
        return self.name_from_tier(self.tier)

    def get_plan_status_as_text(self) -> str:
        return {
            self.ACTIVE: "Active",
            self.DOWNGRADE_AT_END_OF_CYCLE: "Downgrade end of cycle",
            self.FREE_TRIAL: "Free trial",
            self.SWITCH_TO_ANNUAL_AT_END_OF_CYCLE: "Scheduled switch to annual",
            self.SWITCH_TO_MONTHLY_AT_END_OF_CYCLE: "Scheduled switch to monthly",
            self.DOWNGRADE_AT_END_OF_FREE_TRIAL: "Downgrade end of free trial",
            self.SWITCH_PLAN_TIER_AT_PLAN_END: "New plan scheduled",
            self.ENDED: "Ended",
            self.NEVER_STARTED: "Never started",
        }[self.status]

    def licenses(self) -> int:
        from corporate.models.licenses import LicenseLedger

        ledger_entry = LicenseLedger.objects.filter(plan=self).order_by("id").last()
        assert ledger_entry is not None
        return ledger_entry.licenses

    def licenses_at_next_renewal(self) -> int | None:
        from corporate.models.licenses import LicenseLedger

        if self.status in (
            CustomerPlan.DOWNGRADE_AT_END_OF_CYCLE,
            CustomerPlan.DOWNGRADE_AT_END_OF_FREE_TRIAL,
        ):
            return None
        ledger_entry = LicenseLedger.objects.filter(plan=self).order_by("id").last()
        assert ledger_entry is not None
        return ledger_entry.licenses_at_next_renewal

    def is_free_trial(self) -> bool:
        return self.status == CustomerPlan.FREE_TRIAL

    def is_complimentary_access_plan(self) -> bool:
        return self.tier in self.COMPLIMENTARY_PLAN_TIERS

    def is_a_paid_plan(self) -> bool:
        return self.tier in self.PAID_PLAN_TIERS


def get_current_plan_by_customer(customer: Customer) -> CustomerPlan | None:
    return CustomerPlan.objects.filter(
        customer=customer, status__lt=CustomerPlan.LIVE_STATUS_THRESHOLD
    ).first()


def get_current_plan_by_realm(realm: Realm) -> CustomerPlan | None:
    customer = get_customer_by_realm(realm)
    if customer is None:
        return None
    return get_current_plan_by_customer(customer)
```

--------------------------------------------------------------------------------

---[FILE: sponsorships.py]---
Location: zulip-main/corporate/models/sponsorships.py
Signals: Django

```python
from enum import Enum

from django.db import models
from django.db.models import CASCADE

from corporate.models.customers import Customer
from zerver.models import Realm, UserProfile


class SponsoredPlanTypes(Enum):
    # unspecified used for cloud sponsorship requests
    UNSPECIFIED = ""
    COMMUNITY = "Community"
    BASIC = "Basic"
    BUSINESS = "Business"


class ZulipSponsorshipRequest(models.Model):
    customer = models.ForeignKey(Customer, on_delete=CASCADE)
    requested_by = models.ForeignKey(UserProfile, on_delete=CASCADE, null=True, blank=True)

    org_type = models.PositiveSmallIntegerField(
        default=Realm.ORG_TYPES["unspecified"]["id"],
        choices=[(t["id"], t["name"]) for t in Realm.ORG_TYPES.values()],
    )

    MAX_ORG_URL_LENGTH: int = 200
    org_website = models.URLField(max_length=MAX_ORG_URL_LENGTH, blank=True, null=True)

    org_description = models.TextField(default="")
    expected_total_users = models.TextField(default="")
    plan_to_use_zulip = models.TextField(default="")
    paid_users_count = models.TextField(default="")
    paid_users_description = models.TextField(default="")

    requested_plan = models.CharField(
        max_length=50,
        choices=[(plan.value, plan.name) for plan in SponsoredPlanTypes],
        default=SponsoredPlanTypes.UNSPECIFIED.value,
    )
```

--------------------------------------------------------------------------------

---[FILE: stripe_state.py]---
Location: zulip-main/corporate/models/stripe_state.py
Signals: Django

```python
from typing import Any, Union

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.db.models import CASCADE, SET_NULL

from corporate.models.customers import Customer


class Event(models.Model):
    stripe_event_id = models.CharField(max_length=255)

    type = models.CharField(max_length=255)

    RECEIVED = 1
    EVENT_HANDLER_STARTED = 30
    EVENT_HANDLER_FAILED = 40
    EVENT_HANDLER_SUCCEEDED = 50
    status = models.SmallIntegerField(default=RECEIVED)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField(db_index=True)
    content_object = GenericForeignKey("content_type", "object_id")

    handler_error = models.JSONField(default=None, null=True)

    def get_event_handler_details_as_dict(self) -> dict[str, Any]:
        details_dict = {}
        details_dict["status"] = {
            Event.RECEIVED: "not_started",
            Event.EVENT_HANDLER_STARTED: "started",
            Event.EVENT_HANDLER_FAILED: "failed",
            Event.EVENT_HANDLER_SUCCEEDED: "succeeded",
        }[self.status]
        if self.handler_error:
            details_dict["error"] = self.handler_error
        return details_dict


def get_last_associated_event_by_type(
    content_object: Union["Invoice", "PaymentIntent", "Session"], event_type: str
) -> Event | None:
    content_type = ContentType.objects.get_for_model(type(content_object))
    return Event.objects.filter(
        content_type=content_type, object_id=content_object.id, type=event_type
    ).last()


class Session(models.Model):
    customer = models.ForeignKey(Customer, on_delete=CASCADE)
    stripe_session_id = models.CharField(max_length=255, unique=True)

    CARD_UPDATE_FROM_BILLING_PAGE = 40
    CARD_UPDATE_FROM_UPGRADE_PAGE = 50
    type = models.SmallIntegerField()

    CREATED = 1
    COMPLETED = 10
    status = models.SmallIntegerField(default=CREATED)

    # Did the user opt to manually manage licenses before clicking on update button?
    is_manual_license_management_upgrade_session = models.BooleanField(default=False)

    # CustomerPlan tier that the user is upgrading to.
    tier = models.SmallIntegerField(null=True)

    def get_status_as_string(self) -> str:
        return {Session.CREATED: "created", Session.COMPLETED: "completed"}[self.status]

    def get_type_as_string(self) -> str:
        return {
            Session.CARD_UPDATE_FROM_BILLING_PAGE: "card_update_from_billing_page",
            Session.CARD_UPDATE_FROM_UPGRADE_PAGE: "card_update_from_upgrade_page",
        }[self.type]

    def to_dict(self) -> dict[str, Any]:
        session_dict: dict[str, Any] = {}

        session_dict["status"] = self.get_status_as_string()
        session_dict["type"] = self.get_type_as_string()
        session_dict["is_manual_license_management_upgrade_session"] = (
            self.is_manual_license_management_upgrade_session
        )
        session_dict["tier"] = self.tier
        event = self.get_last_associated_event()
        if event is not None:
            session_dict["event_handler"] = event.get_event_handler_details_as_dict()
        return session_dict

    def get_last_associated_event(self) -> Event | None:
        if self.status == Session.CREATED:
            return None
        return get_last_associated_event_by_type(self, "checkout.session.completed")


class PaymentIntent(models.Model):  # nocoverage
    customer = models.ForeignKey(Customer, on_delete=CASCADE)
    stripe_payment_intent_id = models.CharField(max_length=255, unique=True)

    REQUIRES_PAYMENT_METHOD = 1
    REQUIRES_CONFIRMATION = 20
    REQUIRES_ACTION = 30
    PROCESSING = 40
    REQUIRES_CAPTURE = 50
    CANCELLED = 60
    SUCCEEDED = 70

    status = models.SmallIntegerField()
    last_payment_error = models.JSONField(default=None, null=True)

    @classmethod
    def get_status_integer_from_status_text(cls, status_text: str) -> int:
        return getattr(cls, status_text.upper())

    def get_status_as_string(self) -> str:
        return {
            PaymentIntent.REQUIRES_PAYMENT_METHOD: "requires_payment_method",
            PaymentIntent.REQUIRES_CONFIRMATION: "requires_confirmation",
            PaymentIntent.REQUIRES_ACTION: "requires_action",
            PaymentIntent.PROCESSING: "processing",
            PaymentIntent.REQUIRES_CAPTURE: "requires_capture",
            PaymentIntent.CANCELLED: "cancelled",
            PaymentIntent.SUCCEEDED: "succeeded",
        }[self.status]

    def get_last_associated_event(self) -> Event | None:
        if self.status == PaymentIntent.SUCCEEDED:
            event_type = "payment_intent.succeeded"
        # TODO: Add test for this case. Not sure how to trigger naturally.
        else:  # nocoverage
            return None  # nocoverage
        return get_last_associated_event_by_type(self, event_type)

    def to_dict(self) -> dict[str, Any]:
        payment_intent_dict: dict[str, Any] = {}
        payment_intent_dict["status"] = self.get_status_as_string()
        event = self.get_last_associated_event()
        if event is not None:
            payment_intent_dict["event_handler"] = event.get_event_handler_details_as_dict()
        return payment_intent_dict


class Invoice(models.Model):
    customer = models.ForeignKey(Customer, on_delete=CASCADE)
    stripe_invoice_id = models.CharField(max_length=255, unique=True)
    plan = models.ForeignKey("CustomerPlan", null=True, default=None, on_delete=SET_NULL)
    is_created_for_free_trial_upgrade = models.BooleanField(default=False)

    SENT = 1
    PAID = 2
    VOID = 3
    status = models.SmallIntegerField()

    def get_status_as_string(self) -> str:
        return {
            Invoice.SENT: "sent",
            Invoice.PAID: "paid",
            Invoice.VOID: "void",
        }[self.status]

    def get_last_associated_event(self) -> Event | None:
        if self.status == Invoice.PAID:
            event_type = "invoice.paid"
        # TODO: Add test for this case. Not sure how to trigger naturally.
        else:  # nocoverage
            return None  # nocoverage
        return get_last_associated_event_by_type(self, event_type)

    def to_dict(self) -> dict[str, Any]:
        stripe_invoice_dict: dict[str, Any] = {}
        stripe_invoice_dict["status"] = self.get_status_as_string()
        event = self.get_last_associated_event()
        if event is not None:
            stripe_invoice_dict["event_handler"] = event.get_event_handler_details_as_dict()
        return stripe_invoice_dict
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: zulip-main/corporate/models/__init__.py

```python
from corporate.models.customers import Customer as Customer
from corporate.models.licenses import LicenseLedger as LicenseLedger
from corporate.models.plans import AbstractCustomerPlan as AbstractCustomerPlan
from corporate.models.plans import CustomerPlan as CustomerPlan
from corporate.models.plans import CustomerPlanOffer as CustomerPlanOffer
from corporate.models.sponsorships import SponsoredPlanTypes as SponsoredPlanTypes
from corporate.models.sponsorships import ZulipSponsorshipRequest as ZulipSponsorshipRequest
from corporate.models.stripe_state import Event as Event
from corporate.models.stripe_state import Invoice as Invoice
from corporate.models.stripe_state import PaymentIntent as PaymentIntent
from corporate.models.stripe_state import Session as Session
```

--------------------------------------------------------------------------------

---[FILE: test_activity_views.py]---
Location: zulip-main/corporate/tests/test_activity_views.py
Signals: Django

```python
import uuid
from datetime import datetime, timedelta, timezone
from unittest import mock

from django.utils.timezone import now as timezone_now

from corporate.lib.activity import get_remote_server_audit_logs
from corporate.lib.stripe import add_months
from corporate.models.customers import Customer
from corporate.models.licenses import LicenseLedger
from corporate.models.plans import CustomerPlan
from zerver.lib.test_classes import ZulipTestCase
from zerver.models import Client, UserActivity, UserProfile
from zerver.models.realm_audit_logs import AuditLogEventType
from zilencer.models import (
    RemoteRealm,
    RemoteRealmAuditLog,
    RemoteZulipServer,
    RemoteZulipServerAuditLog,
    get_remote_customer_user_count,
    get_remote_server_guest_and_non_guest_count,
)

event_time = timezone_now() - timedelta(days=3)
data_list = [
    {
        "server_id": 1,
        "realm_id": 1,
        "event_type": AuditLogEventType.USER_CREATED,
        "event_time": event_time,
        "extra_data": {
            RemoteRealmAuditLog.ROLE_COUNT: {
                RemoteRealmAuditLog.ROLE_COUNT_HUMANS: {
                    UserProfile.ROLE_REALM_ADMINISTRATOR: 10,
                    UserProfile.ROLE_REALM_OWNER: 10,
                    UserProfile.ROLE_MODERATOR: 10,
                    UserProfile.ROLE_MEMBER: 10,
                    UserProfile.ROLE_GUEST: 10,
                }
            }
        },
    },
    {
        "server_id": 1,
        "realm_id": 1,
        "event_type": AuditLogEventType.USER_ROLE_CHANGED,
        "event_time": event_time,
        "extra_data": {
            RemoteRealmAuditLog.ROLE_COUNT: {
                RemoteRealmAuditLog.ROLE_COUNT_HUMANS: {
                    UserProfile.ROLE_REALM_ADMINISTRATOR: 20,
                    UserProfile.ROLE_REALM_OWNER: 0,
                    UserProfile.ROLE_MODERATOR: 0,
                    UserProfile.ROLE_MEMBER: 20,
                    UserProfile.ROLE_GUEST: 10,
                }
            }
        },
    },
    {
        "server_id": 1,
        "realm_id": 2,
        "event_type": AuditLogEventType.USER_CREATED,
        "event_time": event_time,
        "extra_data": {
            RemoteRealmAuditLog.ROLE_COUNT: {
                RemoteRealmAuditLog.ROLE_COUNT_HUMANS: {
                    UserProfile.ROLE_REALM_ADMINISTRATOR: 10,
                    UserProfile.ROLE_REALM_OWNER: 10,
                    UserProfile.ROLE_MODERATOR: 0,
                    UserProfile.ROLE_MEMBER: 10,
                    UserProfile.ROLE_GUEST: 5,
                }
            }
        },
    },
    {
        "server_id": 1,
        "realm_id": 2,
        "event_type": AuditLogEventType.USER_CREATED,
        "event_time": event_time,
        "extra_data": {},
    },
    {
        "server_id": 1,
        "realm_id": 3,
        "event_type": AuditLogEventType.USER_CREATED,
        "event_time": event_time,
        "extra_data": {
            RemoteRealmAuditLog.ROLE_COUNT: {
                RemoteRealmAuditLog.ROLE_COUNT_HUMANS: {
                    UserProfile.ROLE_REALM_ADMINISTRATOR: 1,
                    UserProfile.ROLE_REALM_OWNER: 1,
                    UserProfile.ROLE_MODERATOR: 1,
                    UserProfile.ROLE_MEMBER: 1,
                    UserProfile.ROLE_GUEST: 1,
                }
            }
        },
    },
    {
        "server_id": 1,
        "realm_id": 3,
        "event_type": AuditLogEventType.USER_DEACTIVATED,
        "event_time": event_time + timedelta(seconds=1),
        "extra_data": {
            RemoteRealmAuditLog.ROLE_COUNT: {
                RemoteRealmAuditLog.ROLE_COUNT_HUMANS: {
                    UserProfile.ROLE_REALM_ADMINISTRATOR: 1,
                    UserProfile.ROLE_REALM_OWNER: 1,
                    UserProfile.ROLE_MODERATOR: 1,
                    UserProfile.ROLE_MEMBER: 0,
                    UserProfile.ROLE_GUEST: 1,
                }
            }
        },
    },
]


class ActivityTest(ZulipTestCase):
    @mock.patch("stripe.Customer.list", return_value=[])
    def test_activity(self, unused_mock: mock.Mock) -> None:
        self.login("hamlet")
        client, _ = Client.objects.get_or_create(name="website")
        query = "/json/messages/flags"
        last_visit = timezone_now()
        count = 150
        for activity_user_profile in UserProfile.objects.all().iterator():
            UserActivity.objects.get_or_create(
                user_profile=activity_user_profile,
                client=client,
                query=query,
                count=count,
                last_visit=last_visit,
            )

        # Fails when not staff
        result = self.client_get("/activity")
        self.assertEqual(result.status_code, 302)

        user_profile = self.example_user("hamlet")
        user_profile.is_staff = True
        user_profile.save(update_fields=["is_staff"])

        with self.assert_database_query_count(11):
            result = self.client_get("/activity")
            self.assertEqual(result.status_code, 200)

        # Add data for remote activity page
        remote_realm = RemoteRealm.objects.get(name="Lear & Co.")
        customer = Customer.objects.create(remote_realm=remote_realm)
        plan = CustomerPlan.objects.create(
            customer=customer,
            billing_cycle_anchor=timezone_now(),
            billing_schedule=CustomerPlan.BILLING_SCHEDULE_ANNUAL,
            tier=CustomerPlan.TIER_SELF_HOSTED_BUSINESS,
            price_per_license=8000,
            next_invoice_date=add_months(timezone_now(), 12),
        )
        LicenseLedger.objects.create(
            licenses=10,
            licenses_at_next_renewal=10,
            event_time=timezone_now(),
            is_renewal=True,
            plan=plan,
        )
        server = RemoteZulipServer.objects.create(
            uuid=str(uuid.uuid4()),
            api_key="magic_secret_api_key",
            hostname="demo.example.com",
            contact_email="email@example.com",
        )
        RemoteZulipServerAuditLog.objects.create(
            event_type=AuditLogEventType.REMOTE_SERVER_CREATED,
            server=server,
            event_time=server.last_updated,
        )
        extra_data = {
            RemoteRealmAuditLog.ROLE_COUNT: {
                RemoteRealmAuditLog.ROLE_COUNT_HUMANS: {
                    UserProfile.ROLE_REALM_ADMINISTRATOR: 1,
                    UserProfile.ROLE_REALM_OWNER: 1,
                    UserProfile.ROLE_MODERATOR: 1,
                    UserProfile.ROLE_MEMBER: 1,
                    UserProfile.ROLE_GUEST: 1,
                }
            }
        }
        RemoteRealmAuditLog.objects.create(
            server=server,
            realm_id=10,
            event_type=AuditLogEventType.USER_CREATED,
            event_time=timezone_now() - timedelta(days=1),
            extra_data=extra_data,
        )
        with self.assert_database_query_count(10):
            result = self.client_get("/activity/remote")
            self.assertEqual(result.status_code, 200)

        with self.assert_database_query_count(5):
            result = self.client_get("/activity/integrations")
            self.assertEqual(result.status_code, 200)

        with self.assert_database_query_count(13):
            result = self.client_get("/realm_activity/zulip/")
            self.assertEqual(result.status_code, 200)

        iago = self.example_user("iago")
        with self.assert_database_query_count(6):
            result = self.client_get(f"/user_activity/{iago.id}/")
            self.assertEqual(result.status_code, 200)

        webhook_bot = self.example_user("webhook_bot")
        with self.assert_database_query_count(6):
            result = self.client_get(f"/user_activity/{webhook_bot.id}/")
            self.assertEqual(result.status_code, 200)

        with self.assert_database_query_count(8):
            result = self.client_get(f"/activity/plan_ledger/{plan.id}/")
            self.assertEqual(result.status_code, 200)

        with self.assert_database_query_count(7):
            result = self.client_get(f"/activity/remote/logs/server/{server.uuid}/")
            self.assertEqual(result.status_code, 200)

    def test_get_remote_server_guest_and_non_guest_count(self) -> None:
        RemoteRealmAuditLog.objects.bulk_create([RemoteRealmAuditLog(**data) for data in data_list])
        server_id = 1

        # Used in billing code
        remote_server_counts = get_remote_server_guest_and_non_guest_count(
            server_id=server_id, event_time=timezone_now()
        )
        self.assertEqual(remote_server_counts.non_guest_user_count, 73)
        self.assertEqual(remote_server_counts.guest_user_count, 16)

        # Used in remote activity view code
        server_logs = get_remote_server_audit_logs()
        remote_activity_counts = get_remote_customer_user_count(server_logs[server_id])
        self.assertEqual(remote_activity_counts.non_guest_user_count, 73)
        self.assertEqual(remote_activity_counts.guest_user_count, 16)

    def test_remote_activity_with_robust_data(self) -> None:
        def add_plan(customer: Customer, tier: int, fixed_price: bool = False) -> None:
            if fixed_price:
                plan = CustomerPlan.objects.create(
                    customer=customer,
                    billing_cycle_anchor=timezone_now(),
                    billing_schedule=CustomerPlan.BILLING_SCHEDULE_ANNUAL,
                    tier=tier,
                    fixed_price=10000,
                    next_invoice_date=add_months(timezone_now(), 12),
                )
            else:
                if tier in (
                    CustomerPlan.TIER_SELF_HOSTED_BASE,
                    CustomerPlan.TIER_SELF_HOSTED_LEGACY,
                    CustomerPlan.TIER_SELF_HOSTED_COMMUNITY,
                ):
                    price_per_license = 0
                else:
                    price_per_license = 1000
                plan = CustomerPlan.objects.create(
                    customer=customer,
                    billing_cycle_anchor=timezone_now(),
                    billing_schedule=CustomerPlan.BILLING_SCHEDULE_ANNUAL,
                    tier=tier,
                    price_per_license=price_per_license,
                    next_invoice_date=add_months(timezone_now(), 12),
                )
            LicenseLedger.objects.create(
                licenses=10,
                licenses_at_next_renewal=10,
                event_time=timezone_now(),
                is_renewal=True,
                plan=plan,
            )

        def add_audit_log_data(
            server: RemoteZulipServer, remote_realm: RemoteRealm | None, realm_id: int | None
        ) -> None:
            extra_data = {
                RemoteRealmAuditLog.ROLE_COUNT: {
                    RemoteRealmAuditLog.ROLE_COUNT_HUMANS: {
                        UserProfile.ROLE_REALM_ADMINISTRATOR: 1,
                        UserProfile.ROLE_REALM_OWNER: 1,
                        UserProfile.ROLE_MODERATOR: 0,
                        UserProfile.ROLE_MEMBER: 0,
                        UserProfile.ROLE_GUEST: 1,
                    }
                }
            }
            if remote_realm is not None:
                RemoteRealmAuditLog.objects.create(
                    server=server,
                    remote_realm=remote_realm,
                    event_type=AuditLogEventType.USER_CREATED,
                    event_time=timezone_now() - timedelta(days=1),
                    extra_data=extra_data,
                )
            else:
                RemoteRealmAuditLog.objects.create(
                    server=server,
                    realm_id=realm_id,
                    event_type=AuditLogEventType.USER_CREATED,
                    event_time=timezone_now() - timedelta(days=1),
                    extra_data=extra_data,
                )

        for i in range(6):
            hostname = f"zulip-{i}.example.com"
            remote_server = RemoteZulipServer.objects.create(
                hostname=hostname, contact_email=f"admin@{hostname}", uuid=uuid.uuid4()
            )
            RemoteZulipServerAuditLog.objects.create(
                event_type=AuditLogEventType.REMOTE_SERVER_CREATED,
                server=remote_server,
                event_time=remote_server.last_updated,
            )
            # We want at least one RemoteZulipServer that has no RemoteRealm
            # as an example of a pre-8.0 release registered remote server.
            if i > 2:
                realm_name = f"realm-name-{i}"
                realm_host = f"realm-host-{i}"
                realm_uuid = uuid.uuid4()
                RemoteRealm.objects.create(
                    server=remote_server,
                    uuid=realm_uuid,
                    host=realm_host,
                    name=realm_name,
                    realm_date_created=datetime(2023, 12, 1, tzinfo=timezone.utc),
                )

        # Remote server on complimentary access plan
        server = RemoteZulipServer.objects.get(hostname="zulip-1.example.com")
        customer = Customer.objects.create(remote_server=server)
        add_plan(customer, tier=CustomerPlan.TIER_SELF_HOSTED_LEGACY)
        add_audit_log_data(server, remote_realm=None, realm_id=2)

        # Remote server paid plan - multiple realms
        server = RemoteZulipServer.objects.get(hostname="zulip-2.example.com")
        customer = Customer.objects.create(remote_server=server)
        add_plan(customer, tier=CustomerPlan.TIER_SELF_HOSTED_BASIC)
        add_audit_log_data(server, remote_realm=None, realm_id=3)
        add_audit_log_data(server, remote_realm=None, realm_id=4)
        add_audit_log_data(server, remote_realm=None, realm_id=5)

        # Single remote realm on remote server - community plan
        realm = RemoteRealm.objects.get(name="realm-name-3")
        customer = Customer.objects.create(remote_realm=realm)
        add_plan(customer, tier=CustomerPlan.TIER_SELF_HOSTED_COMMUNITY)
        add_audit_log_data(realm.server, remote_realm=realm, realm_id=None)

        # Single remote realm on remote server - paid plan
        realm = RemoteRealm.objects.get(name="realm-name-4")
        customer = Customer.objects.create(remote_realm=realm)
        add_plan(customer, tier=CustomerPlan.TIER_SELF_HOSTED_BUSINESS)
        add_audit_log_data(realm.server, remote_realm=realm, realm_id=None)

        # Multiple remote realms on remote server - on different paid plans
        realm = RemoteRealm.objects.get(name="realm-name-5")
        customer = Customer.objects.create(remote_realm=realm)
        add_plan(customer, tier=CustomerPlan.TIER_SELF_HOSTED_BASIC)
        add_audit_log_data(realm.server, remote_realm=realm, realm_id=None)

        remote_server = realm.server
        realm_name = "realm-name-6"
        realm_host = "realm-host-6"
        realm_uuid = uuid.uuid4()
        RemoteRealm.objects.create(
            server=remote_server,
            uuid=realm_uuid,
            host=realm_host,
            name=realm_name,
            realm_date_created=datetime(2023, 12, 1, tzinfo=timezone.utc),
        )

        realm = RemoteRealm.objects.get(name="realm-name-6")
        customer = Customer.objects.create(remote_realm=realm)
        add_plan(customer, tier=CustomerPlan.TIER_SELF_HOSTED_BASIC, fixed_price=True)
        add_audit_log_data(realm.server, remote_realm=realm, realm_id=None)

        self.login("iago")
        with self.assert_database_query_count(11):
            result = self.client_get("/activity/remote")
            self.assertEqual(result.status_code, 200)

        with self.assert_database_query_count(7):
            result = self.client_get(f"/activity/remote/logs/server/{remote_server.uuid}/")
            self.assertEqual(result.status_code, 200)
```

--------------------------------------------------------------------------------

````
