---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 710
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 710 of 991)

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

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/tracing/utils/__init__.py
Signals: Pydantic

```python
# TODO: Split this file into multiple files and move under utils directory.
from __future__ import annotations

import inspect
import json
import logging
import uuid
from collections import defaultdict
from contextlib import contextmanager
from dataclasses import asdict, is_dataclass
from functools import lru_cache
from typing import TYPE_CHECKING, Any, Generator

from opentelemetry import trace as trace_api
from opentelemetry.sdk.trace import ReadableSpan as OTelReadableSpan
from opentelemetry.sdk.trace import Span as OTelSpan

from mlflow.exceptions import BAD_REQUEST, MlflowException, MlflowTracingException
from mlflow.tracing.constant import (
    ASSESSMENT_ID_PREFIX,
    TRACE_ID_V4_PREFIX,
    TRACE_REQUEST_ID_PREFIX,
    SpanAttributeKey,
    TokenUsageKey,
    TraceMetadataKey,
    TraceSizeStatsKey,
)
from mlflow.utils.mlflow_tags import IMMUTABLE_TAGS
from mlflow.version import IS_TRACING_SDK_ONLY

_logger = logging.getLogger(__name__)

SPANS_COLUMN_NAME = "spans"

if TYPE_CHECKING:
    from mlflow.entities import LiveSpan, Trace
    from mlflow.pyfunc.context import Context
    from mlflow.types.chat import ChatTool


def capture_function_input_args(func, args, kwargs) -> dict[str, Any] | None:
    try:
        func_signature = inspect.signature(func)
        bound_arguments = func_signature.bind(*args, **kwargs)
        bound_arguments.apply_defaults()

        # Remove `self` from bound arguments if it exists
        if bound_arguments.arguments.get("self"):
            del bound_arguments.arguments["self"]

        # Remove `cls` from bound arguments if it's the first parameter and it's a type
        # This detects classmethods more reliably
        params = list(bound_arguments.arguments.keys())
        if params and params[0] == "cls" and isinstance(bound_arguments.arguments["cls"], type):
            del bound_arguments.arguments["cls"]

        return bound_arguments.arguments
    except Exception:
        _logger.warning(f"Failed to capture inputs for function {func.__name__}.")
        return None


class TraceJSONEncoder(json.JSONEncoder):
    """
    Custom JSON encoder for serializing non-OpenTelemetry compatible objects in a trace or span.

    Trace may contain types that require custom serialization logic, such as Pydantic models,
    non-JSON-serializable types, etc.
    """

    def default(self, obj):
        try:
            import pydantic

            if isinstance(obj, pydantic.BaseModel):
                return obj.model_dump()
        except ImportError:
            pass

        # Some dataclass object defines __str__ method that doesn't return the full object
        # representation, so we use dict representation instead.
        # E.g. https://github.com/run-llama/llama_index/blob/29ece9b058f6b9a1cf29bc723ed4aa3a39879ad5/llama-index-core/llama_index/core/chat_engine/types.py#L63-L64
        if is_dataclass(obj):
            try:
                return asdict(obj)
            except TypeError:
                pass

        # Some object has dangerous side effect in __str__ method, so we use class name instead.
        if not self._is_safe_to_encode_str(obj):
            return type(obj)

        try:
            return super().default(obj)
        except TypeError:
            return str(obj)

    def _is_safe_to_encode_str(self, obj) -> bool:
        """Check if it's safe to encode the object as a string."""
        try:
            # These Llama Index objects are not safe to encode as string, because their __str__
            # method consumes the stream and make it unusable.
            # E.g. https://github.com/run-llama/llama_index/blob/54f2da61ba8a573284ab8336f2b2810d948c3877/llama-index-core/llama_index/core/base/response/schema.py#L120-L127
            from llama_index.core.base.response.schema import (
                AsyncStreamingResponse,
                StreamingResponse,
            )
            from llama_index.core.chat_engine.types import StreamingAgentChatResponse

            if isinstance(
                obj,
                (AsyncStreamingResponse, StreamingResponse, StreamingAgentChatResponse),
            ):
                return False
        except ImportError:
            pass

        return True


def dump_span_attribute_value(value: Any) -> str:
    # NB: OpenTelemetry attribute can store not only string but also a few primitives like
    #   int, float, bool, and list of them. However, we serialize all into JSON string here
    #   for the simplicity in deserialization process.
    return json.dumps(value, cls=TraceJSONEncoder, ensure_ascii=False)


@lru_cache(maxsize=1)
def encode_span_id(span_id: int) -> str:
    """
    Encode the given integer span ID to a 16-byte hex string.
    # https://github.com/open-telemetry/opentelemetry-python/blob/9398f26ecad09e02ad044859334cd4c75299c3cd/opentelemetry-sdk/src/opentelemetry/sdk/trace/__init__.py#L507-L508
    # NB: We don't add '0x' prefix to the hex string here for simpler parsing in backend.
    #   Some backend (e.g. Databricks) disallow this prefix.
    """
    return trace_api.format_span_id(span_id)


@lru_cache(maxsize=1)
def encode_trace_id(trace_id: int) -> str:
    """
    Encode the given integer trace ID to a 32-byte hex string.
    """
    return trace_api.format_trace_id(trace_id)


def decode_id(span_or_trace_id: str) -> int:
    """
    Decode the given hex string span or trace ID to an integer.
    """
    return int(span_or_trace_id, 16)


def get_mlflow_span_for_otel_span(span: OTelSpan) -> LiveSpan | None:
    """
    Get the active MLflow span for the given OpenTelemetry span.
    """
    from mlflow.tracing.trace_manager import InMemoryTraceManager

    trace_id = get_otel_attribute(span, SpanAttributeKey.REQUEST_ID)
    mlflow_span_id = encode_span_id(span.get_span_context().span_id)
    return InMemoryTraceManager.get_instance().get_span_from_id(trace_id, mlflow_span_id)


def build_otel_context(trace_id: int, span_id: int) -> trace_api.SpanContext:
    """
    Build an OpenTelemetry SpanContext object from the given trace and span IDs.
    """
    return trace_api.SpanContext(
        trace_id=trace_id,
        span_id=span_id,
        # NB: This flag is OpenTelemetry's concept to indicate whether the context is
        # propagated from remote parent or not. We don't support distributed tracing
        # yet so always set it to False.
        is_remote=False,
    )


def aggregate_usage_from_spans(spans: list[LiveSpan]) -> dict[str, int] | None:
    """Aggregate token usage information from all spans in the trace."""
    input_tokens = 0
    output_tokens = 0
    total_tokens = 0
    has_usage_data = False

    span_id_to_spans = {span.span_id: span for span in spans}
    children_map: defaultdict[str, list[LiveSpan]] = defaultdict(list)
    roots: list[LiveSpan] = []

    for span in spans:
        parent_id = span.parent_id
        if parent_id and parent_id in span_id_to_spans:
            children_map[parent_id].append(span)
        else:
            roots.append(span)

    def dfs(span: LiveSpan, ancestor_has_usage: bool) -> None:
        nonlocal input_tokens, output_tokens, total_tokens, has_usage_data

        usage = span.get_attribute(SpanAttributeKey.CHAT_USAGE)
        span_has_usage = usage is not None

        if span_has_usage and not ancestor_has_usage:
            input_tokens += usage.get(TokenUsageKey.INPUT_TOKENS, 0)
            output_tokens += usage.get(TokenUsageKey.OUTPUT_TOKENS, 0)
            total_tokens += usage.get(TokenUsageKey.TOTAL_TOKENS, 0)
            has_usage_data = True

        next_ancestor_has_usage = ancestor_has_usage or span_has_usage
        for child in children_map.get(span.span_id, []):
            dfs(child, next_ancestor_has_usage)

    for root in roots:
        dfs(root, False)

    # If none of the spans have token usage data, we shouldn't log token usage metadata.
    if not has_usage_data:
        return None

    return {
        TokenUsageKey.INPUT_TOKENS: input_tokens,
        TokenUsageKey.OUTPUT_TOKENS: output_tokens,
        TokenUsageKey.TOTAL_TOKENS: total_tokens,
    }


def get_otel_attribute(span: trace_api.Span, key: str) -> str | None:
    """
    Get the attribute value from the OpenTelemetry span in a decoded format.

    Args:
        span: The OpenTelemetry span object.
        key: The key of the attribute to retrieve.

    Returns:
        The attribute value as decoded string. If the attribute is not found or cannot
        be parsed, return None.
    """
    try:
        attribute_value = span.attributes.get(key)
        if attribute_value is None:
            return None
        return json.loads(attribute_value)
    except Exception:
        _logger.debug(f"Failed to get attribute {key} with from span {span}.", exc_info=True)


def _try_get_prediction_context():
    # NB: Tracing is enabled in mlflow-skinny, but the pyfunc module cannot be imported as it
    #     relies on numpy, which is not installed in skinny.
    try:
        from mlflow.pyfunc.context import get_prediction_context
    except (ImportError, KeyError):
        return

    return get_prediction_context()


def maybe_get_request_id(is_evaluate=False) -> str | None:
    """Get the request ID if the current prediction is as a part of MLflow model evaluation."""
    context = _try_get_prediction_context()
    if not context or (is_evaluate and not context.is_evaluate):
        return None

    if not context.request_id and is_evaluate:
        _logger.warning(
            f"Missing request_id for context {context}. request_id can't be None when "
            "is_evaluate=True. This is likely an internal error of MLflow, please file "
            "a bug report at https://github.com/mlflow/mlflow/issues."
        )
        return None

    return context.request_id


def maybe_get_dependencies_schemas() -> dict[str, Any] | None:
    if context := _try_get_prediction_context():
        return context.dependencies_schemas


def maybe_get_logged_model_id() -> str | None:
    """
    Get the logged model ID associated with the current prediction context.
    """
    if context := _try_get_prediction_context():
        return context.model_id


def exclude_immutable_tags(tags: dict[str, str]) -> dict[str, str]:
    """Exclude immutable tags e.g. "mlflow.user" from the given tags."""
    return {k: v for k, v in tags.items() if k not in IMMUTABLE_TAGS}


def generate_mlflow_trace_id_from_otel_trace_id(otel_trace_id: int) -> str:
    """
    Generate an MLflow trace ID from an OpenTelemetry trace ID.

    Args:
        otel_trace_id: The OpenTelemetry trace ID as an integer.

    Returns:
        The MLflow trace ID string in format "tr-<hex_trace_id>".
    """
    return TRACE_REQUEST_ID_PREFIX + encode_trace_id(otel_trace_id)


def generate_trace_id_v4_from_otel_trace_id(otel_trace_id: int, location: str) -> str:
    """
    Generate a trace ID in v4 format from the given OpenTelemetry trace ID.

    Args:
        otel_trace_id: The OpenTelemetry trace ID as an integer.
        location: The location, of the trace.

    Returns:
        The MLflow trace ID string in format "trace:/<location>/<hex_trace_id>".
    """
    return construct_trace_id_v4(location, encode_trace_id(otel_trace_id))


def generate_trace_id_v4(span: OTelSpan, location: str) -> str:
    """
    Generate a trace ID for the given span.

    Args:
        span: The OpenTelemetry span object.
        location: The location, of the trace.

    Returns:
        Trace ID with format "trace:/<location>/<hex_trace_id>".
    """
    return generate_trace_id_v4_from_otel_trace_id(span.context.trace_id, location)


def generate_trace_id_v3(span: OTelSpan) -> str:
    """
    Generate a trace ID for the given span (V3 trace schema).

    The format will be "tr-<trace_id>" where the trace_id is hex-encoded Otel trace ID.
    """
    return generate_mlflow_trace_id_from_otel_trace_id(span.context.trace_id)


def generate_request_id_v2() -> str:
    """
    Generate a request ID for the given span.

    This should only be used for V2 trace schema where we use a random UUID as
    request ID. In the V3 schema, "request_id" is renamed to "trace_id" and
    we use the otel-generated trace ID with encoding.
    """
    return uuid.uuid4().hex


def construct_full_inputs(func, *args, **kwargs) -> dict[str, Any]:
    """
    Construct the full input arguments dictionary for the given function,
    including positional and keyword arguments.
    """
    signature = inspect.signature(func)
    # this does not create copy. So values should not be mutated directly
    arguments = signature.bind_partial(*args, **kwargs).arguments

    if "self" in arguments:
        arguments.pop("self")

    return arguments


@contextmanager
def maybe_set_prediction_context(context: "Context" | None):
    """
    Set the prediction context if the given context
    is not None. Otherwise no-op.
    """
    if not IS_TRACING_SDK_ONLY and context:
        from mlflow.pyfunc.context import set_prediction_context

        with set_prediction_context(context):
            yield
    else:
        yield


def set_span_chat_tools(span: LiveSpan, tools: list[ChatTool]):
    """
    Set the `mlflow.chat.tools` attribute on the specified span. This
    attribute is used in the UI, and also by downstream applications that
    consume trace data, such as MLflow evaluate.

    Args:
        span: The LiveSpan to add the attribute to
        tools: A list of standardized chat tool definitions (refer to the
              `spec <../llms/tracing/tracing-schema.html#chat-completion-spans>`_
              for details)

    Example:

    .. code-block:: python
        :test:

        import mlflow
        from mlflow.tracing import set_span_chat_tools

        tools = [
            {
                "type": "function",
                "function": {
                    "name": "add",
                    "description": "Add two numbers",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "a": {"type": "number"},
                            "b": {"type": "number"},
                        },
                        "required": ["a", "b"],
                    },
                },
            }
        ]


        @mlflow.trace
        def f():
            span = mlflow.get_current_active_span()
            set_span_chat_tools(span, tools)
            return 0


        f()
    """
    from mlflow.types.chat import ChatTool

    if not isinstance(tools, list):
        raise MlflowTracingException(
            f"Invalid tools type {type(tools)}. Expected a list of ChatTool.",
            error_code=BAD_REQUEST,
        )

    sanitized_tools = []
    for tool in tools:
        if isinstance(tool, dict):
            ChatTool.model_validate(tool)
            sanitized_tools.append(tool)
        elif isinstance(tool, ChatTool):
            sanitized_tools.append(tool.model_dump(exclude_unset=True))

    span.set_attribute(SpanAttributeKey.CHAT_TOOLS, sanitized_tools)


def _calculate_percentile(sorted_data: list[float], percentile: float) -> float:
    """
    Calculate the percentile value from sorted data.

    Args:
        sorted_data: A sorted list of numeric values
        percentile: The percentile to calculate (e.g., 0.25 for 25th percentile)

    Returns:
        The percentile value
    """
    if not sorted_data:
        return 0.0

    n = len(sorted_data)
    index = percentile * (n - 1)
    lower = int(index)
    upper = lower + 1

    if upper >= n:
        return sorted_data[-1]

    # Linear interpolation between two nearest values
    weight = index - lower
    return sorted_data[lower] * (1 - weight) + sorted_data[upper] * weight


def add_size_stats_to_trace_metadata(trace: Trace):
    """
    Calculate the stats of trace and span sizes and add it as a metadata to the trace.

    This method modifies the trace object in place by adding a new tag.

    Note: For simplicity, we calculate the size without considering the size metadata itself.
    This provides a close approximation without requiring complex calculations.

    This function must not throw an exception.
    """
    from mlflow.entities import Trace, TraceData

    try:
        span_sizes = []
        for span in trace.data.spans:
            span_json = json.dumps(span.to_dict(), cls=TraceJSONEncoder)
            span_sizes.append(len(span_json.encode("utf-8")))

        # NB: To compute the size of the total trace, we need to include the size of the
        # the trace info and the parent dicts for the spans. To avoid serializing spans
        # again (which can be expensive), we compute the size of the trace without spans
        # and combine it with the total size of the spans.
        empty_trace = Trace(info=trace.info, data=TraceData(spans=[]))
        metadata_size = len((empty_trace.to_json()).encode("utf-8"))

        # NB: the third term is the size of comma separators between spans (", ").
        trace_size_bytes = sum(span_sizes) + metadata_size + (len(span_sizes) - 1) * 2

        # Sort span sizes for percentile calculation
        sorted_span_sizes = sorted(span_sizes)

        size_stats = {
            TraceSizeStatsKey.TOTAL_SIZE_BYTES: trace_size_bytes,
            TraceSizeStatsKey.NUM_SPANS: len(span_sizes),
            TraceSizeStatsKey.MAX_SPAN_SIZE_BYTES: max(span_sizes),
            TraceSizeStatsKey.P25_SPAN_SIZE_BYTES: int(
                _calculate_percentile(sorted_span_sizes, 0.25)
            ),
            TraceSizeStatsKey.P50_SPAN_SIZE_BYTES: int(
                _calculate_percentile(sorted_span_sizes, 0.50)
            ),
            TraceSizeStatsKey.P75_SPAN_SIZE_BYTES: int(
                _calculate_percentile(sorted_span_sizes, 0.75)
            ),
        }

        trace.info.trace_metadata[TraceMetadataKey.SIZE_STATS] = json.dumps(size_stats)
        # Keep the total size as a separate metadata for backward compatibility
        trace.info.trace_metadata[TraceMetadataKey.SIZE_BYTES] = str(trace_size_bytes)
    except Exception:
        _logger.warning("Failed to add size stats to trace metadata.", exc_info=True)


def update_trace_state_from_span_conditionally(trace, root_span):
    """
    Update trace state from span status, but only if the user hasn't explicitly set
    a different trace status.

    This utility preserves user-set trace status while maintaining default behavior
    for traces that haven't been explicitly configured. Used by trace processors when
    converting traces to an exportable state.

    Args:
        trace: The trace object to potentially update
        root_span: The root span whose status may be used to update the trace state
    """
    from mlflow.entities.trace_state import TraceState

    # Only update trace state from span status if trace is still IN_PROGRESS
    # If the trace state is anything else, it means the user explicitly set it
    # and we should preserve it
    if trace.info.state == TraceState.IN_PROGRESS:
        state = TraceState.from_otel_status(root_span.status)
        # If the root span is created by the native OpenTelemetry SDK, the status code can be UNSET
        # (default value when an otel span is ended). Override it to OK here to avoid backend error.
        if state == TraceState.STATE_UNSPECIFIED:
            state = TraceState.OK
        trace.info.state = state


def get_experiment_id_for_trace(span: OTelReadableSpan) -> str:
    """
    Determine the experiment ID to associate with the trace.

    The experiment ID can be configured in multiple ways, in order of precedence:
      1. An experiment ID specified via the span creation API i.e. MlflowClient().start_trace()
      2. An experiment ID specified via `mlflow.tracing.set_destination`
      3. An experiment ID of an active run.
      4. The default experiment ID

    Args:
        span: The OpenTelemetry ReadableSpan to extract experiment ID from.

    Returns:
        The experiment ID string to use for the trace.
    """
    from mlflow.tracing.provider import _MLFLOW_TRACE_USER_DESTINATION
    from mlflow.tracking.fluent import _get_experiment_id, _get_latest_active_run

    if experiment_id := get_otel_attribute(span, SpanAttributeKey.EXPERIMENT_ID):
        return experiment_id

    if destination := _MLFLOW_TRACE_USER_DESTINATION.get():
        if exp_id := getattr(destination, "experiment_id", None):
            return exp_id

    if run := _get_latest_active_run():
        return run.info.experiment_id

    return _get_experiment_id()


def get_active_spans_table_name() -> str | None:
    """
    Get active Unity Catalog spans table name that's set by `mlflow.tracing.set_destination`.
    """
    from mlflow.entities.trace_location import UCSchemaLocation
    from mlflow.tracing.provider import _MLFLOW_TRACE_USER_DESTINATION

    if destination := _MLFLOW_TRACE_USER_DESTINATION.get():
        if isinstance(destination, UCSchemaLocation):
            return destination.full_otel_spans_table_name

    return None


def generate_assessment_id() -> str:
    """
    Generates an assessment ID of the form 'a-<uuid4>' in hex string format.

    Returns:
        A unique identifier for an assessment that will be logged to a trace tag.
    """
    id = uuid.uuid4().hex
    return f"{ASSESSMENT_ID_PREFIX}{id}"


@contextmanager
def _bypass_attribute_guard(span: OTelSpan) -> Generator[None, None, None]:
    """
    OpenTelemetry does not allow setting attributes if the span has end time defined.
    https://github.com/open-telemetry/opentelemetry-python/blob/d327927d0274a320466feec6fba6d6ddb287dc5a/opentelemetry-sdk/src/opentelemetry/sdk/trace/__init__.py#L849-L851

    However, we need to set some attributes within `on_end` handler of the span processor,
    where the span is already marked as ended. This context manager is a hacky workaround
    to bypass the attribute guard.
    """
    original_end_time = span._end_time
    span._end_time = None
    try:
        yield
    finally:
        span._end_time = original_end_time


def parse_trace_id_v4(trace_id: str | None) -> tuple[str | None, str | None]:
    """
    Parse the trace ID into location and trace ID components.
    """
    if trace_id is None:
        return None, None
    if trace_id.startswith(TRACE_ID_V4_PREFIX):
        match trace_id.removeprefix(TRACE_ID_V4_PREFIX).split("/"):
            case [location, tid] if location and tid:
                return location, tid
            case _:
                raise MlflowException.invalid_parameter_value(
                    f"Invalid trace ID format: {trace_id}. "
                    f"Expected format: {TRACE_ID_V4_PREFIX}<location>/<trace_id>"
                )
    return None, trace_id


def construct_trace_id_v4(location: str, trace_id: str) -> str:
    """
    Construct a trace ID for the given location and trace ID.
    """
    return f"{TRACE_ID_V4_PREFIX}{location}/{trace_id}"
```

--------------------------------------------------------------------------------

---[FILE: artifact_utils.py]---
Location: mlflow-master/mlflow/tracking/artifact_utils.py

```python
"""
Utilities for dealing with artifacts in the context of a Run.
"""

import os
import pathlib
import posixpath
import tempfile
import urllib.parse
import uuid
from typing import Any

from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.store.artifact.artifact_repository_registry import get_artifact_repository
from mlflow.store.artifact.dbfs_artifact_repo import DbfsRestArtifactRepository
from mlflow.store.artifact.models_artifact_repo import ModelsArtifactRepository
from mlflow.tracking._tracking_service.utils import _get_store
from mlflow.utils.file_utils import path_to_local_file_uri
from mlflow.utils.os import is_windows
from mlflow.utils.uri import add_databricks_profile_info_to_artifact_uri, append_to_uri_path


def get_artifact_uri(run_id, artifact_path=None, tracking_uri=None):
    """Get the absolute URI of the specified artifact in the specified run. If `path` is not
    specified the artifact root URI of the specified run will be returned; calls to ``log_artifact``
    and ``log_artifacts`` write artifact(s) to subdirectories of the artifact root URI.

    Args:
        run_id: The ID of the run for which to obtain an absolute artifact URI.
        artifact_path: The run-relative artifact path. For example,
            ``path/to/artifact``. If unspecified, the artifact root URI for the
            specified run will be returned.
        tracking_uri: The tracking URI from which to get the run and its artifact location. If
            not given, the current default tracking URI is used.

    Returns:
        An *absolute* URI referring to the specified artifact or the specified run's artifact
        root. For example, if an artifact path is provided and the specified run uses an
        S3-backed  store, this may be a uri of the form
        ``s3://<bucket_name>/path/to/artifact/root/path/to/artifact``. If an artifact path
        is not provided and the specified run uses an S3-backed store, this may be a URI of
        the form ``s3://<bucket_name>/path/to/artifact/root``.

    """
    if not run_id:
        raise MlflowException(
            message="A run_id must be specified in order to obtain an artifact uri!",
            error_code=INVALID_PARAMETER_VALUE,
        )

    store = _get_store(tracking_uri)
    run = store.get_run(run_id)
    # Maybe move this method to RunsArtifactRepository so the circular dependency is clearer.
    assert urllib.parse.urlparse(run.info.artifact_uri).scheme != "runs"  # avoid an infinite loop
    if artifact_path is None:
        return run.info.artifact_uri
    else:
        return append_to_uri_path(run.info.artifact_uri, artifact_path)


# TODO: This would be much simpler if artifact_repo.download_artifacts could take the absolute path
# or no path.
def _get_root_uri_and_artifact_path(artifact_uri):
    """Parse the artifact_uri to get the root_uri and artifact_path.

    Args:
        artifact_uri: The *absolute* URI of the artifact.
    """
    if os.path.exists(artifact_uri):
        if not is_windows():
            # If we're dealing with local files, just reference the direct pathing.
            # non-nt-based file systems can directly reference path information, while nt-based
            # systems need to url-encode special characters in directory listings to be able to
            # resolve them (i.e., spaces converted to %20 within a file name or path listing)
            root_uri = os.path.dirname(artifact_uri)
            artifact_path = os.path.basename(artifact_uri)
            return root_uri, artifact_path
        else:  # if we're dealing with nt-based systems, we need to utilize pathname2url to encode.
            artifact_uri = path_to_local_file_uri(artifact_uri)

    parsed_uri = urllib.parse.urlparse(str(artifact_uri))
    prefix = ""
    if parsed_uri.scheme and not parsed_uri.path.startswith("/"):
        # relative path is a special case, urllib does not reconstruct it properly
        prefix = parsed_uri.scheme + ":"
        parsed_uri = parsed_uri._replace(scheme="")

    # For models:/ URIs, it doesn't make sense to initialize a ModelsArtifactRepository with only
    # the model name portion of the URI, then call download_artifacts with the version info.
    if ModelsArtifactRepository.is_models_uri(artifact_uri):
        root_uri, artifact_path = ModelsArtifactRepository.split_models_uri(artifact_uri)
    else:
        artifact_path = posixpath.basename(parsed_uri.path)
        parsed_uri = parsed_uri._replace(path=posixpath.dirname(parsed_uri.path))
        root_uri = prefix + urllib.parse.urlunparse(parsed_uri)
    return root_uri, artifact_path


def _download_artifact_from_uri(
    artifact_uri: str,
    output_path: str | None = None,
    lineage_header_info: dict[str, Any] | None = None,
    tracking_uri: str | None = None,
    registry_uri: str | None = None,
) -> str:
    """
    Args:
        artifact_uri: The *absolute* URI of the artifact to download.
        output_path: The local filesystem path to which to download the artifact. If unspecified,
            a local output path will be created.
        lineage_header_info: The model lineage header info to be consumed by lineage services.
        tracking_uri: The tracking URI to be used when downloading artifacts.
        registry_uri: The registry URI to be used when downloading artifacts.
    """
    root_uri, artifact_path = _get_root_uri_and_artifact_path(artifact_uri)
    repo = get_artifact_repository(
        artifact_uri=root_uri, tracking_uri=tracking_uri, registry_uri=registry_uri
    )

    try:
        if isinstance(repo, ModelsArtifactRepository):
            return repo.download_artifacts(
                artifact_path=artifact_path,
                dst_path=output_path,
                lineage_header_info=lineage_header_info,
            )
        return repo.download_artifacts(artifact_path=artifact_path, dst_path=output_path)
    except Exception as e:
        if artifact_uri.startswith("m-"):
            # When a Model ID like string is passed, suggest using 'models:/{artifact_uri}' instead.
            raise MlflowException(
                f"Invalid uri `{artifact_uri}` is passed. Maybe you meant 'models:/{artifact_uri}'?"
            ) from e
        raise


def _upload_artifact_to_uri(local_path, artifact_uri):
    """Uploads a local artifact (file) to a specified URI.

    Args:
        local_path: The local path of the file to upload.
        artifact_uri: The *absolute* URI of the path to upload the artifact to.

    """
    root_uri, artifact_path = _get_root_uri_and_artifact_path(artifact_uri)
    get_artifact_repository(artifact_uri=root_uri).log_artifact(local_path, artifact_path)


def _upload_artifacts_to_databricks(
    source, run_id, source_host_uri=None, target_databricks_profile_uri=None
):
    """Copy the artifacts from ``source`` to the destination Databricks workspace (DBFS) given by
    ``databricks_profile_uri`` or the current tracking URI.

    Args:
        source: Source location for the artifacts to copy.
        run_id: Run ID to associate the artifacts with.
        source_host_uri: Specifies the source artifact's host URI (e.g. Databricks tracking URI)
            if applicable. If not given, defaults to the current tracking URI.
        target_databricks_profile_uri: Specifies the destination Databricks host. If not given,
            defaults to the current tracking URI.

    Returns:
        The DBFS location in the target Databricks workspace the model files have been
        uploaded to.
    """

    with tempfile.TemporaryDirectory() as local_dir:
        source_with_profile = add_databricks_profile_info_to_artifact_uri(source, source_host_uri)
        _download_artifact_from_uri(source_with_profile, local_dir)
        dest_root = "dbfs:/databricks/mlflow/tmp-external-source/"
        dest_root_with_profile = add_databricks_profile_info_to_artifact_uri(
            dest_root, target_databricks_profile_uri
        )
        dest_repo = DbfsRestArtifactRepository(dest_root_with_profile)
        dest_artifact_path = run_id or uuid.uuid4().hex
        # Allow uploading from the same run id multiple times by randomizing a suffix
        if len(dest_repo.list_artifacts(dest_artifact_path)) > 0:
            dest_artifact_path = dest_artifact_path + "-" + uuid.uuid4().hex[0:4]
        dest_repo.log_artifacts(local_dir, artifact_path=dest_artifact_path)
        dirname = pathlib.PurePath(source).name  # innermost directory name
        return posixpath.join(dest_root, dest_artifact_path, dirname)  # new source
```

--------------------------------------------------------------------------------

````
