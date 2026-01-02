---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 449
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 449 of 1290)

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

---[FILE: setup-apt-repo]---
Location: zulip-main/scripts/lib/setup-apt-repo

```text
#!/usr/bin/env bash
#
# This script handles adding custom apt repositories into
# /etc/apt/sources.list.d/ files.  It bundles the GPG keys which are
# used to verify the repositories (via `apt-key`), to explicitly pin
# the trusted signing keys, as opposed to blindly trusting HTTPS.
#
# Each /etc/apt/sources.list.d/foo.list file is created via `--list
# foo`, where `foo` defaults to `zulip`.  The default `zulip.list` is
# installed in `scripts/lib/install` / `tools/lib/provision.py`, and
# other `.list` files may be installed by Puppet.
set -x
set -e
set -u
set -o pipefail
shopt -s extglob

verify=false
args="$(getopt -o '' --long verify,list: -- "$@")"
eval "set -- $args"
LIST=zulip
while true; do
    case "$1" in
        --verify)
            verify=true
            shift
            ;;
        --list)
            LIST="$2"
            shift
            shift
            ;;
        --)
            shift
            break
            ;;
    esac
done

# Ensure the directory for LAST_DEPENDENCIES_HASH exists
mkdir -p /var/lib/zulip

SOURCES_FILE=/etc/apt/sources.list.d/$LIST.list
PREF_FILE=/etc/apt/preferences.d/$LIST.pref
STAMP_FILE=/etc/apt/sources.list.d/$LIST.list.apt-update-in-progress

# All paths, for purposes of hashing, should be relative to the deploy
# root.
cd "$(dirname "$0")/../.."

LIST_PATH="scripts/setup/apt-repos/$LIST"
if ! [ -d "$LIST_PATH" ]; then
    echo "Not a valid value for --list: '$LIST'"
    echo ""
    echo "Valid values are:"
    ls -1 "scripts/setup/apt-repos/"
    exit 1
fi

release="$(. /etc/os-release && printf '%s' "$VERSION_CODENAME")"

if [ ! -f "$LIST_PATH/$release.list" ]; then
    cat <<EOF
Unsupported release $release for sources.list file $LIST.  To add a
new release, make a $LIST_PATH/$release.list file based on existing
.list files in that directory.

EOF
    exit 1
fi

DEPENDENCIES_HASH="$(sha256sum "$LIST_PATH"/?(*.asc|"$release.list"|"$LIST.pref"|custom.sh) "scripts/lib/setup-apt-repo")"
DEPENDENCIES_HASH_FILE="/var/lib/zulip/setup-repositories-state-$LIST"
# Ensure that DEPENDENCIES_HASH_FILE exists before hashing it.
touch "$DEPENDENCIES_HASH_FILE"
LAST_DEPENDENCIES_HASH="$(cat "$DEPENDENCIES_HASH_FILE")"

# First, we only do anything in setup-apt-repo if any of its inputs
# (apt keys, code, etc.)  changed.
if [ "$DEPENDENCIES_HASH" = "$LAST_DEPENDENCIES_HASH" ]; then
    exit 0
elif [ "$verify" == true ]; then
    exit 1
fi

# Hash to check if the configuration is changed by the script later.
hashes=$(sha256sum "$SOURCES_FILE" "$PREF_FILE" 2>/dev/null || true)

if [ -e "$LIST_PATH/$LIST.pref" ]; then
    cp "$LIST_PATH/$LIST.pref" "$PREF_FILE"
else
    rm -f "$PREF_FILE"
fi

pre_setup_deps=(apt-transport-https ca-certificates gnupg curl)
if ! apt-get -dy install "${pre_setup_deps[@]}"; then
    apt-get update
fi
apt-get -y install "${pre_setup_deps[@]}"

cp "$LIST_PATH/"*.asc /etc/apt/keyrings/
cp "$LIST_PATH/$release.list" "$SOURCES_FILE"

if [ -e "$LIST_PATH/custom.sh" ]; then
    export LIST_PATH
    export STAMP_FILE
    bash "$LIST_PATH/custom.sh"
fi

if [ "$hashes" = "$(sha256sum "$SOURCES_FILE" "$PREF_FILE" 2>/dev/null || true)" ] && ! [ -e "$STAMP_FILE" ]; then
    echo "APT configuration did not change; skipping apt-get update"
else
    # We create this stamp file to ensure `apt-get update` will be run
    # the next time this script is invoked, and each time after, until
    # `apt-get update` finishes successfully.
    touch "$STAMP_FILE"
    apt-get update && rm -f "$STAMP_FILE"
fi

echo "$DEPENDENCIES_HASH" >"$DEPENDENCIES_HASH_FILE"
```

--------------------------------------------------------------------------------

---[FILE: setup-yum-repo]---
Location: zulip-main/scripts/lib/setup-yum-repo

```text
#!/usr/bin/env bash
set -x
set -e

is_prod=false
args="$(getopt -o '' --long prod -- "$@")"
eval "set -- $args"
while true; do
    case "$1" in
        --prod)
            is_prod=true
            shift
            ;;
        --)
            shift
            break
            ;;
    esac
done

is_centos=false
is_rhel=false
if [ -e /etc/centos-release ]; then
    is_centos=true
    yum install -y epel-release

    if [ "$is_prod" = true ]; then
        # IUS is needed for installing python36u-mod_wsgi on prod env
        yum localinstall -y https://centos7.iuscommunity.org/ius-release.rpm
    fi

elif grep -q "Red Hat" /etc/redhat-release; then
    is_rhel=true
    yum localinstall -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
fi

yum update -y

# "Development Tools" is the equivalent of build-essential
yum groupinstall -y "Development Tools"

RHVER="$(rpm -qf --queryformat="%{VERSION}" /etc/redhat-release)"
RHARCH="$(rpm -qf --queryformat="%{ARCH}" /etc/redhat-release)"
PGVER=10
if [ "$is_centos" = true ]; then
    # PostgreSQL $PGVER
    yum localinstall -y "https://yum.postgresql.org/$PGVER/redhat/rhel-$RHVER-$RHARCH/pgdg-redhat-repo-latest.noarch.rpm"

    # PGroonga
    # https://pgroonga.github.io/install/centos.html
    yum localinstall -y https://packages.groonga.org/centos/groonga-release-latest.noarch.rpm
elif [ "$is_rhel" = true ]; then
    yum localinstall -y https://download.postgresql.org/pub/repos/yum/10/redhat/rhel-latest-x86_64/pgdg-redhat10-10-2.noarch.rpm
    yum localinstall -y https://packages.groonga.org/centos/groonga-release-latest.noarch.rpm
else
    # TODO make the postgres version a variable.
    PGVER=13
    dnf install -y "https://download.postgresql.org/pub/repos/yum/reporpms/F-$RHVER-x86_64/pgdg-fedora-repo-latest.noarch.rpm"
fi
```

--------------------------------------------------------------------------------

---[FILE: setup_path.py]---
Location: zulip-main/scripts/lib/setup_path.py

```python
"""
Use libraries from a virtualenv (by modifying sys.path) in production.
"""

import os
import sys


def setup_path() -> None:
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    venv = os.path.realpath(os.path.join(BASE_DIR, ".venv"))
    if sys.prefix != venv:
        sys.path = list(
            filter(
                # zulip-py3-venv was an historical virtualenv symlink
                lambda p: "/zulip-py3-venv/" not in p and "/.venv/" not in p,
                sys.path,
            )
        )
        activate_this = os.path.join(venv, "bin", "activate_this.py")
        activate_locals = dict(__file__=activate_this)
        with open(activate_this) as f:
            exec(f.read(), activate_locals)  # noqa: S102
        # Check that the python version running this function
        # is same as python version that created the virtualenv.
        python_version = "python{}.{}".format(*sys.version_info[:2])
        if not os.path.exists(os.path.join(venv, "lib", python_version)):
            raise RuntimeError(venv + " was not set up for this Python version")
```

--------------------------------------------------------------------------------

---[FILE: setup_venv.py]---
Location: zulip-main/scripts/lib/setup_venv.py

```python
import os

from scripts.lib.zulip_tools import os_families

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

VENV_DEPENDENCIES = [
    "build-essential",
    "libffi-dev",
    "libldap2-dev",
    "python3-dev",  # Needed to install typed-ast dependency of mypy
    "python3-pip",
    "virtualenv",
    "libxml2-dev",  # Used for installing talon-core and python-xmlsec
    "libxslt1-dev",  # Used for installing talon-core
    "libpq-dev",  # Needed by psycopg2
    "libssl-dev",  # Needed to build pycurl and other libraries
    "libmagic1",  # Used for install python-magic
    "libyaml-dev",  # For fast YAML parsing in PyYAML
    # Needed by python-xmlsec:
    "libxmlsec1-dev",
    "pkg-config",
    "jq",  # No longer used in production (clean me up later)
    "libsasl2-dev",  # For building python-ldap from source
    "libvips",  # For thumbnailing
    "libvips-tools",
    "libicu-dev",  # For building pyicu
]

COMMON_YUM_VENV_DEPENDENCIES = [
    "libffi-devel",
    "openldap-devel",
    "libyaml-devel",
    # Needed by python-xmlsec:
    "gcc",
    "python3-devel",
    "libxml2-devel",
    "xmlsec1-devel",
    "xmlsec1-openssl-devel",
    "libtool-ltdl-devel",
    "libxslt-devel",
    "postgresql-libs",  # libpq-dev on apt
    "openssl-devel",
    "jq",
    "vips",  # For thumbnailing
    "vips-tools",
]

REDHAT_VENV_DEPENDENCIES = [
    *COMMON_YUM_VENV_DEPENDENCIES,
    "python36-devel",
    "python-virtualenv",
]

FEDORA_VENV_DEPENDENCIES = [
    *COMMON_YUM_VENV_DEPENDENCIES,
    "python3-pip",
    "virtualenv",  # see https://unix.stackexchange.com/questions/27877/install-virtualenv-on-fedora-16
]


def get_venv_dependencies(vendor: str, os_version: str) -> list[str]:
    if "debian" in os_families():
        return VENV_DEPENDENCIES
    elif "rhel" in os_families():
        return REDHAT_VENV_DEPENDENCIES
    elif "fedora" in os_families():
        return FEDORA_VENV_DEPENDENCIES
    else:
        raise AssertionError("Invalid vendor")
```

--------------------------------------------------------------------------------

---[FILE: sharding.py]---
Location: zulip-main/scripts/lib/sharding.py
Signals: Django

```python
#!/usr/bin/env python3
import argparse
import filecmp
import grp
import json
import os
import pwd
import subprocess
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(BASE_DIR)
from scripts.lib.setup_path import setup_path

setup_path()

from scripts.lib.zulip_tools import get_config_file, get_tornado_ports


def nginx_quote(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


# Basic system to do Tornado sharding.  Writes two output .tmp files that need
# to be renamed to the following files to finalize the changes:
# * /etc/zulip/nginx_sharding_map.conf; nginx needs to be reloaded after changing.
# * /etc/zulip/sharding.json; supervisor Django process needs to be reloaded
# after changing.  TODO: We can probably make this live-reload by statting the file.
#
# TODO: Restructure this to automatically generate a sharding layout.
def write_updated_configs() -> None:
    config_file = get_config_file()
    ports = get_tornado_ports(config_file)

    expected_ports = list(range(9800, ports[-1] + 1))
    assert ports == expected_ports, f"ports ({ports}) must be contiguous, starting with 9800"

    with (
        open("/etc/zulip/nginx_sharding_map.conf.tmp", "w") as nginx_sharding_conf_f,
        open("/etc/zulip/sharding.json.tmp", "w") as sharding_json_f,
    ):
        if len(ports) == 1:
            nginx_sharding_conf_f.write('map "" $tornado_server {\n')
            nginx_sharding_conf_f.write("    default http://tornado;\n")
            nginx_sharding_conf_f.write("}\n")
            sharding_json_f.write("{}\n")
            return

        nginx_sharding_conf_f.write("map $host $tornado_server {\n")
        nginx_sharding_conf_f.write("    default http://tornado9800;\n")
        shard_map: dict[str, int | list[int]] = {}
        shard_regexes: list[tuple[str, int | list[int]]] = []
        external_host = subprocess.check_output(
            [os.path.join(BASE_DIR, "scripts/get-django-setting"), "EXTERNAL_HOST"],
            text=True,
        ).strip()
        for key, shards in config_file["tornado_sharding"].items():
            if key.endswith("_regex"):
                ports = [int(port) for port in key.removesuffix("_regex").split("_")]
                shard_regexes.append((shards, ports[0] if len(ports) == 1 else ports))
                nginx_sharding_conf_f.write(
                    f"    {nginx_quote('~*' + shards)} http://tornado{'_'.join(map(str, ports))};\n"
                )
            else:
                ports = [int(port) for port in key.split("_")]
                for shard in shards.split():
                    if "." in shard:
                        host = shard
                    else:
                        host = f"{shard}.{external_host}"
                    assert host not in shard_map, f"host {host} duplicated"
                    shard_map[host] = ports[0] if len(ports) == 1 else ports
                    nginx_sharding_conf_f.write(
                        f"    {nginx_quote(host)} http://tornado{'_'.join(map(str, ports))};\n"
                    )
            nginx_sharding_conf_f.write("\n")
        nginx_sharding_conf_f.write("}\n")

        data = {"shard_map": shard_map, "shard_regexes": shard_regexes}
        sharding_json_f.write(json.dumps(data) + "\n")

        for fh in (nginx_sharding_conf_f, sharding_json_f):
            os.fchown(
                fh.fileno(),
                pwd.getpwnam("zulip").pw_uid,
                grp.getgrnam("zulip").gr_gid,
            )
            os.fchmod(fh.fileno(), 0o644)


parser = argparse.ArgumentParser(
    description="Adjust Tornado sharding configuration",
)
parser.add_argument(
    "--errors-ok",
    action="store_true",
    help="Exits 1 if there are no changes; if there are errors or changes, exits 0.",
)
options = parser.parse_args()

config_file_path = "/etc/zulip"
base_files = ["nginx_sharding_map.conf", "sharding.json"]
full_real_paths = [f"{config_file_path}/{filename}" for filename in base_files]
full_new_paths = [f"{filename}.tmp" for filename in full_real_paths]
try:
    write_updated_configs()
    for old, new in zip(full_real_paths, full_new_paths, strict=False):
        if not filecmp.cmp(old, new):
            # There are changes; leave .tmp files and exit 0
            if "SUPPRESS_SHARDING_NOTICE" not in os.environ:
                print("===> Updated sharding; run scripts/refresh-sharding-and-restart")
            sys.exit(0)
    # No changes; clean up and exit 1
    for filename in full_new_paths:
        os.unlink(filename)
    sys.exit(1)
except AssertionError as e:
    # Clean up whichever files we made
    for filename in full_new_paths:
        if os.path.exists(filename):
            os.unlink(filename)
    if options.errors_ok:
        sys.exit(0)
    else:
        print(e, file=sys.stderr)
        sys.exit(2)
```

--------------------------------------------------------------------------------

---[FILE: supervisor.py]---
Location: zulip-main/scripts/lib/supervisor.py

```python
import socket
import time
from http.client import HTTPConnection
from xmlrpc import client

from typing_extensions import override


class UnixStreamHTTPConnection(HTTPConnection):
    @override
    def connect(self) -> None:
        self.sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        connected = False
        for i in range(2):
            try:
                self.sock.connect(self.host)
                connected = True
                break
            except FileNotFoundError:
                # Backoff and retry
                time.sleep(2**i)
        if not connected:
            raise Exception(
                "Failed to connect to supervisor -- check that it is running, by running 'service supervisor status'"
            )


class UnixStreamTransport(client.Transport):
    def __init__(self, socket_path: str) -> None:
        self.socket_path = socket_path
        super().__init__()

    @override
    def make_connection(self, host: tuple[str, dict[str, str]] | str) -> UnixStreamHTTPConnection:
        return UnixStreamHTTPConnection(self.socket_path)


def rpc() -> client.ServerProxy:
    return client.ServerProxy(
        "http://localhost", transport=UnixStreamTransport("/var/run/supervisor.sock")
    )


def list_supervisor_processes(
    filter_names: list[str] | None = None, *, only_running: bool | None = None
) -> list[str]:
    results = []
    processes = rpc().supervisor.getAllProcessInfo()
    assert isinstance(processes, list)
    for process in processes:
        if process["group"] != process["name"]:
            name = f"{process['group']}:{process['name']}"
        else:
            name = process["name"]

        if filter_names:
            match = False
            for filter_name in filter_names:
                # zulip-tornado:* matches zulip-tornado:9800 and zulip-tornado
                if filter_name.endswith(":*") and (
                    name.startswith(filter_name.removesuffix("*"))
                    or name == filter_name.removesuffix(":*")
                ):
                    match = True
                    break
                if name == filter_name:
                    match = True
                    break
            if not match:
                continue

        if only_running is None:
            results.append(name)
        elif only_running == (process["statename"] in ("RUNNING", "STARTING")):
            results.append(name)

    return results
```

--------------------------------------------------------------------------------

---[FILE: supported-os]---
Location: zulip-main/scripts/lib/supported-os

```text
#!/usr/bin/env bash
#
# This script serves only to verify that the OS is a supported
# version, before we attempt to rely on that version in
# upgrade-zulip-stage-3

if [ -f /etc/os-release ]; then
    os_info="$(
        . /etc/os-release
        printf '%s\n' "$ID" "$VERSION_ID"
    )"
    {
        read -r os_id
        read -r os_version_id
    } <<<"$os_info"
fi

case "$os_id $os_version_id" in
    'debian 12' | 'debian 13' | 'ubuntu 22.04' | 'ubuntu 24.04')
        exit 0
        ;;
    *)
        exit 1
        ;;
esac
```

--------------------------------------------------------------------------------

---[FILE: unpack-zulip]---
Location: zulip-main/scripts/lib/unpack-zulip

```text
#!/usr/bin/env python3
import glob
import os
import shutil
import subprocess
import sys
import tempfile

os.environ["PYTHONUNBUFFERED"] = "y"

sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))
import version
from scripts.lib.zulip_tools import (
    DEPLOYMENTS_DIR,
    ENDC,
    FAIL,
    get_deployment_version,
    is_invalid_upgrade,
    make_deploy_path,
    overwrite_symlink,
)

if len(sys.argv) != 2:
    print(FAIL + f"Usage: {sys.argv[0]} <tarball>" + ENDC)
    sys.exit(1)

tarball_path = sys.argv[1]

deploy_path = make_deploy_path()

extract_path = tempfile.mkdtemp()
subprocess.check_call(["tar", "-xf", tarball_path, "-C", extract_path])

new_version = get_deployment_version(extract_path)
current_version = version.ZULIP_VERSION
if is_invalid_upgrade(current_version, new_version):
    print(
        FAIL + "Your current version is very old. Please first upgrade to version "
        f"1.4.3 and then upgrade to {new_version}." + ENDC
    )
    shutil.rmtree(extract_path)
    sys.exit(1)

shutil.move(glob.glob(os.path.join(extract_path, "zulip-server-*"))[0], deploy_path)
os.rmdir(extract_path)
overwrite_symlink("/etc/zulip/settings.py", os.path.join(deploy_path, "zproject/prod_settings.py"))
overwrite_symlink(deploy_path, os.path.join(DEPLOYMENTS_DIR, "next"))

print(deploy_path)
sys.exit(0)
```

--------------------------------------------------------------------------------

---[FILE: update-git-upstream]---
Location: zulip-main/scripts/lib/update-git-upstream

```text
#!/usr/bin/env bash
set -eu

upstream_url="https://github.com/zulip/zulip.git"
if ! git remote | grep -qx upstream; then
    git remote add upstream "$upstream_url"
else
    git remote set-url upstream "$upstream_url"
fi

git fetch --prune --quiet --tags --all
```

--------------------------------------------------------------------------------

---[FILE: upgrade-zulip]---
Location: zulip-main/scripts/lib/upgrade-zulip

```text
#!/usr/bin/env python3
import argparse
import configparser
import logging
import os
import shutil
import subprocess
import sys
import time

TARBALL_ARCHIVE_PATH = "/home/zulip/archives"
os.environ["PYTHONUNBUFFERED"] = "y"

sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))
from scripts.lib.zulip_tools import (
    DEPLOYMENTS_DIR,
    assert_running_as_root,
    get_config_file,
    get_deploy_options,
    get_deployment_lock,
    release_deployment_lock,
    su_to_zulip,
)

config_file: configparser.RawConfigParser = get_config_file()
deploy_options = get_deploy_options(config_file)

assert_running_as_root(strip_lib_from_paths=True)

# make sure we have appropriate file permissions
os.umask(0o22)

logging.Formatter.converter = time.gmtime
logging.basicConfig(format="%(asctime)s upgrade-zulip: %(message)s", level=logging.INFO)

parser = argparse.ArgumentParser()
parser.add_argument("tarball", help="Path to Zulip Server tarball")
args, extra_options = parser.parse_known_args()

error_rerun_script = f"{DEPLOYMENTS_DIR}/current/scripts/upgrade-zulip {args.tarball}"
get_deployment_lock(error_rerun_script)

try:
    # Copy the release tarball to an archival path that's readable by
    # the Zulip user, and then unpack it from that directory, so that
    # we can unpack using the Zulip user even if the original path was
    # not readable by the Zulip user.
    logging.info("Archiving the tarball under %s", TARBALL_ARCHIVE_PATH)
    os.makedirs(TARBALL_ARCHIVE_PATH, exist_ok=True)
    archived_tarball_path = os.path.join(TARBALL_ARCHIVE_PATH, os.path.basename(args.tarball))
    shutil.copy(args.tarball, archived_tarball_path)
    subprocess.check_output(["chown", "-R", "zulip:zulip", TARBALL_ARCHIVE_PATH])

    logging.info("Unpacking the tarball")
    unpack_zulip = os.path.realpath(os.path.join(os.path.dirname(__file__), "unpack-zulip"))
    deploy_path = subprocess.check_output(
        [unpack_zulip, archived_tarball_path], preexec_fn=su_to_zulip, text=True
    )

    # chdir to deploy_path and then run upgrade-zulip-stage-2 from the
    # new version of Zulip (having the upgrade logic run from the new
    # version is much better for fixing bugs in the upgrade process).
    deploy_path = deploy_path.strip()
    os.chdir(deploy_path)
    try:
        subprocess.check_call(
            [
                os.path.abspath("./scripts/lib/upgrade-zulip-stage-2"),
                deploy_path,
                *deploy_options,
                *extra_options,
            ]
        )
    except subprocess.CalledProcessError:
        # There's no use in showing a stacktrace here; it just hides
        # the error from stage 2.
        sys.exit(1)
finally:
    release_deployment_lock()
```

--------------------------------------------------------------------------------

---[FILE: upgrade-zulip-from-git]---
Location: zulip-main/scripts/lib/upgrade-zulip-from-git

```text
#!/usr/bin/env python3
import argparse
import logging
import os
import subprocess
import sys
import time

LOCAL_GIT_CACHE_DIR = "/srv/zulip.git"
os.environ["PYTHONUNBUFFERED"] = "y"

sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))
from scripts.lib.zulip_tools import (
    DEPLOYMENTS_DIR,
    assert_running_as_root,
    get_config,
    get_config_file,
    get_deploy_options,
    get_deploy_root,
    get_deployment_lock,
    make_deploy_path,
    overwrite_symlink,
    release_deployment_lock,
    su_to_zulip,
)

config_file = get_config_file()
deploy_options = get_deploy_options(config_file)
remote_url = get_config(
    config_file, "deployment", "git_repo_url", "https://github.com/zulip/zulip.git"
)

assert_running_as_root(strip_lib_from_paths=True)

# make sure we have appropriate file permissions
os.umask(0o22)

logging.Formatter.converter = time.gmtime
logging.basicConfig(format="%(asctime)s upgrade-zulip-from-git: %(message)s", level=logging.INFO)

parser = argparse.ArgumentParser()
parser.add_argument("refname", help="Git reference, e.g. a branch, tag, or commit ID.")
git_ref = parser.add_mutually_exclusive_group()
git_ref.add_argument(
    "--remote-url", help="Override the Git remote URL configured in /etc/zulip/zulip.conf."
)
git_ref.add_argument(
    "--local-ref",
    action="store_true",
    help="Provided branch name has been pushed directly to /srv/zulip.git already",
)
args, extra_options = parser.parse_known_args()

refname = args.refname
# Command line remote URL will be given preference above the one
# in /etc/zulip/zulip.conf.
if args.remote_url:
    remote_url = args.remote_url

os.makedirs(DEPLOYMENTS_DIR, exist_ok=True)

error_rerun_script = f"{DEPLOYMENTS_DIR}/current/scripts/upgrade-zulip-from-git {refname}"
get_deployment_lock(error_rerun_script)

try:
    deploy_path = make_deploy_path()

    # Populate LOCAL_GIT_CACHE_DIR with both the requested remote and zulip/zulip.
    if not os.path.exists(LOCAL_GIT_CACHE_DIR):
        logging.info("Making local repository cache")
        subprocess.check_call(
            ["git", "init", "--bare", "-q", LOCAL_GIT_CACHE_DIR],
            stdout=subprocess.DEVNULL,
        )
        subprocess.check_call(
            ["git", "remote", "add", "origin", remote_url],
            cwd=LOCAL_GIT_CACHE_DIR,
        )

    if os.stat(LOCAL_GIT_CACHE_DIR).st_uid == 0:
        subprocess.check_call(["chown", "-R", "zulip:zulip", LOCAL_GIT_CACHE_DIR])

    os.chdir(LOCAL_GIT_CACHE_DIR)
    if not args.local_ref:
        subprocess.check_call(
            ["git", "remote", "set-url", "origin", remote_url], preexec_fn=su_to_zulip
        )

    fetch_spec = subprocess.check_output(
        ["git", "config", "remote.origin.fetch"],
        preexec_fn=su_to_zulip,
        text=True,
    ).strip()
    if fetch_spec in ("+refs/*:refs/*", "+refs/heads/*:refs/heads/*"):
        # The refspec impinges on refs/heads/ -- this is an old mirror
        # configuration.
        logging.info("Cleaning up mirrored repository")
        # remotes.origin.mirror may not be set -- we do not use
        # check_call to ignore errors if it's already missing
        subprocess.call(
            ["git", "config", "--unset", "remote.origin.mirror"],
            preexec_fn=su_to_zulip,
        )
        subprocess.check_call(
            ["git", "config", "remote.origin.fetch", "+refs/heads/*:refs/remotes/origin/*"],
            preexec_fn=su_to_zulip,
        )
        matching_refs = subprocess.check_output(
            ["git", "for-each-ref", "--format=%(refname)", "refs/pull/", "refs/heads/"],
            preexec_fn=su_to_zulip,
            text=True,
        ).splitlines()

        # We can't use `git worktree list --porcelain -z` here because
        # Ubuntu 22.04 only has git 2.34.1, and -z was
        # introduced in 2.36
        worktree_data = subprocess.check_output(
            ["git", "worktree", "list", "--porcelain"],
            preexec_fn=su_to_zulip,
            text=True,
        ).splitlines()
        keep_refs = set()
        for worktree_line in worktree_data:
            if worktree_line.startswith("branch "):
                keep_refs.add(worktree_line.removeprefix("branch "))

        delete_input = "".join(
            f"delete {refname}\n" for refname in matching_refs if refname not in keep_refs
        )
        subprocess.run(
            ["git", "update-ref", "--stdin"],
            check=True,
            preexec_fn=su_to_zulip,
            input=delete_input,
            text=True,
        )

        logging.info("Repacking repository after pruning unnecessary refs...")
        subprocess.check_call(
            ["git", "gc", "--prune=now"],
            preexec_fn=su_to_zulip,
        )

    if not args.local_ref:
        subprocess.check_call(
            [os.path.join(get_deploy_root(), "scripts/lib/update-git-upstream")],
            preexec_fn=su_to_zulip,
        )

    # Generate the deployment directory via git worktree from our local repository.
    try_refs = [
        f"refs/tags/{refname}",
        f"refs/heads/{refname}" if args.local_ref else f"refs/remotes/origin/{refname}",
    ]
    for ref in try_refs:
        result = subprocess.run(
            ["git", "rev-parse", "--verify", ref],
            preexec_fn=su_to_zulip,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            check=False,
        )
        if result.returncode == 0:
            fullref = ref
            commit_hash = result.stdout.strip()
            break
        elif result.returncode != 128:
            result.check_returncode()
    else:
        logging.error(
            "Failed to resolve %s as a tag or %s branch name!",
            refname,
            "local" if args.local_ref else "remote",
        )
        sys.exit(1)
    refname = fullref

    subprocess.check_call(
        ["git", "worktree", "add", "--detach", deploy_path, refname],
        stdout=subprocess.DEVNULL,
        preexec_fn=su_to_zulip,
    )
    os.chdir(deploy_path)
    extra_flags = []
    if not refname.startswith("refs/tags/"):
        extra_flags = ["-t"]
    subprocess.check_call(
        [
            "git",
            "checkout",
            "-q",
            *extra_flags,
            "-b",
            "deployment-" + os.path.basename(deploy_path),
            refname,
        ],
        preexec_fn=su_to_zulip,
    )

    overwrite_symlink("/etc/zulip/settings.py", "zproject/prod_settings.py")

    overwrite_symlink(deploy_path, os.path.join(DEPLOYMENTS_DIR, "next"))

    try:
        subprocess.check_call(
            [
                os.path.join(deploy_path, "scripts", "lib", "upgrade-zulip-stage-2"),
                deploy_path,
                "--from-git",
                *deploy_options,
                *extra_options,
            ]
        )
    except subprocess.CalledProcessError:
        # There's no use in showing a stacktrace here; it just hides
        # the error from stage 2.
        sys.exit(1)
finally:
    release_deployment_lock()
```

--------------------------------------------------------------------------------

---[FILE: upgrade-zulip-stage-2]---
Location: zulip-main/scripts/lib/upgrade-zulip-stage-2

```text
#!/usr/bin/env bash
#
# This script serves only to verify that the OS is a supported
# version, before we attempt to rely on that version in
# upgrade-zulip-stage-3

set -eu

ZULIP_PATH="$(readlink -f "$(dirname "$0")"/../..)"
if ! "$ZULIP_PATH/scripts/lib/supported-os"; then
    echo "Unsupported platform!"
    echo
    echo "Sorry! The support for your OS has been discontinued."
    echo "Please upgrade your OS to a supported release first,"
    echo "by following these instructions:"
    echo
    echo "https://zulip.readthedocs.io/en/latest/production/upgrade.html#upgrading-the-operating-system"
    echo
    exit 1
fi

exec "$ZULIP_PATH/scripts/lib/upgrade-zulip-stage-3" "$@"
```

--------------------------------------------------------------------------------

````
