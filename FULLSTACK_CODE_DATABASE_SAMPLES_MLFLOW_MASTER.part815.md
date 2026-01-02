---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 815
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 815 of 991)

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

---[FILE: test_session_utils.py]---
Location: mlflow-master/tests/genai/evaluate/test_session_utils.py

```python
from unittest.mock import Mock, patch

import pytest

import mlflow
from mlflow.entities import TraceData, TraceInfo, TraceLocation, TraceState
from mlflow.entities.assessment import Feedback
from mlflow.entities.assessment_source import AssessmentSource, AssessmentSourceType
from mlflow.entities.trace import Trace
from mlflow.exceptions import MlflowException
from mlflow.genai import scorer
from mlflow.genai.evaluation.entities import EvalItem
from mlflow.genai.evaluation.session_utils import (
    classify_scorers,
    evaluate_session_level_scorers,
    get_first_trace_in_session,
    group_traces_by_session,
    validate_session_level_evaluation_inputs,
)
from mlflow.tracing.constant import TraceMetadataKey


class _MultiTurnTestScorer:
    """Helper class for testing multi-turn scorers."""

    def __init__(self, name="test_multi_turn_scorer"):
        self.name = name
        self.is_session_level_scorer = True
        self.aggregations = []

    def run(self, session=None, **kwargs):
        return True

    def __call__(self, traces=None, **kwargs):
        return 1.0


# ==================== Tests for classify_scorers ====================


def test_classify_scorers_all_single_turn():
    @scorer
    def custom_scorer1(outputs):
        return 1.0

    @scorer
    def custom_scorer2(outputs):
        return 2.0

    scorers_list = [custom_scorer1, custom_scorer2]
    single_turn, multi_turn = classify_scorers(scorers_list)

    assert len(single_turn) == 2
    assert len(multi_turn) == 0
    assert single_turn == scorers_list


def test_classify_scorers_all_multi_turn():
    multi_turn_scorer1 = _MultiTurnTestScorer(name="multi_turn_scorer1")
    multi_turn_scorer2 = _MultiTurnTestScorer(name="multi_turn_scorer2")

    scorers_list = [multi_turn_scorer1, multi_turn_scorer2]
    single_turn, multi_turn = classify_scorers(scorers_list)

    assert len(single_turn) == 0
    assert len(multi_turn) == 2
    assert multi_turn == scorers_list
    # Verify they are actually multi-turn
    assert multi_turn_scorer1.is_session_level_scorer is True
    assert multi_turn_scorer2.is_session_level_scorer is True


def test_classify_scorers_mixed():
    @scorer
    def single_turn_scorer(outputs):
        return 1.0

    multi_turn_scorer = _MultiTurnTestScorer(name="multi_turn_scorer")

    scorers_list = [single_turn_scorer, multi_turn_scorer]
    single_turn, multi_turn = classify_scorers(scorers_list)

    assert len(single_turn) == 1
    assert len(multi_turn) == 1
    assert single_turn[0] == single_turn_scorer
    assert multi_turn[0] == multi_turn_scorer
    # Verify properties
    assert single_turn_scorer.is_session_level_scorer is False
    assert multi_turn_scorer.is_session_level_scorer is True


def test_classify_scorers_empty_list():
    single_turn, multi_turn = classify_scorers([])

    assert len(single_turn) == 0
    assert len(multi_turn) == 0


# ==================== Tests for group_traces_by_session ====================


def _create_mock_trace(trace_id: str, session_id: str | None, request_time: int):
    """Helper to create a mock trace with session_id and request_time."""
    trace_metadata = {}
    if session_id is not None:
        trace_metadata[TraceMetadataKey.TRACE_SESSION] = session_id

    trace_info = TraceInfo(
        trace_id=trace_id,
        trace_location=TraceLocation.from_experiment_id("0"),
        request_time=request_time,
        execution_duration=1000,
        state=TraceState.OK,
        trace_metadata=trace_metadata,
        tags={},
    )

    trace = Mock(spec=Trace)
    trace.info = trace_info
    trace.data = TraceData(spans=[])
    return trace


def _create_mock_eval_item(trace):
    """Helper to create a mock EvalItem with a trace."""
    eval_item = Mock(spec=EvalItem)
    eval_item.trace = trace
    eval_item.source = None  # Explicitly set to None so it doesn't return a Mock
    return eval_item


def test_group_traces_by_session_single_session():
    trace1 = _create_mock_trace("trace-1", "session-1", 1000)
    trace2 = _create_mock_trace("trace-2", "session-1", 2000)
    trace3 = _create_mock_trace("trace-3", "session-1", 3000)

    eval_item1 = _create_mock_eval_item(trace1)
    eval_item2 = _create_mock_eval_item(trace2)
    eval_item3 = _create_mock_eval_item(trace3)

    eval_items = [eval_item1, eval_item2, eval_item3]
    session_groups = group_traces_by_session(eval_items)

    assert len(session_groups) == 1
    assert "session-1" in session_groups
    assert len(session_groups["session-1"]) == 3

    # Check that all traces are included
    session_traces = [item.trace for item in session_groups["session-1"]]
    assert trace1 in session_traces
    assert trace2 in session_traces
    assert trace3 in session_traces


def test_group_traces_by_session_multiple_sessions():
    trace1 = _create_mock_trace("trace-1", "session-1", 1000)
    trace2 = _create_mock_trace("trace-2", "session-1", 2000)
    trace3 = _create_mock_trace("trace-3", "session-2", 1500)
    trace4 = _create_mock_trace("trace-4", "session-2", 2500)

    eval_items = [
        _create_mock_eval_item(trace1),
        _create_mock_eval_item(trace2),
        _create_mock_eval_item(trace3),
        _create_mock_eval_item(trace4),
    ]

    session_groups = group_traces_by_session(eval_items)

    assert len(session_groups) == 2
    assert "session-1" in session_groups
    assert "session-2" in session_groups
    assert len(session_groups["session-1"]) == 2
    assert len(session_groups["session-2"]) == 2


def test_group_traces_by_session_excludes_no_session_id():
    trace1 = _create_mock_trace("trace-1", "session-1", 1000)
    trace2 = _create_mock_trace("trace-2", None, 2000)  # No session_id
    trace3 = _create_mock_trace("trace-3", "session-1", 3000)

    eval_items = [
        _create_mock_eval_item(trace1),
        _create_mock_eval_item(trace2),
        _create_mock_eval_item(trace3),
    ]

    session_groups = group_traces_by_session(eval_items)

    assert len(session_groups) == 1
    assert "session-1" in session_groups
    assert len(session_groups["session-1"]) == 2
    # trace2 should not be included
    session_traces = [item.trace for item in session_groups["session-1"]]
    assert trace1 in session_traces
    assert trace2 not in session_traces
    assert trace3 in session_traces


def test_group_traces_by_session_excludes_none_traces():
    trace1 = _create_mock_trace("trace-1", "session-1", 1000)

    eval_item1 = _create_mock_eval_item(trace1)
    eval_item2 = Mock()
    eval_item2.trace = None  # No trace
    eval_item2.source = None  # No source

    eval_items = [eval_item1, eval_item2]
    session_groups = group_traces_by_session(eval_items)

    assert len(session_groups) == 1
    assert "session-1" in session_groups
    assert len(session_groups["session-1"]) == 1


def test_group_traces_by_session_empty_list():
    session_groups = group_traces_by_session([])

    assert len(session_groups) == 0
    assert session_groups == {}


# ==================== Tests for get_first_trace_in_session ====================


def test_get_first_trace_in_session_chronological_order():
    trace1 = _create_mock_trace("trace-1", "session-1", 3000)
    trace2 = _create_mock_trace("trace-2", "session-1", 1000)  # Earliest
    trace3 = _create_mock_trace("trace-3", "session-1", 2000)

    eval_item1 = _create_mock_eval_item(trace1)
    eval_item2 = _create_mock_eval_item(trace2)
    eval_item3 = _create_mock_eval_item(trace3)

    session_items = [eval_item1, eval_item2, eval_item3]

    first_item = get_first_trace_in_session(session_items)

    assert first_item.trace == trace2
    assert first_item == eval_item2


def test_get_first_trace_in_session_single_trace():
    trace1 = _create_mock_trace("trace-1", "session-1", 1000)
    eval_item1 = _create_mock_eval_item(trace1)

    session_items = [eval_item1]

    first_item = get_first_trace_in_session(session_items)

    assert first_item.trace == trace1
    assert first_item == eval_item1


def test_get_first_trace_in_session_same_timestamp():
    # When timestamps are equal, min() will return the first one in the list
    trace1 = _create_mock_trace("trace-1", "session-1", 1000)
    trace2 = _create_mock_trace("trace-2", "session-1", 1000)
    trace3 = _create_mock_trace("trace-3", "session-1", 1000)

    eval_item1 = _create_mock_eval_item(trace1)
    eval_item2 = _create_mock_eval_item(trace2)
    eval_item3 = _create_mock_eval_item(trace3)

    session_items = [eval_item1, eval_item2, eval_item3]

    first_item = get_first_trace_in_session(session_items)

    # Should return one of the traces with timestamp 1000 (likely the first one)
    assert first_item.trace.info.request_time == 1000


# ==================== Tests for validate_session_level_evaluation_inputs ====================


def test_validate_session_level_evaluation_inputs_no_session_level_scorers():
    @scorer
    def single_turn_scorer(outputs):
        return 1.0

    scorers_list = [single_turn_scorer]

    # Should not raise any exceptions
    validate_session_level_evaluation_inputs(
        scorers=scorers_list,
        predict_fn=None,
    )


def test_validate_session_level_evaluation_inputs_with_predict_fn():
    multi_turn_scorer = _MultiTurnTestScorer()
    scorers_list = [multi_turn_scorer]

    def dummy_predict_fn():
        return "output"

    with pytest.raises(
        MlflowException,
        match=r"Multi-turn scorers are not yet supported with predict_fn.*"
        r"Please pass existing traces containing session IDs to `data`",
    ):
        validate_session_level_evaluation_inputs(
            scorers=scorers_list,
            predict_fn=dummy_predict_fn,
        )


def test_validate_session_level_evaluation_inputs_mixed_scorers():
    @scorer
    def single_turn_scorer(outputs):
        return 1.0

    multi_turn_scorer = _MultiTurnTestScorer()
    scorers_list = [single_turn_scorer, multi_turn_scorer]

    # Should not raise any exceptions
    validate_session_level_evaluation_inputs(
        scorers=scorers_list,
        predict_fn=None,
    )


# ==================== Tests for evaluate_session_level_scorers ====================


def _create_test_trace(trace_id: str, request_time: int = 0) -> Trace:
    """Helper to create a minimal test trace"""
    return Trace(
        info=TraceInfo(
            trace_id=trace_id,
            trace_location=TraceLocation.from_experiment_id("0"),
            request_time=request_time,
            execution_duration=100,
            state=TraceState.OK,
            trace_metadata={},
            tags={},
        ),
        data=TraceData(spans=[]),
    )


def _create_eval_item(trace_id: str, request_time: int = 0) -> EvalItem:
    """Helper to create a minimal EvalItem with a trace"""
    trace = _create_test_trace(trace_id, request_time)
    return EvalItem(
        request_id=trace_id,
        trace=trace,
        inputs={},
        outputs={},
        expectations={},
    )


def test_evaluate_session_level_scorers_success():
    mock_scorer = Mock(spec=mlflow.genai.Scorer)
    mock_scorer.name = "test_scorer"
    mock_scorer.run.return_value = 0.8

    # Test with a single session containing multiple traces
    session_items = [
        _create_eval_item("trace1", request_time=100),
        _create_eval_item("trace2", request_time=200),
    ]

    with patch(
        "mlflow.genai.evaluation.session_utils.standardize_scorer_value"
    ) as mock_standardize:
        # Return a new Feedback object each time to avoid metadata overwriting
        def create_feedback(*args, **kwargs):
            return [
                Feedback(
                    name="test_scorer",
                    source=AssessmentSource(
                        source_type=AssessmentSourceType.CODE, source_id="test"
                    ),
                    value=0.8,
                )
            ]

        mock_standardize.side_effect = create_feedback

        result = evaluate_session_level_scorers("session1", session_items, [mock_scorer])

        # Verify scorer was called once (for the single session)
        assert mock_scorer.run.call_count == 1

        # Verify scorer received session traces
        call_args = mock_scorer.run.call_args
        assert "session" in call_args.kwargs
        assert len(call_args.kwargs["session"]) == 2  # session has 2 traces

        # Verify result contains assessments for first trace
        assert "trace1" in result  # First trace (earliest timestamp)
        assert len(result["trace1"]) == 1
        assert result["trace1"][0].name == "test_scorer"
        assert result["trace1"][0].value == 0.8

        # Verify session_id was added to metadata
        assert result["trace1"][0].metadata is not None
        assert result["trace1"][0].metadata[TraceMetadataKey.TRACE_SESSION] == "session1"


def test_evaluate_session_level_scorers_handles_scorer_error():
    mock_scorer = Mock(spec=mlflow.genai.Scorer)
    mock_scorer.name = "failing_scorer"
    mock_scorer.run.side_effect = ValueError("Scorer failed!")

    session_items = [_create_eval_item("trace1", 100)]

    result = evaluate_session_level_scorers("session1", session_items, [mock_scorer])

    # Verify error feedback was created
    assert "trace1" in result
    assert len(result["trace1"]) == 1
    feedback = result["trace1"][0]
    assert feedback.name == "failing_scorer"
    assert feedback.error is not None
    assert feedback.error.error_code == "SCORER_ERROR"
    assert feedback.error.stack_trace is not None

    assert feedback.error.to_proto().error_message == "Scorer failed!"
    assert isinstance(feedback.error.error_message, str)
    assert feedback.error.error_message == "Scorer failed!"


def test_evaluate_session_level_scorers_multiple_feedbacks_per_scorer():
    mock_scorer = Mock(spec=mlflow.genai.Scorer)
    mock_scorer.name = "multi_feedback_scorer"
    mock_scorer.run.return_value = {"metric1": 0.7, "metric2": 0.9}

    session_items = [_create_eval_item("trace1", 100)]

    with patch(
        "mlflow.genai.evaluation.session_utils.standardize_scorer_value"
    ) as mock_standardize:
        feedbacks = [
            Feedback(
                name="multi_feedback_scorer/metric1",
                source=AssessmentSource(source_type=AssessmentSourceType.CODE, source_id="test"),
                value=0.7,
            ),
            Feedback(
                name="multi_feedback_scorer/metric2",
                source=AssessmentSource(source_type=AssessmentSourceType.CODE, source_id="test"),
                value=0.9,
            ),
        ]
        mock_standardize.return_value = feedbacks

        result = evaluate_session_level_scorers("session1", session_items, [mock_scorer])

        # Verify both feedbacks are stored
        assert "trace1" in result
        assert len(result["trace1"]) == 2
        # Find feedbacks by name
        feedback_by_name = {f.name: f for f in result["trace1"]}
        assert "multi_feedback_scorer/metric1" in feedback_by_name
        assert "multi_feedback_scorer/metric2" in feedback_by_name
        assert feedback_by_name["multi_feedback_scorer/metric1"].value == 0.7
        assert feedback_by_name["multi_feedback_scorer/metric2"].value == 0.9


def test_evaluate_session_level_scorers_first_trace_selection():
    mock_scorer = Mock(spec=mlflow.genai.Scorer)
    mock_scorer.name = "first_trace_scorer"
    mock_scorer.run.return_value = 1.0

    # Create session with traces in non-chronological order
    session_items = [
        _create_eval_item("trace2", request_time=200),  # Second chronologically
        _create_eval_item("trace1", request_time=100),  # First chronologically
        _create_eval_item("trace3", request_time=300),  # Third chronologically
    ]

    with patch(
        "mlflow.genai.evaluation.session_utils.standardize_scorer_value"
    ) as mock_standardize:
        feedback = Feedback(
            name="first_trace_scorer",
            source=AssessmentSource(source_type=AssessmentSourceType.CODE, source_id="test"),
            value=1.0,
        )
        mock_standardize.return_value = [feedback]

        result = evaluate_session_level_scorers("session1", session_items, [mock_scorer])

        # Verify assessment is stored on trace1 (earliest request_time)
        assert "trace1" in result
        assert "trace2" not in result
        assert "trace3" not in result
        assert len(result["trace1"]) == 1
        assert result["trace1"][0].name == "first_trace_scorer"
        assert result["trace1"][0].value == 1.0


def test_evaluate_session_level_scorers_multiple_scorers():
    mock_scorer1 = Mock(spec=mlflow.genai.Scorer)
    mock_scorer1.name = "scorer1"
    mock_scorer1.run.return_value = 0.6

    mock_scorer2 = Mock(spec=mlflow.genai.Scorer)
    mock_scorer2.name = "scorer2"
    mock_scorer2.run.return_value = 0.8

    session_items = [_create_eval_item("trace1", 100)]

    with patch(
        "mlflow.genai.evaluation.session_utils.standardize_scorer_value"
    ) as mock_standardize:

        def create_feedback(name, value):
            return [
                Feedback(
                    name=name,
                    source=AssessmentSource(
                        source_type=AssessmentSourceType.CODE, source_id="test"
                    ),
                    value=value,
                )
            ]

        mock_standardize.side_effect = [
            create_feedback("scorer1", 0.6),
            create_feedback("scorer2", 0.8),
        ]

        result = evaluate_session_level_scorers(
            "session1", session_items, [mock_scorer1, mock_scorer2]
        )

        # Verify both scorers were evaluated (runs in parallel)
        assert mock_scorer1.run.call_count == 1
        assert mock_scorer2.run.call_count == 1

        # Verify result contains assessments from both scorers
        assert "trace1" in result
        assert len(result["trace1"]) == 2
        # Find feedbacks by name
        feedback_by_name = {f.name: f for f in result["trace1"]}
        assert "scorer1" in feedback_by_name
        assert "scorer2" in feedback_by_name
        assert feedback_by_name["scorer1"].value == 0.6
        assert feedback_by_name["scorer2"].value == 0.8
```

--------------------------------------------------------------------------------

---[FILE: test_telemetry.py]---
Location: mlflow-master/tests/genai/evaluate/test_telemetry.py

```python
from unittest import mock

import pytest

from mlflow.genai import Scorer, scorer
from mlflow.genai.evaluation.telemetry import (
    _BATCH_SIZE_HEADER,
    _CLIENT_NAME_HEADER,
    _CLIENT_VERSION_HEADER,
    _SESSION_ID_HEADER,
    emit_custom_metric_event,
)
from mlflow.genai.judges import make_judge
from mlflow.genai.scorers import Correctness, Guidelines
from mlflow.genai.scorers.validation import IS_DBX_AGENTS_INSTALLED
from mlflow.version import VERSION

if not IS_DBX_AGENTS_INSTALLED:
    pytest.skip("Skipping Databricks only test.", allow_module_level=True)


@scorer
def is_concise(outputs) -> bool:
    return len(outputs) < 100


@scorer
def is_correct(outputs, expectations) -> bool:
    return outputs == expectations["expected_response"]


# Class based scorers
class IsEmpty(Scorer):
    name: str = "is_empty"

    def __call__(self, *, outputs) -> bool:
        return outputs == ""


def test_emit_custom_metric_event():
    from databricks.agents.evals import metric

    # Legacy custom metrics
    @metric
    def not_empty(response):
        return response != ""

    scorers = [
        # Built-in
        Correctness(),
        Guidelines(guidelines="The answer must be concise and straight to the point."),
        # Custom
        is_concise,
        is_correct,
        IsEmpty(),
        not_empty,
        make_judge(
            name="is_kind",
            instructions="The answer must be kind. {{ outputs }}",
            feedback_value_type=str,
        ),
    ]
    with (
        mock.patch("mlflow.genai.evaluation.telemetry.is_databricks_uri", return_value=True),
        mock.patch(
            "mlflow.genai.evaluation.telemetry.http_request", autospec=True
        ) as mock_http_request,
        mock.patch("mlflow.genai.evaluation.telemetry.get_databricks_host_creds"),
    ):
        emit_custom_metric_event(
            scorers=scorers,
            eval_count=10,
            aggregated_metrics={
                "is_concise/mean": 0.1,
                "is_concise/min": 0.2,
                "is_concise/max": 0.3,
                "is_correct/mean": 0.4,
                "is_empty/mean": 0.5,
                "not_empty/max": 0.6,
                "correctness/mean": 0.7,
                "guidelines/mean": 0.8,
                "is_kind/mean": 0.9,
            },
        )

    mock_http_request.assert_called_once()
    call_args = mock_http_request.call_args[1]

    assert call_args["method"] == "POST"
    assert call_args["endpoint"] == "/api/2.0/agents/evaluation-client-usage-events"

    headers = call_args["extra_headers"]
    assert headers[_CLIENT_VERSION_HEADER] == VERSION
    assert headers[_SESSION_ID_HEADER] is not None
    assert headers[_BATCH_SIZE_HEADER] == "10"
    assert headers[_CLIENT_NAME_HEADER] == "mlflow"

    event = call_args["json"]
    assert len(event["metric_names"]) == 5
    assert all(isinstance(name, str) for name in event["metric_names"])
    assert event["eval_count"] == 10
    assert event["metrics"] == [
        {
            "name": mock.ANY,
            "average": 0.1,
            "count": 10,
        },
        {
            "name": mock.ANY,
            "average": 0.4,
            "count": 10,
        },
        {
            "name": mock.ANY,
            "average": 0.5,
            "count": 10,
        },
        {
            "name": mock.ANY,
            "average": None,
            "count": 10,
        },
        {
            "name": mock.ANY,
            "average": 0.9,
            "count": 10,
        },
    ]
    # Metric names should be hashed
    assert isinstance(event["metrics"][0]["name"], str)
    assert event["metrics"][0]["name"] != "is_concise"


def test_emit_custom_metric_usage_event_skip_outside_databricks():
    with (
        mock.patch("mlflow.genai.evaluation.telemetry.is_databricks_uri", return_value=False),
        mock.patch(
            "mlflow.genai.evaluation.telemetry.http_request", autospec=True
        ) as mock_http_request,
        mock.patch("mlflow.genai.evaluation.telemetry.get_databricks_host_creds"),
    ):
        emit_custom_metric_event(
            scorers=[is_concise, is_correct],
            eval_count=10,
            aggregated_metrics={"is_concise/mean": 0.1, "is_correct/mean": 0.2},
        )
    mock_http_request.assert_not_called()


def test_emit_custom_metric_usage_event_with_sessions():
    with (
        mock.patch("mlflow.genai.evaluation.telemetry.is_databricks_uri", return_value=True),
        mock.patch(
            "mlflow.genai.evaluation.telemetry.http_request", autospec=True
        ) as mock_http_request,
        mock.patch("mlflow.genai.evaluation.telemetry.get_databricks_host_creds"),
    ):
        for _ in range(3):
            emit_custom_metric_event(
                scorers=[is_concise, is_correct],
                eval_count=10,
                aggregated_metrics={"is_concise/mean": 0.1, "is_correct/mean": 0.2},
            )

    assert mock_http_request.call_count == 3
    session_ids = [
        call_args[1]["extra_headers"][_SESSION_ID_HEADER]
        for call_args in mock_http_request.call_args_list
    ]
    assert len(set(session_ids)) == 1
    assert all(session_id is not None for session_id in session_ids)
```

--------------------------------------------------------------------------------

---[FILE: test_to_predict_fn.py]---
Location: mlflow-master/tests/genai/evaluate/test_to_predict_fn.py

```python
from unittest import mock

import pytest

import mlflow
from mlflow.entities.trace_info import TraceInfo
from mlflow.environment_variables import MLFLOW_ENABLE_ASYNC_TRACE_LOGGING
from mlflow.genai.evaluation.base import to_predict_fn
from mlflow.genai.utils.trace_utils import convert_predict_fn

from tests.tracing.helper import V2_TRACE_DICT

_DUMMY_CHAT_RESPONSE = {
    "id": "1",
    "object": "text_completion",
    "created": "2021-10-01T00:00:00.000000Z",
    "model": "gpt-4o-mini",
    "choices": [
        {
            "index": 0,
            "message": {
                "content": "This is a response",
                "role": "assistant",
            },
            "finish_reason": "length",
        }
    ],
    "usage": {
        "prompt_tokens": 1,
        "completion_tokens": 1,
        "total_tokens": 2,
    },
}


@pytest.fixture
def mock_deploy_client():
    with mock.patch("mlflow.deployments.get_deploy_client") as mock_get:
        yield mock_get.return_value


# TODO: Remove this once OSS backend is migrated to V3.
@pytest.fixture
def mock_tracing_client(monkeypatch):
    # Mock the TracingClient
    with mock.patch("mlflow.tracing.export.mlflow_v3.TracingClient") as mock_get:
        tracing_client = mock_get.return_value
        tracing_client.tracking_uri = "databricks"

        # Set up trace exporter to Databricks.
        monkeypatch.setenv(MLFLOW_ENABLE_ASYNC_TRACE_LOGGING.name, "false")
        mlflow.set_tracking_uri("databricks")
        mlflow.tracing.enable()  # Set up trace exporter again

        yield tracing_client


def test_to_predict_fn_return_trace(sample_rag_trace, mock_deploy_client, mock_tracing_client):
    mock_deploy_client.predict.return_value = {
        **_DUMMY_CHAT_RESPONSE,
        "databricks_output": {"trace": sample_rag_trace.to_dict()},
    }
    messages = [
        {"content": "You are a helpful assistant.", "role": "system"},
        {"content": "What is Spark?", "role": "user"},
    ]

    predict_fn = to_predict_fn("endpoints:/chat")
    response = predict_fn(messages=messages)

    mock_deploy_client.predict.assert_called_once_with(
        endpoint="chat",
        inputs={
            "messages": messages,
            "databricks_options": {"return_trace": True},
        },
    )
    assert response == _DUMMY_CHAT_RESPONSE  # Response should not contain databricks_output

    # Trace from endpoint (sample_rag_trace) should be copied to the current experiment
    mock_tracing_client.start_trace.assert_called_once()
    trace_info = mock_tracing_client.start_trace.call_args[0][0]
    # Copied trace should have a new trace ID
    assert trace_info.trace_id != sample_rag_trace.info.trace_id
    assert trace_info.request_preview == '{"question": "query"}'
    assert trace_info.response_preview == '"answer"'

    trace_data = mock_tracing_client._upload_trace_data.call_args[0][1]
    assert len(trace_data.spans) == 3
    for old, new in zip(sample_rag_trace.data.spans, trace_data.spans):
        assert old.name == new.name
        assert old.inputs == new.inputs
        assert old.outputs == new.outputs
        assert old.start_time_ns == new.start_time_ns
        assert old.end_time_ns == new.end_time_ns
        assert old.parent_id == new.parent_id
        assert old.span_id == new.span_id
    mock_tracing_client._upload_trace_data.assert_called_once_with(mock.ANY, trace_data)


@pytest.mark.parametrize(
    "databricks_output",
    [
        {},
        {"databricks_output": {}},
        {"databricks_output": {"trace": None}},
    ],
)
def test_to_predict_fn_does_not_return_trace(
    databricks_output, mock_deploy_client, mock_tracing_client
):
    mock_deploy_client.predict.return_value = {**_DUMMY_CHAT_RESPONSE, **databricks_output}
    messages = [
        {"content": "You are a helpful assistant.", "role": "system"},
        {"content": "What is Spark?", "role": "user"},
    ]

    predict_fn = to_predict_fn("endpoints:/chat")
    response = predict_fn(messages=messages)

    mock_deploy_client.predict.assert_called_once_with(
        endpoint="chat",
        inputs={
            "messages": messages,
            "databricks_options": {"return_trace": True},
        },
    )
    assert response == _DUMMY_CHAT_RESPONSE  # Response should not contain databricks_output

    # Bare-minimum trace should be created when the endpoint does not return a trace
    mock_tracing_client.start_trace.assert_called_once()
    trace_info = mock_tracing_client.start_trace.call_args[0][0]
    assert trace_info.request_preview == "What is Spark?"
    trace_data = mock_tracing_client._upload_trace_data.call_args[0][1]
    assert len(trace_data.spans) == 1
    assert trace_data.spans[0].name == "predict"


def test_to_predict_fn_pass_tracing_check(
    sample_rag_trace, mock_deploy_client, mock_tracing_client
):
    """
    The function produced by to_predict_fn() is guaranteed to create a trace.
    Therefore it should not be wrapped by @mlflow.trace by convert_predict_fn().
    """
    mock_deploy_client.predict.side_effect = lambda **kwargs: {
        **_DUMMY_CHAT_RESPONSE,
        "databricks_output": {"trace": sample_rag_trace.to_dict()},
    }
    sample_input = {"messages": [{"role": "user", "content": "Hi"}]}

    predict_fn = to_predict_fn("endpoints:/chat")
    converted = convert_predict_fn(predict_fn, sample_input)

    # The check should pass, the function should not be wrapped by @mlflow.trace
    wrapped = hasattr(converted, "__wrapped__")
    assert wrapped != predict_fn

    # The function should not produce a trace during the check
    mock_tracing_client.start_trace.assert_not_called()

    # The function should produce a trace when invoked
    converted(sample_input)

    mock_tracing_client.start_trace.assert_called_once()
    trace_info = mock_tracing_client.start_trace.call_args[0][0]
    assert trace_info.request_preview == '{"question": "query"}'
    assert trace_info.response_preview == '"answer"'
    # The produced trace should be the one returned from the endpoint (sample_rag_trace)
    trace_data = mock_tracing_client._upload_trace_data.call_args[0][1]
    assert trace_data.spans[0].name == "rag"
    assert trace_data.spans[0].inputs == {"question": "query"}
    assert trace_data.spans[0].outputs == "answer"


def test_to_predict_fn_return_v2_trace(mock_deploy_client, mock_tracing_client):
    mlflow.tracing.reset()

    mock_deploy_client.predict.return_value = {
        **_DUMMY_CHAT_RESPONSE,
        "databricks_output": {"trace": V2_TRACE_DICT},
    }
    messages = [
        {"content": "You are a helpful assistant.", "role": "system"},
        {"content": "What is Spark?", "role": "user"},
    ]

    predict_fn = to_predict_fn("endpoints:/chat")
    response = predict_fn(messages=messages)

    mock_deploy_client.predict.assert_called_once_with(
        endpoint="chat",
        inputs={
            "messages": messages,
            "databricks_options": {"return_trace": True},
        },
    )
    assert response == _DUMMY_CHAT_RESPONSE  # Response should not contain databricks_output

    # Trace from endpoint (sample_rag_trace) should be copied to the current experiment
    mock_tracing_client.start_trace.assert_called_once()
    trace_info = mock_tracing_client.start_trace.call_args[0][0]
    # Copied trace should have a new trace ID (and v3)
    isinstance(trace_info, TraceInfo)
    assert trace_info.trace_id != V2_TRACE_DICT["info"]["request_id"]
    assert trace_info.request_preview == '{"x": 2, "y": 5}'
    assert trace_info.response_preview == "8"
    trace_data = mock_tracing_client._upload_trace_data.call_args[0][1]
    assert len(trace_data.spans) == 2
    assert trace_data.spans[0].name == "predict"
    assert trace_data.spans[0].inputs == {"x": 2, "y": 5}
    assert trace_data.spans[0].outputs == 8
    mock_tracing_client._upload_trace_data.assert_called_once_with(mock.ANY, trace_data)


def test_to_predict_fn_should_not_pass_databricks_options_to_fmapi(
    mock_deploy_client, mock_tracing_client
):
    mock_deploy_client.get_endpoint.return_value = {
        "endpoint_type": "FOUNDATION_MODEL_API",
    }
    mock_deploy_client.predict.return_value = _DUMMY_CHAT_RESPONSE
    messages = [
        {"content": "You are a helpful assistant.", "role": "system"},
        {"content": "What is Spark?", "role": "user"},
    ]

    predict_fn = to_predict_fn("endpoints:/foundation-model-api")
    response = predict_fn(messages=messages)

    mock_deploy_client.predict.assert_called_once_with(
        endpoint="foundation-model-api",
        inputs={"messages": messages},
    )
    assert response == _DUMMY_CHAT_RESPONSE  # Response should not contain databricks_output

    # Bare-minimum trace should be created when the endpoint does not return a trace
    mock_tracing_client.start_trace.assert_called_once()
    trace_info = mock_tracing_client.start_trace.call_args[0][0]
    assert trace_info.request_preview == "What is Spark?"
    trace_data = mock_tracing_client._upload_trace_data.call_args[0][1]
    assert len(trace_data.spans) == 1
    assert trace_data.spans[0].name == "predict"


def test_to_predict_fn_handles_trace_without_tags(
    sample_rag_trace, mock_deploy_client, mock_tracing_client
):
    # Create a trace dict without `tags` field
    trace_dict = sample_rag_trace.to_dict()
    trace_dict["info"].pop("tags", None)  # Remove tags field entirely

    mock_deploy_client.predict.return_value = {
        **_DUMMY_CHAT_RESPONSE,
        "databricks_output": {"trace": trace_dict},
    }
    messages = [
        {"content": "You are a helpful assistant.", "role": "system"},
        {"content": "What is Spark?", "role": "user"},
    ]

    predict_fn = to_predict_fn("endpoints:/chat")
    response = predict_fn(messages=messages)

    mock_deploy_client.predict.assert_called_once_with(
        endpoint="chat",
        inputs={
            "messages": messages,
            "databricks_options": {"return_trace": True},
        },
    )
    assert response == _DUMMY_CHAT_RESPONSE

    # Trace should be copied successfully even without tags
    mock_tracing_client.start_trace.assert_called_once()
    trace_info = mock_tracing_client.start_trace.call_args[0][0]
    assert trace_info.trace_id != sample_rag_trace.info.trace_id
    assert trace_info.request_preview == '{"question": "query"}'
    assert trace_info.response_preview == '"answer"'

    trace_data = mock_tracing_client._upload_trace_data.call_args[0][1]
    assert len(trace_data.spans) == 3
    mock_tracing_client._upload_trace_data.assert_called_once_with(mock.ANY, trace_data)


def test_to_predict_fn_reuses_trace_in_dual_write_mode(
    sample_rag_trace, mock_deploy_client, mock_tracing_client
):
    """
    Test that when an endpoint logs traces to both inference table and MLflow experiment
    (dual-write mode), the trace is reused instead of being re-logged.

    This happens when MLFLOW_EXPERIMENT_ID env var is set in the serving endpoint.
    """
    # Set up an experiment context
    experiment_id = "test-experiment-123"
    with mock.patch(
        "mlflow.genai.evaluation.base._get_experiment_id", return_value=experiment_id
    ) as mock_get_experiment_id:
        # Create a trace dict with experiment_id matching the current experiment
        trace_dict = sample_rag_trace.to_dict()
        trace_dict["info"]["trace_location"] = {
            "mlflow_experiment": {"experiment_id": experiment_id}
        }

        mock_deploy_client.predict.return_value = {
            **_DUMMY_CHAT_RESPONSE,
            "databricks_output": {"trace": trace_dict},
        }
        messages = [
            {"content": "You are a helpful assistant.", "role": "system"},
            {"content": "What is Spark?", "role": "user"},
        ]

        predict_fn = to_predict_fn("endpoints:/chat")
        response = predict_fn(messages=messages)

        mock_deploy_client.predict.assert_called_once_with(
            endpoint="chat",
            inputs={
                "messages": messages,
                "databricks_options": {"return_trace": True},
            },
        )
        assert response == _DUMMY_CHAT_RESPONSE

        # The trace should NOT be copied when it's already in the current experiment
        mock_tracing_client.start_trace.assert_not_called()
        mock_tracing_client._upload_trace_data.assert_not_called()
        mock_get_experiment_id.assert_called_once()


def test_to_predict_fn_copies_trace_when_experiment_differs(
    sample_rag_trace, mock_deploy_client, mock_tracing_client
):
    """
    Test that when an endpoint returns a trace from a different experiment,
    the trace is still copied to the current experiment.
    """
    # Set up an experiment context
    current_experiment_id = "current-experiment-123"
    endpoint_experiment_id = "different-experiment-456"

    with mock.patch(
        "mlflow.genai.evaluation.base._get_experiment_id", return_value=current_experiment_id
    ) as mock_get_experiment_id:
        # Create a trace dict with a different experiment_id
        trace_dict = sample_rag_trace.to_dict()
        trace_dict["info"]["trace_location"] = {
            "mlflow_experiment": {"experiment_id": endpoint_experiment_id}
        }

        mock_deploy_client.predict.return_value = {
            **_DUMMY_CHAT_RESPONSE,
            "databricks_output": {"trace": trace_dict},
        }
        messages = [
            {"content": "You are a helpful assistant.", "role": "system"},
            {"content": "What is Spark?", "role": "user"},
        ]

        predict_fn = to_predict_fn("endpoints:/chat")
        response = predict_fn(messages=messages)

        mock_deploy_client.predict.assert_called_once_with(
            endpoint="chat",
            inputs={
                "messages": messages,
                "databricks_options": {"return_trace": True},
            },
        )
        assert response == _DUMMY_CHAT_RESPONSE

        # The trace SHOULD be copied when experiments differ
        mock_tracing_client.start_trace.assert_called_once()
        trace_info = mock_tracing_client.start_trace.call_args[0][0]
        # Copied trace should have a new trace ID
        assert trace_info.trace_id != sample_rag_trace.info.trace_id
        mock_tracing_client._upload_trace_data.assert_called_once()
        mock_get_experiment_id.assert_called_once()
```

--------------------------------------------------------------------------------

````
