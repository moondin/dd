---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 871
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 871 of 991)

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

---[FILE: test_docker_projects.py]---
Location: mlflow-master/tests/projects/test_docker_projects.py

```python
import os
from unittest import mock

import docker
import pytest

import mlflow
from mlflow import MlflowClient
from mlflow.entities import ViewType
from mlflow.environment_variables import MLFLOW_TRACKING_URI
from mlflow.exceptions import MlflowException
from mlflow.legacy_databricks_cli.configure.provider import DatabricksConfig
from mlflow.projects import ExecutionException, _project_spec
from mlflow.projects.backend.local import _get_docker_command
from mlflow.projects.docker import _get_docker_image_uri
from mlflow.store.tracking import file_store
from mlflow.utils.mlflow_tags import (
    MLFLOW_DOCKER_IMAGE_ID,
    MLFLOW_DOCKER_IMAGE_URI,
    MLFLOW_PROJECT_BACKEND,
    MLFLOW_PROJECT_ENV,
)

from tests.projects.utils import (
    TEST_DOCKER_PROJECT_DIR,
    docker_example_base_image,  # noqa: F401
)


def _build_uri(base_uri, subdirectory):
    if subdirectory != "":
        return f"{base_uri}#{subdirectory}"
    return base_uri


@pytest.mark.parametrize("use_start_run", map(str, [0, 1]))
def test_docker_project_execution(use_start_run, docker_example_base_image):
    expected_params = {"use_start_run": use_start_run}
    submitted_run = mlflow.projects.run(
        TEST_DOCKER_PROJECT_DIR,
        experiment_id=file_store.FileStore.DEFAULT_EXPERIMENT_ID,
        parameters=expected_params,
        entry_point="test_tracking",
        build_image=True,
        docker_args={"memory": "1g", "privileged": True},
    )
    # Validate run contents in the FileStore
    run_id = submitted_run.run_id
    mlflow_service = MlflowClient()
    runs = mlflow_service.search_runs(
        [file_store.FileStore.DEFAULT_EXPERIMENT_ID], run_view_type=ViewType.ACTIVE_ONLY
    )
    assert len(runs) == 1
    store_run_id = runs[0].info.run_id
    assert run_id == store_run_id
    run = mlflow_service.get_run(run_id)
    assert run.data.params == expected_params
    assert run.data.metrics == {"some_key": 3}
    exact_expected_tags = {
        MLFLOW_PROJECT_ENV: "docker",
        MLFLOW_PROJECT_BACKEND: "local",
    }
    approx_expected_tags = {
        MLFLOW_DOCKER_IMAGE_URI: "docker-example",
        MLFLOW_DOCKER_IMAGE_ID: "sha256:",
    }
    run_tags = run.data.tags
    for k, v in exact_expected_tags.items():
        assert run_tags[k] == v
    for k, v in approx_expected_tags.items():
        assert run_tags[k].startswith(v)
    artifacts = mlflow_service.list_artifacts(run_id=run_id)
    assert len(artifacts) == 1
    docker_cmd = submitted_run.command_proc.args[2]
    assert "--memory 1g" in docker_cmd
    assert "--privileged" in docker_cmd


def test_docker_project_execution_async_docker_args(
    docker_example_base_image,
):
    submitted_run = mlflow.projects.run(
        TEST_DOCKER_PROJECT_DIR,
        experiment_id=file_store.FileStore.DEFAULT_EXPERIMENT_ID,
        parameters={"use_start_run": "0"},
        entry_point="test_tracking",
        docker_args={"memory": "1g", "privileged": True},
        synchronous=False,
    )
    submitted_run.wait()

    args = submitted_run.command_proc.args
    assert len([a for a in args if a == "--docker-args"]) == 2
    first_idx = args.index("--docker-args")
    second_idx = args.index("--docker-args", first_idx + 1)
    assert args[first_idx + 1] == "memory=1g"
    assert args[second_idx + 1] == "privileged"


@pytest.mark.parametrize(
    ("tracking_uri", "expected_command_segment"),
    [
        (None, "-e MLFLOW_TRACKING_URI=/mlflow/tmp/mlruns"),
        ("http://some-tracking-uri", "-e MLFLOW_TRACKING_URI=http://some-tracking-uri"),
        ("databricks://some-profile", "-e MLFLOW_TRACKING_URI=databricks "),
    ],
)
def test_docker_project_tracking_uri_propagation(
    tmp_path,
    tracking_uri,
    expected_command_segment,
    docker_example_base_image,
):
    mock_provider = mock.MagicMock()
    mock_provider.get_config.return_value = DatabricksConfig.from_password(
        "host", "user", "pass", insecure=True
    )
    # Create and mock local tracking directory
    local_tracking_dir = os.path.join(tmp_path, "mlruns")
    if tracking_uri is None:
        tracking_uri = local_tracking_dir
    old_uri = mlflow.get_tracking_uri()
    with (
        mock.patch(
            "mlflow.utils.databricks_utils.ProfileConfigProvider", return_value=mock_provider
        ),
        mock.patch(
            "mlflow.tracking._tracking_service.utils._get_store",
            return_value=file_store.FileStore(local_tracking_dir),
        ),
    ):
        try:
            mlflow.set_tracking_uri(tracking_uri)
            mlflow.projects.run(
                TEST_DOCKER_PROJECT_DIR,
                experiment_id=file_store.FileStore.DEFAULT_EXPERIMENT_ID,
            )
        finally:
            mlflow.set_tracking_uri(old_uri)


def test_docker_uri_mode_validation(docker_example_base_image):
    with pytest.raises(ExecutionException, match="When running on Databricks"):
        mlflow.projects.run(TEST_DOCKER_PROJECT_DIR, backend="databricks", backend_config={})


def test_docker_image_uri_with_git():
    with mock.patch("mlflow.projects.docker.get_git_commit") as get_git_commit_mock:
        get_git_commit_mock.return_value = "1234567890"
        image_uri = _get_docker_image_uri("my_project", "my_workdir")
        assert image_uri == "my_project:1234567"
        get_git_commit_mock.assert_called_with("my_workdir")


def test_docker_image_uri_no_git():
    with mock.patch("mlflow.projects.docker.get_git_commit", return_value=None) as mock_commit:
        image_uri = _get_docker_image_uri("my_project", "my_workdir")
        assert image_uri == "my_project"
        mock_commit.assert_called_with("my_workdir")


def test_docker_valid_project_backend_local():
    work_dir = "./examples/docker"
    project = _project_spec.load_project(work_dir)
    mlflow.projects.docker.validate_docker_env(project)


def test_docker_invalid_project_backend_local():
    work_dir = "./examples/docker"
    project = _project_spec.load_project(work_dir)
    project.name = None
    with pytest.raises(ExecutionException, match="Project name in MLProject must be specified"):
        mlflow.projects.docker.validate_docker_env(project)


@pytest.mark.parametrize(
    ("artifact_uri", "host_artifact_uri", "container_artifact_uri", "should_mount"),
    [
        ("/tmp/mlruns/artifacts", "/tmp/mlruns/artifacts", "/tmp/mlruns/artifacts", True),
        ("s3://my_bucket", None, None, False),
        ("file:///tmp/mlruns/artifacts", "/tmp/mlruns/artifacts", "/tmp/mlruns/artifacts", True),
        ("./mlruns", os.path.abspath("./mlruns"), "/mlflow/projects/code/mlruns", True),
    ],
)
def test_docker_mount_local_artifact_uri(
    artifact_uri, host_artifact_uri, container_artifact_uri, should_mount
):
    active_run = mock.MagicMock()
    run_info = mock.MagicMock()
    run_info.run_id = "fake_run_id"
    run_info.experiment_id = "fake_experiment_id"
    run_info.artifact_uri = artifact_uri
    active_run.info = run_info
    image = mock.MagicMock()
    image.tags = ["image:tag"]

    docker_command = _get_docker_command(image, active_run)

    docker_volume_expected = f"-v {host_artifact_uri}:{container_artifact_uri}"
    assert (docker_volume_expected in " ".join(docker_command)) == should_mount


def test_docker_databricks_tracking_cmd_and_envs():
    mock_provider = mock.MagicMock()
    mock_provider.get_config.return_value = DatabricksConfig.from_password(
        "host", "user", "pass", insecure=True
    )
    with mock.patch(
        "mlflow.utils.databricks_utils.ProfileConfigProvider", return_value=mock_provider
    ):
        cmds, envs = mlflow.projects.docker.get_docker_tracking_cmd_and_envs(
            "databricks://some-profile"
        )
        assert envs == {
            "DATABRICKS_HOST": "host",
            "DATABRICKS_USERNAME": "user",
            "DATABRICKS_PASSWORD": "pass",
            "DATABRICKS_INSECURE": "True",
            MLFLOW_TRACKING_URI.name: "databricks",
        }
        assert cmds == []


@pytest.mark.parametrize(
    ("volumes", "environment", "os_environ", "expected"),
    [
        ([], ["VAR1"], {"VAR1": "value1"}, [("-e", "VAR1=value1")]),
        ([], ["VAR1"], {}, ["should_crash", ("-e", "VAR1=value1")]),
        ([], ["VAR1"], {"OTHER_VAR": "value1"}, ["should_crash", ("-e", "VAR1=value1")]),
        (
            [],
            ["VAR1", ["VAR2", "value2"]],
            {"VAR1": "value1"},
            [("-e", "VAR1=value1"), ("-e", "VAR2=value2")],
        ),
        ([], [["VAR2", "value2"]], {"VAR1": "value1"}, [("-e", "VAR2=value2")]),
        (
            ["/path:/path"],
            ["VAR1"],
            {"VAR1": "value1"},
            [("-e", "VAR1=value1"), ("-v", "/path:/path")],
        ),
        (
            ["/path:/path"],
            [["VAR2", "value2"]],
            {"VAR1": "value1"},
            [("-e", "VAR2=value2"), ("-v", "/path:/path")],
        ),
    ],
)
def test_docker_user_specified_env_vars(volumes, environment, expected, os_environ, monkeypatch):
    active_run = mock.MagicMock()
    run_info = mock.MagicMock()
    run_info.run_id = "fake_run_id"
    run_info.experiment_id = "fake_experiment_id"
    run_info.artifact_uri = "/tmp/mlruns/artifacts"
    active_run.info = run_info
    image = mock.MagicMock()
    image.tags = ["image:tag"]

    for name, value in os_environ.items():
        monkeypatch.setenv(name, value)
    if "should_crash" in expected:
        expected.remove("should_crash")
        with pytest.raises(MlflowException, match="This project expects"):
            _get_docker_command(image, active_run, None, volumes, environment)
    else:
        docker_command = _get_docker_command(image, active_run, None, volumes, environment)
        for exp_type, expected in expected:
            assert expected in docker_command
            assert docker_command[docker_command.index(expected) - 1] == exp_type


@pytest.mark.parametrize("docker_args", [{}, {"ARG": "VAL"}, {"ARG1": "VAL1", "ARG2": "VAL2"}])
def test_docker_run_args(docker_args):
    active_run = mock.MagicMock()
    run_info = mock.MagicMock()
    run_info.run_id = "fake_run_id"
    run_info.experiment_id = "fake_experiment_id"
    run_info.artifact_uri = "/tmp/mlruns/artifacts"
    active_run.info = run_info
    image = mock.MagicMock()
    image.tags = ["image:tag"]

    docker_command = _get_docker_command(image, active_run, docker_args, None, None)

    for flag, value in docker_args.items():
        assert docker_command[docker_command.index(value) - 1] == f"--{flag}"


def test_docker_build_image_local(tmp_path):
    client = docker.from_env()
    dockerfile = tmp_path.joinpath("Dockerfile")
    dockerfile.write_text(
        """
FROM python:3.10
RUN pip --version
"""
    )
    client.images.build(path=str(tmp_path), dockerfile=str(dockerfile), tag="my-python:latest")
    tmp_path.joinpath("MLproject").write_text(
        """
name: test
docker_env:
  image: my-python
entry_points:
  main:
    command: python --version
"""
    )
    submitted_run = mlflow.projects.run(str(tmp_path))
    run = mlflow.get_run(submitted_run.run_id)
    assert run.data.tags[MLFLOW_DOCKER_IMAGE_URI] == "my-python"


def test_docker_build_image_remote(tmp_path):
    tmp_path.joinpath("MLproject").write_text(
        """
name: test
docker_env:
  image: python:3.9
entry_points:
  main:
    command: python --version
"""
    )
    submitted_run = mlflow.projects.run(str(tmp_path))
    run = mlflow.get_run(submitted_run.run_id)
    assert run.data.tags[MLFLOW_DOCKER_IMAGE_URI] == "python:3.9"
```

--------------------------------------------------------------------------------

---[FILE: test_entry_point.py]---
Location: mlflow-master/tests/projects/test_entry_point.py

```python
import os
from shlex import quote
from unittest import mock

import pytest

from mlflow.exceptions import ExecutionException
from mlflow.projects._project_spec import EntryPoint
from mlflow.utils.file_utils import TempDir, path_to_local_file_uri

from tests.projects.utils import TEST_PROJECT_DIR, load_project


def test_entry_point_compute_params():
    """
    Tests that EntryPoint correctly computes a final set of parameters to use when running a project
    """
    project = load_project()
    entry_point = project.get_entry_point("greeter")
    # Pass extra "excitement" param, use default value for `greeting` param
    with TempDir() as storage_dir:
        params, extra_params = entry_point.compute_parameters(
            {"name": "friend", "excitement": 10}, storage_dir
        )
        assert params == {"name": "friend", "greeting": "hi"}
        assert extra_params == {"excitement": "10"}
        # Don't pass extra "excitement" param, pass value for `greeting`
        params, extra_params = entry_point.compute_parameters(
            {"name": "friend", "greeting": "hello"}, storage_dir
        )
        assert params == {"name": "friend", "greeting": "hello"}
        assert extra_params == {}
        # Raise exception on missing required parameter
        with pytest.raises(
            ExecutionException, match="No value given for missing parameters: 'name'"
        ):
            entry_point.compute_parameters({}, storage_dir)


def test_entry_point_compute_command():
    """
    Tests that EntryPoint correctly computes the command to execute in order to run the entry point.
    """
    project = load_project()
    entry_point = project.get_entry_point("greeter")
    with TempDir() as tmp:
        storage_dir = tmp.path()
        command = entry_point.compute_command({"name": "friend", "excitement": 10}, storage_dir)
        assert command == "python greeter.py hi friend --excitement 10"
        with pytest.raises(
            ExecutionException, match="No value given for missing parameters: 'name'"
        ):
            entry_point.compute_command({}, storage_dir)
        # Test shell escaping
        name_value = "friend; echo 'hi'"
        command = entry_point.compute_command({"name": name_value}, storage_dir)
        assert command == "python greeter.py {} {}".format(quote("hi"), quote(name_value))


def test_path_parameter():
    """
    Tests that MLflow file-download APIs get called when necessary for arguments of type `path`.
    """
    project = load_project()
    entry_point = project.get_entry_point("line_count")
    with mock.patch(
        "mlflow.tracking.artifact_utils._download_artifact_from_uri", return_value=0
    ) as download_uri_mock:
        # Verify that we don't attempt to call download_uri when passing a local file to a
        # parameter of type "path"
        with TempDir() as tmp:
            dst_dir = tmp.path()
            local_path = os.path.join(TEST_PROJECT_DIR, "MLproject")
            params, _ = entry_point.compute_parameters(
                user_parameters={"path": local_path}, storage_dir=dst_dir
            )
            assert params["path"] == os.path.abspath(local_path)
            assert download_uri_mock.call_count == 0

            params, _ = entry_point.compute_parameters(
                user_parameters={"path": path_to_local_file_uri(local_path)}, storage_dir=dst_dir
            )
            assert params["path"] == os.path.abspath(local_path)
            assert download_uri_mock.call_count == 0

        # Verify that we raise an exception when passing a non-existent local file to a
        # parameter of type "path"
        with TempDir() as tmp:
            dst_dir = tmp.path()
            with pytest.raises(ExecutionException, match="no such file or directory"):
                entry_point.compute_parameters(
                    user_parameters={"path": os.path.join(dst_dir, "some/nonexistent/file")},
                    storage_dir=dst_dir,
                )
        # Verify that we do call `download_uri` when passing a URI to a parameter of type "path"
        for i, prefix in enumerate(["dbfs:/", "s3://", "gs://"]):
            with TempDir() as tmp:
                dst_dir = tmp.path()
                file_to_download = "images.tgz"
                download_path = f"{dst_dir}/{file_to_download}"
                download_uri_mock.return_value = download_path
                params, _ = entry_point.compute_parameters(
                    user_parameters={"path": os.path.join(prefix, file_to_download)},
                    storage_dir=dst_dir,
                )
                assert params["path"] == download_path
                assert download_uri_mock.call_count == i + 1


def test_uri_parameter():
    project = load_project()
    entry_point = project.get_entry_point("download_uri")
    with (
        mock.patch(
            "mlflow.tracking.artifact_utils._download_artifact_from_uri"
        ) as download_uri_mock,
        TempDir() as tmp,
    ):
        dst_dir = tmp.path()
        # Test that we don't attempt to locally download parameters of type URI
        entry_point.compute_command(
            user_parameters={"uri": f"file://{dst_dir}"}, storage_dir=dst_dir
        )
        assert download_uri_mock.call_count == 0
        # Test that we raise an exception if a local path is passed to a parameter of type URI
        with pytest.raises(ExecutionException, match="Expected URI for parameter uri"):
            entry_point.compute_command(user_parameters={"uri": dst_dir}, storage_dir=dst_dir)


def test_params():
    defaults = {
        "alpha": "float",
        "l1_ratio": {"type": "float", "default": 0.1},
        "l2_ratio": {"type": "float", "default": 0.0003},
        "random_str": {"type": "string", "default": "hello"},
    }
    entry_point = EntryPoint("entry_point_name", defaults, "command_name script.py")

    user1 = {}
    with pytest.raises(ExecutionException, match="No value given for missing parameters"):
        entry_point._validate_parameters(user1)

    user_2 = {"beta": 0.004}
    with pytest.raises(ExecutionException, match="No value given for missing parameters"):
        entry_point._validate_parameters(user_2)

    user_3 = {"alpha": 0.004, "gamma": 0.89}
    expected_final_3 = {
        "alpha": "0.004",
        "l1_ratio": "0.1",
        "l2_ratio": "0.0003",
        "random_str": "hello",
    }
    expected_extra_3 = {"gamma": "0.89"}
    final_3, extra_3 = entry_point.compute_parameters(user_3, None)
    assert expected_extra_3 == extra_3
    assert expected_final_3 == final_3

    user_4 = {"alpha": 0.004, "l1_ratio": 0.0008, "random_str_2": "hello"}
    expected_final_4 = {
        "alpha": "0.004",
        "l1_ratio": "0.0008",
        "l2_ratio": "0.0003",
        "random_str": "hello",
    }
    expected_extra_4 = {"random_str_2": "hello"}
    final_4, extra_4 = entry_point.compute_parameters(user_4, None)
    assert expected_extra_4 == extra_4
    assert expected_final_4 == final_4

    user_5 = {"alpha": -0.99, "random_str": "hi"}
    expected_final_5 = {
        "alpha": "-0.99",
        "l1_ratio": "0.1",
        "l2_ratio": "0.0003",
        "random_str": "hi",
    }
    expected_extra_5 = {}
    final_5, extra_5 = entry_point.compute_parameters(user_5, None)
    assert expected_final_5 == final_5
    assert expected_extra_5 == extra_5

    user_6 = {"alpha": 0.77, "ALPHA": 0.89}
    expected_final_6 = {
        "alpha": "0.77",
        "l1_ratio": "0.1",
        "l2_ratio": "0.0003",
        "random_str": "hello",
    }
    expected_extra_6 = {"ALPHA": "0.89"}
    final_6, extra_6 = entry_point.compute_parameters(user_6, None)
    assert expected_extra_6 == extra_6
    assert expected_final_6 == final_6


def test_path_params():
    data_file = "s3://path.test/resources/data_file.csv"
    defaults = {
        "constants": {"type": "uri", "default": "s3://path.test/b1"},
        "data": {"type": "path", "default": data_file},
    }
    entry_point = EntryPoint("entry_point_name", defaults, "command_name script.py")

    with mock.patch(
        "mlflow.tracking.artifact_utils._download_artifact_from_uri", return_value=None
    ) as download_uri_mock:
        final_1, extra_1 = entry_point.compute_parameters({}, None)
        assert final_1 == {"constants": "s3://path.test/b1", "data": data_file}
        assert extra_1 == {}
        assert download_uri_mock.call_count == 0

    with mock.patch(
        "mlflow.tracking.artifact_utils._download_artifact_from_uri"
    ) as download_uri_mock:
        user_2 = {"alpha": 0.001, "constants": "s3://path.test/b_two"}
        final_2, extra_2 = entry_point.compute_parameters(user_2, None)
        assert final_2 == {"constants": "s3://path.test/b_two", "data": data_file}
        assert extra_2 == {"alpha": "0.001"}
        assert download_uri_mock.call_count == 0

    with (
        mock.patch(
            "mlflow.tracking.artifact_utils._download_artifact_from_uri"
        ) as download_uri_mock,
        TempDir() as tmp,
    ):
        dest_path = tmp.path()
        download_path = f"{dest_path}/data_file.csv"
        download_uri_mock.return_value = download_path
        user_3 = {"alpha": 0.001}
        final_3, extra_3 = entry_point.compute_parameters(user_3, dest_path)
        assert final_3 == {"constants": "s3://path.test/b1", "data": download_path}
        assert extra_3 == {"alpha": "0.001"}
        assert download_uri_mock.call_count == 1

    with (
        mock.patch(
            "mlflow.tracking.artifact_utils._download_artifact_from_uri"
        ) as download_uri_mock,
        TempDir() as tmp,
    ):
        dest_path = tmp.path()
        download_path = f"{dest_path}/images.tgz"
        download_uri_mock.return_value = download_path
        user_4 = {"data": "s3://another.example.test/data_stash/images.tgz"}
        final_4, extra_4 = entry_point.compute_parameters(user_4, dest_path)
        assert final_4 == {"constants": "s3://path.test/b1", "data": download_path}
        assert extra_4 == {}
        assert download_uri_mock.call_count == 1
```

--------------------------------------------------------------------------------

---[FILE: test_kubernetes.py]---
Location: mlflow-master/tests/projects/test_kubernetes.py

```python
from unittest import mock

import kubernetes
import pytest
import yaml
from kubernetes.config.config_exception import ConfigException

from mlflow.entities import RunStatus
from mlflow.exceptions import ExecutionException
from mlflow.projects import kubernetes as kb


def test_run_command_creation():
    command = [
        "python train.py --alpha 0.5 --l1-ratio 0.1",
        "--comment 'foo bar'",
        '--comment-bis "bar foo"',
    ]
    command = kb._get_run_command(command)
    assert command == [
        "python",
        "train.py",
        "--alpha",
        "0.5",
        "--l1-ratio",
        "0.1",
        "--comment",
        "'foo bar'",
        "--comment-bis",
        "'bar foo'",
    ]


def test_valid_kubernetes_job_spec():
    """
    Tests job specification for Kubernetes.
    """
    custom_template = yaml.safe_load(
        "apiVersion: batch/v1\n"
        "kind: Job\n"
        "metadata:\n"
        "  name: pi-with-ttl\n"
        "spec:\n"
        "  ttlSecondsAfterFinished: 100\n"
        "  template:\n"
        "    spec:\n"
        "      containers:\n"
        "      - name: pi\n"
        "        image: perl\n"
        "        command: ['perl',  '-Mbignum=bpi', '-wle']\n"
        "        env: \n"
        "        - name: DUMMY\n"
        '          value: "test_var"\n'
        "      restartPolicy: Never\n"
    )
    project_name = "mlflow-docker-example"
    image_tag = "image_tag"
    image_digest = "5e74a5a"
    command = ["mlflow", "run", ".", "--env-manager", "local", "-P", "alpha=0.5"]
    env_vars = {"RUN_ID": "1"}
    job_definition = kb._get_kubernetes_job_definition(
        project_name=project_name,
        image_tag=image_tag,
        image_digest=image_digest,
        command=command,
        env_vars=env_vars,
        job_template=custom_template,
    )
    container_spec = job_definition["spec"]["template"]["spec"]["containers"][0]
    assert container_spec["name"] == project_name
    assert container_spec["image"] == image_tag + "@" + image_digest
    assert container_spec["command"] == command
    assert len(container_spec["env"]) == 2
    assert container_spec["env"][0]["name"] == "DUMMY"
    assert container_spec["env"][0]["value"] == "test_var"
    assert container_spec["env"][1]["name"] == "RUN_ID"
    assert container_spec["env"][1]["value"] == "1"


def test_run_kubernetes_job():
    active_run = mock.Mock()
    project_name = "mlflow-docker-example"
    image_tag = "image_tag"
    image_digest = "5e74a5a"
    command = ["python train.py --alpha 0.5 --l1-ratio 0.1"]
    env_vars = {"RUN_ID": "1"}
    kube_context = "docker-for-desktop"
    job_template = yaml.safe_load(
        "apiVersion: batch/v1\n"
        "kind: Job\n"
        "metadata:\n"
        "  name: pi-with-ttl\n"
        "  namespace: mlflow\n"
        "spec:\n"
        "  ttlSecondsAfterFinished: 100\n"
        "  template:\n"
        "    spec:\n"
        "      containers:\n"
        "      - name: pi\n"
        "        image: perl\n"
        "        command: ['perl',  '-Mbignum=bpi', '-wle']\n"
        "      restartPolicy: Never\n"
    )
    with (
        mock.patch("kubernetes.config.load_kube_config") as kube_config_mock,
        mock.patch("kubernetes.client.BatchV1Api.create_namespaced_job") as kube_api_mock,
    ):
        submitted_run_obj = kb.run_kubernetes_job(
            project_name=project_name,
            active_run=active_run,
            image_tag=image_tag,
            image_digest=image_digest,
            command=command,
            env_vars=env_vars,
            job_template=job_template,
            kube_context=kube_context,
        )

        assert submitted_run_obj._mlflow_run_id == active_run.info.run_id
        assert submitted_run_obj._job_name.startswith(project_name)
        assert submitted_run_obj._job_namespace == "mlflow"
        assert kube_api_mock.call_count == 1
        args = kube_config_mock.call_args_list
        assert args[0][1]["context"] == kube_context


def test_run_kubernetes_job_current_kubecontext():
    active_run = mock.Mock()
    project_name = "mlflow-docker-example"
    image_tag = "image_tag"
    image_digest = "5e74a5a"
    command = ["python train.py --alpha 0.5 --l1-ratio 0.1"]
    env_vars = {"RUN_ID": "1"}
    kube_context = None

    job_template = yaml.safe_load(
        "apiVersion: batch/v1\n"
        "kind: Job\n"
        "metadata:\n"
        "  name: pi-with-ttl\n"
        "  namespace: mlflow\n"
        "spec:\n"
        "  ttlSecondsAfterFinished: 100\n"
        "  template:\n"
        "    spec:\n"
        "      containers:\n"
        "      - name: pi\n"
        "        image: perl\n"
        "        command: ['perl',  '-Mbignum=bpi', '-wle']\n"
        "      restartPolicy: Never\n"
    )
    with (
        mock.patch("kubernetes.config.load_kube_config") as kube_config_mock,
        mock.patch("kubernetes.config.load_incluster_config") as incluster_kube_config_mock,
        mock.patch("kubernetes.client.BatchV1Api.create_namespaced_job") as kube_api_mock,
    ):
        submitted_run_obj = kb.run_kubernetes_job(
            project_name=project_name,
            active_run=active_run,
            image_tag=image_tag,
            image_digest=image_digest,
            command=command,
            env_vars=env_vars,
            job_template=job_template,
            kube_context=kube_context,
        )

        assert submitted_run_obj._mlflow_run_id == active_run.info.run_id
        assert submitted_run_obj._job_name.startswith(project_name)
        assert submitted_run_obj._job_namespace == "mlflow"
        assert kube_api_mock.call_count == 1
        assert kube_config_mock.call_count == 1
        assert incluster_kube_config_mock.call_count == 0


def test_run_kubernetes_job_in_cluster():
    active_run = mock.Mock()
    project_name = "mlflow-docker-example"
    image_tag = "image_tag"
    image_digest = "5e74a5a"
    command = ["python train.py --alpha 0.5 --l1-ratio 0.1"]
    env_vars = {"RUN_ID": "1"}
    kube_context = None
    job_template = yaml.safe_load(
        "apiVersion: batch/v1\n"
        "kind: Job\n"
        "metadata:\n"
        "  name: pi-with-ttl\n"
        "  namespace: mlflow\n"
        "spec:\n"
        "  ttlSecondsAfterFinished: 100\n"
        "  template:\n"
        "    spec:\n"
        "      containers:\n"
        "      - name: pi\n"
        "        image: perl\n"
        "        command: ['perl',  '-Mbignum=bpi', '-wle']\n"
        "      restartPolicy: Never\n"
    )
    with mock.patch("kubernetes.config.load_kube_config") as kube_config_mock:
        kube_config_mock.side_effect = ConfigException()
        with (
            mock.patch("kubernetes.config.load_incluster_config") as incluster_kube_config_mock,
            mock.patch("kubernetes.client.BatchV1Api.create_namespaced_job") as kube_api_mock,
        ):
            submitted_run_obj = kb.run_kubernetes_job(
                project_name=project_name,
                active_run=active_run,
                image_tag=image_tag,
                image_digest=image_digest,
                command=command,
                env_vars=env_vars,
                job_template=job_template,
                kube_context=kube_context,
            )

            assert submitted_run_obj._mlflow_run_id == active_run.info.run_id
            assert submitted_run_obj._job_name.startswith(project_name)
            assert submitted_run_obj._job_namespace == "mlflow"
            assert kube_api_mock.call_count == 1
            assert kube_config_mock.call_count == 1
            assert incluster_kube_config_mock.call_count == 1


def test_push_image_to_registry():
    image_uri = "dockerhub_account/mlflow-kubernetes-example"
    with mock.patch("docker.from_env") as docker_mock:
        client = mock.MagicMock()
        docker_mock.return_value = client
        kb.push_image_to_registry(image_uri)
        assert client.images.push.call_count == 1
        args = client.images.push.call_args_list
        assert args[0][1]["repository"] == image_uri


def test_push_image_to_registry_handling_errors():
    image_uri = "dockerhub_account/mlflow-kubernetes-example"
    with pytest.raises(
        ExecutionException,
        match="Error while pushing to docker registry: An image does not exist locally",
    ):
        kb.push_image_to_registry(image_uri)


def test_submitted_run_get_status_killed():
    mlflow_run_id = 1
    job_name = "job-name"
    job_namespace = "job-namespace"
    with mock.patch("kubernetes.client.BatchV1Api.delete_namespaced_job") as kube_api_mock:
        submitted_run = kb.KubernetesSubmittedRun(mlflow_run_id, job_name, job_namespace)
        submitted_run.cancel()
        assert RunStatus.KILLED == submitted_run.get_status()
        assert kube_api_mock.call_count == 1
        args = kube_api_mock.call_args_list
        assert args[0][1]["name"] == job_name
        assert args[0][1]["namespace"] == job_namespace


def test_submitted_run_get_status_failed():
    mlflow_run_id = 1
    job_name = "job-name"
    job_namespace = "job-namespace"
    condition = kubernetes.client.models.V1JobCondition(type="Failed", status="True")
    job_status = kubernetes.client.models.V1JobStatus(
        active=1,
        completion_time=None,
        conditions=[condition],
        failed=1,
        start_time=1,
        succeeded=None,
    )
    job = kubernetes.client.models.V1Job(status=job_status)
    with mock.patch(
        "kubernetes.client.BatchV1Api.read_namespaced_job_status", return_value=job
    ) as kube_api_mock:
        submitted_run = kb.KubernetesSubmittedRun(mlflow_run_id, job_name, job_namespace)
        assert RunStatus.FAILED == submitted_run.get_status()
        assert kube_api_mock.call_count == 1
        args = kube_api_mock.call_args_list
        assert args[0][1]["name"] == job_name
        assert args[0][1]["namespace"] == job_namespace


def test_submitted_run_get_status_succeeded():
    mlflow_run_id = 1
    job_name = "job-name"
    job_namespace = "job-namespace"
    condition = kubernetes.client.models.V1JobCondition(type="Complete", status="True")
    job_status = kubernetes.client.models.V1JobStatus(
        active=None,
        completion_time=None,
        conditions=[condition],
        failed=None,
        start_time=None,
        succeeded=1,
    )
    job = kubernetes.client.models.V1Job(status=job_status)
    with mock.patch(
        "kubernetes.client.BatchV1Api.read_namespaced_job_status", return_value=job
    ) as kube_api_mock:
        submitted_run = kb.KubernetesSubmittedRun(mlflow_run_id, job_name, job_namespace)
        assert RunStatus.FINISHED == submitted_run.get_status()
        assert kube_api_mock.call_count == 1
        args = kube_api_mock.call_args_list
        assert args[0][1]["name"] == job_name
        assert args[0][1]["namespace"] == job_namespace


def test_submitted_run_get_status_running():
    mlflow_run_id = 1
    job_name = "job-name"
    job_namespace = "job-namespace"
    job_status = kubernetes.client.models.V1JobStatus(
        active=1, completion_time=None, conditions=None, failed=1, start_time=1, succeeded=1
    )
    job = kubernetes.client.models.V1Job(status=job_status)
    with mock.patch(
        "kubernetes.client.BatchV1Api.read_namespaced_job_status", return_value=job
    ) as kube_api_mock:
        submitted_run = kb.KubernetesSubmittedRun(mlflow_run_id, job_name, job_namespace)
        assert RunStatus.RUNNING == submitted_run.get_status()
        assert kube_api_mock.call_count == 1
        args = kube_api_mock.call_args_list
        assert args[0][1]["name"] == job_name
        assert args[0][1]["namespace"] == job_namespace


def test_state_transitions():
    mlflow_run_id = 1
    job_name = "job-name"
    job_namespace = "job-namespace"
    submitted_run = kb.KubernetesSubmittedRun(mlflow_run_id, job_name, job_namespace)

    with mock.patch("kubernetes.client.BatchV1Api.read_namespaced_job_status") as kube_api_mock:

        def set_return_value(**kwargs):
            job_status = kubernetes.client.models.V1JobStatus(**kwargs)
            kube_api_mock.return_value = kubernetes.client.models.V1Job(status=job_status)

        set_return_value()
        assert RunStatus.SCHEDULED == submitted_run.get_status()
        set_return_value(start_time=1)
        assert RunStatus.RUNNING == submitted_run.get_status()
        set_return_value(start_time=1, failed=1)
        assert RunStatus.RUNNING == submitted_run.get_status()
        set_return_value(start_time=1, failed=1)
        assert RunStatus.RUNNING == submitted_run.get_status()
        set_return_value(start_time=1, failed=1, active=1)
        assert RunStatus.RUNNING == submitted_run.get_status()
        set_return_value(start_time=1, failed=1, succeeded=1)
        assert RunStatus.RUNNING == submitted_run.get_status()
        set_return_value(start_time=1, failed=1, succeeded=1, completion_time=2)
        assert RunStatus.RUNNING == submitted_run.get_status()
        condition = kubernetes.client.models.V1JobCondition(type="Complete", status="True")
        set_return_value(
            conditions=[condition], failed=1, start_time=1, completion_time=2, succeeded=1
        )
        assert RunStatus.FINISHED == submitted_run.get_status()
```

--------------------------------------------------------------------------------

````
