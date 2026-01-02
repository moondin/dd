---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 791
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 791 of 991)

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

---[FILE: test_trace_info.py]---
Location: mlflow-master/tests/entities/test_trace_info.py

```python
from unittest import mock

import pytest
from google.protobuf.timestamp_pb2 import Timestamp

from mlflow.entities import (
    AssessmentError,
    AssessmentSource,
    Expectation,
    Feedback,
)
from mlflow.entities.trace_info import TraceInfo
from mlflow.entities.trace_location import TraceLocation
from mlflow.entities.trace_state import TraceState
from mlflow.protos.service_pb2 import TraceInfoV3 as ProtoTraceInfoV3
from mlflow.tracing.constant import TRACE_SCHEMA_VERSION, TRACE_SCHEMA_VERSION_KEY


def test_trace_info():
    assessments = [
        Feedback(
            trace_id="trace_id",
            name="feedback_test",
            value=0.9,
            source=AssessmentSource(source_type="HUMAN", source_id="user_1"),
            create_time_ms=123456789,
            last_update_time_ms=123456789,
            error=AssessmentError(error_code="error_code", error_message="Error message"),
            rationale="Rationale text",
            metadata={"key1": "value1"},
            span_id="span_id",
        ),
        Expectation(
            trace_id="trace_id",
            name="expectation_test",
            value=0.8,
            source=AssessmentSource(source_type="HUMAN", source_id="user_1"),
            create_time_ms=123456789,
            last_update_time_ms=123456789,
            metadata={"key1": "value1"},
            span_id="span_id",
        ),
    ]
    trace_info = TraceInfo(
        trace_id="trace_id",
        client_request_id="client_request_id",
        trace_location=TraceLocation.from_experiment_id("123"),
        request_preview="request",
        response_preview="response",
        request_time=1234567890,
        execution_duration=100,
        state=TraceState.OK,
        trace_metadata={"foo": "bar", TRACE_SCHEMA_VERSION_KEY: str(TRACE_SCHEMA_VERSION)},
        tags={"baz": "qux"},
        assessments=assessments,
    )

    from_proto = TraceInfo.from_proto(trace_info.to_proto())
    assert isinstance(from_proto, TraceInfo)
    assert from_proto == trace_info

    trace_info_dict = trace_info.to_dict()
    assert trace_info_dict == {
        "trace_id": "trace_id",
        "client_request_id": "client_request_id",
        "trace_location": {
            "type": "MLFLOW_EXPERIMENT",
            "mlflow_experiment": {"experiment_id": "123"},
        },
        "request_preview": "request",
        "response_preview": "response",
        "request_time": "1970-01-15T06:56:07.890Z",
        "execution_duration_ms": 100,
        "state": "OK",
        "trace_metadata": {"foo": "bar", TRACE_SCHEMA_VERSION_KEY: str(TRACE_SCHEMA_VERSION)},
        "assessments": [
            {
                "assessment_name": "feedback_test",
                "trace_id": "trace_id",
                "span_id": "span_id",
                "source": {"source_type": "HUMAN", "source_id": "user_1"},
                "create_time": "1970-01-02T10:17:36.789Z",
                "last_update_time": "1970-01-02T10:17:36.789Z",
                "feedback": {
                    "value": 0.9,
                    "error": {"error_code": "error_code", "error_message": "Error message"},
                },
                "rationale": "Rationale text",
                "metadata": {"key1": "value1"},
                "valid": True,
            },
            {
                "assessment_name": "expectation_test",
                "trace_id": "trace_id",
                "span_id": "span_id",
                "source": {"source_type": "HUMAN", "source_id": "user_1"},
                "create_time": "1970-01-02T10:17:36.789Z",
                "last_update_time": "1970-01-02T10:17:36.789Z",
                "expectation": {"value": 0.8},
                "metadata": {"key1": "value1"},
            },
        ],
        "tags": {"baz": "qux"},
    }
    assert TraceInfo.from_dict(trace_info_dict) == trace_info


def test_backwards_compatibility_with_v2():
    trace_info = TraceInfo(
        trace_id="trace_id",
        client_request_id="client_request_id",
        trace_location=TraceLocation.from_experiment_id("123"),
        request_preview="'request'",
        response_preview="'response'",
        request_time=1234567890,
        state=TraceState.OK,
        trace_metadata={"foo": "bar"},
        tags={"baz": "qux"},
    )

    assert trace_info.request_id == trace_info.trace_id
    assert trace_info.experiment_id == "123"
    assert trace_info.request_metadata == {"foo": "bar"}
    assert trace_info.timestamp_ms == 1234567890
    assert trace_info.execution_time_ms is None


def test_trace_info_v4():
    trace_id = "trace:/catalog.schema/test_trace_id"
    trace_info_v4 = TraceInfo(
        # v4 trace info has URI-format trace id and uc schema location
        trace_id=trace_id,
        trace_location=TraceLocation.from_databricks_uc_schema(
            catalog_name="catalog", schema_name="schema"
        ),
        request_time=0,
        state=TraceState.OK,
        request_preview="request",
        response_preview="response",
        client_request_id="client_request_id",
        tags={"key": "value"},
    )
    dict_trace_info_v4 = trace_info_v4.to_dict()
    assert dict_trace_info_v4 == {
        "trace_id": trace_id,
        "trace_location": {
            "type": "UC_SCHEMA",
            "uc_schema": {
                "catalog_name": "catalog",
                "schema_name": "schema",
                "otel_spans_table_name": "mlflow_experiment_trace_otel_spans",
                "otel_logs_table_name": "mlflow_experiment_trace_otel_logs",
            },
        },
        "request_time": mock.ANY,
        "state": "OK",
        "request_preview": "request",
        "response_preview": "response",
        "client_request_id": "client_request_id",
        "tags": {"key": "value"},
    }
    assert TraceInfo.from_dict(dict_trace_info_v4) == trace_info_v4

    proto_trace_info_v4 = trace_info_v4.to_proto()
    assert proto_trace_info_v4.trace_id == "test_trace_id"
    assert proto_trace_info_v4.trace_location.uc_schema.catalog_name == "catalog"
    assert proto_trace_info_v4.trace_location.uc_schema.schema_name == "schema"
    assert proto_trace_info_v4.state == 1
    assert proto_trace_info_v4.request_preview == "request"
    assert proto_trace_info_v4.response_preview == "response"
    assert proto_trace_info_v4.client_request_id == "client_request_id"
    assert proto_trace_info_v4.tags == {"key": "value"}
    assert len(proto_trace_info_v4.assessments) == 0

    assert TraceInfo.from_proto(proto_trace_info_v4) == trace_info_v4


@pytest.mark.parametrize("client_request_id", [None, "client_request_id"])
@pytest.mark.parametrize(
    "assessments",
    [
        [],
        # Simple feedback
        [
            Feedback(
                trace_id="trace_id",
                name="relevance",
                value="The answer is correct",
                rationale="Rationale text",
                source=AssessmentSource(source_type="LLM_JUDGE", source_id="gpt"),
                metadata={"key1": "value1"},
                span_id="span_id",
            )
        ],
        # Feedback with error
        [
            Feedback(
                trace_id="trace_id",
                name="relevance",
                error=AssessmentError(error_code="error_code", error_message="Error message"),
            )
        ],
        # Simple expectation
        [Expectation(trace_id="trace_id", name="relevance", value=0.8)],
        # Complex expectation
        [
            Expectation(
                trace_id="trace_id",
                name="relevance",
                value={"complex": {"expectation": ["structure"]}},
            )
        ],
    ],
)
def test_trace_info_proto(client_request_id, assessments):
    # TraceInfo -> proto
    trace_info = TraceInfo(
        trace_id="request_id",
        client_request_id=client_request_id,
        trace_location=TraceLocation.from_experiment_id("test_experiment"),
        request_preview="request",
        response_preview="response",
        request_time=0,
        execution_duration=1,
        state=TraceState.OK,
        trace_metadata={"foo": "bar", TRACE_SCHEMA_VERSION_KEY: str(TRACE_SCHEMA_VERSION)},
        tags={"baz": "qux"},
        assessments=assessments,
    )
    proto_trace_info = trace_info.to_proto()
    # proto -> TraceInfo
    assert TraceInfo.from_proto(proto_trace_info) == trace_info

    # TraceInfo -> dict
    dict_trace_info = trace_info.to_dict()
    assert TraceInfo.from_dict(dict_trace_info) == trace_info


def test_from_proto_excludes_undefined_fields():
    """
    Test that undefined fields (client_request_id, execution_duration) are excluded when
    constructing a TraceInfo from a protobuf message instance that does not define these fields.
    """
    # Manually create a protobuf without setting client_request_id or execution_duration fields
    request_time = Timestamp()
    request_time.FromMilliseconds(1234567890)

    proto = ProtoTraceInfoV3(
        trace_id="trace_id",
        # Intentionally NOT setting client_request_id
        # Intentionally NOT setting execution_duration
        trace_location=TraceLocation.from_experiment_id("123").to_proto(),
        request_preview="request",
        response_preview="response",
        request_time=request_time,
        state=TraceState.OK.to_proto(),
    )

    # Verify HasField returns false for undefined fields
    assert not proto.HasField("client_request_id")
    assert not proto.HasField("execution_duration")

    # Convert to TraceInfo
    trace_info = TraceInfo.from_proto(proto)

    # Verify undefined fields are None
    assert trace_info.client_request_id is None
    assert trace_info.execution_duration is None

    # Verify other fields are correctly populated
    assert trace_info.trace_id == "trace_id"
    assert trace_info.experiment_id == "123"
    assert trace_info.request_preview == "request"
    assert trace_info.response_preview == "response"
    assert trace_info.request_time == 1234567890
    assert trace_info.state == TraceState.OK


def test_trace_info_from_proto_updates_schema_version():
    # Create a proto with old schema version in metadata
    request_time = Timestamp()
    request_time.FromMilliseconds(1234567890)

    proto = ProtoTraceInfoV3(
        trace_id="test_trace_id",
        trace_location=TraceLocation.from_experiment_id("123").to_proto(),
        request_preview="test request",
        response_preview="test response",
        request_time=request_time,
        state=TraceState.OK.to_proto(),
        trace_metadata={
            TRACE_SCHEMA_VERSION_KEY: "2",  # Old schema version
            "other_key": "other_value",
        },
        tags={"test_tag": "test_value"},
    )

    # Convert from proto
    trace_info = TraceInfo.from_proto(proto)

    # Verify the schema version was updated to current version
    assert trace_info.trace_metadata[TRACE_SCHEMA_VERSION_KEY] == "2"

    # Verify other metadata is preserved
    assert trace_info.trace_metadata["other_key"] == "other_value"

    # Verify other fields are correctly populated
    assert trace_info.trace_id == "test_trace_id"
    assert trace_info.experiment_id == "123"


def test_trace_info_from_proto_preserves_current_schema_version():
    # Create a proto with current schema version in metadata
    request_time = Timestamp()
    request_time.FromMilliseconds(1234567890)

    proto = ProtoTraceInfoV3(
        trace_id="test_trace_id",
        trace_location=TraceLocation.from_experiment_id("123").to_proto(),
        request_preview="test request",
        response_preview="test response",
        request_time=request_time,
        state=TraceState.OK.to_proto(),
        trace_metadata={
            TRACE_SCHEMA_VERSION_KEY: str(TRACE_SCHEMA_VERSION),  # Current schema version
            "other_key": "other_value",
        },
        tags={"test_tag": "test_value"},
    )

    # Convert from proto
    trace_info = TraceInfo.from_proto(proto)

    # Verify the schema version is preserved as current version
    assert trace_info.trace_metadata[TRACE_SCHEMA_VERSION_KEY] == str(TRACE_SCHEMA_VERSION)

    # Verify other metadata is preserved
    assert trace_info.trace_metadata["other_key"] == "other_value"


def test_trace_info_to_dict_preserves_trace_id():
    # Test with v4 URI format
    trace_info_v4 = TraceInfo(
        trace_id="trace:/catalog.schema/actual_trace_id",
        trace_location=TraceLocation.from_databricks_uc_schema(
            catalog_name="catalog", schema_name="schema"
        ),
        request_time=0,
        state=TraceState.OK,
    )

    dict_v4 = trace_info_v4.to_dict()
    # The dict should have the full trace_id, not the parsed one
    assert dict_v4["trace_id"] == "trace:/catalog.schema/actual_trace_id"

    # Test with regular trace_id
    trace_info = TraceInfo(
        trace_id="tr-12345",
        trace_location=TraceLocation.from_experiment_id("123"),
        request_time=0,
        state=TraceState.OK,
    )

    dict_regular = trace_info.to_dict()
    # Regular trace_id should remain unchanged
    assert dict_regular["trace_id"] == "tr-12345"
```

--------------------------------------------------------------------------------

---[FILE: test_trace_info_v2.py]---
Location: mlflow-master/tests/entities/test_trace_info_v2.py

```python
import pytest
from google.protobuf.duration_pb2 import Duration
from google.protobuf.timestamp_pb2 import Timestamp

from mlflow.entities.trace_info_v2 import TraceInfoV2
from mlflow.entities.trace_status import TraceStatus
from mlflow.protos.service_pb2 import TraceInfo as ProtoTraceInfo
from mlflow.protos.service_pb2 import TraceRequestMetadata as ProtoTraceRequestMetadata
from mlflow.protos.service_pb2 import TraceTag as ProtoTraceTag
from mlflow.tracing.constant import (
    MAX_CHARS_IN_TRACE_INFO_METADATA,
    MAX_CHARS_IN_TRACE_INFO_TAGS_KEY,
    MAX_CHARS_IN_TRACE_INFO_TAGS_VALUE,
    TRACE_SCHEMA_VERSION_KEY,
)


@pytest.fixture
def trace_info():
    return TraceInfoV2(
        request_id="request_id",
        experiment_id="test_experiment",
        timestamp_ms=0,
        execution_time_ms=1,
        status=TraceStatus.OK,
        request_metadata={
            "foo": "bar",
            "k" * 1000: "v" * 1000,
        },
        tags={
            "baz": "qux",
            "k" * 2000: "v" * 8000,
        },
        assessments=[],
    )


@pytest.fixture
def trace_info_proto():
    ti_proto = ProtoTraceInfo()
    ti_proto.request_id = "request_id"
    ti_proto.experiment_id = "test_experiment"
    ti_proto.timestamp_ms = 0
    ti_proto.execution_time_ms = 1
    ti_proto.status = TraceStatus.OK.to_proto()
    request_metadata_1 = ti_proto.request_metadata.add()
    request_metadata_1.key = "foo"
    request_metadata_1.value = "bar"
    request_metadata_2 = ti_proto.request_metadata.add()
    request_metadata_2.key = "k" * 250
    request_metadata_2.value = "v" * 250
    request_metadata_3 = ti_proto.request_metadata.add()
    request_metadata_3.key = TRACE_SCHEMA_VERSION_KEY
    request_metadata_3.value = "2"
    tag_1 = ti_proto.tags.add()
    tag_1.key = "baz"
    tag_1.value = "qux"
    tag_2 = ti_proto.tags.add()
    tag_2.key = "k" * 250
    tag_2.value = "v" * 250
    return ti_proto


def test_to_proto(trace_info):
    proto = trace_info.to_proto()
    assert proto.request_id == "request_id"
    assert proto.experiment_id == "test_experiment"
    assert proto.timestamp_ms == 0
    assert proto.execution_time_ms == 1
    assert proto.status == 1
    request_metadata_1 = proto.request_metadata[0]
    assert isinstance(request_metadata_1, ProtoTraceRequestMetadata)
    assert request_metadata_1.key == "foo"
    assert request_metadata_1.value == "bar"
    request_metadata_2 = proto.request_metadata[1]
    assert isinstance(request_metadata_2, ProtoTraceRequestMetadata)
    assert request_metadata_2.key == "k" * MAX_CHARS_IN_TRACE_INFO_METADATA
    assert request_metadata_2.value == "v" * MAX_CHARS_IN_TRACE_INFO_METADATA
    tag_1 = proto.tags[0]
    assert isinstance(tag_1, ProtoTraceTag)
    assert tag_1.key == "baz"
    assert tag_1.value == "qux"
    tag_2 = proto.tags[1]
    assert isinstance(tag_2, ProtoTraceTag)
    assert tag_2.key == "k" * MAX_CHARS_IN_TRACE_INFO_TAGS_KEY
    assert tag_2.value == "v" * MAX_CHARS_IN_TRACE_INFO_TAGS_VALUE


def test_to_dict(trace_info):
    trace_as_dict = trace_info.to_dict()
    assert trace_as_dict == {
        "request_id": "request_id",
        "experiment_id": "test_experiment",
        "timestamp_ms": 0,
        "execution_time_ms": 1,
        "status": "OK",
        "request_metadata": {
            "foo": "bar",
            "k" * 1000: "v" * 1000,
        },
        "tags": {
            "baz": "qux",
            "k" * 2000: "v" * 8000,
        },
        "assessments": [],
    }


def test_trace_info_serialization_deserialization(trace_info_proto):
    # trace info proto -> TraceInfo
    trace_info = TraceInfoV2.from_proto(trace_info_proto)
    assert trace_info.request_id == "request_id"
    assert trace_info.experiment_id == "test_experiment"
    assert trace_info.timestamp_ms == 0
    assert trace_info.execution_time_ms == 1
    assert trace_info.status == TraceStatus.OK
    assert trace_info.request_metadata == {
        "foo": "bar",
        "k" * 250: "v" * 250,
        TRACE_SCHEMA_VERSION_KEY: "2",
    }
    assert trace_info.tags == {
        "baz": "qux",
        "k" * 250: "v" * 250,
    }
    # TraceInfo -> python native dictionary
    trace_info_as_dict = trace_info.to_dict()
    assert trace_info_as_dict == {
        "request_id": "request_id",
        "experiment_id": "test_experiment",
        "timestamp_ms": 0,
        "execution_time_ms": 1,
        "status": "OK",
        "request_metadata": {
            "foo": "bar",
            "k" * 250: "v" * 250,
            TRACE_SCHEMA_VERSION_KEY: "2",
        },
        "tags": {
            "baz": "qux",
            "k" * 250: "v" * 250,
        },
        "assessments": [],
    }
    # python native dictionary -> TraceInfo
    assert TraceInfoV2.from_dict(trace_info_as_dict) == trace_info
    # TraceInfo -> trace info proto
    assert trace_info.to_proto() == trace_info_proto


def test_trace_info_v3(trace_info):
    v3_proto = trace_info.to_v3("request", "response").to_proto()
    assert v3_proto.request_preview == "request"
    assert v3_proto.response_preview == "response"
    assert v3_proto.trace_id == "request_id"
    assert isinstance(v3_proto.request_time, Timestamp)
    assert v3_proto.request_time.ToSeconds() == 0
    assert isinstance(v3_proto.execution_duration, Duration)
    assert v3_proto.execution_duration.ToMilliseconds() == 1
    assert v3_proto.state == 1
    assert v3_proto.trace_metadata["foo"] == "bar"
    assert (
        v3_proto.trace_metadata["k" * MAX_CHARS_IN_TRACE_INFO_METADATA]
        == "v" * MAX_CHARS_IN_TRACE_INFO_METADATA
    )
    assert v3_proto.tags["baz"] == "qux"
    assert (
        v3_proto.tags["k" * MAX_CHARS_IN_TRACE_INFO_TAGS_KEY]
        == "v" * MAX_CHARS_IN_TRACE_INFO_TAGS_VALUE
    )
```

--------------------------------------------------------------------------------

---[FILE: test_trace_location.py]---
Location: mlflow-master/tests/entities/test_trace_location.py

```python
import pytest

from mlflow.entities.trace_location import (
    InferenceTableLocation,
    MlflowExperimentLocation,
    TraceLocation,
    TraceLocationType,
    UCSchemaLocation,
)
from mlflow.exceptions import MlflowException
from mlflow.protos import service_pb2 as pb


def test_trace_location():
    trace_location = TraceLocation(
        type=TraceLocationType.MLFLOW_EXPERIMENT,
        mlflow_experiment=MlflowExperimentLocation(experiment_id="123"),
    )
    assert trace_location.type == TraceLocationType.MLFLOW_EXPERIMENT
    assert trace_location.mlflow_experiment.experiment_id == "123"

    trace_location = TraceLocation(
        type=TraceLocationType.INFERENCE_TABLE,
        inference_table=InferenceTableLocation(full_table_name="a.b.c"),
    )
    assert trace_location.type == TraceLocationType.INFERENCE_TABLE
    assert trace_location.inference_table.full_table_name == "a.b.c"

    from_proto = TraceLocation.from_proto(trace_location.to_proto())
    assert from_proto == trace_location

    with pytest.raises(
        MlflowException,
        match="Only one of mlflow_experiment, inference_table, or uc_schema can be provided",
    ):
        TraceLocation(
            type=TraceLocationType.TRACE_LOCATION_TYPE_UNSPECIFIED,
            mlflow_experiment=MlflowExperimentLocation(experiment_id="123"),
            inference_table=InferenceTableLocation(full_table_name="a.b.c"),
            uc_schema=UCSchemaLocation(catalog_name="a", schema_name="b"),
        )


def test_trace_location_mismatch():
    with pytest.raises(
        MlflowException, match="Trace location .+ does not match the provided location"
    ):
        TraceLocation(
            type=TraceLocationType.INFERENCE_TABLE,
            mlflow_experiment=MlflowExperimentLocation(experiment_id="123"),
        )

    with pytest.raises(
        MlflowException, match="Trace location .+ does not match the provided location"
    ):
        TraceLocation(
            type=TraceLocationType.MLFLOW_EXPERIMENT,
            inference_table=InferenceTableLocation(full_table_name="a.b.c"),
        )

    with pytest.raises(
        MlflowException, match="Trace location .+ does not match the provided location"
    ):
        TraceLocation(
            type=TraceLocationType.INFERENCE_TABLE,
            uc_schema=UCSchemaLocation(catalog_name="a", schema_name="b"),
        )


def test_trace_location_from_v4_proto_mlflow_experiment():
    proto = pb.TraceLocation(
        type=pb.TraceLocation.TraceLocationType.MLFLOW_EXPERIMENT,
        mlflow_experiment=pb.TraceLocation.MlflowExperimentLocation(experiment_id="1234"),
    )
    trace_location = TraceLocation.from_proto(proto)
    assert trace_location.type == TraceLocationType.MLFLOW_EXPERIMENT
    assert trace_location.mlflow_experiment.experiment_id == "1234"


def test_trace_location_from_v4_proto_inference_table():
    proto = pb.TraceLocation(
        type=pb.TraceLocation.TraceLocationType.INFERENCE_TABLE,
        inference_table=pb.TraceLocation.InferenceTableLocation(
            full_table_name="test_catalog.test_schema.test_table"
        ),
    )
    trace_location = TraceLocation.from_proto(proto)
    assert trace_location.type == TraceLocationType.INFERENCE_TABLE
    assert trace_location.inference_table.full_table_name == "test_catalog.test_schema.test_table"


def test_uc_schema_location_full_otel_spans_table_name():
    uc_schema = UCSchemaLocation(
        catalog_name="test_catalog",
        schema_name="test_schema",
    )
    uc_schema._otel_spans_table_name = "otel_spans"
    assert uc_schema.full_otel_spans_table_name == "test_catalog.test_schema.otel_spans"
```

--------------------------------------------------------------------------------

---[FILE: test_trace_state.py]---
Location: mlflow-master/tests/entities/test_trace_state.py

```python
import pytest

from mlflow.entities.trace_state import TraceState
from mlflow.protos.service_pb2 import TraceInfoV3 as ProtoTraceInfo


@pytest.mark.parametrize(
    ("state", "proto_state"),
    [
        (TraceState.STATE_UNSPECIFIED, ProtoTraceInfo.State.STATE_UNSPECIFIED),
        (TraceState.OK, ProtoTraceInfo.State.OK),
        (TraceState.ERROR, ProtoTraceInfo.State.ERROR),
        (TraceState.IN_PROGRESS, ProtoTraceInfo.State.IN_PROGRESS),
    ],
)
def test_trace_status_from_proto(state, proto_state):
    assert state.to_proto() == proto_state
    assert TraceState.from_proto(proto_state) == state
```

--------------------------------------------------------------------------------

---[FILE: test_trace_status.py]---
Location: mlflow-master/tests/entities/test_trace_status.py

```python
from mlflow.entities.trace_status import TraceStatus
from mlflow.protos.service_pb2 import TraceStatus as ProtoTraceStatus


def test_trace_status_from_proto():
    assert TraceStatus.from_proto(ProtoTraceStatus.OK) == TraceStatus.OK
    assert isinstance(TraceStatus.from_proto(ProtoTraceStatus.OK), TraceStatus)
    assert (
        TraceStatus.from_proto(ProtoTraceStatus.TRACE_STATUS_UNSPECIFIED) == TraceStatus.UNSPECIFIED
    )
    assert TraceStatus.from_proto(ProtoTraceStatus.ERROR) == TraceStatus.ERROR
    assert TraceStatus.from_proto(ProtoTraceStatus.IN_PROGRESS) == TraceStatus.IN_PROGRESS


def test_trace_status_to_proto():
    assert TraceStatus.OK.to_proto() == ProtoTraceStatus.OK
    assert isinstance(TraceStatus.OK.to_proto(), int)
    assert TraceStatus.UNSPECIFIED.to_proto() == ProtoTraceStatus.TRACE_STATUS_UNSPECIFIED
    assert TraceStatus.ERROR.to_proto() == ProtoTraceStatus.ERROR
    assert TraceStatus.IN_PROGRESS.to_proto() == ProtoTraceStatus.IN_PROGRESS
```

--------------------------------------------------------------------------------

---[FILE: test_view_type.py]---
Location: mlflow-master/tests/entities/test_view_type.py

```python
from mlflow.entities import ViewType
from mlflow.protos import service_pb2


def test_to_proto():
    assert ViewType.to_proto(ViewType.ACTIVE_ONLY) == service_pb2.ACTIVE_ONLY
    assert ViewType.to_proto(ViewType.DELETED_ONLY) == service_pb2.DELETED_ONLY
    assert ViewType.to_proto(ViewType.ALL) == service_pb2.ALL


def test_from_proto():
    assert ViewType.from_proto(service_pb2.ACTIVE_ONLY) == ViewType.ACTIVE_ONLY
    assert ViewType.from_proto(service_pb2.DELETED_ONLY) == ViewType.DELETED_ONLY
    assert ViewType.from_proto(service_pb2.ALL) == ViewType.ALL
```

--------------------------------------------------------------------------------

---[FILE: test_webhook.py]---
Location: mlflow-master/tests/entities/test_webhook.py

```python
import pytest

from mlflow.entities.webhook import (
    Webhook,
    WebhookAction,
    WebhookEntity,
    WebhookEvent,
    WebhookStatus,
    WebhookTestResult,
)
from mlflow.exceptions import MlflowException
from mlflow.protos.webhooks_pb2 import WebhookAction as ProtoWebhookAction
from mlflow.protos.webhooks_pb2 import WebhookEntity as ProtoWebhookEntity
from mlflow.protos.webhooks_pb2 import WebhookStatus as ProtoWebhookStatus


@pytest.mark.parametrize(
    ("proto_status", "status_enum"),
    [
        (ProtoWebhookStatus.ACTIVE, WebhookStatus.ACTIVE),
        (ProtoWebhookStatus.DISABLED, WebhookStatus.DISABLED),
    ],
)
def test_webhook_status_proto_conversion(proto_status, status_enum):
    assert WebhookStatus.from_proto(proto_status) == status_enum
    assert status_enum.to_proto() == proto_status


@pytest.mark.parametrize(
    ("entity_enum", "proto_entity"),
    [
        (WebhookEntity.REGISTERED_MODEL, ProtoWebhookEntity.REGISTERED_MODEL),
        (WebhookEntity.MODEL_VERSION, ProtoWebhookEntity.MODEL_VERSION),
        (WebhookEntity.MODEL_VERSION_TAG, ProtoWebhookEntity.MODEL_VERSION_TAG),
        (WebhookEntity.MODEL_VERSION_ALIAS, ProtoWebhookEntity.MODEL_VERSION_ALIAS),
    ],
)
def test_webhook_entity_proto_conversion(entity_enum, proto_entity):
    assert WebhookEntity.from_proto(proto_entity) == entity_enum
    assert entity_enum.to_proto() == proto_entity


@pytest.mark.parametrize(
    ("action_enum", "proto_action"),
    [
        (WebhookAction.CREATED, ProtoWebhookAction.CREATED),
        (WebhookAction.UPDATED, ProtoWebhookAction.UPDATED),
        (WebhookAction.DELETED, ProtoWebhookAction.DELETED),
        (WebhookAction.SET, ProtoWebhookAction.SET),
    ],
)
def test_webhook_action_proto_conversion(action_enum, proto_action):
    assert WebhookAction.from_proto(proto_action) == action_enum
    assert action_enum.to_proto() == proto_action


def test_webhook_event_creation():
    event = WebhookEvent(WebhookEntity.REGISTERED_MODEL, WebhookAction.CREATED)
    assert event.entity == WebhookEntity.REGISTERED_MODEL
    assert event.action == WebhookAction.CREATED


def test_webhook_event_from_string():
    event = WebhookEvent("registered_model", "created")
    assert event.entity == WebhookEntity.REGISTERED_MODEL
    assert event.action == WebhookAction.CREATED


def test_webhook_event_invalid_combination():
    with pytest.raises(
        MlflowException, match="Invalid action 'updated' for entity 'model_version_tag'"
    ):
        WebhookEvent(WebhookEntity.MODEL_VERSION_TAG, WebhookAction.UPDATED)


def test_webhook_event_from_str():
    event = WebhookEvent.from_str("registered_model.created")
    assert event.entity == WebhookEntity.REGISTERED_MODEL
    assert event.action == WebhookAction.CREATED


def test_webhook_event_from_str_invalid_format():
    with pytest.raises(MlflowException, match="Invalid event string format"):
        WebhookEvent.from_str("invalid_format")


def test_webhook_event_to_str():
    event = WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED)
    assert str(event) == "model_version.created"


def test_webhook_event_proto_conversion():
    event = WebhookEvent(WebhookEntity.REGISTERED_MODEL, WebhookAction.CREATED)
    proto_event = event.to_proto()
    event_from_proto = WebhookEvent.from_proto(proto_event)
    assert event_from_proto.entity == event.entity
    assert event_from_proto.action == event.action


def test_webhook_event_equality():
    event1 = WebhookEvent(WebhookEntity.REGISTERED_MODEL, WebhookAction.CREATED)
    event2 = WebhookEvent(WebhookEntity.REGISTERED_MODEL, WebhookAction.CREATED)
    event3 = WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED)

    assert event1 == event2
    assert event1 != event3
    assert hash(event1) == hash(event2)
    assert hash(event1) != hash(event3)


def test_webhook_event_invalid_entity_action_combination():
    with pytest.raises(
        MlflowException, match="Invalid action 'deleted' for entity 'registered_model'"
    ):
        WebhookEvent(WebhookEntity.REGISTERED_MODEL, WebhookAction.DELETED)


def test_webhook_proto_conversion():
    events = [
        WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED),
        WebhookEvent(WebhookEntity.MODEL_VERSION_ALIAS, WebhookAction.CREATED),
    ]
    webhook = Webhook(
        webhook_id="webhook123",
        name="Test Webhook",
        url="https://example.com/webhook",
        events=events,
        description="Test webhook description",
        status=WebhookStatus.ACTIVE,
        secret="my-secret",
        creation_timestamp=1234567890,
        last_updated_timestamp=1234567900,
    )
    proto_webhook = webhook.to_proto()
    webhook_from_proto = Webhook.from_proto(proto_webhook)
    assert webhook_from_proto.webhook_id == webhook.webhook_id
    assert webhook_from_proto.name == webhook.name
    assert webhook_from_proto.url == webhook.url
    assert webhook_from_proto.events == webhook.events
    assert webhook_from_proto.description == webhook.description
    assert webhook_from_proto.status == webhook.status
    assert webhook_from_proto.creation_timestamp == webhook.creation_timestamp
    assert webhook_from_proto.last_updated_timestamp == webhook.last_updated_timestamp


def test_webhook_no_secret_in_repr():
    events = [WebhookEvent(WebhookEntity.MODEL_VERSION, WebhookAction.CREATED)]
    webhook = Webhook(
        webhook_id="webhook123",
        name="Test Webhook",
        url="https://example.com/webhook",
        events=events,
        creation_timestamp=1234567890,
        last_updated_timestamp=1234567900,
        description="Test webhook description",
        status=WebhookStatus.ACTIVE,
        secret="my-secret",
    )
    assert "my-secret" not in repr(webhook)


def test_webhook_invalid_events():
    with pytest.raises(MlflowException, match="Webhook events cannot be empty"):
        Webhook(
            webhook_id="webhook123",
            name="Test Webhook",
            url="https://example.com/webhook",
            events=[],
            creation_timestamp=1234567890,
            last_updated_timestamp=1234567900,
        )


def test_webhook_test_result():
    # Test successful result
    result = WebhookTestResult(
        success=True,
        response_status=200,
        response_body='{"status": "ok"}',
    )
    assert result.success is True
    assert result.response_status == 200
    assert result.response_body == '{"status": "ok"}'
    assert result.error_message is None

    # Test failed result
    result = WebhookTestResult(
        success=False,
        response_status=500,
        error_message="Internal server error",
    )
    assert result.success is False
    assert result.response_status == 500
    assert result.error_message == "Internal server error"
    assert result.response_body is None
```

--------------------------------------------------------------------------------

---[FILE: test_model_version.py]---
Location: mlflow-master/tests/entities/model_registry/test_model_version.py

```python
import uuid

from mlflow.entities.model_registry.model_version import ModelVersion
from mlflow.entities.model_registry.model_version_status import ModelVersionStatus
from mlflow.entities.model_registry.model_version_tag import ModelVersionTag
from mlflow.entities.model_registry.registered_model import RegisteredModel

from tests.helper_functions import random_str


def _check(
    model_version,
    name,
    version,
    creation_timestamp,
    last_updated_timestamp,
    description,
    user_id,
    current_stage,
    source,
    run_id,
    status,
    status_message,
    tags,
    aliases,
):
    assert isinstance(model_version, ModelVersion)
    assert model_version.name == name
    assert model_version.version == version
    assert model_version.creation_timestamp == creation_timestamp
    assert model_version.last_updated_timestamp == last_updated_timestamp
    assert model_version.description == description
    assert model_version.user_id == user_id
    assert model_version.current_stage == current_stage
    assert model_version.source == source
    assert model_version.run_id == run_id
    assert model_version.status == status
    assert model_version.status_message == status_message
    assert model_version.tags == tags
    assert model_version.aliases == aliases


def test_creation_and_hydration():
    name = random_str()
    t1 = 100
    t2 = 150
    source = "path/to/source"
    run_id = uuid.uuid4().hex
    run_link = "http://localhost:5000/path/to/run"
    tags = [ModelVersionTag("key", "value"), ModelVersionTag("randomKey", "not a random value")]
    aliases = ["test_alias"]
    mvd = ModelVersion(
        name,
        "5",
        t1,
        t2,
        "version five",
        "user 1",
        "Production",
        source,
        run_id,
        "READY",
        "Model version #5 is ready to use.",
        tags,
        run_link,
        aliases,
    )
    _check(
        mvd,
        name,
        "5",
        t1,
        t2,
        "version five",
        "user 1",
        "Production",
        source,
        run_id,
        "READY",
        "Model version #5 is ready to use.",
        {tag.key: tag.value for tag in (tags or [])},
        ["test_alias"],
    )

    expected_dict = {
        "name": name,
        "version": "5",
        "creation_timestamp": t1,
        "last_updated_timestamp": t2,
        "description": "version five",
        "user_id": "user 1",
        "current_stage": "Production",
        "source": source,
        "run_id": run_id,
        "run_link": run_link,
        "status": "READY",
        "status_message": "Model version #5 is ready to use.",
        "tags": {tag.key: tag.value for tag in (tags or [])},
        "aliases": ["test_alias"],
        "model_id": None,
        "metrics": None,
        "params": None,
        "deployment_job_state": None,
    }
    model_version_as_dict = dict(mvd)
    assert model_version_as_dict == expected_dict

    proto = mvd.to_proto()
    assert proto.name == name
    assert proto.version == "5"
    assert proto.status == ModelVersionStatus.from_string("READY")
    assert proto.status_message == "Model version #5 is ready to use."
    assert {tag.key for tag in proto.tags} == {"key", "randomKey"}
    assert {tag.value for tag in proto.tags} == {"value", "not a random value"}
    assert proto.aliases == ["test_alias"]
    mvd_2 = ModelVersion.from_proto(proto)
    _check(
        mvd_2,
        name,
        "5",
        t1,
        t2,
        "version five",
        "user 1",
        "Production",
        source,
        run_id,
        "READY",
        "Model version #5 is ready to use.",
        {tag.key: tag.value for tag in (tags or [])},
        ["test_alias"],
    )

    expected_dict.update({"registered_model": RegisteredModel(name)})
    expected_dict["tags"] = tags
    mvd_3 = ModelVersion.from_dictionary(expected_dict)
    _check(
        mvd_3,
        name,
        "5",
        t1,
        t2,
        "version five",
        "user 1",
        "Production",
        source,
        run_id,
        "READY",
        "Model version #5 is ready to use.",
        {tag.key: tag.value for tag in (tags or [])},
        ["test_alias"],
    )


def test_string_repr():
    model_version = ModelVersion(
        name="myname",
        version="43",
        creation_timestamp=12,
        last_updated_timestamp=100,
        description="This is a test model.",
        user_id="user one",
        current_stage="Archived",
        source="path/to/a/notebook",
        run_id="some run",
        run_link="http://localhost:5000/path/to/run",
        status="PENDING_REGISTRATION",
        status_message="Copying!",
        tags=[],
        aliases=[],
    )

    assert str(model_version) == (
        "<ModelVersion: aliases=[], creation_timestamp=12, current_stage='Archived', "
        "deployment_job_state=None, "
        "description='This is a test model.', last_updated_timestamp=100, metrics=None, "
        "model_id=None, name='myname', params=None, run_id='some run', "
        "run_link='http://localhost:5000/path/to/run', source='path/to/a/notebook', "
        "status='PENDING_REGISTRATION', status_message='Copying!', tags={}, user_id='user one', "
        "version='43'>"
    )
```

--------------------------------------------------------------------------------

````
