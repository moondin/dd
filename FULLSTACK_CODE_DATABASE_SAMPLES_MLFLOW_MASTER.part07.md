---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 7
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 7 of 991)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - mlflow-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/mlflow-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: lint.py]---
Location: mlflow-master/.claude/hooks/lint.py

```python
"""
Lightweight hook for validating code written by Claude Code.
"""

import ast
import json
import os
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Literal, TypeAlias

FuncNode: TypeAlias = ast.FunctionDef | ast.AsyncFunctionDef

KILL_SWITCH_ENV_VAR = "CLAUDE_LINT_HOOK_DISABLED"


@dataclass
class LintError:
    file: Path
    line: int
    column: int
    message: str

    def __str__(self) -> str:
        return f"{self.file}:{self.line}:{self.column}: {self.message}"


@dataclass
class DiffRange:
    start: int
    end: int

    def overlaps(self, start: int, end: int) -> bool:
        return start <= self.end and self.start <= end


def parse_diff_ranges(diff_output: str) -> list[DiffRange]:
    """Parse unified diff output and extract added line ranges."""
    ranges: list[DiffRange] = []
    for line in diff_output.splitlines():
        if line.startswith("@@ "):
            if match := re.search(r"\+(\d+)(?:,(\d+))?", line):
                start = int(match.group(1))
                count = int(match.group(2)) if match.group(2) else 1
                ranges.append(DiffRange(start=start, end=start + count))
    return ranges


def overlaps_with_diff(node: ast.Constant, ranges: list[DiffRange]) -> bool:
    return any(r.overlaps(node.lineno, node.end_lineno or node.lineno) for r in ranges)


def get_docstring_node(node: FuncNode) -> ast.Constant | None:
    match node.body:
        case [ast.Expr(value=ast.Constant(value=str()) as const), *_]:
            return const
    return None


def is_redundant_docstring(node: FuncNode) -> bool:
    docstring = ast.get_docstring(node)
    if not docstring:
        return False
    return "\n" not in docstring.strip()


class Visitor(ast.NodeVisitor):
    def __init__(self, file_path: Path, diff_ranges: list[DiffRange]) -> None:
        self.file_path = file_path
        self.diff_ranges = diff_ranges
        self.errors: list[LintError] = []

    def _check_docstring(self, node: FuncNode) -> None:
        if not node.name.startswith("test_"):
            return
        docstring_node = get_docstring_node(node)
        if not docstring_node:
            return
        if not overlaps_with_diff(docstring_node, self.diff_ranges):
            return
        if is_redundant_docstring(node):
            self.errors.append(
                LintError(
                    file=self.file_path,
                    line=docstring_node.lineno,
                    column=docstring_node.col_offset + 1,
                    message=f"Redundant docstring in '{node.name}'. Consider removing it.",
                )
            )

    def visit_FunctionDef(self, node: ast.FunctionDef) -> None:
        self._check_docstring(node)
        self.generic_visit(node)

    def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef) -> None:
        self._check_docstring(node)
        self.generic_visit(node)


def lint(file_path: Path, source: str, diff_ranges: list[DiffRange]) -> list[LintError]:
    try:
        tree = ast.parse(source, filename=str(file_path))
    except SyntaxError as e:
        return [LintError(file=file_path, line=0, column=0, message=f"Failed to parse: {e}")]

    visitor = Visitor(file_path=file_path, diff_ranges=diff_ranges)
    visitor.visit(tree)
    return visitor.errors


def is_test_file(path: Path) -> bool:
    return path.parts[0] == "tests" and path.name.startswith("test_")


@dataclass
class HookInput:
    tool_name: Literal["Edit", "Write"]
    file_path: Path

    @classmethod
    def parse(cls) -> "HookInput | None":
        # https://code.claude.com/docs/en/hooks#posttooluse-input
        data = json.loads(sys.stdin.read())
        tool_name = data.get("tool_name")
        tool_input = data.get("tool_input")
        if tool_name not in ("Edit", "Write"):
            return None
        file_path_str = tool_input.get("file_path")
        if not file_path_str:
            return None
        file_path = Path(file_path_str)
        if project_dir := os.environ.get("CLAUDE_PROJECT_DIR"):
            file_path = file_path.relative_to(project_dir)
        return cls(
            tool_name=tool_name,
            file_path=file_path,
        )


def is_tracked(file_path: Path) -> bool:
    result = subprocess.run(["git", "ls-files", "--error-unmatch", file_path], capture_output=True)
    return result.returncode == 0


def get_source_and_diff_ranges(hook_input: HookInput) -> tuple[str, list[DiffRange]]:
    if hook_input.tool_name == "Edit" and is_tracked(hook_input.file_path):
        # For Edit on tracked files, use git diff to get only changed lines
        diff_output = subprocess.check_output(
            ["git", "--no-pager", "diff", "-U0", "HEAD", "--", hook_input.file_path],
            text=True,
        )
        diff_ranges = parse_diff_ranges(diff_output)
    else:
        # For Write or Edit on untracked files, lint the whole file
        diff_ranges = [DiffRange(start=1, end=sys.maxsize)]
    source = hook_input.file_path.read_text()
    return source, diff_ranges


def main() -> int:
    # Kill switch: disable hook if environment variable is set
    if os.environ.get(KILL_SWITCH_ENV_VAR):
        return 0

    hook_input = HookInput.parse()
    if not hook_input:
        return 0

    # Ignore non-Python files
    if hook_input.file_path.suffix != ".py":
        return 0

    # Ignore non-test files
    if not is_test_file(hook_input.file_path):
        return 0

    source, diff_ranges = get_source_and_diff_ranges(hook_input)
    if errors := lint(hook_input.file_path, source, diff_ranges):
        error_details = "\n".join(f"  - {error}" for error in errors)
        reason = (
            f"Lint errors found:\n{error_details}\n\n"
            f"To disable this hook, set {KILL_SWITCH_ENV_VAR}=1"
        )
        # Exit code 2 = blocking error. stderr is fed back to Claude.
        # See: https://code.claude.com/docs/en/hooks#hook-output
        sys.stderr.write(reason + "\n")
        return 2

    return 0


if __name__ == "__main__":
    sys.exit(main())
```

--------------------------------------------------------------------------------

---[FILE: fetch_unresolved_comments.py]---
Location: mlflow-master/.claude/skills/fetch-unresolved-comments/fetch_unresolved_comments.py

```python
"""Fetch unresolved PR review comments using GitHub GraphQL API.

Example usage:
    GITHUB_TOKEN=$(gh auth token) uv run --no-project .claude/skills/fetch-unresolved-comments/fetch_unresolved_comments.py mlflow mlflow 18327
"""  # noqa: E501
# ruff: noqa: T201

import argparse
import json
import os
import sys
from typing import Any
from urllib.request import Request, urlopen


def fetch_unresolved_comments(owner: str, repo: str, pr_number: int, token: str) -> dict[str, Any]:
    """Fetch unresolved review threads from a PR using GraphQL."""

    query = """
    query($owner: String!, $repo: String!, $prNumber: Int!) {
      repository(owner: $owner, name: $repo) {
        pullRequest(number: $prNumber) {
          reviewThreads(first: 100) {
            nodes {
              id
              isResolved
              isOutdated
              comments(first: 100) {
                nodes {
                  id
                  databaseId
                  body
                  path
                  line
                  startLine
                  diffHunk
                  author {
                    login
                  }
                  createdAt
                  updatedAt
                }
              }
            }
          }
        }
      }
    }
    """

    variables = {
        "owner": owner,
        "repo": repo,
        "prNumber": pr_number,
    }

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    data = json.dumps({"query": query, "variables": variables}).encode("utf-8")
    request = Request("https://api.github.com/graphql", data=data, headers=headers)

    try:
        with urlopen(request) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception as e:
        print(f"Error fetching data: {e}", file=sys.stderr)
        sys.exit(1)


def format_comments(data: dict[str, Any]) -> dict[str, Any]:
    """Format unresolved comments for easier consumption."""

    try:
        threads = data["data"]["repository"]["pullRequest"]["reviewThreads"]["nodes"]
    except (KeyError, TypeError):
        print("Error: Invalid response structure", file=sys.stderr)
        print(json.dumps(data, indent=2), file=sys.stderr)
        sys.exit(1)

    by_file = {}
    total_comments = 0

    for thread in threads:
        if not thread["isResolved"]:
            comments = []
            path = None
            line = None
            start_line = None
            diff_hunk = None

            for comment in thread["comments"]["nodes"]:
                if path is None:
                    path = comment["path"]
                    line = comment["line"]
                    start_line = comment.get("startLine")
                    diff_hunk = comment.get("diffHunk")

                comments.append(
                    {
                        "id": comment["databaseId"],
                        "body": comment["body"],
                        "author": comment["author"]["login"] if comment["author"] else "unknown",
                        "createdAt": comment["createdAt"],
                    }
                )
                total_comments += 1

            if path:
                if path not in by_file:
                    by_file[path] = []

                by_file[path].append(
                    {
                        "thread_id": thread["id"],
                        "isOutdated": thread["isOutdated"],
                        "line": line,
                        "startLine": start_line,
                        "diffHunk": diff_hunk,
                        "comments": comments,
                    }
                )

    return {
        "total": total_comments,
        "by_file": by_file,
    }


def main():
    parser = argparse.ArgumentParser(
        description="Fetch unresolved PR review comments using GitHub GraphQL API"
    )
    parser.add_argument("owner", help="Repository owner")
    parser.add_argument("repo", help="Repository name")
    parser.add_argument("pr_number", type=int, help="Pull request number")
    parser.add_argument(
        "--token",
        default=os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN"),
        help="GitHub token (default: GITHUB_TOKEN or GH_TOKEN env var)",
    )

    args = parser.parse_args()

    if not args.token:
        print(
            "Error: GitHub token required (use --token or set GITHUB_TOKEN/GH_TOKEN)",
            file=sys.stderr,
        )
        sys.exit(1)

    data = fetch_unresolved_comments(args.owner, args.repo, args.pr_number, args.token)
    formatted = format_comments(data)
    formatted["by_file"] = {
        path: [thread for thread in threads if not thread["isOutdated"]]
        for path, threads in formatted["by_file"].items()
    }
    formatted["by_file"] = {k: v for k, v in formatted["by_file"].items() if v}
    formatted["total"] = sum(
        len(thread["comments"]) for threads in formatted["by_file"].values() for thread in threads
    )

    print(json.dumps(formatted, indent=2))


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: SKILL.md]---
Location: mlflow-master/.claude/skills/fetch-unresolved-comments/SKILL.md

```text
---
name: fetch-unresolved-comments
description: Fetch unresolved PR review comments using GitHub GraphQL API, filtering out resolved and outdated feedback.
---

# Fetch Unresolved PR Review Comments

Uses GitHub's GraphQL API to fetch only unresolved review thread comments from a pull request.

## When to Use

- You need to get only unresolved review comments from a PR
- You want to filter out already-resolved and outdated feedback

## Instructions

1. **Parse PR information**:

   - First check for environment variables:
     - If `PR_NUMBER` and `GITHUB_REPOSITORY` are set, read them and parse `GITHUB_REPOSITORY` as `owner/repo` and use `PR_NUMBER` directly
   - Otherwise:
     - Use `gh pr view --json url -q '.url'` to get the current branch's PR URL and parse to extract owner, repo, and PR number

2. **Run the Python script**:

   ```bash
   GITHUB_TOKEN=$(gh auth token) \
       uv run python .claude/skills/fetch-unresolved-comments/fetch_unresolved_comments.py <owner> <repo> <pr_number>
   ```

3. **Script options**:

   - `--token <token>`: Provide token explicitly (default: GITHUB_TOKEN or GH_TOKEN env var)

4. **Parse the JSON output**:
   The script always outputs JSON with:
   - `total`: Total number of unresolved comments across all threads
   - `by_file`: Review threads grouped by file path (each thread contains multiple comments in a conversation)

## Example JSON Output

```json
{
  "total": 3,
  "by_file": {
    ".github/workflows/resolve.yml": [
      {
        "thread_id": "PRRT_kwDOAL...",
        "isOutdated": false,
        "line": 40,
        "startLine": null,
        "diffHunk": "@@ -0,0 +1,245 @@\n+name: resolve...",
        "comments": [
          {
            "id": 2437935275,
            "body": "We can remove this once we get the key.",
            "author": "harupy",
            "createdAt": "2025-10-17T00:53:20Z"
          },
          {
            "id": 2437935276,
            "body": "Good catch, I'll update it.",
            "author": "contributor",
            "createdAt": "2025-10-17T01:10:15Z"
          }
        ]
      }
    ],
    ".gitignore": [
      {
        "thread_id": "PRRT_kwDOAL...",
        "isOutdated": false,
        "line": 133,
        "startLine": null,
        "diffHunk": "@@ -130,0 +133,2 @@\n+.claude/*",
        "comments": [
          {
            "id": 2437935280,
            "body": "Should we add this to .gitignore?",
            "author": "reviewer",
            "createdAt": "2025-10-17T01:15:42Z"
          }
        ]
      }
    ]
  }
}
```
```

--------------------------------------------------------------------------------

---[FILE: policy.rego]---
Location: mlflow-master/.github/policy.rego

```text
# regal ignore:directory-package-mismatch
package mlflow

import rego.v1

deny_jobs_without_permissions contains msg if {
	jobs := jobs_without_permissions(input.jobs)
	count(jobs) > 0
	msg := sprintf(
		"The following jobs are missing permissions: %s",
		[concat(", ", jobs)],
	)
}

deny_top_level_permissions contains msg if {
	input.permissions
	msg := "Do not use top-level permissions. Set permissions on the job level."
}

deny_unsafe_checkout contains msg if {
	# The "on" key gets transformed by conftest into "true" due to some legacy
	# YAML standards, see https://stackoverflow.com/q/42283732/2148786 - so
	# "on.push" becomes "true.push" which is why below statements use "true"
	# instead of "on".
	input["true"].pull_request_target
	some job in input.jobs
	some step in job.steps
	startswith(step.uses, "actions/checkout@")
	step["with"].ref
	msg := concat("", [
		"Explicit checkout in a pull_request_target workflow is unsafe. ",
		"See https://securitylab.github.com/resources/github-actions-preventing-pwn-requests for more information.",
	])
}

deny_unnecessary_github_token contains msg if {
	some job in input.jobs
	some step in job.steps
	startswith(step.uses, "actions/github-script@")
	regex.match(`\$\{\{\s*(secrets\.GITHUB_TOKEN|github\.token)\s*\}\}`, step["with"]["github-token"])
	msg := "Unnecessary use of github-token for actions/github-script."
}

deny_jobs_without_timeout contains msg if {
	jobs := jobs_without_timeout(input.jobs)
	count(jobs) > 0
	msg := sprintf(
		"The following jobs are missing timeout-minutes: %s",
		[concat(", ", jobs)],
	)
}

deny_unpinned_actions contains msg if {
	actions := unpinned_actions(input)
	count(actions) > 0
	msg := sprintf(
		concat("", [
			"The following actions are not pinned by full commit SHA: %s. ",
			"Use the full commit SHA instead ",
			"(e.g., actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683).",
		]),
		[concat(", ", actions)],
	)
}

deny_missing_shell_defaults contains msg if {
	# Only check workflow files (not composite actions)
	# Composite actions have 'runs' instead of 'jobs'
	input.jobs
	not input.defaults.run.shell
	msg := "Workflow must have 'defaults.run.shell: bash' to enable pipefail by default"
}

deny_wrong_shell_defaults contains msg if {
	# Only check workflow files (not composite actions)
	input.jobs
	shell := input.defaults.run.shell
	shell != "bash"
	msg := sprintf(
		"Workflow has 'defaults.run.shell: %s' but it must be 'bash' to enable pipefail by default",
		[shell],
	)
}

###########################   RULE HELPERS   ##################################
jobs_without_permissions(jobs) := {job_id |
	some job_id, job in jobs
	not job.permissions
}

jobs_without_timeout(jobs) := {job_id |
	some job_id, job in jobs
	not job["timeout-minutes"]
}

is_step_unpinned(step) if {
	not startswith(step.uses, "./")
	not regex.match(`^[^@]+@[0-9a-f]{40}$`, step.uses)
}

unpinned_actions(inp) := unpinned if {
	# For workflow files with jobs
	inp.jobs
	unpinned := {step.uses |
		some job in inp.jobs
		some step in job.steps
		is_step_unpinned(step)
	}
}

unpinned_actions(inp) := unpinned if {
	# For composite action files with runs
	not inp.jobs
	inp.runs.steps
	unpinned := {step.uses |
		some step in inp.runs.steps
		is_step_unpinned(step)
	}
}
```

--------------------------------------------------------------------------------

---[FILE: pull_request_template.md]---
Location: mlflow-master/.github/pull_request_template.md

```text
<!-- Remove unused checkboxes except for the patch release section at the bottom -->

### Related Issues/PRs

<!-- Uncomment 'Resolve' if this PR can close the linked items. -->
<!-- Resolve --> #xxx

### What changes are proposed in this pull request?

<!-- Please fill in changes proposed in this PR. -->

### How is this PR tested?

- [ ] Existing unit/integration tests
- [ ] New unit/integration tests
- [ ] Manual tests

<!-- Attach code, screenshot, video used for manual testing here. -->

### Does this PR require documentation update?

- [ ] No. You can skip the rest of this section.
- [ ] Yes. I've updated:
  - [ ] Examples
  - [ ] API references
  - [ ] Instructions

### Release Notes

#### Is this a user-facing change?

- [ ] No. You can skip the rest of this section.
- [ ] Yes. Give a description of this change to be included in the release notes for MLflow users.

<!-- Details in 1-2 sentences. You can just refer to another PR with a description if this PR is part of a larger change. -->

#### What component(s), interfaces, languages, and integrations does this PR affect?

Components

- [ ] `area/tracking`: Tracking Service, tracking client APIs, autologging
- [ ] `area/models`: MLmodel format, model serialization/deserialization, flavors
- [ ] `area/model-registry`: Model Registry service, APIs, and the fluent client calls for Model Registry
- [ ] `area/scoring`: MLflow Model server, model deployment tools, Spark UDFs
- [ ] `area/evaluation`: MLflow model evaluation features, evaluation metrics, and evaluation workflows
- [ ] `area/gateway`: MLflow AI Gateway client APIs, server, and third-party integrations
- [ ] `area/prompts`: MLflow prompt engineering features, prompt templates, and prompt management
- [ ] `area/tracing`: MLflow Tracing features, tracing APIs, and LLM tracing functionality
- [ ] `area/projects`: MLproject format, project running backends
- [ ] `area/uiux`: Front-end, user experience, plotting, JavaScript, JavaScript dev server
- [ ] `area/build`: Build and test infrastructure for MLflow
- [ ] `area/docs`: MLflow documentation pages

<!--
Insert an empty named anchor here to allow jumping to this section with a fragment URL
(e.g. https://github.com/mlflow/mlflow/pull/123#user-content-release-note-category).
Note that GitHub prefixes anchor names in markdown with "user-content-".
-->

<a name="release-note-category"></a>

#### How should the PR be classified in the release notes? Choose one:

- [ ] `rn/none` - No description will be included. The PR will be mentioned only by the PR number in the "Small Bugfixes and Documentation Updates" section
- [ ] `rn/breaking-change` - The PR will be mentioned in the "Breaking Changes" section
- [ ] `rn/feature` - A new user-facing feature worth mentioning in the release notes
- [ ] `rn/bug-fix` - A user-facing bug fix worth mentioning in the release notes
- [ ] `rn/documentation` - A user-facing documentation change worth mentioning in the release notes

#### Should this PR be included in the next patch release?

`Yes` should be selected for bug fixes, documentation updates, and other small changes. `No` should be selected for new features and larger changes. If you're unsure about the release classification of this PR, leave this unchecked to let the maintainers decide.

<details>
<summary>What is a minor/patch release?</summary>

- Minor release: a release that increments the second part of the version number (e.g., 1.2.0 -> 1.3.0).
  Bug fixes, doc updates and new features usually go into minor releases.
- Patch release: a release that increments the third part of the version number (e.g., 1.2.0 -> 1.2.1).
  Bug fixes and doc updates usually go into patch releases.

</details>

<!-- Do not modify or remove any text inside the parentheses. Keep both checkboxes below. -->

- [ ] Yes (this PR will be cherry-picked and included in the next patch release)
- [ ] No (this PR will be included in the next minor release)
```

--------------------------------------------------------------------------------

---[FILE: action.yml]---
Location: mlflow-master/.github/actions/cache-pip/action.yml

```yaml
name: "cache-venv"
description: "Cache .venv directory for faster dependency installation"
runs:
  using: "composite"
  steps:
    - uses: ./.github/actions/py-cache-key
      id: py-cache-key
    - uses: actions/cache@5a3ec84eff668545956fd18022155c47e93e2684 # v4.2.3
      continue-on-error: true
      # https://github.com/actions/cache/issues/810
      env:
        SEGMENT_DOWNLOAD_TIMEOUT_MINS: 1
      with:
        path: .venv
        key: ${{ steps.py-cache-key.outputs.key }}
```

--------------------------------------------------------------------------------

---[FILE: action.yml]---
Location: mlflow-master/.github/actions/free-disk-space/action.yml

```yaml
name: "free-disk-space"
description: "free disk space"
runs:
  using: "composite"
  steps:
    - shell: bash
      run: |
        # Run in background to save time
        sudo rm -rf /usr/local/lib/android &
```

--------------------------------------------------------------------------------

---[FILE: action.yml]---
Location: mlflow-master/.github/actions/pipdeptree/action.yml

```yaml
name: "pipdeptree"
description: "pipdeptree"
runs:
  using: "composite"
  steps:
    - shell: bash
      run: |
        if [ -e .venv/bin/activate ]; then
          # Linux
          source .venv/bin/activate
        elif [ -e .venv/Scripts/activate ]; then
          # Windows
          source .venv/Scripts/activate
        fi
        pip install pipdeptree
        pipdeptree --all
```

--------------------------------------------------------------------------------

---[FILE: action.yml]---
Location: mlflow-master/.github/actions/py-cache-key/action.yml

```yaml
name: "py-cache-key"
description: "Generate a key for Python package cache"

outputs:
  key:
    description: "Cache key"
    value: ${{ steps.cache-key.outputs.value }}

runs:
  using: "composite"
  steps:
    - name: cache-key
      id: cache-key
      shell: bash
      env:
        REQUIREMENTS_HASH: ${{ hashFiles('requirements/*requirements.txt') }}
      run: |
        # Refresh cache if the action runner image has changed
        RUNNER_IMAGE="$ImageOS-$ImageVersion"
        # Refresh cache if the python version has changed
        PYTHON_VERSION="$(python --version | cut -d' ' -f2)"
        # Refresh cache daily
        DATE=$(date -u "+%Y%m%d")
        # Change this value to force a cache refresh
        N=1
        echo "value=$RUNNER_IMAGE-$PYTHON_VERSION-$DATE-$REQUIREMENTS_HASH-$N" >> $GITHUB_OUTPUT
```

--------------------------------------------------------------------------------

---[FILE: action.yml]---
Location: mlflow-master/.github/actions/setup-java/action.yml

```yaml
name: "setup-java"
description: "Set up Java"
inputs:
  java-version:
    description: "java-version"
    default: 17
    required: false

  distribution:
    description: "distribution"
    default: temurin
    required: false

runs:
  using: "composite"
  steps:
    - uses: actions/setup-java@c5195efecf7bdfc987ee8bae7a71cb8b11521c00 # v4.7.1
      with:
        java-version: ${{ inputs.java-version }}
        distribution: ${{ inputs.distribution }}

    - name: Set MLFLOW_DOCKER_OPENJDK_VERSION
      shell: bash
      run: |
        echo "MLFLOW_DOCKER_OPENJDK_VERSION=${{ inputs.java-version }}" >> $GITHUB_ENV
```

--------------------------------------------------------------------------------

---[FILE: action.yml]---
Location: mlflow-master/.github/actions/setup-node/action.yml

```yaml
name: "setup-node"
description: "Set up Node"
inputs:
  node-version:
    description: "Node version to use."
    default: 20
    required: false

runs:
  using: "composite"
  steps:
    - uses: actions/setup-node@cdca7365b2dadb8aad0a33bc7601856ffabcc48e # v4.3.0
      with:
        node-version: ${{ inputs.node-version }}
```

--------------------------------------------------------------------------------

---[FILE: action.yml]---
Location: mlflow-master/.github/actions/setup-pyenv/action.yml

```yaml
name: "setup-pyenv"
description: "Setup pyenv"
runs:
  using: "composite"
  steps:
    ########## Ubuntu ##########
    - name: Install python build tools
      if: runner.os == 'Linux'
      shell: bash
      # Ref: https://github.com/pyenv/pyenv/wiki#suggested-build-environment
      # Note: llvm is optional (required only for building PyPy/clang)
      run: |
        sudo apt-get update -y
        sudo apt-get purge -y man-db || true
        sudo apt-get install -y --no-install-recommends make build-essential libssl-dev zlib1g-dev \
        libbz2-dev libreadline-dev libsqlite3-dev wget curl \
        libncursesw5-dev xz-utils libffi-dev liblzma-dev
    - name: Install pyenv
      if: runner.os == 'Linux'
      shell: bash
      run: |
        git clone https://github.com/pyenv/pyenv.git "$HOME/.pyenv"
    - name: Setup environment variables
      if: runner.os == 'Linux'
      shell: bash
      run: |
        PYENV_ROOT="$HOME/.pyenv"
        PYENV_BIN="$PYENV_ROOT/bin"
        echo "$PYENV_BIN" >> $GITHUB_PATH
        echo "PYENV_ROOT=$PYENV_ROOT" >> $GITHUB_ENV
    - name: Check pyenv version
      if: runner.os == 'Linux'
      shell: bash
      run: |
        pyenv --version

    ########## Windows ##########
    - name: Install pyenv
      if: runner.os == 'Windows'
      shell: bash
      run: |
        pip install pyenv-win --target $HOME\\.pyenv
    - name: Setup environment variables
      if: runner.os == 'Windows'
      shell: bash
      run: |
        echo "PYENV=$USERPROFILE\.pyenv\pyenv-win\\" >> $GITHUB_ENV
        echo "PYENV_ROOT=$USERPROFILE\.pyenv\pyenv-win\\" >> $GITHUB_ENV
        echo "PYENV_HOME=$USERPROFILE\.pyenv\pyenv-win\\" >> $GITHUB_ENV
        echo "$USERPROFILE\.pyenv\pyenv-win\\bin\\" >> $GITHUB_PATH
    - name: Check pyenv version
      if: runner.os == 'Windows'
      shell: bash
      run: |
        pyenv --version

    - name: Install virtualenv
      shell: bash
      run: |
        pip install virtualenv
```

--------------------------------------------------------------------------------

---[FILE: action.yml]---
Location: mlflow-master/.github/actions/setup-python/action.yml

```yaml
name: "setup-python"
description: "Ensures to install a python version that's available on Anaconda"
inputs:
  python-version:
    description: "The python version to install. If unspecified, install the minimum python version mlflow supports."
    required: false
outputs:
  python-version:
    description: "The installed python version"
    value: ${{ steps.get-python-version.outputs.version }}
runs:
  using: "composite"
  steps:
    - name: get-python-version
      id: get-python-version
      shell: bash
      # We used to use `conda search python=3.x` to dynamically fetch the latest available version
      # in 3.x on Anaconda, but it turned out `conda search` is very slow (takes 40 ~ 50 seconds).
      # This overhead sums up to a significant amount of delay in the cross version tests
      # where we trigger more than 100 GitHub Actions runs.
      run: |
        python_version="${{ inputs.python-version }}"
        if [ -z "$python_version" ]; then
          python_version=$(cat .python-version)
        fi
        if [[ "$python_version" == "3.10" ]]; then
          if [ ${{ runner.os }} == "Linux" ]; then
            python_version="3.10.19"
          else
            python_version="3.10.11"
          fi
        elif [[ "$python_version" == "3.11" ]]; then
          if [ ${{ runner.os }} == "Windows" ]; then
            python_version="3.11.9"
          else
            python_version="3.11.14"
          fi
        else
          echo "Invalid python version: '$python_version'. Must be '3.10', or '3.11'."
          exit 1
        fi
        echo "version=$python_version" >> $GITHUB_OUTPUT
    - uses: actions/setup-python@8d9ed9ac5c53483de85588cdf95a591a75ab9f55 # v5.5.0
      with:
        python-version: ${{ steps.get-python-version.outputs.version }}
    - uses: astral-sh/setup-uv@f0ec1fc3b38f5e7cd731bb6ce540c5af426746bb # v6.1.0
    - run: |
        # The default `first-index` strategy is too strict. Use `unsafe-first-match` instead.
        # https://docs.astral.sh/uv/configuration/environment/#uv_index_strategy
        echo "UV_INDEX_STRATEGY=unsafe-first-match" >> $GITHUB_ENV
      shell: bash
```

--------------------------------------------------------------------------------

---[FILE: action.yml]---
Location: mlflow-master/.github/actions/show-versions/action.yml

```yaml
name: "show-versions"
description: "Show python package versions sorted by release date"
runs:
  using: "composite"
  steps:
    - shell: bash
      run: |
        # Activate the virtual environment if .venv exists
        if [ -d .venv ]; then
          if [ ${{ runner.os }} == "Windows" ]; then
            source .venv/Scripts/activate
          else
            source .venv/bin/activate
          fi
        fi
        pip --disable-pip-version-check install aiohttp > /dev/null
        python dev/show_package_release_dates.py
```

--------------------------------------------------------------------------------

---[FILE: action.yml]---
Location: mlflow-master/.github/actions/untracked/action.yml

```yaml
name: "untracked"
description: "Detect untracked files"
runs:
  using: "node20"
  main: "index.js"
  post: "post.js"
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: mlflow-master/.github/actions/untracked/index.js

```javascript
// Does nothing
```

--------------------------------------------------------------------------------

---[FILE: post.js]---
Location: mlflow-master/.github/actions/untracked/post.js

```javascript
const { exec } = require("child_process");

exec("git ls-files --others --exclude-standard", (error, stdout, stderr) => {
  if (error) {
    console.error(`An error occurred: ${error}`);
    process.exit(error.code || 1);
  }

  const untrackedFiles = stdout.trim();

  if (untrackedFiles === "") {
    console.log("No untracked files found.");
    process.exit(0);
  } else {
    console.log("Untracked files found:");
    console.log(untrackedFiles);
    console.log("Consider adding them to .gitignore.");
    process.exit(1);
  }
});
```

--------------------------------------------------------------------------------

---[FILE: action.yml]---
Location: mlflow-master/.github/actions/update-requirements/action.yml

```yaml
name: "update-requirements"
description: "Update requirements YAML specifications and re-generate requirements text files"

outputs:
  updated:
    description: "Indicates whether the requirements have been updated"
    value: ${{ steps.update-requirements.outputs.updated }}

runs:
  using: "composite"
  steps:
    - name: Update requirements
      id: update-requirements
      shell: bash --noprofile --norc -exo pipefail {0}
      run: |
        python bin/install.py
        python dev/update_requirements.py --requirements-yaml-location requirements
        if [ -z "$(git status --porcelain)" ]; then
          echo "updated=false" >> $GITHUB_OUTPUT
        else
          python dev/pyproject.py
          git diff --color=always
          echo "updated=true" >> $GITHUB_OUTPUT
        fi
```

--------------------------------------------------------------------------------

---[FILE: action.yml]---
Location: mlflow-master/.github/actions/validate-author/action.yml

```yaml
name: "validate-author"
runs:
  using: "composite"
  steps:
    - uses: actions/github-script@60a0d83039c74a4aee543508d2ffcb1c3799cdea # v7.0.1
      with:
        script: |
          const validateAuthor = require(
            `${process.env.GITHUB_WORKSPACE}/.github/actions/validate-author/index.js`
          );
          await validateAuthor({ context, github, core });
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: mlflow-master/.github/actions/validate-author/index.js

```javascript
function isAllowed({ author_association, user }) {
  return (
    ["owner", "member", "collaborator"].includes(author_association.toLowerCase()) ||
    // Allow Copilot and mlflow-app bot to run this workflow
    (user &&
      user.type.toLowerCase() === "bot" &&
      ["copilot", "mlflow-app[bot]"].includes(user.login.toLowerCase()))
  );
}

/**
 * Create a comment on the issue/PR with the failure message
 * @param {Object} github - The github object from the action context
 * @param {Object} context - The context object from the action
 * @param {string} message - The message to add as a comment
 * @returns {Promise<void>}
 */
async function createFailureComment(github, context, message) {
  try {
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body: `❌ **Validation Failed**: ${message}`,
    });
  } catch (error) {
    // Log the error but don't fail the workflow because of comment creation issues
    console.error(`Error creating comment: ${error.message}`);
  }
}

module.exports = async ({ context, github, core }) => {
  if (context.eventName === "issue_comment") {
    const { comment } = context.payload;
    if (
      !isAllowed({
        author_association: comment.author_association,
        user: comment.user,
      })
    ) {
      const message = `This workflow can only be triggered by a repository owner, member, or collaborator. @${comment.user.login} (${comment.author_association}) does not have sufficient permissions.`;
      await createFailureComment(github, context, message);
      core.setFailed(message);
    }

    const { data: pullRequest } = await github.rest.pulls.get({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: context.issue.number,
    });
    if (
      !isAllowed({
        author_association: pullRequest.author_association,
        user: pullRequest.user,
      })
    ) {
      const message = `This workflow can only be triggered on PRs filed by a repository owner, member, or collaborator. @${pullRequest.user.login} (${pullRequest.author_association}) does not have sufficient permissions.`;
      await createFailureComment(github, context, message);
      core.setFailed(message);
    }
  } else {
    const message = `This workflow does not support the "${context.eventName}" event type.`;
    await createFailureComment(github, context, message);
    core.setFailed(message);
  }
};
```

--------------------------------------------------------------------------------

---[FILE: python.instructions.md]---
Location: mlflow-master/.github/instructions/python.instructions.md

```text
---
applyTo: "**/*.py"
---

# Python Code Review Instructions

For style conventions and code examples, see [dev/guides/python.md](../../dev/guides/python.md).
```

--------------------------------------------------------------------------------

````
