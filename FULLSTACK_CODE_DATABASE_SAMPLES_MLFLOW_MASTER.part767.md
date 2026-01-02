---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 767
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 767 of 991)

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

---[FILE: test_catboost_model_export.py]---
Location: mlflow-master/tests/catboost/test_catboost_model_export.py

```python
import json
import os
from pathlib import Path
from typing import Any, NamedTuple
from unittest import mock

import catboost as cb
import numpy as np
import pandas as pd
import pytest
import yaml
from packaging.version import Version
from sklearn import datasets
from sklearn.pipeline import Pipeline

import mlflow.catboost
import mlflow.pyfunc.scoring_server as pyfunc_scoring_server
from mlflow import pyfunc
from mlflow.models import Model, ModelSignature
from mlflow.models.utils import _read_example, load_serving_example
from mlflow.store.artifact.s3_artifact_repo import S3ArtifactRepository
from mlflow.tracking.artifact_utils import _download_artifact_from_uri
from mlflow.types import DataType
from mlflow.types.schema import ColSpec, Schema, TensorSpec
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

EXTRA_PYFUNC_SERVING_TEST_ARGS = (
    [] if _is_available_on_pypi("catboost") else ["--env-manager", "local"]
)


class ModelWithData(NamedTuple):
    model: Any
    inference_dataframe: Any


def get_iris():
    iris = datasets.load_iris()
    X = pd.DataFrame(iris.data[:, :2], columns=iris.feature_names[:2])
    y = pd.Series(iris.target)
    return X, y


def read_yaml(path):
    with open(path) as f:
        return yaml.safe_load(f)


MODEL_PARAMS = {"allow_writing_files": False, "iterations": 10}


def iter_models():
    X, y = get_iris()
    model = cb.CatBoost(MODEL_PARAMS).fit(X, y)
    yield ModelWithData(model=model, inference_dataframe=X)

    model = cb.CatBoostClassifier(**MODEL_PARAMS).fit(X, y)
    yield ModelWithData(model=model, inference_dataframe=X)

    model = cb.CatBoostRegressor(**MODEL_PARAMS).fit(X, y)
    yield ModelWithData(model=model, inference_dataframe=X)


@pytest.fixture(
    scope="module",
    params=iter_models(),
    ids=["CatBoost", "CatBoostClassifier", "CatBoostRegressor"],
)
def cb_model(request):
    return request.param


@pytest.fixture
def reg_model():
    model = cb.CatBoostRegressor(**MODEL_PARAMS)
    X, y = get_iris()
    return ModelWithData(model=model.fit(X, y), inference_dataframe=X)


def get_reg_model_signature():
    return ModelSignature(
        inputs=Schema(
            [
                ColSpec(name="sepal length (cm)", type=DataType.double),
                ColSpec(name="sepal width (cm)", type=DataType.double),
            ]
        ),
        outputs=Schema([ColSpec(type=DataType.double)]),
    )


@pytest.fixture
def model_path(tmp_path):
    return os.path.join(tmp_path, "model")


@pytest.fixture
def custom_env(tmp_path):
    conda_env_path = os.path.join(tmp_path, "conda_env.yml")
    _mlflow_conda_env(conda_env_path, additional_pip_deps=["catboost", "pytest"])
    return conda_env_path


@pytest.mark.parametrize("model_type", ["CatBoost", "CatBoostClassifier", "CatBoostRegressor"])
def test_init_model(model_type):
    model = mlflow.catboost._init_model(model_type)
    assert model.__class__.__name__ == model_type


@pytest.mark.skipif(
    Version(cb.__version__) < Version("0.26.0"),
    reason="catboost < 0.26.0 does not support CatBoostRanker",
)
def test_log_catboost_ranker():
    """
    This is a separate test for the CatBoostRanker model.
    It is separate since the ranking task requires a group_id column which makes the code different.
    """
    # the ranking task requires setting a group_id
    # we are creating a dummy group_id here that doesn't make any sense for the Iris dataset,
    # but is ok for testing if the code is running correctly
    X, y = get_iris()
    dummy_group_id = np.arange(len(X)) % 3
    dummy_group_id.sort()

    model = cb.CatBoostRanker(**MODEL_PARAMS, subsample=1.0)
    model.fit(X, y, group_id=dummy_group_id)

    with mlflow.start_run():
        model_info = mlflow.catboost.log_model(model, name="model")
        loaded_model = mlflow.catboost.load_model(model_info.model_uri)
        assert isinstance(loaded_model, cb.CatBoostRanker)
        np.testing.assert_array_almost_equal(model.predict(X), loaded_model.predict(X))


def test_init_model_throws_for_invalid_model_type():
    with pytest.raises(TypeError, match="Invalid model type"):
        mlflow.catboost._init_model("unsupported")


def test_model_save_load(cb_model, model_path):
    model, inference_dataframe = cb_model
    mlflow.catboost.save_model(cb_model=model, path=model_path)

    loaded_model = mlflow.catboost.load_model(model_uri=model_path)
    np.testing.assert_array_almost_equal(
        model.predict(inference_dataframe),
        loaded_model.predict(inference_dataframe),
    )

    loaded_pyfunc = pyfunc.load_model(model_uri=model_path)
    np.testing.assert_array_almost_equal(
        loaded_model.predict(inference_dataframe),
        loaded_pyfunc.predict(inference_dataframe),
    )


def test_log_model_logs_model_type(cb_model):
    with mlflow.start_run():
        artifact_path = "model"
        model_info = mlflow.catboost.log_model(cb_model.model, name=artifact_path)

    flavor_conf = Model.load(model_info.model_uri).flavors["catboost"]
    assert "model_type" in flavor_conf
    assert flavor_conf["model_type"] == cb_model.model.__class__.__name__


# Supported serialization formats:
# https://catboost.ai/docs/concepts/python-reference_catboost_save_model.html
SUPPORTS_DESERIALIZATION = ["cbm", "coreml", "json", "onnx"]
save_formats = SUPPORTS_DESERIALIZATION + ["python", "cpp", "pmml"]


@pytest.mark.allow_infer_pip_requirements_fallback
@pytest.mark.parametrize("save_format", save_formats)
def test_log_model_logs_save_format(reg_model, save_format):
    with mlflow.start_run():
        artifact_path = "model"
        model_info = mlflow.catboost.log_model(
            reg_model.model, name=artifact_path, format=save_format
        )

    flavor_conf = Model.load(model_info.model_uri).flavors["catboost"]
    assert "save_format" in flavor_conf
    assert flavor_conf["save_format"] == save_format

    if save_format in SUPPORTS_DESERIALIZATION:
        mlflow.catboost.load_model(model_info.model_uri)
    else:
        with pytest.raises(cb.CatBoostError, match="deserialization not supported or missing"):
            mlflow.catboost.load_model(model_info.model_uri)


@pytest.mark.parametrize("signature", [None, get_reg_model_signature()])
@pytest.mark.parametrize("input_example", [None, get_iris()[0].head(3)])
def test_signature_and_examples_are_saved_correctly(
    reg_model, model_path, signature, input_example
):
    mlflow.catboost.save_model(
        reg_model.model, model_path, signature=signature, input_example=input_example
    )
    mlflow_model = Model.load(model_path)
    if signature is None and input_example is None:
        assert mlflow_model.signature is None
    else:
        assert mlflow_model.signature == get_reg_model_signature()
    if input_example is None:
        assert mlflow_model.saved_input_example_info is None
    else:
        pd.testing.assert_frame_equal(_read_example(mlflow_model, model_path), input_example)


def test_model_load_from_remote_uri_succeeds(reg_model, model_path, mock_s3_bucket):
    model, inference_dataframe = reg_model
    mlflow.catboost.save_model(cb_model=model, path=model_path)
    artifact_root = f"s3://{mock_s3_bucket}"
    artifact_repo = S3ArtifactRepository(artifact_root)
    artifact_path = "model"
    artifact_repo.log_artifacts(model_path, artifact_path=artifact_path)

    model_uri = artifact_root + "/" + artifact_path
    loaded_model = mlflow.catboost.load_model(model_uri=model_uri)
    np.testing.assert_array_almost_equal(
        model.predict(inference_dataframe),
        loaded_model.predict(inference_dataframe),
    )


def test_log_model(cb_model, tmp_path):
    model, inference_dataframe = cb_model
    with mlflow.start_run():
        artifact_path = "model"
        conda_env = os.path.join(tmp_path, "conda_env.yaml")
        _mlflow_conda_env(conda_env, additional_pip_deps=["catboost"])

        model_info = mlflow.catboost.log_model(model, name=artifact_path, conda_env=conda_env)

        loaded_model = mlflow.catboost.load_model(model_info.model_uri)
        np.testing.assert_array_almost_equal(
            model.predict(inference_dataframe),
            loaded_model.predict(inference_dataframe),
        )

        local_path = _download_artifact_from_uri(model_info.model_uri)
        model_config = Model.load(os.path.join(local_path, "MLmodel"))
        assert pyfunc.FLAVOR_NAME in model_config.flavors
        assert pyfunc.ENV in model_config.flavors[pyfunc.FLAVOR_NAME]
        env_path = model_config.flavors[pyfunc.FLAVOR_NAME][pyfunc.ENV]["conda"]
        assert os.path.exists(os.path.join(local_path, env_path))


def test_log_model_calls_register_model(cb_model, tmp_path):
    artifact_path = "model"
    registered_model_name = "registered_model"
    with (
        mlflow.start_run(),
        mock.patch("mlflow.tracking._model_registry.fluent._register_model"),
    ):
        conda_env_path = os.path.join(tmp_path, "conda_env.yaml")
        _mlflow_conda_env(conda_env_path, additional_pip_deps=["catboost"])
        model_info = mlflow.catboost.log_model(
            cb_model.model,
            name=artifact_path,
            conda_env=conda_env_path,
            registered_model_name=registered_model_name,
        )
        assert_register_model_called_with_local_model_path(
            register_model_mock=mlflow.tracking._model_registry.fluent._register_model,
            model_uri=model_info.model_uri,
            registered_model_name=registered_model_name,
        )


def test_log_model_no_registered_model_name(cb_model, tmp_path):
    with mlflow.start_run(), mock.patch("mlflow.register_model") as register_model_mock:
        artifact_path = "model"
        conda_env_path = os.path.join(tmp_path, "conda_env.yaml")
        _mlflow_conda_env(conda_env_path, additional_pip_deps=["catboost"])
        mlflow.catboost.log_model(cb_model.model, name=artifact_path, conda_env=conda_env_path)
        register_model_mock.assert_not_called()


def test_model_save_persists_specified_conda_env_in_mlflow_model_directory(
    reg_model, model_path, custom_env
):
    mlflow.catboost.save_model(cb_model=reg_model.model, path=model_path, conda_env=custom_env)
    pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
    saved_conda_env_path = os.path.join(model_path, pyfunc_conf[pyfunc.ENV]["conda"])
    assert os.path.exists(saved_conda_env_path)
    assert saved_conda_env_path != custom_env
    assert read_yaml(saved_conda_env_path) == read_yaml(custom_env)


def test_model_save_persists_requirements_in_mlflow_model_directory(
    reg_model, model_path, custom_env
):
    mlflow.catboost.save_model(cb_model=reg_model.model, path=model_path, conda_env=custom_env)

    saved_pip_req_path = os.path.join(model_path, "requirements.txt")
    _compare_conda_env_requirements(custom_env, saved_pip_req_path)


def test_model_save_accepts_conda_env_as_dict(reg_model, model_path):
    conda_env = mlflow.catboost.get_default_conda_env()
    conda_env["dependencies"].append("pytest")
    mlflow.catboost.save_model(cb_model=reg_model.model, path=model_path, conda_env=conda_env)

    pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
    saved_conda_env_path = os.path.join(model_path, pyfunc_conf[pyfunc.ENV]["conda"])
    assert os.path.exists(saved_conda_env_path)
    assert read_yaml(saved_conda_env_path) == conda_env


def test_model_log_persists_specified_conda_env_in_mlflow_model_directory(reg_model, custom_env):
    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.catboost.log_model(
            reg_model.model, name=artifact_path, conda_env=custom_env
        )

    local_path = _download_artifact_from_uri(artifact_uri=model_info.model_uri)
    pyfunc_conf = _get_flavor_configuration(model_path=local_path, flavor_name=pyfunc.FLAVOR_NAME)
    saved_conda_env_path = os.path.join(local_path, pyfunc_conf[pyfunc.ENV]["conda"])
    assert os.path.exists(saved_conda_env_path)
    assert saved_conda_env_path != custom_env
    assert read_yaml(saved_conda_env_path) == read_yaml(custom_env)


def test_model_log_persists_requirements_in_mlflow_model_directory(reg_model, custom_env):
    with mlflow.start_run():
        model_info = mlflow.catboost.log_model(reg_model.model, name="model", conda_env=custom_env)

    local_path = _download_artifact_from_uri(artifact_uri=model_info.model_uri)
    saved_pip_req_path = os.path.join(local_path, "requirements.txt")
    _compare_conda_env_requirements(custom_env, saved_pip_req_path)


def test_log_model_with_pip_requirements(reg_model, tmp_path):
    expected_mlflow_version = _mlflow_major_version_string()
    # Path to a requirements file
    req_file = tmp_path.joinpath("requirements.txt")
    req_file.write_text("a")
    with mlflow.start_run():
        model_info = mlflow.catboost.log_model(
            reg_model.model, name="model", pip_requirements=str(req_file)
        )
        _assert_pip_requirements(model_info.model_uri, [expected_mlflow_version, "a"], strict=True)

    # List of requirements
    with mlflow.start_run():
        model_info = mlflow.catboost.log_model(
            reg_model.model, name="model", pip_requirements=[f"-r {req_file}", "b"]
        )
        _assert_pip_requirements(
            model_info.model_uri, [expected_mlflow_version, "a", "b"], strict=True
        )

    # Constraints file
    with mlflow.start_run():
        model_info = mlflow.catboost.log_model(
            reg_model.model, name="model", pip_requirements=[f"-c {req_file}", "b"]
        )
        _assert_pip_requirements(
            model_info.model_uri,
            [expected_mlflow_version, "b", "-c constraints.txt"],
            ["a"],
            strict=True,
        )


def test_log_model_with_extra_pip_requirements(reg_model, tmp_path):
    expected_mlflow_version = _mlflow_major_version_string()
    default_reqs = mlflow.catboost.get_default_pip_requirements()

    # Path to a requirements file
    req_file = tmp_path.joinpath("requirements.txt")
    req_file.write_text("a")
    with mlflow.start_run():
        model_info = mlflow.catboost.log_model(
            reg_model.model, name="model", extra_pip_requirements=str(req_file)
        )
        _assert_pip_requirements(
            model_info.model_uri, [expected_mlflow_version, *default_reqs, "a"]
        )

    # List of requirements
    with mlflow.start_run():
        model_info = mlflow.catboost.log_model(
            reg_model.model, name="model", extra_pip_requirements=[f"-r {req_file}", "b"]
        )
        _assert_pip_requirements(
            model_info.model_uri, [expected_mlflow_version, *default_reqs, "a", "b"]
        )

    # Constraints file
    with mlflow.start_run():
        model_info = mlflow.catboost.log_model(
            reg_model.model, name="model", extra_pip_requirements=[f"-c {req_file}", "b"]
        )
        _assert_pip_requirements(
            model_info.model_uri,
            [expected_mlflow_version, *default_reqs, "b", "-c constraints.txt"],
            ["a"],
        )


def test_model_save_without_specified_conda_env_uses_default_env_with_expected_dependencies(
    reg_model, model_path
):
    mlflow.catboost.save_model(reg_model.model, model_path)
    _assert_pip_requirements(model_path, mlflow.catboost.get_default_pip_requirements())


def test_model_log_without_specified_conda_env_uses_default_env_with_expected_dependencies(
    reg_model,
):
    with mlflow.start_run():
        model_info = mlflow.catboost.log_model(reg_model.model, name="model")

    _assert_pip_requirements(model_info.model_uri, mlflow.catboost.get_default_pip_requirements())


def test_pyfunc_serve_and_score(reg_model):
    model, inference_dataframe = reg_model
    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.catboost.log_model(
            model, name=artifact_path, input_example=inference_dataframe
        )

    inference_payload = load_serving_example(model_info.model_uri)
    resp = pyfunc_serve_and_score_model(
        model_info.model_uri,
        data=inference_payload,
        content_type=pyfunc_scoring_server.CONTENT_TYPE_JSON,
        extra_args=EXTRA_PYFUNC_SERVING_TEST_ARGS,
    )
    scores = pd.DataFrame(
        data=json.loads(resp.content.decode("utf-8"))["predictions"]
    ).values.squeeze()
    np.testing.assert_array_almost_equal(scores, model.predict(inference_dataframe))


def test_pyfunc_serve_and_score_sklearn(reg_model):
    model, inference_dataframe = reg_model
    model = Pipeline([("model", reg_model.model)])

    with mlflow.start_run():
        model_info = mlflow.sklearn.log_model(
            model, name="model", input_example=inference_dataframe.head(3)
        )

    inference_payload = load_serving_example(model_info.model_uri)
    resp = pyfunc_serve_and_score_model(
        model_info.model_uri,
        inference_payload,
        pyfunc_scoring_server.CONTENT_TYPE_JSON,
        extra_args=EXTRA_PYFUNC_SERVING_TEST_ARGS,
    )
    scores = pd.DataFrame(
        data=json.loads(resp.content.decode("utf-8"))["predictions"]
    ).values.squeeze()
    np.testing.assert_array_almost_equal(scores, model.predict(inference_dataframe.head(3)))


def test_log_model_with_code_paths(cb_model):
    artifact_path = "model"
    with (
        mlflow.start_run(),
        mock.patch("mlflow.catboost._add_code_from_conf_to_system_path") as add_mock,
    ):
        model_info = mlflow.catboost.log_model(
            cb_model.model, name=artifact_path, code_paths=[__file__]
        )
        _compare_logged_code_paths(__file__, model_info.model_uri, mlflow.catboost.FLAVOR_NAME)
        mlflow.catboost.load_model(model_uri=model_info.model_uri)
        add_mock.assert_called()


def test_virtualenv_subfield_points_to_correct_path(cb_model, model_path):
    mlflow.catboost.save_model(cb_model.model, path=model_path)
    pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
    python_env_path = Path(model_path, pyfunc_conf[pyfunc.ENV]["virtualenv"])
    assert python_env_path.exists()
    assert python_env_path.is_file()


def test_model_save_load_with_metadata(cb_model, model_path):
    mlflow.catboost.save_model(
        cb_model.model, path=model_path, metadata={"metadata_key": "metadata_value"}
    )

    reloaded_model = mlflow.pyfunc.load_model(model_uri=model_path)
    assert reloaded_model.metadata.metadata["metadata_key"] == "metadata_value"


def test_model_log_with_metadata(cb_model):
    with mlflow.start_run():
        model_info = mlflow.catboost.log_model(
            cb_model.model, name="model", metadata={"metadata_key": "metadata_value"}
        )

    reloaded_model = mlflow.pyfunc.load_model(model_uri=model_info.model_uri)
    assert reloaded_model.metadata.metadata["metadata_key"] == "metadata_value"


def test_model_log_with_signature_inference(cb_model):
    artifact_path = "model"
    example = cb_model.inference_dataframe.head(3)

    with mlflow.start_run():
        model_info = mlflow.catboost.log_model(
            cb_model.model, name=artifact_path, input_example=example
        )

    loaded_model_info = Model.load(model_info.model_uri)
    assert loaded_model_info.signature.inputs == Schema(
        [
            ColSpec(name="sepal length (cm)", type=DataType.double),
            ColSpec(name="sepal width (cm)", type=DataType.double),
        ]
    )
    assert loaded_model_info.signature.outputs in [
        # when the model output is a 1D numpy array, it is cast into a `ColSpec`
        Schema([ColSpec(type=DataType.double)]),
        # when the model output is a higher dimensional numpy array, it remains a `TensorSpec`
        Schema([TensorSpec(np.dtype("int64"), (-1, 1))]),
    ]
```

--------------------------------------------------------------------------------

---[FILE: test_autolog.py]---
Location: mlflow-master/tests/claude_code/test_autolog.py

```python
import sys
from unittest.mock import MagicMock, patch

import pytest

import mlflow.anthropic
from mlflow.anthropic.autolog import patched_claude_sdk_init


def test_anthropic_autolog_without_claude_sdk():
    # Ensure claude_agent_sdk is not in sys.modules
    sys.modules.pop("claude_agent_sdk", None)

    with (
        patch.dict(
            "sys.modules",
            {
                "anthropic": MagicMock(__version__="0.35.0"),
                "anthropic.resources": MagicMock(Messages=MagicMock, AsyncMessages=MagicMock),
            },
        ),
        patch("mlflow.anthropic.safe_patch"),
    ):
        # Should not raise exception when claude_agent_sdk is not installed
        mlflow.anthropic.autolog()


def test_patched_claude_sdk_init_with_options():
    original_init = MagicMock()

    mock_options = MagicMock()
    mock_options.hooks = {"Stop": ["a"]}
    mock_self = MagicMock()

    # Mock claude_agent_sdk imports
    mock_hook_matcher = MagicMock()
    with patch.dict(
        "sys.modules",
        {
            "claude_agent_sdk": MagicMock(
                ClaudeAgentOptions=MagicMock, HookMatcher=mock_hook_matcher
            )
        },
    ):
        patched_claude_sdk_init(original_init, mock_self, mock_options)

    # Verify original_init was called
    original_init.assert_called_once_with(mock_self, mock_options)
    # Verify Stop hook was appended
    assert len(mock_options.hooks["Stop"]) == 2


@pytest.mark.asyncio
async def test_sdk_hook_handler_when_disabled():
    from mlflow.claude_code.hooks import sdk_stop_hook_handler

    with (
        patch("mlflow.utils.autologging_utils.autologging_is_disabled", return_value=True),
        patch("mlflow.claude_code.hooks._process_stop_hook") as mock_process,
    ):
        result = await sdk_stop_hook_handler(
            input_data={"session_id": "test", "transcript_path": "/fake/path"},
            tool_use_id=None,
            context=None,
        )
        # Should return early without calling _process_stop_hook
        mock_process.assert_not_called()
        assert result == {"continue": True}
```

--------------------------------------------------------------------------------

---[FILE: test_cli.py]---
Location: mlflow-master/tests/claude_code/test_cli.py

```python
import pytest
from click.testing import CliRunner

from mlflow.claude_code.cli import commands


@pytest.fixture
def runner():
    """Provide a CLI runner for tests."""
    return CliRunner()


def test_claude_help_command(runner):
    result = runner.invoke(commands, ["--help"])
    assert result.exit_code == 0
    assert "Commands for autologging with MLflow" in result.output
    assert "claude" in result.output


def test_trace_command_help(runner):
    result = runner.invoke(commands, ["claude", "--help"])
    assert result.exit_code == 0
    assert "Set up Claude Code tracing" in result.output
    assert "--tracking-uri" in result.output
    assert "--experiment-id" in result.output
    assert "--disable" in result.output
    assert "--status" in result.output


def test_trace_status_with_no_config(runner):
    with runner.isolated_filesystem():
        result = runner.invoke(commands, ["claude", "--status"])
        assert result.exit_code == 0
        assert "❌ Claude tracing is not enabled" in result.output


def test_trace_disable_with_no_config(runner):
    with runner.isolated_filesystem():
        result = runner.invoke(commands, ["claude", "--disable"])
        assert result.exit_code == 0
        # Should handle gracefully even if no config exists
```

--------------------------------------------------------------------------------

---[FILE: test_config.py]---
Location: mlflow-master/tests/claude_code/test_config.py

```python
import json

import pytest

from mlflow.claude_code.config import (
    MLFLOW_TRACING_ENABLED,
    get_env_var,
    get_tracing_status,
    load_claude_config,
    save_claude_config,
    setup_environment_config,
)


@pytest.fixture
def temp_settings_path(tmp_path):
    """Provide a temporary settings.json path for tests."""
    return tmp_path / "settings.json"


def test_load_claude_config_valid_json(temp_settings_path):
    config_data = {"tools": {"computer_20241022": {"name": "computer"}}}
    with open(temp_settings_path, "w") as f:
        json.dump(config_data, f)

    result = load_claude_config(temp_settings_path)
    assert result == config_data


def test_load_claude_config_missing_file(tmp_path):
    non_existent_path = tmp_path / "non_existent.json"
    result = load_claude_config(non_existent_path)
    assert result == {}


def test_load_claude_config_invalid_json(temp_settings_path):
    with open(temp_settings_path, "w") as f:
        f.write("invalid json content")

    result = load_claude_config(temp_settings_path)
    assert result == {}


def test_save_claude_config_creates_file(temp_settings_path):
    config_data = {"test": "value"}
    save_claude_config(temp_settings_path, config_data)

    assert temp_settings_path.exists()
    saved_data = json.loads(temp_settings_path.read_text())
    assert saved_data == config_data


def test_save_claude_config_creates_directory(tmp_path):
    nested_path = tmp_path / "nested" / "dir" / "settings.json"
    config_data = {"test": "value"}

    save_claude_config(nested_path, config_data)

    assert nested_path.exists()
    saved_data = json.loads(nested_path.read_text())
    assert saved_data == config_data


def test_get_env_var_from_os_environment(monkeypatch):
    test_value = "test_os_value"
    monkeypatch.setenv(MLFLOW_TRACING_ENABLED, test_value)

    result = get_env_var(MLFLOW_TRACING_ENABLED, "default")
    assert result == test_value


def test_get_env_var_from_claude_settings_fallback(tmp_path, monkeypatch):
    # Ensure OS env var is not set
    monkeypatch.delenv(MLFLOW_TRACING_ENABLED, raising=False)

    # Create settings file with environment variable
    config_data = {"environment": {MLFLOW_TRACING_ENABLED: "claude_value"}}
    claude_settings_path = tmp_path / ".claude" / "settings.json"
    claude_settings_path.parent.mkdir(parents=True, exist_ok=True)
    with open(claude_settings_path, "w") as f:
        json.dump(config_data, f)

    # Change to the temp directory so .claude/settings.json is found
    monkeypatch.chdir(tmp_path)
    result = get_env_var(MLFLOW_TRACING_ENABLED, "default")
    assert result == "claude_value"


def test_get_env_var_default_when_not_found(tmp_path, monkeypatch):
    # Ensure OS env var is not set
    monkeypatch.delenv(MLFLOW_TRACING_ENABLED, raising=False)

    # Create empty settings file in .claude directory
    claude_settings_path = tmp_path / ".claude" / "settings.json"
    claude_settings_path.parent.mkdir(parents=True, exist_ok=True)
    with open(claude_settings_path, "w") as f:
        json.dump({}, f)

    # Change to temp directory so .claude/settings.json is found
    monkeypatch.chdir(tmp_path)
    result = get_env_var(MLFLOW_TRACING_ENABLED, "default_value")
    assert result == "default_value"


def test_get_tracing_status_enabled(temp_settings_path):
    # Create settings with tracing enabled
    config_data = {"environment": {MLFLOW_TRACING_ENABLED: "true"}}
    with open(temp_settings_path, "w") as f:
        json.dump(config_data, f)

    status = get_tracing_status(temp_settings_path)
    assert status.enabled is True
    assert hasattr(status, "tracking_uri")


def test_get_tracing_status_disabled(temp_settings_path):
    # Create settings with tracing disabled
    config_data = {"environment": {MLFLOW_TRACING_ENABLED: "false"}}
    with open(temp_settings_path, "w") as f:
        json.dump(config_data, f)

    status = get_tracing_status(temp_settings_path)
    assert status.enabled is False


def test_get_tracing_status_no_config(tmp_path):
    non_existent_path = tmp_path / "missing.json"
    status = get_tracing_status(non_existent_path)
    assert status.enabled is False
    assert status.reason == "No configuration found"


def test_setup_environment_config_new_file(temp_settings_path):
    tracking_uri = "test://localhost"
    experiment_id = "123"

    setup_environment_config(temp_settings_path, tracking_uri, experiment_id)

    # Verify file was created
    assert temp_settings_path.exists()

    # Verify configuration contents
    config = json.loads(temp_settings_path.read_text())

    env_vars = config["environment"]
    assert env_vars[MLFLOW_TRACING_ENABLED] == "true"
    assert env_vars["MLFLOW_TRACKING_URI"] == tracking_uri
    assert env_vars["MLFLOW_EXPERIMENT_ID"] == experiment_id


def test_setup_environment_config_experiment_id_precedence(temp_settings_path):
    # Create existing config with different experiment ID
    existing_config = {
        "environment": {
            MLFLOW_TRACING_ENABLED: "true",
            "MLFLOW_EXPERIMENT_ID": "old_id",
            "MLFLOW_TRACKING_URI": "old_uri",
        }
    }
    with open(temp_settings_path, "w") as f:
        json.dump(existing_config, f)

    new_tracking_uri = "new://localhost"
    new_experiment_id = "new_id"

    setup_environment_config(temp_settings_path, new_tracking_uri, new_experiment_id)

    # Verify configuration was updated
    config = json.loads(temp_settings_path.read_text())

    env_vars = config["environment"]
    assert env_vars[MLFLOW_TRACING_ENABLED] == "true"
    assert env_vars["MLFLOW_TRACKING_URI"] == new_tracking_uri
    assert env_vars["MLFLOW_EXPERIMENT_ID"] == new_experiment_id
```

--------------------------------------------------------------------------------

---[FILE: test_tracing.py]---
Location: mlflow-master/tests/claude_code/test_tracing.py

```python
import importlib
import json
import logging
from pathlib import Path

import pytest

import mlflow
import mlflow.claude_code.tracing as tracing_module
from mlflow.claude_code.tracing import (
    CLAUDE_TRACING_LEVEL,
    get_hook_response,
    parse_timestamp_to_ns,
    process_transcript,
    setup_logging,
)
from mlflow.entities.span import SpanType
from mlflow.tracing.constant import TraceMetadataKey

# ============================================================================
# TIMESTAMP PARSING TESTS
# ============================================================================


def test_parse_timestamp_to_ns_iso_string():
    iso_timestamp = "2024-01-15T10:30:45.123456Z"
    result = parse_timestamp_to_ns(iso_timestamp)

    # Verify it returns an integer (nanoseconds)
    assert isinstance(result, int)
    assert result > 0


def test_parse_timestamp_to_ns_unix_seconds():
    unix_timestamp = 1705312245.123456
    result = parse_timestamp_to_ns(unix_timestamp)

    # Should convert seconds to nanoseconds
    expected = int(unix_timestamp * 1_000_000_000)
    assert result == expected


def test_parse_timestamp_to_ns_large_number():
    large_timestamp = 1705312245123
    result = parse_timestamp_to_ns(large_timestamp)

    # Function treats large numbers as seconds and converts to nanoseconds
    # Just verify we get a reasonable nanosecond value
    assert isinstance(result, int)
    assert result > 0


# ============================================================================
# LOGGING TESTS
# ============================================================================


def test_setup_logging_creates_logger(monkeypatch, tmp_path):
    monkeypatch.chdir(tmp_path)
    logger = setup_logging()

    # Verify logger was created
    assert logger is not None
    assert logger.name == "mlflow.claude_code.tracing"

    # Verify log directory was created
    log_dir = tmp_path / ".claude" / "mlflow"
    assert log_dir.exists()
    assert log_dir.is_dir()


def test_custom_logging_level():
    setup_logging()

    assert CLAUDE_TRACING_LEVEL > logging.INFO
    assert CLAUDE_TRACING_LEVEL < logging.WARNING
    assert logging.getLevelName(CLAUDE_TRACING_LEVEL) == "CLAUDE_TRACING"


def test_get_logger_lazy_initialization(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    monkeypatch.chdir(tmp_path)

    # Force reload to reset the module state
    importlib.reload(tracing_module)

    log_dir = tmp_path / ".claude" / "mlflow"

    # Before calling get_logger(), the log directory should NOT exist
    assert not log_dir.exists()

    # Call get_logger() for the first time - this should trigger initialization
    logger1 = tracing_module.get_logger()

    # After calling get_logger(), the log directory SHOULD exist
    assert log_dir.exists()
    assert log_dir.is_dir()

    # Verify logger was created properly
    assert logger1 is not None
    assert logger1.name == "mlflow.claude_code.tracing"

    # Call get_logger() again - should return the same logger instance
    logger2 = tracing_module.get_logger()
    assert logger2 is logger1


# ============================================================================
# HOOK RESPONSE TESTS
# ============================================================================


def test_get_hook_response_success():
    response = get_hook_response()
    assert response == {"continue": True}


def test_get_hook_response_with_error():
    response = get_hook_response(error="Test error")
    assert response == {"continue": False, "stopReason": "Test error"}


def test_get_hook_response_with_additional_fields():
    response = get_hook_response(custom_field="value")
    assert response == {"continue": True, "custom_field": "value"}


# ============================================================================
# INTEGRATION TESTS
# ============================================================================

# Sample Claude Code transcript for testing
DUMMY_TRANSCRIPT = [
    {
        "type": "user",
        "message": {"role": "user", "content": "What is 2 + 2?"},
        "timestamp": "2025-01-15T10:00:00.000Z",
        "sessionId": "test-session-123",
    },
    {
        "type": "assistant",
        "message": {
            "role": "assistant",
            "content": [{"type": "text", "text": "Let me calculate that for you."}],
        },
        "timestamp": "2025-01-15T10:00:01.000Z",
    },
    {
        "type": "assistant",
        "message": {
            "role": "assistant",
            "content": [
                {
                    "type": "tool_use",
                    "id": "tool_123",
                    "name": "Bash",
                    "input": {"command": "echo $((2 + 2))"},
                }
            ],
        },
        "timestamp": "2025-01-15T10:00:02.000Z",
    },
    {
        "type": "user",
        "message": {
            "role": "user",
            "content": [{"type": "tool_result", "tool_use_id": "tool_123", "content": "4"}],
        },
        "timestamp": "2025-01-15T10:00:03.000Z",
    },
    {
        "type": "assistant",
        "message": {
            "role": "assistant",
            "content": [{"type": "text", "text": "The answer is 4."}],
        },
        "timestamp": "2025-01-15T10:00:04.000Z",
    },
]


@pytest.fixture
def mock_transcript_file(tmp_path):
    transcript_path = tmp_path / "transcript.jsonl"
    with open(transcript_path, "w") as f:
        for entry in DUMMY_TRANSCRIPT:
            f.write(json.dumps(entry) + "\n")
    return str(transcript_path)


def test_process_transript_creates_trace(mock_transcript_file):
    trace = process_transcript(mock_transcript_file, "test-session-123")

    # Verify trace was created
    assert trace is not None

    # Verify trace has spans
    spans = list(trace.search_spans())
    assert len(spans) > 0

    # Verify root span and metadata
    root_span = trace.data.spans[0]
    assert root_span.name == "claude_code_conversation"
    assert root_span.span_type == SpanType.AGENT
    assert trace.info.trace_metadata.get("mlflow.trace.session") == "test-session-123"


def test_process_transcript_creates_spans(mock_transcript_file):
    trace = process_transcript(mock_transcript_file, "test-session-123")

    assert trace is not None

    # Verify trace has spans
    spans = list(trace.search_spans())
    assert len(spans) > 0

    # Find LLM and tool spans
    llm_spans = [s for s in spans if s.span_type == SpanType.LLM]
    tool_spans = [s for s in spans if s.span_type == SpanType.TOOL]

    assert len(llm_spans) == 2
    assert len(tool_spans) == 1

    # Verify tool span has proper attributes
    tool_span = tool_spans[0]
    assert tool_span.name == "tool_Bash"


def test_process_transcript_returns_none_for_nonexistent_file():
    result = process_transcript("/nonexistent/path/transcript.jsonl", "test-session-123")
    assert result is None


def test_process_transcript_links_trace_to_run(mock_transcript_file):
    with mlflow.start_run() as run:
        trace = process_transcript(mock_transcript_file, "test-session-123")

        assert trace is not None
        assert trace.info.trace_metadata.get(TraceMetadataKey.SOURCE_RUN) == run.info.run_id
```

--------------------------------------------------------------------------------

````
