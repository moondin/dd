---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 252
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 252 of 991)

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

---[FILE: run_status.py]---
Location: mlflow-master/mlflow/entities/run_status.py

```python
from mlflow.protos.service_pb2 import RunStatus as ProtoRunStatus


class RunStatus:
    """Enum for status of an :py:class:`mlflow.entities.Run`."""

    RUNNING = ProtoRunStatus.Value("RUNNING")
    SCHEDULED = ProtoRunStatus.Value("SCHEDULED")
    FINISHED = ProtoRunStatus.Value("FINISHED")
    FAILED = ProtoRunStatus.Value("FAILED")
    KILLED = ProtoRunStatus.Value("KILLED")

    _STRING_TO_STATUS = {k: ProtoRunStatus.Value(k) for k in ProtoRunStatus.keys()}
    _STATUS_TO_STRING = {value: key for key, value in _STRING_TO_STATUS.items()}
    _TERMINATED_STATUSES = {FINISHED, FAILED, KILLED}

    @staticmethod
    def from_string(status_str):
        if status_str not in RunStatus._STRING_TO_STATUS:
            raise Exception(
                f"Could not get run status corresponding to string {status_str}. Valid run "
                f"status strings: {list(RunStatus._STRING_TO_STATUS.keys())}"
            )
        return RunStatus._STRING_TO_STATUS[status_str]

    @staticmethod
    def to_string(status):
        if status not in RunStatus._STATUS_TO_STRING:
            raise Exception(
                f"Could not get string corresponding to run status {status}. Valid run "
                f"statuses: {list(RunStatus._STATUS_TO_STRING.keys())}"
            )
        return RunStatus._STATUS_TO_STRING[status]

    @staticmethod
    def is_terminated(status):
        return status in RunStatus._TERMINATED_STATUSES

    @staticmethod
    def all_status():
        return list(RunStatus._STATUS_TO_STRING.keys())
```

--------------------------------------------------------------------------------

---[FILE: run_tag.py]---
Location: mlflow-master/mlflow/entities/run_tag.py

```python
from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.protos.service_pb2 import RunTag as ProtoRunTag


class RunTag(_MlflowObject):
    """Tag object associated with a run."""

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
        param = ProtoRunTag()
        param.key = self.key
        param.value = self.value
        return param

    @classmethod
    def from_proto(cls, proto):
        return cls(proto.key, proto.value)
```

--------------------------------------------------------------------------------

---[FILE: scorer.py]---
Location: mlflow-master/mlflow/entities/scorer.py

```python
import json
from functools import lru_cache

from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.protos.service_pb2 import Scorer as ProtoScorer


class ScorerVersion(_MlflowObject):
    """
    A versioned scorer entity that represents a specific version of a scorer within an MLflow
    experiment.

    Each ScorerVersion instance is uniquely identified by the combination of:
    - experiment_id: The experiment containing the scorer
    - scorer_name: The name of the scorer
    - scorer_version: The version number of the scorer

    The class provides access to both the metadata (name, version, creation time) and the actual
    scorer implementation through the serialized_scorer property, which deserializes the stored
    scorer data into a usable SerializedScorer object.

    Args:
        experiment_id (str): The ID of the experiment this scorer belongs to.
        scorer_name (str): The name identifier for the scorer.
        scorer_version (int): The version number of this scorer instance.
        serialized_scorer (str): JSON-serialized string containing the scorer's metadata and code.
        creation_time (int): Unix timestamp (in milliseconds) when this version was created.
        scorer_id (str, optional): The unique identifier for the scorer.

    Example:
        .. code-block:: python

            from mlflow.entities.scorer import ScorerVersion

            # Create a ScorerVersion instance
            scorer_version = ScorerVersion(
                experiment_id="123",
                scorer_name="accuracy_scorer",
                scorer_version=2,
                serialized_scorer='{"name": "accuracy_scorer", "call_source": "..."}',
                creation_time=1640995200000,
            )

            # Access scorer metadata
            print(f"Scorer: {scorer_version.scorer_name} v{scorer_version.scorer_version}")
            print(f"Created: {scorer_version.creation_time}")
    """

    def __init__(
        self,
        experiment_id: str,
        scorer_name: str,
        scorer_version: int,
        serialized_scorer: str,
        creation_time: int,
        scorer_id: str | None = None,
    ):
        self._experiment_id = experiment_id
        self._scorer_name = scorer_name
        self._scorer_version = scorer_version
        self._serialized_scorer = serialized_scorer
        self._creation_time = creation_time
        self._scorer_id = scorer_id

    @property
    def experiment_id(self):
        """
        The ID of the experiment this scorer belongs to.

        Returns:
            str: The id of the experiment that this scorer version belongs to.
        """
        return self._experiment_id

    @property
    def scorer_name(self):
        """
        The name identifier for the scorer.

        Returns:
            str: The human-readable name used to identify and reference this scorer.
        """
        return self._scorer_name

    @property
    def scorer_version(self):
        """
        The version number of this scorer instance.

        Returns:
            int: The sequential version number, starting from 1. Higher versions represent
                 newer saved scorers with the same name.
        """
        return self._scorer_version

    @property
    @lru_cache(maxsize=1)
    def serialized_scorer(self):
        """
        The deserialized scorer object containing metadata and function code.

        This property automatically deserializes the stored JSON string into a
        SerializedScorer object that contains all the information needed to
        reconstruct and execute the scorer function.

        The result is cached using LRU caching to avoid repeated deserialization
        when the same ScorerVersion instance is accessed multiple times.

        Returns:
            SerializedScorer: A `SerializedScorer` object with metadata, function code,
                              and configuration information.

        Note:
            The `SerializedScorer` object construction is lazy,
            it only happens when this property is first accessed.
        """
        from mlflow.genai.scorers.base import SerializedScorer

        return SerializedScorer(**json.loads(self._serialized_scorer))

    @property
    def creation_time(self):
        """
        The timestamp when this scorer version was created.

        Returns:
            int: Unix timestamp in milliseconds representing when this specific
                 version of the scorer was registered in MLflow.
        """
        return self._creation_time

    @property
    def scorer_id(self):
        """
        The unique identifier for the scorer.

        Returns:
            str: The unique identifier (UUID) for the scorer, or None if not available.
        """
        return self._scorer_id

    @classmethod
    def from_proto(cls, proto):
        """
        Create a ScorerVersion instance from a protobuf message.

        This class method is used internally by MLflow to reconstruct ScorerVersion
        objects from serialized protobuf data, typically when retrieving scorers
        from remote tracking servers or deserializing stored data.

        Args:
            proto: A protobuf message containing scorer version data.

        Returns:
            ScorerVersion: A new ScorerVersion instance populated with data from the protobuf.

        Note:
            This method is primarily used internally by MLflow's tracking infrastructure
            and should not typically be called directly by users.
        """
        return cls(
            experiment_id=proto.experiment_id,
            scorer_name=proto.scorer_name,
            scorer_version=proto.scorer_version,
            serialized_scorer=proto.serialized_scorer,
            creation_time=proto.creation_time,
            scorer_id=proto.scorer_id if proto.HasField("scorer_id") else None,
        )

    def to_proto(self):
        """
        Convert this ScorerVersion instance to a protobuf message.

        This method serializes the ScorerVersion data into a protobuf format
        for transmission over the network or storage in binary format. It's
        primarily used internally by MLflow's tracking infrastructure.

        Returns:
            ProtoScorer: A protobuf message containing the serialized scorer version data.

        Note:
            This method is primarily used internally by MLflow's tracking infrastructure
            and should not typically be called directly by users.
        """
        proto = ProtoScorer()
        proto.experiment_id = int(self.experiment_id)
        proto.scorer_name = self.scorer_name
        proto.scorer_version = self.scorer_version
        proto.serialized_scorer = self._serialized_scorer
        proto.creation_time = self.creation_time
        if self.scorer_id is not None:
            proto.scorer_id = self.scorer_id
        return proto

    def __repr__(self):
        """
        Return a string representation of the ScorerVersion instance.

        Returns:
            str: A human-readable string showing the key identifying information
                 of this scorer version (experiment_id, scorer_name, and scorer_version).
        """
        return (
            f"<ScorerVersion(experiment_id={self.experiment_id}, "
            f"scorer_name='{self.scorer_name}', "
            f"scorer_version={self.scorer_version})>"
        )
```

--------------------------------------------------------------------------------

---[FILE: source_type.py]---
Location: mlflow-master/mlflow/entities/source_type.py

```python
class SourceType:
    """Enum for originating source of a :py:class:`mlflow.entities.Run`."""

    NOTEBOOK, JOB, PROJECT, LOCAL, UNKNOWN = range(1, 6)

    _STRING_TO_SOURCETYPE = {
        "NOTEBOOK": NOTEBOOK,
        "JOB": JOB,
        "PROJECT": PROJECT,
        "LOCAL": LOCAL,
        "UNKNOWN": UNKNOWN,
    }
    SOURCETYPE_TO_STRING = {value: key for key, value in _STRING_TO_SOURCETYPE.items()}

    @staticmethod
    def from_string(status_str):
        if status_str not in SourceType._STRING_TO_SOURCETYPE:
            raise Exception(
                f"Could not get run status corresponding to string {status_str}. Valid run "
                f"status strings: {list(SourceType._STRING_TO_SOURCETYPE.keys())}"
            )
        return SourceType._STRING_TO_SOURCETYPE[status_str]

    @staticmethod
    def to_string(status):
        if status not in SourceType.SOURCETYPE_TO_STRING:
            raise Exception(
                f"Could not get string corresponding to run status {status}. Valid run "
                f"statuses: {list(SourceType.SOURCETYPE_TO_STRING.keys())}"
            )
        return SourceType.SOURCETYPE_TO_STRING[status]
```

--------------------------------------------------------------------------------

````
