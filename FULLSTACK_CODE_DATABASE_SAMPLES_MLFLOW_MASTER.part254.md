---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 254
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 254 of 991)

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

---[FILE: span_status.py]---
Location: mlflow-master/mlflow/entities/span_status.py

```python
from __future__ import annotations

from dataclasses import dataclass
from enum import Enum

from opentelemetry import trace as trace_api
from opentelemetry.proto.trace.v1.trace_pb2 import Status as OtelStatus

from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE


class SpanStatusCode(str, Enum):
    """Enum for status code of a span"""

    # Uses the same set of status codes as OpenTelemetry
    UNSET = "UNSET"
    OK = "OK"
    ERROR = "ERROR"

    def to_otel_proto_status_code_name(self) -> str:
        """
        Convert the SpanStatusCode to the corresponding OpenTelemetry protobuf enum name.
        """
        proto_code = OtelStatus.StatusCode
        mapping = {
            SpanStatusCode.UNSET: proto_code.Name(proto_code.STATUS_CODE_UNSET),
            SpanStatusCode.OK: proto_code.Name(proto_code.STATUS_CODE_OK),
            SpanStatusCode.ERROR: proto_code.Name(proto_code.STATUS_CODE_ERROR),
        }
        return mapping[self]

    @staticmethod
    def from_otel_proto_status_code_name(status_code_name: str) -> SpanStatusCode:
        """
        Convert an OpenTelemetry protobuf enum name to the corresponding SpanStatusCode enum value.
        """
        proto_code = OtelStatus.StatusCode
        mapping = {
            proto_code.Name(proto_code.STATUS_CODE_UNSET): SpanStatusCode.UNSET,
            proto_code.Name(proto_code.STATUS_CODE_OK): SpanStatusCode.OK,
            proto_code.Name(proto_code.STATUS_CODE_ERROR): SpanStatusCode.ERROR,
        }
        try:
            return mapping[status_code_name]
        except KeyError:
            raise MlflowException(
                f"Invalid status code name: {status_code_name}. "
                f"Valid values are: {', '.join(mapping.keys())}",
                error_code=INVALID_PARAMETER_VALUE,
            )


@dataclass
class SpanStatus:
    """
    Status of the span or the trace.

    Args:
        status_code: The status code of the span or the trace. This must be one of the
            values of the :py:class:`mlflow.entities.SpanStatusCode` enum or a string
            representation of it like "OK", "ERROR".
        description: Description of the status. This should be only set when the status
            is ERROR, otherwise it will be ignored.
    """

    status_code: SpanStatusCode
    description: str = ""

    def __post_init__(self):
        """
        If user provides a string status code, validate it and convert to
        the corresponding enum value.
        """
        if isinstance(self.status_code, str):
            try:
                self.status_code = SpanStatusCode(self.status_code)
            except ValueError:
                raise MlflowException(
                    f"{self.status_code} is not a valid SpanStatusCode value. "
                    f"Please use one of {[status_code.value for status_code in SpanStatusCode]}",
                    error_code=INVALID_PARAMETER_VALUE,
                )

    def to_otel_status(self) -> trace_api.Status:
        """
        Convert :py:class:`mlflow.entities.SpanStatus` object to OpenTelemetry status object.

        :meta private:
        """
        try:
            status_code = getattr(trace_api.StatusCode, self.status_code.name)
        except AttributeError:
            raise MlflowException(
                f"Invalid status code: {self.status_code}", error_code=INVALID_PARAMETER_VALUE
            )
        return trace_api.Status(status_code, self.description)

    @classmethod
    def from_otel_status(cls, otel_status: trace_api.Status) -> SpanStatus:
        """
        Convert OpenTelemetry status object to our status object.

        :meta private:
        """
        try:
            status_code = SpanStatusCode(otel_status.status_code.name)
        except ValueError:
            raise MlflowException(
                f"Got invalid status code from OpenTelemetry: {otel_status.status_code}",
                error_code=INVALID_PARAMETER_VALUE,
            )
        return cls(status_code, otel_status.description or "")

    def to_otel_proto_status(self):
        """
        Convert to OpenTelemetry protobuf Status for OTLP export.

        :meta private:
        """
        status = OtelStatus()
        if self.status_code == SpanStatusCode.OK:
            status.code = OtelStatus.StatusCode.STATUS_CODE_OK
        elif self.status_code == SpanStatusCode.ERROR:
            status.code = OtelStatus.StatusCode.STATUS_CODE_ERROR
        else:
            status.code = OtelStatus.StatusCode.STATUS_CODE_UNSET

        if self.description:
            status.message = self.description

        return status

    @classmethod
    def from_otel_proto_status(cls, otel_proto_status) -> SpanStatus:
        """
        Create a SpanStatus from an OpenTelemetry protobuf Status.

        :meta private:
        """
        # Map protobuf status codes to SpanStatusCode
        if otel_proto_status.code == OtelStatus.STATUS_CODE_OK:
            status_code = SpanStatusCode.OK
        elif otel_proto_status.code == OtelStatus.STATUS_CODE_ERROR:
            status_code = SpanStatusCode.ERROR
        else:
            status_code = SpanStatusCode.UNSET

        return cls(status_code, otel_proto_status.message or "")
```

--------------------------------------------------------------------------------

---[FILE: trace.py]---
Location: mlflow-master/mlflow/entities/trace.py

```python
from __future__ import annotations

import json
import logging
import re
from dataclasses import dataclass
from typing import TYPE_CHECKING, Any, Literal

from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.entities.span import Span, SpanType
from mlflow.entities.trace_data import TraceData
from mlflow.entities.trace_info import TraceInfo
from mlflow.entities.trace_info_v2 import TraceInfoV2
from mlflow.environment_variables import MLFLOW_TRACING_SQL_WAREHOUSE_ID
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.protos.service_pb2 import Trace as ProtoTrace

if TYPE_CHECKING:
    from mlflow.entities.assessment import Assessment

_logger = logging.getLogger(__name__)


@dataclass
class Trace(_MlflowObject):
    """A trace object.

    Args:
        info: A lightweight object that contains the metadata of a trace.
        data: A container object that holds the spans data of a trace.
    """

    info: TraceInfo
    data: TraceData

    def __post_init__(self):
        if isinstance(self.info, TraceInfoV2):
            self.info = self.info.to_v3(request=self.data.request, response=self.data.response)

    def __repr__(self) -> str:
        return f"Trace(trace_id={self.info.trace_id})"

    def to_dict(self) -> dict[str, Any]:
        return {"info": self.info.to_dict(), "data": self.data.to_dict()}

    def to_json(self, pretty=False) -> str:
        from mlflow.tracing.utils import TraceJSONEncoder

        return json.dumps(self.to_dict(), cls=TraceJSONEncoder, indent=2 if pretty else None)

    @classmethod
    def from_dict(cls, trace_dict: dict[str, Any]) -> Trace:
        info = trace_dict.get("info")
        data = trace_dict.get("data")
        if info is None or data is None:
            raise MlflowException(
                "Unable to parse Trace from dictionary. Expected keys: 'info' and 'data'. "
                f"Received keys: {list(trace_dict.keys())}",
                error_code=INVALID_PARAMETER_VALUE,
            )

        return cls(
            info=TraceInfo.from_dict(info),
            data=TraceData.from_dict(data),
        )

    @classmethod
    def from_json(cls, trace_json: str) -> Trace:
        try:
            trace_dict = json.loads(trace_json)
        except json.JSONDecodeError as e:
            raise MlflowException(
                f"Unable to parse trace JSON: {trace_json}. Error: {e}",
                error_code=INVALID_PARAMETER_VALUE,
            )
        return cls.from_dict(trace_dict)

    def _serialize_for_mimebundle(self):
        # databricks notebooks will use the trace ID to
        # fetch the trace from the backend. including the
        # full JSON can cause notebooks to exceed size limits
        return json.dumps(
            {
                "trace_id": self.info.trace_id,
                # TODO: remove this once sql_warehouse_id
                # is optional in the v4 tracing APIs
                "sql_warehouse_id": MLFLOW_TRACING_SQL_WAREHOUSE_ID.get(),
            }
        )

    def _repr_mimebundle_(self, include=None, exclude=None):
        """
        This method is used to trigger custom display logic in IPython notebooks.
        See https://ipython.readthedocs.io/en/stable/config/integrating.html#MyObject
        for more details.

        At the moment, the only supported MIME type is "application/databricks.mlflow.trace",
        which contains a JSON representation of the Trace object. This object is deserialized
        in Databricks notebooks to display the Trace object in a nicer UI.
        """
        from mlflow.tracing.display import (
            get_display_handler,
            get_notebook_iframe_html,
            is_using_tracking_server,
        )
        from mlflow.utils.databricks_utils import is_in_databricks_runtime

        bundle = {"text/plain": repr(self)}

        if not get_display_handler().disabled:
            if is_in_databricks_runtime():
                bundle["application/databricks.mlflow.trace"] = self._serialize_for_mimebundle()
            elif is_using_tracking_server():
                bundle["text/html"] = get_notebook_iframe_html([self])

        return bundle

    def to_pandas_dataframe_row(self) -> dict[str, Any]:
        return {
            "trace_id": self.info.trace_id,
            "trace": self.to_json(),  # json string to be compatible with Spark DataFrame
            "client_request_id": self.info.client_request_id,
            "state": self.info.state,
            "request_time": self.info.request_time,
            "execution_duration": self.info.execution_duration,
            "request": self._deserialize_json_attr(self.data.request),
            "response": self._deserialize_json_attr(self.data.response),
            "trace_metadata": self.info.trace_metadata,
            "tags": self.info.tags,
            "spans": [span.to_dict() for span in self.data.spans],
            "assessments": [assessment.to_dictionary() for assessment in self.info.assessments],
        }

    def _deserialize_json_attr(self, value: str):
        try:
            return json.loads(value)
        except Exception:
            _logger.debug(f"Failed to deserialize JSON attribute: {value}", exc_info=True)
            return value

    def search_spans(
        self,
        span_type: SpanType | None = None,
        name: str | re.Pattern | None = None,
        span_id: str | None = None,
    ) -> list[Span]:
        """
        Search for spans that match the given criteria within the trace.

        Args:
            span_type: The type of the span to search for.
            name: The name of the span to search for. This can be a string or a regular expression.
            span_id: The ID of the span to search for.

        Returns:
            A list of spans that match the given criteria.
            If there is no match, an empty list is returned.

        .. code-block:: python

            import mlflow
            import re
            from mlflow.entities import SpanType


            @mlflow.trace(span_type=SpanType.CHAIN)
            def run(x: int) -> int:
                x = add_one(x)
                x = add_two(x)
                x = multiply_by_two(x)
                return x


            @mlflow.trace(span_type=SpanType.TOOL)
            def add_one(x: int) -> int:
                return x + 1


            @mlflow.trace(span_type=SpanType.TOOL)
            def add_two(x: int) -> int:
                return x + 2


            @mlflow.trace(span_type=SpanType.TOOL)
            def multiply_by_two(x: int) -> int:
                return x * 2


            # Run the function and get the trace
            y = run(2)
            trace_id = mlflow.get_last_active_trace_id()
            trace = mlflow.get_trace(trace_id)

            # 1. Search spans by name (exact match)
            spans = trace.search_spans(name="add_one")
            print(spans)
            # Output: [Span(name='add_one', ...)]

            # 2. Search spans by name (regular expression)
            pattern = re.compile(r"add.*")
            spans = trace.search_spans(name=pattern)
            print(spans)
            # Output: [Span(name='add_one', ...), Span(name='add_two', ...)]

            # 3. Search spans by type
            spans = trace.search_spans(span_type=SpanType.LLM)
            print(spans)
            # Output: [Span(name='run', ...)]

            # 4. Search spans by name and type
            spans = trace.search_spans(name="add_one", span_type=SpanType.TOOL)
            print(spans)
            # Output: [Span(name='add_one', ...)]
        """

        def _match_name(span: Span) -> bool:
            if isinstance(name, str):
                return span.name == name
            elif isinstance(name, re.Pattern):
                return name.search(span.name) is not None
            elif name is None:
                return True
            else:
                raise MlflowException(
                    f"Invalid type for 'name'. Expected str or re.Pattern. Got: {type(name)}",
                    error_code=INVALID_PARAMETER_VALUE,
                )

        def _match_type(span: Span) -> bool:
            if isinstance(span_type, str):
                return span.span_type == span_type
            elif span_type is None:
                return True
            else:
                raise MlflowException(
                    "Invalid type for 'span_type'. Expected str or mlflow.entities.SpanType. "
                    f"Got: {type(span_type)}",
                    error_code=INVALID_PARAMETER_VALUE,
                )

        def _match_id(span: Span) -> bool:
            if span_id is None:
                return True
            else:
                return span.span_id == span_id

        return [
            span
            for span in self.data.spans
            if _match_name(span) and _match_type(span) and _match_id(span)
        ]

    def search_assessments(
        self,
        name: str | None = None,
        *,
        span_id: str | None = None,
        all: bool = False,
        type: Literal["expectation", "feedback"] | None = None,
    ) -> list["Assessment"]:
        """
        Get assessments for a given name / span ID. By default, this only returns assessments
        that are valid (i.e. have not been overridden by another assessment). To return all
        assessments, specify `all=True`.

        Args:
            name: The name of the assessment to get. If not provided, this will match
                all assessment names.
            span_id: The span ID to get assessments for.
                If not provided, this will match all spans.
            all: If True, return all assessments regardless of validity.
            type: The type of assessment to get (one of "feedback" or "expectation").
                If not provided, this will match all assessment types.

        Returns:
            A list of assessments that meet the given conditions.
        """

        def validate_type(assessment: Assessment) -> bool:
            from mlflow.entities.assessment import Expectation, Feedback

            if type == "expectation":
                return isinstance(assessment, Expectation)
            elif type == "feedback":
                return isinstance(assessment, Feedback)

            return True

        return [
            assessment
            for assessment in self.info.assessments
            if (name is None or assessment.name == name)
            and (span_id is None or assessment.span_id == span_id)
            # valid defaults to true, so Nones are valid
            and (all or assessment.valid in (True, None))
            and (type is None or validate_type(assessment))
        ]

    @staticmethod
    def pandas_dataframe_columns() -> list[str]:
        return [
            "trace_id",
            "trace",
            "client_request_id",
            "state",
            "request_time",
            "execution_duration",
            "request",
            "response",
            "trace_metadata",
            "tags",
            "spans",
            "assessments",
        ]

    def to_proto(self):
        """
        Convert into a proto object to sent to the MLflow backend.
        """

        return ProtoTrace(
            trace_info=self.info.to_proto(),
            spans=[span.to_otel_proto() for span in self.data.spans],
        )

    @classmethod
    def from_proto(cls, proto: ProtoTrace) -> "Trace":
        return cls(
            info=TraceInfo.from_proto(proto.trace_info),
            data=TraceData(spans=[Span.from_otel_proto(span) for span in proto.spans]),
        )
```

--------------------------------------------------------------------------------

---[FILE: trace_data.py]---
Location: mlflow-master/mlflow/entities/trace_data.py

```python
from collections import Counter
from dataclasses import dataclass, field
from typing import Any

from mlflow.entities import Span
from mlflow.tracing.constant import SpanAttributeKey
from mlflow.utils.annotations import deprecated


@dataclass
class TraceData:
    """A container object that holds the spans data of a trace.

    Args:
        spans: List of spans that are part of the trace.
    """

    spans: list[Span] = field(default_factory=list)

    # NB: Custom constructor to allow passing additional kwargs for backward compatibility for
    # DBX agent evaluator. Once they migrates to trace V3 schema, we can remove this.
    def __init__(self, spans: list[Span] | None = None, **kwargs):
        self.spans = spans or []

    @classmethod
    def from_dict(cls, d):
        if not isinstance(d, dict):
            raise TypeError(f"TraceData.from_dict() expects a dictionary. Got: {type(d).__name__}")
        return cls(spans=[Span.from_dict(span) for span in d.get("spans", [])])

    def to_dict(self) -> dict[str, Any]:
        return {"spans": [span.to_dict() for span in self.spans]}

    # TODO: remove this property in 3.7.0
    @property
    @deprecated(since="3.6.0", alternative="trace.search_spans(name=...)")
    def intermediate_outputs(self) -> dict[str, Any] | None:
        """
        .. deprecated:: 3.6.0
            Use `trace.search_spans(name=...)` to search for spans and get the outputs.

        Returns intermediate outputs produced by the model or agent while handling the request.
        There are mainly two flows to return intermediate outputs:
        1. When a trace is generate by the `mlflow.log_trace` API,
        return `intermediate_outputs` attribute of the span.
        2. When a trace is created normally with a tree of spans,
        aggregate the outputs of non-root spans.
        """
        root_span = self._get_root_span()
        if root_span and root_span.get_attribute(SpanAttributeKey.INTERMEDIATE_OUTPUTS):
            return root_span.get_attribute(SpanAttributeKey.INTERMEDIATE_OUTPUTS)

        if len(self.spans) > 1:
            result = {}
            # spans may have duplicate names, so deduplicate the names by appending an index number.
            span_name_counter = Counter(span.name for span in self.spans)
            span_name_counter = {name: 1 for name, count in span_name_counter.items() if count > 1}
            for span in self.spans:
                span_name = span.name
                if count := span_name_counter.get(span_name):
                    span_name_counter[span_name] += 1
                    span_name = f"{span_name}_{count}"
                if span.parent_id and span.outputs is not None:
                    result[span_name] = span.outputs
            return result

    def _get_root_span(self) -> Span | None:
        for span in self.spans:
            if span.parent_id is None:
                return span

    # `request` and `response` are preserved for backward compatibility with v2
    @property
    def request(self) -> str | None:
        if span := self._get_root_span():
            # Accessing the OTel span directly get serialized value directly.
            return span._span.attributes.get(SpanAttributeKey.INPUTS)
        return None

    @property
    def response(self) -> str | None:
        if span := self._get_root_span():
            # Accessing the OTel span directly get serialized value directly.
            return span._span.attributes.get(SpanAttributeKey.OUTPUTS)
        return None
```

--------------------------------------------------------------------------------

---[FILE: trace_info.py]---
Location: mlflow-master/mlflow/entities/trace_info.py

```python
import json
from dataclasses import dataclass, field
from typing import Any

from google.protobuf.duration_pb2 import Duration
from google.protobuf.json_format import MessageToDict
from google.protobuf.timestamp_pb2 import Timestamp

from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.entities.assessment import Assessment
from mlflow.entities.trace_location import TraceLocation
from mlflow.entities.trace_state import TraceState
from mlflow.entities.trace_status import TraceStatus
from mlflow.protos.databricks_tracing_pb2 import TraceInfo as ProtoTraceInfoV4
from mlflow.protos.service_pb2 import TraceInfoV3 as ProtoTraceInfoV3
from mlflow.tracing.constant import TraceMetadataKey


@dataclass
class TraceInfo(_MlflowObject):
    """Metadata about a trace, such as its ID, location, timestamp, etc.

    Args:
        trace_id: The primary identifier for the trace.
        trace_location: The location where the trace is stored, represented as
            a :py:class:`~mlflow.entities.TraceLocation` object. MLflow currently
            support MLflow Experiment or Databricks Inference Table as a trace location.
        request_time: Start time of the trace, in milliseconds.
        state: State of the trace, represented as a :py:class:`~mlflow.entities.TraceState`
            enum. Can be one of [`OK`, `ERROR`, `IN_PROGRESS`, `STATE_UNSPECIFIED`].
        request_preview: Request to the model/agent, equivalent to the input of the root,
            span but JSON-encoded and can be truncated.
        response_preview: Response from the model/agent, equivalent to the output of the
            root span but JSON-encoded and can be truncated.
        client_request_id: Client supplied request ID associated with the trace. This
            could be used to identify the trace/request from an external system that
            produced the trace, e.g., a session ID in a web application.
        execution_duration: Duration of the trace, in milliseconds.
        trace_metadata: Key-value pairs associated with the trace. They are designed
            for immutable values like run ID associated with the trace.
        tags: Tags associated with the trace. They are designed for mutable values,
            that can be updated after the trace is created via MLflow UI or API.
        assessments: List of assessments associated with the trace.
    """

    trace_id: str
    trace_location: TraceLocation
    request_time: int
    state: TraceState
    request_preview: str | None = None
    response_preview: str | None = None
    client_request_id: str | None = None
    execution_duration: int | None = None
    trace_metadata: dict[str, str] = field(default_factory=dict)
    tags: dict[str, str] = field(default_factory=dict)
    assessments: list[Assessment] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        """Convert the TraceInfoV3 object to a dictionary."""
        res = MessageToDict(self.to_proto(), preserving_proto_field_name=True)
        if self.execution_duration is not None:
            res.pop("execution_duration", None)
            res["execution_duration_ms"] = self.execution_duration
        # override trace_id to be the same as trace_info.trace_id since it's parsed
        # when converting to proto if it's v4
        res["trace_id"] = self.trace_id
        return res

    @classmethod
    def from_dict(cls, d: dict[str, Any]) -> "TraceInfo":
        """Create a TraceInfoV3 object from a dictionary."""
        if "request_id" in d:
            from mlflow.entities.trace_info_v2 import TraceInfoV2

            return TraceInfoV2.from_dict(d).to_v3()

        d = d.copy()
        if assessments := d.get("assessments"):
            d["assessments"] = [Assessment.from_dictionary(a) for a in assessments]

        if trace_location := d.get("trace_location"):
            d["trace_location"] = TraceLocation.from_dict(trace_location)

        if state := d.get("state"):
            d["state"] = TraceState(state)

        if request_time := d.get("request_time"):
            timestamp = Timestamp()
            timestamp.FromJsonString(request_time)
            d["request_time"] = timestamp.ToMilliseconds()

        if (execution_duration := d.pop("execution_duration_ms", None)) is not None:
            d["execution_duration"] = execution_duration

        return cls(**d)

    def to_proto(self) -> ProtoTraceInfoV3 | ProtoTraceInfoV4:
        from mlflow.entities.trace_info_v2 import _truncate_request_metadata, _truncate_tags

        if self._is_v4():
            from mlflow.utils.databricks_tracing_utils import trace_info_to_v4_proto

            return trace_info_to_v4_proto(self)

        request_time = Timestamp()
        request_time.FromMilliseconds(self.request_time)
        execution_duration = None
        if self.execution_duration is not None:
            execution_duration = Duration()
            execution_duration.FromMilliseconds(self.execution_duration)

        return ProtoTraceInfoV3(
            trace_id=self.trace_id,
            client_request_id=self.client_request_id,
            trace_location=self.trace_location.to_proto(),
            request_preview=self.request_preview,
            response_preview=self.response_preview,
            request_time=request_time,
            execution_duration=execution_duration,
            state=self.state.to_proto(),
            trace_metadata=_truncate_request_metadata(self.trace_metadata),
            tags=_truncate_tags(self.tags),
            assessments=[a.to_proto() for a in self.assessments],
        )

    @classmethod
    def from_proto(cls, proto) -> "TraceInfo":
        if "request_id" in proto.DESCRIPTOR.fields_by_name:
            from mlflow.entities.trace_info_v2 import TraceInfoV2

            return TraceInfoV2.from_proto(proto).to_v3()

        # import inside the function to avoid introducing top-level dependency on
        # mlflow.tracing.utils in entities module
        from mlflow.tracing.utils import construct_trace_id_v4

        trace_location = TraceLocation.from_proto(proto.trace_location)
        if trace_location.uc_schema:
            trace_id = construct_trace_id_v4(
                location=f"{trace_location.uc_schema.catalog_name}.{trace_location.uc_schema.schema_name}",
                trace_id=proto.trace_id,
            )
        else:
            trace_id = proto.trace_id

        return cls(
            trace_id=trace_id,
            client_request_id=(
                proto.client_request_id if proto.HasField("client_request_id") else None
            ),
            trace_location=trace_location,
            request_preview=proto.request_preview if proto.HasField("request_preview") else None,
            response_preview=proto.response_preview if proto.HasField("response_preview") else None,
            request_time=proto.request_time.ToMilliseconds(),
            execution_duration=(
                proto.execution_duration.ToMilliseconds()
                if proto.HasField("execution_duration")
                else None
            ),
            state=TraceState.from_proto(proto.state),
            trace_metadata=dict(proto.trace_metadata),
            tags=dict(proto.tags),
            assessments=[Assessment.from_proto(a) for a in proto.assessments],
        )

    # Aliases for backward compatibility with V2 format
    @property
    def request_id(self) -> str:
        """Deprecated. Use `trace_id` instead."""
        return self.trace_id

    @property
    def experiment_id(self) -> str | None:
        """
        An MLflow experiment ID associated with the trace, if the trace is stored
        in MLflow tracking server. Otherwise, None.
        """
        return (
            self.trace_location.mlflow_experiment
            and self.trace_location.mlflow_experiment.experiment_id
        )

    @experiment_id.setter
    def experiment_id(self, value: str | None) -> None:
        self.trace_location.mlflow_experiment.experiment_id = value

    @property
    def request_metadata(self) -> dict[str, str]:
        """Deprecated. Use `trace_metadata` instead."""
        return self.trace_metadata

    @property
    def timestamp_ms(self) -> int:
        return self.request_time

    @timestamp_ms.setter
    def timestamp_ms(self, value: int) -> None:
        self.request_time = value

    @property
    def execution_time_ms(self) -> int | None:
        return self.execution_duration

    @execution_time_ms.setter
    def execution_time_ms(self, value: int | None) -> None:
        self.execution_duration = value

    @property
    def status(self) -> TraceStatus:
        """Deprecated. Use `state` instead."""
        return TraceStatus.from_state(self.state)

    @status.setter
    def status(self, value: TraceStatus) -> None:
        self.state = value.to_state()

    @property
    def token_usage(self) -> dict[str, int] | None:
        """
        Returns the aggregated token usage for the trace.

        Returns:
            A dictionary containing the aggregated LLM token usage for the trace.
            - "input_tokens": The total number of input tokens.
            - "output_tokens": The total number of output tokens.
            - "total_tokens": Sum of input and output tokens.

        .. note::

            The token usage tracking is not supported for all LLM providers.
            Refer to the MLflow Tracing documentation for which providers
            support token usage tracking.
        """
        if usage_json := self.trace_metadata.get(TraceMetadataKey.TOKEN_USAGE):
            return json.loads(usage_json)
        return None

    def _is_v4(self) -> bool:
        return self.trace_location.uc_schema is not None
```

--------------------------------------------------------------------------------

---[FILE: trace_info_v2.py]---
Location: mlflow-master/mlflow/entities/trace_info_v2.py

```python
from dataclasses import asdict, dataclass, field
from typing import Any

from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.entities.assessment import Assessment
from mlflow.entities.trace_info import TraceInfo
from mlflow.entities.trace_location import TraceLocation
from mlflow.entities.trace_status import TraceStatus
from mlflow.protos.service_pb2 import TraceInfo as ProtoTraceInfo
from mlflow.protos.service_pb2 import TraceRequestMetadata as ProtoTraceRequestMetadata
from mlflow.protos.service_pb2 import TraceTag as ProtoTraceTag


def _truncate_request_metadata(d: dict[str, Any]) -> dict[str, str]:
    from mlflow.tracing.constant import MAX_CHARS_IN_TRACE_INFO_METADATA

    return {
        k[:MAX_CHARS_IN_TRACE_INFO_METADATA]: str(v)[:MAX_CHARS_IN_TRACE_INFO_METADATA]
        for k, v in d.items()
    }


def _truncate_tags(d: dict[str, Any]) -> dict[str, str]:
    from mlflow.tracing.constant import (
        MAX_CHARS_IN_TRACE_INFO_TAGS_KEY,
        MAX_CHARS_IN_TRACE_INFO_TAGS_VALUE,
    )

    return {
        k[:MAX_CHARS_IN_TRACE_INFO_TAGS_KEY]: str(v)[:MAX_CHARS_IN_TRACE_INFO_TAGS_VALUE]
        for k, v in d.items()
    }


@dataclass
class TraceInfoV2(_MlflowObject):
    """Metadata about a trace.

    Args:
        request_id: id of the trace.
        experiment_id: id of the experiment.
        timestamp_ms: start time of the trace, in milliseconds.
        execution_time_ms: duration of the trace, in milliseconds.
        status: status of the trace.
        request_metadata: Key-value pairs associated with the trace. Request metadata are designed
            for immutable values like run ID associated with the trace.
        tags: Tags associated with the trace. Tags are designed for mutable values like trace name,
            that can be updated by the users after the trace is created, unlike request_metadata.
    """

    request_id: str
    experiment_id: str
    timestamp_ms: int
    execution_time_ms: int | None
    status: TraceStatus
    request_metadata: dict[str, str] = field(default_factory=dict)
    tags: dict[str, str] = field(default_factory=dict)
    assessments: list[Assessment] = field(default_factory=list)

    def __eq__(self, other):
        if type(other) is type(self):
            return self.__dict__ == other.__dict__
        return False

    @property
    def trace_id(self) -> str:
        """Returns the trace ID of the trace info."""
        return self.request_id

    def to_proto(self):
        proto = ProtoTraceInfo()
        proto.request_id = self.request_id
        proto.experiment_id = self.experiment_id
        proto.timestamp_ms = self.timestamp_ms
        # NB: Proto setter does not support nullable fields (even with 'optional' keyword),
        # so we substitute None with 0 for execution_time_ms. This should be not too confusing
        # as we only put None when starting a trace i.e. the execution time is actually 0.
        proto.execution_time_ms = self.execution_time_ms or 0
        proto.status = self.status.to_proto()

        request_metadata = []
        for key, value in _truncate_request_metadata(self.request_metadata).items():
            attr = ProtoTraceRequestMetadata()
            attr.key = key
            attr.value = value
            request_metadata.append(attr)
        proto.request_metadata.extend(request_metadata)

        tags = []
        for key, value in _truncate_tags(self.tags).items():
            tag = ProtoTraceTag()
            tag.key = key
            tag.value = str(value)
            tags.append(tag)

        proto.tags.extend(tags)
        return proto

    @classmethod
    def from_proto(cls, proto, assessments=None):
        return cls(
            request_id=proto.request_id,
            experiment_id=proto.experiment_id,
            timestamp_ms=proto.timestamp_ms,
            execution_time_ms=proto.execution_time_ms,
            status=TraceStatus.from_proto(proto.status),
            request_metadata={attr.key: attr.value for attr in proto.request_metadata},
            tags={tag.key: tag.value for tag in proto.tags},
            assessments=assessments or [],
        )

    def to_dict(self):
        """
        Convert trace info to a dictionary for persistence.
        Update status field to the string value for serialization.
        """
        trace_info_dict = asdict(self)
        trace_info_dict["status"] = self.status.value
        # Client request ID field is only added for internal use, and should not be
        # serialized for V2 TraceInfo.
        trace_info_dict.pop("client_request_id", None)
        return trace_info_dict

    @classmethod
    def from_dict(cls, trace_info_dict):
        """
        Convert trace info dictionary to TraceInfo object.
        """
        if "status" not in trace_info_dict:
            raise ValueError("status is required in trace info dictionary.")
        trace_info_dict["status"] = TraceStatus(trace_info_dict["status"])
        return cls(**trace_info_dict)

    def to_v3(self, request: str | None = None, response: str | None = None) -> TraceInfo:
        return TraceInfo(
            trace_id=self.request_id,
            trace_location=TraceLocation.from_experiment_id(self.experiment_id),
            request_preview=request,
            response_preview=response,
            request_time=self.timestamp_ms,
            execution_duration=self.execution_time_ms,
            state=self.status.to_state(),
            trace_metadata=self.request_metadata.copy(),
            tags=self.tags,
            assessments=self.assessments,
        )

    @classmethod
    def from_v3(cls, trace_info: TraceInfo) -> "TraceInfoV2":
        return cls(
            request_id=trace_info.trace_id,
            experiment_id=trace_info.experiment_id,
            timestamp_ms=trace_info.request_time,
            execution_time_ms=trace_info.execution_duration,
            status=TraceStatus.from_state(trace_info.state),
            request_metadata=trace_info.trace_metadata.copy(),
            tags=trace_info.tags,
        )
```

--------------------------------------------------------------------------------

````
