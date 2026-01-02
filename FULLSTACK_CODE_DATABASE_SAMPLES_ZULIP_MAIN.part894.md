---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 894
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 894 of 1290)

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

---[FILE: push_registration.py]---
Location: zulip-main/zerver/lib/push_registration.py
Signals: Django

```python
import base64
import binascii
import logging
from typing import TypedDict

from django.conf import settings
from django.utils.translation import gettext as _

from zerver.lib.exceptions import (
    InvalidBouncerPublicKeyError,
    InvalidEncryptedPushRegistrationError,
    JsonableError,
    MissingRemoteRealmError,
    RequestExpiredError,
)
from zerver.lib.push_notifications import PushNotificationsDisallowedByBouncerError
from zerver.lib.remote_server import (
    PushNotificationBouncerError,
    PushNotificationBouncerRetryLaterError,
    PushNotificationBouncerServerError,
    send_to_push_bouncer,
)
from zerver.models import PushDevice
from zerver.models.users import UserProfile, get_user_profile_by_id
from zerver.tornado.django_api import send_event_on_commit

if settings.ZILENCER_ENABLED:
    from zilencer.views import do_register_remote_push_device

logger = logging.getLogger(__name__)


class RegisterPushDeviceToBouncerQueueItem(TypedDict):
    user_profile_id: int
    bouncer_public_key: str
    encrypted_push_registration: str
    push_account_id: int


def handle_registration_to_bouncer_failure(
    user_profile: UserProfile, push_account_id: int, error_code: str
) -> None:
    """Handles a failed registration request to the bouncer by
    notifying or preparing to notify clients.

    * Sends a `push_device` event to notify online clients immediately.

    * Stores the `error_code` in the `PushDevice` table. This is later
      used, along with other metadata, to notify offline clients the
      next time they call `/register`. See the `push_devices` field in
      the `/register` response.
    """
    PushDevice.objects.filter(user=user_profile, push_account_id=push_account_id).update(
        error_code=error_code
    )
    event = dict(
        type="push_device",
        push_account_id=str(push_account_id),
        status="failed",
        error_code=error_code,
    )
    send_event_on_commit(user_profile.realm, event, [user_profile.id])

    # Report the `REQUEST_EXPIRED_ERROR` to the server admins as it indicates
    # a long-lasting outage somewhere between the server and the bouncer,
    # most likely in either the server or its local network configuration.
    if error_code == PushDevice.ErrorCode.REQUEST_EXPIRED:
        logging.error(
            "Push device registration request for user_id=%s, push_account_id=%s expired.",
            user_profile.id,
            push_account_id,
        )


def handle_register_push_device_to_bouncer(
    queue_item: RegisterPushDeviceToBouncerQueueItem,
) -> None:
    user_profile_id = queue_item["user_profile_id"]
    user_profile = get_user_profile_by_id(user_profile_id)
    bouncer_public_key = queue_item["bouncer_public_key"]
    encrypted_push_registration = queue_item["encrypted_push_registration"]
    push_account_id = queue_item["push_account_id"]

    try:
        if settings.ZILENCER_ENABLED:
            device_id = do_register_remote_push_device(
                bouncer_public_key,
                encrypted_push_registration,
                push_account_id,
                realm=user_profile.realm,
            )
        else:
            post_data: dict[str, str | int] = {
                "realm_uuid": str(user_profile.realm.uuid),
                "push_account_id": push_account_id,
                "encrypted_push_registration": encrypted_push_registration,
                "bouncer_public_key": bouncer_public_key,
            }
            result = send_to_push_bouncer("POST", "push/e2ee/register", post_data)
            assert isinstance(result["device_id"], int)  # for mypy
            device_id = result["device_id"]
    except (
        PushNotificationBouncerRetryLaterError,
        PushNotificationBouncerServerError,
    ) as e:  # nocoverage
        # Network error or 5xx error response from bouncer server.
        # Keep retrying to register until `RequestExpiredError` is raised.
        raise PushNotificationBouncerRetryLaterError(e.msg)
    except (
        # Need to resubmit realm info - `manage.py register_server`
        MissingRemoteRealmError,
        # Invalid credentials or unexpected status code
        PushNotificationBouncerError,
        # Plan doesn't allow sending push notifications
        PushNotificationsDisallowedByBouncerError,
    ):
        # Server admins need to fix these set of errors, report them.
        # Server should keep retrying to register until `RequestExpiredError` is raised.
        error_msg = f"Push device registration request for user_id={user_profile.id}, push_account_id={push_account_id} failed."
        logging.error(error_msg)
        raise PushNotificationBouncerRetryLaterError(error_msg)
    except (
        InvalidBouncerPublicKeyError,
        InvalidEncryptedPushRegistrationError,
        RequestExpiredError,
        # Any future or unexpected exceptions that we add.
        JsonableError,
    ) as e:
        handle_registration_to_bouncer_failure(
            user_profile, push_account_id, error_code=e.__class__.code.name
        )
        return

    # Registration successful.
    PushDevice.objects.filter(user=user_profile, push_account_id=push_account_id).update(
        bouncer_device_id=device_id
    )
    event = dict(
        type="push_device",
        push_account_id=str(push_account_id),
        status="active",
    )
    send_event_on_commit(user_profile.realm, event, [user_profile.id])


def check_push_key(push_key_str: str) -> bytes:
    error_message = _("Invalid `push_key`")

    try:
        push_key_bytes = base64.b64decode(push_key_str, validate=True)
    except binascii.Error:
        raise JsonableError(error_message)

    if len(push_key_bytes) != 33 or push_key_bytes[0] != 0x31:
        raise JsonableError(error_message)

    return push_key_bytes
```

--------------------------------------------------------------------------------

---[FILE: pysa.py]---
Location: zulip-main/zerver/lib/pysa.py

```python
from typing import TypeVar

T = TypeVar("T")


def mark_sanitized(arg: T) -> T:
    return arg
```

--------------------------------------------------------------------------------

---[FILE: query_helpers.py]---
Location: zulip-main/zerver/lib/query_helpers.py
Signals: Django

```python
from typing import TypeVar

from django.db import models
from django.db.models import QuerySet

ModelT = TypeVar("ModelT", bound=models.Model)
RowT = TypeVar("RowT")


def query_for_ids(
    query: QuerySet[ModelT, RowT],
    user_ids: list[int],
    field: str,
) -> QuerySet[ModelT, RowT]:
    """
    This function optimizes searches of the form
    `user_profile_id in (1, 2, 3, 4)` by quickly
    building the where clauses.  Profiling shows significant
    speedups over the normal Django-based approach.

    Use this very carefully!  Also, the caller should
    guard against empty lists of user_ids.
    """
    assert user_ids
    clause = f"{field} IN %s"
    query = query.extra(  # noqa: S610
        where=[clause],
        params=(tuple(user_ids),),
    )
    return query
```

--------------------------------------------------------------------------------

---[FILE: queue.py]---
Location: zulip-main/zerver/lib/queue.py
Signals: Django

```python
import logging
import random
import ssl
import threading
import time
from abc import ABC, abstractmethod
from collections import defaultdict
from collections.abc import Callable, Mapping
from typing import Any, Generic, TypeAlias, TypeVar

import orjson
import pika
import pika.adapters.tornado_connection
import pika.connection
import pika.exceptions
from django.conf import settings
from django.db import transaction
from pika.adapters.blocking_connection import BlockingChannel
from pika.channel import Channel
from pika.spec import Basic
from tornado import ioloop
from typing_extensions import override

from zerver.lib.utils import assert_is_not_none

MAX_REQUEST_RETRIES = 3
ChannelT = TypeVar("ChannelT", Channel, BlockingChannel)
Consumer: TypeAlias = Callable[[ChannelT, Basic.Deliver, pika.BasicProperties, bytes], None]


# This simple queuing library doesn't expose much of the power of
# RabbitMQ/Pika's queuing system; its purpose is to just provide an
# interface for external files to put things into queues and take them
# out from bots without having to import pika code all over our codebase.
class QueueClient(ABC, Generic[ChannelT]):
    def __init__(
        self,
        # Disable RabbitMQ heartbeats by default because BlockingConnection can't process them
        rabbitmq_heartbeat: int | None = 0,
        prefetch: int = 0,
    ) -> None:
        self.log = logging.getLogger("zulip.queue")
        self.queues: set[str] = set()
        self.channel: ChannelT | None = None
        self.prefetch = prefetch
        self.consumers: dict[str, set[Consumer[ChannelT]]] = defaultdict(set)
        self.rabbitmq_heartbeat = rabbitmq_heartbeat
        self.is_consuming = False
        self._connect()

    @abstractmethod
    def _connect(self) -> None:
        raise NotImplementedError

    @abstractmethod
    def _reconnect(self) -> None:
        raise NotImplementedError

    def _get_parameters(self) -> pika.ConnectionParameters:
        credentials = pika.PlainCredentials(
            settings.RABBITMQ_USERNAME, assert_is_not_none(settings.RABBITMQ_PASSWORD)
        )

        # With BlockingConnection, we are passed
        # self.rabbitmq_heartbeat=0, which asks to explicitly disable
        # the RabbitMQ heartbeat feature.  This is correct since that
        # heartbeat doesn't make sense with BlockingConnection (we do
        # need it for TornadoConnection).
        #
        # Where we've disabled RabbitMQ's heartbeat, the only
        # keepalive on this connection is the TCP keepalive (defaults:
        # `/proc/sys/net/ipv4/tcp_keepalive_*`).  On most Linux
        # systems, the default is to start sending keepalive packets
        # after TCP_KEEPIDLE (7200 seconds) of inactivity; after that
        # point, it send them every TCP_KEEPINTVL (typically 75s).
        # Some Kubernetes / Docker Swarm networks can kill "idle" TCP
        # connections after as little as ~15 minutes of inactivity.
        # To avoid this killing our RabbitMQ connections, we set
        # TCP_KEEPIDLE to something significantly below 15 minutes.
        tcp_options = None
        if self.rabbitmq_heartbeat == 0:
            tcp_options = dict(TCP_KEEPIDLE=60 * 5)

        ssl_options: type[pika.ConnectionParameters._DEFAULT] | pika.SSLOptions = (
            pika.ConnectionParameters._DEFAULT
        )
        if settings.RABBITMQ_USE_TLS:
            ssl_options = pika.SSLOptions(context=ssl.create_default_context())

        return pika.ConnectionParameters(
            settings.RABBITMQ_HOST,
            port=settings.RABBITMQ_PORT,
            virtual_host=settings.RABBITMQ_VHOST,
            heartbeat=self.rabbitmq_heartbeat,
            tcp_options=tcp_options,
            ssl_options=ssl_options,
            credentials=credentials,
        )

    def _generate_ctag(self, queue_name: str) -> str:
        return f"{queue_name}_{random.getrandbits(16)}"

    def _reconnect_consumer_callback(self, queue: str, consumer: Consumer[ChannelT]) -> None:
        self.log.info("Queue reconnecting saved consumer %r to queue %s", consumer, queue)
        self.ensure_queue(
            queue,
            lambda channel: channel.basic_consume(
                queue,
                consumer,
                consumer_tag=self._generate_ctag(queue),
            ),
        )

    def _reconnect_consumer_callbacks(self) -> None:
        for queue, consumers in self.consumers.items():
            for consumer in consumers:
                self._reconnect_consumer_callback(queue, consumer)

    def ready(self) -> bool:
        return self.channel is not None

    @abstractmethod
    def ensure_queue(self, queue_name: str, callback: Callable[[ChannelT], object]) -> None:
        raise NotImplementedError

    def publish(self, queue_name: str, body: bytes) -> None:
        def do_publish(channel: ChannelT) -> None:
            channel.basic_publish(
                exchange="",
                routing_key=queue_name,
                properties=pika.BasicProperties(delivery_mode=2),
                body=body,
            )

        self.ensure_queue(queue_name, do_publish)

    def json_publish(self, queue_name: str, body: Mapping[str, Any]) -> None:
        data = orjson.dumps(body)
        try:
            self.publish(queue_name, data)
            return
        except pika.exceptions.AMQPConnectionError:
            self.log.warning("Failed to send to rabbitmq, trying to reconnect and send again")

        self._reconnect()
        self.publish(queue_name, data)


class SimpleQueueClient(QueueClient[BlockingChannel]):
    connection: pika.BlockingConnection | None

    @override
    def _connect(self) -> None:
        start = time.time()
        self.connection = pika.BlockingConnection(self._get_parameters())
        self.channel = self.connection.channel()
        self.channel.basic_qos(prefetch_count=self.prefetch)
        self.log.info("SimpleQueueClient connected (connecting took %.3fs)", time.time() - start)

    @override
    def _reconnect(self) -> None:
        self.connection = None
        self.channel = None
        self.queues = set()
        self._connect()

    def close(self) -> None:
        if self.connection is not None:
            self.connection.close()

    @override
    def ensure_queue(self, queue_name: str, callback: Callable[[BlockingChannel], object]) -> None:
        """Ensure that a given queue has been declared, and then call
        the callback with no arguments."""
        if self.connection is None or not self.connection.is_open:
            self._connect()
            assert self.channel is not None
        else:
            assert self.channel is not None

        if queue_name not in self.queues:
            self.channel.queue_declare(queue=queue_name, durable=True)
            self.queues.add(queue_name)

        callback(self.channel)

    def start_json_consumer(
        self,
        queue_name: str,
        callback: Callable[[list[dict[str, Any]]], None],
        batch_size: int = 1,
        timeout: int | None = None,
    ) -> None:
        if batch_size == 1:
            timeout = None

        def do_consume(channel: BlockingChannel) -> None:
            events: list[dict[str, Any]] = []
            last_process = time.time()
            max_processed: int | None = None
            self.is_consuming = True

            # This iterator technique will iteratively collect up to
            # batch_size events from the RabbitMQ queue (if present)
            # before calling the callback with the batch.  If not
            # enough events are present, it will sleep for at most
            # timeout seconds before calling the callback with the
            # batch of events it has.
            for method, properties, body in channel.consume(queue_name, inactivity_timeout=timeout):
                if body is not None:
                    assert method is not None
                    events.append(orjson.loads(body))
                    max_processed = method.delivery_tag
                now = time.time()
                if len(events) >= batch_size or (timeout and now >= last_process + timeout):
                    if events:
                        assert max_processed is not None
                        try:
                            callback(events)
                            channel.basic_ack(max_processed, multiple=True)
                        except BaseException:
                            if channel.is_open:
                                channel.basic_nack(max_processed, multiple=True)
                            raise
                        events = []
                    last_process = now
                if not self.is_consuming:
                    break

        self.ensure_queue(queue_name, do_consume)

    def local_queue_size(self) -> int:
        assert self.channel is not None
        return self.channel.get_waiting_message_count() + len(
            self.channel._pending_events  # type: ignore[attr-defined] # private member missing from stubs
        )

    def stop_consuming(self) -> None:
        assert self.channel is not None
        assert self.is_consuming
        self.is_consuming = False
        self.channel.stop_consuming()


# Patch pika.adapters.tornado_connection.TornadoConnection so that a socket error doesn't
# throw an exception and disconnect the tornado process from the rabbitmq
# queue. Instead, just re-connect as usual
class ExceptionFreeTornadoConnection(pika.adapters.tornado_connection.TornadoConnection):
    def _adapter_disconnect(self) -> None:
        try:
            super()._adapter_disconnect()  # type: ignore[misc]  # private method missing from stubs
        except (
            pika.exceptions.ProbableAuthenticationError,
            pika.exceptions.ProbableAccessDeniedError,
            pika.exceptions.IncompatibleProtocolError,
        ):
            logging.warning(
                "Caught exception in ExceptionFreeTornadoConnection when \
calling _adapter_disconnect, ignoring",
                exc_info=True,
            )


class TornadoQueueClient(QueueClient[Channel]):
    connection: ExceptionFreeTornadoConnection | None

    # Based on:
    # https://pika.readthedocs.io/en/0.9.8/examples/asynchronous_consumer_example.html
    def __init__(self) -> None:
        super().__init__(
            # TornadoConnection can process heartbeats, so enable them.
            rabbitmq_heartbeat=None,
            # Only ask for 100 un-acknowledged messages at once from
            # the server, rather than an unbounded number.
            prefetch=100,
        )
        self._on_open_cbs: list[Callable[[Channel], None]] = []
        self._connection_failure_count = 0

    @override
    def _connect(self) -> None:
        self.log.info("Beginning TornadoQueueClient connection")
        self.connection = ExceptionFreeTornadoConnection(
            self._get_parameters(),
            on_open_callback=self._on_open,
            on_open_error_callback=self._on_connection_open_error,
            on_close_callback=self._on_connection_closed,
        )

    @override
    def _reconnect(self) -> None:
        self.connection = None
        self.channel = None
        self.queues = set()
        self.log.warning("TornadoQueueClient attempting to reconnect to RabbitMQ")
        self._connect()

    CONNECTION_RETRY_SECS = 2

    # When the RabbitMQ server is restarted, it's normal for it to
    # take a few seconds to come back; we'll retry a few times and all
    # will be well.  So for the first few failures, we report only at
    # "warning" level, avoiding an email to the server admin.
    #
    # A loss of an existing connection starts a retry loop just like a
    # failed connection attempt, so it counts as the first failure.
    #
    # On an unloaded test system, a RabbitMQ restart takes about 6s,
    # potentially causing 4 failures.  We add some headroom above that.
    CONNECTION_FAILURES_BEFORE_NOTIFY = 10

    def _on_connection_open_error(
        self, connection: pika.connection.Connection, reason: str | Exception
    ) -> None:
        self._connection_failure_count += 1
        retry_secs = self.CONNECTION_RETRY_SECS
        self.log.log(
            (
                logging.CRITICAL
                if self._connection_failure_count > self.CONNECTION_FAILURES_BEFORE_NOTIFY
                else logging.WARNING
            ),
            "TornadoQueueClient couldn't connect to RabbitMQ, retrying in %d secs...",
            retry_secs,
        )
        ioloop.IOLoop.current().call_later(retry_secs, self._reconnect)

    def _on_connection_closed(
        self, connection: pika.connection.Connection, reason: Exception
    ) -> None:
        if self.connection is None:
            return
        self._connection_failure_count = 1
        retry_secs = self.CONNECTION_RETRY_SECS
        self.log.warning(
            "TornadoQueueClient lost connection to RabbitMQ, reconnecting in %d secs...",
            retry_secs,
        )
        ioloop.IOLoop.current().call_later(retry_secs, self._reconnect)

    def _on_open(self, connection: pika.connection.Connection) -> None:
        assert self.connection is not None
        self._connection_failure_count = 0
        try:
            self.connection.channel(on_open_callback=self._on_channel_open)
        except pika.exceptions.ConnectionClosed:
            # The connection didn't stay open long enough for this code to get to it.
            # Let _on_connection_closed deal with trying again.
            self.log.warning("TornadoQueueClient couldn't open channel: connection already closed")

    def _on_channel_open(self, channel: Channel) -> None:
        self.channel = channel
        for callback in self._on_open_cbs:
            callback(channel)
        self._reconnect_consumer_callbacks()
        self.log.info("TornadoQueueClient connected")

    def close(self) -> None:
        if self.connection is not None:
            self.connection.close()
            self.connection = None

    @override
    def ensure_queue(self, queue_name: str, callback: Callable[[Channel], object]) -> None:
        def set_qos(frame: Any) -> None:
            assert self.channel is not None
            self.queues.add(queue_name)
            self.channel.basic_qos(prefetch_count=self.prefetch, callback=finish)

        def finish(frame: Any) -> None:
            assert self.channel is not None
            callback(self.channel)

        if queue_name not in self.queues:
            # If we're not connected yet, send this message
            # once we have created the channel
            if not self.ready():
                self._on_open_cbs.append(lambda channel: self.ensure_queue(queue_name, callback))
                return

            assert self.channel is not None
            self.channel.queue_declare(queue=queue_name, durable=True, callback=set_qos)
        else:
            assert self.channel is not None
            callback(self.channel)

    def start_json_consumer(
        self,
        queue_name: str,
        callback: Callable[[list[dict[str, Any]]], None],
        batch_size: int = 1,
        timeout: int | None = None,
    ) -> None:
        def wrapped_consumer(
            ch: Channel,
            method: Basic.Deliver,
            properties: pika.BasicProperties,
            body: bytes,
        ) -> None:
            assert method.delivery_tag is not None
            callback([orjson.loads(body)])
            ch.basic_ack(delivery_tag=method.delivery_tag)

        assert batch_size == 1
        assert timeout is None
        self.consumers[queue_name].add(wrapped_consumer)

        if not self.ready():
            return

        self.ensure_queue(
            queue_name,
            lambda channel: channel.basic_consume(
                queue_name,
                wrapped_consumer,
                consumer_tag=self._generate_ctag(queue_name),
            ),
        )


thread_data = threading.local()


def get_queue_client() -> SimpleQueueClient | TornadoQueueClient:
    if not hasattr(thread_data, "queue_client"):
        if not settings.USING_RABBITMQ:
            raise RuntimeError("Cannot get a queue client without USING_RABBITMQ")
        thread_data.queue_client = SimpleQueueClient()

    return thread_data.queue_client


def set_queue_client(queue_client: SimpleQueueClient | TornadoQueueClient) -> None:
    thread_data.queue_client = queue_client


# One should generally use `queue_event_on_commit` unless there's a strong
# reason to use `queue_json_publish_rollback_unsafe` directly, as it doesn't
# wait for the db transaction (within which it gets called, if any) to commit
# and sends event irrespective of commit or rollback.
def queue_json_publish_rollback_unsafe(
    queue_name: str,
    event: dict[str, Any],
    processor: Callable[[Any], None] | None = None,
) -> None:
    if settings.USING_RABBITMQ:
        get_queue_client().json_publish(queue_name, event)
    elif processor:
        # Round-trip through orjson to simulate what RabbitMQ does.
        processor(orjson.loads(orjson.dumps(event)))
    else:
        # The else branch is only hit during tests, where rabbitmq is not enabled.
        # Must be imported here: A top section import leads to circular imports
        from zerver.worker.queue_processors import get_worker

        # As above, we round-trip the event through orjson to emulate
        # what happens with RabbitMQ enqueueing and dequeueing the
        # event.  This ensures that we don't rely on non-JSON'able
        # datatypes in the events.
        get_worker(queue_name, disable_timeout=True).consume_single_event(
            orjson.loads(orjson.dumps(event))
        )


def queue_event_on_commit(queue_name: str, event: dict[str, Any]) -> None:
    transaction.on_commit(lambda: queue_json_publish_rollback_unsafe(queue_name, event))


def retry_event(
    queue_name: str, event: dict[str, Any], failure_processor: Callable[[dict[str, Any]], None]
) -> None:
    if "failed_tries" not in event:
        event["failed_tries"] = 0
    event["failed_tries"] += 1
    if event["failed_tries"] > MAX_REQUEST_RETRIES:
        failure_processor(event)
    else:
        queue_json_publish_rollback_unsafe(queue_name, event)
```

--------------------------------------------------------------------------------

````
