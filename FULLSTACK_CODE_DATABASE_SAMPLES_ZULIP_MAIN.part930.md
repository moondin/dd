---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 930
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 930 of 1290)

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

---[FILE: send_webhook_fixture_message.py]---
Location: zulip-main/zerver/management/commands/send_webhook_fixture_message.py
Signals: Django

```python
import os
from typing import Any

import orjson
from django.conf import settings
from django.core.management.base import CommandError, CommandParser
from django.test import Client
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand
from zerver.lib.webhooks.common import standardize_headers
from zerver.models.realms import get_realm


class Command(ZulipBaseCommand):
    help = """
Create webhook message based on given fixture
Example:
./manage.py send_webhook_fixture_message \
    [--realm=zulip] \
    --fixture=zerver/webhooks/integration/fixtures/name.json \
    '--url=/api/v1/external/integration?stream=stream_name&api_key=api_key'

To pass custom headers along with the webhook message use the --custom-headers
command line option.
Example:
    --custom-headers='{"X-Custom-Header": "value"}'

The format is a JSON dictionary, so make sure that the header names do
not contain any spaces in them and that you use the precise quoting
approach shown above.
"""

    @override
    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument(
            "-f", "--fixture", help="The path to the fixture you'd like to send into Zulip"
        )

        parser.add_argument(
            "-u", "--url", help="The URL on your Zulip server that you want to post the fixture to"
        )

        parser.add_argument(
            "-H",
            "--custom-headers",
            help="The headers you want to provide along with your mock request to Zulip.",
        )

        self.add_realm_args(
            parser, help="Specify which realm/subdomain to connect to; default is zulip"
        )

    def parse_headers(self, custom_headers: None | str) -> None | dict[str, str]:
        if not custom_headers:
            return {}
        try:
            custom_headers_dict = orjson.loads(custom_headers)
        except orjson.JSONDecodeError as ve:
            raise CommandError(
                f"Encountered an error while attempting to parse custom headers: {ve}\n"
                "Note: all strings must be enclosed within \"\" instead of ''"
            )
        return standardize_headers(custom_headers_dict)

    @override
    def handle(self, *args: Any, **options: str | None) -> None:
        if options["fixture"] is None or options["url"] is None:
            self.print_help("./manage.py", "send_webhook_fixture_message")
            raise CommandError

        full_fixture_path = os.path.join(settings.DEPLOY_ROOT, options["fixture"])

        if not self._does_fixture_path_exist(full_fixture_path):
            raise CommandError("Fixture {} does not exist".format(options["fixture"]))

        headers = self.parse_headers(options["custom_headers"])
        json = self._get_fixture_as_json(full_fixture_path)
        realm = self.get_realm(options)
        if realm is None:
            realm = get_realm("zulip")

        client = Client()
        if headers:
            result = client.post(
                options["url"],
                json,
                content_type="application/json",
                HTTP_HOST=realm.host,
                extra=headers,
            )
        else:
            result = client.post(
                options["url"], json, content_type="application/json", HTTP_HOST=realm.host
            )
        if result.status_code != 200:
            raise CommandError(f"Error status {result.status_code}: {result.content!r}")

    def _does_fixture_path_exist(self, fixture_path: str) -> bool:
        return os.path.exists(fixture_path)

    def _get_fixture_as_json(self, fixture_path: str) -> bytes:
        with open(fixture_path, "rb") as f:
            return orjson.dumps(orjson.loads(f.read()))
```

--------------------------------------------------------------------------------

---[FILE: send_welcome_bot_message.py]---
Location: zulip-main/zerver/management/commands/send_welcome_bot_message.py

```python
from argparse import ArgumentParser
from typing import Any

from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand
from zerver.lib.onboarding import send_initial_direct_messages_to_user


class Command(ZulipBaseCommand):
    help = """Sends the initial welcome bot message."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        self.add_user_list_args(
            parser,
            help="Email addresses of user(s) to send welcome bot messages to.",
            all_users_help="Send to every user on the realm.",
        )
        self.add_realm_args(parser)

    @override
    def handle(self, *args: Any, **options: str) -> None:
        for user_profile in self.get_users(options, self.get_realm(options), is_bot=False):
            send_initial_direct_messages_to_user(user_profile)
```

--------------------------------------------------------------------------------

---[FILE: send_zulip_update_announcements.py]---
Location: zulip-main/zerver/management/commands/send_zulip_update_announcements.py
Signals: Django

```python
from argparse import ArgumentParser
from typing import Any

from django.conf import settings
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand, abort_cron_during_deploy, abort_unless_locked
from zerver.lib.zulip_update_announcements import send_zulip_update_announcements
from zerver.models import Realm


class Command(ZulipBaseCommand):
    help = """Script to send zulip update announcements to realms."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--progress", action="store_true", help="Log every 50 completed realms")
        parser.add_argument(
            "--skip-delay",
            action="store_true",
            help="Immediately send updates if 'zulip_update_announcements_stream' is configured.",
        )
        parser.add_argument(
            "--reset-level",
            type=int,
            help="The level to reset all active realms to.",
        )

    @override
    @abort_cron_during_deploy
    @abort_unless_locked
    def handle(self, *args: Any, **options: Any) -> None:
        if options["reset_level"] is not None:
            Realm.objects.filter(deactivated=False).exclude(
                string_id=settings.SYSTEM_BOT_REALM
            ).update(zulip_update_announcements_level=options["reset_level"])
            return

        send_zulip_update_announcements(
            skip_delay=options["skip_delay"], progress=options["progress"]
        )
```

--------------------------------------------------------------------------------

---[FILE: set_owner_full_content_access.py]---
Location: zulip-main/zerver/management/commands/set_owner_full_content_access.py

```python
from argparse import ArgumentParser
from typing import Any

from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    help = (
        "Set the owner_full_content_access flag for a realm. The flag determines "
        "whether the organization's owner will have the ability to access private "
        "content in the organization in the Zulip UI."
    )

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        toggle_group = parser.add_mutually_exclusive_group(required=True)
        toggle_group.add_argument(
            "--enable",
            action="store_true",
            help="Set owner_full_content_access to True.",
        )
        toggle_group.add_argument(
            "--disable",
            action="store_false",
            help="Set owner_full_content_access to False.",
        )
        self.add_realm_args(parser, required=True)

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        realm = self.get_realm(options)
        assert realm is not None  # Should be ensured by parser

        owner_full_content_access = options["enable"]
        realm.owner_full_content_access = owner_full_content_access
        realm.save(update_fields=["owner_full_content_access"])

        print(
            f"owner_full_content_access set to {owner_full_content_access} for realm {realm.name} (id={realm.id})."
        )
```

--------------------------------------------------------------------------------

---[FILE: show_admins.py]---
Location: zulip-main/zerver/management/commands/show_admins.py
Signals: Django

```python
from argparse import ArgumentParser
from typing import Any

from django.core.management.base import CommandError
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    help = """Show the owners and administrators in an organization."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        self.add_realm_args(parser, required=True)

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        realm = self.get_realm(options)
        assert realm is not None  # True because of required=True above

        admin_users = realm.get_admin_users_and_bots()
        owner_user_ids = set(realm.get_human_owner_users().values_list("id", flat=True))

        if admin_users:
            print("Administrators:\n")
            for user in admin_users:
                owner_detail = ""
                if user.id in owner_user_ids:
                    owner_detail = " [owner]"
                print(f"  {user.delivery_email} ({user.full_name}){owner_detail}")

        else:
            raise CommandError("There are no admins for this realm!")

        print('\nYou can use the "change_user_role" management command to adjust roles.')
```

--------------------------------------------------------------------------------

---[FILE: soft_deactivate_users.py]---
Location: zulip-main/zerver/management/commands/soft_deactivate_users.py
Signals: Django

```python
import sys
from argparse import ArgumentParser
from typing import Any

from django.conf import settings
from django.core.management.base import CommandError
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand, abort_unless_locked
from zerver.lib.soft_deactivation import (
    do_auto_soft_deactivate_users,
    do_soft_activate_users,
    do_soft_deactivate_users,
    logger,
)
from zerver.models import Realm, UserProfile


def get_users_from_emails(emails: list[str], filter_kwargs: dict[str, Realm]) -> list[UserProfile]:
    # Bug: Ideally, this would be case-insensitive like our other email queries.
    users = list(UserProfile.objects.filter(delivery_email__in=emails, **filter_kwargs))

    if len(users) != len(emails):
        user_emails_found = {user.delivery_email for user in users}
        user_emails_not_found = "\n".join(set(emails) - user_emails_found)
        raise CommandError(
            "Users with the following emails were not found:\n\n"
            f"{user_emails_not_found}\n\n"
            "Check if they are correct.",
        )
    return users


class Command(ZulipBaseCommand):
    help = """Soft activate/deactivate users. Users are recognised by their emails here."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        self.add_realm_args(parser)
        parser.add_argument(
            "-d", "--deactivate", action="store_true", help="Used to deactivate user/users."
        )
        parser.add_argument(
            "-a", "--activate", action="store_true", help="Used to activate user/users."
        )
        parser.add_argument(
            "--inactive-for",
            type=int,
            default=28,
            help="Number of days of inactivity before soft-deactivation",
        )
        parser.add_argument(
            "users",
            metavar="<users>",
            nargs="*",
            help="A list of user emails to soft activate/deactivate.",
        )

    @override
    @abort_unless_locked
    def handle(self, *args: Any, **options: Any) -> None:
        if settings.STAGING:
            print("This is a Staging server. Suppressing management command.")
            sys.exit(0)

        realm = self.get_realm(options)
        user_emails = options["users"]
        activate = options["activate"]
        deactivate = options["deactivate"]

        filter_kwargs: dict[str, Realm] = {}
        if realm is not None:
            filter_kwargs = dict(realm=realm)

        if activate:
            if not user_emails:
                print("You need to specify at least one user to use the activate option.")
                self.print_help("./manage.py", "soft_deactivate_users")
                raise CommandError

            users_to_activate = get_users_from_emails(user_emails, filter_kwargs)
            users_activated = do_soft_activate_users(users_to_activate)
            logger.info("Soft reactivated %d user(s)", len(users_activated))

        elif deactivate:
            if user_emails:
                users_to_deactivate = get_users_from_emails(user_emails, filter_kwargs)
                print("Soft deactivating forcefully...")
                users_deactivated = do_soft_deactivate_users(users_to_deactivate)
            else:
                users_deactivated = do_auto_soft_deactivate_users(
                    int(options["inactive_for"]), realm
                )
            logger.info("Soft deactivated %d user(s)", len(users_deactivated))

        else:
            self.print_help("./manage.py", "soft_deactivate_users")
            raise CommandError
```

--------------------------------------------------------------------------------

---[FILE: sync_ldap_user_data.py]---
Location: zulip-main/zerver/management/commands/sync_ldap_user_data.py
Signals: Django

```python
import logging
from argparse import ArgumentParser
from typing import Any

from django.conf import settings
from django.core.management.base import CommandError
from django.db import transaction
from django.db.models import QuerySet
from typing_extensions import override

from zerver.lib.logging_util import log_to_file
from zerver.lib.management import ZulipBaseCommand
from zerver.models import UserProfile
from zproject.backends import ZulipLDAPError, sync_user_from_ldap

## Setup ##
logger = logging.getLogger("zulip.sync_ldap_user_data")
log_to_file(logger, settings.LDAP_SYNC_LOG_PATH)


# Run this on a cron job to pick up on name changes.
@transaction.atomic(durable=True)
def sync_ldap_user_data(
    user_profiles: QuerySet[UserProfile], deactivation_protection: bool = True
) -> None:
    logger.info("Starting update.")
    try:
        realms = {u.realm.string_id for u in user_profiles}

        for u in user_profiles:
            # This will save the user if relevant, and will do nothing if the user
            # does not exist.
            try:
                sync_user_from_ldap(u, logger)
            except ZulipLDAPError as e:
                logger.error("Error attempting to update user %s:", u.delivery_email)
                logger.error(e.args[0])

        if deactivation_protection:
            if not UserProfile.objects.filter(is_bot=False, is_active=True).exists():
                raise Exception(
                    "LDAP sync would have deactivated all users. This is most likely due "
                    "to a misconfiguration of LDAP settings. Rolling back...\n"
                    "Use the --force option if the mass deactivation is intended."
                )
            for string_id in realms:
                if not UserProfile.objects.filter(
                    is_bot=False,
                    is_active=True,
                    realm__string_id=string_id,
                    role=UserProfile.ROLE_REALM_OWNER,
                ).exists():
                    raise Exception(
                        f"LDAP sync would have deactivated all owners of realm {string_id}. "
                        "This is most likely due "
                        "to a misconfiguration of LDAP settings. Rolling back...\n"
                        "Use the --force option if the mass deactivation is intended."
                    )
    except Exception:
        logger.exception("LDAP sync failed")
        raise

    logger.info("Finished update.")


class Command(ZulipBaseCommand):
    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "-f",
            "--force",
            action="store_true",
            help="Disable the protection against deactivating all users.",
        )

        self.add_realm_args(parser)
        self.add_user_list_args(parser)

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        if options.get("realm_id") is not None:
            realm = self.get_realm(options)
            user_profiles = self.get_users(options, realm, is_bot=False, include_deactivated=True)
        else:
            user_profiles = UserProfile.objects.select_related("realm").filter(is_bot=False)

            if not user_profiles.exists():
                # This case provides a special error message if one
                # tries setting up LDAP sync before creating a realm.
                raise CommandError("Zulip server contains no users. Have you created a realm?")

        if len(user_profiles) == 0:
            # We emphasize that this error is purely about the
            # command-line parameters, since this has nothing to do
            # with your LDAP configuration.
            raise CommandError("Zulip server contains no users matching command-line parameters.")

        sync_ldap_user_data(user_profiles, not options["force"])
```

--------------------------------------------------------------------------------

---[FILE: thumbnail.py]---
Location: zulip-main/zerver/management/commands/thumbnail.py
Signals: Django

```python
from datetime import timedelta
from typing import Any

from django.core.management.base import CommandParser
from django.db.models import Exists, OuterRef
from django.utils.timezone import now as timezone_now
from typing_extensions import override

from zerver.actions.message_edit import re_thumbnail
from zerver.lib.management import ZulipBaseCommand
from zerver.lib.queue import queue_event_on_commit
from zerver.lib.thumbnail import StoredThumbnailFormat, get_image_thumbnail_path
from zerver.lib.upload import all_message_attachments
from zerver.models import ArchivedMessage, Attachment, ImageAttachment, Message


class Command(ZulipBaseCommand):
    help = """Manages thumbnailing in messages."""

    @override
    def add_arguments(self, parser: CommandParser) -> None:
        self.add_realm_args(parser, required=True)
        mode = parser.add_mutually_exclusive_group(required=True)
        mode.add_argument(
            "--stuck-spinners",
            action="store_true",
            help="Attempt to re-render messages with stuck spinners",
        )
        mode.add_argument(
            "--old-images",
            action="store_true",
            help="Generate thumbnails of old images",
        )
        mode.add_argument(
            "--missing-files",
            action="store_true",
            help="Regenerate thumbnails when their files are missing",
        )
        parser.add_argument(
            "--cutoff",
            help="Only process messages sent less than this many days ago",
            type=int,
            default=100,
        )

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        realm = self.get_realm(options)
        assert realm is not None

        if options.get("missing_files"):
            realm_imageattachments = (
                ImageAttachment.objects.alias(
                    in_realm=Exists(
                        Attachment.objects.filter(path_id=OuterRef("path_id"), realm_id=realm.id)
                    )
                )
                .filter(in_realm=True)
                .exclude(thumbnail_metadata=[])
            )
            for image_attachment in realm_imageattachments:
                found = []
                changed = False
                thumb_dir = f"thumbnail/{image_attachment.path_id}"
                found_thumbs = [
                    e[0] for e in all_message_attachments(include_thumbnails=True, prefix=thumb_dir)
                ]
                for existing_thumbnail in image_attachment.thumbnail_metadata:
                    thumb = StoredThumbnailFormat(**existing_thumbnail)
                    if get_image_thumbnail_path(image_attachment, thumb) in found_thumbs:
                        found.append(existing_thumbnail)
                    else:
                        changed = True
                if changed:
                    image_attachment.thumbnail_metadata = found
                    image_attachment.save(update_fields=["thumbnail_metadata"])
                    queue_event_on_commit("thumbnail", {"id": image_attachment.id})
            return

        for message_class in (Message, ArchivedMessage):
            messages = message_class.objects.filter(
                realm_id=realm.id,
                has_image=True,
                date_sent__gt=timezone_now() - timedelta(days=options["cutoff"]),
            )
            if options.get("stuck_spinners"):
                messages = messages.filter(
                    rendered_content__contains='class="image-loading-placeholder"',
                    date_sent__lt=timezone_now() - timedelta(seconds=60),
                )
            elif options.get("old_images"):
                messages = messages.filter(
                    rendered_content__contains='<img src="/user_uploads/',
                ).exclude(
                    rendered_content__contains='<img src="/user_uploads/thumbnail/',
                )

            message_ids = list(messages.values_list("id", flat=True))
            print(f"Processing {len(message_ids)} {message_class.__name__} objects")
            for i, message_id in enumerate(message_ids):
                re_thumbnail(message_class, message_id, enqueue=options["old_images"])

                if (i + 1) % 100 == 0:
                    print(f"Processed {i + 1}/{len(message_ids)} {message_class.__name__} objects")
```

--------------------------------------------------------------------------------

---[FILE: transfer_uploads_to_s3.py]---
Location: zulip-main/zerver/management/commands/transfer_uploads_to_s3.py
Signals: Django

```python
from typing import Any

from django.conf import settings
from django.core.management.base import CommandError, CommandParser
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand
from zerver.lib.transfer import transfer_uploads_to_s3


class Command(ZulipBaseCommand):
    help = """Transfer uploads to S3 """

    @override
    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument(
            "--processes",
            default=settings.DEFAULT_DATA_EXPORT_IMPORT_PARALLELISM,
            help="Processes to use for exporting uploads in parallel",
        )

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        num_processes = int(options["processes"])
        if num_processes < 1:
            raise CommandError("You must have at least one process.")

        if not settings.LOCAL_UPLOADS_DIR:
            raise CommandError("Please set the value of LOCAL_UPLOADS_DIR.")

        transfer_uploads_to_s3(num_processes)
        print("Transfer to S3 completed successfully.")
```

--------------------------------------------------------------------------------

---[FILE: unarchive_channel.py]---
Location: zulip-main/zerver/management/commands/unarchive_channel.py
Signals: Django

```python
from argparse import ArgumentParser
from typing import Any

from django.core.management.base import CommandError
from typing_extensions import override

from zerver.actions.streams import deactivated_streams_by_old_name, do_unarchive_stream
from zerver.lib.management import ZulipBaseCommand
from zerver.models import RealmAuditLog, Stream
from zerver.models.realm_audit_logs import AuditLogEventType


class Command(ZulipBaseCommand):
    help = """Reactivate a channel that was deactivated."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        specify_channel = parser.add_mutually_exclusive_group(required=True)
        specify_channel.add_argument(
            "-c",
            "--channel",
            help="Name of a deactivated channel in the realm.",
        )
        specify_channel.add_argument(
            "--channel-id",
            help="ID of a deactivated channel in the realm.",
        )
        parser.add_argument(
            "-n",
            "--new-name",
            required=False,
            help="Name to reactivate as; defaults to the old name.",
        )
        self.add_realm_args(parser, required=True)

    @override
    def handle(self, *args: Any, **options: str | None) -> None:
        realm = self.get_realm(options)
        assert realm is not None  # Should be ensured by parser

        # Looking up the channel is complicated, since they get renamed
        # when they are deactivated, in a transformation which may be
        # lossy.

        if options["channel_id"] is not None:
            channel = Stream.objects.get(id=options["channel_id"])
            if channel.realm_id != realm.id:
                raise CommandError(
                    f"Channel id {channel.id}, named '{channel.name}', is in realm '{channel.realm.string_id}', not '{realm.string_id}'"
                )
            if not channel.deactivated:
                raise CommandError(
                    f"Channel id {channel.id}, named '{channel.name}', is not deactivated"
                )
            if options["new_name"] is None:
                raise CommandError("--new-name flag is required with --channel-id")
            new_name = options["new_name"]
        else:
            channel_name = options["channel"]
            assert channel_name is not None

            possible_channels = deactivated_streams_by_old_name(realm, channel_name)
            if len(possible_channels) == 0:
                raise CommandError("No matching deactivated channels found!")

            if len(possible_channels) > 1:
                # Print ids of all possible channels, support passing by id
                print("Matching channels:")
                for channel in possible_channels:
                    last_deactivation = (
                        RealmAuditLog.objects.filter(
                            realm=realm,
                            modified_stream=channel,
                            event_type=AuditLogEventType.CHANNEL_DEACTIVATED,
                        )
                        .order_by("-id")
                        .first()
                    )
                    assert last_deactivation is not None
                    print(
                        f"  ({channel.id}) {channel.name}, deactivated on {last_deactivation.event_time}"
                    )
                raise CommandError(
                    "More than one matching channel found!  Specify which with --channel-id"
                )

            channel = possible_channels[0]
            if options["new_name"] is not None:
                new_name = options["new_name"]
            else:
                new_name = channel_name

        if (
            Stream.objects.filter(realm=realm, name__iexact=new_name)
            .exclude(id=channel.id)
            .exists()
        ):
            raise CommandError(
                f"Channel with name '{new_name}' already exists; pass a different --new-name"
            )

        assert channel is not None
        do_unarchive_stream(channel, new_name, acting_user=None)
```

--------------------------------------------------------------------------------

---[FILE: update_channel_recently_active_status.py]---
Location: zulip-main/zerver/management/commands/update_channel_recently_active_status.py
Signals: Django

```python
import logging
from typing import Any

from django.conf import settings
from typing_extensions import override

from zerver.lib.logging_util import log_to_file
from zerver.lib.management import ZulipBaseCommand
from zerver.lib.streams import check_update_all_streams_active_status

## Logging setup ##
logger = logging.getLogger(__name__)
log_to_file(logger, settings.DIGEST_LOG_PATH)


class Command(ZulipBaseCommand):
    help = """Update the `Stream.is_recently_active` field to False for channels whose message history has aged to the point where it is no longer recently active."""

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        count = check_update_all_streams_active_status()
        logger.info("Marked %s channels as not recently active.", count)
```

--------------------------------------------------------------------------------

---[FILE: update_subscriber_counts.py]---
Location: zulip-main/zerver/management/commands/update_subscriber_counts.py
Signals: Django

```python
import argparse
import logging
from datetime import timedelta
from typing import Any

from django.conf import settings
from django.db import transaction
from django.db.models import F, QuerySet
from django.utils.timezone import now as timezone_now
from typing_extensions import override

from zerver.lib.logging_util import log_to_file
from zerver.lib.management import ZulipBaseCommand
from zerver.models import RealmAuditLog, Stream, Subscription
from zerver.models.realm_audit_logs import AuditLogEventType

## Logging setup ##
logger = logging.getLogger(__name__)
log_to_file(logger, settings.DIGEST_LOG_PATH)


class Command(ZulipBaseCommand):
    help = """Update the `Stream.subscriber_count` field based on current subscribers.

There may be race conditions with keeping the cached subscriber count
accurate; this command is run as a daily cron job to ensure the number is accurate.
"""

    @override
    def add_arguments(self, parser: argparse.ArgumentParser) -> None:
        parser.add_argument(
            "--since",
            type=int,
            help="Only examine channels with changed subscribers in this many hours",
        )
        self.add_realm_args(parser, help="The optional name of the realm to limit to")

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        realm = self.get_realm(options)
        streams = Stream.objects.all()
        if options["since"]:
            since_time = timezone_now() - timedelta(hours=options["since"])
            # Two ways the count can change -- via a subscription
            # being changed, or via a user being (de)activated.
            changed_subs = RealmAuditLog.objects.filter(
                event_type__in=(
                    AuditLogEventType.SUBSCRIPTION_CREATED,
                    AuditLogEventType.SUBSCRIPTION_ACTIVATED,
                    AuditLogEventType.SUBSCRIPTION_DEACTIVATED,
                ),
                event_time__gte=since_time,
            )
            if realm:
                changed_subs = changed_subs.filter(realm=realm)

            # Find all users changed in the time period, join those to
            # their subscriptions and distinct recipients, and thence
            # to streams.
            changed_users = RealmAuditLog.objects.filter(
                event_type__in=(
                    AuditLogEventType.USER_CREATED,
                    AuditLogEventType.USER_DEACTIVATED,
                    AuditLogEventType.USER_ACTIVATED,
                    AuditLogEventType.USER_REACTIVATED,
                ),
                event_time__gte=since_time,
            )
            if realm:
                changed_users = changed_users.filter(realm=realm)
            changed_user_ids = (
                changed_users.values_list("modified_user_id", flat=True)
                .distinct()
                .order_by("modified_user_id")
            )

            changed_user_subs = (
                Subscription.objects.filter(user_profile_id__in=changed_user_ids)
                .values_list("recipient_id", flat=True)
                .distinct()
                .order_by("recipient_id")
            )
            streams_from_users = Stream.objects.filter(recipient_id__in=changed_user_subs)
            if realm:
                streams_from_users = streams_from_users.filter(realm=realm)

            stream_ids: QuerySet[Any, int] = (
                changed_subs.distinct("modified_stream_id")
                .order_by("modified_stream_id")
                .annotate(stream_id=F("modified_stream_id"))
                .union(streams_from_users.annotate(stream_id=F("id")))
                .values_list("stream_id", flat=True)
            )
        elif realm := self.get_realm(options):
            stream_ids = streams.filter(realm=realm).values_list("id", flat=True)
        else:
            stream_ids = streams.all().values_list("id", flat=True)

        for stream_id in stream_ids.iterator():
            with transaction.atomic(durable=True):
                stream = Stream.objects.select_for_update().get(id=stream_id)
                actual_subscriber_count = Subscription.objects.filter(
                    active=True,
                    recipient__type=2,
                    recipient__type_id=stream_id,
                    is_user_active=True,
                ).count()
                db_count = stream.subscriber_count
                if actual_subscriber_count == db_count:
                    continue
                stream.subscriber_count = actual_subscriber_count
                stream.save(update_fields=["subscriber_count"])

            logging.info(
                "Updated subscriber count of %s, #%s: from %d to %d",
                stream.realm.string_id,
                stream.name,
                db_count,
                actual_subscriber_count,
            )
```

--------------------------------------------------------------------------------

````
