---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 954
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 954 of 991)

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

---[FILE: test_provider.py]---
Location: mlflow-master/tests/tracing/test_provider.py

```python
from concurrent.futures import ThreadPoolExecutor
from unittest import mock

import pytest
from opentelemetry import trace

import mlflow
import mlflow.tracking._tracking_service
from mlflow.entities.trace_location import MlflowExperimentLocation, UCSchemaLocation
from mlflow.environment_variables import (
    MLFLOW_TRACE_ENABLE_OTLP_DUAL_EXPORT,
    MLFLOW_TRACE_SAMPLING_RATIO,
    MLFLOW_USE_DEFAULT_TRACER_PROVIDER,
)
from mlflow.exceptions import MlflowTracingException
from mlflow.tracing.destination import Databricks, MlflowExperiment
from mlflow.tracing.export.inference_table import (
    _TRACE_BUFFER,
    InferenceTableSpanExporter,
)
from mlflow.tracing.export.mlflow_v3 import MlflowV3SpanExporter
from mlflow.tracing.export.uc_table import DatabricksUCTableSpanExporter
from mlflow.tracing.fluent import start_span_no_context
from mlflow.tracing.processor.inference_table import InferenceTableSpanProcessor
from mlflow.tracing.processor.mlflow_v3 import MlflowV3SpanProcessor
from mlflow.tracing.processor.otel import OtelSpanProcessor
from mlflow.tracing.processor.uc_table import DatabricksUCTableSpanProcessor
from mlflow.tracing.provider import (
    _get_tracer,
    _initialize_tracer_provider,
    is_tracing_enabled,
    start_span_in_context,
    trace_disabled,
)
from mlflow.tracing.utils import get_active_spans_table_name

from tests.tracing.helper import get_traces, purge_traces, skip_when_testing_trace_sdk


@pytest.fixture
def mock_setup_tracer_provider():
    # To count the number of times _initialize_tracer_provider is called
    with mock.patch(
        "mlflow.tracing.provider._initialize_tracer_provider",
        side_effect=_initialize_tracer_provider,
    ) as setup_mock:
        yield setup_mock


def test_tracer_provider_initialized_once(mock_setup_tracer_provider):
    assert mock_setup_tracer_provider.call_count == 0
    start_span_in_context("test1")
    assert mock_setup_tracer_provider.call_count == 1

    start_span_in_context("test_2")
    start_span_in_context("test_3")
    assert mock_setup_tracer_provider.call_count == 1

    # Thread safety
    with ThreadPoolExecutor(max_workers=2) as executor:
        executor.map(start_span_in_context, ["test_4", "test_5"])
    assert mock_setup_tracer_provider.call_count == 1


def test_reset_tracer_setup(mock_setup_tracer_provider):
    assert mock_setup_tracer_provider.call_count == 0

    start_span_in_context("test1")
    assert mock_setup_tracer_provider.call_count == 1

    mlflow.tracing.reset()
    assert mock_setup_tracer_provider.call_count == 2

    start_span_in_context("test2")
    assert mock_setup_tracer_provider.call_count == 3
    assert mock_setup_tracer_provider.mock_calls == (
        [
            mock.call(),
            mock.call(disabled=True),
            mock.call(),
        ]
    )


def test_span_processor_and_exporter_model_serving(mock_databricks_serving_with_tracing_env):
    tracer = _get_tracer("test")
    processors = tracer.span_processor._span_processors
    assert len(processors) == 1
    assert isinstance(processors[0], InferenceTableSpanProcessor)
    assert isinstance(processors[0].span_exporter, InferenceTableSpanExporter)


def test_set_destination_mlflow_experiment(monkeypatch):
    mlflow.tracing.set_destination(destination=MlflowExperimentLocation(experiment_id="123"))

    tracer = _get_tracer("test")
    processors = tracer.span_processor._span_processors
    assert isinstance(processors[0], MlflowV3SpanProcessor)
    assert isinstance(processors[0].span_exporter, MlflowV3SpanExporter)


def test_set_destination_databricks(monkeypatch):
    monkeypatch.setenv("MLFLOW_TRACKING_URI", "databricks")
    mlflow.tracing.set_destination(destination=Databricks(experiment_id="123"))

    tracer = _get_tracer("test")
    processors = tracer.span_processor._span_processors
    assert len(processors) == 1
    assert isinstance(processors[0], MlflowV3SpanProcessor)
    assert isinstance(processors[0].span_exporter, MlflowV3SpanExporter)


def test_set_destination_databricks_uc(monkeypatch):
    mlflow.tracing.set_destination(
        destination=UCSchemaLocation(
            catalog_name="catalog",
            schema_name="schema",
        )
    )

    tracer = _get_tracer("test")
    processors = tracer.span_processor._span_processors
    assert len(processors) == 1
    assert isinstance(processors[0], DatabricksUCTableSpanProcessor)
    assert isinstance(processors[0].span_exporter, DatabricksUCTableSpanExporter)
    assert get_active_spans_table_name() == "catalog.schema.mlflow_experiment_trace_otel_spans"


def test_set_destination_databricks_uc_with_oltp_env_no_dual_export(monkeypatch):
    # set_destination is called but OLTP is also set w/o dual export mode enabled
    monkeypatch.setenv(MLFLOW_TRACE_ENABLE_OTLP_DUAL_EXPORT.name, "false")
    with (
        mock.patch("mlflow.tracing.provider.should_use_otlp_exporter", return_value=True),
        mock.patch("mlflow.tracing.provider.get_otlp_exporter") as mock_get_exporter,
    ):
        mock_get_exporter.return_value = mock.MagicMock()

        mlflow.tracing.reset()
        mlflow.tracing.set_destination(
            destination=UCSchemaLocation(
                catalog_name="catalog",
                schema_name="schema",
            )
        )
        tracer = _get_tracer("test")
        processors = tracer.span_processor._span_processors
        assert len(processors) == 1
        assert isinstance(processors[0], DatabricksUCTableSpanProcessor)
        assert isinstance(processors[0].span_exporter, DatabricksUCTableSpanExporter)
        assert get_active_spans_table_name() == "catalog.schema.mlflow_experiment_trace_otel_spans"


def test_set_destination_databricks_uc_with_oltp_env_with_dual_export(monkeypatch):
    # set_destination is called but OLTP is also set w/ dual export mode enabled
    monkeypatch.setenv(MLFLOW_TRACE_ENABLE_OTLP_DUAL_EXPORT.name, "true")
    with (
        mock.patch("mlflow.tracing.provider.should_use_otlp_exporter", return_value=True),
        mock.patch("mlflow.tracing.provider.get_otlp_exporter") as mock_get_exporter,
    ):
        mock_get_exporter.return_value = mock.MagicMock()

        mlflow.tracing.reset()
        mlflow.tracing.set_destination(
            destination=UCSchemaLocation(
                catalog_name="catalog",
                schema_name="schema",
            )
        )
        tracer = _get_tracer("test")
        processors = tracer.span_processor._span_processors
        assert len(processors) == 2
        assert isinstance(processors[0], DatabricksUCTableSpanProcessor)
        assert isinstance(processors[0].span_exporter, DatabricksUCTableSpanExporter)
        # OTLP processor needs to be there for dual export mode
        assert isinstance(processors[1], OtelSpanProcessor)
        assert get_active_spans_table_name() == "catalog.schema.mlflow_experiment_trace_otel_spans"


def test_set_destination_from_env_var_mlflow_experiment(monkeypatch):
    monkeypatch.setenv("MLFLOW_TRACING_DESTINATION", "123")

    tracer = _get_tracer("test")
    processors = tracer.span_processor._span_processors
    assert len(processors) == 1
    assert isinstance(processors[0], MlflowV3SpanProcessor)
    assert isinstance(processors[0].span_exporter, MlflowV3SpanExporter)


def test_set_destination_from_env_var_databricks_uc(monkeypatch):
    monkeypatch.setenv("MLFLOW_TRACING_DESTINATION", "catalog.schema")

    tracer = _get_tracer("test")
    processors = tracer.span_processor._span_processors
    assert len(processors) == 1
    assert isinstance(processors[0], DatabricksUCTableSpanProcessor)
    assert isinstance(processors[0].span_exporter, DatabricksUCTableSpanExporter)
    assert get_active_spans_table_name() == "catalog.schema.mlflow_experiment_trace_otel_spans"


def test_set_destination_in_model_serving(mock_databricks_serving_with_tracing_env, monkeypatch):
    monkeypatch.setenv("MLFLOW_TRACKING_URI", "databricks")
    monkeypatch.setenv("MLFLOW_TRACING_DESTINATION", "catalog.schema")

    tracer = _get_tracer("test")
    processors = tracer.span_processor._span_processors
    assert len(processors) == 1
    assert isinstance(processors[0], DatabricksUCTableSpanProcessor)
    assert isinstance(processors[0].span_exporter, DatabricksUCTableSpanExporter)
    assert get_active_spans_table_name() == "catalog.schema.mlflow_experiment_trace_otel_spans"


def test_set_destination_deprecated_classes():
    from mlflow.tracing.provider import _MLFLOW_TRACE_USER_DESTINATION

    with pytest.warns(FutureWarning, match="`mlflow.tracing.destination.MlflowExperiment``"):
        mlflow.tracing.set_destination(destination=MlflowExperiment(experiment_id="123"))

    destination = _MLFLOW_TRACE_USER_DESTINATION.get()
    assert isinstance(destination, MlflowExperimentLocation)
    assert destination.experiment_id == "123"

    with pytest.warns(FutureWarning, match="`mlflow.tracing.destination.Databricks`"):
        mlflow.tracing.set_destination(destination=Databricks(experiment_id="123"))

    destination = _MLFLOW_TRACE_USER_DESTINATION.get()
    assert isinstance(destination, MlflowExperimentLocation)
    assert destination.experiment_id == "123"


def test_disable_enable_tracing():
    @mlflow.trace
    def test_fn():
        pass

    test_fn()
    assert len(get_traces()) == 1
    assert isinstance(_get_tracer(__name__), trace.Tracer)
    purge_traces()

    mlflow.tracing.disable()
    test_fn()
    assert len(get_traces()) == 0
    assert isinstance(_get_tracer(__name__), trace.NoOpTracer)

    mlflow.tracing.enable()
    test_fn()
    assert len(get_traces()) == 1
    assert isinstance(_get_tracer(__name__), trace.Tracer)

    # enable() / disable() should only raise MlflowTracingException
    with mock.patch(
        "mlflow.tracing.provider.is_tracing_enabled", side_effect=ValueError("error")
    ) as is_enabled_mock:
        with pytest.raises(MlflowTracingException, match="error"):
            mlflow.tracing.disable()
        assert is_enabled_mock.call_count == 1

        with pytest.raises(MlflowTracingException, match="error"):
            mlflow.tracing.enable()
        assert is_enabled_mock.call_count == 2


@pytest.mark.parametrize("enabled_initially", [True, False])
def test_trace_disabled_decorator(enabled_initially):
    if not enabled_initially:
        mlflow.tracing.disable()
    assert is_tracing_enabled() == enabled_initially
    call_count = 0

    @trace_disabled
    def test_fn():
        with mlflow.start_span(name="test_span") as span:
            span.set_attribute("key", "value")
        nonlocal call_count
        call_count += 1
        return 0

    test_fn()
    assert len(get_traces()) == 0
    assert call_count == 1

    # Recover the initial state
    assert is_tracing_enabled() == enabled_initially

    # Tracing should be enabled back even if the function raises an exception
    @trace_disabled
    def test_fn_raise():
        nonlocal call_count
        call_count += 1
        raise ValueError("error")

    with pytest.raises(ValueError, match="error"):
        test_fn_raise()
    assert call_count == 2

    assert len(get_traces()) == 0
    assert is_tracing_enabled() == enabled_initially

    # @trace_disabled should not block the decorated function even
    # if it fails to disable tracing
    with mock.patch(
        "mlflow.tracing.provider.disable", side_effect=MlflowTracingException("error")
    ) as disable_mock:
        assert test_fn() == 0
        assert call_count == 3
        assert disable_mock.call_count == (1 if enabled_initially else 0)

    with mock.patch(
        "mlflow.tracing.provider.enable", side_effect=MlflowTracingException("error")
    ) as enable_mock:
        assert test_fn() == 0
        assert call_count == 4
        assert enable_mock.call_count == (1 if enabled_initially else 0)


def test_disable_enable_tracing_not_mutate_otel_provider(monkeypatch):
    monkeypatch.setenv(MLFLOW_USE_DEFAULT_TRACER_PROVIDER.name, "true")

    # This test validates that disable/enable MLflow tracing does not mutate the OpenTelemetry's
    # global tracer provider instance.
    otel_tracer_provider = trace.get_tracer_provider()

    mlflow.tracing.disable()
    assert trace.get_tracer_provider() is otel_tracer_provider

    mlflow.tracing.enable()
    assert trace.get_tracer_provider() is otel_tracer_provider

    @trace_disabled
    def test_fn():
        assert trace.get_tracer_provider() is otel_tracer_provider

    test_fn()
    assert trace.get_tracer_provider() is otel_tracer_provider


def test_is_tracing_enabled():
    # Before doing anything -> tracing is considered as "on"
    assert is_tracing_enabled()

    # Generate a trace -> tracing is still "on"
    @mlflow.trace
    def foo():
        pass

    foo()
    assert is_tracing_enabled()

    # Disable tracing
    mlflow.tracing.disable()
    assert is_tracing_enabled() is False

    # Try to generate a trace -> tracing is still "off"
    foo()
    assert is_tracing_enabled() is False

    # Re-enable tracing
    mlflow.tracing.enable()
    assert is_tracing_enabled() is True

    # is_tracing_enabled() should only raise MlflowTracingException
    with mock.patch(
        "mlflow.tracing.provider._get_tracer", side_effect=ValueError("error")
    ) as get_tracer_mock:
        with pytest.raises(MlflowTracingException, match="error"):
            assert is_tracing_enabled() is False
        assert get_tracer_mock.call_count == 1


@pytest.mark.parametrize("enable_mlflow_tracing", [True, False, None])
def test_enable_mlflow_tracing_switch_in_serving_fluent(monkeypatch, enable_mlflow_tracing):
    if enable_mlflow_tracing is None:
        monkeypatch.delenv("ENABLE_MLFLOW_TRACING", raising=False)
    else:
        monkeypatch.setenv("ENABLE_MLFLOW_TRACING", str(enable_mlflow_tracing).lower())
    monkeypatch.setenv("IS_IN_DB_MODEL_SERVING_ENV", "true")

    @mlflow.trace
    def foo():
        return 1

    request_ids = ["id1", "id2", "id3"]
    with mock.patch(
        "mlflow.tracing.processor.inference_table.maybe_get_request_id", side_effect=request_ids
    ):
        for _ in range(3):
            foo()

    if enable_mlflow_tracing:
        assert sorted(_TRACE_BUFFER) == request_ids
    else:
        assert len(_TRACE_BUFFER) == 0


@pytest.mark.parametrize("enable_mlflow_tracing", [True, False])
def test_enable_mlflow_tracing_switch_in_serving_client(monkeypatch, enable_mlflow_tracing):
    monkeypatch.setenv("ENABLE_MLFLOW_TRACING", str(enable_mlflow_tracing).lower())
    monkeypatch.setenv("IS_IN_DB_MODEL_SERVING_ENV", "true")

    def foo():
        return bar()

    @mlflow.trace
    def bar():
        return 1

    request_ids = ["123", "234"]
    with mock.patch(
        "mlflow.tracing.processor.inference_table.maybe_get_request_id", side_effect=request_ids
    ):
        span = start_span_no_context("root")
        foo()
        if enable_mlflow_tracing:
            span.end()

    if enable_mlflow_tracing:
        assert sorted(_TRACE_BUFFER) == request_ids
    else:
        assert len(_TRACE_BUFFER) == 0


def test_sampling_ratio(monkeypatch):
    @mlflow.trace
    def test_function():
        return "test"

    # Test with 100% sampling (default)
    for _ in range(10):
        test_function()

    traces = get_traces()
    assert len(traces) == 10
    purge_traces()

    # Test with 0% sampling
    monkeypatch.setenv(MLFLOW_TRACE_SAMPLING_RATIO.name, "0.0")
    mlflow.tracing.reset()

    for _ in range(10):
        test_function()

    traces = get_traces()
    assert len(traces) == 0
    purge_traces()

    # With 50% sampling and 100 runs, we expect around 50 traces
    # but due to randomness, we check for a reasonable range
    monkeypatch.setenv(MLFLOW_TRACE_SAMPLING_RATIO.name, "0.5")
    mlflow.tracing.reset()

    for _ in range(100):
        test_function()

    traces = get_traces()
    assert 30 <= len(traces) <= 70, (
        f"Expected around 50 traces with 0.5 sampling, got {len(traces)}"
    )


def test_otlp_exclusive_vs_dual_export_with_no_set_location(monkeypatch):
    from mlflow.environment_variables import MLFLOW_TRACE_ENABLE_OTLP_DUAL_EXPORT
    from mlflow.tracing.processor.otel import OtelSpanProcessor
    from mlflow.tracing.provider import _get_tracer

    # Test 1: OTLP exclusive mode (dual export = false, default)
    monkeypatch.setenv(MLFLOW_TRACE_ENABLE_OTLP_DUAL_EXPORT.name, "false")
    with (
        mock.patch("mlflow.tracing.provider.should_use_otlp_exporter", return_value=True),
        mock.patch("mlflow.tracing.provider.get_otlp_exporter") as mock_get_exporter,
    ):
        mock_get_exporter.return_value = mock.MagicMock()

        mlflow.tracing.reset()
        tracer = _get_tracer("test")

        processors = tracer.span_processor._span_processors

        # Should have only OTLP processor as primary
        assert len(processors) == 1
        assert isinstance(processors[0], OtelSpanProcessor)

    # Test 2: Dual export mode (both MLflow and OTLP)
    monkeypatch.setenv(MLFLOW_TRACE_ENABLE_OTLP_DUAL_EXPORT.name, "true")
    with (
        mock.patch("mlflow.tracing.provider.should_use_otlp_exporter", return_value=True),
        mock.patch("mlflow.tracing.provider.get_otlp_exporter") as mock_get_exporter,
    ):
        mock_get_exporter.return_value = mock.MagicMock()

        mlflow.tracing.reset()
        tracer = _get_tracer("test")

        processors = tracer.span_processor._span_processors

        # Should have both processors
        assert len(processors) == 2
        assert isinstance(processors[0], OtelSpanProcessor)
        assert isinstance(processors[1], MlflowV3SpanProcessor)


@skip_when_testing_trace_sdk
@pytest.mark.parametrize("dual_export", [False, True])
def test_metrics_export_with_otlp_trace_export(monkeypatch, dual_export):
    monkeypatch.setenv("OTEL_EXPORTER_OTLP_TRACES_ENDPOINT", "http://localhost:4317")
    monkeypatch.setenv("OTEL_EXPORTER_OTLP_METRICS_ENDPOINT", "http://localhost:9090")

    if dual_export:
        monkeypatch.setenv(MLFLOW_TRACE_ENABLE_OTLP_DUAL_EXPORT.name, "true")

    mlflow.tracing.reset()
    tracer = _get_tracer("test")

    if dual_export:
        processors = tracer.span_processor._span_processors
        assert len(processors) == 2
        assert isinstance(processors[0], OtelSpanProcessor)
        assert isinstance(processors[1], MlflowV3SpanProcessor)

        # In dual export, MLflow processor exports metrics, OTLP doesn't
        assert processors[0]._export_metrics is False
        assert processors[1]._export_metrics is True
    else:
        processors = tracer.span_processor._span_processors
        assert len(processors) == 1
        assert isinstance(processors[0], OtelSpanProcessor)
        assert processors[0]._export_metrics is True


@skip_when_testing_trace_sdk
def test_metrics_export_without_otlp_trace_export(monkeypatch):
    monkeypatch.setenv("OTEL_EXPORTER_OTLP_METRICS_ENDPOINT", "http://localhost:9090")

    # No OTLP tracing endpoints set
    monkeypatch.delenv("OTEL_EXPORTER_OTLP_TRACES_ENDPOINT", raising=False)
    monkeypatch.delenv("OTEL_EXPORTER_OTLP_ENDPOINT", raising=False)

    mlflow.tracing.reset()
    tracer = _get_tracer("test")

    processors = tracer.span_processor._span_processors
    assert len(processors) == 1
    assert isinstance(processors[0], MlflowV3SpanProcessor)
    assert processors[0]._export_metrics is True
```

--------------------------------------------------------------------------------

---[FILE: test_trace_manager.py]---
Location: mlflow-master/tests/tracing/test_trace_manager.py

```python
import json
import time
from threading import Thread

from mlflow.entities import LiveSpan, Span
from mlflow.entities.model_registry.prompt_version import PromptVersion
from mlflow.entities.span_status import SpanStatusCode
from mlflow.tracing.constant import TraceTagKey
from mlflow.tracing.trace_manager import InMemoryTraceManager, ManagerTrace

from tests.tracing.helper import create_mock_otel_span, create_test_trace_info


def test_aggregator_singleton():
    obj1 = InMemoryTraceManager.get_instance()
    obj2 = InMemoryTraceManager.get_instance()
    assert obj1 is obj2


def test_add_spans():
    trace_manager = InMemoryTraceManager.get_instance()

    # Add a new trace info
    request_id_1 = "tr-1"
    trace_id_1 = 12345
    trace_manager.register_trace(trace_id_1, create_test_trace_info(request_id_1, "test_1"))

    # Add a span for a new trace
    span_1_1 = _create_test_span(request_id_1, trace_id_1, span_id=1)
    trace_manager.register_span(span_1_1)

    assert request_id_1 in trace_manager._traces
    assert len(trace_manager._traces[request_id_1].span_dict) == 1

    # Add more spans to the same trace
    span_1_1_1 = _create_test_span(request_id_1, trace_id_1, span_id=2, parent_id=1)
    span_1_1_2 = _create_test_span(request_id_1, trace_id_1, span_id=3, parent_id=1)
    trace_manager.register_span(span_1_1_1)
    trace_manager.register_span(span_1_1_2)

    assert len(trace_manager._traces[request_id_1].span_dict) == 3

    # Add a span for another trace under the different experiment
    request_id_2 = "tr-2"
    trace_id_2 = 67890
    trace_manager.register_trace(trace_id_2, create_test_trace_info(request_id_2, "test_2"))

    span_2_1 = _create_test_span(request_id_2, trace_id_2, span_id=1)
    span_2_1_1 = _create_test_span(request_id_2, trace_id_2, span_id=2, parent_id=1)
    trace_manager.register_span(span_2_1)
    trace_manager.register_span(span_2_1_1)

    assert request_id_2 in trace_manager._traces
    assert len(trace_manager._traces[request_id_2].span_dict) == 2

    # Pop the trace data
    manager_trace = trace_manager.pop_trace(trace_id_1)
    assert isinstance(manager_trace, ManagerTrace)
    assert manager_trace.trace.info.request_id == request_id_1
    assert len(manager_trace.trace.data.spans) == 3
    assert request_id_1 not in trace_manager._traces

    # Convert to MLflow trace to check immutable spans
    trace = manager_trace.trace
    assert isinstance(trace.data.spans[0], Span)
    assert not isinstance(trace.data.spans[0], LiveSpan)

    manager_trace = trace_manager.pop_trace(trace_id_2)
    assert isinstance(manager_trace, ManagerTrace)
    assert manager_trace.trace.info.request_id == request_id_2
    assert len(manager_trace.trace.data.spans) == 2
    assert request_id_2 not in trace_manager._traces

    # Pop a trace that does not exist
    assert trace_manager.pop_trace(90123) is None


def test_add_and_pop_span_thread_safety():
    trace_manager = InMemoryTraceManager.get_instance()

    # Add spans from 10 different threads to 5 different traces
    trace_ids = list(range(5))
    num_threads = 10

    for trace_id in trace_ids:
        trace_manager.register_trace(trace_id, create_test_trace_info(f"tr-{trace_id}", "test"))

    def add_spans(thread_id):
        for trace_id in trace_ids:
            trace_manager.register_span(
                _create_test_span(f"tr-{trace_id}", trace_id=trace_id, span_id=thread_id)
            )

    threads = [Thread(target=add_spans, args=[i]) for i in range(num_threads)]

    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()

    for trace_id in trace_ids:
        manager_trace = trace_manager.pop_trace(trace_id)
        assert manager_trace is not None
        assert manager_trace.trace.info.request_id == f"tr-{trace_id}"
        assert len(manager_trace.trace.data.spans) == num_threads


def test_traces_buffer_expires_after_ttl(monkeypatch):
    monkeypatch.setenv("MLFLOW_TRACE_BUFFER_TTL_SECONDS", "1")

    trace_manager = InMemoryTraceManager.get_instance()
    request_id_1 = "tr-1"
    trace_manager.register_trace(12345, create_test_trace_info(request_id_1, "test"))

    span_1_1 = _create_test_span(request_id_1)
    trace_manager.register_span(span_1_1)

    assert request_id_1 in trace_manager._traces
    assert len(trace_manager._traces[request_id_1].span_dict) == 1

    time.sleep(1)

    assert request_id_1 not in trace_manager._traces

    # Clear singleton instance again to avoid side effects to other tests
    InMemoryTraceManager._instance = None


def test_traces_buffer_expires_and_log_when_timeout_is_set(monkeypatch):
    # Setting MLFLOW_TRACE_TIMEOUT_SECONDS let MLflow to periodically check the
    # expired traces and log expired ones to the backend.
    monkeypatch.setenv("MLFLOW_TRACE_TIMEOUT_SECONDS", "1")
    monkeypatch.setenv("MLFLOW_TRACE_TTL_CHECK_INTERVAL_SECONDS", "1")

    trace_manager = InMemoryTraceManager.get_instance()
    request_id_1 = "tr-1"
    trace_info = create_test_trace_info(request_id_1, "test")
    trace_manager.register_trace(12345, trace_info)

    span_1_1 = _create_test_span(request_id_1)
    trace_manager.register_span(span_1_1)

    assert trace_manager._traces.get(request_id_1) is not None
    assert len(trace_manager._traces[request_id_1].span_dict) == 1

    assert request_id_1 in trace_manager._traces

    time.sleep(3)

    assert request_id_1 not in trace_manager._traces
    assert span_1_1.status.status_code == SpanStatusCode.ERROR


def test_traces_buffer_max_size_limit(monkeypatch):
    monkeypatch.setenv("MLFLOW_TRACE_BUFFER_MAX_SIZE", "1")

    trace_manager = InMemoryTraceManager.get_instance()
    request_id_1 = "tr-1"
    trace_manager.register_trace(12345, create_test_trace_info(request_id_1, "experiment"))

    span_1_1 = _create_test_span(request_id_1)
    trace_manager.register_span(span_1_1)

    assert request_id_1 in trace_manager._traces
    assert len(trace_manager._traces) == 1

    request_id_2 = "tr-2"
    trace_manager.register_trace(67890, create_test_trace_info(request_id_2, "experiment"))
    span_2_1 = _create_test_span(request_id_2)
    trace_manager.register_span(span_2_1)

    assert request_id_1 not in trace_manager._traces
    assert request_id_2 in trace_manager._traces
    assert len(trace_manager._traces) == 1

    # Clear singleton instance again to avoid side effects to other tests
    InMemoryTraceManager._instance = None


def test_get_span_from_id():
    trace_manager = InMemoryTraceManager.get_instance()
    request_id_1 = "tr-1"
    trace_manager.register_trace(12345, create_test_trace_info(request_id_1, "test"))
    span_1_1 = _create_test_span(request_id_1, trace_id=111, span_id=1)
    span_1_2 = _create_test_span(request_id_1, trace_id=111, span_id=2, parent_id=1)

    request_id_2 = "tr-2"
    trace_manager.register_trace(67890, create_test_trace_info(request_id_2, "test"))
    span_2_1 = _create_test_span(request_id_2, trace_id=222, span_id=1)
    span_2_2 = _create_test_span(request_id_2, trace_id=222, span_id=2, parent_id=1)

    # Add a span for a new trace
    trace_manager.register_span(span_1_1)
    trace_manager.register_span(span_1_2)
    trace_manager.register_span(span_2_1)
    trace_manager.register_span(span_2_2)

    assert trace_manager.get_span_from_id(request_id_1, span_1_1.span_id) == span_1_1
    assert trace_manager.get_span_from_id(request_id_2, span_2_2.span_id) == span_2_2


def test_get_root_span_id():
    trace_manager = InMemoryTraceManager.get_instance()

    request_id_1 = "tr-1"
    trace_manager.register_trace(12345, create_test_trace_info(request_id_1, "test"))
    span_1_1 = _create_test_span(request_id_1, span_id=1)
    span_1_2 = _create_test_span(request_id_1, span_id=2, parent_id=1)

    # Add a span for a new trace
    trace_manager.register_span(span_1_1)
    trace_manager.register_span(span_1_2)

    assert trace_manager.get_root_span_id(request_id_1) == span_1_1.span_id

    # Non-existing trace
    assert trace_manager.get_root_span_id("tr-2") is None


def test_register_prompt():
    prompt_version = PromptVersion(name="test_prompt", version=1, template="Test template")

    trace_manager = InMemoryTraceManager.get_instance()
    request_id_1 = "tr-1"
    trace_manager.register_trace(12345, create_test_trace_info(request_id_1, "test"))
    trace_manager.register_prompt(request_id_1, prompt_version)

    trace = trace_manager._traces[request_id_1]
    assert trace.prompts == [prompt_version]
    assert json.loads(trace.info.tags[TraceTagKey.LINKED_PROMPTS]) == [
        {"name": "test_prompt", "version": "1"}
    ]

    # Adding multiple prompts to the same trace
    prompt_version_2 = PromptVersion(name="test_prompt_2", version=2, template="Test template 2")

    trace_manager.register_prompt(request_id_1, prompt_version_2)
    assert trace.prompts == [prompt_version, prompt_version_2]
    assert json.loads(trace.info.tags[TraceTagKey.LINKED_PROMPTS]) == [
        {"name": "test_prompt", "version": "1"},
        {"name": "test_prompt_2", "version": "2"},
    ]

    # Registering the same prompt should not add it again
    trace_manager.register_prompt(request_id_1, prompt_version)
    assert trace.prompts == [prompt_version, prompt_version_2]
    assert json.loads(trace.info.tags[TraceTagKey.LINKED_PROMPTS]) == [
        {"name": "test_prompt", "version": "1"},
        {"name": "test_prompt_2", "version": "2"},
    ]


def test_register_prompt_thread_safety():
    trace_manager = InMemoryTraceManager.get_instance()
    request_id_1 = "tr-1"
    trace_manager.register_trace(12345, create_test_trace_info(request_id_1, "test"))
    prompt_versions = [
        PromptVersion(name=f"test_prompt_{i}", version=i, template=f"Test template {i}")
        for i in range(10)
    ]

    def register_prompt(prompt_version):
        trace_manager.register_prompt(request_id_1, prompt_version)

    threads = [Thread(target=register_prompt, args=[pv]) for pv in prompt_versions]
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()

    trace = trace_manager._traces[request_id_1]
    assert len(trace.prompts) == len(prompt_versions)
    assert len(json.loads(trace.info.tags[TraceTagKey.LINKED_PROMPTS])) == len(prompt_versions)


def _create_test_span(
    request_id="tr-12345",
    trace_id: int = 12345,
    span_id: int = 123,
    parent_id: int | None = None,
    start_time=None,
    end_time=None,
):
    mock_otel_span = create_mock_otel_span(
        trace_id=trace_id,
        span_id=span_id,
        parent_id=parent_id,
        start_time=start_time,
        end_time=end_time,
    )

    span = LiveSpan(mock_otel_span, request_id)
    span.set_status("OK")
    return span
```

--------------------------------------------------------------------------------

---[FILE: test_tracing_client.py]---
Location: mlflow-master/tests/tracing/test_tracing_client.py

```python
import json
import uuid
from unittest.mock import Mock, patch

import pytest
from opentelemetry import trace as trace_api
from opentelemetry.sdk.trace import ReadableSpan as OTelReadableSpan

import mlflow
from mlflow.entities.span import create_mlflow_span
from mlflow.environment_variables import MLFLOW_TRACING_SQL_WAREHOUSE_ID
from mlflow.exceptions import MlflowException
from mlflow.store.tracking import SEARCH_TRACES_DEFAULT_MAX_RESULTS
from mlflow.tracing.analysis import TraceFilterCorrelationResult
from mlflow.tracing.client import TracingClient
from mlflow.tracing.constant import SpansLocation, TraceMetadataKey, TraceSizeStatsKey, TraceTagKey
from mlflow.tracing.utils import TraceJSONEncoder

from tests.tracing.helper import skip_when_testing_trace_sdk


def test_get_trace_v4():
    mock_store = Mock()
    mock_store.batch_get_traces.return_value = ["dummy_trace"]

    with patch("mlflow.tracing.client._get_store", return_value=mock_store):
        client = TracingClient()
        trace = client.get_trace("trace:/catalog.schema/1234567890")

    assert trace == "dummy_trace"
    mock_store.batch_get_traces.assert_called_once_with(
        ["trace:/catalog.schema/1234567890"], "catalog.schema"
    )


def test_get_trace_v4_retry():
    mock_store = Mock()
    mock_store.batch_get_traces.side_effect = [[], ["dummy_trace"]]

    with patch("mlflow.tracing.client._get_store", return_value=mock_store):
        client = TracingClient()
        trace = client.get_trace("trace:/catalog.schema/1234567890")

    assert trace == "dummy_trace"
    assert mock_store.batch_get_traces.call_count == 2


@skip_when_testing_trace_sdk
def test_tracing_client_link_prompt_versions_to_trace():
    with mlflow.start_run():
        # Register a prompt
        prompt_version = mlflow.register_prompt(name="test_prompt", template="Hello, {{name}}!")

        # Create a trace
        with mlflow.start_span("test_span"):
            trace_id = mlflow.get_active_trace_id()

        # Link prompts to trace
        client = TracingClient()
        client.link_prompt_versions_to_trace(trace_id, [prompt_version])

        # Verify the linked prompts tag was set
        trace = mlflow.get_trace(trace_id)
        assert "mlflow.linkedPrompts" in trace.info.tags

        # Parse and verify the linked prompts
        linked_prompts = json.loads(trace.info.tags["mlflow.linkedPrompts"])
        assert len(linked_prompts) == 1
        assert linked_prompts[0]["name"] == "test_prompt"
        assert linked_prompts[0]["version"] == "1"


def test_tracing_client_calculate_trace_filter_correlation():
    mock_store = Mock()

    expected_result = TraceFilterCorrelationResult(
        npmi=0.456,
        npmi_smoothed=0.445,
        filter1_count=100,
        filter2_count=80,
        joint_count=50,
        total_count=200,
    )
    mock_store.calculate_trace_filter_correlation.return_value = expected_result

    with patch("mlflow.tracing.client._get_store", return_value=mock_store):
        client = TracingClient()

        result = client.calculate_trace_filter_correlation(
            experiment_ids=["123", "456"],
            filter_string1="span.type = 'LLM'",
            filter_string2="feedback.quality > 0.8",
            base_filter="request_time > 1000",
        )

        mock_store.calculate_trace_filter_correlation.assert_called_once_with(
            experiment_ids=["123", "456"],
            filter_string1="span.type = 'LLM'",
            filter_string2="feedback.quality > 0.8",
            base_filter="request_time > 1000",
        )

        assert result == expected_result
        assert result.npmi == 0.456
        assert result.npmi_smoothed == 0.445
        assert result.filter1_count == 100
        assert result.filter2_count == 80
        assert result.joint_count == 50
        assert result.total_count == 200


def test_tracing_client_calculate_trace_filter_correlation_without_base_filter():
    mock_store = Mock()

    expected_result = TraceFilterCorrelationResult(
        npmi=float("nan"),
        npmi_smoothed=None,
        filter1_count=0,
        filter2_count=0,
        joint_count=0,
        total_count=100,
    )
    mock_store.calculate_trace_filter_correlation.return_value = expected_result

    with patch("mlflow.tracing.client._get_store", return_value=mock_store):
        client = TracingClient()

        result = client.calculate_trace_filter_correlation(
            experiment_ids=["789"],
            filter_string1="error = true",
            filter_string2="duration > 5000",
        )

        mock_store.calculate_trace_filter_correlation.assert_called_once_with(
            experiment_ids=["789"],
            filter_string1="error = true",
            filter_string2="duration > 5000",
            base_filter=None,
        )

        assert result == expected_result
        assert result.filter1_count == 0
        assert result.filter2_count == 0
        assert result.joint_count == 0
        assert result.total_count == 100


@pytest.mark.parametrize("sql_warehouse_id", [None, "some-warehouse-id"])
def test_tracing_client_search_traces_with_model_id(monkeypatch, sql_warehouse_id: str | None):
    if sql_warehouse_id:
        monkeypatch.setenv(MLFLOW_TRACING_SQL_WAREHOUSE_ID.name, sql_warehouse_id)
    else:
        monkeypatch.delenv(MLFLOW_TRACING_SQL_WAREHOUSE_ID.name, raising=False)
    mock_store = Mock()
    mock_store.search_traces.return_value = ([], None)

    with patch("mlflow.tracing.client._get_store", return_value=mock_store):
        client = TracingClient()
        client.search_traces(model_id="model_id")

    mock_store.search_traces.assert_called_once_with(
        experiment_ids=None,
        filter_string="request_metadata.`mlflow.modelId` = 'model_id'"
        if sql_warehouse_id is None
        else None,
        max_results=SEARCH_TRACES_DEFAULT_MAX_RESULTS,
        order_by=None,
        page_token=None,
        model_id="model_id" if sql_warehouse_id else None,
        locations=None,
    )


@skip_when_testing_trace_sdk
def test_tracing_client_get_trace_with_database_stored_spans():
    client = TracingClient()

    experiment_id = mlflow.create_experiment("test")
    trace_id = f"tr-{uuid.uuid4().hex}"

    store = client.store

    otel_span = OTelReadableSpan(
        name="test_span",
        context=trace_api.SpanContext(
            trace_id=12345,
            span_id=111,
            is_remote=False,
            trace_flags=trace_api.TraceFlags(1),
        ),
        parent=None,
        attributes={
            "mlflow.traceRequestId": json.dumps(trace_id, cls=TraceJSONEncoder),
            "llm.model_name": "test-model",
            "custom.attribute": "test-value",
        },
        start_time=1_000_000_000,
        end_time=2_000_000_000,
        resource=None,
    )

    span = create_mlflow_span(otel_span, trace_id, "LLM")

    store.log_spans(experiment_id, [span])

    trace = client.get_trace(trace_id)

    assert trace.info.trace_id == trace_id
    assert trace.info.tags.get(TraceTagKey.SPANS_LOCATION) == SpansLocation.TRACKING_STORE

    assert len(trace.data.spans) == 1
    loaded_span = trace.data.spans[0]

    assert loaded_span.name == "test_span"
    assert loaded_span.trace_id == trace_id
    assert loaded_span.start_time_ns == 1_000_000_000
    assert loaded_span.end_time_ns == 2_000_000_000
    assert loaded_span.attributes.get("llm.model_name") == "test-model"
    assert loaded_span.attributes.get("custom.attribute") == "test-value"


@skip_when_testing_trace_sdk
def test_tracing_client_get_trace_error_handling():
    client = TracingClient()

    experiment_id = mlflow.create_experiment("test")
    trace_id = f"tr-{uuid.uuid4().hex}"

    store = client.store

    otel_span = OTelReadableSpan(
        name="test_span",
        context=trace_api.SpanContext(
            trace_id=12345,
            span_id=111,
            is_remote=False,
            trace_flags=trace_api.TraceFlags(1),
        ),
        parent=None,
        attributes={
            "mlflow.traceRequestId": json.dumps(trace_id, cls=TraceJSONEncoder),
            "llm.model_name": "test-model",
            "custom.attribute": "test-value",
        },
        start_time=1_000_000_000,
        end_time=2_000_000_000,
        resource=None,
    )

    span = create_mlflow_span(otel_span, trace_id, "LLM")

    store.log_spans(experiment_id, [span])
    trace = client.get_trace(trace_id)
    trace_info = trace.info
    trace_info.trace_metadata[TraceMetadataKey.SIZE_STATS] = json.dumps(
        {TraceSizeStatsKey.NUM_SPANS: 2}
    )
    store.start_trace(trace_info)

    with pytest.raises(
        MlflowException, match=rf"Trace with ID {trace_id} is not fully exported yet"
    ):
        client.get_trace(trace_id)
```

--------------------------------------------------------------------------------

````
