---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 24
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 24 of 991)

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

---[FILE: utils.py]---
Location: mlflow-master/dev/clint/src/clint/utils.py

```python
from __future__ import annotations

import ast
import re
import subprocess
from functools import lru_cache
from pathlib import Path


@lru_cache(maxsize=1)
def get_repo_root() -> Path:
    """Find the git repository root directory with caching."""
    try:
        result = subprocess.check_output(["git", "rev-parse", "--show-toplevel"], text=True).strip()
        return Path(result)
    except (OSError, subprocess.CalledProcessError) as e:
        raise RuntimeError("Failed to find git repository root") from e


def resolve_expr(expr: ast.expr) -> list[str] | None:
    """
    Resolves `expr` to a list of attribute names. For example, given `expr` like
    `some.module.attribute`, ['some', 'module', 'attribute'] is returned.
    If `expr` is not resolvable, `None` is returned.
    """
    if isinstance(expr, ast.Attribute):
        base = resolve_expr(expr.value)
        if base is None:
            return None
        return base + [expr.attr]
    elif isinstance(expr, ast.Name):
        return [expr.id]

    return None


def get_ignored_rules_for_file(
    file_path: Path, per_file_ignores: dict[re.Pattern[str], set[str]]
) -> set[str]:
    """
    Returns a set of rule names that should be ignored for the given file path.

    Args:
        file_path: The file path to check
        per_file_ignores: Dict mapping compiled regex patterns to lists of rule names to ignore

    Returns:
        Set of rule names to ignore for this file
    """
    ignored_rules: set[str] = set()
    for pattern, rules in per_file_ignores.items():
        if pattern.fullmatch(file_path.as_posix()):
            ignored_rules |= rules
    return ignored_rules


ALLOWED_EXTS = {".md", ".mdx", ".rst", ".py", ".ipynb"}


def _git_ls_files(pathspecs: list[Path]) -> list[Path]:
    """
    Return git-tracked and untracked (but not ignored) files matching the given pathspecs.
    Git does not filter by extension; filtering happens in Python.
    """
    try:
        out = subprocess.check_output(
            ["git", "ls-files", "--cached", "--others", "--exclude-standard", "--", *pathspecs],
            text=True,
        )
    except (OSError, subprocess.CalledProcessError) as e:
        raise RuntimeError("Failed to list git files") from e

    return [Path(line) for line in out.splitlines() if line]


def resolve_paths(paths: list[Path]) -> list[Path]:
    """
    Resolve CLI arguments into a list of tracked and untracked files to lint.

    - Includes git-tracked files and untracked files (but not ignored files)
    - Only includes: .md, .mdx, .rst, .py, .ipynb
    """
    if not paths:
        paths = [Path(".")]

    all_files = _git_ls_files(paths)

    filtered = {p for p in all_files if p.suffix.lower() in ALLOWED_EXTS and p.exists()}

    return sorted(filtered)
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/dev/clint/src/clint/__init__.py

```python
import argparse
import itertools
import json
import re
import sys
import tempfile
from concurrent.futures import ProcessPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path
from typing import Literal

from typing_extensions import Self

from clint.config import Config
from clint.index import SymbolIndex
from clint.linter import lint_file
from clint.utils import get_repo_root, resolve_paths


@dataclass
class Args:
    files: list[str]
    output_format: Literal["text", "json"]

    @classmethod
    def parse(cls) -> Self:
        parser = argparse.ArgumentParser(description="Custom linter for mlflow.")
        parser.add_argument(
            "files",
            nargs="*",
            help="Files to lint. If not specified, lints all files in the current directory.",
        )
        parser.add_argument("--output-format", default="text")
        args, _ = parser.parse_known_args()
        return cls(files=args.files, output_format=args.output_format)


def main() -> None:
    config = Config.load()
    args = Args.parse()

    input_paths = [Path(f) for f in args.files]

    resolved_files = resolve_paths(input_paths)

    # Apply exclude filtering
    files: list[Path] = []
    if config.exclude:
        repo_root = get_repo_root()
        cwd = Path.cwd()
        regex = re.compile("|".join(map(re.escape, config.exclude)))
        for f in resolved_files:
            # Convert file path to be relative to repo root for exclude pattern matching
            repo_relative_path = (cwd / f).resolve().relative_to(repo_root)
            if not regex.match(repo_relative_path.as_posix()):
                files.append(f)
    else:
        files = resolved_files

    # Exit early if no files to lint
    if not files:
        return

    with tempfile.TemporaryDirectory() as tmp_dir:
        # Pickle `SymbolIndex` to avoid expensive serialization overhead when passing
        # the large index object to multiple worker processes
        index_path = Path(tmp_dir) / "symbol_index.pkl"
        SymbolIndex.build().save(index_path)
        with ProcessPoolExecutor() as pool:
            futures = [pool.submit(lint_file, f, f.read_text(), config, index_path) for f in files]
            violations_iter = itertools.chain.from_iterable(
                f.result() for f in as_completed(futures)
            )
            if violations := list(violations_iter):
                if args.output_format == "json":
                    sys.stdout.write(json.dumps([v.json() for v in violations]))
                elif args.output_format == "text":
                    sys.stderr.write("\n".join(map(str, violations)) + "\n")
                count = len(violations)
                label = "error" if count == 1 else "errors"
                rule_label = "this rule" if count == 1 else "these rules"
                print(
                    f"Found {count} {label}\n"
                    f"See dev/clint/README.md for instructions on ignoring {rule_label}.",
                    file=sys.stderr,
                )
                sys.exit(1)
            else:
                print("No errors found!", file=sys.stderr)


if __name__ == "__main__":
    main()
```

--------------------------------------------------------------------------------

---[FILE: __main__.py]---
Location: mlflow-master/dev/clint/src/clint/__main__.py

```python
from clint import main

main()
```

--------------------------------------------------------------------------------

---[FILE: assign_before_append.py]---
Location: mlflow-master/dev/clint/src/clint/rules/assign_before_append.py

```python
import ast

from clint.rules.base import Rule


class AssignBeforeAppend(Rule):
    def _message(self) -> str:
        return (
            "Avoid unnecessary assignment before appending to a list. "
            "Use a list comprehension instead."
        )

    @staticmethod
    def check(node: ast.For, prev_stmt: ast.stmt | None) -> bool:
        """
        Returns True if the for loop contains exactly two statements:
        an assignment followed by appending that variable to a list, AND
        the loop is immediately preceded by an empty list initialization.

        Examples that should be flagged:
        ---
        items = []
        for x in data:
            item = transform(x)
            items.append(item)
        ---
        """
        # Match: for loop with exactly 2 statements in body
        match node:
            case ast.For(body=[stmt1, stmt2]):
                pass
            case _:
                return False

        # Match stmt1: simple assignment (item = x)
        match stmt1:
            case ast.Assign(targets=[ast.Name(id=assigned_var)]):
                pass
            case _:
                return False

        # Match stmt2: list.append(item)
        match stmt2:
            case ast.Expr(
                value=ast.Call(
                    func=ast.Attribute(value=ast.Name(id=list_name), attr="append"),
                    args=[ast.Name(id=appended_var)],
                )
            ):
                # Check if the appended variable is the same as the assigned variable
                if appended_var != assigned_var:
                    return False
            case _:
                return False

        # Only flag if prev_stmt is empty list initialization for the same list
        match prev_stmt:
            case ast.Assign(
                targets=[ast.Name(id=prev_list_name)],
                value=ast.List(elts=[]),
            ) if prev_list_name == list_name:
                return True
            case _:
                return False
```

--------------------------------------------------------------------------------

---[FILE: base.py]---
Location: mlflow-master/dev/clint/src/clint/rules/base.py

```python
import inspect
import itertools
import re
from abc import ABC, abstractmethod
from typing import Any

_id_counter = itertools.count(start=1)
_CLASS_NAME_TO_RULE_NAME_REGEX = re.compile(r"(?<!^)(?=[A-Z])")


class Rule(ABC):
    id: str
    name: str

    def __init_subclass__(cls, **kwargs: Any) -> None:
        super().__init_subclass__(**kwargs)
        # Only generate ID for concrete classes
        if not inspect.isabstract(cls):
            id_ = next(_id_counter)
            cls.id = f"MLF{id_:04d}"
            cls.name = _CLASS_NAME_TO_RULE_NAME_REGEX.sub("-", cls.__name__).lower()

    @abstractmethod
    def _message(self) -> str:
        """
        Return a message that explains this rule.
        """

    @property
    def message(self) -> str:
        return self._message()
```

--------------------------------------------------------------------------------

---[FILE: docstring_param_order.py]---
Location: mlflow-master/dev/clint/src/clint/rules/docstring_param_order.py

```python
from clint.rules.base import Rule


class DocstringParamOrder(Rule):
    def __init__(self, params: list[str]) -> None:
        self.params = params

    def _message(self) -> str:
        return f"Unordered parameters in docstring: {self.params}"
```

--------------------------------------------------------------------------------

---[FILE: do_not_disable.py]---
Location: mlflow-master/dev/clint/src/clint/rules/do_not_disable.py

```python
from typing_extensions import Self

from clint.rules.base import Rule


class DoNotDisable(Rule):
    RULES = {
        "B006": "Use None as default and set value in function body instead of mutable defaults",
        "F821": "Use typing.TYPE_CHECKING for forward references to optional dependencies",
    }

    def __init__(self, rules: set[str]) -> None:
        self.rules = rules

    @classmethod
    def check(cls, rules: set[str]) -> Self | None:
        if s := rules.intersection(DoNotDisable.RULES.keys()):
            return cls(s)
        return None

    def _message(self) -> str:
        # Build message for all rules (works for single and multiple rules)
        hints = []
        for rule in sorted(self.rules):
            if hint := DoNotDisable.RULES.get(rule):
                hints.append(f"{rule}: {hint}")
            else:
                hints.append(rule)
        return f"DO NOT DISABLE {', '.join(hints)}"
```

--------------------------------------------------------------------------------

---[FILE: empty_notebook_cell.py]---
Location: mlflow-master/dev/clint/src/clint/rules/empty_notebook_cell.py

```python
from clint.rules.base import Rule


class EmptyNotebookCell(Rule):
    def _message(self) -> str:
        return "Empty notebook cell. Remove it or add some content."
```

--------------------------------------------------------------------------------

---[FILE: example_syntax_error.py]---
Location: mlflow-master/dev/clint/src/clint/rules/example_syntax_error.py

```python
from clint.rules.base import Rule


class ExampleSyntaxError(Rule):
    def _message(self) -> str:
        return "This example has a syntax error."
```

--------------------------------------------------------------------------------

---[FILE: extraneous_docstring_param.py]---
Location: mlflow-master/dev/clint/src/clint/rules/extraneous_docstring_param.py

```python
from clint.rules.base import Rule


class ExtraneousDocstringParam(Rule):
    def __init__(self, params: set[str]) -> None:
        self.params = params

    def _message(self) -> str:
        return f"Extraneous parameters in docstring: {self.params}"
```

--------------------------------------------------------------------------------

---[FILE: forbidden_deprecation_warning.py]---
Location: mlflow-master/dev/clint/src/clint/rules/forbidden_deprecation_warning.py

```python
import ast

from clint.resolver import Resolver
from clint.rules.base import Rule


def _is_deprecation_warning(expr: ast.expr) -> bool:
    return isinstance(expr, ast.Name) and expr.id == "DeprecationWarning"


class ForbiddenDeprecationWarning(Rule):
    def _message(self) -> str:
        return (
            "Do not use `DeprecationWarning` with `warnings.warn()`. "
            "Use `FutureWarning` instead since Python does not show `DeprecationWarning` "
            "by default."
        )

    @staticmethod
    def check(node: ast.Call, resolver: Resolver) -> ast.expr | None:
        """
        Checks if the given node is a call to `warnings.warn` with `DeprecationWarning`.
        """
        # Check if this is a call to `warnings.warn`
        if (resolved := resolver.resolve(node.func)) and resolved == ["warnings", "warn"]:
            # Check if there's a `category` positional argument with `DeprecationWarning`
            if len(node.args) >= 2 and _is_deprecation_warning(node.args[1]):
                return node.args[1]
            # Check if there's a `category` keyword argument with `DeprecationWarning`
            elif kw := next((kw.value for kw in node.keywords if kw.arg == "category"), None):
                if _is_deprecation_warning(kw):
                    return kw

        return None
```

--------------------------------------------------------------------------------

---[FILE: forbidden_set_active_model_usage.py]---
Location: mlflow-master/dev/clint/src/clint/rules/forbidden_set_active_model_usage.py

```python
import ast

from clint.resolver import Resolver
from clint.rules.base import Rule


class ForbiddenSetActiveModelUsage(Rule):
    def _message(self) -> str:
        return (
            "Usage of `set_active_model` is not allowed in mlflow, use `_set_active_model` instead."
        )

    @staticmethod
    def check(node: ast.Call, resolver: Resolver) -> bool:
        """Check if this is a call to set_active_model function."""
        if names := resolver.resolve(node):
            match names:
                case ["mlflow", *_, "set_active_model"]:
                    return True
                case _:
                    return False
        return False
```

--------------------------------------------------------------------------------

---[FILE: forbidden_top_level_import.py]---
Location: mlflow-master/dev/clint/src/clint/rules/forbidden_top_level_import.py

```python
from clint.rules.base import Rule


class ForbiddenTopLevelImport(Rule):
    def __init__(self, module: str) -> None:
        self.module = module

    def _message(self) -> str:
        return (
            f"Importing module `{self.module}` at the top level is not allowed "
            "in this file. Use lazy import instead."
        )
```

--------------------------------------------------------------------------------

---[FILE: forbidden_trace_ui_in_notebook.py]---
Location: mlflow-master/dev/clint/src/clint/rules/forbidden_trace_ui_in_notebook.py

```python
from clint.rules.base import Rule


class ForbiddenTraceUIInNotebook(Rule):
    def _message(self) -> str:
        return (
            "Found the MLflow Trace UI iframe in the notebook. "
            "The trace UI in cell outputs will not render correctly in previews or the website. "
            "Please run `mlflow.tracing.disable_notebook_display()` and rerun the cell "
            "to remove the iframe."
        )
```

--------------------------------------------------------------------------------

---[FILE: get_artifact_uri.py]---
Location: mlflow-master/dev/clint/src/clint/rules/get_artifact_uri.py

```python
from clint.rules.base import Rule


class GetArtifactUri(Rule):
    def _message(self) -> str:
        return (
            "`mlflow.get_artifact_uri` should not be used in examples. "
            "Use the return value of `log_model` instead."
        )
```

--------------------------------------------------------------------------------

---[FILE: implicit_optional.py]---
Location: mlflow-master/dev/clint/src/clint/rules/implicit_optional.py

```python
import ast

from clint.rules.base import Rule


class ImplicitOptional(Rule):
    def _message(self) -> str:
        return "Use `Optional` if default value is `None`"

    @staticmethod
    def check(node: ast.AnnAssign) -> bool:
        """
        Returns True if the value to assign is `None` but the type annotation is
        not `Optional[...]` or `... | None`. For example: `a: int = None`.
        """
        if not ImplicitOptional._is_none(node.value):
            return False

        # Parse stringified annotations
        if isinstance(node.annotation, ast.Constant) and isinstance(node.annotation.value, str):
            try:
                parsed = ast.parse(node.annotation.value, mode="eval")
                ann = parsed.body
            except (SyntaxError, ValueError):
                # If parsing fails, the annotation is invalid and we trigger the rule
                # since we cannot verify it contains Optional or | None
                return True
        else:
            ann = node.annotation

        return not (ImplicitOptional._is_optional(ann) or ImplicitOptional._is_bitor_none(ann))

    @staticmethod
    def _is_optional(ann: ast.expr) -> bool:
        """
        Returns True if `ann` looks like `Optional[...]`.
        """
        return (
            isinstance(ann, ast.Subscript)
            and isinstance(ann.value, ast.Name)
            and ann.value.id == "Optional"
        )

    @staticmethod
    def _is_bitor_none(ann: ast.expr) -> bool:
        """
        Returns True if `ann` looks like `... | None`.
        """
        return (
            isinstance(ann, ast.BinOp)
            and isinstance(ann.op, ast.BitOr)
            and (isinstance(ann.right, ast.Constant) and ann.right.value is None)
        )

    @staticmethod
    def _is_none(value: ast.expr | None) -> bool:
        """
        Returns True if `value` represents `None`.
        """
        return isinstance(value, ast.Constant) and value.value is None
```

--------------------------------------------------------------------------------

---[FILE: incorrect_type_annotation.py]---
Location: mlflow-master/dev/clint/src/clint/rules/incorrect_type_annotation.py

```python
import ast

from clint.rules.base import Rule


class IncorrectTypeAnnotation(Rule):
    MAPPING = {
        "callable": "Callable",
        "any": "Any",
    }

    def __init__(self, type_hint: str) -> None:
        self.type_hint = type_hint

    @staticmethod
    def check(node: ast.Name) -> bool:
        return node.id in IncorrectTypeAnnotation.MAPPING

    def _message(self) -> str:
        if correct_hint := self.MAPPING.get(self.type_hint):
            return f"Did you mean `{correct_hint}` instead of `{self.type_hint}`?"

        raise ValueError(
            f"Unexpected type: {self.type_hint}. It must be one of {list(self.MAPPING)}."
        )
```

--------------------------------------------------------------------------------

---[FILE: invalid_abstract_method.py]---
Location: mlflow-master/dev/clint/src/clint/rules/invalid_abstract_method.py

```python
import ast

from clint.resolver import Resolver
from clint.rules.base import Rule


class InvalidAbstractMethod(Rule):
    def _message(self) -> str:
        return (
            "Abstract method should only contain a single statement/expression, "
            "and it must be `pass`, `...`, or a docstring."
        )

    @staticmethod
    def _is_abstract_method(
        node: ast.FunctionDef | ast.AsyncFunctionDef, resolver: Resolver
    ) -> bool:
        return any(
            (resolved := resolver.resolve(d)) and resolved == ["abc", "abstractmethod"]
            for d in node.decorator_list
        )

    @staticmethod
    def _has_invalid_body(node: ast.FunctionDef | ast.AsyncFunctionDef) -> bool:
        # Does this abstract method have multiple statements/expressions?
        if len(node.body) > 1:
            return True

        # This abstract method has a single statement/expression.
        # Check if it's `pass`, `...`, or a docstring. If not, it's invalid.
        stmt = node.body[0]

        # Check for `pass`
        if isinstance(stmt, ast.Pass):
            return False

        # Check for `...` or docstring
        if isinstance(stmt, ast.Expr) and isinstance(stmt.value, ast.Constant):
            value = stmt.value.value
            # `...` literal or docstring
            return not (value is ... or isinstance(value, str))

        # Any other statement is invalid
        return True

    @staticmethod
    def check(node: ast.FunctionDef | ast.AsyncFunctionDef, resolver: Resolver) -> bool:
        return InvalidAbstractMethod._is_abstract_method(
            node, resolver
        ) and InvalidAbstractMethod._has_invalid_body(node)
```

--------------------------------------------------------------------------------

---[FILE: invalid_experimental_decorator.py]---
Location: mlflow-master/dev/clint/src/clint/rules/invalid_experimental_decorator.py

```python
import ast

from packaging.version import InvalidVersion, Version

from clint.resolver import Resolver
from clint.rules.base import Rule


def _is_valid_version(version: str) -> bool:
    try:
        v = Version(version)
        return not (v.is_devrelease or v.is_prerelease or v.is_postrelease)
    except InvalidVersion:
        return False


class InvalidExperimentalDecorator(Rule):
    def _message(self) -> str:
        return (
            "Invalid usage of `@experimental` decorator. It must be used with a `version` "
            "argument that is a valid semantic version string."
        )

    @staticmethod
    def check(node: ast.expr, resolver: Resolver) -> bool:
        """
        Returns True if the `@experimental` decorator from mlflow.utils.annotations is used
        incorrectly.
        """
        resolved = resolver.resolve(node)
        if not resolved:
            return False

        if resolved != ["mlflow", "utils", "annotations", "experimental"]:
            return False

        if not isinstance(node, ast.Call):
            return True

        version = next((k.value for k in node.keywords if k.arg == "version"), None)
        if version is None:
            # No `version` argument, invalid usage
            return True

        if not isinstance(version, ast.Constant) or not isinstance(version.value, str):
            # `version` is not a string literal, invalid usage
            return True

        if not _is_valid_version(version.value):
            # `version` is not a valid semantic version, # invalid usage
            return True

        return False
```

--------------------------------------------------------------------------------

---[FILE: isinstance_union_syntax.py]---
Location: mlflow-master/dev/clint/src/clint/rules/isinstance_union_syntax.py

```python
import ast

from clint.rules.base import Rule


class IsinstanceUnionSyntax(Rule):
    def _message(self) -> str:
        return (
            "Use `isinstance(obj, (X, Y))` instead of `isinstance(obj, X | Y)`. "
            "The union syntax with `|` is slower than using a tuple of types."
        )

    @staticmethod
    def check(node: ast.Call) -> bool:
        """
        Returns True if the call is isinstance with union syntax (X | Y) in the second argument.

        Examples that should be flagged:
        - isinstance(obj, str | int)
        - isinstance(obj, int | str | float)
        - isinstance(value, (dict | list))

        Examples that should NOT be flagged:
        - isinstance(obj, (str, int))
        - isinstance(obj, str)
        - other_func(obj, str | int)
        """
        # Check if this is an isinstance call
        if not (isinstance(node.func, ast.Name) and node.func.id == "isinstance"):
            return False

        # Check if the second argument uses union syntax (X | Y)
        match node.args:
            case [_, type_arg]:
                return IsinstanceUnionSyntax._has_union_syntax(type_arg)
            case _:
                return False

    @staticmethod
    def _has_union_syntax(node: ast.expr) -> bool:
        """
        Returns True if the node contains union syntax with BitOr operator.
        This handles nested cases like (A | B) | C.
        """
        match node:
            case ast.BinOp(op=ast.BitOr()):
                return True
            case ast.Tuple(elts=elts):
                # Check if any element in the tuple has union syntax
                return any(map(IsinstanceUnionSyntax._has_union_syntax, elts))
            case _:
                return False
```

--------------------------------------------------------------------------------

---[FILE: lazy_builtin_import.py]---
Location: mlflow-master/dev/clint/src/clint/rules/lazy_builtin_import.py

```python
from clint.rules.base import Rule


class LazyBuiltinImport(Rule):
    def _message(self) -> str:
        return "Builtin modules must be imported at the top level."
```

--------------------------------------------------------------------------------

---[FILE: lazy_module.py]---
Location: mlflow-master/dev/clint/src/clint/rules/lazy_module.py

```python
from clint.rules.base import Rule


class LazyModule(Rule):
    def _message(self) -> str:
        return "Module loaded by `LazyLoader` must be imported in `TYPE_CHECKING` block."
```

--------------------------------------------------------------------------------

---[FILE: log_model_artifact_path.py]---
Location: mlflow-master/dev/clint/src/clint/rules/log_model_artifact_path.py

```python
import ast
from typing import TYPE_CHECKING

from clint.rules.base import Rule
from clint.utils import resolve_expr

if TYPE_CHECKING:
    from clint.index import SymbolIndex


class LogModelArtifactPath(Rule):
    def _message(self) -> str:
        return "`artifact_path` parameter of `log_model` is deprecated. Use `name` instead."

    @staticmethod
    def check(node: ast.Call, index: "SymbolIndex") -> bool:
        """
        Returns True if the call looks like `mlflow.<flavor>.log_model(...)` and
        the `artifact_path` argument is specified.
        """
        parts = resolve_expr(node.func)
        if not parts or len(parts) != 3:
            return False

        first, second, third = parts
        if not (first == "mlflow" and third == "log_model"):
            return False

        # TODO: Remove this once spark flavor supports logging models as logged model artifacts
        if second == "spark":
            return False

        function_name = f"{first}.{second}.log_model"
        artifact_path_idx = LogModelArtifactPath._find_artifact_path_index(index, function_name)
        if artifact_path_idx is None:
            return False

        if len(node.args) > artifact_path_idx:
            return True
        else:
            return any(kw.arg and kw.arg == "artifact_path" for kw in node.keywords)

    @staticmethod
    def _find_artifact_path_index(index: "SymbolIndex", function_name: str) -> int | None:
        """
        Finds the index of the `artifact_path` argument in the function signature of `log_model`
        using the SymbolIndex.
        """
        if f := index.resolve(function_name):
            try:
                return f.all_args.index("artifact_path")
            except ValueError:
                return None
        return None
```

--------------------------------------------------------------------------------

---[FILE: markdown_link.py]---
Location: mlflow-master/dev/clint/src/clint/rules/markdown_link.py

```python
from clint.rules.base import Rule


class MarkdownLink(Rule):
    def _message(self) -> str:
        return (
            "Markdown link is not supported in docstring. "
            "Use reST link instead (e.g., `Link text <link URL>`_)."
        )
```

--------------------------------------------------------------------------------

---[FILE: missing_docstring_param.py]---
Location: mlflow-master/dev/clint/src/clint/rules/missing_docstring_param.py

```python
from clint.rules.base import Rule


class MissingDocstringParam(Rule):
    def __init__(self, params: set[str]) -> None:
        self.params = params

    def _message(self) -> str:
        return f"Missing parameters in docstring: {self.params}"
```

--------------------------------------------------------------------------------

---[FILE: missing_notebook_h1_header.py]---
Location: mlflow-master/dev/clint/src/clint/rules/missing_notebook_h1_header.py

```python
from clint.rules.base import Rule


class MissingNotebookH1Header(Rule):
    def _message(self) -> str:
        return "Notebook should have at least one H1 header for the title."
```

--------------------------------------------------------------------------------

---[FILE: mlflow_class_name.py]---
Location: mlflow-master/dev/clint/src/clint/rules/mlflow_class_name.py

```python
from clint.rules.base import Rule


class MlflowClassName(Rule):
    def _message(self) -> str:
        return "Should use `Mlflow` in class name, not `MLflow` or `MLFlow`."
```

--------------------------------------------------------------------------------

---[FILE: mock_patch_as_decorator.py]---
Location: mlflow-master/dev/clint/src/clint/rules/mock_patch_as_decorator.py

```python
import ast

from clint.resolver import Resolver
from clint.rules.base import Rule


class MockPatchAsDecorator(Rule):
    def _message(self) -> str:
        return (
            "Do not use `unittest.mock.patch` as a decorator. "
            "Use it as a context manager to avoid patches being active longer than needed "
            "and to make it clear which code depends on them."
        )

    @staticmethod
    def check(decorator_list: list[ast.expr], resolver: Resolver) -> ast.expr | None:
        """
        Returns the decorator node if it is a `@mock.patch` or `@patch` decorator.
        """
        for deco in decorator_list:
            if res := resolver.resolve(deco):
                match res:
                    # Resolver returns ["unittest", "mock", "patch", ...]
                    # The *_ captures variants like "object", "dict", etc.
                    case ["unittest", "mock", "patch", *_]:
                        return deco
        return None
```

--------------------------------------------------------------------------------

---[FILE: mock_patch_dict_environ.py]---
Location: mlflow-master/dev/clint/src/clint/rules/mock_patch_dict_environ.py

```python
import ast

from clint.resolver import Resolver
from clint.rules.base import Rule


class MockPatchDictEnviron(Rule):
    def _message(self) -> str:
        return (
            "Do not use `mock.patch.dict` to modify `os.environ` in tests; "
            "use pytest's monkeypatch fixture (monkeypatch.setenv / monkeypatch.delenv) instead."
        )

    @staticmethod
    def check(node: ast.Call, resolver: Resolver) -> bool:
        """
        Returns True if the call is to mock.patch.dict with "os.environ" or os.environ as first arg.
        Handles:
        - mock.patch.dict("os.environ", {...})
        - mock.patch.dict(os.environ, {...})
        - @mock.patch.dict("os.environ", {...})
        """
        if not isinstance(node, ast.Call):
            return False

        # Check if this is mock.patch.dict
        resolved = resolver.resolve(node.func)
        if resolved != ["unittest", "mock", "patch", "dict"]:
            return False

        # Check if the first argument is "os.environ" (string) or os.environ (expression)
        if not node.args:
            return False

        first_arg = node.args[0]

        # Check for string literal "os.environ"
        if isinstance(first_arg, ast.Constant) and first_arg.value == "os.environ":
            return True

        # Check for os.environ as an expression
        resolved_arg = resolver.resolve(first_arg)
        if resolved_arg == ["os", "environ"]:
            return True

        return False
```

--------------------------------------------------------------------------------

---[FILE: multi_assign.py]---
Location: mlflow-master/dev/clint/src/clint/rules/multi_assign.py

```python
import ast

from clint.rules.base import Rule


class MultiAssign(Rule):
    def _message(self) -> str:
        return (
            "Avoid multiple assignment (e.g., `x, y = 1, 2`). Use separate assignments "
            "instead for better readability and easier debugging."
        )

    @staticmethod
    def check(node: ast.Assign) -> bool:
        """
        Returns True if the assignment is a tuple assignment where the number of
        targets matches the number of values.

        Examples that should be flagged:
        - x, y = 1, 2
        - a, b, c = "test", "test2", "test3"
        - foo, bar = None, 1

        Examples that should NOT be flagged:
        - x, y = z
        - a, b = func()
        - x, y = get_coordinates()
        """
        # Check if we have exactly one target and it's a Tuple
        if len(node.targets) != 1 or not isinstance(node.targets[0], ast.Tuple):
            return False

        # Check if the value is also a Tuple
        if not isinstance(node.value, ast.Tuple):
            return False

        # Get the number of targets and values
        num_targets = len(node.targets[0].elts)
        num_values = len(node.value.elts)

        # Flag only when we have matching number of targets and values (at least 2)
        return num_targets == num_values and num_targets >= 2
```

--------------------------------------------------------------------------------

---[FILE: nested_mock_patch.py]---
Location: mlflow-master/dev/clint/src/clint/rules/nested_mock_patch.py

```python
import ast

from clint.resolver import Resolver
from clint.rules.base import Rule


class NestedMockPatch(Rule):
    def _message(self) -> str:
        return (
            "Do not nest `unittest.mock.patch` context managers. "
            "Use multiple context managers in a single `with` statement instead: "
            "`with mock.patch(...), mock.patch(...): ...`"
        )

    @staticmethod
    def check(node: ast.With, resolver: Resolver) -> bool:
        """
        Returns True if the with statement uses mock.patch and contains only a single
        nested with statement that also uses mock.patch.
        """
        # Check if the outer with statement uses mock.patch
        outer_has_mock_patch = any(
            NestedMockPatch._is_mock_patch(item.context_expr, resolver) for item in node.items
        )

        if not outer_has_mock_patch:
            return False

        # Check if the body has exactly one statement and it's a with statement
        if len(node.body) == 1 and isinstance(node.body[0], ast.With):
            # Check if the nested with statement also uses mock.patch
            inner_has_mock_patch = any(
                NestedMockPatch._is_mock_patch(item.context_expr, resolver)
                for item in node.body[0].items
            )

            if inner_has_mock_patch:
                return True

        return False

    @staticmethod
    def _is_mock_patch(node: ast.expr, resolver: Resolver) -> bool:
        """
        Returns True if the node is a call to mock.patch or any of its variants.
        """
        # Handle direct calls: mock.patch(...), mock.patch.object(...), etc.
        if isinstance(node, ast.Call):
            if res := resolver.resolve(node.func):
                match res:
                    # Matches unittest.mock.patch, unittest.mock.patch.object, etc.
                    case ["unittest", "mock", "patch", *_]:
                        return True
        return False
```

--------------------------------------------------------------------------------

---[FILE: no_class_based_tests.py]---
Location: mlflow-master/dev/clint/src/clint/rules/no_class_based_tests.py

```python
import ast

from typing_extensions import Self

from clint.rules.base import Rule


class NoClassBasedTests(Rule):
    def __init__(self, class_name: str) -> None:
        self.class_name = class_name

    @classmethod
    def check(cls, node: ast.ClassDef, path_name: str) -> Self | None:
        # Only check in test files
        if not path_name.startswith("test_"):
            return None

        if not node.name.startswith("Test"):
            return None

        # Check if the class has any test methods
        if any(
            isinstance(stmt, (ast.FunctionDef, ast.AsyncFunctionDef))
            and stmt.name.startswith("test_")
            for stmt in node.body
        ):
            return cls(node.name)

        return None

    def _message(self) -> str:
        return (
            f"Class-based tests are not allowed. "
            f"Convert class '{self.class_name}' to function-based tests."
        )
```

--------------------------------------------------------------------------------

---[FILE: no_rst.py]---
Location: mlflow-master/dev/clint/src/clint/rules/no_rst.py

```python
from clint.rules.base import Rule


class NoRst(Rule):
    def _message(self) -> str:
        return "Do not use RST style. Use Google style instead."
```

--------------------------------------------------------------------------------

---[FILE: no_shebang.py]---
Location: mlflow-master/dev/clint/src/clint/rules/no_shebang.py

```python
from clint.rules.base import Rule


class NoShebang(Rule):
    def _message(self) -> str:
        return "Python scripts should not contain shebang lines"

    @staticmethod
    def check(file_content: str) -> bool:
        """
        Returns True if the file contains a shebang line at the beginning.

        A shebang line is a line that starts with '#!' (typically #!/usr/bin/env python).
        """
        return file_content.startswith("#!")
```

--------------------------------------------------------------------------------

---[FILE: os_chdir_in_test.py]---
Location: mlflow-master/dev/clint/src/clint/rules/os_chdir_in_test.py

```python
import ast

from clint.resolver import Resolver
from clint.rules.base import Rule


class OsChdirInTest(Rule):
    def _message(self) -> str:
        return "Do not use `os.chdir` in test directly. Use `monkeypatch.chdir` (https://docs.pytest.org/en/stable/reference/reference.html#pytest.MonkeyPatch.chdir)."

    @staticmethod
    def check(node: ast.Call, resolver: Resolver) -> bool:
        """
        Returns True if the call is to os.chdir().
        """
        return resolver.resolve(node) == ["os", "chdir"]
```

--------------------------------------------------------------------------------

````
