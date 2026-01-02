---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1092
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1092 of 1290)

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

---[FILE: thread_with_file_link_formatting_in_topic_name.json]---
Location: zulip-main/zerver/tests/fixtures/slack_fixtures/exported_messages_fixtures/thread_with_file_link_formatting_in_topic_name.json

```json
[
    {
        "text": "Look!",
        "user": "U061A1R2R",
        "ts": "1537139200.000002",
        "thread_ts": "1537139200.000002",
        "has_image": true,
        "channel_name": "random",
        "files": [
            {
                "url_private": "https://files.slack.com/apple.png",
                "title": "Apple",
                "name": "apple.png",
                "mimetype": "image/png",
                "timestamp": 9999,
                "created": 8888,
                "size": 3000000
            }
        ]
    },
    {
        "text": "Delicious",
        "user": "U061A5N1G",
        "ts": "1637139200.000002",
        "parent_user_id": "U061A1R2R",
        "thread_ts": "1537139200.000002",
        "channel_name": "random"
    }
]
```

--------------------------------------------------------------------------------

---[FILE: thread_with_long_topic_name.json]---
Location: zulip-main/zerver/tests/fixtures/slack_fixtures/exported_messages_fixtures/thread_with_long_topic_name.json

```json
[
    {
        "text": "random message but it is too long for the thread topic name",
        "user": "U061A5N1G",
        "ts": "1439868294.000008",
        "thread_ts": "1439868294.000008",
        "channel_name": "random"
    },
    {
        "text": "replying to the second thread :)",
        "user": "U061A1R2R",
        "ts": "1439869294.000008",
        "parent_user_id": "U061A5N1G",
        "thread_ts": "1439868294.000008",
        "channel_name": "random"
    },
    {
        "text": "random message but it is too long for the thread two electric boogaloo",
        "user": "U061A1R2R",
        "ts": "1439868294.000008",
        "thread_ts": "1439868294.000008",
        "channel_name": "random"
    },
    {
        "text": "second thread",
        "user": "U061A5N1G",
        "ts": "1439869294.000008",
        "parent_user_id": "U061A1R2R",
        "thread_ts": "1439868294.000008",
        "channel_name": "random"
    }
]
```

--------------------------------------------------------------------------------

---[FILE: thread_with_mention_syntax_in_topic_name.json]---
Location: zulip-main/zerver/tests/fixtures/slack_fixtures/exported_messages_fixtures/thread_with_mention_syntax_in_topic_name.json

```json
[
    {
        "text": "<@U061A1R2R> please reply to this message",
        "user": "U061A5N1G",
        "ts": "1437139200.000002",
        "thread_ts": "1437139200.000002",
        "channel_name": "random"
    },
    {
        "text": "Yes?",
        "user": "U061A1R2R",
        "ts": "1440869295.000008",
        "parent_user_id": "U061A5N1G",
        "thread_ts": "1437139200.000002",
        "channel_name": "random"
    }
]
```

--------------------------------------------------------------------------------

---[FILE: thread_with_text_formattings_in_topic_name.json]---
Location: zulip-main/zerver/tests/fixtures/slack_fixtures/exported_messages_fixtures/thread_with_text_formattings_in_topic_name.json

```json
[
    {
        "text": "*foo* _bar_ ~baz~ [qux](https://chat.zulip.org)",
        "user": "U061A1R2R",
        "ts": "1547139200.000002",
        "thread_ts": "1547139200.000002",
        "channel_name": "random"
    },
    {
        "text": "Delicious",
        "user": "U061A5N1G",
        "ts": "1637139200.000002",
        "parent_user_id": "U061A1R2R",
        "thread_ts": "1547139200.000002",
        "channel_name": "random"
    }
]
```

--------------------------------------------------------------------------------

---[FILE: users.json]---
Location: zulip-main/zerver/tests/fixtures/slack_fixtures/exported_messages_fixtures/users.json

```json
[
    {
        "id": "U066MTL5U",
        "name": "john doe",
        "deleted": false,
        "real_name": "John"
    },
    {
        "id": "U061A5N1G",
        "name": "jane doe",
        "deleted": false,
        "real_name": "Jane"
    },
    {
        "id": "U061A1R2R",
        "name": "jon",
        "deleted": false,
        "real_name": "Jon",
        "profile": {
            "email": "jon@example.com"
        }
    }
]
```

--------------------------------------------------------------------------------

---[FILE: img.svg]---
Location: zulip-main/zerver/tests/images/img.svg

```text
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->

<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   width="128"
   height="128"
   id="svg2"
   version="1.1"
   inkscape:version="0.48.4 r9939"
   sodipodi:docname="default-default-avatar.svg"
   inkscape:export-filename="/home/km/h/humbug/humbug/static/images/default-avatar.png"
   inkscape:export-xdpi="90"
   inkscape:export-ydpi="90">
  <defs
     id="defs4" />
  <sodipodi:namedview
     id="base"
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1.0"
     inkscape:pageopacity="0.0"
     inkscape:pageshadow="2"
     inkscape:zoom="1.28"
     inkscape:cx="-110.80535"
     inkscape:cy="59.888786"
     inkscape:document-units="px"
     inkscape:current-layer="layer1"
     showgrid="false"
     inkscape:window-width="1440"
     inkscape:window-height="873"
     inkscape:window-x="0"
     inkscape:window-y="567"
     inkscape:window-maximized="1" />
  <metadata
     id="metadata7">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g
     inkscape:label="Layer 1"
     inkscape:groupmode="layer"
     id="layer1"
     transform="translate(0,-924.36218)">
    <rect
       style="fill:#eeeeee;fill-opacity:1;stroke:none"
       id="rect2987"
       width="128"
       height="128"
       x="0"
       y="924.36218" />
    <text
       xml:space="preserve"
       style="font-size:118.2937088px;font-style:normal;font-weight:bold;line-height:125%;letter-spacing:0px;word-spacing:0px;fill:#cccccc;fill-opacity:1;stroke:none;font-family:Sans;-inkscape-font-specification:Sans Bold"
       x="28.563871"
       y="1029.661"
       id="text2989"
       sodipodi:linespacing="125%"><tspan
         sodipodi:role="line"
         id="tspan2991"
         x="28.563871"
         y="1029.661">?</tspan></text>
  </g>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: text.txt]---
Location: zulip-main/zerver/tests/images/text.txt

```text
Zulip is a powerful open source group chat application.
```

--------------------------------------------------------------------------------

---[FILE: application.py]---
Location: zulip-main/zerver/tornado/application.py
Signals: Django

```python
import tornado.web
from django.conf import settings
from django.core.handlers.base import BaseHandler
from tornado import autoreload

from zerver.lib.queue import TornadoQueueClient
from zerver.tornado.handlers import AsyncDjangoHandler


def setup_tornado_rabbitmq(queue_client: TornadoQueueClient) -> None:  # nocoverage
    # When tornado is shut down, disconnect cleanly from RabbitMQ
    autoreload.add_reload_hook(queue_client.close)


def create_tornado_application(*, autoreload: bool = False) -> tornado.web.Application:
    django_handler = BaseHandler()
    django_handler.load_middleware()

    urls = (
        r"/json/events",
        r"/api/v1/events",
        r"/api/v1/events/internal",
        r"/api/internal/notify_tornado",
        r"/api/internal/web_reload_clients",
    )

    return tornado.web.Application(
        [(url, AsyncDjangoHandler, dict(django_handler=django_handler)) for url in urls],
        debug=settings.DEBUG,
        autoreload=autoreload,
        # Disable Tornado's own request logging, since we have our own
        log_function=lambda x: None,
    )
```

--------------------------------------------------------------------------------

---[FILE: descriptors.py]---
Location: zulip-main/zerver/tornado/descriptors.py
Signals: Django

```python
from typing import TYPE_CHECKING, Optional

from django.conf import settings

if TYPE_CHECKING:
    from zerver.tornado.event_queue import ClientDescriptor

descriptors_by_handler_id: dict[int, "ClientDescriptor"] = {}


def get_descriptor_by_handler_id(handler_id: int) -> Optional["ClientDescriptor"]:
    return descriptors_by_handler_id.get(handler_id)


def set_descriptor_by_handler_id(handler_id: int, client_descriptor: "ClientDescriptor") -> None:
    descriptors_by_handler_id[handler_id] = client_descriptor


def clear_descriptor_by_handler_id(handler_id: int) -> None:
    del descriptors_by_handler_id[handler_id]


current_port: int | None = None


def is_current_port(port: int) -> int | None:
    return settings.TEST_SUITE or current_port == port


def set_current_port(port: int) -> None:
    global current_port
    current_port = port
```

--------------------------------------------------------------------------------

---[FILE: django_api.py]---
Location: zulip-main/zerver/tornado/django_api.py
Signals: Django

```python
from collections import defaultdict
from collections.abc import Iterable, Mapping, Sequence
from functools import lru_cache
from typing import Any
from urllib.parse import urlsplit

import orjson
import requests
from django.conf import settings
from django.db import transaction
from requests.adapters import ConnectionError, HTTPAdapter
from requests.models import PreparedRequest, Response
from typing_extensions import override
from urllib3.util import Retry

from zerver.lib.partial import partial
from zerver.lib.queue import queue_json_publish_rollback_unsafe
from zerver.models import Client, Realm, UserProfile
from zerver.models.users import get_user_profile_narrow_by_id
from zerver.tornado.sharding import (
    get_realm_tornado_ports,
    get_tornado_url,
    get_user_id_tornado_port,
    get_user_tornado_port,
    notify_tornado_queue_name,
)


class TornadoAdapter(HTTPAdapter):
    def __init__(self) -> None:
        # All of the POST requests we make to Tornado are safe to
        # retry; allow retries of them, which is not the default.
        retry_methods = Retry.DEFAULT_ALLOWED_METHODS | {"POST"}
        retry = Retry(total=3, backoff_factor=1, allowed_methods=retry_methods)
        super().__init__(max_retries=retry)

    @override
    def send(
        self,
        request: PreparedRequest,
        stream: bool = False,
        timeout: None | float | tuple[float, float] | tuple[float, None] = 0.5,
        verify: bool | str = True,
        cert: None | bytes | str | tuple[bytes | str, bytes | str] = None,
        proxies: Mapping[str, str] | None = None,
    ) -> Response:
        # Don't talk to Tornado through proxies, which only allow
        # requests to external hosts.
        proxies = {}
        try:
            resp = super().send(
                request, stream=stream, timeout=timeout, verify=verify, cert=cert, proxies=proxies
            )
        except ConnectionError:
            parsed_url = urlsplit(request.url)
            logfile = (
                f"tornado-{parsed_url.port}.log"
                if settings.TORNADO_PROCESSES > 1
                else "tornado.log"
            )
            raise ConnectionError(
                f"Django cannot connect to Tornado server ({request.url}); "
                f"check {settings.ERROR_FILE_LOG_PATH} and {logfile}"
            )
        resp.raise_for_status()
        return resp


@lru_cache(None)
def requests_client() -> requests.Session:
    c = requests.Session()
    adapter = TornadoAdapter()
    for scheme in ("https://", "http://"):
        c.mount(scheme, adapter)
    return c


def request_event_queue(
    user_profile: UserProfile,
    user_client: Client,
    apply_markdown: bool,
    client_gravatar: bool,
    slim_presence: bool,
    queue_lifespan_secs: int,
    event_types: Sequence[str] | None = None,
    all_public_streams: bool = False,
    narrow: Iterable[Sequence[str]] = [],
    bulk_message_deletion: bool = False,
    stream_typing_notifications: bool = False,
    pronouns_field_type_supported: bool = True,
    linkifier_url_template: bool = False,
    user_list_incomplete: bool = False,
    include_deactivated_groups: bool = False,
    archived_channels: bool = False,
    empty_topic_name: bool = False,
    simplified_presence_events: bool = False,
) -> str | None:
    if not settings.USING_TORNADO:
        return None

    # We make sure to pre-fill the narrow user cache, to save
    # session-based Tornado (/json/events) from having to go to the
    # database.
    get_user_profile_narrow_by_id(user_profile.id)

    tornado_url = get_tornado_url(get_user_tornado_port(user_profile))
    req = {
        "dont_block": "true",
        "apply_markdown": orjson.dumps(apply_markdown),
        "client_gravatar": orjson.dumps(client_gravatar),
        "slim_presence": orjson.dumps(slim_presence),
        "all_public_streams": orjson.dumps(all_public_streams),
        "client": "internal",
        "user_profile_id": user_profile.id,
        "user_client": user_client.name,
        "narrow": orjson.dumps(narrow),
        "secret": settings.SHARED_SECRET,
        "lifespan_secs": queue_lifespan_secs,
        "bulk_message_deletion": orjson.dumps(bulk_message_deletion),
        "stream_typing_notifications": orjson.dumps(stream_typing_notifications),
        "pronouns_field_type_supported": orjson.dumps(pronouns_field_type_supported),
        "linkifier_url_template": orjson.dumps(linkifier_url_template),
        "user_list_incomplete": orjson.dumps(user_list_incomplete),
        "include_deactivated_groups": orjson.dumps(include_deactivated_groups),
        "archived_channels": orjson.dumps(archived_channels),
        "empty_topic_name": orjson.dumps(empty_topic_name),
        "simplified_presence_events": orjson.dumps(simplified_presence_events),
    }

    if event_types is not None:
        req["event_types"] = orjson.dumps(event_types)

    resp = requests_client().post(tornado_url + "/api/v1/events/internal", data=req)
    return resp.json()["queue_id"]


def get_user_events(
    user_profile: UserProfile, queue_id: str, last_event_id: int
) -> list[dict[str, Any]]:
    if not settings.USING_TORNADO:
        return []

    # Pre-fill the narrow user cache, to save session-based Tornado
    # (/json/events) from having to go to the database.  This is
    # almost certainly filled already, from above, but there is little
    # harm in forcing it.
    get_user_profile_narrow_by_id(user_profile.id)

    tornado_url = get_tornado_url(get_user_tornado_port(user_profile))
    post_data: dict[str, Any] = {
        "queue_id": queue_id,
        "last_event_id": last_event_id,
        "dont_block": "true",
        "user_profile_id": user_profile.id,
        "secret": settings.SHARED_SECRET,
        "client": "internal",
    }
    resp = requests_client().post(tornado_url + "/api/v1/events/internal", data=post_data)
    return resp.json()["events"]


def send_notification_http(port: int, data: Mapping[str, Any]) -> None:
    if not settings.USING_TORNADO or settings.RUNNING_INSIDE_TORNADO:
        # To allow the backend test suite to not require a separate
        # Tornado process, we simply call the process_notification
        # handler directly rather than making the notify_tornado HTTP
        # request.  It would perhaps be better to instead implement
        # this via some sort of `responses` module configuration, but
        # perhaps it's more readable to have the logic live here.
        #
        # We use an import local to this function to prevent this hack
        # from creating import cycles.
        from zerver.tornado.event_queue import process_notification

        process_notification(data)
    else:
        # This codepath is only used when running full-stack puppeteer
        # tests, which don't have RabbitMQ but do have a separate
        # Tornado process.
        tornado_url = get_tornado_url(port)
        requests_client().post(
            tornado_url + "/api/internal/notify_tornado",
            data=dict(data=orjson.dumps(data), secret=settings.SHARED_SECRET),
        )


# The core function for sending an event from Django to Tornado (which
# will then push it to web and mobile clients for the target users).
#
# One should generally use `send_event_on_commit` unless there's a strong
# reason to use `send_event_rollback_unsafe` directly, as it doesn't wait
# for the db transaction (within which it gets called, if any) to commit
# and sends event irrespective of commit or rollback.
#
# By convention, `send_event_rollback_unsafe` / `send_event_on_commit`
# should only be called from zerver/actions/*.py, which helps make it
# easy to find event generation code.
#
# Every call point should be covered by a test in `test_events.py`,
# with the schema verified in `zerver/lib/event_schema.py`.
#
# See https://zulip.readthedocs.io/en/latest/subsystems/events-system.html
def send_event_rollback_unsafe(
    realm: Realm, event: Mapping[str, Any], users: Iterable[int] | Iterable[Mapping[str, Any]]
) -> None:
    """`users` is a list of user IDs, or in some special cases like message
    send/update or embeds, dictionaries containing extra data."""
    realm_ports = get_realm_tornado_ports(realm)
    if len(realm_ports) == 1:
        port_user_map = {realm_ports[0]: list(users)}
    else:
        port_user_map = defaultdict(list)
        for user in users:
            user_id = user if isinstance(user, int) else user["id"]
            port_user_map[get_user_id_tornado_port(realm_ports, user_id)].append(user)

    for port, port_users in port_user_map.items():
        queue_json_publish_rollback_unsafe(
            notify_tornado_queue_name(port),
            dict(event=event, users=port_users),
            partial(send_notification_http, port),
        )


def send_event_on_commit(
    realm: Realm, event: Mapping[str, Any], users: Iterable[int] | Iterable[Mapping[str, Any]]
) -> None:
    if not settings.USING_RABBITMQ:
        # In tests, round-trip the event through JSON, as happens with
        # RabbitMQ.  zerver.lib.queue also enforces this, but the
        # on-commit nature of the event sending makes it difficult to
        # trace which event was at fault -- so we also check it
        # immediately, here.
        try:
            event = orjson.loads(orjson.dumps(event))
        except TypeError:
            print(event)
            raise
    transaction.on_commit(lambda: send_event_rollback_unsafe(realm, event, users))
```

--------------------------------------------------------------------------------

````
