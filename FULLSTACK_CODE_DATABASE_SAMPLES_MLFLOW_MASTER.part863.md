---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 863
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 863 of 991)

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

---[FILE: test_wheeled_model.py]---
Location: mlflow-master/tests/models/test_wheeled_model.py

```python
import os
import random
import re
from io import BytesIO
from typing import Any, NamedTuple
from unittest import mock

import numpy as np
import pandas as pd
import pytest
import sklearn.neighbors as knn
import yaml
from sklearn import datasets

import mlflow
import mlflow.pyfunc.scoring_server as pyfunc_scoring_server
from mlflow.exceptions import MlflowException
from mlflow.models.model import METADATA_FILES
from mlflow.models.utils import load_serving_example
from mlflow.models.wheeled_model import _ORIGINAL_REQ_FILE_NAME, _WHEELS_FOLDER_NAME, WheeledModel
from mlflow.pyfunc.model import MLMODEL_FILE_NAME, Model
from mlflow.store.artifact.utils.models import _improper_model_uri_msg
from mlflow.tracking.artifact_utils import _download_artifact_from_uri
from mlflow.utils.environment import (
    _CONDA_ENV_FILE_NAME,
    _REQUIREMENTS_FILE_NAME,
    _is_pip_deps,
    _mlflow_conda_env,
)

from tests.helper_functions import (
    _is_available_on_pypi,
    _mlflow_major_version_string,
    pyfunc_serve_and_score_model,
)

EXTRA_PYFUNC_SERVING_TEST_ARGS = (
    [] if _is_available_on_pypi("scikit-learn", module="sklearn") else ["--env-manager", "local"]
)


class ModelWithData(NamedTuple):
    model: Any
    inference_data: Any


@pytest.fixture(scope="module")
def sklearn_knn_model():
    iris = datasets.load_iris()
    X = iris.data[:, :2]  # we only take the first two features.
    y = iris.target
    knn_model = knn.KNeighborsClassifier()
    knn_model.fit(X, y)
    return ModelWithData(model=knn_model, inference_data=X)


def random_int(lo=1, hi=1000000000):
    return random.randint(int(lo), int(hi))


def _get_list_from_file(path):
    with open(path) as file:
        return file.read().splitlines()


def _get_pip_requirements_list(path):
    return _get_list_from_file(path)


def get_pip_requirements_from_conda_file(conda_env_path):
    with open(conda_env_path) as f:
        conda_env = yaml.safe_load(f)

    conda_pip_requirements_list = []
    dependencies = conda_env.get("dependencies")

    for dependency in dependencies:
        if _is_pip_deps(dependency):
            conda_pip_requirements_list = dependency["pip"]

    return conda_pip_requirements_list


def validate_updated_model_file(original_model_config, wheeled_model_config):
    differing_keys = {"run_id", "utc_time_created", "model_uuid", "artifact_path"}
    ignore_keys = {"model_id"}

    # Compare wheeled model configs with original model config (MLModel files)
    for key in original_model_config.keys() - ignore_keys:
        if key not in differing_keys:
            assert wheeled_model_config[key] == original_model_config[key]
        else:
            assert wheeled_model_config[key] != original_model_config[key]

    # Wheeled model key should only exist in wheeled_model_config
    assert wheeled_model_config.get(_WHEELS_FOLDER_NAME, None)
    assert not original_model_config.get(_WHEELS_FOLDER_NAME, None)

    # Every key in the original config should also exist in the wheeled config.
    for key in original_model_config:
        assert key in wheeled_model_config


def validate_updated_conda_dependencies(original_model_path, wheeled_model_path):
    # Check if conda.yaml files of the original model and wheeled model are the same
    # excluding the dependencies
    wheeled_model_path = os.path.join(wheeled_model_path, _CONDA_ENV_FILE_NAME)
    original_conda_env_path = os.path.join(original_model_path, _CONDA_ENV_FILE_NAME)

    with (
        open(wheeled_model_path) as wheeled_conda_env,
        open(original_conda_env_path) as original_conda_env,
    ):
        wheeled_conda_env = yaml.safe_load(wheeled_conda_env)
        original_conda_env = yaml.safe_load(original_conda_env)

        for key in wheeled_conda_env:
            if key != "dependencies":
                assert wheeled_conda_env[key] == original_conda_env[key]
            else:
                assert wheeled_conda_env[key] != original_conda_env[key]


def validate_wheeled_dependencies(wheeled_model_path):
    # Check if conda.yaml and requirements.txt are consistent
    pip_requirements_path = os.path.join(wheeled_model_path, _REQUIREMENTS_FILE_NAME)
    pip_requirements_list = _get_pip_requirements_list(pip_requirements_path)
    conda_pip_requirements_list = get_pip_requirements_from_conda_file(
        os.path.join(wheeled_model_path, _CONDA_ENV_FILE_NAME)
    )

    pip_requirements_list.sort()
    conda_pip_requirements_list.sort()
    assert pip_requirements_list == conda_pip_requirements_list

    # Check if requirements.txt and wheels directory are consistent
    wheels_dir = os.path.join(wheeled_model_path, _WHEELS_FOLDER_NAME)
    wheels_list = []
    for wheel_file in os.listdir(wheels_dir):
        if wheel_file.endswith(".whl"):
            relative_wheel_path = os.path.join(_WHEELS_FOLDER_NAME, wheel_file)
            wheels_list.append(relative_wheel_path)

    wheels_list.sort()
    assert wheels_list == pip_requirements_list


def test_model_log_load(tmp_path, sklearn_knn_model):
    model_name = f"wheels-test-{random_int()}"
    model_uri = f"models:/{model_name}/1"
    wheeled_model_uri = f"models:/{model_name}/2"
    artifact_path = "model"

    # Log a model
    with mlflow.start_run():
        mlflow.sklearn.log_model(
            sklearn_knn_model.model,
            name=artifact_path,
            registered_model_name=model_name,
        )
        model_path = _download_artifact_from_uri(model_uri, tmp_path)
        original_model_config = Model.load(os.path.join(model_path, MLMODEL_FILE_NAME)).__dict__

    # Re-log with wheels
    with mlflow.start_run():
        WheeledModel.log_model(model_uri=model_uri)
        wheeled_model_path = _download_artifact_from_uri(wheeled_model_uri)
        wheeled_model_run_id = mlflow.tracking.fluent._get_or_start_run().info.run_id
        wheeled_model_config = Model.load(
            os.path.join(wheeled_model_path, MLMODEL_FILE_NAME)
        ).__dict__

    validate_updated_model_file(original_model_config, wheeled_model_config)
    # Assert correct run_id
    assert wheeled_model_config["run_id"] == wheeled_model_run_id

    validate_updated_conda_dependencies(model_path, wheeled_model_path)

    validate_wheeled_dependencies(wheeled_model_path)


def test_model_save_load(tmp_path, sklearn_knn_model):
    model_name = f"wheels-test-{random_int()}"
    model_uri = f"models:/{model_name}/1"
    artifact_path = "model"
    model_download_path = os.path.join(tmp_path, "m")
    wheeled_model_path = os.path.join(tmp_path, "wm")

    os.mkdir(model_download_path)
    # Log a model
    with mlflow.start_run():
        mlflow.sklearn.log_model(
            sklearn_knn_model.model,
            name=artifact_path,
            registered_model_name=model_name,
        )
        model_path = _download_artifact_from_uri(model_uri, model_download_path)
        original_model_config = Model.load(os.path.join(model_path, MLMODEL_FILE_NAME)).__dict__

    # Save with wheels
    with mlflow.start_run():
        wheeled_model = WheeledModel(model_uri=model_uri)
        wheeled_model_data = wheeled_model.save_model(path=wheeled_model_path)
        wheeled_model_config = Model.load(os.path.join(wheeled_model_path, MLMODEL_FILE_NAME))
        wheeled_model_config_dict = wheeled_model_config.__dict__

        # Check to see if python model returned is the same as the MLModel file
        assert wheeled_model_config == wheeled_model_data

    validate_updated_model_file(original_model_config, wheeled_model_config_dict)
    validate_updated_conda_dependencies(model_path, wheeled_model_path)
    validate_wheeled_dependencies(wheeled_model_path)


def test_logging_and_saving_wheeled_model_throws(tmp_path, sklearn_knn_model):
    model_name = f"wheels-test-{random_int()}"
    model_uri = f"models:/{model_name}/1"
    wheeled_model_uri = f"models:/{model_name}/2"
    artifact_path = "model"

    # Log a model
    with mlflow.start_run():
        mlflow.sklearn.log_model(
            sklearn_knn_model.model,
            name=artifact_path,
            registered_model_name=model_name,
        )

    # Re-log with wheels
    with mlflow.start_run():
        WheeledModel.log_model(
            model_uri=model_uri,
        )

    match = "Model libraries are already added"

    # Log wheeled model
    with pytest.raises(MlflowException, match=re.escape(match)):
        with mlflow.start_run():
            WheeledModel.log_model(
                model_uri=wheeled_model_uri,
            )

    # Saved a wheeled model
    saved_model_path = os.path.join(tmp_path, "test")
    with pytest.raises(MlflowException, match=re.escape(match)):
        with mlflow.start_run():
            WheeledModel(wheeled_model_uri).save_model(saved_model_path)


def test_log_model_with_non_model_uri():
    model_uri = "runs:/beefe0b6b5bd4acf9938244cdc006b64/model"

    # Log with wheels
    with pytest.raises(MlflowException, match=_improper_model_uri_msg(model_uri)):
        with mlflow.start_run():
            WheeledModel.log_model(
                model_uri=model_uri,
            )

    # Save with wheels
    with pytest.raises(MlflowException, match=_improper_model_uri_msg(model_uri)):
        with mlflow.start_run():
            WheeledModel(model_uri)


def test_create_pip_requirement(tmp_path):
    expected_mlflow_version = _mlflow_major_version_string()
    model_name = f"wheels-test-{random_int()}"
    model_uri = f"models:/{model_name}/1"
    conda_env_path = os.path.join(tmp_path, "conda.yaml")
    pip_reqs_path = os.path.join(tmp_path, "requirements.txt")

    wm = WheeledModel(model_uri)

    expected_pip_deps = [expected_mlflow_version, "cloudpickle==2.1.0", "psutil==5.8.0"]
    _mlflow_conda_env(
        path=conda_env_path, additional_pip_deps=expected_pip_deps, install_mlflow=False
    )
    wm._create_pip_requirement(conda_env_path, pip_reqs_path)
    with open(pip_reqs_path) as f:
        pip_reqs = [x.strip() for x in f]
    assert expected_pip_deps.sort() == pip_reqs.sort()


def test_update_conda_env_only_updates_pip_deps(tmp_path):
    expected_mlflow_version = _mlflow_major_version_string()
    model_name = f"wheels-test-{random_int()}"
    model_uri = f"models:/{model_name}/1"
    conda_env_path = os.path.join(tmp_path, "conda.yaml")
    pip_deps = [expected_mlflow_version, "cloudpickle==2.1.0", "psutil==5.8.0"]
    new_pip_deps = ["wheels/mlflow", "wheels/cloudpickle", "wheels/psutil"]

    wm = WheeledModel(model_uri)
    additional_conda_deps = ["add_conda_deps"]
    additional_conda_channels = ["add_conda_channels"]

    _mlflow_conda_env(
        conda_env_path,
        additional_conda_deps,
        pip_deps,
        additional_conda_channels,
        install_mlflow=False,
    )
    with open(conda_env_path) as f:
        old_conda_yaml = yaml.safe_load(f)
    wm._update_conda_env(new_pip_deps, conda_env_path)
    with open(conda_env_path) as f:
        new_conda_yaml = yaml.safe_load(f)
    assert old_conda_yaml.get("name") == new_conda_yaml.get("name")
    assert old_conda_yaml.get("channels") == new_conda_yaml.get("channels")
    for old_item, new_item in zip(
        old_conda_yaml.get("dependencies"), new_conda_yaml.get("dependencies")
    ):
        if isinstance(old_item, str):
            assert old_item == new_item
        if isinstance(old_item, dict):
            assert old_item.get("pip") == pip_deps
        if isinstance(new_item, dict):
            assert new_item.get("pip") == new_pip_deps


def test_serving_wheeled_model(sklearn_knn_model):
    model_name = f"wheels-test-{random_int()}"
    model_uri = f"models:/{model_name}/1"
    wheeled_model_uri = f"models:/{model_name}/2"
    artifact_path = "model"
    (model, inference_data) = sklearn_knn_model

    # Log a model
    with mlflow.start_run():
        model_info = mlflow.sklearn.log_model(
            model,
            name=artifact_path,
            registered_model_name=model_name,
            input_example=pd.DataFrame(inference_data),
        )

    # Re-log with wheels
    with mlflow.start_run():
        WheeledModel.log_model(model_uri=model_uri)

    inference_payload = load_serving_example(model_info.model_uri)
    resp = pyfunc_serve_and_score_model(
        wheeled_model_uri,
        data=inference_payload,
        content_type=pyfunc_scoring_server.CONTENT_TYPE_JSON,
        extra_args=EXTRA_PYFUNC_SERVING_TEST_ARGS,
    )
    scores = pd.read_json(BytesIO(resp.content), orient="records").values.squeeze()
    np.testing.assert_array_almost_equal(scores, model.predict(inference_data))


def test_wheel_download_works(tmp_path):
    simple_dependency = "cloudpickle"
    requirements_file = os.path.join(tmp_path, "req.txt")
    wheel_dir = os.path.join(tmp_path, "wheels")
    with open(requirements_file, "w") as req_file:
        req_file.write(simple_dependency)

    WheeledModel._download_wheels(requirements_file, wheel_dir)
    wheels = os.listdir(wheel_dir)
    assert len(wheels) == 1  # Only a single wheel is downloaded
    assert wheels[0].endswith(".whl")  # Type is wheel
    assert simple_dependency in wheels[0]  # Cloudpickle wheel downloaded


def test_wheel_download_override_option_works(tmp_path, monkeypatch):
    dependency = "pyspark"
    requirements_file = os.path.join(tmp_path, "req.txt")
    wheel_dir = os.path.join(tmp_path, "wheels")
    with open(requirements_file, "w") as req_file:
        req_file.write(dependency)

    # Default option fails to download wheel
    with pytest.raises(
        MlflowException, match="An error occurred while downloading the dependency wheels"
    ):
        WheeledModel._download_wheels(requirements_file, wheel_dir)

    # Set option override
    monkeypatch.setenv("MLFLOW_WHEELED_MODEL_PIP_DOWNLOAD_OPTIONS", "--prefer-binary")
    WheeledModel._download_wheels(requirements_file, wheel_dir)
    assert len(os.listdir(wheel_dir))  # Wheel dir is not empty


def test_wheel_download_dependency_conflicts(tmp_path):
    reqs_file = tmp_path / "requirements.txt"
    reqs_file.write_text("mlflow==2.15.0\nmlflow==2.16.0")
    with pytest.raises(
        MlflowException,
        # Ensure the error message contains conflict details
        match=r"Cannot install mlflow==2\.15\.0 and mlflow==2\.16\.0.+The conflict is caused by",
    ):
        WheeledModel._download_wheels(reqs_file, tmp_path / "wheels")


def test_copy_metadata(mock_is_in_databricks, sklearn_knn_model):
    with mlflow.start_run():
        mlflow.sklearn.log_model(
            sklearn_knn_model.model,
            name="model",
            registered_model_name="sklearn_knn_model",
        )

    with mlflow.start_run():
        model_info = WheeledModel.log_model(model_uri="models:/sklearn_knn_model/1")

    artifact_path = mlflow.artifacts.download_artifacts(model_info.model_uri)
    metadata_path = os.path.join(artifact_path, "metadata")
    if mock_is_in_databricks.return_value:
        assert set(os.listdir(metadata_path)) == set(METADATA_FILES + [_ORIGINAL_REQ_FILE_NAME])
    else:
        assert not os.path.exists(metadata_path)
    assert mock_is_in_databricks.call_count == 2


def test_wheel_download_prevents_command_injection(tmp_path, monkeypatch):
    malicious_attempts = [
        "--only-binary=:all: && echo pwned",
        "--prefer-binary; rm -rf /",
        "--no-binary=:none: | cat /etc/passwd",
        "../../../etc/passwd",
        "--extra-index-url http://evil.com",
        "--find-links /tmp",
        "--index-url http://malicious.com",
        "--trusted-host evil.com",
        "--only-binary=package`rm -rf /`",
        "--config-settings malicious=value",
    ]

    for malicious_option in malicious_attempts:
        monkeypatch.setenv("MLFLOW_WHEELED_MODEL_PIP_DOWNLOAD_OPTIONS", malicious_option)
        with pytest.raises(MlflowException, match="Invalid pip wheel option"):
            WheeledModel._download_wheels(tmp_path / "req.txt", tmp_path / "wheels")


def test_wheel_download_allowed_options(tmp_path, monkeypatch):
    allowed_options = [
        "--only-binary=:all:",
        "--only-binary=:none:",
        "--no-binary=:all:",
        "--no-binary=:none:",
        "--prefer-binary",
        "--no-build-isolation",
        "--use-pep517",
        "--check-build-dependencies",
        "--ignore-requires-python",
        "--no-deps",
        "--no-verify",
        "--pre",
        "--require-hashes",
        "--no-clean",
    ]

    for option in allowed_options:
        monkeypatch.setenv("MLFLOW_WHEELED_MODEL_PIP_DOWNLOAD_OPTIONS", option)
        with mock.patch("subprocess.run") as mock_run:
            WheeledModel._download_wheels(tmp_path / "req.txt", tmp_path / "wheels")
            mock_run.assert_called_once()
            assert option in mock_run.call_args[0][0]

    # test combination of options
    monkeypatch.setenv("MLFLOW_WHEELED_MODEL_PIP_DOWNLOAD_OPTIONS", "--prefer-binary --no-clean")
    with mock.patch("subprocess.run") as mock_run:
        WheeledModel._download_wheels(tmp_path / "req.txt", tmp_path / "wheels")
        mock_run.assert_called_once()
        call_args = mock_run.call_args
        assert "--prefer-binary --no-clean" in call_args[0][0]


def test_wheel_download_extra_envs(tmp_path, monkeypatch):
    monkeypatch.setenv("MLFLOW_WHEELED_MODEL_PIP_DOWNLOAD_OPTIONS", "--prefer-binary")
    extra_envs = {
        "PIP_INDEX_URL": "https://test.pypi.org/simple/",
        "PIP_TRUSTED_HOST": "test.pypi.org",
        "CUSTOM_VAR": "test_value",
    }

    with mock.patch("subprocess.run") as mock_run:
        mock_run.return_value = mock.Mock(returncode=0)

        WheeledModel._download_wheels(
            tmp_path / "req.txt", tmp_path / "wheels", extra_envs=extra_envs
        )

        mock_run.assert_called_once()
        call_args = mock_run.call_args
        assert "--prefer-binary" in call_args[0][0]
        passed_env = call_args[1]["env"]
        assert passed_env["PIP_INDEX_URL"] == "https://test.pypi.org/simple/"
        assert passed_env["PIP_TRUSTED_HOST"] == "test.pypi.org"
        assert passed_env["CUSTOM_VAR"] == "test_value"

        # Verify original environment variables are preserved
        assert passed_env["PATH"] == os.environ["PATH"]


def test_wheel_download_no_extra_envs(tmp_path, monkeypatch):
    monkeypatch.setenv("MLFLOW_WHEELED_MODEL_PIP_DOWNLOAD_OPTIONS", "--prefer-binary")

    with mock.patch("subprocess.run") as mock_run:
        mock_run.return_value = mock.Mock(returncode=0)

        WheeledModel._download_wheels(tmp_path / "req.txt", tmp_path / "wheels", extra_envs=None)
        mock_run.assert_called_once()
        call_args = mock_run.call_args
        assert call_args[1]["env"] is None
```

--------------------------------------------------------------------------------

---[FILE: config.yaml]---
Location: mlflow-master/tests/models/configs/config.yaml

```yaml
embedding_model_query_instructions: "Represent this sentence for searching relevant passages:"
llm_model: "databricks-dbrx-instruct"
llm_prompt_template: "You are a trustful assistant."
retriever_config:
  k: 5
  use_mmr: false
llm_parameters:
  temperature: 0.01
  max_tokens: 500
llm_prompt_template_variables:
  - "chat_history"
  - "context"
  - "question"
```

--------------------------------------------------------------------------------

---[FILE: config_2.yaml]---
Location: mlflow-master/tests/models/configs/config_2.yaml

```yaml
embedding_model_query_instructions: "Represent this sentence for searching relevant passages:"
llm_model: "databricks-dbrx-instruct"
llm_prompt_template: "You are a trustful assistant. Answer concisely and clearly."
retriever_config:
  k: 5
  use_mmr: false
llm_parameters:
  temperature: 0.01
  max_tokens: 200
llm_prompt_template_variables:
  - "chat_history"
  - "context"
  - "question"
```

--------------------------------------------------------------------------------

---[FILE: agent_eval_recipe.html]---
Location: mlflow-master/tests/models/resources/agent_eval_recipe.html

```text
<head>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/xcode.min.css"
  />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script>
    hljs.highlightAll();
  </script>
  <style>
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
        Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji,
        Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      margin: 0;
      font-weight: 400;
      font-size: 13px;
      line-height: 18px;
      color: rgb(17, 23, 28);
    }
    code {
      line-height: 18px;
      font-size: 11px;
      background: rgb(250, 250, 250) !important;
    }
    pre {
      background: rgb(250, 250, 250);
      margin: 0;
      display: none;
    }
    pre.active {
      display: unset;
    }
    button {
      white-space: nowrap;
      text-align: center;
      position: relative;
      cursor: pointer;
      background: rgba(34, 114, 180, 0) !important;
      color: rgb(34, 114, 180) !important;
      border-color: rgba(34, 114, 180, 0) !important;
      padding: 4px 6px !important;
      text-decoration: none !important;
      line-height: 20px !important;
      box-shadow: none !important;
      height: 32px !important;
      display: inline-flex !important;
      -webkit-box-align: center !important;
      align-items: center !important;
      -webkit-box-pack: center !important;
      justify-content: center !important;
      vertical-align: middle !important;
    }
    p {
      margin: 0;
      padding: 0;
    }
    button:hover {
      background: rgba(34, 114, 180, 0.08) !important;
      color: rgb(14, 83, 139) !important;
    }
    button:active {
      background: rgba(34, 114, 180, 0.16) !important;
      color: rgb(4, 53, 93) !important;
    }
    h1 {
      margin-top: 4px;
      font-size: 22px;
    }
    .info {
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      color: rgb(95, 114, 129);
    }
    .tabs {
      margin-top: 10px;
      border-bottom: 1px solid rgb(209, 217, 225) !important;
      display: flex;
      line-height: 24px;
    }
    .tab {
      font-size: 13px;
      font-weight: 600 !important;
      cursor: pointer;
      margin: 0 24px 0 2px;
      padding-left: 2px;
    }
    .tab:hover {
      color: rgb(14, 83, 139) !important;
    }
    .tab.active {
      border-bottom: 3px solid rgb(34, 114, 180) !important;
    }
    .link {
      margin-left: 12px;
      display: inline-block;
      text-decoration: none;
      color: rgb(34, 114, 180) !important;
      font-size: 13px;
      font-weight: 400;
    }
    .link:hover {
      color: rgb(14, 83, 139) !important;
    }
    .link-content {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .caret-up {
      transform: rotate(180deg);
    }
  </style>
</head>
<body>
  <div style="display: flex; align-items: center">
    The logged model is compatible with the Mosaic AI Agent Framework.
    <button onclick="toggleCode()">
      See how to evaluate the model&nbsp;
      <span
        role="img"
        id="caret"
        aria-hidden="true"
        class="anticon css-6xix1i"
        style="font-size: 14px"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          fill="none"
          viewBox="0 0 16 16"
          aria-hidden="true"
          focusable="false"
          class=""
        >
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M8 8.917 10.947 6 12 7.042 8 11 4 7.042 5.053 6z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </span>
    </button>
  </div>
  <div id="code" style="display: none">
    <h1>
      Agent evaluation
      <a
        class="link"
        href="https://docs.databricks.com/en/generative-ai/agent-evaluation/synthesize-evaluation-set.html?utm_source=mlflow.log_model&utm_medium=notebook"
        target="_blank"
      >
        <span class="link-content">
          Learn more
          <span role="img" aria-hidden="true" class="anticon css-6xix1i"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              fill="none"
              viewBox="0 0 16 16"
              aria-hidden="true"
              focusable="false"
              class=""
            >
              <path
                fill="currentColor"
                d="M10 1h5v5h-1.5V3.56L8.53 8.53 7.47 7.47l4.97-4.97H10z"
              ></path>
              <path
                fill="currentColor"
                d="M1 2.75A.75.75 0 0 1 1.75 2H8v1.5H2.5v10h10V8H14v6.25a.75.75 0 0 1-.75.75H1.75a.75.75 0 0 1-.75-.75z"
              ></path></svg></span></span
      ></a>
    </h1>
    <p class="info">
      Copy the following code snippet in a notebook cell (right click → copy)
    </p>
    <div class="tabs">
      <div class="tab active" onclick="tabClicked(0)">Using synthetic data</div>
      <div class="tab" onclick="tabClicked(1)">Using your own dataset</div>
    </div>
    <div style="height: 472px">
      <pre
        class="active"
      ><code class="language-python">%pip install -U databricks-agents
dbutils.library.restartPython()
## Run the above in a separate cell ##

from databricks.agents.evals import generate_evals_df
import mlflow

agent_description = &quot;A chatbot that answers questions about Databricks.&quot;
question_guidelines = &quot;&quot;&quot;
# User personas
- A developer new to the Databricks platform
# Example questions
- What API lets me parallelize operations over rows of a delta table?
&quot;&quot;&quot;
# TODO: Spark/Pandas DataFrame with &quot;content&quot; and &quot;doc_uri&quot; columns.
docs = spark.table(&quot;catalog.schema.my_table_of_docs&quot;)
evals = generate_evals_df(
    docs=docs,
    num_evals=25,
    agent_description=agent_description,
    question_guidelines=question_guidelines,
)
eval_result = mlflow.evaluate(data=evals, model=&quot;runs:/1/model&quot;, model_type=&quot;databricks-agent&quot;)
</code></pre>

      <pre><code class="language-python">%pip install -U databricks-agents
dbutils.library.restartPython()
## Run the above in a separate cell ##

import pandas as pd
import mlflow

evals = [
    {
        &quot;request&quot;: {
            &quot;messages&quot;: [
                {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;How do I convert a Spark DataFrame to Pandas?&quot;}
            ],
        },
        # Optional, needed for judging correctness.
        &quot;expected_facts&quot;: [
            &quot;To convert a Spark DataFrame to Pandas, you can use the toPandas() method.&quot;
        ],
    }
]
eval_result = mlflow.evaluate(
    data=pd.DataFrame.from_records(evals), model=&quot;runs:/1/model&quot;, model_type=&quot;databricks-agent&quot;
)
</code></pre>
    </div>
  </div>
  <script>
    var codeShown = false;
    function clip(el) {
      var range = document.createRange();
      range.selectNodeContents(el);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }

    function toggleCode() {
      if (codeShown) {
        document.getElementById("code").style.display = "none";
        codeShown = false;
      } else {
        document.getElementById("code").style.display = "block";
        clip(document.querySelector("pre.active"));
        codeShown = true;
      }
      document.getElementById("caret").classList.toggle("caret-up");
    }

    function tabClicked(tabIndex) {
      document.querySelectorAll(".tab").forEach((tab, index) => {
        if (index === tabIndex) {
          tab.classList.add("active");
        } else {
          tab.classList.remove("active");
        }
      });
      document.querySelectorAll("pre").forEach((pre, index) => {
        if (index === tabIndex) {
          pre.classList.add("active");
        } else {
          pre.classList.remove("active");
        }
      });
      clip(document.querySelector("pre.active"));
    }
  </script>
</body>
```

--------------------------------------------------------------------------------

````
