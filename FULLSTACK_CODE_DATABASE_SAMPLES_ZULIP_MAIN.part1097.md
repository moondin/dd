---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1097
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1097 of 1290)

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

---[FILE: drafts.py]---
Location: zulip-main/zerver/views/drafts.py
Signals: Django, Pydantic

```python
from django.http import HttpRequest, HttpResponse
from pydantic import Json

from zerver.lib.drafts import (
    DraftData,
    do_create_drafts,
    do_delete_draft,
    do_edit_draft,
    draft_endpoint,
)
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import PathOnly, typed_endpoint
from zerver.models import Draft, UserProfile


@draft_endpoint
def fetch_drafts(request: HttpRequest, user_profile: UserProfile) -> HttpResponse:
    user_drafts = Draft.objects.filter(user_profile=user_profile).order_by("last_edit_time")
    draft_dicts = [draft.to_dict() for draft in user_drafts]
    return json_success(request, data={"count": user_drafts.count(), "drafts": draft_dicts})


@draft_endpoint
@typed_endpoint
def create_drafts(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    drafts: Json[list[DraftData]],
) -> HttpResponse:
    created_draft_objects = do_create_drafts(drafts, user_profile)
    draft_ids = [draft_object.id for draft_object in created_draft_objects]
    return json_success(request, data={"ids": draft_ids})


@draft_endpoint
@typed_endpoint
def edit_draft(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    draft: Json[DraftData],
    draft_id: PathOnly[int],
) -> HttpResponse:
    do_edit_draft(draft_id, draft, user_profile)
    return json_success(request)


@draft_endpoint
def delete_draft(request: HttpRequest, user_profile: UserProfile, *, draft_id: int) -> HttpResponse:
    do_delete_draft(draft_id, user_profile)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: errors.py]---
Location: zulip-main/zerver/views/errors.py
Signals: Django

```python
from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


def config_error(
    request: HttpRequest,
    error_name: str,
    *,
    go_back_to_url: str | None = None,
    go_back_to_url_name: str | None = None,
) -> HttpResponse:
    assert "/" not in error_name
    context = {
        "error_name": error_name,
        "go_back_to_url": go_back_to_url or "/login/",
        "go_back_to_url_name": go_back_to_url_name or "the login page",
    }
    if settings.DEVELOPMENT:
        context["auth_settings_path"] = "zproject/dev-secrets.conf"
        context["client_id_key_name"] = f"social_auth_{error_name}_key"
    else:
        context["auth_settings_path"] = "/etc/zulip/settings.py"
        context["client_id_key_name"] = f"SOCIAL_AUTH_{error_name.upper()}_KEY"

    return render(request, f"zerver/config_error/{error_name}.html", context=context, status=500)
```

--------------------------------------------------------------------------------

---[FILE: events_register.py]---
Location: zulip-main/zerver/views/events_register.py
Signals: Django, Pydantic

```python
from typing import Annotated, Literal, TypeAlias

from annotated_types import Len
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _
from pydantic import Json

from zerver.context_processors import get_valid_realm_from_request
from zerver.lib.compatibility import is_pronouns_field_type_supported
from zerver.lib.events import DEFAULT_CLIENT_CAPABILITIES, ClientCapabilities, do_events_register
from zerver.lib.exceptions import JsonableError, MissingAuthenticationError
from zerver.lib.narrow_helpers import narrow_dataclasses_from_tuples
from zerver.lib.request import RequestNotes
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import ApiParamConfig, DocumentationStatus, typed_endpoint
from zerver.models import Stream, UserProfile
from zerver.views.streams import parse_include_subscribers


def _default_all_public_streams(user_profile: UserProfile, all_public_streams: bool | None) -> bool:
    if all_public_streams is not None:
        return all_public_streams
    else:
        return user_profile.default_all_public_streams


def _default_narrow(user_profile: UserProfile, narrow: list[list[str]]) -> list[list[str]]:
    default_stream: Stream | None = user_profile.default_events_register_stream
    if not narrow and default_stream is not None:
        narrow = [["stream", default_stream.name]]
    return narrow


NarrowT: TypeAlias = list[Annotated[list[str], Len(min_length=2, max_length=2)]]


@typed_endpoint
def events_register_backend(
    request: HttpRequest,
    maybe_user_profile: UserProfile | AnonymousUser,
    *,
    all_public_streams: Json[bool] | None = None,
    apply_markdown: Json[bool] = False,
    client_capabilities: Json[ClientCapabilities] = DEFAULT_CLIENT_CAPABILITIES,
    client_gravatar_raw: Annotated[Json[bool | None], ApiParamConfig("client_gravatar")] = None,
    event_types: Json[list[str]] | None = None,
    fetch_event_types: Json[list[str]] | None = None,
    include_subscribers: Literal["true", "false", "partial"] = "false",
    narrow: Json[NarrowT] | None = None,
    presence_history_limit_days: Json[int] | None = None,
    queue_lifespan_secs: Annotated[
        Json[int], ApiParamConfig(documentation_status=DocumentationStatus.DOCUMENTATION_PENDING)
    ] = 0,
    slim_presence: Json[bool] = False,
) -> HttpResponse:
    if narrow is None:
        narrow = []
    if client_gravatar_raw is None:
        client_gravatar = maybe_user_profile.is_authenticated
    else:
        client_gravatar = client_gravatar_raw

    parsed_include_subscribers = parse_include_subscribers(include_subscribers)

    if maybe_user_profile.is_authenticated:
        user_profile = maybe_user_profile
        spectator_requested_language = None
        assert isinstance(user_profile, UserProfile)
        realm = user_profile.realm
        include_streams = True

        if all_public_streams and not user_profile.can_access_public_streams():
            raise JsonableError(_("User not authorized for this query"))

        all_public_streams = _default_all_public_streams(user_profile, all_public_streams)
        narrow = _default_narrow(user_profile, narrow)
    else:
        user_profile = None
        realm = get_valid_realm_from_request(request)
        if not realm.allow_web_public_streams_access():
            raise MissingAuthenticationError

        # These parameters must be false for anonymous requests.
        if client_gravatar:
            raise JsonableError(
                _("Invalid '{key}' parameter for anonymous request").format(key="client_gravatar")
            )
        if parsed_include_subscribers:
            raise JsonableError(
                _("Invalid '{key}' parameter for anonymous request").format(
                    key="include_subscribers"
                )
            )

        # Language set by spectator to be passed down to clients as user_settings.
        spectator_requested_language = request.COOKIES.get(
            settings.LANGUAGE_COOKIE_NAME, realm.default_language
        )

        all_public_streams = False
        include_streams = False

    client = RequestNotes.get_notes(request).client
    assert client is not None

    pronouns_field_type_supported = is_pronouns_field_type_supported(
        request.headers.get("User-Agent")
    )

    # TODO: We eventually want to let callers pass in dictionaries over the wire,
    #       but we will still need to support tuples for a long time.
    modern_narrow = narrow_dataclasses_from_tuples(narrow)

    ret = do_events_register(
        user_profile,
        realm,
        client,
        apply_markdown,
        client_gravatar,
        slim_presence,
        None,
        presence_history_limit_days,
        event_types,
        queue_lifespan_secs,
        all_public_streams,
        narrow=modern_narrow,
        include_subscribers=parsed_include_subscribers,
        include_streams=include_streams,
        client_capabilities=client_capabilities,
        fetch_event_types=fetch_event_types,
        spectator_requested_language=spectator_requested_language,
        pronouns_field_type_supported=pronouns_field_type_supported,
    )
    return json_success(request, data=ret)
```

--------------------------------------------------------------------------------

---[FILE: health.py]---
Location: zulip-main/zerver/views/health.py
Signals: Django

```python
from django.conf import settings
from django.db.migrations.recorder import MigrationRecorder
from django.http import HttpRequest, HttpResponse
from django.utils.crypto import get_random_string
from django.utils.translation import gettext as _
from pika import BlockingConnection

from zerver.lib.cache import cache_delete, cache_get, cache_set
from zerver.lib.exceptions import ServerNotReadyError
from zerver.lib.queue import get_queue_client
from zerver.lib.redis_utils import get_redis_client
from zerver.lib.response import json_success


def check_database() -> None:
    try:
        if not MigrationRecorder.Migration.objects.exists():
            raise ServerNotReadyError(_("Database is empty"))  # nocoverage
    except ServerNotReadyError:  # nocoverage
        raise
    except Exception:  # nocoverage
        raise ServerNotReadyError(_("Cannot query postgresql"))


def check_rabbitmq() -> None:  # nocoverage
    try:
        conn = get_queue_client().connection
        if conn is None:
            raise ServerNotReadyError(_("Cannot connect to rabbitmq"))
        assert isinstance(conn, BlockingConnection)
        conn.process_data_events()
    except ServerNotReadyError:
        raise
    except Exception:
        raise ServerNotReadyError(_("Cannot query rabbitmq"))


def check_redis() -> None:
    try:
        get_redis_client().ping()
    except Exception:  # nocoverage
        raise ServerNotReadyError(_("Cannot query redis"))


def check_memcached() -> None:
    try:
        roundtrip_key = "health_check_" + get_random_string(32)
        roundtrip_value = get_random_string(32)
        cache_set(roundtrip_key, roundtrip_value)
        got_value = cache_get(roundtrip_key)[0]
        if got_value != roundtrip_value:
            raise ServerNotReadyError(_("Cannot write to memcached"))  # nocoverage
        cache_delete(roundtrip_key)
    except ServerNotReadyError:  # nocoverage
        raise
    except Exception:  # nocoverage
        raise ServerNotReadyError(_("Cannot query memcached"))


def health(request: HttpRequest) -> HttpResponse:
    check_database()
    if settings.USING_RABBITMQ:  # nocoverage
        check_rabbitmq()
    check_redis()
    check_memcached()

    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: home.py]---
Location: zulip-main/zerver/views/home.py
Signals: Django

```python
import logging
import secrets

from django.conf import settings
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect, render
from django.urls import reverse
from django.utils.cache import patch_cache_control

from zerver.actions.user_settings import do_change_tos_version, do_change_user_setting
from zerver.actions.users import do_change_is_imported_stub
from zerver.context_processors import get_realm_from_request, get_valid_realm_from_request
from zerver.decorator import web_public_view, zulip_login_required
from zerver.forms import ToSForm
from zerver.lib.compatibility import is_banned_browser, is_outdated_desktop_app
from zerver.lib.home import build_page_params_for_home_page_load, get_user_permission_info
from zerver.lib.narrow_helpers import NeverNegatedNarrowTerm
from zerver.lib.request import RequestNotes
from zerver.lib.streams import access_stream_by_name
from zerver.lib.subdomains import get_subdomain
from zerver.models import Realm, RealmUserDefault, Stream, UserProfile


def need_accept_tos(user_profile: UserProfile | None) -> bool:
    if user_profile is None:
        return False

    if user_profile.tos_version == UserProfile.TOS_VERSION_BEFORE_FIRST_LOGIN:
        return True

    if settings.TERMS_OF_SERVICE_VERSION is None:
        return False

    return int(settings.TERMS_OF_SERVICE_VERSION.split(".")[0]) > user_profile.major_tos_version()


@zulip_login_required
def accounts_accept_terms(request: HttpRequest) -> HttpResponse:
    assert request.user.is_authenticated

    if request.method == "POST":
        form = ToSForm(request.POST)
        if form.is_valid():
            assert (
                settings.TERMS_OF_SERVICE_VERSION is not None
                or request.user.tos_version == UserProfile.TOS_VERSION_BEFORE_FIRST_LOGIN
            )
            do_change_tos_version(request.user, settings.TERMS_OF_SERVICE_VERSION)

            email_address_visibility = form.cleaned_data["email_address_visibility"]
            if (
                email_address_visibility is not None
                and email_address_visibility != request.user.email_address_visibility
            ):
                do_change_user_setting(
                    request.user,
                    "email_address_visibility",
                    email_address_visibility,
                    acting_user=request.user,
                )

            enable_marketing_emails = form.cleaned_data["enable_marketing_emails"]
            if (
                enable_marketing_emails is not None
                and enable_marketing_emails != request.user.enable_marketing_emails
            ):
                do_change_user_setting(
                    request.user,
                    "enable_marketing_emails",
                    enable_marketing_emails,
                    acting_user=request.user,
                )

            if request.user.is_imported_stub:
                do_change_is_imported_stub(request.user)

            return redirect(home)
    else:
        form = ToSForm()

    default_email_address_visibility = None
    first_time_login = request.user.tos_version == UserProfile.TOS_VERSION_BEFORE_FIRST_LOGIN
    if first_time_login:
        realm_user_default = RealmUserDefault.objects.get(realm=request.user.realm)
        default_email_address_visibility = realm_user_default.email_address_visibility

    context = {
        "form": form,
        "email": request.user.delivery_email,
        # Text displayed when updating TERMS_OF_SERVICE_VERSION.
        "terms_of_service_message": settings.TERMS_OF_SERVICE_MESSAGE,
        "terms_of_service_version": settings.TERMS_OF_SERVICE_VERSION,
        # HTML template used when agreeing to terms of service the
        # first time, e.g. after data import.
        "first_time_terms_of_service_message_template": None,
        "first_time_login": first_time_login,
        "default_email_address_visibility": default_email_address_visibility,
        "email_address_visibility_options_dict": UserProfile.EMAIL_ADDRESS_VISIBILITY_ID_TO_NAME_MAP,
        "email_address_visibility_admins_only": UserProfile.EMAIL_ADDRESS_VISIBILITY_ADMINS,
        "email_address_visibility_moderators": UserProfile.EMAIL_ADDRESS_VISIBILITY_MODERATORS,
        "email_address_visibility_nobody": UserProfile.EMAIL_ADDRESS_VISIBILITY_NOBODY,
    }

    if (
        request.user.tos_version == UserProfile.TOS_VERSION_BEFORE_FIRST_LOGIN
        and settings.FIRST_TIME_TERMS_OF_SERVICE_TEMPLATE is not None
    ):
        context["first_time_terms_of_service_message_template"] = (
            settings.FIRST_TIME_TERMS_OF_SERVICE_TEMPLATE
        )

    return render(
        request,
        "zerver/accounts_accept_terms.html",
        context,
    )


def detect_narrowed_window(
    request: HttpRequest, user_profile: UserProfile | None
) -> tuple[list[NeverNegatedNarrowTerm], Stream | None, str | None]:
    """This function implements Zulip's support for a mini Zulip window
    that just handles messages from a single narrow"""
    if user_profile is None:
        return [], None, None

    narrow: list[NeverNegatedNarrowTerm] = []
    narrow_stream = None
    narrow_topic_name = request.GET.get("topic")

    if "stream" in request.GET:
        try:
            # TODO: We should support stream IDs and direct messages here as well.
            narrow_stream_name = request.GET.get("stream")
            assert narrow_stream_name is not None
            (narrow_stream, _sub) = access_stream_by_name(user_profile, narrow_stream_name)
            narrow = [NeverNegatedNarrowTerm(operator="stream", operand=narrow_stream.name)]
        except Exception:
            logging.warning("Invalid narrow requested, ignoring", extra=dict(request=request))
        if narrow_stream is not None and narrow_topic_name is not None:
            narrow.append(NeverNegatedNarrowTerm(operator="topic", operand=narrow_topic_name))
    return narrow, narrow_stream, narrow_topic_name


def update_last_reminder(user_profile: UserProfile | None) -> None:
    """Reset our don't-spam-users-with-email counter since the
    user has since logged in
    """
    if user_profile is None:
        return

    if user_profile.last_reminder is not None:  # nocoverage
        # TODO: Look into the history of last_reminder; we may have
        # eliminated that as a useful concept for non-bot users.
        user_profile.last_reminder = None
        user_profile.save(update_fields=["last_reminder"])


def home(request: HttpRequest) -> HttpResponse:
    subdomain = get_subdomain(request)

    # If settings.ROOT_DOMAIN_LANDING_PAGE and this is the root
    # domain, send the user the landing page.
    if (
        settings.ROOT_DOMAIN_LANDING_PAGE
        and subdomain == Realm.SUBDOMAIN_FOR_ROOT_DOMAIN
        and settings.CORPORATE_ENABLED
    ):
        from corporate.views.portico import hello_view

        return hello_view(request)

    if subdomain == settings.SOCIAL_AUTH_SUBDOMAIN:
        return redirect(settings.ROOT_DOMAIN_URI)
    elif subdomain == settings.SELF_HOSTING_MANAGEMENT_SUBDOMAIN:
        return redirect(reverse("remote_billing_legacy_server_login"))
    realm = get_realm_from_request(request)
    if realm is None:
        context = {
            "current_url": request.get_host(),
        }
        return render(request, "zerver/invalid_realm.html", status=404, context=context)
    if realm.allow_web_public_streams_access():
        return web_public_view(home_real)(request)
    return zulip_login_required(home_real)(request)


def home_real(request: HttpRequest) -> HttpResponse:
    # Before we do any real work, check if the app is banned.
    client_user_agent = request.headers.get("User-Agent", "")
    (insecure_desktop_app, banned_desktop_app, auto_update_broken) = is_outdated_desktop_app(
        client_user_agent
    )
    if banned_desktop_app:
        return render(
            request,
            "zerver/portico_error_pages/insecure_desktop_app.html",
            context={
                "auto_update_broken": auto_update_broken,
            },
        )
    (unsupported_browser, browser_name) = is_banned_browser(client_user_agent)
    if unsupported_browser:
        return render(
            request,
            "zerver/portico_error_pages/unsupported_browser.html",
            context={
                "browser_name": browser_name,
            },
        )

    # We need to modify the session object every two weeks or it will expire.
    # This line makes reloading the page a sufficient action to keep the
    # session alive.
    request.session.modified = True

    if request.user.is_authenticated:
        user_profile = request.user
        realm = user_profile.realm
    else:
        realm = get_valid_realm_from_request(request)
        # We load the spectator experience.  We fall through to the shared code
        # for loading the application, with user_profile=None encoding
        # that we're a spectator, not a logged-in user.
        user_profile = None

    update_last_reminder(user_profile)

    # If a user hasn't signed the current Terms of Service, send them there
    if need_accept_tos(user_profile):
        return accounts_accept_terms(request)

    narrow, narrow_stream, narrow_topic_name = detect_narrowed_window(request, user_profile)

    queue_id, page_params = build_page_params_for_home_page_load(
        request=request,
        user_profile=user_profile,
        realm=realm,
        insecure_desktop_app=insecure_desktop_app,
        narrow=narrow,
        narrow_stream=narrow_stream,
        narrow_topic_name=narrow_topic_name,
    )

    log_data = RequestNotes.get_notes(request).log_data
    assert log_data is not None
    log_data["extra"] = f"[{queue_id}]"

    csp_nonce = secrets.token_hex(24)

    user_permission_info = get_user_permission_info(user_profile)
    is_firefox_android = "Firefox" in client_user_agent and "Android" in client_user_agent

    response = render(
        request,
        "zerver/app/index.html",
        context={
            "user_profile": user_profile,
            "page_params": page_params,
            "csp_nonce": csp_nonce,
            "color_scheme": user_permission_info.color_scheme,
            "enable_gravatar": settings.ENABLE_GRAVATAR,
            "is_firefox_android": is_firefox_android,
            "s3_avatar_public_url_prefix": settings.S3_AVATAR_PUBLIC_URL_PREFIX
            if settings.LOCAL_UPLOADS_DIR is None
            else "",
        },
    )
    patch_cache_control(response, no_cache=True, no_store=True, must_revalidate=True)
    return response


@zulip_login_required
def desktop_home(request: HttpRequest) -> HttpResponse:
    return redirect(home)


def doc_permalinks_view(request: HttpRequest, doc_id: str) -> HttpResponse:
    DOC_PERMALINK_MAP: dict[str, str] = {
        "usage-statistics": "https://zulip.readthedocs.io/en/stable/production/mobile-push-notifications.html#uploading-usage-statistics",
        "basic-metadata": "https://zulip.readthedocs.io/en/stable/production/mobile-push-notifications.html#uploading-basic-metadata",
        "why-service": "https://zulip.readthedocs.io/en/stable/production/mobile-push-notifications.html#why-a-push-notification-service-is-necessary",
        "registration-transfer": "https://zulip.readthedocs.io/en/latest/production/mobile-push-notifications.html#moving-your-registration-to-a-new-server",
    }

    redirect_url = DOC_PERMALINK_MAP.get(doc_id)
    if redirect_url is None:
        return render(request, "404.html", status=404)

    return HttpResponseRedirect(redirect_url)
```

--------------------------------------------------------------------------------

---[FILE: invite.py]---
Location: zulip-main/zerver/views/invite.py
Signals: Django, Pydantic

```python
import re
from typing import Annotated

from django.conf import settings
from django.db import transaction
from django.http import HttpRequest, HttpResponse
from django.utils.timezone import now as timezone_now
from django.utils.translation import gettext as _
from pydantic import Json, StringConstraints

from confirmation import settings as confirmation_settings
from zerver.actions.invites import (
    do_create_multiuse_invite_link,
    do_get_invites_controlled_by_user,
    do_invite_users,
    do_revoke_multi_use_invite,
    do_revoke_user_invite,
    do_send_user_invite_email,
)
from zerver.decorator import require_member_or_admin
from zerver.lib.exceptions import InvitationError, JsonableError, OrganizationOwnerRequiredError
from zerver.lib.response import json_success
from zerver.lib.streams import access_stream_by_id, get_streams_to_which_user_cannot_add_subscribers
from zerver.lib.typed_endpoint import ApiParamConfig, PathOnly, typed_endpoint
from zerver.lib.typed_endpoint_validators import check_int_in_validator
from zerver.lib.user_groups import UserGroupMembershipDetails, access_user_group_for_update
from zerver.models import (
    MultiuseInvite,
    NamedUserGroup,
    PreregistrationUser,
    Realm,
    Stream,
    UserProfile,
)

# Convert INVITATION_LINK_VALIDITY_DAYS into minutes.
# Because mypy fails to correctly infer the type of the validator, we want this constant
# to be Optional[int] to avoid a mypy error when using it as the default value.
# https://github.com/python/mypy/issues/13234
INVITATION_LINK_VALIDITY_MINUTES: int | None = 24 * 60 * settings.INVITATION_LINK_VALIDITY_DAYS


def check_role_based_permissions(
    invited_as: int, user_profile: UserProfile, *, require_admin: bool
) -> None:
    if (
        invited_as == PreregistrationUser.INVITE_AS["REALM_OWNER"]
        and not user_profile.is_realm_owner
    ):
        raise OrganizationOwnerRequiredError

    if require_admin and not user_profile.is_realm_admin:
        raise JsonableError(_("Must be an organization administrator"))


def access_invite_by_id(user_profile: UserProfile, invite_id: int) -> PreregistrationUser:
    try:
        prereg_user = PreregistrationUser.objects.get(id=invite_id)
    except PreregistrationUser.DoesNotExist:
        raise JsonableError(_("No such invitation"))

    # Structurally, any invitation the user can actually access should
    # have a referred_by set for the user who created it.
    if prereg_user.referred_by is None or prereg_user.referred_by.realm != user_profile.realm:
        raise JsonableError(_("No such invitation"))

    if prereg_user.referred_by_id != user_profile.id:
        check_role_based_permissions(prereg_user.invited_as, user_profile, require_admin=True)
    return prereg_user


def access_multiuse_invite_by_id(user_profile: UserProfile, invite_id: int) -> MultiuseInvite:
    try:
        invite = MultiuseInvite.objects.get(id=invite_id)
    except MultiuseInvite.DoesNotExist:
        raise JsonableError(_("No such invitation"))

    if invite.realm != user_profile.realm:
        raise JsonableError(_("No such invitation"))

    if invite.referred_by_id != user_profile.id:
        check_role_based_permissions(invite.invited_as, user_profile, require_admin=True)

    if invite.status == confirmation_settings.STATUS_REVOKED:
        raise JsonableError(_("Invitation has already been revoked"))
    return invite


def access_streams_for_invite(stream_ids: list[int], user_profile: UserProfile) -> list[Stream]:
    streams: list[Stream] = []

    for stream_id in stream_ids:
        try:
            (stream, _sub) = access_stream_by_id(user_profile, stream_id)
        except JsonableError:
            raise JsonableError(
                _("Invalid channel ID {channel_id}. No invites were sent.").format(
                    channel_id=stream_id
                )
            )
        streams.append(stream)

    user_group_membership_details = UserGroupMembershipDetails(user_recursive_group_ids=None)
    streams_to_which_user_cannot_add_subscribers = get_streams_to_which_user_cannot_add_subscribers(
        streams,
        user_profile,
        allow_default_streams=True,
        user_group_membership_details=user_group_membership_details,
    )
    if len(streams_to_which_user_cannot_add_subscribers) > 0:
        raise JsonableError(_("You do not have permission to subscribe other users to channels."))

    return streams


def access_user_groups_for_invite(
    group_ids: list[int] | None, user_profile: UserProfile
) -> list[NamedUserGroup]:
    user_groups: list[NamedUserGroup] = []
    if group_ids:
        with transaction.atomic(durable=True):
            for group_id in group_ids:
                user_group = access_user_group_for_update(
                    group_id, user_profile, permission_setting="can_add_members_group"
                )
                user_groups.append(user_group)

    return user_groups


@require_member_or_admin
@typed_endpoint
def invite_users_backend(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    group_ids: Json[list[int]] | None = None,
    include_realm_default_subscriptions: Json[bool] = False,
    invite_as: Annotated[
        Json[int],
        check_int_in_validator(list(PreregistrationUser.INVITE_AS.values())),
    ] = PreregistrationUser.INVITE_AS["MEMBER"],
    invite_expires_in_minutes: Json[int | None] = INVITATION_LINK_VALIDITY_MINUTES,
    invitee_emails_raw: Annotated[str, ApiParamConfig("invitee_emails")],
    notify_referrer_on_join: Json[bool] = True,
    stream_ids: Json[list[int]],
    welcome_message_custom_text: Annotated[
        str | None,
        StringConstraints(
            max_length=Realm.MAX_REALM_WELCOME_MESSAGE_CUSTOM_TEXT_LENGTH,
        ),
    ] = None,
) -> HttpResponse:
    if not user_profile.can_invite_users_by_email():
        # Guest users case will not be handled here as it will
        # be handled by the decorator above.
        raise JsonableError(_("Insufficient permission"))

    require_admin = invite_as in [
        # Owners can only be invited by owners, checked by separate
        # logic in check_role_based_permissions.
        PreregistrationUser.INVITE_AS["REALM_OWNER"],
        PreregistrationUser.INVITE_AS["REALM_ADMIN"],
        PreregistrationUser.INVITE_AS["MODERATOR"],
    ]
    check_role_based_permissions(invite_as, user_profile, require_admin=require_admin)

    if not invitee_emails_raw:
        raise JsonableError(_("You must specify at least one email address."))

    invitee_emails = get_invitee_emails_set(invitee_emails_raw)

    streams = access_streams_for_invite(stream_ids, user_profile)
    user_groups = access_user_groups_for_invite(group_ids, user_profile)

    if welcome_message_custom_text is not None and not user_profile.is_realm_admin:
        raise JsonableError(_("Must be an organization administrator"))

    skipped = do_invite_users(
        user_profile,
        invitee_emails,
        streams,
        notify_referrer_on_join,
        user_groups,
        invite_expires_in_minutes=invite_expires_in_minutes,
        include_realm_default_subscriptions=include_realm_default_subscriptions,
        invite_as=invite_as,
        welcome_message_custom_text=welcome_message_custom_text,
    )

    if skipped:
        raise InvitationError(
            _(
                "Some of those addresses are already using Zulip, "
                "so we didn't send them an invitation. We did send "
                "invitations to everyone else!"
            ),
            skipped,
            sent_invitations=True,
        )

    return json_success(request)


def get_invitee_emails_set(invitee_emails_raw: str) -> set[str]:
    invitee_emails_list = set(re.split(r"[,\n]", invitee_emails_raw))
    invitee_emails = set()
    for email in invitee_emails_list:
        is_email_with_name = re.search(r"<(?P<email>.*)>", email)
        if is_email_with_name:
            email = is_email_with_name.group("email")
        invitee_emails.add(email.strip())
    return invitee_emails


@require_member_or_admin
def get_user_invites(request: HttpRequest, user_profile: UserProfile) -> HttpResponse:
    all_users = do_get_invites_controlled_by_user(user_profile)
    return json_success(request, data={"invites": all_users})


@require_member_or_admin
@typed_endpoint
def revoke_user_invite(
    request: HttpRequest, user_profile: UserProfile, *, invite_id: PathOnly[int]
) -> HttpResponse:
    prereg_user = access_invite_by_id(user_profile, invite_id)
    do_revoke_user_invite(prereg_user)
    return json_success(request)


@require_member_or_admin
@typed_endpoint
def revoke_multiuse_invite(
    request: HttpRequest, user_profile: UserProfile, *, invite_id: PathOnly[int]
) -> HttpResponse:
    invite = access_multiuse_invite_by_id(user_profile, invite_id)
    do_revoke_multi_use_invite(invite)
    return json_success(request)


@require_member_or_admin
@typed_endpoint
def resend_user_invite_email(
    request: HttpRequest, user_profile: UserProfile, *, invite_id: PathOnly[int]
) -> HttpResponse:
    prereg_user = access_invite_by_id(user_profile, invite_id)
    do_send_user_invite_email(prereg_user, event_time=timezone_now())
    return json_success(request)


@require_member_or_admin
@typed_endpoint
def generate_multiuse_invite_backend(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    group_ids: Json[list[int]] | None = None,
    include_realm_default_subscriptions: Json[bool] = False,
    invite_as: Annotated[
        Json[int],
        check_int_in_validator(list(PreregistrationUser.INVITE_AS.values())),
    ] = PreregistrationUser.INVITE_AS["MEMBER"],
    invite_expires_in_minutes: Json[int | None] = INVITATION_LINK_VALIDITY_MINUTES,
    stream_ids: Json[list[int]] | None = None,
    welcome_message_custom_text: Annotated[
        str | None,
        StringConstraints(
            max_length=Realm.MAX_REALM_WELCOME_MESSAGE_CUSTOM_TEXT_LENGTH,
        ),
    ] = None,
) -> HttpResponse:
    if stream_ids is None:
        stream_ids = []
    if not user_profile.can_create_multiuse_invite_to_realm():
        # Guest users case will not be handled here as it will
        # be handled by the decorator above.
        raise JsonableError(_("Insufficient permission"))

    require_admin = invite_as in [
        # Owners can only be invited by owners, checked by separate
        # logic in check_role_based_permissions.
        PreregistrationUser.INVITE_AS["REALM_OWNER"],
        PreregistrationUser.INVITE_AS["REALM_ADMIN"],
        PreregistrationUser.INVITE_AS["MODERATOR"],
    ]
    check_role_based_permissions(invite_as, user_profile, require_admin=require_admin)

    streams = access_streams_for_invite(stream_ids, user_profile)
    user_groups = access_user_groups_for_invite(group_ids, user_profile)

    if welcome_message_custom_text is not None and not user_profile.is_realm_admin:
        raise JsonableError(_("Must be an organization administrator"))

    invite_link = do_create_multiuse_invite_link(
        user_profile,
        invite_as,
        invite_expires_in_minutes,
        include_realm_default_subscriptions,
        streams,
        user_groups,
        welcome_message_custom_text,
    )
    return json_success(request, data={"invite_link": invite_link})
```

--------------------------------------------------------------------------------

````
