---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 851
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 851 of 991)

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

---[FILE: test_llama_index_pyfunc_wrapper.py]---
Location: mlflow-master/tests/llama_index/test_llama_index_pyfunc_wrapper.py

```python
import llama_index.core
import numpy as np
import pandas as pd
import pytest
from llama_index.core import QueryBundle
from llama_index.core.llms import ChatMessage
from packaging.version import Version

import mlflow
from mlflow.llama_index.pyfunc_wrapper import (
    _CHAT_MESSAGE_HISTORY_PARAMETER_NAME,
    CHAT_ENGINE_NAME,
    QUERY_ENGINE_NAME,
    RETRIEVER_ENGINE_NAME,
    create_pyfunc_wrapper,
)


################## Inferece Input #################
def test_format_predict_input_str_chat(single_index):
    wrapped_model = create_pyfunc_wrapper(single_index, CHAT_ENGINE_NAME)
    formatted_data = wrapped_model._format_predict_input("string")
    assert formatted_data == "string"


def test_format_predict_input_dict_chat(single_index):
    wrapped_model = create_pyfunc_wrapper(single_index, CHAT_ENGINE_NAME)
    formatted_data = wrapped_model._format_predict_input({"query": "string"})
    assert isinstance(formatted_data, dict)


def test_format_predict_input_message_history_chat(single_index):
    payload = {
        "message": "string",
        _CHAT_MESSAGE_HISTORY_PARAMETER_NAME: [{"role": "user", "content": "hi"}] * 3,
    }
    wrapped_model = create_pyfunc_wrapper(single_index, CHAT_ENGINE_NAME)
    formatted_data = wrapped_model._format_predict_input(payload)

    assert isinstance(formatted_data, dict)
    assert formatted_data["message"] == payload["message"]
    assert isinstance(formatted_data[_CHAT_MESSAGE_HISTORY_PARAMETER_NAME], list)
    assert all(
        isinstance(x, ChatMessage) for x in formatted_data[_CHAT_MESSAGE_HISTORY_PARAMETER_NAME]
    )


@pytest.mark.parametrize(
    "data",
    [
        [
            {
                "query": "string",
                _CHAT_MESSAGE_HISTORY_PARAMETER_NAME: [{"role": "user", "content": "hi"}] * 3,
            }
        ]
        * 3,
        pd.DataFrame(
            [
                {
                    "query": "string",
                    _CHAT_MESSAGE_HISTORY_PARAMETER_NAME: [{"role": "user", "content": "hi"}] * 3,
                }
            ]
            * 3
        ),
    ],
)
def test_format_predict_input_message_history_chat_iterable(single_index, data):
    wrapped_model = create_pyfunc_wrapper(single_index, CHAT_ENGINE_NAME)
    formatted_data = wrapped_model._format_predict_input(data)

    if isinstance(data, pd.DataFrame):
        data = data.to_dict("records")

    assert isinstance(formatted_data, list)
    assert formatted_data[0]["query"] == data[0]["query"]
    assert isinstance(formatted_data[0][_CHAT_MESSAGE_HISTORY_PARAMETER_NAME], list)
    assert all(
        isinstance(x, ChatMessage) for x in formatted_data[0][_CHAT_MESSAGE_HISTORY_PARAMETER_NAME]
    )


def test_format_predict_input_message_history_chat_invalid_type(single_index):
    payload = {
        "message": "string",
        _CHAT_MESSAGE_HISTORY_PARAMETER_NAME: ["invalid history string", "user: hi"],
    }
    wrapped_model = create_pyfunc_wrapper(single_index, CHAT_ENGINE_NAME)
    with pytest.raises(ValueError, match="It must be a list of dicts"):
        _ = wrapped_model._format_predict_input(payload)


@pytest.mark.parametrize(
    "data",
    [
        "string",
        ["string"],  # iterables of length 1 should be treated non-iterables
        {"query_str": "string"},
        {"query_str": "string", "custom_embedding_strs": ["string"], "embedding": [1.0]},
        pd.DataFrame(
            {"query_str": ["string"], "custom_embedding_strs": [["string"]], "embedding": [[1.0]]}
        ),
    ],
)
def test_format_predict_input_no_iterable_query(single_index, data):
    wrapped_model = create_pyfunc_wrapper(single_index, QUERY_ENGINE_NAME)
    formatted_data = wrapped_model._format_predict_input(data)
    assert isinstance(formatted_data, QueryBundle)


@pytest.mark.parametrize(
    "data",
    [
        ["string", "string"],
        [{"query_str": "string"}] * 4,
        [{"query_str": "string", "custom_embedding_strs": ["string"], "embedding": [1.0]}] * 4,
        [
            pd.DataFrame(
                {
                    "query_str": ["string"],
                    "custom_embedding_strs": [["string"]],
                    "embedding": [[1.0]],
                }
            )
        ]
        * 2,
    ],
)
def test_format_predict_input_iterable_query(single_index, data):
    wrapped_model = create_pyfunc_wrapper(single_index, QUERY_ENGINE_NAME)
    formatted_data = wrapped_model._format_predict_input(data)

    assert isinstance(formatted_data, list)
    assert all(isinstance(x, QueryBundle) for x in formatted_data)


@pytest.mark.parametrize(
    "data",
    [
        "string",
        ["string"],  # iterables of length 1 should be treated non-iterables
        {"query_str": "string"},
        {"query_str": "string", "custom_embedding_strs": ["string"], "embedding": [1.0]},
        pd.DataFrame(
            {"query_str": ["string"], "custom_embedding_strs": [["string"]], "embedding": [[1.0]]}
        ),
    ],
)
def test_format_predict_input_no_iterable_retriever(single_index, data):
    wrapped_model = create_pyfunc_wrapper(single_index, RETRIEVER_ENGINE_NAME)
    formatted_data = wrapped_model._format_predict_input(data)
    assert isinstance(formatted_data, QueryBundle)


@pytest.mark.parametrize(
    "data",
    [
        ["string", "string"],
        [{"query_str": "string"}] * 4,
        [{"query_str": "string", "custom_embedding_strs": ["string"], "embedding": [1.0]}] * 4,
        [
            pd.DataFrame(
                {
                    "query_str": ["string"],
                    "custom_embedding_strs": [["string"]],
                    "embedding": [[1.0]],
                }
            )
        ]
        * 2,
    ],
)
def test_format_predict_input_iterable_retriever(single_index, data):
    wrapped_model = create_pyfunc_wrapper(single_index, RETRIEVER_ENGINE_NAME)
    formatted_data = wrapped_model._format_predict_input(data)
    assert isinstance(formatted_data, list)
    assert all(isinstance(x, QueryBundle) for x in formatted_data)


@pytest.mark.parametrize(
    "engine_type",
    ["query", "retriever"],
)
def test_format_predict_input_correct(single_index, engine_type):
    wrapped_model = create_pyfunc_wrapper(single_index, engine_type)

    assert isinstance(
        wrapped_model._format_predict_input(pd.DataFrame({"query_str": ["hi"]})), QueryBundle
    )
    assert isinstance(wrapped_model._format_predict_input(np.array(["hi"])), QueryBundle)
    assert isinstance(wrapped_model._format_predict_input({"query_str": ["hi"]}), QueryBundle)
    assert isinstance(wrapped_model._format_predict_input({"query_str": "hi"}), QueryBundle)
    assert isinstance(wrapped_model._format_predict_input(["hi"]), QueryBundle)
    assert isinstance(wrapped_model._format_predict_input("hi"), QueryBundle)


@pytest.mark.parametrize(
    "engine_type",
    ["query", "retriever"],
)
def test_format_predict_input_correct_schema_complex(single_index, engine_type):
    wrapped_model = create_pyfunc_wrapper(single_index, engine_type)

    payload = {
        "query_str": "hi",
        "image_path": "some/path",
        "custom_embedding_strs": [["a"]],
        "embedding": [[1.0]],
    }
    assert isinstance(wrapped_model._format_predict_input(pd.DataFrame(payload)), QueryBundle)
    payload.update(
        {
            "custom_embedding_strs": ["a"],
            "embedding": [1.0],
        }
    )
    assert isinstance(wrapped_model._format_predict_input(payload), QueryBundle)


@pytest.mark.parametrize(
    ("engine_type", "input"),
    [
        ("query", {"query_str": "hello!"}),
        ("retriever", {"query_str": "hello!"}),
    ],
)
def test_spark_udf_retriever_and_query_engine(model_path, spark, single_index, engine_type, input):
    mlflow.llama_index.save_model(
        llama_index_model=single_index,
        engine_type=engine_type,
        path=model_path,
        input_example=input,
    )
    udf = mlflow.pyfunc.spark_udf(spark, model_path, result_type="string")
    df = spark.createDataFrame([{"query_str": "hi"}])
    df = df.withColumn("predictions", udf())
    pdf = df.toPandas()
    assert len(pdf["predictions"].tolist()) == 1
    assert isinstance(pdf["predictions"].tolist()[0], str)


def test_spark_udf_chat(model_path, spark, single_index):
    engine_type = "chat"
    input = pd.DataFrame(
        {
            "message": ["string"],
            _CHAT_MESSAGE_HISTORY_PARAMETER_NAME: [[{"role": "user", "content": "string"}]],
        }
    )
    mlflow.llama_index.save_model(
        llama_index_model=single_index,
        engine_type=engine_type,
        path=model_path,
        input_example=input,
    )
    udf = mlflow.pyfunc.spark_udf(spark, model_path, result_type="string")
    df = spark.createDataFrame(input)
    df = df.withColumn("predictions", udf())
    pdf = df.toPandas()
    assert len(pdf["predictions"].tolist()) == 1
    assert isinstance(pdf["predictions"].tolist()[0], str)


@pytest.mark.skipif(
    Version(llama_index.core.__version__) < Version("0.11.0"),
    reason="Workflow was introduced in 0.11.0",
)
@pytest.mark.asyncio
async def test_wrap_workflow():
    from llama_index.core.workflow import StartEvent, StopEvent, Workflow, step

    class MyWorkflow(Workflow):
        @step
        async def my_step(self, ev: StartEvent) -> StopEvent:
            return StopEvent(result=f"Hi, {ev.name}!")

    w = MyWorkflow(timeout=10, verbose=False)
    wrapper = create_pyfunc_wrapper(w)
    assert wrapper.get_raw_model() == w

    result = wrapper.predict({"name": "Alice"})
    assert result == "Hi, Alice!"

    results = wrapper.predict(
        [
            {"name": "Bob"},
            {"name": "Charlie"},
        ]
    )
    assert results == ["Hi, Bob!", "Hi, Charlie!"]

    results = wrapper.predict(pd.DataFrame({"name": ["David"]}))
    assert results == "Hi, David!"

    results = wrapper.predict(pd.DataFrame({"name": ["Eve", "Frank"]}))
    assert results == ["Hi, Eve!", "Hi, Frank!"]


@pytest.mark.skipif(
    Version(llama_index.core.__version__) < Version("0.11.0"),
    reason="Workflow was introduced in 0.11.0",
)
@pytest.mark.asyncio
async def test_wrap_workflow_raise_exception():
    from llama_index.core.workflow import (
        StartEvent,
        StopEvent,
        Workflow,
        WorkflowRuntimeError,
        step,
    )

    class MyWorkflow(Workflow):
        @step
        async def my_step(self, ev: StartEvent) -> StopEvent:
            raise ValueError("Expected error")

    w = MyWorkflow(timeout=10, verbose=False)
    wrapper = create_pyfunc_wrapper(w)

    with pytest.raises(
        (
            ValueError,  # llama_index < 0.12.1
            WorkflowRuntimeError,  # llama_index >= 0.12.1
        ),
        match="Expected error",
    ):
        wrapper.predict({"name": "Alice"})
```

--------------------------------------------------------------------------------

---[FILE: test_llama_index_serialization.py]---
Location: mlflow-master/tests/llama_index/test_llama_index_serialization.py

```python
import json
from collections import Counter, deque
from unittest import mock

import pytest
from llama_index.core import PromptTemplate, Settings
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI

from mlflow.llama_index.serialize_objects import (
    _construct_prompt_template_object,
    _get_object_import_path,
    _sanitize_api_key,
    deserialize_settings,
    object_to_dict,
    serialize_settings,
)


@pytest.fixture
def mock_logger():
    with mock.patch("mlflow.llama_index.serialize_objects._logger") as mock_logger:
        yield mock_logger


def test_get_object_import_path_class_instantiated():
    # The rationale for using collections as the library to test
    # import path is it's very stable and unlikely to change.
    expected_path = "collections.deque"
    assert _get_object_import_path(deque()) == expected_path


def test_get_object_import_path_class_not_instantiated():
    expected_path = "collections.Counter"
    assert _get_object_import_path(Counter) == expected_path


def test_object_is_class_do_validate_passes():
    expected_path = "collections.Counter"
    assert _get_object_import_path(Counter) == expected_path


def test_object_is_class_do_validate_raises():
    class CustomClass:
        pass

    with pytest.raises(ValueError, match="does not have"):
        _get_object_import_path(CustomClass)


def test_sanitize_api_key_keys_present():
    data = {"openai_api_key": "sk-123456", "api_key": "sk-abcdef", "other_key": "value"}
    sanitized_data = _sanitize_api_key(data)
    assert "openai_api_key" not in sanitized_data
    assert "api_key" not in sanitized_data
    assert "other_key" in sanitized_data
    assert sanitized_data["other_key"] == "value"


def test_sanitize_api_key_keys_not_present():
    data = {"some_key": "some_value", "another_key": "another_value"}
    sanitized_data = _sanitize_api_key(data)
    assert "some_key" in sanitized_data
    assert "another_key" in sanitized_data
    assert sanitized_data["some_key"] == "some_value"
    assert sanitized_data["another_key"] == "another_value"


def test_object_to_dict_no_required_param():
    o = OpenAI()
    result = object_to_dict(o)
    assert result["object_constructor"] == "llama_index.llms.openai.base.OpenAI"
    expected_kwargs = {k: v for k, v in o.to_dict().items() if k not in {"class_name", "api_key"}}
    assert result["object_kwargs"] == expected_kwargs


def test_object_to_dict_one_required_param():
    o = OpenAIEmbedding()
    result = object_to_dict(o)
    assert result["object_constructor"] == "llama_index.embeddings.openai.base.OpenAIEmbedding"
    expected_kwargs = {k: v for k, v in o.to_dict().items() if k not in {"class_name", "api_key"}}
    assert result["object_kwargs"] == expected_kwargs


def test_construct_prompt_template_object_success(qa_prompt_template):
    kwargs = qa_prompt_template.model_dump()
    observed = _construct_prompt_template_object(PromptTemplate, kwargs)
    assert observed == qa_prompt_template


def test_construct_prompt_template_object_no_template_kwarg():
    kwargs = {}
    with pytest.raises(ValueError, match="'template' is a required kwargs and is not present"):
        _construct_prompt_template_object(PromptTemplate, kwargs)


def test_settings_serialization_full_object(tmp_path, settings):
    path = tmp_path / "serialized_settings.json"
    serialize_settings(path)

    with open(path) as f:
        objects = json.load(f)

    assert len(set(objects.keys()) - set(settings.__dict__.keys())) == 0


def _assert_equal(settings_obj, deserialized_obj):
    if isinstance(settings_obj, list):
        assert len(settings_obj) == len(deserialized_obj)
        for i in range(len(settings_obj)):
            _assert_equal(settings_obj[i], deserialized_obj[i])
    else:
        for k, v in settings_obj.__dict__.items():
            if k != "callback_manager":
                assert getattr(deserialized_obj, k) == v
            else:
                assert getattr(deserialized_obj, k) is not None


def test_settings_serde(tmp_path, settings, mock_logger):
    path = tmp_path / "serialized_settings.json"
    _llm = settings.llm
    assert settings.llm.api_key == "test"
    _embed_model = settings.embed_model
    _node_parser = settings.node_parser
    _prompt_helper = settings.prompt_helper
    _transformations = settings.transformations

    serialize_settings(path)

    assert mock_logger.info.call_count == 2  # 1 for API key, 1 for unsupported objects
    log_message = mock_logger.info.call_args[0][0]
    assert log_message.startswith("The following objects in Settings are not supported")
    assert " - function for Settings.tokenizer" in log_message
    assert " - CallbackManager for Settings.callback_manager" in log_message

    for k in Settings.__dict__.keys():
        setattr(Settings, k, None)

    deserialize_settings(path)

    assert Settings is not None
    # Token is automatically applied from environment vars
    _assert_equal(Settings.llm, _llm)
    _assert_equal(Settings.embed_model, _embed_model)
    assert Settings.callback_manager is not None  # Auto-generated from defaults
    assert Settings.tokenizer is not None  # Auto-generated from defaults
    _assert_equal(Settings.node_parser, _node_parser)
    _assert_equal(Settings.prompt_helper, _prompt_helper)
    _assert_equal(Settings.transformations, _transformations)
```

--------------------------------------------------------------------------------

````
