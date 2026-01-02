---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:53Z
part: 249
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 249 of 991)

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

---[FILE: assessment_source.py]---
Location: mlflow-master/mlflow/entities/assessment_source.py

```python
import warnings
from dataclasses import asdict, dataclass
from typing import Any

from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.exceptions import MlflowException
from mlflow.protos.assessments_pb2 import AssessmentSource as ProtoAssessmentSource
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE


@dataclass
class AssessmentSource(_MlflowObject):
    """
    Source of an assessment (human, LLM as a judge with GPT-4, etc).

    When recording an assessment, MLflow mandates providing a source information
    to keep track of how the assessment is conducted.

    Args:
        source_type: The type of the assessment source. Must be one of the values in
            the AssessmentSourceType enum or an instance of the enumerator value.
        source_id: An identifier for the source, e.g. user ID or LLM judge ID. If not
            provided, the default value "default" is used.

    Note:

    The legacy AssessmentSourceType "AI_JUDGE" is deprecated and will be resolved as
    "LLM_JUDGE". You will receive a warning if using this deprecated value. This legacy
    term will be removed in a future version of MLflow.

    Example:

    Human annotation can be represented with a source type of "HUMAN":

    .. code-block:: python

        import mlflow
        from mlflow.entities.assessment import AssessmentSource, AssessmentSourceType

        source = AssessmentSource(
            source_type=AssessmentSourceType.HUMAN,  # or "HUMAN"
            source_id="bob@example.com",
        )

    LLM-as-a-judge can be represented with a source type of "LLM_JUDGE":

    .. code-block:: python

        import mlflow
        from mlflow.entities.assessment import AssessmentSource, AssessmentSourceType

        source = AssessmentSource(
            source_type=AssessmentSourceType.LLM_JUDGE,  # or "LLM_JUDGE"
            source_id="gpt-4o-mini",
        )

    Heuristic evaluation can be represented with a source type of "CODE":

    .. code-block:: python

        import mlflow
        from mlflow.entities.assessment import AssessmentSource, AssessmentSourceType

        source = AssessmentSource(
            source_type=AssessmentSourceType.CODE,  # or "CODE"
            source_id="repo/evaluation_script.py",
        )

    To record more context about the assessment, you can use the `metadata` field of
    the assessment logging APIs as well.
    """

    source_type: str
    source_id: str = "default"

    def __post_init__(self):
        # Perform the standardization on source_type after initialization
        self.source_type = AssessmentSourceType._standardize(self.source_type)

    def to_dictionary(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dictionary(cls, source_dict: dict[str, Any]) -> "AssessmentSource":
        return cls(**source_dict)

    def to_proto(self):
        source = ProtoAssessmentSource()
        source.source_type = ProtoAssessmentSource.SourceType.Value(self.source_type)
        if self.source_id is not None:
            source.source_id = self.source_id
        return source

    @classmethod
    def from_proto(cls, proto):
        return AssessmentSource(
            source_type=AssessmentSourceType.from_proto(proto.source_type),
            source_id=proto.source_id or None,
        )


class AssessmentSourceType:
    """
    Enumeration and validator for assessment source types.

    This class provides constants for valid assessment source types and handles validation
    and standardization of source type values. It supports both direct constant access and
    instance creation with string validation.

    The class automatically handles:
    - Case-insensitive string inputs (converts to uppercase)
    - Deprecation warnings for legacy values (AI_JUDGE → LLM_JUDGE)
    - Validation of source type values

    Available source types:
        - HUMAN: Assessment performed by a human evaluator
        - LLM_JUDGE: Assessment performed by an LLM-as-a-judge (e.g., GPT-4)
        - CODE: Assessment performed by deterministic code/heuristics
        - SOURCE_TYPE_UNSPECIFIED: Default when source type is not specified

    Note:
        The legacy "AI_JUDGE" type is deprecated and automatically converted to "LLM_JUDGE"
        with a deprecation warning. This ensures backward compatibility while encouraging
        migration to the new terminology.

    Example:
        Using class constants directly:

        .. code-block:: python

            from mlflow.entities.assessment import AssessmentSource, AssessmentSourceType

            # Direct constant usage
            source = AssessmentSource(source_type=AssessmentSourceType.LLM_JUDGE, source_id="gpt-4")

        String validation through instance creation:

        .. code-block:: python

            # String input - case insensitive
            source = AssessmentSource(
                source_type="llm_judge",  # Will be standardized to "LLM_JUDGE"
                source_id="gpt-4",
            )

            # Deprecated value - triggers warning
            source = AssessmentSource(
                source_type="AI_JUDGE",  # Warning: converts to "LLM_JUDGE"
                source_id="gpt-4",
            )
    """

    SOURCE_TYPE_UNSPECIFIED = "SOURCE_TYPE_UNSPECIFIED"
    LLM_JUDGE = "LLM_JUDGE"
    AI_JUDGE = "AI_JUDGE"  # Deprecated, use LLM_JUDGE instead
    HUMAN = "HUMAN"
    CODE = "CODE"
    _SOURCE_TYPES = [SOURCE_TYPE_UNSPECIFIED, LLM_JUDGE, HUMAN, CODE]

    def __init__(self, source_type: str):
        self._source_type = AssessmentSourceType._parse(source_type)

    @staticmethod
    def _parse(source_type: str) -> str:
        source_type = source_type.upper()

        # Backwards compatibility shim for mlflow.evaluations.AssessmentSourceType
        if source_type == AssessmentSourceType.AI_JUDGE:
            warnings.warn(
                "AI_JUDGE is deprecated. Use LLM_JUDGE instead.",
                FutureWarning,
            )
            source_type = AssessmentSourceType.LLM_JUDGE

        if source_type not in AssessmentSourceType._SOURCE_TYPES:
            raise MlflowException(
                message=(
                    f"Invalid assessment source type: {source_type}. "
                    f"Valid source types: {AssessmentSourceType._SOURCE_TYPES}"
                ),
                error_code=INVALID_PARAMETER_VALUE,
            )
        return source_type

    def __str__(self):
        return self._source_type

    @staticmethod
    def _standardize(source_type: str) -> str:
        return str(AssessmentSourceType(source_type))

    @classmethod
    def from_proto(cls, proto_source_type) -> str:
        return ProtoAssessmentSource.SourceType.Name(proto_source_type)
```

--------------------------------------------------------------------------------

---[FILE: dataset.py]---
Location: mlflow-master/mlflow/entities/dataset.py

```python
from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.protos.service_pb2 import Dataset as ProtoDataset


class Dataset(_MlflowObject):
    """Dataset object associated with an experiment."""

    def __init__(
        self,
        name: str,
        digest: str,
        source_type: str,
        source: str,
        schema: str | None = None,
        profile: str | None = None,
    ) -> None:
        self._name = name
        self._digest = digest
        self._source_type = source_type
        self._source = source
        self._schema = schema
        self._profile = profile

    def __eq__(self, other: _MlflowObject) -> bool:
        if type(other) is type(self):
            return self.__dict__ == other.__dict__
        return False

    @property
    def name(self) -> str:
        """String name of the dataset."""
        return self._name

    @property
    def digest(self) -> str:
        """String digest of the dataset."""
        return self._digest

    @property
    def source_type(self) -> str:
        """String source_type of the dataset."""
        return self._source_type

    @property
    def source(self) -> str:
        """String source of the dataset."""
        return self._source

    @property
    def schema(self) -> str:
        """String schema of the dataset."""
        return self._schema

    @property
    def profile(self) -> str:
        """String profile of the dataset."""
        return self._profile

    def to_proto(self):
        dataset = ProtoDataset()
        dataset.name = self.name
        dataset.digest = self.digest
        dataset.source_type = self.source_type
        dataset.source = self.source
        if self.schema:
            dataset.schema = self.schema
        if self.profile:
            dataset.profile = self.profile
        return dataset

    @classmethod
    def from_proto(cls, proto):
        return cls(
            proto.name,
            proto.digest,
            proto.source_type,
            proto.source,
            proto.schema if proto.HasField("schema") else None,
            proto.profile if proto.HasField("profile") else None,
        )

    def to_dictionary(self):
        return {
            "name": self.name,
            "digest": self.digest,
            "source_type": self.source_type,
            "source": self.source,
            "schema": self.schema,
            "profile": self.profile,
        }
```

--------------------------------------------------------------------------------

---[FILE: dataset_input.py]---
Location: mlflow-master/mlflow/entities/dataset_input.py

```python
from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.entities.dataset import Dataset
from mlflow.entities.input_tag import InputTag
from mlflow.protos.service_pb2 import DatasetInput as ProtoDatasetInput


class DatasetInput(_MlflowObject):
    """DatasetInput object associated with an experiment."""

    def __init__(self, dataset: Dataset, tags: list[InputTag] | None = None) -> None:
        self._dataset = dataset
        self._tags = tags or []

    def __eq__(self, other: _MlflowObject) -> bool:
        if type(other) is type(self):
            return self.__dict__ == other.__dict__
        return False

    def _add_tag(self, tag: InputTag) -> None:
        self._tags.append(tag)

    @property
    def tags(self) -> list[InputTag]:
        """Array of input tags."""
        return self._tags

    @property
    def dataset(self) -> Dataset:
        """Dataset."""
        return self._dataset

    def to_proto(self):
        dataset_input = ProtoDatasetInput()
        dataset_input.tags.extend([tag.to_proto() for tag in self.tags])
        dataset_input.dataset.MergeFrom(self.dataset.to_proto())
        return dataset_input

    @classmethod
    def from_proto(cls, proto):
        dataset_input = cls(Dataset.from_proto(proto.dataset))
        for input_tag in proto.tags:
            dataset_input._add_tag(InputTag.from_proto(input_tag))
        return dataset_input

    def to_dictionary(self):
        return {
            "dataset": self.dataset.to_dictionary(),
            "tags": {tag.key: tag.value for tag in self.tags},
        }
```

--------------------------------------------------------------------------------

---[FILE: dataset_record.py]---
Location: mlflow-master/mlflow/entities/dataset_record.py

```python
from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any

from google.protobuf.json_format import MessageToDict

from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.entities.dataset_record_source import DatasetRecordSource, DatasetRecordSourceType
from mlflow.protos.datasets_pb2 import DatasetRecord as ProtoDatasetRecord
from mlflow.protos.datasets_pb2 import DatasetRecordSource as ProtoDatasetRecordSource

# Reserved key for wrapping non-dict outputs when storing in SQL database
DATASET_RECORD_WRAPPED_OUTPUT_KEY = "mlflow_wrapped"


@dataclass
class DatasetRecord(_MlflowObject):
    """Represents a single record in an evaluation dataset.

    A DatasetRecord contains the input data, expected outputs (ground truth),
    and metadata for a single evaluation example. Records are immutable once
    created and are uniquely identified by their dataset_record_id.
    """

    dataset_id: str
    inputs: dict[str, Any]
    dataset_record_id: str
    created_time: int
    last_update_time: int
    outputs: dict[str, Any] | None = None
    expectations: dict[str, Any] | None = None
    tags: dict[str, str] | None = None
    source: DatasetRecordSource | None = None
    source_id: str | None = None
    source_type: str | None = None
    created_by: str | None = None
    last_updated_by: str | None = None

    def __post_init__(self):
        if self.inputs is None:
            raise ValueError("inputs must be provided")

        if self.tags is None:
            self.tags = {}

        if self.source and isinstance(self.source, DatasetRecordSource):
            if not self.source_id:
                if self.source.source_type == DatasetRecordSourceType.TRACE:
                    self.source_id = self.source.source_data.get("trace_id")
                else:
                    self.source_id = self.source.source_data.get("source_id")
            if not self.source_type:
                self.source_type = self.source.source_type.value

    def to_proto(self) -> ProtoDatasetRecord:
        proto = ProtoDatasetRecord()

        proto.dataset_record_id = self.dataset_record_id
        proto.dataset_id = self.dataset_id
        proto.inputs = json.dumps(self.inputs)
        proto.created_time = self.created_time
        proto.last_update_time = self.last_update_time
        if self.outputs is not None:
            proto.outputs = json.dumps(self.outputs)
        if self.expectations is not None:
            proto.expectations = json.dumps(self.expectations)
        if self.tags is not None:
            proto.tags = json.dumps(self.tags)
        if self.source is not None:
            proto.source = json.dumps(self.source.to_dict())
        if self.source_id is not None:
            proto.source_id = self.source_id
        if self.source_type is not None:
            proto.source_type = ProtoDatasetRecordSource.SourceType.Value(self.source_type)
        if self.created_by is not None:
            proto.created_by = self.created_by
        if self.last_updated_by is not None:
            proto.last_updated_by = self.last_updated_by

        return proto

    @classmethod
    def from_proto(cls, proto: ProtoDatasetRecord) -> "DatasetRecord":
        inputs = json.loads(proto.inputs) if proto.HasField("inputs") else {}
        outputs = json.loads(proto.outputs) if proto.HasField("outputs") else None
        expectations = json.loads(proto.expectations) if proto.HasField("expectations") else None
        tags = json.loads(proto.tags) if proto.HasField("tags") else None

        source = None
        if proto.HasField("source"):
            source_dict = json.loads(proto.source)
            source = DatasetRecordSource.from_dict(source_dict)

        return cls(
            dataset_id=proto.dataset_id,
            inputs=inputs,
            dataset_record_id=proto.dataset_record_id,
            created_time=proto.created_time,
            last_update_time=proto.last_update_time,
            outputs=outputs,
            expectations=expectations,
            tags=tags,
            source=source,
            source_id=proto.source_id if proto.HasField("source_id") else None,
            source_type=DatasetRecordSourceType.from_proto(proto.source_type)
            if proto.HasField("source_type")
            else None,
            created_by=proto.created_by if proto.HasField("created_by") else None,
            last_updated_by=proto.last_updated_by if proto.HasField("last_updated_by") else None,
        )

    def to_dict(self) -> dict[str, Any]:
        d = MessageToDict(
            self.to_proto(),
            preserving_proto_field_name=True,
        )
        d["inputs"] = json.loads(d["inputs"])
        if "outputs" in d:
            d["outputs"] = json.loads(d["outputs"])
        if "expectations" in d:
            d["expectations"] = json.loads(d["expectations"])
        if "tags" in d:
            d["tags"] = json.loads(d["tags"])
        if "source" in d:
            d["source"] = json.loads(d["source"])
        d["created_time"] = self.created_time
        d["last_update_time"] = self.last_update_time
        return d

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "DatasetRecord":
        # Validate required fields
        if "dataset_id" not in data:
            raise ValueError("dataset_id is required")
        if "dataset_record_id" not in data:
            raise ValueError("dataset_record_id is required")
        if "inputs" not in data:
            raise ValueError("inputs is required")
        if "created_time" not in data:
            raise ValueError("created_time is required")
        if "last_update_time" not in data:
            raise ValueError("last_update_time is required")

        source = None
        if data.get("source"):
            source = DatasetRecordSource.from_dict(data["source"])

        return cls(
            dataset_id=data["dataset_id"],
            inputs=data["inputs"],
            dataset_record_id=data["dataset_record_id"],
            created_time=data["created_time"],
            last_update_time=data["last_update_time"],
            outputs=data.get("outputs"),
            expectations=data.get("expectations"),
            tags=data.get("tags"),
            source=source,
            source_id=data.get("source_id"),
            source_type=data.get("source_type"),
            created_by=data.get("created_by"),
            last_updated_by=data.get("last_updated_by"),
        )

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, DatasetRecord):
            return False
        return (
            self.dataset_record_id == other.dataset_record_id
            and self.dataset_id == other.dataset_id
            and self.inputs == other.inputs
            and self.outputs == other.outputs
            and self.expectations == other.expectations
            and self.tags == other.tags
            and self.source == other.source
            and self.source_id == other.source_id
            and self.source_type == other.source_type
        )
```

--------------------------------------------------------------------------------

---[FILE: dataset_record_source.py]---
Location: mlflow-master/mlflow/entities/dataset_record_source.py

```python
from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from enum import Enum
from typing import Any

from mlflow.entities._mlflow_object import _MlflowObject
from mlflow.exceptions import MlflowException
from mlflow.protos.databricks_pb2 import INVALID_PARAMETER_VALUE
from mlflow.protos.datasets_pb2 import DatasetRecordSource as ProtoDatasetRecordSource


class DatasetRecordSourceType(str, Enum):
    """
    Enumeration for dataset record source types.

    Available source types:
        - UNSPECIFIED: Default when source type is not specified
        - TRACE: Record created from a trace/span
        - HUMAN: Record created from human annotation
        - DOCUMENT: Record created from a document
        - CODE: Record created from code/computation

    Example:
        Using enum values directly:

        .. code-block:: python

            from mlflow.entities import DatasetRecordSource, DatasetRecordSourceType

            # Direct enum usage
            source = DatasetRecordSource(
                source_type=DatasetRecordSourceType.TRACE, source_data={"trace_id": "trace123"}
            )

        String validation through instance creation:

        .. code-block:: python

            # String input - case insensitive
            source = DatasetRecordSource(
                source_type="trace",  # Will be standardized to "TRACE"
                source_data={"trace_id": "trace123"},
            )
    """

    UNSPECIFIED = "UNSPECIFIED"
    TRACE = "TRACE"
    HUMAN = "HUMAN"
    DOCUMENT = "DOCUMENT"
    CODE = "CODE"

    @staticmethod
    def _parse(source_type: str) -> str:
        source_type = source_type.upper()
        try:
            return DatasetRecordSourceType(source_type).value
        except ValueError:
            valid_types = [t.value for t in DatasetRecordSourceType]
            raise MlflowException(
                message=(
                    f"Invalid dataset record source type: {source_type}. "
                    f"Valid source types: {valid_types}"
                ),
                error_code=INVALID_PARAMETER_VALUE,
            )

    @staticmethod
    def _standardize(source_type: str) -> "DatasetRecordSourceType":
        if isinstance(source_type, DatasetRecordSourceType):
            return source_type
        parsed = DatasetRecordSourceType._parse(source_type)
        return DatasetRecordSourceType(parsed)

    @classmethod
    def from_proto(cls, proto_source_type) -> str:
        return ProtoDatasetRecordSource.SourceType.Name(proto_source_type)


@dataclass
class DatasetRecordSource(_MlflowObject):
    """
    Source of a dataset record.

    Args:
        source_type: The type of the dataset record source. Must be one of the values in
            the DatasetRecordSourceType enum or a string that can be parsed to one.
        source_data: Additional source-specific data as a dictionary.
    """

    source_type: DatasetRecordSourceType
    source_data: dict[str, Any] | None = None

    def __post_init__(self):
        self.source_type = DatasetRecordSourceType._standardize(self.source_type)

        if self.source_data is None:
            self.source_data = {}

    def to_proto(self) -> ProtoDatasetRecordSource:
        proto = ProtoDatasetRecordSource()
        proto.source_type = ProtoDatasetRecordSource.SourceType.Value(self.source_type.value)
        if self.source_data:
            proto.source_data = json.dumps(self.source_data)
        return proto

    @classmethod
    def from_proto(cls, proto: ProtoDatasetRecordSource) -> "DatasetRecordSource":
        source_data = json.loads(proto.source_data) if proto.HasField("source_data") else {}
        source_type = (
            DatasetRecordSourceType.from_proto(proto.source_type)
            if proto.HasField("source_type")
            else None
        )

        return cls(source_type=source_type, source_data=source_data)

    def to_dict(self) -> dict[str, Any]:
        d = asdict(self)
        d["source_type"] = self.source_type.value
        return d

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "DatasetRecordSource":
        return cls(**data)
```

--------------------------------------------------------------------------------

---[FILE: dataset_summary.py]---
Location: mlflow-master/mlflow/entities/dataset_summary.py

```python
from mlflow.protos.service_pb2 import DatasetSummary


class _DatasetSummary:
    """
    DatasetSummary object.

    This is used to return a list of dataset summaries across one or more experiments in the UI.
    """

    def __init__(self, experiment_id, name, digest, context):
        self._experiment_id = experiment_id
        self._name = name
        self._digest = digest
        self._context = context

    def __eq__(self, other) -> bool:
        if type(other) is type(self):
            return self.__dict__ == other.__dict__
        return False

    @property
    def experiment_id(self):
        return self._experiment_id

    @property
    def name(self):
        return self._name

    @property
    def digest(self):
        return self._digest

    @property
    def context(self):
        return self._context

    def to_dict(self):
        return {
            "experiment_id": self.experiment_id,
            "name": self.name,
            "digest": self.digest,
            "context": self.context,
        }

    def to_proto(self):
        dataset_summary = DatasetSummary()
        dataset_summary.experiment_id = self.experiment_id
        dataset_summary.name = self.name
        dataset_summary.digest = self.digest
        if self.context:
            dataset_summary.context = self.context
        return dataset_summary

    @classmethod
    def from_proto(cls, proto):
        return cls(
            experiment_id=proto.experiment_id,
            name=proto.name,
            digest=proto.digest,
            context=proto.context,
        )
```

--------------------------------------------------------------------------------

---[FILE: document.py]---
Location: mlflow-master/mlflow/entities/document.py

```python
from copy import deepcopy
from dataclasses import asdict, dataclass, field
from typing import Any


@dataclass
class Document:
    """
    An entity used in MLflow Tracing to represent retrieved documents in a RETRIEVER span.

    Args:
        page_content: The content of the document.
        metadata: A dictionary of metadata associated with the document.
        id: The ID of the document.
    """

    page_content: str
    metadata: dict[str, Any] = field(default_factory=dict)
    id: str | None = None

    @classmethod
    def from_langchain_document(cls, document):
        # older versions of langchain do not have the id attribute
        id = getattr(document, "id", None)

        return cls(
            page_content=document.page_content,
            metadata=deepcopy(document.metadata),
            id=id,
        )

    @classmethod
    def from_llama_index_node_with_score(cls, node_with_score):
        metadata = {
            "score": node_with_score.get_score(),
            # update after setting score so that it can be
            # overridden if the user wishes to do so
            **deepcopy(node_with_score.metadata),
        }

        return cls(
            page_content=node_with_score.get_content(),
            metadata=metadata,
            id=node_with_score.node_id,
        )

    def to_dict(self):
        return asdict(self)
```

--------------------------------------------------------------------------------

---[FILE: entity_type.py]---
Location: mlflow-master/mlflow/entities/entity_type.py

```python
"""
Entity type constants for MLflow's entity_association table.
The entity_association table enables many-to-many relationships between different
MLflow entities. It uses source and destination type/id pairs to create flexible
associations without requiring dedicated junction tables for each relationship type.
"""


class EntityAssociationType:
    """Constants for entity types used in the entity_association table."""

    EXPERIMENT = "experiment"
    EVALUATION_DATASET = "evaluation_dataset"
    RUN = "run"
    MODEL = "model"
    TRACE = "trace"
    PROMPT_VERSION = "prompt_version"
```

--------------------------------------------------------------------------------

````
