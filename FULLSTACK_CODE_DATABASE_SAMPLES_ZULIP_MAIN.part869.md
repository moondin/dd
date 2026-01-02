---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 869
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 869 of 1290)

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

---[FILE: compatibility.py]---
Location: zulip-main/zerver/lib/compatibility.py
Signals: Django

```python
import os
import re
from datetime import datetime, timedelta, timezone

from django.conf import settings
from django.utils.timezone import now as timezone_now

from version import DESKTOP_MINIMUM_VERSION, DESKTOP_WARNING_VERSION
from zerver.lib.user_agent import parse_user_agent
from zerver.models import UserProfile
from zerver.signals import get_device_browser

# LAST_SERVER_UPGRADE_TIME is the last time the server had a version deployed.
if settings.PRODUCTION:  # nocoverage
    timestamp = os.path.basename(os.path.abspath(settings.DEPLOY_ROOT))
    LAST_SERVER_UPGRADE_TIME = datetime.strptime(timestamp, "%Y-%m-%d-%H-%M-%S").replace(
        tzinfo=timezone.utc
    )
else:
    LAST_SERVER_UPGRADE_TIME = timezone_now()


def is_outdated_server(user_profile: UserProfile | None) -> bool:
    # Release tarballs are unpacked via `tar -xf`, which means the
    # `mtime` on files in them is preserved from when the release
    # tarball was built.  Checking this allows us to catch cases where
    # someone has upgraded in the last year but to a release more than
    # a year old.
    git_version_path = os.path.join(settings.DEPLOY_ROOT, "version.py")
    release_build_time = datetime.fromtimestamp(os.path.getmtime(git_version_path), timezone.utc)

    version_no_newer_than = min(LAST_SERVER_UPGRADE_TIME, release_build_time)
    deadline = version_no_newer_than + timedelta(days=settings.SERVER_UPGRADE_NAG_DEADLINE_DAYS)

    if user_profile is None or not user_profile.is_realm_admin:
        # Administrators get warned at the deadline; all users 30 days later.
        deadline += timedelta(days=30)

    if timezone_now() > deadline:
        return True
    return False


def pop_numerals(ver: str) -> tuple[list[int], str]:
    match = re.search(r"^( \d+ (?: \. \d+ )* ) (.*)", ver, re.VERBOSE)
    if match is None:
        return [], ver
    numerals, rest = match.groups()
    numbers = [int(n) for n in numerals.split(".")]
    return numbers, rest


def version_lt(ver1: str, ver2: str) -> bool | None:
    """
    Compare two Zulip-style version strings.

    Versions are dot-separated sequences of decimal integers,
    followed by arbitrary trailing decoration.  Comparison is
    lexicographic on the integer sequences, and refuses to
    guess how any trailing decoration compares to any other,
    to further numerals, or to nothing.

    Returns:
      True if ver1 < ver2
      False if ver1 >= ver2
      None if can't tell.
    """
    num1, rest1 = pop_numerals(ver1)
    num2, rest2 = pop_numerals(ver2)
    if not num1 or not num2:
        return None
    common_len = min(len(num1), len(num2))
    common_num1, rest_num1 = num1[:common_len], num1[common_len:]
    common_num2, rest_num2 = num2[:common_len], num2[common_len:]

    # Leading numbers win.
    if common_num1 != common_num2:
        return common_num1 < common_num2

    # More numbers beats end-of-string, but ??? vs trailing text.
    # (NB at most one of rest_num1, rest_num2 is nonempty.)
    if not rest1 and rest_num2:
        return True
    if rest_num1 and not rest2:
        return False
    if rest_num1 or rest_num2:
        return None

    # Trailing text we can only compare for equality.
    if rest1 == rest2:
        return False
    return None


def find_mobile_os(user_agent: str) -> str | None:
    if re.search(r"\b Android \b", user_agent, re.IGNORECASE | re.VERBOSE):
        return "android"
    if re.search(r"\b(?: iOS | iPhone\ OS )\b", user_agent, re.IGNORECASE | re.VERBOSE):
        return "ios"
    return None


def is_outdated_desktop_app(user_agent_str: str) -> tuple[bool, bool, bool]:
    # Returns (insecure, banned, auto_update_broken)
    user_agent = parse_user_agent(user_agent_str)
    if user_agent["name"] == "ZulipDesktop":
        # The deprecated QT/webkit based desktop app, last updated in ~2016.
        return (True, True, True)

    if user_agent["name"] != "ZulipElectron":
        return (False, False, False)

    if version_lt(user_agent["version"], "4.0.0"):
        # Version 2.3.82 and older (aka <4.0.0) of the modern
        # Electron-based Zulip desktop app with known security issues.
        # won't auto-update; we may want a special notice to
        # distinguish those from modern releases.
        return (True, True, True)

    if version_lt(user_agent["version"], DESKTOP_MINIMUM_VERSION):
        # Below DESKTOP_MINIMUM_VERSION, we reject access as well.
        return (True, True, False)

    if version_lt(user_agent["version"], DESKTOP_WARNING_VERSION):
        # Other insecure versions should just warn.
        return (True, False, False)

    return (False, False, False)


def is_banned_browser(user_agent: str) -> tuple[bool, str | None]:
    browser_name = get_device_browser(user_agent)
    if browser_name == "Internet Explorer":
        return (True, browser_name)
    return (False, browser_name)


def is_pronouns_field_type_supported(user_agent_str: str | None) -> bool:
    # In order to avoid users having a bad experience with these
    # custom profile fields disappearing after applying migration
    # 0421_migrate_pronouns_custom_profile_fields, we provide this
    # compatibility shim to show such custom profile fields as
    # SHORT_TEXT to older mobile app clients.
    #
    # TODO/compatibility(7.0): Because this is a relatively minor
    # detail, we can remove this compatibility hack once most users
    # have upgraded to a sufficiently new mobile client.
    if user_agent_str is None:
        return True

    user_agent = parse_user_agent(user_agent_str)
    if user_agent["name"] != "ZulipMobile":
        return True

    FIRST_VERSION_TO_SUPPORT_PRONOUNS_FIELD = "27.192"
    if version_lt(user_agent["version"], FIRST_VERSION_TO_SUPPORT_PRONOUNS_FIELD):
        return False

    return True
```

--------------------------------------------------------------------------------

---[FILE: context_managers.py]---
Location: zulip-main/zerver/lib/context_managers.py

```python
"""
Context managers, i.e. things you can use with the 'with' statement.
"""

import fcntl
from collections.abc import Iterator
from contextlib import contextmanager
from typing import IO, Any


@contextmanager
def flock(lockfile: int | IO[Any], shared: bool = False) -> Iterator[None]:
    """Lock a file object using flock(2) for the duration of a 'with' statement.

    If shared is True, use a LOCK_SH lock, otherwise LOCK_EX."""

    fcntl.flock(lockfile, fcntl.LOCK_SH if shared else fcntl.LOCK_EX)
    try:
        yield
    finally:
        fcntl.flock(lockfile, fcntl.LOCK_UN)


@contextmanager
def lockfile(filename: str, shared: bool = False) -> Iterator[None]:
    """Lock a file using flock(2) for the duration of a 'with' statement.

    If shared is True, use a LOCK_SH lock, otherwise LOCK_EX.

    The file is given by name and will be created if it does not exist."""
    with open(filename, "w") as lock, flock(lock, shared=shared):
        yield


@contextmanager
def lockfile_nonblocking(filename: str) -> Iterator[bool]:  # nocoverage
    """Lock a file using flock(2) for the duration of a 'with' statement.

    Doesn't block, yields False immediately if the lock can't be acquired."""
    with open(filename, "w") as f:
        lock_acquired = False
        try:
            fcntl.flock(f, fcntl.LOCK_EX | fcntl.LOCK_NB)
            lock_acquired = True
            yield lock_acquired
        except BlockingIOError:
            yield False
        finally:
            if lock_acquired:
                fcntl.flock(f, fcntl.LOCK_UN)
```

--------------------------------------------------------------------------------

---[FILE: create_user.py]---
Location: zulip-main/zerver/lib/create_user.py
Signals: Django

```python
import re
from datetime import datetime
from email.headerregistry import Address

from django.contrib.auth.models import UserManager
from django.utils.timezone import now as timezone_now

from zerver.lib.i18n import get_default_language_for_new_user
from zerver.lib.onboarding_steps import copy_onboarding_steps
from zerver.lib.timezone import canonicalize_timezone
from zerver.lib.upload import copy_avatar
from zerver.models import (
    Realm,
    RealmUserDefault,
    Recipient,
    Stream,
    Subscription,
    UserBaseSettings,
    UserProfile,
)
from zerver.models.realms import get_fake_email_domain


def copy_default_settings(
    settings_source: UserProfile | RealmUserDefault, target_profile: UserProfile
) -> None:
    # Important note: Code run from here to configure the user's
    # settings should not send events, as that would cause clients
    # to throw an exception (we haven't sent the realm_user/add event
    # yet, so that event will include the updated details of target_profile).
    #
    # Note that this function will do at least one save() on target_profile.
    for settings_name in UserBaseSettings.property_types:
        if settings_name in ["default_language", "enable_login_emails"] and isinstance(
            settings_source, RealmUserDefault
        ):
            continue

        if settings_name == "email_address_visibility":
            # For email_address_visibility, the value selected in registration form
            # is preferred over the realm-level default value and value of source
            # profile.
            continue
        value = getattr(settings_source, settings_name)
        setattr(target_profile, settings_name, value)

    if isinstance(settings_source, RealmUserDefault):
        target_profile.save()
        return

    target_profile.full_name = settings_source.full_name
    target_profile.timezone = canonicalize_timezone(settings_source.timezone)
    target_profile.save()

    if settings_source.avatar_source == UserProfile.AVATAR_FROM_USER:
        from zerver.actions.user_settings import do_change_avatar_fields

        copy_avatar(settings_source, target_profile)
        do_change_avatar_fields(
            target_profile,
            UserProfile.AVATAR_FROM_USER,
            skip_notify=True,
            acting_user=target_profile,
        )

    copy_onboarding_steps(settings_source, target_profile)


def get_dummy_email_address_for_display_regex(realm: Realm) -> str:
    """
    Returns a regex that matches the format of dummy email addresses we
    generate for the .email of users with limit email_address_visibility.

    The reason we need a regex is that we want something that we can use both
    for generating the dummy email addresses and recognizing them together with extraction
    of the user ID.
    """

    # We can't directly have (\d+) in the username passed to Address, because it gets
    # mutated by the underlying logic for escaping special characters.
    # So we use a trick by using $ as a placeholder which will be preserved, and then
    # replace it with (\d+) to obtain our intended regex.
    address_template = Address(username="user$", domain=get_fake_email_domain(realm.host)).addr_spec
    regex = re.escape(address_template).replace(r"\$", r"(\d+)", 1)
    return regex


def get_display_email_address(user_profile: UserProfile) -> str:
    if not user_profile.email_address_is_realm_public():
        # The format of the dummy email address created here needs to stay consistent
        # with get_dummy_email_address_for_display_regex.
        return Address(
            username=f"user{user_profile.id}", domain=get_fake_email_domain(user_profile.realm.host)
        ).addr_spec
    return user_profile.delivery_email


# create_user_profile is based on Django's User.objects.create_user,
# except that we don't save to the database so it can used in
# bulk_creates
#
# Only use this for bulk_create -- for normal usage one should use
# create_user (below) which will also make the Subscription and
# Recipient objects
def create_user_profile(
    realm: Realm,
    email: str,
    password: str | None,
    active: bool,
    bot_type: int | None,
    full_name: str,
    bot_owner: UserProfile | None,
    is_mirror_dummy: bool,
    tos_version: str | None,
    timezone: str,
    default_language: str,
    force_date_joined: datetime | None = None,
    *,
    email_address_visibility: int,
) -> UserProfile:
    if force_date_joined is None:
        date_joined = timezone_now()
    else:  # nocoverage
        date_joined = force_date_joined

    email = UserManager.normalize_email(email)

    user_profile = UserProfile(
        is_staff=False,
        is_active=active,
        full_name=full_name,
        last_login=date_joined,
        date_joined=date_joined,
        realm=realm,
        is_bot=bool(bot_type),
        bot_type=bot_type,
        bot_owner=bot_owner,
        is_mirror_dummy=is_mirror_dummy,
        tos_version=tos_version,
        timezone=timezone,
        default_language=default_language,
        delivery_email=email,
        email_address_visibility=email_address_visibility,
    )
    if bot_type or not active:
        password = None
    if user_profile.email_address_is_realm_public():
        # If emails are visible to everyone, we can set this here and save a DB query
        user_profile.email = get_display_email_address(user_profile)
    user_profile.set_password(password)
    return user_profile


def create_user(
    email: str,
    password: str | None,
    realm: Realm,
    full_name: str,
    active: bool = True,
    role: int | None = None,
    bot_type: int | None = None,
    bot_owner: UserProfile | None = None,
    tos_version: str | None = None,
    timezone: str = "",
    avatar_source: str = UserProfile.AVATAR_FROM_GRAVATAR,
    is_mirror_dummy: bool = False,
    default_language: str | None = None,
    default_sending_stream: Stream | None = None,
    default_events_register_stream: Stream | None = None,
    default_all_public_streams: bool | None = None,
    source_profile: UserProfile | None = None,
    force_date_joined: datetime | None = None,
    enable_marketing_emails: bool | None = None,
    email_address_visibility: int | None = None,
) -> UserProfile:
    realm_user_default = RealmUserDefault.objects.get(realm=realm)
    if bot_type is None:
        if email_address_visibility is not None:
            user_email_address_visibility = email_address_visibility
        else:
            user_email_address_visibility = realm_user_default.email_address_visibility
    else:
        # There is no privacy motivation for limiting access to bot email addresses,
        # so we hardcode them to EMAIL_ADDRESS_VISIBILITY_EVERYONE.
        user_email_address_visibility = UserProfile.EMAIL_ADDRESS_VISIBILITY_EVERYONE

    # Users created via the API or LDAP/SAML syncing code paths will
    # usually not have a default_language value, and should fall back
    # to the realm default.
    if default_language is None:
        default_language = get_default_language_for_new_user(realm, request=None)

    user_profile = create_user_profile(
        realm,
        email,
        password,
        active,
        bot_type,
        full_name,
        bot_owner,
        is_mirror_dummy,
        tos_version,
        timezone,
        default_language,
        force_date_joined=force_date_joined,
        email_address_visibility=user_email_address_visibility,
    )
    user_profile.avatar_source = avatar_source
    user_profile.timezone = timezone
    user_profile.default_sending_stream = default_sending_stream
    user_profile.default_events_register_stream = default_events_register_stream
    if role is not None:
        user_profile.role = role
    # Allow the ORM default to be used if not provided
    if default_all_public_streams is not None:
        user_profile.default_all_public_streams = default_all_public_streams
    # If a source profile was specified, we copy settings from that
    # user.  Note that this is positioned in a way that overrides
    # other arguments passed in, which is correct for most defaults
    # like time zone where the source profile likely has a better value
    # than the guess. As we decide on details like avatars and full
    # names for this feature, we may want to move it.
    if source_profile is not None:
        # copy_default_settings saves the attribute values so a secondary
        # save is not required.
        copy_default_settings(source_profile, user_profile)
    elif bot_type is None:
        copy_default_settings(realm_user_default, user_profile)
    else:
        # This will be executed only for bots.
        user_profile.save()

    if bot_type is None and enable_marketing_emails is not None:
        user_profile.enable_marketing_emails = enable_marketing_emails
        user_profile.save(update_fields=["enable_marketing_emails"])

    if not user_profile.email_address_is_realm_public():
        # With restricted access to email addresses, we can't generate
        # the fake email addresses we use for display purposes without
        # a User ID, which isn't generated until the .save() above.
        user_profile.email = get_display_email_address(user_profile)
        user_profile.save(update_fields=["email"])

    recipient = Recipient.objects.create(type_id=user_profile.id, type=Recipient.PERSONAL)
    user_profile.recipient = recipient
    user_profile.save(update_fields=["recipient"])

    Subscription.objects.create(
        user_profile=user_profile, recipient=recipient, is_user_active=user_profile.is_active
    )
    return user_profile
```

--------------------------------------------------------------------------------

---[FILE: db.py]---
Location: zulip-main/zerver/lib/db.py
Signals: Django, SQLAlchemy

```python
import time
from collections.abc import Callable, Iterable, Mapping, Sequence
from typing import Any, TypeAlias, TypeVar

from psycopg2.extensions import connection, cursor
from psycopg2.sql import Composable
from typing_extensions import override

CursorObj = TypeVar("CursorObj", bound=cursor)
Query: TypeAlias = str | bytes | Composable
Params: TypeAlias = Sequence[object] | Mapping[str, object] | None
ParamsT = TypeVar("ParamsT")


# Similar to the tracking done in Django's CursorDebugWrapper, but done at the
# psycopg2 cursor level so it works with SQLAlchemy.
def wrapper_execute(
    self: CursorObj, action: Callable[[Query, ParamsT], None], sql: Query, params: ParamsT
) -> None:
    start = time.time()
    try:
        action(sql, params)
    finally:
        stop = time.time()
        duration = stop - start
        assert isinstance(self.connection, TimeTrackingConnection)
        self.connection.queries.append(
            {
                "time": f"{duration:.3f}",
            }
        )


class TimeTrackingCursor(cursor):
    """A psycopg2 cursor class that tracks the time spent executing queries."""

    @override
    def execute(self, query: Query, vars: Params = None) -> None:
        wrapper_execute(self, super().execute, query, vars)

    @override
    def executemany(self, query: Query, vars_list: Iterable[Params]) -> None:  # nocoverage
        wrapper_execute(self, super().executemany, query, vars_list)


CursorT = TypeVar("CursorT", bound=cursor)


class TimeTrackingConnection(connection):
    """A psycopg2 connection class that uses TimeTrackingCursors."""

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        self.queries: list[dict[str, str]] = []
        super().__init__(*args, **kwargs)
```

--------------------------------------------------------------------------------

---[FILE: db_connections.py]---
Location: zulip-main/zerver/lib/db_connections.py
Signals: Django

```python
from django.db import connections


def reset_queries() -> None:
    for conn in connections.all():
        if conn.connection is not None:
            conn.connection.queries = []
```

--------------------------------------------------------------------------------

---[FILE: debug.py]---
Location: zulip-main/zerver/lib/debug.py
Signals: Django

```python
import code
import gc
import logging
import os
import signal
import socket
import threading
import traceback
import tracemalloc
from types import FrameType

from django.conf import settings
from django.utils.timezone import now as timezone_now

logger = logging.getLogger("zulip.debug")


# Interactive debugging code from
# https://stackoverflow.com/questions/132058/showing-the-stack-trace-from-a-running-python-application
# (that link also points to code for an interactive remote debugger
# setup, which we might want if we move Tornado to run in a daemon
# rather than via screen).
def interactive_debug(sig: int, frame: FrameType | None) -> None:
    """Interrupt running process, and provide a python prompt for
    interactive debugging."""
    d = {"_frame": frame}  # Allow access to frame object.
    if frame is not None:
        d.update(frame.f_globals)  # Unless shadowed by global
        d.update(frame.f_locals)

    message = "Signal received : entering python shell.\nTraceback:\n"
    message += "".join(traceback.format_stack(frame))
    i = code.InteractiveConsole(d)
    i.interact(message)


# SIGUSR1 => Just print the stack
# SIGUSR2 => Print stack + open interactive debugging shell
def interactive_debug_listen() -> None:
    signal.signal(signal.SIGUSR1, lambda sig, stack: traceback.print_stack(stack))
    signal.signal(signal.SIGUSR2, interactive_debug)


def tracemalloc_dump() -> None:
    if not tracemalloc.is_tracing():
        logger.warning("pid %s: tracemalloc off, nothing to dump", os.getpid())
        return
    # Despite our name for it, `timezone_now` always deals in UTC.
    basename = "snap.{}.{}".format(
        os.getpid(), timezone_now().replace(tzinfo=None).isoformat("-", "seconds")
    )
    path = os.path.join(settings.TRACEMALLOC_DUMP_DIR, basename)
    os.makedirs(settings.TRACEMALLOC_DUMP_DIR, exist_ok=True)

    gc.collect()
    tracemalloc.take_snapshot().dump(path)

    with open(f"/proc/{os.getpid()}/stat", "rb") as f:
        procstat = f.read().split()
    rss_pages = int(procstat[23])
    logger.info(
        "tracemalloc dump: tracing %s MiB (%s MiB peak), using %s MiB; rss %s MiB; dumped %s",
        tracemalloc.get_traced_memory()[0] // 1048576,
        tracemalloc.get_traced_memory()[1] // 1048576,
        tracemalloc.get_tracemalloc_memory() // 1048576,
        rss_pages // 256,
        basename,
    )


def tracemalloc_listen_sock(sock: socket.socket) -> None:
    logger.debug("pid %s: tracemalloc_listen_sock started!", os.getpid())
    while True:
        sock.recv(1)
        tracemalloc_dump()


listener_pid: int | None = None


def tracemalloc_listen() -> None:
    global listener_pid
    if listener_pid == os.getpid():
        # Already set up -- and in this process, not just its parent.
        return
    logger.debug("pid %s: tracemalloc_listen working...", os.getpid())
    listener_pid = os.getpid()

    sock = socket.socket(socket.AF_UNIX, socket.SOCK_DGRAM)
    os.makedirs(settings.TRACEMALLOC_DUMP_DIR, exist_ok=True)
    path = os.path.join(settings.TRACEMALLOC_DUMP_DIR, f"tracemalloc.{os.getpid()}")
    sock.bind(path)
    thread = threading.Thread(target=lambda: tracemalloc_listen_sock(sock), daemon=True)
    thread.start()
    logger.debug("pid %s: tracemalloc_listen done: %s", os.getpid(), path)


def maybe_tracemalloc_listen() -> None:
    """If tracemalloc tracing enabled, listen for requests to dump a snapshot.

    To trigger once this is listening:
      echo | socat -u stdin unix-sendto:/var/log/zulip/tracemalloc/tracemalloc.$pid

    To enable in the Zulip web server: edit /etc/zulip/uwsgi.ini ,
    and add e.g. ` PYTHONTRACEMALLOC=5` to the `env=` line.
    This function is called in middleware, so the process will
    automatically start listening.

    To enable in other contexts: see upstream docs
    https://docs.python.org/3/library/tracemalloc .
    You may also have to add a call to this function somewhere.

    """
    if os.environ.get("PYTHONTRACEMALLOC"):
        # If the server was started with `tracemalloc` tracing on, then
        # listen for a signal to dump `tracemalloc` snapshots.
        tracemalloc_listen()
```

--------------------------------------------------------------------------------

---[FILE: default_streams.py]---
Location: zulip-main/zerver/lib/default_streams.py

```python
from zerver.models import DefaultStream, Stream


def get_slim_realm_default_streams(realm_id: int) -> set[Stream]:
    # We really want this query to be simple and just get "thin" Stream objects
    # in one round trip.
    #
    # The above is enforced by at least three tests that verify query counts,
    # and test_query_count in test_subs.py makes sure that the query itself is
    # not like 11000 bytes, which is what we had in a prior version that used
    # select_related() with no arguments (and thus joined to too many tables).
    #
    # Please be careful about modifying this code, as it has had a history
    # of performance problems.
    return set(Stream.objects.filter(defaultstream__realm_id=realm_id))


def get_default_stream_ids_for_realm(realm_id: int) -> set[int]:
    return set(DefaultStream.objects.filter(realm_id=realm_id).values_list("stream_id", flat=True))
```

--------------------------------------------------------------------------------

---[FILE: demo_organizations.py]---
Location: zulip-main/zerver/lib/demo_organizations.py
Signals: Django

```python
import os
from functools import lru_cache

import orjson
from django.conf import settings
from django.utils.translation import gettext as _

from zerver.lib.exceptions import JsonableError
from zerver.models.realms import Realm


@lru_cache(None)
def get_demo_organization_wordlists() -> dict[str, list[str]]:
    path = os.path.join(settings.DEPLOY_ROOT, "zerver/lib", "demo_organization_words.json")
    with open(path, "rb") as reader:
        return orjson.loads(reader.read())


def demo_organization_owner_email_exists(realm: Realm) -> bool:
    human_owner_emails = set(realm.get_human_owner_users().values_list("delivery_email", flat=True))
    return human_owner_emails != {""}


def check_demo_organization_has_set_email(realm: Realm) -> None:
    # This should be called after checking that the realm has
    # a demo_organization_scheduled_deletion_date set.
    assert realm.demo_organization_scheduled_deletion_date is not None
    if not demo_organization_owner_email_exists(realm):
        raise JsonableError(_("Configure owner account email address."))
```

--------------------------------------------------------------------------------

````
