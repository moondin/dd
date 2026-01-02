---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 240
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 240 of 1290)

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

---[FILE: billing_page.py]---
Location: zulip-main/corporate/views/billing_page.py
Signals: Django, Pydantic

```python
import logging
from typing import TYPE_CHECKING, Annotated, Any, Literal

from django.http import HttpRequest, HttpResponse, HttpResponseNotAllowed, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.utils.translation import gettext as _
from pydantic import AfterValidator, Json

from corporate.lib.decorator import (
    authenticated_remote_realm_management_endpoint,
    authenticated_remote_server_management_endpoint,
)
from corporate.models.customers import get_customer_by_realm
from corporate.models.plans import CustomerPlan, get_current_plan_by_customer
from zerver.decorator import process_as_post, require_billing_access, zulip_login_required
from zerver.lib.exceptions import JsonableError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.lib.typed_endpoint_validators import check_int_in
from zerver.models import UserProfile
from zilencer.lib.remote_counts import MissingDataError
from zilencer.models import RemoteRealm, RemoteZulipServer

if TYPE_CHECKING:
    from corporate.lib.stripe import RemoteRealmBillingSession, RemoteServerBillingSession


billing_logger = logging.getLogger("corporate.stripe")

ALLOWED_PLANS_API_STATUS_VALUES = [
    CustomerPlan.ACTIVE,
    CustomerPlan.DOWNGRADE_AT_END_OF_CYCLE,
    CustomerPlan.SWITCH_TO_ANNUAL_AT_END_OF_CYCLE,
    CustomerPlan.SWITCH_TO_MONTHLY_AT_END_OF_CYCLE,
    CustomerPlan.FREE_TRIAL,
    CustomerPlan.DOWNGRADE_AT_END_OF_FREE_TRIAL,
    CustomerPlan.ENDED,
]


@zulip_login_required
@typed_endpoint
def billing_page(
    request: HttpRequest,
    *,
    success_message: str = "",
) -> HttpResponse:
    from corporate.lib.stripe import RealmBillingSession

    user = request.user
    assert user.is_authenticated

    billing_session = RealmBillingSession(user=user, realm=user.realm)

    context: dict[str, Any] = {
        "admin_access": user.has_billing_access,
        "has_active_plan": False,
        "org_name": billing_session.org_name(),
        "billing_base_url": "",
    }

    if not user.has_billing_access:
        return render(request, "corporate/billing/billing.html", context=context)

    if user.realm.plan_type == user.realm.PLAN_TYPE_STANDARD_FREE:
        return HttpResponseRedirect(reverse("sponsorship_request"))

    customer = get_customer_by_realm(user.realm)
    if customer is not None and customer.sponsorship_pending:
        # Don't redirect to sponsorship page if the realm is on a paid plan
        if not billing_session.on_paid_plan():
            return HttpResponseRedirect(reverse("sponsorship_request"))
        # If the realm is on a paid plan, show the sponsorship pending message
        context["sponsorship_pending"] = True

    if user.realm.plan_type == user.realm.PLAN_TYPE_LIMITED:
        return HttpResponseRedirect(reverse("plans"))

    if customer is None or get_current_plan_by_customer(customer) is None:
        return HttpResponseRedirect(reverse("upgrade_page"))

    main_context = billing_session.get_billing_page_context()
    if main_context:
        if main_context.get("current_plan_downgraded") is True:
            return HttpResponseRedirect(reverse("plans"))
        context.update(main_context)
        context["success_message"] = success_message

    return render(request, "corporate/billing/billing.html", context=context)


@typed_endpoint
@authenticated_remote_realm_management_endpoint
def remote_realm_billing_page(
    request: HttpRequest,
    billing_session: "RemoteRealmBillingSession",
    *,
    success_message: str = "",
) -> HttpResponse:
    realm_uuid = billing_session.remote_realm.uuid
    context: dict[str, Any] = {
        # We wouldn't be here if user didn't have access.
        "admin_access": billing_session.has_billing_access(),
        "has_active_plan": False,
        "org_name": billing_session.org_name(),
        "billing_base_url": billing_session.billing_base_url,
    }

    if billing_session.remote_realm.plan_type == RemoteRealm.PLAN_TYPE_COMMUNITY:  # nocoverage
        return HttpResponseRedirect(reverse("remote_realm_sponsorship_page", args=(realm_uuid,)))

    customer = billing_session.get_customer()
    if customer is not None and customer.sponsorship_pending:  # nocoverage
        # Don't redirect to sponsorship page if the remote realm is on a paid plan or
        # has scheduled an upgrade for their current complimentary access plan.
        if (
            not billing_session.on_paid_plan()
            and billing_session.get_complimentary_access_next_plan_name(customer) is None
        ):
            return HttpResponseRedirect(
                reverse("remote_realm_sponsorship_page", args=(realm_uuid,))
            )
        # If the realm is on a paid plan, show the sponsorship pending message
        context["sponsorship_pending"] = True

    if (
        customer is None
        or get_current_plan_by_customer(customer) is None
        or (
            billing_session.get_complimentary_access_next_plan_name(customer) is None
            and billing_session.remote_realm.plan_type
            in [
                RemoteRealm.PLAN_TYPE_SELF_MANAGED,
                RemoteRealm.PLAN_TYPE_SELF_MANAGED_LEGACY,
            ]
        )
    ):  # nocoverage
        return HttpResponseRedirect(reverse("remote_realm_plans_page", args=(realm_uuid,)))

    try:
        main_context = billing_session.get_billing_page_context()
    except MissingDataError:  # nocoverage
        return billing_session.missing_data_error_page(request)

    if main_context:
        if main_context.get("current_plan_downgraded") is True:
            return HttpResponseRedirect(reverse("remote_realm_plans_page", args=(realm_uuid,)))
        context.update(main_context)
        context["success_message"] = success_message

    return render(request, "corporate/billing/billing.html", context=context)


@typed_endpoint
@authenticated_remote_server_management_endpoint
def remote_server_billing_page(
    request: HttpRequest,
    billing_session: "RemoteServerBillingSession",
    *,
    success_message: str = "",
) -> HttpResponse:
    context: dict[str, Any] = {
        # We wouldn't be here if user didn't have access.
        "admin_access": billing_session.has_billing_access(),
        "has_active_plan": False,
        "org_name": billing_session.org_name(),
        "billing_base_url": billing_session.billing_base_url,
    }

    if (
        billing_session.remote_server.plan_type == RemoteZulipServer.PLAN_TYPE_COMMUNITY
    ):  # nocoverage
        return HttpResponseRedirect(
            reverse(
                "remote_server_sponsorship_page",
                kwargs={"server_uuid": billing_session.remote_server.uuid},
            )
        )

    customer = billing_session.get_customer()
    if customer is not None and customer.sponsorship_pending:
        # Don't redirect to sponsorship page if the remote realm is on a paid plan or
        # has scheduled an upgrade for their current complimentary access plan.
        if (
            not billing_session.on_paid_plan()
            and billing_session.get_complimentary_access_next_plan_name(customer) is None
        ):
            return HttpResponseRedirect(
                reverse(
                    "remote_server_sponsorship_page",
                    kwargs={"server_uuid": billing_session.remote_server.uuid},
                )
            )
        # If the realm is on a paid plan, show the sponsorship pending message
        context["sponsorship_pending"] = True  # nocoverage

    if (
        customer is None
        or get_current_plan_by_customer(customer) is None
        or (
            billing_session.get_complimentary_access_next_plan_name(customer) is None
            and billing_session.remote_server.plan_type
            in [
                RemoteZulipServer.PLAN_TYPE_SELF_MANAGED,
                RemoteZulipServer.PLAN_TYPE_SELF_MANAGED_LEGACY,
            ]
        )
    ):
        return HttpResponseRedirect(
            reverse(
                "remote_server_upgrade_page",
                kwargs={"server_uuid": billing_session.remote_server.uuid},
            )
        )

    try:
        main_context = billing_session.get_billing_page_context()
    except MissingDataError:  # nocoverage
        return billing_session.missing_data_error_page(request)

    if main_context:
        if main_context.get("current_plan_downgraded") is True:
            return HttpResponseRedirect(
                reverse(
                    "remote_server_plans_page",
                    kwargs={"server_uuid": billing_session.remote_server.uuid},
                )
            )
        context.update(main_context)
        context["success_message"] = success_message

    return render(request, "corporate/billing/billing.html", context=context)


@require_billing_access
@typed_endpoint
def update_plan(
    request: HttpRequest,
    user: UserProfile,
    *,
    status: Annotated[
        Json[int], AfterValidator(lambda x: check_int_in(x, ALLOWED_PLANS_API_STATUS_VALUES))
    ]
    | None = None,
    licenses: Json[int] | None = None,
    licenses_at_next_renewal: Json[int] | None = None,
    schedule: Json[int] | None = None,
    toggle_license_management: Json[bool] = False,
) -> HttpResponse:
    from corporate.lib.stripe import RealmBillingSession, UpdatePlanRequest

    update_plan_request = UpdatePlanRequest(
        status=status,
        licenses=licenses,
        licenses_at_next_renewal=licenses_at_next_renewal,
        schedule=schedule,
        toggle_license_management=toggle_license_management,
    )
    billing_session = RealmBillingSession(user=user)
    billing_session.do_update_plan(update_plan_request)
    return json_success(request)


@process_as_post
@typed_endpoint
@authenticated_remote_realm_management_endpoint
def update_plan_for_remote_realm(
    request: HttpRequest,
    billing_session: "RemoteRealmBillingSession",
    *,
    status: Annotated[
        Json[int], AfterValidator(lambda x: check_int_in(x, ALLOWED_PLANS_API_STATUS_VALUES))
    ]
    | None = None,
    licenses: Json[int] | None = None,
    licenses_at_next_renewal: Json[int] | None = None,
    schedule: Json[int] | None = None,
    toggle_license_management: Json[bool] = False,
) -> HttpResponse:
    from corporate.lib.stripe import UpdatePlanRequest

    update_plan_request = UpdatePlanRequest(
        status=status,
        licenses=licenses,
        licenses_at_next_renewal=licenses_at_next_renewal,
        schedule=schedule,
        toggle_license_management=toggle_license_management,
    )
    billing_session.do_update_plan(update_plan_request)
    return json_success(request)


@process_as_post
@typed_endpoint
@authenticated_remote_server_management_endpoint
def update_plan_for_remote_server(
    request: HttpRequest,
    billing_session: "RemoteServerBillingSession",
    *,
    status: Annotated[
        Json[int], AfterValidator(lambda x: check_int_in(x, ALLOWED_PLANS_API_STATUS_VALUES))
    ]
    | None = None,
    licenses: Json[int] | None = None,
    licenses_at_next_renewal: Json[int] | None = None,
    schedule: Json[int] | None = None,
    toggle_license_management: Json[bool] = False,
) -> HttpResponse:
    from corporate.lib.stripe import UpdatePlanRequest

    update_plan_request = UpdatePlanRequest(
        status=status,
        licenses=licenses,
        licenses_at_next_renewal=licenses_at_next_renewal,
        schedule=schedule,
        toggle_license_management=toggle_license_management,
    )
    billing_session.do_update_plan(update_plan_request)
    return json_success(request)


@typed_endpoint
@authenticated_remote_server_management_endpoint
def remote_server_deactivate_page(
    request: HttpRequest,
    billing_session: "RemoteServerBillingSession",
    *,
    confirmed: Literal["true"] | None = None,
) -> HttpResponse:
    from corporate.lib.stripe import (
        ServerDeactivateWithExistingPlanError,
        do_deactivate_remote_server,
    )

    if request.method not in ["GET", "POST"]:  # nocoverage
        return HttpResponseNotAllowed(["GET", "POST"])

    remote_server = billing_session.remote_server
    context = {
        "server_hostname": remote_server.hostname,
        "action_url": reverse(remote_server_deactivate_page, args=[str(remote_server.uuid)]),
    }
    if request.method == "GET":
        return render(
            request, "corporate/billing/remote_billing_server_deactivate.html", context=context
        )

    assert request.method == "POST"
    if confirmed is None:  # nocoverage
        # Should be impossible if the user is using the UI.
        raise JsonableError(_("Parameter 'confirmed' is required"))

    try:
        do_deactivate_remote_server(remote_server, billing_session)
    except ServerDeactivateWithExistingPlanError:  # nocoverage
        context["show_existing_plan_error"] = "true"
        return render(
            request, "corporate/billing/remote_billing_server_deactivate.html", context=context
        )

    return render(
        request,
        "corporate/billing/remote_billing_server_deactivated_success.html",
        context={"server_hostname": remote_server.hostname},
    )
```

--------------------------------------------------------------------------------

---[FILE: event_status.py]---
Location: zulip-main/corporate/views/event_status.py
Signals: Django

```python
import logging
from typing import TYPE_CHECKING

from django.http import HttpRequest, HttpResponse
from django.shortcuts import render

from corporate.lib.decorator import (
    authenticated_remote_realm_management_endpoint,
    authenticated_remote_server_management_endpoint,
    self_hosting_management_endpoint,
)
from zerver.decorator import require_organization_member, zulip_login_required
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.models import UserProfile

if TYPE_CHECKING:
    from corporate.lib.stripe import RemoteRealmBillingSession, RemoteServerBillingSession

billing_logger = logging.getLogger("corporate.stripe")


@require_organization_member
@typed_endpoint
def event_status(
    request: HttpRequest,
    user: UserProfile,
    *,
    stripe_session_id: str | None = None,
    stripe_invoice_id: str | None = None,
) -> HttpResponse:
    from corporate.lib.stripe import EventStatusRequest, RealmBillingSession

    event_status_request = EventStatusRequest(
        stripe_session_id=stripe_session_id, stripe_invoice_id=stripe_invoice_id
    )
    billing_session = RealmBillingSession(user)
    data = billing_session.get_event_status(event_status_request)
    return json_success(request, data)


@typed_endpoint
@authenticated_remote_realm_management_endpoint
def remote_realm_event_status(
    request: HttpRequest,
    billing_session: "RemoteRealmBillingSession",
    *,
    stripe_session_id: str | None = None,
    stripe_invoice_id: str | None = None,
) -> HttpResponse:
    from corporate.lib.stripe import EventStatusRequest

    event_status_request = EventStatusRequest(
        stripe_session_id=stripe_session_id, stripe_invoice_id=stripe_invoice_id
    )
    data = billing_session.get_event_status(event_status_request)
    return json_success(request, data)


@typed_endpoint
@authenticated_remote_server_management_endpoint
def remote_server_event_status(
    request: HttpRequest,
    billing_session: "RemoteServerBillingSession",
    *,
    stripe_session_id: str | None = None,
    stripe_invoice_id: str | None = None,
) -> HttpResponse:  # nocoverage
    from corporate.lib.stripe import EventStatusRequest

    event_status_request = EventStatusRequest(
        stripe_session_id=stripe_session_id, stripe_invoice_id=stripe_invoice_id
    )
    data = billing_session.get_event_status(event_status_request)
    return json_success(request, data)


@zulip_login_required
@typed_endpoint
def event_status_page(
    request: HttpRequest,
    *,
    stripe_session_id: str = "",
    stripe_invoice_id: str = "",
) -> HttpResponse:
    context = {
        "stripe_session_id": stripe_session_id,
        "stripe_invoice_id": stripe_invoice_id,
        "billing_base_url": "",
    }
    return render(request, "corporate/billing/event_status.html", context=context)


@self_hosting_management_endpoint
@typed_endpoint
def remote_realm_event_status_page(
    request: HttpRequest,
    *,
    realm_uuid: str = "",
    server_uuid: str = "",
    stripe_session_id: str = "",
    stripe_invoice_id: str = "",
) -> HttpResponse:  # nocoverage
    context = {
        "stripe_session_id": stripe_session_id,
        "stripe_invoice_id": stripe_invoice_id,
        "billing_base_url": f"/realm/{realm_uuid}",
    }
    return render(request, "corporate/billing/event_status.html", context=context)


@self_hosting_management_endpoint
@typed_endpoint
def remote_server_event_status_page(
    request: HttpRequest,
    *,
    realm_uuid: str = "",
    server_uuid: str = "",
    stripe_session_id: str = "",
    stripe_invoice_id: str = "",
) -> HttpResponse:  # nocoverage
    context = {
        "stripe_session_id": stripe_session_id,
        "stripe_invoice_id": stripe_invoice_id,
        "billing_base_url": f"/server/{server_uuid}",
    }
    return render(request, "corporate/billing/event_status.html", context=context)
```

--------------------------------------------------------------------------------

---[FILE: installation_activity.py]---
Location: zulip-main/corporate/views/installation_activity.py
Signals: Django, Pydantic

```python
from collections import defaultdict
from typing import Any

from django.conf import settings
from django.db import connection
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from django.template import loader
from django.utils.timezone import now as timezone_now
from markupsafe import Markup
from psycopg2.sql import SQL
from pydantic import Json

from analytics.lib.counts import COUNT_STATS
from corporate.lib.activity import (
    dictfetchall,
    fix_rows,
    format_datetime_as_date,
    format_optional_datetime,
    get_estimated_arr_and_rate_by_realm,
    get_query_data,
    make_table,
    realm_activity_link,
    realm_stats_link,
    realm_support_link,
    realm_url_link,
)
from corporate.views.support import get_plan_type_string
from zerver.decorator import require_server_admin
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.models import Realm
from zerver.models.realm_audit_logs import AuditLogEventType, RealmAuditLog
from zerver.models.realms import get_org_type_display_name
from zerver.models.users import UserProfile


def get_realm_day_counts() -> dict[str, dict[str, Markup]]:
    # To align with UTC days, we subtract an hour from end_time to
    # get the start_time, since the hour that starts at midnight was
    # on the previous day.
    query = SQL(
        """
        select
            r.string_id,
            (now()::date - (end_time - interval '1 hour')::date) age,
            coalesce(sum(value), 0) cnt
        from zerver_realm r
        join analytics_realmcount rc on r.id = rc.realm_id
        where
            property = 'messages_sent:is_bot:hour'
        and
            subgroup = 'false'
        and
            end_time > now()::date - interval '8 day' - interval '1 hour'
        group by
            r.string_id,
            age
    """
    )
    cursor = connection.cursor()
    cursor.execute(query)
    rows = dictfetchall(cursor)
    cursor.close()

    counts: dict[str, dict[int, int]] = defaultdict(dict)
    for row in rows:
        counts[row["string_id"]][row["age"]] = row["cnt"]

    def format_count(cnt: int, style: str | None = None) -> Markup:
        if style is not None:
            good_bad = style
        elif cnt == min_cnt:
            good_bad = "bad"
        elif cnt == max_cnt:
            good_bad = "good"
        else:
            good_bad = "neutral"

        return Markup('<td class="number {good_bad}">{cnt}</td>').format(good_bad=good_bad, cnt=cnt)

    result = {}
    for string_id, realm_counts in counts.items():
        raw_cnts = [realm_counts.get(age, 0) for age in range(8)]
        min_cnt = min(raw_cnts[1:])
        max_cnt = max(raw_cnts[1:])

        cnts = format_count(raw_cnts[0], "neutral") + Markup().join(map(format_count, raw_cnts[1:]))
        result[string_id] = dict(cnts=cnts)

    return result


def realm_summary_table(export: bool) -> str:
    from corporate.lib.stripe import cents_to_dollar_string

    now = timezone_now()

    query = SQL(
        """
        SELECT
            realm.string_id,
            realm.date_created,
            realm.plan_type,
            realm.org_type,
            coalesce(wau_table.value, 0) wau_count,
            coalesce(dau_table.value, 0) dau_count,
            coalesce(user_count_table.value, 0) user_profile_count,
            coalesce(bot_count_table.value, 0) bot_count,
            coalesce(realm_audit_log_table.how_realm_creator_found_zulip, '') how_realm_creator_found_zulip,
            coalesce(realm_audit_log_table.how_realm_creator_found_zulip_extra_context, '') how_realm_creator_found_zulip_extra_context,
            realm_admin_user.delivery_email admin_email
        FROM
            zerver_realm as realm
            LEFT OUTER JOIN (
                SELECT
                    value _14day_active_humans,
                    realm_id
                from
                    analytics_realmcount
                WHERE
                    property = 'realm_active_humans::day'
                    AND end_time = %(realm_active_humans_end_time)s
            ) as _14day_active_humans_table ON realm.id = _14day_active_humans_table.realm_id
            LEFT OUTER JOIN (
                SELECT
                    value,
                    realm_id
                from
                    analytics_realmcount
                WHERE
                    property = '7day_actives::day'
                    AND end_time = %(seven_day_actives_end_time)s
            ) as wau_table ON realm.id = wau_table.realm_id
            LEFT OUTER JOIN (
                SELECT
                    value,
                    realm_id
                from
                    analytics_realmcount
                WHERE
                    property = '1day_actives::day'
                    AND end_time = %(one_day_actives_end_time)s
            ) as dau_table ON realm.id = dau_table.realm_id
            LEFT OUTER JOIN (
                SELECT
                    value,
                    realm_id
                from
                    analytics_realmcount
                WHERE
                    property = 'active_users_audit:is_bot:day'
                    AND subgroup = 'false'
                    AND end_time = %(active_users_audit_end_time)s
            ) as user_count_table ON realm.id = user_count_table.realm_id
            LEFT OUTER JOIN (
                SELECT
                    value,
                    realm_id
                from
                    analytics_realmcount
                WHERE
                    property = 'active_users_audit:is_bot:day'
                    AND subgroup = 'true'
                    AND end_time = %(active_users_audit_end_time)s
            ) as bot_count_table ON realm.id = bot_count_table.realm_id
            LEFT OUTER JOIN (
                SELECT
                    extra_data->>'how_realm_creator_found_zulip' as how_realm_creator_found_zulip,
                    extra_data->>'how_realm_creator_found_zulip_extra_context' as how_realm_creator_found_zulip_extra_context,
                    realm_id
                from
                    zerver_realmauditlog
                WHERE
                    event_type = %(realm_creation_event_type)s
            ) as realm_audit_log_table ON realm.id = realm_audit_log_table.realm_id
            LEFT OUTER JOIN (
                SELECT
                    delivery_email,
                    realm_id
                from
                    zerver_userprofile
                WHERE
                    is_bot=False
                    AND is_active=True
                    AND role IN %(admin_roles)s
            ) as realm_admin_user ON realm.id = realm_admin_user.realm_id
        WHERE
            _14day_active_humans IS NOT NULL
            or realm.plan_type = 3
        ORDER BY
            dau_count DESC,
            string_id ASC
    """
    )

    cursor = connection.cursor()
    cursor.execute(
        query,
        {
            "realm_active_humans_end_time": COUNT_STATS[
                "realm_active_humans::day"
            ].last_successful_fill(),
            "seven_day_actives_end_time": COUNT_STATS["7day_actives::day"].last_successful_fill(),
            "one_day_actives_end_time": COUNT_STATS["1day_actives::day"].last_successful_fill(),
            "active_users_audit_end_time": COUNT_STATS[
                "active_users_audit:is_bot:day"
            ].last_successful_fill(),
            "realm_creation_event_type": AuditLogEventType.REALM_CREATED,
            "admin_roles": (UserProfile.ROLE_REALM_ADMINISTRATOR, UserProfile.ROLE_REALM_OWNER),
        },
    )
    raw_rows = dictfetchall(cursor)
    cursor.close()

    rows: list[dict[str, Any]] = []
    admin_emails: dict[str, str] = {}
    # Process duplicate realm rows due to multiple admin users,
    # and collect all admin user emails into one string.
    for row in raw_rows:
        realm_string_id = row["string_id"]
        admin_email = row.pop("admin_email")
        if realm_string_id in admin_emails:
            admin_emails[realm_string_id] = admin_emails[realm_string_id] + ", " + admin_email
        else:
            admin_emails[realm_string_id] = admin_email
            rows.append(row)

    realm_messages_per_day_counts = get_realm_day_counts()
    total_arr = 0
    num_active_sites = 0
    total_dau_count = 0
    total_user_profile_count = 0
    total_bot_count = 0
    total_wau_count = 0
    if settings.BILLING_ENABLED:
        estimated_arrs, plan_rates = get_estimated_arr_and_rate_by_realm()
        total_arr = sum(estimated_arrs.values())

    for row in rows:
        realm_string_id = row.pop("string_id")

        # Format fields and add links.
        row["date_created_day"] = format_datetime_as_date(row["date_created"])
        row["age_days"] = int((now - row["date_created"]).total_seconds() / 86400)
        row["is_new"] = row["age_days"] < 12 * 7
        row["org_type_string"] = get_org_type_display_name(row["org_type"])
        row["realm_url"] = realm_url_link(realm_string_id)
        row["stats_link"] = realm_stats_link(realm_string_id)
        row["support_link"] = realm_support_link(realm_string_id)
        row["activity_link"] = realm_activity_link(realm_string_id)

        how_found = row["how_realm_creator_found_zulip"]
        extra_context = row["how_realm_creator_found_zulip_extra_context"]
        if how_found in (
            RealmAuditLog.HOW_REALM_CREATOR_FOUND_ZULIP_OPTIONS["other"],
            RealmAuditLog.HOW_REALM_CREATOR_FOUND_ZULIP_OPTIONS["ad"],
            RealmAuditLog.HOW_REALM_CREATOR_FOUND_ZULIP_OPTIONS["review_site"],
            RealmAuditLog.HOW_REALM_CREATOR_FOUND_ZULIP_OPTIONS["ai_chatbot"],
        ):
            row["how_realm_creator_found_zulip"] += f": {extra_context}"
        elif how_found == RealmAuditLog.HOW_REALM_CREATOR_FOUND_ZULIP_OPTIONS["existing_user"]:
            row["how_realm_creator_found_zulip"] = f"Organization: {extra_context}"

        # Get human messages sent per day.
        try:
            row["history"] = realm_messages_per_day_counts[realm_string_id]["cnts"]
        except Exception:
            row["history"] = ""

        # Estimate annual recurring revenue.
        if settings.BILLING_ENABLED:
            row["plan_type_string"] = get_plan_type_string(row["plan_type"])

            if realm_string_id in estimated_arrs:
                row["arr"] = f"${cents_to_dollar_string(estimated_arrs[realm_string_id])}"

            if row["plan_type"] in [Realm.PLAN_TYPE_STANDARD, Realm.PLAN_TYPE_PLUS]:
                row["effective_rate"] = plan_rates.get(realm_string_id, "")
            elif row["plan_type"] == Realm.PLAN_TYPE_STANDARD_FREE:
                row["effective_rate"] = 0
            else:
                row["effective_rate"] = ""

        # Count active realms.
        if row["dau_count"] >= 5:
            num_active_sites += 1

        # Get total row counts.
        total_dau_count += int(row["dau_count"])
        total_user_profile_count += int(row["user_profile_count"])
        total_bot_count += int(row["bot_count"])
        total_wau_count += int(row["wau_count"])

        # Add admin users email string
        if export:
            row["admin_emails"] = admin_emails[realm_string_id]

    total_row = [
        "Total",
        "",
        "",
        "",
        f"${cents_to_dollar_string(total_arr)}",
        "",
        "",
        "",
        total_dau_count,
        total_wau_count,
        total_user_profile_count,
        total_bot_count,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
    ]

    if export:
        total_row.pop(1)

    content = loader.render_to_string(
        "corporate/activity/installation_activity_table.html",
        dict(
            rows=rows,
            totals=total_row,
            num_active_sites=num_active_sites,
            utctime=now.isoformat(" ", "minutes"),
            billing_enabled=settings.BILLING_ENABLED,
            export=export,
        ),
    )
    return content


@require_server_admin
@typed_endpoint
def get_installation_activity(request: HttpRequest, *, export: Json[bool] = False) -> HttpResponse:
    content: str = realm_summary_table(export)
    title = "Installation activity"

    return render(
        request,
        "corporate/activity/activity.html",
        context=dict(data=content, title=title, is_home=True),
    )


@require_server_admin
def get_integrations_activity(request: HttpRequest) -> HttpResponse:
    title = "Integrations by client"

    query = SQL(
        """
        select
            case
                when query like '%%external%%' then split_part(query, '/', 5)
                else client.name
            end client_name,
            realm.string_id,
            sum(count) as hits,
            max(last_visit) as last_time
        from zerver_useractivity ua
        join zerver_client client on client.id = ua.client_id
        join zerver_userprofile up on up.id = ua.user_profile_id
        join zerver_realm realm on realm.id = up.realm_id
        where
            (query in ('send_message_backend', '/api/v1/send_message')
            and client.name not in ('Android', 'ZulipiOS')
            and client.name not like 'test: Zulip%%'
            )
        or
            query like '%%external%%'
        group by client_name, string_id
        having max(last_visit) > now() - interval '2 week'
        order by client_name, string_id
    """
    )

    cols = ["Client", "Realm", "Hits", "Last time (UTC)", "Links"]
    rows = get_query_data(query)
    for row in rows:
        realm_str = row[1]
        activity = realm_activity_link(realm_str)
        stats = realm_stats_link(realm_str)
        row.append(activity + " " + stats)

    for i, col in enumerate(cols):
        if col == "Realm":
            fix_rows(rows, i, realm_support_link)
        elif col == "Last time (UTC)":
            fix_rows(rows, i, format_optional_datetime)

    content = make_table(title, cols, rows)
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

---[FILE: plan_activity.py]---
Location: zulip-main/corporate/views/plan_activity.py
Signals: Django

```python
from typing import Any

from django.http import HttpRequest, HttpResponse
from django.shortcuts import render

from corporate.lib.activity import ActivityHeaderEntry, format_optional_datetime, make_table
from corporate.models.customers import Customer
from corporate.models.licenses import LicenseLedger
from corporate.models.plans import CustomerPlan
from zerver.decorator import require_server_admin


def get_plan_billing_entity_name(customer: Customer) -> str:
    if customer.realm:
        return customer.realm.name
    elif customer.remote_realm:
        return customer.remote_realm.name
    assert customer.remote_server is not None
    return customer.remote_server.hostname


@require_server_admin
def get_plan_ledger(request: HttpRequest, plan_id: int) -> HttpResponse:
    plan = CustomerPlan.objects.get(id=plan_id)
    ledger_entries = LicenseLedger.objects.filter(plan=plan).order_by("-event_time")

    name = get_plan_billing_entity_name(plan.customer)
    title = f"{name}"
    cols = [
        "Event time (UTC)",
        "Renewal",
        "License count",
        "Renewal count",
    ]

    def row(record: LicenseLedger) -> list[Any]:
        return [
            format_optional_datetime(record.event_time),
            record.is_renewal,
            record.licenses,
            record.licenses_at_next_renewal,
        ]

    rows = list(map(row, ledger_entries))

    header_entries = []
    header_entries.append(
        ActivityHeaderEntry(name="Plan name", value=CustomerPlan.name_from_tier(plan.tier))
    )
    header_entries.append(
        ActivityHeaderEntry(
            name="Start of next billing cycle (UTC)",
            value=format_optional_datetime(plan.next_invoice_date, True),
        )
    )
    if plan.invoiced_through is not None:
        header_entries.append(
            ActivityHeaderEntry(
                name="Entry last checked during invoicing",
                value=str(plan.invoiced_through),
            )
        )

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
