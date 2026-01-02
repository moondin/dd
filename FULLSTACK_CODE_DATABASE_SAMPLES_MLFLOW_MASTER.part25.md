---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 25
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 25 of 991)

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

---[FILE: os_environ_delete_in_test.py]---
Location: mlflow-master/dev/clint/src/clint/rules/os_environ_delete_in_test.py

```python
import ast

from clint.resolver import Resolver
from clint.rules.base import Rule


class OsEnvironDeleteInTest(Rule):
    def _message(self) -> str:
        return (
            "Do not delete `os.environ` in test directly (del os.environ[...] or "
            "os.environ.pop(...)). Use `monkeypatch.delenv` "
            "(https://docs.pytest.org/en/stable/reference/reference.html#pytest.MonkeyPatch.delenv)."
        )

    @staticmethod
    def check(node: ast.Delete | ast.Call, resolver: Resolver) -> bool:
        """
        Returns True if the operation is deletion from os.environ[...] or
        a call to os.environ.pop().
        """
        if isinstance(node, ast.Delete):
            # Handle: del os.environ["KEY"]
            if len(node.targets) == 1 and isinstance(node.targets[0], ast.Subscript):
                resolved = resolver.resolve(node.targets[0].value)
                return resolved == ["os", "environ"]
        elif isinstance(node, ast.Call):
            # Handle: os.environ.pop("KEY")
            resolved = resolver.resolve(node)
            return resolved == ["os", "environ", "pop"]
        return False
```

--------------------------------------------------------------------------------

---[FILE: os_environ_set_in_test.py]---
Location: mlflow-master/dev/clint/src/clint/rules/os_environ_set_in_test.py

```python
import ast

from clint.resolver import Resolver
from clint.rules.base import Rule


class OsEnvironSetInTest(Rule):
    def _message(self) -> str:
        return "Do not set `os.environ` in test directly. Use `monkeypatch.setenv` (https://docs.pytest.org/en/stable/reference/reference.html#pytest.MonkeyPatch.setenv)."

    @staticmethod
    def check(node: ast.Assign, resolver: Resolver) -> bool:
        """
        Returns True if the assignment is to os.environ[...].
        """
        if len(node.targets) == 1 and isinstance(node.targets[0], ast.Subscript):
            resolved = resolver.resolve(node.targets[0].value)
            return resolved == ["os", "environ"]
        return False
```

--------------------------------------------------------------------------------

---[FILE: pytest_mark_repeat.py]---
Location: mlflow-master/dev/clint/src/clint/rules/pytest_mark_repeat.py

```python
import ast

from clint.resolver import Resolver
from clint.rules.base import Rule


class PytestMarkRepeat(Rule):
    def _message(self) -> str:
        return (
            "@pytest.mark.repeat decorator should not be committed. "
            "This decorator is meant for local testing only to check for flaky tests."
        )

    @staticmethod
    def check(decorator_list: list[ast.expr], resolver: Resolver) -> ast.expr | None:
        """
        Returns the decorator node if it is a `@pytest.mark.repeat` decorator.
        """
        for deco in decorator_list:
            if (res := resolver.resolve(deco)) and res == ["pytest", "mark", "repeat"]:
                return deco
        return None
```

--------------------------------------------------------------------------------

---[FILE: redundant_test_docstring.py]---
Location: mlflow-master/dev/clint/src/clint/rules/redundant_test_docstring.py

```python
"""Rule to detect redundant docstrings in test functions and classes.

This rule flags ALL single-line docstrings in test functions and classes.
Single-line docstrings in tests rarely provide meaningful context and are
typically redundant. Multi-line docstrings are always allowed as they
generally provide meaningful context.
"""

import ast

from typing_extensions import Self

from clint.rules.base import Rule


class RedundantTestDocstring(Rule):
    def __init__(
        self,
        function_name: str | None = None,
        has_class_docstring: bool = False,
        is_module_docstring: bool = False,
    ) -> None:
        self.function_name = function_name
        self.has_class_docstring = has_class_docstring
        self.is_module_docstring = is_module_docstring

    @classmethod
    def check(
        cls, node: ast.FunctionDef | ast.AsyncFunctionDef | ast.ClassDef, path_name: str
    ) -> Self | None:
        if not (path_name.startswith("test_") or path_name.endswith("_test.py")):
            return None

        is_class = isinstance(node, ast.ClassDef)

        if is_class and not node.name.startswith("Test"):
            return None
        if not is_class and not node.name.startswith("test_"):
            return None

        # Check if docstring exists and get the raw docstring for multiline detection
        if (
            node.body
            and isinstance(node.body[0], ast.Expr)
            and isinstance(node.body[0].value, ast.Constant)
            and isinstance(node.body[0].value.s, str)
        ):
            raw_docstring = node.body[0].value.s

            # If raw docstring has newlines, it's multiline - always allow
            if "\n" in raw_docstring:
                return None

            # Single-line docstrings in test functions/classes rarely provide meaningful context
            return cls(node.name, has_class_docstring=is_class)

        return None

    @classmethod
    def check_module(cls, module: ast.Module, path_name: str) -> Self | None:
        """Check if module-level docstring is redundant."""
        if not (path_name.startswith("test_") or path_name.endswith("_test.py")):
            return None

        # Check raw docstring for multiline detection
        if (
            module.body
            and isinstance(module.body[0], ast.Expr)
            and isinstance(module.body[0].value, ast.Constant)
            and isinstance(module.body[0].value.s, str)
        ):
            raw_docstring = module.body[0].value.s
            # Only flag single-line module docstrings
            if "\n" not in raw_docstring:
                return cls(is_module_docstring=True)

        return None

    def _message(self) -> str:
        if self.is_module_docstring:
            return (
                "Test module has a single-line docstring. "
                "Single-line module docstrings don't provide enough context. "
                "Consider removing it."
            )

        entity_type = "Test class" if self.has_class_docstring else "Test function"
        return (
            f"{entity_type} '{self.function_name}' has a single-line docstring. "
            f"Single-line docstrings in tests rarely provide meaningful context. "
            f"Consider removing it."
        )
```

--------------------------------------------------------------------------------

---[FILE: subprocess_check_call.py]---
Location: mlflow-master/dev/clint/src/clint/rules/subprocess_check_call.py

```python
import ast

from clint.resolver import Resolver
from clint.rules.base import Rule


class SubprocessCheckCall(Rule):
    def _message(self) -> str:
        return (
            "Use `subprocess.check_call(...)` instead of `subprocess.run(..., check=True)` "
            "for better readability. Only applies when check=True is the only keyword argument."
        )

    @staticmethod
    def check(node: ast.Call, resolver: Resolver) -> bool:
        """
        Returns True if `node` is `subprocess.run(..., check=True)` with no other keyword arguments.
        """
        resolved = resolver.resolve(node)

        # Check if this is subprocess.run
        if resolved != ["subprocess", "run"]:
            return False

        # Check if there are any keyword arguments
        if not node.keywords:
            return False

        # Check if the only keyword argument is check=True
        if len(node.keywords) != 1:
            return False

        keyword = node.keywords[0]

        # Check if the keyword is 'check' (not **kwargs)
        if keyword.arg != "check":
            return False

        # Check if the value is True
        if not isinstance(keyword.value, ast.Constant):
            return False

        return keyword.value.value is True
```

--------------------------------------------------------------------------------

---[FILE: temp_dir_in_test.py]---
Location: mlflow-master/dev/clint/src/clint/rules/temp_dir_in_test.py

```python
import ast

from clint.resolver import Resolver
from clint.rules.base import Rule


class TempDirInTest(Rule):
    def _message(self) -> str:
        return "Do not use `tempfile.TemporaryDirectory` in test directly. Use `tmp_path` fixture (https://docs.pytest.org/en/stable/reference/reference.html#tmp-path)."

    @staticmethod
    def check(node: ast.Call, resolver: Resolver) -> bool:
        """
        Returns True if the call is to tempfile.TemporaryDirectory().
        """
        return resolver.resolve(node) == ["tempfile", "TemporaryDirectory"]
```

--------------------------------------------------------------------------------

---[FILE: test_name_typo.py]---
Location: mlflow-master/dev/clint/src/clint/rules/test_name_typo.py

```python
from clint.rules.base import Rule


class TestNameTypo(Rule):
    def _message(self) -> str:
        return "This function looks like a test, but its name does not start with 'test_'."
```

--------------------------------------------------------------------------------

---[FILE: thread_pool_executor_without_thread_name_prefix.py]---
Location: mlflow-master/dev/clint/src/clint/rules/thread_pool_executor_without_thread_name_prefix.py

```python
import ast

from clint.resolver import Resolver
from clint.rules.base import Rule


class ThreadPoolExecutorWithoutThreadNamePrefix(Rule):
    def _message(self) -> str:
        return (
            "`ThreadPoolExecutor()` must be called with a `thread_name_prefix` argument to improve "
            "debugging and traceability of thread-related issues."
        )

    @staticmethod
    def check(node: ast.Call, resolver: Resolver) -> bool:
        """
        Returns True if the call is ThreadPoolExecutor() without a thread_name_prefix parameter.
        """
        if names := resolver.resolve(node):
            return names == ["concurrent", "futures", "ThreadPoolExecutor"] and not any(
                kw.arg == "thread_name_prefix" for kw in node.keywords
            )
        return False
```

--------------------------------------------------------------------------------

---[FILE: typing_extensions.py]---
Location: mlflow-master/dev/clint/src/clint/rules/typing_extensions.py

```python
from clint.rules.base import Rule


class TypingExtensions(Rule):
    def __init__(self, *, full_name: str, allowlist: list[str]) -> None:
        self.full_name = full_name
        self.allowlist = allowlist

    def _message(self) -> str:
        return (
            f"`{self.full_name}` is not allowed to use. Only {self.allowlist} are allowed. "
            "You can extend `tool.clint.typing-extensions-allowlist` in `pyproject.toml` if needed "
            "but make sure that the version requirement for `typing-extensions` is compatible with "
            "the added types."
        )
```

--------------------------------------------------------------------------------

---[FILE: unknown_mlflow_arguments.py]---
Location: mlflow-master/dev/clint/src/clint/rules/unknown_mlflow_arguments.py

```python
from clint.rules.base import Rule


class UnknownMlflowArguments(Rule):
    def __init__(self, function_name: str, unknown_args: set[str]) -> None:
        self.function_name = function_name
        self.unknown_args = unknown_args

    def _message(self) -> str:
        args_str = ", ".join(f"`{arg}`" for arg in sorted(self.unknown_args))
        return (
            f"Unknown arguments {args_str} passed to `{self.function_name}`. "
            "Check the function signature for valid parameter names."
        )
```

--------------------------------------------------------------------------------

---[FILE: unknown_mlflow_function.py]---
Location: mlflow-master/dev/clint/src/clint/rules/unknown_mlflow_function.py

```python
from clint.rules.base import Rule


class UnknownMlflowFunction(Rule):
    def __init__(self, function_name: str) -> None:
        self.function_name = function_name

    def _message(self) -> str:
        return (
            f"Unknown MLflow function: `{self.function_name}`. "
            "This function may not exist or could be misspelled."
        )
```

--------------------------------------------------------------------------------

---[FILE: unnamed_thread.py]---
Location: mlflow-master/dev/clint/src/clint/rules/unnamed_thread.py

```python
import ast

from clint.resolver import Resolver
from clint.rules.base import Rule


class UnnamedThread(Rule):
    def _message(self) -> str:
        return (
            "`threading.Thread()` must be called with a `name` argument to improve debugging "
            "and traceability of thread-related issues."
        )

    @staticmethod
    def check(node: ast.Call, resolver: Resolver) -> bool:
        """
        Returns True if the call is threading.Thread() without a name parameter.
        """
        if names := resolver.resolve(node):
            return names == ["threading", "Thread"] and not any(
                keyword.arg == "name" for keyword in node.keywords
            )
        return False
```

--------------------------------------------------------------------------------

---[FILE: unparameterized_generic_type.py]---
Location: mlflow-master/dev/clint/src/clint/rules/unparameterized_generic_type.py

```python
import ast

from clint.resolver import Resolver
from clint.rules.base import Rule


class UnparameterizedGenericType(Rule):
    def __init__(self, type_hint: str) -> None:
        self.type_hint = type_hint

    @staticmethod
    def is_generic_type(node: ast.Name | ast.Attribute, resolver: Resolver) -> bool:
        if names := resolver.resolve(node):
            return tuple(names) in {
                ("typing", "Callable"),
                ("typing", "Sequence"),
            }
        elif isinstance(node, ast.Name):
            return node.id in {
                "dict",
                "list",
                "set",
                "tuple",
                "frozenset",
            }
        return False

    def _message(self) -> str:
        return (
            f"Generic type `{self.type_hint}` must be parameterized "
            "(e.g., `list[str]` rather than `list`)."
        )
```

--------------------------------------------------------------------------------

---[FILE: use_sys_executable.py]---
Location: mlflow-master/dev/clint/src/clint/rules/use_sys_executable.py

```python
import ast

from clint.resolver import Resolver
from clint.rules.base import Rule


class UseSysExecutable(Rule):
    def _message(self) -> str:
        return (
            "Use `[sys.executable, '-m', 'mlflow', ...]` when running mlflow CLI in a subprocess."
        )

    @staticmethod
    def check(node: ast.Call, resolver: Resolver) -> bool:
        """
        Returns True if `node` looks like `subprocess.Popen(["mlflow", ...])`.
        """
        resolved = resolver.resolve(node)
        if (
            resolved
            and len(resolved) == 2
            and resolved[0] == "subprocess"
            and resolved[1] in ["Popen", "run", "check_output", "check_call"]
            and node.args
        ):
            first_arg = node.args[0]
            if isinstance(first_arg, ast.List) and first_arg.elts:
                first_elem = first_arg.elts[0]
                return (
                    isinstance(first_elem, ast.Constant)
                    and isinstance(first_elem.value, str)
                    and first_elem.value == "mlflow"
                )
        return False
```

--------------------------------------------------------------------------------

---[FILE: use_walrus_operator.py]---
Location: mlflow-master/dev/clint/src/clint/rules/use_walrus_operator.py

```python
import ast

from clint.rules.base import Rule


class UseWalrusOperator(Rule):
    def _message(self) -> str:
        return (
            "Use the walrus operator `:=` when a variable is assigned and only used "
            "within an `if` block that tests its truthiness. "
            "For example, replace `a = ...; if a: use_a(a)` with `if a := ...: use_a(a)`."
        )

    @staticmethod
    def check(
        if_node: ast.If,
        prev_stmt: ast.stmt,
        following_stmts: list[ast.stmt],
    ) -> bool:
        """
        Flags::

            a = func()
            if a:
                use(a)

        Ignores: comparisons, tuple unpacking, multi-line, used in elif/else,
        used after if, line > 100 chars
        """
        # Check if previous statement is a simple assignment (not augmented, not annotated)
        if not isinstance(prev_stmt, ast.Assign):
            return False

        # Skip if the assignment statement spans multiple lines
        if (
            prev_stmt.end_lineno is not None
            and prev_stmt.lineno is not None
            and prev_stmt.end_lineno > prev_stmt.lineno
        ):
            return False

        # Must be a single target assignment to a Name
        if len(prev_stmt.targets) != 1:
            return False

        target = prev_stmt.targets[0]
        if not isinstance(target, ast.Name):
            return False

        var_name = target.id

        # The if condition must be just the variable name (truthiness test)
        if not isinstance(if_node.test, ast.Name):
            return False

        if if_node.test.id != var_name:
            return False

        # Check that the variable is used in the if body
        if not _name_used_in_stmts(var_name, if_node.body):
            return False

        # Check that the variable is NOT used in elif/else branches
        if if_node.orelse and _name_used_in_stmts(var_name, if_node.orelse):
            return False

        # Check that the variable is NOT used after the if statement
        if following_stmts and _name_used_in_stmts(var_name, following_stmts):
            return False

        # Skip if the fixed code would exceed 100 characters
        # Original: "if var:" -> Fixed: "if var := value:"
        value = prev_stmt.value
        if (
            value.end_col_offset is None
            or value.col_offset is None
            or if_node.test.end_col_offset is None
        ):
            return False
        value_width = value.end_col_offset - value.col_offset
        fixed_line_length = (
            if_node.test.end_col_offset
            + 4  # len(" := ")
            + value_width
            + 1  # len(":")
        )
        if fixed_line_length > 100:
            return False

        return True


def _name_used_in_stmts(name: str, stmts: list[ast.stmt]) -> bool:
    """Check if a name is used (loaded) in a list of statements.

    Skips nested function/class definitions to avoid false positives from
    inner scopes that shadow or independently use the same name.
    """
    return any(_name_used_in_node(name, stmt) for stmt in stmts)


def _name_used_in_node(name: str, node: ast.AST) -> bool:
    """Recursively check if a name is used."""
    match node:
        case ast.Name(id=id, ctx=ast.Load()) if id == name:
            return True
        case _:
            return any(_name_used_in_node(name, child) for child in ast.iter_child_nodes(node))


class WalrusOperatorVisitor(ast.NodeVisitor):
    """Visits all statement blocks to check for walrus operator opportunities."""

    def __init__(self) -> None:
        self.violations: list[ast.stmt] = []

    def _check_stmts(self, stmts: list[ast.stmt]) -> None:
        for idx, stmt in enumerate(stmts[1:], start=1):
            if isinstance(stmt, ast.If):
                prev_stmt = stmts[idx - 1]
                following_stmts = stmts[idx + 1 :]
                if UseWalrusOperator.check(stmt, prev_stmt, following_stmts):
                    self.violations.append(prev_stmt)

    def visit_FunctionDef(self, node: ast.FunctionDef) -> None:
        self._check_stmts(node.body)
        self.generic_visit(node)

    def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef) -> None:
        self._check_stmts(node.body)
        self.generic_visit(node)

    def visit_If(self, node: ast.If) -> None:
        self._check_stmts(node.body)
        self._check_stmts(node.orelse)
        self.generic_visit(node)

    def visit_For(self, node: ast.For) -> None:
        self._check_stmts(node.body)
        self._check_stmts(node.orelse)
        self.generic_visit(node)

    def visit_AsyncFor(self, node: ast.AsyncFor) -> None:
        self._check_stmts(node.body)
        self._check_stmts(node.orelse)
        self.generic_visit(node)

    def visit_While(self, node: ast.While) -> None:
        self._check_stmts(node.body)
        self._check_stmts(node.orelse)
        self.generic_visit(node)

    def visit_With(self, node: ast.With) -> None:
        self._check_stmts(node.body)
        self.generic_visit(node)

    def visit_AsyncWith(self, node: ast.AsyncWith) -> None:
        self._check_stmts(node.body)
        self.generic_visit(node)

    def visit_Try(self, node: ast.Try) -> None:
        self._check_stmts(node.body)
        for handler in node.handlers:
            self._check_stmts(handler.body)
        self._check_stmts(node.orelse)
        self._check_stmts(node.finalbody)
        self.generic_visit(node)

    def visit_Match(self, node: ast.Match) -> None:
        for case in node.cases:
            self._check_stmts(case.body)
        self.generic_visit(node)
```

--------------------------------------------------------------------------------

---[FILE: version_major_check.py]---
Location: mlflow-master/dev/clint/src/clint/rules/version_major_check.py

```python
import ast
import re
from typing import TYPE_CHECKING

from clint.rules.base import Rule

if TYPE_CHECKING:
    from clint.resolver import Resolver


class MajorVersionCheck(Rule):
    def _message(self) -> str:
        return (
            "Use `.major` field for major version comparisons instead of full version strings. "
            "This is more explicit, and efficient (avoids creating a second Version object). "
            "For example, use `Version(__version__).major >= 1` instead of "
            '`Version(__version__) >= Version("1.0.0")`.'
        )

    @staticmethod
    def check(node: ast.Compare, resolver: "Resolver") -> bool:
        if len(node.ops) != 1 or len(node.comparators) != 1:
            return False

        if not isinstance(node.ops[0], (ast.GtE, ast.LtE, ast.Gt, ast.Lt, ast.Eq, ast.NotEq)):
            return False

        if not (
            isinstance(node.left, ast.Call)
            and MajorVersionCheck._is_version_call(node.left, resolver)
        ):
            return False

        comparator = node.comparators[0]
        if not (
            isinstance(comparator, ast.Call)
            and MajorVersionCheck._is_version_call(comparator, resolver)
        ):
            return False

        match comparator.args:
            case [arg] if isinstance(arg, ast.Constant) and isinstance(arg.value, str):
                version_str = arg.value
                return MajorVersionCheck._is_major_only_version(version_str)

        return False

    @staticmethod
    def _is_version_call(node: ast.Call, resolver: "Resolver") -> bool:
        if resolved := resolver.resolve(node.func):
            return resolved == ["packaging", "version", "Version"]
        return False

    @staticmethod
    def _is_major_only_version(version_str: str) -> bool:
        pattern = r"^(\d+)\.0\.0$"
        return re.match(pattern, version_str) is not None
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/dev/clint/src/clint/rules/__init__.py

```python
from clint.rules.assign_before_append import AssignBeforeAppend
from clint.rules.base import Rule
from clint.rules.do_not_disable import DoNotDisable
from clint.rules.docstring_param_order import DocstringParamOrder
from clint.rules.empty_notebook_cell import EmptyNotebookCell
from clint.rules.example_syntax_error import ExampleSyntaxError
from clint.rules.extraneous_docstring_param import ExtraneousDocstringParam
from clint.rules.forbidden_deprecation_warning import ForbiddenDeprecationWarning
from clint.rules.forbidden_set_active_model_usage import ForbiddenSetActiveModelUsage
from clint.rules.forbidden_top_level_import import ForbiddenTopLevelImport
from clint.rules.forbidden_trace_ui_in_notebook import ForbiddenTraceUIInNotebook
from clint.rules.get_artifact_uri import GetArtifactUri
from clint.rules.implicit_optional import ImplicitOptional
from clint.rules.incorrect_type_annotation import IncorrectTypeAnnotation
from clint.rules.invalid_abstract_method import InvalidAbstractMethod
from clint.rules.invalid_experimental_decorator import InvalidExperimentalDecorator
from clint.rules.isinstance_union_syntax import IsinstanceUnionSyntax
from clint.rules.lazy_builtin_import import LazyBuiltinImport
from clint.rules.lazy_module import LazyModule
from clint.rules.log_model_artifact_path import LogModelArtifactPath
from clint.rules.markdown_link import MarkdownLink
from clint.rules.missing_docstring_param import MissingDocstringParam
from clint.rules.missing_notebook_h1_header import MissingNotebookH1Header
from clint.rules.mlflow_class_name import MlflowClassName
from clint.rules.mock_patch_as_decorator import MockPatchAsDecorator
from clint.rules.mock_patch_dict_environ import MockPatchDictEnviron
from clint.rules.multi_assign import MultiAssign
from clint.rules.nested_mock_patch import NestedMockPatch
from clint.rules.no_class_based_tests import NoClassBasedTests
from clint.rules.no_rst import NoRst
from clint.rules.no_shebang import NoShebang
from clint.rules.os_chdir_in_test import OsChdirInTest
from clint.rules.os_environ_delete_in_test import OsEnvironDeleteInTest
from clint.rules.os_environ_set_in_test import OsEnvironSetInTest
from clint.rules.pytest_mark_repeat import PytestMarkRepeat
from clint.rules.redundant_test_docstring import RedundantTestDocstring
from clint.rules.subprocess_check_call import SubprocessCheckCall
from clint.rules.temp_dir_in_test import TempDirInTest
from clint.rules.test_name_typo import TestNameTypo
from clint.rules.thread_pool_executor_without_thread_name_prefix import (
    ThreadPoolExecutorWithoutThreadNamePrefix,
)
from clint.rules.typing_extensions import TypingExtensions
from clint.rules.unknown_mlflow_arguments import UnknownMlflowArguments
from clint.rules.unknown_mlflow_function import UnknownMlflowFunction
from clint.rules.unnamed_thread import UnnamedThread
from clint.rules.unparameterized_generic_type import UnparameterizedGenericType
from clint.rules.use_sys_executable import UseSysExecutable
from clint.rules.use_walrus_operator import UseWalrusOperator, WalrusOperatorVisitor
from clint.rules.version_major_check import MajorVersionCheck

ALL_RULES = {rule.name for rule in Rule.__subclasses__()}


__all__ = [
    "ALL_RULES",
    "Rule",
    "DoNotDisable",
    "DocstringParamOrder",
    "EmptyNotebookCell",
    "ExampleSyntaxError",
    "ExtraneousDocstringParam",
    "ForbiddenDeprecationWarning",
    "GetArtifactUri",
    "ForbiddenSetActiveModelUsage",
    "ForbiddenTopLevelImport",
    "ForbiddenTraceUIInNotebook",
    "ImplicitOptional",
    "IncorrectTypeAnnotation",
    "IsinstanceUnionSyntax",
    "InvalidAbstractMethod",
    "InvalidExperimentalDecorator",
    "LazyBuiltinImport",
    "LazyModule",
    "LogModelArtifactPath",
    "MarkdownLink",
    "MissingDocstringParam",
    "MissingNotebookH1Header",
    "MlflowClassName",
    "MockPatchDictEnviron",
    "MockPatchAsDecorator",
    "NestedMockPatch",
    "NoClassBasedTests",
    "NoRst",
    "NoShebang",
    "OsChdirInTest",
    "OsEnvironDeleteInTest",
    "OsEnvironSetInTest",
    "PytestMarkRepeat",
    "RedundantTestDocstring",
    "SubprocessCheckCall",
    "TempDirInTest",
    "TestNameTypo",
    "ThreadPoolExecutorWithoutThreadNamePrefix",
    "TypingExtensions",
    "UnknownMlflowArguments",
    "UnknownMlflowFunction",
    "MultiAssign",
    "UnnamedThread",
    "UnparameterizedGenericType",
    "AssignBeforeAppend",
    "UseSysExecutable",
    "UseWalrusOperator",
    "WalrusOperatorVisitor",
    "MajorVersionCheck",
]
```

--------------------------------------------------------------------------------

---[FILE: test_config.py]---
Location: mlflow-master/dev/clint/tests/test_config.py

```python
import subprocess
from pathlib import Path
from typing import Generator

import pytest
from clint.config import Config
from clint.utils import get_repo_root


@pytest.fixture(autouse=True)
def clear_repo_root_cache() -> Generator[None, None, None]:
    """Clear the get_repo_root cache before each test to avoid cross-test contamination."""
    get_repo_root.cache_clear()
    yield
    get_repo_root.cache_clear()


@pytest.fixture
def tmp_git_repo(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Path:
    """Create a temporary git repository for testing."""
    subprocess.check_call(
        ["git", "init"], cwd=tmp_path, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )
    subprocess.check_call(["git", "config", "user.name", "Test User"], cwd=tmp_path)
    subprocess.check_call(["git", "config", "user.email", "test@example.com"], cwd=tmp_path)
    monkeypatch.chdir(tmp_path)

    return tmp_path


def test_config_validate_exclude_paths_success(tmp_git_repo: Path) -> None:
    test_file = tmp_git_repo / "test_file.py"
    test_file.touch()
    test_dir = tmp_git_repo / "test_dir"
    test_dir.mkdir()

    pyproject = tmp_git_repo / "pyproject.toml"
    pyproject.write_text(f"""
[tool.clint]
exclude = [
    "{test_file.name}",
    "{test_dir.name}"
]
""")

    config = Config.load()
    assert len(config.exclude) == 2
    assert test_file.name in config.exclude
    assert test_dir.name in config.exclude


def test_config_validate_exclude_paths_failure(tmp_git_repo: Path) -> None:
    pyproject = tmp_git_repo / "pyproject.toml"
    pyproject.write_text("""
[tool.clint]
exclude = [
    "non_existing_file.py",
    "non_existing_dir"
]
""")

    with pytest.raises(ValueError, match="Non-existing paths found in exclude field") as exc_info:
        Config.load()

    error_msg = str(exc_info.value)
    assert "non_existing_file.py" in error_msg
    assert "non_existing_dir" in error_msg


def test_config_validate_exclude_paths_mixed(tmp_git_repo: Path) -> None:
    existing_file = tmp_git_repo / "existing_file.py"
    existing_file.touch()

    pyproject = tmp_git_repo / "pyproject.toml"
    pyproject.write_text(f"""
[tool.clint]
exclude = [
    "{existing_file.name}",
    "non_existing_file.py"
]
""")

    with pytest.raises(ValueError, match="Non-existing paths found in exclude field") as exc_info:
        Config.load()

    error_msg = str(exc_info.value)
    assert "non_existing_file.py" in error_msg
    assert "['non_existing_file.py']" in error_msg


def test_config_empty_exclude_list(tmp_git_repo: Path) -> None:
    pyproject = tmp_git_repo / "pyproject.toml"
    pyproject.write_text("""
[tool.clint]
exclude = []
""")

    config = Config.load()
    assert config.exclude == []


def test_config_no_exclude_field(tmp_git_repo: Path) -> None:
    pyproject = tmp_git_repo / "pyproject.toml"
    pyproject.write_text("""
[tool.clint]
select = ["do-not-disable"]
""")

    config = Config.load()
    assert config.exclude == []


def test_config_loads_from_repo_root(tmp_git_repo: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    subdir = tmp_git_repo / "subdir"
    subdir.mkdir()
    pyproject = tmp_git_repo / "pyproject.toml"
    pyproject.write_text("""
[tool.clint]
select = ["do-not-disable"]
exclude = ["excluded_path"]
""")
    excluded_path = tmp_git_repo / "excluded_path"
    excluded_path.mkdir()
    monkeypatch.chdir(subdir)
    config = Config.load()
    assert "excluded_path" in config.exclude
    assert "do-not-disable" in config.select
```

--------------------------------------------------------------------------------

---[FILE: test_index.py]---
Location: mlflow-master/dev/clint/tests/test_index.py

```python
from pathlib import Path
from unittest.mock import patch

from clint.index import SymbolIndex


def test_symbol_index_build_basic(tmp_path: Path) -> None:
    mlflow_dir = tmp_path / "mlflow"
    mlflow_dir.mkdir()

    test_file = mlflow_dir / "test.py"
    test_file.write_text("def test_function(): pass")

    mock_git_output = "mlflow/test.py\n"

    with (
        patch("clint.index.get_repo_root", return_value=tmp_path) as mock_repo_root,
        patch("subprocess.check_output", return_value=mock_git_output) as mock_check_output,
    ):
        index = SymbolIndex.build()
        assert isinstance(index, SymbolIndex)
        mock_repo_root.assert_called_once()
        mock_check_output.assert_called_once()


def test_symbol_index_build_skips_missing_files(tmp_path: Path) -> None:
    mlflow_dir = tmp_path / "mlflow"
    mlflow_dir.mkdir()

    existing_file = mlflow_dir / "existing.py"
    existing_file.write_text("def existing_function(): pass")

    mock_git_output = "mlflow/existing.py\nmlflow/deleted.py\n"

    with (
        patch("clint.index.get_repo_root", return_value=tmp_path) as mock_repo_root,
        patch("subprocess.check_output", return_value=mock_git_output) as mock_check_output,
    ):
        index = SymbolIndex.build()
        assert isinstance(index, SymbolIndex)
        mock_repo_root.assert_called_once()
        mock_check_output.assert_called_once()
```

--------------------------------------------------------------------------------

````
