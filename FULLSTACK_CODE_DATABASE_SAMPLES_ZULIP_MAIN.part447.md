---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 447
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 447 of 1290)

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

---[FILE: restart-server]---
Location: zulip-main/scripts/restart-server

```text
#!/usr/bin/env python3
import contextlib
import json
import logging
import os
import pwd
import shlex
import subprocess
import sys
import time

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from scripts.lib.setup_path import setup_path

setup_path()

from scripts.lib.supervisor import list_supervisor_processes
from scripts.lib.zulip_tools import (
    DEPLOYMENTS_DIR,
    ENDC,
    LOCK_DIR,
    OKGREEN,
    WARNING,
    get_config,
    get_config_file,
    get_tornado_ports,
    has_application_server,
    has_process_fts_updates,
    overwrite_symlink,
    start_arg_parser,
    su_to_zulip,
)

action = "restart"
if not sys.argv[0].endswith("restart-server"):
    action = "start"
verbing = action.title() + "ing"

logging.Formatter.converter = time.gmtime
logging.basicConfig(format=f"%(asctime)s {action}-server: %(message)s", level=logging.INFO)

parser = start_arg_parser(action=action, add_help=True)
args = parser.parse_args()

deploy_path = os.path.realpath(os.path.join(os.path.dirname(__file__), ".."))
os.chdir(deploy_path)

username = pwd.getpwuid(os.getuid()).pw_name
if username == "root":
    su_to_zulip()
elif username != "zulip":
    logging.error("Must be run as user 'zulip'.")
    sys.exit(1)

if os.environ.get("RUNNING_UNDER_CRON") and os.path.exists(LOCK_DIR):
    logging.info("Skipping cron-triggered restart during deploy.")
    sys.exit(1)

if args.tornado_reshard:
    tornado_reshard_files = ["/etc/zulip/sharding.json", "/etc/zulip/nginx_sharding_map.conf"]
    if not all(os.path.exists(f"{path}.tmp") for path in tornado_reshard_files):
        logging.info(
            "No resharding changes to apply!  Edit zulip.conf and run refresh-sharding-and-restart"
        )
        sys.exit(1)

if not args.skip_checks:
    logging.info("Running syntax and database checks")
    subprocess.check_call(["./manage.py", "check", "--database", "default"])

if args.fill_cache:
    logging.info("Filling memcached caches")
    subprocess.check_call(["./manage.py", "fill_memcached_caches", "--automated", "--skip-checks"])

current_symlink = os.path.join(DEPLOYMENTS_DIR, "current")
last_symlink = os.path.join(DEPLOYMENTS_DIR, "last")
change_symlink = os.readlink(current_symlink) != deploy_path
if change_symlink:
    overwrite_symlink(os.readlink(current_symlink), last_symlink)
    overwrite_symlink(deploy_path, current_symlink)

config_file = get_config_file()
tornado_ports = get_tornado_ports(config_file)
workers = []

if has_application_server():
    # Start by restarting the workers and similar processes, one at a
    # time.  Workers can always support processing events with old event
    # contents, but cannot necessarily understand events enqueued by a
    # newer Django process.  Restarting them one at a time, rather than
    # all-at-once, minimizes the downtime of each, and reduces startup
    # contention.
    #
    # For "start" or less-graceful circumstances, we don't need to
    # iterate; we'll stop all of them at once, and start them all later.
    # In those cases, using the glob form is faster -- but if we do need
    # to iterate, we need to expand the glob.
    if action == "start" or args.less_graceful:
        workers.append("zulip-workers:*")
    else:
        workers.extend(list_supervisor_processes(["zulip-workers:*"]))

    if has_application_server(once=True):
        # These used to be included in "zulip-workers:*"; since we may
        # be restarting an older version of Zulip, which has not
        # applied puppet to reload the new list of processes, only
        # stop them if they currently exist according to
        # `supervisorctl`.
        workers.extend(
            list_supervisor_processes(
                [
                    "zulip_deliver_scheduled_emails",
                    "zulip_deliver_scheduled_messages",
                ]
            )
        )

    # This is an optional service, so may or may not exist
    workers.extend(list_supervisor_processes(["zulip-katex"]))

    # This does have some Python code, which reads from settings.py,
    # so we need to restart it on every deploy.  A short outage during
    # the restart is fine, as clients will transparently retry.
    workers.append("zulip-tus")

    workers.extend(list_supervisor_processes(["zulip-email-server"]))

if has_process_fts_updates():
    workers.append("process-fts-updates")

# Before we start (re)starting main services, make sure to start any
# optional auxiliary services that we don't stop, but do expect to be
# running, and aren't currently.  These get new versions by getting
# updated supervisor files, and puppet restarts them -- so we never
# restart them in here, only start them.
aux_services = list_supervisor_processes(["go-camo", "smokescreen"], only_running=False)
if aux_services:
    subprocess.check_call(["supervisorctl", "start", *aux_services])

if args.only_django:
    workers = []
    check_services = ["zulip-django"]
else:
    check_services = [*workers, "zulip-django", "zulip-tornado:*"]

# If none of the workers nor the application servers are running, this
# is actually a "start," not a restart, which means we will defer
# workers to later.
running_services = list_supervisor_processes(check_services, only_running=True)
if action == "restart" and len(running_services) == 0:
    action = "start"
    verbing = "Starting"
elif action == "start":
    existing_services = list_supervisor_processes(check_services)
    if existing_services == running_services:
        # Check if the version that is currently running is the
        # version that we would have started.  We do this via
        # comparing our CWD to the CWD of the oldest uwsgi worker.
        oldest_pid = subprocess.check_output(
            ["pgrep", "--oldest", "--full", "zulip-django uWSGI worker"], text=True
        ).strip()
        running_cwd = os.readlink(f"/proc/{oldest_pid}/cwd")
        if deploy_path != running_cwd:
            logging.warning("Mismatch between 'current' symlink and currently-running code!")
            logging.warning("Already-running deploy: %s", running_cwd)
            logging.warning("We would have started:  %s", deploy_path)
            logging.warning("To restart, call %s/scripts/restart-server", deploy_path)
        else:
            logging.info("Zulip is already started; nothing to do!")
        sys.exit(0)


def restart_or_start(service: str) -> None:
    our_verb = action
    existing_services = list_supervisor_processes([service])
    running_services = list_supervisor_processes([service], only_running=True)
    if our_verb == "restart" and len(running_services) == 0:
        our_verb = "start"
    elif our_verb == "start" and existing_services == running_services:
        logging.info("%s already started!", service)
        return
    subprocess.check_call(["supervisorctl", our_verb, service])


def ports_as_set(val: int | list[int]) -> frozenset[int]:
    return frozenset(val) if isinstance(val, list) else frozenset([val])


def update_tornado_sharding() -> list[int]:
    with open("/etc/zulip/sharding.json") as old_shard_fh:
        old_sharding = json.load(old_shard_fh)
    with open("/etc/zulip/sharding.json.tmp") as new_shard_fh:
        new_sharding = json.load(new_shard_fh)
    affected_tornados: set[int] = set()
    for realm in set().union(old_sharding["shard_map"], new_sharding["shard_map"]):
        old_ports = ports_as_set(old_sharding["shard_map"].get(realm, []))
        new_ports = ports_as_set(new_sharding["shard_map"].get(realm, []))
        if old_ports != new_ports:
            # A realm sharded across multiple ports gets requests at
            # random from nginx, and each does an X-Accel-Redirect to
            # the user's right Tornado instance. So all ports in the
            # set need a restart when we add or remove ports.
            affected_tornados |= old_ports | new_ports
    old_regex_set = {
        (regex, ports_as_set(ports)) for (regex, ports) in old_sharding["shard_regexes"]
    }
    new_regex_set = {
        (regex, ports_as_set(ports)) for (regex, ports) in new_sharding["shard_regexes"]
    }
    for regex, ports in old_regex_set ^ new_regex_set:
        affected_tornados |= ports

    tornado_reshard_files = ["/etc/zulip/sharding.json", "/etc/zulip/nginx_sharding_map.conf"]
    for path in tornado_reshard_files:
        os.rename(f"{path}.tmp", path)

    return list(affected_tornados)


if action == "restart" and len(workers) > 0:
    if args.less_graceful:
        # The less graceful form stops every worker now; we start them
        # back up at the end.
        logging.info("Stopping workers")
        subprocess.check_call(["supervisorctl", "stop", *workers])
    else:
        # We cannot pass all of these to one `supervisorctl restart`
        # because that takes them all down at once, waits until they are
        # all down, and then brings them back up; doing them sequentially
        # requires multiple `supervisorctl restart` calls.
        for worker in workers:
            logging.info("Restarting %s", worker)
            restart_or_start(worker)

if has_application_server():
    if args.tornado_reshard:
        affected_tornado_ports = update_tornado_sharding()
        logging.info("Tornado ports affected by this resharding: %s", affected_tornado_ports)
    else:
        affected_tornado_ports = tornado_ports
    if not args.only_django:
        # Next, we restart the Tornado processes sequentially, in order to
        # minimize downtime of the tornado service caused by too many
        # Python processes restarting at the same time, resulting in each
        # receiving insufficient priority.  This is important, because
        # Tornado being unavailable for too long is the main source of
        # user-visible downtime when we restart a Zulip server.  We do
        # this before restarting Django, in case there are new event types
        # which it will need to know how to deal with.
        if len(tornado_ports) > 1:
            for p in affected_tornado_ports:
                # Restart Tornado processes individually for a better rate of
                # restarts.  This also avoids behavior with restarting a whole
                # supervisord group where if any individual process is slow to
                # stop, the whole bundle stays stopped for an extended time.
                logging.info("%s Tornado process on port %s", verbing, p)
                restart_or_start(f"zulip-tornado:zulip-tornado-port-{p}")
        else:
            logging.info("%s Tornado process", verbing)
            restart_or_start("zulip-tornado:*")

    # Finally, restart the Django uWSGI processes.
    if (
        action == "restart"
        and not args.less_graceful
        and get_config(config_file, "application_server", "rolling_restart", False)
        and os.path.exists("/home/zulip/deployments/uwsgi-control")
    ):
        # See if it's currently running
        uwsgi_status = subprocess.run(
            ["supervisorctl", "status", "zulip-django"],
            stdout=subprocess.DEVNULL,
            check=False,
        )
        if uwsgi_status.returncode == 0:
            logging.info("Starting rolling restart of django server")
            with contextlib.suppress(FileNotFoundError):
                os.unlink("/var/lib/zulip/django-workers.ready")
            with open("/home/zulip/deployments/uwsgi-control", "w") as control_socket:
                # "c" is chain-reloading:
                # https://uwsgi-docs.readthedocs.io/en/latest/MasterFIFO.html#available-commands
                control_socket.write("c")
            n = 0
            while not os.path.exists("/var/lib/zulip/django-workers.ready"):
                time.sleep(1)
                n += 1
                if n % 5 == 0:
                    logging.info("...")
            logging.info("Chain reloading complete")
        else:
            logging.info("Starting django server")
            subprocess.check_call(["supervisorctl", "start", "zulip-django"])
    else:
        logging.info("%s django server", verbing)
        restart_or_start("zulip-django")

    using_sso = subprocess.check_output(["./scripts/get-django-setting", "USING_APACHE_SSO"])
    if using_sso.strip() == b"True":
        logging.info("Restarting Apache WSGI process...")
        subprocess.check_call(["pkill", "-x", "apache2", "-u", "zulip"])

# If we were doing this non-gracefully, or starting as opposed to
# restarting, we need to turn the workers (back) on.  There's no
# advantage to doing this not-all-at-once.
if (action == "start" or args.less_graceful) and not args.only_django:
    workers = list_supervisor_processes(workers, only_running=False)
    if workers:
        logging.info("Starting workers")
        subprocess.check_call(["supervisorctl", "start", *workers])

if (
    has_application_server()
    and not args.skip_client_reloads
    and not args.only_django
    and not args.tornado_reshard
):
    # All of the servers have been (re)started; now enqueue events in
    # the Tornado servers to tell clients to reload.
    logging.info("Sending reload events to clients in the background")
    subprocess.check_call(["./scripts/reload-clients", "--background"])

logging.info("Done!")
print(OKGREEN + f"Zulip {action}ed successfully!" + ENDC)

if change_symlink and "PWD" in os.environ:
    for symlink in [last_symlink, current_symlink]:
        if os.path.commonprefix([os.environ["PWD"], symlink]) == symlink:
            print(
                """
{}Your shell entered its current directory through a symlink:
  {}
which has now changed. Your shell will not see this change until you run:
  cd {}
to traverse the symlink again.{}
""".format(WARNING, symlink, shlex.quote(os.environ["PWD"]), ENDC),
                file=sys.stderr,
            )
```

--------------------------------------------------------------------------------

---[FILE: start-server]---
Location: zulip-main/scripts/start-server

```text
restart-server
```

--------------------------------------------------------------------------------

---[FILE: stop-server]---
Location: zulip-main/scripts/stop-server

```text
#!/usr/bin/env python3
import logging
import os
import pwd
import subprocess
import sys
import time

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from scripts.lib.setup_path import setup_path

setup_path()

from scripts.lib.supervisor import list_supervisor_processes
from scripts.lib.zulip_tools import (
    ENDC,
    OKGREEN,
    WARNING,
    has_application_server,
    has_process_fts_updates,
    su_to_zulip,
)

deploy_path = os.path.realpath(os.path.join(os.path.dirname(__file__), ".."))
os.chdir(deploy_path)

username = pwd.getpwuid(os.getuid()).pw_name
if username == "root":
    su_to_zulip()
elif username != "zulip":
    logging.error("Must be run as user 'zulip'.")
    sys.exit(1)

logging.Formatter.converter = time.gmtime
logging.basicConfig(format="%(asctime)s stop-server: %(message)s", level=logging.INFO)

services = []

# Start with the least-critical services:
if has_process_fts_updates():
    services.append("process-fts-updates")

if has_application_server():
    # Contrary to the order in (re)start-server, we stop django before the
    # workers, to increase the chance that we finish processing any work
    # that may have been enqueued by the Django, leaving the final state
    # closer to "empty."  We stop Django before Tornado so it doesn't try
    # to make requests to make queues with a down'd Tornado.
    services.append("zulip-django")
    services.append("zulip-tornado:*")
    services.append("zulip-workers:*")
    services.append("zulip-tus")
    services.append("zulip-katex")
    services.append("zulip-email-server")
    if has_application_server(once=True):
        # These used to be included in "zulip-workers:*"; we may be
        # stopping an older version of Zulip, which has not applied
        # puppet to reload the new list of processes, but the
        # list_supervisor_processes below will filter them out if they
        # do not exist.
        services.append("zulip_deliver_scheduled_emails")
        services.append("zulip_deliver_scheduled_messages")

services = list_supervisor_processes(services, only_running=True)
if services:
    subprocess.check_call(["supervisorctl", "stop", *services])

print()
print(OKGREEN + "Zulip stopped successfully!" + ENDC)

using_sso = subprocess.check_output(["./scripts/get-django-setting", "USING_APACHE_SSO"])
if using_sso.strip() == b"True":
    print()
    print(WARNING + "Apache2 needs to be shut down; as root, run:" + ENDC)
    print("    service apache2 stop")
    print()
```

--------------------------------------------------------------------------------

---[FILE: upgrade-zulip]---
Location: zulip-main/scripts/upgrade-zulip

```text
#!/usr/bin/env bash
#
# This is a thin wrapper around the upgrade script (scripts/lib/upgrade-zulip).
# This wrapper exists to log output to /var/log/zulip/upgrade.log for debugging.

set -e

if [ "$EUID" -ne 0 ]; then
    basename=$(basename "$0")
    echo "Error: $basename must be run as root." >&2
    exit 1
fi

"$(dirname "$0")/lib/upgrade-zulip" "$@" 2>&1 | tee -a /var/log/zulip/upgrade.log
failed=${PIPESTATUS[0]}

if [ "$failed" -ne 0 ]; then
    echo -e '\033[0;31m'
    echo "Zulip upgrade failed (exit code $failed)!"
    echo
    echo -n "The upgrade process is designed to be idempotent, so you can retry "
    echo -n "after resolving whatever issue caused the failure (there should be a traceback above). "
    echo -n "A log of this installation is available in /var/log/zulip/upgrade.log"
    echo -e '\033[0m'
    exit "$failed"
fi
```

--------------------------------------------------------------------------------

---[FILE: upgrade-zulip-from-git]---
Location: zulip-main/scripts/upgrade-zulip-from-git

```text
#!/usr/bin/env bash
#
# This is a thin wrapper around the upgrade-from-git script (scripts/lib/upgrade-zulip-from-git).
# This wrapper exists to log output to /var/log/zulip/upgrade.log for debugging.

set -e

if [ "$EUID" -ne 0 ]; then
    basename=$(basename "$0")
    echo "Error: $basename must be run as root." >&2
    exit 1
fi

"$(dirname "$0")/lib/upgrade-zulip-from-git" "$@" 2>&1 | tee -a /var/log/zulip/upgrade.log
failed=${PIPESTATUS[0]}

if [ "$failed" -ne 0 ]; then
    echo -e '\033[0;31m'
    echo "Zulip upgrade failed (exit code $failed)!"
    echo
    echo -n "The upgrade process is designed to be idempotent, so you can retry "
    echo -n "after resolving whatever issue caused the failure (there should be a traceback above). "
    echo -n "A log of this installation is available in /var/log/zulip/upgrade.log"
    echo -e '\033[0m'
    exit "$failed"
fi
```

--------------------------------------------------------------------------------

---[FILE: zulip-puppet-apply]---
Location: zulip-main/scripts/zulip-puppet-apply

```text
#!/usr/bin/env python3
import argparse
import configparser
import os
import re
import subprocess
import sys
import tempfile

import yaml

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

from scripts.lib.puppet_cache import setup_puppet_modules
from scripts.lib.zulip_tools import assert_running_as_root, parse_os_release

assert_running_as_root()

parser = argparse.ArgumentParser(description="Run Puppet")
parser.add_argument(
    "--force", "-f", action="store_true", help="Do not prompt with proposed changes"
)
parser.add_argument("--noop", action="store_true", help="Do not apply the changes")
parser.add_argument("--config", default="/etc/zulip/zulip.conf", help="Alternate zulip.conf path")
args, extra_args = parser.parse_known_args()

config = configparser.RawConfigParser()
config.read(args.config)

setup_puppet_modules()

distro_info = parse_os_release()
puppet_config = """
Exec { path => "/usr/sbin:/usr/bin:/sbin:/bin" }
"""

for pclass in re.split(r"\s*,\s*", config.get("machine", "puppet_classes")):
    if " " in pclass:
        print(
            f"The `machine.puppet_classes` setting in {args.config} must be comma-separated, not space-separated!"
        )
        sys.exit(1)
    puppet_config += f"include {pclass}\n"

# We use the Puppet configuration from the same Zulip checkout as this script
scripts_path = os.path.join(BASE_DIR, "scripts")
puppet_module_path = os.path.join(BASE_DIR, "puppet")
puppet_cmd = [
    "puppet",
    "apply",
    f"--modulepath={puppet_module_path}:/srv/zulip-puppet-cache/current",
    "-e",
    puppet_config,
]
if args.noop:
    puppet_cmd += ["--noop"]
puppet_cmd += extra_args

# Set the scripts path to be a factor so it can be used by Puppet code
puppet_env = os.environ.copy()
puppet_env["FACTER_zulip_conf_path"] = args.config
puppet_env["FACTER_zulip_scripts_path"] = scripts_path


def noop_would_change(puppet_cmd: list[str]) -> bool:
    # --noop does not work with --detailed-exitcodes; see
    # https://tickets.puppetlabs.com/browse/PUP-686
    with tempfile.NamedTemporaryFile() as lastrun_file:
        try:
            subprocess.check_call(
                # puppet_cmd may already contain --noop, but it is safe to
                # supply twice
                [*puppet_cmd, "--noop", "--lastrunfile", lastrun_file.name],
                env=puppet_env,
            )
        except subprocess.CalledProcessError:
            sys.exit(2)

        # Reopen the file since Puppet rewrote it with a new inode
        with open(lastrun_file.name) as lastrun:
            lastrun_data = yaml.safe_load(lastrun)
            resources = lastrun_data.get("resources", {})
            if resources.get("failed", 0) != 0:
                sys.exit(2)
            return resources.get("out_of_sync", 0) != 0


if not args.noop and not args.force:
    if not noop_would_change([*puppet_cmd, "--show_diff"]):
        sys.exit(0)

    do_apply = None
    while do_apply != "y":
        sys.stdout.write("Apply changes? [y/N] ")
        sys.stdout.flush()
        do_apply = sys.stdin.readline().strip().lower()
        if do_apply in ("", "n"):
            sys.exit(0)

if args.noop and args.force:
    if noop_would_change(puppet_cmd):
        sys.exit(1)
    else:
        sys.exit(0)

ret = subprocess.call([*puppet_cmd, "--detailed-exitcodes"], env=puppet_env)
# ret = 0 => no changes, no errors
# ret = 2 => changes, no errors
# ret = 4 => no changes, yes errors
# ret = 6 => changes, yes errors
if ret not in (0, 2):
    sys.exit(2)
```

--------------------------------------------------------------------------------

---[FILE: build-groonga]---
Location: zulip-main/scripts/lib/build-groonga

```text
#!/usr/bin/env bash
set -euxo pipefail

version="13.0.5"
sha256=f49c4b2bd24f60a3237495dda241017c42076f4d2012bc523fcfa4f349f069a0

tmpdir="$(mktemp -d)"
trap 'rm -r "$tmpdir"' EXIT
cd "$tmpdir"
tarball="groonga-$version.tar.gz"
curl -fLO --retry 3 "https://github.com/groonga/groonga/releases/download/v$version/$tarball"
sha256sum -c <<<"$sha256 $tarball"
tar -xzf "$tarball"
cd "groonga-$version"

./configure --prefix=/usr
make -j "$(nproc)"
make install
```

--------------------------------------------------------------------------------

---[FILE: build-pgroonga]---
Location: zulip-main/scripts/lib/build-pgroonga

```text
#!/usr/bin/env bash
set -euxo pipefail

version="4.0.1"
sha256=e2dfe40f3a0342e9ce4f1212043c46564fda3678e8cfda8587bbc37b103ebd17

tmpdir="$(mktemp -d)"
trap 'rm -r "$tmpdir"' EXIT
cd "$tmpdir"
tarball="pgroonga-$version.tar.gz"
curl -fLO --retry 3 "https://github.com/pgroonga/pgroonga/releases/download/$version/$tarball"
sha256sum -c <<<"$sha256 $tarball"
tar -xzf "$tarball"
cd "pgroonga-$version"

if pkg-config msgpack-c; then
    msgpack='msgpack-c'
elif pkg-config msgpack; then
    msgpack='msgpack'
else
    echo 'build-pgroonga: Cannot find msgpack'
    exit 1
fi

make -j "$(nproc)" HAVE_MSGPACK=1 MSGPACK_PACKAGE_NAME="$msgpack"
make install
```

--------------------------------------------------------------------------------

---[FILE: check-database-compatibility]---
Location: zulip-main/scripts/lib/check-database-compatibility

```text
#!/usr/bin/env python3
import logging
import os
import subprocess
import sys

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, ZULIP_PATH)

from scripts.lib.setup_path import setup_path
from scripts.lib.zulip_tools import (
    DEPLOYMENTS_DIR,
    assert_not_running_as_root,
    get_config,
    get_config_file,
    parse_version_from,
)
from version import ZULIP_VERSION as NEW_VERSION

assert_not_running_as_root()
setup_path()
os.environ["DJANGO_SETTINGS_MODULE"] = "zproject.settings"

import django
from django.db import connection
from django.db.migrations.loader import MigrationLoader

from zerver.lib.migration_status import STALE_MIGRATIONS

django.setup()

django_pg_version = connection.cursor().connection.server_version // 10000
if os.path.exists("/etc/init.d/postgresql") and os.path.exists("/etc/zulip/zulip.conf"):
    postgresql_version = int(get_config(get_config_file(), "postgresql", "version", "0"))
    if postgresql_version == 0:
        postgresql_version = django_pg_version
        subprocess.check_call(
            [
                "crudini",
                "--set",
                "/etc/zulip/zulip.conf",
                "postgresql",
                "version",
                str(postgresql_version),
            ]
        )
    elif postgresql_version != django_pg_version:
        logging.critical(
            "PostgreSQL version mismatch: %d (running) vs %d (configured)",
            django_pg_version,
            postgresql_version,
        )
        logging.info(
            "/etc/zulip/zulip.conf claims that Zulip is running PostgreSQL\n"
            "%d, but the server is connected to a PostgreSQL running\n"
            "version %d.  Check the output from pg_lsclusters to verify\n"
            "which clusters are running, and update /etc/zulip/zulip.conf to match.\n"
            "\n"
            "In general, this results from manually upgrading PostgreSQL; you\n"
            "should follow our instructions for using our tool to do so:\n"
            "https://zulip.readthedocs.io/en/stable/production/upgrade.html#upgrading-postgresql",
            postgresql_version,
            django_pg_version,
        )
        sys.exit(1)

if django_pg_version < 14:
    logging.critical("Unsupported PostgreSQL version: %d", postgresql_version)
    logging.info(
        "Please upgrade to PostgreSQL 14 or newer first.\n"
        "See https://zulip.readthedocs.io/en/stable/production/"
        "upgrade.html#upgrading-postgresql"
    )
    sys.exit(1)

loader = MigrationLoader(connection)
missing = set(loader.applied_migrations)

missing.difference_update(STALE_MIGRATIONS)

for key, migration in loader.disk_migrations.items():
    missing.discard(key)
    missing.difference_update(migration.replaces)
if not missing:
    sys.exit(0)

print("Migrations which are currently applied, but missing in the new version:")
for app, migration_name in sorted(missing):
    print(f"  {app} - {migration_name}")

current_version = parse_version_from(os.path.join(DEPLOYMENTS_DIR, "current"))
logging.error(
    "This is not an upgrade -- the current deployment (version %s) "
    "contains %s database migrations which %s (version %s) does not.",
    current_version,
    len(missing),
    ZULIP_PATH,
    NEW_VERSION,
)
sys.exit(1)
```

--------------------------------------------------------------------------------

---[FILE: check_rabbitmq_queue.py]---
Location: zulip-main/scripts/lib/check_rabbitmq_queue.py
Signals: Django

```python
import json
import os
import re
import subprocess
import sys
import time
from collections import defaultdict
from typing import Any

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

sys.path.append(ZULIP_PATH)
from scripts.lib.zulip_tools import atomic_nagios_write, get_config, get_config_file

normal_queues = [
    "deferred_work",
    "deferred_email_senders",
    "digest_emails",
    "email_mirror",
    "email_senders",
    "embed_links",
    "embedded_bots",
    "missedmessage_emails",
    "missedmessage_mobile_notifications",
    "outgoing_webhooks",
    "thumbnail",
    "user_activity",
    "user_activity_interval",
]

mobile_notification_shards = int(
    get_config(get_config_file(), "application_server", "mobile_notification_shards", "1")
)
user_activity_shards = int(
    get_config(get_config_file(), "application_server", "user_activity_shards", "1")
)

OK = 0
WARNING = 1
CRITICAL = 2
UNKNOWN = 3

states = {
    0: "OK",
    1: "WARNING",
    2: "CRITICAL",
    3: "UNKNOWN",
}

MAX_SECONDS_TO_CLEAR: defaultdict[str, int] = defaultdict(
    lambda: 30,
    deferred_work=600,
    digest_emails=1200,
    missedmessage_mobile_notifications=120,
    embed_links=60,
    email_senders=90,
    deferred_email_senders=3600,
)
CRITICAL_SECONDS_TO_CLEAR: defaultdict[str, int] = defaultdict(
    lambda: 60,
    deferred_work=900,
    missedmessage_mobile_notifications=180,
    digest_emails=1800,
    embed_links=90,
    email_senders=300,
    deferred_email_senders=4500,
)


def analyze_queue_stats(
    queue_name: str, stats: dict[str, Any], queue_count_rabbitmqctl: int
) -> dict[str, Any]:
    now = int(time.time())
    if stats == {}:
        return dict(status=UNKNOWN, name=queue_name, message="invalid or no stats data")

    if now - stats["update_time"] > 180 and queue_count_rabbitmqctl > 10:
        # Queue isn't updating the stats file and has some events in
        # the backlog, it's likely stuck.
        #
        # TODO: There's an unlikely race condition here - if the queue
        # was fully emptied and was idle due to no new events coming
        # for over 180 seconds, suddenly gets a burst of events and
        # this code runs exactly in the very small time window between
        # those events popping up and the queue beginning to process
        # the first one (which will refresh the stats file at the very
        # start), we'll incorrectly return the CRITICAL status. The
        # chance of that happening should be negligible because the queue
        # worker should wake up immediately and log statistics before
        # starting to process the first event.
        return dict(
            status=CRITICAL,
            name=queue_name,
            message="queue appears to be stuck, last update {}, queue size {}".format(
                stats["update_time"], queue_count_rabbitmqctl
            ),
        )

    current_size = queue_count_rabbitmqctl
    average_consume_time = stats["recent_average_consume_time"]
    if average_consume_time is None:
        # Queue just started; we can't effectively estimate anything.
        #
        # If the queue is stuck in this state and not processing
        # anything, eventually the `update_time` rule above will fire.
        return dict(status=OK, name=queue_name, message="")

    expected_time_to_clear_backlog = current_size * average_consume_time
    if expected_time_to_clear_backlog > MAX_SECONDS_TO_CLEAR[queue_name]:
        if expected_time_to_clear_backlog > CRITICAL_SECONDS_TO_CLEAR[queue_name]:
            status = CRITICAL
        else:
            status = WARNING

        return dict(
            status=status,
            name=queue_name,
            message=f"clearing the backlog will take too long: {expected_time_to_clear_backlog}s, size: {current_size}",
        )

    return dict(status=OK, name=queue_name, message="")


WARN_COUNT_THRESHOLD_DEFAULT = 10
CRITICAL_COUNT_THRESHOLD_DEFAULT = 50


def check_other_queues(queue_counts_dict: dict[str, int]) -> list[dict[str, Any]]:
    """Do a simple queue size check for queues whose workers don't publish stats files."""

    results = []
    for queue, count in queue_counts_dict.items():
        if queue in normal_queues:
            continue

        if count > CRITICAL_COUNT_THRESHOLD_DEFAULT:
            results.append(dict(status=CRITICAL, name=queue, message=f"count critical: {count}"))
        elif count > WARN_COUNT_THRESHOLD_DEFAULT:
            results.append(dict(status=WARNING, name=queue, message=f"count warning: {count}"))
        else:
            results.append(dict(status=OK, name=queue, message=""))

    return results


def check_rabbitmq_queues() -> None:
    pattern = re.compile(r"(\w+)\t(\d+)\t(\d+)")
    if "USER" in os.environ and os.environ["USER"] not in ["root", "rabbitmq"]:
        print("This script must be run as the root or rabbitmq user")

    list_queues_output = subprocess.check_output(
        ["/usr/sbin/rabbitmqctl", "list_queues", "name", "messages", "consumers"],
        text=True,
    )
    queue_counts_rabbitmqctl = {}
    queues_with_consumers = []
    for line in list_queues_output.split("\n"):
        line = line.strip()
        m = pattern.match(line)
        if m:
            queue = m.group(1)
            count = int(m.group(2))
            consumers = int(m.group(3))
            queue_counts_rabbitmqctl[queue] = count
            if consumers > 0 and not queue.startswith("notify_tornado"):
                queues_with_consumers.append(queue)

    queue_stats_dir = subprocess.check_output(
        [os.path.join(ZULIP_PATH, "scripts/get-django-setting"), "QUEUE_STATS_DIR"],
        text=True,
    ).strip()
    queue_stats: dict[str, dict[str, Any]] = {}

    check_queues = normal_queues
    if mobile_notification_shards > 1:
        # For sharded queue workers, where there's a separate queue
        # for each shard, we need to make sure none of those are
        # backlogged.
        check_queues += [
            f"missedmessage_mobile_notifications_shard{d}"
            for d in range(1, mobile_notification_shards + 1)
        ]
    if user_activity_shards > 1:
        check_queues += [f"user_activity_shard{d}" for d in range(1, user_activity_shards + 1)]

    queues_to_check = set(check_queues).intersection(set(queues_with_consumers))
    for queue in queues_to_check:
        fn = queue + ".stats"
        file_path = os.path.join(queue_stats_dir, fn)
        if not os.path.exists(file_path):
            queue_stats[queue] = {}
            continue

        with open(file_path) as f:
            try:
                queue_stats[queue] = json.load(f)
            except json.decoder.JSONDecodeError:
                queue_stats[queue] = {}

    results = []
    for queue_name, stats in queue_stats.items():
        results.append(analyze_queue_stats(queue_name, stats, queue_counts_rabbitmqctl[queue_name]))

    results.extend(check_other_queues(queue_counts_rabbitmqctl))

    status = max(result["status"] for result in results)

    if status > 0:
        queue_error_template = "queue {} problem: {}:{}"
        error_message = "; ".join(
            queue_error_template.format(result["name"], states[result["status"]], result["message"])
            for result in results
            if result["status"] > 0
        )
        sys.exit(
            atomic_nagios_write(
                "check-rabbitmq-results",
                "critical" if status == CRITICAL else "warning",
                error_message,
            )
        )
    else:
        atomic_nagios_write("check-rabbitmq-results", "ok", "queues normal")
```

--------------------------------------------------------------------------------

---[FILE: clean_emoji_cache.py]---
Location: zulip-main/scripts/lib/clean_emoji_cache.py

```python
#!/usr/bin/env python3
import argparse
import os
import sys

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(ZULIP_PATH)
from scripts.lib.zulip_tools import (
    get_environment,
    get_recent_deployments,
    parse_cache_script_args,
    purge_unused_caches,
)

ENV = get_environment()
EMOJI_CACHE_PATH = "/srv/zulip-emoji-cache"


def get_caches_in_use(threshold_days: int) -> set[str]:
    setups_to_check = {ZULIP_PATH}
    caches_in_use = set()

    if ENV == "prod":
        setups_to_check |= get_recent_deployments(threshold_days)
    if ENV == "dev":
        CACHE_SYMLINK = os.path.join(ZULIP_PATH, "static", "generated", "emoji")
        CURRENT_CACHE = os.path.dirname(os.path.realpath(CACHE_SYMLINK))
        caches_in_use.add(CURRENT_CACHE)

    for setup_dir in setups_to_check:
        emoji_link_path = os.path.join(setup_dir, "static/generated/emoji")
        if not os.path.islink(emoji_link_path):
            # This happens for a deployment directory extracted from a
            # tarball, which just has a copy of the emoji data, not a symlink.
            continue
        # The actual cache path doesn't include the /emoji
        caches_in_use.add(os.path.dirname(os.readlink(emoji_link_path)))
    return caches_in_use


def main(args: argparse.Namespace) -> None:
    caches_in_use = get_caches_in_use(args.threshold_days)
    purge_unused_caches(EMOJI_CACHE_PATH, caches_in_use, "emoji cache", args)


if __name__ == "__main__":
    args = parse_cache_script_args("This script cleans unused Zulip emoji caches.")
    main(args)
```

--------------------------------------------------------------------------------

---[FILE: clean_unused_caches.py]---
Location: zulip-main/scripts/lib/clean_unused_caches.py

```python
#!/usr/bin/env python3
import argparse
import os
import shutil
import sys

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(ZULIP_PATH)
from scripts.lib import clean_emoji_cache
from scripts.lib.zulip_tools import parse_cache_script_args


def main(args: argparse.Namespace) -> None:
    os.chdir(ZULIP_PATH)
    shutil.rmtree("/srv/zulip-venv-cache", ignore_errors=True)  # Replaced as of 10.0
    shutil.rmtree("/srv/zulip-npm-cache", ignore_errors=True)  # Replaced as of 7.0
    clean_emoji_cache.main(args)


if __name__ == "__main__":
    args = parse_cache_script_args("This script cleans unused Zulip caches.")
    main(args)
```

--------------------------------------------------------------------------------

---[FILE: create-production-venv]---
Location: zulip-main/scripts/lib/create-production-venv

```text
#!/usr/bin/env python3
import argparse
import os
import sys

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ZULIP_PATH not in sys.path:
    sys.path.append(ZULIP_PATH)

from scripts.lib.setup_venv import get_venv_dependencies
from scripts.lib.zulip_tools import os_families, parse_os_release, run

parser = argparse.ArgumentParser(description="Create a production virtualenv with caching")
parser.add_argument("deploy_path")
args = parser.parse_args()

# install dependencies for setting up the virtualenv
distro_info = parse_os_release()
vendor = distro_info["ID"]
os_version = distro_info["VERSION_ID"]
VENV_DEPENDENCIES = get_venv_dependencies(vendor, os_version)
if "debian" in os_families():
    run(["apt-get", "-y", "install", "--no-install-recommends", *VENV_DEPENDENCIES])
elif "fedora" in os_families():
    run(["yum", "-y", "install", *VENV_DEPENDENCIES])
else:
    print("Unsupported platform: {}".format(distro_info["ID"]))
    sys.exit(1)

os.chdir(ZULIP_PATH)
run(["scripts/lib/install-uv"])
run(
    ["uv", "sync", "--frozen", "--only-group=prod"],
    env={k: v for k, v in os.environ.items() if k not in {"PYTHONDEVMODE", "PYTHONWARNINGS"}},
)
```

--------------------------------------------------------------------------------

````
