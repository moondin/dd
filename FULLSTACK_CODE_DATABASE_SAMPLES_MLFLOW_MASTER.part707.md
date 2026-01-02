---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 707
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 707 of 991)

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

---[FILE: utils.py]---
Location: mlflow-master/mlflow/tracing/export/utils.py

```python
"""
Utility functions for prompt linking in trace exporters.
"""

import logging
import threading
import uuid
from typing import Sequence

from mlflow.entities.model_registry import PromptVersion
from mlflow.tracing.client import TracingClient

_logger = logging.getLogger(__name__)


def try_link_prompts_to_trace(
    client: TracingClient,
    trace_id: str,
    prompts: Sequence[PromptVersion],
    synchronous: bool = True,
) -> None:
    """
    Attempt to link prompt versions to a trace with graceful error handling.

    This function provides a reusable way to link prompts to traces with consistent
    error handling across different exporters. Errors are caught and logged but do
    not propagate, ensuring that prompt linking failures don't affect trace export.

    Args:
        client: The TracingClient instance to use for linking.
        trace_id: The ID of the trace to link prompts to.
        prompts: Sequence of PromptVersion objects to link.
        synchronous: If True, run the linking synchronously. If False, run in a separate thread.
    """
    if not prompts:
        return

    if synchronous:
        _link_prompts_sync(client, trace_id, prompts)
    else:
        threading.Thread(
            target=_link_prompts_sync,
            args=(client, trace_id, prompts),
            name=f"link_prompts_from_exporter-{uuid.uuid4().hex[:8]}",
        ).start()


def _link_prompts_sync(
    client: TracingClient,
    trace_id: str,
    prompts: Sequence[PromptVersion],
) -> None:
    """
    Synchronously link prompt versions to a trace with error handling.

    This is the core implementation that handles the actual API call and error logging.

    Args:
        client: The TracingClient instance to use for linking.
        trace_id: The ID of the trace to link prompts to.
        prompts: Sequence of PromptVersion objects to link.
    """
    try:
        client.link_prompt_versions_to_trace(
            trace_id=trace_id,
            prompts=prompts,
        )
        _logger.debug(f"Successfully linked {len(prompts)} prompts to trace {trace_id}")
    except Exception as e:
        _logger.warning(f"Failed to link prompts to trace {trace_id}: {e}")
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/tracing/otel/__init__.py

```python
"""OTEL integration utilities for MLflow tracing."""
```

--------------------------------------------------------------------------------

---[FILE: base.py]---
Location: mlflow-master/mlflow/tracing/otel/translation/base.py

```python
"""
Base class for OTEL semantic convention translators.

This module provides a base class that implements common translation logic.
Subclasses only need to define the attribute keys and mappings as class attributes.
"""

import json
import logging
from typing import Any

_logger = logging.getLogger(__name__)


class OtelSchemaTranslator:
    """
    Base class for OTEL schema translators.

    Each OTEL semantic convention (OpenInference, Traceloop, GenAI, etc.)
    should extend this class and override class attributes if needed.
    """

    SPAN_KIND_ATTRIBUTE_KEY: str | None = None
    SPAN_KIND_TO_MLFLOW_TYPE: dict[str, str] | None = None
    INPUT_TOKEN_KEY: str | None = None
    OUTPUT_TOKEN_KEY: str | None = None
    TOTAL_TOKEN_KEY: str | None = None
    INPUT_VALUE_KEYS: list[str] | None = None
    OUTPUT_VALUE_KEYS: list[str] | None = None

    def get_message_format(self, attributes: dict[str, Any]) -> str | None:
        """
        Get message format identifier for chat UI rendering.

        Subclasses should override this method to return their format identifier
        when they can handle the given attributes.

        Args:
            attributes: Dictionary of span attributes

        Returns:
            Message format string or None if not applicable
        """

    def translate_span_type(self, attributes: dict[str, Any]) -> str | None:
        """
        Translate OTEL span kind attribute to MLflow span type.

        Args:
            attributes: Dictionary of span attributes

        Returns:
            MLflow span type string or None if not found
        """
        if self.SPAN_KIND_ATTRIBUTE_KEY and (
            span_kind := attributes.get(self.SPAN_KIND_ATTRIBUTE_KEY)
        ):
            # Handle JSON-serialized values
            if isinstance(span_kind, str):
                try:
                    span_kind = json.loads(span_kind)
                except (json.JSONDecodeError, TypeError):
                    pass  # Use the string value as-is

            mlflow_type = self.SPAN_KIND_TO_MLFLOW_TYPE.get(span_kind)
            if mlflow_type is None:
                _logger.debug(
                    f"{self.__class__.__name__}: span kind '{span_kind}' "
                    f"is not supported by MLflow Span Type"
                )
            return mlflow_type

    def get_input_tokens(self, attributes: dict[str, Any]) -> int | None:
        """
        Get input token count from OTEL attributes.

        Args:
            attributes: Dictionary of span attributes

        Returns:
            Input token count or None if not found
        """
        if self.INPUT_TOKEN_KEY:
            return attributes.get(self.INPUT_TOKEN_KEY)

    def get_output_tokens(self, attributes: dict[str, Any]) -> int | None:
        """
        Get output token count from OTEL attributes.

        Args:
            attributes: Dictionary of span attributes

        Returns:
            Output token count or None if not found
        """
        if self.OUTPUT_TOKEN_KEY:
            return attributes.get(self.OUTPUT_TOKEN_KEY)

    def get_total_tokens(self, attributes: dict[str, Any]) -> int | None:
        """
        Get total token count from OTEL attributes.

        Args:
            attributes: Dictionary of span attributes

        Returns:
            Total token count or None if not found
        """
        if self.TOTAL_TOKEN_KEY:
            return attributes.get(self.TOTAL_TOKEN_KEY)

    def get_input_value(self, attributes: dict[str, Any]) -> Any:
        """
        Get input value from OTEL attributes.

        Args:
            attributes: Dictionary of span attributes

        Returns:
            Input value or None if not found
        """
        return self.get_attribute_value(attributes, self.INPUT_VALUE_KEYS)

    def get_output_value(self, attributes: dict[str, Any]) -> Any:
        """
        Get output value from OTEL attributes.

        Args:
            attributes: Dictionary of span attributes

        Returns:
            Output value or None if not found
        """
        return self.get_attribute_value(attributes, self.OUTPUT_VALUE_KEYS)

    def get_attribute_value(
        self, attributes: dict[str, Any], keys_to_check: list[str] | None = None
    ) -> Any:
        """
        Get attribute value from OTEL attributes by checking whether
        the keys in keys_to_check are present in the attributes.
        Always use this function to get the existing attribute value in the OTel Span.

        Args:
            attributes: Dictionary of span attributes
            keys_to_check: List of attribute keys to check

        Returns:
            Attribute value or None if not found
        """
        if keys_to_check:
            for key in keys_to_check:
                if value := self._get_and_check_attribute_value(attributes, key):
                    return value

    def _get_and_check_attribute_value(self, attributes: dict[str, Any], key: str) -> Any:
        """
        Get attribute value from OTEL attributes by checking whether the value is valid or not.
        This avoids fetching the value if it's empty dictionary or null.

        Args:
            attributes: Dictionary of span attributes
            key: Attribute key

        Returns:
            Attribute value or None if not found
        """
        value = attributes.get(key)
        if isinstance(value, str):
            try:
                return value if json.loads(value) else None
            except json.JSONDecodeError:
                pass  # Use the string value as-is
        return value
```

--------------------------------------------------------------------------------

---[FILE: genai_semconv.py]---
Location: mlflow-master/mlflow/tracing/otel/translation/genai_semconv.py

```python
"""
Translation utilities for GenAI (Generic AI) semantic conventions.

Reference: https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/
"""

from mlflow.entities.span import SpanType
from mlflow.tracing.otel.translation.base import OtelSchemaTranslator


class GenAiTranslator(OtelSchemaTranslator):
    """
    Translator for GenAI semantic conventions.

    Only defines the attribute keys. All translation logic is inherited from the base class.

    Note: GenAI semantic conventions don't define a total_tokens field,
    so TOTAL_TOKEN_KEY is left as None (inherited from base).
    """

    # OpenTelemetry GenAI semantic conventions span kind attribute key
    # Reference: https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/#inference
    SPAN_KIND_ATTRIBUTE_KEY = "gen_ai.operation.name"

    # Mapping from OpenTelemetry GenAI semantic conventions span kinds to MLflow span types
    SPAN_KIND_TO_MLFLOW_TYPE = {
        "chat": SpanType.CHAT_MODEL,
        "create_agent": SpanType.AGENT,
        "embeddings": SpanType.EMBEDDING,
        "execute_tool": SpanType.TOOL,
        "generate_content": SpanType.LLM,
        "invoke_agent": SpanType.AGENT,
        "text_completion": SpanType.LLM,
        "response": SpanType.LLM,
    }

    # Token usage attribute keys from OTEL GenAI semantic conventions
    # Reference: https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/#genai-attributes
    INPUT_TOKEN_KEY = "gen_ai.usage.input_tokens"
    OUTPUT_TOKEN_KEY = "gen_ai.usage.output_tokens"

    # Input/Output attribute keys from OTEL GenAI semantic conventions
    # Reference: https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/#gen-ai-input-messages
    INPUT_VALUE_KEYS = ["gen_ai.input.messages", "gen_ai.tool.call.arguments"]
    OUTPUT_VALUE_KEYS = ["gen_ai.output.messages", "gen_ai.tool.call.result"]
```

--------------------------------------------------------------------------------

---[FILE: google_adk.py]---
Location: mlflow-master/mlflow/tracing/otel/translation/google_adk.py

```python
from mlflow.tracing.otel.translation.base import OtelSchemaTranslator


class GoogleADKTranslator(OtelSchemaTranslator):
    """
    Translator for Google ADK semantic conventions.
    Google ADK mostly uses OpenTelemetry semantic conventions, but with some custom
    inputs and outputs attributes.
    """

    # Input/Output attribute keys
    # Reference: https://github.com/google/adk-python/blob/d2888a3766b87df2baaaa1a67a2235b1b80f138f/src/google/adk/telemetry/tracing.py#L264
    INPUT_VALUE_KEYS = ["gcp.vertex.agent.llm_request", "gcp.vertex.agent.tool_call_args"]
    OUTPUT_VALUE_KEYS = ["gcp.vertex.agent.llm_response", "gcp.vertex.agent.tool_response"]
```

--------------------------------------------------------------------------------

---[FILE: open_inference.py]---
Location: mlflow-master/mlflow/tracing/otel/translation/open_inference.py

```python
"""
Translation utilities for OpenInference semantic conventions.

Reference: https://github.com/Arize-ai/openinference/blob/main/python/openinference-semantic-conventions/
"""

from mlflow.entities.span import SpanType
from mlflow.tracing.otel.translation.base import OtelSchemaTranslator


class OpenInferenceTranslator(OtelSchemaTranslator):
    """
    Translator for OpenInference semantic conventions.

    Only defines the attribute keys and mappings. All translation logic
    is inherited from the base class.
    """

    # OpenInference span kind attribute key
    # Reference: https://github.com/Arize-ai/openinference/blob/50eaf3c943d818f12fdc8e37b7c305c763c82050/python/openinference-semantic-conventions/src/openinference/semconv/trace/__init__.py#L356
    SPAN_KIND_ATTRIBUTE_KEY = "openinference.span.kind"

    # Mapping from OpenInference span kinds to MLflow span types
    SPAN_KIND_TO_MLFLOW_TYPE = {
        "TOOL": SpanType.TOOL,
        "CHAIN": SpanType.CHAIN,
        "LLM": SpanType.LLM,
        "RETRIEVER": SpanType.RETRIEVER,
        "EMBEDDING": SpanType.EMBEDDING,
        "AGENT": SpanType.AGENT,
        "RERANKER": SpanType.RERANKER,
        "UNKNOWN": SpanType.UNKNOWN,
        "GUARDRAIL": SpanType.GUARDRAIL,
        "EVALUATOR": SpanType.EVALUATOR,
    }

    # Token count attribute keys
    # Reference: https://github.com/Arize-ai/openinference/blob/c80c81b8d6fa564598bd359cdd7313f4472ceca8/python/openinference-semantic-conventions/src/openinference/semconv/trace/__init__.py
    INPUT_TOKEN_KEY = "llm.token_count.prompt"
    OUTPUT_TOKEN_KEY = "llm.token_count.completion"
    TOTAL_TOKEN_KEY = "llm.token_count.total"

    # Input/Output attribute keys
    # Reference: https://github.com/Arize-ai/openinference/blob/c80c81b8d6fa564598bd359cdd7313f4472ceca8/python/openinference-semantic-conventions/src/openinference/semconv/trace/__init__.py
    INPUT_VALUE_KEYS = ["input.value"]
    OUTPUT_VALUE_KEYS = ["output.value"]
```

--------------------------------------------------------------------------------

---[FILE: traceloop.py]---
Location: mlflow-master/mlflow/tracing/otel/translation/traceloop.py

```python
"""
Translation utilities for Traceloop/OpenLLMetry semantic conventions.

Reference: https://github.com/traceloop/openllmetry/
"""

import re
from typing import Any

from mlflow.entities.span import SpanType
from mlflow.tracing.otel.translation.base import OtelSchemaTranslator


class TraceloopTranslator(OtelSchemaTranslator):
    """
    Translator for Traceloop/OpenLLMetry semantic conventions.

    Only defines the attribute keys and mappings. All translation logic
    is inherited from the base class.
    """

    # Traceloop span kind attribute key
    # Reference: https://github.com/traceloop/openllmetry/blob/e66894fd7f8324bd7b2972d7f727da39e7d93181/packages/opentelemetry-semantic-conventions-ai/opentelemetry/semconv_ai/__init__.py#L301
    SPAN_KIND_ATTRIBUTE_KEY = "traceloop.span.kind"

    # Mapping from Traceloop span kinds to MLflow span types
    SPAN_KIND_TO_MLFLOW_TYPE = {
        "workflow": SpanType.WORKFLOW,
        "task": SpanType.TASK,
        "agent": SpanType.AGENT,
        "tool": SpanType.TOOL,
        "unknown": SpanType.UNKNOWN,
    }

    # Token usage attribute keys
    # Reference: https://github.com/traceloop/openllmetry/blob/e66894fd7f8324bd7b2972d7f727da39e7d93181/packages/opentelemetry-semantic-conventions-ai/opentelemetry/semconv_ai/__init__.py
    INPUT_TOKEN_KEY = "gen_ai.usage.prompt_tokens"
    OUTPUT_TOKEN_KEY = "gen_ai.usage.completion_tokens"
    TOTAL_TOKEN_KEY = "llm.usage.total_tokens"

    # Input/Output attribute keys
    # Reference: https://github.com/traceloop/openllmetry/blob/e66894fd7f8324bd7b2972d7f727da39e7d93181/packages/opentelemetry-semantic-conventions-ai/opentelemetry/semconv_ai/__init__.py
    INPUT_VALUE_KEYS = [
        "traceloop.entity.input",
        # https://github.com/traceloop/openllmetry/blob/cf28145905fcda3f5d90add78dbee16256a96db2/packages/opentelemetry-instrumentation-writer/opentelemetry/instrumentation/writer/span_utils.py#L153
        re.compile(r"gen_ai\.prompt\.\d+\.content"),
        # https://github.com/traceloop/openllmetry/blob/cf28145905fcda3f5d90add78dbee16256a96db2/packages/opentelemetry-instrumentation-writer/opentelemetry/instrumentation/writer/span_utils.py#L167
        re.compile(r"gen_ai\.completion\.\d+\.tool_calls\.\d+\.arguments"),
    ]
    OUTPUT_VALUE_KEYS = ["traceloop.entity.output", re.compile(r"gen_ai\.completion\.\d+\.content")]

    def get_attribute_value(
        self, attributes: dict[str, Any], valid_keys: list[str | re.Pattern] | None = None
    ) -> Any:
        """
        Get attribute value from OTEL attributes by checking whether
        the keys in valid_keys are present in the attributes.

        Args:
            attributes: Dictionary of span attributes
            valid_keys: List of attribute keys to check

        Returns:
            Attribute value or None if not found
        """
        if valid_keys:
            for key in valid_keys:
                if isinstance(key, str) and (
                    value := self._get_and_check_attribute_value(attributes, key)
                ):
                    return value
                elif isinstance(key, re.Pattern):
                    for attr_key, attr_value in attributes.items():
                        if (
                            isinstance(attr_key, str)
                            and key.match(attr_key)
                            and (value := self._get_and_check_attribute_value(attributes, attr_key))
                        ):
                            return value
```

--------------------------------------------------------------------------------

---[FILE: vercel_ai.py]---
Location: mlflow-master/mlflow/tracing/otel/translation/vercel_ai.py

```python
import json
from typing import Any

from mlflow.entities.span import SpanType
from mlflow.tracing.constant import SpanAttributeKey
from mlflow.tracing.otel.translation.base import OtelSchemaTranslator


class VercelAITranslator(OtelSchemaTranslator):
    """Translator for Vercel AI SDK spans."""

    # https://ai-sdk.dev/docs/ai-sdk-core/telemetry#collected-data
    INPUT_VALUE_KEYS = [
        # generateText
        "ai.prompt",
        # tool call
        "ai.toolCall.args",
        # embed
        "ai.value",
        "ai.values",
        # NB: generateText.doGenerate inputs/outputs are handled separately
    ]
    OUTPUT_VALUE_KEYS = [
        # generateText
        "ai.response.text",
        # tool call
        "ai.toolCall.result",
        # generateObject
        "ai.response.object",
        # embed
        "ai.embedding",
        "ai.embeddings",
    ]

    SPAN_KIND_ATTRIBUTE_KEY = "ai.operationId"
    SPAN_KIND_TO_MLFLOW_TYPE = {
        "ai.generateText": SpanType.LLM,
        "ai.generateText.doGenerate": SpanType.LLM,
        "ai.toolCall": SpanType.TOOL,
        "ai.streamText": SpanType.LLM,
        "ai.streamText.doStream": SpanType.LLM,
        "ai.generateObject": SpanType.LLM,
        "ai.generateObject.doGenerate": SpanType.LLM,
        "ai.streamObject": SpanType.LLM,
        "ai.streamObject.doStream": SpanType.LLM,
        "ai.embed": SpanType.EMBEDDING,
        "ai.embed.doEmbed": SpanType.EMBEDDING,
        "ai.embedMany": SpanType.EMBEDDING,
    }

    def get_input_value(self, attributes: dict[str, Any]) -> Any:
        if self._is_chat_span(attributes):
            inputs = self._unpack_attributes_with_prefix(attributes, "ai.prompt.")
            if "tools" in inputs:
                inputs["tools"] = [self._safe_load_json(tool) for tool in inputs["tools"]]
            # Record the message format for the span for chat UI rendering
            attributes[SpanAttributeKey.MESSAGE_FORMAT] = "vercel_ai"
            return json.dumps(inputs) if inputs else None
        return super().get_input_value(attributes)

    def get_output_value(self, attributes: dict[str, Any]) -> Any:
        if self._is_chat_span(attributes):
            outputs = self._unpack_attributes_with_prefix(attributes, "ai.response.")
            return json.dumps(outputs) if outputs else None
        return super().get_output_value(attributes)

    def _unpack_attributes_with_prefix(
        self, attributes: dict[str, Any], prefix: str
    ) -> dict[str, Any]:
        result = {}
        for key, value in attributes.items():
            if key.startswith(prefix):
                suffix = key[len(prefix) :]
                result[suffix] = self._safe_load_json(value)
        return result

    def _safe_load_json(self, value: Any, max_depth: int = 2) -> Any | None:
        if not isinstance(value, str):
            return value

        try:
            result = json.loads(value)
            if max_depth > 0:
                return self._safe_load_json(result, max_depth - 1)
            return result
        except json.JSONDecodeError:
            return value

    def _is_chat_span(self, attributes: dict[str, Any]) -> bool:
        span_kind = self._safe_load_json(attributes.get(self.SPAN_KIND_ATTRIBUTE_KEY))
        return span_kind in ["ai.generateText.doGenerate", "ai.streamText.doStream"]
```

--------------------------------------------------------------------------------

---[FILE: voltagent.py]---
Location: mlflow-master/mlflow/tracing/otel/translation/voltagent.py

```python
import json
from typing import Any

from mlflow.entities.span import SpanType
from mlflow.tracing.otel.translation.base import OtelSchemaTranslator


class VoltAgentTranslator(OtelSchemaTranslator):
    """
    Translator for VoltAgent semantic conventions.

    VoltAgent provides clean chat-formatted messages in `agent.messages` and `llm.messages`.
    For tools, input/output are passed through as-is.
    """

    # Input/Output attribute keys
    # VoltAgent provides messages in standard chat format, no parsing needed
    INPUT_VALUE_KEYS = ["agent.messages", "llm.messages", "input"]
    OUTPUT_VALUE_KEYS = ["output"]

    # Span type mapping
    # The ordeing is important here. Child spans inherit entity.type from parent,
    # so we must check span.type first, then fallback to entity.type
    # (for root agent spans which don't have span.type)
    # Example of trace data from voltagent:
    # parent:
    #  {
    #    "name": "my-voltagent-app",
    #    "span_type": null,
    #    "attributes": {
    #      "entity.type": "agent",
    #      "span.type": null
    #    }
    #  }
    # child:
    #  {
    #    name": "llm:streamText",
    #    "span_type": "LLM",
    #    "attributes": {
    #      "entity.id": "my-voltagent-app",
    #      "entity.type": "agent",
    #      "entity.name": "my-voltagent-app",
    #      "span.type": "llm",
    #      "llm.operation": "streamText",
    #      "mlflow.spanType": "LLM"
    #    }
    #  }
    SPAN_KIND_ATTRIBUTE_KEYS = ["span.type", "entity.type"]
    SPAN_KIND_TO_MLFLOW_TYPE = {
        "agent": SpanType.AGENT,
        "llm": SpanType.LLM,
        "tool": SpanType.TOOL,
        "memory": SpanType.MEMORY,
    }

    # Message format for chat UI rendering
    MESSAGE_FORMAT = "voltagent"

    # VoltAgent-specific attribute keys for detection
    DETECTION_KEYS = [
        "voltagent.operation_id",
        "voltagent.conversation_id",
    ]

    def _decode_json_value(self, value: Any) -> Any:
        """Decode JSON-serialized string values."""
        if isinstance(value, str):
            try:
                return json.loads(value)
            except (json.JSONDecodeError, TypeError):
                pass
        return value

    def translate_span_type(self, attributes: dict[str, Any]) -> str | None:
        """
        Translate VoltAgent span type to MLflow span type.

        VoltAgent uses different attributes for different span types:
        - Child spans (LLM/tool/memory): span.type attribute
        - Root agent spans: entity.type attribute (no span.type set)

        We check span.type FIRST because child spans have entity.type set to
        their parent agent's type ("agent"), not their own type. Only root
        agent spans have entity.type correctly set to "agent" without span.type.
        """
        # Check span.type first (for LLM/tool/memory child spans)
        for span_kind_key in self.SPAN_KIND_ATTRIBUTE_KEYS:
            span_type = self._decode_json_value(attributes.get(span_kind_key))
            if span_type and (mlflow_type := self.SPAN_KIND_TO_MLFLOW_TYPE.get(span_type)):
                return mlflow_type

    def get_message_format(self, attributes: dict[str, Any]) -> str | None:
        """
        Get message format identifier for VoltAgent traces.

        Returns 'voltagent' if VoltAgent-specific attributes are detected.

        Args:
            attributes: Dictionary of span attributes

        Returns:
            'voltagent' if VoltAgent attributes detected, None otherwise
        """
        for key in self.DETECTION_KEYS:
            if key in attributes:
                return self.MESSAGE_FORMAT
        return None

    def get_input_tokens(self, attributes: dict[str, Any]) -> int | None:
        """Get input token count."""
        return attributes.get("usage.prompt_tokens") or attributes.get("llm.usage.prompt_tokens")

    def get_output_tokens(self, attributes: dict[str, Any]) -> int | None:
        """Get output token count."""
        return attributes.get("usage.completion_tokens") or attributes.get(
            "llm.usage.completion_tokens"
        )

    def get_total_tokens(self, attributes: dict[str, Any]) -> int | None:
        """Get total token count."""
        return attributes.get("usage.total_tokens") or attributes.get("llm.usage.total_tokens")
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/tracing/otel/translation/__init__.py

```python
"""
Utilities for translating OTEL span attributes to MLflow span format.

This module provides functions to translate span attributes from various
OTEL semantic conventions (OpenInference, Traceloop, GenAI) to MLflow span types.
It uses modular translator classes for each OTEL schema for better organization
and performance.
"""

import json
import logging
from typing import Any

from mlflow.entities.span import Span
from mlflow.tracing.constant import SpanAttributeKey, TokenUsageKey
from mlflow.tracing.otel.translation.base import OtelSchemaTranslator
from mlflow.tracing.otel.translation.genai_semconv import GenAiTranslator
from mlflow.tracing.otel.translation.google_adk import GoogleADKTranslator
from mlflow.tracing.otel.translation.open_inference import OpenInferenceTranslator
from mlflow.tracing.otel.translation.traceloop import TraceloopTranslator
from mlflow.tracing.otel.translation.vercel_ai import VercelAITranslator
from mlflow.tracing.otel.translation.voltagent import VoltAgentTranslator
from mlflow.tracing.utils import dump_span_attribute_value

_logger = logging.getLogger(__name__)

_TRANSLATORS: list[OtelSchemaTranslator] = [
    OpenInferenceTranslator(),
    GenAiTranslator(),
    TraceloopTranslator(),
    GoogleADKTranslator(),
    VercelAITranslator(),
    VoltAgentTranslator(),
]


def translate_span_when_storing(span: Span) -> dict[str, Any]:
    """
    Apply attributes translations to a span's dictionary when storing.

    Supported translations:
    - Token usage attributes from various OTEL schemas
    - Inputs and outputs attributes from various OTEL schemas
    - Message format for chat UI rendering

    These attributes translation need to happen when storing spans because we need
    to update TraceInfo accordingly.

    Args:
        span: Span object

    Returns:
        Translated span dictionary
    """
    span_dict = span.to_dict()
    attributes = sanitize_attributes(span_dict.get("attributes", {}))

    # Translate inputs and outputs
    if SpanAttributeKey.INPUTS not in attributes and (input_value := _get_input_value(attributes)):
        attributes[SpanAttributeKey.INPUTS] = input_value

    if SpanAttributeKey.OUTPUTS not in attributes and (
        output_value := _get_output_value(attributes)
    ):
        attributes[SpanAttributeKey.OUTPUTS] = output_value

    # Translate token usage
    if SpanAttributeKey.CHAT_USAGE not in attributes and (
        token_usage := _get_token_usage(attributes)
    ):
        attributes[SpanAttributeKey.CHAT_USAGE] = dump_span_attribute_value(token_usage)

    # Set message format for chat UI rendering
    if SpanAttributeKey.MESSAGE_FORMAT not in attributes and (
        message_format := _get_message_format(attributes)
    ):
        attributes[SpanAttributeKey.MESSAGE_FORMAT] = dump_span_attribute_value(message_format)

    span_dict["attributes"] = attributes
    return span_dict


def _get_token_usage(attributes: dict[str, Any]) -> dict[str, Any]:
    """
    Get token usage from various OTEL semantic conventions.
    """
    for translator in _TRANSLATORS:
        input_tokens = translator.get_input_tokens(attributes)
        output_tokens = translator.get_output_tokens(attributes)
        total_tokens = translator.get_total_tokens(attributes)

        # Calculate total tokens if not provided but input/output are available
        if input_tokens and output_tokens and (total_tokens is None):
            total_tokens = int(input_tokens) + int(output_tokens)

        if input_tokens and output_tokens and total_tokens:
            return {
                TokenUsageKey.INPUT_TOKENS: int(input_tokens),
                TokenUsageKey.OUTPUT_TOKENS: int(output_tokens),
                TokenUsageKey.TOTAL_TOKENS: int(total_tokens),
            }


def _get_input_value(attributes: dict[str, Any]) -> Any:
    """
    Get input value from various OTEL semantic conventions.

    Args:
        attributes: Dictionary of span attributes

    Returns:
        Input value or None if not found
    """
    for translator in _TRANSLATORS:
        if value := translator.get_input_value(attributes):
            return value


def _get_output_value(attributes: dict[str, Any]) -> Any:
    """
    Get output value from various OTEL semantic conventions.

    Args:
        attributes: Dictionary of span attributes

    Returns:
        Output value or None if not found
    """
    for translator in _TRANSLATORS:
        if value := translator.get_output_value(attributes):
            return value


def _get_message_format(attributes: dict[str, Any]) -> str | None:
    """
    Get message format from span attributes for chat UI rendering.

    Args:
        attributes: Dictionary of span attributes

    Returns:
        Message format string or None if not found
    """
    for translator in _TRANSLATORS:
        if message_format := translator.get_message_format(attributes):
            return message_format
    return None


def translate_span_type_from_otel(attributes: dict[str, Any]) -> str | None:
    """
    Translate OTEL span kind attributes to MLflow span type.

    This function checks for span kind attributes from various OTEL semantic
    conventions (OpenInference, Traceloop) and maps them to MLflow span types.

    Args:
        attributes: Dictionary of span attributes

    Returns:
        MLflow span type string or None if no mapping found
    """
    for translator in _TRANSLATORS:
        if mlflow_type := translator.translate_span_type(attributes):
            return mlflow_type


def translate_loaded_span(span_dict: dict[str, Any]) -> dict[str, Any]:
    """
    Apply attributes translations to a span dictionary when loading.

    Supported translations:
    - OTEL span kind attributes

    Args:
        span_dict: Span dictionary (will be modified in-place)

    Returns:
        Modified span dictionary
    """
    attributes = span_dict.get("attributes", {})

    try:
        if SpanAttributeKey.SPAN_TYPE not in attributes:
            if mlflow_type := translate_span_type_from_otel(attributes):
                # Serialize to match how MLflow stores attributes
                attributes[SpanAttributeKey.SPAN_TYPE] = dump_span_attribute_value(mlflow_type)
    except Exception:
        _logger.debug("Failed to translate span type", exc_info=True)

    span_dict["attributes"] = attributes
    return span_dict


def update_token_usage(
    current_token_usage: str | dict[str, Any], new_token_usage: str | dict[str, Any]
) -> str | dict[str, Any]:
    """
    Update current token usage in-place by adding the new token usage.

    Args:
        current_token_usage: Current token usage, dictionary or JSON string
        new_token_usage: New token usage, dictionary or JSON string

    Returns:
        Updated token usage dictionary or JSON string
    """
    try:
        if isinstance(current_token_usage, str):
            current_token_usage = json.loads(current_token_usage) or {}
        if isinstance(new_token_usage, str):
            new_token_usage = json.loads(new_token_usage) or {}
        if new_token_usage:
            for key in [
                TokenUsageKey.INPUT_TOKENS,
                TokenUsageKey.OUTPUT_TOKENS,
                TokenUsageKey.TOTAL_TOKENS,
            ]:
                current_token_usage[key] = current_token_usage.get(key, 0) + new_token_usage.get(
                    key, 0
                )
    except Exception:
        _logger.debug(
            f"Failed to update token usage with current_token_usage: {current_token_usage}, "
            f"new_token_usage: {new_token_usage}",
            exc_info=True,
        )

    return current_token_usage


def sanitize_attributes(attributes: dict[str, Any]) -> dict[str, Any]:
    """
    Sanitize attributes by removing duplicate dumped attributes.
    This is necessary because when spans are logged to sql store with otel_api, the
    span attributes are dumped twice (once in Span.from_otel_proto and once in span.to_dict).
    """
    updated_attributes = {}
    for key, value in attributes.items():
        try:
            result = json.loads(value)
            if isinstance(result, str):
                try:
                    # If the original value is a string or dict, we store it as
                    # a JSON-encoded string.  For other types, we store the original value directly.
                    # For string type, this is to avoid interpreting "1" as an int accidentally.
                    # For dictionary, we save the json-encoded-once string so that the UI can render
                    # it correctly after loading.
                    if isinstance(json.loads(result), (str, dict)):
                        updated_attributes[key] = result
                        continue
                except json.JSONDecodeError:
                    pass
        except (json.JSONDecodeError, TypeError):
            pass
        # if the value is not a json string, or it's only dumped once, we keep the original value
        updated_attributes[key] = value
    return updated_attributes
```

--------------------------------------------------------------------------------

````
