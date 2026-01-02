---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 547
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 547 of 1290)

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

---[FILE: run-dev]---
Location: zulip-main/tools/run-dev

```text
#!/usr/bin/env python3
import argparse
import asyncio
import errno
import logging
import os
import pwd
import signal
import subprocess
import sys
from collections.abc import Awaitable, Callable

TOOLS_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(TOOLS_DIR))

# check for the venv
from tools.lib import sanity_check

sanity_check.check_venv(__file__)

from urllib.parse import urlsplit

import aiohttp
import aiohttp.web_fileresponse
from aiohttp import hdrs, web
from aiohttp.http_exceptions import BadStatusLine

from scripts.lib.zulip_tools import CYAN, ENDC
from tools.lib.test_script import add_provision_check_override_param, assert_provisioning_status_ok
from zerver.lib.mime_types import EXTRA_MIME_TYPES
from zerver.lib.partial import partial

if "posix" in os.name and os.geteuid() == 0:
    raise RuntimeError("run-dev should not be run as root.")

DESCRIPTION = """
Starts the app listening on localhost, for local development.

This script launches the Django and Tornado servers, then runs a reverse proxy
which serves to both of them.  After it's all up and running, browse to

    http://localhost:9991/

Note that, while runserver and runtornado have the usual auto-restarting
behavior, the reverse proxy itself does *not* automatically restart on changes
to this file.
"""

parser = argparse.ArgumentParser(
    description=DESCRIPTION, formatter_class=argparse.RawTextHelpFormatter
)

parser.add_argument("--test", action="store_true", help="Use the testing database and ports")
parser.add_argument("--minify", action="store_true", help="Minifies assets for testing in dev")
parser.add_argument("--interface", help="Set the IP or hostname for the proxy to listen on")
parser.add_argument(
    "--no-clear-memcached",
    action="store_false",
    dest="clear_memcached",
    help="Do not clear memcached on startup",
)
parser.add_argument("--streamlined", action="store_true", help="Avoid process_queue, etc.")
parser.add_argument(
    "--behind-https-proxy",
    action="store_true",
    help="Start app server in HTTPS mode, using reverse proxy",
)
parser.add_argument(
    "--help-center-static-build",
    action="store_true",
    help="Host existing static build of help center with search",
)
parser.add_argument(
    "--help-center-dev-server",
    action="store_true",
    help="Run dev server for help center alongside the Zulip app. Hot reload will work for this mode, but search will not work in the generated website.",
)
parser.add_argument(
    "--only-help-center",
    action="store_true",
    help="Run help center dev server on port 9991 without running the Zulip web app and related services",
)
add_provision_check_override_param(parser)
options = parser.parse_args()
help_center_dev_server_enabled = (
    options.help_center_dev_server and not options.help_center_static_build
)

assert_provisioning_status_ok(options.skip_provision_check)

if options.interface is None:
    user_id = os.getuid()
    user_name = pwd.getpwuid(user_id).pw_name
    if user_name in ["vagrant", "zulipdev"]:
        # In the Vagrant development environment, we need to listen on
        # all ports, and it's safe to do so, because Vagrant is only
        # exposing certain guest ports (by default just 9991) to the
        # host.  The same argument applies to the remote development
        # servers using username "zulipdev".
        options.interface = None
    else:
        # Otherwise, only listen to requests on localhost for security.
        options.interface = "127.0.0.1"
elif options.interface == "":
    options.interface = None

runserver_args: list[str] = []
base_port = 9991
if options.test:
    base_port = 9981
    settings_module = "zproject.test_settings"
    # Don't auto-reload when running Puppeteer tests
    runserver_args = ["--noreload"]
    runtornado_command = ["./manage.py", "runtornado"]
else:
    settings_module = "zproject.settings"
    runtornado_command = [
        "-m",
        "tornado.autoreload",
        "--until-success",
        "./manage.py",
        "runtornado",
        "--autoreload",
        "--immediate-reloads",
        "--automated",
    ]

manage_args = [f"--settings={settings_module}"]
os.environ["DJANGO_SETTINGS_MODULE"] = settings_module

# Disable Djangos development server warning; we provide plenty of
# warnings on this point in the documentation, which is a better place
# to stop folks than the actual server.
os.environ["DJANGO_RUNSERVER_HIDE_WARNING"] = "true"

if options.behind_https_proxy:
    os.environ["BEHIND_HTTPS_PROXY"] = "1"

proxy_port = base_port
django_port = base_port + 1
tornado_port = base_port + 2
webpack_port = base_port + 3
help_center_port = base_port + 4
tusd_port = base_port + 5

for mime_type, extension in EXTRA_MIME_TYPES:
    aiohttp.web_fileresponse.CONTENT_TYPES.add_type(mime_type, extension)

os.chdir(os.path.join(os.path.dirname(__file__), ".."))

if options.clear_memcached:
    subprocess.check_call("./scripts/setup/flush-memcached")

# Set up a new process group, so that we can later kill run{server,tornado}
# and all of the processes they spawn.
os.setpgrp()

# Save pid of parent process to the pid file. It can be used later by
# tools/stop-run-dev to kill the server without having to find the
# terminal in question.

if options.test:
    pid_file_path = os.path.join(os.path.join(os.getcwd(), "var/puppeteer/run_dev.pid"))
else:
    pid_file_path = os.path.join(os.path.join(os.getcwd(), "var/run/run_dev.pid"))

# Required for compatibility python versions.
if not os.path.exists(os.path.dirname(pid_file_path)):
    os.makedirs(os.path.dirname(pid_file_path))
with open(pid_file_path, "w+") as f:
    f.write(str(os.getpgrp()) + "\n")


def server_processes() -> list[list[str]]:
    main_cmds = [
        [
            "./manage.py",
            "rundjangoserver",
            *manage_args,
            *runserver_args,
            f"127.0.0.1:{django_port}",
        ],
        [
            "env",
            "PYTHONUNBUFFERED=1",
            "python3",
            *runtornado_command,
            *manage_args,
            f"127.0.0.1:{tornado_port}",
        ],
    ]

    if options.streamlined:
        # The streamlined operation allows us to do many
        # things, but search/etc. features won't work.
        return main_cmds

    other_cmds = [
        ["./manage.py", "process_queue", "--all", *manage_args, "--automated"],
        [
            "env",
            "PGHOST=127.0.0.1",  # Force password authentication using .pgpass
            "./puppet/zulip/files/postgresql/process_fts_updates",
            "--quiet",
        ],
        ["./manage.py", "deliver_scheduled_messages", "--automated"],
        [
            "./manage.py",
            "runtusd",
            f"{tusd_port}",
            f"http://localhost:{django_port}/api/internal/tusd",
        ],
    ]

    # NORMAL (but slower) operation:
    return main_cmds + other_cmds


def do_one_time_webpack_compile() -> None:
    # We just need to compile webpack assets once at startup, not run a daemon,
    # in test mode.  Additionally, webpack-dev-server doesn't support running 2
    # copies on the same system, so this model lets us run the Puppeteer tests
    # with a running development server.
    subprocess.check_call(["./tools/webpack", "--quiet", "--test"])


def start_webpack_watcher() -> "subprocess.Popen[bytes]":
    webpack_cmd = ["./tools/webpack", "--watch", f"--port={webpack_port}"]
    if options.minify:
        webpack_cmd.append("--minify")
    if options.interface is None:
        # If interface is None and we're listening on all ports, we also need
        # to disable the webpack host check so that webpack will serve assets.
        webpack_cmd.append("--disable-host-check")
    if options.interface:
        webpack_cmd.append(f"--host={options.interface}")
    else:
        webpack_cmd.append("--host=0.0.0.0")
    return subprocess.Popen(webpack_cmd)


session: aiohttp.ClientSession

# https://datatracker.ietf.org/doc/html/rfc2616#section-13.5.1
HOP_BY_HOP_HEADERS = {
    hdrs.CONNECTION,
    hdrs.KEEP_ALIVE,
    hdrs.PROXY_AUTHENTICATE,
    hdrs.PROXY_AUTHORIZATION,
    hdrs.TE,
    hdrs.TRAILER,
    hdrs.TRANSFER_ENCODING,
    hdrs.UPGRADE,
}

# Headers that aiohttp would otherwise generate by default
SKIP_AUTO_HEADERS = {
    hdrs.ACCEPT,
    hdrs.ACCEPT_ENCODING,
    hdrs.CONTENT_TYPE,
    hdrs.USER_AGENT,
}


async def forward(upstream_port: int, request: web.Request) -> web.StreamResponse:
    try:
        upstream_response = await session.request(
            request.method,
            request.url.with_host("127.0.0.1").with_port(upstream_port),
            headers=[
                (key, value)
                for key, value in request.headers.items()
                if key not in HOP_BY_HOP_HEADERS
            ],
            data=request.content.iter_any() if request.body_exists else None,
            allow_redirects=False,
            auto_decompress=False,
            skip_auto_headers=SKIP_AUTO_HEADERS,
        )
    except aiohttp.ClientError as error:
        logging.error(
            "Failed to forward %s %s to port %d: %s",
            request.method,
            request.url.path,
            upstream_port,
            error,
        )
        raise web.HTTPBadGateway from error

    response = web.StreamResponse(status=upstream_response.status, reason=upstream_response.reason)
    response.headers.extend(
        (key, value)
        for key, value in upstream_response.headers.items()
        if key not in HOP_BY_HOP_HEADERS
    )
    assert request.remote is not None
    response.headers["X-Real-IP"] = request.remote
    response.headers["X-Forwarded-Port"] = str(proxy_port)
    await response.prepare(request)
    async for data in upstream_response.content.iter_any():
        await response.write(data)
    await response.write_eof()
    return response


def run_help_center_dev_server(
    external_host: str, port: int = help_center_port
) -> "subprocess.Popen[bytes]":
    env = os.environ.copy()
    env["ZULIP_WEB_APP_PROXY_PORT"] = str(proxy_port)

    return subprocess.Popen(
        [
            "/usr/local/bin/corepack",
            "pnpm",
            "dev",
            f"--port={port}",
            "--host",
            f"--allowed-hosts={urlsplit(external_host).hostname}",
        ],
        cwd="starlight_help",
        env=env,
    )


@web.middleware
async def help_center_middleware(
    request: web.Request, handler: Callable[[web.Request], Awaitable[web.StreamResponse]]
) -> web.StreamResponse:
    if request.path.startswith("/help"):
        try:
            filename = request.match_info["filename"]
            _name, ext = os.path.splitext(filename)
            if not ext:
                filename = os.path.join(filename, "index.html")
            request.match_info["filename"] = filename
        except KeyError:
            pass

    return await handler(request)


middlewares = []
if options.help_center_static_build:
    middlewares.append(help_center_middleware)

app = web.Application(middlewares=middlewares)


def setup_routes(
    enable_help_center: bool = False, enable_help_center_dev_server: bool = False
) -> None:
    if enable_help_center:
        # Order of adding the rules matters. aiohttp will stop at the first
        # match, and we want `/help` to be matched before Django URIs.
        try:
            app.router.add_static("/help", "starlight_help/dist")
        except ValueError:
            print("""Please run the build step for the help center before enabling it.
The instructions for the build step can be found in the `./devtools`
page. `/help` urls will give you an error until you complete the
build step and rerun `run-dev`.""")
    elif enable_help_center_dev_server:

        async def redirect_help(request: web.Request) -> web.HTTPFound:
            return web.HTTPFound(request.url.with_port(help_center_port))

        app.add_routes(
            [
                web.route(hdrs.METH_ANY, r"/{path:(help).*}", redirect_help),
            ]
        )
    app.add_routes(
        [
            web.route(
                hdrs.METH_ANY, r"/{path:json/events|api/v1/events}", partial(forward, tornado_port)
            ),
            web.route(hdrs.METH_ANY, r"/{path:webpack/.*}", partial(forward, webpack_port)),
            web.route(hdrs.METH_ANY, r"/{path:api/v1/tus/.*}", partial(forward, tusd_port)),
            web.route(hdrs.METH_ANY, r"/{path:.*}", partial(forward, django_port)),
        ]
    )


def print_listeners(external_host_url: str) -> None:
    if options.only_help_center:
        print(
            f"\n{CYAN}Help center dev server running on:{ENDC} {external_host_url}/help\nZulip web app and other related services will not run in this mode."
        )
        return

    print(f"\nStarting Zulip on:\n\n\t{CYAN}{external_host_url}/{ENDC}\n\nInternal ports:")
    ports = [
        (proxy_port, "Development server proxy (connect here)"),
        (django_port, "Django"),
        (tornado_port, "Tornado"),
    ]

    if not options.test:
        ports.append((webpack_port, "webpack"))

    if help_center_dev_server_enabled:
        ports.append((help_center_port, "Help center - Astro dev server"))

    if not options.streamlined:
        ports.append((tusd_port, "tusd"))

    for port, label in ports:
        print(f"   {port}: {label}")
    print()


def https_log_filter(record: logging.LogRecord) -> bool:
    # aiohttp emits an exception with a traceback when receiving an
    # https request (https://github.com/aio-libs/aiohttp/issues/8065).
    # Abbreviate it to a one-line message.
    if (
        record.exc_info is not None
        and isinstance(error := record.exc_info[1], BadStatusLine)
        and error.message.startswith(
            (
                "Invalid method encountered:\n\n  b'\\x16",
                'Invalid method encountered:\n\n  b"\\x16',
            )
        )
    ):
        record.msg = "Rejected https request (this development server only supports http)"
        record.exc_info = None
    return True


logging.getLogger("aiohttp.server").addFilter(https_log_filter)

runner: web.AppRunner
children: list["subprocess.Popen[bytes]"] = []


async def serve() -> None:
    global runner, session

    # Since we can't import settings from here, we duplicate some
    # EXTERNAL_HOST logic from dev_settings.py.
    IS_DEV_DROPLET = pwd.getpwuid(os.getuid()).pw_name == "zulipdev"
    if IS_DEV_DROPLET:
        # Technically, the `zulip.` is a subdomain of the server, so
        # this is kinda misleading, but 99% of development is done on
        # the default/zulip subdomain.
        default_hostname = "zulip." + os.uname()[1].lower()
    else:
        default_hostname = "localhost"

    external_host = os.getenv("EXTERNAL_HOST", f"{default_hostname}:{proxy_port}")
    http_protocol = "https" if options.behind_https_proxy else "http"
    external_host_url = f"{http_protocol}://{external_host}"

    if options.only_help_center:
        children.append(run_help_center_dev_server(external_host_url, proxy_port))
        print_listeners(external_host_url)
        return

    if options.test:
        do_one_time_webpack_compile()
    else:
        children.append(start_webpack_watcher())

    if help_center_dev_server_enabled:
        children.append(run_help_center_dev_server(external_host_url))

    setup_routes(options.help_center_static_build, options.help_center_dev_server)

    children.extend(subprocess.Popen(cmd) for cmd in server_processes())

    session = aiohttp.ClientSession()
    runner = web.AppRunner(app, auto_decompress=False, handler_cancellation=True)
    await runner.setup()
    site = web.TCPSite(runner, host=options.interface, port=proxy_port)
    try:
        await site.start()
    except OSError as e:
        if e.errno == errno.EADDRINUSE:
            print("\n\nERROR: You probably have another server running!!!\n\n")
        raise

    print_listeners(external_host_url)


loop = asyncio.new_event_loop()

try:
    loop.run_until_complete(serve())
    for s in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(s, loop.stop)
    loop.run_forever()
finally:
    loop.run_until_complete(runner.cleanup())
    loop.run_until_complete(session.close())

    for child in children:
        child.terminate()

    print("Waiting for children to stop...")
    for child in children:
        child.wait()

    # Remove pid file when development server closed correctly.
    os.remove(pid_file_path)
```

--------------------------------------------------------------------------------

---[FILE: run-mypy]---
Location: zulip-main/tools/run-mypy

```text
#!/usr/bin/env python3
import argparse
import os
import subprocess
import sys

from zulint import lister

TOOLS_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(TOOLS_DIR)
os.chdir(ROOT_DIR)

sys.path.append(ROOT_DIR)
from tools.lib.test_script import add_provision_check_override_param, assert_provisioning_status_ok

exclude = [
    "stubs/",
]

parser = argparse.ArgumentParser(description="Run mypy on files tracked by git.")
parser.add_argument("targets", nargs="*", help="files and directories to check (default: .)")
parser.add_argument("--version", action="store_true", help="show mypy version information and exit")
parser.add_argument("-m", "--modified", action="store_true", help="check only modified files")
parser.add_argument(
    "--scripts-only", action="store_true", help="only check extensionless python scripts"
)
parser.add_argument(
    "-a", "--all", action="store_true", help="check all files, bypassing the default exclude list"
)
parser.add_argument("-d", "--use-daemon", action="store_true", help="run mypy daemon instead")
add_provision_check_override_param(parser)
parser.add_argument("--quiet", action="store_true", help="suppress mypy summary output")
args = parser.parse_args()
assert_provisioning_status_ok(args.skip_provision_check)

if args.use_daemon:
    mypy_command = "dmypy"
else:
    mypy_command = "mypy"

if args.version:
    print("mypy command:", mypy_command)
    sys.exit(subprocess.call([mypy_command, "--version"]))

if args.all:
    exclude = []

# find all non-excluded files in current directory
files_dict = lister.list_files(
    targets=args.targets,
    ftypes=["py", "pyi"],
    use_shebang=True,
    modified_only=args.modified,
    exclude=exclude,
    group_by_ftype=True,
    extless_only=args.scripts_only,
)
pyi_files = list(files_dict["pyi"])
python_files = [
    fpath for fpath in files_dict["py"] if not fpath.endswith(".py") or fpath + "i" not in pyi_files
]
if not python_files and not pyi_files:
    print("There are no files to run mypy on.")
    sys.exit(0)

mypy_args: list[str] = []
# --no-error-summary is a mypy flag that comes after all dmypy options
if args.use_daemon:
    mypy_args += ["run", "--"]
if args.quiet:
    mypy_args += ["--no-error-summary"]
mypy_args += ["--", *python_files, *pyi_files]
rc = subprocess.call([mypy_command, *mypy_args])

if rc != 0:
    print()
    print("See https://zulip.readthedocs.io/en/latest/testing/mypy.html for debugging tips.")

sys.exit(rc)
```

--------------------------------------------------------------------------------

---[FILE: run-tsc]---
Location: zulip-main/tools/run-tsc

```text
#!/bin/sh
ZULIP_PATH="$(dirname "$0")/.."
exec "$ZULIP_PATH/node_modules/.bin/tsc" --project "$ZULIP_PATH" "$@"
```

--------------------------------------------------------------------------------

---[FILE: semgrep-py.yml]---
Location: zulip-main/tools/semgrep-py.yml

```yaml
# See https://semgrep.dev/docs/writing-rules/rule-syntax/ for documentation on YAML rule syntax

rules:
  ####################### PYTHON RULES #######################
  - id: deprecated-render-usage
    pattern: django.shortcuts.render_to_response(...)
    message: "Use render() (from django.shortcuts) instead of render_to_response()"
    languages: [python]
    severity: ERROR

  - id: dont-use-stream-objects-filter
    pattern: Stream.objects.filter(...)
    message: "Please use access_stream_by_*() to fetch Stream objects"
    languages: [python]
    severity: ERROR
    paths:
      include:
        - zerver/views/

  - id: time-machine-travel-specify-tick
    patterns:
      - pattern: time_machine.travel(...)
      - pattern-not: time_machine.travel(..., tick=..., ...)
    message: |
      Specify tick kwarg value for time_machine.travel(). Most cases will want to use False.
    languages: [python]
    severity: ERROR

  - id: limit-message-filter
    patterns:
      - pattern: Message.objects.filter(...)
      - pattern-not: Message.objects.filter(..., realm=..., ...)
      - pattern-not: Message.objects.filter(..., realm_id=..., ...)
      - pattern-not: Message.objects.filter(..., realm_id__in=..., ...)
      - pattern-not: Message.objects.filter(..., id=..., ...)
      - pattern-not: Message.objects.filter(..., id__in=..., ...)
      - pattern-not: Message.objects.filter(..., id__lt=..., ...)
      - pattern-not: Message.objects.filter(..., id__gt=..., ...)
    message: "Set either a realm limit or an id limit on Message queries"
    languages: [python]
    severity: ERROR
    paths:
      exclude:
        - "**/migrations/"

  - id: dont-use-empty-select_related
    pattern-either:
      - pattern: $X.select_related()
      - pattern: $X.prefetch_related()
    message: |
      Do not use a bare '.select_related()' or '.prefetch_related()', which can join many more tables than expected.  Specify the relations to follow explicitly.
    languages: [python]
    severity: ERROR

  - id: use-wrapped-mimetypes
    pattern-either:
      - pattern: mimetypes.guess_type
      - pattern: mimetypes.guess_file_type
      - pattern: mimetypes.guess_all_extensions
      - pattern: mimetypes.guess_extension
    message: Use zerver.lib.mime_types (to ensure our EXTRA_MIME_TYPES are added)
    languages: [python]
    severity: ERROR
    paths:
      exclude:
        - zerver/lib/mime_types.py

  - id: dont-import-models-in-migrations
    patterns:
      - pattern-not: from zerver.lib.migrate import $X
      - pattern-not: from zerver.lib.partial import partial
      - pattern-not: from zerver.lib.mime_types import $X
      - pattern-not: from zerver.lib.redis_utils import get_redis_client
      - pattern-not: from zerver.lib.utils import generate_api_key
      - pattern-not: from zerver.models.linkifiers import filter_pattern_validator
      - pattern-not: from zerver.models.linkifiers import url_template_validator
      - pattern-not: from zerver.models.streams import generate_email_token_for_stream
      - pattern-not: from zerver.models.realms import generate_realm_uuid_owner_secret
      - pattern-either:
          - pattern: from zerver import $X
          - pattern: from analytics import $X
          - pattern: from confirmation import $X
    message: "Don't import models or other code in migrations; see https://zulip.readthedocs.io/en/latest/subsystems/schema-migrations.html"
    languages: [python]
    severity: ERROR
    paths:
      include:
        - "**/migrations"
      exclude:
        - zerver/migrations/0001_squashed_0569.py
        - zerver/migrations/0032_verify_all_medium_avatar_images.py
        - zerver/migrations/0104_fix_unreads.py
        - zerver/migrations/0206_stream_rendered_description.py
        - zerver/migrations/0209_user_profile_no_empty_password.py
        - zerver/migrations/0260_missed_message_addresses_from_redis_to_db.py
        - zerver/migrations/0387_reupload_realmemoji_again.py
        - zerver/migrations/0443_userpresence_new_table_schema.py
        - zerver/migrations/0493_rename_userhotspot_to_onboardingstep.py
        - pgroonga/migrations/0002_html_escape_subject.py

  - id: use-addindexconcurrently
    pattern: django.db.migrations.AddIndex(...)
    message: "Import and use AddIndexConcurrently from django.contrib.postgres.operations rather than AddIndex"
    languages: [python]
    severity: ERROR
    paths:
      include:
        - "**/migrations"
      exclude:
        - analytics/migrations/0008_add_count_indexes.py
        - zerver/migrations/0001_initial.py
        - zerver/migrations/0001_squashed_0569.py
        - zerver/migrations/0082_index_starred_user_messages.py
        - zerver/migrations/0083_index_mentioned_user_messages.py
        - zerver/migrations/0095_index_unread_user_messages.py
        - zerver/migrations/0098_index_has_alert_word_user_messages.py
        - zerver/migrations/0099_index_wildcard_mentioned_user_messages.py
        - zerver/migrations/0112_index_muted_topics.py
        - zerver/migrations/0177_user_message_add_and_index_is_private_flag.py
        - zerver/migrations/0180_usermessage_add_active_mobile_push_notification.py
        - zerver/migrations/0268_add_userpresence_realm_timestamp_index.py
        - zerver/migrations/0343_alter_useractivityinterval_index_together.py
        - zerver/migrations/0351_user_topic_visibility_indexes.py
        - zerver/migrations/0443_userpresence_new_table_schema.py
        - zerver/migrations/0446_realmauditlog_zerver_realmauditlog_user_subscriptions_idx.py
        - zerver/migrations/0449_scheduledmessage_zerver_unsent_scheduled_messages_indexes.py
        - zilencer/migrations/0016_remote_counts.py
        - zilencer/migrations/0017_installationcount_indexes.py
        - zilencer/migrations/0029_update_remoterealm_indexes.py
        - zilencer/migrations/0058_remoteinstallationcount_add_mobile_pushes_forwarded_index.py
        - zilencer/migrations/0059_remoterealmauditlog_add_synced_billing_event_type_index.py

  - id: use-removeindexconcurrently
    pattern: django.db.migrations.RemoveIndex(...)
    message: "Import and use RemoveIndexConcurrently from django.contrib.postgres.operations rather than RemoveIndex"
    languages: [python]
    severity: ERROR
    paths:
      include:
        - "**/migrations"
      exclude:
        - zerver/migrations/0473_remove_message_non_realm_id_indexes.py
        - zerver/migrations/0486_clear_old_data_for_unused_usermessage_flags.py
        - zilencer/migrations/0038_unique_server_remote_id.py

  - id: html-format
    languages: [python]
    pattern-either:
      - pattern: markupsafe.Markup(... .format(...))
      - pattern: markupsafe.Markup(f"...")
      - pattern: markupsafe.Markup(f"..." "...")
      - pattern: markupsafe.Markup("..." f"...")
      - pattern: markupsafe.Markup("..." f"..." "...")
      - pattern: markupsafe.Markup(... + ...)
    severity: ERROR
    message: "Do not write an HTML injection vulnerability please"

  - id: sql-format
    languages: [python]
    pattern-either:
      - pattern: ... .execute("...".format(...), ...)
      - pattern: ... .execute(f"...", ...)
      - pattern: ... .execute(f"..." "...", ...)
      - pattern: ... .execute("..." f"...", ...)
      - pattern: ... .execute("..." f"..." "...", ...)
      - pattern: ... .execute(... + ..., ...)
      - pattern: psycopg2.sql.SQL(... .format(...))
      - pattern: psycopg2.sql.SQL(f"...")
      - pattern: psycopg2.sql.SQL(f"..." "...")
      - pattern: psycopg2.sql.SQL("..." f"...")
      - pattern: psycopg2.sql.SQL("..." f"..." "...")
      - pattern: psycopg2.sql.SQL(... + ...)
      - pattern: django.db.migrations.RunSQL(..., "..." .format(...), ...)
      - pattern: django.db.migrations.RunSQL(..., f"...", ...)
      - pattern: django.db.migrations.RunSQL(..., f"..." "...", ...)
      - pattern: django.db.migrations.RunSQL(..., "..." f"...", ...)
      - pattern: django.db.migrations.RunSQL(..., "..." f"..." "...", ...)
      - pattern: django.db.migrations.RunSQL(..., ... + ..., ...)
      - pattern: django.db.migrations.RunSQL(..., [..., "..." .format(...), ...], ...)
      - pattern: django.db.migrations.RunSQL(..., [..., f"...", ...], ...)
      - pattern: django.db.migrations.RunSQL(..., [..., f"..." "...", ...], ...)
      - pattern: django.db.migrations.RunSQL(..., [..., "..." f"...", ...], ...)
      - pattern: django.db.migrations.RunSQL(..., [..., "..." f"..." "...", ...], ...)
      - pattern: django.db.migrations.RunSQL(..., [..., ... + ..., ...], ...)
    severity: ERROR
    message: "Do not write a SQL injection vulnerability please"
    paths:
      exclude:
        - zerver/migrations/0531_convert_most_ids_to_bigints.py

  - id: translated-format-lazy
    languages: [python]
    pattern: django.utils.translation.gettext_lazy(...).format(...)
    severity: ERROR
    message: "Immediately formatting a lazily translated string destroys its laziness"

  - id: translated-positional-field
    languages: [python]
    patterns:
      - pattern-either:
          - pattern: django.utils.translation.gettext("$MESSAGE")
          - pattern: django.utils.translation.pgettext($CONTEXT, "$MESSAGE")
          - pattern: django.utils.translation.gettext_lazy("$MESSAGE")
          - pattern: django.utils.translation.pgettext_lazy($CONTEXT, "$MESSAGE")
      - metavariable-regex:
          metavariable: $MESSAGE
          regex: (^|.*[^{])(\{\{)*\{[:!}].*
    severity: ERROR
    message: "Prefer {named} fields over positional {} in translated strings"

  - id: percent-formatting
    languages: [python]
    pattern-either:
      - pattern: '"..." % ...'
      - pattern: django.utils.translation.gettext(...) % ...
      - pattern: django.utils.translation.pgettext(...) % ...
      - pattern: django.utils.translation.gettext_lazy(...) % ...
      - pattern: django.utils.translation.pgettext_lazy(...) % ...
    severity: ERROR
    message: "Prefer f-strings or .format for string formatting"

  - id: change-user-is-active
    languages: [python]
    patterns:
      - pattern-either:
          - pattern: |
              $X.is_active = ...
          - pattern: |
              setattr($X, 'is_active', ...)
      - pattern-not-inside: |
          def change_user_is_active(...):
            ...
    message: "Use change_user_is_active to mutate user_profile.is_active"
    severity: ERROR
    paths:
      exclude:
        - zerver/migrations/0373_fix_deleteduser_dummies.py

  - id: confirmation-object-get
    languages: [python]
    patterns:
      - pattern-either:
          - pattern: Confirmation.objects.get(...)
          - pattern: Confirmation.objects.filter(..., confirmation_key=..., ...)
      - pattern-not-inside: |
          def get_object_from_key(...):
            ...
    paths:
      exclude:
        - zerver/tests/
    message: "Do not fetch a Confirmation object directly, use get_object_from_key instead"
    severity: ERROR

  - id: dont-make-batched-migration-atomic
    patterns:
      - pattern: |
          class Migration(migrations.Migration):
              ...
      - pattern-inside: |
          ...
          BATCH_SIZE = ...
          ...
      - pattern-not: |
          class Migration(migrations.Migration):
              atomic = False
    paths:
      include:
        - "**/migrations"
    message: 'A batched migration should not be atomic. Add "atomic = False" to the Migration class'
    languages: [python]
    severity: ERROR

  - id: typed_endpoint_without_keyword_only_param
    patterns:
      - pattern: |
          @typed_endpoint
          def $F(...)-> ...:
            ...
      - pattern-not-inside: |
          @typed_endpoint
          def $F(..., *, ...)-> ...:
            ...
      - pattern-not-inside: |
          @typed_endpoint
          def $F(..., *args, ...)-> ...:
            ...
    message: |
      @typed_endpoint should not be used without keyword-only parameters.
      Make parameters to be parsed from the request as keyword-only,
      or use @typed_endpoint_without_parameters instead.
    languages: [python]
    severity: ERROR

  - id: dont-nest-annotated-types-with-param-config
    patterns:
      - pattern-not: |
          def $F(..., invalid_param: typing.Optional[<...  zerver.lib.typed_endpoint.ApiParamConfig(...) ...>], ...) -> ...:
            ...
      - pattern-not: |
          def $F(..., $A: typing.Annotated[<...  zerver.lib.typed_endpoint.ApiParamConfig(...) ...>], ...) -> ...:
            ...
      - pattern-not: |
          def $F(..., $A: typing.Annotated[<...  zerver.lib.typed_endpoint.ApiParamConfig(...) ...>] = ..., ...) -> ...:
            ...
      - pattern-either:
          - pattern: |
              def $F(..., $A: $B[<...  zerver.lib.typed_endpoint.ApiParamConfig(...) ...>], ...) -> ...:
                ...
          - pattern: |
              def $F(..., $A: $B[<...  zerver.lib.typed_endpoint.ApiParamConfig(...) ...>] = ..., ...) -> ...:
                ...
    message: |
      Annotated types containing zerver.lib.typed_endpoint.ApiParamConfig should not be nested inside Optional. Use Annotated[Optional[...], zerver.lib.typed_endpoint.ApiParamConfig(...)] instead.
    languages: [python]
    severity: ERROR

  - id: exists-instead-of-count
    patterns:
      - pattern-either:
          - pattern: ... .count() == 0
          - pattern: |
              if not ... .count():
                  ...
    message: 'Use "not .exists()" instead; it is more efficient'
    languages: [python]
    severity: ERROR

  - id: exists-instead-of-count-not-zero
    patterns:
      - pattern-either:
          - pattern: ... .count() != 0
          - pattern: ... .count() > 0
          - pattern: ... .count() >= 1
          - pattern: |
              if ... .count():
                  ...
    message: 'Use ".exists()" instead; it is more efficient'
    languages: [python]
    severity: ERROR

  - id: functools-partial
    pattern: functools.partial
    message: "Replace functools.partial with zerver.lib.partial.partial for type safety"
    languages: [python]
    severity: ERROR

  - id: timedelta-positional-argument
    patterns:
      - pattern: datetime.timedelta(...)
      - pattern-not: datetime.timedelta(0)
      - pattern-not: datetime.timedelta(..., days=..., ...)
      - pattern-not: datetime.timedelta(..., seconds=..., ...)
      - pattern-not: datetime.timedelta(..., microseconds=..., ...)
      - pattern-not: datetime.timedelta(..., milliseconds=..., ...)
      - pattern-not: datetime.timedelta(..., minutes=..., ...)
      - pattern-not: datetime.timedelta(..., hours=..., ...)
      - pattern-not: datetime.timedelta(..., weeks=..., ...)
    message: |
      Specify timedelta with named arguments.
    languages: [python]
    severity: ERROR

  - id: time-machine
    languages: [python]
    patterns:
      - pattern: unittest.mock.patch("$FUNCTION", return_value=$TIME)
      - metavariable-regex:
          metavariable: $FUNCTION
          regex: .*timezone_now
    fix: time_machine.travel($TIME, tick=False)
    severity: ERROR
    message: "Use the time_machine package, rather than mocking timezone_now"

  - id: urlparse
    languages: [python]
    pattern-either:
      - pattern: urllib.parse.urlparse
      - pattern: urllib.parse.urlunparse
      - pattern: urllib.parse.ParseResult
    severity: ERROR
    message: "Use urlsplit rather than urlparse"

  - id: argparse-redundant-str
    patterns:
      - pattern: |
          ....add_argument(..., type=str, ...)
    message: |
      The `type=str` argument is redundant in `argparse` because `str` is the default type.
    fix-regex:
      regex: ',\s*type=str'
      replacement: ""
    languages: [python]
    severity: ERROR

  - id: iterator-all
    message: Use .iterator() when iterating over large sets once
    pattern: |-
      for $VAR in $THING.objects.all():
          $BODY
    fix: |-
      for $VAR in $THING.objects.all().iterator():
          $BODY
    languages: [python]
    severity: ERROR
```

--------------------------------------------------------------------------------

---[FILE: setup-git-repo]---
Location: zulip-main/tools/setup-git-repo

```text
#!/usr/bin/env bash

if ! [ -d ".git/hooks/" ]; then
    echo "Error: Could not find .git/hooks directory"
    echo "Please re-run this script from the root of your zulip.git checkout"
    exit 1
fi

for hook in pre-commit commit-msg; do
    ln -snf ../../tools/"$hook" .git/hooks/
done
```

--------------------------------------------------------------------------------

---[FILE: show-profile-results]---
Location: zulip-main/tools/show-profile-results

```text
#!/usr/bin/env python3
import pstats
import sys

"""
This is a helper script to make it easy to show profile
results after using a Python decorator.  It's meant to be
a simple example that you can hack on, or better yet, you
can find more advanced tools for showing profiler results.
"""

try:
    fn = sys.argv[1]
except IndexError:
    print(
        """
    Please supply a filename.  (If you use the profiled decorator,
    the file will have a suffix of ".profile".)
    """
    )
    sys.exit(1)

p = pstats.Stats(fn)
p.strip_dirs().sort_stats("cumulative").print_stats(25)
p.strip_dirs().sort_stats("time").print_stats(25)
```

--------------------------------------------------------------------------------

---[FILE: stop-run-dev]---
Location: zulip-main/tools/stop-run-dev

```text
#!/usr/bin/env python3

import os
import signal
import sys

os.chdir(os.path.join(os.path.dirname(__file__), ".."))
pid_file_path = os.path.join(os.path.join(os.getcwd(), "var/run/run_dev.pid"))

try:
    with open(pid_file_path) as pid_file:
        try:
            pid = int(pid_file.read())
        except ValueError:
            print("PID value is not an integer!")
            sys.exit(1)
except Exception as e:
    print("PID file can't be opened!")
    print(e)
    sys.exit(1)

# Kill development server process group.
try:
    os.killpg(pid, signal.SIGTERM)
except OSError as e:
    print(e)
    sys.exit(1)

print("Done")
```

--------------------------------------------------------------------------------

````
