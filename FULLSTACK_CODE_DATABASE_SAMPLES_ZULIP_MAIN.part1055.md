---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 1055
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1055 of 1290)

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

---[FILE: test_subdomains.py]---
Location: zulip-main/zerver/tests/test_subdomains.py
Signals: Django

```python
from collections.abc import Mapping, Sequence
from typing import Any
from unittest import mock

from django.conf import settings

import zerver.lib.upload
from zerver.lib.subdomains import get_subdomain, is_static_or_current_realm_url
from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.test_helpers import create_s3_buckets, use_s3_backend
from zerver.models import Realm


class SubdomainsTest(ZulipTestCase):
    def test_get_subdomain(self) -> None:
        def request_mock(host: str) -> Any:
            request = mock.Mock(spec=["get_host"])
            request.attach_mock(mock.Mock(return_value=host), "get_host")
            return request

        def test(
            expected: str,
            host: str,
            *,
            plusport: bool = True,
            external_host: str = "example.org",
            realm_hosts: Mapping[str, str] = {},
            root_aliases: Sequence[str] = [],
        ) -> None:
            with self.settings(
                EXTERNAL_HOST=external_host,
                REALM_HOSTS=realm_hosts,
                ROOT_SUBDOMAIN_ALIASES=root_aliases,
            ):
                self.assertEqual(get_subdomain(request_mock(host)), expected)
                if plusport and ":" not in host:
                    self.assertEqual(get_subdomain(request_mock(host + ":443")), expected)

        ROOT = Realm.SUBDOMAIN_FOR_ROOT_DOMAIN

        # Basics
        test(ROOT, "example.org")
        test("foo", "foo.example.org")
        test(ROOT, "www.example.org", root_aliases=["www"])

        # Unrecognized patterns fall back to root
        test(ROOT, "arbitrary.com")
        test(ROOT, "foo.example.org.evil.com")

        # REALM_HOSTS adds a name,
        test("bar", "chat.barbar.com", realm_hosts={"bar": "chat.barbar.com"})
        # ... exactly, ...
        test(ROOT, "surchat.barbar.com", realm_hosts={"bar": "chat.barbar.com"})
        test(ROOT, "foo.chat.barbar.com", realm_hosts={"bar": "chat.barbar.com"})
        # ... and leaves the subdomain in place too.
        test("bar", "bar.example.org", realm_hosts={"bar": "chat.barbar.com"})

        # Any port is fine in Host if there's none in EXTERNAL_HOST, ...
        test("foo", "foo.example.org:443", external_host="example.org")
        test("foo", "foo.example.org:12345", external_host="example.org")
        # ... but an explicit port in EXTERNAL_HOST must be explicitly matched in Host.
        test(ROOT, "foo.example.org", external_host="example.org:12345")
        test(ROOT, "foo.example.org", external_host="example.org:443", plusport=False)
        test("foo", "foo.example.org:443", external_host="example.org:443")

    def test_is_static_or_current_realm_url(self) -> None:
        realm = self.example_user("hamlet").realm

        def test(url: str) -> bool:
            return is_static_or_current_realm_url(url, realm)

        self.assertTrue(test("/static/images/logo/zulip-org-logo.svg"))
        self.assertTrue(test("/anything"))
        self.assertFalse(test("https://zulip.com"))
        self.assertFalse(test("http://zulip.com"))
        self.assertTrue(test(f"{realm.url}"))

        self.assertFalse(test(f"{realm.url}@www.google.com"))

        # We don't have an existing configuration STATIC_URL with this
        # format, but it's worth testing in case that changes.
        with self.settings(STATIC_URL="https://zulipstatic.example.com"):
            evil_url = f"{settings.STATIC_URL}@evil.example.com"
            self.assertEqual(evil_url, "https://zulipstatic.example.com@evil.example.com")
            self.assertTrue(test(f"{settings.STATIC_URL}/x"))
            self.assertFalse(test(evil_url))
            self.assertFalse(test(f"{evil_url}/x"))
            self.assertTrue(test(f"{realm.url}"))
            self.assertTrue(test("/static/images/logo/zulip-org-logo.svg"))
            self.assertTrue(test("/anything"))

    @use_s3_backend
    def test_is_static_or_current_realm_url_with_s3(self) -> None:
        create_s3_buckets(settings.S3_AVATAR_BUCKET)[0]

        realm = self.example_user("hamlet").realm

        def test(url: str) -> bool:
            return is_static_or_current_realm_url(url, realm)

        upload_backend = zerver.lib.upload.upload_backend
        self.assertTrue(test(upload_backend.get_realm_icon_url(realm.id, version=1)))
        self.assertTrue(test(upload_backend.get_realm_logo_url(realm.id, version=1, night=False)))
        self.assertTrue(test(upload_backend.get_avatar_url("deadbeefcafe")))
        self.assertTrue(test(upload_backend.get_emoji_url("emoji.gif", realm.id)))
```

--------------------------------------------------------------------------------

---[FILE: test_submessage.py]---
Location: zulip-main/zerver/tests/test_submessage.py

```python
from typing import Any
from unittest import mock

from zerver.actions.submessage import do_add_submessage
from zerver.lib.message_cache import MessageDict
from zerver.lib.test_classes import ZulipTestCase
from zerver.models import Message, SubMessage


class TestBasics(ZulipTestCase):
    def test_get_raw_db_rows(self) -> None:
        cordelia = self.example_user("cordelia")
        hamlet = self.example_user("hamlet")
        stream_name = "Verona"

        message_id = self.send_stream_message(
            sender=cordelia,
            stream_name=stream_name,
        )

        def get_raw_rows() -> list[dict[str, Any]]:
            query = SubMessage.get_raw_db_rows([message_id])
            rows = list(query)
            return rows

        rows = get_raw_rows()
        self.assertEqual(rows, [])

        sm1 = SubMessage.objects.create(
            msg_type="whatever",
            content="stuff1",
            message_id=message_id,
            sender=cordelia,
        )

        sm2 = SubMessage.objects.create(
            msg_type="whatever",
            content="stuff2",
            message_id=message_id,
            sender=hamlet,
        )

        expected_data = [
            dict(
                id=sm1.id,
                message_id=message_id,
                sender_id=cordelia.id,
                msg_type="whatever",
                content="stuff1",
            ),
            dict(
                id=sm2.id,
                message_id=message_id,
                sender_id=hamlet.id,
                msg_type="whatever",
                content="stuff2",
            ),
        ]

        self.assertEqual(get_raw_rows(), expected_data)

        message = Message.objects.get(id=message_id)
        message_json = MessageDict.wide_dict(message)
        rows = message_json["submessages"]
        rows.sort(key=lambda r: r["id"])
        self.assertEqual(rows, expected_data)

        msg_rows = MessageDict.ids_to_dict([message_id])
        rows = msg_rows[0]["submessages"]
        rows.sort(key=lambda r: r["id"])
        self.assertEqual(rows, expected_data)

    def test_endpoint_errors(self) -> None:
        cordelia = self.example_user("cordelia")
        stream_name = "Verona"
        message_id = self.send_stream_message(
            sender=cordelia,
            stream_name=stream_name,
        )
        self.login_user(cordelia)

        payload = dict(
            message_id=message_id,
            msg_type="whatever",
            content="not json",
        )
        result = self.client_post("/json/submessage", payload)
        self.assert_json_error(result, "Invalid json for submessage")

        hamlet = self.example_user("hamlet")
        bad_message_id = self.send_personal_message(
            from_user=hamlet,
            to_user=hamlet,
        )
        payload = dict(
            message_id=bad_message_id,
            msg_type="whatever",
            content="does not matter",
        )
        result = self.client_post("/json/submessage", payload)
        self.assert_json_error(result, "Invalid message(s)")

    def test_original_sender_enforced(self) -> None:
        cordelia = self.example_user("cordelia")
        hamlet = self.example_user("hamlet")
        stream_name = "Verona"

        message_id = self.send_stream_message(
            sender=cordelia,
            stream_name=stream_name,
        )
        self.login_user(hamlet)

        payload = dict(
            message_id=message_id,
            msg_type="whatever",
            content="{}",
        )

        # Hamlet can't just go attaching submessages to Cordelia's
        # message, even though he does have read access here to the
        # message itself.
        result = self.client_post("/json/submessage", payload)
        self.assert_json_error(result, "You cannot attach a submessage to this message.")

        # Since Hamlet is actually subscribed to the stream, he is welcome
        # to send submessages to Cordelia once she initiates the "subconversation".
        do_add_submessage(
            realm=cordelia.realm,
            sender_id=cordelia.id,
            message_id=message_id,
            msg_type="whatever",
            content="whatever",
        )

        result = self.client_post("/json/submessage", payload)
        self.assert_json_success(result)

    def test_endpoint_success(self) -> None:
        cordelia = self.example_user("cordelia")
        hamlet = self.example_user("hamlet")
        stream_name = "Verona"
        message_id = self.send_stream_message(
            sender=cordelia,
            stream_name=stream_name,
        )
        self.login_user(cordelia)

        payload = dict(
            message_id=message_id,
            msg_type="whatever",
            content='{"name": "alice", "salary": 20}',
        )
        with self.capture_send_event_calls(expected_num_events=1) as events:
            result = self.client_post("/json/submessage", payload)
        self.assert_json_success(result)

        submessage = SubMessage.objects.get(message_id=message_id)

        expected_data = dict(
            message_id=message_id,
            submessage_id=submessage.id,
            content=payload["content"],
            msg_type="whatever",
            sender_id=cordelia.id,
            type="submessage",
        )

        data = events[0]["event"]
        self.assertEqual(data, expected_data)
        users = events[0]["users"]
        self.assertIn(cordelia.id, users)
        self.assertIn(hamlet.id, users)

        rows = SubMessage.get_raw_db_rows([message_id])
        self.assert_length(rows, 1)
        row = rows[0]

        expected_data = dict(
            id=row["id"],
            message_id=message_id,
            content='{"name": "alice", "salary": 20}',
            msg_type="whatever",
            sender_id=cordelia.id,
        )
        self.assertEqual(row, expected_data)

    def test_submessage_event_sent_after_transaction_commits(self) -> None:
        """
        Tests that `send_event_rollback_unsafe` is hooked to `transaction.on_commit`.
        This is important, because we don't want to end up holding locks on message rows
        for too long if the event queue runs into a problem.
        """
        hamlet = self.example_user("hamlet")
        message_id = self.send_stream_message(hamlet, "Denmark")

        with (
            self.capture_send_event_calls(expected_num_events=1),
            mock.patch("zerver.tornado.django_api.queue_json_publish_rollback_unsafe") as m,
        ):
            m.side_effect = AssertionError(
                "Events should be sent only after the transaction commits."
            )
            do_add_submessage(hamlet.realm, hamlet.id, message_id, "whatever", "whatever")

    def test_fetch_message_containing_submessages(self) -> None:
        cordelia = self.example_user("cordelia")
        stream_name = "Verona"
        message_id = self.send_stream_message(
            sender=cordelia,
            stream_name=stream_name,
        )
        self.login_user(cordelia)

        payload = dict(
            message_id=message_id,
            msg_type="whatever",
            content='{"name": "alice", "salary": 20}',
        )
        self.assert_json_success(self.client_post("/json/submessage", payload))

        result = self.client_get(f"/json/messages/{message_id}")
        response_dict = self.assert_json_success(result)
        self.assert_length(response_dict["message"]["submessages"], 1)

        submessage = response_dict["message"]["submessages"][0]
        expected_data = dict(
            id=submessage["id"],
            message_id=message_id,
            content='{"name": "alice", "salary": 20}',
            msg_type="whatever",
            sender_id=cordelia.id,
        )
        self.assertEqual(submessage, expected_data)
```

--------------------------------------------------------------------------------

````
