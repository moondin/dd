---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 1050
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1050 of 1290)

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

---[FILE: test_send_email.py]---
Location: zulip-main/zerver/tests/test_send_email.py
Signals: Django

```python
from smtplib import SMTP, SMTPDataError, SMTPException, SMTPRecipientsRefused
from unittest import mock

from django.core.mail.backends.locmem import EmailBackend
from django.core.mail.backends.smtp import EmailBackend as SMTPBackend
from django.core.mail.message import sanitize_address

from zerver.lib.send_email import (
    EmailNotDeliveredError,
    FromAddress,
    build_email,
    initialize_connection,
    logger,
    send_email,
)
from zerver.lib.test_classes import ZulipTestCase


class TestBuildEmail(ZulipTestCase):
    def test_limited_from_length(self) -> None:
        hamlet = self.example_user("hamlet")
        # This is exactly the max length
        limit_length_name = "a" * (320 - len(sanitize_address(FromAddress.NOREPLY, "utf-8")) - 3)
        mail = build_email(
            "zerver/emails/password_reset",
            to_emails=[hamlet.email],
            from_name=limit_length_name,
            from_address=FromAddress.NOREPLY,
            language="en",
        )
        self.assertEqual(mail.extra_headers["From"], f"{limit_length_name} <{FromAddress.NOREPLY}>")

        # One more character makes it flip to just the address, with no name
        mail = build_email(
            "zerver/emails/password_reset",
            to_emails=[hamlet.email],
            from_name=limit_length_name + "a",
            from_address=FromAddress.NOREPLY,
            language="en",
        )
        self.assertEqual(mail.extra_headers["From"], FromAddress.NOREPLY)

    def test_limited_to_length(self) -> None:
        hamlet = self.example_user("hamlet")
        # This is exactly the max length
        limit_length_name = "澳" * 61
        hamlet.full_name = limit_length_name
        hamlet.save()

        mail = build_email(
            "zerver/emails/password_reset",
            to_user_ids=[hamlet.id],
            from_name="Noreply",
            from_address=FromAddress.NOREPLY,
            language="en",
        )
        self.assertEqual(mail.to[0], f"{hamlet.full_name} <{hamlet.delivery_email}>")

        # One more character makes it flip to just the address, with no name
        hamlet.full_name += "澳"
        hamlet.save()
        mail = build_email(
            "zerver/emails/password_reset",
            to_user_ids=[hamlet.id],
            from_name="Noreply",
            from_address=FromAddress.NOREPLY,
            language="en",
        )
        self.assertEqual(mail.to[0], hamlet.delivery_email)


class TestSendEmail(ZulipTestCase):
    def test_initialize_connection(self) -> None:
        # Test the new connection case
        with mock.patch.object(EmailBackend, "open", return_value=True):
            backend = initialize_connection(None)
            self.assertTrue(isinstance(backend, EmailBackend))

        backend = mock.MagicMock(spec=SMTPBackend)
        backend.connection = mock.MagicMock(spec=SMTP)

        self.assertTrue(isinstance(backend, SMTPBackend))

        # Test the old connection case when it is still open
        backend.open.return_value = False
        backend.connection.noop.return_value = [250]
        initialize_connection(backend)
        self.assertEqual(backend.open.call_count, 1)
        self.assertEqual(backend.connection.noop.call_count, 1)

        # Test the old connection case when it was closed by the server
        backend.connection.noop.return_value = [404]
        backend.close.return_value = False
        initialize_connection(backend)
        # 2 more calls to open, 1 more call to noop and 1 call to close
        self.assertEqual(backend.open.call_count, 3)
        self.assertEqual(backend.connection.noop.call_count, 2)
        self.assertEqual(backend.close.call_count, 1)

        # Test backoff procedure
        backend.open.side_effect = OSError
        with self.assertRaises(OSError):
            initialize_connection(backend)
        # 3 more calls to open as we try 3 times before giving up
        self.assertEqual(backend.open.call_count, 6)

    def test_send_email_exceptions(self) -> None:
        hamlet = self.example_user("hamlet")
        from_name = FromAddress.security_email_from_name(language="en")
        address = FromAddress.NOREPLY
        # Used to check the output
        mail = build_email(
            "zerver/emails/password_reset",
            to_emails=[hamlet.email],
            from_name=from_name,
            from_address=address,
            language="en",
        )
        self.assertEqual(mail.extra_headers["From"], f"{from_name} <{FromAddress.NOREPLY}>")

        # We test the cases that should raise an EmailNotDeliveredError
        errors = {
            f"Unknown error sending password_reset email to {mail.to}": [0],
            f"Error sending password_reset email to {mail.to}": [SMTPException()],
            f"Error sending password_reset email to {mail.to}: {{'{address}': (550, b'User unknown')}}": [
                SMTPRecipientsRefused(recipients={address: (550, b"User unknown")})
            ],
            f"Error sending password_reset email to {mail.to} with error code 242: From field too long": [
                SMTPDataError(242, "From field too long.")
            ],
        }

        for message, side_effect in errors.items():
            with mock.patch.object(EmailBackend, "send_messages", side_effect=side_effect):
                with (
                    self.assertLogs(logger=logger) as info_log,
                    self.assertRaises(EmailNotDeliveredError),
                ):
                    send_email(
                        "zerver/emails/password_reset",
                        to_emails=[hamlet.email],
                        from_name=from_name,
                        from_address=FromAddress.NOREPLY,
                        language="en",
                    )
                self.assert_length(info_log.records, 2)
                self.assertEqual(
                    info_log.output[0],
                    f"INFO:{logger.name}:Sending password_reset email to {mail.to}",
                )
                self.assertTrue(info_log.output[1].startswith(f"ERROR:zulip.send_email:{message}"))

    def test_send_email_config_error_logging(self) -> None:
        hamlet = self.example_user("hamlet")

        with (
            self.settings(EMAIL_HOST_USER="test", EMAIL_HOST_PASSWORD=None),
            self.assertLogs(logger=logger, level="ERROR") as error_log,
        ):
            send_email(
                "zerver/emails/password_reset",
                to_emails=[hamlet.email],
                from_name="From Name",
                from_address=FromAddress.NOREPLY,
                language="en",
            )

        self.assertEqual(
            error_log.output,
            [
                "ERROR:zulip.send_email:"
                "An SMTP username was set (EMAIL_HOST_USER), but password is unset (EMAIL_HOST_PASSWORD).  "
                "To disable SMTP authentication, set EMAIL_HOST_USER to an empty string."
            ],
        )

        # Empty string is OK
        with self.settings(EMAIL_HOST_USER="test", EMAIL_HOST_PASSWORD=""):
            send_email(
                "zerver/emails/password_reset",
                to_emails=[hamlet.email],
                from_name="From Name",
                from_address=FromAddress.NOREPLY,
                language="en",
            )
```

--------------------------------------------------------------------------------

---[FILE: test_server_settings.py]---
Location: zulip-main/zerver/tests/test_server_settings.py

```python
import os
from unittest import mock

from zerver.lib.test_classes import ZulipTestCase
from zproject import config


class ConfigTest(ZulipTestCase):
    def test_get_mandatory_secret_succeed(self) -> None:
        secret = config.get_mandatory_secret("shared_secret")
        self.assertGreater(len(secret), 0)

    def test_get_mandatory_secret_failed(self) -> None:
        with self.assertRaisesRegex(config.ZulipSettingsError, "nonexistent"):
            config.get_mandatory_secret("nonexistent")

    def test_disable_mandatory_secret_check(self) -> None:
        with mock.patch.dict(os.environ, {"DISABLE_MANDATORY_SECRET_CHECK": "True"}):
            secret = config.get_mandatory_secret("nonexistent")
        self.assertEqual(secret, "")
```

--------------------------------------------------------------------------------

---[FILE: test_service_bot_system.py]---
Location: zulip-main/zerver/tests/test_service_bot_system.py
Signals: Django

```python
from collections.abc import Callable
from functools import wraps
from typing import Any, Concatenate
from unittest import mock

import orjson
import responses
from django.conf import settings
from django.test import override_settings
from typing_extensions import ParamSpec, override

from zerver.actions.create_user import do_create_user
from zerver.actions.message_send import get_service_bot_events
from zerver.lib.bot_config import ConfigError, load_bot_config_template, set_bot_config
from zerver.lib.bot_lib import EmbeddedBotEmptyRecipientsListError, EmbeddedBotHandler, StateHandler
from zerver.lib.bot_storage import StateError
from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.test_helpers import mock_queue_publish
from zerver.lib.validator import check_string
from zerver.models import Recipient, UserProfile
from zerver.models.messages import UserMessage
from zerver.models.realms import get_realm
from zerver.models.scheduled_jobs import NotificationTriggers

BOT_TYPE_TO_QUEUE_NAME = {
    UserProfile.OUTGOING_WEBHOOK_BOT: "outgoing_webhooks",
    UserProfile.EMBEDDED_BOT: "embedded_bots",
}


class TestServiceBotBasics(ZulipTestCase):
    def _get_outgoing_bot(self) -> UserProfile:
        outgoing_bot = do_create_user(
            email="bar-bot@zulip.com",
            password="test",
            realm=get_realm("zulip"),
            full_name="BarBot",
            bot_type=UserProfile.OUTGOING_WEBHOOK_BOT,
            bot_owner=self.example_user("cordelia"),
            acting_user=None,
        )

        return outgoing_bot

    def test_service_events_for_pms(self) -> None:
        sender = self.example_user("hamlet")
        assert not sender.is_bot

        outgoing_bot = self._get_outgoing_bot()
        assert outgoing_bot.bot_type is not None

        event_dict = get_service_bot_events(
            sender=sender,
            service_bot_tuples=[
                (outgoing_bot.id, outgoing_bot.bot_type),
            ],
            active_user_ids={outgoing_bot.id},
            mentioned_user_ids=set(),
            recipient_type=Recipient.PERSONAL,
        )

        expected = dict(
            outgoing_webhooks=[
                dict(trigger=NotificationTriggers.DIRECT_MESSAGE, user_profile_id=outgoing_bot.id),
            ],
        )

        self.assertEqual(event_dict, expected)

    def test_spurious_mentions(self) -> None:
        sender = self.example_user("hamlet")
        assert not sender.is_bot

        outgoing_bot = self._get_outgoing_bot()
        assert outgoing_bot.bot_type is not None

        # If outgoing_bot is not in mentioned_user_ids,
        # we will skip over it.  This tests an anomaly
        # of the code that our query for bots can include
        # bots that may not actually be mentioned, and it's
        # easiest to just filter them in get_service_bot_events.
        event_dict = get_service_bot_events(
            sender=sender,
            service_bot_tuples=[
                (outgoing_bot.id, outgoing_bot.bot_type),
            ],
            active_user_ids={outgoing_bot.id},
            mentioned_user_ids=set(),
            recipient_type=Recipient.STREAM,
        )

        self.assert_length(event_dict, 0)

    def test_service_events_for_stream_mentions(self) -> None:
        sender = self.example_user("hamlet")
        assert not sender.is_bot

        outgoing_bot = self._get_outgoing_bot()
        assert outgoing_bot.bot_type is not None

        cordelia = self.example_user("cordelia")

        red_herring_bot = self.create_test_bot(
            short_name="whatever",
            user_profile=cordelia,
        )

        event_dict = get_service_bot_events(
            sender=sender,
            service_bot_tuples=[
                (outgoing_bot.id, outgoing_bot.bot_type),
                (red_herring_bot.id, UserProfile.OUTGOING_WEBHOOK_BOT),
            ],
            active_user_ids=set(),
            mentioned_user_ids={outgoing_bot.id},
            recipient_type=Recipient.STREAM,
        )

        expected = dict(
            outgoing_webhooks=[
                dict(trigger="mention", user_profile_id=outgoing_bot.id),
            ],
        )

        self.assertEqual(event_dict, expected)

    def test_service_events_for_private_mentions(self) -> None:
        """Service bots should not get access to mentions if they aren't a
        direct recipient."""
        sender = self.example_user("hamlet")
        assert not sender.is_bot

        outgoing_bot = self._get_outgoing_bot()
        assert outgoing_bot.bot_type is not None

        event_dict = get_service_bot_events(
            sender=sender,
            service_bot_tuples=[
                (outgoing_bot.id, outgoing_bot.bot_type),
            ],
            active_user_ids=set(),
            mentioned_user_ids={outgoing_bot.id},
            recipient_type=Recipient.PERSONAL,
        )

        self.assert_length(event_dict, 0)

    def test_service_events_with_unexpected_bot_type(self) -> None:
        hamlet = self.example_user("hamlet")
        cordelia = self.example_user("cordelia")

        bot = self.create_test_bot(
            short_name="whatever",
            user_profile=cordelia,
        )
        wrong_bot_type = UserProfile.INCOMING_WEBHOOK_BOT
        bot.bot_type = wrong_bot_type
        bot.save()

        with self.assertLogs(level="ERROR") as m:
            event_dict = get_service_bot_events(
                sender=hamlet,
                service_bot_tuples=[
                    (bot.id, wrong_bot_type),
                ],
                active_user_ids=set(),
                mentioned_user_ids={bot.id},
                recipient_type=Recipient.PERSONAL,
            )

        self.assert_length(event_dict, 0)
        self.assertEqual(
            m.output,
            [f"ERROR:root:Unexpected bot_type for Service bot id={bot.id}: {wrong_bot_type}"],
        )


class TestServiceBotStateHandler(ZulipTestCase):
    @override
    def setUp(self) -> None:
        super().setUp()
        self.user_profile = self.example_user("othello")
        self.bot_profile = do_create_user(
            email="embedded-bot-1@zulip.com",
            password="test",
            realm=get_realm("zulip"),
            full_name="EmbeddedBo1",
            bot_type=UserProfile.EMBEDDED_BOT,
            bot_owner=self.user_profile,
            acting_user=None,
        )
        self.second_bot_profile = do_create_user(
            email="embedded-bot-2@zulip.com",
            password="test",
            realm=get_realm("zulip"),
            full_name="EmbeddedBot2",
            bot_type=UserProfile.EMBEDDED_BOT,
            bot_owner=self.user_profile,
            acting_user=None,
        )

    def test_basic_storage_and_retrieval(self) -> None:
        storage = StateHandler(self.bot_profile)
        storage.put("some key", "some value")
        storage.put("some other key", "some other value")
        self.assertEqual(storage.get("some key"), "some value")
        self.assertEqual(storage.get("some other key"), "some other value")
        self.assertTrue(storage.contains("some key"))
        self.assertFalse(storage.contains("nonexistent key"))
        self.assertRaisesMessage(
            StateError, "Key does not exist.", lambda: storage.get("nonexistent key")
        )
        storage.put("some key", "a new value")
        self.assertEqual(storage.get("some key"), "a new value")
        second_storage = StateHandler(self.second_bot_profile)
        self.assertRaises(StateError, lambda: second_storage.get("some key"))
        second_storage.put("some key", "yet another value")
        self.assertEqual(storage.get("some key"), "a new value")
        self.assertEqual(second_storage.get("some key"), "yet another value")

    def test_marshaling(self) -> None:
        storage = StateHandler(self.bot_profile)
        serializable_obj = {"foo": "bar", "baz": [42, "cux"]}
        storage.put("some key", serializable_obj)
        self.assertEqual(storage.get("some key"), serializable_obj)

    # Reduce maximal storage size for faster test string construction.
    @override_settings(USER_STATE_SIZE_LIMIT=100)
    def test_storage_limit(self) -> None:
        storage = StateHandler(self.bot_profile)

        # Disable marshaling for storing a string whose size is
        # equivalent to the size of the stored object.
        storage.marshal = lambda obj: check_string("obj", obj)
        storage.demarshal = lambda obj: obj

        key = "capacity-filling entry"
        storage.put(key, "x" * (settings.USER_STATE_SIZE_LIMIT - len(key)))

        with self.assertRaisesMessage(
            StateError,
            "Request exceeds storage limit by 32 characters. The limit is 100 characters.",
        ):
            storage.put("too much data", "a few bits too long")

        second_storage = StateHandler(self.second_bot_profile)
        second_storage.put("another big entry", "x" * (settings.USER_STATE_SIZE_LIMIT - 40))
        second_storage.put("normal entry", "abcd")

    def test_entry_removal(self) -> None:
        storage = StateHandler(self.bot_profile)
        storage.put("some key", "some value")
        storage.put("another key", "some value")
        self.assertTrue(storage.contains("some key"))
        self.assertTrue(storage.contains("another key"))
        storage.remove("some key")
        self.assertFalse(storage.contains("some key"))
        self.assertTrue(storage.contains("another key"))
        self.assertRaises(StateError, lambda: storage.remove("some key"))

    def test_internal_endpoint(self) -> None:
        self.login_user(self.user_profile)

        # Store some data.
        initial_dict = {"key 1": "value 1", "key 2": "value 2", "key 3": "value 3"}
        params = {
            "storage": orjson.dumps(initial_dict).decode(),
        }
        result = self.client_put("/json/bot_storage", params)
        self.assert_json_success(result)

        # Assert the stored data for some keys.
        params = {
            "keys": orjson.dumps(["key 1", "key 3"]).decode(),
        }
        result = self.client_get("/json/bot_storage", params)
        response_dict = self.assert_json_success(result)
        self.assertEqual(response_dict["storage"], {"key 3": "value 3", "key 1": "value 1"})

        # Assert the stored data for all keys.
        result = self.client_get("/json/bot_storage")
        response_dict = self.assert_json_success(result)
        self.assertEqual(response_dict["storage"], initial_dict)

        # Store some more data; update an entry and store a new entry
        dict_update = {"key 1": "new value", "key 4": "value 4"}
        params = {
            "storage": orjson.dumps(dict_update).decode(),
        }
        result = self.client_put("/json/bot_storage", params)
        self.assert_json_success(result)

        # Assert the data was updated.
        updated_dict = initial_dict.copy()
        updated_dict.update(dict_update)
        result = self.client_get("/json/bot_storage")
        response_dict = self.assert_json_success(result)
        self.assertEqual(response_dict["storage"], updated_dict)

        # Assert errors on invalid requests.
        invalid_params = {
            "keys": ["This is a list, but should be a serialized string."],
        }
        result = self.client_get("/json/bot_storage", invalid_params)
        self.assert_json_error(result, "keys is not valid JSON")

        params = {
            "keys": orjson.dumps(["key 1", "nonexistent key"]).decode(),
        }
        result = self.client_get("/json/bot_storage", params)
        self.assert_json_error(result, "Key does not exist.")

        params = {
            "storage": orjson.dumps({"foo": [1, 2, 3]}).decode(),
        }
        result = self.client_put("/json/bot_storage", params)
        self.assert_json_error(result, 'storage["foo"] is not a string')

        # Remove some entries.
        keys_to_remove = ["key 1", "key 2"]
        params = {
            "keys": orjson.dumps(keys_to_remove).decode(),
        }
        result = self.client_delete("/json/bot_storage", params)
        self.assert_json_success(result)

        # Assert the entries were removed.
        for key in keys_to_remove:
            updated_dict.pop(key)
        result = self.client_get("/json/bot_storage")
        response_dict = self.assert_json_success(result)
        self.assertEqual(response_dict["storage"], updated_dict)

        # Try to remove an existing and a nonexistent key.
        params = {
            "keys": orjson.dumps(["key 3", "nonexistent key"]).decode(),
        }
        result = self.client_delete("/json/bot_storage", params)
        self.assert_json_error(result, "Key does not exist.")

        # Assert an error has been thrown and no entries were removed.
        result = self.client_get("/json/bot_storage")
        response_dict = self.assert_json_success(result)
        self.assertEqual(response_dict["storage"], updated_dict)

        # Remove the entire storage.
        result = self.client_delete("/json/bot_storage")
        self.assert_json_success(result)

        # Assert the entire storage has been removed.
        result = self.client_get("/json/bot_storage")
        response_dict = self.assert_json_success(result)
        self.assertEqual(response_dict["storage"], {})


class TestServiceBotConfigHandler(ZulipTestCase):
    @override
    def setUp(self) -> None:
        super().setUp()
        self.user_profile = self.example_user("othello")
        self.bot_profile = self.create_test_bot(
            "embedded",
            self.user_profile,
            full_name="Embedded bot",
            bot_type=UserProfile.EMBEDDED_BOT,
            service_name="helloworld",
        )
        self.bot_handler = EmbeddedBotHandler(self.bot_profile)

    def test_basic_storage_and_retrieval(self) -> None:
        with self.assertRaises(ConfigError):
            self.bot_handler.get_config_info("foo")

        self.assertEqual(self.bot_handler.get_config_info("foo", optional=True), {})

        config_dict = {"entry 1": "value 1", "entry 2": "value 2"}
        for key, value in config_dict.items():
            set_bot_config(self.bot_profile, key, value)
        self.assertEqual(self.bot_handler.get_config_info("foo"), config_dict)

        config_update = {"entry 2": "new value", "entry 3": "value 3"}
        for key, value in config_update.items():
            set_bot_config(self.bot_profile, key, value)
        config_dict.update(config_update)
        self.assertEqual(self.bot_handler.get_config_info("foo"), config_dict)

    @override_settings(BOT_CONFIG_SIZE_LIMIT=100)
    def test_config_entry_limit(self) -> None:
        set_bot_config(self.bot_profile, "some key", "x" * (settings.BOT_CONFIG_SIZE_LIMIT - 8))
        self.assertRaisesMessage(
            ConfigError,
            "Cannot store configuration. Request would require 101 characters. "
            "The current configuration size limit is 100 characters.",
            lambda: set_bot_config(
                self.bot_profile, "some key", "x" * (settings.BOT_CONFIG_SIZE_LIMIT - 8 + 1)
            ),
        )
        set_bot_config(self.bot_profile, "some key", "x" * (settings.BOT_CONFIG_SIZE_LIMIT - 20))
        set_bot_config(self.bot_profile, "another key", "x")
        self.assertRaisesMessage(
            ConfigError,
            "Cannot store configuration. Request would require 116 characters. "
            "The current configuration size limit is 100 characters.",
            lambda: set_bot_config(self.bot_profile, "yet another key", "x"),
        )

    def test_load_bot_config_template(self) -> None:
        bot_config = load_bot_config_template("giphy")
        self.assertTrue(isinstance(bot_config, dict))
        self.assert_length(bot_config, 1)

    def test_load_bot_config_template_for_bot_without_config_data(self) -> None:
        bot_config = load_bot_config_template("converter")
        self.assertTrue(isinstance(bot_config, dict))
        self.assert_length(bot_config, 0)

    def test_bot_send_pm_with_empty_recipients_list(self) -> None:
        with self.assertRaisesRegex(
            EmbeddedBotEmptyRecipientsListError, "Message must have recipients!"
        ):
            self.bot_handler.send_message(message={"type": "private", "to": []})


ParamT = ParamSpec("ParamT")


def for_all_bot_types(
    test_func: Callable[Concatenate["TestServiceBotEventTriggers", ParamT], None],
) -> Callable[Concatenate["TestServiceBotEventTriggers", ParamT], None]:
    @wraps(test_func)
    def _wrapped(
        self: "TestServiceBotEventTriggers", /, *args: ParamT.args, **kwargs: ParamT.kwargs
    ) -> None:
        for bot_type in BOT_TYPE_TO_QUEUE_NAME:
            self.bot_profile.bot_type = bot_type
            self.bot_profile.save()
            test_func(self, *args, **kwargs)

    return _wrapped


def patch_queue_publish(
    method_to_patch: str,
) -> Callable[
    [Callable[["TestServiceBotEventTriggers", mock.Mock], None]],
    Callable[["TestServiceBotEventTriggers"], None],
]:
    def inner(
        func: Callable[["TestServiceBotEventTriggers", mock.Mock], None],
    ) -> Callable[["TestServiceBotEventTriggers"], None]:
        @wraps(func)
        def _wrapped(self: "TestServiceBotEventTriggers") -> None:
            with mock_queue_publish(method_to_patch) as m:
                func(self, m)

        return _wrapped

    return inner


class TestServiceBotEventTriggers(ZulipTestCase):
    @override
    def setUp(self) -> None:
        super().setUp()
        self.user_profile = self.example_user("othello")
        self.bot_profile = do_create_user(
            email="foo-bot@zulip.com",
            password="test",
            realm=get_realm("zulip"),
            full_name="FooBot",
            bot_type=UserProfile.OUTGOING_WEBHOOK_BOT,
            bot_owner=self.user_profile,
            acting_user=None,
        )
        self.second_bot_profile = do_create_user(
            email="bar-bot@zulip.com",
            password="test",
            realm=get_realm("zulip"),
            full_name="BarBot",
            bot_type=UserProfile.OUTGOING_WEBHOOK_BOT,
            bot_owner=self.user_profile,
            acting_user=None,
        )

    @for_all_bot_types
    @patch_queue_publish("zerver.actions.message_send.queue_event_on_commit")
    def test_trigger_on_stream_mention_from_user(
        self, mock_queue_event_on_commit: mock.Mock
    ) -> None:
        content = "@**FooBot** foo bar!!!"
        recipient = "Denmark"
        trigger = "mention"
        recipient_type = "stream"

        def check_values_passed(
            queue_name: Any,
            trigger_event: dict[str, Any],
            processor: Callable[[Any], None] | None = None,
        ) -> None:
            assert self.bot_profile.bot_type
            self.assertEqual(queue_name, BOT_TYPE_TO_QUEUE_NAME[self.bot_profile.bot_type])
            self.assertEqual(trigger_event["message"]["content"], content)
            self.assertEqual(trigger_event["message"]["display_recipient"], recipient)
            self.assertEqual(trigger_event["message"]["sender_email"], self.user_profile.email)
            self.assertEqual(trigger_event["message"]["type"], recipient_type)
            self.assertEqual(trigger_event["trigger"], trigger)
            self.assertEqual(trigger_event["user_profile_id"], self.bot_profile.id)

        mock_queue_event_on_commit.side_effect = check_values_passed

        self.send_stream_message(self.user_profile, "Denmark", content)
        self.assertTrue(mock_queue_event_on_commit.called)

    @patch_queue_publish("zerver.actions.message_send.queue_event_on_commit")
    def test_no_trigger_on_stream_message_without_mention(
        self, mock_queue_event_on_commit: mock.Mock
    ) -> None:
        sender = self.user_profile
        self.send_stream_message(sender, "Denmark")
        self.assertFalse(mock_queue_event_on_commit.called)

    @for_all_bot_types
    @patch_queue_publish("zerver.actions.message_send.queue_event_on_commit")
    def test_no_trigger_on_stream_mention_from_bot(
        self, mock_queue_event_on_commit: mock.Mock
    ) -> None:
        self.send_stream_message(self.second_bot_profile, "Denmark", "@**FooBot** foo bar!!!")
        self.assertFalse(mock_queue_event_on_commit.called)

    @for_all_bot_types
    @patch_queue_publish("zerver.actions.message_send.queue_event_on_commit")
    def test_trigger_on_personal_message_from_user(
        self, mock_queue_event_on_commit: mock.Mock
    ) -> None:
        sender = self.user_profile
        recipient = self.bot_profile

        def check_values_passed(
            queue_name: Any,
            trigger_event: dict[str, Any],
            processor: Callable[[Any], None] | None = None,
        ) -> None:
            assert self.bot_profile.bot_type
            self.assertEqual(queue_name, BOT_TYPE_TO_QUEUE_NAME[self.bot_profile.bot_type])
            self.assertEqual(trigger_event["user_profile_id"], self.bot_profile.id)
            self.assertEqual(trigger_event["trigger"], NotificationTriggers.DIRECT_MESSAGE)
            self.assertEqual(trigger_event["message"]["sender_email"], sender.email)
            display_recipients = [
                trigger_event["message"]["display_recipient"][0]["email"],
                trigger_event["message"]["display_recipient"][1]["email"],
            ]
            self.assertTrue(sender.email in display_recipients)
            self.assertTrue(recipient.email in display_recipients)

        mock_queue_event_on_commit.side_effect = check_values_passed

        self.send_personal_message(sender, recipient, "test")
        self.assertTrue(mock_queue_event_on_commit.called)

    @for_all_bot_types
    @patch_queue_publish("zerver.actions.message_send.queue_event_on_commit")
    def test_no_trigger_on_personal_message_from_bot(
        self, mock_queue_event_on_commit: mock.Mock
    ) -> None:
        sender = self.second_bot_profile
        recipient = self.bot_profile
        self.send_personal_message(sender, recipient)
        self.assertFalse(mock_queue_event_on_commit.called)

    @for_all_bot_types
    @patch_queue_publish("zerver.actions.message_send.queue_event_on_commit")
    def test_trigger_on_group_direct_message_from_user(
        self, mock_queue_event_on_commit: mock.Mock
    ) -> None:
        self.second_bot_profile.bot_type = self.bot_profile.bot_type
        self.second_bot_profile.save()

        sender = self.user_profile
        recipients = [self.bot_profile, self.second_bot_profile]
        profile_ids = [self.bot_profile.id, self.second_bot_profile.id]

        def check_values_passed(
            queue_name: Any,
            trigger_event: dict[str, Any],
            processor: Callable[[Any], None] | None = None,
        ) -> None:
            assert self.bot_profile.bot_type
            self.assertEqual(queue_name, BOT_TYPE_TO_QUEUE_NAME[self.bot_profile.bot_type])
            self.assertIn(trigger_event["user_profile_id"], profile_ids)
            profile_ids.remove(trigger_event["user_profile_id"])
            self.assertEqual(trigger_event["trigger"], NotificationTriggers.DIRECT_MESSAGE)
            self.assertEqual(trigger_event["message"]["sender_email"], sender.email)
            self.assertEqual(trigger_event["message"]["type"], "private")

        mock_queue_event_on_commit.side_effect = check_values_passed

        self.send_group_direct_message(sender, recipients, "test")
        self.assertEqual(mock_queue_event_on_commit.call_count, 2)

    @for_all_bot_types
    @patch_queue_publish("zerver.actions.message_send.queue_event_on_commit")
    def test_no_trigger_on_group_direct_message_from_bot(
        self, mock_queue_event_on_commit: mock.Mock
    ) -> None:
        sender = self.second_bot_profile
        recipients = [self.user_profile, self.bot_profile]
        self.send_group_direct_message(sender, recipients)
        self.assertFalse(mock_queue_event_on_commit.called)

    @responses.activate
    @for_all_bot_types
    def test_flag_messages_service_bots_has_processed(self) -> None:
        """
        Verifies that once an event has been processed by the service bot's
        queue processor, the message is marked as processed (flagged with `read`).
        """
        sender = self.user_profile
        recipients = [self.user_profile, self.bot_profile, self.second_bot_profile]
        responses.add(
            responses.POST,
            "https://bot.example.com/",
            json="",
        )
        message_id = self.send_group_direct_message(
            sender, recipients, content=f"@**{self.bot_profile.full_name}** foo"
        )
        # message = Message.objects.get(id=message_id, sender=sender)
        bot_user_message = UserMessage.objects.get(
            user_profile=self.bot_profile, message=message_id
        )
        self.assertIn("read", bot_user_message.flags_list())
```

--------------------------------------------------------------------------------

---[FILE: test_sessions.py]---
Location: zulip-main/zerver/tests/test_sessions.py
Signals: Django

```python
from collections.abc import Callable
from datetime import timedelta
from typing import Any

import time_machine
from django.utils.timezone import now as timezone_now
from typing_extensions import override

from zerver.actions.realm_settings import do_set_realm_property
from zerver.actions.users import change_user_is_active
from zerver.lib.sessions import (
    delete_all_deactivated_user_sessions,
    delete_all_user_sessions,
    delete_realm_user_sessions,
    delete_session,
    delete_user_sessions,
    get_expirable_session_var,
    set_expirable_session_var,
    user_sessions,
)
from zerver.lib.test_classes import ZulipTestCase
from zerver.models import Realm, UserProfile
from zerver.models.realms import get_realm


class TestSessions(ZulipTestCase):
    def do_test_session(
        self, user: UserProfile, action: Callable[[], Any], realm: Realm, expected_result: bool
    ) -> None:
        self.login_user(user)
        self.assertIn("_auth_user_id", self.client.session)
        action()
        if expected_result:
            result = self.client_get("/", subdomain=realm.subdomain)
            self.assertEqual(200, result.status_code)
            self.assertTrue('is_spectator":true' in str(result.content))
        else:
            self.assertIn("_auth_user_id", self.client.session)

    def test_delete_session(self) -> None:
        user_profile = self.example_user("hamlet")
        self.login_user(user_profile)
        self.assertIn("_auth_user_id", self.client.session)
        for session in user_sessions(user_profile):
            delete_session(session)
        result = self.client_get("/")
        self.assertEqual(result.status_code, 200)
        self.assertTrue('is_spectator":true' in str(result.content))

    def test_delete_user_sessions(self) -> None:
        user_profile = self.example_user("hamlet")
        self.do_test_session(
            user_profile, lambda: delete_user_sessions(user_profile), get_realm("zulip"), True
        )
        self.do_test_session(
            self.example_user("othello"),
            lambda: delete_user_sessions(user_profile),
            get_realm("zulip"),
            False,
        )

    def test_delete_realm_user_sessions(self) -> None:
        realm = get_realm("zulip")
        self.do_test_session(
            self.example_user("hamlet"),
            lambda: delete_realm_user_sessions(realm),
            get_realm("zulip"),
            True,
        )
        self.do_test_session(
            self.mit_user("sipbtest"),
            lambda: delete_realm_user_sessions(realm),
            get_realm("zephyr"),
            False,
        )

    def test_delete_all_user_sessions(self) -> None:
        self.do_test_session(
            self.example_user("hamlet"),
            delete_all_user_sessions,
            get_realm("zulip"),
            True,
        )

        lear_realm = get_realm("lear")
        do_set_realm_property(lear_realm, "enable_spectator_access", True, acting_user=None)
        self.make_stream(
            "web_public_stream",
            realm=lear_realm,
            is_web_public=True,
        )
        self.do_test_session(
            self.lear_user("cordelia"),
            delete_all_user_sessions,
            lear_realm,
            True,
        )

    def test_delete_all_deactivated_user_sessions(self) -> None:
        # Test that no exception is thrown with a logged-out session
        self.login("othello")
        self.assertIn("_auth_user_id", self.client.session)
        self.client_post("/accounts/logout/")
        delete_all_deactivated_user_sessions()
        result = self.client_get("/")
        self.assertEqual(result.status_code, 200)
        self.assertTrue('is_spectator":true' in str(result.content))

        # Test nothing happens to an active user's session
        self.login("othello")
        self.assertIn("_auth_user_id", self.client.session)
        delete_all_deactivated_user_sessions()
        self.assertIn("_auth_user_id", self.client.session)

        # Test that a deactivated session gets logged out
        user_profile_3 = self.example_user("cordelia")
        self.login_user(user_profile_3)
        self.assertIn("_auth_user_id", self.client.session)
        change_user_is_active(user_profile_3, False)
        with self.assertLogs(level="INFO") as info_logs:
            delete_all_deactivated_user_sessions()
        self.assertEqual(
            info_logs.output,
            [f"INFO:root:Deactivating session for deactivated user {user_profile_3.id}"],
        )
        result = self.client_get("/")
        self.assertEqual(result.status_code, 200)
        self.assertTrue('is_spectator":true' in str(result.content))


class TestExpirableSessionVars(ZulipTestCase):
    @override
    def setUp(self) -> None:
        self.session = self.client.session
        super().setUp()

    def test_set_and_get_basic(self) -> None:
        start_time = timezone_now()
        with time_machine.travel(start_time, tick=False):
            set_expirable_session_var(
                self.session, "test_set_and_get_basic", "some_value", expiry_seconds=10
            )
            value = get_expirable_session_var(self.session, "test_set_and_get_basic")
            self.assertEqual(value, "some_value")
        with time_machine.travel((start_time + timedelta(seconds=11)), tick=False):
            value = get_expirable_session_var(self.session, "test_set_and_get_basic")
            self.assertEqual(value, None)

    def test_set_and_get_with_delete(self) -> None:
        set_expirable_session_var(
            self.session, "test_set_and_get_with_delete", "some_value", expiry_seconds=10
        )
        value = get_expirable_session_var(self.session, "test_set_and_get_with_delete", delete=True)
        self.assertEqual(value, "some_value")
        self.assertEqual(
            get_expirable_session_var(self.session, "test_set_and_get_with_delete"), None
        )

    def test_get_var_not_set(self) -> None:
        value = get_expirable_session_var(
            self.session, "test_get_var_not_set", default_value="default"
        )
        self.assertEqual(value, "default")

    def test_get_var_is_not_expirable(self) -> None:
        self.session["test_get_var_is_not_expirable"] = 0
        with self.assertLogs(level="WARNING") as m:
            value = get_expirable_session_var(
                self.session, "test_get_var_is_not_expirable", default_value="default"
            )
            self.assertEqual(value, "default")
            self.assertIn(
                "WARNING:root:get_expirable_session_var: error getting test_get_var_is_not_expirable",
                m.output[0],
            )
```

--------------------------------------------------------------------------------

````
