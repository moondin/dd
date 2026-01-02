---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 250
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 250 of 991)

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

---[FILE: evaluation_dataset.py]---
Location: mlflow-master/mlflow/entities/evaluation_dataset.py

```python
from __future__ import annotations

import json
from typing import TYPE_CHECKING, Any

from mlflow.data import Dataset
from mlflow.data.evaluation_dataset_source import EvaluationDatasetSource
from mlflow.data.pyfunc_dataset_mixin import PyFuncConvertibleDatasetMixin
from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.entities.dataset_record import DatasetRecord
from mlflow.entities.dataset_record_source import DatasetRecordSourceType
from mlflow.exceptions import MlflowException
from mlflow.protos.datasets_pb2 import Dataset as ProtoDataset
from mlflow.telemetry.events import MergeRecordsEvent
from mlflow.telemetry.track import record_usage_event
from mlflow.tracing.constant import TraceMetadataKey
from mlflow.tracking.context import registry as context_registry
from mlflow.utils.mlflow_tags import MLFLOW_USER

if TYPE_CHECKING:
    import pandas as pd

    from mlflow.entities.trace import Trace


class EvaluationDataset(_MlflowObject, Dataset, PyFuncConvertibleDatasetMixin):
    """
    Evaluation dataset for storing inputs and expectations for GenAI evaluation.

    This class supports lazy loading of records - when retrieved via get_evaluation_dataset(),
    only metadata is loaded. Records are fetched when to_df() or merge_records() is called.
    """

    def __init__(
        self,
        dataset_id: str,
        name: str,
        digest: str,
        created_time: int,
        last_update_time: int,
        tags: dict[str, Any] | None = None,
        schema: str | None = None,
        profile: str | None = None,
        created_by: str | None = None,
        last_updated_by: str | None = None,
    ):
        """Initialize the EvaluationDataset."""
        self.dataset_id = dataset_id
        self.created_time = created_time
        self.last_update_time = last_update_time
        self.tags = tags
        self._schema = schema
        self._profile = profile
        self.created_by = created_by
        self.last_updated_by = last_updated_by
        self._experiment_ids = None
        self._records = None

        source = EvaluationDatasetSource(dataset_id=self.dataset_id)
        Dataset.__init__(self, source=source, name=name, digest=digest)

    def _compute_digest(self) -> str:
        """
        Compute digest for the dataset. This is called by Dataset.__init__ if no digest is provided.
        Since we always have a digest from the dataclass initialization, this should not be called.
        """
        return self.digest

    @property
    def source(self) -> EvaluationDatasetSource:
        """Override source property to return the correct type."""
        return self._source

    @property
    def schema(self) -> str | None:
        """
        Dataset schema information.
        """
        return self._schema

    @property
    def profile(self) -> str | None:
        """
        Dataset profile information.
        """
        return self._profile

    @property
    def experiment_ids(self) -> list[str]:
        """
        Get associated experiment IDs, loading them if necessary.

        This property implements lazy loading - experiment IDs are only fetched from the backend
        when accessed for the first time.
        """
        if self._experiment_ids is None:
            self._load_experiment_ids()
        return self._experiment_ids or []

    @experiment_ids.setter
    def experiment_ids(self, value: list[str]):
        """Set experiment IDs directly."""
        self._experiment_ids = value or []

    def _load_experiment_ids(self):
        """Load experiment IDs from the backend."""
        from mlflow.tracking._tracking_service.utils import _get_store

        tracking_store = _get_store()
        self._experiment_ids = tracking_store.get_dataset_experiment_ids(self.dataset_id)

    @property
    def records(self) -> list[DatasetRecord]:
        """
        Get dataset records, loading them if necessary.

        This property implements lazy loading - records are only fetched from the backend
        when accessed for the first time.
        """
        if self._records is None:
            from mlflow.tracking._tracking_service.utils import _get_store

            tracking_store = _get_store()
            # For lazy loading, we want all records (no pagination)
            self._records, _ = tracking_store._load_dataset_records(
                self.dataset_id, max_results=None
            )
        return self._records or []

    def has_records(self) -> bool:
        """Check if dataset records are loaded without triggering a load."""
        return self._records is not None

    def _process_trace_records(self, traces: list["Trace"]) -> list[dict[str, Any]]:
        """Convert a list of Trace objects to dataset record dictionaries.

        Args:
            traces: List of Trace objects to convert

        Returns:
            List of dictionaries with 'inputs', 'expectations', and 'source' fields
        """
        from mlflow.entities.trace import Trace

        record_dicts = []
        for i, trace in enumerate(traces):
            if not isinstance(trace, Trace):
                raise MlflowException.invalid_parameter_value(
                    f"Mixed types in trace list. Expected all elements to be Trace objects, "
                    f"but element at index {i} is {type(trace).__name__}"
                )

            root_span = trace.data._get_root_span()
            inputs = root_span.inputs if root_span and root_span.inputs is not None else {}
            outputs = root_span.outputs if root_span and root_span.outputs is not None else None

            expectations = {}
            expectation_assessments = trace.search_assessments(type="expectation")
            for expectation in expectation_assessments:
                expectations[expectation.name] = expectation.value

            # Preserve session metadata from the original trace
            source_data = {"trace_id": trace.info.trace_id}
            if session_id := trace.info.trace_metadata.get(TraceMetadataKey.TRACE_SESSION):
                source_data["session_id"] = session_id

            record_dict = {
                "inputs": inputs,
                "outputs": outputs,
                "expectations": expectations,
                "source": {
                    "source_type": DatasetRecordSourceType.TRACE.value,
                    "source_data": source_data,
                },
            }
            record_dicts.append(record_dict)

        return record_dicts

    def _process_dataframe_records(self, df: "pd.DataFrame") -> list[dict[str, Any]]:
        """Process a DataFrame into dataset record dictionaries.

        Args:
            df: DataFrame to process. Can be either:
                - DataFrame from search_traces with 'trace' column containing Trace objects/JSON
                - Standard DataFrame with 'inputs', 'expectations' columns

        Returns:
            List of dictionaries with 'inputs', 'expectations', and optionally 'source' fields
        """
        if "trace" in df.columns:
            from mlflow.entities.trace import Trace

            traces = [
                Trace.from_json(trace_item) if isinstance(trace_item, str) else trace_item
                for trace_item in df["trace"]
            ]

            return self._process_trace_records(traces)
        else:
            return df.to_dict("records")

    @record_usage_event(MergeRecordsEvent)
    def merge_records(
        self, records: list[dict[str, Any]] | "pd.DataFrame" | list["Trace"]
    ) -> "EvaluationDataset":
        """
        Merge new records with existing ones.

        Args:
            records: Records to merge. Can be:
                - List of dictionaries with 'inputs' and optionally 'expectations' and 'tags'
                - DataFrame from mlflow.search_traces() - automatically parsed and converted
                - DataFrame with 'inputs' column and optionally 'expectations' and 'tags' columns
                - List of Trace objects

        Returns:
            Self for method chaining

        Example:
            .. code-block:: python

                # Direct usage with search_traces DataFrame output
                traces_df = mlflow.search_traces()  # Returns DataFrame by default
                dataset.merge_records(traces_df)  # No extraction needed

                # Or with standard DataFrame
                df = pd.DataFrame([{"inputs": {"q": "What?"}, "expectations": {"a": "Answer"}}])
                dataset.merge_records(df)
        """
        import pandas as pd

        from mlflow.entities.trace import Trace
        from mlflow.tracking._tracking_service.utils import _get_store, get_tracking_uri

        if isinstance(records, pd.DataFrame):
            record_dicts = self._process_dataframe_records(records)
        elif isinstance(records, list) and records and isinstance(records[0], Trace):
            record_dicts = self._process_trace_records(records)
        else:
            record_dicts = records

        self._validate_record_dicts(record_dicts)

        self._infer_source_types(record_dicts)

        tracking_store = _get_store()

        try:
            tracking_store.get_dataset(self.dataset_id)
        except Exception as e:
            raise MlflowException.invalid_parameter_value(
                f"Cannot add records to dataset {self.dataset_id}: Dataset not found. "
                f"Please verify the dataset exists and check your tracking URI is set correctly "
                f"(currently set to: {get_tracking_uri()})."
            ) from e

        context_tags = context_registry.resolve_tags()
        if user_tag := context_tags.get(MLFLOW_USER):
            for record in record_dicts:
                if "tags" not in record:
                    record["tags"] = {}
                if MLFLOW_USER not in record["tags"]:
                    record["tags"][MLFLOW_USER] = user_tag

        tracking_store.upsert_dataset_records(dataset_id=self.dataset_id, records=record_dicts)
        self._records = None

        return self

    def _validate_record_dicts(self, record_dicts: list[dict[str, Any]]) -> None:
        """Validate that record dictionaries have the required structure.

        Args:
            record_dicts: List of record dictionaries to validate

        Raises:
            MlflowException: If records don't have the required structure
        """
        for record in record_dicts:
            if not isinstance(record, dict):
                raise MlflowException.invalid_parameter_value("Each record must be a dictionary")
            if "inputs" not in record:
                raise MlflowException.invalid_parameter_value(
                    "Each record must have an 'inputs' field"
                )

    def _infer_source_types(self, record_dicts: list[dict[str, Any]]) -> None:
        """Infer source types for records without explicit source information.

        Simple inference rules:
        - Records with expectations -> HUMAN (manual test cases/ground truth)
        - Records with inputs but no expectations -> CODE (programmatically generated)

        Inference can be overridden by providing explicit source information.

        Note that trace inputs (from List[Trace] or pd.DataFrame of Trace data) will
        always be inferred as a trace source type when processing trace records.

        Args:
            record_dicts: List of record dictionaries to process (modified in place)
        """
        for record in record_dicts:
            if "source" in record:
                continue

            if "expectations" in record and record["expectations"]:
                record["source"] = {
                    "source_type": DatasetRecordSourceType.HUMAN.value,
                    "source_data": {},
                }
            elif "inputs" in record and "expectations" not in record:
                record["source"] = {
                    "source_type": DatasetRecordSourceType.CODE.value,
                    "source_data": {},
                }

    def to_df(self) -> "pd.DataFrame":
        """
        Convert dataset records to a pandas DataFrame.

        This method triggers lazy loading of records if they haven't been loaded yet.

        Returns:
            DataFrame with columns for inputs, outputs, expectations, tags, and metadata
        """
        import pandas as pd

        records = self.records

        if not records:
            return pd.DataFrame(
                columns=[
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
            )

        data = [
            {
                "inputs": record.inputs,
                "outputs": record.outputs,
                "expectations": record.expectations,
                "tags": record.tags,
                "source_type": record.source_type,
                "source_id": record.source_id,
                "source": record.source,
                "created_time": record.created_time,
                "dataset_record_id": record.dataset_record_id,
            }
            for record in records
        ]

        return pd.DataFrame(data)

    def to_proto(self) -> ProtoDataset:
        """Convert to protobuf representation."""
        proto = ProtoDataset()

        proto.dataset_id = self.dataset_id
        proto.name = self.name
        if self.tags is not None:
            proto.tags = json.dumps(self.tags)
        if self.schema is not None:
            proto.schema = self.schema
        if self.profile is not None:
            proto.profile = self.profile
        proto.digest = self.digest
        proto.created_time = self.created_time
        proto.last_update_time = self.last_update_time
        if self.created_by is not None:
            proto.created_by = self.created_by
        if self.last_updated_by is not None:
            proto.last_updated_by = self.last_updated_by
        if self._experiment_ids is not None:
            proto.experiment_ids.extend(self._experiment_ids)

        return proto

    @classmethod
    def from_proto(cls, proto: ProtoDataset) -> "EvaluationDataset":
        """Create instance from protobuf representation."""
        tags = None
        if proto.HasField("tags"):
            tags = json.loads(proto.tags)

        dataset = cls(
            dataset_id=proto.dataset_id,
            name=proto.name,
            digest=proto.digest,
            created_time=proto.created_time,
            last_update_time=proto.last_update_time,
            tags=tags,
            schema=proto.schema if proto.HasField("schema") else None,
            profile=proto.profile if proto.HasField("profile") else None,
            created_by=proto.created_by if proto.HasField("created_by") else None,
            last_updated_by=proto.last_updated_by if proto.HasField("last_updated_by") else None,
        )
        if proto.experiment_ids:
            dataset._experiment_ids = list(proto.experiment_ids)
        return dataset

    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary representation."""
        result = super().to_dict()

        result.update(
            {
                "dataset_id": self.dataset_id,
                "tags": self.tags,
                "schema": self.schema,
                "profile": self.profile,
                "created_time": self.created_time,
                "last_update_time": self.last_update_time,
                "created_by": self.created_by,
                "last_updated_by": self.last_updated_by,
                "experiment_ids": self.experiment_ids,
            }
        )

        result["records"] = [record.to_dict() for record in self.records]

        return result

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "EvaluationDataset":
        """Create instance from dictionary representation."""
        if "dataset_id" not in data:
            raise ValueError("dataset_id is required")
        if "name" not in data:
            raise ValueError("name is required")
        if "digest" not in data:
            raise ValueError("digest is required")
        if "created_time" not in data:
            raise ValueError("created_time is required")
        if "last_update_time" not in data:
            raise ValueError("last_update_time is required")

        dataset = cls(
            dataset_id=data["dataset_id"],
            name=data["name"],
            digest=data["digest"],
            created_time=data["created_time"],
            last_update_time=data["last_update_time"],
            tags=data.get("tags"),
            schema=data.get("schema"),
            profile=data.get("profile"),
            created_by=data.get("created_by"),
            last_updated_by=data.get("last_updated_by"),
        )
        if "experiment_ids" in data:
            dataset._experiment_ids = data["experiment_ids"]

        if "records" in data:
            dataset._records = [
                DatasetRecord.from_dict(record_data) for record_data in data["records"]
            ]

        return dataset
```

--------------------------------------------------------------------------------

---[FILE: experiment.py]---
Location: mlflow-master/mlflow/entities/experiment.py

```python
from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.entities.experiment_tag import ExperimentTag
from mlflow.protos.service_pb2 import Experiment as ProtoExperiment
from mlflow.protos.service_pb2 import ExperimentTag as ProtoExperimentTag


class Experiment(_MlflowObject):
    """
    Experiment object.
    """

    DEFAULT_EXPERIMENT_NAME = "Default"

    def __init__(
        self,
        experiment_id,
        name,
        artifact_location,
        lifecycle_stage,
        tags=None,
        creation_time=None,
        last_update_time=None,
    ):
        super().__init__()
        self._experiment_id = experiment_id
        self._name = name
        self._artifact_location = artifact_location
        self._lifecycle_stage = lifecycle_stage
        self._tags = {tag.key: tag.value for tag in (tags or [])}
        self._creation_time = creation_time
        self._last_update_time = last_update_time

    @property
    def experiment_id(self):
        """String ID of the experiment."""
        return self._experiment_id

    @property
    def name(self):
        """String name of the experiment."""
        return self._name

    def _set_name(self, new_name):
        self._name = new_name

    @property
    def artifact_location(self):
        """String corresponding to the root artifact URI for the experiment."""
        return self._artifact_location

    @property
    def lifecycle_stage(self):
        """Lifecycle stage of the experiment. Can either be 'active' or 'deleted'."""
        return self._lifecycle_stage

    @property
    def tags(self):
        """Tags that have been set on the experiment."""
        return self._tags

    def _add_tag(self, tag):
        self._tags[tag.key] = tag.value

    @property
    def creation_time(self):
        return self._creation_time

    def _set_creation_time(self, creation_time):
        self._creation_time = creation_time

    @property
    def last_update_time(self):
        return self._last_update_time

    def _set_last_update_time(self, last_update_time):
        self._last_update_time = last_update_time

    @classmethod
    def from_proto(cls, proto):
        experiment = cls(
            proto.experiment_id,
            proto.name,
            proto.artifact_location,
            proto.lifecycle_stage,
            # `creation_time` and `last_update_time` were added in MLflow 1.29.0. Experiments
            # created before this version don't have these fields and `proto.creation_time` and
            # `proto.last_update_time` default to 0. We should only set `creation_time` and
            # `last_update_time` if they are non-zero.
            creation_time=proto.creation_time or None,
            last_update_time=proto.last_update_time or None,
        )
        for proto_tag in proto.tags:
            experiment._add_tag(ExperimentTag.from_proto(proto_tag))
        return experiment

    def to_proto(self):
        experiment = ProtoExperiment()
        experiment.experiment_id = self.experiment_id
        experiment.name = self.name
        experiment.artifact_location = self.artifact_location
        experiment.lifecycle_stage = self.lifecycle_stage
        if self.creation_time:
            experiment.creation_time = self.creation_time
        if self.last_update_time:
            experiment.last_update_time = self.last_update_time
        experiment.tags.extend(
            [ProtoExperimentTag(key=key, value=val) for key, val in self._tags.items()]
        )
        return experiment
```

--------------------------------------------------------------------------------

---[FILE: experiment_tag.py]---
Location: mlflow-master/mlflow/entities/experiment_tag.py

```python
from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.protos.service_pb2 import ExperimentTag as ProtoExperimentTag


class ExperimentTag(_MlflowObject):
    """Tag object associated with an experiment."""

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

    def to_proto(self):
        param = ProtoExperimentTag()
        param.key = self.key
        param.value = self.value
        return param

    @classmethod
    def from_proto(cls, proto):
        return cls(proto.key, proto.value)
```

--------------------------------------------------------------------------------

---[FILE: file_info.py]---
Location: mlflow-master/mlflow/entities/file_info.py

```python
from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.protos.service_pb2 import FileInfo as ProtoFileInfo


class FileInfo(_MlflowObject):
    """
    Metadata about a file or directory.
    """

    def __init__(self, path, is_dir, file_size):
        self._path = path
        self._is_dir = is_dir
        self._bytes = file_size

    def __eq__(self, other):
        if type(other) is type(self):
            return self.__dict__ == other.__dict__
        return False

    @property
    def path(self):
        """String path of the file or directory."""
        return self._path

    @property
    def is_dir(self):
        """Whether the FileInfo corresponds to a directory."""
        return self._is_dir

    @property
    def file_size(self):
        """Size of the file or directory. If the FileInfo is a directory, returns None."""
        return self._bytes

    def to_proto(self):
        proto = ProtoFileInfo()
        proto.path = self.path
        proto.is_dir = self.is_dir
        if self.file_size:
            proto.file_size = self.file_size
        return proto

    @classmethod
    def from_proto(cls, proto):
        return cls(proto.path, proto.is_dir, proto.file_size)
```

--------------------------------------------------------------------------------

---[FILE: gateway_endpoint.py]---
Location: mlflow-master/mlflow/entities/gateway_endpoint.py

```python
from dataclasses import dataclass, field
from enum import Enum

from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.protos.service_pb2 import (
    GatewayEndpoint as ProtoGatewayEndpoint,
)
from mlflow.protos.service_pb2 import (
    GatewayEndpointBinding as ProtoGatewayEndpointBinding,
)
from mlflow.protos.service_pb2 import (
    GatewayEndpointModelMapping as ProtoGatewayEndpointModelMapping,
)
from mlflow.protos.service_pb2 import (
    GatewayModelDefinition as ProtoGatewayModelDefinition,
)


class GatewayResourceType(str, Enum):
    """Valid MLflow resource types that can use gateway endpoints."""

    SCORER_JOB = "scorer_job"


@dataclass
class GatewayModelDefinition(_MlflowObject):
    """
    Represents a reusable LLM model configuration.

    Model definitions can be shared across multiple endpoints, enabling
    centralized management of model configurations and API credentials.

    Args:
        model_definition_id: Unique identifier for this model definition.
        name: User-friendly name for identification and reuse.
        secret_id: ID of the secret containing authentication credentials (None if orphaned).
        secret_name: Name of the secret for display/reference purposes (None if orphaned).
        provider: LLM provider (e.g., "openai", "anthropic", "cohere", "bedrock").
        model_name: Provider-specific model identifier (e.g., "gpt-4o", "claude-3-5-sonnet").
        created_at: Timestamp (milliseconds) when the model definition was created.
        last_updated_at: Timestamp (milliseconds) when the model definition was last updated.
        created_by: User ID who created the model definition.
        last_updated_by: User ID who last updated the model definition.
    """

    model_definition_id: str
    name: str
    secret_id: str | None
    secret_name: str | None
    provider: str
    model_name: str
    created_at: int
    last_updated_at: int
    created_by: str | None = None
    last_updated_by: str | None = None

    def to_proto(self):
        proto = ProtoGatewayModelDefinition()
        proto.model_definition_id = self.model_definition_id
        proto.name = self.name
        if self.secret_id is not None:
            proto.secret_id = self.secret_id
        if self.secret_name is not None:
            proto.secret_name = self.secret_name
        proto.provider = self.provider
        proto.model_name = self.model_name
        proto.created_at = self.created_at
        proto.last_updated_at = self.last_updated_at
        if self.created_by is not None:
            proto.created_by = self.created_by
        if self.last_updated_by is not None:
            proto.last_updated_by = self.last_updated_by
        return proto

    @classmethod
    def from_proto(cls, proto):
        return cls(
            model_definition_id=proto.model_definition_id,
            name=proto.name,
            secret_id=proto.secret_id or None,
            secret_name=proto.secret_name or None,
            provider=proto.provider,
            model_name=proto.model_name,
            created_at=proto.created_at,
            last_updated_at=proto.last_updated_at,
            created_by=proto.created_by or None,
            last_updated_by=proto.last_updated_by or None,
        )


@dataclass
class GatewayEndpointModelMapping(_MlflowObject):
    """
    Represents a mapping between an endpoint and a model definition.

    This is a junction entity that links endpoints to model definitions,
    enabling many-to-many relationships and traffic routing configuration.

    Args:
        mapping_id: Unique identifier for this mapping.
        endpoint_id: ID of the endpoint.
        model_definition_id: ID of the model definition.
        model_definition: The full model definition (populated via JOIN).
        weight: Routing weight for traffic distribution (default 1).
        created_at: Timestamp (milliseconds) when the mapping was created.
        created_by: User ID who created the mapping.
    """

    mapping_id: str
    endpoint_id: str
    model_definition_id: str
    model_definition: GatewayModelDefinition | None
    weight: float
    created_at: int
    created_by: str | None = None

    def to_proto(self):
        proto = ProtoGatewayEndpointModelMapping()
        proto.mapping_id = self.mapping_id
        proto.endpoint_id = self.endpoint_id
        proto.model_definition_id = self.model_definition_id
        if self.model_definition is not None:
            proto.model_definition.CopyFrom(self.model_definition.to_proto())
        proto.weight = self.weight
        proto.created_at = self.created_at
        if self.created_by is not None:
            proto.created_by = self.created_by
        return proto

    @classmethod
    def from_proto(cls, proto):
        model_def = None
        if proto.HasField("model_definition"):
            model_def = GatewayModelDefinition.from_proto(proto.model_definition)
        return cls(
            mapping_id=proto.mapping_id,
            endpoint_id=proto.endpoint_id,
            model_definition_id=proto.model_definition_id,
            model_definition=model_def,
            weight=proto.weight,
            created_at=proto.created_at,
            created_by=proto.created_by or None,
        )


@dataclass
class GatewayEndpointTag(_MlflowObject):
    """
    Represents a tag (key-value pair) associated with a gateway endpoint.

    Tags are used for categorization, filtering, and metadata storage for endpoints.

    Args:
        key: Tag key (max 250 characters).
        value: Tag value (max 5000 characters, can be None).
    """

    key: str
    value: str | None

    def to_proto(self):
        from mlflow.protos.service_pb2 import GatewayEndpointTag as ProtoGatewayEndpointTag

        proto = ProtoGatewayEndpointTag()
        proto.key = self.key
        if self.value is not None:
            proto.value = self.value
        return proto

    @classmethod
    def from_proto(cls, proto):
        return cls(
            key=proto.key,
            value=proto.value or None,
        )


@dataclass
class GatewayEndpoint(_MlflowObject):
    """
    Represents an LLM gateway endpoint with its associated model configurations.

    Args:
        endpoint_id: Unique identifier for this endpoint.
        name: User-friendly name for the endpoint (optional).
        created_at: Timestamp (milliseconds) when the endpoint was created.
        last_updated_at: Timestamp (milliseconds) when the endpoint was last updated.
        model_mappings: List of model mappings bound to this endpoint.
        tags: List of tags associated with this endpoint.
        created_by: User ID who created the endpoint.
        last_updated_by: User ID who last updated the endpoint.
    """

    endpoint_id: str
    name: str | None
    created_at: int
    last_updated_at: int
    model_mappings: list[GatewayEndpointModelMapping] = field(default_factory=list)
    tags: list["GatewayEndpointTag"] = field(default_factory=list)
    created_by: str | None = None
    last_updated_by: str | None = None

    def to_proto(self):
        proto = ProtoGatewayEndpoint()
        proto.endpoint_id = self.endpoint_id
        proto.name = self.name or ""
        proto.created_at = self.created_at
        proto.last_updated_at = self.last_updated_at
        proto.model_mappings.extend([m.to_proto() for m in self.model_mappings])
        proto.tags.extend([t.to_proto() for t in self.tags])
        proto.created_by = self.created_by or ""
        proto.last_updated_by = self.last_updated_by or ""
        return proto

    @classmethod
    def from_proto(cls, proto):
        return cls(
            endpoint_id=proto.endpoint_id,
            name=proto.name or None,
            created_at=proto.created_at,
            last_updated_at=proto.last_updated_at,
            model_mappings=[
                GatewayEndpointModelMapping.from_proto(m) for m in proto.model_mappings
            ],
            tags=[GatewayEndpointTag.from_proto(t) for t in proto.tags],
            created_by=proto.created_by or None,
            last_updated_by=proto.last_updated_by or None,
        )


@dataclass
class GatewayEndpointBinding(_MlflowObject):
    """
    Represents a binding between an endpoint and an MLflow resource.

    Bindings track which MLflow resources (e.g., scorer jobs) are configured to use
    which endpoints. The composite key (endpoint_id, resource_type, resource_id) uniquely
    identifies each binding.

    Args:
        endpoint_id: ID of the endpoint this binding references.
        resource_type: Type of MLflow resource (e.g., "scorer_job").
        resource_id: ID of the specific resource instance.
        created_at: Timestamp (milliseconds) when the binding was created.
        last_updated_at: Timestamp (milliseconds) when the binding was last updated.
        created_by: User ID who created the binding.
        last_updated_by: User ID who last updated the binding.
    """

    endpoint_id: str
    resource_type: GatewayResourceType
    resource_id: str
    created_at: int
    last_updated_at: int
    created_by: str | None = None
    last_updated_by: str | None = None

    def to_proto(self):
        proto = ProtoGatewayEndpointBinding()
        proto.endpoint_id = self.endpoint_id
        proto.resource_type = self.resource_type.value
        proto.resource_id = self.resource_id
        proto.created_at = self.created_at
        proto.last_updated_at = self.last_updated_at
        if self.created_by is not None:
            proto.created_by = self.created_by
        if self.last_updated_by is not None:
            proto.last_updated_by = self.last_updated_by
        return proto

    @classmethod
    def from_proto(cls, proto):
        return cls(
            endpoint_id=proto.endpoint_id,
            resource_type=GatewayResourceType(proto.resource_type),
            resource_id=proto.resource_id,
            created_at=proto.created_at,
            last_updated_at=proto.last_updated_at,
            created_by=proto.created_by or None,
            last_updated_by=proto.last_updated_by or None,
        )
```

--------------------------------------------------------------------------------

---[FILE: gateway_secrets.py]---
Location: mlflow-master/mlflow/entities/gateway_secrets.py

```python
import json
from dataclasses import dataclass
from typing import Any

from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.protos.service_pb2 import GatewaySecretInfo as ProtoGatewaySecretInfo


@dataclass(frozen=True)
class GatewaySecretInfo(_MlflowObject):
    """
    Metadata about an encrypted secret for authenticating with LLM providers.

    This entity contains metadata, masked value, and auth configuration of a secret,
    but NOT the decrypted secret value itself. The actual secret is stored encrypted
    using envelope encryption (DEK encrypted by KEK).

    NB: secret_id and secret_name are IMMUTABLE after creation. They are used as AAD
    (Additional Authenticated Data) during AES-GCM encryption. If either is modified
    in the database, decryption will fail. To "rename" a secret, create a new one with
    the desired name and delete the old one. See mlflow/utils/crypto.py:_create_aad().

    This dataclass is frozen (immutable) because:
    1. It represents a read-only view of database state
    2. secret_id and secret_name must never be modified (used in encryption AAD)
    3. Database triggers also enforce immutability of these fields

    Args:
        secret_id: Unique identifier for this secret. IMMUTABLE - used in AAD for encryption.
        secret_name: User-friendly name for the secret. IMMUTABLE - used in AAD for encryption.
        masked_value: Masked version of the secret for display (e.g., "sk-...xyz123").
        created_at: Timestamp (milliseconds) when the secret was created.
        last_updated_at: Timestamp (milliseconds) when the secret was last updated.
        provider: LLM provider this secret is for (e.g., "openai", "anthropic").
        auth_config: Provider-specific configuration (e.g., region, project_id).
            This is non-sensitive metadata useful for UI disambiguation.
        created_by: User ID who created the secret.
        last_updated_by: User ID who last updated the secret.
    """

    secret_id: str
    secret_name: str
    masked_value: str
    created_at: int
    last_updated_at: int
    provider: str | None = None
    auth_config: dict[str, Any] | None = None
    created_by: str | None = None
    last_updated_by: str | None = None

    def to_proto(self):
        proto = ProtoGatewaySecretInfo()
        proto.secret_id = self.secret_id
        proto.secret_name = self.secret_name
        proto.masked_value = self.masked_value
        proto.created_at = self.created_at
        proto.last_updated_at = self.last_updated_at
        if self.provider is not None:
            proto.provider = self.provider
        if self.auth_config is not None:
            proto.auth_config_json = json.dumps(self.auth_config)
        if self.created_by is not None:
            proto.created_by = self.created_by
        if self.last_updated_by is not None:
            proto.last_updated_by = self.last_updated_by
        return proto

    @classmethod
    def from_proto(cls, proto):
        auth_config = None
        if proto.auth_config_json:
            auth_config = json.loads(proto.auth_config_json)
        return cls(
            secret_id=proto.secret_id,
            secret_name=proto.secret_name,
            masked_value=proto.masked_value,
            created_at=proto.created_at,
            last_updated_at=proto.last_updated_at,
            provider=proto.provider or None,
            auth_config=auth_config,
            created_by=proto.created_by or None,
            last_updated_by=proto.last_updated_by or None,
        )
```

--------------------------------------------------------------------------------

---[FILE: input_tag.py]---
Location: mlflow-master/mlflow/entities/input_tag.py

```python
from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.protos.service_pb2 import InputTag as ProtoInputTag


class InputTag(_MlflowObject):
    """Input tag object associated with a dataset."""

    def __init__(self, key: str, value: str) -> None:
        self._key = key
        self._value = value

    def __eq__(self, other: _MlflowObject) -> bool:
        if type(other) is type(self):
            return self.__dict__ == other.__dict__
        return False

    @property
    def key(self) -> str:
        """String name of the input tag."""
        return self._key

    @property
    def value(self) -> str:
        """String value of the input tag."""
        return self._value

    def to_proto(self):
        tag = ProtoInputTag()
        tag.key = self.key
        tag.value = self.value
        return tag

    @classmethod
    def from_proto(cls, proto):
        return cls(proto.key, proto.value)
```

--------------------------------------------------------------------------------

---[FILE: lifecycle_stage.py]---
Location: mlflow-master/mlflow/entities/lifecycle_stage.py

```python
from mlflow.entities.view_type import ViewType
from mlflow.exceptions import MlflowException


class LifecycleStage:
    ACTIVE = "active"
    DELETED = "deleted"
    _VALID_STAGES = {ACTIVE, DELETED}

    @classmethod
    def view_type_to_stages(cls, view_type=ViewType.ALL):
        stages = []
        if view_type in (ViewType.ACTIVE_ONLY, ViewType.ALL):
            stages.append(cls.ACTIVE)
        if view_type in (ViewType.DELETED_ONLY, ViewType.ALL):
            stages.append(cls.DELETED)
        return stages

    @classmethod
    def is_valid(cls, lifecycle_stage):
        return lifecycle_stage in cls._VALID_STAGES

    @classmethod
    def matches_view_type(cls, view_type, lifecycle_stage):
        if not cls.is_valid(lifecycle_stage):
            raise MlflowException(f"Invalid lifecycle stage '{lifecycle_stage}'")

        if view_type == ViewType.ALL:
            return True
        elif view_type == ViewType.ACTIVE_ONLY:
            return lifecycle_stage == LifecycleStage.ACTIVE
        elif view_type == ViewType.DELETED_ONLY:
            return lifecycle_stage == LifecycleStage.DELETED
        else:
            raise MlflowException(f"Invalid view type '{view_type}'")
```

--------------------------------------------------------------------------------

````
