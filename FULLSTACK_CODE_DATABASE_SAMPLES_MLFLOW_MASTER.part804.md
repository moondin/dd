---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 804
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 804 of 991)

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

---[FILE: test_huggingface.py]---
Location: mlflow-master/tests/gateway/providers/test_huggingface.py
Signals: FastAPI

```python
from unittest import mock

import pytest
from aiohttp import ClientTimeout
from fastapi.encoders import jsonable_encoder

from mlflow.gateway.config import EndpointConfig
from mlflow.gateway.constants import MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS
from mlflow.gateway.exceptions import AIGatewayException
from mlflow.gateway.providers.huggingface import HFTextGenerationInferenceServerProvider
from mlflow.gateway.schemas import chat, completions, embeddings

from tests.gateway.tools import MockAsyncResponse
from tests.helper_functions import skip_if_hf_hub_unhealthy

pytestmark = skip_if_hf_hub_unhealthy()


def completions_config():
    return {
        "name": "completions",
        "endpoint_type": "llm/v1/completions",
        "model": {
            "provider": "huggingface-text-generation-inference",
            "name": "hf-tgi",
            "config": {"hf_server_url": "https://testserverurl.com"},
        },
    }


def embedding_config():
    return {
        "name": "embeddings",
        "endpoint_type": "llm/v1/embeddings",
        "model": {
            "provider": "huggingface-text-generation-inference",
            "name": "hf-tgi",
            "config": {"hf_server_url": "https://testserverurl.com"},
        },
    }


def chat_config():
    return {
        "name": "chat",
        "endpoint_type": "llm/v1/chat",
        "model": {
            "provider": "huggingface-text-generation-inference",
            "name": "hf-tgi",
            "config": {"hf_server_url": "https://testserverurl.com"},
        },
    }


def completions_response():
    return {
        "generated_text": "this is a test response",
        "details": {
            "finish_reason": "length",
            "generated_tokens": 5,
            "seed": 0,
            "prefill": [{"text": "This"}, {"text": "is"}, {"text": "a"}, {"text": "test"}],
        },
    }


@pytest.mark.asyncio
async def test_completions():
    resp = completions_response()
    config = completions_config()
    with (
        mock.patch("time.time", return_value=1677858242),
        mock.patch("aiohttp.ClientSession.post", return_value=MockAsyncResponse(resp)) as mock_post,
    ):
        provider = HFTextGenerationInferenceServerProvider(EndpointConfig(**config))
        payload = {
            "prompt": "This is a test",
            "n": 1,
            "max_tokens": 1000,
        }
        response = await provider.completions(completions.RequestPayload(**payload))
        assert jsonable_encoder(response) == {
            "id": None,
            "object": "text_completion",
            "created": 1677858242,
            "model": "hf-tgi",
            "choices": [
                {
                    "text": "this is a test response",
                    "index": 0,
                    "finish_reason": "length",
                }
            ],
            "usage": {"prompt_tokens": 4, "completion_tokens": 5, "total_tokens": 9},
        }
        mock_post.assert_called_once_with(
            "https://testserverurl.com/generate",
            json={
                "inputs": "This is a test",
                "parameters": {
                    "temperature": 0.001,
                    "max_new_tokens": 1000,
                    "details": True,
                    "decoder_input_details": True,
                },
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
        provider = HFTextGenerationInferenceServerProvider(EndpointConfig(**config))
        payload = {
            "prompt": "This is a test",
            "temperature": 0.5,
        }
        await provider.completions(completions.RequestPayload(**payload))
        assert mock_post.call_args[1]["json"]["parameters"]["temperature"] == 0.5 * 50


@pytest.mark.asyncio
async def test_completion_fails_with_multiple_candidates():
    config = chat_config()
    provider = HFTextGenerationInferenceServerProvider(EndpointConfig(**config))
    payload = {"prompt": "This is a test", "n": 2}
    with pytest.raises(AIGatewayException, match=r".*") as e:
        await provider.completions(completions.RequestPayload(**payload))
    assert "'n' must be '1' for the Text Generation Inference provider." in e.value.detail
    assert e.value.status_code == 422


@pytest.mark.asyncio
async def test_chat_is_not_supported_for_tgi():
    config = chat_config()
    provider = HFTextGenerationInferenceServerProvider(EndpointConfig(**config))
    payload = {"messages": [{"role": "user", "content": "TGI, can you chat with me? I'm lonely."}]}

    with pytest.raises(AIGatewayException, match=r".*") as e:
        await provider.chat(chat.RequestPayload(**payload))
    assert (
        "The chat route is not implemented for Hugging Face Text Generation Inference models."
        in e.value.detail
    )
    assert e.value.status_code == 501


@pytest.mark.asyncio
async def test_embeddings_are_not_supported_for_tgi():
    config = embedding_config()
    provider = HFTextGenerationInferenceServerProvider(EndpointConfig(**config))
    payload = {"input": "give me that sweet, sweet vector, please."}

    with pytest.raises(AIGatewayException, match=r".*") as e:
        await provider.embeddings(embeddings.RequestPayload(**payload))
    assert (
        "The embeddings route is not implemented for Hugging Face Text Generation Inference models."
        in e.value.detail
    )
    assert e.value.status_code == 501
```

--------------------------------------------------------------------------------

---[FILE: test_litellm.py]---
Location: mlflow-master/tests/gateway/providers/test_litellm.py

```python
from unittest import mock

import pytest

from mlflow.gateway.config import EndpointConfig
from mlflow.gateway.providers.litellm import LiteLLMAdapter, LiteLLMProvider
from mlflow.gateway.schemas import chat, embeddings

TEST_MESSAGE = "This is a test"


def chat_config():
    return {
        "name": "chat",
        "endpoint_type": "llm/v1/chat",
        "model": {
            "provider": "litellm",
            "name": "claude-3-5-sonnet-20241022",
            "config": {
                "litellm_api_key": "test-key",
            },
        },
    }


def chat_config_with_api_base():
    return {
        "name": "chat",
        "endpoint_type": "llm/v1/chat",
        "model": {
            "provider": "litellm",
            "name": "custom-model",
            "config": {
                "litellm_api_key": "test-key",
                "litellm_api_base": "https://custom-api.example.com",
            },
        },
    }


def chat_config_with_provider():
    return {
        "name": "chat",
        "endpoint_type": "llm/v1/chat",
        "model": {
            "provider": "litellm",
            "name": "claude-3-5-sonnet-20241022",
            "config": {
                "litellm_provider": "anthropic",
                "litellm_api_key": "test-key",
            },
        },
    }


def embeddings_config():
    return {
        "name": "embeddings",
        "endpoint_type": "llm/v1/embeddings",
        "model": {
            "provider": "litellm",
            "name": "text-embedding-3-small",
            "config": {
                "litellm_api_key": "test-key",
            },
        },
    }


def mock_litellm_chat_response():
    """Create a mock LiteLLM chat response object."""
    response = mock.MagicMock()
    response.id = "litellm-chat-id"
    response.object = "chat.completion"
    response.created = 1234567890
    response.model = "claude-3-5-sonnet-20241022"

    choice = mock.MagicMock()
    choice.index = 0
    choice.message = mock.MagicMock()
    choice.message.role = "assistant"
    choice.message.content = TEST_MESSAGE
    choice.message.tool_calls = None
    choice.finish_reason = "stop"

    response.choices = [choice]
    response.usage = mock.MagicMock()
    response.usage.prompt_tokens = 10
    response.usage.completion_tokens = 20
    response.usage.total_tokens = 30

    return response


def mock_litellm_embeddings_response():
    """Create a mock LiteLLM embeddings response object."""
    response = mock.MagicMock()
    response.model = "text-embedding-3-small"

    data = mock.MagicMock()
    data.__getitem__ = lambda self, key: [0.1, 0.2, 0.3] if key == "embedding" else None
    response.data = [data]

    response.usage = mock.MagicMock()
    response.usage.prompt_tokens = 5
    response.usage.total_tokens = 5

    return response


@pytest.mark.asyncio
async def test_chat():
    config = chat_config()
    mock_response = mock_litellm_chat_response()

    with mock.patch("litellm.acompletion", return_value=mock_response) as mock_completion:
        provider = LiteLLMProvider(EndpointConfig(**config))
        payload = {
            "messages": [{"role": "user", "content": TEST_MESSAGE}],
            "temperature": 0.7,
            "max_tokens": 100,
        }
        response = await provider.chat(chat.RequestPayload(**payload))

        assert response.id == "litellm-chat-id"
        assert response.object == "chat.completion"
        assert response.model == "claude-3-5-sonnet-20241022"
        assert len(response.choices) == 1
        assert response.choices[0].message.content == TEST_MESSAGE
        assert response.usage.prompt_tokens == 10
        assert response.usage.completion_tokens == 20
        assert response.usage.total_tokens == 30

        # Verify litellm was called with correct parameters
        mock_completion.assert_called_once()
        call_kwargs = mock_completion.call_args[1]
        assert call_kwargs["model"] == "claude-3-5-sonnet-20241022"
        assert call_kwargs["messages"] == [{"role": "user", "content": TEST_MESSAGE}]
        assert call_kwargs["temperature"] == 0.7
        assert call_kwargs["max_tokens"] == 100
        assert call_kwargs["api_key"] == "test-key"


@pytest.mark.asyncio
async def test_chat_with_api_base():
    config = chat_config_with_api_base()
    mock_response = mock_litellm_chat_response()

    with mock.patch("litellm.acompletion", return_value=mock_response) as mock_completion:
        provider = LiteLLMProvider(EndpointConfig(**config))
        payload = {"messages": [{"role": "user", "content": TEST_MESSAGE}]}
        await provider.chat(chat.RequestPayload(**payload))

        # Verify API base is passed
        call_kwargs = mock_completion.call_args[1]
        assert call_kwargs["api_base"] == "https://custom-api.example.com"


@pytest.mark.asyncio
async def test_chat_with_provider_prefix():
    config = chat_config_with_provider()
    mock_response = mock_litellm_chat_response()

    with mock.patch("litellm.acompletion", return_value=mock_response) as mock_completion:
        provider = LiteLLMProvider(EndpointConfig(**config))
        payload = {"messages": [{"role": "user", "content": TEST_MESSAGE}]}
        await provider.chat(chat.RequestPayload(**payload))

        # Verify model name includes provider prefix
        call_kwargs = mock_completion.call_args[1]
        assert call_kwargs["model"] == "anthropic/claude-3-5-sonnet-20241022"


@pytest.mark.asyncio
async def test_chat_stream():
    config = chat_config()

    # Create mock streaming chunks
    async def mock_stream():
        chunk1 = mock.MagicMock()
        chunk1.id = "chunk-1"
        chunk1.object = "chat.completion.chunk"
        chunk1.created = 1234567890
        chunk1.model = "claude-3-5-sonnet-20241022"
        choice1 = mock.MagicMock()
        choice1.index = 0
        choice1.delta = mock.MagicMock(spec=["role", "content"])
        choice1.delta.role = "assistant"
        choice1.delta.content = "Hello"
        choice1.finish_reason = None
        chunk1.choices = [choice1]
        yield chunk1

        chunk2 = mock.MagicMock()
        chunk2.id = "chunk-2"
        chunk2.object = "chat.completion.chunk"
        chunk2.created = 1234567890
        chunk2.model = "claude-3-5-sonnet-20241022"
        choice2 = mock.MagicMock()
        choice2.index = 0
        choice2.delta = mock.MagicMock(spec=["content"])
        choice2.delta.content = " world"
        choice2.finish_reason = "stop"
        chunk2.choices = [choice2]
        yield chunk2

    with mock.patch("litellm.acompletion", return_value=mock_stream()) as mock_completion:
        provider = LiteLLMProvider(EndpointConfig(**config))
        payload = {
            "messages": [{"role": "user", "content": "Hello"}],
            "stream": True,
        }

        chunks = [chunk async for chunk in provider.chat_stream(chat.RequestPayload(**payload))]

        assert len(chunks) == 2
        assert chunks[0].choices[0].delta.content == "Hello"
        assert chunks[1].choices[0].delta.content == " world"
        assert chunks[1].choices[0].finish_reason == "stop"

        # Verify stream parameter was set
        call_kwargs = mock_completion.call_args[1]
        assert call_kwargs["stream"] is True


@pytest.mark.asyncio
async def test_embeddings():
    config = embeddings_config()
    mock_response = mock_litellm_embeddings_response()

    with mock.patch("litellm.aembedding", return_value=mock_response) as mock_embedding:
        provider = LiteLLMProvider(EndpointConfig(**config))
        payload = {"input": "Hello world"}
        response = await provider.embeddings(embeddings.RequestPayload(**payload))

        assert response.model == "text-embedding-3-small"
        assert len(response.data) == 1
        assert response.data[0].embedding == [0.1, 0.2, 0.3]
        assert response.usage.prompt_tokens == 5
        assert response.usage.total_tokens == 5

        # Verify litellm was called with correct parameters
        mock_embedding.assert_called_once()
        call_kwargs = mock_embedding.call_args[1]
        assert call_kwargs["model"] == "text-embedding-3-small"
        assert call_kwargs["input"] == "Hello world"
        assert call_kwargs["api_key"] == "test-key"


@pytest.mark.asyncio
async def test_embeddings_batch():
    config = embeddings_config()

    # Create mock response for batch
    response = mock.MagicMock()
    response.model = "text-embedding-3-small"

    data1 = mock.MagicMock()
    data1.__getitem__ = lambda self, key: [0.1, 0.2, 0.3] if key == "embedding" else None
    data2 = mock.MagicMock()
    data2.__getitem__ = lambda self, key: [0.4, 0.5, 0.6] if key == "embedding" else None
    response.data = [data1, data2]

    response.usage = mock.MagicMock()
    response.usage.prompt_tokens = 10
    response.usage.total_tokens = 10

    with mock.patch("litellm.aembedding", return_value=response):
        provider = LiteLLMProvider(EndpointConfig(**config))
        payload = {"input": ["Hello", "World"]}
        response_payload = await provider.embeddings(embeddings.RequestPayload(**payload))

        assert len(response_payload.data) == 2
        assert response_payload.data[0].embedding == [0.1, 0.2, 0.3]
        assert response_payload.data[1].embedding == [0.4, 0.5, 0.6]


def test_adapter_chat_to_model():
    config = EndpointConfig(**chat_config())
    payload = {
        "messages": [{"role": "user", "content": TEST_MESSAGE}],
        "temperature": 0.7,
    }

    result = LiteLLMAdapter.chat_to_model(payload, config)

    assert result["model"] == "claude-3-5-sonnet-20241022"
    assert result["messages"] == [{"role": "user", "content": TEST_MESSAGE}]
    assert result["temperature"] == 0.7


def test_adapter_embeddings_to_model():
    config = EndpointConfig(**embeddings_config())
    payload = {"input": TEST_MESSAGE}

    result = LiteLLMAdapter.embeddings_to_model(payload, config)

    assert result["model"] == "text-embedding-3-small"
    assert result["input"] == TEST_MESSAGE


def test_adapter_chat_to_model_with_provider():
    config = EndpointConfig(**chat_config_with_provider())
    payload = {
        "messages": [{"role": "user", "content": TEST_MESSAGE}],
        "temperature": 0.7,
    }

    result = LiteLLMAdapter.chat_to_model(payload, config)

    assert result["model"] == "anthropic/claude-3-5-sonnet-20241022"
    assert result["messages"] == [{"role": "user", "content": TEST_MESSAGE}]
    assert result["temperature"] == 0.7


def test_adapter_model_to_chat():
    config = EndpointConfig(**chat_config())
    resp = {
        "id": "test-id",
        "object": "chat.completion",
        "created": 1234567890,
        "model": "test-model",
        "choices": [
            {
                "index": 0,
                "message": {"role": "assistant", "content": TEST_MESSAGE, "tool_calls": None},
                "finish_reason": "stop",
            }
        ],
        "usage": {"prompt_tokens": 10, "completion_tokens": 20, "total_tokens": 30},
    }

    result = LiteLLMAdapter.model_to_chat(resp, config)

    assert result.id == "test-id"
    assert result.model == "test-model"
    assert len(result.choices) == 1
    assert result.choices[0].message.content == TEST_MESSAGE
    assert result.usage.prompt_tokens == 10


def test_adapter_model_to_embeddings():
    config = EndpointConfig(**embeddings_config())
    resp = {
        "data": [{"embedding": [0.1, 0.2, 0.3], "index": 0}],
        "model": "test-model",
        "usage": {"prompt_tokens": 5, "total_tokens": 5},
    }

    result = LiteLLMAdapter.model_to_embeddings(resp, config)

    assert result.model == "test-model"
    assert len(result.data) == 1
    assert result.data[0].embedding == [0.1, 0.2, 0.3]
    assert result.data[0].index == 0
    assert result.usage.prompt_tokens == 5
```

--------------------------------------------------------------------------------

---[FILE: test_mistral.py]---
Location: mlflow-master/tests/gateway/providers/test_mistral.py
Signals: FastAPI, Pydantic

```python
import math
from unittest import mock

import pytest
from aiohttp import ClientTimeout
from fastapi.encoders import jsonable_encoder
from pydantic import ValidationError

from mlflow.gateway.config import EndpointConfig
from mlflow.gateway.constants import MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS
from mlflow.gateway.exceptions import AIGatewayException
from mlflow.gateway.providers.mistral import MistralProvider
from mlflow.gateway.schemas import completions, embeddings

from tests.gateway.tools import MockAsyncResponse

TEST_STRING = "This is a test"
CONTENT_TYPE = "application/json"
TARGET = "aiohttp.ClientSession.post"


def completions_config():
    return {
        "name": "completions",
        "endpoint_type": "llm/v1/completions",
        "model": {
            "provider": "mistral",
            "name": "mistral-tiny",
            "config": {
                "mistral_api_key": "key",
            },
        },
    }


def completions_response():
    return {
        "id": "string",
        "object": "string",
        "create": "integer",
        "model": "string",
        "choices": [
            {
                "index": "integer",
                "message": {"role": "user", "content": TEST_STRING},
                "finish_reason": "length",
            }
        ],
        "usage": {
            "prompt_tokens": 9,
            "completion_tokens": 9,
            "total_tokens": 18,
        },
    }


@pytest.mark.asyncio
async def test_completions():
    resp = completions_response()
    config = completions_config()
    with (
        mock.patch("time.time", return_value=1677858242),
        mock.patch(TARGET, return_value=MockAsyncResponse(resp)) as mock_post,
    ):
        provider = MistralProvider(EndpointConfig(**config))
        payload = {
            "prompt": TEST_STRING,
            "n": 1,
            "stop": ["foobar"],
        }
        response = await provider.completions(completions.RequestPayload(**payload))
        assert jsonable_encoder(response) == {
            "id": None,
            "object": "text_completion",
            "created": 1677858242,
            "model": "mistral-tiny",
            "choices": [
                {
                    "text": TEST_STRING,
                    "index": 0,
                    "finish_reason": "length",
                }
            ],
            "usage": {
                "prompt_tokens": 9,
                "completion_tokens": 9,
                "total_tokens": 18,
            },
        }
        mock_post.assert_called_once_with(
            "https://api.mistral.ai/v1/chat/completions",
            json={
                "messages": [{"role": "user", "content": TEST_STRING}],
                "model": "mistral-tiny",
                "temperature": 0.0,
            },
            timeout=ClientTimeout(total=MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS),
        )


@pytest.mark.asyncio
async def test_completions_temperature_is_scaled_correctly():
    resp = completions_response()
    config = completions_config()
    with mock.patch(TARGET, return_value=MockAsyncResponse(resp)) as mock_post:
        provider = MistralProvider(EndpointConfig(**config))
        payload = {
            "prompt": TEST_STRING,
            "temperature": 0.5,
        }
        await provider.completions(completions.RequestPayload(**payload))
        assert math.isclose(
            mock_post.call_args[1]["json"]["temperature"], 0.5 * 0.5, rel_tol=1e-09, abs_tol=1e-09
        )


def embeddings_config():
    return {
        "name": "embeddings",
        "endpoint_type": "llm/v1/embeddings",
        "model": {
            "provider": "mistral",
            "name": "mistral-embed",
            "config": {
                "mistral_api_key": "key",
            },
        },
    }


def embeddings_response():
    return {
        "id": "bc57846a-3e56-4327-8acc-588ca1a37b8a",
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
        "model": "mistral-embed",
        "usage": {"prompt_tokens": None, "total_tokens": None},
    }


def embeddings_batch_response():
    return {
        "id": "bc57846a-3e56-4327-8acc-588ca1a37b8a",
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
        "model": "mistral-embed",
        "usage": {"prompt_tokens": None, "total_tokens": None},
    }


@pytest.mark.asyncio
async def test_embeddings():
    resp = embeddings_response()
    config = embeddings_config()
    with mock.patch(TARGET, return_value=MockAsyncResponse(resp)) as mock_post:
        provider = MistralProvider(EndpointConfig(**config))
        payload = {"input": TEST_STRING}
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
            "model": "mistral-embed",
            "usage": {"prompt_tokens": None, "total_tokens": None},
        }
        mock_post.assert_called_once()


@pytest.mark.asyncio
async def test_batch_embeddings():
    resp = embeddings_batch_response()
    config = embeddings_config()
    with mock.patch(TARGET, return_value=MockAsyncResponse(resp)) as mock_post:
        provider = MistralProvider(EndpointConfig(**config))
        payload = {"input": ["This is a", "batch test"]}
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
            "model": "mistral-embed",
            "usage": {"prompt_tokens": None, "total_tokens": None},
        }
        mock_post.assert_called_once()


@pytest.mark.asyncio
async def test_param_model_is_not_permitted():
    config = embeddings_config()
    provider = MistralProvider(EndpointConfig(**config))
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
    provider = MistralProvider(EndpointConfig(**config))
    payload = {"prompt": prompt}
    with pytest.raises(ValidationError, match=r"prompt"):
        await provider.completions(completions.RequestPayload(**payload))
```

--------------------------------------------------------------------------------

---[FILE: test_mlflow.py]---
Location: mlflow-master/tests/gateway/providers/test_mlflow.py
Signals: FastAPI, Pydantic

```python
from unittest import mock

import pydantic
import pytest
from aiohttp import ClientTimeout
from fastapi.encoders import jsonable_encoder

from mlflow.gateway.config import EndpointConfig, MlflowModelServingConfig
from mlflow.gateway.constants import (
    MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS,
    MLFLOW_SERVING_RESPONSE_KEY,
)
from mlflow.gateway.exceptions import AIGatewayException
from mlflow.gateway.providers.mlflow import MlflowModelServingProvider
from mlflow.gateway.schemas import chat, completions, embeddings

from tests.gateway.tools import MockAsyncResponse, mock_http_client


def completions_config():
    return {
        "name": "completions",
        "endpoint_type": "llm/v1/completions",
        "model": {
            "provider": "mlflow-model-serving",
            "name": "text2text",
            "config": {
                "model_server_url": "http://127.0.0.1:5000",
            },
        },
    }


@pytest.mark.asyncio
async def test_completions():
    resp = {
        "predictions": ["This is a test!"],
        "headers": {"Content-Type": "application/json"},
    }
    config = completions_config()
    mock_client = mock_http_client(MockAsyncResponse(resp))

    with (
        mock.patch("time.time", return_value=1677858242),
        mock.patch("aiohttp.ClientSession", return_value=mock_client) as mock_build_client,
    ):
        provider = MlflowModelServingProvider(EndpointConfig(**config))
        payload = {
            "prompt": "Is this a test?",
            "temperature": 0.0,
        }
        response = await provider.completions(completions.RequestPayload(**payload))
        assert jsonable_encoder(response) == {
            "id": None,
            "object": "text_completion",
            "created": 1677858242,
            "model": "text2text",
            "choices": [
                {
                    "text": "This is a test!",
                    "index": 0,
                    "finish_reason": None,
                }
            ],
            "usage": {"prompt_tokens": None, "completion_tokens": None, "total_tokens": None},
        }
        mock_build_client.assert_called_once()
        mock_client.post.assert_called_once_with(
            "http://127.0.0.1:5000/invocations",
            json={
                "inputs": ["Is this a test?"],
                "params": {
                    "temperature": 0.0,
                    "n": 1,
                },
            },
            timeout=ClientTimeout(total=MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS),
        )


@pytest.mark.parametrize(
    ("input_data", "expected_output"),
    [
        (
            {"predictions": ["string1", "string2"]},
            [
                completions.Choice(index=0, text="string1", finish_reason=None),
                completions.Choice(index=1, text="string2", finish_reason=None),
            ],
        ),
        (
            {"predictions": {"choices": ["string1", "string2"]}},
            [
                completions.Choice(index=0, text="string1", finish_reason=None),
                completions.Choice(index=1, text="string2", finish_reason=None),
            ],
        ),
        (
            {"predictions": {"choices": ["string1", "string2"], "ignored": ["a", "b"]}},
            [
                completions.Choice(index=0, text="string1", finish_reason=None),
                completions.Choice(index=1, text="string2", finish_reason=None),
            ],
        ),
        (
            {"predictions": {"arbitrary_key": ["string1", "string2", "string3"]}},
            [
                completions.Choice(index=0, text="string1", finish_reason=None),
                completions.Choice(index=1, text="string2", finish_reason=None),
                completions.Choice(index=2, text="string3", finish_reason=None),
            ],
        ),
    ],
)
def test_valid_completions_input_parsing(input_data, expected_output):
    config = completions_config()
    provider = MlflowModelServingProvider(EndpointConfig(**config))
    parsed = provider._process_completions_response_for_mlflow_serving(input_data)

    assert parsed == expected_output


@pytest.mark.parametrize(
    "invalid_data",
    [
        {"predictions": [1, 2, 3]},  # List of integers
        {"predictions": {"choices": [1, 2, 3]}},  # Dict with list of integers
        {"predictions": {"arbitrary_key": [1, 2, 3]}},  # Dict with list of integers
        {"predictions": {"key1": ["string1"], "key2": ["string2"]}},  # Multiple keys in dict
        {"predictions": []},  # Empty list
        {"predictions": {"choices": []}},  # Dict with empty list
    ],
)
def test_validation_errors(invalid_data):
    config = completions_config()
    provider = MlflowModelServingProvider(EndpointConfig(**config))
    with pytest.raises(AIGatewayException, match=r".*") as e:
        provider._process_completions_response_for_mlflow_serving(invalid_data)
    assert e.value.status_code == 502
    assert "ServingTextResponse\npredictions" in e.value.detail


def test_invalid_return_key_from_mlflow_serving():
    config = completions_config()
    provider = MlflowModelServingProvider(EndpointConfig(**config))
    with pytest.raises(AIGatewayException, match=r".*") as e:
        provider._process_completions_response_for_mlflow_serving(
            {"invalid_return_key": ["invalid", "response"]}
        )

    assert "1 validation error for ServingTextResponse\npredictions" in e.value.detail
    assert e.value.status_code == 502


def embedding_config():
    return {
        "name": "embeddings",
        "endpoint_type": "llm/v1/embeddings",
        "model": {
            "provider": "mlflow-model-serving",
            "name": "sentence-piece",
            "config": {
                "model_server_url": "http://127.0.0.1:2000",
            },
        },
    }


@pytest.mark.asyncio
async def test_embeddings():
    resp = {
        "predictions": [[0.01, -0.1], [0.03, -0.03]],
        "headers": {"Content-Type": "application/json"},
    }
    config = embedding_config()
    mock_client = mock_http_client(MockAsyncResponse(resp))

    with mock.patch("aiohttp.ClientSession", return_value=mock_client) as mock_build_client:
        provider = MlflowModelServingProvider(EndpointConfig(**config))
        payload = {"input": ["test1", "test2"]}
        response = await provider.embeddings(embeddings.RequestPayload(**payload))
        assert jsonable_encoder(response) == {
            "object": "list",
            "data": [
                {
                    "object": "embedding",
                    "embedding": [
                        0.01,
                        -0.1,
                    ],
                    "index": 0,
                },
                {
                    "object": "embedding",
                    "embedding": [
                        0.03,
                        -0.03,
                    ],
                    "index": 1,
                },
            ],
            "model": "sentence-piece",
            "usage": {"prompt_tokens": None, "total_tokens": None},
        }
        mock_build_client.assert_called_once()
        mock_client.post.assert_called_once_with(
            "http://127.0.0.1:2000/invocations",
            json={"inputs": ["test1", "test2"]},
            timeout=ClientTimeout(total=MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS),
        )


@pytest.mark.parametrize(
    "response",
    [
        {MLFLOW_SERVING_RESPONSE_KEY: "string_value"},
        {MLFLOW_SERVING_RESPONSE_KEY: ["string", "values"]},
        {MLFLOW_SERVING_RESPONSE_KEY: [[1.0, 2.3], ["string", "values"]]},
        {MLFLOW_SERVING_RESPONSE_KEY: [[1.0, 2.3], [1.2, "string"]]},
        {MLFLOW_SERVING_RESPONSE_KEY: [[], []]},
        {MLFLOW_SERVING_RESPONSE_KEY: []},
    ],
)
def test_invalid_embeddings_response(response):
    config = embedding_config()
    provider = MlflowModelServingProvider(EndpointConfig(**config))
    with pytest.raises(AIGatewayException, match=r".*") as e:
        provider._process_embeddings_response_for_mlflow_serving(response)

    assert "EmbeddingsResponse\npredictions" in e.value.detail
    assert e.value.status_code == 502


def chat_config():
    return {
        "name": "chat",
        "endpoint_type": "llm/v1/chat",
        "model": {
            "provider": "mlflow-model-serving",
            "name": "chat-bot-9000",
            "config": {
                "model_server_url": "http://127.0.0.1:4000",
            },
        },
    }


@pytest.mark.asyncio
async def test_chat():
    resp = {
        "predictions": ["It is a test"],
        "headers": {"Content-Type": "application/json"},
    }
    config = chat_config()
    mock_client = mock_http_client(MockAsyncResponse(resp))

    with (
        mock.patch("time.time", return_value=1700242674),
        mock.patch("aiohttp.ClientSession", return_value=mock_client) as mock_build_client,
    ):
        provider = MlflowModelServingProvider(EndpointConfig(**config))
        payload = {"messages": [{"role": "user", "content": "Is this a test?"}]}
        response = await provider.chat(chat.RequestPayload(**payload))
        assert jsonable_encoder(response) == {
            "id": None,
            "created": 1700242674,
            "object": "chat.completion",
            "model": "chat-bot-9000",
            "choices": [
                {
                    "message": {
                        "role": "assistant",
                        "content": "It is a test",
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
        mock_build_client.assert_called_once()
        mock_client.post.assert_called_once_with(
            "http://127.0.0.1:4000/invocations",
            json={
                "inputs": ["Is this a test?"],
                "params": {"temperature": 0.0, "n": 1},
            },
            timeout=ClientTimeout(total=MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS),
        )


@pytest.mark.asyncio
async def test_chat_exception_raised_for_multiple_elements_in_query():
    resp = {"predictions": "It is a test"}
    config = chat_config()
    mock_client = mock_http_client(MockAsyncResponse(resp))

    with mock.patch("aiohttp.ClientSession", return_value=mock_client):
        provider = MlflowModelServingProvider(EndpointConfig(**config))
        payload = {
            "messages": [
                {"role": "user", "content": "Is this a test?"},
                {"role": "user", "content": "This is a second message."},
            ]
        }

        with pytest.raises(AIGatewayException, match=r".*") as e:
            await provider.chat(chat.RequestPayload(**payload))
        assert "MLflow chat models are only capable of processing" in e.value.detail


def test_route_construction_fails_with_invalid_config():
    with pytest.raises(pydantic.ValidationError, match="model_server_url"):
        MlflowModelServingConfig(model_server_url=None)
```

--------------------------------------------------------------------------------

````
