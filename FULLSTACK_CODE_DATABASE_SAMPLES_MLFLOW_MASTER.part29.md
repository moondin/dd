---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 29
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 29 of 991)

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

---[FILE: python.md]---
Location: mlflow-master/dev/guides/python.md

```text
# Python Style Guide

This guide documents Python coding conventions that go beyond what [ruff](https://docs.astral.sh/ruff/) and [clint](../../dev/clint/) can enforce. The practices below require human judgment to implement correctly and improve code readability, maintainability, and testability across the MLflow codebase.

## Avoid Redundant Docstrings

Omit docstrings that merely repeat the function name or provide no additional value. Function names should be self-documenting.

```python
# Bad
def calculate_sum(a: int, b: int) -> int:
    """Calculate sum"""
    return a + b


# Good
def calculate_sum(a: int, b: int) -> int:
    return a + b
```

## Prefer `typing.Literal` for Fixed-String Parameters

When a parameter only accepts a fixed set of string values, use `typing.Literal` instead of a plain `str` type hint. This improves type-checking, enables IDE autocompletion, and documents allowed values at the type level.

```python
# Bad
def f(app: str) -> None:
    """
    Args:
        app: Application type. Either "fastapi" or "flask".
    """
    ...


# Good
from typing import Literal


def f(app: Literal["fastapi", "flask"]) -> None:
    """
    Args:
        app: Application type. Either "fastapi" or "flask".
    """
    ...
```

## Minimize Try-Catch Block Scope

Wrap only the specific operations that can raise exceptions. Keep safe operations outside the try block to improve debugging and avoid masking unexpected errors.

```python
# Bad
try:
    never_fails()
    can_fail()
except ...:
    handle_error()

# Good
never_fails()
try:
    can_fail()
except ...:
    handle_error()
```

## Use Dataclasses Instead of Complex Tuples

Replace tuples with 3+ elements with named dataclasses. This improves code clarity, prevents positional argument errors, and enables type checking on individual fields.

```python
# Bad
def get_user() -> tuple[str, int, str]:
    return "Alice", 30, "Engineer"


# Good
from dataclasses import dataclass


@dataclass
class User:
    name: str
    age: int
    occupation: str


def get_user() -> User:
    return User(name="Alice", age=30, occupation="Engineer")
```

## Use `pathlib` Methods Instead of `os` Module Functions

When you have a `pathlib.Path` object, use its built-in methods instead of `os` module functions. This is more readable, type-safe, and follows object-oriented principles.

```python
from pathlib import Path

path = Path("some/file.txt")

# Bad
import os

os.path.exists(path)
os.remove(path)

# Good
path.exists()
path.unlink()
```

## Pass `pathlib.Path` Objects Directly to `subprocess`

Avoid converting `pathlib.Path` objects to strings when passing them to `subprocess` functions. Modern Python (3.8+) accepts Path objects directly, making the code cleaner and more type-safe.

```python
import subprocess
from pathlib import Path

path = Path("some/script.py")

# Bad
subprocess.check_call(["foo", "bar", str(path)])

# Good
subprocess.check_call(["foo", "bar", path])
```

## Use next() to Find First Match Instead of Loop-and-Break

Use the `next()` builtin function with a generator expression to find the first item that matches a condition. This is more concise and functional than manually looping with break statements.

```python
# Bad
result = None
for item in items:
    if item.name == "target":
        result = item
        break

# Good
result = next((item for item in items if item.name == "target"), None)
```

## Use Pattern Matching for String Splitting

When splitting strings into a fixed number of parts, use pattern matching instead of direct unpacking or verbose length checks. Pattern matching provides concise, safe extraction that clearly handles both expected and unexpected cases.

```python
# Bad: unsafe
a, b = some_str.split(".")

# Bad: safe but verbose
if some_str.count(".") == 1:
    a, b = some_str.split(".")
else:
    raise ValueError(f"Invalid format: {some_str!r}")

# Bad: safe but verbose
splits = some_str.split(".")
if len(splits) == 2:
    a, b = splits
else:
    raise ValueError(f"Invalid format: {some_str!r}")

# Good
match some_str.split("."):
    case [a, b]:
        ...
    case _:
        raise ValueError(f"Invalid format: {some_str!r}")
```

## Always Verify Mock Calls with Assertions

Every mocked function must have an assertion (`assert_called`, `assert_called_once`, etc.) to verify it was invoked correctly. Without assertions, tests may pass even when the mocked code isn't executed.

```python
from unittest import mock


# Bad
def test_foo():
    with mock.patch("foo.bar"):
        calls_bar()


# Good
def test_bar():
    with mock.patch("foo.bar") as mock_bar:
        calls_bar()
        mock_bar.assert_called_once()
```

## Set Mock Behaviors in Patch Declaration

Define `return_value` and `side_effect` directly in the `patch()` call rather than assigning them afterward. This keeps mock configuration explicit and reduces setup code.

```python
from unittest import mock


# Bad
def test_foo():
    with mock.patch("foo.bar") as mock_bar:
        mock_bar.return_value = 42
        calls_bar()

    with mock.patch("foo.bar") as mock_bar:
        mock_bar.side_effect = Exception("Error")
        calls_bar()


# Good
def test_foo():
    with mock.patch("foo.bar", return_value=42) as mock_bar:
        calls_bar()

    with mock.patch("foo.bar", side_effect=Exception("Error")) as mock_bar:
        calls_bar()
```

## Parametrize Tests with Multiple Input Cases

Use `@pytest.mark.parametrize` to test multiple inputs instead of repeating assertions. This creates separate test cases for each input, making failures easier to diagnose and tests more maintainable.

```python
# Bad
def test_foo():
    assert foo("a") == 0
    assert foo("b") == 1
    assert foo("c") == 2


# Good
@pytest.mark.parametrize(
    ("input", "expected"),
    [
        ("a", 0),
        ("b", 1),
        ("c", 2),
    ],
)
def test_foo(input: str, expected: int):
    assert foo(input) == expected
```

## Avoid Custom Messages in Test Asserts

Pytest's assertion introspection provides detailed failure information automatically. Avoid adding custom messages to `assert` statements in tests unless absolutely necessary.

```python
# Bad
def test_list_items():
    items = list_items()
    assert len(items) == 3, f"Expected 3 items, got {len(items)}"


# Good
def test_list_items():
    items = list_items()
    assert len(items) == 3
```

## Preserve function metadata and type information in decorators

When writing decorators, always use `@functools.wraps` to preserve function metadata (like `__name__` and `__doc__`), and use `typing.ParamSpec` and `typing.TypeVar` to preserve the function's type information for accurate type checking and autocompletion in IDEs.

```python
# Bad
from typing import Any, Callable


def decorator(f: Callable[..., Any]) -> Callable[..., Any]:
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        ...  # Pre-execution logic (e.g., logging, validation, setup)
        res = f(*args, **kwargs)
        ...  # Post-execution logic (e.g., cleanup, result transformation)
        return res

    return wrapper


# Good
import functools
from typing import Callable, ParamSpec, TypeVar

_P = ParamSpec("P")
_R = TypeVar("R")


def decorator(f: Callable[_P, _R]) -> Callable[_P, _R]:
    @functools.wraps(f)
    def wrapper(*args: _P.args, **kwargs: _P.kwargs) -> _R:
        ...  # Pre-execution logic (e.g., logging, validation, setup)
        res = f(*args, **kwargs)
        ...  # Post-execution logic (e.g., cleanup, result transformation)
        return res

    return wrapper
```
```

--------------------------------------------------------------------------------

---[FILE: review.py]---
Location: mlflow-master/dev/mcps/review.py

```python
# /// script
# dependencies = [
#   "fastmcp==2.11.3",
# ]
# ///
"""
GitHub PR Review MCP Server - Tools for automated PR code reviews.

Provides MCP tools for fetching PR diffs with line numbers and adding review comments.
"""

import functools
import json
import os
import re
from pathlib import Path
from typing import Annotated, Any, Literal
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from fastmcp import FastMCP


def github_api_request(
    url: str,
    method: str = "GET",
    data: dict[str, Any] | None = None,
    accept_header: str = "application/vnd.github.v3+json",
) -> dict[str, Any] | str:
    """Make a request to the GitHub API."""
    headers = {"Accept": accept_header}

    if token := os.environ.get("GITHUB_TOKEN"):
        headers["Authorization"] = f"token {token}"

    if data is not None:
        headers["Content-Type"] = "application/json"
        req = Request(
            url,
            data=json.dumps(data).encode("utf-8"),
            headers=headers,
            method=method,
        )
    else:
        req = Request(url, headers=headers, method=method)

    try:
        with urlopen(req) as response:
            content = response.read().decode("utf-8")
    except HTTPError as e:
        body = e.read().decode("utf-8")
        raise RuntimeError(f"Error fetching GitHub API: {e.code} {e.reason} {body}") from e

    if accept_header == "application/vnd.github.v3.diff":
        return content
    return json.loads(content)


@functools.lru_cache(maxsize=32)
def fetch_pr_diff(owner: str, repo: str, pull_number: int) -> str:
    url = f"https://api.github.com/repos/{owner}/{repo}/pulls/{pull_number}"
    return github_api_request(url, accept_header="application/vnd.github.v3.diff")


def should_exclude_file(file_path: str) -> bool:
    """
    Determine if a file should be excluded from the diff.

    Excludes:
    - .py and .pyi files in mlflow/protos/
    - Auto-generated lock files
      - uv.lock
      - yarn.lock
      - package-lock.json
    - .java files
    - .ipynb files
    """
    path = Path(file_path)

    # Check if it's a Python file in mlflow/protos/
    if path.suffix in {".py", ".pyi"} and path.is_relative_to("mlflow/protos"):
        return True

    # Check for auto-generated lock files
    if path.name in {"uv.lock", "yarn.lock", "package-lock.json"}:
        return True

    # Check for Java files
    if path.suffix == ".java":
        return True

    # Check for Jupyter notebook files
    if path.suffix == ".ipynb":
        return True

    return False


def filter_diff(full_diff: str) -> str:
    lines = full_diff.split("\n")
    filtered_diff: list[str] = []
    in_included_file = False
    for line in lines:
        if line.startswith("diff --git"):
            # Extract file path from: diff --git a/path/to/file.py b/path/to/file.py
            if match := re.match(r"diff --git a/(.*?) b/(.*?)$", line):
                file_path = match.group(2)  # Use the 'b/' path (new file path)
                # Exclude deleted files (where b/ path is dev/null)
                if file_path == "dev/null":
                    in_included_file = False
                else:
                    in_included_file = not should_exclude_file(file_path)
            else:
                in_included_file = False

            if in_included_file:
                filtered_diff.append(line)
        elif in_included_file:
            filtered_diff.append(line)

    # Add line numbers to the diff
    result_lines: list[str] = []
    old_line = 0
    new_line = 0

    for line in filtered_diff:
        if line.startswith("@@"):
            # Parse hunk header: @@ -old_start,old_count +new_start,new_count @@
            if match := re.match(r"@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@", line):
                old_line = int(match.group(1))
                new_line = int(match.group(2))
            result_lines.append(line)
        elif line.startswith("diff --git"):
            # Add blank line before new file diff for readability
            if result_lines:  # Don't add blank line before the first diff
                result_lines.append("")
            result_lines.append(line)
        elif line.startswith("index ") or line.startswith("---") or line.startswith("+++"):
            result_lines.append(line)
        elif line.startswith("-"):
            # Deleted line - show old line number on the left (like GitHub)
            result_lines.append(f"{old_line:5d}       | {line}")
            old_line += 1
        elif line.startswith("+"):
            # Added line - show new line number on the right (like GitHub)
            result_lines.append(f"      {new_line:5d} | {line}")
            new_line += 1
        else:
            # Unchanged line - show both line numbers (like GitHub)
            result_lines.append(f"{old_line:5d} {new_line:5d} | {line}")
            old_line += 1
            new_line += 1

    return "\n".join(result_lines)


mcp = FastMCP("Review MCP")


@mcp.tool
def fetch_diff(
    owner: Annotated[str, "Repository owner"],
    repo: Annotated[str, "Repository name"],
    pull_number: Annotated[int, "Pull request number"],
) -> str:
    """
    Fetch the diff of a pull request, excluding certain file types,
    and display it with line numbers.

    Example output:

    ```
    diff --git a/path/to/file.py b/path/to/file.py
    index abc123..def456 100644
    --- a/path/to/file.py
    +++ b/path/to/file.py
    @@ -10,7 +10,7 @@
    10    10 |  import os
    11    11 |  import sys
    12    12 |  from typing import Optional
    13       | -from old_module import OldClass
          14 | +from new_module import NewClass
    14    15 |
    15    16 |  def process_data(input_file: str) -> dict:
    ```
    """
    full_diff = fetch_pr_diff(owner, repo, pull_number)
    return filter_diff(full_diff)


def fetch_pr_head_commit(owner: str, repo: str, pull_number: int) -> str:
    """Fetch the head commit SHA of a pull request."""
    url = f"https://api.github.com/repos/{owner}/{repo}/pulls/{pull_number}"
    pr_data = github_api_request(url)
    return pr_data["head"]["sha"]


@mcp.tool
def add_pr_review_comment(
    owner: Annotated[str, "Repository owner"],
    repo: Annotated[str, "Repository name"],
    pull_number: Annotated[int, "Pull request number"],
    path: Annotated[str, " The relative path to the file that necessitates a comment"],
    body: Annotated[str, "The text of the review comment"],
    line: Annotated[
        int,
        (
            "The line of the blob in the pull request diff that the comment applies to. "
            "For multi-line comments, the last line of the range"
        ),
    ],
    start_line: Annotated[
        int | None,
        "For multi-line comments, the first line of the range that the comment applies to",
    ] = None,
    side: Annotated[
        Literal["LEFT", "RIGHT"],
        "The side of the diff to comment on. 'LEFT' indicates the previous state, 'RIGHT' "
        "indicates the new state",
    ] = "RIGHT",
    start_side: Annotated[
        Literal["LEFT", "RIGHT"] | None,
        (
            "The starting side of the diff to comment on. 'LEFT' indicates the previous state, "
            "'RIGHT' indicates the new state"
        ),
    ] = None,
    subject_type: Annotated[
        Literal["line", "file"],
        (
            "The level at which the comment is targeted. 'line' indicates a specific line, "
            "'file' indicates the entire file"
        ),
    ] = "line",
    in_reply_to: Annotated[
        int | None,
        "The ID of the review comment to reply to. Use this to create a threaded reply",
    ] = None,
) -> str:
    """
    Add a review comment to a pull request.

    https://docs.github.com/en/rest/pulls/comments?apiVersion=2022-11-28#create-a-review-comment-for-a-pull-request
    """
    # First, fetch the head commit SHA
    commit_id = fetch_pr_head_commit(owner, repo, pull_number)
    url = f"https://api.github.com/repos/{owner}/{repo}/pulls/{pull_number}/comments"
    data = {
        "commit_id": commit_id,
        "path": path,
        "line": line,
        "body": body,
        "side": side,
    }
    if start_line is not None:
        data["start_line"] = start_line
    if start_side is not None:
        data["start_side"] = start_side
    if subject_type == "file":
        data["subject_type"] = subject_type
    if in_reply_to is not None:
        data["in_reply_to"] = in_reply_to

    result = github_api_request(url, method="POST", data=data)
    return f"Comment added successfully: {result.get('html_url')}"


def main() -> None:
    mcp.run()


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: autogeneration_utils.py]---
Location: mlflow-master/dev/proto_to_graphql/autogeneration_utils.py

```python
import re
import sys

import git
from string_utils import camel_to_snake, snake_to_pascal


def get_git_root():
    repo = git.Repo(".", search_parent_directories=True)
    return repo.working_tree_dir + "/"


INDENT = " " * 4
INDENT2 = INDENT * 2
SCHEMA_EXTENSION_MODULE = "mlflow.server.graphql.graphql_schema_extensions"
SCHEMA_EXTENSION = get_git_root() + "mlflow/server/graphql/graphql_schema_extensions.py"
AUTOGENERATED_SCHEMA = get_git_root() + "mlflow/server/graphql/autogenerated_graphql_schema.py"
AUTOGENERATED_SDL_SCHEMA = get_git_root() + "mlflow/server/js/src/graphql/autogenerated_schema.gql"
DUMMY_FIELD = (
    "dummy = graphene.Boolean(description="
    "'Dummy field required because GraphQL does not support empty types.')"
)


def get_package_name(method_descriptor):
    return method_descriptor.containing_service.file.package


# Get method name in snake case. Result is package name followed by the method name.
def get_method_name(method_descriptor):
    return get_package_name(method_descriptor) + "_" + camel_to_snake(method_descriptor.name)


def get_descriptor_full_pascal_name(field_descriptor):
    return snake_to_pascal(field_descriptor.full_name.replace(".", "_"))


def method_descriptor_to_generated_pb2_file_name(method_descriptor):
    return re.sub(r"\.proto", "_pb2", method_descriptor.containing_service.file.name)


def debugLog(log):
    print(log, file=sys.stderr)
```

--------------------------------------------------------------------------------

---[FILE: code_generator.py]---
Location: mlflow-master/dev/proto_to_graphql/code_generator.py

```python
import os

from autogeneration_utils import AUTOGENERATED_SCHEMA, AUTOGENERATED_SDL_SCHEMA
from parsing_utils import process_method
from schema_autogeneration import generate_schema

from mlflow.protos import model_registry_pb2, service_pb2
from mlflow.server.graphql.graphql_schema_extensions import schema

# Add proto descriptors to onboard RPCs to graphql.
ONBOARDED_DESCRIPTORS = [service_pb2.DESCRIPTOR, model_registry_pb2.DESCRIPTOR]


class GenerateSchemaState:
    def __init__(self):
        self.queries = set()  # method_descriptor
        self.mutations = set()  # method_descriptor
        self.inputs = []  # field_descriptor
        self.outputs = set()  # field_descriptor
        self.types = []  # field_descriptor
        self.enums = set()  # enum_descriptor
        self.method_names = set()  # package_name_method_name


# Entry point for generating the GraphQL schema.
def generate_code():
    state = GenerateSchemaState()
    for file_descriptor in ONBOARDED_DESCRIPTORS:
        for service_name, service_descriptor in file_descriptor.services_by_name.items():
            for method_name, method_descriptor in service_descriptor.methods_by_name.items():
                process_method(method_descriptor, state)

    generated_schema = generate_schema(state)

    os.makedirs(os.path.dirname(AUTOGENERATED_SCHEMA), exist_ok=True)

    with open(AUTOGENERATED_SCHEMA, "w") as file:
        file.write(generated_schema)

    # Generate the sdl schema for typescript type generation.
    sdl_schema = str(schema)
    sdl_schema = f"""# GENERATED FILE. PLEASE DON'T MODIFY.
# Run uv run ./dev/proto_to_graphql/code_generator.py to regenerate.

{sdl_schema}

"""

    with open(AUTOGENERATED_SDL_SCHEMA, "w") as f:
        f.write(sdl_schema)


def main():
    generate_code()


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: parsing_utils.py]---
Location: mlflow-master/dev/proto_to_graphql/parsing_utils.py

```python
from autogeneration_utils import get_method_name
from google.protobuf.descriptor import FieldDescriptor

from mlflow.protos import databricks_pb2


def get_method_type(method_descriptor):
    return method_descriptor.GetOptions().Extensions[databricks_pb2.rpc].endpoints[0].method


def process_method(method_descriptor, state):
    """
    Given a method descriptor, add information being referenced into the GenerateSchemaState.
    """
    if not method_descriptor.GetOptions().HasExtension(databricks_pb2.graphql):
        return
    rpcOptions = method_descriptor.GetOptions().Extensions[databricks_pb2.rpc]
    # Only add those methods that are not internal.
    if rpcOptions.visibility != databricks_pb2.INTERNAL:
        name = get_method_name(method_descriptor)
        if name in state.method_names:
            return
        state.method_names.add(name)
        request_method = get_method_type(method_descriptor)
        if request_method == "GET":
            state.queries.add(method_descriptor)
        else:
            state.mutations.add(method_descriptor)
        state.outputs.add(method_descriptor.output_type)
        populate_message_types(method_descriptor.input_type, state, True, set())
        populate_message_types(method_descriptor.output_type, state, False, set())


def populate_message_types(field_descriptor, state, is_input, visited):
    """
    Given a field descriptor, recursively walk through the referenced message types and add
    information being referenced into the GenerateSchemaState.
    """
    if field_descriptor in visited:
        # Break the loop for recursive types.
        return
    visited.add(field_descriptor)
    if is_input:
        add_message_descriptor_to_list(field_descriptor, state.inputs)
    else:
        add_message_descriptor_to_list(field_descriptor, state.types)

    for sub_field in field_descriptor.fields:
        type = sub_field.type
        if type in (FieldDescriptor.TYPE_MESSAGE, FieldDescriptor.TYPE_GROUP):
            populate_message_types(sub_field.message_type, state, is_input, visited)
        elif type == FieldDescriptor.TYPE_ENUM:
            state.enums.add(sub_field.enum_type)
        else:
            continue


def add_message_descriptor_to_list(descriptor, target_list):
    # Always put the referenced message at the beginning, so that when generating the schema,
    # the ordering can be maintained in a way that correspond to the reference graph.
    # list.remove() and insert(0) are not optimal in terms of efficiency but are fine because
    # the amount of data is very small here.
    if descriptor not in target_list:
        target_list.insert(0, descriptor)
    else:
        target_list.remove(descriptor)
        target_list.insert(0, descriptor)
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: mlflow-master/dev/proto_to_graphql/README.md

```text
# MLflow Proto To GraphQL Autogeneration

## What is this

The system in `dev/proto_to_graphql` parses proto rpc definitions and generates graphql schema based on the proto rpc definition. The goal of this system is to quickly generate base GraphQL schema and resolver code so that we can easily take advantage of the data joining functionalities of GraphQL.

The autogenerated schema and resolver are in the following file: `mlflow/server/graphql/autogenerated_graphql_schema.py`

The autogenerated schema and resolvers are referenced and can be extended in this file `mlflow/server/graphql/graphql_schema_extensions.py`

You can run `python ./dev/proto_to_graphql/code_generator.py` or `./dev/generate-protos.sh` to trigger the codegen process.

## FAQs

### How to onboard a new rpc to GraphQL

- In your proto rpc definition, add `option (graphql) = {};` and re-run `./dev/generate-protos.sh`. You should see the changes in the generated schema. [Example](https://github.com/mlflow/mlflow/pull/11215/files#diff-8ab2ad3109b67a713e147edf557d4da88853563398ce354cc895bb5930950dc5R175).
- In `mlflow/server/handlers.py`, identify the handler function for your rpc, for example `_get_run`, make sure there exists a corresponding `get_run_impl` function that takes in a `request_message` and returns a response messages that is of the generated service_pb proto type. If no such function exists, you can easily extract it out like in this [example](https://github.com/mlflow/mlflow/pull/11215/files#diff-5c10a4e2ca47745f06fa9e7201087acfc102849756cb8d85e774a5ac468cb037R1779-R1795).
- Test manually with a localhost server, as well as adding a unit test in `tests/tracking/test_rest_tracking.py`. [Example](https://github.com/mlflow/mlflow/pull/11215/files#diff-2ec8756f67a20ecbaeec2d2c5e7bf33310a50c015fc3aa487e27100fc4c2f9a7R1771-R1802).

### How to customize a generated query/mutation to join multiple rpc endpoints

The proto to graphql autogeneration only supports 1 to 1 mapping from proto rpc to graphql operation. However, the power of GraphQL is to join multiple rpc endpoints together as one query. So we often would like to customize or extend the autogenerated operations to join these multiple endpoints.

For example, we would like to query data about `Experiment`, `ModelVersions` and `Run` in one query by extending the `MlflowRun` object.

```
query testQuery {
    mlflowGetRun(input: {runId: "my-id"}) {
        run {
            experiment {
                name
            }
            modelVersions {
                name
            }
        }
    }
}
```

To achieve joins, follow the steps below:

- Make sure the rpcs you would like to join are already onboarded to GraphQL by following the `How to onboard a new rpc to GraphQL` section
- Identify the class you would like to extend in `autogenerated_graphql_schema.py` and create a new class that inherits the target class, put it in `graphql_schema_extensions.py`. Add the new fields and the resolver function as you intended. [Example](https://github.com/mlflow/mlflow/pull/11173/files#diff-9e4f7bdf4d7f9d362338bed9ce6607a51b8f520ee605e2fd4c9bda5e43cb617cR21-R31)
- Run `python ./dev/proto_to_graphql/code_generator.py` or `./dev/generate-protos.sh`, you should see the autogenerated schema being updated to reference the extension class you just created.
- Add a test case in `tests/tracking/test_rest_tracking.py` [Example](https://github.com/mlflow/mlflow/pull/11173/files#diff-2ec8756f67a20ecbaeec2d2c5e7bf33310a50c015fc3aa487e27100fc4c2f9a7R1771-R1795)

### How to generate typescript types for a GraphQL operation

To generate typescript types, first make sure the generated schema is up-to-date by running `python ./dev/proto_to_graphql/code_generator.py`

Then write your new query or mutation in the mlflow/server/js/src folder, after that run the following commands:

- cd mlflow/server/js
- yarn graphql-codegen

You should be able to see the generated types in `mlflow/server/js/src/graphql/__generated__/`
```

--------------------------------------------------------------------------------

---[FILE: schema_autogeneration.py]---
Location: mlflow-master/dev/proto_to_graphql/schema_autogeneration.py

```python
import ast

from autogeneration_utils import (
    DUMMY_FIELD,
    INDENT,
    INDENT2,
    SCHEMA_EXTENSION,
    SCHEMA_EXTENSION_MODULE,
    get_descriptor_full_pascal_name,
    get_method_name,
    method_descriptor_to_generated_pb2_file_name,
)
from google.protobuf.descriptor import FieldDescriptor
from string_utils import camel_to_snake, snake_to_pascal

# Mapping from proto descriptor type to graphene object type.
PROTO_TO_GRAPHENE_TYPE = {
    FieldDescriptor.TYPE_BOOL: "graphene.Boolean",
    FieldDescriptor.TYPE_FLOAT: "graphene.Float",
    FieldDescriptor.TYPE_INT32: "graphene.Int",
    FieldDescriptor.TYPE_INT64: "LongString",
    FieldDescriptor.TYPE_STRING: "graphene.String",
    FieldDescriptor.TYPE_DOUBLE: "graphene.Float",
    FieldDescriptor.TYPE_UINT32: "graphene.Int",
    FieldDescriptor.TYPE_UINT64: "LongString",
    FieldDescriptor.TYPE_SINT32: "graphene.Int",
    FieldDescriptor.TYPE_SINT64: "LongString",
    FieldDescriptor.TYPE_BYTES: "graphene.String",
    FieldDescriptor.TYPE_FIXED32: "graphene.Int",
    FieldDescriptor.TYPE_FIXED64: "LongString",
    FieldDescriptor.TYPE_SFIXED32: "graphene.Int",
    FieldDescriptor.TYPE_SFIXED64: "LongString",
    FieldDescriptor.TYPE_ENUM: "graphene.Enum",
}

"""
Based on graphql_schema_extensions.py, constructs a map from the name of the
extended class to the name of the extending class.
For example
    class AutogenExtension(OriginalAutogen)
would give us {"OriginalAutogen": "AutogenExtension"}
"""


class ClassInheritanceVisitor(ast.NodeVisitor):
    def __init__(self):
        self.inheritance_map = {}

    def visit_ClassDef(self, node):
        for base in node.bases:
            if isinstance(base, ast.Name):  # Direct superclass
                if base.id in self.inheritance_map:
                    raise Exception(
                        f"{base.id} is being extended more than once in {SCHEMA_EXTENSION}. "
                        + "A GraphQL schema class should not be extended more than once."
                    )
                self.inheritance_map[base.id] = node.name
        self.generic_visit(node)


def get_manual_extensions():
    with open(SCHEMA_EXTENSION) as file:
        file_content = file.read()

    parsed_content = ast.parse(file_content)
    visitor = ClassInheritanceVisitor()
    visitor.visit(parsed_content)

    return visitor.inheritance_map


# The resulting map
EXTENDED_TO_EXTENDING = get_manual_extensions()

"""
Given the GenerateSchemaState, generate the whole schema with Graphene.
"""


def generate_schema(state):
    schema_builder = ""
    schema_builder += "# GENERATED FILE. PLEASE DON'T MODIFY.\n"
    schema_builder += "# Run uv run ./dev/proto_to_graphql/code_generator.py to regenerate.\n"
    schema_builder += "import graphene\n"
    schema_builder += "import mlflow\n"
    schema_builder += "from mlflow.server.graphql.graphql_custom_scalars import LongString\n"
    schema_builder += "from mlflow.server.graphql.graphql_errors import ApiError\n"
    schema_builder += "from mlflow.utils.proto_json_utils import parse_dict\n"
    schema_builder += "\n"

    for enum in sorted(state.enums, key=lambda item: item.full_name):
        pascal_class_name = snake_to_pascal(get_descriptor_full_pascal_name(enum))
        schema_builder += f"\nclass {pascal_class_name}(graphene.Enum):"
        for i in range(len(enum.values)):
            value = enum.values[i]
            # enum indices start from 1
            schema_builder += f"""\n{INDENT}{value.name} = {i + 1}"""
        schema_builder += "\n\n"

    for type in state.types:
        pascal_class_name = snake_to_pascal(get_descriptor_full_pascal_name(type))
        schema_builder += f"\nclass {pascal_class_name}(graphene.ObjectType):"
        for field in type.fields:
            graphene_type = get_graphene_type_for_field(field, False)
            schema_builder += f"\n{INDENT}{camel_to_snake(field.name)} = {graphene_type}"

        if type in state.outputs:
            schema_builder += f"\n{INDENT}apiError = graphene.Field(ApiError)"

        if len(type.fields) == 0:
            schema_builder += f"\n{INDENT}{DUMMY_FIELD}"

        schema_builder += "\n\n"

    for input in state.inputs:
        pascal_class_name = snake_to_pascal(get_descriptor_full_pascal_name(input)) + "Input"
        schema_builder += f"\nclass {pascal_class_name}(graphene.InputObjectType):"
        for field in input.fields:
            graphene_type = get_graphene_type_for_field(field, True)
            schema_builder += f"\n{INDENT}{camel_to_snake(field.name)} = {graphene_type}"
        if len(input.fields) == 0:
            schema_builder += f"\n{INDENT}{DUMMY_FIELD}"

        schema_builder += "\n\n"

    schema_builder += "\nclass QueryType(graphene.ObjectType):"

    if len(state.queries) == 0:
        schema_builder += f"\n{INDENT}pass"

    for query in sorted(state.queries, key=lambda item: item.name):
        schema_builder += proto_method_to_graphql_operation(query)

    schema_builder += "\n"

    for query in sorted(state.queries, key=lambda item: item.name):
        schema_builder += generate_resolver_function(query)

    schema_builder += "\n"
    schema_builder += "\nclass MutationType(graphene.ObjectType):"

    if len(state.mutations) == 0:
        schema_builder += f"\n{INDENT}pass"

    for mutation in sorted(state.mutations, key=lambda item: item.name):
        schema_builder += proto_method_to_graphql_operation(mutation)

    schema_builder += "\n"

    for mutation in sorted(state.mutations, key=lambda item: item.name):
        schema_builder += generate_resolver_function(mutation)

    return schema_builder


def apply_schema_extension(referenced_class_name):
    if referenced_class_name in EXTENDED_TO_EXTENDING:
        # Using dotted module path as pointed out in the linked GitHub issue.r
        # This is an undocumented feature of Graphene.
        # https://github.com/graphql-python/graphene/issues/110#issuecomment-1219737639
        return f"'{SCHEMA_EXTENSION_MODULE}.{EXTENDED_TO_EXTENDING[referenced_class_name]}'"
    else:
        return referenced_class_name


def get_graphene_type_for_field(field, is_input):
    if field.type == FieldDescriptor.TYPE_ENUM:
        referenced_class_name = apply_schema_extension(
            get_descriptor_full_pascal_name(field.enum_type)
        )
        if field.label == FieldDescriptor.LABEL_REPEATED:
            return f"graphene.List(graphene.NonNull({referenced_class_name}))"
        else:
            return f"graphene.Field({referenced_class_name})"
    elif field.type in (FieldDescriptor.TYPE_GROUP, FieldDescriptor.TYPE_MESSAGE):
        if is_input:
            referenced_class_name = apply_schema_extension(
                f"{get_descriptor_full_pascal_name(field.message_type)}Input"
            )
            field_type_base = f"graphene.InputField({referenced_class_name})"
        else:
            referenced_class_name = apply_schema_extension(
                get_descriptor_full_pascal_name(field.message_type)
            )
            field_type_base = f"graphene.Field({referenced_class_name})"
        if field.label == FieldDescriptor.LABEL_REPEATED:
            return f"graphene.List(graphene.NonNull({referenced_class_name}))"
        else:
            return field_type_base
    else:
        field_type_base = PROTO_TO_GRAPHENE_TYPE[field.type]
        if field.label == FieldDescriptor.LABEL_REPEATED:
            return f"graphene.List({field_type_base})"
        else:
            return f"{field_type_base}()"


def proto_method_to_graphql_operation(method):
    method_name = get_method_name(method)
    input_descriptor = method.input_type
    output_descriptor = method.output_type
    input_class_name = get_descriptor_full_pascal_name(input_descriptor) + "Input"
    out_put_class_name = get_descriptor_full_pascal_name(output_descriptor)
    field_def = f"graphene.Field({out_put_class_name}, input={input_class_name}())"
    return f"\n{INDENT}{method_name} = {field_def}"


def generate_resolver_function(method):
    full_method_name = get_method_name(method)
    snake_case_method_name = camel_to_snake(method.name)
    pascal_case_method_name = snake_to_pascal(snake_case_method_name)
    pb2_file_name = method_descriptor_to_generated_pb2_file_name(method)

    function_builder = ""
    function_builder += f"\n{INDENT}def resolve_{full_method_name}(self, info, input):"
    function_builder += f"\n{INDENT2}input_dict = vars(input)"
    function_builder += (
        f"\n{INDENT2}request_message = mlflow.protos.{pb2_file_name}.{pascal_case_method_name}()"
    )
    function_builder += f"\n{INDENT2}parse_dict(input_dict, request_message)"
    function_builder += (
        f"\n{INDENT2}return mlflow.server.handlers.{snake_case_method_name}_impl(request_message)"
    )
    function_builder += "\n"
    return function_builder
```

--------------------------------------------------------------------------------

---[FILE: string_utils.py]---
Location: mlflow-master/dev/proto_to_graphql/string_utils.py

```python
import re


def camel_to_snake(string):
    return re.sub(r"(?<!^)(?=[A-Z])", "_", string).lower()


def snake_to_camel(string):
    return "".join(x[0].upper() + x[1:] for x in string.split("_"))


def snake_to_pascal(string):
    temp = snake_to_camel(string)
    return temp[0].upper() + temp[1:]
```

--------------------------------------------------------------------------------

````
