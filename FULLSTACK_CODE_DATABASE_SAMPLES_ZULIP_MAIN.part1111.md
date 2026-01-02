---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1111
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1111 of 1290)

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

---[FILE: video_calls.py]---
Location: zulip-main/zerver/views/video_calls.py
Signals: Django, Pydantic

```python
import hashlib
import json
import logging
import random
from abc import ABC, abstractmethod
from base64 import b64encode
from typing import Any
from urllib.parse import quote, urlencode, urljoin, urlsplit

import requests
from defusedxml import ElementTree
from django.conf import settings
from django.core.signing import Signer
from django.http import HttpRequest, HttpResponse
from django.middleware import csrf
from django.shortcuts import redirect, render
from django.utils.crypto import constant_time_compare, salted_hmac
from django.utils.translation import gettext as _
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from oauthlib.oauth2 import OAuth2Error
from pydantic import Json
from requests import Response
from requests_oauthlib import OAuth2Session
from typing_extensions import TypedDict, override

from zerver.actions.video_calls import do_set_zoom_token
from zerver.decorator import zulip_login_required
from zerver.lib.cache import (
    cache_with_key,
    flush_zoom_server_access_token_cache,
    zoom_server_access_token_cache_key,
)
from zerver.lib.exceptions import ErrorCode, JsonableError
from zerver.lib.outgoing_http import OutgoingSession
from zerver.lib.partial import partial
from zerver.lib.pysa import mark_sanitized
from zerver.lib.response import json_success
from zerver.lib.subdomains import get_subdomain
from zerver.lib.typed_endpoint import typed_endpoint, typed_endpoint_without_parameters
from zerver.lib.url_encoding import append_url_query_string
from zerver.lib.utils import assert_is_not_none
from zerver.models import UserProfile
from zerver.models.realms import get_realm


class VideoCallSession(OutgoingSession):
    def __init__(self) -> None:
        super().__init__(role="video_calls", timeout=5)


class InvalidVideoCallProviderTokenError(JsonableError):
    code = ErrorCode.INVALID_VIDEO_CALL_PROVIDER_TOKEN

    def __init__(self, provider_name: str) -> None:
        super().__init__(
            _("Invalid {provider_name} access token").format(provider_name=provider_name)
        )


class UnknownZoomUserError(JsonableError):
    code = ErrorCode.UNKNOWN_ZOOM_USER

    def __init__(self) -> None:
        super().__init__(_("Unknown Zoom user email"))


class OAuthVideoCallProvider(ABC):
    provider_name: str = NotImplemented
    client_id: str | None = NotImplemented
    client_secret: str | None = NotImplemented
    authorization_scope: str | None = NotImplemented
    authorization_url: str = NotImplemented
    token_url: str = NotImplemented
    auto_refresh_url: str = NotImplemented
    create_meeting_url: str = NotImplemented
    token_key_name: str = NotImplemented

    @abstractmethod
    def get_token(self, user: UserProfile) -> object | None:
        pass

    @abstractmethod
    def update_token(self, user: UserProfile, token: dict[str, object] | None) -> None:
        pass

    @abstractmethod
    def get_meeting_details(self, request: HttpRequest, response: Response) -> HttpResponse:
        pass

    def __get_session(self, user: UserProfile) -> OAuth2Session:
        if self.client_id is None or self.client_secret is None:
            raise JsonableError(
                _("{provider_name} credentials have not been configured").format(
                    provider_name=self.provider_name
                )
            )

        return OAuth2Session(
            self.client_id,
            scope=self.authorization_scope,
            redirect_uri=urljoin(
                settings.ROOT_DOMAIN_URI, f"/calls/{self.provider_name.lower()}/complete"
            ),
            auto_refresh_url=self.auto_refresh_url,
            auto_refresh_kwargs={
                "client_id": self.client_id,
                "client_secret": self.client_secret,
            },
            token=self.get_token(user),
            token_updater=partial(self.update_token, user),
        )

    def __get_sid(self, request: HttpRequest) -> str:
        # This is used to prevent CSRF attacks on the OAuth
        # authentication flow.  We want this value to be unpredictable and
        # tied to the session, but we don’t want to expose the main CSRF
        # token directly to the server.

        csrf.get_token(request)
        # Use 'mark_sanitized' to cause Pysa to ignore the flow of user controlled
        # data out of this function. 'request.META' is indeed user controlled, but
        # post-HMAC output is no longer meaningfully controllable.
        return mark_sanitized(
            ""
            if getattr(request, "_dont_enforce_csrf_checks", False)
            else salted_hmac(
                f"Zulip {self.provider_name.capitalize()} sid", request.META["CSRF_COOKIE"]
            ).hexdigest()
        )

    def register_user(self, request: HttpRequest, **kwargs: Any) -> HttpResponse:
        assert isinstance(request.user, UserProfile)
        oauth = self.__get_session(request.user)
        authorization_url, _state = oauth.authorization_url(
            self.authorization_url,
            state=json.dumps(
                {"realm": get_subdomain(request), "sid": self.__get_sid(request)},
            ),
            **kwargs,
        )
        return redirect(authorization_url)

    def complete_user(
        self, request: HttpRequest, sid: str, code: str, **kwargs: Any
    ) -> HttpResponse:
        if not constant_time_compare(sid, self.__get_sid(request)):
            raise JsonableError(
                _("Invalid {provider_name} session identifier").format(
                    provider_name=self.provider_name
                )
            )
        assert isinstance(request.user, UserProfile)
        oauth = self.__get_session(request.user)
        try:
            token = oauth.fetch_token(
                self.token_url, code=code, client_secret=self.client_secret, **kwargs
            )
        except OAuth2Error:
            raise JsonableError(
                _("Invalid {provider_name} credentials").format(provider_name=self.provider_name)
            )

        self.update_token(request.user, token)
        return render(request, "zerver/close_window.html")

    def make_video_call(
        self, request: HttpRequest, user: UserProfile, payload: object = {}, **kwargs: Any
    ) -> HttpResponse:
        oauth = self.__get_session(user)
        if not oauth.authorized:
            raise InvalidVideoCallProviderTokenError(self.provider_name)

        try:
            response = oauth.post(self.create_meeting_url, json=payload, **kwargs)
        except OAuth2Error:
            self.update_token(user, None)
            raise InvalidVideoCallProviderTokenError(self.provider_name)

        if response.status_code == 401:
            self.update_token(user, None)
            raise InvalidVideoCallProviderTokenError(self.provider_name)
        elif not response.ok:
            raise JsonableError(
                _("Failed to create {provider_name} call").format(provider_name=self.provider_name)
            )

        return self.get_meeting_details(request, response)


class ZoomGeneralOAuthProvider(OAuthVideoCallProvider):
    provider_name = "Zoom"
    authorization_scope = None
    token_key_name = "zoom"

    def __init__(self) -> None:
        self.client_id = settings.VIDEO_ZOOM_CLIENT_ID
        self.client_secret = settings.VIDEO_ZOOM_CLIENT_SECRET
        self.authorization_url = urljoin(settings.VIDEO_ZOOM_OAUTH_URL, "/oauth/authorize")
        self.token_url = urljoin(settings.VIDEO_ZOOM_OAUTH_URL, "/oauth/token")
        self.auto_refresh_url = urljoin(settings.VIDEO_ZOOM_OAUTH_URL, "/oauth/token")
        self.create_meeting_url = urljoin(settings.VIDEO_ZOOM_API_URL, "/v2/users/me/meetings")

    @override
    def get_token(self, user: UserProfile) -> object | None:
        return user.third_party_api_state.get(self.token_key_name)

    @override
    def update_token(self, user: UserProfile, token: dict[str, object] | None) -> None:
        do_set_zoom_token(user, token)

    @override
    def get_meeting_details(self, request: HttpRequest, response: Response) -> HttpResponse:
        return json_success(request, data={"url": response.json()["join_url"]})


@zulip_login_required
@never_cache
def register_zoom_user(request: HttpRequest) -> HttpResponse:
    return ZoomGeneralOAuthProvider().register_user(request=request)


class StateDictRealm(TypedDict):
    realm: str
    sid: str


class StateDict(TypedDict):
    sid: str


class ZoomVideoSettings(TypedDict):
    host_video: bool
    participant_video: bool


class ZoomPayload(TypedDict):
    settings: ZoomVideoSettings
    default_password: bool


@never_cache
@zulip_login_required
@typed_endpoint
def complete_zoom_user(
    request: HttpRequest,
    *,
    code: str,
    state: Json[StateDictRealm],
) -> HttpResponse:
    if get_subdomain(request) != state["realm"]:
        return redirect(urljoin(get_realm(state["realm"]).url, request.get_full_path()))
    return ZoomGeneralOAuthProvider().complete_user(request, code=code, sid=state["sid"])


@cache_with_key(zoom_server_access_token_cache_key, timeout=3600 - 240)
def get_zoom_server_to_server_access_token(account_id: str) -> str:
    if settings.VIDEO_ZOOM_CLIENT_ID is None:
        raise JsonableError(_("Zoom credentials have not been configured"))

    client_id = settings.VIDEO_ZOOM_CLIENT_ID.encode("utf-8")
    client_secret = str(settings.VIDEO_ZOOM_CLIENT_SECRET).encode("utf-8")

    url = urljoin(settings.VIDEO_ZOOM_OAUTH_URL, "/oauth/token")
    data = {"grant_type": "account_credentials", "account_id": account_id}

    client_information = client_id + b":" + client_secret
    encoded_client = b64encode(client_information).decode("ascii")
    headers = {"Host": urlsplit(url).hostname, "Authorization": f"Basic {encoded_client}"}

    response = VideoCallSession().post(url, data, headers=headers)
    if not response.ok:
        # {reason: 'Bad request', error: 'invalid_request'} for invalid account ID
        # {'reason': 'Invalid client_id or client_secret', 'error': 'invalid_client'}
        raise JsonableError(_("Invalid Zoom credentials"))
    return response.json()["access_token"]


def get_zoom_server_to_server_call(
    user: UserProfile, access_token: str, payload: ZoomPayload
) -> str:
    email = user.delivery_email
    url = f"{settings.VIDEO_ZOOM_API_URL}/v2/users/{email}/meetings"
    headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
    response = VideoCallSession().post(url, json=payload, headers=headers)
    if not response.ok:
        response_dict = response.json()
        zoom_api_error_code = response_dict["code"]
        if zoom_api_error_code == 1001:
            # {code: 1001, message: "User does not exist: {email}"}
            raise UnknownZoomUserError
        if zoom_api_error_code == 124:
            # For the error responses below, we flush any
            # cached access token for the Zoom account.
            # {code: 124, message: "Invalid access token"}
            # {code: 124, message: "Access token is expired"}
            account_id = str(settings.VIDEO_ZOOM_SERVER_TO_SERVER_ACCOUNT_ID)

            # We are managing expiry ourselves, so this shouldn't
            # happen. Log an error, and flush the access token from
            # the cache, so that future requests should proceed.
            logging.error(
                "Unexpected Zoom error 124: %s",
                response_dict.get("message", str(response_dict)),
            )
            flush_zoom_server_access_token_cache(account_id)
        raise JsonableError(_("Failed to create Zoom call"))
    return response.json()["join_url"]


def make_server_authenticated_zoom_video_call(
    request: HttpRequest,
    user: UserProfile,
    *,
    payload: ZoomPayload,
) -> HttpResponse:
    account_id = str(settings.VIDEO_ZOOM_SERVER_TO_SERVER_ACCOUNT_ID)
    access_token = get_zoom_server_to_server_access_token(account_id)
    url = get_zoom_server_to_server_call(user, access_token, payload)
    return json_success(request, data={"url": url})


@typed_endpoint
def make_zoom_video_call(
    request: HttpRequest,
    user: UserProfile,
    *,
    is_video_call: Json[bool] = True,
) -> HttpResponse:
    # The meeting host has the ability to configure both their own and
    # participants' default video on/off state for the meeting. That's
    # why when creating a meeting, configure the video on/off default
    # according to the desired call type. Each Zoom user can still have
    # their own personal setting to not start video by default.
    video_settings = ZoomVideoSettings(host_video=is_video_call, participant_video=is_video_call)
    payload = ZoomPayload(
        settings=video_settings,
        # Generate a default password depending on the user settings. This will
        # result in the password being appended to the returned Join URL.
        #
        # If we don't request a password to be set, the waiting room will be
        # forcibly enabled in Zoom organizations that require some kind of
        # authentication for all meetings.
        default_password=True,
    )
    if settings.VIDEO_ZOOM_SERVER_TO_SERVER_ACCOUNT_ID is not None:
        return make_server_authenticated_zoom_video_call(request, user, payload=payload)
    return ZoomGeneralOAuthProvider().make_video_call(request=request, user=user, payload=payload)


@csrf_exempt
@require_POST
@typed_endpoint_without_parameters
def deauthorize_zoom_user(request: HttpRequest) -> HttpResponse:
    return json_success(request)


@typed_endpoint
def get_bigbluebutton_url(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    meeting_name: str,
    voice_only: Json[bool] = False,
) -> HttpResponse:
    # https://docs.bigbluebutton.org/dev/api.html#create for reference on the API calls
    # https://docs.bigbluebutton.org/dev/api.html#usage for reference for checksum
    id = "zulip-" + str(random.randint(100000000000, 999999999999))

    # We sign our data here to ensure a Zulip user cannot tamper with
    # the join link to gain access to other meetings that are on the
    # same bigbluebutton server.
    signed = Signer().sign_object(
        {
            "meeting_id": id,
            "name": meeting_name,
            "lock_settings_disable_cam": voice_only,
            "moderator": request.user.id,
        }
    )
    url = append_url_query_string("/calls/bigbluebutton/join", "bigbluebutton=" + signed)
    return json_success(request, {"url": url})


# We use zulip_login_required here mainly to get access to the user's
# full name from Zulip to prepopulate the user's name in the
# BigBlueButton meeting.  Since the meeting's details are encoded in
# the link the user is clicking, there is no validation tying this
# meeting to the Zulip organization it was created in.
@zulip_login_required
@never_cache
@typed_endpoint
def join_bigbluebutton(request: HttpRequest, *, bigbluebutton: str) -> HttpResponse:
    assert request.user.is_authenticated

    if settings.BIG_BLUE_BUTTON_URL is None or settings.BIG_BLUE_BUTTON_SECRET is None:
        raise JsonableError(_("BigBlueButton is not configured."))

    try:
        bigbluebutton_data = Signer().unsign_object(bigbluebutton)
    except Exception:
        raise JsonableError(_("Invalid signature."))

    create_params = urlencode(
        {
            "meetingID": bigbluebutton_data["meeting_id"],
            "name": bigbluebutton_data["name"],
            "lockSettingsDisableCam": bigbluebutton_data["lock_settings_disable_cam"],
        },
        quote_via=quote,
    )

    checksum = hashlib.sha256(
        ("create" + create_params + settings.BIG_BLUE_BUTTON_SECRET).encode()
    ).hexdigest()

    try:
        response = VideoCallSession().get(
            append_url_query_string(settings.BIG_BLUE_BUTTON_URL + "api/create", create_params)
            + "&checksum="
            + checksum
        )
        response.raise_for_status()
    except requests.RequestException:
        raise JsonableError(_("Error connecting to the BigBlueButton server."))

    payload = ElementTree.fromstring(response.text)
    if assert_is_not_none(payload.find("messageKey")).text == "checksumError":
        raise JsonableError(_("Error authenticating to the BigBlueButton server."))

    if assert_is_not_none(payload.find("returncode")).text != "SUCCESS":
        raise JsonableError(_("BigBlueButton server returned an unexpected error."))

    join_params = urlencode(
        {
            "meetingID": bigbluebutton_data["meeting_id"],
            # We use the moderator role only for the user who created the
            # meeting, the attendee role for everyone else, so that only
            # the user who created the meeting can convert a voice-only
            # call to a video call.
            "role": "MODERATOR" if bigbluebutton_data["moderator"] == request.user.id else "VIEWER",
            "fullName": request.user.full_name,
            # https://docs.bigbluebutton.org/dev/api.html#create
            # The createTime option is used to have the user redirected to a link
            # that is only valid for this meeting.
            #
            # Even if the same link in Zulip is used again, a new
            # createTime parameter will be created, as the meeting on
            # the BigBlueButton server has to be recreated. (after a
            # few minutes)
            "createTime": assert_is_not_none(payload.find("createTime")).text,
        },
        quote_via=quote,
    )

    checksum = hashlib.sha256(
        ("join" + join_params + settings.BIG_BLUE_BUTTON_SECRET).encode()
    ).hexdigest()
    redirect_url_base = append_url_query_string(
        settings.BIG_BLUE_BUTTON_URL + "api/join", join_params
    )
    return redirect(append_url_query_string(redirect_url_base, "checksum=" + checksum))
```

--------------------------------------------------------------------------------

---[FILE: welcome_bot_custom_message.py]---
Location: zulip-main/zerver/views/welcome_bot_custom_message.py
Signals: Django, Pydantic

```python
from typing import Annotated

from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _
from pydantic import StringConstraints

from zerver.actions.message_send import internal_send_private_message
from zerver.decorator import require_realm_admin
from zerver.lib.exceptions import JsonableError
from zerver.lib.onboarding import get_custom_welcome_message_string
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.models.realms import Realm
from zerver.models.users import UserProfile, get_system_bot


@require_realm_admin
@typed_endpoint
def send_test_welcome_bot_custom_message(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    welcome_message_custom_text: Annotated[
        str,
        StringConstraints(
            max_length=Realm.MAX_REALM_WELCOME_MESSAGE_CUSTOM_TEXT_LENGTH,
        ),
    ],
) -> HttpResponse:
    if len(welcome_message_custom_text) == 0:
        raise JsonableError(_("Message must not be empty"))

    welcome_bot_custom_message_string = get_custom_welcome_message_string(
        user_profile.realm, welcome_message_custom_text
    )
    message_id = internal_send_private_message(
        get_system_bot(settings.WELCOME_BOT, user_profile.realm_id),
        user_profile,
        welcome_bot_custom_message_string,
        disable_external_notifications=True,
    )
    assert message_id is not None
    return json_success(request, data={"message_id": message_id})
```

--------------------------------------------------------------------------------

---[FILE: cache.py]---
Location: zulip-main/zerver/views/development/cache.py
Signals: Django

```python
import os

from django.http import HttpRequest, HttpResponse
from django.views.decorators.csrf import csrf_exempt

from zerver.decorator import require_post
from zerver.lib.cache import get_cache_backend
from zerver.lib.per_request_cache import flush_per_request_caches
from zerver.lib.response import json_success
from zerver.models.clients import clear_client_cache

ZULIP_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../")


# This is used only by the Puppeteer tests to clear all the cache after each run.
@csrf_exempt
@require_post
def remove_caches(request: HttpRequest) -> HttpResponse:  # nocoverage
    cache = get_cache_backend(None)
    cache.clear()
    clear_client_cache()
    flush_per_request_caches()
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: camo.py]---
Location: zulip-main/zerver/views/development/camo.py
Signals: Django

```python
from urllib.parse import urljoin

from django.http import HttpRequest, HttpResponse, HttpResponseForbidden
from django.shortcuts import redirect
from django.utils.http import url_has_allowed_host_and_scheme

from zerver.lib.camo import is_camo_url_valid


def handle_camo_url(
    request: HttpRequest, digest: str, received_url: str
) -> HttpResponse:  # nocoverage
    original_url = bytes.fromhex(received_url).decode()
    if is_camo_url_valid(digest, original_url):
        original_url = urljoin("/", original_url)
        if url_has_allowed_host_and_scheme(original_url, allowed_hosts=None):
            return redirect(original_url)
        return HttpResponseForbidden("<p>Not a valid URL.</p>")
    else:
        return HttpResponseForbidden("<p>Not a valid URL.</p>")
```

--------------------------------------------------------------------------------

---[FILE: dev_login.py]---
Location: zulip-main/zerver/views/development/dev_login.py
Signals: Django

```python
from typing import Any

from django.conf import settings
from django.contrib.auth import authenticate
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.utils.translation import gettext as _
from django.views.decorators.csrf import csrf_exempt

from zerver.context_processors import get_realm_from_request
from zerver.decorator import do_login, require_post
from zerver.lib.exceptions import (
    AuthenticationFailedError,
    InvalidSubdomainError,
    JsonableError,
    RealmDeactivatedError,
    UserDeactivatedError,
)
from zerver.lib.response import json_success
from zerver.lib.subdomains import get_subdomain
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.lib.validator import validate_login_email
from zerver.models import Realm, UserProfile
from zerver.models.realms import get_realm
from zerver.views.auth import get_safe_redirect_to
from zerver.views.errors import config_error
from zproject.backends import dev_auth_enabled


def get_dev_users(realm: Realm | None = None, extra_users_count: int = 10) -> list[UserProfile]:
    # Development environments usually have only a few users, but
    # it still makes sense to limit how many extra users we render to
    # support performance testing with DevAuthBackend.
    if realm is not None:
        users_query = UserProfile.objects.select_related("realm").filter(
            is_bot=False, is_active=True, realm=realm
        )
    else:
        users_query = UserProfile.objects.select_related("realm").filter(
            is_bot=False, is_active=True
        )

    shakespearian_users = users_query.exclude(email__startswith="extrauser").order_by("email")
    extra_users = users_query.filter(email__startswith="extrauser").order_by("email")
    # Limit the number of extra users we offer by default
    extra_users = extra_users[0:extra_users_count]
    users = [*shakespearian_users, *extra_users]
    return users


def add_dev_login_context(realm: Realm | None, context: dict[str, Any]) -> None:
    users = get_dev_users(realm)
    context["current_realm"] = realm
    context["all_realms"] = Realm.objects.filter(deactivated_redirect__isnull=True)

    def sort(lst: list[UserProfile]) -> list[UserProfile]:
        return sorted(lst, key=lambda u: u.delivery_email)

    context["direct_owners"] = sort([u for u in users if u.is_realm_owner])
    context["direct_admins"] = sort([u for u in users if u.is_realm_admin and not u.is_realm_owner])
    context["guest_users"] = sort([u for u in users if u.is_guest])
    context["direct_moderators"] = sort([u for u in users if u.role == UserProfile.ROLE_MODERATOR])
    context["direct_users"] = sort([u for u in users if not (u.is_guest or u.is_moderator)])


@csrf_exempt
@typed_endpoint
def dev_direct_login(
    request: HttpRequest,
    *,
    next: str = "/",
) -> HttpResponse:
    # This function allows logging in without a password and should only be called
    # in development environments.  It may be called if the DevAuthBackend is included
    # in settings.AUTHENTICATION_BACKENDS
    if (not dev_auth_enabled()) or settings.PRODUCTION:
        # This check is probably not required, since authenticate would fail without
        # an enabled DevAuthBackend.
        return config_error(request, "dev_not_supported")

    subdomain = get_subdomain(request)
    realm = get_realm(subdomain)

    if request.POST.get("prefers_web_public_view") == "Anonymous login":
        redirect_to = get_safe_redirect_to(next, realm.url)
        return HttpResponseRedirect(redirect_to)

    email = request.POST["direct_email"]
    user_profile = authenticate(dev_auth_username=email, realm=realm)
    if user_profile is None:
        return config_error(request, "dev_not_supported")
    assert isinstance(user_profile, UserProfile)
    do_login(request, user_profile)

    redirect_to = get_safe_redirect_to(next, user_profile.realm.url)
    return HttpResponseRedirect(redirect_to)


def check_dev_auth_backend() -> None:
    if settings.PRODUCTION:
        raise JsonableError(_("Endpoint not available in production."))
    if not dev_auth_enabled():
        raise JsonableError(_("DevAuthBackend not enabled."))


@csrf_exempt
@require_post
@typed_endpoint
def api_dev_fetch_api_key(request: HttpRequest, *, username: str) -> HttpResponse:
    """This function allows logging in without a password on the Zulip
    mobile apps when connecting to a Zulip development environment.  It
    requires DevAuthBackend to be included in settings.AUTHENTICATION_BACKENDS.
    """
    check_dev_auth_backend()

    # Django invokes authenticate methods by matching arguments, and this
    # authentication flow will not invoke LDAP authentication because of
    # this condition of Django so no need to check if LDAP backend is
    # enabled.
    validate_login_email(username)
    realm = get_realm_from_request(request)
    if realm is None:
        raise InvalidSubdomainError
    return_data: dict[str, bool] = {}
    user_profile = authenticate(dev_auth_username=username, realm=realm, return_data=return_data)
    if return_data.get("inactive_realm"):
        raise RealmDeactivatedError
    if return_data.get("inactive_user"):
        raise UserDeactivatedError
    if return_data.get("invalid_subdomain"):  # nocoverage
        raise InvalidSubdomainError
    if user_profile is None:
        # Since we're not actually checking passwords, this condition
        # is when one's attempting to send an email address that
        # doesn't have an account, i.e. it's definitely invalid username.
        raise AuthenticationFailedError
    assert isinstance(user_profile, UserProfile)

    do_login(request, user_profile)
    api_key = user_profile.api_key
    return json_success(
        request,
        data={"api_key": api_key, "email": user_profile.delivery_email, "user_id": user_profile.id},
    )


@csrf_exempt
def api_dev_list_users(request: HttpRequest) -> HttpResponse:
    check_dev_auth_backend()

    users = get_dev_users()
    return json_success(
        request,
        data=dict(
            direct_admins=[
                dict(email=u.delivery_email, realm_url=u.realm.url)
                for u in users
                if u.is_realm_admin
            ],
            direct_users=[
                dict(email=u.delivery_email, realm_url=u.realm.url)
                for u in users
                if not u.is_realm_admin
            ],
        ),
    )
```

--------------------------------------------------------------------------------

---[FILE: email_log.py]---
Location: zulip-main/zerver/views/development/email_log.py
Signals: Django

```python
import os
from contextlib import suppress
from urllib.parse import urlencode

import orjson
from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.shortcuts import redirect, render
from django.views.decorators.http import require_safe

from confirmation.models import Confirmation
from zerver.actions.realm_settings import do_send_realm_reactivation_email
from zerver.actions.user_settings import do_change_user_delivery_email
from zerver.actions.users import change_user_is_active
from zerver.lib.email_notifications import enqueue_welcome_emails, send_account_registered_email
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.models import Realm
from zerver.models.realms import get_realm
from zerver.models.streams import get_realm_stream
from zerver.models.users import get_user_by_delivery_email
from zerver.views.invite import INVITATION_LINK_VALIDITY_MINUTES
from zproject.email_backends import get_forward_address, set_forward_address

ZULIP_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../")


@typed_endpoint
def email_page(request: HttpRequest, *, forward_address: str | None = None) -> HttpResponse:
    if request.method == "POST":
        assert forward_address is not None
        set_forward_address(forward_address)
        return json_success(request)
    try:
        with open(settings.EMAIL_CONTENT_LOG_PATH, "r+") as f:
            content = f.read()
    except FileNotFoundError:
        content = ""
    return render(
        request,
        "zerver/development/email_log.html",
        {"log": content, "forward_address": get_forward_address()},
    )


def clear_emails(request: HttpRequest) -> HttpResponse:
    with suppress(FileNotFoundError):
        os.remove(settings.EMAIL_CONTENT_LOG_PATH)
    return redirect(email_page)


@require_safe
def generate_all_emails(request: HttpRequest) -> HttpResponse:
    # We import the Django test client inside the view function,
    # because it isn't needed in production elsewhere, and not
    # importing it saves ~50ms of unnecessary manage.py startup time.

    from django.test import Client

    client = Client()

    # write fake data for all variables
    registered_email = "hamlet@zulip.com"
    unregistered_email_1 = "new-person@zulip.com"
    unregistered_email_2 = "new-person-2@zulip.com"
    invite_expires_in_minutes = INVITATION_LINK_VALIDITY_MINUTES
    realm = get_realm("zulip")
    other_realm = Realm.objects.exclude(string_id="zulip").first()
    user = get_user_by_delivery_email(registered_email, realm)

    # Password reset emails
    # active account in realm
    result = client.post(
        "/accounts/password/reset/", {"email": registered_email}, HTTP_HOST=realm.host
    )
    assert result.status_code == 302
    # deactivated user
    change_user_is_active(user, False)
    result = client.post(
        "/accounts/password/reset/", {"email": registered_email}, HTTP_HOST=realm.host
    )
    assert result.status_code == 302
    change_user_is_active(user, True)
    # account on different realm
    assert other_realm is not None
    result = client.post(
        "/accounts/password/reset/", {"email": registered_email}, HTTP_HOST=other_realm.host
    )
    assert result.status_code == 302
    # no account anywhere
    result = client.post(
        "/accounts/password/reset/", {"email": unregistered_email_1}, HTTP_HOST=realm.host
    )
    assert result.status_code == 302

    # Confirm account email
    result = client.post("/accounts/home/", {"email": unregistered_email_1}, HTTP_HOST=realm.host)
    assert result.status_code == 302

    # Find account email
    result = client.post("/accounts/find/", {"emails": registered_email}, HTTP_HOST=realm.host)
    assert result.status_code == 200

    # New login email
    logged_in = client.login(dev_auth_username=registered_email, realm=realm)
    assert logged_in

    # New user invite and reminder emails
    stream = get_realm_stream("Denmark", user.realm.id)
    result = client.post(
        "/json/invites",
        {
            "invitee_emails": unregistered_email_2,
            "invite_expires_in_minutes": invite_expires_in_minutes,
            "stream_ids": orjson.dumps([stream.id]).decode(),
        },
        HTTP_HOST=realm.host,
    )
    assert result.status_code == 200

    # Verification for new email
    result = client.patch(
        "/json/settings",
        urlencode({"email": "hamlets-new@zulip.com"}),
        content_type="application/x-www-form-urlencoded",
        HTTP_HOST=realm.host,
    )
    assert result.status_code == 200

    # Email change successful
    key = Confirmation.objects.filter(type=Confirmation.EMAIL_CHANGE).latest("id").confirmation_key
    user_profile = get_user_by_delivery_email(registered_email, realm)
    result = client.post("/accounts/confirm_new_email/", {"key": key})
    assert result.status_code == 200

    # Reset the email value so we can run this again
    do_change_user_delivery_email(user_profile, registered_email, acting_user=None)

    # Initial email with new account information for normal user
    send_account_registered_email(user_profile)

    # Onboarding emails for normal user
    enqueue_welcome_emails(user_profile)

    # Initial email with new account information for admin user
    send_account_registered_email(get_user_by_delivery_email("iago@zulip.com", realm))

    # Onboarding emails for admin user
    enqueue_welcome_emails(get_user_by_delivery_email("iago@zulip.com", realm), realm_creation=True)

    # Realm reactivation email
    do_send_realm_reactivation_email(realm, acting_user=None)

    return redirect(email_page)
```

--------------------------------------------------------------------------------

---[FILE: help.py]---
Location: zulip-main/zerver/views/development/help.py
Signals: Django

```python
import os

import werkzeug
from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


def help_dev_mode_view(request: HttpRequest, subpath: str = "") -> HttpResponse:
    """
    Dev only view that displays help information for setting up the
    help center dev server in the default `run-dev` mode where the
    help center server is not running. Also serves raw MDX content when
    `raw` query param is passed is passed.
    """

    def read_mdx_file(filename: str) -> HttpResponse:
        file_path = os.path.join(
            settings.DEPLOY_ROOT, "starlight_help", "src", "content", "docs", f"{filename}.mdx"
        )
        try:
            with open(file_path, encoding="utf-8") as f:
                content = f.read()
            return HttpResponse(content, content_type="text/plain")
        except OSError:
            return HttpResponse("Error reading MDX file", status=500)

    mdx_file_exists = False
    is_requesting_raw_file = request.GET.get("raw") == ""

    if subpath:
        subpath = werkzeug.utils.secure_filename(subpath)
        raw_url = f"/help/{subpath}?raw"
        mdx_path = os.path.join(
            settings.DEPLOY_ROOT, "starlight_help", "src", "content", "docs", f"{subpath}.mdx"
        )
        mdx_file_exists = os.path.exists(mdx_path) and "/include/" not in mdx_path
        if mdx_file_exists and is_requesting_raw_file:
            return read_mdx_file(subpath)
    else:
        if request.path.endswith("/"):
            raw_url = "/help/?raw"
        else:
            raw_url = "/help?raw"
        mdx_file_exists = True
        if is_requesting_raw_file:
            return read_mdx_file("index")

    return render(
        request,
        "zerver/development/dev_help.html",
        {
            "subpath": subpath,
            "mdx_file_exists": mdx_file_exists,
            "raw_url": raw_url,
        },
    )
```

--------------------------------------------------------------------------------

````
