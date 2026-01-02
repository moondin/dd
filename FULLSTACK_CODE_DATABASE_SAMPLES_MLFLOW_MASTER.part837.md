---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 837
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 837 of 991)

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

---[FILE: test_groq_autolog.py]---
Location: mlflow-master/tests/groq/test_groq_autolog.py

```python
import json
from unittest.mock import patch

import groq
import pytest
from groq.types.audio.transcription import Transcription
from groq.types.audio.translation import Translation
from groq.types.chat import ChatCompletionMessageToolCall
from groq.types.chat.chat_completion import (
    ChatCompletion,
    ChatCompletionMessage,
    Choice,
    CompletionUsage,
)

import mlflow.groq
from mlflow.entities.span import SpanType
from mlflow.tracing.constant import SpanAttributeKey

from tests.tracing.helper import get_traces

DUMMY_CHAT_COMPLETION_REQUEST = {
    "model": "test_model",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "test message"}],
}

DUMMY_COMPLETION_USAGE = CompletionUsage(
    completion_tokens=648,
    prompt_tokens=20,
    total_tokens=668,
    completion_time=0.54,
    prompt_time=0.000181289,
    queue_time=0.012770949,
    total_time=0.540181289,
)

DUMMY_CHAT_COMPLETION_RESPONSE = ChatCompletion(
    id="chatcmpl-test-id",
    choices=[
        Choice(
            finish_reason="stop",
            index=0,
            logprobs=None,
            message=ChatCompletionMessage(
                content="test response",
                role="assistant",
                function_call=None,
                tool_calls=None,
                reasoning=None,
            ),
        )
    ],
    created=1733574047,
    model="llama3-8b-8192",
    object="chat.completion",
    system_fingerprint="fp_test",
    usage=DUMMY_COMPLETION_USAGE,
    x_groq={"id": "req_test"},
)


@pytest.fixture(autouse=True)
def init_state(monkeypatch):
    monkeypatch.setenv("GROQ_API_KEY", "test_key")
    yield
    mlflow.groq.autolog(disable=True)


def test_chat_completion_autolog():
    mlflow.groq.autolog()
    client = groq.Groq()

    with patch("groq._client.Groq.post", return_value=DUMMY_CHAT_COMPLETION_RESPONSE):
        client.chat.completions.create(**DUMMY_CHAT_COMPLETION_REQUEST)

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 1
    span = traces[0].data.spans[0]
    assert span.name == "Completions"
    assert span.span_type == SpanType.CHAT_MODEL
    assert span.inputs == DUMMY_CHAT_COMPLETION_REQUEST
    assert span.outputs == DUMMY_CHAT_COMPLETION_RESPONSE.to_dict(exclude_unset=False)

    assert span.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
        "input_tokens": 20,
        "output_tokens": 648,
        "total_tokens": 668,
    }

    assert span.get_attribute(SpanAttributeKey.MESSAGE_FORMAT) == "groq"

    assert traces[0].info.token_usage == {
        "input_tokens": 20,
        "output_tokens": 648,
        "total_tokens": 668,
    }

    mlflow.groq.autolog(disable=True)
    client = groq.Groq()

    with patch("groq._client.Groq.post", return_value=DUMMY_CHAT_COMPLETION_RESPONSE):
        client.chat.completions.create(**DUMMY_CHAT_COMPLETION_REQUEST)

    # No new trace should be created
    traces = get_traces()
    assert len(traces) == 1


TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "calculate",
            "description": "Evaluate a mathematical expression",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "The mathematical expression to evaluate",
                    }
                },
                "required": ["expression"],
            },
        },
    }
]
DUMMY_TOOL_CALL_REQUEST = {
    "model": "test_model",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "What is 25 * 4 + 10?"}],
    "tools": TOOLS,
}
DUMMY_TOOL_CALL_RESPONSE = ChatCompletion(
    id="chatcmpl-test-id",
    choices=[
        Choice(
            finish_reason="stop",
            index=0,
            logprobs=None,
            message=ChatCompletionMessage(
                content=None,
                role="assistant",
                function_call=None,
                tool_calls=[
                    ChatCompletionMessageToolCall(
                        id="tool call id",
                        function={
                            "name": "calculate",
                            "arguments": json.dumps({"expression": "25 * 4 + 10"}),
                        },
                        type="function",
                    )
                ],
                reasoning=None,
            ),
        )
    ],
    created=1733574047,
    model="llama3-8b-8192",
    object="chat.completion",
    system_fingerprint="fp_test",
    usage=DUMMY_COMPLETION_USAGE,
    x_groq={"id": "req_test"},
)


def test_tool_calling_autolog():
    mlflow.groq.autolog()
    client = groq.Groq()

    with patch("groq._client.Groq.post", return_value=DUMMY_TOOL_CALL_RESPONSE):
        client.chat.completions.create(**DUMMY_TOOL_CALL_REQUEST)

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 1
    span = traces[0].data.spans[0]
    assert span.name == "Completions"
    assert span.span_type == SpanType.CHAT_MODEL
    assert span.inputs == DUMMY_TOOL_CALL_REQUEST
    assert span.outputs == DUMMY_TOOL_CALL_RESPONSE.to_dict(exclude_unset=False)
    assert span.get_attribute("mlflow.chat.tools") == TOOLS

    assert span.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
        "input_tokens": 20,
        "output_tokens": 648,
        "total_tokens": 668,
    }

    assert span.get_attribute(SpanAttributeKey.MESSAGE_FORMAT) == "groq"

    assert traces[0].info.token_usage == {
        "input_tokens": 20,
        "output_tokens": 648,
        "total_tokens": 668,
    }


DUMMY_TOOL_RESPONSE_REQUEST = {
    "model": "test_model",
    "max_tokens": 1024,
    "messages": [
        {"role": "user", "content": "What is 25 * 4 + 10?"},
        {
            "role": "assistant",
            "tool_calls": [
                {
                    "id": "tool call id",
                    "function": {
                        "name": "calculate",
                        "arguments": json.dumps({"expression": "25 * 4 + 10"}),
                    },
                    "type": "function",
                }
            ],
        },
        {"role": "tool", "name": "calculate", "content": json.dumps({"result": 110})},
    ],
    "tools": TOOLS,
}
DUMMY_TOOL_RESPONSE_RESPONSE = ChatCompletion(
    id="chatcmpl-test-id",
    choices=[
        Choice(
            finish_reason="stop",
            index=0,
            logprobs=None,
            message=ChatCompletionMessage(
                content="The result of the calculation is 110",
                role="assistant",
                function_call=None,
                reasoning=None,
                tool_calls=None,
            ),
        )
    ],
    created=1733574047,
    model="llama3-8b-8192",
    object="chat.completion",
    system_fingerprint="fp_test",
    usage=DUMMY_COMPLETION_USAGE,
    x_groq={"id": "req_test"},
)


def test_tool_response_autolog():
    mlflow.groq.autolog()
    client = groq.Groq()

    with patch("groq._client.Groq.post", return_value=DUMMY_TOOL_RESPONSE_RESPONSE):
        client.chat.completions.create(**DUMMY_TOOL_RESPONSE_REQUEST)

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 1
    span = traces[0].data.spans[0]
    assert span.name == "Completions"
    assert span.span_type == SpanType.CHAT_MODEL
    assert span.inputs == DUMMY_TOOL_RESPONSE_REQUEST
    assert span.outputs == DUMMY_TOOL_RESPONSE_RESPONSE.to_dict(exclude_unset=False)

    assert span.get_attribute(SpanAttributeKey.CHAT_USAGE) == {
        "input_tokens": 20,
        "output_tokens": 648,
        "total_tokens": 668,
    }

    assert span.get_attribute(SpanAttributeKey.MESSAGE_FORMAT) == "groq"

    assert traces[0].info.token_usage == {
        "input_tokens": 20,
        "output_tokens": 648,
        "total_tokens": 668,
    }


BINARY_CONTENT = b"\x00\x00\x00\x14ftypM4A \x00\x00\x00\x00mdat\x00\x01\x02\x03"

DUMMY_AUDIO_TRANSCRIPTION_REQUEST = {
    "file": ("test_audio.m4a", BINARY_CONTENT),
    "model": "whisper-large-v3-turbo",
}

DUMMY_AUDIO_TRANSCRIPTION_RESPONSE = Transcription(text="Test audio", x_groq={"id": "req_test"})


def test_audio_transcription_autolog():
    mlflow.groq.autolog()
    client = groq.Groq()

    with patch("groq._client.Groq.post", return_value=DUMMY_AUDIO_TRANSCRIPTION_RESPONSE):
        client.audio.transcriptions.create(**DUMMY_AUDIO_TRANSCRIPTION_REQUEST)

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 1
    span = traces[0].data.spans[0]
    assert span.name == "Transcriptions"
    assert span.span_type == SpanType.LLM
    assert span.inputs["file"][0] == DUMMY_AUDIO_TRANSCRIPTION_REQUEST["file"][0]
    assert span.inputs["file"][1] == str(DUMMY_AUDIO_TRANSCRIPTION_REQUEST["file"][1])
    assert span.inputs["model"] == DUMMY_AUDIO_TRANSCRIPTION_REQUEST["model"]
    assert span.outputs == DUMMY_AUDIO_TRANSCRIPTION_RESPONSE.to_dict(exclude_unset=False)

    mlflow.groq.autolog(disable=True)
    client = groq.Groq()

    with patch("groq._client.Groq.post", return_value=DUMMY_AUDIO_TRANSCRIPTION_RESPONSE):
        client.audio.transcriptions.create(**DUMMY_AUDIO_TRANSCRIPTION_REQUEST)

    # No new trace should be created
    traces = get_traces()
    assert len(traces) == 1


DUMMY_AUDIO_TRANSLATION_REQUEST = {
    "file": ("test_audio.m4a", BINARY_CONTENT),
    "model": "whisper-large-v3",
}

DUMMY_AUDIO_TRANSLATION_RESPONSE = Translation(text="Test audio", x_groq={"id": "req_test"})


def test_audio_translation_autolog():
    mlflow.groq.autolog()
    client = groq.Groq()

    with patch("groq._client.Groq.post", return_value=DUMMY_AUDIO_TRANSLATION_RESPONSE):
        client.audio.translations.create(**DUMMY_AUDIO_TRANSLATION_REQUEST)

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 1
    span = traces[0].data.spans[0]
    assert span.name == "Translations"
    assert span.span_type == SpanType.LLM
    assert span.inputs["file"][0] == DUMMY_AUDIO_TRANSLATION_REQUEST["file"][0]
    assert span.inputs["file"][1] == str(DUMMY_AUDIO_TRANSLATION_REQUEST["file"][1])
    assert span.inputs["model"] == DUMMY_AUDIO_TRANSLATION_REQUEST["model"]
    assert span.outputs == DUMMY_AUDIO_TRANSLATION_RESPONSE.to_dict(exclude_unset=False)

    mlflow.groq.autolog(disable=True)
    client = groq.Groq()

    with patch("groq._client.Groq.post", return_value=DUMMY_AUDIO_TRANSLATION_RESPONSE):
        client.audio.translations.create(**DUMMY_AUDIO_TRANSLATION_REQUEST)

    # No new trace should be created
    traces = get_traces()
    assert len(traces) == 1
```

--------------------------------------------------------------------------------

---[FILE: test_h2o_model_export.py]---
Location: mlflow-master/tests/h2o/test_h2o_model_export.py

```python
# pep8: disable=E501

import json
import os
from typing import Any, NamedTuple
from unittest import mock

import h2o
import numpy as np
import pandas as pd
import pytest
import yaml
from h2o.estimators.gbm import H2OGradientBoostingEstimator
from sklearn import datasets

import mlflow
import mlflow.h2o
import mlflow.pyfunc.scoring_server as pyfunc_scoring_server
from mlflow import pyfunc
from mlflow.models import Model, ModelSignature
from mlflow.models.utils import _read_example, load_serving_example
from mlflow.tracking.artifact_utils import _download_artifact_from_uri
from mlflow.types import DataType
from mlflow.types.schema import ColSpec, Schema
from mlflow.utils.environment import _mlflow_conda_env
from mlflow.utils.file_utils import TempDir
from mlflow.utils.model_utils import _get_flavor_configuration

from tests.helper_functions import (
    _assert_pip_requirements,
    _compare_conda_env_requirements,
    _compare_logged_code_paths,
    _mlflow_major_version_string,
    pyfunc_serve_and_score_model,
)


class ModelWithData(NamedTuple):
    model: Any
    inference_data: Any


@pytest.fixture
def h2o_iris_model():
    h2o.init()
    iris = datasets.load_iris()
    data = h2o.H2OFrame(
        {
            "feature1": list(iris.data[:, 0]),
            "feature2": list(iris.data[:, 1]),
            "target": ([f"Flower {i}" for i in iris.target]),
        }
    )
    train, test = data.split_frame(ratios=[0.7])

    h2o_gbm = H2OGradientBoostingEstimator(ntrees=10, max_depth=6)
    h2o_gbm.train(["feature1", "feature2"], "target", training_frame=train)
    return ModelWithData(model=h2o_gbm, inference_data=test)


@pytest.fixture(scope="module")
def h2o_iris_model_signature():
    return ModelSignature(
        inputs=Schema(
            [
                ColSpec(name="feature1", type=DataType.double),
                ColSpec(name="feature2", type=DataType.double),
                ColSpec(name="target", type=DataType.string),
            ]
        ),
        outputs=Schema(
            [
                ColSpec(name="predict", type=DataType.string),
                ColSpec(name="Flower 0", type=DataType.double),
                ColSpec(name="Flower 1", type=DataType.double),
                ColSpec(name="Flower 2", type=DataType.double),
            ]
        ),
    )


@pytest.fixture
def model_path(tmp_path):
    return os.path.join(tmp_path, "model")


@pytest.fixture
def h2o_custom_env(tmp_path):
    conda_env = os.path.join(tmp_path, "conda_env.yml")
    _mlflow_conda_env(conda_env, additional_pip_deps=["h2o", "pytest"])
    return conda_env


def test_model_save_load(h2o_iris_model, model_path):
    h2o_model = h2o_iris_model.model
    mlflow.h2o.save_model(h2o_model=h2o_model, path=model_path)

    # Loading h2o model
    h2o_model_loaded = mlflow.h2o.load_model(model_path)
    assert all(
        h2o_model_loaded.predict(h2o_iris_model.inference_data).as_data_frame()
        == h2o_model.predict(h2o_iris_model.inference_data).as_data_frame()
    )

    # Loading pyfunc model
    pyfunc_loaded = mlflow.pyfunc.load_model(model_path)
    assert all(
        pyfunc_loaded.predict(h2o_iris_model.inference_data.as_data_frame())
        == h2o_model.predict(h2o_iris_model.inference_data).as_data_frame()
    )


def test_signature_and_examples_are_saved_correctly(h2o_iris_model, h2o_iris_model_signature):
    model = h2o_iris_model.model
    example_ = h2o_iris_model.inference_data.as_data_frame().head(3)
    for signature in (None, h2o_iris_model_signature):
        for example in (None, example_):
            with TempDir() as tmp:
                path = tmp.path("model")
                mlflow.h2o.save_model(model, path=path, signature=signature, input_example=example)
                mlflow_model = Model.load(path)
                if signature is None and example is None:
                    assert mlflow_model.signature is None
                else:
                    assert mlflow_model.signature == h2o_iris_model_signature
                if example is None:
                    assert mlflow_model.saved_input_example_info is None
                else:
                    assert all((_read_example(mlflow_model, path) == example).all())


def test_model_log(h2o_iris_model):
    h2o_model = h2o_iris_model.model
    try:
        artifact_path = "gbm_model"
        model_info = mlflow.h2o.log_model(h2o_model, name=artifact_path)
        # Load model
        h2o_model_loaded = mlflow.h2o.load_model(model_uri=model_info.model_uri)
        assert all(
            h2o_model_loaded.predict(h2o_iris_model.inference_data).as_data_frame()
            == h2o_model.predict(h2o_iris_model.inference_data).as_data_frame()
        )
    finally:
        mlflow.end_run()


def test_model_load_succeeds_with_missing_data_key_when_data_exists_at_default_path(
    h2o_iris_model, model_path
):
    """
    This is a backwards compatibility test to ensure that models saved in MLflow version <= 0.7.0
    can be loaded successfully. These models are missing the `data` flavor configuration key.
    """
    h2o_model = h2o_iris_model.model
    mlflow.h2o.save_model(h2o_model=h2o_model, path=model_path)

    model_conf_path = os.path.join(model_path, "MLmodel")
    model_conf = Model.load(model_conf_path)
    flavor_conf = model_conf.flavors.get(mlflow.h2o.FLAVOR_NAME, None)
    assert flavor_conf is not None
    del flavor_conf["data"]
    model_conf.save(model_conf_path)

    h2o_model_loaded = mlflow.h2o.load_model(model_path)
    assert all(
        h2o_model_loaded.predict(h2o_iris_model.inference_data).as_data_frame()
        == h2o_model.predict(h2o_iris_model.inference_data).as_data_frame()
    )


def test_model_save_persists_specified_conda_env_in_mlflow_model_directory(
    h2o_iris_model, model_path, h2o_custom_env
):
    mlflow.h2o.save_model(h2o_model=h2o_iris_model.model, path=model_path, conda_env=h2o_custom_env)

    pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
    saved_conda_env_path = os.path.join(model_path, pyfunc_conf[pyfunc.ENV]["conda"])
    assert os.path.exists(saved_conda_env_path)
    assert saved_conda_env_path != h2o_custom_env

    with open(h2o_custom_env) as f:
        h2o_custom_env_text = f.read()
    with open(saved_conda_env_path) as f:
        saved_conda_env_text = f.read()
    assert saved_conda_env_text == h2o_custom_env_text


def test_model_save_persists_requirements_in_mlflow_model_directory(
    h2o_iris_model, model_path, h2o_custom_env
):
    mlflow.h2o.save_model(h2o_model=h2o_iris_model.model, path=model_path, conda_env=h2o_custom_env)

    saved_pip_req_path = os.path.join(model_path, "requirements.txt")
    _compare_conda_env_requirements(h2o_custom_env, saved_pip_req_path)


def test_log_model_with_pip_requirements(h2o_iris_model, tmp_path):
    expected_mlflow_version = _mlflow_major_version_string()
    # Path to a requirements file
    req_file = tmp_path.joinpath("requirements.txt")
    req_file.write_text("a")
    with mlflow.start_run():
        model_info = mlflow.h2o.log_model(
            h2o_iris_model.model, name="model", pip_requirements=str(req_file)
        )
        _assert_pip_requirements(model_info.model_uri, [expected_mlflow_version, "a"], strict=True)

    # List of requirements
    with mlflow.start_run():
        model_info = mlflow.h2o.log_model(
            h2o_iris_model.model,
            name="model",
            pip_requirements=[f"-r {req_file}", "b"],
        )
        _assert_pip_requirements(
            model_info.model_uri, [expected_mlflow_version, "a", "b"], strict=True
        )

    # Constraints file
    with mlflow.start_run():
        model_info = mlflow.h2o.log_model(
            h2o_iris_model.model, name="model", pip_requirements=[f"-c {req_file}", "b"]
        )
        _assert_pip_requirements(
            model_info.model_uri,
            [expected_mlflow_version, "b", "-c constraints.txt"],
            ["a"],
            strict=True,
        )


def test_log_model_with_extra_pip_requirements(h2o_iris_model, tmp_path):
    expected_mlflow_version = _mlflow_major_version_string()
    default_reqs = mlflow.h2o.get_default_pip_requirements()

    # Path to a requirements file
    req_file = tmp_path.joinpath("requirements.txt")
    req_file.write_text("a")
    with mlflow.start_run():
        model_info = mlflow.h2o.log_model(
            h2o_iris_model.model, name="model", extra_pip_requirements=str(req_file)
        )
        _assert_pip_requirements(
            model_info.model_uri, [expected_mlflow_version, *default_reqs, "a"]
        )

    # List of requirements
    with mlflow.start_run():
        model_info = mlflow.h2o.log_model(
            h2o_iris_model.model, name="model", extra_pip_requirements=[f"-r {req_file}", "b"]
        )
        _assert_pip_requirements(
            model_info.model_uri, [expected_mlflow_version, *default_reqs, "a", "b"]
        )

    # Constraints file
    with mlflow.start_run():
        model_info = mlflow.h2o.log_model(
            h2o_iris_model.model, name="model", extra_pip_requirements=[f"-c {req_file}", "b"]
        )
        _assert_pip_requirements(
            model_info.model_uri,
            [expected_mlflow_version, *default_reqs, "b", "-c constraints.txt"],
            ["a"],
        )


def test_model_save_accepts_conda_env_as_dict(h2o_iris_model, model_path):
    conda_env = dict(mlflow.h2o.get_default_conda_env())
    conda_env["dependencies"].append("pytest")
    mlflow.h2o.save_model(h2o_model=h2o_iris_model.model, path=model_path, conda_env=conda_env)

    pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
    saved_conda_env_path = os.path.join(model_path, pyfunc_conf[pyfunc.ENV]["conda"])
    assert os.path.exists(saved_conda_env_path)

    with open(saved_conda_env_path) as f:
        saved_conda_env_parsed = yaml.safe_load(f)
    assert saved_conda_env_parsed == conda_env


def test_model_log_persists_specified_conda_env_in_mlflow_model_directory(
    h2o_iris_model, h2o_custom_env
):
    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.h2o.log_model(
            h2o_iris_model.model, name=artifact_path, conda_env=h2o_custom_env
        )

    model_path = _download_artifact_from_uri(model_info.model_uri)
    pyfunc_conf = _get_flavor_configuration(model_path=model_path, flavor_name=pyfunc.FLAVOR_NAME)
    saved_conda_env_path = os.path.join(model_path, pyfunc_conf[pyfunc.ENV]["conda"])
    assert os.path.exists(saved_conda_env_path)
    assert saved_conda_env_path != h2o_custom_env

    with open(h2o_custom_env) as f:
        h2o_custom_env_text = f.read()
    with open(saved_conda_env_path) as f:
        saved_conda_env_text = f.read()
    assert saved_conda_env_text == h2o_custom_env_text


def test_model_log_persists_requirements_in_mlflow_model_directory(h2o_iris_model, h2o_custom_env):
    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.h2o.log_model(
            h2o_iris_model.model, name=artifact_path, conda_env=h2o_custom_env
        )
        model_path = _download_artifact_from_uri(model_info.model_uri)

    saved_pip_req_path = os.path.join(model_path, "requirements.txt")
    _compare_conda_env_requirements(h2o_custom_env, saved_pip_req_path)


def test_model_save_without_specified_conda_env_uses_default_env_with_expected_dependencies(
    h2o_iris_model, model_path
):
    mlflow.h2o.save_model(h2o_model=h2o_iris_model.model, path=model_path)
    _assert_pip_requirements(model_path, mlflow.h2o.get_default_pip_requirements())


def test_model_log_without_specified_conda_env_uses_default_env_with_expected_dependencies(
    h2o_iris_model,
):
    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.h2o.log_model(h2o_iris_model.model, name=artifact_path)
    _assert_pip_requirements(model_info.model_uri, mlflow.h2o.get_default_pip_requirements())


def test_pyfunc_serve_and_score(h2o_iris_model):
    model, inference_dataframe = h2o_iris_model
    artifact_path = "model"
    with mlflow.start_run():
        model_info = mlflow.h2o.log_model(
            model, name=artifact_path, input_example=inference_dataframe.as_data_frame()
        )

    inference_payload = load_serving_example(model_info.model_uri)
    resp = pyfunc_serve_and_score_model(
        model_info.model_uri,
        data=inference_payload,
        content_type=pyfunc_scoring_server.CONTENT_TYPE_JSON,
    )
    decoded_json = json.loads(resp.content.decode("utf-8"))
    scores = pd.DataFrame(data=decoded_json["predictions"]).drop("predict", axis=1)
    preds = model.predict(inference_dataframe).as_data_frame().drop("predict", axis=1)
    np.testing.assert_array_almost_equal(scores, preds)


def test_log_model_with_code_paths(h2o_iris_model):
    with (
        mlflow.start_run(),
        mock.patch("mlflow.h2o._add_code_from_conf_to_system_path") as add_mock,
    ):
        model_info = mlflow.h2o.log_model(
            h2o_iris_model.model, name="model_uri", code_paths=[__file__]
        )
        _compare_logged_code_paths(__file__, model_info.model_uri, mlflow.h2o.FLAVOR_NAME)
        mlflow.h2o.load_model(model_info.model_uri)
        add_mock.assert_called()


def test_model_save_load_with_metadata(h2o_iris_model, model_path):
    mlflow.h2o.save_model(
        h2o_iris_model.model, path=model_path, metadata={"metadata_key": "metadata_value"}
    )

    reloaded_model = mlflow.pyfunc.load_model(model_uri=model_path)
    assert reloaded_model.metadata.metadata["metadata_key"] == "metadata_value"


def test_model_log_with_metadata(h2o_iris_model):
    with mlflow.start_run():
        model_info = mlflow.h2o.log_model(
            h2o_iris_model.model,
            name="model",
            metadata={"metadata_key": "metadata_value"},
        )

    reloaded_model = mlflow.pyfunc.load_model(model_uri=model_info.model_uri)
    assert reloaded_model.metadata.metadata["metadata_key"] == "metadata_value"


def test_model_log_with_signature_inference(h2o_iris_model, h2o_iris_model_signature):
    artifact_path = "model"
    example = h2o_iris_model.inference_data.as_data_frame().head(3)

    with mlflow.start_run():
        model_info = mlflow.h2o.log_model(
            h2o_iris_model.model, name=artifact_path, input_example=example
        )

    mlflow_model = Model.load(model_info.model_uri)
    assert mlflow_model.signature == h2o_iris_model_signature
```

--------------------------------------------------------------------------------

---[FILE: test_haystack_tracing.py]---
Location: mlflow-master/tests/haystack/test_haystack_tracing.py

```python
from unittest.mock import patch

from haystack import Document, Pipeline, component
from haystack.components.rankers import LostInTheMiddleRanker
from haystack.components.retrievers import InMemoryBM25Retriever
from haystack.document_stores.in_memory import InMemoryDocumentStore

import mlflow
from mlflow.entities import SpanType
from mlflow.tracing.constant import SpanAttributeKey

from tests.tracing.helper import get_traces


@component
class Add:
    def run(self, a: int, b: int):
        return {"sum": a + b}


@component
class Multiply:
    def run(self, value: int, factor: int):
        return {"product": value * factor}


def test_haystack_autolog_single_trace():
    mlflow.haystack.autolog()

    pipe = Pipeline()
    pipe.add_component("adder", Add())
    pipe.run({"adder": {"a": 1, "b": 2}})

    traces = get_traces()
    assert len(traces) == 1
    spans = traces[0].data.spans
    assert spans[0].span_type == SpanType.CHAIN
    assert spans[0].name == "haystack.pipeline.run"
    assert spans[0].inputs == {"adder": {"a": 1, "b": 2}}
    assert spans[0].outputs == {"adder": {"sum": 3}}
    assert spans[1].span_type == SpanType.TOOL
    assert spans[1].name == "Add"
    assert spans[1].inputs == {"a": 1, "b": 2}
    assert spans[1].outputs == {"sum": 3}

    mlflow.haystack.autolog(disable=True)
    pipe.run({"adder": {"a": 3, "b": 4}})
    assert len(get_traces()) == 1


def test_pipeline_with_multiple_components_single_trace():
    mlflow.haystack.autolog()

    pipe = Pipeline()
    pipe.add_component("adder", Add())
    pipe.add_component("multiplier", Multiply())

    pipe.run({"adder": {"a": 1, "b": 2}, "multiplier": {"value": 3, "factor": 4}})

    traces = get_traces()
    assert len(traces) == 1
    spans = traces[0].data.spans
    assert spans[0].span_type == SpanType.CHAIN
    assert spans[0].name == "haystack.pipeline.run"
    assert spans[1].span_type == SpanType.TOOL
    assert spans[2].span_type == SpanType.TOOL
    assert spans[1].name == "Add"
    assert spans[2].name == "Multiply"
    assert spans[1].inputs == {"a": 1, "b": 2}
    assert spans[1].outputs == {"sum": 3}
    assert spans[2].inputs == {"value": 3, "factor": 4}
    assert spans[2].outputs == {"product": 12}

    mlflow.haystack.autolog(disable=True)
    pipe.run({"adder": {"a": 1, "b": 2}, "multiplier": {"value": 3, "factor": 4}})

    traces = get_traces()
    assert len(traces) == 1


def test_token_usage_parsed_for_llm_component():
    mlflow.haystack.autolog()

    @component
    class MyLLM:
        def run(self, prompt: str):
            return {}

    pipe = Pipeline()
    pipe.add_component("my_llm", MyLLM())

    output = {
        "replies": [
            {
                "content": [{"text": "hi"}],
                "meta": {"usage": {"prompt_tokens": 1, "completion_tokens": 2, "total_tokens": 3}},
            }
        ]
    }

    with patch.object(MyLLM, "run", return_value=output):
        pipe.run({"my_llm": {"prompt": "hello"}})

    traces = get_traces()
    assert len(traces) == 1
    span = traces[0].data.spans[1]
    assert span.span_type == SpanType.LLM
    assert span.name == "MyLLM"
    assert span.attributes[SpanAttributeKey.CHAT_USAGE] == {
        "input_tokens": 1,
        "output_tokens": 2,
        "total_tokens": 3,
    }

    mlflow.haystack.autolog(disable=True)

    traces = get_traces()
    with patch.object(MyLLM, "run", return_value=output):
        pipe.run({"my_llm": {"prompt": "hello"}})

    assert len(traces) == 1


def test_autolog_disable():
    mlflow.haystack.autolog()

    pipe1 = Pipeline()
    pipe1.add_component("adder", Add())
    pipe1.run({"adder": {"a": 1, "b": 2}})
    assert len(get_traces()) == 1

    mlflow.haystack.autolog(disable=True)
    pipe2 = Pipeline()
    pipe2.add_component("adder", Add())
    pipe2.run({"adder": {"a": 2, "b": 3}})
    assert len(get_traces()) == 1


def test_in_memory_retriever_component_traced():
    mlflow.set_experiment("haystack_retriever")
    mlflow.haystack.autolog()

    store = InMemoryDocumentStore()
    store.write_documents([Document(content="foo")])
    pipe = Pipeline()
    pipe.add_component("retriever", InMemoryBM25Retriever(document_store=store))
    pipe.run({"retriever": {"query": "foo"}})

    traces = get_traces()
    assert len(traces) == 1
    span = traces[0].data.spans[1]
    assert span.span_type == SpanType.RETRIEVER
    assert span.name == "InMemoryBM25Retriever"
    assert span.outputs["documents"][0]["content"] == "foo"


def test_multiple_components_in_pipeline_reranker():
    mlflow.haystack.autolog()

    pipe = Pipeline()
    store = InMemoryDocumentStore()
    store.write_documents([Document(content="foo")])

    pipe.add_component("retriever", InMemoryBM25Retriever(document_store=store))
    pipe.add_component("reranker", LostInTheMiddleRanker())

    pipe.connect("retriever.documents", "reranker.documents")

    pipe.run({"retriever": {"query": "foo"}})

    traces = get_traces()
    assert len(traces) == 1
    spans = traces[0].data.spans
    assert spans[0].span_type == SpanType.CHAIN
    assert spans[0].name == "haystack.pipeline.run"
    assert spans[1].name == "InMemoryBM25Retriever"
    assert spans[2].name == "LostInTheMiddleRanker"
    assert spans[1].span_type == SpanType.RETRIEVER
    assert spans[2].span_type == SpanType.RERANKER
    assert spans[1].inputs["query"] == "foo"
    assert spans[2].inputs["documents"][0]["content"] == "foo"

    mlflow.haystack.autolog(disable=True)
    pipe.run({"retriever": {"query": "foo"}})
    assert len(get_traces()) == 1
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/tests/integration/utils.py

```python
from click.testing import CliRunner


def invoke_cli_runner(*args, **kwargs):
    """
    Helper method to invoke the CliRunner while asserting that the exit code is actually 0.
    """

    res = CliRunner().invoke(*args, **kwargs)
    assert res.exit_code == 0, f"Got non-zero exit code {res.exit_code}. Output is: {res.output}"
    return res
```

--------------------------------------------------------------------------------

---[FILE: test_async_logging_integration.py]---
Location: mlflow-master/tests/integration/async_logging/test_async_logging_integration.py

```python
import io
import pickle
import time
import uuid

import pytest

import mlflow
from mlflow import MlflowClient
from mlflow.entities.metric import Metric
from mlflow.entities.param import Param
from mlflow.entities.run_tag import RunTag


@pytest.fixture(autouse=True)
def flush_async_logging():
    """Flush async logging after each test to avoid interference between tests"""
    yield
    mlflow.flush_async_logging()


def test_async_logging_mlflow_client_pickle():
    experiment_name = f"mlflow-async-logging-pickle-test-{str(uuid.uuid4())[:8]}"
    mlflow_client = MlflowClient()

    buffer = io.BytesIO()
    pickle.dump(mlflow_client, buffer)

    deserialized_mlflow_client = pickle.loads(buffer.getvalue())  # Type: MlflowClient
    experiment_id = deserialized_mlflow_client.create_experiment(experiment_name)

    run = deserialized_mlflow_client.create_run(experiment_id=experiment_id)
    run_id = run.info.run_id

    run_operations = []

    params_to_log = []
    param1 = Param("async param 1", "async param 1 value")
    run_operations.append(
        mlflow_client.log_param(run_id, param1.key, param1.value, synchronous=False)
    )
    params_to_log.append(param1)

    for run_operation in run_operations:
        run_operation.wait()
    run = mlflow_client.get_run(run_id)
    assert param1.key in run.data.params
    assert param1.value == run.data.params[param1.key]


def test_async_logging_mlflow_client():
    experiment_name = f"mlflow-async-logging-test-{str(uuid.uuid4())[:8]}"
    mlflow_client = MlflowClient()
    experiment_id = mlflow_client.create_experiment(experiment_name)

    run = mlflow_client.create_run(experiment_id=experiment_id)
    run_id = run.info.run_id

    run_operations = []

    params_to_log = []
    param1 = Param("async param 1", "async param 1 value")
    run_operations.append(
        mlflow_client.log_param(run_id, param1.key, param1.value, synchronous=False)
    )
    params_to_log.append(param1)

    tags_to_log = []
    tag1 = RunTag("async tag 1", "async tag 1 value")
    run_operations.append(mlflow_client.set_tag(run_id, tag1.key, tag1.value, synchronous=False))
    tags_to_log.append(tag1)

    metrics_to_log = []
    metric1 = Metric("async metric 1", 1, 132, 0)
    run_operations.append(
        mlflow_client.log_metric(
            run_id, metric1.key, metric1.value, metric1.timestamp, metric1.step, synchronous=False
        )
    )
    metrics_to_log.append(metric1)

    # Log batch of metrics
    metric_value = 1
    for _ in range(1, 5):
        metrics = []
        guid8 = str(uuid.uuid4())[:8]
        params = [Param(f"batch param-{guid8}-{val}", value=str(val)) for val in range(1)]
        tags = [RunTag(f"batch tag-{guid8}-{val}", value=str(val)) for val in range(1)]
        for _ in range(0, 50):
            metric_value += 1
            metrics.append(
                Metric(
                    key=f"batch metrics async-{metric_value}",
                    value=time.time(),
                    timestamp=metric_value,
                    step=0,
                )
            )

        params_to_log.extend(params)
        tags_to_log.extend(tags)
        metrics_to_log.extend(metrics)
        run_operation = mlflow_client.log_batch(
            run_id,
            params=params,
            tags=tags,
            metrics=metrics,
            synchronous=False,
        )
        run_operations.append(run_operation)

    # Terminate the run before async operations are completed
    # The remaining operations should still be processed
    mlflow_client.set_terminated(run_id=run_id, status="FINISHED", end_time=time.time())

    for run_operation in run_operations:
        run_operation.wait()

    run = mlflow_client.get_run(run_id)
    for tag in tags_to_log:
        assert tag.key in run.data.tags
        assert tag.value == run.data.tags[tag.key]
    for param in params_to_log:
        assert param.key in run.data.params
        assert param.value == run.data.params[param.key]
    for metric in metrics_to_log:
        assert metric.key in run.data.metrics
        assert metric.value == run.data.metrics[metric.key]


def test_async_logging_fluent():
    experiment_name = f"mlflow-async-logging-test-{str(uuid.uuid4())[:8]}"
    experiment_id = mlflow.create_experiment(experiment_name)

    run_operations = []

    with mlflow.start_run(experiment_id=experiment_id) as run:
        run_id = run.info.run_id
        params_to_log = []
        param1 = Param("async param 1", "async param 1 value")
        run_operations.append(mlflow.log_param(param1.key, param1.value, synchronous=False))
        params_to_log.append(param1)

        tags_to_log = []
        tag1 = RunTag("async tag 1", "async tag 1 value")
        run_operations.append(mlflow.set_tag(tag1.key, tag1.value, synchronous=False))
        tags_to_log.append(tag1)

        metrics_to_log = []
        metric1 = Metric("async metric 1", 1, 432, 0)
        run_operations.append(mlflow.log_metric(metric1.key, metric1.value, synchronous=False))
        metrics_to_log.append(metric1)

        # Log batch of metrics
        metric_value = 1
        for _ in range(1, 5):
            metrics = []
            guid8 = str(uuid.uuid4())[:8]
            params = [Param(f"batch param-{guid8}-{val}", value=str(val)) for val in range(5)]
            tags = [RunTag(f"batch tag-{guid8}-{val}", value=str(val)) for val in range(5)]
            for _ in range(0, 50):
                metric_value += 1
                metrics.append(
                    Metric(
                        key=f"batch metrics async-{metric_value}",
                        value=time.time(),
                        timestamp=metric_value,
                        step=0,
                    )
                )

            params_to_log.extend(params)
            run_operation = mlflow.log_params(
                params={param.key: param.value for param in params},
                synchronous=False,
            )
            run_operations.append(run_operation)

            tags_to_log.extend(tags)
            run_operation = mlflow.set_tags(
                tags={tag.key: tag.value for tag in tags},
                synchronous=False,
            )
            run_operations.append(run_operation)

            metrics_to_log.extend(metrics)
            run_operation = mlflow.log_metrics(
                metrics={metric.key: metric.value for metric in metrics},
                step=1,
                synchronous=False,
            )
            run_operations.append(run_operation)

    for run_operation in run_operations:
        run_operation.wait()

    run = mlflow.run
    run = mlflow.get_run(run_id)
    for tag in tags_to_log:
        assert tag.key in run.data.tags
        assert tag.value == run.data.tags[tag.key]
    for param in params_to_log:
        assert param.key in run.data.params
        assert param.value == run.data.params[param.key]
    for metric in metrics_to_log:
        assert metric.key in run.data.metrics
        assert metric.value == run.data.metrics[metric.key]


def test_async_logging_fluent_check_batch_split():
    # Check that batch is split into multiple requests if it exceeds the maximum size
    # and if we wait for RunOperations returned then at the end everything should be logged.
    experiment_name = f"mlflow-async-logging-test-{str(uuid.uuid4())[:8]}"
    experiment_id = mlflow.create_experiment(experiment_name)

    run_operations = []

    with mlflow.start_run(experiment_id=experiment_id) as run:
        run_id = run.info.run_id

        metrics_to_log = {
            f"batch metrics async-{metric_value}": metric_value for metric_value in range(0, 10000)
        }

        run_operations = mlflow.log_metrics(
            metrics=metrics_to_log,
            step=1,
            synchronous=False,
        )

        run_operations.wait()

    # Total 10000 metrics logged, max batch size =1000, so 10 requests will be sent.
    assert len(run_operations._operation_futures) == 10

    run = mlflow.run
    run = mlflow.get_run(run_id)
    for metric_key, metric_value in metrics_to_log.items():
        assert metric_key in run.data.metrics
        assert metric_value == run.data.metrics[metric_key]
```

--------------------------------------------------------------------------------

````
