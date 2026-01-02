---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 560
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 560 of 1290)

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

---[FILE: build_timezone_values]---
Location: zulip-main/tools/setup/build_timezone_values

```text
#!/usr/bin/env python3
import json
import os
import sys
import zoneinfo
from datetime import datetime, timedelta

ZULIP_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../")
sys.path.insert(0, ZULIP_PATH)

from zerver.lib.timezone import get_canonical_timezone_map

OUT_PATH = os.path.join(ZULIP_PATH, "web", "generated", "timezones.json")


def get_utc_offset(tz_name: str) -> str:
    """Get UTC offset for a timezone in the format UTC(+HH:MM)."""
    try:
        now = datetime.now(zoneinfo.ZoneInfo(tz_name))
        offset: timedelta | None = now.utcoffset()

        if offset is None:
            return "UTC(+00:00)"

        offset_seconds = offset.total_seconds()
        hours, remainder = divmod(offset_seconds, 3600)
        minutes = remainder // 60
        if minutes == 0:
            return f"UTC{int(hours):+d}"
        return f"UTC{int(hours):+d}:{int(minutes):02d}"

    except Exception as e:
        print(f"Error processing {tz_name}: {e}")
        return "UTC(?)"


timezones = sorted(
    zoneinfo.available_timezones() - {"Factory", "localtime"} - set(get_canonical_timezone_map())
)


timezone_data = [{"name": tz, "utc_offset": get_utc_offset(tz)} for tz in timezones]


with open(OUT_PATH, "w") as f:
    json.dump({"timezones": timezone_data}, f)
```

--------------------------------------------------------------------------------

---[FILE: dev-motd]---
Location: zulip-main/tools/setup/dev-motd

```text
#!/usr/bin/tail -n+2

This is the Zulip development environment.  Popular commands:
* tools/provision - Update the development environment
* tools/run-dev - Run the development server
* tools/lint - Run the linter (quick and catches many problems)
* tools/test-* - Run tests (use --help to learn about options)

Read https://zulip.readthedocs.io/en/latest/testing/testing.html to learn
how to run individual test suites so that you can get a fast debug cycle.
```

--------------------------------------------------------------------------------

---[FILE: generate-fixtures]---
Location: zulip-main/tools/setup/generate-fixtures

```text
#!/usr/bin/env bash
set -e

run() {
    PGHOST=localhost PGUSER=zulip \
        "$(dirname "$0")/../../scripts/setup/terminate-psql-sessions" zulip_test zulip_test_base zulip_test_template
    psql -v ON_ERROR_STOP=1 -h localhost postgres zulip_test <<EOF
DROP DATABASE IF EXISTS zulip_test;
CREATE DATABASE zulip_test TEMPLATE zulip_test_template;
EOF
    "$(dirname "$0")/../../scripts/setup/flush-memcached"
}

run
```

--------------------------------------------------------------------------------

---[FILE: generate-test-credentials]---
Location: zulip-main/tools/setup/generate-test-credentials

```text
#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"/../..

email=desdemona@zulip.com

mkdir -p var/puppeteer

password=$(./manage.py print_initial_password "$email" | grep -F "$email" | awk '{ print $2 }')
cat >var/puppeteer/test_credentials.json <<EOF
{"default_user": {"username": "$email", "password": "$password"}}
EOF
```

--------------------------------------------------------------------------------

---[FILE: generate_bots_integrations_static_files.py]---
Location: zulip-main/tools/setup/generate_bots_integrations_static_files.py

```python
#!/usr/bin/env python3
import glob
import os
import shutil
import sys

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ZULIP_PATH not in sys.path:
    sys.path.append(ZULIP_PATH)
from scripts.lib.setup_path import setup_path

setup_path()

import integrations
from zulip_bots.lib import get_bots_directory_path


def generate_pythonapi_integrations_static_files() -> None:
    integrations_dir = "static/generated/integrations"
    if os.path.isdir(integrations_dir):
        # delete old static files, they could be outdated
        shutil.rmtree(integrations_dir)
    os.makedirs(integrations_dir, exist_ok=True)

    package_integrations_dir = os.path.dirname(os.path.abspath(integrations.__file__))

    def copy_integrations_data(integration_names: list[str]) -> None:
        # The integration name as used in zulip/python-zulip-api.
        for name in integration_names:
            src_dir = os.path.join(package_integrations_dir, name)
            dst_dir = os.path.join(integrations_dir, name)
            doc_path = os.path.join(src_dir, "doc.md")

            if os.path.isfile(doc_path):
                os.makedirs(dst_dir, exist_ok=True)
                shutil.copyfile(doc_path, os.path.join(dst_dir, "doc.md"))

    copy_integrations_data(os.listdir(package_integrations_dir))


def generate_zulip_bots_static_files() -> None:
    bots_dir = "static/generated/bots"
    if os.path.isdir(bots_dir):
        # delete old static files, they could be outdated
        shutil.rmtree(bots_dir)

    os.makedirs(bots_dir, exist_ok=True)

    package_bots_dir = get_bots_directory_path()

    def copy_bots_data(bot_names: list[str]) -> None:
        for name in bot_names:
            src_dir = os.path.join(package_bots_dir, name)
            dst_dir = os.path.join(bots_dir, name)
            doc_path = os.path.join(src_dir, "doc.md")

            if os.path.isfile(doc_path):
                os.makedirs(dst_dir, exist_ok=True)
                shutil.copyfile(doc_path, os.path.join(dst_dir, "doc.md"))

                logo_pattern = os.path.join(src_dir, "logo.*")
                logos = glob.glob(logo_pattern)
                for logo in logos:
                    shutil.copyfile(logo, os.path.join(dst_dir, os.path.basename(logo)))

                assets_path = os.path.join(src_dir, "assets")
                if os.path.isdir(assets_path):
                    shutil.copytree(
                        assets_path, os.path.join(dst_dir, os.path.basename(assets_path))
                    )

    copy_bots_data(os.listdir(package_bots_dir))


if __name__ == "__main__":
    generate_pythonapi_integrations_static_files()
    generate_zulip_bots_static_files()
```

--------------------------------------------------------------------------------

---[FILE: generate_integration_bots_avatars.py]---
Location: zulip-main/tools/setup/generate_integration_bots_avatars.py
Signals: Django

```python
#!/usr/bin/env python3
import argparse
import os
import sys

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ZULIP_PATH not in sys.path:
    sys.path.append(ZULIP_PATH)
from scripts.lib.setup_path import setup_path

setup_path()

os.environ["DJANGO_SETTINGS_MODULE"] = "zproject.settings"
import django

django.setup()

import pyvips

from zerver.lib.integrations import INTEGRATIONS
from zerver.lib.storage import static_path
from zerver.lib.thumbnail import DEFAULT_AVATAR_SIZE


def create_integration_bot_avatar(logo_path: str, bot_avatar_path: str) -> None:
    os.makedirs(os.path.dirname(bot_avatar_path), exist_ok=True)
    avatar = pyvips.Image.thumbnail(logo_path, DEFAULT_AVATAR_SIZE, height=DEFAULT_AVATAR_SIZE)
    if avatar.height != avatar.width:
        avatar = avatar.gravity(
            pyvips.CompassDirection.CENTRE, DEFAULT_AVATAR_SIZE, DEFAULT_AVATAR_SIZE
        )
    avatar.write_to_file(bot_avatar_path)


def generate_integration_bots_avatars(check_missing: bool = False) -> None:
    missing = set()
    for integration in INTEGRATIONS.values():
        bot_avatar_path = integration.get_bot_avatar_path()
        bot_avatar_path = os.path.join(ZULIP_PATH, "static", bot_avatar_path)
        if check_missing:
            if not os.path.isfile(bot_avatar_path):
                missing.add(integration.name)
        else:
            create_integration_bot_avatar(static_path(integration.logo_path), bot_avatar_path)

    if missing:
        print(
            "ERROR: Bot avatars are missing for these webhooks: {}.\n"
            "ERROR: Run ./tools/setup/generate_integration_bots_avatars.py "
            "to generate them.\nERROR: Commit the newly generated avatars to "
            "the repository.".format(", ".join(missing))
        )
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check-missing", action="store_true")
    options = parser.parse_args()
    generate_integration_bots_avatars(options.check_missing)
```

--------------------------------------------------------------------------------

---[FILE: generate_landing_page_images.py]---
Location: zulip-main/tools/setup/generate_landing_page_images.py

```python
#!/usr/bin/env python3
"""Generates versions of landing page images to be served in different conditions."""

import glob
import os
import sys
from pathlib import Path

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ZULIP_PATH not in sys.path:
    sys.path.append(ZULIP_PATH)

import pyvips

LANDING_IMAGES_DIR = os.path.join(ZULIP_PATH, "static", "images", "landing-page", "hello")
ORIGINAL_IMAGES_DIR = os.path.join(LANDING_IMAGES_DIR, "original")
GENERATED_IMAGES_DIR = os.path.join(LANDING_IMAGES_DIR, "generated")


def get_x_size(size: int, x: int) -> int:
    return int(x / 3.0 * size)


def generate_landing_page_images() -> None:
    if not os.path.exists(GENERATED_IMAGES_DIR):
        os.mkdir(GENERATED_IMAGES_DIR)
    else:
        # Delete folder contents to avoid stale images between different versions of the script.
        for file in os.listdir(GENERATED_IMAGES_DIR):
            os.remove(os.path.join(GENERATED_IMAGES_DIR, file))

    for image_file_path in glob.glob(f"{ORIGINAL_IMAGES_DIR}/*"):
        file_name = Path(image_file_path).stem
        image = pyvips.Image.new_from_file(image_file_path)
        size = 2
        scaled_width = get_x_size(image.width, size)
        scaled_height = get_x_size(image.height, size)
        scaled = image.thumbnail_image(scaled_width, height=scaled_height)
        for format in ("webp[Q=60]", "jpg[Q=80,optimize-coding=true]"):
            scaled.write_to_file(f"{GENERATED_IMAGES_DIR}/{file_name}-{size}x.{format}")


if __name__ == "__main__":
    generate_landing_page_images()
```

--------------------------------------------------------------------------------

---[FILE: install-aws-server]---
Location: zulip-main/tools/setup/install-aws-server

```text
#!/usr/bin/env bash
set -eu
set -o pipefail

usage() {
    cat <<EOF
USAGE: $0 [--roles=roles] [--branch=main] [--debug-key=username] server

Installs an empty Ubuntu server in AWS with a Zulip server role.

 * server is the local part of the hostname (e.g. postgres0)

 * roles is a comma-separated list of Puppet profile names; these
   will get 'kandra::profile::' prepended to them, and passed
   to scripts/lib/install -- e.g. 'postgresql'
 * branch is used to override the default branch to install from.
 * username is the name of the AWS SSH key pair to allow logins as
   'ubuntu' with during initial boot; this is purely for debugging the
   bootstrapping process.

Reads configuration from $HOME/.zulip-install-server.conf, which should look like:

[repo]
repo_url=git@github.com:zulip/zulip.git
[aws]
zone_id=Z2U988IEXAMPLE
security_groups=sg-01234567
instance_type=m4.large
EOF
}

args="$(getopt -o '' --long help,branch:,roles:,debug-key: -n "$0" -- "$@")" || {
    usage >&2
    exit 1
}
eval "set -- $args"

BRANCH="production"
ROLES="base"
DEBUG_KEY=""
while true; do
    case "$1" in
        --help)
            usage
            exit 0
            ;;
        --roles)
            shift
            ROLES="$1"
            shift
            ;;
        --branch)
            shift
            BRANCH="$1"
            shift
            ;;
        --debug-key)
            shift
            DEBUG_KEY="$1"
            shift
            ;;
        --)
            shift
            break
            ;;
    esac
done

if [ $# -ne 1 ]; then
    usage >&2
    exit 1
fi

SERVER="$1"

set -x

cd "$(dirname "$0")/../.."

./puppet/kandra/files/install-aws-cli
AWS=/srv/zulip-aws-tools/bin/aws

zulip_install_config_file="$HOME/.zulip-install-server.conf"
if [ ! -f "$zulip_install_config_file" ]; then
    echo "No configuration file found in $zulip_install_config_file"
    exit 1
fi

REPO_URL=$(crudini --get "$zulip_install_config_file" repo repo_url)

for role in ${ROLES//,/ }; do
    if ! [ -f "./puppet/kandra/manifests/profile/$role.pp" ]; then
        echo "No such role kandra::profile::$role !"
        exit 1
    fi
done
FULL_ROLES=$(echo "$ROLES" | perl -pe '$_=join(",",map{"kandra::profile::$_"} split ",")')

function lookup() {
    KEY="$1"
    crudini --get "$zulip_install_config_file" "aws-$ROLES" "$KEY" 2>/dev/null \
        || crudini --get "$zulip_install_config_file" aws "$KEY"
}

AWS_ZONE_ID=$(lookup zone_id)
SECURITY_GROUPS=$(lookup security_groups)
read -r -a SECURITY_GROUPS <<<"$SECURITY_GROUPS"
INSTANCE_TYPE=$(lookup instance_type)
IAM_PROFILE=$(lookup iam_profile)
AZ=$(lookup availability_zone)
DISK_SIZE=$(lookup disk_size)

# Determine the architecture
ARCH=$($AWS ec2 describe-instance-types --instance-types "$INSTANCE_TYPE" --query 'InstanceTypes[*].ProcessorInfo.SupportedArchitectures[0]' --output text)

# Lookup the latest 24.04 image
AMI_ID=$($AWS ec2 describe-images --owners 099720109477 --filters 'Name=name,Values=ubuntu/images/hvm-ssd-gp3/ubuntu-*-24.04*' "Name=architecture,Values=$ARCH" --query 'sort_by(Images, &CreationDate)[-1].ImageId' --output text)

# Verify it doesn't exist already
ZONE_NAME=$($AWS route53 get-hosted-zone --id "$AWS_ZONE_ID" | jq -r '.HostedZone.Name')
HOSTNAME="$SERVER.${ZONE_NAME%?}" # Remove trailing .
EXISTING_RECORDS=$($AWS route53 list-resource-record-sets \
    --hosted-zone-id "$AWS_ZONE_ID" \
    --query "ResourceRecordSets[?Name == '$HOSTNAME.']" \
    | jq '. | length')
if [ "$EXISTING_RECORDS" != "0" ]; then
    echo "$HOSTNAME already exists!"
    exit 1
fi

# https://docs.aws.amazon.com/cli/latest/reference/ec2/run-instances.html
EXTRA_ARGS+=(
    --iam-instance-profile "Name=\"$IAM_PROFILE\""
    --image-id "$AMI_ID"
    --instance-type "$INSTANCE_TYPE"
    --security-group-ids "${SECURITY_GROUPS[@]}"
    --monitoring Enabled=true
    --placement "AvailabilityZone=$AZ"
    --block-device-mappings "DeviceName=/dev/sda1,Ebs={VolumeSize=$DISK_SIZE,VolumeType=gp3,Throughput=125,Iops=3000,Encrypted=true}"
    --metadata-options "InstanceMetadataTags=enabled"
)

if [ -n "$DEBUG_KEY" ]; then
    EXTRA_ARGS+=(
        --key-name "$DEBUG_KEY"
    )
fi

# Build up the provisioning script
BOOTDATA=$(mktemp)
{
    echo "#!/bin/bash"
    echo "SERVER=$SERVER"
    echo "HOSTNAME=$HOSTNAME"
    echo "FULL_ROLES=$FULL_ROLES"
    echo "REPO_URL=$REPO_URL"
    echo "BRANCH=$BRANCH"
    # Replace anything which looks like FOO="inline!bar/baz" with the
    # output of pack-local-script, which will make "$FOO" inside the
    # $BOOTDATA be the path to that script (smuggled inline and
    # unpacked before use).
    perl -ple 's|^(\w+)="inline!([^"]+)"|qx(./tools/setup/pack-local-script $1 $2)|e' ./tools/setup/bootstrap-aws-installer
} >>"$BOOTDATA"

TAG_ROLE_NAMES="$ROLES"
TAGS="[{Key=Name,Value=$SERVER},{Key=role,Value=\"$TAG_ROLE_NAMES\"}]"
INSTANCE_DATA=$($AWS ec2 run-instances \
    --tag-specifications "ResourceType=instance,Tags=$TAGS" \
    "${EXTRA_ARGS[@]}" \
    --user-data "file://$BOOTDATA")
INSTANCEID=$(echo "$INSTANCE_DATA" | jq -r .Instances[0].InstanceId)

# Wait for public IP assignment
PUBLIC_DNS_NAME=""
while [ -z "$PUBLIC_DNS_NAME" ]; do
    sleep 1
    INSTANCE_DATA=$($AWS ec2 describe-instances --instance-ids "$INSTANCEID")
    PUBLIC_DNS_NAME=$(echo "$INSTANCE_DATA" | jq -r .Reservations[0].Instances[0].PublicDnsName)
done

# Add the hostname to the zone
ROUTE53_CHANGES=$(mktemp)
cat >"$ROUTE53_CHANGES" <<EOF
{
    "Comment": "Add the $HOSTNAME CNAME record",
    "Changes": [
        {
            "Action": "CREATE",
            "ResourceRecordSet": {
                "Name": "$HOSTNAME",
                "Type": "CNAME",
                "TTL": 300,
                "ResourceRecords": [{"Value": "$PUBLIC_DNS_NAME"}]
            }
        }
    ]
}
EOF
$AWS route53 change-resource-record-sets --hosted-zone-id "$AWS_ZONE_ID" --change-batch "file://$ROUTE53_CHANGES"
rm "$ROUTE53_CHANGES"

VOLUME_ID=$(echo "$INSTANCE_DATA" | jq -r .Reservations[0].Instances[0].BlockDeviceMappings[0].Ebs.VolumeId)
$AWS ec2 create-tags --resources "$VOLUME_ID" --tags "Key=Name,Value=$SERVER root"

set +x
echo
echo
echo ">>> Install started successfully!  Provisioning takes 5-6min."
echo "    sleep 360 && tsh ssh root@$HOSTNAME"
```

--------------------------------------------------------------------------------

---[FILE: install-shellcheck]---
Location: zulip-main/tools/setup/install-shellcheck

```text
#!/usr/bin/env bash
set -eu

version=0.11.0
arch="$(uname -m)"
tarball="shellcheck-v$version.linux.$arch.tar.xz"
declare -A sha256=(
    [aarch64]=12b331c1d2db6b9eb13cfca64306b1b157a86eb69db83023e261eaa7e7c14588
    [x86_64]=8c3be12b05d5c177a04c29e3c78ce89ac86f1595681cab149b65b97c4e227198
)

check_version() {
    out="$(shellcheck --version)" && [[ "$out" = *"
version: $version
"* ]]
}

if ! check_version 2>/dev/null; then
    set -x
    tmpdir="$(mktemp -d)"
    trap 'rm -r "$tmpdir"' EXIT
    cd "$tmpdir"
    curl -fLO --retry 3 "https://github.com/koalaman/shellcheck/releases/download/v$version/$tarball"
    sha256sum -c <<<"${sha256[$arch]} $tarball"
    tar -xJf "$tarball" --no-same-owner --strip-components=1 -C /usr/local/bin "shellcheck-v$version/shellcheck"
    check_version
fi
```

--------------------------------------------------------------------------------

---[FILE: install-shfmt]---
Location: zulip-main/tools/setup/install-shfmt

```text
#!/usr/bin/env bash
set -eu

version=3.12.0
arch="$(uname -m)"

case $arch in
    "x86_64")
        binary="shfmt_v${version}_linux_amd64"
        sha256=d9fbb2a9c33d13f47e7618cf362a914d029d02a6df124064fff04fd688a745ea
        ;;

    "aarch64")
        binary="shfmt_v${version}_linux_arm64"
        sha256=5f3fe3fa6a9f766e6a182ba79a94bef8afedafc57db0b1ad32b0f67fae971ba4
        ;;
esac

check_version() {
    out="$(shfmt --version)" && [ "$out" = "v$version" ]
}

if ! check_version 2>/dev/null; then
    set -x
    tmpdir="$(mktemp -d)"
    trap 'rm -r "$tmpdir"' EXIT
    cd "$tmpdir"
    curl -fLO --retry 3 "https://github.com/mvdan/sh/releases/download/v$version/$binary"
    sha256sum -c <<<"$sha256 $binary"
    chmod +x "$binary"
    mv "$binary" /usr/local/bin/shfmt
    check_version
fi
```

--------------------------------------------------------------------------------

---[FILE: install-tusd]---
Location: zulip-main/tools/setup/install-tusd

```text
#!/usr/bin/env bash
set -eu

# This should be kept in sync with puppet/zulip/manifests/common.pp
version=2.8.0
arch="$(uname -m)"

case $arch in
    x86_64)
        tarball="tusd_linux_amd64"
        sha256=e13c8adc9bed4c993a72f60140f688736058d2c3f4a18fb6e59ca26e829fb93b
        ;;

    aarch64)
        tarball="tusd_linux_arm64"
        sha256=089eb6d144df7cc5e10ac611a18f407308aedb3f9024a78fa01cb60ba99005a9
        ;;
esac

check_version() {
    out="$(tusd --version)" && [[ "$out" = "Version: v$version
"* ]]
}

if ! check_version 2>/dev/null; then
    set -x
    tmpdir="$(mktemp -d)"
    trap 'rm -r "$tmpdir"' EXIT
    cd "$tmpdir"
    curl_opts=(-fLO --retry 3)
    curl "${curl_opts[@]}" "https://github.com/tus/tusd/releases/download/v${version}/${tarball}.tar.gz"
    sha256sum -c <<<"${sha256} ${tarball}.tar.gz"
    tar -xzf "${tarball}.tar.gz" --no-same-owner "${tarball}/tusd"
    install -Dm755 "${tarball}/tusd" /usr/local/bin/tusd
    check_version
fi
```

--------------------------------------------------------------------------------

---[FILE: lang.json]---
Location: zulip-main/tools/setup/lang.json

```json
{
    "default": {
        "text": 31,
        "javascript": 27,
        "python": 26,
        "java": 25,
        "go": 24,
        "rust": 23,
        "html": 22,
        "css": 21,
        "sql": 20,
        "bash": 19,
        "powershell": 18,
        "c#": 17,
        "php": 16,
        "typescript": 15,
        "c++": 14,
        "c": 13,
        "kotlin": 12,
        "ruby": 11,
        "asm": 10,
        "vb.net": 9,
        "swift": 8,
        "r": 7,
        "objective-c": 6,
        "dart": 5,
        "scala": 4,
        "perl": 3,
        "haskell": 2,
        "julia": 1
    },
    "custom": {
        "latex": 10,
        "math": 28,
        "quote": 30,
        "spoiler": 29
    },
    "aliases": {
        "js": 27,
        "csharp": 17,
        "cpp": 14,
        "tex": 10,
        "vbnet": 9
    }
}
```

--------------------------------------------------------------------------------

---[FILE: optimize-svg]---
Location: zulip-main/tools/setup/optimize-svg

```text
#!/usr/bin/env bash
set -e

usage() {
    cat <<'EOF'
Usage:
  optimize-svg [--check] [filename]
  optimize-svg --help

Options:
  --check
      This will check for unoptimized SVG files rather than automatically optimizing them.
      This allows us to run the script in CI.
  [filename]
      The filename of the SVG file to optimize, located in static/images/integrations/logos.
      If not provided, all files in the directory will be optimized.

EOF
}

# Shell option parsing.  Over time, we'll want to move some of the
# environment variables below into this self-documenting system.
args="$(getopt -o '' --long help,check -n "$0" -- "$@")"
eval "set -- $args"
while true; do
    case "$1" in
        --help)
            usage
            exit 0
            ;;
        --check)
            CHECK_UNOPTIMIZED=1
            shift
            ;;
        --)
            shift
            break
            ;;
    esac
done

if [ "$#" -gt 1 ]; then
    usage >&2
    exit 1
fi

ZULIP_PATH="$(readlink -f "$(dirname "$0")"/../..)"
PNPM="/usr/local/bin/pnpm"
BASE_PATH="static/images/integrations/logos"

if [ "$#" -eq 0 ]; then
    FILE_PATH="$BASE_PATH"
    SVGO_FLAG="-f"
else
    FILE_PATH="$BASE_PATH/$1"
    SVGO_FLAG=""
fi

if [ -n "$CHECK_UNOPTIMIZED" ]; then
    TEMP_PATH=$(mktemp -d svgo_temp_XXXXXX)
    RESULT=$("$PNPM" exec svgo -o "$TEMP_PATH" $SVGO_FLAG "$FILE_PATH" | grep -o '\.[0-9]% = ' | wc -l)
    rm -rf "$TEMP_PATH"
    if [ "$RESULT" -ge 1 ]; then
        echo "ERROR: svgo detected unoptimized SVG file(s)." 1>&2
        echo "Please run tools/setup/optimize-svg and commit the file changes to optimize them."
        exit 1
    else
        echo "SUCCESS: SVG file(s) are optimized!"
    fi
else
    "$PNPM" exec svgo -q $SVGO_FLAG "$FILE_PATH"
    if [ "$#" -eq 0 ]; then
        "$ZULIP_PATH"/tools/setup/generate_integration_bots_avatars.py
    fi
fi
```

--------------------------------------------------------------------------------

---[FILE: pack-local-script]---
Location: zulip-main/tools/setup/pack-local-script

```text
#!/usr/bin/env bash

# This tool generates code in shell which is meant to be inline'd into
# a larger script; called with a variable name and a path, it produces
# a script which will result in that variable being set to the path to
# the contents of that path.
#
# This is used in bootstrap-aws-installer to bundle local files into
# the EC2 user data, so that those canonical versions can be used to
# bootstrap the host.
set -eu

var="$1"
file="$2"

mode="$(stat -c "%a" "$file")"

encoded="$(gzip --stdout "$file" | base64)"
cat <<embedded-shell-output
$var="\$(mktemp)"
chmod "$mode" "\$$var"
base64 -d <<"encoded-shell-script" | gzip -d > "\$$var"
$encoded
encoded-shell-script
embedded-shell-output
```

--------------------------------------------------------------------------------

---[FILE: postgresql-init-dev-db]---
Location: zulip-main/tools/setup/postgresql-init-dev-db

```text
#!/usr/bin/env bash
set -e

if [[ $# == 0 ]]; then
    MODE=dev
elif [[ $# == 1 ]]; then
    MODE=$1
else
    echo "Too many arguments"
    exit 1
fi

if [[ "$MODE" == "dev" ]]; then
    USERNAME=zulip
    DBNAME=zulip
    STATUS_FILE_NAME=migration_status_dev
elif [[ "$MODE" == "test" ]]; then
    USERNAME=zulip_test
    DBNAME=zulip_test
    STATUS_FILE_NAME=migration_status_test
else
    echo "Usage instructions"
    echo "Run with either no arguments (sets up devel db for local deploy--zulip with user zulip)"
    echo "or specify 'test'"
    exit 1
fi

set -x

POSTGRES_USER="postgres"
if [ "$(uname)" = "OpenBSD" ]; then
    POSTGRES_USER="_postgresql"
fi

ROOT_POSTGRES=(sudo -i -u "$POSTGRES_USER" psql)
DEFAULT_DB=""
if [ "$(uname)" = "Darwin" ]; then
    ROOT_POSTGRES=(psql)
    DEFAULT_DB="postgres"
fi

if [ "$(uname)" = "OpenBSD" ]; then
    DEFAULT_DB="postgres"
fi

VAGRANTUSERNAME=$(whoami)

PASSWORD=$("$(dirname "$0")/../../scripts/get-django-setting" LOCAL_DATABASE_PASSWORD)
DBNAME_BASE=${DBNAME}_base

if ! pg_isready -U "$POSTGRES_USER" -q; then
    set +x
    echo
    echo 'ERROR: PostgreSQL server is not running! Ensure the service is enabled.'
    # shellcheck disable=SC2016
    echo 'ERROR: Try `sudo service postgresql start`?'
    echo "ERROR: You can easily test if you fixed it using: pg_isready -U \$POSTGRES_USER"
    exit 1
fi

# We need to remove the stamp file indicating that the database
# is properly provisioned with migrations.
uuid_var_path=$("$(readlink -f "$(dirname "$0")/../../scripts/lib/zulip_tools.py")" get_dev_uuid)
rm -f "$uuid_var_path/$STATUS_FILE_NAME"

"${ROOT_POSTGRES[@]}" -v ON_ERROR_STOP=1 -e "$DEFAULT_DB" <<EOF
DO \$\$BEGIN
    CREATE USER $USERNAME;
EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE '$USERNAME user already exists';
END\$\$;
ALTER USER $USERNAME PASSWORD '$PASSWORD';
ALTER USER $USERNAME CREATEDB;

DO \$\$BEGIN
    CREATE USER "$VAGRANTUSERNAME"; 
EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE '$VAGRANTUSERNAME user already exists';
END\$\$;
GRANT $USERNAME TO "$VAGRANTUSERNAME";
ALTER ROLE "$VAGRANTUSERNAME" SET search_path TO zulip,public;
EOF

umask go-rw
PGPASS_PREFIX="*:*:*:$USERNAME:"
PGPASS_ESCAPED_PREFIX="*:\\*:\\*:$USERNAME:"
if ! grep -q "$PGPASS_ESCAPED_PREFIX" ~/.pgpass; then
    echo "$PGPASS_PREFIX$PASSWORD" >>~/.pgpass
else
    sed -i "s/$PGPASS_ESCAPED_PREFIX.*\$/$PGPASS_PREFIX$PASSWORD/" ~/.pgpass
fi
chmod go-rw ~/.pgpass

PGHOST=localhost PGUSER="$USERNAME" \
    "$(dirname "$0")/../../scripts/setup/terminate-psql-sessions" "$DBNAME" "$DBNAME_BASE"

psql -v ON_ERROR_STOP=1 -e -h localhost postgres "$USERNAME" <<EOF
DROP DATABASE IF EXISTS $DBNAME;
DROP DATABASE IF EXISTS $DBNAME_BASE;
CREATE DATABASE $DBNAME_BASE
EOF

"${ROOT_POSTGRES[@]}" -v ON_ERROR_STOP=1 -e "$DBNAME_BASE" <<EOF
CREATE EXTENSION pgroonga;

-- Work around https://github.com/pgroonga/pgroonga/issues/335
SELECT unnest(
    CASE WHEN current_setting('server_version_num')::integer >= 150000
        AND current_setting('pgroonga.enable_wal', TRUE) = 'on' IS NOT TRUE THEN
        ARRAY['ALTER SYSTEM SET pgroonga.enable_wal = ''on''', 'SELECT pg_reload_conf()']
    END
) \gexec
EOF

psql -v ON_ERROR_STOP=1 -e -h localhost postgres "$USERNAME" <<EOF
CREATE DATABASE $DBNAME TEMPLATE $DBNAME_BASE;
EOF

"$(dirname "$0")/../../scripts/setup/flush-memcached"

echo "Database created"
```

--------------------------------------------------------------------------------

---[FILE: postgresql-init-test-db]---
Location: zulip-main/tools/setup/postgresql-init-test-db

```text
#!/usr/bin/env bash
set -x
set -e

"$(dirname "$0")/postgresql-init-dev-db" test
```

--------------------------------------------------------------------------------

---[FILE: vagrant-provision]---
Location: zulip-main/tools/setup/vagrant-provision

```text
#!/usr/bin/env bash
set -x
set -e
set -o pipefail

# Code should go here, rather than tools/provision, only if it is
# something that we don't want to happen when running provision in a
# development environment not using Vagrant.

# Set the Ubuntu mirror
[ ! "$UBUNTU_MIRROR" ] || sudo sed -i 's|http://\(\w*\.\)*archive\.ubuntu\.com/ubuntu/\? |'"$UBUNTU_MIRROR"' |' /etc/apt/sources.list

# Set the MOTD on the system to have Zulip instructions
sudo ln -nsf /srv/zulip/tools/setup/dev-motd /etc/update-motd.d/99-zulip-dev
sudo rm -f /etc/update-motd.d/10-help-text /etc/update-motd.d/99-bento
sudo dpkg --purge landscape-common
sudo dpkg-divert --add --rename /etc/default/motd-news
sudo sh -c 'echo ENABLED=0 > /etc/default/motd-news'

# Set default locale, this prevents errors if the user has another locale set.
if ! grep -q 'LC_ALL=C.UTF-8' /etc/default/locale; then
    echo "LC_ALL=C.UTF-8" | sudo tee -a /etc/default/locale
fi

# Set an environment variable, so that we won't print the virtualenv
# shell warning (it'll be wrong, since the shell is dying anyway)
export SKIP_VENV_SHELL_WARNING=1

# End `set -x`, so that the end of provision doesn't look like an error
# message after a successful run.
set +x

# Check if the zulip directory is writable
if [ ! -w /srv/zulip ]; then
    echo "The vagrant user is unable to write to the zulip directory."
    echo "To fix this, run the following commands on the host machine:"
    # sudo is required since our uid is not 1000
    echo '    vagrant halt -f'
    echo '    rm -rf /PATH/TO/ZULIP/CLONE/.vagrant'
    # shellcheck disable=SC2016
    echo '    sudo chown -R 1000:$(id -g) /PATH/TO/ZULIP/CLONE'
    echo "Replace /PATH/TO/ZULIP/CLONE with the path to where zulip code is cloned."
    echo "You can resume setting up your vagrant environment by running:"
    echo "    vagrant up"
    exit 1
fi
# Provision the development environment
ln -nsf /srv/zulip ~/zulip
/srv/zulip/tools/provision

# Run any custom provision hooks the user has configured
if [ -f /srv/zulip/tools/custom_provision ]; then
    chmod +x /srv/zulip/tools/custom_provision
    /srv/zulip/tools/custom_provision
fi
```

--------------------------------------------------------------------------------

---[FILE: csr.conf]---
Location: zulip-main/tools/setup/apns/csr.conf

```text
[req]
encrypt_key = no

prompt = no
distinguished_name = req_distinguished_name

[req_distinguished_name]
CN = APNs for Zulip
emailAddress = zulip-ops@zulip.com
```

--------------------------------------------------------------------------------

---[FILE: prep-cert]---
Location: zulip-main/tools/setup/apns/prep-cert

```text
#!/usr/bin/env bash
set -euo pipefail

this_dir=${BASH_SOURCE[0]%/*}

die() {
    echo >&2 "$1"
    exit 1
}

request() {
    (($# == 2)) || die "usage: prep-cert request KEY_OUT CSR_OUT"
    local key_out=$1
    local csr_out=$2

    openssl req -new \
        -config "${this_dir}/csr.conf" \
        -keyout "${key_out}" -out "${csr_out}"
}

combine() {
    (($# == 3)) || die "usage: prep-cert combine KEY CERT OUT"
    local key=$1
    local cert=$2
    local out=$3

    local tmpdir
    tmpdir=$(mktemp -d)
    cleanup() {
        rm -rf "${tmpdir}"
        trap - RETURN EXIT
    }
    trap cleanup RETURN EXIT

    local cert_pem="${tmpdir}/cert.pem"
    local combined_p12="${tmpdir}/combined.p12"
    openssl x509 -in "${cert}" -inform der -out "${cert_pem}"
    openssl pkcs12 -export -passout pass: \
        -inkey "${key}" -in "${cert_pem}" -out "${combined_p12}"
    openssl pkcs12 -in "${combined_p12}" -passin pass: \
        -out "${out}" -nodes
}

case "${1-}" in
    request) shift && request "$@" ;;
    combine) shift && combine "$@" ;;
    *) die "usage: prep-cert {request|combine} ...ARGS" ;;
esac
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile]---
Location: zulip-main/tools/setup/dev-vagrant-docker/Dockerfile

```text
FROM ubuntu:22.04

ARG UBUNTU_MIRROR

# Basic packages and dependencies of docker-systemctl-replacement
RUN echo locales locales/default_environment_locale select C.UTF-8 | debconf-set-selections \
    && echo locales locales/locales_to_be_generated select "C.UTF-8 UTF-8" | debconf-set-selections \
    && { [ ! "$UBUNTU_MIRROR" ] || sed -i "s|http://\(\w*\.\)*archive\.ubuntu\.com/ubuntu/\? |$UBUNTU_MIRROR |" /etc/apt/sources.list; } \
    # This restores man pages and other documentation that have been
    # stripped from the default Ubuntu cloud image and installs
    # ubuntu-minimal and ubuntu-standard.
    #
    # This makes sense to do because we're using this image as a
    # development environment, not a minimal production system.
    && printf 'y\n\n' | unminimize \
    && apt-get install --no-install-recommends -y \
           ca-certificates \
           curl \
           locales \
           openssh-server \
           python3 \
           sudo \
           systemd \
    && rm -rf /var/lib/apt/lists/*

ARG VAGRANT_UID

RUN \
    # We use https://github.com/gdraheim/docker-systemctl-replacement
    # to make services we install like PostgreSQL, Redis, etc. normally
    # managed by systemd start within Docker, which breaks normal
    # operation of systemd.
    dpkg-divert --add --rename /bin/systemctl \
    && curl -fLsS --retry 3 -o /bin/systemctl 'https://raw.githubusercontent.com/gdraheim/docker-systemctl-replacement/v1.5.9063/files/docker/systemctl3.py' \
    && echo '1744aa7281159668d51fc97e57d834b6f116da10796f7f3352de48ad0cbba5b2  /bin/systemctl' | sha256sum -c \
    && chmod +x /bin/systemctl \
    && ln -nsf /bin/true /usr/sbin/policy-rc.d \
    && mkdir -p /run/sshd \
    # docker-systemctl-replacement doesn’t work with template units yet:
    # https://github.com/gdraheim/docker-systemctl-replacement/issues/62
    && ln -ns /lib/systemd/system/postgresql@.service /etc/systemd/system/multi-user.target.wants/postgresql@14-main.service \
    # Set up the vagrant user and its SSH key (globally public)
    && useradd -ms /bin/bash -u "$VAGRANT_UID" vagrant \
    && mkdir -m 700 ~vagrant/.ssh \
    && curl -fLsS --retry 3 -o ~vagrant/.ssh/authorized_keys 'https://raw.githubusercontent.com/hashicorp/vagrant/be7876d83644aa6bdf7f951592fdc681506bcbe6/keys/vagrant.pub' \
    && chown -R vagrant: ~vagrant/.ssh \
    && echo 'vagrant ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/vagrant

CMD ["/bin/systemctl"]

EXPOSE 22
EXPOSE 9991
```

--------------------------------------------------------------------------------

````
