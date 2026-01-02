---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:14Z
part: 906
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 906 of 1290)

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

---[FILE: test_console_output.py]---
Location: zulip-main/zerver/lib/test_console_output.py
Signals: Django

```python
import itertools
import logging
import re
import sys
from collections.abc import Iterable, Iterator
from contextlib import contextmanager
from io import SEEK_SET, TextIOWrapper
from types import TracebackType
from typing import IO, TYPE_CHECKING

from typing_extensions import override

if TYPE_CHECKING:
    from _typeshed import ReadableBuffer


class ExtraConsoleOutputInTestError(Exception):
    pass


class ExtraConsoleOutputFinder:
    def __init__(self) -> None:
        valid_line_patterns = [
            # Example: Running zerver.tests.test_attachments.AttachmentsTests.test_delete_unauthenticated
            rb"^Running ",
            rb"^----------------------------------------------------------------------",
            # Example: INFO: URL coverage report is in var/url_coverage.txt
            rb"^INFO: URL coverage report is in",
            # Example: -- Running tests in parallel mode with 4 processes
            rb"^-- Running tests in",
            rb"^OK",
            # Example: Ran 2139 tests in 115.659s
            rb"^Ran [0-9]+ tests in",
            # Destroying test database for alias 'default'...
            rb"^Destroying test database for alias ",
            rb"^Using existing clone",
            rb"^\*\* Skipping ",
        ]
        self.compiled_line_pattern = re.compile(rb"|".join(valid_line_patterns))
        self.partial_line = b""
        self.full_extra_output = bytearray()

    def find_extra_output(self, data: bytes) -> None:
        *lines, self.partial_line = (self.partial_line + data).split(b"\n")
        for line in lines:
            if not self.compiled_line_pattern.match(line):
                self.full_extra_output += line + b"\n"


class WrappedIO(IO[bytes]):
    def __init__(self, stream: IO[bytes], extra_output_finder: ExtraConsoleOutputFinder) -> None:
        self.stream = stream
        self.extra_output_finder = extra_output_finder

    @property
    @override
    def mode(self) -> str:
        return self.stream.mode

    @property
    @override
    def name(self) -> str:
        return self.stream.name

    @override
    def close(self) -> None:
        pass

    @property
    @override
    def closed(self) -> bool:
        return self.stream.closed

    @override
    def fileno(self) -> int:
        return self.stream.fileno()

    @override
    def flush(self) -> None:
        self.stream.flush()

    @override
    def isatty(self) -> bool:
        return self.stream.isatty()

    @override
    def read(self, n: int = -1) -> bytes:
        return self.stream.read(n)

    @override
    def readable(self) -> bool:
        return self.stream.readable()

    @override
    def readline(self, limit: int = -1) -> bytes:
        return self.stream.readline(limit)

    @override
    def readlines(self, hint: int = -1) -> list[bytes]:
        return self.stream.readlines(hint)

    @override
    def seek(self, offset: int, whence: int = SEEK_SET) -> int:
        return self.stream.seek(offset, whence)

    @override
    def seekable(self) -> bool:
        return self.stream.seekable()

    @override
    def tell(self) -> int:
        return self.stream.tell()

    @override
    def truncate(self, size: int | None = None) -> int:
        return self.truncate(size)

    @override
    def writable(self) -> bool:
        return self.stream.writable()

    @override
    def write(self, data: "ReadableBuffer") -> int:
        num_chars = self.stream.write(data)
        self.extra_output_finder.find_extra_output(bytes(data))
        return num_chars

    @override
    def writelines(self, data: "Iterable[ReadableBuffer]") -> None:
        data, data_copy = itertools.tee(data)
        self.stream.writelines(data)
        lines = b"".join(data_copy)
        self.extra_output_finder.find_extra_output(lines)

    @override
    def __next__(self) -> bytes:
        return next(self.stream)

    @override
    def __iter__(self) -> Iterator[bytes]:
        return self

    @override
    def __enter__(self) -> IO[bytes]:
        self.stream.__enter__()
        return self

    @override
    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc_value: BaseException | None,
        traceback: TracebackType | None,
    ) -> None:
        self.stream.__exit__(exc_type, exc_value, traceback)


@contextmanager
def tee_stderr_and_find_extra_console_output(
    extra_output_finder: ExtraConsoleOutputFinder,
) -> Iterator[None]:
    stderr = sys.stderr

    # get shared console handler instance from any logger that have it
    console_log_handler = logging.getLogger("django.server").handlers[0]
    assert isinstance(console_log_handler, logging.StreamHandler)
    assert console_log_handler.stream == stderr

    sys.stderr = console_log_handler.stream = TextIOWrapper(
        WrappedIO(stderr.buffer, extra_output_finder), line_buffering=True
    )
    try:
        yield
    finally:
        try:
            sys.stderr.flush()
        finally:
            sys.stderr = console_log_handler.stream = stderr


@contextmanager
def tee_stdout_and_find_extra_console_output(
    extra_output_finder: ExtraConsoleOutputFinder,
) -> Iterator[None]:
    stdout = sys.stdout
    sys.stdout = TextIOWrapper(
        WrappedIO(sys.stdout.buffer, extra_output_finder), line_buffering=True
    )
    try:
        yield
    finally:
        try:
            sys.stdout.flush()
        finally:
            sys.stdout = stdout
```

--------------------------------------------------------------------------------

---[FILE: test_data.source.txt]---
Location: zulip-main/zerver/lib/test_data.source.txt

```text
Unified trainable symmetries have led to many practical advances, including
public-private key pairs and the transistor. After years of theoretical
research into wide-area networks, we disconfirm the evaluation of the
Internet that would allow for further study into Internet QoS.

Along these same lines, In addition, existing probabilistic and random
heuristics use the study of evolutionary programming to develop the
development of RAID.

the deployment of forward-error correction would improbably amplify
information retrieval systems.

Our focus in this work is not on whether the memory bus and e-business can
agree to accomplish this intent, but rather on exploring new efficient
technology.

The basic tenet of this approach is the evaluation of SCSI disks.

We emphasize that we will not able to be visualized to investigate the
construction of the lookaside buffer.

The usual methods for the synthesis of simulated annealing do not apply in
this area. Combined with introspective symmetries, it constructs an analysis
of DNS.

We motivate the need for public-private key pairs. On a similar note, to
fulfill this ambition, we verify that even though the famous empathic
algorithm for the emulation of erasure coding by G.

This runs in $$O(n)$$ time, red-black trees can be made lossless, adaptive, and
unstable. We disconfirm the deployment of 8 bit architectures. On a similar
note, to accomplish this objective, we discover how hash tables can be
applied to the development of A* search. Finally, we conclude.

The Duchess! The Duchess! Oh my dear paws! Oh my fur and whiskers! Where can
I have dropped them, I wonder?

Somebody always 'calls' me in the middle of every entertaining chapter.

Excuse me, but you will have to wait! I am all ink, and I am being
cross-examined.

Break the circuit --- the connection --- open the key and ask the sending
office to repeat from the last word I have been able to catch!

That Philocrates, the bird-seller, played us a scurvy trick, when he pretended
these two guides could help us to find Tereus, the Epops, who is a bird,
without being born of one. He has indeed sold us this jay, a true son of
Tharelides, for an obolus, and this crow for three, but what can they do? Why,
nothing whatever but bite and scratch! -- What's the matter with you then, that
you keep opening your beak? Do you want us to fling ourselves headlong down
these rocks? There is no road that way.

'Tis because you are ignorant and heedless, and have never read your Aesop.
'Tis he who tells us that the lark was born before all other creatures,
indeed before the Earth; his father died of sickness, but the Earth did not
exist then; he remained unburied for five days, when the bird in its dilemma
decided, for want of a better place, to entomb its father in its own head.

Here is the magpie, the turtle-dove, the swallow, the horned owl, the buzzard,
the pigeon, the falcon, the ring-dove, the cuckoo, the red-foot, the red-cap,
the purple-cap, the kestrel, the diver, the ousel, the osprey, the woodpecker.

Oh! oh! what a lot of birds! what a quantity of blackbirds! how they scold,
how they come rushing up! What a noise! what a noise! Can they be bearing us
ill-will? Oh! there! there! they are opening their beaks and staring at us.

There is nothing more useful nor more pleasant than to have wings. To begin
with, just let us suppose a spectator to be dying with hunger and to be weary
of the choruses of the tragic poets; if they were winged, they would fly off,
go home to dine and come back with their stomach filled.

Tools for measuring the air. In truth, the spaces in the air have precisely
the form of a furnace. With this bent ruler I draw a line from top to bottom;
from one of its points I describe a circle with the compass. Do you understand?

Birds -- birds only; they had neither Egyptian brickmaker, nor stone-mason, nor
carpenter; the birds did it all themselves; I could hardly believe my eyes.
Thirty thousand cranes came from Libya with a supply of stones, intended for
the foundations. The water-rails chiselled them with their beaks. Ten thousand
storks were busy making bricks; plovers and other water fowl carried water
into the air.

Oh you, who have founded so illustrious a city in the air, you know not in what
esteem people hold you and how many there are who burn with desire to dwell in
it. Before your city was built, all had a mania for Sparta; long hair and
fasting were held in honour, people went dirty like Socrates and carried
staves. Now all is changed.

This is the city of Nephelococcygia, Cloud-cuckoo-town, whither we come as
ambassadors. Hi! what are you up to? you are throwing your cloak over the left
shoulder. Come, fling it quick over the right! And why, pray, does it draggle
in this fashion? Have you ulcers to hide like Laespodias?

I am she whose language is sweeter than honey, the zealous follower of the
Muses, as Homer has it: the poet.

I see no messenger coming from the wall to tell us what is happening. Ah! here
comes one running herself out of breath as though she were running the Olympic
stadium.

Sit down awhile; And let us once again assail your ears, That are so
fortified against our story What we have two nights seen.

When shall we three meet again In thunder, lightning, or in rain?

The goal of chaos-driven reactions is to plant the seeds of starfire rather
than dogma. Balance requires exploration.

We are being called to explore the galaxy itself as an interface between
complexity and growth. This myth never ends. Imagine a redefining of what
could be.

Futurists agree that pseudorandom communication are an interesting new topic
in the field of steganography, and researchers concur. Despite the fact that
it is often a confirmed mission, it entirely conflicts with the need to
provide DHCP to researchers.

Similarly, The notion that end-users connect with the improvement of the
transistor is rarely adamantly opposed. The emulation of checksums would
greatly improve neural networks.

Our focus in this position paper is not on whether public-private key pairs
can be made heterogeneous, encrypted, and embedded, but rather on describing
new low-energy technology.

Existing robust and atomic methodologies use suffix trees to evaluate
trainable theory. The basic tenet of this approach is the development of
checksums. Despite the fact that conventional wisdom states that this
obstacle is regularly overcame by the deployment of the World Wide Web, we
believe that a different approach is necessary.

Motivated by these observations, encrypted modalities and peer-to-peer
models have been extensively refined by statisticians.

Along these same lines, the shortcoming of this type of solution, however,
is that sensor networks can be made linear-time, secure, and
"fuzzy". Therefore, our solution creates hierarchical databases.

First, we demonstrate that despite the fact that RPCs can be made
permutable, multimodal, and replicated, the infamous mobile algorithm for
the emulation of RPCs runs in $$O(2^n)$$ time. Along these same lines, we use
"smart" archetypes to disprove that the little-known interposable algorithm
for the evaluation of interrupts follows a Zipf-like distribution.

Such a claim might seem unexpected but fell in line with our
expectations. We also prove that though the transistor and superpages can
connect to address this issue, evolutionary programming can be made "fuzzy",
highly-available, and introspective. Finally, we concentrate our efforts on
confirming that the UNIVAC computer and architecture are mostly
incompatible.

The rest of this paper is organized as follows. We motivate the need for
programming. Further, we place our work in context with the related work in
this area. Next, to address this problem, we argue that the transistor and
the Turing machine can collude to achieve this purpose.

After years of significant research into link-level acknowledgements, we
disprove the refinement of SMPs. In order to solve this obstacle, we
understand how virtual machines can be applied to the simulation of the
location-identity split that made deploying and possibly constructing the
Turing machine a reality.

This project seems to be proceeding well; I'm looking forward to testing it
out soon.

I should clarify what I said earlier about "not having anything since 1.6
related to this." On main we are actually touching a lot of email-related
code.

ah, I see, the other files just isolated them, makes sense. I guess I'll
wait for Iago to get back to us & see whether it is worth then to just pull
out the details into a separate file.

Ok gotta go to a meeting; thanks everyone! I think we made a lot of progress
on technical design issues.

what if you just want to look at something and go back to where you were?

As a first step, I think it is viable to show the raw Markdown, and then
replace it when the server sends the update event.

Hmmm, I would not say the current implementation would handle all the math
and the complex Markdown, but it does pass all the tests in that file

Wait, is this from the frontend js code or backend python code

Try doing that and seeing if it solves the problem. If it doesn't, then
maybe it's the case that any new emails that get scheduled aren't able to be
sent with your email provider

That looks suspiciously like our Twitter integration was broken on Python 3.

Just got back from lunch, btw, and about to send a PR adding some details to
the development docs.

I think I was confused about whether it was supposed to be inside a VM still.

The funny thing is that we noticed this right as we were considering
eliminating the blue border.

On logging back out and going back to the login page, my browser sent 5
cookies for that page, none of which expire. So I think at least one of
those cookies is probably to implement that strategy.

But wouldn't that show you contextually who is in the audience before you
have to open the compose box?

Imagine you were composing a message to a different narrow and looking at
specific information in that narrow.

I think doing it random every time is a good place to start, and we can
consider making it not random only if there's feedback suggesting something
different

Security experts agree that relational algorithms are an interesting new
topic in the field of networking, and scholars concur.

Few systems engineers would disagree with the refinement of context-free
grammar. We use wearable algorithms to confirm that checksums and
context-free grammar can synchronize to solve this grand challenge.

In our research we concentrate our efforts on confirming that model checking
can be made authenticated, low-energy, and autonomous. Contrarily, this
approach is entirely adamantly opposed. Contrarily, this solution is
regularly considered essential.

Primarily, we disprove that fiber-optic cables and cache coherence can
connect to address this quandary. We concentrate our efforts on
disconfirming that write-back caches and programming can agree to fulfill
this intent.

To achieve this goal, we discover how I/O automata can be applied to the
improvement of context-free grammar.

Our overall evaluation seeks to prove three hypotheses: (1) that simulated
annealing has actually shown amplified instruction rate over time; (2) that
consistent hashing no longer affects an application's legacy ABI; and
finally (3) that DNS no longer toggles performance.

The reason for this is that studies have shown that instruction rate is
roughly 23% higher than we might expect.

Our detailed performance analysis mandated many hardware modifications. We
carried out a real-world prototype on our underwater testbed to measure
Erwin Schroedinger's deployment of e-business in 1970.

Realty runs on hardened standard software. We implemented our simulated
annealing server in ANSI Scheme, augmented with computationally random
extensions.

This application builds on existing work in amphibious communication and
steganography.

Is it possible to justify the great pains we took in our implementation?
Possibly. Seizing upon this approximate configuration, we ran four novel
experiments.

"Fuzzy" communication and B-trees have garnered limited interest from both
theorists and cyberinformaticians in the last several years.

Many biologists would agree that, had it not been for superblocks, the
understanding of write-ahead logging might never have occurred.

I question the need for interrupts. For example, many algorithms improve
unstable algorithms. Indeed, online algorithms and lambda calculus have a
long history of collaborating in this manner.

Despite the fact that such a claim at first glance seems counterintuitive,
it is derived from known results. Electrical engineering follows a cycle of
four phases: location, refinement, visualization, and evaluation.

A number of previous algorithms have refined semantic information, either
for the exploration of journaling file systems that would allow for further
study into sensor networks or for the improvement of model checking.

We estimate that the study of robots can explore the Internet without
needing to locate context-free grammar.

The algorithms solution to Scheme is defined not only by the study of
multicast heuristics, but also by the natural need for SMPs. A natural
problem in robotics is the visualization of courseware. To put this in
perspective, consider the fact that infamous information theorists usually
use e-commerce to fix this grand challenge. The exploration of robots would
improbably improve concurrent symmetries.

The rest of this paper is organized as follows. To start off with, we
motivate the need for hash tables. Continuing with this rationale, we
validate the emulation of programming.

Another option is to make the whole bar horizontal and put it on top.

I think that responsiveness is one of the low-hanging fruits that are worth
improving

It's nice and it feels more modern, but I think this will take some time to
get used to

It seems there's pretty strong interest in 1 / connection, so maybe we
should switch to that soon and then continue discussion with that in view.

Peace, break thee off; look, where it comes again!

Thou art a scholar; speak to it

What art thou that usurp'st this time of night, together with that warlike
form in which the majesty did sometimes march? by heaven I charge thee,
speak!

Good now, sit down, and tell me, they that know, why this same strict and
most observant watch so nightly toils the subject of the land, and why such
daily cast of brazen cannon.
```

--------------------------------------------------------------------------------

---[FILE: test_fixtures.py]---
Location: zulip-main/zerver/lib/test_fixtures.py
Signals: Django

```python
import glob
import json
import os
import re
import shutil
import subprocess
import sys
import time

from django.conf import settings
from django.db import DEFAULT_DB_ALIAS, ProgrammingError, connection, connections
from django.db.utils import OperationalError

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from scripts.lib.zulip_tools import (
    TEMPLATE_DATABASE_DIR,
    get_dev_uuid_var_path,
    is_digest_obsolete,
    run,
    write_new_digest,
)

BACKEND_DATABASE_TEMPLATE = "zulip_test_template"
UUID_VAR_DIR = get_dev_uuid_var_path()

IMPORTANT_FILES = [
    "zilencer/management/commands/populate_db.py",
    "zerver/actions/create_realm.py",
    "zerver/lib/bulk_create.py",
    "zerver/lib/generate_test_data.py",
    "zerver/lib/server_initialization.py",
    "tools/setup/postgresql-init-test-db",
    "tools/setup/postgresql-init-dev-db",
    "zerver/migrations/0258_enable_online_push_notifications_default.py",
]

VERBOSE_MESSAGE_ABOUT_HASH_TRANSITION = """
    NOTE!!!!

    We are rebuilding your database for a one-time transition.

    We have a hashing scheme that we use to detect whether any
    important files used in the construction of the database
    have changed.

    We are changing that scheme so it only uses one file
    instead of a directory of files.

    In order to prevent errors due to this transition, we are
    doing a one-time rebuild of your database.  This should
    be the last time this happens (for this particular reason,
    at least), unless you go back to older branches.

"""


def migration_paths() -> list[str]:
    return [
        *glob.glob("*/migrations/*.py"),
        "uv.lock",
    ]


class Database:
    def __init__(self, platform: str, database_name: str, settings: str) -> None:
        self.database_name = database_name
        self.settings = settings
        self.digest_name = "db_files_hash_for_" + platform
        self.migration_status_file = "migration_status_" + platform
        self.migration_status_path = os.path.join(
            UUID_VAR_DIR,
            self.migration_status_file,
        )
        self.migration_digest_file = "migrations_hash_" + database_name

    def important_settings(self) -> list[str]:
        def get(setting_name: str) -> str:
            value = getattr(settings, setting_name, {})
            return json.dumps(value, sort_keys=True)

        return [
            get("LOCAL_DATABASE_PASSWORD"),
            get("INTERNAL_BOTS"),
            get("REALM_INTERNAL_BOTS"),
            get("DISABLED_REALM_INTERNAL_BOTS"),
        ]

    def run_db_migrations(self) -> None:
        # We shell out to `manage.py` and pass `DJANGO_SETTINGS_MODULE` on
        # the command line rather than just calling the migration
        # functions, because Django doesn't support changing settings like
        # what the database is as runtime.
        # Also we export ZULIP_DB_NAME which is ignored by dev platform but
        # recognised by test platform and used to migrate correct db.
        manage_py = [
            "env",
            "DJANGO_SETTINGS_MODULE=" + self.settings,
            "ZULIP_DB_NAME=" + self.database_name,
            "./manage.py",
        ]

        run([*manage_py, "migrate", "--skip-checks", "--no-input"])

        run(
            [
                *manage_py,
                "get_migration_status",
                "--skip-checks",
                "--output=" + self.migration_status_file,
            ]
        )

    def what_to_do_with_migrations(self) -> str:
        from zerver.lib.migration_status import get_migration_status

        status_fn = self.migration_status_path
        settings = self.settings

        if not os.path.exists(status_fn):
            return "scrap"

        with open(status_fn) as f:
            previous_migration_status = f.read()

        current_migration_status = get_migration_status(settings=settings)
        connections.close_all()
        all_curr_migrations = extract_migrations_as_list(current_migration_status)
        all_prev_migrations = extract_migrations_as_list(previous_migration_status)

        if len(all_curr_migrations) < len(all_prev_migrations):
            return "scrap"

        for migration in all_prev_migrations:
            if migration not in all_curr_migrations:
                return "scrap"

        if len(all_curr_migrations) == len(all_prev_migrations):
            return "migrations_are_latest"

        return "migrate"

    def database_exists(self) -> bool:
        try:
            connection = connections[DEFAULT_DB_ALIAS]

            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT 1 from pg_database WHERE datname=%s;",
                    [self.database_name],
                )
                return_value = bool(cursor.fetchone())
            connections.close_all()
            return return_value
        except OperationalError:
            return False

    def files_or_settings_have_changed(self) -> bool:
        database_name = self.database_name

        # Deal with legacy hash files.  We can kill off this code when
        # enough time has passed since April 2020 that we're not
        # worried about anomalies doing `git bisect`--probably a few
        # months is sufficient.
        legacy_status_dir = os.path.join(UUID_VAR_DIR, database_name + "_db_status")
        if os.path.exists(legacy_status_dir):
            print(VERBOSE_MESSAGE_ABOUT_HASH_TRANSITION)

            # Remove the old digest for several reasons:
            #   - tidiness
            #   - preventing false positives if you bisect
            #   - make this only a one-time headache (generally)
            shutil.rmtree(legacy_status_dir)

            # Return True to force a one-time rebuild.
            return True

        return is_digest_obsolete(
            self.digest_name,
            IMPORTANT_FILES,
            self.important_settings(),
        )

    def template_status(self) -> str:
        # This function returns a status string specifying the type of
        # state the template db is in and thus the kind of action required.
        if not self.database_exists():
            # TODO: It's possible that `database_exists` will
            #       return `False` even though the database
            #       exists, but we just have the wrong password,
            #       probably due to changing the secrets file.
            #
            #       The only problem this causes is that we waste
            #       some time rebuilding the whole database, but
            #       it's better to err on that side, generally.
            return "needs_rebuild"

        if self.files_or_settings_have_changed():
            return "needs_rebuild"

        # Here we hash and compare our migration files before doing
        # the work of seeing what to do with them; if there are no
        # changes, we can safely assume we don't need to run
        # migrations without spending a few 100ms parsing all the
        # Python migration code.
        if not self.is_migration_digest_obsolete():
            return "current"

        """
        NOTE:
            We immediately update the digest, assuming our
            callers will do what it takes to run the migrations.

            Ideally our callers would just do it themselves
            AFTER the migrations actually succeeded, but the
            caller codepaths are kind of complicated here.
        """
        self.write_new_migration_digest()

        migration_op = self.what_to_do_with_migrations()
        if migration_op == "scrap":
            return "needs_rebuild"

        if migration_op == "migrate":
            return "run_migrations"

        return "current"

    def is_migration_digest_obsolete(self) -> bool:
        return is_digest_obsolete(
            self.migration_digest_file,
            migration_paths(),
        )

    def write_new_migration_digest(self) -> None:
        write_new_digest(
            self.migration_digest_file,
            migration_paths(),
        )

    def write_new_db_digest(self) -> None:
        write_new_digest(
            self.digest_name,
            IMPORTANT_FILES,
            self.important_settings(),
        )


DEV_DATABASE = Database(
    platform="dev",
    database_name="zulip",
    settings="zproject.settings",
)

TEST_DATABASE = Database(
    platform="test",
    database_name="zulip_test_template",
    settings="zproject.test_settings",
)


def update_test_databases_if_required(rebuild_test_database: bool = False) -> None:
    """Checks whether the zulip_test_template database template, is
    consistent with our database migrations; if not, it updates it
    in the fastest way possible:

    * If all we need to do is add some migrations, just runs those
      migrations on the template database.
    * Otherwise, we rebuild the test template database from scratch.

    The default behavior is sufficient for the `test-backend` use
    case, where the test runner code will clone directly from the
    template database.

    The `rebuild_test_database` option (used by our frontend and API
    tests) asks us to drop and re-cloning the zulip_test database from
    the template so those test suites can run with a fresh copy.

    """
    test_template_db_status = TEST_DATABASE.template_status()

    if test_template_db_status == "needs_rebuild":
        run(["tools/rebuild-test-database"])
        TEST_DATABASE.write_new_db_digest()
        return

    if test_template_db_status == "run_migrations":
        TEST_DATABASE.run_db_migrations()
        run(["tools/setup/generate-fixtures"])
        return

    if rebuild_test_database:
        run(["tools/setup/generate-fixtures"])


def extract_migrations_as_list(migration_status: str) -> list[str]:
    MIGRATIONS_RE = re.compile(r"\[[X| ]\] (\d+_.+)\n")
    return MIGRATIONS_RE.findall(migration_status)


def destroy_leaked_test_databases(expiry_time: int = 60 * 60) -> int:
    """The logic in zerver/lib/test_runner.py tries to delete all the
    temporary test databases generated by test-backend threads, but it
    cannot guarantee it handles all race conditions correctly.  This
    is a catch-all function designed to delete any that might have
    been leaked due to crashes (etc.).  The high-level algorithm is to:

    * Delete every database with a name like zulip_test_template_*
    * Unless it is registered in a file under TEMPLATE_DATABASE_DIR as
      part of a currently running test-backend invocation
    * And that file is less expiry_time old.

    This should ensure we ~never break a running test-backend process,
    while also ensuring we will eventually delete all leaked databases.
    """
    files = glob.glob(os.path.join(UUID_VAR_DIR, TEMPLATE_DATABASE_DIR, "*"))
    test_databases: set[str] = set()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT datname FROM pg_database;")
            rows = cursor.fetchall()
            for row in rows:
                if "zulip_test_template_" in row[0]:
                    test_databases.add(row[0])
    except ProgrammingError:
        pass

    databases_in_use: set[str] = set()
    for file in files:
        if round(time.time()) - os.path.getmtime(file) < expiry_time:
            with open(file) as f:
                databases_in_use.update(f"zulip_test_template_{line}".rstrip() for line in f)
        else:
            # Any test-backend run older than expiry_time can be
            # cleaned up, both the database and the file listing its
            # databases.
            os.remove(file)

    databases_to_drop = test_databases - databases_in_use

    if not databases_to_drop:
        return 0

    commands = "\n".join(f"DROP DATABASE IF EXISTS {db};" for db in databases_to_drop)
    subprocess.run(
        ["psql", "-q", "-v", "ON_ERROR_STOP=1", "-h", "localhost", "postgres", "zulip_test"],
        input=commands,
        check=True,
        text=True,
    )
    return len(databases_to_drop)


def remove_test_run_directories(expiry_time: int = 60 * 60) -> int:
    removed = 0
    directories = glob.glob(os.path.join(UUID_VAR_DIR, "test-backend", "run_*"))
    for test_run in directories:
        if round(time.time()) - os.path.getmtime(test_run) > expiry_time:
            try:
                shutil.rmtree(test_run)
                removed += 1
            except FileNotFoundError:
                pass
    return removed


def reset_zulip_test_database() -> None:
    """
    This function is used to reset the zulip_test database fastest way possible,
    i.e. First, it deletes the database and then clones it from zulip_test_template.
    This function is used with puppeteer tests, so it can quickly reset the test
    database after each run.
    """
    from zerver.lib.test_runner import destroy_test_databases

    # Make sure default database is 'zulip_test'.
    assert connections["default"].settings_dict["NAME"] == "zulip_test"

    # Clearing all the active PSQL sessions with 'zulip_test'.
    run(
        [
            "env",
            "PGHOST=localhost",
            "PGUSER=zulip_test",
            "scripts/setup/terminate-psql-sessions",
            "zulip_test",
        ]
    )

    destroy_test_databases()
    # Pointing default database to test database template, so we can instantly clone it.
    settings.DATABASES["default"]["NAME"] = BACKEND_DATABASE_TEMPLATE
    connection = connections["default"]
    clone_database_suffix = "clone"
    connection.creation.clone_test_db(
        suffix=clone_database_suffix,
    )
    settings_dict = connection.creation.get_test_db_clone_settings(clone_database_suffix)
    # We manually rename the clone database to 'zulip_test' because when cloning it,
    # its name is set to original database name + some suffix.
    # Also, we need it to be 'zulip_test' so that our running server can recognize it.
    with connection.cursor() as cursor:
        cursor.execute("ALTER DATABASE zulip_test_template_clone RENAME TO zulip_test;")
    settings_dict["NAME"] = "zulip_test"
    # connection.settings_dict must be updated in place for changes to be
    # reflected in django.db.connections. If the following line assigned
    # connection.settings_dict = settings_dict, new threads would connect
    # to the default database instead of the appropriate clone.
    connection.settings_dict.update(settings_dict)
    connection.close()
```

--------------------------------------------------------------------------------

````
