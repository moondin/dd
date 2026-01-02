---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 807
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 807 of 991)

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

---[FILE: test_openai_uc_functions.py]---
Location: mlflow-master/tests/gateway/providers/test_openai_uc_functions.py
Signals: FastAPI

```python
# TODO: ADD MORE TESTS
import json
from unittest import mock

import pytest
from fastapi.encoders import jsonable_encoder

from mlflow.gateway.config import EndpointConfig
from mlflow.gateway.providers.openai import OpenAIProvider
from mlflow.gateway.schemas import chat
from mlflow.gateway.uc_function_utils import uc_type_to_json_schema_type

from tests.gateway.tools import (
    MockAsyncResponse,
    MockHttpClient,
)


def chat_config():
    return {
        "name": "chat",
        "endpoint_type": "llm/v1/chat",
        "model": {
            "provider": "openai",
            "name": "gpt-4o-mini",
            "config": {
                "openai_api_base": "https://api.openai.com/v1",
                "openai_api_key": "key",
            },
        },
    }


def test_uc_type_to_json_schema_type():
    # TODO: Improve the test coverage

    # Test with primitive types
    assert uc_type_to_json_schema_type("long") == {"type": "integer"}
    assert uc_type_to_json_schema_type("boolean") == {"type": "boolean"}
    assert uc_type_to_json_schema_type("date") == {"type": "string", "format": "date"}

    # Test with complex types
    assert uc_type_to_json_schema_type({"type": "array", "elementType": "integer"}) == {
        "type": "array",
        "items": {"type": "integer"},
    }
    assert uc_type_to_json_schema_type(
        {"type": "map", "keyType": "string", "valueType": "integer"}
    ) == {"type": "object", "additionalProperties": {"type": "integer"}}
    assert uc_type_to_json_schema_type(
        {"type": "struct", "fields": [{"name": "field1", "type": "integer"}]}
    ) == {"type": "object", "properties": {"field1": {"type": "integer"}}}

    # Test with unsupported types
    with pytest.raises(TypeError, match=r"Type interval is not supported\."):
        uc_type_to_json_schema_type("interval")

    with pytest.raises(TypeError, match=r"Unknown type unknown. Try upgrading this package\."):
        uc_type_to_json_schema_type("unknown")

    with pytest.raises(TypeError, match=r"Only support STRING key type for MAP but got integer\."):
        uc_type_to_json_schema_type({"type": "map", "keyType": "integer", "valueType": "integer"})


@pytest.mark.asyncio
async def test_uc_functions(monkeypatch):
    from databricks.sdk.service.catalog import ColumnTypeName
    from databricks.sdk.service.sql import StatementState

    monkeypatch.setenv("MLFLOW_ENABLE_UC_FUNCTIONS", "true")
    monkeypatch.setenv("DATABRICKS_WAREHOUSE_ID", "1234")

    config = chat_config()
    first_resp = {
        "id": "chatcmpl-abc123",
        "object": "chat.completion",
        "created": 1677858242,
        "model": "gpt-4o-mini",
        "usage": {
            "prompt_tokens": 13,
            "completion_tokens": 7,
            "total_tokens": 20,
        },
        "choices": [
            {
                "message": {
                    "role": "assistant",
                    "content": None,
                    "tool_calls": [
                        {
                            "id": "call_id",
                            "function": {
                                "arguments": '{"x": 1, "y": 2}',
                                "name": "test__uc__func",
                            },
                            "type": "function",
                        },
                    ],
                },
                "index": 0,
            }
        ],
        "headers": {"Content-Type": "application/json"},
    }

    second_resp = {
        "id": "chatcmpl-abc123",
        "object": "chat.completion",
        "created": 1677858242,
        "model": "gpt-4o-mini",
        "usage": {
            "prompt_tokens": 13,
            "completion_tokens": 7,
            "total_tokens": 20,
        },
        "choices": [
            {
                "message": {
                    "role": "assistant",
                    "content": "1 + 2 = 3",
                },
                "finish_reason": "stop",
                "index": 0,
            }
        ],
        "headers": {"Content-Type": "application/json"},
    }

    mock_client_session = MockHttpClient()
    mock_client_session.post.side_effect = [
        MockAsyncResponse(first_resp),
        MockAsyncResponse(second_resp),
    ]

    params = []
    for name, typ in [("x", "integer"), ("y", "integer")]:
        p = mock.MagicMock()
        p.type_json = json.dumps({"type": typ})
        p.name = name
        params.append(p)

    mock_func_info = mock.MagicMock()
    mock_func_info.input_params.parameters = params
    mock_func_info.data_type = ColumnTypeName.INT
    mock_func_info.name = "func"
    mock_func_info.catalog_name = "test"
    mock_func_info.schema_name = "uc"
    mock_func_info.full_name = "test.uc.func"

    mock_workspace_client = mock.MagicMock()
    mock_workspace_client.functions.get.return_value = mock_func_info

    mock_statement_result = mock.MagicMock()
    mock_statement_result.result.data_array = [[3]]
    mock_statement_result.status.state = StatementState.SUCCEEDED
    mock_statement_result.manifest.truncated = "manifest"
    mock_workspace_client.statement_execution.execute_statement.return_value = mock_statement_result

    with (
        mock.patch("aiohttp.ClientSession", return_value=mock_client_session),
        mock.patch(
            "mlflow.gateway.providers.openai._get_workspace_client",
            return_value=mock_workspace_client,
        ) as mock_workspace_client,
    ):
        provider = OpenAIProvider(EndpointConfig(**config))
        payload = {
            "messages": [
                {
                    "role": "user",
                    "content": "Tell me a joke",
                }
            ],
            "temperature": 0.5,
            "tools": [
                {
                    "type": "uc_function",
                    "uc_function": {
                        "name": "test.uc.func",
                    },
                }
            ],
        }
        response = await provider.chat(chat.RequestPayload(**payload))
        assert mock_client_session.post.call_count == 2

        assert jsonable_encoder(response) == {
            "id": "chatcmpl-abc123",
            "object": "chat.completion",
            "created": 1677858242,
            "model": "gpt-4o-mini",
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": r"""
<uc_function_call>
{
  "id": "call_id",
  "name": "test.uc.func",
  "arguments": "{\"x\": 1, \"y\": 2}"
}
</uc_function_call>

<uc_function_result>
{
  "tool_call_id": "call_id",
  "content": "{\"format\": \"SCALAR\", \"value\": \"3\", \"truncated\": \"manifest\"}"
}
</uc_function_result>

1 + 2 = 3""".lstrip(),
                        "tool_calls": None,
                        "refusal": None,
                    },
                    "finish_reason": "stop",
                }
            ],
            # The server makes two requests, the token usage should be doubled
            "usage": {"prompt_tokens": 13 * 2, "completion_tokens": 7 * 2, "total_tokens": 20 * 2},
        }


@pytest.mark.asyncio
async def test_uc_functions_user_defined_functions(monkeypatch):
    from databricks.sdk.service.catalog import ColumnTypeName
    from databricks.sdk.service.sql import StatementState

    monkeypatch.setenv("MLFLOW_ENABLE_UC_FUNCTIONS", "true")
    monkeypatch.setenv("DATABRICKS_WAREHOUSE_ID", "1234")

    config = chat_config()
    first_resp = {
        "id": "chatcmpl-abc123",
        "object": "chat.completion",
        "created": 1677858242,
        "model": "gpt-4o-mini",
        "usage": {
            "prompt_tokens": 13,
            "completion_tokens": 7,
            "total_tokens": 20,
        },
        "choices": [
            {
                "message": {
                    "role": "assistant",
                    "content": None,
                    "tool_calls": [
                        {
                            "id": "call_id_1",
                            "function": {
                                "arguments": '{"x": 1, "y": 2}',
                                "name": "test__uc__func",
                            },
                            "type": "function",
                        },
                        {
                            "id": "call_id_2",
                            "function": {
                                "arguments": '{"x": 3, "y": 4}',
                                "name": "multiply",
                            },
                            "type": "function",
                        },
                    ],
                },
                "index": 0,
            }
        ],
        "headers": {"Content-Type": "application/json"},
    }

    second_resp = {
        "id": "chatcmpl-abc123",
        "object": "chat.completion",
        "created": 1677858242,
        "model": "gpt-4o-mini",
        "usage": {
            "prompt_tokens": 13,
            "completion_tokens": 7,
            "total_tokens": 20,
        },
        "choices": [
            {
                "message": {
                    "role": "assistant",
                    "content": "1 + 2 = 3",
                },
                "finish_reason": "stop",
                "index": 0,
            }
        ],
        "headers": {"Content-Type": "application/json"},
    }

    mock_client_session = MockHttpClient()
    mock_client_session.post.side_effect = [
        MockAsyncResponse(first_resp),
        MockAsyncResponse(second_resp),
    ]

    params = []
    for name, typ in [("x", "integer"), ("y", "integer")]:
        p = mock.MagicMock()
        p.type_json = json.dumps({"type": typ})
        p.name = name
        params.append(p)

    mock_func_info = mock.MagicMock()
    mock_func_info.input_params.parameters = params
    mock_func_info.data_type = ColumnTypeName.INT
    mock_func_info.name = "func"
    mock_func_info.catalog_name = "test"
    mock_func_info.schema_name = "uc"
    mock_func_info.full_name = "test.uc.func"

    mock_workspace_client = mock.MagicMock()
    mock_workspace_client.functions.get.return_value = mock_func_info

    mock_statement_result = mock.MagicMock()
    mock_statement_result.result.data_array = [[3]]
    mock_statement_result.status.state = StatementState.SUCCEEDED
    mock_statement_result.manifest.truncated = "manifest"
    mock_workspace_client.statement_execution.execute_statement.return_value = mock_statement_result

    with (
        mock.patch("aiohttp.ClientSession", return_value=mock_client_session),
        mock.patch(
            "mlflow.gateway.providers.openai._get_workspace_client",
            return_value=mock_workspace_client,
        ) as mock_workspace_client,
    ):
        provider = OpenAIProvider(EndpointConfig(**config))
        payload = {
            "messages": [
                {
                    "role": "user",
                    "content": "What is 1 + 2? What is 3 * 4?",
                }
            ],
            "temperature": 0.5,
            "tools": [
                {
                    "type": "uc_function",
                    "uc_function": {
                        "name": "test.uc.func",
                    },
                },
                {
                    "type": "function",
                    "function": {
                        "description": "Multiply numbers",
                        "name": "multiply",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "x": {
                                    "type": "integer",
                                    "description": "First number",
                                },
                                "y": {
                                    "type": "integer",
                                    "description": "Second number",
                                },
                            },
                            "required": ["x", "y"],
                        },
                    },
                },
            ],
        }
        response = await provider.chat(chat.RequestPayload(**payload))
        assert mock_client_session.post.call_count == 1

        assert jsonable_encoder(response) == {
            "id": "chatcmpl-abc123",
            "object": "chat.completion",
            "created": 1677858242,
            "model": "gpt-4o-mini",
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": r"""
<uc_function_call>
{
  "id": "call_id_1",
  "name": "test.uc.func",
  "arguments": "{\"x\": 1, \"y\": 2}"
}
</uc_function_call>

<uc_function_result>
{
  "tool_call_id": "call_id_1",
  "content": "{\"format\": \"SCALAR\", \"value\": \"3\", \"truncated\": \"manifest\"}"
}
</uc_function_result>""".lstrip(),
                        "tool_calls": [
                            {
                                "id": "call_id_2",
                                "type": "function",
                                "function": {
                                    "arguments": '{"x": 3, "y": 4}',
                                    "name": "multiply",
                                },
                            },
                        ],
                        "refusal": None,
                    },
                    "finish_reason": None,
                }
            ],
            "usage": {"prompt_tokens": 13, "completion_tokens": 7, "total_tokens": 20},
        }
```

--------------------------------------------------------------------------------

---[FILE: test_palm.py]---
Location: mlflow-master/tests/gateway/providers/test_palm.py
Signals: FastAPI, Pydantic

```python
from unittest import mock

import pytest
from aiohttp import ClientTimeout
from fastapi.encoders import jsonable_encoder
from pydantic import ValidationError

from mlflow.gateway.config import EndpointConfig
from mlflow.gateway.constants import MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS
from mlflow.gateway.exceptions import AIGatewayException
from mlflow.gateway.providers.palm import PaLMProvider
from mlflow.gateway.schemas import chat, completions, embeddings

from tests.gateway.tools import MockAsyncResponse


def completions_config():
    return {
        "name": "completions",
        "endpoint_type": "llm/v1/completions",
        "model": {
            "provider": "palm",
            "name": "text-bison",
            "config": {
                "palm_api_key": "key",
            },
        },
    }


def completions_response():
    return {
        "candidates": [
            {
                "output": "This is a test",
                "safetyRatings": [
                    {"category": "HARM_CATEGORY_DEROGATORY", "probability": "NEGLIGIBLE"}
                ],
            }
        ],
        "headers": {"Content-Type": "application/json"},
    }


@pytest.mark.asyncio
async def test_completions():
    resp = completions_response()
    config = completions_config()
    with (
        mock.patch("time.time", return_value=1677858242),
        mock.patch("aiohttp.ClientSession.post", return_value=MockAsyncResponse(resp)) as mock_post,
    ):
        provider = PaLMProvider(EndpointConfig(**config))
        payload = {
            "prompt": "This is a test",
            "n": 1,
            "max_tokens": 1000,
            "stop": ["foobar"],
        }
        response = await provider.completions(completions.RequestPayload(**payload))
        assert jsonable_encoder(response) == {
            "id": None,
            "object": "text_completion",
            "created": 1677858242,
            "model": "text-bison",
            "choices": [
                {
                    "text": "This is a test",
                    "index": 0,
                    "finish_reason": None,
                }
            ],
            "usage": {"prompt_tokens": None, "completion_tokens": None, "total_tokens": None},
        }
        mock_post.assert_called_once_with(
            "https://generativelanguage.googleapis.com/v1beta3/models/text-bison:generateText",
            json={
                "prompt": {
                    "text": "This is a test",
                },
                "temperature": 0.0,
                "candidateCount": 1,
                "maxOutputTokens": 1000,
                "stopSequences": ["foobar"],
            },
            timeout=ClientTimeout(total=MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS),
        )


@pytest.mark.asyncio
async def test_completions_temperature_is_scaled_correctly():
    resp = completions_response()
    config = completions_config()
    with mock.patch(
        "aiohttp.ClientSession.post", return_value=MockAsyncResponse(resp)
    ) as mock_post:
        provider = PaLMProvider(EndpointConfig(**config))
        payload = {
            "prompt": "This is a test",
            "temperature": 0.5,
        }
        await provider.completions(completions.RequestPayload(**payload))
        assert mock_post.call_args[1]["json"]["temperature"] == 0.5 * 0.5


def chat_config():
    return {
        "name": "chat",
        "endpoint_type": "llm/v1/chat",
        "model": {
            "provider": "palm",
            "name": "chat-bison",
            "config": {
                "palm_api_key": "key",
            },
        },
    }


def chat_response():
    return {
        "candidates": [{"author": "1", "content": "Hi there! How can I help you today?"}],
        "messages": [{"author": "0", "content": "hi"}],
    }


@pytest.mark.parametrize(
    ("payload", "expected_llm_input"),
    [
        (
            {"messages": [{"role": "user", "content": "Tell me a joke"}]},
            {
                "temperature": 0.0,
                "candidateCount": 1,
                "prompt": {"messages": [{"content": "Tell me a joke", "author": "user"}]},
            },
        ),
        (
            {
                "messages": [
                    {"role": "system", "content": "You're funny"},
                    {"role": "user", "content": "Tell me a joke"},
                ]
            },
            {
                "temperature": 0.0,
                "candidateCount": 1,
                "prompt": {
                    "messages": [
                        {"content": "You're funny", "author": "system"},
                        {"content": "Tell me a joke", "author": "user"},
                    ]
                },
            },
        ),
        (
            {
                "messages": [{"role": "user", "content": "Tell me a joke"}],
                "temperature": 0.5,
            },
            {
                "temperature": 0.25,
                "candidateCount": 1,
                "prompt": {"messages": [{"content": "Tell me a joke", "author": "user"}]},
            },
        ),
    ],
)
@pytest.mark.asyncio
async def test_chat(payload, expected_llm_input):
    resp = chat_response()
    config = chat_config()
    with (
        mock.patch("time.time", return_value=1700242674),
        mock.patch("aiohttp.ClientSession.post", return_value=MockAsyncResponse(resp)) as mock_post,
    ):
        provider = PaLMProvider(EndpointConfig(**config))
        response = await provider.chat(chat.RequestPayload(**payload))
        assert jsonable_encoder(response) == {
            "id": None,
            "created": 1700242674,
            "object": "chat.completion",
            "model": "chat-bison",
            "choices": [
                {
                    "message": {
                        "role": "1",
                        "content": "Hi there! How can I help you today?",
                        "tool_calls": None,
                        "refusal": None,
                    },
                    "finish_reason": None,
                    "index": 0,
                }
            ],
            "usage": {
                "prompt_tokens": None,
                "completion_tokens": None,
                "total_tokens": None,
            },
        }
        mock_post.assert_called_once_with(
            "https://generativelanguage.googleapis.com/v1beta3/models/chat-bison:generateMessage",
            json=expected_llm_input,
            timeout=ClientTimeout(total=MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS),
        )


def embeddings_config():
    return {
        "name": "embeddings",
        "endpoint_type": "llm/v1/embeddings",
        "model": {
            "provider": "palm",
            "name": "embedding-gecko",
            "config": {
                "palm_api_key": "key",
            },
        },
    }


def embeddings_response():
    return {
        "embeddings": [
            {
                "value": [
                    3.25,
                    0.7685547,
                    2.65625,
                    -0.30126953,
                    -2.3554688,
                    1.2597656,
                ]
            }
        ],
        "headers": {"Content-Type": "application/json"},
    }


def embeddings_batch_response():
    return {
        "embeddings": [
            {
                "value": [
                    3.25,
                    0.7685547,
                    2.65625,
                    -0.30126953,
                    -2.3554688,
                    1.2597656,
                ]
            },
            {
                "value": [
                    7.25,
                    0.7685547,
                    4.65625,
                    -0.30126953,
                    -2.3554688,
                    8.2597656,
                ]
            },
        ],
        "headers": {"Content-Type": "application/json"},
    }


@pytest.mark.parametrize("prompt", ["This is a test", ["This is a test"]])
@pytest.mark.asyncio
async def test_embeddings(prompt):
    config = embeddings_config()
    with mock.patch(
        "aiohttp.ClientSession.post", return_value=MockAsyncResponse(embeddings_response())
    ) as mock_post:
        provider = PaLMProvider(EndpointConfig(**config))
        payload = {"input": prompt}
        response = await provider.embeddings(embeddings.RequestPayload(**payload))
        assert jsonable_encoder(response) == {
            "object": "list",
            "data": [
                {
                    "object": "embedding",
                    "embedding": [
                        3.25,
                        0.7685547,
                        2.65625,
                        -0.30126953,
                        -2.3554688,
                        1.2597656,
                    ],
                    "index": 0,
                }
            ],
            "model": "embedding-gecko",
            "usage": {"prompt_tokens": None, "total_tokens": None},
        }
        mock_post.assert_called_once()


@pytest.mark.asyncio
async def test_embeddings_batch():
    config = embeddings_config()
    with mock.patch(
        "aiohttp.ClientSession.post", return_value=MockAsyncResponse(embeddings_batch_response())
    ) as mock_post:
        provider = PaLMProvider(EndpointConfig(**config))
        payload = {"input": ["this is a", "batch test"]}
        response = await provider.embeddings(embeddings.RequestPayload(**payload))
        assert jsonable_encoder(response) == {
            "object": "list",
            "data": [
                {
                    "object": "embedding",
                    "embedding": [
                        3.25,
                        0.7685547,
                        2.65625,
                        -0.30126953,
                        -2.3554688,
                        1.2597656,
                    ],
                    "index": 0,
                },
                {
                    "object": "embedding",
                    "embedding": [
                        7.25,
                        0.7685547,
                        4.65625,
                        -0.30126953,
                        -2.3554688,
                        8.2597656,
                    ],
                    "index": 1,
                },
            ],
            "model": "embedding-gecko",
            "usage": {"prompt_tokens": None, "total_tokens": None},
        }
        mock_post.assert_called_once()


@pytest.mark.asyncio
async def test_param_model_is_not_permitted():
    config = completions_config()
    provider = PaLMProvider(EndpointConfig(**config))
    payload = {
        "prompt": "This should fail",
        "max_tokens": 5000,
        "model": "something-else",
    }
    with pytest.raises(AIGatewayException, match=r".*") as e:
        await provider.completions(completions.RequestPayload(**payload))
    assert "The parameter 'model' is not permitted" in e.value.detail
    assert e.value.status_code == 422


@pytest.mark.parametrize("prompt", [{"set1", "set2"}, ["list1"], [1], ["list1", "list2"], [1, 2]])
@pytest.mark.asyncio
async def test_completions_throws_if_prompt_contains_non_string(prompt):
    config = completions_config()
    provider = PaLMProvider(EndpointConfig(**config))
    payload = {"prompt": prompt}
    with pytest.raises(ValidationError, match=r"prompt"):
        await provider.completions(completions.RequestPayload(**payload))


@pytest.mark.parametrize(
    "payload",
    [
        {
            "messages": [{"role": "user", "content": "This should fail."}],
            "max_tokens": 5000,
        },
        {
            "messages": [{"role": "user", "content": "This should fail."}],
            "maxOutputTokens": 5000,
        },
    ],
)
@pytest.mark.asyncio
async def test_param_max_tokens_for_chat_is_not_permitted(payload):
    config = chat_config()
    provider = PaLMProvider(EndpointConfig(**config))
    with pytest.raises(AIGatewayException, match=r".*") as e:
        await provider.chat(chat.RequestPayload(**payload))
    assert "Max tokens is not supported for PaLM chat." in e.value.detail
    assert e.value.status_code == 422
```

--------------------------------------------------------------------------------

---[FILE: test_provider_utils.py]---
Location: mlflow-master/tests/gateway/providers/test_provider_utils.py

```python
import pytest

from mlflow.gateway.providers.utils import (
    rename_payload_keys,
)


def test_rename_payload_keys():
    payload = {"old_key1": "value1", "old_key2": "value2", "old_key3": None, "old_key4": []}
    mapping = {"old_key1": "new_key1", "old_key2": "new_key2"}
    expected = {"new_key1": "value1", "new_key2": "value2", "old_key3": None, "old_key4": []}
    assert rename_payload_keys(payload, mapping) == expected


@pytest.mark.parametrize(
    ("payload", "mapping", "expected"),
    [
        (
            {"old_key1": "value1", "old_key2": None, "old_key3": "value3"},
            {"old_key1": "new_key1", "old_key3": "new_key3"},
            {"new_key1": "value1", "old_key2": None, "new_key3": "value3"},
        ),
        (
            {"old_key1": None, "old_key2": "value2", "old_key3": []},
            {"old_key1": "new_key1", "old_key3": "new_key3"},
            {"new_key1": None, "old_key2": "value2", "new_key3": []},
        ),
        (
            {"old_key1": "value1", "old_key2": "value2"},
            {"old_key1": "new_key1", "old_key3": "new_key3"},
            {"new_key1": "value1", "old_key2": "value2"},
        ),
    ],
)
def test_rename_payload_keys_parameterized(payload, mapping, expected):
    assert rename_payload_keys(payload, mapping) == expected
```

--------------------------------------------------------------------------------

````
