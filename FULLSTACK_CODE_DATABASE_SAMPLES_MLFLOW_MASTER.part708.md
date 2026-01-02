---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 708
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 708 of 991)

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

---[FILE: base_mlflow.py]---
Location: mlflow-master/mlflow/tracing/processor/base_mlflow.py

```python
import json
import logging
import threading
from typing import Any

from opentelemetry.context import Context
from opentelemetry.sdk.trace import ReadableSpan as OTelReadableSpan
from opentelemetry.sdk.trace import Span as OTelSpan
from opentelemetry.sdk.trace.export import SimpleSpanProcessor, SpanExporter

from mlflow.entities.span import create_mlflow_span
from mlflow.entities.trace_info import TraceInfo
from mlflow.tracing.constant import (
    MAX_CHARS_IN_TRACE_INFO_METADATA,
    TRACE_SCHEMA_VERSION,
    TRACE_SCHEMA_VERSION_KEY,
    TRUNCATION_SUFFIX,
    SpanAttributeKey,
    TraceMetadataKey,
    TraceTagKey,
)
from mlflow.tracing.processor.otel_metrics_mixin import OtelMetricsMixin
from mlflow.tracing.trace_manager import InMemoryTraceManager, _Trace
from mlflow.tracing.utils import (
    aggregate_usage_from_spans,
    get_otel_attribute,
    maybe_get_dependencies_schemas,
    maybe_get_logged_model_id,
    maybe_get_request_id,
    update_trace_state_from_span_conditionally,
)
from mlflow.tracing.utils.environment import resolve_env_metadata
from mlflow.tracking.fluent import (
    _get_active_model_id_global,
    _get_latest_active_run,
)

_logger = logging.getLogger(__name__)


class BaseMlflowSpanProcessor(OtelMetricsMixin, SimpleSpanProcessor):
    """
    Defines custom hooks to be executed when a span is started or ended (before exporting).

    """

    def __init__(
        self,
        span_exporter: SpanExporter,
        export_metrics: bool,
    ):
        super().__init__(span_exporter)
        self.span_exporter = span_exporter
        self._export_metrics = export_metrics
        self._env_metadata = resolve_env_metadata()
        # Lock to prevent race conditions during concurrent span name deduplication
        # This ensures that when multiple spans end simultaneously, their names are
        # deduplicated atomically without interference
        self._deduplication_lock = threading.RLock()

    def on_start(self, span: OTelSpan, parent_context: Context | None = None):
        """
        Handle the start of a span. This method is called when an OpenTelemetry span is started.

        Args:
            span: An OpenTelemetry Span object that is started.
            parent_context: The context of the span. Note that this is only passed when the context
                object is explicitly specified to OpenTelemetry start_span call. If the parent span
                is obtained from the global context, it won't be passed here so we should not rely
                on it.
        """
        trace_id = self._trace_manager.get_mlflow_trace_id_from_otel_id(span.context.trace_id)

        if not trace_id and span.parent is not None:
            _logger.debug(
                "Received a non-root span but the trace ID is not found."
                "The trace has likely been halted due to a timeout expiration."
            )
            return

        if span.parent is None:
            trace_info = self._start_trace(span)
            if trace_info is None:
                return
            trace_id = trace_info.trace_id

        InMemoryTraceManager.get_instance().register_span(create_mlflow_span(span, trace_id))

    def _start_trace(self, root_span: OTelSpan) -> TraceInfo:
        raise NotImplementedError("Subclasses must implement this method.")

    def on_end(self, span: OTelReadableSpan) -> None:
        """
        Handle the end of a span. This method is called when an OpenTelemetry span is ended.

        Args:
            span: An OpenTelemetry ReadableSpan object that is ended.
        """
        if self._export_metrics:
            self.record_metrics_for_span(span)

        trace_id = get_otel_attribute(span, SpanAttributeKey.REQUEST_ID)

        # Acquire lock before accessing and modifying trace data to prevent race conditions
        # during concurrent span endings. This ensures span name deduplication happens
        # atomically without interference from other threads
        with self._deduplication_lock:
            with self._trace_manager.get_trace(trace_id) as trace:
                if trace is not None:
                    if span._parent is None:
                        self._update_trace_info(trace, span)
                else:
                    _logger.debug(f"Trace data with request ID {trace_id} not found.")
        super().on_end(span)

    def _get_basic_trace_metadata(self) -> dict[str, Any]:
        metadata = self._env_metadata.copy()

        metadata[TRACE_SCHEMA_VERSION_KEY] = str(TRACE_SCHEMA_VERSION)

        # If the span is started within an active MLflow run, we should record it as a trace tag
        # Note `mlflow.active_run()` can only get thread-local active run,
        # but tracing routine might be applied to model inference worker threads
        # in the following cases:
        #  - langchain model `chain.batch` which uses thread pool to spawn workers.
        #  - MLflow langchain pyfunc model `predict` which calls `api_request_parallel_processor`.
        # Therefore, we use `_get_global_active_run()` instead to get the active run from
        # all threads and set it as the tracing source run.
        if run := _get_latest_active_run():
            metadata[TraceMetadataKey.SOURCE_RUN] = run.info.run_id

        # The order is:
        # 1. model_id of the current active model set by `set_active_model`
        # 2. model_id from the current prediction context
        #   (set by mlflow pyfunc predict, or explicitly using set_prediction_context)
        if active_model_id := _get_active_model_id_global():
            metadata[TraceMetadataKey.MODEL_ID] = active_model_id
        elif model_id := maybe_get_logged_model_id():
            metadata[TraceMetadataKey.MODEL_ID] = model_id

        return metadata

    def _get_basic_trace_tags(self, span: OTelReadableSpan) -> dict[str, Any]:
        # If the trace is created in the context of MLflow model evaluation, we extract the request
        # ID from the prediction context. Otherwise, we create a new trace info by calling the
        # backend API.
        tags = {}
        if request_id := maybe_get_request_id(is_evaluate=True):
            tags.update({TraceTagKey.EVAL_REQUEST_ID: request_id})
        if dependencies_schema := maybe_get_dependencies_schemas():
            tags.update(dependencies_schema)
        tags.update({TraceTagKey.TRACE_NAME: span.name})
        return tags

    def _update_trace_info(self, trace: _Trace, root_span: OTelReadableSpan):
        """Update the trace info with the final values from the root span."""
        # The trace/span start time needs adjustment to exclude the latency of
        # the backend API call. We already adjusted the span start time in the
        # on_start method, so we reflect the same to the trace start time here.
        trace.info.request_time = root_span.start_time // 1_000_000  # nanosecond to millisecond
        trace.info.execution_duration = (root_span.end_time - root_span.start_time) // 1_000_000

        # Update trace state from span status, but only if the user hasn't explicitly set
        # a different trace status
        update_trace_state_from_span_conditionally(trace, root_span)

        # TODO: Remove this once the new trace table UI is available that is based on V3 trace.
        # Until then, these two are still used to render the "request" and "response" columns.
        trace.info.trace_metadata.update(
            {
                TraceMetadataKey.INPUTS: self._truncate_metadata(
                    root_span.attributes.get(SpanAttributeKey.INPUTS)
                ),
                TraceMetadataKey.OUTPUTS: self._truncate_metadata(
                    root_span.attributes.get(SpanAttributeKey.OUTPUTS)
                ),
            }
        )

        # Aggregate token usage information from all spans
        if usage := aggregate_usage_from_spans(trace.span_dict.values()):
            trace.info.request_metadata[TraceMetadataKey.TOKEN_USAGE] = json.dumps(usage)

    def _truncate_metadata(self, value: str | None) -> str:
        """Get truncated value of the attribute if it exceeds the maximum length."""
        if not value:
            return ""

        if len(value) > MAX_CHARS_IN_TRACE_INFO_METADATA:
            trunc_length = MAX_CHARS_IN_TRACE_INFO_METADATA - len(TRUNCATION_SUFFIX)
            value = value[:trunc_length] + TRUNCATION_SUFFIX
        return value
```

--------------------------------------------------------------------------------

---[FILE: inference_table.py]---
Location: mlflow-master/mlflow/tracing/processor/inference_table.py
Signals: Flask

```python
import json
import logging

from opentelemetry.context import Context
from opentelemetry.sdk.trace import ReadableSpan as OTelReadableSpan
from opentelemetry.sdk.trace import Span as OTelSpan
from opentelemetry.sdk.trace.export import SimpleSpanProcessor, SpanExporter

from mlflow.entities.span import create_mlflow_span
from mlflow.entities.trace_info import TraceInfo
from mlflow.entities.trace_location import TraceLocation
from mlflow.entities.trace_state import TraceState
from mlflow.environment_variables import MLFLOW_EXPERIMENT_ID
from mlflow.tracing.constant import (
    TRACE_SCHEMA_VERSION,
    TRACE_SCHEMA_VERSION_KEY,
    SpanAttributeKey,
    TraceMetadataKey,
)
from mlflow.tracing.trace_manager import InMemoryTraceManager
from mlflow.tracing.utils import (
    _try_get_prediction_context,
    aggregate_usage_from_spans,
    generate_trace_id_v3,
    get_otel_attribute,
    maybe_get_dependencies_schemas,
    maybe_get_request_id,
    update_trace_state_from_span_conditionally,
)
from mlflow.utils.mlflow_tags import MLFLOW_DATABRICKS_MODEL_SERVING_ENDPOINT_NAME

_logger = logging.getLogger(__name__)


_HEADER_REQUEST_ID_KEY = "X-Request-Id"


# Extracting for testing purposes
def _get_flask_request():
    import flask

    if flask.has_request_context():
        return flask.request


class InferenceTableSpanProcessor(SimpleSpanProcessor):
    """
    Defines custom hooks to be executed when a span is started or ended (before exporting).

    This processor is used when the tracing destination is Databricks Inference Table.
    """

    def __init__(self, span_exporter: SpanExporter):
        self.span_exporter = span_exporter
        self._trace_manager = InMemoryTraceManager.get_instance()

    def on_start(self, span: OTelSpan, parent_context: Context | None = None):
        """
        Handle the start of a span. This method is called when an OpenTelemetry span is started.

        Args:
            span: An OpenTelemetry Span object that is started.
            parent_context: The context of the span. Note that this is only passed when the context
                object is explicitly specified to OpenTelemetry start_span call. If the parent
                span is obtained from the global context, it won't be passed here so we should not
                rely on it.
        """
        databricks_request_id = maybe_get_request_id()
        if databricks_request_id is None:
            # NB: This is currently used for streaming inference in Databricks Model Serving.
            # In normal prediction, serving logic pass the request ID using the
            # `with set_prediction_context` context manager that wraps `model.predict`
            # call. However, in streaming case, the context manager is not applicable
            # so we still need to rely on Flask request context (which is set to the
            # stream response via flask.stream_with_context()
            if flask_request := _get_flask_request():
                databricks_request_id = flask_request.headers.get(_HEADER_REQUEST_ID_KEY)
                if not databricks_request_id:
                    _logger.warning(
                        "Databricks request ID not found in the request headers. "
                        "Skipping trace processing."
                    )
                    return
            else:
                _logger.warning(
                    "Failed to get Databricks request ID from the request headers because "
                    "request context is not available. Skipping trace processing."
                )
                return

        trace_id = generate_trace_id_v3(span)
        span.set_attribute(SpanAttributeKey.REQUEST_ID, json.dumps(trace_id))
        tags = {}
        if dependencies_schema := maybe_get_dependencies_schemas():
            tags.update(dependencies_schema)

        if span._parent is None:
            trace_info = TraceInfo(
                trace_id=trace_id,
                client_request_id=databricks_request_id,
                # NB: Agent framework populate the MLFLOW_EXPERIMENT_ID environment variable
                #   with the experiment ID to which the model is logged. We don't use the
                #   _get_experiment_id() method because it will fallback to the default
                #   experiment if the MLFLOW_EXPERIMENT_ID is not set.
                trace_location=TraceLocation.from_experiment_id(MLFLOW_EXPERIMENT_ID.get()),
                request_time=span.start_time // 1_000_000,  # nanosecond to millisecond
                execution_duration=None,
                state=TraceState.IN_PROGRESS,
                trace_metadata=self._get_trace_metadata(),
                tags=tags,
            )
            self._trace_manager.register_trace(span.context.trace_id, trace_info)

        self._trace_manager.register_span(create_mlflow_span(span, trace_id))

    def on_end(self, span: OTelReadableSpan) -> None:
        """
        Handle the end of a span. This method is called when an OpenTelemetry span is ended.

        Args:
            span: An OpenTelemetry ReadableSpan object that is ended.
        """
        # Processing the trace only when the root span is found.
        if span._parent is not None:
            return

        trace_id = get_otel_attribute(span, SpanAttributeKey.REQUEST_ID)
        with self._trace_manager.get_trace(trace_id) as trace:
            if trace is None:
                _logger.debug(f"Trace data with trace ID {trace_id} not found.")
                return

            trace.info.execution_duration = (span.end_time - span.start_time) // 1_000_000

            # Update trace state from span status, but only if the user hasn't explicitly set
            # a different trace status
            update_trace_state_from_span_conditionally(trace, span)

            spans = list(trace.span_dict.values())

            # Aggregate token usage information from all spans
            if usage := aggregate_usage_from_spans(spans):
                trace.info.request_metadata[TraceMetadataKey.TOKEN_USAGE] = json.dumps(usage)

        super().on_end(span)

    def _get_trace_metadata(self) -> dict[str, str]:
        metadata = {TRACE_SCHEMA_VERSION_KEY: str(TRACE_SCHEMA_VERSION)}

        context = _try_get_prediction_context()
        if context:
            metadata[MLFLOW_DATABRICKS_MODEL_SERVING_ENDPOINT_NAME] = context.endpoint_name or ""

        # The model ID fetch order is
        # 1. from the context, this could be set by databricks serving
        # 2. from the active model, this could be set by model loading or with environment variable
        if context and context.model_id:
            metadata[TraceMetadataKey.MODEL_ID] = context.model_id
            _logger.debug(f"Model id fetched from the context: {context.model_id}")
        else:
            try:
                from mlflow.tracking.fluent import _get_active_model_id_global

                if active_model_id := _get_active_model_id_global():
                    metadata[TraceMetadataKey.MODEL_ID] = active_model_id
                    _logger.debug(
                        f"Adding active model ID {active_model_id} to the trace metadata."
                    )
            except Exception as e:
                _logger.debug(
                    f"Failed to get model ID from the active model: {e}. "
                    "Skipping adding model ID to trace metadata.",
                    exc_info=True,
                )
        return metadata
```

--------------------------------------------------------------------------------

---[FILE: mlflow_v3.py]---
Location: mlflow-master/mlflow/tracing/processor/mlflow_v3.py

```python
import logging

from opentelemetry.sdk.trace import Span as OTelSpan
from opentelemetry.sdk.trace.export import SpanExporter

from mlflow.entities.trace_info import TraceInfo
from mlflow.entities.trace_location import TraceLocation
from mlflow.entities.trace_state import TraceState
from mlflow.tracing.processor.base_mlflow import BaseMlflowSpanProcessor
from mlflow.tracing.utils import generate_trace_id_v3, get_experiment_id_for_trace

_logger = logging.getLogger(__name__)


class MlflowV3SpanProcessor(BaseMlflowSpanProcessor):
    """
    Defines custom hooks to be executed when a span is started or ended (before exporting).

    This processor is used for exporting traces to MLflow Tracking Server
    using the V3 trace schema and API.
    """

    def __init__(
        self,
        span_exporter: SpanExporter,
        export_metrics: bool,
    ):
        super().__init__(span_exporter, export_metrics)

    def _start_trace(self, root_span: OTelSpan) -> TraceInfo:
        """
        Create a new TraceInfo object and register it with the trace manager.

        This method is called in the on_start method of the base class.
        """
        experiment_id = get_experiment_id_for_trace(root_span)
        if experiment_id is None:
            _logger.debug(
                "Experiment ID is not set for trace. It may not be exported to MLflow backend."
            )

        trace_info = TraceInfo(
            trace_id=generate_trace_id_v3(root_span),
            trace_location=TraceLocation.from_experiment_id(experiment_id),
            request_time=root_span.start_time // 1_000_000,  # nanosecond to millisecond
            execution_duration=None,
            state=TraceState.IN_PROGRESS,
            trace_metadata=self._get_basic_trace_metadata(),
            tags=self._get_basic_trace_tags(root_span),
        )
        self._trace_manager.register_trace(root_span.context.trace_id, trace_info)
        return trace_info
```

--------------------------------------------------------------------------------

---[FILE: otel.py]---
Location: mlflow-master/mlflow/tracing/processor/otel.py

```python
from opentelemetry.sdk.trace import ReadableSpan as OTelReadableSpan
from opentelemetry.sdk.trace.export import BatchSpanProcessor, SpanExporter

from mlflow.entities.span import create_mlflow_span
from mlflow.entities.trace_info import TraceInfo, TraceLocation, TraceState
from mlflow.environment_variables import MLFLOW_TRACE_ENABLE_OTLP_DUAL_EXPORT
from mlflow.tracing.constant import TRACE_SCHEMA_VERSION, TRACE_SCHEMA_VERSION_KEY
from mlflow.tracing.processor.otel_metrics_mixin import OtelMetricsMixin
from mlflow.tracing.trace_manager import InMemoryTraceManager
from mlflow.tracing.utils import generate_trace_id_v3


class OtelSpanProcessor(OtelMetricsMixin, BatchSpanProcessor):
    """
    SpanProcessor implementation to export MLflow traces to a OpenTelemetry collector.

    Extending OpenTelemetry BatchSpanProcessor to add some custom hooks to be executed when a span
    is started or ended (before exporting).
    """

    def __init__(self, span_exporter: SpanExporter, export_metrics: bool) -> None:
        super().__init__(span_exporter)
        self._export_metrics = export_metrics
        # In opentelemetry-sdk 1.34.0, the `span_exporter` field was removed from the
        # `BatchSpanProcessor` class.
        # https://github.com/open-telemetry/opentelemetry-python/issues/4616
        #
        # The `span_exporter` field was restored as a property in 1.34.1
        # https://github.com/open-telemetry/opentelemetry-python/pull/4621
        #
        # We use a try-except block to maintain compatibility with both versions.
        try:
            self.span_exporter = span_exporter
        except AttributeError:
            pass

        # Only register traces with trace manager when NOT in dual export mode
        # In dual export mode, MLflow span processors handle trace registration
        self._should_register_traces = not MLFLOW_TRACE_ENABLE_OTLP_DUAL_EXPORT.get()
        if self._should_register_traces:
            self._trace_manager = InMemoryTraceManager.get_instance()

    def on_start(self, span: OTelReadableSpan, parent_context=None):
        if self._should_register_traces:
            if not span.parent:
                trace_info = self._create_trace_info(span)
                trace_id = trace_info.trace_id
                self._trace_manager.register_trace(span.context.trace_id, trace_info)
            else:
                trace_id = self._trace_manager.get_mlflow_trace_id_from_otel_id(
                    span.context.trace_id
                )
            self._trace_manager.register_span(create_mlflow_span(span, trace_id))

        super().on_start(span, parent_context)

    def on_end(self, span: OTelReadableSpan):
        if self._export_metrics:
            self.record_metrics_for_span(span)

        if self._should_register_traces and not span.parent:
            self._trace_manager.pop_trace(span.context.trace_id)

        super().on_end(span)

    def _create_trace_info(self, span: OTelReadableSpan) -> TraceInfo:
        """Create a TraceInfo object from an OpenTelemetry span."""
        return TraceInfo(
            trace_id=generate_trace_id_v3(span),
            trace_location=TraceLocation.from_experiment_id(None),
            request_time=span.start_time // 1_000_000,  # nanosecond to millisecond
            execution_duration=None,
            state=TraceState.IN_PROGRESS,
            trace_metadata={TRACE_SCHEMA_VERSION_KEY: str(TRACE_SCHEMA_VERSION)},
            tags={},
        )
```

--------------------------------------------------------------------------------

---[FILE: otel_metrics_mixin.py]---
Location: mlflow-master/mlflow/tracing/processor/otel_metrics_mixin.py

```python
"""
Mixin class for OpenTelemetry span processors that provides metrics recording functionality.

This mixin allows different span processor implementations to share common metrics logic
while maintaining their own inheritance hierarchies (BatchSpanProcessor, SimpleSpanProcessor).
"""

import json
import logging
from typing import Any

from opentelemetry import metrics
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
from opentelemetry.sdk.trace import ReadableSpan as OTelReadableSpan

from mlflow.entities.span import SpanType
from mlflow.tracing.constant import SpanAttributeKey
from mlflow.tracing.trace_manager import InMemoryTraceManager
from mlflow.tracing.utils import get_experiment_id_for_trace
from mlflow.tracing.utils.otlp import _get_otlp_metrics_endpoint, _get_otlp_metrics_protocol

_logger = logging.getLogger(__name__)


class OtelMetricsMixin:
    """
    Mixin class that provides metrics recording capabilities for span processors.

    This mixin is designed to be used with OpenTelemetry span processors to record
    span-related metrics (e.g. duration) and metadata.
    """

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        """Initialize the mixin and pass through to parent classes."""
        super().__init__(*args, **kwargs)
        self._duration_histogram = None
        self._trace_manager = InMemoryTraceManager.get_instance()

    def _setup_metrics_if_necessary(self) -> None:
        """
        Set up OpenTelemetry metrics if not already configured previously.
        """
        if self._duration_histogram is not None:
            return

        endpoint = _get_otlp_metrics_endpoint()
        if not endpoint:
            return

        protocol = _get_otlp_metrics_protocol()
        if protocol == "grpc":
            from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import (
                OTLPMetricExporter,
            )
        elif protocol == "http/protobuf":
            from opentelemetry.exporter.otlp.proto.http.metric_exporter import (
                OTLPMetricExporter,
            )
        else:
            _logger.warning(
                f"Unsupported OTLP metrics protocol '{protocol}'. "
                "Supported protocols are 'grpc' and 'http/protobuf'. "
                "Metrics export will be skipped."
            )
            return

        metric_exporter = OTLPMetricExporter(endpoint=endpoint)
        reader = PeriodicExportingMetricReader(metric_exporter)
        provider = MeterProvider(metric_readers=[reader])
        metrics.set_meter_provider(provider)
        meter = metrics.get_meter("mlflow.tracing")
        self._duration_histogram = meter.create_histogram(
            name="mlflow.trace.span.duration",
            description="Duration of spans in milliseconds",
            unit="ms",
        )

    def record_metrics_for_span(self, span: OTelReadableSpan) -> None:
        """
        Record metrics for a completed span.

        This method should be called at the beginning of the on_end() method
        to record span duration and associated metadata.

        Args:
            span: The completed OpenTelemetry span to record metrics for.
        """
        self._setup_metrics_if_necessary()

        if self._duration_histogram is None:
            return

        span_type = span.attributes.get(SpanAttributeKey.SPAN_TYPE, SpanType.UNKNOWN)
        try:
            # Span attributes are JSON encoded by default; decode them for metric label readability
            span_type = json.loads(span_type)
        except (json.JSONDecodeError, TypeError):
            pass

        attributes = {
            "root": span.parent is None,
            "span_type": span_type,
            "span_status": span.status.status_code.name if span.status else "UNSET",
            "experiment_id": get_experiment_id_for_trace(span),
        }

        # Add trace tags and metadata if trace is available
        # Get MLflow trace ID from OpenTelemetry trace ID
        mlflow_trace_id = self._trace_manager.get_mlflow_trace_id_from_otel_id(
            span.context.trace_id
        )
        if mlflow_trace_id is not None:
            with self._trace_manager.get_trace(mlflow_trace_id) as trace:
                if trace is not None:
                    for key, value in trace.info.tags.items():
                        attributes[f"tags.{key}"] = str(value)
                    if trace.info.trace_metadata:
                        for meta_key, meta_value in trace.info.trace_metadata.items():
                            attributes[f"metadata.{meta_key}"] = str(meta_value)

        self._duration_histogram.record(
            amount=(span.end_time - span.start_time) / 1e6, attributes=attributes
        )
```

--------------------------------------------------------------------------------

---[FILE: uc_table.py]---
Location: mlflow-master/mlflow/tracing/processor/uc_table.py

```python
import logging

from opentelemetry.sdk.trace import Span as OTelSpan
from opentelemetry.sdk.trace.export import SpanExporter

from mlflow.entities.trace_info import TraceInfo
from mlflow.entities.trace_location import TraceLocation
from mlflow.entities.trace_state import TraceState
from mlflow.exceptions import MlflowException
from mlflow.tracing.constant import TRACE_SCHEMA_VERSION_KEY
from mlflow.tracing.processor.base_mlflow import BaseMlflowSpanProcessor
from mlflow.tracing.utils import (
    generate_trace_id_v4,
    get_active_spans_table_name,
)

_logger = logging.getLogger(__name__)


class DatabricksUCTableSpanProcessor(BaseMlflowSpanProcessor):
    """
    Defines custom hooks to be executed when a span is started or ended (before exporting).

    This processor is used for exporting traces to Databricks Unity Catalog table.
    """

    def __init__(self, span_exporter: SpanExporter):
        # metrics export is not supported for UC table yet
        super().__init__(span_exporter, export_metrics=False)

    def _start_trace(self, root_span: OTelSpan) -> TraceInfo:
        """
        Create a new TraceInfo object and register it with the trace manager.

        This method is called in the on_start method of the base class.
        """
        if uc_spans_table_name := get_active_spans_table_name():
            catalog_name, schema_name, spans_table_name = uc_spans_table_name.split(".")
            trace_location = TraceLocation.from_databricks_uc_schema(catalog_name, schema_name)
            trace_location.uc_schema._otel_spans_table_name = spans_table_name
            trace_id = generate_trace_id_v4(root_span, trace_location.uc_schema.schema_location)
        else:
            raise MlflowException(
                "Unity Catalog spans table name is not set for trace. It can not be exported to "
                "Databricks Unity Catalog table."
            )

        metadata = self._get_basic_trace_metadata()
        # Override the schema version to 4 for UC table
        metadata[TRACE_SCHEMA_VERSION_KEY] = "4"

        trace_info = TraceInfo(
            trace_id=trace_id,
            trace_location=trace_location,
            request_time=root_span.start_time // 1_000_000,  # nanosecond to millisecond
            execution_duration=None,
            state=TraceState.IN_PROGRESS,
            trace_metadata=metadata,
            tags=self._get_basic_trace_tags(root_span),
        )
        self._trace_manager.register_trace(root_span.context.trace_id, trace_info)

        return trace_info
```

--------------------------------------------------------------------------------

---[FILE: artifact_utils.py]---
Location: mlflow-master/mlflow/tracing/utils/artifact_utils.py

```python
from mlflow.entities.trace_info import TraceInfo
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INTERNAL_ERROR
from mlflow.utils.mlflow_tags import MLFLOW_ARTIFACT_LOCATION

TRACE_DATA_FILE_NAME = "traces.json"


def get_artifact_uri_for_trace(trace_info: TraceInfo):
    """
    Get the artifact uri for accessing the trace data.

    The artifact root is specified in the trace tags, which is
    set when logging the trace in the backend.

    Args:
        trace_info: Either a TraceInfo or TraceInfoV3 object containing trace metadata.

    Returns:
        The artifact URI string for the trace data.
    """
    # Both TraceInfo and TraceInfoV3 access tags the same way
    if MLFLOW_ARTIFACT_LOCATION not in trace_info.tags:
        raise MlflowException(
            "Unable to determine trace artifact location.",
            error_code=INTERNAL_ERROR,
        )
    return trace_info.tags[MLFLOW_ARTIFACT_LOCATION]
```

--------------------------------------------------------------------------------

---[FILE: copy.py]---
Location: mlflow-master/mlflow/tracing/utils/copy.py

```python
from typing import Any

from mlflow.entities.span import LiveSpan, Span
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_STATE
from mlflow.tracing.trace_manager import InMemoryTraceManager


def copy_trace_to_experiment(trace_dict: dict[str, Any], experiment_id: str | None = None) -> str:
    """
    Copy the given trace to the current experiment.
    The copied trace will have a new trace ID and location metadata.

    Args:
        trace_dict: The trace dictionary returned from model serving endpoint.
            This can be either V2 or V3 trace.
        experiment_id: The ID of the experiment to copy the trace to.
            If not provided, the trace will be copied to the current experiment.
    """
    new_trace_id = None
    new_root_span = None
    trace_manager = InMemoryTraceManager.get_instance()
    spans = [Span.from_dict(span_dict) for span_dict in trace_dict["data"]["spans"]]

    # Create a copy of spans in the current experiment
    for old_span in spans:
        new_span = LiveSpan.from_immutable_span(
            span=old_span,
            parent_span_id=old_span.parent_id,
            trace_id=new_trace_id,
            # Only set the experiment ID for the root span.
            experiment_id=experiment_id if old_span.parent_id is None else None,
        )
        # we need to register the span to trace manager first before ending it
        # otherwise the span will not be correctly exported
        trace_manager.register_span(new_span)
        if old_span.parent_id is None:
            new_root_span = new_span
            new_trace_id = new_span.trace_id
        else:
            new_span.end(end_time_ns=old_span.end_time_ns)

    if new_trace_id is None:
        raise MlflowException(
            "Root span not found in the trace. Perhaps the trace data is corrupted.",
            error_code=INVALID_STATE,
        )

    if info := trace_dict.get("info"):
        with trace_manager.get_trace(trace_id=new_trace_id) as trace:
            # Copy user tags (excluding mlflow internal tags)
            if all_tags := info.get("tags"):
                if user_tags := {k: v for k, v in all_tags.items() if not k.startswith("mlflow.")}:
                    trace.info.tags.update(user_tags)

            # Copy trace metadata
            if trace_metadata := info.get("trace_metadata"):
                trace.info.trace_metadata.update(trace_metadata)

    # Close the root span triggers the trace export.
    new_root_span.end(end_time_ns=spans[0].end_time_ns)
    return new_trace_id
```

--------------------------------------------------------------------------------

---[FILE: environment.py]---
Location: mlflow-master/mlflow/tracing/utils/environment.py

```python
import logging
import os
from functools import lru_cache

from mlflow.tracking.context.git_context import GitRunContext
from mlflow.tracking.context.registry import resolve_tags
from mlflow.utils.databricks_utils import is_in_databricks_notebook
from mlflow.utils.git_utils import get_git_branch, get_git_commit, get_git_repo_url
from mlflow.utils.mlflow_tags import (
    MLFLOW_GIT_BRANCH,
    MLFLOW_GIT_COMMIT,
    MLFLOW_GIT_REPO_URL,
    TRACE_RESOLVE_TAGS_ALLOWLIST,
)

_logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def resolve_env_metadata():
    """
    Resolve common environment metadata to be saved in the trace info. These should not
    # change over time, so we resolve them only once. These will be stored in trace
    # metadata rather than tags, because they are immutable.
    """
    # GitRunContext does not property work in notebook because _get_main_file()
    # points to the kernel launcher file, not the actual notebook file.
    metadata = resolve_tags(ignore=[GitRunContext])
    if not is_in_databricks_notebook():
        # Get Git metadata for the script or notebook. If the notebook is in a
        # Databricks managed Git repo, DatabricksRepoRunContext the metadata
        # so we don't need to run this logic.
        metadata.update(_resolve_git_metadata())

    return {key: value for key, value in metadata.items() if key in TRACE_RESOLVE_TAGS_ALLOWLIST}


def _resolve_git_metadata():
    try:
        import git  # noqa: F401
    except ImportError:
        _logger.debug("Git python package is not installed. Skipping git metadata resolution.")
        return {}

    try:
        repo = os.getcwd()
        return {
            MLFLOW_GIT_COMMIT: get_git_commit(repo) or "",
            MLFLOW_GIT_REPO_URL: get_git_repo_url(repo) or "",
            MLFLOW_GIT_BRANCH: get_git_branch(repo) or "",
        }
    except Exception:
        _logger.debug("Failed to resolve git metadata", exc_info=True)

    return {}
```

--------------------------------------------------------------------------------

---[FILE: exception.py]---
Location: mlflow-master/mlflow/tracing/utils/exception.py

```python
import functools

from mlflow.exceptions import MlflowTracingException


def raise_as_trace_exception(f):
    """
    A decorator to make sure that the decorated function only raises MlflowTracingException.

    Any exceptions are caught and translated to MlflowTracingException before exiting the function.
    This is helpful for upstream functions to handle tracing related exceptions properly.
    """

    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            raise MlflowTracingException(e) from e

    return wrapper
```

--------------------------------------------------------------------------------

---[FILE: once.py]---
Location: mlflow-master/mlflow/tracing/utils/once.py

```python
# Customized from https://github.com/open-telemetry/opentelemetry-python/blob/754fc36a408dd45e86d4a0f820f84e692f14b4c1/opentelemetry-api/src/opentelemetry/util/_once.py
from threading import Lock
from typing import Callable


class Once:
    """Execute a function exactly once and block all callers until the function returns"""

    def __init__(self) -> None:
        self.__lock = Lock()
        self._done = False

    def do_once(self, func: Callable[[], None]):
        """
        Execute ``func`` if it hasn't been executed or return.
        Will block until ``func`` has been called by one thread.
        """
        if self._done:
            return

        with self.__lock:
            if not self._done:
                func()
                self._done = True
                return
```

--------------------------------------------------------------------------------

````
