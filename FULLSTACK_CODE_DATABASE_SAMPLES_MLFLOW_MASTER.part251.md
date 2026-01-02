---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 251
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 251 of 991)

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

---[FILE: logged_model.py]---
Location: mlflow-master/mlflow/entities/logged_model.py

```python
from typing import Any

import mlflow.protos.service_pb2 as pb2
from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.entities.logged_model_parameter import LoggedModelParameter
from mlflow.entities.logged_model_status import LoggedModelStatus
from mlflow.entities.logged_model_tag import LoggedModelTag
from mlflow.entities.metric import Metric


class LoggedModel(_MlflowObject):
    """
    MLflow entity representing a Model logged to an MLflow Experiment.
    """

    def __init__(
        self,
        experiment_id: str,
        model_id: str,
        name: str,
        artifact_location: str,
        creation_timestamp: int,
        last_updated_timestamp: int,
        model_type: str | None = None,
        source_run_id: str | None = None,
        status: LoggedModelStatus | int = LoggedModelStatus.READY,
        status_message: str | None = None,
        tags: list[LoggedModelTag] | dict[str, str] | None = None,
        params: list[LoggedModelParameter] | dict[str, str] | None = None,
        metrics: list[Metric] | None = None,
    ):
        super().__init__()
        self._experiment_id: str = experiment_id
        self._model_id: str = model_id
        self._name: str = name
        self._artifact_location: str = artifact_location
        self._creation_time: int = creation_timestamp
        self._last_updated_timestamp: int = last_updated_timestamp
        self._model_type: str | None = model_type
        self._source_run_id: str | None = source_run_id
        self._status: LoggedModelStatus = (
            status if isinstance(status, LoggedModelStatus) else LoggedModelStatus.from_int(status)
        )
        self._status_message: str | None = status_message
        self._tags: dict[str, str] = (
            {tag.key: tag.value for tag in (tags or [])} if isinstance(tags, list) else (tags or {})
        )
        self._params: dict[str, str] = (
            {param.key: param.value for param in (params or [])}
            if isinstance(params, list)
            else (params or {})
        )
        self._metrics: list[Metric] | None = metrics
        self._model_uri = f"models:/{self.model_id}"

    def __repr__(self) -> str:
        return "LoggedModel({})".format(
            ", ".join(
                f"{k}={v!r}"
                for k, v in sorted(self, key=lambda x: x[0])
                if (
                    k
                    not in [
                        # These fields can be large and take up space on the notebook or terminal
                        "tags",
                        "params",
                        "metrics",
                    ]
                )
            )
        )

    @property
    def experiment_id(self) -> str:
        """String. Experiment ID associated with this Model."""
        return self._experiment_id

    @experiment_id.setter
    def experiment_id(self, new_experiment_id: str):
        self._experiment_id = new_experiment_id

    @property
    def model_id(self) -> str:
        """String. Unique ID for this Model."""
        return self._model_id

    @model_id.setter
    def model_id(self, new_model_id: str):
        self._model_id = new_model_id

    @property
    def name(self) -> str:
        """String. Name for this Model."""
        return self._name

    @name.setter
    def name(self, new_name: str):
        self._name = new_name

    @property
    def artifact_location(self) -> str:
        """String. Location of the model artifacts."""
        return self._artifact_location

    @artifact_location.setter
    def artifact_location(self, new_artifact_location: str):
        self._artifact_location = new_artifact_location

    @property
    def creation_timestamp(self) -> int:
        """Integer. Model creation timestamp (milliseconds since the Unix epoch)."""
        return self._creation_time

    @property
    def last_updated_timestamp(self) -> int:
        """Integer. Timestamp of last update for this Model (milliseconds since the Unix
        epoch).
        """
        return self._last_updated_timestamp

    @last_updated_timestamp.setter
    def last_updated_timestamp(self, updated_timestamp: int):
        self._last_updated_timestamp = updated_timestamp

    @property
    def model_type(self) -> str | None:
        """String. Type of the model."""
        return self._model_type

    @model_type.setter
    def model_type(self, new_model_type: str | None):
        self._model_type = new_model_type

    @property
    def source_run_id(self) -> str | None:
        """String. MLflow run ID that generated this model."""
        return self._source_run_id

    @property
    def status(self) -> LoggedModelStatus:
        """String. Current status of this Model."""
        return self._status

    @status.setter
    def status(self, updated_status: str):
        self._status = updated_status

    @property
    def status_message(self) -> str | None:
        """String. Descriptive message for error status conditions."""
        return self._status_message

    @property
    def tags(self) -> dict[str, str]:
        """Dictionary of tag key (string) -> tag value for this Model."""
        return self._tags

    @property
    def params(self) -> dict[str, str]:
        """Model parameters."""
        return self._params

    @property
    def metrics(self) -> list[Metric] | None:
        """List of metrics associated with this Model."""
        return self._metrics

    @property
    def model_uri(self) -> str:
        """URI of the model."""
        return self._model_uri

    @metrics.setter
    def metrics(self, new_metrics: list[Metric] | None):
        self._metrics = new_metrics

    @classmethod
    def _properties(cls) -> list[str]:
        # aggregate with base class properties since cls.__dict__ does not do it automatically
        return sorted(cls._get_properties_helper())

    def _add_tag(self, tag):
        self._tags[tag.key] = tag.value

    def to_dictionary(self) -> dict[str, Any]:
        model_dict = dict(self)
        model_dict["status"] = self.status.to_int()
        # Remove the model_uri field from the dictionary since it is a derived field
        del model_dict["model_uri"]
        return model_dict

    def to_proto(self):
        return pb2.LoggedModel(
            info=pb2.LoggedModelInfo(
                experiment_id=self.experiment_id,
                model_id=self.model_id,
                name=self.name,
                artifact_uri=self.artifact_location,
                creation_timestamp_ms=self.creation_timestamp,
                last_updated_timestamp_ms=self.last_updated_timestamp,
                model_type=self.model_type,
                source_run_id=self.source_run_id,
                status=self.status.to_proto(),
                tags=[pb2.LoggedModelTag(key=k, value=v) for k, v in self.tags.items()],
            ),
            data=pb2.LoggedModelData(
                params=[pb2.LoggedModelParameter(key=k, value=v) for (k, v) in self.params.items()],
                metrics=[m.to_proto() for m in self.metrics] if self.metrics else [],
            ),
        )

    @classmethod
    def from_proto(cls, proto):
        return cls(
            experiment_id=proto.info.experiment_id,
            model_id=proto.info.model_id,
            name=proto.info.name,
            artifact_location=proto.info.artifact_uri,
            creation_timestamp=proto.info.creation_timestamp_ms,
            last_updated_timestamp=proto.info.last_updated_timestamp_ms,
            model_type=proto.info.model_type,
            source_run_id=proto.info.source_run_id,
            status=LoggedModelStatus.from_proto(proto.info.status),
            status_message=proto.info.status_message,
            tags=[LoggedModelTag.from_proto(tag) for tag in proto.info.tags],
            params=[LoggedModelParameter.from_proto(param) for param in proto.data.params],
            metrics=[Metric.from_proto(metric) for metric in proto.data.metrics],
        )
```

--------------------------------------------------------------------------------

---[FILE: logged_model_input.py]---
Location: mlflow-master/mlflow/entities/logged_model_input.py

```python
from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.protos.service_pb2 import ModelInput as ProtoModelInput


class LoggedModelInput(_MlflowObject):
    """ModelInput object associated with a Run."""

    def __init__(self, model_id: str):
        self._model_id = model_id

    def __eq__(self, other: _MlflowObject) -> bool:
        if type(other) is type(self):
            return self.__dict__ == other.__dict__
        return False

    @property
    def model_id(self) -> str:
        """Model ID."""
        return self._model_id

    def to_proto(self):
        return ProtoModelInput(model_id=self._model_id)

    @classmethod
    def from_proto(cls, proto):
        return cls(proto.model_id)
```

--------------------------------------------------------------------------------

---[FILE: logged_model_output.py]---
Location: mlflow-master/mlflow/entities/logged_model_output.py

```python
from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.protos.service_pb2 import ModelOutput


class LoggedModelOutput(_MlflowObject):
    """ModelOutput object associated with a Run."""

    def __init__(self, model_id: str, step: int) -> None:
        self._model_id = model_id
        self._step = step

    def __eq__(self, other: _MlflowObject) -> bool:
        if type(other) is type(self):
            return self.__dict__ == other.__dict__
        return False

    @property
    def model_id(self) -> str:
        """Model ID"""
        return self._model_id

    @property
    def step(self) -> str:
        """Step at which the model was logged"""
        return self._step

    def to_proto(self):
        return ModelOutput(model_id=self.model_id, step=self.step)

    def to_dictionary(self) -> dict[str, str | int]:
        return {"model_id": self.model_id, "step": self.step}

    @classmethod
    def from_proto(cls, proto):
        return cls(proto.model_id, proto.step)
```

--------------------------------------------------------------------------------

---[FILE: logged_model_parameter.py]---
Location: mlflow-master/mlflow/entities/logged_model_parameter.py

```python
import sys

from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.protos import service_pb2 as pb2


class LoggedModelParameter(_MlflowObject):
    """
    MLflow entity representing a parameter of a Model.
    """

    def __init__(self, key, value):
        if "pyspark.ml" in sys.modules:
            import pyspark.ml.param

            if isinstance(key, pyspark.ml.param.Param):
                key = key.name
                value = str(value)
        self._key = key
        self._value = value

    @property
    def key(self):
        """String key corresponding to the parameter name."""
        return self._key

    @property
    def value(self):
        """String value of the parameter."""
        return self._value

    def __eq__(self, __o):
        if isinstance(__o, self.__class__):
            return self._key == __o._key

        return False

    def __hash__(self):
        return hash(self._key)

    def to_proto(self):
        return pb2.LoggedModelParameter(key=self._key, value=self._value)

    @classmethod
    def from_proto(cls, proto):
        return cls(key=proto.key, value=proto.value)
```

--------------------------------------------------------------------------------

---[FILE: logged_model_status.py]---
Location: mlflow-master/mlflow/entities/logged_model_status.py

```python
from enum import Enum

from mlflow.exceptions import MlflowException
from mlflow.protos import service_pb2 as pb2


class LoggedModelStatus(str, Enum):
    """Enum for status of an :py:class:`mlflow.entities.LoggedModel`."""

    UNSPECIFIED = "UNSPECIFIED"
    PENDING = "PENDING"
    READY = "READY"
    FAILED = "FAILED"

    def __str__(self):
        return self.value

    @staticmethod
    def is_finalized(status) -> bool:
        """
        Determines whether or not a LoggedModelStatus is a finalized status.
        A finalized status indicates that no further status updates will occur.
        """
        return status in [LoggedModelStatus.READY, LoggedModelStatus.FAILED]

    def to_proto(self):
        if self == LoggedModelStatus.UNSPECIFIED:
            return pb2.LoggedModelStatus.LOGGED_MODEL_STATUS_UNSPECIFIED
        elif self == LoggedModelStatus.PENDING:
            return pb2.LoggedModelStatus.LOGGED_MODEL_PENDING
        elif self == LoggedModelStatus.READY:
            return pb2.LoggedModelStatus.LOGGED_MODEL_READY
        elif self == LoggedModelStatus.FAILED:
            return pb2.LoggedModelStatus.LOGGED_MODEL_UPLOAD_FAILED

        raise MlflowException.invalid_parameter_value(f"Unknown model status: {self}")

    @classmethod
    def from_proto(cls, proto):
        if proto == pb2.LoggedModelStatus.LOGGED_MODEL_STATUS_UNSPECIFIED:
            return LoggedModelStatus.UNSPECIFIED
        elif proto == pb2.LoggedModelStatus.LOGGED_MODEL_PENDING:
            return LoggedModelStatus.PENDING
        elif proto == pb2.LoggedModelStatus.LOGGED_MODEL_READY:
            return LoggedModelStatus.READY
        elif proto == pb2.LoggedModelStatus.LOGGED_MODEL_UPLOAD_FAILED:
            return LoggedModelStatus.FAILED

        raise MlflowException.invalid_parameter_value(f"Unknown model status: {proto}")

    @classmethod
    def from_int(cls, status_int: int) -> "LoggedModelStatus":
        if status_int == 0:
            return cls.UNSPECIFIED
        elif status_int == 1:
            return cls.PENDING
        elif status_int == 2:
            return cls.READY
        elif status_int == 3:
            return cls.FAILED

        raise MlflowException.invalid_parameter_value(f"Unknown model status: {status_int}")

    def to_int(self) -> int:
        if self == LoggedModelStatus.UNSPECIFIED:
            return 0
        elif self == LoggedModelStatus.PENDING:
            return 1
        elif self == LoggedModelStatus.READY:
            return 2
        elif self == LoggedModelStatus.FAILED:
            return 3

        raise MlflowException.invalid_parameter_value(f"Unknown model status: {self}")
```

--------------------------------------------------------------------------------

---[FILE: logged_model_tag.py]---
Location: mlflow-master/mlflow/entities/logged_model_tag.py

```python
from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.protos import service_pb2 as pb2


class LoggedModelTag(_MlflowObject):
    """Tag object associated with a Model."""

    def __init__(self, key, value):
        self._key = key
        self._value = value

    def __eq__(self, other):
        if type(other) is type(self):
            # TODO deep equality here?
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

    def to_proto(self):
        return pb2.LoggedModelTag(key=self._key, value=self._value)

    @classmethod
    def from_proto(cls, proto):
        return cls(key=proto.key, value=proto.value)
```

--------------------------------------------------------------------------------

---[FILE: metric.py]---
Location: mlflow-master/mlflow/entities/metric.py

```python
from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.protos.service_pb2 import Metric as ProtoMetric
from mlflow.protos.service_pb2 import MetricWithRunId as ProtoMetricWithRunId


class Metric(_MlflowObject):
    """
    Metric object.
    """

    def __init__(
        self,
        key,
        value,
        timestamp,
        step,
        model_id: str | None = None,
        dataset_name: str | None = None,
        dataset_digest: str | None = None,
        run_id: str | None = None,
    ):
        if (dataset_name, dataset_digest).count(None) == 1:
            raise MlflowException(
                "Both dataset_name and dataset_digest must be provided if one is provided",
                INVALID_PARAMETER_VALUE,
            )

        self._key = key
        self._value = value
        self._timestamp = timestamp
        self._step = step
        self._model_id = model_id
        self._dataset_name = dataset_name
        self._dataset_digest = dataset_digest
        self._run_id = run_id

    @property
    def key(self):
        """String key corresponding to the metric name."""
        return self._key

    @property
    def value(self):
        """Float value of the metric."""
        return self._value

    @property
    def timestamp(self):
        """Metric timestamp as an integer (milliseconds since the Unix epoch)."""
        return self._timestamp

    @property
    def step(self):
        """Integer metric step (x-coordinate)."""
        return self._step

    @property
    def model_id(self):
        """ID of the Model associated with the metric."""
        return self._model_id

    @property
    def dataset_name(self) -> str | None:
        """String. Name of the dataset associated with the metric."""
        return self._dataset_name

    @property
    def dataset_digest(self) -> str | None:
        """String. Digest of the dataset associated with the metric."""
        return self._dataset_digest

    @property
    def run_id(self) -> str | None:
        """String. Run ID associated with the metric."""
        return self._run_id

    def to_proto(self):
        metric = ProtoMetric()
        metric.key = self.key
        metric.value = self.value
        metric.timestamp = self.timestamp
        metric.step = self.step
        if self.model_id:
            metric.model_id = self.model_id
        if self.dataset_name:
            metric.dataset_name = self.dataset_name
        if self.dataset_digest:
            metric.dataset_digest = self.dataset_digest
        if self.run_id:
            metric.run_id = self.run_id
        return metric

    @classmethod
    def from_proto(cls, proto):
        return cls(
            proto.key,
            proto.value,
            proto.timestamp,
            proto.step,
            model_id=proto.model_id or None,
            dataset_name=proto.dataset_name or None,
            dataset_digest=proto.dataset_digest or None,
            run_id=proto.run_id or None,
        )

    def __eq__(self, __o):
        if isinstance(__o, self.__class__):
            return self.__dict__ == __o.__dict__

        return False

    def __hash__(self):
        return hash(
            (
                self._key,
                self._value,
                self._timestamp,
                self._step,
                self._model_id,
                self._dataset_name,
                self._dataset_digest,
                self._run_id,
            )
        )

    def to_dictionary(self):
        """
        Convert the Metric object to a dictionary.

        Returns:
            dict: The Metric object represented as a dictionary.
        """
        return {
            "key": self.key,
            "value": self.value,
            "timestamp": self.timestamp,
            "step": self.step,
            "model_id": self.model_id,
            "dataset_name": self.dataset_name,
            "dataset_digest": self.dataset_digest,
            "run_id": self._run_id,
        }

    @classmethod
    def from_dictionary(cls, metric_dict):
        """
        Create a Metric object from a dictionary.

        Args:
            metric_dict (dict): Dictionary containing metric information.

        Returns:
            Metric: The Metric object created from the dictionary.
        """
        required_keys = ["key", "value", "timestamp", "step"]
        if missing_keys := [key for key in required_keys if key not in metric_dict]:
            raise MlflowException(
                f"Missing required keys {missing_keys} in metric dictionary",
                INVALID_PARAMETER_VALUE,
            )

        return cls(**metric_dict)


class MetricWithRunId(Metric):
    def __init__(self, metric: Metric, run_id):
        super().__init__(
            key=metric.key,
            value=metric.value,
            timestamp=metric.timestamp,
            step=metric.step,
        )
        self._run_id = run_id

    @property
    def run_id(self):
        return self._run_id

    def to_dict(self):
        return {
            "key": self.key,
            "value": self.value,
            "timestamp": self.timestamp,
            "step": self.step,
            "run_id": self.run_id,
        }

    def to_proto(self):
        metric = ProtoMetricWithRunId()
        metric.key = self.key
        metric.value = self.value
        metric.timestamp = self.timestamp
        metric.step = self.step
        metric.run_id = self.run_id
        return metric
```

--------------------------------------------------------------------------------

---[FILE: multipart_upload.py]---
Location: mlflow-master/mlflow/entities/multipart_upload.py

```python
from dataclasses import dataclass
from typing import Any

from mlflow.protos.mlflow_artifacts_pb2 import (
    CreateMultipartUpload as ProtoCreateMultipartUpload,
)
from mlflow.protos.mlflow_artifacts_pb2 import (
    MultipartUploadCredential as ProtoMultipartUploadCredential,
)


@dataclass
class MultipartUploadPart:
    part_number: int
    etag: str
    url: str | None = None

    @classmethod
    def from_proto(cls, proto):
        return cls(
            proto.part_number,
            proto.etag or None,
            proto.url or None,
        )

    def to_dict(self):
        return {
            "part_number": self.part_number,
            "etag": self.etag,
            "url": self.url,
        }


@dataclass
class MultipartUploadCredential:
    url: str
    part_number: int
    headers: dict[str, Any]

    def to_proto(self):
        credential = ProtoMultipartUploadCredential()
        credential.url = self.url
        credential.part_number = self.part_number
        credential.headers.update(self.headers)
        return credential

    @classmethod
    def from_dict(cls, dict_):
        return cls(
            url=dict_["url"],
            part_number=dict_["part_number"],
            headers=dict_.get("headers", {}),
        )


@dataclass
class CreateMultipartUploadResponse:
    upload_id: str | None
    credentials: list[MultipartUploadCredential]

    def to_proto(self):
        response = ProtoCreateMultipartUpload.Response()
        if self.upload_id:
            response.upload_id = self.upload_id
        response.credentials.extend([credential.to_proto() for credential in self.credentials])
        return response

    @classmethod
    def from_dict(cls, dict_):
        credentials = [MultipartUploadCredential.from_dict(cred) for cred in dict_["credentials"]]
        return cls(
            upload_id=dict_.get("upload_id"),
            credentials=credentials,
        )
```

--------------------------------------------------------------------------------

---[FILE: param.py]---
Location: mlflow-master/mlflow/entities/param.py

```python
import sys

from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.protos.service_pb2 import Param as ProtoParam


class Param(_MlflowObject):
    """
    Parameter object.
    """

    def __init__(self, key, value):
        if "pyspark.ml" in sys.modules:
            import pyspark.ml.param

            if isinstance(key, pyspark.ml.param.Param):
                key = key.name
                value = str(value)
        self._key = key
        self._value = value

    @property
    def key(self):
        """String key corresponding to the parameter name."""
        return self._key

    @property
    def value(self):
        """String value of the parameter."""
        return self._value

    def to_proto(self):
        param = ProtoParam()
        param.key = self.key
        param.value = self.value
        return param

    @classmethod
    def from_proto(cls, proto):
        return cls(proto.key, proto.value)

    def __eq__(self, __o):
        if isinstance(__o, self.__class__):
            return self._key == __o._key

        return False

    def __hash__(self):
        return hash(self._key)
```

--------------------------------------------------------------------------------

---[FILE: run.py]---
Location: mlflow-master/mlflow/entities/run.py

```python
from typing import Any

from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.entities.run_data import RunData
from mlflow.entities.run_info import RunInfo
from mlflow.entities.run_inputs import RunInputs
from mlflow.entities.run_outputs import RunOutputs
from mlflow.exceptions import MlflowException
from mlflow.protos.service_pb2 import Run as ProtoRun


class Run(_MlflowObject):
    """
    Run object.
    """

    def __init__(
        self,
        run_info: RunInfo,
        run_data: RunData,
        run_inputs: RunInputs | None = None,
        run_outputs: RunOutputs | None = None,
    ) -> None:
        if run_info is None:
            raise MlflowException("run_info cannot be None")
        self._info = run_info
        self._data = run_data
        self._inputs = run_inputs
        self._outputs = run_outputs

    @property
    def info(self) -> RunInfo:
        """
        The run metadata, such as the run id, start time, and status.

        :rtype: :py:class:`mlflow.entities.RunInfo`
        """
        return self._info

    @property
    def data(self) -> RunData:
        """
        The run data, including metrics, parameters, and tags.

        :rtype: :py:class:`mlflow.entities.RunData`
        """
        return self._data

    @property
    def inputs(self) -> RunInputs:
        """
        The run inputs, including dataset inputs.

        :rtype: :py:class:`mlflow.entities.RunInputs`
        """
        return self._inputs

    @property
    def outputs(self) -> RunOutputs:
        """
        The run outputs, including model outputs.

        :rtype: :py:class:`mlflow.entities.RunOutputs`
        """
        return self._outputs

    def to_proto(self):
        run = ProtoRun()
        run.info.MergeFrom(self.info.to_proto())
        if self.data:
            run.data.MergeFrom(self.data.to_proto())
        if self.inputs:
            run.inputs.MergeFrom(self.inputs.to_proto())
        if self.outputs:
            run.outputs.MergeFrom(self.outputs.to_proto())
        return run

    @classmethod
    def from_proto(cls, proto):
        return cls(
            RunInfo.from_proto(proto.info),
            RunData.from_proto(proto.data),
            RunInputs.from_proto(proto.inputs) if proto.inputs else None,
            RunOutputs.from_proto(proto.outputs) if proto.outputs else None,
        )

    def to_dictionary(self) -> dict[Any, Any]:
        run_dict = {
            "info": dict(self.info),
        }
        if self.data:
            run_dict["data"] = self.data.to_dictionary()
        if self.inputs:
            run_dict["inputs"] = self.inputs.to_dictionary()
        if self.outputs:
            run_dict["outputs"] = self.outputs.to_dictionary()
        return run_dict
```

--------------------------------------------------------------------------------

---[FILE: run_data.py]---
Location: mlflow-master/mlflow/entities/run_data.py

```python
from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.entities.metric import Metric
from mlflow.entities.param import Param
from mlflow.entities.run_tag import RunTag
from mlflow.protos.service_pb2 import Param as ProtoParam
from mlflow.protos.service_pb2 import RunData as ProtoRunData
from mlflow.protos.service_pb2 import RunTag as ProtoRunTag


class RunData(_MlflowObject):
    """
    Run data (metrics and parameters).
    """

    def __init__(self, metrics=None, params=None, tags=None):
        """Construct a new mlflow.entities.RunData instance.

        Args:
            metrics: List of mlflow.entities.Metric.
            params: List of mlflow.entities.Param.
            tags: List of mlflow.entities.RunTag.

        """
        # Maintain the original list of metrics so that we can easily convert it back to
        # protobuf
        self._metric_objs = metrics or []
        self._metrics = {metric.key: metric.value for metric in self._metric_objs}
        self._params = {param.key: param.value for param in (params or [])}
        self._tags = {tag.key: tag.value for tag in (tags or [])}

    @property
    def metrics(self):
        """
        Dictionary of string key -> metric value for the current run.
        For each metric key, the metric value with the latest timestamp is returned. In case there
        are multiple values with the same latest timestamp, the maximum of these values is returned.
        """
        return self._metrics

    @property
    def params(self):
        """Dictionary of param key (string) -> param value for the current run."""
        return self._params

    @property
    def tags(self):
        """Dictionary of tag key (string) -> tag value for the current run."""
        return self._tags

    def _add_metric(self, metric):
        self._metrics[metric.key] = metric.value
        self._metric_objs.append(metric)

    def _add_param(self, param):
        self._params[param.key] = param.value

    def _add_tag(self, tag):
        self._tags[tag.key] = tag.value

    def to_proto(self):
        run_data = ProtoRunData()
        run_data.metrics.extend([m.to_proto() for m in self._metric_objs])
        run_data.params.extend([ProtoParam(key=key, value=val) for key, val in self.params.items()])
        run_data.tags.extend([ProtoRunTag(key=key, value=val) for key, val in self.tags.items()])
        return run_data

    def to_dictionary(self):
        return {
            "metrics": self.metrics,
            "params": self.params,
            "tags": self.tags,
        }

    @classmethod
    def from_proto(cls, proto):
        run_data = cls()
        # iterate proto and add metrics, params, and tags
        for proto_metric in proto.metrics:
            run_data._add_metric(Metric.from_proto(proto_metric))
        for proto_param in proto.params:
            run_data._add_param(Param.from_proto(proto_param))
        for proto_tag in proto.tags:
            run_data._add_tag(RunTag.from_proto(proto_tag))
        return run_data
```

--------------------------------------------------------------------------------

---[FILE: run_info.py]---
Location: mlflow-master/mlflow/entities/run_info.py

```python
from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.entities.lifecycle_stage import LifecycleStage
from mlflow.entities.run_status import RunStatus
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.protos.service_pb2 import RunInfo as ProtoRunInfo


def check_run_is_active(run_info):
    if run_info.lifecycle_stage != LifecycleStage.ACTIVE:
        raise MlflowException(
            f"The run {run_info.run_id} must be in 'active' lifecycle_stage.",
            error_code=INVALID_PARAMETER_VALUE,
        )


class searchable_attribute(property):
    # Wrapper class over property to designate some of the properties as searchable
    # run attributes
    pass


class orderable_attribute(property):
    # Wrapper class over property to designate some of the properties as orderable
    # run attributes
    pass


class RunInfo(_MlflowObject):
    """
    Metadata about a run.
    """

    def __init__(
        self,
        run_id,
        experiment_id,
        user_id,
        status,
        start_time,
        end_time,
        lifecycle_stage,
        artifact_uri=None,
        run_name=None,
    ):
        if experiment_id is None:
            raise Exception("experiment_id cannot be None")
        if user_id is None:
            raise Exception("user_id cannot be None")
        if status is None:
            raise Exception("status cannot be None")
        if start_time is None:
            raise Exception("start_time cannot be None")
        self._run_id = run_id
        self._experiment_id = experiment_id
        self._user_id = user_id
        self._status = status
        self._start_time = start_time
        self._end_time = end_time
        self._lifecycle_stage = lifecycle_stage
        self._artifact_uri = artifact_uri
        self._run_name = run_name

    def __eq__(self, other):
        if type(other) is type(self):
            # TODO deep equality here?
            return self.__dict__ == other.__dict__
        return False

    def _copy_with_overrides(self, status=None, end_time=None, lifecycle_stage=None, run_name=None):
        """A copy of the RunInfo with certain attributes modified."""
        proto = self.to_proto()
        if status:
            proto.status = status
        if end_time:
            proto.end_time = end_time
        if lifecycle_stage:
            proto.lifecycle_stage = lifecycle_stage
        if run_name:
            proto.run_name = run_name
        return RunInfo.from_proto(proto)

    @searchable_attribute
    def run_id(self):
        """String containing run id."""
        return self._run_id

    @property
    def experiment_id(self):
        """String ID of the experiment for the current run."""
        return self._experiment_id

    @searchable_attribute
    def run_name(self):
        """String containing run name."""
        return self._run_name

    def _set_run_name(self, new_name):
        self._run_name = new_name

    @searchable_attribute
    def user_id(self):
        """String ID of the user who initiated this run."""
        return self._user_id

    @searchable_attribute
    def status(self):
        """
        One of the values in :py:class:`mlflow.entities.RunStatus`
        describing the status of the run.
        """
        return self._status

    @searchable_attribute
    def start_time(self):
        """Start time of the run, in number of milliseconds since the UNIX epoch."""
        return self._start_time

    @searchable_attribute
    def end_time(self):
        """End time of the run, in number of milliseconds since the UNIX epoch."""
        return self._end_time

    @searchable_attribute
    def artifact_uri(self):
        """String root artifact URI of the run."""
        return self._artifact_uri

    @property
    def lifecycle_stage(self):
        """
        One of the values in :py:class:`mlflow.entities.lifecycle_stage.LifecycleStage`
        describing the lifecycle stage of the run.
        """
        return self._lifecycle_stage

    def to_proto(self):
        proto = ProtoRunInfo()
        proto.run_uuid = self.run_id
        proto.run_id = self.run_id
        if self.run_name is not None:
            proto.run_name = self.run_name
        proto.experiment_id = self.experiment_id
        proto.user_id = self.user_id
        proto.status = RunStatus.from_string(self.status)
        proto.start_time = self.start_time
        if self.end_time:
            proto.end_time = self.end_time
        if self.artifact_uri:
            proto.artifact_uri = self.artifact_uri
        proto.lifecycle_stage = self.lifecycle_stage
        return proto

    @classmethod
    def from_proto(cls, proto):
        end_time = proto.end_time
        # The proto2 default scalar value of zero indicates that the run's end time is absent.
        # An absent end time is represented with a NoneType in the `RunInfo` class
        if end_time == 0:
            end_time = None
        return cls(
            run_id=proto.run_id,
            run_name=proto.run_name,
            experiment_id=proto.experiment_id,
            user_id=proto.user_id,
            status=RunStatus.to_string(proto.status),
            start_time=proto.start_time,
            end_time=end_time,
            lifecycle_stage=proto.lifecycle_stage,
            artifact_uri=proto.artifact_uri,
        )

    @classmethod
    def get_searchable_attributes(cls):
        return sorted(
            [p for p in cls.__dict__ if isinstance(getattr(cls, p), searchable_attribute)]
        )

    @classmethod
    def get_orderable_attributes(cls):
        # Note that all searchable attributes are also orderable.
        return sorted(
            [
                p
                for p in cls.__dict__
                if isinstance(getattr(cls, p), (searchable_attribute, orderable_attribute))
            ]
        )
```

--------------------------------------------------------------------------------

---[FILE: run_inputs.py]---
Location: mlflow-master/mlflow/entities/run_inputs.py

```python
from typing import Any

from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.entities.dataset_input import DatasetInput
from mlflow.entities.logged_model_input import LoggedModelInput
from mlflow.protos.service_pb2 import RunInputs as ProtoRunInputs


class RunInputs(_MlflowObject):
    """RunInputs object."""

    def __init__(
        self,
        dataset_inputs: list[DatasetInput],
        model_inputs: list[LoggedModelInput] | None = None,
    ) -> None:
        self._dataset_inputs = dataset_inputs
        self._model_inputs = model_inputs or []

    def __eq__(self, other: _MlflowObject) -> bool:
        if type(other) is type(self):
            return self.__dict__ == other.__dict__
        return False

    @property
    def dataset_inputs(self) -> list[DatasetInput]:
        """Array of dataset inputs."""
        return self._dataset_inputs

    @property
    def model_inputs(self) -> list[LoggedModelInput]:
        """Array of model inputs."""
        return self._model_inputs

    def to_proto(self):
        run_inputs = ProtoRunInputs()
        run_inputs.dataset_inputs.extend(
            [dataset_input.to_proto() for dataset_input in self.dataset_inputs]
        )
        run_inputs.model_inputs.extend(
            [model_input.to_proto() for model_input in self.model_inputs]
        )
        return run_inputs

    def to_dictionary(self) -> dict[str, Any]:
        return {
            "model_inputs": self.model_inputs,
            "dataset_inputs": [d.to_dictionary() for d in self.dataset_inputs],
        }

    @classmethod
    def from_proto(cls, proto):
        dataset_inputs = [
            DatasetInput.from_proto(dataset_input) for dataset_input in proto.dataset_inputs
        ]
        model_inputs = [
            LoggedModelInput.from_proto(model_input) for model_input in proto.model_inputs
        ]
        return cls(dataset_inputs, model_inputs)
```

--------------------------------------------------------------------------------

---[FILE: run_outputs.py]---
Location: mlflow-master/mlflow/entities/run_outputs.py

```python
from typing import Any

from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.entities.logged_model_output import LoggedModelOutput
from mlflow.protos.service_pb2 import RunOutputs as ProtoRunOutputs


class RunOutputs(_MlflowObject):
    """RunOutputs object."""

    def __init__(self, model_outputs: list[LoggedModelOutput]) -> None:
        self._model_outputs = model_outputs

    def __eq__(self, other: _MlflowObject) -> bool:
        if type(other) is type(self):
            return self.__dict__ == other.__dict__
        return False

    @property
    def model_outputs(self) -> list[LoggedModelOutput]:
        """Array of model outputs."""
        return self._model_outputs

    def to_proto(self):
        run_outputs = ProtoRunOutputs()
        run_outputs.model_outputs.extend(
            [model_output.to_proto() for model_output in self.model_outputs]
        )

        return run_outputs

    def to_dictionary(self) -> dict[Any, Any]:
        return {
            "model_outputs": [model_output.to_dictionary() for model_output in self.model_outputs],
        }

    @classmethod
    def from_proto(cls, proto):
        model_outputs = [
            LoggedModelOutput.from_proto(model_output) for model_output in proto.model_outputs
        ]

        return cls(model_outputs)
```

--------------------------------------------------------------------------------

````
