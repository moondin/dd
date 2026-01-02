---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 867
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 867 of 991)

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

---[FILE: test_openai_model_export.py]---
Location: mlflow-master/tests/openai/test_openai_model_export.py

```python
import importlib
import json
from unittest import mock

import numpy as np
import openai
import pandas as pd
import pytest
import yaml
from pyspark.sql import SparkSession

import mlflow
import mlflow.pyfunc.scoring_server as pyfunc_scoring_server
from mlflow.models.signature import ModelSignature
from mlflow.models.utils import load_serving_example
from mlflow.types.schema import ColSpec, ParamSchema, ParamSpec, Schema, TensorSpec

from tests.helper_functions import pyfunc_serve_and_score_model
from tests.openai.conftest import is_v1


@pytest.fixture(scope="module")
def spark():
    with SparkSession.builder.master("local[*]").getOrCreate() as s:
        yield s


def chat_completions():
    return openai.chat.completions if is_v1 else openai.ChatCompletion


def completions():
    return openai.completions if is_v1 else openai.Completion


def embeddings():
    return openai.embeddings if is_v1 else openai.Embedding


@pytest.fixture(autouse=True)
def set_envs(monkeypatch, mock_openai):
    monkeypatch.setenv("MLFLOW_TESTING", "true")
    monkeypatch.setenv("OPENAI_API_KEY", "test")
    monkeypatch.setenv("OPENAI_API_BASE", mock_openai)
    if is_v1:
        openai.base_url = mock_openai
    else:
        importlib.reload(openai)


def test_log_model():
    with mlflow.start_run():
        model_info = mlflow.openai.log_model(
            "gpt-4o-mini",
            "chat.completions",
            name="model",
            temperature=0.9,
            messages=[{"role": "system", "content": "You are an MLflow expert."}],
        )

    loaded_model = mlflow.openai.load_model(model_info.model_uri)
    assert loaded_model["model"] == "gpt-4o-mini"
    assert loaded_model["task"] == "chat.completions"
    assert loaded_model["temperature"] == 0.9
    assert loaded_model["messages"] == [{"role": "system", "content": "You are an MLflow expert."}]


def test_chat_single_variable(tmp_path):
    mlflow.openai.save_model(
        model="gpt-4o-mini",
        task=chat_completions(),
        path=tmp_path,
        messages=[{"role": "user", "content": "{x}"}],
    )

    model = mlflow.pyfunc.load_model(tmp_path)
    data = pd.DataFrame(
        {
            "x": [
                "a",
                "b",
            ]
        }
    )
    expected_output = [
        [{"content": "a", "role": "user"}],
        [{"content": "b", "role": "user"}],
    ]
    assert list(map(json.loads, model.predict(data))) == expected_output

    data = [
        {"x": "a"},
        {"x": "b"},
    ]
    assert list(map(json.loads, model.predict(data))) == expected_output

    data = [
        "a",
        "b",
    ]
    assert list(map(json.loads, model.predict(data))) == expected_output


def test_completion_single_variable(tmp_path):
    mlflow.openai.save_model(
        model="text-davinci-003",
        task=completions(),
        path=tmp_path,
        prompt="Say {text}",
    )

    model = mlflow.pyfunc.load_model(tmp_path)
    data = pd.DataFrame(
        {
            "x": [
                "this is a test",
                "this is another test",
            ]
        }
    )
    expected_output = ["Say this is a test", "Say this is another test"]
    assert model.predict(data) == expected_output

    data = [
        {"x": "this is a test"},
        {"x": "this is another test"},
    ]
    assert model.predict(data) == expected_output

    data = [
        "this is a test",
        "this is another test",
    ]
    assert model.predict(data) == expected_output


def test_chat_multiple_variables(tmp_path):
    mlflow.openai.save_model(
        model="gpt-4o-mini",
        task=chat_completions(),
        path=tmp_path,
        messages=[{"role": "user", "content": "{x} {y}"}],
    )
    model = mlflow.models.Model.load(tmp_path)
    assert model.signature.inputs.to_dict() == [
        {"name": "x", "type": "string", "required": True},
        {"name": "y", "type": "string", "required": True},
    ]
    assert model.signature.outputs.to_dict() == [
        {"type": "string", "required": True},
    ]

    model = mlflow.pyfunc.load_model(tmp_path)
    data = pd.DataFrame(
        {
            "x": [
                "a",
                "b",
            ],
            "y": [
                "c",
                "d",
            ],
        }
    )
    expected_output = [
        [{"content": "a c", "role": "user"}],
        [{"content": "b d", "role": "user"}],
    ]
    assert list(map(json.loads, model.predict(data))) == expected_output

    data = [
        {"x": "a", "y": "c"},
        {"x": "b", "y": "d"},
    ]
    assert list(map(json.loads, model.predict(data))) == expected_output


def test_chat_role_content(tmp_path):
    mlflow.openai.save_model(
        model="gpt-4o-mini",
        task=chat_completions(),
        path=tmp_path,
        messages=[{"role": "{role}", "content": "{content}"}],
    )
    model = mlflow.models.Model.load(tmp_path)
    assert model.signature.inputs.to_dict() == [
        {"name": "content", "type": "string", "required": True},
        {"name": "role", "type": "string", "required": True},
    ]
    assert model.signature.outputs.to_dict() == [
        {"type": "string", "required": True},
    ]

    model = mlflow.pyfunc.load_model(tmp_path)
    data = pd.DataFrame(
        {
            "role": [
                "system",
                "user",
            ],
            "content": [
                "c",
                "d",
            ],
        }
    )
    expected_output = [
        [{"content": "c", "role": "system"}],
        [{"content": "d", "role": "user"}],
    ]
    assert list(map(json.loads, model.predict(data))) == expected_output


def test_completion_multiple_variables(tmp_path):
    mlflow.openai.save_model(
        model="text-davinci-003",
        task=completions(),
        path=tmp_path,
        prompt="Say {x} and {y}",
    )
    model = mlflow.models.Model.load(tmp_path)
    assert model.signature.inputs.to_dict() == [
        {"name": "x", "type": "string", "required": True},
        {"name": "y", "type": "string", "required": True},
    ]
    assert model.signature.outputs.to_dict() == [
        {"type": "string", "required": True},
    ]

    model = mlflow.pyfunc.load_model(tmp_path)
    data = pd.DataFrame(
        {
            "x": [
                "a",
                "b",
            ],
            "y": [
                "c",
                "d",
            ],
        }
    )
    expected_output = ["Say a and c", "Say b and d"]
    assert model.predict(data) == expected_output

    data = [
        {"x": "a", "y": "c"},
        {"x": "b", "y": "d"},
    ]
    assert model.predict(data) == expected_output


def test_chat_multiple_messages(tmp_path):
    mlflow.openai.save_model(
        model="gpt-4o-mini",
        task=chat_completions(),
        path=tmp_path,
        messages=[
            {"role": "user", "content": "{x}"},
            {"role": "user", "content": "{y}"},
        ],
    )
    model = mlflow.models.Model.load(tmp_path)
    assert model.signature.inputs.to_dict() == [
        {"name": "x", "type": "string", "required": True},
        {"name": "y", "type": "string", "required": True},
    ]
    assert model.signature.outputs.to_dict() == [
        {"type": "string", "required": True},
    ]

    model = mlflow.pyfunc.load_model(tmp_path)
    data = pd.DataFrame(
        {
            "x": [
                "a",
                "b",
            ],
            "y": [
                "c",
                "d",
            ],
        }
    )
    expected_output = [
        [{"content": "a", "role": "user"}, {"content": "c", "role": "user"}],
        [{"content": "b", "role": "user"}, {"content": "d", "role": "user"}],
    ]
    assert list(map(json.loads, model.predict(data))) == expected_output

    data = [
        {"x": "a", "y": "c"},
        {"x": "b", "y": "d"},
    ]
    assert list(map(json.loads, model.predict(data))) == expected_output


def test_chat_no_variables(tmp_path):
    mlflow.openai.save_model(
        model="gpt-4o-mini",
        task=chat_completions(),
        path=tmp_path,
        messages=[{"role": "user", "content": "a"}],
    )
    model = mlflow.models.Model.load(tmp_path)
    assert model.signature.inputs.to_dict() == [
        {"type": "string", "required": True},
    ]
    assert model.signature.outputs.to_dict() == [
        {"type": "string", "required": True},
    ]

    model = mlflow.pyfunc.load_model(tmp_path)
    data = pd.DataFrame(
        {
            "content": ["b", "c"],
        }
    )
    expected_output = [
        [{"content": "a", "role": "user"}, {"content": "b", "role": "user"}],
        [{"content": "a", "role": "user"}, {"content": "c", "role": "user"}],
    ]
    assert list(map(json.loads, model.predict(data))) == expected_output

    data = [
        {"content": "b"},
        {"content": "c"},
    ]
    assert list(map(json.loads, model.predict(data))) == expected_output

    data = [
        "b",
        "c",
    ]
    assert list(map(json.loads, model.predict(data))) == expected_output


def test_completion_no_variable(tmp_path):
    mlflow.openai.save_model(
        model="text-davinci-003",
        task=completions(),
        path=tmp_path,
    )

    model = mlflow.pyfunc.load_model(tmp_path)
    data = pd.DataFrame(
        {
            "x": [
                "this is a test",
                "this is another test",
            ]
        }
    )
    expected_output = ["this is a test", "this is another test"]
    assert model.predict(data) == expected_output

    data = [
        {"x": "this is a test"},
        {"x": "this is another test"},
    ]
    assert model.predict(data) == expected_output

    data = [
        "this is a test",
        "this is another test",
    ]
    assert model.predict(data) == expected_output


def test_chat_no_messages(tmp_path):
    mlflow.openai.save_model(
        model="gpt-4o-mini",
        task=chat_completions(),
        path=tmp_path,
    )
    model = mlflow.models.Model.load(tmp_path)
    assert model.signature.inputs.to_dict() == [
        {"type": "string", "required": True},
    ]
    assert model.signature.outputs.to_dict() == [
        {"type": "string", "required": True},
    ]

    model = mlflow.pyfunc.load_model(tmp_path)
    data = pd.DataFrame(
        {
            "content": ["b", "c"],
        }
    )
    expected_output = [
        [{"content": "b", "role": "user"}],
        [{"content": "c", "role": "user"}],
    ]
    assert list(map(json.loads, model.predict(data))) == expected_output

    data = [
        {"content": "b"},
        {"content": "c"},
    ]
    assert list(map(json.loads, model.predict(data))) == expected_output

    data = [
        "b",
        "c",
    ]
    assert list(map(json.loads, model.predict(data))) == expected_output


@pytest.mark.parametrize(
    "messages",
    [
        ["a", "b"],
        [{"k": "v"}],
    ],
)
def test_invalid_messages(tmp_path, messages):
    with pytest.raises(
        mlflow.MlflowException,
        match="it must be a list of dictionaries with keys 'role' and 'content'",
    ):
        mlflow.openai.save_model(
            model="gpt-4o-mini",
            task=chat_completions(),
            path=tmp_path,
            messages=messages,
        )


def test_task_argument_accepts_class(tmp_path):
    mlflow.openai.save_model(model="gpt-4o-mini", task=chat_completions(), path=tmp_path)
    loaded_model = mlflow.openai.load_model(tmp_path)
    assert loaded_model["task"] == "chat.completions"


@pytest.mark.skipif(is_v1, reason="Requires OpenAI SDK v0")
def test_model_argument_accepts_retrieved_model(tmp_path):
    model = openai.Model.retrieve("gpt-4o-mini")
    mlflow.openai.save_model(model=model, task=chat_completions(), path=tmp_path)
    loaded_model = mlflow.openai.load_model(tmp_path)
    assert loaded_model["model"] == "gpt-4o-mini"


def test_save_model_with_secret_scope(tmp_path, monkeypatch):
    scope = "test"
    monkeypatch.setenv("MLFLOW_OPENAI_SECRET_SCOPE", scope)
    with (
        mock.patch("mlflow.openai.model.is_in_databricks_runtime", return_value=True),
        mock.patch("mlflow.openai.model.check_databricks_secret_scope_access"),
    ):
        with pytest.warns(FutureWarning, match="MLFLOW_OPENAI_SECRET_SCOPE.+deprecated"):
            mlflow.openai.save_model(model="gpt-4o-mini", task="chat.completions", path=tmp_path)
    with tmp_path.joinpath("openai.yaml").open() as f:
        creds = yaml.safe_load(f)
        assert creds == {
            "OPENAI_API_TYPE": f"{scope}:openai_api_type",
            "OPENAI_API_KEY": f"{scope}:openai_api_key",
            "OPENAI_API_KEY_PATH": f"{scope}:openai_api_key_path",
            "OPENAI_API_BASE": f"{scope}:openai_api_base",
            "OPENAI_BASE_URL": f"{scope}:openai_base_url",
            "OPENAI_ORGANIZATION": f"{scope}:openai_organization",
            "OPENAI_API_VERSION": f"{scope}:openai_api_version",
            "OPENAI_DEPLOYMENT_NAME": f"{scope}:openai_deployment_name",
            "OPENAI_ENGINE": f"{scope}:openai_engine",
        }


def test_spark_udf_chat(tmp_path, spark):
    mlflow.openai.save_model(
        model="gpt-4o-mini",
        task="chat.completions",
        path=tmp_path,
        messages=[
            {"role": "user", "content": "{x} {y}"},
        ],
    )
    udf = mlflow.pyfunc.spark_udf(spark, tmp_path, result_type="string")
    df = spark.createDataFrame(
        [
            ("a", "b"),
            ("c", "d"),
        ],
        ["x", "y"],
    )
    df = df.withColumn("z", udf())
    pdf = df.toPandas()
    assert list(map(json.loads, pdf["z"])) == [
        [{"content": "a b", "role": "user"}],
        [{"content": "c d", "role": "user"}],
    ]


class ChatCompletionModel(mlflow.pyfunc.PythonModel):
    def predict(self, context, model_input, params=None):
        completion = chat_completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "What is MLflow?"}],
        )
        return completion.choices[0].message.content


def test_embeddings(tmp_path):
    mlflow.openai.save_model(
        model="text-embedding-ada-002",
        task=embeddings(),
        path=tmp_path,
    )

    model = mlflow.models.Model.load(tmp_path)
    assert model.signature.inputs.to_dict() == [{"type": "string", "required": True}]
    assert model.signature.outputs.to_dict() == [
        {"type": "tensor", "tensor-spec": {"dtype": "float64", "shape": (-1,)}}
    ]

    model = mlflow.pyfunc.load_model(tmp_path)
    data = pd.DataFrame({"text": ["a", "b"]})
    preds = model.predict(data)
    assert list(map(len, preds)) == [1536, 1536]

    data = pd.DataFrame({"text": ["a"] * 100})
    preds = model.predict(data)
    assert list(map(len, preds)) == [1536] * 100


def test_embeddings_batch_size_azure(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENAI_API_TYPE", "azure")
    monkeypatch.setenv("OPENAI_ENGINE", "test_engine")
    mlflow.openai.save_model(
        model="text-embedding-ada-002",
        task=embeddings(),
        path=tmp_path,
    )
    model = mlflow.pyfunc.load_model(tmp_path)

    assert model._model_impl.api_config.batch_size == 16


def test_embeddings_pyfunc_server_and_score():
    df = pd.DataFrame({"text": ["a", "b"]})
    with mlflow.start_run():
        model_info = mlflow.openai.log_model(
            "text-embedding-ada-002",
            embeddings(),
            name="model",
            input_example=df,
        )
    inference_payload = load_serving_example(model_info.model_uri)
    resp = pyfunc_serve_and_score_model(
        model_info.model_uri,
        data=inference_payload,
        content_type=pyfunc_scoring_server.CONTENT_TYPE_JSON,
        extra_args=["--env-manager", "local"],
    )
    expected = mlflow.pyfunc.load_model(model_info.model_uri).predict(df)
    actual = pd.DataFrame(data=json.loads(resp.content.decode("utf-8")))
    pd.testing.assert_frame_equal(actual, pd.DataFrame({"predictions": expected}))


def test_spark_udf_embeddings(tmp_path, spark):
    mlflow.openai.save_model(
        model="text-embedding-ada-002",
        task=embeddings(),
        path=tmp_path,
    )
    udf = mlflow.pyfunc.spark_udf(spark, tmp_path, result_type="array<double>")
    df = spark.createDataFrame(
        [
            ("a",),
            ("b",),
        ],
        ["x"],
    )
    df = df.withColumn("z", udf("x")).toPandas()
    assert list(map(len, df["z"])) == [1536, 1536]


def test_inference_params(tmp_path):
    mlflow.openai.save_model(
        model="text-embedding-ada-002",
        task=embeddings(),
        path=tmp_path,
        signature=ModelSignature(
            inputs=Schema([ColSpec(type="string", name=None)]),
            outputs=Schema([TensorSpec(type=np.dtype("float64"), shape=(-1,))]),
            params=ParamSchema([ParamSpec(name="batch_size", dtype="long", default=16)]),
        ),
    )

    model_info = mlflow.models.Model.load(tmp_path)
    assert (
        len([p for p in model_info.signature.params if p.name == "batch_size" and p.default == 16])
        == 1
    )

    model = mlflow.pyfunc.load_model(tmp_path)
    data = pd.DataFrame({"text": ["a", "b"]})
    preds = model.predict(data, params={"batch_size": 5})
    assert list(map(len, preds)) == [1536, 1536]


def test_inference_params_overlap(tmp_path):
    with pytest.raises(mlflow.MlflowException, match=r"any of \['prefix'\] as parameters"):
        mlflow.openai.save_model(
            model="text-davinci-003",
            task=completions(),
            path=tmp_path,
            prefix="Classify the following text's sentiment:",
            signature=ModelSignature(
                inputs=Schema([ColSpec(type="string", name=None)]),
                outputs=Schema([ColSpec(type="string", name=None)]),
                params=ParamSchema([ParamSpec(name="prefix", default=None, dtype="string")]),
            ),
        )


def test_multimodal_messages(tmp_path):
    # Test multimodal content with variable placeholders
    mlflow.openai.save_model(
        model="gpt-4o-mini",
        task=chat_completions(),
        path=tmp_path,
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "{system_prompt}"},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "data:image/jpeg;base64,{image_base64}",
                            "detail": "low",
                        },
                    },
                ],
            }
        ],
    )

    model = mlflow.models.Model.load(tmp_path)
    assert model.signature.inputs.to_dict() == [
        {"name": "image_base64", "type": "string", "required": True},
        {"name": "system_prompt", "type": "string", "required": True},
    ]
    assert model.signature.outputs.to_dict() == [
        {"type": "string", "required": True},
    ]

    model = mlflow.pyfunc.load_model(tmp_path)
    data = pd.DataFrame(
        {
            "system_prompt": ["Analyze this image"],
            "image_base64": [
                "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
            ],
        }
    )

    expected_output = [
        [
            {
                "content": [
                    {"type": "text", "text": "Analyze this image"},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": (
                                "data:image/jpeg;base64,"
                                "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                            ),
                            "detail": "low",
                        },
                    },
                ],
                "role": "user",
            }
        ]
    ]

    assert list(map(json.loads, model.predict(data))) == expected_output


def test_multimodal_messages_no_variables(tmp_path):
    mlflow.openai.save_model(
        model="gpt-4o-mini",
        task=chat_completions(),
        path=tmp_path,
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What's in this image?"},
                    {
                        "type": "image_url",
                        "image_url": {"url": "data:image/jpeg;base64,abc123", "detail": "low"},
                    },
                ],
            }
        ],
    )

    model = mlflow.models.Model.load(tmp_path)
    # Should add default content variable since no variables found
    assert model.signature.inputs.to_dict() == [
        {"type": "string", "required": True},
    ]

    model = mlflow.pyfunc.load_model(tmp_path)
    data = pd.DataFrame({"content": ["Additional context"]})

    expected_output = [
        [
            {
                "content": [
                    {"type": "text", "text": "What's in this image?"},
                    {
                        "type": "image_url",
                        "image_url": {"url": "data:image/jpeg;base64,abc123", "detail": "low"},
                    },
                ],
                "role": "user",
            },
            {"content": "Additional context", "role": "user"},
        ]
    ]

    assert list(map(json.loads, model.predict(data))) == expected_output
```

--------------------------------------------------------------------------------

---[FILE: test_openai_responses_autolog.py]---
Location: mlflow-master/tests/openai/test_openai_responses_autolog.py

```python
import openai
import pytest
from packaging.version import Version

import mlflow
from mlflow.entities.span import SpanType
from mlflow.tracing.constant import SpanAttributeKey, TokenUsageKey

from tests.tracing.helper import get_traces

if Version(openai.__version__) < Version("1.66.00"):
    pytest.skip(
        "OpenAI < 1.66.0 does not support the Responses API.",
        allow_module_level=True,
    )


@pytest.fixture(params=[True, False], ids=["sync", "async"])
def client(request, monkeypatch, mock_openai):
    monkeypatch.setenv("OPENAI_API_KEY", "test")
    monkeypatch.setenv("OPENAI_API_BASE", mock_openai)
    if request.param:
        client = openai.OpenAI(api_key="test", base_url=mock_openai)
        client._is_async = False
        return client
    else:
        client = openai.AsyncOpenAI(api_key="test", base_url=mock_openai)
        client._is_async = True
        return client


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "_input",
    [
        "Hello",
        [{"role": "user", "content": "Hello"}],
    ],
)
async def test_responses_autolog(client, _input):
    mlflow.openai.autolog()

    response = client.responses.create(
        input=_input,
        model="gpt-4o",
        temperature=0,
    )

    if client._is_async:
        await response

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 1
    span = traces[0].data.spans[0]
    assert span.span_type == SpanType.CHAT_MODEL
    assert span.inputs == {"input": _input, "model": "gpt-4o", "temperature": 0}
    assert span.outputs["id"] == "responses-123"
    assert span.attributes["model"] == "gpt-4o"
    assert span.attributes["temperature"] == 0

    # Token usage should be aggregated correctly
    assert traces[0].info.token_usage == {
        TokenUsageKey.INPUT_TOKENS: 36,
        TokenUsageKey.OUTPUT_TOKENS: 87,
        TokenUsageKey.TOTAL_TOKENS: 123,
    }


@pytest.mark.asyncio
async def test_responses_image_input_autolog(client):
    mlflow.openai.autolog()

    response = client.responses.create(
        input=[
            {
                "role": "user",
                "content": [
                    {"type": "input_text", "text": "what is in this image?"},
                    {
                        "type": "input_image",
                        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
                    },
                ],
            }
        ],
        model="gpt-4o",
        temperature=0,
    )

    if client._is_async:
        await response

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 1
    span = traces[0].data.spans[0]
    assert span.span_type == SpanType.CHAT_MODEL


@pytest.mark.asyncio
async def test_responses_web_search_autolog(client):
    mlflow.openai.autolog()

    response = client.responses.create(
        model="gpt-4o",
        tools=[{"type": "web_search_preview"}],
        input="What was a positive news story from today?",
    )

    if client._is_async:
        await response

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 1
    span = traces[0].data.spans[0]
    assert span.attributes[SpanAttributeKey.CHAT_TOOLS] == [
        {"type": "function", "function": {"name": "web_search_preview"}}
    ]


@pytest.mark.asyncio
async def test_responses_file_search_autolog(client):
    mlflow.openai.autolog()

    response = client.responses.create(
        model="gpt-4o",
        tools=[
            {
                "type": "file_search",
                "vector_store_ids": ["vs_1234567890"],
                "max_num_results": 20,
            }
        ],
        input="What are the attributes of an ancient brown dragon?",
    )

    if client._is_async:
        await response

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 1
    span = traces[0].data.spans[0]
    assert span.attributes[SpanAttributeKey.CHAT_TOOLS] == [
        {"type": "function", "function": {"name": "file_search"}}
    ]


@pytest.mark.asyncio
async def test_responses_computer_use_autolog(client):
    mlflow.openai.autolog()

    computer_tool_def = {
        "type": "computer_use_preview",
        "display_width": 1024,
        "display_height": 768,
        "environment": "browser",
    }

    with mlflow.start_span(name="openai_computer_use"):
        response = client.responses.create(
            model="computer-use-preview",
            input=[{"role": "user", "content": "Check the latest OpenAI news on bing.com."}],
            tools=[computer_tool_def],
        )

        if client._is_async:
            await response

        # Send the response back to the computer tool
        response = client.responses.create(
            model="computer-use-preview",
            input=[
                {
                    "call_id": "computer_call_1",
                    "type": "computer_call_output",
                    "output": {
                        "type": "input_image",
                        "image_url": "data:image/png;base64,screenshot_base64",
                    },
                }
            ],
            tools=[computer_tool_def],
        )

        if client._is_async:
            await response

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 3
    llm_span_1 = traces[0].data.spans[1]
    assert llm_span_1.span_type == SpanType.CHAT_MODEL
    assert llm_span_1.inputs["model"] == "computer-use-preview"
    assert llm_span_1.outputs["id"] == "responses-123"
    assert llm_span_1.attributes[SpanAttributeKey.CHAT_TOOLS] == [
        {"type": "function", "function": {"name": "computer_use_preview"}}
    ]


@pytest.mark.asyncio
async def test_responses_function_calling_autolog(client):
    mlflow.openai.autolog()

    tools = [
        {
            "type": "function",
            "name": "get_current_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA",
                    },
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                },
                "required": ["location", "unit"],
            },
        }
    ]

    response = client.responses.create(
        model="gpt-4o",
        tools=tools,
        input="What is the weather like in Boston today?",
        tool_choice="auto",
    )

    if client._is_async:
        await response

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 1
    span = traces[0].data.spans[0]
    assert span.span_type == SpanType.CHAT_MODEL
    assert span.inputs["model"] == "gpt-4o"
    assert span.outputs["id"] == "responses-123"
    assert span.attributes[SpanAttributeKey.CHAT_TOOLS] == [
        {"type": "function", "function": {k: v for k, v in tools[0].items() if k != "type"}}
    ]
    assert span.attributes[SpanAttributeKey.MESSAGE_FORMAT] == "openai"


@pytest.mark.asyncio
async def test_responses_stream_autolog(client):
    mlflow.openai.autolog()

    response = client.responses.create(
        input="Hello",
        model="gpt-4o",
        stream=True,
    )

    if client._is_async:
        async for _ in await response:
            pass
    else:
        for _ in response:
            pass

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 1
    span = traces[0].data.spans[0]
    assert span.span_type == SpanType.CHAT_MODEL
    assert span.outputs["id"] == "responses-123"
    # "logprobs" is only returned from certain version of OpenAI SDK
    span.outputs["output"][0]["content"][0].pop("logprobs", None)
    assert span.outputs["output"][0]["content"] == [
        {
            "text": "Dummy output",
            "annotations": None,
            "type": "output_text",
        }
    ]
    assert span.attributes["model"] == "gpt-4o"
    assert span.attributes["stream"] is True

    # Token usage should be aggregated correctly
    assert traces[0].info.token_usage == {
        TokenUsageKey.INPUT_TOKENS: 36,
        TokenUsageKey.OUTPUT_TOKENS: 87,
        TokenUsageKey.TOTAL_TOKENS: 123,
    }
```

--------------------------------------------------------------------------------

````
