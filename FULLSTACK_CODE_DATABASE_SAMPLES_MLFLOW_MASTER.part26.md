---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 26
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 26 of 991)

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

---[FILE: test_resolve_paths.py]---
Location: mlflow-master/dev/clint/tests/test_resolve_paths.py

```python
from __future__ import annotations

import subprocess
from pathlib import Path
from unittest.mock import patch

import pytest
from clint.utils import ALLOWED_EXTS, _git_ls_files, resolve_paths


@pytest.fixture
def git_repo(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Path:
    """Create and initialize a git repository in a temporary directory."""
    subprocess.check_call(["git", "init"], cwd=tmp_path, stdout=subprocess.DEVNULL)
    subprocess.check_call(["git", "config", "user.email", "test@example.com"], cwd=tmp_path)
    subprocess.check_call(["git", "config", "user.name", "Test User"], cwd=tmp_path)
    monkeypatch.chdir(tmp_path)
    return tmp_path


def test_resolve_paths_with_real_git_repo_tracked_and_untracked(git_repo: Path) -> None:
    tracked_py = git_repo / "tracked.py"
    tracked_md = git_repo / "tracked.md"
    tracked_py.write_text("# tracked python file")
    tracked_md.write_text("# tracked markdown file")

    subprocess.check_call(["git", "add", "tracked.py", "tracked.md"])
    subprocess.check_call(["git", "commit", "-m", "Add tracked files"])

    untracked_py = git_repo / "untracked.py"
    untracked_rst = git_repo / "untracked.rst"
    untracked_py.write_text("# untracked python file")
    untracked_rst.write_text("# untracked rst file")

    gitignore = git_repo / ".gitignore"
    gitignore.write_text("ignored.py\n")
    ignored_py = git_repo / "ignored.py"
    ignored_py.write_text("# ignored file")

    result = resolve_paths([Path(".")])

    expected_paths = [
        Path("tracked.md"),
        Path("tracked.py"),
        Path("untracked.py"),
        Path("untracked.rst"),
    ]
    assert result == expected_paths
    assert Path("ignored.py") not in result


def test_resolve_paths_with_real_git_repo_specific_pathspecs(git_repo: Path) -> None:
    subdir = git_repo / "subdir"
    subdir.mkdir()

    root_py = git_repo / "root.py"
    subdir_py = subdir / "sub.py"
    subdir_md = subdir / "sub.md"

    root_py.write_text("# root file")
    subdir_py.write_text("# subdir python file")
    subdir_md.write_text("# subdir markdown file")

    subprocess.check_call(["git", "add", "root.py"])
    subprocess.check_call(["git", "commit", "-m", "Add root file"])

    result = resolve_paths([Path("subdir")])

    expected_paths = [Path("subdir/sub.md"), Path("subdir/sub.py")]
    assert result == expected_paths
    assert Path("root.py") not in result


def test_resolve_paths_with_real_git_repo_untracked_only(git_repo: Path) -> None:
    untracked1 = git_repo / "untracked1.py"
    untracked2 = git_repo / "untracked2.md"
    untracked1.write_text("# untracked file 1")
    untracked2.write_text("# untracked file 2")

    result = resolve_paths([Path(".")])

    expected_paths = [Path("untracked1.py"), Path("untracked2.md")]
    assert result == expected_paths


def test_resolve_paths_with_real_git_repo_tracked_only(git_repo: Path) -> None:
    tracked1 = git_repo / "tracked1.py"
    tracked2 = git_repo / "tracked2.md"
    tracked1.write_text("# tracked file 1")
    tracked2.write_text("# tracked file 2")

    subprocess.check_call(["git", "add", "tracked1.py", "tracked2.md"])
    subprocess.check_call(["git", "commit", "-m", "Add tracked files"])

    result = resolve_paths([Path(".")])

    expected_paths = [Path("tracked1.py"), Path("tracked2.md")]
    assert result == expected_paths


def test_resolve_paths_with_real_git_repo_removed_tracked_file(git_repo: Path) -> None:
    tracked1 = git_repo / "tracked1.py"
    tracked2 = git_repo / "tracked2.md"
    tracked1.write_text("# tracked file 1")
    tracked2.write_text("# tracked file 2")

    subprocess.check_call(["git", "add", "tracked1.py", "tracked2.md"])
    subprocess.check_call(["git", "commit", "-m", "Add tracked files"])

    tracked1.unlink()

    result = resolve_paths([Path(".")])

    expected_paths = [Path("tracked2.md")]
    assert result == expected_paths


def test_git_ls_files_success() -> None:
    mock_output = "file1.py\ndir/file2.md\nfile3.ipynb\n"

    with patch("subprocess.check_output", return_value=mock_output) as mock_check_output:
        result = _git_ls_files([Path(".")])

    mock_check_output.assert_called_once()
    expected = [Path("file1.py"), Path("dir/file2.md"), Path("file3.ipynb")]
    assert result == expected


def test_git_ls_files_empty_output() -> None:
    with patch("subprocess.check_output", return_value="") as mock_check_output:
        result = _git_ls_files([Path(".")])

    mock_check_output.assert_called_once()
    assert result == []


def test_git_ls_files_with_pathspecs() -> None:
    mock_output = "file1.py\n"

    with patch("subprocess.check_output", return_value=mock_output) as mock_check_output:
        result = _git_ls_files([Path("dir1"), Path("file.py")])

    mock_check_output.assert_called_once()
    assert result == [Path("file1.py")]


def test_git_ls_files_subprocess_error() -> None:
    with patch(
        "subprocess.check_output", side_effect=subprocess.CalledProcessError(1, "git")
    ) as mock_check_output:
        with pytest.raises(RuntimeError, match="Failed to list git files"):
            _git_ls_files([Path(".")])

    mock_check_output.assert_called_once()


def test_git_ls_files_os_error() -> None:
    with patch(
        "subprocess.check_output", side_effect=OSError("git not found")
    ) as mock_check_output:
        with pytest.raises(RuntimeError, match="Failed to list git files"):
            _git_ls_files([Path(".")])

    mock_check_output.assert_called_once()


def test_resolve_paths_default_current_dir() -> None:
    mock_output = "file1.py\nfile2.md\n"

    with (
        patch("subprocess.check_output", return_value=mock_output) as mock_check_output,
        patch("pathlib.Path.exists", return_value=True),
    ):
        result = resolve_paths([])

    mock_check_output.assert_called_once()
    expected = [Path("file1.py"), Path("file2.md")]
    assert result == expected


def test_resolve_paths_filters_by_extension() -> None:
    mock_output = "file1.py\nfile2.md\nfile3.txt\nfile4.ipynb\nfile5.mdx\nfile6.js\nfile7.rst\n"

    with (
        patch("subprocess.check_output", return_value=mock_output) as mock_check_output,
        patch("pathlib.Path.exists", return_value=True),
    ):
        result = resolve_paths([Path(".")])

    mock_check_output.assert_called_once()
    expected = [
        Path("file1.py"),
        Path("file2.md"),
        Path("file4.ipynb"),
        Path("file5.mdx"),
        Path("file7.rst"),
    ]
    assert result == expected


def test_resolve_paths_case_insensitive_extensions() -> None:
    mock_output = "file1.PY\nfile2.MD\nfile3.IPYNB\nfile4.py\nfile5.RST\n"

    with (
        patch("subprocess.check_output", return_value=mock_output) as mock_check_output,
        patch("pathlib.Path.exists", return_value=True),
    ):
        result = resolve_paths([Path(".")])

    mock_check_output.assert_called_once()
    expected = [
        Path("file1.PY"),
        Path("file2.MD"),
        Path("file3.IPYNB"),
        Path("file4.py"),
        Path("file5.RST"),
    ]
    assert result == expected


def test_resolve_paths_returns_sorted_list() -> None:
    mock_output = "z_file.py\na_file.md\nm_file.ipynb\n"

    with (
        patch("subprocess.check_output", return_value=mock_output) as mock_check_output,
        patch("pathlib.Path.exists", return_value=True),
    ):
        result = resolve_paths([Path(".")])

    mock_check_output.assert_called_once()
    expected = [Path("a_file.md"), Path("m_file.ipynb"), Path("z_file.py")]
    assert result == expected


def test_resolve_paths_deduplicates_results() -> None:
    mock_output = "file1.py\nfile1.py\nfile2.md\nfile2.md\n"

    with (
        patch("subprocess.check_output", return_value=mock_output) as mock_check_output,
        patch("pathlib.Path.exists", return_value=True),
    ):
        result = resolve_paths([Path(".")])

    mock_check_output.assert_called_once()
    expected = [Path("file1.py"), Path("file2.md")]
    assert result == expected


def test_resolve_paths_with_multiple_pathspecs() -> None:
    mock_output = "dir1/file1.py\ndir2/file2.md\nfile3.ipynb\n"

    with (
        patch("subprocess.check_output", return_value=mock_output) as mock_check_output,
        patch("pathlib.Path.exists", return_value=True),
    ):
        result = resolve_paths([Path("dir1"), Path("file3.ipynb")])

    mock_check_output.assert_called_once()
    expected = [Path("dir1/file1.py"), Path("dir2/file2.md"), Path("file3.ipynb")]
    assert result == expected


def test_resolve_paths_includes_rst_files() -> None:
    mock_output = "README.rst\ndocs/index.rst\nsetup.py\n"

    with (
        patch("subprocess.check_output", return_value=mock_output) as mock_check_output,
        patch("pathlib.Path.exists", return_value=True),
    ):
        result = resolve_paths([Path(".")])

    mock_check_output.assert_called_once()
    expected = [Path("README.rst"), Path("docs/index.rst"), Path("setup.py")]
    assert result == expected


def test_allowed_extensions_constant() -> None:
    expected = {".md", ".mdx", ".rst", ".py", ".ipynb"}
    assert ALLOWED_EXTS == expected
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: mlflow-master/dev/clint/tests/rules/conftest.py

```python
from pathlib import Path

import pytest
from clint.index import SymbolIndex


@pytest.fixture(scope="session")
def index_path(tmp_path_factory: pytest.TempPathFactory) -> Path:
    tmp_dir = tmp_path_factory.mktemp("clint_tests")
    index_file = tmp_dir / "symbol_index.pkl"
    SymbolIndex.build().save(index_file)
    return index_file
```

--------------------------------------------------------------------------------

---[FILE: test_assign_before_append.py]---
Location: mlflow-master/dev/clint/tests/rules/test_assign_before_append.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules import AssignBeforeAppend


def test_assign_before_append_basic(index_path: Path) -> None:
    code = """
items = []
for x in data:
    item = transform(x)
    items.append(item)
"""
    config = Config(select={AssignBeforeAppend.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 1
    assert all(isinstance(r.rule, AssignBeforeAppend) for r in results)
    assert results[0].range == Range(Position(2, 0))


def test_assign_before_append_no_flag_different_variable(index_path: Path) -> None:
    code = """
items = []
for x in data:
    item = transform(x)
    items.append(other_var)
"""
    config = Config(select={AssignBeforeAppend.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0


def test_assign_before_append_no_flag_no_empty_list_init(index_path: Path) -> None:
    code = """
for x in data:
    item = transform(x)
    items.append(item)
"""
    config = Config(select={AssignBeforeAppend.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0


def test_assign_before_append_no_flag_different_list(index_path: Path) -> None:
    code = """
items = []
for x in data:
    item = transform(x)
    other_list.append(item)
"""
    config = Config(select={AssignBeforeAppend.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0


def test_assign_before_append_no_flag_three_statements(index_path: Path) -> None:
    code = """
items = []
for x in data:
    item = transform(x)
    print(item)
    items.append(item)
"""
    config = Config(select={AssignBeforeAppend.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0


def test_assign_before_append_no_flag_one_statement(index_path: Path) -> None:
    code = """
items = []
for x in data:
    items.append(transform(x))
"""
    config = Config(select={AssignBeforeAppend.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0


def test_assign_before_append_no_flag_list_with_initial_values(index_path: Path) -> None:
    code = """
items = [1, 2, 3]
for x in data:
    item = transform(x)
    items.append(item)
"""
    config = Config(select={AssignBeforeAppend.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0


def test_assign_before_append_multiple_violations(index_path: Path) -> None:
    code = """
items = []
for x in data:
    item = transform(x)
    items.append(item)

results = []
for y in other_data:
    result = process(y)
    results.append(result)
"""
    config = Config(select={AssignBeforeAppend.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 2
    assert all(isinstance(r.rule, AssignBeforeAppend) for r in results)
    assert results[0].range == Range(Position(2, 0))
    assert results[1].range == Range(Position(7, 0))


def test_assign_before_append_no_flag_complex_assignment(index_path: Path) -> None:
    code = """
items = []
for x in data:
    item, other = transform(x)
    items.append(item)
"""
    config = Config(select={AssignBeforeAppend.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0


def test_assign_before_append_no_flag_attribute_assignment(index_path: Path) -> None:
    code = """
items = []
for x in data:
    self.item = transform(x)
    items.append(self.item)
"""
    config = Config(select={AssignBeforeAppend.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0


def test_assign_before_append_separated_statements(index_path: Path) -> None:
    code = """
items = []
other_statement()
for x in data:
    item = transform(x)
    items.append(item)
"""
    config = Config(select={AssignBeforeAppend.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0
```

--------------------------------------------------------------------------------

---[FILE: test_docstring_param_order.py]---
Location: mlflow-master/dev/clint/tests/rules/test_docstring_param_order.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.docstring_param_order import DocstringParamOrder


def test_docstring_param_order(index_path: Path) -> None:
    code = """
# Bad
def f(x: int, y: str) -> None:
    '''
    Args:
        y: Second param.
        x: First param.
    '''

# Good
def f(a: int, b: str) -> None:
    '''
    Args:
        a: First param.
        b: Second param.
    '''
"""
    config = Config(select={DocstringParamOrder.name})
    violations = lint_file(Path("test.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, DocstringParamOrder) for v in violations)
    assert violations[0].range == Range(Position(2, 0))
```

--------------------------------------------------------------------------------

---[FILE: test_do_not_disable.py]---
Location: mlflow-master/dev/clint/tests/rules/test_do_not_disable.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.do_not_disable import DoNotDisable


def test_do_not_disable(index_path: Path) -> None:
    code = """
# Bad B006
# noqa: B006

# Bad F821
# noqa: F821

# Good
# noqa: B004
"""
    config = Config(select={DoNotDisable.name})
    violations = lint_file(Path("test.py"), code, config, index_path)
    assert len(violations) == 2
    assert all(isinstance(v.rule, DoNotDisable) for v in violations)
    assert violations[0].range == Range(Position(2, 0))
    assert violations[1].range == Range(Position(5, 0))
```

--------------------------------------------------------------------------------

---[FILE: test_empty_notebook_cell.py]---
Location: mlflow-master/dev/clint/tests/rules/test_empty_notebook_cell.py

```python
import json
from pathlib import Path

from clint.config import Config
from clint.linter import lint_file
from clint.rules.empty_notebook_cell import EmptyNotebookCell


def test_empty_notebook_cell(index_path: Path) -> None:
    notebook_content = {
        "cells": [
            {
                "cell_type": "code",
                "source": [],  # Empty cell
                "metadata": {},
                "execution_count": None,
                "outputs": [],
            },
            {
                "cell_type": "code",
                "source": ["x = 5"],
                "metadata": {},
                "execution_count": None,
                "outputs": [],
            },
            {
                "cell_type": "code",
                "source": [],  # Another empty cell
                "metadata": {},
                "execution_count": None,
                "outputs": [],
            },
        ],
        "metadata": {
            "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"}
        },
        "nbformat": 4,
        "nbformat_minor": 4,
    }
    code = json.dumps(notebook_content)
    config = Config(select={EmptyNotebookCell.name})
    violations = lint_file(Path("test_notebook.ipynb"), code, config, index_path)
    assert len(violations) == 2
    assert all(isinstance(v.rule, EmptyNotebookCell) for v in violations)
    assert violations[0].cell == 1
    assert violations[1].cell == 3
```

--------------------------------------------------------------------------------

---[FILE: test_example_syntax_error.py]---
Location: mlflow-master/dev/clint/tests/rules/test_example_syntax_error.py

```python
from pathlib import Path

import pytest
from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.example_syntax_error import ExampleSyntaxError


def test_example_syntax_error(index_path: Path) -> None:
    code = '''
def bad():
    """
    .. code-block:: python

        def f():

    """

def good():
    """
    .. code-block:: python

        def f():
            return "This is a good example"
    """
'''
    config = Config(select={ExampleSyntaxError.name})
    violations = lint_file(Path("test.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, ExampleSyntaxError) for v in violations)
    assert violations[0].range == Range(Position(5, 8))


@pytest.mark.parametrize("suffix", [".md", ".mdx"])
def test_example_syntax_error_markdown(index_path: Path, suffix: str) -> None:
    code = """
```python
def g():
```
"""
    config = Config(select={ExampleSyntaxError.name})
    violations = lint_file(Path("test").with_suffix(suffix), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, ExampleSyntaxError) for v in violations)
    assert violations[0].range == Range(Position(2, 0))
```

--------------------------------------------------------------------------------

---[FILE: test_extraneous_docstring_param.py]---
Location: mlflow-master/dev/clint/tests/rules/test_extraneous_docstring_param.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.extraneous_docstring_param import ExtraneousDocstringParam


def test_extraneous_docstring_param(index_path: Path) -> None:
    code = '''
def bad_function(param1: str) -> None:
    """
    Example function docstring.

    Args:
        param1: First parameter
        param2: This parameter doesn't exist in function signature
        param3: Another non-existent parameter
    """

def good_function(param1: str, param2: int) -> None:
    """
    Good function with matching parameters.

    Args:
        param1: First parameter
        param2: Second parameter
    """
'''
    config = Config(select={ExtraneousDocstringParam.name})
    violations = lint_file(Path("test.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, ExtraneousDocstringParam) for v in violations)
    assert violations[0].range == Range(Position(1, 0))
```

--------------------------------------------------------------------------------

---[FILE: test_forbidden_deprecation_warning.py]---
Location: mlflow-master/dev/clint/tests/rules/test_forbidden_deprecation_warning.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules import ForbiddenDeprecationWarning


def test_forbidden_deprecation_warning(index_path: Path) -> None:
    code = """
import warnings

# Bad - should be flagged
warnings.warn("message", category=DeprecationWarning)
warnings.warn(
    "multiline message",
    category=DeprecationWarning,
    stacklevel=2
)

# Good - should not be flagged
warnings.warn("message", category=FutureWarning)
warnings.warn("message", category=UserWarning)
warnings.warn("message")  # no category specified
warnings.warn("message", stacklevel=2)  # no category specified
other_function("message", category=DeprecationWarning)  # not warnings.warn
"""
    config = Config(select={ForbiddenDeprecationWarning.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 2
    assert all(isinstance(r.rule, ForbiddenDeprecationWarning) for r in results)
    assert results[0].range == Range(Position(4, 34))  # First warnings.warn call
    assert results[1].range == Range(Position(7, 13))  # Second warnings.warn call


def test_forbidden_deprecation_warning_import_variants(index_path: Path) -> None:
    code = """
import warnings
from warnings import warn
import warnings as w

# All of these should be flagged
warnings.warn("message", category=DeprecationWarning)
warn("message", category=DeprecationWarning)
w.warn("message", category=DeprecationWarning)
"""
    config = Config(select={ForbiddenDeprecationWarning.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 3
    assert all(isinstance(r.rule, ForbiddenDeprecationWarning) for r in results)


def test_forbidden_deprecation_warning_parameter_order(index_path: Path) -> None:
    code = """
import warnings

# Different parameter orders - should be flagged
warnings.warn("message", category=DeprecationWarning)
warnings.warn(category=DeprecationWarning, message="test")
"""
    config = Config(select={ForbiddenDeprecationWarning.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 2
    assert all(isinstance(r.rule, ForbiddenDeprecationWarning) for r in results)


def test_forbidden_deprecation_warning_positional_args(index_path: Path) -> None:
    code = """
import warnings

# Positional arguments - should be flagged
warnings.warn("message", DeprecationWarning)
warnings.warn("message", DeprecationWarning, 2)

# Good - should not be flagged
warnings.warn("message", FutureWarning)
warnings.warn("message")  # no category specified
"""
    config = Config(select={ForbiddenDeprecationWarning.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 2
    assert all(isinstance(r.rule, ForbiddenDeprecationWarning) for r in results)
```

--------------------------------------------------------------------------------

---[FILE: test_forbidden_set_active_model_usage.py]---
Location: mlflow-master/dev/clint/tests/rules/test_forbidden_set_active_model_usage.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.forbidden_set_active_model_usage import ForbiddenSetActiveModelUsage


def test_forbidden_set_active_model_usage(index_path: Path) -> None:
    code = """
import mlflow

# Bad
mlflow.set_active_model("model_name")

# Good
mlflow._set_active_model("model_name")

# Bad - with aliasing
from mlflow import set_active_model
set_active_model("model_name")

# Good - with aliasing
from mlflow import _set_active_model
_set_active_model("model_name")
"""
    config = Config(select={ForbiddenSetActiveModelUsage.name})
    violations = lint_file(Path("test.py"), code, config, index_path)
    assert len(violations) == 3
    assert all(isinstance(v.rule, ForbiddenSetActiveModelUsage) for v in violations)
    assert violations[0].range == Range(Position(4, 0))  # mlflow.set_active_model call
    assert violations[1].range == Range(Position(10, 0))  # from mlflow import set_active_model
    assert violations[2].range == Range(Position(11, 0))  # direct set_active_model call
```

--------------------------------------------------------------------------------

---[FILE: test_forbidden_top_level_import.py]---
Location: mlflow-master/dev/clint/tests/rules/test_forbidden_top_level_import.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.forbidden_top_level_import import ForbiddenTopLevelImport


def test_forbidden_top_level_import(index_path: Path) -> None:
    code = """
# Bad
import foo
from foo import bar

# Good
import baz
"""
    config = Config(
        select={ForbiddenTopLevelImport.name},
        forbidden_top_level_imports={"*": ["foo"]},
    )
    violations = lint_file(Path("test.py"), code, config, index_path)
    assert len(violations) == 2
    assert all(isinstance(v.rule, ForbiddenTopLevelImport) for v in violations)
    assert violations[0].range == Range(Position(2, 0))
    assert violations[1].range == Range(Position(3, 0))
```

--------------------------------------------------------------------------------

---[FILE: test_forbidden_trace_ui_in_notebook.py]---
Location: mlflow-master/dev/clint/tests/rules/test_forbidden_trace_ui_in_notebook.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import lint_file
from clint.rules.forbidden_trace_ui_in_notebook import ForbiddenTraceUIInNotebook


def test_forbidden_trace_ui_in_notebook(index_path: Path) -> None:
    notebook_content = """
{
 "cells": [
  {
   "cell_type": "markdown",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# This is a normal cell"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/html": [
       "<iframe src='http://localhost:5000/static-files/lib/notebook-trace-renderer/index.html'></iframe>"
      ]
     },
     "metadata": {},
     "output_type": "display_data"
    }
   ],
   "source": [
    "# This cell contains trace UI output"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "metadata": {},
   "outputs": [],
   "source": [
    "# This is a normal cell"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3",
   "language": "python",
   "name": "python3"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 4
}
"""
    code = notebook_content
    config = Config(select={ForbiddenTraceUIInNotebook.name})
    violations = lint_file(Path("test.ipynb"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, ForbiddenTraceUIInNotebook) for v in violations)
    assert violations[0].cell == 2
```

--------------------------------------------------------------------------------

---[FILE: test_get_artifact_uri.py]---
Location: mlflow-master/dev/clint/tests/rules/test_get_artifact_uri.py

```python
from pathlib import Path

import pytest
from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules import GetArtifactUri


def test_get_artifact_uri_in_rst_example(index_path: Path) -> None:
    code = """
Documentation
=============

Here's an example:

.. code-block:: python

    import mlflow

    with mlflow.start_run():
        mlflow.sklearn.log_model(model, "model")
        model_uri = mlflow.get_artifact_uri("model")
        print(model_uri)
"""
    config = Config(select={GetArtifactUri.name}, example_rules=[GetArtifactUri.name])
    violations = lint_file(Path("test.rst"), code, config, index_path)
    assert len(violations) == 1
    assert violations[0].rule.name == GetArtifactUri.name
    assert violations[0].range == Range(Position(12, 20))


@pytest.mark.parametrize("suffix", [".md", ".mdx"])
def test_get_artifact_uri_in_markdown_example(index_path: Path, suffix: str) -> None:
    code = """
# Documentation

Here's an example:

```python
import mlflow

with mlflow.start_run():
    mlflow.sklearn.log_model(model, "model")
    model_uri = mlflow.get_artifact_uri("model")
    print(model_uri)
```
"""
    config = Config(select={GetArtifactUri.name}, example_rules=[GetArtifactUri.name])
    violations = lint_file(Path("test").with_suffix(suffix), code, config, index_path)
    assert len(violations) == 1
    assert violations[0].rule.name == GetArtifactUri.name
    assert violations[0].range == Range(Position(10, 16))


def test_get_artifact_uri_not_in_regular_python_files(index_path: Path) -> None:
    code = """
import mlflow

with mlflow.start_run():
    model_uri = mlflow.get_artifact_uri("model")
    print(model_uri)
"""
    config = Config(select={GetArtifactUri.name}, example_rules=[GetArtifactUri.name])
    violations = lint_file(Path("test.py"), code, config, index_path)
    assert len(violations) == 0


def test_get_artifact_uri_without_log_model_allowed(index_path: Path) -> None:
    code = """
Documentation
=============

Here's an example:

.. code-block:: python

    import mlflow

    # This should be allowed - no log_model in the example
    model_uri = mlflow.get_artifact_uri("some_model")
    loaded_model = mlflow.sklearn.load_model(model_uri)
"""
    config = Config(select={GetArtifactUri.name}, example_rules=[GetArtifactUri.name])
    violations = lint_file(Path("test.rst"), code, config, index_path)
    assert len(violations) == 0
```

--------------------------------------------------------------------------------

---[FILE: test_implicit_optional.py]---
Location: mlflow-master/dev/clint/tests/rules/test_implicit_optional.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules import ImplicitOptional


def test_implicit_optional(index_path: Path) -> None:
    code = """
from typing import Optional

# Bad
bad: int = None
class Bad:
    x: str = None

# Good
good: Optional[int] = None
class Good:
    x: Optional[str] = None
"""
    config = Config(select={ImplicitOptional.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 2
    assert all(isinstance(r.rule, ImplicitOptional) for r in results)
    assert results[0].range == Range(Position(4, 5))
    assert results[1].range == Range(Position(6, 7))


def test_implicit_optional_stringified(index_path: Path) -> None:
    code = """
from typing import Optional

# Bad - stringified without Optional or None union
bad1: "int" = None
bad2: "str" = None
class Bad:
    x: "int" = None

# Good - stringified with Optional
good1: "Optional[int]" = None
good2: "Optional[str]" = None
class Good1:
    x: "Optional[str]" = None

# Good - stringified with | None
good3: "int | None" = None
good4: "str | None" = None
good5: "int|None" = None
class Good2:
    x: "SomeClass | None" = None
"""
    config = Config(select={ImplicitOptional.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 3
    assert all(isinstance(r.rule, ImplicitOptional) for r in results)
    assert results[0].range == Range(Position(4, 6))  # bad1
    assert results[1].range == Range(Position(5, 6))  # bad2
    assert results[2].range == Range(Position(7, 7))  # Bad.x
```

--------------------------------------------------------------------------------

---[FILE: test_incorrect_type_annotation.py]---
Location: mlflow-master/dev/clint/tests/rules/test_incorrect_type_annotation.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.incorrect_type_annotation import IncorrectTypeAnnotation


def test_incorrect_type_annotation(index_path: Path) -> None:
    code = """
def bad_function_callable(param: callable) -> callable:
    ...

def bad_function_any(param: any) -> any:
    ...

def good_function(param: Callable[[str], str]) -> Any:
    ...
"""
    config = Config(select={IncorrectTypeAnnotation.name})
    violations = lint_file(Path("test.py"), code, config, index_path)
    assert len(violations) == 4
    assert all(isinstance(v.rule, IncorrectTypeAnnotation) for v in violations)
    assert violations[0].range == Range(Position(1, 33))  # callable
    assert violations[1].range == Range(Position(1, 46))  # callable
    assert violations[2].range == Range(Position(4, 28))  # any
    assert violations[3].range == Range(Position(4, 36))  # any
```

--------------------------------------------------------------------------------

---[FILE: test_invalid_abstract_method.py]---
Location: mlflow-master/dev/clint/tests/rules/test_invalid_abstract_method.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.invalid_abstract_method import InvalidAbstractMethod


def test_invalid_abstract_method(index_path: Path) -> None:
    code = """
import abc

class AbstractExample(abc.ABC):
    @abc.abstractmethod
    def bad_abstract_method_has_implementation(self) -> None:
        return "This should not be here"

    @abc.abstractmethod
    def bad_abstract_method_multiple_statements(self) -> None:
        pass
        ...

    @abc.abstractmethod
    def good_abstract_method_pass(self) -> None:
        pass

    @abc.abstractmethod
    def good_abstract_method_ellipsis(self) -> None:
        ...

    @abc.abstractmethod
    def good_abstract_method_docstring(self) -> None:
        '''This is a valid docstring'''
"""
    config = Config(select={InvalidAbstractMethod.name})
    violations = lint_file(Path("test.py"), code, config, index_path)
    assert len(violations) == 2
    assert all(isinstance(v.rule, InvalidAbstractMethod) for v in violations)
    assert violations[0].range == Range(Position(5, 4))
    assert violations[1].range == Range(Position(9, 4))
```

--------------------------------------------------------------------------------

---[FILE: test_invalid_experimental_decorator.py]---
Location: mlflow-master/dev/clint/tests/rules/test_invalid_experimental_decorator.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.invalid_experimental_decorator import InvalidExperimentalDecorator


def test_invalid_experimental_decorator(index_path: Path) -> None:
    code = """
from mlflow.utils.annotations import experimental

# Bad - no arguments
@experimental
def bad_function1():
    pass

# Bad - no version argument
@experimental()
def bad_function2():
    pass

# Bad - invalid version format
@experimental(version="invalid")
def bad_function3():
    pass

# Bad - pre-release version
@experimental(version="1.0.0rc1")
def bad_function4():
    pass

# Bad - non-string version
@experimental(version=123)
def bad_function5():
    pass

# Good - valid semantic version
@experimental(version="1.2.3")
def good_function1():
    pass

# Good - valid semantic version with multiple parts
@experimental(version="2.0.0")
def good_function2():
    pass
"""
    config = Config(select={InvalidExperimentalDecorator.name})
    violations = lint_file(Path("test.py"), code, config, index_path)
    assert len(violations) == 5
    assert all(isinstance(v.rule, InvalidExperimentalDecorator) for v in violations)
    assert violations[0].range == Range(Position(4, 1))  # @experimental without args
    assert violations[1].range == Range(Position(9, 1))  # @experimental() without version
    assert violations[2].range == Range(Position(14, 1))  # invalid version format
    assert violations[3].range == Range(Position(19, 1))  # pre-release version
    assert violations[4].range == Range(Position(24, 1))  # non-string version
```

--------------------------------------------------------------------------------

---[FILE: test_isinstance_union_syntax.py]---
Location: mlflow-master/dev/clint/tests/rules/test_isinstance_union_syntax.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules import IsinstanceUnionSyntax


def test_isinstance_union_syntax(index_path: Path) -> None:
    code = """
# Bad - basic union syntax
isinstance(obj, str | int)
isinstance(value, int | str | float)

# Bad - parenthesized union in tuple
isinstance(x, ((str | int),))

# Good - tuple syntax (recommended)
isinstance(obj, (str, int))
isinstance(value, (int, str, float))

# Good - single type
isinstance(obj, str)
isinstance(obj, int)

# Good - Union type annotation (different syntax)
isinstance(obj, Union[str, int])

# Good - other functions with union syntax
other_func(obj, str | int)
some_call(x | y)

# Good - invalid isinstance calls, not our concern
isinstance()
isinstance(obj)
"""
    config = Config(select={IsinstanceUnionSyntax.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert all(isinstance(r.rule, IsinstanceUnionSyntax) for r in results)
    assert [r.range for r in results] == [
        Range(Position(2, 0)),
        Range(Position(3, 0)),
        Range(Position(6, 0)),
    ]
```

--------------------------------------------------------------------------------

---[FILE: test_lazy_builtin_import.py]---
Location: mlflow-master/dev/clint/tests/rules/test_lazy_builtin_import.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules import LazyBuiltinImport


def test_lazy_builtin_import(index_path: Path) -> None:
    code = """
def f():
    # Bad
    import sys
    import pandas as pd

# Good
import os
"""
    config = Config(select={LazyBuiltinImport.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 1
    assert isinstance(results[0].rule, LazyBuiltinImport)
    assert results[0].range == Range(Position(3, 4))
```

--------------------------------------------------------------------------------

---[FILE: test_lazy_module.py]---
Location: mlflow-master/dev/clint/tests/rules/test_lazy_module.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.lazy_module import LazyModule


def test_lazy_module(index_path: Path) -> None:
    # Create a file that looks like mlflow/__init__.py for the rule to apply
    code = """
from mlflow.utils.lazy_load import LazyLoader
from typing import TYPE_CHECKING

# Bad - LazyLoader module not imported in TYPE_CHECKING block
anthropic = LazyLoader("mlflow.anthropic", globals(), "mlflow.anthropic")

# Good - LazyLoader with corresponding TYPE_CHECKING import
sklearn = LazyLoader("mlflow.sklearn", globals(), "mlflow.sklearn")

if TYPE_CHECKING:
    from mlflow import sklearn  # Good - this one is imported
"""
    config = Config(select={LazyModule.name})
    violations = lint_file(Path("mlflow", "__init__.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, LazyModule) for v in violations)
    assert violations[0].range == Range(Position(5, 12))  # anthropic LazyLoader
```

--------------------------------------------------------------------------------

````
