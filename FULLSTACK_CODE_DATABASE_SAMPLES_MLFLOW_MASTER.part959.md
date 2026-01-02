---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 959
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 959 of 991)

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

---[FILE: test_processor.py]---
Location: mlflow-master/tests/tracing/utils/test_processor.py

```python
from unittest.mock import patch

import pytest

import mlflow
from mlflow.exceptions import MlflowException
from mlflow.tracing.utils.processor import validate_span_processors

from tests.tracing.helper import get_traces


@mlflow.trace
def predict(text: str):
    return "Answer: " + text


@pytest.fixture(autouse=True)
def reset_tracing_config():
    """Reset tracing configuration before each test."""
    mlflow.tracing.reset()


def test_span_processors_no_processors_configured():
    mlflow.tracing.configure(span_processors=[])

    predict("test")

    span = get_traces()[0].data.spans[0]
    assert span.inputs == {"text": "test"}
    assert span.outputs == "Answer: test"


def test_span_processors_single_processor_success():
    def test_processor(span):
        span.set_outputs("overridden_output")
        span.set_attribute("test_attribute", "test_value")

    mlflow.tracing.configure(span_processors=[test_processor])

    predict("test")

    span = get_traces()[0].data.spans[0]
    assert span.inputs == {"text": "test"}
    assert span.outputs == "overridden_output"
    assert span.attributes["test_attribute"] == "test_value"


def test_apply_span_processors_multiple_processors_success():
    def processor1(span):
        span.set_outputs("overridden_output_1")
        span.set_attribute("attr_1", "value_1")

    def processor2(span):
        span.set_outputs("overridden_output_2")
        span.set_attribute("attr_2", "value_2")

    mlflow.tracing.configure(span_processors=[processor1, processor2])

    predict("test")

    span = get_traces()[0].data.spans[0]
    assert span.inputs == {"text": "test"}
    assert span.outputs == "overridden_output_2"
    assert span.attributes["attr_1"] == "value_1"
    assert span.attributes["attr_2"] == "value_2"


def test_apply_span_processors_returns_non_none_warning():
    def bad_processor(span):
        return "some_value"  # Should return nothing

    def good_processor(span):
        span.set_outputs("overridden_output")

    with patch("mlflow.tracing.utils.processor._logger") as mock_logger:
        mlflow.tracing.configure(span_processors=[bad_processor, good_processor])

        predict("test")

    mock_logger.warning.assert_called_once()
    message = mock_logger.warning.call_args[0][0]
    assert message.startswith("Span processors ['bad_processor'] returned a non-null value")

    # Other processors should still be applied
    span = get_traces()[0].data.spans[0]
    assert span.outputs == "overridden_output"


def test_apply_span_processors_exception_handling():
    def failing_processor(span):
        raise ValueError("Test error")

    def good_processor(span):
        span.set_outputs("overridden_output")

    with patch("mlflow.tracing.utils.processor._logger") as mock_logger:
        mlflow.tracing.configure(span_processors=[failing_processor, good_processor])

        predict("test")

    span = get_traces()[0].data.spans[0]
    assert span.outputs == "overridden_output"
    mock_logger.warning.assert_called_once()
    message = mock_logger.warning.call_args[0][0]
    assert message.startswith("Span processor failing_processor failed")


def test_validate_span_processors_empty_input():
    assert validate_span_processors(None) == []
    assert validate_span_processors([]) == []


def test_validate_span_processors_valid_processors():
    def processor1(span):
        return None

    def processor2(span):
        return None

    result = validate_span_processors([processor1, processor2])
    assert result == [processor1, processor2]


def test_validate_span_processors_non_callable_raises_exception():
    non_callable_processor = "not_a_function"

    with pytest.raises(MlflowException, match=r"Span processor must be"):
        validate_span_processors([non_callable_processor])


def test_validate_span_processors_invalid_arguments_raises_exception():
    def processor_no_args():
        return None

    with pytest.raises(MlflowException, match=r"Span processor must take"):
        validate_span_processors([processor_no_args])

    def processor_extra_args(span, extra_arg):
        return None

    with pytest.raises(MlflowException, match=r"Span processor must take"):
        validate_span_processors([processor_extra_args])
```

--------------------------------------------------------------------------------

---[FILE: test_prompt.py]---
Location: mlflow-master/tests/tracing/utils/test_prompt.py

```python
import json

import pytest

from mlflow.entities.model_registry import PromptVersion
from mlflow.exceptions import MlflowException
from mlflow.tracing.utils.prompt import update_linked_prompts_tag


def test_update_linked_prompts_tag():
    pv1 = PromptVersion(name="test_prompt", version=1, template="Test template")
    updated_tag_value = update_linked_prompts_tag(None, [pv1])
    assert json.loads(updated_tag_value) == [{"name": "test_prompt", "version": "1"}]

    # Adding multiple prompts to the same trace
    pv2 = PromptVersion(name="test_prompt", version=2, template="Test template 2")
    pv3 = PromptVersion(name="test_prompt_3", version=1, template="Test template 3")
    updated_tag_value = update_linked_prompts_tag(updated_tag_value, [pv2, pv3])
    assert json.loads(updated_tag_value) == [
        {"name": "test_prompt", "version": "1"},
        {"name": "test_prompt", "version": "2"},
        {"name": "test_prompt_3", "version": "1"},
    ]

    # Registering the same prompt should not add it again
    updated_tag_value = update_linked_prompts_tag(updated_tag_value, [pv1])
    assert json.loads(updated_tag_value) == [
        {"name": "test_prompt", "version": "1"},
        {"name": "test_prompt", "version": "2"},
        {"name": "test_prompt_3", "version": "1"},
    ]


def test_update_linked_prompts_tag_invalid_current_tag():
    prompt_version = PromptVersion(name="test_prompt", version=1, template="Test template")

    with pytest.raises(MlflowException, match="Invalid JSON format for 'mlflow.linkedPrompts' tag"):
        update_linked_prompts_tag("invalid json", [prompt_version])

    with pytest.raises(MlflowException, match="Invalid format for 'mlflow.linkedPrompts' tag"):
        update_linked_prompts_tag(json.dumps({"not": "a list"}), [prompt_version])
```

--------------------------------------------------------------------------------

---[FILE: test_search.py]---
Location: mlflow-master/tests/tracing/utils/test_search.py

```python
import pytest

from mlflow.exceptions import MlflowException
from mlflow.tracing.utils.search import _FieldParser, _parse_fields, _ParsedField


@pytest.mark.parametrize(
    ("field", "expected"),
    [
        # no dot
        ("span.inputs", _ParsedField("span", "inputs", None)),
        ("span.outputs", _ParsedField("span", "outputs", None)),
        ("`span`.inputs", _ParsedField("span", "inputs", None)),
        ("`span`.outputs", _ParsedField("span", "outputs", None)),
        ("span.inputs.field", _ParsedField("span", "inputs", "field")),
        ("`span`.inputs.field", _ParsedField("span", "inputs", "field")),
        ("span.inputs.`field`", _ParsedField("span", "inputs", "field")),
        ("`span`.inputs.`field`", _ParsedField("span", "inputs", "field")),
        # dot in span name
        ("`span.name`.inputs.field", _ParsedField("span.name", "inputs", "field")),
        ("`span.inputs.name`.inputs.field", _ParsedField("span.inputs.name", "inputs", "field")),
        (
            "`span.outputs.name`.outputs.field",
            _ParsedField("span.outputs.name", "outputs", "field"),
        ),
        # dot in field name
        ("span.inputs.`field.name`", _ParsedField("span", "inputs", "field.name")),
        ("span.inputs.`field.inputs.name`", _ParsedField("span", "inputs", "field.inputs.name")),
        (
            "span.outputs.`field.outputs.name`",
            _ParsedField("span", "outputs", "field.outputs.name"),
        ),
        # dot in both span and field name
        ("`span.name`.inputs.`field.name`", _ParsedField("span.name", "inputs", "field.name")),
        (
            "`span.inputs.name`.inputs.`field.inputs.name`",
            _ParsedField("span.inputs.name", "inputs", "field.inputs.name"),
        ),
        (
            "`span.outputs.name`.outputs.`field.outputs.name`",
            _ParsedField("span.outputs.name", "outputs", "field.outputs.name"),
        ),
    ],
)
def test_field_parser(field, expected):
    assert _FieldParser(field).parse() == expected


@pytest.mark.parametrize(
    ("input_string", "error_message"),
    [
        ("`span.inputs.field", "Expected closing backtick"),
        ("`span`a.inputs.field", "Expected dot after span name"),
        ("span.foo.field", "Invalid field type"),
        ("span.inputs.`field", "Expected closing backtick"),
        ("span.inputs.`field`name", "Unexpected characters after closing backtick"),
    ],
)
def test_field_parser_invalid_value(input_string, error_message):
    with pytest.raises(MlflowException, match=error_message):
        _FieldParser(input_string).parse()


def test_parse_fields():
    fields = ["span1.inputs", "span2.outputs.field1", "span3.outputs"]
    parsed_fields = _parse_fields(fields)

    assert len(parsed_fields) == 3

    assert parsed_fields[0].span_name == "span1"
    assert parsed_fields[0].field_type == "inputs"
    assert parsed_fields[0].field_name is None

    assert parsed_fields[1].span_name == "span2"
    assert parsed_fields[1].field_type == "outputs"
    assert parsed_fields[1].field_name == "field1"

    assert parsed_fields[2].span_name == "span3"
    assert parsed_fields[2].field_type == "outputs"
    assert parsed_fields[2].field_name is None
```

--------------------------------------------------------------------------------

---[FILE: test_timeout.py]---
Location: mlflow-master/tests/tracing/utils/test_timeout.py

```python
import time
from concurrent.futures import ThreadPoolExecutor
from unittest import mock

import pytest

import mlflow
from mlflow.entities.span_event import SpanEvent
from mlflow.entities.span_status import SpanStatusCode
from mlflow.tracing.export.inference_table import _TRACE_BUFFER, pop_trace
from mlflow.tracing.trace_manager import _Trace
from mlflow.tracing.utils.timeout import MlflowTraceTimeoutCache

from tests.tracing.helper import get_traces, skip_when_testing_trace_sdk


def _mock_span(span_id, parent_id=None):
    span = mock.Mock()
    span.span_id = span_id
    span.parent_id = parent_id
    return span


@pytest.fixture
def cache():
    timeout_cache = MlflowTraceTimeoutCache(timeout=1, maxsize=10)
    yield timeout_cache
    timeout_cache.clear()


def test_expire_traces(cache):
    span_1_1 = _mock_span("span_1")
    span_1_2 = _mock_span("span_2", parent_id="span_1")
    cache["tr_1"] = _Trace(None, span_dict={"span_1": span_1_1, "span_2": span_1_2})
    for _ in range(5):
        if "tr_1" not in cache:
            break
        time.sleep(1)
    else:
        pytest.fail("Trace should be expired within 5 seconds")

    span_1_1.end.assert_called_once()
    span_1_1.set_status.assert_called_once_with(SpanStatusCode.ERROR)
    span_1_1.add_event.assert_called_once()
    event = span_1_1.add_event.call_args[0][0]
    assert isinstance(event, SpanEvent)
    assert event.name == "exception"
    assert event.attributes["exception.message"].startswith("Trace tr_1 is timed out")

    # Non-root span should not be touched
    span_1_2.assert_not_called()


class _SlowModel:
    @mlflow.trace
    def predict(self, x):
        for _ in range(x):
            self.slow_function()
        return

    @mlflow.trace
    def slow_function(self):
        time.sleep(1)


@pytest.mark.skip(
    reason="batch_get_traces only return full traces for now, re-enable this test "
    "when batch_get_traces is updated to support partial traces"
)
def test_trace_halted_after_timeout(monkeypatch):
    # When MLFLOW_TRACE_TIMEOUT_SECONDS is set, MLflow should halt the trace after
    # the timeout and log it to the backend with an error status
    monkeypatch.setenv("MLFLOW_TRACE_TIMEOUT_SECONDS", "3")

    _SlowModel().predict(5)  # takes 5 seconds

    traces = get_traces()
    assert len(traces) == 1
    trace = traces[0]
    assert trace.info.execution_time_ms >= 2900  # Some margin for windows
    assert trace.info.status == SpanStatusCode.ERROR
    assert len(trace.data.spans) >= 3

    root_span = trace.data.spans[0]
    assert root_span.name == "predict"
    assert root_span.status.status_code == SpanStatusCode.ERROR
    assert root_span.events[0].name == "exception"
    assert (
        root_span.events[0]
        .attributes["exception.message"]
        .startswith(f"Trace {trace.info.request_id} is timed out")
    )

    first_span = trace.data.spans[1]
    assert first_span.name == "slow_function"
    assert first_span.status.status_code == SpanStatusCode.OK

    # The rest of the spans should not be logged to the backend.
    in_progress_traces = mlflow.search_traces(
        filter_string="status = 'IN_PROGRESS'",
        return_type="list",
    )
    assert len(in_progress_traces) == 0


@skip_when_testing_trace_sdk
def test_trace_halted_after_timeout_in_model_serving(
    monkeypatch, mock_databricks_serving_with_tracing_env
):
    from mlflow.pyfunc.context import Context, set_prediction_context

    monkeypatch.setenv("MLFLOW_TRACE_TIMEOUT_SECONDS", "3")

    # Simulate model serving env where multiple requests are processed concurrently
    def _run_single(request_id, seconds):
        with set_prediction_context(Context(request_id=request_id)):
            _SlowModel().predict(seconds)

    with ThreadPoolExecutor(max_workers=2) as executor:
        executor.map(_run_single, ["request-id-1", "request-id-2", "request-id-3"], [5, 6, 1])

    # All traces should be logged
    assert len(_TRACE_BUFFER) == 3

    # Long operation should be halted
    assert pop_trace(request_id="request-id-1")["info"]["state"] == SpanStatusCode.ERROR
    assert pop_trace(request_id="request-id-2")["info"]["state"] == SpanStatusCode.ERROR

    # Short operation should complete successfully
    assert pop_trace(request_id="request-id-3")["info"]["state"] == SpanStatusCode.OK


@pytest.mark.skip(
    reason="batch_get_traces only return full traces for now, re-enable this test "
    "when batch_get_traces is updated to support partial traces"
)
def test_handle_timeout_update(monkeypatch):
    # Create a first trace. At this moment, there is no timeout set
    _SlowModel().predict(3)

    traces = get_traces()
    assert len(traces) == 1
    assert traces[0].info.status == SpanStatusCode.OK

    # Update timeout env var after cache creation
    monkeypatch.setenv("MLFLOW_TRACE_TIMEOUT_SECONDS", "1")

    # Create a second trace. This should use the new timeout
    _SlowModel().predict(3)

    traces = get_traces()
    assert len(traces) == 2
    assert traces[0].info.status == SpanStatusCode.ERROR

    # Update timeout to a larger value. Trace should complete successfully
    monkeypatch.setenv("MLFLOW_TRACE_TIMEOUT_SECONDS", "100")
    _SlowModel().predict(3)

    traces = get_traces()
    assert len(traces) == 3
    assert traces[0].info.status == SpanStatusCode.OK
```

--------------------------------------------------------------------------------

---[FILE: test_truncation.py]---
Location: mlflow-master/tests/tracing/utils/test_truncation.py

```python
import json
from unittest.mock import patch

import pytest

from mlflow.tracing.utils.truncation import _get_truncated_preview


@pytest.fixture(autouse=True)
def patch_max_length():
    # Patch max length to 50 to make tests faster
    with patch("mlflow.tracing.utils.truncation._get_max_length", return_value=50):
        yield


@pytest.mark.parametrize(
    ("input_str", "expected"),
    [
        ("short string", "short string"),
        ("{'a': 'b'}", "{'a': 'b'}"),
        ("start" + "a" * 50, "start" + "a" * 42 + "..."),
        (None, ""),
    ],
    ids=["short string", "short json", "long string", "none"],
)
def test_truncate_simple_string(input_str, expected):
    assert _get_truncated_preview(input_str, role="user") == expected


def test_truncate_long_non_message_json():
    input_str = json.dumps(
        {
            "a": "b" + "a" * 30,
            "b": "c" + "a" * 30,
        }
    )
    result = _get_truncated_preview(input_str, role="user")
    assert len(result) == 50
    assert result.startswith('{"a": "b')


_TEST_MESSAGE_HISTORY = [
    {"role": "user", "content": "First"},
    {"role": "assistant", "content": "Second"},
    {"role": "user", "content": "Third" + "a" * 50},
    {"role": "assistant", "content": "Fourth"},
]


@pytest.mark.parametrize(
    "input",
    [
        # ChatCompletion API
        {"messages": _TEST_MESSAGE_HISTORY},
        # Responses API
        {"input": _TEST_MESSAGE_HISTORY},
        # Responses Agent
        {"request": {"input": _TEST_MESSAGE_HISTORY}},
    ],
    ids=["chat_completion", "responses", "responses_agent"],
)
def test_truncate_request_messages(input):
    input_str = json.dumps(input)
    assert _get_truncated_preview(input_str, role="assistant") == "Fourth"
    # Long content should be truncated
    assert _get_truncated_preview(input_str, role="user") == "Third" + "a" * 42 + "..."
    # If non-existing role is provided, return the last message
    assert _get_truncated_preview(input_str, role="system") == "Fourth"


def test_truncate_request_choices():
    input_str = json.dumps(
        {
            "choices": [
                {
                    "index": 1,
                    "message": {"role": "assistant", "content": "First" + "a" * 50},
                    "finish_reason": "stop",
                },
            ],
            "object": "chat.completions",
        }
    )
    assert _get_truncated_preview(input_str, role="assistant").startswith("First")


def test_truncate_multi_content_messages():
    # If text content exists, use it
    assert (
        _get_truncated_preview(
            json.dumps(
                {"messages": [{"role": "user", "content": [{"type": "text", "text": "a" * 60}]}]}
            ),
            role="user",
        )
        == "a" * 47 + "..."
    )

    # Ignore non text content
    assert (
        _get_truncated_preview(
            json.dumps(
                {
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {"type": "text", "text": "a" * 60},
                                {"type": "image", "image_url": "http://example.com/image.jpg"},
                            ],
                        },
                    ]
                }
            ),
            role="user",
        )
        == "a" * 47 + "..."
    )

    # If non-text content exists, truncate the full json as-is
    assert _get_truncated_preview(
        json.dumps(
            {
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "image_url": "http://example.com/image.jpg" + "a" * 50,
                            }
                        ],
                    },
                ]
            }
        ),
        role="user",
    ).startswith('{"messages":')


def test_truncate_responses_api_output():
    input_str = json.dumps(
        {
            "output": [
                {
                    "type": "message",
                    "id": "test",
                    "role": "assistant",
                    "content": [{"type": "output_text", "text": "a" * 60}],
                }
            ],
        }
    )

    assert _get_truncated_preview(input_str, role="assistant") == "a" * 47 + "..."


@pytest.mark.parametrize(
    "input_data",
    [
        {"messages": 123, "long_data": "a" * 50},
        {"messages": []},
        {"input": "string"},
        {"output": 123},
        {"choices": {"0": "value"}},
        {"request": "string"},
        {"choices": [{"message": "not a dict"}]},
        {"choices": [{"message": {"role": "user"}}]},
    ],
)
def test_truncate_invalid_messages(input_data):
    input_str = json.dumps(input_data)
    result = _get_truncated_preview(input_str, role="user")
    if "long_data" in input_data:
        assert len(result) == 50
        assert result.startswith(input_str[:20])
    else:
        assert result == input_str


@pytest.mark.parametrize(
    ("request_data", "expected_content", "should_not_contain"),
    [
        (
            {"request": {"input": [{"role": "user", "content": "Hello"}]}},
            "Hello",
            "request",
        ),
        (
            {"request": {"tool_choice": None, "input": [{"role": "user", "content": "Weather?"}]}},
            "Weather?",
            '"tool_choice"',
        ),
        (
            {"request": {"input": [{"role": "user", "content": "Hi"}]}},
            "Hi",
            '"request"',
        ),
    ],
    ids=["short_structured_json", "agent_format_with_null_fields", "responses_agent_short"],
)
def test_truncate_structured_json_extracts_content(
    request_data, expected_content, should_not_contain
):
    input_str = json.dumps(request_data)
    result = _get_truncated_preview(input_str, role="user")
    assert result == expected_content
    assert should_not_contain not in result


@pytest.mark.parametrize(
    ("content_value", "expected_in_result"),
    [
        (None, '"content": null'),
        ("", '"content": ""'),
        (123, '"content": 123'),
    ],
    ids=["null_content", "empty_string_content", "numeric_content"],
)
def test_truncate_invalid_content_falls_back_to_json(content_value, expected_in_result):
    request_data = {"input": [{"role": "user", "content": content_value}]}
    input_str = json.dumps(request_data)
    result = _get_truncated_preview(input_str, role="user")
    assert expected_in_result in result or result.endswith("...")
```

--------------------------------------------------------------------------------

---[FILE: test_utils.py]---
Location: mlflow-master/tests/tracing/utils/test_utils.py
Signals: Pydantic

```python
import json
from unittest import mock
from unittest.mock import Mock, patch

import pytest
from opentelemetry import trace as trace_api
from pydantic import ValidationError

import mlflow
from mlflow.entities import (
    LiveSpan,
    SpanType,
)
from mlflow.entities.span import SpanType
from mlflow.entities.trace_location import UCSchemaLocation
from mlflow.exceptions import MlflowException
from mlflow.tracing import set_span_chat_tools
from mlflow.tracing.constant import (
    TRACE_ID_V4_PREFIX,
    SpanAttributeKey,
    TokenUsageKey,
)
from mlflow.tracing.utils import (
    _calculate_percentile,
    aggregate_usage_from_spans,
    capture_function_input_args,
    construct_full_inputs,
    encode_span_id,
    encode_trace_id,
    generate_trace_id_v4,
    generate_trace_id_v4_from_otel_trace_id,
    get_active_spans_table_name,
    get_otel_attribute,
    maybe_get_request_id,
    parse_trace_id_v4,
)

from tests.tracing.helper import create_mock_otel_span


def test_capture_function_input_args_does_not_raise():
    # Exception during inspecting inputs: trace should be logged without inputs field
    with patch("inspect.signature", side_effect=ValueError("Some error")) as mock_input_args:
        args = capture_function_input_args(lambda: None, (), {})

    assert args is None
    assert mock_input_args.call_count > 0


def test_duplicate_span_names():
    span_names = ["red", "red", "blue", "red", "green", "blue"]

    spans = [
        LiveSpan(create_mock_otel_span("trace_id", span_id=i, name=span_name), trace_id="tr-123")
        for i, span_name in enumerate(span_names)
    ]

    assert [span.name for span in spans] == span_names
    # Check if the span order is preserved
    assert [span.span_id for span in spans] == [encode_span_id(i) for i in [0, 1, 2, 3, 4, 5]]


def test_aggregate_usage_from_spans():
    spans = [
        LiveSpan(create_mock_otel_span("trace_id", span_id=i, name=f"span_{i}"), trace_id="tr-123")
        for i in range(3)
    ]
    spans[0].set_attribute(
        SpanAttributeKey.CHAT_USAGE,
        {
            TokenUsageKey.INPUT_TOKENS: 10,
            TokenUsageKey.OUTPUT_TOKENS: 20,
            TokenUsageKey.TOTAL_TOKENS: 30,
        },
    )
    spans[1].set_attribute(
        SpanAttributeKey.CHAT_USAGE,
        {TokenUsageKey.OUTPUT_TOKENS: 15, TokenUsageKey.TOTAL_TOKENS: 15},
    )
    spans[2].set_attribute(
        SpanAttributeKey.CHAT_USAGE,
        {
            TokenUsageKey.INPUT_TOKENS: 5,
            TokenUsageKey.OUTPUT_TOKENS: 10,
            TokenUsageKey.TOTAL_TOKENS: 15,
        },
    )

    usage = aggregate_usage_from_spans(spans)
    assert usage == {
        TokenUsageKey.INPUT_TOKENS: 15,
        TokenUsageKey.OUTPUT_TOKENS: 45,
        TokenUsageKey.TOTAL_TOKENS: 60,
    }


def test_aggregate_usage_from_spans_skips_descendant_usage():
    spans = [
        LiveSpan(create_mock_otel_span("trace_id", span_id=1, name="root"), trace_id="tr-123"),
        LiveSpan(
            create_mock_otel_span("trace_id", span_id=2, name="child", parent_id=1),
            trace_id="tr-123",
        ),
        LiveSpan(
            create_mock_otel_span("trace_id", span_id=3, name="grandchild", parent_id=2),
            trace_id="tr-123",
        ),
        LiveSpan(
            create_mock_otel_span("trace_id", span_id=4, name="independent"), trace_id="tr-123"
        ),
    ]

    spans[0].set_attribute(
        SpanAttributeKey.CHAT_USAGE,
        {
            TokenUsageKey.INPUT_TOKENS: 10,
            TokenUsageKey.OUTPUT_TOKENS: 20,
            TokenUsageKey.TOTAL_TOKENS: 30,
        },
    )

    spans[2].set_attribute(
        SpanAttributeKey.CHAT_USAGE,
        {
            TokenUsageKey.INPUT_TOKENS: 5,
            TokenUsageKey.OUTPUT_TOKENS: 10,
            TokenUsageKey.TOTAL_TOKENS: 15,
        },
    )

    spans[3].set_attribute(
        SpanAttributeKey.CHAT_USAGE,
        {
            TokenUsageKey.INPUT_TOKENS: 3,
            TokenUsageKey.OUTPUT_TOKENS: 6,
            TokenUsageKey.TOTAL_TOKENS: 9,
        },
    )

    usage = aggregate_usage_from_spans(spans)

    assert usage == {
        TokenUsageKey.INPUT_TOKENS: 13,
        TokenUsageKey.OUTPUT_TOKENS: 26,
        TokenUsageKey.TOTAL_TOKENS: 39,
    }


def test_maybe_get_request_id():
    assert maybe_get_request_id(is_evaluate=True) is None

    try:
        from mlflow.pyfunc.context import Context, set_prediction_context
    except ImportError:
        pytest.skip("Skipping the rest of tests as mlflow.pyfunc module is not available.")

    with set_prediction_context(Context(request_id="eval", is_evaluate=True)):
        assert maybe_get_request_id(is_evaluate=True) == "eval"

    with set_prediction_context(Context(request_id="non_eval", is_evaluate=False)):
        assert maybe_get_request_id(is_evaluate=True) is None


def test_set_chat_tools_validation():
    tools = [
        {
            "type": "unsupported_function",
            "unsupported_function": {
                "name": "test",
            },
        }
    ]

    @mlflow.trace(span_type=SpanType.CHAT_MODEL)
    def dummy_call(tools):
        span = mlflow.get_current_active_span()
        set_span_chat_tools(span, tools)
        return None

    with pytest.raises(ValidationError, match="validation error for ChatTool"):
        dummy_call(tools)


@pytest.mark.parametrize(
    ("enum_values", "param_type"),
    [
        ([1, 2, 3, 4, 5], "integer"),
        (["option1", "option2", "option3"], "string"),
        ([1.1, 2.5, 3.7], "number"),
        ([True, False], "boolean"),
        (["mixed", 42, True, 3.14], "string"),  # Mixed types with string base type
    ],
)
def test_openai_parse_tools_enum_validation(enum_values, param_type):
    from mlflow.openai.utils.chat_schema import _parse_tools

    # Simulate the exact OpenAI autologging input that was failing
    openai_inputs = {
        "tools": [
            {
                "type": "function",
                "function": {
                    "name": "select_option",
                    "description": "Select an option from the given choices",
                    "parameters": {
                        "type": "object",
                        "properties": {"option": {"type": param_type, "enum": enum_values}},
                        "required": ["option"],
                    },
                },
            }
        ]
    }

    # This should not raise a ValidationError - tests the actual failing code path
    parsed_tools = _parse_tools(openai_inputs)
    assert len(parsed_tools) == 1
    assert parsed_tools[0].function.name == "select_option"
    assert parsed_tools[0].function.parameters.properties["option"].enum == enum_values


def test_construct_full_inputs_simple_function():
    def func(a, b, c=3, d=4, **kwargs):
        pass

    result = construct_full_inputs(func, 1, 2)
    assert result == {"a": 1, "b": 2}

    result = construct_full_inputs(func, 1, 2, c=30)
    assert result == {"a": 1, "b": 2, "c": 30}

    result = construct_full_inputs(func, 1, 2, c=30, d=40, e=50)
    assert result == {"a": 1, "b": 2, "c": 30, "d": 40, "kwargs": {"e": 50}}

    def no_args_func():
        pass

    result = construct_full_inputs(no_args_func)
    assert result == {}

    class TestClass:
        def func(self, a, b, c=3, d=4, **kwargs):
            pass

    result = construct_full_inputs(TestClass().func, 1, 2)
    assert result == {"a": 1, "b": 2}


def test_calculate_percentile():
    # Test empty list
    assert _calculate_percentile([], 0.5) == 0.0

    # Test single element
    assert _calculate_percentile([100], 0.25) == 100
    assert _calculate_percentile([100], 0.5) == 100
    assert _calculate_percentile([100], 0.75) == 100

    # Test two elements
    assert _calculate_percentile([10, 20], 0.0) == 10
    assert _calculate_percentile([10, 20], 0.5) == 15  # Linear interpolation
    assert _calculate_percentile([10, 20], 1.0) == 20

    # Test odd number of elements
    data = [10, 20, 30, 40, 50]
    assert _calculate_percentile(data, 0.0) == 10
    assert _calculate_percentile(data, 0.25) == 20
    assert _calculate_percentile(data, 0.5) == 30  # Median
    assert _calculate_percentile(data, 0.75) == 40
    assert _calculate_percentile(data, 1.0) == 50

    # Test even number of elements
    data = [10, 20, 30, 40]
    assert _calculate_percentile(data, 0.0) == 10
    assert _calculate_percentile(data, 0.25) == 17.5  # Between 10 and 20
    assert _calculate_percentile(data, 0.5) == 25  # Between 20 and 30
    assert _calculate_percentile(data, 0.75) == 32.5  # Between 30 and 40
    assert _calculate_percentile(data, 1.0) == 40

    # Test with larger dataset
    data = list(range(1, 101))  # 1 to 100
    assert _calculate_percentile(data, 0.25) == 25.75
    assert _calculate_percentile(data, 0.5) == 50.5


def test_parse_trace_id_v4():
    test_trace_id = "tr-original-trace-123"

    v4_id_uc_schema = f"{TRACE_ID_V4_PREFIX}catalog.schema/{test_trace_id}"
    location, parsed_id = parse_trace_id_v4(v4_id_uc_schema)
    assert location == "catalog.schema"
    assert parsed_id == test_trace_id

    v4_id_experiment = f"{TRACE_ID_V4_PREFIX}experiment_id/{test_trace_id}"
    location, parsed_id = parse_trace_id_v4(v4_id_experiment)
    assert location == "experiment_id"
    assert parsed_id == test_trace_id

    location, parsed_id = parse_trace_id_v4(test_trace_id)
    assert location is None
    assert parsed_id == test_trace_id


def test_parse_trace_id_v4_invalid_format():
    with pytest.raises(MlflowException, match="Invalid trace ID format"):
        parse_trace_id_v4(f"{TRACE_ID_V4_PREFIX}123")

    with pytest.raises(MlflowException, match="Invalid trace ID format"):
        parse_trace_id_v4(f"{TRACE_ID_V4_PREFIX}123/")

    with pytest.raises(MlflowException, match="Invalid trace ID format"):
        parse_trace_id_v4(f"{TRACE_ID_V4_PREFIX}catalog.schema/../invalid-trace-id")

    with pytest.raises(MlflowException, match="Invalid trace ID format"):
        parse_trace_id_v4(f"{TRACE_ID_V4_PREFIX}catalog.schema/invalid-trace-id/invalid-format")


def test_get_otel_attribute_existing_attribute():
    # Create a mock span with attributes
    span = Mock(spec=trace_api.Span)
    span.attributes = {
        "test_key": json.dumps({"data": "value"}),
        "string_key": json.dumps("simple_string"),
        "number_key": json.dumps(42),
        "boolean_key": json.dumps(True),
        "list_key": json.dumps([1, 2, 3]),
    }

    # Test various data types
    result = get_otel_attribute(span, "test_key")
    assert result == {"data": "value"}

    result = get_otel_attribute(span, "string_key")
    assert result == "simple_string"

    result = get_otel_attribute(span, "number_key")
    assert result == 42

    result = get_otel_attribute(span, "boolean_key")
    assert result is True

    result = get_otel_attribute(span, "list_key")
    assert result == [1, 2, 3]


def test_get_otel_attribute_missing_attribute():
    # Create a mock span with empty attributes
    span = Mock(spec=trace_api.Span)
    span.attributes = {}

    result = get_otel_attribute(span, "nonexistent_key")
    assert result is None


def test_get_otel_attribute_none_attribute():
    # Create a mock span where attributes.get() returns None
    span = Mock(spec=trace_api.Span)
    span.attributes = Mock()
    span.attributes.get.return_value = None

    result = get_otel_attribute(span, "any_key")
    assert result is None


def test_get_otel_attribute_invalid_json():
    # Create a mock span with invalid JSON
    span = Mock(spec=trace_api.Span)
    span.attributes = {
        "invalid_json": "not valid json {",
        "empty_string": "",
    }

    result = get_otel_attribute(span, "invalid_json")
    assert result is None

    result = get_otel_attribute(span, "empty_string")
    assert result is None


def test_get_otel_attribute_non_string_attribute():
    # In some edge cases, attributes might contain non-string values
    span = Mock(spec=trace_api.Span)
    span.attributes = {
        "number_value": 123,  # Not a JSON string
        "boolean_value": True,  # Not a JSON string
    }

    # These should fail gracefully and return None
    result = get_otel_attribute(span, "number_value")
    assert result is None

    result = get_otel_attribute(span, "boolean_value")
    assert result is None


def test_generate_trace_id_v4_with_uc_schema():
    span = create_mock_otel_span(trace_id=12345, span_id=1)
    uc_schema = "catalog.schema"

    with mock.patch(
        "mlflow.tracing.utils.construct_trace_id_v4", return_value="trace:/catalog.schema/abc123"
    ) as mock_construct:
        result = generate_trace_id_v4(span, uc_schema)

        mock_construct.assert_called_once_with(uc_schema, mock.ANY)
        assert result == "trace:/catalog.schema/abc123"


def test_get_spans_table_name_for_trace_with_destination():
    mock_destination = UCSchemaLocation(catalog_name="catalog", schema_name="schema")

    with mock.patch("mlflow.tracing.provider._MLFLOW_TRACE_USER_DESTINATION") as mock_ctx:
        mock_ctx.get.return_value = mock_destination

        result = get_active_spans_table_name()
        assert result == "catalog.schema.mlflow_experiment_trace_otel_spans"


def test_get_spans_table_name_for_trace_no_destination():
    with mock.patch("mlflow.tracing.provider._MLFLOW_TRACE_USER_DESTINATION") as mock_ctx:
        mock_ctx.get.return_value = None

        result = get_active_spans_table_name()
        assert result is None


def test_generate_trace_id_v4_from_otel_trace_id():
    otel_trace_id = 0x12345678901234567890123456789012
    location = "catalog.schema"

    result = generate_trace_id_v4_from_otel_trace_id(otel_trace_id, location)

    # Verify the format is trace:/<location>/<hex_trace_id>
    assert result.startswith(f"{TRACE_ID_V4_PREFIX}{location}/")

    # Extract and verify the hex trace ID part
    expected_hex_id = encode_trace_id(otel_trace_id)
    assert result == f"{TRACE_ID_V4_PREFIX}{location}/{expected_hex_id}"

    # Verify it can be parsed back
    parsed_location, parsed_id = parse_trace_id_v4(result)
    assert parsed_location == location
    assert parsed_id == expected_hex_id
```

--------------------------------------------------------------------------------

---[FILE: test_warning.py]---
Location: mlflow-master/tests/tracing/utils/test_warning.py

```python
import logging
import warnings

import mlflow
from mlflow.tracing.utils.warning import suppress_warning

from tests.tracing.helper import skip_when_testing_trace_sdk


def test_suppress_token_detach_warning(caplog):
    logger = logging.getLogger("opentelemetry.context")
    logger.setLevel(logging.INFO)
    logger.removeFilter(logger.filters[0])

    logger.exception("Failed to detach context")
    assert caplog.records[0].message == "Failed to detach context"
    assert caplog.records[0].levelname == "ERROR"

    suppress_warning("opentelemetry.context", "Failed to detach context")

    logger.exception("Failed to detach context")
    assert len(caplog.records) == 1  # If the log level is not debug, the log shouldn't be recorded

    logger.exception("Another error")  # Other type of error log should still be recorded
    assert len(caplog.records) == 2
    assert caplog.records[1].message == "Another error"

    # If we change the log level to debug, the log should be recorded at the debug level
    logger.setLevel(logging.DEBUG)

    logger.exception("Failed to detach context")

    assert caplog.records[2].message == "Failed to detach context"
    assert caplog.records[2].levelname == "DEBUG"


@skip_when_testing_trace_sdk
def test_request_id_backward_compatible():
    client = mlflow.MlflowClient()

    parent_span = client.start_trace(name="test")

    with warnings.catch_warnings(record=True) as w:
        warnings.simplefilter("always")

        child_span = client.start_span(
            request_id=parent_span.trace_id,
            name="child",
            parent_id=parent_span.span_id,
        )

        assert len(w) == 1
        assert issubclass(w[0].category, FutureWarning)
        assert "request_id" in str(w[0].message)
        assert "deprecated" in str(w[0].message).lower()
        assert "trace_id" in str(w[0].message)
        assert child_span.trace_id == parent_span.trace_id

    with warnings.catch_warnings(record=True) as w:
        warnings.simplefilter("always")

        client.end_span(request_id=parent_span.trace_id, span_id=child_span.span_id)
        client.end_trace(request_id=parent_span.trace_id)

        assert len(w) == 2
        assert all(issubclass(warn.category, FutureWarning) for warn in w)
        assert all("request_id" in str(warn.message) for warn in w)

    # Valid usage without request_id -> no warning
    with warnings.catch_warnings(record=True) as w:
        warnings.simplefilter("always")

        trace = mlflow.get_trace(parent_span.trace_id)

        assert len(w) == 0
        assert trace.info.trace_id == parent_span.trace_id

    with warnings.catch_warnings(record=True):
        warnings.simplefilter("always")

        try:
            client.get_trace(request_id="abc", trace_id="def")
            assert False, "Should have raised ValueError"
        except ValueError as e:
            assert "Cannot specify both" in str(e)
            assert "request_id" in str(e)
            assert "trace_id" in str(e)
```

--------------------------------------------------------------------------------

---[FILE: conftest.py]---
Location: mlflow-master/tests/tracking/conftest.py

```python
import pytest

import mlflow


@pytest.fixture
def reset_active_experiment():
    yield
    mlflow.tracking.fluent._active_experiment_id = None
```

--------------------------------------------------------------------------------

````
