---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 824
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 824 of 991)

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

---[FILE: conftest.py]---
Location: mlflow-master/tests/genai/judges/optimizers/conftest.py

```python
"""Shared test fixtures for optimizer tests."""

import json
import time
from typing import Any
from unittest.mock import Mock

import dspy
import pytest
from opentelemetry.sdk.trace import ReadableSpan as OTelReadableSpan

from mlflow.entities.assessment import Feedback
from mlflow.entities.assessment_source import AssessmentSource, AssessmentSourceType
from mlflow.entities.span import Span
from mlflow.entities.trace import Trace, TraceData, TraceInfo
from mlflow.entities.trace_location import TraceLocation
from mlflow.entities.trace_state import TraceState
from mlflow.genai.judges.base import Judge, JudgeField
from mlflow.tracing.constant import TRACE_SCHEMA_VERSION, TRACE_SCHEMA_VERSION_KEY
from mlflow.tracing.utils import build_otel_context


class MockJudge(Judge):
    """Mock judge implementation for testing."""

    def __init__(self, name="mock_judge", instructions=None, model=None, **kwargs):
        super().__init__(name=name, **kwargs)
        # Use a proper template with variables for testing
        self._instructions = (
            instructions or "Evaluate if the {{outputs}} properly addresses {{inputs}}"
        )
        self._model = model

    @property
    def instructions(self) -> str:
        return self._instructions

    @property
    def model(self) -> str:
        """Get the model for this judge."""
        return self._model

    def __call__(self, inputs, outputs, expectations=None, trace=None):
        # Simple mock implementation
        return "pass" if "good" in str(outputs).lower() else "fail"

    def get_input_fields(self) -> list[JudgeField]:
        """Get the input fields for this mock judge."""
        return [
            JudgeField(name="inputs", description="Test inputs"),
            JudgeField(name="outputs", description="Test outputs"),
        ]


def _create_trace_helper(
    trace_id: str,
    assessments: list[Feedback] | None = None,
    inputs: dict[str, Any] | None = None,
    outputs: dict[str, Any] | None = None,
    context_trace_id: int = 12345,
    context_span_id: int = 111,
) -> Trace:
    """Helper function to create traces with less duplication."""
    current_time_ns = int(time.time() * 1e9)

    # Build attributes dict
    attributes = {"mlflow.traceRequestId": json.dumps(trace_id)}
    if inputs is not None:
        attributes["mlflow.spanInputs"] = json.dumps(inputs)
    if outputs is not None:
        attributes["mlflow.spanOutputs"] = json.dumps(outputs)
    attributes["mlflow.spanType"] = json.dumps("CHAIN")

    # Create OpenTelemetry span
    otel_span = OTelReadableSpan(
        name="root_span",
        context=build_otel_context(context_trace_id, context_span_id),
        parent=None,
        start_time=current_time_ns,
        end_time=current_time_ns + 1000000,
        attributes=attributes,
    )

    # Create real Span object
    real_span = Span(otel_span)

    # Create real TraceInfo
    trace_info = TraceInfo(
        trace_id=trace_id,
        trace_location=TraceLocation.from_experiment_id("0"),
        request_time=int(time.time() * 1000),
        state=TraceState.OK,
        execution_duration=1000,
        trace_metadata={TRACE_SCHEMA_VERSION_KEY: str(TRACE_SCHEMA_VERSION)},
        tags={},
        assessments=assessments or [],
        request_preview=json.dumps(inputs) if inputs else None,
        response_preview=json.dumps(outputs) if outputs else None,
    )

    # Create real TraceData and Trace
    trace_data = TraceData(spans=[real_span])
    return Trace(info=trace_info, data=trace_data)


@pytest.fixture
def mock_judge():
    """Create a mock judge for testing."""
    return MockJudge(model="openai:/gpt-3.5-turbo")


@pytest.fixture
def sample_trace_with_assessment():
    """Create a sample trace with human assessment for testing."""
    # Create a real assessment object (Feedback) with mixed case/whitespace to test sanitization
    assessment = Feedback(
        name="  Mock_JUDGE  ",
        value="pass",
        rationale="This looks good",
        source=AssessmentSource(source_type=AssessmentSourceType.HUMAN, source_id="test_user"),
    )

    return _create_trace_helper(
        trace_id="test_trace_001",
        assessments=[assessment],
        inputs={"inputs": "test input"},
        outputs={"outputs": "test output"},
        context_trace_id=12345,
        context_span_id=111,
    )


@pytest.fixture
def sample_trace_without_assessment():
    """Create a sample trace without human assessment for testing."""
    return _create_trace_helper(
        trace_id="test_trace_001",
        assessments=[],  # No assessments
        inputs={"inputs": "test input"},
        outputs={"outputs": "test output"},
        context_trace_id=12346,
        context_span_id=112,
    )


@pytest.fixture
def trace_with_expectations():
    """Create a trace with expectations."""
    from mlflow.entities import Expectation

    # Create assessments
    judge_assessment = Feedback(
        name="mock_judge",
        value="pass",
        rationale="Meets expectations",
        source=AssessmentSource(source_type=AssessmentSourceType.HUMAN, source_id="test_user"),
    )

    expectation1 = Expectation(
        trace_id="test_trace_with_expectations",
        name="accuracy",
        value="Should be at least 90% accurate",
        source=AssessmentSource(source_type=AssessmentSourceType.HUMAN, source_id="test_user"),
    )

    expectation2 = Expectation(
        trace_id="test_trace_with_expectations",
        name="format",
        value="Should return JSON format",
        source=AssessmentSource(source_type=AssessmentSourceType.HUMAN, source_id="test_user"),
    )

    return _create_trace_helper(
        trace_id="test_trace_with_expectations",
        assessments=[judge_assessment, expectation1, expectation2],
        inputs={"inputs": "test input"},
        outputs={"outputs": "test output"},
        context_trace_id=12352,
        context_span_id=118,
    )


@pytest.fixture
def trace_without_inputs():
    """Create a trace without inputs (only outputs)."""
    assessment = Feedback(
        name="mock_judge",
        value="pass",
        rationale="Output only",
        source=AssessmentSource(source_type=AssessmentSourceType.HUMAN, source_id="test_user"),
    )

    return _create_trace_helper(
        trace_id="test_trace_no_inputs",
        assessments=[assessment],
        inputs=None,  # No inputs
        outputs={"outputs": "test output"},
        context_trace_id=12350,
        context_span_id=116,
    )


@pytest.fixture
def trace_without_outputs():
    """Create a trace without outputs (only inputs)."""
    assessment = Feedback(
        name="mock_judge",
        value="pass",
        rationale="Input only",
        source=AssessmentSource(source_type=AssessmentSourceType.HUMAN, source_id="test_user"),
    )

    return _create_trace_helper(
        trace_id="test_trace_no_outputs",
        assessments=[assessment],
        inputs={"inputs": "test input"},
        outputs=None,  # No outputs
        context_trace_id=12351,
        context_span_id=117,
    )


@pytest.fixture
def trace_with_nested_request_response():
    """Create a trace with nested request/response structure."""
    assessment = Feedback(
        name="mock_judge",
        value="pass",
        rationale="Complex nested structure handled well",
        source=AssessmentSource(source_type=AssessmentSourceType.HUMAN, source_id="test_user"),
        create_time_ms=int(time.time() * 1000),
    )

    nested_inputs = {"query": {"text": "nested input", "context": {"key": "value"}}}
    nested_outputs = {"result": {"answer": "nested output", "metadata": {"score": 0.9}}}

    return _create_trace_helper(
        trace_id="test_trace_nested",
        assessments=[assessment],
        inputs=nested_inputs,
        outputs=nested_outputs,
        context_trace_id=12347,
        context_span_id=113,
    )


@pytest.fixture
def trace_with_list_request_response():
    """Create a trace with list-based request/response."""
    # Create actual trace with real MLflow objects

    # Create a real assessment object (Feedback)
    assessment = Feedback(
        name="mock_judge",
        value="fail",
        rationale="List processing needs improvement",
        source=AssessmentSource(source_type=AssessmentSourceType.HUMAN, source_id="test_user"),
        create_time_ms=int(time.time() * 1000),
    )

    # Create OpenTelemetry span with list structure
    current_time_ns = int(time.time() * 1e9)
    list_inputs = {"items": ["item1", "item2", "item3"]}
    list_outputs = {"results": ["result1", "result2"]}

    otel_span = OTelReadableSpan(
        name="root_span",
        context=build_otel_context(12348, 114),
        parent=None,
        start_time=current_time_ns,
        end_time=current_time_ns + 1000000,
        attributes={
            "mlflow.traceRequestId": json.dumps("test_trace_list"),
            "mlflow.spanInputs": json.dumps(list_inputs),
            "mlflow.spanOutputs": json.dumps(list_outputs),
            "mlflow.spanType": json.dumps("CHAIN"),
        },
    )

    # Create real Span object
    real_span = Span(otel_span)

    # Create real TraceInfo
    trace_info = TraceInfo(
        trace_id="test_trace_list",
        trace_location=TraceLocation.from_experiment_id("0"),
        request_time=int(time.time() * 1000),
        state=TraceState.OK,
        execution_duration=1000,
        trace_metadata={TRACE_SCHEMA_VERSION_KEY: str(TRACE_SCHEMA_VERSION)},
        tags={},
        assessments=[assessment],
        request_preview='["item1", "item2", "item3"]',
        response_preview='["result1", "result2"]',
    )

    # Create real TraceData
    trace_data = TraceData(spans=[real_span])

    # Create real Trace object
    return Trace(info=trace_info, data=trace_data)


@pytest.fixture
def trace_with_string_request_response():
    """Create a trace with simple string request/response."""
    # Create actual trace with real MLflow objects

    # Create a real assessment object (Feedback)
    assessment = Feedback(
        name="mock_judge",
        value="pass",
        rationale="Simple string handled correctly",
        source=AssessmentSource(source_type=AssessmentSourceType.HUMAN, source_id="test_user"),
        create_time_ms=int(time.time() * 1000),
    )

    # Create OpenTelemetry span with string inputs/outputs
    current_time_ns = int(time.time() * 1e9)
    string_input = "What is the capital of France?"
    string_output = "Paris"

    otel_span = OTelReadableSpan(
        name="root_span",
        context=build_otel_context(12349, 115),
        parent=None,
        start_time=current_time_ns,
        end_time=current_time_ns + 1000000,
        attributes={
            "mlflow.traceRequestId": json.dumps("test_trace_string"),
            "mlflow.spanInputs": json.dumps(string_input),
            "mlflow.spanOutputs": json.dumps(string_output),
            "mlflow.spanType": json.dumps("CHAIN"),
        },
    )

    # Create real Span object
    real_span = Span(otel_span)

    # Create real TraceInfo
    trace_info = TraceInfo(
        trace_id="test_trace_string",
        trace_location=TraceLocation.from_experiment_id("0"),
        request_time=int(time.time() * 1000),
        state=TraceState.OK,
        execution_duration=1000,
        trace_metadata={TRACE_SCHEMA_VERSION_KEY: str(TRACE_SCHEMA_VERSION)},
        tags={},
        assessments=[assessment],
        request_preview=json.dumps(string_input),
        response_preview=json.dumps(string_output),
    )

    # Create real TraceData
    trace_data = TraceData(spans=[real_span])

    # Create real Trace object
    return Trace(info=trace_info, data=trace_data)


@pytest.fixture
def trace_with_mixed_types():
    """Create a trace with mixed data types in request/response."""
    # Create actual trace with real MLflow objects

    # Create a real assessment object (Feedback)
    assessment = Feedback(
        name="mock_judge",
        value="pass",
        rationale="Mixed types processed successfully",
        source=AssessmentSource(source_type=AssessmentSourceType.HUMAN, source_id="test_user"),
        create_time_ms=int(time.time() * 1000),
    )

    # Create OpenTelemetry span with mixed types
    current_time_ns = int(time.time() * 1e9)
    mixed_inputs = {"prompt": "test", "temperature": 0.7, "max_tokens": 100}
    mixed_outputs = {"text": "response", "tokens_used": 50, "success": True}

    otel_span = OTelReadableSpan(
        name="root_span",
        context=build_otel_context(12350, 116),
        parent=None,
        start_time=current_time_ns,
        end_time=current_time_ns + 1000000,
        attributes={
            "mlflow.traceRequestId": json.dumps("test_trace_mixed"),
            "mlflow.spanInputs": json.dumps(mixed_inputs),
            "mlflow.spanOutputs": json.dumps(mixed_outputs),
            "mlflow.spanType": json.dumps("CHAIN"),
        },
    )

    # Create real Span object
    real_span = Span(otel_span)

    # Create real TraceInfo
    trace_info = TraceInfo(
        trace_id="test_trace_mixed",
        trace_location=TraceLocation.from_experiment_id("0"),
        request_time=int(time.time() * 1000),
        state=TraceState.OK,
        execution_duration=1000,
        trace_metadata={TRACE_SCHEMA_VERSION_KEY: str(TRACE_SCHEMA_VERSION)},
        tags={},
        assessments=[assessment],
        request_preview=json.dumps(mixed_inputs),
        response_preview=json.dumps(mixed_outputs),
    )

    # Create real TraceData
    trace_data = TraceData(spans=[real_span])

    # Create real Trace object
    return Trace(info=trace_info, data=trace_data)


@pytest.fixture
def sample_traces_with_assessments():
    """Create multiple sample traces with assessments."""
    traces = []
    # Create actual traces with real MLflow objects

    for i in range(5):
        # Create a real assessment object (Feedback)
        assessment = Feedback(
            name="mock_judge",
            value="pass" if i % 2 == 0 else "fail",
            rationale=f"Rationale for trace {i}",
            source=AssessmentSource(source_type=AssessmentSourceType.HUMAN, source_id="test_user"),
            create_time_ms=int(time.time() * 1000) + i,  # Slightly different times
        )

        # Create OpenTelemetry span
        current_time_ns = int(time.time() * 1e9) + i * 1000000
        inputs = {"inputs": f"test input {i}"}
        outputs = {"outputs": f"test output {i}"}

        otel_span = OTelReadableSpan(
            name="root_span",
            context=build_otel_context(12351 + i, 117 + i),
            parent=None,
            start_time=current_time_ns,
            end_time=current_time_ns + 1000000,
            attributes={
                "mlflow.traceRequestId": json.dumps(f"test_trace_{i:03d}"),
                "mlflow.spanInputs": json.dumps(inputs),
                "mlflow.spanOutputs": json.dumps(outputs),
                "mlflow.spanType": json.dumps("CHAIN"),
            },
        )

        # Create real Span object
        real_span = Span(otel_span)

        # Create real TraceInfo
        trace_info = TraceInfo(
            trace_id=f"test_trace_{i:03d}",
            trace_location=TraceLocation.from_experiment_id("0"),
            request_time=int(time.time() * 1000) + i,
            state=TraceState.OK,
            execution_duration=1000,
            trace_metadata={TRACE_SCHEMA_VERSION_KEY: str(TRACE_SCHEMA_VERSION)},
            tags={},
            assessments=[assessment],
            request_preview=json.dumps(inputs),
            response_preview=json.dumps(outputs),
        )

        # Create real TraceData
        trace_data = TraceData(spans=[real_span])

        # Create real Trace object
        trace = Trace(info=trace_info, data=trace_data)
        traces.append(trace)

    return traces


@pytest.fixture
def mock_dspy_example():
    """Create a DSPy example for testing."""
    # Return an actual dspy.Example
    example = dspy.Example(
        inputs="test inputs", outputs="test outputs", result="pass", rationale="test rationale"
    )
    return example.with_inputs("inputs", "outputs")


@pytest.fixture
def mock_dspy_program():
    """Create a mock DSPy program for testing."""
    mock_program = Mock()
    mock_program.signature = Mock()
    mock_program.signature.instructions = "Optimized instructions"
    return mock_program


@pytest.fixture
def mock_dspy_optimizer():
    """Create a mock DSPy optimizer for testing."""

    def create_mock_optimizer():
        mock_optimizer = Mock()
        mock_optimizer.__class__.__name__ = "MockOptimizer"
        mock_optimizer.compile.return_value = Mock()
        return mock_optimizer

    return create_mock_optimizer


@pytest.fixture
def trace_with_two_human_assessments():
    """Create a trace with two HUMAN assessments with different timestamps."""
    # Create two real assessment objects (Feedback) with different timestamps
    older_assessment = Feedback(
        name="mock_judge",
        value="fail",
        rationale="First assessment - should not be used",
        source=AssessmentSource(source_type=AssessmentSourceType.HUMAN, source_id="user1"),
        create_time_ms=int(time.time() * 1000) - 1000,  # 1 second older
    )

    newer_assessment = Feedback(
        name="mock_judge",
        value="pass",
        rationale="Second assessment - should be used (more recent)",
        source=AssessmentSource(source_type=AssessmentSourceType.HUMAN, source_id="user2"),
        create_time_ms=int(time.time() * 1000),  # Current time (newer)
    )

    # Create OpenTelemetry span
    current_time_ns = int(time.time() * 1e9)
    otel_span = OTelReadableSpan(
        name="root_span",
        context=build_otel_context(12360, 160),
        parent=None,
        start_time=current_time_ns,
        end_time=current_time_ns + 1000000,
        attributes={
            "mlflow.traceRequestId": json.dumps("test_trace_two_human"),
            "mlflow.spanInputs": json.dumps({"inputs": "test input"}),
            "mlflow.spanOutputs": json.dumps({"outputs": "test output"}),
            "mlflow.spanType": json.dumps("CHAIN"),
        },
    )

    real_span = Span(otel_span)

    trace_info = TraceInfo(
        trace_id="test_trace_two_human",
        trace_location=TraceLocation.from_experiment_id("0"),
        request_time=int(time.time() * 1000),
        state=TraceState.OK,
        execution_duration=1000,
        trace_metadata={TRACE_SCHEMA_VERSION_KEY: str(TRACE_SCHEMA_VERSION)},
        tags={},
        assessments=[older_assessment, newer_assessment],  # Order shouldn't matter due to sorting
        request_preview='{"inputs": "test input"}',
        response_preview='{"outputs": "test output"}',
    )

    trace_data = TraceData(spans=[real_span])
    return Trace(info=trace_info, data=trace_data)


@pytest.fixture
def trace_with_human_and_llm_assessments():
    """Create a trace with both HUMAN and LLM_JUDGE assessments (HUMAN should be prioritized)."""
    # Create HUMAN assessment (older timestamp)
    human_assessment = Feedback(
        name="mock_judge",
        value="fail",
        rationale="Human assessment - should be prioritized",
        source=AssessmentSource(source_type=AssessmentSourceType.HUMAN, source_id="human_user"),
        create_time_ms=int(time.time() * 1000) - 2000,  # 2 seconds older
    )

    # Create LLM_JUDGE assessment (newer timestamp)
    llm_assessment = Feedback(
        name="mock_judge",
        value="pass",
        rationale="LLM assessment - should not be used despite being newer",
        source=AssessmentSource(source_type=AssessmentSourceType.LLM_JUDGE, source_id="gpt-4"),
        create_time_ms=int(time.time() * 1000),  # Current time (newer)
    )

    # Create OpenTelemetry span
    current_time_ns = int(time.time() * 1e9)
    otel_span = OTelReadableSpan(
        name="root_span",
        context=build_otel_context(12361, 161),
        parent=None,
        start_time=current_time_ns,
        end_time=current_time_ns + 1000000,
        attributes={
            "mlflow.traceRequestId": json.dumps("test_trace_human_llm"),
            "mlflow.spanInputs": json.dumps({"inputs": "test input"}),
            "mlflow.spanOutputs": json.dumps({"outputs": "test output"}),
            "mlflow.spanType": json.dumps("CHAIN"),
        },
    )

    real_span = Span(otel_span)

    trace_info = TraceInfo(
        trace_id="test_trace_human_llm",
        trace_location=TraceLocation.from_experiment_id("0"),
        request_time=int(time.time() * 1000),
        state=TraceState.OK,
        execution_duration=1000,
        trace_metadata={TRACE_SCHEMA_VERSION_KEY: str(TRACE_SCHEMA_VERSION)},
        tags={},
        # Order shouldn't matter - HUMAN should be chosen
        assessments=[llm_assessment, human_assessment],
        request_preview='{"inputs": "test input"}',
        response_preview='{"outputs": "test output"}',
    )

    trace_data = TraceData(spans=[real_span])
    return Trace(info=trace_info, data=trace_data)


class MockDSPyLM(dspy.BaseLM):
    """Mock DSPy LM class for testing that inherits from DSPy's BaseLM."""

    def __init__(self, model_name):
        super().__init__(model_name)
        self.model = model_name
        self.name = model_name
        self._context_calls = []

    def basic_request(self, prompt, **kwargs):
        # Track that this LM was called
        self._context_calls.append(
            {
                "model": self.model,
                "prompt": prompt,
                "kwargs": kwargs,
                "context": "lm_basic_request_called",
            }
        )

        # Return a default answer
        return [{"text": '{"result": "pass", "rationale": "test rationale"}'}]

    def __call__(self, *args, **kwargs):
        return self.basic_request(str(args), **kwargs)

    @property
    def context_calls(self):
        return self._context_calls
```

--------------------------------------------------------------------------------

---[FILE: test_dspy_base.py]---
Location: mlflow-master/tests/genai/judges/optimizers/test_dspy_base.py

```python
from typing import Any, Callable, Collection
from unittest.mock import MagicMock, Mock, patch

import dspy
import litellm
import pytest

from mlflow.entities.trace import Trace
from mlflow.exceptions import MlflowException
from mlflow.genai.judges.optimizers.dspy import DSPyAlignmentOptimizer
from mlflow.genai.judges.optimizers.dspy_utils import AgentEvalLM, convert_mlflow_uri_to_litellm

from tests.genai.judges.optimizers.conftest import MockDSPyLM, MockJudge


def make_judge_mock_builder(
    expected_model: str | None = None, track_calls: list[str] | None = None
) -> Callable[[str, str, str], MagicMock]:
    """Create a mock make_judge function for testing.

    Args:
        expected_model: If provided, track calls with this model to track_calls list
        track_calls: List to append model to when make_judge is called with expected_model

    Returns:
        Mock function that can be used to patch make_judge
    """
    mock_feedback = MagicMock()
    mock_feedback.value = "pass"
    mock_feedback.rationale = "Test rationale"

    def mock_make_judge(name, instructions, model, feedback_value_type):
        if track_calls is not None and model == expected_model:
            track_calls.append(model)
        return MagicMock(return_value=mock_feedback)

    return mock_make_judge


class ConcreteDSPyOptimizer(DSPyAlignmentOptimizer):
    """Concrete implementation for testing."""

    def _dspy_optimize(
        self,
        program: "dspy.Module",
        examples: Collection["dspy.Example"],
        metric_fn: Callable[["dspy.Example", Any, Any | None], bool],
    ) -> "dspy.Module":
        mock_program = Mock()
        mock_program.signature = Mock()
        mock_program.signature.instructions = (
            "Optimized instructions with {{inputs}} and {{outputs}}"
        )
        return mock_program


def test_dspy_optimizer_abstract():
    with pytest.raises(TypeError, match="Can't instantiate abstract class"):
        DSPyAlignmentOptimizer()


def test_concrete_implementation_required():
    class IncompleteDSPyOptimizer(DSPyAlignmentOptimizer):
        pass

    with pytest.raises(TypeError, match="Can't instantiate abstract class"):
        IncompleteDSPyOptimizer()


def test_concrete_implementation_works():
    optimizer = ConcreteDSPyOptimizer()
    assert optimizer is not None


def test_align_success(sample_traces_with_assessments):
    mock_judge = MockJudge(name="mock_judge", model="openai:/gpt-4")

    with patch("dspy.LM", MagicMock()):
        optimizer = ConcreteDSPyOptimizer()

        with patch.object(ConcreteDSPyOptimizer, "get_min_traces_required", return_value=5):
            result = optimizer.align(mock_judge, sample_traces_with_assessments)

    assert result is not None
    assert result.model == mock_judge.model
    assert "Optimized instructions with {{inputs}} and {{outputs}}" in result.instructions


def test_align_no_traces(mock_judge):
    optimizer = ConcreteDSPyOptimizer()

    with pytest.raises(MlflowException, match="Alignment optimization failed") as exc_info:
        optimizer.align(mock_judge, [])

    assert "No traces provided" in str(exc_info.value)
    assert exc_info.value.__cause__ is not None
    assert "No traces provided" in str(exc_info.value.__cause__)


def test_align_no_valid_examples(mock_judge, sample_trace_without_assessment):
    with patch("dspy.LM", MagicMock()):
        optimizer = ConcreteDSPyOptimizer()
        with pytest.raises(MlflowException, match="Alignment optimization failed") as exc_info:
            optimizer.align(mock_judge, [sample_trace_without_assessment])

        assert "No valid examples could be created" in str(exc_info.value)
        assert exc_info.value.__cause__ is not None
        assert "No valid examples could be created" in str(exc_info.value.__cause__)


def test_align_insufficient_examples(mock_judge, sample_trace_with_assessment):
    optimizer = ConcreteDSPyOptimizer()
    min_traces = optimizer.get_min_traces_required()

    with patch("dspy.LM", MagicMock()):
        with pytest.raises(MlflowException, match="Alignment optimization failed") as exc_info:
            optimizer.align(mock_judge, [sample_trace_with_assessment])

        assert f"At least {min_traces} valid traces are required" in str(exc_info.value)
        assert exc_info.value.__cause__ is not None
        assert f"At least {min_traces} valid traces are required" in str(exc_info.value.__cause__)


def _create_mock_dspy_lm_factory(optimizer_lm, judge_lm):
    """Factory function to create MockDSPyLM instances that track calls to LMs."""

    def mock_lm_factory(model=None, **kwargs):
        """Internal factory method to carry the input models"""
        if model == optimizer_lm.model:
            return optimizer_lm
        elif model == judge_lm.model:
            return judge_lm
        else:
            raise ValueError(f"Invalid model: {model}")

    return mock_lm_factory


def test_optimizer_and_judge_use_different_models(sample_traces_with_assessments):
    judge_model = "openai:/gpt-4"
    optimizer_model = "anthropic:/claude-3"

    mock_judge = MockJudge(name="mock_judge", model=judge_model)
    traces = sample_traces_with_assessments

    optimizer_lm = MockDSPyLM(convert_mlflow_uri_to_litellm(optimizer_model))
    judge_lm = MockDSPyLM(convert_mlflow_uri_to_litellm(judge_model))

    mock_lm_factory = _create_mock_dspy_lm_factory(optimizer_lm, judge_lm)
    mock_make_judge = make_judge_mock_builder(
        expected_model=judge_model, track_calls=judge_lm.context_calls
    )

    with (
        patch.object(dspy, "LM", side_effect=mock_lm_factory),
        patch("mlflow.genai.judges.optimizers.dspy.make_judge", side_effect=mock_make_judge),
    ):
        # Override ConcreteDSPyOptimizer's _dspy_optimize to call the program
        class TestDSPyOptimizer(ConcreteDSPyOptimizer):
            def _dspy_optimize(
                self,
                program: "dspy.Module",
                examples: Collection["dspy.Example"],
                metric_fn: Callable[["dspy.Example", Any, Any | None], bool],
            ) -> "dspy.Module":
                lm_in_context = dspy.settings.lm
                assert lm_in_context == optimizer_lm

                program(inputs=examples[0].inputs, outputs=examples[0].outputs)

                return super()._dspy_optimize(program, examples, metric_fn)

        optimizer = TestDSPyOptimizer(model=optimizer_model)

        with patch.object(TestDSPyOptimizer, "get_min_traces_required", return_value=5):
            optimizer.align(mock_judge, traces)

        assert len(judge_lm.context_calls) > 0, (
            f"Expected judge LM to be called, but got {len(judge_lm.context_calls)} calls. "
            f"Optimizer calls: {len(optimizer_lm.context_calls)}"
        )

        assert len(optimizer_lm.context_calls) == 0, (
            f"Expected optimizer LM to not be called, but got "
            f"{len(optimizer_lm.context_calls)} calls. "
            f"Judge calls: {len(judge_lm.context_calls)}"
        )


def test_optimizer_default_model_initialization():
    with patch("mlflow.genai.judges.optimizers.dspy.get_default_model") as mock_get_default:
        mock_get_default.return_value = "whichever default model is used"

        optimizer = ConcreteDSPyOptimizer()

        assert optimizer.model == "whichever default model is used"
        mock_get_default.assert_called_once()


def test_optimizer_custom_model_initialization():
    custom_model = "anthropic:/claude-3.5-sonnet"

    optimizer = ConcreteDSPyOptimizer(model=custom_model)

    assert optimizer.model == custom_model


def test_different_models_no_interference():
    optimizer1 = ConcreteDSPyOptimizer(model="openai:/gpt-3.5-turbo")
    optimizer2 = ConcreteDSPyOptimizer(model="anthropic:/claude-3")

    assert optimizer1.model == "openai:/gpt-3.5-turbo"
    assert optimizer2.model == "anthropic:/claude-3"
    assert optimizer1.model != optimizer2.model


def test_mlflow_to_litellm_uri_conversion_in_optimizer(sample_traces_with_assessments):
    # Setup models with MLflow URI format
    judge_model = "openai:/gpt-4"
    optimizer_model = "anthropic:/claude-3.5-sonnet"

    mock_judge = MockJudge(name="mock_judge", model=judge_model)

    lm_calls = []

    def mock_lm_init(model=None, **kwargs):
        lm_calls.append(model)
        return MagicMock()

    with patch("dspy.LM", side_effect=mock_lm_init):
        optimizer = ConcreteDSPyOptimizer(model=optimizer_model)
        with patch.object(ConcreteDSPyOptimizer, "get_min_traces_required", return_value=5):
            optimizer.align(mock_judge, sample_traces_with_assessments)

    assert lm_calls == ["anthropic/claude-3.5-sonnet"]


def test_mlflow_to_litellm_uri_conversion_in_judge_program():
    mock_judge = MockJudge(name="test_judge", model="openai:/gpt-4o-mini")

    optimizer = ConcreteDSPyOptimizer()

    make_judge_calls = []
    mock_make_judge = make_judge_mock_builder(
        expected_model=mock_judge.model, track_calls=make_judge_calls
    )

    program = optimizer._get_dspy_program_from_judge(mock_judge)

    with patch("mlflow.genai.judges.optimizers.dspy.make_judge", side_effect=mock_make_judge):
        mock_lm = MagicMock()
        mock_lm.model = convert_mlflow_uri_to_litellm(mock_judge.model)

        program.forward(inputs="test", outputs="test", lm=mock_lm)

    assert len(make_judge_calls) == 1
    assert make_judge_calls[0] == mock_judge.model


def test_dspy_align_litellm_nonfatal_error_messages_suppressed():
    suppression_state_during_call = {}

    def mock_dspy_optimize(program, examples, metric_fn):
        suppression_state_during_call["set_verbose"] = litellm.set_verbose
        suppression_state_during_call["suppress_debug_info"] = litellm.suppress_debug_info

        mock_program = Mock()
        mock_program.signature = Mock()
        mock_program.signature.instructions = "Optimized instructions"
        return mock_program

    optimizer = ConcreteDSPyOptimizer()
    min_traces = optimizer.get_min_traces_required()
    mock_traces = [Mock(spec=Trace) for _ in range(min_traces)]
    mock_judge = MockJudge(name="test_judge", model="openai:/gpt-4o-mini")

    with (
        patch("dspy.LM"),
        patch("mlflow.genai.judges.optimizers.dspy.trace_to_dspy_example", return_value=Mock()),
        patch("mlflow.genai.judges.optimizers.dspy.make_judge", return_value=Mock()),
        patch.object(optimizer, "_dspy_optimize", mock_dspy_optimize),
    ):
        optimizer.align(mock_judge, mock_traces)

        assert suppression_state_during_call["set_verbose"] is False
        assert suppression_state_during_call["suppress_debug_info"] is True


def test_align_configures_databricks_lm_in_context(sample_traces_with_assessments):
    mock_judge = MockJudge(name="mock_judge", model="openai:/gpt-4")
    optimizer = ConcreteDSPyOptimizer(model="databricks")

    def check_context(*args, **kwargs):
        assert isinstance(dspy.settings["lm"], AgentEvalLM)
        return MagicMock()

    with (
        patch("mlflow.genai.judges.optimizers.dspy.make_judge", return_value=MagicMock()),
        patch.object(optimizer, "_dspy_optimize", side_effect=check_context),
        patch.object(optimizer, "get_min_traces_required", return_value=0),
    ):
        optimizer.align(mock_judge, sample_traces_with_assessments)


def test_align_configures_openai_lm_in_context(sample_traces_with_assessments):
    mock_judge = MockJudge(name="mock_judge", model="openai:/gpt-4")
    optimizer = ConcreteDSPyOptimizer(model="openai:/gpt-4.1")

    def check_context(*args, **kwargs):
        assert isinstance(dspy.settings["lm"], dspy.LM)
        assert dspy.settings["lm"].model == "openai/gpt-4.1"
        return MagicMock()

    with (
        patch(
            "mlflow.genai.judges.optimizers.dspy.trace_to_dspy_example", return_value=MagicMock()
        ),
        patch("mlflow.genai.judges.optimizers.dspy.make_judge", return_value=MagicMock()),
        patch.object(optimizer, "_dspy_optimize", side_effect=check_context),
        patch.object(optimizer, "get_min_traces_required", return_value=0),
    ):
        optimizer.align(mock_judge, sample_traces_with_assessments)


@pytest.mark.parametrize(
    ("lm_value", "lm_model", "expected_judge_model"),
    [
        (None, None, "openai:/gpt-4"),
        ("mock_lm", "anthropic/claude-3", "anthropic:/claude-3"),
        ("mock_lm", "databricks", "databricks"),
    ],
)
def test_dspy_program_forward_lm_parameter_handling(lm_value, lm_model, expected_judge_model):
    original_judge_model = "openai:/gpt-4"
    mock_judge = MockJudge(name="test_judge", model=original_judge_model)

    optimizer = ConcreteDSPyOptimizer()
    program = optimizer._get_dspy_program_from_judge(mock_judge)

    make_judge_calls = []
    captured_args = {}

    def track_make_judge(name, instructions, model, feedback_value_type):
        make_judge_calls.append(model)
        captured_args["name"] = name
        captured_args["instructions"] = instructions
        mock_feedback = MagicMock()
        mock_feedback.value = "pass"
        mock_feedback.rationale = "Test"
        return MagicMock(return_value=mock_feedback)

    with patch("mlflow.genai.judges.optimizers.dspy.make_judge", side_effect=track_make_judge):
        kwargs = {"inputs": "test", "outputs": "test"}
        if lm_value == "mock_lm":
            mock_lm = MagicMock()
            mock_lm.model = lm_model
            kwargs["lm"] = mock_lm

        program.forward(**kwargs)

        assert len(make_judge_calls) == 1
        assert make_judge_calls[0] == expected_judge_model
        # Verify instructions from judge are passed through
        assert captured_args["name"] == "test_judge"
        assert captured_args["instructions"] == mock_judge.instructions


def test_dspy_program_uses_make_judge_with_optimized_instructions(sample_traces_with_assessments):
    original_instructions = (
        "Original judge instructions for evaluation of {{inputs}} and {{outputs}}"
    )
    optimized_instructions = (
        "Optimized instructions after DSPy alignment for {{inputs}} and {{outputs}}"
    )
    mock_judge = MockJudge(
        name="mock_judge", model="openai:/gpt-4", instructions=original_instructions
    )
    captured_instructions = None

    def capture_make_judge(name, instructions, model, feedback_value_type):
        nonlocal captured_instructions
        captured_instructions = instructions
        mock_feedback = MagicMock()
        mock_feedback.value = "pass"
        mock_feedback.rationale = "Test"
        return MagicMock(return_value=mock_feedback)

    class TestOptimizer(ConcreteDSPyOptimizer):
        def _dspy_optimize(self, program, examples, metric_fn):
            program.signature.instructions = optimized_instructions

            with patch(
                "mlflow.genai.judges.optimizers.dspy.make_judge", side_effect=capture_make_judge
            ):
                program.forward(inputs="test input", outputs="test output")

            return program

    optimizer = TestOptimizer()
    with (
        patch("dspy.LM", MagicMock()),
        patch.object(TestOptimizer, "get_min_traces_required", return_value=5),
    ):
        optimizer.align(mock_judge, sample_traces_with_assessments)
        assert captured_instructions == optimized_instructions
```

--------------------------------------------------------------------------------

````
