---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 785
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 785 of 991)

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

---[FILE: test_assessment.py]---
Location: mlflow-master/tests/entities/test_assessment.py

```python
import json
import time
from unittest.mock import patch

import pytest

from mlflow.entities.assessment import (
    Assessment,
    AssessmentError,
    AssessmentSource,
    Expectation,
    ExpectationValue,
    Feedback,
    FeedbackValue,
)
from mlflow.entities.assessment_error import _STACK_TRACE_TRUNCATION_LENGTH
from mlflow.exceptions import MlflowException
from mlflow.protos.assessments_pb2 import Assessment as ProtoAssessment
from mlflow.protos.assessments_pb2 import Expectation as ProtoExpectation
from mlflow.protos.assessments_pb2 import Feedback as ProtoFeedback
from mlflow.protos.databricks_tracing_pb2 import Assessment as ProtoAssessmentV4
from mlflow.protos.databricks_tracing_pb2 import TraceLocation, UCSchemaLocation
from mlflow.tracing.constant import AssessmentMetadataKey
from mlflow.utils.proto_json_utils import proto_timestamp_to_milliseconds


def test_assessment_creation():
    default_params = {
        "trace_id": "trace_id",
        "name": "relevance",
        "source": AssessmentSource(source_type="HUMAN", source_id="user_1"),
        "create_time_ms": 123456789,
        "last_update_time_ms": 123456789,
        "expectation": None,
        "feedback": FeedbackValue(0.9),
        "rationale": "Rationale text",
        "metadata": {"key1": "value1"},
        "span_id": "span_id",
        "assessment_id": "assessment_id",
    }

    assessment = Assessment(**default_params)
    for key, value in default_params.items():
        assert getattr(assessment, key) == value

    assessment_with_error = Assessment(
        **{
            **default_params,
            "feedback": FeedbackValue(
                None, AssessmentError(error_code="E001", error_message="An error occurred.")
            ),
        }
    )
    assert assessment_with_error.feedback.error.error_code == "E001"
    assert assessment_with_error.feedback.error.error_message == "An error occurred."

    # Both feedback value and error can be set. For example, a default fallback value can
    # be set when LLM judge fails to provide a value.
    assessment_with_value_and_error = Assessment(
        **{
            **default_params,
            "feedback": FeedbackValue(value=1, error=AssessmentError(error_code="E001")),
        }
    )
    assert assessment_with_value_and_error.feedback.value == 1
    assert assessment_with_value_and_error.feedback.error.error_code == "E001"

    # Backward compatibility. "error" was previously in the Assessment class.
    assessment_legacy_error = Assessment(
        **{
            **default_params,
            "error": AssessmentError(error_code="E001", error_message="An error occurred."),
            "feedback": FeedbackValue(None),
        }
    )
    assert assessment_legacy_error.feedback.error.error_code == "E001"
    assert assessment_legacy_error.feedback.error.error_message == "An error occurred."


def test_assessment_equality():
    source_1 = AssessmentSource(source_type="HUMAN", source_id="user_1")
    source_2 = AssessmentSource(source_type="HUMAN", source_id="user_1")
    source_3 = AssessmentSource(source_type="LLM_JUDGE", source_id="llm_1")

    common_args = {
        "trace_id": "trace_id",
        "name": "relevance",
        "create_time_ms": 123456789,
        "last_update_time_ms": 123456789,
    }

    # Valid assessments
    assessment_1 = Assessment(
        source=source_1,
        feedback=FeedbackValue(0.9),
        **common_args,
    )
    assessment_2 = Assessment(
        source=source_2,
        feedback=FeedbackValue(0.9),
        **common_args,
    )
    assessment_3 = Assessment(
        source=source_1,
        feedback=FeedbackValue(0.8),
        **common_args,
    )
    assessment_4 = Assessment(
        source=source_3,
        feedback=FeedbackValue(0.9),
        **common_args,
    )
    assessment_5 = Assessment(
        source=source_1,
        feedback=FeedbackValue(
            None,
            AssessmentError(
                error_code="E002",
                error_message="A different error occurred.",
            ),
        ),
        **common_args,
    )
    assessment_6 = Assessment(
        source=source_1,
        feedback=FeedbackValue(
            None,
            AssessmentError(
                error_code="E001",
                error_message="Another error message.",
            ),
        ),
        **common_args,
    )

    # Same evaluation_id, name, source, timestamp, and numeric_value
    assert assessment_1 == assessment_2
    assert assessment_1 != assessment_3  # Different numeric_value
    assert assessment_1 != assessment_4  # Different source
    assert assessment_1 != assessment_5  # One has numeric_value, other has error_code
    assert assessment_5 != assessment_6  # Different error_code


def test_assessment_value_validation():
    common_args = {
        "trace_id": "trace_id",
        "name": "relevance",
        "source": AssessmentSource(source_type="HUMAN", source_id="user_1"),
        "create_time_ms": 123456789,
        "last_update_time_ms": 123456789,
    }

    # Valid cases
    Assessment(expectation=ExpectationValue("MLflow"), **common_args)
    Assessment(feedback=FeedbackValue("This is correct."), **common_args)
    Assessment(
        feedback=FeedbackValue(None, error=AssessmentError(error_code="E001")), **common_args
    )
    Assessment(
        feedback=FeedbackValue("This is correct.", AssessmentError(error_code="E001")),
        **common_args,
    )

    # Invalid case: no value specified
    with pytest.raises(MlflowException, match=r"Exactly one of"):
        Assessment(**common_args)

    # Invalid case: both feedback and expectation specified
    with pytest.raises(MlflowException, match=r"Exactly one of"):
        Assessment(
            expectation=ExpectationValue("MLflow"),
            feedback=FeedbackValue("This is correct."),
            **common_args,
        )

    # Invalid case: All three are set
    with pytest.raises(MlflowException, match=r"Exactly one of"):
        Assessment(
            expectation=ExpectationValue("MLflow"),
            feedback=FeedbackValue("This is correct.", AssessmentError(error_code="E001")),
            **common_args,
        )


@pytest.mark.parametrize(
    ("expectation", "feedback"),
    [
        (ExpectationValue("MLflow"), None),
        (ExpectationValue({"complex": {"expectation": ["structure"]}}), None),
        (None, FeedbackValue("This is correct.")),
        (None, FeedbackValue(None, AssessmentError(error_code="E001"))),
        (
            None,
            FeedbackValue(
                None, AssessmentError(error_code="E001", error_message="An error occurred.")
            ),
        ),
    ],
)
@pytest.mark.parametrize(
    "source",
    [
        AssessmentSource(source_type="HUMAN", source_id="user_1"),
        AssessmentSource(source_type="CODE", source_id="code.py"),
    ],
)
@pytest.mark.parametrize(
    "metadata",
    [
        {"key1": "value1"},
        None,
    ],
)
def test_assessment_conversion(expectation, feedback, source, metadata):
    timestamp_ms = int(time.time() * 1000)
    if expectation:
        assessment = Expectation(
            trace_id="trace_id",
            name="relevance",
            source=source,
            create_time_ms=timestamp_ms,
            last_update_time_ms=timestamp_ms,
            value=expectation.value,
            metadata=metadata,
            span_id="span_id",
        )
    elif feedback:
        assessment = Feedback(
            trace_id="trace_id",
            name="relevance",
            source=source,
            create_time_ms=timestamp_ms,
            last_update_time_ms=timestamp_ms,
            value=feedback.value,
            error=feedback.error,
            rationale="Rationale text",
            metadata=metadata,
            span_id="span_id",
        )
    else:
        raise ValueError("Either expectation or feedback must be provided")

    proto = assessment.to_proto()

    assert isinstance(proto, ProtoAssessment)

    result = Assessment.from_proto(proto)
    assert result == assessment

    dict = assessment.to_dictionary()
    assert dict.get("assessment_id") == assessment.assessment_id
    assert dict["trace_id"] == assessment.trace_id
    assert dict["assessment_name"] == assessment.name
    assert dict["source"].get("source_type") == source.source_type
    assert dict["source"].get("source_id") == source.source_id
    assert proto_timestamp_to_milliseconds(dict["create_time"]) == assessment.create_time_ms
    assert (
        proto_timestamp_to_milliseconds(dict["last_update_time"]) == assessment.last_update_time_ms
    )
    assert dict.get("rationale") == assessment.rationale
    assert dict.get("metadata") == metadata

    if expectation:
        if isinstance(expectation.value, str):
            assert dict["expectation"] == {"value": expectation.value}
        else:
            assert dict["expectation"] == {
                "serialized_value": {
                    "value": json.dumps(expectation.value),
                    "serialization_format": "JSON_FORMAT",
                }
            }

    if feedback:
        assert dict["feedback"] == feedback.to_dictionary()


@pytest.mark.parametrize(
    "value",
    [
        "MLflow",  # string
        42,  # integer
        3.14,  # float
        True,  # boolean
    ],
    ids=["string", "integer", "float", "boolean"],
)
def test_expectation_proto_dict_conversion(value):
    expectation = ExpectationValue(value)
    proto = expectation.to_proto()
    assert isinstance(proto, ProtoExpectation)

    result = ExpectationValue.from_proto(proto)
    assert result.value == expectation.value

    expectation_dict = expectation.to_dictionary()
    result = ExpectationValue.from_dictionary(expectation_dict)
    assert result.value == expectation.value


@pytest.mark.parametrize(
    "value",
    [
        {"key": "value"},
        ["a", "b", "c"],
        {"nested": {"dict": {"with": ["mixed", "types", 1, 2.0, True]}}},
        [1, "two", 3.0, False, {"mixed": "list"}],
        [{"complex": "structure"}, [1, 2, 3], {"with": ["nested", "arrays"]}],
    ],
)
def test_expectation_value_serialization(value):
    expectation = ExpectationValue(value)
    proto = expectation.to_proto()

    assert proto.HasField("serialized_value")
    assert proto.serialized_value.serialization_format == "JSON_FORMAT"

    result = ExpectationValue.from_proto(proto)
    assert result.value == expectation.value

    expectation_dict = expectation.to_dictionary()
    result = ExpectationValue.from_dictionary(expectation_dict)
    assert result.value == expectation.value


def test_expectation_invalid_values():
    class CustomObject:
        pass

    with pytest.raises(MlflowException, match="Expectation value must be JSON-serializable"):
        ExpectationValue(CustomObject()).to_proto()

    # Test invalid serialization format
    proto = ProtoExpectation()
    proto.serialized_value.serialization_format = "INVALID_FORMAT"
    proto.serialized_value.value = '{"key": "value"}'

    with pytest.raises(MlflowException, match="Unknown serialization format"):
        ExpectationValue.from_proto(proto)


@pytest.mark.parametrize(
    ("value", "error"),
    [
        (0.9, None),
        (None, AssessmentError(error_code="E001", error_message="An error occurred.")),
        (
            "Error message",
            AssessmentError(error_code="E002", error_message="Another error occurred."),
        ),
    ],
)
def test_feedback_value_proto_dict_conversion(value, error):
    feedback = FeedbackValue(value, error)
    proto = feedback.to_proto()
    assert isinstance(proto, ProtoFeedback)

    result = FeedbackValue.from_proto(proto)
    assert result.value == feedback.value
    assert result.error == feedback.error

    feedback_dict = feedback.to_dictionary()
    result = FeedbackValue.from_dictionary(feedback_dict)
    assert result.value == feedback.value
    assert result.error == feedback.error


@pytest.mark.parametrize("stack_trace_length", [500, 2000])
def test_feedback_from_exception(stack_trace_length):
    err = None
    try:
        raise ValueError("An error occurred.")
    except ValueError as e:
        err = e

    # Mock traceback.format_tb to simulate long stack trace
    with patch(
        "mlflow.entities.assessment.get_stacktrace",
        return_value="A" * (stack_trace_length - 9) + "last line",
    ):
        feedback = Feedback(error=err)
    assert feedback.error.error_code == "ValueError"
    assert feedback.error.error_message == "An error occurred."
    assert feedback.error.stack_trace is not None

    # Feedback should expose error_code and error_message for backward compatibility
    assert feedback.error_code == "ValueError"
    assert feedback.error_message == "An error occurred."

    proto = feedback.to_proto()
    assert len(proto.feedback.error.stack_trace) == min(
        stack_trace_length, _STACK_TRACE_TRUNCATION_LENGTH
    )
    assert proto.feedback.error.stack_trace.endswith("last line")
    if stack_trace_length > _STACK_TRACE_TRUNCATION_LENGTH:
        assert proto.feedback.error.stack_trace.startswith("[Stack trace is truncated]\n...\n")

    recovered = Feedback.from_proto(feedback.to_proto())
    assert feedback.error.error_code == recovered.error.error_code
    assert feedback.error.error_message == recovered.error.error_message


def test_assessment_value_assignment():
    feedback = Feedback(name="relevance", value=1.0)
    assert feedback.value == 1.0

    feedback.value = 0.9
    assert feedback.value == 0.9

    expectation = Expectation(name="expected_value", value=1.0)
    assert expectation.value == 1.0

    expectation.value = 0.9
    assert expectation.value == 0.9


@pytest.mark.parametrize(
    ("metadata", "explicit_run_id", "expected_run_id"),
    [
        ({AssessmentMetadataKey.SOURCE_RUN_ID: "run123"}, None, "run123"),
        ({"other_key": "value"}, "explicit_run", "explicit_run"),
        ({"other_key": "value"}, None, None),
        (None, None, None),
    ],
)
def test_run_id_handling(metadata, explicit_run_id, expected_run_id):
    feedback = Feedback(name="test", value=True, metadata=metadata)
    if explicit_run_id:
        feedback.run_id = explicit_run_id

    assert feedback.run_id == expected_run_id
    assert not hasattr(feedback.to_proto(), "run_id")

    if expected_run_id and not explicit_run_id:
        recovered = Feedback.from_proto(feedback.to_proto())
        assert recovered.run_id == expected_run_id


def test_feedback_from_proto_v4():
    # Create v4 proto with all fields
    proto_v4 = ProtoAssessmentV4()
    proto_v4.assessment_id = "feedback123"
    proto_v4.assessment_name = "accuracy"

    proto_v4.trace_location.CopyFrom(
        TraceLocation(
            type=TraceLocation.TraceLocationType.UC_SCHEMA,
            uc_schema=UCSchemaLocation(catalog_name="prod", schema_name="ml_data"),
        )
    )
    proto_v4.trace_id = "123456"

    proto_v4.span_id = "span789"
    proto_v4.rationale = "Model output matches ground truth"
    proto_v4.overrides = "prev_assessment"
    proto_v4.valid = True

    # Set source
    source = AssessmentSource(source_type="CODE", source_id="scorer.py")
    proto_v4.source.CopyFrom(source.to_proto())

    # Set timestamps
    proto_v4.create_time.FromMilliseconds(1700000000000)
    proto_v4.last_update_time.FromMilliseconds(1700000001000)

    # Set metadata
    proto_v4.metadata["key1"] = "value1"
    proto_v4.metadata["key2"] = "value2"

    # Set feedback value with error
    feedback_value = FeedbackValue(
        value=0.85, error=AssessmentError(error_code="TIMEOUT", error_message="Request timed out")
    )
    proto_v4.feedback.CopyFrom(feedback_value.to_proto())

    # Convert from proto
    feedback = Feedback.from_proto(proto_v4)

    # Validate all fields
    assert feedback.assessment_id == "feedback123"
    assert feedback.name == "accuracy"
    assert feedback.trace_id == "trace:/prod.ml_data/123456"
    assert feedback.span_id == "span789"
    assert feedback.rationale == "Model output matches ground truth"
    assert feedback.overrides == "prev_assessment"
    assert feedback.valid is True
    assert feedback.value == 0.85
    assert feedback.error.error_code == "TIMEOUT"
    assert feedback.error.error_message == "Request timed out"
    assert feedback.source.source_type == "CODE"
    assert feedback.source.source_id == "scorer.py"
    assert feedback.create_time_ms == 1700000000000
    assert feedback.last_update_time_ms == 1700000001000
    assert feedback.metadata == {"key1": "value1", "key2": "value2"}


def test_expectation_from_proto_v4():
    # Create v4 proto with all fields
    proto_v4 = ProtoAssessmentV4()
    proto_v4.assessment_id = "exp123"
    proto_v4.assessment_name = "expected_output"

    # Set TraceIdentifier with UC schema location
    proto_v4.trace_location.CopyFrom(
        TraceLocation(
            type=TraceLocation.TraceLocationType.UC_SCHEMA,
            uc_schema=UCSchemaLocation(catalog_name="dev", schema_name="experiments"),
        )
    )
    proto_v4.trace_id = "123456"

    proto_v4.span_id = "exp_span789"

    # Set source
    source = AssessmentSource(source_type="HUMAN", source_id="expert@company.com")
    proto_v4.source.CopyFrom(source.to_proto())

    # Set timestamps
    proto_v4.create_time.FromMilliseconds(1700000002000)
    proto_v4.last_update_time.FromMilliseconds(1700000003000)

    # Set metadata
    proto_v4.metadata["dataset"] = "test_set_v1"
    proto_v4.metadata["version"] = "1.0"

    # Set expectation value (complex structure)
    expectation_value = ExpectationValue(
        value={"expected_response": "The capital is Paris", "alternatives": ["Paris, France"]}
    )
    proto_v4.expectation.CopyFrom(expectation_value.to_proto())

    # Convert from proto
    expectation = Expectation.from_proto(proto_v4)

    # Validate all fields
    assert expectation.assessment_id == "exp123"
    assert expectation.name == "expected_output"
    assert expectation.trace_id == "trace:/dev.experiments/123456"
    assert expectation.span_id == "exp_span789"
    assert expectation.value == {
        "expected_response": "The capital is Paris",
        "alternatives": ["Paris, France"],
    }
    assert expectation.source.source_type == "HUMAN"
    assert expectation.source.source_id == "expert@company.com"
    assert expectation.create_time_ms == 1700000002000
    assert expectation.last_update_time_ms == 1700000003000
    assert expectation.metadata == {"dataset": "test_set_v1", "version": "1.0"}


def test_feedback_converts_string_error_to_assessment_error():
    feedback = Feedback(
        name="test_feedback",
        error="This is a string error message",
    )

    # Verify error was converted to AssessmentError
    assert isinstance(feedback.error, AssessmentError)
    assert feedback.error.error_message == "This is a string error message"
    assert feedback.error.error_code == "ASSESSMENT_ERROR"

    # Verify it can be serialized to proto
    proto = feedback.to_proto()
    assert proto.feedback.HasField("error")
    assert proto.feedback.error.error_message == "This is a string error message"
    assert proto.feedback.error.error_code == "ASSESSMENT_ERROR"


def test_feedback_converts_exception_error_to_assessment_error():
    feedback = Feedback(name="test_feedback", error=ValueError("Test exception message"))

    # Verify error was converted to AssessmentError
    assert isinstance(feedback.error, AssessmentError)
    assert "Test exception message" in feedback.error.error_message
    assert feedback.error.error_code == "ValueError"
    assert feedback.error.stack_trace is not None
    assert len(feedback.error.stack_trace) > 0

    # Verify it can be serialized
    proto = feedback.to_proto()
    assert proto.feedback.HasField("error")
    assert proto.feedback.error.error_code == "ValueError"


def test_feedback_passes_through_assessment_error():
    error = AssessmentError(
        error_message="Custom error message",
        error_code="CUSTOM_ERROR_CODE",
        stack_trace="Custom stack trace",
    )

    feedback = Feedback(
        name="test_feedback",
        error=error,
    )

    # Verify error was not modified
    assert feedback.error is error
    assert feedback.error.error_message == "Custom error message"
    assert feedback.error.error_code == "CUSTOM_ERROR_CODE"
    assert feedback.error.stack_trace == "Custom stack trace"

    # Verify it can be serialized
    proto = feedback.to_proto()
    assert proto.feedback.HasField("error")
    assert proto.feedback.error.error_message == "Custom error message"
    assert proto.feedback.error.error_code == "CUSTOM_ERROR_CODE"


@pytest.mark.parametrize(
    "invalid_error",
    [123, ["error"], {"error": "message"}],
    ids=["int", "list", "dict"],
)
def test_feedback_rejects_invalid_error_types(invalid_error):
    with pytest.raises(
        MlflowException, match="'error' must be an Exception, AssessmentError, or string"
    ):
        Feedback(name="test", error=invalid_error)
```

--------------------------------------------------------------------------------

---[FILE: test_assessment_source.py]---
Location: mlflow-master/tests/entities/test_assessment_source.py

```python
import pytest

from mlflow.entities.assessment_source import AssessmentSource
from mlflow.exceptions import MlflowException


def test_assessment_source_equality():
    source1 = AssessmentSource(source_type="HUMAN", source_id="user_1")
    source2 = AssessmentSource(source_type="HUMAN", source_id="user_1")
    source3 = AssessmentSource(source_type="LLM_JUDGE", source_id="ai_1")
    source5 = AssessmentSource(source_type="HUMAN", source_id="user_2")

    assert source1 == source2  # Same type and ID
    assert source1 != source3  # Different type
    assert source1 != source5  # Different ID


def test_assessment_source_properties():
    source = AssessmentSource(source_type="HUMAN", source_id="user_1")

    assert source.source_type == "HUMAN"
    assert source.source_id == "user_1"


def test_assessment_source_to_from_dictionary():
    source = AssessmentSource(source_type="HUMAN", source_id="user_1")
    source_dict = source.to_dictionary()

    expected_dict = {
        "source_type": "HUMAN",
        "source_id": "user_1",
    }
    assert source_dict == expected_dict

    recreated_source = AssessmentSource.from_dictionary(source_dict)
    assert recreated_source == source


def test_assessment_source_type_validation():
    # Valid source types
    AssessmentSource(source_type="HUMAN", source_id="user_1")
    AssessmentSource(source_type="LLM_JUDGE", source_id="judge_1")

    # Deprecated source type for backward compatibility
    source = AssessmentSource(source_type="AI_JUDGE", source_id="ai_1")
    assert source.source_type == "LLM_JUDGE"

    # Invalid source type
    with pytest.raises(MlflowException, match="Invalid assessment source type"):
        AssessmentSource(source_type="ROBOT", source_id="robot_1")


def test_assessment_source_case_insensitivity():
    # Valid source types with different cases
    source_1 = AssessmentSource(source_type="human", source_id="user_1")
    source_2 = AssessmentSource(source_type="Human", source_id="user_2")
    source_3 = AssessmentSource(source_type="HUMAN", source_id="user_3")
    source_4 = AssessmentSource(source_type="llm_judge", source_id="judge_1")
    source_5 = AssessmentSource(source_type="Llm_Judge", source_id="judge_2")
    source_6 = AssessmentSource(source_type="LLM_JUDGE", source_id="judge_3")

    # Verify that the source type is normalized to uppercase
    assert source_1.source_type == "HUMAN"
    assert source_2.source_type == "HUMAN"
    assert source_3.source_type == "HUMAN"
    assert source_4.source_type == "LLM_JUDGE"
    assert source_5.source_type == "LLM_JUDGE"
    assert source_6.source_type == "LLM_JUDGE"


def test_ai_judge_deprecation_warning():
    with pytest.warns(FutureWarning, match="AI_JUDGE is deprecated. Use LLM_JUDGE instead."):
        source = AssessmentSource(source_type="AI_JUDGE", source_id="ai_1")

    assert source.source_type == "LLM_JUDGE"
    assert source.source_id == "ai_1"
```

--------------------------------------------------------------------------------

---[FILE: test_dataset.py]---
Location: mlflow-master/tests/entities/test_dataset.py

```python
from mlflow.entities import Dataset


def _check(dataset, name, digest, source_type, source, schema=None, profile=None):
    assert isinstance(dataset, Dataset)
    assert dataset.name == name
    assert dataset.digest == digest
    assert dataset.source_type == source_type
    assert dataset.source == source
    assert dataset.schema == schema
    assert dataset.profile == profile


def test_creation_and_hydration():
    name = "my_name"
    digest = "my_digest"
    source_type = "my_source_type"
    source = "my_source"
    schema = "my_schema"
    profile = "my_profile"
    dataset = Dataset(name, digest, source_type, source, schema, profile)
    _check(dataset, name, digest, source_type, source, schema, profile)

    as_dict = {
        "name": name,
        "digest": digest,
        "source_type": source_type,
        "source": source,
        "schema": schema,
        "profile": profile,
    }
    assert dict(dataset) == as_dict

    proto = dataset.to_proto()
    dataset2 = Dataset.from_proto(proto)
    _check(dataset2, name, digest, source_type, source, schema, profile)

    dataset3 = Dataset.from_dictionary(as_dict)
    _check(dataset3, name, digest, source_type, source, schema, profile)


def test_absent_fields():
    name = "my_name"
    digest = "my_digest"
    source_type = "my_source_type"
    source = "my_source"
    dataset = Dataset(name, digest, source_type, source)
    _check(dataset, name, digest, source_type, source)

    as_dict = {
        "name": name,
        "digest": digest,
        "source_type": source_type,
        "source": source,
        "profile": None,
        "schema": None,
    }
    assert dict(dataset) == as_dict

    proto = dataset.to_proto()
    dataset2 = Dataset.from_proto(proto)
    _check(dataset2, name, digest, source_type, source)

    dataset3 = Dataset.from_dictionary(as_dict)
    _check(dataset3, name, digest, source_type, source)
```

--------------------------------------------------------------------------------

---[FILE: test_dataset_input.py]---
Location: mlflow-master/tests/entities/test_dataset_input.py

```python
from mlflow.entities import Dataset, DatasetInput, InputTag


def _check(dataset_input, tags, dataset):
    assert isinstance(dataset_input, DatasetInput)
    assert dataset_input.tags == tags
    assert dataset_input.dataset == dataset


def test_creation_and_hydration():
    key = "my_key"
    value = "my_value"
    tags = [InputTag(key, value)]
    name = "my_name"
    digest = "my_digest"
    source_type = "my_source_type"
    source = "my_source"
    schema = "my_schema"
    profile = "my_profile"
    dataset = Dataset(name, digest, source_type, source, schema, profile)
    dataset_input = DatasetInput(dataset=dataset, tags=tags)
    _check(dataset_input, tags, dataset)

    as_dict = {"dataset": dataset, "tags": tags}
    assert dict(dataset_input) == as_dict

    proto = dataset_input.to_proto()
    dataset_input2 = DatasetInput.from_proto(proto)
    _check(dataset_input2, tags, dataset)

    dataset_input3 = DatasetInput.from_dictionary(as_dict)
    _check(dataset_input3, tags, dataset)
```

--------------------------------------------------------------------------------

````
