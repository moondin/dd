---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 550
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 550 of 1290)

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

---[FILE: total-contributions]---
Location: zulip-main/tools/total-contributions

```text
#!/usr/bin/env python3
import argparse
import os
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

bot_commits = 0

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ZULIP_PATH)


def add_log(committer_dict: dict[str, int], input: list[str]) -> None:
    for dataset in input:
        committer_name = dataset.split("\t")[1]
        commit_count = int(dataset.split("\t")[0])

        if committer_name.endswith("[bot]") or committer_name == "Hosted Weblate":
            # Exclude dependabot[bot] and other GitHub bots.
            global bot_commits
            bot_commits += commit_count
            continue

        committer_dict[committer_name] += commit_count


def retrieve_log(repo: str, revisions: str) -> list[str]:
    return subprocess.check_output(
        ["git", "shortlog", "-s", revisions],
        cwd=find_path(repo),
        text=True,
    ).splitlines()


def find_path(repository: str) -> str:
    return str(Path.cwd().parent / repository)


def process_repo(
    *,
    out_dict: dict[str, int],
    repo_short: str,
    repo_full: str,
    lower_version: str,
    upper_version: str,
) -> None:
    if not lower_version:
        revisions = upper_version
        revisions_display = f"(start)..{upper_version[0:12]}"
    else:
        revisions = f"{lower_version}..{upper_version}"
        revisions_display = f"{lower_version[0:12]}..{upper_version[0:12]}"
    if revisions == "":
        # Repository has no commits overlapping with version range
        print(f"0 commits from {repo_full}")
        return
    commit_count = len(
        subprocess.check_output(
            ["git", "log", "--pretty=oneline", revisions],
            cwd=find_path(repo_short),
            text=True,
        ).splitlines()
    )
    repo_log = retrieve_log(repo_short, revisions)
    print(f"{commit_count} commits from {repo_full}: {revisions_display}")
    add_log(out_dict, repo_log)


def find_last_commit_before_time(repository: str, branch: str, time: str) -> str:
    """Find the latest release version for the target repository as of the
    specified time.
    """
    return subprocess.check_output(
        ["git", "rev-list", "-1", f"--before={time}", branch, "--"],
        cwd=find_path(repository),
        text=True,
    ).strip()


# argparse
parser = argparse.ArgumentParser(
    prog="python3 total-contributions",
    formatter_class=argparse.RawTextHelpFormatter,
    description="""\
Aggregates the total commit contributions to Zulip that should be
attributed to the time window between the two provided
zulip/zulip versions (tags or branches).

The attribution algorithm used by this tool attributes all changes for
a Zulip project between:

* The last release of the target project before the first zulip/zulip version.
* The last release of the target project before the last zulip/zulip version.

This algorithm has the key property that the totals for a given contributor of
2.1.0..4.0 will equal the sum of 2.1.0..3.0 and 3.0..4.0.

Its main downside is that contributions to projects other than
zulip/zulip in the last few weeks before a zulip/zulip release will be
delayed (i.e. counted in the total for the next zulip/zulip release).

Expects that all Zulip repositories are in the current working
directory, which does not need to be the directory this is run from.

# Changes between two major releases.
total-contributions 4.0 5.0

# Changes between a release and the current main branch.
total-contributions 4.0 main
total-contributions 2.1.0
    """,
)
parser.add_argument(
    "version",
    metavar="version",
    nargs="*",
    # TODO: Ideally, we'd replace "1.3.0" with "First commit", to
    # simplify including contributions before the 1.3.0 release.
    default=["1.3.0", "main"],
    help="Git tag or branch in zulip/zulip specifying one end of the commit range to use.",
)

parser.add_argument(
    "-a",
    "--ascending",
    action="store_true",
    help="Sort contributors based on number of commits(ascending order)",
)

args = parser.parse_args()

if len(args.version) > 2:
    parser.error("Expects 0 to 2 version number(s)")

lower_zulip_version = args.version[0]
if len(args.version) == 1:
    upper_zulip_version = "main"
else:
    upper_zulip_version = args.version[1]

subprocess.check_call(["git", "fetch"], cwd=find_path("zulip"))

# Extract git version and time. It's important that we use the commit
# date (%ci), not the author date (%ai), since while those are often
# near identical for release commits, if we pass a branch like `main`,
# it's possible the latest commit on the branch might have a months
# old author date if the last pull request merged was started at that
# time.
try:
    lower_time = subprocess.check_output(
        ["git", "log", "-1", "--format=%ci", lower_zulip_version],
        stderr=subprocess.DEVNULL,
        text=True,
    ).split()[0]
    upper_time = subprocess.check_output(
        ["git", "log", "-1", "--format=%ci", upper_zulip_version],
        stderr=subprocess.DEVNULL,
        text=True,
    ).split()[0]
except subprocess.CalledProcessError:
    print("Specified version(s) don't exist")
    sys.exit(0)

print(
    f"Commit range {lower_zulip_version}..{upper_zulip_version} corresponds to {lower_time} to {upper_time}"
)

repository_dict: dict[str, int] = defaultdict(int)
out_dict: dict[str, int] = defaultdict(int)
subprocess.check_call(["git", "fetch"], cwd=find_path("zulip"))
process_repo(
    out_dict=out_dict,
    repo_short="zulip",
    repo_full="zulip/zulip",
    lower_version=lower_zulip_version,
    upper_version=upper_zulip_version,
)

# TODO: We should migrate the last couple repositories to use the
# `main` default branch name and then simplify this.
for full_repository, branch in [
    ("zulip/zulip-mobile", "main"),
    ("zulip/zulip-flutter", "main"),
    ("zulip/zulip-desktop", "main"),
    ("zulip/docker-zulip", "main"),
    ("zulip/python-zulip-api", "main"),
    ("zulip/zulip-archive", "master"),
    ("zulip/zulip-architecture", "main"),
    ("zulip/zulip-terminal", "main"),
    ("zulip/zulint", "main"),
    ("zulip/github-actions-zulip", "main"),
    ("zulip/zulip-js", "main"),
    ("zulip/zulip-archive", "master"),
    ("zulip/zulipbot", "main"),
    ("zulip/zulip-zapier", "master"),
    # Legacy repositories, not actively developed.
    ("zulip/zulip-desktop-legacy", "master"),
    ("zulip/zulip-android-legacy", "master"),
    ("zulip/zulip-ios-legacy", "master"),
    ("zulip/hubot-zulip", "master"),
    ("zulip/puppet-zulip", "master"),
    ("zulip/trello-to-zulip", "master"),
    ("zulip/swift-zulip-api", "master"),
    ("zulip/errbot-backend-zulip", "master"),
    ("zulip/zulip-redmine-plugin", "master"),
    ("zulip/zulip-csharp", "master"),
]:
    repository = os.path.basename(full_repository)

    if os.path.exists(find_path(repository)):
        # Update the checkout for the project in question.
        subprocess.check_call(
            ["git", "pull", "--rebase", "-q"],
            cwd=find_path(repository),
        )
    else:
        subprocess.check_call(
            ["git", "clone", f"git@github.com:{full_repository}.git"],
            cwd=os.path.dirname(find_path(repository)),
        )

    subprocess.check_call(["git", "fetch", "-a"], cwd=find_path(repository))
    lower_repo_version = find_last_commit_before_time(repository, branch, lower_time)
    upper_repo_version = find_last_commit_before_time(repository, branch, upper_time)
    process_repo(
        out_dict=out_dict,
        repo_short=repository,
        repo_full=full_repository,
        lower_version=lower_repo_version,
        upper_version=upper_repo_version,
    )

# Sorting based on number of commits
grand_total = 0
for committer_name, commit_count in sorted(
    out_dict.items(), key=lambda item: item[1], reverse=not args.ascending
):
    print(str(commit_count) + "\t" + committer_name)
    grand_total += commit_count

print(f"Excluded {bot_commits} commits authored by bots.")
print(
    f"{grand_total} total commits by {len(out_dict)} contributors between "
    f"{lower_zulip_version} and {upper_zulip_version}."
)
```

--------------------------------------------------------------------------------

---[FILE: update-prod-static]---
Location: zulip-main/tools/update-prod-static

```text
#!/usr/bin/env python3

# Updates static files for production.
import os
import sys

# We need settings so we can figure out where the prod-static directory is.
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from scripts.lib.setup_path import setup_path

setup_path()

# check for the venv
from tools.lib import sanity_check

sanity_check.check_venv(__file__)

os.environ["DJANGO_SETTINGS_MODULE"] = "zproject.settings"
os.environ["ZULIP_COLLECTING_STATIC"] = "1"
from django.conf import settings

from scripts.lib.node_cache import setup_node_modules
from scripts.lib.zulip_tools import assert_not_running_as_root, run

assert_not_running_as_root()


os.chdir(settings.DEPLOY_ROOT)

# Install node packages
setup_node_modules(production=True)

# Build emoji
run(["./tools/setup/emoji/build_emoji"])

# Copy over static files from the zulip_bots and integrations packages
run(["./tools/setup/generate_bots_integrations_static_files.py"])

# Build pygments data
run(["./tools/setup/build_pygments_data"])

# Build time zone data
run(["./tools/setup/build_timezone_values"])

# Generate landing page images of various sizes and formats if we will
# need them.
if settings.CORPORATE_ENABLED:
    run(["./tools/setup/generate_landing_page_images.py"])
    run(
        [
            "./tools/build-help-center",
            "--no-relative-links",
            "--out-dir",
            "./dist_no_relative_links",
        ]
    )

run(["./tools/build-help-center"])

# Create webpack bundle
run(["./tools/webpack", "--quiet"])

# Collect the files that we're going to serve; this creates prod-static/serve.
run(["./manage.py", "collectstatic", "-v0", "--noinput"])

# Compile translation strings to generate `.mo` files.
run(["./manage.py", "compilemessages", "-v0", "--ignore=*"])

# Needed if PRODUCTION
os.makedirs("prod-static", exist_ok=True)
```

--------------------------------------------------------------------------------

---[FILE: update-zuliprc-api-field]---
Location: zulip-main/tools/update-zuliprc-api-field

```text
#!/usr/bin/env python3

"""
This tool is for updating API key field `zuliprc` files of dummy users
in development environment, with the correct keys from the database.
Ensure running this outside of vagrant environment.
Usage:
./tools/update-zuliprc-api-field /path/to/zuliprc_dev
"""

import argparse
import configparser
import os
import shlex
import subprocess
import sys

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ZULIP_PATH)
from scripts.lib.zulip_tools import is_vagrant_env_host

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument(
    "path", metavar="FILE", nargs="+", help="config file of dummy users in development server"
)
args = parser.parse_args()

zuliprc_paths_list = args.path
for zuliprc_path in zuliprc_paths_list:
    zuliprc = configparser.ConfigParser()
    result = ""
    try:
        with open(zuliprc_path) as f:
            zuliprc.read_file(f, zuliprc_path)
        api_details = zuliprc["api"]
        email = api_details["email"]
        key = api_details["key"]
        site = api_details["site"]
        if "localhost" not in site:
            result = "ABORTED"
            reason = "Script to be used for development server config files only"
    except (KeyError, configparser.MissingSectionHeaderError):
        result = "FAILURE"
        reason = "Could not parse file due to missing required fields/sections"
    except FileNotFoundError:
        result = "ABORTED"
        reason = "No zuliprc file found at specified path"

    if result not in ("ABORTED", "FAILURE"):
        # Make sure the cwd is the root of Zulip checkout.
        os.chdir(ZULIP_PATH)

        if is_vagrant_env_host(ZULIP_PATH):
            arguments = [
                "vagrant",
                "ssh",
                "--command",
                "./manage.py print_initial_password " + shlex.quote(email),
            ]
        else:
            # Support users who don't have vagrant based setup
            arguments = ["./manage.py", "print_initial_password", email]
        # We redirect 'stderr' to 'stdout' to avoid 'Connection to 127.0.0.1 closed'
        # appearing after this script finishes.
        output = subprocess.check_output(arguments, stderr=subprocess.STDOUT, text=True)
        new_key = output.split()[6]

        if new_key != key:
            try:
                zuliprc.set("api", "key", new_key)
                with open(zuliprc_path, "w+") as w:
                    zuliprc.write(w)
                result = "SUCCESS"
                reason = f"API field updated for user {email}"
            except OSError:
                result = "FAILURE"
                reason = "Writing to file unsuccessful"
        else:
            result = "SUCCESS"
            reason = f"API key for user {email} is already consistent"
    print(f"{zuliprc_path}: {result}: {reason}")
```

--------------------------------------------------------------------------------

---[FILE: upload-release]---
Location: zulip-main/tools/upload-release

```text
#!/usr/bin/env python3
import argparse
import hashlib
import os
import re
import sys
import tempfile
from typing import IO, cast

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from scripts.lib.setup_path import setup_path

setup_path()

import boto3.session
from mypy_boto3_s3 import S3Client
from natsort import natsorted


def sha256_contents(f: IO[bytes]) -> str:
    sha256_hash = hashlib.sha256()
    for byte_block in iter(lambda: f.read(4096), b""):
        sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()


parser = argparse.ArgumentParser(description="Upload a Zulip release")
parser.add_argument(
    dest="filename",
    help="Tarball to upload",
    metavar="FILE",
)
args = parser.parse_args()
if not os.path.exists(args.filename):
    parser.error(f"File does not exist: {args.filename}")
new_basename = os.path.basename(args.filename)
if not new_basename.startswith("zulip-server-") or not new_basename.endswith(".tar.gz"):
    parser.error("File does not match zulip-server-*.tar.gz")

session = boto3.session.Session()
client: S3Client = session.client("s3")
bucket = session.resource("s3", region_name="us-east-1").Bucket("zulip-download")

file_hashes: dict[str, str] = {}
with open(args.filename, "rb") as new_file:
    print(f"Hashing {new_basename}..")
    file_hashes[new_basename] = sha256_contents(new_file)

print("Fetching existing hashes..")
for obj_summary in bucket.objects.filter(Prefix="server/zulip-server-"):
    head = client.head_object(Bucket=bucket.name, Key=obj_summary.key)
    assert obj_summary.key.startswith("server/")
    filename = obj_summary.key.removeprefix("server/")
    if filename in file_hashes:
        print(f"  {filename} was already uploaded, skipping existing hash")
        continue
    metadata = head["Metadata"]
    if "sha256sum" not in metadata:
        print(f"  {filename} does not have SHA256 metadata!")
        with tempfile.TemporaryFile() as obj_contents:
            print("    Downloading..")
            bucket.download_fileobj(Key=obj_summary.key, Fileobj=obj_contents)
            obj_contents.seek(0)
            print("    Hashing..")
            metadata["sha256sum"] = sha256_contents(obj_contents)
            print(f"    Got {metadata['sha256sum']}")

        print("    Updating..")
        obj_summary.copy_from(
            ContentType=head["ContentType"],
            CopySource=f"{bucket.name}/{obj_summary.key}",
            Metadata=metadata,
            MetadataDirective="REPLACE",
        )

    file_hashes[filename] = metadata["sha256sum"]

ordered_filenames = cast(list[str], natsorted(file_hashes.keys(), reverse=True))
assert ordered_filenames[0] == "zulip-server-latest.tar.gz"

print(f"Uploading {new_basename}..")
extra = {
    "Metadata": {"sha256sum": file_hashes[new_basename]},
    "ACL": "public-read",
    "ContentType": "application/gzip",
}
bucket.upload_file(
    Filename=args.filename,
    Key=f"server/{new_basename}",
    ExtraArgs=extra,
)

if (
    next(name for name in ordered_filenames if re.match(r"^zulip-server-(\d+\.\d+)\.tar.gz$", name))
    == new_basename
):
    print("This looks like the most recent full release; copying to zulip-server-latest.tar.gz..")
    bucket.copy(
        CopySource={"Bucket": bucket.name, "Key": f"server/{new_basename}"},
        Key="server/zulip-server-latest.tar.gz",
        ExtraArgs=extra,
    )
    file_hashes["zulip-server-latest.tar.gz"] = file_hashes[new_basename]
else:
    print("Not copying to zulip-server-latest.tar.gz!")

print("Updating SHA256SUMS.txt..")
contents = ""
for ordered_filename in ordered_filenames:
    # natsorted type annotation is insufficiently generic
    assert isinstance(ordered_filename, str)
    contents += f"{file_hashes[ordered_filename]}  {ordered_filename}\n"
bucket.put_object(
    ACL="public-read",
    Body=contents.encode(),
    ContentType="text/plain",
    Key="server/SHA256SUMS.txt",
)
```

--------------------------------------------------------------------------------

---[FILE: webpack]---
Location: zulip-main/tools/webpack

```text
#!/usr/bin/env python3
import argparse
import json
import os
import subprocess
import sys
from typing import NoReturn

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

os.chdir(os.path.join(os.path.dirname(__file__), "../web"))


from scripts.lib.zulip_tools import get_config, get_config_file
from version import ZULIP_VERSION

webpack_command = ["node", "../node_modules/webpack-cli/bin/cli.js"]


def build_for_prod_or_puppeteer(quiet: bool, config_name: str | None = None) -> NoReturn:
    """Builds for production, writing the output to disk"""

    with open("/proc/meminfo") as meminfo:
        if int(next(meminfo).split()[1]) < 3 * 1024 * 1024:
            os.environ["NODE_OPTIONS"] = "--max-old-space-size=1536"
    webpack_args = [
        *webpack_command,
        "build",
        "--disable-interpret",
        "--mode=production",
        f"--env=ZULIP_VERSION={ZULIP_VERSION}",
    ]
    if quiet:
        webpack_args += ["--stats=errors-only"]
    if config_name is not None:
        webpack_args += [f"--config-name={config_name}"]
    if "PUPPETEER_TESTS" in os.environ:
        webpack_args.append("--env=puppeteer_tests")
    else:
        custom_5xx_file = get_config(get_config_file(), "application_server", "5xx_file")
        if custom_5xx_file is not None:
            webpack_args.append(f"--env=custom_5xx_file={custom_5xx_file}")

    # Silence warnings from "browserslist" about using old data; those
    # warnings are only useful for development
    os.environ["BROWSERSLIST_IGNORE_OLD_DATA"] = "1"

    os.execvp(webpack_args[0], webpack_args)


def build_for_dev_server(host: str, port: str, minify: bool, disable_host_check: bool) -> None:
    """watches and rebuilds on changes, serving files from memory via webpack-dev-server"""

    # This is our most dynamic configuration, which we use for our
    # dev server.  The key piece here is that we identify changes to
    # files as devs make edits and serve new assets on the fly.
    webpack_args = [
        *webpack_command,
        "serve",
        "--disable-interpret",
        # webpack-cli has a bug where it ignores --watch-poll with
        # multi-config, and we don't need the katex part anyway.
        "--config-name=frontend",
        f"--host={host}",
        f"--port={port}",
        # We add the hot flag using the cli because it takes care
        # of addition to entry points and adding the plugin
        # automatically
        "--hot",
    ]
    if minify:
        webpack_args.append("--env=minimize")
    if disable_host_check:
        webpack_args.append("--allowed-hosts=all")
    else:
        webpack_args.append(f"--allowed-hosts={host},.zulipdev.com,.zulipdev.org")

    # Tell webpack-dev-server to fall back to periodic polling on
    # filesystems where inotify is known to be broken.
    cwd = os.getcwd()
    inotify_broken = False
    with open("/proc/self/mounts") as mounts:
        for line in mounts:
            fields = line.split()
            if fields[1] == cwd:
                inotify_broken = fields[2] in ["nfs", "vboxsf", "prl_fs"]
    if inotify_broken:
        os.environ["CHOKIDAR_USEPOLLING"] = "1"
        os.environ["CHOKIDAR_INTERVAL"] = "1000"

    # TODO: This process should also fall back to periodic polling if
    # inotify_broken.
    import pyinotify

    try:
        webpack_process = subprocess.Popen(webpack_args)

        class WebpackConfigFileChangeHandler(pyinotify.ProcessEvent):
            def process_default(self, event: pyinotify.Event) -> None:
                nonlocal webpack_process
                print("Restarting webpack-dev-server due to config changes...")
                webpack_process.terminate()
                webpack_process.wait()
                webpack_process = subprocess.Popen(webpack_args)

        watch_manager = pyinotify.WatchManager()
        event_notifier = pyinotify.Notifier(watch_manager, WebpackConfigFileChangeHandler())
        # We did a chdir to the root of the Zulip checkout above.
        for filepath in [
            "webpack.config.ts",
            "webpack.assets.json",
            "webpack.dev-assets.json",
        ]:
            watch_manager.add_watch(filepath, pyinotify.IN_MODIFY)
        event_notifier.loop()
    finally:
        webpack_process.terminate()
        webpack_process.wait()


def build_for_most_tests() -> None:
    """Generates a stub asset stat file for django so backend test can render a page"""

    # Tests like test-backend, test-api, and test-home-documentation use
    # our "test" configuration.  The one exception is Puppeteer, which uses
    # our production configuration.
    #
    # It's not completely clear why we don't also use the same
    # configuration for ALL tests, but figuring out the full history here
    # was out of the scope of the effort here to add some comments and
    # clean up names.
    with open("webpack.assets.json") as json_data:
        entries = json.load(json_data)

    with open("webpack.dev-assets.json") as json_data:
        entries.update(json.load(json_data))

    stat_data = {
        "status": "done",
        "chunks": {entry: [f"{entry}-stubentry.js"] for entry in entries},
    }
    directory = "../var"
    if not os.path.exists(directory):
        os.makedirs(directory)
    with open(os.path.join(directory, "webpack-stats-test.json"), "w") as outfile:
        json.dump(stat_data, outfile)


parser = argparse.ArgumentParser()
parser.add_argument(
    "--test",
    action="store_true",
    help="generate a stub webpack-stats.json file (for backend testing)",
)
parser.add_argument("--quiet", action="store_true", help="Minimizes webpack output while running")
parser.add_argument(
    "--watch", action="store_true", help="watch for changes to source files (for development)"
)
parser.add_argument(
    "--host", default="127.0.0.1", help="set the host for the webpack server to run on"
)
parser.add_argument("--port", default="9994", help="set the port for the webpack server to run on")
parser.add_argument(
    "--minify", action="store_true", help="Minify and optimize the assets (for development)"
)
parser.add_argument(
    "--disable-host-check", action="store_true", help="Disable host check for webpack-dev-server"
)
parser.add_argument("--config-name", help="Limit production building to only one config-name")

args = parser.parse_args()
if "PUPPETEER_TESTS" in os.environ:
    build_for_prod_or_puppeteer(args.quiet)
elif args.test:
    build_for_most_tests()
elif args.watch:
    build_for_dev_server(args.host, args.port, args.minify, args.disable_host_check)
else:
    build_for_prod_or_puppeteer(args.quiet, args.config_name)
```

--------------------------------------------------------------------------------

---[FILE: zanitizer]---
Location: zulip-main/tools/zanitizer

```text
#!/usr/bin/perl

# usage:
# git clone --bare git@git.zulip.net:eng/zulip.git
# cd zulip.git
# git fast-export --export-marks=../zulip.em --progress=1000 --all > ../zulip.fe
# git init --bare ../zulip-zanitized.git
# cd ../zulip-zanitized.git
# zanitizer ../zulip.fe ../zulip.em | git fast-import --quiet

use strict;
use warnings;

use Digest::SHA qw(sha1_hex);
use FindBin;

use lib $FindBin::Bin;
use zanitizer_config;

sub eq_tree {
    my ( $a, $b ) = @_;
    !( grep { !exists $$b{$_} || $$a{$_} ne $$b{$_} } keys %$a )
      && !( grep { !exists $$a{$_} } keys %$b );
}

my ( $fast_export_file, $export_marks_file ) = @ARGV;

my %export_marks = ();
if ( defined $export_marks_file ) {
    open EXPORT_MARKS, '<', $export_marks_file
      or die "cannot open $export_marks_file: $!";
    %export_marks = map { split } <EXPORT_MARKS>;
    close EXPORT_MARKS;
}

my %mark_map      = ();
my %blob_mark     = ();
my %ref_commit    = ();
my %commit_tree   = ();
my %scrubbed_blob = ();
my %scrubbed_file = ();
my %deleted_file  = ();
my %renamed_file  = ();

open FAST_EXPORT, '<', $fast_export_file
  or die "cannot open $fast_export_file: $!";
$_ = <FAST_EXPORT>;
while ( defined $_ ) {
    if ( $_ eq "blob\n" ) {
        my ($mark) = <FAST_EXPORT> =~ /^mark (\S*)\n$/s or die;
        my ($len)  = <FAST_EXPORT> =~ /^data (\d+)\n$/s or die;
        read( FAST_EXPORT, my $data, $len ) == $len or die;
        $_ = $data;
        scrub_text;
        if ( $_ ne $data ) {
            $scrubbed_blob{$mark} = 1;
            $data = $_;
        }
        <FAST_EXPORT> eq "\n" or die;

        my $hash = sha1_hex($data);
        if ( exists $blob_mark{$hash} ) {
            $mark_map{$mark} = $blob_mark{$hash};
        }
        else {
            $blob_mark{$hash} = $mark_map{$mark} = $mark;
            print "blob\nmark $mark\ndata ", length $data, "\n", $data, "\n";
        }
    }
    elsif (/^reset (?'ref'.*)\n$/s) {
        my $ref = $+{ref};
        $_ = <FAST_EXPORT>;
        my $from = undef;
        while (1) {
            if ( $_ eq "\n" ) {
                $_ = <FAST_EXPORT>;
                last;
            }
            elsif ( my ($from_) = /^from (?'from'.*)\n$/s ) {
                $from = $+{from};
            }
            else {
                # The trailing LF on reset is optional
                last;
            }
            $_ = <FAST_EXPORT>;
        }

        $ref_commit{$ref} = $mark_map{from};
        print "reset $ref\n";
        print "from $mark_map{$from}\n"
          if defined $from && defined $mark_map{$from};
        print "\n";

        next;
    }
    elsif (/^commit (?'ref'.*)\n$/s) {
        my $ref         = $+{ref};
        my ($mark)      = <FAST_EXPORT> =~ /^mark (\S*)\n$/s     or die;
        my ($author)    = <FAST_EXPORT> =~ /^author (.*)\n$/s    or die;
        my ($committer) = <FAST_EXPORT> =~ /^committer (.*)\n$/s or die;
        my ($len)       = <FAST_EXPORT> =~ /^data (\d+)\n$/s     or die;
        read FAST_EXPORT, my ($data), $len;
        $_ = <FAST_EXPORT>;
        my $from = undef;

        if (/^from (?'from'.*)\n$/s) {
            $from = $+{from};
            $_    = <FAST_EXPORT>;
        }
        my $base  = defined $from ? $mark_map{$from} : $ref_commit{ref};
        my @merge = ();
        while (/^merge (?'mark'\S*)\n$/s) {
            die "unimplemented case" if !defined $from;
            push @merge, $+{mark};
            $_ = <FAST_EXPORT>;
        }

        # git fast-export incorrectly writes M before D when replacing
        # a symlink with a directory.  We move every D before every M
        # to work around this bug.
        my @delete = ();
        my @modify = ();
        while (1) {
            if ( $_ eq "\n" ) {
                last;
            }
            elsif (/^D (?'file'.*)\n$/s) {
                $_ = $+{file};
                scrub_filename;
                push @delete, { %+, file => $_ } if defined $_;
            }
            elsif (/^M (?'mode'\d+) (?'mark'\S+) (?'file'.*)\n$/s) {
                $_ = $+{file};
                scrub_filename;
                if ( defined $_ ) {
                    $renamed_file{ $+{file} } = $_ if $_ ne $+{file};
                    $scrubbed_file{$_} = 1 if exists $scrubbed_blob{ $+{mark} };
                    push @modify, { %+, file => $_ };
                }
                else {
                    $deleted_file{ $+{file} } = 1;
                }
            }
            else {
                die "unhandled command in commit: $_";
            }
            $_ = <FAST_EXPORT>;
        }
        my $base_tree = defined $base ? $commit_tree{$base} : {};
        my %tree      = %$base_tree;
        delete $tree{ $$_{file} } for @delete;
        $tree{ $$_{file} } = "$$_{mode} $mark_map{$$_{mark}}" for @modify;

        if ( eq_tree( \%tree, $base_tree )
            && !( grep { defined $mark_map{$_} } @merge ) )
        {
            $ref_commit{$ref} = $mark_map{$mark} = $base;
        }
        else {
            $ref_commit{$ref}   = $mark_map{$mark} = $mark;
            $commit_tree{$mark} = \%tree;
            $_                  = $data;
            scrub_text;
            if ( exists $export_marks{$mark} ) {
                $_ .= "\n" until /\n\n$/;
                $_ .= "(imported from commit $export_marks{$mark})\n";
            }
            print
"commit $ref\nmark $mark\nauthor $author\ncommitter $committer\ndata ",
              length $_, "\n", $_;
            if ( defined $from ) {
                die "unimplemented case" if !defined $mark_map{$from};
                print "from $mark_map{$from}\n";
            }
            for (@merge) {
                print "merge $mark_map{$_}\n" if defined $mark_map{$_};
            }
            print "D $$_{file}\n"                                for @delete;
            print "M $$_{mode} $mark_map{$$_{mark}} $$_{file}\n" for @modify;
            print "\n";
        }
    }
    elsif (/^progress /) {
        print $_;
    }
    else {
        die "unhandled command: $_";
    }
    $_ = <FAST_EXPORT>;
}
close FAST_EXPORT;

print STDERR "Deleted files:\n";
print STDERR "  $_\n" for sort keys %deleted_file;
print STDERR "Renamed files:\n";
print STDERR "  $_ => $renamed_file{$_}\n" for sort keys %renamed_file;
print STDERR "Scrubbed files:\n";
print STDERR "  $_\n" for sort keys %scrubbed_file;
```

--------------------------------------------------------------------------------

---[FILE: zanitizer_config.pm.sample]---
Location: zulip-main/tools/zanitizer_config.pm.sample

```text
use strict;
use warnings;

sub scrub_text {
    return if /^\x89PNG/ || /^PK\x03\x04/;

    s/opensesame/xxxxxxxxxx/g;
    s/hunter2/xxxxxxx/g;
}

sub scrub_filename {
    if ( m%^secret-directory/% || m%settings\.ini$% ) {
        undef $_;
    }
    else {
        s/bruce/batman/g;
    }
}

1;
```

--------------------------------------------------------------------------------

---[FILE: .gitattributes]---
Location: zulip-main/tools/ci/.gitattributes

```text
success-http-headers.template.txt eol=crlf
```

--------------------------------------------------------------------------------

---[FILE: activate-venv]---
Location: zulip-main/tools/ci/activate-venv

```text
#!/usr/bin/env bash

ZULIP_PATH="$(dirname "${BASH_SOURCE[0]}")/../.."
source "$ZULIP_PATH/.venv/bin/activate"
source "$ZULIP_PATH"/tools/python-warnings.bash
echo "Using $VIRTUAL_ENV"
```

--------------------------------------------------------------------------------

---[FILE: build-docker-images]---
Location: zulip-main/tools/ci/build-docker-images

```text
#!/usr/bin/env bash
set -eux
cd "$(dirname "${BASH_SOURCE[0]}")"
docker build . --build-arg=BASE_IMAGE=ubuntu:22.04 --pull --tag=zulip/ci:jammy
docker build . --build-arg=BASE_IMAGE=ubuntu:24.04 --pull --tag=zulip/ci:noble
docker build . --build-arg=BASE_IMAGE=debian:12 --pull --tag=zulip/ci:bookworm
docker build . --build-arg=BASE_IMAGE=debian:13 --pull --tag=zulip/ci:trixie
```

--------------------------------------------------------------------------------

---[FILE: check-executables]---
Location: zulip-main/tools/ci/check-executables

```text
#!/usr/bin/env bash
set -euo pipefail
files="$(git ls-tree -r @ | sed -n 's/^100755 blob \S\+\t//p' | xargs -r grep -Lz '^#!' --)" || [ $? = 123 ]
if [ "$files" ]; then
    echo 'error: non-scripts should not be marked executable (fix with chmod -x):'
    echo
    printf '%s\n' "$files"
    exit 1
fi
```

--------------------------------------------------------------------------------

---[FILE: Docker-prod-8.0.diff]---
Location: zulip-main/tools/ci/Docker-prod-8.0.diff

```text
diff --git scripts/setup/apt-repos/zulip/custom.sh scripts/setup/apt-repos/zulip/custom.sh
index be7c780b7e..ee363c7d65 100755
--- scripts/setup/apt-repos/zulip/custom.sh
+++ scripts/setup/apt-repos/zulip/custom.sh
@@ -2,7 +2,6 @@
 set -euo pipefail
 
 if [[ ! -e /usr/share/doc/groonga-apt-source/copyright ]]; then
-    arrow_keyring=$(readlink -f "$LIST_PATH/apache-arrow-keyring.gpg")
     pgroonga_apt_sign_key=$(readlink -f "$LIST_PATH/pgroonga-packages.groonga.org.asc")
 
     remove_pgroonga_apt_tmp_dir() {
@@ -28,16 +27,6 @@ if [[ ! -e /usr/share/doc/groonga-apt-source/copyright ]]; then
             read -r release
         } <<<"$os_info"
 
-        if [ "$distribution" = debian ] && [ "$release" = bookworm ]; then
-            # As of Debian 12, the Groonga repository depends on the
-            # Apache Arrow repository.
-            arrow_apt_source_deb="apache-arrow-apt-source-latest-$release.deb"
-            arrow_apt_source_deb_sign="$arrow_apt_source_deb.asc"
-            curl -fLO --retry 3 "https://apache.jfrog.io/artifactory/arrow/$distribution/$arrow_apt_source_deb"
-            curl -fLO --retry 3 "https://apache.jfrog.io/artifactory/arrow/$distribution/$arrow_apt_source_deb_sign"
-            gpgv --keyring="$arrow_keyring" "$arrow_apt_source_deb_sign" "$arrow_apt_source_deb"
-        fi
-
         groonga_apt_source_deb="groonga-apt-source-latest-$release.deb"
         groonga_apt_source_deb_sign="$groonga_apt_source_deb.asc.$pgroonga_apt_sign_key_fingerprint"
         curl -fLO --retry 3 "https://packages.groonga.org/$distribution/$groonga_apt_source_deb"
@@ -53,9 +42,6 @@ if [[ ! -e /usr/share/doc/groonga-apt-source/copyright ]]; then
         #   accessed by user '_apt'. - pkgAcquire::Run (13: Permission denied)
         chown _apt .
 
-        if [ "$distribution" = debian ] && [ "$release" = bookworm ]; then
-            apt-get -y install "./$arrow_apt_source_deb"
-        fi
         apt-get -y install "./$groonga_apt_source_deb"
     }
     touch "$STAMP_FILE"
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile]---
Location: zulip-main/tools/ci/Dockerfile

```text
# Dockerfile for a generic Debian/Ubuntu image with just the basics we
# need to make it suitable for CI.  In particular:
#  * a non-root user to run as (a pain to try to do in setup,
#    because by then we've already cloned the repo);
#  * Git and other basic utilities.

# To rebuild from this file for a given release, say Ubuntu 22.04 jammy:
#   docker build . --build-arg=BASE_IMAGE=ubuntu:22.04 --pull --tag=zulip/ci:jammy
#   docker push zulip/ci:jammy
#
# tools/ci/build-docker-images will rebuild all images, but not push them.

ARG BASE_IMAGE
FROM $BASE_IMAGE

RUN ln -sf /usr/share/zoneinfo/Etc/UTC /etc/localtime

# Set the locale.
ENV LC_ALL C.UTF-8

# Extra packages used by Zulip.
RUN apt-get update \
  && apt-get -y install --no-install-recommends \
    build-essential \
    ca-certificates \
    curl \
    gettext \
    git \
    hunspell-en-us \
    jq \
    libffi-dev \
    libfreetype6-dev \
    libjpeg-dev \
    libldap2-dev \
    libpq-dev \
    libssl-dev \
    libxml2-dev \
    libxslt1-dev \
    locales \
    memcached \
    moreutils \
    puppet \
    python3-dev \
    python3-pip \
# We do not pre-install rabbitmq-server, as doing so fixes the
# nodename to be the current hostname, which varies.  Letting Zulip
# install rabbitmq allows it to fix the nodename to 'localhost'.
    redis-server \
    sudo \
    supervisor \
    unzip \
    xvfb \
    zlib1g-dev

ARG USERNAME=github
RUN groupadd --gid 1001 $USERNAME \
  && useradd --uid 1001 --gid $USERNAME --shell /bin/bash --create-home $USERNAME \
  && echo "$USERNAME ALL = (ALL) NOPASSWD: ALL" >> /etc/sudoers.d/50-$USERNAME \
  && echo 'Defaults    env_keep += "DEBIAN_FRONTEND"' >> /etc/sudoers.d/env_keep

USER $USERNAME

CMD ["/bin/sh"]
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile.prod]---
Location: zulip-main/tools/ci/Dockerfile.prod

```text
# To build these production upgrade test images, say an Debian 12 Bookworm system
# preinstalled with Zulip 7.0:
#   docker build --pull . -f Dockerfile.prod \
#     --build-arg=BASE_IMAGE=zulip/ci:bookworm \
#     --build-arg=VERSION=7.0 \
#     --tag=zulip/ci:bookworm-7.0
#   docker push zulip/ci:bookworm-7.0

ARG BASE_IMAGE
FROM $BASE_IMAGE

# Download the release tarball, start rabbitmq server and install the server
ARG VERSION
ADD Docker-prod-8.0.diff /tmp
RUN cd $(mktemp -d) \
  && curl -fLO --retry 3 "https://download.zulip.com/server/zulip-server-$VERSION.tar.gz" \
  && tar -xf "zulip-server-$VERSION.tar.gz" \
  && if [ "$VERSION" = "8.0" ]; then \
         cat /tmp/Docker-prod-8.0.diff | patch -p0 -d "zulip-server-$VERSION"; \
     fi \
  && sudo -s "./zulip-server-$VERSION/scripts/setup/install" --self-signed-cert --hostname 127.0.0.1 --email ci@example.com \
  && sudo service rabbitmq-server stop

CMD ["/bin/sh"]
```

--------------------------------------------------------------------------------

---[FILE: generate-failure-message]---
Location: zulip-main/tools/ci/generate-failure-message

```text
#!/usr/bin/env python3

import os


def get_build_url_from_environment() -> str:
    server = os.environ["GITHUB_SERVER_URL"]
    repo = os.environ["GITHUB_REPOSITORY"]
    run_id = os.environ["GITHUB_RUN_ID"]
    return f"{server}/{repo}/actions/runs/{run_id}"


if __name__ == "__main__":
    branch = os.environ.get("GITHUB_REF", "unknown branch").split("/")[-1]
    topic = f"{branch} failing"
    build_url = get_build_url_from_environment()
    github_actor = os.environ.get("GITHUB_ACTOR", "unknown user")
    content = f"[Build]({build_url}) triggered by {github_actor} on branch `{branch}` has failed."

    # Output in the key-value pair format GitHub Actions outputs are expected
    # to be in.
    print(f"topic={topic}\ncontent={content}")
```

--------------------------------------------------------------------------------

````
