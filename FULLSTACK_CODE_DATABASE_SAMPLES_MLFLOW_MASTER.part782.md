---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 782
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 782 of 991)

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

---[FILE: test_openai.py]---
Location: mlflow-master/tests/deployments/openai/test_openai.py

```python
from unittest import mock

import pytest

from mlflow.deployments import get_deploy_client
from mlflow.exceptions import MlflowException


@pytest.fixture
def mock_openai_creds(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "my-secret-key")


@pytest.fixture
def mock_azure_openai_creds(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "my-secret-key")
    monkeypatch.setenv("OPENAI_API_TYPE", "azure")
    monkeypatch.setenv("OPENAI_API_BASE", "my-base")
    monkeypatch.setenv("OPENAI_DEPLOYMENT_NAME", "my-deployment")
    monkeypatch.setenv("OPENAI_API_VERSION", "2023-05-15")


@pytest.fixture
def mock_bad_azure_openai_creds(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "test")
    monkeypatch.setenv("OPENAI_API_TYPE", "azure")
    monkeypatch.setenv("OPENAI_API_VERSION", "2023-05-15")
    monkeypatch.setenv("OPENAI_API_BASE", "https://openai-for.openai.azure.com/")


def test_get_deploy_client(mock_openai_creds):
    get_deploy_client("openai")


def test_predict_openai(mock_openai_creds):
    client = get_deploy_client("openai")
    mock_resp = {
        "id": "chatcmpl-abc123",
        "object": "chat.completion",
        "created": 1677858242,
        "model": "gpt-4o-mini",
        "usage": {
            "prompt_tokens": 13,
            "completion_tokens": 7,
            "total_tokens": 20,
        },
        "choices": [
            {
                "message": {
                    "role": "assistant",
                    "content": "\n\nThis is a test!",
                },
                "finish_reason": "stop",
                "index": 0,
            }
        ],
        "headers": {"Content-Type": "application/json"},
    }
    with mock.patch(
        "openai.OpenAI",
    ) as mock_client:
        mock_client().chat.completions.create().model_dump.return_value = mock_resp
        resp = client.predict(
            endpoint="test",
            inputs={
                "messages": [
                    {"role": "user", "content": "Hello!"},
                ],
            },
        )
        mock_client().chat.completions.create.assert_called_with(
            messages=[{"role": "user", "content": "Hello!"}], model="test"
        )
        assert resp == mock_resp


def test_list_endpoints_openai(mock_openai_creds):
    client = get_deploy_client("openai")

    mock_response = mock.Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "object": "list",
        "data": [
            {
                "id": "model-id-0",
                "object": "model",
                "created": 1686935002,
                "owned_by": "organization-owner",
            },
            {
                "id": "model-id-1",
                "object": "model",
                "created": 1686935002,
                "owned_by": "organization-owner",
            },
            {"id": "model-id-2", "object": "model", "created": 1686935002, "owned_by": "openai"},
        ],
    }

    with mock.patch(
        "requests.get",
        return_value=mock_response,
    ) as mock_request:
        resp = client.list_endpoints()
        mock_request.assert_called_once()
        assert resp == mock_response.json.return_value


def test_list_endpoints_azure_openai(mock_azure_openai_creds):
    client = get_deploy_client("openai")

    with pytest.raises(
        NotImplementedError, match="List endpoints is not implemented for Azure OpenAI API"
    ):
        client.list_endpoints()


def test_get_endpoint_openai(mock_openai_creds):
    client = get_deploy_client("openai")

    mock_response = mock.Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "id": "gpt-4o-mini",
        "object": "model",
        "created": 1686935002,
        "owned_by": "openai",
    }

    with mock.patch(
        "requests.get",
        return_value=mock_response,
    ) as mock_request:
        resp = client.get_endpoint("gpt-4o-mini")
        mock_request.assert_called_once()
        assert resp == mock_response.json.return_value


def test_get_endpoint_azure_openai(mock_azure_openai_creds):
    client = get_deploy_client("openai")

    with pytest.raises(
        NotImplementedError, match="Get endpoint is not implemented for Azure OpenAI API"
    ):
        client.get_endpoint("gpt-4o-mini")


def test_predict_azure_openai(mock_azure_openai_creds):
    client = get_deploy_client("openai")
    mock_resp = {
        "id": "chatcmpl-abc123",
        "object": "chat.completion",
        "created": 1677858242,
        "model": "gpt-4o-mini",
        "usage": {
            "prompt_tokens": 13,
            "completion_tokens": 7,
            "total_tokens": 20,
        },
        "choices": [
            {
                "message": {
                    "role": "assistant",
                    "content": "\n\nThis is a test!",
                },
                "finish_reason": "stop",
                "index": 0,
            }
        ],
        "headers": {"Content-Type": "application/json"},
    }
    with mock.patch("openai.AzureOpenAI") as mock_client:
        mock_client().chat.completions.create().model_dump.return_value = mock_resp
        resp = client.predict(
            endpoint="test",
            inputs={
                "messages": [
                    {"role": "user", "content": "Hello!"},
                ],
            },
        )
        mock_client().chat.completions.create.assert_called_with(
            messages=[{"role": "user", "content": "Hello!"}],
            model="test",
        )
        assert resp == mock_resp


def test_no_openai_api_key():
    client = get_deploy_client("openai")
    with pytest.raises(MlflowException, match="OPENAI_API_KEY environment variable not set"):
        client.predict(
            endpoint="test",
            inputs={
                "messages": [
                    {"role": "user", "content": "Hello!"},
                ],
            },
        )


def test_openai_exception(mock_openai_creds):
    client = get_deploy_client("openai")
    with mock.patch("openai.OpenAI") as mock_client:
        mock_client().chat.completions.create.side_effect = (Exception("foo"),)
        with pytest.raises(Exception, match="foo"):
            client.predict(
                endpoint="test",
                inputs={
                    "messages": [
                        {"role": "user", "content": "Hello!"},
                    ],
                },
            )
        mock_client().chat.completions.create.assert_called_once()
```

--------------------------------------------------------------------------------

---[FILE: test_check_function_signatures.py]---
Location: mlflow-master/tests/dev/test_check_function_signatures.py

```python
import ast

from dev.check_function_signatures import check_signature_compatibility


def test_no_changes():
    old_code = "def func(a, b=1): pass"
    new_code = "def func(a, b=1): pass"

    old_tree = ast.parse(old_code)
    new_tree = ast.parse(new_code)
    errors = check_signature_compatibility(old_tree.body[0], new_tree.body[0])

    assert len(errors) == 0


def test_positional_param_removed():
    old_code = "def func(a, b, c): pass"
    new_code = "def func(a, b): pass"

    old_tree = ast.parse(old_code)
    new_tree = ast.parse(new_code)
    errors = check_signature_compatibility(old_tree.body[0], new_tree.body[0])

    assert len(errors) == 1
    assert errors[0].message == "Positional param 'c' was removed."
    assert errors[0].param_name == "c"


def test_positional_param_renamed():
    old_code = "def func(a, b): pass"
    new_code = "def func(x, b): pass"

    old_tree = ast.parse(old_code)
    new_tree = ast.parse(new_code)
    errors = check_signature_compatibility(old_tree.body[0], new_tree.body[0])

    assert len(errors) == 1
    assert "Positional param order/name changed: 'a' -> 'x'." in errors[0].message
    assert errors[0].param_name == "x"


def test_only_first_positional_rename_flagged():
    old_code = "def func(a, b, c, d): pass"
    new_code = "def func(x, y, z, w): pass"

    old_tree = ast.parse(old_code)
    new_tree = ast.parse(new_code)
    errors = check_signature_compatibility(old_tree.body[0], new_tree.body[0])

    assert len(errors) == 1
    assert "Positional param order/name changed: 'a' -> 'x'." in errors[0].message


def test_optional_positional_became_required():
    old_code = "def func(a, b=1): pass"
    new_code = "def func(a, b): pass"

    old_tree = ast.parse(old_code)
    new_tree = ast.parse(new_code)
    errors = check_signature_compatibility(old_tree.body[0], new_tree.body[0])

    assert len(errors) == 1
    assert errors[0].message == "Optional positional param 'b' became required."
    assert errors[0].param_name == "b"


def test_multiple_optional_became_required():
    old_code = "def func(a, b=1, c=2): pass"
    new_code = "def func(a, b, c): pass"

    old_tree = ast.parse(old_code)
    new_tree = ast.parse(new_code)
    errors = check_signature_compatibility(old_tree.body[0], new_tree.body[0])

    assert len(errors) == 2
    assert errors[0].message == "Optional positional param 'b' became required."
    assert errors[1].message == "Optional positional param 'c' became required."


def test_new_required_positional_param():
    old_code = "def func(a): pass"
    new_code = "def func(a, b): pass"

    old_tree = ast.parse(old_code)
    new_tree = ast.parse(new_code)
    errors = check_signature_compatibility(old_tree.body[0], new_tree.body[0])

    assert len(errors) == 1
    assert errors[0].message == "New required positional param 'b' added."
    assert errors[0].param_name == "b"


def test_new_optional_positional_param_allowed():
    old_code = "def func(a): pass"
    new_code = "def func(a, b=1): pass"

    old_tree = ast.parse(old_code)
    new_tree = ast.parse(new_code)
    errors = check_signature_compatibility(old_tree.body[0], new_tree.body[0])

    assert len(errors) == 0


def test_keyword_only_param_removed():
    old_code = "def func(*, a, b): pass"
    new_code = "def func(*, b): pass"

    old_tree = ast.parse(old_code)
    new_tree = ast.parse(new_code)
    errors = check_signature_compatibility(old_tree.body[0], new_tree.body[0])

    assert len(errors) == 1
    assert errors[0].message == "Keyword-only param 'a' was removed."
    assert errors[0].param_name == "a"


def test_multiple_keyword_only_removed():
    old_code = "def func(*, a, b, c): pass"
    new_code = "def func(*, b): pass"

    old_tree = ast.parse(old_code)
    new_tree = ast.parse(new_code)
    errors = check_signature_compatibility(old_tree.body[0], new_tree.body[0])

    assert len(errors) == 2
    error_messages = {e.message for e in errors}
    assert "Keyword-only param 'a' was removed." in error_messages
    assert "Keyword-only param 'c' was removed." in error_messages


def test_optional_keyword_only_became_required():
    old_code = "def func(*, a=1): pass"
    new_code = "def func(*, a): pass"

    old_tree = ast.parse(old_code)
    new_tree = ast.parse(new_code)
    errors = check_signature_compatibility(old_tree.body[0], new_tree.body[0])

    assert len(errors) == 1
    assert errors[0].message == "Keyword-only param 'a' became required."
    assert errors[0].param_name == "a"


def test_new_required_keyword_only_param():
    old_code = "def func(*, a): pass"
    new_code = "def func(*, a, b): pass"

    old_tree = ast.parse(old_code)
    new_tree = ast.parse(new_code)
    errors = check_signature_compatibility(old_tree.body[0], new_tree.body[0])

    assert len(errors) == 1
    assert errors[0].message == "New required keyword-only param 'b' added."
    assert errors[0].param_name == "b"


def test_new_optional_keyword_only_allowed():
    old_code = "def func(*, a): pass"
    new_code = "def func(*, a, b=1): pass"

    old_tree = ast.parse(old_code)
    new_tree = ast.parse(new_code)
    errors = check_signature_compatibility(old_tree.body[0], new_tree.body[0])

    assert len(errors) == 0


def test_complex_mixed_violations():
    old_code = "def func(a, b=1, *, c, d=2): pass"
    new_code = "def func(x, b, *, c=3, e): pass"

    old_tree = ast.parse(old_code)
    new_tree = ast.parse(new_code)
    errors = check_signature_compatibility(old_tree.body[0], new_tree.body[0])

    assert len(errors) == 3
    error_messages = [e.message for e in errors]
    assert any("Positional param order/name changed: 'a' -> 'x'." in msg for msg in error_messages)
    assert any("Keyword-only param 'd' was removed." in msg for msg in error_messages)
    assert any("New required keyword-only param 'e' added." in msg for msg in error_messages)


def test_parameter_error_has_location_info():
    old_code = "def func(a): pass"
    new_code = "def func(b): pass"

    old_tree = ast.parse(old_code)
    new_tree = ast.parse(new_code)
    errors = check_signature_compatibility(old_tree.body[0], new_tree.body[0])

    assert len(errors) == 1
    assert errors[0].lineno == 1
    assert errors[0].col_offset > 0


def test_async_function_compatibility():
    old_code = "async def func(a, b=1): pass"
    new_code = "async def func(a, b): pass"

    old_tree = ast.parse(old_code)
    new_tree = ast.parse(new_code)
    errors = check_signature_compatibility(old_tree.body[0], new_tree.body[0])

    assert len(errors) == 1
    assert errors[0].message == "Optional positional param 'b' became required."


def test_positional_only_compatibility():
    old_code = "def func(a, /): pass"
    new_code = "def func(b, /): pass"

    old_tree = ast.parse(old_code)
    new_tree = ast.parse(new_code)
    errors = check_signature_compatibility(old_tree.body[0], new_tree.body[0])

    assert len(errors) == 1
    assert "Positional param order/name changed: 'a' -> 'b'." in errors[0].message


def test_rename_stops_further_positional_checks():
    old_code = "def func(a, b=1, c=2): pass"
    new_code = "def func(x, b, c): pass"

    old_tree = ast.parse(old_code)
    new_tree = ast.parse(new_code)
    errors = check_signature_compatibility(old_tree.body[0], new_tree.body[0])

    assert len(errors) == 1
    assert "Positional param order/name changed: 'a' -> 'x'." in errors[0].message
```

--------------------------------------------------------------------------------

---[FILE: test_check_init_py.py]---
Location: mlflow-master/tests/dev/test_check_init_py.py

```python
import subprocess
import sys
from pathlib import Path

import pytest


def get_check_init_py_script() -> Path:
    return Path(__file__).resolve().parents[2] / "dev" / "check_init_py.py"


@pytest.fixture
def temp_git_repo(tmp_path: Path) -> Path:
    subprocess.check_call(["git", "init"], cwd=tmp_path)
    subprocess.check_call(["git", "config", "user.email", "test@example.com"], cwd=tmp_path)
    subprocess.check_call(["git", "config", "user.name", "Test User"], cwd=tmp_path)
    return tmp_path


def test_exits_with_0_when_all_directories_have_init_py(temp_git_repo: Path) -> None:
    mlflow_dir = temp_git_repo / "mlflow"
    test_package_dir = mlflow_dir / "test_package"
    test_package_dir.mkdir(parents=True)

    (mlflow_dir / "__init__.py").touch()
    (test_package_dir / "__init__.py").touch()
    (test_package_dir / "test_module.py").touch()

    subprocess.check_call(["git", "add", "."], cwd=temp_git_repo)
    subprocess.check_call(["git", "commit", "-m", "Initial commit"], cwd=temp_git_repo)

    result = subprocess.run(
        [sys.executable, get_check_init_py_script()],
        capture_output=True,
        text=True,
        cwd=temp_git_repo,
    )

    assert result.returncode == 0
    assert result.stdout == ""


def test_exits_with_1_when_directories_missing_init_py(temp_git_repo: Path) -> None:
    mlflow_dir = temp_git_repo / "mlflow"
    test_package_dir = mlflow_dir / "test_package"
    test_package_dir.mkdir(parents=True)

    (test_package_dir / "test_module.py").touch()

    subprocess.check_call(["git", "add", "."], cwd=temp_git_repo)
    subprocess.check_call(["git", "commit", "-m", "Initial commit"], cwd=temp_git_repo)

    result = subprocess.run(
        [sys.executable, get_check_init_py_script()],
        capture_output=True,
        text=True,
        cwd=temp_git_repo,
    )

    assert result.returncode == 1
    assert (
        "Error: The following directories contain Python files but lack __init__.py:"
        in result.stdout
    )
    assert "mlflow" in result.stdout
    assert "mlflow/test_package" in result.stdout


def test_exits_with_0_when_no_python_files_exist(temp_git_repo: Path) -> None:
    mlflow_dir = temp_git_repo / "mlflow"
    js_dir = mlflow_dir / "server" / "js"
    js_dir.mkdir(parents=True)

    (js_dir / "main.js").touch()

    subprocess.check_call(["git", "add", "."], cwd=temp_git_repo)
    subprocess.check_call(["git", "commit", "-m", "Initial commit"], cwd=temp_git_repo)

    result = subprocess.run(
        [sys.executable, get_check_init_py_script()],
        capture_output=True,
        text=True,
        cwd=temp_git_repo,
    )

    assert result.returncode == 0
    assert result.stdout == ""


def test_identifies_only_directories_missing_init_py(temp_git_repo: Path) -> None:
    mlflow_dir = temp_git_repo / "mlflow"
    package1_dir = mlflow_dir / "package1"
    package2_dir = mlflow_dir / "package2"
    package1_dir.mkdir(parents=True)
    package2_dir.mkdir(parents=True)

    (mlflow_dir / "__init__.py").touch()
    (package1_dir / "__init__.py").touch()

    (package1_dir / "module1.py").touch()
    (package2_dir / "module2.py").touch()

    subprocess.check_call(["git", "add", "."], cwd=temp_git_repo)
    subprocess.check_call(["git", "commit", "-m", "Initial commit"], cwd=temp_git_repo)

    result = subprocess.run(
        [sys.executable, get_check_init_py_script()],
        capture_output=True,
        text=True,
        cwd=temp_git_repo,
    )

    assert result.returncode == 1
    assert (
        "Error: The following directories contain Python files but lack __init__.py:"
        in result.stdout
    )
    assert "mlflow/package2" in result.stdout
    assert "mlflow/package1" not in result.stdout


def test_checks_tests_directory_for_missing_init_py(temp_git_repo: Path) -> None:
    tests_dir = temp_git_repo / "tests"
    test_package_dir = tests_dir / "test_package"
    test_package_dir.mkdir(parents=True)

    # Only test files (starting with test_) are checked
    (test_package_dir / "test_module.py").touch()

    subprocess.check_call(["git", "add", "."], cwd=temp_git_repo)
    subprocess.check_call(["git", "commit", "-m", "Initial commit"], cwd=temp_git_repo)

    result = subprocess.run(
        [sys.executable, get_check_init_py_script()],
        capture_output=True,
        text=True,
        cwd=temp_git_repo,
    )

    assert result.returncode == 1
    assert (
        "Error: The following directories contain Python files but lack __init__.py:"
        in result.stdout
    )
    assert "tests/test_package" in result.stdout
    assert "tests" in result.stdout  # Parent directory also needs __init__.py


def test_exits_with_0_when_tests_directories_have_init_py(temp_git_repo: Path) -> None:
    tests_dir = temp_git_repo / "tests"
    test_package_dir = tests_dir / "test_package"
    test_package_dir.mkdir(parents=True)

    (tests_dir / "__init__.py").touch()
    (test_package_dir / "__init__.py").touch()
    (test_package_dir / "test_module.py").touch()

    subprocess.check_call(["git", "add", "."], cwd=temp_git_repo)
    subprocess.check_call(["git", "commit", "-m", "Initial commit"], cwd=temp_git_repo)

    result = subprocess.run(
        [sys.executable, get_check_init_py_script()],
        capture_output=True,
        text=True,
        cwd=temp_git_repo,
    )

    assert result.returncode == 0
    assert result.stdout == ""


def test_ignores_non_test_files_in_tests_directory(temp_git_repo: Path) -> None:
    tests_dir = temp_git_repo / "tests"
    test_package_dir = tests_dir / "test_package"
    test_package_dir.mkdir(parents=True)

    # Non-test file (doesn't start with test_) should be ignored
    (test_package_dir / "helper.py").touch()
    (test_package_dir / "utils.py").touch()

    subprocess.check_call(["git", "add", "."], cwd=temp_git_repo)
    subprocess.check_call(["git", "commit", "-m", "Initial commit"], cwd=temp_git_repo)

    result = subprocess.run(
        [sys.executable, get_check_init_py_script()],
        capture_output=True,
        text=True,
        cwd=temp_git_repo,
    )

    # Should pass since no test files exist
    assert result.returncode == 0
    assert result.stdout == ""


def test_checks_all_parent_directories(temp_git_repo: Path) -> None:
    mlflow_dir = temp_git_repo / "mlflow"
    deep_dir = mlflow_dir / "level1" / "level2" / "level3"
    deep_dir.mkdir(parents=True)

    # Create a Python file deep in the hierarchy
    (deep_dir / "module.py").touch()

    # Only add __init__.py to some directories
    (mlflow_dir / "__init__.py").touch()
    (mlflow_dir / "level1" / "__init__.py").touch()
    # Missing: level2 and level3 __init__.py files

    subprocess.check_call(["git", "add", "."], cwd=temp_git_repo)
    subprocess.check_call(["git", "commit", "-m", "Initial commit"], cwd=temp_git_repo)

    result = subprocess.run(
        [sys.executable, get_check_init_py_script()],
        capture_output=True,
        text=True,
        cwd=temp_git_repo,
    )

    assert result.returncode == 1
    assert (
        "Error: The following directories contain Python files but lack __init__.py:"
        in result.stdout
    )
    # Both level2 and level3 should be reported as missing __init__.py
    assert "mlflow/level1/level2" in result.stdout
    assert "mlflow/level1/level2/level3" in result.stdout
```

--------------------------------------------------------------------------------

---[FILE: test_remove_experimental_decorators.py]---
Location: mlflow-master/tests/dev/test_remove_experimental_decorators.py

```python
import subprocess
import sys
from pathlib import Path

SCRIPT_PATH = "dev/remove_experimental_decorators.py"


def test_script_with_specific_file(tmp_path: Path) -> None:
    test_file = tmp_path / "test.py"
    test_file.write_text("""
@experimental(version="1.0.0")
def func():
    pass
""")

    output = subprocess.check_output(
        [sys.executable, SCRIPT_PATH, "--dry-run", test_file], text=True
    )

    assert "Would remove" in output
    assert "experimental(version='1.0.0')" in output
    assert (
        test_file.read_text()
        == """
@experimental(version="1.0.0")
def func():
    pass
"""
    )


def test_script_without_files() -> None:
    subprocess.check_call([sys.executable, SCRIPT_PATH, "--dry-run"])


def test_script_removes_decorator_without_dry_run(tmp_path: Path) -> None:
    test_file = tmp_path / "test.py"
    test_file.write_text("""
@experimental(version="1.0.0")
def func():
    pass
""")

    subprocess.check_call([sys.executable, SCRIPT_PATH, test_file])
    content = test_file.read_text()
    assert (
        content
        == """
def func():
    pass
"""
    )


def test_script_with_multiline_decorator(tmp_path: Path) -> None:
    test_file = tmp_path / "test.py"
    test_file.write_text("""
@experimental(
    version="1.0.0",
)
def func():
    pass
""")

    output = subprocess.check_output([sys.executable, SCRIPT_PATH, test_file], text=True)
    assert "Removed" in output
    assert (
        test_file.read_text()
        == """
def func():
    pass
"""
    )


def test_script_with_multiple_decorators(tmp_path: Path) -> None:
    test_file = tmp_path / "test.py"
    test_file.write_text("""
@experimental(version="1.0.0")
def func1():
    pass

@experimental(version="1.1.0")
class MyClass:
    @experimental(version="1.2.0")
    def method(self):
        pass

def regular_func():
    pass
""")

    output = subprocess.check_output([sys.executable, SCRIPT_PATH, test_file], text=True)
    assert output.count("Removed") == 3  # Should remove all 3 decorators
    content = test_file.read_text()
    assert (
        content
        == """
def func1():
    pass

class MyClass:
    def method(self):
        pass

def regular_func():
    pass
"""
    )
```

--------------------------------------------------------------------------------

---[FILE: test_update_mlflow_versions.py]---
Location: mlflow-master/tests/dev/test_update_mlflow_versions.py

```python
import difflib
import re
from pathlib import Path

import pytest
from packaging.version import Version

from dev.update_mlflow_versions import (
    get_current_py_version,
    replace_java,
    replace_java_pom_xml,
    replace_pyproject_toml,
    replace_python,
    replace_r,
    replace_ts,
)

# { filename: expected lines changed }
_JAVA_FILES = {}

_JAVA_XML_FILES = {
    "mlflow/java/pom.xml": {
        6: "  <version>{new_version}</version>",
        52: "    <mlflow-version>{new_version}</mlflow-version>",
    },
    "mlflow/java/client/pom.xml": {
        8: "    <version>{new_version}</version>",
    },
    "mlflow/java/spark_2.12/pom.xml": {
        4: "  <version>{new_version}</version>",
        18: "    <version>{new_version}</version>",
    },
    "mlflow/java/spark_2.13/pom.xml": {
        4: "  <version>{new_version}</version>",
        18: "    <version>{new_version}</version>",
    },
}

_TS_FILES = {
    "mlflow/server/js/src/common/constants.tsx": {
        12: "export const Version = '{new_version}';",
    },
    "docs/src/constants.ts": {
        1: "export const Version = '{new_version}';",
    },
}

_PYTHON_FILES = {
    "mlflow/version.py": {
        5: 'VERSION = "{new_version}"',
    }
}

_PYPROJECT_TOML_FILES = {
    "pyproject.toml": {
        12: 'version = "{new_version}"',
    },
    "pyproject.release.toml": {
        12: 'version = "{new_version}"',
        30: '  "mlflow-skinny=={new_version}",',
        31: '  "mlflow-tracing=={new_version}",',
    },
    "libs/skinny/pyproject.toml": {
        10: 'version = "{new_version}"',
    },
    "libs/tracing/pyproject.toml": {
        10: 'version = "{new_version}"',
    },
}

_R_FILES = {
    "mlflow/R/mlflow/DESCRIPTION": {
        4: "Version: {new_version}",
    }
}

_DIFF_REGEX = re.compile(r"--- (\d+,?\d*) ----")

old_version = Version(get_current_py_version())
_NEW_PY_VERSION = f"{old_version.major}.{old_version.minor}.{old_version.micro + 1}"


def copy_and_run_change_func(monkeypatch, tmp_path, paths_to_copy, replace_func, new_version):
    for path in paths_to_copy:
        copy_path = tmp_path / path
        copy_path.parent.mkdir(parents=True, exist_ok=True)
        copy_path.write_text(path.read_text())

    with monkeypatch.context() as m:
        m.chdir(tmp_path)

        # pyproject.toml replace doesn't search for the old version,
        # it just replaces the version line with the new version.
        if replace_func == replace_pyproject_toml:
            replace_func(new_version, paths_to_copy)
        else:
            replace_func(str(old_version), new_version, paths_to_copy)


@pytest.mark.parametrize(
    ("replace_func", "expect_dict", "new_py_version", "expected_new_version"),
    [
        (replace_java, _JAVA_FILES, _NEW_PY_VERSION, _NEW_PY_VERSION),
        (replace_java, _JAVA_FILES, _NEW_PY_VERSION + ".dev0", _NEW_PY_VERSION + "-SNAPSHOT"),
        (replace_java, _JAVA_FILES, _NEW_PY_VERSION + "rc1", _NEW_PY_VERSION + "-SNAPSHOT"),
        (replace_java_pom_xml, _JAVA_XML_FILES, _NEW_PY_VERSION, _NEW_PY_VERSION),
        (
            replace_java_pom_xml,
            _JAVA_XML_FILES,
            _NEW_PY_VERSION + ".dev0",
            _NEW_PY_VERSION + "-SNAPSHOT",
        ),
        (
            replace_java_pom_xml,
            _JAVA_XML_FILES,
            _NEW_PY_VERSION + "rc1",
            _NEW_PY_VERSION + "-SNAPSHOT",
        ),
        (replace_ts, _TS_FILES, _NEW_PY_VERSION, _NEW_PY_VERSION),
        (replace_python, _PYTHON_FILES, _NEW_PY_VERSION, _NEW_PY_VERSION),
        (replace_pyproject_toml, _PYPROJECT_TOML_FILES, _NEW_PY_VERSION, _NEW_PY_VERSION),
        (replace_r, _R_FILES, _NEW_PY_VERSION, _NEW_PY_VERSION),
    ],
)
def test_update_mlflow_versions(
    monkeypatch, tmp_path, replace_func, expect_dict, new_py_version, expected_new_version
):
    paths_to_change = [Path(filename) for filename in expect_dict]
    copy_and_run_change_func(
        monkeypatch,
        tmp_path,
        # always copy version.py since we need it in get_current_py_version()
        paths_to_change + [Path("mlflow/version.py")],
        replace_func,
        new_py_version,
    )

    # diff files
    for filename, expected_changes in expect_dict.items():
        old_file = Path(filename).read_text().splitlines()
        new_file = (tmp_path / filename).read_text().splitlines()
        diff = list(difflib.context_diff(old_file, new_file, n=0))
        changed_lines = _parse_diff_line(diff)

        formatted_expected_changes = {
            line_num: change.format(new_version=expected_new_version)
            for line_num, change in expected_changes.items()
        }

        assert changed_lines == formatted_expected_changes


def _parse_diff_line(diff: list[str]) -> dict[int, str]:
    diff_lines = {}
    for idx, line in enumerate(diff):
        match = _DIFF_REGEX.search(line)
        if not match:
            continue

        if "," in match.group(1):
            # multi-line change is represented as [(start,end), line1, line2, ...]
            start, end = map(int, match.group(1).split(","))
            for i in range(start, end + 1):
                # the [2:] is to cut out the "! " at the beginning of diff lines
                diff_lines[i] = diff[idx + (i - start) + 1][2:]
        else:
            # single-line change
            diff_lines[int(match.group(1))] = diff[idx + 1][2:]

    return diff_lines
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: mlflow-master/tests/dspy/conftest.py

```python
import dspy
import pytest


@pytest.fixture(autouse=True)
def reset_dspy_settings():
    dspy.settings.configure(callbacks=[], lm=None, adapter=None)
```

--------------------------------------------------------------------------------

````
