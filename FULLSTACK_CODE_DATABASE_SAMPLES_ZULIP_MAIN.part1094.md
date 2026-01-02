---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1094
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1094 of 1290)

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

---[FILE: exceptions.py]---
Location: zulip-main/zerver/tornado/exceptions.py
Signals: Django

```python
from django.utils.translation import gettext as _
from typing_extensions import override

from zerver.lib.exceptions import ErrorCode, JsonableError


class BadEventQueueIdError(JsonableError):
    code = ErrorCode.BAD_EVENT_QUEUE_ID
    data_fields = ["queue_id"]

    def __init__(self, queue_id: str) -> None:
        self.queue_id: str = queue_id

    @staticmethod
    @override
    def msg_format() -> str:
        return _("Bad event queue ID: {queue_id}")
```

--------------------------------------------------------------------------------

---[FILE: handlers.py]---
Location: zulip-main/zerver/tornado/handlers.py
Signals: Django

```python
import logging
from collections.abc import Collection
from contextlib import suppress
from typing import Any, Optional
from urllib.parse import unquote

import tornado.web
from asgiref.sync import sync_to_async
from django import http
from django.core import signals
from django.core.handlers import base
from django.core.handlers.wsgi import WSGIRequest, get_script_name
from django.http import HttpRequest, HttpResponse
from django.urls import set_script_prefix
from django.utils.cache import patch_vary_headers
from tornado.iostream import StreamClosedError
from tornado.wsgi import WSGIContainer
from typing_extensions import override

from zerver.lib.response import AsynchronousResponse, json_response
from zerver.tornado.descriptors import get_descriptor_by_handler_id

current_handler_id = 0
handlers: dict[int, "AsyncDjangoHandler"] = {}
fake_wsgi_container = WSGIContainer(lambda environ, start_response: [])


def get_handler_by_id(handler_id: int) -> Optional["AsyncDjangoHandler"]:
    return handlers.get(handler_id)


def allocate_handler_id(handler: "AsyncDjangoHandler") -> int:
    global current_handler_id
    handlers[current_handler_id] = handler
    handler_id = current_handler_id
    current_handler_id += 1
    return handler_id


def clear_handler_by_id(handler_id: int) -> None:
    handlers.pop(handler_id, None)


def handler_stats_string() -> str:
    return f"{len(handlers)} handlers, latest ID {current_handler_id}"


def finish_handler(handler_id: int, event_queue_id: str, contents: list[dict[str, Any]]) -> None:
    try:
        # We do the import during runtime to avoid cyclic dependency
        # with zerver.lib.request
        from zerver.lib.request import RequestNotes
        from zerver.middleware import async_request_timer_restart

        # The request handler may have been GC'd by a
        # on_connection_close elsewhere already, so we have to check
        # it is still around.
        handler = get_handler_by_id(handler_id)
        if handler is None:
            return
        request = handler._request
        assert request is not None

        # We call async_request_timer_restart here in case we are
        # being finished without any events (because another
        # get_events request has supplanted this request)
        async_request_timer_restart(request)
        log_data = RequestNotes.get_notes(request).log_data
        assert log_data is not None
        if len(contents) != 1:
            log_data["extra"] = f"[{event_queue_id}/1]"
        else:
            log_data["extra"] = "[{}/1/{}]".format(event_queue_id, contents[0]["type"])

        tornado.ioloop.IOLoop.current().add_callback(
            handler.zulip_finish,
            dict(result="success", msg="", events=contents, queue_id=event_queue_id),
            request,
        )
    except Exception as e:
        if not (
            (isinstance(e, OSError) and str(e) == "Stream is closed")
            or (isinstance(e, AssertionError) and str(e) == "Request closed")
        ):
            logging.exception(
                "Got error finishing handler for queue %s", event_queue_id, stack_info=True
            )


class AsyncDjangoHandler(tornado.web.RequestHandler):
    handler_id: int

    SUPPORTED_METHODS: Collection[str] = {"GET", "POST", "DELETE"}  # type: ignore[assignment]  # https://github.com/tornadoweb/tornado/pull/3354

    @override
    def initialize(self, django_handler: base.BaseHandler) -> None:
        self.django_handler = django_handler

        # Prevent Tornado from automatically finishing the request
        self._auto_finish = False

        # Handler IDs are allocated here, and the handler ID map must
        # be cleared when the handler finishes its response.  See
        # on_finish and on_connection_close.
        self.handler_id = allocate_handler_id(self)

        self._request: HttpRequest | None = None

    @override
    def on_finish(self) -> None:
        # Note that this only runs on _successful_ requests.  If the
        # client closes the connection, see on_connection_close,
        # below.
        clear_handler_by_id(self.handler_id)

    @override
    def __repr__(self) -> str:
        descriptor = get_descriptor_by_handler_id(self.handler_id)
        return f"AsyncDjangoHandler<{self.handler_id}, {descriptor}>"

    async def convert_tornado_request_to_django_request(self) -> HttpRequest:
        # This takes the WSGI environment that Tornado received (which
        # fully describes the HTTP request that was sent to Tornado)
        # and pass it to Django's WSGIRequest to generate a Django
        # HttpRequest object with the original Tornado request's HTTP
        # headers, parameters, etc.
        environ = fake_wsgi_container.environ(self.request)
        environ["PATH_INFO"] = unquote(environ["PATH_INFO"])

        # Django WSGIRequest setup code that should match logic from
        # Django's WSGIHandler.__call__ before the call to
        # `get_response()`.
        set_script_prefix(get_script_name(environ))
        await signals.request_started.asend(sender=type(self.django_handler))
        self._request = WSGIRequest(environ)

        # We do the import during runtime to avoid cyclic dependency
        from zerver.lib.request import RequestNotes

        # Provide a way for application code to access this handler
        # given the HttpRequest object.
        RequestNotes.get_notes(self._request).tornado_handler_id = self.handler_id

        return self._request

    async def write_django_response_as_tornado_response(self, response: HttpResponse) -> None:
        # This takes a Django HttpResponse and copies its HTTP status
        # code, headers, cookies, and content onto this
        # tornado.web.RequestHandler (which is how Tornado prepares a
        # response to write).

        # Copy the HTTP status code.
        self.set_status(response.status_code)

        # Copy the HTTP headers (iterating through a Django
        # HttpResponse is the way to access its headers as key/value pairs)
        for h in response.items():
            self.set_header(h[0], h[1])

        # Copy any cookies
        if not hasattr(self, "_new_cookies"):
            self._new_cookies: list[http.cookie.SimpleCookie] = []
        self._new_cookies.append(response.cookies)

        # Copy the response content
        self.write(response.content)

        # Close the connection.
        # While writing the response, we might realize that the
        # user already closed the connection; that is fine.
        with suppress(StreamClosedError):
            await self.finish()

    @override
    async def get(self, *args: Any, **kwargs: Any) -> None:
        request = await self.convert_tornado_request_to_django_request()
        response = await sync_to_async(
            lambda: self.django_handler.get_response(request), thread_sensitive=True
        )()

        try:
            if isinstance(response, AsynchronousResponse):
                # We import async_request_timer_restart during runtime
                # to avoid cyclic dependency with zerver.lib.request
                from zerver.middleware import async_request_timer_stop

                # For asynchronous requests, this is where we exit
                # without returning the HttpResponse that Django
                # generated back to the user in order to long-poll the
                # connection.  We save some timers here in order to
                # support accurate accounting of the total resources
                # consumed by the request when it eventually returns a
                # response and is logged.
                async_request_timer_stop(request)
            else:
                # For normal/synchronous requests that don't end up
                # long-polling, we just need to write the HTTP
                # response that Django prepared for us via Tornado.
                assert isinstance(response, HttpResponse)
                await self.write_django_response_as_tornado_response(response)
        finally:
            # Tell Django that we're done processing this request on
            # the Django side; this triggers cleanup work like
            # resetting the urlconf and any cache/database
            # connections.
            await sync_to_async(response.close, thread_sensitive=True)()

    @override
    async def post(self, *args: Any, **kwargs: Any) -> None:
        await self.get(*args, **kwargs)

    @override
    async def delete(self, *args: Any, **kwargs: Any) -> None:
        await self.get(*args, **kwargs)

    @override
    def on_connection_close(self) -> None:
        # Register a Tornado handler that runs when client-side
        # connections are closed to notify the events system.

        # If the client goes away, garbage collect the handler (with
        # attached request information).
        clear_handler_by_id(self.handler_id)
        client_descriptor = get_descriptor_by_handler_id(self.handler_id)
        if client_descriptor is not None:
            client_descriptor.disconnect_handler(client_closed=True)

    async def zulip_finish(self, result_dict: dict[str, Any], old_request: HttpRequest) -> None:
        # Function called when we want to break a long-polled
        # get_events request and return a response to the client.

        # Marshall the response data from result_dict.
        if result_dict["result"] == "error":
            self.set_status(400)

        # The `result` dictionary contains the data we want to return
        # to the client.  We want to do so in a proper Tornado HTTP
        # response after running the Django response middleware (which
        # does things like log the request, add rate-limit headers,
        # etc.).  The Django middleware API expects to receive a fresh
        # HttpRequest object, and so to minimize hacks, our strategy
        # is to create a duplicate Django HttpRequest object, tagged
        # to automatically return our data in its response, and call
        # Django's main self.get_response() handler to generate an
        # HttpResponse with all Django middleware run.
        request = await self.convert_tornado_request_to_django_request()

        # We import RequestNotes during runtime to avoid
        # cyclic import
        from zerver.lib.request import RequestNotes

        request_notes = RequestNotes.get_notes(request)
        old_request_notes = RequestNotes.get_notes(old_request)

        # Add to this new HttpRequest logging data from the processing of
        # the original request; we will need these for logging.
        request_notes.log_data = old_request_notes.log_data
        request_notes.ratelimits_applied += old_request_notes.ratelimits_applied
        request_notes.requester_for_logs = old_request_notes.requester_for_logs
        request.user = old_request.user
        request_notes.client = old_request_notes.client
        request_notes.client_name = old_request_notes.client_name
        request_notes.client_version = old_request_notes.client_version

        # The saved_response attribute, if present, causes
        # rest_dispatch to return the response immediately before
        # doing any work.  This arrangement allows Django's full
        # request/middleware system to run unmodified while avoiding
        # running expensive things like Zulip's authentication code a
        # second time.
        request_notes.saved_response = json_response(
            res_type=result_dict["result"], data=result_dict, status=self.get_status()
        )

        response = await sync_to_async(
            lambda: self.django_handler.get_response(request), thread_sensitive=True
        )()
        try:
            # Explicitly mark requests as varying by cookie, since the
            # middleware will not have seen a session access
            patch_vary_headers(response, ("Cookie",))
            assert isinstance(response, HttpResponse)
            await self.write_django_response_as_tornado_response(response)
        finally:
            # Tell Django we're done processing this request
            await sync_to_async(response.close, thread_sensitive=True)()
```

--------------------------------------------------------------------------------

---[FILE: ioloop_logging.py]---
Location: zulip-main/zerver/tornado/ioloop_logging.py

```python
# This is used for a somewhat hacky way of passing the port number
# into this early-initialized module.
logging_data: dict[str, str] = {}
```

--------------------------------------------------------------------------------

---[FILE: sharding.py]---
Location: zulip-main/zerver/tornado/sharding.py
Signals: Django

```python
import json
import os
import re
from re import Pattern

from django.conf import settings

from zerver.models import Realm, UserProfile

shard_map: dict[str, int | list[int]] = {}
shard_regexes: list[tuple[Pattern[str], int | list[int]]] = []
if os.path.exists("/etc/zulip/sharding.json"):
    with open("/etc/zulip/sharding.json") as f:
        data = json.loads(f.read())
        shard_map = data.get(
            "shard_map",
            data,  # backwards compatibility
        )
        shard_regexes = [
            (re.compile(regex, re.IGNORECASE), port)
            for regex, port in data.get("shard_regexes", [])
        ]


def get_realm_tornado_ports(realm: Realm) -> list[int]:
    if realm.host in shard_map:
        ports = shard_map[realm.host]
        return [ports] if isinstance(ports, int) else ports

    for regex, ports in shard_regexes:
        if regex.match(realm.host):
            return [ports] if isinstance(ports, int) else ports

    return [settings.TORNADO_PORTS[0]]


def get_user_id_tornado_port(realm_ports: list[int], user_id: int) -> int:
    return realm_ports[user_id % len(realm_ports)]


def get_user_tornado_port(user: UserProfile) -> int:
    return get_user_id_tornado_port(get_realm_tornado_ports(user.realm), user.id)


def get_tornado_url(port: int) -> str:
    return f"http://127.0.0.1:{port}"


def notify_tornado_queue_name(port: int) -> str:
    if settings.TORNADO_PROCESSES == 1:
        return "notify_tornado"
    return f"notify_tornado_port_{port}"
```

--------------------------------------------------------------------------------

---[FILE: views.py]---
Location: zulip-main/zerver/tornado/views.py
Signals: Django, Pydantic

```python
import time
from collections.abc import Callable
from typing import Annotated, Any, TypeVar

from asgiref.sync import async_to_sync
from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.utils.translation import gettext as _
from pydantic import BaseModel, Json, NonNegativeInt, StringConstraints, model_validator
from typing_extensions import ParamSpec

from zerver.decorator import internal_api_view, process_client
from zerver.lib.exceptions import JsonableError
from zerver.lib.queue import get_queue_client
from zerver.lib.request import RequestNotes
from zerver.lib.response import AsynchronousResponse, json_success
from zerver.lib.sessions import narrow_request_user
from zerver.lib.typed_endpoint import ApiParamConfig, DocumentationStatus, typed_endpoint
from zerver.models import UserProfile
from zerver.models.clients import get_client
from zerver.tornado.descriptors import is_current_port
from zerver.tornado.event_queue import (
    access_client_descriptor,
    fetch_events,
    process_notification,
    send_web_reload_client_events,
)
from zerver.tornado.sharding import get_user_tornado_port, notify_tornado_queue_name

P = ParamSpec("P")
T = TypeVar("T")


def in_tornado_thread(f: Callable[P, T]) -> Callable[P, T]:
    async def wrapped(*args: P.args, **kwargs: P.kwargs) -> T:
        return f(*args, **kwargs)

    return async_to_sync(wrapped)


@internal_api_view(True)
@typed_endpoint
def notify(request: HttpRequest, *, data: Json[dict[str, Any]]) -> HttpResponse:
    # Only the puppeteer full-stack tests use this endpoint; it
    # injects an event, as if read from RabbitMQ.
    in_tornado_thread(process_notification)(data)
    return json_success(request)


@internal_api_view(True)
@typed_endpoint
def web_reload_clients(
    request: HttpRequest,
    *,
    client_count: Json[int] | None = None,
    immediate: Json[bool] = False,
) -> HttpResponse:
    sent_events = in_tornado_thread(send_web_reload_client_events)(
        immediate=immediate, count=client_count
    )
    return json_success(
        request,
        {
            "sent_events": sent_events,
            "complete": client_count is None or client_count != sent_events,
        },
    )


@typed_endpoint
def cleanup_event_queue(
    request: HttpRequest, user_profile: UserProfile, *, queue_id: str
) -> HttpResponse:
    log_data = RequestNotes.get_notes(request).log_data
    assert log_data is not None
    log_data["extra"] = f"[{queue_id}]"

    user_port = get_user_tornado_port(user_profile)
    if not is_current_port(user_port):
        # X-Accel-Redirect is not supported for HTTP DELETE requests,
        # so we notify the shard hosting the acting user's queues via
        # enqueuing a special event.
        #
        # TODO: Because we return a 200 before confirming that the
        # event queue had been actually deleted by the process hosting
        # the queue, there's a race where a `GET /events` request can
        # succeed after getting a 200 from this endpoint.
        assert settings.USING_RABBITMQ
        get_queue_client().json_publish(
            notify_tornado_queue_name(user_port),
            {"users": [user_profile.id], "event": {"type": "cleanup_queue", "queue_id": queue_id}},
        )
        return json_success(request)

    client = access_client_descriptor(user_profile.id, queue_id)
    in_tornado_thread(client.cleanup)()
    return json_success(request)


@internal_api_view(True)
@typed_endpoint
def get_events_internal(request: HttpRequest, *, user_profile_id: Json[int]) -> HttpResponse:
    user_profile = narrow_request_user(request, user_id=user_profile_id)
    assert isinstance(user_profile, UserProfile)
    assert is_current_port(get_user_tornado_port(user_profile))

    process_client(request, user_profile, client_name="internal")
    return get_events_backend(request, user_profile)


def get_events(request: HttpRequest, user_profile: UserProfile) -> HttpResponse:
    user_port = get_user_tornado_port(user_profile)
    if not is_current_port(user_port):
        # When a single realm is split across multiple Tornado shards,
        # any `GET /events` requests that are routed to the wrong
        # shard are redirected to the shard hosting the relevant
        # user's queues. We use X-Accel-Redirect for this purpose,
        # which is efficient and keeps this redirect invisible to
        # clients.
        return HttpResponse(
            "",
            headers={"X-Accel-Redirect": f"/internal/tornado/{user_port}{request.get_full_path()}"},
        )

    return get_events_backend(request, user_profile)


class UserClient(BaseModel):
    id: int
    name: Annotated[str, StringConstraints(max_length=30)]

    @model_validator(mode="before")
    @classmethod
    def convert_term(cls, elem: str) -> dict[str, Any]:
        client = get_client(elem)
        return {"id": client.id, "name": client.name}


@typed_endpoint
def get_events_backend(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    # user_client is intended only for internal Django=>Tornado requests
    # and thus shouldn't be documented for external use.
    user_client: Annotated[
        UserClient | None,
        ApiParamConfig(documentation_status=DocumentationStatus.INTENTIONALLY_UNDOCUMENTED),
    ] = None,
    last_event_id: Json[int] | None = None,
    queue_id: str | None = None,
    # apply_markdown, client_gravatar, all_public_streams, and various
    # other parameters are only used when registering a new queue via this
    # endpoint.  This is a feature used primarily by get_events_internal
    # and not expected to be used by third-party clients.
    apply_markdown: Annotated[
        Json[bool],
        ApiParamConfig(documentation_status=DocumentationStatus.INTENTIONALLY_UNDOCUMENTED),
    ] = False,
    client_gravatar: Annotated[
        Json[bool],
        ApiParamConfig(documentation_status=DocumentationStatus.INTENTIONALLY_UNDOCUMENTED),
    ] = False,
    slim_presence: Annotated[
        Json[bool],
        ApiParamConfig(documentation_status=DocumentationStatus.INTENTIONALLY_UNDOCUMENTED),
    ] = False,
    all_public_streams: Annotated[
        Json[bool],
        ApiParamConfig(documentation_status=DocumentationStatus.INTENTIONALLY_UNDOCUMENTED),
    ] = False,
    event_types: Annotated[
        Json[list[str]] | None,
        ApiParamConfig(documentation_status=DocumentationStatus.INTENTIONALLY_UNDOCUMENTED),
    ] = None,
    dont_block: Json[bool] = False,
    narrow: Annotated[
        Json[list[list[str]]] | None,
        ApiParamConfig(documentation_status=DocumentationStatus.INTENTIONALLY_UNDOCUMENTED),
    ] = None,
    lifespan_secs: Annotated[
        Json[NonNegativeInt],
        ApiParamConfig(documentation_status=DocumentationStatus.INTENTIONALLY_UNDOCUMENTED),
    ] = 0,
    bulk_message_deletion: Annotated[
        Json[bool],
        ApiParamConfig(documentation_status=DocumentationStatus.INTENTIONALLY_UNDOCUMENTED),
    ] = False,
    stream_typing_notifications: Annotated[
        Json[bool],
        ApiParamConfig(documentation_status=DocumentationStatus.INTENTIONALLY_UNDOCUMENTED),
    ] = False,
    pronouns_field_type_supported: Annotated[
        Json[bool],
        ApiParamConfig(documentation_status=DocumentationStatus.INTENTIONALLY_UNDOCUMENTED),
    ] = True,
    linkifier_url_template: Annotated[
        Json[bool],
        ApiParamConfig(documentation_status=DocumentationStatus.INTENTIONALLY_UNDOCUMENTED),
    ] = False,
    user_list_incomplete: Annotated[
        Json[bool],
        ApiParamConfig(documentation_status=DocumentationStatus.INTENTIONALLY_UNDOCUMENTED),
    ] = False,
    include_deactivated_groups: Annotated[
        Json[bool],
        ApiParamConfig(documentation_status=DocumentationStatus.INTENTIONALLY_UNDOCUMENTED),
    ] = False,
    archived_channels: Annotated[
        Json[bool],
        ApiParamConfig(documentation_status=DocumentationStatus.INTENTIONALLY_UNDOCUMENTED),
    ] = False,
    empty_topic_name: Annotated[
        Json[bool],
        ApiParamConfig(documentation_status=DocumentationStatus.INTENTIONALLY_UNDOCUMENTED),
    ] = False,
    simplified_presence_events: Annotated[
        Json[bool],
        ApiParamConfig(documentation_status=DocumentationStatus.INTENTIONALLY_UNDOCUMENTED),
    ] = False,
) -> HttpResponse:
    if narrow is None:
        narrow = []
    if all_public_streams and not user_profile.can_access_public_streams():
        raise JsonableError(_("User not authorized for this query"))

    # Extract the Tornado handler from the request
    handler_id = RequestNotes.get_notes(request).tornado_handler_id
    assert handler_id is not None

    if user_client is None:
        valid_user_client = RequestNotes.get_notes(request).client
        assert valid_user_client is not None
        valid_user_client_name = valid_user_client.name
    else:
        valid_user_client_name = user_client.name

    new_queue_data = None
    if queue_id is None:
        new_queue_data = dict(
            user_profile_id=user_profile.id,
            user_recipient_id=user_profile.recipient_id,
            realm_id=user_profile.realm_id,
            event_types=event_types,
            client_type_name=valid_user_client_name,
            apply_markdown=apply_markdown,
            client_gravatar=client_gravatar,
            slim_presence=slim_presence,
            all_public_streams=all_public_streams,
            queue_timeout=lifespan_secs,
            last_connection_time=time.time(),
            narrow=narrow,
            bulk_message_deletion=bulk_message_deletion,
            stream_typing_notifications=stream_typing_notifications,
            pronouns_field_type_supported=pronouns_field_type_supported,
            linkifier_url_template=linkifier_url_template,
            user_list_incomplete=user_list_incomplete,
            include_deactivated_groups=include_deactivated_groups,
            archived_channels=archived_channels,
            empty_topic_name=empty_topic_name,
            simplified_presence_events=simplified_presence_events,
        )

    result = in_tornado_thread(fetch_events)(
        user_profile_id=user_profile.id,
        queue_id=queue_id,
        last_event_id=last_event_id,
        client_type_name=valid_user_client_name,
        dont_block=dont_block,
        handler_id=handler_id,
        new_queue_data=new_queue_data,
    )
    if "extra_log_data" in result:
        log_data = RequestNotes.get_notes(request).log_data
        assert log_data is not None
        log_data["extra"] = result["extra_log_data"]

    if result["type"] == "async":
        # Return an AsynchronousResponse; this will result in
        # Tornado discarding the response and instead long-polling the
        # request.  See zulip_finish for more design details.
        return AsynchronousResponse()
    if result["type"] == "error":
        raise result["exception"]
    return json_success(request, data=result["response"])
```

--------------------------------------------------------------------------------

---[FILE: test_user_groups.py]---
Location: zulip-main/zerver/transaction_tests/test_user_groups.py
Signals: Django

```python
import threading
from typing import Any
from unittest import mock

import orjson
from django.db import OperationalError, connections, transaction
from django.http import HttpRequest
from typing_extensions import override

from zerver.actions.user_groups import add_subgroups_to_user_group, check_add_user_group
from zerver.lib.exceptions import JsonableError
from zerver.lib.test_classes import ZulipTransactionTestCase
from zerver.lib.test_helpers import HostRequestMock
from zerver.lib.user_groups import access_user_group_for_update
from zerver.models import NamedUserGroup, Realm, UserGroup, UserProfile
from zerver.models.realms import get_realm
from zerver.views.user_groups import update_subgroups_of_user_group

BARRIER: threading.Barrier | None = None


def dev_update_subgroups(
    request: HttpRequest,
    user_profile: UserProfile,
    user_group_id: int,
) -> str | None:
    # The test is expected to set up the barrier before accessing this endpoint.
    assert BARRIER is not None
    try:
        with (
            mock.patch("zerver.lib.user_groups.access_user_group_for_update") as m,
        ):

            def wait_after_recursive_query(*args: Any, **kwargs: Any) -> UserGroup:
                # When updating the subgroups, we access the supergroup group
                # only after finishing the recursive query.
                BARRIER.wait()
                return access_user_group_for_update(*args, **kwargs)

            m.side_effect = wait_after_recursive_query

            update_subgroups_of_user_group(request, user_profile, user_group_id=user_group_id)
    except OperationalError as err:
        msg = str(err)
        if "deadlock detected" in msg:
            return "Deadlock detected"
        else:
            assert "could not obtain lock" in msg
            # This error is possible when nowait is set the True, which only
            # applies to the recursive query on the subgroups. Because the
            # recursive query fails, this thread must have not waited on the
            # barrier yet.
            BARRIER.wait()
            return "Busy lock detected"
    except (
        threading.BrokenBarrierError
    ):  # nocoverage # This is only possible when timeout happens or there is a programming error
        raise JsonableError(
            "Broken barrier. The tester should make sure that the exact number of parties have waited on the barrier set by the previous immediate set_sync_after_first_lock call"
        )

    return None


class UserGroupRaceConditionTestCase(ZulipTransactionTestCase):
    created_user_groups: list[NamedUserGroup] = []
    counter = 0
    CHAIN_LENGTH = 3

    @override
    def tearDown(self) -> None:
        # Clean up the user groups created to minimize leakage
        with transaction.atomic(durable=True):
            for group in self.created_user_groups:
                # can_manage_group can be deleted as long as it's the
                # default group_creator. If we start using non-default
                # can_manage_group in this test, deleting that group
                # should be reconsidered.
                can_manage_group = group.can_manage_group
                can_add_members_group = group.can_add_members_group
                group.delete()
                can_manage_group.delete()
                can_add_members_group.delete()
            transaction.on_commit(self.created_user_groups.clear)

        super().tearDown()

    def create_user_group_chain(self, realm: Realm) -> list[NamedUserGroup]:
        """Build a user groups forming a chain through group-group memberships
        returning a list where each group is the supergroup of its subsequent group.
        """
        iago = self.example_user("iago")
        groups = [
            check_add_user_group(realm, f"chain #{self.counter + i}", [], acting_user=iago)
            for i in range(self.CHAIN_LENGTH)
        ]
        self.counter += self.CHAIN_LENGTH
        self.created_user_groups.extend(groups)
        prev_group = groups[0]
        for group in groups[1:]:
            add_subgroups_to_user_group(prev_group, [group], acting_user=iago)
            prev_group = group
        return groups

    def test_lock_subgroups_with_respect_to_supergroup(self) -> None:
        realm = get_realm("zulip")
        self.login("iago")
        iago = self.example_user("iago")

        class RacingThread(threading.Thread):
            def __init__(
                self,
                subgroup_ids: list[int],
                supergroup_id: int,
            ) -> None:
                threading.Thread.__init__(self)
                self.response: str | None = None
                self.subgroup_ids = subgroup_ids
                self.supergroup_id = supergroup_id

            @override
            def run(self) -> None:
                try:
                    self.response = dev_update_subgroups(
                        HostRequestMock({"add": orjson.dumps(self.subgroup_ids).decode()}),
                        iago,
                        user_group_id=self.supergroup_id,
                    )
                finally:
                    # Close all thread-local database connections
                    connections.close_all()

        def assert_thread_success_count(
            t1: RacingThread,
            t2: RacingThread,
            *,
            success_count: int,
            error_message: str = "",
        ) -> None:
            help_msg = """We access the test endpoint that wraps around the
real subgroup update endpoint by synchronizing them after the acquisition of the
first lock in the critical region. Though unlikely, this test might fail as we
have no control over the scheduler when the barrier timeouts.
""".strip()
            global BARRIER
            BARRIER = threading.Barrier(parties=2, timeout=3)
            t1.start()
            t2.start()

            succeeded = 0
            for t in [t1, t2]:
                t.join()
                response = t.response
                if response is None:
                    succeeded += 1
                    continue

                self.assertEqual(response, error_message)
            # Race condition resolution should only allow one thread to succeed
            self.assertEqual(
                succeeded,
                success_count,
                f"Exactly {success_count} thread(s) should succeed.\n{help_msg}",
            )

        foo_chain = self.create_user_group_chain(realm)
        bar_chain = self.create_user_group_chain(realm)
        # These two threads are conflicting because a cycle would be formed if
        # both of them succeed. There is a deadlock in such circular dependency.
        assert_thread_success_count(
            RacingThread(
                subgroup_ids=[foo_chain[0].id],
                supergroup_id=bar_chain[-1].id,
            ),
            RacingThread(
                subgroup_ids=[bar_chain[-1].id],
                supergroup_id=foo_chain[0].id,
            ),
            success_count=1,
            error_message="Deadlock detected",
        )

        foo_chain = self.create_user_group_chain(realm)
        bar_chain = self.create_user_group_chain(realm)
        # These two requests would succeed if they didn't race with each other.
        # However, both threads will attempt to grab a lock on overlapping rows
        # when they first do the recursive query for subgroups. In this case, we
        # expect that one of the threads fails due to nowait=True for the
        # .select_for_update() call.
        assert_thread_success_count(
            RacingThread(
                subgroup_ids=[foo_chain[0].id],
                supergroup_id=bar_chain[-1].id,
            ),
            RacingThread(
                subgroup_ids=[foo_chain[1].id],
                supergroup_id=bar_chain[-1].id,
            ),
            success_count=1,
            error_message="Busy lock detected",
        )

        foo_chain = self.create_user_group_chain(realm)
        bar_chain = self.create_user_group_chain(realm)
        baz_chain = self.create_user_group_chain(realm)
        # Adding non-conflicting subgroups should succeed.
        assert_thread_success_count(
            RacingThread(
                subgroup_ids=[foo_chain[1].id, foo_chain[2].id, baz_chain[2].id],
                supergroup_id=baz_chain[0].id,
            ),
            RacingThread(
                subgroup_ids=[bar_chain[1].id, bar_chain[2].id],
                supergroup_id=baz_chain[0].id,
            ),
            success_count=2,
        )
```

--------------------------------------------------------------------------------

---[FILE: alert_words.py]---
Location: zulip-main/zerver/views/alert_words.py
Signals: Django, Pydantic

```python
from typing import Annotated

from django.http import HttpRequest, HttpResponse
from pydantic import Json, StringConstraints

from zerver.actions.alert_words import do_add_alert_words, do_remove_alert_words
from zerver.lib.alert_words import user_alert_words
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint
from zerver.models import UserProfile


def list_alert_words(request: HttpRequest, user_profile: UserProfile) -> HttpResponse:
    return json_success(request, data={"alert_words": user_alert_words(user_profile)})


def clean_alert_words(alert_words: list[str]) -> list[str]:
    alert_words = [w.strip() for w in alert_words]
    return [w for w in alert_words if w != ""]


@typed_endpoint
def add_alert_words(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    alert_words: Json[list[Annotated[str, StringConstraints(max_length=100)]]],
) -> HttpResponse:
    do_add_alert_words(user_profile, clean_alert_words(alert_words))
    return json_success(request, data={"alert_words": user_alert_words(user_profile)})


@typed_endpoint
def remove_alert_words(
    request: HttpRequest,
    user_profile: UserProfile,
    *,
    alert_words: Json[list[str]],
) -> HttpResponse:
    do_remove_alert_words(user_profile, alert_words)
    return json_success(request, data={"alert_words": user_alert_words(user_profile)})
```

--------------------------------------------------------------------------------

---[FILE: antispam.py]---
Location: zulip-main/zerver/views/antispam.py
Signals: Django, Pydantic

```python
import logging
from datetime import timedelta

from altcha import ChallengeOptions, create_challenge
from django.conf import settings
from django.http import HttpRequest, HttpResponseBase
from django.utils.timezone import now as timezone_now
from django.utils.translation import gettext as _
from pydantic import BaseModel

from zerver.lib.exceptions import JsonableError
from zerver.lib.response import json_success
from zerver.lib.typed_endpoint import typed_endpoint_without_parameters


class AltchaPayload(BaseModel):
    algorithm: str
    challenge: str
    number: int
    salt: str
    signature: str


@typed_endpoint_without_parameters
def get_challenge(
    request: HttpRequest,
) -> HttpResponseBase:
    if not settings.USING_CAPTCHA or not settings.ALTCHA_HMAC_KEY:  # nocoverage
        raise JsonableError(_("Challenges are not enabled."))

    now = timezone_now()
    expires = now + timedelta(minutes=1)
    try:
        challenge = create_challenge(
            ChallengeOptions(
                hmac_key=settings.ALTCHA_HMAC_KEY,
                max_number=500000,
                expires=expires,
            )
        )
        session_challenges = request.session.get("altcha_challenges", [])
        # We prune out expired challenges not for correctness (the
        # expiration is validated separately) but to prevent this from
        # growing without bound
        session_challenges = [(c, e) for (c, e) in session_challenges if e > now.timestamp()]
        request.session["altcha_challenges"] = [
            *session_challenges,
            (challenge.challenge, expires.timestamp()),
        ]
        return json_success(request, data=challenge.__dict__)
    except Exception as e:  # nocoverage
        logging.exception(e)
        raise JsonableError(_("Failed to generate challenge"))
```

--------------------------------------------------------------------------------

---[FILE: attachments.py]---
Location: zulip-main/zerver/views/attachments.py
Signals: Django

```python
from django.http import HttpRequest, HttpResponse

from zerver.actions.uploads import notify_attachment_update
from zerver.lib.attachments import access_attachment_by_id, remove_attachment, user_attachments
from zerver.lib.response import json_success
from zerver.models import UserProfile


def list_by_user(request: HttpRequest, user_profile: UserProfile) -> HttpResponse:
    return json_success(
        request,
        data={
            "attachments": user_attachments(user_profile),
            "upload_space_used": user_profile.realm.currently_used_upload_space_bytes(),
        },
    )


def remove(request: HttpRequest, user_profile: UserProfile, attachment_id: int) -> HttpResponse:
    attachment = access_attachment_by_id(user_profile, attachment_id, needs_owner=True)
    remove_attachment(user_profile, attachment)
    notify_attachment_update(user_profile, "remove", {"id": attachment_id})
    return json_success(request)
```

--------------------------------------------------------------------------------

````
