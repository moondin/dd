---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 929
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 929 of 1290)

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

---[FILE: reset_authentication_attempt_count.py]---
Location: zulip-main/zerver/management/commands/reset_authentication_attempt_count.py
Signals: Django

```python
from argparse import ArgumentParser
from typing import Any

from django.core.management.base import CommandError
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand
from zproject.backends import RateLimitedAuthenticationByUsername


class Command(ZulipBaseCommand):
    help = """Reset the rate limit for authentication attempts for username."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("-u", "--username", help="Username to reset the rate limit for.")

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        if not options["username"]:
            self.print_help("./manage.py", "reset_authentication_attempt_count")
            raise CommandError("Please enter a username")

        username = options["username"]
        RateLimitedAuthenticationByUsername(username).clear_history()
```

--------------------------------------------------------------------------------

---[FILE: restore_messages.py]---
Location: zulip-main/zerver/management/commands/restore_messages.py
Signals: Django

```python
from typing import Any

from django.core.management.base import CommandParser
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand
from zerver.lib.retention import (
    restore_all_data_from_archive,
    restore_data_from_archive,
    restore_data_from_archive_by_realm,
)
from zerver.models import ArchiveTransaction


class Command(ZulipBaseCommand):
    help = """
Restore recently deleted messages from the archive, that
have not been vacuumed (because the time limit of
ARCHIVED_DATA_VACUUMING_DELAY_DAYS has not passed).

Intended primarily for use after against potential bugs in
Zulip's message retention and deletion features.

Examples:
To restore all recently deleted messages:
  ./manage.py restore_messages --all --restore-deleted
To restore a specific ArchiveTransaction:
  ./manage.py restore_messages --transaction-id=1
"""

    @override
    def add_arguments(self, parser: CommandParser) -> None:
        target = parser.add_mutually_exclusive_group(required=True)
        target.add_argument(
            "--all",
            action="store_true",
            help="Restore archived messages from all realms. "
            "(Does not restore manually deleted messages.)",
        )
        parser.add_argument(
            "--restore-deleted",
            action="store_true",
            help="With --all, also restores manually deleted messages.",
        )
        target.add_argument(
            "-t", "--transaction-id", type=int, help="Restore a specific ArchiveTransaction."
        )
        self.add_realm_args(
            target,
            help="Restore archived messages from the specified realm. "
            "(Does not restore manually deleted messages.)",
        )

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        realm = self.get_realm(options)
        if realm:
            restore_data_from_archive_by_realm(realm)
        elif options["transaction_id"]:
            restore_data_from_archive(ArchiveTransaction.objects.get(id=options["transaction_id"]))
        elif options["all"]:
            restore_all_data_from_archive(restore_manual_transactions=options["restore_deleted"])
```

--------------------------------------------------------------------------------

---[FILE: runtornado.py]---
Location: zulip-main/zerver/management/commands/runtornado.py
Signals: Django

```python
import asyncio
import logging
import signal
from contextlib import AsyncExitStack
from typing import Any
from urllib.parse import SplitResult

from asgiref.sync import async_to_sync, sync_to_async
from django.conf import settings
from django.core.management.base import CommandError, CommandParser
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand

if settings.PRODUCTION:
    settings.SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

from zerver.lib.async_utils import NoAutoCreateEventLoopPolicy
from zerver.lib.debug import interactive_debug_listen
from zerver.tornado.application import create_tornado_application, setup_tornado_rabbitmq
from zerver.tornado.descriptors import set_current_port
from zerver.tornado.event_queue import (
    add_client_gc_hook,
    dump_event_queues,
    get_wrapped_process_notification,
    missedmessage_hook,
    setup_event_queue,
)
from zerver.tornado.sharding import notify_tornado_queue_name

if settings.USING_RABBITMQ:
    from zerver.lib.queue import TornadoQueueClient, set_queue_client

asyncio.set_event_loop_policy(NoAutoCreateEventLoopPolicy())


class Command(ZulipBaseCommand):
    help = "Starts a Tornado Web server wrapping Django."

    @override
    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument("--autoreload", action="store_true", help="Enable Tornado autoreload")
        parser.add_argument(
            "--immediate-reloads",
            action="store_true",
            help="Tell web app clients to immediately reload after Tornado starts",
        )
        parser.add_argument(
            "addrport",
            help="[port number or ipaddr:port]",
        )

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        interactive_debug_listen()
        addrport = options["addrport"]
        assert isinstance(addrport, str)

        from tornado import httpserver

        if addrport.isdigit():
            addr, port = "", int(addrport)
        else:
            r = SplitResult("", addrport, "", "", "")
            if r.port is None:
                raise CommandError(f"{addrport!r} does not have a valid port number.")
            addr, port = r.hostname or "", r.port

        if not addr:
            addr = "127.0.0.1"

        if settings.DEBUG:
            logging.basicConfig(
                level=logging.INFO, format="%(asctime)s %(levelname)-8s %(message)s"
            )

        async def inner_run() -> None:
            from django.utils import translation

            loop = asyncio.get_running_loop()
            stop_fut = loop.create_future()

            def stop() -> None:
                if not stop_fut.done():
                    stop_fut.set_result(None)

            def add_signal_handlers() -> None:
                loop.add_signal_handler(signal.SIGINT, stop)
                loop.add_signal_handler(signal.SIGTERM, stop)

            def remove_signal_handlers() -> None:
                loop.remove_signal_handler(signal.SIGINT)
                loop.remove_signal_handler(signal.SIGTERM)

            async with AsyncExitStack() as stack:
                stack.push_async_callback(
                    sync_to_async(remove_signal_handlers, thread_sensitive=True)
                )
                await sync_to_async(add_signal_handlers, thread_sensitive=True)()

                set_current_port(port)
                translation.activate(settings.LANGUAGE_CODE)

                if settings.CUSTOM_DEVELOPMENT_SETTINGS:
                    print("Using custom settings from zproject/custom_dev_settings.py.")

                # We pass display_num_errors=False, since Django will
                # likely display similar output anyway.
                if not options["skip_checks"]:
                    self.check(display_num_errors=False)
                print(f"Tornado server (re)started on port {port}")

                if settings.USING_RABBITMQ:
                    queue_client = TornadoQueueClient()
                    set_queue_client(queue_client)
                    # Process notifications received via RabbitMQ
                    queue_name = notify_tornado_queue_name(port)
                    stack.callback(queue_client.close)
                    queue_client.start_json_consumer(
                        queue_name, get_wrapped_process_notification(queue_name)
                    )

                # Application is an instance of Django's standard wsgi handler.
                application = create_tornado_application(autoreload=options["autoreload"])

                # start tornado web server in single-threaded mode
                http_server = httpserver.HTTPServer(application, xheaders=True)
                stack.push_async_callback(http_server.close_all_connections)
                stack.callback(http_server.stop)
                http_server.listen(port, address=addr)

                from zerver.tornado.ioloop_logging import logging_data

                logging_data["port"] = str(port)
                send_reloads = options.get("immediate_reloads", False)
                await setup_event_queue(http_server, port, send_reloads)
                stack.callback(dump_event_queues, port)
                add_client_gc_hook(missedmessage_hook)
                if settings.USING_RABBITMQ:
                    setup_tornado_rabbitmq(queue_client)

                await stop_fut

        async_to_sync(inner_run, force_new_loop=True)()
```

--------------------------------------------------------------------------------

---[FILE: runtusd.py]---
Location: zulip-main/zerver/management/commands/runtusd.py
Signals: Django

```python
import os
from typing import Any
from urllib.parse import SplitResult

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError, CommandParser
from typing_extensions import override

from scripts.lib.zulip_tools import get_config, get_config_file


class Command(BaseCommand):
    help = """Starts the tusd server"""

    @override
    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument("listen", help="[Port, or address:port, to bind HTTP server to]")
        local_port = 80
        config_file = get_config_file()
        if get_config(config_file, "application_server", "http_only", False):
            local_port = int(
                get_config(config_file, "application_server", "nginx_listen_port", "80")
            )
        parser.add_argument(
            "hooks_http",
            help="[An HTTP endpoint to which hook events will be sent to]",
            default=f"http://127.0.0.1:{local_port}/api/internal/tusd",
            nargs="?",
        )

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        listen = options["listen"]
        if listen.isdigit():
            addr, port = "127.0.0.1", int(listen)
        else:
            r = SplitResult("", listen, "", "", "")
            if r.port is None:
                raise CommandError(f"{listen!r} does not have a valid port number.")
            addr, port = r.hostname or "127.0.0.1", r.port

        hooks_http = options["hooks_http"]

        # https://tus.github.io/tusd/getting-started/configuration/
        # We do not set a maximum upload size, as the pre-create hooks
        # will set the max size that they want, based on the intended
        # use of the uploaded file.
        tusd_args = [
            "tusd",
            "-base-path=/api/v1/tus/",
            f"-port={port}",
            f"-host={addr}",
            "-behind-proxy",
            f"-hooks-http={hooks_http}",
            "-hooks-http-forward-headers=Cookie,Authorization",
            "--hooks-enabled-events=pre-create,pre-finish,pre-terminate",
            "-disable-download",
            "--show-startup-logs=false",
        ]
        env_vars = os.environ.copy()
        if settings.LOCAL_UPLOADS_DIR is not None:
            assert settings.LOCAL_FILES_DIR is not None
            tusd_args.append(f"-upload-dir={settings.LOCAL_FILES_DIR}")
        elif settings.S3_ENDPOINT_URL in (
            "https://storage.googleapis.com",
            "https://storage.googleapis.com/",
        ):
            tusd_args.append(f"-gcs-bucket={settings.S3_AUTH_UPLOADS_BUCKET}")
            env_vars["GCS_SERVICE_ACCOUNT_FILE"] = "/etc/zulip/gcp_key.json"
        else:
            tusd_args.append(f"-s3-bucket={settings.S3_AUTH_UPLOADS_BUCKET}")
            if settings.S3_ENDPOINT_URL is not None:
                tusd_args.append(f"-s3-endpoint={settings.S3_ENDPOINT_URL}")
            if settings.S3_KEY is not None:
                env_vars["AWS_ACCESS_KEY_ID"] = settings.S3_KEY
            if settings.S3_SECRET_KEY is not None:
                env_vars["AWS_SECRET_ACCESS_KEY"] = settings.S3_SECRET_KEY
            if settings.S3_REGION is not None:
                env_vars["AWS_REGION"] = settings.S3_REGION
            if settings.S3_SKIP_CHECKSUM:
                env_vars["AWS_REQUEST_CHECKSUM_CALCULATION"] = "when_required"
        os.execvpe("tusd", tusd_args, env_vars)
```

--------------------------------------------------------------------------------

---[FILE: scrub_realm.py]---
Location: zulip-main/zerver/management/commands/scrub_realm.py
Signals: Django

```python
from argparse import ArgumentParser
from typing import Any

from django.core.management.base import CommandError
from typing_extensions import override

from zerver.actions.realm_settings import do_scrub_realm
from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    help = """Script to scrub a deactivated realm."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        self.add_realm_args(parser, required=True)

    @override
    def handle(self, *args: Any, **options: str) -> None:
        realm = self.get_realm(options)
        assert realm is not None  # Should be ensured by parser
        if not realm.deactivated:
            raise CommandError(
                f"Realm {options['realm_id']} is active. Please deactivate the realm the first."
            )
        print("Scrubbing", options["realm_id"])
        do_scrub_realm(realm, acting_user=None)
        print("Done!")
```

--------------------------------------------------------------------------------

---[FILE: send_custom_email.py]---
Location: zulip-main/zerver/management/commands/send_custom_email.py
Signals: Django

```python
from argparse import ArgumentParser
from collections.abc import Callable
from typing import Any

import orjson
from django.conf import settings
from django.db.models import Q, QuerySet
from typing_extensions import override

from confirmation.models import one_click_unsubscribe_link
from zerver.lib.management import ZulipBaseCommand
from zerver.lib.send_email import custom_email_sender, send_custom_email, send_custom_server_email
from zerver.models import Realm, UserProfile

if settings.ZILENCER_ENABLED:
    from corporate.lib.stripe import BILLING_SUPPORT_EMAIL
    from zilencer.models import RemoteRealmBillingUser, RemoteServerBillingUser, RemoteZulipServer


class Command(ZulipBaseCommand):
    help = """
    Send a custom email with Zulip branding to the specified users.

    Useful to send a notice to all users of a realm or server.

    The From and Subject headers can be provided in the body of the Markdown
    document used to generate the email, or on the command line."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        targets = parser.add_mutually_exclusive_group(required=True)
        targets.add_argument(
            "--entire-server", action="store_true", help="Send to every user on the server."
        )
        targets.add_argument(
            "--marketing",
            action="store_true",
            help="Send to active users and realm owners with the enable_marketing_emails setting enabled.",
        )
        targets.add_argument(
            "--remote-servers",
            action="store_true",
            help="Send to registered contact email addresses for remote Zulip servers.",
        )
        targets.add_argument(
            "--announce-release",
            metavar="VERSION",
            help="Announce a major or minor release to remote servers.",
        )
        targets.add_argument(
            "--all-sponsored-org-admins",
            action="store_true",
            help="Send to all organization administrators of sponsored organizations.",
        )
        self.add_user_list_args(
            targets,
            help="Email addresses of user(s) to send emails to.",
            all_users_help="Send to every user on the realm.",
        )
        # Realm is only required for --users and --all-users, so it is
        # not mutually exclusive with the rest of the above.
        self.add_realm_args(parser)

        # This is an additional filter on the above.  It ideally would
        # be in the mutually-exclusive set, but we would like to reuse
        # it with --remote-servers
        parser.add_argument(
            "--json-file",
            help="Load the JSON file, and send to the users whose ids are the keys in that dict; "
            "the context for each email will be extended by each value in the dict.",
        )

        # This is an additional filter which is composed with the above
        parser.add_argument(
            "--admins-only",
            help="Filter recipients selected via other options to only organization administrators",
            action="store_true",
        )

        parser.add_argument(
            "--markdown-template-path",
            "--path",
            required=True,
            help="Path to a Markdown-format body for the email.",
        )
        parser.add_argument(
            "--subject",
            help="Subject for the email. It can be declared in Markdown file in headers",
        )
        parser.add_argument(
            "--from-name",
            help="From line for the email. It can be declared in Markdown file in headers",
        )
        parser.add_argument(
            "--from-address",
            help="From email address",
        )
        parser.add_argument("--reply-to", help="Optional reply-to line for the email")

        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Prints emails of the recipients and text of the email.",
        )

    @override
    def handle(
        self, *args: Any, dry_run: bool = False, admins_only: bool = False, **options: str
    ) -> None:
        users: QuerySet[UserProfile] = UserProfile.objects.none()
        add_context: Callable[[dict[str, object], UserProfile], None] | None = None
        distinct_email = False

        if options["remote_servers"]:
            servers = RemoteZulipServer.objects.filter(deactivated=False)
            add_server_context = None
            if options["json_file"]:
                with open(options["json_file"]) as f:
                    server_data: dict[str, dict[str, object]] = orjson.loads(f.read())
                servers = RemoteZulipServer.objects.filter(
                    id__in=[int(server_id) for server_id in server_data]
                )

                def add_server_context_from_dict(
                    context: dict[str, object], server: RemoteZulipServer
                ) -> None:
                    context.update(server_data.get(str(server.id), {}))

                add_server_context = add_server_context_from_dict

            send_custom_server_email(
                servers,
                dry_run=dry_run,
                options=options,
                add_context=add_server_context,
            )
            if dry_run:
                print("Would send the above email to:")
                for server in servers:
                    print(f"  {server.contact_email} ({server.hostname})")
            return
        elif options["announce_release"]:
            server_users = RemoteServerBillingUser.objects.filter(
                is_active=True,
                remote_server__deactivated=False,
            )
            realm_users = RemoteRealmBillingUser.objects.filter(
                is_active=True,
                remote_realm__server__deactivated=False,
                remote_realm__is_system_bot_realm=False,
                remote_realm__registration_deactivated=False,
                remote_realm__realm_deactivated=False,
                remote_realm__realm_locally_deleted=False,
            )
            if options["announce_release"].endswith(".0"):
                server_users = server_users.filter(enable_major_release_emails=True)
                realm_users = realm_users.filter(enable_major_release_emails=True)
            else:
                server_users = server_users.filter(enable_maintenance_release_emails=True)
                realm_users = realm_users.filter(enable_maintenance_release_emails=True)
            # This does an implicit "distinct"
            all_emails = server_users.union(realm_users).values_list("email", flat=True)
            del options["from_address"]
            email_sender, _ = custom_email_sender(
                dry_run=dry_run, from_address=BILLING_SUPPORT_EMAIL, **options
            )

            for email in all_emails:
                email_sender(
                    to_email=email,
                    context={
                        "remote_server_email": True,
                        "released_version": options["announce_release"],
                    },
                )
            if dry_run:
                print("Would send the above email to:")
                for email in all_emails:
                    print(f"  {email}")
            return

        if options["entire_server"]:
            users = UserProfile.objects.filter(
                is_active=True, is_bot=False, is_mirror_dummy=False, realm__deactivated=False
            )
        elif options["marketing"]:
            # Marketing email sent at most once to each email address
            # for users who are recently active (!long_term_idle)
            # users of the product, or who are admins/owners.
            users = UserProfile.objects.filter(
                is_active=True,
                is_bot=False,
                is_mirror_dummy=False,
                realm__deactivated=False,
                enable_marketing_emails=True,
            ).filter(
                Q(long_term_idle=False)
                | Q(
                    role__in=[
                        UserProfile.ROLE_REALM_OWNER,
                        UserProfile.ROLE_REALM_ADMINISTRATOR,
                    ]
                )
            )
            distinct_email = True

            def add_marketing_unsubscribe(context: dict[str, object], user: UserProfile) -> None:
                context["unsubscribe_link"] = one_click_unsubscribe_link(user, "marketing")

            add_context = add_marketing_unsubscribe

        elif options["all_sponsored_org_admins"]:
            # Sends at most one copy to each email address, even if it
            # is an administrator in several organizations.
            sponsored_realms = Realm.objects.filter(
                plan_type=Realm.PLAN_TYPE_STANDARD_FREE, deactivated=False
            )
            admin_roles = [UserProfile.ROLE_REALM_ADMINISTRATOR, UserProfile.ROLE_REALM_OWNER]
            users = UserProfile.objects.filter(
                is_active=True,
                is_bot=False,
                is_mirror_dummy=False,
                role__in=admin_roles,
                realm__deactivated=False,
                realm__in=sponsored_realms,
            )
            distinct_email = True
        else:
            realm = self.get_realm(options)
            users = self.get_users(options, realm, is_bot=False)

        if options["json_file"]:
            with open(options["json_file"]) as f:
                user_data: dict[str, dict[str, object]] = orjson.loads(f.read())
            users = users.filter(id__in=[int(user_id) for user_id in user_data])

            def add_context_from_dict(context: dict[str, object], user: UserProfile) -> None:
                context.update(user_data.get(str(user.id), {}))

            add_context = add_context_from_dict

        if admins_only:
            users = users.filter(
                role__in=[UserProfile.ROLE_REALM_ADMINISTRATOR, UserProfile.ROLE_REALM_OWNER]
            )

        # Only email users who've agreed to the terms of service.
        if settings.TERMS_OF_SERVICE_VERSION is not None:
            users = users.exclude(
                Q(tos_version=None) | Q(tos_version=UserProfile.TOS_VERSION_BEFORE_FIRST_LOGIN)
            )
        users = send_custom_email(
            users,
            dry_run=dry_run,
            options=options,
            add_context=add_context,
            distinct_email=distinct_email,
        )

        if dry_run:
            print("Would send the above email to:")
            for user in users:
                print(f"  {user.delivery_email} ({user.realm.string_id})")
```

--------------------------------------------------------------------------------

---[FILE: send_password_reset_email.py]---
Location: zulip-main/zerver/management/commands/send_password_reset_email.py
Signals: Django

```python
from argparse import ArgumentParser
from typing import Any

from django.core.management.base import CommandError
from django.db.models import QuerySet
from typing_extensions import override

from zerver.actions.users import do_send_password_reset_email
from zerver.lib.management import ZulipBaseCommand
from zerver.models import UserProfile


class Command(ZulipBaseCommand):
    help = """Send email to specified email address."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "--only-never-logged-in",
            action="store_true",
            help="Filter to only users which have not accepted the TOS.",
        )
        parser.add_argument(
            "--entire-server", action="store_true", help="Send to every user on the server. "
        )
        self.add_user_list_args(
            parser,
            help="Email addresses of user(s) to send password reset emails to.",
            all_users_help="Send to every user on the realm.",
        )
        self.add_realm_args(parser)

    @override
    def handle(self, *args: Any, **options: str) -> None:
        if options["entire_server"]:
            users: QuerySet[UserProfile] = UserProfile.objects.filter(
                is_active=True, is_bot=False, is_mirror_dummy=False
            )
        else:
            realm = self.get_realm(options)
            try:
                users = self.get_users(options, realm, is_bot=False)
            except CommandError as error:
                if str(error) == "You have to pass either -u/--users or -a/--all-users.":
                    raise CommandError(
                        "You have to pass -u/--users or -a/--all-users or --entire-server."
                    )
                raise error
        if options["only_never_logged_in"]:
            users = users.filter(tos_version=-1)

        if not users.exists():
            print("No matching users!")

        self.send(users)

    def send(self, users: QuerySet[UserProfile]) -> None:
        """Sends one-use only links for resetting password to target users"""
        for user_profile in users:
            do_send_password_reset_email(
                user_profile.delivery_email, user_profile.realm, user_profile
            )
```

--------------------------------------------------------------------------------

---[FILE: send_realm_reactivation_email.py]---
Location: zulip-main/zerver/management/commands/send_realm_reactivation_email.py
Signals: Django

```python
from argparse import ArgumentParser
from typing import Any

from django.core.management.base import CommandError
from typing_extensions import override

from zerver.actions.realm_settings import do_send_realm_reactivation_email
from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    help = """Sends realm reactivation email to admins"""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        self.add_realm_args(parser, required=True)

    @override
    def handle(self, *args: Any, **options: str) -> None:
        realm = self.get_realm(options)
        assert realm is not None
        if not realm.deactivated:
            raise CommandError(f"The realm {realm.name} is already active.")
        print("Sending email to admins")
        do_send_realm_reactivation_email(realm, acting_user=None)
        print("Done!")
```

--------------------------------------------------------------------------------

---[FILE: send_test_email.py]---
Location: zulip-main/zerver/management/commands/send_test_email.py
Signals: Django

```python
import io
import smtplib
from contextlib import redirect_stderr
from typing import Any

from django.conf import settings
from django.core.mail import mail_admins, mail_managers, send_mail
from django.core.management import CommandError
from django.core.management.commands import sendtestemail
from typing_extensions import override

from zerver.lib.send_email import FromAddress, log_email_config_errors


class Command(sendtestemail.Command):
    @override
    def handle(self, *args: Any, **kwargs: str) -> None:
        if settings.WARN_NO_EMAIL:
            raise CommandError(
                "Outgoing email not yet configured, see\n  "
                "https://zulip.readthedocs.io/en/latest/production/email.html"
            )

        log_email_config_errors()

        if len(kwargs["email"]) == 0:
            raise CommandError(
                "Usage: /home/zulip/deployments/current/manage.py "
                "send_test_email username@example.com"
            )

        print("If you run into any trouble, read:")
        print()
        print("  https://zulip.readthedocs.io/en/latest/production/email.html#troubleshooting")
        print()
        print("The most common error is not setting `ADD_TOKENS_TO_NOREPLY_ADDRESS=False` when")
        print("using an email provider that doesn't support that feature.")
        print()
        print("Sending 2 test emails from:")

        message = (
            "Success!  If you receive this message (and a second with a different subject), "
            "you've successfully configured sending emails from your Zulip server.  "
            "Remember that you need to restart "
            "the Zulip server with /home/zulip/deployments/current/scripts/restart-server "
            "after changing the settings in /etc/zulip before your changes will take effect."
        )
        with redirect_stderr(io.StringIO()) as f:
            smtplib.SMTP.debuglevel = 1
            try:
                sender = FromAddress.SUPPORT
                print(f"  * {sender}")
                send_mail("Zulip email test", message, sender, kwargs["email"])

                noreply_sender = FromAddress.tokenized_no_reply_address()
                print(f"  * {noreply_sender}")
                send_mail("Zulip noreply email test", message, noreply_sender, kwargs["email"])
            except smtplib.SMTPException as e:
                print(f"Failed to send mails: {e}")
                print()
                print("Full SMTP log follows:")
                print(f.getvalue())
                raise CommandError("Email sending failed!")
        print()
        print("Successfully sent 2 emails to {}!".format(", ".join(kwargs["email"])))

        if kwargs["managers"]:
            mail_managers("Zulip manager email test", "This email was sent to the site managers.")

        if kwargs["admins"]:
            mail_admins("Zulip admins email test", "This email was sent to the site admins.")
```

--------------------------------------------------------------------------------

---[FILE: send_to_email_mirror.py]---
Location: zulip-main/zerver/management/commands/send_to_email_mirror.py
Signals: Django

```python
import base64
import email.parser
import email.policy
import os
from email.message import EmailMessage
from typing import Any

import orjson
from django.conf import settings
from django.core.management.base import CommandError, CommandParser
from typing_extensions import override

from zerver.lib.email_mirror import validate_to_address
from zerver.lib.email_mirror_helpers import encode_email_address, get_channel_email_token
from zerver.lib.management import ZulipBaseCommand
from zerver.lib.queue import queue_json_publish_rollback_unsafe
from zerver.models import Realm, UserProfile
from zerver.models.realms import get_realm
from zerver.models.streams import get_stream
from zerver.models.users import get_system_bot, get_user_profile_by_email, get_user_profile_by_id

# This command loads an email from a specified file and sends it
# to the email mirror. Simple emails can be passed in a JSON file,
# Look at zerver/tests/fixtures/email/1.json for an example of how
# it should look. You can also pass a file which has the raw email,
# for example by writing an email.message.EmailMessage type object
# to a file using as_string() or as_bytes() methods, or copy-pasting
# the content of "Show original" on an email in Gmail.
# See zerver/tests/fixtures/email/1.txt for a very simple example,
# but anything that the message_from_binary_file function
# from the email library can parse should work.
# Value of the TO: header doesn't matter, as it is overridden
# by the command in order for the email to be sent to the correct stream.


class Command(ZulipBaseCommand):
    help = """
Send specified email from a fixture file to the email mirror
Example:
./manage.py send_to_email_mirror --fixture=zerver/tests/fixtures/emails/filename

"""

    @override
    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument(
            "-f",
            "--fixture",
            help="The path to the email message you'd like to send "
            "to the email mirror.\n"
            "Accepted formats: json or raw email file. "
            "See zerver/tests/fixtures/email/ for examples",
        )
        parser.add_argument(
            "-s",
            "--stream",
            help="The name of the stream to which you'd like to send the message. Default: Denmark",
        )
        parser.add_argument(
            "--sender-id",
            type=int,
            help="The ID of a user or bot which should appear as the sender; "
            "Default: ID of Email gateway bot",
        )

        self.add_realm_args(parser, help="Specify which realm to connect to; default is zulip")

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        if options["fixture"] is None:
            self.print_help("./manage.py", "send_to_email_mirror")
            raise CommandError

        if options["stream"] is None:
            stream = "Denmark"
        else:
            stream = options["stream"]

        realm = self.get_realm(options)
        if realm is None:
            realm = get_realm("zulip")

        email_gateway_bot = get_system_bot(settings.EMAIL_GATEWAY_BOT, realm.id)
        if options["sender_id"] is None:
            sender = email_gateway_bot
        else:
            sender = get_user_profile_by_id(options["sender_id"])

        full_fixture_path = os.path.join(settings.DEPLOY_ROOT, options["fixture"])

        # parse the input email into EmailMessage type and prepare to process_message() it
        message = self._parse_email_fixture(full_fixture_path)
        creator = get_user_profile_by_email(message["From"])
        if (
            sender.id not in [creator.id, email_gateway_bot.id]
            and sender.bot_owner_id != creator.id
        ):
            raise CommandError(
                "The sender ID must be either the current user's ID, the email gateway bot's ID, or the ID of a bot owned by the user."
            )
        self._prepare_message(message, realm, stream, creator, sender)

        rcpt_to = message["To"].addresses[0].addr_spec
        validate_to_address(rcpt_to, rate_limit=False)

        queue_json_publish_rollback_unsafe(
            "email_mirror",
            {
                "rcpt_to": rcpt_to,
                "msg_base64": base64.b64encode(message.as_bytes()).decode(),
            },
        )

    def _does_fixture_path_exist(self, fixture_path: str) -> bool:
        return os.path.exists(fixture_path)

    def _parse_email_json_fixture(self, fixture_path: str) -> EmailMessage:
        with open(fixture_path, "rb") as fp:
            json_content = orjson.loads(fp.read())[0]

        message = EmailMessage()
        message["From"] = json_content["from"]
        message["Subject"] = json_content["subject"]
        message.set_content(json_content["body"])
        return message

    def _parse_email_fixture(self, fixture_path: str) -> EmailMessage:
        if not self._does_fixture_path_exist(fixture_path):
            raise CommandError(f"Fixture {fixture_path} does not exist")

        if fixture_path.endswith(".json"):
            return self._parse_email_json_fixture(fixture_path)
        else:
            with open(fixture_path, "rb") as fp:
                return email.parser.BytesParser(
                    _class=EmailMessage, policy=email.policy.default
                ).parse(fp)

    def _prepare_message(
        self,
        message: EmailMessage,
        realm: Realm,
        stream_name: str,
        creator: UserProfile,
        sender: UserProfile,
    ) -> None:
        stream = get_stream(stream_name, realm)
        email_token = get_channel_email_token(stream, creator=creator, sender=sender)

        # The block below ensures that the imported email message doesn't have any recipient-like
        # headers that are inconsistent with the recipient we want (the stream address).
        recipient_headers = [
            "X-Gm-Original-To",
            "Delivered-To",
            "Envelope-To",
            "Resent-To",
            "Resent-CC",
            "CC",
        ]
        for header in recipient_headers:
            if header in message:
                del message[header]
                message[header] = encode_email_address(stream.name, email_token)

        if "To" in message:
            del message["To"]
        message["To"] = encode_email_address(stream.name, email_token)
```

--------------------------------------------------------------------------------

````
