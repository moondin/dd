---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 1027
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1027 of 1290)

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

---[FILE: test_mirror_users.py]---
Location: zulip-main/zerver/tests/test_mirror_users.py
Signals: Django

```python
from typing import Any
from unittest import mock

from django.db import IntegrityError
from django.utils.timezone import now as timezone_now

from zerver.actions.message_send import create_mirror_user_if_needed
from zerver.lib.create_user import create_user_profile
from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.test_helpers import reset_email_visibility_to_everyone_in_zulip_realm
from zerver.models import UserProfile
from zerver.models.clients import get_client
from zerver.models.realms import get_realm
from zerver.models.users import get_user
from zerver.views.message_send import InvalidMirrorInputError, create_mirrored_message_users


class MirroredMessageUsersTest(ZulipTestCase):
    def test_invalid_client(self) -> None:
        user = self.example_user("hamlet")
        sender = user

        recipients: list[str] = []

        recipient_type_name = "private"
        client = get_client("banned_mirror")

        with self.assertRaises(InvalidMirrorInputError):
            create_mirrored_message_users(
                client, user, recipients, sender.email, recipient_type_name
            )

    def test_invalid_email(self) -> None:
        invalid_email = "alice AT example.com"
        recipients = [invalid_email]

        # We use an MIT user here to maximize code coverage
        user = self.mit_user("starnine")
        sender = user

        recipient_type_name = "private"

        for client_name in ["irc_mirror", "jabber_mirror"]:
            client = get_client(client_name)

            with self.assertRaises(InvalidMirrorInputError):
                create_mirrored_message_users(
                    client, user, recipients, sender.email, recipient_type_name
                )

    def test_mirror_new_recipient(self) -> None:
        """Test mirror dummy user creation for direct message recipients"""
        user = self.mit_user("starnine")
        sender = self.mit_user("sipbtest")
        new_user_email = "bob_the_new_user@mit.edu"
        new_user_realm = get_realm("zephyr")

        recipients = [user.email, new_user_email]

        recipient_type_name = "private"
        client = get_client("irc_mirror")

        mirror_sender = create_mirrored_message_users(
            client, user, recipients, sender.email, recipient_type_name
        )

        self.assertEqual(mirror_sender, sender)

        realm_users = UserProfile.objects.filter(realm=sender.realm)
        realm_emails = {user.email for user in realm_users}
        self.assertIn(user.email, realm_emails)
        self.assertIn(new_user_email, realm_emails)

        bob = get_user(new_user_email, new_user_realm)
        self.assertTrue(bob.is_mirror_dummy)

    def test_mirror_new_sender(self) -> None:
        """Test mirror dummy user creation for sender when sending to stream"""
        user = self.mit_user("starnine")
        sender_email = "new_sender@mit.edu"

        recipients = ["stream_name"]

        recipient_type_name = "stream"
        client = get_client("irc_mirror")

        mirror_sender = create_mirrored_message_users(
            client, user, recipients, sender_email, recipient_type_name
        )

        assert mirror_sender is not None
        self.assertEqual(mirror_sender.email, sender_email)
        self.assertTrue(mirror_sender.is_mirror_dummy)

    def test_irc_mirror(self) -> None:
        reset_email_visibility_to_everyone_in_zulip_realm()

        user = self.example_user("hamlet")
        sender = user

        recipients = [
            self.nonreg_email("alice"),
            "bob@irc.zulip.com",
            self.nonreg_email("cordelia"),
        ]

        recipient_type_name = "private"
        client = get_client("irc_mirror")

        mirror_sender = create_mirrored_message_users(
            client, user, recipients, sender.email, recipient_type_name
        )

        self.assertEqual(mirror_sender, sender)

        realm_users = UserProfile.objects.filter(realm=sender.realm)
        realm_emails = {user.email for user in realm_users}
        self.assertIn(self.nonreg_email("alice"), realm_emails)
        self.assertIn("bob@irc.zulip.com", realm_emails)

        bob = get_user("bob@irc.zulip.com", sender.realm)
        self.assertTrue(bob.is_mirror_dummy)

    def test_jabber_mirror(self) -> None:
        reset_email_visibility_to_everyone_in_zulip_realm()

        user = self.example_user("hamlet")
        sender = user

        recipients = [
            self.nonreg_email("alice"),
            self.nonreg_email("bob"),
            self.nonreg_email("cordelia"),
        ]

        recipient_type_name = "private"
        client = get_client("jabber_mirror")

        mirror_sender = create_mirrored_message_users(
            client, user, recipients, sender.email, recipient_type_name
        )

        self.assertEqual(mirror_sender, sender)

        realm_users = UserProfile.objects.filter(realm=sender.realm)
        realm_emails = {user.email for user in realm_users}
        self.assertIn(self.nonreg_email("alice"), realm_emails)
        self.assertIn(self.nonreg_email("bob"), realm_emails)

        bob = get_user(self.nonreg_email("bob"), sender.realm)
        self.assertTrue(bob.is_mirror_dummy)

    def test_create_mirror_user_despite_race(self) -> None:
        realm = get_realm("zulip")

        email = "fred@example.com"

        email_to_full_name = lambda email: "fred"

        def create_user(**kwargs: Any) -> UserProfile:
            self.assertEqual(kwargs["full_name"], "fred")
            self.assertEqual(kwargs["email"], email)
            self.assertEqual(kwargs["active"], False)
            self.assertEqual(kwargs["is_mirror_dummy"], True)
            # We create an actual user here to simulate a race.
            # We use the minimal, un-mocked function.
            kwargs["bot_type"] = None
            kwargs["bot_owner"] = None
            kwargs["tos_version"] = None
            kwargs["timezone"] = timezone_now()
            kwargs["default_language"] = "en"
            kwargs["email_address_visibility"] = UserProfile.EMAIL_ADDRESS_VISIBILITY_EVERYONE
            create_user_profile(**kwargs).save()
            raise IntegrityError

        with mock.patch("zerver.actions.message_send.create_user", side_effect=create_user) as m:
            mirror_fred_user = create_mirror_user_if_needed(
                realm,
                email,
                email_to_full_name,
            )

        self.assertEqual(mirror_fred_user.delivery_email, email)
        m.assert_called()
```

--------------------------------------------------------------------------------

---[FILE: test_muted_users.py]---
Location: zulip-main/zerver/tests/test_muted_users.py

```python
from datetime import datetime, timezone
from unittest import mock

import time_machine

from zerver.actions.users import do_deactivate_user
from zerver.lib.cache import cache_get, get_muting_users_cache_key
from zerver.lib.muted_users import get_mute_object, get_muting_users, get_user_mutes
from zerver.lib.test_classes import ZulipTestCase
from zerver.lib.timestamp import datetime_to_timestamp
from zerver.models import RealmAuditLog, UserMessage, UserProfile
from zerver.models.realm_audit_logs import AuditLogEventType


class MutedUsersTests(ZulipTestCase):
    # Hamlet does the muting/unmuting, and Cordelia gets muted/unmuted.
    def test_get_user_mutes(self) -> None:
        hamlet = self.example_user("hamlet")
        cordelia = self.example_user("cordelia")

        muted_users = get_user_mutes(hamlet)
        self.assertEqual(muted_users, [])
        mute_time = datetime(2021, 1, 1, tzinfo=timezone.utc)

        with time_machine.travel(mute_time, tick=False):
            url = f"/api/v1/users/me/muted_users/{cordelia.id}"
            result = self.api_post(hamlet, url)
            self.assert_json_success(result)

        muted_users = get_user_mutes(hamlet)
        self.assert_length(muted_users, 1)

        self.assertDictEqual(
            muted_users[0],
            {
                "id": cordelia.id,
                "timestamp": datetime_to_timestamp(mute_time),
            },
        )

    def test_add_muted_user_mute_self(self) -> None:
        hamlet = self.example_user("hamlet")
        self.login_user(hamlet)

        url = f"/api/v1/users/me/muted_users/{hamlet.id}"
        result = self.api_post(hamlet, url)
        self.assert_json_error(result, "Cannot mute self")

    def test_add_muted_user_mute_bot(self) -> None:
        hamlet = self.example_user("hamlet")
        self.login_user(hamlet)

        bot_info = {
            "full_name": "The Bot of Hamlet",
            "short_name": "hambot",
            "bot_type": "1",
        }
        result = self.client_post("/json/bots", bot_info)
        muted_id = self.assert_json_success(result)["user_id"]

        url = f"/api/v1/users/me/muted_users/{muted_id}"
        result = self.api_post(hamlet, url)
        self.assert_json_success(result)

        url = f"/api/v1/users/me/muted_users/{muted_id}"
        result = self.api_delete(hamlet, url)
        self.assert_json_success(result)

    def test_add_muted_user_mute_twice(self) -> None:
        hamlet = self.example_user("hamlet")
        self.login_user(hamlet)
        cordelia = self.example_user("cordelia")

        url = f"/api/v1/users/me/muted_users/{cordelia.id}"
        result = self.api_post(hamlet, url)
        self.assert_json_success(result)

        url = f"/api/v1/users/me/muted_users/{cordelia.id}"
        result = self.api_post(hamlet, url)
        self.assert_json_error(result, "User already muted")

    def _test_add_muted_user_valid_data(self, deactivate_user: bool = False) -> None:
        hamlet = self.example_user("hamlet")
        self.login_user(hamlet)
        cordelia = self.example_user("cordelia")
        mute_time = datetime(2021, 1, 1, tzinfo=timezone.utc)

        if deactivate_user:
            do_deactivate_user(cordelia, acting_user=None)

        with time_machine.travel(mute_time, tick=False):
            url = f"/api/v1/users/me/muted_users/{cordelia.id}"
            result = self.api_post(hamlet, url)
            self.assert_json_success(result)

        self.assertIn(
            {
                "id": cordelia.id,
                "timestamp": datetime_to_timestamp(mute_time),
            },
            get_user_mutes(hamlet),
        )
        self.assertIsNotNone(get_mute_object(hamlet, cordelia))

        audit_log_entries = list(
            RealmAuditLog.objects.filter(acting_user=hamlet, modified_user=hamlet).values_list(
                "event_type", "event_time", "extra_data"
            )
        )
        self.assert_length(audit_log_entries, 1)
        audit_log_entry = audit_log_entries[0]
        self.assertEqual(
            audit_log_entry,
            (
                AuditLogEventType.USER_MUTED,
                mute_time,
                {"muted_user_id": cordelia.id},
            ),
        )

    def test_add_muted_user_valid_data(self) -> None:
        self._test_add_muted_user_valid_data()

    def test_add_muted_user_deactivated_user(self) -> None:
        self._test_add_muted_user_valid_data(deactivate_user=True)

    def test_remove_muted_user_unmute_before_muting(self) -> None:
        hamlet = self.example_user("hamlet")
        self.login_user(hamlet)
        cordelia = self.example_user("cordelia")

        url = f"/api/v1/users/me/muted_users/{cordelia.id}"
        result = self.api_delete(hamlet, url)
        self.assert_json_error(result, "User is not muted")

    def _test_remove_muted_user_valid_data(self, deactivate_user: bool = False) -> None:
        hamlet = self.example_user("hamlet")
        self.login_user(hamlet)
        cordelia = self.example_user("cordelia")
        mute_time = datetime(2021, 1, 1, tzinfo=timezone.utc)

        if deactivate_user:
            do_deactivate_user(cordelia, acting_user=None)

        with time_machine.travel(mute_time, tick=False):
            url = f"/api/v1/users/me/muted_users/{cordelia.id}"
            result = self.api_post(hamlet, url)
            self.assert_json_success(result)

        with time_machine.travel(mute_time, tick=False):
            # To test that `RealmAuditLog` entry has correct `event_time`.
            url = f"/api/v1/users/me/muted_users/{cordelia.id}"
            result = self.api_delete(hamlet, url)

        self.assert_json_success(result)
        self.assertNotIn(
            {
                "id": cordelia.id,
                "timestamp": datetime_to_timestamp(mute_time),
            },
            get_user_mutes(hamlet),
        )
        self.assertIsNone(get_mute_object(hamlet, cordelia))

        audit_log_entries = list(
            RealmAuditLog.objects.filter(acting_user=hamlet, modified_user=hamlet)
            .values_list("event_type", "event_time", "extra_data")
            .order_by("id")
        )
        self.assert_length(audit_log_entries, 2)
        audit_log_entry = audit_log_entries[1]
        self.assertEqual(
            audit_log_entry,
            (
                AuditLogEventType.USER_UNMUTED,
                mute_time,
                {"unmuted_user_id": cordelia.id},
            ),
        )

    def test_remove_muted_user_valid_data(self) -> None:
        self._test_remove_muted_user_valid_data()

    def test_remove_muted_user_deactivated_user(self) -> None:
        self._test_remove_muted_user_valid_data(deactivate_user=True)

    def test_get_muting_users(self) -> None:
        hamlet = self.example_user("hamlet")
        self.login_user(hamlet)
        cordelia = self.example_user("cordelia")

        self.assertEqual(None, cache_get(get_muting_users_cache_key(cordelia.id)))
        self.assertEqual(set(), get_muting_users(cordelia.id))
        self.assertEqual(set(), cache_get(get_muting_users_cache_key(cordelia.id))[0])

        url = f"/api/v1/users/me/muted_users/{cordelia.id}"
        result = self.api_post(hamlet, url)
        self.assert_json_success(result)
        self.assertEqual(None, cache_get(get_muting_users_cache_key(cordelia.id)))
        self.assertEqual({hamlet.id}, get_muting_users(cordelia.id))
        self.assertEqual({hamlet.id}, cache_get(get_muting_users_cache_key(cordelia.id))[0])

        url = f"/api/v1/users/me/muted_users/{cordelia.id}"
        result = self.api_delete(hamlet, url)
        self.assert_json_success(result)
        self.assertEqual(None, cache_get(get_muting_users_cache_key(cordelia.id)))
        self.assertEqual(set(), get_muting_users(cordelia.id))
        self.assertEqual(set(), cache_get(get_muting_users_cache_key(cordelia.id))[0])

    def assert_usermessage_read_flag(self, user: UserProfile, message: int, flag: bool) -> None:
        usermessage = UserMessage.objects.get(
            user_profile=user,
            message=message,
        )
        self.assertTrue(usermessage.flags.read == flag)

    def test_new_messages_from_muted_user_marked_as_read(self) -> None:
        hamlet = self.example_user("hamlet")
        self.login_user(hamlet)
        cordelia = self.example_user("cordelia")
        othello = self.example_user("othello")

        self.make_stream("general")
        self.subscribe(hamlet, "general")
        self.subscribe(cordelia, "general")
        self.subscribe(othello, "general")

        # Hamlet mutes Cordelia.
        url = f"/api/v1/users/me/muted_users/{cordelia.id}"
        result = self.api_post(hamlet, url)
        self.assert_json_success(result)

        # Have Cordelia send messages to Hamlet and Othello.
        stream_message = self.send_stream_message(cordelia, "general", "Spam in stream")
        group_direct_message = self.send_group_direct_message(
            cordelia, [hamlet, othello], "Spam in direct message group"
        )
        pm_to_hamlet = self.send_personal_message(cordelia, hamlet, "Spam in direct message")
        pm_to_othello = self.send_personal_message(cordelia, othello, "Spam in direct message")

        # These should be marked as read for Hamlet, since he has muted Cordelia.
        self.assert_usermessage_read_flag(hamlet, stream_message, True)
        self.assert_usermessage_read_flag(hamlet, group_direct_message, True)
        self.assert_usermessage_read_flag(hamlet, pm_to_hamlet, True)

        # These messages should be unreads for Othello, since he hasn't muted Cordelia.
        self.assert_usermessage_read_flag(othello, stream_message, False)
        self.assert_usermessage_read_flag(othello, group_direct_message, False)
        self.assert_usermessage_read_flag(othello, pm_to_othello, False)

    def test_existing_messages_from_muted_user_marked_as_read(self) -> None:
        hamlet = self.example_user("hamlet")
        self.login_user(hamlet)
        cordelia = self.example_user("cordelia")
        othello = self.example_user("othello")

        self.make_stream("general")
        self.subscribe(hamlet, "general")
        self.subscribe(cordelia, "general")
        self.subscribe(othello, "general")

        # Have Cordelia send messages to Hamlet and Othello.
        stream_message = self.send_stream_message(cordelia, "general", "Spam in stream")
        group_direct_message = self.send_group_direct_message(
            cordelia, [hamlet, othello], "Spam in direct message group"
        )
        pm_to_hamlet = self.send_personal_message(cordelia, hamlet, "Spam in direct message")
        pm_to_othello = self.send_personal_message(cordelia, othello, "Spam in direct message")

        # These messages are unreads for both Hamlet and Othello right now.
        self.assert_usermessage_read_flag(hamlet, stream_message, False)
        self.assert_usermessage_read_flag(hamlet, group_direct_message, False)
        self.assert_usermessage_read_flag(hamlet, pm_to_hamlet, False)

        self.assert_usermessage_read_flag(othello, stream_message, False)
        self.assert_usermessage_read_flag(othello, group_direct_message, False)
        self.assert_usermessage_read_flag(othello, pm_to_othello, False)

        # Hamlet mutes Cordelia.
        url = f"/api/v1/users/me/muted_users/{cordelia.id}"
        result = self.api_post(hamlet, url)
        self.assert_json_success(result)

        # The messages sent earlier should be marked as read for Hamlet.
        self.assert_usermessage_read_flag(hamlet, stream_message, True)
        self.assert_usermessage_read_flag(hamlet, group_direct_message, True)
        self.assert_usermessage_read_flag(hamlet, pm_to_hamlet, True)

        # These messages are still unreads for Othello, since he did not mute Cordelia.
        self.assert_usermessage_read_flag(othello, stream_message, False)
        self.assert_usermessage_read_flag(othello, group_direct_message, False)
        self.assert_usermessage_read_flag(othello, pm_to_othello, False)

    def test_muted_message_send_notifications_not_enqueued(self) -> None:
        hamlet = self.example_user("hamlet")
        self.login_user(hamlet)
        cordelia = self.example_user("cordelia")

        # No muting involved. Notification about to be enqueued for Hamlet.
        with mock.patch("zerver.tornado.event_queue.maybe_enqueue_notifications") as m:
            self.send_personal_message(cordelia, hamlet)
            m.assert_called_once()

        # Hamlet mutes Cordelia.
        url = f"/api/v1/users/me/muted_users/{cordelia.id}"
        result = self.api_post(hamlet, url)
        self.assert_json_success(result)

        # Cordelia has been muted. Notification will not be enqueued for Hamlet.
        with mock.patch("zerver.tornado.event_queue.maybe_enqueue_notifications") as m:
            self.send_personal_message(cordelia, hamlet)
            m.assert_not_called()

    def test_muted_message_edit_notifications_not_enqueued(self) -> None:
        hamlet = self.example_user("hamlet")
        self.login_user(hamlet)
        cordelia = self.example_user("cordelia")
        self.make_stream("general")
        self.subscribe(hamlet, "general")

        def send_stream_message() -> int:
            # For testing simplicity we allow the somewhat
            # contrived situation that cordelia can post
            # to the general stream, even though she is not
            # subscribed. This prevents some noise when we
            # look at the mocked calls to maybe_enqueue_notifications.
            message_id = self.send_stream_message(
                cordelia, "general", allow_unsubscribed_sender=True
            )
            return message_id

        # No muting. Only Hamlet is subscribed to #general, so only he can potentially receive
        # notifications.
        with mock.patch("zerver.tornado.event_queue.maybe_enqueue_notifications") as m:
            message_id = send_stream_message()
            # Message does not mention Hamlet, so no notification.
            m.assert_not_called()

        self.login("cordelia")
        with mock.patch("zerver.tornado.event_queue.maybe_enqueue_notifications") as m:
            with self.captureOnCommitCallbacks(execute=True):
                result = self.client_patch(
                    "/json/messages/" + str(message_id),
                    dict(
                        content="@**King Hamlet**",
                    ),
                )
            self.assert_json_success(result)
            m.assert_called_once()
            # `maybe_enqueue_notifications` was called for Hamlet after message edit mentioned him.
            self.assertEqual(m.call_args_list[0][1]["user_notifications_data"].user_id, hamlet.id)

        # Hamlet mutes Cordelia.
        self.login("hamlet")
        url = f"/api/v1/users/me/muted_users/{cordelia.id}"
        result = self.api_post(hamlet, url)
        self.assert_json_success(result)

        with mock.patch("zerver.tornado.event_queue.maybe_enqueue_notifications") as m:
            message_id = send_stream_message()
            m.assert_not_called()

        self.login("cordelia")
        with mock.patch("zerver.tornado.event_queue.maybe_enqueue_notifications") as m:
            result = self.client_patch(
                "/json/messages/" + str(message_id),
                dict(
                    content="@**King Hamlet**",
                ),
            )
            self.assert_json_success(result)
            # `maybe_enqueue_notifications` wasn't called for Hamlet after message edit which mentioned him,
            # because the sender (Cordelia) was muted.
            m.assert_not_called()

    def test_muting_and_unmuting_restricted_users(self) -> None:
        # NOTE: It is a largely unintended side effect of how we use
        # the access_user_by_id API that limited guests can't mute
        # inaccessible users. These tests verify the expected
        # behavior.

        self.set_up_db_for_testing_user_access()
        polonius = self.example_user("polonius")
        cordelia = self.example_user("cordelia")
        iago = self.example_user("iago")

        url = f"/api/v1/users/me/muted_users/{cordelia.id}"
        result = self.api_post(polonius, url)
        self.assert_json_error(result, "Insufficient permission")

        url = f"/api/v1/users/me/muted_users/{iago.id}"
        result = self.api_post(polonius, url)
        self.assert_json_success(result)
        muted_users = get_user_mutes(polonius)
        self.assert_length(muted_users, 1)

        url = f"/api/v1/users/me/muted_users/{cordelia.id}"
        result = self.api_delete(polonius, url)
        self.assert_json_error(result, "Insufficient permission")

        url = f"/api/v1/users/me/muted_users/{iago.id}"
        result = self.api_delete(polonius, url)
        self.assert_json_success(result)
        muted_users = get_user_mutes(polonius)
        self.assert_length(muted_users, 0)
```

--------------------------------------------------------------------------------

---[FILE: test_navigation_views.py]---
Location: zulip-main/zerver/tests/test_navigation_views.py

```python
from zerver.actions.navigation_views import do_add_navigation_view
from zerver.lib.navigation_views import get_navigation_views_for_user
from zerver.lib.test_classes import ZulipTestCase
from zerver.models import UserProfile


class NavigationViewTests(ZulipTestCase):
    def create_example_navigation_view(
        self, user: UserProfile, fragment: str, is_pinned: bool, name: str | None = None
    ) -> str:
        do_add_navigation_view(
            user,
            fragment,
            is_pinned,
            name,
        )
        return fragment

    def test_get_navigation_views(self) -> None:
        """Tests fetching navigation views."""
        user = self.example_user("hamlet")
        self.login_user(user)

        result = self.client_get("/json/navigation_views")
        response_dict = self.assert_json_success(result)
        self.assert_length(response_dict["navigation_views"], 0)

        # Test adding a built-in view and fetching it
        self.create_example_navigation_view(user, fragment="inbox", is_pinned=True)
        result = self.client_get("/json/navigation_views")
        response_dict = self.assert_json_success(result)
        self.assert_length(response_dict["navigation_views"], 1)
        self.assertEqual(response_dict["navigation_views"][0]["fragment"], "inbox")
        self.assertEqual(response_dict["navigation_views"][0]["is_pinned"], True)

    def test_add_navigation_view(self) -> None:
        """Tests creation of navigation views."""
        user = self.example_user("hamlet")
        self.login_user(user)

        # Test successful creation
        params = {
            "fragment": "recent",
            "is_pinned": "true",
        }
        result = self.client_post("/json/navigation_views", params)
        self.assert_json_success(result)

        # Test name value for builtin views
        params["name"] = "foo"
        result = self.client_post("/json/navigation_views", params)
        self.assert_json_error(result, "Built-in views cannot have a custom name.")

        # Test empty fragment
        params["fragment"] = ""
        result = self.client_post("/json/navigation_views", params)
        self.assert_json_error(result, "fragment cannot be blank")

        # Test no name value for custom views
        params = {
            "fragment": "narrow/view",
            "is_pinned": "true",
        }
        result = self.client_post("/json/navigation_views", params)
        self.assert_json_error(result, "Custom views must have a valid name.")

        # Test custom view with name value
        params["name"] = "foo"
        result = self.client_post("/json/navigation_views", params)
        self.assert_json_success(result)

        # Test duplicate view
        new_params = {
            "fragment": "recent",
            "is_pinned": "true",
        }
        result = self.client_post("/json/navigation_views", new_params)
        self.assert_json_error(result, "Navigation view already exists.")

        # Test duplicate view by name
        new_params = {
            "fragment": "narorw/is/attachment",
            "is_pinned": "true",
            "name": "foo",
        }
        result = self.client_post("/json/navigation_views", new_params)
        self.assert_json_error(result, "Navigation view already exists.")

    def test_update_navigation_view(self) -> None:
        """Tests updating navigation views."""
        user = self.example_user("hamlet")
        self.login_user(user)
        self.create_example_navigation_view(user, fragment="inbox", is_pinned=True)

        # Test successful update
        params = {
            "is_pinned": "false",
        }
        result = self.client_patch("/json/navigation_views/inbox", params)
        self.assert_json_success(result)

        navigation_views = get_navigation_views_for_user(user)
        self.assertEqual(navigation_views[0]["is_pinned"], False)

        params = {
            "is_pinned": "true",
            "name": "Inbox View",
        }
        result = self.client_patch("/json/navigation_views/inbox", params)
        self.assert_json_error(result, "Built-in views cannot have a custom name.")

        # Test with the name for custom views
        self.create_example_navigation_view(
            user, fragment="narrow/is/alerted", is_pinned=True, name="Alert Words"
        )
        params = {
            "is_pinned": "false",
            "name": "Watched Phrases",
        }
        result = self.client_patch("/json/navigation_views/narrow/is/alerted", params)
        self.assert_json_success(result)

        self.create_example_navigation_view(
            user, fragment="narrow/is/attachment", is_pinned=True, name="Attachments"
        )
        params = {
            "is_pinned": "false",
            "name": "Watched Phrases",
        }
        result = self.client_patch("/json/navigation_views/narrow/is/attachment", params)
        self.assert_json_error(result, "Navigation view already exists.")

        params = {
            "is_pinned": "false",
            "name": "New view",
        }
        # Test nonexistent view
        result = self.client_patch("/json/navigation_views/nonexistent", params)
        self.assert_json_error(result, "Navigation view does not exist.", status_code=404)

    def test_remove_navigation_view(self) -> None:
        """Tests removing navigation views."""
        user = self.example_user("hamlet")
        self.login_user(user)
        self.create_example_navigation_view(user, fragment="recent", is_pinned=True)

        # Test successful removal
        result = self.client_delete("/json/navigation_views/recent")
        self.assert_json_success(result)

        navigation_views = get_navigation_views_for_user(user)
        self.assert_length(navigation_views, 0)

        # Test nonexistent view
        result = self.client_delete("/json/navigation_views/nonexistent")
        self.assert_json_error(result, "Navigation view does not exist.", status_code=404)

    def test_navigation_view_permissions(self) -> None:
        """Tests permissions for navigation view operations."""
        hamlet = self.example_user("hamlet")
        othello = self.example_user("othello")
        self.login_user(othello)

        self.create_example_navigation_view(hamlet, fragment="recent", is_pinned=True)

        params = {
            "is_pinned": "false",
        }
        result = self.client_patch("/json/navigation_views/recent", params)
        self.assert_json_error(result, "Navigation view does not exist.", status_code=404)
```

--------------------------------------------------------------------------------

````
