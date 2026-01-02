---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 956
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 956 of 991)

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

---[FILE: test_mlflow_v3_exporter.py]---
Location: mlflow-master/tests/tracing/export/test_mlflow_v3_exporter.py

```python
import json
import os
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from unittest import mock

import pytest
from google.protobuf.json_format import ParseDict

import mlflow
from mlflow.entities import LiveSpan
from mlflow.entities.model_registry import PromptVersion
from mlflow.entities.span_event import SpanEvent
from mlflow.entities.trace import Trace
from mlflow.entities.trace_info import TraceInfo
from mlflow.entities.trace_location import MlflowExperimentLocation
from mlflow.protos import service_pb2 as pb
from mlflow.tracing.constant import SpansLocation, TraceMetadataKey, TraceSizeStatsKey, TraceTagKey
from mlflow.tracing.export.mlflow_v3 import MlflowV3SpanExporter
from mlflow.tracing.provider import _get_trace_exporter
from mlflow.tracing.trace_manager import InMemoryTraceManager
from mlflow.tracing.utils import generate_trace_id_v3

from tests.tracing.helper import create_mock_otel_span, create_test_trace_info

_EXPERIMENT_ID = "dummy-experiment-id"


def join_thread_by_name_prefix(prefix: str, timeout: float = 5.0):
    """Join thread by name prefix to avoid time.sleep in tests."""
    for thread in threading.enumerate():
        if thread != threading.main_thread() and thread.name.startswith(prefix):
            thread.join(timeout=timeout)


@mlflow.trace
def _predict(x: str) -> str:
    with mlflow.start_span(name="child") as child_span:
        child_span.set_inputs("dummy")
        child_span.add_event(SpanEvent(name="child_event", attributes={"attr1": "val1"}))
    mlflow.update_current_trace(tags={"foo": "bar"})
    return x + "!"


def _flush_async_logging():
    exporter = _get_trace_exporter()
    assert hasattr(exporter, "_async_queue"), "Async queue is not initialized"
    exporter._async_queue.flush(terminate=True)


# Set a test timeout of 20 seconds to catch excessive delays due to request retry loops,
# e.g. when checking the MLflow server version
@pytest.mark.timeout(20)
@pytest.mark.parametrize("is_async", [True, False], ids=["async", "sync"])
def test_export(is_async, monkeypatch):
    monkeypatch.setenv("DATABRICKS_HOST", "dummy-host")
    monkeypatch.setenv("DATABRICKS_TOKEN", "dummy-token")
    monkeypatch.setenv("MLFLOW_ENABLE_ASYNC_TRACE_LOGGING", str(is_async))

    mlflow.set_tracking_uri("databricks")
    mlflow.tracing.set_destination(MlflowExperimentLocation(experiment_id=_EXPERIMENT_ID))

    trace_info = None

    def mock_response(credentials, path, method, trace_json, *args, **kwargs):
        nonlocal trace_info
        trace_dict = json.loads(trace_json)
        trace_proto = ParseDict(trace_dict["trace"], pb.Trace())
        trace_info_proto = ParseDict(trace_dict["trace"]["trace_info"], pb.TraceInfoV3())
        trace_info = TraceInfo.from_proto(trace_info_proto)
        return pb.StartTraceV3.Response(trace=trace_proto)

    with (
        mock.patch(
            "mlflow.store.tracking.rest_store.call_endpoint", side_effect=mock_response
        ) as mock_call_endpoint,
        mock.patch(
            "mlflow.tracing.client.TracingClient._upload_trace_data", return_value=None
        ) as mock_upload_trace_data,
    ):
        _predict("hello")

        if is_async:
            _flush_async_logging()

    # Verify client methods were called correctly
    mock_call_endpoint.assert_called_once()
    mock_upload_trace_data.assert_called_once()

    # Access the trace that was passed to _start_trace
    endpoint = mock_call_endpoint.call_args.args[1]
    assert endpoint == "/api/3.0/mlflow/traces"
    trace_data = mock_upload_trace_data.call_args.args[1]

    # Basic validation of the trace object
    assert trace_info.trace_id is not None

    # Validate the size stats metadata
    # Using pop() to exclude the size of these fields when computing the expected size
    size_stats = json.loads(trace_info.trace_metadata.pop(TraceMetadataKey.SIZE_STATS))
    size_bytes = int(trace_info.trace_metadata.pop(TraceMetadataKey.SIZE_BYTES))

    # The total size of the trace should much with the size of the trace object
    expected_size_bytes = len(Trace(info=trace_info, data=trace_data).to_json().encode("utf-8"))

    assert size_bytes == expected_size_bytes
    assert size_stats[TraceSizeStatsKey.TOTAL_SIZE_BYTES] == expected_size_bytes
    assert size_stats[TraceSizeStatsKey.NUM_SPANS] == 2
    assert size_stats[TraceSizeStatsKey.MAX_SPAN_SIZE_BYTES] > 0

    # Verify percentile stats are included
    assert TraceSizeStatsKey.P25_SPAN_SIZE_BYTES in size_stats
    assert TraceSizeStatsKey.P50_SPAN_SIZE_BYTES in size_stats
    assert TraceSizeStatsKey.P75_SPAN_SIZE_BYTES in size_stats

    # Verify percentiles are valid integers
    assert isinstance(size_stats[TraceSizeStatsKey.P25_SPAN_SIZE_BYTES], int)
    assert isinstance(size_stats[TraceSizeStatsKey.P50_SPAN_SIZE_BYTES], int)
    assert isinstance(size_stats[TraceSizeStatsKey.P75_SPAN_SIZE_BYTES], int)

    # Verify percentile ordering: P25 <= P50 <= P75 <= max
    assert (
        size_stats[TraceSizeStatsKey.P25_SPAN_SIZE_BYTES]
        <= size_stats[TraceSizeStatsKey.P50_SPAN_SIZE_BYTES]
    )
    assert (
        size_stats[TraceSizeStatsKey.P50_SPAN_SIZE_BYTES]
        <= size_stats[TraceSizeStatsKey.P75_SPAN_SIZE_BYTES]
    )
    assert (
        size_stats[TraceSizeStatsKey.P75_SPAN_SIZE_BYTES]
        <= size_stats[TraceSizeStatsKey.MAX_SPAN_SIZE_BYTES]
    )

    # Validate the data was passed to upload_trace_data
    call_args = mock_upload_trace_data.call_args
    assert isinstance(call_args.args[0], TraceInfo)
    assert call_args.args[0].trace_id == trace_info.trace_id

    # We don't need to validate the exact JSON structure anymore since
    # we're testing the client methods directly, not the HTTP request

    # Last active trace ID should be set
    assert mlflow.get_last_active_trace_id() is not None


def test_async_logging_disabled_in_databricks_notebook(monkeypatch):
    with mock.patch("mlflow.tracing.export.mlflow_v3.is_in_databricks_notebook", return_value=True):
        exporter = MlflowV3SpanExporter()
        assert not exporter._is_async_enabled

        # If the env var is set explicitly, we should respect that
        monkeypatch.setenv("MLFLOW_ENABLE_ASYNC_TRACE_LOGGING", "True")
        exporter = MlflowV3SpanExporter()
        assert exporter._is_async_enabled


@pytest.mark.parametrize("is_async", [True, False], ids=["async", "sync"])
def test_export_catch_failure(is_async, monkeypatch):
    monkeypatch.setenv("DATABRICKS_HOST", "dummy-host")
    monkeypatch.setenv("DATABRICKS_TOKEN", "dummy-token")
    monkeypatch.setenv("MLFLOW_ENABLE_ASYNC_TRACE_LOGGING", str(is_async))

    mlflow.set_tracking_uri("databricks")
    mlflow.tracing.set_destination(MlflowExperimentLocation(experiment_id=_EXPERIMENT_ID))

    response = mock.MagicMock()
    response.status_code = 500
    response.text = "Failed to export trace"

    with (
        mock.patch(
            "mlflow.tracing.client.TracingClient.start_trace",
            side_effect=Exception("Failed to start trace"),
        ),
        mock.patch("mlflow.tracing.export.mlflow_v3._logger") as mock_logger,
    ):
        _predict("hello")

        if is_async:
            _flush_async_logging()

    mock_logger.warning.assert_called()
    warning_calls = [call[0][0] for call in mock_logger.warning.call_args_list]
    assert any("Failed to start trace" in msg for msg in warning_calls)


@pytest.mark.skipif(os.name == "nt", reason="Flaky on Windows")
def test_async_bulk_export(monkeypatch):
    monkeypatch.setenv("DATABRICKS_HOST", "dummy-host")
    monkeypatch.setenv("DATABRICKS_TOKEN", "dummy-token")
    monkeypatch.setenv("MLFLOW_ENABLE_ASYNC_TRACE_LOGGING", "True")
    monkeypatch.setenv("MLFLOW_ASYNC_TRACE_LOGGING_MAX_QUEUE_SIZE", "1000")

    mlflow.set_tracking_uri("databricks")
    mlflow.tracing.set_destination(MlflowExperimentLocation(experiment_id=0))

    # Create a mock function that simulates delay
    def _mock_client_method(*args, **kwargs):
        # Simulate a slow response
        time.sleep(0.1)
        mock_trace = mock.MagicMock()
        mock_trace.info = mock.MagicMock()
        return mock_trace

    with (
        mock.patch(
            "mlflow.tracing.client.TracingClient.start_trace", side_effect=_mock_client_method
        ) as mock_start_trace,
        mock.patch(
            "mlflow.tracing.client.TracingClient._upload_trace_data", return_value=None
        ) as mock_upload_trace_data,
    ):
        # Log many traces
        start_time = time.time()
        with ThreadPoolExecutor(max_workers=10) as executor:
            for _ in range(100):
                executor.submit(_predict, "hello")

        # Trace logging should not block the main thread
        assert time.time() - start_time < 5

        _flush_async_logging()

    # Verify the client methods were called the expected number of times
    assert mock_start_trace.call_count == 100
    assert mock_upload_trace_data.call_count == 100


@pytest.mark.parametrize("is_async", [True, False], ids=["async", "sync"])
def test_prompt_linking_in_mlflow_v3_exporter(is_async, monkeypatch):
    monkeypatch.setenv("DATABRICKS_HOST", "dummy-host")
    monkeypatch.setenv("DATABRICKS_TOKEN", "dummy-token")
    monkeypatch.setenv("MLFLOW_ENABLE_ASYNC_TRACE_LOGGING", str(is_async))

    mlflow.set_tracking_uri("databricks")
    mlflow.tracing.set_destination(MlflowExperimentLocation(experiment_id=_EXPERIMENT_ID))

    # Capture prompt linking calls
    captured_prompts = None
    captured_trace_id = None

    def mock_link_prompt_versions_to_trace(trace_id, prompts):
        nonlocal captured_prompts, captured_trace_id
        captured_prompts = prompts
        captured_trace_id = trace_id

    # Mock the prompt linking method and other client methods
    with (
        mock.patch(
            "mlflow.tracing.client.TracingClient.start_trace",
        ) as mock_start_trace,
        mock.patch(
            "mlflow.tracing.client.TracingClient._upload_trace_data", return_value=None
        ) as mock_upload_trace_data,
        mock.patch(
            "mlflow.tracing.client.TracingClient.link_prompt_versions_to_trace",
            side_effect=mock_link_prompt_versions_to_trace,
        ) as mock_link_prompts,
    ):
        # Create test prompt versions
        prompt1 = PromptVersion(
            name="test_prompt_1",
            version=1,
            template="Hello, {{name}}!",
            commit_message="Test prompt 1",
            creation_timestamp=123456789,
        )
        prompt2 = PromptVersion(
            name="test_prompt_2",
            version=2,
            template="Goodbye, {{name}}!",
            commit_message="Test prompt 2",
            creation_timestamp=123456790,
        )

        # Create a mock OTEL span and trace
        otel_span = create_mock_otel_span(
            name="root",
            trace_id=12345,
            span_id=1,
            parent_id=None,
        )
        trace_id = generate_trace_id_v3(otel_span)
        span = LiveSpan(otel_span, trace_id)

        # Register the trace and spans
        trace_manager = InMemoryTraceManager.get_instance()
        trace_info = create_test_trace_info(trace_id, _EXPERIMENT_ID)
        trace_manager.register_trace(otel_span.context.trace_id, trace_info)
        trace_manager.register_span(span)

        # Register prompts to the trace
        trace_manager.register_prompt(trace_id, prompt1)
        trace_manager.register_prompt(trace_id, prompt2)

        # Create and use the exporter
        exporter = MlflowV3SpanExporter()
        exporter.export([otel_span])

        if is_async:
            # For async tests, we need to flush the specific exporter's queue
            exporter._async_queue.flush(terminate=True)

        # Wait for any prompt linking threads to complete
        join_thread_by_name_prefix("link_prompts_from_exporter")

    # Verify that trace info contains the linked prompts tags
    tag_value = trace_info.tags.get(TraceTagKey.LINKED_PROMPTS)
    assert tag_value is not None
    tag_value = json.loads(tag_value)
    assert len(tag_value) == 2
    assert tag_value[0]["name"] == "test_prompt_1"
    assert tag_value[0]["version"] == "1"
    assert tag_value[1]["name"] == "test_prompt_2"
    assert tag_value[1]["version"] == "2"

    # Verify that prompt linking was called
    mock_link_prompts.assert_called_once()
    assert captured_prompts is not None, "Prompts were not passed to link method"
    assert len(captured_prompts) == 2, f"Expected 2 prompts, got {len(captured_prompts)}"

    # Verify prompt details
    prompt_names = {p.name for p in captured_prompts}
    assert prompt_names == {"test_prompt_1", "test_prompt_2"}

    # Verify the trace ID matches
    assert captured_trace_id == trace_id

    # Verify other client methods were also called
    mock_start_trace.assert_called_once()
    mock_upload_trace_data.assert_called_once()


@pytest.mark.parametrize("is_async", [True, False], ids=["async", "sync"])
def test_prompt_linking_with_empty_prompts_mlflow_v3(is_async, monkeypatch):
    monkeypatch.setenv("DATABRICKS_HOST", "dummy-host")
    monkeypatch.setenv("DATABRICKS_TOKEN", "dummy-token")
    monkeypatch.setenv("MLFLOW_ENABLE_ASYNC_TRACE_LOGGING", str(is_async))

    mlflow.set_tracking_uri("databricks")
    mlflow.tracing.set_destination(MlflowExperimentLocation(experiment_id=_EXPERIMENT_ID))

    # Capture prompt linking calls
    captured_prompts = None
    captured_trace_id = None

    def mock_link_prompt_versions_to_trace(trace_id, prompts):
        nonlocal captured_prompts, captured_trace_id
        captured_prompts = prompts
        captured_trace_id = trace_id

    # Mock the client methods
    with (
        mock.patch(
            "mlflow.tracing.client.TracingClient.start_trace",
            return_value=mock.MagicMock(trace_id="test-trace-id"),
        ) as mock_start_trace,
        mock.patch(
            "mlflow.tracing.client.TracingClient._upload_trace_data", return_value=None
        ) as mock_upload_trace_data,
        mock.patch(
            "mlflow.tracing.client.TracingClient.link_prompt_versions_to_trace",
            side_effect=mock_link_prompt_versions_to_trace,
        ) as mock_link_prompts,
    ):
        # Create a mock OTEL span and trace (no prompts added)
        otel_span = create_mock_otel_span(
            name="root",
            trace_id=12345,
            span_id=1,
            parent_id=None,
        )
        trace_id = generate_trace_id_v3(otel_span)
        span = LiveSpan(otel_span, trace_id)

        # Register the trace and spans (but no prompts)
        trace_manager = InMemoryTraceManager.get_instance()
        trace_info = create_test_trace_info(trace_id, _EXPERIMENT_ID)
        trace_manager.register_trace(otel_span.context.trace_id, trace_info)
        trace_manager.register_span(span)

        # Create and use the exporter
        exporter = MlflowV3SpanExporter()
        exporter.export([otel_span])

        if is_async:
            # For async tests, we need to flush the specific exporter's queue
            exporter._async_queue.flush(terminate=True)

        # Wait for any prompt linking threads to complete
        join_thread_by_name_prefix("link_prompts_from_exporter")

    # Verify that prompt linking was NOT called for empty prompts (this is correct behavior)
    mock_link_prompts.assert_not_called()
    # Since no prompts were passed, no thread was started and no call was made
    assert captured_trace_id is None  # No linking occurred, so trace_id was never captured

    # Verify other client methods were also called
    mock_start_trace.assert_called_once()
    mock_upload_trace_data.assert_called_once()


def test_prompt_linking_error_handling_mlflow_v3(monkeypatch):
    monkeypatch.setenv("DATABRICKS_HOST", "dummy-host")
    monkeypatch.setenv("DATABRICKS_TOKEN", "dummy-token")
    monkeypatch.setenv("MLFLOW_ENABLE_ASYNC_TRACE_LOGGING", "False")  # Use sync for easier testing

    mlflow.set_tracking_uri("databricks")
    mlflow.tracing.set_destination(MlflowExperimentLocation(experiment_id=_EXPERIMENT_ID))

    # Mock the client methods with prompt linking failing
    with (
        mock.patch(
            "mlflow.tracing.client.TracingClient.start_trace",
            return_value=mock.MagicMock(trace_id="test-trace-id"),
        ) as mock_start_trace,
        mock.patch(
            "mlflow.tracing.client.TracingClient._upload_trace_data", return_value=None
        ) as mock_upload_trace_data,
        mock.patch(
            "mlflow.tracing.client.TracingClient.link_prompt_versions_to_trace",
            side_effect=Exception("Prompt linking failed"),
        ) as mock_link_prompts,
        mock.patch("mlflow.tracing.export.utils._logger") as mock_logger,
    ):
        # Create a mock OTEL span and trace with a prompt
        otel_span = create_mock_otel_span(
            name="root",
            trace_id=12345,
            span_id=1,
            parent_id=None,
        )
        trace_id = generate_trace_id_v3(otel_span)
        span = LiveSpan(otel_span, trace_id)

        # Create a test prompt
        prompt = PromptVersion(
            name="test_prompt",
            version=1,
            template="Hello, {{name}}!",
            commit_message="Test prompt",
            creation_timestamp=123456789,
        )

        # Register the trace, span, and prompt
        trace_manager = InMemoryTraceManager.get_instance()
        trace_info = create_test_trace_info(trace_id, _EXPERIMENT_ID)
        trace_manager.register_trace(otel_span.context.trace_id, trace_info)
        trace_manager.register_span(span)
        trace_manager.register_prompt(trace_id, prompt)

        # Create and use the exporter
        exporter = MlflowV3SpanExporter()
        exporter.export([otel_span])

        # Wait for any prompt linking threads to complete so the error can be caught
        join_thread_by_name_prefix("link_prompts_from_exporter")

    # Verify that prompt linking was attempted but failed
    mock_link_prompts.assert_called_once()

    # Verify other client methods were still called
    # (trace export should succeed despite prompt linking failure)
    mock_start_trace.assert_called_once()
    mock_upload_trace_data.assert_called_once()

    # Verify that the error was logged but didn't crash the export
    mock_logger.warning.assert_called()
    warning_calls = [call[0][0] for call in mock_logger.warning.call_args_list]
    assert any("Prompt linking failed" in msg for msg in warning_calls)


def test_no_log_spans_to_artifacts_if_stored_in_tracking_store():
    # Create a mock OTEL span and trace
    otel_span = create_mock_otel_span(
        name="root",
        trace_id=12345,
        span_id=1,
        parent_id=None,
    )
    trace_id = generate_trace_id_v3(otel_span)
    span = LiveSpan(otel_span, trace_id)

    # Register the trace and spans
    trace_manager = InMemoryTraceManager.get_instance()
    trace_info = create_test_trace_info(trace_id, _EXPERIMENT_ID)
    trace_info.tags[TraceTagKey.SPANS_LOCATION] = SpansLocation.TRACKING_STORE.value
    trace_manager.register_trace(otel_span.context.trace_id, trace_info)
    trace_manager.register_span(span)

    with (
        mock.patch(
            "mlflow.tracing.client.TracingClient.start_trace",
            return_value=trace_info,
        ) as mock_start_trace,
        mock.patch(
            "mlflow.tracing.client.TracingClient._upload_trace_data", return_value=None
        ) as mock_upload_trace_data,
    ):
        exporter = MlflowV3SpanExporter()
        exporter.export([otel_span])
        mock_upload_trace_data.assert_not_called()
        mock_start_trace.assert_called_once()
```

--------------------------------------------------------------------------------

---[FILE: test_uc_table_exporter.py]---
Location: mlflow-master/tests/tracing/export/test_uc_table_exporter.py

```python
import time
from concurrent.futures import ThreadPoolExecutor
from unittest import mock

import pytest

from mlflow.entities.span import Span
from mlflow.tracing.export.uc_table import DatabricksUCTableSpanExporter
from mlflow.tracing.trace_manager import InMemoryTraceManager
from mlflow.tracing.utils import generate_trace_id_v4

from tests.tracing.helper import (
    create_mock_otel_span,
    create_test_trace_info_with_uc_table,
)


@pytest.mark.parametrize("is_async", [True, False], ids=["async", "sync"])
def test_export_spans_to_uc_table(is_async, monkeypatch):
    monkeypatch.setenv("MLFLOW_ENABLE_ASYNC_TRACE_LOGGING", str(is_async))
    monkeypatch.setenv("MLFLOW_ASYNC_TRACE_LOGGING_MAX_SPAN_BATCH_SIZE", "1")  # no batch
    trace_manager = InMemoryTraceManager.get_instance()

    mock_client = mock.MagicMock()
    exporter = DatabricksUCTableSpanExporter()
    exporter._client = mock_client

    otel_span = create_mock_otel_span(trace_id=12345, span_id=1)
    trace_id = generate_trace_id_v4(otel_span, "catalog.schema")
    span = Span(otel_span)

    # Create trace info with UC table
    trace_info = create_test_trace_info_with_uc_table(trace_id, "catalog", "schema")
    trace_manager.register_trace(otel_span.context.trace_id, trace_info)
    trace_manager.register_span(span)

    # Export the span
    with mock.patch(
        "mlflow.tracing.export.uc_table.get_active_spans_table_name",
        return_value="catalog.schema.spans",
    ):
        exporter.export([otel_span])

    if is_async:
        # For async tests, we need to flush the specific exporter's queue
        exporter._async_queue.flush(terminate=True)

    # Verify UC table logging was called
    mock_client.log_spans.assert_called_once()
    args = mock_client.log_spans.call_args
    assert args[0][0] == "catalog.schema.spans"
    assert len(args[0][1]) == 1
    assert isinstance(args[0][1][0], Span)
    assert args[0][1][0].to_dict() == span.to_dict()


def test_log_trace_no_upload_data_for_uc_schema():
    mock_client = mock.MagicMock()

    # Mock trace info with UC schema
    mock_trace_info = mock.MagicMock()
    mock_trace_info.trace_location.uc_schema = mock.MagicMock()
    mock_client.start_trace.return_value = mock_trace_info

    mock_trace = mock.MagicMock()
    mock_trace.info = mock.MagicMock()

    mock_prompts = []

    exporter = DatabricksUCTableSpanExporter()
    exporter._client = mock_client

    with mock.patch("mlflow.tracing.utils.add_size_stats_to_trace_metadata"):
        exporter._log_trace(mock_trace, mock_prompts)

        # Verify start_trace was called but _upload_trace_data was not
        mock_client.start_trace.assert_called_once_with(mock_trace.info)
        mock_client._upload_trace_data.assert_not_called()


def test_log_trace_no_log_spans_if_no_uc_schema():
    mock_client = mock.MagicMock()

    # Mock trace info without UC schema
    mock_trace_info = mock.MagicMock()
    mock_trace_info.trace_location.uc_schema = None
    mock_client.start_trace.return_value = mock_trace_info

    mock_trace = mock.MagicMock()
    mock_trace.info = mock.MagicMock()
    mock_trace.data = mock.MagicMock()

    mock_prompts = []

    exporter = DatabricksUCTableSpanExporter()
    exporter._client = mock_client

    with mock.patch("mlflow.tracing.utils.add_size_stats_to_trace_metadata"):
        exporter._log_trace(mock_trace, mock_prompts)

        # Verify both start_trace and _upload_trace_data were called
        mock_client.start_trace.assert_called_once_with(mock_trace.info)
        mock_client.log_spans.assert_not_called()


def test_export_spans_batch_max_size(monkeypatch):
    monkeypatch.setenv("MLFLOW_ASYNC_TRACE_LOGGING_MAX_SPAN_BATCH_SIZE", "5")
    monkeypatch.setenv("MLFLOW_ASYNC_TRACE_LOGGING_MAX_INTERVAL_MILLIS", "10000")

    exporter = DatabricksUCTableSpanExporter()
    exporter._client = mock.MagicMock()
    with mock.patch(
        "mlflow.tracing.export.uc_table.get_active_spans_table_name",
        return_value="catalog.schema.spans",
    ):
        exporter._export_spans_incrementally(
            [
                create_mock_otel_span(trace_id=12345, span_id=1),
                create_mock_otel_span(trace_id=12345, span_id=2),
                create_mock_otel_span(trace_id=12345, span_id=3),
                create_mock_otel_span(trace_id=12345, span_id=4),
            ]
        )
        exporter._client.log_spans.assert_not_called()

        exporter._export_spans_incrementally([create_mock_otel_span(trace_id=12345, span_id=5)])
        # NB: There can be a tiny delay once the batch becomes full and the worker thread
        # is interrupted by the threading event and activate the async queue. Flush has to
        # happen after the activation.
        time.sleep(1)
        exporter._async_queue.flush()
        exporter._client.log_spans.assert_called_once()
        location, spans = exporter._client.log_spans.call_args[0]
        assert location == "catalog.schema.spans"
        assert len(spans) == 5
        assert all(isinstance(span, Span) for span in spans)


def test_export_spans_batch_flush_on_interval(monkeypatch):
    monkeypatch.setenv("MLFLOW_ASYNC_TRACE_LOGGING_MAX_SPAN_BATCH_SIZE", "10")
    monkeypatch.setenv("MLFLOW_ASYNC_TRACE_LOGGING_MAX_INTERVAL_MILLIS", "1000")

    exporter = DatabricksUCTableSpanExporter()
    exporter._client = mock.MagicMock()

    otel_span = create_mock_otel_span(trace_id=12345, span_id=1)

    with mock.patch(
        "mlflow.tracing.export.uc_table.get_active_spans_table_name",
        return_value="catalog.schema.spans",
    ):
        exporter._export_spans_incrementally([otel_span])

    # Allow the batcher's interval timer to fire
    time.sleep(1.5)

    exporter._client.log_spans.assert_called_once()
    location, spans = exporter._client.log_spans.call_args[0]
    assert location == "catalog.schema.spans"
    assert len(spans) == 1


def test_export_spans_batch_shutdown():
    exporter = DatabricksUCTableSpanExporter()
    exporter._client = mock.MagicMock()

    with mock.patch(
        "mlflow.tracing.export.uc_table.get_active_spans_table_name",
        return_value="catalog.schema.spans",
    ):
        exporter._export_spans_incrementally(
            [
                create_mock_otel_span(trace_id=12345, span_id=1),
                create_mock_otel_span(trace_id=12345, span_id=2),
                create_mock_otel_span(trace_id=12345, span_id=3),
            ]
        )

    exporter.flush()
    exporter._client.log_spans.assert_called_once()
    location, spans = exporter._client.log_spans.call_args[0]
    assert location == "catalog.schema.spans"
    assert len(spans) == 3


def test_export_spans_batch_thread_safety():
    exporter = DatabricksUCTableSpanExporter()
    exporter._client = mock.MagicMock()

    def _generate_spans():
        exporter._export_spans_incrementally(
            [create_mock_otel_span(trace_id=12345, span_id=i) for i in range(5)]
        )

    with mock.patch(
        "mlflow.tracing.export.uc_table.get_active_spans_table_name",
        return_value="catalog.schema.spans",
    ):
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(_generate_spans) for _ in range(5)]
            for future in futures:
                future.result()

        exporter.flush()

        assert exporter._client.log_spans.call_count == 3
        for i in range(3):
            location, spans = exporter._client.log_spans.call_args_list[i][0]
            assert location == "catalog.schema.spans"
            assert len(spans) == 10 if i < 2 else 5, f"Batch {i} had {len(spans)} spans"


def test_export_spans_batch_split_spans_by_location():
    exporter = DatabricksUCTableSpanExporter()
    exporter._client = mock.MagicMock()

    with mock.patch(
        "mlflow.tracing.export.uc_table.get_active_spans_table_name",
        return_value="catalog.schema.table_1",
    ):
        exporter._export_spans_incrementally(
            [
                create_mock_otel_span(trace_id=12345, span_id=1),
                create_mock_otel_span(trace_id=12345, span_id=2),
            ]
        )

    with mock.patch(
        "mlflow.tracing.export.uc_table.get_active_spans_table_name",
        return_value="catalog.schema.table_2",
    ):
        exporter._export_spans_incrementally(
            [
                create_mock_otel_span(trace_id=12345, span_id=3),
                create_mock_otel_span(trace_id=12345, span_id=4),
                create_mock_otel_span(trace_id=12345, span_id=5),
            ]
        )

    exporter.flush()

    assert exporter._client.log_spans.call_count == 2
    location, spans = exporter._client.log_spans.call_args_list[0][0]
    assert location == "catalog.schema.table_1"
    assert len(spans) == 2
    location, spans = exporter._client.log_spans.call_args_list[1][0]
    assert location == "catalog.schema.table_2"
    assert len(spans) == 3


def test_at_exit_callback_registered_in_correct_order():
    # This test validates that the two atexit callbacks are registered in the correct order.
    # AsyncTraceExportQueue must be shut down AFTER SpanBatcher. Since atexit executes callbacks in
    # last-in-first-out order, we must register the callback for AsyncTraceExportQueue first.
    # https://docs.python.org/3/library/atexit.html#atexit.register
    with mock.patch("atexit.register") as mock_atexit:
        DatabricksUCTableSpanExporter()

    assert mock_atexit.call_count == 2
    handlers = [call[0][0] for call in mock_atexit.call_args_list]
    assert len(handlers) == 2
    assert handlers[0].__self__.__class__.__name__ == "AsyncTraceExportQueue"
    assert handlers[1].__self__.__class__.__name__ == "SpanBatcher"
```

--------------------------------------------------------------------------------

---[FILE: test_integration.py]---
Location: mlflow-master/tests/tracing/opentelemetry/test_integration.py

```python
import pytest
from opentelemetry import trace as otel_trace

import mlflow
from mlflow.entities.span import SpanStatusCode, encode_span_id
from mlflow.entities.trace_location import MlflowExperimentLocation
from mlflow.entities.trace_state import TraceState
from mlflow.environment_variables import MLFLOW_USE_DEFAULT_TRACER_PROVIDER
from mlflow.utils.os import is_windows

from tests.tracing.helper import get_traces


@pytest.mark.skipif(is_windows(), reason="Skipping as this is flaky on Windows")
def test_mlflow_and_opentelemetry_unified_tracing_with_otel_root_span(monkeypatch):
    monkeypatch.setenv(MLFLOW_USE_DEFAULT_TRACER_PROVIDER.name, "false")

    # Use set_destination to trigger tracer provider initialization
    experiment_id = mlflow.set_experiment("test_experiment").experiment_id
    mlflow.tracing.set_destination(MlflowExperimentLocation(experiment_id))

    otel_tracer = otel_trace.get_tracer(__name__)
    with otel_tracer.start_as_current_span("parent_span") as root_span:
        root_span.set_attribute("key1", "value1")
        root_span.add_event("event1", attributes={"key2": "value2"})

        # Active span id should be set
        assert mlflow.get_current_active_span().span_id == encode_span_id(root_span.context.span_id)

        with mlflow.start_span("mlflow_span") as mlflow_span:
            mlflow_span.set_inputs({"text": "hello"})
            mlflow_span.set_attributes({"key3": "value3"})

            with otel_tracer.start_as_current_span("child_span") as child_span:
                child_span.set_attribute("key4", "value4")
                child_span.set_status(otel_trace.Status(otel_trace.StatusCode.OK))

            mlflow_span.set_outputs({"text": "world"})

    traces = get_traces()
    assert len(traces) == 1
    trace = traces[0]
    assert trace.info.trace_id.startswith("tr-")  # trace ID should be in MLflow format
    assert trace.info.trace_id == mlflow.get_last_active_trace_id()
    assert trace.info.experiment_id == experiment_id
    assert trace.info.status == TraceState.OK
    assert trace.info.request_time == root_span.start_time // 1_000_000
    assert trace.info.execution_duration == (root_span.end_time - root_span.start_time) // 1_000_000
    assert trace.info.request_preview == ""
    assert trace.info.response_preview == ""

    spans = trace.data.spans
    assert len(spans) == 3
    assert spans[0].name == "parent_span"
    assert spans[0].attributes["key1"] == "value1"
    assert len(spans[0].events) == 1
    assert spans[0].events[0].name == "event1"
    assert spans[0].events[0].attributes["key2"] == "value2"
    assert spans[0].parent_id is None
    assert spans[0].status.status_code == SpanStatusCode.UNSET
    assert spans[1].name == "mlflow_span"
    assert spans[1].attributes["key3"] == "value3"
    assert spans[1].events == []
    assert spans[1].parent_id == spans[0].span_id
    assert spans[1].status.status_code == SpanStatusCode.OK
    assert spans[2].name == "child_span"
    assert spans[2].attributes["key4"] == "value4"
    assert spans[2].events == []
    assert spans[2].parent_id == spans[1].span_id
    assert spans[2].status.status_code == SpanStatusCode.OK


@pytest.mark.skipif(is_windows(), reason="Skipping as this is flaky on Windows")
def test_mlflow_and_opentelemetry_unified_tracing_with_mlflow_root_span(monkeypatch):
    monkeypatch.setenv(MLFLOW_USE_DEFAULT_TRACER_PROVIDER.name, "false")

    experiment_id = mlflow.set_experiment("test_experiment").experiment_id

    otel_tracer = otel_trace.get_tracer(__name__)
    with mlflow.start_span("mlflow_span") as mlflow_span:
        mlflow_span.set_inputs({"text": "hello"})

        with otel_tracer.start_as_current_span("otel_span") as otel_span:
            otel_span.set_attributes({"key3": "value3"})
            otel_span.set_status(otel_trace.Status(otel_trace.StatusCode.OK))

            with mlflow.start_span("child_span") as child_span:
                child_span.set_attribute("key4", "value4")

        mlflow_span.set_outputs({"text": "world"})

    traces = get_traces()
    assert len(traces) == 1
    trace = traces[0]
    assert trace.info.trace_id.startswith("tr-")  # trace ID should be in MLflow format
    assert trace.info.trace_id == mlflow.get_last_active_trace_id()
    assert trace.info.experiment_id == experiment_id
    assert trace.info.status == TraceState.OK
    assert trace.info.request_time == mlflow_span.start_time_ns // 1_000_000
    assert (
        trace.info.execution_duration
        == (mlflow_span.end_time_ns - mlflow_span.start_time_ns) // 1_000_000
    )
    assert trace.info.request_preview == '{"text": "hello"}'
    assert trace.info.response_preview == '{"text": "world"}'

    spans = trace.data.spans
    assert len(spans) == 3
    assert spans[0].name == "mlflow_span"
    assert spans[0].inputs == {"text": "hello"}
    assert spans[0].outputs == {"text": "world"}
    assert spans[0].status.status_code == SpanStatusCode.OK
    assert spans[1].name == "otel_span"
    assert spans[1].attributes["key3"] == "value3"
    assert spans[1].events == []
    assert spans[1].parent_id == spans[0].span_id
    assert spans[1].status.status_code == SpanStatusCode.OK
    assert spans[2].name == "child_span"
    assert spans[2].attributes["key4"] == "value4"
    assert spans[2].events == []
    assert spans[2].parent_id == spans[1].span_id
    assert spans[2].status.status_code == SpanStatusCode.OK


def test_mlflow_and_opentelemetry_isolated_tracing(monkeypatch):
    monkeypatch.setenv(MLFLOW_USE_DEFAULT_TRACER_PROVIDER.name, "true")

    experiment_id = mlflow.set_experiment("test_experiment").experiment_id

    otel_tracer = otel_trace.get_tracer(__name__)

    with otel_tracer.start_as_current_span("parent_span") as root_span:
        root_span.set_attribute("key1", "value1")

    with mlflow.start_span("mlflow_span") as mlflow_span:
        mlflow_span.set_inputs({"text": "hello"})
        mlflow_span.set_outputs({"text": "world"})

    traces = get_traces()
    assert len(traces) == 1
    trace = traces[0]
    assert trace is not None
    assert trace.info.experiment_id == experiment_id
    assert trace.info.trace_id.startswith("tr-")  # trace ID should be in MLflow format
    assert trace.info.status == TraceState.OK
    assert trace.info.request_time == mlflow_span.start_time_ns // 1_000_000
    assert (
        trace.info.execution_duration
        == (mlflow_span.end_time_ns - mlflow_span.start_time_ns) // 1_000_000
    )
    assert trace.info.request_preview == '{"text": "hello"}'
    assert trace.info.response_preview == '{"text": "world"}'

    spans = trace.data.spans
    assert len(spans) == 1
    assert spans[0].name == "mlflow_span"
    assert spans[0].inputs == {"text": "hello"}
    assert spans[0].outputs == {"text": "world"}
    assert spans[0].status.status_code == SpanStatusCode.OK
```

--------------------------------------------------------------------------------

````
