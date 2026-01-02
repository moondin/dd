---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 928
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 928 of 1290)

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

---[FILE: makemessages.py]---
Location: zulip-main/zerver/management/commands/makemessages.py
Signals: Django

```python
"""
See https://zulip.readthedocs.io/en/latest/translating/internationalization.html
for background.

The contents of this file are taken from
https://github.com/niwinz/django-jinja/blob/master/django_jinja/management/commands/makemessages.py

Jinja2's i18n functionality is not exactly the same as Django's.
In particular, the tags names and their syntax are different:

  1. The Django ``trans`` tag is replaced by a _() global.
  2. The Django ``blocktrans`` tag is called ``trans``.

(1) isn't an issue, since the whole ``makemessages`` process is based on
converting the template tags to ``_()`` calls. However, (2) means that
those Jinja2 ``trans`` tags will not be picked up by Django's
``makemessages`` command.

There aren't any nice solutions here. While Jinja2's i18n extension does
come with extraction capabilities built in, the code behind ``makemessages``
unfortunately isn't extensible, so we can:

  * Duplicate the command + code behind it.
  * Offer a separate command for Jinja2 extraction.
  * Try to get Django to offer hooks into makemessages().
  * Monkey-patch.

We are currently doing that last thing. It turns out there we are lucky
for once: It's simply a matter of extending two regular expressions.
Credit for the approach goes to:
https://stackoverflow.com/questions/2090717

"""

import glob
import os
import re
import subprocess
from collections.abc import Collection, Iterator, Mapping
from typing import Any

import orjson
from django.core.management.base import CommandParser
from django.core.management.commands import makemessages
from django.template import engines
from django.template.backends.jinja2 import Jinja2
from django.template.base import BLOCK_TAG_END, BLOCK_TAG_START
from django.utils.translation import template
from jinja2.environment import Environment
from typing_extensions import override

strip_whitespace_right = re.compile(
    rf"({BLOCK_TAG_START}-?\s*(trans|pluralize).*?-{BLOCK_TAG_END})\s+"
)
strip_whitespace_left = re.compile(
    rf"\s+({BLOCK_TAG_START}-\s*(endtrans|pluralize).*?-?{BLOCK_TAG_END})"
)
trim_blocks = re.compile(rf"({BLOCK_TAG_START}[-+]?\s*(trans|pluralize)[^+]*?{BLOCK_TAG_END})\n")
lstrip_blocks = re.compile(
    rf"^[ \t]+({BLOCK_TAG_START}\s*(endtrans|pluralize).*?[-+]?{BLOCK_TAG_END})",
    re.MULTILINE,
)

regexes = [
    r"{{~?#tr}}([\s\S]*?)(?:~?{{/tr}}|{{~?#\*inline )",  # '.' doesn't match '\n' by default
    r'{{~?\s*t "([\s\S]*?)"\W*~?}}',
    r"{{~?\s*t '([\s\S]*?)'\W*~?}}",
    r'\(t "([\s\S]*?)"\)',
    r'=\(t "([\s\S]*?)"\)(?=[^{]*}})',
    r"=\(t '([\s\S]*?)'\)(?=[^{]*}})",
]
tags = [
    ("err_", "error"),
]

frontend_compiled_regexes = [re.compile(regex) for regex in regexes]


def strip_whitespaces(src: str, env: Environment) -> str:
    src = strip_whitespace_left.sub(r"\1", src)
    src = strip_whitespace_right.sub(r"\1", src)
    if env.trim_blocks:
        src = trim_blocks.sub(r"\1", src)
    if env.lstrip_blocks:
        src = lstrip_blocks.sub(r"\1", src)
    return src


# this regex looks for {% trans %} blocks that don't have 'trimmed' or 'notrimmed' set.
# capturing {% endtrans %} ensures this doesn't affect DTL {% trans %} tags.
trans_block_re = re.compile(
    rf"({BLOCK_TAG_START}[-+]?\s*trans)(?!\s+(?:no)?trimmed)"
    rf"(.*?{BLOCK_TAG_END}.*?{BLOCK_TAG_START}[-+]?\s*?endtrans\s*?[-+]?{BLOCK_TAG_END})",
    re.DOTALL,
)


def apply_i18n_trimmed_policy(src: str, env: Environment) -> str:
    # if env.policies["ext.i18n.trimmed"]: insert 'trimmed' flag on jinja {% trans %} blocks.
    if not env.policies.get("ext.i18n.trimmed", False):
        return src
    return trans_block_re.sub(r"\1 trimmed \2", src)


class Command(makemessages.Command):
    xgettext_options = makemessages.Command.xgettext_options
    for func, tag in tags:
        xgettext_options += [f'--keyword={func}:1,"{tag}"']

    @override
    def add_arguments(self, parser: CommandParser) -> None:
        super().add_arguments(parser)
        parser.add_argument(
            "--frontend-source",
            default="web/templates",
            help="Name of the Handlebars template directory",
        )
        parser.add_argument(
            "--frontend-output",
            default="locale",
            help="Name of the frontend messages output directory",
        )
        parser.add_argument(
            "--frontend-namespace",
            default="translations.json",
            help="Namespace of the frontend locale file",
        )

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        self.handle_django_locales(*args, **options)
        self.handle_frontend_locales(**options)

    def handle_frontend_locales(
        self,
        *,
        frontend_source: str,
        frontend_output: str,
        frontend_namespace: str,
        locale: list[str],
        exclude: list[str],
        all: bool,
        **options: Any,
    ) -> None:
        self.frontend_source = frontend_source
        self.frontend_output = frontend_output
        self.frontend_namespace = frontend_namespace
        self.frontend_locale = locale
        self.frontend_exclude = exclude
        self.frontend_all = all

        translation_strings = self.get_translation_strings()
        self.write_translation_strings(translation_strings)

    def handle_django_locales(self, *args: Any, **options: Any) -> None:
        old_endblock_re = template.endblock_re
        old_block_re = template.block_re
        old_constant_re = template.constant_re

        old_templatize = template.templatize
        # Extend the regular expressions that are used to detect
        # translation blocks with an "OR jinja-syntax" clause.
        template.endblock_re = re.compile(
            template.endblock_re.pattern + "|" + r"""^[-+]?\s*endtrans\s*[-+]?$"""
        )
        template.block_re = re.compile(
            template.block_re.pattern
            + "|"
            + r"""^[-+]?\s*trans(?:\s+(?:no)?trimmed)?(?:\s+(?!'|")(?=.*?=.*?)|\s*[-+]?$)"""
        )
        template.plural_re = re.compile(
            template.plural_re.pattern + "|" + r"""^[-+]?\s*pluralize(?:\s+.+|[-+]?$)"""
        )
        template.constant_re = re.compile(r""".*?_\(((?:".*?(?<!\\)")|(?:'.*?(?<!\\)')).*?\)""")

        jinja_engine = engines["Jinja2"]
        assert isinstance(jinja_engine, Jinja2)

        def my_templatize(src: str, *args: Any, **kwargs: Any) -> str:
            new_src = strip_whitespaces(src, jinja_engine.env)
            new_src = apply_i18n_trimmed_policy(new_src, jinja_engine.env)
            return old_templatize(new_src, *args, **kwargs)

        template.templatize = my_templatize

        try:
            ignore_patterns = options.get("ignore_patterns", [])
            ignore_patterns.append("docs/*")
            ignore_patterns.append("templates/zerver/emails/custom/*")
            ignore_patterns.append("var/*")
            options["ignore_patterns"] = ignore_patterns
            super().handle(*args, **options)
        finally:
            template.endblock_re = old_endblock_re
            template.block_re = old_block_re
            template.templatize = old_templatize
            template.constant_re = old_constant_re

    def extract_strings(self, data: str) -> list[str]:
        translation_strings: list[str] = []
        for regex in frontend_compiled_regexes:
            for match in regex.findall(data):
                match = match.strip()
                match = " ".join(line.strip() for line in match.splitlines())
                translation_strings.append(match)

        return translation_strings

    def get_translation_strings(self) -> list[str]:
        translation_strings: list[str] = []
        dirname = self.get_template_dir()

        for dirpath, dirnames, filenames in os.walk(dirname):
            for filename in [f for f in filenames if f.endswith(".hbs")]:
                if filename.startswith("."):
                    continue
                with open(os.path.join(dirpath, filename)) as reader:
                    data = reader.read()
                    translation_strings.extend(self.extract_strings(data))

        extracted = subprocess.check_output(
            [
                "node_modules/.bin/formatjs",
                "extract",
                "--additional-function-names=$t,$t_html",
                "--format=simple",
                "--ignore=**/*.d.ts",
                "web/src/**/*.js",
                "web/src/**/*.ts",
            ]
        )
        translation_strings.extend(orjson.loads(extracted).values())

        return list(set(translation_strings))

    def get_template_dir(self) -> str:
        return self.frontend_source

    def get_namespace(self) -> str:
        return self.frontend_namespace

    def get_locales(self) -> Collection[str]:
        locale = self.frontend_locale
        exclude = self.frontend_exclude
        process_all = self.frontend_all

        # After calling super().handle(), default_locale_path gets set on self
        # so that we can reuse it here.
        default_locale_path = self.default_locale_path
        paths = glob.glob(f"{default_locale_path}/*")
        all_locales = [os.path.basename(path) for path in paths if os.path.isdir(path)]

        # Account for excluded locales
        if process_all:
            return all_locales
        else:
            locales = locale or all_locales
            return set(locales) - set(exclude)

    def get_base_path(self) -> str:
        return self.frontend_output

    def get_output_paths(self) -> Iterator[str]:
        base_path = self.get_base_path()
        locales = self.get_locales()
        for path in [os.path.join(base_path, locale) for locale in locales]:
            if not os.path.exists(path):
                os.makedirs(path)

            yield os.path.join(path, self.get_namespace())

    def get_new_strings(
        self, old_strings: Mapping[str, str], translation_strings: list[str], locale: str
    ) -> dict[str, str]:
        """
        Missing strings are removed, new strings are added and already
        translated strings are not touched.
        """
        new_strings = {}  # Dict[str, str]
        for k in translation_strings:
            if locale == "en":
                # For English language, translation is equal to the key.
                new_strings[k] = old_strings.get(k, k)
            else:
                new_strings[k] = old_strings.get(k, "")

        return new_strings

    def write_translation_strings(self, translation_strings: list[str]) -> None:
        for locale, output_path in zip(self.get_locales(), self.get_output_paths(), strict=False):
            self.stdout.write(f"[frontend] processing locale {locale}")
            try:
                with open(output_path, "rb") as reader:
                    old_strings = orjson.loads(reader.read())
            except (OSError, ValueError):
                old_strings = {}

            new_strings = self.get_new_strings(old_strings, translation_strings, locale)
            with open(output_path, "wb") as writer:
                writer.write(
                    orjson.dumps(
                        new_strings,
                        option=orjson.OPT_APPEND_NEWLINE
                        | orjson.OPT_INDENT_2
                        | orjson.OPT_SORT_KEYS,
                    )
                )
```

--------------------------------------------------------------------------------

---[FILE: merge_streams.py]---
Location: zulip-main/zerver/management/commands/merge_streams.py

```python
from argparse import ArgumentParser
from typing import Any

from typing_extensions import override

from zerver.actions.streams import merge_streams
from zerver.lib.management import ZulipBaseCommand
from zerver.models.streams import get_stream


class Command(ZulipBaseCommand):
    help = """Merge two streams."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("stream_to_keep", help="name of stream to keep")
        parser.add_argument(
            "stream_to_destroy", help="name of stream to merge into the stream being kept"
        )
        self.add_realm_args(parser, required=True)

    @override
    def handle(self, *args: Any, **options: str) -> None:
        realm = self.get_realm(options)
        assert realm is not None  # Should be ensured by parser
        stream_to_keep = get_stream(options["stream_to_keep"], realm)
        stream_to_destroy = get_stream(options["stream_to_destroy"], realm)
        stats = merge_streams(realm, stream_to_keep, stream_to_destroy)
        print(f"Added {stats[0]} subscriptions")
        print(f"Moved {stats[1]} messages")
        print(f"Deactivated {stats[2]} subscriptions")
```

--------------------------------------------------------------------------------

---[FILE: process_queue.py]---
Location: zulip-main/zerver/management/commands/process_queue.py
Signals: Django

```python
import logging
import os
import signal
import sys
import threading
from argparse import ArgumentParser
from collections.abc import Iterator
from contextlib import contextmanager
from types import FrameType
from typing import Any

import sentry_sdk
from django.conf import settings
from django.core.management.base import CommandError
from django.utils import autoreload
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand
from zerver.worker.queue_processors import get_active_worker_queues, get_worker


@contextmanager
def log_and_exit_if_exception(
    logger: logging.Logger, queue_name: str, threaded: bool
) -> Iterator[None]:
    try:
        yield
    except Exception:
        logger.exception("Unhandled exception from queue: %s", queue_name, stack_info=True)
        if threaded:
            # Sending SIGUSR1 is the right way to exit - triggering the
            # exit_with_three signal handler, causing exit and reload.
            os.kill(os.getpid(), signal.SIGUSR1)
        else:
            sys.exit(1)


class Command(ZulipBaseCommand):
    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--queue_name", metavar="<queue name>", help="queue to process")
        parser.add_argument(
            "--worker_num", metavar="<worker number>", type=int, default=0, help="worker label"
        )
        parser.add_argument("--all", action="store_true", help="run all queues")
        parser.add_argument(
            "--multi_threaded",
            nargs="+",
            metavar="<list of queue name>",
            required=False,
            help="list of queue to process",
        )

    help = "Runs a queue processing worker"

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        logging.basicConfig()
        logger = logging.getLogger("process_queue")

        def exit_with_three(signal: int, frame: FrameType | None) -> None:
            """
            This process is watched by Django's autoreload, so exiting
            with status code 3 will cause this process to restart.
            """
            logger.warning("SIGUSR1 received. Restarting this queue processor.")
            sys.exit(3)

        if not settings.USING_RABBITMQ:
            # Make the warning silent when running the tests
            if settings.TEST_SUITE:
                logger.info("Not using RabbitMQ queue workers in the test suite.")
            else:
                logger.error("Cannot run a queue processor when USING_RABBITMQ is False!")
            raise CommandError

        def run_threaded_workers(queues: list[str], logger: logging.Logger) -> None:
            cnt = 0
            for queue_name in queues:
                if not settings.DEVELOPMENT:
                    logger.info("launching queue worker thread %s", queue_name)
                cnt += 1
                td = ThreadedWorker(queue_name, logger)
                td.start()
            assert len(queues) == cnt
            logger.info("%d queue worker threads were launched", cnt)

        if options["all"]:
            signal.signal(signal.SIGUSR1, exit_with_three)
            autoreload.run_with_reloader(run_threaded_workers, get_active_worker_queues(), logger)
        elif options["multi_threaded"]:
            signal.signal(signal.SIGUSR1, exit_with_three)
            queues = options["multi_threaded"]
            autoreload.run_with_reloader(run_threaded_workers, queues, logger)
        else:
            queue_name = options["queue_name"]
            worker_num = options["worker_num"]

            def signal_handler(signal: int, frame: FrameType | None) -> None:
                logger.info("Worker %d disconnecting from queue %s", worker_num, queue_name)
                worker.stop()
                sys.exit(0)

            logger.info("Worker %d connecting to queue %s", worker_num, queue_name)
            with log_and_exit_if_exception(logger, queue_name, threaded=False):
                worker = get_worker(queue_name, worker_num=worker_num)
                with sentry_sdk.isolation_scope() as scope:
                    scope.set_tag("queue_worker", queue_name)
                    scope.set_tag("worker_num", worker_num)

                    worker.setup()
                    signal.signal(signal.SIGTERM, signal_handler)
                    signal.signal(signal.SIGINT, signal_handler)
                    signal.signal(signal.SIGUSR1, signal_handler)
                    worker.start()


class ThreadedWorker(threading.Thread):
    def __init__(self, queue_name: str, logger: logging.Logger) -> None:
        threading.Thread.__init__(self)
        self.logger = logger
        self.queue_name = queue_name

    @override
    def run(self) -> None:
        with (
            sentry_sdk.isolation_scope() as scope,
            log_and_exit_if_exception(self.logger, self.queue_name, threaded=True),
        ):
            scope.set_tag("queue_worker", self.queue_name)
            worker = get_worker(self.queue_name, threaded=True)
            worker.setup()
            logging.debug("starting consuming %s", self.queue_name)
            worker.start()
```

--------------------------------------------------------------------------------

---[FILE: promote_new_full_members.py]---
Location: zulip-main/zerver/management/commands/promote_new_full_members.py

```python
from typing import Any

from typing_extensions import override

from zerver.actions.user_groups import promote_new_full_members
from zerver.lib.management import ZulipBaseCommand, abort_cron_during_deploy, abort_unless_locked


class Command(ZulipBaseCommand):
    help = """Add users to full members system group."""

    @override
    @abort_cron_during_deploy
    @abort_unless_locked
    def handle(self, *args: Any, **options: Any) -> None:
        promote_new_full_members()
```

--------------------------------------------------------------------------------

---[FILE: purge_queue.py]---
Location: zulip-main/zerver/management/commands/purge_queue.py
Signals: Django

```python
from argparse import ArgumentParser
from typing import Any

from django.core.management import CommandError
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand
from zerver.lib.queue import SimpleQueueClient
from zerver.worker.queue_processors import get_active_worker_queues


class Command(ZulipBaseCommand):
    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(dest="queue_name", nargs="?", help="queue to purge")
        parser.add_argument("--all", action="store_true", help="purge all queues")

    help = "Discards all messages from the given queue"

    @override
    def handle(self, *args: Any, **options: str) -> None:
        def purge_queue(queue_name: str) -> None:
            queue = SimpleQueueClient()
            queue.ensure_queue(queue_name, lambda channel: channel.queue_purge(queue_name))

        if options["all"]:
            for queue_name in get_active_worker_queues():
                purge_queue(queue_name)
            print("All queues purged")
        elif not options["queue_name"]:
            raise CommandError("Missing queue_name argument!")
        else:
            queue_name = options["queue_name"]
            if not (
                queue_name in get_active_worker_queues() or queue_name.startswith("notify_tornado")
            ):
                raise CommandError(f"Unknown queue {queue_name}")

            print(f"Purging queue {queue_name}")
            purge_queue(queue_name)

        print("Done")
```

--------------------------------------------------------------------------------

---[FILE: query_ldap.py]---
Location: zulip-main/zerver/management/commands/query_ldap.py

```python
from argparse import ArgumentParser
from typing import Any

from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand
from zproject.backends import query_ldap


class Command(ZulipBaseCommand):
    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("email", metavar="<email>", help="email of user to query")

    @override
    def handle(self, *args: Any, **options: str) -> None:
        email = options["email"]
        values = query_ldap(email)
        for value in values:
            print(value)
```

--------------------------------------------------------------------------------

---[FILE: rate_limit.py]---
Location: zulip-main/zerver/management/commands/rate_limit.py
Signals: Django

```python
from argparse import ArgumentParser
from typing import Any

from django.core.management.base import CommandError
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand
from zerver.lib.rate_limiter import RateLimitedUser
from zerver.models import UserProfile
from zerver.models.users import get_user_profile_by_api_key


class Command(ZulipBaseCommand):
    help = """Manually block or unblock a user from accessing the API"""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("-e", "--email", help="Email account of user.")
        parser.add_argument("-a", "--api-key", help="API key of user.")
        parser.add_argument("-s", "--seconds", default=60, type=int, help="Seconds to block for.")
        parser.add_argument(
            "-d",
            "--domain",
            default="api_by_user",
            help="Rate-limiting domain. Defaults to 'api_by_user'.",
        )
        parser.add_argument(
            "-b",
            "--all-bots",
            dest="bots",
            action="store_true",
            help="Whether or not to also block all bots for this user.",
        )
        parser.add_argument(
            "operation",
            metavar="<operation>",
            choices=["block", "unblock"],
            help="operation to perform (block or unblock)",
        )
        self.add_realm_args(parser)

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        if (not options["api_key"] and not options["email"]) or (
            options["api_key"] and options["email"]
        ):
            raise CommandError("Please enter either an email or API key to manage")

        realm = self.get_realm(options)
        if options["email"]:
            user_profile = self.get_user(options["email"], realm)
        else:
            try:
                user_profile = get_user_profile_by_api_key(options["api_key"])
            except UserProfile.DoesNotExist:
                raise CommandError(
                    "Unable to get user profile for API key {}".format(options["api_key"])
                )

        users = [user_profile]
        if options["bots"]:
            users.extend(
                bot for bot in UserProfile.objects.filter(is_bot=True, bot_owner=user_profile)
            )

        operation = options["operation"]
        for user in users:
            print(f"Applying operation to User ID: {user.id}: {operation}")

            if operation == "block":
                RateLimitedUser(user, domain=options["domain"]).block_access(options["seconds"])
            elif operation == "unblock":
                RateLimitedUser(user, domain=options["domain"]).unblock_access()
```

--------------------------------------------------------------------------------

---[FILE: reactivate_realm.py]---
Location: zulip-main/zerver/management/commands/reactivate_realm.py

```python
from argparse import ArgumentParser
from typing import Any

from typing_extensions import override

from zerver.actions.realm_settings import do_reactivate_realm
from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    help = """Script to reactivate a deactivated realm."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        self.add_realm_args(parser, required=True)

    @override
    def handle(self, *args: Any, **options: str) -> None:
        realm = self.get_realm(options)
        assert realm is not None  # Should be ensured by parser
        if not realm.deactivated:
            print("Realm", options["realm_id"], "is already active.")
            return
        print("Reactivating", options["realm_id"])
        do_reactivate_realm(realm)
        print("Done!")
```

--------------------------------------------------------------------------------

---[FILE: realm_domain.py]---
Location: zulip-main/zerver/management/commands/realm_domain.py
Signals: Django

```python
import sys
from argparse import ArgumentParser
from typing import Any

from django.core.exceptions import ValidationError
from django.core.management.base import CommandError
from django.db.utils import IntegrityError
from typing_extensions import override

from zerver.lib.domains import validate_domain
from zerver.lib.management import ZulipBaseCommand
from zerver.models import RealmDomain
from zerver.models.realms import get_realm_domains


class Command(ZulipBaseCommand):
    help = """Manage domains for the specified realm"""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "--op", default="show", help="What operation to do (add, show, remove)."
        )
        parser.add_argument(
            "--allow-subdomains", action="store_true", help="Whether subdomains are allowed or not."
        )
        parser.add_argument("domain", metavar="<domain>", nargs="?", help="domain to add or remove")
        self.add_realm_args(parser, required=True)

    @override
    def handle(self, *args: Any, **options: str | bool) -> None:
        realm = self.get_realm(options)
        assert realm is not None  # Should be ensured by parser
        if options["op"] == "show":
            print(f"Domains for {realm.string_id}:")
            for realm_domain in get_realm_domains(realm):
                assert isinstance(realm_domain["domain"], str)
                if realm_domain["allow_subdomains"]:
                    print(realm_domain["domain"] + " (subdomains allowed)")
                else:
                    print(realm_domain["domain"] + " (subdomains not allowed)")
            sys.exit(0)

        assert isinstance(options["domain"], str)
        domain = options["domain"].strip().lower()
        try:
            validate_domain(domain)
        except ValidationError as e:
            raise CommandError(e.messages[0])
        if options["op"] == "add":
            assert isinstance(options["allow_subdomains"], bool)
            try:
                RealmDomain.objects.create(
                    realm=realm, domain=domain, allow_subdomains=options["allow_subdomains"]
                )
                sys.exit(0)
            except IntegrityError:
                raise CommandError(f"The domain {domain} is already a part of your organization.")
        elif options["op"] == "remove":
            try:
                RealmDomain.objects.get(realm=realm, domain=domain).delete()
                sys.exit(0)
            except RealmDomain.DoesNotExist:
                raise CommandError("No such entry found!")
        else:
            self.print_help("./manage.py", "realm_domain")
            raise CommandError
```

--------------------------------------------------------------------------------

---[FILE: register_server.py]---
Location: zulip-main/zerver/management/commands/register_server.py
Signals: Django

```python
import os
import subprocess
from argparse import ArgumentParser
from typing import Any

import requests
from django.conf import settings
from django.core.management.base import CommandError
from django.utils.crypto import get_random_string
from requests.models import Response
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand
from zerver.lib.remote_server import (
    PushBouncerSession,
    prepare_for_registration_transfer_challenge,
    send_json_to_push_bouncer,
    send_server_data_to_push_bouncer,
)

if settings.DEVELOPMENT:
    SECRETS_FILENAME = "zproject/dev-secrets.conf"
else:
    SECRETS_FILENAME = "/etc/zulip/zulip-secrets.conf"


class Command(ZulipBaseCommand):
    help = """Register a remote Zulip server for push notifications."""

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "--agree-to-terms-of-service",
            action="store_true",
            help="Agree to the Zulipchat Terms of Service: https://zulip.com/policies/terms.",
        )
        action = parser.add_mutually_exclusive_group()
        action.add_argument(
            "--rotate-key",
            action="store_true",
            help="Automatically rotate your server's zulip_org_key",
        )
        action.add_argument(
            "--registration-transfer",
            action="store_true",
            help="""\
If your server uses a publicly verifiable SSL certificate for a
hostname that is already registered for Zulip services, transfers the
registration to this server by changing the zulip_org_key secret for
that registration and saving the updated secret in
/etc/zulip/zulip-secrets.conf.""",
        )
        action.add_argument(
            "--deactivate",
            action="store_true",
            help="Deregister the server; this will stop mobile push notifications",
        )

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        if not settings.ZULIP_ORG_ID:
            raise CommandError(
                "Missing zulip_org_id; run scripts/setup/generate_secrets.py to generate."
            )
        if not settings.ZULIP_ORG_KEY:
            raise CommandError(
                "Missing zulip_org_key; run scripts/setup/generate_secrets.py to generate."
            )
        if not settings.ZULIP_SERVICES_URL:
            raise CommandError(
                "ZULIP_SERVICES_URL is not set; was the default incorrectly overridden in /etc/zulip/settings.py?"
            )
        if not settings.ZULIP_SERVICE_PUSH_NOTIFICATIONS:
            raise CommandError(
                "Please set ZULIP_SERVICE_PUSH_NOTIFICATIONS to True in /etc/zulip/settings.py"
            )

        if options["deactivate"]:
            send_json_to_push_bouncer("POST", "server/deactivate", {})
            print("Mobile Push Notification Service registration successfully deactivated!")
            return

        hostname = settings.EXTERNAL_HOST
        request: dict[str, object] = {
            "zulip_org_id": settings.ZULIP_ORG_ID,
            "zulip_org_key": settings.ZULIP_ORG_KEY,
            "hostname": hostname,
            "contact_email": settings.ZULIP_ADMINISTRATOR,
        }
        if options["rotate_key"]:
            if not os.access(SECRETS_FILENAME, os.W_OK):
                raise CommandError(f"{SECRETS_FILENAME} is not writable by the current user.")
            request["new_org_key"] = get_random_string(64)

        print(
            "This command registers your server for the Mobile Push Notifications Service.\n"
            "Doing so will share basic metadata with the service's maintainers:\n\n"
            f"* This server's configured hostname: {request['hostname']}\n"
            f"* This server's configured contact email address: {request['contact_email']}\n"
            "* Metadata about each organization hosted by the server; see:\n\n"
            "    <https://zulip.com/doc-permalinks/basic-metadata>\n\n"
            "Use of this service is governed by the Zulip Terms of Service:\n\n"
            "    <https://zulip.com/policies/terms>\n"
        )

        if not options["agree_to_terms_of_service"] and not options["rotate_key"]:
            tos_prompt = input(
                "Do you want to agree to the Zulip Terms of Service and proceed? [Y/n] "
            )
            print()
            if not (
                tos_prompt.lower() == "y" or tos_prompt.lower() == "" or tos_prompt.lower() == "yes"
            ):
                # Exit without registering; no need to print anything
                # special, as the "n" reply to the query is clear
                # enough about what happened.
                return

        if options["registration_transfer"]:
            org_id, org_key = self.do_registration_transfer_flow(hostname)
            # We still want to proceed with a regular request to the registration endpoint,
            # as it'll update the registration with new information such as the contact email.
            request["zulip_org_id"] = org_id
            request["zulip_org_key"] = org_key
            settings.ZULIP_ORG_ID = org_id
            settings.ZULIP_ORG_KEY = org_key
            print()
            print("Proceeding to update the registration with current metadata...")

        response = self._request_push_notification_bouncer_url(
            "/api/v1/remotes/server/register", request
        )

        send_server_data_to_push_bouncer(consider_usage_statistics=False, raise_on_error=True)

        if response.json()["created"]:
            print(
                "Your server is now registered for the Mobile Push Notification Service!\n"
                "Return to the documentation for next steps."
            )
        else:
            if options["rotate_key"]:
                print(f"Success! Updating {SECRETS_FILENAME} with the new key...")
                new_org_key = request["new_org_key"]
                assert isinstance(new_org_key, str)
                subprocess.check_call(
                    [
                        "crudini",
                        "--inplace",
                        "--set",
                        SECRETS_FILENAME,
                        "secrets",
                        "zulip_org_key",
                        new_org_key,
                    ]
                )
            print("Mobile Push Notification Service registration successfully updated!")

        if options["registration_transfer"]:
            print()
            print(
                "Make sure to restart the server next by running /home/zulip/deployments/current/scripts/restart-server "
                "so that the new credentials are reloaded."
            )

    def do_registration_transfer_flow(self, hostname: str) -> tuple[str, str]:
        params = {"hostname": hostname}
        response = self._request_push_notification_bouncer_url(
            "/api/v1/remotes/server/register/transfer", params
        )
        verification_secret = response.json()["verification_secret"]

        print(
            "Received a verification secret from the service. Preparing to serve it at the verification URL."
        )
        token_for_push_bouncer = prepare_for_registration_transfer_challenge(verification_secret)

        print("Sending ACK to the service and awaiting completion of verification...")
        response = self._request_push_notification_bouncer_url(
            "/api/v1/remotes/server/register/verify_challenge",
            dict(hostname=params["hostname"], access_token=token_for_push_bouncer),
        )

        org_id = response.json()["zulip_org_id"]
        org_key = response.json()["zulip_org_key"]
        # Update the secrets file.
        print("Success! Updating secrets file with received credentials.")
        subprocess.check_call(
            [
                "crudini",
                "--inplace",
                "--set",
                SECRETS_FILENAME,
                "secrets",
                "zulip_org_id",
                org_id,
            ]
        )
        subprocess.check_call(
            [
                "crudini",
                "--inplace",
                "--set",
                SECRETS_FILENAME,
                "secrets",
                "zulip_org_key",
                org_key,
            ]
        )
        print("Mobile Push Notification Service registration successfully transferred.")
        return org_id, org_key

    def _request_push_notification_bouncer_url(self, url: str, params: dict[str, Any]) -> Response:
        assert settings.ZULIP_SERVICES_URL is not None
        request_url = settings.ZULIP_SERVICES_URL + url
        session = PushBouncerSession()
        try:
            response = session.post(request_url, data=params)
        except requests.RequestException:
            raise CommandError(
                "Network error connecting to push notifications service "
                f"({settings.ZULIP_SERVICES_URL})",
            )
        try:
            response.raise_for_status()
        except requests.HTTPError as e:
            # Report nice errors from the Zulip API if possible.
            try:
                content_dict = response.json()
            except Exception:
                raise e

            if (
                "code" in content_dict
                and content_dict["code"] == "HOSTNAME_ALREADY_IN_USE_BOUNCER_ERROR"
            ):
                print(
                    "--------------------------------\n"
                    "The hostname is already in use by another server. If you control the hostname \n"
                    "and want to transfer the registration to this server, you can run manage.py register_server \n"
                    "with the --registration-transfer flag.\n"
                    "Note that this will invalidate old credentials if another server is still using them.\n"
                    "\n"
                    "For more information, see: \n"
                    "\n"
                    "<https://zulip.com/doc-permalinks/registration-transfer>"
                )
                raise CommandError

            error_message = content_dict["msg"]
            raise CommandError(
                f'Error received from the push notification service: "{error_message}"'
            )

        return response
```

--------------------------------------------------------------------------------

---[FILE: remove_users_from_stream.py]---
Location: zulip-main/zerver/management/commands/remove_users_from_stream.py
Signals: Django

```python
from typing import Any

from django.core.management.base import CommandParser
from typing_extensions import override

from zerver.actions.streams import bulk_remove_subscriptions
from zerver.lib.management import ZulipBaseCommand
from zerver.models.streams import get_stream


class Command(ZulipBaseCommand):
    help = """Remove some or all users in a realm from a stream."""

    @override
    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument("-s", "--stream", required=True, help="A stream name.")

        self.add_realm_args(parser, required=True)
        self.add_user_list_args(
            parser, all_users_help="Remove all users in realm from this stream."
        )

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        realm = self.get_realm(options)
        assert realm is not None  # Should be ensured by parser
        user_profiles = self.get_users(options, realm)
        stream_name = options["stream"].strip()
        stream = get_stream(stream_name, realm)

        result = bulk_remove_subscriptions(realm, user_profiles, [stream], acting_user=None)
        not_subscribed = result[1]
        not_subscribed_users = {tup[0] for tup in not_subscribed}

        for user_profile in user_profiles:
            if user_profile in not_subscribed_users:
                print(f"{user_profile.delivery_email} was not subscribed")
            else:
                print(f"Removed {user_profile.delivery_email} from {stream_name}")
```

--------------------------------------------------------------------------------

````
