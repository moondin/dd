---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 545
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 545 of 1290)

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

---[FILE: closed-by-commits]---
Location: zulip-main/tools/closed-by-commits

```text
#!/usr/bin/env -S uv run --script --frozen --only-group release-tools  # -*-python-*-

import json
import re
import time
import urllib.parse
from collections import defaultdict
from dataclasses import dataclass, field
from functools import cache
from typing import Annotated, Any

import requests
import typer
from github import Auth, Github
from rich.console import Console
from rich.progress import Progress
from typing_extensions import override


def encode_hash_component(s: str) -> str:
    hash_replacements = {
        "%": ".",
        "(": ".28",
        ")": ".29",
        ".": ".2E",
    }
    encoded = urllib.parse.quote(s, safe="*")
    return "".join(hash_replacements.get(c, c) for c in encoded)


@cache
def search_czo_for_number(prefix: str, number: int) -> frozenset[str]:
    params = {
        "anchor": "newest",
        "num_before": "100",
        "num_after": "0",
        "narrow": json.dumps(
            [
                {"negated": False, "operator": "search", "operand": f'"#{prefix}{number}"'},
                {"negated": False, "operator": "channels", "operand": "web-public"},
            ]
        ),
    }

    try:
        response = requests.get("https://chat.zulip.org/json/messages", params=params, timeout=30)
        response.raise_for_status()

        data = response.json()
        messages = data.get("messages", [])

        # Extract unique topic URLs
        urls = set()
        for msg in messages:
            stream_id = msg.get("stream_id")
            display_recipient = msg.get("display_recipient")
            subject = msg.get("subject")

            assert stream_id
            assert display_recipient

            encoded_recipient = encode_hash_component(display_recipient.replace(" ", "-"))
            encoded_subject = encode_hash_component(subject)
            url = f"https://chat.zulip.org/#narrow/channel/{stream_id}-{encoded_recipient}/topic/{encoded_subject}"
            urls.add(url)

        return frozenset(urls)

    except requests.exceptions.RequestException as e:
        assert e.response
        if e.response.status_code != 429:
            raise
        retry_after = int(e.response.headers["Retry-After"]) + 1
        time.sleep(retry_after)
        return search_czo_for_number(prefix, number)


@dataclass
class Issue:
    number: int
    title: str
    czo_urls: set[str] = field(default_factory=set)
    closed_by_prs: list["PullRequest"] = field(default_factory=list)
    duplicate_issue_ids: set[int] = field(default_factory=set)

    @override
    def __hash__(self) -> int:
        return hash(self.number)

    @override
    def __eq__(self, other: object) -> bool:
        return isinstance(other, Issue) and self.number == other.number


@dataclass
class PullRequest:
    number: int
    title: str
    czo_urls: set[str] = field(default_factory=set)

    @override
    def __hash__(self) -> int:
        return hash(self.number)

    @override
    def __eq__(self, other: object) -> bool:
        return isinstance(other, PullRequest) and self.number == other.number


class CommitRangeAnalyzer:
    COMMIT_PRS_QUERY = """
    query($oid: GitObjectID!, $repo: String!) {
      repository(owner: "zulip", name: $repo) {
        object(oid: $oid) {
          ... on Commit {
            messageBody
            associatedPullRequests(first: 10) {
              nodes {
                number
                title
                url
                body
                comments(first: 100) {
                  nodes {
                    body
                  }
                }
                closingIssuesReferences(first: 50) {
                  nodes {
                    number
                    title
                    url
                    body
                    comments(first: 100) {
                      nodes {
                        body
                      }
                    }
                    timelineItems(first:100, itemTypes:MARKED_AS_DUPLICATE_EVENT) {
                      ... on IssueTimelineItemsConnection {
                        nodes {
                          ... on MarkedAsDuplicateEvent {
                            duplicate {
                              ... on Issue {
                                number
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    """

    ISSUE_QUERY = """
    query($number: Int!, $repo: String!) {
      repository(owner: "zulip", name: $repo) {
        issue(number: $number) {
          number
          title
          body
          comments(first: 100) {
            nodes {
              body
            }
          }
          timelineItems(first:100, itemTypes:MARKED_AS_DUPLICATE_EVENT) {
            ... on IssueTimelineItemsConnection {
              nodes {
                ... on MarkedAsDuplicateEvent {
                  duplicate {
                    ... on Issue {
                      number
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    """

    def __init__(self, token: str, reponame: str, czo_issue_prefix: str) -> None:
        self.github = Github(auth=Auth.Token(token))
        self.reponame = reponame
        self.czo_issue_prefix = czo_issue_prefix

    @staticmethod
    def _extract_czo_urls(text: str | None) -> set[str]:
        if not text:
            return set()

        matches = re.findall(r"https://chat\.zulip\.org/[^\s\)\]\>]+", text)

        urls = set()
        for url in matches:
            # We strip off and remove /with/... and /near/... to
            # reduce the number of unique links which are generated.
            parsed_url = re.match(r"(.*)/topic/([^/]+)(/(near|with)/.*)?$", url)
            if not parsed_url:
                continue
            urls.add(
                parsed_url[1]
                + "/topic/"
                # Normalize the topic by decoding and re-encoding
                + encode_hash_component(urllib.parse.unquote(parsed_url[2].replace(".", "%")))
            )

        return urls

    @staticmethod
    def _extract_issue_numbers(reponame: str, text: str | None) -> set[int]:
        if not text:
            return set()

        # https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword
        pattern = rf"\b(?:close[sd]?|fix(?:es|ed)?|resolve[sd]?):?\s+(?:zulip/{reponame})?#(\d+)\b"
        matches = re.findall(pattern, text, re.IGNORECASE)
        return {int(num) for num in matches}

    def _issue_from_node(self, issue_node: dict[str, Any], console: Console) -> Issue:
        issue = Issue(
            number=issue_node["number"],
            title=issue_node["title"].strip(),
        )
        issue_comments = issue_node.get("comments", {}).get("nodes", [])
        for node in [issue_node, *issue_comments]:
            issue.czo_urls.update(self._extract_czo_urls(node.get("body")))
        issue.czo_urls.update(search_czo_for_number(self.czo_issue_prefix, issue.number))

        issue.duplicate_issue_ids = {
            event["duplicate"]["number"] for event in issue_node["timelineItems"]["nodes"]
        }
        for issue_id in issue.duplicate_issue_ids:
            if duplicate_info := self._fetch_issue(issue_id, console):
                issue.czo_urls.update(duplicate_info.czo_urls)
                issue.duplicate_issue_ids.update(duplicate_info.duplicate_issue_ids)
        return issue

    def _fetch_issue(self, number: int, console: Console) -> Issue | None:
        """Fetch issue metadata from GitHub."""
        try:
            _, result = self.github.requester.graphql_query(
                self.ISSUE_QUERY, {"number": number, "repo": self.reponame}
            )

            if "errors" in result:
                console.log(
                    "Failed to fetch zulip/%s#%d: %s", self.reponame, number, result["errors"]
                )
                return None

            data = result.get("data", {})
            issue_node = data.get("repository", {}).get("issue")

            if not issue_node:
                return None

            return self._issue_from_node(issue_node, console)

        except Exception:
            return None

    def get_issues_for_commit(
        self, commit_sha: str, console: Console
    ) -> tuple[dict[Issue, set[PullRequest]], set[int]]:
        _, result = self.github.requester.graphql_query(
            self.COMMIT_PRS_QUERY, {"oid": commit_sha, "repo": self.reponame}
        )

        if "errors" in result:
            error_messages = [e.get("message", str(e)) for e in result["errors"]]
            raise RuntimeError(f"GraphQL errors: {', '.join(error_messages)}")

        data = result.get("data", {})

        if not data.get("repository", {}).get("object"):
            return dict(), set()

        commit_obj = data["repository"]["object"]
        commit_message = commit_obj.get("messageBody", "")
        pr_nodes = commit_obj.get("associatedPullRequests", {}).get("nodes", [])

        results: dict[Issue, set[PullRequest]] = defaultdict(set)
        all_seen_prs: set[int] = set()
        for pr_node in pr_nodes:
            pr = PullRequest(
                number=pr_node["number"],
                title=pr_node["title"].strip(),
            )
            all_seen_prs.add(pr.number)
            pr_comments = pr_node.get("comments", {}).get("nodes", [])
            for node in [pr_node, *pr_comments]:
                pr.czo_urls.update(self._extract_czo_urls(node.get("body")))
            pr.czo_urls.update(search_czo_for_number(self.czo_issue_prefix, pr.number))

            # Get issues from PR metadata
            issues_dict = {}
            issue_nodes = pr_node.get("closingIssuesReferences", {}).get("nodes", [])
            for issue_node in issue_nodes:
                if issue_node is None:
                    continue

                issue = self._issue_from_node(issue_node, console)
                issues_dict[issue.number] = issue

            # Extract additional issue numbers from commit message
            for issue_num in self._extract_issue_numbers(self.reponame, commit_message):
                if issue_num not in issues_dict:
                    maybe_issue = self._fetch_issue(issue_num, console)
                    if maybe_issue is None:
                        continue
                    issues_dict[issue_num] = maybe_issue

            for issue in issues_dict.values():
                results[issue].add(pr)

        if not pr_nodes:
            for issue_num in self._extract_issue_numbers(self.reponame, commit_message):
                maybe_issue = self._fetch_issue(issue_num, console)
                if maybe_issue is None:
                    continue
                results[maybe_issue].update()

        return results, all_seen_prs

    def analyze_range(self, base: str, head: str) -> list[Issue]:
        console = Console(stderr=True, log_path=False)

        repository = self.github.get_repo(f"zulip/{self.reponame}")
        comparison = repository.compare(base, head)
        commit_shas = [commit.sha for commit in comparison.commits]
        console.log(f"Found {len(commit_shas)} commits")

        all_seen_prs = set()
        issue_to_prs: dict[Issue, set[PullRequest]] = defaultdict(set)
        with Progress(console=console) as progress:
            task = progress.add_task("Processing commits...", total=len(commit_shas))
            for sha in commit_shas:
                progress.console.log(f"Processing {sha}")

                this_issue_to_prs, this_seen_prs = self.get_issues_for_commit(sha, console)
                for issue, prs in this_issue_to_prs.items():
                    issue_to_prs[issue].update(prs)
                all_seen_prs.update(this_seen_prs)
                progress.advance(task)

        for issue, prs in issue_to_prs.items():
            for pr in prs:
                issue.czo_urls.update(pr.czo_urls)

            issue.closed_by_prs = sorted(prs, key=lambda p: p.number)

        unique_prs = len({pr for prs in issue_to_prs.values() for pr in prs})
        console.log(
            f"Found {len(all_seen_prs)} unique PRs, of which {unique_prs} PRs closed {len(issue_to_prs)} issues",
        )

        return sorted(issue_to_prs.keys(), key=lambda x: x.number)


def validate_github_token(value: str) -> str:
    # https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github#githubs-token-formats
    if value.startswith("github_"):
        return value
    if re.match(r"gh[pousr]_", value):
        return value
    raise typer.BadParameter("Github access tokens start with `github_`, or `gh`")


from enum import Enum


class ZulipRepo(str, Enum):
    zulip = ("zulip",)
    flutter = "zulip-flutter"


repo_issue_prefixes = {
    ZulipRepo.zulip: "",
    ZulipRepo.flutter: "F",
}


def main(
    base_commit: Annotated[str, typer.Argument(help="Commit-ish, resolved on the server")],
    head_commit: Annotated[str, typer.Argument(help="Commit-ish, resolved on the server")],
    token: Annotated[
        str,
        typer.Option(
            metavar="TOKEN",
            envvar="GITHUB_TOKEN",
            show_envvar=True,
            callback=validate_github_token,
            help=(
                "Github access token; can be a fine-grained personal access token "
                "with read-only access to 'Public repositories'.  "
                "See https://github.com/settings/personal-access-tokens/new"
            ),
        ),
    ],
    repo: ZulipRepo = ZulipRepo.zulip,
) -> int:
    """Find issues which are closed in a commit range."""

    lines = []
    prefix = repo_issue_prefixes[repo]
    analyzer = CommitRangeAnalyzer(token, repo.value, prefix)
    for issue in analyzer.analyze_range(base_commit, head_commit):
        lines.append(f"#### #{prefix}{issue.number}: {issue.title}")
        if issue.duplicate_issue_ids:
            lines.append(
                " - **Duplicates:** "
                + ", ".join(f"#{prefix}{number}" for number in issue.duplicate_issue_ids)
            )
        lines.extend(
            f" - **Closed by:** #{prefix}{pr.number}: {pr.title}" for pr in issue.closed_by_prs
        )
        lines.extend(f" - {czo_url}" for czo_url in sorted(issue.czo_urls))

        lines.append("")

    print("\n".join(lines))

    return 0


if __name__ == "__main__":
    typer.run(main)
```

--------------------------------------------------------------------------------

---[FILE: commit-message-lint]---
Location: zulip-main/tools/commit-message-lint

```text
#!/usr/bin/env bash

# Lint all commit messages that are newer than upstream/main if running
# locally or the commits in the push or PR if in CircleCI.

# The rules can be found in /.gitlint

repository="zulip/zulip"

if [[ "
$(git remote -v)
" =~ '
'([^[:space:]]*)[[:space:]]*(https://github\.com/|ssh://git@github\.com/|git@github\.com:)"$repository"(\.git|/)?\ \(fetch\)'
' ]]; then
    remote=${BASH_REMATCH[1]}
else
    remote=upstream
fi

upstream_commits=$(git rev-parse "refs/remotes/$remote/main" --glob="refs/remotes/$remote/*.x")
mapfile -t upstream_commits <<<"$upstream_commits"
base=$(git merge-base HEAD "${upstream_commits[@]}")

commits=$(git rev-list --count "$base..HEAD")
if [ "$commits" -gt 0 ]; then
    # Only run gitlint with non-empty commit lists, to avoid a printed
    # warning.
    gitlint --commits "$base..HEAD"
fi
```

--------------------------------------------------------------------------------

---[FILE: commit-msg]---
Location: zulip-main/tools/commit-msg

```text
#!/usr/bin/env bash

# This hook runs gitlint on your commit message.

# If your machine contains a provisioned Zulip development environment, the
# linter will be invoked through `vagrant ssh`.

# Do not invoke gitlint if commit message is empty
if grep -q '^[^#]' "$1"; then
    if
        if [ -z "$VIRTUAL_ENV" ] && command -v vagrant >/dev/null && [ -e .vagrant ]; then
            ! vagrant ssh -c 'cd ~/zulip && gitlint'
        else
            ! gitlint
        fi <"$1"
    then
        echo "WARNING: Your commit message does not match Zulip's style guide."
    fi
fi

exit 0
```

--------------------------------------------------------------------------------

---[FILE: conf.ini-template]---
Location: zulip-main/tools/conf.ini-template

```text
[github]
api_token = API_TOKEN
```

--------------------------------------------------------------------------------

---[FILE: coveragerc]---
Location: zulip-main/tools/coveragerc

```text
[report]
# Regexes for lines to exclude from consideration
exclude_lines =
    # Re-enable the standard coverage pragma
    nocoverage
    # Don't complain if non-runnable code isn't run:
    if False:
    # Don't require coverage for base class NotImplementedErrors
    raise NotImplementedError
    # Don't require coverage for test suite AssertionError -- they're usually for clarity
    raise AssertionError
    # Don't require coverage for __str__ statements just used for printing
    def __(repr|str)__[(]self[)] -> .*:
    # Don't require coverage for errors about unsupported webhook event types
    raise UnsupportedWebhookEventTypeError
    # Don't require coverage for blocks only run when type-checking
    if TYPE_CHECKING:
    # Don't require coverage for abstract methods; they're never called.
    @abstractmethod
    # PEP 484 overloading syntax
    ^\s*\.\.\.
    # Skipped unit tests
    @skip

[run]
data_file=var/.coverage

# dynamic_context=test_function, combined with using
# html_report(..., show_contexts=True), means the HTML report can detail
# which test(s) executed each line with coverage. This has modest
# overhead but is very useful for finding existing tests for a code path.
dynamic_context=test_function

source =
    analytics/
    confirmation/
    corporate/
    pgroonga/
    zerver/
    zilencer/
    zproject/
```

--------------------------------------------------------------------------------

---[FILE: create-api-changelog]---
Location: zulip-main/tools/create-api-changelog

```text
#!/usr/bin/env python3
import os
import random
import subprocess
import sys
from pathlib import Path

if __name__ == "__main__":
    ZULIP_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(ZULIP_PATH)

    dir_path = Path("api_docs/unmerged.d")
    os.makedirs(dir_path, exist_ok=True)

    random_hex_value = f"{random.randint(0, 0xFFFFFF):06x}"
    file_path = f"{dir_path}/ZF-{random_hex_value}.md"

    with open(file_path, "w") as f:
        f.write("")

    try:
        subprocess.run(["git", "add", file_path], check=True)
    except subprocess.CalledProcessError as e:
        print(e)
        sys.exit(1)

    print(
        f"""Created an empty API changelog file.
If you've made changes to the API, document them here:
{file_path}

For help, see:
    https://zulip.readthedocs.io/en/latest/documentation/api.html#step-by-step-guide
"""
    )
```

--------------------------------------------------------------------------------

---[FILE: deploy-branch]---
Location: zulip-main/tools/deploy-branch

```text
#!/usr/bin/env bash

function error_out() {
    echo -en '\e[0;31m'
    echo "$1"
    echo -en '\e[0m'
    exit 1
}

status=$(git status --porcelain | grep -v '^??')
[ -n "$status" ] && error_out "Working directory or index not clean"

old_ref=$(git rev-list --max-count=1 HEAD)
branch=$1
branch_ref=$(git rev-list --max-count=1 "$branch") || error_out "Unknown branch: $branch"

if [ "$old_ref" == "$branch_ref" ]; then
    new_ref=main
else
    if ref_name=$(git describe --all --exact "$old_ref"); then
        new_ref=$(echo "$ref_name" | perl -pe 's{^(heads|remotes)/}{}')
    else
        new_ref=$old_ref
    fi
fi

[ -z "$branch" ] && error_out "You must specify a branch name to deploy"

git fetch -p

git rebase origin/main "$branch" || error_out "Rebase onto origin/main failed"

git push . HEAD:main
git push origin main || error_out "Push of main to origin/main failed"

git checkout "$new_ref"
git branch -D "$branch"
git push origin ":$branch"
```

--------------------------------------------------------------------------------

---[FILE: diagnose]---
Location: zulip-main/tools/diagnose

```text
#!/usr/bin/env python3
import os
import platform
import shlex
import subprocess
import sys
from collections.abc import Callable

TOOLS_DIR = os.path.dirname(__file__)
ROOT_DIR = os.path.dirname(TOOLS_DIR)
sys.path.insert(0, ROOT_DIR)
from scripts.lib.zulip_tools import get_dev_uuid_var_path

UUID_VAR_PATH = get_dev_uuid_var_path()


def run(check_func: Callable[[], bool]) -> None:
    """
    This decorator simply runs functions.  It makes it more
    convenient to add new checks without a big main() function.
    """
    rc = check_func()
    if not rc:
        sys.exit(1)


def run_command(args: list[str]) -> None:
    print(shlex.join(args))
    subprocess.check_call(args)


@run
def check_python_version() -> bool:
    subprocess.check_call(["/usr/bin/env", "python", "-V"])
    return True


@run
def pwd() -> bool:
    print(os.getcwd())
    return True


@run
def host_info() -> bool:
    print(platform.platform())
    return True


@run
def check_django() -> bool:
    try:
        import django

        print("Django version:", django.get_version())
        return True
    except ImportError:
        print(
            """
            ERROR!
            We cannot import Django, which is usually a
            symptom of not having your Python venv
            set up correctly.

            Make sure your shell does this at init time:

            source /srv/zulip/.venv/bin/activate

            Or maybe you forget to run inside your VM?
            """
        )
        return False


@run
def provision_version() -> bool:
    fn = os.path.join(UUID_VAR_PATH, "provision_version")
    with open(fn) as f:
        version = tuple(map(int, f.read().strip().split(".")))
    print("latest version provisioned:", version)
    from version import PROVISION_VERSION

    print("desired version:", PROVISION_VERSION)
    if not (PROVISION_VERSION <= version < (PROVISION_VERSION[0] + 1,)):
        print("You need to provision!")
        return False
    return True


@run
def node_stuff() -> bool:
    print("node version:")
    subprocess.check_call(["node", "--version"])
    return True


@run
def test_models() -> bool:
    settings_module = "zproject.settings"
    os.environ["DJANGO_SETTINGS_MODULE"] = settings_module
    import django

    django.setup()
    from zerver.models import Realm, UserProfile

    print("Num realms: ", Realm.objects.count())
    print("Num users: ", UserProfile.objects.count())
    return True


@run
def check_migrations() -> bool:
    print()
    rc = subprocess.check_call("./tools/test-migrations")
    return rc == 0
```

--------------------------------------------------------------------------------

---[FILE: documentation.vnufilter]---
Location: zulip-main/tools/documentation.vnufilter

```text
# Warnings that are probably less important.

Consider using the “h1” element as a top-level heading only \(all “h1” elements are treated as top-level headings by many screen readers and other tools\)\.
Document uses the Unicode Private Use Area\(s\), which should not be used in publicly exchanged documents\. \(Charmod C073\)
Section lacks heading\. Consider using “h2”-“h6” elements to add identifying headings to all sections, or else use a “div” element instead for any cases where no heading is needed\.

# Opinionated informational messages.

Trailing slash on void elements has no effect and interacts badly with unquoted attribute values\.
```

--------------------------------------------------------------------------------

---[FILE: duplicate_commits.json]---
Location: zulip-main/tools/duplicate_commits.json

```json
{
    "TomaszKolek": 2,
    "zbenjamin": 91,
    "robot-dreams": 5,
    "lfaraone": 22,
    "jhurwitz": 4,
    "roed314": 2,
    "florean": 2,
    "sharmaeklavya2": 16,
    "acrefoot": 4,
    "sampritipanda": 2,
    "rishig": 3,
    "tukruic": 5,
    "Bickio": 1,
    "rwbarton": 4,
    "Juanvulcano": 1,
    "dariaphoebe": 1,
    "lonerz": 3,
    "HydraulicSheep": 3,
    "starrvinc": 1,
    "jajodiaraghav": 1,
    "abhayKashyap03": 1,
    "ImperialLlama": 1,
    "540KJ": 6,
    "showell": 13,
    "umkhan": 2,
    "anirudhjain75": 1,
    "theairportexplorer": 3,
    "lfranchi": 17,
    "abhijeetkaur": 33,
    "andersk": 3,
    "wdaher": 16,
    "andrewallen00": 2,
    "jordangedney": 2,
    "adnrs96": 20,
    "ashishk1994": 1,
    "maydhak": 1,
    "enhdless": 1,
    "neiljp": 14,
    "reyha": 2,
    "tommyip": 9,
    "vabs22": 5,
    "eeshangarg": 6,
    "taranjeet": 1,
    "roryk": 2,
    "bungeye": 1,
    "armooo": 4,
    "fazerlicourice7": 5,
    "jonjonsonjr": 1,
    "joyhchen": 2,
    "paxapy": 1,
    "royabouhamad": 2,
    "shane-kearns": 4,
    "zacps": 1,
    "AZtheAsian": 6,
    "ParthMahawar": 1,
    "timabbott": 500,
    "YagoGG": 5,
    "sahildua2305": 1,
    "bmorg": 1,
    "sinwar": 2,
    "soudy": 1,
    "aero31aero": 8,
    "umairwaheed": 1,
    "roberthoenig": 39,
    "refeed": 9,
    "dwrpayne": 1
}
```

--------------------------------------------------------------------------------

---[FILE: fetch-contributor-data]---
Location: zulip-main/tools/fetch-contributor-data

```text
#!/usr/bin/env python3
"""
Fetch contributors data from GitHub using their API, convert it to structured
JSON data for the /team/ page contributors section.
"""

import argparse
import json
import logging
import os
import sys
import unicodedata
from datetime import datetime, timezone

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from scripts.lib.setup_path import setup_path

setup_path()
os.environ["DJANGO_SETTINGS_MODULE"] = "zproject.settings"

from typing import TypedDict

import django
from django.conf import settings
from urllib3.util import Retry

django.setup()

from zerver.lib.avatar_hash import gravatar_hash
from zerver.lib.github import GithubSession
from zproject.config import get_secret

duplicate_commits_file = os.path.join(os.path.dirname(__file__), "duplicate_commits.json")

parser = argparse.ArgumentParser()
parser.add_argument(
    "--max-retries", type=int, default=10, help="Number of times to retry fetching data from GitHub"
)
args = parser.parse_args()


class ContributorsJSON(TypedDict):
    date: str
    contributors: list[dict[str, int | str]]


class Contributor(TypedDict):
    avatar_url: str | None
    contributions: int
    login: str | None
    email: str | None
    name: str | None


logger = logging.getLogger("zulip.fetch_contributors_json")


def fetch_contributors(repo_name: str, max_retries: int) -> list[Contributor]:
    contributors: list[Contributor] = []
    page_index = 1

    api_link = f"https://api.github.com/repos/zulip/{repo_name}/contributors"
    api_data = {"anon": "1"}

    headers: dict[str, str] = {}
    personal_access_token = get_secret("github_personal_access_token")
    if personal_access_token is not None:
        headers = {"Authorization": f"token {personal_access_token}"}

    Retry.DEFAULT_BACKOFF_MAX = 64
    retry = Retry(
        total=max_retries,
        backoff_factor=2.0,
        status_forcelist={
            403,  # Github does unauth rate-limiting via 403's
            429,  # The formal rate-limiting response code
            502,  # Bad gateway
            503,  # Service unavailable
        },
    )
    session = GithubSession(max_retries=retry)
    while True:
        response = session.get(
            api_link,
            params={**api_data, "page": f"{page_index}"},
            headers=headers,
        )
        response.raise_for_status()
        data = response.json()
        if len(data) == 0:
            return contributors
        contributors.extend(data)
        page_index += 1


def write_to_disk(json_data: ContributorsJSON, out_file: str) -> None:
    with open(out_file, "w") as f:
        json.dump(json_data, f, indent=2, sort_keys=True)
        f.write("\n")


def update_contributor_data_file() -> None:
    # This list should hold all repositories that should be included in
    # the total count, including those that should *not* have tabs on the team
    # page (e.g. if they are deprecated).
    repo_names = [
        "docker-zulip",
        "errbot-backend-zulip",
        "github-actions-zulip",
        "hubot-zulip",
        "puppet-zulip",
        "python-zulip-api",
        "trello-to-zulip",
        "swift-zulip-api",
        "zulint",
        "zulip",
        "zulip-android-legacy",
        "zulip-architecture",
        "zulip-archive",
        "zulip-csharp",
        "zulip-desktop",
        "zulip-desktop-legacy",
        "zulip-flutter",
        "zulip-ios-legacy",
        "zulip-js",
        "zulip-mobile",
        "zulip-redmine-plugin",
        "zulip-terminal",
        "zulip-zapier",
        "zulipbot",
    ]

    data: ContributorsJSON = dict(date=str(datetime.now(tz=timezone.utc).date()), contributors=[])
    contributor_username_to_data: dict[str, dict[str, str | int]] = {}

    for repo_name in repo_names:
        contributors = fetch_contributors(repo_name, args.max_retries)
        for contributor in contributors:
            username = contributor.get("login") or contributor.get("email")
            assert username is not None
            if username in contributor_username_to_data:
                contributor_username_to_data[username][repo_name] = contributor["contributions"]
            else:
                contributor_username_to_data[username] = {repo_name: contributor["contributions"]}

                avatar_url = contributor.get("avatar_url")
                if avatar_url is not None:
                    contributor_username_to_data[username]["avatar"] = avatar_url

                email = contributor.get("email")
                if email is not None:
                    contributor_username_to_data[username]["email"] = email
                    hash_key = gravatar_hash(email)
                    gravatar_url = f"https://secure.gravatar.com/avatar/{hash_key}?d=identicon"
                    contributor_username_to_data[username]["avatar"] = gravatar_url

                login = contributor.get("login")
                if login is not None:
                    contributor_username_to_data[username]["github_username"] = login

                name = contributor.get("name")
                if name is not None:
                    contributor_username_to_data[username]["name"] = unicodedata.normalize(
                        "NFC", name
                    )

    # remove duplicate contributions count
    # find commits at the time of split and subtract from zulip-server
    with open(duplicate_commits_file) as f:
        duplicate_commits = json.load(f)
        for committer in duplicate_commits:
            if committer in contributor_username_to_data and contributor_username_to_data[
                committer
            ].get("zulip"):
                total_commits = contributor_username_to_data[committer]["zulip"]
                assert isinstance(total_commits, int)
                duplicate_commits_count = duplicate_commits[committer]
                original_commits = total_commits - duplicate_commits_count
                contributor_username_to_data[committer]["zulip"] = original_commits

    data["contributors"] = list(contributor_username_to_data.values())
    write_to_disk(data, settings.CONTRIBUTOR_DATA_FILE_PATH)


if __name__ == "__main__":
    update_contributor_data_file()
```

--------------------------------------------------------------------------------

---[FILE: fetch-pull-request]---
Location: zulip-main/tools/fetch-pull-request

```text
#!/usr/bin/env bash
set -e

this_dir=${BASH_SOURCE[0]%/*}
# shellcheck source=lib/git-tools.bash
. "${this_dir}"/lib/git-tools.bash

require_clean_work_tree 'check out PR as branch'

request_id="$1"
remote=${2:-"upstream"}

set -x
git fetch "$remote" "pull/$request_id/head"
git checkout -B "review-original-${request_id}"
git reset --hard FETCH_HEAD
```

--------------------------------------------------------------------------------

---[FILE: fetch-rebase-pull-request]---
Location: zulip-main/tools/fetch-rebase-pull-request

```text
#!/usr/bin/env bash
set -e

this_dir=${BASH_SOURCE[0]%/*}
# shellcheck source=lib/git-tools.bash
. "${this_dir}"/lib/git-tools.bash

require_clean_work_tree 'check out PR as branch'

request_id="$1"
remote=${2:-"upstream"}

set -x
git fetch "$remote" "pull/$request_id/head"
git checkout -B "review-${request_id}" "$remote/main"
git reset --hard FETCH_HEAD
git pull --rebase
```

--------------------------------------------------------------------------------

---[FILE: find-unused-css]---
Location: zulip-main/tools/find-unused-css

```text
#!/usr/bin/env bash
# Hackish tool for attempting to find unused IDs / classes in our CSS

for n in $(perl -lne 'print $1 while /[#.]([a-zA-Z0-9_-]+)/g' web/styles/zulip.css | sort -u); do
    if [ "$(git grep "$n" | grep -cv '^web/styles/zulip.css')" -eq 0 ]; then
        echo "$n"
    fi
done
```

--------------------------------------------------------------------------------

---[FILE: github-changes-contain-file]---
Location: zulip-main/tools/github-changes-contain-file

```text
#!/usr/bin/env python3
import argparse
import json
import os
import subprocess
import sys
from pathlib import Path


def is_file_changed(file_path: str) -> bool:
    event_path = os.environ.get("GITHUB_EVENT_PATH", "")
    if not event_path:
        sys.exit("GITHUB_EVENT_PATH environment variable not set")

    with open(Path(event_path)) as f:
        event = json.load(f)

    before = event.get("before")
    after = event.get("after")
    if not before or not after:
        sys.exit("Missing 'before' or 'after' commit SHAs in event data")

    try:
        result = subprocess.run(
            ["git", "diff", "--quiet", before, after, "--", file_path],
            check=False,
            capture_output=True,
        )
        return result.returncode == 1
    except subprocess.CalledProcessError:
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "file",
    )
    args = parser.parse_args()

    if is_file_changed(args.file):
        sys.exit(0)
    else:
        sys.exit(1)
```

--------------------------------------------------------------------------------

````
