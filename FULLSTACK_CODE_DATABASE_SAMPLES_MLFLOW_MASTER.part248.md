---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 248
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 248 of 991)

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

---[FILE: util.py]---
Location: mlflow-master/mlflow/dspy/util.py

```python
import json
import logging
import tempfile
from collections import defaultdict
from pathlib import Path
from typing import Any

import dspy
from dspy import Example

import mlflow
from mlflow.entities import LoggedModelOutput

_logger = logging.getLogger(__name__)


def save_dspy_module_state(program, file_name: str = "model.json"):
    """
    Save states of dspy `Module` to a temporary directory and log it as an artifact.

    Args:
        program: The dspy `Module` to be saved.
        file_name: The name of the file to save the dspy module state. Default is `model.json`.
    """
    try:
        with tempfile.TemporaryDirectory() as tmp_dir:
            path = Path(tmp_dir, file_name)
            program.save(path)
            mlflow.log_artifact(path)
    except Exception as e:
        _logger.warning(f"Failed to save dspy module state: {e}")


def log_dspy_module_params(program):
    """
    Log the parameters of the dspy `Module` as run parameters.

    Args:
        program: The dspy `Module` to be logged.
    """
    try:
        states = program.dump_state()
        flat_state_dict = _flatten_dspy_module_state(
            states, exclude_keys=("metadata", "lm", "traces", "train")
        )
        mlflow.log_params(
            {f"{program.__class__.__name__}.{k}": v for k, v in flat_state_dict.items()}
        )
    except Exception as e:
        _logger.warning(f"Failed to log dspy module params: {e}")


def log_dspy_dataset(dataset: list["Example"], file_name: str):
    """
    Log the DSPy dataset as a table.

    Args:
        dataset: The dataset to be logged.
        file_name: The name of the file to save the dataset.
    """
    result = defaultdict(list)
    try:
        for example in dataset:
            for k, v in example.items():
                result[k].append(v)
        mlflow.log_table(result, file_name)
    except Exception as e:
        _logger.warning(f"Failed to log dataset: {e}")


def log_dspy_lm_state():
    """
    Log the current DSPy LM state as run parameters.
    This logs the language model configuration from dspy.settings.lm as a JSON string.
    """
    try:
        if dspy.settings.lm is None:
            return

        lm = dspy.settings.lm

        lm_attributes = {
            key: value
            for key, value in getattr(lm, "kwargs", {}).items()
            if key not in {"api_key", "api_base"}
        }

        for attr in ["model", "model_type", "cache", "temperature", "max_tokens"]:
            value = getattr(lm, attr, None)
            if value is not None:
                lm_attributes[attr] = value

        if lm_attributes:
            mlflow.log_param("lm_params", json.dumps(lm_attributes, sort_keys=True))

    except Exception as e:
        _logger.warning(f"Failed to log DSPy LM state: {e}")


def _flatten_dspy_module_state(
    d, parent_key="", sep=".", exclude_keys: set[str] | None = None
) -> dict[str, Any]:
    """
    Flattens a nested dictionary and accumulates the key names.

    Args:
        d: The dictionary or list to flatten.
        parent_key: The base key used in recursion. Defaults to "".
        sep: Separator for nested keys. Defaults to '.'.
        exclude_keys: Keys to exclude from the flattened dictionary. Defaults to ().

    Returns:
        dict: A flattened dictionary with accumulated keys.

    Example:
        >>> _flatten_dspy_module_state({"a": {"b": [5, 6]}})
        {'a.b.0': 5, 'a.b.1': 6}
    """
    items: dict[str, Any] = {}

    if isinstance(d, dict):
        for k, v in d.items():
            if exclude_keys and k in exclude_keys:
                continue
            new_key = f"{parent_key}{sep}{k}" if parent_key else k
            if isinstance(v, Example):
                # Don't flatten Example objects further even if it has dict or list values
                v = {key: str(value) for key, value in v.items()}
            items.update(_flatten_dspy_module_state(v, new_key, sep))
    elif isinstance(d, list):
        for i, v in enumerate(d):
            new_key = f"{parent_key}{sep}{i}" if parent_key else str(i)
            if isinstance(v, Example):
                # Don't flatten Example objects further even if it has dict or list values
                v = {key: str(value) for key, value in v.items()}
            items.update(_flatten_dspy_module_state(v, new_key, sep))
    else:
        if d is not None:
            items[parent_key] = d

    return items


def log_dummy_model_outputs():
    try:
        from mlflow.dspy.autolog import FLAVOR_NAME
        from mlflow.tracking.fluent import _create_logged_model

        run_id = mlflow.active_run().info.run_id
        logged_model = _create_logged_model(name="dspy", source_run_id=run_id, flavor=FLAVOR_NAME)
        mlflow.log_outputs(models=[LoggedModelOutput(model_id=logged_model.model_id, step=0)])
    except Exception as e:
        _logger.debug(f"Failed to log a dummy DSPy model outputs: {e}")
```

--------------------------------------------------------------------------------

---[FILE: wrapper.py]---
Location: mlflow-master/mlflow/dspy/wrapper.py

```python
import importlib.metadata
import json
from dataclasses import asdict, is_dataclass
from typing import TYPE_CHECKING, Any

from packaging.version import Version

if TYPE_CHECKING:
    import dspy

from mlflow.exceptions import INVALID_PARAMETER_VALUE, MlflowException
from mlflow.protos.databricks_pb2 import (
    INVALID_PARAMETER_VALUE,
)
from mlflow.pyfunc import PythonModel
from mlflow.types.schema import DataType, Schema

_INVALID_SIZE_MESSAGE = (
    "Dspy model doesn't support batch inference or empty input. Please provide a single input."
)


class DspyModelWrapper(PythonModel):
    """MLflow PyFunc wrapper class for Dspy models.

    This wrapper serves two purposes:
        - It stores the Dspy model along with dspy global settings, which are required for seamless
            saving and loading.
        - It provides a `predict` method so that it can be loaded as an MLflow pyfunc, which is
            used at serving time.
    """

    def __init__(
        self,
        model: "dspy.Module",
        dspy_settings: dict[str, Any],
        model_config: dict[str, Any] | None = None,
    ):
        self.model = model
        self.dspy_settings = dspy_settings
        self.model_config = model_config or {}
        self.output_schema: Schema | None = None

    def predict(self, inputs: Any, params: dict[str, Any] | None = None):
        import dspy

        converted_inputs = self._get_model_input(inputs)

        with dspy.context(**self.dspy_settings):
            if isinstance(converted_inputs, dict):
                # We pass a dict as keyword args and don't allow DSPy models
                # to receive a single dict.
                result = self.model(**converted_inputs)
            else:
                result = self.model(converted_inputs)

            if isinstance(result, dspy.Prediction):
                return result.toDict()
            else:
                return result

    def predict_stream(self, inputs: Any, params=None):
        import dspy

        converted_inputs = self._get_model_input(inputs)

        self._validate_streaming()

        stream_listeners = [
            dspy.streaming.StreamListener(signature_field_name=spec.name)
            for spec in self.output_schema
        ]
        stream_model = dspy.streamify(
            self.model,
            stream_listeners=stream_listeners,
            async_streaming=False,
            include_final_prediction_in_output_stream=False,
        )

        if isinstance(converted_inputs, dict):
            outputs = stream_model(**converted_inputs)
        else:
            outputs = stream_model(converted_inputs)

        with dspy.context(**self.dspy_settings):
            for output in outputs:
                if is_dataclass(output):
                    yield asdict(output)
                elif isinstance(output, dspy.Prediction):
                    yield output.toDict()
                else:
                    yield output

    def _get_model_input(self, inputs: Any) -> str | dict[str, Any]:
        """Convert the PythonModel input into the DSPy program input

        Examples of expected conversions:
        - str -> str
        - dict -> dict
        - np.ndarray with one element -> single element
        - pd.DataFrame with one row and string column -> single row dict
        - pd.DataFrame with one row and non-string column -> single element
        - list -> raises an exception
        - np.ndarray with more than one element -> raises an exception
        - pd.DataFrame with more than one row -> raises an exception
        """
        import numpy as np
        import pandas as pd

        supported_input_types = (np.ndarray, pd.DataFrame, str, dict)
        if not isinstance(inputs, supported_input_types):
            raise MlflowException(
                f"`inputs` must be one of: {[x.__name__ for x in supported_input_types]}, but "
                f"received type: {type(inputs)}.",
                INVALID_PARAMETER_VALUE,
            )
        if isinstance(inputs, pd.DataFrame):
            if len(inputs) != 1:
                raise MlflowException(
                    _INVALID_SIZE_MESSAGE,
                    INVALID_PARAMETER_VALUE,
                )
            if all(isinstance(col, str) for col in inputs.columns):
                inputs = inputs.to_dict(orient="records")[0]
            else:
                inputs = inputs.values[0]
        if isinstance(inputs, np.ndarray):
            if len(inputs) != 1:
                raise MlflowException(
                    _INVALID_SIZE_MESSAGE,
                    INVALID_PARAMETER_VALUE,
                )
            inputs = inputs[0]

        return inputs

    def _validate_streaming(
        self,
    ):
        if Version(importlib.metadata.version("dspy")) <= Version("2.6.23"):
            raise MlflowException(
                "Streaming API is only supported in dspy 2.6.24 or later. "
                "Please upgrade your dspy version."
            )

        if self.output_schema is None:
            raise MlflowException(
                "Output schema of the DSPy model is not set. Please log your DSPy "
                "model with `signature` or `input_example` to use streaming API."
            )

        if any(spec.type != DataType.string for spec in self.output_schema):
            raise MlflowException(
                f"All output fields must be string to use streaming API. Got {self.output_schema}."
            )


class DspyChatModelWrapper(DspyModelWrapper):
    """MLflow PyFunc wrapper class for Dspy chat models."""

    def predict(self, inputs: Any, params: dict[str, Any] | None = None):
        import dspy

        converted_inputs = self._get_model_input(inputs)

        # `dspy.settings` cannot be shared across threads, so we are setting the context at every
        # predict call.
        with dspy.context(**self.dspy_settings):
            outputs = self.model(converted_inputs)

        choices = []
        if isinstance(outputs, str):
            choices.append(self._construct_chat_message("assistant", outputs))
        elif isinstance(outputs, dict):
            role = outputs.get("role", "assistant")
            choices.append(self._construct_chat_message(role, json.dumps(outputs)))
        elif isinstance(outputs, dspy.Prediction):
            choices.append(self._construct_chat_message("assistant", json.dumps(outputs.toDict())))
        elif isinstance(outputs, list):
            for output in outputs:
                if isinstance(output, dict):
                    role = output.get("role", "assistant")
                    choices.append(self._construct_chat_message(role, json.dumps(outputs)))
                elif isinstance(output, dspy.Prediction):
                    role = output.get("role", "assistant")
                    choices.append(self._construct_chat_message(role, json.dumps(outputs.toDict())))
                else:
                    raise MlflowException(
                        f"Unsupported output type: {type(output)}. To log a DSPy model with task "
                        "'llm/v1/chat', the DSPy model must return a dict, a dspy.Prediction, or a "
                        "list of dicts or dspy.Prediction.",
                        INVALID_PARAMETER_VALUE,
                    )
        else:
            raise MlflowException(
                f"Unsupported output type: {type(outputs)}. To log a DSPy model with task "
                "'llm/v1/chat', the DSPy model must return a dict, a dspy.Prediction, or a list of "
                "dicts or dspy.Prediction.",
                INVALID_PARAMETER_VALUE,
            )

        return {"choices": choices}

    def predict_stream(self, inputs: Any, params=None):
        raise NotImplementedError(
            "Streaming is not supported for DSPy model with task 'llm/v1/chat'."
        )

    def _get_model_input(self, inputs: Any) -> str | list[dict[str, Any]]:
        import pandas as pd

        if isinstance(inputs, dict):
            return inputs["messages"]
        if isinstance(inputs, pd.DataFrame):
            return inputs.messages[0]

        raise MlflowException(
            f"Unsupported input type: {type(inputs)}. To log a DSPy model with task "
            "'llm/v1/chat', the input must be a dict or a pandas DataFrame.",
            INVALID_PARAMETER_VALUE,
        )

    def _construct_chat_message(self, role: str, content: str) -> dict[str, Any]:
        return {
            "index": 0,
            "message": {
                "role": role,
                "content": content,
            },
            "finish_reason": "stop",
        }
```

--------------------------------------------------------------------------------

---[FILE: __init__.py]---
Location: mlflow-master/mlflow/dspy/__init__.py

```python
from mlflow.dspy.autolog import autolog
from mlflow.version import IS_TRACING_SDK_ONLY

__all__ = ["autolog"]

# Import model logging APIs only if mlflow skinny or full package is installed,
# i.e., skip if only mlflow-tracing package is installed.
if not IS_TRACING_SDK_ONLY:
    from mlflow.dspy.load import _load_pyfunc, load_model
    from mlflow.dspy.save import log_model, save_model

    __all__ += [
        "save_model",
        "log_model",
        "load_model",
        "_load_pyfunc",
    ]
```

--------------------------------------------------------------------------------

---[FILE: assessment.py]---
Location: mlflow-master/mlflow/entities/assessment.py

```python
from __future__ import annotations

import json
import time
from dataclasses import dataclass
from typing import Any

from google.protobuf.json_format import MessageToDict, ParseDict
from google.protobuf.struct_pb2 import Value

from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.entities.assessment_error import AssessmentError
from mlflow.entities.assessment_source import AssessmentSource, AssessmentSourceType
from mlflow.exceptions import MlflowException
from mlflow.protos.assessments_pb2 import Assessment as ProtoAssessment
from mlflow.protos.assessments_pb2 import Expectation as ProtoExpectation
from mlflow.protos.assessments_pb2 import Feedback as ProtoFeedback
from mlflow.utils.exception_utils import get_stacktrace
from mlflow.utils.proto_json_utils import proto_timestamp_to_milliseconds

# Feedback value should be one of the following types:
# - float
# - int
# - str
# - bool
# - list of values of the same types as above
# - dict with string keys and values of the same types as above
PbValueType = float | int | str | bool
FeedbackValueType = PbValueType | dict[str, PbValueType] | list[PbValueType]


@dataclass
class Assessment(_MlflowObject):
    """
    Base class for assessments that can be attached to a trace.
    An Assessment should be one of the following types:

    - Expectations: A label that represents the expected value for a particular operation.
        For example, an expected answer for a user question from a chatbot.
    - Feedback: A label that represents the feedback on the quality of the operation.
        Feedback can come from different sources, such as human judges, heuristic scorers,
        or LLM-as-a-Judge.
    """

    name: str
    source: AssessmentSource
    # NB: The trace ID is optional because the assessment object itself may be created
    #   standalone. For example, a custom metric function returns an assessment object
    #   without a trace ID. That said, the trace ID is required when logging the
    #   assessment to a trace in the backend eventually.
    #   https://docs.databricks.com/aws/en/generative-ai/agent-evaluation/custom-metrics#-metric-decorator
    trace_id: str | None = None
    run_id: str | None = None
    rationale: str | None = None
    metadata: dict[str, str] | None = None
    span_id: str | None = None
    create_time_ms: int | None = None
    last_update_time_ms: int | None = None
    # NB: The assessment ID should always be generated in the backend. The CreateAssessment
    #   backend API asks for an incomplete Assessment object without an ID and returns a
    #   complete one with assessment_id, so the ID is Optional in the constructor here.
    assessment_id: str | None = None
    # Deprecated, use `error` in Feedback instead. Just kept for backward compatibility
    # and will be removed in the 3.0.0 release.
    error: AssessmentError | None = None
    # Should only be used internally. To create an assessment with an expectation or feedback,
    # use the`Expectation` or `Feedback` classes instead.
    expectation: ExpectationValue | None = None
    feedback: FeedbackValue | None = None
    # The ID of the assessment which this assessment overrides.
    overrides: str | None = None
    # Whether this assessment is valid (i.e. has not been overridden).
    # This should not be set by the user, it is automatically set by the backend.
    valid: bool | None = None

    def __post_init__(self):
        from mlflow.tracing.constant import AssessmentMetadataKey

        if (self.expectation is not None) + (self.feedback is not None) != 1:
            raise MlflowException.invalid_parameter_value(
                "Exactly one of `expectation` or `feedback` should be specified.",
            )

        # Populate the error field to the feedback object
        if self.error is not None:
            if self.expectation is not None:
                raise MlflowException.invalid_parameter_value(
                    "Cannot set `error` when `expectation` is specified.",
                )
            if self.feedback is None:
                raise MlflowException.invalid_parameter_value(
                    "Cannot set `error` when `feedback` is not specified.",
                )
            self.feedback.error = self.error

        # Set timestamp if not provided
        current_time = int(time.time() * 1000)  # milliseconds
        if self.create_time_ms is None:
            self.create_time_ms = current_time
        if self.last_update_time_ms is None:
            self.last_update_time_ms = current_time

        if not isinstance(self.source, AssessmentSource):
            raise MlflowException.invalid_parameter_value(
                "`source` must be an instance of `AssessmentSource`. "
                f"Got {type(self.source)} instead."
            )
        # Extract and set run_id from metadata but don't modify the proto representation
        if (
            self.run_id is None
            and self.metadata
            and AssessmentMetadataKey.SOURCE_RUN_ID in self.metadata
        ):
            self.run_id = self.metadata[AssessmentMetadataKey.SOURCE_RUN_ID]

    def to_proto(self):
        assessment = ProtoAssessment()
        assessment.assessment_name = self.name
        assessment.trace_id = self.trace_id or ""

        assessment.source.CopyFrom(self.source.to_proto())

        # Convert time in milliseconds to protobuf Timestamp
        assessment.create_time.FromMilliseconds(self.create_time_ms)
        assessment.last_update_time.FromMilliseconds(self.last_update_time_ms)

        if self.span_id is not None:
            assessment.span_id = self.span_id
        if self.rationale is not None:
            assessment.rationale = self.rationale
        if self.assessment_id is not None:
            assessment.assessment_id = self.assessment_id

        if self.expectation is not None:
            assessment.expectation.CopyFrom(self.expectation.to_proto())
        elif self.feedback is not None:
            assessment.feedback.CopyFrom(self.feedback.to_proto())

        if self.metadata:
            for key, value in self.metadata.items():
                assessment.metadata[key] = str(value)
        if self.overrides:
            assessment.overrides = self.overrides
        if self.valid is not None:
            assessment.valid = self.valid

        return assessment

    @classmethod
    def from_proto(cls, proto):
        if proto.WhichOneof("value") == "expectation":
            return Expectation.from_proto(proto)
        elif proto.WhichOneof("value") == "feedback":
            return Feedback.from_proto(proto)
        else:
            raise MlflowException.invalid_parameter_value(
                f"Unknown assessment type: {proto.WhichOneof('value')}"
            )

    def to_dictionary(self):
        # Note that MessageToDict excludes None fields. For example, if assessment_id is None,
        # it won't be included in the resulting dictionary.
        return MessageToDict(self.to_proto(), preserving_proto_field_name=True)

    @classmethod
    def from_dictionary(cls, d: dict[str, Any]) -> "Assessment":
        if d.get("expectation"):
            return Expectation.from_dictionary(d)
        elif d.get("feedback"):
            return Feedback.from_dictionary(d)
        else:
            raise MlflowException.invalid_parameter_value(
                f"Unknown assessment type: {d.get('assessment_name')}"
            )


DEFAULT_FEEDBACK_NAME = "feedback"


@dataclass
class Feedback(Assessment):
    """
    Represents feedback about the output of an operation. For example, if the response from a
    generative AI application to a particular user query is correct, then a human or LLM judge
    may provide feedback with the value ``"correct"``.

    Args:
        name: The name of the assessment. If not provided, the default name "feedback" is used.
        value: The feedback value. This can be one of the following types:
            - float
            - int
            - str
            - bool
            - list of values of the same types as above
            - dict with string keys and values of the same types as above
        error: An optional error associated with the feedback. This is used to indicate
            that the feedback is not valid or cannot be processed. Accepts an exception
            object, or an :py:class:`~mlflow.entities.Expectation` object.
        rationale: The rationale / justification for the feedback.
        source: The source of the assessment. If not provided, the default source is CODE.
        trace_id: The ID of the trace associated with the assessment. If unset, the assessment
            is not associated with any trace yet.
            should be specified.
        metadata: The metadata associated with the assessment.
        span_id: The ID of the span associated with the assessment, if the assessment should
            be associated with a particular span in the trace.
        create_time_ms: The creation time of the assessment in milliseconds. If unset, the
            current time is used.
        last_update_time_ms: The last update time of the assessment in milliseconds.
            If unset, the current time is used.

    Example:

        .. code-block:: python

            from mlflow.entities import AssessmentSource, Feedback

            feedback = Feedback(
                name="correctness",
                value=True,
                rationale="The response is correct.",
                source=AssessmentSource(
                    source_type="HUMAN",
                    source_id="john@example.com",
                ),
                metadata={"project": "my-project"},
            )
    """

    def __init__(
        self,
        name: str = DEFAULT_FEEDBACK_NAME,
        value: FeedbackValueType | None = None,
        error: Exception | AssessmentError | str | None = None,
        source: AssessmentSource | None = None,
        trace_id: str | None = None,
        metadata: dict[str, str] | None = None,
        span_id: str | None = None,
        create_time_ms: int | None = None,
        last_update_time_ms: int | None = None,
        rationale: str | None = None,
        overrides: str | None = None,
        valid: bool = True,
    ):
        if value is None and error is None:
            raise MlflowException.invalid_parameter_value(
                "Either `value` or `error` must be provided.",
            )

        # Default to CODE source if not provided
        if source is None:
            source = AssessmentSource(source_type=AssessmentSourceType.CODE)

        if isinstance(error, Exception):
            error = AssessmentError(
                error_message=str(error),
                error_code=error.__class__.__name__,
                stack_trace=get_stacktrace(error),
            )
        elif isinstance(error, str):
            # Convert string errors to AssessmentError objects
            error = AssessmentError(
                error_message=error,
                error_code="ASSESSMENT_ERROR",
            )
        elif error is not None and not isinstance(error, AssessmentError):
            # Handle any other unexpected types
            raise MlflowException.invalid_parameter_value(
                f"'error' must be an Exception, AssessmentError, or string. Got: {type(error)}"
            )

        super().__init__(
            name=name,
            source=source,
            trace_id=trace_id,
            metadata=metadata,
            span_id=span_id,
            create_time_ms=create_time_ms,
            last_update_time_ms=last_update_time_ms,
            feedback=FeedbackValue(value=value, error=error),
            rationale=rationale,
            overrides=overrides,
            valid=valid,
        )
        self.error = error

    @property
    def value(self) -> FeedbackValueType:
        return self.feedback.value

    @value.setter
    def value(self, value: FeedbackValueType):
        self.feedback.value = value

    @classmethod
    def from_proto(cls, proto):
        from mlflow.utils.databricks_tracing_utils import get_trace_id_from_assessment_proto

        # Convert ScalarMapContainer to a normal Python dict
        metadata = dict(proto.metadata) if proto.metadata else None
        feedback_value = FeedbackValue.from_proto(proto.feedback)
        feedback = cls(
            trace_id=get_trace_id_from_assessment_proto(proto),
            name=proto.assessment_name,
            source=AssessmentSource.from_proto(proto.source),
            create_time_ms=proto.create_time.ToMilliseconds(),
            last_update_time_ms=proto.last_update_time.ToMilliseconds(),
            value=feedback_value.value,
            error=feedback_value.error,
            rationale=proto.rationale or None,
            metadata=metadata,
            span_id=proto.span_id or None,
            overrides=proto.overrides or None,
            valid=proto.valid,
        )
        feedback.assessment_id = proto.assessment_id or None
        return feedback

    @classmethod
    def from_dictionary(cls, d: dict[str, Any]) -> "Feedback":
        feedback_value = d.get("feedback")

        if not feedback_value:
            raise MlflowException.invalid_parameter_value(
                "`feedback` must exist in the dictionary."
            )

        feedback_value = FeedbackValue.from_dictionary(feedback_value)

        feedback = cls(
            trace_id=d.get("trace_id"),
            name=d["assessment_name"],
            source=AssessmentSource.from_dictionary(d["source"]),
            create_time_ms=proto_timestamp_to_milliseconds(d["create_time"]),
            last_update_time_ms=proto_timestamp_to_milliseconds(d["last_update_time"]),
            value=feedback_value.value,
            error=feedback_value.error,
            rationale=d.get("rationale"),
            metadata=d.get("metadata"),
            span_id=d.get("span_id"),
            overrides=d.get("overrides"),
            valid=d.get("valid", True),
        )
        feedback.assessment_id = d.get("assessment_id") or None
        return feedback

    # Backward compatibility: The old assessment object had these fields at top level.
    @property
    def error_code(self) -> str | None:
        """The error code of the error that occurred when the feedback was created."""
        return self.feedback.error.error_code if self.feedback.error else None

    @property
    def error_message(self) -> str | None:
        """The error message of the error that occurred when the feedback was created."""
        return self.feedback.error.error_message if self.feedback.error else None


@dataclass
class Expectation(Assessment):
    """
    Represents an expectation about the output of an operation, such as the expected response
    that a generative AI application should provide to a particular user query.

    Args:
        name: The name of the assessment.
        value: The expected value of the operation. This can be any JSON-serializable value.
        source: The source of the assessment. If not provided, the default source is HUMAN.
        trace_id: The ID of the trace associated with the assessment. If unset, the assessment
            is not associated with any trace yet.
            should be specified.
        metadata: The metadata associated with the assessment.
        span_id: The ID of the span associated with the assessment, if the assessment should
            be associated with a particular span in the trace.
        create_time_ms: The creation time of the assessment in milliseconds. If unset, the
            current time is used.
        last_update_time_ms: The last update time of the assessment in milliseconds.
            If unset, the current time is used.

    Example:

        .. code-block:: python

            from mlflow.entities import AssessmentSource, Expectation

            expectation = Expectation(
                name="expected_response",
                value="The capital of France is Paris.",
                source=AssessmentSource(
                    source_type=AssessmentSourceType.HUMAN,
                    source_id="john@example.com",
                ),
                metadata={"project": "my-project"},
            )
    """

    def __init__(
        self,
        name: str,
        value: Any,
        source: AssessmentSource | None = None,
        trace_id: str | None = None,
        metadata: dict[str, str] | None = None,
        span_id: str | None = None,
        create_time_ms: int | None = None,
        last_update_time_ms: int | None = None,
    ):
        if source is None:
            source = AssessmentSource(source_type=AssessmentSourceType.HUMAN)

        if value is None:
            raise MlflowException.invalid_parameter_value("The `value` field must be specified.")

        super().__init__(
            name=name,
            source=source,
            trace_id=trace_id,
            metadata=metadata,
            span_id=span_id,
            create_time_ms=create_time_ms,
            last_update_time_ms=last_update_time_ms,
            expectation=ExpectationValue(value=value),
        )

    @property
    def value(self) -> Any:
        return self.expectation.value

    @value.setter
    def value(self, value: Any):
        self.expectation.value = value

    @classmethod
    def from_proto(cls, proto) -> "Expectation":
        from mlflow.utils.databricks_tracing_utils import get_trace_id_from_assessment_proto

        # Convert ScalarMapContainer to a normal Python dict
        metadata = dict(proto.metadata) if proto.metadata else None
        expectation_value = ExpectationValue.from_proto(proto.expectation)
        expectation = cls(
            trace_id=get_trace_id_from_assessment_proto(proto),
            name=proto.assessment_name,
            source=AssessmentSource.from_proto(proto.source),
            create_time_ms=proto.create_time.ToMilliseconds(),
            last_update_time_ms=proto.last_update_time.ToMilliseconds(),
            value=expectation_value.value,
            metadata=metadata,
            span_id=proto.span_id or None,
        )
        expectation.assessment_id = proto.assessment_id or None
        return expectation

    @classmethod
    def from_dictionary(cls, d: dict[str, Any]) -> "Expectation":
        expectation_value = d.get("expectation")

        if not expectation_value:
            raise MlflowException.invalid_parameter_value(
                "`expectation` must exist in the dictionary."
            )

        expectation_value = ExpectationValue.from_dictionary(expectation_value)

        expectation = cls(
            trace_id=d.get("trace_id"),
            name=d["assessment_name"],
            source=AssessmentSource.from_dictionary(d["source"]),
            create_time_ms=proto_timestamp_to_milliseconds(d["create_time"]),
            last_update_time_ms=proto_timestamp_to_milliseconds(d["last_update_time"]),
            value=expectation_value.value,
            metadata=d.get("metadata"),
            span_id=d.get("span_id"),
        )
        expectation.assessment_id = d.get("assessment_id") or None
        return expectation


_JSON_SERIALIZATION_FORMAT = "JSON_FORMAT"


@dataclass
class ExpectationValue(_MlflowObject):
    """Represents an expectation value."""

    value: Any

    def to_proto(self):
        if self._need_serialization():
            try:
                serialized_value = json.dumps(self.value)
            except Exception as e:
                raise MlflowException.invalid_parameter_value(
                    f"Failed to serialize value {self.value} to JSON string. "
                    "Expectation value must be JSON-serializable."
                ) from e
            return ProtoExpectation(
                serialized_value=ProtoExpectation.SerializedValue(
                    serialization_format=_JSON_SERIALIZATION_FORMAT,
                    value=serialized_value,
                )
            )

        return ProtoExpectation(value=ParseDict(self.value, Value()))

    @classmethod
    def from_proto(cls, proto) -> "Expectation":
        if proto.HasField("serialized_value"):
            if proto.serialized_value.serialization_format != _JSON_SERIALIZATION_FORMAT:
                raise MlflowException.invalid_parameter_value(
                    f"Unknown serialization format: {proto.serialized_value.serialization_format}. "
                    "Only JSON_FORMAT is supported."
                )
            return cls(value=json.loads(proto.serialized_value.value))
        else:
            return cls(value=MessageToDict(proto.value))

    def to_dictionary(self):
        return MessageToDict(self.to_proto(), preserving_proto_field_name=True)

    @classmethod
    def from_dictionary(cls, d):
        if "value" in d:
            return cls(d["value"])
        elif "serialized_value" in d:
            return cls(value=json.loads(d["serialized_value"]["value"]))
        else:
            raise MlflowException.invalid_parameter_value(
                "Either 'value' or 'serialized_value' must be present in the dictionary "
                "representation of an Expectation."
            )

    def _need_serialization(self):
        # Values like None, lists, dicts, should be serialized as a JSON string
        return self.value is not None and not isinstance(self.value, (int, float, bool, str))


@dataclass
class FeedbackValue(_MlflowObject):
    """Represents a feedback value."""

    value: FeedbackValueType
    error: AssessmentError | None = None

    def to_proto(self):
        return ProtoFeedback(
            value=ParseDict(self.value, Value(), ignore_unknown_fields=True),
            error=self.error.to_proto() if self.error else None,
        )

    @classmethod
    def from_proto(cls, proto) -> "FeedbackValue":
        return FeedbackValue(
            value=MessageToDict(proto.value),
            error=AssessmentError.from_proto(proto.error) if proto.HasField("error") else None,
        )

    def to_dictionary(self):
        return MessageToDict(self.to_proto(), preserving_proto_field_name=True)

    @classmethod
    def from_dictionary(cls, d):
        return cls(
            value=d["value"],
            error=AssessmentError.from_dictionary(err) if (err := d.get("error")) else None,
        )
```

--------------------------------------------------------------------------------

---[FILE: assessment_error.py]---
Location: mlflow-master/mlflow/entities/assessment_error.py

```python
from dataclasses import dataclass

from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.protos.assessments_pb2 import AssessmentError as ProtoAssessmentError

_STACK_TRACE_TRUNCATION_PREFIX = "[Stack trace is truncated]\n...\n"
_STACK_TRACE_TRUNCATION_LENGTH = 10000


@dataclass
class AssessmentError(_MlflowObject):
    """
    Error object representing any issues during generating the assessment.

    For example, if the LLM-as-a-Judge fails to generate an feedback, you can
    log an error with the error code and message as shown below:

    .. code-block:: python

        from mlflow.entities import AssessmentError

        error = AssessmentError(
            error_code="RATE_LIMIT_EXCEEDED",
            error_message="Rate limit for the judge exceeded.",
            stack_trace="...",
        )

        mlflow.log_feedback(
            trace_id="1234",
            name="faithfulness",
            source=AssessmentSourceType.LLM_JUDGE,
            error=error,
            # Skip setting value when an error is present
        )

    Args:
        error_code: The error code.
        error_message: The detailed error message. Optional.
        stack_trace: The stack trace of the error. Truncated to 1000 characters
            before being logged to MLflow. Optional.
    """

    error_code: str
    error_message: str | None = None
    stack_trace: str | None = None

    def to_proto(self):
        error = ProtoAssessmentError()
        error.error_code = self.error_code
        if self.error_message:
            error.error_message = self.error_message
        if self.stack_trace:
            if len(self.stack_trace) > _STACK_TRACE_TRUNCATION_LENGTH:
                trunc_len = _STACK_TRACE_TRUNCATION_LENGTH - len(_STACK_TRACE_TRUNCATION_PREFIX)
                error.stack_trace = _STACK_TRACE_TRUNCATION_PREFIX + self.stack_trace[-trunc_len:]
            else:
                error.stack_trace = self.stack_trace
        return error

    @classmethod
    def from_proto(cls, proto):
        return cls(
            error_code=proto.error_code,
            error_message=proto.error_message or None,
            stack_trace=proto.stack_trace or None,
        )

    def to_dictionary(self):
        return {
            "error_code": self.error_code,
            "error_message": self.error_message,
            "stack_trace": self.stack_trace,
        }

    @classmethod
    def from_dictionary(cls, error_dict):
        return cls(**error_dict)
```

--------------------------------------------------------------------------------

````
