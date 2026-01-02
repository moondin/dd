---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 266
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 266 of 991)

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

---[FILE: togetherai.py]---
Location: mlflow-master/mlflow/gateway/providers/togetherai.py
Signals: FastAPI

```python
import json
from typing import Any, AsyncGenerator, AsyncIterable

from mlflow.exceptions import MlflowException
from mlflow.gateway.config import EndpointConfig, TogetherAIConfig
from mlflow.gateway.exceptions import AIGatewayException
from mlflow.gateway.providers.base import BaseProvider, ProviderAdapter
from mlflow.gateway.providers.utils import rename_payload_keys, send_request, send_stream_request
from mlflow.gateway.schemas import chat as chat_schema
from mlflow.gateway.schemas import completions as completions_schema
from mlflow.gateway.schemas import embeddings as embeddings_schema
from mlflow.gateway.utils import strip_sse_prefix


class TogetherAIAdapter(ProviderAdapter):
    @classmethod
    def model_to_embeddings(cls, resp, config):
        # Response example: (https://docs.together.ai/docs/embeddings-rest)
        # ```
        # {
        #  "object": "list",
        #  "data": [
        #    {
        #      "object": "embedding",
        #      "embedding": [
        #        0.44990748,
        #        -0.2521129,
        #        ...
        #        -0.43091708,
        #        0.214978
        #      ],
        #      "index": 0
        #    }
        #  ],
        #  "model": "togethercomputer/m2-bert-80M-8k-retrieval",
        #  "request_id": "840fc1b5bb2830cb-SEA"
        # }
        # ```
        return embeddings_schema.ResponsePayload(
            data=[
                embeddings_schema.EmbeddingObject(
                    embedding=item["embedding"],
                    index=item["index"],
                )
                for item in resp["data"]
            ],
            model=config.model.name,
            usage=embeddings_schema.EmbeddingsUsage(prompt_tokens=None, total_tokens=None),
        )

    @classmethod
    def model_to_completions(cls, resp, config):
        # Example response (https://docs.together.ai/reference/completions):
        # {
        #  "id": "8447f286bbdb67b3-SJC",
        #  "choices": [
        #    {
        #      "text": "Example text."
        #    }
        #  ],
        #  "usage": {
        #    "prompt_tokens": 16,
        #    "completion_tokens": 78,
        #    "total_tokens": 94
        #  },
        #  "created": 1705089226,
        #  "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
        #  "object": "text_completion"
        # }

        return completions_schema.ResponsePayload(
            id=resp["id"],
            created=resp["created"],
            model=config.model.name,
            choices=[
                completions_schema.Choice(
                    index=idx,
                    text=c["text"],
                    finish_reason=None,
                )
                for idx, c in enumerate(resp["choices"])
            ],
            usage=completions_schema.CompletionsUsage(
                prompt_tokens=resp["usage"]["prompt_tokens"],
                completion_tokens=resp["usage"]["completion_tokens"],
                total_tokens=resp["usage"]["total_tokens"],
            ),
        )

    @classmethod
    def model_to_completions_streaming(cls, resp, config):
        # Response example (after manually calling API):
        #
        # {'id': '86d8d6e06df86f61-ATH', 'object': 'completion.chunk',
        # 'created': 1711977238, 'choices': [{'index': 0, 'text': '   ',
        # 'logprobs': None, 'finish_reason': None, 'delta': {'token_id': 2287, 'content': '   '}}],
        # 'model': 'mistralai/Mixtral-8x7B-v0.1', 'usage': None}
        #
        # {'id': '86d8d6e06df86f61-ATH', 'object': 'completion.chunk',
        # 'created': 1711977238, 'choices': [{'index': 0, 'text': ' "', 'logprobs': None,
        # 'finish_reason': None, 'delta': {'token_id': 345, 'content': ' "'}}],
        # 'model': 'mistralai/Mixtral-8x7B-v0.1', 'usage': None}
        #
        # "{'id': '86d8d6e06df86f61-ATH', 'object': 'completion.chunk',
        # 'created': 1711977238, 'choices': [{'index': 0, 'text': 'name', 'logprobs': None,
        # 'finish_reason': None, 'delta': {'token_id': 861, 'content': 'name'}}],
        # 'model': 'mistralai/Mixtral-8x7B-v0.1', 'usage': None}
        #
        # LAST CHUNK
        # {'id': '86d8d6e06df86f61-ATH', 'object': 'completion.chunk',
        # 'created': 1711977238, 'choices': [{'index': 0, 'text': '":', 'logprobs': None,
        # 'finish_reason': 'length', 'delta': {'token_id': 1264, 'content': '":'}}],
        # 'model': 'mistralai/Mixtral-8x7B-v0.1',
        # 'usage': {'prompt_tokens': 17, 'completion_tokens': 200, 'total_tokens': 217}}
        # ":[DONE]

        return completions_schema.StreamResponsePayload(
            id=resp.get("id"),
            created=resp.get("created"),
            model=config.model.name,
            choices=[
                completions_schema.StreamChoice(
                    index=idx,
                    # TODO this is questionable since the finish reason comes from togetherai api
                    finish_reason=choice.get("finish_reason"),
                    text=choice.get("text"),
                )
                for idx, choice in enumerate(resp.get("choices", []))
            ],
            # usage is not included in OpenAI StreamResponsePayload
        )

    @classmethod
    def completions_to_model(cls, payload, config):
        key_mapping = {
            # TogetherAI uses logprobs
            # OpenAI uses top_logprobs
            "top_logprobs": "logprobs"
        }

        # in openAI API the logprobs parameter
        # is a boolean flag.
        # Insert this here to prevent the user from mixing up the APIs
        logprobs_in_payload_condition = "logprobs" in payload and not isinstance(
            payload["logprobs"], int
        )

        if logprobs_in_payload_condition:
            raise AIGatewayException(
                status_code=422,
                detail="Wrong type for logprobs. It should be an 32bit integer.",
            )

        openai_top_logprobs_in_payload_condition = "top_logprobs" in payload and not isinstance(
            payload["top_logprobs"], int
        )

        if openai_top_logprobs_in_payload_condition:
            raise AIGatewayException(
                status_code=422,
                detail="Wrong type for top_logprobs. It should a 32bit integer.",
            )

        payload = rename_payload_keys(payload, key_mapping)
        return {"model": config.model.name, **payload}

    @classmethod
    def completions_streaming_to_model(cls, payload, config):
        # parameters for streaming completions are the same as the standard completions
        return TogetherAIAdapter.completions_to_model(payload, config)

    @classmethod
    def model_to_chat(cls, resp, config):
        # Example response (https://docs.together.ai/reference/chat-completions):
        # {
        #   "id": "8448080b880415ea-SJC",
        #   "choices": [
        #    {
        #        "message": {
        #           "role": "assistant",
        #           "content": "example"
        #         }
        #     }
        #   ],
        #   "usage": {
        #     "prompt_tokens": 31,
        #     "completion_tokens": 455,
        #     "total_tokens": 486
        #   },
        #   "created": 1705090115,
        #   "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
        #   "object": "chat.completion"
        # }
        return chat_schema.ResponsePayload(
            id=resp["id"],
            object="chat.completion",
            created=resp["created"],
            model=config.model.name,
            choices=[
                chat_schema.Choice(
                    index=idx,
                    message=chat_schema.ResponseMessage(
                        role="assistant",
                        content=c["message"]["content"],
                    ),
                    finish_reason=None,
                )
                for idx, c in enumerate(resp["choices"])
            ],
            usage=chat_schema.ChatUsage(
                prompt_tokens=resp["usage"]["prompt_tokens"],
                completion_tokens=resp["usage"]["completion_tokens"],
                total_tokens=resp["usage"]["total_tokens"],
            ),
        )

    @classmethod
    def model_to_chat_streaming(cls, resp, config):
        # Response example (after running API manually):
        #
        # {'id': '86f2cfd18f6b38ca-ATH', 'object': 'chat.completion.chunk',
        # 'created': 1712249578, 'choices': [{'index': 0, 'text': ' The', 'logprobs': None,
        # 'finish_reason': None, 'delta': {'token_id': 415, 'content': ' The'}}],
        # 'model': 'mistralai/Mixtral-8x7B-v0.1', 'usage': None}
        #
        # {'id': '86f2cfd18f6b38ca-ATH', 'object': 'chat.completion.chunk',
        # 'created': 1712249578, 'choices': [{'index': 0, 'text': ' City', 'logprobs': None,
        # 'finish_reason': None, 'delta': {'token_id': 3805, 'content': ' City'}}],
        # 'model': 'mistralai/Mixtral-8x7B-v0.1', 'usage': None}
        #
        # {'id': '86f2cfd18f6b38ca-ATH', 'object': 'chat.completion.chunk',
        # 'created': 1712249578, 'choices': [{'index': 0, 'text': ' of', 'logprobs': None,
        # 'finish_reason': None, 'delta': {'token_id': 302, 'content': ' of'}}],
        # 'model': 'mistralai/Mixtral-8x7B-v0.1', 'usage': None}
        #
        # LAST CHUNK
        # {'id': '86f2cfd18f6b38ca-ATH', 'object': 'chat.completion.chunk',
        # 'created': 1712249578, 'choices': [{'index': 0, 'text': ' Paris', 'logprobs': None,
        # 'finish_reason': 'length', 'delta': {'token_id': 5465, 'content': ' Paris'}}],
        # 'model': 'mistralai/Mixtral-8x7B-v0.1',
        # 'usage': {'prompt_tokens': 93, 'completion_tokens': 100, 'total_tokens': 193}}

        return chat_schema.StreamResponsePayload(
            id=resp["id"],
            model=config.model.name,
            object="chat.completion.chunk",
            created=resp["created"],
            choices=[
                chat_schema.StreamChoice(
                    index=idx,
                    finish_reason=choice.get("finish_reason"),
                    delta=chat_schema.StreamDelta(
                        role=None,
                        content=choice.get("text"),
                    ),
                )
                # Added enumerate and a default empty list
                for idx, choice in enumerate(resp.get("choices", []))
            ],
            usage=resp.get("usage"),
        )

    @classmethod
    def chat_to_model(cls, payload, config):
        # completions and chat endpoint contain the same parameters
        return TogetherAIAdapter.completions_to_model(payload, config)

    @classmethod
    def chat_streaming_to_model(cls, payload, config):
        # streaming and standard chat contain the same parameters
        return TogetherAIAdapter.chat_to_model(payload, config)

    @classmethod
    def embeddings_to_model(cls, payload, config):
        # Example request (https://docs.together.ai/reference/embeddings):
        # curl --request POST \
        #   --url https://api.together.xyz/v1/embeddings \
        #   --header 'accept: application/json' \
        #   --header 'content-type: application/json' \
        #   --data '
        #   {
        #     "model": "togethercomputer/m2-bert-80M-8k-retrieval",
        #     "input": "Our solar system orbits the Milky Way galaxy at about 515,000 mph"
        #   }

        # This is just to keep the interface consistent the adapter
        # class is not needed here as the togetherai request similar
        # to the openAI one.

        return payload


class TogetherAIProvider(BaseProvider):
    NAME = "TogetherAI"
    CONFIG_TYPE = TogetherAIConfig

    def __init__(self, config: EndpointConfig) -> None:
        super().__init__(config)
        if config.model.config is None or not isinstance(config.model.config, TogetherAIConfig):
            # Should be unreachable
            raise MlflowException.invalid_parameter_value(
                f"Invalid config type {config.model.config}"
            )
        self.togetherai_config: TogetherAIConfig = config.model.config

    @property
    def base_url(self):
        # togetherai seems to support only this url
        return "https://api.together.xyz/v1"

    @property
    def headers(self):
        return {"Authorization": f"Bearer {self.togetherai_config.togetherai_api_key}"}

    @property
    def adapter_class(self) -> type[ProviderAdapter]:
        return TogetherAIAdapter

    def get_endpoint_url(self, route_type: str) -> str:
        if route_type == "llm/v1/chat":
            return f"{self.base_url}/chat/completions"
        elif route_type == "llm/v1/completions":
            return f"{self.base_url}/completions"
        elif route_type == "llm/v1/embeddings":
            return f"{self.base_url}/embeddings"
        else:
            raise ValueError(f"Invalid route type {route_type}")

    async def _request(self, path: str, payload: dict[str, Any]) -> dict[str, Any]:
        return await send_request(
            headers=self.headers,
            base_url=self.base_url,
            path=path,
            payload=payload,
        )

    async def _stream_request(
        self, path: str, payload: dict[str, Any]
    ) -> AsyncGenerator[bytes, None]:
        return send_stream_request(
            headers=self.headers,
            base_url=self.base_url,
            path=path,
            payload=payload,
        )

    async def embeddings(
        self, payload: embeddings_schema.RequestPayload
    ) -> embeddings_schema.ResponsePayload:
        from fastapi.encoders import jsonable_encoder

        payload = jsonable_encoder(payload, exclude_none=True)

        resp = await self._request(
            path="embeddings",
            payload=TogetherAIAdapter.embeddings_to_model(payload, self.config),
        )

        return TogetherAIAdapter.model_to_embeddings(resp, self.config)

    async def completions_stream(
        self, payload: completions_schema.RequestPayload
    ) -> AsyncIterable[completions_schema.StreamResponsePayload]:
        from fastapi.encoders import jsonable_encoder

        payload = jsonable_encoder(payload, exclude_none=True)

        if not payload.get("max_tokens"):
            raise AIGatewayException(
                status_code=422,
                detail=(
                    "max_tokens is not present in payload."
                    "It is a required parameter for TogetherAI completions."
                ),
            )

        stream = await self._stream_request(
            path="completions",
            payload=TogetherAIAdapter.completions_streaming_to_model(payload, self.config),
        )

        async for chunk in stream:
            chunk = chunk.strip()
            if not chunk:
                continue

            chunk = strip_sse_prefix(chunk.decode("utf-8"))
            if chunk == "[DONE]":
                return

            resp = json.loads(chunk)
            yield TogetherAIAdapter.model_to_completions_streaming(resp, self.config)

    async def completions(
        self, payload: completions_schema.RequestPayload
    ) -> completions_schema.ResponsePayload:
        from fastapi.encoders import jsonable_encoder

        payload = jsonable_encoder(payload, exclude_none=True)

        if not payload.get("max_tokens"):
            raise AIGatewayException(
                status_code=422,
                detail=(
                    "max_tokens is not present in payload."
                    "It is a required parameter for TogetherAI completions."
                ),
            )

        resp = await self._request(
            path="completions", payload=TogetherAIAdapter.completions_to_model(payload, self.config)
        )

        return TogetherAIAdapter.model_to_completions(resp, self.config)

    async def chat_stream(self, payload: chat_schema.RequestPayload) -> chat_schema.ResponsePayload:
        from fastapi.encoders import jsonable_encoder

        payload = jsonable_encoder(payload, exclude_none=True)

        stream = await self._stream_request(
            path="chat/completions",
            payload=TogetherAIAdapter.chat_streaming_to_model(payload, self.config),
        )

        async for chunk in stream:
            chunk = chunk.strip()
            if not chunk:
                continue

            chunk = strip_sse_prefix(chunk.decode("utf-8"))
            if chunk == "[DONE]":
                return

            resp = json.loads(chunk)
            yield TogetherAIAdapter.model_to_chat_streaming(resp, self.config)

    async def chat(self, payload: chat_schema.RequestPayload) -> chat_schema.ResponsePayload:
        from fastapi.encoders import jsonable_encoder

        payload = jsonable_encoder(payload, exclude_none=True)

        resp = await self._request(
            path="chat/completions",
            payload=TogetherAIAdapter.chat_to_model(payload, self.config),
        )

        return TogetherAIAdapter.model_to_chat(resp, self.config)
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/mlflow/gateway/providers/utils.py
Signals: FastAPI

```python
from contextlib import asynccontextmanager
from typing import Any, AsyncGenerator

from mlflow.gateway.constants import (
    MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS,
)
from mlflow.utils.uri import append_to_uri_path


@asynccontextmanager
async def _aiohttp_post(headers: dict[str, str], base_url: str, path: str, payload: dict[str, Any]):
    import aiohttp

    async with aiohttp.ClientSession(headers=headers) as session:
        url = append_to_uri_path(base_url, path)
        timeout = aiohttp.ClientTimeout(total=MLFLOW_GATEWAY_ROUTE_TIMEOUT_SECONDS)
        async with session.post(url, json=payload, timeout=timeout) as response:
            yield response


async def send_request(headers: dict[str, str], base_url: str, path: str, payload: dict[str, Any]):
    """
    Send an HTTP request to a specific URL path with given headers and payload.

    Args:
        headers: The headers to include in the request.
        base_url: The base URL where the request will be sent.
        path: The specific path of the URL to which the request will be sent.
        payload: The payload (or data) to be included in the request.

    Returns:
        The server's response as a JSON object.

    Raises:
        HTTPException if the HTTP request fails.
    """
    import aiohttp
    from fastapi import HTTPException

    async with _aiohttp_post(headers, base_url, path, payload) as response:
        content_type = response.headers.get("Content-Type")
        if content_type and "application/json" in content_type:
            js = await response.json()
        elif content_type and "text/plain" in content_type:
            js = {"message": await response.text()}
        else:
            raise HTTPException(
                status_code=502,
                detail=f"The returned data type from the route service is not supported. "
                f"Received content type: {content_type}",
            )
        try:
            response.raise_for_status()
        except aiohttp.ClientResponseError as e:
            detail = js.get("error", {}).get("message", e.message) if "error" in js else js
            raise HTTPException(status_code=e.status, detail=detail)
        return js


async def send_stream_request(
    headers: dict[str, str], base_url: str, path: str, payload: dict[str, Any]
) -> AsyncGenerator[bytes, None]:
    """
    Send an HTTP request to a specific URL path with given headers and payload.

    Args:
        headers: The headers to include in the request.
        base_url: The base URL where the request will be sent.
        path: The specific path of the URL to which the request will be sent.
        payload: The payload (or data) to be included in the request.

    Returns:
        The server's response as a JSON object.

    Raises:
        HTTPException if the HTTP request fails.
    """
    async with _aiohttp_post(headers, base_url, path, payload) as response:
        async for line in response.content:
            yield line


def rename_payload_keys(payload: dict[str, Any], mapping: dict[str, str]) -> dict[str, Any]:
    """Rename payload keys based on the specified mapping. If a key is not present in the
    mapping, the key and its value will remain unchanged.

    Args:
        payload: The original dictionary to transform.
        mapping: A dictionary where each key-value pair represents a mapping from the old
            key to the new key.

    Returns:
        A new dictionary containing the transformed keys.

    """
    return {mapping.get(k, k): v for k, v in payload.items()}
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/gateway/providers/__init__.py

```python
from mlflow.gateway.config import Provider
from mlflow.gateway.providers.base import BaseProvider


def get_provider(provider: Provider) -> type[BaseProvider]:
    from mlflow.gateway.provider_registry import provider_registry

    return provider_registry.get(provider)
```

--------------------------------------------------------------------------------

---[FILE: chat.py]---
Location: mlflow-master/mlflow/gateway/schemas/chat.py
Signals: Pydantic

```python
"""
This module defines the schemas for the MLflow AI Gateway's chat endpoint.

The schemas must be compatible with OpenAI's Chat Completion API.
https://platform.openai.com/docs/api-reference/chat

NB: These Pydantic models just alias the models defined in mlflow.types.chat to avoid code
    duplication, but with the addition of RequestModel and ResponseModel base classes.
"""

from typing import Literal

from pydantic import ConfigDict, Field

from mlflow.gateway.base_models import RequestModel, ResponseModel

# Import marked with noqa is for backward compatibility
from mlflow.types.chat import (
    ChatChoice,
    ChatChoiceDelta,
    ChatChunkChoice,
    ChatCompletionChunk,
    ChatCompletionRequest,
    ChatCompletionResponse,
    ChatMessage,
    ChatUsage,  # noqa F401
    Function,  # noqa F401
    FunctionToolDefinition,
    ToolCall,  # noqa F401
    ToolCallDelta,  # noqa F401
)

# NB: `import x as y` does not work and will cause a Pydantic error.
StreamDelta = ChatChoiceDelta
StreamChoice = ChatChunkChoice
RequestMessage = ChatMessage


class UnityCatalogFunctionToolDefinition(RequestModel):
    name: str


class ChatToolWithUC(RequestModel):
    """
    A tool definition for the chat endpoint with Unity Catalog integration.
    The Gateway request accepts a special tool type 'uc_function' for Unity Catalog integration.
    https://mlflow.org/docs/latest/llms/deployments/uc_integration.html
    """

    type: Literal["function", "uc_function"]
    function: FunctionToolDefinition | None = None
    uc_function: UnityCatalogFunctionToolDefinition | None = None


_REQUEST_PAYLOAD_EXTRA_SCHEMA = {
    "messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"},
    ],
    "temperature": 0.0,
    "max_tokens": 64,
    "stop": ["END"],
    "n": 1,
    "stream": False,
}


class RequestPayload(ChatCompletionRequest, RequestModel):
    messages: list[RequestMessage] = Field(..., min_length=1)
    tools: list[ChatToolWithUC] | None = None

    model_config = ConfigDict(json_schema_extra=_REQUEST_PAYLOAD_EXTRA_SCHEMA)


_RESPONSE_PAYLOAD_EXTRA_SCHEMA = {
    "example": {
        "id": "3cdb958c-e4cc-4834-b52b-1d1a7f324714",
        "object": "chat.completion",
        "created": 1700173217,
        "model": "llama-2-70b-chat-hf",
        "choices": [
            {
                "index": 0,
                "message": {"role": "assistant", "content": "Hello! I am an AI assistant"},
                "finish_reason": "stop",
            }
        ],
        "usage": {"prompt_tokens": 10, "completion_tokens": 8, "total_tokens": 18},
    }
}


class ResponseMessage(ChatMessage, ResponseModel):
    # Override the `tool_call_id` field to be excluded from the response.
    # This is a band-aid solution to avoid exposing the tool_call_id in the response,
    # while we use the same ChatMessage model for both request and response.
    tool_call_id: str | None = Field(None, exclude=True)


class Choice(ChatChoice, ResponseModel):
    # Override the `message` field to use the ResponseMessage model.
    message: ResponseMessage


class ResponsePayload(ChatCompletionResponse, ResponseModel):
    # Override the `choices` field to use the Choice model
    choices: list[Choice]

    model_config = ConfigDict(json_schema_extra=_RESPONSE_PAYLOAD_EXTRA_SCHEMA)


_STREAM_RESPONSE_PAYLOAD_EXTRA_SCHEMA = {
    "example": {
        "id": "3cdb958c-e4cc-4834-b52b-1d1a7f324714",
        "object": "chat.completion",
        "created": 1700173217,
        "model": "llama-2-70b-chat-hf",
        "choices": [
            {
                "index": 6,
                "finish_reason": "stop",
                "delta": {"role": "assistant", "content": "you?"},
            }
        ],
    }
}


class StreamResponsePayload(ChatCompletionChunk, ResponseModel):
    model_config = ConfigDict(json_schema_extra=_STREAM_RESPONSE_PAYLOAD_EXTRA_SCHEMA)
```

--------------------------------------------------------------------------------

---[FILE: completions.py]---
Location: mlflow-master/mlflow/gateway/schemas/completions.py
Signals: Pydantic

```python
from pydantic import ConfigDict

from mlflow.gateway.base_models import RequestModel, ResponseModel
from mlflow.types.chat import BaseRequestPayload

_REQUEST_PAYLOAD_EXTRA_SCHEMA = {
    "example": {
        "prompt": "hello",
        "temperature": 0.0,
        "max_tokens": 64,
        "stop": ["END"],
        "n": 1,
    }
}


class RequestPayload(BaseRequestPayload, RequestModel):
    prompt: str
    model: str | None = None

    model_config = ConfigDict(json_schema_extra=_REQUEST_PAYLOAD_EXTRA_SCHEMA)


class Choice(ResponseModel):
    index: int
    text: str
    finish_reason: str | None = None


class CompletionsUsage(ResponseModel):
    prompt_tokens: int | None = None
    completion_tokens: int | None = None
    total_tokens: int | None = None


_RESPONSE_PAYLOAD_EXTRA_SCHEMA = {
    "example": {
        "id": "cmpl-123",
        "object": "text_completion",
        "created": 1589478378,
        "model": "gpt-4",
        "choices": [
            {"text": "Hello! I am an AI Assistant!", "index": 0, "finish_reason": "length"}
        ],
        "usage": {"prompt_tokens": 5, "completion_tokens": 7, "total_tokens": 12},
    }
}


class ResponsePayload(ResponseModel):
    id: str | None = None
    object: str = "text_completion"
    created: int
    model: str
    choices: list[Choice]
    usage: CompletionsUsage

    model_config = ConfigDict(json_schema_extra=_RESPONSE_PAYLOAD_EXTRA_SCHEMA)


class StreamDelta(ResponseModel):
    role: str | None = None
    content: str | None = None


class StreamChoice(ResponseModel):
    index: int
    finish_reason: str | None = None
    text: str | None = None


_STREAM_RESPONSE_PAYLOAD_EXTRA_SCHEMA = {
    "example": {
        "id": "cmpl-123",
        "object": "text_completion",
        "created": 1589478378,
        "model": "gpt-4",
        "choices": [
            {
                "index": 6,
                "finish_reason": "stop",
                "delta": {"role": "assistant", "content": "you?"},
            }
        ],
    }
}


class StreamResponsePayload(ResponseModel):
    id: str | None = None
    object: str = "text_completion_chunk"
    created: int
    model: str
    choices: list[StreamChoice]

    model_config = ConfigDict(json_schema_extra=_STREAM_RESPONSE_PAYLOAD_EXTRA_SCHEMA)
```

--------------------------------------------------------------------------------

---[FILE: embeddings.py]---
Location: mlflow-master/mlflow/gateway/schemas/embeddings.py
Signals: Pydantic

```python
from pydantic import ConfigDict

from mlflow.gateway.base_models import RequestModel, ResponseModel

_REQUEST_PAYLOAD_EXTRA_SCHEMA = {
    "example": {
        "input": ["hello", "world"],
    }
}


class RequestPayload(RequestModel):
    input: str | list[str] | list[int] | list[list[int]]

    model_config = ConfigDict(json_schema_extra=_REQUEST_PAYLOAD_EXTRA_SCHEMA)


class EmbeddingObject(ResponseModel):
    object: str = "embedding"
    embedding: list[float] | str
    index: int


class EmbeddingsUsage(ResponseModel):
    prompt_tokens: int | None = None
    total_tokens: int | None = None


_RESPONSE_PAYLOAD_EXTRA_SCHEMA = {
    "object": "list",
    "data": [
        {
            "object": "embedding",
            "index": 0,
            "embedding": [
                0.017291732,
                -0.017291732,
                0.014577783,
                -0.02902633,
                -0.037271563,
                0.019333655,
                -0.023055641,
                -0.007359971,
                -0.015818445,
                -0.030654699,
                0.008348623,
                0.018312693,
                -0.017149571,
                -0.0044424757,
                -0.011165961,
                0.01018377,
            ],
        },
        {
            "object": "embedding",
            "index": 1,
            "embedding": [
                0.0060126893,
                -0.008691099,
                -0.0040095365,
                0.019889368,
                0.036211833,
                -0.0013270887,
                0.013401738,
                -0.0036735237,
                -0.0049594184,
                0.035229642,
                -0.03435084,
                0.019798903,
                -0.0006110424,
                0.0073793563,
                0.005657291,
                0.022487005,
            ],
        },
    ],
    "model": "text-embedding-ada-002-v2",
    "usage": {"prompt_tokens": 400, "total_tokens": 400},
}


class ResponsePayload(ResponseModel):
    object: str = "list"
    data: list[EmbeddingObject]
    model: str
    usage: EmbeddingsUsage

    model_config = ConfigDict(json_schema_extra=_RESPONSE_PAYLOAD_EXTRA_SCHEMA)
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/gateway/schemas/__init__.py

```python
from mlflow.gateway.schemas import chat, completions, embeddings

__all__ = ["chat", "completions", "embeddings"]
```

--------------------------------------------------------------------------------

---[FILE: autolog.py]---
Location: mlflow-master/mlflow/gemini/autolog.py

```python
import inspect
import logging

import mlflow
import mlflow.gemini
from mlflow.entities import SpanType
from mlflow.gemini.chat import (
    convert_gemini_func_to_mlflow_chat_tool,
)
from mlflow.tracing.constant import SpanAttributeKey, TokenUsageKey
from mlflow.tracing.provider import detach_span_from_context, set_span_in_context
from mlflow.tracing.utils import construct_full_inputs, set_span_chat_tools
from mlflow.utils.autologging_utils.config import AutoLoggingConfig

try:
    # This is for supporting the previous Google GenAI SDK
    # https://github.com/google-gemini/generative-ai-python
    from google import generativeai

    has_generativeai = True
except ImportError:
    has_generativeai = False

try:
    from google import genai

    has_genai = True
except ImportError:
    has_genai = False

_logger = logging.getLogger(__name__)


def patched_class_call(original, self, *args, **kwargs):
    """
    This method is used for patching class methods of gemini SDKs.
    This patch creates a span and set input and output of the original method to the span.
    """
    with TracingSession(original, self, args, kwargs) as manager:
        output = original(self, *args, **kwargs)
        manager.output = output
        return output


async def async_patched_class_call(original, self, *args, **kwargs):
    """
    This method is used for patching async class methods of gemini SDKs.
    This patch creates a span and set input and output of the original method to the span.
    """
    async with TracingSession(original, self, args, kwargs) as manager:
        output = await original(self, *args, **kwargs)
        manager.output = output
        return output


class TracingSession:
    """Context manager for handling MLflow spans in both sync and async contexts."""

    def __init__(self, original, instance, args, kwargs):
        self.original = original
        self.instance = instance
        self.inputs = construct_full_inputs(original, instance, *args, **kwargs)

        # These attributes are set outside the constructor.
        self.span = None
        self.token = None
        self.output = None

    def __enter__(self):
        return self._enter_impl()

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._exit_impl(exc_type, exc_val, exc_tb)

    async def __aenter__(self):
        return self._enter_impl()

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        self._exit_impl(exc_type, exc_val, exc_tb)

    def _enter_impl(self):
        config = AutoLoggingConfig.init(flavor_name=mlflow.gemini.FLAVOR_NAME)
        if not config.log_traces:
            return self

        self.span = mlflow.start_span_no_context(
            name=f"{self.instance.__class__.__name__}.{self.original.__name__}",
            span_type=_get_span_type(self.original.__name__),
            inputs=self.inputs,
            attributes={SpanAttributeKey.MESSAGE_FORMAT: "gemini"},
        )
        if has_generativeai and isinstance(self.instance, generativeai.GenerativeModel):
            _log_generativeai_tool_definition(self.instance, self.span)

        if _is_genai_model_or_chat(self.instance):
            _log_genai_tool_definition(self.instance, self.inputs, self.span)

        # Attach the span to the current context. This is necessary because single Gemini
        # SDK call might create multiple child spans.
        self.token = set_span_in_context(self.span)
        return self

    def _exit_impl(self, exc_type, exc_val, exc_tb) -> None:
        if not self.span:
            return

        # Detach span from the context at first. This must not be interrupted by any exception,
        # otherwise the span context will leak and pollute other traces created next.
        detach_span_from_context(self.token)

        if exc_val:
            self.span.record_exception(exc_val)

        try:
            if usage := _parse_usage(self.output):
                self.span.set_attribute(SpanAttributeKey.CHAT_USAGE, usage)
        except Exception as e:
            _logger.warning(
                f"Failed to extract token usage for span {self.span.name}: {e}", exc_info=True
            )

        # need to convert the response of generate_content for better visualization
        outputs = self.output.to_dict() if hasattr(self.output, "to_dict") else self.output
        self.span.end(outputs=outputs)


def _is_genai_model_or_chat(instance) -> bool:
    return has_genai and isinstance(
        instance,
        (
            genai.models.Models,
            genai.chats.Chat,
            genai.models.AsyncModels,
            genai.chats.AsyncChat,
        ),
    )


def patched_module_call(original, *args, **kwargs):
    """
    This method is used for patching standalone functions of the google.generativeai module.
    This patch creates a span and set input and output of the original function to the span.
    """
    config = AutoLoggingConfig.init(flavor_name=mlflow.gemini.FLAVOR_NAME)
    if not config.log_traces:
        return original(*args, **kwargs)

    with mlflow.start_span(
        name=f"{original.__name__}",
        span_type=_get_span_type(original.__name__),
    ) as span:
        inputs = _construct_full_inputs(original, *args, **kwargs)
        span.set_inputs(inputs)
        span.set_attribute(SpanAttributeKey.MESSAGE_FORMAT, "gemini")
        result = original(*args, **kwargs)
        try:
            if usage := _parse_usage(result):
                span.set_attribute(SpanAttributeKey.CHAT_USAGE, usage)
        except Exception as e:
            _logger.warning(
                f"Failed to extract token usage for span {span.name}: {e}", exc_info=True
            )
        # need to convert the response of generate_content for better visualization
        outputs = result.to_dict() if hasattr(result, "to_dict") else result
        span.set_outputs(outputs)

    return result


def _get_keys(dic, keys):
    for key in keys:
        if key in dic:
            return dic[key]

    return None


def _log_generativeai_tool_definition(model, span):
    """
    This method extract tool definition from generativeai tool type.
    """
    # when tools are not passed
    if not getattr(model, "_tools", None):
        return

    try:
        set_span_chat_tools(
            span,
            [
                convert_gemini_func_to_mlflow_chat_tool(func)
                for func in model._tools.to_proto()[0].function_declarations
            ],
        )
    except Exception as e:
        _logger.warning(f"Failed to set tool definitions for {span}. Error: {e}")


def _log_genai_tool_definition(model, inputs, span):
    """
    This method extract tool definition from genai tool type.
    """
    config = inputs.get("config")
    tools = getattr(config, "tools", None)
    if not tools:
        return
    # Here, we use an internal function of gemini library to convert callable to Tool schema to
    # avoid having the same logic on mlflow side and there is no public attribute for Tool schema.
    # https://github.com/googleapis/python-genai/blob/01b15e32d3823a58d25534bb6eea93f30bf82219/google/genai/_transformers.py#L662
    tools = genai._transformers.t_tools(model._api_client, tools)

    try:
        set_span_chat_tools(
            span,
            [
                convert_gemini_func_to_mlflow_chat_tool(function_declaration)
                for tool in tools
                for function_declaration in tool.function_declarations
            ],
        )
    except Exception as e:
        _logger.warning(f"Failed to set tool definitions for {span}. Error: {e}")


def _get_span_type(task_name: str) -> str:
    span_type_mapping = {
        "generate_content": SpanType.LLM,
        "_generate_content": SpanType.LLM,
        "send_message": SpanType.CHAT_MODEL,
        "count_tokens": SpanType.LLM,
        "embed_content": SpanType.EMBEDDING,
    }
    return span_type_mapping.get(task_name, SpanType.UNKNOWN)


def _construct_full_inputs(func, *args, **kwargs):
    signature = inspect.signature(func)
    # this method does not create copy. So values should not be mutated directly
    arguments = signature.bind_partial(*args, **kwargs).arguments

    if "self" in arguments:
        arguments.pop("self")

    return arguments


def _parse_usage(output):
    usage = None
    if hasattr(output, "usage_metadata"):
        usage = output.usage_metadata
    elif isinstance(output, dict):
        usage = output.get("usage_metadata")
    else:
        return None

    usage_dict = {}
    if (prompt_tokens := usage.prompt_token_count) is not None:
        usage_dict[TokenUsageKey.INPUT_TOKENS] = prompt_tokens
    if (candidate_tokens := usage.candidates_token_count) is not None:
        usage_dict[TokenUsageKey.OUTPUT_TOKENS] = candidate_tokens
    if (total_tokens := usage.total_token_count) is not None:
        usage_dict[TokenUsageKey.TOTAL_TOKENS] = total_tokens

    return usage_dict or None
```

--------------------------------------------------------------------------------

````
