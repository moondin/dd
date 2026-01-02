---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 261
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 261 of 991)

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

---[FILE: anthropic.py]---
Location: mlflow-master/mlflow/gateway/providers/anthropic.py
Signals: FastAPI

```python
import json
import logging
import time
from typing import Any, AsyncIterable

from mlflow.gateway.config import AnthropicConfig, EndpointConfig
from mlflow.gateway.constants import (
    MLFLOW_AI_GATEWAY_ANTHROPIC_DEFAULT_MAX_TOKENS,
    MLFLOW_AI_GATEWAY_ANTHROPIC_MAXIMUM_MAX_TOKENS,
)
from mlflow.gateway.exceptions import AIGatewayException
from mlflow.gateway.providers.base import (
    BaseProvider,
    PassthroughAction,
    ProviderAdapter,
)
from mlflow.gateway.providers.utils import rename_payload_keys, send_request, send_stream_request
from mlflow.gateway.schemas import chat, completions
from mlflow.types.chat import Function, ToolCallDelta

_logger = logging.getLogger(__name__)


class AnthropicAdapter(ProviderAdapter):
    @classmethod
    def chat_to_model(cls, payload, config):
        key_mapping = {"stop": "stop_sequences"}
        payload["model"] = config.model.name
        payload = rename_payload_keys(payload, key_mapping)

        if "top_p" in payload and "temperature" in payload:
            raise AIGatewayException(
                status_code=422, detail="Cannot set both 'temperature' and 'top_p' parameters."
            )

        max_tokens = payload.get("max_tokens", MLFLOW_AI_GATEWAY_ANTHROPIC_DEFAULT_MAX_TOKENS)
        if max_tokens > MLFLOW_AI_GATEWAY_ANTHROPIC_MAXIMUM_MAX_TOKENS:
            raise AIGatewayException(
                status_code=422,
                detail="Invalid value for max_tokens: cannot exceed "
                f"{MLFLOW_AI_GATEWAY_ANTHROPIC_MAXIMUM_MAX_TOKENS}.",
            )
        payload["max_tokens"] = max_tokens

        if payload.pop("n", 1) != 1:
            raise AIGatewayException(
                status_code=422,
                detail="'n' must be '1' for the Anthropic provider. Received value: '{n}'.",
            )

        # Cohere uses `system` to set the system message
        # we concatenate all system messages from the user with a newline
        if system_messages := [m for m in payload["messages"] if m["role"] == "system"]:
            payload["system"] = "\n".join(m["content"] for m in system_messages)

        # remaining messages are chat history
        # we want to include only user, assistant or tool messages
        # Anthropic format of tool related messages example
        # https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview#tool-use-examples
        converted_messages = []
        for m in payload["messages"]:
            if m["role"] == "user":
                converted_messages.append(m)
            elif m["role"] == "assistant":
                if m.get("tool_calls") is not None:
                    tool_use_contents = [
                        {
                            "type": "tool_use",
                            "id": tool_call["id"],
                            "name": tool_call["function"]["name"],
                            "input": json.loads(tool_call["function"]["arguments"]),
                        }
                        for tool_call in m["tool_calls"]
                    ]
                    m["content"] = tool_use_contents
                    m.pop("tool_calls")
                converted_messages.append(m)
            elif m["role"] == "tool":
                converted_messages.append(
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "tool_result",
                                "tool_use_id": m["tool_call_id"],
                                "content": m["content"],
                            }
                        ],
                    }
                )
            else:
                _logger.info(f"Discarded unknown message: {m}")

        payload["messages"] = converted_messages

        # The range of Anthropic's temperature is 0-1, but ours is 0-2, so we halve it
        if "temperature" in payload:
            payload["temperature"] = 0.5 * payload["temperature"]

        # convert tool definition to Anthropic format
        if tools := payload.pop("tools", None):
            converted_tools = []
            for tool in tools:
                if tool["type"] != "function":
                    raise AIGatewayException(
                        status_code=422,
                        detail=(
                            "Only function calling tool is supported, but received tool type "
                            f"{tool['type']}"
                        ),
                    )

                tool_function = tool["function"]
                converted_tools.append(
                    {
                        "name": tool_function["name"],
                        "description": tool_function["description"],
                        "input_schema": tool_function["parameters"],
                    }
                )

            payload["tools"] = converted_tools

        return payload

    @classmethod
    def model_to_chat(cls, resp, config):
        # API reference: https://docs.anthropic.com/en/api/messages#body-messages
        #
        # Example response:
        # ```
        # {
        #   "content": [
        #     {
        #       "text": "Blue is often seen as a calming and soothing color.",
        #       "type": "text"
        #     },
        #     {
        #       "type": "tool_use",
        #       "id": "toolu_011UYCoc...",
        #       "name": "get_weather",
        #       "input": { "city": "Singapore" }
        #     },
        #     {
        #       "source": {
        #       "type": "base64",
        #       "media_type": "image/jpeg",
        #       "data": "/9j/4AAQSkZJRg...",
        #       "type": "image",
        #       }
        #     }
        #   ],
        #   "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
        #   "model": "claude-2.1",
        #   "role": "assistant",
        #   "stop_reason": "end_turn",
        #   "stop_sequence": null,
        #   "type": "message",
        #   "usage": {
        #     "input_tokens": 10,
        #     "output_tokens": 25
        #   }
        # }
        # ```
        from mlflow.anthropic.chat import convert_message_to_mlflow_chat

        stop_reason = "length" if resp["stop_reason"] == "max_tokens" else "stop"

        return chat.ResponsePayload(
            id=resp["id"],
            created=int(time.time()),
            object="chat.completion",
            model=resp["model"],
            choices=[
                chat.Choice(
                    index=0,
                    # TODO: Remove this casting once
                    # https://github.com/mlflow/mlflow/pull/14160 is merged
                    message=chat.ResponseMessage(
                        **convert_message_to_mlflow_chat(resp).model_dump()
                    ),
                    finish_reason=stop_reason,
                )
            ],
            usage=chat.ChatUsage(
                prompt_tokens=resp["usage"]["input_tokens"],
                completion_tokens=resp["usage"]["output_tokens"],
                total_tokens=resp["usage"]["input_tokens"] + resp["usage"]["output_tokens"],
            ),
        )

    @classmethod
    def chat_streaming_to_model(cls, payload, config):
        return cls.chat_to_model(payload, config)

    @classmethod
    def model_to_chat_streaming(cls, resp, config):
        content = resp.get("delta") or resp.get("content_block") or {}
        if (stop_reason := content.get("stop_reason")) is not None:
            stop_reason = "length" if stop_reason == "max_tokens" else "stop"

        # example of function calling delta message format:
        # https://platform.openai.com/docs/guides/function-calling#streaming
        if content.get("type") == "tool_use":
            delta = chat.StreamDelta(
                tool_calls=[
                    ToolCallDelta(
                        index=0,
                        id=content.get("id"),
                        type="function",
                        function=Function(name=content.get("name")),
                    )
                ]
            )
        elif content.get("type") == "input_json_delta":
            delta = chat.StreamDelta(
                tool_calls=[
                    ToolCallDelta(index=0, function=Function(arguments=content.get("partial_json")))
                ]
            )
        else:
            delta = chat.StreamDelta(
                role=None,
                content=content.get("text"),
            )

        return chat.StreamResponsePayload(
            id=resp["id"],
            created=int(time.time()),
            model=resp["model"],
            choices=[
                chat.StreamChoice(
                    index=resp["index"],
                    finish_reason=stop_reason,
                    delta=delta,
                )
            ],
        )

    @classmethod
    def model_to_completions(cls, resp, config):
        stop_reason = "stop" if resp["stop_reason"] == "stop_sequence" else "length"

        return completions.ResponsePayload(
            created=int(time.time()),
            object="text_completion",
            model=resp["model"],
            choices=[
                completions.Choice(
                    index=0,
                    text=resp["completion"],
                    finish_reason=stop_reason,
                )
            ],
            usage=completions.CompletionsUsage(
                prompt_tokens=None,
                completion_tokens=None,
                total_tokens=None,
            ),
        )

    @classmethod
    def completions_to_model(cls, payload, config):
        key_mapping = {"max_tokens": "max_tokens_to_sample", "stop": "stop_sequences"}

        payload["model"] = config.model.name

        if "top_p" in payload:
            raise AIGatewayException(
                status_code=422,
                detail="Cannot set both 'temperature' and 'top_p' parameters. "
                "Please use only the temperature parameter for your query.",
            )
        max_tokens = payload.get("max_tokens", MLFLOW_AI_GATEWAY_ANTHROPIC_DEFAULT_MAX_TOKENS)

        if max_tokens > MLFLOW_AI_GATEWAY_ANTHROPIC_MAXIMUM_MAX_TOKENS:
            raise AIGatewayException(
                status_code=422,
                detail="Invalid value for max_tokens: cannot exceed "
                f"{MLFLOW_AI_GATEWAY_ANTHROPIC_MAXIMUM_MAX_TOKENS}.",
            )

        payload["max_tokens"] = max_tokens

        if payload.get("stream", False):
            raise AIGatewayException(
                status_code=422,
                detail="Setting the 'stream' parameter to 'true' is not supported with the MLflow "
                "Gateway.",
            )
        n = payload.pop("n", 1)
        if n != 1:
            raise AIGatewayException(
                status_code=422,
                detail=f"'n' must be '1' for the Anthropic provider. Received value: '{n}'.",
            )

        payload = rename_payload_keys(payload, key_mapping)

        if payload["prompt"].startswith("Human: "):
            payload["prompt"] = "\n\n" + payload["prompt"]

        if not payload["prompt"].startswith("\n\nHuman: "):
            payload["prompt"] = "\n\nHuman: " + payload["prompt"]

        if not payload["prompt"].endswith("\n\nAssistant:"):
            payload["prompt"] = payload["prompt"] + "\n\nAssistant:"

        # The range of Anthropic's temperature is 0-1, but ours is 0-2, so we halve it
        if "temperature" in payload:
            payload["temperature"] = 0.5 * payload["temperature"]

        return payload

    @classmethod
    def embeddings_to_model(cls, payload, config):
        raise NotImplementedError

    @classmethod
    def model_to_embeddings(cls, resp, config):
        raise NotImplementedError


class AnthropicProvider(BaseProvider, AnthropicAdapter):
    NAME = "Anthropic"
    CONFIG_TYPE = AnthropicConfig

    PASSTHROUGH_PROVIDER_PATHS = {
        PassthroughAction.ANTHROPIC_MESSAGES: "messages",
    }

    def __init__(self, config: EndpointConfig) -> None:
        super().__init__(config)
        if config.model.config is None or not isinstance(config.model.config, AnthropicConfig):
            raise TypeError(f"Invalid config type {config.model.config}")
        self.anthropic_config: AnthropicConfig = config.model.config

    @property
    def headers(self) -> dict[str, str]:
        return {
            "x-api-key": self.anthropic_config.anthropic_api_key,
            "anthropic-version": self.anthropic_config.anthropic_version,
        }

    @property
    def base_url(self) -> str:
        return "https://api.anthropic.com/v1"

    @property
    def adapter_class(self) -> type[ProviderAdapter]:
        return AnthropicAdapter

    def get_endpoint_url(self, route_type: str) -> str:
        if route_type == "llm/v1/chat":
            return f"{self.base_url}/messages"
        elif route_type == "llm/v1/completions":
            return f"{self.base_url}/complete"
        else:
            raise ValueError(f"Invalid route type {route_type}")

    async def chat_stream(
        self, payload: chat.RequestPayload
    ) -> AsyncIterable[chat.StreamResponsePayload]:
        from fastapi.encoders import jsonable_encoder

        payload = jsonable_encoder(payload, exclude_none=True)
        self.check_for_model_field(payload)
        stream = send_stream_request(
            headers=self.headers,
            base_url=self.base_url,
            path="messages",
            payload=AnthropicAdapter.chat_streaming_to_model(payload, self.config),
        )

        indices = []
        metadata = {}
        async for chunk in stream:
            chunk = chunk.strip()
            if not chunk:
                continue

            # No handling on "event" lines
            prefix, content = chunk.split(b":", 1)
            if prefix != b"data":
                continue

            # See https://docs.anthropic.com/claude/reference/messages-streaming
            resp = json.loads(content.decode("utf-8"))

            # response id and model are only present in `message_start`
            if resp["type"] == "message_start":
                metadata["id"] = resp["message"]["id"]
                metadata["model"] = resp["message"]["model"]
                continue

            if resp["type"] not in (
                "message_delta",
                "content_block_start",
                "content_block_delta",
            ):
                continue

            index = resp.get("index")
            if index is not None and index not in indices:
                indices.append(index)

            resp.update(metadata)
            if resp["type"] == "message_delta":
                for index in indices:
                    yield AnthropicAdapter.model_to_chat_streaming(
                        {**resp, "index": index},
                        self.config,
                    )
            else:
                yield AnthropicAdapter.model_to_chat_streaming(resp, self.config)

    async def chat(self, payload: chat.RequestPayload) -> chat.ResponsePayload:
        from fastapi.encoders import jsonable_encoder

        payload = jsonable_encoder(payload, exclude_none=True)
        self.check_for_model_field(payload)
        resp = await send_request(
            headers=self.headers,
            base_url=self.base_url,
            path="messages",
            payload=AnthropicAdapter.chat_to_model(payload, self.config),
        )
        return AnthropicAdapter.model_to_chat(resp, self.config)

    async def completions(self, payload: completions.RequestPayload) -> completions.ResponsePayload:
        from fastapi.encoders import jsonable_encoder

        payload = jsonable_encoder(payload, exclude_none=True)
        self.check_for_model_field(payload)

        resp = await send_request(
            headers=self.headers,
            base_url=self.base_url,
            path="complete",
            payload=AnthropicAdapter.completions_to_model(payload, self.config),
        )

        # Example response:
        # Documentation: https://docs.anthropic.com/claude/reference/complete_post
        # ```
        # {
        #     "completion": " Hello! My name is Claude."
        #     "stop_reason": "stop_sequence",
        #     "model": "claude-instant-1.1",
        #     "truncated": False,
        #     "stop": None,
        #     "log_id": "dee173f87ddf1357da639dee3c38d833",
        #     "exception": None,
        # }
        # ```

        return AnthropicAdapter.model_to_completions(resp, self.config)

    async def passthrough(
        self, action: PassthroughAction, payload: dict[str, Any]
    ) -> dict[str, Any] | AsyncIterable[bytes]:
        provider_path = self._validate_passthrough_action(action)

        # Add model name from config
        payload["model"] = self.config.model.name

        if payload.get("stream"):
            return send_stream_request(
                headers=self.headers,
                base_url=self.base_url,
                path=provider_path,
                payload=payload,
            )
        else:
            return await send_request(
                headers=self.headers,
                base_url=self.base_url,
                path=provider_path,
                payload=payload,
            )
```

--------------------------------------------------------------------------------

---[FILE: base.py]---
Location: mlflow-master/mlflow/gateway/providers/base.py

```python
from abc import ABC, abstractmethod
from enum import Enum
from typing import Any, AsyncIterable

import numpy as np

from mlflow.exceptions import MlflowException
from mlflow.gateway.base_models import ConfigModel
from mlflow.gateway.config import EndpointConfig
from mlflow.gateway.exceptions import AIGatewayException
from mlflow.gateway.schemas import chat, completions, embeddings
from mlflow.utils.annotations import developer_stable


class PassthroughAction(str, Enum):
    """
    Enum for passthrough endpoint actions.
    """

    OPENAI_CHAT = "openai_chat"
    OPENAI_EMBEDDINGS = "openai_embeddings"
    OPENAI_RESPONSES = "openai_responses"
    ANTHROPIC_MESSAGES = "anthropic_messages"
    GEMINI_GENERATE_CONTENT = "gemini_generate_content"
    GEMINI_STREAM_GENERATE_CONTENT = "gemini_stream_generate_content"


# Mapping of passthrough actions to their gateway API routes
PASSTHROUGH_ROUTES = {
    PassthroughAction.OPENAI_CHAT: "/openai/v1/chat/completions",
    PassthroughAction.OPENAI_EMBEDDINGS: "/openai/v1/embeddings",
    PassthroughAction.OPENAI_RESPONSES: "/openai/v1/responses",
    PassthroughAction.ANTHROPIC_MESSAGES: "/anthropic/v1/messages",
    PassthroughAction.GEMINI_GENERATE_CONTENT: "/gemini/v1beta/models/{endpoint_name}:generateContent",  # noqa: E501
    PassthroughAction.GEMINI_STREAM_GENERATE_CONTENT: "/gemini/v1beta/models/{endpoint_name}:streamGenerateContent",  # noqa: E501
}


@developer_stable
class BaseProvider(ABC):
    """
    Base class for MLflow Gateway providers.
    """

    NAME: str = ""
    SUPPORTED_ROUTE_TYPES: tuple[str, ...]
    CONFIG_TYPE: type[ConfigModel]
    PASSTHROUGH_PROVIDER_PATHS: dict[PassthroughAction, str] = {}

    def __init__(self, config: EndpointConfig):
        if self.NAME == "":
            raise ValueError(
                f"{self.__class__.__name__} is a subclass of BaseProvider and must "
                f"override 'NAME' attribute as a non-empty string."
            )

        if not hasattr(self, "CONFIG_TYPE") or not issubclass(self.CONFIG_TYPE, ConfigModel):
            raise ValueError(
                f"{self.__class__.__name__} is a subclass of BaseProvider and must "
                f"override 'CONFIG_TYPE' attribute as a subclass of ConfigModel."
            )

        self.config = config

    async def chat_stream(
        self, payload: chat.RequestPayload
    ) -> AsyncIterable[chat.StreamResponsePayload]:
        raise AIGatewayException(
            status_code=501,
            detail=f"The chat streaming route is not implemented for {self.NAME} models.",
        )

    async def chat(self, payload: chat.RequestPayload) -> chat.ResponsePayload:
        raise AIGatewayException(
            status_code=501,
            detail=f"The chat route is not implemented for {self.NAME} models.",
        )

    async def completions_stream(
        self, payload: completions.RequestPayload
    ) -> AsyncIterable[completions.StreamResponsePayload]:
        raise AIGatewayException(
            status_code=501,
            detail=f"The completions streaming route is not implemented for {self.NAME} models.",
        )

    async def completions(self, payload: completions.RequestPayload) -> completions.ResponsePayload:
        raise AIGatewayException(
            status_code=501,
            detail=f"The completions route is not implemented for {self.NAME} models.",
        )

    async def embeddings(self, payload: embeddings.RequestPayload) -> embeddings.ResponsePayload:
        raise AIGatewayException(
            status_code=501,
            detail=f"The embeddings route is not implemented for {self.NAME} models.",
        )

    def _validate_passthrough_action(self, action: PassthroughAction) -> str:
        """
        Validates that the passthrough action is supported by this provider
        and returns the provider path.

        Args:
            action: The passthrough action to validate

        Returns:
            The provider path for the action
        """
        provider_path = self.PASSTHROUGH_PROVIDER_PATHS.get(action)
        if provider_path is None:
            route = PASSTHROUGH_ROUTES.get(action, action.value)
            supported_routes = ", ".join(
                f"/gateway{route} (provider_path: {path})"
                for act in self.PASSTHROUGH_PROVIDER_PATHS.keys()
                if (route := PASSTHROUGH_ROUTES.get(act))
                and (path := self.PASSTHROUGH_PROVIDER_PATHS.get(act))
            )
            raise AIGatewayException(
                status_code=400,
                detail=f"Unsupported passthrough endpoint '{route}' for {self.NAME} provider. "
                f"Supported endpoints: {supported_routes}",
            )
        return provider_path

    async def passthrough(
        self, action: PassthroughAction, payload: dict[str, Any]
    ) -> dict[str, Any] | AsyncIterable[bytes]:
        """
        Unified passthrough endpoint for raw API requests.

        Args:
            action: The passthrough action to perform (e.g., OPENAI_CHAT, OPENAI_EMBEDDINGS)
            payload: Raw request payload in the format expected by the target API

        Returns:
            Raw response from the target API, optionally as an async iterable for streaming

        Raises:
            AIGatewayException: If the passthrough action is not implemented for this provider
        """
        route = PASSTHROUGH_ROUTES.get(action)
        raise AIGatewayException(
            status_code=501,
            detail=f"The passthrough route '{route}' is not implemented for {self.NAME} models.",
        )

    @staticmethod
    def check_for_model_field(payload):
        if "model" in payload:
            raise AIGatewayException(
                status_code=422,
                detail="The parameter 'model' is not permitted to be passed. The route being "
                "queried already defines a model instance.",
            )


class TrafficRouteProvider(BaseProvider):
    """
    A provider that split traffic and forward to multiple providers
    """

    NAME: str = "TrafficRoute"

    def __init__(
        self,
        configs: list[EndpointConfig],
        traffic_splits: list[int],
        routing_strategy: str,
    ):
        from mlflow.gateway.providers import get_provider

        if len(configs) != len(traffic_splits):
            raise MlflowException.invalid_parameter_value(
                "'configs' and 'traffic_splits' should have the same length."
            )

        if routing_strategy != "TRAFFIC_SPLIT":
            raise MlflowException.invalid_parameter_value(
                "'routing_strategy' must be 'TRAFFIC_SPLIT'."
            )

        self._providers = [get_provider(config.model.provider)(config) for config in configs]

        self._weights = np.array(traffic_splits, dtype=np.float32) / 100
        self._indices = np.arange(len(self._providers))

    def _get_provider(self):
        chosen_index = np.random.choice(self._indices, p=self._weights)
        return self._providers[chosen_index]

    async def chat_stream(
        self, payload: chat.RequestPayload
    ) -> AsyncIterable[chat.StreamResponsePayload]:
        prov = self._get_provider()
        async for i in prov.chat_stream(payload):
            yield i

    async def chat(self, payload: chat.RequestPayload) -> chat.ResponsePayload:
        prov = self._get_provider()
        return await prov.chat(payload)

    async def completions_stream(
        self, payload: completions.RequestPayload
    ) -> AsyncIterable[completions.StreamResponsePayload]:
        prov = self._get_provider()
        async for i in prov.completions_stream(payload):
            yield i

    async def completions(self, payload: completions.RequestPayload) -> completions.ResponsePayload:
        prov = self._get_provider()
        return await prov.completions(payload)

    async def embeddings(self, payload: embeddings.RequestPayload) -> embeddings.ResponsePayload:
        prov = self._get_provider()
        return await prov.embeddings(payload)

    async def passthrough(
        self, action: PassthroughAction, payload: dict[str, Any]
    ) -> dict[str, Any] | AsyncIterable[bytes]:
        prov = self._get_provider()
        return await prov.passthrough(action, payload)


class ProviderAdapter(ABC):
    @classmethod
    @abstractmethod
    def model_to_embeddings(cls, resp, config): ...

    @classmethod
    @abstractmethod
    def model_to_completions(cls, resp, config): ...

    @classmethod
    def model_to_completions_streaming(cls, resp, config):
        raise NotImplementedError

    @classmethod
    @abstractmethod
    def completions_to_model(cls, payload, config): ...

    @classmethod
    def completions_streaming_to_model(cls, payload, config):
        raise NotImplementedError

    @classmethod
    def model_to_chat(cls, resp, config):
        raise NotImplementedError

    @classmethod
    def model_to_chat_streaming(cls, resp, config):
        raise NotImplementedError

    @classmethod
    def chat_to_model(cls, payload, config):
        raise NotImplementedError

    @classmethod
    def chat_streaming_to_model(cls, payload, config):
        raise NotImplementedError

    @classmethod
    @abstractmethod
    def embeddings_to_model(cls, payload, config): ...

    @classmethod
    def check_keys_against_mapping(cls, mapping, payload):
        for k1, k2 in mapping.items():
            if k2 in payload:
                raise AIGatewayException(
                    status_code=400, detail=f"Invalid parameter {k2}. Use {k1} instead."
                )
```

--------------------------------------------------------------------------------

---[FILE: bedrock.py]---
Location: mlflow-master/mlflow/gateway/providers/bedrock.py
Signals: FastAPI

```python
import json
import time
from enum import Enum

from mlflow.gateway.config import AmazonBedrockConfig, AWSIdAndKey, AWSRole, EndpointConfig
from mlflow.gateway.constants import (
    MLFLOW_AI_GATEWAY_ANTHROPIC_DEFAULT_MAX_TOKENS,
)
from mlflow.gateway.exceptions import AIGatewayConfigException, AIGatewayException
from mlflow.gateway.providers.anthropic import AnthropicAdapter
from mlflow.gateway.providers.base import BaseProvider, ProviderAdapter
from mlflow.gateway.providers.cohere import CohereAdapter
from mlflow.gateway.providers.utils import rename_payload_keys
from mlflow.gateway.schemas import completions

AWS_BEDROCK_ANTHROPIC_MAXIMUM_MAX_TOKENS = 8191


class AmazonBedrockAnthropicAdapter(AnthropicAdapter):
    @classmethod
    def chat_to_model(cls, payload, config):
        payload = super().chat_to_model(payload, config)
        # "model" keys are not supported in Bedrock"
        payload.pop("model", None)
        payload["anthropic_version"] = "bedrock-2023-05-31"
        return payload

    @classmethod
    def completions_to_model(cls, payload, config):
        payload = super().completions_to_model(payload, config)

        if "\n\nHuman:" not in payload.get("stop_sequences", []):
            payload.setdefault("stop_sequences", []).append("\n\nHuman:")

        payload["max_tokens_to_sample"] = min(
            payload.get("max_tokens_to_sample", MLFLOW_AI_GATEWAY_ANTHROPIC_DEFAULT_MAX_TOKENS),
            AWS_BEDROCK_ANTHROPIC_MAXIMUM_MAX_TOKENS,
        )
        payload["anthropic_version"] = "bedrock-2023-05-31"

        # "model" keys are not supported in Bedrock"
        payload.pop("model", None)
        return payload

    @classmethod
    def model_to_completions(cls, payload, config):
        payload["model"] = config.model.name
        return super().model_to_completions(payload, config)


class AWSTitanAdapter(ProviderAdapter):
    # TODO handle top_p, top_k, etc.
    @classmethod
    def completions_to_model(cls, payload, config):
        n = payload.pop("n", 1)
        if n != 1:
            raise AIGatewayException(
                status_code=422,
                detail=f"'n' must be '1' for AWS Titan models. Received value: '{n}'.",
            )

        # The range of Titan's temperature is 0-1, but ours is 0-2, so we halve it
        if "temperature" in payload:
            payload["temperature"] = 0.5 * payload["temperature"]
        return {
            "inputText": payload.pop("prompt"),
            "textGenerationConfig": rename_payload_keys(
                payload, {"max_tokens": "maxTokenCount", "stop": "stopSequences"}
            ),
        }

    @classmethod
    def model_to_completions(cls, resp, config):
        return completions.ResponsePayload(
            created=int(time.time()),
            object="text_completion",
            model=config.model.name,
            choices=[
                completions.Choice(
                    index=idx,
                    text=candidate.get("outputText"),
                    finish_reason=None,
                )
                for idx, candidate in enumerate(resp.get("results", []))
            ],
            usage=completions.CompletionsUsage(
                prompt_tokens=None,
                completion_tokens=None,
                total_tokens=None,
            ),
        )

    @classmethod
    def embeddings_to_model(cls, payload, config):
        raise NotImplementedError

    @classmethod
    def model_to_embeddings(cls, resp, config):
        raise NotImplementedError


class AI21Adapter(ProviderAdapter):
    # TODO handle top_p, top_k, etc.
    @classmethod
    def completions_to_model(cls, payload, config):
        return rename_payload_keys(
            payload,
            {
                "stop": "stopSequences",
                "n": "numResults",
                "max_tokens": "maxTokens",
            },
        )

    @classmethod
    def model_to_completions(cls, resp, config):
        return completions.ResponsePayload(
            created=int(time.time()),
            object="text_completion",
            model=config.model.name,
            choices=[
                completions.Choice(
                    index=idx,
                    text=candidate.get("data", {}).get("text"),
                    finish_reason=None,
                )
                for idx, candidate in enumerate(resp.get("completions", []))
            ],
            usage=completions.CompletionsUsage(
                prompt_tokens=None,
                completion_tokens=None,
                total_tokens=None,
            ),
        )

    @classmethod
    def embeddings_to_model(cls, payload, config):
        raise NotImplementedError

    @classmethod
    def model_to_embeddings(cls, resp, config):
        raise NotImplementedError


class AmazonBedrockModelProvider(Enum):
    AMAZON = "amazon"
    COHERE = "cohere"
    AI21 = "ai21"
    ANTHROPIC = "anthropic"

    @property
    def adapter_class(self) -> type[ProviderAdapter]:
        return AWS_MODEL_PROVIDER_TO_ADAPTER.get(self)

    @classmethod
    def of_str(cls, name: str):
        name = name.lower()

        for opt in cls:
            if opt.name.lower() in name or opt.value.lower() in name:
                return opt


AWS_MODEL_PROVIDER_TO_ADAPTER = {
    AmazonBedrockModelProvider.COHERE: CohereAdapter,
    AmazonBedrockModelProvider.ANTHROPIC: AmazonBedrockAnthropicAdapter,
    AmazonBedrockModelProvider.AMAZON: AWSTitanAdapter,
    AmazonBedrockModelProvider.AI21: AI21Adapter,
}


class AmazonBedrockProvider(BaseProvider):
    NAME = "Amazon Bedrock"
    CONFIG_TYPE = AmazonBedrockConfig

    def __init__(self, config: EndpointConfig):
        super().__init__(config)

        if config.model.config is None or not isinstance(config.model.config, AmazonBedrockConfig):
            raise TypeError(f"Invalid config type {config.model.config}")
        self.bedrock_config: AmazonBedrockConfig = config.model.config
        self._client = None
        self._client_created = 0

    def _client_expired(self):
        if not isinstance(self.bedrock_config.aws_config, AWSRole):
            return False

        return (
            (time.monotonic_ns() - self._client_created)
            >= (self.bedrock_config.aws_config.session_length_seconds) * 1_000_000_000,
        )

    def get_bedrock_client(self):
        import boto3
        import botocore.exceptions

        if self._client is not None and not self._client_expired():
            return self._client

        session = boto3.Session(**self._construct_session_args())

        try:
            self._client = session.client(
                service_name="bedrock-runtime", **self._construct_client_args(session)
            )
            self._client_created = time.monotonic_ns()
            return self._client
        except botocore.exceptions.UnknownServiceError as e:
            raise AIGatewayConfigException(
                "Cannot create Amazon Bedrock client; ensure boto3/botocore "
                "linked from the Amazon Bedrock user guide are installed. "
                "Otherwise likely missing credentials or accessing account without to "
                "Amazon Bedrock Private Preview"
            ) from e

    def _construct_session_args(self):
        session_args = {
            "region_name": self.bedrock_config.aws_config.aws_region,
        }

        return {k: v for k, v in session_args.items() if v}

    def _construct_client_args(self, session):
        aws_config = self.bedrock_config.aws_config

        if isinstance(aws_config, AWSRole):
            role = session.client(service_name="sts").assume_role(
                RoleArn=aws_config.aws_role_arn,
                RoleSessionName="ai-gateway-bedrock",
                DurationSeconds=aws_config.session_length_seconds,
            )
            return {
                "aws_access_key_id": role["Credentials"]["AccessKeyId"],
                "aws_secret_access_key": role["Credentials"]["SecretAccessKey"],
                "aws_session_token": role["Credentials"]["SessionToken"],
            }
        elif isinstance(aws_config, AWSIdAndKey):
            return {
                "aws_access_key_id": aws_config.aws_access_key_id,
                "aws_secret_access_key": aws_config.aws_secret_access_key,
                "aws_session_token": aws_config.aws_session_token,
            }
        else:
            # TODO: handle session token authentication
            return {}

    @property
    def _underlying_provider(self):
        if (not self.config.model.name) or "." not in self.config.model.name:
            return None
        return AmazonBedrockModelProvider.of_str(self.config.model.name)

    @property
    def adapter_class(self) -> type[ProviderAdapter]:
        provider = self._underlying_provider
        if not provider:
            raise AIGatewayException(
                status_code=422,
                detail=f"Unknown Amazon Bedrock model type {self._underlying_provider}",
            )
        adapter = provider.adapter_class
        if not adapter:
            raise AIGatewayException(
                status_code=422,
                detail=f"Don't know how to handle {self._underlying_provider} for Amazon Bedrock",
            )
        return adapter

    def _request(self, body):
        import botocore.exceptions

        try:
            response = self.get_bedrock_client().invoke_model(
                body=json.dumps(body).encode(),
                modelId=self.config.model.name,
                # defaults
                # save=False,
                accept="application/json",
                contentType="application/json",
            )
            return json.loads(response.get("body").read())

        # TODO work though botocore.exceptions to make this catchable.
        # except botocore.exceptions.ValidationException as e:
        #     raise HTTPException(status_code=422, detail=str(e)) from e

        except botocore.exceptions.ReadTimeoutError as e:
            raise AIGatewayException(status_code=408) from e

    async def completions(self, payload: completions.RequestPayload) -> completions.ResponsePayload:
        from fastapi.encoders import jsonable_encoder

        self.check_for_model_field(payload)
        payload = jsonable_encoder(payload, exclude_none=True, exclude_defaults=True)
        payload = self.adapter_class.completions_to_model(payload, self.config)
        response = self._request(payload)
        return self.adapter_class.model_to_completions(response, self.config)
```

--------------------------------------------------------------------------------

````
