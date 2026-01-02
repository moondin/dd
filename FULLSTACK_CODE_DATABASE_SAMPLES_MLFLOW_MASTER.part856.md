---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 856
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 856 of 991)

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

---[FILE: test_mistral_autolog.py]---
Location: mlflow-master/tests/mistral/test_mistral_autolog.py
Signals: Pydantic

```python
from unittest.mock import patch

import httpx
import mistralai
import pytest
from mistralai.models import (
    AssistantMessage,
    ChatCompletionChoice,
    ChatCompletionResponse,
    FunctionCall,
    ToolCall,
    UsageInfo,
)
from pydantic import BaseModel

import mlflow.mistral
from mlflow.entities.span import SpanType
from mlflow.tracing.constant import SpanAttributeKey, TokenUsageKey

from tests.tracing.helper import get_traces

DUMMY_CHAT_COMPLETION_REQUEST = {
    "model": "test_model",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "test message"}],
}

DUMMY_CHAT_COMPLETION_RESPONSE = ChatCompletionResponse(
    id="test_id",
    object="chat.completion",
    model="test_model",
    usage=UsageInfo(prompt_tokens=10, completion_tokens=18, total_tokens=28),
    created=1736200000,
    choices=[
        ChatCompletionChoice(
            index=0,
            message=AssistantMessage(
                role="assistant",
                content="test answer",
                prefix=False,
                tool_calls=None,
            ),
            finish_reason="stop",
        )
    ],
)

# Ref: https://docs.mistral.ai/capabilities/function_calling/
DUMMY_CHAT_COMPLETION_WITH_TOOLS_REQUEST = {
    "model": "test_model",
    "max_tokens": 1024,
    "tools": [
        {
            "type": "function",
            "function": {
                "name": "get_unit",
                "description": "Get the temperature unit commonly used in a given location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g., San Francisco, CA",
                        },
                    },
                    "required": ["location"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Get the current weather in a given location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g., San Francisco, CA",
                        },
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"],
                            "description": 'The unit of temperature, "celsius" or "fahrenheit"',
                        },
                    },
                    "required": ["location", "unit"],
                },
            },
        },
    ],
    "messages": [
        {"role": "user", "content": "What's the weather like in San Francisco?"},
        {
            "role": "assistant",
            "content": "",
            "tool_calls": [
                {
                    "function": {"name": "get_unit", "arguments": '{"location": "San Francisco"}'},
                    "id": "tool_123",
                    "type": "function",
                }
            ],
            "prefix": False,
        },
        {"role": "tool", "name": "get_unit", "content": "celsius", "tool_call_id": "tool_123"},
    ],
}

DUMMY_CHAT_COMPLETION_WITH_TOOLS_RESPONSE = ChatCompletionResponse(
    id="test_id",
    object="chat.completion",
    model="test_model",
    usage=UsageInfo(prompt_tokens=11, completion_tokens=19, total_tokens=30),
    created=1736300000,
    choices=[
        ChatCompletionChoice(
            index=0,
            message=AssistantMessage(
                role="assistant",
                content="",
                prefix=False,
                tool_calls=[
                    ToolCall(
                        function=FunctionCall(
                            name="get_weather",
                            arguments='{"location": "San Francisco", "unit": "celsius"}',
                        ),
                        id="tool_456",
                        type="function",
                    ),
                ],
            ),
            finish_reason="tool_calls",
        )
    ],
)


def _make_httpx_response(response: BaseModel, status_code: int = 200) -> httpx.Response:
    return httpx.Response(
        status_code=status_code,
        headers={"Content-Type": "application/json"},
        text=response.model_dump_json(),
    )


def test_chat_complete_autolog():
    with patch(
        "mistralai.chat.Chat.do_request",
        return_value=_make_httpx_response(DUMMY_CHAT_COMPLETION_RESPONSE),
    ):
        mlflow.mistral.autolog()
        client = mistralai.Mistral(api_key="test_key")
        client.chat.complete(**DUMMY_CHAT_COMPLETION_REQUEST)

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 1
    span = traces[0].data.spans[0]
    assert span.name == "Chat.complete"
    assert span.span_type == SpanType.CHAT_MODEL
    assert span.inputs == DUMMY_CHAT_COMPLETION_REQUEST
    # Only keep input_tokens / output_tokens fields in usage dict.
    span.outputs["usage"] = {
        key: span.outputs["usage"][key]
        for key in ["prompt_tokens", "completion_tokens", "total_tokens"]
    }
    assert span.outputs == DUMMY_CHAT_COMPLETION_RESPONSE.model_dump()
    assert span.get_attribute(SpanAttributeKey.MESSAGE_FORMAT) == "mistral"
    assert traces[0].info.token_usage == {
        TokenUsageKey.INPUT_TOKENS: 10,
        TokenUsageKey.OUTPUT_TOKENS: 18,
        TokenUsageKey.TOTAL_TOKENS: 28,
    }

    with patch(
        "mistralai.chat.Chat.do_request",
        return_value=_make_httpx_response(DUMMY_CHAT_COMPLETION_RESPONSE),
    ):
        mlflow.mistral.autolog(disable=True)
        client = mistralai.Mistral(api_key="test_key")
        client.chat.complete(**DUMMY_CHAT_COMPLETION_REQUEST)

    # No new trace should be created
    traces = get_traces()
    assert len(traces) == 1


def test_chat_complete_autolog_tool_calling():
    with patch(
        "mistralai.chat.Chat.do_request",
        return_value=_make_httpx_response(DUMMY_CHAT_COMPLETION_WITH_TOOLS_RESPONSE),
    ):
        mlflow.mistral.autolog()
        client = mistralai.Mistral(api_key="test_key")
        client.chat.complete(**DUMMY_CHAT_COMPLETION_WITH_TOOLS_REQUEST)

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == "OK"
    assert len(traces[0].data.spans) == 1
    span = traces[0].data.spans[0]
    assert span.name == "Chat.complete"
    assert span.span_type == SpanType.CHAT_MODEL
    assert span.inputs == DUMMY_CHAT_COMPLETION_WITH_TOOLS_REQUEST
    assert span.outputs == DUMMY_CHAT_COMPLETION_WITH_TOOLS_RESPONSE.model_dump()

    assert span.get_attribute(SpanAttributeKey.CHAT_TOOLS) == [
        {
            "type": "function",
            "function": {
                "name": "get_unit",
                "description": "Get the temperature unit commonly used in a given location",
                "parameters": {
                    "properties": {
                        "location": {
                            "description": "The city and state, e.g., San Francisco, CA",
                            "type": "string",
                        },
                    },
                    "required": ["location"],
                    "type": "object",
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Get the current weather in a given location",
                "parameters": {
                    "properties": {
                        "location": {
                            "description": "The city and state, e.g., San Francisco, CA",
                            "type": "string",
                        },
                        "unit": {
                            "description": 'The unit of temperature, "celsius" or "fahrenheit"',
                            "enum": ["celsius", "fahrenheit"],
                            "type": "string",
                        },
                    },
                    "required": ["location", "unit"],
                    "type": "object",
                },
            },
        },
    ]
    assert span.get_attribute(SpanAttributeKey.MESSAGE_FORMAT) == "mistral"
    assert traces[0].info.token_usage == {
        TokenUsageKey.INPUT_TOKENS: 11,
        TokenUsageKey.OUTPUT_TOKENS: 19,
        TokenUsageKey.TOTAL_TOKENS: 30,
    }


@pytest.mark.asyncio
async def test_chat_complete_async_autolog():
    with patch(
        "mistralai.chat.Chat.do_request_async",
        return_value=_make_httpx_response(DUMMY_CHAT_COMPLETION_RESPONSE),
    ):
        mlflow.mistral.autolog()
        client = mistralai.Mistral(api_key="test_key")
        await client.chat.complete_async(**DUMMY_CHAT_COMPLETION_REQUEST)

    traces = get_traces()
    assert len(traces) == 1
    span = traces[0].data.spans[0]
    assert span.name == "Chat.complete_async"
    assert span.span_type == SpanType.CHAT_MODEL
    assert span.inputs == DUMMY_CHAT_COMPLETION_REQUEST
    span.outputs["usage"] = {
        key: span.outputs["usage"][key]
        for key in ["prompt_tokens", "completion_tokens", "total_tokens"]
    }
    assert span.outputs == DUMMY_CHAT_COMPLETION_RESPONSE.model_dump()
    assert span.get_attribute(SpanAttributeKey.MESSAGE_FORMAT) == "mistral"
    assert traces[0].info.token_usage == {
        TokenUsageKey.INPUT_TOKENS: 10,
        TokenUsageKey.OUTPUT_TOKENS: 18,
        TokenUsageKey.TOTAL_TOKENS: 28,
    }
```

--------------------------------------------------------------------------------

---[FILE: test_artifacts.py]---
Location: mlflow-master/tests/models/test_artifacts.py

```python
import json
import pathlib

import numpy as np
import pandas as pd
import pytest
from matplotlib.figure import Figure

from mlflow.exceptions import MlflowException
from mlflow.models.evaluation.artifacts import (
    CsvEvaluationArtifact,
    ImageEvaluationArtifact,
    JsonEvaluationArtifact,
    NumpyEvaluationArtifact,
    ParquetEvaluationArtifact,
    PickleEvaluationArtifact,
    TextEvaluationArtifact,
    _infer_artifact_type_and_ext,
)
from mlflow.models.evaluation.default_evaluator import _CustomArtifact


@pytest.fixture
def cm_fn_tuple():
    return _CustomArtifact(lambda: None, "", 0, "")


def __generate_dummy_json_file(path):
    with open(path, "w") as f:
        json.dump([1, 2, 3], f)


class __DummyClass:
    def __init__(self):
        self.test = 1


@pytest.mark.parametrize(
    ("is_file", "artifact", "artifact_type", "ext"),
    [
        (True, lambda path: Figure().savefig(path), ImageEvaluationArtifact, "png"),
        (True, lambda path: Figure().savefig(path), ImageEvaluationArtifact, "jpg"),
        (True, lambda path: Figure().savefig(path), ImageEvaluationArtifact, "jpeg"),
        (True, __generate_dummy_json_file, JsonEvaluationArtifact, "json"),
        (True, lambda path: pathlib.Path(path).write_text("test"), TextEvaluationArtifact, "txt"),
        (
            True,
            lambda path: np.save(path, np.array([1, 2, 3]), allow_pickle=False),
            NumpyEvaluationArtifact,
            "npy",
        ),
        (
            True,
            lambda path: pd.DataFrame({"test": [1, 2, 3]}).to_csv(path, index=False),
            CsvEvaluationArtifact,
            "csv",
        ),
        (
            True,
            lambda path: pd.DataFrame({"test": [1, 2, 3]}).to_parquet(path),
            ParquetEvaluationArtifact,
            "parquet",
        ),
        (False, pd.DataFrame({"test": [1, 2, 3]}), CsvEvaluationArtifact, "csv"),
        (False, np.array([1, 2, 3]), NumpyEvaluationArtifact, "npy"),
        (False, Figure(), ImageEvaluationArtifact, "png"),
        (False, {"a": 1, "b": "e", "c": 1.2, "d": [1, 2]}, JsonEvaluationArtifact, "json"),
        (False, [1, 2, 3, "test"], JsonEvaluationArtifact, "json"),
        (False, '{"a": 1, "b": [1.2, 3]}', JsonEvaluationArtifact, "json"),
        (False, '[1, 2, 3, "test"]', JsonEvaluationArtifact, "json"),
        (False, __DummyClass(), PickleEvaluationArtifact, "pickle"),
    ],
)
def test_infer_artifact_type_and_ext(is_file, artifact, artifact_type, ext, tmp_path, cm_fn_tuple):
    if is_file:
        artifact_representation = tmp_path / f"test.{ext}"
        artifact(artifact_representation)
    else:
        artifact_representation = artifact
    inferred_from_path, inferred_type, inferred_ext = _infer_artifact_type_and_ext(
        f"{ext}_{artifact_type.__name__}_artifact", artifact_representation, cm_fn_tuple
    )
    assert not is_file ^ inferred_from_path
    assert inferred_type is artifact_type
    assert inferred_ext == f".{ext}"


def test_infer_artifact_type_and_ext_raise_exception_for_non_file_non_json_str(cm_fn_tuple):
    with pytest.raises(
        MlflowException,
        match="with string representation 'some random str' that is "
        "neither a valid path to a file nor a JSON string",
    ):
        _infer_artifact_type_and_ext("test_artifact", "some random str", cm_fn_tuple)


def test_infer_artifact_type_and_ext_raise_exception_for_non_existent_path(tmp_path, cm_fn_tuple):
    path = tmp_path / "does_not_exist_path"
    with pytest.raises(MlflowException, match=f"with path '{path}' does not exist"):
        _infer_artifact_type_and_ext("test_artifact", path, cm_fn_tuple)


def test_infer_artifact_type_and_ext_raise_exception_for_non_file_artifact(tmp_path, cm_fn_tuple):
    with pytest.raises(MlflowException, match=f"with path '{tmp_path}' is not a file"):
        _infer_artifact_type_and_ext("non_file_artifact", tmp_path, cm_fn_tuple)


def test_infer_artifact_type_and_ext_raise_exception_for_unsupported_ext(tmp_path, cm_fn_tuple):
    path = tmp_path / "invalid_ext_example.some_ext"
    with open(path, "w") as f:
        f.write("some stuff that shouldn't be read")
    with pytest.raises(
        MlflowException,
        match=f"with path '{path}' does not match any of the supported file extensions",
    ):
        _infer_artifact_type_and_ext("invalid_ext_artifact", path, cm_fn_tuple)
```

--------------------------------------------------------------------------------

---[FILE: test_auth_policy.py]---
Location: mlflow-master/tests/models/test_auth_policy.py

```python
from mlflow.models.auth_policy import AuthPolicy, SystemAuthPolicy, UserAuthPolicy
from mlflow.models.resources import (
    DatabricksFunction,
    DatabricksServingEndpoint,
    DatabricksUCConnection,
    DatabricksVectorSearchIndex,
)


def test_complete_auth_policy():
    system_auth_policy = SystemAuthPolicy(
        resources=[
            DatabricksServingEndpoint(endpoint_name="databricks-mixtral-8x7b-instruct"),
            DatabricksVectorSearchIndex(index_name="rag.studio_bugbash.databricks_docs_index"),
            DatabricksFunction(function_name="rag.studio.test_function_a"),
            DatabricksUCConnection(connection_name="test_connection_1"),
        ]
    )

    user_auth_policy = UserAuthPolicy(
        api_scopes=[
            "catalog.catalogs",
            "vectorsearch.vector-search-indexes",
            "workspace.workspace",
        ]
    )

    auth_policy = AuthPolicy(
        user_auth_policy=user_auth_policy, system_auth_policy=system_auth_policy
    )

    serialized_auth_policy = auth_policy.to_dict()

    expected_serialized_auth_policy = {
        "user_auth_policy": {
            "api_scopes": [
                "catalog.catalogs",
                "vectorsearch.vector-search-indexes",
                "workspace.workspace",
            ]
        },
        "system_auth_policy": {
            "resources": {
                "databricks": {
                    "serving_endpoint": [{"name": "databricks-mixtral-8x7b-instruct"}],
                    "vector_search_index": [{"name": "rag.studio_bugbash.databricks_docs_index"}],
                    "function": [{"name": "rag.studio.test_function_a"}],
                    "uc_connection": [{"name": "test_connection_1"}],
                },
                "api_version": "1",
            }
        },
    }
    assert serialized_auth_policy == expected_serialized_auth_policy


def test_user_auth_policy():
    user_auth_policy = UserAuthPolicy(
        api_scopes=[
            "catalog.catalogs",
            "vectorsearch.vector-search-indexes",
            "workspace.workspace",
        ]
    )

    auth_policy = AuthPolicy(user_auth_policy=user_auth_policy)

    serialized_auth_policy = auth_policy.to_dict()

    expected_serialized_auth_policy = {
        "system_auth_policy": {},
        "user_auth_policy": {
            "api_scopes": [
                "catalog.catalogs",
                "vectorsearch.vector-search-indexes",
                "workspace.workspace",
            ]
        },
    }
    assert serialized_auth_policy == expected_serialized_auth_policy


def test_system_auth_policy():
    system_auth_policy = SystemAuthPolicy(
        resources=[
            DatabricksServingEndpoint(endpoint_name="databricks-mixtral-8x7b-instruct"),
            DatabricksVectorSearchIndex(index_name="rag.studio_bugbash.databricks_docs_index"),
            DatabricksFunction(function_name="rag.studio.test_function_a"),
            DatabricksUCConnection(connection_name="test_connection_1"),
        ]
    )

    auth_policy = AuthPolicy(system_auth_policy=system_auth_policy)

    serialized_auth_policy = auth_policy.to_dict()

    expected_serialized_auth_policy = {
        "system_auth_policy": {
            "resources": {
                "databricks": {
                    "serving_endpoint": [{"name": "databricks-mixtral-8x7b-instruct"}],
                    "vector_search_index": [{"name": "rag.studio_bugbash.databricks_docs_index"}],
                    "function": [{"name": "rag.studio.test_function_a"}],
                    "uc_connection": [{"name": "test_connection_1"}],
                },
                "api_version": "1",
            }
        },
        "user_auth_policy": {},
    }
    assert serialized_auth_policy == expected_serialized_auth_policy


def test_empty_auth_policy():
    auth_policy = AuthPolicy()

    serialized_auth_policy = auth_policy.to_dict()

    expected_serialized_auth_policy = {"system_auth_policy": {}, "user_auth_policy": {}}
    assert serialized_auth_policy == expected_serialized_auth_policy
```

--------------------------------------------------------------------------------

````
