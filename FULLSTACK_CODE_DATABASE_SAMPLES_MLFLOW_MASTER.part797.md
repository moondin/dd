---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:54Z
part: 797
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 797 of 991)

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
Location: mlflow-master/tests/evaluate/logging/test_assessment.py

```python
from unittest.mock import patch

import pytest

from mlflow.entities.assessment_source import AssessmentSourceType
from mlflow.evaluation import Assessment
from mlflow.evaluation.assessment import AssessmentSource
from mlflow.exceptions import MlflowException


def test_assessment_equality():
    source_1 = AssessmentSource(source_type="HUMAN", source_id="user_1")
    source_2 = AssessmentSource(source_type="HUMAN", source_id="user_1")
    source_3 = AssessmentSource(source_type="AI_JUDGE", source_id="ai_1")

    # Valid assessments
    assessment_1 = Assessment(
        name="relevance",
        source=source_1,
        value=0.9,
    )
    assessment_2 = Assessment(
        name="relevance",
        source=source_2,
        value=0.9,
    )
    assessment_3 = Assessment(
        name="relevance",
        source=source_1,
        value=0.8,
    )
    assessment_4 = Assessment(
        name="relevance",
        source=source_3,
        value=0.9,
    )
    assessment_5 = Assessment(
        name="relevance",
        source=source_1,
        error_code="E002",
        error_message="A different error occurred.",
    )
    assessment_6 = Assessment(
        name="relevance",
        source=source_1,
        error_code="E001",
        error_message="Another error message.",
    )

    # Same name, source, and value
    assert assessment_1 == assessment_2
    assert assessment_1 != assessment_3  # Different value
    assert assessment_1 != assessment_4  # Different source
    assert assessment_1 != assessment_5  # One has value, other has error_code
    assert assessment_5 != assessment_6  # Different error_code


def test_assessment_properties():
    source = AssessmentSource(source_type="HUMAN", source_id="user_1")
    assessment = Assessment(
        name="relevance",
        source=source,
        value=0.9,
        rationale="Rationale text",
        metadata={"key1": "value1"},
    )

    assert assessment.name == "relevance"
    assert assessment.source == source
    assert assessment.value == 0.9
    assert assessment.rationale == "Rationale text"
    assert assessment.metadata == {"key1": "value1"}
    assert assessment.error_code is None
    assert assessment.error_message is None


def test_assessment_to_from_dictionary():
    source = AssessmentSource(source_type="HUMAN", source_id="user_1")
    assessment = Assessment(
        name="relevance",
        source=source,
        value=0.9,
        rationale="Rationale text",
        metadata={"key1": "value1"},
    )
    assessment_dict = assessment.to_dictionary()

    expected_dict = {
        "name": "relevance",
        "source": source.to_dictionary(),
        "value": 0.9,
        "rationale": "Rationale text",
        "metadata": {"key1": "value1"},
        "error_code": None,
        "error_message": None,
    }
    assert assessment_dict == expected_dict

    recreated_assessment = Assessment.from_dictionary(assessment_dict)
    assert recreated_assessment == assessment


def test_assessment_value_validation():
    source = AssessmentSource(source_type="HUMAN", source_id="user_1")

    # Valid cases
    try:
        Assessment(
            name="relevance",
            source=source,
            value=True,
        )
        Assessment(
            name="relevance",
            source=source,
            value=0.9,
        )
        Assessment(
            name="relevance",
            source=source,
            value="value",
        )
        Assessment(
            name="relevance",
            source=source,
            error_code="E001",
            error_message="Error",
        )
    except MlflowException:
        pytest.fail("Valid value raised exception")

    # Invalid case: more than one value type specified
    with pytest.raises(
        MlflowException,
        match="Exactly one of value or error_code must be specified for an assessment.",
    ):
        Assessment(
            name="relevance",
            source=source,
            value=True,
            error_code="E002",
        )

    # Invalid case: no value type specified
    with pytest.raises(
        MlflowException,
        match="Exactly one of value or error_code must be specified for an assessment.",
    ):
        Assessment(
            name="relevance",
            source=source,
        )

    # Invalid case: error_message specified with another value type
    with pytest.raises(
        MlflowException,
        match="error_message cannot be specified when value is specified.",
    ):
        Assessment(
            name="relevance",
            source=source,
            value=0.9,
            error_message="An error occurred",
        )

    with pytest.raises(
        MlflowException,
        match="error_message cannot be specified when value is specified.",
    ):
        Assessment(
            name="relevance",
            source=source,
            value="value",
            error_message="An error occurred",
        )

    with pytest.raises(
        MlflowException,
        match="error_message cannot be specified when value is specified.",
    ):
        Assessment(
            name="relevance",
            source=source,
            value=True,
            error_message="An error occurred",
        )


def test_assessment_to_entity():
    source = AssessmentSource(source_type="HUMAN", source_id="user_1")
    assessment = Assessment(
        name="relevance",
        source=source,
        value=0.9,
        rationale="Rationale text",
        metadata={"key1": "value1"},
    )

    evaluation_id = "evaluation_1"
    with patch("time.time", return_value=1234567890):
        assessment_entity = assessment._to_entity(evaluation_id)

    assert assessment_entity.evaluation_id == evaluation_id
    assert assessment_entity.name == assessment.name
    assert assessment_entity.source == assessment.source
    assert assessment_entity.boolean_value is None
    assert assessment_entity.numeric_value == assessment.value
    assert assessment_entity.string_value is None
    assert assessment_entity.rationale == assessment.rationale
    assert assessment_entity.metadata == assessment.metadata
    assert assessment_entity.error_code is None
    assert assessment_entity.error_message is None
    assert assessment_entity.timestamp == 1234567890000  # Mocked timestamp


def test_assessment_to_entity_with_error():
    source = AssessmentSource(source_type="HUMAN", source_id="user_1")
    assessment = Assessment(
        name="relevance",
        source=source,
        error_code="E001",
        error_message="An error occurred",
    )

    evaluation_id = "evaluation_1"
    with patch("time.time", return_value=1234567890):
        assessment_entity = assessment._to_entity(evaluation_id)

    assert assessment_entity.evaluation_id == evaluation_id
    assert assessment_entity.name == assessment.name
    assert assessment_entity.source == assessment.source
    assert assessment_entity.boolean_value is None
    assert assessment_entity.numeric_value is None
    assert assessment_entity.string_value is None
    assert assessment_entity.rationale == assessment.rationale
    assert assessment_entity.metadata == assessment.metadata
    assert assessment_entity.error_code == assessment.error_code
    assert assessment_entity.error_message == assessment.error_message
    assert assessment_entity.timestamp == 1234567890000  # Mocked timestamp


def test_assessment_to_entity_with_boolean_value():
    source = AssessmentSource(source_type="HUMAN", source_id="user_1")
    assessment = Assessment(
        name="relevance",
        source=source,
        value=True,
    )

    evaluation_id = "evaluation_1"
    with patch("time.time", return_value=1234567890):
        assessment_entity = assessment._to_entity(evaluation_id)

    assert assessment_entity.evaluation_id == evaluation_id
    assert assessment_entity.name == assessment.name
    assert assessment_entity.source == assessment.source
    assert assessment_entity.boolean_value == assessment.value
    assert assessment_entity.numeric_value is None
    assert assessment_entity.string_value is None
    assert assessment_entity.rationale == assessment.rationale
    assert assessment_entity.metadata == assessment.metadata
    assert assessment_entity.error_code is None
    assert assessment_entity.error_message is None
    assert assessment_entity.timestamp == 1234567890000  # Mocked timestamp


def test_assessment_to_entity_with_string_value():
    source = AssessmentSource(source_type="HUMAN", source_id="user_1")
    assessment = Assessment(
        name="relevance",
        source=source,
        value="string value",
    )

    evaluation_id = "evaluation_1"
    with patch("time.time", return_value=1234567890):
        assessment_entity = assessment._to_entity(evaluation_id)

    assert assessment_entity.evaluation_id == evaluation_id
    assert assessment_entity.name == assessment.name
    assert assessment_entity.source == assessment.source
    assert assessment_entity.boolean_value is None
    assert assessment_entity.numeric_value is None
    assert assessment_entity.string_value == assessment.value
    assert assessment_entity.rationale == assessment.rationale
    assert assessment_entity.metadata == assessment.metadata
    assert assessment_entity.error_code is None
    assert assessment_entity.error_message is None
    assert assessment_entity.timestamp == 1234567890000  # Mocked timestamp


def test_assessment_with_full_metadata():
    source = AssessmentSource(source_type="HUMAN", source_id="user_1")
    assessment = Assessment(
        name="relevance",
        source=source,
        value=0.9,
        rationale="Detailed rationale",
        metadata={"key1": "value1", "key2": "value2"},
    )

    assert assessment.metadata == {"key1": "value1", "key2": "value2"}
    assert assessment.rationale == "Detailed rationale"


def test_assessment_without_metadata():
    source = AssessmentSource(source_type="HUMAN", source_id="user_1")
    assessment = Assessment(
        name="relevance",
        source=source,
        value=0.9,
    )

    assert assessment.metadata == {}
    assert assessment.rationale is None


def test_assessment_without_source():
    assessment = Assessment(
        name="relevance",
        value=0.9,
    )

    assert assessment.source.source_type == AssessmentSourceType.SOURCE_TYPE_UNSPECIFIED

    entity = assessment._to_entity("evaluation_1")
    assert entity.source.source_type == AssessmentSourceType.SOURCE_TYPE_UNSPECIFIED
```

--------------------------------------------------------------------------------

---[FILE: test_assessment_entity.py]---
Location: mlflow-master/tests/evaluate/logging/test_assessment_entity.py

```python
import pytest

from mlflow.evaluation.assessment import AssessmentEntity, AssessmentSource
from mlflow.exceptions import MlflowException


def test_assessment_equality():
    source_1 = AssessmentSource(source_type="HUMAN", source_id="user_1")
    source_2 = AssessmentSource(source_type="HUMAN", source_id="user_1")
    source_3 = AssessmentSource(source_type="AI_JUDGE", source_id="ai_1")

    # Valid assessments
    assessment_1 = AssessmentEntity(
        evaluation_id="eval1",
        name="relevance",
        source=source_1,
        timestamp=123456789,
        numeric_value=0.9,
    )
    assessment_2 = AssessmentEntity(
        evaluation_id="eval1",
        name="relevance",
        source=source_2,
        timestamp=123456789,
        numeric_value=0.9,
    )
    assessment_3 = AssessmentEntity(
        evaluation_id="eval1",
        name="relevance",
        source=source_1,
        timestamp=123456789,
        numeric_value=0.8,
    )
    assessment_4 = AssessmentEntity(
        evaluation_id="eval1",
        name="relevance",
        source=source_3,
        timestamp=123456789,
        numeric_value=0.9,
    )
    assessment_5 = AssessmentEntity(
        evaluation_id="eval1",
        name="relevance",
        source=source_1,
        timestamp=123456789,
        error_code="E002",
        error_message="A different error occurred.",
    )
    assessment_6 = AssessmentEntity(
        evaluation_id="eval1",
        name="relevance",
        source=source_1,
        timestamp=123456789,
        error_code="E001",
        error_message="Another error message.",
    )

    # Same evaluation_id, name, source, timestamp, and numeric_value
    assert assessment_1 == assessment_2
    assert assessment_1 != assessment_3  # Different numeric_value
    assert assessment_1 != assessment_4  # Different source
    assert assessment_1 != assessment_5  # One has numeric_value, other has error_code
    assert assessment_5 != assessment_6  # Different error_code


def test_assessment_properties():
    source = AssessmentSource(source_type="HUMAN", source_id="user_1")
    assessment = AssessmentEntity(
        evaluation_id="eval1",
        name="relevance",
        source=source,
        timestamp=123456789,
        numeric_value=0.9,
        rationale="Rationale text",
        metadata={"key1": "value1"},
    )

    assert assessment.evaluation_id == "eval1"
    assert assessment.name == "relevance"
    assert assessment.source == source
    assert assessment.timestamp == 123456789
    assert assessment.numeric_value == 0.9
    assert assessment.rationale == "Rationale text"
    assert assessment.metadata == {"key1": "value1"}
    assert assessment.error_code is None
    assert assessment.error_message is None


def test_assessment_to_from_dictionary():
    source = AssessmentSource(source_type="HUMAN", source_id="user_1")
    assessment = AssessmentEntity(
        evaluation_id="eval1",
        name="relevance",
        source=source,
        timestamp=123456789,
        numeric_value=0.9,
        rationale="Rationale text",
        metadata={"key1": "value1"},
    )
    assessment_dict = assessment.to_dictionary()

    expected_dict = {
        "evaluation_id": "eval1",
        "name": "relevance",
        "source": source.to_dictionary(),
        "timestamp": 123456789,
        "boolean_value": None,
        "numeric_value": 0.9,
        "string_value": None,
        "rationale": "Rationale text",
        "metadata": {"key1": "value1"},
        "error_code": None,
        "error_message": None,
        "span_id": None,
    }
    assert assessment_dict == expected_dict

    recreated_assessment = AssessmentEntity.from_dictionary(assessment_dict)
    assert recreated_assessment == assessment


def test_assessment_value_validation():
    source = AssessmentSource(source_type="HUMAN", source_id="user_1")

    # Valid cases
    AssessmentEntity(
        evaluation_id="eval1",
        name="relevance",
        source=source,
        timestamp=123456789,
        boolean_value=True,
    )
    AssessmentEntity(
        evaluation_id="eval1",
        name="relevance",
        source=source,
        timestamp=123456789,
        numeric_value=0.9,
    )
    AssessmentEntity(
        evaluation_id="eval1",
        name="relevance",
        source=source,
        timestamp=123456789,
        string_value="value",
    )
    AssessmentEntity(
        evaluation_id="eval1",
        name="relevance",
        source=source,
        timestamp=123456789,
        error_code="E001",
        error_message="Error",
    )

    # Invalid case: more than one value type specified
    with pytest.raises(
        MlflowException,
        match="Exactly one of boolean_value, numeric_value, string_value, or error_code must be "
        "specified for an assessment.",
    ):
        AssessmentEntity(
            evaluation_id="eval1",
            name="relevance",
            source=source,
            timestamp=123456789,
            boolean_value=True,
            numeric_value=0.9,
        )

    # Invalid case: no value type specified
    with pytest.raises(
        MlflowException,
        match="Exactly one of boolean_value, numeric_value, string_value, or error_code must be "
        "specified for an assessment.",
    ):
        AssessmentEntity(
            evaluation_id="eval1",
            name="relevance",
            source=source,
            timestamp=123456789,
        )

    # Invalid case: error_message specified with another value type
    with pytest.raises(
        MlflowException,
        match="error_message cannot be specified when boolean_value, numeric_value, or "
        "string_value is specified.",
    ):
        AssessmentEntity(
            evaluation_id="eval1",
            name="relevance",
            source=source,
            timestamp=123456789,
            numeric_value=0,
            error_message="An error occurred",
        )

    with pytest.raises(
        MlflowException,
        match="error_message cannot be specified when boolean_value, numeric_value, or "
        "string_value is specified.",
    ):
        AssessmentEntity(
            evaluation_id="eval1",
            name="relevance",
            source=source,
            timestamp=123456789,
            string_value="value",
            error_message="An error occurred",
        )

    with pytest.raises(
        MlflowException,
        match="error_message cannot be specified when boolean_value, numeric_value, or "
        "string_value is specified.",
    ):
        AssessmentEntity(
            evaluation_id="eval1",
            name="relevance",
            source=source,
            timestamp=123456789,
            boolean_value=False,
            error_message="An error occurred",
        )
```

--------------------------------------------------------------------------------

---[FILE: test_evaluation.py]---
Location: mlflow-master/tests/evaluate/logging/test_evaluation.py

```python
from unittest import mock

from mlflow.entities import Metric
from mlflow.evaluation import Assessment, Evaluation
from mlflow.evaluation.assessment import AssessmentSource
from mlflow.evaluation.evaluation_tag import EvaluationTag


def test_evaluation_equality():
    inputs = {"feature1": 1.0, "feature2": 2.0}
    outputs = {"prediction": 0.5}
    assessments = [
        Assessment(
            name="assessment1",
            source=AssessmentSource(source_type="HUMAN", source_id="user_1"),
            value=0.9,
        )
    ]
    metrics = [Metric(key="metric1", value=1.1, timestamp=0, step=0)]
    tags = {"tag1": "value1", "tag2": "value2"}

    evaluation_1 = Evaluation(
        inputs=inputs,
        outputs=outputs,
        assessments=assessments,
        metrics=metrics,
        tags=tags,
    )
    evaluation_2 = Evaluation(
        inputs=inputs,
        outputs=outputs,
        assessments=assessments,
        metrics=metrics,
        tags=tags,
    )
    assert evaluation_1 == evaluation_2

    evaluation_3 = Evaluation(
        inputs={"feature1": 3.0, "feature2": 4.0},
        outputs=outputs,
    )
    assert evaluation_1 != evaluation_3


def test_evaluation_properties():
    inputs = {"feature1": 1.0, "feature2": 2.0}
    outputs = {"prediction": 0.5}
    assessments = [
        Assessment(
            name="assessment1",
            source=AssessmentSource(source_type="HUMAN", source_id="user_1"),
            value=0.9,
        )
    ]
    metrics = [Metric(key="metric1", value=1.1, timestamp=0, step=0)]
    tags = {"tag1": "value1", "tag2": "value2"}

    evaluation = Evaluation(
        inputs=inputs,
        outputs=outputs,
        assessments=assessments,
        metrics=metrics,
        tags=tags,
        request_id="req1",
        targets={"target1": 1.0},
        error_code="E001",
        error_message="An error occurred",
    )

    assert evaluation.inputs == inputs
    assert evaluation.outputs == outputs
    assert evaluation.assessments == assessments
    assert evaluation.metrics == metrics
    assert evaluation.tags == [
        EvaluationTag(key="tag1", value="value1"),
        EvaluationTag(key="tag2", value="value2"),
    ]
    assert evaluation.request_id == "req1"
    assert evaluation.targets == {"target1": 1.0}
    assert evaluation.error_code == "E001"
    assert evaluation.error_message == "An error occurred"


def test_evaluation_to_from_dictionary():
    inputs = {"feature1": 1.0, "feature2": 2.0}
    outputs = {"prediction": 0.5}
    assessments = [
        Assessment(
            name="assessment1",
            source=AssessmentSource(source_type="HUMAN", source_id="user_1"),
            value=0.9,
        )
    ]
    metrics = [Metric(key="metric1", value=1.1, timestamp=0, step=0)]
    tags = {"tag1": "value1", "tag2": "value2"}

    evaluation = Evaluation(
        inputs=inputs,
        outputs=outputs,
        assessments=assessments,
        metrics=metrics,
        tags=tags,
        request_id="req1",
        targets={"target1": 1.0},
        error_code="E001",
        error_message="An error occurred",
    )
    evaluation_dict = evaluation.to_dictionary()

    expected_dict = {
        "inputs_id": evaluation.inputs_id,
        "inputs": inputs,
        "outputs": outputs,
        "request_id": "req1",
        "targets": {"target1": 1.0},
        "error_code": "E001",
        "error_message": "An error occurred",
        "assessments": [assessment.to_dictionary() for assessment in assessments],
        "metrics": [metric.to_dictionary() for metric in metrics],
        "tags": [tag.to_dictionary() for tag in evaluation.tags],
    }
    assert evaluation_dict == expected_dict

    recreated_evaluation = Evaluation.from_dictionary(evaluation_dict)
    assert recreated_evaluation == evaluation


def test_evaluation_to_entity():
    inputs = {"feature1": 1.0, "feature2": 2.0}
    outputs = {"prediction": 0.5}
    assessments = [
        Assessment(
            name="assessment1",
            source=AssessmentSource(source_type="HUMAN", source_id="user_1"),
            value=0.9,
        )
    ]
    metrics = [Metric(key="metric1", value=1.1, timestamp=0, step=0)]
    tags = {"tag1": "value1", "tag2": "value2"}

    evaluation = Evaluation(
        inputs=inputs,
        outputs=outputs,
        assessments=assessments,
        metrics=metrics,
        tags=tags,
        request_id="req1",
        targets={"target1": 1.0},
        error_code="E001",
        error_message="An error occurred",
    )

    # Freeze time to ensure consistent timestamp in entity
    with mock.patch("time.time", return_value=1234567890):
        entity = evaluation._to_entity(run_id="run1", evaluation_id="eval1")
        expected_assessments = [a._to_entity("eval1") for a in assessments]
    assert entity.evaluation_id == "eval1"
    assert entity.run_id == "run1"
    assert entity.inputs_id == evaluation.inputs_id
    assert entity.inputs == inputs
    assert entity.outputs == outputs
    assert entity.request_id == "req1"
    assert entity.targets == {"target1": 1.0}
    assert entity.error_code == "E001"
    assert entity.error_message == "An error occurred"
    assert entity.assessments == expected_assessments
    assert entity.metrics == metrics
    assert entity.tags == [
        EvaluationTag(key="tag1", value="value1"),
        EvaluationTag(key="tag2", value="value2"),
    ]


def test_evaluation_inputs_id_uniqueness():
    # Define a few different input objects
    inputs_1 = {"feature1": 1.0, "feature2": 2.0}
    inputs_2 = {"feature1": 1.0, "feature2": 2.0}  # Same as inputs_1
    inputs_3 = {"feature1": 3.0, "feature2": 4.0}  # Different from inputs_1 and inputs_2
    inputs_4 = {"feature1": "value1", "feature2": "value2"}
    inputs_5 = {"feature1": "value1", "feature2": "value2"}  # Same as inputs_4
    inputs_6 = {"feature1": "value3", "feature2": "value4"}  # Different from inputs_4 and inputs_5

    # Create Evaluation objects
    evaluation_1 = Evaluation(inputs=inputs_1)
    evaluation_2 = Evaluation(inputs=inputs_2)
    evaluation_3 = Evaluation(inputs=inputs_3)
    evaluation_4 = Evaluation(inputs=inputs_4)
    evaluation_5 = Evaluation(inputs=inputs_5)
    evaluation_6 = Evaluation(inputs=inputs_6)

    # Verify that inputs_id is the same for equivalent inputs
    assert evaluation_1.inputs_id == evaluation_2.inputs_id
    assert evaluation_4.inputs_id == evaluation_5.inputs_id

    # Verify that inputs_id is different for different inputs
    assert evaluation_1.inputs_id != evaluation_3.inputs_id
    assert evaluation_1.inputs_id != evaluation_4.inputs_id
    assert evaluation_1.inputs_id != evaluation_6.inputs_id
    assert evaluation_4.inputs_id != evaluation_6.inputs_id

    # Additional verification for unique inputs_id generation
    inputs_7 = {"feature1": 5.0, "feature2": 6.0}
    inputs_8 = {"feature1": 7.0, "feature2": 8.0}
    evaluation_7 = Evaluation(inputs=inputs_7)
    evaluation_8 = Evaluation(inputs=inputs_8)

    assert evaluation_7.inputs_id != evaluation_8.inputs_id

    # Ensure different orders of the same inputs result in the same inputs_id
    inputs_9 = {"feature2": 2.0, "feature1": 1.0}  # Same values as inputs_1, but different order
    evaluation_9 = Evaluation(inputs=inputs_9)

    assert evaluation_1.inputs_id == evaluation_9.inputs_id


def test_evaluation_with_non_json_serializable_inputs():
    class NonSerializable:
        def __init__(self, value):
            self.value = value

        def __str__(self):
            return f"NonSerializable(value={self.value})"

    # Define non-JSON-serializable inputs
    inputs_1 = {"feature1": NonSerializable(1), "feature2": NonSerializable(2)}
    inputs_2 = {"feature1": NonSerializable(1), "feature2": NonSerializable(2)}  # Same as inputs_1
    inputs_3 = {
        "feature1": NonSerializable(3),
        "feature2": NonSerializable(4),
    }  # Different from inputs_1

    # Create Evaluation objects
    evaluation_1 = Evaluation(inputs=inputs_1)
    evaluation_2 = Evaluation(inputs=inputs_2)
    evaluation_3 = Evaluation(inputs=inputs_3)

    # Verify that inputs_id is the same for equivalent inputs
    assert evaluation_1.inputs_id == evaluation_2.inputs_id

    # Verify that inputs_id is different for different inputs
    assert evaluation_1.inputs_id != evaluation_3.inputs_id

    # Verify that inputs_id is generated
    assert evaluation_1.inputs_id is not None
    assert evaluation_2.inputs_id is not None
    assert evaluation_3.inputs_id is not None
```

--------------------------------------------------------------------------------

---[FILE: test_evaluation_entity.py]---
Location: mlflow-master/tests/evaluate/logging/test_evaluation_entity.py

```python
from mlflow.entities import Metric
from mlflow.evaluation.assessment import AssessmentEntity, AssessmentSource
from mlflow.evaluation.evaluation import EvaluationEntity
from mlflow.evaluation.evaluation_tag import EvaluationTag


def test_evaluation_equality():
    source_1 = AssessmentSource(source_type="HUMAN", source_id="user_1")
    metric_1 = Metric(key="metric1", value=1.1, timestamp=123, step=0)
    tag_1 = EvaluationTag(key="tag1", value="value1")

    # Valid evaluations
    evaluation_1 = EvaluationEntity(
        evaluation_id="eval1",
        run_id="run1",
        inputs_id="inputs1",
        inputs={"feature1": 1.0, "feature2": 2.0},
        outputs={"prediction": 0.5},
        request_id="req1",
        targets={"actual": 0.6},
        assessments=[
            AssessmentEntity(
                evaluation_id="eval1",
                name="relevance",
                source=source_1,
                timestamp=123456789,
                numeric_value=0.9,
            )
        ],
        metrics=[metric_1],
        tags=[tag_1],
        error_code="E001",
        error_message="An error occurred",
    )
    evaluation_2 = EvaluationEntity(
        evaluation_id="eval1",
        run_id="run1",
        inputs_id="inputs1",
        inputs={"feature1": 1.0, "feature2": 2.0},
        outputs={"prediction": 0.5},
        request_id="req1",
        targets={"actual": 0.6},
        assessments=[
            AssessmentEntity(
                evaluation_id="eval1",
                name="relevance",
                source=source_1,
                timestamp=123456789,
                numeric_value=0.9,
            )
        ],
        metrics=[metric_1],
        tags=[tag_1],
        error_code="E001",
        error_message="An error occurred",
    )
    evaluation_3 = EvaluationEntity(
        evaluation_id="eval2",
        run_id="run2",
        inputs_id="inputs2",
        inputs={"feature1": 1.0, "feature2": 2.0},
        outputs={"prediction": 0.5},
        request_id="req2",
        targets={"actual": 0.7},
        assessments=[
            AssessmentEntity(
                evaluation_id="eval2",
                name="relevance",
                source=source_1,
                timestamp=123456789,
                numeric_value=0.8,
            )
        ],
        metrics=[Metric(key="metric1", value=1.2, timestamp=123, step=0)],
        tags=[EvaluationTag(key="tag2", value="value2")],
        error_code="E002",
        error_message="Another error occurred",
    )

    assert evaluation_1 == evaluation_2  # Same evaluation data
    assert evaluation_1 != evaluation_3  # Different evaluation data


def test_evaluation_properties():
    source = AssessmentSource(source_type="HUMAN", source_id="user_1")
    metric = Metric(key="metric1", value=1.1, timestamp=123, step=0)
    tag = EvaluationTag(key="tag1", value="value1")
    assessment = AssessmentEntity(
        evaluation_id="eval1",
        name="relevance",
        source=source,
        timestamp=123456789,
        numeric_value=0.9,
        rationale="Rationale text",
        metadata={"key1": "value1"},
    )
    evaluation = EvaluationEntity(
        evaluation_id="eval1",
        run_id="run1",
        inputs_id="inputs1",
        inputs={"feature1": 1.0, "feature2": 2.0},
        outputs={"prediction": 0.5},
        request_id="req1",
        targets={"actual": 0.6},
        assessments=[assessment],
        metrics=[metric],
        tags=[tag],
        error_code="E001",
        error_message="An error occurred",
    )

    assert evaluation.evaluation_id == "eval1"
    assert evaluation.run_id == "run1"
    assert evaluation.inputs_id == "inputs1"
    assert evaluation.inputs == {"feature1": 1.0, "feature2": 2.0}
    assert evaluation.outputs == {"prediction": 0.5}
    assert evaluation.request_id == "req1"
    assert evaluation.targets == {"actual": 0.6}
    assert evaluation.error_code == "E001"
    assert evaluation.error_message == "An error occurred"
    assert evaluation.assessments == [assessment]
    assert evaluation.metrics == [metric]
    assert evaluation.tags == [tag]


def test_evaluation_to_from_dictionary():
    source = AssessmentSource(source_type="HUMAN", source_id="user_1")
    metric = Metric(key="metric1", value=1.1, timestamp=123, step=0)
    tag = EvaluationTag(key="tag1", value="value1")
    assessment = AssessmentEntity(
        evaluation_id="eval1",
        name="relevance",
        source=source,
        timestamp=123456789,
        numeric_value=0.9,
        rationale="Rationale text",
        metadata={"key1": "value1"},
    )
    evaluation = EvaluationEntity(
        evaluation_id="eval1",
        run_id="run1",
        inputs_id="inputs1",
        inputs={"feature1": 1.0, "feature2": 2.0},
        outputs={"prediction": 0.5},
        request_id="req1",
        targets={"actual": 0.6},
        assessments=[assessment],
        metrics=[metric],
        tags=[tag],
        error_code="E001",
        error_message="An error occurred",
    )
    evaluation_dict = evaluation.to_dictionary()

    expected_dict = {
        "evaluation_id": "eval1",
        "run_id": "run1",
        "inputs_id": "inputs1",
        "inputs": {"feature1": 1.0, "feature2": 2.0},
        "outputs": {"prediction": 0.5},
        "request_id": "req1",
        "targets": {"actual": 0.6},
        "assessments": [assessment.to_dictionary()],
        "metrics": [metric.to_dictionary()],
        "tags": [tag.to_dictionary()],
        "error_code": "E001",
        "error_message": "An error occurred",
    }
    assert evaluation_dict == expected_dict

    recreated_evaluation = EvaluationEntity.from_dictionary(evaluation_dict)
    assert recreated_evaluation == evaluation


def test_evaluation_construction_with_minimal_required_fields():
    evaluation = EvaluationEntity(
        evaluation_id="eval1",
        run_id="run1",
        inputs_id="inputs1",
        inputs={"feature1": 1.0, "feature2": 2.0},
    )
    evaluation_dict = evaluation.to_dictionary()
    recreated_evaluation = EvaluationEntity.from_dictionary(evaluation_dict)
    assert recreated_evaluation == evaluation
```

--------------------------------------------------------------------------------

---[FILE: test_evaluation_tag.py]---
Location: mlflow-master/tests/evaluate/logging/test_evaluation_tag.py

```python
import pytest

from mlflow.evaluation.evaluation_tag import EvaluationTag


def test_evaluation_tag_equality():
    tag1 = EvaluationTag(key="tag1", value="value1")
    tag2 = EvaluationTag(key="tag1", value="value1")
    tag3 = EvaluationTag(key="tag1", value="value2")
    tag4 = EvaluationTag(key="tag2", value="value1")

    assert tag1 == tag2  # Same key and value
    assert tag1 != tag3  # Different value
    assert tag1 != tag4  # Different key


def test_evaluation_tag_properties():
    tag = EvaluationTag(key="tag1", value="value1")

    assert tag.key == "tag1"
    assert tag.value == "value1"


def test_evaluation_tag_to_from_dictionary():
    tag = EvaluationTag(key="tag1", value="value1")
    tag_dict = tag.to_dictionary()

    expected_dict = {
        "key": "tag1",
        "value": "value1",
    }
    assert tag_dict == expected_dict

    recreated_tag = EvaluationTag.from_dictionary(tag_dict)
    assert recreated_tag == tag


def test_evaluation_tag_key_value_validation():
    # Valid cases
    EvaluationTag(key="tag1", value="value1")
    EvaluationTag(key="tag2", value="value2")

    # Invalid case: missing key
    with pytest.raises(KeyError, match="key"):
        EvaluationTag.from_dictionary({"value": "value1"})

    # Invalid case: missing value
    with pytest.raises(KeyError, match="value"):
        EvaluationTag.from_dictionary({"key": "tag1"})
```

--------------------------------------------------------------------------------

````
