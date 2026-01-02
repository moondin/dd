---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:15Z
part: 1279
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 1279 of 1290)

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

---[FILE: print_initial_password.py]---
Location: zulip-main/zilencer/management/commands/print_initial_password.py

```python
from argparse import ArgumentParser
from typing import Any

from typing_extensions import override

from zerver.lib.initial_password import initial_password
from zerver.lib.management import ZulipBaseCommand


class Command(ZulipBaseCommand):
    help = "Print the initial password and API key for accounts as created by populate_db"

    fmt = "%-30s %-16s  %-32s"

    @override
    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument(
            "emails",
            metavar="<email>",
            nargs="*",
            help="email of user to show password and API key for",
        )
        self.add_realm_args(parser)

    @override
    def handle(self, *args: Any, **options: str) -> None:
        realm = self.get_realm(options)
        print(self.fmt % ("email", "password", "API key"))
        for email in options["emails"]:
            if "@" not in email:
                print(f"ERROR: {email} does not look like an email address")
                continue
            user = self.get_user(email, realm)
            print(self.fmt % (email, initial_password(email), user.api_key))
```

--------------------------------------------------------------------------------

---[FILE: profile_request.py]---
Location: zulip-main/zilencer/management/commands/profile_request.py
Signals: Django

```python
import cProfile
import logging
import tempfile
from typing import Any

from django.contrib.sessions.backends.base import SessionBase
from django.core.management.base import CommandParser
from django.http import HttpRequest, HttpResponseBase
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand
from zerver.lib.request import RequestNotes
from zerver.lib.test_helpers import HostRequestMock
from zerver.middleware import LogRequests
from zerver.models import UserMessage
from zerver.views.message_fetch import get_messages_backend


class MockSession(SessionBase):
    def __init__(self) -> None:
        self.modified = False


def profile_request(request: HttpRequest, num_before: int, num_after: int) -> HttpResponseBase:
    def get_response(request: HttpRequest) -> HttpResponseBase:
        return prof.runcall(
            get_messages_backend,
            request,
            request.user,
            num_before=num_before,
            num_after=num_after,
            apply_markdown=True,
        )

    prof = cProfile.Profile()
    with tempfile.NamedTemporaryFile(prefix="profile.data.", delete=False) as stats_file:
        response = LogRequests(get_response)(request)
        assert isinstance(response, HttpResponseBase)  # async responses not supported here for now
        prof.dump_stats(stats_file.name)
        logging.info("Profiling data written to %s", stats_file.name)
    return response


class Command(ZulipBaseCommand):
    @override
    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument("email", metavar="<email>", help="Email address of the user")
        self.add_realm_args(parser)

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        realm = self.get_realm(options)
        user = self.get_user(options["email"], realm)
        anchor = UserMessage.objects.filter(user_profile=user).order_by("-message")[200].message_id
        mock_request = HostRequestMock(
            post_data={
                "anchor": anchor,
                "num_before": 1200,
                "num_after": 200,
            },
            user_profile=user,
            meta_data={"REMOTE_ADDR": "127.0.0.1"},
            path="/",
        )
        mock_request.session = MockSession()
        RequestNotes.get_notes(mock_request).log_data = None

        profile_request(mock_request, num_before=1200, num_after=200)
```

--------------------------------------------------------------------------------

---[FILE: queue_rate.py]---
Location: zulip-main/zilencer/management/commands/queue_rate.py
Signals: Django

```python
import csv
from timeit import timeit
from typing import Any

from django.core.management.base import CommandParser
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand
from zerver.lib.queue import SimpleQueueClient, queue_json_publish_rollback_unsafe
from zerver.worker.test import BatchNoopWorker, NoopWorker


class Command(ZulipBaseCommand):
    help = """Times the overhead of enqueuing and dequeuing messages from RabbitMQ."""

    @override
    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument(
            "--count", help="Number of messages to enqueue", default=10000, type=int
        )
        parser.add_argument("--reps", help="Iterations of enqueue/dequeue", default=1, type=int)
        parser.add_argument("--batch", help="Enables batch dequeuing", action="store_true")
        parser.add_argument("--csv", help="Path to CSV output", default="rabbitmq-timings.csv")
        parser.add_argument(
            "--prefetches",
            help="Limits the prefetch size; RabbitMQ defaults to unbounded (0)",
            default=[0],
            nargs="+",
            type=int,
        )
        parser.add_argument(
            "--slow",
            help="Which request numbers should take 60s (1-based)",
            action="append",
            type=int,
            default=[],
        )

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        print("Purging queue...")
        queue = SimpleQueueClient()
        queue_name = "noop_batch" if options["batch"] else "noop"
        queue.ensure_queue(queue_name, lambda channel: channel.queue_purge("noop"))
        count = options["count"]
        reps = options["reps"]

        with open(options["csv"], "w", newline="") as csvfile:
            writer = csv.DictWriter(
                csvfile, fieldnames=["Queue size", "Queue type", "Prefetch", "Rate"]
            )
            writer.writeheader()

            for prefetch in options["prefetches"]:
                print(f"Queue size {count}, prefetch {prefetch}...")
                worker: NoopWorker | BatchNoopWorker = NoopWorker(count, options["slow"])
                if options["batch"]:
                    worker = BatchNoopWorker(count, options["slow"])
                    if prefetch > 0 and prefetch < worker.batch_size:
                        print(
                            f"    Skipping, as prefetch {prefetch} is less than batch size {worker.batch_size}"
                        )
                        continue
                worker.setup()

                assert worker.q is not None
                assert worker.q.channel is not None
                worker.q.channel.basic_qos(prefetch_count=prefetch)

                total_time = 0.0
                for i in range(1, reps + 1):
                    worker.consumed = 0
                    timeit(
                        lambda: queue_json_publish_rollback_unsafe(queue_name, {}),
                        number=count,
                    )
                    duration = timeit(worker.start, number=1)
                    print(f"    {i}/{reps}: {count}/{duration}s = {count / duration}/s")
                    total_time += duration
                    writer.writerow(
                        {
                            "Queue size": count,
                            "Queue type": queue_name,
                            "Prefetch": prefetch,
                            "Rate": count / duration,
                        }
                    )
                    csvfile.flush()
                print(f"  Overall: {reps * count}/{total_time}s = {(reps * count) / total_time}/s")
```

--------------------------------------------------------------------------------

---[FILE: render_messages.py]---
Location: zulip-main/zilencer/management/commands/render_messages.py
Signals: Django

```python
import os
from collections.abc import Iterator
from typing import Any

import orjson
from django.core.management.base import CommandParser
from django.db.models import QuerySet
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand
from zerver.lib.markdown import render_message_markdown
from zerver.models import Message


def queryset_iterator(queryset: QuerySet[Message], chunksize: int = 5000) -> Iterator[Message]:
    queryset = queryset.order_by("id")
    while queryset.exists():
        for row in queryset[:chunksize]:
            msg_id = row.id
            yield row
        queryset = queryset.filter(id__gt=msg_id)


class Command(ZulipBaseCommand):
    help = """
    Render messages to a file.
    Usage: ./manage.py render_messages <destination> [--amount=10000]
    """

    @override
    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument("destination", help="Destination file path")
        parser.add_argument("--amount", default=100000, help="Number of messages to render")
        parser.add_argument("--latest_id", default=0, help="Last message id to render")

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        dest_dir = os.path.realpath(os.path.dirname(options["destination"]))
        amount = int(options["amount"])
        latest = int(options["latest_id"]) or Message.objects.latest("id").id
        self.stdout.write(f"Latest message id: {latest}")
        if not os.path.exists(dest_dir):
            os.makedirs(dest_dir)

        with open(options["destination"], "wb") as result:
            messages = Message.objects.filter(id__gt=latest - amount, id__lte=latest).order_by("id")
            for message in queryset_iterator(messages):
                content = message.content
                # In order to ensure that the output of this tool is
                # consistent across the time, even if messages are
                # edited, we always render the original content
                # version, extracting it from the edit history if
                # necessary.
                if message.edit_history:
                    history = orjson.loads(message.edit_history)
                    history = sorted(history, key=lambda i: i["timestamp"])
                    for entry in history:
                        if "prev_content" in entry:
                            content = entry["prev_content"]
                            break
                result.write(
                    orjson.dumps(
                        {
                            "id": message.id,
                            "content": render_message_markdown(message, content),
                        },
                        option=orjson.OPT_APPEND_NEWLINE,
                    )
                )
```

--------------------------------------------------------------------------------

---[FILE: rundjangoserver.py]---
Location: zulip-main/zilencer/management/commands/rundjangoserver.py
Signals: Django

```python
from collections.abc import Callable
from datetime import datetime
from functools import wraps

from dateutil.tz import tzlocal
from django.core.management.commands.runserver import Command as DjangoCommand
from typing_extensions import override


def output_styler(style_func: Callable[[str], str]) -> Callable[[str], str]:
    # Might fail to suppress the date line around midnight, but, whatever.
    date_prefix = datetime.now(tzlocal()).strftime("%B %d, %Y - ")

    @wraps(style_func)
    def _wrapped_style_func(message: str) -> str:
        if message == "Performing system checks...\n\n" or message.startswith(
            ("System check identified no issues", date_prefix)
        ):
            message = ""
        elif "Quit the server with " in message:
            message = (
                "Django process (re)started. " + message[message.index("Quit the server with ") :]
            )
        return style_func(message)

    return _wrapped_style_func


class Command(DjangoCommand):
    @override
    def inner_run(self, *args: object, **options: object) -> None:
        self.stdout.style_func = output_styler(self.stdout.style_func)
        super().inner_run(*args, **options)
```

--------------------------------------------------------------------------------

---[FILE: switch_realm_from_standard_to_plus_plan.py]---
Location: zulip-main/zilencer/management/commands/switch_realm_from_standard_to_plus_plan.py
Signals: Django

```python
from typing import Any

from django.conf import settings
from django.core.management.base import CommandError, CommandParser
from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand

if settings.BILLING_ENABLED:
    from corporate.lib.stripe import RealmBillingSession
    from corporate.models.plans import CustomerPlan


class Command(ZulipBaseCommand):
    @override
    def add_arguments(self, parser: CommandParser) -> None:
        self.add_realm_args(parser)

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        realm = self.get_realm(options)

        if not realm:
            raise CommandError("No realm found.")

        if settings.BILLING_ENABLED:
            billing_session = RealmBillingSession(realm=realm)
            billing_session.do_change_plan_to_new_tier(new_plan_tier=CustomerPlan.TIER_CLOUD_PLUS)
```

--------------------------------------------------------------------------------

---[FILE: sync_api_key.py]---
Location: zulip-main/zilencer/management/commands/sync_api_key.py

```python
import os
from configparser import ConfigParser
from typing import Any

from typing_extensions import override

from zerver.lib.management import ZulipBaseCommand
from zerver.models import UserProfile
from zerver.models.realms import get_realm
from zerver.models.users import get_user_by_delivery_email


class Command(ZulipBaseCommand):
    help = """Sync your API key from ~/.zuliprc into your development instance"""

    @override
    def handle(self, *args: Any, **options: Any) -> None:
        config_file = os.path.join(os.environ["HOME"], ".zuliprc")
        if not os.path.exists(config_file):
            raise RuntimeError("No ~/.zuliprc found")
        config = ConfigParser()
        with open(config_file) as f:
            config.read_file(f, config_file)
        api_key = config.get("api", "key")
        email = config.get("api", "email")

        try:
            realm = get_realm("zulip")
            user_profile = get_user_by_delivery_email(email, realm)
            user_profile.api_key = api_key
            user_profile.save(update_fields=["api_key"])
        except UserProfile.DoesNotExist:
            print(f"User {email} does not exist; not syncing API key")
```

--------------------------------------------------------------------------------

---[FILE: 0001_initial.py]---
Location: zulip-main/zilencer/migrations/0001_initial.py
Signals: Django

```python
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("zerver", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Deployment",
            fields=[
                (
                    "id",
                    models.AutoField(
                        verbose_name="ID", serialize=False, auto_created=True, primary_key=True
                    ),
                ),
                ("is_active", models.BooleanField(default=True)),
                ("api_key", models.CharField(max_length=32, null=True)),
                ("base_api_url", models.CharField(max_length=128)),
                ("base_site_url", models.CharField(max_length=128)),
                ("realms", models.ManyToManyField(related_name="_deployments", to="zerver.Realm")),
            ],
            options={},
            bases=(models.Model,),
        ),
    ]
```

--------------------------------------------------------------------------------

````
