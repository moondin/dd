---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 927
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 927 of 1290)

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

---[FILE: export.py]---
Location: zulip-main/zerver/management/commands/export.py
Signals: Django

```python
import os
import tempfile
from argparse import ArgumentParser
from typing import Any

from django.conf import settings
from django.core.management.base import CommandError
from django.utils.timezone import now as timezone_now
from typing_extensions import override

from zerver.actions.realm_settings import do_deactivate_realm
from zerver.lib.export import export_realm_wrapper
from zerver.lib.management import ZulipBaseCommand
from zerver.models import RealmExport


class Command(ZulipBaseCommand):
    help = """Exports all data from a Zulip realm

    This command exports all significant data from a Zulip realm.  The
    result can be imported using the `./manage.py import` command.

    Things that are exported:
    * All user-accessible data in the Zulip database (Messages,
      Streams, UserMessages, RealmEmoji, etc.)
    * Copies of all uploaded files and avatar images along with
      metadata needed to restore them even in the ab

    Things that are not exported:
    * Confirmation and PreregistrationUser (transient tables)
    * Sessions (everyone will need to log in again post-export)
    * Users' passwords and API keys (users will need to use SSO or reset password)
    * Mobile tokens for APNS/GCM (users will need to reconnect their mobile devices)
    * ScheduledEmail (not relevant on a new server)
    * RemoteZulipServer (unlikely to be migrated)
    * third_party_api_results cache (this means rerendering all old
      messages could be expensive)

    Things that will break as a result of the export:
    * Passwords will not be transferred.  They will all need to go
      through the password reset flow to obtain a new password (unless
      they intend to only use e.g. Google auth).
    * Users will need to log out and re-log in to the Zulip desktop and
      mobile apps.  The apps now all have an option on the login page
      where you can specify which Zulip server to use; your users
      should enter <domain name>.
    * All bots will stop working since they will be pointing to the
      wrong server URL, and all users' API keys have been rotated as
      part of the migration.  So to re-enable your integrations, you
      will need to direct your integrations at the new server.
      Usually this means updating the URL and the bots' API keys.  You
      can see a list of all the bots that have been configured for
      your realm on the `/#organization` page, and use that list to
      make sure you migrate them all.

    The proper procedure for using this to export a realm is as follows:

    * Use `./manage.py export --deactivate` to deactivate and export
      the realm, producing a data tarball.

    * Transfer the tarball to the new server and unpack it.

    * Use `./manage.py import` to import the realm

    * Inform the users about the things broken above.

    We recommend testing by exporting without `--deactivate` first, to
    make sure you have the procedure right and minimize downtime.

    Performance: In one test, the tool exported a realm with hundreds
    of users and ~1M messages of history with --parallel=1 in about 3
    hours of serial runtime (goes down to ~50m with --parallel=6 on a
    machine with 8 CPUs).  Importing that same data set took about 30
    minutes.  But this will vary a lot depending on the average number
    of recipients of messages in the realm, hardware, etc."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "--output", dest="output_dir", help="Directory to write exported data to."
        )
        parser.add_argument(
            "--parallel",
            default=settings.DEFAULT_DATA_EXPORT_IMPORT_PARALLELISM,
            help="Processes to use in exporting UserMessage objects in parallel",
        )
        parser.add_argument(
            "--public-only",
            action="store_true",
            help="Export only public stream messages and associated attachments",
        )
        parser.add_argument(
            "--deactivate-realm",
            action="store_true",
            help=(
                "Deactivate the realm immediately before exporting; the exported data "
                "will show the realm as active"
            ),
        )
        parser.add_argument(
            "--export-full-with-consent",
            action="store_true",
            help="Whether to export private data of users who consented",
        )
        parser.add_argument(
            "--upload",
            action="store_true",
            help="Whether to upload resulting tarball to s3 or LOCAL_UPLOADS_DIR",
        )
        self.add_realm_args(parser, required=True)

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        realm = self.get_realm(options)
        assert realm is not None  # Should be ensured by parser

        output_dir = options["output_dir"]
        public_only = options["public_only"]
        export_full_with_consent = options["export_full_with_consent"]
        assert not (public_only and export_full_with_consent)

        print(f"\033[94mExporting realm\033[0m: {realm.string_id}")

        processes = int(options["parallel"])
        if processes < 1:
            raise CommandError("You must have at least one process.")

        if public_only and export_full_with_consent:
            raise CommandError("Please pass either --public-only or --export-full-with-consennt")

        if options["deactivate_realm"] and realm.deactivated:
            raise CommandError(f"The realm {realm.string_id} is already deactivated.  Aborting...")

        if output_dir is None:
            output_dir = tempfile.mkdtemp(prefix="zulip-export-")
        else:
            output_dir = os.path.realpath(os.path.expanduser(output_dir))
            if os.path.exists(output_dir):
                if os.listdir(output_dir):
                    raise CommandError(
                        f"Refusing to overwrite nonempty directory: {output_dir}. Aborting...",
                    )
            else:
                os.makedirs(output_dir)

        tarball_path = output_dir.rstrip("/") + ".tar.gz"
        try:
            with open(tarball_path, "x"):
                pass
        except FileExistsError:
            raise CommandError(
                f"Refusing to overwrite existing tarball: {tarball_path}. Aborting..."
            )

        if options["deactivate_realm"]:
            print(f"\033[94mDeactivating realm\033[0m: {realm.string_id}")
            do_deactivate_realm(
                realm,
                acting_user=None,
                deactivation_reason="self_hosting_migration",
                email_owners=False,
            )

        def percent_callback(bytes_transferred: Any) -> None:
            print(end=".", flush=True)

        if public_only:
            export_type = RealmExport.EXPORT_PUBLIC
        elif export_full_with_consent:
            export_type = RealmExport.EXPORT_FULL_WITH_CONSENT
        else:
            export_type = RealmExport.EXPORT_FULL_WITHOUT_CONSENT

        export_row = RealmExport.objects.create(
            realm=realm,
            type=export_type,
            acting_user=None,
            status=RealmExport.REQUESTED,
            date_requested=timezone_now(),
        )

        # Allows us to trigger exports separately from command line argument parsing
        export_realm_wrapper(
            export_row=export_row,
            output_dir=output_dir,
            processes=processes,
            upload=options["upload"],
            percent_callback=percent_callback,
            export_as_active=True if options["deactivate_realm"] else None,
        )
```

--------------------------------------------------------------------------------

---[FILE: export_search.py]---
Location: zulip-main/zerver/management/commands/export_search.py
Signals: Django

```python
import csv
import os
import queue
import shutil
from argparse import ArgumentParser
from collections.abc import Iterator
from datetime import datetime, timezone
from email.headerregistry import Address
from functools import lru_cache, reduce
from operator import or_
from threading import Lock, Thread
from typing import Any, NoReturn, Union

from django.conf import settings
from django.core.management.base import CommandError
from django.db.models import Q
from typing_extensions import override

from zerver.lib.export import orjson_stream
from zerver.lib.management import ZulipBaseCommand
from zerver.lib.soft_deactivation import reactivate_user_if_soft_deactivated
from zerver.lib.upload import save_attachment_contents
from zerver.models import AbstractUserMessage, Message, Recipient, Stream, UserProfile
from zerver.models.recipients import get_direct_message_group, get_or_create_direct_message_group
from zerver.models.streams import get_stream
from zerver.models.users import get_user_by_delivery_email

check_lock = Lock()
download_queue: queue.Queue[str] = queue.Queue()
BATCH_SIZE = 1000


def write_attachment(base_path: str, path_id: str, file_lock: Union["Lock", None] = None) -> None:
    dir_path_id = os.path.dirname(path_id)
    assert "../" not in dir_path_id
    os.makedirs(base_path + "/" + dir_path_id, exist_ok=True)
    with open(base_path + "/" + path_id, "wb") as attachment_file:
        if file_lock:
            file_lock.release()
        save_attachment_contents(path_id, attachment_file)


def download_worker(base_path: str) -> NoReturn:
    while True:
        path_id = download_queue.get()

        check_lock.acquire()
        if os.path.exists(base_path + "/" + path_id):
            check_lock.release()
            download_queue.task_done()
            continue

        print(f"({download_queue.qsize()} Downloading {path_id}")
        write_attachment(base_path, path_id, check_lock)
        download_queue.task_done()


class Command(ZulipBaseCommand):
    help = """Exports the messages matching certain search terms, or from
senders/recipients.

This is most often used for legal compliance.
"""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        self.add_realm_args(parser, required=True)
        parser.add_argument(
            "--output",
            metavar="<path>",
            help="File to output JSON/CSV results to; it must not exist, unless --force is given",
            required=True,
        )
        parser.add_argument(
            "--write-attachments",
            metavar="<directory>",
            help="If provided, export all referenced attachments into the directory",
        )
        parser.add_argument(
            "--force", action="store_true", help="Overwrite the output file if it exists already"
        )
        parser.add_argument("--threads", default=5, type=int)

        parser.add_argument(
            "--file",
            metavar="<path>",
            help="Read search terms from the named file, one per line",
        )
        parser.add_argument(
            "search_terms",
            nargs="*",
            metavar="<search term>",
            help="Terms to search for in message body or topic",
        )
        parser.add_argument(
            "--after",
            metavar="<datetime>",
            help="Limit to messages on or after this ISO datetime, treated as UTC",
            type=lambda s: datetime.fromisoformat(s).astimezone(timezone.utc),
        )
        parser.add_argument(
            "--before",
            metavar="<datetime>",
            help="Limit to messages on or before this ISO datetime, treated as UTC",
            type=lambda s: datetime.fromisoformat(s).astimezone(timezone.utc),
        )
        source_dest = parser.add_mutually_exclusive_group()

        source_dest.add_argument(
            "--sender",
            action="append",
            metavar="<email>",
            help="Limit to messages sent by users with any of these emails (may be specified more than once)",
        )
        source_dest.add_argument(
            "--recipient",
            action="append",
            metavar="<email>",
            help="Limit to messages received by users with any of these emails (may be specified more than once).  This is a superset of --sender, since senders receive every message they send.",
        )
        source_dest.add_argument(
            "--dm",
            action="append",
            metavar="<email>",
            help="Limit to messages in a DM between all of the users provided.",
        )
        source_dest.add_argument(
            "--channel",
            action="append",
            metavar="<channel-name>",
            help="Limit to messages in the given channel.",
        )

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        terms = set()
        if options["file"]:
            with open(options["file"]) as f:
                terms.update(f.read().splitlines())
        terms.update(options["search_terms"])

        if (
            not terms
            and not options["before"]
            and not options["after"]
            and not options["sender"]
            and not options["recipient"]
            and not options["dm"]
            and not options["channel"]
        ):
            raise CommandError("One or more limits are required!")

        if not options["output"].endswith((".json", ".csv")):
            raise CommandError(
                "Unknown file format: {options['output']}  Only .csv and .json are supported"
            )

        if os.path.exists(options["output"]) and not options["force"]:
            raise CommandError(
                f"Output path '{options['output']}' already exists; use --force to overwrite"
            )

        if options["write_attachments"] and os.path.exists(options["write_attachments"]):
            if not options["force"]:
                raise CommandError(
                    f"Attachments output path '{options['write_attachments']}' already exists; use --force to overwrite"
                )
            shutil.rmtree(options["write_attachments"])

        realm = self.get_realm(options)
        assert realm is not None
        need_distinct = False
        usermessage_joined = False
        limits = Q()

        limits = reduce(
            or_,
            [
                Q(content__icontains=term) | Q(is_channel_message=True, subject__icontains=term)
                for term in terms
            ],
            limits,
        )

        if options["after"]:
            limits &= Q(date_sent__gt=options["after"])
        if options["before"]:
            limits &= Q(date_sent__lt=options["before"])
        if options["recipient"]:
            user_profiles = [get_user_by_delivery_email(e, realm) for e in options["recipient"]]
            for user_profile in user_profiles:
                # Users need to not be long-term idle for the
                # UserMessages to be a judge of which messages they
                # received.
                reactivate_user_if_soft_deactivated(user_profile)
            limits &= Q(
                usermessage__user_profile_id__in=[user_profile.id for user_profile in user_profiles]
            )
            need_distinct = len(user_profiles) > 1
            usermessage_joined = True
        elif options["sender"]:
            limits &= reduce(
                or_,
                [Q(sender__delivery_email__iexact=e) for e in options["sender"]],
            )
        elif options["dm"]:
            user_profiles = [get_user_by_delivery_email(e, realm) for e in options["dm"]]
            for user_profile in user_profiles:
                reactivate_user_if_soft_deactivated(user_profile)
            if len(user_profiles) == 1:
                limits &= Q(
                    usermessage__user_profile_id=user_profiles[0].id,
                    usermessage__flags__andnz=AbstractUserMessage.flags.is_private.mask,
                )
                usermessage_joined = True
            elif len(user_profiles) == 2:
                user_a, user_b = user_profiles
                direct_message_group = get_direct_message_group(id_list=[user_a.id, user_b.id])
                if direct_message_group and settings.PREFER_DIRECT_MESSAGE_GROUP:
                    limits &= Q(recipient=direct_message_group.recipient)
                else:
                    limits &= Q(recipient=user_a.recipient, sender=user_b) | Q(
                        recipient=user_b.recipient, sender=user_a
                    )
            else:
                direct_message_group = get_or_create_direct_message_group(
                    [user.id for user in user_profiles]
                )
                limits &= Q(recipient=direct_message_group.recipient)
        elif options["channel"]:
            channels = [get_stream(n.lstrip("#"), realm) for n in options["channel"]]
            limits &= Q(recipient__in=[s.recipient_id for s in channels])

        messages_query = (
            Message.objects.filter(limits, realm=realm)
            .select_related("sender")
            .only(
                "id",
                "date_sent",
                "sender__full_name",
                "sender__delivery_email",
                "recipient_id",
                "subject",
                "content",
                "edit_history",
                "has_attachment",
            )
            .order_by("id")
        )
        if need_distinct:
            messages_query = messages_query.distinct("id")

        if options["write_attachments"]:
            for i in range(options["threads"]):
                Thread(
                    target=download_worker, daemon=True, args=(options["write_attachments"],)
                ).start()

        @lru_cache(maxsize=1000)
        def format_sender(full_name: str, delivery_email: str) -> str:
            return str(Address(display_name=full_name, addr_spec=delivery_email))

        def format_full_recipient(recipient_id: int, subject: str) -> str:
            recip_str, has_subject = format_recipient(recipient_id)
            if not has_subject:
                return recip_str
            return f"{recip_str} > {subject}"

        @lru_cache(maxsize=1000)
        def format_recipient(recipient_id: int) -> tuple[str, bool]:
            recipient = Recipient.objects.get(id=recipient_id)

            if recipient.type == Recipient.STREAM:
                stream = Stream.objects.values("name").get(id=recipient.type_id)
                return "#" + stream["name"], True

            users = (
                UserProfile.objects.filter(
                    subscription__recipient_id=recipient.id,
                )
                .order_by("full_name")
                .values_list("full_name", "delivery_email")
            )

            return ", ".join(format_sender(e[0], e[1]) for e in users), False

        def transform_message(message: Message) -> dict[str, str]:
            row = {
                "id": str(message.id),
                "timestamp (UTC)": message.date_sent.astimezone(timezone.utc)
                .replace(tzinfo=None)
                .isoformat(" ", "seconds"),
                "sender": format_sender(message.sender.full_name, message.sender.delivery_email),
                "recipient": format_full_recipient(message.recipient_id, message.subject),
                "content": message.content,
                "edit history": message.edit_history if message.edit_history is not None else "",
            }
            if options["write_attachments"]:
                if message.has_attachment:
                    attachments = message.attachment_set.all()
                    row["attachments"] = " ".join(a.path_id for a in attachments)
                    for attachment in attachments:
                        download_queue.put(attachment.path_id)
                else:
                    row["attachments"] = ""
            return row

        def chunked_results() -> Iterator[dict[str, str]]:
            min_id = 0
            while True:
                batch_query = messages_query.filter(id__gt=min_id)
                if usermessage_joined:
                    batch_query = batch_query.extra(
                        where=["zerver_usermessage.message_id > %s"], params=[min_id]
                    )
                batch = [transform_message(m) for m in batch_query[:BATCH_SIZE]]
                if len(batch) == 0:
                    break
                min_id = int(batch[-1]["id"])
                print(".")
                yield from batch

        print("Exporting messages...")
        if options["output"].endswith(".json"):
            with open(options["output"], "wb") as json_file:
                json_file.writelines(orjson_stream(chunked_results()))
        elif options["output"].endswith(".csv"):
            with open(options["output"], "w") as csv_file:
                columns = [
                    "id",
                    "timestamp (UTC)",
                    "sender",
                    "recipient",
                    "content",
                    "edit history",
                ]

                if options["write_attachments"]:
                    columns += ["attachments"]
                csvwriter = csv.DictWriter(csv_file, columns)
                csvwriter.writeheader()
                csvwriter.writerows(chunked_results())
        download_queue.join()
```

--------------------------------------------------------------------------------

---[FILE: export_single_user.py]---
Location: zulip-main/zerver/management/commands/export_single_user.py
Signals: Django

```python
import os
import subprocess
import tempfile
from argparse import ArgumentParser
from typing import Any

from django.core.management.base import CommandError
from typing_extensions import override

from zerver.lib.export import do_export_user
from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    help = """Exports message data from a Zulip user

    This command exports the message history for a single Zulip user.

    Note that this only exports the user's message history and
    realm-public metadata needed to understand it; it does nothing
    with (for example) any bots owned by the user."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("email", metavar="<email>", help="email of user to export")
        parser.add_argument(
            "--output", dest="output_dir", help="Directory to write exported data to."
        )
        self.add_realm_args(parser)

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        realm = self.get_realm(options)
        user_profile = self.get_user(options["email"], realm)

        output_dir = options["output_dir"]
        if output_dir is None:
            output_dir = tempfile.mkdtemp(prefix="zulip-export-")
        else:
            output_dir = os.path.abspath(output_dir)
            if os.path.exists(output_dir) and os.listdir(output_dir):
                raise CommandError(
                    f"Refusing to overwrite nonempty directory: {output_dir}. Aborting...",
                )
            else:
                os.makedirs(output_dir)

        print(f"Exporting user {user_profile.delivery_email}")
        do_export_user(user_profile, output_dir)
        print(f"Finished exporting to {output_dir}; tarring")
        tarball_path = output_dir.rstrip("/") + ".tar.gz"
        subprocess.check_call(
            [
                "tar",
                f"-czf{tarball_path}",
                f"-C{os.path.dirname(output_dir)}",
                os.path.basename(output_dir),
            ]
        )
        print(f"Tarball written to {tarball_path}")
```

--------------------------------------------------------------------------------

---[FILE: fetch_tor_exit_nodes.py]---
Location: zulip-main/zerver/management/commands/fetch_tor_exit_nodes.py
Signals: Django

```python
import os
from argparse import ArgumentParser
from typing import Any

import orjson
from django.conf import settings
from typing_extensions import override
from urllib3.util import Retry

from zerver.lib.management import ZulipBaseCommand, abort_cron_during_deploy
from zerver.lib.outgoing_http import OutgoingSession


class TorDataSession(OutgoingSession):
    def __init__(self, max_retries: int) -> None:
        Retry.DEFAULT_BACKOFF_MAX = 64
        retry = Retry(
            total=max_retries,
            backoff_factor=2.0,
            status_forcelist={  # Retry on these
                429,  # The formal rate-limiting response code
                500,  # Server error
                502,  # Bad gateway
                503,  # Service unavailable
            },
        )
        super().__init__(role="tor_data", timeout=3, max_retries=retry)


class Command(ZulipBaseCommand):
    help = """Fetch the list of TOR exit nodes, and write the list of IP addresses
to a file for access from Django for rate-limiting purposes.

Does nothing unless RATE_LIMIT_TOR_TOGETHER is enabled.
"""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "--max-retries",
            type=int,
            default=10,
            help="Number of times to retry fetching data from TOR",
        )

    @override
    @abort_cron_during_deploy
    def handle(self, *args: Any, **options: Any) -> None:
        if not settings.RATE_LIMIT_TOR_TOGETHER:
            return

        session = TorDataSession(max_retries=options["max_retries"])
        response = session.get("https://check.torproject.org/exit-addresses")
        response.raise_for_status()

        # Format:
        #     ExitNode 4273E6D162ED2717A1CF4207A254004CD3F5307B
        #     Published 2021-11-02 11:01:07
        #     LastStatus 2021-11-02 23:00:00
        #     ExitAddress 176.10.99.200 2021-11-02 23:17:02
        exit_nodes: set[str] = set()
        for line in response.text.splitlines():
            if line.startswith("ExitAddress "):
                exit_nodes.add(line.split()[1])

        # Write to a tmpfile to ensure we can't read a partially-written file
        with open(settings.TOR_EXIT_NODE_FILE_PATH + ".tmp", "wb") as f:
            f.write(orjson.dumps(list(exit_nodes)))

        # Do an atomic rename into place
        os.rename(
            settings.TOR_EXIT_NODE_FILE_PATH + ".tmp",
            settings.TOR_EXIT_NODE_FILE_PATH,
        )
```

--------------------------------------------------------------------------------

---[FILE: fill_memcached_caches.py]---
Location: zulip-main/zerver/management/commands/fill_memcached_caches.py

```python
from argparse import ArgumentParser
from typing import Any

from typing_extensions import override

from zerver.lib.cache_helpers import cache_fillers, fill_remote_cache
from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "--cache", help="Populate one specific cache", choices=cache_fillers.keys()
        )

    @override
    def handle(self, *args: Any, **options: str | None) -> None:
        if options["cache"] is not None:
            fill_remote_cache(options["cache"])
            return

        for cache in cache_fillers:
            fill_remote_cache(cache)
```

--------------------------------------------------------------------------------

---[FILE: generate_realm_creation_link.py]---
Location: zulip-main/zerver/management/commands/generate_realm_creation_link.py
Signals: Django

```python
from typing import Any

from django.core.management.base import CommandError
from django.db import ProgrammingError
from typing_extensions import override

from confirmation.models import generate_realm_creation_url
from zerver.lib.management import ZulipBaseCommand
from zerver.models import Realm


class Command(ZulipBaseCommand):
    help = """
    Outputs a randomly generated, 1-time-use link for Organization creation.
    Whoever visits the link can create a new organization on this server, regardless of whether
    settings.OPEN_REALM_CREATION is enabled. The link would expire automatically after
    settings.CAN_CREATE_REALM_LINK_VALIDITY_DAYS.

    Usage: ./manage.py generate_realm_creation_link """

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        try:
            # first check if the db has been initialized
            Realm.objects.first()
        except ProgrammingError:
            raise CommandError(
                "The Zulip database does not appear to exist. Have you run initialize-database?"
            )

        url = generate_realm_creation_url(by_admin=True)
        self.stdout.write(
            self.style.SUCCESS(
                "Please visit the following secure single-use link to register your "
            )
        )
        self.stdout.write(self.style.SUCCESS("new Zulip organization:\033[0m"))
        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS(f"    \033[1;92m{url}\033[0m"))
        self.stdout.write("")
```

--------------------------------------------------------------------------------

---[FILE: get_migration_status.py]---
Location: zulip-main/zerver/management/commands/get_migration_status.py
Signals: Django

```python
import argparse
import os
from typing import Any

from django.db import DEFAULT_DB_ALIAS
from typing_extensions import override

from scripts.lib.zulip_tools import get_dev_uuid_var_path
from zerver.lib.management import ZulipBaseCommand
from zerver.lib.migration_status import get_migration_status


class Command(ZulipBaseCommand):
    help = "Get status of migrations."

    @override
    def add_arguments(self, parser: argparse.ArgumentParser) -> None:
        parser.add_argument(
            "app_label", nargs="?", help="App label of an application to synchronize the state."
        )

        parser.add_argument(
            "--database",
            default=DEFAULT_DB_ALIAS,
            help='Nominates a database to synchronize. Defaults to the "default" database.',
        )

        parser.add_argument("--output", help="Path to store the status to (default to stdout).")

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        result = get_migration_status(**options)
        if options["output"] is not None:
            uuid_var_path = get_dev_uuid_var_path()
            path = os.path.join(uuid_var_path, options["output"])
            with open(path, "w") as f:
                f.write(result)
        else:
            self.stdout.write(result)
```

--------------------------------------------------------------------------------

---[FILE: import.py]---
Location: zulip-main/zerver/management/commands/import.py
Signals: Django

```python
# noqa: N999

import argparse
import os
import subprocess
from typing import Any

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.management import call_command
from django.core.management.base import CommandError, CommandParser
from typing_extensions import override

from zerver.forms import OverridableValidationError, check_subdomain_available
from zerver.lib.import_realm import do_import_realm
from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    help = """Import extracted Zulip database dump directories into a fresh Zulip instance.

This command should be used only on a newly created, empty Zulip instance to
import a database dump from one or more JSON files."""

    @override
    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument(
            "--destroy-rebuild-database",
            action="store_true",
            help="Destroys and rebuilds the databases prior to import.",
        )

        parser.add_argument(
            "--import-into-nonempty",
            action="store_true",
            help="Import into an existing nonempty database.",
        )

        parser.add_argument(
            "--allow-reserved-subdomain",
            action="store_true",
            help="Allow use of reserved subdomains",
        )

        parser.add_argument("subdomain", metavar="<subdomain>", help="Subdomain")

        parser.add_argument(
            "export_paths",
            nargs="+",
            metavar="<export path>",
            help="list of export directories to import",
        )
        parser.add_argument(
            "--processes",
            default=settings.DEFAULT_DATA_EXPORT_IMPORT_PARALLELISM,
            help="Number of processes to use for uploading Avatars to S3 in parallel",
        )
        parser.formatter_class = argparse.RawTextHelpFormatter

    def do_destroy_and_rebuild_database(self, db_name: str) -> None:
        call_command("flush", verbosity=0, skip_checks=True, interactive=False)
        subprocess.check_call([os.path.join(settings.DEPLOY_ROOT, "scripts/setup/flush-memcached")])

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        num_processes = int(options["processes"])
        if num_processes < 1:
            raise CommandError("You must have at least one process.")

        subdomain = options["subdomain"]

        if options["destroy_rebuild_database"]:
            print("Rebuilding the database!")
            db_name = settings.DATABASES["default"]["NAME"]
            self.do_destroy_and_rebuild_database(db_name)
        elif options["import_into_nonempty"]:
            print("NOTE: The argument 'import_into_nonempty' is now the default behavior.")

        allow_reserved_subdomain = False

        if options["allow_reserved_subdomain"]:
            allow_reserved_subdomain = True

        try:
            check_subdomain_available(subdomain, allow_reserved_subdomain)
        except OverridableValidationError as e:
            raise CommandError(
                e.messages[0]
                + "\nPass --allow-reserved-subdomain to override subdomain restrictions."
            )
        except ValidationError as e:
            raise CommandError(e.messages[0])

        paths = []
        for path in options["export_paths"]:
            path = os.path.realpath(os.path.expanduser(path))
            if not os.path.exists(path):
                raise CommandError(f"Directory not found: '{path}'")
            if not os.path.isdir(path):
                raise CommandError(
                    "Export file should be folder; if it's a tarball, please unpack it first."
                )
            paths.append(path)

        for path in paths:
            print(f"Processing dump: {path} ...")
            do_import_realm(path, subdomain, num_processes)
```

--------------------------------------------------------------------------------

---[FILE: list_realms.py]---
Location: zulip-main/zerver/management/commands/list_realms.py

```python
import sys
from argparse import ArgumentParser
from typing import Any

from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand
from zerver.models import Realm


class Command(ZulipBaseCommand):
    help = """List realms in the server and it's configuration settings(optional).

Usage examples:

./manage.py list_realms
./manage.py list_realms --all"""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "--all", action="store_true", help="Print all the configuration settings of the realms."
        )

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        realms = Realm.objects.all()

        outer_format = "{:<5} {:<20} {!s:<30} {:<50}"
        inner_format = "{:<40} {}"
        deactivated = False

        if not options["all"]:
            print(outer_format.format("id", "string_id", "name", "domain"))
            print(outer_format.format("--", "---------", "----", "------"))

            for realm in realms:
                display_string_id = realm.string_id if realm.string_id != "" else "''"
                if realm.deactivated:
                    print(
                        self.style.ERROR(
                            outer_format.format(realm.id, display_string_id, realm.name, realm.url)
                        )
                    )
                    deactivated = True
                else:
                    print(outer_format.format(realm.id, display_string_id, realm.name, realm.url))
            if deactivated:
                print(self.style.WARNING("\nRed rows represent deactivated realms."))
            sys.exit(0)

        # The remaining code path is the --all case.
        identifier_attributes = ["id", "name", "string_id"]
        for realm in realms:
            # Start with just all the fields on the object, which is
            # hacky but doesn't require any work to maintain.
            realm_dict = vars(realm).copy()
            # Remove a field that is confusingly useless
            del realm_dict["_state"]

            # This is not an attribute of realm strictly speaking, but valuable info to include.
            realm_dict["authentication_methods"] = str(realm.authentication_methods_dict())

            for key in identifier_attributes:
                if realm.deactivated:
                    print(self.style.ERROR(inner_format.format(key, realm_dict[key])))
                    deactivated = True
                else:
                    print(inner_format.format(key, realm_dict[key]))

            for key, value in sorted(realm_dict.items()):
                if key not in identifier_attributes:
                    if realm.deactivated:
                        print(self.style.ERROR(inner_format.format(key, value)))
                    else:
                        print(inner_format.format(key, value))
            print("-" * 80)

        if deactivated:
            print(self.style.WARNING("\nRed is used to highlight deactivated realms."))
```

--------------------------------------------------------------------------------

---[FILE: logout_all_users.py]---
Location: zulip-main/zerver/management/commands/logout_all_users.py
Signals: Django

```python
from argparse import ArgumentParser
from typing import Any

from django.db.models import Q
from typing_extensions import override

from zerver.actions.user_settings import bulk_regenerate_api_keys
from zerver.lib.management import ZulipBaseCommand
from zerver.lib.sessions import (
    delete_all_deactivated_user_sessions,
    delete_all_user_sessions,
    delete_realm_user_sessions,
)
from zerver.models import UserProfile


class Command(ZulipBaseCommand):
    help = """\
Log out all users from active browser sessions.

Does not disable API keys, and thus will not log users out of the
mobile apps.
"""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "--deactivated-only",
            action="store_true",
            help="Only log out all users who are deactivated",
        )
        parser.add_argument(
            "--rotate-api-keys",
            action="store_true",
            help="Also rotate API keys of the affected users",
        )
        self.add_realm_args(parser, help="Only log out all users in a particular realm")

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        realm = self.get_realm(options)
        rotate_api_keys = options["rotate_api_keys"]
        if realm:
            delete_realm_user_sessions(realm)
            regenerate_api_key_queryset = UserProfile.objects.filter(realm=realm).values_list(
                "id", flat=True
            )
        elif options["deactivated_only"]:
            delete_all_deactivated_user_sessions()
            regenerate_api_key_queryset = UserProfile.objects.filter(
                Q(is_active=False) | Q(realm__deactivated=True)
            ).values_list("id", flat=True)
        else:
            delete_all_user_sessions()
            regenerate_api_key_queryset = UserProfile.objects.values_list("id", flat=True)

        if rotate_api_keys:
            bulk_regenerate_api_keys(regenerate_api_key_queryset)
```

--------------------------------------------------------------------------------

````
