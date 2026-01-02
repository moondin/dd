---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 808
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 808 of 991)

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

---[FILE: test_togetherai.py]---
Location: mlflow-master/tests/gateway/providers/test_togetherai.py
Signals: FastAPI

```python
import textwrap
from unittest import mock

import pytest
from aiohttp import ClientTimeout
from fastapi.encoders import jsonable_encoder

from mlflow.gateway.config import EndpointConfig
from mlflow.gateway.constants import MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS
from mlflow.gateway.exceptions import AIGatewayException
from mlflow.gateway.providers.togetherai import TogetherAIProvider
from mlflow.gateway.schemas import chat, completions, embeddings

from tests.gateway.tools import MockAsyncResponse, MockAsyncStreamingResponse


def completions_config():
    return {
        "name": "completions",
        "endpoint_type": "llm/v1/completions",
        "model": {
            "provider": "togetherai",
            "name": "mistralai/Mixtral-8x7B-Instruct-v0.1",
            "config": {
                "togetherai_api_key": "key",
            },
        },
    }


def completions_response():
    return {
        "id": "8447f286bbdb67b3-SJC",
        "choices": [
            {
                "index": 0,
                "text": textwrap.dedent(
                    """\
                The capital of France is Paris.
                It's located in the north-central part of the country
                and is one of the most famous cities in the world,
                known for its iconic landmarks such as the Eiffel Tower,
                Louvre Museum, Notre-Dame Cathedral, and more.
                Paris is also the cultural, political, and economic center of France.
                """
                ),
                "finish_reason": None,
            }
        ],
        "usage": {"prompt_tokens": 16, "completion_tokens": 78, "total_tokens": 94},
        "created": 1705089226,
        "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
        "object": "text_completion",
    }


@pytest.mark.asyncio
async def test_completions():
    config = completions_config()
    resp = completions_response()

    with (
        mock.patch("time.time", return_value=1677858242),
        mock.patch("aiohttp.ClientSession.post", return_value=MockAsyncResponse(resp)) as mock_post,
    ):
        provider = TogetherAIProvider(EndpointConfig(**config))

        payload = {
            "prompt": "Whats the capital of France?",
            "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
            "max_tokens": 200,
            "temperature": 1.0,
            "n": 1,
        }

        response = await provider.completions(completions.RequestPayload(**payload))

        assert jsonable_encoder(response) == {
            "id": "8447f286bbdb67b3-SJC",
            "choices": [
                {
                    "index": 0,
                    "text": textwrap.dedent(
                        """\
                    The capital of France is Paris.
                    It's located in the north-central part of the country
                    and is one of the most famous cities in the world,
                    known for its iconic landmarks such as the Eiffel Tower,
                    Louvre Museum, Notre-Dame Cathedral, and more.
                    Paris is also the cultural, political, and economic center of France.
                    """
                    ),
                    "finish_reason": None,
                }
            ],
            "usage": {"prompt_tokens": 16, "completion_tokens": 78, "total_tokens": 94},
            "created": 1705089226,
            "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
            "object": "text_completion",
        }

        mock_post.assert_called_once_with(
            "https://api.together.xyz/v1/completions",
            json={
                "prompt": "Whats the capital of France?",
                "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
                "max_tokens": 200,
                "temperature": 1,
                "n": 1,
            },
            timeout=ClientTimeout(total=MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS),
        )


def completion_stream_response():
    return [
        b'data: {"id":"test-id","object":"completion.chunk","created":1,'
        b'"choices":[{"index":0,"text":"test","logprobs":null,"finish_reason":null,"delta":{"token_id":546,"content":"test"}}],"model":"test","usage":null}\n',
        b"\n",
        b'data: {"id":"test-id","object":"completion.chunk","created":1,'
        b'"choices":[{"index":0,"text":"test","logprobs":null,"finish_reason":null,"delta":{"token_id":4234,"content":"test"}}],"model":"test","usage":null}\n',
        b"\n",
        b'data: {"id":"test-id","object":"completion.chunk","created":1,'
        b'"choices":[{"index":0,"text":"test","logprobs":null,"finish_reason":"length","delta":{"token_id":1345,"content":"test"}}],"model":"test","usage":{"prompt_tokens":17,"completion_tokens":200,"total_tokens":217}}\n',
        b"\n",
        b"data: [DONE]\n",
        b"\n",
    ]


def completion_stream_response_incomplete():
    return [
        b'data: {"id":"test-id","object":"completion.chunk","created":1,'
        b'"choices":[{"index":0,"text":"test","logprobs":null,"finish_reason":null,"delta":{"token_id":546,"content":"test"}}],"model":"test","usage":null}\n',
        b"\n",
        # split chunk into two parts
        b'data: {"id":"test-id","object":"completion.chunk","created":1,"choi'
        b'ces":[{"index":0,"text":"test","logprobs":null,"finish_reason":null,"delta":{"token_id":4234,"content":"test"}}],"model":"test","usage":null}\n\n',
        # split chunk into two parts
        b'data: {"id":"test-id","object":"completion.chunk","creat'
        b'ed":1,"choices":[{"index":0,"text":"test","logprobs":null,"finish_reason":"length","delta":{"token_id":1345,"content":"test"}}],"model":"test","usage":{"prompt_tokens":17,"completion_tokens":200,"total_tokens":217}}\n',
        b"\n",
        b"data: [DONE]\n",
        b"\n",
    ]


@pytest.mark.parametrize(
    "resp", [completion_stream_response(), completion_stream_response_incomplete()]
)
@pytest.mark.asyncio
async def test_completions_stream(resp):
    config = completions_config()

    with (
        mock.patch("time.time", return_value=1677858242),
        mock.patch(
            "aiohttp.ClientSession.post", return_value=MockAsyncStreamingResponse(resp)
        ) as mock_post,
    ):
        provider = TogetherAIProvider(EndpointConfig(**config))
        payload = {
            "model": "mistralai/Mixtral-8x7B-v0.1",
            "max_tokens": 200,
            "prompt": "This is a test",
            "temperature": 1,
            "n": 1,
        }
        response = provider.completions_stream(completions.RequestPayload(**payload))

        chunks = [jsonable_encoder(chunk) async for chunk in response]
        assert chunks == [
            {
                "choices": [
                    {
                        "text": "test",
                        "finish_reason": None,
                        "index": 0,
                    }
                ],
                "created": 1,
                "id": "test-id",
                "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
                "object": "text_completion_chunk",
            },
            {
                "choices": [
                    {
                        "text": "test",
                        "finish_reason": None,
                        "index": 0,
                    }
                ],
                "created": 1,
                "id": "test-id",
                "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
                "object": "text_completion_chunk",
            },
            {
                "choices": [
                    {
                        "text": "test",
                        "finish_reason": "length",
                        "index": 0,
                    }
                ],
                "created": 1,
                "id": "test-id",
                "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
                "object": "text_completion_chunk",
            },
        ]

        mock_post.assert_called_once_with(
            "https://api.together.xyz/v1/completions",
            json={
                "model": "mistralai/Mixtral-8x7B-v0.1",
                "temperature": 1,
                "max_tokens": 200,
                "n": 1,
                "prompt": "This is a test",
            },
            timeout=ClientTimeout(total=MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS),
        )


@pytest.mark.asyncio
async def test_max_tokens_missing_error():
    config = completions_config()

    # Define the response payload to be returned
    resp = completions_response()

    # Mock the post method to return the response payload
    with (
        mock.patch("time.time", return_value=1677858242),
        mock.patch("aiohttp.ClientSession.post", return_value=MockAsyncResponse(resp)) as mock_post,
    ):
        # Instantiate the provider
        provider = TogetherAIProvider(EndpointConfig(**config))

        # Prepare the payload with missing max_tokens
        payload = {
            "prompt": "What is the capital of France?",
            "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
            # "max_tokens" key is intentionally missing
            "temperature": 1.0,
            "n": 1,
        }

        error_string = (
            "max_tokens is not present in payload."
            "It is a required parameter for TogetherAI completions."
        )
        # Test whether AIGatewayException is raised when max_tokens is missing
        with pytest.raises(AIGatewayException, match=error_string) as exc_info:
            await provider.completions(completions.RequestPayload(**payload))

        # Check if the raised exception has correct status code and detail
        assert exc_info.value.status_code == 422
        assert exc_info.value.detail == error_string
        # Assert that the post method was not called
        mock_post.assert_not_called()


@pytest.mark.asyncio
async def test_wrong_logprobs_type_error():
    config = completions_config()
    # Define the response payload to be returned
    resp = completions_response()

    # Mock the post method to return the response payload
    with (
        mock.patch("time.time", return_value=1677858242),
        mock.patch("aiohttp.ClientSession.post", return_value=MockAsyncResponse(resp)) as mock_post,
    ):
        # Instantiate the provider
        provider = TogetherAIProvider(EndpointConfig(**config))

        # Prepare the payload with missing max_tokens
        payload = {
            "prompt": "What is the capital of France?",
            "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
            "max_tokens": 200,
            "temperature": 1.0,
            "n": 1,
            "logprobs": "invalid_type",
        }
        error_string = "Wrong type for logprobs. It should be an 32bit integer."
        # Test whether AIGatewayException is raised when max_tokens is missing
        with pytest.raises(AIGatewayException, match=error_string) as exc_info:
            await provider.completions(completions.RequestPayload(**payload))

        # Check if the raised exception has correct status code and detail
        assert exc_info.value.status_code == 422
        assert exc_info.value.detail == error_string
        # Assert that the post method was not called
        mock_post.assert_not_called()


def embeddings_config():
    return {
        "name": "embeddings",
        "endpoint_type": "llm/v1/embeddings",
        "model": {
            "provider": "togetherai",
            "name": "togethercomputer/m2-bert-80M-8k-retrieval",
            "config": {
                "togetherai_api_key": "key",
            },
        },
    }


def embeddings_response():
    return {
        "object": "list",
        "data": [
            {
                "object": "embedding",
                "embedding": [0.44990748, -0.2521129, -0.43091708, 0.214978],
                "index": 0,
            }
        ],
        "model": "togethercomputer/m2-bert-80M-8k-retrieval",
        "request_id": "840fc1b5bb2830cb-SEA",
    }


@pytest.mark.asyncio
async def test_embeddings():
    config = embeddings_config()
    resp = embeddings_response()

    with (
        mock.patch("time.time", return_value=1677858242),
        mock.patch("aiohttp.ClientSession.post", return_value=MockAsyncResponse(resp)) as mock_post,
    ):
        provider = TogetherAIProvider(EndpointConfig(**config))

        payload = {
            "input": "Our solar system orbits the Milky Way galaxy at about 515,000 mph.",
            "model": "togethercomputer/m2-bert-80M-8k-retrieval",
        }

        response = await provider.embeddings(embeddings.RequestPayload(**payload))

        assert jsonable_encoder(response) == {
            "object": "list",
            "data": [
                {
                    "object": "embedding",
                    "embedding": [0.44990748, -0.2521129, -0.43091708, 0.214978],
                    "index": 0,
                }
            ],
            "model": "togethercomputer/m2-bert-80M-8k-retrieval",
            "usage": {"prompt_tokens": None, "total_tokens": None},
        }

        mock_post.assert_called_once_with(
            "https://api.together.xyz/v1/embeddings",
            json={
                "input": "Our solar system orbits the Milky Way galaxy at about 515,000 mph.",
                "model": "togethercomputer/m2-bert-80M-8k-retrieval",
            },
            timeout=ClientTimeout(total=MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS),
        )


def chat_config():
    return {
        "name": "chat",
        "endpoint_type": "llm/v1/chat",
        "model": {
            "provider": "togetherai",
            "name": "mistralai/Mixtral-8x7B-Instruct-v0.1",
            "config": {
                "togetherai_api_key": "key",
            },
        },
    }


def chat_response():
    return {
        "id": "8448080b880415ea-SJC",
        "choices": [{"message": {"role": "assistant", "content": "Its Artyom!"}}],
        "usage": {"prompt_tokens": 13, "completion_tokens": 7, "total_tokens": 20},
        "created": 1705090115,
        "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
        "object": "chat.completion",
    }


@pytest.mark.asyncio
async def test_chat():
    config = chat_config()
    resp = chat_response()

    with (
        mock.patch("time.time", return_value=1677858242),
        mock.patch("aiohttp.ClientSession.post", return_value=MockAsyncResponse(resp)) as mock_post,
    ):
        provider = TogetherAIProvider(EndpointConfig(**config))

        payload = {
            "messages": [{"role": "user", "content": "Who's the protagonist in Metro 2033?"}],
            "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
            "max_tokens": 200,
            "temperature": 1.0,
            "n": 1,
        }

        response = await provider.chat(chat.RequestPayload(**payload))

        assert jsonable_encoder(response) == {
            "id": "8448080b880415ea-SJC",
            "object": "chat.completion",
            "created": 1705090115,
            "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": "Its Artyom!",
                        "tool_calls": None,
                        "refusal": None,
                    },
                    "finish_reason": None,
                }
            ],
            "usage": {"prompt_tokens": 13, "completion_tokens": 7, "total_tokens": 20},
        }

        mock_post.assert_called_once_with(
            "https://api.together.xyz/v1/chat/completions",
            json={
                "messages": [{"role": "user", "content": "Who's the protagonist in Metro 2033?"}],
                "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
                "max_tokens": 200,
                "temperature": 1.0,
                "n": 1,
            },
            timeout=ClientTimeout(total=MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS),
        )


def chat_stream_response():
    return [
        b'data: {"id":"test-id","object":"chat.completion.chunk","created":1,'
        b'"choices":[{"index":0,"text":"test","logprobs":null,"finish_reason":null,"delta":{"token_id":546,"content":"test"}}],"model":"test","usage":null}\n',
        b"\n",
        b'data: {"id":"test-id","object":"chat.completion.chunk","created":1,'
        b'"choices":[{"index":0,"text":"test","logprobs":null,"finish_reason":null,"delta":{"token_id":4234,"content":"test"}}],"model":"test","usage":null}\n',
        b"\n",
        b'data: {"id":"test-id","object":"chat.completion.chunk","created":1,'
        b'"choices":[{"index":0,"text":"test","logprobs":null,"finish_reason":"length","delta":{"token_id":1345,"content":"test"}}],"model":"test","usage":{"prompt_tokens":17,"completion_tokens":200,"total_tokens":217}}\n',
        b"\n",
        b"data: [DONE]\n",
        b"\n",
    ]


def chat_stream_response_incomplete():
    return [
        b'data: {"id":"test-id","object":"chat.completion.chunk","created":1,'
        b'"choices":[{"index":0,"text":"test","logprobs":null,"finish_reason":null,"delta":{"token_id":546,"content":"test"}}],"model":"test","usage":null}\n',
        b"\n",
        # split chunk into two parts
        b'data: {"id":"test-id","object":"chat.completion.chunk","created":1,"choi'
        b'ces":[{"index":0,"text":"test","logprobs":null,"finish_reason":null,"delta":{"token_id":4234,"content":"test"}}],"model":"test","usage":null}\n\n',
        # split chunk into two parts
        b'data: {"id":"test-id","object":"chat.completion.chunk","creat'
        b'ed":1,"choices":[{"index":0,"text":"test","logprobs":null,"finish_reason":"length","delta":{"token_id":1345,"content":"test"}}],"model":"test","usage":{"prompt_tokens":17,"completion_tokens":200,"total_tokens":217}}\n',
        b"\n",
        b"data: [DONE]\n",
        b"\n",
    ]


@pytest.mark.parametrize("resp", [chat_stream_response(), chat_stream_response_incomplete()])
@pytest.mark.asyncio
async def test_chat_stream(resp):
    config = chat_config()

    with (
        mock.patch("time.time", return_value=1677858242),
        mock.patch(
            "aiohttp.ClientSession.post", return_value=MockAsyncStreamingResponse(resp)
        ) as mock_post,
    ):
        provider = TogetherAIProvider(EndpointConfig(**config))
        payload = {
            "model": "mistralai/Mixtral-8x7B-v0.1",
            "messages": [
                {"role": "system", "content": "This is a test"},
                {"role": "user", "content": "This is a test"},
                {"role": "assistant", "content": "This is a test"},
                {"role": "user", "content": "This is a test"},
            ],
            "temperature": 1,
            "n": 1,
        }
        response = provider.chat_stream(chat.RequestPayload(**payload))

        chunks = [jsonable_encoder(chunk) async for chunk in response]
        assert chunks == [
            {
                "choices": [
                    {
                        "delta": {
                            "role": None,
                            "content": "test",
                            "tool_calls": None,
                        },
                        "finish_reason": None,
                        "index": 0,
                    }
                ],
                "created": 1,
                "id": "test-id",
                "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
                "object": "chat.completion.chunk",
            },
            {
                "choices": [
                    {
                        "delta": {
                            "role": None,
                            "content": "test",
                            "tool_calls": None,
                        },
                        "finish_reason": None,
                        "index": 0,
                    }
                ],
                "created": 1,
                "id": "test-id",
                "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
                "object": "chat.completion.chunk",
            },
            {
                "choices": [
                    {
                        "delta": {
                            "role": None,
                            "content": "test",
                            "tool_calls": None,
                        },
                        "finish_reason": "length",
                        "index": 0,
                    }
                ],
                "created": 1,
                "id": "test-id",
                "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
                "object": "chat.completion.chunk",
            },
        ]

        mock_post.assert_called_once_with(
            "https://api.together.xyz/v1/chat/completions",
            json={
                "model": "mistralai/Mixtral-8x7B-v0.1",
                "temperature": 1,
                "messages": [
                    {"role": "system", "content": "This is a test"},
                    {"role": "user", "content": "This is a test"},
                    {"role": "assistant", "content": "This is a test"},
                    {"role": "user", "content": "This is a test"},
                ],
                "n": 1,
            },
            timeout=ClientTimeout(total=MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS),
        )
```

--------------------------------------------------------------------------------

---[FILE: test_traffic_route_provider.py]---
Location: mlflow-master/tests/gateway/providers/test_traffic_route_provider.py

```python
from typing import Any

import pytest

from mlflow.gateway.config import EndpointConfig
from mlflow.gateway.providers.base import TrafficRouteProvider

from tests.gateway.providers.test_openai import (
    _run_test_chat,
    _run_test_chat_stream,
    _run_test_completions,
    _run_test_completions_stream,
    _run_test_embeddings,
    chat_config,
    chat_response,
    chat_stream_response,
    chat_stream_response_incomplete,
    completions_config,
    completions_response,
    completions_stream_response,
    completions_stream_response_incomplete,
    embedding_config,
)


def _get_traffic_route_provider(endpoint_config: dict[str, Any]) -> TrafficRouteProvider:
    """
    Returns a traffic route provider that forwards 100% traffic to the endpoint
    configured by `endpoint_config`
    """
    return TrafficRouteProvider(
        configs=[EndpointConfig(**endpoint_config)],
        traffic_splits=[100],
        routing_strategy="TRAFFIC_SPLIT",
    )


@pytest.mark.asyncio
async def test_chat():
    config = chat_config()
    provider = _get_traffic_route_provider(config)
    await _run_test_chat(provider)


@pytest.mark.parametrize("resp", [chat_stream_response(), chat_stream_response_incomplete()])
@pytest.mark.asyncio
async def test_chat_stream(resp):
    config = chat_config()
    provider = _get_traffic_route_provider(config)
    await _run_test_chat_stream(resp, provider)


@pytest.mark.parametrize("resp", [completions_response(), chat_response()])
@pytest.mark.asyncio
async def test_completions(resp):
    config = completions_config()
    provider = _get_traffic_route_provider(config)
    await _run_test_completions(resp, provider)


@pytest.mark.parametrize(
    "resp", [completions_stream_response(), completions_stream_response_incomplete()]
)
@pytest.mark.asyncio
async def test_completions_stream(resp):
    config = completions_config()
    provider = _get_traffic_route_provider(config)
    await _run_test_completions_stream(resp, provider)


@pytest.mark.asyncio
async def test_embeddings():
    config = embedding_config()
    provider = _get_traffic_route_provider(config)
    await _run_test_embeddings(provider)
```

--------------------------------------------------------------------------------

---[FILE: test_chat.py]---
Location: mlflow-master/tests/gateway/schemas/test_chat.py
Signals: Pydantic

```python
import pydantic
import pytest

from mlflow.gateway.schemas import chat


def test_chat_request():
    chat.RequestPayload(
        **{
            "messages": [{"role": "user", "content": "content"}],
        }
    )
    chat.RequestPayload(
        **{
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "content"},
                    ],
                },
                {
                    "role": "system",
                    "content": [
                        {"type": "input_audio", "input_audio": {"data": "data", "format": "wav"}},
                    ],
                },
                {
                    "role": "assistant",
                    "content": [
                        {"type": "image_url", "image_url": {"url": "url", "detail": "high"}},
                    ],
                },
                {
                    "role": "assistant",
                    "tool_calls": [
                        {
                            "id": "123",
                            "function": {"name": "weather_tool", "arguments": "json string"},
                            "type": "function",
                        }
                    ],
                },
                {"role": "tool", "content": "tool output", "tool_call_id": "123"},
            ],
        }
    )
    chat.RequestPayload(
        **{
            "messages": [{"role": "user", "content": "content"}],
            "n": 1000,
            "extra": "extra",
            "temperature": 2.0,
        }
    )
    chat.RequestPayload(
        **{
            "messages": [{"role": "user", "content": "content"}],
            "tools": [
                {
                    "type": "function",
                    "function": {
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
                            "required": ["location"],
                        },
                    },
                }
            ],
        }
    )

    with pytest.raises(pydantic.ValidationError, match="less than or equal to 2"):
        chat.RequestPayload(
            **{
                "messages": [{"role": "user", "content": "content"}],
                "temperature": 3.0,
            }
        )

    with pytest.raises(pydantic.ValidationError, match="at least 1 item"):
        chat.RequestPayload(
            **{
                "messages": [{"role": "user", "content": "content"}],
                "stop": [],
            }
        )

    with pytest.raises(pydantic.ValidationError, match="at least 1 item"):
        chat.RequestPayload(**{"messages": []})

    with pytest.raises(pydantic.ValidationError, match=r"(?i)field required"):
        chat.RequestPayload(**{})


def test_chat_response():
    chat.ResponsePayload(
        **{
            "created": 100,
            "model": "gpt-4",
            "choices": [
                {
                    "message": {"role": "assistant", "content": "content"},
                    "index": 0,
                },
            ],
            "usage": {
                "prompt_tokens": 1,
                "completion_tokens": 1,
                "total_tokens": 1,
            },
        }
    )

    chat.ResponsePayload(
        **{
            "id": "foobar",
            "created": 100,
            "model": "gpt-4",
            "object": "chat.completion",
            "choices": [
                {
                    "message": {
                        "role": "assistant",
                        "tool_calls": [
                            {
                                "id": "123",
                                "function": {"name": "weather_tool", "arguments": "json string"},
                                "type": "function",
                            }
                        ],
                    },
                    "finish_reason": "stop",
                    "index": 0,
                },
            ],
            "usage": {
                "prompt_tokens": 1,
                "completion_tokens": 1,
                "total_tokens": 1,
            },
        }
    )

    with pytest.raises(pydantic.ValidationError, match=r"(?i)field required"):
        chat.ResponsePayload(**{"usage": {}})
```

--------------------------------------------------------------------------------

---[FILE: test_completions.py]---
Location: mlflow-master/tests/gateway/schemas/test_completions.py
Signals: Pydantic

```python
import time

import pydantic
import pytest

from mlflow.gateway.schemas import completions


def test_completions_request():
    completions.RequestPayload(**{"prompt": "prompt"})
    completions.RequestPayload(**{"prompt": ""})
    completions.RequestPayload(**{"prompt": "", "extra": "extra", "temperature": 2.0})

    with pytest.raises(pydantic.ValidationError, match="less than or equal to 2"):
        completions.RequestPayload(
            **{
                "messages": [{"role": "user", "content": "content"}],
                "temperature": 3.0,
            }
        )

    with pytest.raises(pydantic.ValidationError, match=r"(?i)field required"):
        completions.RequestPayload(**{"extra": "extra"})

    with pytest.raises(pydantic.ValidationError, match=r"(?i)field required"):
        completions.RequestPayload(**{})


def test_completions_response():
    completions.ResponsePayload(
        id="completions-id-1",
        object="text_completion",
        created=int(time.time()),
        model="gpt-4",
        choices=[
            completions.Choice(
                index=0,
                text="text",
                finish_reason="stop",
            )
        ],
        usage=completions.CompletionsUsage(
            prompt_tokens=1,
            completion_tokens=1,
            total_tokens=2,
        ),
    )

    completions.ResponsePayload(
        object="text_completion",
        created=int(time.time()),
        model="hf-tgi",
        choices=[
            completions.Choice(
                index=0,
                text="text",
                finish_reason="stop",
            ),
            completions.Choice(
                index=1,
                text="text",
                finish_reason="length",
            ),
            completions.Choice(
                index=2,
                text="text",
                finish_reason="foo",
            ),
            completions.Choice(
                index=3,
                text="text",
                finish_reason=None,
            ),
        ],
        usage=completions.CompletionsUsage(
            prompt_tokens=None,
            completion_tokens=None,
            total_tokens=None,
        ),
    )

    with pytest.raises(pydantic.ValidationError, match=r"(?i)field required"):
        completions.ResponsePayload(**{"usage": {}})
```

--------------------------------------------------------------------------------

---[FILE: test_embeddings.py]---
Location: mlflow-master/tests/gateway/schemas/test_embeddings.py
Signals: Pydantic

```python
import pydantic
import pytest

from mlflow.gateway.schemas import embeddings


def test_embeddings_request():
    embeddings.RequestPayload(**{"input": "text"})
    embeddings.RequestPayload(**{"input": ""})
    embeddings.RequestPayload(**{"input": ["prompt"]})
    embeddings.RequestPayload(**{"input": "text", "extra": "extra", "another_extra": 1})

    with pytest.raises(pydantic.ValidationError, match=r"(?i)field required"):
        embeddings.RequestPayload(**{})


def test_embeddings_response():
    embeddings.ResponsePayload(
        **{
            "object": "list",
            "data": [{"object": "embedding", "embedding": [0.01, -0.1], "index": 0}],
            "model": "sentence-piece",
            "usage": {"prompt_tokens": None, "total_tokens": None},
        }
    )

    embeddings.ResponsePayload(
        **{
            "object": "list",
            "data": [
                {"object": "embedding", "embedding": [0.01, -0.1], "index": 0},
                {"object": "embedding", "embedding": [0.03, -0.03], "index": 1},
            ],
            "model": "sentence-piece",
            "usage": {"prompt_tokens": 1, "total_tokens": 1},
        }
    )

    with pytest.raises(pydantic.ValidationError, match=r"(?i)field required"):
        embeddings.ResponsePayload(**{"usage": {}})
```

--------------------------------------------------------------------------------

````
