---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 910
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 910 of 991)

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

---[FILE: test_smolagents_autolog.py]---
Location: mlflow-master/tests/smolagents/test_smolagents_autolog.py

```python
from types import SimpleNamespace
from unittest.mock import patch

import pytest
import smolagents
from packaging.version import Version

import mlflow
from mlflow.entities.span import SpanType
from mlflow.tracing.constant import SpanAttributeKey

from tests.tracing.helper import get_traces

_DUMMY_INPUT = "Explain quantum mechanics in simple terms."
_SMOLAGENTS_VERSION_NEW = Version(smolagents.__version__) >= Version("1.15.0")
MOCK_INFERENCE_CLIENT_MODEL_METHOD = "generate" if _SMOLAGENTS_VERSION_NEW else "__call__"


def clear_autolog_state():
    from mlflow.utils.autologging_utils import AUTOLOGGING_INTEGRATIONS

    for key in AUTOLOGGING_INTEGRATIONS.keys():
        AUTOLOGGING_INTEGRATIONS[key].clear()
    mlflow.utils.import_hooks._post_import_hooks = {}


def test_run_autolog():
    from smolagents import ChatMessage, CodeAgent, InferenceClientModel

    _DUMMY_OUTPUT = ChatMessage(
        role="user",
        content='[{"type": "text", "text": "Explain quantum mechanics in simple terms."}]',
    )
    _DUMMY_OUTPUT.raw = SimpleNamespace(
        usage=SimpleNamespace(
            prompt_tokens=10,
            completion_tokens=18,
            total_tokens=28,
        )
    )

    clear_autolog_state()
    agent = CodeAgent(
        tools=[],
        model=InferenceClientModel(model_id="gpt-3.5-turbo", token="test_id"),
        max_steps=2,
    )
    with patch(
        f"smolagents.InferenceClientModel.{MOCK_INFERENCE_CLIENT_MODEL_METHOD}",
        return_value=_DUMMY_OUTPUT,
    ):
        mlflow.smolagents.autolog()
        agent.run(_DUMMY_INPUT)

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    if _SMOLAGENTS_VERSION_NEW:
        # TODO: support this once the new version is stable
        assert len(traces[0].data.spans) > 0
    else:
        assert len(traces[0].data.spans) == 6
        # CodeAgent
        span_0 = traces[0].data.spans[0]
        assert span_0.name == "CodeAgent.run"
        assert span_0.span_type == SpanType.AGENT
        assert span_0.parent_id is None
        assert span_0.inputs == {"task": _DUMMY_INPUT}
        assert span_0.outputs == {
            "_value": '[{"type": "text", "text": "Explain quantum mechanics in simple terms."}]'
        }
        # CodeAgent
        span_1 = traces[0].data.spans[1]
        assert span_1.name == "CodeAgent.step"
        assert span_1.span_type == SpanType.AGENT
        assert span_1.parent_id == span_0.span_id
        assert span_1.inputs["memory_step"]["step_number"] == 1
        assert span_1.outputs is None
        # InferenceClientModel
        span_2 = traces[0].data.spans[2]
        assert span_2.name == "InferenceClientModel.call_original"
        assert span_2.span_type == SpanType.CHAT_MODEL
        assert span_2.parent_id == span_1.span_id
        assert span_2.inputs is not None
        assert span_2.outputs is not None
        # CodeAgent
        span_3 = traces[0].data.spans[3]
        assert span_3.name == "CodeAgent.step"
        assert span_3.span_type == SpanType.AGENT
        assert span_3.parent_id == span_0.span_id
        assert span_3.inputs is not None
        assert span_3.outputs is None
        # InferenceClientModel
        span_4 = traces[0].data.spans[4]
        assert span_4.name == "InferenceClientModel.call_original"
        assert span_4.span_type == SpanType.CHAT_MODEL
        assert span_4.parent_id == span_3.span_id
        assert span_4.inputs is not None
        assert span_4.outputs is not None
        # InferenceClientModel
        span_5 = traces[0].data.spans[5]
        assert span_5.name == "InferenceClientModel.call_original"
        assert span_5.span_type == SpanType.CHAT_MODEL
        assert span_5.parent_id == span_0.span_id
        assert span_5.inputs is not None
        assert span_5.outputs is not None

        assert span_2.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
            "input_tokens": 10,
            "output_tokens": 18,
            "total_tokens": 28,
        }
        assert span_4.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
            "input_tokens": 10,
            "output_tokens": 18,
            "total_tokens": 28,
        }
        assert span_5.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
            "input_tokens": 10,
            "output_tokens": 18,
            "total_tokens": 28,
        }

        assert traces[0].info.token_usage == {
            "input_tokens": 30,
            "output_tokens": 54,
            "total_tokens": 84,
        }

    clear_autolog_state()


def test_run_failure():
    from smolagents import CodeAgent, InferenceClientModel

    clear_autolog_state()
    mlflow.smolagents.autolog()
    agent = CodeAgent(
        tools=[],
        model=InferenceClientModel(model_id="gpt-3.5-turbo", token="test_id"),
        max_steps=1,
    )
    with patch(
        f"smolagents.InferenceClientModel.{MOCK_INFERENCE_CLIENT_MODEL_METHOD}",
        side_effect=Exception("error"),
    ):
        with pytest.raises(Exception, match="error"):
            agent.run(_DUMMY_INPUT)
    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "ERROR"
    if _SMOLAGENTS_VERSION_NEW:
        assert len(traces[0].data.spans) > 0
    else:
        assert len(traces[0].data.spans) == 2
        # CodeAgent
        span_0 = traces[0].data.spans[0]
        assert span_0.name == "CodeAgent.run"
        assert span_0.span_type == SpanType.AGENT
        assert span_0.parent_id is None
        assert span_0.inputs == {"task": _DUMMY_INPUT}
        assert span_0.outputs is None
        # InferenceClientModel
        span_1 = traces[0].data.spans[1]
        assert span_1.name == "CodeAgent.step"
        assert span_1.span_type == SpanType.AGENT
        assert span_1.parent_id == span_0.span_id
        assert span_1.inputs is not None
        assert span_1.outputs is None

    clear_autolog_state()


def test_tool_autolog():
    from smolagents import ChatMessage, CodeAgent, DuckDuckGoSearchTool, InferenceClientModel

    _DUMMY_OUTPUT = ChatMessage(
        role="user",
        content='[{"type": "text", "text": "Explain quantum mechanics in simple terms."}]',
    )
    _DUMMY_OUTPUT.raw = SimpleNamespace(
        usage=SimpleNamespace(
            prompt_tokens=10,
            completion_tokens=18,
            total_tokens=28,
        )
    )
    clear_autolog_state()
    agent = CodeAgent(
        tools=[
            DuckDuckGoSearchTool(),
        ],
        model=InferenceClientModel(model_id="gpt-3.5-turbo", token="test_id"),
        max_steps=1,
    )
    with patch(
        f"smolagents.InferenceClientModel.{MOCK_INFERENCE_CLIENT_MODEL_METHOD}",
        return_value=_DUMMY_OUTPUT,
    ):
        mlflow.smolagents.autolog()
        agent.run(_DUMMY_INPUT)

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    if _SMOLAGENTS_VERSION_NEW:
        assert len(traces[0].data.spans) > 0
    else:
        assert len(traces[0].data.spans) == 4
        # CodeAgent
        span_0 = traces[0].data.spans[0]
        assert span_0.name == "CodeAgent.run"
        assert span_0.span_type == SpanType.AGENT
        assert span_0.parent_id is None
        assert span_0.inputs is not None
        assert span_0.outputs is not None
        # InferenceClientModel
        span_1 = traces[0].data.spans[1]
        assert span_1.name == "CodeAgent.step"
        assert span_1.span_type == SpanType.AGENT
        assert span_1.parent_id == span_0.span_id
        assert span_1.inputs is not None
        assert span_1.outputs is None
        # InferenceClientModel
        span_2 = traces[0].data.spans[2]
        assert span_2.name == "InferenceClientModel.call_original"
        assert span_2.span_type == SpanType.CHAT_MODEL
        assert span_2.parent_id == span_1.span_id
        assert span_2.inputs is not None
        assert span_2.outputs is not None
        # CodeAgent
        span_3 = traces[0].data.spans[3]
        assert span_3.name == "InferenceClientModel.call_original"
        assert span_3.span_type == SpanType.CHAT_MODEL
        assert span_3.parent_id == span_0.span_id
        assert span_3.inputs is not None
        assert span_3.outputs is not None

        assert span_2.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
            "input_tokens": 10,
            "output_tokens": 18,
            "total_tokens": 28,
        }
        assert span_3.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
            "input_tokens": 10,
            "output_tokens": 18,
            "total_tokens": 28,
        }

        assert traces[0].info.token_usage == {
            "input_tokens": 20,
            "output_tokens": 36,
            "total_tokens": 56,
        }

    clear_autolog_state()
```

--------------------------------------------------------------------------------

---[FILE: test_spacy_model_export.py]---
Location: mlflow-master/tests/spacy/test_spacy_model_export.py
Signals: Flask

```python
import json
import os
import random
from pathlib import Path
from typing import Any, NamedTuple
from unittest import mock

import pandas as pd
import pytest
import spacy
import yaml
from packaging.version import Version
from sklearn.datasets import fetch_20newsgroups
from spacy.util import compounding, minibatch

import mlflow.pyfunc.scoring_server as pyfunc_scoring_server
import mlflow.spacy
from mlflow import pyfunc
from mlflow.exceptions import MlflowException
from mlflow.models import Model, infer_signature
from mlflow.models.utils import _read_example, load_serving_example
from mlflow.tracking.artifact_utils import _download_artifact_from_uri
from mlflow.utils.environment import _mlflow_conda_env
from mlflow.utils.file_utils import TempDir
from mlflow.utils.model_utils import _get_flavor_configuration

from tests.helper_functions import (
    _assert_pip_requirements,
    _compare_conda_env_requirements,
    _compare_logged_code_paths,
    _is_available_on_pypi,
    _mlflow_major_version_string,
    allow_infer_pip_requirements_fallback_if,
    pyfunc_serve_and_score_model,
)

EXTRA_PYFUNC_SERVING_TEST_ARGS = (
    [] if _is_available_on_pypi("spacy") else ["--env-manager", "local"]
)


class ModelWithData(NamedTuple):
    model: Any
    inference_data: Any


spacy_version = Version(spacy.__version__)
IS_SPACY_VERSION_NEWER_THAN_OR_EQUAL_TO_3_0_0 = spacy_version >= Version("3.0.0")


@pytest.fixture(scope="module")
def spacy_model_with_data():
    # Creating blank model and setting up the spaCy pipeline
    nlp = spacy.blank("en")
    if IS_SPACY_VERSION_NEWER_THAN_OR_EQUAL_TO_3_0_0:
        from spacy.pipeline.tok2vec import DEFAULT_TOK2VEC_MODEL

        model = {
            "@architectures": "spacy.TextCatCNN.v1",
            "exclusive_classes": True,
            "tok2vec": DEFAULT_TOK2VEC_MODEL,
        }
        textcat = nlp.add_pipe("textcat", config={"model": model}, last=True)
    else:
        textcat = nlp.create_pipe(
            "textcat", config={"exclusive_classes": True, "architecture": "simple_cnn"}
        )
        nlp.add_pipe(textcat, last=True)

    # Training the model to recognize between computer graphics and baseball in 20newsgroups dataset
    categories = ["comp.graphics", "rec.sport.baseball"]
    for cat in categories:
        textcat.add_label(cat)

    # Split train/test and train the model
    train_x, train_y, test_x, _ = _get_train_test_dataset(categories)
    train_data = list(zip(train_x, [{"cats": cats} for cats in train_y]))

    if IS_SPACY_VERSION_NEWER_THAN_OR_EQUAL_TO_3_0_0:
        from spacy.training import Example

        train_data = [Example.from_dict(nlp.make_doc(text), cats) for text, cats in train_data]

    _train_model(nlp, train_data)
    return ModelWithData(nlp, pd.DataFrame(test_x))


@pytest.fixture
def spacy_custom_env(tmp_path):
    conda_env = os.path.join(tmp_path, "conda_env.yml")
    _mlflow_conda_env(conda_env, additional_pip_deps=["pytest", "spacy"])
    return conda_env


@pytest.fixture
def model_path(tmp_path):
    return os.path.join(tmp_path, "model")


def test_model_save_load(spacy_model_with_data, model_path):
    spacy_model = spacy_model_with_data.model
    mlflow.spacy.save_model(spacy_model=spacy_model, path=model_path)
    loaded_model = mlflow.spacy.load_model(model_path)

    # Remove a `_sourced_vectors_hashes` field which is added when spaCy loads a model:
    # https://github.com/explosion/spaCy/blob/e8ef4a46d5dbc9bb6d629ecd0b02721d6bdf2f87/spacy/language.py#L1701
    loaded_model.meta.pop("_sourced_vectors_hashes", None)

    # Comparing the meta dictionaries for the original and loaded models
    assert spacy_model.meta == loaded_model.meta

    # Load pyfunc model using saved model and asserting its predictions are equal to the created one
    pyfunc_loaded = mlflow.pyfunc.load_model(model_path)
    assert all(
        _predict(spacy_model, spacy_model_with_data.inference_data)
        == pyfunc_loaded.predict(spacy_model_with_data.inference_data)
    )


def test_model_export_with_schema_and_examples(spacy_model_with_data):
    spacy_model = spacy_model_with_data.model
    signature_ = infer_signature(spacy_model_with_data.inference_data)
    example_ = spacy_model_with_data.inference_data.head(3)
    for signature in (None, signature_):
        for example in (None, example_):
            with TempDir() as tmp:
                path = tmp.path("model")
                mlflow.spacy.save_model(
                    spacy_model, path=path, signature=signature, input_example=example
                )
                mlflow_model = Model.load(path)
                if signature is not None or example is None:
                    assert signature == mlflow_model.signature
                else:
                    # signature is inferred from input_example
                    assert mlflow_model.signature is not None
                if example is None:
                    assert mlflow_model.saved_input_example_info is None
                else:
                    assert all((_read_example(mlflow_model, path) == example).all())


def test_predict_df_with_wrong_shape(spacy_model_with_data, model_path):
    mlflow.spacy.save_model(spacy_model=spacy_model_with_data.model, path=model_path)
    pyfunc_loaded = mlflow.pyfunc.load_model(model_path)

    # Concatenating with itself to duplicate column and mess up input shape
    # then asserting n MlflowException is raised
    with pytest.raises(MlflowException, match="Shape of input dataframe must be"):
        pyfunc_loaded.predict(
            pd.concat(
                [spacy_model_with_data.inference_data, spacy_model_with_data.inference_data], axis=1
            )
        )


def test_model_log(spacy_model_with_data, tracking_uri_mock):
    spacy_model = spacy_model_with_data.model
    old_uri = mlflow.get_tracking_uri()
    # should_start_run tests whether or not calling log_model() automatically starts a run.
    for should_start_run in [False, True]:
        with TempDir(chdr=True, remove_on_exit=True):
            try:
                artifact_path = "model"
                if should_start_run:
                    mlflow.start_run()
                model_info = mlflow.spacy.log_model(spacy_model, name=artifact_path)
                model_uri = model_info.model_uri
                assert model_info.model_uri == model_uri

                # Load model
                spacy_model_loaded = mlflow.spacy.load_model(model_uri=model_uri)
                assert all(
                    _predict(spacy_model, spacy_model_with_data.inference_data)
                    == _predict(spacy_model_loaded, spacy_model_with_data.inference_data)
                )
            finally:
                mlflow.end_run()
                mlflow.set_tracking_uri(old_uri)


def test_model_save_persists_requirements_in_mlflow_model_directory(
    spacy_model_with_data, model_path, spacy_custom_env
):
    mlflow.spacy.save_model(
        spacy_model=spacy_model_with_data.model, path=model_path, conda_env=spacy_custom_env
    )

    saved_pip_req_path = os.path.join(model_path, "requirements.txt")
    _compare_conda_env_requirements(spacy_custom_env, saved_pip_req_path)


def test_save_model_with_pip_requirements(spacy_model_with_data, tmp_path):
    expected_mlflow_version = _mlflow_major_version_string()
    # Path to a requirements file
    tmpdir1 = tmp_path.joinpath("1")
    req_file = tmp_path.joinpath("requirements.txt")
    req_file.write_text("a")
    mlflow.spacy.save_model(spacy_model_with_data.model, tmpdir1, pip_requirements=str(req_file))
    _assert_pip_requirements(tmpdir1, [expected_mlflow_version, "a"], strict=True)

    # List of requirements
    tmpdir2 = tmp_path.joinpath("2")
    mlflow.spacy.save_model(
        spacy_model_with_data.model,
        tmpdir2,
        pip_requirements=[f"-r {req_file}", "b"],
    )
    _assert_pip_requirements(tmpdir2, [expected_mlflow_version, "a", "b"], strict=True)

    # Constraints file
    tmpdir3 = tmp_path.joinpath("3")
    mlflow.spacy.save_model(
        spacy_model_with_data.model,
        tmpdir3,
        pip_requirements=[f"-c {req_file}", "b"],
    )
    _assert_pip_requirements(
        tmpdir3, [expected_mlflow_version, "b", "-c constraints.txt"], ["a"], strict=True
    )


def test_save_model_with_extra_pip_requirements(spacy_model_with_data, tmp_path):
    expected_mlflow_version = _mlflow_major_version_string()
    default_reqs = mlflow.spacy.get_default_pip_requirements()

    # Path to a requirements file
    tmpdir1 = tmp_path.joinpath("1")
    req_file = tmp_path.joinpath("requirements.txt")
    req_file.write_text("a")
    mlflow.spacy.save_model(
        spacy_model_with_data.model, tmpdir1, extra_pip_requirements=str(req_file)
    )
    _assert_pip_requirements(tmpdir1, [expected_mlflow_version, *default_reqs, "a"])

    # List of requirements
    tmpdir2 = tmp_path.joinpath("2")
    mlflow.spacy.save_model(
        spacy_model_with_data.model,
        tmpdir2,
        extra_pip_requirements=[f"-r {req_file}", "b"],
    )
    _assert_pip_requirements(tmpdir2, [expected_mlflow_version, *default_reqs, "a", "b"])

    # Constraints file
    tmpdir3 = tmp_path.joinpath("3")
    mlflow.spacy.save_model(
        spacy_model_with_data.model,
        tmpdir3,
        extra_pip_requirements=[f"-c {req_file}", "b"],
    )
    _assert_pip_requirements(
        tmpdir3, [expected_mlflow_version, *default_reqs, "b", "-c constraints.txt"], ["a"]
    )


def test_model_save_persists_specified_conda_env_in_mlflow_model_directory(
    spacy_model_with_data, model_path, spacy_custom_env
):
    mlflow.spacy.save_model(
        spacy_model=spacy_model_with_data.model, path=model_path, conda_env=spacy_custom_env
    )

    pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
    saved_conda_env_path = os.path.join(model_path, pyfunc_conf[pyfunc.ENV]["conda"])
    assert os.path.exists(saved_conda_env_path)
    assert saved_conda_env_path != spacy_custom_env

    with open(spacy_custom_env) as f:
        spacy_custom_env_text = f.read()
    with open(saved_conda_env_path) as f:
        saved_conda_env_text = f.read()
    assert saved_conda_env_text == spacy_custom_env_text


def test_model_save_accepts_conda_env_as_dict(spacy_model_with_data, model_path):
    conda_env = dict(mlflow.spacy.get_default_conda_env())
    conda_env["dependencies"].append("pytest")
    mlflow.spacy.save_model(
        spacy_model=spacy_model_with_data.model, path=model_path, conda_env=conda_env
    )

    pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
    saved_conda_env_path = os.path.join(model_path, pyfunc_conf[pyfunc.ENV]["conda"])
    assert os.path.exists(saved_conda_env_path)

    with open(saved_conda_env_path) as f:
        saved_conda_env_parsed = yaml.safe_load(f)
    assert saved_conda_env_parsed == conda_env


def test_model_log_persists_specified_conda_env_in_mlflow_model_directory(
    spacy_model_with_data, spacy_custom_env
):
    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.spacy.log_model(
            spacy_model_with_data.model,
            name=artifact_path,
            conda_env=spacy_custom_env,
        )
        model_path = _download_artifact_from_uri(model_info.model_uri)

    pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
    saved_conda_env_path = os.path.join(model_path, pyfunc_conf[pyfunc.ENV]["conda"])
    assert os.path.exists(saved_conda_env_path)
    assert saved_conda_env_path != spacy_custom_env

    with open(spacy_custom_env) as f:
        spacy_custom_env_text = f.read()
    with open(saved_conda_env_path) as f:
        saved_conda_env_text = f.read()
    assert saved_conda_env_text == spacy_custom_env_text


def test_model_log_persists_requirements_in_mlflow_model_directory(
    spacy_model_with_data, spacy_custom_env
):
    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.spacy.log_model(
            spacy_model_with_data.model,
            name=artifact_path,
            conda_env=spacy_custom_env,
        )
        model_path = _download_artifact_from_uri(model_info.model_uri)

    saved_pip_req_path = os.path.join(model_path, "requirements.txt")
    _compare_conda_env_requirements(spacy_custom_env, saved_pip_req_path)


def test_model_save_without_specified_conda_env_uses_default_env_with_expected_dependencies(
    spacy_model_with_data, model_path
):
    mlflow.spacy.save_model(spacy_model=spacy_model_with_data.model, path=model_path)
    _assert_pip_requirements(model_path, mlflow.spacy.get_default_pip_requirements())


def test_model_log_without_specified_conda_env_uses_default_env_with_expected_dependencies(
    spacy_model_with_data,
):
    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.spacy.log_model(spacy_model_with_data.model, name=artifact_path)
    _assert_pip_requirements(model_info.model_uri, mlflow.spacy.get_default_pip_requirements())


def test_model_log_with_pyfunc_flavor(spacy_model_with_data):
    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.spacy.log_model(spacy_model_with_data.model, name=artifact_path)

        loaded_model = Model.load(model_info.model_uri)
        assert pyfunc.FLAVOR_NAME in loaded_model.flavors


# In this test, `infer_pip_requirements` fails to load a spacy model for spacy < 3.0.0 due to:
# https://github.com/explosion/spaCy/issues/4658
@allow_infer_pip_requirements_fallback_if(not IS_SPACY_VERSION_NEWER_THAN_OR_EQUAL_TO_3_0_0)
def test_model_log_without_pyfunc_flavor():
    artifact_path = "model"
    nlp = spacy.blank("en")

    # Add a component not compatible with pyfunc
    if IS_SPACY_VERSION_NEWER_THAN_OR_EQUAL_TO_3_0_0:
        nlp.add_pipe("ner", last=True)
    else:
        ner = nlp.create_pipe("ner")
        nlp.add_pipe(ner, last=True)

    # Ensure the pyfunc flavor is not present after logging and loading the model
    with mlflow.start_run():
        model_info = mlflow.spacy.log_model(nlp, name=artifact_path)
        model_path = _download_artifact_from_uri(model_info.model_uri)

        loaded_model = Model.load(model_path)
        assert loaded_model.flavors.keys() == {"spacy"}


def test_pyfunc_serve_and_score(spacy_model_with_data):
    model, inference_dataframe = spacy_model_with_data
    artifact_path = "model"
    with mlflow.start_run():
        if spacy_version <= Version("3.0.9"):
            extra_pip_requirements = ["click<8.1.0", "flask<2.1.0", "werkzeug<3"]
        elif spacy_version < Version("3.2.4"):
            extra_pip_requirements = ["click<8.1.0"]
        else:
            extra_pip_requirements = None
        model_info = mlflow.spacy.log_model(
            model,
            name=artifact_path,
            extra_pip_requirements=extra_pip_requirements,
            input_example=inference_dataframe,
        )

    inference_payload = load_serving_example(model_info.model_uri)
    resp = pyfunc_serve_and_score_model(
        model_info.model_uri,
        data=inference_payload,
        content_type=pyfunc_scoring_server.CONTENT_TYPE_JSON,
        extra_args=EXTRA_PYFUNC_SERVING_TEST_ARGS,
    )
    scores = pd.DataFrame(data=json.loads(resp.content.decode("utf-8"))["predictions"])
    pd.testing.assert_frame_equal(scores, _predict(model, inference_dataframe))


def test_log_model_with_code_paths(spacy_model_with_data):
    artifact_path = "model"
    with (
        mlflow.start_run(),
        mock.patch("mlflow.spacy._add_code_from_conf_to_system_path") as add_mock,
    ):
        model_info = mlflow.spacy.log_model(
            spacy_model_with_data.model, name=artifact_path, code_paths=[__file__]
        )
        _compare_logged_code_paths(__file__, model_info.model_uri, mlflow.spacy.FLAVOR_NAME)
        mlflow.spacy.load_model(model_info.model_uri)
        add_mock.assert_called()


def _train_model(nlp, train_data, n_iter=5):
    optimizer = nlp.begin_training()
    batch_sizes = compounding(4.0, 32.0, 1.001)
    for _ in range(n_iter):
        losses = {}
        random.shuffle(train_data)
        batches = minibatch(train_data, size=batch_sizes)
        for batch in batches:
            if IS_SPACY_VERSION_NEWER_THAN_OR_EQUAL_TO_3_0_0:
                nlp.update(batch, sgd=optimizer, drop=0.2, losses=losses)
            else:
                texts, annotations = zip(*batch)
                nlp.update(texts, annotations, sgd=optimizer, drop=0.2, losses=losses)


def _get_train_test_dataset(cats_to_fetch, limit=100):
    newsgroups = fetch_20newsgroups(
        remove=("headers", "footers", "quotes"), shuffle=True, categories=cats_to_fetch
    )
    X = newsgroups.data[:limit]
    y = newsgroups.target[:limit]

    X = [str(x) for x in X]  # Ensure all strings to unicode for python 2.7 compatibility

    # Category 0 comp-graphic, 1 rec.sport baseball. We can threat it as a binary class.
    cats = [{"comp.graphics": not bool(el), "rec.sport.baseball": bool(el)} for el in y]

    split = int(len(X) * 0.8)
    return X[:split], cats[:split], X[split:], cats[split:]


def _predict(spacy_model, test_x):
    return pd.DataFrame(
        {"predictions": test_x.iloc[:, 0].apply(lambda text: spacy_model(text).cats)}
    )


def test_virtualenv_subfield_points_to_correct_path(spacy_model_with_data, model_path):
    mlflow.spacy.save_model(spacy_model_with_data.model, path=model_path)
    pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
    python_env_path = Path(model_path, pyfunc_conf[pyfunc.ENV]["virtualenv"])
    assert python_env_path.exists()
    assert python_env_path.is_file()


def test_model_save_load_with_metadata(spacy_model_with_data, model_path):
    mlflow.spacy.save_model(
        spacy_model_with_data.model, path=model_path, metadata={"metadata_key": "metadata_value"}
    )

    reloaded_model = mlflow.pyfunc.load_model(model_uri=model_path)
    assert reloaded_model.metadata.metadata["metadata_key"] == "metadata_value"


def test_model_log_with_metadata(spacy_model_with_data):
    artifact_path = "model"

    with mlflow.start_run():
        model_info = mlflow.spacy.log_model(
            spacy_model_with_data.model,
            name=artifact_path,
            metadata={"metadata_key": "metadata_value"},
        )

    reloaded_model = mlflow.pyfunc.load_model(model_uri=model_info.model_uri)
    assert reloaded_model.metadata.metadata["metadata_key"] == "metadata_value"
```

--------------------------------------------------------------------------------

---[FILE: test_sparkml_param_integration.py]---
Location: mlflow-master/tests/spark/test_sparkml_param_integration.py

```python
from pyspark.ml.param import Param as SparkMLParam
from pyspark.ml.util import Identifiable

from mlflow.entities import Param


def test_spark_integration():
    key = SparkMLParam(Identifiable(), "name", "doc")
    value = 123
    param = Param(key, value)
    assert param.key == "name"
    assert param.value == "123"
```

--------------------------------------------------------------------------------

---[FILE: test_spark_connect_model_export.py]---
Location: mlflow-master/tests/spark/test_spark_connect_model_export.py

```python
import json
import os
from unittest import mock

import numpy as np
import pandas as pd
import pyspark
import pytest
from packaging.version import Version
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import LongType
from sklearn import datasets

import mlflow
import mlflow.pyfunc.scoring_server as pyfunc_scoring_server
from mlflow import pyfunc
from mlflow.pyfunc import spark_udf

from tests.helper_functions import pyfunc_serve_and_score_model
from tests.pyfunc.test_spark import score_model_as_udf
from tests.spark.test_spark_model_export import SparkModelWithData

PYSPARK_VERSION = Version(pyspark.__version__)


def _get_spark_connect_session():
    builder = SparkSession.builder.remote("local[2]").config(
        "spark.connect.copyFromLocalToFs.allowDestLocal", "true"
    )
    if not PYSPARK_VERSION.is_devrelease and PYSPARK_VERSION.major < 4:
        builder.config(
            "spark.jars.packages", f"org.apache.spark:spark-connect_2.12:{pyspark.__version__}"
        )
    return builder.getOrCreate()


@pytest.fixture
def model_path(tmp_path):
    return os.path.join(tmp_path, "model")


def score_model_as_udf(model_uri, pandas_df, result_type):
    spark = SparkSession.getActiveSession()
    spark_df = spark.createDataFrame(pandas_df).coalesce(1)
    pyfunc_udf = spark_udf(
        spark=spark, model_uri=model_uri, result_type=result_type, env_manager="local"
    )
    new_df = spark_df.withColumn("prediction", pyfunc_udf(F.struct(F.col("features"))))
    return new_df.toPandas()["prediction"]


@pytest.fixture(scope="module")
def spark():
    spark = _get_spark_connect_session()
    yield spark
    spark.stop()


@pytest.fixture(scope="module")
def iris_df(spark):
    X, y = datasets.load_iris(return_X_y=True)
    spark_df = spark.createDataFrame(zip(X, y), schema="features: array<double>, label: long")
    return spark_df.toPandas(), spark_df


@pytest.fixture(scope="module")
def spark_model(iris_df):
    from pyspark.ml.connect.classification import LogisticRegression
    from pyspark.ml.connect.feature import StandardScaler
    from pyspark.ml.connect.pipeline import Pipeline

    iris_pandas_df, iris_spark_df = iris_df
    scaler = StandardScaler(inputCol="features", outputCol="scaled_features")
    lr = LogisticRegression(maxIter=10, numTrainWorkers=2, learningRate=0.001)
    pipeline = Pipeline(stages=[scaler, lr])
    # Fit the model
    model = pipeline.fit(iris_spark_df)
    preds_pandas_df = model.transform(iris_pandas_df.copy(deep=False))
    return SparkModelWithData(
        model=model,
        spark_df=None,
        pandas_df=iris_pandas_df,
        predictions=preds_pandas_df,
    )


@pytest.fixture
def model_path(tmp_path):
    return os.path.join(tmp_path, "model")


def test_model_export(spark_model, model_path):
    mlflow.spark.save_model(spark_model.model, path=model_path)
    # 1. score and compare reloaded sparkml model
    reloaded_model = mlflow.spark.load_model(model_uri=model_path)
    preds_df = reloaded_model.transform(spark_model.pandas_df.copy(deep=False))
    pd.testing.assert_frame_equal(spark_model.predictions, preds_df, check_dtype=False)

    m = pyfunc.load_model(model_path)
    # 2. score and compare reloaded pyfunc
    preds2 = m.predict(spark_model.pandas_df.copy(deep=False))
    pd.testing.assert_series_equal(spark_model.predictions["prediction"], preds2, check_dtype=False)

    # 3. score and compare reloaded pyfunc Spark udf
    preds3 = score_model_as_udf(
        model_uri=model_path, pandas_df=spark_model.pandas_df, result_type=LongType()
    )
    pd.testing.assert_series_equal(spark_model.predictions["prediction"], preds3, check_dtype=False)


def test_sparkml_model_log(spark_model):
    with mlflow.start_run():
        model_info = mlflow.spark.log_model(
            spark_model.model,
            artifact_path="model",
        )
    model_uri = model_info.model_uri

    reloaded_model = mlflow.spark.load_model(model_uri=model_uri)
    preds_df = reloaded_model.transform(spark_model.pandas_df.copy(deep=False))
    pd.testing.assert_frame_equal(spark_model.predictions, preds_df, check_dtype=False)


def test_pyfunc_serve_and_score(spark_model):
    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.spark.log_model(spark_model.model, artifact_path=artifact_path)

    input_data = pd.DataFrame({"features": spark_model.pandas_df["features"].map(list)})
    resp = pyfunc_serve_and_score_model(
        model_info.model_uri,
        data=input_data,
        content_type=pyfunc_scoring_server.CONTENT_TYPE_JSON,
        extra_args=["--env-manager", "local"],
    )
    scores = pd.DataFrame(
        data=json.loads(resp.content.decode("utf-8"))["predictions"]
    ).values.squeeze()
    np.testing.assert_array_almost_equal(
        scores, spark_model.model.transform(spark_model.pandas_df)["prediction"].values
    )


def test_databricks_serverless_model_save_load(spark_model):
    with (
        mock.patch("mlflow.utils.databricks_utils.is_in_databricks_runtime", return_value=True),
        mock.patch("mlflow.spark._is_uc_volume_uri", return_value=True),
    ):
        for mock_fun in [
            "is_in_databricks_serverless_runtime",
            "is_in_databricks_shared_cluster_runtime",
        ]:
            with mock.patch(f"mlflow.utils.databricks_utils.{mock_fun}", return_value=True):
                artifact_path = "model"
                with mlflow.start_run():
                    model_info = mlflow.spark.log_model(
                        spark_model.model, artifact_path=artifact_path
                    )

                mlflow.spark.load_model(model_info.model_uri)
```

--------------------------------------------------------------------------------

````
