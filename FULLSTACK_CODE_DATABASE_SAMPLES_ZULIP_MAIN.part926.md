---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 926
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 926 of 1290)

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

---[FILE: create_realm_internal_bots.py]---
Location: zulip-main/zerver/management/commands/create_realm_internal_bots.py

```python
from typing import Any

from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand
from zerver.lib.onboarding import create_if_missing_realm_internal_bots


class Command(ZulipBaseCommand):
    help = """\
Create realm internal bots if absent, in all realms.

These are normally created when the realm is, so this should be a no-op
except when upgrading to a version that adds a new realm internal bot.
"""

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        create_if_missing_realm_internal_bots()
        # create_users is idempotent -- it's a no-op when a given email
        # already has a user in a given realm.
```

--------------------------------------------------------------------------------

---[FILE: create_stream.py]---
Location: zulip-main/zerver/management/commands/create_stream.py

```python
from argparse import ArgumentParser
from typing import Any

from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand
from zerver.lib.streams import create_stream_if_needed


class Command(ZulipBaseCommand):
    help = """Create a stream, and subscribe all active users (excluding bots).

This should be used for TESTING only, unless you understand the limitations of
the command."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        self.add_realm_args(parser, required=True, help="realm in which to create the stream")
        parser.add_argument("stream_name", metavar="<stream name>", help="name of stream to create")

    @override
    def handle(self, *args: Any, **options: str) -> None:
        realm = self.get_realm(options)
        assert realm is not None  # Should be ensured by parser

        stream_name = options["stream_name"]
        create_stream_if_needed(realm, stream_name, acting_user=None)
```

--------------------------------------------------------------------------------

---[FILE: create_user.py]---
Location: zulip-main/zerver/management/commands/create_user.py
Signals: Django

```python
import argparse
from typing import Any

from django.core.management.base import CommandError
from django.db.utils import IntegrityError
from typing_extensions import override

from zerver.actions.create_user import do_create_user
from zerver.lib.management import ZulipBaseCommand
from zerver.models import UserProfile


class Command(ZulipBaseCommand):
    help = """Create a new Zulip user via the command line.

Prompts the user for <email> and <full name> if not specified.

We recommend the Zulip API (https://zulip.com/api/create-user) instead
of this tool for most use cases.

If the server has Terms of Service configured, the user will be
prompted to accept the Terms of Service the first time they login.
"""

    @override
    def add_arguments(self, parser: argparse.ArgumentParser) -> None:
        self.add_create_user_args(parser)
        self.add_realm_args(
            parser, required=True, help="The name of the existing realm to which to add the user."
        )

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        realm = self.get_realm(options)
        assert realm is not None  # Should be ensured by parser

        create_user_params = self.get_create_user_params(options)

        try:
            do_create_user(
                create_user_params.email,
                create_user_params.password,
                realm,
                create_user_params.full_name,
                # Explicitly set tos_version=-1. This means that users
                # created via this mechanism would be prompted to set
                # the email_address_visibility setting on first login.
                # For servers that have configured Terms of Service,
                # users will also be prompted to accept the Terms of
                # Service on first login.
                tos_version=UserProfile.TOS_VERSION_BEFORE_FIRST_LOGIN,
                acting_user=None,
            )
        except IntegrityError:
            raise CommandError("User already exists.")
```

--------------------------------------------------------------------------------

---[FILE: deactivate_realm.py]---
Location: zulip-main/zerver/management/commands/deactivate_realm.py

```python
from argparse import ArgumentParser
from typing import Any, cast

from typing_extensions import override

from zerver.actions.realm_settings import do_add_deactivated_redirect, do_deactivate_realm
from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    help = """Script to deactivate a realm."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "--redirect_url", metavar="<redirect_url>", help="URL to which the realm has moved"
        )
        parser.add_argument(
            "--deactivation_reason",
            metavar="<deactivation_reason>",
            help="Reason for deactivation",
            required=True,
        )
        parser.add_argument(
            "--email_owners",
            action="store_true",
            help="Whether to email organization owners about realm deactivation",
        )
        self.add_realm_args(parser, required=True)

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        realm = self.get_realm(options)
        deactivation_reason = options["deactivation_reason"]

        assert realm is not None  # Should be ensured by parser

        if options["redirect_url"]:
            print("Setting the redirect URL to", options["redirect_url"])
            do_add_deactivated_redirect(realm, options["redirect_url"])

        if realm.deactivated:
            print("The realm", options["realm_id"], "is already deactivated.")
            return

        send_realm_deactivation_email = options["email_owners"]
        print("Deactivating", options["realm_id"])
        do_deactivate_realm(
            realm,
            acting_user=None,
            deactivation_reason=cast(Any, deactivation_reason),
            email_owners=send_realm_deactivation_email,
        )
        print("Done!")
```

--------------------------------------------------------------------------------

---[FILE: deactivate_user.py]---
Location: zulip-main/zerver/management/commands/deactivate_user.py
Signals: Django

```python
from argparse import ArgumentParser
from typing import Any

from django.core.management.base import CommandError
from typing_extensions import override

from zerver.actions.users import do_deactivate_user
from zerver.lib.management import ZulipBaseCommand
from zerver.lib.sessions import user_sessions
from zerver.lib.users import get_active_bots_owned_by_user


class Command(ZulipBaseCommand):
    help = "Deactivate a user, including forcibly logging them out."

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "-f",
            "--for-real",
            action="store_true",
            help="Actually deactivate the user. Default is a dry run.",
        )
        parser.add_argument("email", metavar="<email>", help="email of user to deactivate")
        self.add_realm_args(parser)

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        realm = self.get_realm(options)
        user_profile = self.get_user(options["email"], realm)

        print(
            f"Deactivating {user_profile.full_name} ({user_profile.delivery_email}) - {user_profile.realm.string_id}"
        )
        print(f"{user_profile.delivery_email} has the following active sessions:")
        for session in user_sessions(user_profile):
            print(session.expire_date, session.get_decoded())
        print()
        print(
            f"{user_profile.delivery_email} has {get_active_bots_owned_by_user(user_profile).count()} active bots that will also be deactivated."
        )

        if not options["for_real"]:
            raise CommandError("This was a dry run. Pass -f to actually deactivate.")

        do_deactivate_user(user_profile, acting_user=None)
        print("Sessions deleted, user deactivated.")
```

--------------------------------------------------------------------------------

---[FILE: delete_old_unclaimed_attachments.py]---
Location: zulip-main/zerver/management/commands/delete_old_unclaimed_attachments.py
Signals: Django

```python
from argparse import ArgumentParser
from datetime import timedelta
from typing import Any

from django.core.management.base import CommandError
from django.utils.timezone import now as timezone_now
from typing_extensions import override

from zerver.actions.uploads import do_delete_old_unclaimed_attachments
from zerver.lib.attachments import get_old_unclaimed_attachments
from zerver.lib.management import ZulipBaseCommand, abort_unless_locked
from zerver.lib.thumbnail import split_thumbnail_path
from zerver.lib.upload import all_message_attachments, delete_message_attachments
from zerver.models import ArchivedAttachment, Attachment


class Command(ZulipBaseCommand):
    help = """Remove unclaimed attachments from storage older than a supplied
              numerical value indicating the limit of how old the attachment can be.
              The default is five weeks."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "-w",
            "--weeks",
            dest="delta_weeks",
            default=5,
            type=int,
            help="How long unattached attachments are preserved; defaults to 5 weeks.",
        )

        parser.add_argument(
            "-f",
            "--for-real",
            action="store_true",
            help="Actually remove the files from the storage.",
        )

        parser.add_argument(
            "-C",
            "--clean-up-storage",
            action="store_true",
            help="Examine all attachments in storage (local disk or S3) and remove "
            "any files which are not in the database. This may take a very long time!",
        )

    @override
    @abort_unless_locked
    def handle(self, *args: Any, **options: Any) -> None:
        delta_weeks = options["delta_weeks"]
        print(f"Deleting unclaimed attached files older than {delta_weeks} weeks")

        # print the list of files that are going to be removed
        old_attachments, old_archived_attachments = get_old_unclaimed_attachments(delta_weeks)
        for old_attachment in old_attachments:
            print(f"* {old_attachment.file_name} created at {old_attachment.create_time}")
        for old_archived_attachment in old_archived_attachments:
            print(
                f"* {old_archived_attachment.file_name} created at {old_archived_attachment.create_time}"
            )

        if options["for_real"]:
            do_delete_old_unclaimed_attachments(delta_weeks)
            print()
            print("Unclaimed files deleted.")

        if options["clean_up_storage"]:
            print()
            self.clean_attachment_upload_backend(dry_run=not options["for_real"])

        if not options["for_real"]:
            print()
            raise CommandError("This was a dry run. Pass -f to actually delete.")

    def clean_attachment_upload_backend(self, dry_run: bool = True) -> None:
        cutoff = timezone_now() - timedelta(minutes=5)
        print(f"Removing extra files in storage black-end older than {cutoff.isoformat()}")
        to_delete = []
        for file_path, modified_at in all_message_attachments(include_thumbnails=True):
            if file_path.startswith("thumbnail/"):
                path_id = split_thumbnail_path(file_path)[0]
            else:
                path_id = file_path
            if Attachment.objects.filter(path_id=path_id).exists():
                continue
            if ArchivedAttachment.objects.filter(path_id=path_id).exists():
                continue
            if modified_at > cutoff:
                # We upload files to the backend storage and _then_
                # make the database entry, so must give some leeway to
                # recently-added files which do not have DB rows.
                continue
            print(f"* {file_path} modified at {modified_at}")
            if dry_run:
                continue
            to_delete.append(file_path)
            if len(to_delete) > 1000:
                delete_message_attachments(to_delete)
                to_delete = []
        if not dry_run and len(to_delete) > 0:
            delete_message_attachments(to_delete)
```

--------------------------------------------------------------------------------

---[FILE: delete_realm.py]---
Location: zulip-main/zerver/management/commands/delete_realm.py
Signals: Django

```python
from argparse import ArgumentParser
from typing import Any

from django.conf import settings
from django.core.management.base import CommandError
from typing_extensions import override

from zerver.actions.realm_settings import do_delete_all_realm_attachments
from zerver.lib.management import ZulipBaseCommand
from zerver.models import Message, UserProfile


class Command(ZulipBaseCommand):
    help = """Script to permanently delete a realm. Recommended only for removing
realms used for testing; consider using deactivate_realm instead."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        self.add_realm_args(parser, required=True)

    @override
    def handle(self, *args: Any, **options: str) -> None:
        realm = self.get_realm(options)
        assert realm is not None  # Should be ensured by parser

        user_count = UserProfile.objects.filter(
            realm_id=realm.id,
            is_active=True,
            is_bot=False,
        ).count()

        message_count = Message.objects.filter(realm=realm).count()

        print(f"This realm has {user_count} users and {message_count} messages.\n")

        if settings.BILLING_ENABLED:
            # Deleting a Realm object also deletes associating billing
            # metadata in an invariant-violating way, so we should
            # never use this tool for a realm with billing set up.
            from corporate.models.customers import get_customer_by_realm
            from corporate.models.plans import CustomerPlan

            customer = get_customer_by_realm(realm)
            if customer and (
                customer.stripe_customer_id
                or CustomerPlan.objects.filter(customer=customer).exists()
            ):
                raise CommandError("This realm has had a billing relationship associated with it!")

        print(
            "This command will \033[91mPERMANENTLY DELETE\033[0m all data for this realm.  "
            "Most use cases will be better served by scrub_realm and/or deactivate_realm."
        )

        confirmation = input("Type the name of the realm to confirm: ")
        if confirmation != realm.string_id:
            raise CommandError("Aborting!")

        # Explicitly remove the attachments and their files in backend
        # storage; failing to do this leaves dangling files
        do_delete_all_realm_attachments(realm)

        # TODO: This approach leaks Recipient and DirectMessageGroup
        # objects, because those don't have a foreign key to the Realm
        # or any other model it cascades to (Realm/Stream/UserProfile/etc.).
        realm.delete()

        print("Realm has been successfully permanently deleted.")
```

--------------------------------------------------------------------------------

---[FILE: delete_user.py]---
Location: zulip-main/zerver/management/commands/delete_user.py
Signals: Django

```python
from argparse import ArgumentParser
from typing import Any

from django.core.management.base import CommandError
from typing_extensions import override

from zerver.actions.users import do_delete_user
from zerver.lib.management import ZulipBaseCommand
from zerver.lib.users import get_active_bots_owned_by_user


class Command(ZulipBaseCommand):
    help = """

Delete a user or users, including all messages sent by them and
personal messages received by them, and audit records, like what
streams they had been subscribed to. Deactivating users is generally
recommended over this tool, but deletion can be useful if you
specifically to completely delete an account created for testing.
This will:

* Delete the user's account, including metadata like name, email
  address, custom profile fields, historical subscriptions, etc.

* Delete any messages they've sent and any non-group direct messages
  they've received.

* Group direct messages in which the user participated won't be
  deleted (with the exceptions of those message the deleted user
  sent). An inactive, inaccessible dummy user account named "Deleted
  User <id>" is created to replace the deleted user as a recipient in
  group direct message conversations, in order to somewhat preserve
  their integrity.

* Delete other records of the user's activity, such as emoji reactions.

* Deactivate all bots owned by the user, without deleting them or
  their data.  If you want to delete the bots and the message
  sent/received by them, you can use the command on them individually.
"""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "-f",
            "--for-real",
            action="store_true",
            help="Actually delete the user(s). Default is a dry run.",
        )
        self.add_realm_args(parser)
        self.add_user_list_args(parser)

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        realm = self.get_realm(options)
        user_profiles = self.get_users(options, realm)

        for user_profile in user_profiles:
            print(
                f"{user_profile.delivery_email} has {get_active_bots_owned_by_user(user_profile).count()} active bots that will be deactivated as a result of the user's deletion."
            )

        if not options["for_real"]:
            raise CommandError("This was a dry run. Pass -f to actually delete.")

        for user_profile in user_profiles:
            do_delete_user(user_profile, acting_user=None)
            print(f"Successfully deleted user {user_profile.delivery_email}.")
```

--------------------------------------------------------------------------------

---[FILE: deliver_scheduled_emails.py]---
Location: zulip-main/zerver/management/commands/deliver_scheduled_emails.py
Signals: Django

```python
"""\
Send email messages that have been queued for later delivery by
various things (e.g. invitation reminders and welcome emails).

This management command is run via supervisor.
"""

import logging
import time
from typing import Any

from django.conf import settings
from django.db import transaction
from django.utils.timezone import now as timezone_now
from typing_extensions import override

from zerver.lib.logging_util import log_to_file
from zerver.lib.management import ZulipBaseCommand
from zerver.lib.send_email import EmailNotDeliveredError, queue_scheduled_emails
from zerver.models import ScheduledEmail

## Setup ##
logger = logging.getLogger(__name__)
log_to_file(logger, settings.EMAIL_DELIVERER_LOG_PATH)


class Command(ZulipBaseCommand):
    help = """Send emails queued by various parts of Zulip
for later delivery.

Run this command under supervisor.

Usage: ./manage.py deliver_scheduled_emails
"""

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        try:
            while True:
                with transaction.atomic(durable=True):
                    job = (
                        ScheduledEmail.objects.filter(scheduled_timestamp__lte=timezone_now())
                        .prefetch_related("users")
                        .select_for_update(skip_locked=True)
                        .order_by("scheduled_timestamp")
                        .first()
                    )
                    if job:
                        try:
                            queue_scheduled_emails(job)
                        except EmailNotDeliveredError:
                            logger.warning("%r not delivered", job)
                    else:
                        time.sleep(10)
        except KeyboardInterrupt:
            pass
```

--------------------------------------------------------------------------------

---[FILE: deliver_scheduled_messages.py]---
Location: zulip-main/zerver/management/commands/deliver_scheduled_messages.py
Signals: Django

```python
import time
from datetime import timedelta
from typing import Any

from django.utils.timezone import now as timezone_now
from typing_extensions import override

from zerver.actions.scheduled_messages import try_deliver_one_scheduled_message
from zerver.lib.management import ZulipBaseCommand


## Setup ##
class Command(ZulipBaseCommand):
    help = """Deliver scheduled messages from the ScheduledMessage table.
Run this command under supervisor.

This management command is run via supervisor.

Usage: ./manage.py deliver_scheduled_messages
"""

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        try:
            while True:
                if try_deliver_one_scheduled_message():
                    continue

                # If there's no overdue scheduled messages, go to sleep until the next minute.
                cur_time = timezone_now()
                time_next_min = (cur_time + timedelta(minutes=1)).replace(second=0, microsecond=0)
                sleep_time = (time_next_min - cur_time).total_seconds()
                time.sleep(sleep_time)
        except KeyboardInterrupt:
            pass
```

--------------------------------------------------------------------------------

---[FILE: edit_linkifiers.py]---
Location: zulip-main/zerver/management/commands/edit_linkifiers.py
Signals: Django

```python
import sys
from argparse import ArgumentParser
from typing import Any

from django.core.management.base import CommandError
from typing_extensions import override

from zerver.actions.realm_linkifiers import do_add_linkifier, do_remove_linkifier
from zerver.lib.management import ZulipBaseCommand
from zerver.models.linkifiers import linkifiers_for_realm


class Command(ZulipBaseCommand):
    help = """Create a link filter rule for the specified realm.

NOTE: Regexes must be simple enough that they can be easily translated to JavaScript
      RegExp syntax. In addition to JS-compatible syntax, the following features are available:

      * Named groups will be converted to numbered groups automatically
      * Inline-regex flags will be stripped, and where possible translated to RegExp-wide flags

Example: ./manage.py edit_linkifiers --realm=zulip --op=add '#(?P<id>[0-9]{2,8})' \
    'https://support.example.com/ticket/{id}'
Example: ./manage.py edit_linkifiers --realm=zulip --op=remove '#(?P<id>[0-9]{2,8})'
Example: ./manage.py edit_linkifiers --realm=zulip --op=show
"""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "--op", default="show", help="What operation to do (add, show, remove)."
        )
        parser.add_argument(
            "pattern", metavar="<pattern>", nargs="?", help="regular expression to match"
        )
        parser.add_argument(
            "url_template",
            metavar="<URL template>",
            nargs="?",
            help="URL template to expand",
        )
        self.add_realm_args(parser, required=True)

    @override
    def handle(self, *args: Any, **options: str) -> None:
        realm = self.get_realm(options)
        assert realm is not None  # Should be ensured by parser
        if options["op"] == "show":
            print(f"{realm.string_id}: {linkifiers_for_realm(realm.id)}")
            sys.exit(0)

        pattern = options["pattern"]
        if not pattern:
            self.print_help("./manage.py", "edit_linkifiers")
            raise CommandError

        if options["op"] == "add":
            url_template = options["url_template"]
            if not url_template:
                self.print_help("./manage.py", "edit_linkifiers")
                raise CommandError
            do_add_linkifier(realm, pattern, url_template, acting_user=None)
            sys.exit(0)
        elif options["op"] == "remove":
            do_remove_linkifier(realm, pattern=pattern, acting_user=None)
            sys.exit(0)
        else:
            self.print_help("./manage.py", "edit_linkifiers")
            raise CommandError
```

--------------------------------------------------------------------------------

---[FILE: email_mirror.py]---
Location: zulip-main/zerver/management/commands/email_mirror.py
Signals: Django

```python
"""Cron job implementation of Zulip's incoming email gateway's helper
for forwarding emails into Zulip.

https://zulip.readthedocs.io/en/latest/production/email-gateway.html

The email gateway supports two major modes of operation: An email
server where the email address configured in EMAIL_GATEWAY_PATTERN
delivers emails directly to Zulip, and this, a cron job that connects
to an IMAP inbox (which receives the emails) periodically.

Run this in a cron job every N minutes if you have configured Zulip to
poll an external IMAP mailbox for messages. The script will then
connect to your IMAP server and batch-process all messages.

We extract and validate the target stream from information in the
recipient address and retrieve, forward, and archive the message.

"""

import email.parser
import email.policy
import logging
from collections.abc import Generator
from email.message import EmailMessage
from imaplib import IMAP4_SSL
from typing import Any

from django.conf import settings
from django.core.management.base import CommandError
from typing_extensions import override

from zerver.lib.email_mirror import logger, process_message
from zerver.lib.management import ZulipBaseCommand

## Setup ##

log_format = "%(asctime)s: %(message)s"
logging.basicConfig(format=log_format)

formatter = logging.Formatter(log_format)
file_handler = logging.FileHandler(settings.EMAIL_MIRROR_LOG_PATH)
file_handler.setFormatter(formatter)
logger.setLevel(logging.DEBUG)
logger.addHandler(file_handler)


def get_imap_messages() -> Generator[EmailMessage, None, None]:
    # We're probably running from cron, try to batch-process mail
    if (
        not settings.EMAIL_GATEWAY_BOT
        or not settings.EMAIL_GATEWAY_LOGIN
        or not settings.EMAIL_GATEWAY_PASSWORD
        or not settings.EMAIL_GATEWAY_IMAP_SERVER
        or not settings.EMAIL_GATEWAY_IMAP_PORT
        or not settings.EMAIL_GATEWAY_IMAP_FOLDER
    ):
        raise CommandError(
            "Please configure the email mirror gateway in /etc/zulip/, "
            "or specify $ORIGINAL_RECIPIENT if piping a single mail."
        )
    mbox = IMAP4_SSL(settings.EMAIL_GATEWAY_IMAP_SERVER, settings.EMAIL_GATEWAY_IMAP_PORT)
    mbox.login(settings.EMAIL_GATEWAY_LOGIN, settings.EMAIL_GATEWAY_PASSWORD)
    try:
        mbox.select(settings.EMAIL_GATEWAY_IMAP_FOLDER)
        try:
            _status, num_ids_data = mbox.search(None, "ALL")
            for message_id in num_ids_data[0].split():
                _status, msg_data = mbox.fetch(message_id, "(RFC822)")
                assert isinstance(msg_data[0], tuple)
                msg_as_bytes = msg_data[0][1]
                yield email.parser.BytesParser(
                    _class=EmailMessage, policy=email.policy.default
                ).parsebytes(msg_as_bytes)
                mbox.store(message_id, "+FLAGS", "\\Deleted")
            mbox.expunge()
        finally:
            mbox.close()
    finally:
        mbox.logout()


class Command(ZulipBaseCommand):
    help = __doc__

    @override
    def handle(self, *args: Any, **options: str) -> None:
        for message in get_imap_messages():
            process_message(message)
```

--------------------------------------------------------------------------------

---[FILE: email_server.py]---
Location: zulip-main/zerver/management/commands/email_server.py
Signals: Django

```python
import os
import ssl
from typing import Any
from urllib.parse import SplitResult

from django.core.management.base import BaseCommand, CommandParser
from typing_extensions import override

from zerver.lib.email_mirror_server import run_smtp_server


class Command(BaseCommand):
    help = """SMTP server to ingest incoming emails"""

    @override
    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument(
            "--listen", help="[Port, or address:port, to bind HTTP server to]", default="0.0.0.0:25"
        )
        parser.add_argument(
            "--user",
            help="User to drop privileges to, if started as root.",
            required=(os.geteuid() == 0),
        )
        parser.add_argument(
            "--group",
            help="Group to drop privileges to, if started as root.",
            required=(os.geteuid() == 0),
        )
        tls_cert: str | None = None
        tls_key: str | None = None
        if os.access("/etc/ssl/certs/zulip.combined-chain.crt", os.R_OK) and os.access(
            "/etc/ssl/private/zulip.key", os.R_OK
        ):
            tls_cert = "/etc/ssl/certs/zulip.combined-chain.crt"
            tls_key = "/etc/ssl/private/zulip.key"
        elif os.access("/etc/ssl/certs/ssl-cert-snakeoil.pem", os.R_OK) and os.access(
            "/etc/ssl/private/ssl-cert-snakeoil.key", os.R_OK
        ):
            tls_cert = "/etc/ssl/certs/ssl-cert-snakeoil.pem"
            tls_key = "/etc/ssl/private/ssl-cert-snakeoil.key"
        parser.add_argument(
            "--tls-cert",
            help="Path to TLS certificate chain file",
            default=tls_cert,
        )
        parser.add_argument(
            "--tls-key",
            help="Path to TLS private key file",
            default=tls_key,
        )

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        listen = options["listen"]
        if listen.isdigit():
            host, port = "0.0.0.0", int(listen)  # noqa: S104
        else:
            r = SplitResult("", listen, "", "", "")
            if r.port is None:
                raise RuntimeError(f"{listen!r} does not have a valid port number.")
            host, port = r.hostname or "0.0.0.0", r.port  # noqa: S104
        if options["tls_cert"] and options["tls_key"]:
            tls_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
            tls_context.load_cert_chain(options["tls_cert"], options["tls_key"])
        else:
            tls_context = None

        run_smtp_server(options["user"], options["group"], host, port, tls_context)
```

--------------------------------------------------------------------------------

---[FILE: enqueue_digest_emails.py]---
Location: zulip-main/zerver/management/commands/enqueue_digest_emails.py
Signals: Django

```python
import logging
from datetime import timedelta
from typing import Any

from django.conf import settings
from django.utils.timezone import now as timezone_now
from typing_extensions import override

from zerver.lib.digest import DIGEST_CUTOFF, enqueue_emails
from zerver.lib.logging_util import log_to_file
from zerver.lib.management import ZulipBaseCommand, abort_unless_locked

## Logging setup ##
logger = logging.getLogger(__name__)
log_to_file(logger, settings.DIGEST_LOG_PATH)


class Command(ZulipBaseCommand):
    help = """Enqueue digest emails for users that haven't checked the app
in a while.
"""

    @override
    @abort_unless_locked
    def handle(self, *args: Any, **options: Any) -> None:
        cutoff = timezone_now() - timedelta(days=DIGEST_CUTOFF)
        enqueue_emails(cutoff)
```

--------------------------------------------------------------------------------

---[FILE: enqueue_file.py]---
Location: zulip-main/zerver/management/commands/enqueue_file.py

```python
import sys
from argparse import ArgumentParser
from typing import IO, Any

import orjson
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand
from zerver.lib.queue import queue_json_publish_rollback_unsafe


def error(*args: Any) -> None:
    raise Exception("We cannot enqueue because settings.USING_RABBITMQ is False.")


def enqueue_file(queue_name: str, f: IO[str]) -> None:
    for line in f:
        line = line.strip()
        try:
            payload = line.split("\t")[1]
        except IndexError:
            payload = line

        print(f"Queueing to queue {queue_name}: {payload}")

        # Verify that payload is valid json.
        data = orjson.loads(payload)

        # This is designed to use the `error` method rather than
        # the call_consume_in_tests flow.
        queue_json_publish_rollback_unsafe(queue_name, data, error)


class Command(ZulipBaseCommand):
    help = """Read JSON lines from a file and enqueue them to a worker queue.

Each line in the file should either be a JSON payload or two tab-separated
fields, the second of which is a JSON payload.  (The latter is to accommodate
the format of error files written by queue workers that catch exceptions--their
first field is a timestamp that we ignore.)

You can use "-" to represent stdin.
"""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "queue_name", metavar="<queue>", help="name of worker queue to enqueue to"
        )
        parser.add_argument(
            "file_name", metavar="<file>", help="name of file containing JSON lines"
        )

    @override
    def handle(self, *args: Any, **options: str) -> None:
        queue_name = options["queue_name"]
        file_name = options["file_name"]

        if file_name == "-":
            enqueue_file(queue_name, sys.stdin)
        else:
            with open(file_name) as f:
                enqueue_file(queue_name, f)
```

--------------------------------------------------------------------------------

````
