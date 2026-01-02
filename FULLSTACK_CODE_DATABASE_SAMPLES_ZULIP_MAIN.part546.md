---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 546
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 546 of 1290)

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

---[FILE: lint]---
Location: zulip-main/tools/lint

```text
#!/usr/bin/env python3
import argparse
import os
import sys

tools_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.join(tools_dir, "..")
sys.path.insert(0, root_dir)

# check for the venv
from tools.lib import sanity_check

sanity_check.check_venv(__file__)

from zulint.command import LinterConfig, add_default_linter_arguments

from tools.linter_lib.custom_check import non_py_rules, python_rules


def run() -> None:
    from tools.lib.test_script import (
        add_provision_check_override_param,
        assert_provisioning_status_ok,
    )
    from tools.linter_lib.exclude import EXCLUDED_FILES, PUPPET_CHECK_RULES_TO_EXCLUDE

    parser = argparse.ArgumentParser()
    add_provision_check_override_param(parser)
    parser.add_argument("--full", action="store_true", help="Check some things we typically ignore")
    parser.add_argument("--use-mypy-daemon", action="store_true", help="Run mypy daemon instead")
    add_default_linter_arguments(parser)
    args = parser.parse_args()

    os.chdir(root_dir)

    assert_provisioning_status_ok(args.skip_provision_check)

    # Invoke the appropriate lint checker for each language,
    # and also check files for extra whitespace.

    linter_config = LinterConfig(args)

    by_lang = linter_config.list_files(
        groups={
            "backend": [
                "bash",
                "json",
                "md",
                "pp",
                "py",
                "pyi",
                "sh",
                "text",
                "txt",
                "yaml",
                "yml",
            ],
            "frontend": [
                "astro",
                "cjs",
                "css",
                "cts",
                "hbs",
                "html",
                "js",
                "mdx",
                "mjs",
                "mts",
                "svg",
                "ts",
            ],
        },
        exclude=EXCLUDED_FILES,
    )

    linter_config.external_linter(
        "css",
        ["node_modules/.bin/stylelint"],
        ["css"],
        fix_arg="--fix",
        description="Standard CSS style and formatting linter (config: stylelint.config.js)",
    )
    linter_config.external_linter(
        "eslint",
        ["node_modules/.bin/eslint", "--max-warnings=0", "--cache"],
        ["astro", "cjs", "cts", "js", "mdx", "mjs", "mts", "ts"],
        fix_arg="--fix",
        description="Standard JavaScript style and formatting linter (config: eslint.config.js).",
    )
    linter_config.external_linter(
        "puppet",
        ["env", "RUBYOPT=-W0", "puppet", "parser", "validate"],
        ["pp"],
        description="Runs the puppet parser validator, checking for syntax errors.",
    )
    linter_config.external_linter(
        "puppet-lint",
        ["puppet-lint", "--fail-on-warnings", *PUPPET_CHECK_RULES_TO_EXCLUDE],
        ["pp"],
        fix_arg="--fix",
        description="Standard puppet linter (config: tools/linter_lib/exclude.py)",
    )
    linter_config.external_linter(
        "templates",
        ["tools/check-templates"],
        ["hbs", "html"],
        description="Custom linter checks whitespace formatting of HTML templates",
        fix_arg="--fix",
    )
    linter_config.external_linter(
        "openapi",
        ["node", "tools/check-openapi.ts"],
        ["yaml"],
        description="Validates our OpenAPI/Swagger API documentation (zerver/openapi/zulip.yaml) ",
        fix_arg="--fix",
    )
    linter_config.external_linter(
        "shellcheck",
        ["shellcheck", "-x", "-P", "SCRIPTDIR"],
        ["bash", "sh"],
        description="Standard shell script linter",
    )
    linter_config.external_linter(
        "shfmt",
        ["shfmt"],
        ["bash", "sh"],
        check_arg="-d",
        fix_arg="-w",
        description="Formats shell scripts",
    )
    command = ["tools/run-mypy", "--quiet"]
    if args.skip_provision_check:
        command.append("--skip-provision-check")
    if args.use_mypy_daemon:
        command.append("--use-daemon")
    linter_config.external_linter(
        "mypy",
        command,
        ["py", "pyi"],
        pass_targets=False,
        description="Static type checker for Python (config: pyproject.toml)",
        suppress_line=(
            (lambda line: line.startswith("Daemon") or line == "Restarting: configuration changed")
            if args.use_mypy_daemon
            else lambda _: False
        ),
    )
    linter_config.external_linter(
        "ruff",
        ["ruff", "check", "--quiet"],
        ["py", "pyi"],
        fix_arg="--fix",
        description="Python linter",
    )
    linter_config.external_linter(
        "tsc",
        ["tools/run-tsc"],
        ["ts"],
        pass_targets=False,
        description="TypeScript compiler (config: tsconfig.json)",
    )
    linter_config.external_linter(
        "gitlint",
        ["tools/commit-message-lint"],
        description="Checks commit messages for common formatting errors (config: .gitlint)",
    )
    linter_config.external_linter(
        "prettier",
        ["node_modules/.bin/prettier", "--cache", "--check", "--log-level=warn"],
        [
            "astro",
            "cjs",
            "css",
            "cts",
            "flow",
            "js",
            "json",
            "md",
            "mjs",
            "mts",
            "ts",
            "yaml",
            "yml",
        ],
        fix_arg=["--write"],
        description="Formats CSS, JavaScript, YAML",
    )
    linter_config.external_linter(
        "ruff-format",
        ["ruff", "format", "--quiet"],
        ["py", "pyi"],
        description="Reformats Python code",
        check_arg=["--check"],
    )

    semgrep_command = [
        "semgrep",
        "scan",
        "--scan-unknown-extensions",
        "--error",
        "--disable-version-check",
        "--quiet",
    ]
    linter_config.external_linter(
        "semgrep-py",
        [*semgrep_command, "--config=./tools/semgrep-py.yml"],
        ["py"],
        fix_arg="--autofix",
        description="Syntactic grep (semgrep) code search tool (config: ./tools/semgrep-py.yml)",
    )

    linter_config.external_linter(
        "mailmap",
        ["sh", "-c", "grep '^[^#]' .mailmap | LC_ALL=C.UTF-8 sort -cf"],
        description="Check that .mailmap is sorted",
    )
    linter_config.external_linter(
        "thirdparty",
        ["tools/check-thirdparty"],
        description="Check docs/THIRDPARTY copyright file syntax",
    )
    linter_config.external_linter(
        "remark",
        ["node_modules/.bin/remark", "--frail", "--quiet", "--no-stdout"],
        ["mdx"],
        check_arg=['--setting="checkReformatting": true', "--"],
        fix_arg=["--output", "--"],
        description="Lint and format MDX files",
    )

    @linter_config.lint
    def custom_py() -> int:
        """Runs custom checks for python files (config: tools/linter_lib/custom_check.py)"""
        failed = python_rules.check(by_lang, verbose=args.verbose)
        return 1 if failed else 0

    @linter_config.lint
    def custom_nonpy() -> int:
        """Runs custom checks for non-python files (config: tools/linter_lib/custom_check.py)"""
        failed = False
        for rule in non_py_rules:
            failed = failed or rule.check(by_lang, verbose=args.verbose)
        return 1 if failed else 0

    linter_config.do_lint()


if __name__ == "__main__":
    run()
```

--------------------------------------------------------------------------------

---[FILE: merge-api-changelogs]---
Location: zulip-main/tools/merge-api-changelogs

```text
#!/usr/bin/env python3
import os
import subprocess
import sys

TOOLS_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(os.path.dirname(TOOLS_DIR))
sys.path.insert(0, os.path.dirname(TOOLS_DIR))

from zerver.openapi.merge_api_changelogs import (
    get_feature_level,
    get_unmerged_changelogs,
    merge_changelogs,
    remove_unmerged_changelog_files,
    update_feature_level_in_api_docs,
)

if __name__ == "__main__":
    ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(ZULIP_PATH)

    changelogs = get_unmerged_changelogs()
    if changelogs:
        new_feature_level = get_feature_level()
        merge_changelogs(changelogs, new_feature_level)
        update_feature_level_in_api_docs(new_feature_level)
        remove_unmerged_changelog_files()

        commit_message = f"api: Increment API feature level to {new_feature_level}."

        try:
            subprocess.run(["git", "add", "-u"], check=True)
            subprocess.run(["git", "commit", "-m", commit_message], check=True)
        except subprocess.CalledProcessError as e:
            print(e)
            sys.exit(1)
```

--------------------------------------------------------------------------------

---[FILE: notify-if-api-docs-changed]---
Location: zulip-main/tools/notify-if-api-docs-changed

```text
#!/usr/bin/env python3
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from urllib.request import Request, urlopen

TOOLS_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(os.path.dirname(TOOLS_DIR))
sys.path.insert(0, os.path.dirname(TOOLS_DIR))

from zerver.openapi.merge_api_changelogs import get_feature_level


def get_pull_request_number_or_commit_hash() -> str:
    github_token = os.environ["GITHUB_TOKEN"]
    repo = os.environ["GITHUB_REPOSITORY"]
    commit_hash = os.environ["GITHUB_SHA"]

    url = f"https://api.github.com/repos/{repo}/commits/{commit_hash}/pulls"
    headers = {
        "Accept": "application/vnd.github.groot-preview+json",
        "Authorization": f"token {github_token}",
    }

    try:
        req = Request(url, headers=headers)
        with urlopen(req) as response:
            pull_requests = json.load(response)
        if len(pull_requests) > 0:
            return f"#{pull_requests[0]['number']}"
        return commit_hash
    except Exception:
        return commit_hash


def get_changelog_entries() -> str:
    changelog_path = Path("api_docs/changelog.md")
    feature_level_pattern = re.compile(r"\*\*Feature level \d+\*\*")
    current_feature_level_found = False
    changelog_entries = ""

    with open(changelog_path) as file:
        for line in file:
            if re.fullmatch(feature_level_pattern, line.strip()):
                if current_feature_level_found:
                    break
                current_feature_level_found = True
                continue

            if current_feature_level_found:
                changelog_entries += line

    return changelog_entries.replace("\n  ", " ")


def get_feature_level_before_commit() -> int:
    with open(os.environ["GITHUB_EVENT_PATH"]) as f:
        event = json.load(f)

    before_sha = event["before"]
    version_file_path = "version.py"

    try:
        version_content_before_commit = subprocess.check_output(
            ["git", "show", f"{before_sha}:{version_file_path}"], text=True
        )
    except subprocess.CalledProcessError:
        sys.exit(1)

    lines = version_content_before_commit.split("\n")
    for line in lines:
        if line.startswith("API_FEATURE_LEVEL = "):
            match = re.search(r"\d+", line)
            if match:
                return int(match.group())
    return 0


if __name__ == "__main__":
    pull_request = get_pull_request_number_or_commit_hash()

    feature_level = get_feature_level(update_feature_level=False) - 1
    if feature_level <= get_feature_level_before_commit():
        sys.exit(1)

    changelog_entries = get_changelog_entries()
    topic = f"new feature level: {feature_level}"

    content = f"{pull_request} has updated the API documentation for the following endpoints: \n{changelog_entries}"
    github_output = os.environ.get("GITHUB_OUTPUT")
    if github_output:
        with open(github_output, "a") as f:
            f.write(f"topic={topic}\n")
            f.write("content<<EOF\n")
            f.write(f"{content.strip()}\n")
            f.write("EOF\n")
```

--------------------------------------------------------------------------------

---[FILE: pre-commit]---
Location: zulip-main/tools/pre-commit

```text
#!/usr/bin/env bash

# This hook runs the Zulip code linter ./tools/lint and returns true
# regardless of linter results so that your commit may continue.

# Messages from the linter will be printed out to the screen.
#
# If you are running this one machine hosting a Vagrant guest that
# contains your provisioned Zulip development environment, the linter
# will automatically be run through `vagrant ssh`.

changed_files=()
while read -r -d '' f; do
    changed_files+=("$f")
done < <(git diff -z --cached --name-only --diff-filter=ACM)
if [ ${#changed_files} -eq 0 ]; then
    echo "No changed files to lint."
    exit 0
fi

if [ -z "$VIRTUAL_ENV" ] && command -v vagrant >/dev/null && [ -e .vagrant ]; then
    vcmd="/srv/zulip/tools/lint --skip=gitlint --skip-provision-check $(printf '%q ' "${changed_files[@]}") || true"
    echo "Running lint using vagrant..."
    vagrant ssh -c "$vcmd"
else
    ./tools/lint --skip=gitlint --skip-provision-check "${changed_files[@]}" || true
fi
exit 0
```

--------------------------------------------------------------------------------

---[FILE: provision]---
Location: zulip-main/tools/provision

```text
#!/usr/bin/env bash

# Use this script to provision dependencies for your Zulip installation.
# This script is idempotent, so it can be restarted at any time, and it
# will usually run fairly quickly when your dependencies are up to date.

set -e
if [ "$EUID" -eq 0 ]; then
    echo "Error: The provision script must not be run as root" >&2
    exit 1
fi

if [ -e "$(dirname "${BASH_SOURCE[0]}")/../.vagrant" ] && [ ! -e /home/vagrant ]; then
    echo 'Error: provision should be run inside the Vagrant environment.' >&2
    # shellcheck disable=SC2016
    echo 'Try `vagrant up --provision`.' >&2
    exit 1
fi

os="$(. /etc/os-release && echo "$ID $VERSION_ID")"
case "$os" in
    'ubuntu 14.04' | 'ubuntu 16.04' | 'ubuntu 18.04' | 'debian 10')
        echo "Error: $os is no longer a supported platform for Zulip." >&2
        if [ -e /home/vagrant ]; then
            # shellcheck disable=SC2016
            echo 'To upgrade, run `vagrant destroy`, and then recreate the Vagrant guest.' >&2
            echo 'See: https://zulip.readthedocs.io/en/latest/development/setup-recommended.html' >&2
        fi
        exit 1
        ;;
esac

python_version="$(python3 --version)"
case "$python_version" in
    Python\ 3.[0-9].*)
        echo 'Error: Zulip requires an OS with Python 3.10 or later.' >&2
        exit 1
        ;;
esac

FAIL='\033[91m'
WARNING='\033[93m'
ENDC='\033[0m'

# Make the script independent of the location from where it is executed
PARENT_PATH=$(
    cd "$(dirname "${BASH_SOURCE[0]}")/.."
    pwd -P
)
cd "$PARENT_PATH"
mkdir -p var/log
LOG_PATH="var/log/provision.log"

echo "PROVISIONING STARTING." >>$LOG_PATH

# PYTHONUNBUFFERED is important to ensure that tracebacks don't get
# lost far above where they should be in the output.
export PYTHONUNBUFFERED=1
tools/lib/provision.py "$@" 2>&1 | tee -a "$LOG_PATH"
failed=${PIPESTATUS[0]}

if [ "$failed" -ne 0 ]; then
    echo -e "$FAIL"
    echo "Provisioning failed (exit code $failed)!"
    echo
    echo "* Look at the traceback(s) above to find more about the errors."
    echo "* Resolve the errors or get help on chat."
    echo "* If you can fix this yourself, you can re-run tools/provision at any time."
    echo "* Logs are here: zulip/var/log/provision.log"
    echo -e "$ENDC"
    exit "$failed"
elif [ "$VIRTUAL_ENV" != "$PARENT_PATH/.venv" ] && [ -z "${SKIP_VENV_SHELL_WARNING}" ]; then
    echo -e "$WARNING"
    echo "WARNING: This shell does not have the Zulip Python 3 virtualenv activated."
    echo "Zulip commands will fail until you activate the virtualenv."
    echo
    echo "To update the shell, run:"
    echo "    source $PARENT_PATH/.venv/bin/activate"
    # shellcheck disable=SC2016
    echo 'or just close this shell and start a new one (with Vagrant, `vagrant ssh`).'
    echo -en "$ENDC"
fi
exit 0
```

--------------------------------------------------------------------------------

---[FILE: push-to-pull-request]---
Location: zulip-main/tools/push-to-pull-request

```text
#!/usr/bin/env bash
set -e

usage() {
    cat <<EOF
usage: $0 [--merge] PULL_REQUEST_ID [REMOTE]

Force-push our HEAD to the given GitHub pull request branch.

Useful for a maintainer to run just before pushing to main,
after tweaking the branch and/or rebasing to latest.  This causes
GitHub to see the subsequent push to main as representing a
merge of the PR, rather than requiring the PR to be manually
(and to the casual observer misleadingly) closed instead.

With --merge, also go ahead and merge the PR.

REMOTE defaults to the value of the Git config variable
\`zulip.zulipRemote\` if set, else to \`upstream\`.

If we have a pseudo-remote-tracking branch for the PR (as created
by \`reset-to-pull-request\`, like \`pr/1234\`), then the tracking
branch is updated to reflect the pushed version.

See also \`reset-to-pull-request\`.
EOF
}

merge=
args=()

while ((OPTIND <= $#)); do
    if getopts ":-:" opt; then
        case $opt in
            -)
                case "$OPTARG" in
                    help)
                        usage
                        exit 0
                        ;;
                    merge)
                        merge=t
                        ;;
                    *)
                        echo "Invalid option: --$OPTARG" >&2
                        exit 1
                        ;;
                esac
                ;;
            \?)
                echo "Invalid option: -$OPTARG" >&2
                exit 1
                ;;
        esac
    else
        args+=("${!OPTIND}")
        ((OPTIND++))
    fi
done

set -- "${args[@]}"

remote_default="$(git config zulip.zulipRemote || echo upstream)"
pseudo_remote="$(git config zulip.prPseudoRemote || echo)"

pr_id="$1"
remote="${2:-"$remote_default"}"

if [ -z "$pr_id" ]; then
    usage >&2
    exit 1
fi

if ! jq --version >/dev/null 2>&1; then
    cat >&2 <<EOF
error: not found: jq

push-to-pull-request requires the \`jq\` utility; you should install it.
Try:

  sudo apt install jq
EOF
    exit 1
fi

remote_url="$(git remote get-url --push "$remote")"
repo_fq="$(echo "$remote_url" | perl -lne 'print $1 if (
    m, ^ git\@github\.com:
         ([^/]+ / [^/]+?)
         (?:\.git)?
       $ ,x )')"

if [ -z "$repo_fq" ]; then
    # We're pretty specific about what we expect the URL to look like;
    # there are probably more cases we could legitimately cover, which
    # we can add if/when they come up for someone.
    echo "error: couldn't parse remote URL as GitHub repo: $remote_url" >&2
    exit 1
fi

# See https://developer.github.com/v3/pulls/#get-a-single-pull-request .
# This is the old REST API; the new GraphQL API does look neat, but it
# seems to require authentication even for simple lookups of public data,
# and that'd be a pain for a simple script like this.
pr_url=https://api.github.com/repos/"${repo_fq}"/pulls/"${pr_id}"
pr_details="$(curl -fLsS --retry 3 "$pr_url")"

pr_jq() {
    echo "$pr_details" | jq "$@"
}

if [ "$(pr_jq -r .message)" = "Not Found" ]; then
    echo "error: invalid PR URL: $pr_url" >&2
    exit 1
fi

if [ "$(pr_jq .maintainer_can_modify)" != "true" ]; then
    # This happens when the PR has already been merged or closed, or
    # if the contributor has turned off the (default) setting to allow
    # maintainers of the target repo to push to their PR branch.
    #
    # The latter seems to be rare (in Greg's experience doing the
    # manual equivalent of this script for many different
    # contributors, none have ever chosen this setting), but give a
    # decent error message if it does happen.
    echo "error: PR already closed, or contributor has disallowed pushing to branch" >&2
    exit 1
fi

if [ "$merge" ]; then
    pr_base_ref="$(pr_jq -r .base.ref)"
    git fetch -- "$remote"
    if ! git merge-base --is-ancestor -- "$remote/$pr_base_ref" @; then
        echo "error: You need to rebase on $remote/$pr_base_ref first" >&2
        exit 1
    fi
fi

pr_head_repo_fq="$(pr_jq -r .head.repo.full_name)"
pr_head_refname="$(pr_jq -r .head.ref)"

tracking_ref=
if [ -n "$pseudo_remote" ]; then
    tracking_ref=$(git rev-parse -q --verify --symbolic refs/remotes/"$pseudo_remote"/"$pr_id" || echo)
fi

set -x
git push git@github.com:"$pr_head_repo_fq" +@:"$pr_head_refname"

{ set +x; } 2>&-
if [ -n "$tracking_ref" ]; then
    set -x
    git update-ref "$tracking_ref" @
fi

if [ "$merge" ]; then
    tries=10
    sha="$(git rev-parse @)"
    while
        out=$(git ls-remote -- "$remote" "refs/pull/$pr_id/head")
        [ "$out" != "$sha	refs/pull/$pr_id/head" ]
    do
        if ! ((--tries)); then
            echo 'error: Push was not observed in PR' >&2
            exit 1
        fi
        sleep 1
    done
    git push -- "$remote" "@:$pr_base_ref"
fi
```

--------------------------------------------------------------------------------

---[FILE: python-warnings.bash]---
Location: zulip-main/tools/python-warnings.bash

```text
# shellcheck shell=bash

export PYTHONWARNINGS=error

PYTHONWARNINGS+=',ignore::ResourceWarning'

# https://github.com/disqus/django-bitfield/pull/135
PYTHONWARNINGS+=',default:Attribute s is deprecated and will be removed in Python 3.14; use value instead:DeprecationWarning:__main__'

# https://github.com/mahmoud/glom/pull/258
PYTHONWARNINGS+=',ignore:invalid escape sequence '\'\\' '\'':DeprecationWarning'
PYTHONWARNINGS+=',ignore:invalid escape sequence '\'\\' '\'':SyntaxWarning'

# This gets triggered due to our do_patch_activate_script
PYTHONWARNINGS+=',default:Attempting to work in a virtualenv.:UserWarning:IPython.core.interactiveshell'

# https://github.com/SAML-Toolkits/python3-saml/pull/420
PYTHONWARNINGS+=',ignore:datetime.datetime.utcfromtimestamp() is deprecated and scheduled for removal in a future version.:DeprecationWarning:onelogin.saml2.utils'
PYTHONWARNINGS+=',ignore:datetime.datetime.utcnow() is deprecated and scheduled for removal in a future version.:DeprecationWarning:onelogin.saml2.utils'

# https://github.com/python-openapi/openapi-core/issues/931
PYTHONWARNINGS+=',ignore::DeprecationWarning:openapi_core.validation.request.validators'

# https://github.com/seb-m/pyinotify/issues/204
PYTHONWARNINGS+=',ignore:The asyncore module is deprecated and will be removed in Python 3.12.:DeprecationWarning:pyinotify'

# Semgrep still supports Python 3.8
PYTHONWARNINGS+=',ignore:path is deprecated.:DeprecationWarning:semgrep.semgrep_core'

# https://github.com/scrapy/scrapy/issues/3288
PYTHONWARNINGS+=',ignore:Passing method to twisted.internet.ssl.CertificateOptions was deprecated in Twisted 17.1.0.:DeprecationWarning:scrapy.core.downloader.contextfactory'

# https://github.com/scrapy/scrapy/issues/6859
PYTHONWARNINGS+=',ignore:Attempting to mutate a Context after a Connection was created.:DeprecationWarning:scrapy.core.downloader.contextfactory'

# https://github.com/adamchainz/time-machine/pull/486
PYTHONWARNINGS+=',ignore:datetime.datetime.utcnow() is deprecated and scheduled for removal in a future version.:DeprecationWarning:time_machine'

export SQLALCHEMY_WARN_20=1
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: zulip-main/tools/README.md

```text
This directory contains scripts that are used in building, managing,
testing, and other forms of work in a Zulip development environment.
Note that tools that are also useful in production belong in
`scripts/` or should be Django management commands.

For more details, see
https://zulip.readthedocs.io/en/latest/overview/directory-structure.html.
```

--------------------------------------------------------------------------------

---[FILE: rebuild-dev-database]---
Location: zulip-main/tools/rebuild-dev-database

```text
#!/usr/bin/env bash
set -e
set -x

PGHOST=localhost PGUSER=zulip \
    "$(dirname "$0")/../scripts/setup/terminate-psql-sessions" zulip zulip_base

psql -v ON_ERROR_STOP=1 -e -h localhost postgres zulip <<EOF
DROP DATABASE IF EXISTS zulip;
CREATE DATABASE zulip TEMPLATE zulip_base;
EOF

"$(dirname "$0")/../scripts/setup/flush-memcached"

./manage.py purge_queue --all
./manage.py migrate --noinput
./manage.py get_migration_status --settings=zproject.settings --output="migration_status_dev"
./manage.py createcachetable third_party_api_results
./manage.py populate_db -n100 --threads=1
# Ensure that the local user's API key is synced from ~/.zuliprc

if [ -e ~/.zuliprc ]; then
    ./manage.py sync_api_key
fi
```

--------------------------------------------------------------------------------

---[FILE: rebuild-test-database]---
Location: zulip-main/tools/rebuild-test-database

```text
#!/usr/bin/env bash
set -e
set -x

export DJANGO_SETTINGS_MODULE=zproject.test_settings

create_zulip_test() {
    psql -v ON_ERROR_STOP=1 -h localhost postgres zulip_test <<EOF
DROP DATABASE IF EXISTS zulip_test;
CREATE DATABASE zulip_test TEMPLATE zulip_test_base;
EOF
}

create_zulip_test_template() {
    psql -v ON_ERROR_STOP=1 -h localhost postgres zulip_test <<EOF
DROP DATABASE IF EXISTS zulip_test_template;
CREATE DATABASE zulip_test_template TEMPLATE zulip_test;
EOF
}

mkdir -p zerver/tests/fixtures

PGHOST=localhost PGUSER=zulip \
    "$(dirname "$0")/../scripts/setup/terminate-psql-sessions" zulip_test zulip_test_base zulip_test_template

create_zulip_test

"$(dirname "$0")/../scripts/setup/flush-memcached"

./manage.py migrate --noinput
./manage.py get_migration_status --output="migration_status_test"

# This next line can be simplified to "-n0" once we fix our app (and tests) with 0 messages.
./manage.py populate_db --test-suite -n30 --threads=1 \
    --max-topics=3 \
    --direct-message-groups=0 --personals=0 --percent-direct-message-groups=0 --percent-personals=0

./manage.py dumpdata \
    zerver.UserProfile zerver.Stream zerver.Recipient \
    zerver.Subscription zerver.Message zerver.DirectMessageGroup zerver.Realm \
    zerver.UserMessage zerver.Client \
    zerver.DefaultStream >zerver/tests/fixtures/messages.json

# create pristine template database, for fast fixture restoration after tests are run.
create_zulip_test_template
```

--------------------------------------------------------------------------------

---[FILE: release]---
Location: zulip-main/tools/release

```text
#!/usr/bin/env bash
set -eu

cd "$(dirname "$0")/.."

if [ -z "${1:-}" ]; then
    echo "Usage: $0 version"
    exit 1
fi

fail() {
    echo "$1"
    exit 1
}

version="$1"

# Check version is a form we expect
[[ "$version" =~ ^[0-9]+\.[0-9]+(-[a-z0-9]+)?$ ]] \
    || fail "Version $version does not look like a full release!"

# Check we're on `main` or `\d+\.x`
branch=$(git rev-parse --abbrev-ref HEAD)
[ "$branch" == "main" ] || [[ "$branch" =~ ^[0-9]+\.x$ ]] || [ "$branch" == "${version}-branch" ] \
    || fail "Current branch '$branch' is not 'main' or a release branch"

is_prerelease=
if [[ "$version" =~ -[0-9a-z]+$ ]]; then
    is_prerelease=1
fi

is_major_release=
if [[ "$version" =~ ^[0-9]+\.0(-[0-9a-z]+)?$ ]]; then
    [ "$branch" == "main" ] \
        || fail "Did not expect $version to be released from $branch, expected main"
    if [ -z "$is_prerelease" ]; then
        is_major_release=1
    fi
else
    expected_branch="$(echo "$version" | perl -ple 's/\..*/.x/')"
    [ "$branch" == "$expected_branch" ] \
        || fail "Did not expect $version to be released from $branch, expected $expected_branch"
fi

# shellcheck source=lib/git-tools.bash
. "$(dirname "$0")"/lib/git-tools.bash
require_clean_work_tree 'build and upload a release'

# Check the commit message
commit_msg=$(git rev-list --format=%B --max-count=1 HEAD | tail -n +2)
[ "$commit_msg" == "Release Zulip Server $version." ] \
    || fail "Expected commit message: Release Zulip Server $version."

# Provision
echo "Provisioning.."
if ! ./tools/provision >/dev/null; then
    cat var/log/provision.log
    fail "Provisioning failed!"
fi

# Check lint passes for the changelog
./tools/lint --skip gitlint docs/overview/changelog.md \
    || fail "Changelog does not pass lint"
./tools/test-documentation --skip-external-links \
    || fail "Changelog links do not validate"
./tools/run-codespell docs/overview/changelog.md \
    || fail "Changelog does not pass spellcheck"

# Check the date is correct for the release
release_lines=$(grep -x -m 1 -A2 "### Zulip Server $version" docs/overview/changelog.md) \
    || fail "docs/overview/changelog.md does not contain a line for $version"
release_date_line=$(echo "$release_lines" | grep -x -E -m 1 '_Released ([0-9-]+)_') \
    || fail "docs/overview/changelog.md does not contain the release date for $version"
expected_date="$(TZ=America/Los_Angeles date +%F)"
[ "$release_date_line" == "_Released ${expected_date}_" ] \
    || fail "Date in docs/overview/changelog.md does not match '$expected_date'"

extract_version() {
    python3 -c 'import sys, version; print(getattr(version, sys.argv[1]))' "$1"
}

# Check ZULIP_VERSION and LATEST_RELEASE_VERSION are set appropriately
[ "$(extract_version "ZULIP_VERSION")" == "$version" ] \
    || fail "ZULIP_VERSION in version.py does not match $version"

if [ -z "$is_prerelease" ]; then
    [ "$(extract_version "LATEST_RELEASE_VERSION")" == "$version" ] \
        || fail "LATEST_RELEASE_VERSION in version.py does not match $version"

    if [ -n "$is_major_release" ]; then
        [ "$(extract_version "LATEST_MAJOR_VERSION")" == "$version" ] \
            || fail "LATEST_MAJOR_VERSION in version.py does not match $version"

        # Check that there is an API version bump, which is documented
        changed_api_level=$(git diff-tree -G API_FEATURE_LEVEL HEAD -- version.py)
        [ -n "$changed_api_level" ] || fail "$version did not adjust API_FEATURE_LEVEL in version.py"
        feature_level="$(extract_version "API_FEATURE_LEVEL")"
        grep -q -F -x "**Feature level $feature_level**" api_docs/changelog.md \
            || fail "Feature level $feature_level is not documented in api_docs/changelog.md"
    fi
fi

# Check we are auth'd to Github, so we can upload the release
type gh >/dev/null 2>&1 \
    || fail "The 'gh' CLI tool is not installed; see https://cli.github.com/"
gh auth status \
    || fail "Not authenticated to github"

# Extract the changelog, print it
changelog_anchor="zulip-server-${version//./-}"
changelog=$(VERSION="$version" perl -nle '$v=quotemeta($ENV{VERSION}); print if $rc = /^### Zulip Server $v/ .. /^#{1,3} Zulip Server (?!$v)/ and $rc !~ /E0/' docs/overview/changelog.md)
echo "$changelog"

echo -e "\n\n(pausing for 15s, ^C to cancel)"
sleep 15

git tag "$version"

OUTPUT_DIR=$(mktemp -d)
export OUTPUT_DIR

./tools/build-release-tarball "$version"

TARBALL="$OUTPUT_DIR/zulip-server-$version.tar.gz"
if ! [ -f "$TARBALL" ]; then
    echo "Did not find expected $TARBALL!"
    exit 1
fi

./tools/upload-release "$TARBALL"

# Push the commits
remote="$(git config zulip.zulipRemote)" || remote=upstream
git push "$remote" "$branch:$branch"
git push "$remote" "$version"

# Upload to Github
params=()
if [ -n "$is_prerelease" ]; then
    params+=("--prerelease")
fi
gh release create "$version" \
    --title "Zulip Server $version" \
    --notes "[Complete release notes](https://zulip.readthedocs.io/en/latest/overview/changelog.html#${changelog_anchor})" \
    "${params[@]}" \
    "$TARBALL"
```

--------------------------------------------------------------------------------

---[FILE: release-tarball-exclude.txt]---
Location: zulip-main/tools/release-tarball-exclude.txt

```text
.gitignore
.gitattributes
corporate/
static/
web/
tools/
zilencer/
templates/corporate
templates/zilencer
puppet/kandra
zproject/dev_settings.py
zproject/test_settings.py
zerver/tests
starlight_help/
```

--------------------------------------------------------------------------------

---[FILE: renumber-migrations]---
Location: zulip-main/tools/renumber-migrations

```text
#!/usr/bin/env python3
import fileinput
import glob
import os
import re
import sys


def validate_order(order: list[int], length: int) -> None:
    if len(order) != length:
        print("Please enter the sequence of all the conflicting files at once")
        sys.exit(1)

    for i in order:
        if i > length or i < 1 or order.count(i) > 1:
            print("Incorrect input")
            sys.exit(1)


def renumber_migration(conflicts: list[str], order: list[int], last_correct_migration: str) -> None:
    stack: list[str] = []
    for i in order:
        if conflicts[i - 1][0:4] not in stack:
            stack.append(conflicts[i - 1][0:4])
        else:
            # Replace dependencies with the last correct migration
            with fileinput.FileInput("zerver/migrations/" + conflicts[i - 1], inplace=True) as file:
                for line in file:
                    print(re.sub(r"[\d]+(_[a-z0-9]+)+", last_correct_migration, line), end="")

            # Rename the migration indexing at the end
            new_name = conflicts[i - 1].replace(
                conflicts[i - 1][0:4], f"{int(last_correct_migration[0:4]) + 1:04}"
            )
            os.rename("zerver/migrations/" + conflicts[i - 1], "zerver/migrations/" + new_name)

            last_correct_migration = new_name.replace(".py", "")


def resolve_conflicts(conflicts: list[str], files_list: list[str]) -> None:
    print("Conflicting migrations:")
    for i in range(len(conflicts)):
        print(str(i + 1) + ". " + conflicts[i])

    order_input = input("Enter the order in which these migrations should be arranged: ")
    order = list(map(int, order_input.split()))
    validate_order(order, len(conflicts))

    last_correct_migration = conflicts[order[0] - 1]

    last_correct_migration = last_correct_migration.replace(".py", "")
    renumber_migration(conflicts, order, last_correct_migration)


if __name__ == "__main__":
    MIGRATIONS_TO_SKIP = {"0209", "0261", "0501", "0001"}
    while True:
        conflicts: list[str] = []
        stack: list[str] = []
        files_list = [os.path.basename(path) for path in glob.glob("zerver/migrations/????_*.py")]
        file_index = [file[0:4] for file in files_list]

        for file in file_index:
            migration_number = file[0:4]
            counter = file_index.count(migration_number)

            if (
                counter > 1
                and file[0:4] not in stack
                # When we need to backport migrations to a previous
                # release, we sometimes end up with multiple having
                # the same ID number (which isn't a problem; the
                # migrations graph structure, not the IDs, is what
                # matters).
                and migration_number not in MIGRATIONS_TO_SKIP
            ):
                conflicts += [
                    file_name for file_name in files_list if file_name.startswith(migration_number)
                ]
                stack.append(migration_number)

        if len(conflicts) > 0:
            resolve_conflicts(conflicts, files_list)
        else:
            break

    print("All conflicts resolved")
```

--------------------------------------------------------------------------------

---[FILE: reset-to-pull-request]---
Location: zulip-main/tools/reset-to-pull-request

```text
#!/usr/bin/env bash
set -e

usage() {
    cat >&2 <<EOF
usage: $0 PULL_REQUEST_ID [REMOTE]

Fetch the given GitHub pull request branch, and reset our
current branch to it.

Useful for anyone reading or reviewing a PR, in order to
run the code and to study it with a full local set of tools.

REMOTE defaults to the value of the Git config variable
\`zulip.zulipRemote\` if set, else to \`upstream\`.

If the Git config variable \`zulip.prPseudoRemote\` is set,
e.g. with:
  git config zulip.prPseudoRemote pr
then the PR branch is also recorded as a local ref, like a
remote-tracking branch as if the PRs make up a "remote".  In
the example, PR #1234 is recorded as \`pr/1234\`, or in full
\`refs/remotes/pr/1234\`.  This is useful for keeping track of
the PR branch while comparing with other code, and for using
the reflog to compare with previous versions of the same PR.

See also \`push-to-pull-request\`.
EOF
    exit 1
}

remote_default="$(git config zulip.zulipRemote || echo upstream)"
pseudo_remote="$(git config zulip.prPseudoRemote || echo)"

request_id="$1"
remote=${2:-"$remote_default"}

if [ -z "$request_id" ]; then
    usage
fi

this_dir=${BASH_SOURCE[0]%/*}
# shellcheck source=lib/git-tools.bash
. "${this_dir}"/lib/git-tools.bash

require_clean_work_tree 'reset to PR'

if [ -z "$pseudo_remote" ]; then
    set -x
    git fetch "$remote" "pull/$request_id/head"
    git reset --hard FETCH_HEAD
else
    target_ref=refs/remotes/"$pseudo_remote"/"$request_id"
    set -x
    git fetch "$remote" +"pull/$request_id/head:$target_ref"
    git reset --hard "$target_ref"
fi
```

--------------------------------------------------------------------------------

---[FILE: review]---
Location: zulip-main/tools/review

```text
#!/usr/bin/env python3
import shlex
import subprocess
import sys


def exit(message: str) -> None:
    print("PROBLEM!")
    print(message)
    sys.exit(1)


def run(command: list[str]) -> None:
    print(f"\n>>> {shlex.join(command)}")
    subprocess.check_call(command)


def check_output(command: list[str]) -> str:
    return subprocess.check_output(command, text=True)


def get_git_branch() -> str:
    command = ["git", "rev-parse", "--abbrev-ref", "HEAD"]
    output = check_output(command)
    return output.strip()


def check_git_pristine() -> None:
    command = ["git", "status", "--porcelain"]
    output = check_output(command)
    if output.strip():
        exit("Git is not pristine:\n" + output)


def ensure_on_clean_main() -> None:
    branch = get_git_branch()
    if branch != "main":
        exit(f"You are still on a feature branch: {branch}")
    check_git_pristine()
    run(["git", "fetch", "upstream", "main"])
    run(["git", "rebase", "upstream/main"])


def create_pull_branch(pull_id: int) -> None:
    run(["git", "fetch", "upstream", f"pull/{pull_id}/head"])
    run(["git", "checkout", "-B", f"review-{pull_id}", "FETCH_HEAD"])
    run(["git", "rebase", "upstream/main"])
    run(["git", "log", "upstream/main..", "--oneline"])
    run(["git", "diff", "upstream/main..", "--name-status"])

    print()
    print(f"PR: {pull_id}")
    print(subprocess.check_output(["git", "log", "HEAD~..", "--pretty=format:Author: %an"]))


def review_pr() -> None:
    try:
        pull_id = int(sys.argv[1])
    except Exception:
        exit("please provide an integer pull request id")

    ensure_on_clean_main()
    create_pull_branch(pull_id)


if __name__ == "__main__":
    review_pr()
```

--------------------------------------------------------------------------------

---[FILE: run-codespell]---
Location: zulip-main/tools/run-codespell

```text
#!/usr/bin/env bash

# Fix common misspellings in text files (config: .codespellignore)
# Based on
# https://github.com/bitcoin/bitcoin/blob/master/test/lint/lint-spelling.sh
#
# We plan to replace this script with the `tools/lint` system as soon as we can.

IGNORE_WORDS_FILE=.codespellignore
if [ "$#" -eq 0 ]; then
    echo "No argument specified. Checking on the entire repo..."
    FILES_TO_BE_CHECKED="$(
        git ls-files -- \
            ':!*.asc' \
            ':!*.svg' \
            ':!*/fixtures/*' \
            ':!docs/THIRDPARTY' \
            ':!docs/translating' \
            ':!locale' \
            ':!postgresql.conf.template.erb' \
            ':!tools/build-demo-organization-wordlist' \
            ':!tools/setup/emoji/emoji_map.json' \
            ':!tools/setup/emoji/emoji_names.py' \
            ':!pnpm-lock.yaml' \
            ':!zerver/management/data/unified_reactions.json'
    )"
    mapfile -t FILES_TO_BE_CHECKED <<<"$FILES_TO_BE_CHECKED"
else
    FILES_TO_BE_CHECKED=("$@")
    echo "Checking ${FILES_TO_BE_CHECKED[*]@Q}"
fi

if ! codespell --ignore-words="$IGNORE_WORDS_FILE" -- "${FILES_TO_BE_CHECKED[@]}"; then
    echo "You may check the files for typo again using ./tools/run-codespell <file 1> <file 2> ... <file n>"
    exit 1
fi
```

--------------------------------------------------------------------------------

````
