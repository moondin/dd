---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:12Z
part: 22
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 22 of 1290)

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

---[FILE: decorator.py]---
Location: zulip-main/corporate/lib/decorator.py
Signals: Django

```python
import inspect
from collections.abc import Callable
from functools import wraps
from typing import TYPE_CHECKING, Concatenate
from urllib.parse import urlencode, urljoin

from django.conf import settings
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from typing_extensions import ParamSpec

from corporate.lib.remote_billing_util import (
    RemoteBillingIdentityExpiredError,
    get_remote_realm_and_user_from_session,
    get_remote_server_and_user_from_session,
)
from zerver.lib.exceptions import RemoteBillingAuthenticationError
from zerver.lib.subdomains import get_subdomain
from zerver.lib.url_encoding import append_url_query_string
from zilencer.models import RemoteRealm

if TYPE_CHECKING:
    from corporate.lib.stripe import RemoteRealmBillingSession, RemoteServerBillingSession

ParamT = ParamSpec("ParamT")


def session_expired_ajax_response(login_url: str) -> JsonResponse:  # nocoverage
    return JsonResponse(
        {
            "error_message": "Remote billing authentication expired",
            "login_url": login_url,
        },
        status=401,
    )


def is_self_hosting_management_subdomain(request: HttpRequest) -> bool:
    subdomain = get_subdomain(request)
    return subdomain == settings.SELF_HOSTING_MANAGEMENT_SUBDOMAIN


def self_hosting_management_endpoint(
    view_func: Callable[Concatenate[HttpRequest, ParamT], HttpResponse],
) -> Callable[Concatenate[HttpRequest, ParamT], HttpResponse]:
    @wraps(view_func)
    def _wrapped_view_func(
        request: HttpRequest, /, *args: ParamT.args, **kwargs: ParamT.kwargs
    ) -> HttpResponse:
        if not is_self_hosting_management_subdomain(request):  # nocoverage
            return render(request, "404.html", status=404)
        return view_func(request, *args, **kwargs)

    return _wrapped_view_func


def authenticated_remote_realm_management_endpoint(
    view_func: Callable[
        Concatenate[HttpRequest, "RemoteRealmBillingSession", ParamT], HttpResponse
    ],
) -> Callable[Concatenate[HttpRequest, ParamT], HttpResponse]:
    @wraps(view_func)
    def _wrapped_view_func(
        request: HttpRequest,
        /,
        *args: ParamT.args,
        **kwargs: ParamT.kwargs,
    ) -> HttpResponse:
        from corporate.lib.stripe import RemoteRealmBillingSession

        if not is_self_hosting_management_subdomain(request):  # nocoverage
            return render(request, "404.html", status=404)

        realm_uuid = kwargs.pop("realm_uuid")
        if realm_uuid is not None and not isinstance(realm_uuid, str):  # nocoverage
            raise TypeError("realm_uuid must be a string or None")

        try:
            remote_realm, remote_billing_user = get_remote_realm_and_user_from_session(
                request, realm_uuid
            )
        except RemoteBillingIdentityExpiredError as e:
            # The user had an authenticated session with an identity_dict,
            # but it expired.
            # We want to redirect back to the start of their login flow
            # at their {realm.host}/self-hosted-billing/ with a proper
            # next parameter to take them back to what they're trying
            # to access after re-authing.
            # Note: Theoretically we could take the realm_uuid from the request
            # path or params to figure out the remote_realm.host for the redirect,
            # but that would mean leaking that .host value to anyone who knows
            # the uuid. Therefore we limit ourselves to taking the realm_uuid
            # from the identity_dict - since that proves that the user at least
            # previously was successfully authenticated as a billing admin of that
            # realm.
            realm_uuid = e.realm_uuid
            server_uuid = e.server_uuid
            uri_scheme = e.uri_scheme
            if realm_uuid is None:
                # This doesn't make sense - if get_remote_realm_and_user_from_session
                # found an expired identity dict, it should have had a realm_uuid.
                raise AssertionError

            assert server_uuid is not None, "identity_dict with realm_uuid must have server_uuid"
            assert uri_scheme is not None, "identity_dict with realm_uuid must have uri_scheme"

            try:
                remote_realm = RemoteRealm.objects.get(uuid=realm_uuid, server__uuid=server_uuid)
            except RemoteRealm.DoesNotExist:
                # This should be impossible - unless the RemoteRealm existed and somehow the row
                # was deleted.
                raise AssertionError

            # Using EXTERNAL_URI_SCHEME means we'll do https:// in production, which is
            # the sane default - while having http:// in development, which will allow
            # these redirects to work there for testing.
            url = urljoin(uri_scheme + remote_realm.host, "/self-hosted-billing/")

            page_type = get_next_page_param_from_request_path(request)
            if page_type is not None:
                query = urlencode({"next_page": page_type})
                url = append_url_query_string(url, query)

            # Return error for AJAX requests with url.
            if (
                request.get_preferred_type(["application/json", "text/html"]) != "text/html"
            ):  # nocoverage
                return session_expired_ajax_response(url)

            return HttpResponseRedirect(url)

        billing_session = RemoteRealmBillingSession(
            remote_realm, remote_billing_user=remote_billing_user
        )
        return view_func(request, billing_session, *args, **kwargs)

    signature = inspect.signature(view_func)
    request_parameter, billing_session_parameter, *other_parameters = signature.parameters.values()
    _wrapped_view_func.__signature__ = signature.replace(  # type: ignore[attr-defined] # too magic
        parameters=[request_parameter, *other_parameters]
    )
    _wrapped_view_func.__annotations__ = {
        k: v for k, v in view_func.__annotations__.items() if k != billing_session_parameter.name
    }

    return _wrapped_view_func


def get_next_page_param_from_request_path(request: HttpRequest) -> str | None:
    # Our endpoint URLs in this subsystem end with something like
    # /sponsorship or /plans etc.
    # Therefore we can use this nice property to figure out easily what
    # kind of page the user is trying to access and find the right value
    # for the `next` query parameter.
    path = request.path.removesuffix("/")
    page_type = path.split("/")[-1]

    from corporate.views.remote_billing_page import (
        VALID_NEXT_PAGES as REMOTE_BILLING_VALID_NEXT_PAGES,
    )

    if page_type in REMOTE_BILLING_VALID_NEXT_PAGES:
        return page_type

    # page_type is not where we want user to go after a login, so just render the default page.
    return None  # nocoverage


def authenticated_remote_server_management_endpoint(
    view_func: Callable[
        Concatenate[HttpRequest, "RemoteServerBillingSession", ParamT], HttpResponse
    ],
) -> Callable[Concatenate[HttpRequest, ParamT], HttpResponse]:
    @wraps(view_func)
    def _wrapped_view_func(
        request: HttpRequest,
        /,
        *args: ParamT.args,
        **kwargs: ParamT.kwargs,
    ) -> HttpResponse:
        from corporate.lib.stripe import RemoteServerBillingSession

        if not is_self_hosting_management_subdomain(request):  # nocoverage
            return render(request, "404.html", status=404)

        server_uuid = kwargs.pop("server_uuid")
        if not isinstance(server_uuid, str):
            raise TypeError("server_uuid must be a string")  # nocoverage

        try:
            remote_server, remote_billing_user = get_remote_server_and_user_from_session(
                request, server_uuid=server_uuid
            )
            if remote_billing_user is None:
                # This should only be possible if the user hasn't finished the confirmation flow
                # and doesn't have a fully authenticated session yet. They should not be attempting
                # to access this endpoint yet.
                raise RemoteBillingAuthenticationError
        except (RemoteBillingIdentityExpiredError, RemoteBillingAuthenticationError):
            # In this flow, we can only redirect to our local "legacy server flow login" page.
            # That means that we can do it universally whether the user has an expired
            # identity_dict, or just lacks any form of authentication info at all - there
            # are no security concerns since this is just a local redirect.
            page_type = get_next_page_param_from_request_path(request)
            url = reverse(
                "remote_billing_legacy_server_login",
                query=None if page_type is None else {"next_page": page_type},
            )

            # Return error for AJAX requests with url.
            if (
                request.get_preferred_type(["application/json", "text/html"]) != "text/html"
            ):  # nocoverage
                return session_expired_ajax_response(url)

            return HttpResponseRedirect(url)

        assert remote_billing_user is not None
        billing_session = RemoteServerBillingSession(
            remote_server, remote_billing_user=remote_billing_user
        )
        return view_func(request, billing_session, *args, **kwargs)

    signature = inspect.signature(view_func)
    request_parameter, billing_session_parameter, *other_parameters = signature.parameters.values()
    _wrapped_view_func.__signature__ = signature.replace(  # type: ignore[attr-defined] # too magic
        parameters=[request_parameter, *other_parameters]
    )
    _wrapped_view_func.__annotations__ = {
        k: v for k, v in view_func.__annotations__.items() if k != billing_session_parameter.name
    }

    return _wrapped_view_func
```

--------------------------------------------------------------------------------

---[FILE: registration.py]---
Location: zulip-main/corporate/lib/registration.py
Signals: Django

```python
from django.conf import settings
from django.utils.translation import gettext as _

from corporate.lib.stripe import LicenseLimitError, get_latest_seat_count, get_seat_count
from corporate.models.plans import CustomerPlan, get_current_plan_by_realm
from zerver.actions.create_user import send_group_direct_message_to_admins
from zerver.lib.exceptions import InvitationError, JsonableError
from zerver.models import Realm, UserProfile
from zerver.models.users import get_system_bot


def get_plan_if_manual_license_management_enforced(realm: Realm) -> CustomerPlan | None:
    plan = get_current_plan_by_realm(realm)
    if plan is None or plan.automanage_licenses or plan.customer.exempt_from_license_number_check:
        return None
    return plan


def generate_licenses_low_warning_message_if_required(realm: Realm) -> str | None:
    plan = get_plan_if_manual_license_management_enforced(realm)
    if plan is None:
        return None

    licenses_remaining = plan.licenses() - get_latest_seat_count(realm)
    if licenses_remaining > 3:
        return None

    format_kwargs = {
        "billing_page_link": "/billing/",
        "deactivate_user_help_page_link": "/help/deactivate-or-reactivate-a-user",
    }

    if licenses_remaining <= 0:
        return _(
            "Your organization has no Zulip licenses remaining and can no longer accept new users. "
            "Please [increase the number of licenses]({billing_page_link}) or "
            "[deactivate inactive users]({deactivate_user_help_page_link}) to allow new users to join."
        ).format(**format_kwargs)

    return {
        1: _(
            "Your organization has only one Zulip license remaining. You can "
            "[increase the number of licenses]({billing_page_link}) or [deactivate inactive users]({deactivate_user_help_page_link}) "
            "to allow more than one user to join."
        ),
        2: _(
            "Your organization has only two Zulip licenses remaining. You can "
            "[increase the number of licenses]({billing_page_link}) or [deactivate inactive users]({deactivate_user_help_page_link}) "
            "to allow more than two users to join."
        ),
        3: _(
            "Your organization has only three Zulip licenses remaining. You can "
            "[increase the number of licenses]({billing_page_link}) or [deactivate inactive users]({deactivate_user_help_page_link}) "
            "to allow more than three users to join."
        ),
    }[licenses_remaining].format(**format_kwargs)


def send_user_unable_to_signup_group_direct_message_to_admins(
    realm: Realm, user_email: str
) -> None:
    message = _(
        "A new user ({email}) was unable to join because your organization does not have enough "
        "Zulip licenses. To allow new users to join, make sure that the [number of licenses for "
        "the current and next billing period]({billing_page_link}) is greater than the current "
        "number of users."
    ).format(
        email=user_email,
        billing_page_link="/billing/",
    )

    send_group_direct_message_to_admins(
        get_system_bot(settings.NOTIFICATION_BOT, realm.id), realm, message
    )


def check_spare_licenses_available(
    realm: Realm, plan: CustomerPlan, extra_non_guests_count: int = 0, extra_guests_count: int = 0
) -> None:
    seat_count = get_seat_count(
        realm, extra_non_guests_count=extra_non_guests_count, extra_guests_count=extra_guests_count
    )
    current_licenses = plan.licenses()
    renewal_licenses = plan.licenses_at_next_renewal()
    if current_licenses < seat_count or (renewal_licenses and renewal_licenses < seat_count):
        raise LicenseLimitError


def check_spare_licenses_available_for_registering_new_user(
    realm: Realm,
    user_email_to_add: str,
    role: int,
) -> None:
    plan = get_plan_if_manual_license_management_enforced(realm)
    if plan is None:
        return

    try:
        if role == UserProfile.ROLE_GUEST:
            check_spare_licenses_available(realm, plan, extra_guests_count=1)
        else:
            check_spare_licenses_available(realm, plan, extra_non_guests_count=1)
    except LicenseLimitError:
        send_user_unable_to_signup_group_direct_message_to_admins(realm, user_email_to_add)
        raise


def check_spare_licenses_available_for_inviting_new_users(
    realm: Realm, extra_non_guests_count: int = 0, extra_guests_count: int = 0
) -> None:
    plan = get_plan_if_manual_license_management_enforced(realm)
    if plan is None:
        return

    try:
        check_spare_licenses_available(realm, plan, extra_non_guests_count, extra_guests_count)
    except LicenseLimitError:
        message = _(
            "Your organization does not have enough Zulip licenses. Invitations were not sent."
        )
        raise InvitationError(message, [], sent_invitations=False, license_limit_reached=True)


def check_spare_license_available_for_changing_guest_user_role(realm: Realm) -> None:
    plan = get_plan_if_manual_license_management_enforced(realm)
    if plan is None:
        return

    try:
        check_spare_licenses_available(realm, plan, extra_non_guests_count=1)
    except LicenseLimitError:
        error_message = _(
            "Your organization does not have enough Zulip licenses to change a guest user's role."
        )
        raise JsonableError(error_message)
```

--------------------------------------------------------------------------------

---[FILE: remote_billing_util.py]---
Location: zulip-main/corporate/lib/remote_billing_util.py
Signals: Django

```python
import logging
from typing import Literal, TypedDict, overload

from django.http import HttpRequest
from django.utils.timezone import now as timezone_now
from django.utils.translation import gettext as _

from zerver.lib.exceptions import JsonableError, RemoteBillingAuthenticationError
from zerver.lib.timestamp import datetime_to_timestamp
from zilencer.models import (
    RemoteRealm,
    RemoteRealmBillingUser,
    RemoteServerBillingUser,
    RemoteZulipServer,
)

billing_logger = logging.getLogger("corporate.stripe")

# The sessions are relatively short-lived, so that we can avoid issues
# with users who have their privileges revoked on the remote server
# maintaining access to the billing page for too long.
REMOTE_BILLING_SESSION_VALIDITY_SECONDS = 2 * 60 * 60


class RemoteBillingUserDict(TypedDict):
    user_uuid: str
    user_email: str
    user_full_name: str


class RemoteBillingIdentityDict(TypedDict):
    user: RemoteBillingUserDict
    remote_server_uuid: str
    remote_realm_uuid: str

    remote_billing_user_id: int | None
    authenticated_at: int
    uri_scheme: Literal["http://", "https://"]

    next_page: str | None


class LegacyServerIdentityDict(TypedDict):
    # Currently this has only one field. We can extend this
    # to add more information as appropriate.
    remote_server_uuid: str

    remote_billing_user_id: int | None
    authenticated_at: int


class RemoteBillingIdentityExpiredError(Exception):
    def __init__(
        self,
        *,
        realm_uuid: str | None = None,
        server_uuid: str | None = None,
        uri_scheme: Literal["http://", "https://"] | None = None,
    ) -> None:
        self.realm_uuid = realm_uuid
        self.server_uuid = server_uuid
        self.uri_scheme = uri_scheme


@overload
def get_identity_dict_from_session(
    request: HttpRequest,
    *,
    realm_uuid: str | None,
    server_uuid: None,
) -> RemoteBillingIdentityDict | None: ...
@overload
def get_identity_dict_from_session(
    request: HttpRequest,
    *,
    realm_uuid: None,
    server_uuid: str | None,
) -> LegacyServerIdentityDict | None: ...
def get_identity_dict_from_session(
    request: HttpRequest,
    *,
    realm_uuid: str | None,
    server_uuid: str | None,
) -> RemoteBillingIdentityDict | LegacyServerIdentityDict | None:
    if not (realm_uuid or server_uuid):
        return None

    identity_dicts = request.session.get("remote_billing_identities")
    if identity_dicts is None:
        return None

    if realm_uuid is not None:
        result = identity_dicts.get(f"remote_realm:{realm_uuid}")
    else:
        assert server_uuid is not None
        result = identity_dicts.get(f"remote_server:{server_uuid}")

    if result is None:
        return None
    if (
        datetime_to_timestamp(timezone_now()) - result["authenticated_at"]
        > REMOTE_BILLING_SESSION_VALIDITY_SECONDS
    ):
        # In this case we raise, because callers want to catch this as an explicitly
        # different scenario from the user not being authenticated, to handle it nicely
        # by redirecting them to their login page.
        raise RemoteBillingIdentityExpiredError(
            realm_uuid=result.get("remote_realm_uuid"),
            server_uuid=result.get("remote_server_uuid"),
            uri_scheme=result.get("uri_scheme"),
        )

    return result


def get_remote_realm_and_user_from_session(
    request: HttpRequest,
    realm_uuid: str | None,
) -> tuple[RemoteRealm, RemoteRealmBillingUser]:
    identity_dict: RemoteBillingIdentityDict | None = get_identity_dict_from_session(
        request, realm_uuid=realm_uuid, server_uuid=None
    )

    if identity_dict is None:
        raise RemoteBillingAuthenticationError

    remote_server_uuid = identity_dict["remote_server_uuid"]
    remote_realm_uuid = identity_dict["remote_realm_uuid"]

    try:
        remote_realm = RemoteRealm.objects.get(
            uuid=remote_realm_uuid, server__uuid=remote_server_uuid
        )
    except RemoteRealm.DoesNotExist:
        raise AssertionError(
            "The remote realm is missing despite being in the RemoteBillingIdentityDict"
        )

    if (
        remote_realm.registration_deactivated
        or remote_realm.realm_deactivated
        or remote_realm.server.deactivated
    ):
        raise JsonableError(_("Registration is deactivated"))

    remote_billing_user_id = identity_dict["remote_billing_user_id"]
    # We only put IdentityDicts with remote_billing_user_id in the session in this flow,
    # because the RemoteRealmBillingUser already exists when this is inserted into the session
    # at the end of authentication.
    assert remote_billing_user_id is not None

    try:
        remote_billing_user = RemoteRealmBillingUser.objects.get(
            id=remote_billing_user_id, remote_realm=remote_realm
        )
    except RemoteRealmBillingUser.DoesNotExist:
        raise AssertionError

    return remote_realm, remote_billing_user


def get_remote_server_and_user_from_session(
    request: HttpRequest,
    server_uuid: str,
) -> tuple[RemoteZulipServer, RemoteServerBillingUser | None]:
    identity_dict: LegacyServerIdentityDict | None = get_identity_dict_from_session(
        request, realm_uuid=None, server_uuid=server_uuid
    )

    if identity_dict is None:
        raise RemoteBillingAuthenticationError

    remote_server_uuid = identity_dict["remote_server_uuid"]
    try:
        remote_server = RemoteZulipServer.objects.get(uuid=remote_server_uuid)
    except RemoteZulipServer.DoesNotExist:
        raise JsonableError(_("Invalid remote server."))

    if remote_server.deactivated:
        raise JsonableError(_("Registration is deactivated"))

    remote_billing_user_id = identity_dict.get("remote_billing_user_id")
    if remote_billing_user_id is None:
        return remote_server, None

    try:
        remote_billing_user = RemoteServerBillingUser.objects.get(
            id=remote_billing_user_id, remote_server=remote_server
        )
    except RemoteServerBillingUser.DoesNotExist:
        remote_billing_user = None

    return remote_server, remote_billing_user
```

--------------------------------------------------------------------------------

````
