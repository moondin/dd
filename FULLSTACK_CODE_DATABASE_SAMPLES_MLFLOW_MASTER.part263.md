---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 263
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 263 of 991)

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

---[FILE: gemini.py]---
Location: mlflow-master/mlflow/gateway/providers/gemini.py
Signals: FastAPI

```python
import hashlib
import json
import time
from typing import Any, AsyncIterable

from mlflow.gateway.config import EndpointConfig, GeminiConfig
from mlflow.gateway.exceptions import AIGatewayException
from mlflow.gateway.providers.base import (
    BaseProvider,
    PassthroughAction,
    ProviderAdapter,
)
from mlflow.gateway.providers.utils import rename_payload_keys, send_request, send_stream_request
from mlflow.gateway.schemas import (
    chat as chat_schema,
)
from mlflow.gateway.schemas import (
    completions as completions_schema,
)
from mlflow.gateway.schemas import (
    embeddings as embeddings_schema,
)
from mlflow.gateway.utils import handle_incomplete_chunks, strip_sse_prefix
from mlflow.types.chat import Function, ToolCall

GENERATION_CONFIG_KEY_MAPPING = {
    "stop": "stopSequences",
    "n": "candidateCount",
    "max_tokens": "maxOutputTokens",
    "top_k": "topK",
    "top_p": "topP",
}

GENERATION_CONFIGS = [
    "temperature",
    "stopSequences",
    "candidateCount",
    "maxOutputTokens",
    "topK",
    "topP",
]


class GeminiAdapter(ProviderAdapter):
    @classmethod
    def chat_to_model(cls, payload, config):
        # Documentation: https://ai.google.dev/api/generate-content
        # Example payload for the chat API.
        #
        # {
        #     "contents": [
        #         {
        #             "role": "user",
        #             "parts": [
        #                 {
        #                     "text": "System: You are an advanced AI Assistant"
        #                 }
        #             ]
        #         },
        #         {
        #             "role": "user",
        #             "parts": [
        #                 {
        #                     "text": "Please give the code for addition of two numbers"
        #                 }
        #             ]
        #         }
        #     ],
        #     "generationConfig": {
        #         "temperature": 0.1,
        #         "topP": 1,
        #         "stopSequences": ["\n"],
        #         "candidateCount": 1,
        #         "maxOutputTokens": 100,
        #         "topK": 40
        #     }
        # }

        for k1, k2 in GENERATION_CONFIG_KEY_MAPPING.items():
            if k2 in payload:
                raise AIGatewayException(
                    status_code=422, detail=f"Invalid parameter {k2}. Use {k1} instead."
                )

        if "top_p" in payload and payload["top_p"] > 1:
            raise AIGatewayException(
                status_code=422, detail="top_p should be less than or equal to 1"
            )

        payload = rename_payload_keys(payload, GENERATION_CONFIG_KEY_MAPPING)

        contents = []
        system_message = None

        call_id_to_function_name_map = {}

        for message in payload["messages"]:
            role = message["role"]

            if role in ("user", "assistant"):
                if role == "assistant":
                    role = "model"

                gemini_function_calls = []
                if role == "model":
                    if tool_calls := message.get("tool_calls"):
                        for tool_call in tool_calls:
                            call_id_to_function_name_map[tool_call["id"]] = tool_call["function"][
                                "name"
                            ]
                            gemini_function_calls.append(
                                {
                                    "functionCall": {
                                        "id": tool_call["id"],
                                        "name": tool_call["function"]["name"],
                                        "args": json.loads(tool_call["function"]["arguments"]),
                                    }
                                }
                            )
                if gemini_function_calls:
                    contents.append({"role": "model", "parts": gemini_function_calls})
                else:
                    contents.append({"role": role, "parts": [{"text": message["content"]}]})
            elif role == "system":
                if system_message is None:
                    system_message = {"parts": []}
                system_message["parts"].append({"text": message["content"]})
            elif role == "tool":
                call_id = message["tool_call_id"]
                contents.append(
                    {
                        "role": "user",
                        "parts": [
                            {
                                "functionResponse": {
                                    "id": call_id,
                                    # the function name field is required by Gemini request format
                                    "name": call_id_to_function_name_map[call_id],
                                    "response": json.loads(message["content"]),
                                }
                            }
                        ],
                    }
                )

        gemini_payload = {"contents": contents}

        if system_message:
            gemini_payload["system_instruction"] = system_message

        if generation_config := {k: v for k, v in payload.items() if k in GENERATION_CONFIGS}:
            gemini_payload["generationConfig"] = generation_config

        # convert tool definition to Gemini format
        if tools := payload.pop("tools", None):
            function_declarations = []
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
                function_declarations.append(
                    {
                        "name": tool_function["name"],
                        "description": tool_function["description"],
                        "parametersJsonSchema": tool_function["parameters"],
                    }
                )

            gemini_payload["tools"] = [{"functionDeclarations": function_declarations}]

        return gemini_payload

    @classmethod
    def _convert_function_call_to_openai_choice(
        cls,
        content_parts: list[dict[str, Any]],
        finish_reason: str,
        choice_idx: int,
        stream: bool,
    ):
        # convert gemini model responded "function call" struct to Openai choice / choice chunk
        # struct.
        # Gemini doc: https://ai.google.dev/api/caching#FunctionCall

        tool_calls = []
        for part in content_parts:
            function_call = part["functionCall"]
            func_name = function_call["name"]
            func_arguments = json.dumps(function_call["args"])
            call_id = function_call.get("id")
            if call_id is None:
                # Gemini model response might not contain function call id,
                # in order to make it compatible with Openai chat protocol,
                # we need to generate a unique call id.
                call_id = (
                    "call_"
                    + hashlib.md5(
                        f"{func_name}/{func_arguments}".encode(),
                        usedforsecurity=False,
                    ).hexdigest()
                )
            if stream:
                tool_calls.append(
                    chat_schema.ToolCallDelta(
                        index=0,
                        id=call_id,
                        function=Function(
                            name=func_name,
                            arguments=func_arguments,
                        ),
                        type="function",
                    )
                )
            else:
                tool_calls.append(
                    ToolCall(
                        id=call_id,
                        function=Function(
                            name=func_name,
                            arguments=func_arguments,
                        ),
                        type="function",
                    )
                )
        if stream:
            return chat_schema.StreamChoice(
                index=choice_idx,
                delta=chat_schema.StreamDelta(
                    role="assistant",
                    tool_calls=tool_calls,
                ),
                finish_reason=finish_reason,
            )
        return chat_schema.Choice(
            index=choice_idx,
            message=chat_schema.ResponseMessage(
                role="assistant",
                tool_calls=tool_calls,
            ),
            finish_reason=finish_reason,
        )

    @classmethod
    def model_to_chat(cls, resp, config):
        # Documentation: https://ai.google.dev/api/generate-content
        #
        # Example Response:
        # {
        #   "candidates": [
        #     {
        #       "content": {
        #         "parts": [
        #           {
        #             "text": "Blue is often seen as a calming and soothing color."
        #           }
        #         ]
        #       },
        #       "finishReason": "stop"
        #     }
        #   ],
        #   "usageMetadata": {
        #     "promptTokenCount": 10,
        #     "candidatesTokenCount": 10,
        #     "totalTokenCount": 20
        #   }
        # }
        choices = []
        for idx, candidate in enumerate(resp.get("candidates", [])):
            finish_reason = candidate.get("finishReason", "stop")
            if finish_reason == "MAX_TOKENS":
                finish_reason = "length"

            if parts := candidate.get("content", {}).get("parts", None):
                if parts[0].get("functionCall", None):
                    choices.append(
                        GeminiAdapter._convert_function_call_to_openai_choice(
                            parts, finish_reason, idx, False
                        )
                    )

                elif content := parts[0].get("text"):
                    choices.append(
                        chat_schema.Choice(
                            index=idx,
                            message=chat_schema.ResponseMessage(
                                role="assistant",
                                content=content,
                            ),
                            finish_reason=finish_reason,
                        )
                    )

        usage_metadata = resp.get("usageMetadata", {})

        return chat_schema.ResponsePayload(
            id=f"gemini-chat-{int(time.time())}",
            created=int(time.time()),
            object="chat.completion",
            model=config.model.name,
            choices=choices,
            usage=chat_schema.ChatUsage(
                prompt_tokens=usage_metadata.get("promptTokenCount", None),
                completion_tokens=usage_metadata.get("candidatesTokenCount", None),
                total_tokens=usage_metadata.get("totalTokenCount", None),
            ),
        )

    @classmethod
    def model_to_chat_streaming(
        cls, resp: dict[str, Any], config
    ) -> chat_schema.StreamResponsePayload:
        # Documentation: https://ai.google.dev/api/generate-content#method:-models.streamgeneratecontent
        #
        # Example Streaming Chunk:
        # {
        #   "candidates": [
        #     {
        #       "content": {
        #         "parts": [
        #           {
        #             "text": "Blue is often seen as a calming and soothing color."
        #           }
        #         ]
        #       },
        #       "finishReason": null
        #     }
        #   ],
        #   "id": "stream-id",
        #   "object": "chat.completion.chunk",
        #   "created": 1234567890,
        #   "model": "gemini-2.0-flash"
        # }
        choices = []
        for idx, cand in enumerate(resp.get("candidates", [])):
            parts = cand.get("content", {}).get("parts", [])
            finish_reason = cand.get("finishReason")

            if parts:
                if parts[0].get("functionCall"):
                    # for gemini model streaming response,
                    # the function call message is not split into chunks
                    # it still contains the full function call arguments data.
                    choices.append(
                        GeminiAdapter._convert_function_call_to_openai_choice(
                            parts, finish_reason, idx, True
                        )
                    )
                    continue

            delta_text = parts[0].get("text", "") if parts else ""
            choices.append(
                chat_schema.StreamChoice(
                    index=idx,
                    finish_reason=finish_reason,
                    delta=chat_schema.StreamDelta(
                        role="assistant",
                        content=delta_text,
                    ),
                )
            )
        current_time = int(time.time())

        return chat_schema.StreamResponsePayload(
            id=f"gemini-chat-stream-{current_time}",
            object="chat.completion.chunk",
            created=current_time,
            model=config.model.name,
            choices=choices,
        )

    @classmethod
    def completions_to_model(cls, payload, config):
        # Documentation: https://ai.google.dev/api/generate-content
        # Example payload for the completions API.
        #
        # {
        #     "prompt": "What is the world record for flapjack consumption in a single sitting?",
        #     "temperature": 0.1,
        #     "topP": 1,
        #     "stop": ["\n"],
        #     "n": 1,
        #     "max_tokens": 100,
        #     "top_k": 40,
        # }

        chat_payload = {"messages": [{"role": "user", "content": payload.pop("prompt")}], **payload}
        if system_message := payload.pop("system_prompt", None):
            chat_payload["messages"].insert(0, {"role": "system", "content": system_message})
        return cls.chat_to_model(chat_payload, config)

    @classmethod
    def model_to_completions(cls, resp, config):
        # Documentation: https://ai.google.dev/api/generate-content
        #
        # Example Response:
        # {
        #   "candidates": [
        #     {
        #       "content": {
        #         "parts": [
        #           {
        #             "text": "Blue is often seen as a calming and soothing color."
        #           }
        #         ]
        #       },
        #       "finishReason": "stop"
        #     }
        #   ],
        #   "usageMetadata": {
        #     "promptTokenCount": 10,
        #     "candidatesTokenCount": 10,
        #     "totalTokenCount": 20
        #   }
        # }
        choices = []

        for idx, candidate in enumerate(resp.get("candidates", [])):
            text = ""
            if parts := candidate.get("content", {}).get("parts", None):
                text = parts[0].get("text", None)
            if not text:
                continue

            finish_reason = candidate.get("finishReason", "stop")
            if finish_reason == "MAX_TOKENS":
                finish_reason = "length"

            choices.append(
                completions_schema.Choice(
                    index=idx,
                    text=text,
                    finish_reason=finish_reason,
                )
            )

        usage_metadata = resp.get("usageMetadata", {})

        return completions_schema.ResponsePayload(
            created=int(time.time()),
            object="text_completion",
            model=config.model.name,
            choices=choices,
            usage=completions_schema.CompletionsUsage(
                prompt_tokens=usage_metadata.get("promptTokenCount", None),
                completion_tokens=usage_metadata.get("candidatesTokenCount", None),
                total_tokens=usage_metadata.get("totalTokenCount", None),
            ),
        )

    @classmethod
    def model_to_completions_streaming(
        cls, resp: dict[str, Any], config
    ) -> completions_schema.StreamResponsePayload:
        # Documentation: https://ai.google.dev/api/generate-content#method:-models.streamgeneratecontent

        # Example SSE chunk for streaming completions:
        # {
        #   "candidates": [
        #     {
        #       "content": {
        #         "parts": [
        #           { "text": "Hello, world!" }
        #         ]
        #       },
        #       "finishReason": "stop"
        #     }
        #   ],
        #   "id": "gemini-completions-stream-1234567890",
        #   "object": "text_completion.chunk",
        #   "created": 1234567890,
        #   "model": "gemini-2.0-flash"
        # }
        choices = []
        for idx, cand in enumerate(resp.get("candidates", [])):
            parts = cand.get("content", {}).get("parts", [])
            delta_text = parts[0].get("text", "") if parts else ""
            choices.append(
                completions_schema.StreamChoice(
                    index=idx,
                    finish_reason=cand.get("finishReason"),
                    text=delta_text,
                )
            )
        current_time = int(time.time())

        return completions_schema.StreamResponsePayload(
            id=f"gemini-completions-stream-{current_time}",
            object="text_completion.chunk",
            created=current_time,
            model=config.model.name,
            choices=choices,
        )

    @classmethod
    def embeddings_to_model(cls, payload, config):
        # Example payload for the embedding API.
        # Documentation: https://ai.google.dev/api/embeddings#v1beta.ContentEmbedding
        #
        # {
        #     "requests": [
        #         {
        #             "model": "models/text-embedding-004",
        #             "content": {
        #                 "parts": [
        #                     {
        #                         "text": "What is the meaning of life?"
        #                     }
        #                 ]
        #             }
        #         },
        #         {
        #             "model": "models/text-embedding-004",
        #             "content": {
        #                 "parts": [
        #                     {
        #                         "text": "How much wood would a woodchuck chuck?"
        #                     }
        #                 ]
        #             }
        #         },
        #         {
        #             "model": "models/text-embedding-004",
        #             "content": {
        #                 "parts": [
        #                     {
        #                         "text": "How does the brain work?"
        #                     }
        #                 ]
        #             }
        #         }
        #     ]
        # }

        texts = payload["input"]
        if isinstance(texts, str):
            texts = [texts]
        return (
            {"content": {"parts": [{"text": texts[0]}]}}
            if len(texts) == 1
            else {
                "requests": [
                    {"model": f"models/{config.model.name}", "content": {"parts": [{"text": text}]}}
                    for text in texts
                ]
            }
        )

    @classmethod
    def model_to_embeddings(cls, resp, config):
        # Documentation: https://ai.google.dev/api/embeddings#v1beta.ContentEmbedding
        #
        # Example Response:
        # {
        #   "embeddings": [
        #     {
        #       "values": [
        #         3.25,
        #         0.7685547,
        #         2.65625,
        #         ...,
        #         -0.30126953,
        #         -2.3554688,
        #         1.2597656
        #       ]
        #     }
        #   ]
        # }

        data = [
            embeddings_schema.EmbeddingObject(embedding=item.get("values", []), index=i)
            for i, item in enumerate(resp.get("embeddings") or [resp.get("embedding", {})])
        ]

        # Create and return response payload directly
        return embeddings_schema.ResponsePayload(
            data=data,
            model=config.model.name,
            usage=embeddings_schema.EmbeddingsUsage(
                prompt_tokens=None,
                total_tokens=None,
            ),
        )


class GeminiProvider(BaseProvider):
    NAME = "Gemini"
    CONFIG_TYPE = GeminiConfig

    PASSTHROUGH_PROVIDER_PATHS = {
        PassthroughAction.GEMINI_GENERATE_CONTENT: "{model}:generateContent",
        PassthroughAction.GEMINI_STREAM_GENERATE_CONTENT: "{model}:streamGenerateContent?alt=sse",
    }

    def __init__(self, config: EndpointConfig) -> None:
        super().__init__(config)
        if config.model.config is None or not isinstance(config.model.config, GeminiConfig):
            raise TypeError(f"Unexpected config type {config.model.config}")
        self.gemini_config: GeminiConfig = config.model.config

    @property
    def headers(self):
        return {"x-goog-api-key": self.gemini_config.gemini_api_key}

    @property
    def base_url(self):
        return "https://generativelanguage.googleapis.com/v1beta/models"

    @property
    def adapter_class(self):
        return GeminiAdapter

    async def _request(self, path: str, payload: dict[str, Any]) -> dict[str, Any]:
        return await send_request(
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
        self.check_for_model_field(payload)

        embedding_payload = self.adapter_class.embeddings_to_model(payload, self.config)
        # Documentation: https://ai.google.dev/api/embeddings

        # Use the batch endpoint if payload contains "requests"
        if "requests" in embedding_payload:
            endpoint_suffix = ":batchEmbedContents"
        else:
            endpoint_suffix = ":embedContent"

        resp = await self._request(
            f"{self.config.model.name}{endpoint_suffix}",
            embedding_payload,
        )
        return self.adapter_class.model_to_embeddings(resp, self.config)

    async def completions(
        self, payload: completions_schema.RequestPayload
    ) -> completions_schema.ResponsePayload:
        from fastapi.encoders import jsonable_encoder

        payload = jsonable_encoder(payload, exclude_none=True)
        self.check_for_model_field(payload)

        completions_payload = self.adapter_class.completions_to_model(payload, self.config)
        # Documentation: https://ai.google.dev/api/generate-content

        resp = await self._request(
            f"{self.config.model.name}:generateContent",
            completions_payload,
        )

        return self.adapter_class.model_to_completions(resp, self.config)

    async def completions_stream(
        self, payload: completions_schema.RequestPayload
    ) -> AsyncIterable[completions_schema.StreamResponsePayload]:
        from fastapi.encoders import jsonable_encoder

        body = jsonable_encoder(payload, exclude_none=True)
        self.check_for_model_field(body)

        model_payload = self.adapter_class.completions_to_model(body, self.config)
        path = f"{self.config.model.name}:streamGenerateContent?alt=sse"

        # Documentation: https://ai.google.dev/api/generate-content#method:-models.streamgeneratecontent
        sse = send_stream_request(
            headers=self.headers, base_url=self.base_url, path=path, payload=model_payload
        )

        async for raw in handle_incomplete_chunks(sse):
            text = raw.decode("utf-8", errors="ignore").strip()
            if not text.startswith("data:"):
                continue
            data = strip_sse_prefix(text)
            if data == "[DONE]":
                break
            resp = json.loads(data)
            yield self.adapter_class.model_to_completions_streaming(resp, self.config)

    async def chat(self, payload: chat_schema.RequestPayload) -> chat_schema.ResponsePayload:
        from fastapi.encoders import jsonable_encoder

        payload = jsonable_encoder(payload, exclude_none=True)
        self.check_for_model_field(payload)

        chat_payload = self.adapter_class.chat_to_model(payload, self.config)
        # Documentation: https://ai.google.dev/api/generate-content

        resp = await self._request(
            f"{self.config.model.name}:generateContent",
            chat_payload,
        )

        return self.adapter_class.model_to_chat(resp, self.config)

    async def chat_stream(
        self, payload: chat_schema.RequestPayload
    ) -> AsyncIterable[chat_schema.StreamResponsePayload]:
        from fastapi.encoders import jsonable_encoder

        body = jsonable_encoder(payload, exclude_none=True)
        self.check_for_model_field(body)

        body = self.adapter_class.chat_to_model(body, self.config)

        # Documentation: https://ai.google.dev/api/generate-content#method:-models.streamgeneratecontent
        sse = send_stream_request(
            headers=self.headers,
            base_url=self.base_url,
            path=f"{self.config.model.name}:streamGenerateContent?alt=sse",
            payload=body,
        )

        async for raw in handle_incomplete_chunks(sse):
            text = raw.decode("utf-8", errors="ignore").strip()
            if not text.startswith("data:"):
                continue
            data = strip_sse_prefix(text)
            if data == "[DONE]":
                break
            resp = json.loads(data)
            yield self.adapter_class.model_to_chat_streaming(resp, self.config)

    async def passthrough(
        self, action: PassthroughAction, payload: dict[str, Any]
    ) -> dict[str, Any] | AsyncIterable[bytes]:
        provider_path = self._validate_passthrough_action(action)
        provider_path = provider_path.format(model=self.config.model.name)

        is_streaming = action == PassthroughAction.GEMINI_STREAM_GENERATE_CONTENT

        if is_streaming:
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

---[FILE: huggingface.py]---
Location: mlflow-master/mlflow/gateway/providers/huggingface.py
Signals: FastAPI

```python
import time
from typing import Any

from mlflow.gateway.config import EndpointConfig, HuggingFaceTextGenerationInferenceConfig
from mlflow.gateway.exceptions import AIGatewayException
from mlflow.gateway.providers.base import BaseProvider
from mlflow.gateway.providers.utils import (
    rename_payload_keys,
    send_request,
)
from mlflow.gateway.schemas import completions


class HFTextGenerationInferenceServerProvider(BaseProvider):
    NAME = "Hugging Face Text Generation Inference"
    CONFIG_TYPE = HuggingFaceTextGenerationInferenceConfig

    def __init__(self, config: EndpointConfig) -> None:
        super().__init__(config)
        if config.model.config is None or not isinstance(
            config.model.config, HuggingFaceTextGenerationInferenceConfig
        ):
            raise TypeError(f"Unexpected config type {config.model.config}")
        self.huggingface_config: HuggingFaceTextGenerationInferenceConfig = config.model.config
        self.headers = {"Content-Type": "application/json"}

    async def _request(self, path: str, payload: dict[str, Any]) -> dict[str, Any]:
        return await send_request(
            headers=self.headers,
            base_url=self.huggingface_config.hf_server_url,
            path=path,
            payload=payload,
        )

    async def completions(self, payload: completions.RequestPayload) -> completions.ResponsePayload:
        from fastapi.encoders import jsonable_encoder

        payload = jsonable_encoder(payload, exclude_none=True)
        self.check_for_model_field(payload)
        key_mapping = {
            "max_tokens": "max_new_tokens",
        }
        for k1, k2 in key_mapping.items():
            if k2 in payload:
                raise AIGatewayException(
                    status_code=422, detail=f"Invalid parameter {k2}. Use {k1} instead."
                )

        # HF TGI does not support generating multiple candidates.
        n = payload.pop("n", 1)
        if n != 1:
            raise AIGatewayException(
                status_code=422,
                detail="'n' must be '1' for the Text Generation Inference provider."
                f"Received value: '{n}'.",
            )
        prompt = payload.pop("prompt")
        parameters = rename_payload_keys(payload, key_mapping)

        # The range of HF TGI's temperature is 0-100, but ours is 0-2, so we multiply
        # by 50
        payload["temperature"] = 50 * payload["temperature"]
        # HF TGI does not support 0 temperature
        parameters["temperature"] = max(payload["temperature"], 1e-3)
        parameters["details"] = True
        parameters["decoder_input_details"] = True

        final_payload = {"inputs": prompt, "parameters": parameters}

        resp = await self._request(
            "generate",
            final_payload,
        )

        # Example Response:
        # Documentation: https://huggingface.github.io/text-generation-inference/#/Text%20Generation%20Inference/compat_generate
        # {'details': {'best_of_sequences': [{'finish_reason': 'length',
        #     'generated_text': 'test',
        #     'generated_tokens': 1,
        #     'prefill': [{'id': 0, 'logprob': -0.34, 'text': 'test'}],
        #     'seed': 42,
        #     'tokens': [{'id': 0, 'logprob': -0.34, 'special': False, 'text': 'test'}],
        #     'top_tokens': [[{'id': 0,
        #     'logprob': -0.34,
        #     'special': False,
        #     'text': 'test'}]]}],
        # 'finish_reason': 'length',
        # 'generated_tokens': 1,
        # 'prefill': [{'id': 0, 'logprob': -0.34, 'text': 'test'}],
        # 'seed': 42,
        # 'tokens': [{'id': 0, 'logprob': -0.34, 'special': False, 'text': 'test'}],
        # 'top_tokens': [[{'id': 0,
        #     'logprob': -0.34,
        #     'special': False,
        #     'text': 'test'}]]},
        # 'generated_text': 'test'}
        output_tokens = resp["details"]["generated_tokens"]
        input_tokens = len(resp["details"]["prefill"])
        return completions.ResponsePayload(
            created=int(time.time()),
            object="text_completion",
            model=self.config.model.name,
            choices=[
                completions.Choice(
                    index=0,
                    text=resp["generated_text"],
                    finish_reason=resp["details"]["finish_reason"],
                )
            ],
            usage=completions.CompletionsUsage(
                prompt_tokens=input_tokens,
                completion_tokens=output_tokens,
                total_tokens=input_tokens + output_tokens,
            ),
        )
```

--------------------------------------------------------------------------------

---[FILE: litellm.py]---
Location: mlflow-master/mlflow/gateway/providers/litellm.py
Signals: FastAPI

```python
from __future__ import annotations

from typing import Any, AsyncIterable

from mlflow.gateway.config import EndpointConfig, LiteLLMConfig
from mlflow.gateway.providers.base import BaseProvider, ProviderAdapter
from mlflow.gateway.schemas import chat, embeddings


class LiteLLMAdapter(ProviderAdapter):
    @classmethod
    def _get_litellm_model_name(cls, config: EndpointConfig) -> str:
        litellm_config = config.model.config
        if litellm_config.litellm_provider:
            return f"{litellm_config.litellm_provider}/{config.model.name}"
        return config.model.name

    @classmethod
    def chat_to_model(cls, payload: dict[str, Any], config: EndpointConfig) -> dict[str, Any]:
        return {"model": cls._get_litellm_model_name(config), **payload}

    @classmethod
    def embeddings_to_model(cls, payload: dict[str, Any], config: EndpointConfig) -> dict[str, Any]:
        return {"model": cls._get_litellm_model_name(config), **payload}

    @classmethod
    def model_to_chat(cls, resp: dict[str, Any], config: EndpointConfig) -> chat.ResponsePayload:
        return chat.ResponsePayload.model_validate(resp)

    @classmethod
    def model_to_chat_streaming(
        cls, resp: dict[str, Any], config: EndpointConfig
    ) -> chat.StreamResponsePayload:
        return chat.StreamResponsePayload.model_validate(resp)

    @classmethod
    def model_to_embeddings(
        cls, resp: dict[str, Any], config: EndpointConfig
    ) -> embeddings.ResponsePayload:
        return embeddings.ResponsePayload.model_validate(resp)


class LiteLLMProvider(BaseProvider):
    """
    Provider that uses LiteLLM library to support any LLM provider.
    This serves as a fallback for providers not natively supported.
    """

    NAME = "LiteLLM"
    CONFIG_TYPE = LiteLLMConfig

    def __init__(self, config: EndpointConfig) -> None:
        super().__init__(config)
        if config.model.config is None or not isinstance(config.model.config, LiteLLMConfig):
            raise TypeError(f"Unexpected config type {config.model.config}")
        self.litellm_config: LiteLLMConfig = config.model.config

    @property
    def adapter_class(self):
        return LiteLLMAdapter

    def _build_litellm_kwargs(self, payload: dict[str, Any]) -> dict[str, Any]:
        kwargs = {**payload}

        if self.litellm_config.litellm_api_key:
            kwargs["api_key"] = self.litellm_config.litellm_api_key

        if self.litellm_config.litellm_api_base:
            kwargs["api_base"] = self.litellm_config.litellm_api_base
        return kwargs

    async def chat(self, payload: chat.RequestPayload) -> chat.ResponsePayload:
        import litellm
        from fastapi.encoders import jsonable_encoder

        payload_dict = jsonable_encoder(payload, exclude_none=True)
        self.check_for_model_field(payload_dict)

        kwargs = self._build_litellm_kwargs(
            self.adapter_class.chat_to_model(payload_dict, self.config)
        )

        response = await litellm.acompletion(**kwargs)

        # Convert to dict for adapter processing
        resp_dict = {
            "id": response.id,
            "object": response.object,
            "created": response.created,
            "model": response.model,
            "choices": [
                {
                    "index": choice.index,
                    "message": {
                        "role": choice.message.role,
                        "content": choice.message.content,
                        "tool_calls": (
                            [
                                {
                                    "id": tc.id,
                                    "type": tc.type,
                                    "function": {
                                        "name": tc.function.name,
                                        "arguments": tc.function.arguments,
                                    },
                                }
                                for tc in choice.message.tool_calls
                            ]
                            if choice.message.tool_calls
                            else None
                        ),
                    },
                    "finish_reason": choice.finish_reason,
                }
                for choice in response.choices
            ],
            "usage": {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens,
            },
        }

        return self.adapter_class.model_to_chat(resp_dict, self.config)

    async def chat_stream(
        self, payload: chat.RequestPayload
    ) -> AsyncIterable[chat.StreamResponsePayload]:
        import litellm
        from fastapi.encoders import jsonable_encoder

        payload_dict = jsonable_encoder(payload, exclude_none=True)
        self.check_for_model_field(payload_dict)

        kwargs = self._build_litellm_kwargs(
            self.adapter_class.chat_to_model(payload_dict, self.config)
        )
        kwargs["stream"] = True

        response = await litellm.acompletion(**kwargs)

        async for chunk in response:
            # Convert chunk to dict for adapter processing
            resp_dict = {
                "id": chunk.id,
                "object": chunk.object,
                "created": chunk.created,
                "model": chunk.model,
                "choices": [
                    {
                        "index": choice.index,
                        "finish_reason": choice.finish_reason,
                        "delta": {
                            "role": getattr(choice.delta, "role", None),
                            "content": getattr(choice.delta, "content", None),
                            "tool_calls": (
                                [
                                    {
                                        "index": tc_idx,
                                        "id": getattr(tc, "id", None),
                                        "type": getattr(tc, "type", None),
                                        "function": {
                                            "name": getattr(tc.function, "name", None),
                                            "arguments": getattr(tc.function, "arguments", None),
                                        }
                                        if hasattr(tc, "function")
                                        else None,
                                    }
                                    for tc_idx, tc in enumerate(choice.delta.tool_calls)
                                ]
                                if getattr(choice.delta, "tool_calls", None)
                                else None
                            ),
                        },
                    }
                    for choice in chunk.choices
                ],
            }

            yield self.adapter_class.model_to_chat_streaming(resp_dict, self.config)

    async def embeddings(self, payload: embeddings.RequestPayload) -> embeddings.ResponsePayload:
        import litellm
        from fastapi.encoders import jsonable_encoder

        payload_dict = jsonable_encoder(payload, exclude_none=True)
        self.check_for_model_field(payload_dict)

        kwargs = self._build_litellm_kwargs(
            self.adapter_class.embeddings_to_model(payload_dict, self.config)
        )

        response = await litellm.aembedding(**kwargs)

        # Convert to dict for adapter processing
        resp_dict = {
            "data": [
                {"embedding": data["embedding"], "index": idx}
                for idx, data in enumerate(response.data)
            ],
            "model": response.model,
            "usage": {
                "prompt_tokens": response.usage.prompt_tokens,
                "total_tokens": response.usage.total_tokens,
            },
        }

        return self.adapter_class.model_to_embeddings(resp_dict, self.config)
```

--------------------------------------------------------------------------------

````
