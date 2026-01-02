---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 1045
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1045 of 1290)

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

---[FILE: test_realm_playgrounds.py]---
Location: zulip-main/zerver/tests/test_realm_playgrounds.py

```python
from zerver.actions.realm_playgrounds import check_add_realm_playground
from zerver.actions.realm_settings import do_set_realm_property
from zerver.lib.test_classes import ZulipTestCase
from zerver.models import RealmPlayground
from zerver.models.realms import get_realm


class RealmPlaygroundTests(ZulipTestCase):
    def test_create_one_playground_entry(self) -> None:
        iago = self.example_user("iago")

        payload = {
            "name": "Python playground",
            "pygments_language": "Python",
            "url_template": "https://python.example.com{code}",
        }
        # Now send a POST request to the API endpoint.
        resp = self.api_post(iago, "/api/v1/realm/playgrounds", payload)
        self.assert_json_success(resp)

        # Check if the actual object exists
        realm = get_realm("zulip")
        self.assertTrue(
            RealmPlayground.objects.filter(realm=realm, name="Python playground").exists()
        )

    def test_create_multiple_playgrounds_for_same_language(self) -> None:
        iago = self.example_user("iago")

        data = [
            {
                "name": "Python playground 1",
                "pygments_language": "Python",
                "url_template": "https://python.example.com{code}",
            },
            {
                "name": "Python playground 2",
                "pygments_language": "Python",
                "url_template": "https://python2.example.com{code}",
            },
        ]
        for payload in data:
            resp = self.api_post(iago, "/api/v1/realm/playgrounds", payload)
            self.assert_json_success(resp)

        realm = get_realm("zulip")
        self.assertTrue(
            RealmPlayground.objects.filter(realm=realm, name="Python playground 1").exists()
        )
        self.assertTrue(
            RealmPlayground.objects.filter(realm=realm, name="Python playground 2").exists()
        )

    def test_invalid_params(self) -> None:
        iago = self.example_user("iago")

        payload = {
            "name": "Invalid characters in pygments language",
            "pygments_language": "a$b$c",
            "url_template": "https://template.com{code}",
        }
        resp = self.api_post(iago, "/api/v1/realm/playgrounds", payload)
        self.assert_json_error(resp, "Invalid characters in pygments language")

        payload = {
            "name": "Template with an unexpected variable",
            "pygments_language": "Python",
            "url_template": "https://template.com{?test,code}",
        }
        resp = self.api_post(iago, "/api/v1/realm/playgrounds", payload)
        self.assert_json_error(
            resp, '"code" should be the only variable present in the URL template'
        )

        payload = {
            "name": "Invalid URL template",
            "pygments_language": "Python",
            "url_template": "https://template.com?test={test",
        }
        resp = self.api_post(iago, "/api/v1/realm/playgrounds", payload)
        self.assert_json_error(resp, "Invalid URL template.")

        payload = {
            "name": "Template without the required variable",
            "pygments_language": "Python",
            "url_template": "https://template.com{?test}",
        }
        resp = self.api_post(iago, "/api/v1/realm/playgrounds", payload)
        self.assert_json_error(resp, 'Missing the required variable "code" in the URL template')

    def test_create_already_existing_playground(self) -> None:
        iago = self.example_user("iago")

        payload = {
            "name": "Python playground",
            "pygments_language": "Python",
            "url_template": "https://python.example.com{code}",
        }
        resp = self.api_post(iago, "/api/v1/realm/playgrounds", payload)
        self.assert_json_success(resp)

        resp = self.api_post(iago, "/api/v1/realm/playgrounds", payload)
        self.assert_json_error(
            resp, "Realm playground with this Realm, Pygments language and Name already exists."
        )

    def test_not_realm_admin(self) -> None:
        hamlet = self.example_user("hamlet")

        resp = self.api_post(hamlet, "/api/v1/realm/playgrounds")
        self.assert_json_error(resp, "Must be an organization administrator")

        resp = self.api_delete(hamlet, "/api/v1/realm/playgrounds/1")
        self.assert_json_error(resp, "Must be an organization administrator")

    def test_delete_realm_playground(self) -> None:
        iago = self.example_user("iago")
        realm = get_realm("zulip")

        playground_id = check_add_realm_playground(
            realm,
            acting_user=iago,
            name="Python playground",
            pygments_language="Python",
            url_template="https://python.example.com{code}",
        )
        self.assertTrue(RealmPlayground.objects.filter(name="Python playground").exists())

        result = self.api_delete(iago, f"/api/v1/realm/playgrounds/{playground_id + 1}")
        self.assert_json_error(result, "Invalid playground")

        result = self.api_delete(iago, f"/api/v1/realm/playgrounds/{playground_id}")
        self.assert_json_success(result)
        self.assertFalse(RealmPlayground.objects.filter(name="Python").exists())

    def test_delete_default_code_block_language_playground(self) -> None:
        iago = self.example_user("iago")
        realm = get_realm("zulip")

        playground_id = check_add_realm_playground(
            realm,
            acting_user=iago,
            name="Python playground",
            pygments_language="Python",
            url_template="https://python.example.com{code}",
        )
        self.assertTrue(RealmPlayground.objects.filter(name="Python playground").exists())

        # Set the default code block language to the playground's language
        do_set_realm_property(realm, "default_code_block_language", "Python", acting_user=iago)
        self.assertEqual(realm.default_code_block_language, "Python")
        result = self.api_delete(iago, f"/api/v1/realm/playgrounds/{playground_id}")
        self.assert_json_success(result)
        realm.refresh_from_db()
        self.assertFalse(RealmPlayground.objects.filter(name="Python").exists())
        self.assertEqual(realm.default_code_block_language, "")
```

--------------------------------------------------------------------------------

---[FILE: test_recipient_parsing.py]---
Location: zulip-main/zerver/tests/test_recipient_parsing.py

```python
from zerver.lib.exceptions import JsonableError
from zerver.lib.recipient_parsing import extract_direct_message_recipient_ids, extract_stream_id
from zerver.lib.test_classes import ZulipTestCase


class TestRecipientParsing(ZulipTestCase):
    def test_extract_stream_id(self) -> None:
        # stream message recipient = single stream ID.
        stream_id = extract_stream_id(1)
        self.assertEqual(stream_id, 1)

        with self.assertRaisesRegex(JsonableError, "Invalid data type for channel ID"):
            extract_stream_id([1, 2])

        with self.assertRaisesRegex(JsonableError, "Invalid data type for channel ID"):
            extract_stream_id([1])

    def test_extract_recipient_ids(self) -> None:
        # direct message recipients = user IDs.
        user_ids = [3, 2, 1]
        result = sorted(extract_direct_message_recipient_ids(user_ids))
        self.assertEqual(result, [1, 2, 3])

        # list w/duplicates
        user_ids = [3, 3, 12]
        result = sorted(extract_direct_message_recipient_ids(user_ids))
        self.assertEqual(result, [3, 12])

        with self.assertRaisesRegex(JsonableError, "Invalid data type for recipients"):
            extract_direct_message_recipient_ids(1)
```

--------------------------------------------------------------------------------

---[FILE: test_redis_utils.py]---
Location: zulip-main/zerver/tests/test_redis_utils.py

```python
from unittest import mock

from redis import StrictRedis
from typing_extensions import override

from zerver.lib.redis_utils import (
    MAX_KEY_LENGTH,
    ZulipRedisKeyOfWrongFormatError,
    ZulipRedisKeyTooLongError,
    get_dict_from_redis,
    get_redis_client,
    put_dict_in_redis,
)
from zerver.lib.test_classes import ZulipTestCase


class RedisUtilsTest(ZulipTestCase):
    key_format = "test_redis_utils_{token}"
    expiration_seconds = 60
    redis_client: "StrictRedis[bytes]"

    @classmethod
    @override
    def setUpClass(cls) -> None:
        cls.redis_client = get_redis_client()
        return super().setUpClass()

    def test_put_and_get_data(self) -> None:
        data = {
            "a": 1,
            "b": "some value",
        }
        key = put_dict_in_redis(
            self.redis_client, self.key_format, data, expiration_seconds=self.expiration_seconds
        )
        retrieved_data = get_dict_from_redis(self.redis_client, self.key_format, key)
        self.assertEqual(data, retrieved_data)

    def test_put_data_key_length_check(self) -> None:
        data = {
            "a": 1,
            "b": "some value",
        }

        max_valid_token_length = MAX_KEY_LENGTH - (len(self.key_format) - len("{token}"))
        key = put_dict_in_redis(
            self.redis_client,
            self.key_format,
            data,
            expiration_seconds=self.expiration_seconds,
            token_length=max_valid_token_length,
        )
        retrieved_data = get_dict_from_redis(self.redis_client, self.key_format, key)
        self.assertEqual(data, retrieved_data)

        # Trying to put data under an overly long key should get stopped before even
        # generating the random token.
        with mock.patch("secrets.token_hex") as mock_generate:
            with self.assertRaises(ZulipRedisKeyTooLongError):
                put_dict_in_redis(
                    self.redis_client,
                    self.key_format,
                    data,
                    expiration_seconds=self.expiration_seconds,
                    token_length=max_valid_token_length + 1,
                )
            mock_generate.assert_not_called()

    def test_get_data_key_length_check(self) -> None:
        with self.assertRaises(ZulipRedisKeyTooLongError):
            get_dict_from_redis(
                self.redis_client, key_format="{token}", key="A" * (MAX_KEY_LENGTH + 1)
            )

    def test_get_data_key_format_validation(self) -> None:
        with self.assertRaises(ZulipRedisKeyOfWrongFormatError):
            get_dict_from_redis(self.redis_client, self.key_format, "nonmatching_format_1111")
```

--------------------------------------------------------------------------------

---[FILE: test_reminders.py]---
Location: zulip-main/zerver/tests/test_reminders.py
Signals: Django

```python
import datetime
import time
from typing import TYPE_CHECKING

import time_machine
from django.test.utils import override_settings

from zerver.actions.scheduled_messages import try_deliver_one_scheduled_message
from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.timestamp import timestamp_to_datetime
from zerver.models import Message, ScheduledMessage
from zerver.models.recipients import Recipient, get_or_create_direct_message_group

if TYPE_CHECKING:
    from django.test.client import _MonkeyPatchedWSGIResponse as TestHttpResponse


class RemindersTest(ZulipTestCase):
    def do_schedule_reminder(
        self,
        message_id: int,
        scheduled_delivery_timestamp: int,
        note: str | None = None,
    ) -> "TestHttpResponse":
        self.login("hamlet")

        payload: dict[str, int | str] = {
            "message_id": message_id,
            "scheduled_delivery_timestamp": scheduled_delivery_timestamp,
        }
        if note is not None:
            payload["note"] = note

        result = self.client_post("/json/reminders", payload)
        return result

    def create_reminder(self, content: str, message_type: str = "direct") -> ScheduledMessage:
        if message_type == "stream":
            message_id = self.send_channel_message_for_hamlet(content)
        else:
            message_id = self.send_dm_from_hamlet_to_othello(content)

        scheduled_delivery_timestamp = int(time.time() + 86400)
        result = self.do_schedule_reminder(message_id, scheduled_delivery_timestamp)
        self.assert_json_success(result)
        return self.last_scheduled_reminder()

    def last_scheduled_reminder(self) -> ScheduledMessage:
        return ScheduledMessage.objects.filter(delivery_type=ScheduledMessage.REMIND).order_by(
            "-id"
        )[0]

    def send_channel_message_for_hamlet(self, content: str) -> int:
        return self.send_stream_message(self.example_user("hamlet"), "Verona", content)

    def send_dm_from_hamlet_to_othello(self, content: str) -> int:
        return self.send_personal_message(
            self.example_user("hamlet"), self.example_user("othello"), content
        )

    def get_dm_reminder_content(self, msg_content: str, msg_id: int) -> str:
        return (
            "You requested a reminder for the following direct message.\n\n"
            f"@_**King Hamlet|10** [said](http://zulip.testserver/#narrow/dm/10,12/near/{msg_id}):\n```quote\n{msg_content}\n```"
        )

    def get_channel_message_reminder_content(self, msg_content: str, msg_id: int) -> str:
        return (
            f"You requested a reminder for #**Verona>test@{msg_id}**.\n\n"
            f"@_**King Hamlet|10** [said](http://zulip.testserver/#narrow/channel/3-Verona/topic/test/near/{msg_id}):\n```quote\n{msg_content}\n```"
        )

    def test_schedule_reminder(self) -> None:
        self.login("hamlet")
        content = "Test message"
        scheduled_delivery_timestamp = int(time.time() + 86400)

        # Scheduling a reminder to a channel you are subscribed is successful.
        message_id = self.send_channel_message_for_hamlet(content)
        result = self.do_schedule_reminder(message_id, scheduled_delivery_timestamp)
        self.assert_json_success(result)
        scheduled_message = self.last_scheduled_reminder()
        self.assertEqual(
            scheduled_message.content,
            self.get_channel_message_reminder_content(content, message_id),
        )
        # Recipient and sender are the same for reminders.
        self.assertEqual(scheduled_message.recipient.type_id, self.example_user("hamlet").id)
        self.assertEqual(scheduled_message.sender, self.example_user("hamlet"))
        self.assertEqual(
            scheduled_message.scheduled_timestamp,
            timestamp_to_datetime(scheduled_delivery_timestamp),
        )
        self.assertEqual(
            scheduled_message.reminder_target_message_id,
            message_id,
        )
        self.assertEqual(scheduled_message.topic_name(), Message.DM_TOPIC)

        # Scheduling a direct message with user IDs is successful.
        self.example_user("othello")
        message_id = self.send_dm_from_hamlet_to_othello(content)
        result = self.do_schedule_reminder(message_id, scheduled_delivery_timestamp)
        self.assert_json_success(result)
        scheduled_message = self.last_scheduled_reminder()
        self.assertEqual(
            scheduled_message.content, self.get_dm_reminder_content(content, message_id)
        )
        self.assertEqual(scheduled_message.recipient.type_id, self.example_user("hamlet").id)
        self.assertEqual(scheduled_message.sender, self.example_user("hamlet"))
        self.assertEqual(
            scheduled_message.scheduled_timestamp,
            timestamp_to_datetime(scheduled_delivery_timestamp),
        )
        self.assertEqual(
            scheduled_message.reminder_target_message_id,
            message_id,
        )
        self.assertEqual(scheduled_message.topic_name(), Message.DM_TOPIC)

    @override_settings(PREFER_DIRECT_MESSAGE_GROUP=True)
    def test_schedule_reminder_using_direct_message_group(self) -> None:
        hamlet = self.example_user("hamlet")
        othello = self.example_user("othello")

        self.login("hamlet")
        content = "Test message"
        scheduled_delivery_timestamp = int(time.time() + 86400)

        # Create a direct message group between hamlet and othello.
        get_or_create_direct_message_group(id_list=[hamlet.id, othello.id])

        # Create a direct message group for hamlet's self messages.
        hamlet_self_direct_message_group = get_or_create_direct_message_group(id_list=[hamlet.id])

        # Scheduling a direct message with user IDs is successful.
        message_id = self.send_dm_from_hamlet_to_othello(content)
        result = self.do_schedule_reminder(message_id, scheduled_delivery_timestamp)
        self.assert_json_success(result)
        scheduled_message = self.last_scheduled_reminder()
        self.assertEqual(
            scheduled_message.content, self.get_dm_reminder_content(content, message_id)
        )
        self.assertEqual(scheduled_message.recipient.type, Recipient.DIRECT_MESSAGE_GROUP)
        self.assertEqual(scheduled_message.recipient.type_id, hamlet_self_direct_message_group.id)
        self.assertEqual(scheduled_message.sender, hamlet)
        self.assertEqual(
            scheduled_message.scheduled_timestamp,
            timestamp_to_datetime(scheduled_delivery_timestamp),
        )
        self.assertEqual(
            scheduled_message.reminder_target_message_id,
            message_id,
        )

    def test_schedule_reminder_with_bad_timestamp(self) -> None:
        self.login("hamlet")
        content = "Test message"
        scheduled_delivery_timestamp = int(time.time() - 86400)

        message_id = self.send_channel_message_for_hamlet(content)
        result = self.do_schedule_reminder(message_id, scheduled_delivery_timestamp)
        self.assert_json_error(result, "Scheduled delivery time must be in the future.")

    def test_schedule_reminder_with_bad_message_id(self) -> None:
        self.login("hamlet")
        scheduled_delivery_timestamp = int(time.time() + 86400)

        result = self.do_schedule_reminder(123456789, scheduled_delivery_timestamp)
        self.assert_json_error(result, "Invalid message(s)")

    def test_successful_deliver_direct_message_reminder(self) -> None:
        # No scheduled message
        result = try_deliver_one_scheduled_message()
        self.assertFalse(result)

        content = "Test content"
        reminder = self.create_reminder(content)

        # mock current time to be greater than the scheduled time, so that the `scheduled_message` can be sent.
        more_than_scheduled_delivery_datetime = reminder.scheduled_timestamp + datetime.timedelta(
            minutes=1
        )

        with (
            time_machine.travel(more_than_scheduled_delivery_datetime, tick=False),
            self.assertLogs(level="INFO") as logs,
        ):
            result = try_deliver_one_scheduled_message()
            self.assertTrue(result)
            reminder.refresh_from_db()
            self.assertEqual(
                logs.output,
                [
                    f"INFO:root:Sending scheduled message {reminder.id} with date {reminder.scheduled_timestamp} (sender: {reminder.sender_id})"
                ],
            )
            self.assertEqual(reminder.delivered, True)
            self.assertEqual(reminder.failed, False)
            assert isinstance(reminder.delivered_message_id, int)
            delivered_message = Message.objects.get(id=reminder.delivered_message_id)
            assert isinstance(reminder.reminder_target_message_id, int)
            self.assertEqual(
                delivered_message.content,
                self.get_dm_reminder_content(content, reminder.reminder_target_message_id),
            )
            self.assertEqual(delivered_message.date_sent, more_than_scheduled_delivery_datetime)

    def test_successful_deliver_channel_message_reminder(self) -> None:
        # No scheduled message
        result = try_deliver_one_scheduled_message()
        self.assertFalse(result)

        content = "Test content"
        reminder = self.create_reminder(content, "stream")

        # mock current time to be greater than the scheduled time, so that the `scheduled_message` can be sent.
        more_than_scheduled_delivery_datetime = reminder.scheduled_timestamp + datetime.timedelta(
            minutes=1
        )

        with (
            time_machine.travel(more_than_scheduled_delivery_datetime, tick=False),
            self.assertLogs(level="INFO") as logs,
        ):
            result = try_deliver_one_scheduled_message()
            self.assertTrue(result)
            reminder.refresh_from_db()
            self.assertEqual(
                logs.output,
                [
                    f"INFO:root:Sending scheduled message {reminder.id} with date {reminder.scheduled_timestamp} (sender: {reminder.sender_id})"
                ],
            )
            self.assertEqual(reminder.delivered, True)
            self.assertEqual(reminder.failed, False)
            assert isinstance(reminder.delivered_message_id, int)
            delivered_message = Message.objects.get(id=reminder.delivered_message_id)
            assert isinstance(reminder.reminder_target_message_id, int)
            self.assertEqual(
                delivered_message.content,
                self.get_channel_message_reminder_content(
                    content, reminder.reminder_target_message_id
                ),
            )
            self.assertEqual(delivered_message.date_sent, more_than_scheduled_delivery_datetime)

    def test_send_reminder_at_max_content_limit(self) -> None:
        # No scheduled message
        result = try_deliver_one_scheduled_message()
        self.assertFalse(result)

        content = "x" * 10000
        reminder = self.create_reminder(content)

        # mock current time to be greater than the scheduled time, so that the `scheduled_message` can be sent.
        more_than_scheduled_delivery_datetime = reminder.scheduled_timestamp + datetime.timedelta(
            minutes=1
        )

        with (
            time_machine.travel(more_than_scheduled_delivery_datetime, tick=False),
            self.assertLogs(level="INFO") as logs,
        ):
            result = try_deliver_one_scheduled_message()
            self.assertTrue(result)
            reminder.refresh_from_db()
            self.assertEqual(
                logs.output,
                [
                    f"INFO:root:Sending scheduled message {reminder.id} with date {reminder.scheduled_timestamp} (sender: {reminder.sender_id})"
                ],
            )
            self.assertEqual(reminder.delivered, True)
            self.assertEqual(reminder.failed, False)
            assert isinstance(reminder.delivered_message_id, int)
            delivered_message = Message.objects.get(id=reminder.delivered_message_id)
            # The reminder message is truncated to 10,000 characters if it exceeds the limit.
            assert isinstance(reminder.reminder_target_message_id, int)
            length_of_reminder_content_wrapper = len(
                self.get_dm_reminder_content(
                    "\n[message truncated]", reminder.reminder_target_message_id
                )
            )
            self.assertEqual(
                delivered_message.content,
                self.get_dm_reminder_content(
                    content[:-length_of_reminder_content_wrapper] + "\n[message truncated]",
                    reminder.reminder_target_message_id,
                ),
            )
            self.assertEqual(delivered_message.date_sent, more_than_scheduled_delivery_datetime)

    def test_scheduled_reminder_with_inaccessible_message(self) -> None:
        # No scheduled message
        result = try_deliver_one_scheduled_message()
        self.assertFalse(result)

        content = "Test content"
        reminder = self.create_reminder(content)

        # Delete the message to make it inaccessible.
        assert isinstance(reminder.reminder_target_message_id, int)
        Message.objects.filter(id=reminder.reminder_target_message_id).delete()

        # mock current time to be greater than the scheduled time, so that the `scheduled_message` can be sent.
        more_than_scheduled_delivery_datetime = reminder.scheduled_timestamp + datetime.timedelta(
            minutes=1
        )
        with (
            time_machine.travel(more_than_scheduled_delivery_datetime, tick=False),
            self.assertLogs(level="INFO") as logs,
        ):
            result = try_deliver_one_scheduled_message()
            self.assertTrue(result)
            reminder.refresh_from_db()
            self.assertEqual(
                logs.output,
                [
                    f"INFO:root:Sending scheduled message {reminder.id} with date {reminder.scheduled_timestamp} (sender: {reminder.sender_id})"
                ],
            )
            self.assertEqual(reminder.delivered, True)
            self.assertEqual(reminder.failed, False)
            assert isinstance(reminder.delivered_message_id, int)
            delivered_message = Message.objects.get(id=reminder.delivered_message_id)
            self.assertEqual(
                delivered_message.content,
                self.get_dm_reminder_content(content, reminder.reminder_target_message_id),
            )
            self.assertEqual(delivered_message.date_sent, more_than_scheduled_delivery_datetime)

    def test_delete_reminder(self) -> None:
        hamlet = self.example_user("hamlet")
        cordelia = self.example_user("cordelia")

        response = self.api_get(hamlet, "/api/v1/reminders")
        self.assert_json_success(response)
        response_data = response.json()
        self.assertEqual(response_data["reminders"], [])

        # Create a test message to schedule a reminder for.
        message_id = self.send_stream_message(
            hamlet,
            "Denmark",
        )

        # Schedule a reminder for the created message.
        deliver_at = int(time.time() + 86400)

        response = self.do_schedule_reminder(
            message_id=message_id,
            scheduled_delivery_timestamp=deliver_at,
        )
        self.assert_json_success(response)
        response_data = response.json()
        self.assertIn("reminder_id", response_data)
        reminder_id = response_data["reminder_id"]

        # Verify that the reminder was scheduled correctly.
        reminders_response = self.api_get(hamlet, "/api/v1/reminders")
        self.assert_json_success(reminders_response)
        reminders_data = reminders_response.json()
        self.assert_length(reminders_data["reminders"], 1)
        reminder = reminders_data["reminders"][0]
        self.assertEqual(reminder["reminder_id"], reminder_id)
        self.assertEqual(reminder["reminder_target_message_id"], message_id)

        # Test deleting the reminder with the wrong user.
        result = self.api_delete(cordelia, f"/api/v1/reminders/{reminder_id}")
        self.assert_json_error(result, "Reminder does not exist", status_code=404)

        # Test deleting the reminder.
        result = self.client_delete(f"/json/reminders/{reminder_id}")
        self.assert_json_success(result)

        # Verify that the reminder was deleted.
        self.assertEqual(response.status_code, 200)
        reminders_response = self.api_get(hamlet, "/api/v1/reminders")
        self.assert_json_success(reminders_response)
        reminders_data = reminders_response.json()
        self.assert_length(reminders_data["reminders"], 0)

        # Try deleting again to trigger failure.
        result = self.client_delete(f"/json/reminders/{reminder_id}")
        self.assert_json_error(result, "Reminder does not exist", status_code=404)

    def test_reminder_for_poll(self) -> None:
        content = "/poll What is your favorite color?"
        reminder = self.create_reminder(content)

        # mock current time to be greater than the scheduled time, so that the `scheduled_message` can be sent.
        more_than_scheduled_delivery_datetime = reminder.scheduled_timestamp + datetime.timedelta(
            minutes=1
        )

        with (
            time_machine.travel(more_than_scheduled_delivery_datetime, tick=False),
            self.assertLogs(level="INFO") as logs,
        ):
            result = try_deliver_one_scheduled_message()
            self.assertTrue(result)
            reminder.refresh_from_db()
            self.assertEqual(
                logs.output,
                [
                    f"INFO:root:Sending scheduled message {reminder.id} with date {reminder.scheduled_timestamp} (sender: {reminder.sender_id})"
                ],
            )
            self.assertEqual(reminder.delivered, True)
            self.assertEqual(reminder.failed, False)
            assert isinstance(reminder.delivered_message_id, int)
            delivered_message = Message.objects.get(id=reminder.delivered_message_id)
            assert isinstance(reminder.reminder_target_message_id, int)
            self.assertEqual(
                delivered_message.content,
                "You requested a reminder for the following direct message."
                "\n\n"
                f"@_**King Hamlet|10** [sent](http://zulip.testserver/#narrow/dm/10,12/near/{reminder.reminder_target_message_id}) a poll.",
            )
            self.assertEqual(delivered_message.date_sent, more_than_scheduled_delivery_datetime)

    def test_reminder_for_todo(self) -> None:
        content = "/todo List of tasks"
        reminder = self.create_reminder(content)

        # mock current time to be greater than the scheduled time, so that the `scheduled_message` can be sent.
        more_than_scheduled_delivery_datetime = reminder.scheduled_timestamp + datetime.timedelta(
            minutes=1
        )

        with (
            time_machine.travel(more_than_scheduled_delivery_datetime, tick=False),
            self.assertLogs(level="INFO") as logs,
        ):
            result = try_deliver_one_scheduled_message()
            self.assertTrue(result)
            reminder.refresh_from_db()
            self.assertEqual(
                logs.output,
                [
                    f"INFO:root:Sending scheduled message {reminder.id} with date {reminder.scheduled_timestamp} (sender: {reminder.sender_id})"
                ],
            )
            self.assertEqual(reminder.delivered, True)
            self.assertEqual(reminder.failed, False)
            assert isinstance(reminder.delivered_message_id, int)
            delivered_message = Message.objects.get(id=reminder.delivered_message_id)
            assert isinstance(reminder.reminder_target_message_id, int)
            self.assertEqual(
                delivered_message.content,
                "You requested a reminder for the following direct message."
                "\n\n"
                f"@_**King Hamlet|10** [sent](http://zulip.testserver/#narrow/dm/10,12/near/{reminder.reminder_target_message_id}) a todo list.",
            )
            self.assertEqual(delivered_message.date_sent, more_than_scheduled_delivery_datetime)

    def test_notes_in_reminder(self) -> None:
        content = "Test message with notes"
        note = "This is a note for the reminder."
        scheduled_delivery_timestamp = int(time.time() + 86400)

        message_id = self.send_channel_message_for_hamlet(content)
        result = self.do_schedule_reminder(message_id, scheduled_delivery_timestamp, note)
        self.assert_json_success(result)
        scheduled_message = self.last_scheduled_reminder()
        self.assertEqual(
            scheduled_message.content,
            f"You requested a reminder for #**Verona>test@{message_id}**. Note:\n > {note}\n\n"
            f"@_**King Hamlet|10** [said](http://zulip.testserver/#narrow/channel/3-Verona/topic/test/near/{message_id}):\n```quote\n{content}\n```",
        )

        message_id = self.send_dm_from_hamlet_to_othello(content)
        result = self.do_schedule_reminder(message_id, scheduled_delivery_timestamp, note)
        self.assert_json_success(result)
        scheduled_message = self.last_scheduled_reminder()
        self.assertEqual(
            scheduled_message.content,
            f"You requested a reminder for the following direct message. Note:\n > {note}\n\n"
            f"@_**King Hamlet|10** [said](http://zulip.testserver/#narrow/dm/10,12/near/{message_id}):\n```quote\n{content}\n```",
        )

        # Test with no note
        message_id = self.send_dm_from_hamlet_to_othello(content)
        result = self.do_schedule_reminder(message_id, scheduled_delivery_timestamp)
        self.assert_json_success(result)
        scheduled_message = self.last_scheduled_reminder()
        self.assertEqual(
            scheduled_message.content,
            f"You requested a reminder for the following direct message.\n\n"
            f"@_**King Hamlet|10** [said](http://zulip.testserver/#narrow/dm/10,12/near/{message_id}):\n```quote\n{content}\n```",
        )

        # Test with note exceeding maximum length
        note = "long note"
        with self.settings(MAX_REMINDER_NOTE_LENGTH=len(note) - 1):
            result = self.do_schedule_reminder(message_id, scheduled_delivery_timestamp, note)
            self.assert_json_error(
                result,
                f"Maximum reminder note length: {len(note) - 1} characters",
                status_code=400,
            )

        # Test with note containing formatting characters
        note = "{123}"
        content = "{456}"
        message_id = self.send_stream_message(
            self.example_user("hamlet"), "Verona", content, topic_name="{789}"
        )
        result = self.do_schedule_reminder(message_id, scheduled_delivery_timestamp, note)
        self.assert_json_success(result)
        scheduled_message = self.last_scheduled_reminder()
        self.assertEqual(
            scheduled_message.content,
            "You requested a reminder for #**Verona>{789}@"
            + str(message_id)
            + "**. Note:\n > {123}\n\n"
            f"@_**King Hamlet|10** [said](http://zulip.testserver/#narrow/channel/3-Verona/topic/.7B789.7D/near/{message_id}):\n```quote\n{content}\n```",
        )
```

--------------------------------------------------------------------------------

---[FILE: test_report.py]---
Location: zulip-main/zerver/tests/test_report.py

```python
from zerver.lib.test_classes import ZulipTestCase


class TestReport(ZulipTestCase):
    def test_report_csp_violations(self) -> None:
        fixture_data = self.fixture_data("csp_report.json")
        with self.assertLogs(level="WARNING") as warn_logs:
            result = self.client_post(
                "/report/csp_violations", fixture_data, content_type="application/json"
            )
        self.assert_json_success(result)
        self.assertEqual(
            warn_logs.output,
            [
                "WARNING:root:CSP violation in document(''). blocked URI(''), original policy(''), violated directive(''), effective directive(''), disposition(''), referrer(''), status code(''), script sample('')"
            ],
        )
```

--------------------------------------------------------------------------------

````
