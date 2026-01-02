---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 709
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 709 of 991)

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

---[FILE: otlp.py]---
Location: mlflow-master/mlflow/tracing/utils/otlp.py
Signals: FastAPI

```python
import gzip
import os
import zlib
from typing import Any

from opentelemetry.proto.common.v1.common_pb2 import AnyValue, ArrayValue, KeyValueList
from opentelemetry.sdk.trace.export import SpanExporter

from mlflow.environment_variables import MLFLOW_ENABLE_OTLP_EXPORTER
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import RESOURCE_DOES_NOT_EXIST

# Constants for OpenTelemetry integration
MLFLOW_EXPERIMENT_ID_HEADER = "x-mlflow-experiment-id"
OTLP_TRACES_PATH = "/v1/traces"
OTLP_METRICS_PATH = "/v1/metrics"


def should_use_otlp_exporter() -> bool:
    """
    Determine if OTLP traces should be exported based on environment configuration.
    """
    return _get_otlp_traces_endpoint() is not None and MLFLOW_ENABLE_OTLP_EXPORTER.get()


def should_export_otlp_metrics() -> bool:
    """
    Determine if OTLP metrics should be exported based on environment configuration.

    Returns True if metrics endpoint is configured.
    """
    return _get_otlp_metrics_endpoint() is not None


def get_otlp_exporter() -> SpanExporter:
    """
    Get the OTLP exporter based on the configured protocol.
    """
    endpoint = _get_otlp_traces_endpoint()
    protocol = _get_otlp_protocol()
    if protocol == "grpc":
        try:
            from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
        except ImportError:
            raise MlflowException(
                "gRPC OTLP exporter is not available. Please install the required dependency by "
                "running `pip install opentelemetry-exporter-otlp-proto-grpc`.",
                error_code=RESOURCE_DOES_NOT_EXIST,
            )

        return OTLPSpanExporter(endpoint=endpoint)
    elif protocol == "http/protobuf":
        try:
            from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
        except ImportError as e:
            raise MlflowException(
                "HTTP OTLP exporter is not available. Please install the required dependency by "
                "running `pip install opentelemetry-exporter-otlp-proto-http`.",
                error_code=RESOURCE_DOES_NOT_EXIST,
            ) from e

        return OTLPSpanExporter(endpoint=endpoint)
    else:
        raise MlflowException.invalid_parameter_value(
            f"Unsupported OTLP protocol '{protocol}' is configured. Please set "
            "the protocol to either 'grpc' or 'http/protobuf'."
        )


def _get_otlp_traces_endpoint() -> str | None:
    """
    Get the OTLP endpoint from the environment variables.
    Ref: https://opentelemetry.io/docs/languages/sdk-configuration/otlp-exporter/#endpoint-configuration

    Per the OTel spec:
    - OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: Full URL used as-is
    - OTEL_EXPORTER_OTLP_ENDPOINT: Base URL, requires appending signal path
    """
    if traces_endpoint := os.environ.get("OTEL_EXPORTER_OTLP_TRACES_ENDPOINT"):
        return traces_endpoint

    if base_endpoint := os.environ.get("OTEL_EXPORTER_OTLP_ENDPOINT"):
        return base_endpoint.rstrip("/") + OTLP_TRACES_PATH

    return None


def _get_otlp_metrics_endpoint() -> str | None:
    """
    Get the OTLP metrics endpoint from the environment variables.

    Per the OTel spec:
    - OTEL_EXPORTER_OTLP_METRICS_ENDPOINT: Full URL used as-is
    - OTEL_EXPORTER_OTLP_ENDPOINT: Base URL, requires appending signal path
    """
    if metrics_endpoint := os.environ.get("OTEL_EXPORTER_OTLP_METRICS_ENDPOINT"):
        return metrics_endpoint

    if base_endpoint := os.environ.get("OTEL_EXPORTER_OTLP_ENDPOINT"):
        return base_endpoint.rstrip("/") + OTLP_METRICS_PATH

    return None


def _get_otlp_protocol(default_value: str = "grpc") -> str:
    """
    Get the OTLP traces protocol from environment variables.

    Returns the value of OTEL_EXPORTER_OTLP_TRACES_PROTOCOL if set,
    otherwise falls back to OTEL_EXPORTER_OTLP_PROTOCOL, then to default_value.

    Args:
        default_value: The default protocol to use if no environment variables are set.
    """
    return os.environ.get("OTEL_EXPORTER_OTLP_TRACES_PROTOCOL") or os.environ.get(
        "OTEL_EXPORTER_OTLP_PROTOCOL", default_value
    )


def _get_otlp_metrics_protocol(default_value: str = "grpc") -> str:
    """
    Get the OTLP metrics protocol from environment variables.

    Returns the value of OTEL_EXPORTER_OTLP_METRICS_PROTOCOL if set,
    otherwise falls back to OTEL_EXPORTER_OTLP_PROTOCOL, then to default_value.

    Args:
        default_value: The default protocol to use if no environment variables are set.
    """
    return os.environ.get("OTEL_EXPORTER_OTLP_METRICS_PROTOCOL") or os.environ.get(
        "OTEL_EXPORTER_OTLP_PROTOCOL", default_value
    )


def _otel_proto_bytes_to_id(id_bytes: bytes) -> int:
    """Convert OTel protobuf bytes to integer ID."""
    return int.from_bytes(id_bytes, byteorder="big", signed=False)


def _set_otel_proto_anyvalue(pb_any_value: AnyValue, value: Any) -> None:
    """Set a value on an OTel protobuf AnyValue message.

    Args:
        pb_any_value: The OTel protobuf AnyValue message to populate.
        value: The value to set.
    """
    if value is None:
        # Leave the value unset for None
        pass
    elif isinstance(value, bool):
        pb_any_value.bool_value = value
    elif isinstance(value, str):
        pb_any_value.string_value = value
    elif isinstance(value, int):
        pb_any_value.int_value = value
    elif isinstance(value, float):
        pb_any_value.double_value = value
    elif isinstance(value, bytes):
        pb_any_value.bytes_value = value
    elif isinstance(value, (list, tuple)):
        # Explicitly set array_value using CopyFrom to ensure the field is set even for empty lists
        array_value = ArrayValue()
        for item in value:
            _set_otel_proto_anyvalue(array_value.values.add(), item)
        pb_any_value.array_value.CopyFrom(array_value)
    elif isinstance(value, dict):
        # Explicitly set kvlist_value using CopyFrom to ensure the field is set even for empty dicts
        kvlist_value = KeyValueList()
        for k, v in value.items():
            kv = kvlist_value.values.add()
            kv.key = str(k)
            _set_otel_proto_anyvalue(kv.value, v)
        pb_any_value.kvlist_value.CopyFrom(kvlist_value)
    else:
        # For unknown types, convert to string
        pb_any_value.string_value = str(value)


def _decode_otel_proto_anyvalue(pb_any_value: AnyValue) -> Any:
    """Decode an OTel protobuf AnyValue.

    Args:
        pb_any_value: The OTel protobuf AnyValue message to decode.

    Returns:
        The decoded value.
    """
    value_type = pb_any_value.WhichOneof("value")
    if not value_type:
        return None

    # Handle complex types that need recursion
    if value_type == "array_value":
        return [_decode_otel_proto_anyvalue(v) for v in pb_any_value.array_value.values]
    elif value_type == "kvlist_value":
        return {
            kv.key: _decode_otel_proto_anyvalue(kv.value) for kv in pb_any_value.kvlist_value.values
        }
    else:
        # For simple types, just get the attribute directly
        return getattr(pb_any_value, value_type)


def decompress_otlp_body(raw_body: bytes, content_encoding: str) -> bytes:
    """
    Decompress OTLP request body according to Content-Encoding.

    Supported encodings:
    - gzip
    - deflate (RFC-compliant and raw deflate)

    Raises HTTPException if the payload cannot be decompressed.
    """
    from fastapi import HTTPException, status

    match content_encoding:
        case "gzip":
            try:
                return gzip.decompress(raw_body)
            except Exception:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to decompress gzip payload",
                )

        case "deflate":
            try:
                return zlib.decompress(raw_body)
            except Exception:
                # Try raw DEFLATE stream (some clients send this)
                try:
                    return zlib.decompress(raw_body, -zlib.MAX_WBITS)
                except Exception:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Failed to decompress deflate payload",
                    )
        case _:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported Content-Encoding: {content_encoding}",
            )
```

--------------------------------------------------------------------------------

---[FILE: processor.py]---
Location: mlflow-master/mlflow/tracing/utils/processor.py

```python
import logging

from mlflow.exceptions import MlflowException

_logger = logging.getLogger(__name__)


def apply_span_processors(span):
    """Apply configured span processors sequentially to the span."""
    from mlflow.tracing.config import get_config

    config = get_config()
    if not config.span_processors:
        return

    non_null_return_processors = []
    for processor in config.span_processors:
        try:
            result = processor(span)
            if result is not None:
                non_null_return_processors.append(processor.__name__)
        except Exception as e:
            _logger.warning(
                f"Span processor {processor.__name__} failed: {e}",
                exc_info=_logger.isEnabledFor(logging.DEBUG),
            )

    if non_null_return_processors:
        _logger.warning(
            f"Span processors {non_null_return_processors} returned a non-null value, "
            "but it will be ignored. Span processors should not return a value."
        )


def validate_span_processors(span_processors):
    """Validate that the span processor is a valid function."""
    span_processors = span_processors or []

    for span_processor in span_processors:
        if not callable(span_processor):
            raise MlflowException.invalid_parameter_value(
                "Span processor must be a callable function."
            )

        # Skip validation for builtin functions and partial functions that don't have __code__
        if not hasattr(span_processor, "__code__"):
            continue

        if span_processor.__code__.co_argcount != 1:
            raise MlflowException.invalid_parameter_value(
                "Span processor must take exactly one argument that accepts a LiveSpan object."
            )

    return span_processors
```

--------------------------------------------------------------------------------

---[FILE: prompt.py]---
Location: mlflow-master/mlflow/tracing/utils/prompt.py

```python
import json

from mlflow.entities.model_registry import PromptVersion
from mlflow.exceptions import MlflowException
from mlflow.tracing.constant import TraceTagKey


# TODO: Remove tag based linking once we migrate to LinkPromptsToTraces endpoint
def update_linked_prompts_tag(current_tag_value: str | None, prompt_versions: list[PromptVersion]):
    """
    Utility method to update linked prompts tag value with a new prompt version.

    Args:
        current_tag_value: Current JSON string value of the linked prompts tag
        prompt_versions: List of PromptVersion objects to add

    Returns:
        Updated JSON string with new entries added (avoiding duplicates)

    Raises:
        MlflowException: If current tag value has invalid JSON or format
    """
    if current_tag_value is not None:
        try:
            parsed_prompts_tag_value = json.loads(current_tag_value)
            if not isinstance(parsed_prompts_tag_value, list):
                raise MlflowException(
                    f"Invalid format for '{TraceTagKey.LINKED_PROMPTS}' tag: {current_tag_value}"
                )
        except json.JSONDecodeError:
            raise MlflowException(
                f"Invalid JSON format for '{TraceTagKey.LINKED_PROMPTS}' tag: {current_tag_value}"
            )
    else:
        parsed_prompts_tag_value = []

    new_prompt_entries = [
        {"name": prompt_version.name, "version": str(prompt_version.version)}
        for prompt_version in prompt_versions
    ]

    prompts_to_add = [p for p in new_prompt_entries if p not in parsed_prompts_tag_value]
    if not prompts_to_add:
        return current_tag_value

    parsed_prompts_tag_value.extend(prompts_to_add)
    return json.dumps(parsed_prompts_tag_value)
```

--------------------------------------------------------------------------------

---[FILE: search.py]---
Location: mlflow-master/mlflow/tracing/utils/search.py

```python
from __future__ import annotations

from typing import TYPE_CHECKING, Any, Literal, NamedTuple

from mlflow.exceptions import MlflowException

SPANS_COLUMN_NAME = "spans"

if TYPE_CHECKING:
    import pandas

    import mlflow.entities
    from mlflow.entities import Trace


def traces_to_df(
    traces: list[Trace], extract_fields: list[str] | None = None
) -> "pandas.DataFrame":
    """
    Convert a list of MLflow Traces to a pandas DataFrame with one column called "traces"
    containing string representations of each Trace.
    """
    import pandas as pd

    from mlflow.entities.trace import Trace  # import here to avoid circular import

    rows = []
    columns = Trace.pandas_dataframe_columns()
    parsed_fields = []
    # update columns to ensure they exist in result dataframe in case traces are empty
    if extract_fields is not None:
        parsed_fields = _parse_fields(extract_fields)
        columns.extend([str(field) for field in parsed_fields])

    for trace in traces:
        row = trace.to_pandas_dataframe_row()
        for field in parsed_fields:
            row[str(field)] = None
            for span in trace.data.spans:
                if field.span_name == span.name:
                    row[str(field)] = _extract_field_from_span(span, field)
        rows.append(row)

    return pd.DataFrame.from_records(
        data=rows,
        columns=columns,
    )


def _extract_field_from_span(span: "mlflow.entities.Span", field: _ParsedField) -> Any | None:
    span_inputs_or_outputs = getattr(span, field.field_type)
    if (
        isinstance(span_inputs_or_outputs, dict)
        and field.field_name is not None
        and field.field_name in span_inputs_or_outputs
    ):
        return span_inputs_or_outputs.get(field.field_name)
    elif field.field_name is None:
        return span_inputs_or_outputs


class _PeekableIterator:
    """
    Wraps an iterator and allows peeking at the next element without consuming it.
    """

    def __init__(self, it):
        self.it = iter(it)
        self._next = None

    def __iter__(self):
        return self

    def __next__(self):
        if self._next is not None:
            next_value = self._next
            self._next = None
            return next_value
        return next(self.it)

    def peek(self):
        if self._next is None:
            try:
                self._next = next(self.it)
            except StopIteration:
                return None
        return self._next


class _ParsedField(NamedTuple):
    """
    Represents a parsed field from a string of the form 'span_name.[inputs|outputs]' or
    'span_name.[inputs|outputs].field_name'.
    """

    span_name: str
    field_type: Literal["inputs", "outputs"]
    field_name: str | None

    def __str__(self) -> str:
        return (
            f"{self.span_name}.{self.field_type}.{self.field_name}"
            if self.field_name is not None
            else f"{self.span_name}.{self.field_type}"
        )


_BACKTICK = "`"


class _FieldParser:
    def __init__(self, field: str) -> None:
        self.field = field
        self.chars = _PeekableIterator(field)

    def peek(self) -> str:
        return self.chars.peek()

    def next(self) -> str:
        return next(self.chars)

    def has_next(self) -> bool:
        return self.peek() is not None

    def consume_until_char_or_end(self, stop_char: str | None = None) -> str:
        """
        Consume characters until the specified character is encountered or the end of the
        string. If char is None, consume until the end of the string.
        """
        consumed = ""
        while (c := self.peek()) and c != stop_char:
            consumed += self.next()
        return consumed

    def _parse_span_name(self) -> str:
        if self.peek() == _BACKTICK:
            self.next()
            span_name = self.consume_until_char_or_end(_BACKTICK)
            if self.peek() != _BACKTICK:
                raise MlflowException.invalid_parameter_value(
                    f"Expected closing backtick: {self.field!r}"
                )
            self.next()
        else:
            span_name = self.consume_until_char_or_end(".")

        if self.peek() != ".":
            raise MlflowException.invalid_parameter_value(
                f"Expected dot after span name: {self.field!r}"
            )
        self.next()
        return span_name

    def _parse_field_type(self) -> str:
        field_type = self.consume_until_char_or_end(".")
        if field_type not in ("inputs", "outputs"):
            raise MlflowException.invalid_parameter_value(
                f"Invalid field type: {field_type!r}. Expected 'inputs' or 'outputs'."
            )

        if self.has_next():
            self.next()  # Consume the dot
        return field_type

    def _parse_field_name(self) -> str:
        if self.peek() == _BACKTICK:
            self.next()
            field_name = self.consume_until_char_or_end(_BACKTICK)
            if self.peek() != _BACKTICK:
                raise MlflowException.invalid_parameter_value(
                    f"Expected closing backtick: {self.field!r}"
                )
            self.next()

            # There should be no more characters after the closing backtick
            if self.has_next():
                raise MlflowException.invalid_parameter_value(
                    f"Unexpected characters after closing backtick: {self.field!r}"
                )

        else:
            field_name = self.consume_until_char_or_end()

        return field_name

    def parse(self) -> _ParsedField:
        span_name = self._parse_span_name()
        field_type = self._parse_field_type()
        field_name = self._parse_field_name() if self.has_next() else None
        return _ParsedField(span_name=span_name, field_type=field_type, field_name=field_name)


def _parse_fields(fields: list[str]) -> list[_ParsedField]:
    """
    Parses the specified field strings of the form 'span_name.[inputs|outputs]' or
    'span_name.[inputs|outputs].field_name' into _ParsedField objects.
    """
    return [_FieldParser(field).parse() for field in fields]
```

--------------------------------------------------------------------------------

---[FILE: timeout.py]---
Location: mlflow-master/mlflow/tracing/utils/timeout.py

```python
import atexit
import logging
import threading
import time
from collections import OrderedDict

from cachetools import Cache, TTLCache

from mlflow.entities.span_event import SpanEvent
from mlflow.entities.span_status import SpanStatusCode
from mlflow.environment_variables import (
    MLFLOW_TRACE_BUFFER_MAX_SIZE,
    MLFLOW_TRACE_BUFFER_TTL_SECONDS,
    MLFLOW_TRACE_TIMEOUT_CHECK_INTERVAL_SECONDS,
    MLFLOW_TRACE_TIMEOUT_SECONDS,
)
from mlflow.exceptions import MlflowTracingException

_logger = logging.getLogger(__name__)

_TRACE_EXPIRATION_MSG = (
    "Trace {request_id} is timed out after {ttl} seconds. The operation may be stuck or "
    "taking too long to complete. To increase the timeout, set the environment variable "
    "MLFLOW_TRACE_TIMEOUT_SECONDS to a larger value."
)


def get_trace_cache_with_timeout() -> Cache:
    """
    Return a cache object that stores traces in-memory while they are in-progress.

    If the timeout is specified, this returns a customized cache that logs the
    expired traces to the backend. Otherwise, this returns a regular cache.
    """

    if timeout := MLFLOW_TRACE_TIMEOUT_SECONDS.get():
        return MlflowTraceTimeoutCache(
            timeout=timeout,
            maxsize=MLFLOW_TRACE_BUFFER_MAX_SIZE.get(),
        )

    # NB: Ideally we should return the vanilla Cache object only with maxsize.
    # But we used TTLCache before introducing the timeout feature (that does not
    # monitor timeout periodically nor log the expired traces). To keep the
    # backward compatibility, we return TTLCache.
    return TTLCache(
        ttl=MLFLOW_TRACE_BUFFER_TTL_SECONDS.get(),
        maxsize=MLFLOW_TRACE_BUFFER_MAX_SIZE.get(),
    )


class _TimedCache(Cache):
    """
    This code is ported from cachetools library to avoid depending on the private class.
    https://github.com/tkem/cachetools/blob/d44c98407030d2e91cbe82c3997be042d9c2f0de/src/cachetools/__init__.py#L376
    """

    class _Timer:
        def __init__(self, timer):
            self.__timer = timer
            self.__nesting = 0

        def __call__(self):
            if self.__nesting == 0:
                return self.__timer()
            else:
                return self.__time

        def __enter__(self):
            if self.__nesting == 0:
                self.__time = time = self.__timer()
            else:
                time = self.__time
            self.__nesting += 1
            return time

        def __exit__(self, *exc):
            self.__nesting -= 1

        def __reduce__(self):
            return _TimedCache._Timer, (self.__timer,)

        def __getattr__(self, name):
            return getattr(self.__timer, name)

    def __init__(self, maxsize, timer=time.monotonic, getsizeof=None):
        Cache.__init__(self, maxsize, getsizeof)
        self.__timer = _TimedCache._Timer(timer)

    def __repr__(self, cache_repr=Cache.__repr__):
        with self.__timer as time:
            self.expire(time)
            return cache_repr(self)

    def __len__(self, cache_len=Cache.__len__):
        with self.__timer as time:
            self.expire(time)
            return cache_len(self)

    @property
    def currsize(self):
        with self.__timer as time:
            self.expire(time)
            return super().currsize

    @property
    def timer(self):
        """The timer function used by the cache."""
        return self.__timer

    def clear(self):
        with self.__timer as time:
            self.expire(time)
            Cache.clear(self)

    def get(self, *args, **kwargs):
        with self.__timer:
            return Cache.get(self, *args, **kwargs)

    def pop(self, *args, **kwargs):
        with self.__timer:
            return Cache.pop(self, *args, **kwargs)

    def setdefault(self, *args, **kwargs):
        with self.__timer:
            return Cache.setdefault(self, *args, **kwargs)


class MlflowTraceTimeoutCache(_TimedCache):
    """
    A different implementation of cachetools.TTLCache that logs the expired traces to the backend.

    NB: Do not use this class outside a singleton context. This class is not thread-safe.
    """

    def __init__(self, timeout: int, maxsize: int):
        super().__init__(maxsize=maxsize)
        self._timeout = timeout

        # Set up the linked list ordered by expiration time
        self._root = TTLCache._Link()
        self._root.prev = self._root
        self._root.next = self._root
        self._links = OrderedDict()

        self._start_expire_check_loop()

    @property
    def timeout(self) -> int:
        # Timeout should not be changed after the cache is created
        # because the linked list will not be updated accordingly.
        return self._timeout

    def __setitem__(self, key, value, cache_setitem=Cache.__setitem__):
        """Set the item in the cache, and also in the linked list if it is a new key"""
        with self.timer as time:
            cache_setitem(self, key, value)

        if key not in self._links:
            # Add the new item to the tail of the linked list
            # Inspired by https://github.com/tkem/cachetools/blob/d44c98407030d2e91cbe82c3997be042d9c2f0de/src/cachetools/__init__.py#L432
            tail = self._root.prev
            link = TTLCache._Link(key)
            link.expires = time + self._timeout
            link.next = self._root
            link.prev = tail
            tail.next = link
            self._root.prev = link
            self._links[key] = link

    def __delitem__(self, key, cache_delitem=Cache.__delitem__):
        """Delete the item from the cache and the linked list."""
        cache_delitem(self, key)
        link = self._links.pop(key)
        link.unlink()

    def _start_expire_check_loop(self):
        # Close the daemon thread when the main thread exits
        atexit.register(self.clear)

        self._expire_checker_thread = threading.Thread(
            target=self._expire_check_loop, daemon=True, name="TTLCacheExpireLoop"
        )
        self._expire_checker_stop_event = threading.Event()
        self._expire_checker_thread.start()

    def _expire_check_loop(self):
        while not self._expire_checker_stop_event.is_set():
            try:
                self.expire()
            except Exception as e:
                _logger.debug(f"Failed to expire traces: {e}")
                # If an error is raised from the expiration method, stop running the loop.
                # Otherwise, the expire task might get heavier and heavier due to the
                # increasing number of expired items.
                break

            time.sleep(MLFLOW_TRACE_TIMEOUT_CHECK_INTERVAL_SECONDS.get())

    def expire(self, time=None):
        """
        Trigger the expiration of traces that have exceeded the timeout.

        Args:
            time: Unused. Only for compatibility with the parent class.
        """
        expired = self._get_expired_traces()

        # End the expired traces and set the status to ERROR in background thread
        for request_id in expired:
            trace = self[request_id]
            if root_span := trace.get_root_span():
                try:
                    root_span.set_status(SpanStatusCode.ERROR)
                    msg = _TRACE_EXPIRATION_MSG.format(request_id=request_id, ttl=self._timeout)
                    exception_event = SpanEvent.from_exception(MlflowTracingException(msg))
                    root_span.add_event(exception_event)
                    root_span.end()  # Calling end() triggers span export
                    _logger.info(msg + " You can find the aborted trace in the MLflow UI.")
                except Exception as e:
                    _logger.debug(f"Failed to export an expired trace {request_id}: {e}")

                # NB: root_span.end() should pop the trace from the cache. But we need to
                # double-check it because it may not happens due to some errors.
                if request_id in self:
                    del self[request_id]

    def _get_expired_traces(self) -> list[str]:
        """
        Find all expired traces and return their request IDs.

        The linked list is ordered by expiration time, so we can traverse the list from the head
        and return early whenever we find a trace that has not expired yet.
        """
        time = self.timer()
        curr = self._root.next

        if curr.expires and time < curr.expires:
            return []

        expired = []
        while curr is not self._root and not (time < curr.expires):
            expired.append(curr.key)
            curr = curr.next
        return expired

    def clear(self):
        super().clear()
        self._expire_checker_stop_event.set()
        self._expire_checker_thread.join()
```

--------------------------------------------------------------------------------

---[FILE: token.py]---
Location: mlflow-master/mlflow/tracing/utils/token.py

```python
import contextvars
from dataclasses import dataclass

from mlflow.entities import LiveSpan


@dataclass
class SpanWithToken:
    """
    A utility container to hold an MLflow span and its corresponding OpenTelemetry token.

    The token is a special object that is generated when setting a span as active within
    the Open Telemetry span context. This token is required when inactivate the span i.e.
    detaching the span from the context.
    """

    span: LiveSpan
    token: contextvars.Token | None = None
```

--------------------------------------------------------------------------------

---[FILE: truncation.py]---
Location: mlflow-master/mlflow/tracing/utils/truncation.py

```python
import json
from functools import lru_cache
from typing import Any

from mlflow.entities.trace_data import TraceData
from mlflow.entities.trace_info import TraceInfo
from mlflow.tracing.constant import (
    TRACE_REQUEST_RESPONSE_PREVIEW_MAX_LENGTH_DBX,
    TRACE_REQUEST_RESPONSE_PREVIEW_MAX_LENGTH_OSS,
)
from mlflow.tracking._tracking_service.utils import get_tracking_uri
from mlflow.utils.uri import is_databricks_uri


def set_request_response_preview(trace_info: TraceInfo, trace_data: TraceData) -> None:
    """
    Set the request and response previews for the trace info.
    """
    # If request/response preview is already set by users via `mlflow.update_current_trace`,
    # we don't override it with the truncated version.
    if trace_info.request_preview is None:
        trace_info.request_preview = _get_truncated_preview(trace_data.request, role="user")
    if trace_info.response_preview is None:
        trace_info.response_preview = _get_truncated_preview(trace_data.response, role="assistant")


def _get_truncated_preview(request_or_response: str | dict[str, Any] | None, role: str) -> str:
    """
    Truncate the request preview to fit the max length.
    """
    if request_or_response is None:
        return ""

    max_length = _get_max_length()

    content = None
    obj = None
    if isinstance(request_or_response, dict):
        obj = request_or_response
        request_or_response = json.dumps(request_or_response)
    elif isinstance(request_or_response, str):
        try:
            obj = json.loads(request_or_response)
        except json.JSONDecodeError:
            pass

    if obj is not None:
        if messages := _try_extract_messages(obj):
            msg = _get_last_message(messages, role=role)
            content = _get_text_content_from_message(msg)

    content = content or request_or_response

    if len(content) <= max_length:
        return content

    return content[: max_length - 3] + "..."


@lru_cache(maxsize=1)
def _get_max_length() -> int:
    tracking_uri = get_tracking_uri()
    return (
        TRACE_REQUEST_RESPONSE_PREVIEW_MAX_LENGTH_DBX
        if is_databricks_uri(tracking_uri)
        else TRACE_REQUEST_RESPONSE_PREVIEW_MAX_LENGTH_OSS
    )


def _try_extract_messages(obj: dict[str, Any]) -> list[dict[str, Any]] | None:
    if not isinstance(obj, dict):
        return None

    # Check if the object contains messages with OpenAI ChatCompletion format
    if (messages := obj.get("messages")) and isinstance(messages, list):
        return [item for item in messages if _is_message(item)]

    # Check if the object contains a message in OpenAI ChatCompletion response format (choices)
    if (
        (choices := obj.get("choices"))
        and isinstance(choices, list)
        and len(choices) > 0
        and isinstance(choices[0], dict)
        and (msg := choices[0].get("message"))
        and _is_message(msg)
    ):
        return [msg]

    # Check if the object contains a message in OpenAI Responses API request format
    if (input := obj.get("input")) and isinstance(input, list):
        return [item for item in input if _is_message(item)]

    # Check if the object contains a message in OpenAI Responses API response format
    if (output := obj.get("output")) and isinstance(output, list):
        return [item for item in output if _is_message(item)]

    # Handle ResponsesAgent input, which contains OpenAI Responses request in 'request' key
    if "request" in obj:
        return _try_extract_messages(obj["request"])

    return None


def _is_message(item: Any) -> bool:
    return isinstance(item, dict) and "role" in item and "content" in item


def _get_last_message(messages: list[dict[str, Any]], role: str) -> dict[str, Any]:
    """
    Return last message with the given role.
    If the messages don't include a message with the given role, return the last one.
    """
    for message in reversed(messages):
        if message.get("role") == role:
            return message
    return messages[-1]


def _get_text_content_from_message(message: dict[str, Any]) -> str:
    content = message.get("content")
    if isinstance(content, list):
        # content is a list of content parts
        for part in content:
            if isinstance(part, str):
                return part
            elif isinstance(part, dict) and part.get("type") in ["text", "output_text"]:
                return part.get("text")
    elif isinstance(content, str):
        return content
    return ""
```

--------------------------------------------------------------------------------

---[FILE: warning.py]---
Location: mlflow-master/mlflow/tracing/utils/warning.py

```python
import functools
import importlib
import logging
import warnings

_logger = logging.getLogger(__name__)


class LogDemotionFilter(logging.Filter):
    def __init__(self, module: str, message: str):
        super().__init__()
        self.module = module
        self.message = message

    def filter(self, record: logging.LogRecord) -> bool:
        if record.name == self.module and self.message in record.getMessage():
            record.levelno = logging.DEBUG  # Change the log level to DEBUG
            record.levelname = "DEBUG"

            # Check the log level for the logger is debug or not
            logger = logging.getLogger(self.module)
            return logger.isEnabledFor(logging.DEBUG)
        return True

    def __eq__(self, other):
        if isinstance(other, LogDemotionFilter):
            return self.module == other.module and self.message == other.message
        return False


def suppress_warning(module: str, message: str):
    """
    Convert the "Failed to detach context" log raised by the OpenTelemetry logger to DEBUG
    level so that it does not show up in the user's console.

    Args:
        module: The module name of the logger that raises the warning.
        message: The (part of) message in the log that needs to be demoted to DEBUG level
    """
    try:
        logger = getattr(importlib.import_module(module), "logger", None)
        log_filter = LogDemotionFilter(module, message)
        if logger and not any(f == log_filter for f in logger.filters):
            logger.addFilter(log_filter)
    except Exception as e:
        _logger.debug(f"Failed to suppress the warning for {module}", exc_info=e)
        raise


def request_id_backward_compatible(func):
    """
    A decorator to support backward compatibility for the `request_id` parameter,
    which is deprecated and replaced by the `trace_id` parameter in tracing APIs.

    This decorator will adds `request_id` to the function signature and issue
    a deprecation warning if `request_id` is used with non-null value.
    """

    @functools.wraps(func)
    def wrapper(*args, request_id: str | None = None, **kwargs):
        if request_id is not None:
            warnings.warn(
                f"The request_id parameter is deprecated from the {func.__name__} API "
                "and will be removed in a future version. Please use the `trace_id` "
                "parameter instead.",
                category=FutureWarning,
                stacklevel=2,
            )

            if kwargs.get("trace_id") is None:
                kwargs["trace_id"] = request_id

        return func(*args, **kwargs)

    return wrapper
```

--------------------------------------------------------------------------------

````
