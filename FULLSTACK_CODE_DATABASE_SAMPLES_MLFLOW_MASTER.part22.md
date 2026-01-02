---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 22
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 22 of 991)

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

---[FILE: xtest_viz.py]---
Location: mlflow-master/dev/xtest_viz.py

```python
# /// script
# dependencies = [
#     "pandas",
#     "tabulate",
#     "aiohttp",
# ]
# ///
"""
Script to visualize cross-version test results for MLflow autologging and models.

This script fetches scheduled workflow run results from GitHub Actions and generates
a markdown table showing the test status for different package versions across
different dates.

Usage:
    uv run dev/xtest_viz.py                      # Fetch last 14 days from mlflow/dev
    uv run dev/xtest_viz.py --days 30            # Fetch last 30 days
    uv run dev/xtest_viz.py --repo mlflow/mlflow  # Use different repo

Example output (truncated for brevity):
    | Name                                   | 2024-01-15 | 2024-01-14 | 2024-01-13 |
    |----------------------------------------|------------|------------|------------|
    | test1 (sklearn, 1.3.1, autologging...) | [✅](link) | [✅](link) | [❌](link) |
    | test1 (pytorch, 2.1.0, models...)      | [✅](link) | [⚠️](link) | [✅](link) |
    | test2 (xgboost, 2.0.0, autologging...) | [❌](link) | [✅](link) | —          |

Where:
    ✅ = success
    ❌ = failure
    ⚠️ = cancelled
    ❓ = unknown status
    — = no data
"""

import argparse
import asyncio
import os
import re
import sys
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any

import aiohttp
import pandas as pd


@dataclass
class JobResult:
    name: str
    date: str
    status: str


class XTestViz:
    def __init__(self, github_token: str | None = None, repo: str = "mlflow/dev"):
        self.github_token = github_token or os.getenv("GITHUB_TOKEN")
        self.repo = repo
        self.per_page = 30
        self.headers: dict[str, str] = {}
        if self.github_token:
            self.headers["Authorization"] = f"token {self.github_token}"
            self.headers["Accept"] = "application/vnd.github.v3+json"

    def status_to_emoji(self, status: str) -> str | None:
        """Convert job status to emoji representation.

        Returns None for skipped status to indicate it should be filtered out.
        """
        match status:
            case "success":
                return "✅"
            case "failure":
                return "❌"
            case "cancelled":
                return "⚠️"
            case "skipped":
                return None
            case _:
                return "❓"

    def parse_job_name(self, job_name: str) -> str:
        """Extract string inside parentheses from job name.

        Examples:
        - "test1 (sklearn / autologging / 1.3.1)" -> "sklearn / autologging / 1.3.1"
        - "test2 (pytorch / models / 2.1.0)" -> "pytorch / models / 2.1.0"

        Returns:
            str: Content inside parentheses, or original name if no parentheses found
        """
        # Pattern to match: anything (content)
        pattern = r"\(([^)]+)\)"
        if match := re.search(pattern, job_name.strip()):
            return match.group(1).strip()

        return job_name

    async def _make_request(
        self,
        session: aiohttp.ClientSession,
        url: str,
        params: dict[str, str] | None = None,
    ) -> dict[str, Any]:
        """Make an async HTTP GET request and return JSON response."""
        async with session.get(url, headers=self.headers, params=params) as response:
            response.raise_for_status()
            return await response.json()

    async def get_workflow_runs(
        self, session: aiohttp.ClientSession, days_back: int = 30
    ) -> list[dict[str, Any]]:
        """Fetch cross-version test workflow runs from the last N days."""
        since_date = (datetime.now() - timedelta(days=days_back)).isoformat()

        print(f"Fetching scheduled workflow runs from last {days_back} days...", file=sys.stderr)

        all_runs: list[dict[str, Any]] = []
        page = 1

        while True:
            params = {
                "per_page": str(self.per_page),
                "page": str(page),
                "created": f">={since_date}",
                "status": "completed",
                "event": "schedule",
            }
            url = f"https://api.github.com/repos/{self.repo}/actions/workflows/cross-version-tests.yml/runs"

            data = await self._make_request(session, url, params=params)
            runs = data.get("workflow_runs", [])

            if not runs:
                break

            all_runs.extend(runs)

            print(f"  Fetched page {page} ({len(runs)} runs)", file=sys.stderr)

            if len(runs) < self.per_page:
                break

            page += 1

        print(f"Found {len(all_runs)} scheduled workflow runs total", file=sys.stderr)

        return all_runs

    async def get_workflow_jobs(
        self, session: aiohttp.ClientSession, run_id: int
    ) -> list[dict[str, Any]]:
        """Get jobs for a specific workflow run."""
        all_jobs: list[dict[str, Any]] = []
        page = 1

        while True:
            params = {"per_page": str(self.per_page), "page": str(page)}
            url = f"https://api.github.com/repos/{self.repo}/actions/runs/{run_id}/jobs"

            data = await self._make_request(session, url, params=params)
            jobs = data.get("jobs", [])

            if not jobs:
                break

            all_jobs.extend(jobs)

            if len(jobs) < self.per_page:
                break

            page += 1

        return all_jobs

    async def _fetch_run_jobs(
        self, session: aiohttp.ClientSession, run: dict[str, Any]
    ) -> list[JobResult]:
        """Fetch jobs for a single workflow run."""
        run_id = run["id"]
        run_date = datetime.fromisoformat(run["created_at"].replace("Z", "+00:00")).strftime(
            "%m/%d"
        )

        jobs = await self.get_workflow_jobs(session, run_id)
        data_rows = []

        for job in jobs:
            emoji = self.status_to_emoji(job["conclusion"])
            if emoji is None:  # Skip this job
                continue

            job_url = job["html_url"]
            status_link = f"[{emoji}]({job_url})"

            parsed_name = self.parse_job_name(job["name"])

            data_rows.append(
                JobResult(
                    name=parsed_name,
                    date=run_date,
                    status=status_link,
                )
            )

        return data_rows

    async def fetch_all_jobs(self, days_back: int = 30) -> list[JobResult]:
        """Fetch all jobs from workflow runs in the specified time period."""
        async with aiohttp.ClientSession() as session:
            workflow_runs = await self.get_workflow_runs(session, days_back)

            if not workflow_runs:
                return []

            print(
                f"Fetching jobs for {len(workflow_runs)} workflow runs concurrently...",
                file=sys.stderr,
            )

            tasks = [self._fetch_run_jobs(session, run) for run in workflow_runs]

            results = await asyncio.gather(*tasks, return_exceptions=True)
            data_rows = []

            for i, result in enumerate(results, 1):
                if isinstance(result, Exception):
                    print(f"  Error fetching jobs for run {i}: {result}", file=sys.stderr)
                else:
                    data_rows.extend(result)
                    print(
                        f"  Completed {i}/{len(workflow_runs)} ({len(result)} jobs)",
                        file=sys.stderr,
                    )

            return data_rows

    def render_results_table(self, data_rows: list[JobResult]) -> str:
        """Render job data as a markdown table."""
        if not data_rows:
            return "No test jobs found."

        df_data = [{"Name": row.name, "Date": row.date, "Status": row.status} for row in data_rows]
        df = pd.DataFrame(df_data)

        pivot_df = df.pivot_table(
            index="Name",
            columns="Date",
            values="Status",
            aggfunc="first",
        )

        pivot_df = pivot_df[sorted(pivot_df.columns, reverse=True)]

        pivot_df = pivot_df.sort_index()

        pivot_df = pivot_df.fillna("—")

        pivot_df = pivot_df.reset_index()

        return pivot_df.to_markdown(index=False, tablefmt="pipe")

    async def generate_results_table(self, days_back: int = 30) -> str:
        """Generate markdown table of cross-version test results."""
        data_rows = await self.fetch_all_jobs(days_back)
        if not data_rows:
            return "No workflow runs found in the specified time period."
        return self.render_results_table(data_rows)


async def main() -> None:
    parser = argparse.ArgumentParser(description="Visualize MLflow cross-version test results")
    parser.add_argument(
        "--days", type=int, default=14, help="Number of days back to fetch results (default: 14)"
    )
    parser.add_argument(
        "--repo",
        default="mlflow/dev",
        help="GitHub repository in owner/repo format (default: mlflow/dev)",
    )
    parser.add_argument("--token", help="GitHub token (default: use GITHUB_TOKEN env var)")

    args = parser.parse_args()

    token = args.token or os.getenv("GITHUB_TOKEN")
    if not token:
        print(
            "Warning: No GitHub token provided. API requests may be rate-limited.", file=sys.stderr
        )
        print("Set GITHUB_TOKEN environment variable or use --token option.", file=sys.stderr)

    visualizer = XTestViz(github_token=token, repo=args.repo)
    output = await visualizer.generate_results_table(args.days)
    print(output)


if __name__ == "__main__":
    asyncio.run(main())
```

--------------------------------------------------------------------------------

---[FILE: pyproject.toml]---
Location: mlflow-master/dev/clint/pyproject.toml

```toml
[build-system]
requires = ["setuptools"]
build-backend = "setuptools.build_meta"

[project]
name = "clint"
version = "0.1.0"
description = "A custom linter for mlflow to enforce rules that ruff doesn't cover."
readme = "README.md"
authors = [{ name = "mlflow", email = "mlflow@mlflow.com" }]
dependencies = ["tomli", "typing_extensions"]

[tool.setuptools]
package-dir = { "" = "src" }

[project.scripts]
clint = "clint:main"
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/dev/clint/README.md

```text
# Clint

A custom linter for mlflow to enforce rules that ruff doesn't cover.

## Installation

```
pip install -e dev/clint
```

## Usage

```bash
clint file.py ...
```

## Integrating with Visual Studio Code

1. Install [the Pylint extension](https://marketplace.visualstudio.com/items?itemName=ms-python.pylint)
2. Add the following setting in your `settings.json` file:

```json
{
  "pylint.path": ["${interpreter}", "-m", "clint"]
}
```

## Ignoring Rules for Specific Files or Lines

**To ignore a rule on a specific line (recommended):**

```python
foo()  # clint: disable=<rule_name>
```

Replace `<rule_name>` with the actual rule you want to disable.

**To ignore a rule for an entire file:**

Add the file path to the `exclude` list in your `pyproject.toml`:

```toml
[tool.clint]
exclude = [
  # ...existing entries...
  "path/to/file.py",
]
```

## Testing

```bash
pytest dev/clint
```
```

--------------------------------------------------------------------------------

---[FILE: builtin.py]---
Location: mlflow-master/dev/clint/src/clint/builtin.py

```python
# https://github.com/PyCQA/isort/blob/b818cec889657cb786beafe94a6641f8fc0f0e64/isort/stdlibs/py311.py
BUILTIN_MODULES = {
    "_ast",
    "_thread",
    "abc",
    "aifc",
    "argparse",
    "array",
    "ast",
    "asynchat",
    "asyncio",
    "asyncore",
    "atexit",
    "audioop",
    "base64",
    "bdb",
    "binascii",
    "bisect",
    "builtins",
    "bz2",
    "cProfile",
    "calendar",
    "cgi",
    "cgitb",
    "chunk",
    "cmath",
    "cmd",
    "code",
    "codecs",
    "codeop",
    "collections",
    "colorsys",
    "compileall",
    "concurrent",
    "configparser",
    "contextlib",
    "contextvars",
    "copy",
    "copyreg",
    "crypt",
    "csv",
    "ctypes",
    "curses",
    "dataclasses",
    "datetime",
    "dbm",
    "decimal",
    "difflib",
    "dis",
    "distutils",
    "doctest",
    "email",
    "encodings",
    "ensurepip",
    "enum",
    "errno",
    "faulthandler",
    "fcntl",
    "filecmp",
    "fileinput",
    "fnmatch",
    "fractions",
    "ftplib",
    "functools",
    "gc",
    "getopt",
    "getpass",
    "gettext",
    "glob",
    "graphlib",
    "grp",
    "gzip",
    "hashlib",
    "heapq",
    "hmac",
    "html",
    "http",
    "idlelib",
    "imaplib",
    "imghdr",
    "imp",
    "importlib",
    "inspect",
    "io",
    "ipaddress",
    "itertools",
    "json",
    "keyword",
    "lib2to3",
    "linecache",
    "locale",
    "logging",
    "lzma",
    "mailbox",
    "mailcap",
    "marshal",
    "math",
    "mimetypes",
    "mmap",
    "modulefinder",
    "msilib",
    "msvcrt",
    "multiprocessing",
    "netrc",
    "nis",
    "nntplib",
    "ntpath",
    "numbers",
    "operator",
    "optparse",
    "os",
    "ossaudiodev",
    "pathlib",
    "pdb",
    "pickle",
    "pickletools",
    "pipes",
    "pkgutil",
    "platform",
    "plistlib",
    "poplib",
    "posix",
    "posixpath",
    "pprint",
    "profile",
    "pstats",
    "pty",
    "pwd",
    "py_compile",
    "pyclbr",
    "pydoc",
    "queue",
    "quopri",
    "random",
    "re",
    "readline",
    "reprlib",
    "resource",
    "rlcompleter",
    "runpy",
    "sched",
    "secrets",
    "select",
    "selectors",
    "shelve",
    "shlex",
    "shutil",
    "signal",
    "site",
    "smtpd",
    "smtplib",
    "sndhdr",
    "socket",
    "socketserver",
    "spwd",
    "sqlite3",
    "sre",
    "sre_compile",
    "sre_constants",
    "sre_parse",
    "ssl",
    "stat",
    "statistics",
    "string",
    "stringprep",
    "struct",
    "subprocess",
    "sunau",
    "symtable",
    "sys",
    "sysconfig",
    "syslog",
    "tabnanny",
    "tarfile",
    "telnetlib",
    "tempfile",
    "termios",
    "test",
    "textwrap",
    "threading",
    "time",
    "timeit",
    "tkinter",
    "token",
    "tokenize",
    "tomllib",
    "trace",
    "traceback",
    "tracemalloc",
    "tty",
    "turtle",
    "turtledemo",
    "types",
    "typing",
    "unicodedata",
    "unittest",
    "urllib",
    "uu",
    "uuid",
    "venv",
    "warnings",
    "wave",
    "weakref",
    "webbrowser",
    "winreg",
    "winsound",
    "wsgiref",
    "xdrlib",
    "xml",
    "xmlrpc",
    "zipapp",
    "zipfile",
    "zipimport",
    "zlib",
    "zoneinfo",
}
```

--------------------------------------------------------------------------------

---[FILE: comments.py]---
Location: mlflow-master/dev/clint/src/clint/comments.py

```python
import io
import re
import tokenize
from dataclasses import dataclass
from typing import TYPE_CHECKING, Iterator

from typing_extensions import Self

if TYPE_CHECKING:
    from clint.linter import Position

NOQA_REGEX = re.compile(r"#\s*noqa\s*:\s*([A-Z]\d+(?:\s*,\s*[A-Z]\d+)*)", re.IGNORECASE)


@dataclass
class Noqa:
    start: "Position"
    end: "Position"
    rules: set[str]

    @classmethod
    def from_token(cls, token: tokenize.TokenInfo) -> Self | None:
        # Import here to avoid circular dependency
        from clint.linter import Position

        if match := NOQA_REGEX.match(token.string):
            rules = set(match.group(1).upper().split(","))
            start = Position(token.start[0], token.start[1])
            end = Position(token.end[0], token.end[1])
            return cls(start=start, end=end, rules=rules)
        return None


def iter_comments(code: str) -> Iterator[tokenize.TokenInfo]:
    readline = io.StringIO(code).readline
    try:
        tokens = tokenize.generate_tokens(readline)
        for token in tokens:
            if token.type == tokenize.COMMENT:
                yield token

    except tokenize.TokenError:
        # Handle incomplete tokens at end of file
        pass
```

--------------------------------------------------------------------------------

---[FILE: config.py]---
Location: mlflow-master/dev/clint/src/clint/config.py

```python
import re
from dataclasses import dataclass, field

import tomli
from typing_extensions import Self

from clint.rules import ALL_RULES
from clint.utils import get_repo_root


def _validate_exclude_paths(exclude_paths: list[str]) -> None:
    """Validate that all paths in the exclude list exist.

    Args:
        exclude_paths: List of file/directory paths to validate (relative to repo root)

    Raises:
        ValueError: If any path in the exclude list does not exist
    """
    if not exclude_paths:
        return

    repo_root = get_repo_root()
    if non_existing_paths := [path for path in exclude_paths if not (repo_root / path).exists()]:
        raise ValueError(
            f"Non-existing paths found in exclude field: {non_existing_paths}. "
            f"All paths in the exclude list must exist."
        )


@dataclass
class Config:
    select: set[str] = field(default_factory=set)
    exclude: list[str] = field(default_factory=list)
    # Path -> List of modules that should not be imported globally under that path
    forbidden_top_level_imports: dict[str, list[str]] = field(default_factory=dict)
    typing_extensions_allowlist: list[str] = field(default_factory=list)
    example_rules: list[str] = field(default_factory=list)
    # Compiled regex pattern -> Set of rule names to ignore for files matching the pattern
    per_file_ignores: dict[re.Pattern[str], set[str]] = field(default_factory=dict)

    @classmethod
    def load(cls) -> Self:
        repo_root = get_repo_root()
        pyproject = repo_root / "pyproject.toml"
        if not pyproject.exists():
            return cls()

        with pyproject.open("rb") as f:
            data = tomli.load(f)

        clint = data.get("tool", {}).get("clint", {})
        if not clint:
            return cls()

        per_file_ignores_raw = clint.get("per-file-ignores", {})
        per_file_ignores: dict[re.Pattern[str], set[str]] = {}
        for pattern, rules in per_file_ignores_raw.items():
            per_file_ignores[re.compile(pattern)] = set(rules)

        select = clint.get("select")
        if select is None:
            select = ALL_RULES
        else:
            if unknown_rules := set(select) - ALL_RULES:
                raise ValueError(f"Unknown rules in 'select': {unknown_rules}")
            select = set(select)

        exclude_paths = clint.get("exclude", [])
        _validate_exclude_paths(exclude_paths)

        return cls(
            select=select,
            exclude=exclude_paths,
            forbidden_top_level_imports=clint.get("forbidden-top-level-imports", {}),
            typing_extensions_allowlist=clint.get("typing-extensions-allowlist", []),
            example_rules=clint.get("example-rules", []),
            per_file_ignores=per_file_ignores,
        )
```

--------------------------------------------------------------------------------

---[FILE: index.py]---
Location: mlflow-master/dev/clint/src/clint/index.py

```python
"""Symbol indexing for MLflow codebase.

This module provides efficient indexing and lookup of Python symbols (functions, classes)
across the MLflow codebase using AST parsing and parallel processing.

Key components:
- FunctionInfo: Lightweight function signature information
- ModuleSymbolExtractor: AST visitor for extracting symbols from modules
- SymbolIndex: Main index class for symbol resolution and lookup

Example usage:

```python
# Build an index of all MLflow symbols
index = SymbolIndex.build()

# Look up function signature information
func_info = index.resolve("mlflow.log_metric")
print(f"Arguments: {func_info.args}")  # -> ['key, 'value', 'step', ...]
```
"""

import ast
import multiprocessing
import pickle
import subprocess
from concurrent.futures import ProcessPoolExecutor, as_completed
from dataclasses import dataclass, field
from pathlib import Path

from typing_extensions import Self

from clint.utils import get_repo_root


@dataclass
class FunctionInfo:
    """Lightweight function signature information for efficient serialization."""

    has_vararg: bool  # *args
    has_kwarg: bool  # **kwargs
    args: list[str] = field(default_factory=list)  # Regular arguments
    kwonlyargs: list[str] = field(default_factory=list)  # Keyword-only arguments
    posonlyargs: list[str] = field(default_factory=list)  # Positional-only arguments

    @classmethod
    def from_func_def(
        cls, node: ast.FunctionDef | ast.AsyncFunctionDef, skip_self: bool = False
    ) -> Self:
        """Create FunctionInfo from an AST function definition node."""
        args = node.args.args
        if skip_self and args:
            args = args[1:]  # Skip 'self' for methods

        return cls(
            has_vararg=node.args.vararg is not None,
            has_kwarg=node.args.kwarg is not None,
            args=[arg.arg for arg in args],
            kwonlyargs=[arg.arg for arg in node.args.kwonlyargs],
            posonlyargs=[arg.arg for arg in node.args.posonlyargs],
        )

    @property
    def all_args(self) -> list[str]:
        return self.posonlyargs + self.args + self.kwonlyargs


class ModuleSymbolExtractor(ast.NodeVisitor):
    """Extracts function definitions and import mappings from a Python module."""

    def __init__(self, mod: str) -> None:
        self.mod = mod
        self.import_mapping: dict[str, str] = {}
        self.func_mapping: dict[str, FunctionInfo] = {}

    def visit_Import(self, node: ast.Import) -> None:
        for alias in node.names:
            if not alias.name.startswith("mlflow."):
                continue
            if alias.asname:
                self.import_mapping[f"{self.mod}.{alias.asname}"] = alias.name

    def visit_ImportFrom(self, node: ast.ImportFrom) -> None:
        if node.module is None or not node.module.startswith("mlflow."):
            return
        for alias in node.names:
            if alias.name.startswith("_"):
                continue
            if alias.asname:
                self.import_mapping[f"{self.mod}.{alias.asname}"] = f"{node.module}.{alias.name}"
            else:
                self.import_mapping[f"{self.mod}.{alias.name}"] = f"{node.module}.{alias.name}"

    def visit_FunctionDef(self, node: ast.FunctionDef) -> None:
        if node.name.startswith("_"):
            return
        self.func_mapping[f"{self.mod}.{node.name}"] = FunctionInfo.from_func_def(node)

    def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef) -> None:
        if node.name.startswith("_"):
            return
        self.func_mapping[f"{self.mod}.{node.name}"] = FunctionInfo.from_func_def(node)

    def visit_ClassDef(self, node: ast.ClassDef) -> None:
        for stmt in node.body:
            if isinstance(stmt, ast.FunctionDef):
                if stmt.name == "__init__":
                    info = FunctionInfo.from_func_def(stmt, skip_self=True)
                    self.func_mapping[f"{self.mod}.{node.name}"] = info
                elif any(
                    isinstance(deco, ast.Name) and deco.id in ("classmethod", "staticmethod")
                    for deco in stmt.decorator_list
                ):
                    info = FunctionInfo.from_func_def(stmt, skip_self=True)
                    self.func_mapping[f"{self.mod}.{node.name}.{stmt.name}"] = info
        else:
            # If no __init__ found, still add the class with *args and **kwargs
            self.func_mapping[f"{self.mod}.{node.name}"] = FunctionInfo(
                has_vararg=True, has_kwarg=True
            )


def extract_symbols_from_file(
    rel_path: str, content: str
) -> tuple[dict[str, str], dict[str, FunctionInfo]] | None:
    """Extract function definitions and import mappings from a Python file."""
    p = Path(rel_path)
    if not p.parts or p.parts[0] != "mlflow":
        return None

    try:
        tree = ast.parse(content)
    except (SyntaxError, UnicodeDecodeError):
        return None

    mod_name = (
        ".".join(p.parts[:-1]) if p.name == "__init__.py" else ".".join([*p.parts[:-1], p.stem])
    )

    extractor = ModuleSymbolExtractor(mod_name)
    extractor.visit(tree)
    return extractor.import_mapping, extractor.func_mapping


class SymbolIndex:
    """Index of all symbols (functions, classes) in the MLflow codebase."""

    def __init__(
        self,
        import_mapping: dict[str, str],
        func_mapping: dict[str, FunctionInfo],
    ) -> None:
        self.import_mapping = import_mapping
        self.func_mapping = func_mapping

    def save(self, path: Path) -> None:
        with path.open("wb") as f:
            pickle.dump((self.import_mapping, self.func_mapping), f)

    @classmethod
    def load(cls, path: Path) -> Self:
        with path.open("rb") as f:
            import_mapping, func_mapping = pickle.load(f)
        return cls(import_mapping, func_mapping)

    @classmethod
    def build(cls) -> Self:
        repo_root = get_repo_root()
        py_files = subprocess.check_output(
            ["git", "-C", repo_root, "ls-files", "mlflow/*.py"], text=True
        ).splitlines()

        mapping: dict[str, str] = {}
        func_mapping: dict[str, FunctionInfo] = {}

        # Ensure at least 1 worker to avoid ProcessPoolExecutor ValueError
        max_workers = max(1, min(multiprocessing.cpu_count(), len(py_files)))
        with ProcessPoolExecutor(max_workers=max_workers) as executor:
            futures = {}
            for py_file in py_files:
                abs_file_path = repo_root / py_file
                if not abs_file_path.exists():
                    continue
                content = abs_file_path.read_text()
                f = executor.submit(extract_symbols_from_file, py_file, content)
                futures[f] = py_file

            for future in as_completed(futures):
                if result := future.result():
                    file_imports, file_functions = result
                    mapping.update(file_imports)
                    func_mapping.update(file_functions)

        return cls(mapping, func_mapping)

    def _resolve_import(self, target: str) -> str:
        resolved = target
        while v := self.import_mapping.get(resolved):
            resolved = v
        return resolved

    def resolve(self, target: str) -> FunctionInfo | None:
        """Resolve a symbol to its actual definition, following import chains."""
        if f := self.func_mapping.get(target):
            return f

        resolved = self._resolve_import(target)
        if f := self.func_mapping.get(resolved):
            return f

        target, tail = target.rsplit(".", 1)
        resolved = self._resolve_import(target)
        if f := self.func_mapping.get(f"{resolved}.{tail}"):
            return f

        return None
```

--------------------------------------------------------------------------------

````
