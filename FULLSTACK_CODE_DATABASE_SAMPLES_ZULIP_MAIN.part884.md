---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 884
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 884 of 1290)

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

---[FILE: invites.py]---
Location: zulip-main/zerver/lib/invites.py
Signals: Django

```python
from django.db.models import Q
from django.utils.timezone import now as timezone_now

from confirmation.models import Confirmation
from zerver.models import MultiuseInvite, PreregistrationUser, Realm, UserProfile
from zerver.models.prereg_users import filter_to_valid_prereg_users
from zerver.tornado.django_api import send_event_on_commit


def notify_invites_changed(
    realm: Realm, *, changed_invite_referrer: UserProfile | None = None
) -> None:
    event = dict(type="invites_changed")
    admin_ids = [user.id for user in realm.get_admin_users_and_bots()]
    recipient_ids = admin_ids
    if changed_invite_referrer and changed_invite_referrer.id not in recipient_ids:
        recipient_ids.append(changed_invite_referrer.id)
    send_event_on_commit(realm, event, recipient_ids)


def get_valid_invite_confirmations_generated_by_user(
    user_profile: UserProfile,
) -> list[Confirmation]:
    prereg_user_ids = filter_to_valid_prereg_users(
        PreregistrationUser.objects.filter(referred_by=user_profile)
    ).values_list("id", flat=True)
    confirmations = list(
        Confirmation.objects.filter(type=Confirmation.INVITATION, object_id__in=prereg_user_ids)
    )

    multiuse_invite_ids = MultiuseInvite.objects.filter(referred_by=user_profile).values_list(
        "id", flat=True
    )
    confirmations += Confirmation.objects.filter(
        type=Confirmation.MULTIUSE_INVITE,
        object_id__in=multiuse_invite_ids,
    ).filter(Q(expiry_date__gte=timezone_now()) | Q(expiry_date=None))

    return confirmations


def revoke_invites_generated_by_user(user_profile: UserProfile) -> None:
    confirmations_to_revoke = get_valid_invite_confirmations_generated_by_user(user_profile)
    now = timezone_now()
    for confirmation in confirmations_to_revoke:
        confirmation.expiry_date = now

    Confirmation.objects.bulk_update(confirmations_to_revoke, ["expiry_date"])
    if len(confirmations_to_revoke):
        notify_invites_changed(realm=user_profile.realm)
```

--------------------------------------------------------------------------------

---[FILE: logging_util.py]---
Location: zulip-main/zerver/lib/logging_util.py
Signals: Django

```python
# System documented in https://zulip.readthedocs.io/en/latest/subsystems/logging.html
import hashlib
import logging
import threading
import traceback
from collections.abc import Iterable
from contextlib import suppress
from datetime import datetime, timedelta, timezone
from logging import Logger

import orjson
from django.conf import settings
from django.core.cache import cache
from django.http import HttpRequest
from django.utils.timezone import now as timezone_now
from typing_extensions import override


class _RateLimitFilter:
    """This class is designed to rate-limit Django error reporting
    notifications so that it won't send thousands of emails if the
    database or cache is completely down.  It uses a remote shared
    cache (shared by all Django processes) for its default behavior
    (so that the deduplication is global, not per-process), and a
    local in-process cache for when it can't access the remote cache.

    This is critical code because it is called every time
    `logging.error` or `logging.exception` (or an exception) happens
    in the codebase.

    Adapted from https://djangosnippets.org/snippets/2242/.

    """

    last_error = datetime.min.replace(tzinfo=timezone.utc)
    # This thread-local variable is used to detect recursive
    # exceptions during exception handling (primarily intended for
    # when accessing the shared cache throws an exception).
    handling_exception = threading.local()
    should_reset_handling_exception = False

    def can_use_remote_cache(self) -> tuple[bool, bool]:
        if getattr(self.handling_exception, "value", False):
            # If we're processing an exception that occurred
            # while handling an exception, this almost
            # certainly was because interacting with the
            # remote cache is failing (e.g. because the cache
            # is down).  Fall back to tracking duplicate
            # exceptions in memory without the remote shared cache.
            return False, False

        # Now we test if the remote cache is accessible.
        #
        # This code path can only be reached if we are not potentially
        # handling a recursive exception, so here we set
        # self.handling_exception (in case the cache access we're
        # about to do triggers a `logging.error` or exception that
        # might recurse into this filter class), and actually record
        # that this is the main exception handler thread.
        try:
            self.handling_exception.value = True
            cache.set("RLF_TEST_KEY", 1, 1)
            return cache.get("RLF_TEST_KEY") == 1, True
        except Exception:
            return False, True

    def filter(self, record: logging.LogRecord) -> bool:
        # When the original filter() call finishes executing, it's
        # going to change handling_exception.value to False. The
        # local variable below tracks whether the *current*,
        # potentially recursive, filter() call is allowed to touch
        # that value (only the original will find this to be True
        # at the end of its execution)
        should_reset_handling_exception = False
        try:
            # Track duplicate errors
            duplicate = False
            rate = getattr(settings, f"{type(self).__name__.upper()}_LIMIT", 600)  # seconds

            if rate > 0:
                (use_cache, should_reset_handling_exception) = self.can_use_remote_cache()
                if use_cache:
                    if record.exc_info is not None and isinstance(record.exc_info, Iterable):
                        tb = "\n".join(traceback.format_exception(*record.exc_info))
                    else:
                        tb = str(record)
                    key = type(self).__name__.upper() + hashlib.sha1(tb.encode()).hexdigest()
                    duplicate = cache.get(key) == 1
                    if not duplicate:
                        cache.set(key, 1, rate)
                else:
                    min_date = timezone_now() - timedelta(seconds=rate)
                    duplicate = self.last_error >= min_date
                    if not duplicate:
                        self.last_error = timezone_now()

            return not duplicate
        finally:
            if should_reset_handling_exception:
                self.handling_exception.value = False


class ZulipLimiter(_RateLimitFilter):
    pass


class EmailLimiter(_RateLimitFilter):
    pass


class ReturnTrue(logging.Filter):
    @override
    def filter(self, record: logging.LogRecord) -> bool:
        return True


class RequireReallyDeployed(logging.Filter):
    @override
    def filter(self, record: logging.LogRecord) -> bool:
        return settings.PRODUCTION


def find_log_caller_module(record: logging.LogRecord) -> str | None:
    """Find the module name corresponding to where this record was logged.

    Sadly `record.module` is just the innermost component of the full
    module name, so we have to go reconstruct this ourselves.
    """
    # Repeat a search similar to that in logging.Logger.findCaller.
    # The logging call should still be on the stack somewhere; search until
    # we find something in the same source file, and that should give the
    # right module name.
    f = logging.currentframe()
    while True:
        if f.f_code.co_filename == record.pathname:
            return f.f_globals.get("__name__")
        if f.f_back is None:
            return None
        f = f.f_back


logger_nicknames = {
    "root": "",  # This one is more like undoing a nickname.
    "zulip.requests": "zr",  # Super common.
}


def find_log_origin(record: logging.LogRecord) -> str:
    logger_name = logger_nicknames.get(record.name, record.name)

    if settings.LOGGING_SHOW_MODULE:
        module_name = find_log_caller_module(record)
        if module_name in (logger_name, record.name):
            # Abbreviate a bit.
            pass
        else:
            logger_name = "{}/{}".format(logger_name, module_name or "?")

    if settings.RUNNING_INSIDE_TORNADO:
        # In multi-sharded Tornado, it's often valuable to have which shard is
        # responsible for the request in the logs.
        from zerver.tornado.ioloop_logging import logging_data

        shard = logging_data.get("port", "unknown")
        logger_name = f"{logger_name}:{shard}"

    return logger_name


log_level_abbrevs = {
    "DEBUG": "DEBG",
    "INFO": "INFO",
    "WARNING": "WARN",
    "ERROR": "ERR",
    "CRITICAL": "CRIT",
}


def abbrev_log_levelname(levelname: str) -> str:
    # It's unlikely someone will set a custom log level with a custom name,
    # but it's an option, so we shouldn't crash if someone does.
    return log_level_abbrevs.get(levelname, levelname[:4])


class ZulipFormatter(logging.Formatter):
    # Used in the base implementation.  Default uses `,`.
    default_msec_format = "%s.%03d"

    def __init__(self) -> None:
        super().__init__(fmt=self._compute_fmt())

    def _compute_fmt(self) -> str:
        pieces = ["%(asctime)s", "%(zulip_level_abbrev)-4s"]
        if settings.LOGGING_SHOW_PID:
            pieces.append("pid:%(process)d")
        pieces.extend(["[%(zulip_origin)s]", "%(message)s"])
        return " ".join(pieces)

    @override
    def format(self, record: logging.LogRecord) -> str:
        if not hasattr(record, "zulip_decorated"):
            record.zulip_level_abbrev = abbrev_log_levelname(record.levelname)
            record.zulip_origin = find_log_origin(record)
            record.zulip_decorated = True
        return super().format(record)


class ZulipWebhookFormatter(ZulipFormatter):
    @override
    def _compute_fmt(self) -> str:
        basic = super()._compute_fmt()
        multiline = [
            basic,
            "user: %(user)s",
            "client: %(client)s",
            "url: %(url)s",
            "content_type: %(content_type)s",
            "custom_headers:",
            "%(custom_headers)s",
            "payload:",
            "%(payload)s",
        ]
        return "\n".join(multiline)

    @override
    def format(self, record: logging.LogRecord) -> str:
        request: HttpRequest | None = getattr(record, "request", None)
        if request is None:
            record.user = None
            record.client = None
            record.url = None
            record.content_type = None
            record.custom_headers = None
            record.payload = None
            return super().format(record)

        if request.content_type == "application/json":
            payload: str | bytes = request.body
        else:
            payload = request.POST["payload"]

        with suppress(orjson.JSONDecodeError):
            payload = orjson.dumps(orjson.loads(payload), option=orjson.OPT_INDENT_2).decode()

        header_text = "".join(
            f"{header}: {value}\n"
            for header, value in request.headers.items()
            if header.lower().startswith("x-")
        )

        from zerver.lib.request import RequestNotes

        client = RequestNotes.get_notes(request).client
        assert client is not None

        assert request.user.is_authenticated
        record.user = f"{request.user.delivery_email} ({request.user.realm.string_id})"
        record.client = client.name
        record.url = request.META.get("PATH_INFO", None)
        record.content_type = request.content_type
        record.custom_headers = header_text or None
        record.payload = payload
        return super().format(record)


def log_to_file(
    logger: Logger,
    filename: str,
    log_format: str = "%(asctime)s %(levelname)-8s %(message)s",
) -> None:
    """Note: `filename` should be declared in zproject/computed_settings.py with zulip_path."""
    formatter = logging.Formatter(log_format)
    handler = logging.FileHandler(filename)
    handler.setFormatter(formatter)
    logger.addHandler(handler)
```

--------------------------------------------------------------------------------

---[FILE: management.py]---
Location: zulip-main/zerver/lib/management.py
Signals: Django

```python
# Library code for use in management commands
import logging
import os
import sys
import time
from argparse import ArgumentParser, BooleanOptionalAction, RawTextHelpFormatter, _ActionsContainer
from dataclasses import dataclass
from functools import reduce, wraps
from typing import Any, Protocol

from django.conf import settings
from django.core import validators
from django.core.exceptions import MultipleObjectsReturned, ValidationError
from django.core.management.base import BaseCommand, CommandError, CommandParser
from django.db.models import Q, QuerySet
from typing_extensions import override

from scripts.lib.zulip_tools import LOCK_DIR as DEPLOYMENT_LOCK_DIR
from zerver.lib.context_managers import lockfile_nonblocking
from zerver.lib.initial_password import initial_password
from zerver.models import Client, Realm, UserProfile
from zerver.models.clients import get_client


def is_integer_string(val: str) -> bool:
    try:
        int(val)
        return True
    except ValueError:
        return False


class HandleMethod(Protocol):
    def __call__(self, *args: Any, **kwargs: Any) -> None: ...


def abort_unless_locked(handle_func: HandleMethod) -> HandleMethod:
    @wraps(handle_func)
    def our_handle(self: BaseCommand, *args: Any, **kwargs: Any) -> None:
        os.makedirs(settings.LOCKFILE_DIRECTORY, exist_ok=True)
        # Trim out just the last part of the module name, which is the
        # command name, to use as the lockfile name;
        # `zerver.management.commands.send_zulip_update_announcements`
        # becomes `/srv/zulip-locks/send_zulip_update_announcements.lock`
        lockfile_name = handle_func.__module__.split(".")[-1]
        lockfile_path = settings.LOCKFILE_DIRECTORY + "/" + lockfile_name + ".lock"
        with lockfile_nonblocking(lockfile_path) as lock_acquired:
            if not lock_acquired:  # nocoverage
                self.stdout.write(
                    self.style.ERROR(f"Lock {lockfile_path} is unavailable; exiting.")
                )
                sys.exit(1)
            handle_func(self, *args, **kwargs)

    return our_handle


def abort_cron_during_deploy(handle_func: HandleMethod) -> HandleMethod:
    @wraps(handle_func)
    def our_handle(self: BaseCommand, *args: Any, **kwargs: Any) -> None:
        # For safety, we only trust the lock directory if it was
        # created within the last hour -- otherwise, a spurious
        # deploy lock could linger and block all hourly crons.
        if (
            os.environ.get("RUNNING_UNDER_CRON")
            and os.path.exists(DEPLOYMENT_LOCK_DIR)
            and time.time() - os.path.getctime(DEPLOYMENT_LOCK_DIR) < 3600
        ):  # nocoverage
            self.stdout.write(
                self.style.ERROR("Deployment in process; aborting cron management command.")
            )
            sys.exit(1)
        handle_func(self, *args, **kwargs)

    return our_handle


@dataclass
class CreateUserParameters:
    email: str
    full_name: str
    password: str | None


class ZulipBaseCommand(BaseCommand):
    # Fix support for multi-line usage
    @override
    def create_parser(self, prog_name: str, subcommand: str, **kwargs: Any) -> CommandParser:
        parser = super().create_parser(prog_name, subcommand, **kwargs)
        parser.add_argument(
            "--automated",
            help="This command is run non-interactively (enables Sentry, etc)",
            action=BooleanOptionalAction,
            default=not sys.stdin.isatty(),
        )
        parser.formatter_class = RawTextHelpFormatter
        return parser

    @override
    def execute(self, *args: Any, **options: Any) -> None:
        if settings.SENTRY_DSN and not options["automated"]:  # nocoverage
            import sentry_sdk

            # This deactivates Sentry
            sentry_sdk.init()
        super().execute(*args, **options)

    def add_realm_args(
        self, parser: _ActionsContainer, *, required: bool = False, help: str | None = None
    ) -> None:
        if help is None:
            help = """The numeric or string ID (subdomain) of the Zulip organization to modify.
You can use the command list_realms to find ID of the realms in this server."""

        parser.add_argument("-r", "--realm", dest="realm_id", required=required, help=help)

    def add_create_user_args(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "email",
            metavar="<email>",
            nargs="?",
            help="Email address for the new user",
        )
        parser.add_argument(
            "full_name",
            metavar="<full name>",
            nargs="?",
            help="Full name for the new user",
        )
        parser.add_argument(
            "--password",
            help="""\
Password for the new user. Recommended only in a development environment.

Sending passwords via command-line arguments is insecure,
since it can be snooped by any process running on the
server via `ps -ef` or reading bash history. Prefer
--password-file.""",
        )
        parser.add_argument("--password-file", help="File containing a password for the new user.")

    def add_user_list_args(
        self,
        parser: _ActionsContainer,
        help: str = "A comma-separated list of email addresses.",
        all_users_help: str = "All users in realm.",
    ) -> None:
        parser.add_argument("-u", "--users", help=help)

        parser.add_argument("-a", "--all-users", action="store_true", help=all_users_help)

    def get_realm(self, options: dict[str, Any]) -> Realm | None:
        val = options["realm_id"]
        if val is None:
            return None

        # If they specified a realm argument, we need to ensure the
        # realm exists.  We allow two formats: the numeric ID for the
        # realm and the string ID of the realm.
        try:
            if is_integer_string(val):
                return Realm.objects.get(id=val)
            return Realm.objects.get(string_id=val)
        except Realm.DoesNotExist:
            raise CommandError(
                "There is no realm with id '{}'. Aborting.".format(options["realm_id"])
            )

    def get_users(
        self,
        options: dict[str, Any],
        realm: Realm | None,
        is_bot: bool | None = None,
        include_deactivated: bool = False,
    ) -> QuerySet[UserProfile]:
        if "all_users" in options:
            all_users = options["all_users"]

            if not options["users"] and not all_users:
                raise CommandError("You have to pass either -u/--users or -a/--all-users.")

            if options["users"] and all_users:
                raise CommandError("You can't use both -u/--users and -a/--all-users.")

            if all_users and realm is None:
                raise CommandError("The --all-users option requires a realm; please pass --realm.")

            if all_users:
                user_profiles = UserProfile.objects.filter(realm=realm)
                if not include_deactivated:
                    user_profiles = user_profiles.filter(is_active=True)
                if is_bot is not None:
                    return user_profiles.filter(is_bot=is_bot)
                return user_profiles

        if options["users"] is None:
            return UserProfile.objects.none()
        emails = {email.strip() for email in options["users"].split(",")}
        # This is inefficient, but we fetch (and throw away) the
        # get_user of each email, so that we verify that the email
        # address/realm returned only one result; it may return more
        # if realm is not specified but email address was.
        for email in emails:
            self.get_user(email, realm)

        user_profiles = UserProfile.objects.all().select_related("realm")
        if realm is not None:
            user_profiles = user_profiles.filter(realm=realm)
        email_matches = [Q(delivery_email__iexact=e) for e in emails]
        user_profiles = user_profiles.filter(reduce(lambda a, b: a | b, email_matches)).order_by(
            "id"
        )

        # Return the single query, for ease of composing.
        return user_profiles

    def get_user(self, email: str, realm: Realm | None) -> UserProfile:
        # If a realm is specified, try to find the user there, and
        # throw an error if they don't exist.
        if realm is not None:
            try:
                return UserProfile.objects.select_related("realm").get(
                    delivery_email__iexact=email.strip(), realm=realm
                )
            except UserProfile.DoesNotExist:
                raise CommandError(
                    f"The realm '{realm}' does not contain a user with email '{email}'"
                )

        # Realm is None in the remaining code path.  Here, we
        # optimistically try to see if there is exactly one user with
        # that email; if so, we'll return it.
        try:
            return UserProfile.objects.select_related("realm").get(
                delivery_email__iexact=email.strip()
            )
        except MultipleObjectsReturned:
            raise CommandError(
                "This Zulip server contains multiple users with that email (in different realms);"
                " please pass `--realm` to specify which one to modify."
            )
        except UserProfile.DoesNotExist:
            raise CommandError(f"This Zulip server does not contain a user with email '{email}'")

    def get_client(self) -> Client:
        """Returns a Zulip Client object to be used for things done in management commands"""
        return get_client("ZulipServer")

    def get_create_user_params(self, options: dict[str, Any]) -> CreateUserParameters:  # nocoverage
        """
        Parses parameters for user creation defined in add_create_user_args.
        """
        if options["email"] is None:
            email = input("Email: ")
        else:
            email = options["email"]

        try:
            validators.validate_email(email)
        except ValidationError:
            raise CommandError("Invalid email address.")

        if options["full_name"] is None:
            full_name = input("Full name: ")
        else:
            full_name = options["full_name"]

        if options["password_file"] is not None:
            with open(options["password_file"]) as f:
                password: str | None = f.read().strip()
        elif options["password"] is not None:
            logging.warning(
                "Passing password on the command line is insecure; prefer --password-file."
            )
            password = options["password"]
        else:
            # initial_password will return a random password that
            # is a salted hash of the email address in a
            # development environment, and None in a production
            # environment.
            user_initial_password = initial_password(email)
            if user_initial_password is None:
                logging.info("User will be created with a disabled password.")
            else:
                assert settings.DEVELOPMENT
                logging.info("Password will be available via `./manage.py print_initial_password`.")
            password = user_initial_password

        return CreateUserParameters(
            email=email,
            full_name=full_name,
            password=password,
        )
```

--------------------------------------------------------------------------------

---[FILE: mdiff.py]---
Location: zulip-main/zerver/lib/mdiff.py

```python
import logging
import os
import subprocess


class DiffError(Exception):
    pass


def diff_strings(output: str, expected_output: str) -> str:
    mdiff_path = "web/tests/lib/mdiff.cjs"
    if not os.path.isfile(mdiff_path):  # nocoverage
        msg = "Cannot find mdiff for Markdown diff rendering"
        logging.error(msg)
        raise DiffError(msg)

    command = ["node", mdiff_path, output, expected_output]
    diff = subprocess.check_output(command, text=True)
    return diff
```

--------------------------------------------------------------------------------

````
