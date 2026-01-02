---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 28
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 28 of 991)

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

---[FILE: test_redundant_test_docstring.py]---
Location: mlflow-master/dev/clint/tests/rules/test_redundant_test_docstring.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import lint_file
from clint.rules.redundant_test_docstring import RedundantTestDocstring


def test_redundant_docstrings_are_flagged(index_path: Path) -> None:
    code = '''
def test_feature_a():
    """
    This test verifies that feature A works correctly.
    It has multiple lines of documentation.
    """
    assert True

def test_feature_behavior():
    """Test feature."""
    assert True

def test_c():
    """Test the complex interaction between modules."""
    assert True

def test_validation_logic():
    """Test validation."""
    assert True

def test_feature_d():
    assert True
'''

    config = Config(select={RedundantTestDocstring.name})
    violations = lint_file(Path("test_something.py"), code, config, index_path)
    # All single-line docstrings should be flagged
    # (test_feature_behavior, test_c, and test_validation_logic)
    assert len(violations) == 3
    assert all(isinstance(v.rule, RedundantTestDocstring) for v in violations)


def test_docstring_word_overlap(index_path: Path) -> None:
    code = '''
def test_very_long_function_name():
    """Short."""
    assert True

def test_short():
    """This is a much longer docstring than the function name."""
    assert True

def test_data_validation():
    """Test data validation"""
    assert True

def test_multi():
    """Line 1
    Line 2"""
    assert True

def test_foo_bar_baz():
    """Test qux."""
    assert True
'''

    config = Config(select={RedundantTestDocstring.name})
    violations = lint_file(Path("test_length.py"), code, config, index_path)
    # All single-line docstrings should be flagged
    # (test_very_long_function_name, test_short, test_data_validation, test_foo_bar_baz)
    assert len(violations) == 4


def test_class_docstrings_follow_same_rules(index_path: Path) -> None:
    code = '''
class TestFeature:
    """
    Tests for the Feature module.
    Includes comprehensive test coverage.
    """
    def test_method(self):
        assert True

class TestFeatureImplementation:
    """Test feature."""
    pass

class TestShort:
    """This is a longer docstring than the class name TestShort."""
    pass
'''

    config = Config(select={RedundantTestDocstring.name})
    violations = lint_file(Path("test_classes.py"), code, config, index_path)
    # Both classes with single-line docstrings should be flagged
    assert len(violations) == 2


def test_non_test_files_are_ignored(index_path: Path) -> None:
    code = '''
def test_something():
    """Short."""
    assert True

class TestFeature:
    """Test."""
    pass
'''

    config = Config(select={RedundantTestDocstring.name})
    violations = lint_file(Path("regular_module.py"), code, config, index_path)
    assert len(violations) == 0


def test_supports_test_suffix_files(index_path: Path) -> None:
    code = '''
def test_feature_implementation():
    """Test feature."""
    assert True

class TestClassImplementation:
    """Test class."""
    pass
'''

    config = Config(select={RedundantTestDocstring.name})
    violations = lint_file(Path("module_test.py"), code, config, index_path)
    assert len(violations) == 2


def test_multiline_docstrings_are_always_allowed(index_path: Path) -> None:
    code = '''def test_with_multiline():
    """
    Multi-line.
    """
    assert True

def test_with_multiline_compact():
    """Line 1
    Line 2"""
    assert True

class TestWithMultilineDoc:
    """
    Multi
    Line
    """
    pass

class TestCompactMultiline:
    """Line1
    Line2"""
    pass
'''

    config = Config(select={RedundantTestDocstring.name})
    violations = lint_file(Path("test_multiline.py"), code, config, index_path)
    assert len(violations) == 0


def test_error_message_content(index_path: Path) -> None:
    code = '''def test_data_processing_validation():
    """Test data processing."""
    pass

class TestDataProcessingValidation:
    """Test data processing."""
    pass
'''

    config = Config(select={RedundantTestDocstring.name})
    violations = lint_file(Path("test_messages.py"), code, config, index_path)
    assert len(violations) == 2

    func_violation = violations[0]
    assert "test_data_processing_validation" in func_violation.rule.message
    assert "single-line docstring" in func_violation.rule.message
    assert "rarely provide meaningful context" in func_violation.rule.message

    class_violation = violations[1]
    assert "TestDataProcessingValidation" in class_violation.rule.message
    assert "Test class" in class_violation.rule.message
    assert "Consider removing it" in class_violation.rule.message


def test_module_single_line_docstrings_are_flagged(index_path: Path) -> None:
    code = '''"""This is a test module."""
def test_something():
    assert True
'''

    config = Config(select={RedundantTestDocstring.name})
    violations = lint_file(Path("test_module.py"), code, config, index_path)
    assert len(violations) == 1
    assert isinstance(violations[0].rule, RedundantTestDocstring)
    assert violations[0].rule.is_module_docstring
    assert "single-line docstring" in violations[0].rule.message


def test_module_multiline_docstrings_are_allowed(index_path: Path) -> None:
    code = '''"""
This is a test module.
It has multiple lines.
"""
def test_something():
    assert True
'''

    config = Config(select={RedundantTestDocstring.name})
    violations = lint_file(Path("test_module.py"), code, config, index_path)
    assert len(violations) == 0


def test_module_without_docstring_is_not_flagged(index_path: Path) -> None:
    code = """def test_something():
    assert True
"""

    config = Config(select={RedundantTestDocstring.name})
    violations = lint_file(Path("test_module.py"), code, config, index_path)
    assert len(violations) == 0


def test_non_test_module_docstrings_are_ignored(index_path: Path) -> None:
    code = '''"""This is a regular module."""
def some_function():
    pass
'''

    config = Config(select={RedundantTestDocstring.name})
    violations = lint_file(Path("regular_module.py"), code, config, index_path)
    assert len(violations) == 0
```

--------------------------------------------------------------------------------

---[FILE: test_subprocess_check_call.py]---
Location: mlflow-master/dev/clint/tests/rules/test_subprocess_check_call.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules import SubprocessCheckCall


def test_subprocess_check_call(index_path: Path) -> None:
    code = """
import subprocess

# Bad
subprocess.run(["echo", "hello"], check=True)

# Good - has other kwargs
subprocess.run(["echo", "hello"], check=True, text=True)

# Good - check_call
subprocess.check_call(["echo", "hello"])

# Good - no check
subprocess.run(["echo", "hello"])
"""
    config = Config(select={SubprocessCheckCall.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 1
    assert isinstance(results[0].rule, SubprocessCheckCall)
    assert results[0].range == Range(Position(4, 0))
```

--------------------------------------------------------------------------------

---[FILE: test_temp_dir_in_test.py]---
Location: mlflow-master/dev/clint/tests/rules/test_temp_dir_in_test.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.temp_dir_in_test import TempDirInTest


def test_temp_dir_in_test(index_path: Path) -> None:
    code = """
import tempfile

# Bad
def test_func():
    tempfile.TemporaryDirectory()

# Good
def non_test_func():
    tempfile.TemporaryDirectory()
"""
    config = Config(select={TempDirInTest.name})
    violations = lint_file(Path("test_file.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, TempDirInTest) for v in violations)
    assert violations[0].range == Range(Position(5, 4))


def test_temp_dir_in_test_with_from_import(index_path: Path) -> None:
    code = """
from tempfile import TemporaryDirectory

# Bad
def test_func():
    TemporaryDirectory()

# Good
def non_test_func():
    TemporaryDirectory()
"""
    config = Config(select={TempDirInTest.name})
    violations = lint_file(Path("test_file.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, TempDirInTest) for v in violations)
    assert violations[0].range == Range(Position(5, 4))


def test_temp_dir_in_test_no_violation_outside_test(index_path: Path) -> None:
    code = """
import tempfile

def normal_function():
    tempfile.TemporaryDirectory()
"""
    config = Config(select={TempDirInTest.name})
    violations = lint_file(Path("non_test_file.py"), code, config, index_path)
    assert len(violations) == 0


def test_temp_dir_in_test_with_alias(index_path: Path) -> None:
    code = """
import tempfile as tf

# Bad - should still catch aliased import
def test_func():
    tf.TemporaryDirectory()
"""
    config = Config(select={TempDirInTest.name})
    violations = lint_file(Path("test_file.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, TempDirInTest) for v in violations)
    assert violations[0].range == Range(Position(5, 4))


def test_temp_dir_in_test_nested_functions_not_caught(index_path: Path) -> None:
    """
    Nested functions are not considered to be "in test" - this matches
    the behavior of other test-specific rules like os.environ.
    """
    code = """
import tempfile

def test_outer():
    def inner_function():
        tempfile.TemporaryDirectory()  # Not caught since inner_function is not a test function
    inner_function()
"""
    config = Config(select={TempDirInTest.name})
    violations = lint_file(Path("test_file.py"), code, config, index_path)
    assert len(violations) == 0


def test_temp_dir_not_tempfile_module(index_path: Path) -> None:
    code = """
class FakeTempfile:
    @staticmethod
    def TemporaryDirectory():
        pass

fake_tempfile = FakeTempfile()

def test_func():
    # Should not trigger since it's not tempfile.TemporaryDirectory
    fake_tempfile.TemporaryDirectory()
"""
    config = Config(select={TempDirInTest.name})
    violations = lint_file(Path("test_file.py"), code, config, index_path)
    assert len(violations) == 0


def test_temp_dir_in_test_with_context_manager(index_path: Path) -> None:
    code = """
import tempfile

# Bad - using with statement
def test_func():
    with tempfile.TemporaryDirectory() as tmpdir:
        pass
"""
    config = Config(select={TempDirInTest.name})
    violations = lint_file(Path("test_file.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, TempDirInTest) for v in violations)
    assert violations[0].range == Range(Position(5, 9))


def test_temp_dir_in_test_assigned_to_variable(index_path: Path) -> None:
    code = """
import tempfile

# Bad - assigned to variable
def test_func():
    tmpdir = tempfile.TemporaryDirectory()
"""
    config = Config(select={TempDirInTest.name})
    violations = lint_file(Path("test_file.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, TempDirInTest) for v in violations)
    assert violations[0].range == Range(Position(5, 13))
```

--------------------------------------------------------------------------------

---[FILE: test_test_name_typo.py]---
Location: mlflow-master/dev/clint/tests/rules/test_test_name_typo.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.test_name_typo import TestNameTypo


def test_test_name_typo(index_path: Path) -> None:
    code = """import pytest

# Bad - starts with 'test' but missing underscore
def testSomething():
    assert True

# Bad - another one without underscore
def testAnother():
    assert True

# Good - properly named test
def test_valid_function():
    assert True

# Good - not a test function
def helper_function():
    return 42

# Good - starts with something else
def tset_something():
    pass
"""
    config = Config(select={TestNameTypo.name})
    violations = lint_file(Path("test_something.py"), code, config, index_path)
    assert len(violations) == 2
    assert all(isinstance(v.rule, TestNameTypo) for v in violations)
    assert violations[0].range == Range(Position(3, 0))
    assert violations[1].range == Range(Position(7, 0))
```

--------------------------------------------------------------------------------

---[FILE: test_thread_pool_executor_without_thread_name_prefix.py]---
Location: mlflow-master/dev/clint/tests/rules/test_thread_pool_executor_without_thread_name_prefix.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules import ThreadPoolExecutorWithoutThreadNamePrefix


def test_thread_pool_executor(index_path: Path) -> None:
    code = """
from concurrent.futures import ThreadPoolExecutor

# Bad
ThreadPoolExecutor()

# Good
ThreadPoolExecutor(thread_name_prefix="worker")
"""
    config = Config(select={ThreadPoolExecutorWithoutThreadNamePrefix.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 1
    assert isinstance(results[0].rule, ThreadPoolExecutorWithoutThreadNamePrefix)
    assert results[0].range == Range(Position(4, 0))
```

--------------------------------------------------------------------------------

---[FILE: test_typing_extensions.py]---
Location: mlflow-master/dev/clint/tests/rules/test_typing_extensions.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.typing_extensions import TypingExtensions


def test_typing_extensions(index_path: Path) -> None:
    code = """
# Bad
from typing_extensions import ParamSpec

# Good
from typing_extensions import Self
"""
    config = Config(
        select={TypingExtensions.name}, typing_extensions_allowlist=["typing_extensions.Self"]
    )
    violations = lint_file(Path("test.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, TypingExtensions) for v in violations)
    assert violations[0].range == Range(Position(2, 0))
```

--------------------------------------------------------------------------------

---[FILE: test_unknown_mlflow_arguments.py]---
Location: mlflow-master/dev/clint/tests/rules/test_unknown_mlflow_arguments.py

```python
from pathlib import Path

import pytest
from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.unknown_mlflow_arguments import UnknownMlflowArguments


def test_unknown_mlflow_arguments(index_path: Path) -> None:
    code = '''
def bad():
    """
    .. code-block:: python

        import mlflow

        mlflow.log_param(foo="bar")

    """

def good():
    """
    .. code-block:: python

        import mlflow

        mlflow.log_param(key="k", value="v")
    """
'''
    config = Config(
        select={UnknownMlflowArguments.name},
        example_rules=[UnknownMlflowArguments.name],
    )
    violations = lint_file(Path("test.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, UnknownMlflowArguments) for v in violations)
    assert violations[0].range == Range(Position(7, 8))


@pytest.mark.parametrize("suffix", [".md", ".mdx"])
def test_unknown_mlflow_arguments_markdown(index_path: Path, suffix: str) -> None:
    code = """
# Bad

```python
import mlflow

mlflow.log_param(foo="bar")
```

# Good

```python
import mlflow

mlflow.log_param(key="k", value="v")
```
"""
    config = Config(
        select={UnknownMlflowArguments.name},
        example_rules=[UnknownMlflowArguments.name],
    )
    violations = lint_file(Path("test").with_suffix(suffix), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, UnknownMlflowArguments) for v in violations)
    assert violations[0].range == Range(Position(6, 0))
```

--------------------------------------------------------------------------------

---[FILE: test_unknown_mlflow_function.py]---
Location: mlflow-master/dev/clint/tests/rules/test_unknown_mlflow_function.py

```python
from pathlib import Path

import pytest
from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.unknown_mlflow_function import UnknownMlflowFunction


def test_unknown_mlflow_function(index_path: Path) -> None:
    code = '''
def bad():
    """
    .. code-block:: python

        import mlflow

        mlflow.foo()

    """


def good():

    """
    .. code-block:: python

        import mlflow

        mlflow.log_param("k", "v")

    """
'''
    config = Config(select={UnknownMlflowFunction.name}, example_rules=[UnknownMlflowFunction.name])
    violations = lint_file(Path("test.py"), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, UnknownMlflowFunction) for v in violations)
    assert violations[0].range == Range(Position(7, 8))


@pytest.mark.parametrize("suffix", [".md", ".mdx"])
def test_unknown_mlflow_function_markdown(index_path: Path, suffix: str) -> None:
    code = """
# Bad

```python
import mlflow

mlflow.foo()
```

# Good

```python
import mlflow

mlflow.log_param("k", "v")
```

"""
    config = Config(
        select={UnknownMlflowFunction.name},
        example_rules=[UnknownMlflowFunction.name],
    )
    violations = lint_file(Path("test").with_suffix(suffix), code, config, index_path)
    assert len(violations) == 1
    assert all(isinstance(v.rule, UnknownMlflowFunction) for v in violations)
    assert violations[0].range == Range(Position(6, 0))
```

--------------------------------------------------------------------------------

---[FILE: test_unnamed_thread.py]---
Location: mlflow-master/dev/clint/tests/rules/test_unnamed_thread.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules import UnnamedThread


def test_unnamed_thread(index_path: Path) -> None:
    code = """
import threading

# Bad
threading.Thread(target=lambda: None)

# Good
# threading.Thread(target=lambda: None, name="worker")
"""
    config = Config(select={UnnamedThread.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 1
    assert isinstance(results[0].rule, UnnamedThread)
    assert results[0].range == Range(Position(4, 0))
```

--------------------------------------------------------------------------------

---[FILE: test_unparameterized_generic_type.py]---
Location: mlflow-master/dev/clint/tests/rules/test_unparameterized_generic_type.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules.unparameterized_generic_type import UnparameterizedGenericType


def test_unparameterized_generic_type(index_path: Path) -> None:
    code = """
from typing import Callable, Sequence

# Bad - unparameterized built-in types
def bad_list() -> list:
    pass

def bad_dict() -> dict:
    pass

# Good - parameterized built-in types
def good_list() -> list[str]:
    pass

def good_dict() -> dict[str, int]:
    pass
"""
    config = Config(select={UnparameterizedGenericType.name})
    violations = lint_file(Path("test.py"), code, config, index_path)
    assert len(violations) == 2
    assert all(isinstance(v.rule, UnparameterizedGenericType) for v in violations)
    assert violations[0].range == Range(Position(4, 18))  # bad_list return type
    assert violations[1].range == Range(Position(7, 18))  # bad_dict return type
```

--------------------------------------------------------------------------------

---[FILE: test_use_sys_executable.py]---
Location: mlflow-master/dev/clint/tests/rules/test_use_sys_executable.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules import UseSysExecutable


def test_use_sys_executable(index_path: Path) -> None:
    code = """
import subprocess
import sys

# Bad
subprocess.run(["mlflow", "ui"])
subprocess.check_call(["mlflow", "ui"])

# Good
subprocess.run([sys.executable, "-m", "mlflow", "ui"])
subprocess.check_call([sys.executable, "-m", "mlflow", "ui"])
"""
    config = Config(select={UseSysExecutable.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 2
    assert all(isinstance(r.rule, UseSysExecutable) for r in results)
    assert results[0].range == Range(Position(5, 0))
    assert results[1].range == Range(Position(6, 0))
```

--------------------------------------------------------------------------------

---[FILE: test_use_walrus_operator.py]---
Location: mlflow-master/dev/clint/tests/rules/test_use_walrus_operator.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import Position, Range, lint_file
from clint.rules import UseWalrusOperator


def test_basic_walrus_pattern(index_path: Path) -> None:
    code = """
def f():
    a = func()
    if a:
        use(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 1
    assert isinstance(results[0].rule, UseWalrusOperator)
    assert results[0].range == Range(Position(2, 4))


def test_walrus_in_function(index_path: Path) -> None:
    code = """
def f():
    a = func()
    if a:
        use(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 1
    assert isinstance(results[0].rule, UseWalrusOperator)


def test_no_flag_walrus_in_module(index_path: Path) -> None:
    code = """
result = compute()
if result:
    process(result)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    # Module-level check is disabled for performance reasons
    assert len(results) == 0


def test_flag_with_elif_not_using_var(index_path: Path) -> None:
    code = """
def f():
    a = func()
    if a:
        use(a)
    elif other:
        do_other()
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    # Flagged because var is not used in elif branch
    assert len(results) == 1


def test_no_flag_with_elif_using_var(index_path: Path) -> None:
    code = """
def f():
    a = func()
    if a:
        use(a)
    elif other:
        use(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    # Not flagged because var is used in elif branch
    assert len(results) == 0


def test_flag_with_else_not_using_var(index_path: Path) -> None:
    code = """
def f():
    a = func()
    if a:
        use(a)
    else:
        do_other()
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    # Flagged because var is not used in else branch
    assert len(results) == 1


def test_no_flag_with_else_using_var(index_path: Path) -> None:
    code = """
def f():
    a = func()
    if a:
        use(a)
    else:
        use(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    # Not flagged because var is used in else branch
    assert len(results) == 0


def test_no_flag_variable_used_after_if(index_path: Path) -> None:
    code = """
def f():
    a = func()
    if a:
        use(a)
    print(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0


def test_no_flag_variable_not_used_in_if_body(index_path: Path) -> None:
    code = """
def f():
    a = func()
    if a:
        do_something_else()
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0


def test_no_flag_comparison_in_if(index_path: Path) -> None:
    code = """
def f():
    a = func()
    if a > 5:
        use(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0


def test_no_flag_different_variable_in_if(index_path: Path) -> None:
    code = """
def f():
    a = func()
    if b:
        use(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0


def test_no_flag_tuple_unpacking(index_path: Path) -> None:
    code = """
def f():
    a, b = func()
    if a:
        use(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0


def test_no_flag_multiple_targets(index_path: Path) -> None:
    code = """
def f():
    a = b = func()
    if a:
        use(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0


def test_no_flag_attribute_assignment(index_path: Path) -> None:
    code = """
def f():
    self.a = func()
    if self.a:
        use(self.a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0


def test_no_flag_multiline_assignment(index_path: Path) -> None:
    code = """
def f():
    a = (
        func()
    )
    if a:
        use(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0


def test_no_flag_augmented_assignment(index_path: Path) -> None:
    code = """
def f():
    a = 1
    a += func()
    if a:
        use(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0


def test_no_flag_annotated_assignment(index_path: Path) -> None:
    code = """
def f():
    a: int = func()
    if a:
        use(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0


def test_multiple_violations(index_path: Path) -> None:
    code = """
def f():
    a = func1()
    if a:
        use(a)

    b = func2()
    if b:
        use(b)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 2
    assert all(isinstance(r.rule, UseWalrusOperator) for r in results)


def test_nested_function_scope_not_considered(index_path: Path) -> None:
    code = """
def f():
    a = func()
    if a:
        def inner():
            return a
        use(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    # Flagged (false positive) - nested scopes are not handled for simplicity
    assert len(results) == 1


def test_no_flag_line_too_long(index_path: Path) -> None:
    long_value = (
        "very_long_function_name_that_makes_the_line_exceed_one_hundred_"
        "characters_when_combined_with_walrus()"
    )
    code = f"""
def f():
    a = {long_value}
    if a:
        use(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0


def test_flag_when_line_length_ok(index_path: Path) -> None:
    code = """
def f():
    a = short()
    if a:
        use(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 1


def test_no_flag_non_adjacent_statements(index_path: Path) -> None:
    code = """
def f():
    a = func()
    other_statement()
    if a:
        use(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 0


def test_variable_used_multiple_times_in_if_body(index_path: Path) -> None:
    code = """
def f():
    a = func()
    if a:
        use(a)
        process(a)
        print(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 1


def test_nested_if_in_body(index_path: Path) -> None:
    code = """
def f():
    a = func()
    if a:
        use(a)
        if other:
            process(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 1


def test_class_scope_not_confused(index_path: Path) -> None:
    code = """
def f():
    a = func()
    if a:
        class Inner:
            a = 5
        use(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    # Flagged (false positive) - nested scopes are not handled for simplicity
    assert len(results) == 1


def test_walrus_in_nested_if(index_path: Path) -> None:
    code = """
def f():
    if condition:
        a = func()
        if a:
            use(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 1
    assert isinstance(results[0].rule, UseWalrusOperator)


def test_walrus_in_for_loop(index_path: Path) -> None:
    code = """
def f():
    for x in items:
        a = func()
        if a:
            use(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 1
    assert isinstance(results[0].rule, UseWalrusOperator)


def test_walrus_in_while_loop(index_path: Path) -> None:
    code = """
def f():
    while condition:
        a = func()
        if a:
            use(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 1
    assert isinstance(results[0].rule, UseWalrusOperator)


def test_walrus_in_with_block(index_path: Path) -> None:
    code = """
def f():
    with context:
        a = func()
        if a:
            use(a)
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 1
    assert isinstance(results[0].rule, UseWalrusOperator)


def test_walrus_in_try_block(index_path: Path) -> None:
    code = """
def f():
    try:
        a = func()
        if a:
            use(a)
    except Exception:
        pass
"""
    config = Config(select={UseWalrusOperator.name})
    results = lint_file(Path("test.py"), code, config, index_path)
    assert len(results) == 1
    assert isinstance(results[0].rule, UseWalrusOperator)
```

--------------------------------------------------------------------------------

---[FILE: test_version_major_check.py]---
Location: mlflow-master/dev/clint/tests/rules/test_version_major_check.py

```python
from pathlib import Path

from clint.config import Config
from clint.linter import lint_file
from clint.rules.version_major_check import MajorVersionCheck


def test_version_major_check(index_path: Path) -> None:
    code = """
from packaging.version import Version

Version("0.9.0") >= Version("1.0.0")
Version("1.2.3").major >= 1
Version("1.0.0") >= Version("0.83.0")
Version("1.5.0") >= Version("2.0.0")
Version("1.5.0") == Version("3.0.0")
Version("1.5.0") != Version("4.0.0")
"""
    config = Config(select={MajorVersionCheck.name})
    violations = lint_file(Path("test.py"), code, config, index_path)
    assert len(violations) == 4
    assert all(isinstance(v.rule, MajorVersionCheck) for v in violations)
    assert violations[0].range.start.line == 3
    assert violations[1].range.start.line == 6
    assert violations[2].range.start.line == 7
    assert violations[3].range.start.line == 8


def test_version_major_check_no_violations(index_path: Path) -> None:
    code = """
from packaging.version import Version

Version("1.2.3").major >= 1
Version("1.0.0") >= Version("0.83.0")
Version("1.5.0") >= Version("1.0.1")
Version("1.5.0") >= Version("1.0.0.dev0")
5 >= 3
"""
    config = Config(select={MajorVersionCheck.name})
    violations = lint_file(Path("test.py"), code, config, index_path)
    assert len(violations) == 0
```

--------------------------------------------------------------------------------

````
