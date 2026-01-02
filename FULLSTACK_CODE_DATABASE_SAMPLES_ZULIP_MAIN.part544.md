---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 544
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 544 of 1290)

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

---[FILE: build-docs]---
Location: zulip-main/tools/build-docs

```text
#!/usr/bin/env python3

import argparse
import os
import sys

ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(ZULIP_PATH)

# check for the venv
from tools.lib import sanity_check

sanity_check.check_venv(__file__)

from scripts.lib.zulip_tools import ENDC, WARNING, run


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("-c", "--clean", action="store_true")
    args = parser.parse_args()

    path = os.path.join(ZULIP_PATH, "docs")
    if not args.clean:
        run(["make", "html", "-C", path])
        print(
            WARNING
            + "tools/build-docs --clean is necessary for the navigation/left sidebar to update."
            + ENDC
        )
        return

    run(["make", "clean", "html", "-C", path])


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: build-help-center]---
Location: zulip-main/tools/build-help-center

```text
#!/usr/bin/env python3

import argparse
import os
import subprocess
import sys
from email.utils import parseaddr

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from scripts.lib.setup_path import setup_path

setup_path()

os.environ["DJANGO_SETTINGS_MODULE"] = "zproject.settings"

import django

django.setup()
from django.conf import settings

parser = argparse.ArgumentParser()
parser.add_argument(
    "--no-relative-links",
    action="store_false",
    dest="show_relative_links",
    help="Disable relative links when using NavigationSteps component. Typically only set to true in case of the help center being hosted on zulip.com.",
)

parser.add_argument(
    "--out-dir",
    action="store",
    dest="out_dir",
    help="Output directory for the final build.",
)
args = parser.parse_args()


def run() -> None:
    env = os.environ.copy()
    env["SUPPORT_EMAIL"] = parseaddr(settings.ZULIP_ADMINISTRATOR)[1]
    env["CORPORATE_ENABLED"] = str(settings.CORPORATE_ENABLED).lower()
    env["SHOW_RELATIVE_LINKS"] = str(args.show_relative_links).lower()
    build_command = ["/usr/local/bin/corepack", "pnpm", "build"]
    if args.out_dir:
        build_command += ["--outDir", args.out_dir]

    subprocess.check_call(
        build_command,
        cwd="starlight_help",
        env=env,
    )


run()
```

--------------------------------------------------------------------------------

---[FILE: build-release-tarball]---
Location: zulip-main/tools/build-release-tarball

```text
#!/usr/bin/env bash
set -eu

# shellcheck source=lib/git-tools.bash
. "$(dirname "$0")"/lib/git-tools.bash

usage() {
    echo "Usage: $0 <ZULIP_VERSION>" >&2
    exit 1
}

args="$(getopt -o '' -l 'help' -n "$0" -- "$@")"
eval "set -- $args"

while true; do
    case "$1" in
        --)
            shift
            break
            ;;
        *) usage ;;
    esac
done

if [ -z "${1:-}" ]; then
    usage
fi

version="$1"
prefix="zulip-server-$version"

require_clean_work_tree 'build a release tarball'

set -x
GITID=$(git rev-parse HEAD)

umask 022

OUTPUT_DIR=${OUTPUT_DIR:-$(mktemp -d)}
TARBALL=$OUTPUT_DIR/$prefix.tar
BASEDIR=$(pwd)

git archive -o "$TARBALL" "--prefix=$prefix/" HEAD

cd "$OUTPUT_DIR"
tar -xf "$TARBALL"
while read -r i; do
    rm -r --interactive=never "${OUTPUT_DIR:?}/$prefix/$i"
done <"$OUTPUT_DIR/$prefix/tools/release-tarball-exclude.txt"
tar -cf "$TARBALL" "$prefix"
rm -rf "$prefix"

if tar -tf "$TARBALL" | grep -q -e ^zerver/tests; then
    set +x
    echo "BUG: Excluded files remain in tarball!"
    exit 1
fi
cd "$BASEDIR"

# Check out a temporary full copy of the index to generate static files
git checkout-index -f -a --prefix "$OUTPUT_DIR/$prefix/"

# Add the Git version information file
if [[ "$version" =~ ^[0-9]+\.[0-9]+(-[0-9a-z]+)?$ ]]; then
    # We override the merge-base, to avoid having to push the commits before building the tarball.
    OVERRIDE_MERGE_BASE="$version" ./tools/cache-zulip-git-version
    generated_version=$(head -n1 zulip-git-version)
    if [ "$generated_version" != "$version" ]; then
        echo "Version $version looks like a release version, but is not tagged yet!  Got $generated_version"
        exit 1
    fi
else
    ./tools/cache-zulip-git-version
fi
mv zulip-git-version "$OUTPUT_DIR/$prefix/"

cd "$OUTPUT_DIR/$prefix"

env -u PYTHONDEVMODE -u PYTHONWARNINGS uv sync --frozen

# create var/log directory in the new temporary checkout
mkdir -p "var/log"

# Some settings need to be updated for update-prod-static to work
#
# TODO: Would be much better to instead run the below tools with some
# sort of environment hack so that we don't need to create this dummy
# secrets file.
cat >>zproject/prod_settings_template.py <<EOF
DEBUG = False
EOF
cat >>zproject/dev-secrets.conf <<EOF
[secrets]
local_database_password = ''
secret_key = 'not_used_here'
shared_secret = 'not_used_here'
avatar_salt = 'not_used_here'
rabbitmq_password = 'not_used_here'
initial_password_salt = 'not_used_here'
EOF

./tools/update-prod-static

# We don't need duplicate copies of emoji with hashed paths, and they would break Markdown
find prod-static/serve/generated/emoji/images/emoji/ -regex '.*\.[0-9a-f]+\.png' -delete

echo "$GITID" >build_id
echo "$version" >version

cd "$OUTPUT_DIR"

# We don't include starlight_help/dist_no_relative_links since that is only useful for zulip.com
# and zulip.com doesn't use tarballs for deployment.
tar --append -f "$TARBALL" "$prefix/prod-static" "$prefix/build_id" "$prefix/version" "$prefix/zulip-git-version" "$prefix/locale" "$prefix/staticfiles.json" "$prefix/webpack-stats-production.json" "$prefix/starlight_help/dist"

rm -rf "$prefix"

gzip "$TARBALL"

set +x
TARBALL="$TARBALL.gz"

echo "Generated $TARBALL"
```

--------------------------------------------------------------------------------

---[FILE: cache-zulip-git-version]---
Location: zulip-main/tools/cache-zulip-git-version

```text
#!/usr/bin/env bash
set -eu

cd "$(dirname "$0")/.."
remote="$(git config zulip.zulipRemote)" || remote=upstream
{
    git describe --always --tags --match='[0-9]*'
    if [ -z "${OVERRIDE_MERGE_BASE+x}" ]; then
        branches="$(git for-each-ref --format='%(objectname)' "refs/remotes/$remote/main" "refs/remotes/$remote/*.x" "refs/remotes/$remote/*-branch")"
        mapfile -t branches <<<"$branches"
        if merge_base="$(git merge-base -- HEAD "${branches[@]}")"; then
            git describe --always --tags --match='[0-9]*' -- "$merge_base"
        fi
    else
        echo "$OVERRIDE_MERGE_BASE"
    fi
} >zulip-git-version
```

--------------------------------------------------------------------------------

---[FILE: check-capitalization]---
Location: zulip-main/tools/check-capitalization

```text
#!/usr/bin/env python3

import argparse
import json
import os
import re
import subprocess
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

# check for the venv
from tools.lib import sanity_check

sanity_check.check_venv(__file__)

from scripts.lib.zulip_tools import ENDC, FAIL, WARNING
from tools.lib.capitalization import check_capitalization

DJANGO_PO_REGEX = re.compile(r'msgid "(.*?)"')

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--show-ignored",
        action="store_true",
        help="Show strings that passed the check because they contained ignored phrases.",
    )
    parser.add_argument(
        "--no-generate", action="store_true", help="Don't run makemessages command."
    )
    args = parser.parse_args()

    if not args.no_generate:
        subprocess.check_call(
            ["./manage.py", "makemessages", "--locale", "en"], stderr=subprocess.STDOUT
        )

    with open("locale/en/translations.json") as f:
        data = json.load(f)
        frontend = check_capitalization(list(data.keys()))
        frontend_errors, frontend_ignored, banned_errors_front = frontend

    with open("locale/en/LC_MESSAGES/django.po") as f:
        rows = [r for r in DJANGO_PO_REGEX.findall(f.read()) if r]
        backend = check_capitalization(rows)
        backend_errors, backend_ignored, banned_errors_back = backend

    if frontend_errors:
        print(WARNING + "Strings not properly capitalized in frontend:" + ENDC)
        print("\n".join(frontend_errors))

    if backend_errors:
        print(WARNING + "Strings not properly capitalized in backend:" + ENDC)
        print("\n".join(backend_errors))

    if banned_errors_front:
        print(WARNING + "Found banned words in frontend strings" + ENDC)
        print("\n".join(banned_errors_front))

    if banned_errors_back:
        print(WARNING + "Found banned words in backend strings" + ENDC)
        print("\n".join(banned_errors_back))

    if args.show_ignored:
        print(WARNING + "Strings which were ignored: " + ENDC)
        print("\n".join(frontend_ignored + backend_ignored))

    if frontend_errors or backend_errors or banned_errors_back or banned_errors_front:
        # Point the user to the documentation on what the policy is.
        docs_url = (
            "https://zulip.readthedocs.io/en/latest/translating/translating.html#capitalization"
        )
        print()
        print(WARNING + "You can usually find strings using `git grep 'String to find'`" + ENDC)
        print(WARNING + "See also " + docs_url + ENDC)
        print()
        print(FAIL + "Failed!" + ENDC)
        sys.exit(1)
    else:
        sys.exit(0)
```

--------------------------------------------------------------------------------

---[FILE: check-feature-level-updated]---
Location: zulip-main/tools/check-feature-level-updated

```text
#!/usr/bin/env python3
import os
import sys
from pathlib import Path


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

    api_docs_folder = Path("api_docs")
    api_docs_paths = list(api_docs_folder.glob("*.md"))
    api_docs_paths.append(Path("zerver/openapi/zulip.yaml"))

    for api_docs_path in api_docs_paths:
        with open(api_docs_path) as file:
            if "ZF-" in file.read():
                content = f"[Build]({build_url}) triggered by {github_actor} on branch `{branch}` has failed: Feature level not replaced in '{api_docs_path}'."
                print(f"fail=true\ntopic={topic}\ncontent={content}")
                sys.exit(0)

    print("fail=false")
```

--------------------------------------------------------------------------------

---[FILE: check-frontend-i18n]---
Location: zulip-main/tools/check-frontend-i18n

```text
#!/usr/bin/env python3
import argparse
import json
import os
import subprocess
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

# check for the venv
from tools.lib import sanity_check

sanity_check.check_venv(__file__)

from scripts.lib.zulip_tools import ENDC, FAIL, WARNING


def find_handlebars(translatable_strings: list[str]) -> list[str]:
    return [string for string in translatable_strings if "{{" in string]


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--no-generate", action="store_true", help="Don't run makemessages command."
    )
    args = parser.parse_args()

    if not args.no_generate:
        subprocess.check_call(
            ["./manage.py", "makemessages", "--locale", "en"], stderr=subprocess.STDOUT
        )

    with open("locale/en/translations.json") as f:
        data = json.load(f)

    found = find_handlebars(list(data.keys()))
    if not found:
        sys.exit(0)

    print(WARNING + "Translation strings contain Handlebars:" + ENDC)
    print("\n".join(found))

    print(
        WARNING
        + "See https://zulip.readthedocs.io/en/latest/translating/internationalization.html#web-application-translations "
        "on how you can insert variables in the frontend translatable "
        "strings." + ENDC
    )
    print(FAIL + "Failed!" + ENDC)
    sys.exit(1)
```

--------------------------------------------------------------------------------

---[FILE: check-issue-labels]---
Location: zulip-main/tools/check-issue-labels

```text
#!/usr/bin/env python3
import argparse
import configparser
import os
import re
import sys
from typing import Any

import requests

# Scans zulip repository for issues that don't have any `area` labels.
# GitHub API token is required as GitHub limits unauthenticated
# requests to 60/hour. There is a good chance that this limit is
# bypassed in consecutive attempts.
# The API token can be generated here
# https://github.com/settings/tokens/new?description=Zulip%20Issue%20Label%20Checker
#
# Copy conf.ini-template to conf.ini and populate with your API token.
#
# usage: python check-issue-labels
# Pass --force as an argument to run without a token.


def get_config() -> configparser.ConfigParser:
    config = configparser.ConfigParser()
    config.read(os.path.join(os.path.dirname(os.path.abspath(__file__)), "conf.ini"))
    return config


def area_labeled(issue: dict[str, Any]) -> bool:
    for label in issue["labels"]:
        label_name = str(label["name"])
        if "area:" in label_name:
            return True
    return False


def is_issue(item: dict[str, Any]) -> bool:
    return "issues" in item["html_url"]


def get_next_page_url(link_header: str) -> str | None:
    matches = re.findall(r"\<(\S+)\>; rel=\"next\"", link_header)
    try:
        return matches[0]
    except IndexError:
        return None


def check_issue_labels() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    if not args.force:
        config = get_config()
        try:
            token = config.get("github", "api_token")
        except configparser.Error:
            print(
                "Error fetching GitHub API token. Copy conf.ini-template to conf.ini and populate with "
                "your API token. If you want to continue without using a token use --force."
            )
            sys.exit(1)

    next_page_url: str | None = "https://api.github.com/repos/zulip/zulip/issues"
    unlabeled_issue_urls: list[str] = []
    while next_page_url:
        try:
            if args.force:
                response = requests.get(next_page_url)
            else:
                response = requests.get(next_page_url, headers={"Authorization": f"token {token}"})
            if response.status_code == 401:
                sys.exit("Error. Please check the token.")
            if response.status_code == 403:
                sys.exit(
                    "403 Error. This is generally caused when API limit is exceeded. You use an API "
                    "token to overcome this limit."
                )
        except requests.exceptions.RequestException as e:
            print(e)
            sys.exit(1)

        next_page_url = get_next_page_url(response.headers["Link"])
        unlabeled_issue_urls.extend(
            item["html_url"]
            for item in response.json()
            if is_issue(item) and not area_labeled(item)
        )

    if unlabeled_issue_urls:
        print("The following issues don't have any area labels associated with it")
        print("\n".join(unlabeled_issue_urls))
    else:
        print("No GitHub issues found with missing area labels.")


if __name__ == "__main__":
    check_issue_labels()
```

--------------------------------------------------------------------------------

---[FILE: check-openapi.ts]---
Location: zulip-main/tools/check-openapi.ts

```typescript
#!/usr/bin/env node

import assert from "node:assert/strict";
import * as fs from "node:fs";
import {parseArgs} from "node:util";

import SwaggerParser from "@apidevtools/swagger-parser";
import * as Diff from "diff";
import ExampleValidator from "openapi-examples-validator";
import {format as prettierFormat} from "prettier";
import {CST, Composer, LineCounter, Parser, Scalar, YAMLMap, YAMLSeq, visit} from "yaml";

const usage = "Usage: check-openapi.ts [--fix] <file>...";
const {
    values: {fix, help},
    positionals: files,
} = parseArgs({options: {fix: {type: "boolean"}, help: {type: "boolean"}}, allowPositionals: true});

if (help) {
    console.log(usage);
    process.exit(0);
}

async function checkFile(file: string): Promise<void> {
    const yaml = await fs.promises.readFile(file, "utf8");
    const lineCounter = new LineCounter();
    const tokens = [...new Parser(lineCounter.addNewLine).parse(yaml)];
    const docs = [...new Composer().compose(tokens)];
    if (docs.length !== 1) {
        return;
    }
    const [doc] = docs;
    assert.ok(doc !== undefined);
    if (doc.errors.length > 0) {
        for (const error of doc.errors) {
            console.error("%s: %s", file, error.message);
        }
        process.exitCode = 1;
        return;
    }

    const root = doc.contents;
    if (!(root instanceof YAMLMap && root.has("openapi"))) {
        return;
    }

    let ok = true;
    const reformats = new Map<
        number,
        {value: string; context: Parameters<typeof CST.setScalarValue>[2]}
    >();
    const promises: Promise<void>[] = [];

    visit(doc, {
        Map(_key, node) {
            if (node.has("$ref") && node.items.length !== 1) {
                assert.ok(node.range);
                const {line, col} = lineCounter.linePos(node.range[0]);
                console.error("%s:%d:%d: Siblings of $ref have no effect", file, line, col);
                ok = false;
            }

            const combinator = ["allOf", "anyOf", "oneOf"].find((combinator) =>
                node.has(combinator),
            );
            if (node.has("nullable") && combinator !== undefined) {
                assert.ok(node.range);
                const {line, col} = lineCounter.linePos(node.range[0]);
                console.error(
                    `%s:%d:%d: nullable has no effect as a sibling of ${combinator}`,
                    file,
                    line,
                    col,
                );
                ok = false;
            }
        },

        Pair(_key, node) {
            if (
                node.key instanceof Scalar &&
                node.key.value === "allOf" &&
                node.value instanceof YAMLSeq &&
                node.value.items.filter(
                    (subschema) => !(subschema instanceof YAMLMap && subschema.has("$ref")),
                ).length > 1
            ) {
                assert.ok(node.value.range);
                const {line, col} = lineCounter.linePos(node.value.range[0]);
                console.error("%s:%d:%d: Too many inline allOf subschemas", file, line, col);
                ok = false;
            }

            if (
                node.key instanceof Scalar &&
                node.key.value === "description" &&
                node.value instanceof Scalar &&
                typeof node.value.value === "string"
            ) {
                const value = node.value;
                const description = node.value.value;
                promises.push(
                    (async () => {
                        let formatted = await prettierFormat(description, {
                            parser: "markdown",
                        });
                        if (
                            value.type !== Scalar.BLOCK_FOLDED &&
                            value.type !== Scalar.BLOCK_LITERAL
                        ) {
                            formatted = formatted.replace(/\n$/, "");
                        }
                        if (formatted !== description) {
                            assert.ok(value.range);
                            if (fix) {
                                reformats.set(value.range[0], {
                                    value: formatted,
                                    context: {afterKey: true},
                                });
                            } else {
                                ok = false;
                                const {line, col} = lineCounter.linePos(value.range[0]);
                                console.error(
                                    "%s:%d:%d: Format description with Prettier:",
                                    file,
                                    line,
                                    col,
                                );
                                let diff = "";
                                for (const part of Diff.diffLines(description, formatted)) {
                                    const prefix = part.added
                                        ? "\u001B[32m+"
                                        : part.removed
                                          ? "\u001B[31m-"
                                          : "\u001B[34m ";
                                    diff += prefix;
                                    diff += part.value
                                        .replace(/\n$/, "")
                                        .replaceAll("\n", "\n" + prefix);
                                    diff += "\n";
                                }
                                diff += "\u001B[0m";
                                console.error(diff);
                            }
                        }
                    })(),
                );
            }
        },
    });
    await Promise.all(promises);

    if (!ok) {
        process.exitCode = 1;
    }
    if (reformats.size > 0) {
        console.log("%s: Fixing problems", file);
        for (const token of tokens) {
            if (token.type === "document") {
                CST.visit(token, ({value}) => {
                    let reformat;
                    if (
                        CST.isScalar(value) &&
                        (reformat = reformats.get(value.offset)) !== undefined
                    ) {
                        CST.setScalarValue(value, reformat.value, reformat.context);
                    }
                });
            }
        }
        await fs.promises.writeFile(file, tokens.map((token) => CST.stringify(token)).join(""));
    }

    try {
        await SwaggerParser.validate(file);
    } catch (error) {
        if (!(error instanceof SyntaxError)) {
            throw error;
        }
        console.error("%s: %s", file, error.message);
        process.exitCode = 1;
    }
    const res = await ExampleValidator.validateFile(file);
    if (!res.valid) {
        for (const error of res.errors) {
            console.error(error);
        }
        process.exitCode = 1;
    }
}

for (const file of files) {
    await checkFile(file);
}
```

--------------------------------------------------------------------------------

---[FILE: check-provision]---
Location: zulip-main/tools/check-provision

```text
#!/usr/bin/env python3
import argparse
import os
import sys

tools_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(tools_dir)
sys.path.insert(0, root_dir)

from tools.lib.test_script import add_provision_check_override_param, assert_provisioning_status_ok


def run() -> None:
    parser = argparse.ArgumentParser()
    add_provision_check_override_param(parser)

    options = parser.parse_args()

    assert_provisioning_status_ok(options.skip_provision_check)


if __name__ == "__main__":
    run()
```

--------------------------------------------------------------------------------

---[FILE: check-schemas]---
Location: zulip-main/tools/check-schemas

```text
#!/usr/bin/env python3
#
# Validates that 3 data sources agree about the structure of Zulip's events API:
#
# * Node fixtures for the server_events_dispatch.js tests.
# * OpenAPI definitions in zerver/openapi/zulip.yaml
# * The schemas defined in zerver/lib/events_schema.py used for the
#   Zulip server's test suite.
#
# We compare the Python and OpenAPI schemas by converting the OpenAPI data
# into the event_schema style of types and the diffing the schemas.
import argparse
import os
import subprocess
import sys
from collections.abc import Callable
from typing import Any

import orjson

TOOLS_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(TOOLS_DIR))
ROOT_DIR = os.path.dirname(TOOLS_DIR)

EVENTS_JS = "web/tests/lib/events.cjs"

# check for the venv
from tools.lib import sanity_check

sanity_check.check_venv(__file__)

USAGE = """

    This program reads in fixture data for our
    node tests, and then it validates the fixture
    data with checkers from event_schema.py (which
    are the same Python functions we use to validate
    events in test_events.py).

    It currently takes no arguments.
"""

parser = argparse.ArgumentParser(usage=USAGE)
parser.parse_args()

# We can eliminate the django dependency in event_schema,
# but unfortunately it"s coupled to modules like validate.py
# and topic.py.
import django

os.environ["DJANGO_SETTINGS_MODULE"] = "zproject.test_settings"
django.setup()

from zerver.lib import event_schema

make_checker = event_schema.__dict__["make_checker"]


def get_event_checker(event: dict[str, Any]) -> Callable[[str, dict[str, Any]], None]:
    # Follow the naming convention to find the event checker.
    # Start by grabbing the event type.
    name = event["type"]

    # Handle things like AttachmentRemoveEvent
    if "op" in event:
        name += "_" + event["op"].title()

    # Change to CamelCase
    name = name.replace("_", " ").title().replace(" ", "")

    # Use EventModernPresence type to check "presence" events
    if name == "Presence":
        name = "Modern" + name

    # And add the prefix.
    name = "Event" + name

    if not hasattr(event_schema, name):
        raise ValueError(f"We could not find {name} in event_schemas.py")

    return make_checker(getattr(event_schema, name))


def check_event(name: str, event: dict[str, Any]) -> None:
    event["id"] = 1
    checker = get_event_checker(event)
    try:
        checker(name, event)
    except AssertionError:
        print(f"\n{EVENTS_JS} has bad data for {name}:\n\n")
        raise


def read_fixtures() -> dict[str, Any]:
    cmd = [
        "node",
        os.path.join(TOOLS_DIR, "node_lib/dump_fixtures.js"),
    ]
    schema = subprocess.check_output(cmd)
    return orjson.loads(schema)


def verify_fixtures_are_sorted(names: list[str]) -> None:
    for i in range(1, len(names)):
        if names[i] < names[i - 1]:
            raise Exception(
                f"""
                Please keep your fixtures in order within
                your events.cjs file.  The following
                key is out of order

                {names[i]}
                """
            )


def run() -> None:
    fixtures = read_fixtures()
    verify_fixtures_are_sorted(list(fixtures.keys()))
    for name, event in fixtures.items():
        check_event(name, event)
    print(f"Successfully checked {len(fixtures)} fixtures. All tests passed.")


if __name__ == "__main__":
    run()
```

--------------------------------------------------------------------------------

---[FILE: check-templates]---
Location: zulip-main/tools/check-templates

```text
#!/usr/bin/env python3
import argparse
import logging
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

# check for the venv
from tools.lib import sanity_check

sanity_check.check_venv(__file__)

from collections.abc import Iterable

from zulint import lister

from tools.lib.html_branches import build_id_dict
from tools.lib.pretty_print import validate_indent_html
from tools.lib.template_parser import validate

EXCLUDED_FILES = [
    ## Test data Files for testing modules in tests
    "tools/tests/test_template_data",
    # Our parser doesn't handle the way its conditionals are layered
    "templates/zerver/emails/missed_message.html",
    # Previously unchecked and our parser doesn't like its indentation
    "web/icons/template.hbs",
    # Template checker recommends very hard to read indentation.
    "web/templates/bookend.hbs",
]


def check_our_files(modified_only: bool, all_dups: bool, fix: bool, targets: list[str]) -> None:
    by_lang = lister.list_files(
        targets=targets,
        modified_only=modified_only,
        ftypes=["hbs", "html"],
        group_by_ftype=True,
        exclude=EXCLUDED_FILES,
    )

    check_handlebars_templates(by_lang["hbs"], fix)
    check_html_templates(by_lang["html"], all_dups, fix)


def check_html_templates(templates: Iterable[str], all_dups: bool, fix: bool) -> None:
    # Our files with .html extensions are usually for Django, but we also
    # have a few static .html files.
    logging.basicConfig(format="%(levelname)s:%(message)s")
    templates = sorted(fn for fn in templates)
    # Use of lodash templates <%= %>.
    if "templates/corporate/team.html" in templates:
        templates.remove("templates/corporate/team.html")

    def check_for_duplicate_ids(templates: list[str]) -> dict[str, list[str]]:
        template_id_dict = build_id_dict(templates)
        # TODO: Clean up these cases of duplicate ids in the code
        IGNORE_IDS = [
            "errors",
            "email",
            "registration",
            "pw_strength",
            "id_password",
            "top_navbar",
            "id_email",
            "id_terms",
            "logout_form",
            "send_confirm",
            "charged_amount",
            "change-plan-status",
        ]
        bad_ids_dict = {
            ids: fns
            for ids, fns in template_id_dict.items()
            if (ids not in IGNORE_IDS) and len(fns) > 1
        }

        if all_dups:
            ignorable_ids_dict = {
                ids: fns
                for ids, fns in template_id_dict.items()
                if ids in IGNORE_IDS and len(fns) > 1
            }

            for ids, fns in ignorable_ids_dict.items():
                logging.warning("Duplicate ID(s) detected: ID %r present at following files:", ids)
                for fn in fns:
                    print(fn)

        for ids, fns in bad_ids_dict.items():
            logging.error("Duplicate ID(s) detected: ID %r present at following files:", ids)
            for fn in fns:
                print(fn)
        return bad_ids_dict

    bad_ids_list = list(check_for_duplicate_ids(templates).keys())

    if bad_ids_list:
        print("Exiting--please clean up all duplicates before running this again.")
        sys.exit(1)

    for fn in templates:
        tokens = validate(fn, template_format="django")
        if not validate_indent_html(fn, tokens, fix):
            sys.exit(1)


def check_handlebars_templates(templates: Iterable[str], fix: bool) -> None:
    # Check all our Handlebars templates.
    templates = [fn for fn in templates if fn.endswith(".hbs")]

    for fn in templates:
        tokens = validate(fn, template_format="handlebars")
        if not validate_indent_html(fn, tokens, fix):
            sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-m", "--modified", action="store_true", help="only check modified files")
    parser.add_argument(
        "--all-dups",
        action="store_true",
        help="Run lint tool to detect duplicate ids on ignored files as well",
    )
    parser.add_argument(
        "--fix", action="store_true", help="Automatically fix indentation problems."
    )
    parser.add_argument("targets", nargs=argparse.REMAINDER)
    args = parser.parse_args()
    check_our_files(args.modified, args.all_dups, args.fix, args.targets)
```

--------------------------------------------------------------------------------

---[FILE: check-thirdparty]---
Location: zulip-main/tools/check-thirdparty

```text
#!/usr/bin/env python3
"""Check the docs/THIRDPARTY file against the DEP-5 copyright format.

https://www.debian.org/doc/packaging-manuals/copyright-format/1.0/

Disclaimer: This script is not a lawyer.  It cannot validate that the
claimed licenses are correct.  It can only check for basic syntactic
issues.
"""

# Copyright © 2020 Kandra Labs, Inc.
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
# 02110-1301, USA.

import difflib
import io
import os
import subprocess
import sys

from debian import copyright

COPYRIGHT_FILENAME = "docs/THIRDPARTY"
os.chdir(os.path.join(os.path.dirname(__file__), ".."))
status = 0

*files, empty = subprocess.check_output(
    ["git", "ls-files", "-z"],
    encoding="utf-8",
).split("\0")
assert empty == ""
files += [
    "static/generated/emoji/images/emoji/unicode/ignore-this-path",
]

with open(COPYRIGHT_FILENAME) as f:
    lines = list(f)
c = copyright.Copyright(lines)

if not c.header.known_format():
    print(f"{COPYRIGHT_FILENAME}: Unknown header format {c.header.format}")
    status = 1

defined_licenses = {
    p.license.to_str().split("\n", 1)[0]
    for p in c.all_license_paragraphs()
    if "\n" in p.license.to_str()
}

for p in c.all_files_paragraphs():
    for g in p.files:
        if not any(map(copyright.globs_to_re([g]).fullmatch, files)):
            print(f"{COPYRIGHT_FILENAME}: No such file {g}")
            status = 1

    if "\n" not in p.license.to_str() and p.license.to_str() not in defined_licenses:
        print(f"{COPYRIGHT_FILENAME}: Missing license text for {p.license.to_str()}")
        status = 1

dumped = c.dump()
if dumped != "".join(lines):
    print(f"{COPYRIGHT_FILENAME}: Changes expected:")
    sys.stdout.writelines(
        difflib.unified_diff(
            lines,
            io.StringIO(dumped).readlines(),
            COPYRIGHT_FILENAME,
            COPYRIGHT_FILENAME,
        ),
    )
    status = 1

sys.exit(status)
```

--------------------------------------------------------------------------------

---[FILE: clean-branches]---
Location: zulip-main/tools/clean-branches

```text
#!/usr/bin/env bash
set -e

# usage: clean-branches
# Deletes any local branches which are ancestors of origin/main,
# and also any branches in origin which are ancestors of
# origin/main and are named like $USER-*.

# usage: clean-branches --reviews
# Deletes all the above mentioned branches as well as branches
# created by the scripts like `fetch-rebase-pull-request`. Be careful
# as this would also remove other branches with names like review-*

review=0
if [ $# -ne 0 ] && [ "$1" == "--reviews" ]; then
    review=1
fi
push_args=()

function is_merged() {
    ! git rev-list -n 1 origin/main.."$1" | grep -q .
}

function clean_ref() {
    ref="$1"
    case "$ref" in
        */main | */HEAD)
            return
            ;;

        refs/heads/review-*)
            if [ $review -ne 0 ]; then
                echo -n "Deleting local branch ${ref#refs/heads/}"
                echo " (was $(git rev-parse --short "$ref"))"
                git update-ref -d "$ref"
            fi
            ;;

        refs/heads/*)
            if is_merged "$ref"; then
                echo -n "Deleting local branch ${ref#refs/heads/}"
                echo " (was $(git rev-parse --short "$ref"))"
                git update-ref -d "$ref"
            fi
            ;;

        refs/remotes/origin/$USER-*)
            if is_merged "$ref"; then
                remote_name="${ref#refs/remotes/origin/}"
                echo -n "Deleting remote branch $remote_name"
                echo " (was $(git rev-parse --short "$ref"))"
                # NB: this won't handle spaces in ref names
                push_args=("${push_args[@]}" ":$remote_name")
            fi
            ;;
    esac
}

if [ "$(git symbolic-ref HEAD)" != 'refs/heads/main' ]; then
    echo "Check out main before you run this script." >&2
    exit 1
fi

git fetch --prune origin

eval "$(git for-each-ref --shell --format='clean_ref %(refname);')"

if [ "${#push_args}" -ne 0 ]; then
    git push origin "${push_args[@]}"
fi
```

--------------------------------------------------------------------------------

````
