---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 241
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 241 of 1290)

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

---[FILE: portico.py]---
Location: zulip-main/corporate/views/portico.py
Signals: Django, Pydantic

```python
from dataclasses import asdict, dataclass
from typing import TYPE_CHECKING

import orjson
from django.conf import settings
from django.contrib.auth.views import redirect_to_login
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.template.response import TemplateResponse
from django.urls import reverse
from pydantic import Json

from corporate.lib.decorator import (
    authenticated_remote_realm_management_endpoint,
    authenticated_remote_server_management_endpoint,
)
from corporate.models.customers import get_customer_by_realm
from corporate.models.plans import CustomerPlan, get_current_plan_by_customer
from zerver.context_processors import get_realm_from_request, latest_info_context
from zerver.decorator import add_google_analytics, zulip_login_required
from zerver.lib.github import (
    InvalidPlatformError,
    get_latest_github_release_download_link_for_platform,
)
from zerver.lib.realm_description import get_realm_text_description
from zerver.lib.realm_icon import get_realm_icon_url
from zerver.lib.subdomains import is_subdomain_root_or_alias
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.models import Realm

if TYPE_CHECKING:
    from corporate.lib.stripe import RemoteRealmBillingSession, RemoteServerBillingSession


@add_google_analytics
def apps_view(request: HttpRequest, platform: str | None = None) -> HttpResponse:
    if not settings.CORPORATE_ENABLED:
        # This seems impossible (CORPORATE_ENABLED set to false when
        # rendering a "corporate" view) -- but we add it to make
        # testing possible.  Tests default to running with the
        # "corporate" app installed, and unsetting that is difficult,
        # as one cannot easily reload the URL resolution -- so we add
        # a redirect here, equivalent to the one zerver would have
        # installed when "corporate" is not enabled, to make the
        # behaviour testable with CORPORATE_ENABLED set to false.
        return HttpResponseRedirect("https://zulip.com/apps/", status=301)
    return TemplateResponse(
        request,
        "corporate/apps.html",
    )


def app_download_link_redirect(request: HttpRequest, platform: str) -> HttpResponse:
    try:
        download_link = get_latest_github_release_download_link_for_platform(platform)
        return HttpResponseRedirect(download_link, status=302)
    except InvalidPlatformError:
        return TemplateResponse(request, "404.html", status=404)


def is_customer_on_free_trial(customer_plan: CustomerPlan) -> bool:
    return customer_plan.status in (
        CustomerPlan.FREE_TRIAL,
        CustomerPlan.DOWNGRADE_AT_END_OF_FREE_TRIAL,
    )


@dataclass
class PlansPageContext:
    sponsorship_url: str
    free_trial_days: int | None
    on_free_trial: bool = False
    sponsorship_pending: bool = False
    is_sponsored: bool = False

    is_cloud_realm: bool = False
    is_self_hosted_realm: bool = False

    is_new_customer: bool = False
    on_free_tier: bool = False
    customer_plan: CustomerPlan | None = None
    has_scheduled_upgrade: bool = False
    scheduled_upgrade_plan: CustomerPlan | None = None
    requested_sponsorship_plan: str | None = None

    billing_base_url: str = ""

    tier_self_hosted_basic: int = CustomerPlan.TIER_SELF_HOSTED_BASIC
    tier_self_hosted_business: int = CustomerPlan.TIER_SELF_HOSTED_BUSINESS
    tier_cloud_standard: int = CustomerPlan.TIER_CLOUD_STANDARD
    tier_cloud_plus: int = CustomerPlan.TIER_CLOUD_PLUS


@add_google_analytics
def plans_view(request: HttpRequest) -> HttpResponse:
    from corporate.lib.stripe import get_free_trial_days

    realm = get_realm_from_request(request)
    context = PlansPageContext(
        is_cloud_realm=True,
        sponsorship_url=reverse("sponsorship_request"),
        free_trial_days=get_free_trial_days(False),
        is_sponsored=realm is not None and realm.plan_type == Realm.PLAN_TYPE_STANDARD_FREE,
    )
    if is_subdomain_root_or_alias(request):
        # If we're on the root domain, we make this link first ask you which organization.
        context.sponsorship_url = reverse("realm_redirect", query={"next": context.sponsorship_url})

    if realm is not None:
        if realm.plan_type == Realm.PLAN_TYPE_SELF_HOSTED and settings.PRODUCTION:
            return HttpResponseRedirect("https://zulip.com/plans/")
        if not request.user.is_authenticated:
            return redirect_to_login(next="/plans/")
        if request.user.is_guest:
            return TemplateResponse(request, "404.html", status=404)
        if not request.user.has_billing_access:
            return HttpResponseRedirect(reverse("billing_page"))

        customer = get_customer_by_realm(realm)
        context.on_free_tier = customer is None and not context.is_sponsored
        if customer is not None:
            context.sponsorship_pending = customer.sponsorship_pending
            context.customer_plan = get_current_plan_by_customer(customer)
            if context.customer_plan is None:
                # Cloud realms on free tier don't have active customer plan unless they are sponsored.
                context.on_free_tier = not context.is_sponsored
            else:
                context.on_free_trial = is_customer_on_free_trial(context.customer_plan)
                # TODO implement a complimentary access plan/tier for Zulip Cloud.

    context.is_new_customer = (
        not context.on_free_tier and context.customer_plan is None and not context.is_sponsored
    )
    return TemplateResponse(
        request,
        "corporate/plans.html",
        context=asdict(context),
    )


@add_google_analytics
@authenticated_remote_realm_management_endpoint
def remote_realm_plans_page(
    request: HttpRequest, billing_session: "RemoteRealmBillingSession"
) -> HttpResponse:
    from corporate.lib.stripe import get_configured_fixed_price_plan_offer, get_free_trial_days

    customer = billing_session.get_customer()
    context = PlansPageContext(
        is_self_hosted_realm=True,
        sponsorship_url=reverse(
            "remote_realm_sponsorship_page", args=(billing_session.remote_realm.uuid,)
        ),
        free_trial_days=get_free_trial_days(True),
        billing_base_url=billing_session.billing_base_url,
        is_sponsored=billing_session.is_sponsored(),
        requested_sponsorship_plan=billing_session.get_sponsorship_plan_name(customer, True),
    )

    context.on_free_tier = customer is None and not context.is_sponsored
    if customer is not None:  # nocoverage
        context.sponsorship_pending = customer.sponsorship_pending
        context.customer_plan = get_current_plan_by_customer(customer)

        if customer.required_plan_tier is not None:
            configure_fixed_price_plan = get_configured_fixed_price_plan_offer(
                customer, customer.required_plan_tier
            )
            # Free trial is disabled for customers with fixed-price plan configured.
            if configure_fixed_price_plan is not None:
                context.free_trial_days = None

        if context.customer_plan is None:
            context.on_free_tier = not context.is_sponsored
        else:
            context.on_free_tier = (
                context.customer_plan.tier
                in (
                    CustomerPlan.TIER_SELF_HOSTED_LEGACY,
                    CustomerPlan.TIER_SELF_HOSTED_BASE,
                )
                and not context.is_sponsored
            )
            context.on_free_trial = is_customer_on_free_trial(context.customer_plan)
            if context.customer_plan.status == CustomerPlan.SWITCH_PLAN_TIER_AT_PLAN_END:
                assert context.customer_plan.end_date is not None
                context.scheduled_upgrade_plan = CustomerPlan.objects.get(
                    customer=customer,
                    billing_cycle_anchor=context.customer_plan.end_date,
                    status=CustomerPlan.NEVER_STARTED,
                )
                # Fixed-price plan renewals have a CustomerPlan.status of
                # SWITCH_PLAN_TIER_AT_PLAN_END, so we check to see if there is
                # a CustomerPlan.tier change for the scheduled upgrade note.
                context.has_scheduled_upgrade = (
                    context.customer_plan.tier != context.scheduled_upgrade_plan.tier
                )

    if billing_session.customer_plan_exists():
        # Free trial is disabled for existing customers.
        context.free_trial_days = None

    context.is_new_customer = (
        not context.on_free_tier and context.customer_plan is None and not context.is_sponsored
    )
    return TemplateResponse(
        request,
        "corporate/plans.html",
        context=asdict(context),
    )


@add_google_analytics
@authenticated_remote_server_management_endpoint
def remote_server_plans_page(
    request: HttpRequest, billing_session: "RemoteServerBillingSession"
) -> HttpResponse:
    from corporate.lib.stripe import get_configured_fixed_price_plan_offer, get_free_trial_days

    customer = billing_session.get_customer()
    context = PlansPageContext(
        is_self_hosted_realm=True,
        sponsorship_url=reverse(
            "remote_server_sponsorship_page", args=(billing_session.remote_server.uuid,)
        ),
        free_trial_days=get_free_trial_days(True),
        billing_base_url=billing_session.billing_base_url,
        is_sponsored=billing_session.is_sponsored(),
        requested_sponsorship_plan=billing_session.get_sponsorship_plan_name(customer, True),
    )

    context.on_free_tier = customer is None and not context.is_sponsored
    if customer is not None:  # nocoverage
        context.sponsorship_pending = customer.sponsorship_pending
        context.customer_plan = get_current_plan_by_customer(customer)

        if customer.required_plan_tier is not None:
            configure_fixed_price_plan = get_configured_fixed_price_plan_offer(
                customer, customer.required_plan_tier
            )
            # Free trial is disabled for customers with fixed-price plan configured.
            if configure_fixed_price_plan is not None:
                context.free_trial_days = None

        if context.customer_plan is None:
            context.on_free_tier = not context.is_sponsored
        else:
            context.on_free_tier = context.customer_plan.tier in (
                CustomerPlan.TIER_SELF_HOSTED_LEGACY,
                CustomerPlan.TIER_SELF_HOSTED_BASE,
            )
            context.on_free_trial = is_customer_on_free_trial(context.customer_plan)
            if context.customer_plan.status == CustomerPlan.SWITCH_PLAN_TIER_AT_PLAN_END:
                assert context.customer_plan.end_date is not None
                context.scheduled_upgrade_plan = CustomerPlan.objects.get(
                    customer=customer,
                    billing_cycle_anchor=context.customer_plan.end_date,
                    status=CustomerPlan.NEVER_STARTED,
                )
                # Fixed-price plan renewals have a CustomerPlan.status of
                # SWITCH_PLAN_TIER_AT_PLAN_END, so we check to see if there is
                # a CustomerPlan.tier change for the scheduled upgrade note.
                context.has_scheduled_upgrade = (
                    context.customer_plan.tier != context.scheduled_upgrade_plan.tier
                )

        if billing_session.customer_plan_exists():
            # Free trial is disabled for existing customers.
            context.free_trial_days = None

    context.is_new_customer = (
        not context.on_free_tier and context.customer_plan is None and not context.is_sponsored
    )
    return TemplateResponse(
        request,
        "corporate/plans.html",
        context=asdict(context),
    )


@add_google_analytics
def team_view(request: HttpRequest) -> HttpResponse:
    if not settings.ZILENCER_ENABLED:
        return HttpResponseRedirect("https://zulip.com/team/", status=301)

    try:
        with open(settings.CONTRIBUTOR_DATA_FILE_PATH, "rb") as f:
            data = orjson.loads(f.read())
    except FileNotFoundError:
        data = {"contributors": [], "date": "Never ran."}

    return TemplateResponse(
        request,
        "corporate/team.html",
        context={
            # Sync this with team_params_schema in base_page_params.ts.
            "page_params": {
                "page_type": "team",
                "contributors": data["contributors"],
            },
            "REL_CANONICAL_LINK": f"https://zulip.com{request.path}",
            "date": data["date"],
        },
    )


@add_google_analytics
def landing_view(request: HttpRequest, template_name: str) -> HttpResponse:
    context = latest_info_context()
    context.update(
        {
            "billing_base_url": "",
            "tier_cloud_standard": str(CustomerPlan.TIER_CLOUD_STANDARD),
            "tier_cloud_plus": str(CustomerPlan.TIER_CLOUD_PLUS),
            "REL_CANONICAL_LINK": f"https://zulip.com{request.path}",
        }
    )

    return TemplateResponse(request, template_name, context)


@add_google_analytics
def hello_view(request: HttpRequest) -> HttpResponse:
    context = latest_info_context()
    context["REL_CANONICAL_LINK"] = "https://zulip.com/"
    return TemplateResponse(request, "corporate/hello.html", context)


@add_google_analytics
def communities_view(request: HttpRequest) -> HttpResponse:
    eligible_realms = []
    unique_org_type_ids = set()
    want_to_be_advertised_realms = (
        Realm.objects.filter(
            want_advertise_in_communities_directory=True,
        )
        .exclude(
            # Filter out realms who haven't changed their description from the default.
            description="",
        )
        .order_by("name")
    )
    for realm in want_to_be_advertised_realms:
        open_to_public = not realm.invite_required and not realm.emails_restricted_to_domains
        if realm.allow_web_public_streams_access() or open_to_public:
            [org_type] = (
                org_type
                for org_type in Realm.ORG_TYPES
                if Realm.ORG_TYPES[org_type]["id"] == realm.org_type
            )
            eligible_realms.append(
                {
                    "id": realm.id,
                    "name": realm.name,
                    "realm_url": realm.url,
                    "logo_url": get_realm_icon_url(realm),
                    "description": get_realm_text_description(realm),
                    "org_type_key": org_type,
                }
            )
            unique_org_type_ids.add(realm.org_type)

    # Custom list of org filters to show.
    CATEGORIES_TO_OFFER = [
        "opensource",
        "research",
        "community",
    ]

    # Remove org_types for which there are no open organizations.
    org_types = dict()
    for org_type in CATEGORIES_TO_OFFER:
        if Realm.ORG_TYPES[org_type]["id"] in unique_org_type_ids:
            org_types[org_type] = Realm.ORG_TYPES[org_type]

    # This code is not required right bot could be useful in future.
    # If we ever decided to show all the ORG_TYPES.
    # Remove `Unspecified` ORG_TYPE
    # org_types.pop("unspecified", None)

    # Change display name of non-profit orgs.
    # if org_types.get("nonprofit"):  # nocoverage
    #    org_types["nonprofit"]["name"] = "Non-profit"

    return TemplateResponse(
        request,
        "corporate/communities.html",
        context={
            "REL_CANONICAL_LINK": f"https://zulip.com{request.path}",
            "eligible_realms": eligible_realms,
            "org_types": org_types,
        },
    )


@zulip_login_required
def invoices_page(request: HttpRequest) -> HttpResponseRedirect:
    from corporate.lib.stripe import RealmBillingSession

    user = request.user
    assert user.is_authenticated

    if not user.has_billing_access:
        return HttpResponseRedirect(reverse("billing_page"))

    billing_session = RealmBillingSession(user=user, realm=user.realm)
    list_invoices_session_url = billing_session.get_past_invoices_session_url()
    return HttpResponseRedirect(list_invoices_session_url)


@authenticated_remote_realm_management_endpoint
def remote_realm_invoices_page(
    request: HttpRequest, billing_session: "RemoteRealmBillingSession"
) -> HttpResponseRedirect:
    list_invoices_session_url = billing_session.get_past_invoices_session_url()
    return HttpResponseRedirect(list_invoices_session_url)


@authenticated_remote_server_management_endpoint
def remote_server_invoices_page(
    request: HttpRequest, billing_session: "RemoteServerBillingSession"
) -> HttpResponseRedirect:
    list_invoices_session_url = billing_session.get_past_invoices_session_url()
    return HttpResponseRedirect(list_invoices_session_url)


@zulip_login_required
@typed_endpoint
def customer_portal(
    request: HttpRequest,
    *,
    return_to_billing_page: Json[bool] = False,
    manual_license_management: Json[bool] = False,
    tier: Json[int] | None = None,
    setup_payment_by_invoice: Json[bool] = False,
) -> HttpResponseRedirect:
    from corporate.lib.stripe import RealmBillingSession

    user = request.user
    assert user.is_authenticated

    if not user.has_billing_access:
        return HttpResponseRedirect(reverse("billing_page"))

    billing_session = RealmBillingSession(user=user, realm=user.realm)
    review_billing_information_url = billing_session.get_stripe_customer_portal_url(
        return_to_billing_page, manual_license_management, tier, setup_payment_by_invoice
    )
    return HttpResponseRedirect(review_billing_information_url)


@typed_endpoint
@authenticated_remote_realm_management_endpoint
def remote_realm_customer_portal(
    request: HttpRequest,
    billing_session: "RemoteRealmBillingSession",
    *,
    return_to_billing_page: Json[bool] = False,
    manual_license_management: Json[bool] = False,
    tier: Json[int] | None = None,
    setup_payment_by_invoice: Json[bool] = False,
) -> HttpResponseRedirect:
    review_billing_information_url = billing_session.get_stripe_customer_portal_url(
        return_to_billing_page, manual_license_management, tier, setup_payment_by_invoice
    )
    return HttpResponseRedirect(review_billing_information_url)


@typed_endpoint
@authenticated_remote_server_management_endpoint
def remote_server_customer_portal(
    request: HttpRequest,
    billing_session: "RemoteServerBillingSession",
    *,
    return_to_billing_page: Json[bool] = False,
    manual_license_management: Json[bool] = False,
    tier: Json[int] | None = None,
    setup_payment_by_invoice: Json[bool] = False,
) -> HttpResponseRedirect:
    review_billing_information_url = billing_session.get_stripe_customer_portal_url(
        return_to_billing_page, manual_license_management, tier, setup_payment_by_invoice
    )
    return HttpResponseRedirect(review_billing_information_url)
```

--------------------------------------------------------------------------------

---[FILE: realm_activity.py]---
Location: zulip-main/corporate/views/realm_activity.py
Signals: Django

```python
import itertools
import re
from collections.abc import Collection
from dataclasses import dataclass
from datetime import datetime
from typing import Any

from django.db.models import QuerySet
from django.http import HttpRequest, HttpResponse, HttpResponseNotFound
from django.shortcuts import render
from django.utils.timezone import now as timezone_now
from markupsafe import Markup

from corporate.lib.activity import (
    format_optional_datetime,
    make_table,
    realm_stats_link,
    user_activity_link,
)
from zerver.decorator import require_server_admin
from zerver.models import Realm, UserActivity
from zerver.models.users import UserProfile


@dataclass
class UserActivitySummary:
    user_name: str
    user_id: int
    user_type: str
    messages_sent: int
    last_heard_from: datetime | None
    last_message_sent: datetime | None
    bot_owner_id: int | None


def get_user_activity_records_for_realm(realm: str) -> QuerySet[UserActivity]:
    fields = [
        "user_profile__full_name",
        "user_profile__delivery_email",
        "user_profile__is_bot",
        "user_profile__bot_type",
        "query",
        "count",
        "last_visit",
    ]

    records = (
        UserActivity.objects.filter(
            user_profile__realm__string_id=realm,
            user_profile__is_active=True,
        )
        .order_by("user_profile__delivery_email", "-last_visit")
        .select_related("user_profile")
        .only(*fields)
    )
    return records


def get_user_activity_summary(records: Collection[UserActivity]) -> UserActivitySummary:
    if records:
        first_record = next(iter(records))
        name = first_record.user_profile.full_name
        user_profile_id = first_record.user_profile.id
        bot_owner_id = None
        if not first_record.user_profile.is_bot:
            user_type = "Human"
        else:
            assert first_record.user_profile.bot_type is not None
            bot_type = first_record.user_profile.bot_type
            user_type = UserProfile.BOT_TYPES[bot_type]
            if first_record.user_profile.bot_owner is not None:
                bot_owner_id = first_record.user_profile.bot_owner.id

    messages = 0
    heard_from: datetime | None = None
    last_sent: datetime | None = None

    for record in records:
        query = str(record.query)
        visit = record.last_visit

        if heard_from is None:
            heard_from = visit
        else:
            heard_from = max(visit, heard_from)

        if ("send_message" in query) or re.search(r"/api/.*/external/.*", query):
            messages += record.count
            if last_sent is None:
                last_sent = visit
            else:
                last_sent = max(visit, last_sent)

    return UserActivitySummary(
        user_name=name,
        user_id=user_profile_id,
        user_type=user_type,
        messages_sent=messages,
        last_heard_from=heard_from,
        last_message_sent=last_sent,
        bot_owner_id=bot_owner_id,
    )


def realm_user_summary_table(
    all_records: QuerySet[UserActivity], admin_emails: set[str], title: str, stats_link: Markup
) -> str:
    user_records: dict[str, UserActivitySummary] = {}

    def by_email(record: UserActivity) -> str:
        return record.user_profile.delivery_email

    for email, records in itertools.groupby(all_records, by_email):
        user_records[email] = get_user_activity_summary(list(records))

    def is_recent(val: datetime) -> bool:
        age = timezone_now() - val
        return age.total_seconds() < 5 * 60

    cols = [
        "Name",
        "Email",
        "User type",
        "Messages sent",
        "Last heard from (UTC)",
        "Last message sent (UTC)",
    ]

    rows = []
    for email, user_summary in user_records.items():
        email_link = user_activity_link(email, user_summary.user_id)
        if user_summary.bot_owner_id is not None:
            bot_owner_link = user_activity_link("", user_summary.bot_owner_id)
            user_name = user_summary.user_name + " " + bot_owner_link
            cells = [
                user_name,
                email_link,
                user_summary.user_type,
                user_summary.messages_sent,
            ]
        else:
            cells = [
                user_summary.user_name,
                email_link,
                user_summary.user_type,
                user_summary.messages_sent,
            ]
        cells.append(format_optional_datetime(user_summary.last_heard_from))
        cells.append(format_optional_datetime(user_summary.last_message_sent))

        row_class = ""
        if user_summary.last_heard_from and is_recent(user_summary.last_heard_from):
            row_class += " recently_active"
        if email in admin_emails:
            row_class += " admin"

        row = dict(cells=cells, row_class=row_class)
        rows.append(row)

    def by_last_heard_from(row: dict[str, Any]) -> str:
        return row["cells"][4]

    rows = sorted(rows, key=by_last_heard_from, reverse=True)
    content = make_table(title, cols, rows, title_link=stats_link, has_row_class=True)
    return content


@require_server_admin
def get_realm_activity(request: HttpRequest, realm_str: str) -> HttpResponse:
    try:
        admins = Realm.objects.get(string_id=realm_str).get_human_admin_users()
    except Realm.DoesNotExist:
        return HttpResponseNotFound()

    admin_emails = {admin.delivery_email for admin in admins}
    all_records = get_user_activity_records_for_realm(realm_str)
    realm_stats = realm_stats_link(realm_str)
    title = realm_str
    content = realm_user_summary_table(all_records, admin_emails, title, realm_stats)

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

---[FILE: remote_activity.py]---
Location: zulip-main/corporate/views/remote_activity.py
Signals: Django

```python
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from psycopg2.sql import SQL

from corporate.lib.activity import (
    fix_rows,
    format_datetime_as_date,
    format_none_as_zero,
    format_optional_datetime,
    get_plan_data_by_remote_realm,
    get_plan_data_by_remote_server,
    get_query_data,
    get_remote_realm_user_counts,
    get_remote_server_audit_logs,
    make_table,
    remote_installation_stats_link,
    remote_installation_support_link,
)
from zerver.decorator import require_server_admin
from zerver.models.realms import get_org_type_display_name
from zilencer.models import get_remote_customer_user_count


@require_server_admin
def get_remote_server_activity(request: HttpRequest) -> HttpResponse:
    from corporate.lib.stripe import cents_to_dollar_string

    title = "Remote servers"

    query = SQL(
        """
        with remote_server_push_forwarded_count as (
            select
                server_id,
                sum(coalesce(value, 0)) as server_push_forwarded_count
            from zilencer_remoteinstallationcount
            where
                property = 'mobile_pushes_forwarded::day'
                and end_time >= current_timestamp(0) - interval '7 days'
            group by server_id
        ),
        remote_server_push_devices as (
            select
                server_id,
                count(distinct(user_id, user_uuid)) as server_push_user_count
            from zilencer_remotepushdevicetoken
            group by server_id
        ),
        remote_server_audit_log as (
            select
                server_id,
                event_time as server_created
            from zilencer_remotezulipserverauditlog
            where
                event_type = 10215
            group by server_id, event_time
        ),
        remote_realms as (
            select
                server_id,
                id as realm_id,
                name as realm_name,
                org_type as realm_type,
                host as realm_host,
                realm_date_created as realm_created
            from zilencer_remoterealm
            where
                is_system_bot_realm = False
                and realm_deactivated = False
            group by server_id, id, name, org_type
        ),
        remote_realm_push_devices as (
            select
                remote_realm_id,
                count(distinct(user_id, user_uuid)) as realm_push_user_count
            from zilencer_remotepushdevicetoken
            group by remote_realm_id
        ),
        remote_realm_push_forwarded_count as (
            select
                remote_realm_id,
                sum(coalesce(value, 0)) as realm_push_forwarded_count
            from zilencer_remoterealmcount
            where
                property = 'mobile_pushes_forwarded::day'
                and end_time >= current_timestamp(0) - interval '7 days'
            group by remote_realm_id
        )
        select
            rserver.id,
            realm_id,
            server_created,
            realm_created,
            realm_name,
            rserver.hostname,
            realm_host,
            rserver.contact_email,
            rserver.last_version,
            rserver.last_audit_log_update,
            server_push_user_count,
            realm_push_user_count,
            server_push_forwarded_count,
            realm_push_forwarded_count,
            realm_type
        from zilencer_remotezulipserver rserver
        left join remote_server_push_forwarded_count on remote_server_push_forwarded_count.server_id = rserver.id
        left join remote_server_push_devices on remote_server_push_devices.server_id = rserver.id
        left join remote_realms on remote_realms.server_id = rserver.id
        left join remote_server_audit_log on remote_server_audit_log.server_id = rserver.id
        left join remote_realm_push_devices on remote_realm_push_devices.remote_realm_id = realm_id
        left join remote_realm_push_forwarded_count on remote_realm_push_forwarded_count.remote_realm_id = realm_id
        where not deactivated
        order by server_push_user_count DESC NULLS LAST
    """
    )

    cols = [
        "Links",
        "IDs",
        "Date created",
        "Realm name",
        "Realm host or server hostname",
        "Server contact email",
        "Server Zulip version",
        "Server last audit log update (UTC)",
        "Mobile users",
        "Mobile pushes",
        "Realm organization type",
        "Plan name",
        "Plan status",
        "ARR",
        "Rate",
        "Total users",
        "Guest users",
    ]

    # If the query or column order above changes, update the constants below
    # Query constants:
    SERVER_AND_REALM_IDS = 0
    SERVER_CREATED = 1
    REALM_CREATED = 2
    SERVER_HOST = 3
    REALM_HOST = 4
    SERVER_PUSH_USER_COUNT = 9
    REALM_PUSH_USER_COUNT = 10
    SERVER_PUSH_FORWARDED = 11
    REALM_PUSH_FORWARDED = 12

    # Column constants:
    DATE_CREATED = 2
    LAST_AUDIT_LOG_DATE = 7
    MOBILE_USER_COUNT = 8
    MOBILE_PUSH_COUNT = 9
    ORG_TYPE = 10
    ARR = 13
    TOTAL_USER_COUNT = 15
    GUEST_COUNT = 16

    rows = get_query_data(query)
    plan_data_by_remote_server = get_plan_data_by_remote_server()
    plan_data_by_remote_server_and_realm = get_plan_data_by_remote_realm()
    audit_logs_by_remote_server = get_remote_server_audit_logs()
    remote_realm_user_counts = get_remote_realm_user_counts()

    total_row = []
    remote_server_mobile_data_counted = set()
    total_revenue = 0
    total_mobile_users = 0
    total_pushes = 0

    for row in rows:
        # Create combined IDs column with server and realm IDs
        server_id = row.pop(SERVER_AND_REALM_IDS)
        realm_id = row.pop(SERVER_AND_REALM_IDS)
        if realm_id is not None:
            ids_string = f"{server_id}/{realm_id}"
        else:
            ids_string = f"{server_id}"
        row.insert(SERVER_AND_REALM_IDS, ids_string)

        # Remove extra mobile user/push data and set created date
        # For remote realm row, remove server push data and created date;
        # for remote server row, remove realm push data and created date.
        if realm_id is not None:
            row.pop(SERVER_PUSH_FORWARDED)
            row.pop(SERVER_PUSH_USER_COUNT)
            row.pop(SERVER_CREATED)
        else:
            row.pop(REALM_PUSH_FORWARDED)
            row.pop(REALM_PUSH_USER_COUNT)
            row.pop(REALM_CREATED)

        # Get server_host for support link
        # For remote realm row, remove server hostname value;
        # for remote server row, remove None realm host value
        if realm_id is not None:
            server_host = row.pop(SERVER_HOST)
        else:
            row.pop(REALM_HOST)
            server_host = row[SERVER_HOST]

        # Add server links
        stats = remote_installation_stats_link(server_id)
        support = remote_installation_support_link(server_host)
        links = stats + " " + support
        row.insert(0, links)

        # Count mobile users and pushes forwarded, once per server
        if server_id not in remote_server_mobile_data_counted:
            if row[MOBILE_USER_COUNT] is not None:
                total_mobile_users += row[MOBILE_USER_COUNT]  # nocoverage
            if row[MOBILE_PUSH_COUNT] is not None:
                total_pushes += row[MOBILE_PUSH_COUNT]  # nocoverage
            remote_server_mobile_data_counted.add(server_id)

        # Get plan, revenue and user count data for row
        if realm_id is None:
            plan_data = plan_data_by_remote_server.get(server_id)
            audit_log_list = audit_logs_by_remote_server.get(server_id)
            if audit_log_list is None:
                user_counts = None  # nocoverage
            else:
                user_counts = get_remote_customer_user_count(audit_log_list)
        else:
            server_remote_realms_data = plan_data_by_remote_server_and_realm.get(server_id)
            if server_remote_realms_data is not None:
                plan_data = server_remote_realms_data.get(realm_id)
            else:
                plan_data = None  # nocoverage
            user_counts = remote_realm_user_counts.get(realm_id)
            # Format organization type for realm
            org_type = row[ORG_TYPE]
            row[ORG_TYPE] = get_org_type_display_name(org_type)

        # Add estimated annual revenue and plan data
        if plan_data is None:
            row.append("---")
            row.append("---")
            row.append("---")
            row.append("---")
        else:
            total_revenue += plan_data.annual_revenue
            revenue = cents_to_dollar_string(plan_data.annual_revenue)
            row.append(plan_data.current_plan_name)
            row.append(plan_data.current_status)
            row.append(f"${revenue}")
            row.append(plan_data.rate)

        # Add user counts
        if user_counts is None:
            row.append(0)
            row.append(0)
        else:
            total_users = user_counts.non_guest_user_count + user_counts.guest_user_count
            row.append(total_users)
            row.append(user_counts.guest_user_count)

    # Format column data and add total row
    for i in range(len(cols)):
        if i == LAST_AUDIT_LOG_DATE:
            fix_rows(rows, i, format_optional_datetime)
        if i in [MOBILE_USER_COUNT, MOBILE_PUSH_COUNT]:
            fix_rows(rows, i, format_none_as_zero)
        if i == DATE_CREATED:
            fix_rows(rows, i, format_datetime_as_date)
        if i == SERVER_AND_REALM_IDS:
            total_row.append("Total")
        elif i == MOBILE_USER_COUNT:
            total_row.append(str(total_mobile_users))
        elif i == MOBILE_PUSH_COUNT:
            total_row.append(str(total_pushes))
        elif i == ARR:
            total_revenue_string = f"${cents_to_dollar_string(total_revenue)}"
            total_row.append(total_revenue_string)
        elif i in [TOTAL_USER_COUNT, GUEST_COUNT]:
            total_row.append(str(sum(row[i] for row in rows if row[i] is not None)))
        else:
            total_row.append("")

    content = make_table(title, cols, rows, totals=total_row)
    return render(
        request,
        "corporate/activity/activity.html",
        context=dict(data=content, title=title, is_home=False),
    )
```

--------------------------------------------------------------------------------

````
