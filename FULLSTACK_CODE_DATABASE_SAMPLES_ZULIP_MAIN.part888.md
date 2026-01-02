---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 888
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 888 of 1290)

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

---[FILE: migration_status.py]---
Location: zulip-main/zerver/lib/migration_status.py
Signals: Django

```python
import os
import re
from importlib import import_module
from io import StringIO
from typing import Any, TypeAlias, TypedDict

from django.db import connection
from django.db.migrations.loader import MigrationLoader
from django.db.migrations.recorder import MigrationRecorder

AppMigrations: TypeAlias = dict[str, list[str]]


class MigrationStatusJson(TypedDict):
    migrations_by_app: AppMigrations
    zulip_version: str


STALE_MIGRATIONS = [
    # Ignore django-guardian, which we installed until 1.7.0~3134
    ("guardian", "0001_initial"),
    # Ignore django.contrib.sites, which we installed until 2.0.0-rc1~984.
    ("sites", "0001_initial"),
    ("sites", "0002_alter_domain_unique"),
    # These migrations (0002=>0028) were squashed into 0001, in 6fbddf578a6e
    # through a21f2d771553, 1.7.0~3135.
    ("zerver", "0002_django_1_8"),
    ("zerver", "0003_custom_indexes"),
    ("zerver", "0004_userprofile_left_side_userlist"),
    ("zerver", "0005_auto_20150920_1340"),
    ("zerver", "0006_zerver_userprofile_email_upper_idx"),
    ("zerver", "0007_userprofile_is_bot_active_indexes"),
    ("zerver", "0008_preregistrationuser_upper_email_idx"),
    ("zerver", "0009_add_missing_migrations"),
    ("zerver", "0010_delete_streamcolor"),
    ("zerver", "0011_remove_guardian"),
    ("zerver", "0012_remove_appledevicetoken"),
    ("zerver", "0013_realmemoji"),
    ("zerver", "0014_realm_emoji_url_length"),
    ("zerver", "0015_attachment"),
    ("zerver", "0016_realm_create_stream_by_admins_only"),
    ("zerver", "0017_userprofile_bot_type"),
    ("zerver", "0018_realm_emoji_message"),
    ("zerver", "0019_preregistrationuser_realm_creation"),
    ("zerver", "0020_add_tracking_attachment"),
    ("zerver", "0021_migrate_attachment_data"),
    ("zerver", "0022_subscription_pin_to_top"),
    ("zerver", "0023_userprofile_default_language"),
    ("zerver", "0024_realm_allow_message_editing"),
    ("zerver", "0025_realm_message_content_edit_limit"),
    ("zerver", "0026_delete_mituser"),
    ("zerver", "0027_realm_default_language"),
    ("zerver", "0028_userprofile_tos_version"),
    # This migration was in python-social-auth, and was mistakenly removed
    # from its `replaces` in
    # https://github.com/python-social-auth/social-app-django/pull/25
    ("default", "0005_auto_20160727_2333"),
    # This was a typo (twofactor for two_factor) corrected in
    # https://github.com/jazzband/django-two-factor-auth/pull/642
    ("twofactor", "0001_squashed_0008_delete_phonedevice"),
]


def get_migration_status(**options: Any) -> str:
    from django.apps import apps
    from django.core.management import call_command
    from django.db import DEFAULT_DB_ALIAS
    from django.utils.module_loading import module_has_submodule

    verbosity = options.get("verbosity", 1)

    for app_config in apps.get_app_configs():
        if module_has_submodule(app_config.module, "management"):
            import_module(".management", app_config.name)

    app_label = options["app_label"] if options.get("app_label") else None
    db = options.get("database", DEFAULT_DB_ALIAS)
    out = StringIO()
    command_args = ["--list"]
    if app_label:
        command_args.append(app_label)

    call_command(
        "showmigrations",
        *command_args,
        database=db,
        no_color=options.get("no_color", False),
        settings=options.get("settings", os.environ["DJANGO_SETTINGS_MODULE"]),
        stdout=out,
        skip_checks=options.get("skip_checks", True),
        traceback=options.get("traceback", True),
        verbosity=verbosity,
    )
    out.seek(0)
    output = out.read()
    return re.sub(r"\x1b\[[0-9;]*m", "", output)


def parse_migration_status(
    stale_migrations: list[tuple[str, str]] = STALE_MIGRATIONS,
) -> AppMigrations:
    """
    This is a copy of Django's `showmigrations` command, keep this in sync with
    the actual logic from Django. The key differences are, this returns a dict
    and filters out any migration found in the `stale_migrations` parameter.

    Django's `showmigrations`:
    https://github.com/django/django/blob/main/django/core/management/commands/showmigrations.py
    """
    # Load migrations from disk/DB
    loader = MigrationLoader(connection, ignore_no_migrations=True)
    recorder = MigrationRecorder(connection)
    recorded_migrations = recorder.applied_migrations()
    graph = loader.graph
    migrations_dict: AppMigrations = {}
    app_names = sorted(loader.migrated_apps)
    stale_migrations_dict: dict[str, list[str]] = {}

    for app, migration in stale_migrations:
        if app not in stale_migrations_dict:
            stale_migrations_dict[app] = []
        stale_migrations_dict[app].append(migration)

    # For each app, print its migrations in order from oldest (roots) to
    # newest (leaves).
    for app_name in app_names:
        migrations_dict[app_name] = []
        shown = set()
        apps_stale_migrations = stale_migrations_dict.get(app_name, [])
        for node in graph.leaf_nodes(app_name):
            for plan_node in graph.forwards_plan(node):
                if (
                    plan_node not in shown
                    and plan_node[0] == app_name
                    and plan_node[1] not in apps_stale_migrations
                ):
                    # Give it a nice title if it's a squashed one
                    title = plan_node[1]

                    if graph.nodes[plan_node].replaces:
                        title += f" ({len(graph.nodes[plan_node].replaces)} squashed migrations)"

                    applied_migration = loader.applied_migrations.get(plan_node)
                    # Mark it as applied/unapplied
                    if applied_migration:
                        if plan_node in recorded_migrations:
                            output = f"[X] {title}"
                        else:
                            output = f"[-] {title}"
                    else:
                        output = f"[ ] {title}"
                    migrations_dict[app_name].append(output)
                    shown.add(plan_node)
        # If there are no migrations, record as such
        if not shown:
            output = "(no migrations)"
            migrations_dict[app_name].append(output)
    return migrations_dict
```

--------------------------------------------------------------------------------

---[FILE: mime_types.py]---
Location: zulip-main/zerver/lib/mime_types.py

```python
import sys
from email.message import EmailMessage
from mimetypes import add_type
from mimetypes import guess_extension as guess_extension
from mimetypes import guess_type as guess_type

EXTRA_MIME_TYPES = [
    ("audio/flac", ".flac"),
    ("audio/mp4", ".m4a"),
    ("audio/wav", ".wav"),
    ("audio/webm", ".weba"),
    ("image/apng", ".apng"),
]

if sys.version_info < (3, 11):  # nocoverage
    # https://github.com/python/cpython/issues/89802
    EXTRA_MIME_TYPES += [
        ("image/avif", ".avif"),
        ("image/webp", ".webp"),
    ]

for mime_type, extension in EXTRA_MIME_TYPES:
    add_type(mime_type, extension)


AUDIO_INLINE_MIME_TYPES = [
    "audio/aac",
    "audio/flac",
    "audio/mp4",
    "audio/mpeg",
    "audio/wav",
    "audio/webm",
]

INLINE_MIME_TYPES = [
    *AUDIO_INLINE_MIME_TYPES,
    "application/pdf",
    "image/apng",
    "image/avif",
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/webp",
    "text/plain",
    "video/mp4",
    "video/webm",
    # To avoid cross-site scripting attacks, DO NOT add types such
    # as application/xhtml+xml, application/x-shockwave-flash,
    # image/svg+xml, text/html, or text/xml.
]


def bare_content_type(content_type: str) -> str:
    fake_msg = EmailMessage()
    fake_msg["content-type"] = content_type
    return fake_msg.get_content_type()
```

--------------------------------------------------------------------------------

---[FILE: mobile_auth_otp.py]---
Location: zulip-main/zerver/lib/mobile_auth_otp.py

```python
# Simple one-time-pad library, to be used for encrypting Zulip API
# keys when sending them to the mobile apps via new standard mobile
# authentication flow.  This encryption is used to protect against
# credential-stealing attacks where a malicious app registers the
# zulip:// URL on a device, which might otherwise allow it to hijack a
# user's API key.
#
# The decryption logic here isn't actually used by the flow; we just
# have it here as part of testing the overall library.

from zerver.models import UserProfile


def xor_hex_strings(bytes_a: str, bytes_b: str) -> str:
    """Given two hex strings of equal length, return a hex string with
    the bitwise xor of the two hex strings."""
    assert len(bytes_a) == len(bytes_b)
    return "".join(f"{int(x, 16) ^ int(y, 16):x}" for x, y in zip(bytes_a, bytes_b, strict=False))


def ascii_to_hex(input_string: str) -> str:
    """Given an ascii string, encode it as a hex string"""
    return input_string.encode().hex()


def hex_to_ascii(input_string: str) -> str:
    """Given a hex array, decode it back to a string"""
    return bytes.fromhex(input_string).decode()


def otp_encrypt_api_key(api_key: str, otp: str) -> str:
    assert len(otp) == UserProfile.API_KEY_LENGTH * 2
    hex_encoded_api_key = ascii_to_hex(api_key)
    assert len(hex_encoded_api_key) == UserProfile.API_KEY_LENGTH * 2
    return xor_hex_strings(hex_encoded_api_key, otp)


def otp_decrypt_api_key(otp_encrypted_api_key: str, otp: str) -> str:
    assert len(otp) == UserProfile.API_KEY_LENGTH * 2
    assert len(otp_encrypted_api_key) == UserProfile.API_KEY_LENGTH * 2
    hex_encoded_api_key = xor_hex_strings(otp_encrypted_api_key, otp)
    return hex_to_ascii(hex_encoded_api_key)


def is_valid_otp(otp: str) -> bool:
    try:
        assert len(otp) == UserProfile.API_KEY_LENGTH * 2
        [int(c, 16) for c in otp]
        return True
    except Exception:
        return False
```

--------------------------------------------------------------------------------

---[FILE: muted_users.py]---
Location: zulip-main/zerver/lib/muted_users.py

```python
from datetime import datetime

from zerver.lib.cache import cache_with_key, get_muting_users_cache_key
from zerver.lib.timestamp import datetime_to_timestamp
from zerver.lib.utils import assert_is_not_none
from zerver.models import MutedUser, UserProfile


def get_user_mutes(user_profile: UserProfile) -> list[dict[str, int]]:
    rows = MutedUser.objects.filter(user_profile=user_profile).values(
        "muted_user_id",
        "date_muted",
    )
    return [
        {
            "id": row["muted_user_id"],
            "timestamp": datetime_to_timestamp(assert_is_not_none(row["date_muted"])),
        }
        for row in rows
    ]


def add_user_mute(user_profile: UserProfile, muted_user: UserProfile, date_muted: datetime) -> None:
    MutedUser.objects.create(
        user_profile=user_profile,
        muted_user=muted_user,
        date_muted=date_muted,
    )


def get_mute_object(user_profile: UserProfile, muted_user: UserProfile) -> MutedUser | None:
    try:
        return MutedUser.objects.get(user_profile=user_profile, muted_user=muted_user)
    except MutedUser.DoesNotExist:
        return None


@cache_with_key(get_muting_users_cache_key, timeout=3600 * 24 * 7)
def get_muting_users(muted_user_id: int) -> set[int]:
    """
    This is kind of the inverse of `get_user_mutes` above.
    While `get_user_mutes` is mainly used for event system work,
    this is used in the message send codepath, to get a list
    of IDs of users who have muted a particular user.
    The result will also include deactivated users.
    """
    rows = MutedUser.objects.filter(
        muted_user_id=muted_user_id,
    ).values("user_profile_id")
    return {row["user_profile_id"] for row in rows}
```

--------------------------------------------------------------------------------

---[FILE: name_restrictions.py]---
Location: zulip-main/zerver/lib/name_restrictions.py
Signals: Django

```python
from disposable_email_domains import blocklist
from django.conf import settings


def is_reserved_subdomain(subdomain: str) -> bool:
    if subdomain == settings.SOCIAL_AUTH_SUBDOMAIN:
        return True
    if subdomain == settings.SELF_HOSTING_MANAGEMENT_SUBDOMAIN:
        return True
    if subdomain in ZULIP_RESERVED_SUBDOMAINS:
        return True
    if subdomain.endswith("s") and subdomain.removesuffix("s") in ZULIP_RESERVED_SUBDOMAINS:
        return True
    if subdomain in GENERIC_RESERVED_SUBDOMAINS:
        return True
    if subdomain.endswith("s") and subdomain.removesuffix("s") in GENERIC_RESERVED_SUBDOMAINS:
        return True
    if settings.CORPORATE_ENABLED and ("zulip" in subdomain or "kandra" in subdomain):
        return True
    return False


def is_disposable_domain(domain: str) -> bool:
    if domain.lower() in OVERRIDE_ALLOW_EMAIL_DOMAINS:
        return False
    return domain.lower() in DISPOSABLE_DOMAINS


ZULIP_RESERVED_SUBDOMAINS = {
    # Zulip terms
    "stream",
    "channel",
    "topic",
    "thread",
    "installation",
    "organization",
    "your-org",
    "realm",
    "team",
    "subdomain",
    "activity",
    "octopus",
    "acme",
    "push",
    # machines
    "zulipdev",
    "localhost",
    "staging",
    "prod",
    "production",
    "testing",
    "nagios",
    "nginx",
    "mg",
    "front-mail",
    # website pages
    "server",
    "client",
    "features",
    "integration",
    "bot",
    "blog",
    "history",
    "story",
    "stories",
    "testimonial",
    "compare",
    "for",
    "vs",
    # competitor pages
    "slack",
    "mattermost",
    "rocketchat",
    "irc",
    "twitter",
    "zephyr",
    "flowdock",
    "spark",
    "skype",
    "microsoft",
    "twist",
    "ryver",
    "matrix",
    "discord",
    "email",
    "usenet",
    # Zulip names
    "zulip",
    "tulip",
    "humbug",
    # platforms
    "plan9",
    "electron",
    "linux",
    "mac",
    "windows",
    "cli",
    "ubuntu",
    "android",
    "ios",
    # floss
    "contribute",
    "floss",
    "foss",
    "free",
    "opensource",
    "open",
    "code",
    "license",
    # internship programs
    "intern",
    "outreachy",
    "gsoc",
    "externship",
    # Things that sound like security
    "auth",
    "authentication",
    "security",
    # tech blogs
    "engineering",
    "infrastructure",
    "tooling",
    "tools",
    "javascript",
    "python",
}

# Most of this list was curated from the following sources:
# http://wiki.dwscoalition.org/notes/List_of_reserved_subdomains (license: CC-BY-SA 3.0)
# https://stackoverflow.com/questions/11868191/which-saas-subdomains-to-block (license: CC-BY-SA 2.5)
GENERIC_RESERVED_SUBDOMAINS = {
    "about",
    "abuse",
    "account",
    "ad",
    "admanager",
    "admin",
    "admindashboard",
    "administrator",
    "adsense",
    "advice",
    "adword",
    "affiliate",
    "alpha",
    "anonymous",
    "api",
    "assets",
    "audio",
    "avatar",
    "badges",
    "beta",
    "billing",
    "biz",
    "blog",
    "board",
    "bookmark",
    "bot",
    "bugs",
    "buy",
    "cache",
    "calendar",
    "chat",
    "clients",
    "cname",
    "code",
    "comment",
    "communities",
    "community",
    "contact",
    "contributor",
    "control",
    "coppa",
    "copyright",
    "cpanel",
    "css",
    "cssproxy",
    "customer",
    "customise",
    "customize",
    "dashboard",
    "data",
    "demo",
    "deploy",
    "deployment",
    "desktop",
    "dev",
    "devel",
    "developer",
    "development",
    "discussion",
    "diversity",
    "dmca",
    "docs",
    "donate",
    "download",
    "e-mail",
    "email",
    "embed",
    "embedded",
    "example",
    "explore",
    "faq",
    "favorite",
    "favourites",
    "features",
    "feed",
    "feedback",
    "files",
    "forum",
    "friend",
    "ftp",
    "general",
    "gettingstarted",
    "gift",
    "git",
    "global",
    "graphs",
    "guide",
    "hack",
    "hello",
    "help",
    "home",
    "hostmaster",
    "https",
    "icon",
    "im",
    "image",
    "img",
    "inbox",
    "index",
    "investors",
    "invite",
    "invoice",
    "ios",
    "ipad",
    "iphone",
    "irc",
    "jabber",
    "jars",
    "jobs",
    "join",
    "js",
    "kb",
    "knowledgebase",
    "launchpad",
    "legal",
    "livejournal",
    "lj",
    "login",
    "logs",
    "m",
    "mail",
    "main",
    "manage",
    "map",
    "media",
    "memories",
    "memory",
    "merchandise",
    "messages",
    "mobile",
    "my",
    "mystore",
    "networks",
    "new",
    "newsite",
    "onboarding",
    "official",
    "ogg",
    "online",
    "order",
    "paid",
    "panel",
    "partner",
    "partnerpage",
    "pay",
    "payment",
    "picture",
    "policy",
    "pop",
    "popular",
    "portal",
    "post",
    "postmaster",
    "press",
    "pricing",
    "principles",
    "privacy",
    "private",
    "profile",
    "public",
    "question",
    "random",
    "redirect",
    "register",
    "registration",
    "resolver",
    "root",
    "rss",
    "s",
    "sandbox",
    "school",
    "search",
    "secure",
    "servers",
    "service",
    "setting",
    "shop",
    "shortcuts",
    "signin",
    "signup",
    "sitemap",
    "sitenews",
    "sites",
    "sms",
    "smtp",
    "sorry",
    "ssl",
    "staff",
    "stage",
    "staging",
    "stars",
    "stat",
    "static",
    "statistics",
    "status",
    "store",
    "style",
    "support",
    "surveys",
    "svn",
    "syn",
    "syndicated",
    "system",
    "tag",
    "talk",
    "team",
    "termsofservice",
    "test",
    "testers",
    "ticket",
    "tool",
    "tos",
    "trac",
    "translate",
    "update",
    "upgrade",
    "uploads",
    "use",
    "user",
    "username",
    "validation",
    "videos",
    "volunteer",
    "web",
    "webdisk",
    "webmail",
    "webmaster",
    "welcome",
    "whm",
    "whois",
    "wiki",
    "www",
    "www0",
    "www8",
    "www9",
    "xml",
    "xmpp",
    "xoxo",
}

DISPOSABLE_DOMAINS = set(blocklist)

OVERRIDE_ALLOW_EMAIL_DOMAINS = {
    "airsi.de",
    # Controlled by https://www.abine.com; more legitimate than most
    # disposable domains
    "opayq.com",
    "abinemail.com",
    "blurmail.net",
    "maskmemail.com",
}
```

--------------------------------------------------------------------------------

````
