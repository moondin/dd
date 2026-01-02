---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 264
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 264 of 991)

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

---[FILE: mistral.py]---
Location: mlflow-master/mlflow/gateway/providers/mistral.py
Signals: FastAPI

```python
import time
from typing import Any

from mlflow.gateway.config import EndpointConfig, MistralConfig
from mlflow.gateway.providers.base import BaseProvider, ProviderAdapter
from mlflow.gateway.providers.utils import send_request
from mlflow.gateway.schemas import chat, completions, embeddings


class MistralAdapter(ProviderAdapter):
    @classmethod
    def model_to_completions(cls, resp, config):
        # Response example (https://docs.mistral.ai/api/#operation/createChatCompletion)
        # ```
        # {
        #   "id": "string",
        #   "object": "string",
        #   "created": "integer",
        #   "model": "string",
        #   "choices": [
        #     {
        #       "index": "integer",
        #       "message": {
        #           "role": "string",
        #           "content": "string"
        #       },
        #       "finish_reason": "string",
        #     }
        #   ],
        #   "usage":
        #   {
        #       "prompt_tokens": "integer",
        #       "completion_tokens": "integer",
        #       "total_tokens": "integer",
        #   }
        # }
        # ```
        return completions.ResponsePayload(
            created=int(time.time()),
            object="text_completion",
            model=config.model.name,
            choices=[
                completions.Choice(
                    index=idx,
                    text=c["message"]["content"],
                    finish_reason=c["finish_reason"],
                )
                for idx, c in enumerate(resp["choices"])
            ],
            usage=completions.CompletionsUsage(
                prompt_tokens=resp["usage"]["prompt_tokens"],
                completion_tokens=resp["usage"]["completion_tokens"],
                total_tokens=resp["usage"]["total_tokens"],
            ),
        )

    @classmethod
    def model_to_chat(cls, resp, config):
        # Response example (https://docs.mistral.ai/api/#operation/createChatCompletion)
        return chat.ResponsePayload(
            id=resp["id"],
            object=resp["object"],
            created=resp["created"],
            model=resp["model"],
            choices=[
                chat.Choice(
                    index=idx,
                    message=chat.ResponseMessage(
                        role=c["message"]["role"],
                        content=c["message"].get("content"),
                        tool_calls=(
                            (calls := c["message"].get("tool_calls"))
                            and [chat.ToolCall(**c) for c in calls]
                        ),
                    ),
                    finish_reason=c.get("finish_reason"),
                )
                for idx, c in enumerate(resp["choices"])
            ],
            usage=chat.ChatUsage(
                prompt_tokens=resp["usage"]["prompt_tokens"],
                completion_tokens=resp["usage"]["completion_tokens"],
                total_tokens=resp["usage"]["total_tokens"],
            ),
        )

    @classmethod
    def model_to_embeddings(cls, resp, config):
        # Response example (https://docs.mistral.ai/api/#operation/createEmbedding):
        # ```
        # {
        #   "id": "string",
        #   "object": "string",
        #   "data": [
        #     {
        #       "object": "string",
        #       "embedding":
        #       [
        #           float,
        #           float
        #       ]
        #       "index": "integer",
        #     }
        #   ],
        #   "model": "string",
        #   "usage":
        #   {
        #       "prompt_tokens": "integer",
        #       "total_tokens": "integer",
        #   }
        # }
        # ```
        return embeddings.ResponsePayload(
            data=[
                embeddings.EmbeddingObject(
                    embedding=data["embedding"],
                    index=data["index"],
                )
                for data in resp["data"]
            ],
            model=config.model.name,
            usage=embeddings.EmbeddingsUsage(
                prompt_tokens=resp["usage"]["prompt_tokens"],
                total_tokens=resp["usage"]["total_tokens"],
            ),
        )

    @classmethod
    def completions_to_model(cls, payload, config):
        payload["model"] = config.model.name
        payload.pop("stop", None)
        payload.pop("n", None)
        payload["messages"] = [{"role": "user", "content": payload.pop("prompt")}]

        # The range of Mistral's temperature is 0-1, but ours is 0-2, so we scale it.
        if "temperature" in payload:
            payload["temperature"] = 0.5 * payload["temperature"]

        return payload

    @classmethod
    def chat_to_model(cls, payload, config):
        return {"model": config.model.name, **payload}

    @classmethod
    def embeddings_to_model(cls, payload, config):
        return {"model": config.model.name, **payload}


class MistralProvider(BaseProvider):
    NAME = "Mistral"
    CONFIG_TYPE = MistralConfig

    def __init__(self, config: EndpointConfig) -> None:
        super().__init__(config)
        if config.model.config is None or not isinstance(config.model.config, MistralConfig):
            raise TypeError(f"Unexpected config type {config.model.config}")
        self.mistral_config: MistralConfig = config.model.config

    @property
    def headers(self) -> dict[str, str]:
        return {"Authorization": f"Bearer {self.mistral_config.mistral_api_key}"}

    @property
    def base_url(self) -> str:
        return "https://api.mistral.ai/v1"

    @property
    def adapter_class(self) -> type[ProviderAdapter]:
        return MistralAdapter

    def get_endpoint_url(self, route_type: str) -> str:
        if route_type == "llm/v1/chat":
            return f"{self.base_url}/chat/completions"
        else:
            raise ValueError(f"Invalid route type {route_type}")

    async def _request(self, path: str, payload: dict[str, Any]) -> dict[str, Any]:
        return await send_request(
            headers=self.headers,
            base_url=self.base_url,
            path=path,
            payload=payload,
        )

    async def completions(self, payload: completions.RequestPayload) -> completions.ResponsePayload:
        from fastapi.encoders import jsonable_encoder

        payload = jsonable_encoder(payload, exclude_none=True)
        self.check_for_model_field(payload)
        resp = await self._request(
            "chat/completions",
            MistralAdapter.completions_to_model(payload, self.config),
        )
        return MistralAdapter.model_to_completions(resp, self.config)

    async def embeddings(self, payload: embeddings.RequestPayload) -> embeddings.ResponsePayload:
        from fastapi.encoders import jsonable_encoder

        payload = jsonable_encoder(payload, exclude_none=True)
        self.check_for_model_field(payload)
        resp = await self._request(
            "embeddings",
            MistralAdapter.embeddings_to_model(payload, self.config),
        )
        return MistralAdapter.model_to_embeddings(resp, self.config)
```

--------------------------------------------------------------------------------

---[FILE: mlflow.py]---
Location: mlflow-master/mlflow/gateway/providers/mlflow.py
Signals: FastAPI, Pydantic

```python
import time

from pydantic import BaseModel, StrictFloat, StrictStr, ValidationError, field_validator

from mlflow.gateway.config import EndpointConfig, MlflowModelServingConfig
from mlflow.gateway.constants import MLFLOW_SERVING_RESPONSE_KEY
from mlflow.gateway.exceptions import AIGatewayException
from mlflow.gateway.providers.base import BaseProvider
from mlflow.gateway.providers.utils import send_request
from mlflow.gateway.schemas import chat, completions, embeddings


class ServingTextResponse(BaseModel):
    predictions: list[StrictStr]

    @field_validator("predictions", mode="before")
    def extract_choices(cls, predictions):
        if isinstance(predictions, list) and not predictions:
            raise ValueError("The input list is empty")
        if isinstance(predictions, dict):
            if "choices" not in predictions and len(predictions) > 1:
                raise ValueError(
                    "The dict format is invalid for this route type. Ensure the served model "
                    "returns a dict key containing 'choices'"
                )
            if len(predictions) == 1:
                predictions = next(iter(predictions.values()))
            else:
                predictions = predictions.get("choices", predictions)
            if not predictions:
                raise ValueError("The input list is empty")
        return predictions


class EmbeddingsResponse(BaseModel):
    predictions: list[list[StrictFloat]]

    @field_validator("predictions", mode="before")
    def validate_predictions(cls, predictions):
        if isinstance(predictions, list) and not predictions:
            raise ValueError("The input list is empty")
        if isinstance(predictions, list) and all(
            isinstance(item, list) and not item for item in predictions
        ):
            raise ValueError("One or more lists in the returned prediction response are empty")
        elif all(isinstance(item, float) for item in predictions):
            return [predictions]
        else:
            return predictions


class MlflowModelServingProvider(BaseProvider):
    NAME = "MLflow Model Serving"
    CONFIG_TYPE = MlflowModelServingConfig

    def __init__(self, config: EndpointConfig) -> None:
        super().__init__(config)
        if config.model.config is None or not isinstance(
            config.model.config, MlflowModelServingConfig
        ):
            raise TypeError(f"Invalid config type {config.model.config}")
        self.mlflow_config: MlflowModelServingConfig = config.model.config
        self.headers = {"Content-Type": "application/json"}

    @staticmethod
    def _extract_mlflow_response_key(response):
        if MLFLOW_SERVING_RESPONSE_KEY not in response:
            raise AIGatewayException(
                status_code=502,
                detail=f"The response is missing the required key: {MLFLOW_SERVING_RESPONSE_KEY}.",
            )
        return response[MLFLOW_SERVING_RESPONSE_KEY]

    @staticmethod
    def _process_payload(payload, key):
        from fastapi.encoders import jsonable_encoder

        payload = jsonable_encoder(payload, exclude_none=True)

        input_data = payload.pop(key, None)
        request_payload = {"inputs": input_data if isinstance(input_data, list) else [input_data]}

        if payload:
            request_payload["params"] = payload

        return request_payload

    @staticmethod
    def _process_completions_response_for_mlflow_serving(response):
        try:
            validated_response = ServingTextResponse(**response)
            inference_data = validated_response.predictions
        except ValidationError as e:
            raise AIGatewayException(status_code=502, detail=str(e))

        return [
            completions.Choice(index=idx, text=entry, finish_reason=None)
            for idx, entry in enumerate(inference_data)
        ]

    async def completions(self, payload: completions.RequestPayload) -> completions.ResponsePayload:
        # Example request to MLflow REST API server for completions:
        # {
        #     "inputs": ["hi", "hello", "bye"],
        #     "params": {
        #         "temperature": 0.5,
        #         "top_k": 3,
        #     }
        # }

        resp = await send_request(
            headers=self.headers,
            base_url=self.mlflow_config.model_server_url,
            path="invocations",
            payload=self._process_payload(payload, "prompt"),
        )

        # Example response:
        # {"predictions": ["hello", "hi", "goodbye"]}

        return completions.ResponsePayload(
            created=int(time.time()),
            object="text_completion",
            model=self.config.model.name,
            choices=self._process_completions_response_for_mlflow_serving(resp),
            usage=completions.CompletionsUsage(
                prompt_tokens=None,
                completion_tokens=None,
                total_tokens=None,
            ),
        )

    def _process_chat_response_for_mlflow_serving(self, response):
        try:
            validated_response = ServingTextResponse(**response)
            inference_data = validated_response.predictions
        except ValidationError as e:
            raise AIGatewayException(status_code=502, detail=str(e))

        return [
            {"message": {"role": "assistant", "content": entry}, "metadata": {}}
            for entry in inference_data
        ]

    async def chat(self, payload: chat.RequestPayload) -> chat.ResponsePayload:
        # Example request to MLflow REST API for chat:
        # {
        #     "inputs": ["question"],
        #     "params": ["temperature": 0.2],
        # }

        payload = self._process_payload(payload, "messages")

        query_count = len(payload["inputs"])
        if query_count > 1:
            raise AIGatewayException(
                status_code=422,
                detail="MLflow chat models are only capable of processing a single query at a "
                f"time. The request submitted consists of {query_count} queries.",
            )

        payload["inputs"] = [payload["inputs"][0]["content"]]

        resp = await send_request(
            headers=self.headers,
            base_url=self.mlflow_config.model_server_url,
            path="invocations",
            payload=payload,
        )

        # Example response:
        # {"predictions": ["answer"]}

        return chat.ResponsePayload(
            created=int(time.time()),
            model=self.config.model.name,
            choices=[
                chat.Choice(
                    index=idx,
                    message=chat.ResponseMessage(
                        role=c["message"]["role"], content=c["message"]["content"]
                    ),
                    finish_reason=None,
                )
                for idx, c in enumerate(self._process_chat_response_for_mlflow_serving(resp))
            ],
            usage=chat.ChatUsage(
                prompt_tokens=None,
                completion_tokens=None,
                total_tokens=None,
            ),
        )

    def _process_embeddings_response_for_mlflow_serving(self, response):
        try:
            validated_response = EmbeddingsResponse(**response)
            inference_data = validated_response.predictions
        except ValidationError as e:
            raise AIGatewayException(status_code=502, detail=str(e))

        return inference_data

    async def embeddings(self, payload: embeddings.RequestPayload) -> embeddings.ResponsePayload:
        # Example request to MLflow REST API server for embeddings:
        # {
        #     "inputs": ["a sentence", "another sentence"],
        #     "params": {
        #         "output_value": "token_embeddings",
        #     }
        # }

        resp = await send_request(
            headers=self.headers,
            base_url=self.mlflow_config.model_server_url,
            path="invocations",
            payload=self._process_payload(payload, "input"),
        )

        # Example response:
        # {"predictions": [[0.100, -0.234, 0.002, ...], [0.222, -0.111, 0.134, ...]]}

        return embeddings.ResponsePayload(
            data=[
                embeddings.EmbeddingObject(
                    embedding=embedding,
                    index=idx,
                )
                for idx, embedding in enumerate(
                    self._process_embeddings_response_for_mlflow_serving(resp)
                )
            ],
            model=self.config.model.name,
            usage=embeddings.EmbeddingsUsage(
                prompt_tokens=None,
                total_tokens=None,
            ),
        )
```

--------------------------------------------------------------------------------

---[FILE: mosaicml.py]---
Location: mlflow-master/mlflow/gateway/providers/mosaicml.py
Signals: FastAPI

```python
import time
import warnings
from contextlib import contextmanager
from typing import Any

from mlflow.exceptions import MlflowException
from mlflow.gateway.config import EndpointConfig, MosaicMLConfig
from mlflow.gateway.exceptions import AIGatewayException
from mlflow.gateway.providers.base import BaseProvider
from mlflow.gateway.providers.utils import rename_payload_keys, send_request
from mlflow.gateway.schemas import chat, completions, embeddings


class MosaicMLProvider(BaseProvider):
    NAME = "MosaicML"
    CONFIG_TYPE = MosaicMLConfig

    def __init__(self, config: EndpointConfig) -> None:
        super().__init__(config)
        warnings.warn(
            "MosaicML provider is deprecated and will be removed in a future MLflow version.",
            category=FutureWarning,
            stacklevel=2,
        )
        if config.model.config is None or not isinstance(config.model.config, MosaicMLConfig):
            raise TypeError(f"Unexpected config type {config.model.config}")
        self.mosaicml_config: MosaicMLConfig = config.model.config

    async def _request(self, model: str, payload: dict[str, Any]) -> dict[str, Any]:
        headers = {"Authorization": f"{self.mosaicml_config.mosaicml_api_key}"}
        return await send_request(
            headers=headers,
            base_url=self.mosaicml_config.mosaicml_api_base
            or "https://models.hosted-on.mosaicml.hosting",
            path=model + "/v1/predict",
            payload=payload,
        )

    # NB: as this parser performs no blocking operations, we are intentionally not defining it
    # as async due to the overhead of spawning an additional thread if we did.
    @staticmethod
    def _parse_chat_messages_to_prompt(messages: list[chat.RequestMessage]) -> str:
        """
        This parser is based on the format described in
        https://huggingface.co/blog/llama2#how-to-prompt-llama-2 .
        The expected format is:
            "<s>[INST] <<SYS>>
            {{ system_prompt }}
            <</SYS>>

            {{ user_msg_1 }} [/INST] {{ model_answer_1 }} </s>
            <s>[INST] {{ user_msg_2 }} [/INST]"
        """
        prompt = "<s>"  # Always start with an opening <s> tag
        for m in messages:
            if m.role in {"system", "user"}:
                inst = m.content

                # Wrap system messages in <<SYS>> tags
                if m.role == "system":
                    inst = f"<<SYS>> {inst} <</SYS>>"

                # Close the [INST] tag
                inst += " [/INST]"

                # If the previous message was a system/user message,
                # remove previous closing [/INST] tag
                if prompt.endswith("[/INST]"):
                    prompt = prompt[:-7]
                # Otherwise, add an opening [INST] tag
                else:
                    inst = f"[INST] {inst}"
                prompt += inst
            elif m.role == "assistant":
                # Add statement closing/opening tags by default
                prompt += f" {m.content} </s><s>"
            else:
                raise MlflowException.invalid_parameter_value(
                    f"Invalid role {m.role} inputted. Must be one of 'system', "
                    "'user', or 'assistant'.",
                )

        # Remove the last </s><s> tags if they exist to allow for
        # assistant completion prompts.
        return prompt.removesuffix("</s><s>")

    async def chat(self, payload: chat.RequestPayload) -> chat.ResponsePayload:
        from fastapi.encoders import jsonable_encoder

        # Extract the List[RequestMessage] from the RequestPayload
        messages = payload.messages
        payload = jsonable_encoder(payload, exclude_none=True)
        # remove the messages from the remaining configuration items
        payload.pop("messages", None)
        self.check_for_model_field(payload)
        key_mapping = {
            "max_tokens": "max_new_tokens",
        }
        for k1, k2 in key_mapping.items():
            if k2 in payload:
                raise AIGatewayException(
                    status_code=422, detail=f"Invalid parameter {k2}. Use {k1} instead."
                )
        payload = rename_payload_keys(payload, key_mapping)

        # Handle 'prompt' field in payload
        try:
            prompt = [self._parse_chat_messages_to_prompt(messages)]
        except MlflowException as e:
            raise AIGatewayException(
                status_code=422, detail=f"An invalid request structure was submitted. {e.message}"
            )
        # Construct final payload structure
        final_payload = {"inputs": prompt, "parameters": payload}

        # Input data structure for Mosaic Text Completion endpoint
        #
        # {"inputs": [prompt],
        #  {
        #    "parameters": {
        #      "temperature": 0.2
        #    }
        #   }
        # }
        with custom_token_allowance_exceeded_handling():
            resp = await self._request(
                self.config.model.name,
                final_payload,
            )
        # Response example
        # (https://docs.mosaicml.com/en/latest/inference.html#text-completion-models)
        # ```
        # {
        #   "outputs": [
        #     "string",
        #   ],
        # }
        # ```
        return chat.ResponsePayload(
            created=int(time.time()),
            model=self.config.model.name,
            choices=[
                chat.Choice(
                    index=idx,
                    message=chat.ResponseMessage(role="assistant", content=c),
                    finish_reason=None,
                )
                for idx, c in enumerate(resp["outputs"])
            ],
            usage=chat.ChatUsage(
                prompt_tokens=None,
                completion_tokens=None,
                total_tokens=None,
            ),
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
        payload = rename_payload_keys(payload, key_mapping)

        # Handle 'prompt' field in payload
        prompt = payload.pop("prompt")
        if isinstance(prompt, str):
            prompt = [prompt]

        # Construct final payload structure
        final_payload = {"inputs": prompt, "parameters": payload}

        # Input data structure for Mosaic Text Completion endpoint
        #
        # {"inputs": [prompt],
        #  {
        #    "parameters": {
        #      "temperature": 0.2
        #    }
        #   }
        # }

        with custom_token_allowance_exceeded_handling():
            resp = await self._request(
                self.config.model.name,
                final_payload,
            )

        # Response example
        # (https://docs.mosaicml.com/en/latest/inference.html#text-completion-models)
        # ```
        # {
        #   "outputs": [
        #     "string",
        #   ],
        # }
        # ```
        return completions.ResponsePayload(
            created=int(time.time()),
            object="text_completion",
            model=self.config.model.name,
            choices=[
                completions.Choice(
                    index=idx,
                    text=c,
                    finish_reason=None,
                )
                for idx, c in enumerate(resp["outputs"])
            ],
            usage=completions.CompletionsUsage(
                prompt_tokens=None,
                completion_tokens=None,
                total_tokens=None,
            ),
        )

    async def embeddings(self, payload: embeddings.RequestPayload) -> embeddings.ResponsePayload:
        from fastapi.encoders import jsonable_encoder

        payload = jsonable_encoder(payload, exclude_none=True)
        self.check_for_model_field(payload)
        key_mapping = {"input": "inputs"}
        for k1, k2 in key_mapping.items():
            if k2 in payload:
                raise AIGatewayException(
                    status_code=422, detail=f"Invalid parameter {k2}. Use {k1} instead."
                )
        payload = rename_payload_keys(payload, key_mapping)

        # Ensure 'inputs' is a list of strings
        if isinstance(payload["inputs"], str):
            payload["inputs"] = [payload["inputs"]]

        resp = await self._request(
            self.config.model.name,
            payload,
        )
        # Response example
        # (https://docs.mosaicml.com/en/latest/inference.html#text-embedding-models):
        # ```
        # {
        #   "outputs": [
        #     [
        #       3.25,
        #       0.7685547,
        #       2.65625,
        #       ...
        #       -0.30126953,
        #       -2.3554688,
        #       1.2597656
        #     ]
        #   ]
        # }
        # ```
        return embeddings.ResponsePayload(
            data=[
                embeddings.EmbeddingObject(
                    embedding=output,
                    index=idx,
                )
                for idx, output in enumerate(resp["outputs"])
            ],
            model=self.config.model.name,
            usage=embeddings.EmbeddingsUsage(
                prompt_tokens=None,
                total_tokens=None,
            ),
        )


@contextmanager
def custom_token_allowance_exceeded_handling():
    """
    Context manager handler for specific error messages that are incorrectly set as server-side
    errors, but are in actuality an issue with the request sent to the external provider.
    """
    from fastapi import HTTPException

    try:
        yield
    except HTTPException as e:
        status_code = e.status_code
        detail = e.detail or {}

        if (
            status_code == 500
            and detail
            and any(
                detail.get("message", "").startswith(x)
                for x in (
                    "Error: max output tokens is limited to",
                    "Error: prompt token count",
                )
            )
        ):
            raise HTTPException(status_code=422, detail=detail)
        else:
            raise
```

--------------------------------------------------------------------------------

````
