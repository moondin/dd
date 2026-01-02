---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:55Z
part: 966
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 966 of 991)

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

---[FILE: test_databricks_cluster_context.py]---
Location: mlflow-master/tests/tracking/context/test_databricks_cluster_context.py

```python
from unittest import mock

from mlflow.tracking.context.databricks_cluster_context import DatabricksClusterRunContext
from mlflow.utils.mlflow_tags import MLFLOW_DATABRICKS_CLUSTER_ID


def test_databricks_cluster_run_context_in_context():
    with mock.patch("mlflow.utils.databricks_utils.is_in_cluster") as in_cluster_mock:
        assert DatabricksClusterRunContext().in_context() == in_cluster_mock.return_value


def test_databricks_cluster_run_context_tags():
    patch_cluster_id = mock.patch("mlflow.utils.databricks_utils.get_cluster_id")
    with patch_cluster_id as cluster_id_mock:
        assert DatabricksClusterRunContext().tags() == {
            MLFLOW_DATABRICKS_CLUSTER_ID: cluster_id_mock.return_value
        }


def test_databricks_notebook_run_context_tags_nones():
    assert DatabricksClusterRunContext().tags() == {}
```

--------------------------------------------------------------------------------

---[FILE: test_databricks_command_context.py]---
Location: mlflow-master/tests/tracking/context/test_databricks_command_context.py

```python
from unittest import mock

from mlflow.tracking.context.databricks_command_context import DatabricksCommandRunContext
from mlflow.utils.mlflow_tags import MLFLOW_DATABRICKS_NOTEBOOK_COMMAND_ID


def test_databricks_command_run_context_in_context():
    with mock.patch("mlflow.utils.databricks_utils.get_job_group_id", return_value="1"):
        assert DatabricksCommandRunContext().in_context()


def test_databricks_command_run_context_tags():
    with mock.patch("mlflow.utils.databricks_utils.get_job_group_id") as job_group_id_mock:
        assert DatabricksCommandRunContext().tags() == {
            MLFLOW_DATABRICKS_NOTEBOOK_COMMAND_ID: job_group_id_mock.return_value
        }


def test_databricks_command_run_context_tags_nones():
    with mock.patch("mlflow.utils.databricks_utils.get_job_group_id", return_value=None):
        assert DatabricksCommandRunContext().tags() == {}
```

--------------------------------------------------------------------------------

---[FILE: test_databricks_job_context.py]---
Location: mlflow-master/tests/tracking/context/test_databricks_job_context.py

```python
from unittest import mock

from mlflow.entities import SourceType
from mlflow.tracking.context.databricks_job_context import DatabricksJobRunContext
from mlflow.utils.mlflow_tags import (
    MLFLOW_DATABRICKS_JOB_ID,
    MLFLOW_DATABRICKS_JOB_RUN_ID,
    MLFLOW_DATABRICKS_JOB_TYPE,
    MLFLOW_DATABRICKS_WEBAPP_URL,
    MLFLOW_DATABRICKS_WORKSPACE_ID,
    MLFLOW_DATABRICKS_WORKSPACE_URL,
    MLFLOW_SOURCE_NAME,
    MLFLOW_SOURCE_TYPE,
)


def test_databricks_job_run_context_in_context():
    with mock.patch("mlflow.utils.databricks_utils.is_in_databricks_job") as in_job_mock:
        assert DatabricksJobRunContext().in_context() == in_job_mock.return_value


def test_databricks_job_run_context_tags():
    patch_job_id = mock.patch("mlflow.utils.databricks_utils.get_job_id")
    patch_job_run_id = mock.patch("mlflow.utils.databricks_utils.get_job_run_id")
    patch_job_type = mock.patch("mlflow.utils.databricks_utils.get_job_type")
    patch_webapp_url = mock.patch("mlflow.utils.databricks_utils.get_webapp_url")
    patch_workspace_url = mock.patch(
        "mlflow.utils.databricks_utils.get_workspace_url",
        return_value="https://dev.databricks.com",
    )
    patch_workspace_id = mock.patch(
        "mlflow.utils.databricks_utils.get_workspace_id", return_value="123456"
    )
    patch_workspace_url_none = mock.patch(
        "mlflow.utils.databricks_utils.get_workspace_url", return_value=None
    )
    patch_workspace_info = mock.patch(
        "mlflow.utils.databricks_utils.get_workspace_info_from_dbutils",
        return_value=("https://databricks.com", "123456"),
    )

    with (
        patch_job_id as job_id_mock,
        patch_job_run_id as job_run_id_mock,
        patch_job_type as job_type_mock,
        patch_webapp_url as webapp_url_mock,
        patch_workspace_url as workspace_url_mock,
        patch_workspace_info as workspace_info_mock,
        patch_workspace_id as workspace_id_mock,
    ):
        assert DatabricksJobRunContext().tags() == {
            MLFLOW_SOURCE_NAME: (
                f"jobs/{job_id_mock.return_value}/run/{job_run_id_mock.return_value}"
            ),
            MLFLOW_SOURCE_TYPE: SourceType.to_string(SourceType.JOB),
            MLFLOW_DATABRICKS_JOB_ID: job_id_mock.return_value,
            MLFLOW_DATABRICKS_JOB_RUN_ID: job_run_id_mock.return_value,
            MLFLOW_DATABRICKS_JOB_TYPE: job_type_mock.return_value,
            MLFLOW_DATABRICKS_WEBAPP_URL: webapp_url_mock.return_value,
            MLFLOW_DATABRICKS_WORKSPACE_URL: workspace_url_mock.return_value,
            MLFLOW_DATABRICKS_WORKSPACE_ID: workspace_id_mock.return_value,
        }

    with (
        patch_job_id as job_id_mock,
        patch_job_run_id as job_run_id_mock,
        patch_job_type as job_type_mock,
        patch_webapp_url as webapp_url_mock,
        patch_workspace_url_none as workspace_url_mock,
        patch_workspace_info as workspace_info_mock,
        patch_workspace_id as workspace_id_mock,
    ):
        assert DatabricksJobRunContext().tags() == {
            MLFLOW_SOURCE_NAME: (
                f"jobs/{job_id_mock.return_value}/run/{job_run_id_mock.return_value}"
            ),
            MLFLOW_SOURCE_TYPE: SourceType.to_string(SourceType.JOB),
            MLFLOW_DATABRICKS_JOB_ID: job_id_mock.return_value,
            MLFLOW_DATABRICKS_JOB_RUN_ID: job_run_id_mock.return_value,
            MLFLOW_DATABRICKS_JOB_TYPE: job_type_mock.return_value,
            MLFLOW_DATABRICKS_WEBAPP_URL: webapp_url_mock.return_value,
            MLFLOW_DATABRICKS_WORKSPACE_URL: workspace_info_mock.return_value[0],  # fallback value
            MLFLOW_DATABRICKS_WORKSPACE_ID: workspace_id_mock.return_value,
        }


def test_databricks_job_run_context_tags_nones():
    patch_job_id = mock.patch("mlflow.utils.databricks_utils.get_job_id", return_value=None)
    patch_job_run_id = mock.patch("mlflow.utils.databricks_utils.get_job_run_id", return_value=None)
    patch_job_type = mock.patch("mlflow.utils.databricks_utils.get_job_type", return_value=None)
    patch_webapp_url = mock.patch("mlflow.utils.databricks_utils.get_webapp_url", return_value=None)
    patch_workspace_info = mock.patch(
        "mlflow.utils.databricks_utils.get_workspace_info_from_dbutils", return_value=(None, None)
    )

    with patch_job_id, patch_job_run_id, patch_job_type, patch_webapp_url, patch_workspace_info:
        assert DatabricksJobRunContext().tags() == {
            MLFLOW_SOURCE_NAME: None,
            MLFLOW_SOURCE_TYPE: SourceType.to_string(SourceType.JOB),
        }
```

--------------------------------------------------------------------------------

---[FILE: test_databricks_notebook_context.py]---
Location: mlflow-master/tests/tracking/context/test_databricks_notebook_context.py

```python
from unittest import mock

from mlflow.entities import SourceType
from mlflow.tracking.context.databricks_notebook_context import DatabricksNotebookRunContext
from mlflow.utils.mlflow_tags import (
    MLFLOW_DATABRICKS_NOTEBOOK_ID,
    MLFLOW_DATABRICKS_NOTEBOOK_PATH,
    MLFLOW_DATABRICKS_WEBAPP_URL,
    MLFLOW_DATABRICKS_WORKSPACE_ID,
    MLFLOW_DATABRICKS_WORKSPACE_URL,
    MLFLOW_SOURCE_NAME,
    MLFLOW_SOURCE_TYPE,
)


def test_databricks_notebook_run_context_in_context():
    with mock.patch("mlflow.utils.databricks_utils.is_in_databricks_notebook") as in_notebook_mock:
        assert DatabricksNotebookRunContext().in_context() == in_notebook_mock.return_value


def test_databricks_notebook_run_context_tags():
    patch_notebook_id = mock.patch("mlflow.utils.databricks_utils.get_notebook_id")
    patch_notebook_path = mock.patch("mlflow.utils.databricks_utils.get_notebook_path")
    patch_webapp_url = mock.patch("mlflow.utils.databricks_utils.get_webapp_url")
    patch_workspace_url = mock.patch(
        "mlflow.utils.databricks_utils.get_workspace_url",
        return_value="https://dev.databricks.com",
    )
    patch_workspace_id = mock.patch(
        "mlflow.utils.databricks_utils.get_workspace_id", return_value="123456"
    )
    patch_workspace_url_none = mock.patch(
        "mlflow.utils.databricks_utils.get_workspace_url", return_value=None
    )
    patch_workspace_info = mock.patch(
        "mlflow.utils.databricks_utils.get_workspace_info_from_dbutils",
        return_value=("https://databricks.com", "123456"),
    )

    with (
        patch_notebook_id as notebook_id_mock,
        patch_notebook_path as notebook_path_mock,
        patch_webapp_url as webapp_url_mock,
        patch_workspace_url as workspace_url_mock,
        patch_workspace_info as workspace_info_mock,
        patch_workspace_id as workspace_id_mock,
    ):
        assert DatabricksNotebookRunContext().tags() == {
            MLFLOW_SOURCE_NAME: notebook_path_mock.return_value,
            MLFLOW_SOURCE_TYPE: SourceType.to_string(SourceType.NOTEBOOK),
            MLFLOW_DATABRICKS_NOTEBOOK_ID: notebook_id_mock.return_value,
            MLFLOW_DATABRICKS_NOTEBOOK_PATH: notebook_path_mock.return_value,
            MLFLOW_DATABRICKS_WEBAPP_URL: webapp_url_mock.return_value,
            MLFLOW_DATABRICKS_WORKSPACE_URL: workspace_url_mock.return_value,
            MLFLOW_DATABRICKS_WORKSPACE_ID: workspace_id_mock.return_value,
        }

    with (
        patch_notebook_id as notebook_id_mock,
        patch_notebook_path as notebook_path_mock,
        patch_webapp_url as webapp_url_mock,
        patch_workspace_url_none as workspace_url_mock,
        patch_workspace_info as workspace_info_mock,
        patch_workspace_id as workspace_id_mock,
    ):
        assert DatabricksNotebookRunContext().tags() == {
            MLFLOW_SOURCE_NAME: notebook_path_mock.return_value,
            MLFLOW_SOURCE_TYPE: SourceType.to_string(SourceType.NOTEBOOK),
            MLFLOW_DATABRICKS_NOTEBOOK_ID: notebook_id_mock.return_value,
            MLFLOW_DATABRICKS_NOTEBOOK_PATH: notebook_path_mock.return_value,
            MLFLOW_DATABRICKS_WEBAPP_URL: webapp_url_mock.return_value,
            MLFLOW_DATABRICKS_WORKSPACE_URL: workspace_info_mock.return_value[0],  # fallback value
            MLFLOW_DATABRICKS_WORKSPACE_ID: workspace_id_mock.return_value,
        }


def test_databricks_notebook_run_context_tags_nones():
    patch_notebook_id = mock.patch(
        "mlflow.utils.databricks_utils.get_notebook_id", return_value=None
    )
    patch_notebook_path = mock.patch(
        "mlflow.utils.databricks_utils.get_notebook_path", return_value=None
    )
    patch_webapp_url = mock.patch("mlflow.utils.databricks_utils.get_webapp_url", return_value=None)
    patch_workspace_info = mock.patch(
        "mlflow.utils.databricks_utils.get_workspace_info_from_dbutils", return_value=(None, None)
    )

    with patch_notebook_id, patch_notebook_path, patch_webapp_url, patch_workspace_info:
        assert DatabricksNotebookRunContext().tags() == {
            MLFLOW_SOURCE_NAME: None,
            MLFLOW_SOURCE_TYPE: SourceType.to_string(SourceType.NOTEBOOK),
        }
```

--------------------------------------------------------------------------------

---[FILE: test_databricks_repo_context.py]---
Location: mlflow-master/tests/tracking/context/test_databricks_repo_context.py

```python
from unittest import mock

from mlflow.tracking.context.databricks_repo_context import DatabricksRepoRunContext
from mlflow.utils.mlflow_tags import (
    MLFLOW_DATABRICKS_GIT_REPO_COMMIT,
    MLFLOW_DATABRICKS_GIT_REPO_PROVIDER,
    MLFLOW_DATABRICKS_GIT_REPO_REFERENCE,
    MLFLOW_DATABRICKS_GIT_REPO_REFERENCE_TYPE,
    MLFLOW_DATABRICKS_GIT_REPO_RELATIVE_PATH,
    MLFLOW_DATABRICKS_GIT_REPO_STATUS,
    MLFLOW_DATABRICKS_GIT_REPO_URL,
)


def test_databricks_repo_run_context_in_context():
    with mock.patch("mlflow.utils.databricks_utils.is_in_databricks_repo") as in_repo_mock:
        assert DatabricksRepoRunContext().in_context() == in_repo_mock.return_value


def test_databricks_repo_run_context_tags():
    patch_git_repo_url = mock.patch("mlflow.utils.databricks_utils.get_git_repo_url")
    patch_git_repo_provider = mock.patch("mlflow.utils.databricks_utils.get_git_repo_provider")
    patch_git_repo_commit = mock.patch("mlflow.utils.databricks_utils.get_git_repo_commit")
    patch_git_repo_relative_path = mock.patch(
        "mlflow.utils.databricks_utils.get_git_repo_relative_path"
    )
    patch_git_repo_reference = mock.patch("mlflow.utils.databricks_utils.get_git_repo_reference")
    patch_git_repo_reference_type = mock.patch(
        "mlflow.utils.databricks_utils.get_git_repo_reference_type"
    )
    patch_git_repo_status = mock.patch("mlflow.utils.databricks_utils.get_git_repo_status")

    with (
        patch_git_repo_url as git_repo_url_mock,
        patch_git_repo_provider as git_repo_provider_mock,
        patch_git_repo_commit as git_repo_commit_mock,
        patch_git_repo_relative_path as git_repo_relative_path_mock,
        patch_git_repo_reference as git_repo_reference_mock,
        patch_git_repo_reference_type as git_repo_reference_type_mock,
        patch_git_repo_status as git_repo_status_mock,
    ):
        assert DatabricksRepoRunContext().tags() == {
            MLFLOW_DATABRICKS_GIT_REPO_URL: git_repo_url_mock.return_value,
            MLFLOW_DATABRICKS_GIT_REPO_PROVIDER: git_repo_provider_mock.return_value,
            MLFLOW_DATABRICKS_GIT_REPO_COMMIT: git_repo_commit_mock.return_value,
            MLFLOW_DATABRICKS_GIT_REPO_RELATIVE_PATH: git_repo_relative_path_mock.return_value,
            MLFLOW_DATABRICKS_GIT_REPO_REFERENCE: git_repo_reference_mock.return_value,
            MLFLOW_DATABRICKS_GIT_REPO_REFERENCE_TYPE: git_repo_reference_type_mock.return_value,
            MLFLOW_DATABRICKS_GIT_REPO_STATUS: git_repo_status_mock.return_value,
        }


def test_databricks_repo_run_context_tags_nones():
    patch_git_repo_url = mock.patch(
        "mlflow.utils.databricks_utils.get_git_repo_url", return_value=None
    )
    patch_git_repo_provider = mock.patch(
        "mlflow.utils.databricks_utils.get_git_repo_provider", return_value=None
    )
    patch_git_repo_commit = mock.patch(
        "mlflow.utils.databricks_utils.get_git_repo_commit", return_value=None
    )
    patch_git_repo_relative_path = mock.patch(
        "mlflow.utils.databricks_utils.get_git_repo_relative_path", return_value=None
    )
    patch_git_repo_reference = mock.patch(
        "mlflow.utils.databricks_utils.get_git_repo_reference", return_value=None
    )
    patch_git_repo_reference_type = mock.patch(
        "mlflow.utils.databricks_utils.get_git_repo_reference_type", return_value=None
    )
    patch_git_repo_status = mock.patch(
        "mlflow.utils.databricks_utils.get_git_repo_status", return_value=None
    )
    with (
        patch_git_repo_url,
        patch_git_repo_provider,
        patch_git_repo_commit,
        patch_git_repo_relative_path,
        patch_git_repo_reference,
        patch_git_repo_reference_type,
        patch_git_repo_status,
    ):
        assert DatabricksRepoRunContext().tags() == {}
```

--------------------------------------------------------------------------------

---[FILE: test_default_context.py]---
Location: mlflow-master/tests/tracking/context/test_default_context.py

```python
from unittest import mock

import pytest

from mlflow.entities import SourceType
from mlflow.tracking.context.default_context import DefaultRunContext
from mlflow.utils.mlflow_tags import MLFLOW_SOURCE_NAME, MLFLOW_SOURCE_TYPE, MLFLOW_USER

MOCK_SCRIPT_NAME = "/path/to/script.py"


@pytest.fixture
def patch_script_name():
    patch_sys_argv = mock.patch("sys.argv", [MOCK_SCRIPT_NAME])
    patch_os_path_isfile = mock.patch("os.path.isfile", return_value=False)
    with patch_sys_argv, patch_os_path_isfile:
        yield


def test_default_run_context_in_context():
    assert DefaultRunContext().in_context() is True


def test_default_run_context_tags(patch_script_name):
    mock_user = mock.Mock()
    with mock.patch("getpass.getuser", return_value=mock_user):
        assert DefaultRunContext().tags() == {
            MLFLOW_USER: mock_user,
            MLFLOW_SOURCE_NAME: MOCK_SCRIPT_NAME,
            MLFLOW_SOURCE_TYPE: SourceType.to_string(SourceType.LOCAL),
        }
```

--------------------------------------------------------------------------------

---[FILE: test_git_context.py]---
Location: mlflow-master/tests/tracking/context/test_git_context.py

```python
from unittest import mock

import git
import pytest

from mlflow.tracking.context.git_context import GitRunContext
from mlflow.utils.mlflow_tags import MLFLOW_GIT_COMMIT

MOCK_SCRIPT_NAME = "/path/to/script.py"
MOCK_COMMIT_HASH = "commit-hash"


@pytest.fixture
def patch_script_name():
    patch_sys_argv = mock.patch("sys.argv", [MOCK_SCRIPT_NAME])
    patch_os_path_isfile = mock.patch("os.path.isfile", return_value=False)
    with patch_sys_argv, patch_os_path_isfile:
        yield


@pytest.fixture
def patch_git_repo():
    mock_repo = mock.Mock()
    mock_repo.head.commit.hexsha = MOCK_COMMIT_HASH
    mock_repo.ignored.return_value = []
    with mock.patch("git.Repo", return_value=mock_repo):
        yield mock_repo


def test_git_run_context_in_context_true(patch_script_name, patch_git_repo):
    assert GitRunContext().in_context()


def test_git_run_context_in_context_false(patch_script_name):
    with mock.patch("git.Repo", side_effect=git.InvalidGitRepositoryError):
        assert not GitRunContext().in_context()


def test_git_run_context_tags(patch_script_name, patch_git_repo):
    assert GitRunContext().tags() == {MLFLOW_GIT_COMMIT: MOCK_COMMIT_HASH}


def test_git_run_context_caching(patch_script_name):
    with mock.patch("git.Repo") as mock_repo:
        context = GitRunContext()
        context.in_context()
        context.tags()

    mock_repo.assert_called_once()
```

--------------------------------------------------------------------------------

---[FILE: test_registry.py]---
Location: mlflow-master/tests/tracking/context/test_registry.py

```python
from importlib import reload
from unittest import mock

import pytest

import mlflow.tracking.context.registry
from mlflow.tracking.context.databricks_job_context import DatabricksJobRunContext
from mlflow.tracking.context.databricks_notebook_context import DatabricksNotebookRunContext
from mlflow.tracking.context.databricks_repo_context import DatabricksRepoRunContext
from mlflow.tracking.context.default_context import DefaultRunContext
from mlflow.tracking.context.git_context import GitRunContext
from mlflow.tracking.context.registry import RunContextProviderRegistry, resolve_tags


def test_run_context_provider_registry_register():
    provider_class = mock.Mock()

    registry = RunContextProviderRegistry()
    registry.register(provider_class)

    assert set(registry) == {provider_class.return_value}


def test_run_context_provider_registry_register_entrypoints():
    provider_class = mock.Mock()
    mock_entrypoint = mock.Mock()
    mock_entrypoint.load.return_value = provider_class

    with mock.patch(
        "mlflow.utils.plugins._get_entry_points", return_value=[mock_entrypoint]
    ) as mock_get_group_all:
        registry = RunContextProviderRegistry()
        registry.register_entrypoints()

    assert set(registry) == {provider_class.return_value}
    mock_entrypoint.load.assert_called_once_with()
    mock_get_group_all.assert_called_once_with("mlflow.run_context_provider")


@pytest.mark.parametrize(
    "exception", [AttributeError("test exception"), ImportError("test exception")]
)
def test_run_context_provider_registry_register_entrypoints_handles_exception(exception):
    mock_entrypoint = mock.Mock()
    mock_entrypoint.load.side_effect = exception

    with mock.patch(
        "mlflow.utils.plugins._get_entry_points", return_value=[mock_entrypoint]
    ) as mock_get_group_all:
        registry = RunContextProviderRegistry()
        # Check that the raised warning contains the message from the original exception
        with pytest.warns(UserWarning, match="test exception"):
            registry.register_entrypoints()

    mock_entrypoint.load.assert_called_once_with()
    mock_get_group_all.assert_called_once_with("mlflow.run_context_provider")


def _currently_registered_run_context_provider_classes():
    return {
        provider.__class__
        for provider in mlflow.tracking.context.registry._run_context_provider_registry
    }


def test_registry_instance_defaults():
    expected_classes = {
        DefaultRunContext,
        GitRunContext,
        DatabricksNotebookRunContext,
        DatabricksJobRunContext,
        DatabricksRepoRunContext,
    }
    assert expected_classes.issubset(_currently_registered_run_context_provider_classes())


def test_registry_instance_loads_entrypoints():
    class MockRunContext:
        pass

    mock_entrypoint = mock.Mock()
    mock_entrypoint.load.return_value = MockRunContext

    with mock.patch(
        "mlflow.utils.plugins._get_entry_points", return_value=[mock_entrypoint]
    ) as mock_get_group_all:
        # Entrypoints are registered at import time, so we need to reload the module to register the
        # entrypoint given by the mocked entrypoints.get_group_all
        reload(mlflow.tracking.context.registry)

    assert MockRunContext in _currently_registered_run_context_provider_classes()
    mock_get_group_all.assert_called_once_with("mlflow.run_context_provider")


def test_run_context_provider_registry_with_installed_plugin(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)

    reload(mlflow.tracking.context.registry)

    from mlflow_test_plugin.run_context_provider import PluginRunContextProvider

    assert PluginRunContextProvider in _currently_registered_run_context_provider_classes()

    # The test plugin's context provider always returns False from in_context
    # to avoid polluting tags in developers' environments. The following mock overrides this to
    # perform the integration test.
    with mock.patch.object(PluginRunContextProvider, "in_context", return_value=True):
        assert resolve_tags()["test"] == "tag"


@pytest.fixture
def mock_run_context_providers():
    base_provider = mock.Mock()
    base_provider.in_context.return_value = True
    base_provider.tags.return_value = {"one": "one-val", "two": "two-val", "three": "three-val"}

    skipped_provider = mock.Mock()
    skipped_provider.in_context.return_value = False

    exception_provider = mock.Mock()
    exception_provider.in_context.return_value = True
    exception_provider.tags.return_value = {
        "random-key": "This val will never make it to tag resolution"
    }
    exception_provider.tags.side_effect = Exception(
        "This should be caught by logic in resolve_tags()"
    )

    override_provider = mock.Mock()
    override_provider.in_context.return_value = True
    override_provider.tags.return_value = {"one": "override", "new": "new-val"}

    providers = [base_provider, skipped_provider, exception_provider, override_provider]

    with mock.patch("mlflow.tracking.context.registry._run_context_provider_registry", providers):
        yield

    skipped_provider.tags.assert_not_called()


def test_resolve_tags(mock_run_context_providers):
    tags_arg = {"two": "arg-override", "arg": "arg-val"}
    assert resolve_tags(tags_arg) == {
        "one": "override",
        "two": "arg-override",
        "three": "three-val",
        "new": "new-val",
        "arg": "arg-val",
    }


def test_resolve_tags_no_arg(mock_run_context_providers):
    assert resolve_tags() == {
        "one": "override",
        "two": "two-val",
        "three": "three-val",
        "new": "new-val",
    }
```

--------------------------------------------------------------------------------

---[FILE: test_system_environment_context.py]---
Location: mlflow-master/tests/tracking/context/test_system_environment_context.py

```python
from mlflow.tracking.context.system_environment_context import SystemEnvironmentContext


def test_system_environment_context_in_context(monkeypatch):
    monkeypatch.setenv("MLFLOW_RUN_CONTEXT", '{"A": "B"}')
    assert SystemEnvironmentContext().in_context()
    monkeypatch.delenv("MLFLOW_RUN_CONTEXT", raising=True)
    assert not SystemEnvironmentContext().in_context()


def test_system_environment_context_tags(monkeypatch):
    monkeypatch.setenv("MLFLOW_RUN_CONTEXT", '{"A": "B", "C": "D"}')
    assert SystemEnvironmentContext().tags() == {"A": "B", "C": "D"}
```

--------------------------------------------------------------------------------

---[FILE: test_databricks_notebook_experiment_provider.py]---
Location: mlflow-master/tests/tracking/default_experiment/test_databricks_notebook_experiment_provider.py

```python
from unittest import mock

import pytest

from mlflow import MlflowClient
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.tracking.default_experiment.databricks_notebook_experiment_provider import (
    DatabricksNotebookExperimentProvider,
)
from mlflow.utils.mlflow_tags import MLFLOW_EXPERIMENT_SOURCE_ID, MLFLOW_EXPERIMENT_SOURCE_TYPE


@pytest.fixture(autouse=True)
def reset_resolved_notebook_experiment_id():
    DatabricksNotebookExperimentProvider._resolve_notebook_experiment_id.cache_clear()


def test_databricks_notebook_default_experiment_in_context():
    with mock.patch("mlflow.utils.databricks_utils.is_in_databricks_notebook") as in_notebook_mock:
        assert DatabricksNotebookExperimentProvider().in_context() == in_notebook_mock.return_value


def test_databricks_notebook_default_experiment_id():
    with (
        mock.patch.object(
            MlflowClient,
            "create_experiment",
            side_effect=MlflowException(
                message="Error message", error_code=INVALID_PARAMETER_VALUE
            ),
        ),
        mock.patch(
            "mlflow.utils.databricks_utils.get_notebook_path",
            return_value="path",
        ),
        mock.patch("mlflow.utils.databricks_utils.get_notebook_id") as patch_notebook_id,
    ):
        assert (
            DatabricksNotebookExperimentProvider().get_experiment_id()
            == patch_notebook_id.return_value
        )


def test_databricks_repo_notebook_default_experiment_gets_id_by_request():
    with (
        mock.patch(
            "mlflow.utils.databricks_utils.get_notebook_id",
            return_value=1234,
        ),
        mock.patch(
            "mlflow.utils.databricks_utils.get_notebook_path",
            return_value="/Repos/path",
        ),
        mock.patch.object(
            MlflowClient, "create_experiment", return_value="experiment_id"
        ) as create_experiment_mock,
    ):
        DatabricksNotebookExperimentProvider._resolved_notebook_experiment_id = None
        returned_id = DatabricksNotebookExperimentProvider().get_experiment_id()
        assert returned_id == "experiment_id"
        tags = {MLFLOW_EXPERIMENT_SOURCE_TYPE: "REPO_NOTEBOOK", MLFLOW_EXPERIMENT_SOURCE_ID: 1234}
        create_experiment_mock.assert_called_once_with("/Repos/path", None, tags)


def test_databricks_repo_notebook_default_experiment_uses_fallback_notebook_id():
    with (
        mock.patch(
            "mlflow.utils.databricks_utils.get_notebook_id",
            return_value=1234,
        ),
        mock.patch(
            "mlflow.utils.databricks_utils.get_notebook_path",
            return_value="/Repos/path",
        ),
        mock.patch.object(MlflowClient, "create_experiment") as create_experiment_mock,
    ):
        DatabricksNotebookExperimentProvider._resolved_notebook_experiment_id = None
        create_experiment_mock.side_effect = MlflowException(
            message="not enabled", error_code=INVALID_PARAMETER_VALUE
        )
        returned_id = DatabricksNotebookExperimentProvider().get_experiment_id()
        assert returned_id == 1234
```

--------------------------------------------------------------------------------

---[FILE: test_registry.py]---
Location: mlflow-master/tests/tracking/default_experiment/test_registry.py

```python
from importlib import reload
from unittest import mock

import pytest

import mlflow.tracking.default_experiment.registry
from mlflow.tracking.default_experiment.databricks_notebook_experiment_provider import (
    DatabricksNotebookExperimentProvider,
)
from mlflow.tracking.default_experiment.registry import (
    DefaultExperimentProviderRegistry,
    get_experiment_id,
)


def test_default_experiment_provider_registry_register():
    provider_class = mock.Mock()

    registry = DefaultExperimentProviderRegistry()
    registry.register(provider_class)

    assert set(registry) == {provider_class.return_value}


def test_default_experiment_provider_registry_register_entrypoints():
    provider_class = mock.Mock()
    mock_entrypoint = mock.Mock()
    mock_entrypoint.load.return_value = provider_class

    with mock.patch(
        "mlflow.utils.plugins._get_entry_points", return_value=[mock_entrypoint]
    ) as mock_get_group_all:
        registry = DefaultExperimentProviderRegistry()
        registry.register_entrypoints()

    assert set(registry) == {provider_class.return_value}
    mock_entrypoint.load.assert_called_once_with()
    mock_get_group_all.assert_called_once_with("mlflow.default_experiment_provider")


@pytest.mark.parametrize(
    "exception", [AttributeError("test exception"), ImportError("test exception")]
)
def test_default_experiment_provider_registry_register_entrypoints_handles_exception(exception):
    mock_entrypoint = mock.Mock()
    mock_entrypoint.load.side_effect = exception

    with mock.patch(
        "mlflow.utils.plugins._get_entry_points", return_value=[mock_entrypoint]
    ) as mock_get_group_all:
        registry = DefaultExperimentProviderRegistry()
        # Check that the raised warning contains the message from the original exception
        with pytest.warns(UserWarning, match="test exception"):
            registry.register_entrypoints()

    mock_entrypoint.load.assert_called_once_with()
    mock_get_group_all.assert_called_once_with("mlflow.default_experiment_provider")


def _currently_registered_default_experiment_provider_classes():
    return {
        provider.__class__
        for provider in (
            mlflow.tracking.default_experiment.registry._default_experiment_provider_registry
        )
    }


def test_registry_instance_defaults():
    expected_classes = {
        DatabricksNotebookExperimentProvider,
    }
    assert expected_classes.issubset(_currently_registered_default_experiment_provider_classes())


def test_registry_instance_loads_entrypoints():
    class MockRunContext:
        pass

    mock_entrypoint = mock.Mock()
    mock_entrypoint.load.return_value = MockRunContext

    with mock.patch(
        "mlflow.utils.plugins._get_entry_points", return_value=[mock_entrypoint]
    ) as mock_get_group_all:
        # Entrypoints are registered at import time, so we need to reload the module to register the
        # entrypoint given by the mocked entrypoints.get_group_all
        reload(mlflow.tracking.default_experiment.registry)

    assert MockRunContext in _currently_registered_default_experiment_provider_classes()
    mock_get_group_all.assert_called_once_with("mlflow.default_experiment_provider")


def test_default_experiment_provider_registry_with_installed_plugin(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)

    reload(mlflow.tracking.default_experiment.registry)

    from mlflow_test_plugin.default_experiment_provider import PluginDefaultExperimentProvider

    assert (
        PluginDefaultExperimentProvider
        in _currently_registered_default_experiment_provider_classes()
    )

    # The test plugin's context provider always returns False from in_context
    # to avoid polluting get_experiment_id in developers' environments.
    # The following mock overrides this to perform the integration test.
    with mock.patch.object(PluginDefaultExperimentProvider, "in_context", return_value=True):
        assert get_experiment_id() == "experiment_id_1"


@pytest.fixture
def mock_default_experiment_providers():
    base_provider = mock.Mock()
    base_provider.in_context.return_value = True
    base_provider.get_experiment_id.return_value = "experiment_id_1"

    skipped_provider = mock.Mock()
    skipped_provider.in_context.return_value = False

    exception_provider = mock.Mock()
    exception_provider.in_context.return_value = True
    exception_provider.get_experiment_id.side_effect = Exception(
        "This should be caught by logic in get_experiment_id()"
    )

    providers = [base_provider, skipped_provider, exception_provider]

    with mock.patch(
        "mlflow.tracking.default_experiment.registry._default_experiment_provider_registry",
        providers,
    ):
        yield

    skipped_provider.get_experiment_id.assert_not_called()


@pytest.fixture
def mock_default_experiment_multiple_context_providers():
    base_provider = mock.Mock()
    base_provider.in_context.return_value = True
    base_provider.get_experiment_id.return_value = "experiment_id_1"

    unused_provider = mock.Mock()
    unused_provider.in_context.return_value = True
    unused_provider.get_experiment_id.return_value = "experiment_id_2"

    providers = [base_provider, unused_provider]

    with mock.patch(
        "mlflow.tracking.default_experiment.registry._default_experiment_provider_registry",
        providers,
    ):
        yield

    unused_provider.get_experiment_id.assert_not_called()


def test_get_experiment_id(mock_default_experiment_providers):
    assert get_experiment_id() == "experiment_id_1"


def test_get_experiment_id_multiple_context(mock_default_experiment_multiple_context_providers):
    assert get_experiment_id() == "experiment_id_1"
```

--------------------------------------------------------------------------------

````
