---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 1071
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1071 of 1290)

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

---[FILE: test_validators.py]---
Location: zulip-main/zerver/tests/test_validators.py
Signals: Django

```python
from typing import Any

from django.conf import settings
from django.core.exceptions import ValidationError

from zerver.lib.exceptions import InvalidJSONError
from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.types import Validator
from zerver.lib.validator import (
    check_anything,
    check_bool,
    check_capped_string,
    check_date,
    check_dict,
    check_dict_only,
    check_float,
    check_int,
    check_int_in,
    check_list,
    check_none_or,
    check_short_string,
    check_string,
    check_string_fixed_length,
    check_string_in,
    check_string_or_int,
    check_string_or_int_list,
    check_union,
    check_url,
    equals,
    to_wild_value,
)

if settings.ZILENCER_ENABLED:
    pass


class ValidatorTestCase(ZulipTestCase):
    def test_check_string(self) -> None:
        x: Any = "hello"
        check_string("x", x)

        x = 4
        with self.assertRaisesRegex(ValidationError, r"x is not a string"):
            check_string("x", x)

    def test_check_string_fixed_length(self) -> None:
        x: Any = "hello"
        check_string_fixed_length(5)("x", x)

        x = 4
        with self.assertRaisesRegex(ValidationError, r"x is not a string"):
            check_string_fixed_length(5)("x", x)

        x = "helloz"
        with self.assertRaisesRegex(ValidationError, r"x has incorrect length 6; should be 5"):
            check_string_fixed_length(5)("x", x)

        x = "hi"
        with self.assertRaisesRegex(ValidationError, r"x has incorrect length 2; should be 5"):
            check_string_fixed_length(5)("x", x)

    def test_check_capped_string(self) -> None:
        x: Any = "hello"
        check_capped_string(5)("x", x)

        x = 4
        with self.assertRaisesRegex(ValidationError, r"x is not a string"):
            check_capped_string(5)("x", x)

        x = "helloz"
        with self.assertRaisesRegex(ValidationError, r"x is too long \(limit: 5 characters\)"):
            check_capped_string(5)("x", x)

        x = "hi"
        check_capped_string(5)("x", x)

    def test_check_string_in(self) -> None:
        check_string_in(["valid", "othervalid"])("Test", "valid")
        with self.assertRaisesRegex(ValidationError, r"Test is not a string"):
            check_string_in(["valid", "othervalid"])("Test", 15)
        check_string_in(["valid", "othervalid"])("Test", "othervalid")
        with self.assertRaisesRegex(ValidationError, r"Invalid Test"):
            check_string_in(["valid", "othervalid"])("Test", "invalid")

    def test_check_int_in(self) -> None:
        check_int_in([1])("Test", 1)
        with self.assertRaisesRegex(ValidationError, r"Invalid Test"):
            check_int_in([1])("Test", 2)
        with self.assertRaisesRegex(ValidationError, r"Test is not an integer"):
            check_int_in([1])("Test", "t")

    def test_check_short_string(self) -> None:
        x: Any = "hello"
        check_short_string("x", x)

        x = "x" * 201
        with self.assertRaisesRegex(ValidationError, r"x is too long \(limit: 50 characters\)"):
            check_short_string("x", x)

        x = 4
        with self.assertRaisesRegex(ValidationError, r"x is not a string"):
            check_short_string("x", x)

    def test_check_bool(self) -> None:
        x: Any = True
        check_bool("x", x)

        x = 4
        with self.assertRaisesRegex(ValidationError, r"x is not a boolean"):
            check_bool("x", x)

    def test_check_int(self) -> None:
        x: Any = 5
        check_int("x", x)

        x = [{}]
        with self.assertRaisesRegex(ValidationError, r"x is not an integer"):
            check_int("x", x)

    def test_check_float(self) -> None:
        x: Any = 5.5
        check_float("x", x)

        x = 5
        with self.assertRaisesRegex(ValidationError, r"x is not a float"):
            check_float("x", x)

        x = [{}]
        with self.assertRaisesRegex(ValidationError, r"x is not a float"):
            check_float("x", x)

    def test_check_list(self) -> None:
        x: Any = 999
        with self.assertRaisesRegex(ValidationError, r"x is not a list"):
            check_list(check_string)("x", x)

        x = ["hello", 5]
        with self.assertRaisesRegex(ValidationError, r"x\[1\] is not a string"):
            check_list(check_string)("x", x)

        x = [["yo"], ["hello", "goodbye", 5]]
        with self.assertRaisesRegex(ValidationError, r"x\[1\]\[2\] is not a string"):
            check_list(check_list(check_string))("x", x)

        x = ["hello", "goodbye", "hello again"]
        with self.assertRaisesRegex(ValidationError, r"x should have exactly 2 items"):
            check_list(check_string, length=2)("x", x)

    def test_check_dict(self) -> None:
        keys: list[tuple[str, Validator[object]]] = [
            ("names", check_list(check_string)),
            ("city", check_string),
        ]

        x: Any = {
            "names": ["alice", "bob"],
            "city": "Boston",
        }
        check_dict(keys)("x", x)

        x = 999
        with self.assertRaisesRegex(ValidationError, r"x is not a dict"):
            check_dict(keys)("x", x)

        x = {}
        with self.assertRaisesRegex(ValidationError, r"names key is missing from x"):
            check_dict(keys)("x", x)

        x = {
            "names": ["alice", "bob", {}],
        }
        with self.assertRaisesRegex(ValidationError, r'x\["names"\]\[2\] is not a string'):
            check_dict(keys)("x", x)

        x = {
            "names": ["alice", "bob"],
            "city": 5,
        }
        with self.assertRaisesRegex(ValidationError, r'x\["city"\] is not a string'):
            check_dict(keys)("x", x)

        x = {
            "names": ["alice", "bob"],
            "city": "Boston",
        }
        with self.assertRaisesRegex(ValidationError, r"x contains a value that is not a string"):
            check_dict(value_validator=check_string)("x", x)

        x = {
            "city": "Boston",
        }
        check_dict(value_validator=check_string)("x", x)

        # test dict_only
        x = {
            "names": ["alice", "bob"],
            "city": "Boston",
        }
        check_dict_only(keys)("x", x)

        x = {
            "names": ["alice", "bob"],
            "city": "Boston",
            "state": "Massachusetts",
        }
        with self.assertRaisesRegex(ValidationError, r"Unexpected arguments: state"):
            check_dict_only(keys)("x", x)

        # Test optional keys
        optional_keys = [
            ("food", check_list(check_string)),
            ("year", check_int),
        ]

        x = {
            "names": ["alice", "bob"],
            "city": "Boston",
            "food": ["Lobster spaghetti"],
        }

        check_dict(keys)("x", x)  # since _allow_only_listed_keys is False

        with self.assertRaisesRegex(ValidationError, r"Unexpected arguments: food"):
            check_dict_only(keys)("x", x)

        check_dict_only(keys, optional_keys)("x", x)

        x = {
            "names": ["alice", "bob"],
            "city": "Boston",
            "food": "Lobster spaghetti",
        }
        with self.assertRaisesRegex(ValidationError, r'x\["food"\] is not a list'):
            check_dict_only(keys, optional_keys)("x", x)

    def test_encapsulation(self) -> None:
        # There might be situations where we want deep
        # validation, but the error message should be customized.
        # This is an example.
        def check_person(val: object) -> dict[str, object]:
            try:
                return check_dict(
                    [
                        ("name", check_string),
                        ("age", check_int),
                    ]
                )("_", val)
            except ValidationError:
                raise ValidationError("This is not a valid person")

        person = {"name": "King Lear", "age": 42}
        check_person(person)

        nonperson = "misconfigured data"
        with self.assertRaisesRegex(ValidationError, r"This is not a valid person"):
            check_person(nonperson)

    def test_check_union(self) -> None:
        x: Any = 5
        check_union([check_string, check_int])("x", x)

        x = "x"
        check_union([check_string, check_int])("x", x)

        x = [{}]
        with self.assertRaisesRegex(ValidationError, r"x is not an allowed_type"):
            check_union([check_string, check_int])("x", x)

    def test_equals(self) -> None:
        x: Any = 5
        equals(5)("x", x)
        with self.assertRaisesRegex(ValidationError, r"x != 6 \(5 is wrong\)"):
            equals(6)("x", x)

    def test_check_none_or(self) -> None:
        x: Any = 5
        check_none_or(check_int)("x", x)
        x = None
        check_none_or(check_int)("x", x)
        x = "x"
        with self.assertRaisesRegex(ValidationError, r"x is not an integer"):
            check_none_or(check_int)("x", x)

    def test_check_url(self) -> None:
        url: Any = "http://127.0.0.1:5002/"
        check_url("url", url)

        url = "http://zulip-bots.example.com/"
        check_url("url", url)

        url = "http://127.0.0"
        with self.assertRaisesRegex(ValidationError, r"url is not a URL"):
            check_url("url", url)

        url = 99.3
        with self.assertRaisesRegex(ValidationError, r"url is not a string"):
            check_url("url", url)

    def test_check_string_or_int_list(self) -> None:
        x: Any = "string"
        check_string_or_int_list("x", x)

        x = [1, 2, 4]
        check_string_or_int_list("x", x)

        x = None
        with self.assertRaisesRegex(ValidationError, r"x is not a string or an integer list"):
            check_string_or_int_list("x", x)

        x = [1, 2, "3"]
        with self.assertRaisesRegex(ValidationError, r"x\[2\] is not an integer"):
            check_string_or_int_list("x", x)

    def test_check_string_or_int(self) -> None:
        x: Any = "string"
        check_string_or_int("x", x)

        x = 1
        check_string_or_int("x", x)

        x = None
        with self.assertRaisesRegex(ValidationError, r"x is not a string or integer"):
            check_string_or_int("x", x)

    def test_wild_value(self) -> None:
        x = to_wild_value("x", '{"a": 1, "b": ["c", false, null]}')

        with self.assertRaisesRegex(TypeError, r"^cannot compare WildValue$"):
            self.assertEqual(x, x)

        self.assertTrue(x)
        self.assertEqual(len(x), 2)
        self.assertEqual(list(x.keys()), ["a", "b"])
        self.assertEqual([v.tame(check_anything) for v in x.values()], [1, ["c", False, None]])
        self.assertEqual(
            [(k, v.tame(check_anything)) for k, v in x.items()],
            [("a", 1), ("b", ["c", False, None])],
        )
        self.assertTrue("a" in x)
        self.assertEqual(x["a"].tame(check_int), 1)
        self.assertEqual(x.get("a").tame(check_int), 1)
        self.assertEqual(x.get("z").tame(check_none_or(check_int)), None)
        self.assertEqual(x.get("z", x["a"]).tame(check_int), 1)
        self.assertEqual(x["a"].tame(check_int), 1)
        self.assertEqual(x["b"].tame(check_anything), x["b"].tame(check_anything))
        self.assertTrue(x["b"])
        self.assertEqual(len(x["b"]), 3)
        self.assert_length(list(x["b"]), 3)
        self.assertEqual(x["b"][0].tame(check_string), "c")
        self.assertFalse(x["b"][1])
        self.assertFalse(x["b"][2])

        with self.assertRaisesRegex(ValidationError, r"x is not a string"):
            x.tame(check_string)
        with self.assertRaisesRegex(ValidationError, r"x is not a list"):
            x[0]
        with self.assertRaisesRegex(ValidationError, r"x\['z'\] is missing"):
            x["z"]
        with self.assertRaisesRegex(ValidationError, r"x\['a'\] is not a list"):
            x["a"][0]
        with self.assertRaisesRegex(ValidationError, r"x\['a'\] is not a list"):
            iter(x["a"])
        with self.assertRaisesRegex(ValidationError, r"x\['a'\] is not a dict"):
            x["a"]["a"]
        with self.assertRaisesRegex(ValidationError, r"x\['a'\] is not a dict"):
            x["a"].get("a")
        with self.assertRaisesRegex(ValidationError, r"x\['a'\] is not a dict"):
            _ = "a" in x["a"]
        with self.assertRaisesRegex(ValidationError, r"x\['a'\] is not a dict"):
            x["a"].keys()
        with self.assertRaisesRegex(ValidationError, r"x\['a'\] is not a dict"):
            x["a"].values()
        with self.assertRaisesRegex(ValidationError, r"x\['a'\] is not a dict"):
            x["a"].items()
        with self.assertRaisesRegex(ValidationError, r"x\['a'\] does not have a length"):
            len(x["a"])
        with self.assertRaisesRegex(ValidationError, r"x\['b'\]\[1\] is not a string"):
            x["b"][1].tame(check_string)
        with self.assertRaisesRegex(ValidationError, r"x\['b'\]\[99\] is missing"):
            x["b"][99]
        with self.assertRaisesRegex(ValidationError, r"x\['b'\] is not a dict"):
            x["b"]["b"]

        with self.assertRaisesRegex(InvalidJSONError, r"Malformed JSON"):
            to_wild_value("x", "invalidjson")

    def test_check_date(self) -> None:
        x: Any = "2024-01-02"
        self.assertTrue(check_date("x", x))

        x = 123
        with self.assertRaisesRegex(ValidationError, r"x is not a string"):
            check_date("x", x)

        x = "2024-13-02"
        with self.assertRaisesRegex(ValidationError, r"x is not a date"):
            check_date("x", x)

        x = "2024-1-2"
        with self.assertRaisesRegex(ValidationError, r"x is not a date"):
            check_date("x", x)
```

--------------------------------------------------------------------------------

---[FILE: test_webhooks_common.py]---
Location: zulip-main/zerver/tests/test_webhooks_common.py
Signals: Django

```python
import hashlib
import hmac
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

from django.http import HttpRequest, QueryDict
from django.http.response import HttpResponse
from django.test import override_settings
from django.utils.encoding import force_bytes
from typing_extensions import override

from zerver.actions.streams import do_rename_stream
from zerver.decorator import webhook_view
from zerver.lib.exceptions import InvalidJSONError, JsonableError
from zerver.lib.request import RequestNotes
from zerver.lib.send_email import FromAddress
from zerver.lib.test_classes import WebhookTestCase, ZulipTestCase
from zerver.lib.test_helpers import HostRequestMock
from zerver.lib.webhooks.common import (
    INVALID_JSON_MESSAGE,
    MISSING_EVENT_HEADER_MESSAGE,
    MissingHTTPEventHeaderError,
    check_send_webhook_message,
    get_fixture_http_headers,
    standardize_headers,
    validate_extract_webhook_http_header,
    validate_webhook_signature,
)
from zerver.models import Client, Message, UserProfile
from zerver.models.realms import get_realm
from zerver.models.users import get_user


class WebhooksCommonTestCase(ZulipTestCase):
    def test_webhook_http_header_header_exists(self) -> None:
        webhook_bot = get_user("webhook-bot@zulip.com", get_realm("zulip"))
        request = HostRequestMock()
        request.META["HTTP_X_CUSTOM_HEADER"] = "custom_value"
        request.user = webhook_bot

        header_value = validate_extract_webhook_http_header(
            request, "X-Custom-Header", "test_webhook"
        )

        self.assertEqual(header_value, "custom_value")

    def test_webhook_http_header_header_does_not_exist(self) -> None:
        realm = get_realm("zulip")
        webhook_bot = get_user("webhook-bot@zulip.com", realm)
        webhook_bot.last_reminder = None
        notification_bot = self.notification_bot(realm)
        request = HostRequestMock()
        request.user = webhook_bot
        request.path = "some/random/path"

        exception_msg = "Missing the HTTP event header 'X-Custom-Header'"
        with self.assertRaisesRegex(MissingHTTPEventHeaderError, exception_msg):
            validate_extract_webhook_http_header(request, "X-Custom-Header", "test_webhook")

        msg = self.get_last_message()
        expected_message = MISSING_EVENT_HEADER_MESSAGE.format(
            bot_name=webhook_bot.full_name,
            request_path=request.path,
            header_name="X-Custom-Header",
            integration_name="test_webhook",
            support_email=FromAddress.SUPPORT,
        ).rstrip()
        self.assertEqual(msg.sender.id, notification_bot.id)
        self.assertEqual(msg.content, expected_message)

    def test_notify_bot_owner_on_invalid_json(self) -> None:
        @webhook_view("ClientName", notify_bot_owner_on_invalid_json=False)
        def my_webhook_no_notify(request: HttpRequest, user_profile: UserProfile) -> HttpResponse:
            raise InvalidJSONError("Malformed JSON")

        @webhook_view("ClientName", notify_bot_owner_on_invalid_json=True)
        def my_webhook_notify(request: HttpRequest, user_profile: UserProfile) -> HttpResponse:
            raise InvalidJSONError("Malformed JSON")

        webhook_bot_email = "webhook-bot@zulip.com"
        webhook_bot_realm = get_realm("zulip")
        webhook_bot = get_user(webhook_bot_email, webhook_bot_realm)
        webhook_bot_api_key = webhook_bot.api_key
        request = HostRequestMock()
        request.POST["api_key"] = webhook_bot_api_key
        request.host = "zulip.testserver"
        expected_msg = INVALID_JSON_MESSAGE.format(webhook_name="ClientName")

        last_message_id = self.get_last_message().id
        with self.assertRaisesRegex(JsonableError, "Malformed JSON"):
            my_webhook_no_notify(request)

        # First verify that without the setting, it doesn't send a direct
        # message to bot owner.
        msg = self.get_last_message()
        self.assertEqual(msg.id, last_message_id)
        self.assertNotEqual(msg.content, expected_msg.strip())

        # Then verify that with the setting, it does send such a message.
        request = HostRequestMock()
        request.POST["api_key"] = webhook_bot_api_key
        request.host = "zulip.testserver"
        with self.assertRaisesRegex(JsonableError, "Malformed JSON"):
            my_webhook_notify(request)
        msg = self.get_last_message()
        self.assertNotEqual(msg.id, last_message_id)
        self.assertEqual(msg.sender.id, self.notification_bot(webhook_bot_realm).id)
        self.assertEqual(msg.content, expected_msg.strip())

    @patch("zerver.lib.webhooks.common.importlib.import_module")
    def test_get_fixture_http_headers_for_success(self, import_module_mock: MagicMock) -> None:
        def fixture_to_headers(fixture_name: str) -> dict[str, str]:
            # A sample function which would normally perform some
            # extra operations before returning a dictionary
            # corresponding to the fixture name passed. For this test,
            # we just return a fixed dictionary.
            return {"key": "value"}

        fake_module = SimpleNamespace(fixture_to_headers=fixture_to_headers)
        import_module_mock.return_value = fake_module

        headers = get_fixture_http_headers("some_integration", "complex_fixture")
        self.assertEqual(headers, {"key": "value"})

    def test_get_fixture_http_headers_for_non_existent_integration(self) -> None:
        headers = get_fixture_http_headers("some_random_nonexistent_integration", "fixture_name")
        self.assertEqual(headers, {})

    @patch("zerver.lib.webhooks.common.importlib.import_module")
    def test_get_fixture_http_headers_with_no_fixtures_to_headers_function(
        self,
        import_module_mock: MagicMock,
    ) -> None:
        fake_module = SimpleNamespace()
        import_module_mock.return_value = fake_module

        self.assertEqual(
            get_fixture_http_headers("some_integration", "simple_fixture"),
            {},
        )

    def test_standardize_headers(self) -> None:
        self.assertEqual(standardize_headers({}), {})

        raw_headers = {"Content-Type": "text/plain", "X-Event-Type": "ping"}
        djangoified_headers = standardize_headers(raw_headers)
        expected_djangoified_headers = {"CONTENT_TYPE": "text/plain", "HTTP_X_EVENT_TYPE": "ping"}
        self.assertEqual(djangoified_headers, expected_djangoified_headers)

    @override_settings(VERIFY_WEBHOOK_SIGNATURES=True)
    def test_validate_webhook_signature(self) -> None:
        request = HostRequestMock()
        request.GET = QueryDict("", mutable=True)

        # Valid signature
        webhook_secret = "test_secret"
        payload = '{"key": "value"}'
        signature = hmac.new(
            force_bytes(webhook_secret), force_bytes(payload), hashlib.sha256
        ).hexdigest()

        request.GET.update({"webhook_secret": webhook_secret})
        validate_webhook_signature(request, payload, signature)

        # Invalid signature
        invalid_signature = "invalid_signature"
        with self.assertRaisesRegex(
            JsonableError,
            "Webhook signature verification failed.",
        ):
            validate_webhook_signature(request, payload, invalid_signature)

        # No webhook_secret parameter
        request.GET.clear()
        with self.assertRaisesRegex(
            JsonableError,
            "The webhook secret is missing. Please set the webhook_secret while generating the URL.",
        ):
            validate_webhook_signature(request, payload, signature)

    def test_check_send_webhook_message_returns_id(self) -> None:
        webhook_bot = get_user("webhook-bot@zulip.com", get_realm("zulip"))
        stream = self.make_stream("test_stream")
        self.subscribe(webhook_bot, stream.name)

        request = HostRequestMock()
        request.user = webhook_bot
        client = Client.objects.get_or_create(name="TestClient")[0]
        RequestNotes.get_notes(request).client = client

        message_id = check_send_webhook_message(
            request,
            webhook_bot,
            "Test topic",
            "Test message content",
            stream=stream.name,
        )

        self.assertIsInstance(message_id, int)
        assert message_id is not None
        msg = Message.objects.get(id=message_id)
        self.assertEqual(msg.topic_name(), "Test topic")


class WebhookURLConfigurationTestCase(WebhookTestCase):
    CHANNEL_NAME = "helloworld"
    WEBHOOK_DIR_NAME = "helloworld"
    URL_TEMPLATE = "/api/v1/external/helloworld?stream={stream}&api_key={api_key}"

    @override
    def setUp(self) -> None:
        super().setUp()
        stream = self.subscribe(self.test_user, self.CHANNEL_NAME)

        # In actual webhook tests, we will not need to use stream id.
        # We assign stream id to CHANNEL_NAME for testing URL configuration only.
        self.CHANNEL_NAME = str(stream.id)
        do_rename_stream(stream, "helloworld_renamed", self.test_user)

        self.url = self.build_webhook_url()

    def test_trigger_stream_message_by_id(self) -> None:
        # check_webhook cannot be used here as it
        # subscribes the test user to self.CHANNEL_NAME
        payload = self.get_body("hello")

        self.send_webhook_payload(
            self.test_user, self.url, payload, content_type="application/json"
        )

        expected_topic_name = "Hello World"
        expected_message = "Hello! I am happy to be here! :smile:\nThe Wikipedia featured article for today is **[Marilyn Monroe](https://en.wikipedia.org/wiki/Marilyn_Monroe)**"

        msg = self.get_last_message()
        self.assert_channel_message(
            message=msg,
            channel_name="helloworld_renamed",
            topic_name=expected_topic_name,
            content=expected_message,
        )


class MissingEventHeaderTestCase(WebhookTestCase):
    CHANNEL_NAME = "groove"
    URL_TEMPLATE = "/api/v1/external/groove?stream={stream}&api_key={api_key}"

    # This tests the validate_extract_webhook_http_header function with
    # an actual webhook, instead of just making a mock
    def test_missing_event_header(self) -> None:
        self.subscribe(self.test_user, self.CHANNEL_NAME)
        with self.assertNoLogs("zulip.zerver.webhooks.anomalous", level="INFO"):
            result = self.client_post(
                self.url,
                self.get_body("ticket_state_changed"),
                content_type="application/x-www-form-urlencoded",
            )
        self.assert_json_error(result, "Missing the HTTP event header 'X-Groove-Event'")

        realm = get_realm("zulip")
        webhook_bot = get_user("webhook-bot@zulip.com", realm)
        webhook_bot.last_reminder = None
        notification_bot = self.notification_bot(realm)
        msg = self.get_last_message()
        expected_message = MISSING_EVENT_HEADER_MESSAGE.format(
            bot_name=webhook_bot.full_name,
            request_path="/api/v1/external/groove",
            header_name="X-Groove-Event",
            integration_name="Groove",
            support_email=FromAddress.SUPPORT,
        ).rstrip()
        if msg.sender.id != notification_bot.id:  # nocoverage
            # This block seems to fire occasionally; debug output:
            print(msg)
            print(msg.content)
        self.assertEqual(msg.sender.id, notification_bot.id)
        self.assertEqual(msg.content, expected_message)

    @override
    def get_body(self, fixture_name: str) -> str:
        return self.webhook_fixture_data("groove", fixture_name, file_type="json")
```

--------------------------------------------------------------------------------

---[FILE: test_welcome_bot_custom_message.py]---
Location: zulip-main/zerver/tests/test_welcome_bot_custom_message.py

```python
from typing_extensions import override

from zerver.lib.test_classes import ZulipTestCase


class WelcomeBotCustomMessageTest(ZulipTestCase):
    @override
    def setUp(self) -> None:
        super().setUp()
        self.user_profile = self.example_user("iago")

    def test_empty_welcome_bot_custom_message(self) -> None:
        user = self.example_user("desdemona")
        self.login_user(user)

        result = self.client_post(
            "/json/realm/test_welcome_bot_custom_message",
            {"welcome_message_custom_text": ""},
        )
        self.assert_json_error(result, "Message must not be empty")

    def test_welcome_bot_custom_message(self) -> None:
        user = self.example_user("desdemona")
        self.login_user(user)
        welcome_message_custom_text = "Welcome Bot custom message for testing"

        result = self.client_post(
            "/json/realm/test_welcome_bot_custom_message",
            {"welcome_message_custom_text": welcome_message_custom_text},
        )
        response_dict = self.assert_json_success(result)
        welcome_bot_custom_message_id = response_dict["message_id"]

        # Make sure that only message with custom text is sent.
        previous_message = self.get_second_to_last_message()
        self.assertNotEqual(previous_message.sender.email, "welcome-bot@zulip.com")

        received_welcome_bot_custom_message = self.get_last_message()

        self.assertEqual(received_welcome_bot_custom_message.sender.email, "welcome-bot@zulip.com")
        self.assertIn(welcome_message_custom_text, received_welcome_bot_custom_message.content)
        self.assertEqual(welcome_bot_custom_message_id, received_welcome_bot_custom_message.id)
```

--------------------------------------------------------------------------------

````
