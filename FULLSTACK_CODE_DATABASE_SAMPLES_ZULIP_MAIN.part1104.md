---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1104
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1104 of 1290)

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
Location: zulip-main/zerver/views/reminders.py
Signals: Django, Pydantic

```python
from django.http import HttpRequest, HttpResponse
from django.utils.timezone import now as timezone_now
from pydantic import Json, NonNegativeInt

from zerver.actions.reminders import do_delete_reminder, schedule_reminder_for_message
from zerver.lib.exceptions import DeliveryTimeNotInFutureError
from zerver.lib.reminders import access_reminder
from zerver.lib.request import RequestNotes
from zerver.lib.response import json_success
from zerver.lib.timestamp import timestamp_to_datetime
from zerver.lib.typed_endpoint import PathOnly, typed_endpoint
from zerver.models import UserProfile


@typed_endpoint
def create_reminders_message_backend(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    message_id: Json[int],
    scheduled_delivery_timestamp: Json[int],
    note: str | None = None,
) -> HttpResponse:
    deliver_at = timestamp_to_datetime(scheduled_delivery_timestamp)
    if deliver_at <= timezone_now():
        raise DeliveryTimeNotInFutureError

    client = RequestNotes.get_notes(request).client
    assert client is not None

    reminder_id = schedule_reminder_for_message(
        user_profile,
        client,
        message_id,
        deliver_at,
        note=note or "",
    )
    return json_success(request, data={"reminder_id": reminder_id})


@typed_endpoint
def delete_reminder(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    reminder_id: PathOnly[NonNegativeInt],
) -> HttpResponse:
    reminder = access_reminder(user_profile, reminder_id)
    do_delete_reminder(user_profile, reminder)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: report.py]---
Location: zulip-main/zerver/views/report.py
Signals: Django

```python
# System documented in https://zulip.readthedocs.io/en/latest/subsystems/logging.html
import logging

from django.http import HttpRequest, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import JsonBodyPayload, typed_endpoint
from zerver.lib.validator import WildValue, check_string


@csrf_exempt
@require_POST
@typed_endpoint
def report_csp_violations(
    request: HttpRequest, *, csp_report: JsonBodyPayload[WildValue]
) -> HttpResponse:
    def get_attr(csp_report_attr: str) -> str:
        return csp_report.get(csp_report_attr, "").tame(check_string)

    logging.warning(
        "CSP violation in document('%s'). "
        "blocked URI('%s'), original policy('%s'), "
        "violated directive('%s'), effective directive('%s'), "
        "disposition('%s'), referrer('%s'), "
        "status code('%s'), script sample('%s')",
        get_attr("document-uri"),
        get_attr("blocked-uri"),
        get_attr("original-policy"),
        get_attr("violated-directive"),
        get_attr("effective-directive"),
        get_attr("disposition"),
        get_attr("referrer"),
        get_attr("status-code"),
        get_attr("script-sample"),
    )

    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: saved_snippets.py]---
Location: zulip-main/zerver/views/saved_snippets.py
Signals: Django, Pydantic

```python
from typing import Annotated

from django.conf import settings
from django.http import HttpRequest, HttpResponse
from pydantic import StringConstraints

from zerver.actions.saved_snippets import (
    do_create_saved_snippet,
    do_delete_saved_snippet,
    do_edit_saved_snippet,
    do_get_saved_snippets,
)
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import PathOnly, typed_endpoint
from zerver.models import SavedSnippet, UserProfile


def get_saved_snippets(
    request: HttpRequest,
    user_profile: UserProfile,
) -> HttpResponse:
    return json_success(request, data={"saved_snippets": do_get_saved_snippets(user_profile)})


@typed_endpoint
def create_saved_snippet(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    content: Annotated[
        str,
        StringConstraints(
            min_length=1, max_length=settings.MAX_MESSAGE_LENGTH, strip_whitespace=True
        ),
    ],
    title: Annotated[
        str,
        StringConstraints(
            min_length=1, max_length=SavedSnippet.MAX_TITLE_LENGTH, strip_whitespace=True
        ),
    ],
) -> HttpResponse:
    title = title.strip()
    content = content.strip()
    saved_snippet = do_create_saved_snippet(title, content, user_profile)
    return json_success(request, data={"saved_snippet_id": saved_snippet.id})


@typed_endpoint
def edit_saved_snippet(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    content: Annotated[
        str | None,
        StringConstraints(
            min_length=1, max_length=settings.MAX_MESSAGE_LENGTH, strip_whitespace=True
        ),
    ] = None,
    saved_snippet_id: PathOnly[int],
    title: Annotated[
        str | None,
        StringConstraints(
            min_length=1, max_length=SavedSnippet.MAX_TITLE_LENGTH, strip_whitespace=True
        ),
    ] = None,
) -> HttpResponse:
    if title is None and content is None:
        # No changes are requested; exit early to avoid sending a
        # spurious event to clients.
        return json_success(request)

    do_edit_saved_snippet(saved_snippet_id, title, content, user_profile)
    return json_success(request)


def delete_saved_snippet(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    saved_snippet_id: int,
) -> HttpResponse:
    do_delete_saved_snippet(saved_snippet_id, user_profile)
    return json_success(request)
```

--------------------------------------------------------------------------------

---[FILE: scheduled_messages.py]---
Location: zulip-main/zerver/views/scheduled_messages.py
Signals: Django, Pydantic

```python
from typing import Annotated

from django.http import HttpRequest, HttpResponse
from django.utils.timezone import now as timezone_now
from django.utils.translation import gettext as _
from pydantic import Json, NonNegativeInt

from zerver.actions.scheduled_messages import (
    check_schedule_message,
    delete_scheduled_message,
    edit_scheduled_message,
)
from zerver.lib.exceptions import DeliveryTimeNotInFutureError, JsonableError
from zerver.lib.recipient_parsing import extract_direct_message_recipient_ids, extract_stream_id
from zerver.lib.request import RequestNotes
from zerver.lib.response import json_success
from zerver.lib.scheduled_messages import (
    get_undelivered_reminders,
    get_undelivered_scheduled_messages,
)
from zerver.lib.timestamp import timestamp_to_datetime
from zerver.lib.typed_endpoint import (
    ApiParamConfig,
    OptionalTopic,
    PathOnly,
    typed_endpoint,
    typed_endpoint_without_parameters,
)
from zerver.lib.typed_endpoint_validators import check_string_in_validator
from zerver.models import Message, UserProfile


@typed_endpoint_without_parameters
def fetch_scheduled_messages(request: HttpRequest, user_profile: UserProfile) -> HttpResponse:
    return json_success(
        request, data={"scheduled_messages": get_undelivered_scheduled_messages(user_profile)}
    )


@typed_endpoint_without_parameters
def fetch_reminders(request: HttpRequest, user_profile: UserProfile) -> HttpResponse:
    return json_success(request, data={"reminders": get_undelivered_reminders(user_profile)})


@typed_endpoint
def delete_scheduled_messages(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    scheduled_message_id: PathOnly[NonNegativeInt],
) -> HttpResponse:
    delete_scheduled_message(user_profile, scheduled_message_id)
    return json_success(request)


@typed_endpoint
def update_scheduled_message_backend(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    message_content: Annotated[str | None, ApiParamConfig("content")] = None,
    req_type: Annotated[
        Annotated[str, check_string_in_validator(Message.API_RECIPIENT_TYPES)] | None,
        ApiParamConfig("type"),
    ] = None,
    scheduled_delivery_timestamp: Json[int] | None = None,
    scheduled_message_id: PathOnly[NonNegativeInt],
    to: Json[int | list[int]] | None = None,
    topic_name: OptionalTopic = None,
) -> HttpResponse:
    if (
        req_type is None
        and to is None
        and topic_name is None
        and message_content is None
        and scheduled_delivery_timestamp is None
    ):
        raise JsonableError(_("Nothing to change"))

    recipient_type_name = None
    if req_type:
        if to is None:
            raise JsonableError(_("Recipient required when updating type of scheduled message."))
        else:
            recipient_type_name = req_type

    if recipient_type_name is not None and recipient_type_name == "channel":
        # For now, use "stream" from Message.API_RECIPIENT_TYPES.
        # TODO: Use "channel" here, as well as in events and
        # message (created, schdeduled, drafts) objects/dicts.
        recipient_type_name = "stream"

    if recipient_type_name is not None and recipient_type_name == "stream" and topic_name is None:
        raise JsonableError(_("Topic required when updating scheduled message type to channel."))

    if recipient_type_name is not None and recipient_type_name == "direct":
        # For now, use "private" from Message.API_RECIPIENT_TYPES.
        # TODO: Use "direct" here, as well as in events and
        # scheduled message objects/dicts.
        recipient_type_name = "private"

    message_to = None
    if to is not None:
        # Because the recipient_type_name may not be updated/changed,
        # we extract these updated recipient IDs in edit_scheduled_message.
        message_to = to

    deliver_at = None
    if scheduled_delivery_timestamp is not None:
        deliver_at = timestamp_to_datetime(scheduled_delivery_timestamp)
        if deliver_at <= timezone_now():
            raise DeliveryTimeNotInFutureError

    sender = user_profile
    client = RequestNotes.get_notes(request).client
    assert client is not None

    edit_scheduled_message(
        sender,
        client,
        scheduled_message_id,
        recipient_type_name,
        message_to,
        topic_name,
        message_content,
        deliver_at,
        realm=user_profile.realm,
    )

    return json_success(request)


@typed_endpoint
def create_scheduled_message_backend(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    message_content: Annotated[str, ApiParamConfig("content")],
    read_by_sender: Json[bool] | None = None,
    req_to: Annotated[Json[int | list[int]], ApiParamConfig("to")],
    req_type: Annotated[
        Annotated[str, check_string_in_validator(Message.API_RECIPIENT_TYPES)],
        ApiParamConfig("type"),
    ],
    scheduled_delivery_timestamp: Json[int],
    topic_name: OptionalTopic = None,
) -> HttpResponse:
    recipient_type_name = req_type
    if recipient_type_name == "direct":
        # For now, use "private" from Message.API_RECIPIENT_TYPES.
        # TODO: Use "direct" here, as well as in events and
        # scheduled message objects/dicts.
        recipient_type_name = "private"
    elif recipient_type_name == "channel":
        # For now, use "stream" from Message.API_RECIPIENT_TYPES.
        # TODO: Use "channel" here, as well as in events and
        # message (created, schdeduled, drafts) objects/dicts.
        recipient_type_name = "stream"

    deliver_at = timestamp_to_datetime(scheduled_delivery_timestamp)
    if deliver_at <= timezone_now():
        raise DeliveryTimeNotInFutureError

    sender = user_profile
    client = RequestNotes.get_notes(request).client
    assert client is not None

    if recipient_type_name == "stream":
        stream_id = extract_stream_id(req_to)
        message_to = [stream_id]
    else:
        message_to = extract_direct_message_recipient_ids(req_to)

    scheduled_message_id = check_schedule_message(
        sender,
        client,
        recipient_type_name,
        message_to,
        topic_name,
        message_content,
        deliver_at,
        realm=user_profile.realm,
        read_by_sender=read_by_sender,
    )
    return json_success(request, data={"scheduled_message_id": scheduled_message_id})
```

--------------------------------------------------------------------------------

---[FILE: sentry.py]---
Location: zulip-main/zerver/views/sentry.py
Signals: Django

```python
import logging
from contextlib import suppress
from urllib.parse import urlsplit

import orjson
from circuitbreaker import CircuitBreakerError, circuit
from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _
from django.views.decorators.csrf import csrf_exempt
from requests.exceptions import HTTPError, ProxyError, RequestException, Timeout
from sentry_sdk.integrations.logging import ignore_logger

from zerver.lib.exceptions import JsonableError
from zerver.lib.outgoing_http import OutgoingSession
from zerver.lib.validator import check_url, to_wild_value

# In order to not overload Sentry if it's having a bad day, we tell
# Sentry to ignore exceptions that we have when talking to Sentry.
logger = logging.getLogger(__name__)
ignore_logger(logger.name)


class SentryTunnelSession(OutgoingSession):
    def __init__(self) -> None:
        super().__init__(role="sentry_tunnel", timeout=1)


@csrf_exempt
def sentry_tunnel(
    request: HttpRequest,
) -> HttpResponse:
    try:
        envelope_header_line, envelope_items = request.body.split(b"\n", 1)
        envelope_header = to_wild_value("envelope_header", envelope_header_line.decode("utf-8"))
        dsn = urlsplit(envelope_header["dsn"].tame(check_url))
    except Exception:
        raise JsonableError(_("Invalid request format"))

    if dsn.geturl() != settings.SENTRY_FRONTEND_DSN:
        raise JsonableError(_("Invalid DSN"))

    assert dsn.hostname
    project_id = dsn.path.strip("/")
    url = dsn._replace(netloc=dsn.hostname, path=f"/api/{project_id}/envelope/").geturl()

    # Adjust the payload to explicitly contain the IP address of the
    # user we see.  If left blank, Sentry will assume the IP it
    # received the request from, which is Zulip's, which can make
    # debugging more complicated.
    updated_body = request.body
    # If we fail to update the body for any reason, leave it as-is; it
    # is better to misreport the IP than to drop the report entirely.
    with suppress(Exception):
        # This parses the Sentry ingestion format, known as an
        # Envelope.  See https://develop.sentry.dev/sdk/envelopes/ for
        # spec.
        parts = [envelope_header_line, b"\n"]
        while envelope_items != b"":
            item_header_line, rest = envelope_items.split(b"\n", 1)
            parts.append(item_header_line)
            parts.append(b"\n")
            item_header = orjson.loads(item_header_line.decode("utf-8"))
            length = item_header.get("length")
            if length is None:
                item_body, envelope_items = [*rest.split(b"\n", 1), b""][:2]
            else:
                item_body, envelope_items = rest[0:length], rest[length:]
            if item_header.get("type") in ("transaction", "event"):
                # Event schema:
                # https://develop.sentry.dev/sdk/event-payloads/#core-interfaces
                # https://develop.sentry.dev/sdk/event-payloads/user/
                #
                # Transaction schema:
                # https://develop.sentry.dev/sdk/event-payloads/transaction/#anatomy
                # Note that "Transactions are Events enriched with Span data."
                payload_data = orjson.loads(item_body)
                if "user" in payload_data:
                    payload_data["user"]["ip_address"] = request.META.get("REMOTE_ADDR")
                    item_body = orjson.dumps(payload_data)
            parts.append(item_body)
            if length is None:
                parts.append(b"\n")
        updated_body = b"".join(parts)

    try:
        sentry_request(url, updated_body)
    except CircuitBreakerError:
        logger.warning("Dropped a client exception due to circuit-breaking")
    except RequestException as e:
        # This logger has been configured, above, to not report to Sentry
        logger.exception(e)
    return HttpResponse(status=200)


# Circuit-break and temporarily stop trying to report to
# Sentry if it keeps timing out.  We include ProxyError in
# here because we are likely making our requests through
# Smokescreen as a CONNECT proxy, so failures from Smokescreen
# failing to connect at the TCP level will report as
# ProxyErrors.
def open_circuit_for(exc_type: type[Exception], exc_value: Exception) -> bool:
    if issubclass(exc_type, ProxyError | Timeout):
        return True
    if isinstance(exc_value, HTTPError):
        response = exc_value.response
        if response.status_code == 429 or response.status_code >= 500:
            return True
    return False


# Open the circuit after 2 failures, and leave it open for 30s.
@circuit(
    failure_threshold=2,
    recovery_timeout=30,
    name="Sentry tunnel",
    expected_exception=open_circuit_for,
)
def sentry_request(url: str, data: bytes) -> None:
    SentryTunnelSession().post(
        url=url,
        data=data,
        headers={"Content-Type": "application/x-sentry-envelope"},
    ).raise_for_status()
```

--------------------------------------------------------------------------------

---[FILE: storage.py]---
Location: zulip-main/zerver/views/storage.py
Signals: Django, Pydantic

```python
from django.http import HttpRequest, HttpResponse
from pydantic import Json

from zerver.lib.bot_storage import (
    StateError,
    get_bot_storage,
    get_keys_in_bot_storage,
    remove_bot_storage,
    set_bot_storage,
)
from zerver.lib.exceptions import JsonableError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.models import UserProfile


@typed_endpoint
def update_storage(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    storage: Json[dict[str, str]],
) -> HttpResponse:
    try:
        set_bot_storage(user_profile, list(storage.items()))
    except StateError as e:  # nocoverage
        raise JsonableError(str(e))
    return json_success(request)


@typed_endpoint
def get_storage(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    keys: Json[list[str] | None] = None,
) -> HttpResponse:
    if keys is None:
        keys = get_keys_in_bot_storage(user_profile)
    try:
        storage = {key: get_bot_storage(user_profile, key) for key in keys}
    except StateError as e:
        raise JsonableError(str(e))
    return json_success(request, data={"storage": storage})


@typed_endpoint
def remove_storage(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    keys: Json[list[str] | None] = None,
) -> HttpResponse:
    if keys is None:
        keys = get_keys_in_bot_storage(user_profile)
    try:
        remove_bot_storage(user_profile, keys)
    except StateError as e:
        raise JsonableError(str(e))
    return json_success(request)
```

--------------------------------------------------------------------------------

````
