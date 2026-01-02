---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1276
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1276 of 1290)

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

---[FILE: push_notifications.py]---
Location: zulip-main/zilencer/lib/push_notifications.py
Signals: Django

```python
import asyncio
import logging
from collections.abc import Iterable
from dataclasses import asdict, dataclass

from aioapns import NotificationRequest
from django.utils.timezone import now as timezone_now
from firebase_admin import exceptions as firebase_exceptions
from firebase_admin import messaging as firebase_messaging
from firebase_admin.messaging import UnregisteredError as FCMUnregisteredError

from zerver.lib.push_notifications import (
    APNsPushRequest,
    FCMPushRequest,
    SendNotificationResponseData,
    fcm_app,
    get_apns_context,
    get_info_from_apns_result,
)
from zerver.models.realms import Realm
from zilencer.models import RemotePushDevice, RemoteRealm

logger = logging.getLogger(__name__)


@dataclass
class SentPushNotificationResult:
    successfully_sent_count: int
    delete_device_ids: list[int]


def send_e2ee_push_notification_apple(
    apns_requests: list[NotificationRequest],
    apns_remote_push_devices: list[RemotePushDevice],
) -> SentPushNotificationResult:
    import aioapns

    successfully_sent_count = 0
    delete_device_ids: list[int] = []
    apns_context = get_apns_context()

    if apns_context is None:
        logger.error(
            "APNs: Dropping push notifications since "
            "neither APNS_TOKEN_KEY_FILE nor APNS_CERT_FILE is set."
        )
        return SentPushNotificationResult(
            successfully_sent_count=successfully_sent_count,
            delete_device_ids=delete_device_ids,
        )

    async def send_all_notifications() -> Iterable[
        tuple[RemotePushDevice, aioapns.common.NotificationResult | BaseException]
    ]:
        results = await asyncio.gather(
            *(apns_context.apns.send_notification(request) for request in apns_requests),
            return_exceptions=True,
        )
        return zip(apns_remote_push_devices, results, strict=False)

    results = apns_context.loop.run_until_complete(send_all_notifications())

    for remote_push_device, result in results:
        log_context = f"to (push_account_id={remote_push_device.push_account_id}, device={remote_push_device.token})"
        result_info = get_info_from_apns_result(
            result,
            remote_push_device,
            log_context,
        )

        if result_info.successfully_sent:
            successfully_sent_count += 1
        elif result_info.delete_device_id is not None:
            remote_push_device.expired_time = timezone_now()
            remote_push_device.save(update_fields=["expired_time"])
            delete_device_ids.append(result_info.delete_device_id)

    return SentPushNotificationResult(
        successfully_sent_count=successfully_sent_count,
        delete_device_ids=delete_device_ids,
    )


def send_e2ee_push_notification_android(
    fcm_requests: list[firebase_messaging.Message],
    fcm_remote_push_devices: list[RemotePushDevice],
) -> SentPushNotificationResult:
    successfully_sent_count = 0
    delete_device_ids: list[int] = []

    if fcm_app is None:
        logger.error("FCM: Dropping push notifications since ANDROID_FCM_CREDENTIALS_PATH is unset")
        return SentPushNotificationResult(
            successfully_sent_count=successfully_sent_count,
            delete_device_ids=delete_device_ids,
        )

    try:
        batch_response = firebase_messaging.send_each(fcm_requests, app=fcm_app)
    except firebase_exceptions.FirebaseError:
        logger.warning("Error while pushing to FCM", exc_info=True)
        return SentPushNotificationResult(
            successfully_sent_count=successfully_sent_count,
            delete_device_ids=delete_device_ids,
        )

    for idx, response in enumerate(batch_response.responses):
        # We enumerate to have idx to track which token the response
        # corresponds to. send_each() preserves the order of the messages,
        # so this works.

        remote_push_device = fcm_remote_push_devices[idx]
        token = remote_push_device.token
        push_account_id = remote_push_device.push_account_id
        if response.success:
            successfully_sent_count += 1
            logger.info(
                "FCM: Sent message with ID: %s to (push_account_id=%s, device=%s)",
                response.message_id,
                push_account_id,
                token,
            )
        else:
            error = response.exception
            if isinstance(error, FCMUnregisteredError):
                remote_push_device.expired_time = timezone_now()
                remote_push_device.save(update_fields=["expired_time"])
                delete_device_ids.append(remote_push_device.device_id)

                logger.info("FCM: Removing %s due to %s", token, error.code)
            else:
                logger.warning(
                    "FCM: Delivery failed for (push_account_id=%s, device=%s): %s:%s",
                    push_account_id,
                    token,
                    error.__class__,
                    error,
                )

    return SentPushNotificationResult(
        successfully_sent_count=successfully_sent_count,
        delete_device_ids=delete_device_ids,
    )


def send_e2ee_push_notifications(
    push_requests: list[APNsPushRequest | FCMPushRequest],
    *,
    realm: Realm | None = None,
    remote_realm: RemoteRealm | None = None,
) -> SendNotificationResponseData:
    assert (realm is None) ^ (remote_realm is None)

    import aioapns

    device_ids = {push_request.device_id for push_request in push_requests}
    remote_push_devices = RemotePushDevice.objects.filter(
        device_id__in=device_ids, expired_time__isnull=True, realm=realm, remote_realm=remote_realm
    )
    device_id_to_remote_push_device = {
        remote_push_device.device_id: remote_push_device
        for remote_push_device in remote_push_devices
    }
    unexpired_remote_push_device_ids = set(device_id_to_remote_push_device.keys())

    # Device IDs which should be deleted on server.
    # Either the device ID is invalid or the token
    # associated has been marked invalid/expired by APNs/FCM.
    delete_device_ids = list(
        filter(lambda device_id: device_id not in unexpired_remote_push_device_ids, device_ids)
    )

    apns_requests = []
    apns_remote_push_devices: list[RemotePushDevice] = []

    fcm_requests = []
    fcm_remote_push_devices: list[RemotePushDevice] = []

    for push_request in push_requests:
        device_id = push_request.device_id
        if device_id not in unexpired_remote_push_device_ids:
            continue

        remote_push_device = device_id_to_remote_push_device[device_id]
        if remote_push_device.token_kind == RemotePushDevice.TokenKind.APNS:
            assert isinstance(push_request, APNsPushRequest)
            apns_requests.append(
                aioapns.NotificationRequest(
                    apns_topic=remote_push_device.ios_app_id,
                    device_token=remote_push_device.token,
                    message=asdict(push_request.payload),
                    priority=push_request.http_headers.apns_priority,
                    push_type=push_request.http_headers.apns_push_type,
                )
            )
            apns_remote_push_devices.append(remote_push_device)
        else:
            assert isinstance(push_request, FCMPushRequest)
            fcm_payload = dict(
                # FCM only allows string values, so we stringify push_account_id.
                push_account_id=str(push_request.payload.push_account_id),
                encrypted_data=push_request.payload.encrypted_data,
            )
            fcm_requests.append(
                firebase_messaging.Message(
                    data=fcm_payload,
                    token=remote_push_device.token,
                    android=firebase_messaging.AndroidConfig(priority=push_request.fcm_priority),
                )
            )
            fcm_remote_push_devices.append(remote_push_device)

    apple_successfully_sent_count = 0
    if len(apns_requests) > 0:
        sent_push_notification_result = send_e2ee_push_notification_apple(
            apns_requests,
            apns_remote_push_devices,
        )
        apple_successfully_sent_count = sent_push_notification_result.successfully_sent_count
        delete_device_ids.extend(sent_push_notification_result.delete_device_ids)

    android_successfully_sent_count = 0
    if len(fcm_requests) > 0:
        sent_push_notification_result = send_e2ee_push_notification_android(
            fcm_requests,
            fcm_remote_push_devices,
        )
        android_successfully_sent_count = sent_push_notification_result.successfully_sent_count
        delete_device_ids.extend(sent_push_notification_result.delete_device_ids)

    return {
        "apple_successfully_sent_count": apple_successfully_sent_count,
        "android_successfully_sent_count": android_successfully_sent_count,
        "delete_device_ids": delete_device_ids,
    }
```

--------------------------------------------------------------------------------

---[FILE: remote_counts.py]---
Location: zulip-main/zilencer/lib/remote_counts.py
Signals: Django

```python
from datetime import timedelta

from django.db import connection
from django.utils.timezone import now as timezone_now
from psycopg2.sql import SQL, Literal

from zilencer.models import RemoteInstallationCount, RemoteZulipServer


class MissingDataError(Exception):
    pass


def compute_max_monthly_messages(remote_server: RemoteZulipServer) -> int:
    # Calculate the maximum amount of messages that the server had within a month.
    # out of the last 3 months.

    # We would like to just check whether we have current data for the
    # actual property we care about
    # ('messages_sent:message_type:day'). But because our analytics
    # tables have implicit zeros, that can't distinguish missing data
    # from days with no messages. So we filter on `active_users_audit`
    # instead, which will never be zero for an initialized server.
    if not RemoteInstallationCount.objects.filter(
        server=remote_server,
        property="active_users_audit:is_bot:day",
        end_time__lte=timezone_now() - timedelta(days=3),
    ).exists():
        raise MissingDataError

    query = SQL(
        """
    WITH server_message_stats_daily AS -- Up to 4 rows per day for different subgroups
    (
        SELECT
            r.end_time,
            r.value AS message_count
        FROM
            zilencer_remoteinstallationcount r
        WHERE
            r.property = 'messages_sent:message_type:day'
            AND end_time >= CURRENT_TIMESTAMP(0) - INTERVAL '90 days'
            AND r.server_id = {server_id}
    ),
    server_message_stats_monthly AS (
        SELECT
            CASE
                WHEN current_timestamp(0) - end_time <= INTERVAL '30 days' THEN 0
                WHEN current_timestamp(0) - end_time <= INTERVAL '60 days' THEN 1
                WHEN current_timestamp(0) - end_time <= INTERVAL '90 days' THEN 2
            END AS billing_month,
            SUM(message_count) AS message_count
        FROM
            server_message_stats_daily
        GROUP BY
            1
    ),
    server_max_monthly_messages AS (
        SELECT
            MAX(message_count) AS message_count
        FROM
            server_message_stats_monthly
        WHERE
            billing_month IS NOT NULL
    )
    SELECT
        -- Return zeros, rather than nulls,
        -- for reporting servers with zero messages.
        COALESCE(server_max_monthly_messages.message_count, 0) AS message_count
    FROM
        server_max_monthly_messages;
        """
    ).format(server_id=Literal(remote_server.id))
    with connection.cursor() as cursor:
        cursor.execute(query)
        result = cursor.fetchone()[0]
    return int(result)
```

--------------------------------------------------------------------------------

---[FILE: add_mock_conversation.py]---
Location: zulip-main/zilencer/management/commands/add_mock_conversation.py

```python
from typing import Any

from typing_extensions import override

from zerver.actions.create_user import do_create_user
from zerver.actions.message_send import do_send_messages, internal_prep_stream_message
from zerver.actions.reactions import do_add_reaction
from zerver.actions.streams import bulk_add_subscriptions
from zerver.actions.user_settings import do_change_avatar_fields
from zerver.lib.emoji import get_emoji_data
from zerver.lib.management import ZulipBaseCommand
from zerver.lib.streams import ensure_stream
from zerver.lib.upload import upload_avatar_image
from zerver.models import Message, UserProfile
from zerver.models.realms import get_realm


class Command(ZulipBaseCommand):
    help = """Add a mock conversation to the development environment.

Usage: ./manage.py add_mock_conversation

After running the script:

From browser (ideally on high resolution screen):
* Refresh to get the rendered tweet
* Check that the whale emoji reaction comes before the thumbs_up emoji reaction
* Remove the blue box (it's a box shadow on .selected_message .messagebox-content;
  inspecting the selected element will find it fairly quickly)
* Change the color of the stream to #a6c7e5
* Shrink screen till the mypy link only just fits
* Take screenshot that does not include the timestamps or bottom edge

From image editing program:
* Remove mute (and edit) icons from recipient bar
"""

    def set_avatar(self, user: UserProfile, filename: str) -> None:
        with open(filename, "rb") as f:
            upload_avatar_image(f, user)
        do_change_avatar_fields(user, UserProfile.AVATAR_FROM_USER, acting_user=None)

    def add_message_formatting_conversation(self) -> None:
        realm = get_realm("zulip")
        stream = ensure_stream(realm, "zulip features", acting_user=None)

        UserProfile.objects.filter(email__contains="stage").delete()
        starr = do_create_user(
            "1@stage.example.com", "password", realm, "Ada Starr", acting_user=None
        )
        self.set_avatar(starr, "static/images/characters/starr.png")
        fisher = do_create_user(
            "2@stage.example.com", "password", realm, "Bel Fisher", acting_user=None
        )
        self.set_avatar(fisher, "static/images/characters/fisher.png")
        twitter_bot = do_create_user(
            "3@stage.example.com",
            "password",
            realm,
            "Twitter Bot",
            bot_type=UserProfile.DEFAULT_BOT,
            acting_user=None,
        )
        self.set_avatar(twitter_bot, "static/images/characters/coral.png")

        bulk_add_subscriptions(
            realm, [stream], list(UserProfile.objects.filter(realm=realm)), acting_user=None
        )

        staged_messages: list[dict[str, Any]] = [
            {
                "sender": starr,
                "content": "Hey @**Bel Fisher**, check out Zulip's Markdown formatting! "
                "You can have:\n* bulleted lists\n  * with sub-bullets too\n"
                "* **bold**, *italic*, and ~~strikethrough~~ text\n"
                "* LaTeX for mathematical formulas, both inline -- $$O(n^2)$$ -- and displayed:\n"
                "```math\n\\int_a^b f(t)\\, dt=F(b)-F(a)\n```",
            },
            {
                "sender": fisher,
                "content": "My favorite is the syntax highlighting for code blocks\n"
                "```python\ndef fib(n: int) -> int:\n    # returns the n-th Fibonacci number\n"
                "    return fib(n-1) + fib(n-2)\n```",
            },
            {
                "sender": starr,
                "content": "I think you forgot your base case there, Bel :laughing:\n"
                "```quote\n```python\ndef fib(n: int) -> int:\n    # returns the n-th Fibonacci number\n"
                "    return fib(n-1) + fib(n-2)\n```\n```",
            },
            {
                "sender": fisher,
                "content": "I'm also a big fan of inline link, tweet, video, and image previews. "
                "Check out this picture of seahorse[](/static/images/characters/seahorse.png)!",
            },
            {
                "sender": starr,
                "content": "I just set up a custom linkifier, "
                "so `#1234` becomes [#1234](github.com/zulip/zulip/1234), "
                "a link to the corresponding GitHub issue.",
            },
            {
                "sender": twitter_bot,
                "content": "https://twitter.com/gvanrossum/status/786661035637772288",
            },
            {
                "sender": fisher,
                "content": "Oops, the Twitter bot I set up shouldn't be posting here. Let me go fix that.",
            },
        ]

        messages = [
            internal_prep_stream_message(
                message["sender"],
                stream,
                "message formatting",
                message["content"],
            )
            for message in staged_messages
        ]

        message_ids = [
            sent_message_result.message_id for sent_message_result in do_send_messages(messages)
        ]

        preview_message = Message.objects.get(
            id__in=message_ids, content__icontains="image previews"
        )
        whale = get_emoji_data(realm.id, "whale")
        do_add_reaction(starr, preview_message, "whale", whale.emoji_code, whale.reaction_type)

        twitter_message = Message.objects.get(id__in=message_ids, content__icontains="gvanrossum")
        # Setting up a twitter integration in dev is a decent amount of work. If you need
        # to update this tweet, either copy the format below, or send the link to the tweet
        # to chat.zulip.org and ask an admin of that server to get you the rendered_content.
        twitter_message.rendered_content = (
            "<p><a>https://twitter.com/gvanrossum/status/786661035637772288</a></p>\n"
            '<div class="inline-preview-twitter"><div class="twitter-tweet">'
            '<a><img class="twitter-avatar" '
            'src="https://pbs.twimg.com/profile_images/424495004/GuidoAvatar_bigger.jpg"></a>'
            "<p>Great blog post about Zulip's use of mypy: "
            "<a>http://blog.zulip.org/2016/10/13/static-types-in-python-oh-mypy/</a></p>"
            "<span>- Guido van Rossum (@gvanrossum)</span></div></div>"
        )
        twitter_message.save(update_fields=["rendered_content"])

        # Put a short pause between the whale reaction and this, so that the
        # thumbs_up shows up second
        thumbs_up = get_emoji_data(realm.id, "thumbs_up")
        do_add_reaction(
            starr, preview_message, "thumbs_up", thumbs_up.emoji_code, thumbs_up.reaction_type
        )

    @override
    def handle(self, *args: Any, **options: str) -> None:
        self.add_message_formatting_conversation()
```

--------------------------------------------------------------------------------

---[FILE: calculate_first_visible_message_id.py]---
Location: zulip-main/zilencer/management/commands/calculate_first_visible_message_id.py
Signals: Django

```python
from collections.abc import Iterable
from typing import Any

from django.core.management.base import CommandParser
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand, abort_unless_locked
from zerver.lib.message import maybe_update_first_visible_message_id
from zerver.models import Realm


class Command(ZulipBaseCommand):
    help = """Calculate the value of first visible message ID and store it in cache"""

    @override
    def add_arguments(self, parser: CommandParser) -> None:
        self.add_realm_args(parser)
        parser.add_argument(
            "--lookback-hours",
            type=int,
            help="Period a bit larger than that of the cron job that runs "
            "this command so that the lookback periods are sure to overlap.",
            required=True,
        )

    @override
    @abort_unless_locked
    def handle(self, *args: Any, **options: Any) -> None:
        target_realm = self.get_realm(options)

        if target_realm is None:
            realms: Iterable[Realm] = Realm.objects.all()
        else:
            realms = [target_realm]

        for realm in realms:
            maybe_update_first_visible_message_id(realm, options["lookback_hours"])
```

--------------------------------------------------------------------------------

---[FILE: compare_messages.py]---
Location: zulip-main/zilencer/management/commands/compare_messages.py
Signals: Django

```python
from typing import Any

import orjson
from django.core.management.base import CommandParser
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    help = """
    Compare rendered messages from files.
    Usage: ./manage.py compare_messages <dump1> <dump2>
    """

    @override
    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument("dump1", help="First file to compare")
        parser.add_argument("dump2", help="Second file to compare")

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        total_count = 0
        changed_count = 0
        with open(options["dump1"]) as dump1, open(options["dump2"]) as dump2:
            for line1, line2 in zip(dump1, dump2, strict=False):
                m1 = orjson.loads(line1)
                m2 = orjson.loads(line2)
                total_count += 1
                if m1["id"] != m2["id"]:
                    self.stderr.write("Inconsistent messages dump")
                    break
                if m1["content"] != m2["content"]:
                    changed_count += 1
                    self.stdout.write("Changed message id: {id}".format(id=m1["id"]))
        self.stdout.write(f"Total messages: {total_count}")
        self.stdout.write(f"Changed messages: {changed_count}")
```

--------------------------------------------------------------------------------

---[FILE: downgrade_small_realms_behind_on_payments.py]---
Location: zulip-main/zilencer/management/commands/downgrade_small_realms_behind_on_payments.py

```python
from typing import Any

from typing_extensions import override

from corporate.lib.stripe import downgrade_small_realms_behind_on_payments_as_needed
from zerver.lib.management import ZulipBaseCommand, abort_unless_locked


class Command(ZulipBaseCommand):
    help = "Downgrade small realms that are running behind on payments"

    @override
    @abort_unless_locked
    def handle(self, *args: Any, **options: Any) -> None:
        downgrade_small_realms_behind_on_payments_as_needed()
```

--------------------------------------------------------------------------------

---[FILE: invoice_plans.py]---
Location: zulip-main/zilencer/management/commands/invoice_plans.py
Signals: Django

```python
import datetime
from typing import Any

from django.conf import settings
from django.core.management.base import CommandError, CommandParser
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand, abort_unless_locked

if settings.BILLING_ENABLED:
    from corporate.lib.stripe import invoice_plans_as_needed


class Command(ZulipBaseCommand):
    help = """Generates invoices for customers if needed."""

    @override
    def add_arguments(self, parser: CommandParser) -> None:
        if settings.DEVELOPMENT:
            parser.add_argument("--date", type=datetime.datetime.fromisoformat)

    @override
    @abort_unless_locked
    def handle(self, *args: Any, **options: Any) -> None:
        if not settings.BILLING_ENABLED:
            raise CommandError("Billing is not enabled!")

        for_date = None
        if settings.DEVELOPMENT and options["date"]:
            for_date = options["date"].replace(tzinfo=datetime.timezone.utc)

        invoice_plans_as_needed(for_date)
```

--------------------------------------------------------------------------------

---[FILE: manage_push_registration_encryption_keys.py]---
Location: zulip-main/zilencer/management/commands/manage_push_registration_encryption_keys.py
Signals: Django

```python
import configparser
import json
from argparse import ArgumentParser
from typing import Any

from django.conf import settings
from nacl.encoding import Base64Encoder
from nacl.public import PrivateKey
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    help = """
Add or remove a key pair from the `push_registration_encryption_keys` map.

Usage:
./manage.py manage_push_registration_encryption_keys --add
./manage.py manage_push_registration_encryption_keys --remove-key <public-key>
"""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "--add",
            action="store_true",
            help="Add a new key pair to the `push_registration_encryption_keys` map.",
        )
        parser.add_argument(
            "--remove-key",
            metavar="PUBLIC_KEY",
            help="Remove the key pair associated with the given public key from the `push_registration_encryption_keys` map.",
        )

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        if not options["add"] and options["remove_key"] is None:
            print("Error: Please provide either --add or --remove-key <public-key>.")
            return

        if settings.DEVELOPMENT:
            SECRETS_FILENAME = "zproject/dev-secrets.conf"
        else:
            SECRETS_FILENAME = "/etc/zulip/zulip-secrets.conf"

        config = configparser.ConfigParser()
        config.read(SECRETS_FILENAME)
        push_registration_encryption_keys: dict[str, str] = json.loads(
            config.get("secrets", "push_registration_encryption_keys", fallback="{}")
        )

        added_key_pair: tuple[str, str] | None = None
        if options["add"]:
            # Generate a new key-pair and store.
            private_key = PrivateKey.generate()
            private_key_str = Base64Encoder.encode(bytes(private_key)).decode("utf-8")
            public_key_str = Base64Encoder.encode(bytes(private_key.public_key)).decode("utf-8")
            push_registration_encryption_keys[public_key_str] = private_key_str
            added_key_pair = (public_key_str, private_key_str)

        if options["remove_key"] is not None:
            # Remove the key-pair for the given public key.
            remove_key = options["remove_key"]
            if remove_key not in push_registration_encryption_keys:
                print("Error: No key pair found for the given public key.")
                return

            del push_registration_encryption_keys[remove_key]

        config.set(
            "secrets",
            "push_registration_encryption_keys",
            json.dumps(push_registration_encryption_keys),
        )
        with open(SECRETS_FILENAME, "w") as secrets_file:
            config.write(secrets_file)

        if added_key_pair is not None:
            public_key_str, private_key_str = added_key_pair
            print("Added a new key pair:")
            print(f"- Public key:  {public_key_str}")
            print(f"- Private key: {private_key_str}")

        if options["remove_key"] is not None:
            print(f"Removed the key pair for public key: {options['remove_key']}")
```

--------------------------------------------------------------------------------

---[FILE: mark_all_messages_unread.py]---
Location: zulip-main/zilencer/management/commands/mark_all_messages_unread.py
Signals: Django

```python
from typing import Any

import bmemcached
from django.conf import settings
from django.core.cache import cache
from django.db.models import F
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand
from zerver.models import UserMessage


class Command(ZulipBaseCommand):
    help = """Script to mark all messages as unread."""

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        assert settings.DEVELOPMENT
        UserMessage.objects.all().update(flags=F("flags").bitand(~UserMessage.flags.read))
        _cache = cache._cache  # type: ignore[attr-defined] # not in stubs
        assert isinstance(_cache, bmemcached.Client)
        _cache.flush_all()
```

--------------------------------------------------------------------------------

````
