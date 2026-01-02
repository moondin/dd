---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 787
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 787 of 991)

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

---[FILE: test_evaluation_dataset.py]---
Location: mlflow-master/tests/entities/test_evaluation_dataset.py

```python
import json

import pandas as pd
import pytest
from opentelemetry.sdk.trace import ReadableSpan as OTelReadableSpan

from mlflow.entities.dataset_record import DatasetRecord
from mlflow.entities.dataset_record_source import DatasetRecordSourceType
from mlflow.entities.evaluation_dataset import EvaluationDataset
from mlflow.entities.span import Span, SpanType
from mlflow.entities.trace import Trace
from mlflow.entities.trace_data import TraceData
from mlflow.entities.trace_info import TraceInfo
from mlflow.entities.trace_location import TraceLocation
from mlflow.entities.trace_state import TraceState
from mlflow.exceptions import MlflowException
from mlflow.tracing.utils import build_otel_context


def test_evaluation_dataset_creation():
    dataset = EvaluationDataset(
        dataset_id="dataset123",
        name="test_dataset",
        digest="abc123",
        created_time=123456789,
        last_update_time=987654321,
        tags={"source": "manual", "type": "HUMAN"},
        schema='{"fields": ["input", "output"]}',
        profile='{"count": 100}',
        created_by="user1",
        last_updated_by="user2",
    )

    assert dataset.dataset_id == "dataset123"
    assert dataset.name == "test_dataset"
    assert dataset.tags == {"source": "manual", "type": "HUMAN"}
    assert dataset.schema == '{"fields": ["input", "output"]}'
    assert dataset.profile == '{"count": 100}'
    assert dataset.digest == "abc123"
    assert dataset.created_by == "user1"
    assert dataset.last_updated_by == "user2"
    assert dataset.created_time == 123456789
    assert dataset.last_update_time == 987654321

    dataset.experiment_ids = ["exp1", "exp2"]
    assert dataset.experiment_ids == ["exp1", "exp2"]


def test_evaluation_dataset_timestamps_required():
    dataset = EvaluationDataset(
        dataset_id="dataset123",
        name="test_dataset",
        digest="digest123",
        created_time=123456789,
        last_update_time=987654321,
    )

    assert dataset.created_time == 123456789
    assert dataset.last_update_time == 987654321


def test_evaluation_dataset_experiment_ids_setter():
    dataset = EvaluationDataset(
        dataset_id="dataset123",
        name="test_dataset",
        digest="digest123",
        created_time=123456789,
        last_update_time=123456789,
    )

    new_experiment_ids = ["exp1", "exp2"]
    dataset.experiment_ids = new_experiment_ids
    assert dataset._experiment_ids == new_experiment_ids
    assert dataset.experiment_ids == new_experiment_ids

    dataset.experiment_ids = []
    assert dataset._experiment_ids == []
    assert dataset.experiment_ids == []

    dataset.experiment_ids = None
    assert dataset._experiment_ids == []
    assert dataset.experiment_ids == []


def test_evaluation_dataset_to_from_proto():
    dataset = EvaluationDataset(
        dataset_id="dataset123",
        name="test_dataset",
        tags={"source": "manual", "type": "HUMAN"},
        schema='{"fields": ["input", "output"]}',
        profile='{"count": 100}',
        digest="abc123",
        created_time=123456789,
        last_update_time=987654321,
        created_by="user1",
        last_updated_by="user2",
    )
    dataset.experiment_ids = ["exp1", "exp2"]

    proto = dataset.to_proto()
    assert proto.name == "test_dataset"
    assert proto.tags == '{"source": "manual", "type": "HUMAN"}'
    assert proto.schema == '{"fields": ["input", "output"]}'
    assert proto.profile == '{"count": 100}'
    assert proto.digest == "abc123"
    assert proto.created_time == 123456789
    assert proto.last_update_time == 987654321
    assert proto.created_by == "user1"
    assert proto.last_updated_by == "user2"
    assert list(proto.experiment_ids) == ["exp1", "exp2"]

    dataset2 = EvaluationDataset.from_proto(proto)
    assert dataset2.dataset_id == dataset.dataset_id
    assert dataset2.name == dataset.name
    assert dataset2.tags == dataset.tags
    assert dataset2.schema == dataset.schema
    assert dataset2.profile == dataset.profile
    assert dataset2.digest == dataset.digest
    assert dataset2.created_time == dataset.created_time
    assert dataset2.last_update_time == dataset.last_update_time
    assert dataset2.created_by == dataset.created_by
    assert dataset2.last_updated_by == dataset.last_updated_by
    assert dataset2._experiment_ids == ["exp1", "exp2"]
    assert dataset2.experiment_ids == ["exp1", "exp2"]


def test_evaluation_dataset_to_from_proto_minimal():
    dataset = EvaluationDataset(
        dataset_id="dataset123",
        name="test_dataset",
        digest="digest123",
        created_time=123456789,
        last_update_time=123456789,
    )

    proto = dataset.to_proto()
    dataset2 = EvaluationDataset.from_proto(proto)

    assert dataset2.dataset_id == "dataset123"
    assert dataset2.name == "test_dataset"
    assert dataset2.tags is None
    assert dataset2.schema is None
    assert dataset2.profile is None
    assert dataset2.digest == "digest123"
    assert dataset2.created_by is None
    assert dataset2.last_updated_by is None
    assert dataset2._experiment_ids is None


def test_evaluation_dataset_to_from_dict():
    dataset = EvaluationDataset(
        dataset_id="dataset123",
        name="test_dataset",
        tags={"source": "manual", "type": "HUMAN"},
        schema='{"fields": ["input", "output"]}',
        profile='{"count": 100}',
        digest="abc123",
        created_time=123456789,
        last_update_time=987654321,
        created_by="user1",
        last_updated_by="user2",
    )
    dataset.experiment_ids = ["exp1", "exp2"]

    dataset._records = [
        DatasetRecord(
            dataset_record_id="rec789",
            dataset_id="dataset123",
            inputs={"question": "What is MLflow?"},
            created_time=123456789,
            last_update_time=123456789,
        )
    ]

    data = dataset.to_dict()
    assert data["dataset_id"] == "dataset123"
    assert data["name"] == "test_dataset"
    assert data["tags"] == {"source": "manual", "type": "HUMAN"}
    assert data["schema"] == '{"fields": ["input", "output"]}'
    assert data["profile"] == '{"count": 100}'
    assert data["digest"] == "abc123"
    assert data["created_time"] == 123456789
    assert data["last_update_time"] == 987654321
    assert data["created_by"] == "user1"
    assert data["last_updated_by"] == "user2"
    assert data["experiment_ids"] == ["exp1", "exp2"]
    assert len(data["records"]) == 1
    assert data["records"][0]["inputs"]["question"] == "What is MLflow?"

    dataset2 = EvaluationDataset.from_dict(data)
    assert dataset2.dataset_id == dataset.dataset_id
    assert dataset2.name == dataset.name
    assert dataset2.tags == dataset.tags
    assert dataset2.schema == dataset.schema
    assert dataset2.profile == dataset.profile
    assert dataset2.digest == dataset.digest
    assert dataset2.created_time == dataset.created_time
    assert dataset2.last_update_time == dataset.last_update_time
    assert dataset2.created_by == dataset.created_by
    assert dataset2.last_updated_by == dataset.last_updated_by
    assert dataset2._experiment_ids == ["exp1", "exp2"]
    assert dataset2.experiment_ids == ["exp1", "exp2"]
    assert len(dataset2._records) == 1
    assert dataset2._records[0].inputs["question"] == "What is MLflow?"


def test_evaluation_dataset_to_from_dict_minimal():
    dataset = EvaluationDataset(
        dataset_id="dataset123",
        name="test_dataset",
        digest="digest123",
        created_time=123456789,
        last_update_time=123456789,
    )
    dataset._experiment_ids = []
    dataset._records = []

    data = dataset.to_dict()
    dataset2 = EvaluationDataset.from_dict(data)

    assert dataset2.dataset_id == "dataset123"
    assert dataset2.name == "test_dataset"
    assert dataset2.tags is None
    assert dataset2.schema is None
    assert dataset2.profile is None
    assert dataset2.digest == "digest123"
    assert dataset2.created_by is None
    assert dataset2.last_updated_by is None
    assert dataset2._experiment_ids == []
    assert dataset2._records == []


def test_evaluation_dataset_has_records():
    dataset = EvaluationDataset(
        dataset_id="dataset123",
        name="test_dataset",
        digest="digest123",
        created_time=123456789,
        last_update_time=123456789,
    )

    assert dataset.has_records() is False

    dataset._records = [
        DatasetRecord(
            dataset_record_id="rec123",
            dataset_id="dataset123",
            inputs={"test": "data"},
            created_time=123456789,
            last_update_time=123456789,
        )
    ]
    assert dataset.has_records() is True

    dataset._records = []
    assert dataset.has_records() is True


def test_evaluation_dataset_proto_with_unloaded_experiment_ids():
    dataset = EvaluationDataset(
        dataset_id="dataset123",
        name="test_dataset",
        digest="digest123",
        created_time=123456789,
        last_update_time=123456789,
    )

    assert dataset._experiment_ids is None

    proto = dataset.to_proto()
    assert len(proto.experiment_ids) == 0
    assert dataset._experiment_ids is None


def test_evaluation_dataset_complex_tags():
    complex_tags = {
        "source": "automated",
        "metadata": {"version": "1.0", "config": {"temperature": 0.7, "max_tokens": 100}},
        "labels": ["production", "evaluated"],
    }

    dataset = EvaluationDataset(
        dataset_id="dataset123",
        name="test_dataset",
        digest="digest123",
        created_time=123456789,
        last_update_time=123456789,
        tags=complex_tags,
    )

    proto = dataset.to_proto()
    dataset2 = EvaluationDataset.from_proto(proto)
    assert dataset2.tags == complex_tags

    dataset._experiment_ids = []
    dataset._records = []

    data = dataset.to_dict()
    dataset3 = EvaluationDataset.from_dict(data)
    assert dataset3.tags == complex_tags


def test_evaluation_dataset_to_df():
    dataset = EvaluationDataset(
        dataset_id="dataset123",
        name="test_dataset",
        digest="digest123",
        created_time=123456789,
        last_update_time=123456789,
    )

    # Test empty dataset
    df_empty = dataset.to_df()
    assert isinstance(df_empty, pd.DataFrame)
    expected_columns = [
        "inputs",
        "outputs",
        "expectations",
        "tags",
        "source_type",
        "source_id",
        "source",
        "created_time",
        "dataset_record_id",
    ]
    assert list(df_empty.columns) == expected_columns
    assert len(df_empty) == 0

    # Test dataset with records
    dataset._records = [
        DatasetRecord(
            dataset_record_id="rec123",
            dataset_id="dataset123",
            inputs={"question": "What is MLflow?"},
            outputs={
                "answer": "MLflow is an ML platform for managing machine learning lifecycle",
                "key1": "value1",
            },
            expectations={"answer": "MLflow is an ML platform"},
            tags={"source": "manual"},
            source_type="HUMAN",
            source_id="user123",
            created_time=123456789,
            last_update_time=123456789,
        ),
        DatasetRecord(
            dataset_record_id="rec456",
            dataset_id="dataset123",
            inputs={"question": "What is Spark?"},
            outputs={"answer": "Apache Spark is a unified analytics engine for data processing"},
            expectations={"answer": "Spark is a data engine"},
            tags={"source": "automated"},
            source_type="CODE",
            source_id="script456",
            created_time=123456790,
            last_update_time=123456790,
        ),
    ]

    df = dataset.to_df()
    assert isinstance(df, pd.DataFrame)
    assert list(df.columns) == expected_columns
    assert len(df) == 2

    # Check that outputs column exists and contains actual values
    assert "outputs" in df.columns
    assert df["outputs"].iloc[0] == {
        "answer": "MLflow is an ML platform for managing machine learning lifecycle",
        "key1": "value1",
    }
    assert df["outputs"].iloc[1] == {
        "answer": "Apache Spark is a unified analytics engine for data processing"
    }

    # Check other columns have expected values
    assert df["inputs"].iloc[0] == {"question": "What is MLflow?"}
    assert df["inputs"].iloc[1] == {"question": "What is Spark?"}
    assert df["expectations"].iloc[0] == {"answer": "MLflow is an ML platform"}
    assert df["expectations"].iloc[1] == {"answer": "Spark is a data engine"}
    assert df["tags"].iloc[0] == {"source": "manual"}
    assert df["tags"].iloc[1] == {"source": "automated"}
    assert df["source_type"].iloc[0] == "HUMAN"
    assert df["source_type"].iloc[1] == "CODE"
    assert df["source_id"].iloc[0] == "user123"
    assert df["source_id"].iloc[1] == "script456"
    assert df["dataset_record_id"].iloc[0] == "rec123"
    assert df["dataset_record_id"].iloc[1] == "rec456"


def create_test_span(
    span_id=1,
    parent_id=None,
    name="test_span",
    inputs=None,
    outputs=None,
    span_type=SpanType.UNKNOWN,
):
    attributes = {
        "mlflow.spanType": json.dumps(span_type),
    }

    if inputs is not None:
        attributes["mlflow.spanInputs"] = json.dumps(inputs)

    if outputs is not None:
        attributes["mlflow.spanOutputs"] = json.dumps(outputs)

    otel_span = OTelReadableSpan(
        name=name,
        context=build_otel_context(trace_id=123456789, span_id=span_id),
        parent=build_otel_context(trace_id=123456789, span_id=parent_id) if parent_id else None,
        start_time=100000000,
        end_time=200000000,
        attributes=attributes,
    )
    return Span(otel_span)


def create_test_trace(
    trace_id="test-trace-123",
    inputs=None,
    outputs=None,
    expectations=None,
    trace_metadata=None,
    _no_defaults=False,
):
    assessments = []
    if expectations:
        from mlflow.entities.assessment import AssessmentSource, AssessmentSourceType, Expectation

        for name, value in expectations.items():
            expectation = Expectation(
                name=name,
                value=value,
                source=AssessmentSource(
                    source_type=AssessmentSourceType.HUMAN, source_id="test_user"
                ),
            )
            assessments.append(expectation)

    trace_info = TraceInfo(
        trace_id=trace_id,
        trace_location=TraceLocation.from_experiment_id("0"),
        request_time=1234567890,
        execution_duration=1000,
        state=TraceState.OK,
        assessments=assessments,
        trace_metadata=trace_metadata or {},
    )

    default_inputs = {"question": "What is MLflow?"}
    default_outputs = {"answer": "MLflow is a platform"}

    if _no_defaults:
        span_inputs = inputs
        span_outputs = outputs
    else:
        span_inputs = inputs if inputs is not None else default_inputs
        span_outputs = outputs if outputs is not None else default_outputs

    spans = [
        create_test_span(
            span_id=1,
            parent_id=None,
            name="root_span",
            inputs=span_inputs,
            outputs=span_outputs,
            span_type=SpanType.CHAIN,
        )
    ]

    trace_data = TraceData(spans=spans)
    return Trace(info=trace_info, data=trace_data)


def test_process_trace_records_with_dict_outputs():
    dataset = EvaluationDataset(
        dataset_id="dataset123",
        name="test_dataset",
        digest="digest123",
        created_time=123456789,
        last_update_time=123456789,
    )

    trace = create_test_trace(
        trace_id="trace1",
        inputs={"question": "What is MLflow?"},
        outputs={"answer": "MLflow is a platform", "confidence": 0.95},
    )

    record_dicts = dataset._process_trace_records([trace])

    assert len(record_dicts) == 1
    assert record_dicts[0]["inputs"] == {"question": "What is MLflow?"}
    assert record_dicts[0]["outputs"] == {"answer": "MLflow is a platform", "confidence": 0.95}
    assert record_dicts[0]["expectations"] == {}
    assert record_dicts[0]["source"]["source_type"] == DatasetRecordSourceType.TRACE.value
    assert record_dicts[0]["source"]["source_data"]["trace_id"] == "trace1"


def test_process_trace_records_with_string_outputs():
    dataset = EvaluationDataset(
        dataset_id="dataset123",
        name="test_dataset",
        digest="digest123",
        created_time=123456789,
        last_update_time=123456789,
    )

    trace = create_test_trace(
        trace_id="trace2",
        inputs={"query": "Tell me about Python"},
        outputs="Python is a programming language",
    )

    record_dicts = dataset._process_trace_records([trace])

    assert len(record_dicts) == 1
    assert record_dicts[0]["inputs"] == {"query": "Tell me about Python"}
    assert record_dicts[0]["outputs"] == "Python is a programming language"
    assert record_dicts[0]["expectations"] == {}
    assert record_dicts[0]["source"]["source_type"] == DatasetRecordSourceType.TRACE.value


def test_process_trace_records_with_non_dict_non_string_outputs():
    dataset = EvaluationDataset(
        dataset_id="dataset123",
        name="test_dataset",
        digest="digest123",
        created_time=123456789,
        last_update_time=123456789,
    )

    trace = create_test_trace(
        trace_id="trace3", inputs={"x": 1, "y": 2}, outputs=["result1", "result2", "result3"]
    )

    record_dicts = dataset._process_trace_records([trace])

    assert len(record_dicts) == 1
    assert record_dicts[0]["inputs"] == {"x": 1, "y": 2}
    assert record_dicts[0]["outputs"] == ["result1", "result2", "result3"]
    assert record_dicts[0]["source"]["source_type"] == DatasetRecordSourceType.TRACE.value


def test_process_trace_records_with_numeric_outputs():
    dataset = EvaluationDataset(
        dataset_id="dataset123",
        name="test_dataset",
        digest="digest123",
        created_time=123456789,
        last_update_time=123456789,
    )

    trace = create_test_trace(trace_id="trace4", inputs={"number": 42}, outputs=42)

    record_dicts = dataset._process_trace_records([trace])

    assert len(record_dicts) == 1
    assert record_dicts[0]["outputs"] == 42


def test_process_trace_records_with_none_outputs():
    dataset = EvaluationDataset(
        dataset_id="dataset123",
        name="test_dataset",
        digest="digest123",
        created_time=123456789,
        last_update_time=123456789,
    )

    trace = create_test_trace(
        trace_id="trace5", inputs={"input": "test"}, outputs=None, _no_defaults=True
    )

    record_dicts = dataset._process_trace_records([trace])

    assert len(record_dicts) == 1
    assert record_dicts[0]["outputs"] is None


def test_process_trace_records_with_expectations():
    dataset = EvaluationDataset(
        dataset_id="dataset123",
        name="test_dataset",
        digest="digest123",
        created_time=123456789,
        last_update_time=123456789,
    )

    trace = create_test_trace(
        trace_id="trace6",
        inputs={"question": "What is 2+2?"},
        outputs={"answer": "4"},
        expectations={"correctness": True, "tone": "neutral"},
    )

    record_dicts = dataset._process_trace_records([trace])

    assert len(record_dicts) == 1
    assert record_dicts[0]["expectations"] == {"correctness": True, "tone": "neutral"}


def test_process_trace_records_multiple_traces():
    dataset = EvaluationDataset(
        dataset_id="dataset123",
        name="test_dataset",
        digest="digest123",
        created_time=123456789,
        last_update_time=123456789,
    )

    traces = [
        create_test_trace(trace_id="trace1", outputs={"result": "answer1"}),
        create_test_trace(trace_id="trace2", outputs="string answer"),
        create_test_trace(trace_id="trace3", outputs=[1, 2, 3]),
    ]

    record_dicts = dataset._process_trace_records(traces)

    assert len(record_dicts) == 3
    assert record_dicts[0]["outputs"] == {"result": "answer1"}
    assert record_dicts[1]["outputs"] == "string answer"
    assert record_dicts[2]["outputs"] == [1, 2, 3]


def test_process_trace_records_mixed_types_error():
    dataset = EvaluationDataset(
        dataset_id="dataset123",
        name="test_dataset",
        digest="digest123",
        created_time=123456789,
        last_update_time=123456789,
    )

    trace = create_test_trace(trace_id="trace1")
    not_a_trace = {"not": "a trace"}

    with pytest.raises(
        MlflowException,
        match=(
            "Mixed types in trace list.*Expected all elements to be Trace objects.*"
            "element at index 1 is dict"
        ),
    ):
        dataset._process_trace_records([trace, not_a_trace])


def test_process_trace_records_preserves_session_metadata():
    dataset = EvaluationDataset(
        dataset_id="dataset123",
        name="test_dataset",
        digest="digest123",
        created_time=123456789,
        last_update_time=123456789,
    )

    # Create trace with session metadata
    trace_with_session = create_test_trace(
        trace_id="tr-123",
        trace_metadata={"mlflow.trace.session": "session_1"},
    )

    # Create trace without session metadata
    trace_without_session = create_test_trace(
        trace_id="tr-456",
        trace_metadata={},
    )

    records = dataset._process_trace_records([trace_with_session, trace_without_session])

    # Trace with session should have session_id in source_data
    assert records[0]["source"]["source_data"]["trace_id"] == "tr-123"
    assert records[0]["source"]["source_data"]["session_id"] == "session_1"

    # Trace without session should only have trace_id
    assert records[1]["source"]["source_data"]["trace_id"] == "tr-456"
    assert "session_id" not in records[1]["source"]["source_data"]


def test_to_df_includes_source_column():
    from mlflow.entities.dataset_record import DatasetRecord
    from mlflow.entities.dataset_record_source import DatasetRecordSource

    dataset = EvaluationDataset(
        dataset_id="dataset123",
        name="test_dataset",
        digest="digest123",
        created_time=123456789,
        last_update_time=123456789,
    )

    # Manually add a record with source to the dataset
    source = DatasetRecordSource(
        source_type=DatasetRecordSourceType.TRACE,
        source_data={"trace_id": "tr-123"},
    )
    record = DatasetRecord(
        dataset_id="dataset123",
        dataset_record_id="record123",
        inputs={"question": "test"},
        outputs={"answer": "test answer"},
        expectations={},
        tags={},
        created_time=123456789,
        last_update_time=123456789,
        source=source,
    )
    dataset._records = [record]

    df = dataset.to_df()

    assert "source" in df.columns
    assert df["source"].notna().all()
    assert df["source"].iloc[0] == source
```

--------------------------------------------------------------------------------

---[FILE: test_experiment.py]---
Location: mlflow-master/tests/entities/test_experiment.py

```python
from mlflow.entities import Experiment, LifecycleStage
from mlflow.utils.time import get_current_time_millis

from tests.helper_functions import random_file, random_int


def _check(exp, exp_id, name, location, lifecycle_stage, creation_time, last_update_time):
    assert isinstance(exp, Experiment)
    assert exp.experiment_id == exp_id
    assert exp.name == name
    assert exp.artifact_location == location
    assert exp.lifecycle_stage == lifecycle_stage
    assert exp.creation_time == creation_time
    assert exp.last_update_time == last_update_time


def test_creation_and_hydration():
    exp_id = str(random_int())
    name = f"exp_{random_int()}_{random_int()}"
    lifecycle_stage = LifecycleStage.ACTIVE
    location = random_file(".json")
    creation_time = get_current_time_millis()
    last_update_time = get_current_time_millis()
    exp = Experiment(
        exp_id,
        name,
        location,
        lifecycle_stage,
        creation_time=creation_time,
        last_update_time=last_update_time,
    )
    _check(exp, exp_id, name, location, lifecycle_stage, creation_time, last_update_time)

    as_dict = {
        "experiment_id": exp_id,
        "name": name,
        "artifact_location": location,
        "lifecycle_stage": lifecycle_stage,
        "tags": {},
        "creation_time": creation_time,
        "last_update_time": last_update_time,
    }
    assert dict(exp) == as_dict
    proto = exp.to_proto()
    exp2 = Experiment.from_proto(proto)
    _check(exp2, exp_id, name, location, lifecycle_stage, creation_time, last_update_time)

    exp3 = Experiment.from_dictionary(as_dict)
    _check(exp3, exp_id, name, location, lifecycle_stage, creation_time, last_update_time)


def test_string_repr():
    exp = Experiment(
        experiment_id=0,
        name="myname",
        artifact_location="hi",
        lifecycle_stage=LifecycleStage.ACTIVE,
        creation_time=1662004217511,
        last_update_time=1662004217511,
    )
    assert (
        str(exp)
        == "<Experiment: artifact_location='hi', creation_time=1662004217511, experiment_id=0, "
        "last_update_time=1662004217511, lifecycle_stage='active', name='myname', tags={}>"
    )
```

--------------------------------------------------------------------------------

---[FILE: test_file_info.py]---
Location: mlflow-master/tests/entities/test_file_info.py

```python
from mlflow.entities import FileInfo

from tests.helper_functions import random_int, random_str


def _check(fi, path, is_dir, size_in_bytes):
    assert isinstance(fi, FileInfo)
    assert fi.path == path
    assert fi.is_dir == is_dir
    assert fi.file_size == size_in_bytes


def test_creation_and_hydration():
    path = random_str(random_int(10, 50))
    is_dir = random_int(10, 2500) % 2 == 0
    size_in_bytes = random_int(1, 10000)
    fi1 = FileInfo(path, is_dir, size_in_bytes)
    _check(fi1, path, is_dir, size_in_bytes)

    as_dict = {"path": path, "is_dir": is_dir, "file_size": size_in_bytes}
    assert dict(fi1) == as_dict

    proto = fi1.to_proto()
    fi2 = FileInfo.from_proto(proto)
    _check(fi2, path, is_dir, size_in_bytes)

    fi3 = FileInfo.from_dictionary(as_dict)
    _check(fi3, path, is_dir, size_in_bytes)
```

--------------------------------------------------------------------------------

---[FILE: test_gateway_endpoint.py]---
Location: mlflow-master/tests/entities/test_gateway_endpoint.py

```python
from mlflow.entities import (
    GatewayEndpoint,
    GatewayEndpointBinding,
    GatewayEndpointModelMapping,
    GatewayModelDefinition,
    GatewayResourceType,
)


def test_model_definition_creation_full():
    model_def = GatewayModelDefinition(
        model_definition_id="model-def-123",
        name="GPT-4o Production",
        secret_id="secret-789",
        secret_name="openai_api_key",
        provider="openai",
        model_name="gpt-4o",
        created_at=1234567890000,
        last_updated_at=1234567890000,
        created_by="test_user",
        last_updated_by="test_user",
    )

    assert model_def.model_definition_id == "model-def-123"
    assert model_def.name == "GPT-4o Production"
    assert model_def.secret_id == "secret-789"
    assert model_def.secret_name == "openai_api_key"
    assert model_def.provider == "openai"
    assert model_def.model_name == "gpt-4o"
    assert model_def.created_at == 1234567890000
    assert model_def.last_updated_at == 1234567890000
    assert model_def.created_by == "test_user"
    assert model_def.last_updated_by == "test_user"


def test_model_definition_creation_minimal():
    model_def = GatewayModelDefinition(
        model_definition_id="model-def-123",
        name="Anthropic Claude",
        secret_id="secret-789",
        secret_name="api_key",
        provider="anthropic",
        model_name="claude-3-5-sonnet-20241022",
        created_at=1234567890000,
        last_updated_at=1234567890000,
    )

    assert model_def.model_definition_id == "model-def-123"
    assert model_def.created_by is None
    assert model_def.last_updated_by is None


def test_model_definition_various_providers():
    providers_and_models = [
        ("openai", "gpt-4o"),
        ("anthropic", "claude-3-5-sonnet-20241022"),
        ("cohere", "command-r-plus"),
        ("bedrock", "anthropic.claude-3-5-sonnet-20241022-v2:0"),
    ]

    for provider, model_name in providers_and_models:
        model_def = GatewayModelDefinition(
            model_definition_id=f"model-def-{provider}",
            name=f"{provider} model",
            secret_id=f"secret-{provider}",
            secret_name=f"{provider}_key",
            provider=provider,
            model_name=model_name,
            created_at=1234567890000,
            last_updated_at=1234567890000,
        )

        assert model_def.provider == provider
        assert model_def.model_name == model_name


def test_endpoint_model_mapping_creation():
    model_def = GatewayModelDefinition(
        model_definition_id="model-def-1",
        name="GPT-4o",
        secret_id="secret-1",
        secret_name="openai_key",
        provider="openai",
        model_name="gpt-4o",
        created_at=1234567890000,
        last_updated_at=1234567890000,
    )

    mapping = GatewayEndpointModelMapping(
        mapping_id="mapping-123",
        endpoint_id="endpoint-456",
        model_definition_id="model-def-1",
        model_definition=model_def,
        weight=1,
        created_at=1234567890000,
        created_by="test_user",
    )

    assert mapping.mapping_id == "mapping-123"
    assert mapping.endpoint_id == "endpoint-456"
    assert mapping.model_definition_id == "model-def-1"
    assert mapping.model_definition is not None
    assert mapping.model_definition.name == "GPT-4o"
    assert mapping.weight == 1
    assert mapping.created_at == 1234567890000
    assert mapping.created_by == "test_user"


def test_endpoint_model_mapping_without_model_definition():
    mapping = GatewayEndpointModelMapping(
        mapping_id="mapping-123",
        endpoint_id="endpoint-456",
        model_definition_id="model-def-1",
        model_definition=None,
        weight=2,
        created_at=1234567890000,
    )

    assert mapping.mapping_id == "mapping-123"
    assert mapping.model_definition is None
    assert mapping.weight == 2
    assert mapping.created_by is None


def test_endpoint_creation_full():
    model_def = GatewayModelDefinition(
        model_definition_id="model-def-1",
        name="GPT-4o",
        secret_id="secret-1",
        secret_name="openai_key",
        provider="openai",
        model_name="gpt-4o",
        created_at=1234567890000,
        last_updated_at=1234567890000,
    )

    mapping = GatewayEndpointModelMapping(
        mapping_id="mapping-1",
        endpoint_id="endpoint-1",
        model_definition_id="model-def-1",
        model_definition=model_def,
        weight=1,
        created_at=1234567890000,
    )

    endpoint = GatewayEndpoint(
        endpoint_id="endpoint-1",
        name="Production LLM Endpoint",
        created_at=1234567890000,
        last_updated_at=1234567890000,
        model_mappings=[mapping],
        created_by="test_user",
        last_updated_by="test_user",
    )

    assert endpoint.endpoint_id == "endpoint-1"
    assert endpoint.name == "Production LLM Endpoint"
    assert endpoint.created_at == 1234567890000
    assert endpoint.last_updated_at == 1234567890000
    assert len(endpoint.model_mappings) == 1
    assert endpoint.model_mappings[0].mapping_id == "mapping-1"
    assert endpoint.created_by == "test_user"
    assert endpoint.last_updated_by == "test_user"


def test_endpoint_creation_minimal():
    endpoint = GatewayEndpoint(
        endpoint_id="endpoint-minimal",
        name="Minimal Endpoint",
        created_at=1234567890000,
        last_updated_at=1234567890000,
    )

    assert endpoint.endpoint_id == "endpoint-minimal"
    assert endpoint.name == "Minimal Endpoint"
    assert endpoint.model_mappings == []
    assert endpoint.created_by is None
    assert endpoint.last_updated_by is None


def test_endpoint_with_multiple_model_mappings():
    model_def1 = GatewayModelDefinition(
        model_definition_id="model-def-1",
        name="GPT-4o",
        secret_id="secret-1",
        secret_name="openai_key",
        provider="openai",
        model_name="gpt-4o",
        created_at=1234567890000,
        last_updated_at=1234567890000,
    )

    model_def2 = GatewayModelDefinition(
        model_definition_id="model-def-2",
        name="Claude Sonnet",
        secret_id="secret-2",
        secret_name="anthropic_key",
        provider="anthropic",
        model_name="claude-3-5-sonnet-20241022",
        created_at=1234567890000,
        last_updated_at=1234567890000,
    )

    mapping1 = GatewayEndpointModelMapping(
        mapping_id="mapping-1",
        endpoint_id="endpoint-multi",
        model_definition_id="model-def-1",
        model_definition=model_def1,
        weight=1,
        created_at=1234567890000,
    )

    mapping2 = GatewayEndpointModelMapping(
        mapping_id="mapping-2",
        endpoint_id="endpoint-multi",
        model_definition_id="model-def-2",
        model_definition=model_def2,
        weight=1,
        created_at=1234567890000,
    )

    endpoint = GatewayEndpoint(
        endpoint_id="endpoint-multi",
        name="Multi-Model Endpoint",
        created_at=1234567890000,
        last_updated_at=1234567890000,
        model_mappings=[mapping1, mapping2],
    )

    assert len(endpoint.model_mappings) == 2
    assert endpoint.model_mappings[0].model_definition.provider == "openai"
    assert endpoint.model_mappings[1].model_definition.provider == "anthropic"
    providers = {m.model_definition.provider for m in endpoint.model_mappings}
    assert providers == {"openai", "anthropic"}


def test_endpoint_binding_creation_full():
    binding = GatewayEndpointBinding(
        endpoint_id="endpoint-456",
        resource_type=GatewayResourceType.SCORER_JOB,
        resource_id="job-789",
        created_at=1234567890000,
        last_updated_at=1234567890000,
        created_by="test_user",
        last_updated_by="test_user",
    )

    assert binding.endpoint_id == "endpoint-456"
    assert binding.resource_type == GatewayResourceType.SCORER_JOB
    assert binding.resource_id == "job-789"
    assert binding.created_at == 1234567890000
    assert binding.last_updated_at == 1234567890000
    assert binding.created_by == "test_user"
    assert binding.last_updated_by == "test_user"


def test_endpoint_binding_creation_minimal():
    binding = GatewayEndpointBinding(
        endpoint_id="endpoint-minimal",
        resource_type=GatewayResourceType.SCORER_JOB,
        resource_id="job-minimal",
        created_at=1234567890000,
        last_updated_at=1234567890000,
    )

    assert binding.created_by is None
    assert binding.last_updated_by is None


def test_endpoint_binding_resource_type_enum():
    binding = GatewayEndpointBinding(
        endpoint_id="endpoint-1",
        resource_type=GatewayResourceType.SCORER_JOB,
        resource_id="job-enum",
        created_at=1234567890000,
        last_updated_at=1234567890000,
    )

    assert binding.resource_type == GatewayResourceType.SCORER_JOB
    assert binding.resource_type.value == "scorer_job"
    assert isinstance(binding.resource_type, GatewayResourceType)


def test_resource_type_enum():
    assert GatewayResourceType.SCORER_JOB == "scorer_job"
    assert GatewayResourceType.SCORER_JOB.value == "scorer_job"
    assert isinstance(GatewayResourceType.SCORER_JOB, str)


def test_resource_type_enum_usage():
    rt = GatewayResourceType.SCORER_JOB
    assert rt == "scorer_job"
    assert rt.value == "scorer_job"
    assert isinstance(rt, str)


def test_model_definition_proto_round_trip():
    model_def = GatewayModelDefinition(
        model_definition_id="model-def-proto",
        name="Proto Test Model",
        secret_id="secret-proto",
        secret_name="proto_key",
        provider="openai",
        model_name="gpt-4o",
        created_at=1234567890000,
        last_updated_at=1234567891000,
        created_by="proto_user",
        last_updated_by="proto_user_2",
    )

    proto = model_def.to_proto()
    restored = GatewayModelDefinition.from_proto(proto)

    assert restored.model_definition_id == model_def.model_definition_id
    assert restored.name == model_def.name
    assert restored.secret_id == model_def.secret_id
    assert restored.secret_name == model_def.secret_name
    assert restored.provider == model_def.provider
    assert restored.model_name == model_def.model_name
    assert restored.created_at == model_def.created_at
    assert restored.last_updated_at == model_def.last_updated_at
    assert restored.created_by == model_def.created_by
    assert restored.last_updated_by == model_def.last_updated_by


def test_endpoint_model_mapping_proto_round_trip():
    mapping = GatewayEndpointModelMapping(
        mapping_id="mapping-proto",
        endpoint_id="endpoint-proto",
        model_definition_id="model-def-proto",
        model_definition=None,
        weight=2,
        created_at=1234567890000,
        created_by="mapping_user",
    )

    proto = mapping.to_proto()
    restored = GatewayEndpointModelMapping.from_proto(proto)

    assert restored.mapping_id == mapping.mapping_id
    assert restored.endpoint_id == mapping.endpoint_id
    assert restored.model_definition_id == mapping.model_definition_id
    assert restored.weight == mapping.weight
    assert restored.created_at == mapping.created_at
    assert restored.created_by == mapping.created_by


def test_endpoint_proto_round_trip():
    endpoint = GatewayEndpoint(
        endpoint_id="endpoint-proto",
        name="Proto Test Endpoint",
        created_at=1234567890000,
        last_updated_at=1234567891000,
        model_mappings=[],
        created_by="endpoint_user",
        last_updated_by="endpoint_user_2",
    )

    proto = endpoint.to_proto()
    restored = GatewayEndpoint.from_proto(proto)

    assert restored.endpoint_id == endpoint.endpoint_id
    assert restored.name == endpoint.name
    assert restored.created_at == endpoint.created_at
    assert restored.last_updated_at == endpoint.last_updated_at
    assert restored.created_by == endpoint.created_by
    assert restored.last_updated_by == endpoint.last_updated_by
    assert len(restored.model_mappings) == 0


def test_endpoint_binding_proto_round_trip():
    binding = GatewayEndpointBinding(
        endpoint_id="endpoint-proto",
        resource_type=GatewayResourceType.SCORER_JOB,
        resource_id="job-proto",
        created_at=1234567890000,
        last_updated_at=1234567891000,
        created_by="binding_user",
        last_updated_by="binding_user_2",
    )

    proto = binding.to_proto()
    restored = GatewayEndpointBinding.from_proto(proto)

    assert restored.endpoint_id == binding.endpoint_id
    assert restored.resource_type == binding.resource_type
    assert restored.resource_id == binding.resource_id
    assert restored.created_at == binding.created_at
    assert restored.last_updated_at == binding.last_updated_at
    assert restored.created_by == binding.created_by
    assert restored.last_updated_by == binding.last_updated_by
```

--------------------------------------------------------------------------------

````
