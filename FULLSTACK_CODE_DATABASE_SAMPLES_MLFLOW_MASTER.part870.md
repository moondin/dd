---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 870
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 870 of 991)

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

---[FILE: test_pmdarima_model_export.py]---
Location: mlflow-master/tests/pmdarima/test_pmdarima_model_export.py

```python
import json
import os
from pathlib import Path
from unittest import mock

import numpy as np
import pandas as pd
import pmdarima
import pytest
import yaml

import mlflow.pmdarima
import mlflow.pyfunc.scoring_server as pyfunc_scoring_server
from mlflow import pyfunc
from mlflow.exceptions import MlflowException
from mlflow.models import Model, ModelSignature, infer_signature
from mlflow.models.utils import _read_example, load_serving_example
from mlflow.store.artifact.s3_artifact_repo import S3ArtifactRepository
from mlflow.tracking.artifact_utils import _download_artifact_from_uri
from mlflow.types import DataType
from mlflow.types.schema import ColSpec, Schema
from mlflow.utils.environment import _mlflow_conda_env
from mlflow.utils.model_utils import _get_flavor_configuration

from tests.helper_functions import (
    _assert_pip_requirements,
    _compare_conda_env_requirements,
    _compare_logged_code_paths,
    _is_available_on_pypi,
    _mlflow_major_version_string,
    assert_register_model_called_with_local_model_path,
    pyfunc_serve_and_score_model,
)
from tests.prophet.test_prophet_model_export import DataGeneration

EXTRA_PYFUNC_SERVING_TEST_ARGS = (
    [] if _is_available_on_pypi("pmdarima") else ["--env-manager", "local"]
)


@pytest.fixture
def model_path(tmp_path):
    return tmp_path.joinpath("model")


@pytest.fixture
def pmdarima_custom_env(tmp_path):
    conda_env = tmp_path.joinpath("conda_env.yml")
    _mlflow_conda_env(conda_env, additional_pip_deps=["pmdarima"])
    return conda_env


@pytest.fixture(scope="module")
def test_data():
    data_conf = {
        "shift": False,
        "start": "2016-01-01",
        "size": 365 * 3,
        "seasonal_period": 7,
        "seasonal_freq": 0.1,
        "date_field": "date",
        "target_field": "orders",
    }
    raw = DataGeneration(**data_conf).create_series_df()
    return raw.set_index("date")


@pytest.fixture(scope="module")
def auto_arima_model(test_data):
    return pmdarima.auto_arima(
        test_data["orders"], max_d=1, suppress_warnings=True, error_action="raise"
    )


@pytest.fixture(scope="module")
def auto_arima_object_model(test_data):
    model = pmdarima.arima.ARIMA(order=(2, 1, 3), maxiter=25)
    return model.fit(test_data["orders"])


def test_pmdarima_auto_arima_save_and_load(auto_arima_model, model_path):
    mlflow.pmdarima.save_model(pmdarima_model=auto_arima_model, path=model_path)

    loaded_model = mlflow.pmdarima.load_model(model_uri=model_path)

    np.testing.assert_array_equal(auto_arima_model.predict(10), loaded_model.predict(10))


def test_pmdarima_arima_object_save_and_load(auto_arima_object_model, model_path):
    mlflow.pmdarima.save_model(pmdarima_model=auto_arima_object_model, path=model_path)

    loaded_model = mlflow.pmdarima.load_model(model_uri=model_path)

    np.testing.assert_array_equal(auto_arima_object_model.predict(30), loaded_model.predict(30))


def test_pmdarima_autoarima_pyfunc_save_and_load(auto_arima_model, model_path):
    mlflow.pmdarima.save_model(pmdarima_model=auto_arima_model, path=model_path)
    loaded_pyfunc = mlflow.pyfunc.load_model(model_uri=model_path)

    model_predict = auto_arima_model.predict(n_periods=60, return_conf_int=True, alpha=0.1)

    predict_conf = pd.DataFrame({"n_periods": 60, "return_conf_int": True, "alpha": 0.1}, index=[0])
    pyfunc_predict = loaded_pyfunc.predict(predict_conf)

    np.testing.assert_array_equal(model_predict[0], pyfunc_predict["yhat"])
    yhat_low, yhat_high = list(zip(*model_predict[1]))
    np.testing.assert_array_equal(yhat_low, pyfunc_predict["yhat_lower"])
    np.testing.assert_array_equal(yhat_high, pyfunc_predict["yhat_upper"])


@pytest.mark.parametrize("use_signature", [True, False])
@pytest.mark.parametrize("use_example", [True, False])
def test_pmdarima_signature_and_examples_saved_correctly(
    auto_arima_model, model_path, use_signature, use_example
):
    # NB: Signature inference will only work on the first element of the tuple return
    prediction = auto_arima_model.predict(n_periods=20, return_conf_int=True, alpha=0.05)
    test_data = pd.DataFrame({"n_periods": [30]})
    signature = infer_signature(test_data, prediction[0]) if use_signature or use_example else None
    example = test_data if use_example else None
    mlflow.pmdarima.save_model(
        auto_arima_model, path=model_path, signature=signature, input_example=example
    )
    mlflow_model = Model.load(model_path)
    if signature is None and example is None:
        assert mlflow_model.signature is None
    else:
        assert mlflow_model.signature == signature
    if example is None:
        assert mlflow_model.saved_input_example_info is None
    else:
        r_example = _read_example(mlflow_model, model_path).copy(deep=False)
        np.testing.assert_array_equal(r_example, example)


@pytest.mark.parametrize("use_signature", [True, False])
@pytest.mark.parametrize("use_example", [True, False])
def test_pmdarima_signature_and_example_for_confidence_interval_mode(
    auto_arima_model, model_path, use_signature, use_example
):
    model_path_primary = model_path.joinpath("primary")
    model_path_secondary = model_path.joinpath("secondary")
    mlflow.pmdarima.save_model(pmdarima_model=auto_arima_model, path=model_path_primary)
    loaded_pyfunc = mlflow.pyfunc.load_model(model_uri=model_path_primary)
    predict_conf = pd.DataFrame([{"n_periods": 10, "return_conf_int": True, "alpha": 0.2}])
    forecast = loaded_pyfunc.predict(predict_conf)
    signature_ = infer_signature(predict_conf, forecast)
    signature = signature_ if use_signature else None
    example = predict_conf.copy(deep=False) if use_example else None
    mlflow.pmdarima.save_model(
        auto_arima_model, path=model_path_secondary, signature=signature, input_example=example
    )
    mlflow_model = Model.load(model_path_secondary)
    if signature is None and example is None:
        assert mlflow_model.signature is None
    else:
        assert mlflow_model.signature == signature_
    if example is None:
        assert mlflow_model.saved_input_example_info is None
    else:
        r_example = _read_example(mlflow_model, model_path_secondary).copy(deep=False)
        np.testing.assert_array_equal(r_example, example)


def test_pmdarima_load_from_remote_uri_succeeds(
    auto_arima_object_model, model_path, mock_s3_bucket
):
    mlflow.pmdarima.save_model(pmdarima_model=auto_arima_object_model, path=model_path)

    artifact_root = f"s3://{mock_s3_bucket}"
    artifact_path = "model"
    artifact_repo = S3ArtifactRepository(artifact_root)
    artifact_repo.log_artifacts(model_path, artifact_path=artifact_path)

    # NB: cloudpathlib would need to be used here to handle object store uri
    model_uri = os.path.join(artifact_root, artifact_path)
    reloaded_pmdarima_model = mlflow.pmdarima.load_model(model_uri=model_uri)

    np.testing.assert_array_equal(
        auto_arima_object_model.predict(30), reloaded_pmdarima_model.predict(30)
    )


@pytest.mark.parametrize("should_start_run", [True, False])
def test_pmdarima_log_model(auto_arima_model, tmp_path, should_start_run):
    try:
        if should_start_run:
            mlflow.start_run()
        artifact_path = "pmdarima"
        conda_env = tmp_path.joinpath("conda_env.yaml")
        _mlflow_conda_env(conda_env, additional_pip_deps=["pmdarima"])
        model_info = mlflow.pmdarima.log_model(
            auto_arima_model,
            name=artifact_path,
            conda_env=str(conda_env),
        )
        reloaded_model = mlflow.pmdarima.load_model(model_uri=model_info.model_uri)
        np.testing.assert_array_equal(auto_arima_model.predict(20), reloaded_model.predict(20))
        model_path = Path(_download_artifact_from_uri(artifact_uri=model_info.model_uri))
        model_config = Model.load(str(model_path.joinpath("MLmodel")))
        assert pyfunc.FLAVOR_NAME in model_config.flavors
        assert pyfunc.ENV in model_config.flavors[pyfunc.FLAVOR_NAME]
        env_path = model_config.flavors[pyfunc.FLAVOR_NAME][pyfunc.ENV]["conda"]
        assert model_path.joinpath(env_path).exists()
    finally:
        mlflow.end_run()


def test_pmdarima_log_model_calls_register_model(auto_arima_object_model, tmp_path):
    artifact_path = "pmdarima"
    register_model_patch = mock.patch("mlflow.tracking._model_registry.fluent._register_model")
    with mlflow.start_run(), register_model_patch:
        conda_env = tmp_path.joinpath("conda_env.yaml")
        _mlflow_conda_env(conda_env, additional_pip_deps=["pmdarima"])
        model_info = mlflow.pmdarima.log_model(
            auto_arima_object_model,
            name=artifact_path,
            conda_env=str(conda_env),
            registered_model_name="PmdarimaModel",
        )
        assert_register_model_called_with_local_model_path(
            mlflow.tracking._model_registry.fluent._register_model,
            model_info.model_uri,
            "PmdarimaModel",
        )


def test_pmdarima_log_model_no_registered_model_name(auto_arima_model, tmp_path):
    artifact_path = "pmdarima"
    register_model_patch = mock.patch("mlflow.tracking._model_registry.fluent._register_model")
    with mlflow.start_run(), register_model_patch:
        conda_env = tmp_path.joinpath("conda_env.yaml")
        _mlflow_conda_env(conda_env, additional_pip_deps=["pmdarima"])
        mlflow.pmdarima.log_model(auto_arima_model, name=artifact_path, conda_env=str(conda_env))
        mlflow.tracking._model_registry.fluent._register_model.assert_not_called()


def test_pmdarima_model_save_persists_specified_conda_env_in_mlflow_model_directory(
    auto_arima_object_model, model_path, pmdarima_custom_env
):
    mlflow.pmdarima.save_model(
        pmdarima_model=auto_arima_object_model, path=model_path, conda_env=str(pmdarima_custom_env)
    )
    pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
    saved_conda_env_path = model_path.joinpath(pyfunc_conf[pyfunc.ENV]["conda"])
    assert saved_conda_env_path.exists()
    assert not pmdarima_custom_env.samefile(saved_conda_env_path)

    pmdarima_custom_env_parsed = yaml.safe_load(pmdarima_custom_env.read_bytes())
    saved_conda_env_parsed = yaml.safe_load(saved_conda_env_path.read_bytes())
    assert saved_conda_env_parsed == pmdarima_custom_env_parsed


def test_pmdarima_model_save_persists_requirements_in_mlflow_model_directory(
    auto_arima_model, model_path, pmdarima_custom_env
):
    mlflow.pmdarima.save_model(
        pmdarima_model=auto_arima_model, path=model_path, conda_env=str(pmdarima_custom_env)
    )
    saved_pip_req_path = model_path.joinpath("requirements.txt")
    _compare_conda_env_requirements(pmdarima_custom_env, str(saved_pip_req_path))


def test_pmdarima_log_model_with_pip_requirements(auto_arima_object_model, tmp_path):
    expected_mlflow_version = _mlflow_major_version_string()
    req_file = tmp_path.joinpath("requirements.txt")
    req_file.write_text("a")
    with mlflow.start_run():
        model_info = mlflow.pmdarima.log_model(
            auto_arima_object_model, name="model", pip_requirements=str(req_file)
        )
        _assert_pip_requirements(model_info.model_uri, [expected_mlflow_version, "a"], strict=True)

    # List of requirements
    with mlflow.start_run():
        model_info = mlflow.pmdarima.log_model(
            auto_arima_object_model, name="model", pip_requirements=[f"-r {req_file}", "b"]
        )
        _assert_pip_requirements(
            model_info.model_uri, [expected_mlflow_version, "a", "b"], strict=True
        )

    # Constraints file
    with mlflow.start_run():
        model_info = mlflow.pmdarima.log_model(
            auto_arima_object_model, name="model", pip_requirements=[f"-c {req_file}", "b"]
        )
        _assert_pip_requirements(
            model_info.model_uri,
            [expected_mlflow_version, "b", "-c constraints.txt"],
            ["a"],
            strict=True,
        )


def test_pmdarima_log_model_with_extra_pip_requirements(auto_arima_model, tmp_path):
    expected_mlflow_version = _mlflow_major_version_string()
    default_reqs = mlflow.pmdarima.get_default_pip_requirements()

    # Path to a requirements file
    req_file = tmp_path.joinpath("requirements.txt")
    req_file.write_text("a")
    with mlflow.start_run():
        model_info = mlflow.pmdarima.log_model(
            auto_arima_model, name="model", extra_pip_requirements=str(req_file)
        )
        _assert_pip_requirements(
            model_info.model_uri, [expected_mlflow_version, *default_reqs, "a"]
        )

    # List of requirements
    with mlflow.start_run():
        model_info = mlflow.pmdarima.log_model(
            auto_arima_model, name="model", extra_pip_requirements=[f"-r {req_file}", "b"]
        )
        _assert_pip_requirements(
            model_info.model_uri, [expected_mlflow_version, *default_reqs, "a", "b"]
        )

    # Constraints file
    with mlflow.start_run():
        model_info = mlflow.pmdarima.log_model(
            auto_arima_model, name="model", extra_pip_requirements=[f"-c {req_file}", "b"]
        )
        _assert_pip_requirements(
            model_uri=model_info.model_uri,
            requirements=[expected_mlflow_version, *default_reqs, "b", "-c constraints.txt"],
            constraints=["a"],
            strict=False,
        )


def test_pmdarima_model_save_without_conda_env_uses_default_env_with_expected_dependencies(
    auto_arima_model, model_path
):
    mlflow.pmdarima.save_model(auto_arima_model, model_path)
    _assert_pip_requirements(model_path, mlflow.pmdarima.get_default_pip_requirements())


def test_pmdarima_model_log_without_conda_env_uses_default_env_with_expected_dependencies(
    auto_arima_object_model,
):
    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.pmdarima.log_model(auto_arima_object_model, name=artifact_path)
    _assert_pip_requirements(model_info.model_uri, mlflow.pmdarima.get_default_pip_requirements())


def test_pmdarima_pyfunc_serve_and_score(auto_arima_model):
    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.pmdarima.log_model(
            auto_arima_model,
            name=artifact_path,
            input_example=pd.DataFrame({"n_periods": 30}, index=[0]),
        )
    local_predict = auto_arima_model.predict(30)

    inference_payload = load_serving_example(model_info.model_uri)
    resp = pyfunc_serve_and_score_model(
        model_info.model_uri,
        data=inference_payload,
        content_type=pyfunc_scoring_server.CONTENT_TYPE_JSON,
        extra_args=EXTRA_PYFUNC_SERVING_TEST_ARGS,
    )
    scores = (
        pd.DataFrame(data=json.loads(resp.content.decode("utf-8"))["predictions"])
        .to_numpy()
        .flatten()
    )
    np.testing.assert_array_almost_equal(scores, local_predict)


def test_pmdarima_pyfunc_raises_invalid_df_input(auto_arima_model, model_path):
    mlflow.pmdarima.save_model(pmdarima_model=auto_arima_model, path=model_path)
    loaded_pyfunc = mlflow.pyfunc.load_model(model_uri=model_path)

    with pytest.raises(MlflowException, match="The provided prediction pd.DataFrame "):
        loaded_pyfunc.predict(pd.DataFrame([{"n_periods": 60}, {"n_periods": 100}]))

    with pytest.raises(MlflowException, match="The provided prediction configuration "):
        loaded_pyfunc.predict(pd.DataFrame([{"invalid": True}]))

    with pytest.raises(MlflowException, match="The provided `n_periods` value "):
        loaded_pyfunc.predict(pd.DataFrame([{"n_periods": "60"}]))


def test_pmdarima_pyfunc_return_correct_structure(auto_arima_model, model_path):
    mlflow.pmdarima.save_model(pmdarima_model=auto_arima_model, path=model_path)
    loaded_pyfunc = mlflow.pyfunc.load_model(model_uri=model_path)

    predict_conf_no_ci = pd.DataFrame([{"n_periods": 10, "return_conf_int": False}])
    forecast_no_ci = loaded_pyfunc.predict(predict_conf_no_ci)

    assert isinstance(forecast_no_ci, pd.DataFrame)
    assert len(forecast_no_ci) == 10
    assert len(forecast_no_ci.columns.values) == 1

    predict_conf_with_ci = pd.DataFrame([{"n_periods": 10, "return_conf_int": True}])
    forecast_with_ci = loaded_pyfunc.predict(predict_conf_with_ci)

    assert isinstance(forecast_with_ci, pd.DataFrame)
    assert len(forecast_with_ci) == 10
    assert len(forecast_with_ci.columns.values) == 3


def test_log_model_with_code_paths(auto_arima_model):
    artifact_path = "model"
    with (
        mlflow.start_run(),
        mock.patch("mlflow.pmdarima._add_code_from_conf_to_system_path") as add_mock,
    ):
        model_info = mlflow.pmdarima.log_model(
            auto_arima_model, name=artifact_path, code_paths=[__file__]
        )
        _compare_logged_code_paths(__file__, model_info.model_uri, mlflow.pmdarima.FLAVOR_NAME)
        mlflow.pmdarima.load_model(model_info.model_uri)
        add_mock.assert_called()


def test_virtualenv_subfield_points_to_correct_path(auto_arima_model, model_path):
    mlflow.pmdarima.save_model(auto_arima_model, path=model_path)
    pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
    python_env_path = Path(model_path, pyfunc_conf[pyfunc.ENV]["virtualenv"])
    assert python_env_path.exists()
    assert python_env_path.is_file()


def test_model_save_load_with_metadata(auto_arima_model, model_path):
    mlflow.pmdarima.save_model(
        auto_arima_model, path=model_path, metadata={"metadata_key": "metadata_value"}
    )

    reloaded_model = mlflow.pyfunc.load_model(model_uri=model_path)
    assert reloaded_model.metadata.metadata["metadata_key"] == "metadata_value"


def test_model_log_with_metadata(auto_arima_model):
    artifact_path = "model"

    with mlflow.start_run():
        model_info = mlflow.pmdarima.log_model(
            auto_arima_model,
            name=artifact_path,
            metadata={"metadata_key": "metadata_value"},
        )

    reloaded_model = mlflow.pyfunc.load_model(model_uri=model_info.model_uri)
    assert reloaded_model.metadata.metadata["metadata_key"] == "metadata_value"


def test_model_log_with_signature_inference(auto_arima_model):
    artifact_path = "model"
    example = pd.DataFrame({"n_periods": 60, "return_conf_int": True, "alpha": 0.1}, index=[0])

    with mlflow.start_run():
        model_info = mlflow.pmdarima.log_model(
            auto_arima_model, name=artifact_path, input_example=example
        )

    model_info_loaded = Model.load(model_info.model_uri)
    assert model_info_loaded.signature == ModelSignature(
        inputs=Schema(
            [
                ColSpec(name="n_periods", type=DataType.long),
                ColSpec(name="return_conf_int", type=DataType.boolean),
                ColSpec(name="alpha", type=DataType.double),
            ]
        ),
        outputs=Schema(
            [
                ColSpec(name="yhat", type=DataType.double),
                ColSpec(name="yhat_lower", type=DataType.double),
                ColSpec(name="yhat_upper", type=DataType.double),
            ]
        ),
    )
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: mlflow-master/tests/projects/conftest.py

```python
import os
import shutil

import git
import pytest

from tests.projects.utils import GIT_PROJECT_BRANCH, TEST_PROJECT_DIR


@pytest.fixture
def local_git_repo(tmp_path):
    local_git = str(tmp_path.joinpath("git_repo"))
    repo = git.Repo.init(local_git)
    shutil.copytree(src=TEST_PROJECT_DIR, dst=local_git, dirs_exist_ok=True)
    shutil.copytree(src=os.path.dirname(TEST_PROJECT_DIR), dst=local_git, dirs_exist_ok=True)
    repo.git.add(A=True)
    repo.index.commit("test")
    repo.create_head(GIT_PROJECT_BRANCH)
    return os.path.abspath(local_git)


@pytest.fixture
def local_git_repo_uri(local_git_repo):
    return f"file://{local_git_repo}"
```

--------------------------------------------------------------------------------

---[FILE: test_databricks.py]---
Location: mlflow-master/tests/projects/test_databricks.py

```python
import filecmp
import json
import os
import shutil
from unittest import mock

import pytest

import mlflow
from mlflow import MlflowClient, cli
from mlflow.entities import RunStatus
from mlflow.environment_variables import MLFLOW_TRACKING_URI
from mlflow.exceptions import MlflowException
from mlflow.legacy_databricks_cli.configure.provider import DatabricksConfig
from mlflow.projects import ExecutionException, databricks
from mlflow.projects.databricks import DatabricksJobRunner, _get_cluster_mlflow_run_cmd
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE, ErrorCode
from mlflow.store.tracking.file_store import FileStore
from mlflow.tracking.request_header.default_request_header_provider import (
    DefaultRequestHeaderProvider,
)
from mlflow.utils import file_utils
from mlflow.utils.mlflow_tags import (
    MLFLOW_DATABRICKS_RUN_URL,
    MLFLOW_DATABRICKS_SHELL_JOB_RUN_ID,
    MLFLOW_DATABRICKS_WEBAPP_URL,
)
from mlflow.utils.rest_utils import MlflowHostCreds
from mlflow.utils.uri import construct_db_uri_from_profile

from tests import helper_functions
from tests.integration.utils import invoke_cli_runner
from tests.projects.utils import TEST_PROJECT_DIR, validate_exit_status


@pytest.fixture
def runs_cancel_mock():
    """Mocks the Jobs Runs Cancel API request"""
    with mock.patch(
        "mlflow.projects.databricks.DatabricksJobRunner.jobs_runs_cancel"
    ) as runs_cancel_mock:
        runs_cancel_mock.return_value = None
        yield runs_cancel_mock


@pytest.fixture
def runs_submit_mock():
    """Mocks the Jobs Runs Submit API request"""
    with mock.patch(
        "mlflow.projects.databricks.DatabricksJobRunner._jobs_runs_submit",
        return_value={"run_id": "-1"},
    ) as runs_submit_mock:
        yield runs_submit_mock


@pytest.fixture
def runs_get_mock():
    """Mocks the Jobs Runs Get API request"""
    with mock.patch(
        "mlflow.projects.databricks.DatabricksJobRunner.jobs_runs_get"
    ) as runs_get_mock:
        yield runs_get_mock


@pytest.fixture
def databricks_cluster_mlflow_run_cmd_mock():
    """Mocks the Jobs Runs Get API request"""
    with mock.patch(
        "mlflow.projects.databricks._get_cluster_mlflow_run_cmd"
    ) as mlflow_run_cmd_mock:
        yield mlflow_run_cmd_mock


@pytest.fixture
def cluster_spec_mock(tmp_path):
    cluster_spec_handle = tmp_path.joinpath("cluster_spec.json")
    cluster_spec_handle.write_text("{}")
    return str(cluster_spec_handle)


@pytest.fixture
def dbfs_root_mock(tmp_path):
    return str(tmp_path.joinpath("dbfs-root"))


@pytest.fixture
def upload_to_dbfs_mock(dbfs_root_mock):
    def upload_mock_fn(_, src_path, dbfs_uri):
        mock_dbfs_dst = os.path.join(dbfs_root_mock, dbfs_uri.split("/dbfs/")[1])
        os.makedirs(os.path.dirname(mock_dbfs_dst))
        shutil.copy(src_path, mock_dbfs_dst)

    with mock.patch.object(
        mlflow.projects.databricks.DatabricksJobRunner, "_upload_to_dbfs", new=upload_mock_fn
    ) as upload_mock:
        yield upload_mock


@pytest.fixture
def dbfs_path_exists_mock(dbfs_root_mock):
    with mock.patch(
        "mlflow.projects.databricks.DatabricksJobRunner._dbfs_path_exists"
    ) as path_exists_mock:
        yield path_exists_mock


@pytest.fixture
def dbfs_mocks(dbfs_path_exists_mock, upload_to_dbfs_mock):
    return


@pytest.fixture
def before_run_validations_mock():
    with mock.patch("mlflow.projects.databricks.before_run_validations"):
        yield


@pytest.fixture
def set_tag_mock():
    with mock.patch("mlflow.projects.databricks.tracking.MlflowClient") as m:
        mlflow_service_mock = mock.Mock(wraps=MlflowClient())
        m.return_value = mlflow_service_mock
        yield mlflow_service_mock.set_tag


def _get_mock_run_state(succeeded):
    if succeeded is None:
        return {"life_cycle_state": "RUNNING", "state_message": ""}
    run_result_state = "SUCCESS" if succeeded else "FAILED"
    return {"life_cycle_state": "TERMINATED", "state_message": "", "result_state": run_result_state}


def mock_runs_get_result(succeeded):
    run_state = _get_mock_run_state(succeeded)
    return {"state": run_state, "run_page_url": "test_url"}


def run_databricks_project(cluster_spec, **kwargs):
    return mlflow.projects.run(
        uri=TEST_PROJECT_DIR,
        backend="databricks",
        backend_config=cluster_spec,
        parameters={"alpha": "0.4"},
        **kwargs,
    )


def test_upload_project_to_dbfs(
    dbfs_root_mock, tmp_path, dbfs_path_exists_mock, upload_to_dbfs_mock
):
    # Upload project to a mock directory
    dbfs_path_exists_mock.return_value = False
    runner = DatabricksJobRunner(databricks_profile_uri=construct_db_uri_from_profile("DEFAULT"))
    dbfs_uri = runner._upload_project_to_dbfs(
        project_dir=TEST_PROJECT_DIR, experiment_id=FileStore.DEFAULT_EXPERIMENT_ID
    )
    # Get expected tar
    local_tar_path = os.path.join(dbfs_root_mock, dbfs_uri.split("/dbfs/")[1])
    expected_tar_path = str(tmp_path.joinpath("expected.tar.gz"))
    file_utils.make_tarfile(
        output_filename=expected_tar_path,
        source_dir=TEST_PROJECT_DIR,
        archive_name=databricks.DB_TARFILE_ARCHIVE_NAME,
    )
    # Extract the tarred project, verify its contents
    assert filecmp.cmp(local_tar_path, expected_tar_path, shallow=False)


def test_upload_existing_project_to_dbfs(dbfs_path_exists_mock):
    # Check that we don't upload the project if it already exists on DBFS
    with mock.patch(
        "mlflow.projects.databricks.DatabricksJobRunner._upload_to_dbfs"
    ) as upload_to_dbfs_mock:
        dbfs_path_exists_mock.return_value = True
        runner = DatabricksJobRunner(
            databricks_profile_uri=construct_db_uri_from_profile("DEFAULT")
        )
        runner._upload_project_to_dbfs(
            project_dir=TEST_PROJECT_DIR, experiment_id=FileStore.DEFAULT_EXPERIMENT_ID
        )
        assert upload_to_dbfs_mock.call_count == 0


@pytest.mark.parametrize(
    "response_mock",
    [
        helper_functions.create_mock_response(400, "Error message but not a JSON string"),
        helper_functions.create_mock_response(400, ""),
        helper_functions.create_mock_response(400, None),
    ],
)
def test_dbfs_path_exists_error_response_handling(response_mock):
    with (
        mock.patch(
            "mlflow.utils.databricks_utils.get_databricks_host_creds"
        ) as get_databricks_host_creds_mock,
        mock.patch("mlflow.utils.rest_utils.http_request") as http_request_mock,
    ):
        # given a well formed DatabricksJobRunner
        # note: databricks_profile is None needed because clients using profile are mocked
        job_runner = DatabricksJobRunner(databricks_profile_uri=None)

        # when the http request to validate the dbfs path returns a 400 response with an
        # error message that is either well-formed JSON or not
        get_databricks_host_creds_mock.return_value = None
        http_request_mock.return_value = response_mock

        # then _dbfs_path_exists should return a MlflowException
        with pytest.raises(MlflowException, match="API request to check existence of file at DBFS"):
            job_runner._dbfs_path_exists("some/path")


def test_run_databricks_validations(
    tmp_path,
    monkeypatch,
    cluster_spec_mock,
    dbfs_mocks,
    set_tag_mock,
):
    """
    Tests that running on Databricks fails before making any API requests if validations fail.
    """
    monkeypatch.setenv("DATABRICKS_HOST", "test-host")
    monkeypatch.setenv("DATABRICKS_TOKEN", "foo")
    with mock.patch(
        "mlflow.projects.databricks.DatabricksJobRunner._databricks_api_request"
    ) as db_api_req_mock:
        # Test bad tracking URI
        mlflow.set_tracking_uri(tmp_path.as_uri())
        with pytest.raises(ExecutionException, match="MLflow tracking URI must be of"):
            run_databricks_project(cluster_spec_mock, synchronous=True)
        assert db_api_req_mock.call_count == 0
        db_api_req_mock.reset_mock()
        mlflow_service = MlflowClient()
        assert len(mlflow_service.search_runs([FileStore.DEFAULT_EXPERIMENT_ID])) == 0
        mlflow.set_tracking_uri("databricks")
        # Test misspecified parameters
        with pytest.raises(
            ExecutionException, match="No value given for missing parameters: 'name'"
        ):
            mlflow.projects.run(
                TEST_PROJECT_DIR,
                backend="databricks",
                entry_point="greeter",
                backend_config=cluster_spec_mock,
            )
        assert db_api_req_mock.call_count == 0
        db_api_req_mock.reset_mock()
        # Test bad cluster spec
        with pytest.raises(ExecutionException, match="Backend spec must be provided"):
            mlflow.projects.run(
                TEST_PROJECT_DIR, backend="databricks", synchronous=True, backend_config=None
            )
        assert db_api_req_mock.call_count == 0
        db_api_req_mock.reset_mock()
        # Test that validations pass with good tracking URIs
        databricks.before_run_validations("http://", cluster_spec_mock)
        databricks.before_run_validations("databricks", cluster_spec_mock)


@pytest.mark.usefixtures(
    "before_run_validations_mock",
    "runs_cancel_mock",
    "dbfs_mocks",
    "databricks_cluster_mlflow_run_cmd_mock",
)
def test_run_databricks(
    runs_submit_mock,
    runs_get_mock,
    cluster_spec_mock,
    set_tag_mock,
    databricks_cluster_mlflow_run_cmd_mock,
    monkeypatch,
):
    monkeypatch.setenv("DATABRICKS_HOST", "https://test-host")
    monkeypatch.setenv("DATABRICKS_TOKEN", "foo")
    mlflow.set_tracking_uri("databricks")
    # Test that MLflow gets the correct run status when performing a Databricks run
    for run_succeeded, expect_status in [(True, RunStatus.FINISHED), (False, RunStatus.FAILED)]:
        runs_get_mock.return_value = mock_runs_get_result(succeeded=run_succeeded)
        submitted_run = run_databricks_project(cluster_spec_mock, synchronous=False)
        assert submitted_run.wait() == run_succeeded
        assert submitted_run.run_id is not None
        assert runs_submit_mock.call_count == 1
        assert databricks_cluster_mlflow_run_cmd_mock.call_count == 1
        tags = {}
        for call_args, _ in set_tag_mock.call_args_list:
            tags[call_args[1]] = call_args[2]
        assert tags[MLFLOW_DATABRICKS_RUN_URL] == "test_url"
        assert tags[MLFLOW_DATABRICKS_SHELL_JOB_RUN_ID] == "-1"
        assert tags[MLFLOW_DATABRICKS_WEBAPP_URL] == "https://test-host"
        set_tag_mock.reset_mock()
        runs_submit_mock.reset_mock()
        databricks_cluster_mlflow_run_cmd_mock.reset_mock()
        validate_exit_status(submitted_run.get_status(), expect_status)


@pytest.mark.usefixtures(
    "before_run_validations_mock",
    "runs_cancel_mock",
    "dbfs_mocks",
    "cluster_spec_mock",
    "set_tag_mock",
)
def test_run_databricks_cluster_spec_json(runs_submit_mock, runs_get_mock, monkeypatch):
    monkeypatch.setenv("DATABRICKS_HOST", "test-host")
    monkeypatch.setenv("DATABRICKS_TOKEN", "foo")
    runs_get_mock.return_value = mock_runs_get_result(succeeded=True)
    cluster_spec = {
        "spark_version": "5.0.x-scala2.11",
        "num_workers": 2,
        "node_type_id": "i3.xlarge",
    }
    # Run project synchronously, verify that it succeeds (doesn't throw)
    run_databricks_project(cluster_spec=cluster_spec, synchronous=True)
    assert runs_submit_mock.call_count == 1
    runs_submit_args, _ = runs_submit_mock.call_args_list[0]
    req_body = runs_submit_args[0]
    assert req_body["new_cluster"] == cluster_spec


@pytest.mark.usefixtures(
    "before_run_validations_mock",
    "runs_cancel_mock",
    "dbfs_mocks",
    "cluster_spec_mock",
    "set_tag_mock",
)
def test_run_databricks_extended_cluster_spec_json(runs_submit_mock, runs_get_mock, monkeypatch):
    monkeypatch.setenv("DATABRICKS_HOST", "test-host")
    monkeypatch.setenv("DATABRICKS_TOKEN", "foo")
    runs_get_mock.return_value = mock_runs_get_result(succeeded=True)
    new_cluster_spec = {
        "spark_version": "6.5.x-scala2.11",
        "num_workers": 2,
        "node_type_id": "i3.xlarge",
    }
    extra_library = {"pypi": {"package": "tensorflow"}}

    cluster_spec = {"new_cluster": new_cluster_spec, "libraries": [extra_library]}

    # Run project synchronously, verify that it succeeds (doesn't throw)
    run_databricks_project(cluster_spec=cluster_spec, synchronous=True)
    assert runs_submit_mock.call_count == 1
    runs_submit_args, _ = runs_submit_mock.call_args_list[0]
    req_body = runs_submit_args[0]
    assert req_body["new_cluster"] == new_cluster_spec
    # This does test deep object equivalence
    assert extra_library in req_body["libraries"]


@pytest.mark.usefixtures(
    "before_run_validations_mock",
    "runs_cancel_mock",
    "dbfs_mocks",
    "cluster_spec_mock",
    "set_tag_mock",
)
def test_run_databricks_extended_cluster_spec_json_without_libraries(
    runs_submit_mock, runs_get_mock, monkeypatch
):
    monkeypatch.setenv("DATABRICKS_HOST", "test-host")
    monkeypatch.setenv("DATABRICKS_TOKEN", "foo")
    runs_get_mock.return_value = mock_runs_get_result(succeeded=True)
    new_cluster_spec = {
        "spark_version": "6.5.x-scala2.11",
        "num_workers": 2,
        "node_type_id": "i3.xlarge",
    }

    cluster_spec = {
        "new_cluster": new_cluster_spec,
    }

    # Run project synchronously, verify that it succeeds (doesn't throw)
    run_databricks_project(cluster_spec=cluster_spec, synchronous=True)
    assert runs_submit_mock.call_count == 1
    runs_submit_args, _ = runs_submit_mock.call_args_list[0]
    req_body = runs_submit_args[0]
    assert req_body["new_cluster"] == new_cluster_spec


def test_run_databricks_throws_exception_when_spec_uses_existing_cluster(monkeypatch):
    monkeypatch.setenv("DATABRICKS_HOST", "test-host")
    monkeypatch.setenv("DATABRICKS_TOKEN", "foo")
    existing_cluster_spec = {
        "existing_cluster_id": "1000-123456-clust1",
    }
    with pytest.raises(
        MlflowException, match="execution against existing clusters is not currently supported"
    ) as exc:
        run_databricks_project(cluster_spec=existing_cluster_spec)
    assert exc.value.error_code == ErrorCode.Name(INVALID_PARAMETER_VALUE)


def test_run_databricks_cancel(
    before_run_validations_mock,
    runs_submit_mock,
    dbfs_mocks,
    set_tag_mock,
    runs_cancel_mock,
    runs_get_mock,
    cluster_spec_mock,
    monkeypatch,
):
    # Test that MLflow properly handles Databricks run cancellation. We mock the result of
    # the runs-get API to indicate run failure so that cancel() exits instead of blocking while
    # waiting for run status.
    monkeypatch.setenv("DATABRICKS_HOST", "test-host")
    monkeypatch.setenv("DATABRICKS_TOKEN", "foo")
    runs_get_mock.return_value = mock_runs_get_result(succeeded=False)
    submitted_run = run_databricks_project(cluster_spec_mock, synchronous=False)
    submitted_run.cancel()
    validate_exit_status(submitted_run.get_status(), RunStatus.FAILED)
    assert runs_cancel_mock.call_count == 1
    # Test that we raise an exception when a blocking Databricks run fails
    runs_get_mock.return_value = mock_runs_get_result(succeeded=False)
    with pytest.raises(mlflow.projects.ExecutionException, match=r"Run \(ID '.+'\) failed"):
        run_databricks_project(cluster_spec_mock, synchronous=True)


def test_get_tracking_uri_for_run(monkeypatch):
    mlflow.set_tracking_uri("http://some-uri")
    assert databricks._get_tracking_uri_for_run() == "http://some-uri"
    mlflow.set_tracking_uri("databricks://profile")
    assert databricks._get_tracking_uri_for_run() == "databricks"
    mlflow.set_tracking_uri(None)
    monkeypatch.setenv(MLFLOW_TRACKING_URI.name, "http://some-uri")
    assert mlflow.tracking._tracking_service.utils.get_tracking_uri() == "http://some-uri"


class MockProfileConfigProvider:
    def __init__(self, profile):
        assert profile == "my-profile"

    def get_config(self):
        return DatabricksConfig.from_password("host", "user", "pass", insecure=False)


def test_databricks_http_request_integration():
    def confirm_request_params(*args, **kwargs):
        headers = DefaultRequestHeaderProvider().request_headers()
        headers["Authorization"] = "Basic dXNlcjpwYXNz"
        assert args == ("PUT", "host/clusters/list")
        assert kwargs == {
            "allow_redirects": True,
            "headers": headers,
            "verify": True,
            "json": {"a": "b"},
            "timeout": 120,
        }
        http_response = mock.MagicMock()
        http_response.status_code = 200
        http_response.text = '{"OK": "woo"}'
        return http_response

    with (
        mock.patch("requests.Session.request", side_effect=confirm_request_params),
        mock.patch(
            "mlflow.utils.databricks_utils.get_databricks_host_creds",
            return_value=MlflowHostCreds(
                host="host", username="user", password="pass", ignore_tls_verification=False
            ),
        ),
    ):
        response = DatabricksJobRunner(databricks_profile_uri=None)._databricks_api_request(
            "/clusters/list", "PUT", json={"a": "b"}
        )
        assert json.loads(response.text) == {"OK": "woo"}


def test_run_databricks_failed():
    text = '{"error_code": "RESOURCE_DOES_NOT_EXIST", "message": "Node type not supported"}'
    with (
        mock.patch("mlflow.utils.databricks_utils.get_databricks_host_creds"),
        mock.patch(
            "mlflow.utils.rest_utils.http_request",
            return_value=mock.Mock(text=text, status_code=400),
        ),
    ):
        runner = DatabricksJobRunner(construct_db_uri_from_profile("profile"))
        with pytest.raises(
            MlflowException, match="RESOURCE_DOES_NOT_EXIST: Node type not supported"
        ):
            runner._run_shell_command_job("/project", "command", {}, {})


def test_run_databricks_generates_valid_mlflow_run_cmd():
    cmd = _get_cluster_mlflow_run_cmd(
        project_dir="my_project_dir",
        run_id="hi",
        entry_point="main",
        parameters={"a": "b"},
        env_manager="conda",
    )
    assert cmd[0] == "mlflow"
    with mock.patch("mlflow.projects.run"):
        invoke_cli_runner(cli.cli, cmd[1:])
```

--------------------------------------------------------------------------------

````
