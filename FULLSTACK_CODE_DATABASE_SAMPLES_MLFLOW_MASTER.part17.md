---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 17
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 17 of 991)

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

---[FILE: check_function_signatures.py]---
Location: mlflow-master/dev/check_function_signatures.py

```python
from __future__ import annotations

import argparse
import ast
import os
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path


def is_github_actions() -> bool:
    return os.environ.get("GITHUB_ACTIONS") == "true"


@dataclass
class Error:
    file_path: Path
    line: int
    column: int
    lines: list[str]

    def format(self, github: bool = False) -> str:
        message = " ".join(self.lines)
        if github:
            return f"::warning file={self.file_path},line={self.line},col={self.column}::{message}"
        else:
            return f"{self.file_path}:{self.line}:{self.column}: {message}"


@dataclass
class Parameter:
    name: str
    position: int | None  # None for keyword-only
    is_required: bool
    is_positional_only: bool
    is_keyword_only: bool
    lineno: int
    col_offset: int


@dataclass
class Signature:
    positional: list[Parameter]  # Includes positional-only and regular positional
    keyword_only: list[Parameter]
    has_var_positional: bool  # *args
    has_var_keyword: bool  # **kwargs


@dataclass
class ParameterError:
    message: str
    param_name: str
    lineno: int
    col_offset: int


def parse_signature(args: ast.arguments) -> Signature:
    """Convert ast.arguments to a Signature dataclass for easier processing."""
    parameters_positional: list[Parameter] = []
    parameters_keyword_only: list[Parameter] = []

    # Process positional-only parameters
    for i, arg in enumerate(args.posonlyargs):
        parameters_positional.append(
            Parameter(
                name=arg.arg,
                position=i,
                is_required=True,  # All positional-only are required
                is_positional_only=True,
                is_keyword_only=False,
                lineno=arg.lineno,
                col_offset=arg.col_offset,
            )
        )

    # Process regular positional parameters
    offset = len(args.posonlyargs)
    first_optional_idx = len(args.posonlyargs + args.args) - len(args.defaults)

    for i, arg in enumerate(args.args):
        pos = offset + i
        parameters_positional.append(
            Parameter(
                name=arg.arg,
                position=pos,
                is_required=pos < first_optional_idx,
                is_positional_only=False,
                is_keyword_only=False,
                lineno=arg.lineno,
                col_offset=arg.col_offset,
            )
        )

    # Process keyword-only parameters
    for arg, default in zip(args.kwonlyargs, args.kw_defaults):
        parameters_keyword_only.append(
            Parameter(
                name=arg.arg,
                position=None,
                is_required=default is None,
                is_positional_only=False,
                is_keyword_only=True,
                lineno=arg.lineno,
                col_offset=arg.col_offset,
            )
        )

    return Signature(
        positional=parameters_positional,
        keyword_only=parameters_keyword_only,
        has_var_positional=args.vararg is not None,
        has_var_keyword=args.kwarg is not None,
    )


def check_signature_compatibility(
    old_fn: ast.FunctionDef | ast.AsyncFunctionDef,
    new_fn: ast.FunctionDef | ast.AsyncFunctionDef,
) -> list[ParameterError]:
    """
    Return list of error messages when *new_fn* is not backward-compatible with *old_fn*,
    or None if compatible.

    Compatibility rules
    -------------------
    • Positional / positional-only parameters
        - Cannot be reordered, renamed, or removed.
        - Adding **required** ones is breaking.
        - Adding **optional** ones is allowed only at the end.
        - Making an optional parameter required is breaking.

    • Keyword-only parameters (order does not matter)
        - Cannot be renamed or removed.
        - Making an optional parameter required is breaking.
        - Adding a required parameter is breaking; adding an optional parameter is fine.
    """
    old_sig = parse_signature(old_fn.args)
    new_sig = parse_signature(new_fn.args)
    errors: list[ParameterError] = []

    # ------------------------------------------------------------------ #
    # 1. Positional / pos-only parameters
    # ------------------------------------------------------------------ #

    # (a) existing parameters must line up
    for idx, old_param in enumerate(old_sig.positional):
        if idx >= len(new_sig.positional):
            errors.append(
                ParameterError(
                    message=f"Positional param '{old_param.name}' was removed.",
                    param_name=old_param.name,
                    lineno=old_param.lineno,
                    col_offset=old_param.col_offset,
                )
            )
            continue

        new_param = new_sig.positional[idx]
        if old_param.name != new_param.name:
            errors.append(
                ParameterError(
                    message=(
                        f"Positional param order/name changed: "
                        f"'{old_param.name}' -> '{new_param.name}'."
                    ),
                    param_name=new_param.name,
                    lineno=new_param.lineno,
                    col_offset=new_param.col_offset,
                )
            )
            # Stop checking further positional params after first order/name mismatch
            break

        if (not old_param.is_required) and new_param.is_required:
            errors.append(
                ParameterError(
                    message=f"Optional positional param '{old_param.name}' became required.",
                    param_name=new_param.name,
                    lineno=new_param.lineno,
                    col_offset=new_param.col_offset,
                )
            )

    # (b) any extra new positional params must be optional and appended
    if len(new_sig.positional) > len(old_sig.positional):
        for idx in range(len(old_sig.positional), len(new_sig.positional)):
            new_param = new_sig.positional[idx]
            if new_param.is_required:
                errors.append(
                    ParameterError(
                        message=f"New required positional param '{new_param.name}' added.",
                        param_name=new_param.name,
                        lineno=new_param.lineno,
                        col_offset=new_param.col_offset,
                    )
                )

    # ------------------------------------------------------------------ #
    # 2. Keyword-only parameters (order-agnostic)
    # ------------------------------------------------------------------ #
    old_kw_names = {p.name for p in old_sig.keyword_only}
    new_kw_names = {p.name for p in new_sig.keyword_only}

    # Build mappings for easier lookup
    old_kw_by_name = {p.name: p for p in old_sig.keyword_only}
    new_kw_by_name = {p.name: p for p in new_sig.keyword_only}

    # removed or renamed
    for name in old_kw_names - new_kw_names:
        old_param = old_kw_by_name[name]
        errors.append(
            ParameterError(
                message=f"Keyword-only param '{name}' was removed.",
                param_name=name,
                lineno=old_param.lineno,
                col_offset=old_param.col_offset,
            )
        )

    # optional -> required upgrades
    for name in old_kw_names & new_kw_names:
        if not old_kw_by_name[name].is_required and new_kw_by_name[name].is_required:
            new_param = new_kw_by_name[name]
            errors.append(
                ParameterError(
                    message=f"Keyword-only param '{name}' became required.",
                    param_name=name,
                    lineno=new_param.lineno,
                    col_offset=new_param.col_offset,
                )
            )

    # new required keyword-only params
    errors.extend(
        ParameterError(
            message=f"New required keyword-only param '{param.name}' added.",
            param_name=param.name,
            lineno=param.lineno,
            col_offset=param.col_offset,
        )
        for param in new_sig.keyword_only
        if param.is_required and param.name not in old_kw_names
    )

    return errors


def _is_private(n: str) -> bool:
    return n.startswith("_") and not n.startswith("__") and not n.endswith("__")


class FunctionSignatureExtractor(ast.NodeVisitor):
    def __init__(self):
        self.functions: dict[str, ast.FunctionDef | ast.AsyncFunctionDef] = {}
        self.stack: list[ast.ClassDef] = []

    def visit_ClassDef(self, node: ast.ClassDef) -> None:
        self.stack.append(node)
        self.generic_visit(node)
        self.stack.pop()

    def visit_FunctionDef(self, node: ast.FunctionDef) -> None:
        # Is this a private function or a function in a private class?
        # If so, skip it.
        if _is_private(node.name) or (self.stack and _is_private(self.stack[-1].name)):
            return

        names = [*(c.name for c in self.stack), node.name]
        self.functions[".".join(names)] = node

    def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef) -> None:
        if _is_private(node.name) or (self.stack and _is_private(self.stack[-1].name)):
            return

        names = [*(c.name for c in self.stack), node.name]
        self.functions[".".join(names)] = node


def get_changed_python_files(base_branch: str = "master") -> list[Path]:
    # In GitHub Actions PR context, we need to fetch the base branch first
    if is_github_actions():
        # Fetch the base branch to ensure we have it locally
        subprocess.check_call(
            ["git", "fetch", "origin", f"{base_branch}:{base_branch}"],
        )

    result = subprocess.check_output(
        ["git", "diff", "--name-only", f"{base_branch}...HEAD"], text=True
    )
    files = [s.strip() for s in result.splitlines()]
    return [Path(f) for f in files if f]


def parse_functions(content: str) -> dict[str, ast.FunctionDef | ast.AsyncFunctionDef]:
    tree = ast.parse(content)
    extractor = FunctionSignatureExtractor()
    extractor.visit(tree)
    return extractor.functions


def get_file_content_at_revision(file_path: Path, revision: str) -> str | None:
    try:
        return subprocess.check_output(["git", "show", f"{revision}:{file_path}"], text=True)
    except subprocess.CalledProcessError as e:
        print(f"Warning: Failed to get file content at revision: {e}", file=sys.stderr)
        return None


def compare_signatures(base_branch: str = "master") -> list[Error]:
    errors: list[Error] = []
    for file_path in get_changed_python_files(base_branch):
        # Ignore non-Python files
        if not file_path.suffix == ".py":
            continue

        # Ignore files not in the mlflow directory
        if file_path.parts[0] != "mlflow":
            continue

        # Ignore private modules
        if any(part.startswith("_") for part in file_path.parts):
            continue

        base_content = get_file_content_at_revision(file_path, base_branch)
        if base_content is None:
            # Find not found in the base branch, likely added in the current branch
            continue

        if not file_path.exists():
            # File not found, likely deleted in the current branch
            continue

        current_content = file_path.read_text()
        base_functions = parse_functions(base_content)
        current_functions = parse_functions(current_content)
        for func_name in set(base_functions.keys()) & set(current_functions.keys()):
            base_func = base_functions[func_name]
            current_func = current_functions[func_name]
            if param_errors := check_signature_compatibility(base_func, current_func):
                # Create individual errors for each problematic parameter
                errors.extend(
                    Error(
                        file_path=file_path,
                        line=param_error.lineno,
                        column=param_error.col_offset + 1,
                        lines=[
                            "[Non-blocking | Ignore if not public API]",
                            param_error.message,
                            f"This change will break existing `{func_name}` calls.",
                            "If this is not intended, please fix it.",
                        ],
                    )
                    for param_error in param_errors
                )

    return errors


@dataclass
class Args:
    base_branch: str


def parse_args() -> Args:
    parser = argparse.ArgumentParser(
        description="Check for breaking changes in Python function signatures"
    )
    parser.add_argument("--base-branch", default=os.environ.get("GITHUB_BASE_REF", "master"))
    args = parser.parse_args()
    return Args(base_branch=args.base_branch)


def main():
    args = parse_args()
    errors = compare_signatures(args.base_branch)
    for error in errors:
        print(error.format(github=is_github_actions()))


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: check_init_py.py]---
Location: mlflow-master/dev/check_init_py.py

```python
"""
Pre-commit hook to check for missing `__init__.py` files in mlflow and tests directories.

This script ensures that all directories under the mlflow package and tests directory that contain
Python files also have an `__init__.py` file. This prevents `setuptools` from excluding these
directories during package build and ensures test modules are properly structured.

Usage:
    uv run dev/check_init_py.py

Requirements:
- If `mlflow/foo/bar.py` exists, `mlflow/foo/__init__.py` must exist.
- If `tests/foo/test_bar.py` exists, `tests/foo/__init__.py` must exist.
- Only test files (starting with `test_`) in the tests directory are checked.
- All parent directories of Python files are checked recursively for `__init__.py`.
- Ignore directories that do not contain any Python files (e.g., `mlflow/server/js`).
"""

import subprocess
import sys
from pathlib import Path


def get_tracked_python_files() -> list[Path]:
    try:
        result = subprocess.check_output(
            ["git", "ls-files", "mlflow/**/*.py", "tests/**/*.py"],
            text=True,
        )
        paths = (Path(f) for f in result.splitlines() if f)
        return [p for p in paths if not p.is_relative_to("tests") or p.name.startswith("test_")]
    except subprocess.CalledProcessError as e:
        print(f"Error running git ls-files: {e}", file=sys.stderr)
        sys.exit(1)


def main() -> int:
    python_files = get_tracked_python_files()
    if not python_files:
        return 0

    python_dirs = {p for f in python_files for p in f.parents if p != Path(".")}
    if missing_init_files := [d for d in python_dirs if not (d / "__init__.py").exists()]:
        print("Error: The following directories contain Python files but lack __init__.py:")
        for d in sorted(missing_init_files):
            print(f"  {d.as_posix()}/")
        print("Please add __init__.py files to the directories listed above.")
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
```

--------------------------------------------------------------------------------

---[FILE: check_patch_prs.py]---
Location: mlflow-master/dev/check_patch_prs.py

```python
import argparse
import os
import re
import subprocess
import sys
import tempfile
from dataclasses import dataclass

import requests


def get_release_branch(version):
    major_minor_version = ".".join(version.split(".")[:2])
    return f"branch-{major_minor_version}"


@dataclass(frozen=True)
class Commit:
    sha: str
    pr_num: int


def get_commits(branch: str):
    """
    Get the commits in the release branch.
    """
    with tempfile.TemporaryDirectory() as tmpdir:
        subprocess.check_call(
            [
                "git",
                "clone",
                "--shallow-since=3 months ago",
                "--branch",
                branch,
                "https://github.com/mlflow/mlflow.git",
                tmpdir,
            ],
        )
        log_stdout = subprocess.check_output(
            [
                "git",
                "log",
                "--pretty=format:%H %s",
            ],
            text=True,
            cwd=tmpdir,
        )
        pr_rgx = re.compile(r"([a-z0-9]+) .+\s+\(#(\d+)\)$")
        return [
            Commit(sha=m.group(1), pr_num=int(m.group(2)))
            for commit in log_stdout.splitlines()
            if (m := pr_rgx.search(commit.rstrip()))
        ]


@dataclass(frozen=True)
class PR:
    pr_num: int
    merged: bool


def is_closed(pr):
    return pr["state"] == "closed" and pr["pull_request"]["merged_at"] is None


def fetch_patch_prs(version):
    """
    Fetch PRs labeled with `v{version}` from the MLflow repository.
    """
    label = f"v{version}"
    per_page = 100
    page = 1
    pulls = []
    while True:
        response = requests.get(
            f'https://api.github.com/search/issues?q=is:pr+repo:mlflow/mlflow+label:"{label}"&per_page={per_page}&page={page}',
        )
        response.raise_for_status()
        data = response.json()
        # Exclude closed PRs that are not merged
        pulls.extend(pr for pr in data["items"] if not is_closed(pr))
        if len(data) < per_page:
            break
        page += 1

    return {pr["number"]: pr["pull_request"].get("merged_at") is not None for pr in pulls}


def main(version, dry_run):
    release_branch = get_release_branch(version)
    commits = get_commits(release_branch)
    patch_prs = fetch_patch_prs(version)
    if not_cherry_picked := set(patch_prs) - {c.pr_num for c in commits}:
        print(f"The following patch PRs are not cherry-picked to {release_branch}:")
        for idx, pr_num in enumerate(sorted(not_cherry_picked)):
            merged = patch_prs[pr_num]
            url = f"https://github.com/mlflow/mlflow/pull/{pr_num} (merged: {merged})"
            line = f"  {idx + 1}. {url}"
            if not merged:
                line = f"\033[91m{line}\033[0m"  # Red color using ANSI escape codes
            print(line)

        master_commits = get_commits("master")
        cherry_picks = [c.sha for c in master_commits if c.pr_num in not_cherry_picked]
        # reverse the order of cherry-picks to maintain the order of PRs
        print("\n# Steps to cherry-pick the patch PRs:")
        print(
            f"1. Make sure your local master and {release_branch} branches are synced with "
            "upstream."
        )
        print(f"2. Cut a new branch from {release_branch} (e.g. {release_branch}-cherry-picks).")
        print("3. Run the following command on the new branch:\n")
        print("git cherry-pick " + " ".join(cherry_picks[::-1]))
        print(f"\n4. File a PR against {release_branch}.")
        sys.exit(0 if dry_run else 1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--version", required=True, help="The version to release")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        default=os.environ.get("DRY_RUN", "true").lower() == "true",
        help="Dry run mode (default: True, can be set via DRY_RUN env var)",
    )
    parser.add_argument(
        "--no-dry-run",
        action="store_false",
        dest="dry_run",
        help="Disable dry run mode",
    )
    args = parser.parse_args()
    main(args.version, args.dry_run)
```

--------------------------------------------------------------------------------

---[FILE: check_whitespace_only.py]---
Location: mlflow-master/dev/check_whitespace_only.py

```python
"""
Detect files where all changes are whitespace-only.

This helps avoid unnecessary commit history noise from whitespace-only changes.
"""

import argparse
import json
import os
import sys
import urllib.request

BYPASS_LABEL = "allow-whitespace-only"


def github_api_request(url: str, accept: str) -> str:
    headers = {
        "Accept": accept,
        "X-GitHub-Api-Version": "2022-11-28",
    }

    if github_token := os.environ.get("GITHUB_TOKEN"):
        headers["Authorization"] = f"Bearer {github_token}"

    request = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8")


def get_pr_diff(owner: str, repo: str, pull_number: int) -> str:
    url = f"https://github.com/{owner}/{repo}/pull/{pull_number}.diff"
    request = urllib.request.Request(url)
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8")


def get_pr_labels(owner: str, repo: str, pull_number: int) -> list[str]:
    url = f"https://api.github.com/repos/{owner}/{repo}/pulls/{pull_number}"
    data = json.loads(github_api_request(url, "application/vnd.github.v3+json"))
    return [label_obj["name"] for label_obj in data.get("labels", [])]


def parse_diff(diff_text: str | None) -> list[str]:
    if not diff_text:
        return []

    files: list[str] = []
    current_file: str | None = None
    changes: list[str] = []

    for line in diff_text.split("\n"):
        if line.startswith("diff --git"):
            if current_file and changes and all(c.strip() == "" for c in changes):
                files.append(current_file)

            current_file = None
            changes = []

        elif line.startswith("--- a/"):
            current_file = None if line == "--- /dev/null" else line[6:]

        elif line.startswith("+++ b/"):
            current_file = None if line == "+++ /dev/null" else line[6:]

        elif line.startswith("+") or line.startswith("-"):
            content = line[1:]
            changes.append(content)

    if current_file and changes and all(c.strip() == "" for c in changes):
        files.append(current_file)

    return files


def parse_args() -> tuple[str, str, int]:
    parser = argparse.ArgumentParser(
        description="Check for unnecessary whitespace-only changes in the diff"
    )
    parser.add_argument(
        "--repo",
        required=True,
        help='Repository in the format "owner/repo" (e.g., "mlflow/mlflow")',
    )
    parser.add_argument(
        "--pr",
        type=int,
        required=True,
        help="Pull request number",
    )
    args = parser.parse_args()

    owner, repo = args.repo.split("/")
    return owner, repo, args.pr


def main() -> None:
    owner, repo, pull_number = parse_args()
    diff_text = get_pr_diff(owner, repo, pull_number)
    if files := parse_diff(diff_text):
        pr_labels = get_pr_labels(owner, repo, pull_number)
        has_bypass_label = BYPASS_LABEL in pr_labels

        level = "warning" if has_bypass_label else "error"
        message = (
            f"This file only has whitespace changes (bypassed with '{BYPASS_LABEL}' label)."
            if has_bypass_label
            else (
                f"This file only has whitespace changes. "
                f"Please revert them or apply the '{BYPASS_LABEL}' label to bypass this check "
                f"if they are necessary."
            )
        )

        for file_path in files:
            # https://docs.github.com/en/actions/reference/workflow-commands-for-github-actions
            print(f"::{level} file={file_path},line=1,col=1::{message}")

        if not has_bypass_label:
            sys.exit(1)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: create_release_branch.py]---
Location: mlflow-master/dev/create_release_branch.py

```python
import argparse
import os
import subprocess

from packaging.version import Version


def main(new_version: str, remote: str, dry_run=False):
    version = Version(new_version)
    release_branch = f"branch-{version.major}.{version.minor}"
    exists_on_remote = (
        subprocess.check_output(
            ["git", "ls-remote", "--heads", remote, release_branch], text=True
        ).strip()
        != ""
    )
    if exists_on_remote:
        print(f"{release_branch} already exists on {remote}, skipping branch creation")
        return

    prev_branch = subprocess.check_output(["git", "branch", "--show-current"], text=True).strip()
    try:
        exists_on_local = (
            subprocess.check_output(["git", "branch", "--list", release_branch], text=True).strip()
            != ""
        )
        if exists_on_local:
            print(f"Deleting existing {release_branch}")
            subprocess.check_call(["git", "branch", "-D", release_branch])

        print(f"Creating {release_branch}")
        subprocess.check_call(["git", "checkout", "-b", release_branch, "master"])
        print(f"Pushing {release_branch} to {remote}")
        subprocess.check_call(
            ["git", "push", remote, release_branch, *(["--dry-run"] if dry_run else [])]
        )
    finally:
        subprocess.check_call(["git", "checkout", prev_branch])


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create a release branch")
    parser.add_argument("--new-version", required=True, help="New version to release")
    parser.add_argument("--remote", default="origin", help="Git remote to use (default: origin)")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        default=os.environ.get("DRY_RUN", "true").lower() == "true",
        help="Dry run mode (default: True, can be set via DRY_RUN env var)",
    )
    parser.add_argument(
        "--no-dry-run",
        action="store_false",
        dest="dry_run",
        help="Disable dry run mode",
    )
    args = parser.parse_args()
    main(args.new_version, args.remote, args.dry_run)
```

--------------------------------------------------------------------------------

---[FILE: create_release_tag.py]---
Location: mlflow-master/dev/create_release_tag.py

```python
"""
How to test this script
-----------------------
# Ensure origin points to your fork
git remote -v | grep origin

# Pretend we're releasing MLflow 9.0.0
git checkout -b branch-9.0

# First, test the dry run mode
python dev/create_release_tag.py --new-version 9.0.0 --dry-run
git tag -d v9.0.0

# Open https://github.com/<username>/mlflow/tree/v9.0.0 and verify that the tag does not exist.

# Then, test the non-dry run mode
python dev/create_release_tag.py --new-version 9.0.0 --no-dry-run
git tag -d v9.0.0

# Open https://github.com/<username>/mlflow/tree/v9.0.0 and verify that the tag exists now.

# Clean up the remote tag
git push --delete origin v9.0.0

# Clean up the local release branch
git checkout master
git branch -D branch-9.0
"""

import argparse
import os
import subprocess


def main(new_version: str, remote: str, dry_run: bool = False):
    release_tag = f"v{new_version}"
    subprocess.check_call(["git", "tag", release_tag])
    subprocess.check_call(["git", "push", remote, release_tag, *(["--dry-run"] if dry_run else [])])


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create a release tag")
    parser.add_argument("--new-version", required=True, help="New version to release")
    parser.add_argument("--remote", default="origin", help="Git remote to use (default: origin)")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        default=os.environ.get("DRY_RUN", "true").lower() == "true",
        help="Dry run mode (default: True, can be set via DRY_RUN env var)",
    )
    parser.add_argument(
        "--no-dry-run",
        action="store_false",
        dest="dry_run",
        help="Disable dry run mode",
    )
    args = parser.parse_args()
    main(args.new_version, args.remote, args.dry_run)
```

--------------------------------------------------------------------------------

````
