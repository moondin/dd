---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 925
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 925 of 1290)

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

---[FILE: change_auth_backends.py]---
Location: zulip-main/zerver/management/commands/change_auth_backends.py
Signals: Django

```python
from argparse import ArgumentParser
from typing import Any

from django.core.management.base import CommandError
from typing_extensions import override

from zerver.actions.realm_settings import do_set_realm_authentication_methods
from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    help = """Enable or disable an authentication backend for a realm"""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        self.add_realm_args(parser, required=True)
        group = parser.add_mutually_exclusive_group(required=True)
        group.add_argument(
            "--enable",
            help="Name of the authentication backend to enable",
        )
        group.add_argument(
            "--disable",
            help="Name of the authentication backend to disable",
        )
        group.add_argument(
            "--show",
            action="store_true",
            help="Show current authentication backends for the realm",
        )

    @override
    def handle(self, *args: Any, **options: str) -> None:
        realm = self.get_realm(options)
        assert realm is not None  # Should be ensured by parser

        auth_methods = realm.authentication_methods_dict()

        if options["show"]:
            print("Current authentication backends for the realm:")
            print_auth_methods_dict(auth_methods)
            return

        if options["enable"]:
            backend_name = options["enable"]
            check_backend_name_valid(backend_name, auth_methods)

            auth_methods[backend_name] = True
            print(f"Enabling {backend_name} backend for realm {realm.name}")
        elif options["disable"]:
            backend_name = options["disable"]
            check_backend_name_valid(backend_name, auth_methods)

            auth_methods[backend_name] = False
            print(f"Disabling {backend_name} backend for realm {realm.name}")

        do_set_realm_authentication_methods(realm, auth_methods, acting_user=None)

        print("Updated authentication backends for the realm:")
        print_auth_methods_dict(realm.authentication_methods_dict())
        print("Done!")


def check_backend_name_valid(backend_name: str, auth_methods_dict: dict[str, bool]) -> None:
    if backend_name not in auth_methods_dict:
        raise CommandError(
            f"Backend {backend_name} is not a valid authentication backend. Valid backends: {list(auth_methods_dict.keys())}"
        )


def print_auth_methods_dict(auth_methods: dict[str, bool]) -> None:
    enabled_backends = [backend for backend, enabled in auth_methods.items() if enabled]
    disabled_backends = [backend for backend, enabled in auth_methods.items() if not enabled]

    if enabled_backends:
        print("Enabled backends:")
        for backend in enabled_backends:
            print(f"  {backend}")

    if disabled_backends:
        print("Disabled backends:")
        for backend in disabled_backends:
            print(f"  {backend}")
```

--------------------------------------------------------------------------------

---[FILE: change_password.py]---
Location: zulip-main/zerver/management/commands/change_password.py
Signals: Django

```python
import getpass
from argparse import ArgumentParser
from typing import Any

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.management.base import CommandError
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    # This is our version of the original Django changepassword command adjusted
    # to be able to find UserProfiles by email+realm.
    # We change the arguments the command takes to fit our
    # model of username+realm and change accordingly the
    # logic inside the handle method which fetches the user
    # from the database. The rest of the logic remains unchanged.

    help = "Change a user's password."
    requires_migrations_checks = True
    requires_system_checks: list[str] = []

    def _get_pass(self, prompt: str = "Password: ") -> str:
        p = getpass.getpass(prompt=prompt)
        if not p:
            raise CommandError("aborted")
        return p

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("email", metavar="<email>", help="email of user to change role")
        self.add_realm_args(parser, required=True)

    @override
    def handle(self, *args: Any, **options: Any) -> str:
        email = options["email"]
        realm = self.get_realm(options)

        u = self.get_user(email, realm)

        # Code below is taken from the Django version of this command:
        self.stdout.write(f"Changing password for user '{u}'")

        MAX_TRIES = 3
        count = 0
        p1, p2 = "1", "2"  # To make them initially mismatch.
        password_validated = False
        while (p1 != p2 or not password_validated) and count < MAX_TRIES:
            p1 = self._get_pass()
            p2 = self._get_pass("Password (again): ")
            if p1 != p2:
                self.stdout.write("Passwords do not match. Please try again.")
                count += 1
                # Don't validate passwords that don't match.
                continue
            try:
                validate_password(p2, u)
            except ValidationError as err:
                self.stderr.write("\n".join(err.messages))
                count += 1
            else:
                password_validated = True

        if count == MAX_TRIES:
            raise CommandError(f"Aborting password change for user '{u}' after {count} attempts")

        u.set_password(p1)
        u.save()

        return f"Password changed successfully for user '{u}'"
```

--------------------------------------------------------------------------------

---[FILE: change_realm_subdomain.py]---
Location: zulip-main/zerver/management/commands/change_realm_subdomain.py
Signals: Django

```python
from argparse import ArgumentParser
from typing import Any

from django.core.exceptions import ValidationError
from django.core.management.base import CommandError
from typing_extensions import override

from zerver.actions.create_realm import do_change_realm_subdomain
from zerver.forms import check_subdomain_available
from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    help = """Change realm's subdomain."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        self.add_realm_args(parser, required=True)
        parser.add_argument("new_subdomain", metavar="<new subdomain>", help="realm new subdomain")
        parser.add_argument(
            "--skip-redirect",
            action="store_true",
            help="Do not redirect the old name to the new one",
        )
        parser.add_argument(
            "--allow-reserved-subdomain",
            action="store_true",
            help="Allow use of reserved subdomains",
        )

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        realm = self.get_realm(options)
        assert realm is not None  # Should be ensured by parser

        new_subdomain = options["new_subdomain"]
        allow_reserved_subdomain = options["allow_reserved_subdomain"]
        try:
            check_subdomain_available(new_subdomain, allow_reserved_subdomain)
        except ValidationError as error:
            raise CommandError(error.message)
        do_change_realm_subdomain(
            realm,
            new_subdomain,
            acting_user=None,
            add_deactivated_redirect=not options["skip_redirect"],
        )
        print("Done!")
```

--------------------------------------------------------------------------------

---[FILE: change_user_email.py]---
Location: zulip-main/zerver/management/commands/change_user_email.py

```python
from argparse import ArgumentParser
from typing import Any

from typing_extensions import override

from zerver.actions.user_settings import do_change_user_delivery_email
from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    help = """Change the email address for a user."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        self.add_realm_args(parser)
        parser.add_argument("old_email", metavar="<old email>", help="email address to change")
        parser.add_argument("new_email", metavar="<new email>", help="new email address")

    @override
    def handle(self, *args: Any, **options: str) -> None:
        old_email = options["old_email"]
        new_email = options["new_email"]

        realm = self.get_realm(options)
        user_profile = self.get_user(old_email, realm)

        do_change_user_delivery_email(user_profile, new_email, acting_user=None)
```

--------------------------------------------------------------------------------

---[FILE: change_user_role.py]---
Location: zulip-main/zerver/management/commands/change_user_role.py
Signals: Django

```python
from argparse import ArgumentParser
from typing import Any

from django.conf import settings
from django.core.management.base import CommandError
from typing_extensions import override

from zerver.actions.users import (
    do_change_can_change_user_emails,
    do_change_can_create_users,
    do_change_can_forge_sender,
    do_change_user_role,
)
from zerver.lib.exceptions import JsonableError
from zerver.lib.management import ZulipBaseCommand
from zerver.models import UserProfile

ROLE_CHOICES = [
    "owner",
    "admin",
    "moderator",
    "member",
    "guest",
    "can_forge_sender",
    "can_create_users",
    "can_change_user_emails",
]


class Command(ZulipBaseCommand):
    help = """Change role of an existing user in their (own) Realm.

ONLY perform this on customer request from an authorized person.
"""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("email", metavar="<email>", help="email of user to change role")
        parser.add_argument(
            "new_role",
            metavar="<new_role>",
            choices=ROLE_CHOICES,
            help="new role of the user; choose from " + ", ".join(ROLE_CHOICES),
        )
        parser.add_argument(
            "--revoke",
            dest="grant",
            action="store_false",
            help="Remove can_forge_sender or can_create_users permission.",
        )
        self.add_realm_args(parser, required=True)

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        email = options["email"]
        realm = self.get_realm(options)
        assert realm is not None
        user = self.get_user(email, realm)

        user_role_map = {
            "owner": UserProfile.ROLE_REALM_OWNER,
            "admin": UserProfile.ROLE_REALM_ADMINISTRATOR,
            "moderator": UserProfile.ROLE_MODERATOR,
            "member": UserProfile.ROLE_MEMBER,
            "guest": UserProfile.ROLE_GUEST,
        }

        if options["new_role"] not in [
            "can_forge_sender",
            "can_create_users",
            "can_change_user_emails",
        ]:
            new_role = user_role_map[options["new_role"]]
            if not options["grant"]:
                raise CommandError(
                    "Revoke not supported with this permission; please specify new role."
                )
            if new_role == user.role:
                raise CommandError("User already has this role.")
            if settings.BILLING_ENABLED and user.is_guest:
                from corporate.lib.registration import (
                    check_spare_license_available_for_changing_guest_user_role,
                )

                try:
                    check_spare_license_available_for_changing_guest_user_role(realm)
                except JsonableError:
                    raise CommandError(
                        "This realm does not have enough licenses to change a guest user's role."
                    )
            old_role_name = UserProfile.ROLE_ID_TO_NAME_MAP[user.role]
            do_change_user_role(user, new_role, acting_user=None)
            new_role_name = UserProfile.ROLE_ID_TO_NAME_MAP[user.role]
            print(
                f"Role for {user.delivery_email} changed from {old_role_name} to {new_role_name}."
            )
            return

        if options["new_role"] == "can_forge_sender":
            if user.can_forge_sender and options["grant"]:
                raise CommandError("User can already forge messages for this realm.")
            elif not user.can_forge_sender and not options["grant"]:
                raise CommandError("User can't forge messages for this realm.")
            do_change_can_forge_sender(user, options["grant"])

            granted_text = "have" if options["grant"] else "not have"
            print(
                f"{user.delivery_email} changed to {granted_text} {options['new_role']} permission."
            )
        elif options["new_role"] == "can_create_users":
            if user.can_create_users and options["grant"]:
                raise CommandError("User can already create users for this realm.")
            elif not user.can_create_users and not options["grant"]:
                raise CommandError("User can't create users for this realm.")
            do_change_can_create_users(user, options["grant"])
        elif options["new_role"] == "can_change_user_emails":
            if user.can_change_user_emails and options["grant"]:
                raise CommandError("User can already change user emails for this realm.")
            elif not user.can_change_user_emails and not options["grant"]:
                raise CommandError("User can't change user emails for this realm.")
            do_change_can_change_user_emails(user, options["grant"])
```

--------------------------------------------------------------------------------

---[FILE: check_redis.py]---
Location: zulip-main/zerver/management/commands/check_redis.py
Signals: Django

```python
import logging
import time
from collections.abc import Callable
from typing import Any

from django.conf import settings
from django.core.management.base import CommandError, CommandParser
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand
from zerver.lib.partial import partial
from zerver.lib.rate_limiter import RateLimitedUser, client
from zerver.models.users import get_user_profile_by_id


class Command(ZulipBaseCommand):
    help = """Checks Redis to make sure our rate limiting system hasn't grown a bug
    and left Redis with a bunch of data

    Usage: ./manage.py [--trim] check_redis"""

    @override
    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument("-t", "--trim", action="store_true", help="Actually trim excess")

    def _check_within_range(
        self,
        key: bytes,
        count_func: Callable[[], int],
        trim_func: Callable[[bytes, int], object] | None = None,
    ) -> None:
        user_id = int(key.split(b":")[2])
        user = get_user_profile_by_id(user_id)
        entity = RateLimitedUser(user)
        max_calls = entity.max_api_calls()

        age = int(client.ttl(key))
        if age < 0:
            logging.error("Found key with age of %s, will never expire: %s", age, key)

        count = count_func()
        if count > max_calls:
            logging.error(
                "Redis health check found key with more elements \
than max_api_calls! (trying to trim) %s %s",
                key,
                count,
            )
            if trim_func is not None:
                client.expire(key, entity.max_api_window())
                trim_func(key, max_calls)

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        if not settings.RATE_LIMITING:
            raise CommandError("This machine is not using Redis or rate limiting, aborting")

        # Find all keys, and make sure they're all within size constraints
        wildcard_list = "ratelimit:*:*:*:list"
        wildcard_zset = "ratelimit:*:*:*:zset"

        trim_func: Callable[[bytes, int], object] | None = lambda key, max_calls: client.ltrim(
            key, 0, max_calls - 1
        )
        if not options["trim"]:
            trim_func = None

        lists = client.keys(wildcard_list)
        for list_name in lists:
            self._check_within_range(list_name, partial(client.llen, list_name), trim_func)

        zsets = client.keys(wildcard_zset)
        for zset in zsets:
            now = time.time()
            # We can warn on our zset being too large, but we don't know what
            # elements to trim. We'd have to go through every list item and take
            # the intersection. The best we can do is expire it
            self._check_within_range(
                zset,
                partial(client.zcount, zset, 0, now),
                lambda key, max_calls: None,
            )
```

--------------------------------------------------------------------------------

---[FILE: compilemessages.py]---
Location: zulip-main/zerver/management/commands/compilemessages.py
Signals: Django

```python
import os
import re
import unicodedata
from subprocess import CalledProcessError, check_output
from typing import Any

import orjson
import polib
from django.conf import settings
from django.conf.locale import LANG_INFO
from django.core.management.base import CommandParser
from django.core.management.commands import compilemessages
from django.utils.translation import gettext as _
from django.utils.translation import override as override_language
from django.utils.translation import to_language
from pyuca import Collator
from typing_extensions import override


class Command(compilemessages.Command):
    @override
    def add_arguments(self, parser: CommandParser) -> None:
        super().add_arguments(parser)

        parser.add_argument(
            "--strict", "-s", action="store_true", help="Stop execution in case of errors."
        )

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        super().handle(*args, **options)
        self.strict = options["strict"]
        self.extract_language_options()
        self.create_language_name_map()

    def create_language_name_map(self) -> None:
        join = os.path.join
        deploy_root = settings.DEPLOY_ROOT
        path = join(deploy_root, "locale", "language_options.json")
        output_path = join(deploy_root, "locale", "language_name_map.json")

        with open(path, "rb") as reader:
            languages = orjson.loads(reader.read())
            lang_list = []
            for lang_info in languages["languages"]:
                lang_info["name"] = lang_info["name_local"]
                del lang_info["name_local"]
                lang_list.append(lang_info)

            collator = Collator()
            lang_list.sort(key=lambda lang: collator.sort_key(lang["name"]))

        with open(output_path, "wb") as output_file:
            output_file.write(
                orjson.dumps(
                    {"name_map": lang_list},
                    option=orjson.OPT_APPEND_NEWLINE | orjson.OPT_INDENT_2 | orjson.OPT_SORT_KEYS,
                )
            )

    def get_po_filename(self, locale_path: str, locale: str) -> str:
        po_template = "{}/{}/LC_MESSAGES/django.po"
        return po_template.format(locale_path, locale)

    def get_json_filename(self, locale_path: str, locale: str) -> str:
        return f"{locale_path}/{locale}/translations.json"

    def get_name_from_po_file(self, po_filename: str, locale: str) -> str:
        try:
            team = polib.pofile(po_filename).metadata["Language-Team"]
            return team[: team.rindex(" <")]
        except (KeyError, ValueError):
            raise Exception(f"Unknown language {locale}")

    def get_locales(self) -> list[str]:
        output = check_output(["git", "ls-files", "locale"], text=True)
        tracked_files = output.split()
        regex = re.compile(r"locale/(\w+)/LC_MESSAGES/django.po")
        locales = ["en"]
        for tracked_file in tracked_files:
            matched = regex.search(tracked_file)
            if matched:
                locales.append(matched.group(1))

        return locales

    def extract_language_options(self) -> None:
        locale_path = f"{settings.DEPLOY_ROOT}/locale"
        output_path = f"{locale_path}/language_options.json"

        data: dict[str, list[dict[str, Any]]] = {"languages": []}

        try:
            locales = self.get_locales()
        except CalledProcessError:
            # In case we are not under a Git repo, fallback to getting the
            # locales using listdir().
            locales = os.listdir(locale_path)
            locales.append("en")
            locales = list(set(locales))

        for locale in sorted(locales):
            if locale == "en":
                data["languages"].append(
                    {
                        "name": "English",
                        "name_local": "English",
                        "code": "en",
                        "locale": "en",
                    }
                )
                continue

            lc_messages_path = os.path.join(locale_path, locale, "LC_MESSAGES")
            if not os.path.exists(lc_messages_path):
                # Not a locale.
                continue

            info: dict[str, Any] = {}
            code = to_language(locale)
            percentage = self.get_translation_percentage(locale_path, locale)
            try:
                name = LANG_INFO[code]["name"]
                name_local = LANG_INFO[code]["name_local"]
            except KeyError:
                # Fallback to getting the name from PO file.
                filename = self.get_po_filename(locale_path, locale)
                name = self.get_name_from_po_file(filename, locale)
                with override_language(code):
                    name_local = _(name)

            info["name"] = unicodedata.normalize("NFC", name)
            info["name_local"] = unicodedata.normalize("NFC", name_local)
            info["code"] = code
            info["locale"] = locale
            info["percent_translated"] = percentage
            data["languages"].append(info)

        with open(output_path, "wb") as writer:
            writer.write(
                orjson.dumps(
                    data,
                    option=orjson.OPT_APPEND_NEWLINE | orjson.OPT_INDENT_2 | orjson.OPT_SORT_KEYS,
                )
            )

    def get_translation_percentage(self, locale_path: str, locale: str) -> int:
        # backend stats
        po = polib.pofile(self.get_po_filename(locale_path, locale))
        not_translated = len(po.untranslated_entries())
        total = len(po.translated_entries()) + not_translated

        # frontend stats
        with open(self.get_json_filename(locale_path, locale), "rb") as reader:
            for value in orjson.loads(reader.read()).values():
                total += 1
                if value == "":
                    not_translated += 1

        return (total - not_translated) * 100 // total
```

--------------------------------------------------------------------------------

---[FILE: convert_mattermost_data.py]---
Location: zulip-main/zerver/management/commands/convert_mattermost_data.py
Signals: Django

```python
import argparse
import os
from typing import Any

from typing_extensions import override

"""
Example usage for testing purposes. For testing data see the mattermost_fixtures
in zerver/tests/.

    ./manage.py convert_mattermost_data mattermost_fixtures --output mm_export
    ./manage.py import --destroy-rebuild-database mattermost mm_export/gryffindor

Test out the realm:
    ./tools/run-dev
    go to browser and use your dev url
"""

from django.core.management.base import CommandError, CommandParser

from zerver.data_import.mattermost import do_convert_data
from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    help = """Convert the mattermost data into Zulip data format."""

    @override
    def add_arguments(self, parser: CommandParser) -> None:
        dir_help = (
            "Directory containing exported JSON file and exported_emoji (optional) directory."
        )
        parser.add_argument(
            "mattermost_data_dir", metavar="<mattermost data directory>", help=dir_help
        )

        parser.add_argument(
            "--output", dest="output_dir", help="Directory to write converted data to."
        )

        parser.add_argument(
            "--mask",
            dest="masking_content",
            action="store_true",
            help="Mask the content for privacy during QA.",
        )

        parser.formatter_class = argparse.RawTextHelpFormatter

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        output_dir = options["output_dir"]
        if output_dir is None:
            raise CommandError("You need to specify --output <output directory>")

        if os.path.exists(output_dir) and not os.path.isdir(output_dir):
            raise CommandError(output_dir + " is not a directory")

        os.makedirs(output_dir, exist_ok=True)

        if os.listdir(output_dir):
            raise CommandError("Output directory should be empty!")
        output_dir = os.path.realpath(output_dir)

        data_dir = options["mattermost_data_dir"]
        if not os.path.exists(data_dir):
            raise CommandError(f"Directory not found: '{data_dir}'")
        data_dir = os.path.realpath(data_dir)

        print("Converting data ...")
        do_convert_data(
            mattermost_data_dir=data_dir,
            output_dir=output_dir,
            masking_content=options.get("masking_content", False),
        )
```

--------------------------------------------------------------------------------

---[FILE: convert_microsoft_teams_data.py]---
Location: zulip-main/zerver/management/commands/convert_microsoft_teams_data.py
Signals: Django

```python
import argparse
import os
import tempfile
from typing import Any

from django.conf import settings
from django.core.management.base import CommandError, CommandParser
from typing_extensions import override

from zerver.data_import.microsoft_teams import do_convert_directory
from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    help = """Convert the Microsoft Teams data into Zulip data format."""

    @override
    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument(
            "microsoft_teams_data_path",
            nargs="+",
            metavar="<Microsoft Teams data path>",
            help="Zipped Microsoft Teams data or directory",
        )

        parser.add_argument(
            "--output", dest="output_dir", help="Directory to write exported data to."
        )

        parser.add_argument(
            "--token",
            metavar="<microsoft_graph_api_token>",
            help="Microsoft Graph API token, see https://learn.microsoft.com/en-us/graph/auth-v2-service?tabs=http",
        )

        parser.add_argument(
            "--threads",
            default=settings.DEFAULT_DATA_EXPORT_IMPORT_PARALLELISM,
            help="Threads to use in exporting UserMessage objects in parallel",
        )

        parser.formatter_class = argparse.RawTextHelpFormatter

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        output_dir = options["output_dir"]
        if output_dir is None:
            output_dir = tempfile.mkdtemp(prefix="converted-ms-teams-data-")
        else:
            output_dir = os.path.realpath(output_dir)

        token = options["token"]
        if token is None:
            raise CommandError("Enter Microsoft Graph API token!")

        num_threads = int(options["threads"])
        if num_threads < 1:
            raise CommandError("You must have at least one thread.")

        for path in options["microsoft_teams_data_path"]:
            if not os.path.exists(path):
                raise CommandError(f"Microsoft Teams data file or directory not found: '{path}'")

            print("Converting data ...")
            if os.path.isdir(path):
                print(path)
                do_convert_directory(
                    path,
                    output_dir,
                    token,
                    threads=num_threads,
                )
            elif os.path.isfile(path) and path.endswith(".zip"):
                raise ValueError(
                    "Importing .zip Microsoft Teams data is not yet supported, please try again with the extracted data."
                )
            else:
                raise ValueError(f"Don't know how to import Microsoft Teams data from {path}")
```

--------------------------------------------------------------------------------

---[FILE: convert_rocketchat_data.py]---
Location: zulip-main/zerver/management/commands/convert_rocketchat_data.py
Signals: Django

```python
import argparse
import os
from typing import Any

from django.core.management.base import CommandError, CommandParser
from typing_extensions import override

from zerver.data_import.rocketchat import do_convert_data
from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    help = """Convert the Rocketchat data into Zulip data format."""

    @override
    def add_arguments(self, parser: CommandParser) -> None:
        dir_help = "Directory containing all the `bson` files from mongodb dump of rocketchat."
        parser.add_argument(
            "rocketchat_data_dir", metavar="<rocketchat data directory>", help=dir_help
        )

        parser.add_argument(
            "--output", dest="output_dir", help="Directory to write converted data to."
        )

        parser.formatter_class = argparse.RawTextHelpFormatter

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        output_dir = options["output_dir"]
        if output_dir is None:
            raise CommandError("You need to specify --output <output directory>")

        if os.path.exists(output_dir) and not os.path.isdir(output_dir):
            raise CommandError(output_dir + " is not a directory")

        os.makedirs(output_dir, exist_ok=True)

        if os.listdir(output_dir):
            raise CommandError("Output directory should be empty!")
        output_dir = os.path.realpath(output_dir)

        data_dir = options["rocketchat_data_dir"]
        if not os.path.exists(data_dir):
            raise CommandError(f"Directory not found: '{data_dir}'")
        data_dir = os.path.realpath(data_dir)

        print("Converting Data ...")
        do_convert_data(rocketchat_data_dir=data_dir, output_dir=output_dir)
```

--------------------------------------------------------------------------------

---[FILE: convert_slack_data.py]---
Location: zulip-main/zerver/management/commands/convert_slack_data.py
Signals: Django

```python
import argparse
import os
import tempfile
from typing import Any

from django.conf import settings
from django.core.management.base import CommandError, CommandParser
from typing_extensions import override

from zerver.data_import.slack import do_convert_directory, do_convert_zipfile
from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    help = """Convert the Slack data into Zulip data format."""

    @override
    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument(
            "slack_data_path",
            nargs="+",
            metavar="<Slack data path>",
            help="Zipped Slack data or directory",
        )

        parser.add_argument(
            "--token", metavar="<slack_token>", help="Bot user OAuth token, starting xoxb-"
        )

        parser.add_argument(
            "--output", dest="output_dir", help="Directory to write exported data to."
        )

        parser.add_argument(
            "--processes",
            default=settings.DEFAULT_DATA_EXPORT_IMPORT_PARALLELISM,
            help="Processes to use in exporting UserMessage objects in parallel",
        )

        parser.add_argument(
            "--no-convert-slack-threads",
            action="store_true",
            help="If specified, do not convert Slack threads to separate Zulip topics",
        )

        parser.formatter_class = argparse.RawTextHelpFormatter

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        output_dir = options["output_dir"]
        if output_dir is None:
            output_dir = tempfile.mkdtemp(prefix="converted-slack-data-")
        else:
            output_dir = os.path.realpath(output_dir)

        token = options["token"]
        if token is None:
            raise CommandError("Enter Slack legacy token!")

        num_processes = int(options["processes"])
        if num_processes < 1:
            raise CommandError("You must have at least one process.")

        for path in options["slack_data_path"]:
            if not os.path.exists(path):
                raise CommandError(f"Slack data file or directory not found: '{path}'")

            print("Converting data ...")
            convert_slack_threads = not options["no_convert_slack_threads"]
            if os.path.isdir(path):
                do_convert_directory(
                    path,
                    output_dir,
                    token,
                    processes=num_processes,
                    convert_slack_threads=convert_slack_threads,
                )
            elif os.path.isfile(path) and path.endswith(".zip"):
                do_convert_zipfile(
                    path,
                    output_dir,
                    token,
                    processes=num_processes,
                    convert_slack_threads=convert_slack_threads,
                )
            else:
                raise ValueError(f"Don't know how to import Slack data from {path}")
```

--------------------------------------------------------------------------------

---[FILE: create_default_stream_groups.py]---
Location: zulip-main/zerver/management/commands/create_default_stream_groups.py

```python
from argparse import ArgumentParser
from typing import Any

from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand
from zerver.lib.streams import ensure_stream
from zerver.models import DefaultStreamGroup


class Command(ZulipBaseCommand):
    help = """
Create default stream groups which the users can choose during sign up.

./manage.py create_default_stream_groups -s gsoc-1,gsoc-2,gsoc-3 -d "Google summer of code"  -r zulip
"""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        self.add_realm_args(parser, required=True)

        parser.add_argument(
            "-n",
            "--name",
            required=True,
            help="Name of the group you want to create.",
        )

        parser.add_argument(
            "-d",
            "--description",
            required=True,
            help="Description of the group.",
        )

        parser.add_argument(
            "-s", "--streams", required=True, help="A comma-separated list of stream names."
        )

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        realm = self.get_realm(options)
        assert realm is not None  # Should be ensured by parser

        streams = []
        stream_names = {stream.strip() for stream in options["streams"].split(",")}
        for stream_name in stream_names:
            stream = ensure_stream(realm, stream_name, acting_user=None)
            streams.append(stream)

        try:
            default_stream_group = DefaultStreamGroup.objects.get(
                name=options["name"], realm=realm, description=options["description"]
            )
        except DefaultStreamGroup.DoesNotExist:
            default_stream_group = DefaultStreamGroup.objects.create(
                name=options["name"], realm=realm, description=options["description"]
            )
        default_stream_group.streams.set(streams)

        default_stream_groups = DefaultStreamGroup.objects.all()
        for default_stream_group in default_stream_groups:
            print(default_stream_group.name)
            print(default_stream_group.description)
            for stream in default_stream_group.streams.all():
                print(stream.name)
            print()
```

--------------------------------------------------------------------------------

---[FILE: create_realm.py]---
Location: zulip-main/zerver/management/commands/create_realm.py
Signals: Django

```python
import argparse
from typing import Any

from django.core.exceptions import ValidationError
from django.core.management.base import CommandError
from typing_extensions import override

from zerver.actions.create_realm import do_create_realm
from zerver.actions.create_user import do_create_user
from zerver.forms import check_subdomain_available
from zerver.lib.management import ZulipBaseCommand
from zerver.models import UserProfile


class Command(ZulipBaseCommand):
    help = """\
Create a new Zulip organization (realm) via the command line.

We recommend `./manage.py generate_realm_creation_link` for most
users, for several reasons:

* Has a more user-friendly web flow for account creation.
* Manages passwords in a more natural way.
* Automatically logs the user in during account creation.

This management command is available as an alternative for situations
where one wants to script the realm creation process.

Since every Zulip realm must have an owner, this command creates the
initial organization owner user for the new realm, using the same
workflow as `./manage.py create_user`.
"""

    @override
    def add_arguments(self, parser: argparse.ArgumentParser) -> None:
        parser.add_argument("realm_name", help="Name for the new organization")
        parser.add_argument(
            "--string-id",
            help="Subdomain for the new organization. Empty if root domain.",
            default="",
        )
        parser.add_argument(
            "--allow-reserved-subdomain",
            action="store_true",
            help="Allow use of reserved subdomains",
        )
        self.add_create_user_args(parser)

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        realm_name = options["realm_name"]
        string_id = options["string_id"]
        allow_reserved_subdomain = options["allow_reserved_subdomain"]

        try:
            check_subdomain_available(string_id, allow_reserved_subdomain)
        except ValidationError as error:
            raise CommandError(error.message)

        create_user_params = self.get_create_user_params(options)

        try:
            realm = do_create_realm(string_id=string_id, name=realm_name)
        except AssertionError as e:
            raise CommandError(str(e))

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
            role=UserProfile.ROLE_REALM_OWNER,
            realm_creation=True,
            tos_version=UserProfile.TOS_VERSION_BEFORE_FIRST_LOGIN,
            acting_user=None,
        )
```

--------------------------------------------------------------------------------

````
