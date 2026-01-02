---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 873
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 873 of 991)

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

---[FILE: test_utils.py]---
Location: mlflow-master/tests/projects/test_utils.py

```python
import os
import tempfile
import threading
import zipfile
from http.server import BaseHTTPRequestHandler, HTTPServer
from typing import Generator
from unittest import mock

import git
import pytest

import mlflow
from mlflow.exceptions import ExecutionException
from mlflow.projects import _project_spec
from mlflow.projects.utils import (
    _fetch_git_repo,
    _fetch_project,
    _get_storage_dir,
    _is_valid_branch_name,
    _is_zip_uri,
    _parse_subdirectory,
    fetch_and_validate_project,
    get_or_create_run,
    load_project,
)
from mlflow.utils.mlflow_tags import MLFLOW_PROJECT_ENTRY_POINT, MLFLOW_SOURCE_NAME

from tests.helper_functions import get_safe_port
from tests.projects.utils import (
    GIT_PROJECT_BRANCH,
    GIT_PROJECT_URI,
    TEST_PROJECT_DIR,
    TEST_PROJECT_NAME,
    assert_dirs_equal,
)


class _SimpleHTTPServer(HTTPServer):
    def __init__(self, port: int) -> None:
        super().__init__(("127.0.0.1", port), self.RequestHandler)
        self.content = b""
        self._thread = None

    class RequestHandler(BaseHTTPRequestHandler):
        def do_GET(self) -> None:
            self.send_response(200)
            self.end_headers()
            self.wfile.write(self.server.content)

    def serve_content(self, content: bytes) -> None:
        self.content = content

    @property
    def url(self) -> str:
        return f"http://{self.server_address[0]}:{self.server_address[1]}"

    def __enter__(self) -> "_SimpleHTTPServer":
        self._thread = threading.Thread(target=self.serve_forever, daemon=True)
        self._thread.start()
        return self

    def __exit__(self, *_) -> None:
        self.shutdown()
        self.server_close()
        if self._thread:
            self._thread.join(timeout=1)


@pytest.fixture
def httpserver() -> Generator[_SimpleHTTPServer, None, None]:
    with _SimpleHTTPServer(get_safe_port()) as server:
        yield server


def _build_uri(base_uri, subdirectory):
    if subdirectory != "":
        return f"{base_uri}#{subdirectory}"
    return base_uri


@pytest.fixture
def zipped_repo(tmp_path):
    zip_name = tmp_path.joinpath(f"{TEST_PROJECT_NAME}.zip")
    with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for root, _, files in os.walk(TEST_PROJECT_DIR):
            for file_name in files:
                file_path = os.path.join(root, file_name)
                zip_file.write(file_path, file_path[len(TEST_PROJECT_DIR) + len(os.sep) :])
    return str(zip_name)


def test_is_zip_uri():
    assert _is_zip_uri("http://foo.bar/moo.zip")
    assert _is_zip_uri("https://foo.bar/moo.zip")
    assert _is_zip_uri("file:///moo.zip")
    assert _is_zip_uri("file://C:/moo.zip")
    assert _is_zip_uri("/moo.zip")
    assert _is_zip_uri("C:/moo.zip")
    assert not _is_zip_uri("http://foo.bar/moo")
    assert not _is_zip_uri("https://foo.bar/moo")
    assert not _is_zip_uri("file:///moo")
    assert not _is_zip_uri("file://C:/moo")
    assert not _is_zip_uri("/moo")
    assert not _is_zip_uri("C:/moo")


def test__fetch_project(local_git_repo, local_git_repo_uri, zipped_repo, httpserver):
    with open(zipped_repo, "rb") as f:
        httpserver.serve_content(f.read())
    # The tests are as follows:
    # 1. Fetching a locally saved project.
    # 2. Fetching a project located in a Git repo root directory.
    # 3. Fetching a project located in a Git repo subdirectory.
    # 4. Passing a subdirectory works for local directories.
    # 5. Fetching a remote ZIP file
    # 6. Using a local ZIP file
    # 7. Using a file:// URL to a local ZIP file
    test_list = [
        (TEST_PROJECT_DIR, "", TEST_PROJECT_DIR),
        (local_git_repo_uri, "", local_git_repo),
        (local_git_repo_uri, "example_project", os.path.join(local_git_repo, "example_project")),
        (os.path.dirname(TEST_PROJECT_DIR), os.path.basename(TEST_PROJECT_DIR), TEST_PROJECT_DIR),
        (httpserver.url + f"/{TEST_PROJECT_NAME}.zip", "", TEST_PROJECT_DIR),
        (zipped_repo, "", TEST_PROJECT_DIR),
        (f"file://{zipped_repo}", "", TEST_PROJECT_DIR),
    ]
    for base_uri, subdirectory, expected in test_list:
        work_dir = _fetch_project(uri=_build_uri(base_uri, subdirectory))
        assert_dirs_equal(expected=expected, actual=work_dir)
    # Test that we correctly determine the dest directory to use when fetching a project.
    fetched_local_project = _fetch_project(uri=TEST_PROJECT_DIR)
    assert os.path.abspath(fetched_local_project) == os.path.abspath(TEST_PROJECT_DIR)
    fetched_git_project = _fetch_project(GIT_PROJECT_URI)
    assert (
        os.path.commonprefix([fetched_git_project, tempfile.gettempdir()]) == tempfile.gettempdir()
    )
    assert os.path.exists(fetched_git_project)


@pytest.mark.parametrize(
    ("version", "expected_version"), [(None, "master"), (GIT_PROJECT_BRANCH, GIT_PROJECT_BRANCH)]
)
def test__fetch_git_repo(local_git_repo, local_git_repo_uri, version, expected_version):
    # Verify that the correct branch is checked out
    _fetch_git_repo(local_git_repo_uri, version, local_git_repo)
    repo = git.Repo(local_git_repo)
    assert repo.active_branch.name == expected_version


@pytest.mark.parametrize(
    "commit",
    ["0651d1c962aa35e4dd02608c51a7b0efc2412407", "3c0711f8868232f17a9adbb69fb1186ec8a3c0c7"],
)
def test_fetch_git_repo_commit(tmp_path, commit):
    _fetch_git_repo("https://github.com/mlflow/mlflow-example.git", commit, tmp_path)
    repo = git.Repo(tmp_path)
    assert repo.commit().hexsha == commit


def test_fetching_non_existing_version_fails(local_git_repo, local_git_repo_uri):
    with pytest.raises(ExecutionException, match="Unable to checkout"):
        _fetch_git_repo(local_git_repo_uri, "non-version", local_git_repo)


def test_fetch_project_validations(local_git_repo_uri):
    # Verify that runs fail if given incorrect subdirectories via the `#` character.
    for base_uri in [TEST_PROJECT_DIR, local_git_repo_uri]:
        with pytest.raises(ExecutionException, match="Could not find subdirectory fake"):
            _fetch_project(uri=_build_uri(base_uri, "fake"))

    # Passing `version` raises an exception for local projects
    with pytest.raises(ExecutionException, match="Setting a version is only supported"):
        _fetch_project(uri=TEST_PROJECT_DIR, version="version")


def test_dont_remove_mlruns(tmp_path):
    # Fetching a directory containing an "mlruns" folder doesn't remove the "mlruns" folder
    src_dir = tmp_path.joinpath("mlruns-src-dir")
    src_dir.mkdir()
    mlruns = src_dir.joinpath("mlruns")
    mlruns.mkdir()
    mlruns.joinpath("some-file.txt").write_text("hi")
    src_dir.joinpath("MLproject").write_text("dummy MLproject contents")
    dst_dir = _fetch_project(uri=str(src_dir), version=None)
    assert_dirs_equal(expected=str(src_dir), actual=dst_dir)


def test_parse_subdirectory():
    # Make sure the parsing works as intended.
    test_uri = "uri#subdirectory"
    parsed_uri, parsed_subdirectory = _parse_subdirectory(test_uri)
    assert parsed_uri == "uri"
    assert parsed_subdirectory == "subdirectory"

    # Make sure the parsing works with quotes.
    test_uri = "'uri#subdirectory'"
    parsed_uri, parsed_subdirectory = _parse_subdirectory(test_uri)
    assert parsed_uri == "uri"
    assert parsed_subdirectory == "subdirectory"

    # Make sure periods are restricted in Git repo subdirectory paths.
    period_fail_uri = GIT_PROJECT_URI + "#.."
    with pytest.raises(ExecutionException, match=r"'\.' is not allowed"):
        _parse_subdirectory(period_fail_uri)


def test_storage_dir(tmp_path):
    """
    Test that we correctly handle the `storage_dir` argument, which specifies where to download
    distributed artifacts passed to arguments of type `path`.
    """
    assert os.path.dirname(_get_storage_dir(tmp_path)) == str(tmp_path)
    assert os.path.dirname(_get_storage_dir(None)) == tempfile.gettempdir()


def test_is_valid_branch_name(local_git_repo):
    assert _is_valid_branch_name(local_git_repo, "master")
    assert not _is_valid_branch_name(local_git_repo, "dev")


def test_fetch_create_and_log(tmp_path):
    entry_point_name = "entry_point"
    parameters = {
        "method_name": "string",
    }
    entry_point = _project_spec.EntryPoint(entry_point_name, parameters, "run_model.sh")
    mock_fetched_project = _project_spec.Project(
        env_type="local",
        env_config_path=None,
        entry_points={entry_point_name: entry_point},
        docker_env=None,
        name="my_project",
    )
    experiment_id = mlflow.create_experiment("test_fetch_project")
    expected_dir = str(tmp_path)
    project_uri = "http://someuri/myproject.git"
    user_param = {"method_name": "newton"}
    with (
        mock.patch("mlflow.projects.utils._fetch_project", return_value=expected_dir),
        mock.patch("mlflow.projects._project_spec.load_project", return_value=mock_fetched_project),
    ):
        work_dir = fetch_and_validate_project("", "", entry_point_name, user_param)
        project = load_project(work_dir)
        assert mock_fetched_project == project
        assert expected_dir == work_dir
        # Create a run
        active_run = get_or_create_run(
            run_id=None,
            uri=project_uri,
            experiment_id=experiment_id,
            work_dir=work_dir,
            version=None,
            entry_point=entry_point_name,
            parameters=user_param,
        )

        # check tags
        run = mlflow.get_run(active_run.info.run_id)
        assert MLFLOW_PROJECT_ENTRY_POINT in run.data.tags
        assert MLFLOW_SOURCE_NAME in run.data.tags
        assert entry_point_name == run.data.tags[MLFLOW_PROJECT_ENTRY_POINT]
        assert project_uri == run.data.tags[MLFLOW_SOURCE_NAME]
        assert user_param == run.data.params
```

--------------------------------------------------------------------------------

---[FILE: test_virtualenv_projects.py]---
Location: mlflow-master/tests/projects/test_virtualenv_projects.py

```python
import os
from unittest import mock

import pytest

import mlflow
from mlflow.exceptions import MlflowException
from mlflow.utils.virtualenv import _create_virtualenv
from mlflow.utils.yaml_utils import read_yaml, write_yaml

from tests.projects.utils import (
    TEST_VIRTUALENV_CONDA_PROJECT_DIR,
    TEST_VIRTUALENV_NO_PYTHON_ENV,
    TEST_VIRTUALENV_PROJECT_DIR,
)

spy_on_create_virtualenv = mock.patch(
    "mlflow.projects.backend.local._create_virtualenv", wraps=_create_virtualenv
)


@pytest.fixture(autouse=True, scope="module")
def use_dev_mlflow_for_projects():
    mlflow_root = os.path.dirname(os.path.dirname(mlflow.__file__))

    conda_env = read_yaml(TEST_VIRTUALENV_CONDA_PROJECT_DIR, "conda.yaml")
    conda_pip_dependencies = [
        item for item in conda_env["dependencies"] if isinstance(item, dict) and "pip" in item
    ][0]["pip"]
    if "mlflow" in conda_pip_dependencies:
        conda_pip_dependencies.remove("mlflow")
        conda_pip_dependencies.append(mlflow_root)
    write_yaml(TEST_VIRTUALENV_CONDA_PROJECT_DIR, "conda.yaml", conda_env, overwrite=True)

    for proj_dir in (TEST_VIRTUALENV_PROJECT_DIR, TEST_VIRTUALENV_NO_PYTHON_ENV):
        virtualenv_requirements_path = os.path.join(proj_dir, "requirements.txt")
        with open(virtualenv_requirements_path) as f:
            virtualenv_requirements = f.readlines()

        with open(virtualenv_requirements_path, "w") as f:
            for line in virtualenv_requirements:
                if line.rstrip("\n") != "mlflow":
                    f.write(line)
                else:
                    f.write(mlflow_root)
                    f.write("\n")


@spy_on_create_virtualenv
def test_virtualenv_project_execution_virtualenv(create_virtualenv_spy):
    submitted_run = mlflow.projects.run(
        TEST_VIRTUALENV_PROJECT_DIR, entry_point="test", env_manager="virtualenv"
    )
    submitted_run.wait()
    create_virtualenv_spy.assert_called_once()


@spy_on_create_virtualenv
def test_virtualenv_project_execution_uv(create_virtualenv_spy):
    submitted_run = mlflow.projects.run(
        TEST_VIRTUALENV_PROJECT_DIR, entry_point="test", env_manager="uv"
    )
    submitted_run.wait()
    create_virtualenv_spy.assert_called_once()


@spy_on_create_virtualenv
def test_virtualenv_project_execution_without_env_manager(create_virtualenv_spy):
    # python_env project should be executed using virtualenv without explicitly specifying
    # env_manager="virtualenv"
    submitted_run = mlflow.projects.run(TEST_VIRTUALENV_PROJECT_DIR, entry_point="test")
    submitted_run.wait()
    create_virtualenv_spy.assert_called_once()


@spy_on_create_virtualenv
def test_virtualenv_project_execution_no_python_env(create_virtualenv_spy):
    """
    When an MLproject file doesn't contain a `python_env` key but python_env.yaml exists,
    virtualenv should be used as an environment manager.
    """
    submitted_run = mlflow.projects.run(TEST_VIRTUALENV_NO_PYTHON_ENV, entry_point="test")
    submitted_run.wait()
    create_virtualenv_spy.assert_called_once()


@spy_on_create_virtualenv
def test_virtualenv_project_execution_local(create_virtualenv_spy):
    submitted_run = mlflow.projects.run(
        TEST_VIRTUALENV_PROJECT_DIR, entry_point="main", env_manager="local"
    )
    submitted_run.wait()
    create_virtualenv_spy.assert_not_called()


@spy_on_create_virtualenv
def test_virtualenv_conda_project_execution(create_virtualenv_spy):
    submitted_run = mlflow.projects.run(
        TEST_VIRTUALENV_CONDA_PROJECT_DIR, entry_point="test", env_manager="virtualenv"
    )
    submitted_run.wait()
    create_virtualenv_spy.assert_called_once()


def test_virtualenv_project_execution_conda():
    with pytest.raises(MlflowException, match="python_env project cannot be executed using conda"):
        mlflow.projects.run(TEST_VIRTUALENV_PROJECT_DIR, env_manager="conda")


@spy_on_create_virtualenv
def test_virtualenv_project_no_env_file(create_virtualenv_spy, tmp_path):
    """
    When neither python_env.yaml nor conda.yaml is present, virtualenv should be used as an
    environment manager.
    """
    ml_project_file = tmp_path.joinpath("MLproject")
    ml_project_file.write_text(
        """
name: test
entry_points:
  main:
    command: |
      python test.py
"""
    )
    tmp_path.joinpath("test.py").write_text(
        """
import os

assert "VIRTUAL_ENV" in os.environ
"""
    )
    mlflow.projects.run(str(tmp_path))
    create_virtualenv_spy.assert_called_once()


@spy_on_create_virtualenv
def test_virtualenv_project_no_mlmodel_file(create_virtualenv_spy, tmp_path):
    tmp_path.joinpath("test.py").write_text(
        """
import os

assert "VIRTUAL_ENV" in os.environ
"""
    )
    mlflow.projects.run(str(tmp_path), entry_point="test.py")
    create_virtualenv_spy.assert_called_once()
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/tests/projects/utils.py

```python
import filecmp
import logging
import os
import shutil

import pytest

from mlflow.entities import RunStatus
from mlflow.projects import _project_spec
from mlflow.utils.file_utils import TempDir, _copy_project

TEST_DIR = "tests"
TEST_PROJECT_DIR = os.path.abspath(os.path.join(TEST_DIR, "resources", "example_project"))
TEST_DOCKER_PROJECT_DIR = os.path.join(TEST_DIR, "resources", "example_docker_project")
TEST_VIRTUALENV_PROJECT_DIR = os.path.join(TEST_DIR, "resources", "example_virtualenv_project")
TEST_VIRTUALENV_CONDA_PROJECT_DIR = os.path.join(
    TEST_DIR, "resources", "example_virtualenv_conda_project"
)
TEST_VIRTUALENV_NO_PYTHON_ENV = os.path.join(
    TEST_DIR, "resources", "example_virtualenv_no_python_env"
)
TEST_PROJECT_NAME = "example_project"
TEST_NO_SPEC_PROJECT_DIR = os.path.join(TEST_DIR, "resources", "example_project_no_spec")
GIT_PROJECT_URI = "https://github.com/mlflow/mlflow-example"
GIT_PROJECT_BRANCH = "test-branch"
SSH_PROJECT_URI = "git@github.com:mlflow/mlflow-example.git"

_logger = logging.getLogger(__name__)


def load_project():
    """Loads an example project for use in tests, returning an in-memory `Project` object."""
    return _project_spec.load_project(TEST_PROJECT_DIR)


def validate_exit_status(status_str, expected):
    assert RunStatus.from_string(status_str) == expected


def assert_dirs_equal(expected, actual):
    dir_comparison = filecmp.dircmp(expected, actual)
    assert len(dir_comparison.left_only) == 0
    assert len(dir_comparison.right_only) == 0
    assert len(dir_comparison.diff_files) == 0
    assert len(dir_comparison.funny_files) == 0


@pytest.fixture(scope="package")
def docker_example_base_image():
    import docker
    from docker.errors import APIError, BuildError

    mlflow_home = os.environ.get("MLFLOW_HOME", None)
    if not mlflow_home:
        raise Exception(
            "MLFLOW_HOME environment variable is not set. Please set the variable to "
            "point to your mlflow dev root."
        )
    with TempDir() as tmp:
        cwd = tmp.path()
        mlflow_dir = _copy_project(src_path=mlflow_home, dst_path=cwd)
        shutil.copy(os.path.join(TEST_DOCKER_PROJECT_DIR, "Dockerfile"), tmp.path("Dockerfile"))
        with open(tmp.path("Dockerfile"), "a") as f:
            f.write(f"COPY {mlflow_dir} /opt/mlflow\nRUN pip install -U -e /opt/mlflow\n")

        client = docker.from_env()
        try:
            client.images.build(
                tag="mlflow-docker-example",
                forcerm=True,
                nocache=True,
                dockerfile="Dockerfile",
                path=cwd,
            )
        except BuildError as build_error:
            for chunk in build_error.build_log:
                _logger.info(chunk)
            raise build_error
        except APIError as api_error:
            raise api_error
```

--------------------------------------------------------------------------------

---[FILE: test_loader.py]---
Location: mlflow-master/tests/projects/backend/test_loader.py

```python
from mlflow.projects.backend import loader


def test_plugin_backend():
    backend = loader.load_backend("dummy-backend")
    assert backend is not None


def test_plugin_does_not_exist():
    backend = loader.load_backend("my_plugin")
    assert backend is None
```

--------------------------------------------------------------------------------

---[FILE: test_local.py]---
Location: mlflow-master/tests/projects/backend/test_local.py

```python
import os
from unittest import mock

from mlflow.projects.backend.local import _get_docker_artifact_storage_cmd_and_envs


def test_docker_s3_artifact_cmd_and_envs_from_env(monkeypatch):
    mock_env = {
        "AWS_SECRET_ACCESS_KEY": "mock_secret",
        "AWS_ACCESS_KEY_ID": "mock_access_key",
        "MLFLOW_S3_ENDPOINT_URL": "mock_endpoint",
        "MLFLOW_S3_IGNORE_TLS": "false",
    }
    for name, value in mock_env.items():
        monkeypatch.setenv(name, value)
    with mock.patch("posixpath.exists", return_value=False):
        cmds, envs = _get_docker_artifact_storage_cmd_and_envs("s3://mock_bucket")
        assert cmds == []
        assert envs == mock_env


def test_docker_s3_artifact_cmd_and_envs_from_home(monkeypatch):
    for name in [
        "AWS_SECRET_ACCESS_KEY",
        "AWS_ACCESS_KEY_ID",
        "MLFLOW_S3_ENDPOINT_URL",
        "MLFLOW_S3_IGNORE_TLS",
    ]:
        monkeypatch.delenv(name, raising=False)
    with (
        mock.patch("posixpath.exists", return_value=True),
        mock.patch("posixpath.expanduser", return_value="mock_volume"),
    ):
        cmds, envs = _get_docker_artifact_storage_cmd_and_envs("s3://mock_bucket")
        assert cmds == ["-v", "mock_volume:/.aws"]
        assert envs == {}


def test_docker_wasbs_artifact_cmd_and_envs_from_home(monkeypatch):
    mock_env = {
        "AZURE_STORAGE_CONNECTION_STRING": "mock_connection_string",
        "AZURE_STORAGE_ACCESS_KEY": "mock_access_key",
    }
    wasbs_uri = "wasbs://container@account.blob.core.windows.net/some/path"
    for name, value in mock_env.items():
        monkeypatch.setenv(name, value)
    with mock.patch("azure.storage.blob.BlobServiceClient"):
        cmds, envs = _get_docker_artifact_storage_cmd_and_envs(wasbs_uri)
        assert cmds == []
        assert envs == mock_env


def test_docker_gcs_artifact_cmd_and_envs_from_home(monkeypatch):
    mock_env = {
        "GOOGLE_APPLICATION_CREDENTIALS": "mock_credentials_path",
    }
    gs_uri = "gs://mock_bucket"
    for name, value in mock_env.items():
        monkeypatch.setenv(name, value)
    cmds, envs = _get_docker_artifact_storage_cmd_and_envs(gs_uri)
    assert cmds == ["-v", "mock_credentials_path:/.gcs"]
    assert envs == {"GOOGLE_APPLICATION_CREDENTIALS": "/.gcs"}


def test_docker_hdfs_artifact_cmd_and_envs_from_home(monkeypatch):
    mock_env = {
        "MLFLOW_KERBEROS_TICKET_CACHE": "/mock_ticket_cache",
        "MLFLOW_KERBEROS_USER": "mock_krb_user",
        "MLFLOW_PYARROW_EXTRA_CONF": "mock_pyarrow_extra_conf",
    }
    hdfs_uri = "hdfs://host:8020/path"
    for name, value in mock_env.items():
        monkeypatch.setenv(name, value)
    cmds, envs = _get_docker_artifact_storage_cmd_and_envs(hdfs_uri)
    assert cmds == ["-v", "/mock_ticket_cache:/mock_ticket_cache"]
    assert envs == mock_env


def test_docker_local_artifact_cmd_and_envs():
    host_path_expected = os.path.abspath("./mlruns")
    container_path_expected = "/mlflow/projects/code/mlruns"
    cmds, envs = _get_docker_artifact_storage_cmd_and_envs("file:./mlruns")
    assert cmds == ["-v", f"{host_path_expected}:{container_path_expected}"]
    assert envs == {}


def test_docker_unknown_uri_artifact_cmd_and_envs():
    cmd, envs = _get_docker_artifact_storage_cmd_and_envs("file-plugin://some_path")
    assert cmd == []
    assert envs == {}
```

--------------------------------------------------------------------------------

---[FILE: test_promptlab_model.py]---
Location: mlflow-master/tests/prompt/test_promptlab_model.py

```python
from unittest import mock

import pandas as pd

from mlflow.deployments import set_deployments_target
from mlflow.entities.param import Param
from mlflow.prompt.promptlab_model import _PromptlabModel

set_deployments_target("http://localhost:5000")


def construct_model(route):
    return _PromptlabModel(
        "Write me a story about {{ thing }}.",
        [Param(key="thing", value="books")],
        [Param(key="temperature", value=0.5), Param(key="max_tokens", value=10)],
        route,
    )


def test_promptlab_prompt_replacement():
    data = pd.DataFrame(
        data=[
            {"thing": "books"},
            {"thing": "coffee"},
            {"thing": "nothing"},
        ]
    )

    model = construct_model("completions")
    get_route_patch = mock.patch(
        "mlflow.deployments.MlflowDeploymentClient.get_endpoint",
        return_value=mock.Mock(endpoint_type="llm/v1/completions"),
    )

    with (
        get_route_patch,
        mock.patch("mlflow.deployments.MlflowDeploymentClient.predict") as mock_query,
    ):
        model.predict(data)

        calls = [
            mock.call(
                endpoint="completions",
                inputs={
                    "prompt": f"Write me a story about {thing}.",
                    "temperature": 0.5,
                    "max_tokens": 10,
                },
            )
            for thing in data["thing"]
        ]

        mock_query.assert_has_calls(calls, any_order=True)


def test_promptlab_works_with_chat_route():
    mock_response = {
        "choices": [
            {"message": {"role": "user", "content": "test"}, "metadata": {"finish_reason": "stop"}}
        ]
    }
    model = construct_model("chat")
    get_route_patch = mock.patch(
        "mlflow.deployments.MlflowDeploymentClient.get_endpoint",
        return_value=mock.Mock(endpoint_type="llm/v1/chat"),
    )

    with (
        get_route_patch,
        mock.patch("mlflow.deployments.MlflowDeploymentClient.predict", return_value=mock_response),
    ):
        response = model.predict(pd.DataFrame(data=[{"thing": "books"}]))

        assert response == ["test"]


def test_promptlab_works_with_completions_route():
    mock_response = {
        "choices": [
            {
                "text": "test",
                "metadata": {"finish_reason": "stop"},
            }
        ]
    }
    model = construct_model("completions")
    get_route_patch = mock.patch(
        "mlflow.deployments.MlflowDeploymentClient.get_endpoint",
        return_value=mock.Mock(endpoint_type="llm/v1/completions"),
    )

    with (
        get_route_patch,
        mock.patch("mlflow.deployments.MlflowDeploymentClient.predict", return_value=mock_response),
    ):
        response = model.predict(pd.DataFrame(data=[{"thing": "books"}]))

        assert response == ["test"]
```

--------------------------------------------------------------------------------

````
