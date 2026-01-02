---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 958
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 958 of 991)

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

---[FILE: test_mlflow_v3_processor.py]---
Location: mlflow-master/tests/tracing/processor/test_mlflow_v3_processor.py

```python
import json
from unittest import mock

import mlflow.tracking.context.default_context
from mlflow.entities.span import LiveSpan
from mlflow.entities.trace_status import TraceStatus
from mlflow.environment_variables import MLFLOW_TRACKING_USERNAME
from mlflow.tracing.constant import (
    SpanAttributeKey,
    TraceMetadataKey,
)
from mlflow.tracing.processor.mlflow_v3 import MlflowV3SpanProcessor
from mlflow.tracing.trace_manager import InMemoryTraceManager
from mlflow.tracing.utils import encode_trace_id

from tests.tracing.helper import (
    create_mock_otel_span,
    create_test_trace_info,
    skip_when_testing_trace_sdk,
)


def test_on_start(monkeypatch):
    monkeypatch.setattr(mlflow.tracking.context.default_context, "_get_source_name", lambda: "test")
    monkeypatch.setenv(MLFLOW_TRACKING_USERNAME.name, "bob")

    # Root span should create a new trace on start
    trace_id = 12345
    span = create_mock_otel_span(trace_id=trace_id, span_id=1, parent_id=None, start_time=5_000_000)

    processor = MlflowV3SpanProcessor(span_exporter=mock.MagicMock(), export_metrics=False)
    processor.on_start(span)

    # V3 processor uses encoded Otel trace_id as request_id
    request_id = "tr-" + encode_trace_id(trace_id)
    assert len(request_id) == 35  # 3 for "tr-" prefix + 32 for encoded trace_id
    assert span.attributes.get(SpanAttributeKey.REQUEST_ID) == json.dumps(request_id)
    assert request_id in InMemoryTraceManager.get_instance()._traces

    # Child span should not create a new trace
    child_span = create_mock_otel_span(
        trace_id=trace_id, span_id=2, parent_id=1, start_time=8_000_000
    )
    processor.on_start(child_span)
    assert child_span.attributes.get(SpanAttributeKey.REQUEST_ID) == json.dumps(request_id)


@skip_when_testing_trace_sdk
def test_on_start_during_model_evaluation():
    from mlflow.pyfunc.context import Context, set_prediction_context

    trace_id = 12345
    request_id = "tr-" + encode_trace_id(trace_id)

    # Root span should create a new trace on start
    span = create_mock_otel_span(trace_id=trace_id, span_id=1)
    processor = MlflowV3SpanProcessor(span_exporter=mock.MagicMock(), export_metrics=False)

    with set_prediction_context(Context(request_id=request_id, is_evaluate=True)):
        processor.on_start(span)

    assert span.attributes.get(SpanAttributeKey.REQUEST_ID) == json.dumps(request_id)


@skip_when_testing_trace_sdk
def test_on_start_during_run(monkeypatch):
    monkeypatch.setattr(mlflow.tracking.context.default_context, "_get_source_name", lambda: "test")
    monkeypatch.setenv(MLFLOW_TRACKING_USERNAME.name, "bob")

    span = create_mock_otel_span(trace_id=12345, span_id=1, parent_id=None, start_time=5_000_000)

    env_experiment_name = "env_experiment_id"
    run_experiment_name = "run_experiment_id"

    mlflow.create_experiment(env_experiment_name)
    run_experiment_id = mlflow.create_experiment(run_experiment_name)

    mlflow.set_experiment(experiment_name=env_experiment_name)
    processor = MlflowV3SpanProcessor(span_exporter=mock.MagicMock(), export_metrics=False)

    with mlflow.start_run(experiment_id=run_experiment_id) as run:
        processor.on_start(span)

        trace_id = "tr-" + encode_trace_id(span.context.trace_id)
        trace = InMemoryTraceManager.get_instance()._traces[trace_id]
        assert trace.info.experiment_id == run_experiment_id
        assert trace.info.request_metadata[TraceMetadataKey.SOURCE_RUN] == run.info.run_id


def test_incremental_span_name_no_deduplication():
    InMemoryTraceManager.reset()
    trace_manager = InMemoryTraceManager.get_instance()

    trace_id = 12345
    request_id = "tr-" + encode_trace_id(trace_id)
    processor = MlflowV3SpanProcessor(span_exporter=mock.MagicMock(), export_metrics=False)

    # Helper to create and register a span
    def create_and_register(name, span_id, parent_id=1):
        span = create_mock_otel_span(
            name=name,
            trace_id=trace_id,
            span_id=span_id,
            parent_id=parent_id,
            start_time=span_id * 1_000_000,
            end_time=(span_id + 1) * 1_000_000,
        )
        processor.on_start(span)
        live_span = LiveSpan(span, request_id)
        trace_manager.register_span(live_span)
        processor.on_end(span)
        return span

    # Create root and 4 child spans: 3 "process" and 2 "query"
    create_and_register("process", 1, parent_id=None)
    create_and_register("process", 2)
    create_and_register("query", 3)
    create_and_register("process", 4)
    create_and_register("query", 5)

    with trace_manager.get_trace(request_id) as trace:
        names = [s.name for s in trace.span_dict.values() if s.name == "process"]
        assert len(names) == 3

    with trace_manager.get_trace(request_id) as trace:
        names = [s.name for s in trace.span_dict.values() if s.name == "query"]
        assert len(names) == 2

    with trace_manager.get_trace(request_id) as trace:
        spans_sorted_by_creation = sorted(trace.span_dict.values(), key=lambda s: s.start_time_ns)
        final_names = [s.name for s in spans_sorted_by_creation]
        assert final_names == ["process", "process", "query", "process", "query"]


def test_on_end():
    trace_info = create_test_trace_info("request_id", 0)
    trace_manager = InMemoryTraceManager.get_instance()
    trace_manager.register_trace("trace_id", trace_info)

    otel_span = create_mock_otel_span(
        name="foo",
        trace_id="trace_id",
        span_id=1,
        parent_id=None,
        start_time=5_000_000,
        end_time=9_000_000,
    )
    span = LiveSpan(otel_span, "request_id")
    span.set_status("OK")
    span.set_inputs({"input1": "very long input" * 100})
    span.set_outputs({"output": "very long output" * 100})

    mock_exporter = mock.MagicMock()
    mock_client = mock.MagicMock()
    mock_client._start_tracked_trace.side_effect = Exception("error")
    processor = MlflowV3SpanProcessor(span_exporter=mock_exporter, export_metrics=False)

    processor.on_end(otel_span)

    mock_exporter.export.assert_called_once_with((otel_span,))

    # Child spans should be exported
    mock_exporter.reset_mock()
    child_span = create_mock_otel_span(trace_id="trace_id", span_id=2, parent_id=1)
    # Set the REQUEST_ID attribute so the processor can find the trace
    child_span.set_attribute(SpanAttributeKey.REQUEST_ID, json.dumps("request_id"))
    processor.on_end(child_span)
    mock_exporter.export.assert_called_once_with((child_span,))

    # Trace info should be updated according to the span attributes
    manager_trace = trace_manager.pop_trace("trace_id")
    trace_info = manager_trace.trace.info
    assert trace_info.status == TraceStatus.OK
    assert trace_info.execution_time_ms == 4
    assert trace_info.tags == {}
```

--------------------------------------------------------------------------------

---[FILE: test_otel_metrics.py]---
Location: mlflow-master/tests/tracing/processor/test_otel_metrics.py

```python
import time

import pytest
from opentelemetry import metrics
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import InMemoryMetricReader

import mlflow


@pytest.fixture
def metric_reader() -> InMemoryMetricReader:
    """Create an in-memory metric reader for testing."""
    reader = InMemoryMetricReader()
    provider = MeterProvider(metric_readers=[reader])
    metrics.set_meter_provider(provider)
    yield reader
    provider.shutdown()


def test_metrics_export(
    monkeypatch: pytest.MonkeyPatch, metric_reader: InMemoryMetricReader
) -> None:
    monkeypatch.setenv("OTEL_EXPORTER_OTLP_METRICS_ENDPOINT", "http://localhost:9090")
    mlflow.set_experiment("test_experiment")

    @mlflow.trace(span_type="CHAIN", name="parent")
    def parent_function() -> str:
        mlflow.update_current_trace({"env": "test", "version": "1.0"})
        time.sleep(0.01)  # 10ms
        return child_function()

    @mlflow.trace(span_type="LLM", name="child")
    def child_function() -> str:
        time.sleep(0.25)  # 250ms
        return "result"

    @mlflow.trace(span_type="TOOL", name="error_function")
    def error_function() -> None:
        time.sleep(1.0)  # 1000ms
        raise ValueError("Test error")

    # Execute successful trace
    parent_function()
    # Execute error trace
    with pytest.raises(ValueError, match="Test error"):
        error_function()

    metrics_data = metric_reader.get_metrics_data()
    assert metrics_data is not None

    data_points = []
    for resource_metric in metrics_data.resource_metrics:
        for scope_metric in resource_metric.scope_metrics:
            for metric in scope_metric.metrics:
                if metric.name == "mlflow.trace.span.duration":
                    assert metric.unit == "ms"
                    data_points.extend(metric.data.data_points)

    assert len(data_points) == 3
    data_points.sort(key=lambda dp: dp.sum)
    llm_metric, chain_metric, tool_metric = data_points

    # LLM span (child) - 250ms
    llm_metric_attrs = dict(llm_metric.attributes)
    assert llm_metric_attrs["span_type"] == "LLM"
    assert llm_metric_attrs["span_status"] == "OK"
    assert llm_metric_attrs["root"] is False
    assert llm_metric.sum >= 250

    # CHAIN span (parent) - includes child time, so ~260ms total
    chain_metric_attrs = dict(chain_metric.attributes)
    assert chain_metric_attrs["span_type"] == "CHAIN"
    assert chain_metric_attrs["span_status"] == "OK"
    assert chain_metric_attrs["root"] is True
    assert chain_metric_attrs["tags.env"] == "test"
    assert chain_metric_attrs["tags.version"] == "1.0"
    assert chain_metric.sum >= 260

    # TOOL span (error) - 1000ms
    tool_metric_attrs = dict(tool_metric.attributes)
    assert tool_metric_attrs["span_type"] == "TOOL"
    assert tool_metric_attrs["span_status"] == "ERROR"
    assert tool_metric_attrs["root"] is True
    assert tool_metric.sum >= 1000


def test_no_metrics_when_disabled(
    monkeypatch: pytest.MonkeyPatch, metric_reader: InMemoryMetricReader
) -> None:
    monkeypatch.delenv("OTEL_EXPORTER_OTLP_METRICS_ENDPOINT", raising=False)

    @mlflow.trace(name="test")
    def test_function() -> str:
        return "result"

    test_function()

    metrics_data = metric_reader.get_metrics_data()

    metric_names = []
    if metrics_data:
        for resource_metric in metrics_data.resource_metrics:
            for scope_metric in resource_metric.scope_metrics:
                metric_names.extend(metric.name for metric in scope_metric.metrics)

    assert "mlflow.trace.span.duration" not in metric_names
```

--------------------------------------------------------------------------------

---[FILE: test_uc_table_processor.py]---
Location: mlflow-master/tests/tracing/processor/test_uc_table_processor.py

```python
from unittest import mock

import pytest

import mlflow.tracking.context.default_context
from mlflow.entities.span import LiveSpan
from mlflow.entities.trace_location import TraceLocationType
from mlflow.entities.trace_state import TraceState
from mlflow.environment_variables import MLFLOW_TRACKING_USERNAME
from mlflow.exceptions import MlflowException
from mlflow.tracing.processor.uc_table import DatabricksUCTableSpanProcessor
from mlflow.tracing.trace_manager import InMemoryTraceManager

from tests.tracing.helper import (
    create_mock_otel_span,
    create_test_trace_info,
)


def test_on_start_with_uc_table_name(monkeypatch):
    monkeypatch.setattr(mlflow.tracking.context.default_context, "_get_source_name", lambda: "test")
    monkeypatch.setenv(MLFLOW_TRACKING_USERNAME.name, "alice")

    # Root span should create a new trace on start
    trace_id = 12345
    span = create_mock_otel_span(trace_id=trace_id, span_id=1, parent_id=None, start_time=5_000_000)

    # Mock get_active_spans_table_name to return a UC table name
    with mock.patch(
        "mlflow.tracing.processor.uc_table.get_active_spans_table_name",
        return_value="catalog1.schema1.spans_table",
    ):
        processor = DatabricksUCTableSpanProcessor(span_exporter=mock.MagicMock())
        processor.on_start(span)

    # Check that trace was created in trace manager
    trace_manager = InMemoryTraceManager.get_instance()
    traces = trace_manager._traces
    assert len(traces) == 1

    # Get the created trace
    created_trace = list(traces.values())[0]
    trace_info = created_trace.info

    # Verify trace location is UC_SCHEMA type
    assert trace_info.trace_location.type == TraceLocationType.UC_SCHEMA
    uc_schema = trace_info.trace_location.uc_schema
    assert uc_schema.catalog_name == "catalog1"
    assert uc_schema.schema_name == "schema1"

    # Verify trace state and timing
    assert trace_info.state == TraceState.IN_PROGRESS
    assert trace_info.request_time == 5  # 5_000_000 nanoseconds -> 5 milliseconds
    assert trace_info.execution_duration is None


def test_on_start_without_uc_table_name(monkeypatch):
    monkeypatch.setattr(mlflow.tracking.context.default_context, "_get_source_name", lambda: "test")
    monkeypatch.setenv(MLFLOW_TRACKING_USERNAME.name, "alice")

    # Root span should create a new trace on start
    trace_id = 12345
    span = create_mock_otel_span(trace_id=trace_id, span_id=1, parent_id=None, start_time=5_000_000)

    # Mock get_active_spans_table_name to return None
    with mock.patch(
        "mlflow.tracing.processor.uc_table.get_active_spans_table_name", return_value=None
    ):
        processor = DatabricksUCTableSpanProcessor(span_exporter=mock.MagicMock())
        with pytest.raises(MlflowException, match="Unity Catalog spans table name is not set"):
            processor.on_start(span)

    # Check that trace was still created in trace manager
    trace_manager = InMemoryTraceManager.get_instance()
    traces = trace_manager._traces
    assert len(traces) == 0


def test_constructor_disables_metrics_export():
    mock_exporter = mock.MagicMock()
    processor = DatabricksUCTableSpanProcessor(span_exporter=mock_exporter)

    # The export_metrics should be False
    assert not processor._export_metrics


def test_trace_id_generation_with_uc_schema():
    trace_id = 12345
    span = create_mock_otel_span(trace_id=trace_id, span_id=1, parent_id=None, start_time=5_000_000)

    with (
        mock.patch(
            "mlflow.tracing.processor.uc_table.get_active_spans_table_name",
            return_value="catalog1.schema1.spans_table",
        ),
        mock.patch(
            "mlflow.tracing.processor.uc_table.generate_trace_id_v4",
            return_value="trace:/catalog1.schema1/12345",
        ) as mock_generate_trace_id,
    ):
        processor = DatabricksUCTableSpanProcessor(span_exporter=mock.MagicMock())
        processor.on_start(span)

        # Verify generate_trace_id_v4 was called with correct arguments
        mock_generate_trace_id.assert_called_once_with(span, "catalog1.schema1")


def test_on_end():
    trace_info = create_test_trace_info("request_id", 0)
    trace_manager = InMemoryTraceManager.get_instance()
    trace_manager.register_trace("trace_id", trace_info)

    otel_span = create_mock_otel_span(
        name="foo",
        trace_id="trace_id",
        span_id=1,
        parent_id=None,
        start_time=5_000_000,
        end_time=9_000_000,
    )
    span = LiveSpan(otel_span, "request_id")
    span.set_status("OK")
    span.set_inputs({"input1": "test input"})
    span.set_outputs({"output": "test output"})

    mock_exporter = mock.MagicMock()
    processor = DatabricksUCTableSpanProcessor(span_exporter=mock_exporter)

    processor.on_end(otel_span)

    # Verify span was exported
    mock_exporter.export.assert_called_once_with((otel_span,))


def test_trace_metadata_and_tags():
    trace_id = 12345
    span = create_mock_otel_span(trace_id=trace_id, span_id=1, parent_id=None, start_time=5_000_000)

    with mock.patch(
        "mlflow.tracing.processor.uc_table.get_active_spans_table_name",
        return_value="catalog1.schema1.spans_table",
    ):
        processor = DatabricksUCTableSpanProcessor(span_exporter=mock.MagicMock())
        processor.on_start(span)

    # Get the created trace
    trace_manager = InMemoryTraceManager.get_instance()
    traces = trace_manager._traces
    created_trace = list(traces.values())[0]
    trace_info = created_trace.info

    # Check that metadata and tags are present
    assert trace_info.trace_metadata is not None
    assert trace_info.tags is not None
```

--------------------------------------------------------------------------------

---[FILE: model_with_add_trace.py]---
Location: mlflow-master/tests/tracing/sample_code/model_with_add_trace.py

```python
import mlflow

_SAMPLE_TRACE = {
    "info": {
        "request_id": "2e72d64369624e6888324462b62dc120",
        "experiment_id": "0",
        "timestamp_ms": 1726145090860,
        "execution_time_ms": 162,
        "status": "OK",
        "request_metadata": {
            "mlflow.trace_schema.version": "2",
            "mlflow.traceInputs": '{"x": 1}',
            "mlflow.traceOutputs": '{"prediction": 1}',
        },
        "tags": {
            "fruit": "apple",
            "food": "pizza",
        },
    },
    "data": {
        "spans": [
            {
                "name": "remote",
                "context": {
                    "span_id": "0x337af925d6629c01",
                    "trace_id": "0x05e82d1fc4486f3986fae6dd7b5352b1",
                },
                "parent_id": None,
                "start_time": 1726145091022155863,
                "end_time": 1726145091022572053,
                "status_code": "OK",
                "status_message": "",
                "attributes": {
                    "mlflow.traceRequestId": '"2e72d64369624e6888324462b62dc120"',
                    "mlflow.spanType": '"UNKNOWN"',
                    "mlflow.spanInputs": '{"x": 1}',
                    "mlflow.spanOutputs": '{"prediction": 1}',
                },
                "events": [
                    {"name": "event", "timestamp": 1726145091022287, "attributes": {"foo": "bar"}}
                ],
            },
        ],
        "request": '{"x": 1}',
        "response": '{"prediction": 1}',
    },
}


class Model(mlflow.pyfunc.PythonModel):
    def predict(self, context, model_input):
        mlflow.add_trace(_SAMPLE_TRACE)
        return 1


mlflow.models.set_model(Model())
```

--------------------------------------------------------------------------------

---[FILE: test_config.py]---
Location: mlflow-master/tests/tracing/utils/test_config.py

```python
import pytest

import mlflow
from mlflow.tracing.config import TracingConfig, get_config


@pytest.fixture(autouse=True)
def reset_tracing_config():
    mlflow.tracing.reset()


def test_tracing_config_default_values():
    config = TracingConfig()
    assert config.span_processors == []


def test_configure():
    # Default config
    assert get_config().span_processors == []

    def dummy_filter(span):
        pass

    mlflow.tracing.configure(span_processors=[dummy_filter])
    assert get_config().span_processors == [dummy_filter]

    mlflow.tracing.configure(span_processors=[])
    assert get_config().span_processors == []


def test_configure_empty_call():
    def dummy_filter(span):
        pass

    mlflow.tracing.configure(span_processors=[dummy_filter])
    assert get_config().span_processors == [dummy_filter]

    # No-op
    mlflow.tracing.configure()
    assert get_config().span_processors == [dummy_filter]


def test_reset_config():
    def filter1(span):
        pass

    assert get_config().span_processors == []

    mlflow.tracing.configure(span_processors=[filter1])
    assert get_config().span_processors == [filter1]

    mlflow.tracing.reset()
    assert get_config().span_processors == []


def test_configure_context_manager():
    def filter1(span):
        return

    def filter2(span):
        return

    # Set initial config
    mlflow.tracing.configure(span_processors=[filter1])

    assert get_config().span_processors == [filter1]

    with mlflow.tracing.configure(span_processors=[filter2]):
        assert get_config().span_processors == [filter2]

        with mlflow.tracing.configure(span_processors=[filter1, filter2]):
            assert get_config().span_processors == [filter1, filter2]

        # Config should be restored after context exit
        assert get_config().span_processors == [filter2]

    assert get_config().span_processors == [filter1]


def test_context_manager_with_exception():
    def filter1(span):
        pass

    def filter2(span):
        pass

    mlflow.tracing.configure(span_processors=[filter1])

    with pytest.raises(ValueError, match="test error"):  # noqa: PT012
        with mlflow.tracing.configure(span_processors=[filter2]):
            assert get_config().span_processors == [filter2]
            raise ValueError("test error")

    # Config should be restored despite exception
    assert get_config().span_processors == [filter1]


def test_context_manager_with_non_copyable_callable():
    # Lambda functions are not deepcopyable
    lambda_filter = lambda span: None  # noqa: E731

    # Configure with a lambda function
    mlflow.tracing.configure(span_processors=[lambda_filter])
    assert get_config().span_processors == [lambda_filter]

    def regular_filter(span):
        pass

    # Context manager should still work with non-copyable callables
    with mlflow.tracing.configure(span_processors=[regular_filter]):
        assert get_config().span_processors == [regular_filter]

    # Config should be restored
    assert get_config().span_processors == [lambda_filter]
```

--------------------------------------------------------------------------------

---[FILE: test_copy.py]---
Location: mlflow-master/tests/tracing/utils/test_copy.py

```python
import time

import pytest

import mlflow
from mlflow.tracing.utils.copy import copy_trace_to_experiment

from tests.tracing.helper import purge_traces


def _create_test_span_dict(request_id="test-trace", parent_id=None):
    """Helper to create a minimal valid span dict for testing"""
    return {
        "name": "root_span" if parent_id is None else "child_span",
        "context": {
            "span_id": "0d48a6670588966b" if parent_id is None else "6fc32f36ef591f60",
            "trace_id": "63076d0c1b90f1df0970f897dc428bd6",
        },
        "parent_id": parent_id,
        "start_time": 100,
        "end_time": 200,
        "status_code": "OK",
        "status_message": "",
        "attributes": {
            "mlflow.traceRequestId": f'"{request_id}"',
            "mlflow.spanType": '"UNKNOWN"',
        },
        "events": [],
    }


@pytest.fixture(autouse=True)
def setup_experiment():
    """Set up a test experiment before each test"""
    exp = mlflow.set_experiment(f"test_copy_trace_{time.time()}")
    yield exp
    purge_traces(exp.experiment_id)


def test_copy_trace_with_metadata():
    trace_dict = {
        "info": {
            "request_id": "test-trace-789",
            "experiment_id": "0",
            "timestamp_ms": 100,
            "execution_time_ms": 200,
            "status": "OK",
            "trace_metadata": {
                "mlflow.trace.session": "session123",
                "custom.metadata": "metadata_value",
                "user.key": "user_value",
            },
        },
        "data": {"spans": [_create_test_span_dict("test-trace-789")]},
    }

    new_trace_id = copy_trace_to_experiment(trace_dict)

    # Verify metadata was copied correctly
    trace = mlflow.get_trace(new_trace_id)
    metadata = trace.info.trace_metadata

    assert metadata["mlflow.trace.session"] == "session123"
    assert metadata["custom.metadata"] == "metadata_value"
    assert metadata["user.key"] == "user_value"


def test_copy_trace_missing_info():
    trace_dict = {"data": {"spans": [_create_test_span_dict("test-trace-no-info")]}}

    # Should not raise an error, just skip tag/metadata copying
    new_trace_id = copy_trace_to_experiment(trace_dict)

    assert new_trace_id is not None
    trace = mlflow.get_trace(new_trace_id)
    assert trace is not None


def test_copy_trace_missing_metadata():
    trace_dict = {
        "info": {
            "request_id": "test-trace-no-metadata",
            "experiment_id": "0",
            "tags": {
                "user.tag": "tag_value",
            },
        },
        "data": {"spans": [_create_test_span_dict("test-trace-no-metadata")]},
    }

    # Should not raise an error, just skip metadata copying
    new_trace_id = copy_trace_to_experiment(trace_dict)

    assert new_trace_id is not None
    trace = mlflow.get_trace(new_trace_id)

    # Tags should still be copied
    tags = trace.info.tags
    assert tags["user.tag"] == "tag_value"


def test_copy_trace_empty_metadata_dict():
    trace_dict = {
        "info": {
            "request_id": "test-trace-empty-metadata",
            "experiment_id": "0",
            "tags": {
                "user.tag": "value",
            },
            "trace_metadata": {},
        },
        "data": {"spans": [_create_test_span_dict("test-trace-empty-metadata")]},
    }

    # Should not raise an error
    new_trace_id = copy_trace_to_experiment(trace_dict)

    assert new_trace_id is not None
    trace = mlflow.get_trace(new_trace_id)

    # Tags should still be copied
    tags = trace.info.tags
    assert tags["user.tag"] == "value"
```

--------------------------------------------------------------------------------

---[FILE: test_environment.py]---
Location: mlflow-master/tests/tracing/utils/test_environment.py

```python
from unittest import mock

import pytest

from mlflow.tracing.utils.environment import resolve_env_metadata
from mlflow.utils.mlflow_tags import (
    MLFLOW_DATABRICKS_NOTEBOOK_ID,
    MLFLOW_DATABRICKS_NOTEBOOK_PATH,
    MLFLOW_GIT_BRANCH,
    MLFLOW_GIT_COMMIT,
    MLFLOW_GIT_REPO_URL,
    MLFLOW_SOURCE_NAME,
    MLFLOW_SOURCE_TYPE,
    MLFLOW_USER,
)
from mlflow.version import IS_TRACING_SDK_ONLY


@pytest.fixture(autouse=True)
def clear_lru_cache():
    resolve_env_metadata.cache_clear()


def test_resolve_env_metadata():
    expected_metadata = {
        MLFLOW_USER: mock.ANY,
        MLFLOW_SOURCE_NAME: mock.ANY,
        MLFLOW_SOURCE_TYPE: "LOCAL",
    }
    if not IS_TRACING_SDK_ONLY:
        expected_metadata.update(
            {
                MLFLOW_GIT_BRANCH: mock.ANY,
                MLFLOW_GIT_COMMIT: mock.ANY,
                MLFLOW_GIT_REPO_URL: mock.ANY,
            }
        )
    assert resolve_env_metadata() == expected_metadata


def test_resolve_env_metadata_in_databricks_notebook():
    with (
        mock.patch(
            "mlflow.tracking.context.databricks_notebook_context.databricks_utils"
        ) as mock_db_utils,
        mock.patch("mlflow.tracing.utils.environment.is_in_databricks_notebook", return_value=True),
    ):
        mock_db_utils.is_in_databricks_notebook.return_value = True
        mock_db_utils.get_notebook_id.return_value = "notebook_123"
        mock_db_utils.get_notebook_path.return_value = "/Users/bob/test.py"
        mock_db_utils.get_webapp_url.return_value = None
        mock_db_utils.get_workspace_url.return_value = None
        mock_db_utils.get_workspace_id.return_value = None
        mock_db_utils.get_workspace_info_from_dbutils.return_value = (None, None)

        assert resolve_env_metadata() == {
            MLFLOW_USER: mock.ANY,
            MLFLOW_SOURCE_NAME: "/Users/bob/test.py",
            MLFLOW_SOURCE_TYPE: "NOTEBOOK",
            MLFLOW_DATABRICKS_NOTEBOOK_ID: "notebook_123",
            MLFLOW_DATABRICKS_NOTEBOOK_PATH: "/Users/bob/test.py",
        }
```

--------------------------------------------------------------------------------

---[FILE: test_exception.py]---
Location: mlflow-master/tests/tracing/utils/test_exception.py

```python
import pytest

from mlflow.exceptions import MlflowTracingException
from mlflow.tracing.utils.exception import raise_as_trace_exception


def test_raise_as_trace_exception():
    @raise_as_trace_exception
    def test_fn():
        raise ValueError("error")

    with pytest.raises(MlflowTracingException, match="error"):
        test_fn()

    @raise_as_trace_exception
    def test_fn_no_raise():
        return 0

    assert test_fn_no_raise() == 0
```

--------------------------------------------------------------------------------

---[FILE: test_otlp.py]---
Location: mlflow-master/tests/tracing/utils/test_otlp.py
Signals: FastAPI

```python
import gzip
import time
import zlib
from collections.abc import Callable

import pytest
from fastapi import HTTPException

import mlflow
from mlflow.entities.span import SpanType
from mlflow.environment_variables import MLFLOW_TRACE_ENABLE_OTLP_DUAL_EXPORT
from mlflow.tracing.processor.mlflow_v3 import MlflowV3SpanProcessor
from mlflow.tracing.processor.otel import OtelSpanProcessor
from mlflow.tracing.provider import _get_trace_exporter, _get_tracer
from mlflow.tracking import MlflowClient
from mlflow.utils.os import is_windows

from tests.tracing.helper import get_traces

# OTLP exporters are not installed in some CI jobs
try:
    from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import (
        OTLPSpanExporter as GrpcExporter,
    )
    from opentelemetry.exporter.otlp.proto.http.trace_exporter import (
        OTLPSpanExporter as HttpExporter,
    )
except ImportError:
    pytest.skip("OTLP exporters are not installed", allow_module_level=True)

from mlflow.exceptions import MlflowException
from mlflow.tracing.utils.otlp import (
    decompress_otlp_body,
    get_otlp_exporter,
    should_use_otlp_exporter,
)

_TEST_HTTP_OTLP_ENDPOINT = "http://127.0.0.1:4317/v1/traces"
_TEST_HTTPS_OTLP_ENDPOINT = "https://127.0.0.1:4317/v1/traces"


@pytest.mark.parametrize(
    ("traces_endpoint", "otlp_endpoint", "mlflow_enable", "expected"),
    [
        # No endpoints configured
        (None, None, None, False),  # Default behavior - no export without endpoint
        (None, None, "true", False),  # Explicit enable but no endpoint
        (None, None, "false", False),  # Explicit disable and no endpoint
        # OTEL_EXPORTER_OTLP_TRACES_ENDPOINT configured
        (_TEST_HTTP_OTLP_ENDPOINT, None, None, True),  # Default behavior - export enabled
        (_TEST_HTTP_OTLP_ENDPOINT, None, "true", True),  # Explicit enable
        (_TEST_HTTP_OTLP_ENDPOINT, None, "false", False),  # Explicit disable
        # OTEL_EXPORTER_OTLP_ENDPOINT configured
        (None, _TEST_HTTP_OTLP_ENDPOINT, None, True),  # Default behavior - export enabled
        (None, _TEST_HTTP_OTLP_ENDPOINT, "true", True),  # Explicit enable
        (None, _TEST_HTTP_OTLP_ENDPOINT, "false", False),  # Explicit disable
        # Both endpoints configured (traces endpoint takes precedence)
        (_TEST_HTTP_OTLP_ENDPOINT, _TEST_HTTPS_OTLP_ENDPOINT, None, True),
        (_TEST_HTTP_OTLP_ENDPOINT, _TEST_HTTPS_OTLP_ENDPOINT, "false", False),
    ],
)
def test_should_use_otlp_exporter(
    traces_endpoint, otlp_endpoint, mlflow_enable, expected, monkeypatch
):
    # Clear all relevant environment variables to ensure test isolation
    monkeypatch.delenv("OTEL_EXPORTER_OTLP_TRACES_ENDPOINT", raising=False)
    monkeypatch.delenv("OTEL_EXPORTER_OTLP_ENDPOINT", raising=False)
    monkeypatch.delenv("MLFLOW_ENABLE_OTLP_EXPORTER", raising=False)

    # Set environment variables based on test parameters
    if traces_endpoint is not None:
        monkeypatch.setenv("OTEL_EXPORTER_OTLP_TRACES_ENDPOINT", traces_endpoint)
    if otlp_endpoint is not None:
        monkeypatch.setenv("OTEL_EXPORTER_OTLP_ENDPOINT", otlp_endpoint)
    if mlflow_enable is not None:
        monkeypatch.setenv("MLFLOW_ENABLE_OTLP_EXPORTER", mlflow_enable)

    assert should_use_otlp_exporter() is expected


@pytest.mark.parametrize(
    ("endpoint", "protocol", "expected_type"),
    [
        (_TEST_HTTP_OTLP_ENDPOINT, None, GrpcExporter),
        (_TEST_HTTP_OTLP_ENDPOINT, "grpc", GrpcExporter),
        (_TEST_HTTPS_OTLP_ENDPOINT, "grpc", GrpcExporter),
        (_TEST_HTTP_OTLP_ENDPOINT, "http/protobuf", HttpExporter),
        (_TEST_HTTPS_OTLP_ENDPOINT, "http/protobuf", HttpExporter),
    ],
)
def test_get_otlp_exporter_success(endpoint, protocol, expected_type, monkeypatch):
    monkeypatch.setenv("OTEL_EXPORTER_OTLP_TRACES_ENDPOINT", endpoint)
    if protocol:
        monkeypatch.setenv("OTEL_EXPORTER_OTLP_TRACES_PROTOCOL", protocol)

    exporter = get_otlp_exporter()
    assert isinstance(exporter, expected_type)

    if isinstance(exporter, GrpcExporter):
        assert exporter._endpoint == "127.0.0.1:4317"
    else:
        assert exporter._endpoint == endpoint


def test_get_otlp_exporter_invalid_protocol(monkeypatch):
    monkeypatch.setenv("OTEL_EXPORTER_OTLP_TRACES_PROTOCOL", _TEST_HTTP_OTLP_ENDPOINT)

    with pytest.raises(MlflowException, match="Unsupported OTLP protocol"):
        get_otlp_exporter()


@pytest.mark.skipif(is_windows(), reason="Otel collector docker image does not support Windows")
@pytest.mark.parametrize("dual_export", [True, False, None], ids=["enable", "disable", "default"])
def test_export_to_otel_collector(otel_collector, monkeypatch, dual_export):
    if dual_export:
        monkeypatch.setenv("MLFLOW_TRACE_ENABLE_OTLP_DUAL_EXPORT", "true")
    elif dual_export is False:
        monkeypatch.setenv("MLFLOW_TRACE_ENABLE_OTLP_DUAL_EXPORT", "false")

    from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

    _, _, port = otel_collector
    monkeypatch.setenv("OTEL_EXPORTER_OTLP_TRACES_ENDPOINT", f"http://127.0.0.1:{port}/v1/traces")

    class TestModel:
        @mlflow.trace()
        def predict(self, x, y):
            z = x + y
            z = self.add_one(z)
            z = mlflow.trace(self.square)(z)
            return z  # noqa: RET504

        @mlflow.trace(
            span_type=SpanType.LLM, name="add_one_with_custom_name", attributes={"delta": 1}
        )
        def add_one(self, z):
            return z + 1

        def square(self, t):
            res = t**2
            time.sleep(0.1)
            return res

    model = TestModel()
    model.predict(2, 5)

    # Tracer should be configured to export to OTLP
    exporter = _get_trace_exporter()
    assert isinstance(exporter, OTLPSpanExporter)
    assert exporter._endpoint == f"127.0.0.1:{port}"

    mlflow_traces = get_traces()
    if dual_export:
        assert len(mlflow_traces) == 1
        assert mlflow_traces[0].info.state == "OK"
        assert len(mlflow_traces[0].data.spans) == 3
    else:
        assert len(mlflow_traces) == 0

    # Wait for collector to receive spans, checking every second for up to 60 seconds
    _, output_file, _ = otel_collector
    spans_found = False
    for _ in range(60):
        time.sleep(1)
        with open(output_file) as f:
            collector_logs = f.read()
        # Check if spans are in the logs - the debug exporter outputs span details
        # The BatchSpanProcessor may send spans in multiple batches, so we check for any evidence
        # that the collector is receiving spans from our test
        if (
            "predict" in collector_logs
            and "add_one_with_custom_name" in collector_logs
            and "square" in collector_logs
        ):
            # We found evidence that spans are being exported to the collector
            # The child spans may come in separate batches, but OTLP export works
            spans_found = True
            break

    # Assert that spans were found in collector logs
    assert spans_found, (
        f"Expected spans not found in collector logs after 60 seconds. "
        f"Logs: {collector_logs[:2000]}"
    )


@pytest.mark.skipif(is_windows(), reason="Otel collector docker image does not support Windows")
def test_dual_export_to_mlflow_and_otel(otel_collector, monkeypatch):
    """
    Test that dual export mode sends traces to both MLflow and OTLP collector.
    """
    _, _, port = otel_collector
    monkeypatch.setenv(MLFLOW_TRACE_ENABLE_OTLP_DUAL_EXPORT.name, "true")
    monkeypatch.setenv("OTEL_EXPORTER_OTLP_TRACES_ENDPOINT", f"http://127.0.0.1:{port}/v1/traces")

    experiment = mlflow.set_experiment("dual_export_test")

    processors = _get_tracer("test").span_processor._span_processors
    assert len(processors) == 2
    assert isinstance(processors[0], OtelSpanProcessor)
    assert isinstance(processors[1], MlflowV3SpanProcessor)

    @mlflow.trace(name="parent_span")
    def parent_function():
        result = child_function("Hello", "World")
        return f"Parent: {result}"

    @mlflow.trace(name="child_span")
    def child_function(arg1, arg2):
        # Test that update_current_trace works in dual export mode
        mlflow.update_current_trace({"env": "production", "version": "1.0"})
        return f"{arg1} {arg2}"

    result = parent_function()
    assert result == "Parent: Hello World"

    client = MlflowClient()
    traces = client.search_traces(experiment_ids=[experiment.experiment_id])
    assert len(traces) == 1
    trace = traces[0]
    assert len(trace.data.spans) == 2

    # Verify trace tags were set correctly
    assert "env" in trace.info.tags
    assert trace.info.tags["env"] == "production"
    assert "version" in trace.info.tags
    assert trace.info.tags["version"] == "1.0"

    # Wait for collector to receive spans, checking every second for up to 60 seconds
    _, output_file, _ = otel_collector
    spans_found = False
    for _ in range(60):
        time.sleep(1)
        with open(output_file) as f:
            collector_logs = f.read()
        # Check if spans are in the logs - the debug exporter outputs span details
        # Look for evidence that spans were received
        if "parent_span" in collector_logs or "child_span" in collector_logs:
            # Evidence of traces being exported to OTLP
            spans_found = True
            break

    # Assert that spans were found in collector logs
    assert spans_found, (
        f"Expected spans not found in collector logs after 60 seconds. "
        f"Logs: {collector_logs[:2000]}"
    )


@pytest.mark.parametrize(
    ("encoding", "compress_fn", "data"),
    [
        ("gzip", gzip.compress, b"otlp-data-test"),
        ("deflate", zlib.compress, b"otlp-deflate-data"),
        ("deflate", lambda d: zlib.compress(d)[2:-4], b"raw-deflate-data"),  # Raw deflate
    ],
    ids=["gzip", "deflate-rfc", "deflate-raw"],
)
def test_decompress_otlp_body_valid(
    encoding: str, compress_fn: Callable[[bytes], bytes], data: bytes
):
    compressed = compress_fn(data)
    output = decompress_otlp_body(compressed, encoding)
    assert output == data


@pytest.mark.parametrize(
    ("encoding", "invalid_data", "expected_error"),
    [
        ("gzip", b"not-gzip-data", r"Failed to decompress gzip payload"),
        ("deflate", b"not-deflate-data", r"Failed to decompress deflate payload"),
        ("unknown-encoding", b"xxx", r"Unsupported Content-Encoding"),
    ],
    ids=["gzip-invalid", "deflate-invalid", "unknown-encoding"],
)
def test_decompress_otlp_body_invalid(encoding: str, invalid_data: bytes, expected_error: str):
    with pytest.raises(HTTPException, match=expected_error, check=lambda e: e.status_code == 400):
        decompress_otlp_body(invalid_data, encoding)
```

--------------------------------------------------------------------------------

````
