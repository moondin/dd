---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 21
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 21 of 991)

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

---[FILE: update_changelog.py]---
Location: mlflow-master/dev/update_changelog.py

```python
import argparse
import os
import re
import subprocess
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any, NamedTuple

import requests
from packaging.version import Version


def get_header_for_version(version):
    return "## {} ({})".format(version, datetime.now().strftime("%Y-%m-%d"))


def extract_pr_num_from_git_log_entry(git_log_entry):
    m = re.search(r"\(#(\d+)\)$", git_log_entry)
    return int(m.group(1)) if m else None


def format_label(label: str) -> str:
    key = label.split("/", 1)[-1]
    return {
        "model-registry": "Model Registry",
        "uiux": "UI",
    }.get(key, key.capitalize())


class PullRequest(NamedTuple):
    title: str
    number: int
    author: str
    labels: list[str]

    @property
    def url(self):
        return f"https://github.com/mlflow/mlflow/pull/{self.number}"

    @property
    def release_note_labels(self):
        return [l for l in self.labels if l.startswith("rn/")]

    def __str__(self):
        areas = " / ".join(
            sorted(
                map(
                    format_label,
                    filter(lambda l: l.split("/")[0] in ("area", "language"), self.labels),
                )
            )
        )
        return f"[{areas}] {self.title} (#{self.number}, @{self.author})"

    def __repr__(self):
        return str(self)


class Section(NamedTuple):
    title: str
    items: list[Any]

    def __str__(self):
        if not self.items:
            return ""
        return "\n\n".join(
            [
                self.title,
                "\n".join(f"- {item}" for item in self.items),
            ]
        )


def is_shallow():
    return (
        subprocess.check_output(
            [
                "git",
                "rev-parse",
                "--is-shallow-repository",
            ],
            text=True,
        ).strip()
        == "true"
    )


def batch_fetch_prs_graphql(pr_numbers: list[int]) -> list[PullRequest]:
    """
    Batch fetch PR data using GitHub GraphQL API.
    """
    if not pr_numbers:
        return []

    # GitHub GraphQL has query size limits, so batch in chunks
    MAX_PRS_PER_QUERY = 50  # Conservative limit to avoid query size issues
    all_prs: list[PullRequest] = []

    for i in range(0, len(pr_numbers), MAX_PRS_PER_QUERY):
        chunk = pr_numbers[i : i + MAX_PRS_PER_QUERY]
        chunk_prs = _fetch_pr_chunk_graphql(chunk)
        all_prs.extend(chunk_prs)

    return all_prs


def _fetch_pr_chunk_graphql(pr_numbers: list[int]) -> list[PullRequest]:
    """
    Fetch a chunk of PRs using GraphQL.
    """
    # Build GraphQL query with aliases for each PR
    query_parts = [
        "query($owner: String!, $repo: String!) {",
        "  repository(owner: $owner, name: $repo) {",
    ]

    for i, pr_num in enumerate(pr_numbers):
        query_parts.append(f"""
    pr{i}: pullRequest(number: {pr_num}) {{
      number
      title
      author {{
        login
      }}
      labels(first: 100) {{
        nodes {{
          name
        }}
      }}
    }}""")

    query_parts.extend(["  }", "}"])
    query = "\n".join(query_parts)

    # Headers with authentication
    headers = {"Content-Type": "application/json"}
    if token := os.getenv("GITHUB_TOKEN"):
        headers["Authorization"] = f"Bearer {token}"
    print(f"Batch fetching {len(pr_numbers)} PRs with GraphQL...")
    resp = requests.post(
        "https://api.github.com/graphql",
        json={
            "query": query,
            "variables": {"owner": "mlflow", "repo": "mlflow"},
        },
        headers=headers,
    )
    resp.raise_for_status()
    data = resp.json()
    if "errors" in data:
        raise Exception(f"GraphQL errors: {data['errors']}")

    # Extract PR data from response and create PullRequest objects
    repository_data = data["data"]["repository"]
    prs = []
    for i, pr_num in enumerate(pr_numbers):
        pr_info = repository_data.get(f"pr{i}")
        if pr_info and pr_info.get("author"):
            prs.append(
                PullRequest(
                    title=pr_info["title"],
                    number=pr_info["number"],
                    author=pr_info["author"]["login"],
                    labels=[label["name"] for label in pr_info["labels"]["nodes"]],
                )
            )
        else:
            print(f"Warning: Could not fetch data for PR #{pr_num}")

    return prs


def main(prev_version, release_version, remote):
    if is_shallow():
        print("Unshallowing repository to ensure `git log` works correctly")
        subprocess.check_call(["git", "fetch", "--unshallow"])
        print("Modifying .git/config to fetch remote branches")
        subprocess.check_call(
            ["git", "config", "remote.origin.fetch", "+refs/heads/*:refs/remotes/origin/*"]
        )
    release_tag = f"v{prev_version}"
    ver = Version(release_version)
    branch = f"branch-{ver.major}.{ver.minor}"
    subprocess.check_call(["git", "fetch", remote, "tag", release_tag])
    subprocess.check_call(["git", "fetch", remote, branch])
    git_log_output = subprocess.check_output(
        [
            "git",
            "log",
            "--left-right",
            "--graph",
            "--cherry-pick",
            "--pretty=format:%s",
            f"tags/{release_tag}...{remote}/{branch}",
        ],
        text=True,
    )
    logs = [l[2:] for l in git_log_output.splitlines() if l.startswith("> ")]

    # Extract all PR numbers first
    pr_numbers = [pr_num for log in logs if (pr_num := extract_pr_num_from_git_log_entry(log))]

    prs = batch_fetch_prs_graphql(pr_numbers)
    label_to_prs = defaultdict(list)
    author_to_prs = defaultdict(list)
    unlabelled_prs = []
    for pr in prs:
        if pr.author == "mlflow-app":
            continue

        if len(pr.release_note_labels) == 0:
            unlabelled_prs.append(pr)

        for label in pr.release_note_labels:
            if label == "rn/none":
                author_to_prs[pr.author].append(pr)
            else:
                label_to_prs[label].append(pr)

    assert len(unlabelled_prs) == 0, "The following PRs need to be categorized:\n" + "\n".join(
        f"- {pr.url}" for pr in unlabelled_prs
    )

    unknown_labels = set(label_to_prs.keys()) - {
        "rn/highlight",
        "rn/feature",
        "rn/breaking-change",
        "rn/bug-fix",
        "rn/documentation",
        "rn/none",
    }
    assert len(unknown_labels) == 0, f"Unknown labels: {unknown_labels}"

    breaking_changes = Section("Breaking changes:", label_to_prs.get("rn/breaking-change", []))
    highlights = Section("Major new features:", label_to_prs.get("rn/highlight", []))
    features = Section("Features:", label_to_prs.get("rn/feature", []))
    bug_fixes = Section("Bug fixes:", label_to_prs.get("rn/bug-fix", []))
    doc_updates = Section("Documentation updates:", label_to_prs.get("rn/documentation", []))
    small_updates = [
        ", ".join([f"#{pr.number}" for pr in prs] + [f"@{author}"])
        for author, prs in author_to_prs.items()
    ]
    small_updates = "Small bug fixes and documentation updates:\n\n" + "; ".join(small_updates)
    sections = filter(
        str.strip,
        map(
            str,
            [
                get_header_for_version(release_version),
                f"MLflow {release_version} includes several major features and improvements",
                breaking_changes,
                highlights,
                features,
                bug_fixes,
                doc_updates,
                small_updates,
            ],
        ),
    )
    new_changelog = "\n\n".join(sections)
    changelog_header = "# CHANGELOG"
    changelog = Path("CHANGELOG.md")
    old_changelog = changelog.read_text().replace(f"{changelog_header}\n\n", "", 1)
    new_changelog = "\n\n".join(
        [
            changelog_header,
            new_changelog,
            old_changelog,
        ]
    )
    changelog.write_text(new_changelog)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Update CHANGELOG.md")
    parser.add_argument("--prev-version", required=True, help="Previous version")
    parser.add_argument("--release-version", required=True, help="MLflow version to release")
    parser.add_argument("--remote", default="origin", help="Git remote to use (default: origin)")
    args = parser.parse_args()
    main(args.prev_version, args.release_version, args.remote)
```

--------------------------------------------------------------------------------

---[FILE: update_mlflow_versions.py]---
Location: mlflow-master/dev/update_mlflow_versions.py

```python
import argparse
import logging
import re
from pathlib import Path

from packaging.version import Version

_logger = logging.getLogger(__name__)

_PYTHON_VERSION_FILES = [
    Path("mlflow", "version.py"),
]

_PYPROJECT_TOML_FILES = [
    Path("pyproject.toml"),
    Path("pyproject.release.toml"),
    Path("libs/skinny/pyproject.toml"),
    Path("libs/tracing/pyproject.toml"),
]

_JAVA_VERSION_FILES = Path("mlflow", "java").rglob("*.java")

_JAVA_POM_XML_FILES = Path("mlflow", "java").rglob("*.xml")

_TS_VERSION_FILES = [
    Path(
        "mlflow",
        "server",
        "js",
        "src",
        "common",
        "constants.tsx",
    ),
    Path("docs", "src", "constants.ts"),
]

_R_VERSION_FILES = [Path("mlflow", "R", "mlflow", "DESCRIPTION")]


def get_current_py_version() -> str:
    text = Path("mlflow", "version.py").read_text()
    return re.search(r'VERSION = "(.+)"', text).group(1)


def get_java_py_version_pattern(version: str) -> str:
    version_without_suffix = replace_dev_or_rc_suffix_with(version, "")
    return rf"{re.escape(version_without_suffix)}(-SNAPSHOT)?"


def get_java_new_py_version(new_py_version: str) -> str:
    return replace_dev_or_rc_suffix_with(new_py_version, "-SNAPSHOT")


def replace_dev_or_rc_suffix_with(version, repl):
    parsed = Version(version)
    base_version = parsed.base_version
    return base_version + repl if parsed.is_prerelease else version


def replace_occurrences(files: list[Path], pattern: str | re.Pattern, repl: str) -> None:
    if not isinstance(pattern, re.Pattern):
        pattern = re.compile(pattern)
    for f in files:
        old_text = f.read_text()
        if not pattern.search(old_text):
            continue
        new_text = pattern.sub(repl, old_text)
        f.write_text(new_text)


def replace_python(old_version: str, new_py_version: str, paths: list[Path]) -> None:
    replace_occurrences(
        files=paths,
        pattern=re.escape(old_version),
        repl=new_py_version,
    )


def replace_pyproject_toml(new_py_version: str, paths: list[Path]) -> None:
    replace_occurrences(
        files=paths,
        pattern=re.compile(r'^version\s+=\s+".+"$', re.MULTILINE),
        repl=f'version = "{new_py_version}"',
    )
    # Update mlflow-skinny and mlflow-tracing versions to match the new mlflow version.
    replace_occurrences(
        files=paths,
        pattern=re.compile(r"^\s*\"mlflow-skinny==.+\",$", re.MULTILINE),
        repl=f'  "mlflow-skinny=={new_py_version}",',
    )
    replace_occurrences(
        files=paths,
        pattern=re.compile(r"^\s*\"mlflow-tracing==.+\",$", re.MULTILINE),
        repl=f'  "mlflow-tracing=={new_py_version}",',
    )


def replace_ts(old_version: str, new_py_version: str, paths: list[Path]) -> None:
    replace_occurrences(
        files=paths,
        pattern=re.escape(old_version),
        repl=new_py_version,
    )


def replace_java(old_version: str, new_py_version: str, paths: list[Path]) -> None:
    old_py_version_pattern = get_java_py_version_pattern(old_version)
    dev_suffix_replaced = get_java_new_py_version(new_py_version)

    replace_occurrences(
        files=paths,
        pattern=old_py_version_pattern,
        repl=dev_suffix_replaced,
    )


# Note: the pom.xml files define versions of dependencies as
# well. this causes issues when the mlflow version matches the
# version of a dependency. to work around, we make sure to
# match only the correct keys
def replace_java_pom_xml(old_version: str, new_py_version: str, paths: list[Path]) -> None:
    old_py_version_pattern = get_java_py_version_pattern(old_version)
    dev_suffix_replaced = get_java_new_py_version(new_py_version)

    mlflow_version_tag_pattern = r"<mlflow.version>"
    mlflow_spark_pattern = r"<artifactId>mlflow-spark_2\.1[23]</artifactId>\s+<version>"
    mlflow_parent_pattern = r"<artifactId>mlflow-parent</artifactId>\s+<version>"

    # combine the three tags together to form the regex
    mlflow_replace_pattern = (
        rf"({mlflow_version_tag_pattern}|{mlflow_spark_pattern}|{mlflow_parent_pattern})"
        + f"{old_py_version_pattern}"
        + r"(</mlflow.version>|</version>)"
    )

    # group 1: everything before the version
    # group 2: optional -SNAPSHOT
    # group 3: everything after the version
    replace_str = f"\\g<1>{dev_suffix_replaced}\\g<3>"

    replace_occurrences(
        files=paths,
        pattern=mlflow_replace_pattern,
        repl=replace_str,
    )


def replace_r(old_py_version: str, new_py_version: str, paths: list[Path]) -> None:
    current_py_version_without_suffix = replace_dev_or_rc_suffix_with(old_py_version, "")

    replace_occurrences(
        files=paths,
        pattern=f"Version: {re.escape(current_py_version_without_suffix)}",
        repl=f"Version: {replace_dev_or_rc_suffix_with(new_py_version, '')}",
    )


def update_versions(new_py_version: str) -> None:
    """
    `new_py_version` is either:
      - a release version (e.g. "2.1.0")
      - a RC version (e.g. "2.1.0rc0")
      - a dev version (e.g. "2.1.0.dev0")
    """
    old_py_version = get_current_py_version()

    replace_python(old_py_version, new_py_version, _PYTHON_VERSION_FILES)
    replace_pyproject_toml(new_py_version, _PYPROJECT_TOML_FILES)
    replace_ts(old_py_version, new_py_version, _TS_VERSION_FILES)
    replace_java(old_py_version, new_py_version, _JAVA_VERSION_FILES)
    replace_java_pom_xml(old_py_version, new_py_version, _JAVA_POM_XML_FILES)
    replace_r(old_py_version, new_py_version, _R_VERSION_FILES)


def validate_new_version(value: str) -> str:
    new = Version(value)
    current = Version(get_current_py_version())

    # this could be the case if we just promoted an RC to a release
    if new < current:
        _logger.warning(
            f"New version {new} is not greater than or equal to current version {current}. "
            "If the previous version was an RC, this is expected. If not, please make sure the "
            "specified new version is correct."
        )
        # exit with 0 to avoid failing the CI job
        exit(0)

    return value


def pre_release(new_version: str):
    """
    Update MLflow package versions BEFORE release.

    Usage:

    python dev/update_mlflow_versions.py pre-release --new-version 1.29.0
    """
    validate_new_version(new_version)
    update_versions(new_py_version=new_version)


def post_release(new_version: str):
    """
    Update MLflow package versions AFTER release.

    Usage:

    python dev/update_mlflow_versions.py post-release --new-version 1.29.0
    """
    validate_new_version(new_version)
    current_version = Version(get_current_py_version())
    msg = (
        "It appears you ran this command on a release branch because the current version "
        f"({current_version}) is not a dev version. Please re-run this command on the master "
        "branch."
    )
    assert current_version.is_devrelease, msg
    new_version = Version(new_version)
    # Increment the patch version and append ".dev0"
    new_py_version = f"{new_version.major}.{new_version.minor}.{new_version.micro + 1}.dev0"
    update_versions(new_py_version=new_py_version)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Update MLflow package versions")
    subparsers = parser.add_subparsers(dest="command", help="Command to run", required=True)

    # pre-release subcommand
    pre_parser = subparsers.add_parser(
        "pre-release",
        help="Update MLflow package versions BEFORE release",
    )
    pre_parser.add_argument("--new-version", required=True, help="New version to release")

    # post-release subcommand
    post_parser = subparsers.add_parser(
        "post-release",
        help="Update MLflow package versions AFTER release",
    )
    post_parser.add_argument("--new-version", required=True, help="New version that was released")

    args = parser.parse_args()

    if args.command == "pre-release":
        pre_release(args.new_version)
    elif args.command == "post-release":
        post_release(args.new_version)
```

--------------------------------------------------------------------------------

---[FILE: update_ml_package_versions.py]---
Location: mlflow-master/dev/update_ml_package_versions.py

```python
"""
A script to update the maximum package versions in 'mlflow/ml-package-versions.yml'.

# Prerequisites:
$ pip install packaging pyyaml

# How to run (make sure you're in the repository root):
$ python dev/update_ml_package_versions.py
"""

import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path

import yaml
from packaging.version import Version


def read_file(path):
    with open(path) as f:
        return f.read()


def save_file(src, path):
    with open(path, "w") as f:
        f.write(src)


def uploaded_recently(dist) -> bool:
    if ut := dist.get("upload_time_iso_8601"):
        delta = datetime.now(timezone.utc) - datetime.fromisoformat(ut.replace("Z", "+00:00"))
        return delta.days < 1
    return False


@dataclass
class VersionInfo:
    version: str
    upload_time: datetime


def get_package_version_infos(package_name: str) -> list[VersionInfo]:
    url = f"https://pypi.python.org/pypi/{package_name}/json"
    for _ in range(5):  # Retry up to 5 times
        try:
            with urllib.request.urlopen(url) as res:
                data = json.load(res)
        except ConnectionResetError as e:
            sys.stderr.write(f"Retrying {url} due to {e}\n")
            time.sleep(1)
        else:
            break
    else:
        raise Exception(f"Failed to fetch {url}")

    def is_dev_or_pre_release(version_str):
        v = Version(version_str)
        return v.is_devrelease or v.is_prerelease

    return [
        VersionInfo(
            version=version,
            upload_time=datetime.fromisoformat(dist_files[0]["upload_time"]),
        )
        for version, dist_files in data["releases"].items()
        if (
            len(dist_files) > 0
            and not is_dev_or_pre_release(version)
            and not any(uploaded_recently(dist) for dist in dist_files)
            and not any(dist.get("yanked", False) for dist in dist_files)
        )
    ]


def get_latest_version(candidates):
    return max(candidates, key=Version)


def update_version(src, key, new_version, category, update_max):
    """
    Examples
    ========
    >>> src = '''
    ... sklearn:
    ...   ...
    ...   models:
    ...     minimum: "0.0.0"
    ...     maximum: "0.0.0"
    ... xgboost:
    ...   ...
    ...   autologging:
    ...     minimum: "1.1.1"
    ...     maximum: "1.1.1"
    ... '''.strip()
    >>> new_src = update_version(src, "sklearn", "0.1.0", "models", update_max=True)
    >>> new_src = update_version(new_src, "xgboost", "1.2.1", "autologging", update_max=True)
    >>> print(new_src)
    sklearn:
      ...
      models:
        minimum: "0.0.0"
        maximum: "0.1.0"
    xgboost:
      ...
      autologging:
        minimum: "1.1.1"
        maximum: "1.2.1"
    """
    match = "maximum" if update_max else "minimum"
    pattern = r"((^|\n){key}:.+?{category}:.+?{match}: )\".+?\"".format(
        key=re.escape(key), category=category, match=match
    )
    # Matches the following pattern:
    #
    # <key>:
    #   ...
    #   <category>:
    #     ...
    #     maximum: "1.2.3"
    return re.sub(pattern, rf'\g<1>"{new_version}"', src, flags=re.DOTALL)


def extract_field(d, keys):
    for key in keys:
        if key in d:
            d = d[key]
        else:
            return None
    return d


def _get_autolog_flavor_module_map(config):
    """
    Parse _ML_PACKAGE_VERSIONS to get the mapping of flavor name to
    the module name to be imported for autologging.
    """
    autolog_flavor_module_map = {}
    for flavor, config in config.items():
        if "autologging" not in config:
            continue
        module_name = config["package_info"].get("module_name", flavor)
        autolog_flavor_module_map[flavor] = module_name

    return autolog_flavor_module_map


def update_ml_package_versions_py(config_path):
    with open(config_path) as f:
        genai_config = {}
        non_genai_config = {}

        for name, cfg in yaml.load(f, Loader=yaml.SafeLoader).items():
            # Extract required fields
            pip_release = extract_field(cfg, ("package_info", "pip_release"))
            module_name = extract_field(cfg, ("package_info", "module_name"))
            min_version = extract_field(cfg, ("models", "minimum"))
            max_version = extract_field(cfg, ("models", "maximum"))
            genai = extract_field(cfg, ("package_info", "genai"))
            config_to_update = genai_config if genai else non_genai_config
            if min_version:
                config_to_update[name] = {
                    "package_info": {
                        "pip_release": pip_release,
                    },
                    "models": {
                        "minimum": min_version,
                        "maximum": max_version,
                    },
                }
            else:
                config_to_update[name] = {
                    "package_info": {
                        "pip_release": pip_release,
                    }
                }
            if module_name:
                config_to_update[name]["package_info"]["module_name"] = module_name

            # Check for autologging configuration
            autolog_min_version = extract_field(cfg, ("autologging", "minimum"))
            autolog_max_version = extract_field(cfg, ("autologging", "maximum"))
            if (pip_release, autolog_min_version, autolog_max_version).count(None) > 0:
                continue

            config_to_update[name].update(
                {
                    "autologging": {
                        "minimum": autolog_min_version,
                        "maximum": autolog_max_version,
                    }
                },
            )

        genai_flavor_module_mapping = _get_autolog_flavor_module_map(genai_config)
        # We have "langgraph" entry in ml-package-versions.yml so that we can run test
        # against multiple versions of langgraph. However, we don't have a flavor for
        # langgraph and it is a part of the langchain flavor.
        genai_flavor_module_mapping.pop("langgraph", None)

        non_genai_flavor_module_mapping = _get_autolog_flavor_module_map(non_genai_config)
        # Add special case for pyspark.ml (non-GenAI)
        non_genai_flavor_module_mapping["pyspark.ml"] = "pyspark"

        this_file = Path(__file__).name
        dst = Path("mlflow", "ml_package_versions.py")

        config_str = json.dumps(genai_config | non_genai_config, indent=4)

        Path(dst).write_text(
            f"""\
# This file was auto-generated by {this_file}.
# Please do not edit it manually.

_ML_PACKAGE_VERSIONS = {config_str}

# A mapping of flavor name to the module name to be imported for autologging.
# This is used for checking version compatibility in autologging.
# DO NOT EDIT MANUALLY

# GenAI packages
GENAI_FLAVOR_TO_MODULE_NAME = {json.dumps(genai_flavor_module_mapping, indent=4)}

# Non-GenAI packages
NON_GENAI_FLAVOR_TO_MODULE_NAME = {json.dumps(non_genai_flavor_module_mapping, indent=4)}

# Combined mapping for backward compatibility
FLAVOR_TO_MODULE_NAME = NON_GENAI_FLAVOR_TO_MODULE_NAME | GENAI_FLAVOR_TO_MODULE_NAME
"""
        )


def parse_args():
    parser = argparse.ArgumentParser(description="Update MLflow package versions")
    parser.add_argument(
        "--skip-yml", action="store_true", help="Skip updating ml-package-versions.yml"
    )
    return parser.parse_args()


def get_min_supported_version(versions_infos: list[VersionInfo], genai: bool = False) -> str | None:
    """
    Get the minimum version that is released within the past two years
    """
    years = 1 if genai else 2
    min_support_date = datetime.now() - timedelta(days=years * 365)
    min_support_date = min_support_date.replace(tzinfo=None)

    # Extract versions that were released in the past two years
    recent_versions = [v for v in versions_infos if v.upload_time > min_support_date]

    if not recent_versions:
        return None

    # Get minimum version according to upload date
    return min(recent_versions, key=lambda v: v.upload_time).version


def update(skip_yml=False):
    yml_path = "mlflow/ml-package-versions.yml"

    if not skip_yml:
        old_src = read_file(yml_path)
        new_src = old_src
        config_dict = yaml.load(old_src, Loader=yaml.SafeLoader)
        for flavor_key, config in config_dict.items():
            # We currently don't have bandwidth to support newer versions of these flavors.
            if flavor_key in ["litellm"]:
                continue
            package_name = config["package_info"]["pip_release"]
            genai = config["package_info"].get("genai", False)
            versions_and_upload_times = get_package_version_infos(package_name)
            min_supported_version = get_min_supported_version(
                versions_and_upload_times, genai=genai
            )

            for category in ["autologging", "models"]:
                print("Processing", flavor_key, category)

                if category in config and "minimum" in config[category]:
                    old_min_version = config[category]["minimum"]
                    if flavor_key == "spark":
                        # We should support pyspark versions that are older than the cut off date.
                        pass
                    elif min_supported_version is None:
                        # The latest release version was 2 years ago.
                        # set the min version to be the same with the max version.
                        max_ver = config[category]["maximum"]
                        new_src = update_version(
                            new_src, flavor_key, max_ver, category, update_max=False
                        )
                    elif Version(min_supported_version) > Version(old_min_version):
                        new_src = update_version(
                            new_src, flavor_key, min_supported_version, category, update_max=False
                        )

                if (category not in config) or config[category].get("pin_maximum", False):
                    continue

                max_ver = config[category]["maximum"]
                versions = [v.version for v in versions_and_upload_times]
                unsupported = config[category].get("unsupported", [])
                versions = set(versions).difference(unsupported)  # exclude unsupported versions
                latest_version = get_latest_version(versions)

                if Version(latest_version) <= Version(max_ver):
                    continue

                new_src = update_version(
                    new_src, flavor_key, latest_version, category, update_max=True
                )

        save_file(new_src, yml_path)

    update_ml_package_versions_py(yml_path)


def main():
    args = parse_args()
    update(args.skip_yml)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: update_requirements.py]---
Location: mlflow-master/dev/update_requirements.py

```python
"""
This script updates the `max_major_version` attribute of each package in a YAML dependencies
specification (e.g. requirements/core-requirements.yaml) to the maximum available version on PyPI.
"""

import os

import requests
from packaging.version import InvalidVersion, Version
from ruamel.yaml import YAML

PACKAGE_NAMES = ["tracing", "skinny", "core", "gateway"]


def get_latest_major_version(package_name: str) -> int:
    url = f"https://pypi.org/pypi/{package_name}/json"
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    versions = []
    for version, distributions in data["releases"].items():
        if len(distributions) == 0 or any(d.get("yanked", False) for d in distributions):
            continue

        try:
            version = Version(version)
        except InvalidVersion:
            # Ignore invalid versions such as https://pypi.org/project/pytz/2004d
            continue

        if version.is_devrelease or version.is_prerelease:
            continue

        versions.append(version)

    return max(versions).major


def main():
    yaml = YAML()
    yaml.preserve_quotes = True

    for package_name in PACKAGE_NAMES:
        req_file_path = os.path.join("requirements", package_name + "-requirements.yaml")
        with open(req_file_path) as f:
            requirements_src = f.read()
            requirements = yaml.load(requirements_src)

        changes_made = False
        for key, req_info in requirements.items():
            pip_release = req_info["pip_release"]
            max_major_version = req_info["max_major_version"]
            if req_info.get("freeze", False):
                continue
            latest_major_version = get_latest_major_version(pip_release)
            if latest_major_version > max_major_version:
                requirements[key]["max_major_version"] = latest_major_version
                print(f"Updated {key}.max_major_version to {latest_major_version}")
                changes_made = True

        if changes_made:
            with open(req_file_path, "w") as f:
                yaml.dump(requirements, f)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: validate_release_version.py]---
Location: mlflow-master/dev/validate_release_version.py

```python
import argparse

from packaging.version import Version


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--version", help="Release version to validate, e.g., '1.2.3'", required=True
    )
    return parser.parse_args()


def main():
    args = parse_args()
    version = Version(args.version)
    msg = (
        f"Invalid release version: '{args.version}', "
        "must be in the format of <major>.<minor>.<micro>"
    )
    assert len(version.release) == 3, msg


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

````
