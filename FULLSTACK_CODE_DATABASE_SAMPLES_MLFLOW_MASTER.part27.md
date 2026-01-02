---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 27
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 27 of 991)

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

---[FILE: test_log_model_artifact_path.py]---
Location: mlflow-master/dev/clint/tests/rules/test_log_model_artifact_path.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.log_model_artifact_path import LogModelArtifactPath


def test_log_model_artifact_path(index_path: Path) -> None:
    code = """
import mlflow

# Bad - using deprecated artifact_path positionally
mlflow.sklearn.log_model(model, "model")

# Bad - using deprecated artifact_path as keyword
mlflow.tensorflow.log_model(model, artifact_path="tf_model")

# Good - using the new 'name' parameter
mlflow.sklearn.log_model(model, name="my_model")

# Good - spark flavor is exempted from this rule
mlflow.spark.log_model(spark_model, "spark_model")

# Bad - another flavor with artifact_path
mlflow.pytorch.log_model(model, artifact_path="pytorch_model")
"""
    config = Config(select={LogModelArtifactPath.name})
    violations = lint_file(Path("test.py"), code, config, index_path)
    assert len(violations) == 3
    assert all(isinstance(v.rule, LogModelArtifactPath) for v in violations)
    assert violations[0].range == Range(Position(4, 0))
    assert violations[1].range == Range(Position(7, 0))
    assert violations[2].range == Range(Position(16, 0))
```

--------------------------------------------------------------------------------

---[FILE: test_markdown_link.py]---
Location: mlflow-master/dev/clint/tests/rules/test_markdown_link.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.markdown_link import MarkdownLink


def test_markdown_link(index_path: Path) -> None:
    code = '''
# Bad
def function_with_markdown_link():
    """
    This function has a [markdown link](https://example.com).
    """

async def async_function_with_markdown_link():
    """
    This async function has a [markdown link](https://example.com).
    """

class MyClass:
    """
    Class with [another markdown link](https://test.com).
    """

# Good
def function_with_rest_link():
    """
    This function has a `reST link <https://example.com>`_.
    """
'''

    config = Config(select={MarkdownLink.name})
    violations = lint_file(Path("test.py"), code, config, index_path)
    assert len(violations) == 3
    assert all(isinstance(v.rule, MarkdownLink) for v in violations)
    assert violations[0].range == Range(Position(3, 4))
    assert violations[1].range == Range(Position(8, 4))
    assert violations[2].range == Range(Position(13, 4))
```

--------------------------------------------------------------------------------

---[FILE: test_missing_docstring_param.py]---
Location: mlflow-master/dev/clint/tests/rules/test_missing_docstring_param.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.missing_docstring_param import MissingDocstringParam


def test_missing_docstring_param(index_path: Path) -> None:
    code = '''
def bad_function(param1: str, param2: int, param3: bool) -> None:
    """
    Example function with missing parameters in docstring.

    Args:
        param1: First parameter described
    """

def good_function(param1: str, param2: int) -> None:
    """
    Good function with all parameters documented.

    Args:
        param1: First parameter
        param2: Second parameter
    """
'''
    config = Config(select={MissingDocstringParam.name})
    violations = lint_file(Path("test.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, MissingDocstringParam) for v in violations)
    assert violations[0].range == Range(Position(1, 0))
```

--------------------------------------------------------------------------------

---[FILE: test_missing_notebook_h1_header.py]---
Location: mlflow-master/dev/clint/tests/rules/test_missing_notebook_h1_header.py

```python
import json
from pathlib import Path

from clint.config import Config
from clint.linter import lint_file
from clint.rules import MissingNotebookH1Header


def test_missing_notebook_h1_header(index_path: Path) -> None:
    notebook = {
        "cells": [
            {
                "cell_type": "markdown",
                "source": ["## Some other header"],
            },
            {
                "cell_type": "code",
                "source": ["print('hello')"],
            },
        ]
    }
    code = json.dumps(notebook)
    config = Config(select={MissingNotebookH1Header.name})
    results = lint_file(Path("test.ipynb"), code, config, index_path)
    assert len(results) == 1
    assert isinstance(results[0].rule, MissingNotebookH1Header)


def test_missing_notebook_h1_header_positive(index_path: Path) -> None:
    notebook = {
        "cells": [
            {
                "cell_type": "markdown",
                "source": ["# This is a title"],
            },
            {
                "cell_type": "code",
                "source": ["print('hello')"],
            },
        ]
    }
    code = json.dumps(notebook)
    config = Config(select={MissingNotebookH1Header.name})
    results = lint_file(Path("test_positive.ipynb"), code, config, index_path)
    assert len(results) == 0
```

--------------------------------------------------------------------------------

---[FILE: test_mlflow_class_name.py]---
Location: mlflow-master/dev/clint/tests/rules/test_mlflow_class_name.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.mlflow_class_name import MlflowClassName


def test_mlflow_class_name(index_path: Path) -> None:
    code = """
# Bad - using MLflow
class MLflowClient:
    pass

# Bad - using MLFlow
class MLFlowLogger:
    pass

# Bad - nested occurrence of MLflow
class CustomMLflowHandler:
    pass

# Bad - nested occurrence of MLFlow
class BaseMLFlowTracker:
    pass

# Good - using Mlflow
class MlflowModel:
    pass

# Good - no MLflow patterns
class DataHandler:
    pass
"""
    config = Config(select={MlflowClassName.name})
    violations = lint_file(Path("test.py"), code, config, index_path)
    assert len(violations) == 4
    assert all(isinstance(v.rule, MlflowClassName) for v in violations)
    assert violations[0].range == Range(Position(2, 0))  # MLflowClient
    assert violations[1].range == Range(Position(6, 0))  # MLFlowLogger
    assert violations[2].range == Range(Position(10, 0))  # CustomMLflowHandler
    assert violations[3].range == Range(Position(14, 0))  # BaseMLFlowTracker
```

--------------------------------------------------------------------------------

---[FILE: test_mock_patch_as_decorator.py]---
Location: mlflow-master/dev/clint/tests/rules/test_mock_patch_as_decorator.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.mock_patch_as_decorator import MockPatchAsDecorator


def test_mock_patch_as_decorator_unittest_mock(index_path: Path) -> None:
    code = """
import unittest.mock

@unittest.mock.patch("foo.bar")
def test_foo(mock_bar):
    ...
"""
    config = Config(select={MockPatchAsDecorator.name})
    violations = lint_file(Path("test_mock_patch.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, MockPatchAsDecorator) for v in violations)
    assert violations[0].range == Range(Position(3, 1))


def test_mock_patch_as_decorator_from_unittest_import_mock(index_path: Path) -> None:
    code = """
from unittest import mock

@mock.patch("foo.bar")
def test_foo(mock_bar):
    ...
"""
    config = Config(select={MockPatchAsDecorator.name})
    violations = lint_file(Path("test_mock_patch.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, MockPatchAsDecorator) for v in violations)
    assert violations[0].range == Range(Position(3, 1))


def test_mock_patch_object_as_decorator(index_path: Path) -> None:
    code = """
from unittest import mock

@mock.patch.object(SomeClass, "method")
def test_foo(mock_method):
    ...
"""
    config = Config(select={MockPatchAsDecorator.name})
    violations = lint_file(Path("test_mock_patch.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, MockPatchAsDecorator) for v in violations)
    assert violations[0].range == Range(Position(3, 1))


def test_mock_patch_dict_as_decorator(index_path: Path) -> None:
    code = """
from unittest import mock

@mock.patch.dict("os.environ", {"FOO": "bar"})
def test_foo():
    ...
"""
    config = Config(select={MockPatchAsDecorator.name})
    violations = lint_file(Path("test_mock_patch.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, MockPatchAsDecorator) for v in violations)
    assert violations[0].range == Range(Position(3, 1))


def test_mock_patch_as_context_manager_is_ok(index_path: Path) -> None:
    code = """
from unittest import mock

def test_foo():
    with mock.patch("foo.bar") as mock_bar:
        ...
"""
    config = Config(select={MockPatchAsDecorator.name})
    violations = lint_file(Path("test_mock_patch.py"), code, config, index_path)
    assert len(violations) == 0


def test_non_test_file_not_checked(index_path: Path) -> None:
    code = """
from unittest import mock

@mock.patch("foo.bar")
def foo(mock_bar):
    ...
"""
    config = Config(select={MockPatchAsDecorator.name})
    violations = lint_file(Path("mock_patch.py"), code, config, index_path)
    assert len(violations) == 0


def test_multiple_patch_decorators(index_path: Path) -> None:
    code = """
from unittest import mock

@mock.patch("foo.bar")
@mock.patch("foo.baz")
def test_foo(mock_baz, mock_bar):
    ...
"""
    config = Config(select={MockPatchAsDecorator.name})
    violations = lint_file(Path("test_mock_patch.py"), code, config, index_path)
    assert len(violations) == 2
    assert all(isinstance(v.rule, MockPatchAsDecorator) for v in violations)
    assert violations[0].range == Range(Position(3, 1))
    assert violations[1].range == Range(Position(4, 1))
```

--------------------------------------------------------------------------------

---[FILE: test_mock_patch_dict_environ.py]---
Location: mlflow-master/dev/clint/tests/rules/test_mock_patch_dict_environ.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.mock_patch_dict_environ import MockPatchDictEnviron


def test_mock_patch_dict_environ_with_string_literal(index_path: Path) -> None:
    code = """
import os
from unittest import mock

# Bad - string literal
def test_func():
    with mock.patch.dict("os.environ", {"FOO": "True"}):
        pass
"""
    config = Config(select={MockPatchDictEnviron.name})
    violations = lint_file(Path("test_file.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, MockPatchDictEnviron) for v in violations)
    assert violations[0].range == Range(Position(6, 9))


def test_mock_patch_dict_environ_with_expression(index_path: Path) -> None:
    code = """
import os
from unittest import mock

# Bad - os.environ as expression
def test_func():
    with mock.patch.dict(os.environ, {"FOO": "bar"}):
        pass
"""
    config = Config(select={MockPatchDictEnviron.name})
    violations = lint_file(Path("test_file.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, MockPatchDictEnviron) for v in violations)
    assert violations[0].range == Range(Position(6, 9))


def test_mock_patch_dict_environ_as_decorator(index_path: Path) -> None:
    code = """
import os
from unittest import mock

# Bad - as decorator
@mock.patch.dict("os.environ", {"FOO": "value"})
def test_func():
    pass
"""
    config = Config(select={MockPatchDictEnviron.name})
    violations = lint_file(Path("test_file.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, MockPatchDictEnviron) for v in violations)
    assert violations[0].range == Range(Position(5, 1))


def test_mock_patch_dict_environ_with_clear(index_path: Path) -> None:
    code = """
import os
from unittest import mock

# Bad - with clear=True
def test_func():
    with mock.patch.dict(os.environ, {}, clear=True):
        pass
"""
    config = Config(select={MockPatchDictEnviron.name})
    violations = lint_file(Path("test_file.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, MockPatchDictEnviron) for v in violations)
    assert violations[0].range == Range(Position(6, 9))


def test_mock_patch_dict_non_environ(index_path: Path) -> None:
    code = """
from unittest import mock

# Good - not os.environ
def test_func():
    with mock.patch.dict("some.other.dict", {"key": "value"}):
        pass
"""
    config = Config(select={MockPatchDictEnviron.name})
    violations = lint_file(Path("test_file.py"), code, config, index_path)
    assert len(violations) == 0


def test_mock_patch_dict_environ_non_test_file(index_path: Path) -> None:
    code = """
import os
from unittest import mock

# Good - not in test file
def normal_func():
    with mock.patch.dict("os.environ", {"FOO": "True"}):
        pass
"""
    config = Config(select={MockPatchDictEnviron.name})
    violations = lint_file(Path("normal_file.py"), code, config, index_path)
    assert len(violations) == 0


def test_mock_patch_dict_environ_with_mock_alias(index_path: Path) -> None:
    code = """
import os
from unittest import mock as mock_lib

# Bad - with alias
def test_func():
    with mock_lib.patch.dict("os.environ", {"FOO": "bar"}):
        pass
"""
    config = Config(select={MockPatchDictEnviron.name})
    violations = lint_file(Path("test_file.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, MockPatchDictEnviron) for v in violations)
    assert violations[0].range == Range(Position(6, 9))


def test_mock_patch_dict_environ_nested_function_not_caught(index_path: Path) -> None:
    code = """
import os
from unittest import mock

def test_outer():
    def inner_function():
        with mock.patch.dict("os.environ", {"FOO": "True"}):
            pass
    inner_function()
"""
    config = Config(select={MockPatchDictEnviron.name})
    violations = lint_file(Path("test_file.py"), code, config, index_path)
    assert len(violations) == 0
```

--------------------------------------------------------------------------------

---[FILE: test_multi_assign.py]---
Location: mlflow-master/dev/clint/tests/rules/test_multi_assign.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules import MultiAssign


def test_multi_assign(index_path: Path) -> None:
    code = """
# Bad
x, y = 1, 2

# Good
a, b = func()
"""
    config = Config(select={MultiAssign.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 1
    assert all(isinstance(r.rule, MultiAssign) for r in results)
    assert results[0].range == Range(Position(2, 0))
```

--------------------------------------------------------------------------------

---[FILE: test_nested_mock_patch.py]---
Location: mlflow-master/dev/clint/tests/rules/test_nested_mock_patch.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.nested_mock_patch import NestedMockPatch


def test_nested_mock_patch_unittest_mock(index_path: Path) -> None:
    code = """
import unittest.mock

def test_foo():
    with unittest.mock.patch("foo.bar"):
        with unittest.mock.patch("foo.baz"):
            ...
"""
    config = Config(select={NestedMockPatch.name})
    violations = lint_file(Path("test_nested_mock_patch.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, NestedMockPatch) for v in violations)
    assert violations[0].range == Range(Position(4, 4))


def test_nested_mock_patch_from_unittest_import_mock(index_path: Path) -> None:
    code = """
from unittest import mock

def test_foo():
    with mock.patch("foo.bar"):
        with mock.patch("foo.baz"):
            ...
"""
    config = Config(select={NestedMockPatch.name})
    violations = lint_file(Path("test_nested_mock_patch.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, NestedMockPatch) for v in violations)
    assert violations[0].range == Range(Position(4, 4))


def test_nested_mock_patch_object(index_path: Path) -> None:
    code = """
from unittest import mock

def test_foo():
    with mock.patch.object(SomeClass, "method"):
        with mock.patch.object(AnotherClass, "method"):
            ...
"""
    config = Config(select={NestedMockPatch.name})
    violations = lint_file(Path("test_nested_mock_patch.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, NestedMockPatch) for v in violations)
    assert violations[0].range == Range(Position(4, 4))


def test_nested_mock_patch_dict(index_path: Path) -> None:
    code = """
from unittest import mock

def test_foo():
    with mock.patch.dict("os.environ", {"FOO": "bar"}):
        with mock.patch.dict("os.environ", {"BAZ": "qux"}):
            ...
"""
    config = Config(select={NestedMockPatch.name})
    violations = lint_file(Path("test_nested_mock_patch.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, NestedMockPatch) for v in violations)
    assert violations[0].range == Range(Position(4, 4))


def test_nested_mock_patch_mixed(index_path: Path) -> None:
    code = """
from unittest import mock

def test_foo():
    with mock.patch("foo.bar"):
        with mock.patch.object(SomeClass, "method"):
            ...
"""
    config = Config(select={NestedMockPatch.name})
    violations = lint_file(Path("test_nested_mock_patch.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, NestedMockPatch) for v in violations)
    assert violations[0].range == Range(Position(4, 4))


def test_multiple_context_managers_is_ok(index_path: Path) -> None:
    code = """
from unittest import mock

def test_foo():
    with mock.patch("foo.bar"), mock.patch("foo.baz"):
        ...
"""
    config = Config(select={NestedMockPatch.name})
    violations = lint_file(Path("test_nested_mock_patch.py"), code, config, index_path)
    assert len(violations) == 0


def test_multiple_context_managers_with_object_is_ok(index_path: Path) -> None:
    code = """
from unittest import mock

def test_foo():
    with mock.patch("foo.bar"), mock.patch.object(SomeClass, "method"):
        ...
"""
    config = Config(select={NestedMockPatch.name})
    violations = lint_file(Path("test_nested_mock_patch.py"), code, config, index_path)
    assert len(violations) == 0


def test_nested_with_but_not_mock_patch_is_ok(index_path: Path) -> None:
    code = """
def test_foo():
    with open("file.txt"):
        with open("file2.txt"):
            ...
"""
    config = Config(select={NestedMockPatch.name})
    violations = lint_file(Path("test_nested_mock_patch.py"), code, config, index_path)
    assert len(violations) == 0


def test_nested_with_only_one_mock_patch_is_ok(index_path: Path) -> None:
    code = """
from unittest import mock

def test_foo():
    with mock.patch("foo.bar"):
        with open("file.txt"):
            ...
"""
    config = Config(select={NestedMockPatch.name})
    violations = lint_file(Path("test_nested_mock_patch.py"), code, config, index_path)
    assert len(violations) == 0


def test_non_nested_mock_patches_are_ok(index_path: Path) -> None:
    code = """
from unittest import mock

def test_foo():
    with mock.patch("foo.bar"):
        pass
    with mock.patch("foo.baz"):
        pass
"""
    config = Config(select={NestedMockPatch.name})
    violations = lint_file(Path("test_nested_mock_patch.py"), code, config, index_path)
    assert len(violations) == 0


def test_non_test_file_not_checked(index_path: Path) -> None:
    code = """
from unittest import mock

def foo():
    with mock.patch("foo.bar"):
        with mock.patch("foo.baz"):
            ...
"""
    config = Config(select={NestedMockPatch.name})
    violations = lint_file(Path("nested_mock_patch.py"), code, config, index_path)
    assert len(violations) == 0


def test_nested_with_code_after_is_ok(index_path: Path) -> None:
    code = """
from unittest import mock

def test_foo():
    with mock.patch("foo.bar"):
        with mock.patch("foo.baz"):
            ...

        assert True
"""
    config = Config(select={NestedMockPatch.name})
    violations = lint_file(Path("test_nested_mock_patch.py"), code, config, index_path)
    assert len(violations) == 0


def test_deeply_nested_mock_patch(index_path: Path) -> None:
    code = """
from unittest import mock

def test_foo():
    with mock.patch("foo.bar"):
        with mock.patch("foo.baz"):
            with mock.patch("foo.qux"):
                ...
"""
    config = Config(select={NestedMockPatch.name})
    violations = lint_file(Path("test_nested_mock_patch.py"), code, config, index_path)
    # Should detect both levels of nesting
    assert len(violations) == 2
    assert all(isinstance(v.rule, NestedMockPatch) for v in violations)
    assert violations[0].range == Range(Position(4, 4))
    assert violations[1].range == Range(Position(5, 8))
```

--------------------------------------------------------------------------------

---[FILE: test_no_class_based_tests.py]---
Location: mlflow-master/dev/clint/tests/rules/test_no_class_based_tests.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.no_class_based_tests import NoClassBasedTests


def test_no_class_based_tests(index_path: Path) -> None:
    code = """import pytest

# Bad - class-based test with test methods
class TestSomething:
    def test_feature_a(self):
        assert True

    def test_feature_b(self):
        assert True

    def helper_method(self):
        return 42

# Bad - another class-based test
class TestAnotherThing:
    def test_something(self):
        pass

# Good - class without test methods (utility class)
class HelperClass:
    def helper_function(self):
        return 42

    def setup_something(self):
        pass

    def test_something(self):
        pass

# Good - function-based test
def test_valid_function():
    assert True

# Good - regular function
def helper_function():
    return 42
"""
    config = Config(select={NoClassBasedTests.name})
    violations = lint_file(Path("test_something.py"), code, config, index_path)
    assert len(violations) == 2
    assert all(isinstance(v.rule, NoClassBasedTests) for v in violations)
    assert violations[0].range == Range(Position(3, 0))  # TestSomething class
    assert violations[1].range == Range(Position(14, 0))  # TestAnotherThing class


def test_no_class_based_tests_non_test_file(index_path: Path) -> None:
    code = """import pytest

# This should not be flagged because it's not in a test file
class TestSomething:
    def test_feature_a(self):
        assert True
"""
    config = Config(select={NoClassBasedTests.name})
    violations = lint_file(Path("regular_file.py"), code, config, index_path)
    assert len(violations) == 0
```

--------------------------------------------------------------------------------

---[FILE: test_no_rst.py]---
Location: mlflow-master/dev/clint/tests/rules/test_no_rst.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.no_rst import NoRst


def test_no_rst(index_path: Path) -> None:
    code = """
def bad(y: int) -> str:
    '''
    :param y: The parameter

    :returns: The result
    '''

def good(x: int) -> str:
    '''
    Args:
        x: The parameter.

    Returns:
        The result.
    '''
"""
    config = Config(select={NoRst.name})
    violations = lint_file(Path("test.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, NoRst) for v in violations)
    assert violations[0].range == Range(Position(2, 4))
```

--------------------------------------------------------------------------------

---[FILE: test_no_shebang.py]---
Location: mlflow-master/dev/clint/tests/rules/test_no_shebang.py

```python
from pathlib import Path

import pytest
from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules import NoShebang


def test_no_shebang(index_path: Path) -> None:
    config = Config(select={NoShebang.name})

    # Test file with shebang - should trigger violation
    code = "#!/usr/bin/env python\nprint('hello')"
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 1
    assert all(isinstance(r.rule, NoShebang) for r in results)
    assert results[0].range == Range(Position(0, 0))  # First line, first column (0-indexed)

    # Test file without shebang - should not trigger violation
    code = "print('hello')"
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0


@pytest.mark.parametrize(
    "shebang",
    [
        "#!/usr/bin/env python",
        "#!/usr/bin/python",
        "#!/usr/bin/python3",
        "#!/usr/bin/env python3",
        "#! /usr/bin/env python",  # With space after #!
    ],
)
def test_no_shebang_various_patterns(index_path: Path, shebang: str) -> None:
    config = Config(select={NoShebang.name})

    code = f"{shebang}\nprint('hello')\n"
    results = lint_file(Path("test.py"), code, config, index_path)
    assert all(isinstance(r.rule, NoShebang) for r in results)
    assert results[0].range == Range(Position(0, 0))


@pytest.mark.parametrize(
    "content",
    [
        "",
        "   \n   \n",
        '\n#!/usr/bin/env python\nprint("hello")\n',
        "# This is a comment\nimport os\n",
    ],
    ids=[
        "empty_file",
        "whitespace_only",
        "shebang_not_on_first_line",
        "comment_not_shebang",
    ],
)
def test_no_shebang_edge_cases(index_path: Path, content: str) -> None:
    config = Config(select={NoShebang.name})

    code = content
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0
```

--------------------------------------------------------------------------------

---[FILE: test_os_chdir_in_test.py]---
Location: mlflow-master/dev/clint/tests/rules/test_os_chdir_in_test.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.os_chdir_in_test import OsChdirInTest


def test_os_chdir_in_test(index_path: Path) -> None:
    code = """
import os

# Bad
def test_func():
    os.chdir("/tmp")

# Good
def non_test_func():
    os.chdir("/tmp")
"""
    config = Config(select={OsChdirInTest.name})
    violations = lint_file(Path("test_file.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, OsChdirInTest) for v in violations)
    assert violations[0].range == Range(Position(5, 4))


def test_os_chdir_in_test_with_from_import(index_path: Path) -> None:
    code = """
from os import chdir

# Bad
def test_func():
    chdir("/tmp")

# Good
def non_test_func():
    chdir("/tmp")
"""
    config = Config(select={OsChdirInTest.name})
    violations = lint_file(Path("test_file.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, OsChdirInTest) for v in violations)
    assert violations[0].range == Range(Position(5, 4))


def test_os_chdir_in_test_no_violation_outside_test(index_path: Path) -> None:
    code = """
import os

def normal_function():
    os.chdir("/tmp")
"""
    config = Config(select={OsChdirInTest.name})
    violations = lint_file(Path("non_test_file.py"), code, config, index_path)
    assert len(violations) == 0


def test_os_chdir_in_test_with_alias(index_path: Path) -> None:
    code = """
import os as operating_system

# Bad - should still catch aliased import
def test_func():
    operating_system.chdir("/tmp")
"""
    config = Config(select={OsChdirInTest.name})
    violations = lint_file(Path("test_file.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, OsChdirInTest) for v in violations)
    assert violations[0].range == Range(Position(5, 4))


def test_os_chdir_in_test_nested_functions_not_caught(index_path: Path) -> None:
    """
    Nested functions are not considered to be "in test" - this matches
    the behavior of other test-specific rules like os.environ.
    """
    code = """
import os

def test_outer():
    def inner_function():
        os.chdir("/tmp")  # Not caught since inner_function is not a test function
    inner_function()
"""
    config = Config(select={OsChdirInTest.name})
    violations = lint_file(Path("test_file.py"), code, config, index_path)
    assert len(violations) == 0


def test_os_chdir_not_os_module(index_path: Path) -> None:
    code = """
class FakeOs:
    @staticmethod
    def chdir(path):
        pass

fake_os = FakeOs()

def test_func():
    fake_os.chdir("/tmp")  # Should not trigger since it's not os.chdir
"""
    config = Config(select={OsChdirInTest.name})
    violations = lint_file(Path("test_file.py"), code, config, index_path)
    assert len(violations) == 0
```

--------------------------------------------------------------------------------

---[FILE: test_os_environ_delete_in_test.py]---
Location: mlflow-master/dev/clint/tests/rules/test_os_environ_delete_in_test.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.os_environ_delete_in_test import OsEnvironDeleteInTest


def test_os_environ_delete_in_test(index_path: Path) -> None:
    code = """
import os

def test_something():
    # Bad
    del os.environ["MY_VAR"]

    # Good
    # monkeypatch.delenv("MY_VAR")
"""
    config = Config(select={OsEnvironDeleteInTest.name})
    violations = lint_file(Path("test_env.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, OsEnvironDeleteInTest) for v in violations)
    assert violations[0].range == Range(Position(5, 4))


def test_os_environ_pop_in_test(index_path: Path) -> None:
    code = """
import os

def test_something():
    # Bad
    os.environ.pop("MY_VAR")

    # Good
    # monkeypatch.delenv("MY_VAR")
"""
    config = Config(select={OsEnvironDeleteInTest.name})
    violations = lint_file(Path("test_env.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, OsEnvironDeleteInTest) for v in violations)
    assert violations[0].range == Range(Position(5, 4))


def test_os_environ_pop_with_default_in_test(index_path: Path) -> None:
    code = """
import os

def test_something():
    # Bad - with default value
    os.environ.pop("MY_VAR", None)

    # Good
    # monkeypatch.delenv("MY_VAR", raising=False)
"""
    config = Config(select={OsEnvironDeleteInTest.name})
    violations = lint_file(Path("test_env.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, OsEnvironDeleteInTest) for v in violations)
    assert violations[0].range == Range(Position(5, 4))


def test_os_environ_multiple_violations(index_path: Path) -> None:
    code = """
import os

def test_something():
    # Bad - del
    del os.environ["VAR1"]

    # Bad - pop
    os.environ.pop("VAR2")

    # Bad - pop with default
    os.environ.pop("VAR3", None)
"""
    config = Config(select={OsEnvironDeleteInTest.name})
    violations = lint_file(Path("test_env.py"), code, config, index_path)
    assert len(violations) == 3
    assert all(isinstance(v.rule, OsEnvironDeleteInTest) for v in violations)
    assert violations[0].range == Range(Position(5, 4))
    assert violations[1].range == Range(Position(8, 4))
    assert violations[2].range == Range(Position(11, 4))


def test_os_environ_pop_not_in_test(index_path: Path) -> None:
    code = """
import os

def some_function():
    # This is OK - not in a test file
    os.environ.pop("MY_VAR")
"""
    config = Config(select={OsEnvironDeleteInTest.name})
    violations = lint_file(Path("utils.py"), code, config, index_path)
    assert len(violations) == 0
```

--------------------------------------------------------------------------------

---[FILE: test_os_environ_set_in_test.py]---
Location: mlflow-master/dev/clint/tests/rules/test_os_environ_set_in_test.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.os_environ_set_in_test import OsEnvironSetInTest


def test_os_environ_set_in_test(index_path: Path) -> None:
    code = """
import os

# Bad
def test_func():
    os.environ["MY_VAR"] = "value"

# Good
def non_test_func():
    os.environ["MY_VAR"] = "value"
"""
    config = Config(select={OsEnvironSetInTest.name})
    violations = lint_file(Path("test_file.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, OsEnvironSetInTest) for v in violations)
    assert violations[0].range == Range(Position(5, 4))
```

--------------------------------------------------------------------------------

---[FILE: test_pytest_mark_repeat.py]---
Location: mlflow-master/dev/clint/tests/rules/test_pytest_mark_repeat.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.pytest_mark_repeat import PytestMarkRepeat


def test_pytest_mark_repeat(index_path: Path) -> None:
    code = """
import pytest

@pytest.mark.repeat(10)
def test_flaky_function():
    ...
"""
    config = Config(select={PytestMarkRepeat.name})
    violations = lint_file(Path("test_pytest_mark_repeat.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, PytestMarkRepeat) for v in violations)
    assert violations[0].range == Range(Position(3, 1))
```

--------------------------------------------------------------------------------

````
