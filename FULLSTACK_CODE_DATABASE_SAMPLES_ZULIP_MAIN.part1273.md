---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1273
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1273 of 1290)

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

---[FILE: queue_processors.py]---
Location: zulip-main/zerver/worker/queue_processors.py

```python
# Documented in https://zulip.readthedocs.io/en/latest/subsystems/queuing.html
import importlib
import pkgutil

import zerver.worker
from zerver.worker.base import QueueProcessingWorker, test_queues, worker_classes


def get_worker(
    queue_name: str,
    *,
    threaded: bool = False,
    disable_timeout: bool = False,
    worker_num: int | None = None,
) -> QueueProcessingWorker:
    if queue_name in {"test", "noop", "noop_batch"}:
        import_module = "zerver.worker.test"
    else:
        import_module = f"zerver.worker.{queue_name}"

    importlib.import_module(import_module)
    return worker_classes[queue_name](
        threaded=threaded, disable_timeout=disable_timeout, worker_num=worker_num
    )


def get_active_worker_queues(only_test_queues: bool = False) -> list[str]:
    """Returns all (either test, or real) worker queues."""
    for module_info in pkgutil.iter_modules(zerver.worker.__path__, "zerver.worker."):
        importlib.import_module(module_info.name)

    return [
        queue_name
        for queue_name in worker_classes
        if bool(queue_name in test_queues) == only_test_queues
    ]
```

--------------------------------------------------------------------------------

---[FILE: test.py]---
Location: zulip-main/zerver/worker/test.py
Signals: Django

```python
# Documented in https://zulip.readthedocs.io/en/latest/subsystems/queuing.html
import logging
import time
from collections.abc import Mapping, Sequence
from typing import Any

import orjson
from django.conf import settings
from typing_extensions import override

from zerver.worker.base import LoopQueueProcessingWorker, QueueProcessingWorker, assign_queue

logger = logging.getLogger(__name__)


@assign_queue("test", is_test_queue=True)
class TestWorker(QueueProcessingWorker):
    # This worker allows you to test the queue worker infrastructure without
    # creating significant side effects.  It can be useful in development or
    # for troubleshooting prod/staging.  It pulls a message off the test queue
    # and appends it to a file in /var/log/zulip.
    @override
    def consume(self, event: Mapping[str, Any]) -> None:  # nocoverage
        fn = settings.ZULIP_WORKER_TEST_FILE
        message = orjson.dumps(event)
        logging.info("TestWorker should append this message to %s: %s", fn, message.decode())
        with open(fn, "ab") as f:
            f.write(message + b"\n")


@assign_queue("noop", is_test_queue=True)
class NoopWorker(QueueProcessingWorker):
    """Used to profile the queue processing framework, in zilencer's queue_rate."""

    def __init__(
        self,
        threaded: bool = False,
        disable_timeout: bool = False,
        worker_num: int | None = None,
        max_consume: int = 1000,
        slow_queries: Sequence[int] = [],
    ) -> None:
        super().__init__(threaded, disable_timeout, worker_num)
        self.consumed = 0
        self.max_consume = max_consume
        self.slow_queries: set[int] = set(slow_queries)

    @override
    def consume(self, event: Mapping[str, Any]) -> None:
        self.consumed += 1
        if self.consumed in self.slow_queries:
            logging.info("Slow request...")
            time.sleep(60)
            logging.info("Done!")
        if self.consumed >= self.max_consume:
            self.stop()


@assign_queue("noop_batch", is_test_queue=True)
class BatchNoopWorker(LoopQueueProcessingWorker):
    """Used to profile the queue processing framework, in zilencer's queue_rate."""

    batch_size = 100

    def __init__(
        self,
        threaded: bool = False,
        disable_timeout: bool = False,
        max_consume: int = 1000,
        slow_queries: Sequence[int] = [],
    ) -> None:
        super().__init__(threaded, disable_timeout)
        self.consumed = 0
        self.max_consume = max_consume
        self.slow_queries: set[int] = set(slow_queries)

    @override
    def consume_batch(self, events: list[dict[str, Any]]) -> None:
        event_numbers = set(range(self.consumed + 1, self.consumed + 1 + len(events)))
        found_slow = self.slow_queries & event_numbers
        if found_slow:
            logging.info("%d slow requests...", len(found_slow))
            time.sleep(60 * len(found_slow))
            logging.info("Done!")
        self.consumed += len(events)
        if self.consumed >= self.max_consume:
            self.stop()
```

--------------------------------------------------------------------------------

---[FILE: thumbnail.py]---
Location: zulip-main/zerver/worker/thumbnail.py
Signals: Django

```python
import logging
import time
from dataclasses import asdict
from io import BytesIO
from typing import Any

import pyvips
from django.db import transaction
from typing_extensions import override

from zerver.actions.message_edit import do_update_embedded_data
from zerver.lib.mime_types import guess_type
from zerver.lib.thumbnail import (
    IMAGE_MAX_ANIMATED_PIXELS,
    MarkdownImageMetadata,
    StoredThumbnailFormat,
    get_default_thumbnail_url,
    get_image_thumbnail_path,
    get_transcoded_format,
    missing_thumbnails,
    rewrite_thumbnailed_images,
)
from zerver.lib.upload import save_attachment_contents, upload_backend
from zerver.models import ArchivedMessage, ImageAttachment, Message
from zerver.worker.base import QueueProcessingWorker, assign_queue

logger = logging.getLogger(__name__)


@assign_queue("thumbnail")
class ThumbnailWorker(QueueProcessingWorker):
    @override
    def consume(self, event: dict[str, Any]) -> None:
        start = time.time()
        with transaction.atomic(savepoint=False):
            try:
                # This lock prevents us from racing with the on-demand
                # rendering that can be triggered if a request is made
                # directly to a thumbnail URL we have not made yet.
                # This may mean that we may generate 0 thumbnail
                # images once we get the lock.
                row = ImageAttachment.objects.select_for_update(of=("self",)).get(id=event["id"])
            except ImageAttachment.DoesNotExist:  # nocoverage
                logger.info("ImageAttachment row %d missing", event["id"])
                return
            uploaded_thumbnails = ensure_thumbnails(row)
        end = time.time()
        logger.info(
            "Processed %d thumbnails (%dms)",
            uploaded_thumbnails,
            (end - start) * 1000,
        )


def ensure_thumbnails(image_attachment: ImageAttachment) -> int:
    needed_thumbnails = missing_thumbnails(image_attachment)

    if not needed_thumbnails:
        return 0

    written_images = 0
    with BytesIO() as f:
        save_attachment_contents(image_attachment.path_id, f)
        image_bytes = f.getvalue()
    try:
        # TODO: We could save some computational time by using the same
        # bytes if multiple resolutions are larger than the source
        # image.  That is, if the input is 10x10, a 100x100.jpg is
        # going to be the same as a 200x200.jpg, since those set the
        # max dimensions, and we do not scale up.
        for thumbnail_format in needed_thumbnails:
            # This will scale to fit within the given dimensions; it
            # may be smaller one one or more of them.
            logger.info(
                "Resizing to %d x %d, from %d x %d",
                thumbnail_format.max_width,
                thumbnail_format.max_height,
                image_attachment.original_width_px,
                image_attachment.original_height_px,
            )
            load_opts = ""
            if image_attachment.frames > 1:
                # If the original has multiple frames, we want to load
                # one of them if we're outputting to a static format,
                # otherwise we load them all.
                if thumbnail_format.animated:
                    # We compute how many frames to thumbnail based on
                    # how many frames it will take us to get to
                    # IMAGE_MAX_ANIMATED_PIXELS
                    pixels_per_frame = (
                        image_attachment.original_width_px * image_attachment.original_height_px
                    )
                    if pixels_per_frame * image_attachment.frames < IMAGE_MAX_ANIMATED_PIXELS:
                        load_opts = "n=-1"
                    else:
                        load_opts = f"n={IMAGE_MAX_ANIMATED_PIXELS // pixels_per_frame}"
                else:
                    load_opts = "n=1"
            resized = pyvips.Image.thumbnail_buffer(
                image_bytes,
                thumbnail_format.max_width,
                height=thumbnail_format.max_height,
                option_string=load_opts,
                size=pyvips.Size.DOWN,
            )
            thumbnailed_bytes = resized.write_to_buffer(
                f".{thumbnail_format.extension}[{thumbnail_format.opts}]"
            )
            content_type = guess_type(f"image.{thumbnail_format.extension}")[0]
            assert content_type is not None
            thumbnail_path = get_image_thumbnail_path(image_attachment, thumbnail_format)
            logger.info("Uploading %d bytes to %s", len(thumbnailed_bytes), thumbnail_path)
            upload_backend.upload_message_attachment(
                thumbnail_path,
                str(thumbnail_format),
                content_type,
                thumbnailed_bytes,
                None,
                None,
            )
            height = resized.get("page-height") if thumbnail_format.animated else resized.height
            image_attachment.thumbnail_metadata.append(
                asdict(
                    StoredThumbnailFormat(
                        extension=thumbnail_format.extension,
                        content_type=content_type,
                        max_width=thumbnail_format.max_width,
                        max_height=thumbnail_format.max_height,
                        animated=thumbnail_format.animated,
                        width=resized.width,
                        height=height,
                        byte_size=len(thumbnailed_bytes),
                    )
                )
            )
            written_images += 1

    except pyvips.Error as e:
        logger.exception(e)

        if written_images == 0 and len(image_attachment.thumbnail_metadata) == 0:
            # We have never thumbnailed this -- it most likely had
            # bad data.  Remove the ImageAttachment row, since it is
            # not valid for thumbnailing.
            update_message_rendered_content(
                image_attachment.realm_id, image_attachment.path_id, None
            )
            image_attachment.delete()
            return 0
        else:  # nocoverage
            # TODO: Clean up any dangling thumbnails we may have
            # produced?  Seems unlikely that we'd fail on one size,
            # but not another, but anything's possible.
            pass

    image_attachment.save(update_fields=["thumbnail_metadata"])
    url, is_animated = get_default_thumbnail_url(image_attachment)
    update_message_rendered_content(
        image_attachment.realm_id,
        image_attachment.path_id,
        MarkdownImageMetadata(
            url=url,
            is_animated=is_animated,
            original_width_px=image_attachment.original_width_px,
            original_height_px=image_attachment.original_height_px,
            original_content_type=image_attachment.content_type,
            transcoded_image=get_transcoded_format(image_attachment),
        ),
    )
    return written_images


def update_message_rendered_content(
    realm_id: int, path_id: str, image_data: MarkdownImageMetadata | None
) -> None:
    for message_class in (Message, ArchivedMessage):
        messages_with_image = (
            message_class.objects.filter(realm_id=realm_id, attachment__path_id=path_id)
            .select_for_update(of=("self",))
            .order_by("id")
        )
        for message in messages_with_image:
            assert message.rendered_content is not None
            rendered_content = rewrite_thumbnailed_images(
                message.rendered_content,
                {} if image_data is None else {path_id: image_data},
                {path_id} if image_data is None else set(),
            )[0]
            if rendered_content is None:
                # There were no updates -- for instance, if we re-run
                # ensure_thumbnails on an ImageAttachment we already
                # ran it on once.  Do not bother to no-op update
                # clients.
                continue
            if isinstance(message, Message):
                # Perform a silent update push to the clients
                do_update_embedded_data(message.sender, message, rendered_content)
            else:
                message.rendered_content = rendered_content
                message.save(update_fields=["rendered_content"])
```

--------------------------------------------------------------------------------

---[FILE: user_activity.py]---
Location: zulip-main/zerver/worker/user_activity.py
Signals: Django

```python
# Documented in https://zulip.readthedocs.io/en/latest/subsystems/queuing.html
import logging
from typing import Any

from django.conf import settings
from django.db import connection
from psycopg2.sql import SQL, Literal
from typing_extensions import override

from zerver.worker.base import LoopQueueProcessingWorker, assign_queue

logger = logging.getLogger(__name__)


@assign_queue("user_activity")
class UserActivityWorker(LoopQueueProcessingWorker):
    """The UserActivity queue is perhaps our highest-traffic queue, and
    requires some care to ensure it performs adequately.

    We use a LoopQueueProcessingWorker as a performance optimization
    for managing the queue.  The structure of UserActivity records is
    such that they are easily deduplicated before being sent to the
    database; we take advantage of that to make this queue highly
    effective at dealing with a backlog containing many similar
    events.  Such a backlog happen in a few ways:

    * In abuse/DoS situations, if a client is sending huge numbers of
      similar requests to the server.
    * If the queue ends up with several minutes of backlog e.g. due to
      downtime of the queue processor, many clients will have several
      common events from doing an action multiple times.

    """

    client_id_map: dict[str, int] = {}

    @override
    def __init__(
        self,
        threaded: bool = False,
        disable_timeout: bool = False,
        worker_num: int | None = None,
    ) -> None:
        if settings.USER_ACTIVITY_SHARDS > 1 and worker_num is not None:  # nocoverage
            self.queue_name += f"_shard{worker_num}"
        super().__init__(threaded, disable_timeout, worker_num)

    @override
    def start(self) -> None:
        # For our unit tests to make sense, we need to clear this on startup.
        self.client_id_map = {}
        super().start()

    @override
    def consume_batch(self, user_activity_events: list[dict[str, Any]]) -> None:
        uncommitted_events: dict[tuple[int, int, str], tuple[int, float]] = {}

        # First, we drain the queue of all user_activity events and
        # deduplicate them for insertion into the database.
        for event in user_activity_events:
            user_profile_id = event["user_profile_id"]
            client_id = event["client_id"]

            key_tuple = (user_profile_id, client_id, event["query"])
            if key_tuple not in uncommitted_events:
                uncommitted_events[key_tuple] = (1, event["time"])
            else:
                count, event_time = uncommitted_events[key_tuple]
                uncommitted_events[key_tuple] = (count + 1, max(event_time, event["time"]))

        rows = []
        for key_tuple, value_tuple in uncommitted_events.items():
            user_profile_id, client_id, query = key_tuple
            count, event_time = value_tuple
            rows.append(
                SQL("({},{},{},{},to_timestamp({}))").format(
                    Literal(user_profile_id),
                    Literal(client_id),
                    Literal(query),
                    Literal(count),
                    Literal(event_time),
                )
            )

        # Perform a single bulk UPSERT for all of the rows
        sql_query = SQL(
            """
            INSERT INTO zerver_useractivity(user_profile_id, client_id, query, count, last_visit)
            VALUES {rows}
            ON CONFLICT (user_profile_id, client_id, query) DO UPDATE SET
                count = zerver_useractivity.count + excluded.count,
                last_visit = greatest(zerver_useractivity.last_visit, excluded.last_visit)
            """
        ).format(rows=SQL(", ").join(rows))
        with connection.cursor() as cursor:
            cursor.execute(sql_query)
```

--------------------------------------------------------------------------------

---[FILE: user_activity_interval.py]---
Location: zulip-main/zerver/worker/user_activity_interval.py

```python
# Documented in https://zulip.readthedocs.io/en/latest/subsystems/queuing.html
import logging
from collections.abc import Mapping
from typing import Any

from typing_extensions import override

from zerver.actions.user_activity import do_update_user_activity_interval
from zerver.lib.timestamp import timestamp_to_datetime
from zerver.models.users import get_user_profile_by_id
from zerver.worker.base import QueueProcessingWorker, assign_queue

logger = logging.getLogger(__name__)


@assign_queue("user_activity_interval")
class UserActivityIntervalWorker(QueueProcessingWorker):
    @override
    def consume(self, event: Mapping[str, Any]) -> None:
        user_profile = get_user_profile_by_id(event["user_profile_id"])
        log_time = timestamp_to_datetime(event["time"])
        do_update_user_activity_interval(user_profile, log_time)
```

--------------------------------------------------------------------------------

---[FILE: auth.py]---
Location: zulip-main/zilencer/auth.py
Signals: Django

```python
import base64
import binascii
import logging
from collections.abc import Callable
from functools import wraps
from typing import Any, Concatenate

import sentry_sdk
from django.conf import settings
from django.core.signing import BadSignature, SignatureExpired, TimestampSigner
from django.http import HttpRequest, HttpResponse
from django.urls import path
from django.urls.resolvers import URLPattern
from django.utils.crypto import constant_time_compare
from django.utils.timezone import now as timezone_now
from django.utils.translation import gettext as _
from django.views.decorators.csrf import csrf_exempt
from typing_extensions import ParamSpec, override

from zerver.decorator import get_basic_credentials, process_client
from zerver.lib.exceptions import (
    ErrorCode,
    JsonableError,
    RateLimitedError,
    RemoteServerDeactivatedError,
    UnauthorizedError,
)
from zerver.lib.rate_limiter import should_rate_limit
from zerver.lib.request import RequestNotes
from zerver.lib.rest import default_never_cache_responses, get_target_view_function_or_response
from zerver.lib.subdomains import get_subdomain
from zerver.models import Realm
from zilencer.models import (
    RateLimitedRemoteZulipServer,
    RemoteZulipServer,
    get_remote_server_by_uuid,
)

logger = logging.getLogger(__name__)

ParamT = ParamSpec("ParamT")

REMOTE_SERVER_TAKEOVER_TOKEN_SALT = "remote_server_transfer"
REMOTE_SERVER_TAKEOVER_TOKEN_VALIDITY_SECONDS = 10


def generate_registration_transfer_verification_secret(hostname: str) -> str:
    signer = TimestampSigner(salt=REMOTE_SERVER_TAKEOVER_TOKEN_SALT)
    secret = base64.b16encode(signer.sign(hostname).encode()).decode()
    return secret


def validate_registration_transfer_verification_secret(secret: str, hostname: str) -> None:
    signer = TimestampSigner(salt=REMOTE_SERVER_TAKEOVER_TOKEN_SALT)
    try:
        signed_data = base64.b16decode(secret).decode()
        hostname_from_secret = signer.unsign(
            signed_data, max_age=REMOTE_SERVER_TAKEOVER_TOKEN_VALIDITY_SECONDS
        )
    except SignatureExpired:
        raise JsonableError(_("The verification secret has expired"))
    except BadSignature:
        raise JsonableError(_("The verification secret is invalid"))
    except binascii.Error:
        raise JsonableError(_("The verification secret is malformed"))
    if hostname_from_secret != hostname:
        raise JsonableError(_("The verification secret is for a different hostname"))


class InvalidZulipServerError(JsonableError):
    code = ErrorCode.INVALID_ZULIP_SERVER
    data_fields = ["role"]

    def __init__(self, role: str) -> None:
        self.role: str = role

    @staticmethod
    @override
    def msg_format() -> str:
        return "Zulip server auth failure: {role} is not registered -- did you run `manage.py register_server`?"


class InvalidZulipServerKeyError(InvalidZulipServerError):
    @staticmethod
    @override
    def msg_format() -> str:
        return "Zulip server auth failure: key does not match role {role}"


def rate_limit_remote_server(
    request: HttpRequest, remote_server: RemoteZulipServer, domain: str
) -> None:
    if not should_rate_limit(request):
        return

    try:
        RateLimitedRemoteZulipServer(remote_server, domain=domain).rate_limit_request(request)
    except RateLimitedError as e:
        logger.warning("Remote server %s exceeded rate limits on domain %s", remote_server, domain)
        raise e


def validate_remote_server(
    request: HttpRequest,
    role: str,
    api_key: str,
) -> RemoteZulipServer:
    log_data = RequestNotes.get_notes(request).log_data
    assert log_data is not None
    try:
        remote_server = get_remote_server_by_uuid(role)
    except RemoteZulipServer.DoesNotExist:
        log_data["extra"] = "[invalid-server]"
        raise InvalidZulipServerError(role)
    if not constant_time_compare(api_key, remote_server.api_key):
        log_data["extra"] = "[invalid-server-key]"
        raise InvalidZulipServerKeyError(role)

    if remote_server.deactivated:
        log_data["extra"] = "[deactivated-server]"
        raise RemoteServerDeactivatedError
    if (
        get_subdomain(request) != Realm.SUBDOMAIN_FOR_ROOT_DOMAIN
        and not settings.DEVELOPMENT_DISABLE_PUSH_BOUNCER_DOMAIN_CHECK
    ):
        # Sometimes we may want to test push bouncer logic in development.
        log_data["extra"] = "[invalid-domain]"
        raise JsonableError(_("Invalid subdomain for push notifications bouncer"))
    RequestNotes.get_notes(request).remote_server = remote_server
    process_client(request)
    sentry_sdk.set_user({"server": remote_server.uuid})
    return remote_server


def authenticated_remote_server_view(
    view_func: Callable[Concatenate[HttpRequest, RemoteZulipServer, ParamT], HttpResponse],
) -> Callable[Concatenate[HttpRequest, ParamT], HttpResponse]:
    @wraps(view_func)
    def _wrapped_view_func(
        request: HttpRequest, /, *args: ParamT.args, **kwargs: ParamT.kwargs
    ) -> HttpResponse:
        role, api_key = get_basic_credentials(request)
        if "@" in role:
            log_data = RequestNotes.get_notes(request).log_data
            assert log_data is not None
            log_data["extra"] = "[non-server-key]"
            raise JsonableError(_("Must validate with valid Zulip server API key"))
        try:
            remote_server = validate_remote_server(request, role, api_key)
        except JsonableError as e:
            raise UnauthorizedError(e.msg)

        rate_limit_remote_server(request, remote_server, domain="api_by_remote_server")

        remote_server.last_request_datetime = timezone_now()
        remote_server.save(update_fields=["last_request_datetime"])

        return view_func(request, remote_server, *args, **kwargs)

    return _wrapped_view_func


@default_never_cache_responses
@csrf_exempt
def remote_server_dispatch(request: HttpRequest, /, **kwargs: Any) -> HttpResponse:
    result = get_target_view_function_or_response(request, kwargs)
    if isinstance(result, HttpResponse):
        return result
    target_function, _view_flags = result
    return authenticated_remote_server_view(target_function)(request, **kwargs)


def remote_server_path(
    route: str,
    **handlers: Callable[Concatenate[HttpRequest, RemoteZulipServer, ParamT], HttpResponse]
    | tuple[Callable[Concatenate[HttpRequest, RemoteZulipServer, ParamT], HttpResponse], set[str]],
) -> URLPattern:
    return path(route, remote_server_dispatch, handlers)
```

--------------------------------------------------------------------------------

````
