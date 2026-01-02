---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 820
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 820 of 991)

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

---[FILE: test_judge_tool_list_spans.py]---
Location: mlflow-master/tests/genai/judges/test_judge_tool_list_spans.py

```python
from unittest import mock

import pytest

from mlflow.entities.span import Span
from mlflow.entities.span_status import SpanStatus, SpanStatusCode
from mlflow.entities.trace import Trace
from mlflow.entities.trace_data import TraceData
from mlflow.entities.trace_info import TraceInfo
from mlflow.entities.trace_location import TraceLocation
from mlflow.entities.trace_state import TraceState
from mlflow.genai.judges.tools.list_spans import ListSpansResult, ListSpansTool
from mlflow.genai.judges.tools.types import SpanInfo
from mlflow.types.llm import ToolDefinition


def test_list_spans_tool_name():
    tool = ListSpansTool()
    assert tool.name == "list_spans"


def test_list_spans_tool_get_definition():
    tool = ListSpansTool()
    definition = tool.get_definition()

    assert isinstance(definition, ToolDefinition)
    assert definition.function.name == "list_spans"
    assert "List information about spans within a trace" in definition.function.description
    assert definition.function.parameters.type == "object"
    assert definition.function.parameters.required == []
    assert definition.type == "function"


@pytest.fixture
def mock_trace_with_spans():
    """Fixture that creates a test Trace object with multiple spans."""
    # Create mock spans with required properties
    mock_span1 = mock.Mock(spec=Span)
    mock_span1.span_id = "span-1"
    mock_span1.name = "root_span"
    mock_span1.span_type = "CHAIN"
    mock_span1.start_time_ns = 1234567890000000000
    mock_span1.end_time_ns = 1234567891000000000
    mock_span1.parent_id = None
    mock_span1.status = SpanStatus(SpanStatusCode.OK)
    mock_span1.attributes = {"mlflow.spanType": "CHAIN", "custom_attr": "value1"}

    mock_span2 = mock.Mock(spec=Span)
    mock_span2.span_id = "span-2"
    mock_span2.name = "child_span"
    mock_span2.span_type = "TOOL"
    mock_span2.start_time_ns = 1234567890500000000
    mock_span2.end_time_ns = 1234567890800000000
    mock_span2.parent_id = "span-1"
    mock_span2.status = SpanStatus(SpanStatusCode.OK)
    mock_span2.attributes = {"mlflow.spanType": "TOOL"}

    trace_info = TraceInfo(
        trace_id="test-trace",
        trace_location=TraceLocation.from_experiment_id("0"),
        request_time=1234567890,
        state=TraceState.OK,
    )
    trace_data = TraceData(request="{}", response="{}", spans=[mock_span1, mock_span2])
    return Trace(info=trace_info, data=trace_data)


def test_list_spans_tool_invoke_success(mock_trace_with_spans):
    tool = ListSpansTool()
    result = tool.invoke(mock_trace_with_spans)

    assert isinstance(result, ListSpansResult)
    assert len(result.spans) == 2
    assert result.next_page_token is None

    # Check first span
    span1 = result.spans[0]
    assert isinstance(span1, SpanInfo)
    assert span1.span_id == "span-1"
    assert span1.name == "root_span"
    assert span1.span_type == "CHAIN"
    assert span1.is_root is True
    assert span1.parent_id is None
    assert span1.duration_ms == 1000.0  # 1 second
    assert span1.attribute_names == ["mlflow.spanType", "custom_attr"]

    # Check second span
    span2 = result.spans[1]
    assert span2.span_id == "span-2"
    assert span2.name == "child_span"
    assert span2.span_type == "TOOL"
    assert span2.is_root is False
    assert span2.parent_id == "span-1"
    assert span2.duration_ms == 300.0  # 0.3 seconds


def test_list_spans_tool_invoke_none_trace():
    tool = ListSpansTool()
    result = tool.invoke(None)

    assert isinstance(result, ListSpansResult)
    assert len(result.spans) == 0
    assert result.next_page_token is None


def test_list_spans_tool_invoke_empty_trace():
    trace_info = TraceInfo(
        trace_id="empty-trace",
        trace_location=TraceLocation.from_experiment_id("0"),
        request_time=1234567890,
        state=TraceState.OK,
    )
    trace_data = TraceData(request="{}", response="{}", spans=[])
    empty_trace = Trace(info=trace_info, data=trace_data)

    tool = ListSpansTool()
    result = tool.invoke(empty_trace)

    assert isinstance(result, ListSpansResult)
    assert len(result.spans) == 0
    assert result.next_page_token is None


def test_list_spans_tool_invoke_with_pagination(mock_trace_with_spans):
    tool = ListSpansTool()

    # Test with max_results=1
    result = tool.invoke(mock_trace_with_spans, max_results=1)
    assert len(result.spans) == 1
    assert result.next_page_token == "1"
    assert result.spans[0].name == "root_span"

    # Test second page
    result = tool.invoke(mock_trace_with_spans, max_results=1, page_token="1")
    assert len(result.spans) == 1
    assert result.next_page_token is None
    assert result.spans[0].name == "child_span"


def test_list_spans_tool_invoke_invalid_page_token(mock_trace_with_spans):
    from mlflow.exceptions import MlflowException

    tool = ListSpansTool()

    # Test with invalid string token - should raise exception
    with pytest.raises(
        MlflowException, match="Invalid page_token 'invalid': must be a valid integer"
    ):
        tool.invoke(mock_trace_with_spans, page_token="invalid")

    # Test with non-string invalid token - should raise exception
    with pytest.raises(
        MlflowException, match="Invalid page_token '\\[\\]': must be a valid integer"
    ):
        tool.invoke(mock_trace_with_spans, page_token=[])
```

--------------------------------------------------------------------------------

---[FILE: test_judge_tool_registry.py]---
Location: mlflow-master/tests/genai/judges/test_judge_tool_registry.py

```python
import inspect
import json

import pytest

import mlflow
from mlflow.entities.span import SpanType
from mlflow.entities.trace import Trace
from mlflow.entities.trace_info import TraceInfo
from mlflow.entities.trace_location import TraceLocation
from mlflow.entities.trace_state import TraceState
from mlflow.exceptions import MlflowException
from mlflow.genai.judges.tools import (
    JudgeToolRegistry,
    invoke_judge_tool,
    list_judge_tools,
    register_judge_tool,
)
from mlflow.genai.judges.tools.base import JudgeTool
from mlflow.genai.judges.tools.constants import ToolNames
from mlflow.types.llm import FunctionToolCallArguments, ToolCall, ToolDefinition


@pytest.fixture
def restore_global_registry():
    from mlflow.genai.judges.tools.registry import _judge_tool_registry

    original_tools = _judge_tool_registry._tools.copy()
    yield
    _judge_tool_registry._tools = original_tools


class MockTool(JudgeTool):
    @property
    def name(self) -> str:
        return "mock_tool"

    def get_definition(self) -> ToolDefinition:
        return ToolDefinition(
            function={
                "name": "mock_tool",
                "description": "A mock tool for testing",
                "parameters": {"type": "object", "properties": {}, "required": []},
            },
            type="function",
        )

    def invoke(self, trace: Trace, **kwargs) -> str:
        return f"mock_result_with_{len(kwargs)}_args"


def test_registry_register_and_list_tools():
    registry = JudgeToolRegistry()
    mock_tool = MockTool()

    assert len(registry.list_tools()) == 0

    registry.register(mock_tool)

    tools = registry.list_tools()
    assert len(tools) == 1
    assert tools[0].name == "mock_tool"


@pytest.mark.parametrize("tracing_enabled", [True, False])
def test_registry_invoke_tool_success(tracing_enabled, monkeypatch):
    if tracing_enabled:
        monkeypatch.setenv("MLFLOW_GENAI_EVAL_ENABLE_SCORER_TRACING", "true")

    registry = JudgeToolRegistry()
    mock_tool = MockTool()
    registry.register(mock_tool)

    trace_info = TraceInfo(
        trace_id="test-trace-id",
        trace_location=TraceLocation.from_experiment_id("0"),
        request_time=1234567890,
        state=TraceState.OK,
        execution_duration=100,
    )
    trace = Trace(info=trace_info, data=None)

    tool_call = ToolCall(
        function=FunctionToolCallArguments(
            name="mock_tool", arguments=json.dumps({"param": "value"})
        )
    )

    result = registry.invoke(tool_call, trace)
    assert result == "mock_result_with_1_args"

    if tracing_enabled:
        traces = mlflow.search_traces(return_type="list")
        assert len(traces) == 1
        # Tool itself only creates one span. In real case, it will be under the parent scorer trace.
        assert len(traces[0].data.spans) == 1
        assert traces[0].data.spans[0].name == "mock_tool"
        assert traces[0].data.spans[0].span_type == SpanType.TOOL


def test_registry_invoke_tool_not_found():
    registry = JudgeToolRegistry()

    trace_info = TraceInfo(
        trace_id="test-trace-id",
        trace_location=TraceLocation.from_experiment_id("0"),
        request_time=1234567890,
        state=TraceState.OK,
        execution_duration=100,
    )
    trace = Trace(info=trace_info, data=None)

    tool_call = ToolCall(
        function=FunctionToolCallArguments(name="nonexistent_tool", arguments=json.dumps({}))
    )

    with pytest.raises(MlflowException, match="Tool 'nonexistent_tool' not found in registry"):
        registry.invoke(tool_call, trace)


def test_registry_invoke_tool_invalid_json():
    registry = JudgeToolRegistry()
    mock_tool = MockTool()
    registry.register(mock_tool)

    trace_info = TraceInfo(
        trace_id="test-trace-id",
        trace_location=TraceLocation.from_experiment_id("0"),
        request_time=1234567890,
        state=TraceState.OK,
        execution_duration=100,
    )
    trace = Trace(info=trace_info, data=None)

    tool_call = ToolCall(
        function=FunctionToolCallArguments(name="mock_tool", arguments="invalid json {{")
    )

    with pytest.raises(MlflowException, match="Invalid JSON arguments for tool 'mock_tool'"):
        registry.invoke(tool_call, trace)


def test_registry_invoke_tool_invalid_arguments():
    registry = JudgeToolRegistry()

    class StrictTool(JudgeTool):
        @property
        def name(self) -> str:
            return "strict_tool"

        def get_definition(self) -> ToolDefinition:
            return ToolDefinition(function={}, type="function")

        def invoke(self, trace: Trace, required_param: str) -> str:
            return f"result_{required_param}"

    strict_tool = StrictTool()
    registry.register(strict_tool)

    trace_info = TraceInfo(
        trace_id="test-trace-id",
        trace_location=TraceLocation.from_experiment_id("0"),
        request_time=1234567890,
        state=TraceState.OK,
        execution_duration=100,
    )
    trace = Trace(info=trace_info, data=None)

    tool_call = ToolCall(
        function=FunctionToolCallArguments(name="strict_tool", arguments=json.dumps({}))
    )

    with pytest.raises(MlflowException, match="Invalid arguments for tool 'strict_tool'"):
        registry.invoke(tool_call, trace)


def test_global_functions_work(restore_global_registry):
    mock_tool = MockTool()
    register_judge_tool(mock_tool)

    tools = list_judge_tools()
    tool_names = [t.name for t in tools]
    assert "mock_tool" in tool_names

    trace_info = TraceInfo(
        trace_id="test-trace-id",
        trace_location=TraceLocation.from_experiment_id("0"),
        request_time=1234567890,
        state=TraceState.OK,
        execution_duration=100,
    )
    trace = Trace(info=trace_info, data=None)

    tool_call = ToolCall(
        function=FunctionToolCallArguments(name="mock_tool", arguments=json.dumps({}))
    )

    result = invoke_judge_tool(tool_call, trace)
    assert result == "mock_result_with_0_args"


def test_builtin_tools_are_properly_registered():
    tools = list_judge_tools()
    registered_tool_names = {t.name for t in tools if not isinstance(t, MockTool)}

    # Only include tool constants that don't start with underscore (public tools)
    all_tool_constants = {
        value
        for name, value in inspect.getmembers(ToolNames)
        if not name.startswith("_") and isinstance(value, str)
    }

    assert all_tool_constants == registered_tool_names

    for tool in tools:
        if tool.name in all_tool_constants:
            assert isinstance(tool, JudgeTool)
```

--------------------------------------------------------------------------------

---[FILE: test_judge_tool_search_traces.py]---
Location: mlflow-master/tests/genai/judges/test_judge_tool_search_traces.py

```python
from unittest import mock

import pytest

from mlflow.entities.assessment import Expectation, Feedback
from mlflow.entities.assessment_error import AssessmentError
from mlflow.entities.assessment_source import AssessmentSource, AssessmentSourceType
from mlflow.entities.span import Span
from mlflow.entities.trace import Trace
from mlflow.entities.trace_data import TraceData
from mlflow.entities.trace_info import TraceInfo
from mlflow.entities.trace_location import TraceLocation, TraceLocationType
from mlflow.entities.trace_state import TraceState
from mlflow.exceptions import MlflowException
from mlflow.genai.judges.tools.search_traces import (
    SearchTracesTool,
    _convert_assessments_to_tool_types,
    _get_experiment_id,
)
from mlflow.genai.judges.tools.types import (
    JudgeToolExpectation,
    JudgeToolFeedback,
    JudgeToolTraceInfo,
)
from mlflow.tracing.constant import SpanAttributeKey
from mlflow.types.llm import ToolDefinition

from tests.tracing.helper import create_mock_otel_span


def test_search_traces_tool_name() -> None:
    tool = SearchTracesTool()
    assert tool.name == "_search_traces"


def test_search_traces_tool_get_definition() -> None:
    tool = SearchTracesTool()
    definition = tool.get_definition()

    assert isinstance(definition, ToolDefinition)
    assert definition.function.name == "_search_traces"
    assert "Search for traces within the same MLflow experiment" in definition.function.description
    assert definition.function.parameters.type == "object"
    assert definition.function.parameters.required == []
    assert definition.type == "function"

    properties = definition.function.parameters.properties
    assert "filter_string" in properties
    assert "order_by" in properties
    assert "max_results" in properties


def test_convert_assessments_to_tool_types_with_expectations() -> None:
    source = AssessmentSource(source_type=AssessmentSourceType.HUMAN, source_id="user123")
    expectation = Expectation(
        name="test_expectation",
        source=source,
        span_id="span-1",
        value=True,
    )
    expectation.rationale = "Expected to be true"
    expectation.assessment_id = "assess-1"
    expectations = [expectation]

    result = _convert_assessments_to_tool_types(expectations)

    assert len(result) == 1
    assert isinstance(result[0], JudgeToolExpectation)
    assert result[0].name == "test_expectation"
    assert result[0].source == AssessmentSourceType.HUMAN
    assert result[0].rationale == "Expected to be true"
    assert result[0].span_id == "span-1"
    assert result[0].assessment_id == "assess-1"
    assert result[0].value is True


def test_convert_assessments_to_tool_types_with_feedback() -> None:
    source = AssessmentSource(source_type=AssessmentSourceType.LLM_JUDGE, source_id="judge-1")
    error = AssessmentError(
        error_code="VALIDATION_ERROR",
        error_message="Invalid input",
        stack_trace="Stack trace here",
    )
    feedback = Feedback(
        name="test_feedback",
        source=source,
        span_id="span-2",
        value="positive",
        error=error,
        overrides="old-assess-id",
        valid=False,
    )
    feedback.rationale = "Feedback rationale"
    feedback.assessment_id = "assess-2"
    feedbacks = [feedback]

    result = _convert_assessments_to_tool_types(feedbacks)

    assert len(result) == 1
    assert isinstance(result[0], JudgeToolFeedback)
    assert result[0].name == "test_feedback"
    assert result[0].source == AssessmentSourceType.LLM_JUDGE
    assert result[0].rationale == "Feedback rationale"
    assert result[0].span_id == "span-2"
    assert result[0].assessment_id == "assess-2"
    assert result[0].value == "positive"
    assert result[0].error_code == "VALIDATION_ERROR"
    assert result[0].error_message == "Invalid input"
    assert result[0].stack_trace == "Stack trace here"
    assert result[0].overrides == "old-assess-id"
    assert result[0].valid is False


def test_convert_assessments_to_tool_types_with_feedback_no_error() -> None:
    source = AssessmentSource(source_type=AssessmentSourceType.HUMAN, source_id="user456")
    feedback = Feedback(
        name="feedback_no_error",
        source=source,
        span_id=None,
        value="negative",
        error=None,
    )
    feedback.assessment_id = "assess-3"
    feedbacks = [feedback]

    result = _convert_assessments_to_tool_types(feedbacks)

    assert len(result) == 1
    assert isinstance(result[0], JudgeToolFeedback)
    assert result[0].error_code is None
    assert result[0].error_message is None
    assert result[0].stack_trace is None
    assert result[0].overrides is None
    assert result[0].valid is True


def test_convert_assessments_to_tool_types_mixed() -> None:
    source = AssessmentSource(source_type=AssessmentSourceType.HUMAN)
    assessments = [
        Expectation(name="exp1", source=source, value=True),
        Feedback(name="fb1", source=source, value="positive"),
    ]

    result = _convert_assessments_to_tool_types(assessments)

    assert len(result) == 2
    assert isinstance(result[0], JudgeToolExpectation)
    assert isinstance(result[1], JudgeToolFeedback)


def test_get_experiment_id_success() -> None:
    trace_location = TraceLocation.from_experiment_id("exp-123")
    trace_info = TraceInfo(
        trace_id="trace-1",
        trace_location=trace_location,
        request_time=1234567890,
        state=TraceState.OK,
    )
    trace = Trace(info=trace_info, data=None)

    experiment_id = _get_experiment_id(trace)

    assert experiment_id == "exp-123"


def test_get_experiment_id_no_trace_location() -> None:
    trace_info = TraceInfo(
        trace_id="trace-1",
        trace_location=None,
        request_time=1234567890,
        state=TraceState.OK,
    )
    trace = Trace(info=trace_info, data=None)

    with pytest.raises(MlflowException, match="Current trace has no trace location"):
        _get_experiment_id(trace)


def test_get_experiment_id_not_mlflow_experiment() -> None:
    trace_location = TraceLocation(type=TraceLocationType.INFERENCE_TABLE)
    trace_info = TraceInfo(
        trace_id="trace-1",
        trace_location=trace_location,
        request_time=1234567890,
        state=TraceState.OK,
    )
    trace = Trace(info=trace_info, data=None)

    with pytest.raises(MlflowException, match="Current trace is not from an MLflow experiment"):
        _get_experiment_id(trace)


def test_get_experiment_id_no_experiment_id() -> None:
    trace_location = TraceLocation(type=TraceLocationType.MLFLOW_EXPERIMENT)
    trace_info = TraceInfo(
        trace_id="trace-1",
        trace_location=trace_location,
        request_time=1234567890,
        state=TraceState.OK,
    )
    trace = Trace(info=trace_info, data=None)

    with pytest.raises(MlflowException, match="Current trace has no experiment_id"):
        _get_experiment_id(trace)


@pytest.fixture
def mock_trace() -> Trace:
    trace_location = TraceLocation.from_experiment_id("exp-456")
    trace_info = TraceInfo(
        trace_id="trace-current",
        trace_location=trace_location,
        request_time=1234567890,
        state=TraceState.OK,
    )
    return Trace(info=trace_info, data=None)


@pytest.fixture
def mock_search_traces_list() -> list[Trace]:
    source = AssessmentSource(source_type=AssessmentSourceType.HUMAN)

    # Create trace 1 with request and response in root span
    otel_span1 = create_mock_otel_span(
        trace_id=12345,
        span_id=100,
        name="root",
        start_time=1000000000,
        end_time=1000000150,
        parent_id=None,
    )
    otel_span1.set_attributes(
        {
            SpanAttributeKey.INPUTS: "request1",
            SpanAttributeKey.OUTPUTS: "response1",
        }
    )
    span1 = Span(otel_span1)
    mock_trace1_info = TraceInfo(
        trace_id="trace-1",
        trace_location=TraceLocation.from_experiment_id("exp-456"),
        request_time=1000000000,
        state=TraceState.OK,
        execution_duration=150,
        assessments=[Expectation(name="quality", source=source, value=True)],
    )
    mock_trace1_data = TraceData(spans=[span1])
    mock_trace1 = Trace(info=mock_trace1_info, data=mock_trace1_data)

    # Create trace 2 with request and response in root span
    otel_span2 = create_mock_otel_span(
        trace_id=12345,
        span_id=101,
        name="root",
        start_time=1000000100,
        end_time=1000000300,
        parent_id=None,
    )
    otel_span2.set_attributes(
        {
            SpanAttributeKey.INPUTS: "request2",
            SpanAttributeKey.OUTPUTS: "response2",
        }
    )
    span2 = Span(otel_span2)
    mock_trace2_info = TraceInfo(
        trace_id="trace-2",
        trace_location=TraceLocation.from_experiment_id("exp-456"),
        request_time=1000000100,
        state=TraceState.ERROR,
        execution_duration=200,
        assessments=[],
    )
    mock_trace2_data = TraceData(spans=[span2])
    mock_trace2 = Trace(info=mock_trace2_info, data=mock_trace2_data)

    return [mock_trace1, mock_trace2]


def test_search_traces_tool_invoke_success(
    mock_trace: Trace, mock_search_traces_list: list[Trace]
) -> None:
    tool = SearchTracesTool()

    with mock.patch("mlflow.search_traces", return_value=mock_search_traces_list) as mock_search:
        result = tool.invoke(mock_trace, filter_string='attributes.status = "OK"', max_results=10)

        mock_search.assert_called_once_with(
            locations=["exp-456"],
            filter_string='attributes.status = "OK"',
            order_by=["timestamp ASC"],
            max_results=10,
            return_type="list",
        )

    assert len(result) == 2
    assert isinstance(result[0], JudgeToolTraceInfo)
    assert result[0].trace_id == "trace-1"
    assert result[0].request == "request1"
    assert result[0].response == "response1"
    assert result[0].state == TraceState.OK
    assert result[0].execution_duration == 150
    assert len(result[0].assessments) == 1

    assert result[1].trace_id == "trace-2"
    assert result[1].state == TraceState.ERROR
    assert result[1].execution_duration == 200
    assert len(result[1].assessments) == 0


def test_search_traces_tool_invoke_with_order_by(
    mock_trace: Trace, mock_search_traces_list: list[Trace]
) -> None:
    tool = SearchTracesTool()

    with mock.patch("mlflow.search_traces", return_value=mock_search_traces_list) as mock_search:
        result = tool.invoke(mock_trace, order_by=["timestamp DESC", "trace_id ASC"], max_results=5)

        mock_search.assert_called_once_with(
            locations=["exp-456"],
            filter_string=None,
            order_by=["timestamp DESC", "trace_id ASC"],
            max_results=5,
            return_type="list",
        )

    assert len(result) == 2


def test_search_traces_tool_invoke_default_order_by(
    mock_trace: Trace, mock_search_traces_list: list[Trace]
) -> None:
    tool = SearchTracesTool()

    with mock.patch("mlflow.search_traces", return_value=mock_search_traces_list) as mock_search:
        result = tool.invoke(mock_trace)

        mock_search.assert_called_once()
        call_kwargs = mock_search.call_args[1]
        assert call_kwargs["order_by"] == ["timestamp ASC"]
        assert call_kwargs["max_results"] == 20
        assert call_kwargs["return_type"] == "list"

    assert len(result) == 2


def test_search_traces_tool_invoke_empty_results(mock_trace: Trace) -> None:
    tool = SearchTracesTool()
    empty_list: list[Trace] = []

    with mock.patch("mlflow.search_traces", return_value=empty_list):
        result = tool.invoke(mock_trace)

    assert len(result) == 0
    assert result == []


def test_search_traces_tool_invoke_search_fails(mock_trace: Trace) -> None:
    tool = SearchTracesTool()

    with mock.patch("mlflow.search_traces", side_effect=Exception("Search failed")):
        with pytest.raises(MlflowException, match="Failed to search traces"):
            tool.invoke(mock_trace)


def test_search_traces_tool_invoke_invalid_trace_json(mock_trace: Trace) -> None:
    tool = SearchTracesTool()

    # Create traces with missing required attributes to trigger exceptions
    invalid_trace1_info = TraceInfo(
        trace_id="trace-1",
        trace_location=TraceLocation.from_experiment_id("exp-456"),
        request_time=1000000000,
        state=TraceState.OK,
    )
    # Create a trace without data to trigger an exception when accessing data.request
    invalid_trace1 = Trace(info=invalid_trace1_info, data=None)

    invalid_trace2_info = TraceInfo(
        trace_id="trace-2",
        trace_location=TraceLocation.from_experiment_id("exp-456"),
        request_time=1000000100,
        state=TraceState.OK,
    )
    invalid_trace2 = Trace(info=invalid_trace2_info, data=None)

    invalid_list = [invalid_trace1, invalid_trace2]

    with mock.patch("mlflow.search_traces", return_value=invalid_list):
        result = tool.invoke(mock_trace)

    # Both traces should fail to process due to missing data
    assert len(result) == 0


def test_search_traces_tool_invoke_partial_failure(mock_trace: Trace) -> None:
    tool = SearchTracesTool()

    # First trace will fail (missing data)
    invalid_trace1_info = TraceInfo(
        trace_id="trace-1",
        trace_location=TraceLocation.from_experiment_id("exp-456"),
        request_time=1000000000,
        state=TraceState.OK,
        execution_duration=150,
        assessments=[],
    )
    invalid_trace1 = Trace(info=invalid_trace1_info, data=None)

    # Second trace will succeed
    otel_span2 = create_mock_otel_span(
        trace_id=12345,
        span_id=102,
        name="root",
        start_time=1000000100,
        end_time=1000000300,
        parent_id=None,
    )
    otel_span2.set_attributes(
        {
            SpanAttributeKey.INPUTS: "request2",
            SpanAttributeKey.OUTPUTS: "response2",
        }
    )
    span2 = Span(otel_span2)
    valid_trace2_info = TraceInfo(
        trace_id="trace-2",
        trace_location=TraceLocation.from_experiment_id("exp-456"),
        request_time=1000000100,
        state=TraceState.ERROR,
        execution_duration=200,
        assessments=[],
    )
    valid_trace2_data = TraceData(spans=[span2])
    valid_trace2 = Trace(info=valid_trace2_info, data=valid_trace2_data)

    partial_list = [invalid_trace1, valid_trace2]

    with mock.patch("mlflow.search_traces", return_value=partial_list):
        result = tool.invoke(mock_trace)

    # Only the valid trace should be in results
    assert len(result) == 1
    assert result[0].trace_id == "trace-2"


def test_search_traces_tool_invoke_no_filter(
    mock_trace: Trace, mock_search_traces_list: list[Trace]
) -> None:
    tool = SearchTracesTool()

    with mock.patch("mlflow.search_traces", return_value=mock_search_traces_list) as mock_search:
        result = tool.invoke(mock_trace, filter_string=None)

        assert mock_search.call_args[1]["filter_string"] is None

    assert len(result) == 2
```

--------------------------------------------------------------------------------

````
