---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 1059
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1059 of 1290)

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

---[FILE: test_timeout.py]---
Location: zulip-main/zerver/tests/test_timeout.py

```python
import sys
import time
import traceback
from unittest import skipIf

from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.timeout import TimeoutExpiredError, unsafe_timeout


class TimeoutTestCase(ZulipTestCase):
    # We can't use assertRaises because that doesn't store the
    # traceback, which we want to verify

    def something_exceptional(self) -> int:
        raise ValueError("Something went wrong")

    def sleep_x_seconds_y_times(self, x: float, y: int) -> int:
        for i in range(y):
            time.sleep(x)
        return 42  # nocoverage

    def test_timeout_returns(self) -> None:
        ret = unsafe_timeout(1, lambda: 42)
        self.assertEqual(ret, 42)

    def test_timeout_exceeded(self) -> None:
        try:
            unsafe_timeout(1, lambda: self.sleep_x_seconds_y_times(0.1, 50))
            raise AssertionError("Failed to raise a timeout")
        except TimeoutExpiredError as exc:
            tb = traceback.format_tb(exc.__traceback__)
            self.assertIn("in sleep_x_seconds_y_times", tb[-1])
            self.assertIn("time.sleep(x)", tb[-1])

    def test_timeout_raises(self) -> None:
        try:
            unsafe_timeout(1, self.something_exceptional)
            raise AssertionError("Failed to raise an exception")
        except ValueError as exc:
            tb = traceback.format_tb(exc.__traceback__)
            self.assertIn("in something_exceptional", tb[-1])
            self.assertIn("raise ValueError", tb[-1])

    @skipIf(sys.version_info >= (3, 11), "https://github.com/nedbat/coveragepy/issues/1626")
    def test_timeout_warn(self) -> None:
        # If the sleep is long enough, it will outlast the attempts to
        # kill it
        with self.assertLogs(level="WARNING") as m:
            try:
                unsafe_timeout(1, lambda: self.sleep_x_seconds_y_times(5, 1))
                raise AssertionError("Failed to raise a timeout")
            except TimeoutExpiredError as exc:
                tb = traceback.format_tb(exc.__traceback__)
                self.assertNotIn("in sleep_x_seconds_y_times", tb[-1])
                self.assertIn("raise TimeoutExpiredError", tb[-1])
        self.assertEqual(m.output, ["WARNING:root:Failed to time out backend thread"])
```

--------------------------------------------------------------------------------

---[FILE: test_timestamp.py]---
Location: zulip-main/zerver/tests/test_timestamp.py
Signals: Django

```python
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

from dateutil import parser
from django.utils.translation import override as override_language

from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.timestamp import (
    TimeZoneMissingError,
    TimeZoneNotUTCError,
    ceiling_to_hour,
    convert_to_UTC,
    datetime_to_global_time,
    datetime_to_timestamp,
    floor_to_day,
    floor_to_hour,
    format_datetime_to_string,
    timestamp_to_datetime,
)


class TestTimestamp(ZulipTestCase):
    def test_datetime_and_timestamp_conversions(self) -> None:
        timestamp = 1483228800
        for dt in [
            parser.parse("2017-01-01 00:00:00.123 UTC"),
            parser.parse("2017-01-01 00:00:00.123").replace(tzinfo=timezone.utc),
        ]:
            self.assertEqual(timestamp_to_datetime(timestamp), dt - timedelta(microseconds=123000))
            self.assertEqual(datetime_to_timestamp(dt), timestamp)

        for dt in [
            parser.parse("2017-01-01 00:00:00.123+01:00"),
            parser.parse("2017-01-01 00:00:00.123"),
        ]:
            with self.assertRaises(TimeZoneNotUTCError):
                datetime_to_timestamp(dt)

    def test_convert_to_UTC(self) -> None:
        utc_datetime = parser.parse("2017-01-01 00:00:00.123 UTC")
        for dt in [
            parser.parse("2017-01-01 00:00:00.123").replace(tzinfo=timezone.utc),
            parser.parse("2017-01-01 00:00:00.123"),
            parser.parse("2017-01-01 05:00:00.123+05"),
        ]:
            self.assertEqual(convert_to_UTC(dt), utc_datetime)

    def test_enforce_UTC(self) -> None:
        non_utc_datetime = parser.parse("2017-01-01 00:00:00.123")
        for function in [floor_to_hour, floor_to_day, ceiling_to_hour, ceiling_to_hour]:
            with self.assertRaises(TimeZoneNotUTCError):
                function(non_utc_datetime)

    def test_format_datetime_to_string(self) -> None:
        dt = datetime(2001, 2, 3, 4, 5, 6, tzinfo=timezone.utc)
        self.assertEqual(format_datetime_to_string(dt, True), "Sat, Feb 3, 2001, 04:05 GMT")
        dt = datetime(2001, 2, 3, 4, 5, 6, tzinfo=timezone(timedelta(hours=7, minutes=8)))
        self.assertEqual(format_datetime_to_string(dt, True), "Sat, Feb 3, 2001, 04:05 GMT+7:08")
        dt = datetime(2001, 2, 3, 4, 5, 6, tzinfo=timezone(-timedelta(hours=7, minutes=8)))
        self.assertEqual(format_datetime_to_string(dt, True), "Sat, Feb 3, 2001, 04:05 GMT-7:08")
        dt = datetime(2001, 2, 3, 4, 5, 6, tzinfo=ZoneInfo("America/Los_Angeles"))
        self.assertEqual(format_datetime_to_string(dt, True), "Sat, Feb 3, 2001, 04:05 PST")
        self.assertRegex(
            format_datetime_to_string(dt, False), r"^Sat, Feb 3, 2001, 4:05[ \u202f]AM PST$"
        )
        with override_language("ja-JP"):
            self.assertEqual(format_datetime_to_string(dt, True), "2001年2月3日(土) 4:05 GMT-8")
            self.assertEqual(
                format_datetime_to_string(dt, False), "2001年2月3日(土) 午前4:05 GMT-8"
            )

    def test_datetime_to_global_time(self) -> None:
        dt = datetime(2001, 2, 3, 4, 5, 6, tzinfo=timezone.utc)
        self.assertEqual(datetime_to_global_time(dt), "<time:2001-02-03T04:05:06+00:00>")
        dt = datetime(2001, 2, 3, 4, 5, 6, tzinfo=timezone(timedelta(hours=7, minutes=8)))
        self.assertEqual(datetime_to_global_time(dt), "<time:2001-02-03T04:05:06+07:08>")
        dt = datetime(2001, 2, 3, 4, 5, 6, tzinfo=timezone(-timedelta(hours=7, minutes=8)))
        self.assertEqual(datetime_to_global_time(dt), "<time:2001-02-03T04:05:06-07:08>")
        dt = datetime(2001, 2, 3, 4, 5, 6, tzinfo=ZoneInfo("America/Los_Angeles"))
        self.assertEqual(datetime_to_global_time(dt), "<time:2001-02-03T04:05:06-08:00>")
        with self.assertRaises(TimeZoneMissingError):
            dt = datetime(2001, 2, 3, 4, 5, 6)  # noqa: DTZ001
            datetime_to_global_time(dt)
```

--------------------------------------------------------------------------------

---[FILE: test_timezone.py]---
Location: zulip-main/zerver/tests/test_timezone.py
Signals: Django

```python
import zoneinfo
from datetime import datetime, timezone

from django.utils.timezone import now as timezone_now

from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.timezone import canonicalize_timezone, common_timezones


class TimeZoneTest(ZulipTestCase):
    def test_canonicalize_timezone(self) -> None:
        self.assertEqual(canonicalize_timezone("America/Los_Angeles"), "America/Los_Angeles")
        self.assertEqual(canonicalize_timezone("US/Pacific"), "America/Los_Angeles")
        self.assertEqual(canonicalize_timezone("Gondor/Minas_Tirith"), "Gondor/Minas_Tirith")

    def test_common_timezones(self) -> None:
        ambiguous_abbrevs = [
            ("CDT", -18000.0),  # Central Daylight Time
            ("CDT", -14400.0),  # Cuba Daylight Time
            ("CST", -21600.0),  # Central Standard Time
            ("CST", +28800.0),  # China Standard Time
            ("CST", -18000.0),  # Cuba Standard Time
            ("PST", -28800.0),  # Pacific Standard Time
            ("PST", +28800.0),  # Philippine Standard Time
            ("IST", +19800.0),  # India Standard Time
            ("IST", +7200.0),  # Israel Standard Time
            ("IST", +3600.0),  # Ireland Standard Time
        ]
        missing = set(dict(reversed(ambiguous_abbrevs)).items()) - set(common_timezones.items())
        assert not missing, missing

        now = timezone_now()
        dates = [
            datetime(now.year, 6, 21, tzinfo=timezone.utc),
            datetime(now.year, 12, 21, tzinfo=timezone.utc),
        ]
        extra = {*common_timezones.items(), *ambiguous_abbrevs}
        extra -= {("MET", +3600), ("MEST", +7200)}  # Removed in tzdata 2024b
        for name in zoneinfo.available_timezones():
            tz = zoneinfo.ZoneInfo(name)
            for date in dates:
                abbrev = tz.tzname(date)
                assert abbrev is not None
                if abbrev.startswith(("-", "+")):
                    continue
                delta = tz.utcoffset(date)
                assert delta is not None
                offset = delta.total_seconds()
                assert (
                    common_timezones[abbrev] == offset or (abbrev, offset) in ambiguous_abbrevs
                ), (name, abbrev, offset)
                extra.discard((abbrev, offset))
        assert not extra, extra
```

--------------------------------------------------------------------------------

---[FILE: test_topic_link_util.py]---
Location: zulip-main/zerver/tests/test_topic_link_util.py

```python
from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.topic_link_util import (
    get_message_link_syntax,
    get_stream_link_syntax,
    get_stream_topic_link_syntax,
)


class TestTopicLinkUtil(ZulipTestCase):
    def test_stream_link_syntax(self) -> None:
        sweden_id = self.make_stream("Sweden").id
        money_id = self.make_stream("$$MONEY$$").id
        md_id = self.make_stream("Markdown [md]").id

        self.assertEqual(get_stream_link_syntax(sweden_id, "Sweden"), "#**Sweden**")

        self.assertEqual(
            get_stream_link_syntax(money_id, "$$MONEY$$"),
            f"[#&#36;&#36;MONEY&#36;&#36;](#narrow/channel/{money_id}-.24.24MONEY.24.24)",
        )

        self.assertEqual(
            get_stream_link_syntax(md_id, "Markdown [md]"),
            f"[#Markdown &#91;md&#93;](#narrow/channel/{md_id}-Markdown-.5Bmd.5D)",
        )

    def test_stream_topic_link_syntax(self) -> None:
        sweden_id = self.make_stream("Sweden").id
        money_id = self.make_stream("$$MONEY$$").id
        denmark_id = self.get_stream_id("Denmark")

        self.assertEqual(
            get_stream_topic_link_syntax(sweden_id, "Sweden", "topic"), "#**Sweden>topic**"
        )
        self.assertEqual(
            get_stream_topic_link_syntax(sweden_id, "Sweden", "test `test` test"),
            f"[#Sweden > test &#96;test&#96; test](#narrow/channel/{sweden_id}-Sweden/topic/test.20.60test.60.20test)",
        )
        self.assertEqual(
            get_stream_topic_link_syntax(denmark_id, "Denmark", "test `test` test`s"),
            f"[#Denmark > test &#96;test&#96; test&#96;s](#narrow/channel/{denmark_id}-Denmark/topic/test.20.60test.60.20test.60s)",
        )
        self.assertEqual(
            get_stream_topic_link_syntax(sweden_id, "Sweden", "error due to *"),
            f"[#Sweden > error due to &#42;](#narrow/channel/{sweden_id}-Sweden/topic/error.20due.20to.20*)",
        )
        self.assertEqual(
            get_stream_topic_link_syntax(sweden_id, "Sweden", "*asterisk"),
            f"[#Sweden > &#42;asterisk](#narrow/channel/{sweden_id}-Sweden/topic/*asterisk)",
        )
        self.assertEqual(
            get_stream_topic_link_syntax(sweden_id, "Sweden", "greaterthan>"),
            f"[#Sweden > greaterthan&gt;](#narrow/channel/{sweden_id}-Sweden/topic/greaterthan.3E)",
        )
        self.assertEqual(
            get_stream_topic_link_syntax(money_id, "$$MONEY$$", "dollar"),
            f"[#&#36;&#36;MONEY&#36;&#36; > dollar](#narrow/channel/{money_id}-.24.24MONEY.24.24/topic/dollar)",
        )
        self.assertEqual(
            get_stream_topic_link_syntax(sweden_id, "Sweden", "swe$$dish"),
            f"[#Sweden > swe&#36;&#36;dish](#narrow/channel/{sweden_id}-Sweden/topic/swe.24.24dish)",
        )
        self.assertEqual(
            get_stream_topic_link_syntax(sweden_id, "Sweden", "&ab"),
            f"[#Sweden > &amp;ab](#narrow/channel/{sweden_id}-Sweden/topic/.26ab)",
        )
        self.assertEqual(
            get_stream_topic_link_syntax(sweden_id, "Sweden", "&ab]"),
            f"[#Sweden > &amp;ab&#93;](#narrow/channel/{sweden_id}-Sweden/topic/.26ab.5D)",
        )
        self.assertEqual(
            get_stream_topic_link_syntax(sweden_id, "Sweden", "&a[b"),
            f"[#Sweden > &amp;a&#91;b](#narrow/channel/{sweden_id}-Sweden/topic/.26a.5Bb)",
        )
        self.assertEqual(
            get_stream_topic_link_syntax(sweden_id, "Sweden", ""),
            "#**Sweden>**",
        )
        self.assertEqual(
            get_stream_topic_link_syntax(sweden_id, "Sw*den", ""),
            f"[#Sw&#42;den > general chat](#narrow/channel/{sweden_id}-Sw*den/topic/)",
        )

    def test_message_link_syntax(self) -> None:
        sweden_id = self.make_stream("Sweden").id
        self.assertEqual(
            get_message_link_syntax(sweden_id, "Sweden", "topic", 123),
            "#**Sweden>topic@123**",
        )
        self.assertEqual(
            get_message_link_syntax(sweden_id, "Sweden", "", 123),
            "#**Sweden>@123**",
        )
        self.assertEqual(
            get_message_link_syntax(sweden_id, "Sw*den", "topic", 123),
            f"[#Sw&#42;den > topic @ 💬](#narrow/channel/{sweden_id}-Sw*den/topic/topic/near/123)",
        )
        self.assertEqual(
            get_message_link_syntax(sweden_id, "Sw*den", "", 123),
            f"[#Sw&#42;den > general chat @ 💬](#narrow/channel/{sweden_id}-Sw*den/topic//near/123)",
        )
```

--------------------------------------------------------------------------------

---[FILE: test_tornado.py]---
Location: zulip-main/zerver/tests/test_tornado.py
Signals: Django

```python
import asyncio
import socket
from collections.abc import AsyncIterator, Iterator
from contextlib import asynccontextmanager, contextmanager
from typing import Any, TypeVar
from unittest import mock
from urllib.parse import urlencode

import orjson
from asgiref.sync import sync_to_async
from django.conf import settings
from django.core import signals
from django.db import close_old_connections
from django.test import override_settings
from tornado import netutil
from tornado.httpclient import AsyncHTTPClient, HTTPResponse
from tornado.httpserver import HTTPServer
from typing_extensions import override

from zerver.lib.cache import user_profile_narrow_by_id_cache_key
from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.test_helpers import cache_tries_captured, queries_captured
from zerver.models import UserProfile
from zerver.tornado import event_queue
from zerver.tornado.application import create_tornado_application
from zerver.tornado.event_queue import process_event

T = TypeVar("T")


class TornadoWebTestCase(ZulipTestCase):
    @asynccontextmanager
    async def with_tornado(self) -> AsyncIterator[None]:
        super().setUp()

        with override_settings(DEBUG=False):
            self.http_server = HTTPServer(create_tornado_application())
        sock = netutil.bind_sockets(0, "127.0.0.1", family=socket.AF_INET)[0]
        self.port = sock.getsockname()[1]
        self.http_server.add_sockets([sock])
        self.http_client = AsyncHTTPClient()
        signals.request_started.disconnect(close_old_connections)
        signals.request_finished.disconnect(close_old_connections)
        self.session_cookie: dict[str, str] | None = None
        try:
            yield
        finally:
            self.http_client.close()
            self.http_server.stop()
            await self.http_server.close_all_connections()
            tasks = set(asyncio.all_tasks()) - {asyncio.current_task()}
            if tasks:  # nocoverage
                await asyncio.wait(tasks)

    async def fetch_async(self, method: str, path: str, **kwargs: Any) -> HTTPResponse:
        self.add_session_cookie(kwargs)
        self.set_http_headers(kwargs, skip_user_agent=True)
        if "HTTP_HOST" in kwargs:
            kwargs["headers"]["Host"] = kwargs["HTTP_HOST"]
            del kwargs["HTTP_HOST"]
        return await self.http_client.fetch(
            f"http://127.0.0.1:{self.port}{path}", method=method, **kwargs
        )

    @override
    def login_user(self, *args: Any, **kwargs: Any) -> None:
        super().login_user(*args, **kwargs)
        session_cookie = settings.SESSION_COOKIE_NAME
        session_key = self.client.session.session_key
        self.session_cookie = {
            "Cookie": f"{session_cookie}={session_key}",
        }

    def get_session_cookie(self) -> dict[str, str]:
        return {} if self.session_cookie is None else self.session_cookie

    def add_session_cookie(self, kwargs: dict[str, Any]) -> None:
        # TODO: Currently only allows session cookie
        headers = kwargs.get("headers", {})
        headers.update(self.get_session_cookie())
        kwargs["headers"] = headers

    async def create_queue(self, **kwargs: Any) -> str:
        response = await self.fetch_async("GET", "/json/events?dont_block=true", subdomain="zulip")
        self.assertEqual(response.code, 200)
        body = orjson.loads(response.body)
        self.assertEqual(body["events"], [])
        self.assertIn("queue_id", body)
        return body["queue_id"]


class EventsTestCase(TornadoWebTestCase):
    async def test_create_queue(self) -> None:
        async with self.with_tornado():
            await sync_to_async(lambda: self.login_user(self.example_user("hamlet")))()
            queue_id = await self.create_queue()
            self.assertIn(queue_id, event_queue.clients)

    @contextmanager
    def mocked_events(self, user_profile: UserProfile, event: dict[str, object]) -> Iterator[None]:
        def process_events() -> None:
            users = [user_profile.id]
            process_event(event, users)

        def wrapped_fetch_events(**query: Any) -> dict[str, Any]:
            ret = event_queue.fetch_events(**query)
            asyncio.get_running_loop().call_soon(process_events)
            return ret

        with mock.patch("zerver.tornado.views.fetch_events", side_effect=wrapped_fetch_events):
            yield

    async def test_events_async(self) -> None:
        async with self.with_tornado():
            user_profile = await sync_to_async(lambda: self.example_user("hamlet"))()
            await sync_to_async(lambda: self.login_user(user_profile))()
            event_queue_id = await self.create_queue()
            data = {
                "queue_id": event_queue_id,
                "last_event_id": -1,
            }

            path = f"/json/events?{urlencode(data)}"

            with self.mocked_events(user_profile, {"type": "test", "data": "test data"}):
                response = await self.fetch_async("GET", path)

            self.assertEqual(response.headers["Vary"], "Accept-Language, Cookie")
            data = orjson.loads(response.body)
            self.assertEqual(
                data["events"],
                [
                    {"type": "test", "data": "test data", "id": 0},
                ],
            )
            self.assertEqual(data["result"], "success")

    async def test_events_caching(self) -> None:
        async with self.with_tornado():
            user_profile = await sync_to_async(lambda: self.example_user("hamlet"))()
            await sync_to_async(lambda: self.login_user(user_profile))()
            event_queue_id = await self.create_queue()
            data = {
                "queue_id": event_queue_id,
                "last_event_id": -1,
            }

            path = f"/json/events?{urlencode(data)}"

            with (
                self.mocked_events(user_profile, {"type": "test", "data": "test data"}),
                cache_tries_captured() as cache_gets,
                queries_captured() as queries,
            ):
                await self.fetch_async("GET", path)

                # Two cache fetches -- for the user and the client.  In
                # production, the session would also be a cache access,
                # but tests don't use cached sessions.
                self.assert_length(cache_gets, 2)
                self.assertEqual(
                    cache_gets[0],
                    ("get", user_profile_narrow_by_id_cache_key(user_profile.id), None),
                )
                self.assertEqual(cache_gets[1][0], "get")
                assert isinstance(cache_gets[1][1], str)
                self.assertTrue(cache_gets[1][1].startswith("get_client:"))

                # Three database queries -- session, user, and client.
                # The user query should remain small; it is currently 470
                # bytes, but anything under 1k should be Fine.
                self.assert_length(queries, 3)
                self.assertIn("django_session", queries[0].sql)
                self.assertIn("zerver_userprofile", queries[1].sql)
                self.assertLessEqual(len(queries[1].sql), 1024)
                self.assertIn("zerver_client", queries[2].sql)

            # Perform the same request again, preserving the caches.  We
            # should only see one database query -- the session.  As noted
            # above, in production even that would be cached.
            with (
                self.mocked_events(user_profile, {"type": "test", "data": "test data"}),
                cache_tries_captured() as cache_gets,
                queries_captured(keep_cache_warm=True) as queries,
            ):
                await self.fetch_async("GET", path)
                self.assert_length(cache_gets, 1)
                self.assertEqual(
                    cache_gets[0],
                    ("get", user_profile_narrow_by_id_cache_key(user_profile.id), None),
                )
                # Client is cached in-process-memory, so doesn't even see
                # a memcached hit

                self.assert_length(queries, 1)
                self.assertIn("django_session", queries[0].sql)
```

--------------------------------------------------------------------------------

---[FILE: test_transfer.py]---
Location: zulip-main/zerver/tests/test_transfer.py
Signals: Django

```python
import os
from unittest.mock import Mock, patch

from django.conf import settings
from moto.core.decorator import mock_aws

from zerver.actions.realm_emoji import check_add_realm_emoji
from zerver.lib.avatar_hash import user_avatar_path
from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.test_helpers import (
    avatar_disk_path,
    create_s3_buckets,
    get_test_image_file,
    read_test_image_file,
)
from zerver.lib.thumbnail import ThumbnailFormat, resize_emoji
from zerver.lib.transfer import (
    transfer_avatars_to_s3,
    transfer_emoji_to_s3,
    transfer_message_files_to_s3,
    transfer_uploads_to_s3,
)
from zerver.lib.upload import upload_message_attachment
from zerver.models import Attachment, RealmEmoji


class TransferUploadsToS3Test(ZulipTestCase):
    @patch("zerver.lib.transfer.transfer_avatars_to_s3")
    @patch("zerver.lib.transfer.transfer_message_files_to_s3")
    @patch("zerver.lib.transfer.transfer_emoji_to_s3")
    def test_transfer_uploads_to_s3(self, m3: Mock, m2: Mock, m1: Mock) -> None:
        transfer_uploads_to_s3(4)

        m1.assert_called_with(4)
        m2.assert_called_with(4)
        m3.assert_called_with(4)

    @mock_aws
    def test_transfer_avatars_to_s3(self) -> None:
        bucket = create_s3_buckets(settings.S3_AVATAR_BUCKET)[0]

        self.login("hamlet")
        with get_test_image_file("img.png") as image_file:
            self.client_post("/json/users/me/avatar", {"file": image_file})

        user = self.example_user("hamlet")

        with self.assertLogs(level="INFO"):
            transfer_avatars_to_s3(1)

        path_id = user_avatar_path(user)
        image_key = bucket.Object(path_id + ".png")
        original_image_key = bucket.Object(path_id + ".original")
        medium_image_key = bucket.Object(path_id + "-medium.png")

        self.assert_length(list(bucket.objects.all()), 3)
        with open(avatar_disk_path(user), "rb") as f:
            self.assertEqual(image_key.get()["Body"].read(), f.read())
        with open(avatar_disk_path(user, original=True), "rb") as f:
            self.assertEqual(original_image_key.get()["Body"].read(), f.read())
        with open(avatar_disk_path(user, medium=True), "rb") as f:
            self.assertEqual(medium_image_key.get()["Body"].read(), f.read())

    @mock_aws
    def test_transfer_message_files(self) -> None:
        bucket = create_s3_buckets(settings.S3_AUTH_UPLOADS_BUCKET)[0]
        hamlet = self.example_user("hamlet")
        othello = self.example_user("othello")

        upload_message_attachment("dummy1.txt", "text/plain", b"zulip1!", hamlet)
        upload_message_attachment("dummy2.txt", "text/plain", b"zulip2!", othello)
        with (
            self.thumbnail_formats(ThumbnailFormat("webp", 100, 75, animated=False)),
            self.captureOnCommitCallbacks(execute=True),
        ):
            access_path, _ = upload_message_attachment(
                "img.png", "image/png", read_test_image_file("img.png"), hamlet
            )
        self.assertTrue(access_path.startswith("/user_uploads/"))
        image_path_id = access_path.removeprefix("/user_uploads/")
        assert settings.LOCAL_FILES_DIR is not None
        thumbnail_path = os.path.join(
            settings.LOCAL_FILES_DIR, "thumbnail", image_path_id, "100x75.webp"
        )
        self.assertTrue(os.path.exists(thumbnail_path))

        with self.assertLogs(level="INFO"):
            transfer_message_files_to_s3(1)

        attachments = Attachment.objects.all().order_by("id")

        self.assert_length(list(bucket.objects.all()), 4)

        s3_dummy1 = bucket.Object(attachments[0].path_id).get()
        self.assertEqual(s3_dummy1["Body"].read(), b"zulip1!")
        self.assertEqual(
            s3_dummy1["Metadata"],
            {"realm_id": str(attachments[0].realm_id), "user_profile_id": str(hamlet.id)},
        )

        s3_dummy2 = bucket.Object(attachments[1].path_id).get()
        self.assertEqual(s3_dummy2["Body"].read(), b"zulip2!")
        self.assertEqual(
            s3_dummy2["Metadata"],
            {"realm_id": str(attachments[1].realm_id), "user_profile_id": str(othello.id)},
        )

        s3_image = bucket.Object(attachments[2].path_id).get()
        self.assertEqual(
            s3_image["Body"].read(),
            read_test_image_file("img.png"),
        )
        self.assertEqual(
            s3_image["Metadata"],
            {"realm_id": str(attachments[2].realm_id), "user_profile_id": str(hamlet.id)},
        )

        s3_image_thumbnail = bucket.Object(
            os.path.join("thumbnail", attachments[2].path_id, "100x75.webp")
        ).get()
        self.assertEqual(s3_image_thumbnail["Metadata"], {})
        with open(thumbnail_path, "rb") as thumbnail_file:
            self.assertEqual(
                s3_image_thumbnail["Body"].read(),
                thumbnail_file.read(),
            )

    @mock_aws
    def test_transfer_emoji_to_s3(self) -> None:
        bucket = create_s3_buckets(settings.S3_AVATAR_BUCKET)[0]
        othello = self.example_user("othello")
        RealmEmoji.objects.all().delete()

        emoji_name = "emoji.png"

        with get_test_image_file("img.png") as image_file:
            emoji = check_add_realm_emoji(
                othello.realm, emoji_name, othello, image_file, "image/png"
            )

        emoji_path = RealmEmoji.PATH_ID_TEMPLATE.format(
            realm_id=othello.realm_id,
            emoji_file_name=emoji.file_name,
        )

        with self.assertLogs(level="INFO"):
            transfer_emoji_to_s3(1)

        self.assert_length(list(bucket.objects.all()), 2)
        original_key = bucket.Object(emoji_path + ".original")
        resized_key = bucket.Object(emoji_path)

        image_data = read_test_image_file("img.png")
        resized_image_data, still_image_data = resize_emoji(image_data, "img.png")

        self.assertEqual(still_image_data, None)
        self.assertEqual(image_data, original_key.get()["Body"].read())
        self.assertEqual(resized_image_data, resized_key.get()["Body"].read())

        emoji_name = "emoji2.png"

        with get_test_image_file("animated_img.gif") as image_file:
            emoji = check_add_realm_emoji(
                othello.realm, emoji_name, othello, image_file, "image/gif"
            )

        emoji_path = RealmEmoji.PATH_ID_TEMPLATE.format(
            realm_id=othello.realm_id,
            emoji_file_name=emoji.file_name,
        )

        with self.assertLogs(level="INFO"):
            transfer_emoji_to_s3(1)

        self.assert_length(list(bucket.objects.all()), 5)
        original_key = bucket.Object(emoji_path + ".original")
        resized_key = bucket.Object(emoji_path)
        assert emoji.file_name
        still_key = bucket.Object(
            RealmEmoji.STILL_PATH_ID_TEMPLATE.format(
                realm_id=othello.realm_id,
                emoji_filename_without_extension=os.path.splitext(emoji.file_name)[0],
            )
        )

        image_data = read_test_image_file("animated_img.gif")
        resized_image_data, still_image_data = resize_emoji(image_data, "animated_img.gif")

        self.assertEqual(type(still_image_data), bytes)
        self.assertEqual(image_data, original_key.get()["Body"].read())
        self.assertEqual(resized_image_data, resized_key.get()["Body"].read())
        self.assertEqual(still_image_data, still_key.get()["Body"].read())
```

--------------------------------------------------------------------------------

````
