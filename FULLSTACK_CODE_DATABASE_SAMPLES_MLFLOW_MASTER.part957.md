---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 957
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 957 of 991)

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

---[FILE: test_span_translation.py]---
Location: mlflow-master/tests/tracing/otel/test_span_translation.py

```python
import json
from typing import Any
from unittest import mock

import pytest

from mlflow.entities.span import Span, SpanType
from mlflow.tracing.constant import SpanAttributeKey, TokenUsageKey
from mlflow.tracing.otel.translation import (
    sanitize_attributes,
    translate_loaded_span,
    translate_span_type_from_otel,
    translate_span_when_storing,
)
from mlflow.tracing.otel.translation.base import OtelSchemaTranslator
from mlflow.tracing.otel.translation.genai_semconv import GenAiTranslator
from mlflow.tracing.otel.translation.google_adk import GoogleADKTranslator
from mlflow.tracing.otel.translation.open_inference import OpenInferenceTranslator
from mlflow.tracing.otel.translation.traceloop import TraceloopTranslator
from mlflow.tracing.otel.translation.vercel_ai import VercelAITranslator


@pytest.mark.parametrize(
    ("translator", "otel_kind", "expected_type"),
    [
        (OpenInferenceTranslator, "LLM", SpanType.LLM),
        (OpenInferenceTranslator, "CHAIN", SpanType.CHAIN),
        (OpenInferenceTranslator, "AGENT", SpanType.AGENT),
        (OpenInferenceTranslator, "TOOL", SpanType.TOOL),
        (OpenInferenceTranslator, "RETRIEVER", SpanType.RETRIEVER),
        (OpenInferenceTranslator, "EMBEDDING", SpanType.EMBEDDING),
        (OpenInferenceTranslator, "RERANKER", SpanType.RERANKER),
        (OpenInferenceTranslator, "GUARDRAIL", SpanType.GUARDRAIL),
        (OpenInferenceTranslator, "EVALUATOR", SpanType.EVALUATOR),
        (TraceloopTranslator, "workflow", SpanType.WORKFLOW),
        (TraceloopTranslator, "task", SpanType.TASK),
        (TraceloopTranslator, "agent", SpanType.AGENT),
        (TraceloopTranslator, "tool", SpanType.TOOL),
        (GenAiTranslator, "chat", SpanType.CHAT_MODEL),
        (GenAiTranslator, "create_agent", SpanType.AGENT),
        (GenAiTranslator, "embeddings", SpanType.EMBEDDING),
        (GenAiTranslator, "execute_tool", SpanType.TOOL),
        (GenAiTranslator, "generate_content", SpanType.LLM),
        (GenAiTranslator, "invoke_agent", SpanType.AGENT),
        (GenAiTranslator, "text_completion", SpanType.LLM),
    ],
)
def test_translate_span_type_from_otel(
    translator: OtelSchemaTranslator, otel_kind: str, expected_type: SpanType
):
    attributes = {translator.SPAN_KIND_ATTRIBUTE_KEY: otel_kind}
    result = translate_span_type_from_otel(attributes)
    assert result == expected_type


@pytest.mark.parametrize(
    "attributes",
    [
        {"some.other.attribute": "value"},
        {OpenInferenceTranslator.SPAN_KIND_ATTRIBUTE_KEY: "UNKNOWN_TYPE"},
        {TraceloopTranslator.SPAN_KIND_ATTRIBUTE_KEY: "unknown_type"},
    ],
)
def test_translate_span_type_returns_none(attributes):
    result = translate_span_type_from_otel(attributes)
    assert result is None


@pytest.mark.parametrize(
    ("attr_key", "attr_value", "expected_type"),
    [
        (OpenInferenceTranslator.SPAN_KIND_ATTRIBUTE_KEY, json.dumps("LLM"), SpanType.LLM),
        (TraceloopTranslator.SPAN_KIND_ATTRIBUTE_KEY, json.dumps("agent"), SpanType.AGENT),
        (VercelAITranslator.SPAN_KIND_ATTRIBUTE_KEY, json.dumps("ai.generateText"), SpanType.LLM),
        (VercelAITranslator.SPAN_KIND_ATTRIBUTE_KEY, json.dumps("ai.toolCall"), SpanType.TOOL),
    ],
)
def test_json_serialized_values(attr_key, attr_value, expected_type):
    attributes = {attr_key: attr_value}
    result = translate_span_type_from_otel(attributes)
    assert result == expected_type


@pytest.mark.parametrize(
    ("attr_key", "attr_value", "expected_type"),
    [
        (OpenInferenceTranslator.SPAN_KIND_ATTRIBUTE_KEY, "LLM", SpanType.LLM),
        (TraceloopTranslator.SPAN_KIND_ATTRIBUTE_KEY, "agent", SpanType.AGENT),
    ],
)
def test_translate_loaded_span_sets_span_type(attr_key, attr_value, expected_type):
    span_dict = {"attributes": {attr_key: attr_value}}
    result = translate_loaded_span(span_dict)

    assert SpanAttributeKey.SPAN_TYPE in result["attributes"]
    span_type = json.loads(result["attributes"][SpanAttributeKey.SPAN_TYPE])
    assert span_type == expected_type


@pytest.mark.parametrize(
    ("span_dict", "should_have_span_type", "expected_type"),
    [
        (
            {
                "attributes": {
                    SpanAttributeKey.SPAN_TYPE: json.dumps(SpanType.TOOL),
                    "openinference.span.kind": "LLM",
                }
            },
            True,
            SpanType.TOOL,
        ),
        ({"attributes": {"some.other.attribute": "value"}}, False, None),
        ({}, False, None),
    ],
)
def test_translate_loaded_span_edge_cases(span_dict, should_have_span_type, expected_type):
    result = translate_loaded_span(span_dict)
    if should_have_span_type:
        assert SpanAttributeKey.SPAN_TYPE in result["attributes"]
        span_type = json.loads(result["attributes"][SpanAttributeKey.SPAN_TYPE])
        assert span_type == expected_type
    else:
        assert SpanAttributeKey.SPAN_TYPE not in result.get("attributes", {})


@pytest.mark.parametrize(
    "translator", [OpenInferenceTranslator, GenAiTranslator, TraceloopTranslator]
)
@pytest.mark.parametrize("total_token_exists", [True, False])
def test_translate_token_usage_from_otel(translator: OtelSchemaTranslator, total_token_exists):
    span = mock.Mock(spec=Span)
    span.parent_id = "parent_123"
    span_dict = {
        "attributes": {
            translator.INPUT_TOKEN_KEY: 100,
            translator.OUTPUT_TOKEN_KEY: 50,
        }
    }
    if total_token_exists and translator.TOTAL_TOKEN_KEY:
        span_dict["attributes"][translator.TOTAL_TOKEN_KEY] = 150

    span.to_dict.return_value = span_dict

    result = translate_span_when_storing(span)

    assert SpanAttributeKey.CHAT_USAGE in result["attributes"]
    usage = json.loads(result["attributes"][SpanAttributeKey.CHAT_USAGE])
    assert usage[TokenUsageKey.INPUT_TOKENS] == 100
    assert usage[TokenUsageKey.OUTPUT_TOKENS] == 50
    assert usage[TokenUsageKey.TOTAL_TOKENS] == 150


@pytest.mark.parametrize(
    ("attributes", "expected_input", "expected_output", "expected_total"),
    [
        (
            {"gen_ai.usage.input_tokens": 75, "gen_ai.usage.output_tokens": 25},
            75,
            25,
            100,
        ),
        (
            {
                SpanAttributeKey.CHAT_USAGE: json.dumps(
                    {
                        TokenUsageKey.INPUT_TOKENS: 200,
                        TokenUsageKey.OUTPUT_TOKENS: 100,
                        TokenUsageKey.TOTAL_TOKENS: 300,
                    }
                ),
                "gen_ai.usage.input_tokens": 50,
                "gen_ai.usage.output_tokens": 25,
            },
            200,
            100,
            300,
        ),
    ],
)
def test_translate_token_usage_edge_cases(
    attributes, expected_input, expected_output, expected_total
):
    span = mock.Mock(spec=Span)
    span.parent_id = "parent_123"
    span_dict = {"attributes": attributes}
    span.to_dict.return_value = span_dict

    result = translate_span_when_storing(span)

    usage = json.loads(result["attributes"][SpanAttributeKey.CHAT_USAGE])
    assert usage[TokenUsageKey.INPUT_TOKENS] == expected_input
    assert usage[TokenUsageKey.OUTPUT_TOKENS] == expected_output
    assert usage[TokenUsageKey.TOTAL_TOKENS] == expected_total


@pytest.mark.parametrize(
    "translator",
    [OpenInferenceTranslator, GenAiTranslator, GoogleADKTranslator],
)
@pytest.mark.parametrize(
    "input_value",
    ["test input", {"query": "test"}, 123],
)
@pytest.mark.parametrize("parent_id", [None, "parent_123"])
def test_translate_inputs_for_spans(
    parent_id: str | None, translator: OtelSchemaTranslator, input_value: Any
):
    span = mock.Mock(spec=Span)
    span.parent_id = parent_id
    for input_key in translator.INPUT_VALUE_KEYS:
        span_dict = {"attributes": {input_key: json.dumps(input_value)}}
        span.to_dict.return_value = span_dict

        result = translate_span_when_storing(span)

        assert result["attributes"][SpanAttributeKey.INPUTS] == json.dumps(input_value)


@pytest.mark.parametrize(
    "input_key",
    [
        "traceloop.entity.input",
        "gen_ai.prompt.0.content",
        "gen_ai.prompt.1.content",
        "gen_ai.completion.0.tool_calls.0.arguments",
        "gen_ai.completion.1.tool_calls.1.arguments",
    ],
)
@pytest.mark.parametrize(
    "input_value",
    ["test input", {"query": "test"}, 123],
)
def test_translate_inputs_for_spans_traceloop(input_key: str, input_value: Any):
    span = mock.Mock(spec=Span)
    span.parent_id = "parent_123"
    span_dict = {"attributes": {input_key: json.dumps(input_value)}}
    span.to_dict.return_value = span_dict

    result = translate_span_when_storing(span)
    assert result["attributes"][SpanAttributeKey.INPUTS] == json.dumps(input_value)


@pytest.mark.parametrize(
    "translator",
    [OpenInferenceTranslator, GenAiTranslator, GoogleADKTranslator],
)
@pytest.mark.parametrize("parent_id", [None, "parent_123"])
def test_translate_outputs_for_spans(parent_id: str | None, translator: OtelSchemaTranslator):
    output_value = "test output"
    span = mock.Mock(spec=Span)
    span.parent_id = parent_id
    for output_key in translator.OUTPUT_VALUE_KEYS:
        span_dict = {"attributes": {output_key: json.dumps(output_value)}}
        span.to_dict.return_value = span_dict

        result = translate_span_when_storing(span)

        assert result["attributes"][SpanAttributeKey.OUTPUTS] == json.dumps(output_value)


@pytest.mark.parametrize(
    "output_key",
    [
        "traceloop.entity.output",
        "gen_ai.completion.0.content",
        "gen_ai.completion.1.content",
    ],
)
@pytest.mark.parametrize(
    "output_value",
    ["test input", {"query": "test"}, 123],
)
def test_translate_outputs_for_spans_traceloop(output_key: str, output_value: Any):
    span = mock.Mock(spec=Span)
    span.parent_id = "parent_123"
    span_dict = {"attributes": {output_key: json.dumps(output_value)}}
    span.to_dict.return_value = span_dict

    result = translate_span_when_storing(span)
    assert result["attributes"][SpanAttributeKey.OUTPUTS] == json.dumps(output_value)


@pytest.mark.parametrize(
    (
        "parent_id",
        "attributes",
        "expected_inputs",
        "expected_outputs",
    ),
    [
        (
            "parent_123",
            {
                OpenInferenceTranslator.INPUT_VALUE_KEYS[0]: json.dumps("test input"),
                OpenInferenceTranslator.OUTPUT_VALUE_KEYS[0]: json.dumps("test output"),
            },
            "test input",
            "test output",
        ),
        (
            None,
            {
                SpanAttributeKey.INPUTS: json.dumps("existing input"),
                SpanAttributeKey.OUTPUTS: json.dumps("existing output"),
                OpenInferenceTranslator.INPUT_VALUE_KEYS[0]: json.dumps("new input"),
                OpenInferenceTranslator.OUTPUT_VALUE_KEYS[0]: json.dumps("new output"),
            },
            "existing input",
            "existing output",
        ),
    ],
)
def test_translate_inputs_outputs_edge_cases(
    parent_id,
    attributes,
    expected_inputs,
    expected_outputs,
):
    span = mock.Mock(spec=Span)
    span.parent_id = parent_id
    span_dict = {"attributes": attributes}
    span.to_dict.return_value = span_dict

    result = translate_span_when_storing(span)

    assert SpanAttributeKey.INPUTS in result["attributes"]
    inputs = json.loads(result["attributes"][SpanAttributeKey.INPUTS])
    assert inputs == expected_inputs
    assert SpanAttributeKey.OUTPUTS in result["attributes"]
    outputs = json.loads(result["attributes"][SpanAttributeKey.OUTPUTS])
    assert outputs == expected_outputs


@pytest.mark.parametrize(
    ("attributes", "expected_attributes"),
    [
        ({"some.attribute": json.dumps("value")}, {"some.attribute": json.dumps("value")}),
        (
            {"some.attribute": json.dumps(json.dumps("value"))},
            {"some.attribute": json.dumps("value")},
        ),
        (
            {"key": json.dumps(json.dumps({"x": "y"}))},
            {"key": json.dumps({"x": "y"})},
        ),
        (
            {"key": "string"},
            {"key": "string"},
        ),
        (
            {"key": json.dumps(True)},
            {"key": "true"},
        ),
        (
            {"key": json.dumps(123)},
            {"key": "123"},
        ),
        (
            {"key": json.dumps([1, 2, 3])},
            {"key": "[1, 2, 3]"},
        ),
    ],
)
def test_sanitize_attributes(attributes: dict[str, Any], expected_attributes: dict[str, Any]):
    result = sanitize_attributes(attributes)
    assert result == expected_attributes
```

--------------------------------------------------------------------------------

---[FILE: test_vercel_ai_translator.py]---
Location: mlflow-master/tests/tracing/otel/test_vercel_ai_translator.py

```python
import json
from unittest import mock

import pytest

from mlflow.entities.span import Span
from mlflow.tracing.constant import SpanAttributeKey
from mlflow.tracing.otel.translation import translate_span_when_storing


@pytest.mark.parametrize(
    ("attributes", "expected_inputs", "expected_outputs"),
    [
        # 1. generateText
        (
            {
                "ai.operationId": "ai.generateText",
                "ai.prompt": '{"prompt":"Why is the sky blue?"}',
                "ai.response.text": "Because of the scattering of light by the atmosphere.",
                "ai.response.finishReason": "length",
            },
            {
                "prompt": "Why is the sky blue?",
            },
            "Because of the scattering of light by the atmosphere.",
        ),
        # 2. generateText.doGenerate
        (
            {
                "ai.operationId": "ai.generateText.doGenerate",
                "ai.prompt.messages": (
                    '[{"role":"user","content":[{"type":"text","text":"Why is the sky blue?"}]}]'
                ),
                "ai.response.text": "Because of the scattering of light by the atmosphere.",
                "ai.response.finishReason": "length",
                "ai.response.id": "resp_0c4162a99c227acc00691324c9eaac81a3a3191fef81ca2987",
                "ai.response.model": "gpt-4-turbo-2024-04-09",
            },
            {
                "messages": [
                    {"role": "user", "content": [{"type": "text", "text": "Why is the sky blue?"}]}
                ]
            },
            {
                "text": "Because of the scattering of light by the atmosphere.",
                "finishReason": "length",
                "id": "resp_0c4162a99c227acc00691324c9eaac81a3a3191fef81ca2987",
                "model": "gpt-4-turbo-2024-04-09",
            },
        ),
        # 3. generateText with tool calls
        (
            {
                "ai.operationId": "ai.generateText.doGenerate",
                "ai.prompt.messages": (
                    '[{"role":"user","content":[{"type":"text","text":'
                    '"What is the weather in SF?"}]}]'
                ),
                "ai.prompt.tools": [
                    (
                        '{"type":"function","name":"weather","description":"Get the weather in '
                        'a location","inputSchema":{"type":"object","properties":{"location":'
                        '{"type":"string","description":"The location to get the weather for"}},'
                        '"required":["location"],"additionalProperties":false,"$schema":'
                        '"http://json-schema.org/draft-07/schema#"}}'
                    )
                ],
                "ai.prompt.toolChoice": '{"type":"auto"}',
                "ai.response.toolCalls": (
                    '[{"toolCallId":"call_PHKlxvzLK8w4PHH8CuvHXUzE","toolName":"weather",'
                    '"input":"{\\"location\\":\\"San Francisco\\"}"}]'
                ),
                "ai.response.finishReason": "tool-calls",
            },
            {
                "messages": [
                    {
                        "role": "user",
                        "content": [{"type": "text", "text": "What is the weather in SF?"}],
                    }
                ],
                "tools": [
                    {
                        "type": "function",
                        "name": "weather",
                        "description": "Get the weather in a location",
                        "inputSchema": {
                            "type": "object",
                            "properties": {
                                "location": {
                                    "type": "string",
                                    "description": "The location to get the weather for",
                                }
                            },
                            "required": ["location"],
                            "additionalProperties": False,
                            "$schema": "http://json-schema.org/draft-07/schema#",
                        },
                    }
                ],
                "toolChoice": {"type": "auto"},
            },
            {
                "toolCalls": [
                    {
                        "input": '{"location":"San Francisco"}',
                        "toolName": "weather",
                        "toolCallId": "call_PHKlxvzLK8w4PHH8CuvHXUzE",
                    }
                ],
                "finishReason": "tool-calls",
            },
        ),
        # 4. generateText with tool call results
        (
            {
                "ai.operationId": "ai.generateText.doGenerate",
                "ai.prompt.messages": (
                    '[{"role":"user","content":[{"type":"text",'
                    '"text":"What is the weather in San Francisco?"}]},'
                    '{"role":"assistant","content":[{"type":"tool-call","toolCallId":"call_123",'
                    '"toolName":"weather","input":{"location":"San Francisco"}}]},'
                    '{"role":"tool","content":[{"type":"tool-result","toolCallId":"call_123",'
                    '"toolName":"weather","output":{"type":"json",'
                    '"value":{"location":"San Francisco","temperature":76}}}]}]'
                ),
                "ai.prompt.toolChoice": '{"type":"auto"}',
                "ai.response.text": "The current temperature in San Francisco is 76°F.",
                "ai.response.finishReason": "stop",
            },
            {
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "What is the weather in San Francisco?"}
                        ],
                    },
                    {
                        "role": "assistant",
                        "content": [
                            {
                                "type": "tool-call",
                                "toolCallId": "call_123",
                                "toolName": "weather",
                                "input": {"location": "San Francisco"},
                            }
                        ],
                    },
                    {
                        "role": "tool",
                        "content": [
                            {
                                "type": "tool-result",
                                "toolCallId": "call_123",
                                "toolName": "weather",
                                "output": {
                                    "type": "json",
                                    "value": {"location": "San Francisco", "temperature": 76},
                                },
                            }
                        ],
                    },
                ],
                "toolChoice": {"type": "auto"},
            },
            {
                "text": "The current temperature in San Francisco is 76°F.",
                "finishReason": "stop",
            },
        ),
        # 5. Tool execution span
        (
            {
                "ai.operationId": "ai.toolCall",
                "ai.toolCall.args": '{"location":"San Francisco"}',
                "ai.toolCall.result": '{"location":"San Francisco","temperature":76}',
            },
            {
                "location": "San Francisco",
            },
            {
                "location": "San Francisco",
                "temperature": 76,
            },
        ),
    ],
)
def test_parse_vercel_ai_generate_text(attributes, expected_inputs, expected_outputs):
    span = mock.Mock(spec=Span)
    span.parent_id = "parent_123"
    span_dict = {"attributes": {k: json.dumps(v) for k, v in attributes.items()}}
    span.to_dict.return_value = span_dict

    result = translate_span_when_storing(span)
    inputs = json.loads(result["attributes"][SpanAttributeKey.INPUTS])
    assert inputs == expected_inputs
    outputs = json.loads(result["attributes"][SpanAttributeKey.OUTPUTS])
    assert outputs == expected_outputs
```

--------------------------------------------------------------------------------

---[FILE: test_voltagent_translator.py]---
Location: mlflow-master/tests/tracing/otel/test_voltagent_translator.py

```python
import json
from unittest import mock

import pytest

from mlflow.entities.span import Span, SpanType
from mlflow.tracing.constant import SpanAttributeKey
from mlflow.tracing.otel.translation import (
    translate_span_type_from_otel,
    translate_span_when_storing,
)
from mlflow.tracing.otel.translation.voltagent import VoltAgentTranslator


@pytest.mark.parametrize(
    ("attributes", "expected_type"),
    [
        ({"span.type": "agent"}, SpanType.AGENT),
        ({"span.type": "llm"}, SpanType.LLM),
        ({"span.type": "tool"}, SpanType.TOOL),
        ({"span.type": "memory"}, SpanType.MEMORY),
        ({"entity.type": "agent"}, SpanType.AGENT),
        ({"entity.type": "llm"}, SpanType.LLM),
        ({"entity.type": "tool"}, SpanType.TOOL),
        ({"entity.type": "memory"}, SpanType.MEMORY),
        ({"span.type": "llm", "entity.type": "agent"}, SpanType.LLM),
    ],
)
def test_voltagent_span_type_translation(attributes, expected_type):
    translator = VoltAgentTranslator()
    result = translator.translate_span_type(attributes)
    assert result == expected_type


@pytest.mark.parametrize(
    "attributes",
    [
        {"some.other.attribute": "value"},
        {"span.type": "unknown_type"},
        {"entity.type": "unknown_type"},
        {},
    ],
)
def test_voltagent_span_type_returns_none(attributes):
    translator = VoltAgentTranslator()
    result = translator.translate_span_type(attributes)
    assert result is None


@pytest.mark.parametrize(
    ("attributes", "expected_inputs", "expected_outputs", "output_is_json"),
    [
        (
            {
                "agent.messages": json.dumps(
                    [
                        {"role": "user", "content": "Hello, what can you do?"},
                        {"role": "assistant", "content": "I can help you with various tasks."},
                    ]
                ),
                "output": "I'm here to help!",
                "span.type": "agent",
                "voltagent.operation_id": "op-123",
            },
            [
                {"role": "user", "content": "Hello, what can you do?"},
                {"role": "assistant", "content": "I can help you with various tasks."},
            ],
            "I'm here to help!",
            False,
        ),
        (
            {
                "llm.messages": json.dumps(
                    [
                        {"role": "system", "content": "You are a helpful assistant."},
                        {"role": "user", "content": "What's the weather like?"},
                    ]
                ),
                "output": "I don't have access to real-time weather data.",
                "span.type": "llm",
            },
            [
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "What's the weather like?"},
            ],
            "I don't have access to real-time weather data.",
            False,
        ),
        (
            {
                "input": json.dumps({"location": "San Francisco"}),
                "output": json.dumps({"temperature": 72, "conditions": "sunny"}),
                "span.type": "tool",
            },
            {"location": "San Francisco"},
            {"temperature": 72, "conditions": "sunny"},
            True,
        ),
    ],
)
def test_voltagent_input_output_translation(
    attributes, expected_inputs, expected_outputs, output_is_json
):
    span = mock.Mock(spec=Span)
    span.parent_id = "parent_123"
    span_dict = {"attributes": attributes}
    span.to_dict.return_value = span_dict

    result = translate_span_when_storing(span)

    inputs = json.loads(result["attributes"][SpanAttributeKey.INPUTS])
    assert inputs == expected_inputs

    outputs_raw = result["attributes"][SpanAttributeKey.OUTPUTS]
    if output_is_json:
        outputs = json.loads(outputs_raw)
        assert outputs == expected_outputs
    else:
        try:
            outputs = json.loads(outputs_raw)
        except json.JSONDecodeError:
            outputs = outputs_raw
        assert outputs == expected_outputs


@pytest.mark.parametrize(
    ("attributes", "expected_input_tokens", "expected_output_tokens", "expected_total_tokens"),
    [
        (
            {
                "usage.prompt_tokens": 100,
                "usage.completion_tokens": 50,
                "usage.total_tokens": 150,
            },
            100,
            50,
            150,
        ),
        (
            {
                "llm.usage.prompt_tokens": 200,
                "llm.usage.completion_tokens": 100,
                "llm.usage.total_tokens": 300,
            },
            200,
            100,
            300,
        ),
        (
            {
                "usage.prompt_tokens": 75,
                "usage.completion_tokens": 25,
                "llm.usage.prompt_tokens": 100,
                "llm.usage.completion_tokens": 50,
            },
            75,
            25,
            100,
        ),
    ],
)
def test_voltagent_token_usage_translation(
    attributes, expected_input_tokens, expected_output_tokens, expected_total_tokens
):
    translator = VoltAgentTranslator()

    input_tokens = translator.get_input_tokens(attributes)
    assert input_tokens == expected_input_tokens

    output_tokens = translator.get_output_tokens(attributes)
    assert output_tokens == expected_output_tokens

    total_tokens = translator.get_total_tokens(attributes)
    if "usage.total_tokens" in attributes or "llm.usage.total_tokens" in attributes:
        assert total_tokens == expected_total_tokens
    else:
        assert total_tokens is None


def test_voltagent_translator_detection_keys():
    translator = VoltAgentTranslator()

    assert "voltagent.operation_id" in translator.DETECTION_KEYS
    assert "voltagent.conversation_id" in translator.DETECTION_KEYS


def test_voltagent_translator_message_format():
    translator = VoltAgentTranslator()
    assert translator.MESSAGE_FORMAT == "voltagent"


def test_voltagent_translator_input_output_keys():
    translator = VoltAgentTranslator()

    assert "agent.messages" in translator.INPUT_VALUE_KEYS
    assert "llm.messages" in translator.INPUT_VALUE_KEYS
    assert "input" in translator.INPUT_VALUE_KEYS

    assert "output" in translator.OUTPUT_VALUE_KEYS


@pytest.mark.parametrize(
    ("attributes", "expected_type"),
    [
        # Test span.type attribute (used by child spans)
        ({"span.type": "agent"}, SpanType.AGENT),
        ({"span.type": "llm"}, SpanType.LLM),
        ({"span.type": "tool"}, SpanType.TOOL),
        ({"span.type": "memory"}, SpanType.MEMORY),
        # Test entity.type attribute (used by root agent spans)
        ({"entity.type": "agent"}, SpanType.AGENT),
        ({"entity.type": "llm"}, SpanType.LLM),
        ({"entity.type": "tool"}, SpanType.TOOL),
        ({"entity.type": "memory"}, SpanType.MEMORY),
        # Test span.type takes precedence over entity.type (child span scenario)
        ({"span.type": "llm", "entity.type": "agent"}, SpanType.LLM),
        ({"span.type": "tool", "entity.type": "agent"}, SpanType.TOOL),
        ({"span.type": "memory", "entity.type": "agent"}, SpanType.MEMORY),
        # Test with JSON-encoded values
        ({"span.type": '"llm"', "entity.type": '"agent"'}, SpanType.LLM),
        ({"entity.type": '"agent"'}, SpanType.AGENT),
    ],
)
def test_voltagent_span_type_from_otel(attributes, expected_type):
    result = translate_span_type_from_otel(attributes)
    assert result == expected_type
```

--------------------------------------------------------------------------------

---[FILE: test_inference_table_processor.py]---
Location: mlflow-master/tests/tracing/processor/test_inference_table_processor.py
Signals: Flask

```python
import json
from unittest import mock

import pytest

from mlflow.entities.span import LiveSpan
from mlflow.entities.trace_state import TraceState
from mlflow.tracing.constant import (
    TRACE_SCHEMA_VERSION,
    TRACE_SCHEMA_VERSION_KEY,
    SpanAttributeKey,
    TraceMetadataKey,
)
from mlflow.tracing.processor.inference_table import (
    _HEADER_REQUEST_ID_KEY,
    InferenceTableSpanProcessor,
)
from mlflow.tracing.trace_manager import InMemoryTraceManager
from mlflow.tracing.utils import generate_trace_id_v3
from mlflow.utils.mlflow_tags import MLFLOW_DATABRICKS_MODEL_SERVING_ENDPOINT_NAME

from tests.tracing.helper import (
    create_mock_otel_span,
    create_test_trace_info,
    skip_module_when_testing_trace_sdk,
)

skip_module_when_testing_trace_sdk()

from mlflow.pyfunc.context import Context, set_prediction_context
from mlflow.tracking.fluent import set_active_model

_OTEL_TRACE_ID = 12345
_DATABRICKS_REQUEST_ID = "databricks-request-id"


@pytest.mark.parametrize("context_type", ["mlflow", "flask"])
def test_on_start(context_type):
    # Root span should create a new trace on start
    span = create_mock_otel_span(
        trace_id=_OTEL_TRACE_ID, span_id=1, parent_id=None, start_time=5_000_000
    )
    trace_manager = InMemoryTraceManager.get_instance()
    processor = InferenceTableSpanProcessor(span_exporter=mock.MagicMock())
    model = set_active_model(name="test-model")

    if context_type == "mlflow":
        with set_prediction_context(
            Context(request_id=_DATABRICKS_REQUEST_ID, endpoint_name="test-endpoint")
        ):
            processor.on_start(span)
    else:
        with mock.patch(
            "mlflow.tracing.processor.inference_table._get_flask_request"
        ) as mock_get_flask_request:
            request = mock_get_flask_request.return_value
            request.headers = {_HEADER_REQUEST_ID_KEY: _DATABRICKS_REQUEST_ID}

            processor.on_start(span)

    expected_trace_id = generate_trace_id_v3(span)

    with trace_manager.get_trace(expected_trace_id) as trace:
        # Trace ID should be generated by MLflow
        assert trace.info.trace_id == expected_trace_id
        # Databricks request ID should be set to the client request ID
        assert trace.info.client_request_id == _DATABRICKS_REQUEST_ID
        assert trace.info.experiment_id is None
        assert trace.info.timestamp_ms == 5
        assert trace.info.execution_time_ms is None
        assert trace.info.state == TraceState.IN_PROGRESS

        if context_type == "mlflow":
            assert trace.info.request_metadata == {
                TRACE_SCHEMA_VERSION_KEY: str(TRACE_SCHEMA_VERSION),
                MLFLOW_DATABRICKS_MODEL_SERVING_ENDPOINT_NAME: "test-endpoint",
                TraceMetadataKey.MODEL_ID: model.model_id,
            }

    # Child span should not create a new trace
    child_span = create_mock_otel_span(
        trace_id=_OTEL_TRACE_ID, span_id=2, parent_id=1, start_time=8_000_000
    )

    with set_prediction_context(Context(request_id=_DATABRICKS_REQUEST_ID)):
        processor.on_start(child_span)

    assert child_span.attributes.get(SpanAttributeKey.REQUEST_ID) == json.dumps(expected_trace_id)

    # start time should not be overwritten
    with trace_manager.get_trace(expected_trace_id) as trace:
        assert trace.info.timestamp_ms == 5


def test_on_start_with_experiment_id_env_var(monkeypatch):
    # When the MLFLOW_EXPERIMENT_ID env var is set, it should be populated into the trace info
    monkeypatch.setenv("MLFLOW_EXPERIMENT_ID", "123")

    span = create_mock_otel_span(
        trace_id=_OTEL_TRACE_ID, span_id=1, parent_id=None, start_time=5_000_000
    )
    trace_manager = InMemoryTraceManager.get_instance()
    processor = InferenceTableSpanProcessor(span_exporter=mock.MagicMock())

    with set_prediction_context(Context(request_id=_DATABRICKS_REQUEST_ID)):
        processor.on_start(span)

    expected_trace_id = generate_trace_id_v3(span)
    with trace_manager.get_trace(expected_trace_id) as trace:
        assert trace.info.trace_id == expected_trace_id
        assert trace.info.client_request_id == _DATABRICKS_REQUEST_ID
        assert trace.info.experiment_id == "123"


def test_on_end():
    otel_span = create_mock_otel_span(
        name="foo",
        trace_id=_OTEL_TRACE_ID,
        span_id=1,
        parent_id=None,
        start_time=5_000_000,
        end_time=9_000_000,
    )

    trace_id = generate_trace_id_v3(otel_span)
    trace_info = create_test_trace_info(trace_id, 0)
    trace_manager = InMemoryTraceManager.get_instance()
    trace_manager.register_trace(_OTEL_TRACE_ID, trace_info)

    span = LiveSpan(otel_span, trace_id)
    span.set_status("OK")
    span.set_inputs({"input1": "very long input" * 100})
    span.set_outputs({"output": "very long output" * 100})

    mock_exporter = mock.MagicMock()
    processor = InferenceTableSpanProcessor(span_exporter=mock_exporter)

    processor.on_end(otel_span)

    mock_exporter.export.assert_called_once_with((otel_span,))
    # Trace info should be updated according to the span attributes
    assert trace_info.state == TraceState.OK
    assert trace_info.execution_duration == 4

    # Non-root span should not be exported
    mock_exporter.reset_mock()
    child_span = create_mock_otel_span(trace_id=_OTEL_TRACE_ID, span_id=2, parent_id=1)
    processor.on_end(child_span)
    mock_exporter.export.assert_not_called()


def test_on_end_preserves_user_set_trace_state():
    otel_span = create_mock_otel_span(
        name="foo",
        trace_id=_OTEL_TRACE_ID,
        span_id=1,
        parent_id=None,
        start_time=5_000_000,
        end_time=9_000_000,
    )

    trace_id = generate_trace_id_v3(otel_span)
    trace_info = create_test_trace_info(trace_id, 0)
    trace_manager = InMemoryTraceManager.get_instance()
    trace_manager.register_trace(_OTEL_TRACE_ID, trace_info)

    # Explicitly set trace state to ERROR (user action)
    with trace_manager.get_trace(trace_id) as trace:
        trace.info.state = TraceState.ERROR

    span = LiveSpan(otel_span, trace_id)
    span.set_status("OK")  # Span status is OK
    span.set_inputs({"input1": "test"})
    span.set_outputs({"output": "test"})

    mock_exporter = mock.MagicMock()
    processor = InferenceTableSpanProcessor(span_exporter=mock_exporter)

    processor.on_end(otel_span)

    # Trace state should remain ERROR (user-set), not be overwritten by span status (OK)
    with trace_manager.get_trace(trace_id) as trace:
        assert trace.info.state == TraceState.ERROR
    assert trace_info.execution_duration == 4


def test_on_end_updates_trace_state_when_in_progress():
    otel_span = create_mock_otel_span(
        name="foo",
        trace_id=_OTEL_TRACE_ID,
        span_id=1,
        parent_id=None,
        start_time=5_000_000,
        end_time=9_000_000,
    )

    trace_id = generate_trace_id_v3(otel_span)
    trace_info = create_test_trace_info(trace_id, 0, state=TraceState.IN_PROGRESS)
    trace_manager = InMemoryTraceManager.get_instance()
    trace_manager.register_trace(_OTEL_TRACE_ID, trace_info)

    # Trace state remains IN_PROGRESS (not explicitly set by user)
    with trace_manager.get_trace(trace_id) as trace:
        assert trace.info.state == TraceState.IN_PROGRESS

    span = LiveSpan(otel_span, trace_id)
    span.set_status("ERROR")  # Span status is ERROR
    span.set_inputs({"input1": "test"})
    span.set_outputs({"output": "test"})

    mock_exporter = mock.MagicMock()
    processor = InferenceTableSpanProcessor(span_exporter=mock_exporter)

    processor.on_end(otel_span)

    # Trace state should be updated to ERROR from span status
    with trace_manager.get_trace(trace_id) as trace:
        assert trace.info.state == TraceState.ERROR
    assert trace_info.execution_duration == 4
```

--------------------------------------------------------------------------------

````
