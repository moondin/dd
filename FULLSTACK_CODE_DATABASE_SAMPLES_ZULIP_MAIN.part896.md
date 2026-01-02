---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 896
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 896 of 1290)

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

---[FILE: reminders.py]---
Location: zulip-main/zerver/lib/reminders.py
Signals: Django

```python
from django.conf import settings
from django.utils.translation import gettext as _

from zerver.lib.exceptions import JsonableError, ResourceNotFoundError
from zerver.lib.markdown.fenced_code import get_unused_fence
from zerver.lib.mention import silent_mention_syntax_for_user
from zerver.lib.message import truncate_content
from zerver.lib.message_cache import MessageDict
from zerver.lib.topic_link_util import get_message_link_syntax
from zerver.lib.url_encoding import message_link_url
from zerver.models import Message, Stream, UserProfile
from zerver.models.scheduled_jobs import ScheduledMessage
from zerver.tornado.django_api import send_event_on_commit


def normalize_note_text(body: str) -> str:
    # Similar to zerver.lib.message.normalize_body
    body = body.rstrip().lstrip("\n")

    if len(body) > settings.MAX_REMINDER_NOTE_LENGTH:
        raise JsonableError(
            _("Maximum reminder note length: {max_length} characters").format(
                max_length=settings.MAX_REMINDER_NOTE_LENGTH
            )
        )

    return body


def get_reminder_formatted_content(
    message: Message, current_user: UserProfile, note: str | None = None
) -> str:
    if note:
        note = normalize_note_text(note)

    if message.is_channel_message:
        # We don't need to check access here since we already have the message
        # whose access has already been checked by the caller.
        stream = Stream.objects.get(
            id=message.recipient.type_id,
            realm=current_user.realm,
        )
        message_pretty_link = get_message_link_syntax(
            stream_id=stream.id,
            stream_name=stream.name,
            topic_name=message.topic_name(),
            message_id=message.id,
        )
        if note:
            content = _(
                "You requested a reminder for {message_pretty_link}. Note:\n > {note}"
            ).format(
                message_pretty_link=message_pretty_link,
                note=note,
            )
        else:
            content = _("You requested a reminder for {message_pretty_link}.").format(
                message_pretty_link=message_pretty_link,
            )
    else:
        if note:
            content = _(
                "You requested a reminder for the following direct message. Note:\n > {note}"
            ).format(
                note=note,
            )
        else:
            content = _("You requested a reminder for the following direct message.")

    # Format the message content as a quote.
    user_silent_mention = silent_mention_syntax_for_user(message.sender)
    conversation_url = message_link_url(current_user.realm, MessageDict.wide_dict(message))
    content += "\n\n"
    if message.content.startswith("/poll"):
        content += _("{user_silent_mention} [sent]({conversation_url}) a poll.").format(
            user_silent_mention=user_silent_mention,
            conversation_url=conversation_url,
        )
    elif message.content.startswith("/todo"):
        content += _("{user_silent_mention} [sent]({conversation_url}) a todo list.").format(
            user_silent_mention=user_silent_mention,
            conversation_url=conversation_url,
        )
    else:
        content += _("{user_silent_mention} [said]({conversation_url}):").format(
            user_silent_mention=user_silent_mention,
            conversation_url=conversation_url,
        )
        content += "\n"
        fence = get_unused_fence(content)
        quoted_message = "{fence}quote\n{msg_content}\n{fence}"
        length_without_message_content = len(
            content + quoted_message.format(fence=fence, msg_content="")
        )
        max_length = settings.MAX_MESSAGE_LENGTH - length_without_message_content
        msg_content = truncate_content(message.content, max_length, "\n[message truncated]")
        content += quoted_message.format(
            fence=fence,
            msg_content=msg_content,
        )
    return content


def access_reminder(user_profile: UserProfile, reminder_id: int) -> ScheduledMessage:
    try:
        return ScheduledMessage.objects.get(
            id=reminder_id, sender=user_profile, delivery_type=ScheduledMessage.REMIND
        )
    except ScheduledMessage.DoesNotExist:
        raise ResourceNotFoundError(_("Reminder does not exist"))


def notify_remove_reminder(user_profile: UserProfile, reminder_id: int) -> None:
    event = {
        "type": "reminders",
        "op": "remove",
        "reminder_id": reminder_id,
    }
    send_event_on_commit(user_profile.realm, event, [user_profile.id])
```

--------------------------------------------------------------------------------

---[FILE: remote_server.py]---
Location: zulip-main/zerver/lib/remote_server.py
Signals: Django, Pydantic

```python
import logging
import secrets
from collections.abc import Mapping
from typing import Any
from urllib.parse import urljoin

import orjson
import requests
from django.conf import settings
from django.db.models import QuerySet
from django.utils.timezone import now as timezone_now
from django.utils.translation import gettext as _
from pydantic import UUID4, BaseModel, ConfigDict, Field, Json, field_validator

from analytics.lib.counts import LOGGING_COUNT_STAT_PROPERTIES_NOT_SENT_TO_BOUNCER
from analytics.models import InstallationCount, RealmCount
from version import API_FEATURE_LEVEL, ZULIP_MERGE_BASE, ZULIP_VERSION
from zerver.actions.realm_settings import (
    do_set_push_notifications_enabled_end_timestamp,
    do_set_realm_property,
)
from zerver.lib import redis_utils
from zerver.lib.exceptions import (
    InvalidBouncerPublicKeyError,
    JsonableError,
    MissingRemoteRealmError,
    RemoteRealmServerMismatchError,
    RequestExpiredError,
)
from zerver.lib.outgoing_http import OutgoingSession
from zerver.lib.queue import queue_event_on_commit
from zerver.lib.redis_utils import get_redis_client
from zerver.lib.types import AnalyticsDataUploadLevel
from zerver.models import Realm, RealmAuditLog
from zerver.models.realms import OrgTypeEnum

redis_client = get_redis_client()


class PushBouncerSession(OutgoingSession):
    def __init__(self, timeout: int = 15) -> None:
        super().__init__(role="push_bouncer", timeout=timeout)


class PushNotificationBouncerError(Exception):
    pass


class PushNotificationBouncerRetryLaterError(JsonableError):
    http_status_code = 502


class PushNotificationBouncerServerError(PushNotificationBouncerRetryLaterError):
    http_status_code = 502


class RealmCountDataForAnalytics(BaseModel):
    property: str
    realm: int
    id: int
    end_time: float
    subgroup: str | None
    value: int


class InstallationCountDataForAnalytics(BaseModel):
    property: str
    id: int
    end_time: float
    subgroup: str | None
    value: int


class RealmAuditLogDataForAnalytics(BaseModel):
    id: int
    realm: int
    event_time: float
    backfilled: bool
    extra_data: str | dict[str, Any] | None
    event_type: int


class RealmDataForAnalytics(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: int
    host: str
    url: str
    name: str = ""
    org_type: int = 0
    date_created: float
    deactivated: bool
    is_system_bot_realm: bool = False

    authentication_methods: dict[str, bool] = Field(default_factory=dict)

    uuid: UUID4
    uuid_owner_secret: str

    @field_validator("org_type")
    @classmethod
    def check_is_allowed_value(cls, value: int) -> int:
        if value not in [org_type.value for org_type in OrgTypeEnum]:
            raise ValueError("Not a valid org_type value")

        return value


class AnalyticsRequest(BaseModel):
    realm_counts: Json[list[RealmCountDataForAnalytics]]
    installation_counts: Json[list[InstallationCountDataForAnalytics]]
    realmauditlog_rows: Json[list[RealmAuditLogDataForAnalytics]] | None = None
    realms: Json[list[RealmDataForAnalytics]]
    version: Json[str] | None
    merge_base: Json[str] | None
    api_feature_level: Json[int] | None


class UserDataForRemoteBilling(BaseModel):
    uuid: UUID4
    email: str
    full_name: str


def send_to_push_bouncer(
    method: str,
    endpoint: str,
    post_data: bytes | Mapping[str, str | int | None | bytes],
    extra_headers: Mapping[str, str] = {},
) -> dict[str, object]:
    """While it does actually send the notice, this function has a lot of
    code and comments around error handling for the push notifications
    bouncer.  There are several classes of failures, each with its own
    potential solution:

    * Network errors with requests.request.  We raise an exception to signal
      it to the callers.

    * 500 errors from the push bouncer or other unexpected responses;
      we don't try to parse the response, but do make clear the cause.

    * 400 errors from the push bouncer.  Here there are 2 categories:
      Our server failed to connect to the push bouncer (should throw)
      vs. client-side errors like an invalid token.

    """
    assert settings.ZULIP_SERVICES_URL is not None
    assert settings.ZULIP_ORG_ID is not None
    assert settings.ZULIP_ORG_KEY is not None
    url = urljoin(settings.ZULIP_SERVICES_URL, "/api/v1/remotes/" + endpoint)
    api_auth = requests.auth.HTTPBasicAuth(settings.ZULIP_ORG_ID, settings.ZULIP_ORG_KEY)

    headers = {"User-agent": f"ZulipServer/{ZULIP_VERSION}"}
    headers.update(extra_headers)

    if endpoint == "server/analytics":
        # Uploading audit log and/or analytics data can require the
        # bouncer to do a significant chunk of work in a few
        # situations; since this occurs in background jobs, set a long
        # timeout.
        session = PushBouncerSession(timeout=90)
    else:
        session = PushBouncerSession()

    try:
        res = session.request(
            method,
            url,
            data=post_data,
            auth=api_auth,
            verify=True,
            headers=headers,
        )
    except (
        requests.exceptions.Timeout,
        requests.exceptions.SSLError,
        requests.exceptions.ConnectionError,
    ) as e:
        raise PushNotificationBouncerRetryLaterError(
            f"{type(e).__name__} while trying to connect to push notification bouncer"
        )

    if res.status_code >= 500:
        # 5xx's should be resolved by the people who run the push
        # notification bouncer service, and they'll get an appropriate
        # error notification from the server. We raise an exception to signal
        # to the callers that the attempt failed and they can retry.
        error_msg = f"Received {res.status_code} from push notification bouncer"
        logging.warning(error_msg)
        raise PushNotificationBouncerServerError(error_msg)
    elif res.status_code >= 400:
        # If JSON parsing errors, just let that exception happen
        result_dict = orjson.loads(res.content)
        msg = result_dict["msg"]
        code = result_dict["code"] if "code" in result_dict else None
        if code == "INVALID_ZULIP_SERVER":
            # Invalid Zulip server credentials should email this server's admins
            raise PushNotificationBouncerError(
                _("Push notifications bouncer error: {error}").format(error=msg)
            )
        elif code == "PUSH_NOTIFICATIONS_DISALLOWED":
            from zerver.lib.push_notifications import PushNotificationsDisallowedByBouncerError

            raise PushNotificationsDisallowedByBouncerError(reason=msg)
        elif endpoint == "push/test_notification" and code == "INVALID_REMOTE_PUSH_DEVICE_TOKEN":
            # This error from the notification debugging endpoint should just be directly
            # communicated to the device.
            # TODO: Extend this to use a more general mechanism when we add more such error responses.
            from zerver.lib.push_notifications import InvalidRemotePushDeviceTokenError

            raise InvalidRemotePushDeviceTokenError
        elif endpoint == "server/billing" and code == "MISSING_REMOTE_REALM":  # nocoverage
            # The callers requesting this endpoint want the exception to propagate
            # so they can catch it.
            raise MissingRemoteRealmError
        elif (
            endpoint == "server/billing" and code == "REMOTE_REALM_SERVER_MISMATCH_ERROR"
        ):  # nocoverage
            # The callers requesting this endpoint want the exception to propagate
            # so they can catch it.
            raise RemoteRealmServerMismatchError
        elif endpoint == "push/e2ee/register" and code == "INVALID_BOUNCER_PUBLIC_KEY":
            raise InvalidBouncerPublicKeyError
        elif endpoint == "push/e2ee/register" and code == "REQUEST_EXPIRED":
            raise RequestExpiredError
        elif endpoint == "push/e2ee/register" and code == "MISSING_REMOTE_REALM":
            raise MissingRemoteRealmError
        elif endpoint == "push/e2ee/notify" and code == "MISSING_REMOTE_REALM":
            raise MissingRemoteRealmError
        else:
            # But most other errors coming from the push bouncer
            # server are client errors (e.g. never-registered token)
            # and should be handled as such.
            raise JsonableError(msg)
    elif res.status_code != 200:
        # Anything else is unexpected and likely suggests a bug in
        # this version of Zulip, so we throw an exception that will
        # email the server admins.
        raise PushNotificationBouncerError(
            f"Push notification bouncer returned unexpected status code {res.status_code}"
        )

    # If we don't throw an exception, it's a successful bounce!
    return orjson.loads(res.content)


def send_json_to_push_bouncer(
    method: str, endpoint: str, post_data: Mapping[str, object]
) -> dict[str, object]:
    return send_to_push_bouncer(
        method,
        endpoint,
        orjson.dumps(post_data),
        extra_headers={"Content-type": "application/json"},
    )


PUSH_NOTIFICATIONS_RECENTLY_WORKING_REDIS_KEY = "push_notifications_recently_working_ts"


def record_push_notifications_recently_working() -> None:
    # Record the timestamp in redis, marking that push notifications
    # were working as of this moment.

    redis_key = redis_utils.REDIS_KEY_PREFIX + PUSH_NOTIFICATIONS_RECENTLY_WORKING_REDIS_KEY
    # Keep this record around for 24h in case it's useful for debugging.
    redis_client.set(redis_key, str(timezone_now().timestamp()), ex=60 * 60 * 24)


def check_push_notifications_recently_working() -> bool:
    # Check in redis whether push notifications were working in the last hour.
    redis_key = redis_utils.REDIS_KEY_PREFIX + PUSH_NOTIFICATIONS_RECENTLY_WORKING_REDIS_KEY
    timestamp = redis_client.get(redis_key)
    if timestamp is None:
        return False

    # If the timestamp is within the last hour, we consider push notifications to be working.
    return timezone_now().timestamp() - float(timestamp) < 60 * 60


def maybe_mark_pushes_disabled(
    e: JsonableError | orjson.JSONDecodeError, logger: logging.Logger
) -> None:
    if isinstance(e, PushNotificationBouncerServerError):
        # We don't fall through and deactivate the flag, since this is
        # not under the control of the caller.
        return

    if isinstance(e, JsonableError):
        logger.warning(e.msg)
    else:
        logger.exception("Exception communicating with %s", settings.ZULIP_SERVICES_URL)

    # An exception was thrown talking to the push bouncer. There may
    # be certain transient failures that we could ignore here -
    # therefore we check whether push notifications were recently working
    # and if so, the error can be treated as transient.
    # Otherwise, the assumed explanation is that there is something wrong
    # either with our credentials being corrupted or our ability to reach the
    # bouncer service over the network, so we move to
    # reporting push notifications as likely not working.
    if check_push_notifications_recently_working():
        # Push notifications were recently observed working, so we
        # assume this is likely a transient failure.
        return

    for realm in Realm.objects.filter(push_notifications_enabled=True):
        do_set_realm_property(realm, "push_notifications_enabled", False, acting_user=None)
        do_set_push_notifications_enabled_end_timestamp(realm, None, acting_user=None)


def build_analytics_data(
    realm_count_query: QuerySet[RealmCount],
    installation_count_query: QuerySet[InstallationCount],
    realmauditlog_query: QuerySet[RealmAuditLog],
) -> tuple[
    list[RealmCountDataForAnalytics],
    list[InstallationCountDataForAnalytics],
    list[RealmAuditLogDataForAnalytics],
]:
    # We limit the batch size on the client side to avoid OOM kills timeouts, etc.
    MAX_CLIENT_BATCH_SIZE = 10000
    realm_count_data = [
        RealmCountDataForAnalytics(
            property=row.property,
            realm=row.realm.id,
            id=row.id,
            end_time=row.end_time.timestamp(),
            subgroup=row.subgroup,
            value=row.value,
        )
        for row in realm_count_query.order_by("id")[0:MAX_CLIENT_BATCH_SIZE]
    ]
    installation_count_data = [
        InstallationCountDataForAnalytics(
            property=row.property,
            id=row.id,
            end_time=row.end_time.timestamp(),
            subgroup=row.subgroup,
            value=row.value,
        )
        for row in installation_count_query.order_by("id")[0:MAX_CLIENT_BATCH_SIZE]
    ]
    zerver_realmauditlog = [
        RealmAuditLogDataForAnalytics(
            id=row.id,
            realm=row.realm.id,
            event_time=row.event_time.timestamp(),
            backfilled=row.backfilled,
            # Note that we don't need to add extra_data_json here because
            # the view remote_server_post_analytics populates extra_data_json
            # from the provided extra_data.
            extra_data=row.extra_data,
            event_type=row.event_type,
        )
        for row in realmauditlog_query.order_by("id")[0:MAX_CLIENT_BATCH_SIZE]
    ]

    return realm_count_data, installation_count_data, zerver_realmauditlog


def get_realms_info_for_push_bouncer(realm_id: int | None = None) -> list[RealmDataForAnalytics]:
    realms = Realm.objects.order_by("id")
    if realm_id is not None:  # nocoverage
        realms = realms.filter(id=realm_id)

    realm_info_list = [
        RealmDataForAnalytics(
            id=realm.id,
            uuid=realm.uuid,
            uuid_owner_secret=realm.uuid_owner_secret,
            host=realm.host,
            url=realm.url,
            deactivated=realm.deactivated,
            date_created=realm.date_created.timestamp(),
            org_type=realm.org_type,
            name=realm.name,
            authentication_methods=realm.authentication_methods_dict(),
            is_system_bot_realm=realm.string_id == settings.SYSTEM_BOT_REALM,
        )
        for realm in realms
    ]

    return realm_info_list


def should_send_analytics_data() -> bool:  # nocoverage
    return settings.ANALYTICS_DATA_UPLOAD_LEVEL > AnalyticsDataUploadLevel.NONE


def send_server_data_to_push_bouncer(
    consider_usage_statistics: bool = True, raise_on_error: bool = False
) -> None:
    logger = logging.getLogger("zulip.analytics")
    # first, check what's latest
    try:
        result = send_to_push_bouncer("GET", "server/analytics/status", {})
    except (JsonableError, orjson.JSONDecodeError) as e:
        maybe_mark_pushes_disabled(e, logger)
        if raise_on_error:  # nocoverage
            raise
        return

    # Gather only entries with IDs greater than the last ID received by the push bouncer.
    # We don't re-send old data that's already been submitted.
    last_acked_realm_count_id = result["last_realm_count_id"]
    last_acked_installation_count_id = result["last_installation_count_id"]
    last_acked_realmauditlog_id = result["last_realmauditlog_id"]

    if (
        settings.ANALYTICS_DATA_UPLOAD_LEVEL == AnalyticsDataUploadLevel.ALL
        and consider_usage_statistics
    ):
        # Only upload usage statistics, which is relatively expensive,
        # if called from the analytics cron job and the server has
        # uploading such statistics enabled.
        installation_count_query = InstallationCount.objects.filter(
            id__gt=last_acked_installation_count_id
        ).exclude(property__in=LOGGING_COUNT_STAT_PROPERTIES_NOT_SENT_TO_BOUNCER)
        realm_count_query = RealmCount.objects.filter(id__gt=last_acked_realm_count_id).exclude(
            property__in=LOGGING_COUNT_STAT_PROPERTIES_NOT_SENT_TO_BOUNCER
        )
    else:
        installation_count_query = InstallationCount.objects.none()
        realm_count_query = RealmCount.objects.none()

    if settings.ANALYTICS_DATA_UPLOAD_LEVEL >= AnalyticsDataUploadLevel.BILLING:
        realmauditlog_query = RealmAuditLog.objects.filter(
            event_type__in=RealmAuditLog.SYNCED_BILLING_EVENTS, id__gt=last_acked_realmauditlog_id
        )
    else:
        realmauditlog_query = RealmAuditLog.objects.none()

    # This code shouldn't be called at all if we're not configured to send any data.
    assert settings.ANALYTICS_DATA_UPLOAD_LEVEL > AnalyticsDataUploadLevel.NONE

    (realm_count_data, installation_count_data, realmauditlog_data) = build_analytics_data(
        realm_count_query=realm_count_query,
        installation_count_query=installation_count_query,
        realmauditlog_query=realmauditlog_query,
    )

    record_count = len(realm_count_data) + len(installation_count_data) + len(realmauditlog_data)
    request = AnalyticsRequest.model_construct(
        realm_counts=realm_count_data,
        installation_counts=installation_count_data,
        realmauditlog_rows=realmauditlog_data,
        realms=get_realms_info_for_push_bouncer(),
        version=ZULIP_VERSION,
        merge_base=ZULIP_MERGE_BASE,
        api_feature_level=API_FEATURE_LEVEL,
    )

    # Send the actual request, and process the response.
    try:
        response = send_to_push_bouncer(
            "POST", "server/analytics", request.model_dump(round_trip=True)
        )
    except (JsonableError, orjson.JSONDecodeError) as e:
        if raise_on_error:  # nocoverage
            raise
        maybe_mark_pushes_disabled(e, logger)
        return

    assert isinstance(response["realms"], dict)  # for mypy
    realms = response["realms"]
    for realm_uuid, data in realms.items():
        try:
            realm = Realm.objects.get(uuid=realm_uuid)
        except Realm.DoesNotExist:
            # This occurs if the installation's database was rebuilt
            # from scratch or a realm was hard-deleted from the local
            # database, after generating secrets and talking to the
            # bouncer.
            logger.warning("Received unexpected realm UUID from bouncer %s", realm_uuid)
            continue

        do_set_realm_property(
            realm, "push_notifications_enabled", data["can_push"], acting_user=None
        )
        do_set_push_notifications_enabled_end_timestamp(
            realm, data["expected_end_timestamp"], acting_user=None
        )

    logger.info("Reported %d records", record_count)


def maybe_enqueue_audit_log_upload(realm: Realm) -> None:
    # Update the push notifications service, either with the fact that
    # the realm now exists or updates to its audit log of users.
    #
    # Done via a queue worker so that networking failures cannot have
    # any impact on the success operation of the local server's
    # ability to do operations that trigger these updates.
    from zerver.lib.push_notifications import uses_notification_bouncer

    if uses_notification_bouncer():
        event = {"type": "push_bouncer_update_for_realm", "realm_id": realm.id}
        queue_event_on_commit("deferred_work", event)


SELF_HOSTING_REGISTRATION_TAKEOVER_CHALLENGE_TOKEN_REDIS_KEY = (
    "self_hosting_domain_transfer_challenge_verify"
)


def prepare_for_registration_transfer_challenge(verification_secret: str) -> str:
    access_token = secrets.token_urlsafe(32)
    data_to_store = {"verification_secret": verification_secret, "access_token": access_token}
    redis_client.set(
        redis_utils.REDIS_KEY_PREFIX + SELF_HOSTING_REGISTRATION_TAKEOVER_CHALLENGE_TOKEN_REDIS_KEY,
        orjson.dumps(data_to_store),
        ex=10,
    )
    return access_token
```

--------------------------------------------------------------------------------

---[FILE: request.py]---
Location: zulip-main/zerver/lib/request.py
Signals: Django

```python
from collections import defaultdict
from collections.abc import MutableMapping
from dataclasses import dataclass, field
from typing import Any, Optional

from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _
from typing_extensions import override

from zerver.lib import rate_limiter
from zerver.lib.exceptions import ErrorCode, JsonableError
from zerver.lib.notes import BaseNotes
from zerver.models import Client, Realm

if settings.ZILENCER_ENABLED:
    from zilencer.models import RemoteZulipServer


@dataclass
class RequestNotes(BaseNotes[HttpRequest, "RequestNotes"]):
    """This class contains extra metadata that Zulip associated with a
    Django HttpRequest object. See the docstring for BaseNotes for
    details on how it works.

    Note that most Optional fields will be definitely not None once
    middleware has run. In the future, we may want to express that in
    the types by having different types EarlyRequestNotes and
    post-middleware RequestNotes types, but for now we have a lot
    of `assert request_notes.foo is not None` when accessing them.
    """

    client: Client | None = None
    client_name: str | None = None
    client_version: str | None = None
    log_data: MutableMapping[str, Any] | None = None
    requester_for_logs: str | None = None
    # We use realm_cached to indicate whether the realm is cached or not.
    # Because the default value of realm is None, which can indicate "unset"
    # and "nonexistence" at the same time.
    realm: Realm | None = None
    has_fetched_realm: bool = False
    set_language: str | None = None
    ratelimits_applied: list[rate_limiter.RateLimitResult] = field(default_factory=list)
    query: str | None = None
    error_format: str | None = None
    saved_response: HttpResponse | None = None
    tornado_handler_id: int | None = None
    processed_parameters: set[str] = field(default_factory=set)
    remote_server: Optional["RemoteZulipServer"] = None
    is_webhook_view: bool = False

    @classmethod
    @override
    def init_notes(cls) -> "RequestNotes":
        return RequestNotes()


class RequestConfusingParamsError(JsonableError):
    code = ErrorCode.REQUEST_CONFUSING_VAR
    data_fields = ["var_name1", "var_name2"]

    def __init__(self, var_name1: str, var_name2: str) -> None:
        self.var_name1: str = var_name1
        self.var_name2: str = var_name2

    @staticmethod
    @override
    def msg_format() -> str:
        return _("Can't decide between '{var_name1}' and '{var_name2}' arguments")


class RequestVariableMissingError(JsonableError):
    code = ErrorCode.REQUEST_VARIABLE_MISSING
    data_fields = ["var_name"]

    def __init__(self, var_name: str) -> None:
        self.var_name: str = var_name

    @staticmethod
    @override
    def msg_format() -> str:
        return _("Missing '{var_name}' argument")


class RequestVariableConversionError(JsonableError):
    code = ErrorCode.REQUEST_VARIABLE_INVALID
    data_fields = ["var_name", "bad_value"]

    def __init__(self, var_name: str, bad_value: Any) -> None:
        self.var_name: str = var_name
        self.bad_value = bad_value

    @staticmethod
    @override
    def msg_format() -> str:
        return _("Bad value for '{var_name}': {bad_value}")


arguments_map: dict[str, list[str]] = defaultdict(list)
```

--------------------------------------------------------------------------------

---[FILE: response.py]---
Location: zulip-main/zerver/lib/response.py
Signals: Django

```python
from collections.abc import Iterator, Mapping
from typing import Any

import orjson
from django.http import HttpRequest, HttpResponse, HttpResponseNotAllowed
from typing_extensions import override

from zerver.lib.exceptions import JsonableError, UnauthorizedError


class MutableJsonResponse(HttpResponse):
    def __init__(
        self,
        data: dict[str, Any],
        *,
        content_type: str,
        status: int,
        exception: Exception | None = None,
    ) -> None:
        # Mirror the behavior of Django's TemplateResponse and pass an
        # empty string for the initial content value. Because that will
        # set _needs_serialization to False, we initialize it to True
        # after the call to super __init__.
        super().__init__("", content_type=content_type, status=status)
        self._data = data
        self._needs_serialization = True
        self.exception = exception

    def get_data(self) -> dict[str, Any]:
        """Get data for this MutableJsonResponse. Calling this method
        after the response's content has already been serialized
        will mean the next time the response's content is accessed
        it will be reserialized because the caller may have mutated
        the data."""
        self._needs_serialization = True
        return self._data

    # This always returns bytes, but in Django's HttpResponse the return
    # value can be bytes, an iterable of bytes or some other object. Any
    # is used here to encompass all of those return values.
    # See https://github.com/typeddjango/django-stubs/commit/799b41fe47cfe2e56be33eee8cfbaf89a9853a8e
    # and https://github.com/python/mypy/issues/3004.
    @override  # type: ignore[explicit-override] # https://github.com/python/mypy/issues/15900
    @property
    def content(self) -> Any:
        """Get content for the response. If the content hasn't been
        overridden by the property setter, it will be the response data
        serialized lazily to JSON."""
        if self._needs_serialization:
            # Because we don't pass a default handler, OPT_PASSTHROUGH_DATETIME
            # actually causes orjson to raise a TypeError on datetime objects. This
            # helps us avoid relying on the particular serialization used by orjson.
            self.content = orjson.dumps(
                self._data,
                option=orjson.OPT_APPEND_NEWLINE | orjson.OPT_PASSTHROUGH_DATETIME,
            )
        return super().content

    # There are two ways this might be called. The first is in the getter when
    # the response data is being serialized into JSON. The second is when it
    # is called from some other part of the code. This happens for instance in
    # the parent class constructor. In this case, the new content overrides the
    # serialized JSON.
    @content.setter
    def content(self, value: Any) -> None:
        """Set the content for the response."""
        content: object = super(MutableJsonResponse, type(self)).content
        assert isinstance(content, property)
        content.__set__(self, value)
        self._needs_serialization = False

    # The superclass HttpResponse defines an iterator that doesn't access the content
    # property, so in order to not break the implementation of the superclass with
    # our lazy content generation, we override the iterator to access `self.content`
    # through our getter.
    @override
    def __iter__(self) -> Iterator[bytes]:
        return iter([self.content])


def json_unauthorized(
    message: str | None = None, www_authenticate: str | None = None
) -> HttpResponse:
    return json_response_from_error(
        UnauthorizedError(msg=message, www_authenticate=www_authenticate)
    )


def json_method_not_allowed(methods: list[str]) -> HttpResponseNotAllowed:
    resp = HttpResponseNotAllowed(methods)
    resp.content = orjson.dumps(
        {"result": "error", "msg": "Method Not Allowed", "allowed_methods": methods}
    )
    return resp


def json_response(
    res_type: str = "success",
    msg: str = "",
    data: Mapping[str, Any] = {},
    status: int = 200,
    exception: Exception | None = None,
) -> MutableJsonResponse:
    content = {"result": res_type, "msg": msg}
    content.update(data)

    return MutableJsonResponse(
        data=content,
        content_type="application/json",
        status=status,
        exception=exception,
    )


def json_success(request: HttpRequest, data: Mapping[str, Any] = {}) -> MutableJsonResponse:
    return json_response(data=data)


def json_response_from_error(exception: JsonableError) -> MutableJsonResponse:
    """
    This should only be needed in middleware; in app code, just raise.

    When app code raises a JsonableError, the JsonErrorHandler
    middleware takes care of transforming it into a response by
    calling this function.
    """
    response_type = "error"
    if 200 <= exception.http_status_code < 300:
        response_type = "success"
    response = json_response(
        response_type,
        msg=exception.msg,
        data=exception.data,
        status=exception.http_status_code,
        exception=exception,
    )

    for header, value in exception.extra_headers.items():
        response[header] = value

    return response


class AsynchronousResponse(HttpResponse):
    """
    This response is just a sentinel to be discarded by Tornado and replaced
    with a real response later; see zulip_finish.
    """

    status_code = 399
```

--------------------------------------------------------------------------------

````
