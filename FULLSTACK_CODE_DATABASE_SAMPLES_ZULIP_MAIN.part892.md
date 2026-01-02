---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 892
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 892 of 1290)

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

---[FILE: outgoing_webhook.py]---
Location: zulip-main/zerver/lib/outgoing_webhook.py
Signals: Django

```python
import abc
import json
import logging
from contextlib import suppress
from time import perf_counter
from typing import Any, AnyStr

import requests
from django.conf import settings
from django.utils.translation import gettext as _
from requests import Response
from typing_extensions import override

from version import ZULIP_VERSION
from zerver.actions.message_send import check_send_message
from zerver.lib.exceptions import JsonableError, StreamDoesNotExistError
from zerver.lib.message_cache import MessageDict
from zerver.lib.outgoing_http import OutgoingSession
from zerver.lib.queue import retry_event
from zerver.lib.topic import get_topic_from_message_info
from zerver.lib.url_encoding import message_link_url
from zerver.lib.users import check_can_access_user, check_user_can_access_all_users
from zerver.models import Realm, Service, UserProfile
from zerver.models.bots import GENERIC_INTERFACE, SLACK_INTERFACE
from zerver.models.clients import get_client
from zerver.models.users import get_user_profile_by_id


class OutgoingWebhookServiceInterface(abc.ABC):
    def __init__(self, token: str, user_profile: UserProfile, service_name: str) -> None:
        self.token: str = token
        self.user_profile: UserProfile = user_profile
        self.service_name: str = service_name
        self.session: requests.Session = OutgoingSession(
            role="webhook",
            timeout=settings.OUTGOING_WEBHOOK_TIMEOUT_SECONDS,
            headers={"User-Agent": "ZulipOutgoingWebhook/" + ZULIP_VERSION},
        )

    @abc.abstractmethod
    def make_request(self, base_url: str, event: dict[str, Any], realm: Realm) -> Response | None:
        raise NotImplementedError

    @abc.abstractmethod
    def process_success(self, response_json: dict[str, Any]) -> dict[str, Any] | None:
        raise NotImplementedError


class GenericOutgoingWebhookService(OutgoingWebhookServiceInterface):
    @override
    def make_request(self, base_url: str, event: dict[str, Any], realm: Realm) -> Response | None:
        """
        We send a simple version of the message to outgoing
        webhooks, since most of them really only need
        `content` and a few other fields.  We may eventually
        allow certain bots to get more information, but
        that's not a high priority.  We do send the gravatar
        info to the clients (so they don't have to compute
        it themselves).
        """
        message_dict = MessageDict.finalize_payload(
            event["message"],
            apply_markdown=False,
            client_gravatar=False,
            allow_empty_topic_name=True,
            keep_rendered_content=True,
            can_access_sender=check_user_can_access_all_users(self.user_profile)
            or check_can_access_user(
                get_user_profile_by_id(event["message"]["sender_id"]), self.user_profile
            ),
            realm_host=realm.host,
            is_incoming_1_to_1=event["message"]["recipient_id"] == self.user_profile.recipient_id,
        )

        request_data = {
            "data": event["command"],
            "message": message_dict,
            "bot_email": self.user_profile.email,
            "bot_full_name": self.user_profile.full_name,
            "token": self.token,
            "trigger": event["trigger"],
        }

        return self.session.post(base_url, json=request_data)

    @override
    def process_success(self, response_json: dict[str, Any]) -> dict[str, Any] | None:
        if response_json.get("response_not_required", False):
            return None

        if "response_string" in response_json:
            # We are deprecating response_string.
            content = str(response_json["response_string"])
            success_data = dict(content=content)
            return success_data

        if "content" in response_json:
            content = str(response_json["content"])
            success_data = dict(content=content)
            if "widget_content" in response_json:
                success_data["widget_content"] = response_json["widget_content"]
            return success_data

        return None


class SlackOutgoingWebhookService(OutgoingWebhookServiceInterface):
    @override
    def make_request(self, base_url: str, event: dict[str, Any], realm: Realm) -> Response | None:
        if event["message"]["type"] == "private":
            failure_message = "Slack outgoing webhooks don't support direct messages."
            fail_with_message(event, failure_message)
            return None

        # https://api.slack.com/legacy/custom-integrations/outgoing-webhooks#legacy-info__post-data
        # documents the Slack outgoing webhook format:
        #
        # token=XXXXXXXXXXXXXXXXXX
        # team_id=T0001
        # team_domain=example
        # channel_id=C2147483705
        # channel_name=test
        # thread_ts=1504640714.003543
        # timestamp=1504640775.000005
        # user_id=U2147483697
        # user_name=Steve
        # text=googlebot: What is the air-speed velocity of an unladen swallow?
        # trigger_word=googlebot:

        request_data = [
            ("token", self.token),
            ("team_id", f"T{realm.id}"),
            ("team_domain", realm.host),
            ("channel_id", f"C{event['message']['stream_id']}"),
            ("channel_name", event["message"]["display_recipient"]),
            ("thread_ts", event["message"]["timestamp"]),
            ("timestamp", event["message"]["timestamp"]),
            ("user_id", f"U{event['message']['sender_id']}"),
            ("user_name", event["message"]["sender_full_name"]),
            ("text", event["command"]),
            ("trigger_word", event["trigger"]),
            ("service_id", event["user_profile_id"]),
        ]
        return self.session.post(base_url, data=request_data)

    @override
    def process_success(self, response_json: dict[str, Any]) -> dict[str, Any] | None:
        if "text" in response_json:
            content = response_json["text"]
            success_data = dict(content=content)
            return success_data

        return None


AVAILABLE_OUTGOING_WEBHOOK_INTERFACES: dict[str, Any] = {
    GENERIC_INTERFACE: GenericOutgoingWebhookService,
    SLACK_INTERFACE: SlackOutgoingWebhookService,
}


def get_service_interface_class(interface: str) -> Any:
    if interface not in AVAILABLE_OUTGOING_WEBHOOK_INTERFACES:
        return AVAILABLE_OUTGOING_WEBHOOK_INTERFACES[GENERIC_INTERFACE]
    else:
        return AVAILABLE_OUTGOING_WEBHOOK_INTERFACES[interface]


def get_outgoing_webhook_service_handler(service: Service) -> Any:
    service_interface_class = get_service_interface_class(service.interface_name())
    service_interface = service_interface_class(
        token=service.token, user_profile=service.user_profile, service_name=service.name
    )
    return service_interface


def send_response_message(
    bot_id: int, message_info: dict[str, Any], response_data: dict[str, Any]
) -> None:
    """
    bot_id is the user_id of the bot sending the response

    message_info is used to address the message and should have these fields:
        type - "stream" or "private"
        display_recipient - like we have in other message events
        topic - see get_topic_from_message_info

    response_data is what the bot wants to send back and has these fields:
        content - raw Markdown content for Zulip to render

    WARNING: This function sends messages bypassing the stream access check
    for the bot - so use with caution to not call this in codepaths
    that might let someone send arbitrary messages to any stream through this.
    """

    recipient_type_name = message_info["type"]
    display_recipient = message_info["display_recipient"]
    try:
        topic_name: str | None = get_topic_from_message_info(message_info)
    except KeyError:
        topic_name = None

    bot_user = get_user_profile_by_id(bot_id)
    realm = bot_user.realm
    client = get_client("OutgoingWebhookResponse")

    content = response_data.get("content")
    assert content

    widget_content = response_data.get("widget_content")

    if recipient_type_name == "stream":
        message_to = [display_recipient]
    elif recipient_type_name == "private":
        message_to = [recipient["email"] for recipient in display_recipient]
    else:
        raise JsonableError(_("Invalid message type"))

    check_send_message(
        sender=bot_user,
        client=client,
        recipient_type_name=recipient_type_name,
        message_to=message_to,
        topic_name=topic_name,
        message_content=content,
        widget_content=widget_content,
        realm=realm,
        skip_stream_access_check=True,
    )


def fail_with_message(event: dict[str, Any], failure_message: str) -> None:
    bot_id = event["user_profile_id"]
    message_info = event["message"]
    content = "Failure! " + failure_message
    response_data = dict(content=content)
    # If the stream has vanished while we were failing, there's no
    # reasonable place to report the error.
    with suppress(StreamDoesNotExistError):
        send_response_message(bot_id=bot_id, message_info=message_info, response_data=response_data)


def get_message_url(event: dict[str, Any]) -> str:
    bot_user = get_user_profile_by_id(event["user_profile_id"])
    message = event["message"]
    realm = bot_user.realm

    return message_link_url(
        realm=realm,
        message=message,
    )


def notify_bot_owner(
    event: dict[str, Any],
    status_code: int | None = None,
    response_content: AnyStr | None = None,
    failure_message: str | None = None,
    exception: Exception | None = None,
) -> None:
    message_url = get_message_url(event)
    bot_id = event["user_profile_id"]
    bot = get_user_profile_by_id(bot_id)
    bot_owner = bot.bot_owner
    assert bot_owner is not None

    notification_message = f"[A message]({message_url}) to your bot @_**{bot.full_name}** triggered an outgoing webhook."
    if exception:
        notification_message += (
            "\nWhen trying to send a request to the webhook service, an exception "
            f"of type {type(exception).__name__} occurred:\n```\n{exception}\n```"
        )
    elif failure_message:
        notification_message += "\n" + failure_message
    elif status_code == 407:
        notification_message += (
            "\nThe URL configured for the webhook is for a private or disallowed network."
        )
    elif status_code:
        notification_message += f"\nThe webhook got a response with status code *{status_code}*."

    if response_content:
        notification_message += (
            f"\nThe response contains the following payload:\n```\n{response_content!r}\n```"
        )

    message_info = dict(
        type="private",
        display_recipient=[dict(email=bot_owner.email)],
    )
    response_data = dict(content=notification_message)
    send_response_message(bot_id=bot_id, message_info=message_info, response_data=response_data)


def request_retry(event: dict[str, Any], failure_message: str | None = None) -> None:
    def failure_processor(event: dict[str, Any]) -> None:
        """
        The name of the argument is 'event' on purpose. This argument will hide
        the 'event' argument of the request_retry function. Keeping the same name
        results in a smaller diff.
        """
        bot_user = get_user_profile_by_id(event["user_profile_id"])
        fail_with_message(event, "Bot is unavailable")
        notify_bot_owner(event, failure_message=failure_message)
        logging.warning(
            "Maximum retries exceeded for trigger:%s event:%s",
            bot_user.email,
            event["command"],
        )

    retry_event("outgoing_webhooks", event, failure_processor)


def process_success_response(
    event: dict[str, Any], service_handler: Any, response: Response
) -> None:
    try:
        response_json = json.loads(response.text)
    except json.JSONDecodeError:
        raise JsonableError(_("Invalid JSON in response"))

    if response_json == "":
        # Versions of zulip_botserver before 2021-05 used
        # json.dumps("") as their "no response required" success
        # response; handle that for backwards-compatibility.
        return

    if not isinstance(response_json, dict):
        raise JsonableError(_("Invalid response format"))

    success_data = service_handler.process_success(response_json)

    if success_data is None:
        return

    content = success_data.get("content")

    if content is None or content.strip() == "":
        return

    widget_content = success_data.get("widget_content")
    bot_id = event["user_profile_id"]
    message_info = event["message"]
    response_data = dict(content=content, widget_content=widget_content)
    send_response_message(bot_id=bot_id, message_info=message_info, response_data=response_data)


def do_rest_call(
    base_url: str,
    event: dict[str, Any],
    service_handler: OutgoingWebhookServiceInterface,
) -> Response | None:
    """Returns response of call if no exception occurs."""
    try:
        start_time = perf_counter()
        bot_profile = service_handler.user_profile
        response = service_handler.make_request(
            base_url,
            event,
            bot_profile.realm,
        )
        logging.info(
            "Outgoing webhook request from %s@%s took %f seconds",
            bot_profile.id,
            bot_profile.realm.string_id,
            perf_counter() - start_time,
        )
        if response is None:
            return None
        if str(response.status_code).startswith("2"):
            try:
                process_success_response(event, service_handler, response)
            except JsonableError as e:
                response_message = e.msg
                logging.info("Outhook trigger failed:", stack_info=True)
                fail_with_message(event, response_message)
                response_message = f"The outgoing webhook server attempted to send a message in Zulip, but that request resulted in the following error:\n> {e}"
                notify_bot_owner(
                    event, response_content=response.text, failure_message=response_message
                )
                return None
        else:
            logging.warning(
                "Message %(message_url)s triggered an outgoing webhook, returning status "
                'code %(status_code)s.\n Content of response (in quotes): "'
                '%(response)s"',
                {
                    "message_url": get_message_url(event),
                    "status_code": response.status_code,
                    "response": response.text,
                },
            )
            failure_message = f"Third party responded with {response.status_code}"
            fail_with_message(event, failure_message)
            notify_bot_owner(event, response.status_code, response.content)
        return response
    except requests.exceptions.Timeout:
        logging.info(
            "Trigger event %s on %s timed out. Retrying",
            event["command"],
            event["service_name"],
        )
        failure_message = (
            f"Request timed out after {settings.OUTGOING_WEBHOOK_TIMEOUT_SECONDS} seconds."
        )
        request_retry(event, failure_message=failure_message)
        return None

    except (requests.exceptions.ConnectionError, requests.exceptions.ChunkedEncodingError):
        logging.info(
            "Trigger event %s on %s resulted in a connection error. Retrying",
            event["command"],
            event["service_name"],
        )
        failure_message = "A connection error occurred. Is my bot server down?"
        request_retry(event, failure_message=failure_message)
        return None

    except requests.exceptions.RequestException as e:
        response_message = (
            f"An exception of type *{type(e).__name__}* occurred for message `{event['command']}`! "
            "See the Zulip server logs for more information."
        )
        logging.exception("Outhook trigger failed:", stack_info=True)
        fail_with_message(event, response_message)
        notify_bot_owner(event, exception=e)
        return None
```

--------------------------------------------------------------------------------

---[FILE: parallel.py]---
Location: zulip-main/zerver/lib/parallel.py
Signals: Django

```python
import logging
from collections.abc import Callable, Iterable, Iterator
from concurrent.futures import BrokenExecutor, Future, ProcessPoolExecutor
from contextlib import contextmanager
from multiprocessing import current_process
from typing import Any, TypeVar

import bmemcached
from django.conf import settings
from django.core.cache import cache
from django.db import connection

from zerver.lib.partial import partial
from zerver.lib.queue import get_queue_client

ParallelRecordType = TypeVar("ParallelRecordType")


def _disconnect() -> None:
    # Close our database, cache, and RabbitMQ connections, so our
    # forked children do not share them.  Django will transparently
    # re-open them as needed.
    connection.close()
    _cache = cache._cache  # type: ignore[attr-defined] # not in stubs
    if isinstance(_cache, bmemcached.Client):  # nocoverage
        # In tests, this is an OrderedDict
        _cache.disconnect_all()

    if settings.USING_RABBITMQ:  # nocoverage
        rabbitmq_client = get_queue_client()
        if rabbitmq_client.connection and rabbitmq_client.connection.is_open:
            rabbitmq_client.close()


def func_with_catch(func: Callable[[ParallelRecordType], None], item: ParallelRecordType) -> None:
    try:
        return func(item)
    except Exception:
        logging.exception("Error processing item: %s", item)


def run_parallel(
    func: Callable[[ParallelRecordType], None],
    records: Iterable[ParallelRecordType],
    processes: int,
    *,
    initializer: Callable[..., None] | None = None,
    initargs: tuple[Any, ...] = tuple(),
    catch: bool = False,
    report_every: int = 1000,
    report: Callable[[int], None] | None = None,
) -> None:
    with run_parallel_queue(
        func,
        processes,
        initializer=initializer,
        initargs=initargs,
        catch=catch,
        report_every=report_every,
        report=report,
    ) as submit:
        for record in records:
            submit(record)


@contextmanager
def run_parallel_queue(
    func: Callable[[ParallelRecordType], None],
    processes: int,
    *,
    initializer: Callable[..., None] | None = None,
    initargs: tuple[Any, ...] = tuple(),
    catch: bool = False,
    report_every: int = 1000,
    report: Callable[[int], None] | None = None,
) -> Iterator[Callable[[ParallelRecordType], None]]:
    assert processes > 0
    if settings.TEST_SUITE and current_process().daemon:  # nocoverage
        assert processes == 1, "Only one process possible under parallel tests"

    wrapped_func = partial(func_with_catch, func) if catch else func

    completed = 0
    if processes == 1:

        def func_with_notify(item: ParallelRecordType) -> None:
            wrapped_func(item)
            nonlocal completed
            completed += 1
            if report is not None and completed % report_every == 0:
                report(completed)

        if initializer is not None:
            initializer(*initargs)
        yield func_with_notify
        return

    else:  # nocoverage
        _disconnect()

        exceptions = []
        try:
            with ProcessPoolExecutor(
                max_workers=processes, initializer=initializer, initargs=initargs
            ) as executor:

                def report_callback(future: Future[None]) -> None:
                    if exc := future.exception():
                        exceptions.append(exc)
                        return

                    nonlocal completed
                    completed += 1
                    if report is not None and completed % report_every == 0:
                        report(completed)

                def future_with_notify(item: ParallelRecordType) -> None:
                    if exceptions:
                        executor.shutdown(cancel_futures=True)
                        raise BrokenExecutor
                    future = executor.submit(wrapped_func, item)
                    future.add_done_callback(report_callback)

                yield future_with_notify
        finally:
            if exceptions:
                raise exceptions[0]
```

--------------------------------------------------------------------------------

---[FILE: partial.py]---
Location: zulip-main/zerver/lib/partial.py

```python
# Workaround for missing functools.partial support in mypy
# (https://github.com/python/mypy/issues/1484).

from collections.abc import Callable
from typing import TYPE_CHECKING, TypeVar, overload

if TYPE_CHECKING:
    from typing import Concatenate

    from typing_extensions import ParamSpec

    P = ParamSpec("P")
    T1 = TypeVar("T1")
    T2 = TypeVar("T2")
    T3 = TypeVar("T3")
    T4 = TypeVar("T4")
    R = TypeVar("R")

    @overload
    def partial(func: Callable[P, R], /) -> Callable[P, R]: ...
    @overload
    def partial(func: Callable[Concatenate[T1, P], R], arg1: T1, /) -> Callable[P, R]: ...
    @overload
    def partial(
        func: Callable[Concatenate[T1, T2, P], R], arg1: T1, arg2: T2, /
    ) -> Callable[P, R]: ...
    @overload
    def partial(
        func: Callable[Concatenate[T1, T2, T3, P], R], arg1: T1, arg2: T2, arg3: T3, /
    ) -> Callable[P, R]: ...
    @overload
    def partial(
        func: Callable[Concatenate[T1, T2, T3, T4, P], R], arg1: T1, arg2: T2, arg3: T3, arg4: T4, /
    ) -> Callable[P, R]: ...

    def partial(func: Callable[..., R], /, *args: object) -> Callable[..., R]: ...

else:
    from functools import partial as partial
```

--------------------------------------------------------------------------------

---[FILE: per_request_cache.py]---
Location: zulip-main/zerver/lib/per_request_cache.py

```python
from collections.abc import Callable
from typing import Any, TypeVar

ReturnT = TypeVar("ReturnT")

FUNCTION_NAME_TO_PER_REQUEST_RESULT: dict[str, dict[int, Any]] = {}


def return_same_value_during_entire_request(f: Callable[..., ReturnT]) -> Callable[..., ReturnT]:
    cache_key = f.__name__

    assert cache_key not in FUNCTION_NAME_TO_PER_REQUEST_RESULT
    FUNCTION_NAME_TO_PER_REQUEST_RESULT[cache_key] = {}

    def wrapper(key: int, *args: Any) -> ReturnT:
        if key in FUNCTION_NAME_TO_PER_REQUEST_RESULT[cache_key]:
            return FUNCTION_NAME_TO_PER_REQUEST_RESULT[cache_key][key]

        result = f(key, *args)
        FUNCTION_NAME_TO_PER_REQUEST_RESULT[cache_key][key] = result
        return result

    return wrapper


def flush_per_request_cache(cache_key: str) -> None:
    if cache_key in FUNCTION_NAME_TO_PER_REQUEST_RESULT:
        FUNCTION_NAME_TO_PER_REQUEST_RESULT[cache_key] = {}


def flush_per_request_caches() -> None:
    for cache_key in FUNCTION_NAME_TO_PER_REQUEST_RESULT:
        FUNCTION_NAME_TO_PER_REQUEST_RESULT[cache_key] = {}
```

--------------------------------------------------------------------------------

---[FILE: presence.py]---
Location: zulip-main/zerver/lib/presence.py
Signals: Django

```python
import time
from collections import defaultdict
from collections.abc import Mapping, Sequence
from datetime import datetime, timedelta
from typing import Any

from django.conf import settings
from django.utils.timezone import now as timezone_now

from zerver.lib.timestamp import datetime_to_timestamp
from zerver.lib.users import check_user_can_access_all_users, get_accessible_user_ids
from zerver.models import Realm, UserPresence, UserProfile


def get_presence_dicts_for_rows(
    all_rows: Sequence[Mapping[str, Any]], slim_presence: bool
) -> dict[str, dict[str, Any]]:
    # This function takes the presence data fetched from the database and
    # turn it into an appropriate format for the API to return to clients.
    # Used by the two endpoints that conduct realm-wide presence fetch:
    # 1) `POST /users/me/presence`: https://zulip.com/api/update-presenc
    # 2) `POST /register` when presence data is requested:
    #    https://zulip.com/api/register-queue
    # TODO: For consistency, we likely also should be using this for formatting
    # presence data for https://zulip.com/api/get-user-presence
    if slim_presence:
        # Stringify user_id here, since it's gonna be turned
        # into a string anyway by JSON, and it keeps mypy happy.
        get_user_key = lambda row: str(row["user_profile_id"])
        get_user_presence_info = get_modern_user_presence_info
    else:
        get_user_key = lambda row: row["user_profile__email"]
        get_user_presence_info = get_legacy_user_presence_info

    user_statuses: dict[str, dict[str, Any]] = {}

    for presence_row in all_rows:
        user_key = get_user_key(presence_row)

        last_active_time = user_presence_datetime_with_date_joined_default(
            presence_row["last_active_time"], presence_row["user_profile__date_joined"]
        )
        last_connected_time = user_presence_datetime_with_date_joined_default(
            presence_row["last_connected_time"], presence_row["user_profile__date_joined"]
        )

        info = get_user_presence_info(
            last_active_time,
            last_connected_time,
        )
        user_statuses[user_key] = info

    return user_statuses


def user_presence_datetime_with_date_joined_default(
    dt: datetime | None, date_joined: datetime
) -> datetime:
    """
    Our data models support UserPresence objects not having None
    values for last_active_time/last_connected_time. The legacy API
    however has always sent timestamps, so for backward
    compatibility we cannot send such values through the API and need
    to default to a sane

    This helper functions expects to take a last_active_time or
    last_connected_time value and the date_joined of the user, which
    will serve as the default value if the first argument is None.
    """
    if dt is None:
        return date_joined

    return dt


def get_modern_user_presence_info(
    last_active_time: datetime, last_connected_time: datetime
) -> dict[str, Any]:
    # TODO: Do further bandwidth optimizations to this structure.
    result = {}
    result["active_timestamp"] = datetime_to_timestamp(last_active_time)
    result["idle_timestamp"] = datetime_to_timestamp(last_connected_time)
    return result


def get_legacy_user_presence_info(
    last_active_time: datetime, last_connected_time: datetime
) -> dict[str, Any]:
    """
    Reformats the modern UserPresence data structure so that legacy
    API clients can still access presence data.
    We expect this code to remain mostly unchanged until we can delete it.
    """

    # Now we put things together in the legacy presence format with
    # one client + an `aggregated` field.
    #
    # TODO: Look at whether we can drop to just the "aggregated" field
    # if no clients look at the rest.
    most_recent_info = format_legacy_presence_dict(last_active_time, last_connected_time)

    result = {}

    # The word "aggregated" here is possibly misleading.
    # It's really just the most recent client's info.
    result["aggregated"] = dict(
        client=most_recent_info["client"],
        status=most_recent_info["status"],
        timestamp=most_recent_info["timestamp"],
    )

    result["website"] = most_recent_info

    return result


def format_legacy_presence_dict(
    last_active_time: datetime, last_connected_time: datetime
) -> dict[str, Any]:
    """
    This function assumes it's being called right after the presence object was updated,
    and is not meant to be used on old presence data.
    """
    if (
        last_active_time
        + timedelta(seconds=settings.PRESENCE_LEGACY_EVENT_OFFSET_FOR_ACTIVITY_SECONDS)
        >= last_connected_time
    ):
        status = UserPresence.LEGACY_STATUS_ACTIVE
        timestamp = datetime_to_timestamp(last_active_time)
    else:
        status = UserPresence.LEGACY_STATUS_IDLE
        timestamp = datetime_to_timestamp(last_connected_time)

    # This field was never used by clients of the legacy API, so we
    # just set it to a fixed value for API format compatibility.
    pushable = False

    return dict(client="website", status=status, timestamp=timestamp, pushable=pushable)


def get_presence_for_user(
    user_profile_id: int, slim_presence: bool = False
) -> dict[str, dict[str, Any]]:
    query = UserPresence.objects.filter(user_profile_id=user_profile_id).values(
        "last_active_time",
        "last_connected_time",
        "user_profile__email",
        "user_profile_id",
        "user_profile__enable_offline_push_notifications",
        "user_profile__date_joined",
    )
    presence_rows = list(query)

    return get_presence_dicts_for_rows(presence_rows, slim_presence)


def get_presence_dict_by_realm(
    realm: Realm,
    slim_presence: bool = False,
    last_update_id_fetched_by_client: int | None = None,
    history_limit_days: int | None = None,
    requesting_user_profile: UserProfile | None = None,
) -> tuple[dict[str, dict[str, Any]], int]:
    now = timezone_now()
    if history_limit_days is not None:
        fetch_since_datetime = now - timedelta(days=history_limit_days)
    else:
        # The original behavior for this API was to return last two weeks
        # of data at most, so we preserve that when the history_limit_days
        # param is not provided.
        fetch_since_datetime = now - timedelta(days=14)

    kwargs: dict[str, object] = dict()
    if last_update_id_fetched_by_client is not None:
        kwargs["last_update_id__gt"] = last_update_id_fetched_by_client

    if last_update_id_fetched_by_client is None or last_update_id_fetched_by_client <= 0:
        # If the client already has fetched some presence data, as indicated by
        # last_update_id_fetched_by_client, then filtering by last_connected_time
        # is redundant, as it shouldn't affect the results.
        kwargs["last_connected_time__gte"] = fetch_since_datetime

    if history_limit_days != 0:
        query = UserPresence.objects.filter(
            realm_id=realm.id,
            user_profile__is_active=True,
            user_profile__is_bot=False,
            **kwargs,
        )
    else:
        # If history_limit_days is 0, the client doesn't want any presence data.
        # Explicitly return an empty QuerySet to avoid a query or races which
        # might cause a UserPresence row to get fetched if it gets updated
        # during the execution of this function.
        query = UserPresence.objects.none()

    if settings.CAN_ACCESS_ALL_USERS_GROUP_LIMITS_PRESENCE and not check_user_can_access_all_users(
        requesting_user_profile
    ):
        assert requesting_user_profile is not None
        accessible_user_ids = get_accessible_user_ids(realm, requesting_user_profile)
        query = query.filter(user_profile_id__in=accessible_user_ids)

    presence_rows = list(
        query.values(
            "last_active_time",
            "last_connected_time",
            "user_profile__email",
            "user_profile_id",
            "user_profile__enable_offline_push_notifications",
            "user_profile__date_joined",
            "last_update_id",
        )
    )
    # Get max last_update_id from the list.
    if presence_rows:
        last_update_id_fetched_by_server: int | None = max(
            row["last_update_id"] for row in presence_rows
        )
    elif last_update_id_fetched_by_client is not None:
        # If there are no results, that means that are no new updates to presence
        # since what the client has last seen. Therefore, returning the same
        # last_update_id that the client provided is correct.
        last_update_id_fetched_by_server = last_update_id_fetched_by_client
    else:
        # If the client didn't specify a last_update_id, we return -1 to indicate
        # the lack of any data fetched, while sticking to the convention of
        # returning an integer.
        last_update_id_fetched_by_server = -1

    assert last_update_id_fetched_by_server is not None
    return get_presence_dicts_for_rows(
        presence_rows, slim_presence
    ), last_update_id_fetched_by_server


def get_presences_for_realm(
    realm: Realm,
    slim_presence: bool,
    last_update_id_fetched_by_client: int | None,
    history_limit_days: int | None,
    requesting_user_profile: UserProfile,
) -> tuple[dict[str, dict[str, dict[str, Any]]], int]:
    if realm.presence_disabled:  # nocoverage
        # Return an empty dict if presence is disabled in this realm
        return defaultdict(dict), -1

    return get_presence_dict_by_realm(
        realm,
        slim_presence,
        last_update_id_fetched_by_client,
        history_limit_days,
        requesting_user_profile=requesting_user_profile,
    )


def get_presence_response(
    requesting_user_profile: UserProfile,
    slim_presence: bool,
    last_update_id_fetched_by_client: int | None = None,
    history_limit_days: int | None = None,
) -> dict[str, Any]:
    realm = requesting_user_profile.realm
    server_timestamp = time.time()
    presences, last_update_id_fetched_by_server = get_presences_for_realm(
        realm,
        slim_presence,
        last_update_id_fetched_by_client,
        history_limit_days,
        requesting_user_profile=requesting_user_profile,
    )

    response_dict = dict(
        presences=presences,
        server_timestamp=server_timestamp,
        presence_last_update_id=last_update_id_fetched_by_server,
    )

    return response_dict
```

--------------------------------------------------------------------------------

---[FILE: profile.py]---
Location: zulip-main/zerver/lib/profile.py

```python
import cProfile
from collections.abc import Callable
from functools import wraps
from typing import TypeVar

from typing_extensions import ParamSpec

ParamT = ParamSpec("ParamT")
ReturnT = TypeVar("ReturnT")


def profiled(func: Callable[ParamT, ReturnT]) -> Callable[ParamT, ReturnT]:
    """
    This decorator should obviously be used only in a dev environment.
    It works best when surrounding a function that you expect to be
    called once.  One strategy is to write a backend test and wrap the
    test case with the profiled decorator.

    You can run a single test case like this:

        # edit zerver/tests/test_external.py and place @profiled above the test case below
        ./tools/test-backend zerver.tests.test_external.RateLimitTests.test_ratelimit_decrease

    Then view the results like this:

        ./tools/show-profile-results test_ratelimit_decrease.profile

    """

    @wraps(func)
    def wrapped_func(*args: ParamT.args, **kwargs: ParamT.kwargs) -> ReturnT:
        fn = func.__name__ + ".profile"
        prof = cProfile.Profile()
        retval = prof.runcall(func, *args, **kwargs)
        prof.dump_stats(fn)
        return retval

    return wrapped_func
```

--------------------------------------------------------------------------------

````
