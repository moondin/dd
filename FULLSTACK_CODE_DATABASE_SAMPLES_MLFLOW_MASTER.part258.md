---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 258
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 258 of 991)

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

---[FILE: assessment.py]---
Location: mlflow-master/mlflow/evaluation/assessment.py

```python
"""
THE 'mlflow.evaluation` MODULE IS LEGACY AND WILL BE REMOVED SOON. PLEASE DO NOT USE THESE CLASSES
IN NEW CODE. INSTEAD, USE `mlflow/entities/assessment.py` FOR ASSESSMENT CLASSES.
"""

import numbers
import time
from typing import Any

from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.entities.assessment import AssessmentSource, AssessmentSourceType
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.utils.annotations import deprecated


@deprecated(since="3.0.0", alternative="mlflow.entities.Assessment")
class AssessmentEntity(_MlflowObject):
    """
    Assessment data associated with an evaluation.
    """

    def __init__(
        self,
        evaluation_id: str,
        name: str,
        source: AssessmentSource,
        timestamp: int,
        boolean_value: bool | None = None,
        numeric_value: float | None = None,
        string_value: str | None = None,
        rationale: str | None = None,
        metadata: dict[str, str] | None = None,
        error_code: str | None = None,
        error_message: str | None = None,
        span_id: str | None = None,
    ):
        """Construct a new mlflow.evaluation.AssessmentEntity instance.

        Args:
            evaluation_id: The ID of the evaluation with which the assessment is associated.
            name: The name of the assessment.
            source: The source of the assessment (AssessmentSource instance).
            timestamp: The timestamp when the assessment was given.
            boolean_value: The boolean assessment value, if applicable.
            numeric_value: The numeric assessment value, if applicable.
            string_value: The string assessment value, if applicable.
            rationale: The rationale / justification for the value.
            metadata: Additional metadata for the assessment, e.g. the index of the chunk in the
                      retrieved documents that the assessment applies to.
            error_code: An error code representing any issues encountered during the assessment.
            error_message: A descriptive error message representing any issues encountered during
                the assessment.
            span_id: The span ID of the span within the Trace, that the assessment is evaluating,
                     e.g. if you are evaluating a retrieval span for document recall, you can
                     specify the span ID of the retrieval span here. This field is only supported
                     by mlflow.log_feedback.
        """
        self._evaluation_id = evaluation_id
        self._name = name
        self._source = source
        self._timestamp = timestamp
        self._boolean_value = boolean_value
        self._numeric_value = numeric_value
        self._string_value = string_value
        self._rationale = rationale
        self._metadata = metadata or {}
        self._error_code = error_code
        self._error_message = error_message
        self._span_id = span_id

        if error_message is not None and (
            boolean_value is not None or numeric_value is not None or string_value is not None
        ):
            raise MlflowException(
                "error_message cannot be specified when boolean_value, numeric_value, "
                "or string_value is specified.",
                INVALID_PARAMETER_VALUE,
            )

        if (self._boolean_value, self._string_value, self._numeric_value, self._error_code).count(
            None
        ) != 3:
            raise MlflowException(
                "Exactly one of boolean_value, numeric_value, string_value, or error_code must be "
                "specified for an assessment.",
                INVALID_PARAMETER_VALUE,
            )

    @property
    def evaluation_id(self) -> str:
        """The evaluation ID."""
        return self._evaluation_id

    @property
    def name(self) -> str:
        """The name of the assessment."""
        return self._name

    @property
    def timestamp(self) -> int:
        """The timestamp of the assessment."""
        return self._timestamp

    @property
    def boolean_value(self) -> bool | None:
        """The boolean assessment value."""
        return self._boolean_value

    @property
    def numeric_value(self) -> float | None:
        """The numeric assessment value."""
        return self._numeric_value

    @property
    def string_value(self) -> str | None:
        """The string assessment value."""
        return self._string_value

    @property
    def rationale(self) -> str | None:
        """The rationale / justification for the assessment."""
        return self._rationale

    @property
    def source(self) -> AssessmentSource:
        """The source of the assessment."""
        return self._source

    @property
    def metadata(self) -> dict[str, Any]:
        """The metadata associated with the assessment."""
        return self._metadata

    @property
    def error_code(self) -> str | None:
        """The error code."""
        return self._error_code

    @property
    def error_message(self) -> str | None:
        """The error message."""
        return self._error_message

    @property
    def span_id(self) -> str | None:
        """The span ID of the span within the Trace, that the assessment is evaluating."""
        return self._span_id

    def __eq__(self, __o):
        if isinstance(__o, self.__class__):
            return self.to_dictionary() == __o.to_dictionary()
        return False

    def to_dictionary(self) -> dict[str, Any]:
        return {
            "evaluation_id": self.evaluation_id,
            "name": self.name,
            "source": self.source.to_dictionary(),
            "timestamp": self.timestamp,
            "boolean_value": self.boolean_value,
            "numeric_value": self.numeric_value,
            "string_value": self.string_value,
            "rationale": self.rationale,
            "metadata": self.metadata,
            "error_code": self.error_code,
            "error_message": self.error_message,
            "span_id": self.span_id,
        }

    @classmethod
    def from_dictionary(cls, assessment_dict: dict[str, Any]) -> "AssessmentEntity":
        """
        Create an Assessment object from a dictionary.

        Args:
            assessment_dict (dict): Dictionary containing assessment information.

        Returns:
            Assessment: The Assessment object created from the dictionary.
        """
        return cls(
            evaluation_id=assessment_dict["evaluation_id"],
            name=assessment_dict["name"],
            source=AssessmentSource.from_dictionary(assessment_dict["source"]),
            timestamp=assessment_dict["timestamp"],
            boolean_value=assessment_dict.get("boolean_value"),
            numeric_value=assessment_dict.get("numeric_value"),
            string_value=assessment_dict.get("string_value"),
            rationale=assessment_dict.get("rationale"),
            metadata=assessment_dict.get("metadata"),
            error_code=assessment_dict.get("error_code"),
            error_message=assessment_dict.get("error_message"),
            span_id=assessment_dict.get("span_id"),
        )


@deprecated(since="3.0.0", alternative="mlflow.entities.Assessment")
class Assessment(_MlflowObject):
    """
    Assessment data associated with an evaluation result.

    Assessment is an enriched output from the evaluation that provides more context,
    such as the rationale, source, and metadata for the evaluation result.

    Example:

    .. code-block:: python

        from mlflow.evaluation import Assessment

        assessment = Assessment(
            name="answer_correctness",
            value=0.5,
            rationale="The answer is partially correct.",
        )
    """

    def __init__(
        self,
        name: str,
        source: AssessmentSource | None = None,
        value: bool | float | str | None = None,
        rationale: str | None = None,
        metadata: dict[str, Any] | None = None,
        error_code: str | None = None,
        error_message: str | None = None,
    ):
        """Construct a new Assessment instance.

        Args:
            name: The name of the piece of assessment.
            source: The source of the assessment (AssessmentSource instance).
            value: The value of the assessment. This can be a boolean, numeric, or string value.
            rationale: The rationale / justification for the value.
            metadata: Additional metadata for the assessment, e.g. the index of the chunk in the
                      retrieved documents that the assessment applies to.
            error_code: An error code representing any issues encountered during the assessment.
            error_message: A descriptive error message representing any issues encountered during
                the assessment.
        """
        if (value is None) == (error_code is None):
            raise MlflowException(
                "Exactly one of value or error_code must be specified for an assessment.",
                INVALID_PARAMETER_VALUE,
            )

        if value is not None and error_message is not None:
            raise MlflowException(
                "error_message cannot be specified when value is specified.",
                INVALID_PARAMETER_VALUE,
            )

        self._name = name
        self._source = source or AssessmentSource(
            source_type=AssessmentSourceType.SOURCE_TYPE_UNSPECIFIED,
            source_id="unknown",
        )
        self._value = value
        self._rationale = rationale
        self._metadata = metadata or {}
        self._error_code = error_code
        self._error_message = error_message

        self._boolean_value = None
        self._numeric_value = None
        self._string_value = None
        if isinstance(value, bool):
            self._boolean_value = value
        elif isinstance(value, numbers.Number):
            self._numeric_value = float(value)
        elif value is not None:
            self._string_value = str(value)

    @property
    def name(self) -> str:
        """The name of the assessment."""
        return self._name

    @property
    def value(self) -> bool | float | str:
        """The assessment value."""
        return self._value

    @property
    def rationale(self) -> str | None:
        """The rationale / justification for the assessment."""
        return self._rationale

    @property
    def source(self) -> AssessmentSource:
        """The source of the assessment."""
        return self._source

    @property
    def metadata(self) -> dict[str, Any]:
        """The metadata associated with the assessment."""
        return self._metadata

    @property
    def error_code(self) -> str | None:
        """The error code."""
        return self._error_code

    @property
    def error_message(self) -> str | None:
        """The error message."""
        return self._error_message

    def __eq__(self, __o):
        if isinstance(__o, self.__class__):
            return self.to_dictionary() == __o.to_dictionary()
        return False

    def to_dictionary(self) -> dict[str, Any]:
        return {
            "name": self.name,
            "source": self.source.to_dictionary() if self.source is not None else None,
            "value": self.value,
            "rationale": self.rationale,
            "metadata": self.metadata,
            "error_code": self.error_code,
            "error_message": self.error_message,
        }

    @classmethod
    def from_dictionary(cls, assessment_dict: dict[str, Any]) -> "Assessment":
        """
        Create an Assessment object from a dictionary.

        Args:
            assessment_dict (dict): Dictionary containing assessment information.

        Returns:
            Assessment: The Assessment object created from the dictionary.
        """
        return cls(
            name=assessment_dict["name"],
            source=AssessmentSource.from_dictionary(assessment_dict["source"]),
            value=assessment_dict.get("value"),
            rationale=assessment_dict.get("rationale"),
            metadata=assessment_dict.get("metadata"),
            error_code=assessment_dict.get("error_code"),
            error_message=assessment_dict.get("error_message"),
        )

    def _to_entity(self, evaluation_id: str) -> AssessmentEntity:
        # We require that the source be specified for an assessment before sending it to the backend
        if self._source is None:
            raise MlflowException(
                message=(
                    f"Assessment source must be specified."
                    f"Got empty source for assessment with name {self._name}"
                ),
                error_code=INVALID_PARAMETER_VALUE,
            )
        return AssessmentEntity(
            evaluation_id=evaluation_id,
            name=self._name,
            source=self._source,
            timestamp=int(time.time() * 1000),
            boolean_value=self._boolean_value,
            numeric_value=self._numeric_value,
            string_value=self._string_value,
            rationale=self._rationale,
            metadata=self._metadata,
            error_code=self._error_code,
            error_message=self._error_message,
        )
```

--------------------------------------------------------------------------------

---[FILE: evaluation.py]---
Location: mlflow-master/mlflow/evaluation/evaluation.py

```python
"""
THE 'mlflow.evaluation` MODULE IS LEGACY AND WILL BE REMOVED IN MLFLOW 3.0.
For assessment functionality, use `mlflow.entities.assessment` for assessment classes and
`mlflow.tracing.assessments` for assessment APIs. There are no alternatives for Evaluation and
EvaluationEntity objects and related APIs.
"""

import hashlib
import json
from typing import Any

from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.entities.metric import Metric
from mlflow.evaluation.assessment import Assessment, AssessmentEntity
from mlflow.evaluation.evaluation_tag import (
    EvaluationTag,  # Assuming EvaluationTag is in this module
)
from mlflow.tracing.utils import TraceJSONEncoder
from mlflow.utils.annotations import deprecated


@deprecated(since="3.0.0")
class EvaluationEntity(_MlflowObject):
    """
    Evaluation result data, including inputs, outputs, targets, assessments, and more.
    """

    def __init__(
        self,
        evaluation_id: str,
        run_id: str,
        inputs_id: str,
        inputs: dict[str, Any],
        outputs: dict[str, Any] | None = None,
        request_id: str | None = None,
        targets: dict[str, Any] | None = None,
        error_code: str | None = None,
        error_message: str | None = None,
        assessments: list[AssessmentEntity] | None = None,
        metrics: list[Metric] | None = None,
        tags: list[EvaluationTag] | None = None,
    ):
        """
        Construct a new mlflow.evaluation.EvaluationEntity instance.

        Args:
            evaluation_id: A unique identifier for the evaluation.
            run_id: The ID of the MLflow Run containing the Evaluation.
            inputs_id: A unique identifier for the input names and values for evaluation.
            inputs: Input names and values for evaluation.
            outputs: Outputs obtained during inference.
            request_id: The ID of an MLflow Trace corresponding to the inputs and outputs.
            targets: Expected values that the model should produce during inference.
            error_code: An error code representing any issues encountered during the evaluation.
            error_message: A descriptive error message representing any issues encountered during
                the evaluation.
            assessments: Assessments for the evaluation.
            metrics: Objective numerical metrics for the evaluation, e.g., "number of input tokens",
                "number of output tokens".
            tags: List of tags associated with the evaluation.
        """
        self._evaluation_id = evaluation_id
        self._run_id = run_id
        self._inputs_id = inputs_id
        self._inputs = inputs
        self._outputs = outputs
        self._request_id = request_id
        self._targets = targets
        self._error_code = error_code
        self._error_message = error_message
        self._assessments = assessments
        self._metrics = metrics
        self._tags = tags

    @property
    def evaluation_id(self) -> str:
        """The evaluation ID."""
        return self._evaluation_id

    @property
    def run_id(self) -> str:
        """The ID of the MLflow Run containing the evaluation"""
        return self._run_id

    @property
    def inputs_id(self) -> str:
        """The evaluation inputs ID."""
        return self._inputs_id

    @property
    def inputs(self) -> dict[str, Any]:
        """The evaluation inputs."""
        return self._inputs

    @property
    def outputs(self) -> dict[str, Any] | None:
        """The evaluation outputs."""
        return self._outputs

    @property
    def request_id(self) -> str | None:
        """The evaluation request ID."""
        return self._request_id

    @property
    def targets(self) -> dict[str, Any] | None:
        """The evaluation targets."""
        return self._targets

    @property
    def error_code(self) -> str | None:
        """The evaluation error code."""
        return self._error_code

    @property
    def error_message(self) -> str | None:
        """The evaluation error message."""
        return self._error_message

    @property
    def assessments(self) -> list[AssessmentEntity] | None:
        """The evaluation assessments."""
        return self._assessments

    @property
    def metrics(self) -> list[Metric] | None:
        """The evaluation metrics."""
        return self._metrics

    @property
    def tags(self) -> list[EvaluationTag] | None:
        """The evaluation tags."""
        return self._tags

    def __eq__(self, __o):
        if isinstance(__o, self.__class__):
            return self.to_dictionary() == __o.to_dictionary()
        return False

    def to_dictionary(self) -> dict[str, Any]:
        """
        Convert the Evaluation object to a dictionary.

        Returns:
            dict: The Evaluation object represented as a dictionary.
        """
        evaluation_dict = {
            "evaluation_id": self.evaluation_id,
            "run_id": self.run_id,
            "inputs_id": self.inputs_id,
            "inputs": self.inputs,
            "outputs": self.outputs,
            "request_id": self.request_id,
            "targets": self.targets,
            "error_code": self.error_code,
            "error_message": self.error_message,
            "assessments": [assess.to_dictionary() for assess in self.assessments]
            if self.assessments
            else None,
            "metrics": [metric.to_dictionary() for metric in self.metrics]
            if self.metrics
            else None,
            "tags": [tag.to_dictionary() for tag in self.tags] if self.tags else None,
        }
        return {k: v for k, v in evaluation_dict.items() if v is not None}

    @classmethod
    def from_dictionary(cls, evaluation_dict: dict[str, Any]):
        """
        Create an Evaluation object from a dictionary.

        Args:
            evaluation_dict (dict): Dictionary containing evaluation information.

        Returns:
            Evaluation: The Evaluation object created from the dictionary.
        """
        assessments = None
        if "assessments" in evaluation_dict:
            assessments = [
                AssessmentEntity.from_dictionary(assess)
                for assess in evaluation_dict["assessments"]
            ]
        metrics = None
        if "metrics" in evaluation_dict:
            metrics = [Metric.from_dictionary(metric) for metric in evaluation_dict["metrics"]]
        tags = None
        if "tags" in evaluation_dict:
            tags = [EvaluationTag(tag["key"], tag["value"]) for tag in evaluation_dict["tags"]]
        return cls(
            evaluation_id=evaluation_dict["evaluation_id"],
            run_id=evaluation_dict["run_id"],
            inputs_id=evaluation_dict["inputs_id"],
            inputs=evaluation_dict["inputs"],
            outputs=evaluation_dict.get("outputs"),
            request_id=evaluation_dict.get("request_id"),
            targets=evaluation_dict.get("targets"),
            error_code=evaluation_dict.get("error_code"),
            error_message=evaluation_dict.get("error_message"),
            assessments=assessments,
            metrics=metrics,
            tags=tags,
        )


@deprecated(since="3.0.0")
class Evaluation(_MlflowObject):
    """
    Evaluation result data.
    """

    def __init__(
        self,
        inputs: dict[str, Any],
        outputs: dict[str, Any] | None = None,
        inputs_id: str | None = None,
        request_id: str | None = None,
        targets: dict[str, Any] | None = None,
        error_code: str | None = None,
        error_message: str | None = None,
        assessments: list[Assessment] | None = None,
        metrics: dict[str, float] | list[Metric] | None = None,
        tags: dict[str, str] | None = None,
    ):
        """
        Construct a new Evaluation instance.

        Args:
            inputs: Input names and values for evaluation.
            outputs: Outputs obtained during inference.
            inputs_id: A unique identifier for the input names and values for evaluation.
            request_id: The ID of an MLflow Trace corresponding to the inputs and outputs.
            targets: Expected values that the model should produce during inference.
            error_code: An error code representing any issues encountered during the evaluation.
            error_message: A descriptive error message representing any issues encountered during
                the evaluation.
            assessments: Assessments for the evaluation.
            metrics: Objective numerical metrics for the evaluation, e.g., "number of input tokens",
                "number of output tokens".
            tags: Dictionary of tags associated with the evaluation.
        """
        if isinstance(metrics, dict):
            metrics = [
                Metric(key=key, value=value, timestamp=0, step=0) for key, value in metrics.items()
            ]
        if isinstance(tags, dict):
            tags = [EvaluationTag(key=str(key), value=str(value)) for key, value in tags.items()]

        self._inputs = inputs
        self._outputs = outputs
        self._inputs_id = inputs_id or _generate_inputs_id(inputs)
        self._request_id = request_id
        self._targets = targets
        self._error_code = error_code
        self._error_message = error_message
        self._assessments = assessments
        self._metrics = metrics
        self._tags = tags

    @property
    def inputs_id(self) -> str:
        """The evaluation inputs ID."""
        return self._inputs_id

    @property
    def inputs(self) -> dict[str, Any]:
        """The evaluation inputs."""
        return self._inputs

    @property
    def outputs(self) -> dict[str, Any] | None:
        """The evaluation outputs."""
        return self._outputs

    @property
    def request_id(self) -> str | None:
        """The evaluation request ID."""
        return self._request_id

    @property
    def targets(self) -> dict[str, Any] | None:
        """The evaluation targets."""
        return self._targets

    @property
    def error_code(self) -> str | None:
        """The evaluation error code."""
        return self._error_code

    @property
    def error_message(self) -> str | None:
        """The evaluation error message."""
        return self._error_message

    @property
    def assessments(self) -> list[Assessment] | None:
        """The evaluation assessments."""
        return self._assessments

    @property
    def metrics(self) -> list[Metric] | None:
        """The evaluation metrics."""
        return self._metrics

    @property
    def tags(self) -> dict[str, str] | None:
        """The evaluation tags."""
        return self._tags

    def __eq__(self, __o):
        if isinstance(__o, self.__class__):
            return self.to_dictionary() == __o.to_dictionary()
        return False

    def _to_entity(self, run_id: str, evaluation_id: str) -> EvaluationEntity:
        """
        Convert the Evaluation object to an EvaluationEntity object.

        Returns:
            EvaluationEntity: An EvaluationEntity object.
        """
        return EvaluationEntity(
            evaluation_id=evaluation_id,
            run_id=run_id,
            inputs_id=self.inputs_id,
            inputs=self.inputs,
            outputs=self.outputs,
            request_id=self.request_id,
            targets=self.targets,
            error_code=self.error_code,
            error_message=self.error_message,
            assessments=[assess._to_entity(evaluation_id) for assess in self.assessments]
            if self.assessments
            else None,
            metrics=self.metrics,
            tags=self.tags,
        )

    def to_dictionary(self) -> dict[str, Any]:
        """
        Convert the Evaluation object to a dictionary.

        Returns:
            dict: The Evaluation object represented as a dictionary.
        """
        evaluation_dict = {
            "inputs_id": self.inputs_id,
            "inputs": self.inputs,
            "outputs": self.outputs,
            "request_id": self.request_id,
            "targets": self.targets,
            "error_code": self.error_code,
            "error_message": self.error_message,
            "assessments": [assess.to_dictionary() for assess in self.assessments]
            if self.assessments
            else None,
            "metrics": [metric.to_dictionary() for metric in self.metrics]
            if self.metrics
            else None,
            "tags": [tag.to_dictionary() for tag in self.tags] if self.tags else None,
        }
        return {k: v for k, v in evaluation_dict.items() if v is not None}

    @classmethod
    def from_dictionary(cls, evaluation_dict: dict[str, Any]):
        """
        Create an Evaluation object from a dictionary.

        Args:
            evaluation_dict (dict): Dictionary containing evaluation information.

        Returns:
            Evaluation: The Evaluation object created from the dictionary.
        """
        assessments = None
        if "assessments" in evaluation_dict:
            assessments = [
                Assessment.from_dictionary(assess) for assess in evaluation_dict["assessments"]
            ]
        metrics = None
        if "metrics" in evaluation_dict:
            metrics = [Metric.from_dictionary(metric) for metric in evaluation_dict["metrics"]]
        tags = None
        if "tags" in evaluation_dict:
            tags = [EvaluationTag(tag["key"], tag["value"]) for tag in evaluation_dict["tags"]]
        return cls(
            inputs_id=evaluation_dict["inputs_id"],
            inputs=evaluation_dict["inputs"],
            outputs=evaluation_dict.get("outputs"),
            request_id=evaluation_dict.get("request_id"),
            targets=evaluation_dict.get("targets"),
            error_code=evaluation_dict.get("error_code"),
            error_message=evaluation_dict.get("error_message"),
            assessments=assessments,
            metrics=metrics,
            tags=tags,
        )


def _generate_inputs_id(inputs: dict[str, Any]) -> str:
    """
    Generates a unique identifier for the inputs.

    Args:
        inputs (Dict[str, Any]): Input fields used by the model to compute outputs.

    Returns:
        str: A unique identifier for the inputs.
    """
    inputs_json = json.dumps(inputs, sort_keys=True, cls=TraceJSONEncoder)
    return hashlib.sha256(inputs_json.encode("utf-8")).hexdigest()
```

--------------------------------------------------------------------------------

---[FILE: evaluation_tag.py]---
Location: mlflow-master/mlflow/evaluation/evaluation_tag.py

```python
"""
THE 'mlflow.evaluation` MODULE IS LEGACY AND WILL BE REMOVED SOON. PLEASE DO NOT USE THESE CLASSES
IN NEW CODE. INSTEAD, USE `mlflow/entities/assessment.py` FOR ASSESSMENT CLASSES.
"""

from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.utils.annotations import deprecated


@deprecated(since="3.0.0")
class EvaluationTag(_MlflowObject):
    """Key-value tag associated with an evaluation."""

    def __init__(self, key, value):
        self._key = key
        self._value = value

    def __eq__(self, other):
        if type(other) is type(self):
            return self.__dict__ == other.__dict__
        return False

    @property
    def key(self):
        """String name of the tag."""
        return self._key

    @property
    def value(self):
        """String value of the tag."""
        return self._value

    def to_dictionary(self) -> dict[str, str]:
        """
        Convert the EvaluationTag object to a dictionary.

        Returns:
            dict: The EvaluationTag object represented as a dictionary.
        """
        return {
            "key": self.key,
            "value": self.value,
        }

    @classmethod
    def from_dictionary(cls, evaluation_tag_dict: dict[str, str]):
        """
        Create an EvaluationTag object from a dictionary.

        Args:
            evaluation_tag_dict (dict): Dictionary containing evaluation tag information.

        Returns:
            Evaluation: The EvaluationTag object created from the dictionary.
        """
        key = evaluation_tag_dict["key"]
        value = evaluation_tag_dict["value"]
        return cls(
            key=key,
            value=value,
        )
```

--------------------------------------------------------------------------------

---[FILE: fluent.py]---
Location: mlflow-master/mlflow/evaluation/fluent.py

```python
"""
THE 'mlflow.evaluation` MODULE IS LEGACY AND WILL BE REMOVED SOON. PLEASE DO NOT USE THESE CLASSES
IN NEW CODE. INSTEAD, USE `mlflow/entities/assessment.py` FOR ASSESSMENT CLASSES.
"""

import uuid

from mlflow.evaluation.evaluation import Evaluation, EvaluationEntity
from mlflow.evaluation.utils import evaluations_to_dataframes
from mlflow.tracking.client import MlflowClient
from mlflow.tracking.fluent import _get_or_start_run
from mlflow.utils.annotations import deprecated


@deprecated(since="3.0.0")
def log_evaluations(
    *, evaluations: list[Evaluation], run_id: str | None = None
) -> list[EvaluationEntity]:
    """
    Logs one or more evaluations to an MLflow Run.

    Args:
      evaluations (List[Evaluation]): List of one or more MLflow Evaluation objects.
      run_id (Optional[str]): ID of the MLflow Run to log the evaluation. If unspecified, the
          current active run is used, or a new run is started.

    Returns:
      List[EvaluationEntity]: The logged Evaluation objects.
    """
    run_id = run_id if run_id is not None else _get_or_start_run().info.run_id
    if not evaluations:
        return []

    client = MlflowClient()
    evaluation_entities = [
        evaluation._to_entity(run_id=run_id, evaluation_id=uuid.uuid4().hex)
        for evaluation in evaluations
    ]
    evaluations_df, metrics_df, assessments_df, tags_df = evaluations_to_dataframes(
        evaluation_entities
    )
    client.log_table(run_id=run_id, data=evaluations_df, artifact_file="_evaluations.json")
    client.log_table(run_id=run_id, data=metrics_df, artifact_file="_metrics.json")
    client.log_table(run_id=run_id, data=assessments_df, artifact_file="_assessments.json")
    client.log_table(run_id=run_id, data=tags_df, artifact_file="_tags.json")

    return evaluation_entities
```

--------------------------------------------------------------------------------

---[FILE: utils.py]---
Location: mlflow-master/mlflow/evaluation/utils.py

```python
"""
THE 'mlflow.evaluation` MODULE IS LEGACY AND WILL BE REMOVED SOON. PLEASE DO NOT USE THESE CLASSES
IN NEW CODE. INSTEAD, USE `mlflow/entities/assessment.py` FOR ASSESSMENT CLASSES.
"""

import pandas as pd

from mlflow.evaluation.evaluation import EvaluationEntity as EvaluationEntity
from mlflow.utils.annotations import deprecated


@deprecated(since="3.0.0")
def evaluations_to_dataframes(
    evaluations: list[EvaluationEntity],
) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Converts a list of Evaluation entities to four separate DataFrames: one for main evaluation
    data (excluding assessments and metrics), one for metrics, one for assessments, and one for
    tags.

    Args:
        evaluations (List[Evaluation]): List of Evaluation entities.

    Returns:
        Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]: A tuple of four DataFrames
        containing evaluation data, metrics data, assessments data, and tags data.
    """
    evaluations_data = []
    metrics_data = []
    assessments_data = []
    tags_data = []

    for evaluation in evaluations:
        eval_dict = evaluation.to_dictionary()

        # Extract assessment and metrics
        assessments_list = eval_dict.pop("assessments", [])
        metrics_list = eval_dict.pop("metrics", [])
        tags_list = eval_dict.pop("tags", [])

        evaluations_data.append(eval_dict)

        for metric_dict in metrics_list:
            metric_dict["evaluation_id"] = eval_dict["evaluation_id"]
            # Remove 'step' key if it exists, since it is not valid for evaluation metrics
            metric_dict.pop("step", None)
            metrics_data.append(metric_dict)

        for assess_dict in assessments_list:
            assess_dict["evaluation_id"] = eval_dict["evaluation_id"]
            assessments_data.append(assess_dict)

        for tag_dict in tags_list:
            tag_dict["evaluation_id"] = eval_dict["evaluation_id"]
            tags_data.append(tag_dict)

    evaluations_df = (
        _apply_schema_to_dataframe(
            pd.DataFrame(evaluations_data), _get_evaluations_dataframe_schema()
        )
        if evaluations_data
        else _get_empty_evaluations_dataframe()
    )
    metrics_df = (
        _apply_schema_to_dataframe(pd.DataFrame(metrics_data), _get_metrics_dataframe_schema())
        if metrics_data
        else _get_empty_metrics_dataframe()
    )
    assessments_df = (
        _apply_schema_to_dataframe(
            pd.DataFrame(assessments_data), _get_assessments_dataframe_schema()
        )
        if assessments_data
        else _get_empty_assessments_dataframe()
    )
    tags_df = (
        _apply_schema_to_dataframe(pd.DataFrame(tags_data), _get_tags_dataframe_schema())
        if tags_data
        else _get_empty_tags_dataframe()
    )

    return evaluations_df, metrics_df, assessments_df, tags_df


def _get_evaluations_dataframe_schema() -> dict[str, str]:
    """
    Returns the pandas schema for the evaluation DataFrame.
    """
    return {
        "evaluation_id": "string",
        "run_id": "string",
        "inputs_id": "string",
        "inputs": "object",
        "outputs": "object",
        "request_id": "object",
        "targets": "object",
        "error_code": "object",
        "error_message": "object",
    }


def _get_empty_evaluations_dataframe() -> pd.DataFrame:
    """
    Creates an empty DataFrame with columns for evaluation data.
    """
    schema = _get_evaluations_dataframe_schema()
    df = pd.DataFrame(columns=schema.keys())
    return _apply_schema_to_dataframe(df, schema)


def _get_assessments_dataframe_schema() -> dict[str, str]:
    """
    Returns the pandas schema for the assessments DataFrame.
    """
    return {
        "evaluation_id": "string",
        "name": "string",
        "source": "object",
        "timestamp": "int64",
        "boolean_value": "object",
        "numeric_value": "object",
        "string_value": "object",
        "rationale": "object",
        "metadata": "object",
        "error_code": "object",
        "error_message": "object",
        "span_id": "object",
    }


def _get_empty_assessments_dataframe() -> pd.DataFrame:
    """
    Creates an empty DataFrame with columns for evaluation assessments data.
    """
    schema = _get_assessments_dataframe_schema()
    df = pd.DataFrame(columns=schema.keys())
    return _apply_schema_to_dataframe(df, schema)


def _get_metrics_dataframe_schema() -> dict[str, str]:
    """
    Returns the pandas schema for the metrics DataFrame.
    """
    return {
        "evaluation_id": "string",
        "key": "string",
        "value": "float64",
        "timestamp": "int64",
        "model_id": "string",
        "dataset_name": "string",
        "dataset_digest": "string",
        "run_id": "string",
    }


def _get_empty_metrics_dataframe() -> pd.DataFrame:
    """
    Creates an empty DataFrame with columns for evaluation metric data.
    """
    schema = _get_metrics_dataframe_schema()
    df = pd.DataFrame(columns=schema.keys())
    return _apply_schema_to_dataframe(df, schema)


def _get_tags_dataframe_schema() -> dict[str, str]:
    """
    Returns the pandas schema for the tags DataFrame.
    """
    return {
        "evaluation_id": "string",
        "key": "string",
        "value": "string",
    }


def _get_empty_tags_dataframe() -> pd.DataFrame:
    """
    Creates an empty DataFrame with columns for evaluation tags data.
    """
    schema = _get_tags_dataframe_schema()
    df = pd.DataFrame(columns=schema.keys())
    return _apply_schema_to_dataframe(df, schema)


def _apply_schema_to_dataframe(df: pd.DataFrame, schema: dict[str, str]) -> pd.DataFrame:
    """
    Applies a schema to a DataFrame.

    Args:
        df (pd.DataFrame): DataFrame to apply the schema to.
        schema (Dict[str, Any]): Schema to apply.

    Returns:
        pd.DataFrame: DataFrame with schema applied.
    """
    for column in df.columns:
        df[column] = df[column].astype(schema[column])
    # By default, null values are represented as `pd.NA` in pandas when reading a dataframe from
    # JSON. However, MLflow entities use `None` to represent null values. Accordingly, we convert
    # instances of pd.NA to None so that DataFrame rows can be parsed as MLflow entities
    return df.replace(pd.NA, None)
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/evaluation/__init__.py

```python
"""
THE 'mlflow.evaluation` MODULE IS LEGACY AND WILL BE REMOVED SOON. PLEASE DO NOT USE THESE CLASSES
IN NEW CODE. INSTEAD, USE `mlflow/entities/assessment.py` FOR ASSESSMENT CLASSES.
"""

from mlflow.evaluation.assessment import Assessment, AssessmentSource, AssessmentSourceType
from mlflow.evaluation.evaluation import Evaluation
from mlflow.evaluation.fluent import log_evaluations

__all__ = [
    "Assessment",
    "AssessmentSource",
    "AssessmentSourceType",
    "Evaluation",
    "log_evaluations",
]
```

--------------------------------------------------------------------------------

````
